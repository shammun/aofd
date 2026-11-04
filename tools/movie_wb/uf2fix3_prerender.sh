#!/usr/bin/env bash
# Weather UF2 fix loop 3, before the render: sound mix (≈15 GB RAM, run ALONE), static swap/camera gates, K6 stills + overlap report.
# Run from the repo root only when no Remotion/Chrome job or other heavy job is running.
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
S="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_weather_basics/uf2"
PY="$R/.venv/Scripts/python.exe"
cd "$R" || exit 1
export TEMP="$S/tmp" TMP="$S/tmp"
echo "C: $(df -h /c | tail -1 | awk '{print $4}') free at start"
"$PY" tools/movie_wb/sound_mix.py "$S/fix3/tts/narration.wav" "$S/fix3/sound" > "$S/fix3/sound.log" 2>&1 || { echo MIXFAIL; tail -20 "$S/fix3/sound.log"; exit 1; }
ls -la "$S/fix3/sound"
node tools/movie_wb/swap_check.mjs 2>&1 | tail -5
node tools/movie_wb/cam_speed.mjs 2>&1 | tail -5
"$PY" tools/movie_wb/k6_fix3_frames.py "$S/k6fix3_frames.txt" || exit 1
"$PY" tools/movie_wb/stills_uf2.py k6fix3 --bundle --frames "$(cat "$S/k6fix3_frames.txt")" --jobs 3 > "$S/k6fix3.log" 2>&1
tail -3 "$S/k6fix3.log"
"$PY" tools/k6_overlap.py "$S/stills/k6fix3" --timing movies/ch00/ch00_weather_basics/timing.json --json "$S/k6fix3.json" 2>&1 | tail -4 | cut -c1-400
echo "C: $(df -h /c | tail -1 | awk '{print $4}') free at end"
echo PREDONE
