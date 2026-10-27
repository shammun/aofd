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


def render_frame(job, fr, out: Path, work: Path):
    W, H = job["size"]
    style = job["style"]
    b = job["bounds"]
    texture = job["kind"] == "texture"
    region = "d" if (texture or job["recipe"].get("region", "global") == "global") else [b[0], b[2], b[1], b[3]]
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
    tmp = work / f"_gmt_{out.stem}.png"
    fig.savefig(tmp, dpi=DPI, crop=True if not texture else False)
    fit_canvas(tmp, out, W, H, exact=texture)


def main():
    job, tool = _job.load()
    work = Path(job["workdir"]) / "pygmt"
    work.mkdir(exist_ok=True)
    outs = []
    for fr, out in zip(job["frames"], job["outputs"]):
        render_frame(job, fr, Path(out), work)
        outs.append(out)
    with pygmt.clib.Session() as lib:
        gv = lib.info["version"]
    _job.done(job, tool, f"pygmt {pygmt.__version__}, GMT {gv}", outs)


if __name__ == "__main__":
    main()
