#!/usr/bin/env bash
# ch00_coordinates_frames (#5d) remake 2026-11-07, pass r8 (show-it-don't-voice-it, openings, inputs said), under the lock protocol of 2026-11-07:
#   phase 1 (TTS: splice, final timing, Kokoro word times, recue) takes VOICE.lock when HEAVY.lock is free or held by a full render, >= 8 GB free;
#   phase 2 (sound mix, ~11.5 GB) takes VOICE.lock only when HEAVY.lock is FREE and >= 14 GB free.
# Each phase releases VOICE.lock on its end. usage: r8_voice.sh [mix]   (mix = phase 2 only)
set -o pipefail
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
L="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/VOICE.lock"
H="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/HEAVY.lock"
S="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_frames"
PY="$R/.venv/Scripts/python.exe"
cd "$R" || exit 1
ram() { "$PY" -c "import psutil;print(int(psutil.virtual_memory().available/1e9))"; }
disk() { "$PY" -c "import shutil;print('C: %.1f GB free, G: %.1f GB free' % (shutil.disk_usage('C:/').free/1e9, shutil.disk_usage('G:/').free/1e9))"; }
tts_ok() {
  if [ -d "$H" ]; then o=$(cat "$H/owner.txt" 2>/dev/null); echo "$o" | grep -qiE "k6|still|ssr" && return 1; echo "$o" | grep -qi "render" || return 1; fi
  [ "$(ram)" -ge 8 ]
}
R2="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/RENDER2.lock"   # renders first: no mix while RENDER2.lock exists
mix_ok() { [ ! -d "$R2" ] && [ ! -d "$H" ] && [ "$(ram)" -ge 14 ]; }
mkdir -p "$S/build1/tmp"; export TEMP="$S/build1/tmp" TMP="$S/build1/tmp"
if [ "$1" != "mix" ]; then
  until tts_ok && mkdir "$L" 2>/dev/null; do sleep 30; done
  echo "#5d remake r8 TTS (splice + word times) $(date)" > "$L/owner.txt"
  echo "VOICE.lock taken (TTS) $(date), RAM $(ram) GB"; disk
  .venv-tts/Scripts/python.exe movies/src/ch00_coordinates_frames/checks/fr_r7_splice.py --pass r8 || { rm -r "$L"; exit 1; }
  .venv/Scripts/python.exe movies/src/ch00_coordinates_frames/checks/final_timing.py --final "$S/r8/tts" || { rm -r "$L"; exit 1; }
  .venv-tts/Scripts/python.exe movies/src/ch00_coordinates_frames/checks/fr_words.py || { rm -r "$L"; exit 1; }
  .venv/Scripts/python.exe movies/src/ch00_coordinates_frames/checks/final_timing.py --recue --write || echo "RECUE: see above"
  rm -r "$L"; echo "VOICE.lock released (TTS) $(date)"
fi
until mix_ok && mkdir "$L" 2>/dev/null; do sleep 30; done
echo "#5d remake r8 sound mix $(date)" > "$L/owner.txt"
trap 'rm -r "$L"' EXIT
echo "VOICE.lock taken (mix) $(date), RAM $(ram) GB"
.venv/Scripts/python.exe movies/src/ch00_coordinates_frames/checks/fr_mix.py "$S/r8/tts/narration.wav" "$S/build1/sound_r8" || exit 1
ffmpeg -hide_banner -nostats -i "$S/build1/sound_r8/narration_music_fr.wav" -af ebur128=peak=true -f null - 2>&1 | grep -E "I:|Peak:" | tail -3
disk
echo "r8 done $(date)"
