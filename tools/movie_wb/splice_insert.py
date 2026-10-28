"""Insert new sentences into scenes of ch00_weather_basics without re-synthesising the rest of the narration.
Run in .venv-tts:  .venv-tts/Scripts/python.exe tools/movie_wb/splice_insert.py

The v1 narration.wav was loudness-normalised by tools/tts.py with ffmpeg loudnorm in linear mode (one constant gain).
1. gain: one existing sentence is re-synthesised raw (Kokoro is deterministic); gain = RMS(its segment in narration.wav)
   / RMS(raw clip); the correlation of the two is printed as a check.
2. each new sentence is synthesised (lexicon applied, af_bella ×1.0), scaled by that gain and inserted right after the
   given sentence with the house gap (0.35 s); everything later shifts by (clip + 0.35 s).
3. timing.json is rebuilt (all later times shifted), captions are rebuilt from the timing with tts.py's own cue rules,
   script.md gets the sentences, and the self-check is redone.
Inputs/outputs: <scratch>/v1/{narration.wav,timing.json} → <scratch>/v2/{narration.wav,timing.json,captions.vtt,
captions.srt}; movies/ch00/ch00_weather_basics/{timing.json,en.vtt,en.srt,script.md}.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

import numpy as np
import soundfile as sf

import sys
ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools"))
import tts  # noqa: E402

MOV = ROOT / "movies/ch00/ch00_weather_basics"
SCR = Path(r"G:\Geophysical Fluid Dynamics\aofd-data\scratch\movies\ch00_weather_basics")
OLD, NEW = SCR / "v1", SCR / "v2"
INSERTS = [  # (scene id, insert after sentence index (0-based), new sentences)
    ("s21_balloon_pressure", 4, ["In the picture, heights are drawn ten times taller than distances on the map, so that we can see the climb."]),
    ("s39_surface_pressure", 3, ["In the close-up, the mountains are drawn thirty times taller than they really are."]),
    ("s42_highs_lows", 3, ["Here is a much more recent map, a weather-service analysis from the twenty-seventh of October, twenty twenty-six.",
                          "Its deepest low is a typhoon over the western Pacific, at about nine hundred and thirty-five hectopascals, while a "
                          "low over the North Atlantic, at about nine hundred and fifty-five, is about as deep as Ciarán."]),
]


def main() -> None:
    NEW.mkdir(exist_ok=True)
    T = json.loads((OLD / "timing.json").read_text(encoding="utf-8"))
    nar, sr = sf.read(OLD / "narration.wav", dtype="float32")
    fps = T["fps"]
    from kokoro import KPipeline
    pipe = KPipeline(lang_code="a", repo_id="hexgrad/Kokoro-82M")
    lex = tts.load_lexicon()

    def synth(text: str) -> np.ndarray:
        return np.concatenate([np.asarray(c, dtype=np.float32) for _, _, c in pipe(tts.respell(text, lex), voice="af_bella", speed=1.0)])

    # gain from a reference sentence (s21 sentence 1)
    ref = T["scenes"][[s["id"] for s in T["scenes"]].index("s21_balloon_pressure")]["sentences"][1]
    raw = synth(ref["text"])
    seg = nar[int(round(ref["start"] * sr)): int(round(ref["start"] * sr)) + len(raw)]
    n = min(len(seg), len(raw))
    rms = lambda v: float(np.sqrt(np.mean(v.astype(np.float64) ** 2)))  # noqa: E731
    gain = rms(seg[:n]) / rms(raw[:n])
    corr = float(np.corrcoef(seg[:n], raw[:n])[0, 1])
    print(f"gain {gain:.4f} ({20 * np.log10(gain):+.2f} dB); resynth correlation {corr:.4f}; ref dur {len(raw) / sr:.3f} vs {ref['dur']}")

    # build the insertion list in time order
    ins = []
    for sid, after, texts in INSERTS:
        sc = next(s for s in T["scenes"] if s["id"] == sid)
        t_after = sc["sentences"][after]["end"]
        clips = [synth(t) * gain for t in texts]
        ins.append((t_after, sid, after, texts, clips))
    ins.sort(key=lambda x: x[0])
    gap = int(round(tts.GAP_SENT * sr))
    pieces, cur, shifts = [], 0, []   # shifts: (old time, added seconds)
    added = 0.0
    for t_after, sid, after, texts, clips in ins:
        cut = int(round(t_after * sr))
        pieces.append(nar[cur:cut])
        new_sents = []
        t0 = t_after + added
        for text, c in zip(texts, clips):
            pieces.append(np.zeros(gap, dtype=np.float32))
            st = t0 + gap / sr
            pieces.append(c.astype(np.float32))
            en = st + len(c) / sr
            new_sents.append({"text": text, "audio_text": tts.respell(text, lex) if tts.respell(text, lex) != text else None, "start": st, "end": en,
                              "dur": len(c) / sr})
            t0 = en
        dt = sum(gap / sr + len(c) / sr for c in clips)
        shifts.append((t_after, dt, sid, after, new_sents))
        added += dt
        cur = cut
    pieces.append(nar[cur:])
    out = np.concatenate(pieces)
    sf.write(NEW / "narration.wav", out, sr, subtype=sf.info(str(OLD / "narration.wav")).subtype)
    total = len(out) / sr

    def shift(t: float) -> float:
        return t + sum(dt for ta, dt, *_ in shifts if t > ta + 1e-9)

    for sc in T["scenes"]:
        for s in sc["sentences"]:
            s["start"], s["end"] = round(shift(s["start"]), 4), round(shift(s["end"]), 4)
        sc["start"] = round(shift(sc["start"]), 4)
        sc["end"] = round(shift(sc["end"]), 4)
    for ta, dt, sid, after, new_sents in shifts:
        sc = next(s for s in T["scenes"] if s["id"] == sid)
        for k, ns in enumerate(new_sents):
            sc["sentences"].insert(after + 1 + k, {**ns, "start": round(ns["start"], 4), "end": round(ns["end"], 4), "dur": round(ns["dur"], 4)})
    warnings = []
    for sc in T["scenes"]:
        for k, s in enumerate(sc["sentences"]):
            s["start_frame"], s["end_frame"] = round(s["start"] * fps), round(s["end"] * fps)
            cps = len(s["text"]) / s["dur"]
            if cps > tts.MAX_CPS:
                warnings.append(f"{sc['id']} s{k + 1}: {cps:.1f} chars/s > {tts.MAX_CPS}")
        sc["start_frame"], sc["end_frame"] = round(sc["start"] * fps), round(sc["end"] * fps)
    # captions with tts.py's rules
    cues = []
    for sc in T["scenes"]:
        for s in sc["sentences"]:
            parts = tts.split_for_cues(s["text"], s["dur"])
            nch = sum(len(p) for p in parts)
            c0 = s["start"]
            for p in parts:
                c1 = c0 + s["dur"] * len(p) / nch
                cues.append((c0, c1, p))
                c0 = c1
    merged = []
    for c in cues:
        if merged and merged[-1][1] - merged[-1][0] < tts.CUE_MIN and len(tts.wrap(merged[-1][2] + " " + c[2])) <= tts.MAX_LINES:
            merged[-1] = [merged[-1][0], c[1], merged[-1][2] + " " + c[2]]
        else:
            merged.append(list(c))
    vtt, srt = ["WEBVTT", ""], []
    for i, (c0, c1, txt) in enumerate(merged, 1):
        lines = tts.wrap(txt)
        if c1 - c0 > tts.CUE_MAX + 1e-6 or len(lines) > tts.MAX_LINES:
            warnings.append(f"cue {i}: {c1 - c0:.1f} s / {len(lines)} lines out of house limits")
        vtt += [f"{tts.fmt_ts(c0, '.')} --> {tts.fmt_ts(c1, '.')}", *lines, ""]
        srt += [str(i), f"{tts.fmt_ts(c0, ',')} --> {tts.fmt_ts(c1, ',')}", *lines, ""]
    exp = T["scenes"][-1]["end"]
    T.update(total_s=round(total, 4), total_frames=int(np.ceil(total * fps)), cues=len(merged), warnings=warnings,
             self_check={"expected_s": round(exp, 4), "audio_s": round(total, 4), "diff_ms": round((total - exp) * 1000, 2),
                         "len_ok": abs(total - exp) <= 1 / fps, "cues_ok": all(0 <= a < b <= total + 1e-6 for a, b, _ in merged),
                         "spliced_inserts": {"gain": round(gain, 5), "corr_resynth": round(corr, 4),
                                             "inserted": [{"scene": sid, "after_sentence": after + 1, "added_s": round(dt, 3)} for _, dt, sid, after, _ in shifts]}})
    for d, nm in ((NEW, "captions"), (MOV, "en")):
        (d / f"{nm}.vtt").write_text("\n".join(vtt), encoding="utf-8")
        (d / f"{nm}.srt").write_text("\n".join(srt), encoding="utf-8")
    for d in (NEW, MOV):
        (d / "timing.json").write_text(json.dumps(T, indent=1, ensure_ascii=False), encoding="utf-8")
    # script.md
    sp = MOV / "script.md"
    s = sp.read_text(encoding="utf-8")
    for sid, after, texts in INSERTS:
        sc = next(x for x in T["scenes"] if x["id"] == sid)
        prev = sc["sentences"][after]["text"]
        if texts[0] not in s:
            s = s.replace(prev, prev + " " + " ".join(texts), 1)
    sp.write_text(s, encoding="utf-8")
    print(f"total {total:.3f} s ({T['total_frames']} frames), cues {len(merged)}, warnings {warnings}")
    for _, dt, sid, after, ns in shifts:
        print(f"  {sid}: +{dt:.3f} s after sentence {after + 1}: " + " | ".join(f"{x['dur']:.2f} s {len(x['text']) / x['dur']:.1f} cps" for x in ns))


if __name__ == "__main__":
    main()
