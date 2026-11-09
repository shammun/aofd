#!/usr/bin/env bash
# ch00_coordinates_sphere (#5c) fix loop p3b (2026-11-09): SSR 2-D + 3-D and the K6 re-shoot of the k6p3a faults, tag k6p3b.
# k6p3a (20 286 frames): 328 hits, 23 unique faults in s09 s13 s14 s19 s20 s21 s22 s25 s26 s30 s35 (see the remake log, "fix loop p3b").
# Prepared, NOT started by the agent. Start (repo root, Git Bash):
#   nohup bash movies/src/ch00_coordinates_sphere/checks/p3b_heavy.sh > "G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_sphere/build1/k6p3b_heavy_$(date +%Y%m%d_%H%M%S).log" 2>&1 &
# What it does:
#   1. (light, before the lock) writes k6p3b_frames.txt = EVERY frame of s13 and s30 (each -15 ... end +15); for the other faulted scenes
#      (each -15 ... end +15) the house K6 list + every 15th frame + every frame of the cross-fade into the scene
#      (start -15 ... start +30) + every frame ±45 around the long faults f38437, f49310, f52717; copies (cp, nothing moved or deleted) every k6p3a still + box file OUTSIDE those ranges into stills/k6p3b.
#   2. waits until RENDER2.lock, HEAVY.lock and VOICE.lock are all free and >= 9 GB RAM is free, then takes HEAVY.lock (mkdir + owner.txt).
#   3. SSR 2-D + 3-D (whole movie), a fresh bundle (cs_run.py moves the old one aside, never deletes), K6 stills of the list into k6p3b.
#      K6 ports 8417 / 8447 / 8477 (outside the Windows-excluded ranges 8172-8371 and 8552-8984).
#   4. releases HEAVY.lock (its own owner.txt + rmdir; also on exit via trap), then the (light) overlap analysis over the WHOLE k6p3b folder.
# It never renders, commits or deletes anything (only its own lock folder is removed on release).
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
M="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies"
L="$M/HEAVY.lock"
S="$M/ch00_coordinates_sphere/build1"
TAG=k6p3b
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
ALL = ["s13_earth_axes", "s30_slope_of_sine"]
CHANGED = ["s09_meridians", "s14_brest_side", "s19_khulna", "s20_spin_rate", "s21_ground_speeds", "s22_distance_north", "s25_degree_east",
           "s26_grid_boxes", "s35_recap"]
t = json.loads(Path("movies/ch00/ch00_coordinates_sphere/timing.json").read_text(encoding="utf-8"))
sc = t["scenes"]; ids = [s["id"] for s in sc]; tot = cs_run.total_frames()
def rng(sid):
    i = ids.index(sid)
    a = 0 if i == 0 else round(sc[i]["start"] * 30)
    b = round(sc[i + 1]["start"] * 30) if i + 1 < len(sc) else tot
    return max(0, a - 15), min(tot - 1, b - 1 + 15)
old = S / "stills" / "k6p3a"
assert old.is_dir(), "no k6p3a stills"
print("old tag:", old)
old_fr = set()
if old is not None:
    old_fr = {int(p.stem[1:]) for p in old.iterdir() if p.is_file() and p.suffix == ".jpg" and p.name[0] == "f" and p.stem[1:].isdigit()}
house = set(cs_run.k6_list())
fr, spans = set(), []
for sid in ALL:
    lo, hi = rng(sid); spans.append((lo, hi)); fr.update(range(lo, hi + 1))
for sid in CHANGED:
    lo, hi = rng(sid); spans.append((lo, hi))
    fr.update(x for x in house if lo <= x <= hi); fr.update(range(lo, hi + 1, 15)); fr.update(range(lo, lo + 46))
for x in (38437, 49310, 52717):   # the long k6p3a faults outside s13 / s30: every frame ±45 around each
    fr.update(range(x - 45, x + 46))
fr = sorted(x for x in fr if 0 <= x < tot)
(S / f"{tag}_frames.txt").write_text(",".join(map(str, fr)))
print(f"re-shoot list: {len(fr)} frames ({sum(hi - lo + 1 for lo, hi in spans[:len(ALL)])} of them every frame of {', '.join(ALL)}) -> {S / f'{tag}_frames.txt'}")
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
echo "#5c p3b SSR + K6 $TAG (fix loop p3b: s13 s30 every frame + the faulted scenes; stills only, no render) $(date)" > "$L/owner.txt"; echo "LOCK $(date)"
release() { rm -f "$L/owner.txt"; rmdir "$L" 2>/dev/null; echo "UNLOCK $(date)"; }
trap 'grep -q "K6 $TAG" "$L/owner.txt" 2>/dev/null && release' EXIT

# ---- 3. SSR + bundle + K6 stills of the list
echo "== ssr 2-D"; (cd movies && node src/ch00_coordinates_sphere/checks/ssr/run.mjs --step 10 --public "$S/public" 2>&1 | tail -8)
echo "== ssr 3-D"; (cd movies && node src/ch00_coordinates_sphere/checks/ssr/run.mjs --step 15 --3d 2>&1 | tail -6)
K6PORT="${K6PORT:-8417}" "$PY" movies/src/ch00_coordinates_sphere/checks/cs_run.py stills "$TAG" --bundle --jobs 3 --frames-file "$S/${TAG}_frames.txt" > "$S/${TAG}_run.log" 2>&1
echo "stills exit $?"
release; trap - EXIT

# ---- 4. light analysis over the whole k6p3a folder
grep -c ERROR "$S"/stills/"$TAG"/log_*.txt
ls "$S/stills/$TAG" | grep -c '^f.*jpg$'
"$PY" tools/k6_overlap.py "$S/stills/$TAG" --timing movies/ch00/ch00_coordinates_sphere/timing.json --json "$S/stills/${TAG}_overlap.json" 2>&1 | tail -2
"$PY" "$S/k6sum.py" "$S/stills/${TAG}_overlap.json" | tail -30
"$PY" tools/disk_guard.py --report 2>&1 | tail -6
echo "DONE $(date)"
