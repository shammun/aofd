#!/usr/bin/env bash
# ch00_coordinates_sphere (#5c) fix loop 1: wait for the HEAVY lock, take it, run the re-voice splice (Kokoro, .venv-tts), release it.
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
L="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/HEAVY.lock"
S="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_sphere/build1"
cd "$R" || exit 1
until mkdir "$L" 2>/dev/null; do sleep 20; done
echo "#5c fix1 TTS splice $(date)" > "$L/owner.txt"
trap 'rm -r "$L"' EXIT
mkdir -p "$S/tmp"; export TEMP="$S/tmp" TMP="$S/tmp"
.venv-tts/Scripts/python.exe movies/src/ch00_coordinates_sphere/checks/cs_rf1_splice.py --selftest || exit 1
.venv-tts/Scripts/python.exe movies/src/ch00_coordinates_sphere/checks/cs_rf1_splice.py
