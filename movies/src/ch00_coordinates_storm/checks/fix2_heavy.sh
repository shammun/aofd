#!/usr/bin/env bash
# ch00_coordinates_storm (#5b) fix loop 2 (2026-11-08): the queued heavy pass (SSR + K6 stills) into ONE new tag folder, alone. Screen-only fix
# (s14 f v rows, colour-bar names, headings, labels, beta arcs, swipes); no re-voice, no timing change. Never renders the movie, never commits,
# never deletes.
# Order: the CANCEL file is checked first (and on every wait); then waits until ALL of: Part 1's queued heavy pass has released HEAVY.lock
# ("released" in ch00_coordinates_flat/fix31108/heavy_run.log); RENDER2.lock, HEAVY.lock and VOICE.lock are free; RAM >= 12 GB.
# Then takes HEAVY.lock (mkdir, atomic; given back if a render or voice job started in between) and runs: SSR --step 10 and --3d · the K6
# frame plan (fix2_frames.py: the whole house list + every 1 s, sentence starts and number words of the 18 changed scenes) · all stills rendered
# fresh into build1/stills/<TAG> (--jobs 2, fresh bundle from the current sources) · tools/k6_overlap.py on the whole folder · the hit summary.
# usage: fix2_heavy.sh [tag]   (default k6f2)
set -o pipefail
TAG="${1:-k6f2}"
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
Q="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies"
L="$Q/HEAVY.lock"; V="$Q/VOICE.lock"; R2="$Q/RENDER2.lock"
S="$Q/ch00_coordinates_storm/build1"
CANCEL="$Q/ch00_coordinates_storm/CANCEL_FIX2"
P1LOG="$Q/ch00_coordinates_flat/fix31108/heavy_run.log"
PY="$R/.venv/Scripts/python.exe"
cd "$R" || exit 1
cancelled() { if [ -e "$CANCEL" ]; then echo "CANCEL_FIX2 found $(date): not run"; return 0; fi; return 1; }
ram() { "$PY" -c "import psutil;print(int(psutil.virtual_memory().available/1e9))"; }
p1_done() { [ -f "$P1LOG" ] && grep -q "released" "$P1LOG"; }
ready() { p1_done && [ ! -d "$R2" ] && [ ! -d "$L" ] && [ ! -d "$V" ] && [ "$(ram)" -ge 12 ]; }
cancelled && exit 0
echo "queued $(date) (tag $TAG): waiting for Part 1's heavy pass to release HEAVY.lock + RENDER2/HEAVY/VOICE locks free + RAM >= 12 GB"
while true; do
  until ready; do cancelled && exit 0; sleep 60; done
  cancelled && exit 0
  mkdir "$L" 2>/dev/null || continue                              # someone else took HEAVY.lock first: wait again
  if [ -d "$R2" ] || [ -d "$V" ]; then rm -r "$L"; continue; fi   # a render or voice job started in between: give the lock back
  break
done
echo "#5b fix2 heavy (SSR + K6 stills $TAG) $(date)" > "$L/owner.txt"
trap 'rm -r "$L"; echo "HEAVY.lock released $(date)"' EXIT
echo "HEAVY.lock taken $(date), RAM $(ram) GB"
echo "== disk before"; "$PY" tools/disk_guard.py --report | tail -1
mkdir -p "$S/tmp"; export TEMP="$S/tmp" TMP="$S/tmp"
echo "== ssr $(date)"
(cd movies && node src/ch00_coordinates_storm/checks/ssr/run.mjs --step 10 --public "$S/public" 2>&1 | grep -v "THREE_CJS\|Replace \`const\|trace-deprecation" | tail -14)
echo "== ssr --3d $(date)"
(cd movies && node src/ch00_coordinates_storm/checks/ssr/run.mjs --step 10 --3d --public "$S/public" 2>&1 | grep -v "THREE_CJS\|Replace \`const\|trace-deprecation" | tail -6)
echo "== frames $(date)"
"$PY" movies/src/ch00_coordinates_storm/checks/fix2_frames.py "$TAG" || exit 1
if [ -d "$S/stills/$TAG" ] && [ -n "$(ls -A "$S/stills/$TAG" 2>/dev/null)" ]; then echo "stills/$TAG is not empty: stop (one new tag folder per run)"; exit 1; fi
echo "== stills $(date)"
"$PY" movies/src/ch00_coordinates_storm/checks/cst_run.py stills "$TAG" --bundle --frames-file "$S/${TAG}_frames.txt" --jobs 2 || exit 1
echo "== k6 $(date)"
"$PY" tools/k6_overlap.py "$S/stills/$TAG" --json "$S/stills/${TAG}_overlap.json" --timing movies/ch00/ch00_coordinates_storm/timing.json 2>&1 | tail -8
"$PY" "$S/k6sum.py" "$S/stills/${TAG}_overlap.json" > "$S/stills/${TAG}_sum.txt"; tail -40 "$S/stills/${TAG}_sum.txt"
echo "== disk after"; "$PY" tools/disk_guard.py --report | tail -1
echo "== done $(date)  (stills: $S/stills/$TAG, hits: $S/stills/${TAG}_overlap.json + ${TAG}_sum.txt)"
