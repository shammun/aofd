"""Map-toolkit tests (series_plan "Map toolkit set-up").

Fast part (always): recipe parsing, colour-map ban, prepared grids for one recipe.
Slow part (marker ``maptools``; several minutes, needs the map environments): runs ``tools/maptools/selftest.py``.
Run it with ``AOFD_MAPTOOLS=1 .venv/Scripts/python.exe -m pytest -q -m maptools tests/test_maptools.py``.
"""
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools" / "maptools"))


def test_banned_colour_maps_refused():
    import prep

    for bad in ("jet", "rainbow", "gist_ncar", "hsv"):
        with pytest.raises(ValueError):
            prep.lut(bad)
    assert len(prep.lut("cmocean.balance")) == 256


def test_recipes_parse_and_name_known_tools():
    from common import TOOLS
    from render import load_recipe

    for p in sorted((ROOT / "tools" / "maptools" / "recipes").glob("*.yaml")):
        r = load_recipe(p)
        tools = r["tool"] if isinstance(r["tool"], list) else [r["tool"]]
        assert all(t in TOOLS for t in tools), p.name
        assert r.get("kind", "png") in ("png", "png_sequence", "texture", "heightmap", "timelapse", "before_after",
                                        "timeseries"), p.name
        for lay in r.get("layers") or []:
            assert lay["type"] in ("points", "extrema", "vectors", "fronts"), p.name


def test_symbol_layers_prepared_for_synoptic_chart(tmp_path):
    """recipe layers -> prepared files: H/L found in the field, fronts oriented, wind in knots, story place promoted."""
    import json

    import xarray as xr

    import prep
    from render import load_recipe

    r = load_recipe(ROOT / "tools" / "maptools" / "recipes" / "ciaran_synoptic.yaml")
    job = prep.prepare(r, tmp_path / "work")
    lay = {x["type"]: x for x in job["layers"]}
    assert set(lay) == {"points", "extrema", "vectors", "fronts"}
    ex = json.loads(Path(lay["extrema"]["files"][0]).read_text())["features"]
    low = min((f for f in ex if f["properties"]["kind"] == "low"), key=lambda f: f["properties"]["value"])
    assert low["properties"]["value"] == pytest.approx(956.0, abs=1.0)          # Ciaran's centre, ERA5 0.5 deg
    assert low["geometry"]["coordinates"][0] == pytest.approx(1.5, abs=1.0)
    assert low["geometry"]["coordinates"][1] == pytest.approx(52.5, abs=1.0)
    fr = {f["properties"]["kind"]: f["properties"]["warm_left"]
          for f in json.loads(Path(lay["fronts"]["file"]).read_text())["features"]}
    # both fronts are drawn westward; the warm sector lies to the south = on the left of the drawing direction
    assert fr == {"cold": True, "warm": True}
    g = xr.open_dataset(lay["vectors"]["files"][0])
    assert set(g.data_vars) == {"u", "v"}
    assert 40 < float(abs(g.u).max()) < 160                 # knots (ERA5 10-m wind x 1.94384)
    pts = json.loads(Path(lay["points"]["file"]).read_text())["features"]
    assert pts[0]["properties"]["name"] == "Brest" and pts[0]["properties"]["promoted"]
    assert {f["properties"]["name"] for f in pts} <= {"London", "Paris", "Madrid", "Lisbon", "Dublin", "Amsterdam",
                                                     "Brest", "Oslo", "Edinburgh"}
    assert any(d.get("role") == "fronts" and "CC-BY" in d["licence"] for d in job["provenance"])


def test_deckgl_ready_check_waits_for_decoded_images_and_stable_frames():
    import importlib.util

    spec = importlib.util.spec_from_file_location("web_adapter", ROOT / "tools" / "maptools" / "adapters" / "web.py")
    web = importlib.util.module_from_spec(spec)
    sys.path.insert(0, str(ROOT / "tools" / "maptools" / "adapters"))
    spec.loader.exec_module(web)
    page = web.DECKGL
    assert "createImageBitmap" in page and "await Promise.all" in page       # images decoded before deck.gl
    assert "STABLE = 30" in page and "getSubLayers().length > 0" in page     # loaded + 30 unchanged frames
    assert "image: J.rgba" not in page                                       # no URL image props left


@pytest.mark.maptools
@pytest.mark.skipif(os.environ.get("AOFD_MAPTOOLS") != "1", reason="slow: set AOFD_MAPTOOLS=1")
def test_selftest_all_adapters():
    r = subprocess.run([sys.executable, str(ROOT / "tools" / "maptools" / "selftest.py")], capture_output=True,
                       text=True, timeout=1800)
    print(r.stdout)
    assert r.returncode == 0, r.stdout[-3000:] + r.stderr[-2000:]


# ------------------------------------------------------------------------------------------------------------------
# cartostyle (house cartography helper): fast, offline, synthetic data only
# ------------------------------------------------------------------------------------------------------------------

def _cs():
    import matplotlib

    matplotlib.use("Agg")
    import cartostyle

    return cartostyle


def _synthetic_low(lon0=-10.0, lat0=52.0, depth=45.0):
    """MSLP-like field (hPa) on a 0.5-deg grid: a 1013 hPa background with a Gaussian low."""
    import numpy as np

    lon = np.arange(-60.0, 40.01, 0.5)
    lat = np.arange(20.0, 80.01, 0.5)
    lo, la = np.meshgrid(lon, lat)
    p = 1013.0 - depth * np.exp(-(((lo - lon0) * np.cos(np.radians(la))) ** 2 + (la - lat0) ** 2) / (2 * 6.0 ** 2))
    return lon, lat, p


def test_cartostyle_presets_respect_house_floor():
    cs = _cs()
    st = cs.style("movie")
    assert st.size_px == (1920, 1080) and st.type_floor_px == 44
    assert min(st.type_px.values()) >= 44                      # HOUSE_STYLE.md section 5: nothing below 44 px
    assert st.caption_band == (880, 1040)
    assert abs(st.px(100) - 72.0) < 1e-9                       # 100 px at dpi 100 = 72 pt
    pr = cs.style("print")
    assert min(pr.type_px.values()) >= pr.type_floor_px - 1e-9
    with pytest.raises(ValueError):
        cs.style("poster")


def test_cartostyle_projection_chooser():
    cs = _cs()
    assert cs.choose_projection("global").name == "equal_earth"
    c = cs.choose_projection((-35, 20, 33, 66))
    assert c.name == "lambert_conformal"
    assert c.params["parallels"] == pytest.approx((38.5, 60.5))     # 1/6 and 5/6 of the latitude range
    assert cs.choose_projection((-35, 20, 33, 66), "equal_area").name == "albers"
    assert cs.choose_projection((-180, 180, 60, 90)).name == "polar_stereographic"
    assert cs.choose_projection((-180, 180, -90, -60), "equal_area").name == "laea"
    assert cs.choose_projection((40, 100, -10, 20)).name == "mercator"
    assert cs.choose_projection((-170, -10, 10, 75)).name == "laea"         # wider than 100 deg
    assert cs.choose_projection((0, 10, 40, 50), "globe").name == "orthographic"
    for b in ["global", (-35, 20, 33, 66), (40, 100, -10, 20), (-180, 180, 60, 90)]:
        cs.choose_projection(b).crs()                                        # every choice builds a CRS


def test_cartostyle_natural_earth_scale_and_scale_factor():
    cs = _cs()
    assert cs.natural_earth_scale((-5, 5, 45, 50)) == "10m"
    assert cs.natural_earth_scale((-35, 20, 33, 66)) == "50m"
    assert cs.natural_earth_scale("global") == "110m"
    lcc = cs.choose_projection((-35, 20, 33, 66)).crs()
    kmin, kmax = cs.scale_factor_range(lcc, (-35, 20, 33, 66))
    assert kmax / kmin - 1 < 0.06                     # a regional LCC map: scale bar allowed
    ee = cs.choose_projection("global").crs()
    kmin, kmax = cs.scale_factor_range(ee, (-179, 179, -80, 80))
    assert kmax / kmin - 1 > 0.5                      # a world map: a scale bar would mislead


def test_cartostyle_bans_rainbow_and_centres_diverging():
    cs = _cs()
    for bad in ("jet", "rainbow", "turbo", "hsv", "gist_ncar", "nipy_spectral", "Spectral"):
        with pytest.raises(ValueError):
            cs.check_cmap(bad)
    assert cs.cmap("anomaly").N >= 256
    assert cs.cmap("pressure", cs.style("movie")).name.startswith("ice")      # dark page: bright = low
    lo, hi = cs.centered_limits([-3.0, 1.0, 2.0, 0.5], center=0.0, q=1.0)
    assert lo == -hi == -3.0


def test_cartostyle_barb_length_calibration():
    cs = _cs()
    st = cs.style("movie")
    assert cs.barb_length(st, 39.0) == pytest.approx(7.0, rel=0.02)          # measured: length 7 -> 39 px


def test_cartostyle_find_extrema_on_synthetic_low():
    cs = _cs()
    lon, lat, p = _synthetic_low(-10.0, 52.0, 45.0)
    ex = cs.find_extrema(lon, lat, p, window_deg=10, min_prominence=4)
    lows = [e for e in ex if e["kind"] == "low"]
    assert len(lows) == 1
    assert lows[0]["lon"] == pytest.approx(-10.0) and lows[0]["lat"] == pytest.approx(52.0)
    assert lows[0]["value"] == pytest.approx(968.0, abs=0.01)


def test_cartostyle_labels_do_not_collide_and_respect_priority():
    cs = _cs()
    import cartopy.crs as ccrs
    import matplotlib.pyplot as plt

    st = cs.style("movie")
    fig, ax, _ = cs.new_map((-35.0, 20.0, 33.0, 66.0), st, fit="content")
    lon, lat, p = _synthetic_low(-10.0, 52.0, 45.0)
    iso = ax.contour(lon, lat, p, levels=range(960, 1016, 4), colors="w", transform=ccrs.PlateCarree())
    rep_hl = cs.mark_extrema(ax, [{"kind": "low", "lon": -10.0, "lat": 52.0, "value": 968.0}], st)
    assert [x[0] for x in rep_hl.placed] == ["L"]
    rep_iso = cs.isobar_labels(ax, iso, st, obstacles=rep_hl.boxes)
    assert 1 <= len(rep_iso.placed) <= 10                 # the movie budget
    places = [cs.Place(n, lo, la, rank=r) for n, lo, la, r in [
        ("Alpha", -10.0, 52.0, 0),          # under the L: must be dropped, not forced
        ("Bravo", 0.0, 45.0, 1), ("Charlie", 10.0, 55.0, 2), ("Delta", 0.3, 45.2, 3),   # Delta crowds Bravo
        ("Echo", -25.0, 40.0, 4)]]
    rep = cs.label_points(ax, places, st, obstacles=rep_hl.boxes)     # names may sit on lines (halo), not on letters
    placed = [x[0] for x in rep.placed]
    dropped = dict(rep.dropped)
    assert "Alpha" in dropped and "Alpha" not in placed
    assert "Bravo" in placed and "Delta" not in placed      # the higher-priority one of a crowded pair wins
    boxes = [x[2] for x in rep.placed]
    for i in range(len(boxes)):
        for j in range(i + 1, len(boxes)):
            assert not cs._overlap(boxes[i], boxes[j])
    for b in boxes:                                         # no name on the L or its value
        assert not any(cs._overlap(b, o) for o in rep_hl.boxes)
    # names were placed without the isobar-number obstacles here, so only size/frame/band problems are checked
    assert not [q for q in cs.audit(fig, st) if "px <" in q or "caption band" in q or "leaves" in q]
    plt.close(fig)


def test_cartostyle_audit_flags_small_text_and_overlap():
    cs = _cs()
    import matplotlib.pyplot as plt

    st = cs.style("movie")
    fig, ax, _ = cs.new_map((-35.0, 20.0, 33.0, 66.0), st)
    fig.text(0.5, 0.5, "tiny", fontsize=st.px(20))
    fig.text(0.5, 0.5, "same place", fontsize=st.px(50))
    fig.text(0.5, 0.05, "in the caption band", fontsize=st.px(50))
    probs = " | ".join(cs.audit(fig, st))
    assert "tiny" in probs and "overlap" in probs and "caption band" in probs
    plt.close(fig)


def test_cartostyle_front_orientation_follows_temperature():
    cs = _cs()
    import matplotlib.pyplot as plt
    import numpy as np

    st = cs.style("notebook")
    fig, ax, _ = cs.new_map((-20.0, 20.0, 40.0, 60.0), st)
    lon = np.arange(-30.0, 30.01, 0.5)
    lat = np.arange(30.0, 70.01, 0.5)
    T = np.tile(np.where(lon < 0, 285.0, 275.0), (lat.size, 1))     # warm west, cold east of 0 deg
    front = np.array([[0.0, 42.0], [0.0, 58.0]])                       # drawn northwards along 0 deg
    # walking north on screen, "left" is west = the warm side:
    # cold-front triangles point into the warm air (left: no flip), warm-front scallops into the cold air (flip)
    assert cs.front_flip(ax, front, "cold", (lon, lat, T)) is False
    assert cs.front_flip(ax, front, "warm", (lon, lat, T)) is True
    used, boxes = cs.draw_fronts(ax, [("cold", front)], st, temperature=(lon, lat, T))
    assert used == [("cold", False)] and len(boxes) > 5
    plt.close(fig)


def test_cartostyle_scale_bar_refused_on_world_map():
    cs = _cs()
    import matplotlib.pyplot as plt

    st = cs.style("movie")
    fig, ax, _ = cs.new_map((-179.9, 179.9, -85, 85), st)
    assert cs.scale_bar(ax, st, (-179.9, 179.9, -85, 85)) is None
    plt.close(fig)
    fig, ax, _ = cs.new_map((-35.0, 20.0, 33.0, 66.0), st)
    sb = cs.scale_bar(ax, st, (-35.0, 20.0, 33.0, 66.0))
    assert sb is not None and sb["length_km"] in (500, 1000, 2000, 2500, 5000)
    plt.close(fig)
