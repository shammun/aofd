#!/usr/bin/env bash
# ch00_coordinates_sphere (#5c) fix loop 1: sound mix of the spliced narration (HEAVY lock). The build-1 mix is kept as sound_build1/ (copy).
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
L="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/HEAVY.lock"
S="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_sphere/build1"
cd "$R" || exit 1
until mkdir "$L" 2>/dev/null; do sleep 20; done
echo "#5c fix1 sound mix $(date)" > "$L/owner.txt"
trap 'rm -r "$L"' EXIT
mkdir -p "$S/tmp"; export TEMP="$S/tmp" TMP="$S/tmp"
[ -d "$S/sound_build1" ] || cp -r "$S/sound" "$S/sound_build1"
.venv/Scripts/python.exe tools/sound/mix.py --narration "$S/rf1/tts/narration.wav" --cues movies/ch00/ch00_coordinates_sphere/sound.yaml \
  --timing movies/ch00/ch00_coordinates_sphere/timing.json --out-dir "$S/sound" || exit 1
cp "$S/sound/narration_music.wav" "$S/sound/narration_music_cs.wav"
ffmpeg -hide_banner -nostats -i "$S/sound/narration_music_cs.wav" -af ebur128=peak=true -f null - 2>&1 | grep -E "I:|Peak:" | tail -3
