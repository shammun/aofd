"""Recipe -> prepared job: the one place where data are read, cut, scaled and turned into tool-neutral files.

Runs in the project ``.venv`` (xarray, matplotlib, cmocean, cartopy/shapely, fluidpy). Every adapter then reads the
same prepared files, so two tools rendering one recipe show the *same numbers*:

* ``field_<t>.nc``  — 2-D grid, variable ``field``, lat ascending, lon in [-180, 180), CF attrs, units after scaling;
* ``field_<t>.asc`` + ``.prj`` — the same grid as ESRI ASCII (GDAL, arcpy and GMT all read it);
* ``rgba_<t>.png``  — the field coloured with the recipe colour map, equirectangular over the region (web tools);
* ``shade_<t>.png`` — optional hillshade (grey, same footprint);
* ``contours_<t>.geojson`` — contour lines of the field (isobars etc.) computed once with matplotlib;
* ``overlays.geojson`` — coast / borders / land / user GeoJSON, clipped to the region;
* ``height_<t>.png`` (16-bit grey) and ``terrarium_<t>.png`` (RGB Terrarium encoding) for heightmap kinds;
* ``job.json`` — everything an adapter needs (paths, bounds, vmin/vmax, LUT, camera, size, projection, outputs).
"""
from __future__ import annotations

import json
import math
import os
import re
from pathlib import Path

import numpy as np

from common import DATA, LICENCE_FALLBACK, REPO, sha256_file, write_json

NE_ZIPS = {
    "coast": ("NE-lines", "ne_50m_coastline.zip"),
    "coast_110m": ("NE-lines", "ne_110m_coastline.zip"),
    "borders": ("NE-lines", "ne_50m_admin_0_boundary_lines_land.zip"),
    "land": ("NE-50m-land", "ne_50m_land.zip"),
}


def resolve(p: str) -> Path:
    s = str(p).replace("${DATA}", str(DATA)).replace("${REPO}", str(REPO))
    q = Path(s)
    return q if q.is_absolute() else REPO / q


def lut(name: str, n: int = 256) -> list[str]:
    """Colour map name -> list of n hex colours. ``cmocean.X`` or a matplotlib name; jet/rainbow refused."""
    import matplotlib

    if re.search(r"jet|rainbow|hsv|nipy|gist_ncar", name, re.I):
        raise ValueError(f"colour map {name!r} is banned (CLAUDE.md rule 5); use cmocean or viridis")
    if name.startswith("cmocean."):
        import cmocean

        cm = getattr(cmocean.cm, name.split(".", 1)[1])
    else:
        cm = matplotlib.colormaps[name]
    return [matplotlib.colors.to_hex(cm(i / (n - 1))) for i in range(n)]


def _cmap(colors: list[str]):
    import matplotlib.colors as mc

    return mc.ListedColormap(colors)


def licence_of(path: Path, attrs: dict) -> dict:
    lic = attrs.get("licence") or attrs.get("license")
    cred = attrs.get("attribution") or attrs.get("citation")
    if not (lic and cred):
        for k, (l2, c2) in LICENCE_FALLBACK.items():
            if k.lower() in path.name.lower():
                lic, cred = lic or l2, cred or c2
    if "era5" in path.name.lower() and not cred:
        lic, cred = "CC-BY 4.0", "Contains modified Copernicus Climate Change Service information (ERA5)"
    lic = lic or "UNKNOWN - check before publishing"
    status = ("ok (noncommercial; allowed: educational, non-monetised)" if re.search(r"NC|non-?commercial", lic, re.I)
              else "check" if lic.startswith("UNKNOWN") else "ok")
    return {"licence": lic, "credit": cred or "UNKNOWN", "licence_status": status}


def _times(da, spec):
    if "time" not in da.dims:
        return [None]
    if spec in (None, "first"):
        return [da.time.values[0]]
    if spec == "all":
        return list(da.time.values)
    if isinstance(spec, list):
        return [np.datetime64(s) for s in spec]
    if isinstance(spec, dict):           # {start, stop, step}
        sub = da.sel(time=slice(spec.get("start"), spec.get("stop")))
        return list(sub.time.values[:: int(spec.get("step", 1))])
    return [np.datetime64(spec)]


def load_fields(d: dict, region):
    """Return (list of (label, 2-D DataArray), source attrs)."""
    import xarray as xr

    path = resolve(d["path"])
    ds = xr.open_dataset(path)
    da = ds[d["var"]]
    ren = {c: n for c, n in [("latitude", "lat"), ("longitude", "lon"), ("y", "lat"), ("x", "lon")] if c in da.dims}
    da = da.rename(ren)
    if "level" in da.dims and d.get("level") is not None:
        da = da.sel(level=d["level"])
    if float(da.lon.max()) > 180:
        da = da.assign_coords(lon=((da.lon + 180) % 360) - 180).sortby("lon")
    if da.lat[0] > da.lat[-1]:
        da = da.sortby("lat")
    if region and region != "global":
        lo0, lo1, la0, la1 = region
        da = da.sel(lon=slice(lo0, lo1), lat=slice(la0, la1))
    stride = int(d.get("stride", 1))
    if stride > 1:
        da = da.isel(lon=slice(None, None, stride), lat=slice(None, None, stride))
    da = da * float(d.get("scale", 1.0)) + float(d.get("offset", 0.0))
    units = d.get("units", ds[d["var"]].attrs.get("units", ""))
    out = []
    for t in _times(da, d.get("time")):
        f = da if t is None else da.sel(time=t, method="nearest")
        f = f.squeeze(drop=True).astype("float32")
        f.attrs = {"units": units, "long_name": d.get("long_name", ds[d["var"]].attrs.get("long_name", d["var"]))}
        label = "" if t is None else str(np.datetime_as_string(np.datetime64(f.time.values) if "time" in f.coords
                                                                 else t, unit="m"))
        out.append((label, f))
    return path, out, dict(ds.attrs)


def write_asc(f, p: Path) -> None:
    lon, lat = f.lon.values, f.lat.values
    dx = float(lon[1] - lon[0])
    a = np.asarray(f.values)[::-1]                  # north-up rows
    a = np.where(np.isfinite(a), a, -9999.0)
    with open(p, "w", encoding="ascii") as fh:
        fh.write(f"ncols {a.shape[1]}\nnrows {a.shape[0]}\nxllcorner {lon[0] - dx / 2:.6f}\n"
                 f"yllcorner {lat[0] - dx / 2:.6f}\ncellsize {dx:.8f}\nNODATA_value -9999\n")
        np.savetxt(fh, a, fmt="%.6g")
    p.with_suffix(".prj").write_text(
        'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563]],PRIMEM["Greenwich",0],'
        'UNIT["degree",0.0174532925199433]]', encoding="ascii")


def contours_geojson(f, levels, p: Path) -> int:
    import matplotlib

    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    fig, ax = plt.subplots()
    cs = ax.contour(f.lon.values, f.lat.values, f.values, levels=levels)
    feats = []
    for lev, segs in zip(cs.levels, cs.allsegs):
        for s in segs:
            if len(s) < 2:
                continue
            feats.append({"type": "Feature", "properties": {"level": float(lev)},
                          "geometry": {"type": "LineString",
                                       "coordinates": np.round(s, 4).tolist()}})
    plt.close(fig)
    p.write_text(json.dumps({"type": "FeatureCollection", "features": feats}), encoding="utf-8")
    return len(feats)


def rgba_png(f, colors, vmin, vmax, p: Path, width: int | None = None, shade=None) -> None:
    from PIL import Image

    a = np.asarray(f.values)[::-1]
    x = np.clip((a - vmin) / (vmax - vmin), 0, 1)
    lutarr = np.array([[int(c[i:i + 2], 16) for i in (1, 3, 5)] for c in colors], dtype=np.uint8)
    rgb = lutarr[np.nan_to_num(x * (len(colors) - 1)).astype(int)]
    alpha = np.where(np.isfinite(a), 255, 0).astype(np.uint8)
    im = Image.fromarray(np.dstack([rgb, alpha]), "RGBA")
    if width and width != im.size[0]:
        h = round(width * im.size[1] / im.size[0])
        im = im.resize((width, h), Image.Resampling.BICUBIC)
    im.save(p, optimize=False)


def hillshade(f, azimuth=315.0, altitude=45.0, zfactor=1.0):
    """Horn-style hillshade on a lat/lon grid (metres), 0..1."""
    z = np.nan_to_num(np.asarray(f.values, dtype=np.float64))
    lat = np.deg2rad(f.lat.values)
    dy = np.gradient(f.lat.values)[:, None] * 111_320.0
    dx = np.gradient(f.lon.values)[None, :] * 111_320.0 * np.cos(lat)[:, None]
    gy, gx = np.gradient(z, axis=0) / dy * zfactor, np.gradient(z, axis=1) / dx * zfactor
    slope = np.arctan(np.hypot(gx, gy))
    aspect = np.arctan2(-gx, gy)
    az, alt = math.radians(azimuth), math.radians(altitude)
    hs = np.sin(alt) * np.cos(slope) + np.cos(alt) * np.sin(slope) * np.cos(az - aspect)
    return np.clip(hs, 0, 1)


def heightmaps(f, stem: Path) -> dict:
    from PIL import Image

    z = np.nan_to_num(np.asarray(f.values, dtype=np.float64))[::-1]
    zmin, zmax = float(z.min()), float(z.max())
    g16 = np.round((z - zmin) / max(zmax - zmin, 1e-9) * 65535).astype(np.uint16)
    Image.fromarray(g16).save(stem.parent / f"height_{stem.name}.png")
    v = z + 32768.0                                     # Terrarium: (R*256 + G + B/256) - 32768
    r = np.floor(v / 256)
    g = np.floor(v - r * 256)
    b = np.floor((v - r * 256 - g) * 256)
    Image.fromarray(np.dstack([r, g, b]).clip(0, 255).astype(np.uint8), "RGB").save(
        stem.parent / f"terrarium_{stem.name}.png")
    return {"height_png": str(stem.parent / f"height_{stem.name}.png"),
            "terrarium_png": str(stem.parent / f"terrarium_{stem.name}.png"),
            "zmin": zmin, "zmax": zmax, "encoding": "height: 16-bit grey, z = zmin + v/65535*(zmax-zmin); "
                                                    "terrarium: z = R*256 + G + B/256 - 32768"}


def overlays(spec, region, workdir: Path) -> tuple[Path | None, list[dict]]:
    """Coast/borders/land from Natural Earth zips (fetched through the guard) or user GeoJSON, clipped to region."""
    if not spec:
        return None, []
    import shapely.geometry as sg

    feats, prov = [], []
    box = sg.box(-180, -90, 180, 90) if region in (None, "global") else sg.box(region[0], region[2], region[1],
                                                                              region[3])
    for item in spec:
        if isinstance(item, dict) and "geojson" in item:
            p = resolve(item["geojson"])
            gj = json.loads(p.read_text(encoding="utf-8"))
            kind = item.get("kind", p.stem)
            for ft in gj.get("features", []):
                g = sg.shape(ft["geometry"]).intersection(box)
                if not g.is_empty:
                    feats.append({"type": "Feature", "properties": {"kind": kind},
                                  "geometry": sg.mapping(g)})
            prov.append({"path": str(p), "sha256": sha256_file(p), **licence_of(p, {})})
            continue
        key, fname = NE_ZIPS[item]
        p = DATA / "raw" / key / fname
        if not p.exists():
            from fluidpy.data import fetch

            p = fetch(key) if key == "NE-50m-land" else p
        import shapefile  # pyshp (cartopy dependency)
        import zipfile, io

        with zipfile.ZipFile(p) as z:
            base = [n[:-4] for n in z.namelist() if n.endswith(".shp")][0]
            r = shapefile.Reader(shp=io.BytesIO(z.read(base + ".shp")), dbf=io.BytesIO(z.read(base + ".dbf")),
                                 shx=io.BytesIO(z.read(base + ".shx")))
            for shp in r.shapes():
                g = sg.shape(shp.__geo_interface__)
                if not g.is_valid:
                    g = g.buffer(0)
                g = g.intersection(box)
                if not g.is_empty:
                    feats.append({"type": "Feature", "properties": {"kind": item.split("_")[0]},
                                  "geometry": sg.mapping(g)})
        prov.append({"path": str(p), "sha256": sha256_file(p), "licence": "public domain",
                     "credit": "Made with Natural Earth"})
    out = workdir / "overlays.geojson"
    out.write_text(json.dumps({"type": "FeatureCollection", "features": feats}, default=float), encoding="utf-8")
    return out, prov


# ------------------------------------------------------------------------------------------------------------------
# Symbol layers (points + labels, H/L centres, wind vectors, fronts): recipe ``layers:`` -> tool-neutral files
# ------------------------------------------------------------------------------------------------------------------

LAYER_TYPES = ("points", "extrema", "vectors", "fronts")
NE_PLACES = "${DATA}/raw/NE-10m-places/ne_10m_populated_places_simple.zip"


def _grow(region, margin: float):
    """Region widened by ``margin`` degrees (vectors regrid and front probes need data just outside the frame)."""
    if region in (None, "global"):
        return region
    lo0, lo1, la0, la1 = region
    return [max(lo0 - margin, -180.0), min(lo1 + margin, 180.0), max(la0 - margin, -90.0), min(la1 + margin, 90.0)]


def _gj_meta(gj: dict) -> dict:
    """Top-level ``licence`` / ``attribution`` of a GeoJSON FeatureCollection (our derived layers carry them)."""
    return {k: gj[k] for k in ("licence", "license", "attribution") if gj.get(k)}


def _write_grid(fields: dict, p: Path) -> None:
    import xarray as xr

    ds = xr.Dataset({k: v.drop_vars([c for c in v.coords if c not in ("lat", "lon")]) for k, v in fields.items()})
    ds.to_netcdf(p)


def _point_features(spec: dict, region, prov: list) -> list[dict]:
    """Points from Natural Earth places, a GeoJSON file and/or inline items -> GeoJSON Point features."""
    import sys

    feats = []
    pl = spec.get("places")
    pl = {} if pl in (None, False) else {} if pl is True else dict(pl)
    keep = spec.get("keep", pl.get("keep"))                  # accepted on the layer or inside places:
    rename = spec.get("rename", pl.get("rename")) or {}
    promote = set(spec.get("promote") or [])
    bbox = (-180, 180, -90, 90) if region in (None, "global") else tuple(region)
    if spec.get("places"):
        zp = resolve(pl.get("zip", NE_PLACES))
        sys.path.insert(0, str(Path(__file__).resolve().parent))
        import cartostyle

        places = cartostyle.load_places(zp, bbox, max_scalerank=int(pl.get("max_scalerank", 3)),
                                        min_pop=float(pl.get("min_pop", 0)), exclude=pl.get("exclude", ()))
        for p in places:
            if keep and p.name not in keep and rename.get(p.name) not in keep:
                continue
            feats.append({"name": rename.get(p.name, p.name), "lon": p.lon, "lat": p.lat, "rank": p.rank,
                          "kind": p.kind})
        if keep:                                             # keep the listed names only, in any order
            feats = [f for f in feats if f["name"] in keep]
        prov.append({"path": str(zp), "sha256": sha256_file(zp), "licence": "public domain",
                     "credit": "Made with Natural Earth", "role": "places"})
    if spec.get("path"):
        p = resolve(spec["path"])
        gj = json.loads(p.read_text(encoding="utf-8"))
        for ft in gj["features"]:
            lo, la = ft["geometry"]["coordinates"][:2]
            q = ft.get("properties") or {}
            feats.append({"name": q.get("name", ""), "lon": float(lo), "lat": float(la),
                          "rank": float(q.get("rank", 5)), "kind": q.get("kind", "feature")})
        prov.append({"path": str(p), "sha256": sha256_file(p), "role": "points", **licence_of(p, _gj_meta(gj))})
    for it in spec.get("items") or []:
        feats.append({"name": it.get("name", ""), "lon": float(it["lon"]), "lat": float(it["lat"]),
                      "rank": float(it.get("rank", 5)), "kind": it.get("kind", "feature")})
    out = []
    for f in feats:
        pro = f["name"] in promote                           # story place: labelled first, leader line allowed
        if pro:
            f["rank"] = min(f["rank"], -1.0) - 10.0
        if not (bbox[0] <= f["lon"] <= bbox[1] and bbox[2] <= f["lat"] <= bbox[3]):
            continue
        out.append({"type": "Feature", "geometry": {"type": "Point", "coordinates": [f["lon"], f["lat"]]},
                    "properties": {"name": f["name"], "rank": f["rank"], "kind": f["kind"], "promoted": pro}})
    out.sort(key=lambda g: (g["properties"]["rank"], g["properties"]["name"]))
    return out


def _warm_left(xy: np.ndarray, temp) -> bool | None:
    """Is the warm air on the LEFT of the front's drawing direction (geographic, lon scaled by cos lat)?

    Same probe idea as ``cartostyle.front_flip`` but in lon/lat, so tools without matplotlib axes (GMT, deck.gl)
    can put the symbols on the right side. None when no temperature was given."""
    if temp is None or len(xy) < 2:
        return None
    from scipy.ndimage import map_coordinates

    lon, lat, T = temp.lon.values.astype(float), temp.lat.values.astype(float), np.asarray(temp.values, float)
    c = np.cos(np.radians(xy[:, 1]))
    t = np.gradient(xy, axis=0) * np.c_[c, np.ones_like(c)]
    n = np.c_[-t[:, 1], t[:, 0]]
    n /= np.hypot(*n.T)[:, None] + 1e-12
    probe = 1.5                                         # degrees: sample the air masses, not the frontal zone
    left = xy + probe * n / np.c_[np.maximum(c, 0.2), np.ones_like(c)]
    right = xy - probe * n / np.c_[np.maximum(c, 0.2), np.ones_like(c)]

    def samp(q):
        fi = (q[:, 0] - lon[0]) / (lon[1] - lon[0])
        fj = (q[:, 1] - lat[0]) / (lat[1] - lat[0])
        return map_coordinates(T, [fj, fi], order=1, mode="nearest")

    return bool(np.nanmean(samp(left) - samp(right)) > 0)


def prepare_layers(recipe: dict, fields: list, region, workdir: Path, d0: dict) -> tuple[list[dict], list[dict]]:
    """Recipe ``layers:`` -> prepared files every adapter reads (returns (job layers, provenance)).

    points  -> ``points_<k>.geojson``   Point features {name, rank, kind}; ``label``/``marker`` flags kept on the layer
    extrema -> ``extrema_<k>_<t>.geojson`` per frame, Point features {kind: low|high, value}
    vectors -> ``vectors_<k>_<t>.nc``   u, v on the (widened) region in the layer's units (e.g. kt)
    fronts  -> ``fronts_<k>.geojson``   LineStrings {kind, warm_left}; optional ``fronts_<k>_t.nc`` (temperature)
    """
    specs = recipe.get("layers") or []
    out, prov = [], []
    nfr = len(fields)
    for k, spec in enumerate(specs):
        typ = spec.get("type")
        if typ not in LAYER_TYPES:
            raise ValueError(f"layer {k}: type {typ!r} unknown; use one of {LAYER_TYPES}")
        lay = {"type": typ, "index": k, **{x: spec[x] for x in ("label", "marker", "style", "color", "density",
                                                                 "units", "letters", "size_key", "max_labels")
                                           if x in spec}}
        if typ == "points":
            feats = _point_features(spec, region, prov)
            p = workdir / f"points_{k}.geojson"
            p.write_text(json.dumps({"type": "FeatureCollection", "features": feats}), encoding="utf-8")
            lay.update(file=str(p), n=len(feats))
        elif typ == "extrema":
            files = []
            fixed = None
            if spec.get("path"):
                p = resolve(spec["path"])
                gj = json.loads(p.read_text(encoding="utf-8"))
                fixed = [{"kind": f["properties"]["kind"], "lon": f["geometry"]["coordinates"][0],
                          "lat": f["geometry"]["coordinates"][1],
                          "value": float(f["properties"].get("value", f["properties"].get("hPa", float("nan"))))}
                         for f in gj["features"]]
                prov.append({"path": str(p), "sha256": sha256_file(p), "role": "extrema", **licence_of(p, _gj_meta(gj))})
            auto = spec.get("auto")
            for i, (_, f) in enumerate(fields):
                if fixed is not None:
                    cs = fixed
                else:
                    import sys

                    sys.path.insert(0, str(Path(__file__).resolve().parent))
                    import cartostyle

                    a = {} if auto in (None, True) else dict(auto)
                    bb = None if region in (None, "global") else tuple(region)
                    cs = cartostyle.find_extrema(f.lon.values, f.lat.values, f.values, bbox=bb,
                                                 window_deg=float(a.get("window_deg", 10.0)),
                                                 min_prominence=float(a.get("min_prominence", 4.0)))
                    cs = cs[: int(a.get("max", 6))]
                p = workdir / f"extrema_{k}_{i:04d}.geojson"
                p.write_text(json.dumps({"type": "FeatureCollection", "features": [
                    {"type": "Feature", "geometry": {"type": "Point", "coordinates": [c["lon"], c["lat"]]},
                     "properties": {"kind": c["kind"], "value": c["value"]}} for c in cs]}), encoding="utf-8")
                files.append(str(p))
            lay.update(files=files)
        elif typ == "vectors":
            files = []
            grids = {}
            for comp in ("u", "v"):
                c = dict(spec[comp]) if isinstance(spec[comp], dict) else {"var": spec[comp]}
                c.setdefault("path", d0["path"])
                c.setdefault("time", d0.get("time"))
                c.setdefault("scale", spec.get("scale", 1.0))
                c.setdefault("units", spec.get("units", ""))
                path, fl, attrs = load_fields(c, _grow(region, float(spec.get("margin_deg", 0.0))))
                grids[comp] = fl
                if not any(q["path"] == str(path) for q in prov):
                    prov.append({"path": str(path), "sha256": sha256_file(path), "var": c["var"], "role": "vectors",
                                 **licence_of(path, attrs)})
            for i in range(nfr):
                j = min(i, len(grids["u"]) - 1)
                p = workdir / f"vectors_{k}_{i:04d}.nc"
                _write_grid({"u": grids["u"][j][1], "v": grids["v"][j][1]}, p)
                files.append(str(p))
            lay.update(files=files, units=spec.get("units", ""), style=spec.get("style", "barbs"))
        else:   # fronts
            p = resolve(spec["path"])
            gj = json.loads(p.read_text(encoding="utf-8"))
            prov.append({"path": str(p), "sha256": sha256_file(p), "role": "fronts", **licence_of(p, _gj_meta(gj))})
            temp = None
            if spec.get("temperature"):
                c = dict(spec["temperature"])
                path, fl, attrs = load_fields(c, _grow(region, 5.0))
                temp = fl[0][1]
                tp = workdir / f"fronts_{k}_t.nc"
                _write_grid({"t": temp}, tp)
                lay["temperature"] = str(tp)
                prov.append({"path": str(path), "sha256": sha256_file(path), "var": c["var"], "role": "front orientation",
                             **licence_of(path, attrs)})
            feats = []
            for ft in gj["features"]:
                if ft["geometry"]["type"] != "LineString":
                    continue
                xy = np.asarray(ft["geometry"]["coordinates"], float)[:, :2]
                kind = ft["properties"].get("kind", "cold")
                feats.append({"type": "Feature", "geometry": {"type": "LineString", "coordinates": xy.tolist()},
                              "properties": {"kind": kind, "warm_left": _warm_left(xy, temp)}})
            fp = workdir / f"fronts_{k}.geojson"
            fp.write_text(json.dumps({"type": "FeatureCollection", "features": feats}), encoding="utf-8")
            lay.update(file=str(fp), n=len(feats))
        out.append(lay)
    return out, prov


def prepare(recipe: dict, workdir: Path) -> dict:
    """Read the recipe's data, write the prepared files into ``workdir`` and return the job dict."""
    import xarray as xr

    workdir.mkdir(parents=True, exist_ok=True)
    region = recipe.get("region", "global")
    style = recipe.get("style", {}) or {}
    data = recipe["data"] if isinstance(recipe["data"], list) else [recipe["data"]]
    d0 = data[0]
    path, fields, attrs = load_fields(d0, region)
    colors = lut(style.get("cmap", "viridis"))
    allv = np.concatenate([np.asarray(f.values).ravel() for _, f in fields])
    allv = allv[np.isfinite(allv)]
    vmin = float(style.get("vmin", np.percentile(allv, 1)))
    vmax = float(style.get("vmax", np.percentile(allv, 99)))
    if style.get("center") is not None:                    # diverging, centred
        c = float(style["center"])
        h = max(abs(vmax - c), abs(c - vmin))
        vmin, vmax = c - h, c + h
    cont = style.get("contours")
    frames = []
    for i, (label, f) in enumerate(fields):
        stem = f"{i:04d}"
        nc = workdir / f"field_{stem}.nc"
        xr.Dataset({"field": f.drop_vars([c for c in f.coords if c not in ("lat", "lon")])}).to_netcdf(nc)
        asc = workdir / f"field_{stem}.asc"
        write_asc(f, asc)
        fr = {"label": label, "nc": str(nc), "asc": str(asc), "rgba_png": str(workdir / f"rgba_{stem}.png")}
        rgba_png(f, colors, vmin, vmax, Path(fr["rgba_png"]), width=style.get("image_width", 2048))
        if style.get("hillshade"):
            from PIL import Image

            hs = hillshade(f, zfactor=float(style.get("hillshade_z", 1.0)))[::-1]
            sp = workdir / f"shade_{stem}.png"
            Image.fromarray((hs * 255).astype(np.uint8), "L").resize(
                Image.open(fr["rgba_png"]).size, Image.Resampling.BICUBIC).save(sp)
            fr["shade_png"] = str(sp)
        if cont:
            lv = np.arange(math.floor(vmin / cont["interval"]) * cont["interval"] - cont["interval"] * 20,
                           vmax + cont["interval"] * 20, cont["interval"])
            lv = lv[(lv >= np.nanmin(f.values)) & (lv <= np.nanmax(f.values))]
            cp = workdir / f"contours_{stem}.geojson"
            fr["n_contours"] = contours_geojson(f, lv, cp)
            fr["contours"] = str(cp)
            fr["contour_levels"] = [float(x) for x in lv]
        if recipe.get("kind") == "heightmap" or (recipe.get("camera") and style.get("terrain", True)):
            fr.update(heightmaps(f, workdir / stem))
        frames.append(fr)
    ov, ov_prov = overlays(recipe.get("overlays", []), region, workdir)
    layers, lay_prov = prepare_layers(recipe, fields, region, workdir, d0)
    ov_prov = ov_prov + lay_prov
    f0 = fields[0][1]
    lon, lat = f0.lon.values, f0.lat.values
    dx, dy = float(lon[1] - lon[0]), float(lat[1] - lat[0])
    bounds = [float(lon[0] - dx / 2), float(lat[0] - dy / 2), float(lon[-1] + dx / 2), float(lat[-1] + dy / 2)]
    prov = [{"path": str(path), "sha256": sha256_file(path), "var": d0["var"], **licence_of(path, attrs)}] + ov_prov
    for extra in data[1:]:                        # extra layers (e.g. imagery) are passed through untouched
        p = resolve(extra["path"])
        meta = {}
        side = p.with_suffix(".json")
        if side.exists():
            try:
                meta = json.loads(side.read_text(encoding="utf-8"))
            except Exception:
                meta = {}
        prov.append({"path": str(p), "sha256": sha256_file(p), "role": extra.get("role", "layer"),
                     **licence_of(p, meta)})
    job = {
        "recipe": recipe, "workdir": str(workdir), "frames": frames, "bounds": bounds,
        "units": f0.attrs.get("units", ""), "long_name": f0.attrs.get("long_name", ""),
        "vmin": vmin, "vmax": vmax, "lut": colors, "overlays": str(ov) if ov else None,
        "extra_layers": [dict(e, path=str(resolve(e["path"]))) for e in data[1:]],
        "size": recipe.get("size", [1280, 720]), "projection": recipe.get("projection", {"name": "platecarree"}),
        "camera": recipe.get("camera"), "kind": recipe.get("kind", "png"), "style": style,
        "labels": recipe.get("labels", False), "provenance": prov, "layers": layers,
    }
    write_json(workdir / "job.json", job)
    return job


# Remote sources: (prefix, licence, credit, status). status: ok | ok (noncommercial ...) | check.
# User decision 2026-10-27: the movies are educational and non-monetised, so noncommercial (NC) datasets are allowed;
# every source is credited (licence + credit columns in every sidecar).
REMOTE_LICENCES = [
    ("ECMWF/ERA5", "CC BY 4.0 (Copernicus)", "Contains modified Copernicus Climate Change Service information (ERA5)", "ok"),
    ("NOAA/", "public domain (NOAA)", "NOAA", "ok"),
    ("NASA/", "NASA open data (no restrictions)", "NASA", "ok"),
    ("MODIS/", "NASA open data (no restrictions)", "NASA LP DAAC MODIS", "ok"),
    ("USGS/", "public domain (USGS)", "USGS", "ok"),
    ("LANDSAT/", "public domain (USGS)", "USGS Landsat", "ok"),
    ("COPERNICUS/S2", "Copernicus Sentinel data terms (free, attribution)", "Contains modified Copernicus Sentinel data", "ok"),
    ("COPERNICUS/S1", "Copernicus Sentinel data terms (free, attribution)", "Contains modified Copernicus Sentinel data", "ok"),
    ("COPERNICUS/DEM", "Copernicus DEM licence (free, attribution)", "Copernicus DEM (c) DLR e.V. / Airbus, provided under COPERNICUS", "ok"),
    ("JRC/", "CC BY 4.0 (JRC) - check the catalogue page", "EC JRC", "check"),
    ("JAXA/", "JAXA terms (partner dataset; registration/attribution)", "(c) JAXA", "check"),
    ("projects/sat-io/", "community catalogue: per-dataset licence", "awesome-gee-community-catalog", "check"),
    ("eox/s2cloudless-2016", "CC BY 4.0", "Sentinel-2 cloudless 2016 by EOX IT Services GmbH", "ok"),
    ("eox/s2cloudless", "CC BY-NC-SA 4.0", "Sentinel-2 cloudless by EOX IT Services GmbH", "ok (noncommercial; allowed: educational, non-monetised)"),
    ("gibs:", "NASA open data (no restrictions)", "NASA EOSDIS GIBS / Worldview", "ok"),
    ("gibs:GOES", "NASA/NOAA open data", "NASA EOSDIS GIBS; NOAA/NESDIS, CIRA (GeoColor)", "ok"),
    ("stac:earth-search/sentinel-2", "Copernicus Sentinel data terms (free, attribution)", "Contains modified Copernicus Sentinel data, via Element 84 Earth Search", "ok"),
    ("stac:earth-search/landsat", "public domain (USGS)", "USGS Landsat, via Element 84 Earth Search", "ok"),
    ("stac:planetary-computer/", "per-collection licence (see the collection page)", "Microsoft Planetary Computer", "check"),
]
GEE_LICENCES = {k: (lic, c + ", via Google Earth Engine") for k, lic, c, _ in REMOTE_LICENCES}


def remote_licence(asset: str, via: str = "") -> dict:
    best = None
    for k, lic, c, st in REMOTE_LICENCES:
        if asset.startswith(k) and (best is None or len(k) > len(best[0])):
            best = (k, lic, c, st)
    if best is None:
        return {"licence": "UNKNOWN - read the catalogue page", "credit": asset + via, "licence_status": "check"}
    return {"licence": best[1], "credit": best[2] + via, "licence_status": best[3]}


def expand_dates(spec) -> list[str]:
    """``"2023-11-02"`` | ``[d1, d2]`` | ``{start, stop, step: "1 month"|"7 day"|"6 hour"|"1 year"}`` -> ISO list."""
    import datetime as dt

    if spec is None:
        return []
    if isinstance(spec, (str, dt.date)):
        return [str(spec)]
    if isinstance(spec, list):
        return [str(x) for x in spec]
    n, unit = str(spec.get("step", "1 month")).split()
    n = int(n)
    t = dt.datetime.fromisoformat(str(spec["start"]))
    stop = dt.datetime.fromisoformat(str(spec["stop"]))
    out = []
    while t <= stop:
        out.append(t.isoformat(timespec="minutes") if (t.hour or t.minute) else t.date().isoformat())
        if unit.startswith("month"):
            m = t.month - 1 + n
            t = t.replace(year=t.year + m // 12, month=m % 12 + 1)
        elif unit.startswith("year"):
            t = t.replace(year=t.year + n)
        elif unit.startswith("day"):
            t += dt.timedelta(days=n)
        elif unit.startswith("hour"):
            t += dt.timedelta(hours=n)
        else:
            raise ValueError(f"step unit {unit}")
    return out


def prepare_remote(recipe: dict, workdir: Path) -> dict:
    """Job for server-side sources (``gee:``, ``gibs:``, ``stac:`` blocks): no local field, only frame dates, LUT,
    bounds, overlays and provenance. Kinds: png | timelapse | before_after | timeseries."""
    workdir.mkdir(parents=True, exist_ok=True)
    region = recipe.get("region", "global")
    style = recipe.get("style", {}) or {}
    src = "gee" if recipe.get("gee") else "gibs" if recipe.get("gibs") else "stac"
    g = recipe[src]
    kind = recipe.get("kind", "png")
    b = [-180.0, -90.0, 180.0, 90.0] if region in (None, "global") else [region[0], region[2], region[1], region[3]]
    ov, ov_prov = overlays(recipe.get("overlays", []), region, workdir)
    if src == "gee":
        assets = [g["asset"]]
        prov = [{"path": f"earthengine://{a}", "sha256": None, "var": g.get("band") or g.get("rgb"),
                 **remote_licence(a, ", via Google Earth Engine")} for a in assets]
    elif src == "gibs":
        prov = [{"path": f"gibs://{g['layer']}", "sha256": None, "var": g["layer"],
                 **remote_licence("gibs:" + g["layer"])}]
    else:
        prov = [{"path": f"stac://{g['api']}/{g['collection']}", "sha256": None, "var": g.get("asset", "visual"),
                 **remote_licence(f"stac:{g.get('catalog', 'earth-search')}/{g['collection']}")}]
    if kind == "before_after":
        frames = [{"label": "before", **g["before"]}, {"label": "after", **g["after"]}]
    elif kind == "timeseries":
        frames = [{"label": "series"}]
    else:
        dates = expand_dates(g.get("dates")) or [str(g.get("date"))]
        frames = [{"label": d, "date": d} for d in dates]
    job = {"recipe": recipe, "workdir": str(workdir), "frames": frames, "source": src,
           "bounds": b, "units": g.get("units", ""), "long_name": g.get("band", ""),
           "vmin": float(style.get("vmin", 0)), "vmax": float(style.get("vmax", 1)),
           "lut": lut(style.get("cmap", "viridis"), 64), "overlays": str(ov) if ov else None, "extra_layers": [],
           "size": recipe.get("size", [1024, 512]), "projection": {"name": "platecarree"},
           "camera": None, "kind": kind, "style": style, "labels": False,
           "archive": str(DATA / "raw" / src.upper() / recipe["name"]),
           "provenance": prov + [dict(q, licence_status="ok") for q in ov_prov]}
    write_json(workdir / "job.json", job)
    return job


prepare_gee = prepare_remote
