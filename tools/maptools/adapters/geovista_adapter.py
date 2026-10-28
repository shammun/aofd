"""GeoVista / PyVista adapter (.venv-maps, VTK offscreen). Kinds: png, png_sequence.

* Globe (``projection.name`` in orthographic/globe, or a global region): the prepared grid as a GeoVista mesh on the
  sphere, coloured with the recipe LUT, contours and overlays as polylines lifted slightly above the surface, camera
  looking at (lon0, lat0) from ``camera.distance`` Earth radii (default 3.2).
* Regional with ``camera``: a pyvista surface warped by the field (metres x ``camera.exaggeration``), lon/lat scaled to
  km, coloured with the LUT and lit; camera azimuth/elevation as in the recipe.
* Regional without camera: GeoVista planar projection (``crs`` from the recipe, e.g. ``+proj=robin``).
* Texture route (``style.texture: field``, or a data item with ``role: texture``/``underlay`` such as a GIBS
  true-colour equirectangular JPEG): an RGB cell mesh via ``add_texture`` (``add_base_layer(texture=)`` crashes with
  pyvista 0.49). ``style.show_field: false`` hides the scalar field under a texture (default when a texture is given).
GeoVista's own Natural Earth downloader and texture fetchers are NOT used (no network): coasts come from the prepared
overlays. Offscreen rendering with a fixed window size; anti-aliasing off for repeatable pixels.
"""
from __future__ import annotations

import json
import math
import os
import sys
from pathlib import Path

os.environ.setdefault("PYVISTA_OFF_SCREEN", "true")
sys.path.insert(0, str(Path(__file__).parent))
import _job  # noqa: E402

import numpy as np  # noqa: E402
import pyvista as pv  # noqa: E402
import xarray as xr  # noqa: E402

pv.OFF_SCREEN = True
R_KM = 6371.0


def lut_cmap(job):
    from matplotlib.colors import ListedColormap

    return ListedColormap(job["lut"])


def lonlat_xyz(lon, lat, r=1.0):
    lo, la = np.deg2rad(lon), np.deg2rad(lat)
    return np.c_[r * np.cos(la) * np.cos(lo), r * np.cos(la) * np.sin(lo), r * np.sin(la)]


def lines_poly(geojson: str, to_xyz, kinds=None):
    gj = json.loads(Path(geojson).read_text(encoding="utf-8"))
    pts, cells = [], []
    n = 0
    for ft in gj["features"]:
        if kinds and ft["properties"].get("kind") not in kinds:
            continue
        g = ft["geometry"]
        t = g["type"]
        rings = {"LineString": lambda c: [c], "MultiLineString": lambda c: c,
                 "Polygon": lambda c: c[:1], "MultiPolygon": lambda c: [p[0] for p in c]}[t](g["coordinates"])
        for ring in rings:
            a = np.asarray(ring, dtype=float)[:, :2]
            if len(a) < 2:
                continue
            pts.append(to_xyz(a[:, 0], a[:, 1]))
            cells.append(np.r_[len(a), np.arange(n, n + len(a))])
            n += len(a)
    if not pts:
        return None
    return pv.PolyData(np.vstack(pts), lines=np.concatenate(cells))


MAX_TEXTURE_CELLS = 1_500_000      # RGB cells on the sphere (VTK stays fast and deterministic; ~1730 x 865 global)


def texture_bounds(layer: dict) -> list[float]:
    """[w, s, e, n] of an image layer: the layer's ``bounds``, else its sidecar JSON (``bounds_wsen`` or
    ``lon_edges``/``lat_edges``, as our GIBS/BMNG products write), else the whole globe."""
    if layer.get("bounds"):
        return [float(v) for v in layer["bounds"]]
    side = Path(layer["path"]).with_suffix(".json")
    if side.exists():
        m = json.loads(side.read_text(encoding="utf-8"))
        if "bounds_wsen" in m:
            return [float(v) for v in m["bounds_wsen"]]
        if "lon_edges" in m and "lat_edges" in m:
            return [m["lon_edges"][0], m["lat_edges"][0], m["lon_edges"][-1], m["lat_edges"][-1]]
    return [-180.0, -90.0, 180.0, 90.0]


def add_texture(p, image, bounds, radius: float = 1.0, max_cells: int = MAX_TEXTURE_CELLS, notes=None):
    """Drape an equirectangular RGB image on the globe as an **RGB cell mesh** (the adapter's texture route).

    ``GeoPlotter.add_base_layer(texture=...)`` crashes with geovista 0.5.3 + pyvista 0.49 (``core.combine``
    AttributeError; capability tests 2026-10-27), so each image pixel becomes one cell of a
    ``gv.Transform.from_1d`` lon/lat mesh carrying its colour (``rgb=True``), drawn unlit. The image is reduced
    (Lanczos, deterministic) to at most ``max_cells`` cells; row 0 is the north edge. ``image``: path or PIL image.
    """
    import geovista as gv
    from PIL import Image

    Image.MAX_IMAGE_PIXELS = 400_000_000
    im = image.convert("RGB") if isinstance(image, Image.Image) else Image.open(image).convert("RGB")
    w0, h0 = im.size
    s = min(1.0, math.sqrt(max_cells / float(w0 * h0)))
    if s < 1.0:
        im = im.resize((max(2, round(w0 * s)), max(2, round(h0 * s))), Image.Resampling.LANCZOS)
        if notes is not None:
            notes.append(f"texture {w0}x{h0} reduced to {im.size[0]}x{im.size[1]} cells (MAX_TEXTURE_CELLS)")
    a = np.asarray(im, dtype=np.uint8)
    h, w = a.shape[:2]
    lon = np.linspace(bounds[0], bounds[2], w + 1)
    lat = np.linspace(bounds[3], bounds[1], h + 1)          # north -> south: matches image rows
    mesh = gv.Transform.from_1d(lon, lat, data=a.reshape(-1, 3), name="rgb", rgb=True, radius=radius)
    p.add_mesh(mesh, rgb=True, lighting=False)
    return mesh


def globe(job, fr, out, W, H, notes=None):
    import geovista as gv

    notes = [] if notes is None else notes
    f = xr.open_dataset(fr["nc"])["field"]
    lon, lat, val = f.lon.values.astype(float), f.lat.values.astype(float), np.asarray(f.values, dtype=float)
    dlon = lon[1] - lon[0]
    if lon[-1] - lon[0] + dlon >= 359.9:                 # close the seam: cell edges -180 .. 180
        edges_lon = np.r_[lon - dlon / 2, lon[-1] + dlon / 2]
    else:
        edges_lon = np.r_[lon - dlon / 2, lon[-1] + dlon / 2]
    dlat = lat[1] - lat[0]
    edges_lat = np.clip(np.r_[lat - dlat / 2, lat[-1] + dlat / 2], -90, 90)
    p = gv.GeoPlotter(off_screen=True, window_size=(W, H))
    p.set_background("white")
    st = job["style"]
    # texture route: image layers (data items with role texture/underlay) as RGB cell meshes, underneath
    texs = [e for e in job.get("extra_layers", []) if e.get("role") in ("texture", "underlay")]
    for e in texs:
        add_texture(p, e["path"], texture_bounds(e), radius=1.0, notes=notes)
    if st.get("texture") == "field":               # drape the prepared LUT-coloured (+ hillshaded) field image
        from PIL import Image

        im = Image.open(fr["rgba_png"]).convert("RGBA")
        if fr.get("shade_png"):
            sh = np.asarray(Image.open(fr["shade_png"]).convert("L").resize(im.size), float) / 255
            a = np.asarray(im, float)
            k = float(st.get("shade_alpha", 0.35))
            a[..., :3] *= (1 - k) + k * sh[..., None]
            im = Image.fromarray(a.clip(0, 255).astype(np.uint8), "RGBA")
        bg = Image.new("RGBA", im.size, (217, 217, 217, 255))      # NaN cells opaque grey (depth order)
        b = job["bounds"]
        add_texture(p, Image.alpha_composite(bg, im), [b[0], max(b[1], -90), b[2], min(b[3], 90)],
                    radius=1.0 + 0.0005 * bool(texs), notes=notes)
    elif st.get("show_field", not texs):
        mesh = gv.Transform.from_1d(edges_lon, edges_lat, data=val, name="field")
        p.add_mesh(mesh, cmap=lut_cmap(job), clim=(job["vmin"], job["vmax"]), show_scalar_bar=False,
                   nan_color="#d9d9d9",  # opaque: a translucent NaN colour breaks depth order
                   lighting=bool(st.get("lighting", False)))
    lift = 1.004
    if fr.get("contours"):
        c = job["style"]["contours"]
        lp = lines_poly(fr["contours"], lambda x, y: lonlat_xyz(x, y, lift))
        if lp is not None:
            p.add_mesh(lp, color=c.get("color", "#222222"), line_width=max(1, c.get("width", 0.8) * 1.5))
    if job.get("overlays"):
        lp = lines_poly(job["overlays"], lambda x, y: lonlat_xyz(x, y, lift * 1.0005))
        if lp is not None:
            p.add_mesh(lp, color="#1a1a1a", line_width=1)
    pr = _job.proj(job)
    cam = job.get("camera") or {}
    b = job["bounds"]
    if job["recipe"].get("region", "global") == "global":
        d_auto = 3.2
    else:                                          # regional: come closer so the region fills the frame
        span = max((b[2] - b[0]) * math.cos(math.radians(pr["lat0"])), b[3] - b[1])
        d_auto = max(1.25, 1 + 1.1 * math.radians(span))
    d = float(cam.get("distance", d_auto))
    p.camera_position = [tuple(lonlat_xyz(np.array([pr["lon0"]]), np.array([pr["lat0"]]), d)[0]), (0, 0, 0),
                         (0, 0, 1)]
    if job["recipe"].get("region", "global") == "global" or "distance" in cam:
        p.camera.view_angle = math.degrees(2 * math.asin(min(1.0, 1.08 / d)))   # whole globe, small margin
    else:
        p.camera.view_angle = math.degrees(2 * math.atan(0.6 * math.radians(span) / (d - 1)))
    p.renderer.ResetCameraClippingRange()
    p.screenshot(out)
    p.close()


def terrain(job, fr, out, W, H):
    f = xr.open_dataset(fr["nc"])["field"]
    cam = job["camera"]
    ex = float(cam.get("exaggeration", 6))
    lon, lat = np.meshgrid(f.lon.values, f.lat.values)
    lat0 = float(np.mean(f.lat.values))
    x = np.deg2rad(lon - lon.mean()) * R_KM * math.cos(math.radians(lat0))
    y = np.deg2rad(lat - lat0) * R_KM
    z = np.nan_to_num(f.values) / 1000.0 * ex
    grid = pv.StructuredGrid(x, y, z)
    grid["field"] = np.asarray(f.values).ravel(order="F")
    p = pv.Plotter(off_screen=True, window_size=(W, H))
    p.set_background("white")
    p.add_mesh(grid, scalars="field", cmap=lut_cmap(job), clim=(job["vmin"], job["vmax"]), show_scalar_bar=False,
               smooth_shading=True, specular=0.0, ambient=0.25, diffuse=0.8)

    def to_xyz(a, b):
        return np.c_[np.deg2rad(a - lon.mean()) * R_KM * math.cos(math.radians(lat0)),
                     np.deg2rad(b - lat0) * R_KM, np.full(len(a), 0.05 + 0 * a)]

    if job.get("overlays"):
        lp = lines_poly(job["overlays"], to_xyz)
        if lp is not None:
            p.add_mesh(lp, color="#1a1a1a", line_width=1)
    az, el = float(cam.get("azimuth", 170)), float(cam.get("elevation", 35))
    span = float(max(x.max() - x.min(), y.max() - y.min()))
    dist = span * float(cam.get("distance", 0.95))
    a, e = math.radians(az), math.radians(el)
    p.camera.focal_point = (0, 0, 0)
    p.camera.position = (dist * math.cos(e) * math.sin(a), dist * math.cos(e) * math.cos(a), dist * math.sin(e))
    p.camera.up = (0, 0, 1)
    p.renderer.ResetCameraClippingRange()
    p.screenshot(out)
    p.close()


def main():
    job, tool = _job.load()
    import geovista as gv

    W, H = job["size"]
    pr = _job.proj(job)
    outs, notes = [], []
    is_globe = pr["name"].lower() in ("orthographic", "ortho", "globe") or job["recipe"].get("region") == "global"
    for fr, out in zip(job["frames"], job["outputs"]):
        if is_globe:
            globe(job, fr, out, W, H, notes)
        elif job.get("camera"):
            terrain(job, fr, out, W, H)
        else:
            globe(job, fr, out, W, H, notes)   # regional field on the globe, camera on its centre
        outs.append(out)
    if job.get("layers"):
        notes.append("symbol layers (points/extrema/vectors/fronts) are not drawn by the geovista adapter; "
                     "draw labels as billboards (three.js/Remotion) or use mpl/pygmt")
    _job.done(job, tool, f"geovista {gv.__version__}, pyvista {pv.__version__}, vtk {pv.vtk_version_info}", outs,
              list(dict.fromkeys(notes)))


if __name__ == "__main__":
    main()
