"""UF2 stills + K6 boxes for ch00_weather_basics: 3 frames per scene (after the fade-in, the middle, before the end) plus
extras (every sentence start of the zoom / stack / rebuilt scenes), rendered with the composition prop `bbox: true` (the
house BoxProbe logs text boxes, shapes and the K1/K2/K5 masks) by tools/movie_wb/label_stills.mjs on ports 5600-5700.

usage: .venv/Scripts/python.exe tools/movie_wb/stills_uf2.py TAG [--only s20e_tangent,s27c_vapour_stack] [--extras] [--jobs 3] [--bundle]
       [--frames 123,456] [--scale 0.5]
Writes G:/…/ch00_weather_basics/uf2/stills/TAG/{f*.jpg, b*.json}; --bundle rebuilds G:/…/uf2/bundle (after code changes).
"""
from __future__ import annotations

import argparse
import json
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MOVIES = ROOT / "movies"
SCR = Path("G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_weather_basics/uf2")
TOOLS = MOVIES / "out/ch00/ch00_weather_basics/_tools"
FPS = 30
EXTRA = {"s01_hook", "s02_thin_shell", "s03_air_parcel", "s15_hydrostatic", "s18_scale_height", "s18b_scale_height_number", "s20_exponential_meaning",
         "s20e_tangent", "s20f_not_a_lid", "s20g_uniform_block", "s20b_per_km", "s21_balloon_pressure", "s22_mass_below", "s27b_vapour_pressure",
         "s27c_vapour_stack", "s31_cloud_base", "s36_weather_climate", "s38b_reanalysis_stack", "s48b_front_stack", "s53_trades_westerlies", "s60_recap"}


def frames(only: set[str] | None, extras: bool) -> list[int]:
    tm = json.loads((MOVIES / "ch00/ch00_weather_basics/timing.json").read_text(encoding="utf-8"))
    out = set()
    for i, s in enumerate(tm["scenes"]):
        if only and s["id"] not in only:
            continue
        a = 0 if i == 0 else round(s["start"] * FPS)
        b = round(tm["scenes"][i + 1]["start"] * FPS) if i + 1 < len(tm["scenes"]) else tm["total_frames"]
        out.update({a + 20, (a + b) // 2, b - 8})
        if extras and s["id"] in EXTRA:
            out.update(round(x["end"] * FPS) - 6 for x in s["sentences"])
    return sorted(out)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("tag")
    ap.add_argument("--only")
    ap.add_argument("--extras", action="store_true")
    ap.add_argument("--jobs", type=int, default=3)
    ap.add_argument("--bundle", action="store_true")
    ap.add_argument("--frames")
    ap.add_argument("--scale", default="0.5")
    ap.add_argument("--port0", type=int, default=5600)
    ap.add_argument("--bdir", default="bundle", help="bundle folder name under uf2/ (a render may be using uf2/bundle)")
    a = ap.parse_args()
    TOOLS.mkdir(parents=True, exist_ok=True)
    shutil.copy(ROOT / "tools/movie_wb/label_stills.mjs", TOOLS / "label_stills.mjs")
    bdir = SCR / a.bdir
    if a.bundle or not bdir.exists():
        if bdir.exists():
            shutil.rmtree(bdir)
        r = subprocess.run(["node", str(TOOLS / "label_stills.mjs"), "--bundle", str(SCR / "public"), str(SCR / "stills" / "_b"), "-", "--bundle-out", str(bdir), "--bundle-only"],
                           cwd=MOVIES, capture_output=True, text=True)
        print(r.stdout[-800:], r.stderr[-1500:])
    fr = [int(x) for x in a.frames.split(",")] if a.frames else frames(set(a.only.split(",")) if a.only else None, a.extras)
    out = SCR / "stills" / a.tag
    out.mkdir(parents=True, exist_ok=True)
    print(len(fr), "frames ->", out)
    chunks = [fr[i::a.jobs] for i in range(a.jobs)]
    procs = []
    for i, ch in enumerate(chunks):
        if not ch:
            continue
        ff = out / f"frames_{i}.txt"
        ff.write_text(",".join(map(str, ch)))
        log = open(out / f"log_{i}.txt", "w")
        procs.append(subprocess.Popen(["node", str(TOOLS / "label_stills.mjs"), str(bdir), str(SCR / "public"), str(out), str(ff), "--port", str(a.port0 + 30 * i),
                                       "--scale", a.scale, "--force"], cwd=MOVIES, stdout=log, stderr=subprocess.STDOUT))
    for p in procs:
        p.wait()
    print("done", len(list(out.glob("f*.jpg"))), "stills")


if __name__ == "__main__":
    main()
