#!/usr/bin/env bash
# ch00_coordinates_sphere (#5c, Part 3) FULL RENDER -> join -> QA (run ALONE on the machine; resumable: `cs_render.sh --from N`).
# Modelled on src/ch00_coordinates_storm/checks/cst_render.sh. Needs: the bundle from `cs_run.py stills <tag> --bundle` and
# narration_music_cs.wav from the sound mix (<S>/sound), copied into <bundle>/public below. Scratch only on G: (never C:);
# cs_run.py stops before every chunk if C: < 45 GB or G: < 50 GB free; the join refuses a partial render.
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
S="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_sphere/build1"
M="$R/movies/ch00/ch00_coordinates_sphere"
O="$R/movies/out/ch00/ch00_coordinates_sphere"
PY="$R/.venv/Scripts/python.exe"
K6TAG="${K6TAG:?set K6TAG to the clean (0-hit) K6 stills tag, e.g. K6TAG=k6r1 bash cs_render.sh}"
set -o pipefail   # stop on a failed render or refused join (2026-11-07)
cd "$R" || exit 1
[ -d "G:/" ] || { echo "G: missing: stop (never fall back to C:)"; exit 1; }
mkdir -p "$S/tmp" "$O"; export TEMP="$S/tmp" TMP="$S/tmp"
"$PY" tools/disk_guard.py --report | tail -2
[ -d "$S/bundle" ] || { echo "no bundle in $S/bundle: run cs_run.py stills <tag> --bundle first"; exit 1; }
cp "$S/sound/narration_music_cs.wav" "$S/bundle/public/" || exit 1
"$PY" movies/src/ch00_coordinates_sphere/checks/cs_run.py render --conc 2 "$@" 2>&1 | tee -a "$S/render.log"
[ "${PIPESTATUS[0]}" -eq 0 ] || { echo "render stopped (see $S/render.log); resume with --from <first missing chunk>"; exit 1; }
"$PY" movies/src/ch00_coordinates_sphere/checks/cs_run.py join --mb 155 2>&1 | tee -a "$S/render.log"
[ "${PIPESTATUS[0]}" -eq 0 ] && [ -s "$S/build1_1080.mp4" ] || { echo "join failed or refused: not copying, no QA"; exit 1; }
cp "$S/build1_1080.mp4" "$O/1080.mp4"; cp "$M/en.vtt" "$M/en.srt" "$O/"
(cd movies && npx remotion still "$S/bundle" Ch00CoordinatesSphere "$O/poster.jpg" --frame=200 --gl=angle)
"$PY" tools/movie_qa.py "$O/1080.mp4" --storyboard "$M/storyboard.yaml" --composition movies/src/ch00_coordinates_sphere/cs_eq.ts \
  --overlap "$S/stills/$K6TAG" --captions "$M/en.vtt" --manifest "$M/manifest.json" --sound-cues "$S/sound/sound_captions.json" --hard-mb 160 --budget-mb 160 --duration-window 120,3600 2>&1 | tee "$S/qa.log" | tail -30
"$PY" tools/disk_guard.py --report | tail -2
