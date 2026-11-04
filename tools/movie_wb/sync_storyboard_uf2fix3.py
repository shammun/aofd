"""UF2 fix loop 3: sync movies/ch00/ch00_weather_basics/storyboard.yaml with the fix-3 TTS (s50 S3, s59 S2: map reading comes
"later in this series", not in the next video; series audit) and the fix-3 visuals (review 3). No manifest change (no data change).
usage: .venv/Scripts/python.exe tools/movie_wb/sync_storyboard_uf2fix3.py"""
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
VIS = {
    "s38b_reanalysis_stack": "UF2 fix 3 (R3-M2): each keyword row is gone 8 frames before the next fades in (no double exposure).",
    "s39_surface_pressure": "UF2 fix 3 (R3-M3): the Tibet -> Americas hop starts on 'and the Andes' and takes 2.7 s, the return starts as S3 ends and takes 2.7 s; sine-eased (peak 82 °/s, was ~1200 °/s).",
    "s47_cold_front": "UF2 fix 3 (R3-M4, R3-S5): one colour bar at a time; the 850-hPa map turns to plain grey ground as the wall rises (its bar leaves with its colours).",
    "s48_warm_front": "UF2 fix 3 (R3-M1): the camera zooms in on the slope triangle during S2 (horizontal leg 66 px) and back out at its end; '50 km' sits clear of the thick line; grey ground.",
    "s48b_front_stack": "UF2 fix 3 (R3-M2): keyword rows swap with an 8-frame gap.",
    "s50_front_symbols": "UF2 fix 3 (series audit): S3 'Later in this series, you'll learn to read these maps in detail.'; keyword 'weather maps: later'.",
    "s59_ciaran_after": "UF2 fix 3 (series audit): S2 'Later in this series, we'll learn to read weather maps like this one in detail.'; keyword 'weather maps: later'.",
}
for s in sb["scenes"]:
    s["voiceover"] = narr[s["id"]]
    t = T[s["id"]]
    s["t"] = [round(t["start"], 3), round(t["end"], 3)]
    s["sentence_times"] = [[round(x["start"], 3), round(x["end"], 3)] for x in t["sentences"]]
    if s["id"] in VIS:
        s["uf2_fix3_visual"] = VIS[s["id"]]
words = sum(len(s["voiceover"].split()) for s in sb["scenes"])
sb["measured_narration_s"] = round(tm["total_s"], 3)
sb["measured_frames"] = tm["total_frames"]
sb["target_duration_s"] = round(tm["total_s"] + 2.5, 3)
sb["words"] = words
sb["sentences"] = sum(len(s["sentences"]) for s in tm["scenes"])
sb["qa_expectations"]["duration_s"] = sb["target_duration_s"]
sb["qa_expectations"]["captions"]["cues"] = tm["cues"] if isinstance(tm.get("cues"), int) else len(tm.get("cues") or [])
sb["uf2_fix3"] = {
    "date": "2026-11-04",
    "narration": ["s50 S3: 'You'll learn to read these maps in detail in the next video.' -> 'Later in this series, you'll learn to read these maps in detail.'",
                  "s59 S2: 'In the next video, we'll learn to read weather maps like this one in detail.' -> 'Later in this series, we'll learn to read weather maps like this one in detail.'"],
    "why": "series audit (reports/ch00_series_audit.md): map reading starts about 36 movies later",
    "splice": "tools/movie_wb/splice_uf2fix3.py (BS.1770-4 loudness match to the nearest unchanged neighbours + look-ahead limiter)",
}
(D / "storyboard.yaml").write_text(head + yaml.safe_dump(sb, sort_keys=False, allow_unicode=True, width=120), encoding="utf-8")
print("storyboard synced:", sb["target_duration_s"], "s,", words, "words,", sb["sentences"], "sentences")

