#!/usr/bin/env bash
# ch00_coordinates_frames (#5d) fix loop r8c (2026-11-09): SSR 2-D + 3-D and the K6 re-shoot of the k6r8b faults, tag k6r8c.
# k6r8b (3430 of 3556 frames; SSR 2 errors, so s10 from f1949 and all of s19 had no stills): 381 hits, 11 unique faults in
# s05 s09 s10 s15 s22 s25 + the SSR errors in s10 s19 (see the remake log, "fix loop r8c").
# Prepared, NOT started by the agent. Start (repo root, Git Bash) — the script writes its own uniquely named log:
#   nohup bash movies/src/ch00_coordinates_frames/checks/r8c_heavy.sh > /dev/null 2>&1 &
# What it does:
#   1. (light, before the lock) writes k6r8c_frames.txt = the full house K6 list (fr_run.k6_list) + EVERY frame of the faulted scenes
#      s05 s09 s10 s15 s19 s22 s25, each from its start -15 to its end +15.
#   2. waits until RENDER2.lock, HEAVY.lock and VOICE.lock are all free and >= 9 GB RAM is available, then takes HEAVY.lock
#      (mkdir + owner.txt).
#   3. SSR 2-D (--step 10) and 3-D (--step 15). Any SSR error -> release the lock and stop (exit 2): no K6 on a movie whose guard throws.
#   4. a fresh bundle (fr_run.py moves the old one aside, never deletes), K6 stills of the list into the fresh folder stills/k6r8c
#      (--jobs 3, K6 ports 8447 / 8477 / 8507: outside the Windows-excluded TCP ranges 8172-8371 and 8552-8984).
#   5. releases HEAVY.lock (its own owner.txt + rmdir; also on exit via trap), then the (light) k6_overlap over the whole k6r8c folder
#      and a per-scene summary of unique faults that ends with "N unique faults".
# It never renders, mixes, commits or deletes anything (only its own lock folder is removed on release).
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
M="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies"
L="$M/HEAVY.lock"
S="$M/ch00_coordinates_frames/build1"
TAG=k6r8c
PY="$R/.venv/Scripts/python.exe"
TIMING="movies/ch00/ch00_coordinates_frames/timing.json"
cd "$R" || exit 1
mkdir -p "$S/tmp" || { echo "STOP: cannot create folders on G: $(date)"; exit 1; }
LOG="$S/${TAG}_heavy_$(date +%Y%m%d_%H%M%S).log"
echo "log -> $LOG"
exec >>"$LOG" 2>&1
if [ -e "$S/stills/$TAG" ] && [ -n "$(ls -A "$S/stills/$TAG" 2>/dev/null | head -1)" ]; then
  echo "STOP: $S/stills/$TAG exists and is not empty (the re-shoot needs a fresh tag folder; nothing deleted) $(date)"; exit 1
fi
mkdir -p "$S/stills/$TAG"
export TEMP="$S/tmp" TMP="$S/tmp"
echo "START $TAG $(date)"
"$PY" tools/disk_guard.py --report 2>&1 | tail -6

# ---- 1. frame list (light, no lock)
"$PY" - "$S" "$TAG" <<'EOF'
import json, sys
from pathlib import Path
S, tag = Path(sys.argv[1]), sys.argv[2]
sys.path.insert(0, "movies/src/ch00_coordinates_frames/checks"); sys.path.insert(0, "tools")
import fr_run
FAULTED = ["s05_i_east", "s09_khulna", "s10_coast_frame", "s15_arrows_turn", "s19_i_east_b", "s22_add_motions", "s25_dot_i_b"]
t = json.loads(Path("movies/ch00/ch00_coordinates_frames/timing.json").read_text(encoding="utf-8"))
sc = t["scenes"]; ids = [s["id"] for s in sc]; tot = fr_run.total_frames()
house = set(fr_run.k6_list())
fr, dense = set(house), 0
for sid in FAULTED:
    i = ids.index(sid)
    a = 0 if i == 0 else round(sc[i]["start"] * 30)
    b = round(sc[i + 1]["start"] * 30) if i + 1 < len(sc) else tot
    lo, hi = max(0, a - 15), min(tot - 1, b - 1 + 15)
    fr.update(range(lo, hi + 1)); dense += hi - lo + 1
    print(f"  {sid}: every frame {lo}-{hi} ({hi - lo + 1})")
fr = sorted(x for x in fr if 0 <= x < tot)
(S / f"{tag}_frames.txt").write_text(",".join(map(str, fr)))
print(f"re-shoot list: {len(fr)} frames (house list {len(house)}, dense {dense}) -> {S / f'{tag}_frames.txt'}")
EOF
[ $? -eq 0 ] || { echo "STOP: frame list failed $(date)"; exit 1; }

# ---- 2. one heavy job at a time: RENDER2, HEAVY and VOICE free and >= 9 GB RAM, then take HEAVY.lock
ram_ok() { "$PY" -c "
import ctypes,sys
class M(ctypes.Structure): _fields_=[('l',ctypes.c_ulong),('load',ctypes.c_ulong),('tot',ctypes.c_ulonglong),('avail',ctypes.c_ulonglong)]+[(f'x{i}',ctypes.c_ulonglong) for i in range(5)]
m=M(); m.l=ctypes.sizeof(M); ctypes.windll.kernel32.GlobalMemoryStatusEx(ctypes.byref(m)); sys.exit(0 if m.avail/2**30>=9 else 1)"; }
echo "waiting for RENDER2 / HEAVY / VOICE free and >= 9 GB RAM $(date)"
until [ ! -d "$M/RENDER2.lock" ] && [ ! -d "$M/VOICE.lock" ] && [ ! -d "$L" ] && ram_ok && mkdir "$L" 2>/dev/null; do sleep 20; done
echo "#5d r8c SSR + K6 $TAG (fix loop r8c: house list + every frame of s05 s09 s10 s15 s19 s22 s25; stills only, no render) $(date)" > "$L/owner.txt"; echo "LOCK $(date)"
release() { rm -f "$L/owner.txt"; rmdir "$L" 2>/dev/null; echo "UNLOCK $(date)"; }
trap 'grep -q "K6 $TAG" "$L/owner.txt" 2>/dev/null && release' EXIT
"$PY" -c "import shutil;print('C: %.1f GB free, G: %.1f GB free' % (shutil.disk_usage('C:/').free/1e9, shutil.disk_usage('G:/').free/1e9))"

# ---- 3. SSR 2-D + 3-D: must be 0 errors
filt() { grep -v "THREE_CJS\|Replace \`const\|trace-deprecation"; }
echo "== ssr 2-D"; SSR2=$(cd movies && node src/ch00_coordinates_frames/checks/ssr/run.mjs --step 10 --public "$S/public" 2>&1 | filt | tail -12); echo "$SSR2"
echo "== ssr 3-D"; SSR3=$(cd movies && node src/ch00_coordinates_frames/checks/ssr/run.mjs --step 15 --3d --public "$S/public" 2>&1 | filt | tail -8); echo "$SSR3"
E2=$(echo "$SSR2" | grep -o "[0-9]* error(s)" | head -1 | grep -o "^[0-9]*"); E3=$(echo "$SSR3" | grep -o "[0-9]* error(s)" | head -1 | grep -o "^[0-9]*")
echo "SSR errors: 2-D ${E2:-?}, 3-D ${E3:-?}"
if [ "${E2:-x}" != "0" ] || [ "${E3:-x}" != "0" ]; then echo "STOP: SSR not clean (2-D ${E2:-?}, 3-D ${E3:-?}); no K6 shot $(date)"; release; trap - EXIT; exit 2; fi

# ---- 4. fresh bundle + K6 stills of the list
K6PORT="${K6PORT:-8447}" "$PY" movies/src/ch00_coordinates_frames/checks/fr_run.py stills "$TAG" --bundle --jobs 3 --frames-file "$S/${TAG}_frames.txt" > "$S/${TAG}_run.log" 2>&1
echo "stills exit $?"; tail -3 "$S/${TAG}_run.log"
release; trap - EXIT

# ---- 5. light analysis over the whole k6r8c folder
echo "still-log ERROR lines: $(cat "$S"/stills/"$TAG"/log_*.txt 2>/dev/null | grep -c ERROR)"
echo "stills written: $(ls "$S/stills/$TAG" | grep -c '^f.*jpg$') of $(tr ',' '\n' < "$S/${TAG}_frames.txt" | grep -c .)"
"$PY" tools/k6_overlap.py "$S/stills/$TAG" --timing "$TIMING" --json "$S/stills/$TAG/k6.json" 2>&1 | tail -3
"$PY" - "$S/stills/$TAG/k6.json" "$TIMING" <<'EOF'
import json, sys, collections
d = json.load(open(sys.argv[1], encoding="utf-8"))
tm = json.load(open(sys.argv[2], encoding="utf-8"))
st = [(round(s["start"] * 30), s["id"]) for s in tm["scenes"]]
def scene(f):
    r = st[0][1]
    for a, i in st:
        if f >= a: r = i
    return r
C = collections.OrderedDict()
for fr, hs in sorted(d["hits"].items(), key=lambda x: int(x[0])):
    for h in hs:
        key = (scene(int(fr)), h["kind"], str(h.get("a"))[:40], str(h.get("b"))[:40])
        c = C.setdefault(key, [0, int(fr), int(fr), h.get("px")]); c[0] += 1; c[2] = int(fr)
for k, v in C.items():
    print(f"{k[0][:22]:22s} {k[1]:22s} n={v[0]:4d} f{v[1]}-f{v[2]} px={v[3]} | {k[2]} || {k[3]}")
print(len(C), "unique faults")
EOF
"$PY" tools/disk_guard.py --report 2>&1 | tail -6
echo "DONE $(date)"
