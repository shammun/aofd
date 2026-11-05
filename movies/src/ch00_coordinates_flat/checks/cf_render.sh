#!/usr/bin/env bash
# ch00_coordinates_flat (#5a) FULL RENDER -> join -> QA (run ALONE on the machine; resumable: `cf_render.sh --from N`).
# Needs: the bundle from `cf_run.py stills <tag> --bundle` and narration_music_cf.wav in <bundle>/public (copied below).
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
S="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_flat/build1"
M="$R/movies/ch00/ch00_coordinates_flat"
O="$R/movies/out/ch00/ch00_coordinates_flat"
PY="$R/.venv/Scripts/python.exe"
K6TAG="${K6TAG:-k6r4}"
cd "$R" || exit 1
mkdir -p "$S/tmp" "$O"; export TEMP="$S/tmp" TMP="$S/tmp"
"$PY" tools/disk_guard.py --report | tail -2
SND="${SND:-sound5}"   # fix 1: the re-mix on the spliced narration (fix1/tts) lives in build1/sound5
cp "$S/$SND/narration_music_cf.wav" "$S/bundle/public/" || exit 1
"$PY" movies/src/ch00_coordinates_flat/checks/cf_run.py render --conc 2 "$@" 2>&1 | tee -a "$S/render.log" || exit 1
"$PY" movies/src/ch00_coordinates_flat/checks/cf_run.py join --mb 150 2>&1 | tee -a "$S/render.log" || exit 1
cp "$S/build1_1080.mp4" "$O/1080.mp4"; cp "$M/en.vtt" "$M/en.srt" "$O/"
(cd movies && npx remotion still "$S/bundle" Ch00CoordinatesFlat "$O/poster.jpg" --frame=200 --gl=angle)
"$PY" tools/movie_qa.py "$O/1080.mp4" --storyboard "$M/storyboard.yaml" --composition movies/src/ch00_coordinates_flat/cf_eq.ts \
  --overlap "$S/stills/$K6TAG" --captions "$M/en.vtt" --manifest "$M/manifest.json" --sound-cues "$S/$SND/sound_captions.json" --hard-mb 160 --budget-mb 160 --duration-window 120,3600 2>&1 | tee "$S/qa.log" | tail -30
"$PY" tools/disk_guard.py --report | tail -2
