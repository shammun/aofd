"""Provisional timing.json for ch00_coordinates_routes (#5f, Part 6) from the MEASURED dry run (no new TTS).

The director measured the whole script with tools/tts.py (dryrun2) and re-measured the shortened s02 recap alone (mini_s02),
then spliced it in: G:/.../scratch/movies/ch00_coordinates_routes/dryrun2_spliced/timing.json. That file's scenes and
sentences are the measured ones; only its `total_s` / `total_frames` / `self_check` still describe the unspliced run
(1032.225 s). This script copies the spliced scenes, recomputes the totals from the last scene's end (tts.py tail rule), checks
every sentence time against the storyboard's `sentence_times` (to 1 ms), the scene texts against the storyboard voiceovers
(with "[beat]" removed), the beat count, and the end against `target_duration_s`. The file is marked provisional: the final
TTS (heavy phase) replaces it.

Part 1 lessons pass (2026-11-05): re-voiced sentences (checks/revoice.py REVOICE) get ESTIMATED clip lengths and shift what follows;
`--sync` writes the estimated times into the storyboard first.

usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_routes/checks/make_timing.py [--sync]
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
OUT = ROOT / "movies" / "ch00" / "ch00_coordinates_routes"
SRC = Path("G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_routes/dryrun2_spliced/timing.json")
FPS = 30


def main() -> int:
    tm = json.loads(SRC.read_text(encoding="utf-8"))
    shift = revoice.apply(tm)
    if "--sync" in sys.argv:
        end = tm["scenes"][-1]["end"]
        revoice.sync(OUT / "storyboard.yaml", tm, target=end, audio_s=end)
    sb = yaml.safe_load((OUT / "storyboard.yaml").read_text(encoding="utf-8"))
    bad = 0
    if [s["id"] for s in tm["scenes"]] != [s["id"] for s in sb["scenes"]]:
        print("FAIL scene ids differ between the dry run and the storyboard")
        return 1
    for s, q in zip(sb["scenes"], tm["scenes"]):
        st = s["sentence_times"]
        if len(st) != len(q["sentences"]):
            print(f"FAIL {s['id']}: {len(q['sentences'])} sentences measured, {len(st)} in the storyboard"); bad += 1; continue
        for j, (x, (a, b)) in enumerate(zip(q["sentences"], st)):
            if abs(x["start"] - a) > 1e-3 or abs(x["end"] - b) > 1e-3:
                print(f"FAIL {s['id']} S{j}: {x['start']:.3f}-{x['end']:.3f} vs storyboard {a}-{b}"); bad += 1
        if abs(q["start"] - s["t"][0]) > 1e-3 or abs(q["end"] - s["t"][1]) > 1e-3:
            print(f"FAIL {s['id']}: scene {q['start']}-{q['end']} vs storyboard {s['t']}"); bad += 1
        vo = re.sub(r"\s*\[beat\]\s*", " ", s["voiceover"]).split()
        tx = " ".join(x["text"] for x in q["sentences"]).split()
        if vo != tx:
            print(f"FAIL {s['id']}: text differs from the storyboard voiceover"); bad += 1
        nb = len(re.findall(r"\[beat\]", s["voiceover"]))
        if nb != sum(1 for x in q["sentences"] if x.get("beat")):
            print(f"FAIL {s['id']}: {nb} beats in the voiceover, {sum(1 for x in q['sentences'] if x.get('beat'))} measured"); bad += 1
    total = tm["scenes"][-1]["end"]
    if abs(total - sb["target_duration_s"]) > 1e-3:
        print(f"FAIL total {total:.3f} vs storyboard {sb['target_duration_s']}"); bad += 1
    if bad:
        print(f"make_timing: {bad} failure(s); timing.json NOT written")
        return 1
    out = {k: tm[k] for k in ("voice", "speed", "fps", "sample_rate", "gaps")}
    out["provisional"] = ("made from the measured dry run dryrun2_spliced (the full script, with s02 re-measured alone in mini_s02 and spliced in) by "
                          "checks/make_timing.py; the final TTS replaces it")
    out["scenes"] = tm["scenes"]
    out["total_s"] = round(total, 4)
    out["total_frames"] = int(math.ceil(round(total * FPS, 6)))
    out["cues_dry_run"] = tm.get("cues")
    out["splice"] = tm.get("splice")
    if tm.get("estimated_sentences"):
        out["estimated_sentences"] = tm["estimated_sentences"]
        out["provisional"] += f"; {len(tm['estimated_sentences'])} re-voiced sentences ESTIMATED (checks/revoice.py, shift {shift:+.3f} s)"
    (OUT / "timing.json").write_text(json.dumps(out, indent=1, ensure_ascii=False), encoding="utf-8")
    n = sum(len(s["sentences"]) for s in out["scenes"])
    nb = sum(1 for s in out["scenes"] for q in s["sentences"] if q.get("beat"))
    print(f"make_timing: {len(out['scenes'])} scenes, {n} sentences, {nb} beats, total {total:.3f} s ({out['total_frames']} frames); "
          f"every sentence time = storyboard to 1 ms; texts = storyboard voiceovers")
    return 0


if __name__ == "__main__":
    sys.exit(main())
