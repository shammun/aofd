"""Fig. 21.23 analogue: Southern Ocean currents, gyres and fronts (our own drawing from open data).

Two panels on a south-polar stereographic map (30°S to the pole, 0° meridian at the top, 90°E to the right):

(a) our **schematic** currents (hand-drawn polylines in ``figs/ch21/so_currents.yaml``) over land, sea floor
    shallower than 3000 m, and the five Orsi et al. (1995) fronts of the Antarctic Circumpolar Current;
(b) the **observed** annual-mean near-surface velocity from the NOAA Global Drifter Program (speed in colour,
    streamlines for direction) with the same fronts and the 3000 m depth line.

Data (all redistributable; credit lines from ``data/registry.yaml``):
    NE-50m-land, NE-10m-bathy-3000 -- Natural Earth (public domain);
    FRONTS-orsi1995 -- Orsi et al. (1995) via the Australian Antarctic Data Centre (CC BY 4.0);
    CURR-gdp-annual -- NOAA GDP drifter climatology, Laurindo et al. (2017) (CC BY 4.0).
Reads the derived products ``data/derived/ch21/fig_21_23_*`` (``refresh=True`` rebuilds them through
``fluidpy.data``, the only route that downloads).
"""
from __future__ import annotations

import json
import subprocess
from pathlib import Path

import numpy as np

# ----------------------------------------------------------------------------------------------------------------
# Where things live (no absolute paths: everything is found relative to this file or the data root)
# ----------------------------------------------------------------------------------------------------------------
HERE = Path(__file__).resolve().parent                     # figs/ch21/
REPO = HERE.parents[1]                                      # the book repository root
DERIVED = REPO / "data" / "derived" / "ch21"                # small derived products committed with the repo
CURRENTS_YAML = HERE / "so_currents.yaml"                   # our own schematic current polylines
OUT_PNG = REPO / "outputs" / "ch21" / "fig_21_23.png"       # where `python fig_21_23.py` writes the figure

FRONTS = ("stf", "saf", "pf", "saccf", "sbdy")              # north to south
FRONT_NAMES = {"stf": "STF  Subtropical Front", "saf": "SAF  Subantarctic Front", "pf": "PF  Polar Front",
               "saccf": "SACCF  southern ACC Front", "sbdy": "SB  Southern Boundary of the ACC"}
FRONT_SHORT = {"stf": "STF", "saf": "SAF", "pf": "PF", "saccf": "SACCF", "sbdy": "SB"}
# Our own front styles (Okabe-Ito colours, colour-blind safe) plus distinct dash patterns, so the fronts can be told
# apart without colour too.
FRONT_STYLE = {"stf": dict(color="#E69F00", ls=(0, (6, 2)), lw=1.4),
               "saf": dict(color="#D55E00", ls="-", lw=1.5),
               "pf": dict(color="#0072B2", ls="-", lw=1.8),
               "saccf": dict(color="#009E73", ls=(0, (6, 2, 1.5, 2)), lw=1.4),
               "sbdy": dict(color="#CC79A7", ls=(0, (1.5, 1.5)), lw=1.6)}
# Where each front's tag is written (longitude, degE): staggered so the tags do not crowd each other.
FRONT_TAG_LON = {"stf": 75.0, "saf": 135.0, "pf": -150.0, "saccf": -100.0, "sbdy": -40.0}

# Map colours (ours): deep ocean almost white, shallow sea floor pale sand, land grey.
C_DEEP, C_SHALLOW, C_LAND = "#f3f6f8", "#e2d9b8", "#a3a3a3"
C_CURRENT = "#1f1f2e"                                       # near-black schematic current arrows

DATASET_KEYS = ["NE-50m-land", "NE-10m-bathy-3000", "FRONTS-orsi1995", "CURR-gdp-annual"]
CREDIT = ("Made with Natural Earth (public domain). ACC fronts: Orsi et al. (1995), via the Australian Antarctic "
          "Data Centre (CC BY 4.0). Drifter mean velocity: this study used data collected and made freely available "
          "by the NOAA Global Drifter Program (https://www.aoml.noaa.gov/phod/gdp/) accessed from "
          "https://erddap.aoml.noaa.gov/gdp/erddap/index.html; Laurindo et al. (2017), CC BY 4.0.")

CAPTION = (
    "Currents, gyres and fronts of the Southern Ocean, seen from above the South Pole (south-polar stereographic "
    "projection, 30°S to 90°S; the 0° meridian points up and 90°E to the right; dotted grid every 30° of longitude "
    "and 15° of latitude). (a) Our schematic of the main surface currents (black arrows, drawn by hand from "
    "published descriptions and the drifter data in (b)): the eastward Antarctic Circumpolar Current (ACC) between "
    "the Subantarctic and Polar Fronts, the cyclonic Weddell and Ross Gyres (clockwise as drawn, since we look down "
    "on the Southern Hemisphere), the Agulhas Current with its retroflection south of Africa and the Agulhas Return "
    "Current, the Brazil and Malvinas Currents meeting near 38°S, the southern limb of the anticyclonic South "
    "Atlantic subtropical gyre and the Benguela Current, the Leeuwin Current and the East Australian Current. Land "
    "is grey, sea floor shallower than 3000 m is sand-coloured (Natural Earth 1:10m 3000 m bathymetry band, sampled "
    "on a 0.25° grid). Coloured lines are the five ACC fronts of Orsi et al. (1995): Subtropical Front (STF), "
    "Subantarctic Front (SAF), Polar Front (PF), southern ACC Front (SACCF) and Southern Boundary (SB). (b) The "
    "observed annual-mean near-surface (15 m drogue) velocity from the NOAA Global Drifter Program climatology "
    "(Laurindo et al. 2017, version 3.10, drifter data 1979 to February 2023): speed in colour [m s⁻¹, 0.5° "
    "averages, saturating at 0.5 m s⁻¹], grey streamlines for direction (1° averages); blank where no drifter "
    "has been, mostly in the sea-ice zone south of about 65°S. Thin grey line: the 3000 m depth contour. Panel (a) "
    "is a schematic; panel (b) is an observation. Data: " + CREDIT)

READING_CARD = """\
How to read this figure (Fig. 21.23 analogue)
1. What is plotted: (a) a schematic of the main surface currents (arrows) with land, sea floor shallower than
   3000 m, and five observed ACC fronts; (b) the observed long-term mean near-surface velocity from drifting buoys,
   speed in m/s by colour, direction by streamlines. Time mean over all drifter data 1979 to early 2023; no anomalies.
2. Axes and projection: a map seen from above the South Pole (south-polar stereographic). The pole is the centre,
   the rim is 30°S; the 0° meridian points up, 90°E right, 180° down, 90°W left. Rings are 75°S, 60°S, 45°S.
   Looking down on the Southern Hemisphere, cyclonic circulation appears clockwise.
3. Encoding: in (b) colour = speed, white-yellow (slow) to dark green (fast), saturating at 0.5 m/s; streamlines
   show direction only. In both panels coloured lines are fronts (STF dashed orange, SAF vermilion, PF blue,
   SACCF dash-dot green, SB dotted pink); sand shading = shallower than 3000 m.
4. The one big feature: a single eastward current rings the whole continent, the ACC, guided by the fronts; it
   squeezes through Drake Passage (about 57-60°S, 65°W) where the drifters give a mean eastward speed of about
   0.2 m/s, and south of Africa (20°E) the Polar Front sits near 50°S and the Subantarctic Front near 47-48°S.
5. Physics: no continent blocks the latitude band of Drake Passage, so the westerly wind stress drives a flow that
   can go all the way round; it follows f/H contours, bending around ridges and plateaus (the fronts swerve at
   Kerguelen, the Campbell Plateau and the Scotia Arc). What would change if Drake Passage were closed? The ACC
   would be replaced by gyres closed by western boundary currents, much as in the other basins.
Where it comes from: (a) is our drawing (a schematic, not data) on top of Natural Earth topography and the Orsi
et al. (1995) fronts, which were mapped from ship hydrography; (b) is direct observation, averaged drifter
velocities, so it includes the wind-driven Ekman drift at 15 m and is noisy where few drifters passed.
"""


# ----------------------------------------------------------------------------------------------------------------
# Data loading (derived products only; refresh=True rebuilds them through fluidpy.data)
# ----------------------------------------------------------------------------------------------------------------
def _derived_dir() -> Path:
    """Folder holding the derived products: repo ``data/derived/ch21`` first, else ``<data root>/derived/ch21``."""
    if (DERIVED / "fig_21_23_fronts_orsi.npz").exists():
        return DERIVED
    from fluidpy.data import data_root                      # falls back to the G: data root (or Colab root)
    return data_root() / "derived" / "ch21"


def refresh_products() -> None:
    """Re-download (through the disk guard) and re-reduce the three derived products into the repo folder."""
    from fluidpy.data import fronts, gdp, naturalearth      # every download goes through fluidpy.data.fetch()
    DERIVED.mkdir(parents=True, exist_ok=True)
    fronts.orsi_fronts(out=DERIVED / "fig_21_23_fronts_orsi.npz")
    gdp.southern_ocean_mean_velocity(out=DERIVED / "fig_21_23_gdp_mean_velocity.nc")
    naturalearth.shallow_mask(3000, out=DERIVED / "fig_21_23_bathy3000_mask.nc")


def load_fronts() -> dict:
    """The five Orsi fronts as ``{name: (lon, lat)}``, NaN-separated polylines in degrees (lon −180…180)."""
    f = np.load(_derived_dir() / "fig_21_23_fronts_orsi.npz")
    return {n: (f[f"{n}_lon"].astype(float), f[f"{n}_lat"].astype(float)) for n in FRONTS}


def load_gdp():
    """GDP annual-mean surface velocity: xarray Dataset with U, V [m/s] on (lat S→N, lon −180…180), 0.25°."""
    import xarray as xr
    return xr.open_dataset(_derived_dir() / "fig_21_23_gdp_mean_velocity.nc").load()


def load_mask():
    """Depth classes on a 0.25° grid 90–30°S: 0 deeper than 3000 m, 1 shallower than 3000 m, 2 land."""
    import xarray as xr
    return xr.open_dataset(_derived_dir() / "fig_21_23_bathy3000_mask.nc").load()


def load_currents() -> list[dict]:
    """Our schematic currents from ``so_currents.yaml`` (list of dicts with points, arrows, labels, kind)."""
    import yaml
    return yaml.safe_load(CURRENTS_YAML.read_text(encoding="utf-8"))["currents"]


# ----------------------------------------------------------------------------------------------------------------
# Small numerical helpers (also used by the tests)
# ----------------------------------------------------------------------------------------------------------------
def _segments(lon: np.ndarray, lat: np.ndarray) -> list[tuple[np.ndarray, np.ndarray]]:
    """Split a NaN-separated polyline into pieces; also split where it jumps across the dateline (|Δlon| > 180°)."""
    out, start = [], 0
    breaks = np.where(np.isnan(lon) | np.isnan(lat))[0].tolist() + [len(lon)]
    for b in breaks:
        lo, la = lon[start:b], lat[start:b]
        start = b + 1
        if lo.size < 2:
            continue
        jumps = np.where(np.abs(np.diff(lo)) > 180)[0] + 1   # dateline jumps inside a piece
        for plo, pla in zip(np.split(lo, jumps), np.split(la, jumps)):
            if plo.size >= 2:
                out.append((plo, pla))
    return out


def front_lat_at(fronts: dict, name: str, lon: float) -> list[float]:
    """All latitudes [°N] where front ``name`` crosses the meridian ``lon`` [°E] (linear interpolation)."""
    lats = []
    for lo, la in _segments(*fronts[name]):
        for i in range(lo.size - 1):
            a, b = lo[i], lo[i + 1]
            if a != b and (a - lon) * (b - lon) <= 0:        # this piece of line straddles the meridian
                lats.append(float(la[i] + (lon - a) / (b - a) * (la[i + 1] - la[i])))
    return sorted(set(round(x, 3) for x in lats))


def box_mean(ds, var: str, lon: tuple[float, float], lat: tuple[float, float]) -> float:
    """Mean of ``var`` over a lon/lat box (degrees), ignoring cells with no drifter data."""
    return float(ds[var].sel(lon=slice(*lon), lat=slice(*lat)).mean(skipna=True))


def agulhas_retroflection(ds) -> dict:
    """Locate the Agulhas retroflection in the GDP field.

    On 1° box averages between 36°S and 40°S, the westward-flowing Agulhas reaches furthest west at the
    retroflection; ``tip_lon`` is the westernmost longitude (10–30°E) with U < −0.2 m/s. ``return_u`` is the
    strongest eastward U [m/s] just south (41–39°S, 17–25°E): the flow that has turned back east.
    """
    c = ds[["U", "V"]].coarsen(lat=4, lon=4, boundary="trim").mean()      # 0.25° → 1° box averages
    west = c["U"].sel(lat=slice(-40, -36), lon=slice(10, 30))
    lons = west["lon"].values[(west < -0.2).any("lat").values]
    ret = c["U"].sel(lat=slice(-41, -39), lon=slice(17, 25))
    return {"tip_lon": float(lons.min()) if lons.size else np.nan, "return_u": float(ret.max())}


def _densify(lon: np.ndarray, lat: np.ndarray, step: float = 0.5) -> tuple[np.ndarray, np.ndarray]:
    """Insert points every ``step`` degrees along a lon/lat polyline (lon unwrapped so it never jumps 360°)."""
    lon = np.rad2deg(np.unwrap(np.deg2rad(lon)))             # 179 → 181 instead of 179 → −179
    s = np.r_[0, np.cumsum(np.hypot(np.diff(lon), np.diff(lat)))]   # distance along the line in degrees
    t = np.linspace(0, s[-1], max(int(s[-1] / step), 2))
    return np.interp(t, s, lon), np.interp(t, s, lat)


def _chaikin(xy: np.ndarray, n: int = 3) -> np.ndarray:
    """Round off the corners of a polyline (Chaikin corner cutting, keeps both end points)."""
    for _ in range(n):
        q = 0.75 * xy[:-1] + 0.25 * xy[1:]
        r = 0.25 * xy[:-1] + 0.75 * xy[1:]
        xy = np.vstack([xy[:1], np.column_stack([q, r]).reshape(-1, 2), xy[-1:]])
    return xy


# ----------------------------------------------------------------------------------------------------------------
# Map pieces
# ----------------------------------------------------------------------------------------------------------------
def _setup_map(ax, ccrs) -> None:
    """Round south-polar map 30°S–90°S with dotted gridlines every 30° lon and 15° lat, and our own labels."""
    import matplotlib.path as mpath
    ax.set_extent([-180, 180, -90, -30], crs=ccrs.PlateCarree())
    theta = np.linspace(0, 2 * np.pi, 200)                  # a circle in axes coordinates = the 30°S rim
    circle = mpath.Path(np.column_stack([np.sin(theta), np.cos(theta)]) * 0.5 + 0.5)
    ax.set_boundary(circle, transform=ax.transAxes)
    ax.gridlines(xlocs=np.arange(-180, 181, 30), ylocs=[-75, -60, -45], color="0.45", lw=0.5, ls=":",
                 zorder=6)
    for lon in range(-150, 181, 30):                        # longitude labels just outside the rim
        txt = "0°" if lon == 0 else ("180°" if lon == 180 else f"{abs(lon)}°{'E' if lon > 0 else 'W'}")
        ax.text(lon, -26.8, txt, transform=ccrs.PlateCarree(), ha="center", va="center", fontsize=7.5,
                color="0.25", clip_on=False)
    for lat in (-45, -60, -75):                             # latitude labels along 210°E (150°W)
        ax.text(-145, lat + 1.2, f"{abs(lat)}°S", transform=ccrs.PlateCarree(), fontsize=6.5, color="0.35",
                ha="center", zorder=7)


def _draw_background(ax, ccrs, mask, shallow: bool = True) -> None:
    """Deep ocean / shallow sea floor / land as flat colours from the 0.25° depth-class mask."""
    from matplotlib.colors import ListedColormap
    cls = mask["depth_class"].values.astype(float)
    if not shallow:                                         # panel (b): only land is filled
        cls = np.where(cls == 2, 2.0, np.nan)
    cmap = ListedColormap([C_DEEP, C_SHALLOW, C_LAND])
    ax.pcolormesh(mask["lon"].values, mask["lat"].values, cls, cmap=cmap, vmin=-0.5, vmax=2.5,
                  transform=ccrs.PlateCarree(), shading="auto", rasterized=True, zorder=0)


def _draw_isobath(ax, ccrs, mask, color="0.45", lw=0.6) -> None:
    """Thin line along the 3000 m depth contour (boundary between the deep and shallow classes)."""
    from cartopy.util import add_cyclic_point
    deep = (mask["depth_class"].values == 0).astype(float)
    data, lon = add_cyclic_point(deep, coord=mask["lon"].values)
    ax.contour(lon, mask["lat"].values, data, levels=[0.5], colors=color, linewidths=lw,
               transform=ccrs.PlateCarree(), zorder=2)


def _draw_fronts(ax, ccrs, fronts, halo: bool = False) -> None:
    """The five Orsi fronts (projected ourselves, so dateline crossings never draw a stray line), with tags."""
    import matplotlib.patheffects as pe
    proj = ax.projection
    pc = ccrs.PlateCarree()
    eff = [pe.Stroke(linewidth=2.8, foreground="white", alpha=0.85), pe.Normal()] if halo else None
    for name in FRONTS:
        st = FRONT_STYLE[name]
        for lo, la in _segments(*fronts[name]):
            xy = proj.transform_points(pc, *_densify(lo, la, step=0.25))[:, :2]
            ax.plot(xy[:, 0], xy[:, 1], color=st["color"], ls=st["ls"], lw=st["lw"], zorder=4,
                    path_effects=eff)
        tag_lon = FRONT_TAG_LON[name]
        lats = front_lat_at(fronts, name, tag_lon)
        if lats:
            x, y = proj.transform_point(tag_lon, max(lats), pc)
            ax.text(x, y, FRONT_SHORT[name], fontsize=7, fontweight="bold", color=st["color"], ha="center",
                    va="center", zorder=8,
                    bbox=dict(boxstyle="round,pad=0.15", fc="white", ec=st["color"], lw=0.6, alpha=0.9))


def _draw_currents(ax, ccrs, currents) -> None:
    """Our schematic currents: smoothed polylines with arrowheads pointing downstream, and their labels."""
    proj = ax.projection
    pc = ccrs.PlateCarree()
    width = {"acc": 3.0, "gyre": 1.8, "boundary": 1.8}
    rim = proj.transform_point(0, -30, pc)[1]                           # map radius of the 30°S rim [m]
    for cur in currents:
        pts = np.asarray(cur["points"], float)
        lon, lat = _densify(pts[:, 0], pts[:, 1], step=1.0)            # follow parallels, not straight chords
        xy = _chaikin(proj.transform_points(pc, lon, lat)[:, :2])        # project to map metres, round corners
        lw = width[cur["kind"]]
        ax.plot(xy[:, 0], xy[:, 1], color=C_CURRENT, lw=lw, solid_capstyle="round", zorder=5)
        s = np.r_[0, np.cumsum(np.hypot(*np.diff(xy, axis=0).T))]        # length along the drawn line [m]
        for f in cur["arrows"]:
            i = int(np.clip(np.searchsorted(s, f * s[-1]), 2, len(s) - 1))
            if np.hypot(*xy[i]) > 0.985 * rim:                            # arrowheads are not clipped by the
                continue                                                  # round boundary: skip those outside
            ax.annotate("", xy=xy[i], xytext=xy[i - 2], zorder=6,
                        arrowprops=dict(arrowstyle="-|>", color=C_CURRENT, lw=0,
                                        mutation_scale=7 + 2.5 * lw, shrinkA=0, shrinkB=0))
        for text, llon, llat in cur["labels"]:
            x, y = proj.transform_point(llon, llat, pc)
            ax.text(x, y, text, fontsize=7.5, style="italic", color=C_CURRENT, ha="center", va="center",
                    zorder=8, bbox=dict(boxstyle="round,pad=0.12", fc="white", ec="none", alpha=0.75))


def _draw_gdp(ax, ccrs, gdp, vmax: float = 0.5):
    """Panel (b): drifter speed in colour (0.5° averages) and streamlines of direction (1° averages)."""
    import cmocean
    from matplotlib.axes import Axes
    from scipy.interpolate import RegularGridInterpolator
    pc = ccrs.PlateCarree()
    proj = ax.projection

    half = gdp[["U", "V"]].coarsen(lat=2, lon=2, boundary="trim").mean()  # 0.25° → 0.5°: less drifter noise
    speed = np.hypot(half["U"], half["V"])                                  # speed [m/s]
    pcm = ax.pcolormesh(half["lon"].values, half["lat"].values, speed.values, cmap=cmocean.cm.speed, vmin=0,
                        vmax=vmax, transform=pc, shading="auto", rasterized=True, zorder=1)

    # Streamlines are computed on a regular grid in map metres: rotate (U, V) to map axes, then sample.
    one = gdp[["U", "V"]].coarsen(lat=4, lon=4, boundary="trim").mean()   # 1° averages
    lon1, lat1 = np.meshgrid(one["lon"].values, one["lat"].values)
    ux, vy = proj.transform_vectors(pc, lon1, lat1, one["U"].values, one["V"].values)
    keep = np.hypot(ux, vy) > 1e-9                                         # transform_vectors rescales the
    norm = np.hypot(one["U"].values, one["V"].values)                      # arrows: restore true speed
    with np.errstate(invalid="ignore", divide="ignore"):
        scale = np.where(keep, norm / np.hypot(ux, vy), np.nan)
    ux, vy = ux * scale, vy * scale
    # pad one column on each side so sampling across the dateline works
    lonp = np.r_[one["lon"].values[-1] - 360, one["lon"].values, one["lon"].values[0] + 360]
    pad = lambda a: np.column_stack([a[:, -1], a, a[:, 0]])
    fx = RegularGridInterpolator((one["lat"].values, lonp), pad(ux), bounds_error=False, fill_value=np.nan)
    fy = RegularGridInterpolator((one["lat"].values, lonp), pad(vy), bounds_error=False, fill_value=np.nan)
    R = proj.transform_point(0, -30.5, pc)[1]                              # map radius of the 30°S rim [m]
    xg = np.linspace(-R, R, 260)
    X, Y = np.meshgrid(xg, xg)
    ll = pc.transform_points(proj, X, Y)                                   # lon/lat of every grid node
    q = np.column_stack([ll[..., 1].ravel(), ll[..., 0].ravel()])
    UX, VY = fx(q).reshape(X.shape), fy(q).reshape(X.shape)
    outside = np.hypot(X, Y) > R
    UX[outside] = np.nan
    VY[outside] = np.nan
    Axes.streamplot(ax, xg, xg, np.ma.masked_invalid(UX), np.ma.masked_invalid(VY), density=3.2,
                    color="0.15", linewidth=0.45, arrowsize=0.55, minlength=0.08, zorder=3)
    return pcm


# ----------------------------------------------------------------------------------------------------------------
# The figure
# ----------------------------------------------------------------------------------------------------------------
def make(ax=None, refresh: bool = False):
    """Fig. 21.23 analogue: Southern Ocean fronts and currents (our drawing from open data).

    Parameters
    ----------
    ax : pair of cartopy GeoAxes in ``SouthPolarStereo``, optional
        Where to draw panels (a) and (b). If None, a new 13 × 7.4 in figure is made.
    refresh : bool
        If True, rebuild the derived products first through ``fluidpy.data`` (downloads via the disk guard).

    Returns
    -------
    matplotlib.figure.Figure
        Data: NE (public domain), Orsi et al. 1995 fronts (AADC, CC-BY 4.0), GDP drifter climatology (CC-BY 4.0).
    """
    import cartopy.crs as ccrs
    import matplotlib.pyplot as plt
    from matplotlib.lines import Line2D
    from matplotlib.patches import Patch

    if refresh:
        refresh_products()
    fronts, gdp, mask, currents = load_fronts(), load_gdp(), load_mask(), load_currents()

    proj = ccrs.SouthPolarStereo()                           # central meridian 0°: 0° up, 90°E to the right
    if ax is None:
        fig = plt.figure(figsize=(13, 7.4))
        axa = fig.add_axes([0.015, 0.17, 0.445, 0.74], projection=proj)
        axb = fig.add_axes([0.535, 0.17, 0.445, 0.74], projection=proj)
    else:
        axa, axb = ax
        fig = axa.figure

    # ---- (a) schematic currents over topography and fronts ----
    _setup_map(axa, ccrs)
    _draw_background(axa, ccrs, mask, shallow=True)
    _draw_fronts(axa, ccrs, fronts)
    _draw_currents(axa, ccrs, currents)
    axa.set_title("(a) Schematic currents, gyres and fronts", fontsize=11, loc="left", pad=24)

    # ---- (b) observed drifter mean velocity with the same fronts ----
    _setup_map(axb, ccrs)
    axb.set_facecolor("white")
    pcm = _draw_gdp(axb, ccrs, gdp)
    _draw_background(axb, ccrs, mask, shallow=False)
    _draw_isobath(axb, ccrs, mask)
    _draw_fronts(axb, ccrs, fronts, halo=True)
    axb.set_title("(b) Observed mean surface flow (drifters)", fontsize=11, loc="left", pad=24)

    if ax is None:
        cax = fig.add_axes([0.645, 0.105, 0.22, 0.022])
        cb = fig.colorbar(pcm, cax=cax, orientation="horizontal", extend="max")
        cb.set_label("(b) drifter speed [m s$^{-1}$]", fontsize=8.5)
        cb.ax.tick_params(labelsize=8)
        handles = [Line2D([], [], label=FRONT_NAMES[n], color=FRONT_STYLE[n]["color"], ls=FRONT_STYLE[n]["ls"],
                          lw=FRONT_STYLE[n]["lw"]) for n in FRONTS]
        handles += [Line2D([], [], color=C_CURRENT, lw=2, marker=">", ms=5, label="(a) schematic current"),
                    Patch(fc=C_SHALLOW, ec="0.5", lw=0.4, label="(a) sea floor shallower than 3000 m"),
                    Line2D([], [], color="0.45", lw=0.8, label="(b) 3000 m depth contour"),
                    Patch(fc=C_LAND, ec="none", label="land")]
        fig.legend(handles=handles, loc="lower left", bbox_to_anchor=(0.04, 0.0), ncol=3, fontsize=7.8,
                   frameon=False, handlelength=2.6, columnspacing=1.4)
    return fig


def png_metadata() -> dict:
    """PNG text chunks: dataset keys, period, processing commits, synthetic flag, credit line."""
    try:
        commit = subprocess.run(["git", "-C", str(REPO), "rev-parse", "--short", "HEAD"], capture_output=True,
                                text=True, timeout=10).stdout.strip() or "no-git"
    except Exception:  # noqa: BLE001 - git missing is fine; we still record the data producer's commit
        commit = "no-git"
    try:
        producer = load_gdp().attrs.get("fluidpy_commit", "unknown")
    except Exception:  # noqa: BLE001
        producer = "unknown"
    return {"Title": "Fig. 21.23 analogue: Southern Ocean currents, gyres and fronts",
            "dataset_keys": json.dumps(DATASET_KEYS),
            "period": "GDP drifter climatology v3.10, drifter data 1979 to 2023-02; Orsi fronts 1995; NE static",
            "processing_commit": json.dumps({"book_repo": commit, "fluidpy_derived": producer}),
            "synthetic": "false", "Source": "figs/ch21/fig_21_23.py", "Copyright": CREDIT}


if __name__ == "__main__":
    OUT_PNG.parent.mkdir(parents=True, exist_ok=True)
    make().savefig(OUT_PNG, dpi=150, metadata=png_metadata())
    print(f"wrote {OUT_PNG} ({OUT_PNG.stat().st_size / 1e6:.2f} MB)")
