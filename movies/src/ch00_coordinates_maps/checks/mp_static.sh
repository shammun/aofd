#!/usr/bin/env bash
# ch00_coordinates_maps (#5g): the static (no-browser) gates in one go, one process at a time. Run from anywhere; TEMP/TMP on G:.
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
S="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_maps/build1"
PY="$R/.venv/Scripts/python.exe"
cd "$R" || exit 1
mkdir -p "$S/tmp"; export TEMP="$S/tmp" TMP="$S/tmp"
echo "== tsc (errors in this movie / all)"; (cd movies && npx tsc --noEmit -p tsconfig.json 2>&1 | grep "error TS" > "$S/tsc.txt"; grep -c "ch00_coordinates_maps" "$S/tsc.txt"; grep -c "error TS" "$S/tsc.txt") < /dev/null
echo "== at_check";   node movies/src/ch00_coordinates_maps/checks/at_check.mjs < /dev/null | tail -8
echo "== swap_check"; node movies/src/ch00_coordinates_maps/checks/swap_check.mjs < /dev/null 2>&1 | tail -12
echo "== cam_speed";  node movies/src/ch00_coordinates_maps/checks/cam_speed.mjs < /dev/null 2>&1 | tail -8
echo "== symbol lint (Part 1 lessons C1/C2/C4, --strict)"; "$PY" tools/movie_symbol_lint.py --strict movies/src/ch00_coordinates_maps < /dev/null | tail -12
echo "== eq_check";   "$PY" movies/src/ch00_coordinates_maps/checks/eq_check.py < /dev/null
echo "== wording lint"; "$PY" tools/script_wording_lint.py movies/ch00/ch00_coordinates_maps/script.md < /dev/null | tail -1
[ "$1" = "--no-ssr" ] && exit 0
echo "== ssr";        (cd movies && node src/ch00_coordinates_maps/checks/ssr/run.mjs --step 10 --public "$S/public" < /dev/null 2>&1 | grep -v "THREE_CJS\|Replace \`const\|trace-deprecation" | tail -30)
echo "== ssr --3d";   (cd movies && node src/ch00_coordinates_maps/checks/ssr/run.mjs --step 15 --3d --public "$S/public" < /dev/null 2>&1 | grep -v "THREE_CJS\|Replace \`const\|trace-deprecation" | tail -30)
