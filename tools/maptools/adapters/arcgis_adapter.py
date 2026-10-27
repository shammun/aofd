"""ArcGIS Pro adapter: arcpy through the user's own install (``propy.bat`` -> ``arcgispro-py3``; nothing installed).

* Project: ``Blank.aprx`` shipped with Pro is copied once to ``<data root>/scratch/arcgis/aofd_blank.aprx``; each
  render saves a copy per job in the job work dir, creates a map (no basemap: any basemap layer the user's defaults
  add is removed and flagged) and a layout of exactly ``size`` pixels at 96 dpi, then ``exportToPNG``.
* Layers are ONLY our own open data: the coloured field (prepared RGBA -> 3-band GeoTIFF via NumPyArrayToRaster +
  CompositeBands, so colours equal every other tool), contours and overlays from the prepared GeoJSON
  (``JSONToFeatures``). Esri basemaps / Living Atlas layers are never added: their terms may not allow
  redistribution in a public video or repo. The sidecar ``licence_flags`` says so.
* Data prep where arcpy is strong (needs Spatial Analyst): ``style.contours.engine: arcgis`` -> ``arcpy.sa.Contour``;
  ``style.hillshade: arcgis`` -> ``arcpy.sa.Hillshade`` (multiply-blended at ``shade_alpha``). Multidimensional
  rasters (``arcpy.md``) are documented in the skill for prep scripts.
* ``python arcgis_adapter.py --licence`` prints product, licence type and every extension's CheckExtension state.
"""
from __future__ import annotations

import json
import shutil
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import _job  # noqa: E402

EXTS = ["Spatial", "ImageAnalyst", "3D", "Network", "GeoStats", "DataReviewer", "Publisher", "Foundation",
        "Aeronautical", "Bathymetry", "Defense", "Highways", "LocationReferencing", "Tracking"]
BLANK = Path(r"C:\Program Files\ArcGIS\Pro\Resources\ArcToolBox\Services\routingservices\data\Blank.aprx")


def licence_report() -> dict:
    import arcpy

    info = arcpy.GetInstallInfo()
    return {"product": arcpy.ProductInfo(), "version": info.get("Version"), "licence_type": info.get("LicenseType"),
            "extensions": {e: arcpy.CheckExtension(e) for e in EXTS}}


def wkt_for(p: dict) -> str | int:
    n = p["name"].lower()
    lon0, lat0 = p.get("lon0", 0), p.get("lat0", 0)
    g = ('GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],'
         'PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]]')
    if n in ("platecarree", "equirectangular", "latlon"):
        return 4326
    if n == "mercator":
        return 3857
    if n == "robinson":
        return (f'PROJCS["Robinson",{g},PROJECTION["Robinson"],PARAMETER["False_Easting",0.0],'
                f'PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",{lon0}],UNIT["Meter",1.0]]')
    if n in ("orthographic", "ortho", "globe"):
        return (f'PROJCS["Ortho",{g},PROJECTION["Orthographic"],PARAMETER["False_Easting",0.0],'
                f'PARAMETER["False_Northing",0.0],PARAMETER["Longitude_Of_Center",{lon0}],'
                f'PARAMETER["Latitude_Of_Center",{lat0}],UNIT["Meter",1.0]]')
    if n in ("lambert", "lambert_conformal", "lcc"):
        return (f'PROJCS["LCC",{g},PROJECTION["Lambert_Conformal_Conic"],PARAMETER["False_Easting",0.0],'
                f'PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",{lon0}],'
                f'PARAMETER["Standard_Parallel_1",{lat0 - 10}],PARAMETER["Standard_Parallel_2",{lat0 + 10}],'
                f'PARAMETER["Latitude_Of_Origin",{lat0}],UNIT["Meter",1.0]]')
    if n in ("stereographic", "polar"):
        return 3995 if lat0 >= 0 else 3031
    return 4326


def rgb_tif(arcpy, png: str, bounds, gdb: str, name: str) -> str:
    import numpy as np
    from PIL import Image

    a = np.asarray(Image.open(png).convert("RGB"))
    h, w = a.shape[:2]
    cw, ch = (bounds[2] - bounds[0]) / w, (bounds[3] - bounds[1]) / h
    ll = arcpy.Point(bounds[0], bounds[1])
    bands = []
    for i in range(3):
        r = arcpy.NumPyArrayToRaster(np.ascontiguousarray(a[..., i]), ll, cw, ch)
        p = f"{gdb}\\{name}_b{i}"
        r.save(p)
        arcpy.management.DefineProjection(p, arcpy.SpatialReference(4326))
        bands.append(p)
    out = f"{gdb}\\{name}_rgb"
    arcpy.management.CompositeBands(";".join(bands), out)
    arcpy.management.DefineProjection(out, arcpy.SpatialReference(4326))
    return out


def main():
    if len(sys.argv) > 1 and sys.argv[1] == "--licence":
        print(json.dumps(licence_report(), indent=1))
        return
    job, tool = _job.load()
    import arcpy

    arcpy.env.overwriteOutput = True
    data_root = Path(job["workdir"]).parents[1]               # <data root>/scratch
    tpl_dir = data_root / "arcgis"
    tpl_dir.mkdir(parents=True, exist_ok=True)
    tpl = tpl_dir / "aofd_blank.aprx"
    if not tpl.exists():
        shutil.copyfile(BLANK, tpl)
    work = Path(job["workdir"]) / "arcgis"
    work.mkdir(exist_ok=True)
    gdb = str(work / "scratch.gdb")
    if not arcpy.Exists(gdb):
        arcpy.management.CreateFileGDB(str(work), "scratch.gdb")
    W, H = job["size"]
    p = _job.proj(job)
    st = job["style"]
    b = job["bounds"]
    outs, notes = [], []
    flags = ["Only aofd open data layers used; no Esri basemap or Living Atlas content (their terms may not allow "
             "redistribution in public videos/repos)."]
    lic = licence_report()
    sa_ok = lic["extensions"].get("Spatial") == "Available"
    for i, (fr, out) in enumerate(zip(job["frames"], job["outputs"])):
        aprx_path = work / f"job_{i:04d}.aprx"
        shutil.copyfile(tpl, aprx_path)
        aprx = arcpy.mp.ArcGISProject(str(aprx_path))
        m = aprx.createMap(f"m{i}", "MAP")
        for lyr in m.listLayers():
            if lyr.supports("ISBASEMAPLAYER") and lyr.isBasemapLayer:
                nm = lyr.name if lyr.supports("NAME") else "?"
                m.removeLayer(lyr)
                notes.append(f"removed default basemap layer {nm}")
        sr = wkt_for(p)
        m.spatialReference = arcpy.SpatialReference(sr) if isinstance(sr, int) else arcpy.SpatialReference(text=sr)
        rgb = rgb_tif(arcpy, fr["rgba_png"], b, gdb, f"f{i:04d}")
        fl = m.addDataFromPath(rgb)
        try:                                       # show the prepared colours as they are: no RGB stretch
            cim = fl.getDefinition("V3")            # RGB composites have no arcpy colorizer: use the CIM
            cz = cim.colorizer                      # identity mapping: custom min/max 0..255, no gamma, no DRA
            cz.stretchType = "MinimumMaximum"
            cz.useCustomStretchMinMax = True
            cz.customStretchMinRed = cz.customStretchMinGreen = cz.customStretchMinBlue = 0
            cz.customStretchMaxRed = cz.customStretchMaxGreen = cz.customStretchMaxBlue = 255
            cz.useGammaStretch = False
            cz.gammaR = cz.gammaG = cz.gammaB = 1.0
            cz.useDefaultMapping = False
            cim.useDRA = False if hasattr(cim, "useDRA") else None
            fl.setDefinition(cim)
        except Exception as e:  # noqa: BLE001
            notes.append(f"stretch off failed: {e}")
        if st.get("hillshade"):
            if st.get("hillshade") == "arcgis" and sa_ok:
                arcpy.CheckOutExtension("Spatial")
                hs = arcpy.sa.Hillshade(fr["asc"], 315, 45, "NO_SHADOWS", 1 / 111_320.0)
                hp = f"{gdb}\\hs{i:04d}"
                hs.save(hp)
                hl = m.addDataFromPath(hp)
            else:
                from PIL import Image

                hl = None
                if fr.get("shade_png"):
                    import numpy as np

                    a = np.asarray(Image.open(fr["shade_png"]).convert("L"))
                    hh, ww = a.shape
                    r = arcpy.NumPyArrayToRaster(np.ascontiguousarray(a), arcpy.Point(b[0], b[1]),
                                                 (b[2] - b[0]) / ww, (b[3] - b[1]) / hh)
                    hp = f"{gdb}\\hs{i:04d}"
                    r.save(hp)
                    arcpy.management.DefineProjection(hp, arcpy.SpatialReference(4326))
                    hl = m.addDataFromPath(hp)
            if hl is not None:
                hl.transparency = int(100 * (1 - float(st.get("shade_alpha", 0.35))))
        if fr.get("contours"):
            c = st["contours"]
            fc = f"{gdb}\\cont{i:04d}"
            if c.get("engine") == "arcgis" and sa_ok:
                arcpy.CheckOutExtension("Spatial")
                arcpy.sa.Contour(fr["asc"], fc, c["interval"])
            else:
                arcpy.conversion.JSONToFeatures(fr["contours"], fc, "POLYLINE")
            cl = m.addDataFromPath(fc)
            sym = cl.symbology
            sym.renderer.symbol.color = {"RGB": [*_job.hexrgb(c.get("color", "#222222")), 100]}
            sym.renderer.symbol.width = 0.75 * float(c.get("width", 0.8))
            cl.symbology = sym
        if job.get("overlays"):
            fc = f"{gdb}\\ov{i:04d}"
            gj = json.loads(Path(job["overlays"]).read_text(encoding="utf-8"))
            lines = {"type": "FeatureCollection", "features": [
                f for f in gj["features"] if f["geometry"]["type"] in ("LineString", "MultiLineString")]}
            lp = work / f"ov_lines_{i:04d}.geojson"
            lp.write_text(json.dumps(lines), encoding="utf-8")
            if lines["features"]:
                arcpy.conversion.JSONToFeatures(str(lp), fc, "POLYLINE")
                ol = m.addDataFromPath(fc)
                sym = ol.symbology
                sym.renderer.symbol.color = {"RGB": [26, 26, 26, 100]}
                sym.renderer.symbol.width = 0.5
                ol.symbology = sym
        lay = aprx.createLayout(W / 96.0, H / 96.0, "INCH", f"L{i}")
        mf = lay.createMapFrame(arcpy.Extent(0, 0, W / 96.0, H / 96.0), m, "frame")
        ext = arcpy.Extent(b[0], max(b[1], -85), b[2], min(b[3], 85), spatial_reference=arcpy.SpatialReference(4326))
        mf.camera.setExtent(ext.projectAs(m.spatialReference))
        aprx.save()
        lay.exportToPNG(out, resolution=96)
        outs.append(out)
        del aprx
    ver = f"ArcGIS Pro {lic['version']} ({lic['product']}, {lic['licence_type']}); Spatial={lic['extensions']['Spatial']}"
    _job.done(job, tool, ver, outs, notes, licence_flags=flags)


if __name__ == "__main__":
    main()
