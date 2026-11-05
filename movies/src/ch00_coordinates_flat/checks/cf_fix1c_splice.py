"""ch00_coordinates_flat (#5a) fix 1c — calculation audit (reports/ch00_movies.md "#5a … calculation & sync audit", C1-C43): the spoken
arithmetic is added. Each edit replaces ONE timing sentence by new text that may hold several spoken sentences, so every sentence index the
TSX uses stays valid (scenes keep their sentence counts); inside a compound entry each spoken sentence is its own Kokoro clip, joined with the
house 0.35-s sentence gap (sounds exactly like separate sentences). Captions are rebuilt from the text by tts.py's cue rules.

Method otherwise = cf_fix1_splice.py: af_bella x1.0 + lexicon; one gain per clip to the BS.1770-4 loudness of the nearest unchanged neighbours
in the scene; 5-ms look-ahead limiter at -1.5 dBTP; every clip within +-1.5 LU, else stop. Gaps between timing sentences are untouched.
Inputs  G:/.../fix1b/tts (== movies/.../timing.json, asserted).  Outputs G:/.../fix1c/tts; movies/.../{timing.json,en.vtt,en.srt,script.md}
Run in .venv-tts:  .venv-tts/Scripts/python.exe movies/src/ch00_coordinates_flat/checks/cf_fix1c_splice.py
A later splice copies this file with OLD = fix1c.
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
OLD, NEW = SCR / "fix1b" / "tts", SCR / "fix1c" / "tts"
GAP = 0.35
# (audit item, scene id, sentence index 0-based, new text)
REPLACE = [
    ("C1", "s03_cartesian_arrows", 2, "The balloon's position is three times x hat, plus four times y hat. Three steps of x hat take us three kilometres east, "
                                      "and four steps of y hat take us four kilometres north, which lands exactly on the balloon."),
    ("C2", "s04_polar", 2, "By Pythagoras, r is the square root of three squared plus four squared. Three squared is nine, and four squared is sixteen, "
                           "so that's the square root of twenty five: five kilometres."),
    ("C3", "s04_polar", 5, "In a right triangle, the tangent of an angle is the side opposite it divided by the side next to it: here the north side "
                           "over the east side, four over three, about one point three three. The angle with that tangent is about fifty three point one "
                           "degrees, so theta is about fifty three degrees."),
    ("C4", "s05_polar_back", 6, "Cosine theta is the east side divided by the long side, and sine theta is the north side divided by the long side. "
                                "For our balloon that's three fifths, zero point six, and four fifths, zero point eight. So five times the cosine of theta "
                                "is five times zero point six, which is three."),
    ("C5", "s07_radians", 5, "Two pi is about six point two eight, so one radian is three hundred and sixty degrees divided by six point two eight: "
                             "about fifty seven degrees."),
    ("C6", "s07_radians", 7, "On a ring five kilometres from the station, turn by zero point two radians: that's about eleven and a half degrees. "
                             "It walks you five times zero point two, which is one kilometre."),
    ("C7", "s08_r_hat", 6, "So r hat is three fifths, four fifths, which is zero point six, zero point eight. We draw r hat at the balloon, because it "
                           "tells us the direction there."),
    ("C8", "s08_r_hat", 7, "Its length is the square root of zero point six squared plus zero point eight squared. That's zero point three six plus "
                           "zero point six four, which is one, and the square root of one is one."),
    ("C9", "s09_where_theta_grows", 9, "If its move had any part along r hat, the balloon would get further from the station, or closer to it. For example, "
                                       "with a part of a tenth of a kilometre along r hat, it would end up five point one or four point nine kilometres "
                                       "from the station, not five."),
    ("C11", "s10_turn_90", 10, "p times zero, one is zero, p, and q times minus one, zero is minus q, zero. Adding the east parts gives minus q, and "
                               "adding the north parts gives p. So the turned arrow is minus q, p."),
    ("C12", "s10_turn_90", 15, "Minus four squared is sixteen and three squared is nine, so its length is the square root of twenty five: five, the "
                               "same as the balloon's arrow."),
    ("C15", "s11_theta_hat", 9, "At theta equals zero, the point is due east of the station. Minus sine zero is zero, and cosine zero is one, so theta "
                                "hat is zero, one."),
    ("C15", "s11_theta_hat", 11, "At ninety degrees, the point is due north. Minus sine ninety is minus one, and cosine ninety is zero, so theta hat is "
                                 "minus one, zero."),
    ("C19", "s14_rebuild_general", 3, "Minus eight times minus zero point eight is plus six point four, because two minus signs make a plus, and minus "
                                      "eight times zero point six is minus four point eight."),
    ("C20", "s14_rebuild_general", 7, "Its length agrees too: six squared is thirty six and eight squared is sixty four, which makes a hundred, and its "
                                      "square root is ten: the same as the wind's own length."),
    ("C21", "s15_turn_axes", 13, "Cosine of thirty degrees is the square root of three over two: one point seven three two over two, about zero point "
                                 "eight six six. Sine of thirty degrees is exactly one half."),
    ("C23", "s16_y_prime", 7, "And its dot product with x hat prime is zero point eight six six times minus zero point five, plus zero point five times "
                              "zero point eight six six. That's minus zero point four three three plus zero point four three three, which is zero."),
    ("C24", "s17_new_components", 14, "Four point six squared is about twenty one point one six, and one point nine six squared is about three point "
                                      "eight four. Together that's twenty five, and its square root is five kilometres, as before."),
    ("C26", "s18_matrix", 8, "With our numbers, the top row gives zero point eight six six times three, plus zero point five times four: four point six "
                             "again. And the bottom row gives minus zero point five times three, plus zero point eight six six times four: one point "
                             "nine six, our y prime again."),
    ("C27", "s18_matrix", 10, "The dot product of two arrows of length one is the cosine of the angle between them. As in the dot product movie: length "
                              "times length times the cosine of the angle, and both lengths are one."),
    ("C27", "s18_matrix", 13, "For example, the angle between x hat prime and x hat is alpha, so their dot product is cosine alpha: the top left number. "
                              "The angle between x hat prime and y hat is ninety degrees minus alpha, and its cosine is sine alpha. The angle between "
                              "y hat prime and x hat is ninety degrees plus alpha, and its cosine is minus sine alpha."),
    ("C28", "s19_index_form", 8, "C one one is x hat dot x hat prime: one times cosine alpha, plus zero times sine alpha, which is cosine alpha."),
    ("C29", "s19_index_form", 15, "That's x cosine alpha plus y sine alpha: our x prime. With our numbers that's four point six again."),
    ("C29", "s19_index_form", 17, "That's minus x sine alpha plus y cosine alpha: our y prime. With our numbers that's one point nine six."),
    ("C32", "s22_spin_inflow", 5, "The seventy two tangential winds add up to about two thousand five hundred and six metres per second. Divided by "
                                  "seventy two, that's about thirty four point eight, or about thirty five metres per second."),
    ("C32", "s22_spin_inflow", 9, "The seventy two radial winds add up to about minus nine hundred and fifty seven. Divided by seventy two, that's about "
                                  "minus thirteen point three, or about minus thirteen metres per second."),
    ("C33", "s22_spin_inflow", 13, "One knot is about one point eight five kilometres per hour, so that's about two hundred and fifty kilometres per "
                                   "hour, or about sixty nine metres per second."),
    ("C33", "s22_spin_inflow", 14, "That's the single strongest wind, while our thirty five is an average round the ring, and even the strongest wind on "
                                   "our model ring is only about forty nine. The model analysis smooths out the strongest winds."),
    ("C34", "s23_what_numbers_mean", 4, "By Pythagoras, together they make an arrow of the square root of thirty five squared plus thirteen squared. Thirty "
                                        "five squared is twelve hundred and twenty five, and thirteen squared is a hundred and sixty nine. Together "
                                        "that's thirteen hundred and ninety four, and its square root is about thirty seven metres per second."),
    ("C35", "s23_what_numbers_mean", 9, "Moving in at thirteen metres per second, it would have to cover twenty five kilometres, which is twenty five "
                                        "thousand metres. Twenty five thousand divided by thirteen is about nineteen hundred and twenty three seconds. "
                                        "Divided by sixty seconds a minute, that's about thirty two minutes."),
    ("C36", "s23_what_numbers_mean", 10, "Going round at thirty five metres per second, one lap of this ring, two pi times twenty five kilometres, is about "
                                         "a hundred and fifty seven kilometres. That takes about four thousand four hundred and ninety seconds, which is "
                                         "about seventy five minutes."),
    ("C37", "s23_what_numbers_mean", 12, "In any stretch of time, it goes thirty five metres round for every thirteen in, and thirty five over thirteen is "
                                         "about two point seven. So for every metre it moves in, it moves almost three metres round."),
    ("C38", "s24_ring_points", 15, "And u sub theta is minus u times one, plus v times zero. Minus times minus sixteen point nine makes plus sixteen "
                                   "point nine: round."),
    ("C39", "s24_ring_points", 18, "A hundred and thirty five degrees is forty five degrees short of due west, so its cosine is minus one over the "
                                   "square root of two, about minus zero point seven zero seven, and its sine is plus zero point seven zero seven."),
    ("C40", "s24_ring_points", 21, "And u sub theta is minus u times sine, so minus minus ten point one, which is plus ten point one, times zero point "
                                   "seven zero seven, plus minus forty four point five times minus zero point seven zero seven."),
    ("C43", "s26_inflow_angle", 3, "Its tangent is the side opposite the angle over the side next to it: the inward part over the round part, thirteen "
                                   "point three over thirty four point eight, about zero point three eight."),
    ("C43", "s26_inflow_angle", 4, "So the inflow angle, the angle with that tangent, is about twenty one degrees."),
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
                         "spliced_fix1c": {"method": "compound replacement: one Kokoro clip per spoken sentence, 0.35-s house gap inside an entry; "
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
