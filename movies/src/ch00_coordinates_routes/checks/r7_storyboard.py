"""ch00_coordinates_routes (#5f) REMAKE 2026-11-07: bring the storyboard's contract fields in line with the remake (visuals, calc rows,
layout, the top-level title card / cross-part / music / chapter marks / remake record). Voiceovers are set by r7_text.py; times by
final_timing.py --final. Line-based (comments and layout kept); idempotent (each changed visual carries one "REMAKE 2026-11-07:" note).
usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_routes/checks/r7_storyboard.py
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

import yaml

sys.path.insert(0, str(Path(__file__).resolve().parent))
from revoice import _set_block  # noqa: E402

ROOT = Path(__file__).resolve().parents[4]
SB = ROOT / "movies/ch00/ch00_coordinates_routes/storyboard.yaml"
TAG = " REMAKE 2026-11-07:"

S00_VISUAL = ("TITLE FRAME (remake 2026-11-07, the series layout of every Coordinates part, kit_rt/SeriesTitle = Part 4's kit_fr = Part 2's kit_cs = "
              "Part 1's kit_cf): left x 100-1075, line 1 'Coordinates' (RiseText 150 px, weight 800, TitleGradient teal -> gold) pulsing x1.06 on "
              "AT(0, 'coordinates'); line 2 'Part 6 · Routes' (warm white, <= 80 px); subtitle 'great circles' / 'and rhumb lines' (68 px, two lines: one "
              "line is 1004 px, wider than the 975-px column). No 'made easy' (R1). Right x 1180-1840, y 170-640: Part A (frame 0 -> AT(0, \"they're "
              "used\")): a BMNG globe turns; the London-Los Angeles great circle draws in gold through the slicing sheet. Part B (12-frame cross-fade on "
              "\"they're used\"): a plane glyph flies the gold arc while a slate rhumb line draws beside it (from AT(0, 'shortest flights')), with two compass "
              "dials (one sweeping, one fixed). Source line 'Image: NASA Blue Marble Next Generation' below the right column. Poster = frame 200.")

NOTES: dict[str, str] = {
    "s01_hook": "S2 is the natural lead-in naming this part's pieces (scale factors, the great circle); no new picture (the column holds the chart "
                "and the seven thumbnails); S3 (sailors) unchanged.",
    "s03_curvilinear": "under 'polar', 'cylindrical', 'latitude, longitude' the gold tags 'Part 1', 'Part 2', 'Part 3' (y 565, fading with the names "
                       "on S5): where each system was met (R16).",
    "s04_scale_factors": "column S1-S3: Recall 's = r Δθ' + gold 'derived in Part 1: arc length' (y 200; 'r × the step' moved to y 360); S5-S8: "
                         "Recall 'Δy = a Δφ, Δx = a cos φ Δλ' + 'derived in Part 3: distances' (y 560) and 'a ≈ 6371 km' (y 720, gold glow on "
                         "'six thousand'); the θ:/φ:/λ: row tags in KaTeX; '1° = 0.01745 rad' and 'cos 48.4° ≈ 0.664' glow on their words; the "
                         "CalcStack rows cue on 'the Earth's radius times that' / 'those hundred' (show it, don't voice it).",
    "s06_great_circle": "new S10: Part 4's puck paid off (Part 4 s26: 'The puck goes straight, along a great circle, which we'll meet in Part 6'): a "
                        "teal puck dot glides along the gold great circle from London; keyword 'Part 4's puck: a great circle' (gold, y 530).",
    "s07_sigma": "the muted 'Part 1:' tag above the inset ring is now the series recall keyword 'derived in Part 1: arc length' (gold, y 190).",
    "s08_position_arrows": "under the r̂ formula, gold 'derived in Part 3: position vector' (y 450, from 'From Part 3' until London's line); the trig "
                           "inputs glow on their words (cos 51.51° row on 'is zero point six two two', sin(−0.13°), LA's cos φ / cos λ / sin λ); the "
                           "voice names what is multiplied (cosine phi times sine lambda), the products stay on screen.",
    "s09_cos_sigma": "S4 says which parts are multiplied and that they are added; the three products appear on 'London's first part' / 'then the "
                     "second parts' / 'then the third'; the sum on 'add the three products'; '≈ 0.195' (S5) and 'σ ≈ 78.7°' (S7) glow; the opening "
                     "keyword reads 'rule from the dot product movie'.",
    "s10_distance": "the rows stay; the voice no longer reads the products: '1° = π/180 rad ≈ 0.01745 rad' glows on 'about zero point', 6371 glows "
                    "on 'six thousand', '≈ 8755 km' on 'eight thousand'; the quick check row on 'make about eight thousand'.",
    "s11_route_shape": "new S5 voices the audit-F1 heading rows (Part 4's local east and north arrows, how much of r̂₂ lies along each, turned into "
                       "a bearing); Recall label 'derived in Part 4: local east and north' (y 410); the F1 stack moved to y 540 and cued on S5's words "
                       "(312° glows), vertex rows on S6 (62.4° glows), LA rows on S7 (214° glows); the WSW Mercator chart now leaves before S5 "
                       "(its 'flat map' label at y 519 sat on the stack's first row at y 500).",
    "s12_rhumb": "S5 says 'dividing the rhumb line's length by the great circle's' (the division row stays on screen); '+11 %' glows on 'eleven percent'.",
    "s13_why_rhumb": "the last sentence (the Part 7 line) is cut: the teaser is said once, in the recap (continuity §6); the keyword stays as 'why "
                     "straight: Part 7' (gold, y 840) 1 s after 'a straight line'.",
    "s14_recap": "S7 + S8 are the two-sentence teaser (R3): the Mercator mini with '?' and 'Part 7: maps' on S7, 'care near the poles' (y 815) on S8.",
    "s15_end": "the picture fades out with the music over the 2.5-s silent hold (R3; = Part 4's s29).",
}
CALC_ROWS = {
    "s04_scale_factors": [r"s=r\,\Delta\theta", r"\Delta y=a\,\Delta\varphi,\quad \Delta x=a\cos\varphi\,\Delta\lambda", r"a\approx6371\ \text{km}",
                          r"\varphi=48.4^\circ,\quad a=6371\ \text{km}", r"1^\circ=0.01745\ \text{rad}", r"\Delta y=6371\times0.01745\approx 111.2\ \text{km}",
                          r"\cos 48.4^\circ\approx 0.664", r"\Delta x=111.2\times0.664\approx 73.8\ \text{km}"],
}

TOP = {
    "title_card": {"layout": "series layout (kit_rt/SeriesTitle, remake 2026-11-07)", "line1": "Coordinates", "line2": "Part 6 · Routes",
                   "subtitle": ["great circles", "and rhumb lines"], "spoken": "s00 sentence (no 'easy'; 'see how they're used to …')"},
    "remake_2026_11_07": {
        "log": "movies/ch00/ch00_coordinates_routes/remake_2026-11-07_log.md",
        "master_plan": "movies/ch00/coordinates_series/master_plan_2026-11-07.md (R1, R3, R16, R19, §C)",
        "cut": ["s02_part5_recap (no opening recap; its facts recalled at s04, s07, s08, s11)"],
        "recalls": {"s04": ["derived in Part 1: arc length", "derived in Part 3: distances"], "s07": ["derived in Part 1: arc length"],
                    "s08": ["derived in Part 3: position vector"], "s09": ["rule from the dot product movie"], "s11": ["derived in Part 4: local east and north"],
                    "s06": ["Part 4's puck: a great circle (payoff of Part 4 s26)"]},
        "voice_rules": "natural openings (s00, s01); show the arithmetic, voice the meaning (s04, s08, s09, s10, s12); inputs said + highlighted (HL)",
        "ending": "s13's Part 7 line cut; s14 two-sentence teaser; s15 picture + music fade together over the 2.5-s hold",
        "narration_tools": ["checks/r7_text.py", "checks/rt_r7_splice.py", "checks/final_timing.py", "checks/rt_words.py"],
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
    # cross-part: the Part 4 / 5 "recap only" line and the teaser out
    sb2 = yaml.safe_load("\n".join(lines))
    cp = sb2["cross_part"]
    cp["relies_on"] = [r if not r.startswith("'Part 4") and not r.startswith("Part 4") else r for r in cp["relies_on"]]
    cp["relies_on"] = [("Part 4 (#5d): local east i-hat and north j-hat at a place (recalled at s11, 'derived in Part 4: local east and north'); the "
                        "force-free puck along a great circle (paid off at s06). Part 5 (#5e): not used (its storm-relative winds were only in the cut "
                        "recap)") if "Part 4 (#5d)" in r else r for r in cp["relies_on"]]
    cp["teaser_out"] = ("this part ends (s14 S7-S8): \"In Part 7, we'll flatten the Earth onto maps, and work out exactly what each map stretches. "
                        "That explains why the rhumb line comes out straight on the most famous map of all, and why weather data on a grid need care "
                        "near the poles.\"")
    cp["teaser_in"] = ("Part 5 (#5e) ends (continuity_plan §3): \"In Part 6, we'll find the shortest way between two places on the round Earth: the "
                       "great circle, and the rhumb line that sailors steered for centuries. It explains why flights from Europe to California pass "
                       "over Greenland.\"")
    lines = set_top(lines, "cross_part", cp)
    au = sb2["audio"]
    au["music"]["style"] = "chart-voyage (tools/sound/styles.py, Part 6's own score; no scene-entry layers)"
    au["music"]["fade"] = "picture and music fade out together over the 2.5-s silent end-card hold (R3; mix tail 2.5 s)"
    lines = set_top(lines, "audio", au)
    # chapter marks: the s02 mark goes (times refilled by final_timing.py)
    cm = [c for c in sb2["chapter_marks"] if c["scene"] != "s02_part5_recap"]
    lines = set_top(lines, "chapter_marks", cm)
    SB.write_text("\n".join(lines), encoding="utf-8")
    sb3 = yaml.safe_load(SB.read_text(encoding="utf-8"))
    n = sum(1 for s in sb3["scenes"] if TAG in s["visual"])
    print(f"storyboard: {len(sb3['scenes'])} scenes, {n} visuals with a remake note, chapter marks {len(sb3['chapter_marks'])}; s02 in file: "
          f"{'s02_part5_recap' in SB.read_text(encoding='utf-8').replace('s02_part5_recap (no opening', '')}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
