#!/usr/bin/env bash
# ch00_gradient (#6) build 1, BEFORE the render (adapted 2026-11-04 from ch00_coordinates/checks/co_prerender.sh, unchanged).
# Run from anywhere, ALONE: no other Remotion / Chrome / sound-mix job on the machine.
# static gates (tsc, timing refs, text overlap/edge, camera speed, equations, SSR incl. the --3d THREE-tag check) -> data build
# (assets into both public dirs) -> sound mix (tools/sound/mix.py, heavy: ~15 GB RAM) -> mix into both public dirs -> K6 frame
# list + stills (bundle rebuilt from src/ch00_gradient/index.ts + $S/public, BoxProbe boxes) -> GPU probe -> K6 overlap report.
# TEMP/TMP on G:, C: guard 45 GB (stop below).
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
S="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_gradient/build1"
M="$R/movies/ch00/ch00_gradient"
PY="$R/.venv/Scripts/python.exe"
cd "$R" || exit 1
mkdir -p "$S/tmp" "$S/public"; export TEMP="$S/tmp" TMP="$S/tmp"
FREE=$(df -BG /c | tail -1 | awk '{print $4}' | tr -d G); echo "C: ${FREE} GB free at start"; [ "$FREE" -ge 45 ] || { echo "STOP: C: < 45 GB"; exit 3; }
"$PY" tools/disk_guard.py --report | tail -1
# 1. static gates (no browser)
(cd movies && npx tsc --noEmit -p tsconfig.json) || { echo TSCFAIL; exit 1; }
node movies/src/ch00_gradient/checks/at_check.mjs | tail -1
node movies/src/ch00_gradient/checks/swap_check.mjs 2>&1 | tail -1
node movies/src/ch00_gradient/checks/cam_speed.mjs 2>&1 | tail -1
"$PY" movies/src/ch00_gradient/checks/eq_check.py
"$PY" movies/data/build_ch00_gradient.py --public "$S/public" --public "$R/movies/public" | tail -1
(cd movies && node src/ch00_gradient/checks/ssr/run.mjs --step 10 --public "$S/public" 2>&1 | grep -v "THREE_CJS\|Replace \`const\|trace-deprecation")
(cd movies && node src/ch00_gradient/checks/ssr/run.mjs --step 15 --3d 2>&1 | grep -v "THREE_CJS\|Replace \`const\|trace-deprecation")
# 2. sound mix (heavy) and the mix into both public dirs (the G: one is bundled; movies/public keeps a fresh `npx remotion bundle` complete)
"$PY" tools/sound/mix.py --narration "$S/tts2/narration.wav" --cues "$M/sound.yaml" --out-dir "$S/sound" > "$S/sound.log" 2>&1 || { echo MIXFAIL; tail -20 "$S/sound.log"; exit 1; }
cp "$S/sound/narration_music.wav" "$S/public/"; cp "$S/sound/narration_music.wav" "$R/movies/public/"
# 3. K6 stills (rebuilds $S/bundle), GPU probe, then the overlap gate
"$PY" movies/src/ch00_gradient/checks/gr_run.py frames
"$PY" movies/src/ch00_gradient/checks/gr_run.py stills k6b1 --bundle --jobs 3 > "$S/k6b1.log" 2>&1; tail -3 "$S/k6b1.log"
(cd movies && npx remotion still "$S/bundle" Ch00GRGpuProbe "$S/gpuprobe.png" --gl=angle --log=verbose 2>&1 | grep -i "GPUPROBE" | head -2)
"$PY" tools/k6_overlap.py "$S/stills/k6b1" --timing "$M/timing.json" --json "$S/k6b1.json" 2>&1 | tail -6 | cut -c1-400
echo "C: $(df -h /c | tail -1 | awk '{print $4}') free at end"
"$PY" tools/disk_guard.py --report | tail -1
echo PREDONE
