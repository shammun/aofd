"""ch00_coordinates_storm (#5b) user notes 2026-11-06: bring storyboard.yaml in line with script.md (the narration source).

* every scene's voiceover = its script.md paragraph (with the [beat] markers), so make_timing.py --final can check them;
* renames s30_flood_swipe -> s32_nargis_swipe, s31_recap -> s35_recap, s32_end -> s36_end; inserts s30_amphan_radar, s31_nargis_intro,
  s33_idai_intro, s34_idai_swipe (full scene records);
* updates the changed scenes' visual / source_line notes (s00, s06, s07, s17, s18, s19, s24, s32), the chapter marks, the concepts and
  honesty notes, and adds a user_notes_2026_11_06 block (item -> scene).
t / sentence_times are placeholders here; make_timing.py --final fills them from the measured TTS.
usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_storm/checks/u1_storyboard.py
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[4]
MOV = ROOT / "movies/ch00/ch00_coordinates_storm"
SBP, SCP = MOV / "storyboard.yaml", MOV / "script.md"


def script_paragraphs() -> dict[str, str]:
    out, cur = {}, None
    for line in SCP.read_text(encoding="utf-8").splitlines():
        m = re.match(r"^##\s+([\w\-]+)", line)
        if m:
            cur = m.group(1)
            out[cur] = []
        elif cur is not None and not line.startswith("#") and not line.strip().startswith(">"):
            out[cur].append(line)
    return {k: re.sub(r"\s+", " ", " ".join(v)).strip() for k, v in out.items()}


RENAME = {"s30_flood_swipe": "s32_nargis_swipe", "s31_recap": "s35_recap", "s32_end": "s36_end"}
NOTE = "user notes 2026-11-06 (prompt_b.docx; movies/ch00/ch00_coordinates_storm/user_notes_2026-11-06.md)"
SRC_RADAR = ["Data: NOAA NEXRAD weather radar, Tampa Bay (KTBW) · 28 Sep 2022, 18:02 UTC", "(lowest beam, tilted 0.5° above the ground)"]

NEW_SCENES = {
    "s30_amphan_radar": {
        "beat": "Amphan's flood: why no ordinary before/after (cloud for days, small flooded patches at 250 m), then the Sentinel-1 radar pair",
        "visual": "S0-S2: two MODIS Terra natural-colour pictures of the radar box (88.80-89.92 E, 22.12-22.75 N), 21 and 22 May 2020, side by side with "
                  "their dates (cloud over the coast), Natural Earth coast in white; S2 a 250-m pixel grid zoom note. S3-S5: a code-drawn satellite sends "
                  "microwave pulses; over rough land some bounce back (bright), over calm water they reflect away like a mirror (dark); key 'dark = water'. "
                  "S6: the Sentinel-1 VV pair (−24 … 0 dB grey, one stretch) in one frame with 'before · 16 May' / 'after · 22 May' tags, Satkhira and "
                  "'Sundarbans (forest)' labelled, coast lines; S7 the gold swipe line right → left → right → middle (slow full sweeps). S8: '≈ 125 km² of new "
                  "water'; S9: a gold square drawn to scale (11.2 km a side) with √125 ≈ 11.2 km. Source line under the picture.",
        "on_screen_eq": None,
        "physics_source": {"fn": "fluidpy.data.fetch(ee://ch00_flood_v2/close_s1, close_jrc) cache hits; fluidpy.data.gibs.fetch_wms (MODIS Terra 21, 22 May 2020)",
                           "params": {"orbit": 150, "before": "2020-05-16T23:55", "after": "2020-05-22T23:55", "box_wsen": [88.8, 22.12, 89.92, 22.75],
                                      "new_water": "VV < −18 dB after, not before, drop ≥ 3 dB, not JRC permanent water (seasonality ≥ 10 months), blobs ≥ 9 px"},
                           "test": "CHECK DS35 (cloud share ≥ 0.6 on 21 and 22 May), DS36 (new water 124.9 km², √125 = 11.18, 2.6 d after landfall)"},
        "exaggeration": ["the swipe line animates the comparison, not a time change", "the microwave pulses are a schematic"],
        "kind": "before/after radar swipe", "data": "GEE-S1-amphan2020 (Sentinel-1 GRD, cache hit); NASA-GIBS-amphan2020-clouds",
        "tool": "Remotion SVG + Img (swipe as s32)", "why": "user notes item 11: say why Amphan has no optical before/after, then show the radar pair",
        "related": [], "feedback": ["user 2026-11-06 item 11"],
        "source_line": "Data: ESA Copernicus Sentinel-1 radar · 16 and 22 May 2020 | Images: NASA Worldview (MODIS Terra) · 21 and 22 May 2020",
        "layout": "Picture zone x 80-1080; keys and numbers in the column; source line under the picture."},
    "s31_nargis_intro": {
        "beat": "Cyclone Nargis as a case study: globe → Myanmar, the Irrawaddy delta, the track and dates, the eye, the zoom into the delta",
        "visual": "House globe (s21 look): from the Bay of Bengal view the globe turns east to Myanmar (S1), country names; S2-S3 zoom to the delta with "
                  "the MODIS natural-colour picture of 21 Apr draped on it (the channels), labels Yangon, Pathein, 'Irrawaddy delta'; keyword 'mostly ≤ 5 m above "
                  "the sea'. S4-S7: the IBTrACS track draws on with a date readout (25 Apr → 3 May): west, north, east; landfall ring 2 May at the SW "
                  "corner; the 90 kt → 167 km/h → 46 m/s rows; the track crosses the delta past Yangon. S8: the MODIS Aqua picture of 2 May draped on "
                  "the globe, gold ring on the eye. S9-S10: zoom into the delta box (94.15-96.45 E, 15.7-17.1 N), the draped natural-colour picture "
                  "fills the frame (= s32's first frame). §5b edge fades; source line below the globe.",
        "on_screen_eq": None,
        "physics_source": {"fn": "fluidpy.data.ibtracs.storm_table (NI, 2008117N11090); fluidpy.geo.sphere.great_circle_distance; fluidpy.data.gibs.fetch_wms; "
                                 "fluidpy.data.fetch (ETOPO 2022 60″ subset)",
                           "params": {"sid": "2008117N11090", "landfall": "2008-05-02 09-12 UTC, 16.0 N 94.1-94.5 E", "wind": "WMO (IMD, 3-min) 90 kt, 962 hPa"},
                           "test": "CHECK DS32 (track phases, landfall, 90 kt = 167 km/h = 46 m/s, Yangon ≤ 30 km, eye in the picture, delta ≤ 5 m)"},
        "exaggeration": ["camera moves (not data)"], "kind": "3-D globe case study", "data": "IBTrACS-v04r01 (NI); NASA-GIBS-nargis2008; GEE-MODIS-flood-v3; ETOPO2022-60s",
        "tool": "three.js globe (kit_cs) + SVG overlays", "why": "user notes item 9: introduce Nargis before its pictures, as Amphan was introduced",
        "related": [], "feedback": ["user 2026-11-06 item 9"],
        "source_line": "Data: IBTrACS v04r01 (NOAA NCEI) · Cyclone Nargis, 25 Apr-3 May 2008 · NASA MODIS (Aqua, 2 May; Terra, 21 Apr) · NASA Blue Marble · Natural Earth",
        "layout": "Globe left (zoom-reveal), keywords on the faded rim / column; source line below the globe."},
    "s33_idai_intro": {
        "beat": "Cyclone Idai, shorter: globe → Mozambique Channel, south of the equator (clockwise), the VIIRS picture, landfall near Beira, the zoom",
        "visual": "House globe turns from the Bay of Bengal across the Indian Ocean to the Mozambique Channel (S0-S1), labels Madagascar, Mozambique; "
                  "the IBTrACS track 9-16 Mar draws on; S2 a gold clockwise arc round the storm with 'clockwise (seen from above)' beside an anticlockwise "
                  "mini for the northern storms; S3 the VIIRS natural-colour picture of 14 Mar draped; S4 landfall ring, rows 85 kt → 157 km/h → 44 m/s; "
                  "S5-S6 zoom to Beira (Beira, Buzi, Dondo), the natural-colour picture of 11 Mar fills the frame (= s34's first frame).",
        "on_screen_eq": None,
        "physics_source": {"fn": "fluidpy.data.ibtracs.storm_table (SI, 2019063S18038); fluidpy.data.gibs.fetch_wms (VIIRS 14 Mar 2019, cache hit)",
                           "params": {"sid": "2019063S18038", "landfall": "21 UTC 14 Mar - 00 UTC 15 Mar 2019 near Beira", "wind": "WMO (Réunion, 10-min) 85 kt, 960 hPa"},
                           "test": "CHECK DS33"},
        "exaggeration": ["camera moves (not data)"], "kind": "3-D globe case study", "data": "IBTrACS-v04r01 (SI); NASA-GIBS-idai2019; GEE-MODIS-flood-v3",
        "tool": "three.js globe (kit_cs) + SVG overlays", "why": "user notes item 10: bring the Idai before/after back, introduced like Nargis but shorter",
        "related": [], "feedback": ["user 2026-11-06 item 10"],
        "source_line": "Data: IBTrACS v04r01 (NOAA NCEI) · Cyclone Idai, 9-16 Mar 2019 · NASA VIIRS (Suomi NPP), 14 Mar 2019 · NASA Blue Marble · Natural Earth",
        "layout": "Globe left (zoom-reveal), keywords in the column; source line below the globe."},
    "s34_idai_swipe": {
        "beat": "The Idai before/after: natural colour, then false colour 7-2-1 (the key from s32)",
        "visual": "One frame 33.80-34.95 E, 20.20-19.35 S: MODIS Aqua 11 Mar | Terra 25 Mar 2019; S0 natural-colour swipe right → left → right → middle "
                  "with date tags; Beira (label left-above its dot), Buzi (label left-below), Dondo; scale bar 25 km, north arrow; S2 cross-fade to 7-2-1, "
                  "the same swipe; S3 'dark blue = water'; S4 'white blobs = clouds'; colour key kept from s32 in the column. Source line under the picture.",
        "on_screen_eq": None,
        "physics_source": {"fn": "fluidpy.data.fetch(ee://ch00_flood_v2/v3_idai2019) cache hit (MYD09/MOD09 b1-b4-b3 and b7-b2-b1, the Nargis stretches)",
                           "params": {"before": "2019-03-11 (Aqua)", "after": "2019-03-25 (Terra)", "crop_wsen": [33.8, -20.2, 34.95, -19.35]},
                           "test": "CHECK DS34 (same grid, wet share up ≥ 0.10, −3.4 d / +10.5 d)"},
        "exaggeration": ["the swipe line animates the comparison, not a time change"], "kind": "before/after swipe (natural, then false colour)",
        "data": "GEE-MODIS-flood-v3 (v3_idai2019)", "tool": "Remotion SVG + Img", "why": "user notes item 10", "related": [], "feedback": ["user 2026-11-06 item 10"],
        "source_line": "Images: NASA MODIS (Aqua, Terra) via Google Earth Engine · Cyclone Idai, 11 and 25 Mar 2019 · natural colour (bands 1-4-3), then false colour (7-2-1)",
        "layout": "Picture zone x 80-1080; key in the column; source line under the picture."},
}
VISUAL = {
    "s00_title": " [user notes 2026-11-06 item 12: 'the easy way' is not said; 'made easy' pulses on AT(0, 'turning arrows and cylinders').]",
    "s06_dtheta_dtheta": " [user notes 2026-11-06 items 1-2: no spoken step numbers and no on-screen step label; the steps flow 'First … Next … Now …'.]",
    "s07_toward_centre": " [user notes 2026-11-06 item 3: S10 the difference quotient dθ̂/dθ ≈ [θ̂(θ+Δθ) − θ̂(θ)]/Δθ in the maths zone; S11 'Δθ = 0.01 rad ≈ 0.57°: a "
                         "small turn', 53.13° + 0.57° = 53.70°; S12-S14 the two θ̂ values and their difference; S15 the quotient with the numbers plugged in "
                         "→ (−0.6, −0.8); S16-S17 side by side: −r̂ = −(cos θ, sin θ) = −(0.6, 0.8) = (−0.6, −0.8), matching numbers linked in gold.]",
    "s17_ian_check": " [user notes 2026-11-06 items 4-5: the radar source line in the user's exact two lines; 'never mixed' removed with S11.]",
    "s18_ian_stack": " [user notes 2026-11-06 item 6: the five layers EVENLY spaced (0.9 units apart) in a much taller stack (no linear km axis; each layer's "
                     "pressure-and-height tag carries its height); camera: an oblique close look, a slow hover/orbit, a little pull-back and a second orbit.]",
    "s19_ian_layers_lit": " [user notes 2026-11-06 item 6: lit layers read from a closer oblique view; the swing round (S7) and the close look (S8) kept as the user liked them.]",
    "s24_amphan_curtain": " [user notes 2026-11-06 item 7: S4-S9 the dark lines named on both charts (u_r = 0 m/s contours: the border between in and out; "
                          "they wrap weak pockets, so they differ), contour labels '0' on each line and a gold ring on a pocket; the empty parts outlined "
                          "in gold dashes as they are said (below the sea surface near the centre, above the top level, Amphan inside 25 km).]",
    "s32_nargis_swipe": " [REWORKED user notes 2026-11-06 item 8: natural colour (MODIS 1-4-3, same granules, box, pinning) first with its own swipe; then "
                        "7-2-1 with the reason; the key swatches sampled from the picture (dry fields pink).]",
}
MARKS = [("s00_title", "title"), ("s02_part1_recap", "Part 1 in a minute"), ("s03_tip_on_circle", "how r-hat turns (maths block 1)"),
         ("s08_product_rule", "product rule to acceleration (maths block 2)"), ("s13_acceleration_numbers", "how big, and why a steady speed accelerates"),
         ("s15_cylinder", "a tall storm: cylindrical coordinates"), ("s17_ian_check", "is Ian shown right?"), ("s18_ian_stack", "Ian layer by layer"),
         ("s20_ian_curtain", "in, up and out"), ("s21_amphan_intro", "second storm: Cyclone Amphan"), ("s25_why_cylindrical", "why cylindrical coordinates"),
         ("s26_onshore", "back to the coast"), ("s27_surge", "storm surge"), ("s28_ian_record", "Ian's surge, measured by gauges"),
         ("s29_flood_flight", "floods seen from space: Amphan"), ("s30_amphan_radar", "Amphan's flood, seen by radar"), ("s31_nargis_intro", "Cyclone Nargis"),
         ("s32_nargis_swipe", "Nargis: natural and false colour"), ("s33_idai_intro", "Cyclone Idai"), ("s35_recap", "to sum up")]


def main() -> int:
    text = SBP.read_text(encoding="utf-8")
    head = "".join(ln + "\n" for ln in text.split("\n") if ln.startswith("#"))[: text.index("id: ")]
    head = text[: text.index("\nid: ") + 1]
    sb = yaml.safe_load(text)
    par = script_paragraphs()
    by = {}
    for s in sb["scenes"]:
        s["id"] = RENAME.get(s["id"], s["id"])
        by[s["id"]] = s
    order = list(par.keys())
    scenes = []
    for sid in order:
        if sid in by:
            s = by[sid]
        else:
            s = {"id": sid, "t": [0, 0], "sentence_times": [], "voiceover": "", **NEW_SCENES[sid]}
            s = {k: s[k] for k in ["id", "t", "sentence_times", "beat", "visual", "voiceover", "on_screen_eq", "physics_source", "exaggeration", "kind", "data", "tool",
                                     "why", "related", "feedback", "source_line", "layout"] if k in s}
        s["voiceover"] = par[sid]
        if sid in VISUAL and VISUAL[sid] not in s.get("visual", ""):
            s["visual"] = s.get("visual", "") + VISUAL[sid]
        scenes.append(s)
    missing = [s for s in by if s not in par]
    if missing:
        print("FAIL scenes in the storyboard but not in script.md:", missing)
        return 1
    sb["scenes"] = scenes
    by["s17_ian_check"]["source_line"] = " / ".join(SRC_RADAR) + " | Data: NOAA HRRR analysis · 28 Sep 2022, 18 UTC · centre = the model's calm centre"
    sb["chapter_marks"] = [{"t": "", "t_s": 0.0, "scene": a, "name": b} for a, b in MARKS]
    sb["concepts"] = [c for c in sb["concepts"] if not c.startswith("before/after imagery")] + [
        "floods seen from space: Amphan by radar (Sentinel-1, through cloud), Nargis 2008 and Idai 2019 in natural colour then false colour 7-2-1 (why flood mappers use it)"]
    sb["honesty_notes"] = [h for h in sb["honesty_notes"] if not h.startswith("'s30 (PENDING") and not h.startswith("s30 (PENDING")] + [
        "s30 (user notes 2026-11-06): Amphan's optical pictures were cloud-covered for days (MODIS Terra 21/22 May shown); the radar pair is Sentinel-1 orbit 150, "
        "16 vs 22 May 2020 (23:55 UTC); new water 124.9 km² by a stated threshold method (UN-SPIDER practice, adapted), not an official flood map.",
        "s31/s33: intensities are the official WMO-agency values with their averaging said (IMD 3-min 90 kt for Nargis, Réunion 10-min 85 kt for Idai); "
        "'most of the delta ≤ 5 m' from ETOPO 2022 60″ (DS32).",
        "s32/s34: natural colour = MODIS bands 1-4-3 of the same granules as the 7-2-1 pair (one fixed stretch each); the key swatches are the picture's own "
        "class medians (DS31).",
        "s24: the dark lines are the u_r = 0 contour of the ring-average section (drawn by the builder); the empty parts are no-data (below the sea surface, "
        "above the top level, Amphan inside its first ring); all said and outlined."]
    sb["user_notes_2026_11_06"] = {
        "source": NOTE,
        "items": {1: "s06 S2 'and assume nothing' cut", 2: "s06 spoken step numbers removed (First/Next/Now/To find…); on-screen step label removed",
                  3: "s07 S10-S17: Δθ = 0.01 named, difference quotient written, numbers plugged in, −r̂ = −(cos θ, sin θ) = −(0.6, 0.8) side by side",
                  4: "s17 radar source line in the user's exact two lines", 5: "s17 S11 removed; s28 S1, s09 S11 private-sounding lines rephrased",
                  6: "s18-s19 taller, evenly spaced stack; new camera (oblique close, hover/orbit, pull back, orbit); s19 swing + close look kept",
                  7: "s24 dark lines = u_r = 0 contours, labelled and said; no-data parts said and outlined",
                  8: "s32 natural colour (1-4-3) first, then 7-2-1 with the reason; key swatches from the picture",
                  9: "s31 Nargis case study (globe, delta, track, dates, intensity, eye, zoom)", 10: "s33-s34 Idai case study and before/after (labels apart)",
                  11: "s30 Amphan: why no optical pair, then the Sentinel-1 radar swipe", 12: "s00 'the easy way' removed (pulse on the concept words); s01 and s35 name the three flood events in order"},
        "flood_order": "Ian's surge (gauges) → Amphan (flight, then radar: same storm, continues straight from its landfall zoom) → Nargis (same Bay; the clearest "
                       "flood, so it teaches natural vs false colour) → Idai (shorter, re-uses the colour lesson; other hemisphere: clockwise)"}
    out = head + yaml.safe_dump(sb, sort_keys=False, allow_unicode=True, width=150, default_flow_style=False)
    SBP.write_text(out, encoding="utf-8")
    yaml.safe_load(SBP.read_text(encoding="utf-8"))
    print(f"storyboard: {len(scenes)} scenes; voiceovers from script.md; renamed {list(RENAME.values())}; new {list(NEW_SCENES)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
