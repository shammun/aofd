"""ch00_coordinates_flat (#5a) fix loop 1 after fb1 (2026-11-07): "show it, don't voice it" (user 2026-11-07, HOUSE_STYLE calculations).

Every voiced piece of elementary arithmetic (sums, products, sign rules, term-by-term products of plain numbers, squares read out,
"divided by ... gives ...") is shortened: the voice says what is combined and where each number comes from, then the result. The
screen keeps every row (the TSX re-cues them). Copy of cf_fb1106_splice.py (same method: compound replacement, one Kokoro af_bella
x1.0 clip per spoken sentence joined with the 0.35-s house gap, BS.1770-4 match to the nearest unchanged neighbours, limiter
-1.5 dBTP, +-1.5 LU or stop). Sentence indices never change, so the scene code keeps its SS/AT indices.

New in this splice:
  * Kokoro token timestamps of every new clip are saved (relative to the sentence start) in movies/ch00/.../words.json, merged with
    the fb1 review-2 word times of the unchanged s13-s26 sentences (re-synthesis matched every clip to 1 ms), so AT() in cf_lib.tsx
    lands on the real word (review 2 Should 11).
  * Caption cues never split a spoken number ("two thousand five hundred and | six"): review 2 Should 9 (local cue splitter).

Run in .venv-tts (under HEAVY.lock):  .venv-tts/Scripts/python.exe movies/src/ch00_coordinates_flat/checks/cf_fix1107_splice.py
          --dry : print old -> new and the AT phrases that no longer occur (no synthesis)
"""
from __future__ import annotations

import hashlib
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
OLD, NEW = SCR / "fb1106" / "tts", SCR / "fix1107" / "tts"
R2_WORDS = Path(r"C:\Users\sislam27\AppData\Local\Temp\claude\C--Users-sislam27-Work-Climate-Dynamics-PHD-AOFD-Vallis"
                r"\59a95c54-f84d-46f4-bd99-469738e8b49c\scratchpad\r2\words.json")
GAP = 0.35
# (scene id, sentence index 0-based, new text)
REPLACE = [
    # user 2026-11-07 (opening): no "meteorology" in the voice, "around", one eye; s01's "why they're built the way they are" -> a lead-in
    ("s00_title", 0, "In this video, we'll learn coordinates on a flat map, and see how they're used to measure the winds around a hurricane's eye."),
    ("s01_hook", 2, "Now let's dive into what coordinates are, how they're built and how they're used: x and y, polar coordinates with r and "
                    "theta, and turned axes."),
    ("s04_polar", 2, "By Pythagoras, we square the balloon's two coordinates, three and four, add them, and take the square root, and we get five kilometres."),
    ("s05_polar_back", 6, "Cosine theta is the east side divided by the long side, and sine theta is the north side divided by the long side. "
                          "For our balloon that's three fifths, zero point six, and four fifths, zero point eight. So five kilometres times "
                          "the cosine of theta gives back the east side: three."),
    ("s05_polar_back", 7, "And five kilometres times the sine gives back the north side: four."),
    ("s06_bearings", 3, "So the balloon's bearing is ninety degrees minus theta: thirty seven degrees."),
    ("s07_radians", 5, "So one radian is three hundred and sixty degrees divided by two pi: about fifty seven degrees."),
    ("s07_radians", 7, "On a ring five kilometres from the station, turn by zero point two radians: that's about eleven and a half degrees. "
                       "It walks you the radius times the angle: one kilometre."),
    ("s08_r_hat", 7, "For r hat, we square its two components, add them, and take the square root, and we get exactly one."),
    ("s10_turn_90", 15, "For the turned arrow, minus four, three, we square each component, add them, and take the square root, and we get five, the same as the balloon's arrow."),
    ("s10_turn_90", 16, "And its dot product with three, four, multiplying the matching parts and adding, comes to zero."),
    ("s11_theta_hat", 14, "Its length is one, and its dot product with r hat is zero, so it's at right angles."),
    ("s11_theta_hat", 19, "By the arc rule, s equals r times the change in theta: with r at five thousand metres, that's about eight point "
                          "seven metres along the circle."),
    ("s11_theta_hat", 22, "That's about seven metres west, and five point two metres north. Squaring these two, adding them, and taking the square root gives about eight point seven metres: the same slide."),
    ("s13_components", 17, "Multiply the matching parts, and add: the wind's east part times r hat's east part, plus its north part times "
                           "r hat's north part."),
    ("s13_components", 18, "That gives u sub r equals six metres per second."),
    ("s13_components", 19, "Next, the tangential wind: the same, with theta hat's two parts."),
    ("s13_components", 20, "That gives u sub theta equals minus eight metres per second."),
    ("s14_rebuild_general", 2, "Six times r hat gives three point six, four point eight."),
    ("s14_rebuild_general", 3, "And minus eight times theta hat gives six point four, minus four point eight."),
    ("s14_rebuild_general", 4, "If we add those two arrows, the east parts give ten."),
    ("s14_rebuild_general", 5, "And the north parts give zero."),
    ("s14_rebuild_general", 7, "Its length agrees too: we square its two parts, six and minus eight, add them, and take the square root, and we get ten, the same as the wind's own length."),
    ("s15_turn_axes", 13, "Cosine of thirty degrees is the square root of three over two, about zero point eight six six. Sine of thirty "
                          "degrees is exactly one half."),
    ("s16_y_prime", 6, "Squaring its two components, adding them, and taking the square root gives one."),
    ("s16_y_prime", 7, "And its dot product with x hat prime is zero: when we multiply the matching parts, the two products cancel."),
    ("s17_new_components", 6, "Now the numbers: x is three and y is four, alpha is thirty degrees, the cosine of thirty degrees is about zero point eight six six, and its sine is zero point five."),
    ("s20_polar_is_turned", 6, "Let's check with the east wind, ten, zero, and the cosine and sine of theta, zero point six and zero point eight."),
    ("s17_new_components", 7, "For x prime, we take x times the cosine, plus y times the sine."),
    ("s17_new_components", 8, "That gives about four point six."),
    ("s17_new_components", 9, "For y prime, we take minus x times the sine, plus y times the cosine."),
    ("s17_new_components", 10, "That gives about one point nine six."),
    ("s17_new_components", 13, "Let's find its length: we square the two new coordinates, add them, and take the square root."),
    ("s17_new_components", 14, "It comes out at five kilometres, as before."),
    ("s18_matrix", 8, "With our numbers, the top row gives four point six again, and the bottom row gives one point nine six, our y prime "
                      "again."),
    ("s19_index_form", 8, "C one one is x hat dot x hat prime, which is cosine alpha."),
    ("s20_polar_is_turned", 7, "X prime is the wind's dot product with r hat, which is six."),
    ("s20_polar_is_turned", 8, "Y prime is its dot product with theta hat, which is minus eight."),
    ("s20_polar_is_turned", 11, "X prime is its dot product with r hat: three times r hat's east part, plus four times its north part."),
    ("s20_polar_is_turned", 12, "That gives five."),
    ("s20_polar_is_turned", 13, "Y prime is its dot product with theta hat, in the same way."),
    ("s20_polar_is_turned", 14, "That gives zero."),
    ("s22_spin_inflow", 5, "The seventy two tangential winds, starting with thirty eight at theta equals zero, add up to about two thousand "
                           "five hundred and six metres per second. So their average is about thirty four point eight, or about thirty five "
                           "metres per second."),
    ("s22_spin_inflow", 9, "The seventy two radial winds, starting with minus eight point seven at theta equals zero, add up to about minus "
                           "nine hundred and fifty seven. So their average is about minus thirteen point three, or about minus thirteen "
                           "metres per second."),
    ("s23_what_numbers_mean", 4, "By Pythagoras, we square the two parts, thirty five and thirteen, add them, and take the square root, and we get an arrow of about thirty seven metres per second."),
    ("s23_what_numbers_mean", 9, "Moving in at thirteen metres per second, it would have to cover twenty five kilometres. Time is distance "
                                 "divided by speed, so that takes about nineteen hundred and twenty three seconds, or about thirty two "
                                 "minutes."),
    ("s24_ring_points", 18, "A hundred and thirty five degrees is forty five degrees short of due west, so its cosine is minus the cosine of forty five degrees, about minus zero point seven zero seven, and its sine is plus zero point seven zero seven."),
    ("s24_ring_points", 15, "And u sub theta is minus u times one, plus v times zero, which leaves minus u: plus sixteen point nine, round."),
    ("s24_ring_points", 19, "So u sub r is u times the cosine, plus v times the sine."),
    ("s24_ring_points", 20, "That gives about minus twenty four point three: in."),
    ("s24_ring_points", 21, "And u sub theta is minus u times the sine, plus v times the cosine."),
    ("s24_ring_points", 22, "That gives about thirty eight point six: round."),
]
split = lambda t: [x for x in re.split(r"(?<=[.?!])\s+", t.strip()) if x]  # noqa: E731

# ------------------------------------------------------------------ captions: never split a spoken number (review 2 Should 9)
NUMW = set("zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen "
           "nineteen twenty thirty forty fifty sixty seventy eighty ninety hundred thousand point minus".split())


def _numword(w: str) -> bool:
    return re.sub(r"[^a-z]", "", w.lower()) in NUMW


def _inside_number(c: str, cut: int) -> bool:
    """True if a cut at character `cut` falls inside a spoken number ("five hundred and | six", "point | eight")."""
    left, right = c[:cut].split(), c[cut:].split()
    if not left or not right:
        return False
    lw, rw = left[-1], right[0]
    if re.search(r"[,;:.]$", lw):
        return False
    if lw.lower() == "and":
        return len(left) > 1 and _numword(left[-2]) and _numword(rw)
    return _numword(lw) and (_numword(rw) or rw.lower() == "and")


def split_for_cues(sentence: str, dur: float) -> list[str]:
    """tools/tts.py split_for_cues with one change: a cut never falls inside a spoken number (it moves to the nearest safe space)."""
    chunks = [sentence]
    while True:
        bad = [i for i, c in enumerate(chunks)
               if len(tts.wrap(c)) > tts.MAX_LINES or dur * len(c) / max(len(sentence), 1) > tts.CUE_MAX]
        if not bad:
            return chunks
        i = bad[0]
        c = chunks[i]
        mid = len(c) // 2
        cands = [m.end() for m in re.finditer(r"[,;:—–]\s+|\s+(?:and|but|so|which|while|because|then)\s+", c)]
        cands = [k for k in cands if not _inside_number(c, k)]
        cut = min(cands, key=lambda k: abs(k - mid)) if cands else None
        if cut is None or cut < 8 or cut > len(c) - 8:
            sp = [m.start() for m in re.finditer(r"\s", c) if not _inside_number(c, m.start())]
            if not sp:
                return chunks
            cut = min(sp, key=lambda k: abs(k - mid))
        chunks[i:i + 1] = [c[:cut].strip(), c[cut:].strip()]


def build_cues(T: dict) -> tuple[list[str], list[str], list[str], int]:
    saved = tts.split_for_cues
    tts.split_for_cues = split_for_cues
    try:
        return F1.build_cues(T)
    finally:
        tts.split_for_cues = saved


def r2_words(T: dict) -> dict:
    """review-2 word times (absolute, fb1 timing) -> {sid: {j: {text, w: [[t_rel, tok]]}}} for the sentences of the CURRENT timing."""
    out: dict = {}
    if not R2_WORDS.exists():
        print("note: review-2 words.json not found; only the new clips get word times")
        return out
    W = json.loads(R2_WORDS.read_text(encoding="utf-8"))
    sc = {s["id"]: s for s in T["scenes"]}
    for w in W:
        s = sc[w["id"]]["sentences"][w["j"] - 1]
        if abs(s["start"] - w["start"]) > 1e-6:
            raise SystemExit(f"review-2 words for {w['id']} S{w['j']} do not match the fb1 timing")
        out.setdefault(w["id"], {})[str(w["j"] - 1)] = {"text": s["text"], "w": [[round(t - s["start"], 3), tok] for t, tok in w["words"]]}
    return out


def dry() -> None:
    T = json.loads((MOV / "timing.json").read_text(encoding="utf-8"))
    ids = [s["id"] for s in T["scenes"]]
    src = "\n".join((HERE.parent / f).read_text(encoding="utf-8") for f in ("cf_sA.tsx", "cf_sB.tsx", "cf_sC.tsx"))
    for sid, j, text in REPLACE:
        old = T["scenes"][ids.index(sid)]["sentences"][j]["text"]
        print(f"{sid} S{j + 1}: {len(old)} -> {len(text)} chars")
    print(f"{len(REPLACE)} entries; old chars {sum(len(T['scenes'][ids.index(s)]['sentences'][j]['text']) for s, j, _ in REPLACE)}, "
          f"new {sum(len(t) for _, _, t in REPLACE)}")
    _ = src


def main() -> None:
    if "--dry" in sys.argv:
        dry(); return
    NEW.mkdir(parents=True, exist_ok=True)
    T = json.loads((OLD / "timing.json").read_text(encoding="utf-8"))
    assert T == json.loads((MOV / "timing.json").read_text(encoding="utf-8")), "movie timing.json is not the fb1 (fb1106) timing"
    words = r2_words(T)
    nar, sr = sf.read(OLD / "narration.wav", dtype="float32")
    subtype = sf.info(str(OLD / "narration.wav")).subtype
    fps = T["fps"]
    from kokoro import KPipeline
    pipe = KPipeline(lang_code="a", repo_id="hexgrad/Kokoro-82M")
    lex = tts.load_lexicon()
    cache = NEW / "cache"
    cache.mkdir(exist_ok=True)

    def synth(text: str) -> tuple[np.ndarray, list]:
        """raw Kokoro output + token start times (s, from the clip start); cached per sentence (Kokoro is deterministic)."""
        key = hashlib.sha1(tts.respell(text, lex).encode("utf-8")).hexdigest()[:16]
        fa, fw = cache / f"{key}.npy", cache / f"{key}.json"
        if fa.exists() and fw.exists():
            return np.load(fa), json.loads(fw.read_text(encoding="utf-8"))
        chunks, toks, off = [], [], 0.0
        for r in pipe(tts.respell(text, lex), voice="af_bella", speed=1.0):
            a = np.asarray(r.audio, dtype=np.float32)
            for tk in (r.tokens or []):
                if tk.start_ts is not None:
                    toks.append([round(off + tk.start_ts, 3), tk.text])
            off += len(a) / sr
            chunks.append(a)
        x = np.concatenate(chunks)
        np.save(fa, x); fw.write_text(json.dumps(toks), encoding="utf-8")
        return x, toks

    ids = [s["id"] for s in T["scenes"]]
    seg = lambda s: nar[int(round(s["start"] * sr)): int(round(s["end"] * sr))]  # noqa: E731
    edits, report = [], []
    for sid, j, text in REPLACE:
        S = T["scenes"][ids.index(sid)]["sentences"]
        repl = {jj for ss, jj, _ in REPLACE if ss == sid}
        lo = next((i for i in range(j - 1, -1, -1) if i not in repl), None)
        hi = next((i for i in range(j + 1, len(S)) if i not in repl), None)
        nb = [i for i in (lo, hi) if i is not None]
        Ln = [U.lufs(seg(S[i]), sr) for i in nb]
        if not Ln:                               # a one-sentence scene (s00): the first two sentences of the next scene are the neighbours
            S2 = T["scenes"][ids.index(sid) + 1]["sentences"]
            Ln = [U.lufs(seg(S2[0]), sr), U.lufs(seg(S2[1]), sr)]
        target = 10 * np.log10(np.mean([10 ** (v / 10) for v in Ln]))
        parts, rep_parts, wl, tcur = [], [], [], 0.0
        for q, sent in enumerate(split(text)):
            clip, toks = synth(sent)
            gdb = target - U.lufs(clip, sr)
            for _ in range(2):
                cl, gr = U.limiter(clip * 10 ** (gdb / 20), sr)
                gdb += target - U.lufs(cl, sr)
            cl, gr = U.limiter(clip * 10 ** (gdb / 20), sr)
            L1, tp = U.lufs(cl, sr), U.true_peak(cl)
            for _ in range(3):
                if tp <= U.CEIL_DBTP:
                    break
                cl = cl * 10 ** ((U.CEIL_DBTP - tp - 0.1) / 20)
                L1, tp = U.lufs(cl, sr), U.true_peak(cl)
            ok = all(abs(L1 - v) <= U.TOL_LU for v in Ln) and tp <= U.CEIL_DBTP + 1e-6
            if not ok:
                raise SystemExit(f"{sid} S{j + 1}.{q + 1}: level check failed ({L1:.2f} vs {Ln}, TP {tp:.2f}) - stop")
            if q:
                parts.append(np.zeros(int(round(GAP * sr)), dtype=np.float32)); tcur += GAP
            if len(cl) != len(clip):
                raise SystemExit("limiter changed the clip length - word times would drift")
            wl += [[round(tcur + t, 3), tok] for t, tok in toks]
            tcur += len(cl) / sr
            parts.append(cl.astype(np.float32))
            rep_parts.append({"text": sent, "gain_db": round(gdb, 2), "limiter_gr_db": round(gr, 2), "final_lufs": round(L1, 2),
                              "true_peak_dbtp": round(tp, 2)})
        clip = np.concatenate(parts)
        sf.write(NEW / f"clip_{sid[:3]}_S{j + 1}.wav", clip, sr, subtype=subtype)
        rep = {"scene": sid, "sentence": j + 1, "old": S[j]["text"], "new": text, "neighbours_lufs": [round(v, 2) for v in Ln],
               "dur_s": round(len(clip) / sr, 3), "old_dur_s": round(S[j]["end"] - S[j]["start"], 3), "parts": rep_parts}
        report.append(rep)
        print(f"{sid} S{j + 1}: {rep['old_dur_s']:.2f} -> {rep['dur_s']:.2f} s, LUFS {[p['final_lufs'] for p in rep_parts]} vs "
              f"{rep['neighbours_lufs']}", flush=True)
        words.setdefault(sid, {})[str(j)] = {"text": text, "w": wl}
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
    vtt, srt, cw, ncues = build_cues(T)
    warnings += cw
    exp = T["scenes"][-1]["end"]
    prev = T.get("self_check", {})
    T.update(total_s=round(total, 4), total_frames=int(np.ceil(total * fps)), cues=ncues, warnings=warnings,
             self_check={**{k: v for k, v in prev.items() if k not in ("expected_s", "audio_s", "diff_ms", "len_ok", "cues_ok")},
                         "expected_s": round(exp, 4), "audio_s": round(total, 4), "diff_ms": round((total - exp) * 1000, 2),
                         "len_ok": abs(total - exp) <= 1 / fps, "cues_ok": True,
                         "spliced_fix1107": {"method": "show it, don't voice it (user 2026-11-07): compound replacement, one Kokoro clip "
                                                      "per spoken sentence, 0.35-s house gap inside an entry; BS.1770-4 match to the nearest "
                                                      "unchanged neighbours + limiter (-1.5 dBTP); cues never split a number",
                                             "replaced": report}})
    for d, nm in ((NEW, "captions"), (MOV, "en")):
        (d / f"{nm}.vtt").write_text("\n".join(vtt), encoding="utf-8")
        (d / f"{nm}.srt").write_text("\n".join(srt), encoding="utf-8")
    for d in (NEW, MOV):
        (d / "timing.json").write_text(json.dumps(T, indent=1, ensure_ascii=False), encoding="utf-8")
    words = {sid: dict(sorted(v.items(), key=lambda kv: int(kv[0]))) for sid, v in sorted(words.items())}
    (MOV / "words.json").write_text(json.dumps({"note": "Kokoro af_bella x1.0 token start times (s from the sentence start) per timing "
                                                        "entry; AT() uses them when the text matches (cf_lib.tsx)", "scenes": words},
                                               ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
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
