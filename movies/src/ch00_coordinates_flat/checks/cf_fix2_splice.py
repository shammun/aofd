"""ch00_coordinates_flat (#5a) fix 2 — review 2 (reports/ch00_movies.md "#5a ch00_coordinates_flat — fix 1, review 2", Must 2a/2b).
Copy of cf_fix1c_splice.py with OLD = fix1c, NEW = fix2 (same method: compound replacement, one Kokoro clip per spoken sentence joined
with the 0.35-s house gap, BS.1770-4 match to the nearest unchanged neighbours, limiter -1.5 dBTP, +-1.5 LU or stop).
Run in .venv-tts:  .venv-tts/Scripts/python.exe movies/src/ch00_coordinates_flat/checks/cf_fix2_splice.py
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
OLD, NEW = SCR / "fix1c" / "tts", SCR / "fix2" / "tts"
GAP = 0.35
# (review item, scene id, sentence index 0-based, new text)
REPLACE = [
    ("M2b", "s11_theta_hat", 19, "By the arc rule, s equals r times the change in theta, so it slides five thousand metres times that: about eight point "
                                 "seven metres along the circle."),
    ("M2a", "s11_theta_hat", 22, "That's about seven metres west, and five point two metres north. Check: seven squared is forty nine, and five point two "
                                 "squared is twenty seven point zero four. The square root of seventy six point zero four is about eight point seven: the "
                                 "same slide."),
]
split = lambda t: [x for x in re.split(r"(?<=[.?!])\s+", t.strip()) if x]  # noqa: E731


def main() -> None:
    NEW.mkdir(parents=True, exist_ok=True)
    T = json.loads((OLD / "timing.json").read_text(encoding="utf-8"))
    assert T == json.loads((MOV / "timing.json").read_text(encoding="utf-8")), "movie timing.json is not the fix-1b timing"
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
                         "spliced_fix2": {"method": "compound replacement: one Kokoro clip per spoken sentence, 0.35-s house gap inside an entry; "
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
