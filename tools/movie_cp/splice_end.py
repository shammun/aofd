"""Replace the narration of the LAST scene (s48_end) of ch00_cross_product_why without re-synthesising anything earlier.
Run in .venv-tts (kokoro + soundfile):  .venv-tts/Scripts/python.exe tools/movie_cp/splice_end.py

1. tools/tts.py --no-loudnorm on two one-scene scripts: the OLD end text and the NEW end text (Kokoro af_bella x1.0,
   lexicon applied, same gaps: lead 0.3 s, sentence 0.35 s, tail 0.3 s).
2. gain: the old narration.wav was loudness-normalised as a whole (ffmpeg loudnorm, dynamic mode), so the gain applied
   to the end scene is measured: RMS(old final s48 segment) / RMS(old raw s48 synthesis). The new raw clip gets that gain.
3. narration.wav = old samples [0, s48 start) + new clip (from its lead on); nothing earlier moves.
4. timing.json: s48 record replaced, total_s / total_frames / self_check updated; cues before s48 kept and the new
   scene's cues (split by tts.py's own rules) shifted in; en.vtt / en.srt rewritten.
Writes into <scratch>/v4/audio_f1/ and movies/ch00/ch00_cross_product_why/timing.json + movies/out/.../en.{vtt,srt}.
"""
from __future__ import annotations

import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools"))
import tts  # noqa: E402

MOV = ROOT / "movies/ch00/ch00_cross_product_why"
OUTV = ROOT / "movies/out/ch00/ch00_cross_product_why"
SCR = Path(r"G:\Geophysical Fluid Dynamics\aofd-data\scratch\movies\ch00_cross_product_why\v4")
OLD_AUDIO = SCR / "audio"
NEW_AUDIO = SCR / "audio_f1"
NEW_TEXT = ("This video is one of a series of related tutorials, so watch out for the others. They're made to help students "
            "of meteorology, atmospheric science and climate science, and anyone else who wants to learn not just these ideas, "
            "but the maths behind them too. The notebook for the cross product, and the notebooks for the other concepts, "
            "are on the website that goes with this video.")


def synth(text: str, name: str) -> tuple[np.ndarray, dict]:
    d = NEW_AUDIO / name
    d.mkdir(parents=True, exist_ok=True)
    md = d / "end.md"
    md.write_text(f"## s48_end\n{text}\n", encoding="utf-8")
    r = subprocess.run([sys.executable, str(ROOT / "tools/tts.py"), str(md), "--out", str(d), "--no-loudnorm"], capture_output=True, text=True)
    print(r.stdout[-800:], r.stderr[-800:])
    x, sr = sf.read(d / "narration.wav", dtype="float32")
    assert sr == tts.SR
    return x, json.loads((d / "timing.json").read_text(encoding="utf-8"))


def ts(t: float, sep: str) -> str:
    return tts.fmt_ts(t, sep)


def main() -> None:
    NEW_AUDIO.mkdir(exist_ok=True)
    T = json.loads((MOV / "timing.json").read_text(encoding="utf-8"))
    old_end = T["scenes"][-1]
    assert old_end["id"] == "s48_end"
    old_text = " ".join(s["text"] for s in old_end["sentences"])
    nar, sr = sf.read(OLD_AUDIO / "narration.wav", dtype="float32")
    s0 = int(round(old_end["start"] * sr))
    old_raw, _ = synth(old_text, "old_raw")
    new_raw, tn = synth(NEW_TEXT, "new_raw")
    L = int(round(tts.LEAD * sr))
    seg_old = nar[s0:]
    ref = old_raw[L:L + len(seg_old)]
    n = min(len(seg_old), len(ref))
    rms = lambda v: float(np.sqrt(np.mean(v.astype(np.float64) ** 2)))  # noqa: E731
    corr = float(np.corrcoef(seg_old[:n], ref[:n])[0, 1])
    # level: loudness-normalise each end clip on its own exactly as tts.py does (−16 LUFS, TP −1.5 dBTP, which also limits
    # the peaks), then match the old clip's level in the whole-file narration (gain = old final / old re-normalised)
    def ln(x: np.ndarray, nm: str) -> np.ndarray:
        sf.write(NEW_AUDIO / f"{nm}_in.wav", x, sr)
        tts.loudnorm(NEW_AUDIO / f"{nm}_in.wav", NEW_AUDIO / f"{nm}_ln.wav")
        y, _ = sf.read(NEW_AUDIO / f"{nm}_ln.wav", dtype="float32")
        return y
    old_ln = ln(old_raw[L:], "old_end")
    new_ln = ln(new_raw[L:], "new_end")
    m = min(n, len(old_ln))
    gain = rms(seg_old[:m]) / rms(old_ln[:m])
    print(f"gain after per-clip loudnorm {gain:.4f} ({20 * np.log10(gain):+.2f} dB); old-vs-resynth correlation {corr:.4f}")
    new_seg = new_ln[:len(new_raw) - L] * gain
    if len(new_seg) < len(new_raw) - L:
        new_seg = np.concatenate([new_seg, np.zeros(len(new_raw) - L - len(new_seg), dtype=np.float32)])
    peak = float(np.max(np.abs(new_seg)))
    out = np.concatenate([nar[:s0], new_seg.astype(np.float32)])
    sf.write(NEW_AUDIO / "narration.wav", out, sr, subtype=sf.info(str(OLD_AUDIO / "narration.wav")).subtype)
    total = len(out) / sr

    # timing.json
    off = old_end["start"] - tts.LEAD
    sc = tn["scenes"][0]
    fps = T["fps"]
    rec = {"id": "s48_end", "start": round(sc["start"] + off, 4), "sentences": []}
    for s in sc["sentences"]:
        st, en = s["start"] + off, s["end"] + off
        rec["sentences"].append({**s, "start": round(st, 4), "end": round(en, 4), "start_frame": round(st * fps), "end_frame": round(en * fps)})
    rec["end"] = round(sc["end"] + off, 4)
    rec["start_frame"], rec["end_frame"] = round(rec["start"] * fps), round(rec["end"] * fps)
    T["scenes"][-1] = rec
    T["total_s"] = round(total, 4)
    T["total_frames"] = int(np.ceil(total * fps))
    exp = rec["end"]
    T["warnings"] = [w for w in T.get("warnings", []) if not w.startswith("s48_end")] + [f"s48_end: {w}" for w in tn.get("warnings", [])]
    T["self_check"] = {"expected_s": round(exp, 4), "audio_s": round(total, 4), "diff_ms": round((total - exp) * 1000, 2),
                       "len_ok": abs(total - exp) <= 1 / fps, "cues_ok": True, "spliced_end": {"gain": round(gain, 5), "corr_old_resynth": round(corr, 4),
                                                                                                 "new_peak": round(peak, 4)}}

    # captions: keep every old cue that starts before s48, add the new scene's cues shifted
    def parse_vtt(p: Path) -> list[tuple[float, float, list[str]]]:
        blocks = re.split(r"\n\s*\n", p.read_text(encoding="utf-8").replace("\r", ""))
        cues = []
        for b in blocks:
            ls = b.strip().split("\n")
            if ls and "-->" in ls[0]:
                a, z = [x.strip() for x in ls[0].split("-->")]
                hms = lambda s: sum(float(v) * m for v, m in zip(s.replace(",", ".").split(":"), [3600, 60, 1]))  # noqa: E731
                cues.append((hms(a), hms(z), ls[1:]))
        return cues
    old_c = [c for c in parse_vtt(OUTV / "en.vtt") if c[0] < old_end["start"] - 1e-6]
    new_c = [(a + off, z + off, l) for a, z, l in parse_vtt(NEW_AUDIO / "new_raw" / "captions.vtt")]
    allc = old_c + new_c
    for i, (a, z, l) in enumerate(allc):
        assert 0 <= a < z <= total + 1e-6, (i, a, z)
        if i:
            assert a >= allc[i - 1][1] - 1e-6
    vtt = ["WEBVTT", ""]
    srt = []
    for i, (a, z, l) in enumerate(allc, 1):
        vtt += [f"{ts(a, '.')} --> {ts(z, '.')}", *l, ""]
        srt += [str(i), f"{ts(a, ',')} --> {ts(z, ',')}", *l, ""]
    T["cues"] = len(allc)
    for d in (NEW_AUDIO, OUTV):
        (d / ("en.vtt" if d == OUTV else "captions.vtt")).write_text("\n".join(vtt), encoding="utf-8")
        (d / ("en.srt" if d == OUTV else "captions.srt")).write_text("\n".join(srt), encoding="utf-8")
    (MOV / "timing.json").write_text(json.dumps(T, indent=1, ensure_ascii=False), encoding="utf-8")
    shutil.copy(MOV / "timing.json", NEW_AUDIO / "timing.json")
    print(f"total {total:.3f} s ({T['total_frames']} frames), s48 {rec['start']}–{rec['end']} s, new peak {peak:.3f}, "
          f"cues {len(allc)} ({len(new_c)} new); warnings: {[w for w in T['warnings'] if 's48' in w]}")
    for s in rec["sentences"]:
        print(f"  {s['start']:.3f}-{s['end']:.3f} {len(s['text']) / s['dur']:.1f} cps  {s['text']}")


if __name__ == "__main__":
    main()
