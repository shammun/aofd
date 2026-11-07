#!/usr/bin/env bash
# ch00_coordinates_maps (#5g, Part 7) remake 2026-11-07: the queued heavy steps, in order, each behind its lock (lock protocol 2026-11-07,
# tightened: two slots; checks/mp_lockgate.py decides when a job may start; the lock itself is an atomic mkdir + owner.txt, released on exit).
# = Part 6's checks/r7_queue.sh. Nothing starts until Part 6's queue has finished (its build1/stills/r7/k6.json exists) or the orchestrator
# has made <S>/GO.
#   phase V (VOICE.lock): splice r7 (Kokoro, only the 49 new sentences) -> final timing + captions -> Kokoro word times -> recue (no cue
#                         splits a number) -> static gates on the final timing -> data builder (chapter marks, skip targets) -> sound mix
#                         (polar-chart, s16 layers moved to the final s16) -> loudness
#   phase H (HEAVY.lock, VOICE.lock free): tsc -> SSR 2-D + --3d -> K6 frame list -> bundle + K6 stills -> k6_overlap gate
# NO render (the orchestrator renders: see the log for the exact command). Never deletes: an old folder is moved aside.
# Before taking each lock, and between steps, the CANCEL file stops the queue:  G:/.../scratch/movies/ch00_coordinates_maps/CANCEL
# usage (background):  bash movies/src/ch00_coordinates_maps/checks/r7_queue.sh [V|H|VH]  >> <S>/r7_queue.log 2>&1
set -o pipefail
PH="${1:-VH}"
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
M="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies"
S="$M/ch00_coordinates_maps"
B="$S/build1"
C="movies/src/ch00_coordinates_maps/checks"
PY=".venv/Scripts/python.exe"; PT=".venv-tts/Scripts/python.exe"
cd "$R" || exit 1
mkdir -p "$B/tmp" "$B/public"; export TEMP="$B/tmp" TMP="$B/tmp"
cancelled() { [ -e "$S/CANCEL" ] && { echo "CANCEL file found $(date) - stopping"; return 0; }; return 1; }
disk() { "$PY" -c "import shutil;print('disk: C: %.1f GB free, G: %.1f GB free' % (shutil.disk_usage('C:/').free/1e9, shutil.disk_usage('G:/').free/1e9))"; }
aside() { [ -e "$1" ] && mv "$1" "$1_old_$(date +%Y%m%d_%H%M%S)"; return 0; }
wait_gate() {   # $1 = voice|heavy ; $2 = lock dir ; $3 = owner text
  local said=0
  while true; do
    "$PY" "$C/mp_lockgate.py" "$1"; rc=$?
    [ $rc -eq 2 ] && { echo "CANCEL file found before taking $2 $(date)"; exit 3; }
    if [ $rc -eq 0 ] && mkdir "$2" 2>/dev/null; then echo "$3 $(date)" > "$2/owner.txt"; echo "lock $2 taken $(date)"; return 0; fi
    [ $said -eq 0 ] && { echo "waiting for the $1 gate (Part 6 done? locks?) $(date)"; said=1; }
    sleep 30
  done
}

if [[ "$PH" == *V* ]]; then
  echo "== phase V queued $(date)"
  wait_gate voice "$M/VOICE.lock" "#5g remake r7 TTS splice + word times + mix"
  trap 'rm -r "$M/VOICE.lock"; echo "VOICE.lock released $(date)"' EXIT
  disk
  aside "$S/r7/tts"
  "$PT" "$C/mp_r7_splice.py" || exit 1
  cancelled && exit 3
  "$PY" "$C/final_timing.py" --final "$S/r7/tts" || exit 1
  "$PT" "$C/mp_words.py" || exit 1
  "$PY" "$C/final_timing.py" --recue --write || echo "RECUE: cues above 17 cps (see above)"
  echo "== static gates on the final timing"
  node "$C/at_check.mjs" | tail -3
  node "$C/swap_check.mjs" 2>&1 | tail -3
  node "$C/cam_speed.mjs" 2>&1 | tail -1
  "$PY" "$C/eq_check.py"
  "$PY" tools/script_wording_lint.py movies/ch00/ch00_coordinates_maps/script.md | tail -1
  "$PY" movies/data/build_ch00_coordinates_maps.py 2>&1 | tail -1     # chapter marks + skip targets in the manifest from the final timing
  cancelled && exit 3
  aside "$B/sound"
  "$PY" "$C/mp_mix.py" "$S/r7/tts/narration.wav" "$B/sound" || exit 1
  ffmpeg -hide_banner -nostats -i "$B/sound/narration_music_mp.wav" -af ebur128=peak=true -f null - 2>&1 | grep -E "I:|Peak:" | tail -3
  cp "$B/sound/narration_music_mp.wav" "$B/public/narration_music_mp.wav"
  disk
  rm -r "$M/VOICE.lock"; trap - EXIT; echo "VOICE.lock released $(date)"
  echo "== phase V done $(date)"
fi

if [[ "$PH" == *H* ]]; then
  cancelled && exit 3
  echo "== phase H queued $(date)"
  wait_gate heavy "$M/HEAVY.lock" "#5g remake r7 SSR + K6 stills"
  trap 'rm -r "$M/HEAVY.lock"; echo "HEAVY.lock released $(date)"' EXIT
  "$PY" tools/disk_guard.py --report
  echo "== tsc (errors in this movie / all)"; (cd movies && npx tsc --noEmit -p tsconfig.json 2>&1 | grep "error TS" > "$B/tsc.txt"; grep -c "ch00_coordinates_maps" "$B/tsc.txt"; grep -c "error TS" "$B/tsc.txt") < /dev/null
  echo "== ssr";      (cd movies && node src/ch00_coordinates_maps/checks/ssr/run.mjs --step 10 --public "$B/public" 2>&1 | grep -v "THREE_CJS\|Replace \`const\|trace-deprecation" | tail -12)
  echo "== ssr --3d"; (cd movies && node src/ch00_coordinates_maps/checks/ssr/run.mjs --step 15 --3d --public "$B/public" 2>&1 | grep -v "THREE_CJS\|Replace \`const\|trace-deprecation" | tail -6)
  cancelled && exit 3
  "$PY" "$C/mp_run.py" frames || exit 1
  "$PY" "$C/mp_run.py" stills r7 --bundle --jobs 2 --frames-file "$B/k6_frames.txt" || exit 1
  "$PY" tools/k6_overlap.py "$B/stills/r7" --timing movies/ch00/ch00_coordinates_maps/timing.json --json "$B/stills/r7/k6.json" | tail -25
  "$PY" tools/disk_guard.py --report
  echo "== phase H done $(date)"
fi
