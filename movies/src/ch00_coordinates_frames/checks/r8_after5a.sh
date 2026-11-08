#!/usr/bin/env bash
# ch00_coordinates_frames (#5d) remake: the remaining heavy steps, after Part 1's full render (coordinator 2026-11-07: take no lock until
# HEAVY.lock/owner.txt shows "orchestrator 5a fix1 full render"; no mix, SSR or K6 until that render ends). Then: the r8 mix (r8_voice.sh mix:
# VOICE.lock, HEAVY.lock free, >= 14 GB), then SSR + K6 stills of the whole house list in one tag folder (r7_heavy2.sh: HEAVY.lock, VOICE.lock free).
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
H="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/HEAVY.lock"
cd "$R" || exit 1
TAG="${1:-k6r8a}"
until grep -qi "5a fix1 full render" "$H/owner.txt" 2>/dev/null; do sleep 30; done
echo "saw the 5a full render $(date)"
while grep -qi "5a fix1 full render" "$H/owner.txt" 2>/dev/null; do sleep 30; done
echo "5a full render ended $(date)"
bash movies/src/ch00_coordinates_frames/checks/r8_voice.sh mix || exit 1
bash movies/src/ch00_coordinates_frames/checks/r7_heavy2.sh "$TAG"
echo "after5a done $(date)"
