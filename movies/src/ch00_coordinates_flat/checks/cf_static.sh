#!/usr/bin/env bash
# ch00_coordinates_flat (#5a): the static (no-browser) gates in one go. Run from anywhere; TEMP/TMP on G:.
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
S="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_flat/build1"
PY="$R/.venv/Scripts/python.exe"
cd "$R" || exit 1
mkdir -p "$S/tmp"; export TEMP="$S/tmp" TMP="$S/tmp"
echo "== tsc";        (cd movies && npx tsc --noEmit -p tsconfig.json 2>&1 | grep -c "error TS" )
echo "== at_check";   node movies/src/ch00_coordinates_flat/checks/at_check.mjs | tail -8
echo "== swap_check"; node movies/src/ch00_coordinates_flat/checks/swap_check.mjs 2>&1 | tail -12
echo "== cam_speed";  node movies/src/ch00_coordinates_flat/checks/cam_speed.mjs 2>&1 | tail -3
echo "== eq_check";   "$PY" movies/src/ch00_coordinates_flat/checks/eq_check.py
echo "== ssr";        (cd movies && node src/ch00_coordinates_flat/checks/ssr/run.mjs --step 10 --public "$S/public" 2>&1 | grep -v "THREE_CJS\|Replace \`const\|trace-deprecation" | tail -30)
