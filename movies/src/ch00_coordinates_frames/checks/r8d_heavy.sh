#!/usr/bin/env bash
# ch00_coordinates_frames (#5d) fix loop r8d (2026-11-09): SSR 2-D + 3-D and the K6 re-shoot of the k6r8c faults, tag k6r8d.
# k6r8c (22 917 frames, SSR 0 / 0): 436 hits, 28 unique faults: 17 one-frame cross-fade faults at scene start + 9 (s05 s06 s09 s10 s11 s15
# s16 s19 s22 s23 s25 s26) -> fixed by ONE SceneGate at every scene start (fr_lib, ported from Part 3 p3c: text enters at XF + 8, credits
# at XF); s10's phase changes (f21520-21526, f21882-21888) and x̂′ / ŷ′ tip labels on the sharp globe (f21523-21885) -> fixed in s10.
# Prepared, NOT started by the agent. Start (repo root, Git Bash) — the script writes its own uniquely named log:
#   nohup bash movies/src/ch00_coordinates_frames/checks/r8d_heavy.sh > /dev/null 2>&1 &
# What it does:
#   1. (light, before the lock) writes k6r8d_frames.txt = EVERY frame of every scene start (start -15 ... start +30; the gate changes only
#      frames 0-26 of a scene) + EVERY frame of s10 (the only scene whose own source changed in r8d) -15 ... end +15; copies (cp, nothing
#      moved or deleted) every k6r8c still + box file OUTSIDE that list into the fresh folder stills/k6r8d (one Python pass, one scandir).
#   2. waits until RENDER2.lock, HEAVY.lock and VOICE.lock are all free and >= 9 GB RAM is available, then takes HEAVY.lock
#      (mkdir + owner.txt).
#   3. SSR 2-D (--step 10) and 3-D (--step 15). Any SSR error -> release the lock and stop (exit 2).
#   4. a fresh bundle (fr_run.py moves the old one aside, never deletes), K6 stills of the list into stills/k6r8d
#      (--jobs 3, K6 ports 8447 / 8477 / 8507: outside the Windows-excluded TCP ranges 8172-8371 and 8552-8984).
#   5. releases HEAVY.lock, then ONE Python pass (one scandir, no per-file stat from bash) compares the frame lists with the folder and
#      prints "stills written: N of M" (re-shoot list) and the whole-movie coverage; then k6_overlap over the whole k6r8d folder and a
#      per-scene summary of unique faults that ends with "N unique faults".
# It never renders, mixes, commits or deletes anything (only its own lock folder is removed on release).
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
M="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies"
L="$M/HEAVY.lock"
S="$M/ch00_coordinates_frames/build1"
TAG=k6r8d
OLD=k6r8c
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

# ---- 1. frame list + copy of the unchanged k6r8c stills (light IO, no lock)
"$PY" - "$S" "$TAG" "$OLD" <<'EOF'
import json, os, re, shutil, sys, time
from pathlib import Path
S, tag, old = Path(sys.argv[1]), sys.argv[2], sys.argv[3]
sys.path.insert(0, "movies/src/ch00_coordinates_frames/checks"); sys.path.insert(0, "tools")
import fr_run
DENSE = ["s10_coast_frame"]
t = json.loads(Path("movies/ch00/ch00_coordinates_frames/timing.json").read_text(encoding="utf-8"))
sc = t["scenes"]; ids = [s["id"] for s in sc]; tot = fr_run.total_frames()
fr = set()
for i, s in enumerate(sc):
    a = 0 if i == 0 else round(s["start"] * 30)
    fr.update(range(a - 15, a + 31))
for sid in DENSE:
    i = ids.index(sid)
    a = round(sc[i]["start"] * 30); b = round(sc[i + 1]["start"] * 30) if i + 1 < len(sc) else tot
    fr.update(range(a - 15, b + 15)); print(f"  {sid}: every frame {a - 15}-{b + 14}")
fr = sorted(x for x in fr if 0 <= x < tot)
(S / f"{tag}_frames.txt").write_text(",".join(map(str, fr)))
print(f"re-shoot list: {len(fr)} frames ({len(sc)} scene starts x 46 + s10) -> {S / f'{tag}_frames.txt'}")
want = set(fr)
src, dst = S / "stills" / old, S / "stills" / tag
assert src.is_dir(), f"no {old} stills"
pat = re.compile(r"^([fb])(\d+)\.(jpg|json)$")
n = skip = 0; t0 = time.time()
with os.scandir(src) as it:
    for e in it:
        m = pat.match(e.name)
        if not m:
            continue
        if int(m.group(2)) in want:
            skip += 1
            continue
        shutil.copy2(e.path, dst / e.name); n += 1
print(f"copied {n} files from {src} in {time.time() - t0:.0f} s; {skip} files inside the re-shoot list left to re-shoot")
EOF
[ $? -eq 0 ] || { echo "STOP: frame list / copy failed $(date)"; exit 1; }

# ---- 2. one heavy job at a time: RENDER2, HEAVY and VOICE free and >= 9 GB RAM, then take HEAVY.lock
ram_ok() { "$PY" -c "
import ctypes,sys
class M(ctypes.Structure): _fields_=[('l',ctypes.c_ulong),('load',ctypes.c_ulong),('tot',ctypes.c_ulonglong),('avail',ctypes.c_ulonglong)]+[(f'x{i}',ctypes.c_ulonglong) for i in range(5)]
m=M(); m.l=ctypes.sizeof(M); ctypes.windll.kernel32.GlobalMemoryStatusEx(ctypes.byref(m)); sys.exit(0 if m.avail/2**30>=9 else 1)"; }
echo "waiting for RENDER2 / HEAVY / VOICE free and >= 9 GB RAM $(date)"
until [ ! -d "$M/RENDER2.lock" ] && [ ! -d "$M/VOICE.lock" ] && [ ! -d "$L" ] && ram_ok && mkdir "$L" 2>/dev/null; do sleep 20; done
echo "#5d r8d SSR + K6 $TAG (fix loop r8d: every scene start -15..+30 + every frame of s10; stills only, no render) $(date)" > "$L/owner.txt"; echo "LOCK $(date)"
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

# ---- 5. light analysis: missing-stills check (one Python pass), overlap over the whole k6r8d folder, summary
echo "still-log ERROR lines: $(cat "$S"/stills/"$TAG"/log_*.txt 2>/dev/null | grep -c ERROR)"
"$PY" - "$S" "$TAG" "$OLD" <<'EOF'
import os, re, sys
from pathlib import Path
S, tag, old = Path(sys.argv[1]), sys.argv[2], sys.argv[3]
pat = re.compile(r"^([fb])(\d+)\.(jpg|json)$")
def scan(d):
    f, b = set(), set()
    with os.scandir(d) as it:
        for e in it:
            m = pat.match(e.name)
            if m:
                (f if m.group(1) == "f" else b).add(int(m.group(2)))
    return f, b
lst = [int(x) for x in (S / f"{tag}_frames.txt").read_text().split(",") if x.strip()]
full = sorted(set(lst) | {int(x) for x in (S / f"{old}_frames.txt").read_text().split(",") if x.strip()})
fj, bj = scan(S / "stills" / tag)
miss = [x for x in lst if x not in fj or x not in bj]
print(f"stills written: {len(lst) - len(miss)} of {len(lst)} (re-shoot list; still + box file)")
if miss:
    print(f"MISSING {len(miss)}: first {miss[:20]}")
mf = [x for x in full if x not in fj or x not in bj]
print(f"whole-movie coverage ({old} list + {tag} list): {len(full) - len(mf)} of {len(full)}" + (f"; MISSING first {mf[:20]}" if mf else ""))
EOF
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
