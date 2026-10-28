"""PyGMT adapter (micromamba env on G:, GMT 6.x + Ghostscript). Kinds: png, png_sequence, texture.

* 2-D: ``grdimage`` of the prepared grid with a CPT built from the recipe LUT (so colours match every other tool),
  optional ``grdgradient`` hillshade (``style.hillshade``), prepared contours and overlays drawn with ``plot``.
* 3-D: when the recipe has ``camera`` and ``kind: png``, ``grdview`` with ``perspective=[azimuth, elevation]``,
  ``zsize`` from ``camera.zsize_cm`` (default 2.5 cm) and image draping (``surftype='i'``) + shading.
* Output is padded/cropped onto a canvas of exactly ``size`` pixels (white, centred) so contact sheets line up.
GMT never fetches remote ``@earth_relief`` data here: grids come from ``prep`` only.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import _job  # noqa: E402

import numpy as np  # noqa: E402
import pygmt  # noqa: E402
import xarray as xr  # noqa: E402
from PIL import Image  # noqa: E402

DPI = 150
# kind: texture. GMT modern mode draws on a 32767-pt (11.6 m) page; saving that page uncropped at 150 dpi is a
# ~4.6-gigapixel raster (the 2026-10-27 capability-test crash). Textures are therefore always cropped to the map and
# rasterised at the dpi that gives exactly the requested pixel width; the request itself is capped.
MAX_TEXTURE = (16384, 8192)          # largest texture we render (w, h); larger requests are scaled down + noted
MAX_TEXTURE_PIXELS = MAX_TEXTURE[0] * MAX_TEXTURE[1]
Image.MAX_IMAGE_PIXELS = int(MAX_TEXTURE_PIXELS * 1.25)     # PIL refuses anything beyond (never a 4.6-Gpx file)


def write_cpt(job, path: Path) -> str:
    lut, v0, v1 = job["lut"], job["vmin"], job["vmax"]
    n = len(lut)
    edges = np.linspace(v0, v1, n + 1)
    with open(path, "w", encoding="ascii") as fh:
        for i, c in enumerate(lut):
            r, g, b = _job.hexrgb(c)
            fh.write(f"{edges[i]:.6g} {r}/{g}/{b} {edges[i + 1]:.6g} {r}/{g}/{b}\n")
        r, g, b = _job.hexrgb(lut[0])
        fh.write(f"B {r}/{g}/{b}\n")
        r, g, b = _job.hexrgb(lut[-1])
        fh.write(f"F {r}/{g}/{b}\nN 255/255/255\n")
    return str(path)


def geojson_to_gmt(gj_path: str, out: Path, kinds=None, prop=None) -> dict[str, str]:
    """GeoJSON lines/polygon rings -> one GMT multisegment file per kind (or per contour level if prop)."""
    gj = json.loads(Path(gj_path).read_text(encoding="utf-8"))
    buckets: dict[str, list[str]] = {}
    for ft in gj["features"]:
        k = str(ft["properties"].get(prop or "kind", "line")) if prop else ft["properties"].get("kind", "coast")
        if kinds and k not in kinds:
            continue
        g = ft["geometry"]
        rings = []
        t = g["type"]
        if t == "LineString":
            rings = [g["coordinates"]]
        elif t == "MultiLineString":
            rings = g["coordinates"]
        elif t == "Polygon":
            rings = g["coordinates"][:1]
        elif t == "MultiPolygon":
            rings = [p[0] for p in g["coordinates"]]
        b = buckets.setdefault("all" if prop else k, [])
        for ring in rings:
            b.append(">")
            b += [f"{x:.5f} {y:.5f}" for x, y, *_ in ring]
    files = {}
    for k, lines in buckets.items():
        p = out.with_name(out.stem + f"_{k}.gmt")
        p.write_text("\n".join(lines) + "\n", encoding="ascii")
        files[k] = str(p)
    return files


def gmt_projection(job, width_in: float) -> str:
    p = _job.proj(job)
    n = p["name"].lower()
    w = f"{width_in:.4f}i"
    if job["kind"] == "texture" or n in ("platecarree", "equirectangular", "latlon"):
        return f"Q{p.get('lon0', 0) if job['kind'] != 'texture' else 0}/{w}"
    if n == "mercator":
        return f"M{w}"
    if n == "robinson":
        return f"N{p.get('lon0', 0)}/{w}"
    if n in ("orthographic", "ortho", "globe"):
        return f"G{p['lon0']}/{p['lat0']}/{w}"
    if n in ("lambert", "lambert_conformal", "lcc"):
        return f"L{p['lon0']}/{p['lat0']}/{p['lat0'] - 10}/{p['lat0'] + 10}/{w}"
    if n in ("stereographic", "polar"):
        return f"S{p['lon0']}/{90 if p['lat0'] >= 0 else -90}/{w}"
    raise ValueError(n)


def fit_canvas(src: Path, dst: Path, W: int, H: int, exact: bool = False) -> None:
    im = Image.open(src).convert("RGB")
    if exact:
        im = im.resize((W, H), Image.Resampling.LANCZOS)
        im.save(dst)
        return
    s = min(W / im.size[0], H / im.size[1])
    im = im.resize((max(1, round(im.size[0] * s)), max(1, round(im.size[1] * s))), Image.Resampling.LANCZOS)
    can = Image.new("RGB", (W, H), "white")
    can.paste(im, ((W - im.size[0]) // 2, (H - im.size[1]) // 2))
    can.save(dst)


SYM = {"low": "#c1121f", "high": "#1d4ed8", "cold": "#1f4fd6", "warm": "#d62728", "occluded": "#7b2cbf",
       "stationary": "#b5651d", "trough": "#b5651d", "barb": "#3d4a63", "place": "#1d2433"}   # cartostyle notebook


def _lfile(lay, i):
    return lay["files"][min(i, len(lay["files"]) - 1)] if "files" in lay else lay.get("file")


def draw_layers(fig, job, i: int, notes: list) -> None:
    """Recipe ``layers:`` with GMT symbols: geovectors (arrows, true azimuth, length ~ speed), WMO front symbols
    (``-Sf``: cold triangles / warm semicircles on the side prep found with the temperature), H/L letters with the
    central pressure, places (dot + label with a halo). No collision avoidance: GMT places what it is given."""
    by = {}
    for lay in job["layers"]:
        by.setdefault(lay["type"], []).append(lay)
    for lay in by.get("vectors", []):
        g = xr.open_dataset(_lfile(lay, i))
        nx, ny = lay.get("density") or (20, 12)
        lo, la = g.lon.values, g.lat.values
        ii = np.linspace(0, lo.size - 1, int(nx)).round().astype(int)
        jj = np.linspace(0, la.size - 1, int(ny)).round().astype(int)
        u, v = g.u.values[np.ix_(jj, ii)], g.v.values[np.ix_(jj, ii)]
        sp = np.hypot(u, v)
        k = 0.6 * (lo[-1] - lo[0]) / nx / max(float(np.nanpercentile(sp, 95)), 1e-9)   # 95th pct -> 0.6 cell
        lines = [">"]
        for a, y in enumerate(la[jj]):
            for c, x in enumerate(lo[ii]):
                if not np.isfinite(sp[a, c]) or sp[a, c] == 0:
                    continue
                dx, dy = k * u[a, c] / max(np.cos(np.radians(y)), 0.2), k * v[a, c]
                x1, y1 = x + dx, y + dy
                ang, hl = np.arctan2(dy, dx), 0.3 * np.hypot(dx, dy)
                pts = [(x, y), (x1, y1), (x1 - hl * np.cos(ang - 0.45), y1 - hl * np.sin(ang - 0.45)), (x1, y1),
                       (x1 - hl * np.cos(ang + 0.45), y1 - hl * np.sin(ang + 0.45))]
                lines += [f"{px:.4f} {py:.4f}" for px, py in pts] + [">"]
        vf = Path(job["workdir"]) / "pygmt" / f"vectors_{lay['index']}_{i:04d}.gmt"
        vf.write_text("\n".join(lines[:-1]) + "\n", encoding="ascii")
        fig.plot(data=str(vf), pen=f"0.9p,{lay.get('color', SYM['barb'])}")
        notes.append("pygmt vectors: arrows (length ~ speed; 95th percentile = 0.6 grid cell), not WMO barbs")
    for lay in by.get("fronts", []):
        gj = json.loads(Path(lay["file"]).read_text(encoding="utf-8"))
        for ft in gj["features"]:
            kind = ft["properties"]["kind"]
            xy = np.asarray(ft["geometry"]["coordinates"], float)
            col = SYM.get(kind, SYM["cold"])
            wl = ft["properties"].get("warm_left")
            if kind == "trough":
                fig.plot(x=xy[:, 0], y=xy[:, 1], pen=f"1.8p,{col},-")
                continue
            left = True if wl is None else (wl if kind == "cold" else not wl)
            sym = "+t" if kind in ("cold", "occluded") else "+c"
            fig.plot(x=xy[:, 0], y=xy[:, 1], pen="4p,white")
            fig.plot(x=xy[:, 0], y=xy[:, 1], pen=f"1.6p,{col}", fill=col,
                     style=f"f0.9c/0.28c{'+l' if left else '+r'}{sym}")
            if wl is None:
                notes.append("front without temperature: symbols drawn on the left (check the side)")
    for lay in by.get("extrema", []):
        gj = json.loads(Path(_lfile(lay, i)).read_text(encoding="utf-8"))
        letters = lay.get("letters") or {"low": "L", "high": "H"}
        for ft in gj["features"]:
            x, y = ft["geometry"]["coordinates"][:2]
            kd = ft["properties"]["kind"]
            col = SYM[kd]
            fig.text(x=x, y=y, text=letters[kd], font=f"26p,Helvetica-Bold,{col}=~2p,white", justify="CM",
                     no_clip=False)
            fig.text(x=x, y=y, text=f"{ft['properties']['value']:.0f}", font=f"11p,Helvetica-Bold,{col}=~1.5p,white",
                     justify="TC", offset="0c/-0.5c", no_clip=False)
    for lay in by.get("points", []):
        gj = json.loads(Path(lay["file"]).read_text(encoding="utf-8"))
        fs = gj["features"][: int(lay.get("max_labels", 8))]
        if not fs:
            continue
        x = [f["geometry"]["coordinates"][0] for f in fs]
        y = [f["geometry"]["coordinates"][1] for f in fs]
        if lay.get("marker", True):
            fig.plot(x=x, y=y, style="c0.16c", fill=SYM["place"], pen="0.8p,white")
        if lay.get("label", True):
            for xx, yy, f in zip(x, y, fs):
                fig.text(x=xx, y=yy, text=f["properties"]["name"], font=f"9p,Helvetica,{SYM['place']}=~1.2p,white",
                         justify="BL", offset="0.12c/0.1c")
    if by.get("points") or by.get("extrema"):
        notes.append("pygmt labels: no collision avoidance (use mpl + cartostyle for final synoptic charts)")


def texture_size(job, notes: list) -> tuple[int, int]:
    """Pixel size of a texture: the recipe ``size``, kept at the region's lon:lat aspect, capped at MAX_TEXTURE."""
    W, H = (int(v) for v in job["size"])
    b = job["bounds"]
    if job["recipe"].get("region", "global") == "global":
        span_x, span_y = 360.0, 180.0
    else:
        span_x, span_y = b[2] - b[0], b[3] - b[1]
    want_h = max(1, round(W * span_y / span_x))
    if abs(want_h - H) > 1:
        notes.append(f"texture height {H} -> {want_h} px to keep the equirectangular lon:lat aspect "
                     f"({span_x:g} x {span_y:g} deg)")
        H = want_h
    s = min(1.0, MAX_TEXTURE[0] / W, MAX_TEXTURE[1] / H)
    if s < 1.0:
        notes.append(f"texture {W}x{H} capped to {round(W * s)}x{round(H * s)} (MAX_TEXTURE {MAX_TEXTURE})")
        W, H = round(W * s), round(H * s)
    return W, H


def render_frame(job, fr, out: Path, work: Path, notes: list | None = None):
    notes = [] if notes is None else notes
    W, H = job["size"]
    style = job["style"]
    b = job["bounds"]
    texture = job["kind"] == "texture"
    if texture:
        W, H = texture_size(job, notes)
        gl = job["recipe"].get("region", "global") == "global"
        region = [-180, 180, -90, 90] if gl else [b[0], b[2], b[1], b[3]]
    else:
        region = "d" if job["recipe"].get("region", "global") == "global" else [b[0], b[2], b[1], b[3]]
    cpt = write_cpt(job, work / "lut.cpt")
    grid = xr.open_dataset(fr["nc"])["field"]
    width_in = W / DPI
    proj = gmt_projection(job, width_in)
    shade = False
    if style.get("hillshade"):
        shade = "+a315+nt0.8"
    fig = pygmt.Figure()
    pygmt.config(MAP_FRAME_TYPE="plain", FONT_ANNOT_PRIMARY="8p", PS_PAGE_COLOR="white")
    cam = job.get("camera")
    if cam and not texture and job["kind"] in ("png", "png_sequence"):
        if job.get("layers"):
            notes.append("symbol layers are not drawn on grdview 3-D stills (draped text/symbols shear)")
        zmin, zmax = float(grid.min()), float(grid.max())
        fig.grdview(grid=grid, region=region + [zmin, zmax] if isinstance(region, list) else region,
                    projection=proj, perspective=[cam.get("azimuth", 170), cam.get("elevation", 35)],
                    zsize=f"{cam.get('zsize_cm', 2.5)}c", surftype="i", cmap=cpt, shading=shade or True,
                    frame=False, plane=f"{zmin}+gwhite")
    else:
        fig.grdimage(grid=grid, region=region, projection=proj, cmap=cpt, shading=shade,
                     frame=False if texture else ["f"], nan_transparent=True)
        if fr.get("contours"):
            c = style["contours"]
            for k, f in geojson_to_gmt(fr["contours"], work / "contours.gmt", prop="level").items():
                fig.plot(data=f, pen=f"{c.get('width', 0.8) * 0.75:.2f}p,{c.get('color', '#222222')}")
        if job.get("overlays"):
            files = geojson_to_gmt(job["overlays"], work / "ov.gmt")
            for k, f in files.items():
                if k == "land":
                    continue
                pen = "0.5p,#1a1a1a" if k != "borders" else "0.35p,#4d4d4d,4_2:0p"
                fig.plot(data=f, pen=pen)
        if job.get("layers") and not texture:
            draw_layers(fig, job, job["frames"].index(fr), notes)
    tmp = work / f"_gmt_{out.stem}.png"
    # always crop to the drawn map (an uncropped modern-mode page is gigapixels); a texture is rasterised at the
    # dpi that maps width_in inches to exactly W pixels, then snapped to W x H (sub-pixel crop rounding only)
    fig.savefig(tmp, dpi=DPI, crop=True)
    with Image.open(tmp) as im:
        got = im.size
    if texture and (abs(got[0] - W) > 4 or abs(got[1] - H) > 4):
        raise RuntimeError(f"GMT texture raster {got} far from the requested {W}x{H}: refusing to resample")
    fit_canvas(tmp, out, W, H, exact=texture)


def main():
    job, tool = _job.load()
    work = Path(job["workdir"]) / "pygmt"
    work.mkdir(exist_ok=True)
    outs, notes = [], []
    for fr, out in zip(job["frames"], job["outputs"]):
        render_frame(job, fr, Path(out), work, notes)
        outs.append(out)
    with pygmt.clib.Session() as lib:
        gv = lib.info["version"]
    _job.done(job, tool, f"pygmt {pygmt.__version__}, GMT {gv}", outs, list(dict.fromkeys(notes)))


if __name__ == "__main__":
    main()
