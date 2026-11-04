"""UF2 fix loop 2: sync movies/ch00/ch00_weather_basics/storyboard.yaml with the fix-2 TTS (s25 S6 new, s38b S4, s48b S3-S4) and add the
new W86 / W94 rows to manifest.json (no data file changes: the numbers are computed here from the committed stack_front.json,
trop_surface.json and soundings.json; movies/data/build_ch00_weather_basics.py carries the same rows for the next rebuild).
usage: .venv/Scripts/python.exe tools/movie_wb/sync_storyboard_uf2fix2.py"""
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
    "s25_tropics": "UF2 fix 2 (R2-M14, M15): chart labels 'Paris balloon, 1 Nov: ≈ 11 km', 'Singapore balloon: ≈ 16 km'; the map is the November-2023 average, "
                   "said in S6 and written on the colour bar; callouts in link order 'Singapore ≈ 16.6 km, below −75 °C', 'near the poles: 8–10 km', 'Paris ≈ 11.7 km' (on S6).",
    "s38b_reanalysis_stack": "UF2 fix 2 (R2-M4, M5, M6): after the 40:43-40:56 build every hold is one oblique view from outside, drifting upward; one close look (5 s); "
                             "Europe's callout dated '2 Nov' (said in S4); 'above ≈ 25 km' with the four warming shells outlined; 'top shell ≈ 45 km' dropped (45 km is spoken and written in S2).",
    "s47_cold_front": "UF2 fix 2 (R2-M1, M9): slice 50 px lower; both legs of the slope triangle 6-px gold, '1 km' and '50 km' on their words, on the legs; 'heights × 80' from S6; the dashed lowest kilometre is no longer drawn.",
    "s48_warm_front": "UF2 fix 2 (R2-M1, M9): as s47; 'heights × 80' from the start; the true-scale twin solid gold, further from the thick line.",
    "s48b_front_stack": "UF2 fix 2 (R2-M2, M3): 'the lower layers'; labels 1.3 and 3.4 km, callout '≈ 92 km back, from 1.3 to 3.4 km up'; the link ends on the gold bar, not on a label; colour bar in °C.",
}
for s in sb["scenes"]:
    s["voiceover"] = narr[s["id"]]
    t = T[s["id"]]
    s["t"] = [round(t["start"], 3), round(t["end"], 3)]
    s["sentence_times"] = [[round(x["start"], 3), round(x["end"], 3)] for x in t["sentences"]]
    if s["id"] in VIS:
        s["uf2_fix2_visual"] = VIS[s["id"]]
words = sum(len(s["voiceover"].split()) for s in sb["scenes"])
sb["measured_narration_s"] = round(tm["total_s"], 3)
sb["measured_frames"] = tm["total_frames"]
sb["target_duration_s"] = round(tm["total_s"] + 2.5, 3)
sb["words"] = words
sb["sentences"] = sum(len(s["sentences"]) for s in tm["scenes"])
sb["qa_expectations"]["duration_s"] = sb["target_duration_s"]
sb["qa_expectations"]["captions"]["cues"] = tm["cues"] if isinstance(tm.get("cues"), int) else len(tm.get("cues") or [])
sb["uf2_fix2"] = {
    "date": "2026-10-30",
    "narration": ["s25 S6 NEW: the map is the whole November's average, 11.7 km at Paris against the one balloon's 11 km (R2-M15)",
                  "s38b S4: 'Over Europe, on that day, …' (R2-M15: 10 km is 2 Nov 2023)",
                  "s48b S3: 'On the lower layers…' (R2-M2)",
                  "s48b S4: 'about ninety-two kilometres back between one point three and three point four kilometres up' (R2-M3)"],
    "splice": "tools/movie_wb/splice_uf2fix2.py (BS.1770-4 loudness match to the nearest unchanged neighbours + look-ahead limiter)",
}
(D / "storyboard.yaml").write_text(head + yaml.safe_dump(sb, sort_keys=False, allow_unicode=True, width=120), encoding="utf-8")
print("storyboard synced:", sb["target_duration_s"], "s,", words, "words,", sb["sentences"], "sentences")

# ---- manifest rows
J = lambda n: json.loads((D / "data" / n).read_text(encoding="utf-8"))  # noqa: E731
F, TR, SD = J("stack_front.json"), J("trop_surface.json"), J("soundings.json")
fit, z850, z650 = F["fit_km_per_km"], F["label_km"]["850"], F["label_km"]["650"]
rows = [
    {"id": "W86", "name": "s48b labels round to 1.3 and 3.4 km (z̄ 850 and 650 hPa)", "value": [round(z850, 1), round(z650, 1)], "ref": [1.3, 3.4], "tol": 1e-9},
    {"id": "W86", "name": "s48b spoken 'about ninety-two kilometres': fit × difference of the two rounded labels", "value": [round(fit * 2.1, 2)], "ref": [92.25], "tol": 0.01},
    {"id": "W86", "name": "s48b recorded, not the spoken figure: fit × unrounded height difference = 94.0 km (2.2 % above the spoken 92; the raw 850-650 line ends are 103 km apart)", "value": [round(fit * (z650 - z850), 2)], "ref": [94.01], "tol": 0.01},
    {"id": "W94", "name": "s25 S6: Paris November-average tropopause says 'eleven point seven'", "value": [round(TR["paris"]["z_km"], 1)], "ref": [11.7], "tol": 1e-9},
    {"id": "W94", "name": "s25 S6: the 1 Nov Trappes balloon says 'eleven'", "value": [round(SD["trappes"]["tropopause"]["z_km"])], "ref": [11], "tol": 1e-9},
]
for r in rows:
    r["pass"] = all(abs(a - b) <= r["tol"] for a, b in zip(r["value"], r["ref"]))
    print(r)
    assert r["pass"], r
mp = D / "manifest.json"
m = json.loads(mp.read_text(encoding="utf-8"))
m["checks"] = [c for c in m["checks"] if c.get("name") not in {r["name"] for r in rows}] + rows
nc = m.setdefault("narration_changes_from_data", [])
for x in ["s48b S4: 'about a hundred kilometres between one and a half and four' -> 'about ninety-two kilometres between one point three and three point four': the labelled 850- and 650-hPa lines, fit 43.93 km/km (4 km lies above the highest traced line)",
          "s48b S3: 'On every layer' -> 'On the lower layers': the front is traced on 1000-650 hPa only",
          "s25 S6 (new): the map is the Nov-2023 average, Paris 11.7 km; the Trappes balloon of 1 Nov 10.9 km",
          "s38b S4: 'on that day' added: about 10 km over Europe is 2 Nov 2023 (45-55N mean: 300 hPa −47 °C at 9.4 km, 250 hPa −52 °C at 10.6 km)"]:
    if x not in nc:
        nc.append(x)
mp.write_text(json.dumps(m, indent=1, ensure_ascii=False), encoding="utf-8")
print("manifest rows", len(m["checks"]))
