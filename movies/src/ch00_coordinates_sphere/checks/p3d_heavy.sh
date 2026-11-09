#!/usr/bin/env bash
# ch00_coordinates_sphere (#5c) fix loop p3d (2026-11-09): SSR 2-D + 3-D and the K6 re-shoot after the scene-exit gate, tag k6p3d.
# k6p3c (14 072 frames): 1 hit, 1 unique fault: s27 f62319 (frame 9 of s27), s26's caption "latitude-longitude: crowded at the pole" (full
# strength) under s27's globe (0.97). p3d: every scene's text and credits are off on the last frame of its overlap (cs_lib SceneGate `exit`),
# so every scene start is re-shot frame by frame again.
# Prepared, NOT started by the agent. Start (repo root, Git Bash):
#   nohup bash movies/src/ch00_coordinates_sphere/checks/p3d_heavy.sh > "G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_sphere/build1/k6p3d_heavy_$(date +%Y%m%d_%H%M%S).log" 2>&1 &
# What it does:
#   1. (light, before the lock) writes k6p3d_frames.txt = EVERY frame of every scene start of the movie (start -15 ... start +30, 35 starts)
#      + s27 (-15 ... end +15) the house K6 list and every 15th frame; copies (cp, nothing moved or deleted) every k6p3c still + box file
#      OUTSIDE those ranges into stills/k6p3d.
#   2. waits until RENDER2.lock, HEAVY.lock and VOICE.lock are all free and >= 9 GB RAM is free, then takes HEAVY.lock (mkdir + owner.txt).
#   3. SSR 2-D + 3-D (whole movie), a fresh bundle (cs_run.py moves the old one aside, never deletes), K6 stills of the list into k6p3d.
#      K6 ports 8417 / 8447 / 8477 (outside the Windows-excluded ranges 8172-8371 and 8552-8984).
#   4. releases HEAVY.lock (its own owner.txt + rmdir; also on exit via trap), then ONE Python pass over the folder listing: "stills written:
#      N of M" for the re-shoot list (a still = f<frame>.jpg AND b<frame>.json), the missing frames if any, then the overlap analysis.
# It never renders, commits or deletes anything (only its own lock folder is removed on release).
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
M="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies"
L="$M/HEAVY.lock"
S="$M/ch00_coordinates_sphere/build1"
TAG=k6p3d
PY="$R/.venv/Scripts/python.exe"
cd "$R" || exit 1
mkdir -p "$S/tmp" "$S/stills/$TAG" || { echo "STOP: cannot create folders on G: $(date)"; exit 1; }
export TEMP="$S/tmp" TMP="$S/tmp"
echo "START $TAG $(date)"
"$PY" tools/disk_guard.py --report 2>&1 | tail -6

# ---- 1. frame list + copy of the unchanged stills of the old tag (light IO, no lock)
"$PY" - "$S" "$TAG" <<'EOF'
import json, shutil, sys
from pathlib import Path
S, tag = Path(sys.argv[1]), sys.argv[2]
sys.path.insert(0, "movies/src/ch00_coordinates_sphere/checks"); sys.path.insert(0, "tools")
import cs_run
ALL = []
CHANGED = ["s27_area_patch"]
t = json.loads(Path("movies/ch00/ch00_coordinates_sphere/timing.json").read_text(encoding="utf-8"))
sc = t["scenes"]; ids = [s["id"] for s in sc]; tot = cs_run.total_frames()
def rng(sid):
    i = ids.index(sid)
    a = 0 if i == 0 else round(sc[i]["start"] * 30)
    b = round(sc[i + 1]["start"] * 30) if i + 1 < len(sc) else tot
    return max(0, a - 15), min(tot - 1, b - 1 + 15)
old = S / "stills" / "k6p3c"
assert old.is_dir(), "no k6p3c stills"
print("old tag:", old)
house = set(cs_run.k6_list())
fr, spans = set(), []
for sid in ALL:
    lo, hi = rng(sid); spans.append((lo, hi)); fr.update(range(lo, hi + 1))
for sid in CHANGED:
    lo, hi = rng(sid); spans.append((lo, hi))
    fr.update(x for x in house if lo <= x <= hi); fr.update(range(lo, hi + 1, 15))
for i in range(1, len(sc)):   # every scene start of the movie, frame by frame (the gate moved every scene's first text and credit)
    a0 = round(sc[i]["start"] * 30)
    spans.append((a0 - 15, a0 + 30)); fr.update(range(a0 - 15, a0 + 31))
fr = sorted(x for x in fr if 0 <= x < tot)
(S / f"{tag}_frames.txt").write_text(",".join(map(str, fr)))
print(f"re-shoot list: {len(fr)} frames (every frame of {len(sc) - 1} scene starts, -15 ... +30, + s27) -> {S / f'{tag}_frames.txt'}")
inside = lambda n: any(lo <= n <= hi for lo, hi in spans)  # noqa: E731
n = skip = have = 0
if old is not None:
    dst = S / "stills" / tag
    for p in old.iterdir():
        if not p.is_file() or p.suffix not in (".jpg", ".json") or p.name[0] not in "fb" or not p.stem[1:].isdigit():
            continue
        if inside(int(p.stem[1:])):   # changed scenes ±15: re-shot below with the p3a source
            skip += 1
            continue
        q = dst / p.name
        if q.exists():
            have += 1
            continue
        shutil.copy2(p, q); n += 1
print(f"copied {n} files from {old}, {have} already there, {skip} changed-range files left to re-shoot")
EOF
[ $? -eq 0 ] || { echo "STOP: frame list / copy failed $(date)"; exit 1; }

# ---- 2. one heavy job at a time: RENDER2, HEAVY and VOICE free and >= 9 GB RAM, then take HEAVY.lock
ram_ok() { "$PY" -c "
import ctypes,sys
class M(ctypes.Structure): _fields_=[('l',ctypes.c_ulong),('load',ctypes.c_ulong),('tot',ctypes.c_ulonglong),('avail',ctypes.c_ulonglong)]+[(f'x{i}',ctypes.c_ulonglong) for i in range(5)]
m=M(); m.l=ctypes.sizeof(M); ctypes.windll.kernel32.GlobalMemoryStatusEx(ctypes.byref(m)); sys.exit(0 if m.avail/2**30>=9 else 1)"; }
until [ ! -d "$M/RENDER2.lock" ] && [ ! -d "$M/VOICE.lock" ] && [ ! -d "$L" ] && ram_ok && mkdir "$L" 2>/dev/null; do sleep 20; done
echo "#5c p3d SSR + K6 $TAG (fix loop p3d: every scene start frame by frame + s27; stills only, no render) $(date)" > "$L/owner.txt"; echo "LOCK $(date)"
release() { rm -f "$L/owner.txt"; rmdir "$L" 2>/dev/null; echo "UNLOCK $(date)"; }
trap 'grep -q "K6 $TAG" "$L/owner.txt" 2>/dev/null && release' EXIT

# ---- 3. SSR + bundle + K6 stills of the list
echo "== ssr 2-D"; (cd movies && node src/ch00_coordinates_sphere/checks/ssr/run.mjs --step 10 --public "$S/public" 2>&1 | tail -8)
echo "== ssr 3-D"; (cd movies && node src/ch00_coordinates_sphere/checks/ssr/run.mjs --step 15 --3d 2>&1 | tail -6)
K6PORT="${K6PORT:-8417}" "$PY" movies/src/ch00_coordinates_sphere/checks/cs_run.py stills "$TAG" --bundle --jobs 3 --frames-file "$S/${TAG}_frames.txt" > "$S/${TAG}_run.log" 2>&1
echo "stills exit $?"
release; trap - EXIT

# ---- 4. light analysis over the whole k6p3d folder
grep -c ERROR "$S"/stills/"$TAG"/log_*.txt
"$PY" - "$S" "$TAG" <<'EOF'
import os, sys
from pathlib import Path
S, tag = Path(sys.argv[1]), sys.argv[2]
want = [int(x) for x in (S / f"{tag}_frames.txt").read_text().split(",") if x.strip()]
jpg, js = set(), set()
with os.scandir(S / "stills" / tag) as it:   # one listing of the folder
    for e in it:
        n, ext = os.path.splitext(e.name)
        if n[:1] in "fb" and n[1:].isdigit():
            (jpg if n[0] == "f" and ext == ".jpg" else js if n[0] == "b" and ext == ".json" else set()).add(int(n[1:]))
done = [x for x in want if x in jpg and x in js]
miss = [x for x in want if not (x in jpg and x in js)]
print(f"stills written: {len(done)} of {len(want)} (re-shoot list); folder total {len(jpg & js)} stills")
if miss:
    print("missing:", ",".join(map(str, miss[:60])), "..." if len(miss) > 60 else "")
EOF
"$PY" tools/k6_overlap.py "$S/stills/$TAG" --timing movies/ch00/ch00_coordinates_sphere/timing.json --json "$S/stills/${TAG}_overlap.json" 2>&1 | tail -2
"$PY" "$S/k6sum.py" "$S/stills/${TAG}_overlap.json" | tail -30
"$PY" tools/disk_guard.py --report 2>&1 | tail -6
echo "DONE $(date)"
