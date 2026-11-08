#!/usr/bin/env bash
# ch00_coordinates_storm (#5b) fix 3 (2026-11-08, after the fix2 reviews): K6 re-shoot k6f5.
# New tag k6f5 = every k6f4 still OUTSIDE the changed scenes (±15 frames) copied + every k6f4 frame INSIDE them re-shot from a fresh bundle
# + extra frames at every new word-timed reveal of fix 3 (word -2 / +8 / +20 / +47 / +60 frames, from words.json Kokoro token times),
# then k6_overlap on the whole folder. Changed scenes: s13 s14 s20 s21 s23 s29 s30 s33 s36 s39 s41.
# Waits for RENDER2/HEAVY/VOICE free and RAM >= 9 GB (as fix2_k6f4.sh); holds HEAVY.lock; stops on CANCEL_FIX3. Never renders, commits or
# deletes. Log: <scratch>/ch00_coordinates_storm/fix3_k6f5.log (unique name).
# usage (repo root, detached):  bash movies/src/ch00_coordinates_storm/checks/fix3_k6f5.sh [k6f5] [k6f4]
set -o pipefail
TAG="${1:-k6f5}"; OLD="${2:-k6f4}"
R="/c/Users/sislam27/Work/Climate Dynamics PHD/AOFD Vallis"
Q="G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies"
L="$Q/HEAVY.lock"; V="$Q/VOICE.lock"; R2="$Q/RENDER2.lock"
S="$Q/ch00_coordinates_storm/build1"
CANCEL="$Q/ch00_coordinates_storm/CANCEL_FIX3"
LOG="$Q/ch00_coordinates_storm/fix3_${TAG}.log"
PY="$R/.venv/Scripts/python.exe"
cd "$R" || exit 1
exec > >(tee -a "$LOG") 2>&1
ram() { "$PY" -c "import psutil;print(int(psutil.virtual_memory().available/1e9))"; }
ready() { [ ! -d "$R2" ] && [ ! -d "$L" ] && [ ! -d "$V" ] && [ "$(ram)" -ge 9 ]; }
echo "queued $(date) (tag $TAG from $OLD)"
if [ -e "$CANCEL" ]; then echo "CANCEL_FIX3 present: stop"; exit 1; fi
if [ ! -d "$S/stills/$OLD" ]; then echo "no $S/stills/$OLD: stop"; exit 1; fi
if [ -d "$S/stills/$TAG" ] && [ -n "$(ls -A "$S/stills/$TAG" 2>/dev/null | head -1)" ]; then echo "$S/stills/$TAG is not empty: stop"; exit 1; fi
mkdir -p "$S/stills/$TAG"
"$PY" - "$S" "$TAG" "$OLD" <<'EOF' || exit 1
import json, re, shutil, sys
from pathlib import Path
S, tag, old = Path(sys.argv[1]), sys.argv[2], sys.argv[3]
FPS = 30
T = json.loads(Path("movies/ch00/ch00_coordinates_storm/timing.json").read_text(encoding="utf-8"))
W = json.loads(Path("movies/src/ch00_coordinates_storm/words.json").read_text(encoding="utf-8"))["scenes"]
sc = T["scenes"]
CHANGED = ["s13", "s14", "s20", "s21", "s23", "s29", "s30", "s33", "s36", "s39", "s41"]
win = []
for i, s in enumerate(sc):
    if s["id"][:3] in CHANGED:
        a = round(s["start"] * FPS) - 15
        b = (round(sc[i + 1]["start"] * FPS) if i + 1 < len(sc) else T["total_frames"] + 75) + 15
        win.append((a, b))
inside = lambda f: any(a <= f < b for a, b in win)  # noqa: E731
wn = lambda x: re.sub(r"[^a-z0-9']", "", x.lower())  # noqa: E731


def word_frame(sid, phrase, nth=0):
    """global frame of `phrase` (its first word's Kokoro token time) in the first sentence of scene `sid` that contains it (= cs_lib ATP)"""
    s = next(x for x in sc if x["id"] == sid)
    j = next(q for q, x in enumerate(s["sentences"]) if phrase in x["text"])
    x = s["sentences"][j]
    e = W[sid][str(j)]
    toks = [(t, wn(w)) for t, w in e["w"] if wn(w)]
    ph = [wn(p) for p in phrase.split() if wn(p)]
    hits = [toks[i][0] for i in range(len(toks) - len(ph) + 1) if all(toks[i + q][1] == ph[q] for q in range(len(ph)))]
    if not hits:
        raise SystemExit(f"no word time for {sid} '{phrase}'")
    return round((x["start"] + hits[min(nth, len(hits) - 1)]) * FPS)


def sent_frame(sid, j):
    s = next(x for x in sc if x["id"] == sid)
    return round(s["sentences"][j]["start"] * FPS)


# every new word-timed reveal of fix 3 (scene id prefix -> phrases); + the sentence starts where a reveal or swap moved
REV = {
    "s13_acceleration_numbers": ["nine point eight one", "two hundred"],
    "s14_steady_but_turning": ["twenty six and a half", "twenty times weaker", "a little stronger"],
    "s20_ian_curtain": ["near twelve", "single towers"],
    "s21_amphan_intro": ["Satkhira", "Khulna"],
    "s23_amphan_ring": ["about twenty", "minus six", "ninety knots", "forty six", "nine hundred and fifty six", "nine hundred and sixty seven",
                        "seventeen degrees", "twenty one"],
    "s29_stp_calc": ["fifty five point seven", "six point eight", "west leg over north leg", "seven degrees", "a bearing of",
                     "three hundred and fifty three", "ninety seven"],
    "s30_onshore_piles": ["storm surge", "low pressure helps", "one centimetre", "by dividing"],
    "s33_amphan_wind": ["six tenths", "ninety two point nine", "twenty one point nine", " over ", "thirteen degrees", "that's a bearing",
                        "two hundred and fifty seven", "a hundred and ninety three"],
    "s36_nargis_wind": ["about half", "sixty nine point five", "ten point eight", " over ", "nine degrees", "that's a bearing",
                        "two hundred and seventy nine", "a hundred and seventy one"],
    "s39_idai_wind": ["two thirds", "fifty two point three", "thirty five point nine", " over ", "thirty four degrees", "that's a bearing",
                      "two hundred and thirty six", "two hundred and fourteen"],
    "s41_recap": ["two point two", "one point eight", "Before the floods", "twenty two point four"],
}
extra = set()
for sid, phs in REV.items():
    for ph in phs:
        t = word_frame(sid, ph)
        for d in (-2, 8, 20, 47, 60):
            extra.add(t + d)
s41 = next(x for x in sc if x["id"] == "s41_recap")
for j in (8, 9, 10):                                   # s41 beat 10 title / beats 8-9 gauge values: the cross-fades
    for d in (0, 10, 18, 30, 60):
        extra.add(sent_frame("s41_recap", j) + d)
names = {p.name for p in (S / "stills" / old).iterdir()}
fr = sorted({int(m.group(1)) for n in names for m in [re.match(r"f(\d{5})\.jpg$", n)] if m and f"b{m.group(1)}.json" in names})
redo, n = set(), 0
for f in fr:
    if inside(f):
        redo.add(f); continue
    for nm in (f"b{f:05d}.json", f"f{f:05d}.jpg"):
        shutil.copy2(S / "stills" / old / nm, S / "stills" / tag / nm); n += 1
redo |= {f for f in extra if 0 <= f < T["total_frames"] + 75}
redo = sorted(redo)
(S / f"{tag}_frames.txt").write_text(",".join(map(str, redo)))
print(f"{old}: {len(fr)} frames; copied {n} files; re-shoot {len(redo)} ({len(extra)} new reveal frames) in {len(win)} scene windows")
EOF
while true; do
  until ready; do
    if [ -e "$CANCEL" ]; then echo "CANCEL_FIX3 present: stop $(date)"; exit 1; fi
    sleep 30
  done
  mkdir "$L" 2>/dev/null || continue
  if [ -d "$R2" ] || [ -d "$V" ]; then rm -r "$L"; continue; fi
  break
done
echo "#5b fix3 K6 $TAG (s13 s14 s20 s21 s23 s29 s30 s33 s36 s39 s41 re-shot, rest copied from $OLD) $(date)" > "$L/owner.txt"
trap 'rm -r "$L"; echo "HEAVY.lock released $(date)"' EXIT
echo "HEAVY.lock taken $(date), RAM $(ram) GB"
mkdir -p "$S/tmp"; export TEMP="$S/tmp" TMP="$S/tmp"
"$PY" movies/src/ch00_coordinates_storm/checks/cst_run.py stills "$TAG" --bundle --frames-file "$S/${TAG}_frames.txt" --jobs 2 || exit 1
echo "== k6 $(date)"
"$PY" tools/k6_overlap.py "$S/stills/$TAG" --json "$S/stills/${TAG}_overlap.json" --timing movies/ch00/ch00_coordinates_storm/timing.json 2>&1 | tail -8
"$PY" "$S/k6sum.py" "$S/stills/${TAG}_overlap.json" > "$S/stills/${TAG}_sum.txt"; tail -5 "$S/stills/${TAG}_sum.txt"
echo "== done $(date)"
