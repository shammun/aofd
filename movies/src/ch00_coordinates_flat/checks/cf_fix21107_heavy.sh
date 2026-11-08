#!/usr/bin/env bash
# ch00_coordinates_flat (#5a) fix 2 (2026-11-07): the heavy pass under HEAVY.lock (lock rule 2026-11-07: VOICE.lock free, RAM >= 12 GB;
# may overlap a render): SSR --step 10, the bundle, the K6 frame plan (cf_fix21107_frames.py), the unchanged-scene stills copied from
# k6y1, the rest rendered (--jobs 2) into ONE new tag folder, then tools/k6_overlap.py on the whole folder. usage: cf_fix21107_heavy.sh [tag]
set -o pipefail
TAG="${1:-k6z2}"
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
Q="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies"
L="$Q/HEAVY.lock"; V="$Q/VOICE.lock"
S="$Q/ch00_coordinates_flat/build1"
PY="$R/.venv/Scripts/python.exe"
cd "$R" || exit 1
ram() { "$PY" -c "import psutil;print(int(psutil.virtual_memory().available/1e9))"; }
until [ ! -d "$V" ] && [ "$(ram)" -ge 12 ] && mkdir "$L" 2>/dev/null; do sleep 30; done
if [ -d "$V" ]; then rm -r "$L"; echo "VOICE.lock appeared; retry"; exit 3; fi
echo "#5a fix2 heavy (SSR + K6 stills $TAG) $(date)" > "$L/owner.txt"
trap 'rm -r "$L"; echo "HEAVY.lock released $(date)"' EXIT
echo "HEAVY.lock taken $(date), RAM $(ram) GB"; "$PY" tools/disk_guard.py --report | tail -1
mkdir -p "$S/tmp"; export TEMP="$S/tmp" TMP="$S/tmp"
if [ -z "$SKIPSSR" ]; then
  echo "== ssr $(date)"
  (cd movies && node src/ch00_coordinates_flat/checks/ssr/run.mjs --step 10 --public "$S/public" 2>&1 | grep -v "THREE_CJS\|Replace \`const\|trace-deprecation" | tail -12)
fi
echo "== frames $(date)"
"$PY" movies/src/ch00_coordinates_flat/checks/cf_fix21107_frames.py "$TAG" || exit 1
mkdir -p "$S/stills/$TAG"
"$PY" - "$S" "$TAG" <<'EOF'
import shutil, sys
from pathlib import Path
S, tag = Path(sys.argv[1]), sys.argv[2]
src, dst = S / "stills" / "k6y1", S / "stills" / tag
n = miss = 0
for f in (S / f"{tag}_copy.txt").read_text().split(","):
    if not f.strip():
        continue
    for nm in (f"b{int(f):05d}.json", f"f{int(f):05d}.jpg"):
        if (src / nm).exists():
            shutil.copy2(src / nm, dst / nm); n += 1
        else:
            miss += 1
print(f"copied {n} files from k6y1, {miss} missing")
if miss:
    sys.exit(1)
EOF
[ $? -eq 0 ] || exit 1
echo "== stills $(date)"
"$PY" movies/src/ch00_coordinates_flat/checks/cf_run.py stills "$TAG" --bundle --frames-file "$S/${TAG}_render.txt" --jobs 2 || exit 1
echo "== k6 $(date)"
"$PY" tools/k6_overlap.py "$S/stills/$TAG" --json "$S/stills/${TAG}_overlap.json" --timing movies/ch00/ch00_coordinates_flat/timing.json 2>&1 | tail -6
"$PY" "$S/k6sum.py" "$S/stills/${TAG}_overlap.json" > "$S/stills/${TAG}_sum.txt"; tail -40 "$S/stills/${TAG}_sum.txt"
"$PY" tools/disk_guard.py --report | tail -1
echo "== done $(date)"
