#!/usr/bin/env bash
# ch00_coordinates_flat (#5a) fix 4 (2026-11-08): K6 for the fix-4 source into ONE new tag folder (default k6z6). Screen-only fix plus
# re-cued captions (captions are not in the frames). Never renders the movie, commits or deletes.
# Waits until RENDER2.lock, HEAVY.lock and VOICE.lock are all free and RAM >= 9 GB; takes HEAVY.lock (mkdir + owner.txt). Then: SSR
# --step 10, the frame plan (cf_fix41108_frames.py), stills of unchanged scenes copied from k6z5, the rest rendered from a fresh bundle
# (--jobs 2), tools/k6_overlap.py on the whole folder, the hit summary. Stops at once on a G: hardware error.
# usage: cf_fix41108_k6z6.sh [tag] [old tag]
set -o pipefail
TAG="${1:-k6z6}"; OLD="${2:-k6z5}"
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
Q="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies"
L="$Q/HEAVY.lock"; V="$Q/VOICE.lock"; R2="$Q/RENDER2.lock"
S="$Q/ch00_coordinates_flat/build1"
PY="$R/.venv/Scripts/python.exe"
cd "$R" || exit 1
ram() { "$PY" -c "import psutil;print(int(psutil.virtual_memory().available/1e9))"; }
ready() { [ ! -d "$R2" ] && [ ! -d "$L" ] && [ ! -d "$V" ] && [ "$(ram)" -ge 9 ]; }
hw() { grep -qi "hardware error" "$1" 2>/dev/null && { echo "STOP: G: hardware error ($(date))"; exit 9; }; }
echo "queued $(date) (tag $TAG from $OLD): waiting for RENDER2/HEAVY/VOICE free + RAM >= 9 GB"
while true; do
  until ready; do sleep 30; done
  mkdir "$L" 2>/dev/null || continue
  if [ -d "$R2" ] || [ -d "$V" ]; then rm -r "$L"; continue; fi
  break
done
echo "#5a fix4 K6 $TAG (SSR + stills, rest copied from $OLD) $(date)" > "$L/owner.txt"
trap 'rm -r "$L"; echo "HEAVY.lock released $(date)"' EXIT
echo "HEAVY.lock taken $(date), RAM $(ram) GB"; "$PY" tools/disk_guard.py --report | tail -1
mkdir -p "$S/tmp" "$S/stills/$TAG"; export TEMP="$S/tmp" TMP="$S/tmp"
LOGT="$S/tmp/${TAG}_steps.log"
echo "== ssr $(date)"
(cd movies && node src/ch00_coordinates_flat/checks/ssr/run.mjs --step 10 --public "$S/public" 2>&1 | grep -v "THREE_CJS\|Replace \`const\|trace-deprecation" | tee "$LOGT" | tail -14); hw "$LOGT"
echo "== frames $(date)"
"$PY" movies/src/ch00_coordinates_flat/checks/cf_fix41108_frames.py "$TAG" "$OLD" 2>&1 | tee "$LOGT" || exit 1; hw "$LOGT"
"$PY" - "$S" "$TAG" "$OLD" <<'EOF' 2>&1 | tee "$LOGT" || exit 1
import shutil, sys
from pathlib import Path
S, tag, old = Path(sys.argv[1]), sys.argv[2], sys.argv[3]
n = 0
for f in (S / f"{tag}_copy.txt").read_text().split(","):
    if not f.strip():
        continue
    for nm in (f"b{int(f):05d}.json", f"f{int(f):05d}.jpg"):
        shutil.copy2(S / "stills" / old / nm, S / "stills" / tag / nm); n += 1
print(f"copied {n} files from {old}")
EOF
hw "$LOGT"
echo "== stills $(date)"
"$PY" movies/src/ch00_coordinates_flat/checks/cf_run.py stills "$TAG" --bundle --frames-file "$S/${TAG}_render.txt" --jobs 2 2>&1 | tee "$LOGT" | tail -4 || exit 1; hw "$LOGT"
echo "== k6 $(date)"
"$PY" tools/k6_overlap.py "$S/stills/$TAG" --json "$S/stills/${TAG}_overlap.json" --timing movies/ch00/ch00_coordinates_flat/timing.json 2>&1 | tail -8
"$PY" "$S/k6sum.py" "$S/stills/${TAG}_overlap.json" > "$S/stills/${TAG}_sum.txt"; tail -20 "$S/stills/${TAG}_sum.txt"
"$PY" tools/disk_guard.py --report | tail -1
echo "== done $(date)  (stills $S/stills/$TAG, hits ${TAG}_overlap.json / ${TAG}_sum.txt, look list $S/${TAG}_look.json)"
