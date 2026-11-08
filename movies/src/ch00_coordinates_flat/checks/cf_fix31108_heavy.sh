#!/usr/bin/env bash
# ch00_coordinates_flat (#5a) fix 3 (2026-11-08): the queued heavy pass (SSR + K6 stills) into ONE new tag folder. Screen-only fix
# (headings, labels, rows); no re-voice, no timing change. Never renders the movie, never commits, never deletes.
# Waits until ALL of: RENDER2.lock, HEAVY.lock and VOICE.lock are free; Part 3's queued K6 has run (its k6p2b overlap json exists) OR
# the GO file ch00_coordinates_flat/GO_FIX3 exists; RAM >= 12 GB. Then takes HEAVY.lock (mkdir, atomic) and runs:
#   SSR --step 10 · the K6 frame plan (cf_fix31108_frames.py) · the unchanged-scene interior stills copied from k6z3 · the rest rendered
#   (--jobs 2, fresh bundle from the current sources) · tools/k6_overlap.py on the whole folder · the hit summary.
# usage: cf_fix31108_heavy.sh [tag]   (default k6z4)
set -o pipefail
TAG="${1:-k6z4}"; OLD="k6z3"
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
Q="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies"
L="$Q/HEAVY.lock"; V="$Q/VOICE.lock"; R2="$Q/RENDER2.lock"
S="$Q/ch00_coordinates_flat/build1"
GO="$Q/ch00_coordinates_flat/GO_FIX3"
P3="$Q/ch00_coordinates_sphere/build1/stills"
PY="$R/.venv/Scripts/python.exe"
cd "$R" || exit 1
ram() { "$PY" -c "import psutil;print(int(psutil.virtual_memory().available/1e9))"; }
p3_done() { [ -f "$P3/k6p2b_overlap.json" ] || ls "$P3"/k6p2b*overlap*.json >/dev/null 2>&1 || ls "$P3/k6p2b"/*overlap*.json >/dev/null 2>&1; }
ready() { [ ! -d "$R2" ] && [ ! -d "$L" ] && [ ! -d "$V" ] && { p3_done || [ -e "$GO" ]; } && [ "$(ram)" -ge 12 ]; }
echo "queued $(date) (tag $TAG): waiting for RENDER2/HEAVY/VOICE locks free + Part 3 k6p2b overlap json (or $GO) + RAM >= 12 GB"
while true; do
  until ready; do sleep 60; done
  mkdir "$L" 2>/dev/null || continue                      # someone else took HEAVY.lock first: wait again
  if [ -d "$R2" ] || [ -d "$V" ]; then rm -r "$L"; continue; fi   # a render or voice job started in between: give the lock back
  break
done
echo "#5a fix3 heavy (SSR + K6 stills $TAG) $(date)" > "$L/owner.txt"
trap 'rm -r "$L"; echo "HEAVY.lock released $(date)"' EXIT
echo "HEAVY.lock taken $(date), RAM $(ram) GB; Part 3 k6p2b json: $(p3_done && echo yes || echo no); GO file: $([ -e "$GO" ] && echo yes || echo no)"
echo "== disk before"; "$PY" tools/disk_guard.py --report | tail -1
mkdir -p "$S/tmp"; export TEMP="$S/tmp" TMP="$S/tmp"
echo "== ssr $(date)"
(cd movies && node src/ch00_coordinates_flat/checks/ssr/run.mjs --step 10 --public "$S/public" 2>&1 | grep -v "THREE_CJS\|Replace \`const\|trace-deprecation" | tail -14)
echo "== frames $(date)"
"$PY" movies/src/ch00_coordinates_flat/checks/cf_fix31108_frames.py "$TAG" || exit 1
mkdir -p "$S/stills/$TAG"
"$PY" - "$S" "$TAG" "$OLD" <<'EOF'
import shutil, sys
from pathlib import Path
S, tag, old = Path(sys.argv[1]), sys.argv[2], sys.argv[3]
src, dst = S / "stills" / old, S / "stills" / tag
n, redo = 0, []
for f in (S / f"{tag}_copy.txt").read_text().split(","):
    if not f.strip():
        continue
    f = int(f)
    nms = (f"b{f:05d}.json", f"f{f:05d}.jpg")
    if all((src / nm).exists() for nm in nms):
        for nm in nms:
            shutil.copy2(src / nm, dst / nm); n += 1
    else:
        redo.append(f)
if redo:   # a still missing in the old folder is rendered instead
    rp = S / f"{tag}_render.txt"
    fr = sorted({int(x) for x in rp.read_text().split(",") if x.strip()} | set(redo))
    rp.write_text(",".join(map(str, fr)))
print(f"copied {n} files from {old}; {len(redo)} frame(s) missing there, added to the render list")
EOF
[ $? -eq 0 ] || exit 1
echo "== stills $(date)"
"$PY" movies/src/ch00_coordinates_flat/checks/cf_run.py stills "$TAG" --bundle --frames-file "$S/${TAG}_render.txt" --jobs 2 || exit 1
echo "== k6 $(date)"
"$PY" tools/k6_overlap.py "$S/stills/$TAG" --json "$S/stills/${TAG}_overlap.json" --timing movies/ch00/ch00_coordinates_flat/timing.json 2>&1 | tail -8
"$PY" "$S/k6sum.py" "$S/stills/${TAG}_overlap.json" > "$S/stills/${TAG}_sum.txt"; tail -40 "$S/stills/${TAG}_sum.txt"
echo "== disk after"; "$PY" tools/disk_guard.py --report | tail -1
echo "== done $(date)  (stills: $S/stills/$TAG, hits: $S/stills/${TAG}_overlap.json + ${TAG}_sum.txt, look list: $S/${TAG}_look.json)"
