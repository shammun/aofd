"""House QA gate K6 `overlap` (HOUSE_STYLE §5b, weather basics UF2, 2026-10-29; tuned in UF2 fix 1, 2026-10-30): no text over
text, no must-class text on the sharp part of a globe / map / image / stack, no colour bar on a picture (U2-29), source lines
>= 16 px under their picture, nothing past x 1840 or y 880, no gold link through text or across an axis.

Input: a folder of `b<frame>.json` files written by the house BoxProbe (movies/src/house/kit/bbox.tsx) through a still
renderer (e.g. tools/movie_wb/stills_uf2.py, label_stills.mjs) — {frame, boxes, shapes, masks}. Masks come from K1 GlobeFrame
(sharp rect / unzoomed disc), K5 LayerStack3D (`poly`, the projected stack outline), StackMask (`poly`), K2 SourceLine (`src`)
and colour bars (`cbar`).

Rules (FAIL):
  text-text     two text blocks whose glyph runs overlap horizontally and intersect or come within 4 px vertically; a colour bar's
                own title / ticks are exempt against each other
  text-cbar     a text block on, or within 12 px of, a colour bar that is not its own
  text-picture  must-class text inside a sharp picture mask (rect / circle / poly). Spot labels are allowed: outlined map labels
                (data-lc-maplabel), one- or two-character glyphs (H / L), axis ticks and heights ("1.5 km"), place names
  cbar-picture  a colour-bar box overlapping a sharp picture mask
  src-gap       a source line closer than 16 px to its picture box, or on a sharp mask
  edge          text right > 1842 or bottom > 880
  text-shape    a stroke / rod / 3-D arrow / underline / gold link crossing the MIDDLE 60 % of a text block's glyph height, over
                ≥ 25 % of the text width, or right across the band (≥ 90 % of its height) ≥ 3 px wide at opacity > 0.5; text
                straddling a filled shape's edge; text inside a small opaque fill
  link-link     two gold links crossing away from their ends
  link-axis     a gold link crossing a graph axis / guide line away from its ends (house §6: links never cross ticks)
INFO (logged, never FAIL) — hits that only an ownership exemption removes:
  * the label and the shape share an owner (`own`: [data-lc-own] group, or a colour bar's own pieces);
  * a gold link touching text within 30 px of either end of the link (its own end label);
  * a stroke / rod / arrow touching text within 30 px of one of its ends (the label at its tip);
  * a small fill (< 20 000 px²) whose box lies within 40 px of the text (a marker beside its own label);
  * a spot label (tick, height, place) or a short edge label (< 12 characters) on a thin (≤ 5 px) 3-D edge rod;
  * (with --timing) a hit inside a scene cross-fade between an opaque block of the old scene and a fading block of the new one,
    or the same label drawn by both scenes.

usage (standalone): .venv/Scripts/python.exe tools/k6_overlap.py <box dir> [--json out.json]
       .venv/Scripts/python.exe tools/k6_overlap.py --frames <timing.json>   # print the K6 frame list (cross-fades included)
In tools/movie_qa.py: --overlap <box dir> adds the gate `overlap`.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

from shapely import make_valid, unary_union
from shapely.geometry import LineString, Point, Polygon, box as sbox

PLACES = {"Brest", "Trappes", "Brittany", "English Channel", "Paris", "Singapore", "Himalayas", "Andes", "Rockies", "Tibet", "Azores", "Bay of Biscay",
          "Atlantic", "Europe", "Africa", "France", "Ireland", "UK", "Spain", "Sahara", "Iceland", "Greenland", "Pacific", "Indian Ocean",
          "tropical Atlantic", "South Atlantic", "North Atlantic", "Southern Ocean", "Tibetan Plateau"}
TICK = re.compile(r"^(km |hPa |°C )?[−\-+≈ ]*\d+(\.\d+)?\s?(km|°C|K|hPa|°|%)?$")
DEPTH = 3.0          # picture masks, fills: an overlap counts when this deep in both directions
TT_DEPTH = 1.0       # text-text, text-cbar: horizontal overlap needed (> 1 px)
TT_GAP = 4.0         # text-text: glyph runs closer than 4 px vertically count (UF2 fix 1: 16:40 "137 hPa · 14 %" 1.8 px under the axis title)
CB_GAP = 12.0        # text-cbar: text closer than 12 px to another colour bar's box counts (40:34 "where data are sparse", 8 px)
SMALL_FILL = 120000.0
OWN_FILL = 20000.0
END_R = 30.0


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
    if mk["k"] == "poly" and len(mk.get("pts") or []) >= 3:
        try:
            g = make_valid(Polygon([tuple(p) for p in mk["pts"]])).buffer(0)
            ig = sbox(*r).intersection(g)
        except Exception:  # noqa: BLE001
            return False
        if ig.is_empty:
            return False
        x0, y0, x1, y1 = ig.bounds
        return (x1 - x0) > DEPTH and (y1 - y0) > DEPTH
    return False


# ------------------------------------------------------------------------------------------------ text against shapes
def _geom(sh: dict):
    pts = [tuple(p) for p in sh["pts"]]
    if sh["k"] in ("fill", "img"):
        if len(pts) < 3:
            return None
        g = make_valid(Polygon(pts)).buffer(0)
    else:
        if len(pts) < 2:
            return None
        g = LineString(pts).buffer(max(sh["w"], 3.0) / 2, cap_style="flat")
    if g is not None and sh.get("clip"):
        g = g.intersection(sbox(*sh["clip"]))
    return None if g is None or g.is_empty else g


def band(r: list[float]) -> list[float]:
    """the middle 60 % of a glyph run's height (the probe's rects are already shrunk to the ink)"""
    h = r[3] - r[1]
    return [r[0], r[1] + 0.2 * h, r[2], r[3] - 0.2 * h]


def _near_end(sh: dict, c: Point) -> bool:
    p0, p1 = sh["pts"][0], sh["pts"][-1]
    return min(c.distance(Point(*p0)), c.distance(Point(*p1))) <= END_R


def check_shapes(boxes: list[dict], shapes: list[dict]) -> tuple[list[dict], list[dict]]:
    """(fail hits, info hits) for text against fills / images / strokes / rods / links, and link-link / link-axis crossings"""
    fails, infos = [], []
    geo, merged = [], {}
    for sh in shapes:
        if sh["k"] == "axis":
            continue
        try:
            g = _geom(sh)
        except Exception:  # noqa: BLE001
            g = None
        if g is None:
            continue
        if sh["k"] in ("fill", "img"):
            merged.setdefault((sh["k"], sh["g"]), []).append((sh, g))
        else:
            geo.append((sh, g))
    for parts in merged.values():
        try:
            g = unary_union([h for _, h in parts])
        except Exception:  # noqa: BLE001
            geo.extend(parts)
            continue
        sh = dict(parts[0][0])
        sh["o"] = max(p[0]["o"] for p in parts)
        geo.append((sh, g))
    for A in boxes:
        seen: set = set()
        for ra in A["r"]:
            if ra[2] - ra[0] < 2 or ra[3] - ra[1] < 2:
                continue
            tb, bd = sbox(*ra), sbox(*band(ra))
            tw, bh = ra[2] - ra[0], (ra[3] - ra[1]) * 0.6
            for sh, g in geo:
                key = (sh["k"], sh["g"])
                if key in seen or not tb.intersects(g):
                    continue
                if sh.get("contour") and A.get("m"):
                    continue
                k = sh["k"]
                info_why = None
                if k in ("fill", "img"):
                    ig = tb.intersection(g)
                    if ig.is_empty:
                        continue
                    x0, y0, x1, y1 = ig.bounds
                    if not ((x1 - x0) > DEPTH and (y1 - y0) > DEPTH and ig.area > DEPTH * DEPTH * 1.5):
                        continue
                    inside = tb.within(g)
                    if inside and (k == "img" or g.area >= SMALL_FILL or sh["o"] < 0.5):
                        continue
                    kind = "text-img" if k == "img" else "text-fill"
                    what = f"{sh['tag']} {sh['c']}" + (" (inside)" if inside else "")
                    if k == "fill" and g.area < OWN_FILL and g.distance(tb) <= 40:
                        info_why = "marker beside its label"
                else:
                    ig = bd.intersection(g)
                    if ig.is_empty:
                        continue
                    x0, y0, x1, y1 = ig.bounds
                    ix, iy = x1 - x0, y1 - y0
                    crosses = iy >= 0.9 * bh and ix >= 3.0 and sh["o"] > 0.5
                    if not (ix >= 0.25 * tw or crosses):
                        continue
                    if k == "link":
                        kind, what = "text-link", sh["tag"]
                    else:
                        kind = "text-arrow3d" if str(sh["tag"]).startswith(("arrow3d", "rod3d")) else "text-stroke"
                        what = f"{sh['tag']} {sh['c']} w{sh['w']}"
                    if len(sh["pts"]) >= 2 and _near_end(sh, ig.centroid):
                        info_why = "link end label" if k == "link" else "label at the shape's end"
                if A.get("own") and sh.get("own") and A["own"] == sh["own"]:
                    info_why = f"own shape ({A['own']})"
                elif kind in ("text-stroke", "text-fill") and (A.get("m") or len((A["t"] or "").strip()) <= 2):
                    info_why = "map label or one-/two-character mark (H, L) on map linework or its own marker"
                elif kind == "text-arrow3d" and spot(A["t"], bool(A.get("m"))):
                    info_why = "spot label (tick / height / place) on a 3-D rod"
                elif kind == "text-arrow3d" and str(sh["tag"]) == "rod3d" and sh["w"] <= 5 and len((A["t"] or "").strip()) < 12:
                    info_why = "short edge label (< 12 characters) on a thin (≤ 5 px) 3-D edge rod"
                seen.add(key)
                x0, y0, x1, y1 = ig.bounds
                hit = {"kind": "text-shape:" + kind, "a": A["t"], "b": what, "px": (round(x1 - x0), round(y1 - y0)), "at_xy": (round((x0 + x1) / 2), round((y0 + y1) / 2)),
                       "so": sh.get("o", 1), "ao": A.get("o", 1)}
                if info_why:
                    hit["why"] = info_why
                    infos.append(hit)
                else:
                    fails.append(hit)
    links = [sh for sh in shapes if sh["k"] == "link" and len(sh["pts"]) >= 2]
    axes = [sh for sh in shapes if sh["k"] == "axis" and len(sh["pts"]) >= 2]

    def far_cross(a: dict, b: dict, ends_of: list) -> tuple | None:
        la, lb = LineString([tuple(p) for p in a["pts"]]), LineString([tuple(p) for p in b["pts"]])
        if b.get("clip"):
            lb = lb.intersection(sbox(*b["clip"]))
        if lb.is_empty or not la.intersects(lb):
            return None
        X = la.intersection(lb)
        pts = [X] if X.geom_type == "Point" else [g for g in getattr(X, "geoms", [X]) if g.geom_type == "Point"]
        ends = [tuple(p) for s in ends_of for p in (s["pts"][0], s["pts"][-1])]
        far = [q for q in pts if min(((q.x - e[0]) ** 2 + (q.y - e[1]) ** 2) ** 0.5 for e in ends) > 15]
        return (round(far[0].x), round(far[0].y)) if far else None
    for i, a in enumerate(links):
        for b in links[i + 1:]:
            if a["g"] == b["g"]:
                continue
            xy = far_cross(a, b, [a, b])
            if xy:
                fails.append({"kind": "link-link", "a": a["tag"], "b": b["tag"], "px": (0, 0), "at_xy": xy})
        for b in axes:
            xy = far_cross(a, b, [a])
            if xy:
                fails.append({"kind": "link-axis", "a": a["tag"], "b": f"axis {b['tag']}", "px": (0, 0), "at_xy": xy})
    return fails, infos


def check_frame(j: dict, shapes_check=True) -> tuple[list[dict], list[dict]]:
    boxes, masks = j.get("boxes", []), j.get("masks", [])
    sharp = [m for m in masks if m["k"] in ("rect", "circle", "poly")]
    srcs = [m for m in masks if m["k"] == "src"]
    cbars = [m for m in masks if m["k"] == "cbar"]
    src_txt = set()
    for s in srcs:
        for b in boxes:
            if any(inter(r, s["src"])[0] > 0 and inter(r, s["src"])[1] > 0 for r in b["r"]):
                src_txt.add(id(b))
    out, info = [], []
    for i, A in enumerate(boxes):
        for B in boxes[i + 1:]:
            if A.get("own") and A.get("own") == B.get("own") and str(A["own"]).startswith("cbar:"):
                continue
            if any(all(r[0] >= c["src"][0] - 2 and r[1] >= c["src"][1] - 2 and r[2] <= c["src"][2] + 2 and r[3] <= c["src"][3] + 2 for X in (A, B) for r in X["r"])
                   for c in cbars):
                continue   # a colour bar's own title and ticks (older probe: no `own`)
            hit = next(((ix, iy) for ra in A["r"] for rb in B["r"] for ix, iy in [inter(ra, rb)] if ix > TT_DEPTH and iy > -TT_GAP), None)
            if hit:   # iy ≤ 0: glyph runs closer than TT_GAP px (touching, as 16:40 "137 hPa · 14 %" under "height (km)")
                out.append({"kind": "text-text", "a": A["t"], "b": B["t"], "px": [round(hit[0]), round(hit[1])], "ao": A.get("o", 1), "bo": B.get("o", 1)})
        for r in A["r"]:
            if r[2] > 1842 or r[3] > 880:   # the caption band starts at y 880
                out.append({"kind": "edge", "a": A["t"], "box": r})
                break
        for c in cbars:
            if A.get("own") == "cbar:" + str(c.get("name")) or id(A) in src_txt:
                continue
            if str(A.get("own") or "").startswith("cbar:"):
                continue
            cb = c["src"]   # boxes from an older probe carry no `own`: a block wholly inside the bar's box is its own title / tick
            if all(r[0] >= cb[0] - 2 and r[1] >= cb[1] - 2 and r[2] <= cb[2] + 2 and r[3] <= cb[3] + 2 for r in A["r"]):
                continue
            if any(inter(r, c["src"])[0] > TT_DEPTH and inter(r, c["src"])[1] > -CB_GAP for r in A["r"]):
                out.append({"kind": "text-cbar", "a": A["t"], "b": c.get("name"), "box": c["src"]})   # on, or < CB_GAP px from, a colour bar
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
        if s["src"][3] > 880:
            out.append({"kind": "edge", "a": s.get("name"), "box": s["src"]})
        for mk in sharp:
            if in_mask(s["src"], mk):
                out.append({"kind": "src-on-picture", "a": s.get("name"), "mask": mk.get("name")})
    if shapes_check:
        try:
            f_, i_ = check_shapes([b for b in boxes if id(b) not in src_txt], j.get("shapes", []))
            out += f_
            info += i_
        except Exception as e:  # noqa: BLE001
            out.append({"kind": "checker-error", "a": str(e)[:200]})
    return out, info


def xf_frames(timing: Path | None, fps: int = 30, xf: int = 10) -> set[int]:
    """frames inside a scene cross-fade (the next scene's first XF frames, ±1)"""
    if not timing or not Path(timing).exists():
        return set()
    sc = json.loads(Path(timing).read_text(encoding="utf-8"))["scenes"]
    out: set[int] = set()
    for s in sc[1:]:
        a = round(s["start"] * fps)
        out.update(range(a - 1, a + xf + 2))
    return out


def _xf_info(h: dict, j: dict) -> bool:
    """a hit in a cross-fade between one fully opaque block (the old scene, under the new scene's veil) and one fading block or
    mask (the new scene) — the house transition (new over old, reference DotProductWhy), logged as INFO"""
    op = {b["t"]: b.get("o", 1) for b in j.get("boxes", [])}
    oa = h.get("ao", op.get(h.get("a"), 1))
    if h["kind"] == "text-text":
        ob = h.get("bo", op.get(h.get("b"), 1))
        return (oa >= 0.95) != (ob >= 0.95) or h.get("a") == h.get("b") or min(oa, ob) <= 0.55
    if h["kind"] in ("text-cbar", "src-on-picture", "edge"):
        return True   # the outgoing scene's bar / credit under the incoming scene's veil
    if h["kind"].startswith("text-shape:"):
        return True   # a label of one scene against a drawing of the other (3-D drawings carry no CSS fade in the probe)
    if h["kind"] in ("text-picture", "cbar-picture", "src-on-picture"):
        mo = next((m.get("o", 1) for m in j.get("masks", []) if m.get("name") == h.get("mask")), 1)
        return (oa >= 0.95) != (mo >= 0.95)
    return False


def overlap_gate(box_dir: Path, shapes: bool = True, timing: Path | None = None) -> tuple[str, str, dict]:
    files = sorted(Path(box_dir).glob("b*.json"))
    rep = {"frames": len(files), "hits": {}, "info": {}}
    XF = xf_frames(timing)
    for f in files:
        j = json.loads(f.read_text(encoding="utf-8"))
        h, inf = check_frame(j, shapes)
        if j.get("frame") in XF:
            keep = []
            for x in h:
                if _xf_info(x, j):
                    inf.append({**x, "why": "scene cross-fade (old scene under the new scene's fading veil)"})
                else:
                    keep.append(x)
            h = keep
        if h:
            rep["hits"][str(j.get("frame"))] = h
        if inf:
            rep["info"][str(j.get("frame"))] = inf
    n = sum(len(v) for v in rep["hits"].values())
    ni = sum(len(v) for v in rep["info"].values())
    rep["count"], rep["info_count"] = n, ni
    if not files:
        return "FAIL", f"no box files in {box_dir}", rep
    kinds: dict[str, int] = {}
    for v in rep["hits"].values():
        for h in v:
            kinds[h["kind"]] = kinds.get(h["kind"], 0) + 1
    rep["kinds"] = kinds
    tail = f"; {ni} INFO (owner / end-label exemptions)"
    return ("FAIL" if n else "PASS"), (f"{len(files)} frames, {n} hits " + json.dumps(kinds) + tail if n else f"{len(files)} frames, 0 hits" + tail), rep


def k6_frames(timing: Path, fps: int = 30, hold: int = 75) -> list[int]:
    """the frames the gate samples: every scene boundary at −5, 0, +5 frames (cross-fades), every sentence start + 12 (a slot
    change has faded in), middle, and end − 6 (the build complete)"""
    t = json.loads(Path(timing).read_text(encoding="utf-8"))
    sc, total = t["scenes"], t["total_frames"] + hold
    out: set[int] = set()
    for i, s in enumerate(sc):
        a = 0 if i == 0 else round(s["start"] * fps)
        if i:
            out.update({a - 5, a, a + 5})
        for x in s["sentences"]:
            s0, s1 = round(x["start"] * fps), round(x["end"] * fps)
            out.update({s0 + 12, (s0 + s1) // 2, s1 - 6})
    return sorted(f for f in out if 0 <= f < total)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("dir", nargs="?")
    ap.add_argument("--json")
    ap.add_argument("--no-shapes", action="store_true")
    ap.add_argument("--frames", help="print the K6 frame list for this timing.json and exit")
    ap.add_argument("--timing", help="timing.json: hits inside scene cross-fades between an opaque and a fading block become INFO")
    a = ap.parse_args()
    if a.frames:
        print(",".join(map(str, k6_frames(Path(a.frames)))))
        sys.exit(0)
    st, det, rep = overlap_gate(Path(a.dir), not a.no_shapes, Path(a.timing) if a.timing else None)
    print(st, det)
    if a.json:
        Path(a.json).write_text(json.dumps(rep, indent=1, ensure_ascii=False), encoding="utf-8")
    sys.exit(0 if st == "PASS" else 1)
