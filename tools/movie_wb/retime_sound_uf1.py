"""UF1: re-time movies/ch00/ch00_weather_basics/sound_cues.yaml to the final v4 timing.json (seed 11 kept).

* storm-tense section = new s54 start → new s60 start;
* effects tied to words are re-anchored on their phrases (s47 thunder/rain on "tall clouds"/"heavy showers", s48 rain on
  "steady rain"); new effects where the new pictures show the thing: whoosh on the s03 flight to Brittany and the s25
  flight to Singapore, gentle wind under the s49 particles.
usage: .venv/Scripts/python.exe tools/movie_wb/retime_sound_uf1.py
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


sec = cues["music"]["sections"]
a, b = round(S["s54_ciaran_intro"]["start"], 3), round(S["s60_recap"]["start"], 3)
sec[0]["to_s"], sec[1]["from_s"], sec[1]["to_s"], sec[2]["from_s"] = a, a, b, b
eff = [e for e in cues["effects"] if e["scene"] not in ("s47_cold_front", "s48_warm_front")]
eff += [
    {"effect": "thunder_far", "scene": "s47_cold_front", "offset": at("s47_cold_front", 6, "tall clouds"), "duration": 2.5, "intensity": 0.4, "lufs": -29,
     "fade_in": 0.2, "fade_out": 1.2, "seed": 31, "shows": "saturated air over the cold front pulses (tall clouds)"},
    {"effect": "rain_heavy", "scene": "s47_cold_front", "offset": at("s47_cold_front", 6, "heavy showers"), "duration": 3.0, "intensity": 0.35, "lufs": -30,
     "fade_in": 0.4, "fade_out": 1.0, "seed": 32, "shows": "heavy showers at the cold front"},
    {"effect": "rain_light", "scene": "s48_warm_front", "offset": at("s48_warm_front", 3, "steady rain"), "duration": 2.8, "intensity": 0.3, "lufs": -30,
     "fade_in": 0.5, "fade_out": 1.0, "seed": 33, "shows": "layered cloud ahead of the warm front, steady rain"},
    {"effect": "whoosh", "scene": "s03_air_parcel", "offset": round(S["s03_air_parcel"]["sentences"][4]["start"] - S["s03_air_parcel"]["start"], 2), "duration": 2.0,
     "intensity": 0.35, "lufs": -29, "fade_in": 0.3, "fade_out": 0.7, "seed": 34, "shows": "the globe flies down to Brittany"},
    {"effect": "whoosh", "scene": "s25_tropics", "offset": max(0.0, at("s25_tropics", 1, "Singapore") - 1.0), "duration": 1.6, "intensity": 0.3, "lufs": -29,
     "fade_in": 0.3, "fade_out": 0.6, "seed": 35, "shows": "the globe flies to Singapore"},
    {"effect": "wind_gentle", "scene": "s49_real_fronts", "offset": 0.0, "duration": 18.0, "intensity": 0.35, "lufs": -29, "fade_in": 1.5, "fade_out": 2.5,
     "seed": 36, "shows": "3000 wind particles flowing over the 850-hPa chart"},
]
cues["effects"] = eff
hdr = ("# ch00_weather_basics sound cue sheet v4 (UF1; tools/sound/mix.py format; scene + offset from timing.json). Re-timed by\n"
       "# tools/movie_wb/retime_sound_uf1.py: storm-tense = s54 start -> s60 start; s47/s48 effects on their phrases; new whooshes (s03, s25) and wind (s49).\n")
(MOV / "sound_cues.yaml").write_text(hdr + yaml.safe_dump(cues, sort_keys=False, allow_unicode=True, width=150), encoding="utf-8")
print("storm-tense", a, "->", b, "; effects", len(eff))
