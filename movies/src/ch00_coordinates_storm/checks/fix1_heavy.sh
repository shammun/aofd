#!/usr/bin/env bash
# ch00_coordinates_storm (#5b) fix loop 1 (2026-11-07): the heavy pass under HEAVY.lock (lock rule 2026-11-07: VOICE.lock free, RAM >= 12 GB;
# may overlap a render): SSR --step 10 and --3d, the bundle, the K6 stills of the frame plan (fix1_frames.py: the whole house list + the changed
# scenes every 1 s + the reveal moments) into ONE tag folder, then tools/k6_overlap.py on the whole folder.
# usage: fix1_heavy.sh TAG [scenes-only frames file]   (with a frames file: re-shoot those frames into the same TAG folder, then K6 on all)
set -o pipefail
TAG="${1:-k6f1}"; FR="$2"
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
Q="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies"
L="$Q/HEAVY.lock"; V="$Q/VOICE.lock"
S="$Q/ch00_coordinates_storm/build1"
PY="$R/.venv/Scripts/python.exe"
cd "$R" || exit 1
ram() { "$PY" -c "import psutil;print(int(psutil.virtual_memory().available/1e9))"; }
until [ ! -d "$V" ] && [ "$(ram)" -ge 12 ] && mkdir "$L" 2>/dev/null; do sleep 30; done
if [ -d "$V" ]; then rm -r "$L"; echo "VOICE.lock appeared; retry"; exit 3; fi
echo "#5b fix1 heavy (SSR + K6 stills $TAG) $(date)" > "$L/owner.txt"
trap 'rm -r "$L"; echo "HEAVY.lock released $(date)"' EXIT
echo "HEAVY.lock taken $(date), RAM $(ram) GB"; "$PY" tools/disk_guard.py --report | tail -1
mkdir -p "$S/tmp"; export TEMP="$S/tmp" TMP="$S/tmp"
if [ -z "$SKIPSSR" ]; then
  echo "== ssr $(date)"
  (cd movies && node src/ch00_coordinates_storm/checks/ssr/run.mjs --step 10 --public "$S/public" 2>&1 | grep -v "THREE_CJS\|Replace \`const\|trace-deprecation" | tail -14)
  echo "== ssr --3d $(date)"
  (cd movies && node src/ch00_coordinates_storm/checks/ssr/run.mjs --step 10 --3d --public "$S/public" 2>&1 | grep -v "THREE_CJS\|Replace \`const\|trace-deprecation" | tail -6)
fi
echo "== stills $(date)"
if [ -z "$FR" ]; then
  "$PY" movies/src/ch00_coordinates_storm/checks/fix1_frames.py "$TAG" || exit 1
  "$PY" movies/src/ch00_coordinates_storm/checks/cst_run.py stills "$TAG" --bundle --frames-file "$S/${TAG}_frames.txt" --jobs 2 || exit 1
else
  "$PY" movies/src/ch00_coordinates_storm/checks/cst_run.py stills "$TAG" --bundle --frames-file "$FR" --jobs 2 || exit 1
fi
echo "== k6 $(date)"
"$PY" tools/k6_overlap.py "$S/stills/$TAG" --json "$S/stills/${TAG}_overlap.json" --timing movies/ch00/ch00_coordinates_storm/timing.json 2>&1 | tail -4
"$PY" "$S/k6sum.py" "$S/stills/${TAG}_overlap.json" > "$S/stills/${TAG}_sum.txt"; tail -40 "$S/stills/${TAG}_sum.txt"
"$PY" tools/disk_guard.py --report | tail -1
echo "== done $(date)"
