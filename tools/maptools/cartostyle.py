"""House cartographic style for aofd maps drawn with matplotlib + cartopy (movies, notebooks, print).

The rules live in ``.claude/skills/cartography/SKILL.md``; this module is the matplotlib/cartopy way to follow them.
Import it from a figure script, a movie data build or (opt-in) ``adapters/mpl_cartopy.py``.

Main entry points
-----------------
style(medium)                 -> CartoStyle   house defaults for "movie" (1920x1080 dark), "notebook" or "print"
apply_rc(st)                                   matplotlib rcParams (font stack, colours, line widths)
choose_projection(bbox, ...)  -> ProjectionChoice   projection by extent and purpose (conformal / equal-area)
new_map(bbox, st, ...)        -> (fig, ax, choice)  figure + GeoAxes filling the frame (no empty wedge corners)
natural_earth_scale(bbox)     -> "10m" | "50m" | "110m"
natural_earth_layer(zip, bbox) -> GeoJSON       any Natural Earth shapefile read from its zip and clipped
draw_lines(ax, geojson, st, kind)              coast / border / admin1 hierarchy (or any line layer)
fill_land(ax, geojson, st)                     land fill (or a translucent land veil above a field)
halo(st, size_px) / line_halo  -> [patheffects]  text halo scaled to the type size / line casing
wind_barbs(ax, lon, lat, u, v, st), barb_length  regridded WMO barbs with a true pixel shaft length
load_places(zip, bbox, ...)   -> list[Place]    Natural Earth populated places (English exonyms), ranked
label_points(ax, places, st, obstacles=...)    collision-free point labels (Imhof order, leader fallback) -> report
label_area(ax, text, lon, lat, st)             italic, letter-spaced water / region names
isobar_labels(ax, cs, st, obstacles=...)       in-line contour labels on straight stretches, upright, collision-free
find_extrema(lon, lat, field) / mark_extrema(ax, centres, st)  H / L letters with the central pressure
front_flip / draw_fronts(ax, fronts, st, temperature=...)  WMO/NWS front symbols (MetPy), symbols on the right side
scale_bar(ax, st, bbox, ...)                   a true-length bar in a free corner, refused when the scale varies
graticule(ax, st, ...)                         quiet graticule with nice steps
colorbar(fig, mappable, st, ...)               house-styled colour bar (ticks >= the type floor)
locator_inset(fig, bbox, st)                   small globe with the map's box
check_cmap(name) / cmap(name, st) / centered_limits   rainbow/jet/turbo refused; dark-page variants; diverging
audit(fig, st)                -> list[str]      pre-flight problems: small text, overlaps, text in the caption band
save(fig, path, st)                            deterministic PNG (no metadata)

All sizes are given in screen pixels of the final frame (movie) or in points (print); ``px(st, n)`` converts to
matplotlib points for the figure's DPI. Deterministic: no randomness, no network, no system clock.
"""
from __future__ import annotations

import io
import json
import math
import zipfile
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable, Sequence

import numpy as np

# ---------------------------------------------------------------------------------------------------------------
# 1. House presets
# ---------------------------------------------------------------------------------------------------------------

FONT_STACK = ["Segoe UI", "Helvetica Neue", "Arial", "DejaVu Sans"]   # = movies/src/house/palette.tsx HOUSE.font


@dataclass
class CartoStyle:
    """House cartographic defaults for one medium. Sizes ``*_px`` are pixels of the final image."""

    medium: str
    size_px: tuple[int, int]
    dpi: float
    bg: str                 # page / ocean background
    land: str               # land fill (figure-ground: one step lighter than the sea)
    ink: str                # main text
    ink_muted: str          # secondary text, ticks
    halo_color: str
    halo_alpha: float
    type_floor_px: float    # nothing smaller (movie: house floor 44 px at 1080p)
    type_px: dict = field(default_factory=dict)
    line_px: dict = field(default_factory=dict)
    colors: dict = field(default_factory=dict)
    max_place_labels: int = 8
    label_cell_px: tuple[int, int] = (480, 270)   # at most one place label per cell (density cap)
    caption_band: tuple[int, int] | None = None   # (y0, y1) pixels from the top that must stay empty
    content_box: tuple[int, int, int, int] | None = None  # x0, y0, x1, y1 (pixels from top-left) for labels

    def px(self, n: float) -> float:
        """Pixels of the final image -> matplotlib points."""
        return n * 72.0 / self.dpi


def style(medium: str = "movie") -> CartoStyle:
    """Return the house preset for ``medium`` in {"movie", "notebook", "print"}.

    movie     1920x1080 at dpi 100, house-dark-v1 colours (movies/HOUSE_STYLE.md §5), type floor 44 px.
    notebook  1600x1000 at dpi 160, light, type floor 13 px (on-screen notebook/web figure).
    print     180 mm x 120 mm at 300 dpi, light, type floor 6.5 pt (= 27 px).
    """
    m = medium.lower()
    if m == "movie":
        return CartoStyle(
            medium="movie", size_px=(1920, 1080), dpi=100.0,
            bg="#171f33", land="#2b3756", ink="#e8ecf4", ink_muted="#9aa6bd",
            halo_color="#0f1420", halo_alpha=0.85, type_floor_px=44,
            type_px={"hl": 120, "hl_value": 54, "place_1": 50, "place_2": 44, "contour": 44, "cbar": 52,
                     "graticule": 44, "scale": 44, "water": 46},
            line_px={"coast": 3.0, "border": 1.8, "admin1": 1.0, "contour": 2.6, "contour_major": 4.2,
                     "front": 5.0, "front_symbol": 26, "barb": 2.6, "graticule": 1.2, "marker": 14,
                     "halo_frac": 0.16, "scale": 4.0},
            colors={"coast": "#c9d2e3", "border": "#8f9bb3", "admin1": "#5f6b85", "contour": "#f4ecd2",
                    "graticule": "#3a4663", "barb": "#aab4c8", "low": "#ff7a8a", "high": "#7fb2ff",
                    "cold": "#5b9bff", "warm": "#ff5c5c", "occluded": "#c58cff", "trough": "#e8a33a",
                    "place": "#f4ecd2", "marker": "#f4ecd2", "water_label": "#8fb4d9", "gold": "#d8b23a"},
            max_place_labels=8, label_cell_px=(480, 270), caption_band=(880, 1040),
            content_box=(60, 40, 1860, 860),
        )
    if m == "notebook":
        return CartoStyle(
            medium="notebook", size_px=(1600, 1000), dpi=160.0,
            bg="#ffffff", land="#f1efe9", ink="#1d2433", ink_muted="#5b6577",
            halo_color="#ffffff", halo_alpha=0.85, type_floor_px=13 * 160 / 72 * 0.75,
            type_px={"hl": 64, "hl_value": 28, "place_1": 28, "place_2": 24, "contour": 22, "cbar": 24,
                     "graticule": 22, "scale": 22, "water": 24},
            line_px={"coast": 1.6, "border": 1.1, "admin1": 0.7, "contour": 1.6, "contour_major": 2.8,
                     "front": 3.2, "front_symbol": 16, "barb": 1.3, "graticule": 0.8, "marker": 8,
                     "halo_frac": 0.16, "scale": 3.0},
            colors={"coast": "#2b3240", "border": "#6b7385", "admin1": "#a0a7b5", "contour": "#1d2433",
                    "graticule": "#c9ced8", "barb": "#3d4a63", "low": "#c1121f", "high": "#1d4ed8",
                    "cold": "#1f4fd6", "warm": "#d62728", "occluded": "#7b2cbf", "trough": "#b5651d",
                    "place": "#1d2433", "marker": "#1d2433", "water_label": "#3d6fa3", "gold": "#a8841a"},
            max_place_labels=14, label_cell_px=(320, 200),
        )
    if m == "print":
        dpi = 300.0
        pt = dpi / 72.0          # 1 pt in pixels
        return CartoStyle(
            medium="print", size_px=(int(180 / 25.4 * dpi), int(120 / 25.4 * dpi)), dpi=dpi,
            bg="#ffffff", land="#f1efe9", ink="#1d2433", ink_muted="#5b6577",
            halo_color="#ffffff", halo_alpha=0.85, type_floor_px=6.5 * pt,
            type_px={"hl": 16 * pt, "hl_value": 7.5 * pt, "place_1": 8 * pt, "place_2": 7 * pt,
                     "contour": 6.5 * pt, "cbar": 7 * pt, "graticule": 6.5 * pt, "scale": 6.5 * pt,
                     "water": 7.5 * pt},
            line_px={"coast": 0.5 * pt, "border": 0.35 * pt, "admin1": 0.25 * pt, "contour": 0.6 * pt,
                     "contour_major": 1.0 * pt, "front": 1.2 * pt, "front_symbol": 5 * pt, "barb": 0.4 * pt,
                     "graticule": 0.25 * pt, "marker": 2.2 * pt, "halo_frac": 0.16, "scale": 1.0 * pt},
            colors={"coast": "#2b3240", "border": "#6b7385", "admin1": "#a0a7b5", "contour": "#1d2433",
                    "graticule": "#c9ced8", "barb": "#3d4a63", "low": "#c1121f", "high": "#1d4ed8",
                    "cold": "#1f4fd6", "warm": "#d62728", "occluded": "#7b2cbf", "trough": "#b5651d",
                    "place": "#1d2433", "marker": "#1d2433", "water_label": "#3d6fa3", "gold": "#a8841a"},
            max_place_labels=14, label_cell_px=(400, 260),
        )
    raise ValueError(f"unknown medium {medium!r}: movie | notebook | print")


def px(st: CartoStyle, n: float) -> float:
    """Pixels of the final image -> matplotlib points for ``st.dpi``."""
    return st.px(n)


def apply_rc(st: CartoStyle) -> None:
    """Set matplotlib rcParams for the house look (font stack, text colour, no PNG metadata hash salt)."""
    import matplotlib

    matplotlib.rcParams.update({
        "font.family": "sans-serif", "font.sans-serif": FONT_STACK, "svg.hashsalt": "aofd",
        "path.simplify": False, "text.color": st.ink, "axes.labelcolor": st.ink,
        "xtick.color": st.ink_muted, "ytick.color": st.ink_muted, "figure.facecolor": st.bg,
        "axes.facecolor": st.bg, "savefig.facecolor": st.bg, "axes.unicode_minus": True,
    })


def halo(st: CartoStyle, size_px: float | None = None, color: str | None = None, alpha: float | None = None):
    """Path effects for a text halo (a stroke behind the glyphs), width ~16 % of the type size.

    Like a thin outline cut from the background: it separates text from busy lines without a box.
    """
    import matplotlib.patheffects as pe

    size_px = size_px or st.type_px["place_2"]
    w = max(st.line_px["halo_frac"] * size_px, 2.0 if st.medium == "movie" else 1.0)
    return [pe.withStroke(linewidth=st.px(w), foreground=color or st.halo_color,
                          alpha=st.halo_alpha if alpha is None else alpha)]


def line_halo(st: CartoStyle, width_px: float, extra_px: float = 3.0, color: str | None = None):
    """Casing for a line (drawn under it) so it stands out over a field: stroke + normal."""
    import matplotlib.patheffects as pe

    return [pe.Stroke(linewidth=st.px(width_px + 2 * extra_px), foreground=color or st.halo_color,
                      alpha=st.halo_alpha), pe.Normal()]


def barb_length(st: CartoStyle, shaft_px: float) -> float:
    """matplotlib ``barbs(length=...)`` that gives a shaft of ``shaft_px`` pixels.

    Pitfall: the drawn barb grows with length**2 (measured at dpi 100: length 7 -> 39 px, 9 -> 64 px,
    33 -> 500 px), so "length in points" is not a length. Calibrated: shaft_px = 0.573 * length**2 * dpi / 72.
    """
    return math.sqrt(shaft_px / (0.573 * st.dpi / 72.0))


def wind_barbs(ax, lon, lat, u_kt, v_kt, st: CartoStyle, shaft_px: float | None = None,
               regrid: tuple[int, int] | None = None, zorder: float = 5, **kw):
    """WMO wind barbs in knots (half barb 5, full barb 10, pennant 50; the staff points to where the wind comes
    from) on an even grid in the projected plane (cartopy ``regrid_shape``), muted so the isobars lead."""
    import cartopy.crs as ccrs

    shaft_px = shaft_px or (58 if st.medium == "movie" else 0.03 * st.size_px[0])
    regrid = regrid or ((15, 8) if st.medium == "movie" else (24, 15))
    return ax.barbs(np.asarray(lon), np.asarray(lat), np.asarray(u_kt), np.asarray(v_kt),
                    transform=ccrs.PlateCarree(), regrid_shape=regrid, length=barb_length(st, shaft_px),
                    linewidth=st.px(st.line_px["barb"]), color=kw.pop("color", st.colors["barb"]), zorder=zorder,
                    sizes={"emptybarb": 0.0}, **kw)


# ---------------------------------------------------------------------------------------------------------------
# 2. Colour
# ---------------------------------------------------------------------------------------------------------------

_BANNED = ("jet", "rainbow", "hsv", "nipy", "gist_ncar", "turbo", "gist_rainbow", "spectral", "prism", "flag")

HOUSE_CMAPS = {
    "pressure": "cmocean.dense_r",    # light page: low pressure = dark violet (the storm stands out on white)
    "pressure_dark": "cmocean.ice_r", # dark page: low pressure = bright ice, high = navy that melts into the page
    "temperature": "cmocean.thermal",
    "anomaly": "cmocean.balance",     # diverging, centre on zero
    "precipitation": "cmocean.rain",
    "speed": "cmocean.speed",
    "topography": "cmocean.topo",     # diverging at sea level
    "depth": "cmocean.deep",
    "sst": "cmocean.thermal",
    "default": "viridis",
}


def _is_dark(hex_color: str) -> bool:
    import matplotlib.colors as mc

    r, g, b = mc.to_rgb(hex_color)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.4


def check_cmap(name: str) -> str:
    """Raise ValueError for rainbow-family colour maps (CLAUDE.md rule 5; Crameri et al. 2020)."""
    if any(b in name.lower() for b in _BANNED):
        raise ValueError(f"colour map {name!r} is banned (rainbow family); use cmocean or viridis")
    return name


def cmap(name: str, st: CartoStyle | None = None):
    """Colour map object from a house key ("anomaly"), "cmocean.X" or a matplotlib name; rainbow refused.

    With a dark style ``st``, a key that has a ``<key>_dark`` variant uses it (the emphasised end of the ramp
    must be the bright end on a dark page)."""
    import matplotlib

    if st is not None and _is_dark(st.bg) and f"{name}_dark" in HOUSE_CMAPS:
        name = f"{name}_dark"
    name = HOUSE_CMAPS.get(name, name)
    check_cmap(name)
    if name.startswith("cmocean."):
        import cmocean

        base = name.split(".", 1)[1]
        rev = base.endswith("_r")
        cm = getattr(cmocean.cm, base[:-2] if rev else base)
        return cm.reversed() if rev else cm
    return matplotlib.colormaps[name]


def centered_limits(values, center: float = 0.0, q: float = 0.98) -> tuple[float, float]:
    """Symmetric (vmin, vmax) about ``center`` from the q-quantile of |values - center| (diverging maps)."""
    a = np.abs(np.asarray(values, dtype=float) - center)
    a = a[np.isfinite(a)]
    r = float(np.quantile(a, q)) if a.size else 1.0
    return center - r, center + r


# ---------------------------------------------------------------------------------------------------------------
# 3. Projection by extent
# ---------------------------------------------------------------------------------------------------------------

@dataclass
class ProjectionChoice:
    name: str
    params: dict
    reason: str

    def crs(self):
        import cartopy.crs as ccrs

        p = self.params
        if self.name == "equal_earth":
            return ccrs.EqualEarth(central_longitude=p.get("lon0", 0))
        if self.name == "robinson":
            return ccrs.Robinson(central_longitude=p.get("lon0", 0))
        if self.name == "lambert_conformal":
            return ccrs.LambertConformal(central_longitude=p["lon0"], central_latitude=p["lat0"],
                                         standard_parallels=tuple(p["parallels"]))
        if self.name == "albers":
            return ccrs.AlbersEqualArea(central_longitude=p["lon0"], central_latitude=p["lat0"],
                                        standard_parallels=tuple(p["parallels"]))
        if self.name == "polar_stereographic":
            if p["lat0"] > 0:
                return ccrs.NorthPolarStereo(central_longitude=p["lon0"], true_scale_latitude=p.get("lat_ts", 60))
            return ccrs.SouthPolarStereo(central_longitude=p["lon0"], true_scale_latitude=p.get("lat_ts", -60))
        if self.name == "laea":
            return ccrs.LambertAzimuthalEqualArea(central_longitude=p["lon0"], central_latitude=p["lat0"])
        if self.name == "mercator":
            return ccrs.Mercator(central_longitude=p["lon0"], latitude_true_scale=p.get("lat_ts", 0))
        if self.name == "cylindrical_equal_area":
            return ccrs.LambertCylindrical(central_longitude=p["lon0"])
        if self.name == "orthographic":
            return ccrs.Orthographic(central_longitude=p["lon0"], central_latitude=p["lat0"])
        if self.name == "platecarree":
            return ccrs.PlateCarree(central_longitude=p.get("lon0", 0))
        raise ValueError(self.name)


def choose_projection(bbox: Sequence[float] | str, purpose: str = "conformal") -> ProjectionChoice:
    """Projection for a map extent (Snyder 1987; Jenny 2012 adaptive composite projections).

    Parameters
    ----------
    bbox : (lon0, lon1, lat0, lat1) in degrees, or "global".
    purpose : "conformal" (weather charts, flow, fronts, isobars: shapes and angles true),
              "equal_area" (climatologies, totals, anything compared by area), "globe" (orthographic look).

    Rules
    -----
    - global (lon span >= 300 deg or lat span >= 150 deg, not polar): Equal Earth (equal-area, Šavrič et al.
      2019) for every purpose: no world projection is usefully conformal, so the notes must say shapes are bent.
    - polar (the box reaches beyond 65 deg and its centre is beyond 55 deg): polar stereographic (conformal)
      or polar Lambert azimuthal equal-area.
    - tropical (|lat| <= 25 deg throughout): Mercator (conformal) or cylindrical equal-area.
    - continental / hemispheric (lon span > 100 deg): Lambert azimuthal equal-area centred on the box
      (both purposes; conformal conics break down that wide).
    - mid-latitudes otherwise: Lambert conformal conic (conformal) or Albers (equal-area), standard parallels at
      1/6 and 5/6 of the latitude range (Deetz & Adams rule of thumb).
    - "globe": orthographic centred on the box.
    """
    if isinstance(bbox, str):
        if bbox != "global":
            raise ValueError(bbox)
        bbox = (-180.0, 180.0, -90.0, 90.0)
    lon0, lon1, lat0, lat1 = map(float, bbox)
    if lon1 < lon0:
        lon1 += 360.0
    dlon, dlat = lon1 - lon0, lat1 - lat0
    clon = ((lon0 + lon1) / 2 + 180) % 360 - 180
    clat = (lat0 + lat1) / 2
    if purpose == "globe":
        return ProjectionChoice("orthographic", {"lon0": clon, "lat0": clat}, "globe look requested")
    one_hemisphere = lat0 >= 0 or lat1 <= 0
    polar = one_hemisphere and ((max(abs(lat0), abs(lat1)) >= 65 and abs(clat) >= 55)
                                or lat1 >= 89.9 or lat0 <= -89.9)
    if not polar and (dlon >= 300 or dlat >= 150):
        return ProjectionChoice("equal_earth", {"lon0": 0.0 if dlon >= 359 else clon},
                                "global extent: Equal Earth (equal-area; no conformal world map exists without "
                                "huge area distortion)")
    if polar:
        hemi = 90.0 if clat > 0 else -90.0
        if purpose == "equal_area":
            return ProjectionChoice("laea", {"lon0": clon, "lat0": hemi}, "polar extent, equal-area: polar LAEA")
        return ProjectionChoice("polar_stereographic", {"lon0": clon, "lat0": hemi,
                                                        "lat_ts": 60.0 if hemi > 0 else -60.0},
                                "polar extent, conformal: polar stereographic (WMO practice)")
    if max(abs(lat0), abs(lat1)) <= 25:
        if purpose == "equal_area":
            return ProjectionChoice("cylindrical_equal_area", {"lon0": clon}, "tropical extent, equal-area")
        return ProjectionChoice("mercator", {"lon0": clon, "lat_ts": 0.0},
                                "tropical extent, conformal: Mercator (WMO practice near the equator)")
    if dlon > 100:
        return ProjectionChoice("laea", {"lon0": clon, "lat0": clat},
                                "continental/hemispheric extent: Lambert azimuthal equal-area centred on the box")
    sp = (lat0 + dlat / 6.0, lat1 - dlat / 6.0)
    if purpose == "equal_area":
        return ProjectionChoice("albers", {"lon0": clon, "lat0": clat, "parallels": sp},
                                "mid-latitude extent, equal-area: Albers conic, parallels at 1/6 and 5/6")
    return ProjectionChoice("lambert_conformal", {"lon0": clon, "lat0": clat, "parallels": sp},
                            "mid-latitude extent, conformal: Lambert conformal conic, parallels at 1/6 and 5/6")


def natural_earth_scale(bbox: Sequence[float] | str, width_px: int = 1920) -> str:
    """Natural Earth level of detail for an extent shown ``width_px`` wide: "10m", "50m" or "110m".

    Rule: about 1:10m when the map shows < ~25 deg of longitude per 1920 px, 1:50m up to ~110 deg, else 1:110m.
    """
    if isinstance(bbox, str):
        return "110m"
    lon0, lon1, lat0, lat1 = bbox
    span = (lon1 - lon0) % 360 or 360
    deg_per_1920 = span * 1920.0 / width_px
    if deg_per_1920 < 25:
        return "10m"
    if deg_per_1920 <= 110:
        return "50m"
    return "110m"


def scale_factor_range(crs, bbox: Sequence[float], n: int = 15) -> tuple[float, float]:
    """(min, max) point scale factor (sqrt(areal) for equal-area, else meridional) of ``crs`` over ``bbox``."""
    from pyproj import CRS, Proj

    lon0, lon1, lat0, lat1 = bbox
    pj = Proj(CRS.from_user_input(crs.proj4_init))
    lo, la = np.meshgrid(np.linspace(lon0, lon1, n), np.linspace(lat0, lat1, n))
    f = pj.get_factors(lo.ravel(), la.ravel())
    k = np.sqrt(np.asarray(f.meridional_scale) * np.asarray(f.parallel_scale))
    k = k[np.isfinite(k)]
    return float(k.min()), float(k.max())


# ---------------------------------------------------------------------------------------------------------------
# 4. Figure and base layers
# ---------------------------------------------------------------------------------------------------------------

def new_map(bbox: Sequence[float], st: CartoStyle, choice: ProjectionChoice | None = None,
            purpose: str = "conformal", frame: bool = False, fill_frame: bool = True, fit: str = "frame"):
    """Figure + GeoAxes at the house size; the projected extent is widened to the frame's aspect.

    ``fill_frame=True`` sets a rectangular extent in projected coordinates with the figure's aspect ratio, so a
    conic map has no empty wedge corners and no side bars (the data must cover the widened box: fetch a
    margin). ``fit="frame"`` fits ``bbox`` to the whole frame (the map bleeds under the movie caption band;
    labels still avoid the band); ``fit="content"`` fits it inside the style's content box (movie x 60-1860,
    y 40-860), which zooms out by ~25 %. Returns (fig, ax, choice).
    """
    import cartopy.crs as ccrs
    import matplotlib.pyplot as plt

    apply_rc(st)
    choice = choice or choose_projection(bbox, purpose)
    crs = choice.crs()
    W, H = st.size_px
    fig = plt.figure(figsize=(W / st.dpi, H / st.dpi), dpi=st.dpi, facecolor=st.bg)
    ax = fig.add_axes([0, 0, 1, 1], projection=crs)
    ax.set_facecolor(st.bg)
    if not frame:
        ax.spines["geo"].set_visible(False)
    else:
        ax.spines["geo"].set_edgecolor(st.ink_muted)
        ax.spines["geo"].set_linewidth(st.px(1.5))
    lon0, lon1, lat0, lat1 = bbox
    if not fill_frame:
        ax.set_extent([lon0, lon1, lat0, lat1], crs=ccrs.PlateCarree())
        return fig, ax, choice
    lo = np.concatenate([np.linspace(lon0, lon1, 60), np.full(60, lon1), np.linspace(lon1, lon0, 60), np.full(60, lon0)])
    la = np.concatenate([np.full(60, lat0), np.linspace(lat0, lat1, 60), np.full(60, lat1), np.linspace(lat1, lat0, 60)])
    xy = crs.transform_points(ccrs.PlateCarree(), lo, la)[:, :2]
    x0, x1 = np.nanmin(xy[:, 0]), np.nanmax(xy[:, 0])
    y0, y1 = np.nanmin(xy[:, 1]), np.nanmax(xy[:, 1])
    cb = (st.content_box or (0, 0, W, H)) if fit == "content" else (0, 0, W, H)
    fx0, fx1 = cb[0] / W, cb[2] / W              # target box as fractions (x from left, y from top)
    fy0, fy1 = cb[1] / H, cb[3] / H
    w, h = x1 - x0, y1 - y0
    Wt = max(w / (fx1 - fx0), h / (fy1 - fy0) * W / H)   # total projected width so the bbox fits the box
    Ht = Wt * H / W
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    ex0 = cx - (fx0 + fx1) / 2 * Wt
    etop = cy + (fy0 + fy1) / 2 * Ht
    ax.set_extent([ex0, ex0 + Wt, etop - Ht, etop], crs=crs)
    return fig, ax, choice


def _lines_from_geojson(gj) -> list[np.ndarray]:
    if isinstance(gj, (str, Path)):
        gj = json.loads(Path(gj).read_text(encoding="utf-8"))
    out = []

    def add(geom):
        t, c = geom["type"], geom["coordinates"]
        if t == "LineString":
            out.append(np.asarray(c, float)[:, :2])
        elif t == "MultiLineString":
            out.extend(np.asarray(x, float)[:, :2] for x in c)
        elif t == "Polygon":
            out.extend(np.asarray(r, float)[:, :2] for r in c)
        elif t == "MultiPolygon":
            out.extend(np.asarray(r, float)[:, :2] for p in c for r in p)
        elif t == "GeometryCollection":
            for g in geom["geometries"]:
                add(g)

    feats = gj["features"] if gj.get("type") == "FeatureCollection" else [gj]
    for f in feats:
        add(f["geometry"] if "geometry" in f else f)
    return out


def natural_earth_layer(zip_path: str | Path, bbox: Sequence[float], margin: float = 2.0) -> dict:
    """Read a Natural Earth shapefile straight from its zip and clip it to ``bbox`` (+ margin) -> GeoJSON dict.

    Pick the zip by :func:`natural_earth_scale` (ne_10m_*, ne_50m_*, ne_110m_*) from the G: raw store.
    """
    import shapefile
    import shapely.geometry as sg

    z = zipfile.ZipFile(zip_path)
    stem = next(n[:-4] for n in z.namelist() if n.endswith(".shp"))
    r = shapefile.Reader(shp=io.BytesIO(z.read(stem + ".shp")), shx=io.BytesIO(z.read(stem + ".shx")),
                         dbf=io.BytesIO(z.read(stem + ".dbf")), encoding="utf-8")
    lon0, lon1, lat0, lat1 = bbox
    box = sg.box(lon0 - margin, lat0 - margin, lon1 + margin, lat1 + margin)
    feats = []
    for shp in r.iterShapes():
        if not shp.points:
            continue
        b = shp.bbox
        if b[2] < box.bounds[0] or b[0] > box.bounds[2] or b[3] < box.bounds[1] or b[1] > box.bounds[3]:
            continue
        g = sg.shape(shp.__geo_interface__)
        if not g.is_valid:
            g = g.buffer(0)
        c = g.intersection(box)
        if not c.is_empty:
            feats.append({"type": "Feature", "properties": {}, "geometry": sg.mapping(c)})
    return {"type": "FeatureCollection", "features": feats}


def draw_lines(ax, geojson, st: CartoStyle, kind: str = "coast", zorder: float = 4, **kw):
    """Draw a line layer with the house hierarchy: coast > border (dashed) > admin1 (dotted, faint).

    Uses one LineCollection (fast, deterministic). ``kind`` in {"coast", "border", "admin1"} or pass color/lw.
    """
    import cartopy.crs as ccrs
    from matplotlib.collections import LineCollection

    style = {"coast": dict(ls="-", alpha=1.0), "border": dict(ls=(0, (4, 2.5)), alpha=0.9),
             "admin1": dict(ls=(0, (1, 2)), alpha=0.7)}.get(kind, dict(ls="-", alpha=1.0))
    col = kw.pop("color", st.colors.get(kind, st.ink_muted))
    lw = kw.pop("lw", st.line_px.get(kind, 1.0))
    segs = _lines_from_geojson(geojson)
    pc = ccrs.PlateCarree()
    proj = [ax.projection.transform_points(pc, s[:, 0], s[:, 1])[:, :2] for s in segs if len(s) > 1]
    lc = LineCollection(proj, colors=col, linewidths=st.px(lw), linestyles=style["ls"], alpha=style["alpha"],
                        zorder=zorder, capstyle="round", joinstyle="round", **kw)
    ax.add_collection(lc)
    return lc


def fill_land(ax, geojson, st: CartoStyle, color: str | None = None, zorder: float = 0.5, alpha: float = 1.0):
    """Land polygons as a quiet fill one step lighter than the sea (figure-ground).

    Under a translucent field the land step is lost; then also call it above the field as a "veil"
    (e.g. ``color="#ffffff", alpha=0.07, zorder=2`` on a dark page) so land still reads as figure."""
    import cartopy.crs as ccrs
    import shapely.geometry as sg

    gj = json.loads(Path(geojson).read_text(encoding="utf-8")) if isinstance(geojson, (str, Path)) else geojson
    geoms = [sg.shape(f["geometry"]) for f in gj["features"]]
    return ax.add_geometries(geoms, crs=ccrs.PlateCarree(), facecolor=color or st.land, edgecolor="none",
                             zorder=zorder, alpha=alpha)


# ---------------------------------------------------------------------------------------------------------------
# 5. Places and point labels
# ---------------------------------------------------------------------------------------------------------------

@dataclass
class Place:
    name: str
    lon: float
    lat: float
    rank: float = 0.0           # lower = more important
    kind: str = "city"          # city | capital | water | region | feature
    size_key: str | None = None


def load_places(zip_path: str | Path, bbox: Sequence[float], max_scalerank: int = 3, min_pop: float = 0,
                capitals_first: bool = True, exclude: Iterable[str] = ()) -> list[Place]:
    """Natural Earth populated places (1:10m "simple" zip) inside ``bbox``, ranked for labelling.

    Uses the ``name`` field (Natural Earth's English-language exonyms for major cities: Munich, Lisbon, Naples) and
    falls back to ``nameascii``; rank = scalerank, then capitals, then population (Natural Earth: "Made with
    Natural Earth", public domain). Reads the shapefile straight from the zip (no extraction).
    """
    import shapefile   # pyshp, a cartopy dependency

    z = zipfile.ZipFile(zip_path)
    stem = next(n[:-4] for n in z.namelist() if n.endswith(".shp"))
    r = shapefile.Reader(shp=io.BytesIO(z.read(stem + ".shp")), dbf=io.BytesIO(z.read(stem + ".dbf")),
                         encoding="utf-8")
    lon0, lon1, lat0, lat1 = bbox
    ex = {e.lower() for e in exclude}
    out = []
    for rec in r.records():
        d = rec.as_dict()
        lo, la = float(d["longitude"]), float(d["latitude"])
        if not (lon0 <= lo <= lon1 and lat0 <= la <= lat1):
            continue
        if d["scalerank"] > max_scalerank or (d["pop_max"] or 0) < min_pop:
            continue
        name = d.get("name") or d.get("nameascii")
        if name.lower() in ex:
            continue
        cap = "Admin-0 capital" in (d.get("featurecla") or "")
        rank = d["scalerank"] - (0.5 if (cap and capitals_first) else 0.0) - 1e-9 * (d["pop_max"] or 0)
        out.append(Place(name=name, lon=lo, lat=la, rank=rank, kind="capital" if cap else "city"))
    out.sort(key=lambda p: (p.rank, p.name))
    return out


# Imhof (1975) / Yoeli (1972) order of preference for a label around its point: upper right first, then
# lower right, upper left, lower left, then right, left, above, below.
IMHOF_POSITIONS = [("NE", 1, 1), ("SE", 1, -1), ("NW", -1, 1), ("SW", -1, -1),
                   ("E", 1, 0), ("W", -1, 0), ("N", 0, 1), ("S", 0, -1)]


def _bbox_px(fig, artist, pad: float = 0.0):
    """Window extent of an artist in pixels from the top-left as (x0, y0, x1, y1)."""
    r = fig.canvas.get_renderer()
    b = artist.get_window_extent(r)
    H = fig.bbox.height
    return (b.x0 - pad, H - b.y1 - pad, b.x1 + pad, H - b.y0 + pad)


def _text_box(fig, t, pad: float = 0.0):
    """Box of a Text/Annotation's text only (an annotation's window extent includes its leader line)."""
    from matplotlib.text import Text

    r = fig.canvas.get_renderer()
    if hasattr(t, "update_positions"):      # an Annotation places its text only at draw time
        t.update_positions(r)
    b = Text.get_window_extent(t, r)
    H = fig.bbox.height
    return (b.x0 - pad, H - b.y1 - pad, b.x1 + pad, H - b.y0 + pad)


def _overlap(a, b) -> bool:
    return not (a[2] <= b[0] or b[2] <= a[0] or a[3] <= b[1] or b[3] <= a[1])


def _inside(a, box) -> bool:
    return a[0] >= box[0] and a[1] >= box[1] and a[2] <= box[2] and a[3] <= box[3]


def frame_obstacles(st: CartoStyle) -> list[tuple]:
    """Areas labels must avoid for a medium (the movie caption band)."""
    W, H = st.size_px
    obs = []
    if st.caption_band:
        obs.append((0, st.caption_band[0], W, H))
    return obs


@dataclass
class LabelReport:
    placed: list = field(default_factory=list)      # (name, position, bbox)
    dropped: list = field(default_factory=list)     # (name, reason)
    boxes: list = field(default_factory=list)       # all bboxes occupied (for the next layer)


def label_points(ax, places: Sequence[Place], st: CartoStyle, obstacles: Sequence[tuple] = (),
                 max_labels: int | None = None, marker: bool = True, offset_px: float | None = None,
                 cell_px: tuple[int, int] | None = None, size_key: str | None = None,
                 label_obstacles: Sequence[tuple] = (), leader: bool | None = None) -> LabelReport:
    """Place point labels without collisions (greedy, in priority order, Imhof candidate positions).

    Each place gets a dot (with a halo) and a name tried at NE, SE, NW, SW, E, W, N, S. A position is accepted
    when its box (plus the halo) is inside the content box, does not touch any obstacle (H/L letters, contour
    labels, colour bar, caption band, already placed labels and dots) and its cell of the density grid
    (``cell_px``) holds no other label. ``label_obstacles`` (e.g. the boxes along fronts) block only the
    names, not the dots. When no position next to the dot is free, places with ``leader=True`` (default: places
    with rank < 0, i.e. promoted story places) are tried further out with a thin leader line (a callout).
    Places that still do not fit are dropped and reported, never forced.
    Obstacles and the returned ``boxes`` are (x0, y0, x1, y1) in pixels from the top-left of the figure.
    """
    import cartopy.crs as ccrs

    fig = ax.figure
    fig.canvas.draw()   # fixes the transforms before measuring
    pc = ccrs.PlateCarree()
    W, H = st.size_px
    content = st.content_box or (8, 8, W - 8, H - 8)
    cell = cell_px or st.label_cell_px
    max_labels = st.max_place_labels if max_labels is None else max_labels
    occupied = list(obstacles) + frame_obstacles(st)
    cells: set = set()
    rep = LabelReport()
    for p in sorted(places, key=lambda q: q.rank):
        if len(rep.placed) >= max_labels:
            rep.dropped.append((p.name, "label budget reached"))
            continue
        key = p.size_key or size_key or ("place_1" if p.kind == "capital" or p.rank < 1 else "place_2")
        size = st.type_px[key]
        xy = ax.projection.transform_point(p.lon, p.lat, pc)
        dx, dy = ax.transData.transform(xy)
        ytop = H - dy
        if not (content[0] <= dx <= content[2] and content[1] <= ytop <= content[3]):
            rep.dropped.append((p.name, "point outside the content box"))
            continue
        mr = st.line_px["marker"] / 2
        dot_box = (dx - mr, ytop - mr, dx + mr, ytop + mr)
        hit = next((o for o in occupied if _overlap(dot_box, o)), None)
        if hit is not None:
            rep.dropped.append((p.name, f"point under an obstacle {tuple(round(v) for v in hit)}"))
            continue
        off = offset_px if offset_px is not None else 0.35 * size + mr
        ok = None
        rings = [(1.0, False)] + ([(2.8, True), (4.2, True)] if (leader if leader is not None else p.rank < 0)
                                  else [])
        for mult, with_leader in rings:
            for pos, sx, sy in IMHOF_POSITIONS:
                ha = {1: "left", -1: "right", 0: "center"}[sx]
                va = {1: "bottom", -1: "top", 0: "center"}[sy]
                arrow = ({"arrowstyle": "-", "lw": st.px(max(1.5, 0.05 * size)), "color": st.colors.get("place", st.ink),
                          "shrinkA": st.px(0.2 * size), "shrinkB": st.px(mr + 2),
                          "path_effects": line_halo(st, max(1.5, 0.05 * size), 2.0)} if with_leader else None)
                t = ax.annotate(p.name, xy=(p.lon, p.lat), xycoords=pc._as_mpl_transform(ax),
                                xytext=(sx * off * mult, sy * off * 0.7 * mult), textcoords="offset pixels", ha=ha,
                                va=va, fontsize=st.px(size), color=st.colors.get("place", st.ink), zorder=9,
                                fontweight="semibold" if key == "place_1" else "normal",
                                path_effects=halo(st, size), annotation_clip=False, arrowprops=arrow)
                b = _text_box(fig, t, pad=st.line_px["halo_frac"] * size)
                c = (int(((b[0] + b[2]) / 2) // cell[0]), int(((b[1] + b[3]) / 2) // cell[1]))
                if (_inside(b, content) and not any(_overlap(b, o) for o in occupied)
                        and not any(_overlap(b, o) for o in label_obstacles) and c not in cells):
                    ok = (pos + ("+leader" if with_leader else ""), t, b, c)
                    break
                t.remove()
            if ok is not None:
                break
        if ok is None:
            rep.dropped.append((p.name, "no free position"))
            continue
        pos, t, b, c = ok
        if marker:
            ax.plot(p.lon, p.lat, "o", ms=st.px(st.line_px["marker"]), mfc=st.colors.get("marker", st.ink),
                    mec=st.halo_color, mew=st.px(max(2.0, 0.2 * st.line_px["marker"])), transform=pc, zorder=9)
        occupied += [b, dot_box]
        cells.add(c)
        rep.placed.append((p.name, pos, b))
    rep.boxes = occupied
    return rep


def label_area(ax, text: str, lon: float, lat: float, st: CartoStyle, kind: str = "water",
               rotation: float = 0.0, spacing: float = 0.12):
    """Area / water label: italic, letter-spaced, light tint (Imhof: water names in italic, spread across).

    Matplotlib has no letter-spacing, so thin spaces are inserted (``spacing`` > 0)."""
    import cartopy.crs as ccrs

    s = text if spacing <= 0 else " ".join(text)
    size = st.type_px["water"]
    return ax.text(lon, lat, s, transform=ccrs.PlateCarree(), ha="center", va="center", rotation=rotation,
                   fontsize=st.px(size), style="italic", color=st.colors.get("water_label", st.ink_muted),
                   path_effects=halo(st, size), zorder=8)


# ---------------------------------------------------------------------------------------------------------------
# 6. Isolines: in-line labels
# ---------------------------------------------------------------------------------------------------------------

def _polylines_px(ax, cs):
    """Contour polylines per level in display pixels (origin bottom-left)."""
    out = []
    tr = cs.get_transform()
    for i, path in enumerate(cs.get_paths()):
        polys = path.to_polygons(closed_only=False) if len(path.vertices) else []
        out.append([tr.transform(p) for p in polys if len(p) > 3])
    return out


def isobar_labels(ax, cs, st: CartoStyle, obstacles: Sequence[tuple] = (), spacing_px: float | None = None,
                  max_per_line: int = 2, max_total: int | None = None, fmt: str = "{:.0f}",
                  min_line_px: float | None = None, straight_deg: float = 25.0, levels: Sequence[float] | None = None,
                  edge_px: float = 60, max_tilt_deg: float = 60.0) -> LabelReport:
    """In-line contour labels on straight stretches, spaced along each line, never colliding.

    For every contour line longer than ``min_line_px`` the function walks along it at ``spacing_px`` steps,
    scores each candidate by straightness over one label length (turning < ``straight_deg``) and by tilt (no
    label where the line is steeper than ``max_tilt_deg``: steep text is slow to read), keeps it if it is
    ``edge_px`` inside the frame and clear of obstacles and of earlier labels, and then hands the chosen points
    to ``clabel(manual=...)`` (inline: the line breaks under the number; matplotlib keeps the text upright and
    rotated along the line). Labels get the house size and halo. Returns a LabelReport whose ``boxes`` include
    the obstacles plus the new labels.
    """
    fig = ax.figure
    fig.canvas.draw()
    W, H = st.size_px
    size = st.type_px["contour"]
    lab_len = 2.2 * size                     # ~4 digits at 0.55 em
    spacing_px = spacing_px or (0.38 * W if st.medium == "movie" else 0.3 * W)
    min_line_px = min_line_px or 2.5 * lab_len
    content = st.content_box or (0, 0, W, H)
    content = (content[0] + edge_px, content[1] + edge_px, content[2] - edge_px, content[3] - edge_px)
    occupied = list(obstacles) + frame_obstacles(st)
    lv_all = list(cs.levels)
    want = set(lv_all if levels is None else levels)
    chosen_px: list[tuple[float, float]] = []
    chosen_lv: list[float] = []
    max_total = max_total or (10 if st.medium == "movie" else 40)
    lines = _polylines_px(ax, cs)
    for i, polys in enumerate(lines):
        if lv_all[i] not in want:
            continue
        for p in polys:
            seg = np.hypot(*np.diff(p, axis=0).T)
            L = float(seg.sum())
            if L < min_line_px:
                continue
            s = np.concatenate([[0], np.cumsum(seg)])
            n_here = 0
            for target in np.arange(0.5 * min(spacing_px, L), L, spacing_px):
                if n_here >= max_per_line or len(chosen_px) >= max_total:
                    break
                best = None
                for d in np.linspace(-0.3 * spacing_px, 0.3 * spacing_px, 9):   # slide to find a good spot
                    sc = target + d
                    if sc - lab_len / 2 < 0 or sc + lab_len / 2 > L:
                        continue
                    a = np.array([np.interp(sc - lab_len / 2, s, p[:, k]) for k in (0, 1)])
                    m = np.array([np.interp(sc, s, p[:, k]) for k in (0, 1)])
                    b = np.array([np.interp(sc + lab_len / 2, s, p[:, k]) for k in (0, 1)])
                    v1, v2 = m - a, b - m
                    turn = abs(math.degrees(math.atan2(v1[0] * v2[1] - v1[1] * v2[0], v1 @ v2 + 1e-12)))
                    if turn > straight_deg:
                        continue
                    ang = abs(math.degrees(math.atan2(b[1] - a[1], b[0] - a[0])))
                    tilt = min(ang, 180 - ang)
                    if tilt > max_tilt_deg:
                        continue
                    score = turn + 0.5 * tilt
                    xt = m[0]
                    yt = H - m[1]
                    hb = (xt - lab_len / 2 - 6, yt - lab_len / 2 - 6, xt + lab_len / 2 + 6, yt + lab_len / 2 + 6)
                    box = (xt - lab_len / 2, yt - 0.6 * size, xt + lab_len / 2, yt + 0.6 * size)
                    if not _inside(box, content) or any(_overlap(hb, o) for o in occupied):
                        continue
                    if best is None or score < best[0]:
                        best = (score, m, hb)
                if best is not None:
                    _, m, hb = best
                    chosen_px.append((float(m[0]), float(m[1])))
                    chosen_lv.append(lv_all[i])
                    occupied.append(hb)
                    n_here += 1
    rep = LabelReport()
    if not chosen_px:
        rep.boxes = occupied
        return rep
    inv = ax.transData.inverted()
    manual = [tuple(inv.transform(xy)) for xy in chosen_px]
    texts = cs.clabel(levels=sorted(set(chosen_lv)), manual=manual, inline=True,
                      inline_spacing=st.px(0.3 * size), fontsize=st.px(size),
                      fmt=lambda v: fmt.format(v), colors=[st.colors["contour"]])
    for t in texts:
        r = t.get_rotation() % 360           # keep the number upright (reads left to right)
        if 90 < r < 270:
            t.set_rotation(r - 180)
        t.set_path_effects(halo(st, size))
        t.set_zorder(8)
    fig.canvas.draw()
    occ = list(obstacles) + frame_obstacles(st)
    for t in texts:
        b = _bbox_px(fig, t, pad=st.line_px["halo_frac"] * size)
        rep.placed.append((t.get_text(), "inline", b))
        occ.append(b)
    rep.boxes = occ
    return rep


# ---------------------------------------------------------------------------------------------------------------
# 7. H / L centres
# ---------------------------------------------------------------------------------------------------------------

def find_extrema(lon, lat, field, bbox: Sequence[float] | None = None, window_deg: float = 10.0,
                 min_prominence: float = 4.0) -> list[dict]:
    """Local minima/maxima of a lon-lat field (e.g. MSLP in hPa) found with a moving min/max filter.

    A point is a low (high) if it is the minimum (maximum) in a ``window_deg`` box and at least
    ``min_prominence`` below (above) the box mean. Returns [{"kind", "lon", "lat", "value"}], strongest first.
    """
    from scipy import ndimage

    lon = np.asarray(lon, float)
    lat = np.asarray(lat, float)
    f = np.asarray(field, float)
    dlat = abs(lat[1] - lat[0])
    n = max(3, int(round(window_deg / dlat)) | 1)
    fmin = ndimage.minimum_filter(f, size=n, mode="nearest")
    fmax = ndimage.maximum_filter(f, size=n, mode="nearest")
    fmean = ndimage.uniform_filter(f, size=n, mode="nearest")
    out = []
    for kind, mask in (("low", (f == fmin) & (fmean - f >= min_prominence)),
                       ("high", (f == fmax) & (f - fmean >= min_prominence))):
        for j, i in zip(*np.nonzero(mask)):
            lo, la = float(lon[i]), float(lat[j])
            if bbox and not (bbox[0] <= lo <= bbox[1] and bbox[2] <= la <= bbox[3]):
                continue
            out.append({"kind": kind, "lon": lo, "lat": la, "value": float(f[j, i])})
    out.sort(key=lambda e: -abs(e["value"] - 1013.25))
    return out


def mark_extrema(ax, centres: Sequence[dict], st: CartoStyle, obstacles: Sequence[tuple] = (),
                 value_fmt: str = "{:.0f}", letters: dict | None = None) -> LabelReport:
    """Draw H / L letters centred on each extremum with the central pressure (hPa) under the letter.

    NWS/WMO convention: blue H, red L (here the medium's high/low colours), the letter centred on the exact
    centre and the value directly below it. Centres whose letter would leave the
    content box or hit an obstacle are skipped and reported. ``centres``: dicts from :func:`find_extrema`.
    """
    import cartopy.crs as ccrs

    fig = ax.figure
    fig.canvas.draw()
    pc = ccrs.PlateCarree()
    letters = letters or {"low": "L", "high": "H"}
    W, H = st.size_px
    content = st.content_box or (0, 0, W, H)
    occupied = list(obstacles) + frame_obstacles(st)
    rep = LabelReport()
    s1, s2 = st.type_px["hl"], st.type_px["hl_value"]
    for c in centres:
        col = st.colors[c["kind"]]
        t = ax.text(c["lon"], c["lat"], letters[c["kind"]], transform=pc, ha="center", va="center",
                    fontsize=st.px(s1), fontweight="bold", color=col, path_effects=halo(st, s1), zorder=10)
        b1 = _bbox_px(fig, t, pad=4)
        if not _inside(b1, content) or any(_overlap(b1, o) for o in occupied):
            t.remove()
            rep.dropped.append((letters[c["kind"]] + value_fmt.format(c["value"]), "letter outside or blocked"))
            continue
        v = b2 = None
        # value under the letter (convention); above or to the right only when below is blocked
        for xt, yt, ha, va in ((0, -0.62 * s1, "center", "top"), (0, 0.62 * s1, "center", "bottom"),
                               (0.5 * s1, 0, "left", "center")):
            v = ax.annotate(value_fmt.format(c["value"]), xy=(c["lon"], c["lat"]), xycoords=pc._as_mpl_transform(ax),
                            xytext=(xt, yt), textcoords="offset pixels", ha=ha, va=va, fontsize=st.px(s2),
                            fontweight="bold", color=col, path_effects=halo(st, s2), zorder=10, annotation_clip=False)
            b2 = _text_box(fig, v, pad=4)
            if _inside(b2, content) and not any(_overlap(b2, o) for o in occupied):
                break
            v.remove()
            v = None
        if v is None:
            t.remove()
            rep.dropped.append((letters[c["kind"]] + value_fmt.format(c["value"]), "no room for the value"))
            continue
        occupied += [b1, b2]
        rep.placed.append((letters[c["kind"]], value_fmt.format(c["value"]), (b1, b2)))
    rep.boxes = occupied
    return rep


# ---------------------------------------------------------------------------------------------------------------
# 8. Fronts (WMO / NWS symbols through MetPy path effects)
# ---------------------------------------------------------------------------------------------------------------

def _sample(lon, lat, field, lo, la):
    from scipy.ndimage import map_coordinates

    lon = np.asarray(lon, float)
    lat = np.asarray(lat, float)
    fi = (np.asarray(lo) - lon[0]) / (lon[1] - lon[0])
    fj = (np.asarray(la) - lat[0]) / (lat[1] - lat[0])
    return map_coordinates(np.asarray(field, float), [fj, fi], order=1, mode="nearest")


def front_flip(ax, xy_lonlat: np.ndarray, kind: str, temperature: tuple | None, probe_deg: float = 1.5) -> bool:
    """Decide MetPy's ``flip`` so the symbols point the way the front moves.

    MetPy draws symbols on the left of the path direction in screen space (flip=False). Cold front: triangles
    point into the warm air; warm front: semicircles point into the cold air. With ``temperature`` =
    (lon, lat, T) the warm side is found by sampling T on both sides of the line (a 850-hPa temperature or
    potential temperature works best). Without temperature, returns False (left side) and the caller must check.
    """
    if temperature is None or kind not in ("cold", "warm", "occluded"):
        return False
    import cartopy.crs as ccrs

    pc = ccrs.PlateCarree()
    p = np.asarray(xy_lonlat, float)
    d = ax.transData.transform(ax.projection.transform_points(pc, p[:, 0], p[:, 1])[:, :2])
    t = np.gradient(d, axis=0)
    nrm = np.stack([-t[:, 1], t[:, 0]], axis=1)              # left normal in screen space (y up)
    nrm /= np.hypot(*nrm.T)[:, None] + 1e-12
    # convert a screen-space step back to lon/lat by probing
    step_px = 25.0
    inv = ax.transData.inverted()
    left = pc.transform_points(ax.projection, *inv.transform(d + step_px * nrm).T)[:, :2]
    right = pc.transform_points(ax.projection, *inv.transform(d - step_px * nrm).T)[:, :2]
    lon, lat, T = temperature
    # move the probes out to ~probe_deg so they sample the air masses, not the frontal zone
    def far(q):
        v = q - p
        v /= np.hypot(*v.T)[:, None] + 1e-12
        return p + probe_deg * v
    tl = _sample(lon, lat, T, *far(left).T)
    tr = _sample(lon, lat, T, *far(right).T)
    warm_left = float(np.nanmean(tl - tr)) > 0
    want_left = warm_left if kind == "cold" else (not warm_left)   # occluded: like warm (towards cold air)
    return not want_left


def draw_fronts(ax, fronts, st: CartoStyle, temperature: tuple | None = None, casing: bool = True,
                spacing: float = 2.2, flips: dict | None = None):
    """Draw fronts with WMO/NWS symbols (MetPy path effects): cold = blue triangles, warm = red semicircles,
    occluded = purple alternating, stationary = alternating red/blue on opposite sides, trough = dashed.

    ``fronts``: GeoJSON FeatureCollection (path or dict) with LineString features and a ``kind`` property, or a
    list of (kind, Nx2 lon/lat array). ``temperature`` = (lon, lat, T) orients the symbols (:func:`front_flip`);
    ``flips`` = {index: bool} overrides. A dark (movie) or white (print) casing keeps the line readable over
    a coloured field. Returns (used, boxes): the (kind, flip) actually used, and small pixel boxes along each
    front (top-left origin) to pass to the label functions as obstacles.
    """
    import cartopy.crs as ccrs
    import matplotlib.patheffects as pe
    from metpy.plots import ColdFront, OccludedFront, StationaryFront, WarmFront

    if isinstance(fronts, (str, Path)):
        fronts = json.loads(Path(fronts).read_text(encoding="utf-8"))
    if isinstance(fronts, dict):
        items = [(f["properties"]["kind"], np.asarray(f["geometry"]["coordinates"], float)) for f in fronts["features"]]
    else:
        items = [(k, np.asarray(c, float)) for k, c in fronts]
    pc = ccrs.PlateCarree()
    ax.figure.canvas.draw()
    lw = st.px(st.line_px["front"])
    size = st.px(st.line_px["front_symbol"])
    used = []
    boxes = []
    H = st.size_px[1]
    r = st.line_px["front_symbol"]
    for i, (kind, xy) in enumerate(items):
        d = ax.transData.transform(ax.projection.transform_points(pc, xy[:, 0], xy[:, 1])[:, :2])
        s = np.concatenate([[0], np.cumsum(np.hypot(*np.diff(d, axis=0).T))])
        for sc in np.arange(0, s[-1] + 1, r):
            x, y = np.interp(sc, s, d[:, 0]), H - np.interp(sc, s, d[:, 1])
            boxes.append((x - 1.2 * r, y - 1.2 * r, x + 1.2 * r, y + 1.2 * r))
        flip = (flips or {}).get(i, front_flip(ax, xy, kind, temperature))
        col = st.colors.get(kind, st.ink)
        if kind == "cold":
            eff = ColdFront(color=col, size=size, spacing=spacing, flip=flip)
        elif kind == "warm":
            eff = WarmFront(color=col, size=size, spacing=spacing, flip=flip)
        elif kind == "occluded":
            eff = OccludedFront(color=col, size=size, spacing=spacing, flip=flip)
        elif kind == "stationary":
            eff = StationaryFront(colors=(st.colors["warm"], st.colors["cold"]), size=size, spacing=spacing,
                                  flip=flip)
        else:   # trough: dashed, no symbols, no text label (NWS USA manual)
            ax.plot(xy[:, 0], xy[:, 1], color=st.colors["trough"], lw=lw, ls=(0, (4, 2)), transform=pc, zorder=7)
            used.append((kind, None))
            continue
        effects = ([pe.Stroke(linewidth=lw + st.px(6), foreground=st.halo_color, alpha=0.7)] if casing else []) + [eff]
        ax.plot(xy[:, 0], xy[:, 1], color=col, lw=lw, transform=pc, path_effects=effects, zorder=7,
                solid_capstyle="round")
        used.append((kind, flip))
    return used, boxes


# ---------------------------------------------------------------------------------------------------------------
# 9. Scale bar, graticule, colour bar
# ---------------------------------------------------------------------------------------------------------------

def _nice(x: float) -> float:
    e = 10 ** math.floor(math.log10(x))
    for m in (1, 2, 2.5, 5, 10):
        if m * e >= x:
            return m * e
    return 10 * e


def scale_bar(ax, st: CartoStyle, bbox: Sequence[float], at: tuple[float, float] | None = None,
              length_km: float | None = None, max_variation: float = 0.06, force: bool = False,
              obstacles: Sequence[tuple] = ()):
    """Draw a true-length scale bar at a stated latitude, or refuse (return None) when it would mislead.

    The bar is measured geodesically along the parallel through ``at`` (lon, lat; default: the first corner of
    the content box, lower-left, lower-right, upper-left, upper-right, whose bar is clear of ``obstacles``) and
    drawn horizontally on screen, so its length is exact *there* (any direction on a conformal map; along the
    parallel only on other projections). It is labelled "<L> km (at <lat>°N)". When the projection's scale
    factor varies by more than ``max_variation`` (6 %) over ``bbox`` (small-scale maps: continents, hemispheres,
    the globe) or no corner is free, the function refuses (returns None) unless ``force``.
    """
    import cartopy.crs as ccrs
    from pyproj import Geod

    kmin, kmax = scale_factor_range(ax.projection, bbox)
    variation = kmax / kmin - 1
    if variation > max_variation and not force:
        return None
    pc = ccrs.PlateCarree()
    fig = ax.figure
    fig.canvas.draw()
    W, H = st.size_px
    content = st.content_box or (0, 0, W, H)
    g = Geod(ellps="WGS84")
    sz = st.type_px["scale"]

    def measure(at_ll):
        lon, lat = at_ll
        _, _, dist_m = g.inv(lon, lat, lon + 1.0, lat)       # km per pixel along the parallel at `at`
        p1 = ax.transData.transform(ax.projection.transform_point(lon, lat, pc))
        p2 = ax.transData.transform(ax.projection.transform_point(lon + 1.0, lat, pc))
        kpp = dist_m / 1000 / np.hypot(*(p2 - p1))
        lk = length_km or _nice(0.16 * W * kpp)
        return lon, lat, p1, kpp, lk, lk / kpp

    if at is not None:
        lon, lat, p1, km_per_px, length_km, L = measure(at)
    else:   # candidate corners: lower-left, lower-right, upper-left, upper-right; first one clear of obstacles
        chosen = None
        for cx, cy, right in ((content[0] + 80, content[3] - 70, False), (content[2] - 80, content[3] - 70, True),
                              (content[0] + 80, content[1] + 110, False), (content[2] - 80, content[1] + 110, True)):
            xy = ax.transData.inverted().transform((cx, H - cy))
            cand = measure(tuple(pc.transform_point(*xy, ax.projection)))
            if right:      # the anchor is the right end: shift left by the bar length and re-measure there
                xy = ax.transData.inverted().transform((cx - cand[5], H - cy))
                cand = measure(tuple(pc.transform_point(*xy, ax.projection)))
            x0c = cand[2][0]
            box = (x0c - 20, cy - 1.6 * sz, x0c + cand[5] + 20, cy + 0.5 * sz)
            if _inside(box, (0, 0, W, H)) and not any(_overlap(box, o) for o in list(obstacles) + frame_obstacles(st)):
                chosen = cand
                break
        if chosen is None:
            return None
        lon, lat, p1, km_per_px, length_km, L = chosen
    x0, y0 = p1
    lw = st.px(st.line_px["scale"])
    from matplotlib.lines import Line2D
    from matplotlib.transforms import IdentityTransform

    tr = IdentityTransform()   # display pixels
    tick = 0.3 * st.type_px["scale"]
    bar = Line2D([x0, x0 + L], [y0, y0], transform=tr, color=st.ink, lw=lw, solid_capstyle="butt", zorder=12)
    ticks = [Line2D([x, x], [y0 - tick, y0 + tick], transform=tr, color=st.ink, lw=lw, zorder=12)
             for x in (x0, x0 + L)]
    for a in [bar] + ticks:
        a.set_path_effects(line_halo(st, st.line_px["scale"], 2.5))
        fig.add_artist(a)
    hemi = "N" if lat >= 0 else "S"
    txt = fig.text((x0 + L / 2) / W, (y0 + 0.45 * st.type_px["scale"]) / H,
                   f"{length_km:g} km  (at {abs(lat):.0f}°{hemi})", ha="center", va="bottom",
                   fontsize=st.px(st.type_px["scale"]), color=st.ink, path_effects=halo(st, st.type_px["scale"]),
                   zorder=12)
    return {"length_km": length_km, "lat": lat, "variation": variation, "artists": [bar, *ticks, txt]}


def graticule(ax, st: CartoStyle, bbox: Sequence[float] | str, step: float | None = None, labels: bool = False):
    """Quiet graticule (faint, thin; labels optional) with a 'nice' step giving ~4-6 lines across."""
    import cartopy.crs as ccrs
    import matplotlib.ticker as mticker

    if isinstance(bbox, str):
        span = 360
    else:
        span = max(bbox[1] - bbox[0], bbox[3] - bbox[2])
    step = step or next((s for s in (1, 2, 5, 10, 15, 20, 30, 45, 60) if span / s <= 6), 60)
    gl = ax.gridlines(crs=ccrs.PlateCarree(), draw_labels=labels, linewidth=st.px(st.line_px["graticule"]),
                      color=st.colors["graticule"], alpha=1.0, linestyle="-", zorder=0.8,
                      xlocs=mticker.MultipleLocator(step), ylocs=mticker.MultipleLocator(step))
    if labels:
        gl.top_labels = gl.right_labels = False
        gl.xlabel_style = gl.ylabel_style = {"size": st.px(st.type_px["graticule"]), "color": st.ink_muted}
    return gl


def colorbar(fig, mappable, st: CartoStyle, label: str, rect: Sequence[float] | None = None,
             orientation: str = "vertical", ticks: Sequence[float] | None = None, extend: str = "neither",
             label_on_top: bool | None = None):
    """House colour bar: thin, no outline, ticks and label at >= the type floor, label "quantity (unit)".

    ``rect`` = [x0, y0, w, h] in figure fractions; default for a movie: right edge, inside the content area.
    ``label_on_top`` (default for movies): a short horizontal label above a vertical bar (no rotated text).
    """
    W, H = st.size_px
    if rect is None:
        if st.medium == "movie":
            y0 = 1 - 820 / H
            rect = [1 - 230 / W, y0, 30 / W, 640 / H] if orientation == "vertical" else [0.3, 1 - 860 / H, 0.4, 26 / H]
        else:
            rect = [0.93, 0.15, 0.015, 0.7] if orientation == "vertical" else [0.3, 0.06, 0.4, 0.025]
    cax = fig.add_axes(rect)
    cb = fig.colorbar(mappable, cax=cax, orientation=orientation, ticks=ticks, extend=extend)
    cb.outline.set_visible(False)
    size = st.type_px["cbar"]
    cax.tick_params(labelsize=st.px(size), colors=st.ink, length=st.px(10), width=st.px(2))
    if label_on_top is None:
        label_on_top = st.medium == "movie" and orientation == "vertical"
    if label_on_top:
        cax.set_title(label, fontsize=st.px(size), color=st.ink, pad=st.px(22), loc="left",
                      path_effects=halo(st, size))
    else:
        cb.set_label(label, fontsize=st.px(size), color=st.ink, labelpad=st.px(12))
    for t in cax.get_yticklabels() + cax.get_xticklabels():
        t.set_path_effects(halo(st, size))
    return cb


def locator_inset(fig, bbox: Sequence[float], st: CartoStyle, rect: Sequence[float] = (0.03, 0.62, 0.16, 0.3)):
    """Small orthographic globe with the map's box outlined (for viewers who may not know where the map is)."""
    import cartopy.crs as ccrs

    lon0, lon1, lat0, lat1 = bbox
    ax = fig.add_axes(rect, projection=ccrs.Orthographic((lon0 + lon1) / 2, max(-60, min(60, (lat0 + lat1) / 2))))
    ax.set_global()
    ax.set_facecolor(st.bg)
    ax.spines["geo"].set_edgecolor(st.ink_muted)
    lo = np.r_[np.linspace(lon0, lon1, 30), np.full(30, lon1), np.linspace(lon1, lon0, 30), np.full(30, lon0)]
    la = np.r_[np.full(30, lat0), np.linspace(lat0, lat1, 30), np.full(30, lat1), np.linspace(lat1, lat0, 30)]
    ax.plot(lo, la, color=st.colors["gold"], lw=st.px(3), transform=ccrs.PlateCarree())
    return ax


# ---------------------------------------------------------------------------------------------------------------
# 10. Pre-flight audit
# ---------------------------------------------------------------------------------------------------------------

def audit(fig, st: CartoStyle, ignore_small: Iterable[str] = ()) -> list[str]:
    """Automatic part of the pre-flight checklist. Returns a list of problems (empty = pass).

    Checks every visible text: size >= the medium's floor (px), inside the figure, outside the caption band
    (movie), and no two texts overlapping (bounding boxes, halo excluded).
    """
    from matplotlib.text import Text

    fig.canvas.draw()
    W, H = st.size_px
    texts =[t for t in fig.findobj(Text) if t.get_visible() and t.get_text().strip()
             and t.get_text() not in ignore_small and t.get_alpha() != 0]
    probs = []
    boxes = []
    for t in texts:
        size_px = t.get_fontsize() * st.dpi / 72.0
        if size_px + 0.01 < st.type_floor_px:
            probs.append(f"text {t.get_text()!r} is {size_px:.0f} px < floor {st.type_floor_px:.0f} px")
        box = _text_box(fig, t)               # text only (an annotation's extent includes its leader line)
        if box[2] - box[0] <= 0:
            continue
        if box[0] < -1 or box[1] < -1 or box[2] > W + 1 or box[3] > H + 1:
            probs.append(f"text {t.get_text()!r} leaves the frame")
        if st.caption_band and box[3] > st.caption_band[0] and box[1] < st.caption_band[1]:
            probs.append(f"text {t.get_text()!r} is in the caption band y {st.caption_band}")
        boxes.append((t.get_text(), box))
    for i in range(len(boxes)):
        for j in range(i + 1, len(boxes)):
            if _overlap(boxes[i][1], boxes[j][1]):
                probs.append(f"texts {boxes[i][0]!r} and {boxes[j][0]!r} overlap")
    return probs


def save(fig, path: str | Path, st: CartoStyle) -> Path:
    """Save deterministically (Agg, no PNG metadata)."""
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(path, dpi=st.dpi, metadata={"Software": None}, facecolor=st.bg)
    return path
