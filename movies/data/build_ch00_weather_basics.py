"""Physics and real-data products for the Chapter-0B movie "Weather basics: pressure, temperature, humidity and wind,
from scratch" (movies/ch00/ch00_weather_basics/storyboard.yaml, version 1: 62 scenes, CHECK rows W01-W52 of
data_needs.md §D, orchestrator decisions §E).

Run with the main venv::

    .venv/Scripts/python.exe movies/data/build_ch00_weather_basics.py

Every number the movie shows or says is computed here by the tested functions named in the storyboard's
``physics_source`` fields:

* ``fluidpy.core.statics`` (``isothermal_pressure``, ``standard_atmosphere``, ``linear_lapse_pressure``),
  ``fluidpy.core.thermo.perfect_gas_density``, ``fluidpy.core.stratification`` (``adiabatic_lapse_rate``),
* ``fluidpy.geo.atmos`` (``scale_height``, ``sea_level_pressure``, ``wind_direction_from``,
  ``lapse_rate_tropopause``), ``fluidpy.geo.constants`` (``KNOT``, ``NAUTICAL_MILE``, ``EARTH_RADIUS``),
  ``fluidpy.geo.vectors`` (``norm``, ``dot``),
* ``fluidpy.geo.moist`` (``saturation_vapour_pressure`` (18.28), ``dew_point``, ``relative_humidity``,
  ``specific_humidity`` / ``vapour_pressure_from_q`` (18.12), ``lifting_condensation_level``),
* ``fluidpy.diag.climatology`` (``daily_climatology``, ``band_share``), ``fluidpy.diag.fronts`` (``front_lines`` with
  ``locate="centre"``, ``front_fields``), ``fluidpy.diag.cyclone`` (``storm_centre``, ``storm_relative_wind``),
  ``fluidpy.diag.trajectories.advect_on_sphere`` (streaklines),

on the committed derived data in ``data/derived/ch00/`` (IGRA2 soundings, ERA5 global hour / columns / 850 hPa /
Brest series, NCEP R1 means, GFS latest analysis, MODIS true colour) and the ERA5 hourly Ciarán file on G: (A1).

Writes movies/ch00/ch00_weather_basics/data/*.json (+ *.bin, Float32 little-endian with a JSON header) and
manifest.json (function, Vallis § / equation provenance, parameters, fluidpy git SHA + sha256 of the source files,
sha256 of each data file, a parity hash per light call computed the way tools/movie_qa.py re-computes it, and the
heavy calls on big input grids recorded by input/output hash in ``physics_heavy``). All CHECK rows must pass before
anything is written (exit 1 otherwise). Images (true colour, Blue Marble) are not copied: they are listed with their
sha256 under ``assets`` for the composition. The composition only indexes and interpolates these samples.
"""
from __future__ import annotations

import hashlib
import importlib
import json
import subprocess
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
FLUID = ROOT.parent / "Fluid Dynamics"
OUT = ROOT / "movies" / "ch00" / "ch00_weather_basics"
DATA = OUT / "data"
DER = ROOT / "data" / "derived" / "ch00"
CP_REAL = ROOT / "movies" / "ch00" / "ch00_cross_product_why" / "data" / "real"   # read only (A5 climatology)
A1 = Path("G:/Geophysical Fluid Dynamics/aofd-data/raw/ERA5-ARCO/"
          "era5_ciaran_2023_u10-v10-msl-t2m_2023-11-01T00_2023-11-02T23_1h.nc")

sys.path.insert(0, str(FLUID))
import xarray as xr  # noqa: E402

from fluidpy.core import statics as ST  # noqa: E402
from fluidpy.geo import atmos as AT  # noqa: E402
from fluidpy.geo import moist as MO  # noqa: E402
from fluidpy.geo.constants import EARTH_RADIUS, G0, KNOT, NAUTICAL_MILE, R_D  # noqa: E402

DEG = np.pi / 180.0
BREST = (48.45, -4.42)           # Brest (city), the ERA5 point used is 48.5N 4.5W
BREST_GP = (48.5, -4.5)
AZORES = (38.5, -28.0)           # centre of the archipelago (for the "near the Azores" check)
P0, T15 = 101325.0, 288.15
S, M, GA, MOI, V = ("fluidpy.core.statics.", "fluidpy.core.thermo.", "fluidpy.geo.atmos.", "fluidpy.geo.moist.",
                    "fluidpy.geo.vectors.")

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


def git_sha(repo: Path, files: dict) -> dict:
    run = lambda *a: subprocess.run(["git", "-C", str(repo), *a], capture_output=True, text=True).stdout.strip()  # noqa: E731
    out = {"commit": run("rev-parse", "HEAD"), "dirty_tracked": bool(run("status", "--porcelain", "--untracked-files=no"))}
    for k, rel in files.items():
        p = repo / rel
        out[f"{k}_tracked"] = bool(run("ls-files", rel))
        out[f"{k}_sha256"] = hashlib.sha256(p.read_bytes()).hexdigest() if p.exists() else None
    return out


def _prm(v):
    """Manifest record of one parameter of a heavy call: scalars as they are, arrays by shape + hash."""
    if isinstance(v, (int, float, str, bool, type(None))):
        return v
    if isinstance(v, tuple) and all(isinstance(x, (int, float, str)) for x in v):
        return list(v)
    if isinstance(v, xr.Dataset):
        return f"xarray.Dataset vars {list(v.data_vars)}, sha256 {hashlib.sha256(json.dumps({k: np.asarray(v[k]).tolist() for k in v.data_vars}).encode()).hexdigest()}"
    try:
        a = np.asarray(v, dtype=float)
        return f"array {a.shape}, sha256 {parity_hash(a)}"
    except Exception:
        return f"{type(v).__name__}"


def sha_file(p: Path) -> str:
    return hashlib.sha256(p.read_bytes()).hexdigest()


def lut_hex(name: str, n: int = 64) -> list[str]:
    """A colour map from the project LUT file (assets/luts.json, tools/make_luts.py), resampled to n hex colours."""
    import base64
    tab = json.loads((ROOT / "assets" / "luts.json").read_text(encoding="utf-8"))["tables"][name]
    rgb = np.frombuffer(base64.b64decode(tab), dtype=np.uint8).reshape(-1, 3)
    idx = np.round(np.linspace(0, len(rgb) - 1, n)).astype(int)
    return ["#%02x%02x%02x" % tuple(int(c) for c in rgb[i]) for i in idx]


def bin_pack(name: str, variables: list[tuple[str, list[str], np.ndarray, str, str]], coords: dict, extra: dict) -> tuple[dict, bytes]:
    """Float32 little-endian blob + JSON header in the cross-product movie's format."""
    hdr = {"format": "float32 little-endian, C order (last axis fastest); NaN = missing", "bin": f"{name}.bin",
           "variables": [], "coords": coords, **extra}
    blob, off = b"", 0
    for vname, dims, arr, units, long in variables:
        a = np.ascontiguousarray(np.asarray(arr, dtype="<f4"))
        hdr["variables"].append({"name": vname, "dims": dims, "shape": list(a.shape), "offset_bytes": off,
                                 "count": int(a.size), "units": units, "long_name": long,
                                 "min": float(np.nanmin(a)), "max": float(np.nanmax(a))})
        blob += a.tobytes()
        off += a.nbytes
    return hdr, blob


def gc_km(lat1, lon1, lat2, lon2, a=EARTH_RADIUS):
    """Great-circle distance [km] (haversine)."""
    p1, p2 = np.radians(lat1), np.radians(lat2)
    dl = np.radians(np.asarray(lon2) - np.asarray(lon1))
    h = np.sin((p2 - p1) / 2) ** 2 + np.cos(p1) * np.cos(p2) * np.sin(dl / 2) ** 2
    return 2 * a * np.arcsin(np.sqrt(np.clip(h, 0, 1))) / 1e3


def enu_km(lat, lon, clat, clon, a=EARTH_RADIUS):
    dlon = (np.asarray(lon) - clon + 180.0) % 360.0 - 180.0
    return a * np.cos(clat * DEG) * dlon * DEG / 1e3, a * (np.asarray(lat) - clat) * DEG / 1e3


def dest(clat, clon, east_km, north_km, a=EARTH_RADIUS):
    return clat + north_km * 1e3 / a / DEG, clon + east_km * 1e3 / (a * np.cos(clat * DEG)) / DEG


def bilin(F, lat, lon, plat, plon):
    """Bilinear samples of F(lat, lon) (1-D ascending axes) at points; NaN outside."""
    from scipy.interpolate import RegularGridInterpolator
    f = RegularGridInterpolator((lat, lon), F, bounds_error=False, fill_value=np.nan)
    return f(np.stack([np.ravel(plat), np.ravel(plon)], -1)).reshape(np.shape(plat))


def contours(F, lat, lon, levels, periodic=False, nd=2, min_pts=4):
    """Isolines of F every level ({level, lines: [[lon, lat, ...]]}) with skimage marching squares."""
    from skimage.measure import find_contours
    G = np.concatenate([F, F[:, :1]], axis=1) if periodic else F
    dlo = lon[1] - lon[0]
    lon_ext = np.append(lon, lon[-1] + dlo) if periodic else lon
    out = []
    for lev in levels:
        lines = []
        for c in find_contours(G, lev):
            if len(c) < min_pts:
                continue
            la = np.interp(c[:, 0], np.arange(lat.size), lat)
            lo = np.interp(c[:, 1], np.arange(lon_ext.size), lon_ext)
            if periodic:
                lo = (lo + 180.0) % 360.0 - 180.0
            lines.append(np.round(np.stack([lo, la], -1), nd).ravel().tolist())
        if lines:
            out.append({"level": float(lev), "lines": lines})
    return out


def circ_diff(a, b):
    """Smallest absolute difference between two directions [deg]."""
    return np.abs((np.asarray(a) - np.asarray(b) + 180.0) % 360.0 - 180.0)


def open_a1():
    """A1 ERA5 hourly box, longitudes wrapped to −180…180 and both axes ascending."""
    ds = xr.open_dataset(A1)
    ds = ds.assign_coords(longitude=((ds.longitude + 180.0) % 360.0) - 180.0).sortby("longitude").sortby("latitude")
    return ds.rename({"10m_u_component_of_wind": "u10", "10m_v_component_of_wind": "v10",
                      "mean_sea_level_pressure": "msl", "2m_temperature": "t2m", "latitude": "lat", "longitude": "lon"})


# ---------------------------------------------------------------------------------------------------------- main


def main() -> int:
    DATA.mkdir(parents=True, exist_ok=True)
    rows: list[dict] = []
    entries: list[dict] = []
    heavy: list[dict] = []
    files: dict[str, dict] = {}
    bins: dict[str, bytes] = {}
    narration_changes: list[str] = []

    def row(wid, name, val, ref, tol):
        v, r = np.asarray(val, dtype=float), np.asarray(ref, dtype=float)
        ok = bool(np.all(np.abs(v - r) <= tol))
        rows.append({"id": wid, "name": name, "value": r6(np.ravel(v)[:6]), "ref": r6(np.ravel(r)[:6]), "tol": tol, "pass": ok})
        return ok

    def rng(wid, name, val, lo, hi):
        v = np.asarray(val, dtype=float)
        ok = bool(np.all((v >= lo) & (v <= hi)))
        rows.append({"id": wid, "name": name, "value": r6(np.ravel(v)[:6]), "ref": f"[{lo}, {hi}]", "tol": None, "pass": ok})
        return ok

    def truth(wid, name, cond, value=None):
        rows.append({"id": wid, "name": name, "value": value if value is not None else bool(cond), "ref": True,
                     "tol": 0, "pass": bool(cond)})

    def call(fn: str, scene: str, data: str, eq: str, heavy_call: bool = False, **params):
        mod, name = fn.rsplit(".", 1)
        out = getattr(importlib.import_module(mod), name)(**params)
        try:
            jp = {k: (np.asarray(v).tolist() if isinstance(v, np.ndarray) else v) for k, v in params.items()}
            size = len(json.dumps(jp))
        except TypeError:
            heavy_call, size = True, 0
        if heavy_call or size > 200_000:   # big input grid: keep the manifest small; record hashes, not the grid
            heavy.append({"fn": fn, "scene": scene, "data": f"data/{data}", "eq": eq,
                          "params": {k: _prm(v) for k, v in params.items()},
                          "output_sha256": parity_hash(out)})
            return out
        entries.append({"fn": fn, "scene": scene, "data": f"data/{data}", "eq": eq, "params": jp, "sha256": parity_hash(out)})
        return out

    # ================================================================ basics.json (s02-s20, s26-s35, s40, s47, s51)
    fb = "basics.json"
    B: dict = {}
    # ---- W04 thin shell (s02)
    shell_mm = 12.0 / (EARTH_RADIUS / 1e3) * 150.0
    row("W04", "s02 shell on a 30-cm globe: 12/6371 × 150 mm ≈ 0.28 mm", shell_mm, 0.2825, 5e-4)
    rng("W04", "s02 said 'about three tenths of a millimetre', 'like three sheets of paper' (0.1 mm each): 2.5-3.5 sheets", shell_mm / 0.1, 2.5, 3.5)
    B["thin_shell"] = {"depth_km": 12, "radius_km": r6(EARTH_RADIUS / 1e3, 1), "globe_radius_mm": 150, "shell_mm": r6(shell_mm, 4),
                       "shell_display": "≈ 0.28 mm", "draw_exaggeration": 50, "px_true_scale_on_380px": r6(12 / 6371 * 380, 3)}
    # ---- W05 composition (s03; USSA-1976 Table 3, NOAA GML 2023)
    comp = {"N2": 78.084, "O2": 20.946, "Ar": 0.934, "CO2": 0.0419}
    row("W05", "s03 N2 + O2 + Ar = 99.964 % (USSA-1976 dry air)", comp["N2"] + comp["O2"] + comp["Ar"], 99.964, 1e-9)
    row("W05", "s03 CO2 419 ppm = 0.0419 % ≈ four hundredths of one percent", comp["CO2"], 0.04, 0.0025)
    B["composition_percent"] = {**comp, "H2O": "0-4 (variable)", "source": "U.S. Standard Atmosphere 1976 Table 3; NOAA GML 2023 global mean CO2"}
    # ---- W06 column mass (s05)
    mass = P0 / G0
    disp_mass = P0 / 9.81
    row("W06", "s05 p0/g = 10 332 kg (g = 9.80665)", mass, 10332.3, 0.1)
    row("W06", "s05 display 101 325/9.81 ≈ 10 300 kg (10 329)", round(disp_mass, -2), 10300, 0)
    rng("W06", "s05 'as heavy as seven cars' (1.5 t each): 6.5-7.5 cars", mass / 1500.0, 6.5, 7.5)
    p_back = call(S + "hydrostatic_pressure_uniform", "s05", fb, "inverse check: a uniform column of that mass gives p0 at the ground (Vallis (1.51))",
                  z=0.0, p0=0.0, rho=mass / 1000.0, g=G0)   # p(z) = p0 - rho g z: a 1000-m column of density m/1000 -> p(0) = 0
    p_top0 = call(S + "hydrostatic_pressure_uniform", "s05", fb, "same column: pressure at its base (z = −1000 m below its top)",
                  z=-1000.0, p0=0.0, rho=mass / 1000.0, g=G0)
    row("W06", "s05 inverse: uniform column holding m kg over 1 m² weighs p0 (hydrostatic_pressure_uniform)", [p_back, p_top0], [0.0, P0], 1e-6)
    B["column"] = {"p0_Pa": P0, "g": 9.81, "g_exact": G0, "mass_kg": r6(mass, 2), "display_mass": "≈ 10 300 kg", "cars": 7, "car_t": 1.5}
    # ---- W07 hPa (s07)
    row("W07", "s07 101 325 Pa = 1013.25 hPa", P0 / 100, 1013.25, 1e-12)
    B["hpa"] = {"p0_hPa": 1013.25, "display": "≈ 1013 hPa", "barometer_range_hPa": [950, 1050]}
    # ---- W08-W12 density, kelvin, gas law
    rho15 = call(M + "perfect_gas_density", "s08,s11,s16", fb, "Vallis (1.53) p = ρRT → ρ = p/(RT)", p=P0, T=T15)
    room = 5 * 4 * 2.5
    row("W08", "s08 room 5 × 4 × 2.5 = 50 m³; 50 × 1.2 = 60 kg", [room, room * 1.2], [50, 60], 1e-12)
    rng("W08", "s08 with ρ = 1.225: 61.2 kg ('about sixty')", room * rho15, 58, 62)
    row("W09", "s09 15 °C = 288.15 K", 15 + 273.15, 288.15, 1e-12)
    row("W10", "s10 R (dry air) = 287.06 J/(kg K) (fluidpy constant), said 287", R_D, 287.06, 5e-3)
    row("W11", "s11 ρ(101 325 Pa, 288.15 K) = 1.2250 kg/m³", rho15, 1.2250, 5e-5)
    row("W11", "s11 display 101 325/(287 × 288.15) ≈ 1.225", P0 / (287 * 288.15), 1.225, 5e-4)
    rho_c = call(M + "perfect_gas_density", "s12", fb, "Vallis (1.53) at 0 °C and 30 °C, same pressure", p=P0, T=[273.15, 303.15])
    row("W12", "s12 ρ(0 °C) = 1.292, ρ(30 °C) = 1.164 kg/m³", rho_c, [1.2922, 1.1644], 5e-4)
    row("W12", "s12 (1.29 − 1.16)/1.29 ≈ 10 %; exact (ρ0 − ρ30)/ρ0 = 30/303.15 = 9.9 %", [(1.29 - 1.16) / 1.29, (rho_c[0] - rho_c[1]) / rho_c[0]], [0.1008, 0.0990], 5e-4)
    B["density"] = {"room_m": [5, 4, 2.5], "room_m3": room, "rho_display": 1.2, "room_kg": 60, "rho15": r6(rho15, 5),
                    "kelvin": {"C": [-273.15, 0, 15], "K": [0, 273.15, 288.15]}, "R": r6(R_D, 3), "R_display": 287,
                    "rho_0C": r6(rho_c[0], 4), "rho_30C": r6(rho_c[1], 4), "lighter_percent": r6(100 * (rho_c[0] - rho_c[1]) / rho_c[0], 2)}
    # ---- W13 slab limit (s13-s15) and W17 exponential (s19) by sympy
    import sympy as sp
    z, h, g_, rho_, H_, p0_ = sp.symbols("z h g rho H p0", positive=True)
    pf = sp.Function("p")
    c3 = sp.Symbol("c3")
    ptest = p0_ * sp.exp(-z / H_) + c3 * z ** 3              # a smooth test profile (exponential + cubic)
    lhs = sp.limit((ptest - ptest.subs(z, z + h)) / h, h, 0)  # slab balance divided by Δz: (p(z) − p(z+Δz))/Δz
    dpz = sp.Symbol("dpdz")
    sol = sp.solve(sp.Eq(-dpz, rho_ * g_), dpz)
    truth("W13", "s14-s15 sympy: (p(z) − p(z+Δz))/Δz → −∂p/∂z as Δz → 0 (test profile), so the slab balance gives ∂p/∂z = −ρg",
          sp.simplify(lhs + sp.diff(ptest, z)) == 0 and len(sol) == 1 and sp.simplify(sol[0] + rho_ * g_) == 0)
    del pf
    pexp = p0_ * sp.exp(-z / H_)
    truth("W17", "s19 sympy: d/dz(p0 e^{−z/H}) = −p/H and p(0) = p0", sp.simplify(sp.diff(pexp, z) + pexp / H_) == 0 and pexp.subs(z, 0) == p0_)
    # ---- W14-W16 near the ground (s16)
    rg = rho15 * G0
    row("W14", "s16 ρg = 12.01 Pa/m", rg, 12.01, 5e-3)
    row("W14", "s16 display 1.225 × 9.81 ≈ 12", 1.225 * 9.81, 12.017, 1e-3)
    row("W15", "s16 100 Pa ÷ 12.01 Pa/m = 8.32 m per hPa ('about every eight metres')", 100 / rg, 8.32, 5e-3)
    piso300 = call(S + "isothermal_pressure", "s16", fb, "Vallis (1.51)+(1.53) isothermal: lift ride 0-300 m", z=[0.0, 300.0], p0=P0, T=T15)
    drop_lin, drop_exp = 300 * rg / 100, (piso300[0] - piso300[1]) / 100
    row("W16", "s16 300 m × 12.01 Pa/m = 36.0 hPa (said 'about thirty-six'; screen 1013 → 977)", [drop_lin, 1013.25 - 36.04], [36.04, 977.21], 0.02)
    rng("W16", "s16 the isothermal curve gives 35.4 hPa: linear estimate within 2 %", drop_exp / drop_lin, 0.98, 1.0)
    B["near_ground"] = {"rho_g": r6(rg, 4), "m_per_hPa": r6(100 / rg, 3), "tower_m": 300, "drop_linear_hPa": r6(drop_lin, 2),
                        "drop_isothermal_hPa": r6(drop_exp, 2), "readout_hPa": [1013, 977]}
    # ---- W18-W20 scale height and exponential (s18-s20)
    H = call(GA + "scale_height", "s18,s19,s20", fb, "H = RT/g (Vallis text after (1.186))", T=T15)
    row("W18", "s18 H(288.15 K) = 8434.7 m; uniform-density height p0/(ρ0 g) the same", [H, P0 / (rho15 * G0)], [8434.7, 8434.7], 0.1)
    row("W18", "s18 display 287 × 288.15/9.81 ≈ 8.4 km", 287 * 288.15 / 9.81 / 1e3, 8.430, 1e-3)
    zs_ = np.array([H, 2 * H, H * np.log(2), 2 * H * np.log(2)])
    pz = call(S + "isothermal_pressure", "s20", fb, "p = p0 e^{−z/H} at H, 2H, H ln 2, 2H ln 2", z=zs_.tolist(), p0=P0, T=T15) / 100
    row("W18", "s20 p(H) = 372.8 hPa, p(2H) = 137.1 hPa (÷ e each)", pz[:2], [372.76, 137.13], 0.05)
    row("W19", "s20 halving height H ln 2 = 5.85 km → 506.6 hPa; 11.69 km → 253.3 hPa", [zs_[2] / 1e3, pz[2], zs_[3] / 1e3, pz[3]], [5.846, 506.6, 11.693, 253.3], 0.06)
    row("W19", "s20 display 8.43 × ln 2 ≈ 5.8 km", 8.43 * np.log(2), 5.843, 1e-3)
    row("W20", "s20 fraction lost per km 1 − e^{−1/8.43} = 11.2 %", 1 - np.exp(-1000 / H), 0.1118, 5e-4)
    zc = np.arange(0.0, 50001.0, 250.0)
    pcurve = call(S + "isothermal_pressure", "s19-s22", "atmos.json", "isothermal curve 0-50 km (H = 8.43 km)", z=zc.tolist(), p0=P0, T=T15)
    B["scale_height"] = {"H_m": r6(H, 1), "H_display_km": 8.4, "H_calc": "287 × 288.15 ÷ 9.81 ≈ 8.4 km",
                         "p_steps_hPa": r6([1013.25, *pz[:2]], 1), "halving": {"z_km": r6(zs_[2:] / 1e3, 3), "p_hPa": r6(pz[2:], 1)},
                         "loss_per_km": r6(1 - np.exp(-1000 / H), 4)}
    # ---- W26b adiabatic lapse rate (s26)
    gam = call("fluidpy.core.stratification.adiabatic_lapse_rate", "s26,s31", fb, "Vallis (2.246) Γd = g/cp (Kundu sign dT/dz)")
    row("s26", "s26 dry adiabatic cooling 9.76 K/km ('almost ten degrees'); screen '≈ 9.8 °C per km'", abs(gam) * 1e3, 9.76, 0.01)
    B["adiabatic_K_per_km"] = r6(abs(gam) * 1e3, 3)
    # ---- W33-W34 wind (s32-s34)
    spd = call(V + "norm", "s32", fb, "speed = |(8, 6)| by Pythagoras", a=[8.0, 6.0])
    wd = call(GA + "wind_direction_from", "s33", fb, "meteorological direction (from), clockwise from north", u=8.0, v=6.0)
    row("s32", "s32 |(8, 6)| = 10 m/s", spd, 10.0, 1e-12)
    row("W33", "s33 wind_direction_from(8, 6) = 233.13° (south-westerly)", wd, 233.13, 5e-3)
    cards = call(GA + "wind_direction_from", "s33", fb, "compass check: westerly, southerly, northerly, easterly", u=[5.0, 0.0, 0.0, -5.0], v=[0.0, 5.0, -5.0, 0.0])
    row("W33", "s33 westerly 270°, southerly 180°, northerly 0°, easterly 90°", cards, [270, 180, 0, 90], 1e-9)
    row("W34", "s34 KNOT = 0.5144 m/s; NAUTICAL_MILE = 1852 m; 2πa/21600 = 1853.2 m (1′ of latitude)",
        [KNOT, NAUTICAL_MILE, 2 * np.pi * EARTH_RADIUS / 21600], [0.51444, 1852, 1853.2], 0.05)
    row("W34", "s34 10 m/s = 36 km/h = 19.44 kt; display 10 ÷ 0.514 ≈ 19", [10 * 3.6, 10 / KNOT, 10 / 0.514], [36, 19.438, 19.455], 5e-3)
    B["wind"] = {"uv": [8, 6], "speed": r6(spd), "dir_from": r6(wd, 2), "name": "south-westerly", "kmh": 36, "knot_ms": r6(KNOT, 4),
                 "nm_m": NAUTICAL_MILE, "nm_from_radius_m": r6(2 * np.pi * EARTH_RADIUS / 21600, 1), "kt": r6(10 / KNOT, 2)}
    # ---- W38 sea-level pressure (s40)
    slp = call(GA + "sea_level_pressure", "s40", fb, "isothermal reduction p_s e^{z_s/H} (Vallis (1.51)+(1.53); (2.166) general)", p_s=83500.0, z_s=1609.0, T_s=T15)
    row("W38", "s40 835 hPa at 1609 m, 15 °C → 1010.5 hPa", slp / 100, 1010.5, 0.05)
    row("W38", "s40 display 835 × e^{1.609/8.43} ≈ 1010", 835 * np.exp(1.609 / 8.43), 1010.5, 0.1)
    slp_l = call(GA + "sea_level_pressure", "s40", fb, "the more careful version (lapse 6.5 K/km), for the narration's last sentence", p_s=83500.0, z_s=1609.0, T_s=T15, lapse=0.0065)
    rng("W38", "s40 'a slightly more careful version' changes it by < 0.5 %", abs(slp_l - slp) / slp, 0, 0.005)
    B["sea_level"] = {"z_s": 1609, "p_s_hPa": 835, "T_C": 15, "H_km": 8.43, "p_sea_hPa": r6(slp / 100, 2), "p_sea_lapse_hPa": r6(slp_l / 100, 2)}
    # ---- W47 sunlight (s51)
    up = [[np.cos(0.0), 0.0, np.sin(0.0)], [np.cos(60 * DEG), 0.0, np.sin(60 * DEG)]]
    cosl = call(V + "dot", "s51", fb, "sun direction · local up at equinox noon = cos latitude", a=[[1.0, 0.0, 0.0], [1.0, 0.0, 0.0]], b=up)
    row("W47", "s51 cos 0° = 1, cos 60° = 0.5 → a 1-m beam covers 1 m and 2 m", [*cosl, 1 / cosl[1]], [1.0, 0.5, 2.0], 1e-12)
    B["sunlight"] = {"lat": [0, 60], "share": r6(cosl), "patch_m": [1, 2]}
    files[fb] = B

    # ================================================================ atmos.json (s19-s22, s24 standard atmosphere)
    fa = "atmos.json"
    zsa = np.arange(0.0, 86001.0, 250.0)
    sa = call(S + "standard_atmosphere", "s22,s24", fa, "USSA-1976 (geometric heights)", z=zsa.tolist(), geometric=True)
    sa_T, sa_p = np.asarray(sa[0] if isinstance(sa, tuple) else sa["T"]), np.asarray(sa[1] if isinstance(sa, tuple) else sa["p"])
    frac = 1 - np.interp([5500.0, 16000.0, 31000.0], zsa, sa_p) / P0
    row("W22", "s22 mass below 5.5/16/31 km = 0.501/0.898/0.990 (USSA-1976, 1 − p/p0)", frac, [0.501, 0.898, 0.990], 1.5e-3)
    strat = zsa[(zsa > 40000) & (zsa < 60000)][np.argmax(sa_T[(zsa > 40000) & (zsa < 60000)])]
    top_iso = zsa[(zsa > 40000) & (zsa < 60000) & (np.abs(sa_T - sa_T[(zsa > 40000) & (zsa < 60000)].max()) < 1e-6)]
    rng("W25", "s24 stratopause (USSA-1976 warmest layer, base-top km)", [top_iso.min() / 1e3, top_iso.max() / 1e3], 45, 52)
    files[fa] = {"iso": {"z_km": r6(zc / 1e3, 3), "p_hPa": r6(np.asarray(pcurve) / 100, 2), "T_K": T15, "H_km": r6(H / 1e3, 4)},
                 "ussa": {"z_km": r6(zsa / 1e3, 3), "T_C": r6(sa_T - 273.15, 2), "p_hPa": r6(sa_p / 100, 4)},
                 "mass_below": {"z_km": [5.5, 16, 31], "fraction": r6(frac, 3), "display": ["50 %", "90 %", "99 %"]},
                 "stratopause_km": [r6(top_iso.min() / 1e3, 2), r6(top_iso.max() / 1e3, 2)]}
    del strat

    # ================================================================ soundings.json (s00, s21, s23-s25)
    fs = "soundings.json"
    ig = xr.open_dataset(DER / "igra2_trappes_singapore_2023-11-01T00.nc")
    col = xr.open_dataset(DER / "era5_columns_trappes_singapore_2023-11-01.nc")
    zon = xr.open_dataset(DER / "era5_zonal_t_z_tropopause_2023-11.nc")
    SND: dict = {}
    for k, key in enumerate(["trappes", "singapore"]):
        n = int(ig.n_levels[k])
        p, zh, T = (ig[v][k, :n].values.astype(float) for v in ("p", "z_hyps", "T"))
        ok = np.isfinite(p) & np.isfinite(zh) & np.isfinite(T)
        p, zh, T = p[ok], zh[ok], T[ok]
        filled = ig.z_is_filled[k, :n].values[ok].astype(int)
        lt = str(np.datetime_as_string(ig.launch_time.values[k], unit="m"))
        trop = call(GA + "lapse_rate_tropopause", "s24,s25", fs, f"WMO (1957) lapse-rate tropopause on {key} (z_hyps, IGRA2 00 UTC 1 Nov 2023)",
                    T=T.tolist(), z=zh.tolist(), p=p.tolist())
        tz, tT = float(trop[0]), float(trop[1])
        SND[key] = {"station": str(ig.station.values[k]), "lat": r6(float(ig.station_lat[k]), 3), "lon": r6(float(ig.station_lon[k]), 3),
                    "launch_utc": lt, "z_km": r6(zh / 1e3, 4), "p_hPa": r6(p / 100, 2), "T_C": r6(T - 273.15, 2), "z_filled": filled.tolist(),
                    "tropopause": {"z_km": r6(tz / 1e3, 3), "T_C": r6(tT - 273.15, 2)}, "top_km": r6(zh.max() / 1e3, 2)}
        truth("W21", f"s21/s25 {key} sounding is the 00 UTC 1 Nov 2023 launch ('around midnight')", lt.startswith("2023-11-01T00"), lt)
        if key == "trappes":
            row("W24", "s24 Trappes WMO tropopause on z_hyps = 10.88 km, −62.70 °C (fluidpy F11)", [tz / 1e3, tT - 273.15], [10.883, -62.70], 5e-3)
            rng("W24", "s24 Trappes tropopause height in 9.5-12.5 km ('about eleven kilometres')", tz / 1e3, 9.5, 12.5)
            rng("W24", "s24 Trappes tropopause T in −65…−50 °C (orchestrator §E: follows the data); said 'about minus sixty-three'", tT - 273.15, -65, -50)
            row("W24", "s24 spoken 'about minus sixty-three' = −62.7 rounded", round(tT - 273.15), -63, 0)
            rng("W25", "s24 balloon burst (top of the sounding) 'around thirty kilometres': 28-36 km", zh.max() / 1e3, 28, 36)
            # W21: pressure vs the isothermal curve
            piso = call(S + "isothermal_pressure", "s21", fs, "the isothermal curve at the balloon's heights", z=zh.tolist(), p0=P0, T=T15)
            rel = p / np.asarray(piso) - 1
            rng("W21", "s21 near the ground (< 2 km) the balloon's p is within 2 % of the curve", np.abs(rel[zh < 2000]).max(), 0, 0.02)
            truth("W21", "s21 above 6 km every balloon pressure is below the curve ('falls a little faster')", bool(np.all(rel[zh > 6000] < 0)),
                  r6(rel[zh > 6000].max(), 4))
            # mean temperature below 6-11 km colder than 288.15 (the reason given)
            truth("W21", "s21 the air aloft (2-10 km) is colder than the curve's 15 °C, so its H is smaller", bool(np.all(T[(zh > 2000) & (zh < 10000)] < T15)))
            ev = np.exp(np.interp(8849.0, zh, np.log(p))) / 100
            pev = call(S + "isothermal_pressure", "s21", fs, "Everest height on the curve", z=8849.0, p0=P0, T=T15) / 100
            SND[key]["everest"] = {"z_km": 8.849, "curve_hPa": r6(pev, 1), "balloon_hPa": r6(ev, 1)}
            # W23 mean lapse 0-10 km (least-squares fit)
            sel = zh <= 10000
            slope = np.polyfit(zh[sel] / 1e3, T[sel], 1)[0]
            rng("W23", "s23 mean lapse rate 0-10 km (least squares, Trappes) in 5.5-7.5 K/km", -slope, 5.5, 7.5)
            SND[key]["lapse_fit_K_per_km"] = r6(-slope, 3)
            SND[key]["lapse_fit_intercept_C"] = r6(np.polyfit(zh[sel] / 1e3, T[sel], 1)[1] - 273.15, 3)
            # s00 title readouts W01
            zr = np.array([zh.min(), 12000.0])
            Tr = np.interp(zr, zh, T) - 273.15
            pr = np.exp(np.interp(zr, zh, np.log(p))) / 100
            SND[key]["title_readout"] = {"z_km": r6(zr / 1e3, 3), "T_C": r6(Tr, 1), "p_hPa": r6(pr, 0)}
            rng("W01", "s00 title readout: ground T 10-15 °C (Trappes 00 UTC)", Tr[0], 10, 15)
            rng("W01", "s00 title readout: T at 12 km −65…−50 °C", Tr[1], -65, -50)
            rng("W01", "s00 title readout: ground p 980-1000 hPa", pr[0], 980, 1000)
            rng("W01", "s00 title readout: p at 12 km 180-210 hPa", pr[1], 180, 210)
        else:
            rng("W26", "s25 Singapore tropopause 15.5-17.5 km ('sixteen or seventeen')", tz / 1e3, 15.5, 17.5)
            rng("W26", "s25 Singapore tropopause T < −72 °C ('below minus seventy-five')", tT - 273.15, -90, -75)
            row("W26", "s25 Singapore tropopause = 16.16 km, −81.30 °C (fluidpy F11)", [tz / 1e3, tT - 273.15], [16.163, -81.30], 5e-3)
        # agreement with the stored product
        row("W24" if key == "trappes" else "W26", f"{key}: equals the IGRA product's wmo_trop_z/T", [tz, tT],
            [float(ig.wmo_trop_z[k]), float(ig.wmo_trop_T[k])], 0.01)
    # ERA5 column over Trappes at the balloon time (00 UTC) to 1 hPa
    ct = col.sel(site="Trappes", time="2023-11-01T00")
    cz, cT = ct.z.values.astype(float), ct.t.values.astype(float)
    o = np.argsort(cz)
    cz, cT = cz[o], cT[o]
    SND["era5_column_trappes"] = {"time_utc": "2023-11-01T00", "lat": float(col.site_lat.sel(site="Trappes")), "lon": float(col.site_lon.sel(site="Trappes")),
                                  "z_km": r6(cz / 1e3, 3), "T_C": r6(cT - 273.15, 2), "p_hPa": r6(np.sort(col.level.values)[::-1].astype(float), 1)}
    top10 = cT[cz > cz.max() - 10000]
    truth("W25", "s24 ERA5 column over Trappes: the warming continues up to its top (1 hPa, ~46 km): T rises over the top 10 km",
          bool(top10[-1] > top10[0] + 10 and cz.max() > 44000), r6([cz.max() / 1e3, top10[0] - 273.15, top10[-1] - 273.15], 2))
    row("W25", "s24 ERA5 column min T near the balloon's tropopause (−62.3 °C at ~11 km)", [cT.min() - 273.15], [SND["trappes"]["tropopause"]["T_C"]], 1.5)
    # zonal-mean tropopause (s25 inset), W27 polar
    zlat = zon.lat.values.astype(float)
    zt = zon.trop_z_mean.values.astype(float)
    w = np.cos(zlat * DEG)
    nh, shh = zlat >= 70, zlat <= -70
    eq = np.abs(zlat) <= 10
    arc, ant = float(np.sum(zt[nh] * w[nh]) / np.sum(w[nh])), float(np.sum(zt[shh] * w[shh]) / np.sum(w[shh]))
    rng("W27", "s25 polar tropopause (Nov 2023 zonal mean, cos-weighted ≥ 70°N and ≤ 70°S) in 7-10.5 km", [arc / 1e3, ant / 1e3], 7, 10.5)
    rng("W27", "s25 'about eight to ten kilometres': every zonal mean poleward of 70° in 8-10.5 km", zt[nh | shh] / 1e3, 8.0, 10.5)
    rng("W26", "s25 equatorial zonal-mean tropopause (|lat| ≤ 10) 15.5-17.5 km", zt[eq] / 1e3, 15.5, 17.5)
    SND["zonal_tropopause"] = {"month": "2023-11", "lat": r6(zlat, 1), "z_km": r6(zt / 1e3, 3), "T_C": r6(zon.trop_T_mean.values - 273.15, 2),
                               "level_hPa": r6(zon.level.values, 1), "t_zm_C": r6(zon.t_zm.values - 273.15, 1), "z_zm_km": r6(zon.z_zm.values / 1e3, 3),
                               "arctic_km": r6(arc / 1e3, 2), "antarctic_km": r6(ant / 1e3, 2), "equator_km": r6(float(np.mean(zt[eq])) / 1e3, 2)}
    files[fs] = SND

    # ================================================================ moist.json (s27-s31)
    fm = "moist.json"
    e32 = call(MOI + "vapour_pressure_from_q", "s27", fm, "Vallis (18.12) e ≈ q p/ε = 1.61 q p", q=0.020, p=1.0e5)
    row("W28", "s27 q = 20 g/kg at 1000 hPa → e ≈ 32.2 hPa (18.12)", e32 / 100, 32.15, 0.05)
    row("W28", "s27 display 1.61 × 0.020 × 1000 ≈ 32", 1.61 * 0.020 * 1000, 32.2, 1e-9)
    Tc4 = np.array([0.0, 10.0, 20.0, 30.0])
    es4 = call(MOI + "saturation_vapour_pressure", "s28", fm, "Vallis (18.28), constants of Fig. 18.1 (T0 = 273 K, e0 = 6.12 hPa, L = 2.44e6, Rv = 462)",
               T=(Tc4 + 273.15).tolist()) / 100
    row("W29", "s28 e_s at 0/10/20/30 °C = 6.19/12.24/23.13/41.91 hPa ('six, twelve, twenty-three, forty-two')", es4, [6.19, 12.24, 23.13, 41.91], 6e-3)
    rng("W29", "s28 'roughly doubles for every ten degrees': ratios per 10 °C in 1.7-2.1", es4[1:] / es4[:-1], 1.7, 2.1)
    Tcur = np.arange(-10.0, 35.01, 0.5)
    escur = call(MOI + "saturation_vapour_pressure", "s28-s30", fm, "e_s curve −10…35 °C", T=(Tcur + 273.15).tolist()) / 100
    es25 = call(MOI + "saturation_vapour_pressure", "s29", fm, "e_s at 25 °C", T=298.15) / 100
    rh = call(MOI + "relative_humidity", "s29", fm, "ℋ = e/e_s (Vallis §18.1.2)", e=1500.0, T=298.15)
    row("W30", "s29 e_s(25 °C) = 31.29 hPa ('thirty-one point three'); RH = 15/31.29 = 0.479", [es25, rh], [31.29, 0.4794], 6e-3)
    row("W30", "s29 display 15 ÷ 31.3 ≈ 0.48 → 48 %", 15 / 31.3, 0.479, 1e-3)
    td = call(MOI + "dew_point", "s30", fm, "inverse of (18.28): T_d where e_s(T_d) = 15 hPa", e=1500.0)
    row("W31", "s30 dew point of 15 hPa = 286.27 K = 13.1 °C ('about thirteen')", [td, td - 273.15], [286.27, 13.12], 6e-3)
    lcl = call(MOI + "lifting_condensation_level", "s31", fm, "parcel lifted dry-adiabatically from 25 °C / T_d / 1013 hPa (Vallis (2.246), (18.12), (18.28))",
               T=298.15, Td=float(td), p=101300.0)
    zl, pl, Tl = (float(x) for x in lcl)
    rng("W32", "s31 LCL in 1.35-1.65 km ('about one and a half kilometres')", zl / 1e3, 1.35, 1.65)
    # the two lines of the graph: parcel T(z) and its dew point T_d(z) (q conserved: e(z) = e_s(T_d0) p(z)/p0)
    zz = np.linspace(0.0, 3000.0, 61)
    Tz = 298.15 + gam * zz
    pzz = call(S + "linear_lapse_pressure", "s31", fm, "parcel pressure on the dry adiabat (closed form)", z=zz.tolist(), p0=101300.0, T0=298.15, dT_dz=float(gam))
    ez = 1500.0 * np.asarray(pzz) / 101300.0
    Tdz = call(MOI + "dew_point", "s31", fm, "parcel dew point as it rises (q conserved)", e=ez.tolist())
    gap0 = 298.15 - float(td)
    tdrate = (float(td) - float(np.interp(zl, zz, Tdz))) / (zl / 1e3)
    rng("W32", "s31 dew point falls 'about two degrees per kilometre' (1.5-2.2 K/km)", tdrate, 1.5, 2.2)
    row("W32", "s31 gap at the ground 11.9 ≈ 12 °C; closes at ≈ 8 °C/km; 12 ÷ 8 = 1.5", [gap0, abs(gam) * 1e3 - tdrate, 12 / 8], [11.88, 7.96, 1.5], 0.06)
    row("W32", "s31 the T and T_d lines meet at the LCL (|T − T_d| there)", abs(float(np.interp(zl, zz, Tz)) - float(np.interp(zl, zz, Tdz))), 0.0, 0.02)
    # Q5 real cumulus day (24 Jun 2024, northern France): ERA5 13 UTC (MODIS Aqua ~13:30 local)
    cu = xr.open_dataset(DER / "era5_cumulus_france_2024-06-24_t2m_d2m_msl.nc").sel(time="2024-06-24T13")
    cl = call(MOI + "lifting_condensation_level", "s31", fm, "real cumulus day: LCL from ERA5 t2m, d2m, msl (24 Jun 2024 13 UTC, 46-50N 1W-5E)",
              heavy_call=True, T=cu.t2m.values.astype(float), Td=cu.d2m.values.astype(float), p=cu.msl.values.astype(float))
    cz_med = float(np.nanmedian(cl[0]))
    rng("Q5", "s31 real cumulus field: median ERA5 LCL over the box 1.2-1.6 km (§E: 1.4 km)", cz_med / 1e3, 1.2, 1.6)
    files[fm] = {"q_example": {"q": 0.020, "p_hPa": 1000, "e_hPa": r6(e32 / 100, 3), "display": "≈ 32 hPa"},
                 "es_curve": {"T_C": r6(Tcur, 2), "es_hPa": r6(escur, 3), "constants": {"e0_hPa": 6.12, "T0_K": 273.0, "L": 2.44e6, "Rv": 462.0}},
                 "es_points": {"T_C": r6(Tc4), "es_hPa": r6(es4, 2), "labels": ["6.2 hPa", "12 hPa", "23 hPa", "42 hPa"]},
                 "rh": {"T_C": 25, "e_hPa": 15, "es_hPa": r6(es25, 3), "rh": r6(rh, 4), "display": "≈ 48 %"},
                 "dew_point": {"e_hPa": 15, "Td_C": r6(td - 273.15, 3)},
                 "lcl": {"T0_C": 25, "Td0_C": r6(td - 273.15, 3), "p0_hPa": 1013, "z_m": r6(zl, 1), "p_hPa": r6(pl / 100, 2), "T_C": r6(Tl - 273.15, 3),
                         "z_profile_m": r6(zz, 1), "T_profile_C": r6(Tz - 273.15, 3), "Td_profile_C": r6(np.asarray(Tdz) - 273.15, 3),
                         "gap0_C": r6(gap0, 3), "Td_rate_K_per_km": r6(tdrate, 3), "T_rate_K_per_km": r6(abs(gam) * 1e3, 3)},
                 "cumulus_day": {"date": "2024-06-24T13 UTC", "box": "46-50N 1W-5E", "lcl_median_km": r6(cz_med / 1e3, 3),
                                 "lcl_p10_p90_km": r6(np.nanpercentile(cl[0], [10, 90]) / 1e3, 3),
                                 "image": "data/derived/ch00/cumulus_france_2024-06-24_modis_aqua_250m.jpg"}}

    # ================================================================ global_20231102T12 (s01, s27, s38, s39, s41, s42, s44)
    gl = xr.open_dataset(DER / "era5_global_2023-11-02T12_sfc_0p5.nc").isel(time=0)
    glat, glon = gl.lat.values.astype(float), gl.lon.values.astype(float)
    msl, sp_, zs, t2m, d2m = (gl[v].values.astype(float) for v in ("msl", "sp", "zs", "t2m", "d2m"))
    e2m = call(MOI + "saturation_vapour_pressure", "s27", "global_20231102T12.bin", "vapour pressure = e_s(dew point) (18.28)", heavy_call=True, T=d2m)
    q2m = call(MOI + "specific_humidity", "s27", "global_20231102T12.bin", "Vallis (18.12) q ≈ ε e/p", heavy_call=True, e=e2m, p=sp_)
    trop = np.abs(glat) <= 30
    polar = np.abs(glat) >= 70
    rng("s27", "s27 tropical 2-m q, 99th percentile 17-24 g/kg ('about twenty')", np.nanpercentile(q2m[trop] * 1e3, 99), 17, 24)
    rng("s27", "s27 polar 2-m q (|lat| ≥ 70), median < 2 g/kg ('almost zero')", np.nanmedian(q2m[polar] * 1e3), 0, 2)
    tib = (glat[:, None] >= 28) & (glat[:, None] <= 38) & (glon[None, :] >= 78) & (glon[None, :] <= 100)
    tmin = float(np.nanmin(np.where(tib, sp_, np.nan))) / 100
    rng("W37", "s39 minimum surface pressure over Tibet (28-38N 78-100E) < 600 hPa", tmin, 400, 600)
    andes = (glat[:, None] >= -30) & (glat[:, None] <= -10) & (glon[None, :] >= -75) & (glon[None, :] <= -60)
    rock = (glat[:, None] >= 35) & (glat[:, None] <= 45) & (glon[None, :] >= -112) & (glon[None, :] <= -104)
    rng("W37", "s39 the Andes and the Rockies show up too (min sp < 800 hPa)", [np.nanmin(np.where(andes, sp_, np.nan)) / 100, np.nanmin(np.where(rock, sp_, np.nan)) / 100], 500, 800)
    lv = np.arange(940.0, 1061.0, 4.0)
    iso = contours(msl / 100, glat, glon, lv, periodic=True, nd=1)
    truth("W39", "s41 isobar levels are multiples of 4 hPa (and include 1012)", all(c["level"] % 4 == 0 for c in iso) and any(c["level"] == 1012 for c in iso),
          f"{len(iso)} levels, {sum(len(c['lines']) for c in iso)} lines")
    low = call("fluidpy.diag.cyclone.storm_centre", "s42", "highs_lows.json", "Ciarán: MSLP minimum (quadratic refinement)", heavy_call=True,
               msl=msl, lat=glat, lon=glon, box=(45, 60, -15, 10))
    high = call("fluidpy.diag.cyclone.storm_centre", "s42", "highs_lows.json", "Azores high: minimum of −MSLP", heavy_call=True,
                msl=-msl, lat=glat, lon=glon, box=(25, 45, -45, -10))
    lowp, highp = float(low.msl_min) / 100, -float(high.msl_min) / 100
    row("W40", "s42 Ciarán 956 hPa at 52.6N 1.6E (12 UTC 2 Nov)", [lowp, float(low.lat), float(low.lon)], [956.0, 52.58, 1.56], 0.6)
    rng("W40", "s42 Azores high 1027-1034 hPa ('about one thousand and thirty')", highp, 1027, 1034)
    rng("W40", "s42 the high is 'near the Azores islands': < 600 km from the archipelago's centre", gc_km(float(high.lat), float(high.lon), *AZORES), 0, 600)
    rng("W40", "s42 the high is 'far to the south-west' of Ciarán: bearing 200-250°", (np.degrees(np.arctan2(*enu_km(float(high.lat), float(high.lon), float(low.lat), float(low.lon)))) + 360) % 360, 200, 250)
    # s42: where exactly is the low? distance to the coastline (NE 10 m)
    coast = json.loads((DER / "ciaran_coast_10m.geojson").read_text(encoding="utf-8"))
    cpts = np.concatenate([np.asarray(f["geometry"]["coordinates"] if f["geometry"]["type"] == "LineString" else
                                      np.concatenate([np.asarray(c) for c in f["geometry"]["coordinates"]])) for f in coast["features"]])
    dcoast = float(np.min(gc_km(float(low.lat), float(low.lon), cpts[:, 1], cpts[:, 0])))
    rng("s42", "s42 the low's centre lies on the east coast of England (< 30 km from the coastline): said 'over the east coast of England, at the edge of the North Sea'", dcoast, 0, 30)
    narration_changes.append("s42 S3: 'Over the southern North Sea, just off England, is a deep low' -> 'Over the east coast of England, at the edge of the North Sea, is a deep low' (ERA5 centre 52.58N 1.56E, %.0f km from the NE 10-m coastline)" % dcoast)
    # W42: the wind circles the low (anticlockwise, NH), the high clockwise, and a southern-hemisphere low clockwise
    u10, v10 = gl.u10.values.astype(float), gl.v10.values.astype(float)
    ringL = call("fluidpy.diag.cyclone.storm_relative_wind", "s44", "highs_lows.json", "rings 200-600 km round Ciarán: v_t = k·(r̂×u) (Vallis (2.7))",
                 heavy_call=True, u=u10, v=v10, lat=glat, lon=glon, centre=(float(low.lat), float(low.lon)), radii_km=[200.0, 400.0, 600.0], n_az=36)
    ringH = call("fluidpy.diag.cyclone.storm_relative_wind", "s44", "highs_lows.json", "rings 600-1200 km round the Azores high", heavy_call=True,
                 u=u10, v=v10, lat=glat, lon=glon, centre=(float(high.lat), float(high.lon)), radii_km=[600.0, 900.0, 1200.0], n_az=36)
    shb = np.where((glat[:, None] >= -62) & (glat[:, None] <= -40), msl, np.inf)
    js_ = np.unravel_index(np.argmin(shb), msl.shape)
    shl = call("fluidpy.diag.cyclone.storm_centre", "s44", "highs_lows.json", "deepest southern-hemisphere low (40-62S), refined in a ±8° box", heavy_call=True,
               msl=msl, lat=glat, lon=glon, box=(float(glat[js_[0]]) - 8, float(glat[js_[0]]) + 8, float(glon[js_[1]]) - 8, float(glon[js_[1]]) + 8))
    ringS = call("fluidpy.diag.cyclone.storm_relative_wind", "s44", "highs_lows.json", "rings round the deepest SH low", heavy_call=True,
                 u=u10, v=v10, lat=glat, lon=glon, centre=(float(shl.lat), float(shl.lon)), radii_km=[300.0, 600.0], n_az=36)
    vtL, vrL = np.asarray(ringL.vt_mean if hasattr(ringL, "vt_mean") else ringL[7]), None
    rlf = ringL._asdict() if hasattr(ringL, "_asdict") else dict(ringL)
    rhf = ringH._asdict() if hasattr(ringH, "_asdict") else dict(ringH)
    rsf = ringS._asdict() if hasattr(ringS, "_asdict") else dict(ringS)
    key_vt = [k for k in rlf if "mean" in k and ("vt" in k or "tangential" in k)][0]
    key_vr = [k for k in rlf if "mean" in k and ("vr" in k or "radial" in k)][0]
    key_in = [k for k in rlf if "inflow" in k and "median" in k][0]
    vtL, vrL, inL = np.asarray(rlf[key_vt]), np.asarray(rlf[key_vr]), np.asarray(rlf[key_in])
    truth("W42", "s44 the wind circles Ciarán anticlockwise seen from above (ring-mean v_t > 0 at 200/400/600 km)", bool(np.all(vtL > 0)), r6(vtL, 2))
    truth("W42", "s44 crossing the isobars only slightly towards the centre (ring-mean v_r < 0, median inflow 0-45°)",
          bool(np.all(vrL < 0) and np.all((inL > 0) & (inL < 45))), r6(np.concatenate([vrL, inL]), 2))
    truth("W42", "s44 around the high it turns clockwise (ring-mean v_t < 0)", bool(np.all(np.asarray(rhf[key_vt]) < 0)), r6(rhf[key_vt], 2))
    truth("W42", "s44 southern hemisphere reversed: the deepest SH low turns clockwise (v_t < 0)", bool(np.all(np.asarray(rsf[key_vt]) < 0)),
          r6([float(shl.lat), float(shl.lon), float(shl.msl_min) / 100, *np.asarray(rsf[key_vt])], 2))
    # W41: lows cloudy, highs clear (MODIS Aqua true colour, 2 Nov 2023)
    from PIL import Image
    mj = json.loads((DER / "ciaran_modis_aqua_truecolour_2023-11-02.json").read_text(encoding="utf-8"))
    img = np.asarray(Image.open(DER / "ciaran_modis_aqua_truecolour_2023-11-02.jpg").convert("RGB")).astype(float)
    ny, nx = img.shape[:2]
    ilat = mj["lat_edges"][1] - (np.arange(ny) + 0.5) * (mj["lat_edges"][1] - mj["lat_edges"][0]) / ny
    ilon = mj["lon_edges"][0] + (np.arange(nx) + 0.5) * (mj["lon_edges"][1] - mj["lon_edges"][0]) / nx
    bright = img.mean(-1)
    cloud = (bright > 150) & ((img.max(-1) - img.min(-1)) < 45)

    def disc_frac(clat, clon, rkm=500.0):
        sub = (np.abs(ilat - clat) < rkm / 111 + 0.1)
        LA, LO = np.meshgrid(ilat[sub], ilon, indexing="ij")
        d = gc_km(clat, clon, LA, LO) <= rkm
        full_area = np.pi * rkm ** 2
        cell = (111.2 * 0.02) ** 2 * np.cos(LA * DEG)
        return float(cloud[sub][d].mean()), float(np.sum(cell[d]) / full_area)
    cfL, covL = disc_frac(float(low.lat), float(low.lon))
    cfH, covH = disc_frac(float(high.lat), float(high.lon))
    truth("W41", "s43 cloud fraction in the low's 500-km disc > the high's (MODIS Aqua, bright & grey pixels)", cfL > cfH + 0.2, r6([cfL, cfH, covL, covH], 3))
    HL = {"time_utc": "2023-11-02T12", "low": {"lat": r6(float(low.lat), 3), "lon": r6(float(low.lon), 3), "hPa": r6(lowp, 2), "label": "Ciarán 956 hPa",
                                              "coast_km": r6(dcoast, 1)},
          "high": {"lat": r6(float(high.lat), 3), "lon": r6(float(high.lon), 3), "hPa": r6(highp, 2), "label": "≈ 1030 hPa",
                   "azores_km": r6(gc_km(float(high.lat), float(high.lon), *AZORES), 0)},
          "tibet_min_sp_hPa": r6(tmin, 1),
          "rings": {"low_vt": r6(vtL, 2), "low_vr": r6(vrL, 2), "low_inflow_deg": r6(inL, 1), "high_vt": r6(rhf[key_vt], 2),
                    "sh_low": {"lat": r6(float(shl.lat), 2), "lon": r6(float(shl.lon), 2), "hPa": r6(float(shl.msl_min) / 100, 1), "vt": r6(rsf[key_vt], 2)}},
          "cloud_fraction": {"low_disc": r6(cfL, 3), "high_disc": r6(cfH, 3), "disc_km": 500, "high_disc_inside_image": r6(covH, 3),
                             "rule": "mean RGB > 150 and max−min < 45 on the MODIS Aqua true colour (bright, grey = cloud)"}}
    # s44 arrows (1.5°) and streaklines (1.5 h) on the A2 regional box at 12 UTC
    sfc_h = json.loads((DER / "ciaran_2023_sfc_1102.json").read_text(encoding="utf-8"))
    raw = (DER / sfc_h["bin"]).read_bytes()
    SF = {vv["name"]: np.frombuffer(raw, dtype="<f4", count=vv["count"], offset=vv["offset_bytes"]).astype(float).reshape(vv["shape"])
          for vv in sfc_h["variables"]}
    slat, slon = np.asarray(sfc_h["coords"]["lat"], float), np.asarray(sfc_h["coords"]["lon"], float)
    times = sfc_h["coords"]["time"]
    it12 = [k for k, t in enumerate(times) if str(t).startswith("2023-11-02T12")][0]
    if slat[0] > slat[-1]:
        slat = slat[::-1]
        SF = {k: (v[..., ::-1, :] if v.ndim >= 2 else v) for k, v in SF.items()}
    U12, V12 = SF["u10"][it12], SF["v10"][it12]
    alat = np.arange(36.0, 69.1, 1.5)
    alon = np.arange(-48.0, 9.1, 1.5)
    ALA, ALO = np.meshgrid(alat, alon, indexing="ij")
    au, av = bilin(U12, slat, slon, ALA, ALO), bilin(V12, slat, slon, ALA, ALO)
    rows_ar = [[float(a), float(b), round(float(c), 2), round(float(d), 2)] for a, b, c, d in zip(ALA.ravel(), ALO.ravel(), au.ravel(), av.ravel()) if np.isfinite(c)]
    tr = call("fluidpy.diag.trajectories.advect_on_sphere", "s44", "highs_lows.json", "streaklines: 1.5 h of the 12 UTC 10-m wind (RK4)", heavy_call=True,
              u=U12, v=V12, lat=slat, lon=slon, seeds_lat=ALA.ravel(), seeds_lon=ALO.ravel(), dt=300.0, nsteps=18)
    tr = np.asarray(tr)
    HL["arrows_10m_12utc"] = {"cols": ["lat", "lon", "u", "v"], "rows": rows_ar, "grid_deg": 1.5, "legend_ms": 20}
    HL["streaklines_10m_12utc"] = {"dt_s": 300, "nsteps": 18, "note": "1.5 h of motion; points every 15 min",
                                   "tracks": [r6(t_[::3], 2) for t_ in tr if np.isfinite(t_).all()] if tr.ndim == 3 else []}
    files["highs_lows.json"] = HL
    # global bin
    gh, gb = bin_pack("global_20231102T12", [
        ("msl", ["lat", "lon"], msl / 100, "hPa", "ERA5 mean sea-level pressure, 2023-11-02T12 UTC"),
        ("sp", ["lat", "lon"], sp_ / 100, "hPa", "ERA5 surface pressure"),
        ("t2m", ["lat", "lon"], t2m - 273.15, "degC", "ERA5 2-m temperature"),
        ("q2m", ["lat", "lon"], q2m * 1e3, "g kg-1", "2-m specific humidity from d2m and sp: q = ε e_s(T_d)/p (Vallis (18.12), (18.28))"),
        ("zs", ["lat", "lon"], zs / G0 if np.nanmax(zs) > 20000 else zs, "m", "ERA5 surface height (geopotential at the surface / g0)"),
        ("u10", ["lat", "lon"], u10, "m s-1", "ERA5 10-m eastward wind"), ("v10", ["lat", "lon"], v10, "m s-1", "ERA5 10-m northward wind")],
        {"lat": r6(glat, 2), "lon": r6(glon, 2)},
        {"grid": "0.5° regular, lat ascending −90…90, lon −180…179.5", "time": "2023-11-02T12 UTC",
         "luts": {"thermal": lut_hex("cmocean.thermal"), "haline": lut_hex("cmocean.haline"), "dense": lut_hex("cmocean.dense"),
                  "balance": lut_hex("cmocean.balance")}})
    files["global_20231102T12.json"] = gh
    bins["global_20231102T12.bin"] = gb
    files["isobars_20231102T12.json"] = {"time_utc": "2023-11-02T12", "interval_hPa": 4, "coords": "[lon, lat, lon, lat, …] per line, 0.1°",
                                         "levels": iso}

    # ================================================================ brest_climate.json (s36)
    bc = xr.open_dataset(DER / "era5_brest_t2m_daily_1991-2023.nc")
    ser = bc.t2m_mean - 273.15
    clim = call("fluidpy.diag.climatology.daily_climatology", "s36", "brest_climate.json", "pooled ±7-day window, 1991-2020, q10/q90 (Vallis (11.1) context)",
                heavy_call=True, series=ser, base=(1991, 2020), quantiles=(0.1, 0.9), smooth_days=15)
    share23 = call("fluidpy.diag.climatology.band_share", "s36", "brest_climate.json", "share of 2023 days inside the band", heavy_call=True,
                   series=ser, clim=clim, year=2023)
    share_b = float(np.mean([__import__("fluidpy.diag.climatology", fromlist=["band_share"]).band_share(ser, clim, year=y) for y in range(1991, 2021)]))
    row("W35", "s36 Brest 2023: 287/365 = 0.786 of days inside the 10-90 % band (pooled window)", share23, 287 / 365, 1e-9)
    rng("W35", "s36 'most of the time it stays inside the band' (60-90 %)", share23, 0.6, 0.9)
    rng("W35", "s36 'a band that holds eight days out of ten': base-period mean share 0.78-0.82", share_b, 0.78, 0.82)
    y23 = ser.sel(time=slice("2023-01-01", "2023-12-31"))
    files["brest_climate.json"] = {"point": "ERA5 48.5N 4.5W (Brest)", "base": [1991, 2020], "method": "pooled-window percentiles, ±7 calendar days",
                                   "doy": list(range(1, 366)), "mean_C": r6(clim["mean"].values, 2), "q10_C": r6(clim["q10"].values, 2),
                                   "q90_C": r6(clim["q90"].values, 2), "y2023_C": r6(y23.values, 2), "y2023_dates": [str(d)[:10] for d in y23.time.values],
                                   "share_2023": r6(share23, 4), "inside_2023": int(round(share23 * 365)), "share_base": r6(share_b, 4)}

    # ================================================================ igra_stations_2023.json (s37)
    st = json.loads((DER / "igra2_stations_2023.json").read_text(encoding="utf-8"))
    rng("W36", "s37 IGRA2 stations with a sounding in 2023 (count reported; not spoken)", st["count"], 500, 1500)
    truth("W36", "s37 station list consistent (count = rows)", st["count"] == len(st["stations"]), st["count"])
    files["igra_stations_2023.json"] = {"year": 2023, "count": st["count"], "latlon": [[round(s[1], 2), round(s[2], 2)] for s in st["stations"]]}

    # ================================================================ Ciarán hourly (s00, s54-s59) from A1
    a1 = open_a1()
    box = a1.sel(lat=slice(35.0, 60.0), lon=slice(-30.0, 10.0), time=slice("2023-11-01T12", "2023-11-02T12"))
    hrs = [str(t)[:13] for t in box.time.values]
    mslh = box.msl.values.astype(float)
    blat, blon = box.lat.values.astype(float), box.lon.values.astype(float)
    truth("W03", "s00/s55 A1 longitudes wrapped across Greenwich and ascending (−30 … 10)", bool(np.all(np.diff(blon) > 0) and blon[0] == -30 and blon[-1] == 10))
    # fix loop 1 (review 1, M3): the box-wide minimum is NOT Ciarán before 15 UTC 1 Nov (a deeper-looking old low near
    # 56N 25W wins the box), so the L sat on the wrong low. Ciarán is tracked by continuity instead: seeded at the deepest
    # hour of the box (03 UTC 2 Nov, unambiguously Ciarán), then storm_centre in a ±2.5° lat × ±4° lon box round the
    # previous hour's centre, backwards to 12 UTC 1 Nov and forwards to 12 UTC 2 Nov (nearest-neighbour tracking).
    sc_trk = __import__("fluidpy.diag.cyclone", fromlist=["storm_centre"]).storm_centre
    glob = sc_trk(mslh, blat, blon, box=(40, 60, -30, 10))               # the old rule, kept for the CHECK rows
    glat, glon, gmin = np.asarray(glob.lat, float), np.asarray(glob.lon, float), np.asarray(glob.msl_min, float) / 100
    kseed = int(np.argmin(gmin))
    clat, clon, cmin = np.full(len(hrs), np.nan), np.full(len(hrs), np.nan), np.full(len(hrs), np.nan)
    clat[kseed], clon[kseed], cmin[kseed] = glat[kseed], glon[kseed], gmin[kseed]
    for ks, stp in ((range(kseed - 1, -1, -1), +1), (range(kseed + 1, len(hrs)), -1)):
        for kk in ks:
            pla, plo = clat[kk + stp], clon[kk + stp]
            c_ = sc_trk(mslh[kk], blat, blon, box=(pla - 2.5, pla + 2.5, plo - 4.0, plo + 4.0))
            clat[kk], clon[kk], cmin[kk] = float(c_.lat), float(c_.lon), float(c_.msl_min) / 100
    heavy.append({"fn": "fluidpy.diag.cyclone.storm_centre", "scene": "s55-s58", "data": "data/ciaran_hourly.json",
                  "eq": "Ciarán tracked by continuity: seed = box minimum at its deepest hour, then a ±2.5° × ±4° box round the previous hour",
                  "params": {"msl": f"ERA5 A1 hourly MSLP 12 UTC 1 Nov → 12 UTC 2 Nov, {_prm(mslh)}", "seed_utc": hrs[kseed],
                             "search_box_deg": [2.5, 4.0]},
                  "output_sha256": parity_hash(np.stack([clat, clon, cmin]))})
    k3 = hrs.index("2023-11-02T03")
    steps_km = gc_km(clat[:-1], clon[:-1], clat[1:], clon[1:])
    rng("M3", "s55 tracker: Ciarán moves ≤ 150 km per hour everywhere (continuity, no jumps)", steps_km, 0, 150)
    truth("M3", "s55 tracker seed: the deepest hour of the box is 03 UTC 2 Nov", hrs[kseed] == "2023-11-02T03", hrs[kseed])
    k15 = hrs.index("2023-11-01T15")
    rng("M3", "s55 the old box-minimum rule picked another low at 12-14 UTC 1 Nov (≥ 800 km from Ciarán)",
        gc_km(glat[:k15], glon[:k15], clat[:k15], clon[:k15]), 800, 3000)
    row("M3", "s55 from 15 UTC 1 Nov the tracked centre is the box minimum (same low)", np.max(gc_km(glat[k15:], glon[k15:], clat[k15:], clon[k15:])), 0, 1)
    row("W49", "s55 Ciarán 970.7 hPa at 12 UTC 1 Nov → lowest 953.7 hPa at 03 UTC 2 Nov ('nine hundred and seventy to nine hundred and fifty-four')",
        [cmin[0], cmin.min()], [970.7, 953.7], 0.6)
    row("W49", "s55 spoken 'about nine hundred and seventy' = round(12 UTC centre, -1)", round(cmin[0], -1), 970, 0)
    truth("W49", "s55 the lowest hourly centre is at 03 UTC 2 Nov", int(np.argmin(cmin)) == k3, hrs[int(np.argmin(cmin))])
    truth("W49", "s55 'the low deepens as it comes': 12 UTC 1 Nov → 03 UTC 2 Nov falls every 3 h", bool(np.all(np.diff(cmin[:k3 + 1:3]) < 0)), r6(cmin[:k3 + 1:3], 1))
    row("W49", "s55 at 12 UTC 2 Nov: 955.9 hPa", cmin[-1], 955.9, 0.6)
    # the track crosses Brest's longitude: latitude there, and the hour
    kx = int(np.where((clon[:-1] < BREST_GP[1]) & (clon[1:] >= BREST_GP[1]))[0][0])
    fx = (BREST_GP[1] - clon[kx]) / (clon[kx + 1] - clon[kx])
    latx = clat[kx] + fx * (clat[kx + 1] - clat[kx])
    rng("W49", "s55 the centre crosses Brest's longitude 'just north of Brest' (48.5-51.5N)", latx, 48.5, 51.5)
    truth("W49", "s55 ... 'during the night' (between 18 and 06 UTC)", hrs[kx] >= "2023-11-01T18" and hrs[kx + 1] <= "2023-11-02T06", f"{hrs[kx]}–{hrs[kx + 1]}, {latx:.2f}N")
    rng("W49", "s55 ... over the English Channel (track latitude at 4.5W) in 48.6-50.3N", latx, 48.6, 50.3)
    iso_h = [{"time_utc": t, "levels": contours(mslh[k] / 100, blat, blon, np.arange(940.0, 1041.0, 4.0), nd=2)} for k, t in enumerate(hrs)]
    hh, hb = bin_pack("ciaran_hourly", [("msl", ["time", "lat", "lon"], mslh / 100, "hPa", "ERA5 MSLP hourly (A1)")],
                      {"time": hrs, "lat": r6(blat, 2), "lon": r6(blon, 2)}, {"grid": "0.25°, lat ascending 35…60, lon −30…10"})
    files["ciaran_hourly.json"] = {**hh, "track": {"time_utc": hrs, "lat": r6(clat, 3), "lon": r6(clon, 3), "hPa": r6(cmin, 2)},
                                   "crossing_brest_lon": {"lat": r6(latx, 3), "between": [hrs[kx], hrs[kx + 1]]}, "isobars": iso_h}
    bins["ciaran_hourly.bin"] = hb
    # s59: where is the low at image time (MODIS Aqua ~13:20 UTC at 2E)?
    c13 = __import__("fluidpy.diag.cyclone", fromlist=["storm_centre"]).storm_centre(a1.msl.sel(time="2023-11-02T13").values.astype(float),
                                                                                    a1.lat.values.astype(float), a1.lon.values.astype(float), box=(45, 60, -15, 10))
    d13 = float(np.min(gc_km(float(c13.lat), float(c13.lon), cpts[:, 1], cpts[:, 0])))
    east_of_coast = float(c13.lon) > 1.75
    truth("s59", "s59 'now over the North Sea' at image time: the 13 UTC centre is east of the English coast (lon > 1.75E)",
          east_of_coast, r6([float(c13.lat), float(c13.lon), d13], 2))
    files["ciaran_hourly.json"]["centre_13utc_2nov"] = {"lat": r6(float(c13.lat), 3), "lon": r6(float(c13.lon), 3), "coast_km": r6(d13, 1)}

    # ================================================================ brest_hourly.json (s00, s56-s58) W02, W50-W52
    bp = a1.sel(lat=BREST_GP[0], lon=BREST_GP[1])
    bd = xr.open_dataset(DER / "era5_brest_2023-11-01_02_t2m_d2m_msl_1h.nc")
    bt = [str(t)[:13] for t in bp.time.values]
    bu, bv = bp.u10.values.astype(float), bp.v10.values.astype(float)
    bspd = call(V + "norm", "s57,s58", "brest_hourly.json", "hourly wind speed at Brest", a=np.stack([bu, bv], -1).tolist())
    bdir = call(GA + "wind_direction_from", "s57,s58", "brest_hourly.json", "hourly wind direction (from) at Brest", u=bu.tolist(), v=bv.tolist())
    bmsl, bT = bp.msl.values / 100, bp.t2m.values - 273.15
    row("s56", "Brest A1 point equals the separate Brest product (msl, t2m)", [np.max(np.abs(bmsl - bd.msl.values / 100)), np.max(np.abs(bT - (bd.t2m.values - 273.15)))], [0, 0], 0.02)
    ix = {t: bt.index(t) for t in ["2023-11-01T12", "2023-11-01T18", "2023-11-01T20", "2023-11-02T00", "2023-11-02T01", "2023-11-02T03", "2023-11-02T06"]}
    w = ix
    row("W50", "s56 Brest msl 12 UTC 997.4, minimum 962.1 at 01 UTC, 976.2 at 06 UTC", [bmsl[w["2023-11-01T12"]], bmsl[w["2023-11-02T01"]], bmsl[w["2023-11-02T06"]]], [997.4, 962.1, 976.2], 0.06)
    truth("W50", "s56 the minimum (12 UTC 1 Nov → 12 UTC 2 Nov) is at 01 UTC 2 Nov", bt[int(np.argmin(bmsl[w['2023-11-01T12']:w['2023-11-01T12'] + 25])) + w["2023-11-01T12"]] == "2023-11-02T01")
    fall, rise = bmsl[w["2023-11-01T12"]] - bmsl[w["2023-11-02T01"]], bmsl[w["2023-11-02T06"]] - bmsl[w["2023-11-02T01"]]
    row("W50", "s56 fall 35.3 hPa in 13 h ('thirty-five'), rise 14.1 hPa in 5 h ('fourteen')", [fall, rise], [35.3, 14.1], 0.06)
    truth("W50", "s56 'faster and faster': hourly fall in the last 3 h before the minimum > in the first 3 h",
          (bmsl[w["2023-11-01T12"]] - bmsl[w["2023-11-01T12"] + 3]) < (bmsl[w["2023-11-02T01"] - 3] - bmsl[w["2023-11-02T01"]]))
    row("W02", "s00 title Part B readout 'Brest 997 → 962 hPa'", [round(bmsl[w["2023-11-01T12"]]), round(bmsl[w["2023-11-02T01"]])], [997, 962], 0)
    row("W51", "s57 18 UTC: T 12.0 °C, from 155° (SSE), 13.1 m/s", [bT[w["2023-11-01T18"]], bdir[w["2023-11-01T18"]], bspd[w["2023-11-01T18"]]], [12.0, 155, 13.1], 0.6)
    row("W51", "s57 20 UTC: T 14.4 °C, from 204° (SSW), 17.9 m/s ('about eighteen', 'fourteen and a half')", [bT[w["2023-11-01T20"]], bdir[w["2023-11-01T20"]], bspd[w["2023-11-01T20"]]], [14.4, 204, 17.9], 0.6)
    rng("W51", "s57 SSE = 146-169°, SSW = 191-214°", [bdir[w["2023-11-01T18"]] - 146 + 191, bdir[w["2023-11-01T20"]]], 191, 214)
    kt3 = bspd[w["2023-11-02T03"]] / KNOT
    row("W52", "s58 00 UTC: T 12.6 °C, from 221° (SW), 18.6 m/s", [bT[w["2023-11-02T00"]], bdir[w["2023-11-02T00"]], bspd[w["2023-11-02T00"]]], [12.6, 221, 18.6], 0.6)
    row("W52", "s58 03 UTC: T 10.5 °C, from 271° (W), 23.2 m/s = 45.1 kt", [bT[w["2023-11-02T03"]], bdir[w["2023-11-02T03"]], bspd[w["2023-11-02T03"]], kt3], [10.5, 271, 23.2, 45.1], 0.6)
    row("W52", "s58 drop 'about two degrees, to ten and a half' (12.6 → 10.5)", bT[w["2023-11-02T00"]] - bT[w["2023-11-02T03"]], 2.1, 0.15)
    row("W52", "s58 display 23.2 ÷ 0.514 ≈ 45 kt", 23.2 / 0.514, 45.1, 0.05)
    files["brest_hourly.json"] = {"point": "ERA5 48.5N 4.5W (nearest 0.25° point to Brest 48.39N 4.49W)", "time_utc": bt, "msl_hPa": r6(bmsl, 2),
                                  "t2m_C": r6(bT, 2), "d2m_C": r6(bd.d2m.values - 273.15, 2), "u10": r6(bu, 3), "v10": r6(bv, 3), "speed_ms": r6(bspd, 2),
                                  "dir_from_deg": r6(bdir, 1), "speed_kt": r6(np.asarray(bspd) / KNOT, 1),
                                  "marks": {"warm_front_utc": ["2023-11-01T18", "2023-11-01T20"], "cold_front_utc": ["2023-11-02T00", "2023-11-02T03"],
                                            "min_utc": "2023-11-02T01", "fall_hPa_13h": r6(fall, 2), "rise_hPa_5h": r6(rise, 2)}}

    # ================================================================ fronts (s45, s46, s49, s50) on ERA5 850 hPa
    f8 = xr.open_dataset(DER / "era5_ciaran_2023_850hPa_1h.nc")
    flat, flon = f8.lat.values.astype(float), f8.lon.values.astype(float)
    T18, U18, V18, Q18 = (f8[v].sel(time="2023-11-01T18").values.astype(float) for v in ("t", "u", "v", "q"))
    T21, U21, V21 = (f8[v].sel(time="2023-11-01T21").values.astype(float) for v in ("t", "u", "v"))
    c18 = __import__("fluidpy.diag.cyclone", fromlist=["storm_centre"]).storm_centre(a1.msl.sel(time="2023-11-01T18").values.astype(float), a1.lat.values.astype(float),
                                                                                    a1.lon.values.astype(float), box=(40, 60, -30, 10))
    c21 = __import__("fluidpy.diag.cyclone", fromlist=["storm_centre"]).storm_centre(a1.msl.sel(time="2023-11-01T21").values.astype(float), a1.lat.values.astype(float),
                                                                                    a1.lon.values.astype(float), box=(40, 60, -30, 10))
    L18 = call("fluidpy.diag.fronts.front_lines", "s46,s49,s50", "fronts.json", "Hewson (1998) TFP front lines, locate='centre' (steepest T change)", heavy_call=True,
               T=T18, u=U18, v=V18, lat=flat, lon=flon, locate="centre")
    L21 = call("fluidpy.diag.fronts.front_lines", "s50", "fronts.json", "same at 21 UTC (motion)", heavy_call=True, T=T21, u=U21, v=V21, lat=flat, lon=flon, locate="centre")
    FF18 = call("fluidpy.diag.fronts.front_fields", "s46,s49", "fronts.json", "smoothed τ and ∇τ (100 km)", heavy_call=True, T=T18, lat=flat, lon=flon)

    def pick(L, c):
        clat_, clon_ = float(c.lat), float(c.lon)
        warm = [f for f in L if f.kind == "warm" and f.length_km >= 500 and np.min(gc_km(clat_, clon_, f.lat, f.lon)) < 400 and np.mean(f.lon) > clon_]
        cold = [f for f in L if f.kind == "cold" and f.length_km >= 1000 and np.min(gc_km(clat_, clon_, f.lat, f.lon)) < 900 and np.mean(f.lat) < clat_]
        return (max(warm, key=lambda f: f.length_km) if warm else None), (max(cold, key=lambda f: f.length_km) if cold else None)
    wf18, cf18 = pick(L18, c18)
    wf21, cf21 = pick(L21, c21)
    truth("s49", "s49 a warm front east of the 18 UTC low and a long cold front trailing south-west are found (and at 21 UTC)",
          all(x is not None for x in (wf18, cf18, wf21, cf21)),
          r6([wf18.length_km if wf18 else 0, cf18.length_km if cf18 else 0], 0))
    gx = lambda F: bilin(F, flat, flon, *_)  # noqa: E731 (placeholder, replaced below)
    del gx
    dx18, dy18 = FF18.dtau_dx, FF18.dtau_dy

    def normal_at(la, lo):
        gxv, gyv = bilin(dx18, flat, flon, la, lo), bilin(dy18, flat, flon, la, lo)
        nrm = np.hypot(gxv, gyv)
        return gxv / nrm, gyv / nrm         # unit vector towards warmer air (east, north)

    def wind_jump(f, off_km=150.0):
        nx_, ny_ = normal_at(f.lat, f.lon)
        wl = dest(f.lat, f.lon, nx_ * off_km, ny_ * off_km)           # warm side
        cl_ = dest(f.lat, f.lon, -nx_ * off_km, -ny_ * off_km)        # cold side
        uw, vw = bilin(U18, flat, flon, *wl), bilin(V18, flat, flon, *wl)
        uc, vc = bilin(U18, flat, flon, *cl_), bilin(V18, flat, flon, *cl_)
        dw = AT.wind_direction_from(uw, vw)
        dc = AT.wind_direction_from(uc, vc)
        return np.nanmedian(circ_diff(dw, dc)), np.nanmedian(dw), np.nanmedian(dc)
    inmap = lambda f: f._replace(**{k: np.asarray(getattr(f, k))[m] for k in ("lat", "lon", "advection", "grad_mag", "tfp")
                                    for m in [(np.asarray(f.lat) >= 40) & (np.asarray(f.lat) <= 60) & (np.asarray(f.lon) >= -25) & (np.asarray(f.lon) <= 10)]})  # noqa: E731
    jw, jc = wind_jump(inmap(wf18)), wind_jump(inmap(cf18))
    rng("W45", "s49 wind direction jump across the warm front inside the s49 map (40-60N 25W-10E; median, ±150 km at 850 hPa) > 30°", jw[0], 30, 180)
    rng("W45", "s49 the wind turns across the cold front too, more gently (median jump 5-30° at 850 hPa): narration 'most sharply at the warm front'", jc[0], 5, 30)
    truth("W45", "s49 the warm-front turn is the sharper one", jw[0] > jc[0], r6([jw[0], jc[0]], 1))

    def motion(f18, f21):
        nx_, ny_ = normal_at(f18.lat, f18.lon)
        out = []
        for la, lo, a_, b_ in zip(f18.lat, f18.lon, nx_, ny_):
            e_, n_ = enu_km(f21.lat, f21.lon, la, lo)
            d = np.hypot(e_, n_)
            j = int(np.argmin(d))
            if d[j] < 400:
                out.append(e_[j] * a_ + n_[j] * b_)
        return float(np.median(out)), len(out)
    mw, mc = motion(wf18, wf21), motion(cf18, cf21)
    truth("W46", "s50 the warm front moves towards the cold air in 3 h (median normal displacement < 0): half circles on the cold side", mw[0] < 0, r6(mw, 1))
    truth("W46", "s50 the cold front moves towards the warm air in 3 h (> 0): triangles on the warm side", mc[0] > 0, r6(mc, 1))
    # W43 warm tongue: T850 south-west of Brittany vs the air west of the low
    def boxmean(F, la0, la1, lo0, lo1):
        s_ = (flat[:, None] >= la0) & (flat[:, None] <= la1) & (flon[None, :] >= lo0) & (flon[None, :] <= lo1)
        return float(np.mean(F[s_]))
    tw = boxmean(T18, 45.0, 48.0, -10.0, -5.0)
    tc = boxmean(T18, 46.0, 52.0, float(c18.lon) - 10, float(c18.lon) - 4)
    rng("W43", "s45 warm tongue: T850 south-west of Brittany (45-48N 10-5W) ≥ 5 K above the air west of the low", tw - tc, 5, 30)
    # W44 transect across the cold front (centre line) near 46N
    k0 = int(np.argmin(gc_km(46.0, -9.0, cf18.lat, cf18.lon)))
    p_la, p_lo = float(cf18.lat[k0]), float(cf18.lon[k0])
    nxx, nyy = (float(x) for x in normal_at(p_la, p_lo))
    sdist = np.arange(-400.0, 400.1, 10.0)
    tla, tlo = dest(p_la, p_lo, nxx * sdist, nyy * sdist)
    tT = bilin(T18, flat, flon, tla, tlo) - 273.15
    cold_pl, warm_pl = float(np.mean(tT[sdist <= -250])), float(np.mean(tT[sdist >= 250]))
    lo10, hi90 = cold_pl + 0.1 * (warm_pl - cold_pl), cold_pl + 0.9 * (warm_pl - cold_pl)
    a10 = float(np.interp(lo10, tT[(sdist > -250) & (sdist < 250)], sdist[(sdist > -250) & (sdist < 250)])) if np.all(np.diff(tT[(sdist > -250) & (sdist < 250)]) > 0) else np.nan
    a90 = float(np.interp(hi90, tT[(sdist > -250) & (sdist < 250)], sdist[(sdist > -250) & (sdist < 250)])) if np.isfinite(a10) else np.nan
    # 10-90 % width from the steepest part (robust to wiggles): the narrowest span holding 80 % of the step
    if not np.isfinite(a10):
        inner = (sdist > -250) & (sdist < 250)
        ss, tt = sdist[inner], tT[inner]
        best = np.inf
        for i0 in range(ss.size):
            for j0 in range(i0 + 1, ss.size):
                if tt[j0] - tt[i0] >= 0.8 * (warm_pl - cold_pl):
                    best = min(best, ss[j0] - ss[i0])
                    break
        a10, a90 = np.nan, np.nan
        width = float(best)
    else:
        width = a90 - a10
    rng("W44", "s46 cold-front transect: 10-90 % width of the T850 step (ERA5, ~30 km grid) in 50-200 km", width, 50, 200)
    rng("W44", "s46 the step is a front by the library's own definition: mean gradient over the 10-90 % span ≥ 1.5 K per 100 km (Hewson K2)",
        0.8 * (warm_pl - cold_pl) / width * 100, 1.5, 20)
    jt = (bilin(U18, flat, flon, *dest(p_la, p_lo, nxx * 150, nyy * 150)), bilin(V18, flat, flon, *dest(p_la, p_lo, nxx * 150, nyy * 150)),
          bilin(U18, flat, flon, *dest(p_la, p_lo, -nxx * 150, -nyy * 150)), bilin(V18, flat, flon, *dest(p_la, p_lo, -nxx * 150, -nyy * 150)))
    fr8 = {"time_utc": "2023-11-01T18", "level_hPa": 850, "low_18": {"lat": r6(float(c18.lat), 3), "lon": r6(float(c18.lon), 3), "hPa": r6(float(c18.msl_min) / 100, 2)},
           "low_21": {"lat": r6(float(c21.lat), 3), "lon": r6(float(c21.lon), 3)},
           "method": "fluidpy.diag.fronts.front_lines(T850, u, v, lat, lon, locate='centre') (Hewson 1998 TFP, 100-km smoothing, threshold 1.5 K/100 km); "
                     "shown: the longest warm line within 400 km of the low and east of it, and the longest cold line (≥ 1000 km) within 900 km of the low and south of it",
           "warm_front": {"lat": r6(wf18.lat, 3), "lon": r6(wf18.lon, 3), "length_km": r6(wf18.length_km, 0), "wind_from_warm_cold_side": r6(jw[1:], 0),
                          "jump_deg": r6(jw[0], 1), "motion_km_3h": r6(mw[0], 1), "symbols_side": "cold (towards −∇T)"},
           "cold_front": {"lat": r6(cf18.lat, 3), "lon": r6(cf18.lon, 3), "length_km": r6(cf18.length_km, 0), "wind_from_warm_cold_side": r6(jc[1:], 0),
                          "jump_deg": r6(jc[0], 1), "motion_km_3h": r6(mc[0], 1), "symbols_side": "warm (towards +∇T)"},
           "warm_front_21": {"lat": r6(wf21.lat, 3), "lon": r6(wf21.lon, 3)}, "cold_front_21": {"lat": r6(cf21.lat, 3), "lon": r6(cf21.lon, 3)},
           "other_lines_18": [{"kind": f.kind, "length_km": r6(f.length_km, 0), "lat": r6(f.lat, 2), "lon": r6(f.lon, 2)}
                              for f in L18 if f.length_km >= 300 and f is not wf18 and f is not cf18],
           "transect": {"centre": [r6(p_la, 3), r6(p_lo, 3)], "normal_en": [r6(nxx, 4), r6(nyy, 4)], "s_km": r6(sdist, 0), "lat": r6(tla, 3), "lon": r6(tlo, 3),
                        "T850_C": r6(tT, 2), "cold_plateau_C": r6(cold_pl, 2), "warm_plateau_C": r6(warm_pl, 2), "width_10_90_km": r6(width, 0),
                        "s10_s90_km": [r6(a10, 0), r6(a90, 0)], "wind_warm_side_uv": r6(jt[:2], 2), "wind_cold_side_uv": r6(jt[2:], 2)},
           "warm_tongue": {"box_sw_brittany_C": r6(tw - 273.15, 2), "box_west_of_low_C": r6(tc - 273.15, 2), "difference_K": r6(tw - tc, 2)}}
    # hourly front lines for the s55-s58 panel (same library lines as s49, hourly storm centre from A1)
    # fix loop 2 (review 2, N-M2). Fix 1 kept, from the second hour on, the candidate nearest to the previous hour's line;
    # after the 800-km clip that latched at 17 UTC onto a 300-450-km arc hugging the west and south side of the low (the
    # bent-back zone), so the "cold front" of s55-s58 was no longer the long trailing front of s49-s50, and from 00 UTC the
    # "warm front" was the bent-back zone north of the low. The lines are now chosen BY SHAPE:
    #   warm: kind 'warm', ≥ 300 km, comes within 350 km of the centre, its centroid lies east to south-east of the centre
    #         (bearing 45-160°), clipped to 800 km from the centre (the longest contiguous piece);
    #   cold: kind 'cold', ≥ 800 km, comes within 500 km of the centre, centroid south-west of it (bearing 180-270°), and its
    #         far end lies away to the south/west (bearing 180-280°): a front TRAILING from the low; not clipped (only the map
    #         edge cuts it), so it is the s49 line itself;
    #   continuity: from the second hour a line must be the same front as the previous hour's (mean line-to-line gap
    #         ≤ 150 km; for the straight cold front also its principal axis turned ≤ 30°: the curved, clipped warm arc's
    #         axis swings 35-40° in an hour as it wraps); among those, score = gap [km] + 10 km per degree of turn;
    #   the fronts are drawn only while BOTH exist and are attached, contiguously from 12 UTC 1 Nov (the textbook pair).
    # Result: the pair exists 12-21 UTC 1 Nov; at 22 UTC the trailing front has broken off the low (≥ 630 km away, the
    # frontal fracture of a Shapiro-Keyser storm), and the 900-km Biscay cold line that appears then is 250 km (mean) from
    # the 21 UTC front, so it is not the same line. The only ≥ 800-km south-west
    # cold line after 21 UTC (over Biscay, 22-02 UTC) lies 92-290 km SOUTH-EAST of Brest, i.e. Brest is already behind it
    # before the station's 00-03 UTC cold-front passage, so it cannot honestly be drawn as "the cold front reaching Brest".
    # So the map shows the fronts up to 21 UTC, fades them out over 21-22 UTC, and from then on only the isobars, the low
    # and its track: the Brest graph carries the cold-front story (review 2's fallback, review 1 offered the same).
    FL = __import__("fluidpy.diag.fronts", fromlist=["front_lines"]).front_lines
    ATT_W, ATT_C, CLIP_KM, MINLEN_W, MINLEN_C = 350.0, 500.0, 800.0, 300.0, 800.0
    BEAR_W, BEAR_C, BEAR_FAR = (45.0, 160.0), (180.0, 270.0), (180.0, 280.0)
    CONT_KM, CONT_DEG = 150.0, 30.0

    def clip_near(la_, lo_, la0, lo0):
        inside = gc_km(la0, lo0, la_, lo_) <= CLIP_KM
        best, cur = (0, 0), None
        for i_, v_ in enumerate(np.append(inside, False)):
            if v_ and cur is None:
                cur = i_
            if not v_ and cur is not None:
                if i_ - cur > best[1] - best[0]:
                    best = (cur, i_)
                cur = None
        return la_[best[0]:best[1]], lo_[best[0]:best[1]]

    def mean_gap_km(a_la, a_lo, b_la, b_lo):
        """mean distance from the points of line a to the nearest point of line b [km]"""
        if len(a_la) == 0 or len(b_la) == 0:
            return np.inf
        d = gc_km(np.asarray(a_la)[:, None], np.asarray(a_lo)[:, None], np.asarray(b_la)[None, :], np.asarray(b_lo)[None, :])
        return float(np.mean(d.min(axis=1)))

    def bearing(la_, lo_, la0, lo0):
        """compass bearing [deg, clockwise from north] of the mean east/north offset of points from (la0, lo0)"""
        e_, n_ = enu_km(la_, lo_, la0, lo0)
        return float(np.degrees(np.arctan2(np.mean(e_), np.mean(n_))) % 360.0)

    def axis_deg(la_, lo_):
        """orientation of the line's principal axis [deg from north, 0-180)"""
        e_, n_ = enu_km(la_, lo_, float(np.mean(la_)), float(np.mean(lo_)))
        w_, v_ = np.linalg.eigh(np.cov(np.vstack([e_, n_])))
        return float(np.degrees(np.arctan2(v_[0, 1], v_[1, 1])) % 180.0)

    def axis_diff(a_, b_):
        d_ = abs(a_ - b_) % 180.0
        return min(d_, 180.0 - d_)

    def cands_of(Lh, kind, la0, lo0):
        out = []
        for f_ in Lh:
            if f_.kind != kind:
                continue
            la_, lo_ = np.asarray(f_.lat, float), np.asarray(f_.lon, float)
            dmin = float(np.min(gc_km(la0, lo0, la_, lo_)))
            if kind == "warm":
                if f_.length_km < MINLEN_W or dmin > ATT_W:
                    continue
                la_, lo_ = clip_near(la_, lo_, la0, lo0)
                if len(la_) < 3 or not (BEAR_W[0] <= bearing(la_, lo_, la0, lo0) <= BEAR_W[1]):
                    continue
            else:
                if f_.length_km < MINLEN_C or dmin > ATT_C:
                    continue
                dd = gc_km(la0, lo0, la_, lo_)
                far = int(np.argmax(dd))
                if not (BEAR_C[0] <= bearing(la_, lo_, la0, lo0) <= BEAR_C[1]):
                    continue
                if not (BEAR_FAR[0] <= bearing(la_[far:far + 1], lo_[far:far + 1], la0, lo0) <= BEAR_FAR[1]):
                    continue
            out.append({"lat": la_, "lon": lo_, "length_km": float(f_.length_km), "dmin_km": dmin,
                        "bearing": bearing(la_, lo_, la0, lo0), "axis": axis_deg(la_, lo_)})
        return out

    hourly, prev, alive, cands_log = [], {"warm": None, "cold": None}, True, []
    T850h = {}
    for t_ in f8.time.values:
        ts = str(t_)[:13]
        kk = hrs.index(ts)
        Th, Uh, Vh = (f8[v].sel(time=t_).values.astype(float) for v in ("t", "u", "v"))
        T850h[ts] = Th
        Lh = FL(Th, Uh, Vh, flat, flon, locate="centre")
        rec = {"time_utc": ts, "low": [r6(clat[kk], 3), r6(clon[kk], 3)]}
        pick_ = {}
        for kind in ("warm", "cold"):
            cs = cands_of(Lh, kind, clat[kk], clon[kk])
            cands_log.append({"time_utc": ts, "kind": kind, "n": len(cs),
                              "candidates": [{k_: r6(c_[k_], 0) for k_ in ("length_km", "dmin_km", "bearing", "axis")} for c_ in cs]})
            if not cs:
                pick_[kind] = None
                continue
            if prev[kind] is None:
                pick_[kind] = max(cs, key=lambda c_: c_["length_km"])
            else:
                # the same front as the previous hour: mean gap ≤ 150 km and axis turn ≤ 30° (gate), best score wins
                cs = [c_ for c_ in cs if mean_gap_km(c_["lat"], c_["lon"], prev[kind]["lat"], prev[kind]["lon"]) <= CONT_KM
                      and (kind == "warm" or axis_diff(c_["axis"], prev[kind]["axis"]) <= CONT_DEG)]
                pick_[kind] = min(cs, key=lambda c_: mean_gap_km(c_["lat"], c_["lon"], prev[kind]["lat"], prev[kind]["lon"])
                                  + 10.0 * axis_diff(c_["axis"], prev[kind]["axis"])) if cs else None
        alive = alive and pick_["warm"] is not None and pick_["cold"] is not None
        for kind in ("warm", "cold"):
            c_ = pick_[kind] if alive else None
            rec[kind] = None if c_ is None else [r6(c_["lat"], 2), r6(c_["lon"], 2)]
            if c_ is not None:
                rec[kind + "_shape"] = {"length_km": r6(c_["length_km"], 0), "nearest_km": r6(c_["dmin_km"], 0),
                                        "bearing_deg": r6(c_["bearing"], 0), "axis_deg": r6(c_["axis"], 0)}
                if prev[kind] is not None:
                    rec[kind + "_shape"]["gap_prev_km"] = r6(mean_gap_km(c_["lat"], c_["lon"], prev[kind]["lat"], prev[kind]["lon"]), 0)
                    rec[kind + "_shape"]["axis_change_deg"] = r6(axis_diff(c_["axis"], prev[kind]["axis"]), 0)
            prev[kind] = c_
        rec["shown"] = alive
        hourly.append(rec)
    shown = [h for h in hourly if h["shown"]]
    last_shown = shown[-1]["time_utc"]
    heavy.append({"fn": "fluidpy.diag.fronts.front_lines", "scene": "s55-s58", "data": "data/fronts.json",
                  "eq": "hourly 12 UTC 1 Nov → 12 UTC 2 Nov, locate='centre'; chosen by shape (fix loop 2): warm E-SE of the tracked centre "
                        "(≤ 350 km, clipped to 800 km), cold ≥ 800 km trailing S-SW (≤ 500 km, not clipped), continuity = gap + orientation; "
                        "drawn while both exist from 12 UTC",
                  "params": {"T": "ERA5 850 hPa t (data/derived/ch00/era5_ciaran_2023_850hPa_1h.nc)", "locate": "centre",
                             "attach_km": [ATT_W, ATT_C], "clip_km_warm": CLIP_KM, "min_length_km": [MINLEN_W, MINLEN_C],
                             "bearing_warm": BEAR_W, "bearing_cold": BEAR_C, "bearing_cold_far_end": BEAR_FAR, "orientation_weight_km_per_deg": 10.0,
                             "continuity_gate": {"mean_gap_km": CONT_KM, "axis_turn_deg": CONT_DEG}},
                  "output_sha256": parity_hash(json.dumps(hourly, sort_keys=True))})
    hidx = {h["time_utc"]: i_ for i_, h in enumerate(hourly)}
    truth("N-M2", "s55 the warm + cold pair is drawn contiguously from 12 UTC 1 Nov up to 21 UTC 1 Nov (10 hours), none after",
          [h["time_utc"] for h in shown] == hrs[:10] and last_shown == "2023-11-01T21", [len(shown), last_shown])
    # CHECK rows for every hour shown
    for h in shown:
        ws, cs_ = h["warm_shape"], h["cold_shape"]
        tt = h["time_utc"][11:13] + " UTC"
        rng("N-M2", f"s55 {tt}: warm front centroid east to south-east of the low (bearing 45-160°)", ws["bearing_deg"], 45, 160)
        rng("N-M2", f"s55 {tt}: cold front centroid south-west of the low (bearing 180-270°)", cs_["bearing_deg"], 180, 270)
        truth("N-M2", f"s55 {tt}: the cold front lies south/west of the warm front relative to the low (bearing cold > warm)",
              cs_["bearing_deg"] > ws["bearing_deg"], [ws["bearing_deg"], cs_["bearing_deg"]])
        rng("N-M2", f"s55 {tt}: cold front length ≥ 800 km", cs_["length_km"], 800, 1e5)
    k18 = hidx["2023-11-01T18"]
    row("N-M2", "s55 18 UTC: the hourly cold front IS the s49 cold front (same line, mean point gap ≤ 1 km)",
        mean_gap_km(hourly[k18]["cold"][0], hourly[k18]["cold"][1], cf18.lat, cf18.lon), 0, 1)
    gaps = [h["cold_shape"]["gap_prev_km"] for h in shown[1:]] + [h["warm_shape"]["gap_prev_km"] for h in shown[1:]]
    rot = [h["cold_shape"]["axis_change_deg"] for h in shown[1:]]
    rng("N-M2", "s55 hour-to-hour continuity of the drawn lines: mean line-to-line gap ≤ 150 km every hour (max shown)", max(gaps), 0, CONT_KM)
    rng("N-M2", "s55 hour-to-hour continuity of the drawn cold front: axis turns ≤ 30° per hour (max shown)", max(rot), 0, CONT_DEG)

    def brest_km(h, kind):
        return np.inf if h[kind] is None else float(np.min(gc_km(BREST[0], BREST[1], np.asarray(h[kind][0]), np.asarray(h[kind][1]))))

    def warm_side(h, la_p, lo_p, off_km=150.0):
        """sign of (point − nearest point of the cold line)·(unit normal towards the warmer T850, from ±150 km samples) [+1 warm side]"""
        la_, lo_ = np.asarray(h["cold"][0]), np.asarray(h["cold"][1])
        j = int(np.argmin(gc_km(la_p, lo_p, la_, lo_)))
        j0, j1 = max(0, j - 2), min(len(la_) - 1, j + 2)
        te, tn = enu_km(la_[j1], lo_[j1], la_[j0], lo_[j0])
        nrm = np.hypot(te, tn)
        ne, nn = tn / nrm, -te / nrm                                     # a normal (right of the tangent)
        Th = T850h[h["time_utc"]]
        Ta = bilin(Th, flat, flon, *dest(la_[j], lo_[j], ne * off_km, nn * off_km))
        Tb = bilin(Th, flat, flon, *dest(la_[j], lo_[j], -ne * off_km, -nn * off_km))
        if Tb > Ta:
            ne, nn = -ne, -nn
        pe, pn = enu_km(la_p, lo_p, la_[j], lo_[j])
        return float(np.sign(pe * ne + pn * nn)), float(abs(Ta - Tb))
    dw = [brest_km(hourly[hidx[t]], "warm") for t in ("2023-11-01T18", "2023-11-01T19", "2023-11-01T20")]
    rng("N-M2", "s57 the map's warm front passes Brest (≤ 50 km) during 18-20 UTC, as the Brest graph's gold band says", min(dw), 0, 50)
    def tip(h):
        la_, lo_ = np.asarray(h["cold"][0]), np.asarray(h["cold"][1])
        j = int(np.argmin(gc_km(BREST[0], BREST[1], la_, lo_)))
        return j in (0, len(la_) - 1)
    sides = [("beyond the tip" if tip(h) else warm_side(h, BREST[0], BREST[1])[0]) for h in shown]
    truth("N-M2", "s55-s57 the drawn cold front has not passed Brest 12-21 UTC: Brest on its WARM side (T850 ±150 km), or beyond its "
                  "north-eastern tip (nearest point = end point)", all(s_ == "beyond the tip" or s_ > 0 for s_ in sides), sides)
    # the fallback's reason, measured: after 21 UTC, any shape-valid cold line passes Brest within 50 km at 00-03 UTC?
    after = []
    for t in ("2023-11-02T00", "2023-11-02T01", "2023-11-02T02", "2023-11-02T03"):
        Th, Uh, Vh = (f8[v].sel(time=t).values.astype(float) for v in ("t", "u", "v"))
        kk = hrs.index(t)
        cs = cands_of(FL(Th, Uh, Vh, flat, flon, locate="centre"), "cold", clat[kk], clon[kk])
        after.append(min([float(np.min(gc_km(BREST[0], BREST[1], c_["lat"], c_["lon"]))) for c_ in cs], default=np.inf))
    truth("N-M2", "fallback reason: no ≥ 800-km trailing (south-west) cold line comes within 50 km of Brest at 00-03 UTC 2 Nov "
                  "(nearest, km per hour; inf = none exists), so s58 draws no front and the Brest graph carries the cold front",
          all(a_ > 50 for a_ in after), [r6(a_, 0) if np.isfinite(a_) else "none" for a_ in after])
    fr8["hourly"] = hourly
    fr8["hourly_shown_until_utc"] = last_shown
    fr8["hourly_candidates"] = cands_log
    fr8["hourly_method"] = ("front_lines(T850, u, v, locate='centre') each hour, chosen by shape (fix loop 2, review 2 N-M2): warm = line E-SE of the "
                            "tracked Ciarán centre (≤ 350 km, ≥ 300 km long, clipped to 800 km); cold = ≥ 800-km line trailing S-SW (≤ 500 km, not clipped); "
                            "continuity = mean gap + 10 km/° orientation change; drawn while both exist from 12 UTC 1 Nov (to 21 UTC), then faded; "
                            "after 21 UTC the trailing front has broken off the low and the only S-SW cold line lies 92-290 km SE of Brest before "
                            "the station's 00-03 UTC cold-front passage, so the map shows no fronts after 21 UTC")
    files["fronts.json"] = fr8
    # hourly 10-m wind arrows (1.5°) on the s54-s56 panel
    wl, wo = np.arange(36.0, 60.1, 1.5), np.arange(-30.0, 10.1, 1.5)
    WA, WO = np.meshgrid(wl, wo, indexing="ij")
    bx = a1.sel(time=slice("2023-11-01T12", "2023-11-02T12"))
    files["ciaran_hourly.json"]["wind_1p5"] = {"lat": r6(wl, 1), "lon": r6(wo, 1), "time_utc": [str(t)[:13] for t in bx.time.values],
        "u": [r6(bilin(bx.u10.values[k].astype(float), a1.lat.values.astype(float), a1.lon.values.astype(float), WA, WO), 1) for k in range(bx.time.size)],
        "v": [r6(bilin(bx.v10.values[k].astype(float), a1.lat.values.astype(float), a1.lon.values.astype(float), WA, WO), 1) for k in range(bx.time.size)]}
    alat8, alon8 = np.arange(31.0, 64.1, 1.0), np.arange(-39.0, 14.1, 1.0)
    A8a, A8o = np.meshgrid(alat8, alon8, indexing="ij")
    fh, fb_ = bin_pack("ciaran_850", [
        ("t18", ["lat", "lon"], T18 - 273.15, "degC", "ERA5 850-hPa temperature 2023-11-01T18"),
        ("q18", ["lat", "lon"], Q18 * 1e3, "g kg-1", "ERA5 850-hPa specific humidity 2023-11-01T18"),
        ("t21", ["lat", "lon"], T21 - 273.15, "degC", "ERA5 850-hPa temperature 2023-11-01T21"),
        ("u18_1deg", ["lat1", "lon1"], bilin(U18, flat, flon, A8a, A8o), "m s-1", "850-hPa u at 18 UTC on a 1° grid (arrows)"),
        ("v18_1deg", ["lat1", "lon1"], bilin(V18, flat, flon, A8a, A8o), "m s-1", "850-hPa v at 18 UTC on a 1° grid (arrows)")],
        {"lat": r6(flat, 2), "lon": r6(flon, 2), "lat1": r6(alat8, 1), "lon1": r6(alon8, 1)},
        {"grid": "0.25°, lat ascending 30…65, lon −40…15", "lut_thermal": lut_hex("cmocean.thermal"), "colour_range_C": [-5, 15]})
    files["ciaran_850.json"] = fh
    bins["ciaran_850.bin"] = fb_
    narration_changes.append("s49 S1: 'at midnight at the start of the second of November' -> 'at six in the evening on the first of November' "
                             "(front_lines at 00 UTC give a hooked, occluding pattern; at 18 UTC the textbook warm and cold fronts, the same hour as the s45 map)")
    narration_changes.append("s49 S6: 'The arrows show the wind turning sharply where it crosses each front.' -> 'The arrows show the wind turning as it crosses the fronts, most sharply at the warm front.' "
                             "(850-hPa median direction change across the lines inside the map: warm %.0f°, cold %.0f°)" % (jw[0], jc[0]))
    narration_changes.append("s49 S5: 'curving away to the south' -> 'curving away to the south-west' (the 18 UTC cold front runs from 48N 6.7W to 42.5N 34.5W)")

    # ================================================================ climatology (s51-s53): NCEP R1 LTM
    nt = xr.open_dataset(DER / "ncep_r1_t2m_ltm_1991-2020.nc").sel(season="ann")
    wc = json.loads((CP_REAL / "wind_climatology.json").read_text(encoding="utf-8"))
    wraw = (CP_REAL / wc["bin"]).read_bytes()
    WC = {vv["name"]: np.frombuffer(wraw, dtype="<f4", count=vv["count"], offset=vv["offset_bytes"]).astype(float).reshape(vv["shape"])[0]
          for vv in wc["variables"]}
    wlat, wlon = np.asarray(wc["coords"]["lat"], float), np.asarray(wc["coords"]["lon"], float)
    mp = WC["mslp"] / 100
    zm = mp.mean(axis=1)
    nhmax, shmax = zm[(wlat >= 20) & (wlat <= 45)].max(), zm[(wlat <= -20) & (wlat >= -45)].max()
    latn, lats = wlat[(wlat >= 20) & (wlat <= 45)][np.argmax(zm[(wlat >= 20) & (wlat <= 45)])], wlat[(wlat <= -20) & (wlat >= -45)][np.argmax(zm[(wlat <= -20) & (wlat >= -45)])]
    eqmin = zm[np.abs(wlat) <= 15].min()
    rng("W48", "s52 zonal-mean annual MSLP maxima ('around thirty degrees north and south') at 25-40°", [latn, -lats], 25, 40)
    rng("W48", "s52 those maxima exceed 1015 hPa", [nhmax, shmax], 1015, 1030)
    rng("W48", "s52 equatorial (|lat| ≤ 15) zonal-mean minimum below 1012 hPa (the ITCZ trough)", eqmin, 990, 1012)
    lon180 = (wlon + 180.0) % 360.0 - 180.0
    o = np.argsort(lon180)
    mp180, lon180 = mp[:, o], lon180[o]
    hboxes = {"Azores": (20, 45, -60, -10), "North Pacific": (20, 50, -170, -120), "South Atlantic": (-45, -15, -40, 10),
              "South Pacific": (-45, -15, -130, -80), "Indian Ocean": (-45, -15, 50, 110)}
    highs = {}
    for nm, bx in hboxes.items():
        hc = __import__("fluidpy.diag.cyclone", fromlist=["storm_centre"]).storm_centre(-mp180 * 100, wlat, lon180, box=bx)
        highs[nm] = {"lat": r6(float(hc.lat), 2), "lon": r6(float(hc.lon), 2), "hPa": r6(-float(hc.msl_min) / 100, 1)}
    rng("W48", "s52 the five subtropical highs: centres between 20 and 40° latitude", [abs(h["lat"]) for h in highs.values()], 20, 40)
    rng("W48", "s52 the five subtropical highs: ≥ 1017 hPa", [h["hPa"] for h in highs.values()], 1017, 1035)
    hcall = call("fluidpy.diag.cyclone.storm_centre", "s52", "climatology.json", "Azores high (1991-2020 annual mean MSLP)", heavy_call=True,
                 msl=-mp180 * 100, lat=wlat, lon=lon180, box=hboxes["Azores"])
    del hcall
    u_ann, v_ann = WC["u10"][:, o], WC["v10"][:, o]
    zu = u_ann.mean(axis=1)
    tr15 = [float(np.interp(15, wlat, zu)), float(np.interp(-15, wlat, zu))]
    we45 = [float(np.interp(45, wlat, zu)), float(np.interp(-45, wlat, zu))]
    rng("s53", "s53 trades: zonal-mean u at 15N and 15S from the east (u < −2 m/s)", tr15, -10, -2)
    mid_n, mid_s = (wlat >= 35) & (wlat <= 65), (wlat <= -35) & (wlat >= -65)
    shw = [float(np.mean(u_ann[mid_n] > 0)), float(np.mean(u_ann[mid_s] > 0))]
    rng("s53", "s53 'in the middle latitudes, the winds come mostly from the west': share of 35-65° grid points with u > 0, each hemisphere", shw, 0.7, 1.0)
    rng("s53", "s53 zonal-mean u at 45N and 45S is westerly (> 0)", we45, 0, 12)
    vn = float(np.mean(v_ann[(wlat > 8) & (wlat < 22)]))
    vs = float(np.mean(v_ann[(wlat < -8) & (wlat > -22)]))
    truth("s53", "s53 north of the equator the trades come from the north-east (v < 0), south of it from the south-east (v > 0)", vn < 0 < vs, r6([vn, vs], 2))
    # fix loop 1 (review 1, S7): the ITCZ is drawn on the sphere along the annual-mean MSLP trough, not on the equator:
    # per longitude, the latitude of the minimum of the 1991-2020 mean MSLP within 10S-15N (grid latitudes), then a
    # 15° circular running mean in longitude (the trough is broad and flat; this removes grid-point jitter)
    band = (wlat >= -10) & (wlat <= 15)
    tlat_raw = wlat[band][np.argmin(mp180[band], axis=0)]
    kern = np.ones(9) / 9.0                                   # 9 × 1.875° ≈ 17° of longitude
    tlat_s = np.convolve(np.concatenate([tlat_raw[-4:], tlat_raw, tlat_raw[:4]]), kern, mode="valid")
    atl = (lon180 >= -40) & (lon180 <= 30)
    rng("S7", "s52 ITCZ trough over the Atlantic and Africa (40W-30E): mean latitude of the annual-mean MSLP minimum 3-10N", float(np.mean(tlat_s[atl])), 3, 10)
    rng("S7", "s52 ITCZ trough: every smoothed latitude within 10S-15N", tlat_s, -10, 15)
    # streaklines on the annual-mean wind (steady), 5° seeds 60S-60N
    sla, slo = np.meshgrid(np.arange(-60.0, 60.1, 5.0), np.arange(-177.5, 180.0, 5.0), indexing="ij")
    trc = call("fluidpy.diag.trajectories.advect_on_sphere", "s53", "climatology.json", "streaklines on the 1991-2020 mean 10-m wind (2 days, RK4)", heavy_call=True,
               u=u_ann, v=v_ann, lat=wlat, lon=lon180, seeds_lat=sla.ravel(), seeds_lon=slo.ravel(), dt=3600.0, nsteps=48)
    trc = np.asarray(trc)
    ch, cb = bin_pack("climatology", [
        ("mslp_ann", ["lat", "lon"], mp180, "hPa", "NCEP/NCAR R1 1991-2020 annual mean sea-level pressure"),
        ("u10_ann", ["lat", "lon"], u_ann, "m s-1", "NCEP/NCAR R1 1991-2020 annual mean 10-m u"),
        ("v10_ann", ["lat", "lon"], v_ann, "m s-1", "NCEP/NCAR R1 1991-2020 annual mean 10-m v"),
        ("t2m_ann", ["tlat", "tlon"], nt.t2m.values.astype(float) - (273.15 if float(nt.t2m.max()) > 100 else 0.0), "degC", "NCEP/NCAR R1 1991-2020 annual mean 2-m air temperature")],
        {"lat": r6(wlat, 4), "lon": r6(lon180, 4), "tlat": r6(nt.lat.values, 4), "tlon": r6(nt.lon.values, 4)},
        {"grid": "NCEP T62 Gaussian (lat ascending), lon −180…180 for the wind/MSLP, 0…358 for t2m", "lut_balance": lut_hex("cmocean.balance"),
         "lut_thermal": lut_hex("cmocean.thermal")})
    files["climatology.json"] = {**ch, "zonal_mslp_hPa": r6(zm, 2), "zonal_u_ms": r6(zu, 2), "highs": highs, "belts": {"nh_max_lat": r6(latn, 2), "sh_max_lat": r6(lats, 2),
                                 "nh_max_hPa": r6(nhmax, 2), "sh_max_hPa": r6(shmax, 2), "eq_min_hPa": r6(eqmin, 2), "eq_min_lat": r6(float(wlat[np.abs(wlat) <= 15][np.argmin(zm[np.abs(wlat) <= 15])]), 2)},
                                 "trades_u15": r6(tr15, 2), "westerlies_u45": r6(we45, 2),
                                 "itcz_trough": {"lon": r6(lon180, 3), "lat": r6(tlat_s, 2),
                                                 "method": "latitude of the min of the 1991-2020 mean MSLP within 10S-15N per longitude, 9-point (≈17°) circular running mean"},
                                 "streaklines": {"dt_s": 3600, "nsteps": 48, "note": "2 days of motion on the steady annual-mean wind, points every 4 h",
                                                 "tracks": [r6(t_[::4], 2) for t_ in trc if np.isfinite(t_).all()] if trc.ndim == 3 else []}}
    bins["climatology.bin"] = cb
    rng("W47", "s51 NCEP annual mean 2-m T: tropics (|lat| < 20) warmer than 60-90N by > 20 K",
        float(np.mean(nt.t2m.values[np.abs(nt.lat.values) < 20])) - float(np.mean(nt.t2m.values[nt.lat.values > 60])), 20, 60)

    # ================================================================ latest map (GFS, §E D11) — not used by the v1 script
    gf = xr.open_dataset(DER / "gfs_mslp_latest.nc").sel(time="2026-10-27T00")
    gm = gf.msl.values.astype(float)
    glat2, glon2 = gf.lat.values.astype(float), gf.lon.values.astype(float)
    okm = (np.abs(glat2)[:, None] <= 70) & (gf.zs.values <= 500)          # the product's own rule (fluidpy.data.gfs.extrema)
    gml, gmh = np.where(okm, gm, np.inf), np.where(okm, gm, -np.inf)
    jl, jh = np.unravel_index(np.argmin(gml), gm.shape), np.unravel_index(np.argmax(gmh), gm.shape)
    from collections import namedtuple
    _C = namedtuple("_C", "lat lon msl_min")
    gl_low = _C(glat2[jl[0]], glon2[jl[1]], gm[jl])
    gl_hi = _C(glat2[jh[0]], glon2[jh[1]], -gm[jh])
    gl_na = __import__("fluidpy.diag.cyclone", fromlist=["storm_centre"]).storm_centre(gm, glat2, glon2, box=(40, 70, -60, 0))
    row("D11", "GFS 00 UTC 27 Oct 2026: deepest low 934.9 hPa at 14.5N 162.5E ('a typhoon over the western Pacific', unnamed)",
        [round(float(gl_low.msl_min) / 100, 1), float(gl_low.lat), float(gl_low.lon)], [934.9, 14.5, 162.5], 0.3)
    row("D11", "GFS highest (|lat| ≤ 70, orography ≤ 500 m) = the Siberian high 1040.1 hPa near 56N 57E", [-float(gl_hi.msl_min) / 100, float(gl_hi.lat), float(gl_hi.lon)], [1040.1, 56.0, 57.25], 0.3)
    rng("D11", "GFS North Atlantic low about as deep as Ciarán (950-960 hPa)", float(gl_na.msl_min) / 100, 950, 960)
    row("D11", "s42 spoken 'about nine hundred and thirty-five' and 'about nine hundred and fifty-five' = the rounded GFS lows",
        [round(float(gl_low.msl_min) / 100), round(float(gl_na.msl_min) / 100)], [935, 955], 0)
    g1 = gm[::4, ::4] / 100                                     # 1° view of the 0.25° analysis (every 4th point)
    g1lat, g1lon = glat2[::4], glon2[::4]
    truth("D11", "GFS 1° display grid: lat −90…90 ascending, lon −180…179", bool(g1lat[0] == -90 and g1lat[-1] == 90 and g1lon[0] == -180), [float(g1lat[0]), float(g1lon[-1])])
    lh, lb = bin_pack("latest_gfs", [("msl", ["lat", "lon"], g1, "hPa", "GFS 0.25° analysis MSLP 2026-10-27T00 UTC, every 4th point (1°)")],
                      {"lat": r6(g1lat, 2), "lon": r6(g1lon, 2)}, {"grid": "1° (every 4th 0.25° point), lat ascending, lon −180…179"})
    bins["latest_gfs.bin"] = lb
    gfs_iso = contours(g1, g1lat, g1lon, np.arange(936.0, 1061.0, 4.0), periodic=True, nd=1)
    # ETOPO 2022 60″ Tibet subset (captests fetch via fluidpy.data.fetch): 4′ block means for the s39 relief
    et = xr.open_dataset(Path("G:/Geophysical Fluid Dynamics/aofd-data/raw/ETOPO2022-60s/etopo2022_60s_tibet_25-42N_72-105E.nc"))
    ez = et.z.values.astype(float)
    ny4, nx4 = ez.shape[0] // 4, ez.shape[1] // 4
    ez4 = ez[:ny4 * 4, :nx4 * 4].reshape(ny4, 4, nx4, 4).mean(axis=(1, 3))
    elat = et.lat.values[:ny4 * 4].reshape(ny4, 4).mean(1)
    elon = et.lon.values[:nx4 * 4].reshape(nx4, 4).mean(1)
    rng("s39", "s39 ETOPO 2022 Tibet subset: highest 1′ cell > 8000 m (Himalaya)", float(np.nanmax(ez)), 8000, 8900)
    rng("s39", "s39 ETOPO 2022: plateau median height (31-35N 80-95E) 4000-5500 m",
        float(np.nanmedian(ez[(et.lat.values[:, None] > 31) & (et.lat.values[:, None] < 35) & (et.lon.values[None, :] > 80) & (et.lon.values[None, :] < 95)])), 4000, 5500)
    th, tb = bin_pack("tibet_etopo", [("z", ["lat", "lon"], ez4, "m", "ETOPO 2022 60″ surface height, 4′ block means (Tibet 25-42N 72-105E)")],
                      {"lat": r6(elat, 4), "lon": r6(elon, 4)}, {"grid": "4′ block means, lat ascending", "source": "NOAA NCEI ETOPO 2022 (public domain)",
                                                                 "vertical_exaggeration_in_movie": 30})
    files["tibet_etopo.json"] = th
    bins["tibet_etopo.bin"] = tb
    heavy.append({"fn": "builder: 4×4 block mean of ETOPO 2022 60″ (Tibet subset)", "scene": "s39", "data": "data/tibet_etopo.bin",
                  "eq": "relief for the s39 close-up (vertical ×30, said in the narration)", "params": {"input_sha256": sha_file(Path("G:/Geophysical Fluid Dynamics/aofd-data/raw/ETOPO2022-60s/etopo2022_60s_tibet_25-42N_72-105E.nc"))},
                  "output_sha256": parity_hash(ez4)})
    files["latest_map.json"] = {**lh, "isobars": gfs_iso,"source": "NOAA NCEP GFS 0.25° analysis 2026-10-27T00 UTC ('a weather-service analysis')",
                                "deepest_low": {"lat": r6(float(gl_low.lat), 2), "lon": r6(float(gl_low.lon), 2), "hPa": r6(float(gl_low.msl_min) / 100, 1), "label": "typhoon, western Pacific (unnamed)"},
                                "siberian_high": {"lat": r6(float(gl_hi.lat), 2), "lon": r6(float(gl_hi.lon), 2), "hPa": r6(-float(gl_hi.msl_min) / 100, 1)},
                                "north_atlantic_low": {"lat": r6(float(gl_na.lat), 2), "lon": r6(float(gl_na.lon), 2), "hPa": r6(float(gl_na.msl_min) / 100, 1)},
                                "note": "s42 beat (two sentences added in stage 2): GFS analysis on the globe; bin latest_gfs.bin (1°)"}

    files["climatology.json"]["isobars"] = contours(mp180, wlat, lon180, np.arange(996.0, 1033.0, 4.0), periodic=True, nd=1)

    # ================================================================ lines.json (map and globe overlays; Natural Earth, public domain)
    def gj_lines(p: Path, nd=3, box=(34, 71, -51, 16)):
        out = []
        for feat in json.loads(p.read_text(encoding="utf-8"))["features"]:
            g = feat["geometry"]
            parts = [g["coordinates"]] if g["type"] == "LineString" else g["coordinates"] if g["type"] == "MultiLineString" else \
                [r for poly in ([g["coordinates"]] if g["type"] == "Polygon" else g["coordinates"]) for r in poly]
            for ln in parts:
                a = np.round(np.asarray(ln, float), nd)
                keep = (a[:, 1] >= box[0]) & (a[:, 1] <= box[1]) & (a[:, 0] >= box[2]) & (a[:, 0] <= box[3])
                if keep.sum() >= 2:
                    out.append(a.ravel().tolist())
        return out
    ne110 = json.loads((CP_REAL / "ne_lines_110m.json").read_text(encoding="utf-8"))
    files["lines.json"] = {"note": "Natural Earth (public domain): [lon, lat, lon, lat, …] per line",
                           "globe_coast_110m": ne110["coastline"],
                           "ciaran_coast_10m": gj_lines(DER / "ciaran_coast_10m.geojson"),
                           "ciaran_borders_10m": gj_lines(DER / "ciaran_borders_10m.geojson")}

    # ================================================================ title.json (s00)
    files["title.json"] = {"partA": {"z_km": SND["trappes"]["title_readout"]["z_km"], "T_C": SND["trappes"]["title_readout"]["T_C"],
                                     "p_hPa": SND["trappes"]["title_readout"]["p_hPa"], "source": "soundings.json -> trappes (00 UTC 1 Nov 2023)"},
                           "partB": {"hours_utc": hrs[:16], "brest_hPa": r6(bmsl[w["2023-11-01T12"]:w["2023-11-01T12"] + 16], 1),
                                     "readout": [997, 962], "source": "ciaran_hourly.json isobars (12 UTC 1 Nov → 03 UTC 2 Nov), brest_hourly.json"}}

    # ---------------------------------------------------------------------------------------------- report and write
    for r in rows:
        print(f"  {'PASS' if r['pass'] else 'FAIL'}  {r['id']:5s} {r['name']}  -> {r['value']}")
    if not all(r["pass"] for r in rows):
        print("build_ch00_weather_basics: checks FAILED — no data written")
        return 1
    data_hashes = {}
    for name, obj in files.items():
        blob = json.dumps(obj, separators=(",", ":"), ensure_ascii=False, allow_nan=False).encode("utf-8")
        (DATA / name).write_bytes(blob)
        data_hashes[name] = hashlib.sha256(blob).hexdigest()
    for name, blob in bins.items():
        (DATA / name).write_bytes(blob)
        data_hashes[name] = hashlib.sha256(blob).hexdigest()
    inputs = {str(p.relative_to(ROOT)).replace("\\", "/") if ROOT in p.parents else str(p): sha_file(p) for p in [
        DER / "igra2_trappes_singapore_2023-11-01T00.nc", DER / "era5_columns_trappes_singapore_2023-11-01.nc", DER / "era5_zonal_t_z_tropopause_2023-11.nc",
        DER / "era5_global_2023-11-02T12_sfc_0p5.nc", DER / "era5_brest_t2m_daily_1991-2023.nc", DER / "era5_brest_2023-11-01_02_t2m_d2m_msl_1h.nc",
        DER / "era5_ciaran_2023_850hPa_1h.nc", DER / "era5_cumulus_france_2024-06-24_t2m_d2m_msl.nc", DER / "ncep_r1_t2m_ltm_1991-2020.nc",
        DER / "gfs_mslp_latest.nc", DER / "igra2_stations_2023.json", DER / "ciaran_2023_sfc_1102.json", DER / "ciaran_2023_sfc_1102.bin",
        DER / "ciaran_coast_10m.geojson", DER / "ciaran_modis_aqua_truecolour_2023-11-02.jpg",
        CP_REAL / "wind_climatology.json", CP_REAL / "wind_climatology.bin", A1]}
    assets = {str(p.relative_to(ROOT)).replace("\\", "/"): sha_file(p) for p in [
        DER / "gibs_truecolour_global_2023-11-02_0p05.jpg", DER / "ciaran_truecolour_2023-11-01_aqua_terra.jpg",
        DER / "ciaran_modis_aqua_truecolour_2023-11-02.jpg", DER / "cumulus_france_2024-06-24_modis_aqua_250m.jpg",
        DER / "ciaran_coast_10m.geojson", DER / "ciaran_admin0_10m.geojson", DER / "ciaran_borders_10m.geojson", DER / "ciaran_admin1_lines_10m.geojson",
        CP_REAL / "globe_bmng_topo_bathy_200409_5400x2700.jpg", CP_REAL / "ne_lines_50m.json"] if p.exists()}
    manifest = {
        "id": "ch00_weather_basics", "storyboard": "movies/ch00/ch00_weather_basics/storyboard.yaml",
        "builder": "movies/data/build_ch00_weather_basics.py",
        "fluidpy": {"repo": "../Fluid Dynamics", **git_sha(FLUID, {
            "moist_py": "fluidpy/geo/moist.py", "atmos_py": "fluidpy/geo/atmos.py", "constants_py": "fluidpy/geo/constants.py",
            "statics_py": "fluidpy/core/statics.py", "thermo_py": "fluidpy/core/thermo.py", "stratification_py": "fluidpy/core/stratification.py",
            "vectors_py": "fluidpy/geo/vectors.py", "fronts_py": "fluidpy/diag/fronts.py", "climatology_py": "fluidpy/diag/climatology.py",
            "cyclone_py": "fluidpy/diag/cyclone.py", "trajectories_py": "fluidpy/diag/trajectories.py"})},
        "equations_note": "provenance only (QA/reviewer); the movie draws no equation labels or numbers (HOUSE_STYLE §5)",
        "equations": {"hydrostatic": "Vallis (1.51) ∂p/∂z = −ρg (s13-s16)", "gas_law": "Vallis (1.53) p = ρRT (s10-s12)",
                      "scale_height": "Vallis text after (1.186) H = RT/g; isothermal p = p0 e^{−z/H} (s17-s20)",
                      "hypsometric": "Vallis (2.166) (general form of the s40 reduction)", "dry_adiabat": "Vallis (2.246) Γd = g/cp (s26, s31)",
                      "vapour": "Vallis (18.12) e ≈ 1.61 q p (s27)", "es": "Vallis (18.28) with the Fig. 18.1 constants (s28-s31; formula not on screen, §E Q3)",
                      "rh": "Vallis §18.1.2 ℋ = e/e_s (s29)", "tropopause": "WMO (1957) lapse-rate definition (s24, s25)",
                      "fronts": "Hewson (1998) / Renard & Clarke (1965) thermal front parameter (s46, s49, s50)"},
        "parameters": {"p0_Pa": P0, "T_C": 15, "R": R_D, "g": G0, "brest_grid_point": BREST_GP,
                       "soundings": "IGRA2 Trappes FRM00007145 and Singapore SNM00048698, 00 UTC 1 Nov 2023 (no 12 UTC Trappes launch; §E)",
                       "fronts_time": "2023-11-01T18 UTC (motion 18 → 21 UTC), locate='centre'",
                       "time_compression": {"s00": "15 h of storm motion in about 5 s", "s44": "1.5 h of streaklines in about 3 s",
                                            "s53": "2 days of mean-wind streaklines", "s55": "24 h of isobars in about 20 s"},
                       "exaggerations": ["atmosphere shell drawn 50x thicker (s02 on, said)", "front side views 50x taller (s47-s48, said)",
                                         "troposphere 50x in the s25 inset", "model grid drawn every 2° (s38)"]},
        "credits": [
            "Contains modified Copernicus Climate Change Service information 2026 (ERA5: global hour, columns, 850 hPa, Brest series, Ciarán hourly).",
            "Durre, I., et al.: Integrated Global Radiosonde Archive (IGRA) v2, NOAA NCEI (Trappes, Singapore, 2023 station list).",
            "NCEP/NCAR Reanalysis 1 data provided by the NOAA PSL, Boulder, Colorado, USA (1991-2020 means).",
            "NOAA NCEP GFS 0.25° analysis (public domain), via Unidata THREDDS.",
            "Imagery from the NASA Worldview application, part of NASA ESDIS (MODIS Aqua/Terra and VIIRS Corrected Reflectance, NASA LANCE).",
            "Blue Marble: Next Generation, NASA Earth Observatory (Reto Stöckli, NASA GSFC).",
            "Made with Natural Earth (public domain).",
            "U.S. Standard Atmosphere 1976 (composition, Table 3); NOAA GML global-mean CO2 2023.",
            "ETOPO 2022 Global Relief Model, NOAA NCEI (public domain), doi:10.25921/fd45-gt74.",
            "CesiumJS (Apache-2.0), no Cesium ion data.",
            "Music and sound effects: tools/sound (procedural synthesis, our own code, CC0-1.0)."],
        "js_selftest": "none — the composition has no JS physics; every number is read from data/*.json",
        "narration_changes_from_data": narration_changes,
        "inputs_sha256": inputs, "assets": assets, "render_assets": render_assets(data_hashes),
        "data_files": data_hashes, "checks": rows, "physics": entries, "physics_heavy": heavy,
    }
    mpath = OUT / "manifest.json"
    mpath.write_text(json.dumps(manifest, indent=1, ensure_ascii=False, default=str), encoding="utf-8")
    print(f"build_ch00_weather_basics: {len(files)} json + {len(bins)} bin + manifest.json ({len(entries)} parity entries, "
          f"{len(heavy)} heavy, {len(rows)} checks, manifest {mpath.stat().st_size / 1e3:.0f} kB) -> {OUT}")
    for k, val in data_hashes.items():
        print(f"  {k}  sha256 {val[:16]}…  {(DATA / k).stat().st_size / 1e3:.1f} kB")
    return 0


def render_assets(data_hashes: dict) -> dict:
    """Stage-2 render products made outside this builder (recorded by hash; the composition reads them):
    cartostyle map layers (tools/movie_wb/make_maps.py), the CesiumJS Tibet shot (tools/movie_wb/cesium_shots.py) and the
    soundtrack (tools/movie_wb/sound_mix.py → tools/sound/mix.py)."""
    pub = Path("G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_weather_basics/v2/public")
    out = {}
    anc = DATA / "cesium_tibet_anchors.json"
    if anc.exists():
        data_hashes["cesium_tibet_anchors.json"] = sha_file(anc)
    mj = pub / "wb_maps.json"
    if mj.exists():
        m = json.loads(mj.read_text(encoding="utf-8"))
        out["maps"] = {"tool": "cartopy + MetPy + tools/maptools/cartostyle.py (movie preset), tools/movie_wb/make_maps.py",
                       "files_sha256": m.get("files"), "audit": {k: (v.get("audit") if isinstance(v, dict) else None) for k, v in m.items() if k in ("sat", "brest")},
                       "t850_layer_audits": {k: v.get("audit") for k, v in (m.get("t850", {}).get("layers") or {}).items()}}
    cr = Path("G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_weather_basics/v2/cesium/report.json")
    if cr.exists():
        out["cesium"] = {"tool": "CesiumJS (no Ion), tools/movie_wb/cesium_shots.py", "report": json.loads(cr.read_text(encoding="utf-8")),
                         "tibet": "ETOPO 2022 4′ ×30 + Blue Marble NG crop; frames public/cesium_tibet/*.jpg"}
    for d in ("sound2", "sound"):
        sj = Path(f"G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_weather_basics/v2/{d}/sound.json")
        if sj.exists():
            sd = json.loads(sj.read_text(encoding="utf-8"))
            out["sound"] = {"run": str(sj.parent), "music": sd.get("music"), "mix": sd.get("mix"), "warnings": sd.get("warnings"),
                            "effects": [{k: e.get(k) for k in ("name", "scene", "start_s", "duration_s", "final_level_lufs", "voice_margin_lu", "licence")} for e in sd.get("effects", [])]}
            break
    return out


if __name__ == "__main__":
    sys.exit(main())
