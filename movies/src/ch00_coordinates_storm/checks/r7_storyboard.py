"""ch00_coordinates_storm (#5b) remake 2026-11-07: bring storyboard.yaml in line with the new script.md (r7_script.py).

* scenes: s02_part1_recap cut (user 2026-11-07: no recap scene); s26_onshore / s27_surge / s28_ian_record replaced by the coast block
  s26-s31; s29-s36 renamed s32 / s34 / s35 / s37 / s38 / s40 / s41 / s42; new s33 / s36 / s39 (event winds); every voiceover = its
  script.md paragraph; on_screen_eq / physics_source / source_line for the new scenes; the changed scenes' visual notes;
* chapter marks, honesty notes, quiz hook; a remake_2026_11_07 block (R-item -> scenes);
* fact-check row 12: '≈ 78 km' -> '≈ 79 km' in the storyboard text.
t / sentence_times are refilled by make_timing.py --final from the measured TTS.
usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_storm/checks/r7_storyboard.py
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

import yaml

sys.path.insert(0, str(Path(__file__).parent))
from make_timing import set_top  # noqa: E402
from u1_storyboard import script_paragraphs  # noqa: E402
from r7_script import ORDER  # noqa: E402

ROOT = Path(__file__).resolve().parents[4]
SBP = ROOT / "movies/ch00/ch00_coordinates_storm/storyboard.yaml"
EQ = (ROOT / "movies/src/ch00_coordinates_storm/cs_eq.ts").read_text(encoding="utf-8")


def eq(name: str) -> str:
    m = re.search(rf"export const {name} = String\.raw`(.*?)`;", EQ)
    assert m, name
    return m.group(1)


SHORE_FN = "fluidpy.data.movie_shore.coast_axes + shore_components (fluidpy.geo.vectors.components_in_axes; Kundu Eq. (K 2.8))"
COMMON = {"exaggeration": [], "tool": "Remotion SVG (GeoMap / CalcStack, cs_sD.tsx)", "related": [], "layout": "picture zone x 80-1000 (map 920 × 750); maths column x 1100; source line under the map; speed bar in the column"}
NEW = {
    "s26_coast_axes": {"beat": "B1: back to Ian's coast; Part 1's turned axes recalled exactly ('derived in Part 1: turned axes'), the matrix form, then the "
                       "same rule for the wind (along / across tags); x̂′ along the coast so ŷ′ points out to sea; sign meaning",
                       "visual": "S0-S2 the HRRR 20 UTC speed map with the FMB wind and the along / across arrows; S3 on the Part 1 diagram (east / north axes, "
                       "x̂′, ŷ′ at α = 30°, gold α arc); S8-S9 a wind arrow and its two parts (slate along, teal across); S10-S11 a coast along x̂′ with sea / land "
                       "and + / − across arrows. Column: x̂′, ŷ′, the matrix, x′ / y′ (Part 1's exact lines), along / across.",
                       "on_screen_eq": {"latex": eq("EQ_S26"), "vallis_eq": "Coordinates Part 1 (Kundu (K 2.8) rotated components)", "page_png": None},
                       "physics_source": {"fn": "recalled (Part 1); wind form = " + SHORE_FN, "params": {}, "test": "tests/data/test_movie_shore.py"},
                       "kind": "recall + diagram", "data": "HRRR-zarr-ian2022 (20 UTC) for S0-S2", "why": "user paras 9-11: the turned-axes equations before the floods",
                       "feedback": ["user 2026-11-06 paras 9-11", "master plan R4, R13"], "source_line": "Data: HRRR (NOAA) · 28 Sep 2022, 20 UTC · Natural Earth coast"},
    "s27_coast_angle": {"beat": "B2: the coast's angle on a local flat km map: Naples -> Englewood 91.5 km N, 55.0 km W; tan β = 55.0 / 91.5 ≈ 0.601, β ≈ 31°, "
                        "bearing 329°; 'derived in Part 1: bearings'; α = 90° − 329° = −239° + 360° = 121°; cos ≈ −0.515, sin ≈ 0.857; x̂′ NNW, ŷ′ WSW out to sea",
                        "visual": "Natural Earth coast on a local flat map with a 25-km grid (origin Naples); the two legs dashed with their km; the gold β arc; "
                        "x̂′ and ŷ′ at Fort Myers Beach; 'Gulf of Mexico'.",
                        "on_screen_eq": {"latex": eq("EQ_S27"), "vallis_eq": "Coordinates Part 1 (bearings)", "page_png": None},
                        "physics_source": {"fn": "fluidpy.data.movie_shore.coast_axes (fluidpy.geo.sphere.arc_lengths on the mean latitude)",
                                           "params": {"from": [26.099, -81.801], "to": [26.922, -82.354]}, "test": "CHECK DS40, DS42"},
                        "kind": "flat km map + calculation", "data": "NE-10m-admin (coast)", "why": "the one number the along / across split needs",
                        "feedback": ["user 2026-11-06 paras 8-11", "continuity plan §2a B2"], "source_line": "Coast: Natural Earth · local flat map in km (origin Naples)"},
    "s28_fmb_calc": {"beat": "B3: Fort Myers Beach, HRRR 20 UTC: u 22.2, v 24.3; along = 22.2 × (−0.515) + 24.3 × 0.857 ≈ −11.4 + 20.8 ≈ 9.4; across = "
                     "−22.2 × 0.857 + 24.3 × (−0.515) ≈ −19.0 − 12.5 ≈ −31.5: onto the land; check √(9.4² + 31.5²) = √1081 ≈ 32.9 ≈ 33",
                     "visual": "HRRR speed map; FMB with x̂′ / ŷ′; the wind (ink) and its along (slate) and across (rose, −) parts as animated arrows from one tail; "
                     "gold link from the across row to its arrow.",
                     "on_screen_eq": None, "physics_source": {"fn": SHORE_FN, "params": {"u": 22.232, "v": 24.293, "bearing": 328.98}, "test": "CHECK DS40"},
                     "kind": "data map + calculation", "data": "HRRR-zarr-ian2022 (20 UTC)", "why": "the original movie's 40:10 calculation, restored",
                     "feedback": ["user 2026-11-06 para 9"], "source_line": "Data: HRRR (NOAA) · 28 Sep 2022, 20 UTC · Natural Earth coast"},
    "s29_stp_calc": {"beat": "B4: Saint Petersburg (St Pete Beach -> Tarpon Springs 55.7 km N, 6.8 km W, 7°, bearing 353°, α 97°): u −10.2, v −16.0; across ≈ "
                     "10.1 + 2.0 ≈ +12.1 out to sea; along ≈ 1.2 − 15.9 = −14.7; then the opposing arrows (rose onto the land at FMB, teal out to sea at StP)",
                     "visual": "zoomed HRRR map of Pinellas / Tampa Bay, the Gulf-coast segment, the wind and its parts; S9 the map widens to both stations with "
                     "their across-shore arrows.",
                     "on_screen_eq": None, "physics_source": {"fn": SHORE_FN, "params": {"u": -10.25, "v": -16.0, "bearing": 353.06}, "test": "CHECK DS41 (measured α 96.9°, not the plan's 94.6°)"},
                     "kind": "data map + calculation", "data": "HRRR-zarr-ian2022 (20 UTC)", "why": "the original's 41:09 opposing arrows, restored",
                     "feedback": ["user 2026-11-06 para 11"], "source_line": "Data: HRRR (NOAA) · 28 Sep 2022, 20 UTC · Natural Earth coast"},
    "s30_onshore_piles": {"beat": "B5: the reasoning BEFORE the evidence: onshore wind piles the water up, offshore wind drags it away; storm surge; the shallow "
                          "shelf; the low pressure's small share (≈ 1 cm per hPa; Ian 941 hPa at the 19:05 UTC landfall: 72 hPa → ≈ 72 cm); the prediction",
                          "visual": "two schematic cross-sections (onto the land: surface tilts up to the coast; out to sea: tilts down), then the ETOPO shelf "
                          "profile with a rising water band (×20), then a small map with '?' at the two stations.",
                          "on_screen_eq": None, "physics_source": {"fn": "fluidpy.data.movie_shore.inverse_barometer", "params": {"p_hpa": 941}, "test": "CHECK DS43"},
                          "kind": "schematic + data chart", "data": "ETOPO 2022 shelf profile (cs.json coast.shelf); IBTrACS v04r01 (USA = NHC) 941 hPa",
                          "why": "HOUSE_STYLE §3: the reasoning is said before the evidence", "feedback": ["user 2026-11-06 para 9"],
                          "source_line": "Sea floor: NOAA ETOPO 2022 · Ian's pressure: IBTrACS v04r01 (NHC best track)",
                          "exaggeration": ["S1-S2 cross-sections schematic", "S4 water rise drawn ×20"]},
    "s31_gauges": {"beat": "B6: the gauges answer: Fort Myers +2.2 m, Saint Petersburg −1.8 m; the across-shore sign flipped and so did the water; FMB "
                   "3-4.5 m above the ground; satellites saw almost nothing (fact row 9); the two lines are the surge; Ekman and storm-surge pointers",
                   "visual": "laid out like the original single coordinates movie (build 1, 41:00-41:20; user 2026-11-07): the map with both stations and their "
                   "across-shore arrows (rose onto the land, teal out to sea) on the left; on the right the two gauge lines over 36 h, 'water above the normal tide (m)', "
                   "the landfall marker, the station legend; each line gold-linked to its station's across-shore arrow; the feet-to-metres rows on S4.",
                   "on_screen_eq": None, "physics_source": {"fn": "fluidpy.data.coops.fetch_water_level + residual (build 1)", "params": {}, "test": "cs.json coast.gauges"},
                   "kind": "data chart + map", "data": "NOAA-COOPS 8725520, 8726520", "why": "the evidence, after the reasoning",
                   "feedback": ["user 2026-11-06 paras 8-11", "fact check row 9"],
                   "source_line": "Data: NOAA CO-OPS gauges 8725520, 8726520 · 27-29 Sep 2022 · NHC (US National Hurricane Center) report"},
}
for nm, sid, t, extra in (("amphan", "s33_amphan_wind", "2020-05-20T09:00", "Sundarbans shore 21.644 N 89.229 E; coast 92.9 km W, 21.9 km S, 13°, 257°, α 193°; "
                           "u −8.4, v 21.0 → across ≈ −1.9 − 20.5 ≈ −22.4 (onto the land); IMD 960 hPa → ≈ 53 cm; ERA5 ≈ 0.59 of the IMD wind"),
                          ("nargis", "s36_nargis_wind", "2008-05-02T11:00", "delta coast S of Bogale 15.778 N 95.174 E; coast 69.5 km W, 10.8 km N, 9°, 279°, α 171°; "
                           "u 9.6, v 16.5 → across ≈ −1.5 − 16.3 ≈ −17.8; IMD 962 hPa → ≈ 51 cm; ERA5 ≈ 0.55"),
                          ("idai", "s39_idai_wind", "2019-03-14T19:00", "Beira seafront 19.829 S 34.935 E; coast 52.3 km W, 35.9 km S, 34°, 236°, α 214°; "
                           "u −6.7, v 20.9 → across ≈ −3.7 − 17.3 ≈ −21.0; RSMC La Réunion 955 hPa → ≈ 58 cm; ERA5 ≈ 0.66")):
    NEW[sid] = {"beat": f"R14/R14b: {nm.capitalize()}'s across-shore wind from ERA5 at {t} UTC, before its before/after: {extra}",
                "visual": "ERA5 10-m speed map (cmocean speed 0-30 m/s, bar in the column) with animated ERA5 arrows, Natural Earth coast, the ERA5 centre, the "
                "coast segment and its km legs, the point with x̂′ / ŷ′, the wind and its across-shore arrow (rose); CalcStacks for the angle and the across part; "
                "the inverse-barometer row.",
                "on_screen_eq": None,
                "physics_source": {"fn": "fluidpy.data.movie_shore.era5_event + coast_axes + inverse_barometer", "params": {"time": t}, "test": "CHECK DS44-DS47"},
                "kind": "data map + calculation", "data": f"ERA5-ARCO-{nm}{ {'amphan': 2020, 'nargis': 2008, 'idai': 2019}[nm]}",
                "why": "user para 9: for each event the wind and the across-shore calculation before the satellite pictures",
                "feedback": ["user 2026-11-06 paras 9, 12", "master plan R14, R14b"],
                "source_line": f"Data: ERA5 (Copernicus C3S) · {t[:10]}, {t[11:13]} UTC · 10-m wind · coast: Natural Earth",
                "exaggeration": ["ERA5 0.25° is smooth and too weak in the core (said); used for direction and sign"]}
VIS = {
    "s00_title": "Series title layout (kit_cs/SeriesTitle = Part 1's): 'Coordinates' (150 px, teal → gold, pulses on 'cylindrical coordinates'), 'Part 2 · Inside a "
                 "tropical cyclone', 'turning arrows and / cylindrical coordinates'; no 'made easy' (R1). Right: Part A the turning velocity, Part B Ian's section.",
    "s01_hook": "The parcel on a ring; tropical cyclone names; 'second of seven parts' with the seven-part icon row; S6-S7 (R10, no recap scene): 'Part 1: polar "
                "coordinates, r̂, θ̂' (both arrows on the parcel) and the three things Part 2 adds.",
    "s03_tip_on_circle": "(unchanged) + recalls: r̂ = (cos θ, sin θ) 'derived in Part 1: polar unit vectors' on S8; 's = r θ derived in Part 1: arc length' on S13; "
                         "θ̂ = (−sin θ, cos θ) on S18.",
    "s06_dtheta_dtheta": "(unchanged) + recall (p, q) → (−q, p) 'derived in Part 1: quarter turn' on S14.",
    "s09_dtheta_dt": "(unchanged ring) + S1-S7 recall: u_r = u cos θ + v sin θ, u_θ = −u sin θ + v cos θ 'derived in Part 1: radial and tangential wind'; Part 1's "
                     "worked point (east wind 10 m/s at θ ≈ 53°: u_r = 6, u_θ = −8) drawn at the ring point; the 72-point ring average ≈ 34.8 m/s; v = that speed.",
    "s15_cylinder": "(GOES plate, in/up/out) + R11: the flat polar grid on the sea (S7), a point (r, θ) lifted by z (S8), the grid copies lifted to heights, "
                    "'polar + height = cylindrical' (S9), x = r cos θ, y = r sin θ, z = z 'derived in Part 1: polar coordinates' (S10), the cylinder (S11).",
    "s16_three_parts": "(unchanged) + u_r, u_θ lines 'derived in Part 1: radial and tangential wind' on S1-S4.",
    "s20_ian_curtain": "(unchanged) + 'derived in Part 1: ring average' under the ring-average equation.",
    "s21_amphan_intro": "(globe tour unchanged) + fact rows 1-2: 'IMD's top wind class: super cyclonic storm', 'the first in the Bay since 1999', 'wind over the "
                        "sea, not harm on land', 'Sidr 2007 · Aila 2009'; the Kolkata line split.",
    "s23_amphan_ring": "(unchanged) + 'derived in Part 1: inflow angle' under tan(inflow) = |u_r| / u_θ.",
    "s35_nargis_intro": "(unchanged) S0 fact row 10 ('some of the best-known'); S12 leads into the wind scene.",
    "s41_recap": "S0-S6 unchanged; S7 the coast with along / across; S8-S9 the gauges with the two across-shore numbers; S10 the three events' across-shore "
                 "arrows onto the land; S11 the flood pictures; S12-S13 the teaser (Part 3: the Earth; latitude, longitude → km).",
    "s42_end": "(unchanged card) the picture fades out with the music over the 2.5-s hold (R3).",
}
MARKS = [("title", "s00_title"), ("how r-hat turns (maths block 1)", "s03_tip_on_circle"), ("product rule to acceleration (maths block 2)", "s08_product_rule"),
         ("how big, and why a steady speed accelerates", "s13_acceleration_numbers"), ("a tall storm: cylindrical coordinates", "s15_cylinder"),
         ("is Ian shown right?", "s17_ian_check"), ("Ian layer by layer", "s18_ian_stack"), ("in, up and out", "s20_ian_curtain"),
         ("second storm: Cyclone Amphan", "s21_amphan_intro"), ("why cylindrical coordinates", "s25_why_cylindrical"),
         ("turned axes on the coast", "s26_coast_axes"), ("Fort Myers Beach and Saint Petersburg", "s28_fmb_calc"), ("storm surge and the tide gauges", "s30_onshore_piles"),
         ("floods seen from space: Amphan", "s32_flood_flight"), ("Cyclone Nargis", "s35_nargis_intro"), ("Cyclone Idai", "s38_idai_intro"), ("to sum up", "s41_recap")]
REMAKE = {
    "source": "movies/ch00/coordinates_series/master_plan_2026-11-07.md (R1, R3, R10-R16, R14b, R19) + user 2026-11-07 (no recap scene)",
    "R1": "s00 'made easy' removed; series title layout",
    "R3": "s41 recap with the numbers + two-sentence teaser; s42 picture fades with the music over the hold",
    "R10": "s02_part1_recap cut (user 2026-11-07); s01 S6-S7: what Part 1 gave, what Part 2 adds",
    "R11": "s15 S7-S11 cylindrical = polar + height, 3-D grid lift, x = r cos θ, y = r sin θ, z = z",
    "R12/R16": "recalls at the point of use: s03, s06, s09 (with Part 1's worked point and the ring average), s16, s20, s23, s26, s27",
    "R13": "coast block s26-s31 (B1-B6) replacing s26_onshore / s27_surge / s28_ian_record",
    "R14/R14b": "s33 / s36 / s39 ERA5 wind, coast angle, across-shore calculation, pressure, before each before/after",
    "R19": "fact rows 1, 2, 4 (manifest author order), 9, 10, 12 applied",
    "user 2026-11-07 (gauge chart)": "s26 S0 names Ian 'the storm we measured in Part 1'; s31 water-level chart laid out like the original movie and gold-linked "
                                     "to the across-shore arrows; s33 / s36 / s39 say there is no tide-gauge record in our data before the pictures (archive: none for "
                                     "Amphan, Nargis, Idai)",
}


def main() -> None:
    par = script_paragraphs()
    txt = Path("G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_storm/tmp/storyboard_n2_backup.yaml").read_text(encoding="utf-8").replace("≈ 78 km", "≈ 79 km")
    sb = yaml.safe_load(txt)
    old = {s["id"]: s for s in sb["scenes"]}
    scenes = []
    for new, src in ORDER:
        oid = src or {"s41_recap": "s35_recap", "s35_nargis_intro": "s31_nargis_intro"}.get(new, new)
        base = old.get(oid)
        if new in NEW:
            rec = {"id": new, "t": [0, 0], "sentence_times": [], **COMMON, **NEW[new]}
        else:
            rec = dict(base)
            rec["id"] = new
        rec["voiceover"] = par[new]
        if new in VIS:
            rec["visual"] = VIS[new]
        scenes.append({k: rec[k] for k in ["id", "t", "sentence_times", "beat", "visual", "voiceover", "on_screen_eq", "physics_source", "exaggeration", "kind",
                                            "data", "tool", "why", "related", "feedback", "source_line", "layout"] if k in rec})
    lines = txt.split("\n")
    i0 = lines.index("scenes:")
    i1 = next(i for i in range(i0 + 1, len(lines)) if lines[i] and not lines[i].startswith((" ", "-", "#")))
    dump = yaml.safe_dump({"scenes": scenes}, width=150, sort_keys=False, allow_unicode=True).rstrip("\n").split("\n")
    lines = lines[:i0] + dump + lines[i1:]
    cm = [{"name": n, "scene": s, "t": "0:00", "t_s": 0.0} for n, s in MARKS]
    lines = set_top(lines, "chapter_marks", cm)
    sbd = yaml.safe_load("\n".join(lines))
    hn = sbd["honesty_notes"] + [
        "remake 2026-11-07: s27 reads the coast's km legs off a local flat map (δy = a δφ, δx = a cos φ̄ δλ; the rule itself is Part 3's, the movie says 'a flat "
        "map marked in kilometres').",
        "remake 2026-11-07: s33/s36/s39 ERA5 (0.25°) is 0.55-0.66 of the regional best-track wind: said, and used for the direction and sign of the across-shore part only.",
        "remake 2026-11-07: Saint Petersburg's gauge (8726520) is on the Tampa Bay side; the coast axis is the Pinellas Gulf coast (ŷ′ west to the Gulf).",
        "remake 2026-11-07: the Fort Myers gauge (8725520) is up the Caloosahatchee River (said 'up the river').",
        "remake 2026-11-07: the inverse-barometer numbers use the official centre pressure at landfall (IBTrACS), not the reanalysis."]
    lines = set_top(lines, "honesty_notes", hn)
    lines = set_top(lines, "quiz_hook", "On which side of Ian's eye did the sea fall, and why? (At Saint Petersburg: the across-shore wind was +12.1 m/s, out to sea, "
                    "so the water was dragged away and the gauge fell 1.8 m.)")
    out = "\n".join(lines)
    cut = out.find("\nremake_2026_11_07:")
    if cut >= 0:
        out = out[:cut + 1]
    out = out.rstrip("\n") + "\n" + yaml.safe_dump({"remake_2026_11_07": REMAKE}, width=150, sort_keys=False, allow_unicode=True)
    SBP.write_text(out, encoding="utf-8")
    sb2 = yaml.safe_load(SBP.read_text(encoding="utf-8"))
    bad = [s["id"] for s in sb2["scenes"] if s["voiceover"].strip() != par[s["id"]]]
    print(f"{len(sb2['scenes'])} scenes; voiceover mismatches: {bad}; ids: {[s['id'] for s in sb2['scenes']]}")


if __name__ == "__main__":
    main()
