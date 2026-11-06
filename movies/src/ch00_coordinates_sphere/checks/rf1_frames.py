"""fix loop 1 (#5c): the K6 frame list (cs_run.py frames) plus a still at every changed moment -> <S>/k6f1_frames.txt; the changed
moments alone -> <S>/rf1_look.txt (frame, label) for looking. Moment = (scene, sentence, where): where = 'mid' | 'end' (0.3 s before the
end) | 'start' (+0.5 s) | a float fraction."""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
S = Path("G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_sphere/build1")
T = json.loads((ROOT / "movies/ch00/ch00_coordinates_sphere/timing.json").read_text(encoding="utf-8"))
BY = {s["id"]: s for s in T["scenes"]}
M = [("s02_part2_recap", 1, "mid"), ("s02_part2_recap", 8, "end"), ("s05_latitude", 2, "end"), ("s06_parallel", 2, "mid"), ("s08_sin_cos_swap", 12, "end"),
     ("s08_sin_cos_swap", 15, "end"), ("s09_meridians", 7, "end"), ("s10_prime_meridian", 12, "mid"), ("s11_longitude", 4, "mid"), ("s11_longitude", 5, "end"),
     ("s11_longitude", 9, "end"), ("s12_graticule", 2, "end"), ("s13_earth_axes", 10, "end"), ("s15_brest_z", 2, "mid"), ("s15_brest_z", 11, "end"),
     ("s16_brest_axis_distance", 1, "mid"), ("s17_brest_top", 5, "mid"), ("s17_brest_top", 12, "end"), ("s18_position_vector", 1, "mid"), ("s18_position_vector", 2, "mid"),
     ("s18_position_vector", 7, "end"), ("s18_position_vector", 8, "end"), ("s18_position_vector", 14, "end"), ("s19_khulna", 4, "end"), ("s19_khulna", 9, "end"),
     ("s20_spin_rate", 9, "end"), ("s20_spin_rate", 11, "end"), ("s20_spin_rate", 15, "mid"), ("s20_spin_rate", 17, "mid"), ("s21_ground_speeds", 0, "mid"),
     ("s21_ground_speeds", 6, "end"), ("s21_ground_speeds", 8, "end"), ("s21_ground_speeds", 10, "end"), ("s21_ground_speeds", 11, "end"), ("s21_ground_speeds", 12, "end"),
     ("s21_ground_speeds", 13, "end"), ("s21_ground_speeds", 16, "end"), ("s21_ground_speeds", 17, "mid"), ("s22_distance_north", 1, "mid"), ("s22_distance_north", 8, "end"),
     ("s22_distance_north", 10, "end"), ("s23_north_examples", 5, "end"), ("s25_degree_east", 0, "mid"), ("s26_grid_boxes", 5, "end"), ("s26_grid_boxes", 14, "end"),
     ("s27_area_patch", 7, "end"), ("s27_area_patch", 11, "mid"), ("s28_box_areas", 0, "mid"), ("s28_box_areas", 3, "end"), ("s29_strip_round", 5, "end"),
     ("s32_band_fraction", 10, "end"), ("s33_archimedes", 9, "end"), ("s33_archimedes", 10, "end"), ("s34_global_mean", 1, "mid"), ("s34_global_mean", 2, "start"),
     ("s34_global_mean", 2, "end"), ("s34_global_mean", 3, "start"), ("s34_global_mean", 3, "mid"), ("s34_global_mean", 4, "end"), ("s34_global_mean", 5, "end"),
     ("s34_global_mean", 7, "end"), ("s34_global_mean", 10, "end"), ("s34_global_mean", 13, "end"), ("s34_global_mean", 17, "end"), ("s35_recap", 7, "end"),
     ("s35_recap", 12, "mid"), ("s35_recap", 6, "mid")]


def frame(sid: str, j: int, w) -> int:
    s = BY[sid]["sentences"][j]
    t = {"mid": (s["start"] + s["end"]) / 2, "end": s["end"] - 0.3, "start": s["start"] + 0.5}.get(w) if isinstance(w, str) else s["start"] + w * (s["end"] - s["start"])
    return round(t * 30)


def main() -> int:
    look = [(frame(*m), f"{m[0]} S{m[1]} {m[2]}") for m in M]
    (S / "rf1_look.txt").write_text("\n".join(f"{f}\t{t}" for f, t in look), encoding="utf-8")
    subprocess.run([sys.executable, str(ROOT / "movies/src/ch00_coordinates_sphere/checks/cs_run.py"), "frames"], check=True)
    k6 = [int(x) for x in (S / "k6_frames.txt").read_text().split(",") if x.strip()]
    allf = sorted(set(k6) | {f for f, _ in look})
    (S / "k6f1_frames.txt").write_text(",".join(map(str, allf)))
    print(f"{len(k6)} K6 frames + {len(look)} changed moments -> {len(allf)} frames in k6f1_frames.txt")
    return 0


if __name__ == "__main__":
    sys.exit(main())
