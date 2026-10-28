"""Fix loop 1 (review 1, S2-S5, S10) for ch00_dot_product_v01b: replace / insert a few NEW (non-v6) sentences without
re-synthesising the rest of the narration, so every v6 sentence keeps its audio bit for bit.
Run in .venv-tts:  .venv-tts/Scripts/python.exe tools/movie_wb/splice_dpv_fix1.py

Method (as tools/movie_wb/splice_fix3.py, with one change):
1. gain: tools/tts.py loudnorm reported normalization_type "dynamic" for this narration (the gain drifts slowly over the
   movie), so the gain is measured LOCALLY for every edit: the unchanged sentence(s) next to the edit in the same scene
   are re-synthesised raw (Kokoro is deterministic) and gain = RMS(segment in narration.wav) / RMS(raw clip); the
   correlation of each pair must be >= 0.98.
2. new clips are synthesised (lexicon applied, af_bella x1.0), scaled by that gain; a replacement takes the old
   sentence's [start, end); an insert adds (house gap 0.35 s + clip) either right after the anchor sentence or, when the
   anchor ends in a [beat], after the beat (at the next sentence's start - 0.35 s). Everything later shifts.
3. timing.json is rebuilt, captions are rebuilt with tts.py's own cue rules, script.md gets the new text.
Inputs/outputs: <scratch>/public/{narration.wav,timing.json} (build 1) -> <scratch>/fix1/{narration.wav,timing.json,
captions.vtt,captions.srt}; movies/ch00/ch00_dot_product_v01b/{timing.json,script.md} and en.vtt/en.srt beside the movie.
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

MOV = ROOT / "movies/ch00/ch00_dot_product_v01b"
OUTMOV = ROOT / "movies/out/ch00/ch00_dot_product_v01b"
SCR = Path(r"G:\Geophysical Fluid Dynamics\aofd-data\scratch\movies\ch00_dot_product_v01b")
OLD, NEW = SCR / "public", SCR / "fix1"
# (scene, 0-based sentence, new text, reference sentences for the local gain)
REPLACE = [
    ("s11b_perp_push", 2, "The string pulls towards the centre, always at a right angle to the ball's velocity, "
                          "which points the way it is moving.", [1, 3]),
    ("s20b_runway", 3, "Say the runway points north, and the wind blows at ten metres per second, "
                       "thirty degrees east of the runway's direction.", [2, 4]),
    ("s20e_similarity", 3, "Today reads three, one, minus two and minus two hectopascals, the unit weather maps use for "
                           "pressure, and a day in the past reads two, two, minus one and minus three.", [2, 4]),
    ("s20e_similarity", 7, "Weather maps can be compared this way to look for past days like today, and computers use "
                           "the same idea to compare pictures and words.", [6]),
]
# (scene, insert after this 0-based OLD sentence index, new text, reference sentences)
INSERT = [
    ("s20d_wind_work", 7, "A watt is one joule of energy every second.", [7, 8]),
    ("s20e_similarity", 3, "Let's call today's arrow capital A, and the past day's capital B.", [2, 4]),
]
V6_UNTOUCHED_CHECK = True


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

    rms = lambda v: float(np.sqrt(np.mean(v.astype(np.float64) ** 2)))  # noqa: E731
    ids = [s["id"] for s in T["scenes"]]
    gains: dict[tuple[str, int], tuple[float, float]] = {}

    def local_gain(sid: str, refs: list[int]) -> tuple[float, list[float]]:
        gs, cs = [], []
        for j in refs:
            key = (sid, j)
            if key not in gains:
                ref = T["scenes"][ids.index(sid)]["sentences"][j]
                raw = synth(ref["text"])
                a0 = int(round(ref["start"] * sr))
                seg = nar[a0: a0 + len(raw)]
                n = min(len(seg), len(raw))
                gains[key] = (rms(seg[:n]) / rms(raw[:n]), float(np.corrcoef(seg[:n], raw[:n])[0, 1]))
                print(f"  ref {sid} S{j + 1}: gain {gains[key][0]:.4f} corr {gains[key][1]:.4f} (dur {len(raw) / sr:.3f} vs {ref['dur']})", flush=True)
            gs.append(gains[key][0]); cs.append(gains[key][1])
        if min(cs) < 0.98:
            raise SystemExit(f"re-synthesis does not match the narration for {sid} refs {refs}: corr {cs}")
        return float(np.mean(gs)), cs

    gap = np.zeros(int(round(tts.GAP_SENT * sr)), dtype=np.float32)
    edits = []  # dict(cut0, cut1, audio, kind, sid, j, text, old, dur, gain, corr, start_new_rel)
    for sid, j, text, refs in REPLACE:
        s = T["scenes"][ids.index(sid)]["sentences"][j]
        g, cs = local_gain(sid, refs)
        clip = (synth(text) * g).astype(np.float32)
        edits.append(dict(cut0=s["start"], cut1=s["end"], audio=clip, kind="rep", sid=sid, j=j, text=text, old=s["text"],
                          dur=len(clip) / sr, gain=g, corr=cs))
    for sid, j, text, refs in INSERT:
        sents = T["scenes"][ids.index(sid)]["sentences"]
        s = sents[j]
        t_ins = (sents[j + 1]["start"] - tts.GAP_SENT) if s.get("beat") else s["end"]
        g, cs = local_gain(sid, refs)
        clip = (synth(text) * g).astype(np.float32)
        edits.append(dict(cut0=t_ins, cut1=t_ins, audio=np.concatenate([gap, clip]), kind="ins", sid=sid, j=j, text=text,
                          old=None, dur=len(clip) / sr, gain=g, corr=cs))
    edits.sort(key=lambda e: (e["cut0"], e["kind"] == "ins"))
    pieces, cur = [], 0
    for e in edits:
        a, b = int(round(e["cut0"] * sr)), int(round(e["cut1"] * sr))
        pieces += [nar[cur:a], e["audio"]]
        cur = b
        e["delta"] = len(e["audio"]) / sr - (b - a) / sr
    pieces.append(nar[cur:])
    out = np.concatenate(pieces)
    sf.write(NEW / "narration.wav", out, sr, subtype=subtype)
    total = len(out) / sr

    def mp(t: float, excl: dict | None = None) -> float:
        """new time of old time t: every edit that ends at or before t (other than `excl`) shifts it"""
        return t + sum(e["delta"] for e in edits if e is not excl and e["cut1"] <= t + 1e-9)

    reps = {(e["sid"], e["j"]): e for e in edits if e["kind"] == "rep"}
    ins = {(e["sid"], e["j"]): e for e in edits if e["kind"] == "ins"}
    for sc in T["scenes"]:
        new_s = []
        for j, s in enumerate(sc["sentences"]):
            e = reps.get((sc["id"], j))
            if e:
                st = mp(s["start"])
                a_txt = tts.respell(e["text"], lex)
                s = {**s, "text": e["text"], "audio_text": a_txt if a_txt != e["text"] else None, "start": round(st, 4),
                     "end": round(st + e["dur"], 4), "dur": round(e["dur"], 4)}
            else:
                s = {**s, "start": round(mp(s["start"]), 4), "end": round(mp(s["end"]), 4)}
            new_s.append(s)
            e = ins.get((sc["id"], j))
            if e:
                st = mp(e["cut0"], excl=e) + tts.GAP_SENT
                a_txt = tts.respell(e["text"], lex)
                new_s.append({"text": e["text"], "audio_text": a_txt if a_txt != e["text"] else None, "start": round(st, 4),
                              "end": round(st + e["dur"], 4), "dur": round(e["dur"], 4)})
        sc["sentences"] = new_s
        sc["start"], sc["end"] = round(mp(sc["start"]), 4), round(mp(sc["end"]), 4)
    warnings = []
    for sc in T["scenes"]:
        for k, s in enumerate(sc["sentences"]):
            s["start_frame"], s["end_frame"] = round(s["start"] * fps), round(s["end"] * fps)
            cps = len(s["text"]) / s["dur"]
            if cps > tts.MAX_CPS:
                warnings.append(f"{sc['id']} s{k + 1}: {cps:.1f} chars/s > {tts.MAX_CPS}")
        sc["start_frame"], sc["end_frame"] = round(sc["start"] * fps), round(sc["end"] * fps)
    flat = [s for sc in T["scenes"] for s in sc["sentences"]]
    bad = [i for i in range(1, len(flat)) if flat[i]["start"] < flat[i - 1]["end"] - 1e-6]
    if bad:
        raise SystemExit(f"sentence overlap after the splice at {bad[:5]}")
    # audio parity of every untouched sentence: the samples at its new place = the samples at its old place
    if V6_UNTOUCHED_CHECK:
        Told = json.loads((OLD / "timing.json").read_text(encoding="utf-8"))
        maxd, nchk = 0.0, 0
        for sco, scn in zip(Told["scenes"], T["scenes"]):
            olds = {s["text"]: s for s in sco["sentences"]}
            for s in scn["sentences"]:
                o = olds.get(s["text"])
                if o is None or abs(o["dur"] - s["dur"]) > 1e-6:
                    continue
                a0, b0 = int(round(o["start"] * sr)), int(round(s["start"] * sr))
                L = int(round(o["dur"] * sr))
                d = float(np.max(np.abs(nar[a0:a0 + L] - out[b0:b0 + L]))) if L else 0.0
                maxd, nchk = max(maxd, d), nchk + 1
        print(f"untouched sentences checked: {nchk}; max |sample difference| {maxd:.3g}")
        if maxd > 0:
            raise SystemExit("an untouched sentence changed its audio")
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
    rec = [{"scene": e["sid"], ("sentence" if e["kind"] == "rep" else "after_sentence"): e["j"] + 1, "kind": e["kind"],
            "old": e["old"], "new": e["text"], "added_s": round(e["delta"], 3), "clip_s": round(e["dur"], 3),
            "gain": round(e["gain"], 5), "corr_resynth": [round(c, 4) for c in e["corr"]]} for e in edits]
    T.update(total_s=round(total, 4), total_frames=int(np.ceil(total * fps)), cues=len(merged), warnings=warnings,
             self_check={"expected_s": round(exp, 4), "audio_s": round(total, 4), "diff_ms": round((total - exp) * 1000, 2),
                         "len_ok": abs(total - exp) <= 1 / fps, "cues_ok": all(0 <= a < b <= total + 1e-6 for a, b, _ in merged),
                         "spliced_fix1": {"method": "local gain per edit (loudnorm was dynamic)", "edits": rec}})
    OUTMOV.mkdir(parents=True, exist_ok=True)
    for d, nm in ((NEW, "captions"), (OUTMOV, "en")):
        (d / f"{nm}.vtt").write_text("\n".join(vtt), encoding="utf-8")
        (d / f"{nm}.srt").write_text("\n".join(srt), encoding="utf-8")
    for d in (NEW, MOV):
        (d / "timing.json").write_text(json.dumps(T, indent=1, ensure_ascii=False), encoding="utf-8")
    sp = MOV / "script.md"
    s = sp.read_text(encoding="utf-8")
    for e in edits:
        if e["kind"] == "rep":
            if s.count(e["old"]) != 1:
                raise SystemExit(f"script.md: sentence not unique for {e['sid']} {e['j'] + 1}: {e['old']}")
            s = s.replace(e["old"], e["text"], 1)
    for e in edits:
        if e["kind"] == "ins":
            sents_old = json.loads((OLD / "timing.json").read_text(encoding="utf-8"))["scenes"][ids.index(e["sid"])]["sentences"]
            a_old = sents_old[e["j"]]["text"]
            a_new = reps[(e["sid"], e["j"])]["text"] if (e["sid"], e["j"]) in reps else a_old
            anchor = a_new + (" [beat]" if sents_old[e["j"]].get("beat") else "")
            if s.count(anchor) != 1:
                raise SystemExit(f"script.md: anchor not unique for {e['sid']}: {anchor}")
            s = s.replace(anchor, anchor + " " + e["text"], 1)
    sp.write_text(s, encoding="utf-8")
    print(f"total {total:.3f} s ({T['total_frames']} frames), cues {len(merged)}, self-check {T['self_check']['diff_ms']} ms, warnings {warnings}")
    for r in rec:
        print("  ", r)


if __name__ == "__main__":
    main()
