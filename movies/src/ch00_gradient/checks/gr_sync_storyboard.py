"""Build-1 storyboard sync for ch00_gradient (#6): after the final TTS run, write the measured times into storyboard.yaml (every `t`,
`sentence_times`, the voiceovers of the changed scenes), insert the s33b front-stack scene (data_needs §G, orchestrator decision
2026-10-30), set version 4 and the `build_1` record, and add the build-1 line to script.md's header (done by hand before the TTS).
Header comments of the storyboard are kept (the weather-basics sync-script pattern).

usage (repo root): .venv/Scripts/python.exe movies/src/ch00_gradient/checks/gr_sync_storyboard.py
"""
from __future__ import annotations

import json
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[4]
D = ROOT / "movies" / "ch00" / "ch00_gradient"
HOLD_S = 2.5

S33B = {
    "id": "s33b_front_stack",
    "beat": "application: a front in 3-D (layer stack, HOUSE_STYLE §5b; added in build 1 from data_needs.md §G)",
    "visual": ("LayerStack3D of four ERA5 layers (850, 700, 500, 300 hPa; 1000 hPa is below ground on the front and is not shown) over "
               "30-50 N, 110-82 W at 12 UTC 22 Dec 2022 (Winter Storm Elliott's Arctic front): each layer |grad T| (cmocean amp, 0-8 K per "
               "100 km, 100-km smoothing) with 4-K isotherms and orange grad-T arrows; gold rods mark each layer's |grad T| maximum on the "
               "three cross-front lines (39, 40, 41 N) and, from S5, the 850 hPa front copied onto the upper layers (dashed gold), so the "
               "260-450 km offset to the cold side is visible. Camera: side view from outside, then one slow orbit from the bottom layer "
               "to the top (S4-S6); never inside the stack. Colour bar and the level list in the text column on the K1 right panel."),
    "voiceover": "",
    "on_screen_eq": None,
    "physics_source": {"fn": "fluidpy.data.movie_gradient.front_tilt (seed level 850 hPa, lon window 104-80 W); fluidpy.diag.fronts.front_fields per level",
                       "params": {"time": "2022-12-22T12", "levels": [850, 700, 500, 300], "smooth_km": 100, "seed_lats": [39, 40, 41]},
                       "test": "../Fluid Dynamics/tests/data/test_movie_gradient.py (front_tilt V1); tests/diag/test_fronts.py; CHECK DG33b (build 1)"},
    "exaggeration": ["layer separation ×1.15 per km of height (heights labelled in the text column)", "arrow lengths for legibility (no scale drawn)"],
    "kind": "3-D layer stack",
    "data": "D8 ERA5-ARCO-front-20221222-pl5 (data/derived/ch00/era5_front_elliott_2022-12-22T12_pl5.nc)",
    "tool": "@remotion/three + house LayerStack3D (K5)",
    "runner_up": "the Feb 2021 Arctic front (rejected by the data scout: no upper front)",
    "why": "a front is a sloping surface: the gradient finds it on every layer, leaning back over the cold air",
    "related": [{"movie": "M04", "slug": "planned (air masses and fronts)", "covers": "fronts in full"}],
    "layout_5b": ("Stack on the left (house K1 right panel from x 980, text on the faded part only); colour bar '|grad T| per 100 km' beside it "
                  "in the column; level list '850 hPa ≈ 1.5 km' … '300 hPa ≈ 9 km'; 'cold side, 260–450 km back'; place label "
                  "'central United States' on the bottom layer within 1 s of its words; source line 'Data: ERA5 (Copernicus C3S) · "
                  "22 Dec 2022, 12 UTC' below. Strictly no fly-through (HOUSE_STYLE §5b)."),
}


def main() -> None:
    sbp, tp = D / "storyboard.yaml", D / "timing.json"
    raw = sbp.read_text(encoding="utf-8")
    header = "\n".join(ln for ln in raw.splitlines()[:20] if ln.startswith("#")) + "\n"
    header += ("# Build 1 (2026-11-04, motion-builder): version 4 — s33b_front_stack inserted (data_needs §G decision), s29 S6 dropped (unverified),\n"
               "# s36 → Sep 2026 real zonal-mean wind (D6), s37 S3 measured numbers (D7), s18 S4 sign corrected; times from the build-1 TTS run.\n")
    sb = yaml.safe_load(raw)
    T = json.loads(tp.read_text(encoding="utf-8"))
    tsc = {s["id"]: s for s in T["scenes"]}
    ids = [s["id"] for s in sb["scenes"]]
    if "s33b_front_stack" not in ids:
        sb["scenes"].insert(ids.index("s33_fronts") + 1, dict(S33B))
    words = sents = 0
    for sc in sb["scenes"]:
        ts = tsc[sc["id"]]
        sc["t"] = [round(ts["start"], 3), round(ts["end"], 3)]
        sc["sentence_times"] = [[round(x["start"], 3), round(x["end"], 3)] for x in ts["sentences"]]
        sc["voiceover"] = " ".join(x["text"] for x in ts["sentences"])
        words += len(sc["voiceover"].split())
        sents += len(ts["sentences"])
    missing = set(tsc) - {s["id"] for s in sb["scenes"]}
    if missing:
        raise SystemExit(f"timing scenes without a storyboard entry: {missing}")
    sb["version"] = 4
    sb["measured_narration_s"] = T["total_s"]
    sb["measured_frames"] = T["total_frames"] + round(HOLD_S * 30)
    sb["target_duration_s"] = round(T["total_s"] + HOLD_S, 3)
    sb["words"], sb["sentences"] = words, sents
    sb["audio"]["music"]["used_build_1"] = "sun-radiant seed 31 (the storyboard's runner-up; steepest-ascent is not in tools/sound/styles.py)"
    sb["build_1"] = {
        "date": "2026-11-04", "by": "motion-builder", "log": "movies/ch00/ch00_gradient/build1_log.md",
        "tts": {"tool": "tools/tts.py af_bella x1.0", "run": "G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_gradient/build1/tts2",
                "scenes": len(T["scenes"]), "sentences": sents, "words": words, "narration_s": T["total_s"], "cues": T["cues"],
                "self_check": T["self_check"]},
        "script_changes": [
            "s29 S6 'At the Pointe du Raz … two hundred and seven kilometres per hour' dropped (unverified; orchestrator note 2026-10-28)",
            "s33b_front_stack added (data_needs §G; orchestrator 2026-10-30: keep Elliott 12 UTC, reword to 'every layer above sits on the cold side, 260-450 km back')",
            "s36 moved to September 2026 real zonal-mean u (D6 decision): 45 N, about six K per 1000 km, about twelve km, about twenty six m/s",
            "s37 S3 states the measured OISST north-wall drop: about six and a half degrees in about thirty five km (29 Oct 2026)",
            "s18 S4 sign corrected: grad T points almost straight DOWN, towards the warmer air below (dT/dz < 0)"],
        "data_decisions": ["Brest msl numbers at the ERA5 grid point 48.5 N 4.5 W (the planning values); the ISD gust stays the airport",
                           "s15 arrows and 'about sixty percent' on the ETOPO 60″ grid; the drape geometry is ETOPO 15″ (×2)",
                           "s35 image: a new GIBS MODIS Aqua crop of the Normandy coast (48.9-50.1 N, 1.6 W-1.6 E) via fluidpy.data.gibs.fetch_wms"],
    }
    body = yaml.safe_dump(sb, sort_keys=False, allow_unicode=True, width=150)
    sbp.write_text(header + body, encoding="utf-8")
    print(f"storyboard v4: {len(sb['scenes'])} scenes, {sents} sentences, {words} words, narration {T['total_s']} s")


if __name__ == "__main__":
    main()
