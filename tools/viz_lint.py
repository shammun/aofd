"""Static lint for interactive explainers — fast checks that run before the (slower) browser audit in tools/shot.py.

Errors (fail):
  * missing or placeholder ``<meta name="viz:*">`` tags (chapter, slug, order, title, summary, concept, sections,
    equations, fluidpy, derivations); ``viz:chapter``/``viz:slug`` must match the file's folder/name;
  * missing VIZ_BASE_CSS / VIZ_LIB_JS marker blocks, or no ``Viz.app(`` call;
  * external resources other than KaTeX (which viz_lib loads itself): ``<script src=``, ``<link href=``, ``@import``,
    ``fetch(``, ``XMLHttpRequest``, ``<img src="http``;
  * no ``tour:``, ``equations:``, ``explain:``, ``code:``, ``check:`` or ``selftest:`` section; a ``viz:derivations`` id
    (``D03 D04`` or ``none``) without its ``derivations: [{id: 'D03', …}]`` entry; no ``ref:`` (book equation number) in the equations;
    no ``py:`` parity row in selftest (explainers in a chapter folder must mirror a fluidpy function);
  * chapter CSS that re-introduces scrolling (``overflow: auto|scroll``, ``overflow-y``) or tiny text
    (``font-size`` below 12px) or fixed pixel widths above 360px;
  * file larger than 600 kB;
  * more than ``max_explainers_per_chapter`` explainers in the folder (14); Chapter 0 (``viz/ch00``) is counted per
    part (``<meta name="viz:part" content="0A|0B|0C">``) against a soft target of about 12 — a WARN, never an error;
  * AOFD 3-D rules for ``<meta name="viz:3d" content="1">``: the three.js import map is present and pinned to
    three@0.186.1 (jsDelivr), the VIZ3D_JS/VIZ3D_CSS blocks are present, no other CDN or three version is referenced;
  * jet/rainbow colour maps (``'jet'``, ``'rainbow'``, ``'hsv'``, ``'gist_rainbow'``, ``'nipy_spectral'``) unless the page
    is the labelled bad example (``<meta name="viz:badexample" content="1">``);
  * a page that declares data (``<meta name="viz:data" content="<registry keys>">``) without a ``kind: 'data'``
    provenance chip; a Viz3D layer without any provenance chip is a WARN.
Standalone scene pages (``scenes/**.html``) get the scene rules instead of the explainer ones: viz:3d meta + import
map + 3-D blocks, caption cards (``scene-caption``), a side panel (``scene-panel``), a provenance chip, a
``window.SCENE`` with ``selftest``, no jet, ≤ 600 kB.
Warnings: ``console.log`` left in; very long walkthrough texts (> 90 words in one step, heuristic).

Usage::  .venv/Scripts/python.exe tools/viz_lint.py viz/ch07/*.html      or   --chapter ch07   or   --all
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REQUIRED_META = ("chapter", "slug", "order", "title", "summary", "concept", "sections", "equations", "fluidpy", "derivations")
MAX_BYTES = 600_000
THREE_VERSION = "0.186.1"
CH0_PART_TARGET = 12
BAD_CMAPS = re.compile(r"""['"](jet|rainbow|hsv|gist_rainbow|nipy_spectral)['"]""")
OTHER_CDN = re.compile(r"https?://(unpkg\.com|cdnjs\.cloudflare\.com/ajax/libs/three|esm\.sh|cdn\.skypack\.dev|ga\.jspm\.io)", re.I)


def _chapter_part(html: str) -> tuple[str, str]:
    """(chapter CSS, chapter JS) — i.e. everything that is not the inlined library."""
    css = re.sub(r"/\* VIZ_BASE_CSS:BEGIN.*?/\* VIZ_BASE_CSS:END \*/", "", html, flags=re.S)
    js = re.sub(r"/\* VIZ_LIB_JS:BEGIN \*/.*?/\* VIZ_LIB_JS:END \*/", "", css, flags=re.S)
    js = strip3d(js)
    styles = "\n".join(re.findall(r"<style[^>]*>(.*?)</style>", js, flags=re.S))
    scripts = "\n".join(re.findall(r"<script[^>]*>(.*?)</script>", js, flags=re.S))
    return styles, scripts


def strip3d(html: str) -> str:
    """Remove the inlined 3-D kit and its data tables (they are library code, not chapter code)."""
    for tag in ("VIZ3D_CSS", "VIZ3D_JS", "VIZ3D_LUTS", "VIZ3D_COAST"):
        html = re.sub(r"/\* " + tag + r":BEGIN \*/.*?/\* " + tag + r":END \*/", "", html, flags=re.S)
    return html


def rules_3d(html: str, meta: dict, js: str, scene: bool) -> list[str]:
    msgs: list[str] = []
    three = meta.get("3d") == "1"
    if scene and not three:
        msgs.append('scene page without <meta name="viz:3d" content="1">')
    if three:
        m = re.search(r'<script type="importmap"[^>]*>(.*?)</script>', html, flags=re.S)
        if not m:
            msgs.append("viz:3d page without the three.js import map (run tools/viz_inline.py)")
        else:
            vers = set(re.findall(r"three@([\d.]+)", m.group(1)))
            if vers != {THREE_VERSION}:
                msgs.append(f"import map pins three@{sorted(vers)} (must be {THREE_VERSION})")
        for tag in ("VIZ3D_JS", "VIZ3D_CSS"):
            if f"/* {tag}:BEGIN */" not in html:
                msgs.append(f"viz:3d page without the {tag} block")
        for v in set(re.findall(r"three@([\d.]+)", js)) - {THREE_VERSION}:
            msgs.append(f"chapter code references three@{v} (the kit pins {THREE_VERSION})")
    if OTHER_CDN.search(js):
        msgs.append("chapter code references another CDN (three.js comes only from the jsDelivr import map)")
    if BAD_CMAPS.search(js) and meta.get("badexample") != "1":
        msgs.append("jet/rainbow colour map (allowed only on the labelled bad example: viz:badexample)")
    if meta.get("data", "").strip() and not re.search(r"kind\s*:\s*['\"]data['\"]", js):
        msgs.append("viz:data declared but no provenance chip of kind 'data' (dataset, period, licence)")
    if re.search(r"Viz3D\.(globe|fieldSurface|particles|vectorField|layerStack|isosurface|streamtubes)\(", js) and "provenance" not in js:
        msgs.append("WARN Viz3D layers without any provenance chip (computed / schematic / data)")
    return msgs


def lint_scene(path: Path, html: str) -> list[str]:
    msgs: list[str] = []
    meta = dict(re.findall(r'<meta\s+name="viz:([\w-]+)"\s+content="([^"]*)"', html))
    for k in ("chapter", "slug", "title", "summary", "concept"):
        if not meta.get(k) or meta[k].startswith("__"):
            msgs.append(f"meta viz:{k} missing or placeholder")
    _css, js = _chapter_part(html)
    msgs += rules_3d(html, meta, js, scene=True)
    for cls, what in (("scene-caption", "caption cards ('what you are looking at')"), ("scene-panel", "side panel"),
                      ("provenance", "provenance chip")):
        if cls not in html:
            msgs.append(f"scene has no {what} ({cls})")
    if "window.SCENE" not in js or "selftest" not in js:
        msgs.append("scene has no window.SCENE = {selftest() {...}} parity rows")
    size = len(html.encode("utf-8"))
    if size > MAX_BYTES:
        msgs.append(f"file is {size / 1e3:.0f} kB (> {MAX_BYTES / 1e3:.0f} kB)")
    return msgs


def lint_text(path: Path, html: str) -> list[str]:
    if "scenes" in path.parts:
        return lint_scene(path, html)
    if path.name == "viz_template.html":       # the scaffold: tools/new_viz.py fills its __PLACEHOLDERS__
        return ["WARN scaffold template: placeholders are filled by tools/new_viz.py (not linted)"]
    msgs: list[str] = []
    meta = dict(re.findall(r'<meta\s+name="viz:([\w-]+)"\s+content="([^"]*)"', html))
    for k in REQUIRED_META:
        if not meta.get(k) or meta[k].startswith("__"):
            msgs.append(f"meta viz:{k} missing or placeholder")
    in_chapter = re.fullmatch(r"ch\d\d", path.parent.name) is not None
    if in_chapter:
        if meta.get("chapter") and meta["chapter"] != path.parent.name:
            msgs.append(f"viz:chapter={meta['chapter']!r} but the file is in {path.parent.name}/")
        if meta.get("slug") and meta["slug"] != path.stem:
            msgs.append(f"viz:slug={meta['slug']!r} but the file is {path.name}")
    if "/* VIZ_BASE_CSS:BEGIN" not in html or "/* VIZ_LIB_JS:BEGIN */" not in html:
        msgs.append("missing VIZ marker blocks (start from templates/viz_template.html via tools/new_viz.py)")
    css, js = _chapter_part(html)
    if "Viz.app(" not in js:
        msgs.append("no Viz.app({...}) call")
    rest = strip3d(re.sub(r"/\* VIZ_LIB_JS:BEGIN \*/.*?/\* VIZ_LIB_JS:END \*/", "", html, flags=re.S))
    msgs += rules_3d(html, meta, js, scene=False)
    for pat, what in [(r"<script[^>]+src=", "<script src=…> (inline everything; KaTeX is loaded by viz_lib)"),
                      (r"<link[^>]+href=", "<link href=…>"), (r"@import", "@import"), (r"\bfetch\(", "fetch("),
                      (r"XMLHttpRequest", "XMLHttpRequest"), (r"<img[^>]+src=\"https?:", "remote <img>")]:
        if re.search(pat, rest):
            msgs.append(f"external resource: {what}")
    for section in ("tour:", "equations:", "selftest:", "code:", "check:"):
        if not re.search(r"\b" + section, js):
            msgs.append(f"no {section[:-1]} section" + (" (required: the Python behind the picture)" if section == "code:" else ""))
    if not re.search(r"\b(explain|calc)\s*:", js):
        msgs.append("no explain: section (required: Explanation & interpretation with the reader's numbers)")
    wanted = [x for x in re.split(r"[\s,;]+", meta.get("derivations", "")) if x and x.lower() != "none"]
    if wanted and not re.search(r"\bderivations\s*:", js):
        msgs.append(f"viz:derivations lists {wanted} but there is no derivations: [...] section")
    for w in wanted:
        if not re.search(r"id\s*:\s*['\"]" + re.escape(w) + r"['\"]", js):
            msgs.append(f"derivation id '{w}' (from viz:derivations) not found in the script")
    if "equations:" in js and "ref:" not in js:
        msgs.append("equations carry no ref: 'Eq. (N.M)' (cite the book's equation numbers)")
    if in_chapter and "selftest:" in js and not re.search(r"\bpy\s*:", js):
        msgs.append("selftest has no py: parity row against a fluidpy function")
    if re.search(r"overflow(-[xy])?\s*:\s*(auto|scroll)", css):
        msgs.append("chapter CSS sets overflow auto/scroll (the no-scroll rule: use a tab or the pager)")
    for m in re.finditer(r"font-size\s*:\s*([\d.]+)px", css):
        if float(m.group(1)) < 12:
            msgs.append(f"chapter CSS font-size {m.group(1)}px < 12px")
    for m in re.finditer(r"(?<![-\w])(min-)?width\s*:\s*(\d+)px", css):
        if int(m.group(2)) > 360:
            msgs.append(f"chapter CSS fixed width {m.group(2)}px > 360px (breaks phones)")
    size = len(html.encode("utf-8"))
    if size > MAX_BYTES:
        msgs.append(f"file is {size / 1e3:.0f} kB (> {MAX_BYTES / 1e3:.0f} kB)")
    if "console.log(" in js:
        msgs.append("WARN console.log left in the chapter script")
    for m in re.finditer(r"text\s*:\s*'((?:[^'\\]|\\.)*)'", js):
        if len(m.group(1).split()) > 90:
            msgs.append(f"WARN a walkthrough/explore text has {len(m.group(1).split())} words (keep steps short; phones)")
    return msgs


def lint_files(files: list[Path]) -> dict[Path, list[str]]:
    out = {f: lint_text(f, f.read_text(encoding="utf-8")) for f in files}
    try:
        import yaml
        limit = int(yaml.safe_load((ROOT / "book.yaml").read_text(encoding="utf-8"))["project"]["max_explainers_per_chapter"])
    except Exception:  # noqa: BLE001
        limit = 5
    by_folder: dict[Path, int] = {}
    for f in files:
        if re.fullmatch(r"ch\d\d", f.parent.name):
            by_folder[f.parent] = len([p for p in f.parent.glob("*.html") if p.name != "index.html"])
    for folder, n in by_folder.items():
        first = next(f for f in files if f.parent == folder)
        if folder.name == "ch00":       # Chapter 0: per part (0A/0B/0C), about 12 each — a soft target (Q11)
            parts: dict[str, int] = {}
            for q in folder.glob("*.html"):
                if q.name == "index.html":
                    continue
                m = re.search(r'<meta\s+name="viz:part"\s+content="([^"]*)"', q.read_text(encoding="utf-8"))
                parts[m.group(1) if m else "?"] = parts.get(m.group(1) if m else "?", 0) + 1
            for part, k in sorted(parts.items()):
                if k > CH0_PART_TARGET + 2 or k < 5:
                    out[first].append(f"WARN Chapter 0 part {part} has {k} explainers (soft target about {CH0_PART_TARGET})")
            continue
        if n > limit:
            out[first].append(f"{folder.name} has {n} explainers (limit {limit})")
    return out


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("paths", nargs="*")
    ap.add_argument("--chapter")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--quick", action="store_true", help="hook mode (tools/hooks/post_write.py): same checks, terse")
    a = ap.parse_args(argv)
    files = [Path(p) if Path(p).is_absolute() else ROOT / p for p in a.paths]
    if a.chapter:
        files += sorted(p for p in (ROOT / "viz" / a.chapter).glob("*.html") if p.name != "index.html")
    if a.all:
        files += sorted(p for p in (ROOT / "viz").glob("ch??/*.html") if p.name != "index.html")
        files += sorted(p for p in (ROOT / "scenes").glob("ch??/*.html") if p.name != "index.html")
    if not files:
        ap.error("give files, --chapter or --all")
    bad = 0
    for f, msgs in lint_files(files).items():
        errors = [m for m in msgs if not m.startswith("WARN")]
        rel = f.relative_to(ROOT).as_posix() if f.is_relative_to(ROOT) else str(f)
        if a.quick and not msgs:
            continue
        print(("FAIL " if errors else "ok   ") + rel)
        for m in msgs:
            print("   -", m)
        bad += bool(errors)
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
