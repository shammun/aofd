"""ch00_coordinates_flat (#5a) — user feedback 2026-11-06 (movies/ch00/coordinates_series/master_plan_2026-11-07.md R1-R4, R6-R9, and the
user's clarification of 2026-11-07: minimal changes, link to Part 2). Copy of cf_fix2_splice.py with OLD = fix2, NEW = fb1106 (same method:
compound replacement, one Kokoro clip per spoken sentence joined with the 0.35-s house gap, BS.1770-4 match to the nearest unchanged
neighbours, limiter -1.5 dBTP, +-1.5 LU or stop). Sentence indices never change (compound entries), so the scene code keeps its SS/AT.
Run in .venv-tts:  .venv-tts/Scripts/python.exe movies/src/ch00_coordinates_flat/checks/cf_fb1106_splice.py
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import cf_fix1_splice as F1  # noqa: E402

tts, U = F1.tts, F1.U
MOV, SCR = F1.MOV, F1.SCR
OLD, NEW = SCR / "fix2" / "tts", SCR / "fb1106" / "tts"
GAP = 0.35
# (review item, scene id, sentence index 0-based, new text)
REPLACE = [
    ("R1", "s00_title", 0, "In this video, we'll learn coordinates on a flat map, and see how meteorology uses them to measure the winds round a "
                           "hurricane's eye."),
    ("R1", "s19_index_form", 21, "The same rule works in three dimensions, and for things called tensors, which we'll meet in our tensors movie, "
                                 "later in this series."),
    ("R8", "s22_spin_inflow", 4, "Then we average each part round the ring: we add up the seventy two values, and divide by seventy two. In symbols, "
                                 "the average radial wind, u sub r bar, is one over N times the sum of all the u sub r values, from point one to point "
                                 "N. Here N is seventy two, one point every five degrees round the ring. The average tangential wind, u sub theta bar, "
                                 "is made in the same way."),
    ("R8", "s22_spin_inflow", 9, "The seventy two radial winds start with minus eight point seven at theta equals zero, minus ten point three at five "
                                 "degrees, and minus eleven point two at ten degrees, and they go on all the way round the ring. Together they add up "
                                 "to about minus nine hundred and fifty seven. Divided by seventy two, that's about minus thirteen point three, or "
                                 "about minus thirteen metres per second."),
    ("R7", "s24_ring_points", 23, "The other points work the same way, so here are five more, without the arithmetic. With all eight points, every "
                                  "forty five degrees round the ring, the in or out arrows point inward at seven of them, and outward only at two "
                                  "hundred and twenty five degrees, on the southwest side. The computer does exactly this at all seventy two points, "
                                  "and then takes the averages. And our first point, minus eight point seven at theta equals zero, is the very first "
                                  "term of the radial sum."),
    ("R9", "s25_why_polar_storm", 14, "That's why hurricane scientists use polar coordinates. The same idea works on a coast, where we turn the axes to "
                                      "split the wind into a part along the shore and a part across it. Wind blowing across the shore, towards the land, "
                                      "pushes sea water onto the coast. In Part 2, we'll use these same equations on real storms. We'll measure how much "
                                      "of the wind blew onto the land, see on tide gauges how high the water rose, and then look at the flooded land in "
                                      "satellite pictures taken before and after the storm."),
    ("R3", "s27_recap", 10, "In Part 2, we'll find out how fast r hat and theta hat turn as we go round, and add height to get cylindrical "
                            "coordinates. Then we'll use these same turned axes on real storms: how much wind blew onto the land, how high the "
                            "water rose, and what the flooding looked like from space, before and after."),
]
split = lambda t: [x for x in re.split(r"(?<=[.?!])\s+", t.strip()) if x]  # noqa: E731


def main() -> None:
    NEW.mkdir(parents=True, exist_ok=True)
    T = json.loads((OLD / "timing.json").read_text(encoding="utf-8"))
    assert T == json.loads((MOV / "timing.json").read_text(encoding="utf-8")), "movie timing.json is not the fix-2 timing"
    nar, sr = sf.read(OLD / "narration.wav", dtype="float32")
    subtype = sf.info(str(OLD / "narration.wav")).subtype
    fps = T["fps"]
    from kokoro import KPipeline
    pipe = KPipeline(lang_code="a", repo_id="hexgrad/Kokoro-82M")
    lex = tts.load_lexicon()

    import hashlib
    cache = NEW / "cache"
    cache.mkdir(exist_ok=True)

    def synth(text: str) -> np.ndarray:      # raw Kokoro output cached per sentence (Kokoro is deterministic; re-runs reuse it)
        f = cache / (hashlib.sha1(tts.respell(text, lex).encode("utf-8")).hexdigest()[:16] + ".npy")
        if f.exists():
            return np.load(f)
        x = np.concatenate([np.asarray(c, dtype=np.float32) for _, _, c in pipe(tts.respell(text, lex), voice="af_bella", speed=1.0)])
        np.save(f, x)
        return x

    ids = [s["id"] for s in T["scenes"]]
    seg = lambda s: nar[int(round(s["start"] * sr)): int(round(s["end"] * sr))]  # noqa: E731
    edits, report = [], []
    for item, sid, j, text in REPLACE:
        S = T["scenes"][ids.index(sid)]["sentences"]
        repl = {jj for _, ss, jj, _ in REPLACE if ss == sid}
        lo = next((i for i in range(j - 1, -1, -1) if i not in repl), None)
        hi = next((i for i in range(j + 1, len(S)) if i not in repl), None)
        nb = [i for i in (lo, hi) if i is not None]
        Ln = [U.lufs(seg(S[i]), sr) for i in nb]
        if not Ln:                               # a one-sentence scene (s00): the first two sentences of the next scene are the neighbours
            S2 = T["scenes"][ids.index(sid) + 1]["sentences"]
            Ln = [U.lufs(seg(S2[0]), sr), U.lufs(seg(S2[1]), sr)]
        target = 10 * np.log10(np.mean([10 ** (v / 10) for v in Ln]))
        parts, rep_parts = [], []
        for q, sent in enumerate(split(text)):
            clip = synth(sent)
            L0 = U.lufs(clip, sr)
            gdb = target - L0
            for _ in range(2):
                cl, gr = U.limiter(clip * 10 ** (gdb / 20), sr)
                gdb += target - U.lufs(cl, sr)
            cl, gr = U.limiter(clip * 10 ** (gdb / 20), sr)
            L1, tp = U.lufs(cl, sr), U.true_peak(cl)
            for _ in range(3):                   # an inter-sample peak the sample-peak limiter missed: trim the clip's gain a little
                if tp <= U.CEIL_DBTP:
                    break
                cl = cl * 10 ** ((U.CEIL_DBTP - tp - 0.1) / 20)
                L1, tp = U.lufs(cl, sr), U.true_peak(cl)
            ok = all(abs(L1 - v) <= U.TOL_LU for v in Ln) and tp <= U.CEIL_DBTP + 1e-6
            if not ok:
                raise SystemExit(f"{item} {sid} S{j + 1}.{q + 1}: level check failed ({L1:.2f} vs {Ln}, TP {tp:.2f}) - stop")
            if q:
                parts.append(np.zeros(int(round(GAP * sr)), dtype=np.float32))
            parts.append(cl.astype(np.float32))
            rep_parts.append({"text": sent, "gain_db": round(gdb, 2), "limiter_gr_db": round(gr, 2), "final_lufs": round(L1, 2), "true_peak_dbtp": round(tp, 2)})
        clip = np.concatenate(parts)
        sf.write(NEW / f"clip_{item}_{sid[:3]}_S{j + 1}.wav", clip, sr, subtype=subtype)
        rep = {"item": item, "scene": sid, "sentence": j + 1, "old": S[j]["text"], "new": text, "neighbours_lufs": [round(v, 2) for v in Ln],
               "dur_s": round(len(clip) / sr, 3), "old_dur_s": round(S[j]["end"] - S[j]["start"], 3), "parts": rep_parts}
        report.append(rep)
        print(f"{item} {sid} S{j + 1}: {rep['old_dur_s']:.2f} -> {rep['dur_s']:.2f} s, {len(rep_parts)} clip(s), "
              f"LUFS {[p['final_lufs'] for p in rep_parts]} vs {rep['neighbours_lufs']}, GR max {min(p['limiter_gr_db'] for p in rep_parts):.2f} dB")
        edits.append(dict(t0=S[j]["start"], t1=S[j]["end"], sid=sid, j=j, text=text, clip=clip, old=S[j]["text"]))
    edits.sort(key=lambda e: e["t0"])
    pieces, cur, shifts = [], 0, []
    for e in edits:
        a, b = int(round(e["t0"] * sr)), int(round(e["t1"] * sr))
        pieces.append(nar[cur:a]); pieces.append(e["clip"]); cur = b
        shifts.append((e["t1"], len(e["clip"]) / sr - (b - a) / sr, e))
    pieces.append(nar[cur:])
    out = np.concatenate(pieces)
    sf.write(NEW / "narration.wav", out, sr, subtype=subtype)
    total = len(out) / sr

    def shift(t: float, inclusive: bool = False) -> float:
        return t + sum(dt for te, dt, _ in shifts if (t >= te - 1e-9 if inclusive else t > te + 1e-9))

    for sc in T["scenes"]:
        for s in sc["sentences"]:
            s["start"], s["end"] = round(shift(s["start"]), 4), round(shift(s["end"], inclusive=True), 4)
        sc["start"], sc["end"] = round(shift(sc["start"]), 4), round(shift(sc["end"], inclusive=True), 4)
    for _, _, e in shifts:
        s = T["scenes"][ids.index(e["sid"])]["sentences"][e["j"]]
        a_txt = tts.respell(e["text"], lex)
        dur = len(e["clip"]) / sr
        s.update(text=e["text"], audio_text=a_txt if a_txt != e["text"] else None, dur=round(dur, 4), end=round(s["start"] + dur, 4))
    warnings = []
    for sc in T["scenes"]:
        for k, s in enumerate(sc["sentences"]):
            s["start_frame"], s["end_frame"] = round(s["start"] * fps), round(s["end"] * fps)
            if len(s["text"]) / s["dur"] > tts.MAX_CPS:
                warnings.append(f"{sc['id']} s{k + 1}: {len(s['text']) / s['dur']:.1f} chars/s > {tts.MAX_CPS}")
        sc["start_frame"], sc["end_frame"] = round(sc["start"] * fps), round(sc["end"] * fps)
    vtt, srt, cw, ncues = F1.build_cues(T)
    warnings += cw
    exp = T["scenes"][-1]["end"]
    prev = T.get("self_check", {})
    T.update(total_s=round(total, 4), total_frames=int(np.ceil(total * fps)), cues=ncues, warnings=warnings,
             self_check={**{k: v for k, v in prev.items() if k not in ("expected_s", "audio_s", "diff_ms", "len_ok", "cues_ok")},
                         "expected_s": round(exp, 4), "audio_s": round(total, 4), "diff_ms": round((total - exp) * 1000, 2),
                         "len_ok": abs(total - exp) <= 1 / fps, "cues_ok": True,
                         "spliced_fb1106": {"method": "compound replacement: one Kokoro clip per spoken sentence, 0.35-s house gap inside an entry; "
                                                     "BS.1770-4 match to the nearest unchanged neighbours + limiter (-1.5 dBTP)", "replaced": report}})
    for d, nm in ((NEW, "captions"), (MOV, "en")):
        (d / f"{nm}.vtt").write_text("\n".join(vtt), encoding="utf-8")
        (d / f"{nm}.srt").write_text("\n".join(srt), encoding="utf-8")
    for d in (NEW, MOV):
        (d / "timing.json").write_text(json.dumps(T, indent=1, ensure_ascii=False), encoding="utf-8")
    (NEW / "splice.json").write_text(json.dumps(report, indent=1, ensure_ascii=False), encoding="utf-8")
    sp = MOV / "script.md"
    s = sp.read_text(encoding="utf-8")
    for _, _, e in shifts:
        h = s.index("\n## " + e["sid"] + "\n")
        if e["old"] not in s[h:]:
            raise SystemExit(f"script.md: sentence not found for {e['sid']}: {e['old']}")
        k = s.index(e["old"], h)
        s = s[:k] + e["text"] + s[k + len(e["old"]):]
    sp.write_text(s, encoding="utf-8")
    print(f"total {total:.3f} s ({T['total_frames']} frames), cues {ncues}, self-check {T['self_check']['diff_ms']} ms, warnings {warnings}")


if __name__ == "__main__":
    main()
