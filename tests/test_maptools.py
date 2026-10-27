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


@pytest.mark.maptools
@pytest.mark.skipif(os.environ.get("AOFD_MAPTOOLS") != "1", reason="slow: set AOFD_MAPTOOLS=1")
def test_selftest_all_adapters():
    r = subprocess.run([sys.executable, str(ROOT / "tools" / "maptools" / "selftest.py")], capture_output=True,
                       text=True, timeout=1800)
    print(r.stdout)
    assert r.returncode == 0, r.stdout[-3000:] + r.stderr[-2000:]
