#!/usr/bin/env bash
# ch00_coordinates_frames (#5d) remake 2026-11-07, heavy step 2 under the HEAVY lock: SSR (2-D and --3d), then the K6 stills of the whole
# house list into ONE tag folder (--jobs 2) and the K6 overlap gate on it. usage: r7_heavy2.sh <tag> [frames file]
set -o pipefail
TAG="${1:?tag}"; FF="${2:-}"
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
L="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/HEAVY.lock"
S="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_frames/build1"
cd "$R" || exit 1
V="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/VOICE.lock"   # lock rule 2026-11-07: K6 / stills / SSR wait until VOICE.lock is free
ram() { "$R/.venv/Scripts/python.exe" -c "import psutil;print(int(psutil.virtual_memory().available/1e9))"; }
until [ ! -d "$V" ] && [ "$(ram)" -ge 12 ] && mkdir "$L" 2>/dev/null; do sleep 30; done   # K6 / stills / SSR: VOICE free, >= 12 GB (renders may run)
if [ -d "$V" ]; then rm -r "$L"; echo "VOICE.lock appeared; retry"; exit 3; fi
echo "#5d remake r7 heavy 2 (SSR + K6 stills $TAG) $(date)" > "$L/owner.txt"
trap 'rm -r "$L"' EXIT
echo "lock taken $(date)"
mkdir -p "$S/tmp"; export TEMP="$S/tmp" TMP="$S/tmp"
.venv/Scripts/python.exe -c "import shutil;print('C: %.1f GB free, G: %.1f GB free' % (shutil.disk_usage('C:/').free/1e9, shutil.disk_usage('G:/').free/1e9))"
if [ -z "$FF" ]; then
  echo "== ssr";      (cd movies && node src/ch00_coordinates_frames/checks/ssr/run.mjs --step 10 --public "$S/public" 2>&1 | grep -v "THREE_CJS\|Replace \`const\|trace-deprecation" | tail -12)
  echo "== ssr --3d"; (cd movies && node src/ch00_coordinates_frames/checks/ssr/run.mjs --step 15 --3d --public "$S/public" 2>&1 | grep -v "THREE_CJS\|Replace \`const\|trace-deprecation" | tail -6)
  .venv/Scripts/python.exe movies/src/ch00_coordinates_frames/checks/fr_run.py frames || exit 1
  FF="$S/k6_frames.txt"
fi
.venv/Scripts/python.exe movies/src/ch00_coordinates_frames/checks/fr_run.py stills "$TAG" --bundle --jobs 2 --frames-file "$FF" || exit 1
.venv/Scripts/python.exe tools/k6_overlap.py "$S/stills/$TAG" --timing movies/ch00/ch00_coordinates_frames/timing.json --json "$S/stills/$TAG/k6.json" | tail -25
.venv/Scripts/python.exe -c "import shutil;print('C: %.1f GB free, G: %.1f GB free' % (shutil.disk_usage('C:/').free/1e9, shutil.disk_usage('G:/').free/1e9))"
echo "heavy 2 done $(date)"
