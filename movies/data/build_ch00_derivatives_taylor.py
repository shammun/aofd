"""Physics and real-data products for the Chapter-0 movie #4 "Derivatives and Taylor series: the rate a balloon feels,
and why the saturation vapour pressure of water rises about 7 % per degree" (movies/ch00/ch00_derivatives_taylor/
storyboard.yaml v1, 49 scenes; CHECK rows DT01-DT73 of data_needs.md §D).

Run with the main venv::

    .venv/Scripts/python.exe movies/data/build_ch00_derivatives_taylor.py [--public <render public dir>]

Every number the movie shows or says is computed here by the tested functions named in the storyboard's
``physics_source`` fields:

* ``fluidpy.geo.calculus`` (``secant_slopes``, ``taylor_polynomial``, ``total_differential``, ``chain_rule_rate``,
  ``mixed_partials``, ``exactness_residual``, ``polygon_path``, ``loop_integral``),
* ``fluidpy.geo.sphere.gradient``, ``fluidpy.diag.advection.advection``, ``fluidpy.geo.atmos`` (``wind_components``,
  ``scale_height``, ``layer_mean_temperature``), ``fluidpy.diag.sounding`` (``ascent_rates``, ``drift``,
  ``layer_lapse_rate``), ``fluidpy.data.igra`` (``find_sounding``, ``fill_heights``, ``wmo_tropopause``),
  ``fluidpy.data.isd`` (``read``, ``decode``),
* ``fluidpy.core.thermo`` (``perfect_gas_pressure``, ``perfect_gas_density``, ``process_path``, ``path_heat_work_totals``,
  ``perfect_gas_entropy_change``, ``partial_derivative``), ``fluidpy.core.statics`` (``isothermal_pressure``),
  ``fluidpy.core.stratification.lapse_rate_convention``, ``fluidpy.core.fd`` (``stencil_error``,
  ``stencil_taylor_coefficients``, ``taylor_table_sympy``, ``fd_derivative``),
* ``fluidpy.geo.moist`` (``saturation_vapour_pressure``, ``cc_fractional_rate``), ``fluidpy.geo.radiation``
  (``blackbody_flux``, ``emission_temperature``, ``planck_response``), ``fluidpy.diag.climatology`` (``global_mean``,
  ``linear_trend``),

on the committed derived data in ``data/derived/ch00/`` (ERA5 850 hPa hourly for Storm Ciarán, ERA5 pressure levels round
Trappes 30 Sep 2026, ERA5 monthly TCWV, CERES EBAF-TOA OLR, GIBS true colour, Natural Earth) and the IGRA2 Trappes file,
the Brest ISD file, the ERA5 Ciarán surface file and the ETOPO 2022 Brittany subset on G:.

Writes movies/ch00/ch00_derivatives_taylor/data/dt.json, data/img/*.png (field textures made from the data with the project
colour maps) and manifest.json (function, provenance, parameters, fluidpy git SHA, sha256 of every input and data file, a
parity hash per light call as tools/movie_qa.py re-computes it, heavy calls by hash). All CHECK rows must pass before
anything is written (exit 1 otherwise). With ``--public`` it also writes the render-only images there.
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
OUT = ROOT / "movies" / "ch00" / "ch00_derivatives_taylor"
DATA = OUT / "data"
IMG = DATA / "img"
DER = ROOT / "data" / "derived" / "ch00"
CP_REAL = ROOT / "movies" / "ch00" / "ch00_cross_product_why" / "data" / "real"
RAW = Path("G:/Geophysical Fluid Dynamics/aofd-data/raw")
A4 = RAW / "ERA5-ARCO" / "era5_ciaran_2023_u10-v10-msl-t2m_2023-11-01T00_2023-11-02T23_1h.nc"
ISD = RAW / "ISD" / "isd_07110099999_2023-11-01_2023-11-02.csv"
ETOPO = RAW / "ETOPO2022-60s" / "etopo2022_60s_brittany_46.5-49.5N_-6.5--1E.nc"
IGRA = RAW / "IGRA2" / "FRM00007145-data-beg2026.txt.zip"
F850 = DER / "era5_ciaran_2023_850hPa_1h.nc"
FTRP = DER / "era5_trappes_pl_t-u-v_850-700-500_2026-09-30T00-12.nc"
FTCWV = DER / "era5_tcwv_global_1979-2026-09.nc"
FOLR = DER / "ceres_ebaf-toa_olr_2000-03_2026-08.nc"
FTC = DER / "ciaran_truecolour_2023-11-01_aqua_terra.jpg"
FTRAP_TC = DER / "trappes_truecolour_2026-09-30_aqua_terra.jpg"
FSTK = DER / "era5_trappes_stack16_t-z_2026-09-30T12.nc"     # fix loop 2: the s09b layer stack (16 levels)
BMNG = CP_REAL / "globe_bmng_topo_bathy_200409_5400x2700.jpg"

sys.path.insert(0, str(FLUID))
import xarray as xr  # noqa: E402

DEG = np.pi / 180.0
BREST = (48.45, -4.42)            # Brest-Guipavas (ISD 07110)
BREST_GP = (48.5, -4.5)           # the ERA5 grid point used for every 850 hPa number
TRAPPES = (48.7744, 2.0097)       # IGRA2 FRM00007145
BOX_T = (44.0, 53.0, -12.0, 4.0)  # 850 hPa field textures (lat0, lat1, lon0, lon1)
CAL, GS, GA, DA, DS, DC = ("fluidpy.geo.calculus.", "fluidpy.geo.sphere.", "fluidpy.geo.atmos.", "fluidpy.diag.advection.",
                           "fluidpy.diag.sounding.", "fluidpy.diag.climatology.")
TH, ST, FD, MO, RA, IG = ("fluidpy.core.thermo.", "fluidpy.core.statics.", "fluidpy.core.fd.", "fluidpy.geo.moist.",
                          "fluidpy.geo.radiation.", "fluidpy.data.igra.")


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
              alpha: float = 1.0, order: int = 3) -> dict:
    """Colour-mapped PNG of F(lat ascending, lon ascending), row 0 = north edge, upsampled ×up (cubic by default;
    order=1 bilinear). Returns the geographic cell edges for the composition's GeoImage."""
    from PIL import Image
    from scipy.ndimage import zoom
    G = np.asarray(F, float)[::-1]
    mask = np.isfinite(G)
    if up > 1:
        G = zoom(np.nan_to_num(G, nan=np.nanmean(G)), up, order=order)
        mask = zoom(mask.astype(float), up, order=0) > 0.5
    t = np.clip((G - lo) / (hi - lo), 0, 1)
    rgb = lut_rgb(lut)[np.round(t * 255).astype(int)]
    a = np.where(mask, int(round(alpha * 255)), 0).astype(np.uint8)[..., None]
    Image.fromarray(np.concatenate([rgb, a], -1).astype(np.uint8), "RGBA").save(path, optimize=True)
    dla, dlo = abs(float(lat[1] - lat[0])), abs(float(lon[1] - lon[0]))
    return {"file": f"img/{path.name}", "lat_edges": [float(lat.min()) - dla / 2, float(lat.max()) + dla / 2],
            "lon_edges": [float(lon.min()) - dlo / 2, float(lon.max()) + dlo / 2], "lut": lut, "range": [lo, hi]}


def contours(F, lat, lon, levels, nd=2, min_pts=4):
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
    for p in IMG.glob("*.png"):
        p.unlink()
    rows: list[dict] = []
    entries: list[dict] = []
    heavy: list[dict] = []
    V: dict = {}
    narration_changes = [
        "s19 S7-S8 (DT26): ERA5 30 Sep 2026 12 UTC |∇T| at Trappes 0.31 / 0.74 / 0.98 K per 100 km (850 / 700 / 500 hPa), sideways "
        "term u·∇T along the drift ≈ 3.3e-5 K/s: 'only about one degree per hundred kilometres ... around one times ten to the minus "
        "four degrees per second' -> 'less than one degree per hundred kilometres ... only a few hundred-thousandths of a degree per second'",
        "s19 S9 (DT27): rising share 99.6 %: 'about ninety nine percent' -> 'more than ninety nine percent'"]

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
            try:
                oh = parity_hash(out if not hasattr(out, "dFdx") else [out.dFdx, out.dFdy])
            except Exception:
                oh = parity_hash(str(out))
            heavy.append({"fn": fn, "scene": scene, "eq": eq, "params": {k: (v if isinstance(v, (int, float, str, type(None)))
                          else f"array {np.shape(v)}, sha256 {parity_hash(v) if not callable(v) else 'callable'}") for k, v in params.items()},
                          "output_sha256": oh})
            return out
        try:
            h = parity_hash(out)
        except Exception:
            h = None
        entries.append({"fn": fn, "scene": scene, "data": "data/dt.json", "eq": eq, "params": jp, "sha256": h})
        return out

    # ================================================================ s02, s08: Brest SYNOP (A2)
    from fluidpy.data import isd
    import pandas as pd
    d = isd.decode(isd.read([ISD]))
    d["time"] = pd.to_datetime(d.time)
    syn = d[d.report_type == "FM-12"].set_index("time").sort_index()
    syn = syn[~syn.index.duplicated()]
    sel = syn.loc["2023-11-01 12:00":"2023-11-02 09:00"]
    hrs = np.array([(t - pd.Timestamp("2023-11-01 12:00")).total_seconds() / 3600 for t in sel.index])
    r18, r20, r17 = syn.loc["2023-11-01 18:00"], syn.loc["2023-11-01 20:00"], syn.loc["2023-11-01 17:00"]
    row("DT02", "ISD Brest 18 / 20 UTC 10.3 / 14.9 °C", [r18.t_c, r20.t_c], [10.3, 14.9], 1e-9)
    row("DT02", "average rate (14.9 − 10.3) / 2 = 2.3 °C/h", (r20.t_c - r18.t_c) / 2, 2.3, 1e-9)
    row("DT13", "ISD Brest slp 17 / 18 UTC 988.3 / 983.3 hPa", [r17.slp_hpa, r18.slp_hpa], [988.3, 983.3], 1e-9)
    row("DT13", "pressure tendency −5.0 hPa/h", r18.slp_hpa - r17.slp_hpa, -5.0, 1e-9)
    okp = np.isfinite(sel.slp_hpa.values.astype(float))
    V["isd"] = {"h": r6(hrs, 3), "T": r6(sel.t_c.values, 1), "slp_h": r6(hrs[okp], 3), "slp": r6(sel.slp_hpa.values[okp], 1),
                "T18": 10.3, "T20": 14.9, "slp17": 988.3, "slp18": 983.3}

    # ================================================================ s03 derivative as a limit (F1)
    sec = np.asarray(importlib.import_module("fluidpy.geo.calculus").secant_slopes(lambda x: x ** 2, 3.0, [1.0, 0.1, 0.01]))
    entries.append({"fn": CAL + "secant_slopes", "scene": "s03", "data": "data/dt.json", "eq": "(f(3+h) − f(3))/h, f = x²",
                    "params": {"f": "lambda x: x**2", "x0": 3.0, "steps": [1.0, 0.1, 0.01]}, "sha256": None, "recorded": r6(sec)})
    row("DT03", "secants of x² at 3: 7, 6.1, 6.01", sec, [7.0, 6.1, 6.01], 1e-9)
    row("DT03", "f(3.1) = 9.61, f(3.01) = 9.0601", [3.1 ** 2, 3.01 ** 2], [9.61, 9.0601], 1e-12)
    V["secant"] = {"x0": 3.0, "h": [1.0, 0.1, 0.01], "slope": r6(sec, 6)}

    # ================================================================ s06 easy partials (sympy)
    import sympy as sp
    xs, ts = sp.symbols("x t")
    Te = 10 - sp.Rational(3, 100) * xs + 3 * ts
    row("DT04", "∂/∂x(10 − 0.03x + 3t) = −0.03, ∂/∂t = +3", [float(sp.diff(Te, xs)), float(sp.diff(Te, ts))], [-0.03, 3.0], 1e-12)
    truth("DT04", "∂(xt)/∂x = t, ∂(xt)/∂t = x (sympy)", sp.diff(xs * ts, xs) == ts and sp.diff(xs * ts, ts) == xs)
    pd_x = importlib.import_module("fluidpy.core.thermo").partial_derivative(lambda x, t: 10 - 0.03 * x + 3 * t, "x", {"x": 50.0, "t": 1.0})
    pd_t = importlib.import_module("fluidpy.core.thermo").partial_derivative(lambda x, t: 10 - 0.03 * x + 3 * t, "t", {"x": 50.0, "t": 1.0})
    entries.append({"fn": TH + "partial_derivative", "scene": "s06", "data": "data/dt.json", "eq": "∂T/∂x, ∂T/∂t of T = 10 − 0.03x + 3t (others fixed)",
                    "params": {"f": "lambda x, t: 10 - 0.03 x + 3 t", "at": {"x": 50.0, "t": 1.0}}, "sha256": None, "recorded": r6([pd_x, pd_t])})
    row("DT04", "core.thermo.partial_derivative agrees (−0.03, 3)", [pd_x, pd_t], [-0.03, 3.0], 1e-6)

    # ================================================================ ERA5 850 hPa (A1) — s01, s04, s05, s07, s08, s10-s13, s16, s17, s20, s36, s46
    e8 = xr.open_dataset(F850)
    lat8, lon8 = e8.lat.values.astype(float), e8.lon.values.astype(float)
    i0, j0 = int(np.argmin(abs(lat8 - BREST_GP[0]))), int(np.argmin(abs(lon8 - BREST_GP[1])))
    TT = {h: e8.sel(time=f"2023-11-01T{h:02d}" if h < 24 else "2023-11-02T00").t.values.astype(float) for h in range(12, 25)}
    pts = {h: float(TT[h][i0, j0]) - 273.15 for h in range(12, 25)}
    rng("DT10", "ERA5 850 T at (48.5, −4.5) 18 UTC ∈ [5.0, 5.3] °C", pts[18], 5.0, 5.3)
    row("DT12", "T 17 / 18 / 19 UTC = 2.38 / 5.12 / 8.23 °C", [pts[17], pts[18], pts[19]], [2.38, 5.12, 8.23], 0.006)
    dTdt = (pts[19] - pts[17]) / 2.0
    row("DT12", "∂T/∂t (17 → 19 UTC centred) = +2.92 K/h", dTdt, 2.92, 0.02)
    row("DT12", "screen (8.2 − 2.4) / 2 = 2.9", (8.2 - 2.4) / 2, 2.9, 1e-9)
    s18 = e8.sel(time="2023-11-01T18")
    T18 = s18.t.values.astype(float)
    g = call(GS + "gradient", "s07", "∂T/∂x, ∂T/∂y on the sphere (centred differences)", heavy_call=True, F=T18, lat=lat8, lon=lon8)
    dTdx, dTdy = float(g.dFdx[i0, j0]), float(g.dFdy[i0, j0])
    row("DT11", "∂T/∂x = −3.20, ∂T/∂y = −2.49 K per 100 km (0.25° centred)", [dTdx * 1e5, dTdy * 1e5], [-3.20, -2.49], 0.02)
    from fluidpy.geo.constants import EARTH_RADIUS
    dx0 = EARTH_RADIUS * np.cos(BREST_GP[0] * DEG) * 0.25 * DEG
    dy0 = EARTH_RADIUS * 0.25 * DEG
    row("DT11", "grid spacing at 48.5° N: 18.4 km east-west, 27.8 km north-south", [dx0 / 1e3, dy0 / 1e3], [18.4, 27.8], 0.06)
    Tw, Te_, Ts, Tn = (T18[i0, j0 - 1] - 273.15, T18[i0, j0 + 1] - 273.15, T18[i0 - 1, j0] - 273.15, T18[i0 + 1, j0] - 273.15)
    row("DT11", "centred difference by hand = the gradient", [(Te_ - Tw) / (2 * dx0) * 1e5], [dTdx * 1e5], 0.02)
    # time and mixed partials (F1): rows t = 17, 18, 19 UTC, columns x = Brest −1, 0, +1 grid points
    F3 = np.array([[TT[h][i0, j0 + k] for k in (-1, 0, 1)] for h in (17, 18, 19)])
    xg = np.array([-dx0, 0.0, dx0])
    tg = np.array([-3600.0, 0.0, 3600.0])
    mxt, mtx = call(CAL + "mixed_partials", "s10", "∂/∂t(∂T/∂x) and ∂/∂x(∂T/∂t) by centred differences (Vallis (1.69))",
                    F=F3, x=xg, t=tg)
    m1, m2 = float(np.ravel(mxt)[0]), float(np.ravel(mtx)[0])
    row("DT14", "mixed partials both orders 1.43e-9 K m⁻¹ s⁻¹", [m1 * 1e9, m2 * 1e9], [1.43, 1.43], 0.01)
    truth("DT14", "both orders equal to 1e-12 relative", abs(m1 - m2) <= 1e-12 * abs(m1), r6(abs(m1 - m2) / abs(m1), 15))
    four = (F3[2, 2] - F3[2, 0] - F3[0, 2] + F3[0, 0]) / (2 * dx0 * 2 * 3600.0)
    row("DT14", "four-corner formula = mixed partials", four, m1, 1e-15)
    truth("DT14", "x²t: ∂/∂t(∂/∂x) = ∂/∂x(∂/∂t) = 2x (sympy)", sp.diff(sp.diff(xs ** 2 * ts, xs), ts) == 2 * xs == sp.diff(sp.diff(xs ** 2 * ts, ts), xs))
    # total differential (F1), s12
    td_terms, td_sum = call(CAL + "total_differential", "s12", "dT = Σ slope × step (rounded screen slopes)",
                            slopes=[-0.032, -0.025, 2.9], steps=[10.0, 20.0, 0.5])
    row("DT15", "−0.32, −0.50, +1.45; sum +0.63", list(td_terms) + [td_sum], [-0.32, -0.50, 1.45, 0.63], 1e-9)
    tdf_terms, tdf_sum = call(CAL + "total_differential", "s12", "same at full precision (recorded)",
                              slopes=[dTdx * 1e3, dTdy * 1e3, dTdt], steps=[10.0, 20.0, 0.5])
    row("DT15", "full precision +0.64 (recorded)", tdf_sum, 0.64, 0.01)
    # chain rule (F1): car, plane east/west
    car_terms, car = call(CAL + "chain_rule_rate", "s15", "dT/dt = 0 + U ∂T/∂x (frozen map, km and h)", dFdt=0.0, grad=[-0.03, 0.0, 0.0],
                          velocity=[100.0, 0.0, 0.0])
    row("DT17", "car −3.0 °C/h", car, -3.0, 1e-12)
    pe_terms, pe = call(CAL + "chain_rule_rate", "s16", "plane east 100 m/s", dFdt=dTdt / 3600, grad=[dTdx, dTdy, 0.0], velocity=[100.0, 0.0, 0.0])
    pw_terms, pw = call(CAL + "chain_rule_rate", "s17", "plane west 100 m/s", dFdt=dTdt / 3600, grad=[dTdx, dTdy, 0.0], velocity=[-100.0, 0.0, 0.0])
    row("DT18", "U ∂T/∂x = ∓11.53 K/h", [pe_terms[1] * 3600, pw_terms[1] * 3600], [-11.53, 11.53], 0.01)
    row("DT18", "totals −8.60 / +14.45 K/h", [pe * 3600, pw * 3600], [-8.60, 14.45], 0.01)
    row("DT18", "screen: 100 × (−3.2e-5) = −0.0032 °C/s; × 3600 = −11.52 ≈ −11.5", [100 * -3.2e-5, 100 * -3.2e-5 * 3600], [-0.0032, -11.52], 1e-9)
    row("DT18", "screen: 2.9 − 11.5 = −8.6; 2.9 + 11.5 = 14.4", [2.9 - 11.5, 2.9 + 11.5], [-8.6, 14.4], 1e-9)
    # material derivative (s20)
    adv = call(DA + "advection", "s20", "u·∇T on the sphere", heavy_call=True, F=T18, u=s18.u.values.astype(float),
               v=s18.v.values.astype(float), lat=lat8, lon=lon8)
    a_bp = float(adv[i0, j0]) * 3600
    u18, v18 = float(s18.u.values[i0, j0]), float(s18.v.values[i0, j0])
    row("DT19", "u·∇T = −3.68 K/h; DT/Dt = ∂T/∂t + u·∇T = −0.76 K/h", [a_bp, dTdt + a_bp], [-3.68, -0.76], 0.05)
    row("DT19", "wind at Brest 18 UTC (5.85, 33.49) m/s", [u18, v18], [5.85, 33.49], 0.01)
    row("DT19", "screen 2.9 − 3.7 = −0.8", 2.9 - 3.7, -0.8, 1e-9)
    cr_check = call(CAL + "chain_rule_rate", "s20", "the parcel: velocity = the wind", dFdt=dTdt / 3600, grad=[dTdx, dTdy, 0.0], velocity=[u18, v18, 0.0])
    row("DT16", "chain_rule_rate(wind) = ∂T/∂t + advection() at the grid point", cr_check[1] * 3600, dTdt + a_bp, 0.02)
    # textures, isotherms, coast (12..24 UTC)
    la0, la1, lo0, lo1 = BOX_T
    m = (lat8 >= la0) & (lat8 <= la1)
    n = (lon8 >= lo0) & (lon8 <= lo1)
    blat, blon = lat8[m], lon8[n]
    t850 = {}
    for h in range(12, 25):
        Th = TT[h][np.ix_(m, n)] - 273.15
        t850[str(h)] = {"tex": field_png(Th, blat, blon, "cmocean.thermal", -6.0, 16.0, IMG / f"t850_{h}.png", up=4)}
        if h in (17, 18, 19):
            t850[str(h)]["iso"] = contours(Th, blat, blon, np.arange(-6.0, 17.0, 2.0), nd=2)
    # 3-D landscape grid (s05, s11, s13): 18 UTC T over 46.5-50.5 N, 9-0 W (0.25°)
    mm = (lat8 >= 46.5) & (lat8 <= 50.5)
    nn = (lon8 >= -9.0) & (lon8 <= 0.0)
    L18 = T18[np.ix_(mm, nn)] - 273.15
    L17 = TT[17][np.ix_(mm, nn)] - 273.15
    L19 = TT[19][np.ix_(mm, nn)] - 273.15
    land_tex = field_png(L18, lat8[mm], lon8[nn], "cmocean.thermal", -6.0, 16.0, IMG / "land_18.png", up=6)
    # zonal cut through Brest (48.5 N) 18 UTC: the s05 slice edge and the s36 front section
    cut_lon = lon8[(lon8 >= -12.0) & (lon8 <= 4.0)]
    cut_T = T18[i0, (lon8 >= -12.0) & (lon8 <= 4.0)] - 273.15
    # streaks for s20 (RK2 tracks in the 18 UTC 850 hPa wind, 10-min steps, frozen field)
    from scipy.interpolate import RegularGridInterpolator as RGI
    fu = RGI((lat8, lon8), s18.u.values.astype(float), bounds_error=False, fill_value=0.0)
    fv = RGI((lat8, lon8), s18.v.values.astype(float), bounds_error=False, fill_value=0.0)
    tracks = []
    for sl in np.arange(46.25, 49.6, 0.55):
        for so in np.arange(-8.0, -1.0, 0.8):
            la, lo_ = float(sl), float(so)
            tr = [la, lo_]
            for _ in range(18):
                def vel(p):
                    uu, vv = float(fu([p])[0]), float(fv([p])[0])
                    return np.array([vv / 111195.0, uu / (111195.0 * np.cos(p[0] * DEG))])
                p0 = np.array([la, lo_])
                k1 = vel(p0)
                k2 = vel(p0 + 0.5 * 600 * k1)
                p1 = p0 + 600 * k2
                la, lo_ = float(p1[0]), float(p1[1])
                tr += [round(la, 3), round(lo_, 3)]
            tracks.append(tr)
    V["e850"] = {"pt": {str(h): r6(pts[h], 3) for h in range(12, 25)}, "dTdx_100km": r6(dTdx * 1e5, 3), "dTdy_100km": r6(dTdy * 1e5, 3),
                 "dTdt": r6(dTdt, 3), "dx_km": r6(dx0 / 1e3, 2), "dy_km": r6(dy0 / 1e3, 2), "nbr": {"W": r6(Tw, 2), "E": r6(Te_, 2), "S": r6(Ts, 2), "N": r6(Tn, 2)},
                 "corners": {"BL": r6(F3[0, 0] - 273.15, 2), "BR": r6(F3[0, 2] - 273.15, 2), "TL": r6(F3[2, 0] - 273.15, 2), "TR": r6(F3[2, 2] - 273.15, 2)},
                 "mixed": r6(m1 * 1e9, 4), "u18": r6(u18, 2), "v18": r6(v18, 2), "adv_Kh": r6(a_bp, 3), "DTDt": r6(dTdt + a_bp, 3),
                 "plane": {"east": r6(pe * 3600, 3), "west": r6(pw * 3600, 3), "move": r6(pe_terms[1] * 3600, 3)},
                 "td": {"terms": r6(td_terms, 3), "sum": r6(td_sum, 3), "full": r6(tdf_sum, 3)}, "t850": t850,
                 "land": {"lat": r6(lat8[mm], 2), "lon": r6(lon8[nn], 2), "T18": r6(L18, 2), "T17": r6(L17, 2), "T19": r6(L19, 2), "tex": land_tex},
                 "cut": {"lon": r6(cut_lon, 2), "T": r6(cut_T, 2)}, "tracks": tracks}

    # ================================================================ s08 Ciarán low isobars (A4) at 18 UTC
    a4 = open_a4().sel(time="2023-11-01T18:00")
    am = (a4.lat >= 44) & (a4.lat <= 56)
    an = (a4.lon >= -16) & (a4.lon <= 2)
    msl = a4.msl.where(am & an, drop=True)
    MS = msl.values.astype(float) / 100.0
    k = np.unravel_index(np.nanargmin(np.where((msl.lat.values[:, None] > 46) & (msl.lon.values[None, :] < -2), MS, np.inf)), MS.shape)
    V["low"] = {"iso": contours(MS, msl.lat.values.astype(float), msl.lon.values.astype(float), np.arange(952.0, 1012.0, 4.0), nd=2),
                "centre": [r6(msl.lat.values[k[0]], 2), r6(msl.lon.values[k[1]], 2)], "pmin": r6(MS[k], 1)}
    rng("DT13", "Ciarán's low 18 UTC 950-972 hPa (drawn, no number)", MS[k], 950, 972)

    # ================================================================ Trappes sounding (A3) — s00, s01, s09, s18, s19, s21, s26, s27, s30-s36
    from fluidpy.data import igra
    hd, df = call(IG + "find_sounding", "s09", "IGRA2 Trappes 2026-09-30 12 UTC", heavy_call=True, path=str(IGRA), when="2026-09-30T12", max_hours=1.0)
    zf, filled = call(IG + "fill_heights", "s09", "hypsometric fill of missing heights (Vallis (2.166))", heavy_call=True, df=df)
    hd0, df0 = call(IG + "find_sounding", "s19", "IGRA2 Trappes 2026-09-30 00 UTC", heavy_call=True, path=str(IGRA), when="2026-09-30T00", max_hours=1.0)
    zf0, _ = igra.fill_heights(df0)
    p, Tk, et = df.p.values.astype(float), df["T"].values.astype(float), df.etime.values.astype(float)
    okT = np.isfinite(Tk) & np.isfinite(zf) & np.isfinite(p)
    row("DT01", "surface 997.5 hPa / 168 m / 19.8 °C", [p[0] / 100, zf[0], Tk[0] - 273.15], [997.5, 168.0, 19.8], 1e-6)
    k85, k50 = int(np.where(p == 85000)[0][0]), int(np.where(p == 50000)[0][0])
    row("DT01", "850 hPa z 1533 m, T 12.3 °C, etime 312 s", [zf[k85], Tk[k85] - 273.15, et[k85]], [1533, 12.3, 312], [5, 1e-6, 1e-9])
    row("DT01", "500 hPa z 5795 m, T −11.8 °C, etime 1212 s", [zf[k50], Tk[k50] - 273.15, et[k50]], [5795, -11.8, 1212], [10, 1e-6, 1e-9])
    truth("DT20", "≥ 60 levels with T and z up to ≥ 30 km", okT.sum() >= 60 and np.nanmax(zf[okT]) >= 30000, [int(okT.sum()), r6(np.nanmax(zf[okT]), 0)])
    asc = call(DS + "ascent_rates", "s18", "w, dT/dt, dT/dz, dT/dp, dz/dp between 850 and 500 hPa",
               z=[float(zf[k85]), float(zf[k50])], T=[float(Tk[k85]), float(Tk[k50])], etime=[float(et[k85]), float(et[k50])],
               p=[float(p[k85]), float(p[k50])])
    def g1(key):
        return float(np.ravel(asc[key])[0])
    w_b, dTdt_b, dTdz_b, dzdp_b, dTdp_b = g1("w"), g1("dTdt"), g1("dTdz"), g1("dzdp"), g1("dTdp")
    row("DT21", "ΔT −24.1 °C, Δz 4262 m, ∂T/∂z −5.655 K/km", [Tk[k50] - Tk[k85], zf[k50] - zf[k85], dTdz_b * 1e3], [-24.1, 4262, -5.655], [1e-6, 10, 0.02])
    row("DT22", "w = 4.736 m/s", w_b, 4.736, 0.02)
    row("DT23", "dT/dt −0.02678 K/s, −1.607 K/min", [dTdt_b, dTdt_b * 60], [-0.02678, -1.607], [1e-5, 1e-3])
    row("DT21", "screen −24.1 / 4.26 ≈ −5.66 ≈ −5.7; 4.26 km / 900 s ≈ 4.73 ≈ 4.7", [-24.1 / 4.26, 4260 / 900], [-5.66, 4.73], 0.01)
    lr = float(call("fluidpy.core.stratification.lapse_rate_convention", "s09", "meteorological lapse rate Γ = −∂T/∂z", dT_dz=dTdz_b, convention="meteorology"))
    row("DT21", "lapse rate (meteorological sign) +5.655 K/km", lr * 1e3, 5.655, 0.02)
    # fixed-place change at 5795 m from the 00 UTC sounding
    ok0 = np.isfinite(zf0) & np.isfinite(df0["T"].values)
    T0at = float(np.interp(zf[k50], zf0[ok0], df0["T"].values[ok0]))
    dT12 = (Tk[k50] - T0at)
    row("DT24", "T at 5795 m 00 → 12 UTC: −9.21 → −11.80 °C, −2.59 K in 12 h, −5.98e-5 K/s", [T0at - 273.15, dT12, dT12 / 43200 * 1e5],
        [-9.21, -2.59, -5.98], [0.02, 0.02, 0.05])
    # drift to 500 hPa (F4)
    okw = np.isfinite(df.wspd.values) & np.isfinite(df.wdir.values) & np.isfinite(et)
    dr = call(DS + "drift", "s19", "∫(u, v) dt along etime to the 500 hPa level (trapezoid)", wspd=df.wspd.values[okw].astype(float),
              wdir=df.wdir.values[okw].astype(float), etime=et[okw], top=1212.0, unit="km", cumulative=True)
    de, dn = float(dr["east"]), float(dr["north"])
    row("DT25", "drift (7.8, 14.6) km, 16.6 km towards 28°", [de, dn, np.hypot(de, dn), np.degrees(np.arctan2(de, dn))], [7.8, 14.6, 16.6, 28.0], [0.5, 0.5, 0.5, 3])
    # sideways term (D2 ERA5 round Trappes): u·∇T at 850, 700, 500 hPa with the sonde's own wind
    tr = xr.open_dataset(FTRP)
    tla, tlo = tr.lat.values.astype(float), tr.lon.values.astype(float)
    side, gmag = [], []
    for lev in (850, 700, 500):
        Tl = tr.t.sel(time="2026-09-30T12", level=lev).values.astype(float)
        gl = call(GS + "gradient", "s19", f"∇T at {lev} hPa round Trappes (ERA5 2026-09-30 12 UTC)", heavy_call=True, F=Tl, lat=tla, lon=tlo)
        gx = float(bilin(gl.dFdx, tla, tlo, TRAPPES[0], TRAPPES[1]))
        gy = float(bilin(gl.dFdy, tla, tlo, TRAPPES[0], TRAPPES[1]))
        kl = int(np.where(p == lev * 100)[0][0])
        uv = call(GA + "wind_components", "s19", f"sonde wind at {lev} hPa", speed=float(df.wspd.values[kl]), dir_from_deg=float(df.wdir.values[kl]))
        side.append(uv[0] * gx + uv[1] * gy)
        gmag.append(np.hypot(gx, gy) * 1e5)
    side_m = float(np.mean(side))
    rng("DT26", "|∇T| at Trappes 850/700/500 hPa < 1 K per 100 km ('less than one degree per hundred kilometres')", gmag, 0.0, 1.0)
    rng("DT26", "|sideways term| mean 1e-5 … 9e-5 K/s ('a few hundred-thousandths of a degree per second')", abs(side_m), 1e-5, 9e-5)
    share = abs(dTdt_b) / (abs(dTdt_b) + abs(dT12 / 43200) + abs(side_m))
    rng("DT27", "rising share > 99 % ('more than ninety nine percent')", share, 0.99, 1.0)
    row("DT19b", "screen rising term 4.7 × (−5.7e-3) = −0.0268 ≈ −0.027", 4.7 * -5.7e-3, -0.027, 3e-4)
    # 500 hPa map texture round Trappes for s19
    T500 = tr.t.sel(time="2026-09-30T12", level=500).values.astype(float) - 273.15
    t500_tex = field_png(T500, tla, tlo, "cmocean.thermal", -16.0, -8.0, IMG / "t500_trappes.png", up=8)
    # z -> p (s21)
    row("DT28", "∂z/∂p = −12.18 m/hPa; ∂T/∂p = +0.0689 K/hPa", [dzdp_b * 100, dTdp_b * 100], [-12.18, 0.0689], [0.01, 2e-4])
    row("DT28", "chain: (∂T/∂z)(∂z/∂p) = ∂T/∂p; direct −24.1 / −350", [dTdz_b * dzdp_b * 100, -24.1 / -350], [dTdp_b * 100, 0.0689], [1e-9, 1e-4])
    row("DT28", "screen (−5.7e-3)(−12.2) = 0.0695 ≈ 0.069 (rounded inputs; data 0.0689)", (-5.7e-3) * (-12.2), 0.0695, 1e-4)
    # tropopause (s36)
    zt, Tt = call(IG + "wmo_tropopause", "s36", "WMO lapse-rate tropopause", heavy_call=True, T=Tk[okT], z=zf[okT], p=p[okT])
    row("DT45", "tropopause 13 072 m, 206.85 K", [zt, Tt], [13072, 206.85], [5, 0.01])
    T15 = float(np.interp(15000.0, zf[okT], Tk[okT]))
    truth("DT46", "T(15 km) > T(tropopause): 'gets a little warmer'", T15 > Tt, r6([T15, Tt], 2))
    # Taylor of the temperature profile (s31): slope from 1174 and 2100 m
    k1174, k2100 = int(np.where(np.isclose(zf, 1174))[0][0]), int(np.where(np.isclose(zf, 2100))[0][0])
    slope = (Tk[k2100] - Tk[k1174]) / (zf[k2100] - zf[k1174])
    lin1 = call(CAL + "taylor_polynomial", "s31", "T(z0 + h) ≈ T(z0) + h dT/dz, h = 1 km", derivs=[12.3, slope * 1e3], h=1.0)
    lin4 = call(CAL + "taylor_polynomial", "s31", "same, h = 4.262 km", derivs=[12.3, slope * 1e3], h=float((zf[k50] - zf[k85]) / 1e3))
    meas1 = float(np.interp(zf[k85] + 1000, zf[okT], Tk[okT])) - 273.15
    row("DT39", "slope −4.86 K/km; line 7.44 vs measured 6.87; line −8.41 vs −11.8", [slope * 1e3, lin1[-1], meas1, lin4[-1]], [-4.86, 7.44, 6.87, -8.41], 0.01)
    row("DT39", "screen 12.3 + (1)(−4.9) = 7.4; 12.3 + (4.26)(−4.9) = −8.57 → data −8.4 (screen uses the data)", [12.3 - 4.9, ], [7.4], 1e-9)
    # hydrostatic / scale height (s26, s27, s34, s35)
    T0, p0 = float(Tk[0]), float(p[0])
    H = call(GA + "scale_height", "s26", "H = R T / g at the ground (R 287, g 9.81 as spoken)", T=T0, R=287.0, g=9.81)
    rho0 = call(TH + "perfect_gas_density", "s34", "ρ0 = p0 / (R T0)", p=p0, T=T0, R=287.0)
    row("DT34", "H = 8570 ± 10 m", H, 8570, 10)
    row("DT34", "screen 287 × 293 ÷ 9.81 = 8572 ≈ 8570", 287 * 293 / 9.81, 8572.0, 1.0)
    row("DT43", "ρ0 1.186 kg/m³, ρ0 g 11.64 Pa/m, 8.59 m/hPa", [rho0, rho0 * 9.81, 100 / (rho0 * 9.81)], [1.186, 11.64, 8.59], [1e-3, 0.02, 0.01])
    zabove = zf[okT] - zf[0]
    pexp = call(ST + "isothermal_pressure", "s27", "p = p0 e^(−z/H) (isothermal at the ground temperature)", heavy_call=True, z=zabove, p0=p0, T=T0, R=287.0, g=9.81)
    truth("DT35", "measured p below the isothermal exponential above 3 km at every level", bool(np.all(p[okT][zabove > 3000] < pexp[zabove > 3000])))
    derivs_p = [p0 * (-1.0 / H) ** kk for kk in range(25)]
    k887 = int(np.where(p == 88700)[0][0])
    z1 = float(zf[k887] - zf[0])
    tp1 = call(CAL + "taylor_polynomial", "s34", "p0 e^(−z/H) partial sums at z = 1006 m", derivs=derivs_p[:4], h=z1)
    row("DT43", "887.0 hPa level 1006 m above; line / bend / cubic 880.4 / 887.3 / 887.0 hPa", [z1] + list(np.asarray(tp1)[1:] / 100), [1006, 880.4, 887.3, 887.0], [1, 0.05, 0.05, 0.05])
    z5 = float(zf[k50] - zf[0])
    tp5 = call(CAL + "taylor_polynomial", "s35", "p0 e^(−z/H) partial sums at z = 5627 m (to order 24)", derivs=derivs_p, h=z5)
    pe5 = float(call(ST + "isothermal_pressure", "s35", "exponential at 5627 m", z=z5, p0=p0, T=T0, R=287.0, g=9.81)) / 100
    row("DT44", "342.6 / 557.6 / 510.5 / … 517.3 (series → exponential)", list(np.asarray(tp5)[1:4] / 100) + [np.asarray(tp5)[-1] / 100, pe5],
        [342.6, 557.6, 510.5, 517.3, 517.3], 0.06)
    lay = (zf[okT] >= zf[0]) & (zf[okT] <= zf[k50])
    Tbar = float(np.trapezoid(Tk[okT][lay], zf[okT][lay]) / (zf[k50] - zf[0]))
    p_tb = float(call(ST + "isothermal_pressure", "s35", "exponential with the layer's height-averaged temperature", z=z5, p0=p0, T=Tbar, R=287.0, g=9.81)) / 100
    row("DT44", "layer-mean T̄ 277.4 K → 498.7 hPa (balloon 500.0)", [Tbar, p_tb], [277.4, 498.7], [0.1, 0.2])
    Tm_hyp = call(GA + "layer_mean_temperature", "s35", "hypsometric layer-mean temperature (recorded)", thickness=z5, p1=p0, p2=50000.0)
    # profile arrays (all valid levels) for the charts
    V["snd"] = {"date": "2026-09-30T12", "lat": TRAPPES[0], "lon": TRAPPES[1], "z": r6(zf[okT], 1), "T": r6(Tk[okT] - 273.15, 2),
                "p": r6(p[okT] / 100, 2), "et": r6(et[okT], 1),
                "z00": r6(zf0[ok0], 1), "T00": r6(df0["T"].values[ok0] - 273.15, 2),
                "k85": int(np.where(np.where(okT)[0] == k85)[0][0]), "k50": int(np.where(np.where(okT)[0] == k50)[0][0]),
                "w": r6(w_b, 4), "dTdt": r6(dTdt_b, 6), "dTdz_km": r6(dTdz_b * 1e3, 4), "dzdp": r6(dzdp_b * 100, 3), "dTdp": r6(dTdp_b * 100, 5),
                "T0at": r6(T0at - 273.15, 2), "dT12": r6(dT12, 2), "fixed": r6(dT12 / 43200, 8), "side": r6(side_m, 8), "share": r6(share, 4),
                "gmag": r6(gmag, 3), "drift": {"e": r6(dr["east_cum"], 3), "n": r6(dr["north_cum"], 3), "t": r6(dr["etime"], 1), "E": r6(de, 2), "N": r6(dn, 2)},
                "trop": {"z": r6(zt, 0), "T": r6(Tt - 273.15, 2)}, "T15": r6(T15 - 273.15, 2),
                "slope": r6(slope * 1e3, 3), "lin1": r6(lin1[-1], 2), "meas1": r6(meas1, 2), "lin4": r6(lin4[-1], 2),
                "H": r6(H, 1), "rho0": r6(rho0, 4), "p0": r6(p0 / 100, 2), "T0": r6(T0, 2), "pexp": r6(np.asarray(pexp) / 100, 2),
                "z1": r6(z1, 0), "tp1": r6(np.asarray(tp1) / 100, 2), "z5": r6(z5, 0), "tp5": r6(np.asarray(tp5) / 100, 2), "pe5": r6(pe5, 2),
                "Tbar": r6(Tbar, 2), "p_tb": r6(p_tb, 2), "Tm_hyp": r6(Tm_hyp, 2), "t500": t500_tex}
    # fix loop 2 (review 2 Should 4): four thin ERA5 500-hPa isotherms on the s19 inset, every 0.2 °C (the drift runs along them)
    V["snd"]["iso500"] = contours(T500, tla, tlo, [-11.6, -11.4, -11.2, -11.0], nd=3)
    row("DT26b", "s19 inset isotherms −11.6 … −11.0 °C all present round Trappes", len(V["snd"]["iso500"]), 4, 0)
    gT = call(GS + "gradient", "s19", "∇T at 500 hPa for the drift-vs-isotherm angle", heavy_call=True, F=T500, lat=tla, lon=tlo)
    gx5, gy5 = float(bilin(gT.dFdx, tla, tlo, TRAPPES[0], TRAPPES[1])), float(bilin(gT.dFdy, tla, tlo, TRAPPES[0], TRAPPES[1]))
    ang = float(np.degrees(np.arccos(abs(de * gx5 + dn * gy5) / (np.hypot(de, dn) * np.hypot(gx5, gy5)))))
    rng("DT26c", "drift at > 60° to ∇T at 500 hPa ('almost along the lines of equal temperature')", ang, 60.0, 90.0)
    V["snd"]["drift_vs_grad_deg"] = r6(ang, 1)
    # s36: line and quadratic fitted just below the kink (9-13 km), run on to 20 km (picture only)
    fit = (zf[okT] >= 9000) & (zf[okT] <= zt)
    c1 = np.polyfit(zf[okT][fit] / 1e3, Tk[okT][fit] - 273.15, 1)
    c2 = np.polyfit(zf[okT][fit] / 1e3, Tk[okT][fit] - 273.15, 2)
    zz = np.linspace(9.0, 20.0, 45)
    V["snd"]["fit"] = {"z": r6(zz, 3), "lin": r6(np.polyval(c1, zz), 2), "quad": r6(np.polyval(c2, zz), 2)}
    truth("DT46", "the line and the quadratic fitted below the kink are colder than the balloon at 16 km",
          np.polyval(c1, 16.0) < float(np.interp(16000.0, zf[okT], Tk[okT])) - 273.15 and np.polyval(c2, 16.0) < float(np.interp(16000.0, zf[okT], Tk[okT])) - 273.15)

    # ================================================================ s22 a real hill: ETOPO Monts d'Arrée
    et_ = xr.open_dataset(ETOPO)
    zt_ = et_.z.values.astype(float)
    elat, elon = et_.lat.values.astype(float), et_.lon.values.astype(float)
    if elat[0] > elat[-1]:
        zt_, elat = zt_[::-1], elat[::-1]
    hm = (elat >= 48.30) & (elat <= 48.52)
    hn = (elon >= -4.15) & (elon <= -3.70)
    hz = zt_[np.ix_(hm, hn)]
    hla, hlo = elat[hm], elon[hn]
    from scipy.ndimage import zoom
    up = 4
    hz4 = zoom(hz, up, order=3)
    hla4 = np.linspace(hla[0], hla[-1], hz4.shape[0])
    hlo4 = np.linspace(hlo[0], hlo[-1], hz4.shape[1])
    ks = np.unravel_index(np.argmax(hz4), hz4.shape)
    sla, slo = hla4[ks[0]], hlo4[ks[1]]
    KM_LAT, KM_LON = 111.195, 111.195 * np.cos(48.4 * DEG)
    yy, xx = np.meshgrid((hla4 - sla) * KM_LAT, (hlo4 - slo) * KM_LON, indexing="ij")
    rr = np.hypot(xx, yy)
    target = hz4[ks] - 150.0
    cand = (rr > 1.5) & (rr < 4.0)
    kc = np.unravel_index(np.argmin(np.where(cand, abs(hz4 - target), np.inf)), hz4.shape)
    cla, clo = hla4[kc[0]], hlo4[kc[1]]
    gain = float(hz4[ks] - hz4[kc])
    # trails in km from the summit (east, north)
    cx, cy = (clo - slo) * KM_LON, (cla - sla) * KM_LAT
    s = np.linspace(0, 1, 120)
    straight = np.stack([cx * (1 - s), cy * (1 - s)], -1)
    Lst = float(np.sum(np.hypot(*np.diff(straight, axis=0).T)))
    nrm = np.array([-cy, cx]) / np.hypot(cx, cy)
    amp = 0.0
    wind = straight
    for amp in np.linspace(0.05, 3.0, 600):
        wind = straight + (amp * np.sin(3 * np.pi * s) * np.sin(np.pi * s))[:, None] * nrm[None, :]
        if np.sum(np.hypot(*np.diff(wind, axis=0).T)) >= 2.25 * Lst:
            break
    Lw = float(np.sum(np.hypot(*np.diff(wind, axis=0).T)))
    def hat(path):
        la = sla + path[:, 1] / KM_LAT
        lo = slo + path[:, 0] / KM_LON
        return bilin(hz4, hla4, hlo4, la, lo)
    hs_, hw_ = hat(straight), hat(wind)
    row("DT29", "height gain equal on both trails (start and end shared)", hs_[-1] - hs_[0], hw_[-1] - hw_[0], 1e-9)
    rng("DT29", "height gain 100-200 m (ETOPO; shown rounded to 10 m)", gain, 100, 200)
    truth("DT29", "winding trail longer than the straight one", Lw > 2 * Lst, r6([Lst, Lw], 2))
    V["hill"] = {"z": r6(hz4, 1), "ny": int(hz4.shape[0]), "nx": int(hz4.shape[1]), "lat": [r6(hla4[0], 4), r6(hla4[-1], 4)],
                 "lon": [r6(hlo4[0], 4), r6(hlo4[-1], 4)], "summit": [r6(sla, 4), r6(slo, 4), r6(hz4[ks], 1)], "park": [r6(cla, 4), r6(clo, 4), r6(hz4[kc], 1)],
                 "gain": r6(gain, 1), "straight": r6(straight[::4], 3), "wind": r6(wind[::2], 3), "Lst": r6(Lst, 2), "Lw": r6(Lw, 2),
                 "hs": r6(hs_[::4], 1), "hw": r6(hw_[::2], 1), "km_lat": KM_LAT, "km_lon": r6(KM_LON, 4)}
    # hill colour (a hypsometric tint, not data colour of a field)
    from PIL import Image
    tz = np.clip((hz4 - np.nanmin(hz4)) / (np.nanmax(hz4) - np.nanmin(hz4)), 0, 1)[::-1]
    lo_rgb, hi_rgb = np.array([88, 120, 74]), np.array([180, 160, 118])
    rgbh = (lo_rgb[None, None] * (1 - tz[..., None]) + hi_rgb[None, None] * tz[..., None]).astype(np.uint8)
    Image.fromarray(rgbh).resize((rgbh.shape[1] * 4, rgbh.shape[0] * 4), Image.BICUBIC).save(IMG / "hill_tint.png", optimize=True)

    # ================================================================ s23 exactness test and loops (F1)
    r_plus = call(CAL + "exactness_residual", "s23", "∂M/∂y − ∂N/∂x for y dx + x dy", M="y", N="x")
    r_minus = call(CAL + "exactness_residual", "s23", "∂M/∂y − ∂N/∂x for y dx − x dy", M="y", N="-x")
    row("DT30", "exactness residuals 0 and 2 (sympy)", [float(r_plus), float(r_minus)], [0.0, 2.0], 1e-12)
    path = importlib.import_module("fluidpy.geo.calculus").polygon_path([(0, 0), (1, 0), (1, 1), (0, 1)], 100)
    entries.append({"fn": CAL + "polygon_path", "scene": "s23", "data": "data/dt.json", "eq": "unit square, anticlockwise", "params": {"vertices": [[0, 0], [1, 0], [1, 1], [0, 1]], "n_per_edge": 100}, "sha256": parity_hash(path)})
    Lm = importlib.import_module("fluidpy.geo.calculus").loop_integral(lambda x, y: y, lambda x, y: -x, path)
    Lp = importlib.import_module("fluidpy.geo.calculus").loop_integral(lambda x, y: y, lambda x, y: x, path)
    entries.append({"fn": CAL + "loop_integral", "scene": "s23", "data": "data/dt.json", "eq": "∮(y dx − x dy), ∮(y dx + x dy)", "params": {"M": "y", "N": "∓x", "path": "unit square n=100"}, "sha256": None, "recorded": r6([Lm, Lp], 9)})
    row("DT31", "loop integrals −2.000 and 0.000", [Lm, Lp], [-2.0, 0.0], 1e-6)
    xp, yp = path
    def running(Mf, Nf):
        Mv, Nv = Mf(xp, yp), Nf(xp, yp)
        seg = 0.5 * (Mv[1:] + Mv[:-1]) * np.diff(xp) + 0.5 * (Nv[1:] + Nv[:-1]) * np.diff(yp)
        return np.concatenate([[0.0], np.cumsum(seg)])
    run_m, run_p = running(lambda x, y: y, lambda x, y: -x), running(lambda x, y: y, lambda x, y: x)
    row("DT31", "running sums end at the loop integrals", [run_m[-1], run_p[-1]], [Lm, Lp], 1e-12)
    V["loop"] = {"x": r6(xp[::5], 3), "y": r6(yp[::5], 3), "minus": r6(run_m[::5], 4), "plus": r6(run_p[::5], 4)}

    # ================================================================ s24, s25 ideal gas
    xr_, Tr_ = sp.symbols("rho T", positive=True)
    Rs = sp.Symbol("R", positive=True)
    pf = xr_ * Rs * Tr_
    truth("DT32", "sympy dp = RT dρ + ρR dT; ∂(RT)/∂T = R = ∂(ρR)/∂ρ", sp.diff(pf, xr_) == Rs * Tr_ and sp.diff(pf, Tr_) == xr_ * Rs and
          sp.diff(Rs * Tr_, Tr_) == Rs == sp.diff(xr_ * Rs, xr_))
    lin_r, ex_r = -10 / 290, 290 / 300 - 1
    row("DT33", "−3.45 % (linear), −3.33 % (exact)", [lin_r * 100, ex_r * 100], [-3.45, -3.33], 0.005)
    rho_a = call(TH + "perfect_gas_density", "s25", "ρ at 290 K and at 300 K, same p (exact ratio)", p=101325.0, T=[290.0, 300.0])
    row("DT33", "perfect_gas_density ratio − 1 = −3.33 %", (rho_a[1] / rho_a[0] - 1) * 100, -3.33, 0.005)
    pp_ = call(TH + "perfect_gas_pressure", "s24", "p = ρ R T (1.2 kg/m³, 290 K)", rho=1.2, T=290.0)
    V["gas"] = {"R": 287.0, "lin": r6(lin_r * 100, 3), "exact": r6(ex_r * 100, 3), "p_example": r6(pp_, 1)}

    # ================================================================ s28, s29 three routes (thermo)
    vA, vB, Tq = 0.8, 1.2, 280.0
    kinds = {"one": "isochoric-isobaric", "two": "isothermal", "three": "isobaric-isochoric"}
    routes = {}
    for key, kind in kinds.items():
        tot = call(TH + "path_heat_work_totals", "s28", f"heat, work, Δe, Δη on the {kind} route (Vallis (1.10), (1.16))", kind=kind, v1=vA, T1=Tq, v2=vB, T2=Tq)
        pth = call(TH + "process_path", "s28", f"the {kind} route sampled", heavy_call=True, kind=kind, state1=(vA, Tq), state2=(vB, Tq), n=61)
        routes[key] = {"kind": kind, "q": r6(tot["q"] / 1e3, 3), "de": r6(tot["de"], 6), "ds": r6(tot["ds"], 3),
                       "v": r6(pth["v"], 4), "p": r6(pth["p"] / 100, 2)}
    row("DT36", "heat 26.79 / 32.59 / 40.19 kJ/kg", [routes[k]["q"] for k in ("one", "two", "three")], [26.79, 32.59, 40.19], 0.01)
    row("DT36", "Δe = 0 on all three", [routes[k]["de"] for k in ("one", "two", "three")], [0, 0, 0], 1e-6)
    row("DT37", "Δη = 116.39 J kg⁻¹ K⁻¹ on all three", [routes[k]["ds"] for k in ("one", "two", "three")], [116.39, 116.39, 116.39], 0.01)
    ent = call(TH + "perfect_gas_entropy_change", "s29", "η2 − η1 = c_v ln(T2/T1) + R ln(α2/α1)", T1=Tq, v1=vA, T2=Tq, v2=vB)
    row("DT37", "perfect_gas_entropy_change = 116.39", ent, 116.39, 0.01)
    alp, Tsy, Rsy, cvs = sp.symbols("alpha T R c_v", positive=True)
    res_q = sp.simplify(sp.diff(cvs, alp) - sp.diff(Rsy * Tsy / alp, Tsy))
    res_s = sp.simplify(sp.diff(cvs / Tsy, alp) - sp.diff(Rsy / alp, Tsy))
    truth("DT38", "residuals −R/α (heat) and 0 (heat/T) (sympy)", res_q == -Rsy / alp and res_s == 0, [str(res_q), str(res_s)])
    V["routes"] = routes
    V["routes_AB"] = {"vA": vA, "vB": vB, "T": Tq, "pA": r6(287.0579959589441 * Tq / vA / 100, 1), "pB": r6(287.0579959589441 * Tq / vB / 100, 1)}

    # ================================================================ s32, s33 Taylor series (F1, core.fd)
    tab = call(FD + "taylor_table_sympy", "s32", "Taylor table rows s^p/p! for offsets ±1", heavy_call=True, offsets=[-1, 1], order=4)
    truth("DT41", "Taylor table: 1/2! = 1/2, 1/3! = 1/6", sp.factorial(2) == 2 and sp.factorial(3) == 6)
    e01 = call(CAL + "taylor_polynomial", "s33", "e^h partial sums at h = 0.1", derivs=[1.0] * 5, h=0.1)
    e1 = call(CAL + "taylor_polynomial", "s33", "e^h partial sums at h = 1", derivs=[1.0] * 12, h=1.0)
    row("DT42", "e^0.1 sums 1, 1.1, 1.105, 1.1051667 vs 1.1051709", list(np.asarray(e01)[:4]) + [np.exp(0.1)], [1, 1.1, 1.105, 1.1051667, 1.1051709], 1e-7)
    row("DT42", "e^1 sums 1, 2, 2.5, 2.6667, 2.7083 → 2.7183", list(np.asarray(e1)[:5]) + [np.asarray(e1)[-1]], [1, 2, 2.5, 2.6667, 2.7083, 2.7183], 1e-4)
    hh = np.linspace(-0.2, 1.25, 59)
    fam = [call(CAL + "taylor_polynomial", "s33", f"order-{o} partial sum curve", heavy_call=True, derivs=[1.0] * (o + 1), h=hh)[-1] for o in range(5)]
    V["taylor"] = {"e01": r6(e01, 7), "e1": r6(e1, 4), "exp01": r6(np.exp(0.1), 7), "h": r6(hh, 4), "fam": [r6(fm, 4) for fm in fam], "exp": r6(np.exp(hh), 4)}

    # ================================================================ s39-s41 Clausius-Clapeyron (moist, F3)
    Tc = np.linspace(-10.0, 35.0, 91)
    es = call(MO + "saturation_vapour_pressure", "s39", "e_s(T) (library defaults: L 2.44e6, R_v 462, e0 6.12 hPa at 273 K)", T=Tc + 273.15)
    es3 = call(MO + "saturation_vapour_pressure", "s39", "e_s at 0, 15, 30 °C", T=[273.15, 288.15, 303.15])
    row("DT50", "e_s 6.19, 16.92, 41.91 hPa", np.asarray(es3) / 100, [6.19, 16.92, 41.91], 0.01)
    LofT = lambda tc: 2.501e6 - 2370.0 * tc  # noqa: E731
    rates = [float(call(MO + "cc_fractional_rate", "s40", f"L/(R_v T²) at {tc} °C with L(T)", T=273.15 + tc, L=LofT(tc))) for tc in (0.0, 15.0, 30.0)]
    row("DT51", "7.26, 6.43, 5.72 % per K", np.asarray(rates) * 100, [7.26, 6.43, 5.72], 0.01)
    row("DT51", "screen 2.5e6 / (462 × 273²) = 0.0726 ≈ 0.073", 2.5e6 / (462 * 273 ** 2), 0.0726, 1e-4)
    ex1 = float(call(MO + "saturation_vapour_pressure", "s40", "exact +1 K at 0 °C (constant L(0 °C))", T=274.15, e0=611.2, T0=273.15, L=2.501e6)) / 611.2 - 1
    ex4 = float(call(MO + "saturation_vapour_pressure", "s40", "exact +4 K at 0 °C", T=277.15, e0=611.2, T0=273.15, L=2.501e6)) / 611.2 - 1
    r0 = float(call(MO + "cc_fractional_rate", "s40", "line slope at 0 °C with L(0 °C) = 2.501e6", T=273.15, L=2.501e6))
    row("DT52", "+1 K exact 7.50 vs line 7.26 %; +4 K exact 33.11 vs line 29.02 %", [ex1 * 100, r0 * 100, ex4 * 100, 4 * r0 * 100], [7.50, 7.26, 33.11, 29.02], 0.02)
    tang = []
    for tc in (0.0, 15.0, 30.0):
        e_ = float(call(MO + "saturation_vapour_pressure", "s40", f"e_s at {tc} °C (drawn curve)", T=273.15 + tc)) / 100
        rr_ = float(call(MO + "cc_fractional_rate", "s40", f"slope of the drawn curve at {tc} °C (default L)", T=273.15 + tc))
        tang.append([tc, r6(e_, 3), r6(e_ * rr_, 4)])
    Tz = np.linspace(0.0, 5.0, 51)
    ez = call(MO + "saturation_vapour_pressure", "s40", "exact curve 0-5 °C (constant L(0 °C), e0 611.2 Pa at 273.15 K) for the zoom inset",
              T=Tz + 273.15, e0=611.2, T0=273.15, L=2.501e6)
    lz = 611.2 * (1 + r0 * Tz)
    row("DT52", "zoom inset: exact and line at +4 K differ by 33.11 − 29.02 % of e0", [(float(ez[40]) - lz[40]) / 611.2 * 100], [33.11 - 29.02], 0.03)
    row("DT54", "1.26 × 7.26 % = 9.1 % linear; compounded 9.2 %", [1.26 * rates[0] * 100, ((1 + rates[0]) ** 1.26 - 1) * 100], [9.15, 9.23], 0.02)
    row("DT54", "screen 1.26 × 7 % = 8.8 ≈ 9 %", 1.26 * 7, 8.82, 0.01)
    # D3 ERA5 TCWV
    tw = xr.open_dataset(FTCWV)
    yrs = tw.year.values.astype(int)
    ann = tw.tcwv_gm_annual.values.astype(float)
    tr79 = call(DC + "linear_trend", "s41", "global-mean TCWV trend 1979-2025 (OLS, per decade)", series=ann, time=yrs.astype(float), per="decade")
    tr93 = call(DC + "linear_trend", "s41", "global-mean TCWV trend 1993-2025", series=ann[yrs >= 1993], time=yrs[yrs >= 1993].astype(float), per="decade")
    s79, se79 = float(tr79[0]), float(tr79[1])
    s93, se93 = float(tr93[0]), float(tr93[1])
    ref = float(np.mean(ann[(yrs >= 1991) & (yrs <= 2020)]))
    truth("DT53", "TCWV trend > 0 at 3 SE from 1979 and from 1993", s79 > 3 * se79 and s93 > 3 * se93,
          r6([s79 / ref * 100, se79 / ref * 100, s93 / ref * 100, se93 / ref * 100], 3))
    trend_map = tw.tcwv_trend_pct_per_decade_2deg.values.astype(float)
    tm_tex = field_png(trend_map, tw.lat2.values.astype(float), tw.lon2.values.astype(float), "cmocean.balance", -4.0, 4.0, IMG / "tcwv_trend.png", up=2, order=1)
    V["cc"] = {"T": r6(Tc, 2), "es": r6(np.asarray(es) / 100, 3), "es3": r6(np.asarray(es3) / 100, 2), "rates": r6(np.asarray(rates) * 100, 3),
               "ex1": r6(ex1 * 100, 2), "ex4": r6(ex4 * 100, 2), "lin1": r6(r0 * 100, 2), "lin4": r6(4 * r0 * 100, 2), "tang": tang,
               "warm": 1.26, "rise": r6(1.26 * rates[0] * 100, 2), "zoom": {"T": r6(Tz, 2), "exact": r6(np.asarray(ez) / 100, 4), "line": r6(lz / 100, 4)},
               "tcwv": {"yr": yrs.tolist(), "ann": r6(ann, 3), "trend79": r6(s79, 4), "se79": r6(se79, 4), "trend93": r6(s93, 4), "se93": r6(se93, 4),
                        "ref": r6(ref, 3), "fit": r6(np.polyval([s79 / 10, ann.mean() - s79 / 10 * yrs.mean()], yrs), 3), "map": tm_tex}}

    # ================================================================ s42, s43 Planck (radiation, F2) + D4 CERES
    olr = xr.open_dataset(FOLR)
    gm_clim = call(DC + "global_mean", "s42", "global mean of the 2001-latest OLR climatology (cos-lat)", heavy_call=True,
                   field=olr.toa_lw_all_mon_clim, lat=olr.lat)
    gmc = float(np.asarray(gm_clim))
    rng("DT61", "CERES EBAF global-mean OLR 2001→latest in 235-245 W/m² (240.6)", gmc, 235, 245)
    Te = float(call(RA + "emission_temperature", "s42", "T_e = (F/σ)^¼ for F = 240 W/m²", F=240.0))
    Te_c = float(call(RA + "emission_temperature", "s42", "T_e for the CERES mean (recorded)", F=gmc))
    lam = float(call(RA + "planck_response", "s42", "4σT³ at T_e", T=Te))
    row("DT60", "T_e 255.06 K; 4σT³ 3.764 W m⁻² K⁻¹", [Te, lam], [255.06, 3.764], [0.01, 1e-3])
    row("DT60", "screen 4 × 240 / 255 = 3.765 ≈ 3.8; 255 − 273 = −18 °C", [4 * 240 / 255, 255 - 273.15], [3.765, -18.15], 1e-3)
    row("DT62", "3.93 / 3.764 = 1.04 K; 3.93 / 3.22 = 1.22 K", [3.93 / lam, 3.93 / 3.22], [1.04, 1.22], 0.005)
    b0 = float(call(RA + "blackbody_flux", "s43", "σT⁴ at T_e", T=Te))
    b1 = float(call(RA + "blackbody_flux", "s43", "σT⁴ at T_e + 1", T=Te + 1))
    b10 = float(call(RA + "blackbody_flux", "s43", "σT⁴ at T_e + 10", T=Te + 10))
    row("DT63", "+1 K: 3.786 vs 3.764; +10 K: 39.91 vs 37.64 W/m²", [b1 - b0, lam, b10 - b0, 10 * lam], [3.786, 3.764, 39.91, 37.64], 0.005)
    Tcur = np.linspace(200.0, 300.0, 51)
    bcur = call(RA + "blackbody_flux", "s42", "σT⁴ curve 200-300 K", T=Tcur)
    olr_tex = field_png(olr.toa_lw_all_mon_latest.values.astype(float), olr.lat.values.astype(float), olr.lon.values.astype(float),
                        "cmocean.thermal", 100.0, 320.0, IMG / "olr_latest.png", up=2, order=1)
    latest = str(olr.time.values[-1])[:7]
    V["rad"] = {"gm": r6(gmc, 2), "Te": r6(Te, 2), "Te_c": r6(Te_c, 2), "lam": r6(lam, 4), "b1": r6(b1 - b0, 3), "b10": r6(b10 - b0, 2),
                "dT_planck": r6(3.93 / lam, 3), "dT_ar6": r6(3.93 / 3.22, 3), "T": r6(Tcur, 1), "F": r6(bcur, 2), "tex": olr_tex, "latest": latest}

    # ================================================================ s44-s46 finite differences (core.fd)
    cf = call(FD + "stencil_taylor_coefficients", "s44", "forward stencil Taylor bookkeeping", kind="forward")
    cc_ = call(FD + "stencil_taylor_coefficients", "s45", "central stencil Taylor bookkeeping", kind="central")
    row("DT70", "forward order 1, leading 1/2; central order 2, leading 1/6", [cf["order"], cf["leading"], cc_["order"], cc_["leading"]], [1, 0.5, 2, 1 / 6], 1e-12)
    ef = call(FD + "stencil_error", "s45", "forward error, sin at 1, h = 0.1", name="sin", x0=1.0, h=0.1, kind="forward")
    ec = call(FD + "stencil_error", "s45", "central error, sin at 1, h = 0.1", name="sin", x0=1.0, h=0.1, kind="central")
    row("DT71", "sin errors −4.294e-2, −9.001e-4", [ef, ec], [-4.294e-2, -9.001e-4], [5e-6, 5e-8])
    rowT = T18[i0, :]
    dfwd = call(FD + "fd_derivative", "s46", "forward difference along 48.5 N, 0.25°", heavy_call=True, f=rowT, dx=dx0, kind="forward")[j0]
    dbwd = call(FD + "fd_derivative", "s46", "backward difference", heavy_call=True, f=rowT, dx=dx0, kind="backward")[j0]
    dctr = call(FD + "fd_derivative", "s46", "centred difference", heavy_call=True, f=rowT, dx=dx0, kind="central")[j0]
    coarse = []
    for nsub in (2, 4, 8, 12):
        sub = rowT[j0 % nsub::nsub]
        jj = (j0 - j0 % nsub) // nsub
        dc_ = call(FD + "fd_derivative", "s46", f"centred difference on every {nsub}th point", heavy_call=True, f=sub, dx=nsub * dx0, kind="central")[jj]
        coarse.append(float(dc_) * 1e5)
    row("DT72", "18 km: forward −3.32, backward −3.09, centred −3.20", [dfwd * 1e5, dbwd * 1e5, dctr * 1e5], [-3.319, -3.086, -3.202], 0.01)
    row("DT72", "coarse centred −3.17, −3.14, −2.24, −0.98", coarse, [-3.168, -3.140, -2.238, -0.984], 0.01)
    row("DT72", "spacings 36.8, 73.7, 147.4, 221.0 km", [2 * dx0 / 1e3, 4 * dx0 / 1e3, 8 * dx0 / 1e3, 12 * dx0 / 1e3], [36.8, 73.7, 147.4, 221.0], 0.1)
    truth("DT73", "history line as cited (ENIAC 1950 736 km; FAR ~500 km 'a few hundred'; IFS TCo1279 9 km)", True)
    # coarse-grid textures (subsample both ways, bilinear back to 0.25°)
    cg = {}
    for nsub in (1, 2, 4, 8, 12):
        if nsub == 1:
            Fg = T18[np.ix_(m, n)] - 273.15
        else:
            ii = np.arange(i0 % nsub, lat8.size, nsub)
            jj_ = np.arange(j0 % nsub, lon8.size, nsub)
            sub2 = T18[np.ix_(ii, jj_)]
            Fg = bilin(sub2, lat8[ii], lon8[jj_], *np.meshgrid(blat, blon, indexing="ij")) - 273.15
        cg[str(nsub)] = field_png(Fg, blat, blon, "cmocean.thermal", -6.0, 16.0, IMG / f"t850c_{nsub}.png", up=4, order=1)
    V["fd"] = {"forward": r6(dfwd * 1e5, 3), "backward": r6(dbwd * 1e5, 3), "centred": r6(dctr * 1e5, 3), "coarse": r6(coarse, 3),
               "spacing": r6([dx0 / 1e3, 2 * dx0 / 1e3, 4 * dx0 / 1e3, 8 * dx0 / 1e3, 12 * dx0 / 1e3], 1), "ef": r6(ef, 6), "ec": r6(ec, 7), "tex": cg,
               "lat_pts": r6(lat8[(lat8 >= 47.0) & (lat8 <= 50.0)], 2), "lon_pts": r6(lon8[(lon8 >= -8.0) & (lon8 <= -1.0)], 2)}

    # ================================================================ s09b the layer stack (fix loop 2; retrofit plan §3.7 K4; HOUSE_STYLE §5b)
    # ERA5 t, zg on 16 levels round Trappes, 30 Sep 2026 12 UTC; five levels shown (1000 / 700 / 400 / 175 / 100 hPa) so the
    # WMO tropopause (175 hPa) is a level and the sign of ΔT/Δz flips between two neighbouring gaps
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    from _stack import stack_product
    sk = xr.open_dataset(FSTK)
    slev = [float(v) for v in sk.level.values]
    sla, slo = sk.lat.values.astype(float), sk.lon.values.astype(float)
    T16 = sk.t.values.astype(float)
    Z16 = sk.zg.values.astype(float)
    BG16 = sk.below_ground.values.astype(bool)
    Tc = np.array([float(bilin(T16[q], sla, slo, TRAPPES[0], TRAPPES[1])) for q in range(len(slev))])
    Zc = np.array([float(bilin(Z16[q], sla, slo, TRAPPES[0], TRAPPES[1])) for q in range(len(slev))])
    truth("DT80", "Trappes column above ground at every level (sp 1001.8 hPa > 1000 hPa)", not any(bool(BG16[q][np.argmin(abs(sla - 48.75)), np.argmin(abs(slo - 2.0))]) for q in range(len(slev))))
    ztp, Ttp = call(GA + "lapse_rate_tropopause", "s09b", "WMO tropopause of the ERA5 16-level Trappes column", T=Tc, z=Zc)
    ktp = int(np.argmin(abs(Zc - ztp)))
    row("DT81", "ERA5 tropopause at Trappes 13 004 m, 208.18 K (−64.97 °C) at 175 hPa", [ztp, Ttp, slev[ktp]], [13004.0, 208.18, 175.0], [1.0, 0.01, 0])
    SHOW = [1000.0, 700.0, 400.0, 175.0, 100.0]
    ks = [slev.index(v) for v in SHOW]
    gaps = [float(call(DS + "layer_lapse_rate", "s09b", f"ΔT/Δz {SHOW[i]:.0f}–{SHOW[i + 1]:.0f} hPa at Trappes (Kundu sign)", z=Zc, T=Tc,
                       z1=float(Zc[ks[i]]), z2=float(Zc[ks[i + 1]]))) * 1e3 for i in range(4)]
    row("DT82", "gaps at Trappes −6.20, −5.63, −7.75, +1.09 K/km", gaps, [-6.20, -5.63, -7.75, 1.09], 0.006)
    row("DT82", "spoken/shown −6.2, −5.6, −7.7, +1.1", [round(g, 1) for g in gaps], [-6.2, -5.6, -7.7, 1.1], 1e-9)
    truth("DT83", "sign flips between the 400–175 and 175–100 hPa gaps (cooling below the tropopause, warming above)",
          all(g < 0 for g in gaps[:3]) and gaps[3] > 0, [round(g, 2) for g in gaps])
    row("DT84", "heights at Trappes 0.14 / 3.13 / 7.47 / 13.00 / 16.45 km ('about sixteen and a half', 'above thirteen')",
        [Zc[k] / 1e3 for k in ks], [0.14, 3.13, 7.47, 13.00, 16.45], 0.006)
    rng("DT84", "100 hPa height at Trappes rounds to 16.5 km", Zc[ks[-1]] / 1e3, 16.25, 16.75)
    # the same finite difference over the whole box (exact at reported levels: equals layer_lapse_rate there)
    Fg = [(T16[ks[i + 1]] - T16[ks[i]]) / (Z16[ks[i + 1]] - Z16[ks[i]]) * 1e3 for i in range(4)]
    ok_g = [~(BG16[ks[i]] | BG16[ks[i + 1]]) for i in range(4)]
    jy, jx = 11, 20
    lr = float(call(DS + "layer_lapse_rate", "s09b", "spot check: box column (lat index 11, lon index 20), 400–175 hPa", z=Z16[:, jy, jx], T=T16[:, jy, jx],
                    z1=float(Z16[ks[2], jy, jx]), z2=float(Z16[ks[3], jy, jx]))) * 1e3
    row("DT85", "box finite difference = layer_lapse_rate at a reported-level pair (spot column)", Fg[2][jy, jx], lr, 1e-9)
    cool = [float(np.mean(Fg[i][ok_g[i]] < 0)) for i in range(3)]
    warm = float(np.mean(Fg[3][ok_g[3]] > 0))
    rng("DT85", "lower three gaps cool upward over the box (share of above-ground columns)", cool, 0.99, 1.0)
    rng("DT85", "top gap 175–100 hPa warms upward over most of the box (share)", warm, 0.5, 1.0)
    T5 = T16[ks] - 273.15
    hdr, sblob, srows = stack_product("stack_t", T5, Z16[ks], SHOW, sla, slo, -70.0, 25.0, exaggeration=45, units="°C",
                                      lut="cmocean.thermal", below_ground=BG16[ks])
    (DATA / "stack_t.bin").write_bytes(sblob)
    hdr.update({"trappes": {"z_km": r6(Zc[ks] / 1e3, 3), "T_C": r6(Tc[ks] - 273.15, 2), "gaps_Kkm": r6(gaps, 3),
                            "gaps_shown": [round(g, 1) for g in gaps]},
                "trop": {"z": r6(ztp, 0), "T_C": r6(Ttp - 273.15, 2), "p_hPa": slev[ktp]},
                "box": {"cool_share": r6(cool, 4), "warm_share_top": r6(warm, 4),
                        "below_ground_share": r6([float(BG16[k].mean()) for k in ks], 4)},
                "lut_hex": lut_hex("cmocean.thermal")})
    V["stack"] = hdr
    stack_rows = srows

    # ================================================================ lines and LUTs
    ne110 = json.loads((CP_REAL / "ne_lines_110m.json").read_text(encoding="utf-8"))
    V["lines"] = {"globe_coast_110m": ne110["coastline"],
                  "coast_10m": gj_lines(DER / "ciaran_coast_10m.geojson", (40.0, 56.0, -16.0, 9.0), nd=3),
                  "borders_10m": gj_lines(DER / "ciaran_borders_10m.geojson", (40.0, 56.0, -16.0, 9.0), nd=3)}
    V["luts"] = {"thermal": lut_hex("cmocean.thermal"), "balance": lut_hex("cmocean.balance")}
    V["images"] = {"truecolour_1101": {"file": "dt_tc_20231101.jpg", "lat_edges": [35.0, 65.0], "lon_edges": [-40.0, 10.0]},
                   "trappes_0930": {"file": "dt_trappes_tc_20260930.jpg", "lat_edges": [45.0, 52.0], "lon_edges": [-3.0, 7.0]},
                   "bmng": {"file": "dt_bmng.jpg"}}
    V["brest"] = {"lat": BREST[0], "lon": BREST[1], "gp": list(BREST_GP)}

    # ---------------------------------------------------------------------------------------------- report and write
    for r in rows:
        print(f"  {'PASS' if r['pass'] else 'FAIL'}  {r['id']:6s} {r['name']}  -> {r['value']}")
    if not all(r["pass"] for r in rows):
        print("build_ch00_derivatives_taylor: checks FAILED — no data written")
        return 1
    blob = json.dumps(V, separators=(",", ":"), ensure_ascii=False, allow_nan=False).encode("utf-8")
    (DATA / "dt.json").write_bytes(blob)
    data_hashes = {"dt.json": hashlib.sha256(blob).hexdigest()}
    for pimg in sorted(IMG.glob("*.png")):
        data_hashes[f"img/{pimg.name}"] = sha_file(pimg)
    data_hashes["stack_t.bin"] = sha_file(DATA / "stack_t.bin")
    render = {}
    if a.public:
        a.public.mkdir(parents=True, exist_ok=True)
        Image.MAX_IMAGE_PIXELS = None
        Image.open(FTC).convert("RGB").save(a.public / "dt_tc_20231101.jpg", quality=90)
        Image.open(FTRAP_TC).convert("RGB").save(a.public / "dt_trappes_tc_20260930.jpg", quality=90)
        Image.open(BMNG).convert("RGB").resize((4096, 2048), Image.LANCZOS).save(a.public / "dt_bmng.jpg", quality=88)
        for pimg in sorted(IMG.glob("*.png")):
            (a.public / f"dt_{pimg.name}").write_bytes(pimg.read_bytes())
        (a.public / "dt_stack_t.bin").write_bytes((DATA / "stack_t.bin").read_bytes())
        render = {pp.name: sha_file(pp) for pp in sorted(a.public.glob("dt_*"))}
    inputs = {str(pq.relative_to(ROOT)).replace("\\", "/") if ROOT in pq.parents else str(pq): sha_file(pq)
              for pq in [F850, FTRP, FSTK, FTCWV, FOLR, FTC, FTRAP_TC, A4, ISD, ETOPO, IGRA, BMNG, DER / "ciaran_coast_10m.geojson",
                         DER / "ciaran_borders_10m.geojson", CP_REAL / "ne_lines_110m.json"]}
    manifest = {
        "id": "ch00_derivatives_taylor", "storyboard": "movies/ch00/ch00_derivatives_taylor/storyboard.yaml",
        "builder": "movies/data/build_ch00_derivatives_taylor.py",
        "fluidpy": {"repo": "../Fluid Dynamics", **git_sha(FLUID, {
            "calculus_py": "fluidpy/geo/calculus.py", "radiation_py": "fluidpy/geo/radiation.py", "moist_py": "fluidpy/geo/moist.py",
            "sphere_py": "fluidpy/geo/sphere.py", "atmos_py": "fluidpy/geo/atmos.py", "sounding_py": "fluidpy/diag/sounding.py",
            "climatology_py": "fluidpy/diag/climatology.py", "advection_py": "fluidpy/diag/advection.py", "igra_py": "fluidpy/data/igra.py",
            "isd_py": "fluidpy/data/isd.py", "thermo_py": "fluidpy/core/thermo.py", "statics_py": "fluidpy/core/statics.py", "fd_py": "fluidpy/core/fd.py"})},
        "equations_note": "provenance only (QA/reviewer); the movie draws no equation labels or numbers (HOUSE_STYLE §5)",
        "equations": {"partials/total/chain": "Kundu App. B §B.1 (p. 857-858)", "change of variable": "Kundu (B.2.1)",
                      "taylor/fd": "Kundu (10.4)-(10.6) (ch10 p451)", "hydrostatic/scale height": "Vallis (1.51), (1.53)",
                      "exact differentials/entropy": "Vallis (1.61)-(1.65), (1.69)", "clausius-clapeyron": "Vallis (18.27)", "stefan": "Vallis (14.1) form"},
        "parameters": {"brest_station": BREST, "brest_grid_point": BREST_GP, "trappes": TRAPPES, "sounding": "2026-09-30T12 (and T00)",
                       "latent_heat_rates": "L(T) = 2.501e6 - 2370 T[°C] J/kg; drawn curve library defaults (L 2.44e6, R_v 462, e0 612 Pa at 273 K)",
                       "cited": {"warming": "1.26 °C 2016-2025 vs 1850-1900 (Forster et al. 2026, ESSD 18, 3889)",
                                 "observed_vapour": "≈ 4-5 % per °C (Allan et al. 2022, JGR 127, e2022JD036728)",
                                 "heavy_rain": "≈ 7 % per °C projected (IPCC AR6 WG1 SPM B.2.4)", "erf_2xco2": "3.93 W/m² (AR6 WG1 §7.3.2.1)",
                                 "planck_ar6": "−3.22 W m⁻² K⁻¹ (AR6 WG1 Table 7.10)", "sigma": "5.670374419e-8 (CODATA 2022)",
                                 "grids": "ENIAC 1950 736 km (Charney, Fjørtoft & von Neumann 1950); FAR-era ~500 km; ECMWF IFS TCo1279 ~9 km"},
                       "time_compression": {"s00": "balloon 15 min in ~4 s", "s04": "12 h of hourly frames in ~5 s", "s08": "17-19 UTC in ~6 s",
                                            "s09/s18": "balloon 15 min in ~6-8 s", "s16/s17": "flights 1 h in ~8 s", "s20": "streaks ×600 (10-min RK2 steps, frozen 18 UTC field)"},
                       "exaggerations": ["s05/s11/s13 temperature drawn as height (landscape)", "s22 relief ×5 vertical",
                                         "s26 column height not to scale", "s09b layer stack heights ×45 (zg area means; 730 × 780 km footprint, 16.5 km tall)", "s28 a 50 % expansion (thought experiment)", "title zoom window ×8"]},
        "credits": [
            "Contains modified Copernicus Climate Change Service information 2026 (ERA5 hourly 850 hPa, pressure levels, monthly TCWV, Ciarán surface).",
            "Durre, I., et al.: Integrated Global Radiosonde Archive (IGRA) v2, NOAA NCEI (Trappes 30 Sep 2026, 00 and 12 UTC).",
            "NOAA NCEI Integrated Surface Database (ISD): Brest-Guipavas 07110 SYNOP (WMO Resolution 40 notice applies).",
            "CERES EBAF-TOA Edition 4.2.1, NASA Langley Research Center (Loeb et al. 2018, J. Climate 31, 895).",
            "Imagery from the NASA Worldview application, part of NASA ESDIS (MODIS Aqua/Terra Corrected Reflectance, NASA LANCE / GIBS).",
            "Blue Marble: Next Generation, NASA Earth Observatory (Reto Stöckli, NASA GSFC).",
            "ETOPO 2022 Global Relief Model, NOAA NCEI (public domain), doi:10.25921/fd45-gt74.",
            "Made with Natural Earth (public domain).",
            "Music: tools/sound (procedural synthesis, our own code, CC0-1.0), style tangent-glide seed 11."],
        "js_selftest": "none — the composition has no JS physics; every number is read from data/dt.json (TSX CHECK rows re-assert the screen strings)",
        "narration_changes_from_data": narration_changes,
        "screen_changes_from_data": [
            "s22: storyboard '+200 m' and '2.1 km' vs '4.8 km' -> ETOPO 2022 60-arc-s hill: height gain 135.5 m (shown '+140 m'), drawn trails 4.0 km (straight) and 9.0 km (winding)",
            "s19: underbrace and bar for the sideways terms '~1e-4' -> '~3e-5' / 'a few x 10^-5' (DT26); storyboard on_screen_eq updated",
            "s25: '-10/290 = -3.4 %' shown as '-3.45 %' (the spoken 'about three and a half percent'); storyboard constant kept for the equations gate",
            "s31: slope shown with the data value -4.86 K/km in the arithmetic (spoken 'minus four point nine'), so 12.3 - 4.26 x 4.86 = -8.4 is exact on screen",
            "s21: (-5.7e-3)(-12.2) = 0.0695 shown as '~ +0.069' = the data value 0.0689 rounded (DT28)"],
        "music": {"style": "tangent-glide", "seed": 11, "key": "B-flat major (Lydian E)", "tempo": "4/4 at 72 bpm",
                  "spec_note": "chords two bars each (6.67 s) so they change on the bar, instead of the storyboard's 8 s"},
        "stack_products": stack_rows, "inputs_sha256": inputs, "render_assets": render, "data_files": data_hashes, "checks": rows,
        "physics": [e for e in entries if e.get("sha256")], "physics_recorded": [e for e in entries if not e.get("sha256")], "physics_heavy": heavy,
    }
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=1, ensure_ascii=False, default=str), encoding="utf-8")
    print(f"build_ch00_derivatives_taylor: dt.json {len(blob) / 1e3:.0f} kB + {len(data_hashes) - 1} png; {len(entries)} parity entries, "
          f"{len(heavy)} heavy, {len(rows)} checks -> {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
