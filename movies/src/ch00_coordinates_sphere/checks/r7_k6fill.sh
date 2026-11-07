#!/usr/bin/env bash
# ch00_coordinates_sphere (#5c) remake 2026-11-07: SSR re-check, then shoot the K6 frames that k6r7c could not (s23 / s30 width errors, fixed
# after its bundle was built) INTO THE SAME TAG FOLDER k6r7c, then run k6_overlap over the whole folder (= the whole house list).
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
L="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/HEAVY.lock"
S="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_sphere/build1"
cd "$R" || exit 1
mkdir -p "$S/tmp"; export TEMP="$S/tmp" TMP="$S/tmp"
until [ ! -d "G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/VOICE.lock" ] && .venv/Scripts/python.exe movies/src/ch00_coordinates_sphere/checks/voice_ok.py --heavy && mkdir "$L" 2>/dev/null; do sleep 20; done
echo "#5c remake r7 SSR + K6 fill k6r7c $(date)" > "$L/owner.txt"; echo "LOCK $(date)"
(cd movies && node src/ch00_coordinates_sphere/checks/ssr/run.mjs --step 10 --public "$S/public" 2>&1 | tail -6)
(cd movies && node src/ch00_coordinates_sphere/checks/ssr/run.mjs --step 15 --3d 2>&1 | tail -4)
K6PORT=7400 .venv/Scripts/python.exe movies/src/ch00_coordinates_sphere/checks/cs_run.py stills k6r7c --bundle --jobs 2 --frames-file "$S/k6r7c_missing.txt" > "$S/k6r7c_fill_run.log" 2>&1
echo "stills exit $?"; rm -r "$L"; echo "UNLOCK $(date)"
grep -c ERROR "$S"/stills/k6r7c/log_*.txt
ls "$S/stills/k6r7c" | grep -c '^f.*jpg$'
.venv/Scripts/python.exe tools/k6_overlap.py "$S/stills/k6r7c" --timing movies/ch00/ch00_coordinates_sphere/timing.json --json "$S/stills/k6r7c_full_overlap.json" 2>&1 | tail -2
.venv/Scripts/python.exe "$S/k6sum.py" "$S/stills/k6r7c_full_overlap.json" | tail -30
date
