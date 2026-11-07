"""ch00_coordinates_routes (#5f, Coordinates Part 6) REMAKE 2026-11-07: build the FINAL narration from the current script.md, re-voicing
ONLY the sentences whose text is new or changed, re-using every unchanged sentence's measured clip (= Part 4's fr_r7_splice.py).

Part 6 never had a final TTS: its provisional timing came from the measured dry run dryrun2 (tools/tts.py, the whole script, af_bella
x 1.0) with s02 re-measured alone in mini_s02 (s02 is now cut) and three re-voiced sentences only estimated (checks/revoice.py; all three
are re-worded again in the remake, so they are voiced here). OLD = dryrun2 (first), dryrun1 (the earlier full run), mini_s02: a re-used
sentence is cut from that run's narration.wav at that run's timing.json start/end. Matching order: the same scene in dryrun2, then the
same scene in the other runs, then any sentence with the same text.

Method (= Part 2's cst_r7_splice.py): Kokoro af_bella x1.0 with movies/lexicon.yaml (audio only; captions keep the script text); ONE
constant gain per new clip to the BS.1770-4 loudness of the nearest re-used clips (two before, two after), 5-ms look-ahead limiter at
-1.5 dBTP; the new clip must land within 0.5 LU of that target and within 1.5 LU of each neighbour, else stop. Before anything, one
re-used clip per run is re-synthesised and must correlate >= 0.9 with the old clip (voice / lexicon unchanged). House gaps (tools/tts.py):
0.3-s lead, 0.35 s between sentences, 1.5 s after a [beat], 0.8 s between scenes, 0.3-s tail. Cues with tools/tts.py's rules.

Run in .venv-tts from the repo root (heavy job: hold VOICE.lock, lock protocol 2026-11-07):
  .venv-tts/Scripts/python.exe movies/src/ch00_coordinates_routes/checks/rt_r7_splice.py --plan          # re-used / new, no audio
  .venv-tts/Scripts/python.exe movies/src/ch00_coordinates_routes/checks/rt_r7_splice.py --provisional   # no audio: provisional timing.json
  .venv-tts/Scripts/python.exe movies/src/ch00_coordinates_routes/checks/rt_r7_splice.py
Output G:/.../ch00_coordinates_routes/r7/tts/{narration.wav, timing.json, captions.vtt, captions.srt, splice.json, clip_*.wav}; then
  .venv/Scripts/python.exe movies/src/ch00_coordinates_routes/checks/final_timing.py --final <that folder>
"""
from __future__ import annotations

import hashlib
import json
import re
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / "tools"))
sys.path.insert(0, str(ROOT / "tools" / "movie_wb"))
import tts  # noqa: E402

MOV = ROOT / "movies/ch00/ch00_coordinates_routes"
SCR = Path(r"G:\Geophysical Fluid Dynamics\aofd-data\scratch\movies\ch00_coordinates_routes")
# show-it-don't-voice-it pass (2026-11-07): `--pass r8` re-uses the r7 splice too (its new clips) and writes r8/tts
PASS = sys.argv[sys.argv.index("--pass") + 1] if "--pass" in sys.argv else "r7"
RUNS = ("dryrun2", "dryrun1", "mini_s02") + (("r7/tts",) if PASS != "r7" else ())
NEW = SCR / PASS / "tts"
SR = tts.SR


def key_in(run: str, sid: str) -> str:
    return sid


def plan() -> tuple[list[dict], dict]:
    import yaml
    runs = {r: json.loads((SCR / r / "timing.json").read_text(encoding="utf-8")) for r in RUNS}
    sb = yaml.safe_load((MOV / "storyboard.yaml").read_text(encoding="utf-8"))
    src = {s["id"]: "dryrun2" for s in sb["scenes"]}   # every kept scene was measured in dryrun2
    by = {r: {s["id"]: s for s in t["scenes"]} for r, t in runs.items()}
    allold = [(r, s["id"], j, x) for r, t in runs.items() for s in t["scenes"] for j, x in enumerate(s["sentences"])]
    out = []
    for sc in tts.read_scenes(MOV / "script.md", None):
        sid = sc["id"]
        first = "r7/tts" if "r7/tts" in RUNS else src.get(sid)   # r8: the r7 splice holds every current clip
        order = ([first] if first else []) + [r for r in RUNS if r != first]
        rec = {"id": sid, "source": src.get(sid), "sentences": []}
        for raw in sc["sentences"]:
            beat = bool(tts.BEAT.search(raw))
            text = tts.BEAT.sub(" ", raw).strip()
            hit = None
            for r in order:
                s_ = by[r].get(key_in(r, sid))
                if s_:
                    hit = next(((r, s_["id"], j, x) for j, x in enumerate(s_["sentences"]) if x["text"] == text), None)
                if hit:
                    break
            if hit is None:
                hit = next(((r, k, j, x) for r, k, j, x in allold if x["text"] == text), None)
            rec["sentences"].append({"text": text, "beat": beat, "reuse": None if hit is None else
                                     {"run": hit[0], "scene": hit[1], "j": hit[2], "start": hit[3]["start"], "end": hit[3]["end"],
                                      "audio_text": hit[3].get("audio_text")}})
        out.append(rec)
    return out, runs


def build_cues(T: dict) -> tuple[list[str], list[str], list[str], int]:
    """tools/tts.py's cue rules on a timing dict -> (vtt lines, srt lines, warnings, n cues) (= Part 2 cst_fix0_splice.build_cues)"""
    warnings: list[str] = []
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
    merged: list[list] = []
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
    return vtt, srt, warnings, len(merged)


def provisional(P: list[dict]) -> None:
    """NO AUDIO (static work while the heavy lock is busy): movies/.../timing.json from the plan, re-used sentences at their measured
    clip length, new ones at the measured mean rate of the re-used clips (characters per second); marked provisional. The final run
    (make_timing.py --final) replaces it."""
    re_ = [x for s in P for x in s["sentences"] if x["reuse"]]
    cps = sum(len(x["text"]) for x in re_) / sum(x["reuse"]["end"] - x["reuse"]["start"] for x in re_)
    t, fps, scenes = tts.LEAD, 30, []
    for si, s in enumerate(P):
        srec = {"id": s["id"], "start": round(t, 4), "sentences": []}
        for j, x in enumerate(s["sentences"]):
            dur = (x["reuse"]["end"] - x["reuse"]["start"]) if x["reuse"] else len(x["text"]) / cps
            srec["sentences"].append({"text": x["text"], "start": round(t, 4), "end": round(t + dur, 4), "dur": round(dur, 4), "start_frame": round(t * fps),
                                      "end_frame": round((t + dur) * fps), **({"beat": True} if x["beat"] else {}), **({} if x["reuse"] else {"estimated": True})})
            t += dur
            last = j == len(s["sentences"]) - 1
            gap = (tts.GAP_SCENE if si < len(P) - 1 else tts.TAIL) if last else tts.GAP_SENT
            t += max(gap, tts.GAP_BEAT) if x["beat"] else gap
        srec["end"] = round(t, 4)
        srec["start_frame"], srec["end_frame"] = round(srec["start"] * fps), round(srec["end"] * fps)
        scenes.append(srec)
    import math
    T = {"voice": "af_bella", "speed": 1.0, "fps": fps, "sample_rate": SR, "provisional": f"remake 2026-11-07 static phase: re-used clip lengths from the dry runs, "
         f"new sentences estimated at {cps:.2f} chars/s (rt_r7_splice.py --provisional); the final splice replaces it", "scenes": scenes,
         "total_s": round(t, 4), "total_frames": int(math.ceil(round(t * fps, 6)))}
    (MOV / "timing.json").write_text(json.dumps(T, indent=1, ensure_ascii=False), encoding="utf-8")
    print(f"provisional timing.json: {len(scenes)} scenes, total {t:.3f} s ({T['total_frames']} frames), new at {cps:.2f} chars/s")


def main() -> None:
    P, runs = plan()
    n_new = sum(1 for s in P for x in s["sentences"] if x["reuse"] is None)
    n_re = sum(1 for s in P for x in s["sentences"] if x["reuse"] is not None)
    print(f"plan: {len(P)} scenes, {n_re} sentences re-used, {n_new} new")
    for s in P:
        for j, x in enumerate(s["sentences"]):
            if x["reuse"] is None:
                print(f"  NEW  {s['id']} S{j}: {x['text']}")
            elif x["reuse"]["run"] != s["source"] or x["reuse"]["scene"] != key_in(x["reuse"]["run"], s["id"]):
                print(f"  (re-used from {x['reuse']['run']}/{x['reuse']['scene']} S{x['reuse']['j']}) {s['id']} S{j}")
    if "--plan" in sys.argv:
        return
    if "--provisional" in sys.argv:
        provisional(P)
        return
    import soundfile as sf
    import splice_uf1fix1 as U  # (lufs, true_peak, limiter, TOL_LU, CEIL_DBTP)
    from kokoro import KPipeline
    NEW.mkdir(parents=True, exist_ok=True)
    nar, subtype = {}, None
    for r in RUNS:
        w, sr = sf.read(SCR / r / "narration.wav", dtype="float32")
        assert sr == SR, (r, sr)
        nar[r] = w
        subtype = subtype or sf.info(str(SCR / r / "narration.wav")).subtype
    pipe = KPipeline(lang_code="a", repo_id="hexgrad/Kokoro-82M")
    lex = tts.load_lexicon()
    respell = lambda text: tts.respell(text, lex)  # noqa: E731
    (NEW / "raw_cache").mkdir(exist_ok=True)

    def synth(text: str) -> np.ndarray:
        a = respell(text)
        cp = NEW / "raw_cache" / f"{hashlib.sha1(a.encode('utf-8')).hexdigest()[:16]}.wav"
        if cp.exists():
            return sf.read(cp, dtype="float32")[0]
        w = np.concatenate([np.asarray(c, dtype=np.float32) for _, _, c in pipe(a, voice="af_bella", speed=1.0)])
        sf.write(cp, w, SR, subtype="FLOAT")
        return w

    cut = lambda r: nar[r["run"]][int(round(r["start"] * SR)): int(round(r["end"] * SR))]  # noqa: E731
    # re-synthesis must reproduce one re-used clip of every run (voice and lexicon unchanged)
    corr = {}
    for run in RUNS:
        ref = next((x for s in P for x in s["sentences"] if x["reuse"] and x["reuse"]["run"] == run and 40 < len(x["text"]) < 140), None)
        if ref is None:
            continue
        raw = synth(ref["text"])
        a_ = cut(ref["reuse"])
        n = min(len(a_), len(raw))
        corr[run] = float(np.corrcoef(a_[:n], raw[:n])[0, 1])
        print(f"resynth correlation {run}: {corr[run]:.4f} ({ref['text'][:60]})", flush=True)
    if min(corr.values()) < 0.9:
        raise SystemExit("re-synthesis does not reproduce an old clip (voice/lexicon changed?) - stop")
    flat = [(si, j) for si, s in enumerate(P) for j in range(len(s["sentences"]))]
    loud = {(si, j): U.lufs(cut(P[si]["sentences"][j]["reuse"]), SR) for si, j in flat if P[si]["sentences"][j]["reuse"]}
    clips: dict[tuple[int, int], np.ndarray] = {}
    report = []
    for idx, (si, j) in enumerate(flat):
        x = P[si]["sentences"][j]
        if x["reuse"]:
            clips[(si, j)] = cut(x["reuse"])
            continue
        before = [flat[k] for k in range(idx - 1, -1, -1) if flat[k] in loud][:2]
        after = [flat[k] for k in range(idx + 1, len(flat)) if flat[k] in loud][:2]
        Ln = [loud[q] for q in before + after]
        target = 10 * np.log10(np.mean([10 ** (v / 10) for v in Ln]))
        clip = synth(x["text"])
        L0 = U.lufs(clip, SR)
        gdb = target - L0
        for _ in range(2):
            cl, gr = U.limiter(clip * 10 ** (gdb / 20), SR)
            gdb += target - U.lufs(cl, SR)
        cl, gr = U.limiter(clip * 10 ** (gdb / 20), SR)
        L1, tp = U.lufs(cl, SR), U.true_peak(cl)
        if tp > U.CEIL_DBTP:
            cl = (cl * 10 ** ((U.CEIL_DBTP - tp - 0.03) / 20)).astype(np.float32)
            L1, tp = U.lufs(cl, SR), U.true_peak(cl)
        ok = abs(L1 - target) <= 0.5 and all(abs(L1 - v) <= U.TOL_LU for v in Ln) and tp <= U.CEIL_DBTP + 1e-6
        tag = f"{P[si]['id']}_S{j}"
        sf.write(NEW / f"clip_{tag}.wav", cl, SR, subtype=subtype)
        print(f"{tag}: neighbours {[round(v, 2) for v in Ln]} -> {target:.2f}; raw {L0:.2f}, gain {gdb:+.2f} dB, limiter {gr:.2f} dB, final {L1:.2f} LUFS, "
              f"TP {tp:.2f} dBTP, {len(cl) / SR:.2f} s, ok {ok}", flush=True)
        if not ok:
            raise SystemExit("splice level check failed - stop")
        clips[(si, j)] = cl
        a_txt = respell(x["text"])
        report.append({"scene": P[si]["id"], "sentence": j, "text": x["text"], "audio_text": a_txt if a_txt != x["text"] else None,
                       "neighbours_lufs": [round(v, 2) for v in Ln], "target_lufs": round(float(target), 2), "raw_lufs": round(float(L0), 2),
                       "gain_db": round(float(gdb), 2), "limiter_gr_db": round(float(gr), 2), "final_lufs": round(float(L1), 2),
                       "true_peak_dbtp": round(float(tp), 2), "dur_s": round(len(cl) / SR, 3), "beat": x["beat"]})
    pieces = [np.zeros(int(tts.LEAD * SR), np.float32)]
    t = tts.LEAD
    T = {"voice": "af_bella", "speed": 1.0, "fps": 30, "sample_rate": SR,
         "gaps": {"sentence": tts.GAP_SENT, "beat": tts.GAP_BEAT, "scene": tts.GAP_SCENE, "lead": tts.LEAD, "tail": tts.TAIL}, "scenes": []}
    fps = 30
    warnings = []
    for si, s in enumerate(P):
        srec = {"id": s["id"], "start": round(t, 4), "sentences": []}
        for j, x in enumerate(s["sentences"]):
            c = clips[(si, j)]
            dur = len(c) / SR
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
            g = int(round(gap * SR))
            pieces.append(np.zeros(g, np.float32))
            t += g / SR
        srec["end"] = round(t, 4)
        srec["start_frame"], srec["end_frame"] = round(srec["start"] * fps), round(srec["end"] * fps)
        T["scenes"].append(srec)
    out = np.concatenate(pieces)
    sf.write(NEW / "narration.wav", out, SR, subtype=subtype)
    total = len(out) / SR
    vtt, srt, cw, ncues = build_cues(T)
    T.update(total_s=round(total, 4), total_frames=int(np.ceil(total * fps)), cues=ncues, warnings=warnings + cw,
             self_check={"expected_s": round(t, 4), "audio_s": round(total, 4), "diff_ms": round((total - t) * 1000, 2), "len_ok": abs(total - t) <= 1 / fps,
                         "cues_ok": True, "spliced_r7": {"method": "sentence matching against the measured dry runs (dryrun2/dryrun1/mini_s02); new clips "
                                                                    "BS.1770-4 loudness-matched to the nearest re-used clips + look-ahead limiter (-1.5 dBTP)",
                                                         "corr_resynth": {k: round(v, 4) for k, v in corr.items()}, "reused": n_re, "new": n_new,
                                                         "replaced": report}})
    (NEW / "captions.vtt").write_text("\n".join(vtt), encoding="utf-8")
    (NEW / "captions.srt").write_text("\n".join(srt), encoding="utf-8")
    (NEW / "timing.json").write_text(json.dumps(T, indent=1, ensure_ascii=False), encoding="utf-8")
    (NEW / "splice.json").write_text(json.dumps(report, indent=1, ensure_ascii=False), encoding="utf-8")
    print(f"total {total:.3f} s ({T['total_frames']} frames), {ncues} cues, warnings {T['warnings']}")


if __name__ == "__main__":
    main()
