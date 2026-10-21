"""Checks for the reproduced Chapter 21 data figures (figure-reproducer functions, merged by the orchestrator)."""
from __future__ import annotations


def test_fig_21_23():
    """Fig. 21.23 analogue: Orsi fronts S of Africa, ACC through Drake Passage, Agulhas retroflection, orientation."""
    import importlib.util
    from pathlib import Path

    import cartopy.crs as ccrs
    import numpy as np

    repo = Path(__file__).resolve().parents[1]
    spec = importlib.util.spec_from_file_location("fig_21_23", repo / "figs" / "ch21" / "fig_21_23.py")
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    fr, gdp = m.load_fronts(), m.load_gdp()
    # PF ~50S, SAF ~46-48S south of Africa (Lutjeharms & Valentine 1984; Belkin & Gordon 1996 — to be re-verified)
    pf, saf, stf = (m.front_lat_at(fr, n, 20.0) for n in ("pf", "saf", "stf"))
    assert len(pf) == 1 and -52.0 < pf[0] < -48.0
    assert len(saf) == 1 and -49.0 < saf[0] < -44.0
    assert stf[0] > saf[0] > pf[0]                                    # N->S order: latitude not flipped
    assert m.box_mean(gdp, "U", (-66, -64), (-60, -55)) > 0.1        # ACC eastward through Drake Passage
    assert m.box_mean(gdp, "U", (25, 35), (-36, -31)) < 0 and m.box_mean(gdp, "V", (25, 35), (-36, -31)) < 0
    ret = m.agulhas_retroflection(gdp)                                # Lutjeharms & van Ballegooyen 1988: 16-20E
    assert 15.0 <= ret["tip_lon"] <= 21.0 and ret["return_u"] > 0.3
    lat = gdp["lat"].values
    assert np.all(np.diff(lat) > 0) and lat.max() < -30
    p, pc = ccrs.SouthPolarStereo(), ccrs.PlateCarree()
    x0, y0 = p.transform_point(0, -60, pc)
    x90, y90 = p.transform_point(90, -60, pc)
    assert y0 > 0 and abs(x0) < 1 and x90 > 0 and abs(y90) < 1      # 0 deg up, 90E right
    png = repo / "outputs" / "ch21" / "fig_21_23.png"
    if png.exists():
        from PIL import Image

        info = Image.open(png).info
        assert "CURR-gdp-annual" in info["dataset_keys"] and info["synthetic"] == "false"
        assert png.stat().st_size < 3e6
