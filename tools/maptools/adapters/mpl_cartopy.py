"""matplotlib + cartopy adapter (project .venv). Kinds: png, png_sequence, texture, heightmap.

Deterministic: Agg backend, fixed DPI, PNG metadata stripped -> byte-identical output on the same machine.
Coasts come from the prepared overlays (Natural Earth from the G: raw store), never cartopy's own downloader.
"""
from __future__ import annotations

import json
import shutil
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import _job  # noqa: E402

import matplotlib  # noqa: E402

matplotlib.use("Agg")
import matplotlib.colors as mc  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
import numpy as np  # noqa: E402
import xarray as xr  # noqa: E402

matplotlib.rcParams.update({"svg.hashsalt": "aofd", "path.simplify": False, "font.family": "DejaVu Sans"})
META = {"Software": None}


def crs_of(p: dict):
    import cartopy.crs as ccrs

    n = p["name"].lower()
    if n in ("platecarree", "equirectangular", "latlon"):
        return ccrs.PlateCarree(central_longitude=p.get("lon0", 0) if p.get("recentre") else 0)
    if n == "mercator":
        return ccrs.Mercator(central_longitude=p["lon0"])
    if n == "robinson":
        return ccrs.Robinson(central_longitude=p.get("lon0", 0))
    if n in ("orthographic", "ortho", "globe"):
        return ccrs.Orthographic(p["lon0"], p["lat0"])
    if n in ("lambert", "lambert_conformal", "lcc"):
        return ccrs.LambertConformal(p["lon0"], p["lat0"])
    if n in ("stereographic", "polar"):
        return ccrs.Stereographic(p["lat0"] >= 0 and 90 or -90, p["lon0"])
    raise ValueError(f"unknown projection {n}")


def draw_overlays(ax, path, transform, style):
    if not path:
        return
    import shapely.geometry as sg

    gj = json.loads(Path(path).read_text(encoding="utf-8"))
    col = {"coast": style.get("coast_color", "#1a1a1a"), "borders": style.get("border_color", "#4d4d4d"),
           "land": "none"}
    for ft in gj["features"]:
        k = ft["properties"].get("kind", "coast")
        g = sg.shape(ft["geometry"])
        lines = []
        if g.geom_type in ("LineString", "MultiLineString"):
            lines = [g] if g.geom_type == "LineString" else list(g.geoms)
        elif g.geom_type in ("Polygon", "MultiPolygon"):
            polys = [g] if g.geom_type == "Polygon" else list(g.geoms)
            lines = [p.exterior for p in polys]
        for ln in lines:
            x, y = np.asarray(ln.coords).T[:2]
            ax.plot(x, y, color=col.get(k, "#1a1a1a"), lw=0.6 if k != "borders" else 0.4,
                    ls="-" if k != "borders" else (0, (3, 2)), transform=transform, zorder=4)


def _cartostyle(job, W, H, dpi):
    """Opt-in house cartography (tools/maptools/cartostyle.py) when the recipe sets ``style.cartostyle``.

    Returns (module, CartoStyle sized to this render) or None. Without the flag nothing changes, so the
    self-test references stay byte-identical."""
    flag = job.get("style", {}).get("cartostyle")
    if not flag:
        return None
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
    import cartostyle

    st = cartostyle.style(flag if isinstance(flag, str) else "movie")
    st.size_px, st.dpi = (W, H), float(dpi)
    st.content_box = None if st.medium != "movie" or (W, H) != (1920, 1080) else st.content_box
    st.caption_band = st.caption_band if (W, H) == (1920, 1080) else None
    return cartostyle, st


def render_map(job, fr, out: Path, texture: bool = False):
    import cartopy.crs as ccrs

    W, H = job["size"]
    style = job["style"]
    dpi = 100
    f = xr.open_dataset(fr["nc"])["field"]
    pc = ccrs.PlateCarree()
    cmap = mc.ListedColormap(job["lut"])
    if texture:                                     # equirectangular, edge to edge, no axes: a three.js texture
        fig = plt.figure(figsize=(W / dpi, H / dpi), dpi=dpi)
        ax = fig.add_axes([0, 0, 1, 1], projection=pc)
        ax.set_global() if job["recipe"].get("region", "global") == "global" else ax.set_extent(
            [job["bounds"][0], job["bounds"][2], job["bounds"][1], job["bounds"][3]], crs=pc)
        ax.axis("off")
    else:
        p = _job.proj(job)
        crs = crs_of(p)
        fig = plt.figure(figsize=(W / dpi, H / dpi), dpi=dpi)
        ax = fig.add_axes([0.02, 0.02, 0.96, 0.96], projection=crs)
        b = job["bounds"]
        if job["recipe"].get("region", "global") == "global":
            ax.set_global()
        else:
            ax.set_extent([b[0], b[2], b[1], b[3]], crs=pc)
    ax.pcolormesh(f.lon, f.lat, f.values, cmap=cmap, vmin=job["vmin"], vmax=job["vmax"], transform=pc,
                  shading="auto", rasterized=True, zorder=1)
    if fr.get("shade_png"):
        sh = np.asarray(xr.open_dataset(fr["nc"])["field"].values)
        from PIL import Image

        hs = np.asarray(Image.open(fr["shade_png"]).convert("L"), dtype=float)[::-1] / 255
        ax.imshow(hs, extent=[job["bounds"][0], job["bounds"][2], job["bounds"][1], job["bounds"][3]],
                  origin="lower", cmap="gray", alpha=float(style.get("shade_alpha", 0.35)), transform=pc, zorder=2,
                  interpolation="bilinear")
        del sh
    if fr.get("contours"):
        c = style["contours"]
        cs = ax.contour(f.lon, f.lat, f.values, levels=fr["contour_levels"], colors=c.get("color", "#222222"),
                        linewidths=c.get("width", 0.8), transform=pc, zorder=3)
        carto = _cartostyle(job, W, H, dpi)
        if carto is not None and (c.get("labels") or job.get("labels")):
            # opt-in (style.cartostyle: movie|notebook|print|true): collision-free in-line labels with halos
            cmod, st = carto
            st.colors = dict(st.colors, contour=c.get("color", "#222222"))
            cmod.isobar_labels(ax, cs, st, fmt="{:g}")
        elif c.get("labels") or job.get("labels"):
            ax.clabel(cs, fmt="%g", fontsize=9)
    draw_overlays(ax, job.get("overlays"), pc, style)
    if job.get("labels") and not texture:
        ax.set_title(f"{job['long_name']} [{job['units']}]  {fr['label']}", fontsize=11)
    out.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(out, dpi=dpi, metadata=META, pad_inches=0)
    plt.close(fig)


def main():
    job, tool = _job.load()
    import cartopy

    outs = []
    kind = job["kind"]
    targets = job["outputs"]
    for fr, out in zip(job["frames"], targets):
        out = Path(out)
        if kind == "heightmap":
            shutil.copyfile(fr["height_png"], out)
            shutil.copyfile(fr["terrarium_png"], out.with_name(out.stem + "_terrarium.png"))
            outs += [str(out), str(out.with_name(out.stem + "_terrarium.png"))]
            continue
        render_map(job, fr, out, texture=(kind == "texture"))
        outs.append(str(out))
    _job.done(job, tool, f"matplotlib {matplotlib.__version__}, cartopy {cartopy.__version__}", outs)


if __name__ == "__main__":
    main()
