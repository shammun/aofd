"""ch00_coordinates_flat fix 2 (2026-11-07): the K6 frame plan for one NEW tag folder.

* The house K6 list (cf_run.k6_list) on the final timing.
* Frames well inside the scenes whose code AND anchors did not change in fix 2 (s13, s15, s16, s18, s20: word-timed since fix 1, not
  edited) are COPIED from k6y1 (same frame numbers: every change is before them in code only, and the re-voice is after them).
  Everything else (the edited scenes, the scenes whose AT() moved from character share to Kokoro word times, every boundary
  cross-fade, everything after the s23 re-voice) is rendered.
* 10-fps strips (every 3 frames, -15..+18) round every CalcStack line change in s04, s07, s14, s17, s19 and s23 (review 1 Should 2:
  no outgoing row over the line above), and look frames on the review items' words.

usage: .venv/Scripts/python.exe cf_fix21107_frames.py <tag>   -> <S>/<tag>_render.txt, <S>/<tag>_copy.txt, <S>/<tag>_look.json
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import cf_run  # noqa: E402

R = HERE.parents[3]
M = R / "movies/ch00/ch00_coordinates_flat"
T = json.loads((M / "timing.json").read_text(encoding="utf-8"))
W = json.loads((M / "words.json").read_text(encoding="utf-8"))["scenes"]
FPS = 30
IDS = [s["id"] for s in T["scenes"]]
sc = {s["id"]: s for s in T["scenes"]}
CUT = [0 if i == 0 else round(s["start"] * FPS) for i, s in enumerate(T["scenes"])]
END = CUT[1:] + [T["total_frames"] + 75]
UNCHANGED = ["s13_components", "s15_turn_axes", "s16_y_prime", "s18_matrix", "s20_polar_is_turned"]
norm = lambda x: re.sub(r"[^a-z0-9']", "", x.lower())  # noqa: E731


def word(sid: str, j: int, phrase: str) -> int:
    """absolute frame of the phrase (Kokoro word time, as AT() in cf_lib.tsx)"""
    s = sc[sid]["sentences"][j]
    e = W[sid][str(j)]
    assert e["text"] == s["text"], (sid, j)
    toks = [(t, norm(x)) for t, x in e["w"] if norm(x)]
    ph = [norm(x) for x in phrase.split() if norm(x)]
    for i in range(len(toks) - len(ph) + 1):
        if all(toks[i + q][1] == ph[q] for q in range(len(ph))):
            return round((s["start"] + toks[i][0]) * FPS)
    raise SystemExit(f"no '{phrase}' in {sid} S{j + 1}")


def ss(sid: str, j: int) -> int:
    return round(sc[sid]["sentences"][j]["start"] * FPS)


def main(tag: str) -> None:
    k6 = set(cf_run.k6_list())
    # line changes (the `at` of every new CalcStack line that pushes one out) -> 10-fps strips
    slides = {
        "s04 θ line": word("s04_polar", 5, "The angle with that tangent"), "s04 (r,θ)": ss("s04_polar", 6),
        "s07 ratio": ss("s07_radians", 9),
        "s14 −8θ̂": ss("s14_rebuild_general", 3) + 10, "s14 sum": ss("s14_rebuild_general", 4),
        "s14 |u|": word("s14_rebuild_general", 7, "six and minus eight"), "s14 |(10,0)|": word("s14_rebuild_general", 7, "wind's own length"),
        "s17 length": ss("s17_new_components", 13),
        "s23 25 km": word("s23_what_numbers_mean", 9, "twenty five kilometres"), "s23 t in": word("s23_what_numbers_mean", 9, "Time is distance"),
        "s23 2π": word("s23_what_numbers_mean", 10, "two pi times"), "s23 t lap": word("s23_what_numbers_mean", 10, "That takes"),
        "s23 ratio": word("s23_what_numbers_mean", 12, "In any stretch"),
    }
    strips = {a + d: f"strip {n} {d:+d}" for n, a in slides.items() for d in range(-15, 19, 3)}
    look = {}
    for sid, j, ph, d, why in [
        ("s00_title", 0, "how they're used", 20, "s00 title: 'and turned axes'"),
        ("s01_hook", 2, "x and y", 12, "s01 S3 keyword 1"), ("s01_hook", 2, "turned axes", 15, "s01 S3 three keywords"),
        ("s04_polar", 5, "fifty three", 8, "s04 53.13 on its word"),
        ("s07_radians", 7, "the radius times the angle", 8, "s07 5 km × 0.2 before = 1 km"), ("s07_radians", 8, "fifty kilometres", 10, "s07 50 km × 0.2 before = 10 km"),
        ("s07_radians", 8, "ten kilometres", 14, "s07 = 10 km + label on the word"),
        ("s14_rebuild_general", 1, "We rebuild it", 14, "s14 rule row"), ("s14_rebuild_general", 7, "add them", 14, "s14 |u| = sqrt(6^2+(-8)^2)"),
        ("s17_new_components", 13, "add them", 10, "s17 length rows after the slide"),
        ("s19_index_form", 8, "C one one", 10, "s19 C11 before 'which is'"), ("s19_index_form", 8, "which is", 14, "s19 C11 on 'which is'"),
        ("s21_ian_polar", 2, "every three kilometres", 20, "s21 10-m / 3-km labels"),
        ("s22_spin_inflow", 6, "three point six", 10, "s22 m/s × 3.6 gold"), ("s22_spin_inflow", 6, "a thousand metres", 14, "s22 1 m/s = 3600 m/h = 3.6 km/h"),
        ("s22_spin_inflow", 7, "So thirty five", 8, "s22 35 m/s × 3.6 before = 126"), ("s22_spin_inflow", 7, "a hundred and twenty six", 14, "s22 = 126 km/h"),
        ("s22_spin_inflow", 13, "one point eight five", 10, "s22 × 1.85 km/h per kt gold"), ("s22_spin_inflow", 13, "two hundred and fifty", 14, "s22 ≈ 250 km/h"),
        ("s22_spin_inflow", 13, "sixty nine", 14, "s22 ÷ 3.6 ≈ 69"),
        ("s23_what_numbers_mean", 4, "By Pythagoras", 14, "s23 wind speed ="), ("s23_what_numbers_mean", 6, "three point six", 10, "s23 13 m/s × 3.6 gold"),
        ("s23_what_numbers_mean", 6, "forty seven", 14, "s23 ≈ 47 km/h"), ("s23_what_numbers_mean", 9, "Time is distance", 14, "s23 t = distance ÷ speed"),
        ("s23_what_numbers_mean", 9, "so that takes", 14, "s23 fraction before 1923"), ("s23_what_numbers_mean", 10, "one lap", 10, "s23 clock reset 0 min"),
        ("s23_what_numbers_mean", 10, "seventy five minutes", 25, "s23 clock 75"), ("s23_what_numbers_mean", 12, "two point seven", 14, "s23 2.7 (re-voiced S13)"),
        ("s24_ring_points", 6, "minus eight point seven", 8, "s24 0° u gold"), ("s24_ring_points", 8, "minus eight point seven", 14, "s24 0° map u_r on its word"),
        ("s24_ring_points", 17, "minus forty four point five", 8, "s24 135° v gold"),
        ("s24_ring_points", 18, "about minus zero point seven zero seven", 10, "s24 cos 135 gold"), ("s24_ring_points", 18, "plus zero point seven zero seven", 10, "s24 sin 135 gold"),
        ("s25_why_polar_storm", 11, "fifty eight", 14, "s25 72 − 14 out = 58"), ("s26_inflow_angle", 3, "thirteen point three over", 14, "s26 fraction only"),
        ("s26_inflow_angle", 3, "zero point three eight", 14, "s26 ≈ 0.38"),
    ]:
        look[word(sid, j, ph) + d] = why
    allf = k6 | set(strips) | set(look)
    copy, render = [], []
    for f in sorted(allf):
        k = max(i for i, c in enumerate(CUT) if c <= f)
        (copy if IDS[k] in UNCHANGED and CUT[k] + 15 <= f < END[k] - 15 and f in k6 and f not in strips and f not in look else render).append(f)
    S = cf_run.S
    (S / f"{tag}_render.txt").write_text(",".join(map(str, render)))
    (S / f"{tag}_copy.txt").write_text(",".join(map(str, copy)))
    (S / f"{tag}_look.json").write_text(json.dumps({str(k): v for k, v in sorted({**strips, **look}.items())}, indent=0, ensure_ascii=False),
                                         encoding="utf-8")
    print(f"K6 {len(k6)} + strips {len(strips)} + look {len(look)} = {len(allf)} frames: render {len(render)}, copy from k6y1 {len(copy)}")


if __name__ == "__main__":
    main(sys.argv[1])
