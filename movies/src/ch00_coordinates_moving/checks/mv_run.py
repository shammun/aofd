"""Run driver for ch00_coordinates_moving (#5e, Part 5; remake 2026-11-07, = Part 4 checks/mv_run.py): K6 frame list, review/K6 stills, chunked full render with a refuse-partial
join, QA — the weather-basics UF2 recipe (tools/movie_wb/{k6_fix3_frames,stills_uf2,render_uf2,join2pass}.py) for this movie.
Every Remotion / Chrome step sets TEMP and TMP to G: and stops if C: has less than 45 GB free. Run ONE heavy step at a time,
and only when no other Remotion, Chrome or sound-mix job is running on the machine.

usage (repo root, main venv):
  .venv/Scripts/python.exe movies/src/ch00_coordinates_moving/checks/mv_run.py frames            # K6 frame list -> <S>/k6_frames.txt
  .venv/Scripts/python.exe movies/src/ch00_coordinates_moving/checks/mv_run.py stills TAG [--bundle] [--frames-file F] [--jobs 3]
  .venv/Scripts/python.exe movies/src/ch00_coordinates_moving/checks/mv_run.py render [--from 0] [--only 3,7] [--conc 2]
  .venv/Scripts/python.exe movies/src/ch00_coordinates_moving/checks/mv_run.py join [--mb 150]  # refuses unless every chunk is complete
S = G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_moving/build1
"""
from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
MOVIES = ROOT / "movies"
S = Path("G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_moving/build1")
TIMING = MOVIES / "ch00/ch00_coordinates_moving/timing.json"
COMP, FPS, HOLD, CHUNK = "Ch00CoordinatesMoving", 30, 75, 4000
DENSE = {"s00_title", "s01_hook", "s06_parcel_accel", "s07_sliding_pattern", "s08_ciaran", "s09_lopsided", "s10_storm_relative", "s12_invariant",
         "s14_tau_derive", "s15_plymouth", "s16_meaning", "s17_recap", "s18_end"}   # the remake's changed scenes + maps that move: every 0.5 s
sys.path.insert(0, str(ROOT / "tools"))


def guard(min_gb: float = 45.0) -> None:
    free = shutil.disk_usage("C:/").free / 1e9
    if free < min_gb:
        sys.exit(f"STOP: C: {free:.1f} GB free < {min_gb}")
    gfree = shutil.disk_usage("G:/").free / 1e9
    if gfree < 50:
        sys.exit(f"STOP: G: {gfree:.1f} GB free < 50")
    (S / "tmp").mkdir(parents=True, exist_ok=True)
    os.environ["TEMP"] = os.environ["TMP"] = str(S / "tmp")


def total_frames() -> int:
    return json.loads(TIMING.read_text(encoding="utf-8"))["total_frames"] + HOLD


def k6_list() -> list[int]:
    """K6 frames: the house list (scene boundaries −5/0/+5, sentence start + 12, middle, end − 6) + every sentence start −4 and +3
    (mid-swap frames, weather UF2 fix 3 lesson) + every 0.5 s through the DENSE scenes."""
    from k6_overlap import k6_frames
    t = json.loads(TIMING.read_text(encoding="utf-8"))
    tot = total_frames()
    out = set(k6_frames(TIMING))
    for i, s in enumerate(t["scenes"]):
        a = 0 if i == 0 else round(s["start"] * FPS)
        b = round(t["scenes"][i + 1]["start"] * FPS) if i + 1 < len(t["scenes"]) else tot
        for x in s["sentences"]:
            s0 = round(x["start"] * FPS)
            out.update({s0 - 4, s0 + 3})
        if s["id"] in DENSE:
            out.update(range(a + 15, b, 15))
    return sorted(f for f in out if 0 <= f < tot)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("cmd", choices=["frames", "stills", "render", "join"])
    ap.add_argument("tag", nargs="?")
    ap.add_argument("--bundle", action="store_true")
    ap.add_argument("--frames-file")
    ap.add_argument("--jobs", type=int, default=3)
    ap.add_argument("--from", dest="start", type=int, default=0)
    ap.add_argument("--only")
    ap.add_argument("--conc", type=int, default=2)
    ap.add_argument("--mb", default="150")
    a = ap.parse_args()
    S.mkdir(parents=True, exist_ok=True)
    if a.cmd == "frames":
        fr = k6_list()
        (S / "k6_frames.txt").write_text(",".join(map(str, fr)))
        print(len(fr), "K6 frames ->", S / "k6_frames.txt")
        return 0
    guard()
    if a.cmd == "stills":
        tool = MOVIES / "src/ch00_coordinates_moving/checks/label_stills_mv.mjs"
        bdir = S / "bundle"
        if a.bundle or not bdir.exists():
            if bdir.exists():
                try:
                    bdir.rename(bdir.with_name(f"bundle_old_{int(time.time())}"))   # never delete: moved aside
                except PermissionError:
                    print("WARNING: could not move old bundle (file lock); overwriting in-place")
            r = subprocess.run(["node", str(tool), "--bundle", str(S / "public"), str(S / "stills" / "_b"), "-", "--bundle-out", str(bdir), "--bundle-only"],
                               cwd=MOVIES, capture_output=True, text=True)
            print(r.stdout[-800:], r.stderr[-1500:])
        fr = [int(x) for x in Path(a.frames_file or S / "k6_frames.txt").read_text().split(",") if x.strip()]
        out = S / "stills" / a.tag
        out.mkdir(parents=True, exist_ok=True)
        print(len(fr), "frames ->", out, flush=True)
        procs = []
        for i, ch in enumerate([fr[k::a.jobs] for k in range(a.jobs)]):
            if not ch:
                continue
            ff = out / f"frames_{i}.txt"
            ff.write_text(",".join(map(str, ch)))
            procs.append(subprocess.Popen(["node", str(tool), str(bdir), str(S / "public"), str(out), str(ff), "--port", str(int(os.environ.get("K6PORT", "5600")) + 30 * i), "--scale", "0.5", "--force"],
                                          cwd=MOVIES, stdout=open(out / f"log_{i}.txt", "w"), stderr=subprocess.STDOUT))
        for p in procs:
            p.wait()
        print("done", len(list(out.glob("f*.jpg"))), "stills", flush=True)
        return 0
    import render_chunks as rc
    n_fr = total_frames()
    n = (n_fr + CHUNK - 1) // CHUNK
    rd = S / "render"
    if a.cmd == "render":
        if not (S / "bundle").exists():
            sys.exit("no bundle: run `stills TAG --bundle` (or the bundle step) first")
        if not (S / "bundle" / "public" / "narration_music_mv.wav").exists():
            sys.exit("bundle/public/narration_music_mv.wav missing: copy the mix into the bundle's public folder first")
        rd.mkdir(parents=True, exist_ok=True)
        ns = argparse.Namespace(scratch=S, comp=COMP, frames=n_fr, audio=None, props=None, chunk=CHUNK, concurrency=a.conc, port0=5600, stall=240.0, out=None)
        todo = [int(x) for x in a.only.split(",")] if a.only else range(a.start, n)
        print(f"{n_fr} frames, {n} chunks", flush=True)
        t0 = time.time()
        for i in todo:
            guard()
            t1 = time.time()
            f0 = i * CHUNK
            rc.render_chunk(ns, i, f0, min(f0 + CHUNK, n_fr) - 1, rd)
            print(f"chunk {i} {f0}-{min(f0 + CHUNK, n_fr) - 1} {time.time() - t1:.0f} s; C: {shutil.disk_usage('C:/').free / 1e9:.1f} GB", flush=True)
        print(f"DONE {time.time() - t0:.0f} s", flush=True)
        return 0
    # join: refuse a partial render (every chunk present, non-empty, with the right frame count)
    bad = []
    for i in range(n):
        c = rd / f"c{i:02d}.mp4"
        want = min((i + 1) * CHUNK, n_fr) - i * CHUNK
        if not c.exists() or c.stat().st_size == 0:
            bad.append(f"c{i:02d} missing")
            continue
        got = subprocess.run(["ffprobe", "-v", "error", "-count_frames", "-select_streams", "v:0", "-show_entries", "stream=nb_read_frames", "-of", "csv=p=0", str(c)],
                             capture_output=True, text=True).stdout.strip()
        if not got.isdigit() or int(got) != want:
            bad.append(f"c{i:02d} has {got} frames, want {want}")
    if bad:
        sys.exit("REFUSE JOIN (partial render): " + "; ".join(bad))
    out = S / "build1_1080.mp4"
    r = subprocess.run([sys.executable, str(ROOT / "tools/movie_wb/join2pass.py"), str(rd), str(S / "sound" / "narration_music_mv.wav"), str(out), "--mb", a.mb,
                        "--abr", "128k", "--alim", "0.5"], cwd=ROOT)
    return r.returncode


if __name__ == "__main__":
    sys.exit(main())
