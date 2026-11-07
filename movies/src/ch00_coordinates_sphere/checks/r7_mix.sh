#!/usr/bin/env bash
# ch00_coordinates_sphere (#5c) remake 2026-11-07: sound mix of the r7 narration (HEAVY lock) into <scratch>/build1/sound_r7 (the rf1 mix in
# build1/sound stays as it is; the render step moves it aside and installs sound_r7, see the remake log).
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
L="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/VOICE.lock"
S="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_sphere"
cd "$R" || exit 1
H="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/HEAVY.lock"
until ! grep -qiE "K6|stills|SSR" "$H/owner.txt" 2>/dev/null && mkdir "$L" 2>/dev/null; do sleep 20; done
echo "#5c remake r7 sound mix $(date)" > "$L/owner.txt"
until "$R/.venv/Scripts/python.exe" movies/src/ch00_coordinates_sphere/checks/voice_ok.py --mix; do rm -r "$L"; sleep 20; until mkdir "$L" 2>/dev/null; do sleep 20; done; echo "#5c remake r7 sound mix (waiting for RAM / HEAVY) $(date)" > "$L/owner.txt"; done   # tightened protocol: HEAVY free or a full render, RAM >= 8 GB; VOICE released while waiting (no deadlock with a K6 that waits for VOICE)
trap 'rm -r "$L"' EXIT
mkdir -p "$S/build1/tmp" "$S/build1/sound_r7"; export TEMP="$S/build1/tmp" TMP="$S/build1/tmp"
.venv/Scripts/python.exe tools/sound/mix.py --narration "$S/r7/tts/narration.wav" --cues movies/ch00/ch00_coordinates_sphere/sound.yaml \
  --timing movies/ch00/ch00_coordinates_sphere/timing.json --out-dir "$S/build1/sound_r7" || exit 1
cp "$S/build1/sound_r7/narration_music.wav" "$S/build1/sound_r7/narration_music_cs.wav"
ffmpeg -hide_banner -nostats -i "$S/build1/sound_r7/narration_music_cs.wav" -af ebur128=peak=true -f null - 2>&1 | grep -E "I:|Peak:" | tail -3
.venv/Scripts/python.exe tools/sound/check.py --kind mix "$S/build1/sound_r7/narration_music_cs.wav" 2>&1 | tail -6
