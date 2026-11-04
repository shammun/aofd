#!/usr/bin/env bash
# ch00_coordinates build 1, BEFORE the render (run from anywhere; ALONE: no other Remotion / Chrome / sound-mix job on the machine):
# static gates -> sound mix (tools/sound/mix.py, heavy: ~15 GB RAM) -> mix copied into the public dirs -> GPU probe ->
# K6 frame list + stills (bundle rebuilt, BoxProbe boxes) -> K6 overlap report. TEMP/TMP on G:, C: guard 45 GB.
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
S="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates/build1"
M="$R/movies/ch00/ch00_coordinates"
PY="$R/.venv/Scripts/python.exe"
cd "$R" || exit 1
mkdir -p "$S/tmp"; export TEMP="$S/tmp" TMP="$S/tmp"
FREE=$(df -BG /c | tail -1 | awk '{print $4}' | tr -d G); echo "C: ${FREE} GB free at start"; [ "$FREE" -ge 45 ] || { echo "STOP: C: < 45 GB"; exit 3; }
# 1. static gates (no browser)
(cd movies && npx tsc --noEmit -p tsconfig.json) || { echo TSCFAIL; exit 1; }
node movies/src/ch00_coordinates/checks/at_check.mjs | tail -1
node movies/src/ch00_coordinates/checks/swap_check.mjs 2>&1 | tail -1
node movies/src/ch00_coordinates/checks/cam_speed.mjs 2>&1 | tail -1
"$PY" movies/src/ch00_coordinates/checks/eq_check.py
(cd movies && node src/ch00_coordinates/checks/ssr/run.mjs --step 10 --public "$S/public" 2>&1 | grep -v "THREE_CJS\|Replace \`const\|trace-deprecation")
# 2. sound mix (heavy) and the mix into both public dirs (the G: one is bundled; movies/public keeps a fresh `npx remotion bundle` complete)
"$PY" tools/sound/mix.py --narration "$S/tts2/narration.wav" --cues "$M/sound.yaml" --out-dir "$S/sound" > "$S/sound.log" 2>&1 || { echo MIXFAIL; tail -20 "$S/sound.log"; exit 1; }
cp "$S/sound/narration_music.wav" "$S/public/"; cp "$S/sound/narration_music.wav" "$R/movies/public/"
# 3. K6 stills (rebuilds G:/…/build1/bundle from movies/src/ch00_coordinates/index.ts + $S/public), then the overlap gate
"$PY" movies/src/ch00_coordinates/checks/co_run.py frames
"$PY" movies/src/ch00_coordinates/checks/co_run.py stills k6b1 --bundle --jobs 3 > "$S/k6b1.log" 2>&1; tail -3 "$S/k6b1.log"
(cd movies && npx remotion still "$S/bundle" Ch00COGpuProbe "$S/gpuprobe.png" --gl=angle --log=verbose 2>&1 | grep -i "GPUPROBE" | head -2)
"$PY" tools/k6_overlap.py "$S/stills/k6b1" --timing "$M/timing.json" --json "$S/k6b1.json" 2>&1 | tail -6 | cut -c1-400
echo "C: $(df -h /c | tail -1 | awk '{print $4}') free at end"
echo PREDONE
