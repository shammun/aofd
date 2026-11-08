#!/usr/bin/env bash
# ch00_coordinates_frames (#5d) remake 2026-11-07, heavy step 1 under the HEAVY lock: the narration splice (Kokoro, only the new sentences),
# the final timing + cues, the sound mix. One heavy job at a time; the lock is released on exit.
set -o pipefail
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
L="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/HEAVY.lock"
S="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_frames"
cd "$R" || exit 1
until mkdir "$L" 2>/dev/null; do sleep 30; done
echo "#5d remake r7 heavy 1 (TTS splice + mix) $(date)" > "$L/owner.txt"
trap 'rm -r "$L"' EXIT
echo "lock taken $(date)"
mkdir -p "$S/build1/tmp"; export TEMP="$S/build1/tmp" TMP="$S/build1/tmp"
.venv/Scripts/python.exe tools/disk_guard.py --report
.venv-tts/Scripts/python.exe movies/src/ch00_coordinates_frames/checks/fr_r7_splice.py || exit 1
.venv/Scripts/python.exe movies/src/ch00_coordinates_frames/checks/final_timing.py --final "$S/r7/tts" || exit 1
.venv/Scripts/python.exe movies/src/ch00_coordinates_frames/checks/final_timing.py --recue --write || echo "RECUE: cps above 17 (see above)"
.venv/Scripts/python.exe movies/src/ch00_coordinates_frames/checks/fr_mix.py "$S/r7/tts/narration.wav" "$S/build1/sound_r7" || exit 1
ffmpeg -hide_banner -nostats -i "$S/build1/sound_r7/narration_music_fr.wav" -af ebur128=peak=true -f null - 2>&1 | grep -E "I:|Peak:" | tail -3
.venv/Scripts/python.exe tools/disk_guard.py --report
echo "heavy 1 done $(date)"
