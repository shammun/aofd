#!/usr/bin/env bash
# ch00_coordinates_storm (#5b) fix 2, K6 loop 2 (2026-11-08): k6f3 had 1 fault (s09 dθ/dt row's denominator touching the "1 rad" row).
# New tag k6f4 = every k6f3 still outside s09 ±15 frames copied + every k6f3-plan frame inside s09 ±15 re-shot from a fresh bundle,
# then k6_overlap on the whole folder. Waits for RENDER2/HEAVY/VOICE free and RAM >= 9 GB; holds HEAVY.lock. Never renders, commits or deletes.
set -o pipefail
TAG="${1:-k6f4}"; OLD="${2:-k6f3}"
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
Q="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies"
L="$Q/HEAVY.lock"; V="$Q/VOICE.lock"; R2="$Q/RENDER2.lock"
S="$Q/ch00_coordinates_storm/build1"
PY="$R/.venv/Scripts/python.exe"
cd "$R" || exit 1
ram() { "$PY" -c "import psutil;print(int(psutil.virtual_memory().available/1e9))"; }
ready() { [ ! -d "$R2" ] && [ ! -d "$L" ] && [ ! -d "$V" ] && [ "$(ram)" -ge 9 ]; }
echo "queued $(date) (tag $TAG from $OLD)"
mkdir -p "$S/stills/$TAG"
"$PY" - "$S" "$TAG" "$OLD" <<'EOF' || exit 1
import json, shutil, sys
from pathlib import Path
S, tag, old = Path(sys.argv[1]), sys.argv[2], sys.argv[3]
T = json.loads(Path("movies/ch00/ch00_coordinates_storm/timing.json").read_text(encoding="utf-8"))
sc = T["scenes"]; ids = [s["id"] for s in sc]
i = next(j for j, s in enumerate(sc) if s["id"].startswith("s09"))
a = round(sc[i]["start"] * 30) - 15
b = (round(sc[i + 1]["start"] * 30) if i + 1 < len(sc) else T["total_frames"]) + 15
fr = sorted({int(x) for x in (S / f"{old}_frames.txt").read_text().replace("\n", ",").split(",") if x.strip()})
redo, n = [], 0
for f in fr:
    nms = (f"b{f:05d}.json", f"f{f:05d}.jpg")
    if a <= f < b or not all((S / "stills" / old / nm).exists() for nm in nms):
        redo.append(f); continue
    for nm in nms:
        shutil.copy2(S / "stills" / old / nm, S / "stills" / tag / nm); n += 1
(S / f"{tag}_frames.txt").write_text(",".join(map(str, redo)))
print(f"{len(fr)} frames: copied {n} files from {old}, re-shoot {len(redo)} (s09 {a}-{b})")
EOF
while true; do
  until ready; do sleep 30; done
  mkdir "$L" 2>/dev/null || continue
  if [ -d "$R2" ] || [ -d "$V" ]; then rm -r "$L"; continue; fi
  break
done
echo "#5b fix2 K6 $TAG (s09 re-shot, rest copied from $OLD) $(date)" > "$L/owner.txt"
trap 'rm -r "$L"; echo "HEAVY.lock released $(date)"' EXIT
echo "HEAVY.lock taken $(date), RAM $(ram) GB"
mkdir -p "$S/tmp"; export TEMP="$S/tmp" TMP="$S/tmp"
"$PY" movies/src/ch00_coordinates_storm/checks/cst_run.py stills "$TAG" --bundle --frames-file "$S/${TAG}_frames.txt" --jobs 2 || exit 1
# the k6 frame plan = the old one (k6_overlap runs on the whole folder)
echo "== k6 $(date)"
"$PY" tools/k6_overlap.py "$S/stills/$TAG" --json "$S/stills/${TAG}_overlap.json" --timing movies/ch00/ch00_coordinates_storm/timing.json 2>&1 | tail -8
"$PY" "$S/k6sum.py" "$S/stills/${TAG}_overlap.json" > "$S/stills/${TAG}_sum.txt"; tail -5 "$S/stills/${TAG}_sum.txt"
echo "== done $(date)"
