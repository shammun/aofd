"""UF2 build: sync movies/ch00/ch00_weather_basics/storyboard.yaml (v5) with the final UF2 TTS and the build.
* voiceover of every scene = script.md narration; t, sentence_times, measured_*, words, sentences, target_duration_s,
  qa_expectations from timing.json; dry_run -> the final run; a `uf2_build` block (narration changed to fit the data,
  deviations from the plan, the house kit used).
usage: .venv/Scripts/python.exe tools/movie_wb/sync_storyboard_uf2.py"""
import json
import re
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
D = ROOT / "movies/ch00/ch00_weather_basics"
raw = (D / "storyboard.yaml").read_text(encoding="utf-8")
head = "".join(l + "\n" for l in raw.splitlines() if l.startswith("#"))
sb = yaml.safe_load(raw)
tm = json.loads((D / "timing.json").read_text(encoding="utf-8"))
script = (D / "script.md").read_text(encoding="utf-8")
narr = {m.group(1): re.sub(r"\s*\[beat\]", "", m.group(2).strip()) for m in re.finditer(r"^## (\S+)\n(.*?)(?=\n\n|\Z)", script, re.S | re.M)}
T = {s["id"]: s for s in tm["scenes"]}
assert [s["id"] for s in sb["scenes"]] == [s["id"] for s in tm["scenes"]], "storyboard and timing scene lists differ"
words = 0
for s in sb["scenes"]:
    s["voiceover"] = narr[s["id"]]
    t = T[s["id"]]
    s["t"] = [round(t["start"], 3), round(t["end"], 3)]
    s["sentence_times"] = [[round(x["start"], 3), round(x["end"], 3)] for x in t["sentences"]]
    words += len(s["voiceover"].split())
sb["measured_narration_s"] = round(tm["total_s"], 3)
sb["measured_frames"] = tm["total_frames"]
sb["target_duration_s"] = round(tm["total_s"] + 2.5, 3)
sb["words"] = words
sb["sentences"] = sum(len(s["sentences"]) for s in tm["scenes"])
sb["qa_expectations"]["duration_s"] = sb["target_duration_s"]
sb["qa_expectations"]["captions"]["cues"] = len(tm.get("cues") or []) if not isinstance(tm.get("cues"), int) else tm["cues"]
sb["dry_run"] = {"tool": "tools/tts.py (Kokoro af_bella, speed 1.0, .venv-tts)", "date": "2026-10-29", "final": True,
                 "run": "G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_weather_basics/uf2/tts", "audio_s": round(tm["total_s"], 3),
                 "cues": sb["qa_expectations"]["captions"]["cues"], "self_check": tm.get("self_check")}
sb["uf2_build"] = {
    "date": "2026-10-29",
    "narration_follows_data": [
        "s27c S2-S3: 'up to about nine kilometres' -> 'about ten kilometres', 'at nine kilometres' -> 'at ten kilometres' (box-mean z(300 hPa) = 9.70 km)",
        "s38b S5: 'about sixteen kilometres' -> 'about sixteen and a half kilometres' (0-10N strip-mean WMO tropopause 16.61 km, -76.7 C)",
        "s48b S4: 'about a hundred and thirty kilometres' -> 'about a hundred kilometres' (front_by_level max_step 80 km traces 900-650 hPa; fit 1:44 -> 110 km over 1.5-4 km)"],
    "house_kit": ["K1 GlobeFrame (house/kit/frame.tsx)", "K2 SourceBelow / SourceLine", "K3 Callout", "K4 ColumnFaces + assertColumnEdges (house/kit/col3d.tsx)",
                  "K5 LayerStack3D + stackCam (house/kit/stack3d.tsx) + movies/data/_stack.py", "K6 movie_qa gate 'overlap' (masks from house/kit/bbox.tsx)",
                  "K7 AnimatedWindArrow, FlowParticles, BeltChevrons (house/kit/wind.tsx), globecam.ts"],
    "deviations": ["s20c dropped (orchestrator)", "s48b: the slice walls are not re-drawn in the stack (the two slice lines are marked on the bottom layer instead)",
                   "flat maps (s32, s35, s43-s50, s54-s58) scaled ×0.951 about their top-left corner so every map box ends at y 820 (K2)"],
}
(D / "storyboard.yaml").write_text(head + yaml.safe_dump(sb, sort_keys=False, allow_unicode=True, width=120), encoding="utf-8")
print("storyboard synced:", sb["target_duration_s"], "s,", words, "words,", sb["sentences"], "sentences")
