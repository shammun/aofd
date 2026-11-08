#!/usr/bin/env bash
# ch00_coordinates_sphere (#5c) pass 2: after the k6p2b fault (s16 label crossed by the equator line), re-shoot ONLY the s16 frames of the
# k6p2b list INTO k6p2b (new bundle), then k6_overlap over the whole k6p2b folder. One heavy job at a time: waits until HEAVY.lock,
# VOICE.lock and RENDER2.lock are all free, takes HEAVY.lock, releases it before the (light) overlap analysis.
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
M="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies"
L="$M/HEAVY.lock"
S="$M/ch00_coordinates_sphere/build1"
cd "$R" || exit 1
mkdir -p "$S/tmp"; export TEMP="$S/tmp" TMP="$S/tmp"
until [ ! -d "$M/VOICE.lock" ] && [ ! -d "$M/RENDER2.lock" ] && mkdir "$L" 2>/dev/null; do sleep 20; done
echo "#5c pass2 K6 s16 fill k6p2b $(date)" > "$L/owner.txt"; echo "LOCK $(date)"
K6PORT=7900 .venv/Scripts/python.exe movies/src/ch00_coordinates_sphere/checks/cs_run.py stills k6p2b --bundle --jobs 2 --frames-file "$S/k6p2b_s16.txt" > "$S/k6p2b_fill_run_$(date +%H%M%S).log" 2>&1
echo "stills exit $?"; rm -r "$L"; echo "UNLOCK $(date)"
grep -c ERROR "$S"/stills/k6p2b/log_*.txt
ls "$S/stills/k6p2b" | grep -c '^f.*jpg$'
.venv/Scripts/python.exe tools/k6_overlap.py "$S/stills/k6p2b" --timing movies/ch00/ch00_coordinates_sphere/timing.json --json "$S/stills/k6p2b_overlap.json" 2>&1 | tail -2
.venv/Scripts/python.exe "$S/k6sum.py" "$S/stills/k6p2b_overlap.json" | tail -30
echo "DONE $(date)"
