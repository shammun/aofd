#!/usr/bin/env bash
# ch00_coordinates_storm (#5b) fix loop 1 (2026-11-07): voice steps under the lock protocol of 2026-11-07 (renders first):
#   tts : re-voice the fix1 sentences (fix1_splice.py) + word times of every sentence (fix1_words_all.py) under VOICE.lock,
#         when HEAVY.lock is free or held by a render, RAM >= 8 GB
#   mix : the sound mix into build1/sound_fix1 under VOICE.lock, only when RENDER2.lock AND HEAVY.lock are free, RAM >= 14 GB
# usage: fix1_voice.sh tts|mix
set -o pipefail
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
Q="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies"
L="$Q/VOICE.lock"; H="$Q/HEAVY.lock"; R2="$Q/RENDER2.lock"
S="$Q/ch00_coordinates_storm"
PY="$R/.venv/Scripts/python.exe"; PT="$R/.venv-tts/Scripts/python.exe"
cd "$R" || exit 1
ram() { "$PY" -c "import psutil;print(int(psutil.virtual_memory().available/1e9))"; }
disk() { "$PY" tools/disk_guard.py --report | tail -1; }
tts_ok() {
  if [ -d "$H" ]; then o=$(cat "$H/owner.txt" 2>/dev/null); echo "$o" | grep -qiE "k6|still|ssr" && return 1; echo "$o" | grep -qi "render" || return 1; fi
  [ "$(ram)" -ge 8 ]
}
mix_ok() { [ ! -d "$R2" ] && [ ! -d "$H" ] && [ "$(ram)" -ge 14 ]; }
mkdir -p "$S/build1/tmp"; export TEMP="$S/build1/tmp" TMP="$S/build1/tmp"
case "$1" in
  tts)
    until tts_ok && mkdir "$L" 2>/dev/null; do sleep 30; done
    echo "#5b fix1 TTS splice (14 clips) + word times $(date)" > "$L/owner.txt"
    trap 'rm -r "$L"; echo "VOICE.lock released $(date)"' EXIT
    echo "VOICE.lock taken (TTS) $(date), RAM $(ram) GB"; disk
    "$PT" movies/src/ch00_coordinates_storm/checks/fix1_splice.py || exit 1
    "$PT" movies/src/ch00_coordinates_storm/checks/fix1_words_all.py || exit 1
    disk; echo "tts done $(date)" ;;
  mix)
    until mix_ok && mkdir "$L" 2>/dev/null; do sleep 30; done
    echo "#5b fix1 sound mix (sound_fix1) $(date)" > "$L/owner.txt"
    trap 'rm -r "$L"; echo "VOICE.lock released $(date)"' EXIT
    echo "VOICE.lock taken (mix) $(date), RAM $(ram) GB"; disk
    "$PY" tools/sound/mix.py --narration "$S/fix1/tts/narration.wav" --cues movies/ch00/ch00_coordinates_storm/sound.yaml \
      --timing movies/ch00/ch00_coordinates_storm/timing.json --out-dir "$S/build1/sound_fix1" > "$S/fix1_mix.log" 2>&1 || { tail -20 "$S/fix1_mix.log"; exit 1; }
    tail -3 "$S/fix1_mix.log"
    "$PY" tools/sound/check.py --kind mix "$S/build1/sound_fix1/narration_music.wav" > "$S/fix1_mixcheck.log" 2>&1; tail -3 "$S/fix1_mixcheck.log"
    ffmpeg -hide_banner -nostats -i "$S/build1/sound_fix1/narration_music.wav" -af ebur128=peak=true -f null - 2>&1 | grep -E "I:|Peak:" | tail -3
    disk; echo "mix done $(date)" ;;
  *) echo "usage: $0 tts|mix"; exit 2 ;;
esac
