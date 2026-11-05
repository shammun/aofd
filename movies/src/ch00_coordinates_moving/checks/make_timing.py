"""Provisional timing.json for ch00_coordinates_moving (#5e, Part 5) from the MEASURED dry runs (no new TTS).

The storyboard (movies/ch00/ch00_coordinates_moving/storyboard.yaml) names, per scene, the dry run its clip lengths come from
(`measured.timing_source`: dryrun1, splice2 or splice3 under G:/.../scratch/movies/ch00_coordinates_frames/). In those runs the
Part 5 scenes carry their old single-movie ids (dryrun1 / splice2: s28_train ... s43_end) or an "M_" prefix (splice3). This
script takes each scene's sentences (text, clip length, beat flag) from that run and lays them out again with the tools/tts.py
gap rules (lead 0.3 s, sentence 0.35 s, beat 1.5 s, scene 0.8 s, tail 0.3 s), exactly as the director's method did. It then
checks that every sentence time equals the storyboard's `sentence_times` (to 1 ms), that the scene texts equal the storyboard
voiceovers (with "[beat]" removed) and that the total equals the storyboard's audio length. The file is marked provisional:
the final TTS (heavy phase) replaces it.

Calc & sync audit #5e (2026-11-05): re-voiced sentences (checks/revoice.py REVOICE) get ESTIMATED clip lengths and shift what
follows; `--sync` writes the estimated times into the storyboard first.

usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_moving/checks/make_timing.py [--sync]
"""
from __future__ import annotations

import json
import math
import re
import sys
from pathlib import Path

import yaml

sys.path.insert(0, str(Path(__file__).resolve().parent))
import revoice  # noqa: E402

ROOT = Path(__file__).resolve().parents[4]
OUT = ROOT / "movies" / "ch00" / "ch00_coordinates_moving"
SCR = Path("G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_frames")
FPS, LEAD, GS, GB, GSC, TAIL = 30, 0.3, 0.35, 1.5, 0.8, 0.3
# Part 5 scene -> its id in dryrun1 / splice2 (the single-movie numbering: Part 5's s04 ... s16 were s29 ... s41; the end card s43)
OLD = {"s04_velocities_add": "s29_velocities_add", "s05_accel_same": "s30_accel_same", "s06_parcel_accel": "s31_parcel_accel",
       "s07_sliding_pattern": "s32_sliding_pattern", "s08_ciaran": "s33_ciaran", "s09_lopsided": "s34_lopsided",
       "s10_storm_relative": "s35_storm_relative", "s11_round_parts": "s36_round_parts", "s12_invariant": "s37_invariant", "s13_tau": "s38_tau",
       "s14_tau_derive": "s39_tau_derive", "s15_plymouth": "s40_plymouth", "s16_meaning": "s41_meaning", "s18_end": "s43_end"}


def main() -> int:
    sb = yaml.safe_load((OUT / "storyboard.yaml").read_text(encoding="utf-8"))
    runs = {r: json.loads((SCR / r / "timing.json").read_text(encoding="utf-8")) for r in ("dryrun1", "splice2", "splice3")}
    by = {r: {s["id"]: s for s in t["scenes"]} for r, t in runs.items()}
    scenes, t, bad = [], LEAD, 0
    for i, s in enumerate(sb["scenes"]):
        src = s["measured"]["timing_source"]
        key = f"M_{s['id']}" if src == "splice3" else OLD.get(s["id"], s["id"])
        rs = by[src][key]
        start, out = t, []
        for j, q in enumerate(rs["sentences"]):
            st, en = t, t + q["dur"]
            out.append({"text": q["text"], "audio_text": q.get("audio_text"), "start": round(st, 4), "end": round(en, 4), "dur": q["dur"],
                        "start_frame": round(st * FPS), "end_frame": round(en * FPS), **({"beat": True} if q.get("beat") else {})})
            t = en
            last = j == len(rs["sentences"]) - 1
            t += GB if q.get("beat") else (GSC if last else GS)   # a beat (1.5 s) replaces the sentence or the scene gap
            if last and i == len(sb["scenes"]) - 1:
                t = en + TAIL
        scenes.append({"id": s["id"], "start": round(start, 4), "sentences": out, "end": round(t, 4), "start_frame": round(start * FPS),
                       "end_frame": round(t * FPS), "timing_source": f"{src}:{key}"})
    tm0 = {"scenes": scenes, "total_s": scenes[-1]["end"]}
    shift = revoice.apply(tm0)
    if "--sync" in sys.argv:
        revoice.sync(OUT / "storyboard.yaml", tm0, target=tm0["total_s"], audio_s=tm0["total_s"])
        sb = yaml.safe_load((OUT / "storyboard.yaml").read_text(encoding="utf-8"))
    for s, out in zip(sb["scenes"], (x["sentences"] for x in scenes)):
        src = s["measured"]["timing_source"]
        st_sb = s["sentence_times"]
        if len(st_sb) != len(out):
            print(f"FAIL {s['id']}: {len(out)} sentences in {src}, {len(st_sb)} in the storyboard"); bad += 1; continue
        for j, (q, (a, b)) in enumerate(zip(out, st_sb)):
            if abs(q["start"] - a) > 1e-3 or abs(q["end"] - b) > 1e-3:
                print(f"FAIL {s['id']} S{j}: {q['start']:.3f}-{q['end']:.3f} vs storyboard {a}-{b}"); bad += 1
        vo = re.sub(r"\s*\[beat\]\s*", " ", s["voiceover"]).split()
        tx = " ".join(q["text"] for q in out).split()
        if vo != tx:
            print(f"FAIL {s['id']}: text differs from the storyboard voiceover"); bad += 1
    total = scenes[-1]["end"]
    if abs(total - sb["target_duration_s"]) > 1e-3:
        print(f"FAIL total {total:.3f} vs storyboard {sb['target_duration_s']}"); bad += 1
    tm = {"voice": "af_bella", "speed": 1.0, "fps": FPS, "sample_rate": 24000, "gaps": {"sentence": GS, "scene": GSC, "lead": LEAD, "tail": TAIL},
          "provisional": "made from the measured dry runs (dryrun1 / splice2 / splice3) by checks/make_timing.py; the final TTS replaces it; "
                         f"{len(tm0.get('estimated_sentences', []))} sentences re-voiced by the calc & sync audit #5e with ESTIMATED clip lengths (checks/revoice.py; shift {shift:+.3f} s)",
          "estimated_sentences": tm0.get("estimated_sentences", []),
          "scenes": scenes, "total_s": round(total, 4), "total_frames": int(math.ceil(round(total * FPS, 6)))}
    if bad:
        print(f"make_timing: {bad} failure(s); timing.json NOT written")
        return 1
    (OUT / "timing.json").write_text(json.dumps(tm, indent=1, ensure_ascii=False), encoding="utf-8")
    n = sum(len(s["sentences"]) for s in scenes)
    print(f"make_timing: {len(scenes)} scenes, {n} sentences, {sum(1 for s in scenes for q in s['sentences'] if q.get('beat'))} beats, "
          f"total {total:.3f} s ({tm['total_frames']} frames); every sentence time = storyboard to 1 ms; texts = storyboard voiceovers")
    return 0


if __name__ == "__main__":
    sys.exit(main())
