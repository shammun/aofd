#!/usr/bin/env bash
# ch00_coordinates_frames (#5d) remake 2026-11-07, heavy step 1b (show-it-dont-voice-it pass r8) under VOICE.lock (lock protocol 2026-11-07): the narration splice (Kokoro, only the new sentences),
# the final timing + cues, the sound mix. One heavy job at a time; the lock is released on exit.
set -o pipefail
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
L="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/VOICE.lock"   # lock protocol 2026-11-07: TTS + mixes take VOICE.lock
H="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/HEAVY.lock"
PY="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis/.venv/Scripts/python.exe"
# may run while HEAVY.lock holds a render if >= 8 GB RAM is free; never while it holds K6 / stills / SSR
voice_ok() {
  if [ -d "$H" ]; then
    o=$(cat "$H/owner.txt" 2>/dev/null)
    echo "$o" | grep -qiE "k6|still|ssr" && return 1
    echo "$o" | grep -qi "render" || return 1
  fi
  m=$("$PY" -c "import psutil;print(int(psutil.virtual_memory().available/1e9))")
  [ "$m" -ge 8 ]
}
S="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_frames"
cd "$R" || exit 1
until voice_ok && mkdir "$L" 2>/dev/null; do sleep 30; done
echo "#5d remake r8 heavy 1b (TTS splice + word times + mix) $(date)" > "$L/owner.txt"
trap 'rm -r "$L"' EXIT
echo "lock taken $(date)"
mkdir -p "$S/build1/tmp"; export TEMP="$S/build1/tmp" TMP="$S/build1/tmp"
.venv/Scripts/python.exe -c "import shutil;print('C: %.1f GB free, G: %.1f GB free' % (shutil.disk_usage('C:/').free/1e9, shutil.disk_usage('G:/').free/1e9))"
.venv-tts/Scripts/python.exe movies/src/ch00_coordinates_frames/checks/fr_r7_splice.py --pass r8 || exit 1
.venv/Scripts/python.exe movies/src/ch00_coordinates_frames/checks/final_timing.py --final "$S/r8/tts" || exit 1
.venv-tts/Scripts/python.exe movies/src/ch00_coordinates_frames/checks/fr_words.py || exit 1
.venv/Scripts/python.exe movies/src/ch00_coordinates_frames/checks/final_timing.py --recue --write || echo "RECUE: cps above 17 (see above)"
.venv/Scripts/python.exe movies/src/ch00_coordinates_frames/checks/fr_mix.py "$S/r8/tts/narration.wav" "$S/build1/sound_r8" || exit 1
ffmpeg -hide_banner -nostats -i "$S/build1/sound_r8/narration_music_fr.wav" -af ebur128=peak=true -f null - 2>&1 | grep -E "I:|Peak:" | tail -3
.venv/Scripts/python.exe -c "import shutil;print('C: %.1f GB free, G: %.1f GB free' % (shutil.disk_usage('C:/').free/1e9, shutil.disk_usage('G:/').free/1e9))"
echo "heavy 1b done $(date)"
