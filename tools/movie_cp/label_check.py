"""Automatic text-collision and safe-area check for ch00_cross_product_why (fix loop after v4 review 1).

Renders a still at every sentence end (end - 6 frames, the build complete) of every scene with the composition prop
`bbox: true`; the composition's BoxProbe (movies/src/ch00/kit_cp/bbox.tsx) logs the box of every visible text block
(SVG <text>, TeX / Layered / CalcStack row; glyph runs shrunk to the ink). Flags:
  overlap  two text blocks whose glyph runs intersect by > 2 px in both directions
  edge     text inside the 20-px frame edges (x < 20, y < 20) or past x 1840 / y 1040
  band     text in the caption band y 880-1040
Fix loop 2 (review 2: the checker missed KaTeX on picture fills, labels on projected 3-D arrows, arrowheads and arcs
through text): the probe also logs every visible SVG shape and every WebGL arrow / rod / ball / quad projected to the
screen (bbox.tsx measureShapes + probe.ts), and the check adds
  text-fill    a text glyph run on a filled shape (arrowheads, strips, patches, discs, polygons, 3-D arrowheads)
               - straddling its edge, or wholly inside a small opaque fill (< 120 000 px², ≥ 50 %)
  text-img     a text glyph run straddling the edge of a thumbnail / map image
  text-stroke  a text glyph run crossed by an arrow shaft, arc, bracket, loop or projected 3-D arrow / rod (≥ 3 px)
  text-link    a text glyph run crossed by a gold link (path or chevron)
  link-link    two gold links crossing (away from their end points)
usage: label_check.py TAG [--only k,k,...] [--jobs 3] [--bundle] [--bdir NAME] [--port0 4460] [--mid] [--analyse-only] [--text-only]
  TAG     output folder under <scratch>/v4/labels/TAG (stills f*.jpg at half size + b*.json boxes + report.json)
  --bundle   rebuild the Remotion bundle first (after a code change), else reuse <scratch>/v4/bundle_labels
  --mid      also sentence midpoints
"""
from __future__ import annotations

import json
import shutil
import subprocess
import sys
from collections import Counter
from pathlib import Path

from shapely import make_valid, unary_union
from shapely.geometry import LineString, Polygon, box as sbox

ROOT = Path(r"C:\Users\sislam27\Work\Climate Dynamics PHD\AOFD Vallis")
MOVIES = ROOT / "movies"
SCR = Path(r"G:\Geophysical Fluid Dynamics\aofd-data\scratch\movies\ch00_cross_product_why\v4")
TOOLS = MOVIES / "out/ch00/ch00_cross_product_why/_tools"
TIMING = json.load(open(MOVIES / "ch00/ch00_cross_product_why/timing.json", encoding="utf-8"))
SC = TIMING["scenes"]
FPS = 30
TOL = 2.0


def frames(only: set[int] | None, mid: bool) -> list[tuple[int, str]]:
    out = []
    for k, s in enumerate(SC):
        if only is not None and k not in only:
            continue
        for j, x in enumerate(s["sentences"]):
            out.append((round(x["end"] * FPS) - 6, f"{s['id']}:S{j:02d}"))
            if mid:
                out.append((round((x["start"] + x["end"]) / 2 * FPS), f"{s['id']}:S{j:02d}m"))
    return out


def inter(a: list[float], b: list[float]) -> tuple[float, float]:
    return min(a[2], b[2]) - max(a[0], b[0]), min(a[3], b[3]) - max(a[1], b[1])


def check(boxes: list[dict]) -> list[dict]:
    issues = []
    for i, A in enumerate(boxes):
        for B in boxes[i + 1:]:
            hit = None
            for ra in A["r"]:
                for rb in B["r"]:
                    ix, iy = inter(ra, rb)
                    if ix > TOL and iy > TOL:
                        hit = (round(ix), round(iy))
                        break
                if hit:
                    break
            if hit:
                issues.append({"kind": "overlap", "a": A["t"], "b": B["t"], "px": hit})
        for r in A["r"]:
            x0, y0, x1, y1 = r
            why = []
            if x0 < 20 - TOL or y0 < 20 - TOL:
                why.append("edge20")
            if x1 > 1840 + TOL:
                why.append(f"x>{1840}:{x1:.0f}")
            if y1 > 1040 + TOL:
                why.append(f"y>{1040}:{y1:.0f}")
            if y1 > 880 + TOL and y0 < 1040 - TOL:
                why.append(f"band:{y0:.0f}-{y1:.0f}")
            if why:
                issues.append({"kind": "edge" if not any(w.startswith("band") for w in why) else "band", "a": A["t"], "why": why})
                break
    return issues


DEPTH = 3.0      # px: an overlap counts when the intersection is at least this deep in both directions
SMALL_FILL = 120000.0


def _geom(sh: dict):
    g = _geom0(sh)
    if g is not None and sh.get("clip"):
        g = g.intersection(sbox(*sh["clip"]))
        if g.is_empty:
            return None
    return g


def _geom0(sh: dict):
    pts = [tuple(p) for p in sh["pts"]]
    if sh["k"] in ("fill", "img"):
        if len(pts) < 3:
            return None
        g = make_valid(Polygon(pts)).buffer(0)
        return g if not g.is_empty else None
    if len(pts) < 2:
        return None
    return LineString(pts).buffer(max(sh["w"], 3.0) / 2, cap_style="flat")


def _deep(g) -> bool:
    if g.is_empty:
        return False
    x0, y0, x1, y1 = g.bounds
    return (x1 - x0) > DEPTH and (y1 - y0) > DEPTH and g.area > DEPTH * DEPTH * 1.5


def check_shapes(boxes: list[dict], shapes: list[dict]) -> list[dict]:
    issues = []
    geo = []
    merged: dict[tuple, list] = {}
    for sh in shapes:
        try:
            g = _geom(sh)
        except Exception:  # noqa: BLE001
            g = None
        if g is None:
            continue
        if sh["k"] in ("fill", "img"):  # a strip drawn as many bands, a disc as wedges: one drawing per parent group
            merged.setdefault((sh["k"], sh["g"]), []).append((sh, g))
        else:
            geo.append((sh, g))
    for parts in merged.values():
        try:
            g = unary_union([h for _, h in parts])
        except Exception:  # noqa: BLE001  (invalid topology: keep the parts separate)
            geo.extend(parts)
            continue
        sh = dict(parts[0][0])
        sh["o"] = max(p[0]["o"] for p in parts)
        geo.append((sh, g))
    for A in boxes:
        hits: dict = {}
        for ra in A["r"]:
            if ra[2] - ra[0] < 2 or ra[3] - ra[1] < 2:
                continue
            tb = sbox(*ra)
            for i, (sh, g) in enumerate(geo):
                if sh.get("contour") and A.get("m"):  # a map label (contour value, place name) on the isobars: by design
                    continue
                key = (sh["k"], sh["g"])
                if key in hits or not tb.intersects(g):
                    continue
                inter_g = tb.intersection(g)
                if not _deep(inter_g):
                    continue
                k = sh["k"]
                if k in ("fill", "img"):
                    inside = tb.within(g)
                    if inside and (k == "img" or g.area >= SMALL_FILL or sh["o"] < 0.5):
                        continue
                    kind = "text-img" if k == "img" else "text-fill"
                    what = f"{sh['tag']} {sh['c']}" + (" (inside)" if inside else "")
                elif k == "link":
                    kind, what = "text-link", sh["tag"]
                else:
                    kind = "text-arrow3d" if sh["tag"].startswith(("arrow3d", "rod3d")) else "text-stroke"
                    what = f"{sh['tag']} {sh['c']} w{sh['w']}"
                x0, y0, x1, y1 = inter_g.bounds
                hits[key] = {"kind": kind, "a": A["t"], "b": what, "px": (round(x1 - x0), round(y1 - y0)),
                           "at_xy": (round((x0 + x1) / 2), round((y0 + y1) / 2))}
        issues.extend(hits.values())
    links = [sh for sh in shapes if sh["k"] == "link" and len(sh["pts"]) >= 2]
    for i, a in enumerate(links):
        la = LineString([tuple(p) for p in a["pts"]])
        for b in links[i + 1:]:
            if a["g"] == b["g"]:
                continue
            lb = LineString([tuple(p) for p in b["pts"]])
            if not la.intersects(lb):
                continue
            X = la.intersection(lb)
            ends = [tuple(p) for p in (a["pts"][0], a["pts"][-1], b["pts"][0], b["pts"][-1])]
            pts = [X] if X.geom_type == "Point" else list(getattr(X, "geoms", [X]))
            far = [q for q in pts if q.geom_type == "Point" and min(((q.x - e[0]) ** 2 + (q.y - e[1]) ** 2) ** 0.5 for e in ends) > 15]
            if far:
                issues.append({"kind": "link-link", "a": a["tag"], "b": b["tag"], "px": (0, 0), "at_xy": (round(far[0].x), round(far[0].y))})
    return issues


def run_render(fr: list[int], out: Path, jobs: int, rebundle: bool, bname: str = "bundle_labels", port0: int = 4460) -> None:
    TOOLS.mkdir(parents=True, exist_ok=True)
    shutil.copy(Path(__file__).with_name("label_stills.mjs"), TOOLS / "label_stills.mjs")
    bdir = SCR / bname
    if rebundle or not (bdir / "index.html").exists():
        r = subprocess.run(["node", str(TOOLS / "label_stills.mjs"), "--bundle", str(SCR / "public"), str(out), "-", "--bundle-out", str(bdir),
                            "--bundle-only"], cwd=MOVIES, capture_output=True, text=True)
        print(r.stdout[-500:], r.stderr[-1500:])
    todo = [f for f in fr if not (out / f"b{f:05d}.json").exists()]
    chunks = [todo[i::jobs] for i in range(jobs)]
    procs = []
    for i, ch in enumerate(chunks):
        if not ch:
            continue
        ff = out / f"frames_{i}.txt"
        ff.write_text(",".join(map(str, ch)))
        log = open(out / f"render_{i}.log", "w")
        procs.append(subprocess.Popen(["node", str(TOOLS / "label_stills.mjs"), str(bdir), str(SCR / "public"), str(out), str(ff), "--port", str(port0 + i)],
                                      cwd=MOVIES, stdout=log, stderr=subprocess.STDOUT))
    for p in procs:
        p.wait()


def main() -> None:
    a = sys.argv[1:]
    tag = a[0]
    only = {int(x) for x in a[a.index("--only") + 1].split(",")} if "--only" in a else None
    jobs = int(a[a.index("--jobs") + 1]) if "--jobs" in a else 3
    out = SCR / "labels" / tag
    out.mkdir(parents=True, exist_ok=True)
    fr = frames(only, "--mid" in a)
    if "--analyse-only" not in a:
        run_render(sorted({f for f, _ in fr}), out, jobs, "--bundle" in a, a[a.index("--bdir") + 1] if "--bdir" in a else "bundle_labels",
                   int(a[a.index("--port0") + 1]) if "--port0" in a else 4460)
    rows, missing = [], []
    for f, name in fr:
        p = out / f"b{f:05d}.json"
        if not p.exists():
            missing.append(name)
            continue
        J = json.load(open(p, encoding="utf-8"))
        iss = check(J["boxes"]) + (check_shapes(J["boxes"], J.get("shapes", [])) if "--text-only" not in a else [])
        t = f / FPS
        for x in iss:
            rows.append({"frame": f, "t": f"{int(t // 60):02d}:{t % 60:05.2f}", "at": name, **x})
    (out / "report.json").write_text(json.dumps({"frames": len(fr), "missing": missing, "issues": rows}, indent=1, ensure_ascii=False),
                                     encoding="utf-8")
    kinds = Counter(r["kind"] for r in rows)
    scenes = Counter(r["at"].split(":")[0] for r in rows)
    print(f"{len(fr)} frames checked ({len(missing)} missing); issues: {dict(kinds)}; frames with issues: "
          f"{len({r['frame'] for r in rows})}; scenes with issues: {len(scenes)}")
    for s, n in sorted(scenes.items()):
        print(f"  {s}: {n}")
    for r in rows:
        extra = f" {r['why']}" if r["kind"] in ("edge", "band") else f" <-> {r['b']!r} {r['px']}" + (f" @{r['at_xy']}" if "at_xy" in r else "")
        print(f"{r['t']} f{r['frame']} {r['at']} {r['kind']}: {r['a']!r}{extra}")


if __name__ == "__main__":
    main()
