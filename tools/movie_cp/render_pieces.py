"""Render the movie in small pieces in the FOREGROUND (the idle-memory reaper kills background shells):
each call renders missing pieces until BUDGET seconds have passed, then exits; call it again until it prints DONE.
usage: render_pieces.py <scratch> <budget_s> [piece=1000] [concurrency=2]"""
import subprocess, sys, time
from pathlib import Path
S = Path(sys.argv[1]); budget = float(sys.argv[2]); P = int(sys.argv[3]) if len(sys.argv) > 3 else 1000
conc = int(sys.argv[4]) if len(sys.argv) > 4 else 2
N = 60185
out = S / "pieces"; out.mkdir(exist_ok=True)
MOVIES = Path(r"C:\Users\sislam27\Work\Climate Dynamics PHD\AOFD Vallis\movies")
t0 = time.time()
for i, f0 in enumerate(range(0, N, P)):
    f1 = min(N - 1, f0 + P - 1)
    o = out / f"p{f0:05d}.mp4"
    if o.exists() and o.stat().st_size > 0:
        continue
    if time.time() - t0 > budget:
        print("BUDGET"); sys.exit(0)
    t1 = time.time()
    tmp = out / f"tmp_{f0:05d}.mp4"
    cmd = (f'npx remotion render "{S / "bundle"}" Ch00CrossProductWhy "{tmp}" --frames={f0}-{f1} --concurrency={conc} '
           f'--port={4400 + (i % 50)} --muted --crf=23 --codec=h264')
    for attempt in range(3):
        r = subprocess.run(cmd, cwd=MOVIES, shell=True, capture_output=True, text=True)
        if r.returncode == 0 and tmp.exists():
            break
        print("retry", f0, attempt, r.stdout[-300:].replace(chr(10), " "), flush=True)
    else:
        print("FAIL", f0); sys.exit(1)
    tmp.rename(o)
    print(f"piece {f0}-{f1} {time.time() - t1:.0f} s", flush=True)
print("DONE")
