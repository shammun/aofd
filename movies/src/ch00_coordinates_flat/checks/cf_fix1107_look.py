"""ch00_coordinates_flat fix 1 after fb1 (2026-11-07): the look-frame list for the changed sentences (start + 12, middle, end - 6 of
every re-voiced entry, + the word moments of the review items), merged with the house K6 list into one frames file.
usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_flat/checks/cf_fix1107_look.py <out frames file> <out look json>"""
import json
import re
import sys
from pathlib import Path

R = Path(__file__).resolve().parents[4]
M = R / "movies/ch00/ch00_coordinates_flat"
T = json.loads((M / "timing.json").read_text(encoding="utf-8"))
W = json.loads((M / "words.json").read_text(encoding="utf-8"))["scenes"]
FPS = 30
sc = {s["id"]: s for s in T["scenes"]}
rep = T["self_check"]["spliced_fix1107"]["replaced"]
norm = lambda x: re.sub(r"[^a-z0-9']", "", x.lower())  # noqa: E731


def word(sid, j, phrase):
    s = sc[sid]["sentences"][j]
    e = W.get(sid, {}).get(str(j))
    if not e or e["text"] != s["text"]:          # no word times (unchanged sentence): character share, as AT()
        return round((s["start"] + (s["end"] - s["start"]) * s["text"].index(phrase) / len(s["text"])) * FPS)
    toks = [(t, norm(x)) for t, x in e["w"] if norm(x)]
    ph = [norm(x) for x in phrase.split() if norm(x)]
    for i in range(len(toks) - len(ph) + 1):
        if all(toks[i + q][1] == ph[q] for q in range(len(ph))):
            return round((s["start"] + toks[i][0]) * FPS)
    raise SystemExit(f"no '{phrase}' in {sid} S{j + 1}")


look = {}
for r in rep:
    s = sc[r["scene"]]["sentences"][r["sentence"] - 1]
    a, b = round(s["start"] * FPS), round(s["end"] * FPS)
    for f, why in ((a + 12, "start+12"), ((a + b) // 2, "middle"), (b - 6, "end-6")):
        look[f] = f"{r['scene']} S{r['sentence']} {why}"
for sid, j, ph, d, why in [
    ("s22_spin_inflow", 5, "two thousand five hundred", 3, "Must 1: 72 of 72 on the spoken total"),
    ("s22_spin_inflow", 5, "So their average", 20, "Must 1: fraction replaces the sum"),
    ("s22_spin_inflow", 9, "minus nine hundred", 3, "Must 2: 72 of 72 on the spoken total"),
    ("s22_spin_inflow", 9, "So their average", 20, "Must 2: fraction"),
    ("s23_what_numbers_mean", 9, "thirty two minutes", -10, "Must 3: clock still 0 min"),
    ("s23_what_numbers_mean", 9, "thirty two minutes", 25, "Must 3: clock 32 min"),
    ("s23_what_numbers_mean", 10, "seventy five minutes", 25, "Must 3: clock 75 min"),
    ("s24_ring_points", 23, "seven of them", 15, "Should 4: in at 7 of 8"),
    ("s24_ring_points", 23, "two hundred and twenty five", 20, "Should 4/5/6, C2, S1: eight points"),
    ("s25_why_polar_storm", 14, "Wind blowing across", 30, "M1: right-column lines"),
    ("s25_why_polar_storm", 14, "the flooded land", 30, "M1: impact keywords"),
    ("s26_inflow_angle", 4, "twenty one degrees", 20, "Should 3: tan-1(0.38) = 20.8"),
    ("s27_recap", 10, "how high the", 40, "S2: teaser line 4 ink"),
    ("s17_new_components", 6, "zero point eight six six", 10, "s17 highlight cos 30"),
    ("s17_new_components", 10, "one point nine six", 20, "s17 results"),
    ("s20_polar_is_turned", 6, "zero point eight", 10, "s20 cos/sin highlight"),
    ("s00_title", 0, "how they're used", 20, "s00 opening"),
]:
    look[word(sid, j, ph) + d] = why
k6 = [int(x) for x in (Path(sys.argv[1]).parent / "k6_frames.txt").read_text().split(",") if x.strip()]
allf = sorted(set(k6) | set(look))
Path(sys.argv[1]).write_text(",".join(map(str, allf)))
Path(sys.argv[2]).write_text(json.dumps({str(k): v for k, v in sorted(look.items())}, indent=0))
print(len(k6), "K6 +", len(look), "look =", len(allf), "frames")
