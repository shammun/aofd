"""UF2 full render of ch00_weather_basics: 4000-frame chunks with the house watchdog (tools/render_chunks.render_chunk),
concurrency 2, ports 5600 + chunk index (5600-5700), ANGLE GL (remotion.config.ts), bundle G:/…/uf2/bundle.
Stops (exit 3) if C: drops below 45 GB free. Chunks land in G:/…/uf2/render/c<i>.mp4; join with tools/movie_wb/join.py.
usage: .venv/Scripts/python.exe tools/movie_wb/render_uf2.py [--from 0] [--only i,j]
"""
import argparse
import json
import shutil
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools"))
import render_chunks as rc  # noqa: E402

SCR = Path("G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_weather_basics/uf2")
# Remotion's frame cache and Chrome profiles go to G: (the first try filled C: by ~12 GB during a chunk)
import os  # noqa: E402
(SCR / "tmp").mkdir(parents=True, exist_ok=True)
os.environ["TEMP"] = os.environ["TMP"] = str(SCR / "tmp")
ap = argparse.ArgumentParser()
ap.add_argument("--from", dest="start", type=int, default=0)
ap.add_argument("--only")
a0 = ap.parse_args()
tm = json.loads((ROOT / "movies/ch00/ch00_weather_basics/timing.json").read_text(encoding="utf-8"))
frames = tm["total_frames"] + 75
a = argparse.Namespace(scratch=SCR, comp="Ch00WeatherBasics", frames=frames, audio=None, props=None, chunk=4000, concurrency=2, port0=5600, stall=240.0, out=None)
out = SCR / "render"
out.mkdir(parents=True, exist_ok=True)
n = (frames + a.chunk - 1) // a.chunk
todo = [int(x) for x in a0.only.split(",")] if a0.only else range(a0.start, n)
print(f"{frames} frames, {n} chunks", flush=True)
T0 = time.time()
for i in todo:
    free = shutil.disk_usage("C:/").free / 1e9
    if free < 45:
        print(f"STOP: C: {free:.1f} GB free < 45", flush=True)
        sys.exit(3)
    t0 = time.time()
    f0 = i * a.chunk
    rc.render_chunk(a, i, f0, min(f0 + a.chunk, frames) - 1, out)
    print(f"chunk {i} {f0}-{min(f0 + a.chunk, frames) - 1} {time.time() - t0:.0f} s; C: {shutil.disk_usage('C:/').free / 1e9:.1f} GB", flush=True)
print(f"DONE {time.time() - T0:.0f} s", flush=True)
