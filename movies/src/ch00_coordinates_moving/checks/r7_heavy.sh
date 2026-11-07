#!/usr/bin/env bash
# ch00_coordinates_moving (#5e) remake 2026-11-07: the queued heavy steps, in two lock slots (lock protocol 2026-11-07, as tightened):
#   1. VOICE.lock: TTS splice (Kokoro, the 38 new sentences only) -> final timing + captions -> Kokoro word times -> re-cue (no cue splits a
#      number) -> static gates on the final timing -> builder (manifest chapter marks) -> storyboard README -> sound mix (passing-front, seed 43).
#      Starts only when HEAVY.lock is free or held by a full render, with >= 8 GB RAM free.
#   2. HEAVY.lock: SSR (2-D and --3d), K6 frame list, K6 stills (one bundle, --jobs 2), tools/k6_overlap.py. Starts only when VOICE.lock is free.
# Both wait until no queue / run script of Parts 1-4 is alive (Parts 1-4 go first) and stop if the CANCEL file exists
# (G:/.../scratch/movies/ch00_coordinates_moving/CANCEL), checked before each lock is taken (checks/r7_gate.py). NEVER renders, never commits,
# never deletes (an old bundle is moved aside by mv_run.py). Each lock is released on exit.
# usage: nohup bash movies/src/ch00_coordinates_moving/checks/r7_heavy.sh [voice|heavy|all] > "<G:>/ch00_coordinates_moving/r7_heavy.log" 2>&1 &
set -o pipefail
WHAT="${1:-all}"
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
SM="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies"
HL="$SM/HEAVY.lock"; VL="$SM/VOICE.lock"
S="$SM/ch00_coordinates_moving"; B="$S/build1"
PY=".venv/Scripts/python.exe"; PT=".venv-tts/Scripts/python.exe"
CK="movies/src/ch00_coordinates_moving/checks"
cd "$R" || exit 1
mkdir -p "$B/tmp"; export TEMP="$B/tmp" TMP="$B/tmp"
HELD=""
release() { if [ -n "$HELD" ]; then rm -r "$HELD" && echo "released $HELD $(date)"; HELD=""; fi; }
trap release EXIT
# wait for the gate, then take the lock (mkdir is atomic; if someone else wins the race, wait again)
take() {  # $1 = voice|heavy, $2 = lock dir, $3 = owner text
  local n=0
  while true; do
    "$PY" "$CK/r7_gate.py" "$1" > /dev/null; rc=$?
    if [ $rc -eq 2 ]; then echo "CANCEL file found: stop $(date)"; exit 3; fi
    if [ $rc -eq 0 ] && mkdir "$2" 2>/dev/null; then echo "$3 $(date)" > "$2/owner.txt"; HELD="$2"; echo "lock taken: $2 $(date)"; return 0; fi
    n=$((n + 1)); [ $((n % 20)) -eq 1 ] && echo "waiting ($1) $(date): $("$PY" "$CK/r7_gate.py" "$1" --why)"
    sleep 30
  done
}

if [ "$WHAT" = "all" ] || [ "$WHAT" = "voice" ]; then
  take voice "$VL" "#5e remake r7 VOICE (TTS splice + word times + mix)"
  "$PY" tools/disk_guard.py --report
  "$PT" "$CK/mv_r7_splice.py" || exit 1
  "$PY" "$CK/mv_final_timing.py" --final "$S/r7/tts" || exit 1
  "$PT" "$CK/mv_words.py" || exit 1
  "$PY" "$CK/mv_final_timing.py" --recue --write || echo "RECUE: cues above 17 cps (see above)"
  echo "== static gates on the final timing"
  node "$CK/at_check.mjs" | tail -2
  node "$CK/swap_check.mjs" 2>&1 | tail -1
  node "$CK/r7_widths.mjs" | tail -1
  "$PY" tools/movie_symbol_lint.py --strict movies/src/ch00_coordinates_moving < /dev/null | tail -1
  "$PY" tools/script_wording_lint.py movies/ch00/ch00_coordinates_moving/script.md | tail -1
  (cd movies && npx tsc --noEmit -p tsconfig.json 2>&1 | grep -c "error TS")
  "$PY" movies/data/build_ch00_coordinates_moving.py | tail -1
  "$PY" "$CK/r7_storyboard.py"
  "$PY" "$CK/mv_mix.py" "$S/r7/tts/narration.wav" "$B/sound" || exit 1
  ffmpeg -hide_banner -nostats -i "$B/sound/narration_music_mv.wav" -af ebur128=peak=true -f null - 2>&1 | grep -E "I:|Peak:" | tail -3
  cp "$B/sound/narration_music_mv.wav" "$B/public/narration_music_mv.wav"
  "$PY" tools/disk_guard.py --report
  release
  echo "VOICE phase done $(date)"
fi

if [ "$WHAT" = "all" ] || [ "$WHAT" = "heavy" ]; then
  take heavy "$HL" "#5e remake r7 SSR + K6 stills r7k1"
  "$PY" tools/disk_guard.py --report
  echo "== ssr";      (cd movies && node src/ch00_coordinates_moving/checks/ssr/run.mjs --step 10 --public "$B/public" 2>&1 | grep -v "THREE_CJS\|Replace \`const\|trace-deprecation" | tail -12)
  echo "== ssr --3d"; (cd movies && node src/ch00_coordinates_moving/checks/ssr/run.mjs --step 15 --3d --public "$B/public" 2>&1 | grep -v "THREE_CJS\|Replace \`const\|trace-deprecation" | tail -6)
  "$PY" "$CK/mv_run.py" frames || exit 1
  "$PY" "$CK/mv_run.py" stills r7k1 --bundle --jobs 2 --frames-file "$B/k6_frames.txt" || exit 1
  "$PY" tools/k6_overlap.py "$B/stills/r7k1" --timing movies/ch00/ch00_coordinates_moving/timing.json --json "$B/stills/r7k1/k6.json" | tail -25
  "$PY" tools/disk_guard.py --report
  release
  echo "HEAVY phase done $(date) — next (not run here): look at the stills, then the render: $PY $CK/mv_run.py render --conc 2 && $PY $CK/mv_run.py join"
fi
