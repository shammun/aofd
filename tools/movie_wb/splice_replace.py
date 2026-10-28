"""Replace whole sentences of the ch00_weather_basics narration without re-synthesising the rest (fix loop 1, review 1).
Run in .venv-tts:  .venv-tts/Scripts/python.exe tools/movie_wb/splice_replace.py

Same method as splice_insert.py (the v2 narration.wav was loudness-normalised by tools/tts.py in linear mode, one
constant gain):
1. gain: one unchanged sentence is re-synthesised raw (Kokoro is deterministic); gain = RMS(its segment) / RMS(raw);
   the correlation of the two is printed and recorded as a check.
2. each replaced sentence is synthesised (lexicon applied, af_bella ×1.0), scaled by that gain and put in place of the
   old sentence's audio [start, end); the house gaps around it are unchanged; everything later shifts by
   (new − old duration).
3. timing.json is rebuilt (all later times shifted), captions are rebuilt from the timing with tts.py's own cue rules,
   script.md gets the new sentences, and the self-check is redone.
Inputs/outputs: <scratch>/v2/{narration.wav,timing.json} → <scratch>/v3/{narration.wav,timing.json,captions.vtt,
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
OLD, NEW = SCR / "v2", SCR / "v3"
# (scene id, sentence index (0-based), new text) — review 1: S4 (s29 RH 73 % spoken), S11 ("10-m wind" explained),
# M3 (Ciarán's own centre was 970.7 hPa at 12 UTC 1 Nov, not the 965 of the other low), M4 (the front legend spoken)
REPLACE = [
    ("s29_relative_humidity", 6, "Cool the same air to eighteen degrees, and its relative humidity rises to about seventy-three percent, "
                                 "even though no water is added."),
    ("s44_round_lows", 0, "Now let's add the real winds near the ground, measured ten metres up, from the same reanalysis."),
    ("s55_ciaran_maps", 0, "Here are the isobars every four hectopascals, with the warm front in red and the cold front in blue, "
                           "from midday on the first of November to midday on the second."),
    ("s55_ciaran_maps", 1, "The low deepens as it comes, from about nine hundred and seventy to about nine hundred and fifty-four "
                           "hectopascals, and its centre crosses the English Channel just north of Brest during the night."),
]


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
    seg = nar[int(round(ref["start"] * sr)): int(round(ref["start"] * sr)) + len(raw)]
    n = min(len(seg), len(raw))
    rms = lambda v: float(np.sqrt(np.mean(v.astype(np.float64) ** 2)))  # noqa: E731
    gain = rms(seg[:n]) / rms(raw[:n])
    corr = float(np.corrcoef(seg[:n], raw[:n])[0, 1])
    print(f"gain {gain:.4f} ({20 * np.log10(gain):+.2f} dB); resynth correlation {corr:.4f}; ref dur {len(raw) / sr:.3f} vs {ref['dur']}")
    if corr < 0.98:          # splice_insert measured 0.9897 on the same reference
        raise SystemExit("re-synthesis does not match the narration (Kokoro not deterministic?) - stop")

    reps = []
    for sid, j, text in REPLACE:
        s = T["scenes"][ids.index(sid)]["sentences"][j]
        clip = synth(text) * gain
        reps.append((s["start"], s["end"], sid, j, text, clip, s["text"]))
    reps.sort(key=lambda x: x[0])
    pieces, cur, shifts = [], 0, []      # shifts: (old end time, added seconds)
    for t0, t1, sid, j, text, clip, old in reps:
        a, b = int(round(t0 * sr)), int(round(t1 * sr))
        pieces.append(nar[cur:a])
        pieces.append(clip.astype(np.float32))
        cur = b
        shifts.append((t1, len(clip) / sr - (b - a) / sr, sid, j, text, len(clip) / sr, old))
    pieces.append(nar[cur:])
    out = np.concatenate(pieces)
    sf.write(NEW / "narration.wav", out, sr, subtype=subtype)
    total = len(out) / sr

    def shift(t: float, inclusive: bool = False) -> float:
        return t + sum(dt for te, dt, *_ in shifts if (t >= te - 1e-9 if inclusive else t > te + 1e-9))

    for sc in T["scenes"]:
        for s in sc["sentences"]:
            s["start"], s["end"] = round(shift(s["start"]), 4), round(shift(s["end"], inclusive=True), 4)
        sc["start"], sc["end"] = round(shift(sc["start"]), 4), round(shift(sc["end"], inclusive=True), 4)
    for te, dt, sid, j, text, dur, old in shifts:
        s = T["scenes"][ids.index(sid)]["sentences"][j]
        a_txt = tts.respell(text, lex)
        s.update(text=text, audio_text=a_txt if a_txt != text else None, dur=round(dur, 4), end=round(s["start"] + dur, 4))
    warnings = []
    for sc in T["scenes"]:
        for k, s in enumerate(sc["sentences"]):
            s["start_frame"], s["end_frame"] = round(s["start"] * fps), round(s["end"] * fps)
            cps = len(s["text"]) / s["dur"]
            if cps > tts.MAX_CPS:
                warnings.append(f"{sc['id']} s{k + 1}: {cps:.1f} chars/s > {tts.MAX_CPS}")
        sc["start_frame"], sc["end_frame"] = round(sc["start"] * fps), round(sc["end"] * fps)
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
    exp = T["scenes"][-1]["end"]                     # scene ends include the gaps; the last one the tail
    prev_check = T.get("self_check", {})
    T.update(total_s=round(total, 4), total_frames=int(np.ceil(total * fps)), cues=len(merged), warnings=warnings,
             self_check={"expected_s": round(exp, 4), "audio_s": round(total, 4), "diff_ms": round((total - exp) * 1000, 2),
                         "len_ok": abs(total - exp) <= 1 / fps, "cues_ok": all(0 <= a < b <= total + 1e-6 for a, b, _ in merged),
                         "spliced_inserts": prev_check.get("spliced_inserts"),
                         "spliced_replacements": {"gain": round(gain, 5), "corr_resynth": round(corr, 4),
                                                  "replaced": [{"scene": sid, "sentence": j + 1, "old": old, "new": text,
                                                                "added_s": round(dt, 3)} for _, dt, sid, j, text, _, old in shifts]}})
    for d, nm in ((NEW, "captions"), (MOV, "en")):
        (d / f"{nm}.vtt").write_text("\n".join(vtt), encoding="utf-8")
        (d / f"{nm}.srt").write_text("\n".join(srt), encoding="utf-8")
    for d in (NEW, MOV):
        (d / "timing.json").write_text(json.dumps(T, indent=1, ensure_ascii=False), encoding="utf-8")
    sp = MOV / "script.md"
    s = sp.read_text(encoding="utf-8")
    for _, _, sid, j, text, _, old in shifts:
        if old in s:
            s = s.replace(old, text, 1)
        elif text not in s:
            raise SystemExit(f"script.md: sentence not found for {sid} {j + 1}: {old}")
    sp.write_text(s, encoding="utf-8")
    print(f"total {total:.3f} s ({T['total_frames']} frames), cues {len(merged)}, self-check {T['self_check']['diff_ms']} ms, warnings {warnings}")
    for _, dt, sid, j, text, dur, old in shifts:
        print(f"  {sid} S{j}: {dt:+.3f} s, {dur:.2f} s, {len(text) / dur:.1f} cps")


if __name__ == "__main__":
    main()
