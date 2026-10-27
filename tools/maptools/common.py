"""Shared paths, environment table, hashing and provenance helpers for the map toolkit.

Imported by ``render.py`` / ``compare.py`` / ``selftest.py`` (run in the project ``.venv``). Adapters run in their own
environments and import nothing from here except :mod:`adapters._job` (pure stdlib), so they stay portable.
"""
from __future__ import annotations

import hashlib
import json
import os
import shutil
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
TOOLDIR = Path(__file__).resolve().parent
ADAPTERS = TOOLDIR / "adapters"
DATA = Path(os.environ.get("AOFD_DATA_ROOT", "G:/Geophysical Fluid Dynamics/aofd-data"))
OUT = REPO / "outputs" / "maptools"
SCRATCH = DATA / "scratch" / "maptools_runs"       # per-run work dirs (prepared grids); NOT the research trial dir
GB = 1024 ** 3

QGIS_ROOT = next(iter(sorted(Path("C:/Program Files").glob("QGIS*"), reverse=True)), None)
ARCGIS_PRO = Path("C:/Program Files/ArcGIS/Pro")

# environment name -> launcher (a list; .bat launchers work through subprocess with a list argv)
ENVS: dict[str, list[str]] = {
    "venv": [str(REPO / ".venv" / "Scripts" / "python.exe")],
    "maps": [str(REPO / ".venv-maps" / "Scripts" / "python.exe")],
    "gmt": [str(DATA / "envs" / "gmt" / "python.exe")],
    "qgis": [str(QGIS_ROOT / "bin" / "python-qgis.bat")] if QGIS_ROOT else [],
    "arcgis": [str(ARCGIS_PRO / "bin" / "Python" / "Scripts" / "propy.bat")],
}

_GMT = DATA / "envs" / "gmt"


def env_vars(env: str) -> dict:
    """Extra environment for a launcher (a conda env run without activation needs its DLL/bin dirs on PATH)."""
    e = dict(os.environ)
    if env == "gmt":
        e["PATH"] = os.pathsep.join([str(_GMT), str(_GMT / "Library" / "bin"), str(_GMT / "Library" / "usr" / "bin"),
                                     str(_GMT / "Scripts"), e.get("PATH", "")])
        e["GMT_USERDIR"] = str(DATA / "cache" / "gmt_user")      # GMT cache on G:, never ~/.gmt
        e["PROJ_DATA"] = str(_GMT / "Library" / "share" / "proj")
        e["GDAL_DATA"] = str(_GMT / "Library" / "share" / "gdal")
    if env in ("maps", "venv"):
        e["PYVISTA_OFF_SCREEN"] = "true"
        e["GEOVISTA_CACHEDIR"] = str(DATA / "cache" / "geovista")       # never %LOCALAPPDATA% on C:
    if env == "maps":                                 # geemap/leafmap/ee temp files and caches on G:, never C:
        tmp = DATA / "scratch" / "tmp_maps"
        tmp.mkdir(parents=True, exist_ok=True)
        e["TEMP"] = e["TMP"] = e["TMPDIR"] = str(tmp)
        e["GEEMAP_CACHE"] = str(DATA / "cache" / "geemap")
        e["LEAFMAP_CACHE"] = str(DATA / "cache" / "leafmap")
        e["XDG_CACHE_HOME"] = str(DATA / "cache" / "xdg")
        e["MPLCONFIGDIR"] = str(DATA / "cache" / "mpl_maps")
    return e


# tool -> (environment, adapter module file, what it is for)
TOOLS: dict[str, tuple[str, str, str]] = {
    "mpl":      ("venv",   "mpl_cartopy.py",  "matplotlib + cartopy 2-D maps, textures, heightmaps (project .venv)"),
    "pygmt":    ("gmt",    "pygmt_adapter.py", "GMT relief, hillshade, grdview 3-D perspective (micromamba env on G:)"),
    "geovista": ("maps",   "geovista_adapter.py", "pyvista/VTK offscreen 3-D globe"),
    "maplibre": ("venv",   "web.py",          "MapLibre GL JS in headless Chromium (local data only)"),
    "deckgl":   ("venv",   "web.py",          "deck.gl in headless Chromium: terrain mesh, globe view"),
    "cesium":   ("venv",   "web.py",          "CesiumJS without Ion: local single-tile imagery + custom heightmap terrain"),
    "leafmap":  ("maps",   "leafmap_adapter.py", "leafmap (folium backend) -> HTML -> headless screenshot"),
    "qgis":     ("qgis",   "qgis_adapter.py", "PyQGIS headless map/print layout; qgis_process prep"),
    "arcgis":   ("arcgis", "arcgis_adapter.py", "arcpy (ArcGIS Pro): layouts, Spatial/Image Analyst prep"),
    "gee":      ("maps",   "gee_adapter.py",  "Google Earth Engine: png, timelapse, before/after, time series (user auth)"),
    "gibs":     ("maps",   "gibs_adapter.py", "NASA GIBS WMS imagery: png, timelapse, before/after (no key)"),
    "stac":     ("maps",   "stac_adapter.py", "STAC/COG (Earth Search Sentinel-2/Landsat): png, timelapse, before/after"),
    "rustgis":  ("maps",   "rustgis_adapter.py", "RustGIS Python session -> PNG"),
}

LICENCE_FALLBACK = {
    "ETOPO": ("public domain (NOAA NCEI)", "ETOPO 2022 15/30/60 arc-second global relief, NOAA NCEI, doi:10.25921/fd45-gt74"),
    "ne_": ("public domain", "Made with Natural Earth"),
    "ciaran_": ("public domain", "Made with Natural Earth"),
    "gibs": ("NASA open data (no restrictions)", "Imagery: NASA Worldview / GIBS"),
}


def sha256_file(p: Path, chunk: int = 1 << 20) -> str:
    h = hashlib.sha256()
    with open(p, "rb") as fh:
        for b in iter(lambda: fh.read(chunk), b""):
            h.update(b)
    return h.hexdigest()


def sha256_text(s: str) -> str:
    return hashlib.sha256(s.encode("utf-8")).hexdigest()


def pixel_stats(png: Path) -> dict:
    """Decoded-pixel hash and simple statistics (the determinism and self-test currency)."""
    import numpy as np
    from PIL import Image

    im = Image.open(png).convert("RGBA")
    a = np.asarray(im)
    rgb = a[..., :3].astype(np.float64)
    return {
        "size": list(im.size),
        "pixel_sha256": hashlib.sha256(a.tobytes()).hexdigest(),
        "mean_rgb": [round(float(x), 3) for x in rgb.reshape(-1, 3).mean(0)],
        "std": round(float(rgb.std()), 3),
        "nonwhite": round(float((rgb.sum(-1) < 750).mean()), 5),
    }


def pixel_diff(a: Path, b: Path) -> dict:
    """Mean and 99.9th-percentile absolute difference (0-255 scale) between two PNGs of equal size."""
    import numpy as np
    from PIL import Image

    x = np.asarray(Image.open(a).convert("RGB"), dtype=np.int16)
    y = np.asarray(Image.open(b).convert("RGB"), dtype=np.int16)
    if x.shape != y.shape:
        return {"same_size": False}
    d = np.abs(x - y)
    return {"same_size": True, "mean_abs": round(float(d.mean()), 4), "p999": float(np.percentile(d, 99.9)),
            "max": int(d.max()), "frac_changed": round(float((d.max(-1) > 0).mean()), 6)}


def disk() -> dict:
    return {"C_free_gb": round(shutil.disk_usage("C:/").free / GB, 1),
            "G_free_gb": round(shutil.disk_usage("G:/").free / GB, 1) if Path("G:/").exists() else None}


def write_json(p: Path, obj) -> None:
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(obj, indent=1, default=str), encoding="utf-8")
