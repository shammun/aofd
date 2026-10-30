"""UF2 fix 1: sync movies/ch00/ch00_weather_basics/storyboard.yaml with the fix-1 TTS (s27c S2/S4, s53 S3-S5 spliced) and record
the fix-1 changes (review 1 M1-M31, S1-S22, user round 3 U3-01…07) in a `uf2_fix1` block; the visual notes of the rebuilt
scenes (s25 tropopause surface, s27c / s38b / s48b outside-only cameras) are updated.
usage: .venv/Scripts/python.exe tools/movie_wb/sync_storyboard_uf2fix1.py"""
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
    "s25_tropics": "UF2 fix 1 (M1 / U3-01): the left sounding chart stays (Paris and Singapore balloons, 1 Nov 2023); the right half shows a flat "
                   "Blue Marble map plate, 10S-80N x 30W-120E, with the November-2023 WMO tropopause height of every ERA5 column as one "
                   "semi-opaque surface above it (heights x330, coloured 8-17 km, colour bar 'tropopause height, Nov 2023 average'); gold rods "
                   "at Paris and Singapore up to the surface, K3 callouts 'Paris ≈ 11.7 km', 'Singapore ≈ 16.6 km, below −75 °C', 'near the "
                   "pole ≈ 10 km' above the picture, each linked to its rod top. Camera outside, south-east side, slow orbit, rising.",
    "s27c_vapour_stack": "UF2 fix 1 (M2, M3 / U3-02, U3-03, U3-07): five layers (1000, 850, 700, 500, 300 hPa), each labelled with its "
                         "height at its left edge (0.1, 1.5, 3.2, 5.9, 9.7 km). The map tilts and lifts, then the camera hovers OUTSIDE (side "
                         "angle, rising); one 4-s side close look on 'almost half' (sea surface and the 850-hPa layer in view, a gold bracket "
                         "at the front edge), back out; callouts and the colour bar in the text column. No fly-through.",
    "s38b_reanalysis_stack": "UF2 fix 1 (M4 / U3-04, U3-07): the 40:36-40:57 build kept; then an outside side view from the east (shells edge-on "
                             "over Africa and Europe), the Europe tropopause outlined in gold and linked to its callout; one 5-s close look at "
                             "the tropical tropopause (ground and levels in view), back out; an outside oblique view with the balloon column "
                             "to the end. Colour bar always beside.",
    "s48b_front_stack": "UF2 fix 1 (M5 / U3-07): every view from outside; S3-S4 an oblique view from the south-east, rising; the 850- and "
                        "650-hPa gold lines labelled with their heights (1.3 km, 3.4 km); keyword and colour bar in the text column.",
}
for s in sb["scenes"]:
    s["voiceover"] = narr[s["id"]]
    t = T[s["id"]]
    s["t"] = [round(t["start"], 3), round(t["end"], 3)]
    s["sentence_times"] = [[round(x["start"], 3), round(x["end"], 3)] for x in t["sentences"]]
    if s["id"] in VIS:
        s["uf2_fix1_visual"] = VIS[s["id"]]
words = sum(len(s["voiceover"].split()) for s in sb["scenes"])
sb["measured_narration_s"] = round(tm["total_s"], 3)
sb["measured_frames"] = tm["total_frames"]
sb["target_duration_s"] = round(tm["total_s"] + 2.5, 3)
sb["words"] = words
sb["sentences"] = sum(len(s["sentences"]) for s in tm["scenes"])
sb["qa_expectations"]["duration_s"] = sb["target_duration_s"]
sb["qa_expectations"]["captions"]["cues"] = tm["cues"] if isinstance(tm.get("cues"), int) else len(tm.get("cues") or [])
sb["uf2_fix1"] = {
    "date": "2026-10-30",
    "narration": ["s27c S2: 'ten heights' -> 'five heights' (U3-02, five layers)",
                  "s27c S4: 'about half' -> 'almost half' (W85 = 0.450, under the orchestrator's 0.46-0.50)",
                  "s53 S3-S5: each hover names its place: 'over the tropical Atlantic', 'over the South Atlantic', 'like here over the North Atlantic' (review S14)"],
    "splice": "tools/movie_wb/splice_uf2fix1.py (BS.1770-4 loudness match to the nearest unchanged neighbours + look-ahead limiter, Whisper-checked)",
    "data": ["trop_surface.json (W94): WMO tropopause of every ERA5 Nov-2023 monthly-mean column, fluidpy.geo.atmos.lapse_rate_tropopause",
             "stack_q: 5 layers (checks and the half-column fraction on all 10 levels)",
             "stack_front: frozen at UF2 b1 (fluidpy.diag.fronts D3 fix not committed at fix-1 time); heights of the labelled lines added"],
    "kit": ["stackCam.flyThrough retired (throws)", "LayerStack3D publishes its projected outline as a K6 mask",
            "K1 right-panel ramp drawn as stepped bands", "BoxProbe: owners, CalcStack underlines, axis lines, 3-D stack masks"],
}
(D / "storyboard.yaml").write_text(head + yaml.safe_dump(sb, sort_keys=False, allow_unicode=True, width=120), encoding="utf-8")
print("storyboard synced:", sb["target_duration_s"], "s,", words, "words,", sb["sentences"], "sentences")
