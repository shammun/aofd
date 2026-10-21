"""Inline the shared explainer libraries into explainer and scene HTML files, so every page stays ONE self-contained file.

Every explainer (``viz/chNN/<slug>.html``, ``templates/viz_*.html``) carries two required marker blocks::

    <style id="viz-base">/* VIZ_BASE_CSS:BEGIN */ … /* VIZ_BASE_CSS:END */</style>
    <script id="viz-lib">/* VIZ_LIB_JS:BEGIN */ … /* VIZ_LIB_JS:END */</script>

Pages with ``<meta name="viz:3d" content="1">`` (3-D explainers, ``scenes/chNN/*.html``, ``templates/viz3d_*.html``)
also carry the 3-D kit and, only when they ask for them, its data tables::

    <style id="viz3d-css">/* VIZ3D_CSS:BEGIN */ … /* VIZ3D_CSS:END */</style>
    <script id="viz3d-data">/* VIZ3D_LUTS:BEGIN */ … /* VIZ3D_LUTS:END */  /* VIZ3D_COAST:BEGIN */ … /* VIZ3D_COAST:END */</script>
    <script id="viz3d-lib">/* VIZ3D_JS:BEGIN */ … /* VIZ3D_JS:END */</script>

For a viz:3d page this tool also writes the three.js **import map** into ``<head>`` (three 0.186.1 from jsDelivr, R2 §2.2),
replacing any existing one. A scene module kept in its own file is inlined between
``/* SCENE_JS:BEGIN viz/ch02/scenes/coriolis_globe.scene.js */`` and ``/* SCENE_JS:END */`` (path relative to the repo).

This tool replaces whatever sits between the markers with the current asset bodies. Edit the assets, never the
inlined copies. Why inline: explainers are shown through ``<iframe srcdoc>`` in Jupyter/VS Code/Colab, where relative
URLs do not resolve; a self-contained file works in every host, offline too (three.js alone stays on the CDN).

Usage (repo root)::

    .venv/Scripts/python.exe tools/viz_inline.py viz/ch07/dispersion_relation.html
    .venv/Scripts/python.exe tools/viz_inline.py --all          # viz/**, scenes/**, templates/viz*.html
    .venv/Scripts/python.exe tools/viz_inline.py --all --check  # exit 1 if any file is out of date (used by viz_lint)
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
THREE_VERSION = "0.186.1"
IMPORT_MAP = {
    "imports": {
        "three": f"https://cdn.jsdelivr.net/npm/three@{THREE_VERSION}/build/three.module.min.js",
        "three/addons/": f"https://cdn.jsdelivr.net/npm/three@{THREE_VERSION}/examples/jsm/",
    }
}
IMPORT_MAP_TAG = ('<script type="importmap" id="viz3d-importmap">' + json.dumps(IMPORT_MAP, separators=(",", ":"))
                  + "</script>")

# kind: (begin marker, end marker, source)
BLOCKS = {
    "css": ("/* VIZ_BASE_CSS:BEGIN", "/* VIZ_BASE_CSS:END */", ASSETS / "viz_base.css"),
    "js": ("/* VIZ_LIB_JS:BEGIN */", "/* VIZ_LIB_JS:END */", ASSETS / "viz_lib.js"),
}
OPTIONAL = {
    "css3d": ("/* VIZ3D_CSS:BEGIN */", "/* VIZ3D_CSS:END */", ASSETS / "viz3d.css"),
    "js3d": ("/* VIZ3D_JS:BEGIN */", "/* VIZ3D_JS:END */", ASSETS / "viz3d.js"),
    "luts": ("/* VIZ3D_LUTS:BEGIN */", "/* VIZ3D_LUTS:END */", ASSETS / "luts.json"),
    "coast": ("/* VIZ3D_COAST:BEGIN */", "/* VIZ3D_COAST:END */", ASSETS / "coast110.json"),
}
DATA_GLOBAL = {"luts": "VIZ3D_LUTS", "coast": "VIZ3D_COAST"}
SCENE_RE = re.compile(r"(/\* SCENE_JS:BEGIN ([^ ]+?) \*/)(.*?)(/\* SCENE_JS:END \*/)", re.S)


def asset_body(kind: str) -> str:
    """The text between the markers in the asset file (markers excluded, surrounding newlines trimmed).

    JSON data assets have no markers: their body is ``window.<NAME> = <json>;``."""
    begin, end, path = (BLOCKS | OPTIONAL)[kind]
    text = path.read_text(encoding="utf-8")
    if kind in DATA_GLOBAL:
        return f"window.{DATA_GLOBAL[kind]} = {json.dumps(json.loads(text), separators=(',', ':'))};"
    i = text.find(begin)
    j = text.find(end)
    if i < 0 or j < 0:
        raise SystemExit(f"{path}: markers {begin!r} / {end!r} not found")
    i = text.find("*/", i) + 2  # skip the rest of the BEGIN comment line
    return text[i:j].strip("\n")


def is_3d(html: str) -> bool:
    return re.search(r'<meta\s+name="viz:3d"\s+content="1"', html) is not None


def _replace(html: str, begin: str, end: str, head: str, body: str) -> tuple[str, bool]:
    start = html.find(begin)
    stop = html.find(end, start + 1) if start >= 0 else -1
    if start < 0 or stop < 0:
        return html, False
    return html[:start] + head + "\n" + body + "\n" + html[stop:], True


def inline_text(html: str, bodies: dict[str, str]) -> tuple[str, list[str]]:
    """Return (new_html, missing_marker_kinds). Required blocks always; 3-D blocks when present (required on viz:3d)."""
    missing = []
    for kind, (begin, end, _path) in BLOCKS.items():
        head = ("/* VIZ_BASE_CSS:BEGIN (inlined from assets/viz_base.css by tools/viz_inline.py) */" if kind == "css"
                else "/* VIZ_LIB_JS:BEGIN */")
        html, ok = _replace(html, begin, end, head, bodies[kind])
        if not ok:
            missing.append(kind)
    three = is_3d(html)
    for kind, (begin, end, _path) in OPTIONAL.items():
        html, ok = _replace(html, begin, end, begin, bodies[kind])
        if not ok and three and kind in ("css3d", "js3d"):
            missing.append(kind)
    if three:
        if re.search(r'<script type="importmap"[^>]*>.*?</script>', html, flags=re.S):
            html = re.sub(r'<script type="importmap"[^>]*>.*?</script>', lambda _m: IMPORT_MAP_TAG, html, count=1, flags=re.S)
        else:
            html = re.sub(r"(<head[^>]*>)", lambda m: m.group(1) + "\n" + IMPORT_MAP_TAG, html, count=1)

    def scene(m: re.Match) -> str:
        p = ROOT / m.group(2)
        if not p.exists():
            missing.append(f"scene module {m.group(2)}")
            return m.group(0)
        return m.group(1) + "\n" + p.read_text(encoding="utf-8").strip("\n") + "\n" + m.group(4)
    html = SCENE_RE.sub(scene, html)
    return html, missing


def targets(paths: list[str], all_: bool) -> list[Path]:
    out: list[Path] = []
    if all_:
        out += sorted(p for p in (ROOT / "viz").glob("**/*.html") if p.name not in ("index.html", "atlas.html"))
        out += sorted(p for p in (ROOT / "scenes").glob("**/*.html") if p.name != "index.html")
        out += sorted((ROOT / "templates").glob("viz*.html"))
    for p in paths:
        q = Path(p)
        out.append(q if q.is_absolute() else ROOT / q)
    return out


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("paths", nargs="*")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--check", action="store_true", help="do not write; exit 1 if a file is out of date")
    a = ap.parse_args(argv)
    files = targets(a.paths, a.all)
    if not files:
        ap.error("give explainer paths or --all")
    bodies = {k: asset_body(k) for k in (BLOCKS | OPTIONAL)}
    stale, bad = [], []
    for f in files:
        html = f.read_text(encoding="utf-8")
        new, missing = inline_text(html, bodies)
        rel = f.relative_to(ROOT).as_posix() if f.is_relative_to(ROOT) else str(f)
        if missing:
            bad.append(f"{rel}: missing marker block(s) {missing}")
            continue
        if new != html:
            stale.append(rel)
            if not a.check:
                f.write_text(new, encoding="utf-8")
    for b in bad:
        print("ERROR", b)
    if a.check:
        for s in stale:
            print("STALE", s, "(run tools/viz_inline.py)")
        return 1 if (stale or bad) else 0
    print(f"inlined the viz libraries into {len(stale)} file(s); {len(files) - len(stale) - len(bad)} already current")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
