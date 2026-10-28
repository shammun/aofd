"""Physics and real-data products for the Chapter-0 movie #1a "Vectors and index notation: writing the wind, how it
changes and the warmth it carries" (movies/ch00/ch00_vectors_index_notation/storyboard.yaml v2, 45 scenes; CHECK rows
VI01-VI53 of data_needs.md §D).

Run with the main venv::

    .venv/Scripts/python.exe movies/data/build_ch00_vectors_index_notation.py [--public <render public dir>]

Every number the movie shows or says is computed here by the tested functions named in the storyboard's
``physics_source`` fields:

* ``fluidpy.geo.vectors`` (``dot``, ``norm``, ``components_in_axes``), ``fluidpy.geo.atmos`` (``wind_components``,
  ``omega_to_w``, ``geostrophic_wind_from_msl``), ``fluidpy.geo.sphere`` (``gradient``, ``great_circle_distance``,
  ``initial_bearing``), ``fluidpy.diag.advection.advection``, ``fluidpy.diag.cyclone.storm_centre`` (tracked by
  continuity, HOUSE_STYLE §7), ``fluidpy.diag.climatology.monthly_anomaly``,
* ``fluidpy.core.tensors`` (``kronecker_delta``, ``levi_civita``, ``rotation_matrix_2d``, ``transform_vector``),
  ``fluidpy.core.index_notation`` (``classify_indices``, ``tensor_order``, ``rename_dummy``, ``expand_indices_str``),
* ``fluidpy.data.isd`` (``read``, ``decode``) for the Brest SYNOP rows,

on the committed derived data in ``data/derived/ch00/`` (ERA5 850 hPa hourly, ERA5 pressure levels 17-19 UTC, ERA5
global 18 UTC, ERA5 monthly means, GFS 250 hPa jet, IGRA2 Trappes, GIBS true colour, Natural Earth) and the ERA5
hourly Ciarán surface file and the ETOPO 2022 Brittany subset on G:.

Writes movies/ch00/ch00_vectors_index_notation/data/vi.json, data/img/*.png (field textures made from the data with
the project colour maps) and manifest.json (function, provenance, parameters, fluidpy git SHA, sha256 of every input
and data file, a parity hash per light call computed the way tools/movie_qa.py re-computes it, heavy calls by hash).
All CHECK rows must pass before anything is written (exit 1 otherwise). With ``--public`` it also writes the large
render-only images (downsampled GIBS globe, true-colour crop) there, recorded by hash under ``render_assets``.
"""
from __future__ import annotations

import argparse
import base64
import hashlib
import importlib
import json
import subprocess
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
FLUID = ROOT.parent / "Fluid Dynamics"
OUT = ROOT / "movies" / "ch00" / "ch00_vectors_index_notation"
DATA = OUT / "data"
IMG = DATA / "img"
DER = ROOT / "data" / "derived" / "ch00"
CP_REAL = ROOT / "movies" / "ch00" / "ch00_cross_product_why" / "data" / "real"
RAW = Path("G:/Geophysical Fluid Dynamics/aofd-data/raw")
A4 = RAW / "ERA5-ARCO" / "era5_ciaran_2023_u10-v10-msl-t2m_2023-11-01T00_2023-11-02T23_1h.nc"
ISD = RAW / "ISD" / "isd_07110099999_2023-11-01_2023-11-02.csv"
ETOPO = RAW / "ETOPO2022-60s" / "etopo2022_60s_brittany_46.5-49.5N_-6.5--1E.nc"
F850 = DER / "era5_ciaran_2023_850hPa_1h.nc"
FPL = DER / "era5_ciaran_2023_pl_925-850-700_17-19UTC.nc"
FGLB = DER / "era5_global_2023-11-01T18_sfc_0p5.nc"
FMON = DER / "era5_monthly_u10-v10-sst_nov_1991-2023_30S-30N_1deg.nc"
FGFS = DER / "gfs_jet_250-300hPa_2026-10-28T18_natl.nc"
FIGRA = DER / "igra2_trappes_singapore_2023-11-01T00.nc"
FGIBS = DER / "gibs_truecolour_global_2023-11-01_0p05.jpg"
FTC = DER / "ciaran_truecolour_2023-11-01_aqua_terra.jpg"

sys.path.insert(0, str(FLUID))
import xarray as xr  # noqa: E402

from fluidpy.geo.constants import EARTH_RADIUS  # noqa: E402

DEG = np.pi / 180.0
BREST = (48.45, -4.42)            # Brest-Guipavas (ISD station 07110 at 48.448 N, 4.419 W)
BREST_GP = (48.5, -4.5)           # the ERA5 grid point used for every 850 hPa number
SEA_PT = (48.0, -6.0)             # s12d sea point west of Brest
BOX_T = (40.0, 56.0, -20.0, 10.0)  # field textures and isotherms (lat0, lat1, lon0, lon1)
GV, GA, GS, DA, DC, CT, CI = ("fluidpy.geo.vectors.", "fluidpy.geo.atmos.", "fluidpy.geo.sphere.", "fluidpy.diag.advection.",
                              "fluidpy.diag.climatology.", "fluidpy.core.tensors.", "fluidpy.core.index_notation.")


# ---------------------------------------------------------------------------------------------------------- helpers
def parity_hash(out) -> str:
    """Same rule as tools/movie_qa.py::physics_parity (float array bytes, else sorted JSON with str())."""
    try:
        blob = np.ascontiguousarray(np.asarray(out, dtype=float)).tobytes()
    except Exception:
        blob = json.dumps(out, sort_keys=True, default=str).encode()
    return hashlib.sha256(blob).hexdigest()


def r6(a, nd: int = 6):
    arr = np.asarray(a, dtype=float)
    if arr.ndim == 0:
        return None if not np.isfinite(arr) else round(float(arr), nd)
    out = np.round(arr, nd)
    return [r6(x, nd) for x in out] if out.ndim > 1 else [None if not np.isfinite(x) else float(x) for x in out]


def sha_file(p: Path) -> str:
    return hashlib.sha256(p.read_bytes()).hexdigest()


def git_sha(repo: Path, files: dict) -> dict:
    run = lambda *a: subprocess.run(["git", "-C", str(repo), *a], capture_output=True, text=True).stdout.strip()  # noqa: E731
    out = {"commit": run("rev-parse", "HEAD"), "dirty_tracked": bool(run("status", "--porcelain", "--untracked-files=no"))}
    for k, rel in files.items():
        p = repo / rel
        out[f"{k}_sha256"] = hashlib.sha256(p.read_bytes()).hexdigest() if p.exists() else None
    return out


def lut_rgb(name: str) -> np.ndarray:
    tab = json.loads((ROOT / "assets" / "luts.json").read_text(encoding="utf-8"))["tables"][name]
    return np.frombuffer(base64.b64decode(tab), dtype=np.uint8).reshape(-1, 3)


def lut_hex(name: str, n: int = 32) -> list[str]:
    rgb = lut_rgb(name)
    idx = np.round(np.linspace(0, len(rgb) - 1, n)).astype(int)
    return ["#%02x%02x%02x" % tuple(int(c) for c in rgb[i]) for i in idx]


def field_png(F: np.ndarray, lat: np.ndarray, lon: np.ndarray, lut: str, lo: float, hi: float, path: Path, up: int = 4,
              alpha: float = 1.0) -> dict:
    """Colour-mapped PNG of F(lat ascending, lon ascending) with row 0 = north edge, bicubic-upsampled ×up. Returns
    the geographic edges (cell edges) for the composition's GeoImage."""
    from PIL import Image
    from scipy.ndimage import zoom
    G = np.asarray(F, float)[::-1]
    if up > 1:
        G = zoom(np.nan_to_num(G, nan=np.nanmean(G)), up, order=3)
    t = np.clip((G - lo) / (hi - lo), 0, 1)
    rgb = lut_rgb(lut)[np.round(t * 255).astype(int)]
    a = np.full(t.shape + (1,), int(round(alpha * 255)), np.uint8)
    Image.fromarray(np.concatenate([rgb, a], -1).astype(np.uint8), "RGBA").save(path, optimize=True)
    dla, dlo = abs(float(lat[1] - lat[0])), abs(float(lon[1] - lon[0]))
    return {"file": f"img/{path.name}", "lat_edges": [float(lat.min()) - dla / 2, float(lat.max()) + dla / 2],
            "lon_edges": [float(lon.min()) - dlo / 2, float(lon.max()) + dlo / 2], "lut": lut, "range": [lo, hi]}


def contours(F, lat, lon, levels, nd=2, min_pts=4):
    """Isolines of F every level ({level, lines: [[lon, lat, ...]]}) with skimage marching squares."""
    from skimage.measure import find_contours
    out = []
    for lev in levels:
        lines = []
        for c in find_contours(np.asarray(F, float), lev):
            if len(c) < min_pts:
                continue
            la = np.interp(c[:, 0], np.arange(lat.size), lat)
            lo = np.interp(c[:, 1], np.arange(lon.size), lon)
            lines.append(np.round(np.stack([lo, la], -1), nd).ravel().tolist())
        if lines:
            out.append({"level": float(lev), "lines": lines})
    return out


def gj_lines(p: Path, box, nd=3, step=1):
    out = []
    for feat in json.loads(p.read_text(encoding="utf-8"))["features"]:
        g = feat["geometry"]
        parts = [g["coordinates"]] if g["type"] == "LineString" else g["coordinates"] if g["type"] == "MultiLineString" else \
            [r for poly in ([g["coordinates"]] if g["type"] == "Polygon" else g["coordinates"]) for r in poly]
        for ln in parts:
            a = np.round(np.asarray(ln, float), nd)
            keep = (a[:, 1] >= box[0]) & (a[:, 1] <= box[1]) & (a[:, 0] >= box[2]) & (a[:, 0] <= box[3])
            if keep.sum() >= 2:
                a = a[keep][::step] if step > 1 else a[keep]
                out.append(a.ravel().tolist())
    return out


def bilin(F, lat, lon, plat, plon):
    from scipy.interpolate import RegularGridInterpolator
    f = RegularGridInterpolator((lat, lon), F, bounds_error=False, fill_value=np.nan)
    return f(np.stack([np.ravel(plat), np.ravel(plon)], -1)).reshape(np.shape(plat))


def open_a4():
    ds = xr.open_dataset(A4)
    ds = ds.assign_coords(longitude=((ds.longitude + 180.0) % 360.0) - 180.0).sortby("longitude").sortby("latitude")
    return ds.rename({"10m_u_component_of_wind": "u10", "10m_v_component_of_wind": "v10",
                      "mean_sea_level_pressure": "msl", "2m_temperature": "t2m", "latitude": "lat", "longitude": "lon"})


# ---------------------------------------------------------------------------------------------------------- main
def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--public", type=Path, help="render public dir for the large images (not committed)")
    a = ap.parse_args()
    DATA.mkdir(parents=True, exist_ok=True)
    IMG.mkdir(parents=True, exist_ok=True)
    rows: list[dict] = []
    entries: list[dict] = []
    heavy: list[dict] = []
    V: dict = {}
    narration_changes = [
        "s09: 'around three hundred times slower' -> 'more than three hundred times slower' (VI16: 34.0 / 0.095 = 358)",
        "s12a: jet maximum 'about seventy' -> 'about sixty-five' (VI41: GFS 2026-10-28T18 250 hPa max 66.1 m/s)",
        "s12h: 'about six ... only about three and a half ... about two and a half' -> 'about five ... only about three point "
        "seven ... about one point three' (VI49: ERA5 Nov clim -5.04, Nov 2023 -3.72, anomaly +1.32 m/s)"]

    def row(wid, name, val, ref, tol):
        v, r = np.asarray(val, dtype=float), np.asarray(ref, dtype=float)
        ok = bool(np.all(np.abs(v - r) <= tol))
        rows.append({"id": wid, "name": name, "value": r6(np.ravel(v)[:9]), "ref": r6(np.ravel(r)[:9]), "tol": tol, "pass": ok})
        return ok

    def rng(wid, name, val, lo, hi):
        v = np.asarray(val, dtype=float)
        ok = bool(np.all((v >= lo) & (v <= hi)))
        rows.append({"id": wid, "name": name, "value": r6(np.ravel(v)[:9]), "ref": f"[{lo}, {hi}]", "tol": None, "pass": ok})

    def truth(wid, name, cond, value=None):
        rows.append({"id": wid, "name": name, "value": value if value is not None else bool(cond), "ref": True, "tol": 0,
                     "pass": bool(cond)})

    def call(fn: str, scene: str, eq: str, heavy_call: bool = False, **params):
        mod, name = fn.rsplit(".", 1)
        out = getattr(importlib.import_module(mod), name)(**params)
        try:
            jp = {k: (np.asarray(v).tolist() if isinstance(v, np.ndarray) else v) for k, v in params.items()}
            size = len(json.dumps(jp))
        except TypeError:
            heavy_call, size = True, 0
        if heavy_call or size > 20_000:
            heavy.append({"fn": fn, "scene": scene, "eq": eq, "params": {k: (v if isinstance(v, (int, float, str, type(None)))
                          else f"array {np.shape(v)}, sha256 {parity_hash(v)}") for k, v in params.items()},
                          "output_sha256": parity_hash(out if not hasattr(out, "dFdx") else [out.dFdx, out.dFdy])})
            return out
        entries.append({"fn": fn, "scene": scene, "data": "data/vi.json", "eq": eq, "params": jp, "sha256": parity_hash(out)})
        return out

    # ================================================================ Brest SYNOP (A2) — s02-s04, s08, s10, s27
    from fluidpy.data import isd
    import pandas as pd
    d = isd.decode(isd.read([ISD]))
    d["time"] = pd.to_datetime(d.time)
    syn = d[d.report_type == "FM-12"].set_index("time")
    r18, r20 = syn.loc["2023-11-01 18:00"], syn.loc["2023-11-01 20:00"]
    row("VI01", "ISD Brest 18 UTC 1 Nov 2023: from 150°, 9.3 m/s, 10.3 °C", [r18.wind_from_deg, r18.wind_ms, r18.t_c], [150, 9.3, 10.3], 1e-9)
    row("VI15", "ISD Brest 20 UTC: from 210°, 13.4 m/s, 14.9 °C", [r20.wind_from_deg, r20.wind_ms, r20.t_c], [210, 13.4, 14.9], 1e-9)
    row("VI40", "Brest 10.3 -> 14.9 °C (+4.6 °C, 18-20 UTC)", r20.t_c - r18.t_c, 4.6, 1e-9)
    uv = call(GA + "wind_components", "s08", "u = |u| sin(dir+180), v = |u| cos(dir+180) (from-convention)", speed=9.3, dir_from_deg=150.0)
    row("VI02", "wind_components(9.3, from 150°) = (-4.65, 8.054)", uv, [-4.65, 8.0540], 5e-4)
    row("VI03", "sin 330° = -1/2, cos 330° = 0.8660", [np.sin(330 * DEG), np.cos(330 * DEG)], [-0.5, 0.8660], 5e-5)
    nb = call(GV + "norm", "s10", "|u| = sqrt(u_i u_i)", a=[-4.65, 8.054, 0.0])
    row("VI04", "norm(-4.65, 8.054, 0) = 9.30", nb, 9.30, 5e-3)
    row("VI04b", "s10 screen √86.4: 4.65² + 8.05² = 86.425 ≈ 86.4 (rounded inputs); √ ≈ 9.30", [4.65 ** 2 + 8.05 ** 2, np.sqrt(4.65 ** 2 + 8.05 ** 2)], [86.4, 9.30], [0.05, 0.005])
    n68 = call(GV + "norm", "s10", "Pythagoras on the floor", a=[6.0, 8.0, 0.0])
    row("VI05", "norm(6, 8, 0) = 10", n68, 10.0, 1e-12)
    n683 = call(GV + "norm", "s10", "Pythagoras twice (generic 3-D arrow drawn, not spoken)", a=[6.0, 8.0, 3.0])
    sel = syn.loc["2023-11-01 17:00":"2023-11-01 21:00"]
    V["brest"] = {"lat": BREST[0], "lon": BREST[1], "dir18": 150, "speed18": 9.3, "T18": 10.3, "dir20": 210, "speed20": 13.4, "T20": 14.9,
                  "u18": r6(uv[0], 3), "v18": r6(uv[1], 3), "norm_check": r6(nb, 3), "n683": r6(n683, 4),
                  "synop_h": [int(t.hour) for t in sel.index], "synop_T": r6(sel.t_c.values, 1)}

    # ================================================================ ERA5 850 hPa (A1) — s05, s11, s12f, s14, s18, s20-s28, s31
    e8 = xr.open_dataset(F850)
    lat8, lon8 = e8.lat.values.astype(float), e8.lon.values.astype(float)
    pts = {}
    for h in (17, 18, 19):
        p = e8.sel(time=f"2023-11-01T{h:02d}", lat=BREST_GP[0], lon=BREST_GP[1])
        pts[h] = {"T": float(p.t) - 273.15, "u": float(p.u), "v": float(p.v), "q": float(p.q) * 1e3}
    p18, p17, p19 = pts[18], pts[17], pts[19]
    rng("VI06", "ERA5 850 hPa (48.5N 4.5W) 18 UTC u ∈ [5.7, 6.0]", p18["u"], 5.7, 6.0)
    rng("VI06", "… v ∈ [33.3, 33.7]", p18["v"], 33.3, 33.7)
    rng("VI06", "… T ∈ [5.0, 5.3] °C", p18["T"], 5.0, 5.3)
    n850 = call(GV + "norm", "s11", "|u| at 850 hPa", a=[p18["u"], p18["v"], 0.0])
    row("VI07", "|u_850| = 34.0", n850, 34.0, 0.1)
    uu = call(GV + "dot", "s18", "u_i u_i (rounded screen inputs 5.8, 33.5)", a=[5.8, 33.5, 0.0], b=[5.8, 33.5, 0.0])
    row("VI07", "u_i u_i = 5.8² + 33.5² = 1155.89 ≈ 1156 (screen)", uu, 1155.89, 1e-9)
    row("VI07", "√1155.89 ≈ 34.0", np.sqrt(uu), 34.0, 0.05)
    row("VI08", "ERA5 850 hPa wind 17 UTC = (7.6, 23.3)", [p17["u"], p17["v"]], [7.6, 23.3], 0.06)
    row("VI08", "change 18 - 17 UTC (screen inputs) = (-1.8, +10.2)", [5.8 - 7.6, 33.5 - 23.3], [-1.8, 10.2], 1e-9)
    row("VI08", "change at full precision rounds to (-1.8, +10.2)", [p18["u"] - p17["u"], p18["v"] - p17["v"]], [-1.8, 10.2], 0.06)
    # along / across the coast (F3)
    aa = call(GV + "components_in_axes", "s11", "(u·e_along, u·e_across), bearing 80° (dot products with the rotated basis)",
              u=[5.8, 33.5], bearing_deg=80.0)
    aa_full = call(GV + "components_in_axes", "s11", "same at full precision", u=[p18["u"], p18["v"]], bearing_deg=80.0)
    row("VI09", "along/across from (5.8, 33.5) at 80° = (11.5, 32.0)", aa, [11.5, 32.0], 0.05)
    row("VI09", "along at full precision = 11.6", aa_full[0], 11.6, 0.05)
    row("VI09", "√(11.5² + 32.0²) ≈ 34.0 (screen)", np.hypot(11.5, 32.0), 34.0, 0.05)
    row("VI09", "√(5.8² + 33.5²) ≈ 34.0 (screen)", np.hypot(5.8, 33.5), 34.0, 0.05)
    from fluidpy.core import tensors as TT
    Cr = call(CT + "rotation_matrix_2d", "s11", "rotation by 10° (east -> along-coast axis, bearing 80°)", theta=float(10 * DEG))
    tv = call(CT + "transform_vector", "s11", "u'_i = C_ji u_j (Kundu 2.5); same numbers as components_in_axes", u=[5.8, 33.5], C=np.asarray(Cr).tolist())
    truth("VI09", "core.tensors.transform_vector agrees with components_in_axes (|diff| < 1e-9, either sign convention)",
          min(np.abs(np.asarray(tv) - np.asarray(aa)).max(), np.abs(np.asarray(TT.transform_vector([5.8, 33.5], np.asarray(Cr).T)) - np.asarray(aa)).max()) < 1e-9)
    ea = [np.sin(80 * DEG), np.cos(80 * DEG), 0.0]
    row("VI10", "e_along = (0.985, 0.174, 0)", ea[:2], [0.985, 0.174], 5e-4)
    dalong = call(GV + "dot", "s15", "u · e_along = 5.8×0.985 + 33.5×0.174 (screen)", a=[5.8, 33.5, 0.0], b=[0.985, 0.174, 0.0])
    row("VI10", "5.8×0.985 = 5.71, 33.5×0.174 = 5.83, sum ≈ 11.5", [5.8 * 0.985, 33.5 * 0.174, dalong], [5.713, 5.829, 11.542], 5e-4)
    # gradient (0.25° and 1°)
    s18 = e8.sel(time="2023-11-01T18")
    T18 = s18.t.values.astype(float)
    g = call(GS + "gradient", "s25", "∂T/∂x_i on the sphere (centred differences)", heavy_call=True, F=T18, lat=lat8, lon=lon8)
    i0, j0 = int(np.argmin(abs(lat8 - BREST_GP[0]))), int(np.argmin(abs(lon8 - BREST_GP[1])))
    dTdx, dTdy = float(g.dFdx[i0, j0]) * 1e5, float(g.dFdy[i0, j0]) * 1e5
    row("VI11", "∂T/∂x = -3.20, ∂T/∂y = -2.49 K per 100 km (0.25°)", [dTdx, dTdy], [-3.20, -2.49], 0.1)
    c4 = s18.t.values[::2, ::2].astype(float)   # 0.5° grid: centred differences span 1°
    g1 = call(GS + "gradient", "s25", "1° centred-difference robustness check", heavy_call=True, F=c4, lat=lat8[::2], lon=lon8[::2])
    i1, j1 = int(np.argmin(abs(lat8[::2] - BREST_GP[0]))), int(np.argmin(abs(lon8[::2] - BREST_GP[1])))
    row("VI11", "1° centred difference within 0.1 of the 0.25° value", [float(g1.dFdx[i1, j1]) * 1e5, float(g1.dFdy[i1, j1]) * 1e5], [dTdx, dTdy], 0.1)
    adv = call(DA + "advection", "s26", "u_j ∂T/∂x_j on the sphere (F2)", heavy_call=True, F=T18, u=s18.u.values.astype(float),
               v=s18.v.values.astype(float), lat=lat8, lon=lon8)
    a_bp = float(adv[i0, j0])
    east_t, north_t = p18["u"] * dTdx * 1e-5, p18["v"] * dTdy * 1e-5
    row("VI12", "east term ≈ -1.86e-4, north ≈ -8.37e-4, sum ≈ -1.02e-3 K/s", [east_t, north_t, a_bp], [-1.86e-4, -8.37e-4, -1.02e-3], [1e-5, 2e-5, 2e-5])
    row("VI12", "advection = -3.68 K/h (spoken -3.7)", a_bp * 3600, -3.68, 0.05)
    row("VI12", "screen terms: 5.8×(-3.2e-5) = -1.86e-4 ≈ -1.9e-4; 33.5×(-2.5e-5) = -8.375e-4 ≈ -8.4e-4", [5.8 * -3.2e-5, 33.5 * -2.5e-5], [-1.9e-4, -8.4e-4], [5e-6, 5e-6])
    row("VI12", "screen sum ≈ -1.0e-3 K/s and ×3600 ≈ -3.7 K/h", [5.8 * -3.2e-5 + 33.5 * -2.5e-5, (5.8 * -3.2e-5 + 33.5 * -2.5e-5) * 3600], [-1.0e-3, -3.7], [3e-5, 0.06])
    truth("VI12", "north term ≈ 4× the east term (bar ratio drawn)", 3.5 < north_t / east_t < 5.0, r6(north_t / east_t, 2))
    dot_check = call(GV + "dot", "s26", "u·∇T at the grid point = sum of the two terms", a=[p18["u"], p18["v"]], b=[dTdx * 1e-5, dTdy * 1e-5])
    row("VI12", "dot(u, ∇T) equals advection() at the grid point", dot_check, a_bp, 1e-6)
    easy = 10 * -3e-5 + 30 * -2e-5
    row("VI13", "easy advection = -9e-4 K/s, -3.24 K/h", [easy, easy * 3600], [-9e-4, -3.24], [1e-12, 1e-9])
    row("VI14", "ERA5 850 T 17/19 UTC = 2.4 / 8.2 °C", [p17["T"], p19["T"]], [2.4, 8.2], 0.05)
    row("VI14", "rate (8.2 - 2.4)/2 = 2.9 K/h", (p19["T"] - p17["T"]) / 2, 2.9, 0.05)
    # balloon drift (s31)
    row("VI53", "drift (5.8, 33.5) m/s × 3600 s = (20.9, 120.6) km", [5.8 * 3.6, 33.5 * 3.6], [20.88, 120.6], 1e-9)
    # textures and isotherms for the Brittany / Biscay maps (17-19 UTC)
    la0, la1, lo0, lo1 = BOX_T
    m = (lat8 >= la0) & (lat8 <= la1)
    n = (lon8 >= lo0) & (lon8 <= lo1)
    blat, blon = lat8[m], lon8[n]
    t850 = {}
    for h in (17, 18, 19):
        Th = e8.sel(time=f"2023-11-01T{h:02d}").t.values.astype(float)[np.ix_(m, n)] - 273.15
        t850[str(h)] = {"tex": field_png(Th, blat, blon, "cmocean.thermal", -6.0, 16.0, IMG / f"t850_{h}.png", up=4),
                        "iso": contours(Th, blat, blon, np.arange(-6.0, 17.0, 2.0), nd=2)}
    # wind arrows (s05: wide box 1.5° grid; Brittany maps: 0.75°) at 18 UTC and 17 UTC
    def arrows(time, step_deg, box):
        s = e8.sel(time=time)
        la = np.arange(box[0], box[1] + 1e-9, step_deg)
        lo = np.arange(box[2], box[3] + 1e-9, step_deg)
        LA, LO = np.meshgrid(la, lo, indexing="ij")
        uu_ = bilin(s.u.values, lat8, lon8, LA, LO)
        vv_ = bilin(s.v.values, lat8, lon8, LA, LO)
        return [[r6(LA[i, j], 2), r6(LO[i, j], 2), r6(uu_[i, j], 2), r6(vv_[i, j], 2)] for i in range(la.size) for j in range(lo.size)]
    wide = arrows("2023-11-01T18", 1.5, (42.0, 55.5, -31.5, 7.5))
    sp = np.array([np.hypot(x[2], x[3]) for x in wide])
    rng("s05", "850 hPa stream west of France: max of the arrow grid 35-48N 15-5W > 30 m/s",
        float(max(np.hypot(x[2], x[3]) for x in wide if 43 <= x[0] <= 50 and -12 <= x[1] <= -3)), 30.0, 60.0)
    V["e850"] = {"pt": {str(k): {kk: r6(vv, 4) for kk, vv in val.items()} for k, val in pts.items()}, "norm18": r6(n850, 3), "uu": r6(uu, 3),
                 "along": r6(aa, 4), "along_full": r6(aa_full, 4), "e_along": r6(ea, 4), "dot_along": r6(dalong, 4),
                 "dTdx_100km": r6(dTdx, 4), "dTdy_100km": r6(dTdy, 4), "dTdx_1deg": r6(float(g1.dFdx[i1, j1]) * 1e5, 4),
                 "dTdy_1deg": r6(float(g1.dFdy[i1, j1]) * 1e5, 4), "adv_Ks": r6(a_bp, 8), "adv_Kh": r6(a_bp * 3600, 4),
                 "east_term": r6(east_t, 8), "north_term": r6(north_t, 8), "t850": t850, "arrows_wide": wide, "max_wide": r6(sp.max(), 2),
                 "arrows_br18": arrows("2023-11-01T18", 0.75, (45.0, 52.0, -10.0, 1.0)),
                 "arrows_br17": arrows("2023-11-01T17", 0.75, (45.0, 52.0, -10.0, 1.0))}

    # transects for s25 (100 km east and north of the grid point along the 0.25° grid: values sampled bilinearly)
    km = np.linspace(0, 100, 21)
    lat_e = np.full_like(km, BREST_GP[0])
    lon_e = BREST_GP[1] + km * 1e3 / (EARTH_RADIUS * np.cos(BREST_GP[0] * DEG)) / DEG
    lat_n = BREST_GP[0] + km * 1e3 / EARTH_RADIUS / DEG
    lon_n = np.full_like(km, BREST_GP[1])
    V["e850"]["transect"] = {"km": r6(km, 1), "east_lon": r6(lon_e, 4), "north_lat": r6(lat_n, 4),
                             "T_east": r6(bilin(T18, lat8, lon8, lat_e, lon_e) - 273.15, 3), "T_north": r6(bilin(T18, lat8, lon8, lat_n, lon_n) - 273.15, 3)}

    # ================================================================ ERA5 pressure levels (D1) — s09 w, z850
    pl = xr.open_dataset(FPL).sel(time="2023-11-01T18", level=850.0, lat=BREST_GP[0], lon=BREST_GP[1])
    w = call(GA + "omega_to_w", "s09", "w ≈ -ω/(ρg), ρ = p/(R T_v) (Vallis §2.6.2 ω ≡ Dp/Dt, hydrostatic)",
             omega=float(pl.w), p=85000.0, T=float(pl.t), q=float(pl.q))
    rng("VI16", "w over Brest 850 hPa 18 UTC ∈ [0.05, 0.3] m/s ('about ten centimetres per second')", w, 0.05, 0.3)
    row("VI16", "w ≈ 0.10 m/s (spoken 'about ten centimetres')", w, 0.10, 0.015)
    rng("VI16", "|u_850| / w > 300 ('more than three hundred times slower')", n850 / w, 300, 400)
    rng("VI17", "z_850 over Brest ∈ [1.0, 1.4] km ('a little more than a kilometre')", float(pl.zh) / 1e3, 1.0, 1.4)
    V["column"] = {"w": r6(w, 4), "z850_m": r6(float(pl.zh), 1), "omega": r6(float(pl.w), 4), "ratio": r6(n850 / w, 1)}

    # ================================================================ GFS 250 hPa jet (D4) — s12a
    gf = xr.open_dataset(FGFS).sel(level=250.0)
    glat, glon = gf.lat.values.astype(float), gf.lon.values.astype(float)
    spd = np.hypot(gf.u.values, gf.v.values).astype(float)
    k = np.unravel_index(np.nanargmax(spd), spd.shape)
    row("VI41", "GFS 2026-10-28T18 250 hPa jet maximum = 66.1 m/s (spoken 'about sixty-five')", spd[k], 66.1, 0.05)
    row("VI41", "jet max at 40.0 N 51.75 W", [glat[k[0]], glon[k[1]]], [40.0, -51.75], 1e-6)
    row("VI42", "250 + 50 = 300, 250 - 50 = 200", [250 + 50, 250 - 50], [300, 200], 0)
    gsub = (slice(None, None, 2), slice(None, None, 2))
    jet_tex = field_png(spd[gsub], glat[::2], glon[::2], "cmocean.speed", 0.0, 80.0, IMG / "gfs250_speed.png", up=3)
    ga = []
    for la in np.arange(26.0, 72.1, 3.0):
        for lo in np.arange(-96.0, 18.1, 4.0):
            ii, jj = int(np.argmin(abs(glat - la))), int(np.argmin(abs(glon - lo)))
            ga.append([r6(la, 1), r6(lo, 1), r6(float(gf.u.values[ii, jj]), 1), r6(float(gf.v.values[ii, jj]), 1)])
    V["jet"] = {"tex": jet_tex, "arrows": ga, "max": {"lat": r6(glat[k[0]], 2), "lon": r6(glon[k[1]], 2), "speed": r6(spd[k], 2)},
                "valid": str(gf.attrs.get("valid_time", "2026-10-28T18:00Z"))}
    from fluidpy.geo import sphere as SP
    route = [SP.great_circle_distance(40.64, -73.78, 51.47, -0.45)]
    V["jet"]["route_km"] = r6(np.asarray(route[0]) / 1e3, 1)

    # ================================================================ s12b, s12c, s12e easy numbers
    sab = call(GV + "norm", "s12b", "|(50, 250)|", a=[50.0, 250.0])
    row("VI43", "√(50² + 250²) = 254.95 ≈ 255", sab, 254.95, 5e-3)
    P, Cc, Fr = np.array([0, 12.5]), np.array([6.0, -8.0]), np.array([-6.0, -4.5])
    row("VI44", "force sum (0, 12.5) + (6, -8) + (-6, -4.5) = (0, 0)", P + Cc + Fr, [0, 0], 1e-12)
    cu = call(GV + "dot", "s12c", "Coriolis push ⟂ wind: (6, -8)·(8, 6) = 0", a=[6.0, -8.0], b=[8.0, 6.0])
    row("VI44", "C ⟂ u (dot = 0)", cu, 0.0, 1e-12)
    truth("VI44", "friction antiparallel to the wind: (-6, -4.5) = -0.75 (8, 6)", np.allclose(Fr, -0.75 * np.array([8, 6])))
    f48 = 2 * 7.292115e-5 * np.sin(BREST[0] * DEG)
    row("VI44", "|C| = 10e-4 m/s² = f|u| -> |u| = 1e-3 / f(48.45°) ≈ 9.2 m/s (consistent with Brest 9.3)", 1e-3 / f48, 9.2, 0.05)
    ang = np.degrees(np.arctan2(6, 8))
    rng("s12c", "wind (8, 6) crosses the east-west isobars at about 37°", ang, 36.5, 37.0)
    row("VI46", "(5, 1) - (1, 3) = (4, -2)", np.array([5, 1]) - np.array([1, 3]), [4, -2], 0)
    V["easy"] = {"sab": r6(sab, 3), "f48": r6(f48, 9), "u_from_C": r6(1e-3 / f48, 3), "cross_angle": r6(ang, 2)}

    # ================================================================ A4 surface (msl, u10, v10) — s05 L, s12d, s12i
    a4 = open_a4()
    alat, alon = a4.lat.values.astype(float), a4.lon.values.astype(float)
    from fluidpy.diag import cyclone as CY
    track = []
    prev = None
    for hh in ["2023-11-01T16", "2023-11-01T17", "2023-11-01T18", "2023-11-01T19", "2023-11-01T20", "2023-11-01T21", "2023-11-01T22",
               "2023-11-01T23", "2023-11-02T00"]:
        ms = a4.sel(time=hh).msl.values.astype(float)
        box = (44.0, 54.0, -16.0, -8.0) if prev is None else (prev[0] - 2.0, prev[0] + 2.0, prev[1] - 3.0, prev[1] + 3.0)
        c = CY.storm_centre(ms, alat, alon, box=box)
        if prev is not None:
            step = SP.great_circle_distance(prev[0], prev[1], c.lat, c.lon) / 1e3
            rng("VI50", f"storm continuity: {hh} step from previous hour ≤ 150 km", step, 0.0, 150.0)
        prev = (float(c.lat), float(c.lon))
        track.append({"t": hh, "lat": r6(c.lat, 3), "lon": r6(c.lon, 3), "hPa": r6(c.msl_min / 100, 2)})
    entries.append({"fn": "fluidpy.diag.cyclone.storm_centre", "scene": "s12i", "data": "data/vi.json",
                    "eq": "minimum of msl, tracked by continuity (box ±2° lat, ±3° lon round the previous hour)", "params": None,
                    "sha256": None, "note": "grid input; recorded with its outputs in vi.json -> storm.track"})
    t18 = next(x for x in track if x["t"].endswith("01T18"))
    t00 = next(x for x in track if x["t"].endswith("02T00"))
    dist = call(GS + "great_circle_distance", "s12i", "Ciarán's centre 18 UTC -> 00 UTC", lat1=t18["lat"], lon1=t18["lon"], lat2=t00["lat"], lon2=t00["lon"])
    brg = call(GS + "initial_bearing", "s12i", "direction of motion", lat1=t18["lat"], lon1=t18["lon"], lat2=t00["lat"], lon2=t00["lon"])
    cvel = np.array([np.sin(brg * DEG), np.cos(brg * DEG)]) * dist / (6 * 3600.0)
    row("VI50", "storm displacement 449 ± 30 km in 6 h ('about four hundred and fifty')", dist / 1e3, 449.0, 30.0)
    row("VI50", "c ≈ (20.1, 5.1) ± 1 m/s (spoken (20, 5))", cvel, [20.1, 5.1], 1.0)
    row("VI50", "screen u - c = (5.8 - 20, 33.5 - 5) = (-14.2, 28.5) ≈ (-14, 28)", [5.8 - 20, 33.5 - 5], [-14, 28.5], [0.25, 0.51])
    row("VI50", "full precision u - c ≈ (-14.3, 28.4)", [p18["u"] - cvel[0], p18["v"] - cvel[1]], [-14.3, 28.4], 1.0)
    row("s05", "Ciarán's central pressure 18 UTC ≈ 961 hPa (L label)", t18["hPa"], 961.0, 0.6)
    # isobars hourly 18 -> 00 UTC (box 40-56N, 20W-6E)
    bm = (alat >= 40) & (alat <= 56)
    bn = (alon >= -20) & (alon <= 6)
    isob = {}
    for hh in ["2023-11-01T18", "2023-11-01T19", "2023-11-01T20", "2023-11-01T21", "2023-11-01T22", "2023-11-01T23", "2023-11-02T00"]:
        ms = a4.sel(time=hh).msl.values.astype(float)[np.ix_(bm, bn)] / 100
        isob[hh] = contours(ms, alat[bm], alon[bn], np.arange(940.0, 1033.0, 4.0), nd=2)
    # geostrophic wind (F5) at the sea point + 12 neighbours
    h18 = a4.sel(time="2023-11-01T18")
    ug, vg = call(GA + "geostrophic_wind_from_msl", "s12d", "u_g = -(1/ρ0 f) ∂p/∂y, v_g = (1/ρ0 f) ∂p/∂x (Vallis §2.8)", heavy_call=True,
                  msl=h18.msl.values.astype(float), lat=alat, lon=alon)
    ia, ja = int(np.argmin(abs(alat - SEA_PT[0]))), int(np.argmin(abs(alon - SEA_PT[1])))
    u10, v10 = float(h18.u10.values[ia, ja]), float(h18.v10.values[ia, ja])
    row("VI45", "u_g at 48N 6W = (30.9, 24.9) ± 1", [ug[ia, ja], vg[ia, ja]], [30.9, 24.9], 1.0)
    row("VI45", "real 10-m wind = (10.0, 18.0) ± 0.2", [u10, v10], [10.0, 18.0], 0.2)
    row("VI45", "u_ag = u - u_g = (-20.9, -6.9) (screen)", [10.0 - 30.9, 18.0 - 24.9], [-20.9, -6.9], 1e-9)
    row("VI45", "u_ag at full precision ≈ (-20.8, -6.9)", [u10 - ug[ia, ja], v10 - vg[ia, ja]], [-20.9, -6.9], 0.3)
    nb12 = []
    for la in (46.5, 47.5, 49.0, 50.0):
        for lo in (-11.0, -9.0, -7.5):
            ii, jj = int(np.argmin(abs(alat - la))), int(np.argmin(abs(alon - lo)))
            nb12.append([r6(alat[ii], 2), r6(alon[jj], 2), r6(ug[ii, jj], 2), r6(vg[ii, jj], 2), r6(h18.u10.values[ii, jj], 2), r6(h18.v10.values[ii, jj], 2)])
    V["storm"] = {"track": track, "dist_km": r6(dist / 1e3, 1), "bearing": r6(brg, 1), "c": r6(cvel, 3), "isobars": isob,
                  "sea_pt": {"lat": r6(alat[ia], 2), "lon": r6(alon[ja], 2), "ug": r6(ug[ia, ja], 3), "vg": r6(vg[ia, ja], 3), "u10": r6(u10, 3), "v10": r6(v10, 3)},
                  "neighbours": nb12}

    # ================================================================ IGRA2 Trappes (A10) — s12g
    ig = xr.open_dataset(FIGRA).sel(station="FRM00007145")
    nl = int(ig.n_levels)
    lev = []
    for kk in range(nl):
        pp = float(ig.p.values[kk]) / 100
        if pp < 495 or not np.isfinite(ig.wdir.values[kk]) or not np.isfinite(ig.wspd.values[kk]):
            continue
        zz = float(ig.z.values[kk]) if np.isfinite(ig.z.values[kk]) else float(ig.z_hyps.values[kk])
        uu_, vv_ = call(GA + "wind_components", "s12g", "IGRA from-direction -> (u, v)", speed=float(ig.wspd.values[kk]),
                        dir_from_deg=float(ig.wdir.values[kk]))
        lev.append({"p": r6(pp, 1), "z": r6(zz, 0), "dir": float(ig.wdir.values[kk]), "spd": float(ig.wspd.values[kk]), "u": r6(uu_, 2), "v": r6(vv_, 2)})
    l850 = next(x for x in lev if x["p"] == 850.0)
    l500 = next(x for x in lev if x["p"] == 500.0)
    row("VI47", "Trappes 850 hPa: 235°, 17 m/s -> (13.9, 9.8), z 1402 m", [l850["dir"], l850["spd"], l850["u"], l850["v"], l850["z"]], [235, 17, 13.93, 9.75, 1402], [0, 0, 0.01, 0.01, 0])
    row("VI47", "Trappes 500 hPa: 255°, 17 m/s -> (16.4, 4.4), z 5550 m", [l500["dir"], l500["spd"], l500["u"], l500["v"], l500["z"]], [255, 17, 16.42, 4.40, 5550], [0, 0, 0.01, 0.01, 0])
    shear = np.array([16.4 - 13.9, 4.4 - 9.8])
    row("VI48", "shear (16.4, 4.4) - (13.9, 9.8) = (2.5, -5.4)", shear, [2.5, -5.4], 1e-9)
    nsh = call(GV + "norm", "s12g", "|shear|", a=shear.tolist())
    row("VI48", "|shear| ≈ 5.95 ('about six')", nsh, 5.95, 0.01)
    truth("VI48", "veering: direction 235° (850) -> 255° (500), clockwise going up", l500["dir"] > l850["dir"])
    V["sounding"] = {"levels": lev, "shear": r6(shear, 2), "nshear": r6(nsh, 3), "station": "Trappes FRM00007145", "launch": "2023-11-01T00 UTC",
                     "lat": r6(float(ig.station_lat), 3), "lon": r6(float(ig.station_lon), 3)}

    # ================================================================ ERA5 monthly (D5) — s12h
    mo = xr.open_dataset(FMON)
    mlat, mlon = mo.lat.values.astype(float), mo.lon.values.astype(float)
    U = mo.u10.values.astype(float)
    Vv = mo.v10.values.astype(float)
    tt = mo.time.values
    years = [int(str(x)[:4]) for x in tt]
    import pandas as _pd
    tidx = _pd.DatetimeIndex(tt)
    Ux = xr.DataArray(U, dims=("time", "lat", "lon"), coords={"time": tidx, "lat": mlat, "lon": mlon})
    Vx = xr.DataArray(Vv, dims=("time", "lat", "lon"), coords={"time": tidx, "lat": mlat, "lon": mlon})
    ua, uclim, _u23 = call(DC + "monthly_anomaly", "s12h", "u' = u_2023 - mean(Nov 1991-2020)", heavy_call=True, field=Ux, month=11, year=2023, return_parts=True)
    va, vclim, _v23 = call(DC + "monthly_anomaly", "s12h", "v' (component-wise vector anomaly)", heavy_call=True, field=Vx, month=11, year=2023, return_parts=True)
    ua, va, uclim, vclim = (np.asarray(x, float) for x in (ua, va, uclim, vclim))
    u23 = U[years.index(2023)]
    v23 = Vv[years.index(2023)]
    row("VI49", "builder anomaly = stored u10_anom_2023 (data-scout product)", np.nanmax(np.abs(ua - mo.u10_anom_2023.values)), 0.0, 1e-4)
    bl = (mlat >= -5) & (mlat <= 5)
    bo = (mlon >= -170) & (mlon <= -150)
    wts = np.cos(mlat[bl] * DEG)[:, None] * np.ones(bo.sum())[None, :]

    def bmean(F):
        return float((F[np.ix_(bl, bo)] * wts).sum() / wts.sum())
    bc, b23, ban = bmean(uclim), bmean(u23), bmean(ua)
    row("VI49", "box 5S-5N 170-150W cos-lat mean: clim -5.04, Nov 2023 -3.72, anomaly +1.32 m/s", [bc, b23, ban], [-5.04, -3.72, 1.32], 0.006)
    truth("VI49", "anomaly sign > 0 (trades weakened)", ban > 0, r6(ban, 3))
    row("VI49", "screen (-3.7) - (-5.0) = +1.3", -3.7 - (-5.0), 1.3, 1e-9)
    grid = []
    for la in np.arange(-18.0, 18.1, 4.0):
        for lo360 in np.arange(132.0, 280.1, 6.0):
            lo = lo360 if lo360 < 180 else lo360 - 360
            ii, jj = int(np.argmin(abs(mlat - la))), int(np.argmin(abs(mlon - lo)))
            grid.append([r6(la, 1), r6(lo360, 1), r6(uclim[ii, jj], 2), r6(vclim[ii, jj], 2), r6(u23[ii, jj], 2), r6(v23[ii, jj], 2),
                         r6(ua[ii, jj], 2), r6(va[ii, jj], 2)])
    V["anomaly"] = {"grid": grid, "box": {"lat": [-5, 5], "lon360": [190, 210], "clim": r6(bc, 3), "y2023": r6(b23, 3), "anom": r6(ban, 3)},
                    "cols": ["lat", "lon360", "u_clim", "v_clim", "u_2023", "v_2023", "u_anom", "v_anom"]}

    # ================================================================ index notation, δ, ε (s13-s19, s28-s32, s34)
    IX = {}
    for term in ["u_i", "p_i q_i", "p_j q_j", "u_i u_i", "u_j T,j", "u_j u_i,j", "delta_ij u_j", "delta_ii", "delta_ij p_i q_j", "u_j x_i,j", "x_i,j"]:
        fr, du = call(CI + "classify_indices", "s13-s32", f"free / dummy indices of {term}", term=term)
        od = call(CI + "tensor_order", "s17", f"order of {term}", term=term)
        IX[term] = {"free": fr, "dummy": du, "order": od, "expanded": call(CI + "expand_indices_str", "s28", f"written out: {term}", term=term)}
    truth("s17", "p_i q_i order 0 (scalar), u_i order 1 (vector)", IX["p_i q_i"]["order"] == 0 and IX["u_i"]["order"] == 1)
    truth("s28", "u_j u_i,j: one free (i), one dummy (j) -> 3 equations × 3 terms = 9", IX["u_j u_i,j"]["free"] == ["i"] and IX["u_j u_i,j"]["dummy"] == ["j"]
          and IX["u_j u_i,j"]["expanded"].count("Derivative") == 9)
    rd = call(CI + "rename_dummy", "s17", "dummy letters do not matter", term="p_i q_i", old="i", new="j")
    truth("s17", "rename_dummy(p_i q_i, i -> j) = p_j q_j", rd == "p_j q_j", rd)
    try:
        importlib.import_module("fluidpy.core.index_notation").classify_indices("p_i q_i s_i")
        bad3 = False
    except ValueError:
        bad3 = True
    truth("s17", "p_i q_i s_i is rejected (index three times)", bad3)
    dl = call(CT + "kronecker_delta", "s29", "δ_ij = e_i · e_j", n=3)
    E = np.eye(3)
    ee = np.array([[call(GV + "dot", "s29", f"e_{i + 1} · e_{j + 1}", a=E[i].tolist(), b=E[j].tolist()) for j in range(3)] for i in range(3)])
    row("VI18", "δ = eye(3) = table of e_i · e_j", [np.abs(np.asarray(dl) - np.eye(3)).max(), np.abs(ee - np.eye(3)).max()], [0, 0], 0)
    row("VI18", "δ_ii = 3", float(np.trace(dl)), 3.0, 0)
    truth("s30", "δ_ij u_j = u_i written out", IX["delta_ij u_j"]["expanded"].replace(" ", "") == "result_1=u_1\nresult_2=u_2\nresult_3=u_3".replace(" ", ""))
    truth("s32", "δ_ij p_i q_j = p_i q_i", IX["delta_ij p_i q_j"]["expanded"] == IX["p_i q_i"]["expanded"])
    eps = call(CT + "levi_civita", "s34", "ε_ijk (teaser cube)")
    epsA = np.asarray(eps)
    nz = [[int(i) + 1, int(j) + 1, int(kk) + 1, int(epsA[i, j, kk])] for i in range(3) for j in range(3) for kk in range(3) if epsA[i, j, kk] != 0]
    truth("VI19", "six non-zero ε cells (+1 cyclic, -1 reversed)", len(nz) == 6 and sorted(x[3] for x in nz) == [-1, -1, -1, 1, 1, 1], nz)
    from fluidpy.core import rotating as RO
    Om = 7.292115e-5 * np.array([0.0, np.cos(BREST[0] * DEG), np.sin(BREST[0] * DEG)])
    cor = RO.coriolis_acceleration(Om, np.array([p18["u"], p18["v"], 0.0]))
    cor = np.asarray(cor, float)
    hu = np.array([p18["u"], p18["v"]]) / np.hypot(p18["u"], p18["v"])
    right = np.array([hu[1], -hu[0]])
    truth("VI25", "s34 teaser: the horizontal Coriolis push is ⟂ to the wind and to its right (NH)",
          abs(float(cor[:2] @ hu)) < 1e-9 * np.hypot(*cor[:2]) + 1e-12 and float(cor[:2] @ right) > 0, r6(cor, 8))
    V["index"] = {"terms": IX, "delta": r6(dl, 0), "eps_nonzero": nz, "coriolis_teaser": r6(cor, 8)}

    # ================================================================ globe (D2) and the hook streaklines (s01-s03)
    gb = xr.open_dataset(FGLB).isel(time=0)
    glat2, glon2 = gb.lat.values.astype(float), gb.lon.values.astype(float)
    t2 = gb.t2m.values.astype(float) - 273.15
    globe_tex = field_png(t2, glat2, glon2, "cmocean.thermal", -30.0, 30.0, IMG / "t2m_global.png", up=2, alpha=0.78)
    probes = {"Sahara": (23.0, 13.0), "Siberia": (62.0, 105.0), "Brest": BREST}
    pv = {kname: r6(float(bilin(t2, glat2, glon2, np.array([pp[0]]), np.array([pp[1]]))[0]), 2) for kname, pp in probes.items()}
    rng("s02", "Sahara probe warm (> 15 °C at 18 UTC)", pv["Sahara"], 15, 40)
    rng("s02", "Siberia probe cold (< -10 °C)", pv["Siberia"], -45, -10)
    rng("s02", "ERA5 2-m T at Brest within 2 K of the station's 10.3 °C", pv["Brest"], 8.3, 12.3)
    V["globe"] = {"tex": globe_tex, "probes": {kname: {"lat": probes[kname][0], "lon": probes[kname][1], "T": pv[kname]} for kname in probes},
                  "valid": "2023-11-01T18 UTC"}
    # streaklines: RK2 tracks through the frozen 18 UTC 850 hPa field (illustrative motion, ×20 time compression)
    from scipy.interpolate import RegularGridInterpolator
    fu = RegularGridInterpolator((lat8, lon8), s18.u.values.astype(float), bounds_error=False, fill_value=np.nan)
    fv = RegularGridInterpolator((lat8, lon8), s18.v.values.astype(float), bounds_error=False, fill_value=np.nan)
    rs = np.random.default_rng(7)
    ns, nstep, dt = 420, 24, 900.0
    la = rs.uniform(38.0, 58.0, ns)
    lo = rs.uniform(-25.0, 8.0, ns)
    tr = np.full((ns, nstep, 2), np.nan)

    def vel(la_, lo_):
        q = np.stack([la_, lo_], -1)
        return fu(q), fv(q)
    for s_ in range(nstep):
        tr[:, s_, 0], tr[:, s_, 1] = la, lo
        u1, v1 = vel(la, lo)
        lam = la + 0.5 * dt * v1 / EARTH_RADIUS / DEG
        lom = lo + 0.5 * dt * u1 / (EARTH_RADIUS * np.cos(la * DEG)) / DEG
        u2, v2 = vel(lam, lom)
        la = la + dt * v2 / EARTH_RADIUS / DEG
        lo = lo + dt * u2 / (EARTH_RADIUS * np.cos(lam * DEG)) / DEG
    # V1 row of the integrator: uniform flow 10 m/s east for 1 h moves 36 km east
    lat_t, lon_t = 45.0, 0.0
    for _ in range(4):
        lon_t = lon_t + dt * 10.0 / (EARTH_RADIUS * np.cos(lat_t * DEG)) / DEG
    row("s01", "RK2 track integrator V1: 10 m/s east for 1 h = 36 km", (lon_t * DEG) * EARTH_RADIUS * np.cos(45 * DEG) / 1e3, 36.0, 1e-6)
    good = np.isfinite(tr).all(axis=(1, 2))
    V["streaks"] = {"n": int(good.sum()), "steps": nstep, "dt_s": dt, "time_compression": 20,
                    "tracks": [np.round(tr[ii].ravel(), 2).tolist() for ii in np.where(good)[0]]}

    # ================================================================ relief (ETOPO 2022 Brittany) — s04, s06, s07, s12 floors
    et = xr.open_dataset(ETOPO)
    zt = et.z.values.astype(float)
    elat, elon = et.lat.values.astype(float), et.lon.values.astype(float)
    if elat[0] > elat[-1]:
        zt, elat = zt[::-1], elat[::-1]
    from matplotlib.colors import LightSource
    from PIL import Image
    ls = LightSource(azdeg=315, altdeg=40)
    dx = (elon[1] - elon[0]) * 111e3 * np.cos(48.4 * DEG)
    dy = (elat[1] - elat[0]) * 111e3
    hs = ls.hillshade(zt, vert_exag=6, dx=dx, dy=dy)
    land = zt > 0
    sea_rgb = np.array([22, 52, 86]) / 255.0
    lo_rgb, hi_rgb = np.array([88, 112, 74]) / 255.0, np.array([170, 150, 112]) / 255.0
    tz = np.clip(zt / 300.0, 0, 1)[..., None]
    base = np.where(land[..., None], lo_rgb * (1 - tz) + hi_rgb * tz, sea_rgb + 0.06 * np.clip(zt / -100.0, 0, 1)[..., None] * -1)
    shade = np.where(land[..., None], 0.55 + 0.6 * hs[..., None], 0.9 + 0.1 * hs[..., None])
    rgb = np.clip(base * shade, 0, 1)[::-1]
    im = Image.fromarray((rgb * 255).astype(np.uint8)).resize((rgb.shape[1] * 3, rgb.shape[0] * 3), Image.BICUBIC)
    im.save(IMG / "relief_brittany.png", optimize=True)
    rng("s04", "ETOPO Brittany: highest point < 400 m (Monts d'Arrée)", float(np.nanmax(zt)), 300, 400)
    V["relief"] = {"file": "img/relief_brittany.png", "lat_edges": [float(elat[0]) - 0.5 / 60, float(elat[-1]) + 0.5 / 60],
                   "lon_edges": [float(elon[0]) - 0.5 / 60, float(elon[-1]) + 0.5 / 60], "zmax": r6(float(np.nanmax(zt)), 0)}

    # ================================================================ lines (Natural Earth, public domain)
    ne110 = json.loads((CP_REAL / "ne_lines_110m.json").read_text(encoding="utf-8"))
    V["lines"] = {"globe_coast_110m": ne110["coastline"],
                  "coast_10m": gj_lines(DER / "ciaran_coast_10m.geojson", (34.0, 66.0, -42.0, 12.0), nd=3),
                  "borders_10m": gj_lines(DER / "ciaran_borders_10m.geojson", (34.0, 66.0, -42.0, 12.0), nd=3)}
    V["luts"] = {"thermal": lut_hex("cmocean.thermal"), "speed": lut_hex("cmocean.speed"), "haline": lut_hex("cmocean.haline")}
    V["images"] = {"truecolour_1101": {"file": "vi_tc_20231101.jpg", "lat_edges": [35.0, 65.0], "lon_edges": [-40.0, 10.0]},
                   "globe_1101": {"file": "vi_globe_tc_20231101.jpg"}, "bmng": {"file": "vi_bmng.jpg"}}

    # ---------------------------------------------------------------------------------------------- report and write
    for r in rows:
        print(f"  {'PASS' if r['pass'] else 'FAIL'}  {r['id']:6s} {r['name']}  -> {r['value']}")
    if not all(r["pass"] for r in rows):
        print("build_ch00_vectors_index_notation: checks FAILED — no data written")
        return 1
    blob = json.dumps(V, separators=(",", ":"), ensure_ascii=False, allow_nan=False).encode("utf-8")
    (DATA / "vi.json").write_bytes(blob)
    data_hashes = {"vi.json": hashlib.sha256(blob).hexdigest()}
    for p in sorted(IMG.glob("*.png")):
        data_hashes[f"img/{p.name}"] = sha_file(p)
    render = {}
    if a.public:
        a.public.mkdir(parents=True, exist_ok=True)
        Image.MAX_IMAGE_PIXELS = None
        g_im = Image.open(FGIBS).convert("RGB").resize((4096, 2048), Image.LANCZOS)
        g_im.save(a.public / "vi_globe_tc_20231101.jpg", quality=88)
        Image.open(FTC).convert("RGB").save(a.public / "vi_tc_20231101.jpg", quality=90)
        Image.open(CP_REAL / "globe_bmng_topo_bathy_200409_5400x2700.jpg").convert("RGB").resize((4096, 2048), Image.LANCZOS).save(a.public / "vi_bmng.jpg", quality=88)
        for p in sorted(IMG.glob("*.png")):
            (a.public / f"vi_{p.name}").write_bytes(p.read_bytes())
        render = {p.name: sha_file(p) for p in sorted(a.public.glob("vi_*"))}
    inputs = {str(p.relative_to(ROOT)).replace("\\", "/") if ROOT in p.parents else str(p): sha_file(p)
              for p in [F850, FPL, FGLB, FMON, FGFS, FIGRA, FGIBS, FTC, A4, ISD, ETOPO, DER / "ciaran_coast_10m.geojson",
                        DER / "ciaran_borders_10m.geojson", CP_REAL / "ne_lines_110m.json", CP_REAL / "globe_bmng_topo_bathy_200409_5400x2700.jpg"]}
    manifest = {
        "id": "ch00_vectors_index_notation", "storyboard": "movies/ch00/ch00_vectors_index_notation/storyboard.yaml",
        "builder": "movies/data/build_ch00_vectors_index_notation.py",
        "fluidpy": {"repo": "../Fluid Dynamics", **git_sha(FLUID, {
            "vectors_py": "fluidpy/geo/vectors.py", "atmos_py": "fluidpy/geo/atmos.py", "sphere_py": "fluidpy/geo/sphere.py",
            "advection_py": "fluidpy/diag/advection.py", "cyclone_py": "fluidpy/diag/cyclone.py", "climatology_py": "fluidpy/diag/climatology.py",
            "tensors_py": "fluidpy/core/tensors.py", "index_notation_py": "fluidpy/core/index_notation.py", "isd_py": "fluidpy/data/isd.py"})},
        "equations_note": "provenance only (QA/reviewer); the movie draws no equation labels or numbers (HOUSE_STYLE §5)",
        "equations": {"basis/position": "Kundu (2.1) x = x_i e_i (p067)", "summation": "Kundu (2.2) (p068)",
                      "kronecker": "Kundu (2.16), (2.17) (p077-p078); App. B (B.3.1), (B.3.4)", "cross_teaser": "Kundu (2.21) (p079), s34 only",
                      "omega": "Vallis §2.6.2 ω ≡ Dp/Dt (p099) with ∂p/∂z = -ρg", "geostrophic": "Vallis §2.8 geostrophic balance"},
        "parameters": {"brest_station": BREST, "brest_grid_point": BREST_GP, "sea_point_s12d": SEA_PT, "rho0_geostrophic": 1.25,
                       "coast_axis_bearing_deg": 80, "storm_track": "msl minimum tracked by continuity from 16 UTC (box 44-54N 16-8W)",
                       "time_compression": {"s01": "streaklines ×20 (15-min RK2 steps, frozen 18 UTC field)", "s12f": "1 h of wind change in ~4 s",
                                            "s12i": "6 h of storm motion in ~6 s", "s31": "balloon 1 h in ~6 s", "s00": "17 -> 19 UTC in a few seconds"},
                       "exaggerations": ["s06/s12 relief floor ×6 hillshade (a floor only)", "s09 column: height ×10, w arrow ×50",
                                         "s12g column ×10 vertical", "arrow scales per scene (speeds and accelerations share no scale)"]},
        "credits": [
            "Contains modified Copernicus Climate Change Service information 2026 (ERA5 hourly 850 hPa, pressure levels, global hour, Ciarán surface, monthly means).",
            "NOAA NCEP GFS 0.25° analysis 2026-10-28T18 (public domain), via Unidata THREDDS.",
            "Durre, I., et al.: Integrated Global Radiosonde Archive (IGRA) v2, NOAA NCEI (Trappes 00 UTC 1 Nov 2023).",
            "NOAA NCEI Integrated Surface Database (ISD): Brest-Guipavas 07110 SYNOP.",
            "Imagery from the NASA Worldview application, part of NASA ESDIS (MODIS Aqua/Terra Corrected Reflectance, NASA LANCE / GIBS).",
            "Blue Marble: Next Generation, NASA Earth Observatory (Reto Stöckli, NASA GSFC).",
            "ETOPO 2022 Global Relief Model, NOAA NCEI (public domain), doi:10.25921/fd45-gt74.",
            "Made with Natural Earth (public domain).",
            "Music: tools/sound (procedural synthesis, our own code, CC0-1.0), style index-lattice seed 11."],
        "js_selftest": "none — the composition has no JS physics; every number is read from data/vi.json (TSX CHECK rows re-assert the screen strings)",
        "narration_changes_from_data": narration_changes,
        "inputs_sha256": inputs, "render_assets": render, "data_files": data_hashes, "checks": rows, "physics": [e for e in entries if e.get("sha256")],
        "physics_recorded": [e for e in entries if not e.get("sha256")], "physics_heavy": heavy,
    }
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=1, ensure_ascii=False, default=str), encoding="utf-8")
    print(f"build_ch00_vectors_index_notation: vi.json {len(blob) / 1e3:.0f} kB + {len(data_hashes) - 1} png; {len(entries)} parity entries, "
          f"{len(heavy)} heavy, {len(rows)} checks -> {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
