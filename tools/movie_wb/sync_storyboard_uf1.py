"""UF1 build: sync movies/ch00/ch00_weather_basics/storyboard.yaml with the final v4 TTS and the build.
* voiceover of every scene = script.md narration (s47 S5 / s48 S3 now follow the ERA5 slice slopes, W70/W71);
* t, sentence_times, measured_narration_s/frames, words, sentences, target_duration_s, qa_expectations from timing.json;
* a `uf1_build` block: what was built differently from the plan (three.js terrain instead of the Cesium shot, slopes).
The header comment block is kept; PyYAML re-flows the rest (same keys and order).
usage: .venv/Scripts/python.exe tools/movie_wb/sync_storyboard_uf1.py"""
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
narr = {}
for m in re.finditer(r"^## (\S+)\n(.*?)(?=\n\n|\Z)", script, re.S | re.M):
    narr[m.group(1)] = m.group(2).strip()
T = {s["id"]: s for s in tm["scenes"]}
words = 0
for s in sb["scenes"]:
    if s["id"] in narr:
        s["voiceover"] = re.sub(r"\s*\[beat\]", "", narr[s["id"]]).strip()
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
sb["qa_expectations"]["captions"]["cues"] = tm.get("cues") if isinstance(tm.get("cues"), int) else len(tm.get("cues") or [])
sb["uf1_build"] = {
    "date": "2026-10-29", "tts": "G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_weather_basics/v4/uf1/tts (Kokoro af_bella 1.0)",
    "narration_follows_data": ["s47 S5: 'about one kilometre up for every fifteen kilometres along' (ERA5 slice 925-500 hPa 1:15.1, W70; planned 50-100 km)",
                               "s48 S3: 'about one kilometre up for every fifty kilometres along' (ERA5 slice 975-600 hPa 1:52.3, W71; planned 100-200 km)"],
    "deviations": ["s03: the Brittany close-up is a three.js Terrain (ETOPO 2022 60\" ×5 + Blue Marble NG 21600 crop) in Remotion, not a CesiumJS frame "
                   "pass, so the parcel box, trail, wind arrows and labels share one frame-driven renderer; the parcel box is 12 km × 12 km × 2.4 km "
                   "(×5) and is shown until it reaches the Channel coast (32 × 10 min of the ERA5 path, W75)",
                   "s25: the polar camera key is {62, 80, 2.6} (not lon 15) so the zonal-mean section (in the 0/180° meridian plane) faces the camera",
                   "s46: the gold transect stays the fronts.json transect that its graph is drawn along; the 48.5N slice line appears on the s47 map",
                   "s47-s48: isotherms on the slice are not drawn (anomaly colours + saturated-air whitening only)"],
}
(D / "storyboard.yaml").write_text(head + yaml.safe_dump(sb, sort_keys=False, allow_unicode=True, width=120), encoding="utf-8")
print("storyboard synced:", sb["target_duration_s"], "s,", words, "words")
