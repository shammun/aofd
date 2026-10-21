"""Narration for the AOFD movies: Kokoro TTS, one clip per sentence, captions written from the script (R1 §3.2).

Run with the narration environment (torch lives only there)::

    .venv-tts/Scripts/python.exe tools/tts.py movies/chNN/<slug>/storyboard.yaml --out <dir>
    .venv-tts/Scripts/python.exe tools/tts.py movies/chNN/<slug>/script.md --out <dir> [--fps 30] [--voice af_bella]
    .venv-tts/Scripts/python.exe tools/tts.py --text "One sentence. Two sentences." --out <dir>     # quick test

Input: a storyboard YAML (``scenes: [{id, voiceover}]``) or a ``script.md`` whose ``## <scene_id>`` headings are followed
by the narration paragraphs. Voice and speed come from ``book.yaml -> project.tts`` (af_bella, 1.0) unless given.
The pronunciation lexicon ``movies/lexicon.yaml`` changes the AUDIO text only; captions keep the script text.

Writes into ``--out`` (default: the input's folder ``audio/``, git-ignored; real renders use the G: scratch area):

* ``narration.wav``  — 24 kHz mono, loudness-normalised to −16 LUFS, true peak ≤ −1.5 dBTP (two-pass ffmpeg loudnorm)
* ``captions.vtt``, ``captions.srt`` — cues ≤ 2 lines × 42 characters, 1–7 s; long sentences are split at clause
  boundaries into several cues (the audio stays one clip per sentence); cps > 17 is reported as a warning
* ``timing.json``    — per scene and per sentence: start/end in seconds and frames at ``--fps``, clip durations

Self-check (exit 1 if it fails): sum(clip durations) + gaps == audio length within one frame, and every cue lies
inside the audio. Gaps: 0.35 s between sentences, 0.8 s between scenes, 0.3 s lead-in and tail.
"""
from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
import time
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parents[1]
SR = 24_000
GAP_SENT, GAP_SCENE, LEAD, TAIL = 0.35, 0.8, 0.3, 0.3
MAX_LINE, MAX_LINES, MAX_CPS, CUE_MIN, CUE_MAX = 42, 2, 17.0, 1.0, 7.0


def _yaml(path: Path) -> dict:
    import yaml  # PyYAML is present in .venv-tts (kokoro's deps); fall back gracefully if not

    return yaml.safe_load(path.read_text(encoding="utf-8")) or {}


def tts_config() -> dict:
    try:
        return (_yaml(ROOT / "book.yaml").get("project", {}) or {}).get("tts", {}) or {}
    except Exception:
        return {}


def load_lexicon() -> list[tuple[re.Pattern, str]]:
    p = ROOT / "movies" / "lexicon.yaml"
    if not p.exists():
        return []
    d = _yaml(p)
    pairs = list((d.get("symbols") or {}).items()) + list((d.get("respell") or {}).items())
    out = []
    for k, v in sorted(pairs, key=lambda kv: -len(kv[0])):
        if re.match(r"^[\w\-]+$", k):
            out.append((re.compile(rf"(?<![\w-]){re.escape(k)}(?![\w-])", re.I), str(v)))
        else:
            out.append((re.compile(re.escape(k)), str(v)))
    return out


def respell(text: str, lex: list[tuple[re.Pattern, str]]) -> str:
    for pat, rep in lex:
        text = pat.sub(rep, text)
    return text


def sentences(par: str) -> list[str]:
    par = re.sub(r"\s+", " ", par.strip())
    if not par:
        return []
    parts = re.split(r"(?<=[.!?])\s+(?=[A-Z0-9\"'(])", par)
    return [s.strip() for s in parts if s.strip()]


def read_scenes(path: Path | None, text: str | None) -> list[dict]:
    """[{id, sentences: [str]}] from a storyboard YAML, a script.md, or --text."""
    if text is not None:
        return [{"id": "s1", "sentences": sentences(text)}]
    assert path is not None
    if path.suffix in (".yaml", ".yml"):
        sb = _yaml(path)
        return [{"id": sc["id"], "sentences": sentences(sc.get("voiceover") or "")} for sc in sb.get("scenes", [])]
    scenes, cur = [], None
    for line in path.read_text(encoding="utf-8").splitlines():
        m = re.match(r"^##\s+([\w\-]+)", line)
        if m:
            cur = {"id": m.group(1), "text": []}
            scenes.append(cur)
        elif cur is not None and not line.startswith("#") and not line.strip().startswith(">"):
            cur["text"].append(line)
    return [{"id": s["id"], "sentences": sentences(" ".join(s["text"]))} for s in scenes]


def wrap(text: str) -> list[str]:
    """Greedy wrap into lines of <= MAX_LINE characters."""
    lines, cur = [], ""
    for w in text.split():
        if cur and len(cur) + 1 + len(w) > MAX_LINE:
            lines.append(cur)
            cur = w
        else:
            cur = f"{cur} {w}".strip()
    if cur:
        lines.append(cur)
    return lines


def split_for_cues(sentence: str, dur: float) -> list[str]:
    """Split a sentence into cue texts that fit 2×42 characters and ≤ 7 s, preferring clause boundaries."""
    chunks = [sentence]
    while True:
        bad = [i for i, c in enumerate(chunks)
               if len(wrap(c)) > MAX_LINES or dur * len(c) / max(len(sentence), 1) > CUE_MAX]
        if not bad:
            return chunks
        i = bad[0]
        c = chunks[i]
        mid = len(c) // 2
        cands = [m.end() for m in re.finditer(r"[,;:—–]\s+|\s+(?:and|but|so|which|while|because|then)\s+", c)]
        cut = min(cands, key=lambda k: abs(k - mid)) if cands else None
        if cut is None or cut < 8 or cut > len(c) - 8:
            sp = [m.start() for m in re.finditer(r"\s", c)]
            if not sp:
                return chunks
            cut = min(sp, key=lambda k: abs(k - mid))
        chunks[i:i + 1] = [c[:cut].strip(), c[cut:].strip()]


def fmt_ts(t: float, sep: str) -> str:
    ms = int(round(t * 1000))
    h, ms = divmod(ms, 3_600_000)
    m, ms = divmod(ms, 60_000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d}{sep}{ms:03d}"


def loudnorm(src: Path, dst: Path, target: float = -16.0, tp: float = -1.5) -> dict:
    """Two-pass ffmpeg loudnorm (linear) to `target` LUFS; returns the measured stats of the first pass."""
    ff = shutil.which("ffmpeg")
    if not ff:
        raise SystemExit("ffmpeg not on PATH (winget install Gyan.FFmpeg)")
    p1 = subprocess.run([ff, "-hide_banner", "-nostats", "-i", str(src), "-af",
                         f"loudnorm=I={target}:TP={tp}:LRA=11:print_format=json", "-f", "null", "-"],
                        capture_output=True, text=True)
    js = json.loads(p1.stderr[p1.stderr.rfind("{"):p1.stderr.rfind("}") + 1])
    af = (f"loudnorm=I={target}:TP={tp}:LRA=11:measured_I={js['input_i']}:measured_TP={js['input_tp']}:"
          f"measured_LRA={js['input_lra']}:measured_thresh={js['input_thresh']}:offset={js['target_offset']}:"
          "linear=true")
    subprocess.run([ff, "-hide_banner", "-loglevel", "error", "-y", "-i", str(src), "-af", af, "-ar", str(SR),
                    "-ac", "1", "-c:a", "pcm_s16le", str(dst)], check=True)
    return js


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("input", nargs="?", help="storyboard.yaml or script.md")
    ap.add_argument("--text", help="narrate this text instead (test)")
    ap.add_argument("--out", help="output folder")
    ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--voice")
    ap.add_argument("--speed", type=float)
    ap.add_argument("--no-loudnorm", action="store_true")
    a = ap.parse_args()
    if not a.input and a.text is None:
        ap.error("give a storyboard/script or --text")
    cfg = tts_config()
    voice = a.voice or cfg.get("voice", "af_bella")
    speed = a.speed or float(cfg.get("speed", 1.0))
    src = Path(a.input).resolve() if a.input else None
    out = Path(a.out) if a.out else (src.parent / "audio" if src else Path.cwd() / "audio")
    out.mkdir(parents=True, exist_ok=True)
    scenes = read_scenes(src, a.text)
    lex = load_lexicon()

    from kokoro import KPipeline

    lang = "b" if voice.startswith("b") else "a"
    pipe = KPipeline(lang_code=lang, repo_id="hexgrad/Kokoro-82M")
    t_render = time.perf_counter()
    pieces: list[np.ndarray] = [np.zeros(int(LEAD * SR), dtype=np.float32)]
    t = LEAD
    timing = {"voice": voice, "speed": speed, "fps": a.fps, "sample_rate": SR,
              "gaps": {"sentence": GAP_SENT, "scene": GAP_SCENE, "lead": LEAD, "tail": TAIL}, "scenes": []}
    cues: list[tuple[float, float, str]] = []
    warnings: list[str] = []
    clip_total = 0.0
    n_gaps = 0.0
    for si, sc in enumerate(scenes):
        srec = {"id": sc["id"], "start": round(t, 4), "sentences": []}
        for k, sent in enumerate(sc["sentences"]):
            spoken = respell(sent, lex)
            wav = np.concatenate([np.asarray(c, dtype=np.float32) for _, _, c in pipe(spoken, voice=voice, speed=speed)])
            dur = len(wav) / SR
            pieces.append(wav)
            clip_total += dur
            start, end = t, t + dur
            srec["sentences"].append({"text": sent, "audio_text": spoken if spoken != sent else None,
                                      "start": round(start, 4), "end": round(end, 4), "dur": round(dur, 4),
                                      "start_frame": round(start * a.fps), "end_frame": round(end * a.fps)})
            parts = split_for_cues(sent, dur)
            n = sum(len(p) for p in parts)
            c0 = start
            for p in parts:
                c1 = c0 + dur * len(p) / n
                cues.append((c0, c1, p))
                c0 = c1
            cps = len(sent) / dur
            if cps > MAX_CPS:
                warnings.append(f"{sc['id']} s{k + 1}: {cps:.1f} chars/s > {MAX_CPS} (slow the speed or shorten)")
            t = end
            last_sent = k == len(sc["sentences"]) - 1
            gap = (GAP_SCENE if si < len(scenes) - 1 else TAIL) if last_sent else GAP_SENT
            pieces.append(np.zeros(int(round(gap * SR)), dtype=np.float32))
            n_gaps += round(gap * SR) / SR
            t += round(gap * SR) / SR
        srec["end"] = round(t, 4)
        srec["start_frame"], srec["end_frame"] = round(srec["start"] * a.fps), round(srec["end"] * a.fps)
        timing["scenes"].append(srec)
    audio = np.concatenate(pieces)
    raw = out / "narration_raw.wav"
    sf.write(raw, audio, SR)
    wav_path = out / "narration.wav"
    if a.no_loudnorm:
        shutil.copyfile(raw, wav_path)
        measured = None
    else:
        measured = loudnorm(raw, wav_path)
    raw.unlink(missing_ok=True)
    final = sf.info(str(wav_path))
    total = final.frames / final.samplerate
    timing["total_s"] = round(total, 4)
    timing["total_frames"] = int(np.ceil(total * a.fps))
    timing["render_s"] = round(time.perf_counter() - t_render, 1)
    timing["loudnorm_input"] = measured

    # captions: short cues (< 1 s) are merged forward; times clamped into the audio
    merged: list[list] = []
    for c in cues:
        if merged and merged[-1][1] - merged[-1][0] < CUE_MIN and len(wrap(merged[-1][2] + " " + c[2])) <= MAX_LINES:
            merged[-1] = [merged[-1][0], c[1], merged[-1][2] + " " + c[2]]
        else:
            merged.append(list(c))
    vtt = ["WEBVTT", ""]
    srt = []
    for i, (c0, c1, txt) in enumerate(merged, 1):
        lines = wrap(txt)
        d = c1 - c0
        if d > CUE_MAX + 1e-6 or len(lines) > MAX_LINES:
            warnings.append(f"cue {i}: {d:.1f} s / {len(lines)} lines out of house limits")
        vtt += [f"{fmt_ts(c0, '.')} --> {fmt_ts(c1, '.')}", *lines, ""]
        srt += [str(i), f"{fmt_ts(c0, ',')} --> {fmt_ts(c1, ',')}", *lines, ""]
    (out / "captions.vtt").write_text("\n".join(vtt), encoding="utf-8")
    (out / "captions.srt").write_text("\n".join(srt), encoding="utf-8")
    timing["cues"] = len(merged)
    timing["warnings"] = warnings

    # self-check: clips + gaps (+ lead) == audio length within one frame; cues inside the audio
    expected = LEAD + clip_total + n_gaps
    frame = 1.0 / a.fps
    ok_len = abs(expected - total) <= frame
    ok_cues = all(0 <= c0 < c1 <= total + 1e-6 for c0, c1, _ in merged)
    timing["self_check"] = {"expected_s": round(expected, 4), "audio_s": round(total, 4),
                            "diff_ms": round((total - expected) * 1000, 2), "len_ok": ok_len, "cues_ok": ok_cues}
    (out / "timing.json").write_text(json.dumps(timing, indent=1, ensure_ascii=False), encoding="utf-8")
    n_sent = sum(len(s["sentences"]) for s in scenes)
    print(f"tts: {voice} ×{speed}, {len(scenes)} scene(s), {n_sent} sentence(s), {total:.2f} s audio in "
          f"{timing['render_s']} s -> {out}")
    print(f"     captions {len(merged)} cues; self-check diff {timing['self_check']['diff_ms']} ms "
          f"({'OK' if ok_len and ok_cues else 'FAIL'})")
    for w in warnings:
        print("     warning:", w)
    return 0 if ok_len and ok_cues else 1


if __name__ == "__main__":
    sys.exit(main())
