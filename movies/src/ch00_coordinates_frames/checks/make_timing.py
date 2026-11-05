"""Provisional timing.json for ch00_coordinates_frames (#5d, Part 4) from the MEASURED dry runs (no new TTS).

The storyboard (movies/ch00/ch00_coordinates_frames/storyboard.yaml) names, per scene, the dry run its clip lengths come from
(`measured.timing_source`: dryrun1, splice2 or splice3 under G:/.../scratch/movies/ch00_coordinates_frames/). This script takes
each scene's sentences (text, clip length, beat flag) from that run and lays them out again with the tools/tts.py gap rules
(lead 0.3 s, sentence 0.35 s, beat 1.5 s, scene 0.8 s, tail 0.3 s), exactly as the director's method did. It then checks that
every sentence time equals the storyboard's `sentence_times` (to 1 ms) and that the scene texts equal the storyboard voiceovers
(with "[beat]" removed). The file is marked provisional: the final TTS (heavy phase) replaces it.

usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_frames/checks/make_timing.py
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[4]
OUT = ROOT / "movies" / "ch00" / "ch00_coordinates_frames"
SCR = Path("G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_frames")
FPS, LEAD, GS, GB, GSC, TAIL = 30, 0.3, 0.35, 1.5, 0.8, 0.3


# text edits made after the dry runs (clip lengths of these sentences are the measured ones of the old words; re-measured by the final TTS)
EDITS = [("is about seventy six degrees", "is about seventy five point eight degrees"),          # s09 S7 (Part 3 numbers, coordinator 2026-11-05)
         ("are about seventy six degrees apart", "are about seventy five point eight degrees apart")]  # s28 S2


def fix(t: str) -> str:
    for a, b in EDITS:
        t = t.replace(a, b)
    return t


def main() -> int:
    sb = yaml.safe_load((OUT / "storyboard.yaml").read_text(encoding="utf-8"))
    runs = {r: json.loads((SCR / r / "timing.json").read_text(encoding="utf-8")) for r in ("dryrun1", "splice2", "splice3")}
    by = {r: {s["id"]: s for s in t["scenes"]} for r, t in runs.items()}
    scenes, t, bad = [], LEAD, 0
    for i, s in enumerate(sb["scenes"]):
        src = s["measured"]["timing_source"]
        key = s["id"] if src != "splice3" else f"F_{s['id']}"
        key = {"s29_end": "s43_end"}.get(key, key) if src == "dryrun1" else key   # the end card: dryrun1 was the whole movie (s43_end)
        rs = by[src][key]
        sents = [dict(q, text=fix(q["text"])) for q in rs["sentences"]]
        if i:
            t += 0  # the gap after the previous scene is already added below
        start = t
        out = []
        for j, q in enumerate(sents):
            st, en = t, t + q["dur"]
            out.append({"text": q["text"], "audio_text": q.get("audio_text"), "start": round(st, 4), "end": round(en, 4), "dur": q["dur"],
                        "start_frame": round(st * FPS), "end_frame": round(en * FPS), **({"beat": True} if q.get("beat") else {})})
            t = en
            last = j == len(sents) - 1
            t += GB if q.get("beat") else (GSC if last else GS)   # a beat (1.5 s) replaces the sentence or the scene gap
            if last and i == len(sb["scenes"]) - 1:
                t = en + TAIL
        rec = {"id": s["id"], "start": round(start, 4), "sentences": out, "end": round(t, 4), "start_frame": round(start * FPS), "end_frame": round(t * FPS),
               "timing_source": src}
        scenes.append(rec)
        # checks against the storyboard
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
          "provisional": "made from the measured dry runs (dryrun1 / splice2 / splice3) by checks/make_timing.py; the final TTS replaces it; s09 S7 and s28 S2 re-worded to 'seventy five point eight' after the dry run (clip lengths not re-measured)",
          "scenes": scenes, "total_s": round(total, 4), "total_frames": int(-(-total * FPS // 1))}
    import math
    tm["total_frames"] = int(math.ceil(round(total * FPS, 6)))
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
