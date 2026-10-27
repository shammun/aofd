"""Automatic text-collision and safe-area check for ch00_cross_product_why (fix loop after v4 review 1).

Renders a still at every sentence end (end - 6 frames, the build complete) of every scene with the composition prop
`bbox: true`; the composition's BoxProbe (movies/src/ch00/kit_cp/bbox.tsx) logs the box of every visible text block
(SVG <text>, TeX / Layered / CalcStack row; glyph runs shrunk to the ink). Flags:
  overlap  two text blocks whose glyph runs intersect by > 2 px in both directions
  edge     text inside the 20-px frame edges (x < 20, y < 20) or past x 1840 / y 1040
  band     text in the caption band y 880-1040
usage: label_check.py TAG [--only k,k,...] [--jobs 3] [--bundle] [--mid] [--analyse-only]
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


def run_render(fr: list[int], out: Path, jobs: int, rebundle: bool) -> None:
    TOOLS.mkdir(parents=True, exist_ok=True)
    shutil.copy(Path(__file__).with_name("label_stills.mjs"), TOOLS / "label_stills.mjs")
    bdir = SCR / "bundle_labels"
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
        procs.append(subprocess.Popen(["node", str(TOOLS / "label_stills.mjs"), str(bdir), str(SCR / "public"), str(out), str(ff)],
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
        run_render(sorted({f for f, _ in fr}), out, jobs, "--bundle" in a)
    rows, missing = [], []
    for f, name in fr:
        p = out / f"b{f:05d}.json"
        if not p.exists():
            missing.append(name)
            continue
        iss = check(json.load(open(p, encoding="utf-8"))["boxes"])
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
        extra = f" <-> {r['b']!r} {r['px']}" if r["kind"] == "overlap" else f" {r['why']}"
        print(f"{r['t']} f{r['frame']} {r['at']} {r['kind']}: {r['a']!r}{extra}")


if __name__ == "__main__":
    main()
