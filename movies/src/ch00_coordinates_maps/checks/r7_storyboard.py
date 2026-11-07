"""ch00_coordinates_maps (#5g) REMAKE 2026-11-07: bring the storyboard's contract fields in line with the remake (visuals, calc rows,
the top-level title card / cross-part / music / chapter marks / remake record). Voiceovers are set by r7_text.py; times by final_timing.py
--final. Line-based (comments and layout kept); idempotent (each changed visual carries one "REMAKE 2026-11-07:" note).
(= Part 6's checks/r7_storyboard.py with this part's notes.)
usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_maps/checks/r7_storyboard.py
"""
from __future__ import annotations

import sys
from pathlib import Path

import yaml

sys.path.insert(0, str(Path(__file__).resolve().parent))
from revoice import _set_block  # noqa: E402

ROOT = Path(__file__).resolve().parents[4]
SB = ROOT / "movies/ch00/ch00_coordinates_maps/storyboard.yaml"
TAG = " REMAKE 2026-11-07:"

S00_VISUAL = ("TITLE FRAME (remake 2026-11-07, the series layout of every Coordinates part, kit_mp/SeriesTitle = Part 6's kit_rt = Part 4's kit_fr "
              "= Part 2's kit_cs = Part 1's kit_cf): left x 100-1075, line 1 'Coordinates' (RiseText 150 px, weight 800, TitleGradient teal -> gold) "
              "pulsing x1.06 on AT(0, 'coordinates'); line 2 'Part 7 · Maps' (warm white, <= 80 px); subtitle 'map projections' / 'and the view from "
              "the pole' (68 px, two lines). No 'made easy' (R1; the old 88-px pulsing 'made easy' line is gone). Right x 1130-1840, y 170-640: "
              "Part A (frame 0 -> AT(0, \"they're used\")): the BMNG globe peels into gores and stretches into the plate carrée, then the Mercator "
              "map grows taller, Tissot circles riding along (time-scaled to end before the cross-fade). Part B (12-frame cross-fade on \"they're "
              "used\"): the polar map with warm-white wind trails running round the 10-hPa vortex. Source lines below the right column. Poster = "
              "frame 200.")

NOTES: dict[str, str] = {
    "s01_hook": "S2 is the natural lead-in naming this part's maps (the flat square map of weather data, Mercator's map where the rhumb line is "
                "straight, equal-area maps), picking up Part 6's teaser; the Mercator map's pulse is on \"Mercator's map\".",
    "s04_plate_carree": "S6: Recall 'a ≈ 6371 km' + gold 'from Part 3: the Earth's radius' (y 520, glow on 'six thousand'); S8: Recall 's = r θ' + "
                        "'derived in Part 1: arc length' (y 330, replaces the 'arc rule' keyword; 'θ → λ, r → a' moved to x XC+260); S12: Recall "
                        "'Δy = a Δφ' + 'derived in Part 3: distance north' (y 330, replaces 'distance north (Part 3)'); S14 introduces Brest (Part 3); "
                        "the radians row glows on 'zero point' (input); S16-S17 no longer read the products (rows stay on screen).",
    "s05_stretch_k": "S3: gold 'derived in Part 3: radius of a parallel' (y 610, until the formula); S4/S6 say what is multiplied / divided, the "
                     "rows stay; S10-S12 voice the cosines (inputs), and '1/0.664', '1/0.5', '1/0.204' appear and glow on their words.",
    "s06_gradient_preview": "new S3 (Part 6's scale factors): Recall 'h_φ = a, h_λ = a cos φ' + 'derived in Part 6: scale factors' (y 420, the "
                            "former s02 equation); the ×4.9 / ×2 / ×1.5 callouts leave just before it; S7: Recall 'Δx = a cos φ Δλ ≈ 73.8 km' + "
                            "'derived in Part 3: distances' (y 420, glow on 'seventy three'); later cues shifted by one sentence.",
    "s08_mercator_dy": "S4: gold 'derived in Part 3: distance north' (y 480); S10 voices the stretch 1.506 (input; the Brest row glows on it), the "
                       "product stays on screen.",
    "s09_adding_steps": "S6 says what is multiplied (ten degrees in radians times the stretch) and the result; the '0.1745 × 1.004 ≈ 0.175' row stays; the table head '1/cos' is drawn in TeX (symbol lint C5).",
    "s10_ln_formula": "S0: gold 'derived in Part 3: integration' (y 250); the angle rows now read '45° + 60°/2 = 75°' and '45° + 48.4°/2 = 69.2°' "
                      "(the half latitude labelled; the sums are not voiced); the tangent rows glow on their words (inputs).",
    "s11_slope_check": "S6 says what is divided ('the difference by that step') and the result; S13 'Earth radii'; rows unchanged.",
    "s12_rhumb_straight": "S3/S7: Part 6's rhumb line London-Los Angeles (258.5°) recalled: gold 'derived in Part 6: rhumb line, one bearing' "
                          "(y 110, two lines) replaces the 'rhumb line: one compass bearing' keyword.",
    "s13_area_stretch": "S3, S5, S7, S10 no longer read the products, the square or the division (rows stay; cues on 'two hundred kilometres wide' "
                        "and 'squaring it'); the map label reads '40 000 km²: 4 times' (x Bp+190, clear of '10 000 km²').",
    "s19_vortex_components": "S1: gold 'derived in Part 4: east, north' (y 480); S2: Recall 'θ̂, r̂' + 'derived in Part 1: polar unit vectors' "
                             "(y 560); both leave before the size bars. Fact row 7 (R19): the bar label is 'hurricane: a few hundred km' "
                             "(bar 52 px, was 12) and S9 says 'instead of a few hundred'.",
    "s20_origin_wheel": "S9-S11, S14 say what is done (Pythagoras; divide each leg; multiply u and v by r̂'s / θ̂'s parts and add) and the "
                        "results; every row stays on screen; gold 'derived in Part 1: components' (y 120) from S11.",
    "s21_origin_vortex": "S3: Recall 'ū = (1/N) Σ u_i' + 'derived in Part 1: ring averages' (y 580, size 46), gone before the second ring's rows.",
    "s22_recap": "10 sentences: S0-S6 the recap with numbers on the minis ('× 1.5 at Brest', '73.8 km', 'Brest ≈ 6167 km' on the ladder, "
                 "'Mercator: × 24 at Svalbard'); S7 closes the series (the seven part thumbnails of s01, all lit, 'coordinates: all seven "
                 "parts'); S8-S9 the two-sentence gradient teaser (isotherms + arrow, 'next: The gradient', then '1/(a cos φ) ∂T/∂λ' in gold).",
    "s23_end": "the picture fades out with the music over the 2.5-s silent hold (R3; = Part 6's s15).",
}
CALC_ROWS = {
    "s04_plate_carree": [r"a\approx6371\ \text{km}", r"s=r\,\theta", r"\Delta y=a\,\Delta\varphi",
                         r"\varphi,\ \lambda=48.4^\circ,\ -4.5^\circ", r"\times\dfrac{\pi}{180}=0.8447,\ -0.0785",
                         r"x=6371\times(-0.0785)\approx-500\ \text{km}", r"y=6371\times0.8447\approx5382\ \text{km}"],
    "s06_gradient_preview": [r"h_\varphi=a,\qquad h_\lambda=a\cos\varphi", r"\Delta x=a\cos\varphi\,\Delta\lambda\approx73.8\ \text{km}",
                             r"\dfrac{1\ ^\circ\text{C}}{73.8\ \text{km}}\approx 1.4\ ^\circ\text{C per }100\ \text{km}"],
    "s10_ln_formula": [r"e\approx2.718,\quad \ln 1=0,\quad \ln e=1", r"45^\circ+60^\circ/2=75^\circ", r"\tan 75^\circ\approx3.732",
                       r"\ln 3.732\approx1.317", r"10^\circ\text{ steps: }1.313", r"1^\circ\text{ steps: }1.317", r"45^\circ+48.4^\circ/2=69.2^\circ",
                       r"\tan 69.2^\circ\approx2.6325", r"\ln 2.6325\approx0.968", r"0.968\times6371\approx6167\ \text{km}"],
    "s21_origin_vortex": [r"\bar u=\dfrac{1}{N}\sum_{i=1}^{N}u_i", r"(90^\circ-72.9^\circ)\times111.2\approx1900\ \text{km}",
                          r"\text{ratio}=33\div17.5\approx1.9", r"\text{ratio}=20\div47\approx0.4"],
}

TOP = {
    "title_card": {"layout": "series layout (kit_mp/SeriesTitle, remake 2026-11-07)", "line1": "Coordinates", "line2": "Part 7 · Maps",
                   "subtitle": ["map projections", "and the view from the pole"], "spoken": "s00 sentence (no 'easy'; 'see how they're used to …')"},
    "remake_2026_11_07": {
        "log": "movies/ch00/ch00_coordinates_maps/remake_2026-11-07_log.md",
        "master_plan": "movies/ch00/coordinates_series/master_plan_2026-11-07.md (R1, R3, R16, R19, §C)",
        "cut": ["s02_part6_recap (no opening recap; its facts recalled at s04, s05, s06, s08, s10, s12, s19, s20, s21)"],
        "recalls": {"s04": ["from Part 3: the Earth's radius", "derived in Part 1: arc length", "derived in Part 3: distance north"],
                    "s05": ["derived in Part 3: radius of a parallel"], "s06": ["derived in Part 6: scale factors", "derived in Part 3: distances"],
                    "s08": ["derived in Part 3: distance north"], "s10": ["derived in Part 3: integration"],
                    "s12": ["derived in Part 6: rhumb line, one bearing"], "s19": ["derived in Part 4: east, north", "derived in Part 1: polar unit vectors"],
                    "s20": ["derived in Part 1: components"], "s21": ["derived in Part 1: ring averages"]},
        "facts": "fact_check_2026-11-07 summary row 7 applied (s19: 'a few hundred' km); new claims in the log's fact table",
        "voice_rules": "natural openings (s00, s01); show the arithmetic, voice the meaning (s04, s05, s08, s09, s10, s11, s13, s20); inputs said + "
                       "highlighted (HL: cosines, radians, tangents, a, the stretch 1.506, 73.8 km); C5 symbol lint 33 -> 0 ($…$ labels)",
        "ending": "s22 recap with numbers + the close of the seven-part series + the two-sentence gradient teaser; s23 picture + music fade together "
                  "over the 2.5-s hold",
        "narration_tools": ["checks/r7_text.py", "checks/mp_r7_splice.py", "checks/final_timing.py", "checks/mp_words.py"],
    },
}


def set_top(lines: list[str], key: str, value) -> list[str]:
    new = yaml.safe_dump({key: value}, width=150, sort_keys=False, default_flow_style=False, allow_unicode=True).rstrip("\n").split("\n")
    i0 = next((i for i, ln in enumerate(lines) if ln.startswith(f"{key}:")), None)
    if i0 is None:
        i0 = next(i for i, ln in enumerate(lines) if ln.startswith("conventions:"))
        return lines[:i0] + new + lines[i0:]
    i1 = next((i for i in range(i0 + 1, len(lines)) if lines[i] and not lines[i].startswith((" ", "-", "#"))), len(lines))
    return lines[:i0] + new + lines[i1:]


def main() -> int:
    sb = yaml.safe_load(SB.read_text(encoding="utf-8"))
    by = {s["id"]: s for s in sb["scenes"]}
    lines = SB.read_text(encoding="utf-8").split("\n")
    lines = _set_block(lines, "s00_title", "visual", S00_VISUAL)
    for sid, note in NOTES.items():
        v = by[sid]["visual"]
        v = v.split(TAG)[0].rstrip() + TAG + " " + note
        lines = _set_block(lines, sid, "visual", v)
    for sid, rows in CALC_ROWS.items():
        lines = _set_block(lines, sid, "calc_rows", rows)
    for k, v in TOP.items():
        lines = set_top(lines, k, v)
    sb2 = yaml.safe_load("\n".join(lines))
    cp = sb2["cross_part"]
    cp["relies_on"] = [("Part 4 (#5d): local east i and north j at a place (recalled at s19, 'derived in Part 4: east, north'); Part 5 (#5e): not "
                        "used (frames that move were only in the cut recap)") if str(r).startswith("Part 4 (#5d)") else r for r in cp["relies_on"]]
    cp["teaser_in"] = ("Part 6 ends (s14 S7-S8): \"In Part 7, we'll flatten the Earth onto maps, and work out exactly what each map stretches. That "
                       "explains why the rhumb line comes out straight on the most famous map of all, and why weather data on a grid need care near "
                       "the poles.\"")
    cp["teaser_out"] = ("this part (the last) ends (s22 S7-S9): \"With that, our seven parts on coordinates are complete, from arrows on a flat map "
                        "to winds over the whole round Earth. Next in this series comes the gradient: how fast, and in which direction, temperature "
                        "or pressure changes across a map. It's where the one over the Earth's radius times cosine phi that we met here does its "
                        "real work.\" (continuity_plan §3)")
    lines = set_top(lines, "cross_part", cp)
    au = sb2["audio"]
    au["music"]["style"] = "polar-chart (tools/sound/styles.py, Part 7's own score; its 'from s16 on' layers are set to the final s16 start by checks/mp_mix.py)"
    au["music"]["fade"] = "picture and music fade out together over the 2.5-s silent end-card hold (R3; mix tail 2.5 s)"
    au["effects_candidates"] = []
    au["effects_note"] = ("remake 2026-11-07: the s18 'wind_high_far' candidate is dropped (no such effect in tools/sound/sfx.py; the 10-hPa "
                          "stratosphere has no audible wind to show); sound.yaml effects: [] (= Parts 4 and 6)")
    lines = set_top(lines, "audio", au)
    cm = [c for c in sb2["chapter_marks"] if c["scene"] != "s02_part6_recap"]
    lines = set_top(lines, "chapter_marks", cm)
    ms = sb2["maths_skip"]
    for b in ms["blocks"]:
        b["keep_line"] = f"S0 of {b['skip_to_scene']}"
    lines = set_top(lines, "maths_skip", ms)
    SB.write_text("\n".join(lines), encoding="utf-8")
    sb3 = yaml.safe_load(SB.read_text(encoding="utf-8"))
    n = sum(1 for s in sb3["scenes"] if TAG in s["visual"])
    print(f"storyboard: {len(sb3['scenes'])} scenes, {n} visuals with a remake note, chapter marks {len(sb3['chapter_marks'])}; s02 scene in file: "
          f"{any(s['id'] == 's02_part6_recap' for s in sb3['scenes'])}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
