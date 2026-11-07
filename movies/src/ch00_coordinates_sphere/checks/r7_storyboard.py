"""ch00_coordinates_sphere (#5c, Part 3) remake 2026-11-07: bring storyboard.yaml in line with the new script.md (master plan R1, R3,
R16, R19; continuity plan §3 / §5 / §6 / §7 for 5c; fact-check rows 5 and 6).

* scenes: s02_part2_recap cut (user 2026-11-07: no opening recap); every voiceover = its script.md paragraph;
* s00 visual: the series title layout (no "made easy"); s06 visual: the full list of countries on Brest's parallel; the changed scenes get
  a `recalls` list (equation + "derived/defined in Part K: <name>") and a `remake_2026_11_07` note; s35 beat / visual (numbers, teaser);
* a top-level remake_2026_11_07 block (R-item -> scenes); fact-check row 6 in the header of s19.
t / sentence_times / chapter marks / skip blocks are refilled by make_timing.py --final from the measured TTS. Idempotent.
usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_sphere/checks/r7_storyboard.py
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

import yaml

sys.path.insert(0, str(Path(__file__).parent))
from revoice import _set_block  # noqa: E402

ROOT = Path(__file__).resolve().parents[4]
MOV = ROOT / "movies/ch00/ch00_coordinates_sphere"
SBP = MOV / "storyboard.yaml"


def script_paragraphs() -> dict[str, str]:
    out, cur = {}, None
    for ln in (MOV / "script.md").read_text(encoding="utf-8").split("\n"):
        m = re.match(r"^## (s\d\d_\w+)\s*$", ln)
        if m:
            cur = m.group(1)
            continue
        if cur and ln.strip() and not ln.startswith(">") and cur not in out:
            out[cur] = ln.strip()
    return out


POLAR = r"x=r\cos\theta,\ \ y=r\sin\theta"
ARC = r"s=r\,\theta\quad(\theta\ \text{in radians})"
RECALLS = {
    "s08_sin_cos_swap": [{"at": "S8 'From Part 1, the side next to an angle'", "latex": POLAR, "keyword": "derived in Part 1: polar coordinates"}],
    "s11_longitude": [{"at": "S7-S9 'the same way the angle theta turned in Part 1'", "latex": r"\theta\ \text{anticlockwise from east}", "keyword": "defined in Part 1: polar angle"}],
    "s16_brest_axis_distance": [{"at": "S7 (new) 'the same two lengths as in Part 2's cylindrical coordinates'", "latex": r"(r,\ \theta,\ z)", "keyword": "defined in Part 2: cylindrical coordinates"}],
    "s17_brest_top": [{"at": "S6 'That's polar coordinates on a flat face, exactly as in Part 1'", "latex": POLAR, "keyword": "derived in Part 1: polar coordinates"}],
    "s18_position_vector": [{"at": "S12 'We call it r hat, just as in Part 1'", "latex": r"\hat{\mathbf r}=\dfrac{(r\cos\theta,\ r\sin\theta)}{r}=(\cos\theta,\ \sin\theta)", "keyword": "derived in Part 1: unit vector"}],
    "s20_spin_rate": [{"at": "S21 'It's Part 2's rule for a ring again'", "latex": r"v=r\,\dfrac{d\theta}{dt}", "keyword": "derived in Part 2: angle rate on a ring"}],
    "s22_distance_north": [{"at": "S7 'by the arc length rule from Part 1'", "latex": ARC, "keyword": "derived in Part 1: arc length"}],
    "s24_distance_east": [{"at": "S6 'by the same arc length rule'", "latex": ARC, "keyword": "derived in Part 1: arc length"}],
    "s30_slope_of_sine": [{"at": "S1-S5 'But Part 2 gave us a shortcut'", "latex": r"\dfrac{d}{d\theta}\sin\theta=\cos\theta", "keyword": "derived in Part 2: slope of sine"}],
}
NOTES = {
    "s00_title": "R1/R2: series title layout (kit_cs/SeriesTitle.tsx = Parts 1-2): 'Coordinates' 150 px gradient, pulsing on AT(0,'coordinates'); "
                 "'Part 3 · Our round Earth'; subtitle 'latitude, longitude, / distances and areas'. No 'made easy'.",
    "s06_parallel": "fact-check row 5: the parallel's full list (central Europe, Ukraine, southern Russia, Kazakhstan, far west of China, Mongolia, "
                    "north-east China, Russia's Far East; the Pacific, Vancouver Island, northern United States, eastern Canada, the Atlantic); "
                    "13 labels on their words, the added ones at the middle of their Natural Earth crossing segment (cs.json par48.seg).",
    "s16_brest_axis_distance": "R16: new S7 recalls Part 2's cylindrical coordinates (a distance from an axis, a height along it), this time round the Earth's axis.",
    "s18_position_vector": "R16: S12 names Part 1 for r hat (re-voiced).",
    "s19_khulna": "fact-check row 6: 'much farther east and south, in South Asia'; Amphan's centre passed about 79 km to Khulna's west (Part 2 cs.json "
                  "amphan.close.Khulna.km = 79.4, IBTrACS v04r01 NI); keywords 'Amphan's centre:' / '≈ 79 km to the west'. Later sentences +1.",
    "s35_recap": "R3: S10 with 'about seventy four kilometres per degree at Brest'; new S13 ERA5 Sep 2026 plain 7.1 -> weighted 16.3 °C (bars + source "
                 "line); S14-S15 two-sentence teaser to Part 4 (a station's own east, north and up arrows; they turn as the air moves; extra terms in "
                 "how the wind changes). The end card (s36) follows; picture and music fade together over the 2.5-s hold.",
    "s36_end": "R3: the end card's picture fades out over the 75-frame hold, with the music's 2.5-s tail (tools/sound/mix.py tail_s 2.5).",
}


def main() -> int:
    txt = SBP.read_text(encoding="utf-8")
    lines = txt.split("\n")
    if "- id: s02_part2_recap" in lines:
        i0 = lines.index("- id: s02_part2_recap")
        i1 = lines.index("- id: s03_sphere")
        lines = lines[:i0] + lines[i1:]
    paras = script_paragraphs()
    sb = yaml.safe_load("\n".join(lines))
    ids = [s["id"] for s in sb["scenes"]]
    if ids != list(paras):
        print("FAIL scene ids differ:", ids, list(paras))
        return 1
    for sid in ids:
        lines = _set_block(lines, sid, "voiceover", paras[sid])
    for sid, rc in RECALLS.items():
        blk = yaml.safe_load("\n".join(lines))
        sc = next(s for s in blk["scenes"] if s["id"] == sid)
        if "recalls" in sc:
            lines = _set_block(lines, sid, "recalls", rc)
        else:
            i = lines.index(f"- id: {sid}")
            ins = ["  " + ln for ln in yaml.safe_dump({"recalls": rc}, width=150, sort_keys=False, allow_unicode=True).rstrip("\n").split("\n")]
            lines = lines[:i + 1] + ins + lines[i + 1:]
    for sid, note in NOTES.items():
        blk = yaml.safe_load("\n".join(lines))
        sc = next(s for s in blk["scenes"] if s["id"] == sid)
        if "remake_2026_11_07" in sc:
            lines = _set_block(lines, sid, "remake_2026_11_07", note)
        else:
            i = lines.index(f"- id: {sid}")
            ins = ["  " + ln for ln in yaml.safe_dump({"remake_2026_11_07": note}, width=150, sort_keys=False, allow_unicode=True).rstrip("\n").split("\n")]
            lines = lines[:i + 1] + ins + lines[i + 1:]
    txt = "\n".join(lines)
    # s00 visual: the old 'made easy' description goes (R1)
    txt = re.sub(r"''Coordinates · Part 3'' \(68 px, warm white\); the title ''Our round\s+Earth'' as RiseText.*?the subtitle ''latitude, longitude, distances\s+and areas'' \(68 px, warm white, one or two lines\);",
                 "the series title (kit_cs/SeriesTitle.tsx, as Parts 1-2): ''Coordinates'' RiseText 150 px weight 800 TitleGradient teal -> gold, pulsing x1.06 on "
                 "AT(0,''coordinates''); ''Part 3 · Our round Earth'' 80 px warm white; the subtitle ''latitude, longitude, / distances and areas'' (68 px, warm white); "
                 "no ''made easy'' (R1);", txt, flags=re.S)
    txt = re.sub(r"labels ''central Europe'',\s+''Ukraine'',\s+''Kazakhstan'',\s+''Mongolia'',\s+''United States'',\s+''Canada'',\s+''Atlantic'' on their words", lambda m: "labels ''central Europe'', ''Ukraine'', ''Russia'', ''Kazakhstan'', ''China'', ''Mongolia'', ''China'', ''Russia'', ''Pacific'', "
                      "''Vancouver Island'', ''United States'', ''Canada'', ''Atlantic'' on their words (fact-check row 5)", txt)
    top = {"remake_2026_11_07": {
        "brief": "movies/ch00/coordinates_series/master_plan_2026-11-07.md (R1, R3, R16, R19, §C); continuity_plan.md §3/§5/§6/§7 (5c); fact_check_2026-11-07.md rows 5, 6",
        "R1": "s00 series title layout, no 'made easy'",
        "C2_no_opening_recap": "s02_part2_recap cut; its facts recalled at the point of use (R16)",
        "R16": "recalls in s08, s11, s16 (voiced S7), s17, s18 (S12 re-voiced), s20, s22, s24, s30 (see each scene's `recalls`)",
        "R19": "s06 Brest parallel list (row 5); s19 Khulna wording (row 6)",
        "R3": "s35: recap with numbers (S10 74 km per degree at Brest; S13 ERA5 7.1 -> 16.3 °C), two-sentence teaser (S14-S15); s36 picture fades with the music",
    }}
    blk = "\n".join(yaml.safe_dump(top, width=150, sort_keys=False, allow_unicode=True).rstrip("\n").split("\n"))
    if "\nremake_2026_11_07:" in txt:
        txt = re.sub(r"\nremake_2026_11_07:\n(?:  .*\n)+", "\n" + blk + "\n", txt)
    else:
        txt = txt.replace("\nscenes:\n", "\n" + blk + "\nscenes:\n", 1)
    SBP.write_text(txt, encoding="utf-8")
    sb = yaml.safe_load(SBP.read_text(encoding="utf-8"))
    print(f"storyboard: {len(sb['scenes'])} scenes; s02 present: {any(s['id'] == 's02_part2_recap' for s in sb['scenes'])}; "
          f"made easy left: {'made easy' in SBP.read_text(encoding='utf-8')}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
