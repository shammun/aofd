#!/usr/bin/env bash
# ch00_coordinates_flat (#5a) fix 3, K6 loop 2 (2026-11-08): after k6z4 (7 faults: heading x colour-bar box in s21/s22/s24/s25, s22 ū_r
# equation x bar box, s24 0° u_θ chip x ring, s07 row past x 1842) the sources changed in s07, s21, s22, s24, s25 only. Re-shoots
# (--force, fresh bundle) every k6z4 frame of those scenes (± 15 frames round their boundaries) INTO k6z4, then k6_overlap on the whole
# folder. Waits until RENDER2.lock, HEAVY.lock and VOICE.lock are all free and RAM >= 12 GB; holds HEAVY.lock. Never renders/commits/deletes.
set -o pipefail
TAG="k6z4"
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
Q="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies"
L="$Q/HEAVY.lock"; V="$Q/VOICE.lock"; R2="$Q/RENDER2.lock"
S="$Q/ch00_coordinates_flat/build1"
PY="$R/.venv/Scripts/python.exe"
cd "$R" || exit 1
ram() { "$PY" -c "import psutil;print(int(psutil.virtual_memory().available/1e9))"; }
ready() { [ ! -d "$R2" ] && [ ! -d "$L" ] && [ ! -d "$V" ] && [ "$(ram)" -ge 12 ]; }
echo "queued $(date): waiting for RENDER2/HEAVY/VOICE locks free + RAM >= 12 GB"
while true; do
  until ready; do sleep 60; done
  mkdir "$L" 2>/dev/null || continue
  if [ -d "$R2" ] || [ -d "$V" ]; then rm -r "$L"; continue; fi
  break
done
echo "#5a fix3 K6 re-shoot (s07 s21 s22 s24 s25 into $TAG) $(date)" > "$L/owner.txt"
trap 'rm -r "$L"; echo "HEAVY.lock released $(date)"' EXIT
echo "HEAVY.lock taken $(date), RAM $(ram) GB"; "$PY" tools/disk_guard.py --report | tail -1
mkdir -p "$S/tmp"; export TEMP="$S/tmp" TMP="$S/tmp"
"$PY" - "$S" "$TAG" <<'EOF' || exit 1
import json, sys
from pathlib import Path
S, tag = Path(sys.argv[1]), sys.argv[2]
T = json.loads(Path("movies/ch00/ch00_coordinates_flat/timing.json").read_text(encoding="utf-8"))
ids = [s["id"] for s in T["scenes"]]
cut = [0 if i == 0 else round(s["start"] * 30) for i, s in enumerate(T["scenes"])]
end = cut[1:] + [T["total_frames"] + 75]
fr = sorted({int(x) for n in ("render", "copy") for x in (S / f"{tag}_{n}.txt").read_text().split(",") if x.strip()})
win = [(cut[ids.index(s)] - 15, end[ids.index(s)] + 15) for s in ("s07_radians", "s21_ian_polar", "s22_spin_inflow", "s24_ring_points", "s25_why_polar_storm")]
redo = [f for f in fr if any(a <= f < b for a, b in win)]
(S / f"{tag}_reshoot.txt").write_text(",".join(map(str, redo)))
print(f"re-shoot {len(redo)} of {len(fr)} k6z4 frames (s07, s21, s22, s24, s25 +- 15)")
EOF
"$PY" movies/src/ch00_coordinates_flat/checks/cf_run.py stills "$TAG" --bundle --frames-file "$S/${TAG}_reshoot.txt" --jobs 2 || exit 1
echo "== k6 $(date)"
"$PY" tools/k6_overlap.py "$S/stills/$TAG" --json "$S/stills/${TAG}_overlap.json" --timing movies/ch00/ch00_coordinates_flat/timing.json 2>&1 | tail -8
"$PY" "$S/k6sum.py" "$S/stills/${TAG}_overlap.json" > "$S/stills/${TAG}_sum.txt"; tail -20 "$S/stills/${TAG}_sum.txt"
"$PY" tools/disk_guard.py --report | tail -1
echo "== done $(date)"
