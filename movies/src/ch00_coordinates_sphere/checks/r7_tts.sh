#!/usr/bin/env bash
# ch00_coordinates_sphere (#5c) remake 2026-11-07: wait for the HEAVY lock, take it, run the re-voice splice (Kokoro, .venv-tts), release it.
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
L="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/HEAVY.lock"
S="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_sphere"
cd "$R" || exit 1
until mkdir "$L" 2>/dev/null; do sleep 20; done
echo "#5c remake r7 TTS splice $(date)" > "$L/owner.txt"
trap 'rm -r "$L"' EXIT
mkdir -p "$S/build1/tmp"; export TEMP="$S/build1/tmp" TMP="$S/build1/tmp"
date
[ -d "$S/r7/tts" ] && [ ! -d "$S/r7/tts_pass1" ] && cp -r "$S/r7/tts" "$S/r7/tts_pass1"
.venv-tts/Scripts/python.exe movies/src/ch00_coordinates_sphere/checks/cs_r7_splice.py || exit 1
date
.venv/Scripts/python.exe movies/src/ch00_coordinates_sphere/checks/make_timing.py --final "$S/r7/tts" || exit 1
.venv/Scripts/python.exe movies/src/ch00_coordinates_sphere/checks/r7_cuefix.py
.venv-tts/Scripts/python.exe movies/src/ch00_coordinates_sphere/checks/r7_wordtimes.py --json "$S/r7/wordtimes.json"
date
