#!/usr/bin/env bash
# ch00_coordinates_flat (#5a) fix 2 (2026-11-07) voice steps under the lock protocol of 2026-11-07 (renders first):
#   tts : re-voice s23 S7 + S13 (cf_fix21107_splice.py) under VOICE.lock, when HEAVY.lock is free or held by a render, RAM >= 8 GB
#   mix : the sound mix (~11.5 GB) into build1/sound11 under VOICE.lock, only when RENDER2.lock AND HEAVY.lock are free, RAM >= 8 GB (mix in float32 since 2026-11-08 ~00:00, about half the memory)
# usage: cf_fix21107_voice.sh tts|mix
set -o pipefail
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
Q="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies"
L="$Q/VOICE.lock"; H="$Q/HEAVY.lock"; R2="$Q/RENDER2.lock"
S="$Q/ch00_coordinates_flat"
PY="$R/.venv/Scripts/python.exe"
cd "$R" || exit 1
ram() { "$PY" -c "import psutil;print(int(psutil.virtual_memory().available/1e9))"; }
disk() { "$PY" tools/disk_guard.py --report | tail -1; }
tts_ok() {
  if [ -d "$H" ]; then o=$(cat "$H/owner.txt" 2>/dev/null); echo "$o" | grep -qiE "k6|still|ssr" && return 1; echo "$o" | grep -qi "render" || return 1; fi
  [ "$(ram)" -ge 8 ]
}
mix_ok() { [ ! -d "$R2" ] && [ ! -d "$H" ] && [ "$(ram)" -ge 8 ]; }
mkdir -p "$S/build1/tmp"; export TEMP="$S/build1/tmp" TMP="$S/build1/tmp"
case "$1" in
  tts)
    until tts_ok && mkdir "$L" 2>/dev/null; do sleep 30; done
    echo "#5a fix2 TTS splice (s23 S7, S13) $(date)" > "$L/owner.txt"
    trap 'rm -r "$L"; echo "VOICE.lock released $(date)"' EXIT
    echo "VOICE.lock taken (TTS) $(date), RAM $(ram) GB"; disk
    .venv-tts/Scripts/python.exe movies/src/ch00_coordinates_flat/checks/cf_fix21107_splice.py || exit 1
    disk; echo "tts done $(date)" ;;
  mix)
    until mix_ok && mkdir "$L" 2>/dev/null; do sleep 30; done
    echo "#5a fix2 sound mix (sound11) $(date)" > "$L/owner.txt"
    trap 'rm -r "$L"; echo "VOICE.lock released $(date)"' EXIT
    echo "VOICE.lock taken (mix) $(date), RAM $(ram) GB"; disk
    "$PY" tools/sound/mix.py --narration "$S/fix21107/tts/narration.wav" --cues movies/ch00/ch00_coordinates_flat/sound.yaml \
      --timing movies/ch00/ch00_coordinates_flat/timing.json --out-dir "$S/build1/sound11" > "$S/build1/sound11_mix.log" 2>&1 || { tail -20 "$S/build1/sound11_mix.log"; exit 1; }
    [ -f "$S/build1/sound11/narration_music_cf.wav" ] || mv "$S/build1/sound11/narration_music.wav" "$S/build1/sound11/narration_music_cf.wav"
    tail -5 "$S/build1/sound11_mix.log"
    ffmpeg -hide_banner -nostats -i "$S/build1/sound11/narration_music_cf.wav" -af ebur128=peak=true -f null - 2>&1 | grep -E "I:|Peak:" | tail -3
    "$PY" -c "import json;d=json.load(open(r'$S/build1/sound11/sound.json'));print('soundtrack_s',d['soundtrack_s'],'mix',d['mix'])"
    disk; echo "mix done $(date)" ;;
  *) echo "usage: $0 tts|mix"; exit 2 ;;
esac
