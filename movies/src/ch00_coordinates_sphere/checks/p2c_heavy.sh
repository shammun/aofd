#!/usr/bin/env bash
# ch00_coordinates_sphere (#5c) pass 2, K6 re-check k6p2c (2026-11-08) after the s16 fix (3-D tag "a cos φ ≈ 4230 km" moved below the
# sloping equator line and right of the vertical axis; k6p2b found it crossed by the axis line, fill 1 still did).
# Prepared, NOT started by the agent. Start (repo root, Git Bash):
#   nohup bash movies/src/ch00_coordinates_sphere/checks/p2c_heavy.sh > "G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_sphere/build1/k6p2c_heavy_$(date +%Y%m%d_%H%M%S).log" 2>&1 &
# What it does:
#   1. (light, before the lock) copies every k6p2b still + box file OUTSIDE s16 ±15 frames into stills/k6p2c (cp -n, nothing moved or deleted);
#      writes k6p2c_s16.txt = EVERY frame of s16 −15 … s16 end +15 (frames 29766–31820, 2055 frames; from timing.json).
#   2. waits until RENDER2.lock, HEAVY.lock and VOICE.lock are all free and >= 9 GB RAM is free, then takes HEAVY.lock (mkdir + owner.txt).
#   3. SSR 2-D + 3-D (whole movie), a fresh bundle (cs_run.py moves the old one aside, never deletes), K6 stills of the s16 list into k6p2c.
#   4. releases HEAVY.lock (its own owner.txt + rmdir), then the (light) overlap analysis over the WHOLE k6p2c folder.
# It never renders, commits or deletes anything (only its own lock folder is removed on release).
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
M="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies"
L="$M/HEAVY.lock"
S="$M/ch00_coordinates_sphere/build1"
TAG=k6p2c; OLD=k6p2b
PY="$R/.venv/Scripts/python.exe"
cd "$R" || exit 1
mkdir -p "$S/tmp" "$S/stills/$TAG" || { echo "STOP: cannot create folders on G: $(date)"; exit 1; }
export TEMP="$S/tmp" TMP="$S/tmp"
echo "START $TAG $(date)"
"$PY" tools/disk_guard.py --report 2>&1 | tail -6

# ---- 1. frame list (every s16 frame ±15) + copy of the unchanged k6p2b stills (light IO, no lock)
"$PY" - "$S" "$TAG" "$OLD" <<'EOF'
import json, shutil, sys
from pathlib import Path
S, tag, old = Path(sys.argv[1]), sys.argv[2], sys.argv[3]
t = json.loads(Path("movies/ch00/ch00_coordinates_sphere/timing.json").read_text(encoding="utf-8"))
sc = t["scenes"]; i = [s["id"] for s in sc].index("s16_brest_axis_distance")
a, b = round(sc[i]["start"] * 30), round(sc[i + 1]["start"] * 30)   # s16 = [a, b)
lo, hi = a - 15, b - 1 + 15
fr = list(range(lo, hi + 1))
(S / f"{tag}_s16.txt").write_text(",".join(map(str, fr)))
print(f"s16 frames {a}-{b - 1}; list {lo}-{hi} = {len(fr)} frames -> {S / f'{tag}_s16.txt'}")
src, dst = S / "stills" / old, S / "stills" / tag
n = skip = have = 0
for p in src.iterdir():
    if not p.is_file() or p.suffix not in (".jpg", ".json") or p.name[0] not in "fb" or not p.stem[1:].isdigit():
        continue
    if lo <= int(p.stem[1:]) <= hi:   # s16 ±15: re-shot below with the fixed source (k6p2b holds fill-1 frames there)
        skip += 1
        continue
    q = dst / p.name
    if q.exists():
        have += 1
        continue
    shutil.copy2(p, q); n += 1
print(f"copied {n} files from {old}, {have} already there, {skip} s16-range files left to re-shoot")
EOF
[ $? -eq 0 ] || { echo "STOP: frame list / copy failed $(date)"; exit 1; }

# ---- 2. one heavy job at a time: RENDER2, HEAVY and VOICE free and >= 9 GB RAM, then take HEAVY.lock
ram_ok() { "$PY" -c "
import ctypes,sys
class M(ctypes.Structure): _fields_=[('l',ctypes.c_ulong),('load',ctypes.c_ulong),('tot',ctypes.c_ulonglong),('avail',ctypes.c_ulonglong)]+[(f'x{i}',ctypes.c_ulonglong) for i in range(5)]
m=M(); m.l=ctypes.sizeof(M); ctypes.windll.kernel32.GlobalMemoryStatusEx(ctypes.byref(m)); sys.exit(0 if m.avail/2**30>=9 else 1)"; }
until [ ! -d "$M/RENDER2.lock" ] && [ ! -d "$M/VOICE.lock" ] && [ ! -d "$L" ] && ram_ok && mkdir "$L" 2>/dev/null; do sleep 20; done
echo "#5c pass2 SSR + K6 $TAG (s16 fix; stills only, no render) $(date)" > "$L/owner.txt"; echo "LOCK $(date)"
release() { rm -f "$L/owner.txt"; rmdir "$L" 2>/dev/null; echo "UNLOCK $(date)"; }
trap 'grep -q "K6 $TAG" "$L/owner.txt" 2>/dev/null && release' EXIT

# ---- 3. SSR + bundle + K6 stills of every s16 frame ±15
echo "== ssr 2-D"; (cd movies && node src/ch00_coordinates_sphere/checks/ssr/run.mjs --step 10 --public "$S/public" 2>&1 | tail -8)
echo "== ssr 3-D"; (cd movies && node src/ch00_coordinates_sphere/checks/ssr/run.mjs --step 15 --3d 2>&1 | tail -6)
K6PORT=8100 "$PY" movies/src/ch00_coordinates_sphere/checks/cs_run.py stills "$TAG" --bundle --jobs 3 --frames-file "$S/${TAG}_s16.txt" > "$S/${TAG}_run.log" 2>&1
echo "stills exit $?"
release; trap - EXIT

# ---- 4. light analysis over the whole k6p2c folder
grep -c ERROR "$S"/stills/"$TAG"/log_*.txt
ls "$S/stills/$TAG" | grep -c '^f.*jpg$'
"$PY" tools/k6_overlap.py "$S/stills/$TAG" --timing movies/ch00/ch00_coordinates_sphere/timing.json --json "$S/stills/${TAG}_overlap.json" 2>&1 | tail -2
"$PY" "$S/k6sum.py" "$S/stills/${TAG}_overlap.json" | tail -30
"$PY" tools/disk_guard.py --report 2>&1 | tail -6
echo "DONE $(date)"
