"""Re-render only some 4000-frame chunks of ch00_weather_basics with tools/render_chunks.py's watchdog (fix loops).
usage: .venv/Scripts/python.exe tools/movie_wb/rerender_chunks.py <scratch with bundle/> <frames total> <i,j,k> [--port0 4800] [--concurrency 3]
Writes <scratch>/render/c<i>.mp4 for the listed chunks only; copy the unchanged ones from the previous render and join
with tools/movie_wb/join.py.
"""
import argparse
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools"))
import render_chunks as rc  # noqa: E402

ap = argparse.ArgumentParser()
ap.add_argument("scratch", type=Path)
ap.add_argument("frames", type=int)
ap.add_argument("chunks")
ap.add_argument("--port0", type=int, default=4800)
ap.add_argument("--chunk", type=int, default=4000)
ap.add_argument("--concurrency", type=int, default=3)
a0 = ap.parse_args()
a = argparse.Namespace(scratch=a0.scratch, comp="Ch00WeatherBasics", frames=a0.frames, audio=None, props=None, chunk=a0.chunk,
                       concurrency=a0.concurrency, port0=a0.port0, stall=150.0, out=None)
out_dir = a.scratch / "render"
out_dir.mkdir(parents=True, exist_ok=True)
for i in (int(x) for x in a0.chunks.split(",")):
    t0 = time.time()
    f0 = i * a.chunk
    rc.render_chunk(a, i, f0, min(f0 + a.chunk, a.frames) - 1, out_dir)
    print(f"chunk {i} wall {time.time() - t0:.0f} s", flush=True)
