"""ch00_coordinates_storm (#5b) NOTES-2 round (the notes1 verification review, 2026-11-06; copy of cst_u1_splice.py with
OLD = the u1 narration the user watched, NEW = n2, no renames). Original docstring:

ch00_coordinates_storm (#5b) user notes 2026-11-06 (prompt_b.docx): rebuild the narration from the CURRENT script.md, re-voicing ONLY
the sentences whose text is new or changed and re-using every unchanged sentence's measured clip from the fix-0 narration (the audio the
user watched). Unlike cst_fix0_splice.py (one old sentence -> n new ones), this tool rebuilds the whole track by sentence matching, so it
also handles deleted sentences ("Step one.", "And we never mix the two centres ..."), new scenes (s30_amphan_radar, s31_nargis_intro,
s33_idai_intro, s34_idai_swipe) and renamed scenes (s30_flood_swipe -> s32_nargis_swipe, s31_recap -> s35_recap, s32_end -> s36_end).

Method (= Part 1 / fix 0): Kokoro af_bella x1.0 with movies/lexicon.yaml plus this movie's local respellings (audio only; captions keep the
script text); ONE constant gain per new clip to the BS.1770-4 loudness of the nearest re-used clips (up to two before and two after, in
narration order), 5-ms look-ahead limiter at -1.5 dBTP; the new clip must land within 0.5 LU of that target and within 1.5 LU of each
neighbour, else stop. House gaps (tools/tts.py): 0.3-s lead, 0.35 s between sentences, 1.5 s after a [beat], 0.8 s between scenes, 0.3-s tail.
Re-used clips are cut at their timing.json start/end (the fix-0 timing equals the movie's timing.json; asserted).

Run in .venv-tts from the repo root (heavy job: hold the HEAVY.lock):
  .venv-tts/Scripts/python.exe movies/src/ch00_coordinates_storm/checks/cst_u1_splice.py --plan    # list re-used / new, no audio
  .venv-tts/Scripts/python.exe movies/src/ch00_coordinates_storm/checks/cst_u1_splice.py
Outputs G:/.../ch00_coordinates_storm/u1/tts/{narration.wav, timing.json, captions.vtt, captions.srt, splice.json, clip_*.wav}; then
  .venv/Scripts/python.exe movies/src/ch00_coordinates_storm/checks/make_timing.py --final <that folder>   (timing.json, en.vtt/srt, storyboard)
  .venv/Scripts/python.exe movies/src/ch00_coordinates_storm/checks/make_timing.py --recue --write          (cues within sentences)
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / "tools"))
sys.path.insert(0, str(ROOT / "tools" / "movie_wb"))
import tts  # noqa: E402

MOV = ROOT / "movies/ch00/ch00_coordinates_storm"
SCR = Path(r"G:\Geophysical Fluid Dynamics\aofd-data\scratch\movies\ch00_coordinates_storm")
OLD, NEW = SCR / "u1" / "tts", SCR / "n2" / "tts"
RENAME: dict[str, str] = {}   # notes 2: no renamed scenes
# this movie's respellings (AUDIO only; checked with Kokoro's G2P 2026-11-06: Beira -> b'AɹA, Buzi -> b'uz'i, Ayeyarwady -> 'Ij'ɑɹw'ɑd'i)
LOCAL = [(re.compile(r"\bAyeyarwady\b"), "Eye-yar-wah-dee"), (re.compile(r"\bBeira\b"), "Bay-ra"), (re.compile(r"\bBuzi\b"), "Boo-zee")]
SR = tts.SR


def plan() -> tuple[list[dict], dict]:
    old = json.loads((OLD / "timing.json").read_text(encoding="utf-8"))
    cur = json.loads((MOV / "timing.json").read_text(encoding="utf-8"))
    if [(x["text"], x["start"], x["end"]) for s in old["scenes"] for x in s["sentences"]] != \
       [(x["text"], x["start"], x["end"]) for s in cur["scenes"] for x in s["sentences"]] and "n2" not in json.dumps(cur.get("self_check", {})):
        raise SystemExit("movies/.../timing.json is not the u1 narration (and not an n2 rebuild): stop")
    oby = {s["id"]: s for s in old["scenes"]}
    allold = [(s["id"], j, x) for s in old["scenes"] for j, x in enumerate(s["sentences"])]
    scenes = tts.read_scenes(MOV / "script.md", None)
    out = []
    for sc in scenes:
        oid = RENAME.get(sc["id"], sc["id"])
        rec = {"id": sc["id"], "old_id": oid if oid in oby else None, "sentences": []}
        for raw in sc["sentences"]:
            beat = bool(tts.BEAT.search(raw))
            text = tts.BEAT.sub(" ", raw).strip()
            src = None
            if oid in oby:
                src = next(((oid, j, x) for j, x in enumerate(oby[oid]["sentences"]) if x["text"] == text), None)
            if src is None:
                src = next(((i, j, x) for i, j, x in allold if x["text"] == text), None)
            rec["sentences"].append({"text": text, "beat": beat, "reuse": None if src is None else {"scene": src[0], "j": src[1], "start": src[2]["start"],
                                                                                                    "end": src[2]["end"], "audio_text": src[2].get("audio_text")}})
        out.append(rec)
    return out, old


def main() -> None:
    P, old = plan()
    n_new = sum(1 for s in P for x in s["sentences"] if x["reuse"] is None)
    n_re = sum(1 for s in P for x in s["sentences"] if x["reuse"] is not None)
    used = {(x["reuse"]["scene"], x["reuse"]["j"]) for s in P for x in s["sentences"] if x["reuse"]}
    dropped = [(s["id"], j, x["text"]) for s in old["scenes"] for j, x in enumerate(s["sentences"]) if (s["id"], j) not in used]
    print(f"plan: {len(P)} scenes, {n_re} sentences re-used, {n_new} new; {len(dropped)} old sentences dropped")
    for s in P:
        for j, x in enumerate(s["sentences"]):
            if x["reuse"] is None:
                print(f"  NEW  {s['id']} S{j}: {x['text']}")
    for d in dropped:
        print(f"  DROP {d[0]} S{d[1]}: {d[2]}")
    if "--plan" in sys.argv:
        return
    import soundfile as sf
    import splice_uf1fix1 as U  # (lufs, true_peak, limiter, TOL_LU, CEIL_DBTP)
    from kokoro import KPipeline
    NEW.mkdir(parents=True, exist_ok=True)
    nar, sr = sf.read(OLD / "narration.wav", dtype="float32")
    assert sr == SR
    subtype = sf.info(str(OLD / "narration.wav")).subtype
    pipe = KPipeline(lang_code="a", repo_id="hexgrad/Kokoro-82M")
    lex = tts.load_lexicon()

    def respell(text: str) -> str:
        a = tts.respell(text, lex)
        for pat, rep in LOCAL:
            a = pat.sub(rep, a)
        return a

    import hashlib
    (NEW / "raw_cache").mkdir(exist_ok=True)

    def synth(text: str) -> np.ndarray:
        """Kokoro clip of the respelled text; the raw clip is cached by the hash of the audio text (re-runs re-use it)"""
        a = respell(text)
        cp = NEW / "raw_cache" / f"{hashlib.sha1(a.encode('utf-8')).hexdigest()[:16]}.wav"
        if cp.exists():
            return sf.read(cp, dtype="float32")[0]
        w = np.concatenate([np.asarray(c, dtype=np.float32) for _, _, c in pipe(a, voice="af_bella", speed=1.0)])
        sf.write(cp, w, sr, subtype="FLOAT")
        return w

    cut = lambda r: nar[int(round(r["start"] * sr)): int(round(r["end"] * sr))]  # noqa: E731
    # re-synthesis must reproduce a re-used clip (voice and lexicon unchanged)
    ref = next(x for s in P if s["id"] == "s22_amphan_eye" for x in s["sentences"])
    raw = synth(ref["text"]); a_ = cut(ref["reuse"])[: len(raw)]; n = min(len(a_), len(raw))
    corr = float(np.corrcoef(a_[:n], raw[:n])[0, 1])
    print(f"resynth correlation {corr:.4f}", flush=True)
    if corr < 0.9:
        raise SystemExit("re-synthesis does not reproduce the u1 clip (voice/lexicon changed?) - stop")
    flat = [(si, j) for si, s in enumerate(P) for j in range(len(s["sentences"]))]
    loud = {}
    for si, j in flat:
        x = P[si]["sentences"][j]
        if x["reuse"]:
            loud[(si, j)] = U.lufs(cut(x["reuse"]), sr)
    clips: dict[tuple[int, int], np.ndarray] = {}
    report = []
    for idx, (si, j) in enumerate(flat):
        x = P[si]["sentences"][j]
        if x["reuse"]:
            clips[(si, j)] = cut(x["reuse"])
            continue
        before = [flat[k] for k in range(idx - 1, -1, -1) if flat[k] in loud][:2]
        after = [flat[k] for k in range(idx + 1, len(flat)) if flat[k] in loud][:2]
        nb = before + after
        Ln = [loud[q] for q in nb]
        target = 10 * np.log10(np.mean([10 ** (v / 10) for v in Ln]))
        clip = synth(x["text"])
        L0 = U.lufs(clip, sr)
        gdb = target - L0
        for _ in range(2):
            cl, gr = U.limiter(clip * 10 ** (gdb / 20), sr)
            gdb += target - U.lufs(cl, sr)
        cl, gr = U.limiter(clip * 10 ** (gdb / 20), sr)
        L1, tp = U.lufs(cl, sr), U.true_peak(cl)
        if tp > U.CEIL_DBTP:          # inter-sample peaks can pass the look-ahead limiter: one small linear trim after it (≈ 0.1 LU)
            cl = (cl * 10 ** ((U.CEIL_DBTP - tp - 0.03) / 20)).astype(np.float32)
            L1, tp = U.lufs(cl, sr), U.true_peak(cl)
        ok = abs(L1 - target) <= 0.5 and all(abs(L1 - v) <= U.TOL_LU for v in Ln) and tp <= U.CEIL_DBTP + 1e-6
        tag = f"{P[si]['id']}_S{j}"
        sf.write(NEW / f"clip_{tag}.wav", cl, sr, subtype=subtype)
        print(f"{tag}: neighbours {[round(v, 2) for v in Ln]} -> {target:.2f}; raw {L0:.2f}, gain {gdb:+.2f} dB, limiter {gr:.2f} dB, final {L1:.2f} LUFS, "
              f"TP {tp:.2f} dBTP, {len(cl) / sr:.2f} s, ok {ok}", flush=True)
        if not ok:
            raise SystemExit("splice level check failed - stop")
        clips[(si, j)] = cl
        report.append({"scene": P[si]["id"], "sentence": j, "text": x["text"], "audio_text": respell(x["text"]) if respell(x["text"]) != x["text"] else None,
                       "neighbours_lufs": [round(v, 2) for v in Ln], "target_lufs": round(float(target), 2), "raw_lufs": round(float(L0), 2),
                       "gain_db": round(float(gdb), 2), "limiter_gr_db": round(float(gr), 2), "final_lufs": round(float(L1), 2), "true_peak_dbtp": round(float(tp), 2),
                       "dur_s": round(len(cl) / sr, 3), "beat": x["beat"]})
    # compose with the house gaps (= tools/tts.py)
    pieces = [np.zeros(int(tts.LEAD * sr), np.float32)]
    t = tts.LEAD
    T = {k: old[k] for k in ("voice", "speed", "fps", "sample_rate", "gaps")}
    T["scenes"] = []
    fps = T["fps"]
    warnings = []
    for si, s in enumerate(P):
        srec = {"id": s["id"], "start": round(t, 4), "sentences": []}
        for j, x in enumerate(s["sentences"]):
            c = clips[(si, j)]
            dur = len(c) / sr
            pieces.append(c.astype(np.float32))
            a_txt = x["reuse"]["audio_text"] if x["reuse"] else (respell(x["text"]) if respell(x["text"]) != x["text"] else None)
            srec["sentences"].append({"text": x["text"], "audio_text": a_txt, "start": round(t, 4), "end": round(t + dur, 4), "dur": round(dur, 4),
                                      "start_frame": round(t * fps), "end_frame": round((t + dur) * fps), **({"beat": True} if x["beat"] else {})})
            if len(x["text"]) / dur > tts.MAX_CPS:
                warnings.append(f"{s['id']} s{j + 1}: {len(x['text']) / dur:.1f} chars/s > {tts.MAX_CPS}")
            t += dur
            last = j == len(s["sentences"]) - 1
            gap = (tts.GAP_SCENE if si < len(P) - 1 else tts.TAIL) if last else tts.GAP_SENT
            if x["beat"]:
                gap = max(gap, tts.GAP_BEAT)
            g = int(round(gap * sr))
            pieces.append(np.zeros(g, np.float32))
            t += g / sr
        srec["end"] = round(t, 4)
        srec["start_frame"], srec["end_frame"] = round(srec["start"] * fps), round(srec["end"] * fps)
        T["scenes"].append(srec)
    out = np.concatenate(pieces)
    sf.write(NEW / "narration.wav", out, sr, subtype=subtype)
    total = len(out) / sr
    sys.path.insert(0, str(Path(__file__).parent))
    from cst_fix0_splice import build_cues  # tts.py's cue rules
    vtt, srt, cw, ncues = build_cues(T)
    T.update(total_s=round(total, 4), total_frames=int(np.ceil(total * fps)), cues=ncues, warnings=warnings + cw,
             self_check={"expected_s": round(t, 4), "audio_s": round(total, 4), "diff_ms": round((total - t) * 1000, 2), "len_ok": abs(total - t) <= 1 / fps,
                         "cues_ok": True, "spliced_n2": {"method": "sentence matching against the u1 (notes1) narration; new clips BS.1770-4 loudness-matched to "
                                                                    "the nearest re-used clips + look-ahead limiter (-1.5 dBTP)", "corr_resynth": round(corr, 4),
                                                         "reused": n_re, "new": n_new, "dropped": [f"{a} S{b}: {c}" for a, b, c in dropped], "replaced": report}})
    (NEW / "captions.vtt").write_text("\n".join(vtt), encoding="utf-8")
    (NEW / "captions.srt").write_text("\n".join(srt), encoding="utf-8")
    (NEW / "timing.json").write_text(json.dumps(T, indent=1, ensure_ascii=False), encoding="utf-8")
    (NEW / "splice.json").write_text(json.dumps(report, indent=1, ensure_ascii=False), encoding="utf-8")
    print(f"total {total:.3f} s ({T['total_frames']} frames), {ncues} cues, warnings {T['warnings']}")


if __name__ == "__main__":
    main()
