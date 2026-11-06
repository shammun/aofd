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


def test_movie_qa_frozen_gate_counts_only_silence():
    """The frozen gate fails a static stretch only for > 4 s without narration (motion-graphics skill)."""
    import movie_qa

    speech = [(0.3, 5.75), (6.1, 11.2), (20.0, 22.0)]
    assert movie_qa.longest_silence(0.0, 11.0, speech) == pytest.approx(0.35)    # narrated slide: gaps only
    assert movie_qa.longest_silence(11.0, 20.0, speech) == pytest.approx(8.8)    # silent hold: 11.2 → 20.0
    assert movie_qa.longest_silence(21.0, 30.0, speech) == pytest.approx(8.0)    # silence to the end
    assert movie_qa.narration_spans(None) is None


def test_movie_qa_sound_captions_gate():
    """--sound-cues: bracketed sound captions pass only where the sidecar lists them; spoken words stay exact."""
    import movie_qa

    script = "The wave breaks on the shore. Then it washes back."
    cues = [{"start": 0.0, "end": 3.0, "lines": ["The wave breaks on the shore."]},
            {"start": 3.0, "end": 5.0, "lines": ["[waves breaking]"]},
            {"start": 5.0, "end": 7.5, "lines": ["Then it washes back."]}]
    side = [{"start": 3.2, "end": 5.5, "text": "[waves breaking]"}]
    assert movie_qa.captions_gate_with_sounds(cues, script, side, 10.0)[0] == "PASS"
    # a sound caption the sidecar does not list fails
    assert movie_qa.captions_gate_with_sounds(cues, script, [], 10.0)[0] == "FAIL"
    # a listed sound with no caption fails
    assert movie_qa.captions_gate_with_sounds([cues[0], cues[2]], script, side, 10.0)[0] == "FAIL"
    # spoken words are still checked exactly
    bad = [dict(cues[0], lines=["The wave breaks on the beach."]), cues[1], cues[2]]
    assert movie_qa.captions_gate_with_sounds(bad, script, side, 10.0)[0] == "FAIL"
    # words and brackets mixed on one line fail
    mixed = [cues[0], dict(cues[1], lines=["[waves breaking] loudly"]), cues[2]]
    assert movie_qa.captions_gate_with_sounds(mixed, script, side, 10.0)[0] == "FAIL"
    # the default gate (no sidecar) still rejects any bracketed caption: its text differs from the script
    assert movie_qa.norm_words(" ".join(" ".join(c["lines"]) for c in cues)) != movie_qa.norm_words(script)


def test_sound_toolkit_basics():
    """tools/sound: effects are deterministic, finite and peak 0.5; the bed composer honours maths-calm."""
    import numpy as np
    from sound import sfx, styles
    from sound.common import SR, integrated_lufs

    a = sfx.render("splash", 1.5, 0.6, seed=3)
    b = sfx.render("splash", 1.5, 0.6, seed=3)
    assert a.shape == (int(1.5 * SR), 2) and np.array_equal(a, b)
    assert np.all(np.isfinite(a)) and abs(float(np.max(np.abs(a))) - 0.5) < 1e-3
    assert not np.array_equal(a, sfx.render("splash", 1.5, 0.6, seed=4))
    assert set(sfx.CAPTIONS) == set(sfx.EFFECTS)
    assert "maths-calm" in styles.STYLES and len(styles.STYLES) >= 8
    x = np.stack([np.sin(2 * np.pi * 1000 * np.arange(SR * 4) / SR)] * 2, axis=1) * 0.1
    assert integrated_lufs(x) == pytest.approx(-20.0, abs=0.2)   # EBU Tech 3341: stereo 1 kHz sine at −20 dBFS = −20 LUFS


def test_k6_overlap_tuned_rules():
    """tools/k6_overlap.py (UF2 fix 1 tuning): owner / end-label exemptions are INFO, a stroke must cross the middle 60 % of the
    glyph band, stack poly masks and colour-bar clearance fail, links may not cross axes, the cross-fade frames are sampled."""
    sys.path.insert(0, str(ROOT / "tools"))
    import k6_overlap as K

    txt = {"t": "pressure = weight above", "o": 1, "r": [[1100, 200, 1500, 240]]}
    rod = lambda x, w=6, own=None: {"k": "stroke", "c": "#e8833a", "w": w, "o": 1, "pts": [[x, 100], [x, 400]], "closed": False, "g": f"g{x}", "tag": "rod3d", **({"own": own} if own else {})}  # noqa: E731
    # a rod right through the text: FAIL
    f, i = K.check_frame({"boxes": [txt], "shapes": [rod(1300)], "masks": []})
    assert [h["kind"] for h in f] == ["text-shape:text-arrow3d"] and not i
    # the same rod owned by the label: INFO, not FAIL
    f, i = K.check_frame({"boxes": [dict(txt, own="w1")], "shapes": [rod(1300, own="w1")], "masks": []})
    assert not f and len(i) == 1 and "own" in i[0]["why"]
    # a stroke that only clips the top of the glyph box (outside the middle 60 %): ignored
    clip = {"k": "stroke", "c": "#e8833a", "w": 4, "o": 1, "pts": [[1000, 203], [1600, 203]], "closed": False, "g": "h", "tag": "line"}
    assert K.check_frame({"boxes": [txt], "shapes": [clip], "masks": []}) == ([], [])
    # a gold link leaving its own label (never across the glyph band) is no hit; crossing an axis away from its ends: FAIL (link-axis)
    link = {"k": "link", "c": "#d8b23a", "w": 5, "o": 1, "pts": [[1110, 220], [800, 600]], "closed": False, "g": "L", "tag": "path"}
    axis = {"k": "axis", "c": "#9aa6bd", "w": 3, "o": 1, "pts": [[700, 400], [1050, 400]], "closed": False, "g": "A", "tag": "line"}
    f, i = K.check_frame({"boxes": [txt], "shapes": [link, axis], "masks": []})
    assert [h["kind"] for h in f] == ["link-axis"] and not i
    # text inside a stack poly mask fails; a spot label (height) does not; a colour bar on the stack fails
    poly = {"name": "stack", "k": "poly", "o": 1, "pts": [[100, 100], [1000, 100], [1000, 800], [100, 800]]}
    cbar = {"name": "cbar", "k": "cbar", "o": 1, "src": [700, 600, 1200, 700]}
    f, _ = K.check_frame({"boxes": [{"t": "half the vapour", "o": 1, "r": [[300, 300, 600, 340]]}, {"t": "1.5 km", "o": 1, "r": [[300, 400, 420, 440]]}],
                          "shapes": [], "masks": [poly, cbar]})
    assert sorted(h["kind"] for h in f) == ["cbar-picture", "text-picture"]
    # text 8 px above another colour bar fails (clearance 12 px); its own title inside the box does not
    f, _ = K.check_frame({"boxes": [{"t": "where data are sparse", "o": 1, "r": [[1100, 552, 1500, 592]]}, {"t": "2-m temperature", "o": 1, "r": [[1120, 610, 1400, 640]], "own": "cbar:cbar"}],
                          "shapes": [], "masks": [cbar]})
    assert [h["kind"] for h in f] == ["text-cbar"]
    # two labels 2 px apart vertically ("touching") fail as text-text
    f, _ = K.check_frame({"boxes": [{"t": "height (km)", "o": 1, "r": [[214, 33, 488, 77]]}, {"t": "137 hPa · 14 %", "o": 1, "r": [[316, 79, 686, 124]]}], "shapes": [], "masks": []})
    assert [h["kind"] for h in f] == ["text-text"]
    # the frame list samples every scene boundary at −5, 0, +5
    tm = ROOT / "movies/ch00/ch00_weather_basics/timing.json"
    if tm.exists():
        fr = set(K.k6_frames(tm))
        b = round(json.loads(tm.read_text(encoding="utf-8"))["scenes"][5]["start"] * 30)
        assert {b - 5, b, b + 5} <= fr


def test_movie_symbol_lint_rules(tmp_path):
    """tools/movie_symbol_lint.py (Part 1 lessons C1, C2, C4): maths in plain-text labels, small fractions, single-backslash
    TeX in regex literals; comments, TeX props, timing phrases, CHECK tables and SI unit exponents are not flagged."""
    import movie_symbol_lint as M

    def rules(src: str, strict: bool = False) -> list[str]:
        return sorted(f.rule for f in M.lint_source(src, "t.tsx", strict=strict) if not f.ok)

    # C1: plain-text labels (props, keyword text, JSX children, drawn const arrays)
    assert rules('const A = () => <Svg><Lbl x={1} y={2} t="u_θ = 38.0" /></Svg>;') == ["C1-greek", "C1-script"]
    assert rules('const A = () => <Keyword f={f} text="without the θ̂ formula" at={[1, 2]} appear={0} />;') == ["C1-combining", "C1-greek"]
    assert rules("const A = () => <svg><text x={1}>x′ axis</text></svg>;") == ["C1-prime"]
    assert rules('const A = () => <Lbl t="v² is speed squared" />;') == ["C1-unicode-script"]
    assert rules('const A = () => <Lbl t="f ≈ 10⁻⁴ s⁻¹" />;') == ["C1-unicode-script"]
    assert rules('const A = () => <Lbl t={c ? "r̂ out" : "fine"} />;') == ["C1-combining"]
    assert rules('const txt: [number, string][] = [[1, "v′ = v − U"]];\nconst A = () => <g>{txt.map(([j, a]) => <Lbl t={a} />)}</g>;') == ["C1-prime"]
    # not flagged: English apostrophes, SI unit exponents, arc minutes, comments, TeX props, timing phrases, ids, CHECK tables
    assert rules('const A = () => <Lbl t="Earth\'s spin: 9.8 m/s², 513 km², 1′ × 60, 26°30′" />;') == []
    assert rules('// Lbl t="u_r"\nconst A = () => <g>{/* θ̂ and x′ */}<TeX s={String.raw`\\hat{\\boldsymbol\\theta}_r\'`} x={1} y={2} /></g>;') == []
    assert rules('const A = () => <Lbl t="x" o={fin(f, AT(k, 3, "u_r is"))} />; const k = K("s08_r_hat");') == []
    assert rules('const CHECK_A: [string, number][] = [["u_r x", 1]];\nCHECK_A.forEach(([n, v]) => n);') == []
    assert rules('const A = () => <CalcStack rows={[{ lhs: "u_\\\\theta", rhs: "=-(-10.1)(0.707)", at: 3 }]} />;') == []
    # C2: \tfrac always; \frac only where KaTeX draws it small (the house TeX is \displaystyle), every \frac with --strict
    assert rules('const A = () => <TeX s={String.raw`\\tfrac34`} />;') == ["C2-frac"]
    assert rules('const A = () => <TeX s={String.raw`x=\\frac{3}{5}`} />;') == []
    assert rules('const A = () => <TeX s={String.raw`x=\\frac{3}{5}`} />;', strict=True) == ["C2-frac"]
    assert rules('const A = () => <TeX s={String.raw`e^{\\frac12}+\\dfrac{\\frac{a}{b}}{c}`} />;') == ["C2-frac", "C2-frac"]
    assert rules('const A = () => <TeX s={String.raw`\\begin{pmatrix}\\frac12\\end{pmatrix}+\\dfrac{1}{2}`} />;') == ["C2-frac"]
    assert rules('const A = () => <Lbl t={"half: $\\\\frac12$"} />;') == ["C2-frac"]        # $…$ label maths is \textstyle
    assert rules('const A = () => <Lbl t="half: $\\frac12$, u_r" />;') == ["C1-script", "C2-frac"]   # JSX strings have no escapes
    # C4: TeX commands in regex literals and RegExp sources need a doubled backslash
    assert rules("const FRAC = /\\frac/; const B = /\\mathbf/;") == ["C4-regex", "C4-regex"]
    assert rules("const FRAC = /\\\\d?frac/; const W = /\\bfoo\\s+\\d/; const R = new RegExp(\"\\\\\\\\frac\");") == []
    assert rules('const R = new RegExp("\\\\frac");') == ["C4-regex"]
    # explicit exemption with a reason, and the CLI exit codes
    assert rules('const A = () => <Lbl t="x′" />; // lint-ok: axis name drawn as on the ruler') == []
    bad = tmp_path / "bad.tsx"
    bad.write_text('export const A = () => <Lbl t="u_r = −13" />;\n', encoding="utf-8")
    good = tmp_path / "good.tsx"
    good.write_text("export const A = () => <TeX s={String.raw`u_r=-13`} />;\n", encoding="utf-8")
    assert M.main([str(bad)]) == 1 and M.main([str(good)]) == 0


@pytest.mark.parametrize("part", ["sphere", "frames", "moving", "routes", "maps"])
def test_movie_symbol_lint_coordinates_parts_clean(part):
    """Coordinates Parts 3-7 carry the Part 1 lessons C1/C2/C4: their sources lint clean, --strict included (every \\dfrac)."""
    import movie_symbol_lint as M

    d = ROOT / "movies" / "src" / f"ch00_coordinates_{part}"
    if not d.exists():
        pytest.skip(f"{d} missing")
    bad = [f for f in M.lint_paths([d], strict=True) if not f.ok]
    assert not bad, "\n".join(f"{f.file}:{f.line}: {f.rule}: {f.detail}" for f in bad)
