"""Summarise a K6 overlap JSON for this movie by scene and by (kind, a, b) pair (remake 2026-11-07).
usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_storm/checks/k6_summary.py <overlap.json> [--scene s26] [--n 40]"""
import collections
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
T = json.loads((ROOT / "movies/ch00/ch00_coordinates_storm/timing.json").read_text(encoding="utf-8"))
J = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
want = sys.argv[sys.argv.index("--scene") + 1] if "--scene" in sys.argv else None
n = int(sys.argv[sys.argv.index("--n") + 1]) if "--n" in sys.argv else 40
starts = [(round(s["start"] * 30) if i else 0, s["id"]) for i, s in enumerate(T["scenes"])]


def scene(f: int) -> str:
    sid = starts[0][1]
    for a, s in starts:
        if f >= a:
            sid = s
    return sid


by = collections.Counter()
pairs = collections.defaultdict(list)
for fr, hs in J["hits"].items():
    sid = scene(int(fr))
    for h in hs:
        by[sid] += 1
        if want and not sid.startswith(want):
            continue
        pairs[(sid, h["kind"], h.get("a", "")[:50], h.get("b", "")[:50])].append(int(fr))
print("hits by scene:", dict(by))
for (sid, k, a, b), frs in sorted(pairs.items(), key=lambda x: -len(x[1]))[:n]:
    print(f"{len(frs):4d} {sid:20s} {k:22s} {a!r} × {b!r}  frames {min(frs)}-{max(frs)}")
