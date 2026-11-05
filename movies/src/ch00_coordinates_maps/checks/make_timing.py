"""Provisional timing.json for ch00_coordinates_maps (#5g, Part 7) from the MEASURED dry run (no new TTS).

The storyboard (movies/ch00/ch00_coordinates_maps/storyboard.yaml) was timed from `dry_run.run` =
G:/.../scratch/movies/ch00_coordinates_maps/dryrun3_spliced (the full dryrun3 with s02_part6_recap re-measured alone in
mini_s02 and spliced in). This script copies each scene's sentences (text, absolute times, clip length, beat flag) from that run
(the gap rules of tools/tts.py are re-checked inside each scene; the splice's 0.3-s gap after s02 is kept). It then checks
that every sentence time equals the storyboard's `sentence_times` (to 1 ms), that the scene texts equal the storyboard
voiceovers (with "[beat]" removed) and that the total equals the storyboard's audio length. The file is marked provisional:
the final TTS (heavy phase) replaces it.

usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_maps/checks/make_timing.py
"""
from __future__ import annotations

import json
import math
import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[4]
OUT = ROOT / "movies" / "ch00" / "ch00_coordinates_maps"
RUN = Path("G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_maps/dryrun3_spliced")
FPS, LEAD, GS, GB, GSC, TAIL = 30, 0.3, 0.35, 1.5, 0.8, 0.3
# text edits made after the dry run (clip lengths are the measured ones of the old words; the final TTS re-measures)
EDITS = [("Just outside the thirty degree ring", "Just inside the thirty degree ring"),   # s17 S12: 34 N is poleward of 30 N (CHECK DM28)
         ("about two hundred and eighty five kilometres per hour", "about two hundred and eighty four kilometres per hour")]   # s18 S10: 79 × 3.6 = 284.4 (DC36)


def fix(t: str) -> str:
    for a, b in EDITS:
        t = t.replace(a, b)
    return t


def main() -> int:
    sb = yaml.safe_load((OUT / "storyboard.yaml").read_text(encoding="utf-8"))
    run = json.loads((RUN / "timing.json").read_text(encoding="utf-8"))
    by = {s["id"]: s for s in run["scenes"]}
    scenes, bad = [], 0
    for i, s in enumerate(sb["scenes"]):
        rs = by[s["id"]]
        # the run's own absolute times are kept (the splice left a 0.3-s gap after s02 instead of 0.8 s; the storyboard was
        # timed from this file, so reproducing it exactly keeps every AT on its words; the final TTS restores the 0.8-s rule)
        out = [{"text": fix(q["text"]), "audio_text": q.get("audio_text"), "start": round(q["start"], 4), "end": round(q["end"], 4), "dur": q["dur"],
                "start_frame": round(q["start"] * FPS), "end_frame": round(q["end"] * FPS), **({"beat": True} if q.get("beat") else {})}
               for q in rs["sentences"]]
        scenes.append({"id": s["id"], "start": round(rs["start"], 4), "sentences": out, "end": round(rs["end"], 4), "start_frame": round(rs["start"] * FPS),
                       "end_frame": round(rs["end"] * FPS), "timing_source": f"dryrun3_spliced:{s['id']}"})
        # gap rules (tools/tts.py) re-checked on the run: 0.35 s between sentences, 1.5 s after a beat
        for j in range(len(out) - 1):
            g = out[j + 1]["start"] - out[j]["end"]
            if abs(g - (GB if out[j].get("beat") else GS)) > 1e-3:
                print(f"FAIL {s['id']} S{j}->S{j + 1}: gap {g:.3f} s"); bad += 1
        st_sb = s["sentence_times"]
        if len(st_sb) != len(out):
            print(f"FAIL {s['id']}: {len(out)} sentences in the run, {len(st_sb)} in the storyboard"); bad += 1; continue
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
          "provisional": "copied from the measured dry run dryrun3_spliced (absolute times, incl. its 0.3-s s02->s03 splice gap) by checks/make_timing.py; s17 S12 'Just inside the thirty degree ring' and s18 S10 'two hundred and eighty four' re-worded after the run (clips not re-measured); the final TTS replaces it",
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
