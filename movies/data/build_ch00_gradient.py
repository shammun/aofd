"""Physics and real-data products for the Chapter-0 movie #6 "The gradient" (movies/ch00/ch00_gradient/storyboard.yaml,
41 scenes incl. the build-1 s33b front stack; CHECK rows DG01-DG37 + DG15s/DG16s/DG31s/DG33b of data_needs.md §D, §G).

Run with the main venv::

    .venv/Scripts/python.exe movies/data/build_ch00_gradient.py [--public <render public dir>] [--public <second dir>]

Every number the movie shows or says is computed here by the tested functions named in the storyboard's
``physics_source`` fields:

* ``fluidpy.core.operators`` (gradient, directional_derivative), ``fluidpy.core.tensors.rotation_matrix_2d``,
  ``fluidpy.geo.calculus.total_differential``, ``fluidpy.geo.vectors`` (norm, angle_between, dot),
* ``fluidpy.geo.sphere`` (gradient, arc_lengths, great_circle_distance, initial_bearing), ``fluidpy.geo.terrain``
  (surface_normals, slope_aspect, descent_path), ``fluidpy.geo.atmos`` (pressure_gradient_force,
  pressure_gradient_force_cartesian, wind_direction_from),
* ``fluidpy.diag.cyclone.track_by_continuity``, ``fluidpy.diag.climatology.binned_mean``, ``fluidpy.diag.advection.advection``,
  ``fluidpy.diag.fronts.front_fields``, ``fluidpy.diag.sounding.layer_lapse_rate``, ``fluidpy.diag.trajectories.advect_on_sphere``,
  ``fluidpy.data.igra`` (find_sounding, fill_heights, wmo_tropopause), ``fluidpy.data.movie_gradient.front_tilt``,

on files already on disk (ERA5 Ciarán surface and 850 hPa, ERA5 Elliott 5 levels, ERA5 Normandy sea breeze, ERA5 monthly zonal
means Sep 2026, GFS analyses 27/28 Oct 2026, OISST 29 Oct 2026, IGRA2 Singapore/Trappes, ISD Brest, ETOPO 2022 15″/60″,
Sentinel-2 Mont Blanc, MODIS Aqua Normandy, Blue Marble NG, Natural Earth). The only download of build 1 (MODIS Aqua true
colour of the Normandy coast, NASA GIBS, through fluidpy.data.gibs.fetch_wms and the disk guard) was made before this run.

Writes movies/ch00/ch00_gradient/data/gr.json (numbers + small arrays the composition only indexes and interpolates),
data/img/*.png|jpg (rasters made from the data with the project colour maps) and manifest.json (function, provenance,
parameters, fluidpy git SHA, sha256 of every input and data file, parity hashes). All CHECK rows must pass before anything is
written (exit 1 otherwise). With ``--public`` it also copies every render asset (gr_*) into each given dir.
"""
from __future__ import annotations

import argparse
import base64
import hashlib
import importlib
import json
import subprocess
import sys
import zipfile
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
FLUID = ROOT.parent / "Fluid Dynamics"
OUT = ROOT / "movies" / "ch00" / "ch00_gradient"
DATA = OUT / "data"
IMG = DATA / "img"
DER = ROOT / "data" / "derived" / "ch00"
GDER = Path("G:/Geophysical Fluid Dynamics/aofd-data/derived/ch00")
RAW = Path("G:/Geophysical Fluid Dynamics/aofd-data/raw")
CP_REAL = ROOT / "movies" / "ch00" / "ch00_cross_product_why" / "data" / "real"
F_CIA = GDER / "era5_ciaran_2023_sfc.nc"
F_CIAL = GDER / "era5_ciaran_2023_sfc_1102.nc"
F_850 = DER / "era5_ciaran_2023_850hPa_1h.nc"
F_MB15 = DER / "etopo2022_15s_montblanc_45.6-46.1N_6.6-7.2E.nc"
F_ALPS = RAW / "ETOPO2022-60s" / "etopo2022_60s_alps_43-49N_4-17E.nc"
F_TIB = RAW / "ETOPO2022-60s" / "etopo2022_60s_tibet_25-42N_72-105E.nc"
F_S2 = GDER / "s2_montblanc_2023-09-26.jpg"
F_IGRA = DER / "igra2_trappes_singapore_2023-11-01T00.nc"
F_IGRA_TR = RAW / "IGRA2" / "FRM00007145-data-beg2026.txt.zip"
F_ISD = DER / "rwm_isd_brest_2023-11-01T12_2023-11-02T09.json"
F_GFS = GDER / "rwm_gfs_2026-10-27T18_chart.nc"
F_JET = DER / "gfs_jet_250-300hPa_2026-10-28T18_natl.nc"
F_ZM = DER / "era5_zonal_t_u_z_2026-09.nc"
F_SST = DER / "oisst_gulfstream_2026-10-29.nc"
F_FR = DER / "era5_front_elliott_2022-12-22T12_pl5.nc"
F_CUM = DER / "era5_cumulus_france_2024-06-24_t2m_d2m_msl.nc"
F_SB = DER / "era5_seabreeze_normandy_2024-06-24.nc"
F_MODIS = RAW / "NASA-GIBS" / "gibs_normandy_seabreeze_MODIS_Aqua_CorrectedReflectance_TrueColor_2024-06-24.jpg"
F_BMNG = RAW / "BMNG-2004" / "world.topo.bathy.200409.3x5400x2700.jpg"
F_BMNG21 = RAW / "BMNG-2004" / "world.topo.bathy.200409.3x21600x10800.jpg"
F_NE110 = CP_REAL / "ne_lines_110m.json"
F_NE50C = RAW / "NE-lines" / "ne_50m_coastline.zip"
F_NE10C = RAW / "NE-10m-admin" / "ne_10m_coastline.zip"
F_NE10B = RAW / "NE-10m-admin" / "ne_10m_admin_0_boundary_lines_land.zip"
F_NE50B = RAW / "NE-lines" / "ne_50m_admin_0_boundary_lines_land.zip"

sys.path.insert(0, str(FLUID))
import netCDF4 as nc4  # noqa: E402

D2R = np.pi / 180.0
A_E = 6.371e6
G0 = 9.81
RD = 287.05
BREST_GP = (48.5, -4.5)          # ERA5 grid point "at Brest" (850 hPa scenes)
BREST_AP = (48.45, -4.42)        # Brest-Guipavas airport (msl scenes, ISD station)
CHAMONIX = (45.923, 6.869)
SUMMIT = (45.8326, 6.8652)
COURMAYEUR = (45.792, 6.972)
EVEREST = (27.9881, 86.9250)
SVALBARD = (78.22, 15.65)
SINGAPORE = (1.3644, 103.9915)
OP, GS, GT, GA, GV, DC = ("fluidpy.core.operators.", "fluidpy.geo.sphere.", "fluidpy.geo.terrain.", "fluidpy.geo.atmos.",
                          "fluidpy.geo.vectors.", "fluidpy.diag.")


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


def hexrgb(h: str) -> np.ndarray:
    return np.array([int(h[1:3], 16), int(h[3:5], 16), int(h[5:7], 16)], float)


def lut_from_hex(hexes: list[str], n: int = 256) -> np.ndarray:
    pts = np.array([hexrgb(h) for h in hexes])
    x = np.linspace(0, 1, len(hexes))
    t = np.linspace(0, 1, n)
    return np.stack([np.interp(t, x, pts[:, c]) for c in range(3)], -1).astype(np.uint8)


# height colour map (storyboard: greys to warm, no rainbow): low valleys slate, high rock warm sand, snow-white top
HEIGHT_LUT = ["#26304a", "#3e4a63", "#5d6677", "#7f8188", "#a39684", "#c8ad86", "#e6cfa6", "#f6ecd8"]


def rgba_png(G: np.ndarray, lut: np.ndarray, lo: float, hi: float, path: Path, alpha: float = 1.0, up: int = 1) -> None:
    """Colour-map a 2-D field (row 0 = NORTH edge) to an RGBA PNG; NaN transparent."""
    from PIL import Image
    from scipy.ndimage import zoom
    G = np.asarray(G, float)
    mask = np.isfinite(G)
    if up > 1:
        Gf = np.where(mask, G, np.nanmean(G))
        G = zoom(Gf, up, order=1)
        mask = zoom(mask.astype(float), up, order=0) > 0.5
    t = np.nan_to_num(np.clip((G - lo) / (hi - lo), 0, 1), nan=0.5)
    rgb = lut[np.round(t * (len(lut) - 1)).astype(int)].astype(float)
    a = np.where(mask, int(round(alpha * 255)), 0).astype(np.uint8)[..., None]
    Image.fromarray(np.concatenate([rgb.astype(np.uint8), a], -1), "RGBA").save(path, optimize=True)


def contours(F, lat, lon, levels, nd=3, min_pts=4, step=1):
    from skimage.measure import find_contours
    out = []
    for lev in levels:
        lines = []
        for c in find_contours(np.asarray(F, float), lev):
            if len(c) < min_pts:
                continue
            c = c[::step] if step > 1 else c
            la = np.interp(c[:, 0], np.arange(lat.size), lat)
            lo = np.interp(c[:, 1], np.arange(lon.size), lon)
            lines.append(np.round(np.stack([lo, la], -1), nd).ravel().tolist())
        if lines:
            out.append({"level": float(lev), "lines": lines})
    return out


def shp_parts(zpath: Path, want=None):
    """(record, [parts as (n, 2) lon/lat arrays]) of a Natural Earth shapefile zip (pyshp)."""
    import shapefile
    with zipfile.ZipFile(zpath) as z:
        base = [n for n in z.namelist() if n.endswith(".shp")][0][:-4]
        r = shapefile.Reader(shp=z.open(base + ".shp"), shx=z.open(base + ".shx"), dbf=z.open(base + ".dbf"), encoding="utf-8")
        flds = [f[0] for f in r.fields[1:]]
        for sr in r.iterShapeRecords():
            rec = dict(zip(flds, sr.record))
            if want is not None and not want(rec):
                continue
            pts = np.asarray(sr.shape.points, float)
            idx = list(sr.shape.parts) + [len(pts)]
            yield rec, [pts[idx[i]:idx[i + 1]] for i in range(len(idx) - 1)]


def decimate(a: np.ndarray, d: float) -> np.ndarray:
    keep = [0]
    for i in range(1, len(a)):
        if np.hypot(*(a[i] - a[keep[-1]])) >= d:
            keep.append(i)
    if keep[-1] != len(a) - 1:
        keep.append(len(a) - 1)
    return a[keep]


def box_lines(zpath: Path, box, d=0.02, nd=3):
    """NE polylines inside a (lat0, lat1, lon0, lon1) box (parts split where they leave it), decimated to d degrees."""
    out = []
    for _, parts in shp_parts(zpath):
        for a in parts:
            keep = (a[:, 1] >= box[0]) & (a[:, 1] <= box[1]) & (a[:, 0] >= box[2]) & (a[:, 0] <= box[3])
            if keep.sum() < 2:
                continue
            idx = np.where(keep)[0]
            for rr in np.split(idx, np.where(np.diff(idx) > 1)[0] + 1):
                if len(rr) >= 2:
                    b = decimate(a[rr], d)
                    if len(b) >= 2:
                        out.append(np.round(b, nd).ravel().tolist())
    return out


def bilin(F, lat, lon, plat, plon):
    from scipy.interpolate import RegularGridInterpolator
    la, lo, FF = np.asarray(lat, float), np.asarray(lon, float), np.asarray(F, float)
    if la[0] > la[-1]:
        la, FF = la[::-1], FF[::-1]
    f = RegularGridInterpolator((la, lo), FF, bounds_error=False, fill_value=np.nan)
    return f(np.stack([np.ravel(plat), np.ravel(plon)], -1)).reshape(np.shape(plat))


def nc(path: Path) -> nc4.Dataset:
    d = nc4.Dataset(str(path))
    d.set_auto_mask(False)
    return d


def asc(lat, F):
    """latitude ascending (and the field's lat axis −2 flipped to match)."""
    lat = np.asarray(lat, float)
    if lat[0] > lat[-1]:
        return lat[::-1], np.asarray(F)[..., ::-1, :]
    return lat, np.asarray(F)


def sub(lat, lon, F, box):
    j = (lat >= box[0] - 1e-9) & (lat <= box[1] + 1e-9)
    i = (lon >= box[2] - 1e-9) & (lon <= box[3] + 1e-9)
    return lat[j], lon[i], np.asarray(F)[..., j, :][..., i]


def bearing_of(gx, gy) -> float:
    """compass bearing (degrees clockwise from north, seen from above) of an east/north vector"""
    return float(np.degrees(np.arctan2(gx, gy)) % 360.0)


def perp_ticks(iso, gx, gy, lat, lon, box, levels, per_line=1):
    """points on drawn contours (levels, inside box) with the local ∇F and the contour tangent (east/north, km-scaled);
    err = |∇F·t|/(|∇F||t|) — DG10: the gradient is at right angles to the drawn contour."""
    out = []
    for c in iso:
        if c["level"] not in levels:
            continue
        ln = max(c["lines"], key=len)
        pts = np.asarray(ln).reshape(-1, 2)
        inb = np.where((pts[:, 1] >= box[0]) & (pts[:, 1] <= box[1]) & (pts[:, 0] >= box[2]) & (pts[:, 0] <= box[3]))[0]
        inb = inb[(inb > 1) & (inb < len(pts) - 2)]
        cands = []
        for k in inb[len(inb) // 4: max(len(inb) // 4 + 1, 3 * len(inb) // 4)] if len(inb) else []:
            t = pts[k + 1] - pts[k - 1]
            t = np.array([t[0] * np.cos(pts[k, 1] * D2R), t[1]])
            g = np.array([float(bilin(gx, lat, lon, pts[k, 1], pts[k, 0])), float(bilin(gy, lat, lon, pts[k, 1], pts[k, 0]))])
            err = abs(g @ t) / (np.linalg.norm(g) * np.linalg.norm(t))
            cands.append([round(float(pts[k, 1]), 4), round(float(pts[k, 0]), 4), float(g[0]), float(g[1]), float(t[0]), float(t[1]), float(err)])
        if cands:   # the tick is drawn where the drawn contour is smoothest (middle half of the in-box part); its error is asserted
            out.append(min(cands, key=lambda q: q[6]))
    return out


# ---------------------------------------------------------------------------------------------------------- main
def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--public", type=Path, action="append", default=[], help="render public dir(s) for the gr_* assets")
    a = ap.parse_args()
    from PIL import Image
    Image.MAX_IMAGE_PIXELS = None
    DATA.mkdir(parents=True, exist_ok=True)
    IMG.mkdir(parents=True, exist_ok=True)
    for p in list(IMG.glob("*.png")) + list(IMG.glob("*.jpg")):
        p.unlink()
    rows: list[dict] = []
    entries: list[dict] = []
    heavy: list[dict] = []
    V: dict = {}

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
        rows.append({"id": wid, "name": name, "value": value if value is not None else bool(cond), "ref": True, "tol": 0, "pass": bool(cond)})

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
                oh = parity_hash(out)
            except Exception:
                oh = parity_hash(str(out))
            heavy.append({"fn": fn, "scene": scene, "eq": eq, "params": {k: (v if isinstance(v, (int, float, str, type(None), tuple))
                          else f"array {np.shape(v)}, sha256 {parity_hash(v) if not callable(v) else 'callable'}") for k, v in params.items()},
                          "output_sha256": oh})
            return out
        try:
            h = parity_hash(out)
        except Exception:
            h = None
        entries.append({"fn": fn, "scene": scene, "data": "data/gr.json", "eq": eq, "params": jp, "sha256": h})
        return out

    V["luts"] = {"thermal": lut_hex("cmocean.thermal"), "speed": lut_hex("cmocean.speed"), "amp": lut_hex("cmocean.amp"),
                 "height": HEIGHT_LUT, "dense": lut_hex("cmocean.dense")}
    L_TH, L_SP, L_AMP, L_H = lut_rgb("cmocean.thermal"), lut_rgb("cmocean.speed"), lut_rgb("cmocean.amp"), lut_from_hex(HEIGHT_LUT)

    # ================================================================ A. the idealised hillside (s03-s06, s10-s14, s19-s20)
    hx = np.arange(-2.0, 2.01, 0.5)                                   # km
    XX, YY = np.meshgrid(hx, hx)                                        # [y, x]
    plane = 30.0 * XX + 40.0 * YY                                       # m; h = 30 x + 40 y (m per km)
    gpl = call(OP + "gradient", "s03", "(∇h)_i = ∂h/∂x_i on h = 30x + 40y", phi=plane, h=0.5)
    g_x, g_y = float(np.asarray(gpl)[0][2, 2]), float(np.asarray(gpl)[1][2, 2])   # operators.gradient: [0] = ∂/∂x (last axis)
    row("DG04", "∂h/∂x = 30, ∂h/∂y = 40 m/km on the analytic plane", [g_x, g_y], [30.0, 40.0], 1e-12)
    tdiff = call("fluidpy.geo.calculus.total_differential", "s04", "δh = ∂h/∂x δx + ∂h/∂y δy (NE step 1 km)",
                 slopes=[30.0, 40.0], steps=[np.cos(np.pi / 4), np.sin(np.pi / 4)])
    ne = float(tdiff[1])
    row("DG05", "NE climb 30·0.7071 + 40·0.7071 = 49.497 (≈ 49.5)", ne, 49.497, 5e-4)
    row("DG05", "spoken rounded inputs: 30 × 0.71 + 40 × 0.71 = 49.7 (≈ 49.5 within rounding of 0.71)", 30 * 0.71 + 40 * 0.71, 49.7, 1e-9)
    al = np.radians(np.arange(0.0, 360.001, 0.1))
    sweep = np.asarray(call(OP + "directional_derivative", "s04", "∂h/∂s = ∇h·n̂ over 3601 directions", heavy_call=True,
                            grad_phi=np.array([30.0, 40.0])[:, None] * np.ones((2, al.size)), n=np.stack([np.cos(al), np.sin(al)])))
    k_pk = int(np.argmax(sweep))
    row("DG05", "sweep peak 50.000 at 53.13° from east", [sweep[k_pk], np.degrees(al[k_pk])], [50.0, 53.1], [1e-3, 0.051])
    nrm = float(call(GV + "norm", "s05", "|∇h| = √(30² + 40²)", a=[30.0, 40.0]))
    ang = float(call(GV + "angle_between", "s05", "angle of (30, 40) from x̂", a=[30.0, 40.0], b=[1.0, 0.0], degrees=True))
    row("DG05", "√(30² + 40²) = 50; angle from east 53.13°", [nrm, ang], [50.0, 53.130], [1e-12, 5e-4])
    sw_deg = np.arange(0, 361, 3)
    V["hill"] = {"grad": [g_x, g_y], "ne": ne, "sweep_deg": sw_deg.tolist(), "sweep": r6(30 * np.cos(np.radians(sw_deg)) + 40 * np.sin(np.radians(sw_deg)), 3),
                 "peak": [float(sweep[k_pk]), float(np.degrees(al[k_pk]))], "norm": nrm, "angle": ang}
    north = float(call(OP + "directional_derivative", "s10", "∇h·n̂ with α = 90°", grad_phi=[30.0, 40.0], n=[0.0, 1.0]))
    row("DG08", "north check 30·0 + 40·1 = 40", north, 40.0, 1e-12)
    uh = np.array([30.0, 40.0]) / 50.0
    rot = lambda v, d: np.array([v[0] * np.cos(np.radians(d)) - v[1] * np.sin(np.radians(d)), v[0] * np.sin(np.radians(d)) + v[1] * np.cos(np.radians(d))])  # noqa: E731
    walk = [float(call(OP + "directional_derivative", "s13", f"walker at {d}° to ∇h", grad_phi=[30.0, 40.0], n=rot(uh, d).tolist())) for d in (0, 60, 90, 180)]
    row("DG11", "four walkers 50 cos 0 / 60 / 90 / 180 = 50, 25, 0, −50", walk, [50.0, 25.0, 0.0, -50.0], 1e-12)
    row("DG09", "max over n̂ of ∇h·n̂ = |∇h| (θ = 0), min −50 (θ = 180°)", [sweep.max(), sweep.min()], [50.0, -50.0], 1e-3)
    fan = [float(call(OP + "directional_derivative", "s19", f"bearing {d}°", grad_phi=[30.0, 40.0], n=[np.cos(np.radians(d)), np.sin(np.radians(d))])) for d in range(0, 360, 45)]
    fan16 = 30 * np.cos(np.radians(np.arange(0, 360, 22.5))) + 40 * np.sin(np.radians(np.arange(0, 360, 22.5)))
    row("DG17", "8 fan directions = 30 cos α + 40 sin α", fan, fan16[::2], 1e-12)
    C30 = np.asarray(call("fluidpy.core.tensors.rotation_matrix_2d", "s20", "C(30°); components in turned axes x' = Cᵀ x", theta=np.radians(30.0)))
    comp = C30.T @ np.array([30.0, 40.0])
    row("DG18", "axes turned 30°: (45.98, 19.64), length 50.000", [comp[0], comp[1], np.hypot(*comp)], [45.98, 19.64, 50.0], [5e-3, 5e-3, 1e-9])
    V["hill"].update({"north": north, "walk": walk, "fan16": r6(fan16, 2), "rot30": [float(comp[0]), float(comp[1])]})

    # title hill (s00): Gaussian h = H exp(−r²/2σ²), the gold point where ∇h = (30, 40) m/km
    Ht, sg = 300.0, 2.0
    from scipy.optimize import brentq
    rr = brentq(lambda r: Ht * np.exp(-r * r / (2 * sg * sg)) * r / sg ** 2 - 50.0, 0.05, sg)
    pt = -rr * uh                                                      # the point lies downhill of the summit, opposite ∇h
    xs = np.linspace(-4, 4, 161)
    TX, TY = np.meshgrid(xs, xs)
    TH = Ht * np.exp(-(TX ** 2 + TY ** 2) / (2 * sg * sg))
    gT = np.asarray(call(OP + "gradient", "s00", "∇h on the Gaussian title hill (grid 0.05 km)", heavy_call=True, phi=TH, h=0.05))
    gpt = [float(bilin(gT[0], xs, xs, pt[1], pt[0])), float(bilin(gT[1], xs, xs, pt[1], pt[0]))]
    row("DG01", "title hill: ∇h at the gold point = (30, 40) m/km (grid gradient, 0.05 km)", gpt, [30.0, 40.0], 0.05)
    V["title"] = {"H": Ht, "sigma": sg, "pt": [float(pt[0]), float(pt[1])], "rings": [50, 100, 150, 200, 250]}

    # s12 smooth hill: elliptical Gaussian; contours every 10 m are ellipses (analytic tangents); ∇h from the grid
    He, ax_, by_ = 100.0, 2.4, 1.6
    xg = np.linspace(-5, 5, 401)
    EX, EY = np.meshgrid(xg, xg)
    EH = He * np.exp(-0.5 * (EX ** 2 / ax_ ** 2 + EY ** 2 / by_ ** 2))
    gE = np.asarray(call(OP + "gradient", "s12", "∇h on the elliptical s12 hill (grid 0.025 km)", heavy_call=True, phi=EH, h=xg[1] - xg[0]))
    worst = 0.0
    ticks = []
    for lev in (30.0, 50.0, 70.0):
        s = np.sqrt(-2 * np.log(lev / He))                             # ellipse x = a s cos t, y = b s sin t
        for t in (0.6, 2.2, 4.1):
            px, py = ax_ * s * np.cos(t), by_ * s * np.sin(t)
            tang = np.array([-ax_ * s * np.sin(t), by_ * s * np.cos(t)])
            gx_, gy_ = float(bilin(gE[0], xg, xg, py, px)), float(bilin(gE[1], xg, xg, py, px))
            dd = float(call(OP + "directional_derivative", "s12", "∇h·t along the contour", grad_phi=[gx_, gy_], n=tang.tolist()))
            worst = max(worst, abs(dd) / np.hypot(gx_, gy_))
            if lev == 50.0:
                ticks.append([round(px, 4), round(py, 4), round(gx_, 3), round(gy_, 3)])
    row("DG10", "s12 hill: |∇h·t|/|∇h| on the 30/50/70-m contours < 1e-3", worst, 0.0, 1e-3)
    V["ehill"] = {"H": He, "a": ax_, "b": by_, "levels": list(range(10, 100, 10)), "ticks": ticks}

    # s14 two ramps: contours every 100 m, 2 km and 0.5 km apart
    sp = {}
    for nm, slope in (("gentle", 50.0), ("steep", 200.0)):
        xr = np.arange(0, 4.01, 0.25)
        R = slope * xr[None, :] * np.ones((5, 1))
        gR = np.asarray(call(OP + "gradient", "s14", f"∇h on the {nm} ramp", phi=R, h=0.25))
        sp[nm] = float(gR[0][2, 8])
    row("DG12", "100 m / 2 km = 50 m/km; 100 m / 0.5 km = 200 m/km (library gradient of the ramps)", [sp["gentle"], sp["steep"], 100 / 2, 100 / 0.5],
        [50.0, 200.0, 50.0, 200.0], 1e-9)
    V["ramps"] = sp
    row("DG06", "1 hPa per 100 km = 1e-3 Pa/m; 1 K/km = 100 K per 100 km", [100.0 / 100e3, 1e-3 * 100e3], [1e-3, 100.0], 1e-15)

    # ================================================================ B. Mont Blanc (s01, s02, s15, s16)
    d15 = nc(F_MB15)
    la15, lo15 = np.asarray(d15["lat"][:], float), np.asarray(d15["lon"][:], float)
    la15, Z15 = asc(la15, d15["z"][:])
    Z15 = np.asarray(Z15, float)
    DB = (45.70, 46.02, 6.68, 7.05)                                   # the drape box
    dla, dlo, DZ = sub(la15, lo15, Z15, DB)
    dA = nc(F_ALPS)
    laA, loA = np.asarray(dA["lat"][:], float), np.asarray(dA["lon"][:], float)
    zname = [k for k in dA.variables if k not in ("lat", "lon")][0]
    laA, ZA = asc(laA, dA[zname][:])
    ZA = np.asarray(ZA, float)
    ma_la, ma_lo, MZ = sub(laA, loA, ZA, DB)
    gM = call(GS + "gradient", "s15", "(2.31) ∇h on ETOPO 60″ (Mont Blanc box)", heavy_call=True, F=MZ, lat=ma_la, lon=ma_lo)
    dist = float(call(GS + "great_circle_distance", "s15", "Chamonix → summit", lat1=CHAMONIX[0], lon1=CHAMONIX[1], lat2=SUMMIT[0], lon2=SUMMIT[1]))
    row("DG13", "great-circle Chamonix–summit 10.06 ± 0.05 km ('about ten')", dist / 1e3, 10.06, 0.05)
    avg = (4806.0 - 1035.0) / dist
    row("DG13", "(4806 − 1035)/10 056 = 0.375 ('thirty seven and a half'); (4806 − 1035)/10 = 377 m/km", [avg, (4806 - 1035) / 10.0], [0.375, 377.1], [5e-4, 0.05])
    gmag = np.asarray(gM.magnitude)
    LAm, LOm = np.meshgrid(ma_la, ma_lo, indexing="ij")
    dsum = np.asarray(call(GS + "great_circle_distance", "s15", "distance of every 60″ node from the summit", heavy_call=True,
                           lat1=LAm, lon1=LOm, lat2=SUMMIT[0], lon2=SUMMIT[1]))
    near = dsum <= 5e3
    kmax = np.unravel_index(np.nanargmax(np.where(near, gmag, -1)), gmag.shape)
    smax = float(gmag[kmax])
    row("DG13", "max |∇h| within 5 km of the summit on the 60″ map 0.60 ± 0.05 ('about sixty percent')", smax, 0.60, 0.05)
    nrmA = np.asarray(call(GT + "surface_normals", "s15", "n̂ = (−∂z/∂x, −∂z/∂y, 1)/√(1 + |∇z|²)", heavy_call=True, z=MZ, lat=ma_la, lon=ma_lo))
    slope_deg = np.asarray(call(GT + "slope_aspect", "s15", "slope = arccos n̂_up", heavy_call=True, normals=nrmA)[0])
    if np.nanmax(slope_deg) <= np.pi / 2 + 1e-9:
        slope_deg = np.degrees(slope_deg)
    row("DG13", "slope_aspect slope = arctan|∇h| (max abs diff, degrees)", np.nanmax(np.abs(slope_deg - np.degrees(np.arctan(gmag)))), 0.0, 0.5)
    h_cham = float(bilin(Z15, la15, lo15, *CHAMONIX)); h_sum15 = float(bilin(Z15, la15, lo15, *SUMMIT))
    probes = [(CHAMONIX, "Chamonix"), (SUMMIT, "Mont Blanc"), (COURMAYEUR, "Courmayeur")]
    pv = [float(bilin(Z15, la15, lo15, *p)) for p, _ in probes]
    row("DG03", "probe heights = the 15″ product (Chamonix ~1040, summit cell ~4690, Courmayeur ~1250)", [pv[0] > 900, pv[0] < 1200, pv[1] > 4500, 900 < pv[2] < 1500], [1, 1, 1, 1], 0)
    # arrows on the 60″ grid (every second node), 200-m contours of the same grid
    arr = []
    for j in range(1, len(ma_la) - 1, 2):
        for i in range(1, len(ma_lo) - 1, 2):
            arr.append([round(ma_la[j], 4), round(ma_lo[i], 4), round(float(MZ[j, i]), 1), round(float(gM.dFdx[j, i]), 4), round(float(gM.dFdy[j, i]), 4)])
    cmb = contours(MZ, ma_la, ma_lo, np.arange(1200, 4800, 400), nd=4)
    # DG10 (gridded): the arrows are at right angles to the contours of the same field, checked at the contour points
    errs = []
    for c in cmb:
        for ln in c["lines"]:
            pts = np.asarray(ln).reshape(-1, 2)
            for k in range(1, len(pts) - 1, 3):
                tng = pts[k + 1] - pts[k - 1]
                tng = np.array([tng[0] * np.cos(pts[k, 1] * D2R), tng[1]])
                gxx, gyy = float(bilin(gM.dFdx, ma_la, ma_lo, pts[k, 1], pts[k, 0])), float(bilin(gM.dFdy, ma_la, ma_lo, pts[k, 1], pts[k, 0]))
                if np.hypot(gxx, gyy) > 0.05 and np.hypot(*tng) > 0:
                    errs.append(abs(gxx * tng[0] + gyy * tng[1]) / np.hypot(gxx, gyy) / np.hypot(*tng))
    row("DG10m", "Mont Blanc 60″ (rough DEM, builder's visual criterion): median |cos| between ∇h and the drawn contour < 0.17 (arrows within 10° of square)",
        float(np.median(errs)), 0.0, 0.17)
    # 3-D drape geometry (15″) and the Sentinel-2 texture of the same box
    s2 = Image.open(F_S2).convert("RGB")
    W2, H2 = s2.size
    crop = (int(round((DB[2] - 6.6) / 0.6 * W2)), int(round((46.1 - DB[1]) / 0.5 * H2)), int(round((DB[3] - 6.6) / 0.6 * W2)), int(round((46.1 - DB[0]) / 0.5 * H2)))
    s2.crop(crop).resize((1536, int(round(1536 * (crop[3] - crop[1]) / (crop[2] - crop[0])))), Image.LANCZOS).save(IMG / "mb_s2.jpg", quality=88)
    rgba_png(DZ[::-1], L_H, 500, 4800, IMG / "mb_height.png", up=4)
    # droplets: steepest-descent paths on the 15″ grid from points on the high slopes (G3 descent_path)
    starts = [(45.845, 6.880), (45.840, 6.845), (45.858, 6.892), (45.852, 6.860), (45.830, 6.900), (45.875, 6.905), (45.866, 6.930),
              (45.880, 6.875), (45.820, 6.840), (45.870, 6.845), (45.895, 6.955), (45.905, 6.985)]
    drops = []
    for (sla, slo) in starts:
        pth = call(GT + "descent_path", "s16", "dr/ds = −∇h/|∇h| (RK2 on the sphere, 15″ ETOPO)", heavy_call=True, F=DZ, lat=dla, lon=dlo,
                   start=(sla, slo), step_m=120.0, n_max=400, return_info=True)
        pla, plo, info = pth
        hh = np.asarray(info["F"], float)
        truth("DG13d", f"descent from {sla:.3f}, {slo:.3f}: height falls monotonically ({info['reason']}, {len(pla)} pts)", bool(np.all(np.diff(hh) <= 1e-6)) and len(pla) > 5)
        drops.append([np.round(pla, 5).tolist(), np.round(plo, 5).tolist(), np.round(hh, 1).tolist()])
    V["mb"] = {"box": list(DB), "lat": r6(dla, 5), "lon": r6(dlo, 5), "h": np.round(DZ).astype(int).ravel().tolist(), "ny": int(dla.size), "nx": int(dlo.size),
               "cham": list(CHAMONIX), "summit": list(SUMMIT), "dist_km": dist / 1e3, "avg": avg, "smax": smax, "smax_at": [float(ma_la[kmax[0]]), float(ma_lo[kmax[1]])],
               "arrows": arr, "contours": cmb, "probes": [[p[0], p[1], round(v), n] for (p, n), v in zip(probes, pv)], "h_cham15": h_cham, "h_sum15": h_sum15,
               "drops": drops, "s2_box": list(DB)}
    # s16 left: the Alps 60″ slope map;  right: the Himalaya 20′ block means
    AB = (44.0, 47.6, 5.0, 12.0)
    al_la, al_lo, AZ = sub(laA, loA, ZA, AB)
    gAl = call(GS + "gradient", "s16", "(2.31) ∇h, Alps 60″", heavy_call=True, F=AZ, lat=al_la, lon=al_lo)
    rgba_png(np.asarray(gAl.magnitude)[::-1] * 100, L_AMP, 0, 60, IMG / "alps_slope.png", up=1)
    dT = nc(F_TIB)
    laT, loT = np.asarray(dT["lat"][:], float), np.asarray(dT["lon"][:], float)
    laT, ZT = asc(laT, dT[[k for k in dT.variables if k not in ("lat", "lon")][0]][:])
    ZT = np.asarray(ZT, float)
    nb = 20
    ny_, nx_ = (ZT.shape[0] // nb) * nb, (ZT.shape[1] // nb) * nb
    BZ = ZT[:ny_, :nx_].reshape(ny_ // nb, nb, nx_ // nb, nb).mean(axis=(1, 3))
    bla = laT[:ny_].reshape(-1, nb).mean(1)
    blo = loT[:nx_].reshape(-1, nb).mean(1)
    gB = call(GS + "gradient", "s16", "(2.31) ∇h on 20′ block means of ETOPO 60″ (Tibet)", heavy_call=True, F=BZ, lat=bla, lon=blo)
    je, ie = int(np.argmin(np.abs(bla - 27.5))), int(np.argmin(np.abs(blo - 86.83)))
    ev_mag = float(np.asarray(gB.magnitude)[je, ie]); ev_brg = bearing_of(np.asarray(gB.dFdx)[je, ie], np.asarray(gB.dFdy)[je, ie])
    row("DG14", "20′ block |∇h| near Everest 0.049 ± 0.005 ('about five percent')", ev_mag, 0.049, 0.005)
    row("DG14", "its bearing 345 ± 10° (towards the plateau)", ev_brg, 345.0, 10.0)
    plain = float(np.median(BZ[(bla >= 25.2) & (bla <= 26.5)][:, (blo >= 84) & (blo <= 88)]))
    plat = float(np.median(BZ[(bla >= 31) & (bla <= 34)][:, (blo >= 85) & (blo <= 95)]))
    row("DG14", "Ganges plain median ≈ 50 m ('about fifty'); plateau median ≈ 4900 m ('almost five thousand')", [plain, plat], [49.0, 4926.0], [15.0, 80.0])
    AL = call(GS + "arc_lengths", "s16", "20′ block sides at 27.5° N", lat=27.5, dlat=1 / 3, dlon=1 / 3)
    bdy, bdx = float(np.asarray(AL.dy)) / 1e3, float(np.asarray(AL.dx)) / 1e3
    row("DG14", "block 37.1 km N–S × 32.9 km E–W ('about thirty five kilometres across')", [bdy, bdx], [37.1, 32.9], 0.15)
    rgba_png(BZ[::-1], L_H, 0, 6500, IMG / "him_blocks.png", up=1)
    _hb = Image.open(IMG / "him_blocks.png")
    _hb.resize((_hb.width * 8, _hb.height * 8), Image.NEAREST).save(IMG / "him_blocks.png", optimize=True)   # blocks stay blocks (no smoothing)
    prof_j = (bla >= 25.0) & (bla <= 33.0)
    V["scale"] = {"alps_box": list(AB), "alps_max": float(np.nanmax(gAl.magnitude)), "him_box": [float(laT[0]), float(laT[ny_ - 1]), float(loT[0]), float(loT[nx_ - 1])],
                  "everest_block": [float(bla[je]), float(blo[ie])], "ev_mag": ev_mag, "ev_brg": ev_brg, "plain": plain, "plateau": plat,
                  "block_km": [bdy, bdx], "prof_lat": r6(bla[prof_j], 3), "prof_h": r6(BZ[prof_j, ie], 0), "prof_lon": float(blo[ie]), "everest": list(EVEREST)}

    # ================================================================ C. ERA5 850 hPa, 18 UTC 1 Nov 2023 (s02, s09, s12, s23, s33, s34)
    d8 = nc(F_850)
    t8 = np.asarray(d8["time"][:], float)
    k18 = int(np.argmin(np.abs(t8 - 1698861600)))                     # 2023-11-01T18 UTC
    row("DG07", "850 hPa record at 2023-11-01T18 UTC", t8[k18], 1698861600.0, 0.5)
    la8, T8 = asc(d8["lat"][:], d8["t"][k18])
    lo8 = np.asarray(d8["lon"][:], float)
    la8b, U8 = asc(d8["lat"][:], d8["u"][k18]); _, V8 = asc(d8["lat"][:], d8["v"][k18])
    T8, U8, V8 = (np.asarray(x, float) for x in (T8, U8, V8))
    g8 = call(GS + "gradient", "s09", "(2.31) ∇T at 850 hPa", heavy_call=True, F=T8, lat=la8, lon=lo8)
    jb, ib = int(np.argmin(np.abs(la8 - BREST_GP[0]))), int(np.argmin(np.abs(lo8 - BREST_GP[1])))
    gx8, gy8 = float(np.asarray(g8.dFdx)[jb, ib]) * 1e5, float(np.asarray(g8.dFdy)[jb, ib]) * 1e5
    mag8, brg8 = float(np.hypot(gx8, gy8)), bearing_of(gx8, gy8)
    row("DG07", "Brest 850 hPa ∂T/∂x −3.20, ∂T/∂y −2.49 K/100 km", [gx8, gy8], [-3.20, -2.49], 0.01)
    row("DG07", "|∇T| 4.06 ('about four point one'); bearing 232 ± 2° ('about two hundred and thirty')", [mag8, brg8], [4.06, 232.0], [0.01, 2.0])
    TE, TW = float(T8[jb, ib + 1]) - 273.15, float(T8[jb, ib - 1]) - 273.15
    ALb = call(GS + "arc_lengths", "s23", "δx = a cos φ δλ, δy = a δφ at 48.5° N, 0.25°", lat=BREST_GP[0], dlat=0.25, dlon=0.25)
    dx_km, dy_km = float(np.asarray(ALb.dx)) / 1e3, float(np.asarray(ALb.dy)) / 1e3
    hand = (TE - TW) / (2 * dx_km) * 100
    nocos = (TE - TW) / (2 * dy_km) * 100
    row("DG20", "T(E) 4.511, T(W) 5.691 °C; δx 18.42 km; δy 27.80 km", [TE, TW, dx_km, dy_km], [4.511, 5.691, 18.42, 27.80], [0.001, 0.001, 0.01, 0.01])
    row("DG20", "hand centred difference = sphere.gradient at the grid point (K/100 km)", hand, gx8, 1e-9)
    row("DG20", "no-cosine −2.122; ratio 0.663 ('a third too small')", [nocos, nocos / hand], [-2.122, 0.663], [0.001, 0.001])
    ALs = call(GS + "arc_lengths", "s23", "δx at 78.22° N (Svalbard)", lat=SVALBARD[0], dlat=0.25, dlon=0.25)
    cos78 = float(np.cos(np.radians(SVALBARD[0])))
    row("DG19", "cos 78.22° = 0.204 ('five times'); δx 5.68 km per 0.25° at 78.22° N", [cos78, float(np.asarray(ALs.dx)) / 1e3], [0.204, 5.68], [0.001, 0.01])
    row("DG20", "spoken rounding: −1.18 / 36.8 km × 100 = −3.21 ≈ −3.2; −1.18/55.6 × 100 = −2.12 ≈ −2.1", [-1.18 / 36.8 * 100, -1.18 / 55.6 * 100], [-3.2, -2.1], 0.025)
    # wind at Brest and advection (s34)
    ub, vb = float(U8[jb, ib]), float(V8[jb, ib])
    spd = float(np.hypot(ub, vb))
    frm = float(call(GA + "wind_direction_from", "s34", "dir = atan2(−u, −v) mod 360", u=ub, v=vb))
    ang_wT = float(call(GV + "angle_between", "s34", "angle between ∇T and the wind", a=[gx8, gy8], b=[ub, vb], degrees=True))
    dTds = float(call(OP + "directional_derivative", "s34", "∂T/∂s = ∇T·v̂", grad_phi=[gx8, gy8], n=[ub, vb]))
    advf = call(DC + "advection.advection", "s34", "v·∇T (2.27)", heavy_call=True, F=T8, u=U8, v=V8, lat=la8, lon=lo8)
    adv_h = float(np.asarray(advf)[jb, ib]) * 3600
    row("DG33", "Brest 850 hPa wind 34.00 m/s, from 190 ± 3° ('just west of south')", [spd, frm], [34.0, 190.0], [0.01, 3.0])
    row("DG33", "angle ∇T–wind 137.8 ± 1°; 4.06 cos 137.8° = −3.01 ('about minus three')", [ang_wT, dTds], [137.8, -3.01], [1.0, 0.01])
    row("DG33", "−3.01e-5 × 34.0 × 3600 = −3.68 K/h = diag.advection at the grid point", [dTds * 1e-5 * spd * 3600, adv_h], [-3.68, dTds * 1e-5 * spd * 3600], [0.01, 1e-6])
    row("DG33", "spoken rounded: 4.1 × cos 138° = −3.05 ≈ −3.0; −3.0e-5 × 34 × 3600 = −3.67 ≈ −3.7", [4.1 * np.cos(np.radians(138)), -3.0e-5 * 34 * 3600], [-3.0, -3.7], 0.06)
    # map products (box 38-58 N, 22 W - 8 E)
    MB8 = (38.0, 58.0, -22.0, 8.0)
    m_la, m_lo, mT = sub(la8, lo8, T8, MB8)
    _, _, mG = sub(la8, lo8, np.asarray(g8.magnitude) * 1e5, MB8)
    rgba_png(mT[::-1] - 273.15, L_TH, -14, 14, IMG / "t850.png", up=3)
    rgba_png(mG[::-1], L_AMP, 0, 12, IMG / "gradt850.png", up=3)
    iso8 = contours(mT - 273.15, m_la, m_lo, np.arange(-12, 14, 2), nd=3)
    arrT = []
    for la_ in np.arange(43.5, 54.0, 1.0):
        for lo_ in np.arange(-15.5, 2.0, 1.0):
            j_, i_ = int(np.argmin(np.abs(la8 - la_))), int(np.argmin(np.abs(lo8 - lo_)))
            arrT.append([float(la8[j_]), float(lo8[i_]), round(float(np.asarray(g8.dFdx)[j_, i_]) * 1e5, 3), round(float(np.asarray(g8.dFdy)[j_, i_]) * 1e5, 3)])
    tick8 = perp_ticks(iso8, np.asarray(g8.dFdx) * 1e5, np.asarray(g8.dFdy) * 1e5, la8, lo8, (46.0, 51.0, -9.0, -1.0), [4.0, 6.0, 8.0])
    row("DG10", "ERA5 850 hPa: the s12 right-angle ticks on the drawn isotherms, |∇T·t|/|∇T||t| < 0.05", [t_[6] for t_ in tick8] or [9.0], 0.0, 0.05)
    truth("DG07", "the s09 arrow grid contains the Brest grid point", any(abs(r_[0] - BREST_GP[0]) < 1e-9 and abs(r_[1] - BREST_GP[1]) < 1e-9 for r_ in arrT))
    # s33 statistics in 40-56 N, 20 W - 2 E
    SB = (40.0, 56.0, -20.0, 2.0)
    s_la, s_lo, sG = sub(la8, lo8, np.asarray(g8.magnitude) * 1e5, SB)
    med, p90, gmax = float(np.nanmedian(sG)), float(np.nanpercentile(sG, 90)), float(np.nanmax(sG))
    km = np.unravel_index(np.nanargmax(sG), sG.shape)
    row("DG32", "850 hPa |∇T| box median 0.96 ('about one'); max 11.37 ('about eleven') at 49.0 N 12.5 W", [med, gmax, s_la[km[0]], s_lo[km[1]]],
        [0.96, 11.37, 49.0, -12.5], [0.02, 0.05, 1e-6, 1e-6])
    row("DG32", "max/median > 10 ('more than ten times')", gmax / med > 10, 1, 0)
    SLA, SLO = np.meshgrid(s_la, s_lo, indexing="ij")
    far = np.asarray(call(GS + "great_circle_distance", "s33", "distance from the |∇T| maximum", heavy_call=True, lat1=SLA, lon1=SLO,
                          lat2=s_la[km[0]], lon2=s_lo[km[1]])) / 1e3
    cand = np.where((np.abs(sG - med) < 0.1) & (far > 800) & (SLO < -8) & (SLA > 42) & (SLA < 54), far, np.inf)
    kq = np.unravel_index(np.argmin(cand), cand.shape)
    quiet = [float(s_la[kq[0]]), float(s_lo[kq[1]]), float(sG[kq])]
    row("DG32", "the s33 quiet point shows ≈ 1 K/100 km (box median ± 0.1), ≥ 800 km from the band", [quiet[2], far[kq] > 800], [med, 1], [0.1, 0])
    # the band: |∇T| ≥ 6 K/100 km contour that contains the maximum
    band = contours(mG, m_la, m_lo, [6.0], nd=3)
    best = None
    for ln in band[0]["lines"] if band else []:
        pts = np.asarray(ln).reshape(-1, 2)
        dd = np.min(np.hypot(pts[:, 0] - s_lo[km[1]], pts[:, 1] - s_la[km[0]]))
        if best is None or dd < best[0]:
            best = (dd, ln)
    truth("DG32", "the ≥ 6 K/100 km band outline passes within 1° of the maximum", best is not None and best[0] < 1.0, value=None if best is None else round(best[0], 3))
    # front arrows: ∇T at points across the band
    farr = []
    for la_ in np.arange(46.0, 52.01, 0.75):
        for lo_ in np.arange(-16.0, -8.0, 0.75):
            j_, i_ = int(np.argmin(np.abs(la8 - la_))), int(np.argmin(np.abs(lo8 - lo_)))
            mg = float(np.asarray(g8.magnitude)[j_, i_]) * 1e5
            if mg > 3.0:
                farr.append([float(la8[j_]), float(lo8[i_]), round(float(np.asarray(g8.dFdx)[j_, i_]) * 1e5, 3), round(float(np.asarray(g8.dFdy)[j_, i_]) * 1e5, 3)])
    V["t850"] = {"box": list(MB8), "img_box": [float(m_la[0]), float(m_la[-1]), float(m_lo[0]), float(m_lo[-1])], "iso": iso8, "arrows": arrT,
                 "brest": {"gp": list(BREST_GP), "T": float(T8[jb, ib]) - 273.15, "gx": gx8, "gy": gy8, "mag": mag8, "brg": brg8},
                 "hand": {"TE": TE, "TW": TW, "dx": dx_km, "dy": dy_km, "slope": hand, "nocos": nocos, "east": [float(la8[jb]), float(lo8[ib + 1])], "west": [float(la8[jb]), float(lo8[ib - 1])],
                          "cos78": cos78, "dx78": float(np.asarray(ALs.dx)) / 1e3},
                 "wind": {"u": ub, "v": vb, "spd": spd, "from": frm, "ang": ang_wT, "dTds": dTds, "adv": adv_h},
                 "stats": {"median": med, "p90": p90, "max": gmax, "max_at": [float(s_la[km[0]]), float(s_lo[km[1]])], "box": list(SB)},
                 "band": best[1] if best else [], "farrows": farr, "ticks": tick8, "quiet": quiet}

    # ================================================================ D. Ciarán msl, 03 UTC 2 Nov 2023 (s00, s01, s02, s12, s24, s28-s30)
    dc = nc(F_CIA)
    tc = np.asarray(dc["time"][:], float)                              # hours since 2023-11-01
    lac, MSL = asc(dc["lat"][:], dc["msl"][:])
    loc_ = np.asarray(dc["lon"][:], float)
    _, U10 = asc(dc["lat"][:], dc["u10"][:]); _, V10 = asc(dc["lat"][:], dc["v10"][:])
    MSL, U10, V10 = (np.asarray(x, float) for x in (MSL, U10, V10))
    k03 = int(np.argmin(np.abs(tc - 27)))
    row("DG25", "msl record at 2023-11-02T03 (hours since 1 Nov 00 UTC = 27)", tc[k03], 27.0, 1e-9)
    times = np.array([np.datetime64("2023-11-01T00") + np.timedelta64(int(h), "h") for h in tc])
    trk = call(DC + "cyclone.track_by_continuity", "s28", "storm-tracker rule (HOUSE_STYLE §7)", heavy_call=True, msl=MSL, lat=lac, lon=loc_, times=times,
               seed=(52.5, 1.75), seed_time=np.datetime64("2023-11-02T12"), box_deg=(1.2, 2.0), max_step_km=120.0)
    c_la, c_lo, c_p = float(np.asarray(trk.lat)[k03]), float(np.asarray(trk.lon)[k03]), float(np.asarray(trk.msl_min)[k03]) / 100
    row("DG25", "Ciarán centre 03 UTC: 953.6 ± 0.3 hPa at 50.12 N 3.73 W ('about nine hundred and fifty four')", [c_p, c_la, c_lo], [953.6, 50.12, -3.73], [0.3, 0.05, 0.05])
    truth("DG25", "track steps unflagged round 03 UTC", not bool(np.any(np.asarray(trk.step_flag)[k03 - 3:k03 + 4])))
    dcb = float(call(GS + "great_circle_distance", "s28", "centre ↔ Brest", lat1=BREST_GP[0], lon1=BREST_GP[1], lat2=c_la, lon2=c_lo)) / 1e3
    bcb = float(call(GS + "initial_bearing", "s28", "bearing Brest → centre", lat1=BREST_GP[0], lon1=BREST_GP[1], lat2=c_la, lon2=c_lo))
    row("DG25", "centre about 200 km north of Brest (192 ± 15 km, bearing 15 ± 10°)", [dcb, bcb], [192.0, 15.0], [15.0, 10.0])
    P3 = MSL[k03]
    gp = call(GS + "gradient", "s28", "(2.31) ∇p, msl 03 UTC", heavy_call=True, F=P3, lat=lac, lon=loc_)
    gpx = float(bilin(gp.dFdx, lac, loc_, *BREST_GP)); gpy = float(bilin(gp.dFdy, lac, loc_, *BREST_GP))
    gmag_b = np.hypot(gpx, gpy) * 1e5 / 100                            # hPa per 100 km
    brg_p = bearing_of(gpx, gpy)
    p_b = float(bilin(P3, lac, loc_, *BREST_GP)) / 100
    row("DG25", "Brest |∇p| 12.87 ± 0.05 hPa/100 km; ∇p towards 197 ± 5° ('south-south-west')", [gmag_b, brg_p], [12.87, 197.0], [0.05, 5.0])
    spacing = 400.0 / gmag_b
    row("DG25", "isobar spacing 400/12.87 = 31.1 km ('thirty one'); 4/31 × 100 = 12.9 ('about thirteen')", [spacing, 4 / 31 * 100], [31.1, 12.9], [0.1, 0.05])
    pgf = call(GA + "pressure_gradient_force", "s28", "F = −(1/ρ)∇p (1.47), ρ = 1.25", heavy_call=True, p=P3, lat=lac, lon=loc_, rho=1.25)
    fx, fy = float(bilin(pgf[0], lac, loc_, *BREST_GP)), float(bilin(pgf[1], lac, loc_, *BREST_GP))
    fmag, fbrg = float(np.hypot(fx, fy)), bearing_of(fx, fy)
    row("DG23", "G1 equals −(1/ρ)∇p from sphere.gradient at Brest", [fx, fy], [-gpx / 1.25, -gpy / 1.25], 1e-12)
    row("DG25", "PGF 0.01287/1.25 = 0.0103 ('about one hundredth'); towards 17° ('north-north-east'); × 3600 = 37.1 m/s", [fmag, fbrg, fmag * 3600],
        [0.0103, 17.0, 37.1], [0.0001, 5.0, 0.4])
    row("DG25", "spoken rounded: 0.0129/1.25 = 0.0103 ≈ 0.01; 0.0103 × 3600 = 37.1 ≈ 37", [0.0129 / 1.25, 0.0103 * 3600], [0.0103, 37.08], [5e-5, 0.01])
    # bins of the 10-m wind by |∇p| over the sea (s29)
    dl = nc(F_CIAL)
    laL, LAND = asc(dl["lat"][:], dl["land"][:])
    loL = np.asarray(dl["lon"][:], float)
    iL = np.array([int(np.argmin(np.abs(loL - x))) for x in loc_])
    row("DG26", "land-mask grid covers the msl grid (same lats; every msl lon found)", [laL.size, laL[0], np.max(np.abs(loL[iL] - loc_))], [lac.size, lac[0], 0.0], 1e-9)
    LAND = np.asarray(LAND)[:, iL]
    WS = np.hypot(U10[k03], V10[k03])
    LA2, LO2 = np.meshgrid(lac, loc_, indexing="ij")
    sea = (np.asarray(LAND) < 0.5) & (LA2 >= 40) & (LA2 <= 60) & (LO2 >= -30) & (LO2 <= 5)
    gph = np.asarray(gp.magnitude) * 1e5 / 100
    bm = call(DC + "climatology.binned_mean", "s29", "mean 10-m wind per |∇p| bin over the sea", heavy_call=True, x=gph, y=WS,
              edges=[0, 2, 4, 6, 8, 10, np.inf], mask=sea)
    bcent, bmean, bcnt = (np.asarray(x) for x in bm)
    row("DG26", "sea points 9290; bin < 2 → 10.0 ± 0.2 ('ten'); > 10 → 25.6 ± 0.5 ('about twenty six')", [int(sea.sum()), bmean[0], bmean[-1]], [9290, 10.0, 25.6], [0, 0.2, 0.5])
    truth("DG26", "the six bin means rise monotonically", bool(np.all(np.diff(bmean) > 0)), value=r6(bmean, 2))
    corr = float(np.corrcoef(gph[sea], WS[sea])[0, 1])
    isd = json.loads(F_ISD.read_text(encoding="utf-8"))
    gust = None
    for ob in isd["reports"]:
        if ob["time"].startswith("2023-11-02T03:00") and ob["report_type"] == "FM-12" and " 333 " in ob["synop"]:
            for tk in ob["synop"].split(" 333 ")[1].split():
                if tk.startswith("911"):
                    gust = float(int(tk[3:5]))
    row("DG26", "ISD Brest 03 UTC 911 group 84 kt = 155.6 km/h ('about a hundred and fifty six')", [gust if gust is not None else -1, (gust or 0) * 1.852], [84.0, 155.6], [0.0, 0.1])
    # DG29: cross-isobar angle of the 10-m wind over the sea within 600 km of the centre (towards low pressure)
    dcen = np.asarray(call(GS + "great_circle_distance", "s30", "distance from the centre", heavy_call=True, lat1=LA2, lon1=LO2, lat2=c_la, lon2=c_lo)) / 1e3
    ring = sea & (dcen <= 600) & (dcen >= 150) & (WS > 5)
    gxx, gyy = np.asarray(gp.dFdx)[ring], np.asarray(gp.dFdy)[ring]
    uu, vv = U10[k03][ring], V10[k03][ring]
    cross = np.degrees(np.arcsin(np.clip(-(uu * gxx + vv * gyy) / (np.hypot(uu, vv) * np.hypot(gxx, gyy)), -1, 1)))
    xang = float(np.median(cross))
    rng("DG29", "median cross-isobar angle of the 10-m wind over the sea (150-600 km), towards low pressure, 5-45°", xang, 5.0, 45.0)
    # products: isobars, wind-speed raster, streaklines (frozen 03 UTC field), thinned wind arrows and ∇p arrows
    CB = (40.0, 60.0, -30.0, 10.0)
    c_la2, c_lo2, cP = sub(lac, loc_, P3 / 100, CB)
    _, _, cW = sub(lac, loc_, WS, CB)
    rgba_png(cW[::-1], L_SP, 0, 30, IMG / "cia_speed.png", up=3)
    isob = contours(cP, c_la2, c_lo2, np.arange(954, 1036, 4), nd=3)      # every 4 hPa, 954 + 4k (Brest, 968 hPa, sits midway between 966 and 970)
    for ib_ in isob:
        best_pt = None
        for ln in ib_["lines"]:
            pts = np.asarray(ln).reshape(-1, 2)
            if len(pts) > 30:
                q = pts[len(pts) // 2]
                best_pt = [round(float(q[1]), 3), round(float(q[0]), 3)]
                break
        ib_["label_at"] = best_pt
    tickp = perp_ticks(isob, np.asarray(gp.dFdx) * 1e3, np.asarray(gp.dFdy) * 1e3, lac, loc_, (45.0, 49.5, -10.0, -1.0), [970.0, 978.0, 986.0])
    row("DG10", "ERA5 msl: the s12 right-angle ticks on the drawn isobars, |∇p·t|/|∇p||t| < 0.05", [t_[6] for t_ in tickp] or [9.0], 0.0, 0.05)
    rs = np.random.default_rng(31)
    seeds_la = rs.uniform(42.0, 58.0, 520); seeds_lo = rs.uniform(-28.0, 6.0, 520)
    tr = call(DC + "trajectories.advect_on_sphere", "s29", "dλ/dt = u/(a cos φ), dφ/dt = v/a (RK4), frozen 03 UTC 10-m wind", heavy_call=True,
              u=U10[k03], v=V10[k03], lat=lac, lon=loc_, seeds_lat=seeds_la, seeds_lon=seeds_lo, dt=600.0, nsteps=45)
    tracks = [np.round(t, 2).tolist() for t in np.asarray(tr)]
    warr = []
    for la_ in np.arange(42.0, 58.1, 1.5):
        for lo_ in np.arange(-26.0, 8.1, 2.0):
            j_, i_ = int(np.argmin(np.abs(lac - la_))), int(np.argmin(np.abs(loc_ - lo_)))
            warr.append([float(lac[j_]), float(loc_[i_]), round(float(U10[k03][j_, i_]), 2), round(float(V10[k03][j_, i_]), 2)])
    parr = []
    for la_, lo_ in ((48.5, -4.5), (47.0, -6.0), (46.0, -2.0), (52.0, -8.0), (49.5, -10.0), (51.0, 2.0)):
        j_, i_ = int(np.argmin(np.abs(lac - la_))), int(np.argmin(np.abs(loc_ - lo_)))
        parr.append([float(lac[j_]), float(loc_[i_]), round(float(np.asarray(gp.dFdx)[j_, i_]) * 1e5 / 100, 3), round(float(np.asarray(gp.dFdy)[j_, i_]) * 1e5 / 100, 3)])
    # isobar crossings either side of Brest along ∇p (the 31-km bracket): the two neighbouring 4-hPa isobars
    ub_ = np.array([gpx, gpy]) / np.hypot(gpx, gpy)
    lv_lo, lv_hi = np.floor((p_b - 2) / 4) * 4 + 2, np.floor((p_b - 2) / 4) * 4 + 6   # the drawn isobars either side of Brest
    def along(dkm):
        return BREST_GP[0] + ub_[1] * dkm / 111.19, BREST_GP[1] + ub_[0] * dkm / (111.19 * np.cos(BREST_GP[0] * D2R))
    ss = np.linspace(-60, 60, 2401)
    pp_ = np.array([float(bilin(P3, lac, loc_, *along(s_))) / 100 for s_ in ss])
    s_lo_ = float(np.interp(lv_lo, pp_, ss)); s_hi_ = float(np.interp(lv_hi, pp_, ss))
    row("DG25", "the two isobars either side of Brest along ∇p are 31 ± 1.5 km apart (bracket)", s_hi_ - s_lo_, spacing, 1.5)
    V["msl"] = {"box": list(CB), "img_box": [float(c_la2[0]), float(c_la2[-1]), float(c_lo2[0]), float(c_lo2[-1])], "isobars": isob,
                "centre": [c_la, c_lo, c_p], "airport": list(BREST_AP), "brest": {"at": list(BREST_GP), "p": p_b, "gx": gpx * 1e3, "gy": gpy * 1e3, "mag": gmag_b, "brg": brg_p,
                "spacing": spacing, "fx": fx, "fy": fy, "fmag": fmag, "fbrg": fbrg, "gain": fmag * 3600, "dist_c": dcb, "brg_c": bcb,
                "bracket": [list(along(s_lo_)), list(along(s_hi_))], "levels": [lv_lo, lv_hi]},
                "bins": {"edges": [0, 2, 4, 6, 8, 10], "mean": r6(bmean, 2), "count": [int(c) for c in bcnt]}, "corr": corr, "gust_kt": gust,
                "xangle": xang, "ticks": tickp, "tracks": tracks, "track_dt_s": 600.0, "warrows": warr, "parrows": parr}

    # ================================================================ E. the Singapore sounding (s17, s18, s32)
    di = nc(F_IGRA)
    stn = [s for s in di["station"][:]]
    ks = [i for i, s in enumerate(stn) if str(s).startswith("SNM")][0]
    kt = [i for i, s in enumerate(stn) if str(s).startswith("FRM")][0]
    n_ = int(di["n_levels"][ks])
    zS, TS, pS = (np.asarray(di[v][ks, :n_], float) for v in ("z_hyps", "T", "p"))
    ok = np.isfinite(zS) & np.isfinite(TS) & (zS > -100)
    zS, TS, pS = zS[ok], TS[ok], pS[ok]
    o = np.argsort(zS); zS, TS, pS = zS[o], TS[o], pS[o]
    z0, T0, p0 = float(zS[0]), float(TS[0]), float(pS[0])
    ztr, Ttr = float(di["wmo_trop_z"][ks]), float(di["wmo_trop_T"][ks])
    import fluidpy.data.igra as igra
    zchk = float(igra.wmo_tropopause(TS, zS, p=pS)[0])
    row("DG15s", "Singapore surface 33 m, 27.7 °C, 1008.5 hPa", [z0, T0 - 273.15, p0 / 100], [33.0, 27.7, 1008.5], [1.0, 0.05, 0.05])
    row("DG15s", "WMO tropopause 16 163 m, −81.3 °C (product = wmo_tropopause re-run)", [ztr, Ttr - 273.15, zchk], [16163.0, -81.3, ztr], [1.0, 0.05, 1.0])
    lap = float(call(DC + "sounding.layer_lapse_rate", "s17", "∂T/∂z averaged surface → tropopause (Kundu sign)", heavy_call=True, z=zS, T=TS, z1=z0, z2=ztr, convention="kundu"))
    lapm = float(call(DC + "sounding.layer_lapse_rate", "s17", "Γ = −∂T/∂z (met sign)", heavy_call=True, z=zS, T=TS, z1=z0, z2=ztr, convention="met"))
    row("DG15s", "layer −109.0 °C over 16.13 km = −6.76 K/km; Γ = +6.76", [(Ttr - T0), (ztr - z0) / 1e3, lap * 1e3, lapm * 1e3], [-109.0, 16.13, -6.76, 6.76], [0.05, 0.005, 0.01, 0.01])
    abv = [float(np.interp(z_, zS, TS)) - 273.15 for z_ in (16900.0, 18000.0, 19900.0)]
    row("DG15s", "above the tropopause it warms: 16.9 km −78.5, 18.0 km −75.0, 19.9 km −72.6 °C", abv, [-78.5, -75.0, -72.6], 0.3)
    ztT = float(di["wmo_trop_z"][kt])
    hdr, df = igra.find_sounding(F_IGRA_TR, "2026-09-30T12", max_hours=1.0)
    zf26, _ = igra.fill_heights(df)
    tz26 = float(igra.wmo_tropopause(np.asarray(df["T"], float), np.asarray(zf26, float), p=np.asarray(df["p"], float))[0])
    row("DG15s", "Europe: Trappes WMO tropopauses 10.88 km (1 Nov 2023) and 13.07 km (30 Sep 2026) ('between about ten and thirteen')", [ztT / 1e3, tz26 / 1e3], [10.88, 13.07], 0.01)
    k925 = int(np.argmin(np.abs(pS - 92500.0)))
    dpdz = (pS[k925] - p0) / (zS[k925] - z0)
    rho = p0 / (RD * T0)
    row("DG31s", "surface → 925 hPa: −10.92 Pa/m = 0.109 hPa/m ('zero point one one'), 9.16 m per hPa ('about nine'); layer 765 m",
        [dpdz, -dpdz / 100, -100 / dpdz, zS[k925] - z0, zS[k925]], [-10.92, 0.109, 9.16, 765.0, 798.0], [0.01, 0.0011, 0.01, 1.0, 1.0])
    row("DG31s", "ρ = p/(R_d T) = 1.168 ('one point one seven'); ρg 11.46 ('about eleven and a half')", [rho, rho * G0], [1.168, 11.46], [0.001, 0.01])
    ciak = spacing / 4                                                  # km per hPa
    ratio = ciak * 1e3 / (-100 / dpdz)
    row("DG31s", "Ciarán 7.77 km per hPa ('about eight'); ratio 848 ('about eight hundred and fifty'); ordinary 100 km/9.16 m = 10 917 ('about ten thousand')",
        [ciak, ratio, 100e3 / (-100 / dpdz)], [7.77, 848.0, 10917.0], [0.03, 6.0, 15.0])
    row("DG16s", "6.76 K/km = 676 K per 100 km; 676/4.06 = 166 ('more than a hundred and sixty')", [-lap * 1e5, -lap * 1e5 / mag8], [676.0, 166.5], [1.0, 0.7])
    keep = zS <= 35500
    V["sing"] = {"z": r6(zS[keep], 1), "T": r6(TS[keep] - 273.15, 2), "p": r6(pS[keep] / 100, 2), "z0": z0, "T0": T0 - 273.15, "p0": p0 / 100, "ztr": ztr, "Ttr": Ttr - 273.15,
                 "lap": lap * 1e3, "lapm": lapm * 1e3, "above": abv, "europe": [ztT / 1e3, tz26 / 1e3], "dpdz": dpdz, "z925": float(zS[k925]), "rho": rho,
                 "rhog": rho * G0, "ciak": ciak, "ratio": ratio, "ordinary": 100e3 / (-100 / dpdz), "ratioT": -lap * 1e5 / mag8, "site": list(SINGAPORE)}
    # Singapore floor (BMNG 21600, 0.6-2.1 N, 103.2-104.8 E)
    bm21 = Image.open(F_BMNG21)
    Wb, Hb = bm21.size
    FB = (0.6, 2.1, 103.2, 104.8)
    c21 = (int((FB[2] + 180) / 360 * Wb), int((90 - FB[1]) / 180 * Hb), int((FB[3] + 180) / 360 * Wb), int((90 - FB[0]) / 180 * Hb))
    bm21.crop(c21).convert("RGB").resize((512, int(512 * (c21[3] - c21[1]) / (c21[2] - c21[0]))), Image.BICUBIC).save(IMG / "sing_floor.jpg", quality=90)
    V["sing"]["floor_box"] = list(FB)
    del bm21

    # ================================================================ F. the sphere (s22) and easy PGF numbers (s21, s24, s27)
    ALB = call(GS + "arc_lengths", "s22", "a dφ and a cos φ dλ per degree at Brest", lat=48.45, dlat=1.0, dlon=1.0)
    ALS = call(GS + "arc_lengths", "s22", "the same at Svalbard", lat=SVALBARD[0], dlat=1.0, dlon=1.0)
    V["sphere"] = {"brest": [float(np.asarray(ALB.dy)) / 1e3, float(np.asarray(ALB.dx)) / 1e3], "sval": [float(np.asarray(ALS.dy)) / 1e3, float(np.asarray(ALS.dx)) / 1e3],
                   "brest_ll": list(BREST_AP), "sval_ll": list(SVALBARD)}
    row("DG19", "arc_lengths(48.45°): 111.2 km N–S, 73.8 km E–W per degree; Svalbard 22.7 km", [V["sphere"]["brest"][0], V["sphere"]["brest"][1], V["sphere"]["sval"][1]],
        [111.19, 73.8, 22.7], [0.01, 0.05, 0.05])
    row("DG21", "standard sea-level pressure 1013.25 hPa ('about a thousand and thirteen')", 1013.25, 1013.0, 0.5)
    e1 = call(GA + "pressure_gradient_force_cartesian", "s27", "F = −(1/ρ)∂p/∂x, 1e-3 Pa/m, ρ = 1", dpdx=1e-3, dpdy=0.0, rho=1.0)
    e2 = call(GA + "pressure_gradient_force_cartesian", "s27", "ρ = 1.2", dpdx=1e-3, dpdy=0.0, rho=1.2)
    row("DG24", "1e-3 Pa/m: /1.0 = 1e-3; /1.2 = 8.33e-4 ('eight ten-thousandths'); × 3600 = 3.0 m/s", [-float(e1[0]), -float(e2[0]), -float(e2[0]) * 3600],
        [1e-3, 8.333e-4, 3.0], [1e-15, 5e-7, 0.01])
    import sympy as sy
    x_, dx_ = sy.symbols("x dx")
    pf = sy.Function("p")
    rem = sy.series(pf(x_ + dx_), dx_, 0, 2).removeO() - pf(x_) - sy.diff(pf(x_), x_) * dx_
    truth("DG22", "sympy: p(x + δx) − p(x) − p′(x) δx = O(δx²)", sy.simplify(rem.doit()) == 0)
    V["pgf"] = {"easy": -float(e1[0]), "exact": -float(e2[0]), "hour": -float(e2[0]) * 3600}

    # ================================================================ G. GFS 18 UTC 27 Oct 2026 (s31)
    dg = nc(F_GFS)
    lag, MSLg = asc(dg["lat"][:], dg["msl"][:])
    log_ = np.asarray(dg["lon"][:], float)
    _, ZS = asc(dg["lat"][:], dg["zs"][:]); _, Ug = asc(dg["lat"][:], dg["u10"][:]); _, Vg = asc(dg["lat"][:], dg["v10"][:])
    MSLg, ZS, Ug, Vg = (np.asarray(x, float) for x in (MSLg, ZS, Ug, Vg))
    if log_.max() > 180:
        raise RuntimeError("GFS chart longitudes 0-360: convert")
    GB_ = (50.0, 78.0, -45.0, 15.0)
    g_la, g_lo, gP = sub(lag, log_, MSLg, GB_)
    _, _, gZS = sub(lag, log_, ZS, GB_); _, _, gU = sub(lag, log_, Ug, GB_); _, _, gV = sub(lag, log_, Vg, GB_)
    cen = call(DC + "cyclone.storm_centre", "s31", "centre in a small box round the known low (66 N, 12 W)", heavy_call=True, msl=gP, lat=g_la, lon=g_lo,
               box=(64.8, 67.2, -14.0, -10.0))
    gc_la, gc_lo, gc_p = float(cen.lat), float(cen.lon), float(cen.msl_min) / 100 if float(cen.msl_min) > 2000 else float(cen.msl_min)
    row("DG30", "GFS low 960.6 hPa at 66.0 N 12.0 W ('about nine hundred and sixty one')", [gc_p, gc_la, gc_lo], [960.6, 66.0, -12.0], [0.3, 0.3, 0.5])
    ggr = call(GS + "gradient", "s31", "(2.31) ∇p, GFS msl", heavy_call=True, F=gP, lat=g_la, lon=g_lo)
    gg = np.asarray(ggr.magnitude) * 1e5 / 100
    GLA, GLO = np.meshgrid(g_la, g_lo, indexing="ij")
    seaG = (gZS < 50) & (GLA >= 55) & (GLA <= 75) & (GLO >= -35) & (GLO <= 5)
    kg = np.unravel_index(np.nanargmax(np.where(seaG, gg, -1)), gg.shape)
    wsG = np.hypot(gU, gV)
    kw = np.unravel_index(np.nanargmax(np.where(seaG, wsG, -1)), wsG.shape)
    row("DG30", "max sea |∇p| (orography < 50 m) 10.4 ± 0.3 ('about ten', within 25 % of 12.87); max 10-m wind 25.6 ± 0.5 ('about twenty five')",
        [gg[kg], wsG[kw], gg[kg] / gmag_b > 0.75], [10.4, 25.6, 1], [0.3, 0.5, 0])
    rgba_png(wsG[::-1], L_SP, 0, 30, IMG / "gfs_speed.png", up=2)
    iso_g = contours(gP / 100, g_la, g_lo, np.arange(956, 1040, 4), nd=3, step=2)
    V["gfs"] = {"box": list(GB_), "img_box": [float(g_la[0]), float(g_la[-1]), float(g_lo[0]), float(g_lo[-1])], "isobars": iso_g, "centre": [gc_la, gc_lo, gc_p],
                "gmax": [float(gg[kg]), float(g_la[kg[0]]), float(g_lo[kg[1]])], "wmax": [float(wsG[kw]), float(g_la[kw[0]]), float(g_lo[kw[1]])]}

    # ================================================================ H. Elliott front stack, 12 UTC 22 Dec 2022 (s33b)
    import fluidpy.data.movie_gradient as mg
    df_ = nc(F_FR)
    lev = np.asarray(df_["level"][:], float)
    laf, TF = asc(df_["lat"][:], df_["t"][:]); lof = np.asarray(df_["lon"][:], float)
    _, BG = asc(df_["lat"][:], df_["below_ground"][:]); _, ZGf = asc(df_["lat"][:], df_["zg"][:])
    TF, BG, ZGf = np.asarray(TF, float), np.asarray(BG) > 0.5, np.asarray(ZGf, float)
    tilt = call("fluidpy.data.movie_gradient.front_tilt", "s33b", "|∇T| maxima along cross-front lines (front_fields, 100-km smoothing)", heavy_call=True,
                T=TF, lat=laf, lon=lof, levels=lev, seed_lats=[39.0, 40.0, 41.0], seed_level=850.0, lon_window=(-104.0, -80.0))
    dist_t = np.asarray(tilt.dist_km)                                    # (3 lines, 5 levels) km, + towards the cold air
    ks4 = [int(np.where(lev == L_)[0][0]) for L_ in (850, 700, 500, 300)]
    up3 = dist_t[:, ks4[1:]]
    row("DG33b", "every layer above 850 hPa sits on the cold side of the 850 front, 260-450 km back", [np.nanmin(up3), np.nanmax(up3)], [262.5, 450.0], [15.0, 15.0])
    truth("DG33b", "the 1000 hPa level is below ground on every line point (not shown as air)", bool(np.all(BG[0][np.ix_(np.searchsorted(laf, [39, 40, 41]), np.arange(lof.size))].any(axis=1))))
    zg300 = float(np.nanmean(ZGf[int(np.where(lev == 300)[0][0])]))
    zg850 = float(np.nanmean(np.where(BG[int(np.where(lev == 850)[0][0])], np.nan, ZGf[int(np.where(lev == 850)[0][0])])))
    row("DG33b", "box-mean height 300 hPa ≈ 9 km ('about nine'); 850 hPa ≈ 1.5 km ('about one and a half')", [zg300 / 1e3, zg850 / 1e3], [9.0, 1.5], [0.25, 0.3])
    front_lon = float(np.nanmean(np.asarray(tilt.lon)[:, ks4[0]]))
    rng("DG33b", "the 850 hPa front lies over the central United States (lon 105-85 W)", front_lon, -105.0, -85.0)
    FB_ = (30.0, 50.0, -110.0, -82.0)
    st_layers = []
    for kk, L_ in zip(ks4, (850, 700, 500, 300)):
        ff = call("fluidpy.diag.fronts.front_fields", "s33b", f"|∇T| at {L_} hPa (100-km smoothing)", heavy_call=True, T=TF[kk], lat=laf, lon=lof, smooth_km=100.0)
        Gm = np.asarray(ff.grad_mag) * 1e5
        Gm = np.where(BG[kk], np.nan, Gm)
        f_la, f_lo, fG = sub(laf, lof, Gm, FB_)
        _, _, fT = sub(laf, lof, np.where(BG[kk], np.nan, TF[kk] - 273.15), FB_)
        rgba_png(fG[::-1], L_AMP, 0, 8, IMG / f"front_{L_}.png", up=2)
        isoF = contours(np.nan_to_num(fT, nan=-99), f_la, f_lo, np.arange(-60, 24, 4), nd=2, step=2)
        isoF = [c for c in isoF if c["level"] > -99]
        fa = []
        for la_ in np.arange(32.0, 48.1, 2.0):
            for lo_ in np.arange(-106.0, -84.0, 2.5):
                j_, i_ = int(np.argmin(np.abs(laf - la_))), int(np.argmin(np.abs(lof - lo_)))
                if not BG[kk][j_, i_] and np.isfinite(ff.dtau_dx[j_, i_]):
                    fa.append([float(laf[j_]), float(lof[i_]), round(float(ff.dtau_dx[j_, i_]) * 1e5, 3), round(float(ff.dtau_dy[j_, i_]) * 1e5, 3)])
        st_layers.append({"level": L_, "zg_km": float(np.nanmean(np.where(BG[kk], np.nan, ZGf[kk]))) / 1e3, "iso": isoF, "arrows": fa,
                          "front": [[float(x), float(y)] for x, y in zip(np.asarray(tilt.lat)[:, kk], np.asarray(tilt.lon)[:, kk])], "peak": r6(np.asarray(tilt.peak)[:, kk], 2)})
    V["front"] = {"box": list(FB_), "layers": st_layers, "dist": r6(dist_t[:, ks4], 1), "zg300": zg300, "front_lon": front_lon, "range": [float(np.nanmin(up3)), float(np.nanmax(up3))],
                  "coast": box_lines(F_NE50C, (FB_[0], FB_[1], FB_[2], FB_[3]), d=0.15, nd=2), "borders": box_lines(F_NE50B, (FB_[0], FB_[1], FB_[2], FB_[3]), d=0.15, nd=2)}

    # ================================================================ I. Normandy sea breeze, 24 Jun 2024 (s35)
    dcu = nc(F_CUM)
    lacu, T2 = asc(dcu["lat"][:], dcu["t2m"][:]); locu = np.asarray(dcu["lon"][:], float)
    tcu = np.asarray(dcu["time"][:], float)
    k13 = int(np.argmin(np.abs(tcu - 3)))
    T13 = np.asarray(T2[k13], float) - 273.15
    jl, js, i0 = int(np.argmin(np.abs(lacu - 49.25))), int(np.argmin(np.abs(lacu - 49.75))), int(np.argmin(np.abs(locu - 0.0)))
    Tl, Ts = float(T13[jl, i0]), float(T13[js, i0])
    dsb = float(call(GS + "great_circle_distance", "s35", "inland ↔ Channel probe", lat1=49.25, lon1=0.0, lat2=49.75, lon2=0.0)) / 1e3
    row("DG34", "Normandy 13 UTC: 24.6 and 16.1 °C at (49.25, 0) and (49.75, 0); 55.6 km ('about fifty five')", [Tl, Ts, dsb], [24.6, 16.1, 55.6], [0.05, 0.05, 0.05])
    gsb = (Tl - Ts) / dsb * 100
    row("DG34", "15.3 K/100 km ('about fifteen'), sharper than the storm's front (> 11.37)", [gsb, gsb > gmax], [15.3, 1], [0.05, 0])
    row("DG34", "spoken rounding: 8.5 / 55.6 × 100 = 15.3", 8.5 / 55.6 * 100, 15.3, 0.02)
    gs2 = call(GS + "gradient", "s35", "(2.31) ∇T2m at 13 UTC", heavy_call=True, F=T13, lat=lacu, lon=locu)
    dsbw = nc(F_SB)
    lasb, U10s = asc(dsbw["lat"][:], dsbw["u10"][:]); losb = np.asarray(dsbw["lon"][:], float)
    _, V10s = asc(dsbw["lat"][:], dsbw["v10"][:])
    tsb = np.asarray(dsbw["time"][:], float)
    sbw = {}
    for hh in (9, 12, 15):
        kh = int(np.argmin(np.abs(tsb - (hh - 6))))
        aw = []
        for la_ in (49.25, 49.5, 49.75, 50.0):
            for lo_ in (-1.0, -0.5, 0.0, 0.5, 1.0):
                j_, i_ = int(np.argmin(np.abs(lasb - la_))), int(np.argmin(np.abs(losb - lo_)))
                aw.append([float(lasb[j_]), float(losb[i_]), round(float(U10s[kh][j_, i_]), 2), round(float(V10s[kh][j_, i_]), 2)])
        sbw[str(hh)] = aw
    v_ch = [float(V10s[int(np.argmin(np.abs(tsb - (h - 6))))][int(np.argmin(np.abs(lasb - 49.5))), int(np.argmin(np.abs(losb - 0.0)))]) for h in (9, 12, 15)]
    truth("DG34", "the wind off the Channel (v10 < 0, from the north = onshore) strengthens 09 → 15 UTC", v_ch[0] > v_ch[1] > v_ch[2] and v_ch[2] < -3, value=r6(v_ch, 2))
    im = Image.open(F_MODIS).convert("RGB")
    im.save(IMG / "sb_modis.jpg", quality=90)
    iso_sb = contours(T13, lacu, locu, np.arange(14, 27, 2), nd=3)
    V["sb"] = {"img_box": [48.9, 50.1, -1.6, 1.6], "inland": [49.25, 0.0, Tl], "sea": [49.75, 0.0, Ts], "dist": dsb, "grad": gsb, "winds": sbw, "v_channel": v_ch,
               "iso": iso_sb, "coast": box_lines(F_NE10C, (48.9, 50.1, -1.6, 1.6), d=0.01), "gx_inland": float(np.asarray(gs2.dFdy)[jl, i0]) * 1e5}

    # ================================================================ J. the jet: ERA5 zonal means Sep 2026 (s36) and GFS 250 hPa 28 Oct 2026
    dz = nc(F_ZM)
    lvz, laz = np.asarray(dz["level"][:], float), np.asarray(dz["lat"][:], float)
    laz2, Tz = asc(laz, dz["t_zm"][:]); _, Uz = asc(laz, dz["u_zm"][:]); _, Zz = asc(laz, dz["z_zm"][:])
    Tz, Uz, Zz = np.asarray(Tz, float), np.asarray(Uz, float), np.asarray(Zz, float)
    if np.nanmax(Zz) > 2e5:
        Zz = Zz / G0                                                   # geopotential → height
    fake = np.repeat(Tz[:, :, None], 3, axis=2)
    gz = call(GS + "gradient", "s36", "(2.31) ∂T/∂y of the zonal mean (field broadcast over 3 longitudes)", heavy_call=True, F=fake, lat=laz2, lon=np.array([0.0, 1.0, 2.0]))
    dTdy = np.asarray(gz.dFdy)[:, :, 1] * 1e6                         # K per 1000 km
    lay = (lvz >= 300) & (lvz <= 850)
    pl = lvz[lay]
    o_ = np.argsort(pl)
    wmean = np.trapezoid(dTdy[lay][o_], pl[o_], axis=0) / (pl[o_][-1] - pl[o_][0])
    nh = (laz2 >= 20) & (laz2 <= 70)
    kst = int(np.argmin(np.where(nh, wmean, np.inf)))
    row("DG35", "Sep 2026 layer-mean (850-300 hPa, pressure-weighted) steepest ∂T/∂y −6.37 ± 0.15 K/1000 km at 45 ± 1 N ('about six', 'near forty five')",
        [wmean[kst], laz2[kst]], [-6.37, 45.0], [0.15, 1.0])
    nhU = np.where((laz2[None, :] >= 15) & (laz2[None, :] <= 75) & (lvz[:, None] >= 100), Uz, -np.inf)
    kj = np.unravel_index(np.argmax(nhU), Uz.shape)
    row("DG35", "real zonal-mean jet max 25.66 ± 0.5 m/s ('about twenty six') at 45 N, 200 hPa, Z 12.15 km ('about twelve')",
        [Uz[kj], laz2[kj[1]], lvz[kj[0]], Zz[kj] / 1e3], [25.66, 45.0, 200.0, 12.15], [0.5, 1.0, 0.0, 0.1])
    truth("DG35", "the jet latitude within 3° of the steepest-gradient latitude ('right above')", abs(laz2[kj[1]] - laz2[kst]) <= 3)
    sec_j = (laz2 >= 0) & (laz2 <= 90)
    sec_k = lvz >= 100
    TSEC = Tz[np.ix_(sec_k, sec_j)][np.argsort(lvz[sec_k])] - 273.15        # rows: 100 hPa (top) … 1000 hPa (bottom)
    rgba_png(TSEC, L_TH, -80, 30, IMG / "zm_t.png", up=1)
    lev_s = np.sort(lvz[sec_k])
    lat_s = laz2[sec_j]
    USEC = Uz[np.ix_(sec_k, sec_j)][np.argsort(lvz[sec_k])]
    ucont = contours(USEC, lev_s, lat_s, [10.0, 15.0, 20.0, 25.0], nd=2)   # lines as [lat, p] pairs
    tcont = contours(TSEC, lev_s, lat_s, [-70.0, -60.0, -50.0, -40.0, -30.0, -20.0, -10.0, 0.0, 10.0, 20.0], nd=2)
    V["zm"] = {"ucont": ucont, "tcont": tcont, "lev": r6(np.sort(lvz[sec_k]), 1), "lat": r6(laz2[sec_j], 1), "z_km": r6(np.nanmean(Zz[np.ix_(sec_k, sec_j)], axis=1)[np.argsort(lvz[sec_k])] / 1e3, 2),
               "T": [r6(r_, 1) for r_ in (Tz[np.ix_(sec_k, sec_j)][np.argsort(lvz[sec_k])] - 273.15)],
               "U": [r6(r_, 1) for r_ in Uz[np.ix_(sec_k, sec_j)][np.argsort(lvz[sec_k])]], "steep": [float(laz2[kst]), float(wmean[kst])],
               "jet": [float(Uz[kj]), float(laz2[kj[1]]), float(lvz[kj[0]]), float(Zz[kj]) / 1e3], "wmean": r6(wmean[sec_j], 3), "weighting": "pressure-weighted mean over 850-300 hPa (np.trapezoid in p)"}
    dj = nc(F_JET)
    laj, SPJ = asc(dj["lat"][:], dj["speed"][:]); loj = np.asarray(dj["lon"][:], float)
    _, UJ = asc(dj["lat"][:], dj["u"][:]); _, VJ = asc(dj["lat"][:], dj["v"][:])
    k250 = int(np.where(np.asarray(dj["level"][:], float) == 250)[0][0])
    S250, U250, V250 = (np.asarray(x[k250], float) for x in (SPJ, UJ, VJ))
    kmx = np.unravel_index(np.nanargmax(S250), S250.shape)
    row("DG35", "GFS 28 Oct 2026 250 hPa max 66.07 m/s ('sixty six') = 237.9 km/h ('about two hundred and forty') at 40.0 N 51.75 W",
        [S250[kmx], S250[kmx] * 3.6, laj[kmx[0]], loj[kmx[1]]], [66.07, 237.9, 40.0, -51.75], [0.01, 0.1, 1e-6, 1e-6])
    rgba_png(np.where(S250 >= 20, S250, np.nan)[::-1], L_SP, 0, 70, IMG / "jet250.png", up=1)
    rj = np.random.default_rng(32)
    sl_, so_ = rj.uniform(25, 60, 420), rj.uniform(-95, 15, 420)
    trj = call(DC + "trajectories.advect_on_sphere", "s36", "streaks along the 250 hPa wind (frozen 18 UTC field)", heavy_call=True, u=U250, v=V250, lat=laj, lon=loj,
               seeds_lat=sl_, seeds_lon=so_, dt=900.0, nsteps=40)
    V["jet"] = {"img_box": [float(laj[0]), float(laj[-1]), float(loj[0]), float(loj[-1])], "max": [float(S250[kmx]), float(laj[kmx[0]]), float(loj[kmx[1]])],
                "tracks": [np.round(t, 2).tolist() for t in np.asarray(trj)], "track_dt_s": 900.0}

    # ================================================================ K. the Gulf Stream, OISST 29 Oct 2026 (s37)
    ds_ = nc(F_SST)
    las, SST = asc(ds_["lat"][:], ds_["sst"][:]); los = np.asarray(ds_["lon"][:], float)
    SST = np.where(np.asarray(SST, float) < -50, np.nan, np.asarray(SST, float))
    pA, pB = (40.875, -65.125), (41.125, -64.875)
    tA, tB = float(bilin(SST, las, los, *pA)), float(bilin(SST, las, los, *pB))
    dAB = float(call(GS + "great_circle_distance", "s37", "the two north-wall points", lat1=pA[0], lon1=pA[1], lat2=pB[0], lon2=pB[1])) / 1e3
    row("DG36", "north wall 29 Oct 2026: 21.46 → 14.94 °C ('about six and a half degrees') over 34.8 km ('about thirty five')", [tA, tB, tA - tB, dAB],
        [21.46, 14.94, 6.52, 34.8], [0.01, 0.01, 0.02, 0.2])
    gss = call(GS + "gradient", "s37", "(2.31) ∇SST", heavy_call=True, F=SST, lat=las, lon=los)
    gsm = np.asarray(gss.magnitude) * 1e5
    rgba_png(SST[::-1], L_TH, 4, 28, IMG / "sst.png", up=2)
    iso_s = contours(np.nan_to_num(gsm, nan=0), las, los, [8.0], nd=3)
    V["sst"] = {"img_box": [float(las[0]) - 0.125, float(las[-1]) + 0.125, float(los[0]) - 0.125, float(los[-1]) + 0.125], "A": [pA[0], pA[1], tA], "B": [pB[0], pB[1], tB],
                "dist": dAB, "drop": tA - tB, "front": iso_s, "range": [4, 28]}

    # ================================================================ L. coasts and borders, the globe texture
    V["lines"] = {
        "europe_coast": box_lines(F_NE10C, (36.0, 61.0, -32.0, 14.0), d=0.04),
        "europe_border": box_lines(F_NE10B, (36.0, 61.0, -32.0, 14.0), d=0.04),
        "natl_coast": box_lines(F_NE50C, (48.0, 80.0, -50.0, 20.0), d=0.08),
        "alps_coast": box_lines(F_NE10C, (43.0, 48.5, 4.0, 13.0), d=0.02),
        "alps_border": box_lines(F_NE10B, (43.0, 48.5, 4.0, 13.0), d=0.02),
        "him_border": box_lines(F_NE10B, (24.5, 42.0, 72.0, 105.0), d=0.05),
        "mb_border": box_lines(F_NE10B, (DB[0], DB[1], DB[2], DB[3]), d=0.003, nd=4),
        "sing_coast": box_lines(F_NE10C, (FB[0], FB[1], FB[2], FB[3]), d=0.005, nd=4),
        "globe_coast_110m": json.loads(F_NE110.read_text(encoding="utf-8"))["coastline"],
    }
    bmg = Image.open(F_BMNG).convert("RGB").resize((4096, 2048), Image.LANCZOS)
    bmg.save(IMG / "bmng.jpg", quality=88)

    # ================================================================ recap = scene rows (DG37)
    row("DG37", "recap numbers: 50, 53°, 4.1, −3.2, 13, 0.01, 37 = their scene rows",
        [V["hill"]["norm"], round(V["hill"]["angle"]), round(mag8, 1), round(gx8, 1), round(gmag_b), round(fmag, 2), round(fmag * 3600)],
        [50.0, 53.0, 4.1, -3.2, 13.0, 0.01, 37.0], 1e-9)

    # ---------------------------------------------------------------------------------------------- report and write
    for r in rows:
        print(f"  {'PASS' if r['pass'] else 'FAIL'}  {r['id']:6s} {r['name']}  -> {r['value']}")
    if not all(r["pass"] for r in rows):
        print(f"build_ch00_gradient: {sum(not r['pass'] for r in rows)} checks FAILED — no data written")
        return 1

    def clean(o):
        if isinstance(o, dict):
            return {k: clean(v) for k, v in o.items()}
        if isinstance(o, (list, tuple)):
            return [clean(v) for v in o]
        if isinstance(o, (float, np.floating)):
            return None if not np.isfinite(o) else float(o)
        if isinstance(o, (np.integer,)):
            return int(o)
        if isinstance(o, (bool, np.bool_)):
            return bool(o)
        if isinstance(o, np.ndarray):
            return clean(o.tolist())
        return o
    V = clean(V)
    blob = json.dumps(V, separators=(",", ":"), ensure_ascii=False, allow_nan=False).encode("utf-8")
    (DATA / "gr.json").write_bytes(blob)
    data_hashes = {"gr.json": hashlib.sha256(blob).hexdigest()}
    for pimg in sorted(list(IMG.glob("*.png")) + list(IMG.glob("*.jpg"))):
        data_hashes[f"img/{pimg.name}"] = sha_file(pimg)
    render = {}
    for pub in a.public:
        pub.mkdir(parents=True, exist_ok=True)
        for pimg in sorted(list(IMG.glob("*.png")) + list(IMG.glob("*.jpg"))):
            (pub / f"gr_{pimg.name}").write_bytes(pimg.read_bytes())
        render[str(pub)] = {pp.name: sha_file(pp) for pp in sorted(pub.glob("gr_*"))}
    inputs = {str(pq.relative_to(ROOT)).replace("\\", "/") if ROOT in pq.parents else str(pq): sha_file(pq)
              for pq in [F_CIA, F_CIAL, F_850, F_MB15, F_ALPS, F_TIB, F_S2, F_IGRA, F_IGRA_TR, F_ISD, F_GFS, F_JET, F_ZM, F_SST, F_FR, F_CUM, F_SB, F_MODIS,
                         F_BMNG, F_BMNG21, F_NE110, F_NE50C, F_NE10C, F_NE10B, F_NE50B]}
    manifest = {
        "id": "ch00_gradient", "storyboard": "movies/ch00/ch00_gradient/storyboard.yaml", "builder": "movies/data/build_ch00_gradient.py",
        "fluidpy": {"repo": "../Fluid Dynamics", **git_sha(FLUID, {
            "operators_py": "fluidpy/core/operators.py", "tensors_py": "fluidpy/core/tensors.py", "calculus_py": "fluidpy/geo/calculus.py",
            "vectors_py": "fluidpy/geo/vectors.py", "sphere_py": "fluidpy/geo/sphere.py", "terrain_py": "fluidpy/geo/terrain.py", "atmos_py": "fluidpy/geo/atmos.py",
            "cyclone_py": "fluidpy/diag/cyclone.py", "climatology_py": "fluidpy/diag/climatology.py", "advection_py": "fluidpy/diag/advection.py",
            "fronts_py": "fluidpy/diag/fronts.py", "sounding_py": "fluidpy/diag/sounding.py", "trajectories_py": "fluidpy/diag/trajectories.py",
            "igra_py": "fluidpy/data/igra.py", "movie_gradient_py": "fluidpy/data/movie_gradient.py"})},
        "equations_note": "provenance only (QA/reviewer); the movie draws no equation labels or numbers (HOUSE_STYLE §5)",
        "equations": {"gradient (Cartesian)": "Kundu §2.9 printed p. 53 ((∇φ)_i = ∂φ/∂x_i), App. B §B.3 p. 862", "directional derivative": "Kundu p. 53 (∂φ/∂n = ∇φ·n)",
                      "total differential": "Vallis (1.4); Kundu App. B §B.1", "gradient on the sphere": "Vallis (2.31), r = a",
                      "pressure force": "Vallis (1.45)-(1.47); per unit mass −∇p/ρ, the pressure term of (1.48)", "hydrostatic": "Vallis (1.51)",
                      "advection": "Vallis (2.27)"},
        "parameters": {"places": {"brest_gridpoint_850": BREST_GP, "brest_airport_msl": BREST_AP, "chamonix": CHAMONIX, "summit": SUMMIT, "courmayeur": COURMAYEUR,
                                  "everest": EVEREST, "svalbard": SVALBARD, "singapore": SINGAPORE},
                       "hillside": "h = 30 x + 40 y m/km (easy numbers); s12 hill 100 m exp(−(x²/2.4² + y²/1.6²)/2); title hill 300 m exp(−r²/8) with the gold point at r = %.4f km" % rr,
                       "mont_blanc": {"drape": "ETOPO 2022 15″ heights in the box %s, heights ×2 on screen (said in s15); Sentinel-2 L2A 26 Sep 2023 texture" % (DB,),
                                      "arrows": "∇h on the ETOPO 60″ grid (every 2nd node) — 'about sixty percent' is the 60″ slope (15″ reaches 129 %)",
                                      "droplets": "descent_path on the 15″ grid, step 120 m"},
                       "himalaya": "20′ block means (20 × 20 cells) of ETOPO 60″, sphere.gradient on the block grid",
                       "ciaran": {"seed": [52.5, 1.75, "2023-11-02T12"], "box_deg": [1.2, 2.0], "max_step_km": 120, "rho": 1.25, "bins_hPa_per_100km": [0, 2, 4, 6, 8, 10, "inf"],
                                  "sea_box": "40-60 N, 30 W-5 E, ERA5 land mask < 0.5", "streaklines": "advect_on_sphere through the frozen 03 UTC 10-m wind, 600 s per sample"},
                       "s36": {"month": "2026-09 (D6, orchestrator decision)", "weighting": V["zm"]["weighting"], "jet_tracks": "frozen GFS 250 hPa wind, 900 s per sample"},
                       "s33b": {"case": "Winter Storm Elliott Arctic front, ERA5 12 UTC 22 Dec 2022", "levels_shown": [850, 700, 500, 300],
                                "not_shown": "1000 hPa (below ground on the front)", "smoothing_km": 100},
                       "time_compression": {"s00/s29 streaklines": "600 s of flow per frame step", "s36 jet streaks": "900 s per frame step",
                                            "s17 balloon": "about 50 min of ascent in about 10 s"},
                       "exaggerations": ["title hill (illustrative Gaussian)", "s03 hillside slope ×10 in 3-D", "s15-s16 terrain ×2 (said)", "s16 Himalaya profile ×20 (axes in km and m)",
                                         "s17/s32 column height compressed (axes labelled)", "s18 slice ×50 after the true-scale frame (said)", "s22 grid cells ×10",
                                         "arrow lengths for legibility (no scale drawn)", "s33b layer separation (heights labelled)"]},
        "credits": [
            "Contains modified Copernicus Climate Change Service information 2026 (ERA5 hourly single levels and pressure levels, ERA5 monthly means).",
            "Contains modified Copernicus Sentinel data 2023 (Sentinel-2 L2A, Mont Blanc, 26 Sep 2023).",
            "ETOPO 2022 15-arc-second and 60-arc-second Global Relief Model (NOAA NCEI, public domain).",
            "IGRA v2 (NOAA NCEI, doi:10.7289/V5X63K0Q): Singapore Changi 48698, Trappes 07145.",
            "NOAA NCEI Integrated Surface Database (ISD): Brest-Guipavas 07110 SYNOP (WMO Resolution 40 notice applies).",
            "NOAA NCEP GFS 0.25° analyses (public domain), 27 and 28 Oct 2026.",
            "NOAA OISST v2.1 (Huang et al. 2021, J. Climate 34, 2923-2939, doi:10.1175/JCLI-D-20-0166.1), 29 Oct 2026 (preliminary).",
            "Imagery from NASA Worldview / GIBS, MODIS Aqua Corrected Reflectance, 24 Jun 2024.",
            "Blue Marble: Next Generation, NASA Earth Observatory (Reto Stöckli, NASA GSFC). Made with Natural Earth.",
            "Cited (not computed): Mont Blanc 4805.59 m (2021 survey), Chamonix ≈ 1035 m; Enedis: about 1.2 million homes without power (press release 7 Nov 2023).",
            "Music: tools/sound (procedural synthesis, our own code, CC0-1.0), style sun-radiant seed 31 (the storyboard's runner-up; steepest-ascent is not in tools/sound/styles.py)."],
        "js_selftest": "none — the composition has no JS physics; every number is read from data/gr.json (TSX CHECK rows re-assert the screen strings)",
        "inputs_sha256": inputs, "render_assets": render, "data_files": data_hashes, "checks": rows,
        "physics": [e for e in entries if e.get("sha256")], "physics_recorded": [e for e in entries if not e.get("sha256")], "physics_heavy": heavy,
    }
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=1, ensure_ascii=False, default=str), encoding="utf-8")
    print(f"build_ch00_gradient: gr.json {len(blob) / 1e3:.0f} kB + {len(data_hashes) - 1} images; {len(entries)} parity entries, "
          f"{len(heavy)} heavy, {len(rows)} checks -> {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
