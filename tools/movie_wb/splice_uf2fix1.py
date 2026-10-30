"""UF2 fix loop 1 (UF2 review 1 M2 / user U3-02, S14): replace five sentences of the ch00_weather_basics narration
without re-synthesising the other 492:
  s27c S2  "…at ten heights at once…"  -> "…at five heights at once…"           (the stack now has five layers)
  s27c S4  "In fact, about half…"      -> "In fact, almost half…"               (W85 = 0.450 < the orchestrator's 0.46-0.50)
  s53 S3, S4, S5: each hover names its place (zoom-tour rule, review S14): "over the tropical Atlantic",
           "over the South Atlantic", "like here over the North Atlantic".
Run in .venv-tts:  .venv-tts/Scripts/python.exe tools/movie_wb/splice_uf2fix1.py

Method = tools/movie_wb/splice_uf1fix1.py (house rule after the #1a loudness fix): Kokoro af_bella 1.0 with the lexicon;
ONE constant gain per clip to the BS.1770-4 loudness of the old sentence's two neighbours (power mean); a 5-ms look-ahead
limiter at -1.5 dBTP; every clip within +-1.5 LU of each neighbour; the clip replaces [start, end) of the old sentence,
the house gaps stay, later times shift; timing.json, captions and script.md are rebuilt / edited.
Inputs: <scratch>/uf2/tts/{narration.wav,timing.json} (= the UF2 build-1 narration). Outputs: <scratch>/uf2/fix1/tts/
{narration.wav,timing.json,captions.vtt,captions.srt,splice.json, clip_*.wav}; movies/ch00/ch00_weather_basics/{timing.json,
en.vtt,en.srt,script.md}.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools"))
sys.path.insert(0, str(ROOT / "tools" / "movie_wb"))
import tts  # noqa: E402
import splice_uf1fix1 as U  # noqa: E402  (lufs, true_peak, limiter: the same BS.1770-4 code)

MOV = ROOT / "movies/ch00/ch00_weather_basics"
SCR = Path(r"G:\Geophysical Fluid Dynamics\aofd-data\scratch\movies\ch00_weather_basics\uf2")
OLD, NEW = SCR / "tts", SCR / "fix1" / "tts"
REPLACE = [
    ("s27c_vapour_stack", 1, "Let's lift the humidity off the globe and look at it at five heights at once, from the sea surface up to about ten kilometres."),
    ("s27c_vapour_stack", 3, "In fact, almost half of all the vapour here lies in the lowest one and a half kilometres."),
    ("s53_trades_westerlies", 2, "North of the equator, over the tropical Atlantic, they come from the north-east."),
    ("s53_trades_westerlies", 3, "South of it, over the South Atlantic, they come from the south-east."),
    ("s53_trades_westerlies", 4, "Poleward of the subtropical highs, in the middle latitudes, like here over the North Atlantic, the winds come mostly "
                                 "from the west: the westerlies."),
]


def main() -> None:
    NEW.mkdir(parents=True, exist_ok=True)
    T = json.loads((OLD / "timing.json").read_text(encoding="utf-8"))
    assert T == json.loads((MOV / "timing.json").read_text(encoding="utf-8")), "movie timing.json is not the UF2 b1 TTS timing"
    nar, sr = sf.read(OLD / "narration.wav", dtype="float32")
    subtype = sf.info(str(OLD / "narration.wav")).subtype
    fps = T["fps"]
    from kokoro import KPipeline
    pipe = KPipeline(lang_code="a", repo_id="hexgrad/Kokoro-82M")
    lex = tts.load_lexicon()

    def synth(text: str) -> np.ndarray:
        return np.concatenate([np.asarray(c, dtype=np.float32) for _, _, c in pipe(tts.respell(text, lex), voice="af_bella", speed=1.0)])

    ids = [s["id"] for s in T["scenes"]]
    seg = lambda s: nar[int(round(s["start"] * sr)): int(round(s["end"] * sr))]  # noqa: E731
    ref = T["scenes"][ids.index("s27c_vapour_stack")]["sentences"][2]
    raw = synth(ref["text"]); a_ = seg(ref)[: len(raw)]; n = min(len(a_), len(raw))
    corr = float(np.corrcoef(a_[:n], raw[:n])[0, 1])
    print(f"resynth correlation {corr:.4f} on '{ref['text'][:40]}…'")
    reps, report = [], []
    for sid, j, text in REPLACE:
        S = T["scenes"][ids.index(sid)]["sentences"]
        s = S[j]
        # neighbours = the nearest sentences that are NOT being replaced (old audio, the level the clip must match)
        repl = {jj for ss, jj, _ in REPLACE if ss == sid}
        lo = next((i for i in range(j - 1, -1, -1) if i not in repl), None)
        hi = next((i for i in range(j + 1, len(S)) if i not in repl), None)
        nb = [S[i] for i in (lo, hi) if i is not None]
        Ln = [U.lufs(seg(x), sr) for x in nb]
        target = 10 * np.log10(np.mean([10 ** (v / 10) for v in Ln]))
        clip = synth(text)
        L0 = U.lufs(clip, sr)
        gdb = target - L0
        for _ in range(2):
            clip_l, gr = U.limiter(clip * 10 ** (gdb / 20), sr)
            gdb += target - U.lufs(clip_l, sr)
        clip_l, gr = U.limiter(clip * 10 ** (gdb / 20), sr)
        L1, tp = U.lufs(clip_l, sr), U.true_peak(clip_l)
        ok = all(abs(L1 - v) <= U.TOL_LU for v in Ln) and tp <= U.CEIL_DBTP + 1e-6
        sf.write(NEW / f"clip_{sid}_S{j + 1}.wav", clip_l, sr, subtype=subtype)
        report.append({"scene": sid, "sentence": j + 1, "old": s["text"], "new": text, "neighbours": [f"S{i + 1}" for i in (lo, hi) if i is not None],
                       "neighbours_lufs": [round(v, 2) for v in Ln], "target_lufs": round(target, 2), "raw_lufs": round(L0, 2), "gain_db": round(gdb, 2),
                       "limiter_gr_db": round(gr, 2), "final_lufs": round(L1, 2), "true_peak_dbtp": round(tp, 2), "within_1p5_lu": ok,
                       "dur_s": round(len(clip_l) / sr, 3), "old_dur_s": round(s["end"] - s["start"], 3)})
        print(f"{sid} S{j + 1}: neighbours {[round(v, 2) for v in Ln]} -> target {target:.2f}; raw {L0:.2f}, gain {gdb:+.2f} dB, "
              f"limiter {gr:.2f} dB, final {L1:.2f} LUFS, TP {tp:.2f} dBTP, ok {ok}")
        if not ok:
            raise SystemExit("splice level check failed - stop")
        reps.append((s["start"], s["end"], sid, j, text, clip_l, s["text"]))
    reps.sort(key=lambda x: x[0])
    pieces, cur, shifts = [], 0, []
    for t0, t1, sid, j, text, clip, old in reps:
        a, b = int(round(t0 * sr)), int(round(t1 * sr))
        pieces.append(nar[cur:a]); pieces.append(clip); cur = b
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
                cues.append((c0, c1, p)); c0 = c1
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
             self_check={**{k: v for k, v in prev.items() if k not in ("expected_s", "audio_s", "diff_ms", "len_ok", "cues_ok")},
                         "expected_s": round(exp, 4), "audio_s": round(total, 4), "diff_ms": round((total - exp) * 1000, 2),
                         "len_ok": abs(total - exp) <= 1 / fps, "cues_ok": all(0 <= a < b <= total + 1e-6 for a, b, _ in merged),
                         "spliced_uf2fix1": {"method": "BS.1770-4 loudness match to the two nearest unchanged neighbours + look-ahead limiter (-1.5 dBTP)",
                                             "corr_resynth": round(corr, 4), "replaced": report}})
    for d, nm in ((NEW, "captions"), (MOV, "en")):
        (d / f"{nm}.vtt").write_text("\n".join(vtt), encoding="utf-8")
        (d / f"{nm}.srt").write_text("\n".join(srt), encoding="utf-8")
    for d in (NEW, MOV):
        (d / "timing.json").write_text(json.dumps(T, indent=1, ensure_ascii=False), encoding="utf-8")
    (NEW / "splice.json").write_text(json.dumps(report, indent=1, ensure_ascii=False), encoding="utf-8")
    sp = MOV / "script.md"
    s = sp.read_text(encoding="utf-8")
    for _, _, sid, j, text, _, old in shifts:          # replace inside the scene's own narration paragraph, not the change log
        h = s.index(chr(10) + "## " + sid + chr(10))
        k = s.index(old, h) if old in s[h:] else -1
        if k < 0:
            raise SystemExit(f"script.md: sentence not found for {sid} {j + 1}: {old}")
        s = s[:k] + text + s[k + len(old):]
    sp.write_text(s, encoding="utf-8")
    print(f"total {total:.3f} s ({T['total_frames']} frames), cues {len(merged)}, self-check {T['self_check']['diff_ms']} ms, warnings {warnings}")
    for _, dt, sid, j, text, dur, old in shifts:
        print(f"  {sid} S{j + 1}: {dt:+.3f} s, {dur:.2f} s, {len(text) / dur:.1f} cps")


if __name__ == "__main__":
    main()
