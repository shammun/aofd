"""ch00_coordinates_flat (#5a) fix loop 1, user note U1 (11:23): the s11 "tenth of a degree" check is rebuilt. Sentences S16-S19 (1-based)
of s11 are replaced by a new block of nine sentences that names every input (r = 5 km from (3, 4) km; 0.1 deg in radians; s = r dtheta;
the positions before / after from x = r cos theta, y = r sin theta; the moves; divide by 8.7) and no longer claims "no formula at all".

Same method as cf_fix1_splice.py (Kokoro af_bella x1.0 + lexicon; one gain per clip to the BS.1770-4 loudness of the block's unchanged
neighbours S15 and S20; 5-ms look-ahead limiter at -1.5 dBTP; +-1.5 LU). Inside the block the house gaps are used: 0.35 s between sentences,
1.5 s (a [beat]) after a worked number; the gap after the block (the beat before the keep line) is unchanged. Later times shift by the change.
Inputs  G:/.../fix1/tts/{narration.wav,timing.json} (== movies/.../timing.json, asserted)
Outputs G:/.../fix1b/tts/...; movies/ch00/ch00_coordinates_flat/{timing.json,en.vtt,en.srt,script.md}
Run in .venv-tts:  .venv-tts/Scripts/python.exe movies/src/ch00_coordinates_flat/checks/cf_fix1b_splice.py
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import cf_fix1_splice as F1  # noqa: E402  (tts, U, build_cues, paths)

tts, U = F1.tts, F1.U
MOV, SCR = F1.MOV, F1.SCR
OLD, NEW = SCR / "fix1" / "tts", SCR / "fix1b" / "tts"
SID, J0, J1 = "s11_theta_hat", 15, 18          # replace S16..S19 (0-based 15..18)
B = 1.5                                         # [beat]
BLOCK = [
    ("And one last check, without using the theta hat formula.", 0.35),
    ("The balloon is five kilometres from the station: three kilometres east and four north.", 0.35),
    ("Turn it by a tenth of a degree.", 0.35),
    ("In radians, that's a tenth times pi over one hundred and eighty, about zero point zero zero one seven four five.", B),
    ("By the arc rule, s equals r times theta, so it slides five thousand metres times that: about eight point seven metres along the circle.", B),
    ("Its position comes from x equals r cosine theta, and y equals r sine theta.", 0.35),
    ("It moves from three thousand metres east and four thousand metres north, to about two thousand nine hundred and ninety three, "
     "and four thousand and five point two.", 0.35),
    ("That's about seven metres west, and five point two metres north.", B),
    ("Dividing each by eight point seven gives about minus zero point eight and zero point six: theta hat again.", None),  # gap after: unchanged
]


def main() -> None:
    NEW.mkdir(parents=True, exist_ok=True)
    T = json.loads((OLD / "timing.json").read_text(encoding="utf-8"))
    assert T == json.loads((MOV / "timing.json").read_text(encoding="utf-8")), "movie timing.json is not the fix-1 timing"
    nar, sr = sf.read(OLD / "narration.wav", dtype="float32")
    subtype = sf.info(str(OLD / "narration.wav")).subtype
    fps = T["fps"]
    from kokoro import KPipeline
    pipe = KPipeline(lang_code="a", repo_id="hexgrad/Kokoro-82M")
    lex = tts.load_lexicon()

    def synth(text: str) -> np.ndarray:
        return np.concatenate([np.asarray(c, dtype=np.float32) for _, _, c in pipe(tts.respell(text, lex), voice="af_bella", speed=1.0)])

    ids = [s["id"] for s in T["scenes"]]
    sc = T["scenes"][ids.index(SID)]
    S = sc["sentences"]
    seg = lambda s: nar[int(round(s["start"] * sr)): int(round(s["end"] * sr))]  # noqa: E731
    Ln = [U.lufs(seg(S[J0 - 1]), sr), U.lufs(seg(S[J1 + 1]), sr)]
    target = 10 * np.log10(np.mean([10 ** (v / 10) for v in Ln]))
    t0, t1 = S[J0]["start"], S[J1]["end"]
    pieces, report, newS, t = [], [], [], t0
    for k, (text, gap) in enumerate(BLOCK):
        clip = synth(text)
        L0 = U.lufs(clip, sr)
        gdb = target - L0
        for _ in range(2):
            cl, gr = U.limiter(clip * 10 ** (gdb / 20), sr)
            gdb += target - U.lufs(cl, sr)
        cl, gr = U.limiter(clip * 10 ** (gdb / 20), sr)
        L1, tp = U.lufs(cl, sr), U.true_peak(cl)
        ok = all(abs(L1 - v) <= U.TOL_LU for v in Ln) and tp <= U.CEIL_DBTP + 1e-6
        sf.write(NEW / f"clip_U1_{k + 1}.wav", cl, sr, subtype=subtype)
        print(f"U1 {k + 1}: target {target:.2f}; raw {L0:.2f}, gain {gdb:+.2f} dB, limiter {gr:.2f} dB, final {L1:.2f}, TP {tp:.2f}, ok {ok}")
        if not ok:
            raise SystemExit("splice level check failed - stop")
        dur = len(cl) / sr
        a_txt = tts.respell(text, lex)
        newS.append({"text": text, "audio_text": a_txt if a_txt != text else None, "start": round(t, 4), "end": round(t + dur, 4), "dur": round(dur, 4)})
        pieces.append(cl.astype(np.float32))
        report.append({"sentence": J0 + k + 1, "new": text, "gain_db": round(gdb, 2), "limiter_gr_db": round(gr, 2), "final_lufs": round(L1, 2),
                       "true_peak_dbtp": round(tp, 2), "dur_s": round(dur, 3), "gap_after_s": gap})
        t += dur
        if gap is not None:
            pieces.append(np.zeros(int(round(gap * sr)), dtype=np.float32)); t += gap
    a, b = int(round(t0 * sr)), int(round(t1 * sr))
    blk = np.concatenate(pieces)
    out = np.concatenate([nar[:a], blk, nar[b:]])
    dt = len(blk) / sr - (b - a) / sr
    sf.write(NEW / "narration.wav", out, sr, subtype=subtype)
    total = len(out) / sr
    old_texts = [x["text"] for x in S[J0:J1 + 1]]

    def shift(x: float, inclusive: bool = False) -> float:
        return x + (dt if (x >= t1 - 1e-9 if inclusive else x > t1 + 1e-9) else 0.0)

    for s_ in T["scenes"]:
        for x in s_["sentences"]:
            x["start"], x["end"] = round(shift(x["start"]), 4), round(shift(x["end"], inclusive=True), 4)
        s_["start"], s_["end"] = round(shift(s_["start"]), 4), round(shift(s_["end"], inclusive=True), 4)
    sc["sentences"] = S[:J0] + newS + S[J1 + 1:]
    warnings = []
    for s_ in T["scenes"]:
        for k, x in enumerate(s_["sentences"]):
            x["start_frame"], x["end_frame"] = round(x["start"] * fps), round(x["end"] * fps)
            if len(x["text"]) / x["dur"] > tts.MAX_CPS:
                warnings.append(f"{s_['id']} s{k + 1}: {len(x['text']) / x['dur']:.1f} chars/s > {tts.MAX_CPS}")
        s_["start_frame"], s_["end_frame"] = round(s_["start"] * fps), round(s_["end"] * fps)
    vtt, srt, cw, ncues = F1.build_cues(T)
    warnings += cw
    exp = T["scenes"][-1]["end"]
    prev = T.get("self_check", {})
    T.update(total_s=round(total, 4), total_frames=int(np.ceil(total * fps)), cues=ncues, warnings=warnings,
             self_check={**{k: v for k, v in prev.items() if k not in ("expected_s", "audio_s", "diff_ms", "len_ok", "cues_ok")},
                         "expected_s": round(exp, 4), "audio_s": round(total, 4), "diff_ms": round((total - exp) * 1000, 2),
                         "len_ok": abs(total - exp) <= 1 / fps, "cues_ok": True,
                         "spliced_fix1b_U1": {"scene": SID, "replaced_sentences": [J0 + 1, J1 + 1], "old": old_texts, "neighbours_lufs": [round(v, 2) for v in Ln],
                                              "added_s": round(dt, 3), "new": report}})
    for d, nm in ((NEW, "captions"), (MOV, "en")):
        (d / f"{nm}.vtt").write_text("\n".join(vtt), encoding="utf-8")
        (d / f"{nm}.srt").write_text("\n".join(srt), encoding="utf-8")
    for d in (NEW, MOV):
        (d / "timing.json").write_text(json.dumps(T, indent=1, ensure_ascii=False), encoding="utf-8")
    sp = MOV / "script.md"
    s = sp.read_text(encoding="utf-8")
    h = s.index("\n## " + SID + "\n")
    old_par = " ".join(old_texts)
    # the old paragraph has "[beat]" marks between some of these sentences: match them flexibly
    import re
    pat = r"\s*(?:\[beat\]\s*)?".join(re.escape(x) for x in old_texts)
    m = re.compile(pat).search(s, h)
    if not m:
        raise SystemExit(f"script.md: block not found: {old_par}")
    new_par = " ".join(text + (" [beat]" if gap == B else "") for text, gap in BLOCK)
    s = s[:m.start()] + new_par + s[m.end():]
    sp.write_text(s, encoding="utf-8")
    print(f"block {t1 - t0:.2f} s -> {len(blk) / sr:.2f} s ({dt:+.3f} s); total {total:.3f} s ({T['total_frames']} frames), cues {ncues}, "
          f"self-check {T['self_check']['diff_ms']} ms, warnings {warnings}")


if __name__ == "__main__":
    main()
