"""Provisional timing.json for ch00_coordinates_sphere (#5c, Part 3) from the MEASURED dry run 3 (no new TTS).

The storyboard (movies/ch00/ch00_coordinates_sphere/storyboard.yaml) was generated from dry run 3
(G:/.../scratch/movies/ch00_coordinates_sphere/dryrun3/timing.json). This script copies that run's scenes and sentences,
checks that every sentence time equals the storyboard's `sentence_times` (to 1 ms), that every scene text equals the storyboard
voiceover (with "[beat]" removed) and that the total equals `target_duration_s`, and writes timing.json marked provisional (the
final TTS of the heavy phase replaces it; the composition reads only scenes / sentences / total_frames).

usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_sphere/checks/make_timing.py
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[4]
OUT = ROOT / "movies" / "ch00" / "ch00_coordinates_sphere"
DRY = Path("G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_sphere/dryrun3/timing.json")


def main() -> int:
    sb = yaml.safe_load((OUT / "storyboard.yaml").read_text(encoding="utf-8"))
    tm = json.loads(DRY.read_text(encoding="utf-8"))
    bad = 0
    if [s["id"] for s in tm["scenes"]] != [s["id"] for s in sb["scenes"]]:
        print("FAIL scene ids differ between dry run 3 and the storyboard")
        return 1
    for s_sb, s_tm in zip(sb["scenes"], tm["scenes"]):
        st = s_sb["sentence_times"]
        if len(st) != len(s_tm["sentences"]):
            print(f"FAIL {s_sb['id']}: {len(s_tm['sentences'])} sentences in the dry run, {len(st)} in the storyboard"); bad += 1; continue
        for j, (q, (a, b)) in enumerate(zip(s_tm["sentences"], st)):
            if abs(q["start"] - a) > 1e-3 or abs(q["end"] - b) > 1e-3:
                print(f"FAIL {s_sb['id']} S{j}: {q['start']:.3f}-{q['end']:.3f} vs storyboard {a}-{b}"); bad += 1
        vo = re.sub(r"\s*\[beat\]\s*", " ", s_sb["voiceover"]).split()
        tx = " ".join(q["text"] for q in s_tm["sentences"]).split()
        if vo != tx:
            print(f"FAIL {s_sb['id']}: text differs from the storyboard voiceover"); bad += 1
    if abs(tm["total_s"] - sb["target_duration_s"]) > 1e-3:
        print(f"FAIL total {tm['total_s']} vs storyboard {sb['target_duration_s']}"); bad += 1
    if bad:
        print(f"make_timing: {bad} failure(s); timing.json NOT written")
        return 1
    keep = {k: tm[k] for k in ("voice", "speed", "fps", "sample_rate", "gaps", "scenes", "total_s", "total_frames", "cues", "warnings")}
    keep["provisional"] = "copied from the measured dry run 3 (G:/.../ch00_coordinates_sphere/dryrun3) by checks/make_timing.py; the final TTS replaces it"
    (OUT / "timing.json").write_text(json.dumps(keep, indent=1, ensure_ascii=False), encoding="utf-8")
    n = sum(len(s["sentences"]) for s in tm["scenes"])
    print(f"make_timing: {len(tm['scenes'])} scenes, {n} sentences, total {tm['total_s']:.3f} s ({tm['total_frames']} frames); "
          f"every sentence time = storyboard to 1 ms; texts = storyboard voiceovers")
    return 0


if __name__ == "__main__":
    sys.exit(main())
