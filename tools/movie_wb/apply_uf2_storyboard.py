"""UF2 (user feedback round 2): storyboard.yaml -> version 5 (uf2_plan.md §10 step 2, orchestrator decisions 2026-10-29).
* drop s20c; insert s20e, s20f, s20g (after s20), s27c (after s27b), s38b (after s38), s48b (after s48);
* voiceover = script.md for every scene (narration follows the data: script.md UF2 change log);
* new source lines (s22 IGRA, s31 Sentinel-2 + MODIS, the three stacks), on_screen_eq / physics_source / exaggeration for
  the new scenes, a 'UF2:' paragraph on every changed visual, honesty notes, version / revision.
Times (t, sentence_times, measured_*) are filled by sync_storyboard_uf2.py after the final TTS. Idempotent.
usage: .venv/Scripts/python.exe tools/movie_wb/apply_uf2_storyboard.py"""
import re
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
D = ROOT / "movies/ch00/ch00_weather_basics"
raw = (D / "storyboard.yaml").read_text(encoding="utf-8")
head = "".join(l + "\n" for l in raw.splitlines() if l.startswith("#"))
sb = yaml.safe_load(raw)
if sb.get("version") == 5:
    print("already version 5"); raise SystemExit(0)
script = (D / "script.md").read_text(encoding="utf-8")
narr = {m.group(1): re.sub(r"\s*\[beat\]", "", m.group(2).strip()) for m in re.finditer(r"^## (\S+)\n(.*?)(?=\n\n|\Z)", script, re.S | re.M)}
P = "chapters/pages/ch01/"
NEW = {
    "s20e_tangent": dict(after="s20_exponential_meaning", beat="intuition · H from the tangent at the ground", kind="chart",
        visual="UF2 (U2-09, U2-15): same p(z) axes as s20 (height 0-18 km up, pressure across). S1 gold ring at the ground point; S2 CalcStack 'fall per metre at the ground = p0/H' then '101 325 Pa / 8430 m ≈ 12 Pa/m' [beat]; S3 'same as hydrostatic balance' (rho g ≈ 12 Pa/m); S5 the gold dashed tangent p0(1 − z/H) grows from the ground to (0, 8.43 km); S6 'tangent' with a gold pointer to the touching point; S7 'p0 − (p0/H) z = 0 at z = H', tick 'H = 8.43 km'; S8 three slate fall-per-metre arrows (∝ p/H) shrink upward; S9 a faint gold band between line and curve, 'falls more slowly higher up'; S10 at z = H: '0' on the line, '37 %' on the curve, gold bracket.",
        eq=r"\dfrac{101\,325\ \mathrm{Pa}}{8430\ \mathrm{m}} \approx 12\ \mathrm{Pa/m}", veq="our step from (1.51), (1.53) and the text after (1.186)", page="p062.png",
        ps={"fn": "fluidpy.geo.atmos.scale_height + fluidpy.core.thermo.perfect_gas_density", "params": {"T": 288.15, "p0": 101325}, "test": "CHECK W78, W79"}),
    "s20f_not_a_lid": dict(after="s20e_tangent", beat="intuition · H is a scale, not a lid", kind="chart + 3-D columns",
        visual="UF2 (U2-10): S1-S4 the height axis rescales to 0-40 km; the curve thins towards p = 0 and never reaches it; the area left of the curve above H shaded teal-light 25 % '37 % of the air: still above H'; gold dashed line at H 'H: a scale, not a lid'. S5 marker at 5 km, bracket 5 → 13.43 km '× 0.37', 'from any height'. S6-S7 two 3-D columns (−10 °C slate, 30 °C orange) fading with their own e-folding, edges to the top, ticks 7.7 km and 8.9 km; 'warmer → bigger H' and H = RT/g with T pulsing; S7 teal fill below each H.",
        eq=r"H = \dfrac{R\,T}{g}", veq="text after (1.186)", page="p062.png",
        ps={"fn": "fluidpy.core.statics.isothermal_pressure + fluidpy.geo.atmos.scale_height", "params": {"T": [263.15, 288.15, 303.15]}, "test": "CHECK W80"}),
    "s20g_uniform_block": dict(after="s20f_not_a_lid", beat="intuition · the uniform-density block (thought experiment)", kind="3-D",
        visual="UF2 (U2-13): two 3-D boxes on 1 m² bases: left 'real column' fading with height, edges to the top, no top; right 'pretend block', uniform sky-blue 55 %, the ONLY box with a sharp top (8.43 km), because it is pretend (said). Height axis 0-12 km. S2 '1 m² × 101 325 Pa = 101 325 N'; S4 'pretend: same density everywhere', rho0 = 1.225 kg/m³; S5 the block grows brick by brick ('like identical bricks' inset); S6 1.225 × 9.81 ≈ 12 N [beat]; S8 rho0 g h = p0 ⇒ h = p0/(rho0 g); S9 ≈ 8.43 km [beat]; S10 = RT/g = H (rho0 struck); S11 small p(z) inset: the block's straight line = the gold tangent; S12 'H = height at sea-level density'; S13 block fades, 'real air: no single density, no top'.",
        eq=r"h = \dfrac{p_0}{\rho_0\, g} = \dfrac{101\,325}{1.225 \times 9.81} \approx 8.43\ \mathrm{km}", veq="our step from (1.51) with uniform density", page="p032.png",
        ps={"fn": "fluidpy.core.thermo.perfect_gas_density (rho0) + sympy identities", "params": {"p0": 101325, "rho0": 1.225, "g": 9.81}, "test": "CHECK W81"},
        exag=["the uniform block is a thought experiment with a sharp top only because it is pretend (said)"]),
    "s27c_vapour_stack": dict(after="s27b_vapour_pressure", beat="data · where the vapour is (layer stack B)", kind="3-D layer stack",
        visual="UF2 (G6, stack B): K5 LayerStack3D of ERA5 specific humidity at 10 levels (1000-300 hPa), 2 Nov 2023 12 UTC, tropical Atlantic (0-24N, 34W-2E), heights ×150, LUT_HALINE 0-20 g/kg with alpha 0.30 + 0.70 q/20; colour bar 'specific humidity (g/kg)' in the maths zone. Camera: topDown → orbit (layers rise on 'ten heights') → flyThrough upward → below (look up) → inside down to the sea. Callouts '≈ 20 g/kg', '3 km: a few g/kg', '10 km: almost none', 'half the vapour below 1.5 km' with gold links. K1 frame; K2 source.",
        ps={"fn": "fluidpy.diag.sounding.column_integral + movies/data/_stack.py", "params": {"levels_hPa": [1000, 950, 900, 850, 800, 700, 600, 500, 400, 300]}, "test": "CHECK W85"},
        exag=["humidity stack heights ×150"], src="Data: ERA5 specific humidity on pressure levels (Copernicus C3S) · 2 Nov 2023, 12 UTC · tropical Atlantic"),
    "s38b_reanalysis_stack": dict(after="s38_reanalysis", beat="data · the reanalysis in layers (stack A, equator to pole)", kind="3-D curved shells",
        visual="UF2 (G6, stack A): 16 curved temperature shells (1000-1 hPa) over the 0-80N, 25W-35E sector, 2 Nov 2023 12 UTC, radius 1 + 50 z̄(lat)/a (×50 air, as s02; strip means so the tropical tropopause bulges); cmocean thermal −85…+30 °C, colour bar 'temperature (°C)' in the maths zone. Camera: topDown → orbit (shells peel up) → flyThrough → Europe (250-hPa rim, 'Europe: ≈ 10 km, ≈ −50 °C') → tropics (100-hPa rim, 'tropics: ≈ 16.5 km, below −75 °C') → stratosphere ('warmer again', '≈ 45 km') → the Trappes column rod, below, zoom back out.",
        ps={"fn": "fluidpy.geo.atmos.lapse_rate_tropopause (strip means) + movies/data/_stack.py", "params": {"strips": ["45-55N", "0-10N"]}, "test": "CHECK W84"},
        exag=["temperature shells ×50 (= the s02 air scale)"], src="Data: ERA5 temperature on pressure levels (Copernicus C3S) · 2 Nov 2023, 12 UTC · 0–80°N, 25°W–35°E"),
    "s48b_front_stack": dict(after="s48_warm_front", beat="data · the cold front level by level (stack C)", kind="3-D layer stack",
        visual="UF2 (G6, stack C, U2-22 option): 11 layers (1000-500 hPa) of the temperature anomaly (T minus each level's box mean), 1 Nov 2023 18 UTC, 40-56N 25W-8E, heights ×80 (= the slices), the slices' diverging LUT; the gold cold-front line on every level where front_by_level finds it (900-650 hPa); the two slice walls at 45 %. Camera: from the s48 view → orbit → inside along 46.5N → topDown (the lines fan out westward, 'about 100 km') → a translucent gold surface through the lines → below → top-down on 850 hPa (= the s49 map).",
        ps={"fn": "fluidpy.diag.fronts.front_by_level (max_step_km=80) + fluidpy.diag.fronts.parallel_crossings", "params": {"seed": "fronts.json cold_front 850 hPa"}, "test": "CHECK W86"},
        exag=["front stack heights ×80 (= the slices)"], src="Data: ERA5 on pressure levels (Copernicus C3S) · 1 Nov 2023, 18 UTC · fronts computed from it"),
}
UF2_VIS = {
    "s02_thin_shell": "UF2 (U2-02/03): the ×40 circle is removed; on 'most pictures' a 70-px sky-blue halo ('how pictures draw it') shrinks on 'much thinner' to a 2-px hair-line ('true thickness'; 12 km = 0.7 px, 2-px minimum listed); source line K2 below the globe box.",
    "s03_air_parcel": "UF2 (U2-04/05/06): no trail; the parcel box teal 22 % with 3-px edges and 160 molecule dots jostling inside (illustrative); the 20 ERA5 arrows are K7 AnimatedWindArrow (marching dashes, k = 6 px/s per m/s); 'air parcel' a K3 callout; K1 fades on the flight and the terrain; K2 source below.",
    "s05_weight_column": "UF2 (U2-07, G5): K4 ColumnFaces — all four vertical edges from the ground to COLTOP.",
    "s13_slab": "UF2 (G5): column edges to the top (K4).", "s14_slab_weight": "UF2 (G5): column edges to the top (K4).",
    "s15_hydrostatic": "UF2 (U2-08): ∂p/∂z = −ρg (96 px) with its underbraces inside x 1120-1840; CalcStack right-limited to x 1840; column edges to the top.",
    "s18_scale_height": "UF2 (U2-09/10): S1-S7 as v4; the graph, tangent, 'H = how deep the air is' and the colder/warmer columns move to s20e/s20f; S8 'H: a height (metres)'; S9 'next: numbers, then meaning'. Column edges to the top.",
    "s18b_scale_height_number": "UF2 (U2-11/12): S3 slate ribbon of the real T(z) ('real air: colder higher up'); S4 the column takes one warm tint with thermometers '15 °C' at base and top ('pretend: one temperature'); S5 T = 15 °C = 288.15 K; S6-S7 H = 287 × 288.15 / 9.81 ≈ 8.43 km with underbraces; S8 '8.43 km' tick, 'what does it mean?'. No block here (moved to s20g).",
    "s19_exponential": "UF2: S2 keyword 'one temperature → H fixed', S3 'a simplification'.",
    "s20_exponential_meaning": "UF2 (U2-12): graph 0-18 km; S1 axis titles pulse; S2 marker to z = H; S3 e^{-H/H} = 1/e ≈ 0.37; S4 1013 → 373 hPa · 37 %; S5 137 hPa · 14 % at 16.9 km.",
    "s20b_per_km": "UF2 (U2-14): Δz and Δp brackets; Δp ≈ −(p/H)Δz; pressure lost / p = Δz/H; m/m struck → a plain number; 1 km / 8.43 km ≈ 0.12 (estimate 12 %); the estimate uses the bottom's p; e^{-1/8.43} ≈ 0.888; 1 − 0.888 ≈ 0.11 (exact 11 %).",
    "s21_balloon_pressure": "UF2 (U2-16/17): the plate ends at y ≤ 815, K2 source below it; S4 'wind at each height ← drift' with a teal drift arrow.",
    "s22_mass_below": "UF2 (U2-18): the Trappes balloon (IGRA) as the measurement: teal points along the column; 'measured: half at 5.5 km' (507 hPa), 'our estimate: 5.8 km' a bit above, bracket 'a bit lower'; 16 km: 90 %; just above 30 km: 99 %; ×50 globe on S10. No abbreviations.",
    "s27b_vapour_pressure": "UF2 (U2-19/20, U2-29): slot layout in the maths zone (rows 150-700); K1 frame in the v5 look; colour bar beside the globe in the text column; the two 1-kg boxes in the picture zone after the globe fades; '29/18 ≈ 1.61' and 'molecule share = 1.61 × mass share' in free rows; K2 source.",
    "s31_cloud_base": "UF2 (U2-21): a real Copernicus Sentinel-2 ground (22 Aug 2024, Beauce, SW of Paris) on a tilted 3-D plate (heights ×20); 14 thermals rise from the brightest fields to the computed cloud base (≈ 1.5 km) and turn into flat-based puffs; gold cloud-base plane; then the 24 Jun 2024 MODIS cumulus of the same box. Callouts 'cloud base ≈ 1.5 km', 'same height → flat bases'.",
    "s36_weather_climate": "UF2 (U2-25/26): graph box y 110-680; S6-S11 the band = climate (1991-2020) and the line = weather (2023) each with a gold link; warm spell and cold snap ringed; '287 of 365 days inside the band'; S12 the saying below the figure and its source, bold 800 gold.",
    "s53_trades_westerlies": "UF2 (U2-27/28): the cross-product v5 s33 look: K7 FlowParticles streaklines with the named belt brightened, dashed gold belt circles, BeltChevrons from the data's area-mean wind; a large globe that flies and hovers over the NE trades, SE trades, the North Atlantic westerlies and (new S6) the Southern Ocean westerlies, then Biscay (Ciarán track pulse) and back out; K1 fades and right panel while zoomed; callouts on the faded rim; source below.",
    "s60_recap": "UF2 (U2-24): S2 the same live 3-D column as s05 (K4, 1 m × 1 m base, edges to the top), slow orbit, weight arrow, gold sweep; S3 'H ≈ 8.4 km → 37 % left'.",
}
SRC_NEW = {
    "s22_mass_below": [{"at": 'AT(4, "a real measurement")', "text": "Data: IGRA v2 radiosonde (NOAA NCEI) · Trappes, near Paris · 1 Nov 2023, 00 UTC"},
                       {"at": "S10", "text": "Image: NASA VIIRS true colour (NASA GIBS) · 2 Nov 2023"}],
    "s31_cloud_base": [{"at": "S1", "text": "Image: contains modified Copernicus Sentinel data 2024 (ESA Sentinel-2) · 22 Aug 2024, 10:57 UTC · Beauce, south-west of Paris"},
                       {"at": "MODIS cross-fade", "text": "Image: NASA MODIS Aqua 250 m (NASA GIBS) · 24 Jun 2024, about 13:20 UTC · same area"}],
}
U2 = {"s02_thin_shell": ["U2-02", "U2-03"], "s03_air_parcel": ["U2-04", "U2-05", "U2-06"], "s05_weight_column": ["U2-07"], "s15_hydrostatic": ["U2-08"],
      "s18_scale_height": ["U2-09", "U2-10"], "s18b_scale_height_number": ["U2-11", "U2-12"], "s20_exponential_meaning": ["U2-12"], "s20e_tangent": ["U2-09", "U2-15"],
      "s20f_not_a_lid": ["U2-10"], "s20g_uniform_block": ["U2-13"], "s20b_per_km": ["U2-14"], "s21_balloon_pressure": ["U2-16", "U2-17"], "s22_mass_below": ["U2-18"],
      "s27b_vapour_pressure": ["U2-19", "U2-20", "U2-29"], "s27c_vapour_stack": ["U2-23"], "s31_cloud_base": ["U2-21"], "s36_weather_climate": ["U2-25", "U2-26"],
      "s38b_reanalysis_stack": ["U2-23"], "s47_cold_front": ["U2-22"], "s48b_front_stack": ["U2-22", "U2-23"], "s53_trades_westerlies": ["U2-27", "U2-28"], "s60_recap": ["U2-24"]}

scenes = [s for s in sb["scenes"] if s["id"] != "s20c_equal_slabs"]
for nid, n in NEW.items():
    k = [i for i, s in enumerate(scenes) if s["id"] == n["after"]][0]
    sc = {"id": nid, "t": [0, 0], "sentence_times": [], "beat": n["beat"], "visual": n["visual"], "voiceover": narr[nid],
          "on_screen_eq": ({"latex": n["eq"], "vallis_eq": n["veq"], "page_png": P + n["page"]} if n.get("eq") else None),
          "physics_source": n["ps"], "exaggeration": n.get("exag", []), "kind": n["kind"]}
    if n.get("src"):
        sc["source_line"] = [{"at": "S1", "text": n["src"]}]
    scenes.insert(k + 1, sc)
for s in scenes:
    if s["id"] in narr:
        s["voiceover"] = narr[s["id"]]
    if s["id"] in UF2_VIS:
        s["visual"] = (s.get("visual") or "").rstrip() + "\n\n" + UF2_VIS[s["id"]]
    if s["id"] in SRC_NEW:
        s["source_line"] = SRC_NEW[s["id"]]
    if s["id"] in U2:
        s["uf2"] = U2[s["id"]]
    if s["id"] == "s22_mass_below":
        s["on_screen_eq"] = {"latex": r"\text{share below} = 1 - \dfrac{p}{p_0}", "vallis_eq": "our step from (1.51)", "page_png": P + "p032.png"}
        s["physics_source"] = {"fn": "fluidpy.diag.sounding.level_crossing", "data": "soundings.json -> trappes (IGRA v2, 00 UTC 1 Nov 2023)", "test": "CHECK W83"}
sb["scenes"] = scenes
sb["version"] = 5
sb["honesty_notes"] += [
    "s18b-s20g use a pretend column with one temperature (15 °C) everywhere, and the narration says so; the real air cools upward (s23).",
    "s20g's uniform block is a thought experiment, said as such; it has a sharp top only because it is pretend.",
    "s22's half-pressure, tenth and hundredth heights are measured by one balloon (Trappes, 00 UTC 1 Nov 2023), and the narration names it.",
    "The stacks' heights are exaggerated (×50 shells, ×150 humidity, ×80 front, as in the slices).",
    "The s31 ground is a cloud-free Sentinel-2 image from 22 Aug 2024 (its date is in the source line); the thermals' start points come from the image's brightest fields, but their exact positions are illustrative; the cloud base is computed.",
    "s03 molecules inside the parcel are illustrative.",
    "s53 hovers drift east at 2°/s so the picture never freezes; every zoom tour ends back at its starting view (HOUSE_STYLE §5b)."]
sb["revision"] = ("v5 = user feedback round 2 (UF2, 2026-10-29) on v4 fix loop 1 (51:02): scale-height section rewritten (s18, s18b, s19, s20, "
                  "new s20e/s20f/s20g, s20b), s20c dropped, s21/s22 balloon, three layer stacks (s27c, s38b, s48b), s31 Sentinel-2, s36 weather vs climate, "
                  "s53 v5 globe tour with both westerly belts, s60 live column; house kit K1-K7 (GlobeFrame, SourceBelow, Callout, column edges, "
                  "LayerStack3D, overlap gate, animated wind). " + str(sb.get("revision", "")))
head = head.replace("storyboard v4 (UF1", "storyboard v5 (UF2 2026-10-29; earlier v4 UF1", 1)
(D / "storyboard.yaml").write_text(head + yaml.safe_dump(sb, sort_keys=False, allow_unicode=True, width=120), encoding="utf-8")
print("storyboard v5:", len(scenes), "scenes")
