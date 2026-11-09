#!/usr/bin/env bash
# ch00_coordinates_sphere (#5c) fix loop p3a after pass 2 (2026-11-08): SSR 2-D + 3-D and the K6 re-shoot, tag k6p3a.
# Source changes (see movies/ch00/ch00_coordinates_sphere/remake_2026-11-07_log.md, section "fix loop p3a"):
#   3-D: s00 (title globe camera), s13 (octant tones, edges, lifted piece, rods), s20 (half-Earth), s25 (wedge cut), s29 (half-Earth)
#   2-D: s04 s07 s08 s09 s16 s18 s19 s21 s22 s28 s30 s31 s34 s35 (reveals on their words, gold inputs, titles, rows, recap icon)
# Prepared, NOT started by the agent. Start (repo root, Git Bash):
#   nohup bash movies/src/ch00_coordinates_sphere/checks/p3_heavy.sh > "G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_sphere/build1/k6p3a_heavy_$(date +%Y%m%d_%H%M%S).log" 2>&1 &
# What it does:
#   1. (light, before the lock) writes k6p3a_frames.txt = EVERY frame of s00, s13, s20, s25, s29, s35 (each −15 … end +15), plus, for the
#      other changed scenes (each −15 … end +15), the house K6 list (cs_run.k6_list) + every 15th frame + every frame the old tag had there;
#      copies (cp, nothing moved or deleted) every still + box file of the old tag (k6p2d, else k6p2c) OUTSIDE those ranges into stills/k6p3a.
#   2. waits until RENDER2.lock, HEAVY.lock and VOICE.lock are all free and >= 9 GB RAM is free, then takes HEAVY.lock (mkdir + owner.txt).
#   3. SSR 2-D + 3-D (whole movie), a fresh bundle (cs_run.py moves the old one aside, never deletes), K6 stills of the list into k6p3a.
#   4. releases HEAVY.lock (its own owner.txt + rmdir; also on exit via trap), then the (light) overlap analysis over the WHOLE k6p3a folder.
# It never renders, commits or deletes anything (only its own lock folder is removed on release).
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
M="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies"
L="$M/HEAVY.lock"
S="$M/ch00_coordinates_sphere/build1"
TAG=k6p3a
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
ALL = ["s00_title", "s13_earth_axes", "s20_spin_rate", "s25_degree_east", "s29_strip_round", "s35_recap"]
CHANGED = ["s04_slice_radius", "s07_colatitude", "s08_sin_cos_swap", "s09_meridians", "s16_brest_axis_distance", "s18_position_vector", "s19_khulna",
           "s21_ground_speeds", "s22_distance_north", "s28_box_areas", "s30_slope_of_sine", "s31_adding_strips", "s34_global_mean"]
t = json.loads(Path("movies/ch00/ch00_coordinates_sphere/timing.json").read_text(encoding="utf-8"))
sc = t["scenes"]; ids = [s["id"] for s in sc]; tot = cs_run.total_frames()
def rng(sid):
    i = ids.index(sid)
    a = 0 if i == 0 else round(sc[i]["start"] * 30)
    b = round(sc[i + 1]["start"] * 30) if i + 1 < len(sc) else tot
    return max(0, a - 15), min(tot - 1, b - 1 + 15)
old = next((S / "stills" / o for o in ("k6p2d", "k6p2c") if (S / "stills" / o).is_dir()), None)
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
    fr.update(x for x in house | old_fr if lo <= x <= hi); fr.update(range(lo, hi + 1, 15))
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
echo "#5c p3a SSR + K6 $TAG (fix loop p3a: s00 s13 s20 s25 s29 s35 every frame + changed scenes; stills only, no render) $(date)" > "$L/owner.txt"; echo "LOCK $(date)"
release() { rm -f "$L/owner.txt"; rmdir "$L" 2>/dev/null; echo "UNLOCK $(date)"; }
trap 'grep -q "K6 $TAG" "$L/owner.txt" 2>/dev/null && release' EXIT

# ---- 3. SSR + bundle + K6 stills of the list
echo "== ssr 2-D"; (cd movies && node src/ch00_coordinates_sphere/checks/ssr/run.mjs --step 10 --public "$S/public" 2>&1 | tail -8)
echo "== ssr 3-D"; (cd movies && node src/ch00_coordinates_sphere/checks/ssr/run.mjs --step 15 --3d 2>&1 | tail -6)
K6PORT=8300 "$PY" movies/src/ch00_coordinates_sphere/checks/cs_run.py stills "$TAG" --bundle --jobs 3 --frames-file "$S/${TAG}_frames.txt" > "$S/${TAG}_run.log" 2>&1
echo "stills exit $?"
release; trap - EXIT

# ---- 4. light analysis over the whole k6p3a folder
grep -c ERROR "$S"/stills/"$TAG"/log_*.txt
ls "$S/stills/$TAG" | grep -c '^f.*jpg$'
"$PY" tools/k6_overlap.py "$S/stills/$TAG" --timing movies/ch00/ch00_coordinates_sphere/timing.json --json "$S/stills/${TAG}_overlap.json" 2>&1 | tail -2
"$PY" "$S/k6sum.py" "$S/stills/${TAG}_overlap.json" | tail -30
"$PY" tools/disk_guard.py --report 2>&1 | tail -6
echo "DONE $(date)"
