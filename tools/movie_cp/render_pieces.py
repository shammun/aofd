"""Render the movie in small pieces in the FOREGROUND (the idle-memory reaper kills background shells):
each call renders missing pieces until BUDGET seconds have passed, then exits; call it again until it prints DONE.
usage: render_pieces.py <scratch> <budget_s> [piece=1000] [concurrency=2] [--bundle DIR] [--pieces DIR] [--only p1,p2,...]
  N (total frames) = timing.json total_frames + the 75-frame end hold (CPW_FRAMES).
  --only: piece start frames to render (others are skipped even if missing)."""
import json, subprocess, sys, time
from pathlib import Path
a = sys.argv[1:]
opt = lambda k, d=None: a[a.index(k) + 1] if k in a else d  # noqa: E731
pos = [x for i, x in enumerate(a) if not x.startswith("--") and (i == 0 or not a[i - 1].startswith("--"))]
S = Path(pos[0]); budget = float(pos[1]); P = int(pos[2]) if len(pos) > 2 else 1000
conc = int(pos[3]) if len(pos) > 3 else 2
MOVIES = Path(r"C:\Users\sislam27\Work\Climate Dynamics PHD\AOFD Vallis\movies")
N = json.load(open(MOVIES / "ch00/ch00_cross_product_why/timing.json", encoding="utf-8"))["total_frames"] + 75
bundle = Path(opt("--bundle", str(S / "bundle")))
out = Path(opt("--pieces", str(S / "pieces"))); out.mkdir(exist_ok=True)
only = {int(x) for x in opt("--only").split(",")} if opt("--only") else None
t0 = time.time()
for i, f0 in enumerate(range(0, N, P)):
    if only is not None and f0 not in only:
        continue
    f1 = min(N - 1, f0 + P - 1)
    o = out / f"p{f0:05d}.mp4"
    if o.exists() and o.stat().st_size > 0:
        continue
    if time.time() - t0 > budget:
        print("BUDGET"); sys.exit(0)
    t1 = time.time()
    tmp = out / f"tmp_{f0:05d}.mp4"
    cmd = (f'npx remotion render "{bundle}" Ch00CrossProductWhy "{tmp}" --frames={f0}-{f1} --concurrency={conc} '
           f'--port={4400 + (i % 50)} --muted --crf=23 --codec=h264 --gl=angle')
    for attempt in range(3):
        r = subprocess.run(cmd, cwd=MOVIES, shell=True, capture_output=True, text=True)
        if r.returncode == 0 and tmp.exists():
            break
        print("retry", f0, attempt, r.stdout[-300:].replace(chr(10), " "), r.stderr[-300:].replace(chr(10), " "), flush=True)
    else:
        print("FAIL", f0); sys.exit(1)
    tmp.rename(o)
    print(f"piece {f0}-{f1} {time.time() - t1:.0f} s", flush=True)
print(f"DONE N={N}")
