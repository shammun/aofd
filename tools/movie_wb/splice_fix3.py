"""Fix loop 3 (review 3, N3-M1) for ch00_weather_basics: one sentence replaced (s55 S1) and one inserted (after s58 S1),
in one pass, without re-synthesising the rest of the narration.
Run in .venv-tts:  .venv-tts/Scripts/python.exe tools/movie_wb/splice_fix3.py

Same method as splice_replace.py / splice_insert.py (the narration was loudness-normalised by tools/tts.py with one
constant gain):
1. gain: s21 S2 is re-synthesised raw (Kokoro is deterministic); gain = RMS(its segment) / RMS(raw); the correlation is
   printed and must be >= 0.98.
2. the replacement is synthesised (lexicon applied, af_bella x1.0), scaled by the gain and put in place of the old
   sentence's audio [start, end); the insert gets the house sentence gap (0.35 s) + its clip right after the given
   sentence's end; everything later shifts.
3. timing.json is rebuilt, captions are rebuilt with tts.py's own cue rules, script.md gets the new text, self-check redone.
Inputs/outputs: <scratch>/v3/{narration.wav,timing.json} -> <scratch>/v4/{narration.wav,timing.json,captions.vtt,
captions.srt}; movies/ch00/ch00_weather_basics/{timing.json,en.vtt,en.srt,script.md}.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools"))
import tts  # noqa: E402

MOV = ROOT / "movies/ch00/ch00_weather_basics"
SCR = Path(r"G:\Geophysical Fluid Dynamics\aofd-data\scratch\movies\ch00_weather_basics")
OLD, NEW = SCR / "v3", SCR / "v4"
REPLACE = [("s55_ciaran_maps", 0, "Here are the isobars every four hectopascals from midday on the first of November to midday on the second, "
                                  "with the warm front in red and the cold front in blue until that evening.")]
INSERT = [("s58_brest_cold_front", 0, "By now the storm has broken and bent its fronts so much that the map can't trace them cleanly, "
                                      "but Brest's own measurements show it clearly.")]


def main() -> None:
    NEW.mkdir(exist_ok=True)
    T = json.loads((OLD / "timing.json").read_text(encoding="utf-8"))
    nar, sr = sf.read(OLD / "narration.wav", dtype="float32")
    subtype = sf.info(str(OLD / "narration.wav")).subtype
    fps = T["fps"]
    from kokoro import KPipeline
    pipe = KPipeline(lang_code="a", repo_id="hexgrad/Kokoro-82M")
    lex = tts.load_lexicon()

    def synth(text: str) -> np.ndarray:
        return np.concatenate([np.asarray(c, dtype=np.float32) for _, _, c in pipe(tts.respell(text, lex), voice="af_bella", speed=1.0)])

    ids = [s["id"] for s in T["scenes"]]
    ref = T["scenes"][ids.index("s21_balloon_pressure")]["sentences"][1]
    raw = synth(ref["text"])
    a0 = int(round(ref["start"] * sr))
    seg = nar[a0: a0 + len(raw)]
    n = min(len(seg), len(raw))
    rms = lambda v: float(np.sqrt(np.mean(v.astype(np.float64) ** 2)))  # noqa: E731
    gain = rms(seg[:n]) / rms(raw[:n])
    corr = float(np.corrcoef(seg[:n], raw[:n])[0, 1])
    print(f"gain {gain:.4f} ({20 * np.log10(gain):+.2f} dB); resynth correlation {corr:.4f}; ref dur {len(raw) / sr:.3f} vs {ref['dur']}")
    if corr < 0.98:
        raise SystemExit("re-synthesis does not match the narration (Kokoro not deterministic?) - stop")

    # edits: (cut start s, cut end s, audio to put there, kind, payload); a replacement cuts [start, end), an insert cuts nothing
    gap = np.zeros(int(round(tts.GAP_SENT * sr)), dtype=np.float32)
    edits = []
    for sid, j, text in REPLACE:
        s = T["scenes"][ids.index(sid)]["sentences"][j]
        clip = (synth(text) * gain).astype(np.float32)
        edits.append((s["start"], s["end"], clip, "rep", (sid, j, text, s["text"], len(clip) / sr)))
    for sid, j, text in INSERT:
        s = T["scenes"][ids.index(sid)]["sentences"][j]
        clip = (synth(text) * gain).astype(np.float32)
        edits.append((s["end"], s["end"], np.concatenate([gap, clip]), "ins", (sid, j, text, None, len(clip) / sr)))
    edits.sort(key=lambda e: e[0])
    pieces, cur, shifts = [], 0, []       # shifts: (old time te, added s, kind, payload)
    for t0, t1, audio, kind, pay in edits:
        a, b = int(round(t0 * sr)), int(round(t1 * sr))
        pieces += [nar[cur:a], audio]
        cur = b
        shifts.append((t1, len(audio) / sr - (b - a) / sr, kind, pay))
    pieces.append(nar[cur:])
    out = np.concatenate(pieces)
    sf.write(NEW / "narration.wav", out, sr, subtype=subtype)
    total = len(out) / sr

    def shift(t: float, end: bool = False) -> float:
        # a replaced sentence's own end (t == te) moves with it; an insert's anchor sentence end (t == te) does not
        return t + sum(dt for te, dt, kind, _ in shifts
                       if (t > te + 1e-9) or (end and kind == "rep" and abs(t - te) <= 1e-9))

    for sc in T["scenes"]:
        for s in sc["sentences"]:
            s["start"], s["end"] = round(shift(s["start"]), 4), round(shift(s["end"], end=True), 4)
        sc["start"], sc["end"] = round(shift(sc["start"]), 4), round(shift(sc["end"], end=True), 4)
    rec = []
    for te, dt, kind, (sid, j, text, old, dur) in shifts:
        sc = T["scenes"][ids.index(sid)]
        a_txt = tts.respell(text, lex)
        if kind == "rep":
            s = sc["sentences"][j]
            s.update(text=text, audio_text=a_txt if a_txt != text else None, dur=round(dur, 4), end=round(s["start"] + dur, 4))
            rec.append({"scene": sid, "sentence": j + 1, "kind": "replace", "old": old, "new": text, "added_s": round(dt, 3)})
        else:
            st = sc["sentences"][j]["end"] + tts.GAP_SENT
            sc["sentences"].insert(j + 1, {"text": text, "audio_text": a_txt if a_txt != text else None, "start": round(st, 4),
                                           "end": round(st + dur, 4), "dur": round(dur, 4)})
            rec.append({"scene": sid, "after_sentence": j + 1, "kind": "insert", "new": text, "added_s": round(dt, 3)})
    warnings = []
    for sc in T["scenes"]:
        for k, s in enumerate(sc["sentences"]):
            s["start_frame"], s["end_frame"] = round(s["start"] * fps), round(s["end"] * fps)
            cps = len(s["text"]) / s["dur"]
            if cps > tts.MAX_CPS:
                warnings.append(f"{sc['id']} s{k + 1}: {cps:.1f} chars/s > {tts.MAX_CPS}")
        sc["start_frame"], sc["end_frame"] = round(sc["start"] * fps), round(sc["end"] * fps)
    # order check: every sentence starts after the previous one ends
    flat = [s for sc in T["scenes"] for s in sc["sentences"]]
    bad = [i for i in range(1, len(flat)) if flat[i]["start"] < flat[i - 1]["end"] - 1e-6]
    if bad:
        raise SystemExit(f"sentence overlap after the splice at {bad[:5]}")
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
    prev = T.get("self_check", {})
    T.update(total_s=round(total, 4), total_frames=int(np.ceil(total * fps)), cues=len(merged), warnings=warnings,
             self_check={"expected_s": round(exp, 4), "audio_s": round(total, 4), "diff_ms": round((total - exp) * 1000, 2),
                         "len_ok": abs(total - exp) <= 1 / fps, "cues_ok": all(0 <= a < b <= total + 1e-6 for a, b, _ in merged),
                         "spliced_inserts": prev.get("spliced_inserts"), "spliced_replacements": prev.get("spliced_replacements"),
                         "spliced_fix3": {"gain": round(gain, 5), "corr_resynth": round(corr, 4), "edits": rec}})
    for d, nm in ((NEW, "captions"), (MOV, "en")):
        (d / f"{nm}.vtt").write_text("\n".join(vtt), encoding="utf-8")
        (d / f"{nm}.srt").write_text("\n".join(srt), encoding="utf-8")
    for d in (NEW, MOV):
        (d / "timing.json").write_text(json.dumps(T, indent=1, ensure_ascii=False), encoding="utf-8")
    sp = MOV / "script.md"
    s = sp.read_text(encoding="utf-8")
    for te, dt, kind, (sid, j, text, old, dur) in shifts:
        if text in s:
            continue
        if kind == "rep":
            if old not in s:
                raise SystemExit(f"script.md: sentence not found for {sid} {j + 1}: {old}")
            s = s.replace(old, text, 1)
        else:
            anchor = T["scenes"][ids.index(sid)]["sentences"][j]["text"]
            if s.count(anchor) != 1:
                raise SystemExit(f"script.md: anchor not unique for {sid}: {anchor}")
            s = s.replace(anchor, anchor + " " + text, 1)
    sp.write_text(s, encoding="utf-8")
    print(f"total {total:.3f} s ({T['total_frames']} frames), cues {len(merged)}, self-check {T['self_check']['diff_ms']} ms, warnings {warnings}")
    for r in rec:
        print("  ", r)
    for te, dt, kind, (sid, j, text, old, dur) in shifts:
        print(f"  {sid} {kind}: {dt:+.3f} s, clip {dur:.2f} s, {len(text) / dur:.1f} cps")


if __name__ == "__main__":
    main()
