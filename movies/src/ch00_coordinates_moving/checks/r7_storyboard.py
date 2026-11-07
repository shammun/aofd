"""ch00_coordinates_moving (#5e) REMAKE 2026-11-07: bring the storyboard's contract fields and the script README in line with the remake
(visual notes, calc rows, title card, music / effects, cross-part teaser, a top-level remake record). Voiceovers are set by r7_text.py;
times by mv_final_timing.py --final (heavy phase). Line-based (comments and layout kept); idempotent (a note is appended once).
usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_moving/checks/r7_storyboard.py
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import yaml

sys.path.insert(0, str(Path(__file__).resolve().parent))
from revoice import _set_block  # noqa: E402

ROOT = Path(__file__).resolve().parents[4]
MOV = ROOT / "movies/ch00/ch00_coordinates_moving"
SB = MOV / "storyboard.yaml"
TAG = "REMAKE 2026-11-07:"

NOTES: dict[str, str] = {
    "s00_title": "the series title layout of Parts 1-4 (kit_mv/SeriesTitle = Part 4's kit_fr): line 1 'Coordinates' (150 px, TitleGradient) pulsing x1.06 on "
                 "AT(0,'coordinates'); line 2 'Part 5 · Moving frames' (<= 80 px, warm white); subtitle 'storm-relative winds' (68 px). 'made easy' removed "
                 "(R1). Part A (train, rulers) unchanged; Part B (Ciaran's isobars, the ring, the Plymouth barometer) cross-fades on AT(0,\"they're used\").",
    "s01_hook": "S3 'Now let's dive into moving frames: …' (opening rule 2026-11-07); S4 names the application (a real storm, a barometer on the coast). "
                "Keywords unchanged ('part 5 of 7' S2, 'moving frames' S3, 'a real storm · a barometer' S4).",
    "s03_train": "S3 voices 'your speed and the train's speed added together' (the sum 20 + 1.5 = 21.5 stays on screen, not voiced).",
    "s04_velocities_add": "spoken 'step one / step two' removed (S5 'the change seen from the station is the sum of the two', S6 'Next'); S10 no voiced sum; "
                          "the CalcStack result carries its symbol: u = 1.5 + 20 = 21.5 m/s.",
    "s05_accel_same": "spoken 'Step one … five' -> First / Next / Then / Now / Finally (series audit P5); every cue unchanged.",
    "s06_parcel_accel": "R16: under the recalled DT/Dt equation, the gold label 'from the derivatives movie' from AT(1,'derivatives movie') until 'put u in "
                        "place of T' (the 'air parcel' keyword leaves before it).",
    "s07_sliding_pattern": "show it, don't voice it: S5, S6, S10, S11, S12 say what is combined (the wind's speed minus the pattern's speed; that speed times the "
                           "slope; minus the pattern's speed times the slope; the full wind times the same slope; adding the local change and the advection) "
                           "and the result; every number stays in the CalcStack. The two data inputs 13.54 m/s and 0.111 (m/s)/km glow (HL) on their words; "
                           "the last row is 'sum = −4.0 + 5.4 = +1.4'.",
    "s08_ciaran": "S5-S8 rewritten. S5: Part 1's rule recalled at its point of use (Recall 'θ = 90° − bearing', 'derived in Part 1: polar coordinates, "
                  "bearings', then 'east = |U| cos θ, north = |U| sin θ'); S6: 'east = |U| sin 71°', 'north = |U| cos 71°'; S7: 'sin 71° ≈ 0.946, cos 71° ≈ 0.326' "
                  "(gold, glowing on 'Sine seventy one' and 'cosine seventy one'), 'east = 14.6 × 0.946 ≈ 13.8 m/s', 'north = 14.6 × 0.326 ≈ 4.8 m/s'; S8: "
                  "U = (14.6 sin 71°, 14.6 cos 71°) ≈ (13.8, 4.8) m/s and the Recall 'U = 13.8 î + 4.8 ĵ' with 'from Part 4: local east and north arrows' "
                  "(the cut s02's i, j content). The track calculation (S4) and the map are unchanged.",
    "s09_lopsided": "R16: on S1 'u_r = u cos θ + v sin θ' and 'u_θ = −u sin θ + v cos θ' with 'derived in Part 1: radial and tangential wind', leaving before "
                    "the side values (S2).",
    "s10_storm_relative": "series audit §3a: S1 recalls the vectors movie's storm-relative wind ('met in the vectors movie', gold, until S4); S7 'Take away the "
                          "storm's velocity, part by part' (no voiced subtraction).",
    "s12_invariant": "R16: on S2 the Recall 'ū_θ = (1/N) Σ u_θ,i, N = 72' with 'derived in Part 1: ring averages' (until 'That's no accident').",
    "s14_tau_derive": "spoken 'Step one … three' -> First / Next / Then; R16: the traveller's rate 'dT/dt = ∂T/∂t + speed × slope' with 'from the derivatives "
                      "movie: the traveller's rate' on S4 (the cut s02's content), and '∇p · cross product movie' on S5 (series audit: grad p recalled).",
    "s15_plymouth": "show it, don't voice it: S2 'the later reading minus the earlier one, divided by the two hours', S6 'the storm's speed times that slope', S8 "
                    "'Adding the barometer's rate and the sliding term'; the 0.061 input row and the answer row ∂p/∂τ ≈ −0.6 glow on their words.",
    "s16_meaning": "S0 says the split in words (the fall of 3.8 splits into 0.6 from the storm changing and 3.2 from the pattern sliding past); the bars rise on "
                   "'three point eight', 'zero point six', 'three point two'; EQ_S16 appears on 'splits into'.",
    "s17_recap": "R3: the teaser is two sentences (S9 Part 6: the great circle and the rhumb line sailors steered for centuries; S10 why flights from Europe "
                 "to California pass over Greenland); beat 9's picture and 'Part 6: great circles, rhumb lines' stay to the end, 'flights cross Greenland' "
                 "joins on S10.",
    "s18_end": "R3: the picture fades out with the music over the 75-frame silent hold (= Parts 2 and 4).",
}
CALC_ADD: dict[str, list[str]] = {
    "s04_velocities_add": [r"u=1.5+20=21.5\ \text{m/s}"],
    "s07_sliding_pattern": [r"\text{sum}=-4.0+5.4=+1.4"],
    "s08_ciaran": [r"\theta=90^\circ-\text{bearing}", r"\text{east}=|\mathbf U|\cos\theta,\ \ \text{north}=|\mathbf U|\sin\theta",
                   r"\text{east}=|\mathbf U|\sin71^\circ", r"\text{north}=|\mathbf U|\cos71^\circ", r"\sin71^\circ\approx0.946,\ \ \cos71^\circ\approx0.326",
                   r"\text{east}=14.6\times0.946\approx13.8\ \text{m/s}", r"\text{north}=14.6\times0.326\approx4.8\ \text{m/s}",
                   r"\mathbf U=13.8\,\hat{\mathbf i}+4.8\,\hat{\mathbf j}"],
    "s09_lopsided": [r"u_r=u\cos\theta+v\sin\theta", r"u_\theta=-u\sin\theta+v\cos\theta"],
    "s12_invariant": [r"\bar u_\theta=\dfrac{1}{N}\sum_{i=1}^{N}u_{\theta,i},\ \ N=72"],
    "s14_tau_derive": [r"\dfrac{dT}{dt}=\dfrac{\partial T}{\partial t}+\text{speed}\times\text{slope}"],
}
CALC_DROP = {"s08_ciaran": [r"=14.6\sin71^\circ\approx13.8", r"=14.6\cos71^\circ\approx4.8"]}
TOP = {
    "remake_2026_11_07": {
        "log": "movies/ch00/ch00_coordinates_moving/remake_2026-11-07_log.md",
        "brief": "master_plan_2026-11-07.md R1, R3, R16, R19, §C; continuity_plan.md §3 (5e), §5, §6, §7; fact_check_2026-11-07.md (all Part 5 rows OK); "
                 "series_audit_2026-11-07.md P5 + §3a; HOUSE_STYLE 2026-11-07 (no opening recap, natural openings, show the arithmetic / voice the meaning, "
                 "label numbers, say + highlight non-obvious inputs, word-timed reveals, no caption cue splits a number)",
        "cut": ["s02_part4_recap (no opening recap; its D/Dt, traveller's rate and i/j content recalled at s06, s14 and s08)"],
        "tools": ["checks/r7_text.py (narration)", "checks/r7_storyboard.py (this contract)", "checks/mv_r7_splice.py (--plan / --provisional / the splice)",
                  "checks/mv_final_timing.py (--final / --recue)", "checks/mv_words.py (Kokoro word times)", "checks/mv_mix.py + sound.yaml",
                  "checks/mv_run.py + label_stills_mv.mjs (frames / stills / render / join)", "checks/r7_heavy.sh (the queued heavy steps)",
                  "checks/r7_widths.mjs (right-edge check of the new texts)"],
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
    for sid, note in NOTES.items():
        v = by[sid].get("visual") or ""
        if TAG not in v:
            lines = _set_block(lines, sid, "visual", f"{v} {TAG} {note}".strip())
    for sid in set(CALC_ADD) | set(CALC_DROP):
        rows = list(by[sid].get("calc_rows") or [])
        rows = [r for r in rows if r not in CALC_DROP.get(sid, [])]
        rows += [r for r in CALC_ADD.get(sid, []) if r not in rows]
        lines = _set_block(lines, sid, "calc_rows", rows)
    for k, v in TOP.items():
        lines = set_top(lines, k, v)
    txt = "\n".join(lines)
    txt = txt.replace("  line1: Coordinates · Part 5\n  line2: Moving frames\n", "  line1: Coordinates\n  line2: Part 5 · Moving frames\n")
    txt = txt.replace("    style: passing-front (NEW style to add to tools/sound/styles.py)", "    style: passing-front (tools/sound/styles.py; cue sheet sound.yaml)")
    txt = txt.replace("  - 'teaser: In Part 6, we''ll find the shortest way round the Earth: great circles, and rhumb lines.'",
                      "  - 'teaser (remake 2026-11-07, two sentences): In Part 6, we''ll find the shortest way between two places on the round Earth: the great circle, "
                      "and the rhumb line that sailors steered for centuries. The great circle explains why flights from Europe to California pass over Greenland.'")
    txt = txt.replace("  - local frame i-hat, j-hat, k-hat; wind arrow bold v = u i + v j + w k\n",
                      "  - 'local frame i-hat, j-hat, k-hat; wind arrow bold v = u i + v j + w k (remake 2026-11-07: recalled at s08 S8, ''from Part 4: local east and north arrows'')'\n")
    SB.write_text(txt, encoding="utf-8")
    yaml.safe_load(SB.read_text(encoding="utf-8"))
    # the script README: the scene table and the measured-length lines describe the pre-remake build -> a remake summary in their place
    sp = MOV / "script.md"
    md = sp.read_text(encoding="utf-8")
    tm = json.loads((MOV / "timing.json").read_text(encoding="utf-8"))
    rows = ["| # | Scene | Length (s) | Sentences |", "|---|---|---|---|"]
    for i, s in enumerate(tm["scenes"]):
        rows.append(f"| {i} | {s['id']} | {s['end'] - s['start']:.1f} | {len(s['sentences'])} |")
    words = sum(len(x["text"].split()) for s in tm["scenes"] for x in s["sentences"])
    state = "PROVISIONAL (mv_r7_splice.py --provisional: re-used clips measured, new sentences estimated)" if tm.get("provisional") else "FINAL (spliced TTS)"
    block = ("### Remake 2026-11-07 (see remake_2026-11-07_log.md)\n\n"
             "**Title card:** Coordinates / Part 5 · Moving frames / storm-relative winds (series layout; no 'made easy').\n\n"
             f"**Scene list** (timing {state}):\n\n" + "\n".join(rows) + "\n\n"
             f"**Length:** {tm['total_s']:.2f} s narration + 2.5-s hold = {tm['total_s'] + 2.5:.2f} s; {words} words, "
             f"{words / ((tm['total_s'] + 2.5) / 60):.1f} wpm overall.\n\n"
             "**Changes:** s02_part4_recap cut (no opening recap); recalls at the point of use (s06 derivatives movie, s08 Part 1 bearings + Part 4 local "
             "arrows, s09 Part 1 u_r / u_θ, s10 vectors movie, s12 Part 1 ring averages, s14 derivatives movie + cross product movie); no spoken 'Step …'; "
             "no voiced arithmetic; s08 trig inputs said and highlighted; two-sentence teaser to Part 6; picture and music fade together.\n\n"
             "<!-- the pre-remake README below this line is kept for the record; its scene table and lengths are superseded -->\n\n")
    if "### Remake 2026-11-07" in md:
        md = re.sub(r"### Remake 2026-11-07.*?<!-- the pre-remake README below this line is kept for the record; its scene table and lengths are superseded -->\n\n",
                    lambda m: block, md, flags=re.S)
    else:
        md = md.replace("### README\n", "### README\n\n" + block, 1)
    sp.write_text(md, encoding="utf-8")
    print(f"storyboard: {len(NOTES)} visual notes, {len(set(CALC_ADD) | set(CALC_DROP))} calc_rows blocks, top keys {list(TOP)}; README remake block ({state})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
