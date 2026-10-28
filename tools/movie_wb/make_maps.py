"""Map stills for ch00_weather_basics (cartopy + MetPy + tools/maptools/cartostyle.py, movie preset), as LAYERS:
one opaque base and transparent overlays drawn with the same projection and extent, so Remotion can build the map
layer by layer on the narration (capability tests S1/S2: the winning tool for synoptic and satellite + analysis maps).

Frame: 1240 × 820 px, placed by the composition at x 60, y 40 (picture zone + some of the maths zone; keywords sit at
x ≥ 1340). Labels are placed by cartostyle (halos, Imhof positions, collision pass) and audited (cartostyle.audit).

usage: .venv/Scripts/python.exe tools/movie_wb/make_maps.py --out <public dir>
writes wb_map_<set>_<layer>.png + wb_maps.json (projection, layers, audit, sha256 of the inputs)
"""
from __future__ import annotations

import argparse
import hashlib
import json
import sys
from dataclasses import replace
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
import numpy as np  # noqa: E402
import xarray as xr  # noqa: E402
from PIL import Image  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools" / "maptools"))
import cartostyle as cs  # noqa: E402

DER = ROOT / "data" / "derived" / "ch00"
DATA = ROOT / "movies" / "ch00" / "ch00_weather_basics" / "data"
RAW = Path("G:/Geophysical Fluid Dynamics/aofd-data/raw")
A1 = RAW / "ERA5-ARCO" / "era5_ciaran_2023_u10-v10-msl-t2m_2023-11-01T00_2023-11-02T23_1h.nc"
W, H = 1240, 820
Image.MAX_IMAGE_PIXELS = None


def st_frame():
    st = cs.style("movie")
    return replace(st, size_px=(W, H), caption_band=None, content_box=(24, 24, W - 24, H - 24), max_place_labels=6,
                   label_cell_px=(300, 200))


def save_layer(fig, path: Path, st, transparent: bool):
    path.parent.mkdir(parents=True, exist_ok=True)
    if transparent:
        fig.patch.set_alpha(0.0)
        for ax in fig.axes:
            ax.set_facecolor((0, 0, 0, 0))
        fig.savefig(path, dpi=st.dpi, metadata={"Software": None}, transparent=True)
    else:
        fig.savefig(path, dpi=st.dpi, metadata={"Software": None}, facecolor=st.bg)
    plt.close(fig)
    return path


def sha(p: Path) -> str:
    return hashlib.sha256(p.read_bytes()).hexdigest()


def a1_hour(t: str):
    ds = xr.open_dataset(A1)
    ds = ds.assign_coords(longitude=((ds.longitude + 180) % 360) - 180).sortby("longitude").sortby("latitude")
    return ds.sel(time=t)


def sat_maps(out: Path) -> dict:
    """s43 / s59: MODIS Aqua true colour 2 Nov 2023 + ERA5 12 UTC isobars (white, dark halo), H/L, Brest."""
    import cartopy.crs as ccrs
    st = st_frame()
    bbox = (-36.0, 9.0, 33.0, 63.0)
    pc = ccrs.PlateCarree()
    hl = json.loads((DATA / "highs_lows.json").read_text(encoding="utf-8"))
    g = xr.open_dataset(DER / "era5_global_2023-11-02T12_sfc_0p5.nc").isel(time=0).sel(lon=slice(-70, 40), lat=slice(15, 80))
    land = cs.natural_earth_layer(RAW / "NE-50m-land/ne_50m_land.zip", (-70, 40, 15, 80))
    coast = cs.natural_earth_layer(RAW / "NE-lines/ne_50m_coastline.zip", (-70, 40, 15, 80))
    borders = cs.natural_earth_layer(RAW / "NE-lines/ne_50m_admin_0_boundary_lines_land.zip", (-70, 40, 15, 80))
    im = np.asarray(Image.open(DER / "ciaran_modis_aqua_truecolour_2023-11-02.jpg").convert("RGB"))
    rep = {}
    # base
    fig, ax, choice = cs.new_map(bbox, st, fit="frame")
    cs.fill_land(ax, land, st, zorder=0.2)
    ax.imshow(im, extent=[-50, 10, 35, 70], origin="upper", transform=pc, regrid_shape=2200, interpolation="bilinear", zorder=1)
    cs.draw_lines(ax, coast, st, "coast", zorder=3, color="#d9dde6")
    cs.draw_lines(ax, borders, st, "border", zorder=3)
    save_layer(fig, out / "wb_map_sat_base.png", st, False)
    # isobars (+ in-line labels)
    fig, ax, _ = cs.new_map(bbox, st, fit="frame")
    iso = ax.contour(g.lon, g.lat, g.msl.values / 100, levels=np.arange(948, 1040, 4), colors="white", alpha=0.9,
                     linewidths=st.px(st.line_px["contour"]), transform=pc, zorder=5)
    fig.canvas.draw()
    centres = [{"kind": "low", "lon": hl["low"]["lon"], "lat": hl["low"]["lat"], "value": hl["low"]["hPa"]},
               {"kind": "high", "lon": hl["high"]["lon"], "lat": hl["high"]["lat"], "value": hl["high"]["hPa"]}]
    rep_hl_dummy = cs.mark_extrema(ax, centres, st, value_fmt="")          # obstacles only (removed below)
    obst = rep_hl_dummy.boxes
    for t in list(ax.texts):
        t.remove()
    for c in list(ax.collections)[1:]:
        pass
    rep_iso = cs.isobar_labels(ax, iso, st, obstacles=obst)
    save_layer(fig, out / "wb_map_sat_iso.png", st, True)
    # H / L letters (no values: the numbers were spoken in s42) and Brest
    fig, ax, _ = cs.new_map(bbox, st, fit="frame")
    fig.canvas.draw()
    rep_hl = cs.mark_extrema(ax, centres, st, value_fmt="")
    brest = [cs.Place("Brest", -4.49, 48.39, -1)]
    rep_pl = cs.label_points(ax, brest, st, obstacles=rep_hl.boxes + rep_iso.boxes)
    audit = cs.audit(fig, st)
    save_layer(fig, out / "wb_map_sat_marks.png", st, True)
    rep["sat"] = {"bbox": bbox, "projection": choice.name, "params": choice.params, "isobar_labels": [p[0] for p in rep_iso.placed],
                  "hl": [p[:2] for p in rep_hl.placed], "places": [p[:2] for p in rep_pl.placed], "dropped": rep_pl.dropped,
                  "audit": audit, "layers": ["base", "iso", "marks"],
                  "data": "GIBS MODIS Aqua true colour 2023-11-02 (NASA); ERA5 MSLP 2023-11-02T12 (C3S); Natural Earth 50m",
                  "inputs_sha256": {"modis": sha(DER / "ciaran_modis_aqua_truecolour_2023-11-02.jpg"),
                                    "era5_global": sha(DER / "era5_global_2023-11-02T12_sfc_0p5.nc")}}
    return rep


def t850_maps(out: Path) -> dict:
    """s45, s46, s49, s50: ERA5 850-hPa temperature 18 UTC 1 Nov 2023, fronts (fluidpy.diag.fronts, locate='centre'),
    850-hPa wind arrows, the transect, air-mass labels, Brest and the low."""
    import cartopy.crs as ccrs
    st = st_frame()
    bbox = (-27.0, 6.0, 38.0, 60.0)
    pc = ccrs.PlateCarree()
    f8 = xr.open_dataset(DER / "era5_ciaran_2023_850hPa_1h.nc").sel(time="2023-11-01T18")
    fr = json.loads((DATA / "fronts.json").read_text(encoding="utf-8"))
    big = (-45, 20, 28, 68)
    land = cs.natural_earth_layer(RAW / "NE-50m-land/ne_50m_land.zip", big)
    coast = cs.natural_earth_layer(RAW / "NE-lines/ne_50m_coastline.zip", big)
    borders = cs.natural_earth_layer(RAW / "NE-lines/ne_50m_admin_0_boundary_lines_land.zip", big)
    rep = {}
    # base: the field
    fig, ax, choice = cs.new_map(bbox, st, fit="frame")
    cs.fill_land(ax, land, st, zorder=0.5)
    ax.contourf(f8.lon, f8.lat, f8.t.values - 273.15, levels=np.arange(-6, 16.1, 1), cmap=cs.cmap("cmocean.thermal"), alpha=0.85,
                transform=pc, zorder=1, extend="both")
    cs.fill_land(ax, land, st, color="#ffffff", alpha=0.07, zorder=2)
    cs.draw_lines(ax, coast, st, "coast", zorder=4)
    cs.draw_lines(ax, borders, st, "border", zorder=4)
    save_layer(fig, out / "wb_map_t850_base.png", st, False)

    def overlay(name: str, draw) -> dict:
        fig, ax, _ = cs.new_map(bbox, st, fit="frame")
        fig.canvas.draw()
        info = draw(fig, ax) or {}
        info["audit"] = cs.audit(fig, st)
        save_layer(fig, out / f"wb_map_t850_{name}.png", st, True)
        return info

    gold = st.colors["gold"]
    wf = np.stack([fr["warm_front"]["lon"], fr["warm_front"]["lat"]], -1)
    cf = np.stack([fr["cold_front"]["lon"], fr["cold_front"]["lat"]], -1)

    def lines(fig, ax):
        for xy in (wf, cf):
            ax.plot(xy[:, 0], xy[:, 1], color=gold, lw=st.px(st.line_px["front"]), transform=pc, zorder=8,
                    path_effects=cs.line_halo(st, st.line_px["front"]))
        return {}

    def line_one(xy):
        def draw(fig, ax):
            ax.plot(xy[:, 0], xy[:, 1], color=gold, lw=st.px(st.line_px["front"]), transform=pc, zorder=8,
                    path_effects=cs.line_halo(st, st.line_px["front"]))
            return {}
        return draw

    def symbols(fig, ax):
        used, boxes = cs.draw_fronts(ax, [("warm", wf), ("cold", cf)], st,
                                     temperature=(f8.lon.values, f8.lat.values, f8.t.values))
        return {"fronts_used": [list(u) if isinstance(u, (list, tuple)) else u for u in used]}

    def wind(fig, ax):
        sub = f8.sel(lat=slice(36, 60), lon=slice(-26, 8)).isel(lat=slice(None, None, 6), lon=slice(None, None, 6))
        ax.quiver(sub.lon.values, sub.lat.values, sub.u.values, sub.v.values, color="#2aa198", transform=pc, zorder=7,
                  scale=900, width=0.0028, headwidth=4, headlength=5)
        return {"arrows": int(sub.u.size)}

    def transect(fig, ax):
        tr = fr["transect"]
        ax.plot(tr["lon"], tr["lat"], color=gold, lw=st.px(7), transform=pc, zorder=9, path_effects=cs.line_halo(st, 7))
        return {}

    def masses(fig, ax):
        cs.label_area(ax, "tropical maritime", -12.0, 40.5, st, kind="region", spacing=0.0)
        cs.label_area(ax, "polar maritime", -20.0, 55.0, st, kind="region", spacing=0.0)
        return {}

    def places(fig, ax):
        c = fr["low_18"]
        rep_hl = cs.mark_extrema(ax, [{"kind": "low", "lon": c["lon"], "lat": c["lat"], "value": c["hPa"]}], st, value_fmt="")
        rep_pl = cs.label_points(ax, [cs.Place("Brest", -4.49, 48.39, -1)], st, obstacles=rep_hl.boxes)
        return {"places": [p[:2] for p in rep_pl.placed], "dropped": rep_pl.dropped}

    rep["t850"] = {"bbox": bbox, "projection": choice.name, "params": choice.params,
                   "layers": {"lines": overlay("lines", lines), "lines_warm": overlay("lines_warm", line_one(wf)), "lines_cold": overlay("lines_cold", line_one(cf)), "symbols": overlay("symbols", symbols), "wind": overlay("wind", wind),
                              "transect": overlay("transect", transect), "masses": overlay("masses", masses), "places": overlay("places", places)},
                   "data": "ERA5 850 hPa t, u, v 2023-11-01T18 (C3S); fronts fluidpy.diag.fronts.front_lines(locate='centre') (data/fronts.json); Natural Earth 50m",
                   "colour": "cmocean thermal −6…16 °C (colour bar drawn by the composition)",
                   "inputs_sha256": {"era5_850": sha(DER / "era5_ciaran_2023_850hPa_1h.nc"), "fronts.json": sha(DATA / "fronts.json")}}
    return rep


def brest_locator(out: Path) -> dict:
    """s36: Brittany relief (ETOPO 2022 60″, hillshade tint) with Brest, a scale bar and a locator inset."""
    import cartopy.crs as ccrs
    import cmocean
    from matplotlib.colors import LightSource
    st = cs.style("movie")
    st = replace(st, size_px=(900, 800), caption_band=None, content_box=(24, 24, 876, 776), max_place_labels=4)
    bbox = (-6.4, -1.2, 46.8, 49.2)
    pc = ccrs.PlateCarree()
    fig, ax, choice = cs.new_map(bbox, st, fit="frame")
    z = xr.open_dataset(RAW / "ETOPO2022-60s" / "etopo2022_60s_brittany_46.5-49.5N_-6.5--1E.nc").z
    ls = LightSource(azdeg=315, altdeg=45)
    zl = np.where(z.values < 0, 0, z.values)
    land_cmap = cmocean.tools.crop_by_percent(cmocean.cm.topo, 50, which="min")
    rgb = ls.shade(zl, cmap=land_cmap, vmin=0, vmax=600, blend_mode="soft", vert_exag=0.3)
    rgb[z.values < 0] = (0.16, 0.24, 0.36, 1)
    ax.imshow(rgb, extent=[float(z.lon[0]), float(z.lon[-1]), float(z.lat[0]), float(z.lat[-1])], origin="lower", transform=pc,
              regrid_shape=1600, interpolation="bilinear", zorder=0)
    big = (-8, 1, 45, 51)
    cs.draw_lines(ax, cs.natural_earth_layer(RAW / "NE-10m-admin/ne_10m_coastline.zip", big), st, "coast", zorder=4)
    sb = cs.scale_bar(ax, st, bbox)
    obst = [cs._bbox_px(fig, a, pad=16) for a in sb["artists"]] if sb else []
    rep = cs.label_points(ax, [cs.Place("Brest", -4.49, 48.39, -1)], st, obstacles=obst)
    audit = cs.audit(fig, st)
    save_layer(fig, out / "wb_map_brest.png", st, False)
    return {"brest": {"bbox": bbox, "projection": choice.name, "placed": rep.placed, "audit": audit,
                      "scale_bar": None if sb is None else {k: sb[k] for k in ("length_km", "lat", "variation")},
                      "data": "ETOPO 2022 60″ (NOAA NCEI, public domain); Natural Earth 10m"}}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", type=Path, required=True)
    a = ap.parse_args()
    rep = {}
    rep.update(sat_maps(a.out))
    rep.update(t850_maps(a.out))
    rep.update(brest_locator(a.out))
    rep["frame_px"] = [W, H]
    rep["files"] = {p.name: sha(p) for p in sorted(a.out.glob("wb_map_*.png"))}
    (a.out / "wb_maps.json").write_text(json.dumps(rep, indent=1, default=str), encoding="utf-8")
    print(json.dumps({k: (v.get("audit") if isinstance(v, dict) else None) for k, v in rep.items()}, default=str)[:1500])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
