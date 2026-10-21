"""Scaffold a new interactive explainer from templates/viz_template.html (meta tags filled, library inlined).

Usage (repo root)::

    .venv/Scripts/python.exe tools/new_viz.py ch07 dispersion_relation --order 1 \
        --title "Why long waves outrun short ones" \
        --summary "Drag the wavelength and depth; watch phase speed, group speed and particle orbits respond." \
        --concept "dispersion relation of linear surface gravity waves" \
        --sections "7.2, 7.5" --equations "(7.27), (7.40)" --fluidpy "ch07_gravity_waves.omega" \n        --derivations "D03"

    .venv/Scripts/python.exe tools/new_viz.py ch00 vector_products_lab --3d --part 0A ...   # a 3-D explainer

``--3d`` scaffolds from ``templates/viz_example_globe.html`` (PoC B) when it exists, else from
``templates/viz3d_selftest.html`` (the kit self-test page), with every ``viz:*`` meta filled; the import map and the
3-D kit are inlined by tools/viz_inline.py. Chapter 0 counts explainers per part (``--part 0A|0B|0C``, soft target
about 12: a warning, never a refusal). Refuses to overwrite an existing file (use --force) and to exceed
``book.yaml -> project.max_explainers_per_chapter`` (14) in other chapters.
"""
from __future__ import annotations

import argparse
import html
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))


def main(argv: list[str] | None = None) -> int:
    import yaml

    import viz_inline

    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("chapter")
    ap.add_argument("slug")
    ap.add_argument("--order", default="1")
    ap.add_argument("--title", required=True)
    ap.add_argument("--summary", required=True)
    ap.add_argument("--concept", required=True)
    ap.add_argument("--sections", required=True)
    ap.add_argument("--equations", required=True)
    ap.add_argument("--fluidpy", required=True, help="module.function the JS physics mirrors")
    ap.add_argument("--derivations", default="none",
                    help="ids of the curation's derivations (D03 D04) this explainer steps through, or none")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--3d", dest="three_d", action="store_true", help="scaffold a three.js explainer (viz:3d)")
    ap.add_argument("--part", default=None, help="Chapter 0 part: 0A, 0B or 0C")
    a = ap.parse_args(argv)

    if not re.fullmatch(r"ch\d\d", a.chapter):
        ap.error("chapter must look like ch07")
    if not re.fullmatch(r"[a-z0-9_]+", a.slug):
        ap.error("slug: lowercase letters, digits and underscores only")
    limit = int(yaml.safe_load((ROOT / "book.yaml").read_text(encoding="utf-8"))["project"]["max_explainers_per_chapter"])
    folder = ROOT / "viz" / a.chapter
    folder.mkdir(parents=True, exist_ok=True)
    dest = folder / f"{a.slug}.html"
    existing = [p for p in folder.glob("*.html") if p.name != "index.html" and p != dest]
    if a.chapter == "ch00":
        same = [p for p in existing if f'name="viz:part" content="{a.part}"' in p.read_text(encoding="utf-8")]
        if len(same) >= 12:
            print(f"WARN Chapter 0 part {a.part} already has {len(same)} explainers (soft target about 12; say why in the curation)")
    elif len(existing) >= limit:
        sys.exit(f"{a.chapter} already has {len(existing)} explainers (limit {limit}): {[p.stem for p in existing]}")
    if dest.exists() and not a.force:
        sys.exit(f"{dest.relative_to(ROOT)} exists (use --force to overwrite)")

    if a.three_d:
        src = ROOT / "templates" / "viz_example_globe.html"
        src = src if src.exists() else ROOT / "templates" / "viz3d_selftest.html"
        t = src.read_text(encoding="utf-8")
        vals = {"chapter": a.chapter, "slug": a.slug, "order": a.order, "title": a.title, "summary": a.summary,
                "concept": a.concept, "sections": a.sections, "equations": a.equations, "fluidpy": a.fluidpy,
                "derivations": a.derivations}
        for k, v in vals.items():
            t = re.sub(rf'(<meta name="viz:{k}" content=")[^"]*(")', lambda m, v=v: m.group(1) + html.escape(v, quote=True) + m.group(2), t)
        t = re.sub(r"<title>.*?</title>", lambda _m: f"<title>{html.escape(a.title)}</title>", t, count=1)
        if a.part:
            t = t.replace('<meta name="viz:3d" content="1">',
                          f'<meta name="viz:3d" content="1">\n<meta name="viz:part" content="{a.part}">', 1)
        t = re.sub(r"<!--\s*\n\s*REFERENCE.*?-->\n", "", t, count=1, flags=re.S)
        dest.write_text(t, encoding="utf-8")
        viz_inline.main([str(dest)])
        print(f"created {dest.relative_to(ROOT).as_posix()} from {src.name} — replace the example scene, physics, tour, "
              "equations, check and selftest with the storyboard's")
        return 0
    t = (ROOT / "templates" / "viz_template.html").read_text(encoding="utf-8")
    t = re.sub(r"<!--\s*\n\s*fluidpy interactive explainer — TEMPLATE.*?-->\n", "", t, count=1, flags=re.S)
    fill = {"__CHAPTER__": a.chapter, "__SLUG__": a.slug, "__ORDER__": a.order, "__TITLE__": a.title,
            "__SUMMARY__": a.summary, "__CONCEPT__": a.concept, "__SECTIONS__": a.sections,
            "__EQUATIONS__": a.equations, "__FLUIDPY__": a.fluidpy,
            "__DERIVATIONS__": a.derivations}
    for k, v in fill.items():
        t = t.replace(k, html.escape(v, quote=True) if k not in ("__TITLE__", "__SUMMARY__") else v.replace('"', "&quot;"))
    dest.write_text(t, encoding="utf-8")
    viz_inline.main([str(dest)])
    print(f"created {dest.relative_to(ROOT).as_posix()} — now write physics(), params, stage, tour, equations, check, selftest")
    return 0


if __name__ == "__main__":
    sys.exit(main())
