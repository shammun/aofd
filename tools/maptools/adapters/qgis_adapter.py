"""QGIS adapter: headless PyQGIS through the user's own QGIS install (``python-qgis.bat``; nothing installed into it).

* Field: the prepared ESRI ASCII grid as a raster layer with a ``QgsSingleBandPseudoColorRenderer`` built from the
  recipe LUT (256 interpolated stops, exactly the colours every other tool uses).
* Hillshade (``style.hillshade``): a second raster layer with ``QgsHillshadeRenderer`` (multiply blend).
* Contours: by default the prepared GeoJSON (same levels as every tool); ``style.contours.engine: qgis`` instead
  runs ``gdal:contour`` through the QGIS processing framework (shows the qgis_process route).
* Coasts/borders: the prepared overlays GeoJSON (borders dashed).
* Destination CRS from the recipe projection (EPSG:4326 / 3857 / ESRI:54030 Robinson / ortho / lcc / stere proj
  strings); extent = recipe bounds transformed. Rendered with ``QgsMapRendererSequentialJob`` into a QImage of
  exactly ``size`` pixels (sequential = repeatable pixel order). Labels off.
* ``camera`` (3-D) is NOT rendered here: see ``notes`` and the skill (QGIS 3-D map views need an interactive
  OpenGL window; the offscreen 3-D engine is tried only when ``style.qgis_3d: true``).
Run ``qgis_process`` algorithms for data prep with ``tools/maptools/qgis_process.py``.
"""
from __future__ import annotations

import json
import os
import sys
from pathlib import Path

os.environ.setdefault("QT_QPA_PLATFORM", "offscreen")
sys.path.insert(0, str(Path(__file__).parent))
import _job  # noqa: E402

from qgis.core import (  # noqa: E402
    Qgis, QgsApplication, QgsColorRampShader, QgsCoordinateReferenceSystem, QgsCoordinateTransform,
    QgsHillshadeRenderer, QgsLineSymbol, QgsMapRendererSequentialJob, QgsMapSettings, QgsProject, QgsRasterLayer,
    QgsRasterShader, QgsRectangle, QgsRuleBasedRenderer, QgsSingleBandPseudoColorRenderer, QgsVectorLayer,
)
from qgis.PyQt.QtCore import QSize  # noqa: E402
from qgis.PyQt.QtGui import QColor, QPainter  # noqa: E402


def dest_crs(p: dict) -> QgsCoordinateReferenceSystem:
    n = p["name"].lower()
    lon0, lat0 = p.get("lon0", 0), p.get("lat0", 0)
    proj = {
        "platecarree": "EPSG:4326", "equirectangular": "EPSG:4326", "latlon": "EPSG:4326",
        "mercator": "EPSG:3857", "robinson": f"PROJ:+proj=robin +lon_0={lon0} +datum=WGS84 +units=m +no_defs",
        "orthographic": f"PROJ:+proj=ortho +lat_0={lat0} +lon_0={lon0} +datum=WGS84 +units=m +no_defs",
        "lambert_conformal": f"PROJ:+proj=lcc +lat_0={lat0} +lon_0={lon0} +lat_1={lat0 - 10} +lat_2={lat0 + 10} "
                             f"+datum=WGS84 +units=m +no_defs",
        "stereographic": f"PROJ:+proj=stere +lat_0={90 if lat0 >= 0 else -90} +lon_0={lon0} +datum=WGS84 +units=m",
    }
    proj["ortho"] = proj["globe"] = proj["orthographic"]
    proj["lambert"] = proj["lcc"] = proj["lambert_conformal"]
    proj["polar"] = proj["stereographic"]
    s = proj.get(n, "EPSG:4326")
    if s.startswith("PROJ:"):
        return QgsCoordinateReferenceSystem.fromProj(s[5:])
    return QgsCoordinateReferenceSystem(s)


def field_layer(job, asc: str) -> QgsRasterLayer:
    lay = QgsRasterLayer(asc, "field", "gdal")
    lay.setCrs(QgsCoordinateReferenceSystem("EPSG:4326"))
    lut, v0, v1 = job["lut"], job["vmin"], job["vmax"]
    n = len(lut)
    items = [QgsColorRampShader.ColorRampItem(v0 + (v1 - v0) * i / (n - 1), QColor(c)) for i, c in enumerate(lut)]
    crs_ = QgsColorRampShader(v0, v1)
    crs_.setColorRampType(QgsColorRampShader.Interpolated)
    crs_.setClip(False)
    crs_.setColorRampItemList(items)
    sh = QgsRasterShader()
    sh.setRasterShaderFunction(crs_)
    r = QgsSingleBandPseudoColorRenderer(lay.dataProvider(), 1, sh)
    r.setClassificationMin(v0)
    r.setClassificationMax(v1)
    lay.setRenderer(r)
    lay.resampleFilter().setZoomedInResampler(None)
    return lay


def shade_layer(asc: str, alpha: float) -> QgsRasterLayer:
    lay = QgsRasterLayer(asc, "shade", "gdal")
    lay.setCrs(QgsCoordinateReferenceSystem("EPSG:4326"))
    hr = QgsHillshadeRenderer(lay.dataProvider(), 1, 315, 45)
    hr.setZFactor(1 / 111_320.0)                     # degrees horizontally, metres vertically
    hr.setMultiDirectional(False)
    lay.setRenderer(hr)
    lay.setBlendMode(QPainter.CompositionMode_Multiply)
    lay.setOpacity(alpha)
    return lay


def line_layer(path: str, name: str, color: str, width_mm: float, dashed_borders: bool = False):
    lay = QgsVectorLayer(path, name, "ogr")
    if dashed_borders:
        root = QgsRuleBasedRenderer.Rule(None)
        for expr, col, w, dash in [("\"kind\" = 'borders'", "#4d4d4d", 0.18, True),
                                   ("\"kind\" <> 'borders' OR \"kind\" IS NULL", color, width_mm, False)]:
            sym = QgsLineSymbol.createSimple({"color": col, "width": str(w), "width_unit": "MM",
                                              "line_style": "dash" if dash else "solid"})
            root.appendChild(QgsRuleBasedRenderer.Rule(sym, 0, 0, expr))
        lay.setRenderer(QgsRuleBasedRenderer(root))
    else:
        sym = QgsLineSymbol.createSimple({"color": color, "width": str(width_mm), "width_unit": "MM"})
        lay.renderer().setSymbol(sym)
    return lay


def qgis_contours(job, fr, work: Path) -> str:
    import processing
    from processing.core.Processing import Processing

    Processing.initialize()
    out = str(work / f"qgis_contours_{Path(fr['asc']).stem}.gpkg")
    processing.run("gdal:contour", {"INPUT": fr["asc"], "BAND": 1, "INTERVAL": job["style"]["contours"]["interval"],
                                    "FIELD_NAME": "level", "OUTPUT": out})
    return out


def main():
    job, tool = _job.load()
    app = QgsApplication([], False)
    app.initQgis()
    sys.path.append(str(Path(os.environ.get("QGIS_PREFIX_PATH", "")) / "python" / "plugins"))
    W, H = job["size"]
    p = _job.proj(job)
    st = job["style"]
    work = Path(job["workdir"]) / "qgis"
    work.mkdir(exist_ok=True)
    outs, notes = [], []
    if job.get("camera"):
        notes.append("camera ignored: QGIS 3-D map views are not exported headless by this adapter (2-D render)")
    dcrs = dest_crs(p)
    b = job["bounds"]
    for fr, out in zip(job["frames"], job["outputs"]):
        proj = QgsProject.instance()
        proj.clear()
        layers = []
        if job.get("overlays"):
            layers.append(line_layer(job["overlays"], "overlays", "#1a1a1a", 0.22, dashed_borders=True))
        if fr.get("contours"):
            c = st["contours"]
            src = qgis_contours(job, fr, work) if c.get("engine") == "qgis" else fr["contours"]
            layers.append(line_layer(src, "contours", c.get("color", "#222222"), 0.26 * float(c.get("width", 0.8))))
        if fr.get("shade_png"):
            layers.append(shade_layer(fr["asc"], float(st.get("shade_alpha", 0.35))))
        layers.append(field_layer(job, fr["asc"]))
        for lay in layers:
            if not lay.isValid():
                notes.append(f"invalid layer {lay.name()}")
            proj.addMapLayer(lay)
        ms = QgsMapSettings()
        ms.setLayers(layers)                          # first = top
        ms.setDestinationCrs(dcrs)
        ms.setOutputSize(QSize(W, H))
        ms.setOutputDpi(96)
        ms.setBackgroundColor(QColor("white"))
        ms.setFlag(Qgis.MapSettingsFlag.Antialiasing, True)
        ms.setFlag(Qgis.MapSettingsFlag.DrawLabeling, bool(job.get("labels")))
        ms.setTransformContext(proj.transformContext())
        src = QgsCoordinateReferenceSystem("EPSG:4326")
        if job["recipe"].get("region", "global") == "global" and p["name"].lower() in ("orthographic", "ortho",
                                                                                        "globe"):
            ext = QgsRectangle(-6.4e6, -6.4e6, 6.4e6, 6.4e6)
        else:
            rect = QgsRectangle(b[0], max(b[1], -85 if dcrs.authid() == "EPSG:3857" else -90), b[2],
                                min(b[3], 85 if dcrs.authid() == "EPSG:3857" else 90))
            ext = QgsCoordinateTransform(src, dcrs, proj).transformBoundingBox(rect)
        ms.setExtent(ext)
        job_r = QgsMapRendererSequentialJob(ms)
        job_r.start()
        job_r.waitForFinished()
        img = job_r.renderedImage()
        img.save(out, "png")
        outs.append(out)
    ver = Qgis.version()
    app.exitQgis()
    _job.done(job, tool, f"QGIS {ver}", outs, notes)


if __name__ == "__main__":
    main()
