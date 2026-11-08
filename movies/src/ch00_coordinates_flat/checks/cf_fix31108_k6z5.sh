#!/usr/bin/env bash
# ch00_coordinates_flat (#5a) fix 3, K6 loop 2 (2026-11-08, after the G: outage): new tag k6z5 = every k6z4 still of the scenes NOT
# changed after k6z4 copied + every k6z4-plan frame of s07, s21, s22, s24, s25 (+-15 frames round their boundaries) re-rendered from a
# fresh bundle, then k6_overlap on the whole k6z5 folder. Holds HEAVY.lock (mkdir + owner.txt); waits for RENDER2/HEAVY/VOICE free.
# Never renders the movie, commits or deletes. usage: cf_fix31108_k6z5.sh [newtag] [oldtag]
set -o pipefail
TAG="${1:-k6z5}"; OLD="${2:-k6z4}"
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
Q="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies"
L="$Q/HEAVY.lock"; V="$Q/VOICE.lock"; R2="$Q/RENDER2.lock"
S="$Q/ch00_coordinates_flat/build1"
PY="$R/.venv/Scripts/python.exe"
cd "$R" || exit 1
ram() { "$PY" -c "import psutil;print(int(psutil.virtual_memory().available/1e9))"; }
ready() { [ ! -d "$R2" ] && [ ! -d "$L" ] && [ ! -d "$V" ] && [ "$(ram)" -ge 9 ]; }
echo "queued $(date) (tag $TAG from $OLD)"
while true; do
  until ready; do sleep 30; done
  mkdir "$L" 2>/dev/null || continue
  if [ -d "$R2" ] || [ -d "$V" ]; then rm -r "$L"; continue; fi
  break
done
echo "#5a fix3 K6 $TAG (s07 s21 s22 s24 s25 re-shot, rest copied from $OLD) $(date)" > "$L/owner.txt"
trap 'rm -r "$L"; echo "HEAVY.lock released $(date)"' EXIT
echo "HEAVY.lock taken $(date), RAM $(ram) GB"
mkdir -p "$S/tmp" "$S/stills/$TAG"; export TEMP="$S/tmp" TMP="$S/tmp"
"$PY" - "$S" "$TAG" "$OLD" <<'EOF' || exit 1
import json, shutil, sys
from pathlib import Path
S, tag, old = Path(sys.argv[1]), sys.argv[2], sys.argv[3]
T = json.loads(Path("movies/ch00/ch00_coordinates_flat/timing.json").read_text(encoding="utf-8"))
ids = [s["id"] for s in T["scenes"]]
cut = [0 if i == 0 else round(s["start"] * 30) for i, s in enumerate(T["scenes"])]
end = cut[1:] + [T["total_frames"] + 75]
fr = sorted({int(x) for n in ("render", "copy") for x in (S / f"{old}_{n}.txt").read_text().split(",") if x.strip()})
win = [(cut[ids.index(s)] - 15, end[ids.index(s)] + 15) for s in ("s07_radians", "s21_ian_polar", "s22_spin_inflow", "s24_ring_points", "s25_why_polar_storm")]
redo, n = [], 0
for f in fr:
    nms = (f"b{f:05d}.json", f"f{f:05d}.jpg")
    if any(a <= f < b for a, b in win) or not all((S / "stills" / old / nm).exists() for nm in nms):
        redo.append(f); continue
    for nm in nms:
        shutil.copy2(S / "stills" / old / nm, S / "stills" / tag / nm); n += 1
(S / f"{tag}_render.txt").write_text(",".join(map(str, redo)))
print(f"{len(fr)} frames: copied {n} files from {old}, re-render {len(redo)}")
EOF
"$PY" movies/src/ch00_coordinates_flat/checks/cf_run.py stills "$TAG" --bundle --frames-file "$S/${TAG}_render.txt" --jobs 2 || exit 1
echo "== k6 $(date)"
"$PY" tools/k6_overlap.py "$S/stills/$TAG" --json "$S/stills/${TAG}_overlap.json" --timing movies/ch00/ch00_coordinates_flat/timing.json 2>&1 | tail -8
"$PY" "$S/k6sum.py" "$S/stills/${TAG}_overlap.json" > "$S/stills/${TAG}_sum.txt"; tail -20 "$S/stills/${TAG}_sum.txt"
echo "== done $(date)"
