#!/usr/bin/env bash
# ch00_coordinates_sphere (#5c): the static (no-browser) gates in one go. Run from anywhere; TEMP/TMP on G:.
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
S="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_sphere/build1"
PY="$R/.venv/Scripts/python.exe"
cd "$R" || exit 1
mkdir -p "$S/tmp"; export TEMP="$S/tmp" TMP="$S/tmp"
echo "== tsc";        (cd movies && npx tsc --noEmit -p tsconfig.json 2>&1 | grep -c "error TS" )
echo "== at_check";   node movies/src/ch00_coordinates_sphere/checks/at_check.mjs | tail -8
echo "== swap_check"; node movies/src/ch00_coordinates_sphere/checks/swap_check.mjs 2>&1 | tail -12
echo "== cam_speed";  node movies/src/ch00_coordinates_sphere/checks/cam_speed.mjs 2>&1 | tail -3
echo "== symbol lint (Part 1 lessons C1/C2/C4, --strict)"; "$PY" tools/movie_symbol_lint.py --strict movies/src/ch00_coordinates_sphere < /dev/null | tail -12
echo "== eq_check";   "$PY" movies/src/ch00_coordinates_sphere/checks/eq_check.py
echo "== ssr";        (cd movies && node src/ch00_coordinates_sphere/checks/ssr/run.mjs --step 10 --public "$S/public" 2>&1 | tail -30)
echo "== ssr --3d";   (cd movies && node src/ch00_coordinates_sphere/checks/ssr/run.mjs --step 15 --3d 2>&1 | tail -10)
echo "== timing (final TTS, build 1)"; "$PY" -c "import json,sys; t=json.load(open('movies/ch00/ch00_coordinates_sphere/timing.json',encoding='utf-8')); ok='provisional' not in t and not t['warnings'] and t['self_check']['len_ok'] and t['self_check']['cues_ok']; print('final' if ok else 'NOT FINAL', t['total_s'], 's', t['total_frames'], 'frames', t['cues'], 'cues'); sys.exit(0 if ok else 1)"
