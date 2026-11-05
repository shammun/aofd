"""Provisional timing.json for ch00_coordinates_storm (#5b, Part 2) from the MEASURED dry run 6 (no new TTS).

dryrun6 (G:/.../scratch/movies/ch00_coordinates_storm/dryrun6/timing.json, tools/tts.py, af_bella x 1.0) is the whole movie.
This script copies its scenes and sentences, checks that every sentence time equals the storyboard's `sentence_times` (1 ms),
that the scene texts equal the storyboard voiceovers ("[beat]" removed) and the total equals target_duration_s, and writes
movies/ch00/ch00_coordinates_storm/timing.json marked provisional. The final TTS (heavy phase; s19 S1 and the s29/s30
re-voiced slot sentences) replaces it, and then the scene components re-time themselves (SS/SE/AT read the text).

usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_storm/checks/make_timing.py
"""
from __future__ import annotations

import json
import math
import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[4]
OUT = ROOT / "movies" / "ch00" / "ch00_coordinates_storm"
RUN = Path("G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_storm/dryrun6/timing.json")
FPS = 30


def main() -> int:
    sb = yaml.safe_load((OUT / "storyboard.yaml").read_text(encoding="utf-8"))
    tm = json.loads(RUN.read_text(encoding="utf-8"))
    bad = 0
    if [s["id"] for s in tm["scenes"]] != [s["id"] for s in sb["scenes"]]:
        print("FAIL scene ids differ between dryrun6 and the storyboard")
        return 1
    for s, q in zip(sb["scenes"], tm["scenes"]):
        st = s["sentence_times"]
        if len(st) != len(q["sentences"]):
            print(f"FAIL {s['id']}: {len(q['sentences'])} sentences in dryrun6, {len(st)} in the storyboard"); bad += 1; continue
        for j, (x, (a, b)) in enumerate(zip(q["sentences"], st)):
            if abs(x["start"] - a) > 1e-3 or abs(x["end"] - b) > 1e-3:
                print(f"FAIL {s['id']} S{j}: {x['start']}-{x['end']} vs {a}-{b}"); bad += 1
        vo = re.sub(r"\s*\[beat\]\s*", " ", s["voiceover"]).split()
        if vo != " ".join(x["text"] for x in q["sentences"]).split():
            print(f"FAIL {s['id']}: text differs from the storyboard voiceover"); bad += 1
    if abs(tm["scenes"][-1]["sentences"][-1]["end"] + 0.3 - tm["total_s"]) > 1e-3 or abs(tm["total_s"] - 2479.45) > 1e-3:
        print(f"FAIL total {tm['total_s']}"); bad += 1
    if bad:
        print(f"make_timing: {bad} failure(s); timing.json NOT written")
        return 1
    keep = {k: tm[k] for k in ("voice", "speed", "fps", "sample_rate", "gaps", "scenes", "total_s")}
    keep["provisional"] = ("copied from the measured dry run 6 (G:/.../ch00_coordinates_storm/dryrun6) by checks/make_timing.py; "
                           "the final TTS (heavy phase) replaces it")
    keep["total_frames"] = int(math.ceil(round(tm["total_s"] * FPS, 6)))
    (OUT / "timing.json").write_text(json.dumps(keep, indent=1, ensure_ascii=False), encoding="utf-8")
    n = sum(len(s["sentences"]) for s in keep["scenes"])
    print(f"make_timing: {len(keep['scenes'])} scenes, {n} sentences, total {keep['total_s']:.3f} s ({keep['total_frames']} frames); "
          f"every sentence time = storyboard to 1 ms; texts = storyboard voiceovers")
    return 0


if __name__ == "__main__":
    sys.exit(main())
