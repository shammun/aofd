#!/usr/bin/env bash
# ch00_coordinates build 1: full render (22 chunks of 4000 frames, conc 2, ports 5600+, 240-s stall watchdog, 3 tries; resumable:
# finished chunks are kept, rerun to continue or pass --from N) -> refuse-partial join (every chunk present with its full frame
# count, else no join) -> 2-pass join to ≤ 150 MB -> movies/out copy + captions -> poster -> QA. Run ALONE, after co_prerender.sh
# and a clean K6 pass (stills/k6r2, 0 hits). TEMP/TMP on G:, C: guard 45 GB before every chunk.
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
S="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates/build1"
O="$R/movies/out/ch00/ch00_coordinates"
M="$R/movies/ch00/ch00_coordinates"
PY="$R/.venv/Scripts/python.exe"
cd "$R" || exit 1
mkdir -p "$S/tmp" "$O"; export TEMP="$S/tmp" TMP="$S/tmp"
"$PY" tools/disk_guard.py --report | tail -1
[ -f "$S/bundle/public/narration_music.wav" ] || { echo "bundle has no narration_music.wav: run co_prerender.sh first"; exit 2; }
T0=$(date +%s)
"$PY" movies/src/ch00_coordinates/checks/co_run.py render --conc 2 "$@" > "$S/render.log" 2>&1; echo "RENDER=$?"; tail -3 "$S/render.log"
echo "render wall time: $(( ($(date +%s) - T0) / 60 )) min"
"$PY" movies/src/ch00_coordinates/checks/co_run.py join --mb 150 > "$S/join.log" 2>&1 || { echo "JOIN REFUSED/FAILED"; tail -5 "$S/join.log"; exit 2; }
tail -2 "$S/join.log"
cp "$S/build1_1080.mp4" "$O/1080.mp4"; cp "$M/en.vtt" "$M/en.srt" "$O/"
(cd movies && npx remotion still "$S/bundle" Ch00Coordinates "$O/poster.jpg" --frame=200 --gl=angle --props='{"audio":""}' > /dev/null 2>&1); ls -la "$O"
"$PY" tools/movie_qa.py "$O/1080.mp4" --storyboard "$M/storyboard.yaml" --captions "$O/en.vtt" --script "$M/script.md" \
  --manifest "$M/manifest.json" --composition movies/src/ch00_coordinates/co_eq.ts --timing "$M/timing.json" \
  --sound-cues "$S/sound/sound_captions.json" --id ch00/ch00_coordinates \
  --overlap "$S/stills/k6r2" --hard-mb 160 --budget-mb 160 --duration-window 120,3600 > "$S/qa.log" 2>&1
cut -c1-220 "$S/qa.log"
"$PY" tools/disk_guard.py --report | tail -1
echo RDONE
