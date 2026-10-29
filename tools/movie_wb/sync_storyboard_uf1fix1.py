"""UF1 fix loop 1: sync movies/ch00/ch00_weather_basics/storyboard.yaml with the spliced narration and the review-1 fixes.
* voiceover of every scene = script.md narration; t, sentence_times, measured_*, words, sentences, target_duration_s and
  qa_expectations from timing.json (as sync_storyboard_uf1.py);
* s47: physics_source / exaggeration / visual note for the new 46.5N slice (W70, W77); s48: the 48.5N slice only;
* a `uf1_fix1` block listing what this loop changed (the uf1_build block is kept).
usage: .venv/Scripts/python.exe tools/movie_wb/sync_storyboard_uf1fix1.py"""
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
U = json.loads((D / "data/uf1.json").read_text(encoding="utf-8"))
script = (D / "script.md").read_text(encoding="utf-8")
narr = {m.group(1): m.group(2).strip() for m in re.finditer(r"^## (\S+)\n(.*?)(?=\n\n|\Z)", script, re.S | re.M)}
T = {s["id"]: s for s in tm["scenes"]}
words = 0
for s in sb["scenes"]:
    if s["id"] in narr:
        s["voiceover"] = re.sub(r"\s*\[beat\]", "", narr[s["id"]]).strip()
    t = T[s["id"]]
    s["t"] = [round(t["start"], 3), round(t["end"], 3)]
    s["sentence_times"] = [[round(x["start"], 3), round(x["end"], 3)] for x in t["sentences"]]
    words += len(s["voiceover"].split())
    cf = U["slice_cf"]["cold_front"]
    if s["id"] == "s47_cold_front":
        s["physics_source"]["params"]["path"] = "46.5N, 18W -> 0E, 0.25-deg steps (crosses the s49 map's cold front at 7.39W, W77)"
        s["physics_source"]["fn"] = (s["physics_source"]["fn"].split(" + fluidpy.diag.fronts")[0]
                                     + " + fluidpy.diag.fronts.front_lines (the front on every level, same method as the s49 map)")
        s["physics_source"]["test"] = s["physics_source"]["test"].replace("CHECK W45, W70, W72, W73", "CHECK W45, W70, W72, W73, W77")
        s["uf1_fix1"] = (f"v4 review 1 M1: the 48.5N slice met a feature at 12.7W (west of the low), not the map's cold front. The cold-front side view "
                         f"is now its own ERA5 slice along 46.5N, 18W-0E (Bay of Biscay), through the analysed cold front (map 7.39W; slice 850 hPa "
                         f"{cf['slice_850_lon']}W, {cf['dist_850_km']} km apart). Front traced on {len(cf['traced'])} levels with front_lines; slope = fit "
                         f"850-650 hPa: 1:{cf['slope_km_per_km']} along the slice (1:{cf['slope_normal_km_per_km']} normal to the front), spoken 'fifty'. "
                         f"The fit line is drawn solid, the lowest kilometre (900-875 hPa, leaning the other way) dashed; the map's cold front is drawn on "
                         f"the 850-hPa map under the slice; Brest is a dot on the map north of the slice.")
    if s["id"] == "s48_warm_front":
        s["uf1_fix1"] = ("the 48.5N slice (through Brest) is used for the warm front only; S1 now says it is a second slice further north; the warm-front "
                         "outline is the straight least-squares fit (no zigzag at the ground); 'true scale' is said in S6 ('eighty times taller') and "
                         "the true-scale twin is labelled 'true slope'.")
sb["measured_narration_s"] = round(tm["total_s"], 3)
sb["measured_frames"] = tm["total_frames"]
sb["target_duration_s"] = round(tm["total_s"] + 2.5, 3)
sb["words"] = words
sb["sentences"] = sum(len(s["sentences"]) for s in tm["scenes"])
sb["qa_expectations"]["duration_s"] = sb["target_duration_s"]
sb["qa_expectations"]["captions"]["cues"] = tm.get("cues") if isinstance(tm.get("cues"), int) else len(tm.get("cues") or [])
sb["uf1_fix1"] = {
    "date": "2026-10-29", "review": "reports/ch00_movies.md 'ch00_weather_basics v4 — review 1'",
    "tts": "4 sentences spliced (s47 S2, S6; s48 S1, S3): tools/movie_wb/splice_uf1fix1.py, BS.1770 loudness match to the neighbours + "
           "look-ahead limiter; G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_weather_basics/v4/uf1fix1/tts",
    "narration_follows_data": [f"s47 S6: 'about one kilometre for every fifty kilometres along' (ERA5 46.5N 850-650 hPa 1:{U['slice_cf']['cold_front']['slope_km_per_km']}, W70)",
                               "s48 S3: 'also about one kilometre up for every fifty kilometres along' (ERA5 48.5N 975-600 hPa 1:52.3, W71)"],
    "fixes": [
        "M1 s47: own ERA5 slice along 46.5N through the map's cold front (W70 slope, W77 crossing); map cold front + crossing ring drawn under the slice",
        "M2 collisions: s18 'scale height' under the fraction, units row lower; s19/s19b ln p inset moved left of the CalcStack (big axes fade while it shows); "
        "s23-s25 temperature charts 580 px tall so 'temperature (°C)' clears the source lines; s27b colour-coded symbol names (no pointer arrows), "
        "smaller boxes, 29 ÷ 18 below them; s36 keyword below the month ticks; s48 wind labels kept off 'Brest'; s53 names in belt order (links never cross)",
        "M3 s46: colour bar at y 150 (title at 116)",
        "M4 globes: the main globe draws into a full-frame canvas with the box's pixel scale (fades over y 850-900), close-ups dist >= 2.9; s25 inset on a "
        "right-half canvas; s01 spin reverses visibly (view lon 0 -> 40W -> 15E), U-WB-03",
        "S1 frame-0 keywords in s14, s18, s19b, s20b, s20c, s20d; S2 s03 full-frame relief, camera el 61-64 deg held on the path's middle (the box crosses the "
        "frame), Brest / Brittany / English Channel labels, soft frame edges, drape upsampled x4; S3 s45 the four names on their words; S4 dark backing band "
        "under every source line; S5 s48 straight warm-front fit line, 'true slope' twin; S6 magnifier x50, no wedge strip; S7 s20c link routed over the "
        "labels, mattresses moved; S8 s13 '1 m²' lifted, s21 orange sonde box; S9 s25 polar key looks across the meridian plane; S10 s38 band clipped "
        "to the disc, s39 'Himalayas' above the source line, s58 CalcStack below the ticks, s20b '2nd km', s18 no placeholder bars"],
}
(D / "storyboard.yaml").write_text(head + yaml.safe_dump(sb, sort_keys=False, allow_unicode=True, width=120), encoding="utf-8")
print("storyboard synced:", sb["target_duration_s"], "s,", words, "words")
