"""UF2 fix 1: the same re-timing as retime_sound_uf2.py on the fix-1 timing.json (s27c and s53 narration changed); the two
stack whooshes now accompany outside camera moves (no fly-throughs, HOUSE_STYLE §5b), so their notes say so.

UF2: re-time movies/ch00/ch00_weather_basics/sound_cues.yaml to the final v5 timing.json (seed 11 kept).

* storm-tense section = new s54 start -> new s60 start (scene offsets of the existing effects need no change: they are
  relative to their scene, whose narration is unchanged, except the phrase-anchored s47/s48 ones, re-anchored here);
* new effects where the new pictures show the thing: a soft whoosh as the camera flies up through the s27c humidity stack and
  through the s38b shells, gentle wind under the s53 streaklines (both westerly belts), a light breeze under the rising s31
  thermals.
usage: .venv/Scripts/python.exe tools/movie_wb/retime_sound_uf2fix1.py
"""
import json
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
MOV = ROOT / "movies/ch00/ch00_weather_basics"
cues = yaml.safe_load((MOV / "sound_cues.yaml").read_text(encoding="utf-8"))
tm = json.loads((MOV / "timing.json").read_text(encoding="utf-8"))
S = {s["id"]: s for s in tm["scenes"]}


def at(sid: str, j: int, phrase: str) -> float:
    s = S[sid]["sentences"][j]
    i = s["text"].index(phrase)
    return round(s["start"] + (s["end"] - s["start"]) * i / len(s["text"]) - S[sid]["start"], 2)


def ss(sid: str, j: int) -> float:
    return round(S[sid]["sentences"][j]["start"] - S[sid]["start"], 2)


sec = cues["music"]["sections"]
a, b = round(S["s54_ciaran_intro"]["start"], 3), round(S["s60_recap"]["start"], 3)
sec[0]["to_s"], sec[1]["from_s"], sec[1]["to_s"], sec[2]["from_s"] = a, a, b, b
eff = [e for e in cues["effects"] if e["scene"] in S and not e.get("uf2")]
for e in eff:   # phrase-anchored effects follow their words
    if e["scene"] == "s47_cold_front" and e["effect"] == "thunder_far":
        e["offset"] = at("s47_cold_front", 6, "tall clouds")
    if e["scene"] == "s47_cold_front" and e["effect"] == "rain_heavy":
        e["offset"] = at("s47_cold_front", 6, "heavy showers")
    if e["scene"] == "s48_warm_front" and e["effect"] == "rain_light":
        e["offset"] = at("s48_warm_front", 3, "steady rain")
eff += [
    {"effect": "whoosh", "scene": "s27c_vapour_stack", "offset": max(0.0, ss("s27c_vapour_stack", 2) + 1.0), "duration": 1.8, "intensity": 0.3, "lufs": -30,
     "fade_in": 0.3, "fade_out": 0.7, "seed": 41, "shows": "the camera hovers round the humidity layers from outside, bottom to top", "uf2": True},
    {"effect": "whoosh", "scene": "s38b_reanalysis_stack", "offset": ss("s38b_reanalysis_stack", 2), "duration": 1.8, "intensity": 0.3, "lufs": -30,
     "fade_in": 0.3, "fade_out": 0.7, "seed": 42, "shows": "the camera swings round the temperature shells from outside, bottom to top", "uf2": True},
    {"effect": "wind_gentle", "scene": "s53_trades_westerlies", "offset": ss("s53_trades_westerlies", 1), "duration": 26.0, "intensity": 0.3, "lufs": -30,
     "fade_in": 2.0, "fade_out": 3.0, "seed": 43, "shows": "mean-wind streaklines over the trade-wind and westerly belts", "uf2": True},
    {"effect": "wind_gentle", "scene": "s31_cloud_base", "offset": 1.0, "duration": 12.0, "intensity": 0.25, "lufs": -30, "fade_in": 2.0, "fade_out": 2.5,
     "seed": 44, "shows": "warm air rising in thermals over the sunny fields", "uf2": True},
]
cues["effects"] = eff
hdr = ("# ch00_weather_basics sound cue sheet v5 (UF2 fix 1; tools/sound/mix.py format; scene + offset from timing.json). Re-timed by\n"
       "# tools/movie_wb/retime_sound_uf2.py: storm-tense = s54 start -> s60 start; s47/s48 effects on their phrases; new whooshes (s27c, s38b), wind (s53, s31).\n")
(MOV / "sound_cues.yaml").write_text(hdr + yaml.safe_dump(cues, sort_keys=False, allow_unicode=True, width=150), encoding="utf-8")
print("storm-tense", a, "->", b, "; effects", len(eff))
