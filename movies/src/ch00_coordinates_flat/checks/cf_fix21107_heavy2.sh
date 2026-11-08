#!/usr/bin/env bash
# ch00_coordinates_flat (#5a) fix 2, K6 loop 2 (2026-11-07): after the k6z2 pass, s07 (raw-layer results coloured ink) and s23 (clock
# moved under the stack) changed. New tag = every k6z2 still of the other scenes copied + all k6z2-plan frames of s07 / s23 re-rendered
# (fresh bundle), then K6 on the whole folder. HEAVY.lock rule as cf_fix21107_heavy.sh. usage: cf_fix21107_heavy2.sh [newtag] [oldtag]
set -o pipefail
TAG="${1:-k6z3}"; OLD="${2:-k6z2}"
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
Q="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies"
L="$Q/HEAVY.lock"; V="$Q/VOICE.lock"
S="$Q/ch00_coordinates_flat/build1"
PY="$R/.venv/Scripts/python.exe"
cd "$R" || exit 1
ram() { "$PY" -c "import psutil;print(int(psutil.virtual_memory().available/1e9))"; }
until [ ! -d "$V" ] && [ "$(ram)" -ge 12 ] && mkdir "$L" 2>/dev/null; do sleep 30; done
if [ -d "$V" ]; then rm -r "$L"; echo "VOICE.lock appeared; retry"; exit 3; fi
echo "#5a fix2 heavy 2 (K6 stills $TAG) $(date)" > "$L/owner.txt"
trap 'rm -r "$L"; echo "HEAVY.lock released $(date)"' EXIT
echo "HEAVY.lock taken $(date), RAM $(ram) GB"; "$PY" tools/disk_guard.py --report | tail -1
mkdir -p "$S/tmp" "$S/stills/$TAG"; export TEMP="$S/tmp" TMP="$S/tmp"
"$PY" - "$S" "$TAG" "$OLD" <<'EOF' || exit 1
import json, shutil, sys
from pathlib import Path
S, tag, old = Path(sys.argv[1]), sys.argv[2], sys.argv[3]
T = json.loads(Path("movies/ch00/ch00_coordinates_flat/timing.json").read_text(encoding="utf-8"))
cut = [0 if i == 0 else round(s["start"] * 30) for i, s in enumerate(T["scenes"])]
ids = [s["id"] for s in T["scenes"]]
fr = sorted({int(x) for n in ("render", "copy") for x in (S / f"{old}_{n}.txt").read_text().split(",") if x.strip()})
def scene(f): return ids[max(i for i, c in enumerate(cut) if c <= max(f, 0))]
redo = [f for f in fr if scene(f) in ("s07_radians", "s23_what_numbers_mean") or scene(f - 15) in ("s07_radians", "s23_what_numbers_mean")]
n = 0
for f in fr:
    if f in redo:
        continue
    for nm in (f"b{f:05d}.json", f"f{f:05d}.jpg"):
        shutil.copy2(S / "stills" / old / nm, S / "stills" / tag / nm); n += 1
(S / f"{tag}_render.txt").write_text(",".join(map(str, redo)))
print(f"copied {n} files from {old}; re-render {len(redo)} frames (s07, s23 and the 15 frames after each)")
EOF
"$PY" movies/src/ch00_coordinates_flat/checks/cf_run.py stills "$TAG" --bundle --frames-file "$S/${TAG}_render.txt" --jobs 2 || exit 1
"$PY" tools/k6_overlap.py "$S/stills/$TAG" --json "$S/stills/${TAG}_overlap.json" --timing movies/ch00/ch00_coordinates_flat/timing.json 2>&1 | tail -6
"$PY" "$S/k6sum.py" "$S/stills/${TAG}_overlap.json" > "$S/stills/${TAG}_sum.txt"; tail -20 "$S/stills/${TAG}_sum.txt"
"$PY" tools/disk_guard.py --report | tail -1
echo "== done $(date)"
