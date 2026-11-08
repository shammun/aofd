#!/usr/bin/env bash
# ch00_coordinates_sphere (#5c) pass 2 (user feedback 2026-11-07 22:20): look stills of the changed scenes, under HEAVY.lock (VOICE free,
# >= 12 GB free while a render holds RENDER2), new bundle, then release. usage: p2_look.sh TAG FRAMES_FILE [--ssr]
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
L="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/HEAVY.lock"
S="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_sphere/build1"
TAG="$1"; FF="$2"
cd "$R" || exit 1
mkdir -p "$S/tmp"; export TEMP="$S/tmp" TMP="$S/tmp"
until [ ! -d "G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/VOICE.lock" ] && .venv/Scripts/python.exe movies/src/ch00_coordinates_sphere/checks/voice_ok.py --heavy && mkdir "$L" 2>/dev/null; do sleep 20; done
echo "#5c pass2 look stills $TAG $(date)" > "$L/owner.txt"; echo "LOCK $(date)"
if [ "$3" = "--ssr" ]; then
  (cd movies && node src/ch00_coordinates_sphere/checks/ssr/run.mjs --step 10 --public "$S/public" 2>&1 | tail -8)
  (cd movies && node src/ch00_coordinates_sphere/checks/ssr/run.mjs --step 15 --3d 2>&1 | tail -6)
fi
K6PORT=7600 .venv/Scripts/python.exe movies/src/ch00_coordinates_sphere/checks/cs_run.py stills "$TAG" --bundle --jobs 2 --frames-file "$FF" > "$S/${TAG}_run.log" 2>&1
echo "stills exit $?"; rm -r "$L"; echo "UNLOCK $(date)"
grep -c ERROR "$S"/stills/"$TAG"/log_*.txt
ls "$S/stills/$TAG" | grep -c '^f.*jpg$'
