"""RustGIS adapter (.venv-maps, ``pip install rustgis``; a native Rust engine with a Python Session API).

The prepared RGBA image (same LUT as every tool) is written as a georeferenced GeoTIFF (rasterio) and added as an
RGB raster; prepared contours and overlays are added as GeoJSON line layers. Basemap ``blank`` (the other basemaps can
draw web tiles: never in final frames). Projection via ``map.projection`` (mercator / robinson / globe / EPSG / ESRI);
``camera`` -> ``map.terrain`` (DEM layer, exaggeration) + ``map.setPitch`` / ``map.setBearing``. No ``--yes``-style
network access is used: only local files are added.
"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import _job  # noqa: E402

import numpy as np  # noqa: E402
import rasterio  # noqa: E402
import rustgis  # noqa: E402
from PIL import Image  # noqa: E402
from rasterio.transform import from_bounds  # noqa: E402

PROJ = {"mercator": "mercator", "platecarree": "EPSG:4326", "equirectangular": "EPSG:4326", "latlon": "EPSG:4326",
        "robinson": "robinson", "orthographic": "globe", "ortho": "globe", "globe": "globe",
        "lambert": "EPSG:3034", "lambert_conformal": "EPSG:3034", "lcc": "EPSG:3034",
        "stereographic": "EPSG:3995", "polar": "EPSG:3995"}


def rgba_tif(png: str, bounds, out: Path) -> Path:
    a = np.asarray(Image.open(png).convert("RGBA"))
    h, w = a.shape[:2]
    with rasterio.open(out, "w", driver="GTiff", width=w, height=h, count=4, dtype="uint8", crs="EPSG:4326",
                       transform=from_bounds(*bounds, w, h)) as dst:
        for i in range(4):
            dst.write(a[..., i], i + 1)
    return out


def main():
    job, tool = _job.load()
    work = Path(job["workdir"]) / "rustgis"
    work.mkdir(exist_ok=True)
    W, H = job["size"]
    b = job["bounds"]
    p = _job.proj(job)
    style = job["style"]
    outs, notes = [], []
    for i, (fr, out) in enumerate(zip(job["frames"], job["outputs"])):
        s = rustgis.Session()
        s.set_basemap("blank")
        cam = job.get("camera")
        if cam:                                   # DEM first, so it sits under the coloured image
            try:
                s.add_data(fr["asc"], "dem")
                s.run("map.terrain", layer="dem", exaggeration=float(cam.get("exaggeration", 1)))
                s["dem"].visible = False
            except Exception as e:  # noqa: BLE001
                notes.append(f"terrain: {e}")
        tif = rgba_tif(fr["rgba_png"], b, work / f"rgba_{i:04d}.tif")
        lay = s.add_data(str(tif), "field")
        try:
            s.run("raster.symbology", layer="field", type="rgb")
        except Exception as e:  # noqa: BLE001
            notes.append(f"raster.symbology rgb: {e}")
        if fr.get("contours"):
            s.add_data(fr["contours"], "contours")
            c = style["contours"]
            s.run("layer.lineStrokes", layer="contours",
                  strokes=[{"color": c.get("color", "#222222"), "width": c.get("width", 0.8)}])
        if job.get("overlays"):
            s.add_data(job["overlays"], "overlays")
            s.run("layer.lineStrokes", layer="overlays", strokes=[{"color": "#1a1a1a", "width": 0.6}])
        typ = PROJ.get(p["name"].lower(), "mercator")
        if typ != "mercator":
            prm = {"type": typ}
            if typ == "robinson":
                prm["lon_0"] = p.get("lon0", 0)
            try:
                s.run("map.projection", **prm)
            except Exception as e:  # noqa: BLE001
                notes.append(f"projection {typ}: {e}")
        if job["recipe"].get("region", "global") == "global":
            s.run("map.zoomToExtent", extent=[-180, -85, 180, 85])
        else:
            s.zoom_to((b[0], b[1], b[2], b[3]))
        if cam:
            try:
                s.run("map.setPitch", pitch=float(90 - cam.get("elevation", 35)))
                s.run("map.setBearing", bearing=float((cam.get("azimuth", 180) + 180) % 360))
            except Exception as e:  # noqa: BLE001
                notes.append(f"camera: {e}")
        s.to_png(out, width=W, height=H)
        outs.append(out)
    _job.done(job, tool, f"rustgis {getattr(rustgis, '__version__', None) or _ver()}", outs, notes)


def _ver() -> str:
    try:
        import importlib.metadata as m

        return m.version("rustgis")
    except Exception:  # noqa: BLE001
        return "?"


if __name__ == "__main__":
    main()
