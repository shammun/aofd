"""ch00_coordinates_frames (#5d) REMAKE 2026-11-07: bring the storyboard's contract fields in line with the remake (visuals, beats,
calc rows, sources, the top-level notes). Voiceovers are set by r7_text.py; times by make_timing.py --final. Line-based (comments and
layout kept); idempotent.
usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_frames/checks/r7_storyboard.py
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

import yaml

sys.path.insert(0, str(Path(__file__).resolve().parent))
from revoice import _set_block  # noqa: E402

ROOT = Path(__file__).resolve().parents[4]
SB = ROOT / "movies/ch00/ch00_coordinates_frames/storyboard.yaml"
R7 = "remake 2026-11-07 (remake_2026-11-07_log.md)"

FIELDS: dict[str, dict] = {
    "s00_title": {
        "visual": "TITLE FRAME (remake 2026-11-07, series layout of Parts 1-2, kit_fr/SeriesTitle = Part 2's kit_cs/SeriesTitle): left x 100-1075, line 1 'Coordinates' "
                  "(RiseText 150 px, weight 800, TitleGradient teal -> gold) pulsing x1.06 on AT(0, 'coordinates'); line 2 'Part 4 · Turning frames' (warm white, "
                  "<= 80 px); subtitle 'local axes and how they turn' (68 px). No 'made easy' (R1). Right x 1150-1840, y 150-630: Part A (frame 0 -> "
                  "AT(0, \"they're used\"): a small globe turning slowly with four stations (Brest, Trappes, Singapore, Khulna), each with its own tripod, a "
                  "tripod gliding east along Brest's parallel. Part B (12-frame cross-fade on \"they're used\"): from above the North Pole, a parcel moving east "
                  "along Brest's parallel, its east arrow swinging round with it (four faint copies left behind) - frames that turn as the air moves. One "
                  "source line 'Image: NASA Blue Marble Next Generation' below the column. Poster = frame 200.",
        "why": "the movie's ideas (local frames at every place, frames that turn as the air moves) on frame 0; the coast frame is Part 2's (remake 2026-11-07)",
        "layout": "Title frame; 'Image: NASA Blue Marble Next Generation' below the animation (SourceBelow, y <= 860). No other text.",
    },
    "s01_hook": {
        "visual": "Picture zone: the globe (unzoomed, left) with Brest and Khulna, each with its own east (orange), north (orange) and up (teal) arrows, the two "
                  "tripods visibly pointing different ways; on AT(2,'as the air moves') a parcel moves east from Brest and its tripod turns. Column: 'east · "
                  "north · up' from frame 0, then 'local frames', 'different at every place' (mini: two tripods pointing different ways) and 'turning as you "
                  "move' (mini: a tripod sliding along a parallel) on S4 (remake 2026-11-07: no coast mini).",
    },
    "s04_k_up": {
        "visual": "Half-Earth face through Brest's meridian. S3: x-hat, y-hat, z-hat from the centre, each on its word; column 'x̂ → (0°, 0°), ŷ → (0°, 90° E)', "
                  "'ẑ → North Pole' + gold 'derived in Part 3: Earth axes' (recall, remake 2026-11-07). S5-S6: up from the centre, 'same direction' link. S7: "
                  "k-hat = (cos φ cos λ, cos φ sin λ, sin φ) + gold 'derived in Part 3: position vector'; 'φ: latitude, λ: longitude' on 'where phi'. S9-S15: "
                  "the CalcStack (y 390) with Brest's numbers. Skip chip on S2.",
    },
    "s10_coast_frame": {
        "beat": "the coast frame RECALLED from Part 2 (equations derived in Part 1, result found in Part 2) + the 3-D point new here; the question for s11 "
                "(continuity_plan §2c item 1; remake 2026-11-07)",
        "visual": "Phase 1 (S0-S6): SW Florida coast map (NE 10 m), Fort Myers Beach, Gulf of Mexico, Florida labelled; i-hat, j-hat at Fort Myers Beach turn by "
                  "α = 121° on S3 into x-hat' (along, NNW) and y-hat' (across, out to sea); on S6 Ian's HRRR 20 UTC wind (ink, moving dashes) with its along "
                  "part (teal band) and across part (rose band). Column: 'Part 2: Ian at Fort Myers Beach'; x̂′ (S3) and ŷ′ (S4) + gold 'derived in Part 1: "
                  "turned axes'; 'coast: bearing 329°' and α = 90° − 329° = −239° ≡ 121° (S5); 'along ≈ 9.4 m/s', 'across ≈ −31.5 m/s' + 'onto the land' "
                  "and gold 'found in Part 2: Fort Myers Beach' (S6). Phase 2 (S7): zoomed globe at Fort Myers Beach (house GlobeFrame, darkened right "
                  "panel): the local tripod, k-hat (teal) stays, i-hat and j-hat turn about it by 121° into x-hat', y-hat'; column 'in three dimensions', the "
                  "two equations, 'k̂ unchanged', 'anticlockwise, seen from above'. Phase 3 (S8-S9): s11's map with Naples, Englewood, the dashed coast "
                  "segment and the two legs '91.5 km ?' / '55 km ?'; column 'Part 2: read off a km map', '91.5 km north · 55 km west', 'from latitude and "
                  "longitude'.",
        "calc_rows": [r"\text{coast: bearing }329^\circ", r"\alpha=90^\circ-329^\circ=-239^\circ\equiv121^\circ", r"\text{along}\approx9.4\ \text{m/s}",
                      r"\text{across}\approx-31.5\ \text{m/s}", r"\hat{\mathbf k}\ \text{unchanged}"],
        "data": "Natural Earth 10 m coastline (public domain); HRRR analysis (NOAA) 28 Sep 2022 20 UTC wind at Fort Myers Beach (fr.json ian.u); BMNG globe",
        "why": "R15/§2c: the worked coast calculation lives in Part 2; Part 4 recalls it at its use (R16) and adds what only Part 4 can: the 3-D local "
               "frame (k-hat kept) and, in s11, where Part 2's km legs come from",
        "layout": "Phase 1 / 3: map x 80-1000 with its source line below (SourceBelow, y <= 860); column x >= 1100. Phase 2: full-bleed zoomed globe, text "
                  "from x 1190 on the darkened panel, source line below the picture.",
    },
    "s11_coast_points": {
        "visual": "Map of the SW Florida coast (NE 10 m): Naples and Englewood with their latitude/longitude; dashed gold coast segment; the north leg (S9) and "
                  "west leg (S12) drawn as they are computed; side callouts 'north leg: 91.5 km', 'west leg: 55 km'. Column: Δy = a Δφ, Δx = a cos φ Δλ + gold "
                  "'derived in Part 3: distances' (S7), the CalcStack of S4-S12 (y 250). S14 (remake 2026-11-07, replaces the cut s12): the stack and "
                  "callouts leave; a north arrow and the gold β arc at Naples; column 'Part 2's coast bearing', tan β = 55.0/91.5 = 0.601, β ≈ 31°, "
                  "bearing = 360° − 31° = 329°, gold 'found in Part 2: the coast's bearing'.",
        "on_screen_eq": {"latex": r"\Delta y=a\,\Delta\varphi,\qquad \Delta x=a\cos\varphi\,\Delta\lambda", "vallis_eq": "none: Part 3's distances (recall)",
                         "page_png": None},
    },
    "s15_arrows_turn": {
        "visual": "Globe from above the North Pole: a plane flies due east along Brest's parallel for one hour (thought experiment), its east arrow swinging "
                  "round with it by 12°, gold radii from the axis and the 12° arc. Column: 'plane: 250 m/s due east, 1 hour'; 250 m/s × 3600 s = 900 km; "
                  "900 km / 74 km per degree ≈ 12°; Recall 'Δx = a cos φ Δλ ≈ 74 km per 1°' + gold 'derived in Part 3: distances' on 'As we found' "
                  "(remake 2026-11-07); '111 km north ⇒ k̂ tilts 1°'; Di/Dt, Dj/Dt, Dk/Dt.",
    },
    "s28_recap": {
        "beat": "recap ('To sum up') with numbers; S3 = where Part 2's coast legs come from; two-sentence teaser to Part 5 (R3)",
        "visual": "One beat per sentence, each picture at full strength until its sentence ends (the teaser picture from S7 to the end): tripod; top view + "
                  "slice; Brest and Khulna ups 75.8° apart; S3 (remake 2026-11-07) the SW Florida coast with Naples -> Englewood and the two legs, column "
                  "'latitude, longitude → km', '91.5 km north · 55 km west', 'Part 2's coast: 329°'; arrows turning (speed / radius); EQ_S25 'metric terms: "
                  "turning arrows'; log bars metric vs Coriolis '≈ 66 × smaller'; S7-S8 a storm ring sliding east (Part 5: frames that move), 'riding along "
                  "with a storm', 'its own spin · its motion', 'what a barometer sees'.",
    },
    "s29_end": {
        "visual": "Series end card (maths ending, HOUSE_STYLE §3, word for word): four topic thumbnails, keyword lines, notebook icons, related-movies list. "
                  "Remake 2026-11-07 (R3): the whole picture fades out over the 75-frame silent hold together with the music's 2.5-s tail.",
    },
}

TOP = {
    "remake_2026_11_07": {
        "log": "movies/ch00/ch00_coordinates_frames/remake_2026-11-07_log.md",
        "plan": "movies/ch00/coordinates_series/master_plan_2026-11-07.md (R1, R3, R15, R16, R19, §C); continuity_plan.md §2c, §3, §5-§7",
        "cut": ["s02_part3_recap (no opening recap; its facts recalled at s04, s08, s11, s15)",
                "s12_coast_angle, s13_alpha, s14_along_across (the worked calculation lives in Part 2 s26-s28; s10 recalls it, s11 S14 keeps one sentence)"],
        "narration": "re-voiced only new/changed sentences (checks/fr_r7_splice.py; OLD = the three measured dry runs)",
    },
}


def main() -> int:
    lines = SB.read_text(encoding="utf-8").split("\n")
    for sid, kv in FIELDS.items():
        for key, val in kv.items():
            try:
                lines = _set_block(lines, sid, key, val)
            except StopIteration:
                print(f"FAIL {sid}: no field {key}")
                return 1
    txt = "\n".join(lines)
    # top-level notes
    if "remake_2026_11_07:" not in txt:
        blk = yaml.safe_dump(TOP, width=150, sort_keys=False, allow_unicode=True).rstrip("\n")
        txt = txt.replace("\nconventions:", "\n" + blk + "\nconventions:", 1)
    # stale top-level pieces
    txt = re.sub(r"(?ms)^  effects_candidates:\n  - scene: s14_along_across\n.*?shows: water pushed onto Fort Myers Beach \(S12-S13 only\)\n",
                 "  effects_candidates: []  # remake 2026-11-07: s14 (the only candidate) is cut\n", txt)
    txt = txt.replace("  ian: 'kept (§0, §1): s14 uses the HRRR 20 UTC 10-m wind at Fort Myers Beach (unchanged by the centre question)'",
                      "  ian: 'remake 2026-11-07: s10 recalls Part 2''s HRRR 20 UTC 10-m wind at Fort Myers Beach (fr.json ian; = Part 2 cs.json shore.fmb)'")
    txt = txt.replace("  - 'teaser: In Part 5, we''ll let the frame itself move, and see what a storm''s winds look like to someone riding along with it.'",
                      "  - 'teaser (remake 2026-11-07): In Part 5, we''ll let the frame itself move, and ride along with a storm as it crosses the English Channel. "
                      "That shows which parts of the storm''s winds come from its own spin, and which come only from its motion, and what a barometer sees as the storm passes.'")
    SB.write_text(txt, encoding="utf-8")
    sb = yaml.safe_load(SB.read_text(encoding="utf-8"))
    print(f"storyboard: {len(sb['scenes'])} scenes; fields set for {', '.join(FIELDS)}; effects {sb['audio'].get('effects_candidates')}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
