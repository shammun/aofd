"""Static equations check for ch00_coordinates (same rule as tools/movie_qa.py's equations gate): every storyboard on_screen_eq
latex must occur (whitespace-squashed) in cs_eq.ts, and every EQ_ constant of cs_eq.ts must be used by a scene file; KaTeX errors
are caught by the server-render check (texHtml throws on a bad string).
usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_sphere/checks/eq_check.py"""
import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[4]
SRC = ROOT / "movies" / "src" / "ch00_coordinates_sphere"
sb = yaml.safe_load((ROOT / "movies" / "ch00" / "ch00_coordinates_sphere" / "storyboard.yaml").read_text(encoding="utf-8"))
eqsrc = (SRC / "cs_eq.ts").read_text(encoding="utf-8")


def squash(s: str) -> str:
    return re.sub(r"\s+", "", s.replace("\\\\", "\\"))


eqs = [s["on_screen_eq"]["latex"] for s in sb["scenes"] if isinstance(s.get("on_screen_eq"), dict) and s["on_screen_eq"].get("latex")]
missing = [e for e in eqs if squash(e) not in squash(eqsrc)]
names = re.findall(r"export const (EQ_\w+)", eqsrc)
scenes = "".join((SRC / f).read_text(encoding="utf-8") for f in ("cs_sA.tsx", "cs_sB.tsx", "cs_sC.tsx"))
unused = [n for n in names if not re.search(rf"\b{n}\b", scenes)]
print(f"{len(eqs)} storyboard equations; missing in cs_eq.ts: {missing or 'none'}; {len(names)} constants, unused by scenes: {unused or 'none'}")
sys.exit(1 if missing or unused else 0)
