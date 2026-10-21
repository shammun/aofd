"""Machinery tests for the AOFD tools (fast, no browser). The 3-D kit section was written in setup step 8; step 10
adds the inherited fluidpy machinery checks (book.yaml, progress.json, nbkit, publish, check_public).

Browser audits are not run here: ``tools/shot.py --3d templates/viz3d_selftest.html`` is the end-to-end check.
"""
from __future__ import annotations

import base64
import json
import shutil
import subprocess
import sys
from pathlib import Path

import numpy as np
import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))

import viz_inline  # noqa: E402
import viz_lint  # noqa: E402


# ---------- 3-D kit: data tables ----------
def test_luts_json_tables_decode_and_match_matplotlib():
    import matplotlib

    d = json.loads((ROOT / "assets" / "luts.json").read_text(encoding="utf-8"))
    names = set(d["tables"])
    assert {"viridis", "cividis", "cmocean.thermal", "cmocean.balance", "cmocean.dense", "jet"} <= names
    assert d["_bad"] == ["jet"]
    for b64 in d["tables"].values():
        assert len(base64.b64decode(b64)) == 768
    rgb = np.frombuffer(base64.b64decode(d["tables"]["viridis"]), dtype=np.uint8).reshape(256, 3)
    ref = (np.asarray(matplotlib.colormaps["viridis"](np.linspace(0, 1, 256)))[:, :3] * 255 + 0.5).astype(np.uint8)
    assert np.array_equal(rgb, ref)


def test_coast110_decodes_to_valid_lonlat_polylines():
    c = json.loads((ROOT / "assets" / "coast110.json").read_text(encoding="utf-8"))
    v = np.frombuffer(base64.b64decode(c["data"]), dtype="<i2").reshape(-1, 2) / c["scale"]
    assert len(v) == c["n_points"] and len(c["starts"]) == c["n_lines"]
    assert np.all(np.abs(v[:, 0]) <= 180.0) and np.all(np.abs(v[:, 1]) <= 90.0)
    assert c["starts"] == sorted(c["starts"]) and c["starts"][0] == 0
    assert (ROOT / "assets" / "coast110.json").stat().st_size < 35_000
    # Antarctica reaches below 60°S and something lies north of 80°N (Greenland / Arctic islands): not lat-flipped
    assert v[:, 1].min() < -60 and v[:, 1].max() > 80


# ---------- 3-D kit: JS sources ----------
def test_viz3d_js_exposes_the_r2_api():
    js = (ROOT / "assets" / "viz3d.js").read_text(encoding="utf-8")
    for name in ("Viz3D.scene", "Viz3D.load", "Viz3D.vectorField", "Viz3D.vectorGlyph", "Viz3D.labels", "Viz3D.legend",
                 "Viz3D.cameraPresets", "Viz3D.globe", "Viz3D.fieldSurface", "Viz3D.particles", "Viz3D.trajectory",
                 "Viz3D.betaPlane", "Viz3D.axesTriad", "Viz3D.tank", "Viz3D.layerStack", "Viz3D.isosurface",
                 "Viz3D.streamtubes", "Viz3D.cutPlane", "Viz3D.lut", "Viz3D.selftestRows", "global.VIZ3D",
                 "webglcontextlost", "webglcontextrestored", "viz3d:ready", "IntersectionObserver", "displace"):
        assert name in js, name
    assert "/* VIZ3D_JS:BEGIN */" in js and "/* VIZ3D_JS:END */" in js


@pytest.mark.skipif(shutil.which("node") is None, reason="node not on PATH")
def test_viz3d_js_and_viz_lib_parse():
    for f in ("assets/viz3d.js", "assets/viz_lib.js"):
        r = subprocess.run(["node", "--check", str(ROOT / f)], capture_output=True, text=True)
        assert r.returncode == 0, r.stderr


def test_viz_lib_keeps_r128_path_and_gains_proj3():
    js = (ROOT / "assets" / "viz_lib.js").read_text(encoding="utf-8")
    assert "three.js/r128/three.min.js" in js and "Viz.three = function" in js      # old chapters keep working
    for name in ("Viz.proj3 = function", "Viz.magnitudeBars = function", "Viz.symbols = function"):
        assert name in js


# ---------- viz_inline ----------
PAGE_3D = """<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="viz:3d" content="1">
<style>/* VIZ_BASE_CSS:BEGIN */ /* VIZ_BASE_CSS:END */</style>
<style>/* VIZ3D_CSS:BEGIN */ /* VIZ3D_CSS:END */</style></head><body>
<script>/* VIZ_LIB_JS:BEGIN */ /* VIZ_LIB_JS:END */</script>
<script>/* VIZ3D_LUTS:BEGIN */ /* VIZ3D_LUTS:END */</script>
<script>/* VIZ3D_JS:BEGIN */ /* VIZ3D_JS:END */</script></body></html>"""


def test_viz_inline_writes_import_map_and_3d_blocks():
    bodies = {k: viz_inline.asset_body(k) for k in (viz_inline.BLOCKS | viz_inline.OPTIONAL)}
    out, missing = viz_inline.inline_text(PAGE_3D, bodies)
    assert not missing
    assert out.count('<script type="importmap"') == 1 and "three@0.186.1" in out
    assert "window.VIZ3D_LUTS = {" in out and "Viz3D.scene = function" in out
    assert "window.VIZ3D_COAST = {" not in out                      # the coast is inlined only when the page asks
    again, _ = viz_inline.inline_text(out, bodies)
    assert again == out                                           # idempotent: one import map, same bytes


def test_viz_inline_requires_3d_blocks_on_3d_pages():
    bodies = {k: viz_inline.asset_body(k) for k in (viz_inline.BLOCKS | viz_inline.OPTIONAL)}
    page = PAGE_3D.replace("/* VIZ3D_JS:BEGIN */ /* VIZ3D_JS:END */", "")
    _, missing = viz_inline.inline_text(page, bodies)
    assert "js3d" in missing


def test_templates_are_inlined_and_current():
    assert viz_inline.main([str(p) for p in sorted((ROOT / "templates").glob("viz*.html"))] + ["--check"]) == 0


# ---------- viz_lint ----------
def _selftest_html() -> str:
    return (ROOT / "templates" / "viz3d_selftest.html").read_text(encoding="utf-8")


def test_lint_selftest_template_clean():
    msgs = viz_lint.lint_text(ROOT / "templates" / "viz3d_selftest.html", _selftest_html())
    assert not [m for m in msgs if not m.startswith("WARN")], msgs


def test_lint_bans_jet_unless_bad_example():
    html = _selftest_html().replace("lut: 'cmocean.balance', range: [-90, 90]", "lut: 'jet', range: [-90, 90]")
    assert any("jet" in m for m in viz_lint.lint_text(ROOT / "templates" / "x.html", html))
    html2 = html.replace('<meta name="viz:3d" content="1">', '<meta name="viz:3d" content="1">\n<meta name="viz:badexample" content="1">')
    assert not any("jet" in m for m in viz_lint.lint_text(ROOT / "templates" / "x.html", html2))


def test_lint_three_version_and_import_map():
    html = _selftest_html().replace("three@0.186.1/build", "three@0.150.0/build")
    assert any("import map pins" in m for m in viz_lint.lint_text(ROOT / "templates" / "x.html", html))
    import re
    html = re.sub(r'<script type="importmap".*?</script>', "", _selftest_html(), flags=re.S)
    assert any("import map" in m for m in viz_lint.lint_text(ROOT / "templates" / "x.html", html))


def test_lint_data_pages_need_a_data_provenance_chip():
    html = _selftest_html().replace('<meta name="viz:3d" content="1">', '<meta name="viz:3d" content="1">\n<meta name="viz:data" content="NCEP1">')
    assert any("provenance chip of kind 'data'" in m for m in viz_lint.lint_text(ROOT / "templates" / "x.html", html))


def test_lint_scene_rules():
    msgs = viz_lint.lint_text(ROOT / "scenes" / "ch00" / "x.html", "<html><head></head><body></body></html>")
    joined = " ".join(msgs)
    for need in ("viz:3d", "scene-caption", "scene-panel", "window.SCENE"):
        assert need in joined, need


# ---------- shot.py flags ----------
def test_shot_cli_has_3d_flags():
    r = subprocess.run([sys.executable, str(ROOT / "tools" / "shot.py"), "--help"], capture_output=True, text=True)
    for flag in ("--3d", "--no-webgl", "--scene", "--contexts", "--page"):
        assert flag in r.stdout, flag
