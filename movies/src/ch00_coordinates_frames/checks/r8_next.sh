#!/usr/bin/env bash
# ch00_coordinates_frames (#5d) remake: remaining heavy steps under the RENDER2 protocol (coordinator 2026-11-07): renders come first.
# 1) SSR + K6 stills of the whole house list in ONE tag folder (r7_heavy2.sh: HEAVY.lock, VOICE free, >= 12 GB; may overlap a render);
# 2) the r8 sound mix (r8_voice.sh mix: VOICE.lock, no RENDER2.lock, HEAVY free, >= 14 GB).
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
cd "$R" || exit 1
TAG="${1:-k6r8a}"
bash movies/src/ch00_coordinates_frames/checks/r7_heavy2.sh "$TAG"
bash movies/src/ch00_coordinates_frames/checks/r8_voice.sh mix
echo "r8_next done $(date)"
