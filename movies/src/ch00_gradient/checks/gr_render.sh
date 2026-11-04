#!/usr/bin/env bash
# ch00_gradient (#6) build 1: full render (adapted 2026-11-04 from ch00_coordinates/checks/co_render.sh, unchanged).
# 15 chunks of 4000 frames, conc 2, ports 5800+, 240-s stall watchdog, 3 tries; resumable (finished chunks are kept: rerun, or
# pass --from N / --only 3,7) -> refuse-partial join (every chunk present with its full frame count, else no join) -> 2-pass join
# to ≤ 100 MB -> movies/out copy + captions -> poster (props via a file) -> QA. Run ALONE, after gr_prerender.sh and a clean K6
# pass; K6TAG names the clean stills set (default k6b1). TEMP/TMP on G:, C: guard 45 GB before every chunk (gr_run.py guard()).
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
S="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_gradient/build1"
O="$R/movies/out/ch00/ch00_gradient"
M="$R/movies/ch00/ch00_gradient"
PY="$R/.venv/Scripts/python.exe"
K6TAG="${K6TAG:-k6b1}"
cd "$R" || exit 1
mkdir -p "$S/tmp" "$O"; export TEMP="$S/tmp" TMP="$S/tmp"
FREE=$(df -BG /c | tail -1 | awk '{print $4}' | tr -d G); echo "C: ${FREE} GB free at start"; [ "$FREE" -ge 45 ] || { echo "STOP: C: < 45 GB"; exit 3; }
"$PY" tools/disk_guard.py --report | tail -1
[ -f "$S/bundle/public/narration_music.wav" ] || { echo "bundle has no narration_music.wav: run gr_prerender.sh first"; exit 2; }
T0=$(date +%s)
"$PY" movies/src/ch00_gradient/checks/gr_run.py render --conc 2 "$@" > "$S/render.log" 2>&1; echo "RENDER=$?"; tail -3 "$S/render.log"
echo "render wall time: $(( ($(date +%s) - T0) / 60 )) min"
"$PY" movies/src/ch00_gradient/checks/gr_run.py join --mb 100 > "$S/join.log" 2>&1 || { echo "JOIN REFUSED/FAILED"; tail -5 "$S/join.log"; exit 2; }
tail -2 "$S/join.log"
cp "$S/build1_1080.mp4" "$O/1080.mp4"; cp "$M/en.vtt" "$M/en.srt" "$O/"
printf '{"audio":""}' > "$S/poster_props.json"
(cd movies && npx remotion still "$S/bundle" Ch00Gradient "$O/poster.jpg" --frame=200 --gl=angle --props="$S/poster_props.json" > /dev/null 2>&1); ls -la "$O"
"$PY" tools/movie_qa.py "$O/1080.mp4" --storyboard "$M/storyboard.yaml" --captions "$O/en.vtt" --script "$M/script.md" \
  --manifest "$M/manifest.json" --composition movies/src/ch00_gradient/gr_eq.ts --timing "$M/timing.json" \
  --sound-cues "$S/sound/sound_captions.json" --id ch00/ch00_gradient \
  --overlap "$S/stills/$K6TAG" --hard-mb 110 --budget-mb 100 --duration-window 120,3600 > "$S/qa.log" 2>&1
cut -c1-220 "$S/qa.log"
echo "C: $(df -h /c | tail -1 | awk '{print $4}') free at end"
"$PY" tools/disk_guard.py --report | tail -1
echo RDONE
