#!/usr/bin/env bash
# ch00_coordinates_flat fix 1 after fb1 (2026-11-07): the heavy pass under HEAVY.lock (taken by the caller): SSR --step 10, the K6 frame
# list + look frames, bundle + stills (one tag, --jobs 2), K6 overlap over the whole house list. Releases nothing (the caller does).
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
S="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_flat/build1"
PY="$R/.venv/Scripts/python.exe"
TAG="${TAG:-k6y1}"
cd "$R" || exit 1
mkdir -p "$S/tmp"; export TEMP="$S/tmp" TMP="$S/tmp"
echo "== ssr $(date)"
[ -n "$SKIPSSR" ] || (cd movies && node src/ch00_coordinates_flat/checks/ssr/run.mjs --step 10 --public "$S/public" 2>&1 | grep -v "THREE_CJS\|Replace \`const\|trace-deprecation" | tail -12)
echo "== frames $(date)"
"$PY" movies/src/ch00_coordinates_flat/checks/cf_run.py frames
"$PY" movies/src/ch00_coordinates_flat/checks/cf_fix1107_look.py "$S/${TAG}_frames.txt" "$S/${TAG}_look.json"
echo "== stills $(date)"
"$PY" movies/src/ch00_coordinates_flat/checks/cf_run.py stills "$TAG" --bundle --frames-file "$S/${TAG}_frames.txt" --jobs 2
echo "== k6 $(date)"
"$PY" tools/k6_overlap.py "$S/stills/$TAG" --json "$S/stills/${TAG}_overlap.json" --timing movies/ch00/ch00_coordinates_flat/timing.json 2>&1 | tail -6
"$PY" "$S/k6sum.py" "$S/stills/${TAG}_overlap.json" > "$S/stills/${TAG}_sum.txt"; tail -40 "$S/stills/${TAG}_sum.txt"
echo "== done $(date)"
