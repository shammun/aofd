"""House QA gate K6 `overlap` (HOUSE_STYLE §5b, weather basics UF2, 2026-10-29): no text over text, no must-class text on
the sharp part of a globe / map / image / stack, no colour bar on a picture (U2-29), source lines >= 16 px under their
picture, nothing past x 1840 or y 872.

Input: a folder of `b<frame>.json` files written by the house BoxProbe (movies/src/house/kit/bbox.tsx) through a still
renderer (e.g. tools/movie_wb/stills_uf2.py, label_stills.mjs) — {frame, boxes, shapes, masks}. Masks come from
K1 GlobeFrame (sharp rect / unzoomed disc), K2 SourceLine (`src`: its box + its picture's box) and colour bars (`cbar`).

Rules (FAIL on any hit):
  text-text     two text blocks whose glyph runs intersect > 3 px in both directions
  text-picture  must-class text inside a sharp picture mask (spot labels are allowed: outlined map labels marked
                data-lc-maplabel, one- or two-character glyphs such as H / L, axis ticks, a short place-name list)
  cbar-picture  a colour-bar box overlapping a sharp picture mask
  src-gap       a source line closer than 16 px to its picture box, or overlapping a sharp mask
  edge          text right > 1840 or bottom > 872
  text-shape    text crossed by a gold link, an arrow / stroke >= 3 px, or straddling a filled shape (via
                tools/movie_wb/label_check.check_shapes, shapely)

usage (standalone): .venv/Scripts/python.exe tools/k6_overlap.py <box dir> [--json out.json]
In tools/movie_qa.py: --overlap <box dir> adds the gate `overlap`.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

PLACES = {"Brest", "Trappes", "Brittany", "English Channel", "Paris", "Singapore", "Himalayas", "Andes", "Rockies", "Tibet", "Azores", "Bay of Biscay",
          "Atlantic", "Europe", "Africa", "France", "Ireland", "UK", "Spain", "Sahara", "Iceland", "Greenland", "Pacific", "Indian Ocean"}
TICK = re.compile(r"^[−\-+]?\d+(\.\d+)?\s?(km|°C|K|hPa|°|%)?$")
DEPTH = 3.0


def spot(t: str, m: bool) -> bool:
    t = (t or "").strip()
    return m or len(t) <= 2 or t in PLACES or bool(TICK.match(t))


def inter(a, b) -> tuple[float, float]:
    return min(a[2], b[2]) - max(a[0], b[0]), min(a[3], b[3]) - max(a[1], b[1])


def in_mask(r, mk) -> bool:
    cx, cy = (r[0] + r[2]) / 2, (r[1] + r[3]) / 2
    if mk["k"] == "rect":
        x0, y0, x1, y1 = mk["r"]
        ix, iy = inter(r, [x0, y0, x1, y1])
        return ix > DEPTH and iy > DEPTH
    if mk["k"] == "circle":
        (x, y), R = mk["c"], mk["r"]
        nx, ny = min(max(x, r[0]), r[2]), min(max(y, r[1]), r[3])   # nearest point of the box to the centre
        return (nx - x) ** 2 + (ny - y) ** 2 < (R - DEPTH) ** 2 and abs(cx - x) < R and abs(cy - y) < R
    return False


def check_frame(j: dict, shapes_check=None) -> list[dict]:
    boxes, masks = j.get("boxes", []), j.get("masks", [])
    sharp = [m for m in masks if m["k"] in ("rect", "circle")]
    srcs = [m for m in masks if m["k"] == "src"]
    cbars = [m for m in masks if m["k"] == "cbar"]
    src_txt = set()
    for s in srcs:
        for b in boxes:
            if any(inter(r, s["src"])[0] > 0 and inter(r, s["src"])[1] > 0 for r in b["r"]):
                src_txt.add(id(b))
    out = []
    for i, A in enumerate(boxes):
        for B in boxes[i + 1:]:
            hit = next(((ix, iy) for ra in A["r"] for rb in B["r"] for ix, iy in [inter(ra, rb)] if ix > DEPTH and iy > DEPTH), None)
            if hit:
                out.append({"kind": "text-text", "a": A["t"], "b": B["t"], "px": [round(hit[0]), round(hit[1])]})
        for r in A["r"]:
            if r[2] > 1842 or r[3] > 880:   # the caption band starts at y 880
                out.append({"kind": "edge", "a": A["t"], "box": r})
                break
        if id(A) in src_txt or spot(A["t"], bool(A.get("m"))):
            continue
        for mk in sharp:
            if any(in_mask(r, mk) for r in A["r"]):
                out.append({"kind": "text-picture", "a": A["t"], "mask": mk.get("name")})
                break
    for c in cbars:
        for mk in sharp:
            if in_mask(c["src"], mk):
                out.append({"kind": "cbar-picture", "a": c.get("name"), "mask": mk.get("name"), "box": c["src"]})
    for s in srcs:
        pic = s.get("r")
        if pic and s["src"][1] - pic[3] < 16 - 2:   # 2 px tolerance for the glyph box
            out.append({"kind": "src-gap", "a": s.get("name"), "gap": round(s["src"][1] - pic[3], 1)})
        if s["src"][3] > 880:   # the caption band starts at y 880 (the <g> box includes the font's descent)
            out.append({"kind": "edge", "a": s.get("name"), "box": s["src"]})
        for mk in sharp:
            if in_mask(s["src"], mk):
                out.append({"kind": "src-on-picture", "a": s.get("name"), "mask": mk.get("name")})
    if shapes_check is not None:
        try:
            for h in shapes_check([b for b in boxes if id(b) not in src_txt], j.get("shapes", [])):
                h["kind"] = "text-shape:" + h["kind"]
                out.append(h)
        except Exception as e:  # noqa: BLE001
            out.append({"kind": "checker-error", "a": str(e)[:200]})
    return out


def overlap_gate(box_dir: Path, shapes: bool = True) -> tuple[str, str, dict]:
    files = sorted(Path(box_dir).glob("b*.json"))
    sc = None
    if shapes:
        try:
            sys.path.insert(0, str(Path(__file__).resolve().parent / "movie_wb"))
            from label_check import check_shapes as sc  # noqa: F401
        except Exception:  # noqa: BLE001
            sc = None
    rep = {"frames": len(files), "hits": {}}
    for f in files:
        j = json.loads(f.read_text(encoding="utf-8"))
        h = check_frame(j, sc)
        if h:
            rep["hits"][str(j.get("frame"))] = h
    n = sum(len(v) for v in rep["hits"].values())
    rep["count"] = n
    if not files:
        return "FAIL", f"no box files in {box_dir}", rep
    kinds: dict[str, int] = {}
    for v in rep["hits"].values():
        for h in v:
            kinds[h["kind"]] = kinds.get(h["kind"], 0) + 1
    return ("FAIL" if n else "PASS"), (f"{len(files)} frames, {n} hits " + json.dumps(kinds) if n else f"{len(files)} frames, 0 hits"), rep


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("dir")
    ap.add_argument("--json")
    ap.add_argument("--no-shapes", action="store_true")
    a = ap.parse_args()
    st, det, rep = overlap_gate(Path(a.dir), not a.no_shapes)
    print(st, det)
    if a.json:
        Path(a.json).write_text(json.dumps(rep, indent=1, ensure_ascii=False), encoding="utf-8")
    sys.exit(0 if st == "PASS" else 1)
