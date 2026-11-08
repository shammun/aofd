"""ch00_coordinates_flat fix 3 (2026-11-08): the K6 frame plan for ONE new tag folder (screen-only fix: no re-voice, no timing change).

* The whole house K6 list (cf_run.k6_list: boundaries -5/0/+5, sentence start + 12, middle, end - 6, every sentence start -4 / +3,
  every 0.5 s through the DENSE scenes) on the unchanged timing.
* Every 1 s (30 frames) through every scene changed in fix 3 (s00, s01, s03, s04, s07, s14, s21-s25, s27).
* 10-fps strips (every 3 frames, -15..+18) round every CalcStack line change of the rows touched in fix 3 (s04 / s14 exitFirst,
  s07 "s =" rows, s23 inflow + ratio rows), and look frames on the review items' words (headings, s24 chips, s25 chart labels).
* Frames well inside the scenes NOT changed in fix 3 (interior: >= 15 frames from either boundary) and not in a strip / look list are
  COPIED from k6z3 (the fix-2 K6 folder, same timing and same code there); everything else is rendered.

usage: .venv/Scripts/python.exe cf_fix31108_frames.py <tag>   -> <S>/<tag>_render.txt, <S>/<tag>_copy.txt, <S>/<tag>_look.json
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
CHANGED = ["s00_title", "s01_hook", "s03_cartesian_arrows", "s04_polar", "s07_radians", "s14_rebuild_general", "s21_ian_polar",
           "s22_spin_inflow", "s23_what_numbers_mean", "s24_ring_points", "s25_why_polar_storm", "s27_recap"]
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
    every1s = set()
    for sid in CHANGED:
        k = IDS.index(sid)
        every1s.update(range(CUT[k] + 15, END[k], 30))
    slides = {
        "s04 θ line": word("s04_polar", 5, "The angle with that tangent"), "s04 (r,θ)": ss("s04_polar", 6),
        "s07 s=5km": word("s07_radians", 7, "the radius times the angle"), "s07 s=50km": word("s07_radians", 8, "fifty kilometres"),
        "s07 ratio": ss("s07_radians", 9),
        "s14 −8θ̂": ss("s14_rebuild_general", 3) + 10, "s14 u sum": ss("s14_rebuild_general", 4),
        "s14 |u|": word("s14_rebuild_general", 7, "six and minus eight"), "s14 |(10,0)|": word("s14_rebuild_general", 7, "wind's own length"),
        "s23 inflow": word("s23_what_numbers_mean", 6, "Converted"),
        "s23 25 km": word("s23_what_numbers_mean", 9, "twenty five kilometres"), "s23 t in": word("s23_what_numbers_mean", 9, "Time is distance"),
        "s23 2π": word("s23_what_numbers_mean", 10, "two pi times"), "s23 t lap": word("s23_what_numbers_mean", 10, "That takes"),
        "s23 ratio": word("s23_what_numbers_mean", 12, "In any stretch"), "s23 ratio 2": word("s23_what_numbers_mean", 12, "two point seven"),
    }
    strips = {a + d: f"strip {n} {d:+d}" for n, a in slides.items() for d in range(-15, 19, 3)}
    look = {}
    for sid, j, ph, d, why in [
        ("s00_title", 0, "how they're used", 20, "s00 heading + title over the thumbnail (fading in)"),
        ("s00_title", 0, "how they're used", 70, "s00 heading + title, map full"),
        ("s01_hook", 2, "x and y", 12, "s01 keyword 2 (list lifted)"), ("s01_hook", 2, "turned axes", 15, "s01 'turned axes' vs 'wind speed' (C6)"),
        ("s01_hook", 3, "hurricane", 20, "s01 heading + title over the lowered map"),
        ("s03_cartesian_arrows", 8, "hurricane", 20, "s03 thumbnail heading"),
        ("s04_polar", 5, "fifty three", 8, "s04 53.13 after the exitFirst slide"),
        ("s07_radians", 7, "one kilometre", 14, "s07 s = 5 km × 0.2 = 1 km"), ("s07_radians", 8, "ten kilometres", 14, "s07 s = 50 km × 0.2 = 10 km"),
        ("s14_rebuild_general", 4, "give ten", 14, "s14 u = (10, 0)"),
        ("s21_ian_polar", 2, "every three kilometres", 20, "s21 heading + bar title + 10-m / 3-km labels"),
        ("s21_ian_polar", 8, "angle theta", 20, "s21 (r, θ) under the heading row"),
        ("s22_spin_inflow", 3, "twenty five kilometres", 30, "s22 heading + bar title"),
        ("s22_spin_inflow", 13, "two hundred and fifty", 14, "s22 knots chain under the heading row"),
        ("s23_what_numbers_mean", 6, "three point six", 10, "s23 inflow = 13 m/s × 3.6 (gold)"), ("s23_what_numbers_mean", 6, "forty seven", 14, "s23 ≈ 47 km/h"),
        ("s23_what_numbers_mean", 12, "two point seven", 14, "s23 ratio row gap"), ("s23_what_numbers_mean", 12, "almost three", 14, "s23 'almost 3 m' 24 px lower"),
        ("s24_ring_points", 8, "minus eight point seven", 14, "s24 0° u_r chip"), ("s24_ring_points", 9, "thirty eight", 14, "s24 0° u_θ chip off the v line"),
        ("s24_ring_points", 14, "minus thirty seven point four", 14, "s24 90° u_r chip"), ("s24_ring_points", 15, "plus sixteen point nine", 14, "s24 90° u_θ chip"),
        ("s24_ring_points", 20, "minus twenty four", 14, "s24 135° u_r chip"), ("s24_ring_points", 22, "thirty eight point six", 14, "s24 135° u_θ chip"),
        ("s24_ring_points", 23, "seven of them", 30, "s24 eight values, thin halo, light teal"), ("s24_ring_points", 23, "two hundred and twenty five", 14, "s24 eight values"),
        ("s25_why_polar_storm", 0, "", 40, "s25 shared title + two event headings"),
        ("s25_why_polar_storm", 9, "average of thirty five", 14, "s25 'mean 35' lifted"), ("s25_why_polar_storm", 10, "plus fourteen", 14, "s25 '+14' leader"),
        ("s25_why_polar_storm", 11, "blow outward", 14, "s25 '14 points out' in the free band"), ("s25_why_polar_storm", 11, "fifty eight", 14, "s25 keyword 72 − 14"),
        ("s25_why_polar_storm", 14, "Wind blowing across the shore", 20, "s25 coast axes on the shorter map"),
        ("s27_recap", 9, "", 20, "s27 mini-map heading + bar title"),
    ]:
        look[(ss(sid, j) if not ph else word(sid, j, ph)) + d] = why
    allf = k6 | every1s | set(strips) | set(look)
    copy, render = [], []
    for f in sorted(allf):
        k = max(i for i, c in enumerate(CUT) if c <= f)
        interior = CUT[k] + 15 <= f < END[k] - 15
        (copy if IDS[k] not in CHANGED and interior and f in k6 and f not in strips and f not in look else render).append(f)
    S = cf_run.S
    (S / f"{tag}_render.txt").write_text(",".join(map(str, render)))
    (S / f"{tag}_copy.txt").write_text(",".join(map(str, copy)))
    (S / f"{tag}_look.json").write_text(json.dumps({str(k): v for k, v in sorted({**strips, **look}.items())}, indent=0, ensure_ascii=False),
                                         encoding="utf-8")
    print(f"K6 {len(k6)} + every 1 s of the changed scenes {len(every1s)} + strips {len(strips)} + look {len(look)} = {len(allf)} frames: "
          f"render {len(render)}, copy from k6z3 {len(copy)}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "k6z4")
