#!/usr/bin/env bash
# Weather UF2 fix loop 3: full render (27 chunks) -> two-pass join to <= 152 MB -> movies/out copy -> QA -> source_check -> vscan.
# Run ALONE, after uf2fix3_prerender.sh and a clean K6 pass (stills/k6fix3, 0 hits). Resumable: render_uf2.py keeps finished chunks.
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
S="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_weather_basics/uf2"
O="$R/movies/out/ch00/ch00_weather_basics"
M="$R/movies/ch00/ch00_weather_basics"
PY="$R/.venv/Scripts/python.exe"
cd "$R" || exit 1
export TEMP="$S/tmp" TMP="$S/tmp"
echo "C: $(df -h /c | tail -1 | awk '{print $4}') free at start"
[ -d "$S/render_fix2" ] || { [ -d "$S/render" ] && mv "$S/render" "$S/render_fix2"; }
"$PY" tools/movie_wb/render_uf2.py > "$S/render_fix3.log" 2>&1; echo "RENDER=$?"; tail -3 "$S/render_fix3.log"
NC=$(ls "$S/render"/c*.mp4 2>/dev/null | wc -l); echo "chunks: $NC"
[ "$NC" -ge 27 ] || { echo "INCOMPLETE: $NC of 27 chunks, not joining"; exit 2; }
"$PY" tools/movie_wb/join2pass.py "$S/render" "$S/fix3/sound/narration_music.wav" "$S/fix3_1080.mp4" --mb 152 --abr 128k --alim 0.5 > "$S/join_fix3.log" 2>&1 || { echo JOINFAIL; tail -20 "$S/join_fix3.log"; exit 1; }
tail -2 "$S/join_fix3.log"
[ -f "$O/fix2_1080.mp4" ] || mv "$O/1080.mp4" "$O/fix2_1080.mp4"
cp "$S/fix3_1080.mp4" "$O/1080.mp4"
cp "$M/en.vtt" "$M/en.srt" "$O/"
"$PY" tools/movie_qa.py "$O/1080.mp4" --storyboard "$M/storyboard.yaml" --captions "$O/en.vtt" --script "$M/script.md" \
  --manifest "$M/manifest.json" --composition movies/src/ch00_weather_basics/WeatherBasics.tsx --timing "$M/timing.json" \
  --sound-cues "$S/fix3/sound/sound_captions.json" --id ch00/ch00_weather_basics \
  --overlap "$S/stills/k6fix3" --hard-mb 160 --budget-mb 160 --duration-window 120,3600 > "$S/qa_fix3.log" 2>&1
cut -c1-220 "$S/qa_fix3.log"
echo "C: $(df -h /c | tail -1 | awk '{print $4}') free at end"
echo RDONE
