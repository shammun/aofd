"""Sync movies/ch00/ch00_weather_basics/storyboard.yaml with the v1 build (motion-builder, 2026-10-27).

* voiceover of every scene = the narration in script.md (the data-driven changes and the new s61 ending);
* t / sentence_times / measured_* from the final timing.json (v1 TTS run);
* per scene: kind (map / globe / 3-D / data animation / diagram), visual_v1_built (what the composition draws now),
  data, tool (choice + runner-up) and why, as the orchestrator asked ("Best tool per visual", "Data and tool together");
* the physics_source notes that changed with the data (00 UTC soundings, 18 UTC fronts, pooled-window climatology).
The header comment block is kept; PyYAML re-flows the rest (same keys and order).
usage: .venv/Scripts/python.exe tools/movie_wb/update_storyboard.py
"""
from __future__ import annotations

import json
import re
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
D = ROOT / "movies" / "ch00" / "ch00_weather_basics"

G = "three.js globe (kit_wb, copied from kit_cp) with an ERA5 field texture + SVG overlays through the same camera"
M2 = "flat plate-carrée SVG map (kit_wb MapBox): GIBS/MODIS true colour under ERA5 isolines, Natural Earth 10 m coast and borders"
SCENES = {
    "s00_title": ("globe + map, data animation", "Part A: GIBS 2 Nov globe with the air shell ×50 and the balloon rising through the real Trappes sounding (height, T, p counting); Part B: 1 Nov true colour with hourly ERA5 isobars 12→03 UTC and Brest's pressure ticking",
                  "GIBS VIIRS/MODIS 2023-11-02 mosaic; IGRA2 Trappes 00 UTC 1 Nov; ERA5 hourly MSLP (A1)", f"{G}; Part B {M2}", "real Earth and real numbers from the first frame; runner-up: d3-geo orthographic SVG globe (no image drape)"),
    "s01_hook": ("globe", "true-colour globe turning to the North Atlantic, Ciarán ringed on 'real storm', four keyword icons", "GIBS 2023-11-02", G, "the hook shows the real storm; runner-up: Blue Marble (cloud-free, no storm)"),
    "s02_thin_shell": ("globe", "true-colour globe with the air shell at true scale (hair line), then ×50 on 'fifty times thicker'; 12 km / 6371 km labels; 0.3 mm calc", "GIBS 2023-11-02; EARTH_RADIUS", G, "the shell must sit on the real Earth; runner-up: SVG circle diagram"),
    "s03_air_parcel": ("globe + diagram", "globe turns to Europe with the ×50 shell; composition bar; molecule box (illustrative); an air parcel drifts over the Atlantic towards Europe", "USSA-1976 composition; GIBS", f"{G}; SVG bar", "composition is a bar (one number each); the parcel is shown on the real map"),
    "s04_pressure_what": ("diagram", "molecule box with wall hits merging into a force arrow; isometric cube with six equal arrows", "none (definition)", "SVG", "the idea is a shape (a wall, a cube); no map carries it"),
    "s05_weight_column": ("diagram", "column on 1 m² fading upward, weight arrow, CalcStack, seven cars", "p0, g (CHECK W06)", "SVG", "a column is a shape; runner-up: 3-D column on the France map (kept for s21)"),
    "s06_not_crushed": ("diagram", "person with balanced arrows; lift with ear pop", "none", "SVG", "illustrative"),
    "s07_hpa": ("diagram + data animation", "barometer dial; on 'a few percent' the needle follows the real hourly Brest MSLP of 1-2 Nov 2023", "ERA5 Brest point (A1)", "SVG", "a real pressure trace makes 'a few percent' concrete"),
    "s08_density": ("diagram", "isometric room 5 × 4 × 2.5 m filling with air, person, CalcStack", "CHECK W08", "SVG", "shape idea"),
    "s09_temperature": ("diagram", "slow/fast molecule boxes; °C and K scales linked", "CHECK W09", "SVG", "unit idea"),
    "s10_gas_law": ("diagram", "two contrast pairs (more molecules / faster molecules); layered p = ρRT with underbraces", "CHECK W10", "SVG + KaTeX", "the law is built from molecules"),
    "s11_gas_law_numbers": ("diagram", "1 m³ cube at 1013 hPa, 15 °C filling to 1.225 kg; CalcStack", "CHECK W11", "SVG + KaTeX", "worked number"),
    "s12_warm_air_light": ("diagram", "two cubes 0 °C / 30 °C with dot density ∝ ρ, hot-air balloon", "CHECK W12", "SVG", "contrast case"),
    "s13_slab": ("diagram", "column with a slab, z axis, Δz bracket, three forces", "none", "SVG", "derivation shape"),
    "s14_slab_weight": ("diagram", "volume → mass → weight; layered balance with underbraces; band = weight", "none (sympy W13)", "SVG + KaTeX", "derivation"),
    "s15_hydrostatic": ("diagram", "slab thins (Δz → 0), CalcStack to ∂p/∂z = −ρg with underbraces", "sympy W13", "SVG + KaTeX", "derivation"),
    "s16_hydrostatic_numbers": ("diagram + counting", "300-m tower with a lift; readout 1013 → 977 hPa counting; CalcStack", "CHECK W14-W16", "SVG", "worked number"),
    "s17_combine": ("chart", "the isothermal p(z) curve with tangents (fast near the ground, slow aloft); ρ replaced by p/RT", "isothermal_pressure", "SVG chart", "the slope picture is the message"),
    "s18_scale_height": ("chart + diagram", "H = RT/g, units cancelled, 8.4 km; real-fading vs uniform column", "scale_height", "SVG + KaTeX", "derivation"),
    "s19_exponential": ("chart, data animation", "CalcStack one move per line; the curve p0 e^{-z/H} draws upward", "isothermal_pressure 0-50 km", "SVG chart", "curve drawing on 'p equals'"),
    "s20_exponential_meaning": ("chart", "÷ e steps, −11 % per km, mattresses like/unlike, halving marks", "W18-W20", "SVG chart", "reading the curve"),
    "s21_balloon_pressure": ('3-D map + data animation', '3-D tilted map of western Europe (1 Nov true colour) with the Trappes column lifted out (heights ×10, said in the new S5); the balloon rises through the real IGRA sounding with height and pressure counting; then p(z) points vs the curve', 'IGRA2 Trappes 00 UTC 1 Nov 2023 (z_hyps); GIBS MODIS 1 Nov', 'three.js MapPlane + Rod3D (kit_wb) + SVG billboards; runner-up CesiumJS (no Ion) imagery drape, tried (tools/movie_wb/cesium_shots.py trappes)', 'Cesium trial: the oblique true colour is mostly cloud and the thin column reads worse; the three.js plate keeps the balloon and readouts legible (capability test X2/C1)'),
    "s22_mass_below": ("diagram → globe", "column filling to 50 / 90 / 99 %; then the ×50 shell globe", "USSA-1976 (W22)", "SVG + globe", "fractions on a column; the globe recalls 'thin shell'"),
    "s23_troposphere": ("chart, data animation", "the real Trappes T(z) draws upward with the balloon; lapse triangle; troposphere band", "IGRA2 Trappes (lapse fit 6.68 K/km)", "SVG chart", "a sounding is a profile: a chart is clearest"),
    "s24_stratosphere": ("chart, data animation", "WMO tropopause (10.9 km, −62.7 °C); stratosphere; burst at 33.9 km; ERA5 column continues to 46 km (dashed)", "IGRA2 + ERA5 column over Trappes 00 UTC", "SVG chart", "data first; runner-up: 3-D column (less readable)"),
    "s25_tropics": ("chart + 3-D globe section", "Singapore sounding on the same axes; inset: the November 2023 ERA5 zonal-mean temperature as a cross-section standing on the globe's limb (heights ×50), tropopause line 16 → 8 km", "IGRA2 Singapore 00 UTC; ERA5 Nov 2023 zonal means", f"{G} + a custom fan mesh", "the tropopause depth is a pole-to-equator idea: the globe section shows it; runner-up: flat lat-height section"),
    "s26_why_cold_aloft": ("diagram", "sun rays heat the ground; a parcel rises, grows and cools", "adiabatic_lapse_rate", "SVG", "process idea"),
    "s27_vapour": ("globe, data", "ERA5 2-m specific humidity (cmocean haline 0-20 g/kg) over the true-colour globe, camera Arctic → tropical Atlantic", "ERA5 2023-11-02T12 (q from d2m, sp)", G, "global contrast needs the globe; runner-up: flat map"),
    "s28_saturation": ("diagram → chart", "water surface exchange (illustrative) → e_s curve with 6/12/23/42 hPa", "moist.saturation_vapour_pressure", "SVG chart", "a curve is the message"),
    "s29_relative_humidity": ("chart, data animation", "our air on the curve, RH 48 %, cooling slide with RH counting", "moist.relative_humidity", "SVG chart", "same chart persists"),
    "s30_dew_point": ("chart", "slide to the dew point 13 °C; dew, fog, cloud icons", "moist.dew_point", "SVG chart", "same chart"),
    "s31_cloud_base": ("chart + real image", "T and dew-point lines meeting at 1.5 km; side view of rising parcels; then the real MODIS 250 m cumulus field (24 Jun 2024, northern France)", "moist.lifting_condensation_level; GIBS MODIS Aqua 250 m; ERA5 LCL median 1.41 km", "SVG chart + image", "the real flat-based field; runner-up: 3-D tilted image with a cloud-base plane (needs an unsaid vertical exaggeration)"),
    "s32_wind_vector": ("map + data", "Brittany true colour with the real 10-m wind arrows (ERA5 12 UTC 1 Nov), then the (8, 6) vector and components", "ERA5 hourly (A1); MODIS 1 Nov", M2, "wind as real arrows on a real map before the abstract vector"),
    "s33_wind_direction": ("diagram", "compass dial, westerly, 233° arc, ocean-current contrast", "W33", "SVG", "a convention: a dial is clearest"),
    "s34_wind_units": ("globe + diagram", "globe meridian with a 1° arc split into 60 nautical miles; CalcStack", "W34", G, "the nautical mile is a piece of the Earth"),
    "s35_why_wind": ("diagram → map, data animation", "two dials and a push; then the real ERA5 10-m streaklines circling Ciarán on the MODIS image", "ERA5 2 Nov 12 UTC (A2) streaklines (advect_on_sphere)", M2, "'turned aside' shown on the real storm"),
    "s36_weather_climate": ('relief locator → chart, data animation', 'Brittany relief locator (ETOPO hillshade, Brest, scale bar), then the 1991-2020 band and mean draw themselves and 2023 is traced day by day', 'ETOPO 2022 60″ Brittany; ERA5 Brest daily 1991-2023; daily_climatology (pooled ±7 d)', 'cartopy + MetPy + cartostyle movie preset (tools/movie_wb/make_maps.py), layered PNGs built up in Remotion for the locator; Remotion SVG chart (runner-up matplotlib frames)', 'capability tests S3 (relief/locator) and S5/A6 (chart from values)'),
    "s37_observations": ("globe, data", "turning true-colour globe with the 941 IGRA stations active in 2023", "IGRA2 station list 2023", G, "unevenness is geographic"),
    "s38_reanalysis": ("globe, data animation", "stations → graticule → ERA5 2-m temperature fills the globe; sparse Southern Ocean dimmed", "ERA5 2023-11-02T12 t2m", G, "shows 'filling the gaps' on the real Earth"),
    "s39_surface_pressure": ('globe + 3-D relief', 'ERA5 surface pressure on the globe, camera to Tibet; close-up: Tibet in 3-D, ETOPO 2022 4′ heights ×30 (said in the new S4) under the Blue Marble, camera gliding north; billboard labels', 'ERA5 sp 2023-11-02T12; ETOPO 2022 60″ Tibet subset (4′ means); Blue Marble NG', 'CesiumJS (no Ion) CustomHeightmapTerrainProvider + SingleTile imagery, frames rendered headless (tools/movie_wb/cesium_shots.py tibet), labels from Cesium SceneTransforms; runner-up three.js Terrain (kit_wb, kept in code)', "side-by-side: Cesium's terrain shading and imagery drape are crisper and read as real mountains; 0.25 s/frame on the RTX, deterministic (captests C1)"),
    "s40_sea_level": ("diagram", "mountain station 1609 m, imaginary column, layered equation, CalcStack", "W38", "SVG + KaTeX", "thought example"),
    "s41_msl_isobars": ("globe, data animation", "ERA5 MSLP (cmocean balance centred 1013) with isobars drawing outward every 4 hPa; camera to the crowded isobars", "ERA5 2023-11-02T12 msl", G, "the global map with isolines on the globe"),
    "s42_highs_lows": ('globe, data + latest map', 'H/L at the ERA5 Azores high and Ciarán low; then (new S4-S5) the GFS analysis of 27 Oct 2026 on the same globe, flight to the western-Pacific typhoon and back to the North Atlantic low', 'ERA5 2023-11-02T12 msl; GFS 0.25° analysis 2026-10-27T00 (1° view)', 'three.js globe (kit_wb, copied from kit_cp) with an ERA5 field texture + SVG billboards through the same camera (labels faded at the limb)', "today's map vs Ciarán (user's latest-data rule); globe because the two lows are half a world apart"),
    "s43_lows_cloudy": ('satellite + analysis map', "MODIS 2 Nov true colour with ERA5 isobars (white, dark halo), H/L and Brest; Ken Burns from the low's spiral to the clear high; side-view arrows", 'GIBS MODIS Aqua 2023-11-02; ERA5 12 UTC msl', 'cartopy + MetPy + cartostyle movie preset (tools/movie_wb/make_maps.py), layered PNGs built up in Remotion; runner-up GIBS + d3/SVG overlay (v1 draft)', "capability test S2 winner: isobars over the spiral make 'the low is the storm' obvious; conformal projection, audited labels"),
    "s44_round_lows": ("map, data animation", "ERA5 10-m arrows + animated streaklines; anticlockwise/clockwise arcs; SH globe thumbnail", "ERA5 12 UTC (A2); storm_relative_wind (W42)", f"{M2}; small globe", "the real swirl"),
    "s45_air_masses": ('globe → synoptic map', "ERA5 2-m temperature globe while the air masses are named, then the 850-hPa temperature chart at 18 UTC 1 Nov with 'tropical maritime' / 'polar maritime' labels", 'ERA5 2-m T 2023-11-02T12; ERA5 850 hPa 2023-11-01T18', 'three.js globe (kit_wb, copied from kit_cp) with an ERA5 field texture + SVG billboards through the same camera (labels faded at the limb); cartopy + MetPy + cartostyle movie preset (tools/movie_wb/make_maps.py), layered PNGs built up in Remotion', 'capability test S1 winner for charts'),
    "s46_fronts": ('synoptic map + chart', 'the 850-hPa chart with the gold transect across the cold front and the T850 step (width ≈ 100 km) drawn beside it', "front_lines(locate='centre'); ERA5 850 hPa", 'cartopy + MetPy + cartostyle movie preset (tools/movie_wb/make_maps.py), layered PNGs built up in Remotion + Remotion SVG chart', 'runner-up: a 3-D wall lifted out of the map (one level only, not built)'),
    "s47_cold_front": ("diagram", "side view, cold wedge ×50 (said in s48), cumulonimbus and showers", "none (typical slopes)", "SVG", "shape idea"),
    "s48_warm_front": ("diagram", "side view, warm air gliding up, layered cloud and rain, '× 50 taller'", "none", "SVG", "shape idea"),
    "s49_real_fronts": ('synoptic map, layer build', '850-hPa temperature chart, 18 UTC 1 Nov: the fronts drawn as gold lines on their words, then the 850-hPa wind arrows', 'ERA5 850 hPa; front_lines', 'cartopy + MetPy + cartostyle movie preset (tools/movie_wb/make_maps.py), layered PNGs built up in Remotion', 'capability test S1: the layer build teaches best'),
    "s50_front_symbols": ('synoptic map', 'the gold lines become WMO/NWS symbols (MetPy path effects, side from the 850-hPa temperature)', 'front_lines 18 UTC', 'cartopy + MetPy + cartostyle movie preset (tools/movie_wb/make_maps.py), layered PNGs built up in Remotion', 'standard chart symbols, colour-blind safe by shape'),
    "s51_heating": ("globe + data", "Blue Marble globe with two equal beams at 0° and 60°N (1 m vs 2 m); then NCEP 1991-2020 mean 2-m temperature and poleward arrows", "NCEP R1 LTM t2m", G, "geometry on the real globe"),
    "s52_pressure_belts": ("globe, data", "NCEP 1991-2020 mean MSLP with isobars, the five subtropical highs found in the data, 30° circles, the ITCZ trough band", "NCEP R1 LTM mslp (W48)", G, "belts are global"),
    "s53_trades_westerlies": ("globe, data animation", "streaklines on the 1991-2020 mean 10-m wind; Ciarán's track west → east", "NCEP R1 LTM u10, v10; advect_on_sphere; ERA5 track", G, "real mean winds moving"),
    "s54_ciaran_intro": ('globe flight → map', 'flight from space to western Europe with the hourly ERA5 isobars sweeping on the globe (12 → 18 UTC), Brest billboard, then the 1 Nov true colour', 'ERA5 hourly msl (A1); GIBS', 'three.js globe (kit_wb, copied from kit_cp) with an ERA5 field texture + SVG billboards through the same camera (labels faded at the limb) (captests F1 flight pattern); flat plate-carrée SVG map (kit_wb MapBox), the data-driven d3-style animated map (capability test A1 winner)', 'space → town in one move; runner-up CesiumJS drape (not tried for this shot)'),
    "s55_ciaran_maps": ("map, data animation", "hourly loop 12 UTC 1 Nov → 12 UTC 2 Nov: ERA5 isobars, the objective fronts each hour, 10-m wind arrows, the low and its track, clock", "ERA5 hourly msl/u10/v10 (A1), 850 hPa (fronts)", M2, "the storm moving with the clock"),
    "s56_brest_pressure": ("map + chart, data animation", "the hourly map at the graph's hour beside the Brest MSLP graph drawing itself", "ERA5 Brest point (W50)", f"{M2} + SVG chart", "map and trace share one clock"),
    "s57_brest_warm_front": ("map + chart", "temperature panel, the Brest wind arrow on the map (18 → 20 UTC), warm-front band", "ERA5 Brest point (W51)", f"{M2} + SVG chart", ""),
    "s58_brest_cold_front": ("map + chart", "00 → 03 UTC: wind swing, 45 kt calc, −2 °C, cold-front band", "ERA5 Brest point (W52)", f"{M2} + SVG chart", ""),
    "s59_ciaran_after": ('satellite + analysis map', 'the S2-style MODIS + isobars map with a slow zoom on the spiral', 'GIBS MODIS Aqua 2023-11-02; ERA5 12 UTC', 'cartopy + MetPy + cartostyle movie preset (tools/movie_wb/make_maps.py), layered PNGs built up in Remotion', 'capability test S2'),
    "s60_recap": ("mixed", "one beat per sentence with the scenes' own pictures", "as the scenes", "as the scenes", ""),
    "s61_end": ("end card", "house ending for weather movies (HOUSE_STYLE §3, 2026-10-27)", "none", "SVG", ""),
}


def main() -> int:
    sb_path = D / "storyboard.yaml"
    raw = sb_path.read_text(encoding="utf-8")
    header = "".join(l + "\n" for l in raw.splitlines() if l.startswith("#"))
    sb = yaml.safe_load(raw)
    t = json.loads((D / "timing.json").read_text(encoding="utf-8"))
    script = (D / "script.md").read_text(encoding="utf-8")
    vo = {}
    for blk in re.split(r"^## ", script, flags=re.M)[1:]:
        lines = blk.splitlines()
        sid = lines[0].strip()
        vo[sid] = " ".join(l.strip() for l in lines[1:] if l.strip() and not l.startswith(">") and not l.startswith("#"))
    tm = {s["id"]: s for s in t["scenes"]}
    for s in sb["scenes"]:
        sid = s["id"]
        s["voiceover"] = vo[sid]
        ts = tm[sid]
        s["t"] = [round(ts["sentences"][0]["start"], 3), round(ts["end"], 3)]
        s["sentence_times"] = [[round(x["start"], 3), round(x["end"], 3)] for x in ts["sentences"]]
        kind, built, data, tool, why = SCENES[sid]
        s["kind"] = kind
        s["visual_v1_built"] = built
        s["data"] = data
        s["tool"] = tool
        s["why"] = why
    S = {s["id"]: s for s in sb["scenes"]}
    S["s21_balloon_pressure"]["physics_source"]["params"]["time"] = "2023-11-01T00 UTC (IGRA has no 12 UTC Trappes launch; data_needs §E)"
    S["s23_troposphere"]["physics_source"]["params"]["profile"] = "Trappes 2023-11-01T00 (lapse fit 0-10 km = 6.68 K/km)"
    S["s24_stratosphere"]["physics_source"]["params"]["era5"] = "temperature, geopotential, 37 levels, 2023-11-01T00, 48.75N 2.0E"
    S["s24_stratosphere"]["physics_source"]["test"] = ("CHECK W24 (10.88 km, −62.70 °C on z_hyps; range −65…−50 °C, follows the data; spoken 'about minus sixty-three'); "
                                                     "CHECK W25 (ERA5 column warms to its 1-hPa top at 46 km; USSA-1976 stratopause 47.5-51.25 km)")
    S["s25_tropics"]["physics_source"]["params"]["station"] = "SNM00048698 Singapore, 2023-11-01T00 UTC (16.16 km, −81.3 °C)"
    S["s36_weather_climate"]["physics_source"]["params"]["method"] = "pooled-window percentiles ±7 calendar days (fluidpy 0a6f0da); 2023 share 287/365 = 0.786, base 0.804"
    S["s46_fronts"]["physics_source"]["params"] = {"time": "2023-11-01T18", "level": 850, "locate": "centre"}
    S["s49_real_fronts"]["physics_source"]["params"] = {"field": "T850 2023-11-01T18 smoothed 100 km", "locate": "centre", "threshold": "1.5e-5 K/m (library default)"}
    S["s50_front_symbols"]["physics_source"]["data"] = "data/fronts.json (18 and 21 UTC lines; hourly lines for s55)"
    total = t["total_frames"] / t["fps"]
    sb["measured_narration_s"] = round(total, 3)
    sb["measured_frames"] = t["total_frames"] + 75
    sb["target_duration_s"] = round(total + 2.5, 3)
    sb["sentences"] = sum(len(x["sentences"]) for x in t["scenes"])
    sb["words"] = sum(len(y["text"].split()) for x in t["scenes"] for y in x["sentences"])
    sb["tts_v1"] = {"run": "G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_weather_basics/v2 (v1 TTS + stage-2 splice of s21, s39, s42)", "audio_s": round(total, 3),
                    "cues": t.get("cues"), "warnings": t.get("warnings", []), "self_check": t.get("self_check"),
                    "lexicon": "movies/lexicon.yaml with the ch00_weather_basics IPA entries (ERA5, Azores, Trappes, hectopascal(s), radiosonde)"}
    sb["qa_expectations"]["duration_s"] = round(total + 2.5, 3)
    sb["qa_expectations"]["size"] = {"budget_mb": 120, "hard_mb": 160}
    sb["qa_expectations"]["captions"]["cues"] = sb["tts_v1"]["cues"]
    sb["sound"] = {"cue_sheet": "movies/ch00/ch00_weather_basics/sound_cues.yaml", "music_styles": ["air-flowing", "storm-tense (s54-s59)"]}
    out = header + yaml.safe_dump(sb, sort_keys=False, allow_unicode=True, width=120)
    sb_path.write_text(out, encoding="utf-8")
    print(f"storyboard updated: {len(sb['scenes'])} scenes, {sb['sentences']} sentences, {sb['words']} words, {total:.2f} s")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
