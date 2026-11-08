#!/usr/bin/env bash
# ch00_coordinates_sphere (#5c) pass 2 (user feedback 2026-11-07 22:20): SSR 2-D + 3-D, then K6 over the WHOLE house list in one new tag
# folder, under HEAVY.lock (VOICE free, >= 12 GB free while a render holds RENDER2); lock released before the (light) overlap analysis.
# usage: p2_heavy.sh TAG [FRAMES_FILE]
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
L="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/HEAVY.lock"
S="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_sphere/build1"
TAG="$1"; FF="${2:-$S/k6p2_frames.txt}"
cd "$R" || exit 1
mkdir -p "$S/tmp"; export TEMP="$S/tmp" TMP="$S/tmp"
# orchestrator 2026-11-07 23:5x (renders first): start only once Part 1's full render holds RENDER2.lock ("orchestrator 5a fix2 full render")
R2="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/RENDER2.lock"
until grep -qi "5a fix2 full render" "$R2/owner.txt" 2>/dev/null && [ ! -d "G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/VOICE.lock" ] && .venv/Scripts/python.exe movies/src/ch00_coordinates_sphere/checks/voice_ok.py --heavy && mkdir "$L" 2>/dev/null; do sleep 20; done
echo "#5c pass2 SSR + K6 $TAG $(date)" > "$L/owner.txt"; echo "LOCK $(date)"
echo "== ssr 2-D"; (cd movies && node src/ch00_coordinates_sphere/checks/ssr/run.mjs --step 10 --public "$S/public" 2>&1 | tail -8)
echo "== ssr 3-D"; (cd movies && node src/ch00_coordinates_sphere/checks/ssr/run.mjs --step 15 --3d 2>&1 | tail -6)
K6PORT=7800 .venv/Scripts/python.exe movies/src/ch00_coordinates_sphere/checks/cs_run.py stills "$TAG" --bundle --jobs 3 --frames-file "$FF" > "$S/${TAG}_run.log" 2>&1
echo "stills exit $?"; rm -r "$L"; echo "UNLOCK $(date)"
grep -c ERROR "$S"/stills/"$TAG"/log_*.txt
ls "$S/stills/$TAG" | grep -c '^f.*jpg$'
.venv/Scripts/python.exe tools/k6_overlap.py "$S/stills/$TAG" --timing movies/ch00/ch00_coordinates_sphere/timing.json --json "$S/stills/${TAG}_overlap.json" 2>&1 | tail -2
.venv/Scripts/python.exe "$S/k6sum.py" "$S/stills/${TAG}_overlap.json" | tail -30
echo "DONE $(date)"
