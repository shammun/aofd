#!/usr/bin/env bash
# ch00_coordinates_sphere (#5c) remake 2026-11-07: the heavy jobs one at a time, each under its own HEAVY.lock hold:
#   1. SSR + SSR --3d   2. sound mix (r7_mix.sh)   3. K6 stills of the WHOLE house list into ONE tag folder ($1, --jobs 2) + k6_overlap.
# usage: bash r7_heavy.sh TAG [ssr|mix|k6 ...]   (default: all three)
TAG=${1:?tag}; shift; STEPS=${*:-ssr mix k6}
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
L="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/HEAVY.lock"
S="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_sphere/build1"
cd "$R" || exit 1
take() { until mkdir "$L" 2>/dev/null; do sleep 20; done; echo "#5c remake r7 $1 $(date)" > "$L/owner.txt"; echo "LOCK $1 $(date)"; }
give() { rm -r "$L"; echo "UNLOCK $(date)"; }
mkdir -p "$S/tmp"; export TEMP="$S/tmp" TMP="$S/tmp"
for st in $STEPS; do
  case $st in
  ssr) take "SSR"; until .venv/Scripts/python.exe movies/src/ch00_coordinates_sphere/checks/voice_ok.py --heavy; do sleep 20; done
       (cd movies && node src/ch00_coordinates_sphere/checks/ssr/run.mjs --step 10 --public "$S/public" 2>&1 | tail -12)
       (cd movies && node src/ch00_coordinates_sphere/checks/ssr/run.mjs --step 15 --3d 2>&1 | tail -6)
       give ;;
  mix) bash movies/src/ch00_coordinates_sphere/checks/r7_mix.sh ;;   # VOICE.lock inside
  k6)  take "K6 stills $TAG"
       K6PORT=7400 .venv/Scripts/python.exe movies/src/ch00_coordinates_sphere/checks/cs_run.py stills "$TAG" --bundle --jobs 2 --frames-file "$S/k6r7_frames.txt" > "$S/${TAG}_run.log" 2>&1
       echo "stills exit $?"; give
       grep -c ERROR "$S"/stills/"$TAG"/log_*.txt
       .venv/Scripts/python.exe tools/k6_overlap.py "$S/stills/$TAG" --timing movies/ch00/ch00_coordinates_sphere/timing.json --json "$S/stills/${TAG}_overlap.json" 2>&1 | tail -2
       .venv/Scripts/python.exe "$S/k6sum.py" "$S/stills/${TAG}_overlap.json" > "$S/${TAG}_sum.txt"; tail -40 "$S/${TAG}_sum.txt" ;;
  esac
done
date
