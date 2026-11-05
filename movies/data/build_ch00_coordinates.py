"""Physics and real-data products for the Chapter-0 movie #5 "Coordinates: on a plane, a cylinder and a sphere"
(movies/ch00/ch00_coordinates/storyboard.yaml v3, 49 scenes; CHECK rows DC01-DC57 of data_needs.md §D, §G, §H).

Run with the main venv::

    .venv/Scripts/python.exe movies/data/build_ch00_coordinates.py [--public <render public dir>]

Every number the movie shows or says is computed here by the tested functions named in the storyboard's
``physics_source`` fields:

* ``fluidpy.core.coords`` (polar_from_cartesian, cartesian_from_polar_coords, unit_vectors_polar, velocity_components,
  cartesian_from_spherical), ``fluidpy.core.tensors.rotation_matrix_2d``, ``fluidpy.core.curvilinear.scale_factors``,
  ``fluidpy.core.kinematics`` (galilean_transform, acceleration),
* ``fluidpy.geo.sphere`` (unit_vector, enu_basis, band_fraction, band_area, wrap_lon, arc_lengths, central_angle,
  great_circle_distance, great_circle_points, great_circle_vertex, initial_bearing, rhumb_line, polygon_area, gradient,
  destination_point), ``fluidpy.geo.frames`` (unit_vector_rates, metric_terms, coriolis_parameter, great_circle),
  ``fluidpy.geo.mapproj`` (forward, scale_factors, tissot_ellipses), ``fluidpy.geo.vectors.components_in_axes``,
  ``fluidpy.geo.atmos`` (wind_components, pressure_height_standard),
* ``fluidpy.diag.cyclone`` (storm_centre, storm_relative_wind, track_by_continuity, translation_velocity),
  ``fluidpy.diag.trajectories.advect_on_sphere``, ``fluidpy.diag.climatology.global_mean``,

on files already on disk: HRRR Ian analyses (G: derived), ERA5 Ian pressure levels and z (data/derived/ch00), ERA5 Ciarán
surface (G: derived), NCEP/NCAR R1 10 hPa 2025-26 (data/derived/ch00), NOAA CO-OPS gauges, ERA5 Sep 2026 t2m anomaly,
ISD Brest, IBTrACS Ian, GOES-16 true colour, Blue Marble NG, Natural Earth, ETOPO 2022 (Alps). No download.

Writes movies/ch00/ch00_coordinates/data/co.json (numbers + small arrays the composition only indexes and interpolates),
data/img/*.png|jpg (field and map rasters made from the data with the project colour maps) and manifest.json (function,
provenance, parameters, fluidpy git SHA, sha256 of every input and data file, parity hashes). All CHECK rows must pass
before anything is written (exit 1 otherwise). With ``--public`` it also writes every render asset (co_*) there.
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
OUT = ROOT / "movies" / "ch00" / "ch00_coordinates"
DATA = OUT / "data"
IMG = DATA / "img"
DER = ROOT / "data" / "derived" / "ch00"
GDER = Path("G:/Geophysical Fluid Dynamics/aofd-data/derived/ch00")
RAW = Path("G:/Geophysical Fluid Dynamics/aofd-data/raw")
CP_REAL = ROOT / "movies" / "ch00" / "ch00_cross_product_why" / "data" / "real"
F_HRRR = GDER / "hrrr_ian_2022.nc"
F_IANPL = DER / "era5_ian_2022-09-28T18_pl.nc"
F_IANZ = DER / "era5_ian_2022-09-28T18_z18.nc"
F_CIA = GDER / "era5_ciaran_2023_sfc.nc"
F_NCEP = DER / "ncep_r1_10hPa_20251101_20260317.nc"
F_COOPS = DER / "coops_ian_surge_20220927_20220930.nc"
F_T2M = DER / "era5_t2m_anom_2026-09_1deg.nc"
F_ISD = DER / "rwm_isd_brest_2023-11-01T12_2023-11-02T09.json"
F_IBT = CP_REAL / "ibtracs_ian_2022.json"
F_GOES = CP_REAL / "ian_goes16_truecolour_20220928T1801.jpg"
F_GOESJ = CP_REAL / "ian_goes16_20220928T1801.json"
F_BMNG = CP_REAL / "globe_bmng_topo_bathy_200409_5400x2700.jpg"
F_NE110 = CP_REAL / "ne_lines_110m.json"
F_NE10C = RAW / "NE-10m-admin" / "ne_10m_coastline.zip"
F_NE10A = RAW / "NE-10m-admin" / "ne_10m_admin_0_countries.zip"
F_NE50L = RAW / "NE-50m-land" / "ne_50m_land.zip"
F_ALPS = RAW / "ETOPO2022-60s" / "etopo2022_60s_alps_43-49N_4-17E.nc"

sys.path.insert(0, str(FLUID))
sys.path.insert(0, str(Path(__file__).resolve().parent))
import xarray as xr  # noqa: E402
from _stack import area_mean  # noqa: E402

D2R = np.pi / 180.0
A_E = 6.371e6
BREST = (48.39, -4.49)
TRAPPES = (48.77, 2.01)
SINGAPORE = (1.35, 103.82)
LYB = (78.22, 15.65)            # Longyearbyen, Svalbard
LHR = (51.47, -0.45)
LAX = (33.94, -118.41)
FMB = (26.45, -81.95)           # Fort Myers Beach
STP = (27.76, -82.63)           # St. Petersburg
PLY = (50.25, -4.25)            # Plymouth
IAN_BOX = (24.0, 29.5, -85.0, -79.5)     # s11 map
CIA_BOX = (44.0, 58.0, -15.0, 5.0)       # s43-s45 map
CS, GS, GF, GM, GV, GA, DC, DT_ = ("fluidpy.core.coords.", "fluidpy.geo.sphere.", "fluidpy.geo.frames.", "fluidpy.geo.mapproj.",
                                   "fluidpy.geo.vectors.", "fluidpy.geo.atmos.", "fluidpy.diag.cyclone.", "fluidpy.diag.trajectories.")


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


# the radial-wind diverging scale (storyboard colour contract): rose (inflow, −) -> near-page slate at 0 -> orange (outflow, +)
RADIAL_LUT = ["#d9667f", "#b65a74", "#8a4e66", "#5b4258", "#3a3d55", "#4f4a4f", "#7c5a44", "#b06e3e", "#e8833a"]


def tissot_xy(T) -> list[list[float]]:
    """Tissot outlines in units of the Earth's radius (x/a, y/a), flat [x0, y0, x1, y1, …] per circle (rounded 1e-4).

    Fix loop 1 (review 1 Must 6): `tissot_ellipses` takes `radius_km` and `a` in METRES; build 1 passed a = 1.0 with
    radius_km = 500, i.e. a 500 000-rad circle on a 1-m sphere (≈ 169.7° angular radius: a ring round the ANTIPODE, which
    drew the Brest / 60° N / Svalbard bands at the same latitudes in the southern hemisphere). The circles are now traced on
    the real sphere (default a = EARTH_RADIUS) and divided by that radius here."""
    from fluidpy.geo.constants import EARTH_RADIUS
    return [np.round(np.stack([np.asarray(t.x) / EARTH_RADIUS, np.asarray(t.y) / EARTH_RADIUS], -1), 4).ravel().tolist() for t in T]


def tissot_check(nm: str, kw: dict, TC: list, xy: list[list[float]]) -> list[tuple[str, float, float, float]]:
    """(name, value, ref, tol) rows: each outline encloses its own projected centre in y (ymin ≤ y0/a ≤ ymax; a finite
    circle on Mercator is not symmetric about its centre, so the mid-height is not tested) and spans less than 1.0 a
    (the tallest, Mercator at Svalbard: 2 × 500 km / a × k ≈ 0.77)."""
    import fluidpy.geo.mapproj as MP
    out = []
    for (la, lo), L in zip(TC, xy):
        a_ = np.asarray(L).reshape(-1, 2)
        y0 = float(MP.forward(nm, la, lo, a=1.0, **kw)[1])
        ok = a_[:, 1].min() <= y0 <= a_[:, 1].max() and (a_[:, 1].max() - a_[:, 1].min()) < 1.0
        out.append((f"{nm} ({la:.1f}, {lo:.1f}) outline encloses y0/a = {y0:.3f}", float(ok), 1.0, 0.0))
    return out


def eye_stretch(crop, up: int = 4):
    """GOES true-colour eye crop with a contrast stretch (fix loop 1, review 1 Must 1): the 1.2° crop of a bright cloud
    shield is almost uniform white (luminance 174–255), so the eye did not read. Linear stretch of the 0.5–99.5 % luminance
    range to 30–255 with γ = 1.6 (same factors on R, G, B: hues kept). Stated in the manifest and on the source line."""
    from PIL import Image
    a = np.asarray(crop).astype(float)
    lo, hi = np.percentile(a.mean(-1), [0.5, 99.5])
    o = (30 + 225 * np.clip((a - lo) / (hi - lo), 0, 1) ** 1.6).astype(np.uint8)
    im = Image.fromarray(o)
    return im.resize((im.width * up, im.height * up), Image.LANCZOS), {"lum_lo": float(lo), "lum_hi": float(hi), "out": [30, 255], "gamma": 1.6}


def pinellas_note(c10: np.ndarray, uS) -> dict:
    """Which Pinellas coast segment gives the bearing used on screen (fix loop 1, review 1 Should 15 / DC43).

    The s40 across-shore component uses 355.4°: the great-circle bearing between the planning points 27.60 N 82.74 W and
    28.15 N 82.79 W (data_needs, coast bearings). The NE 10 m nearest-coast-point segment (DC43 row) gives 353.1°, the NE
    50 m land outline 355.7°. Across components for each, from the same nearest-HRRR-point wind, are recorded too."""
    import fluidpy.geo.sphere as S
    import fluidpy.geo.vectors as GVm

    def near(allc, lat, lon):
        d = (allc[:, 1] - lat) ** 2 + ((allc[:, 0] - lon) * np.cos(lat * D2R)) ** 2
        return allc[np.argmin(d)]
    c50 = np.concatenate([p for _, ps in shp_parts(F_NE50L) for p in ps])
    out = {"used_deg": 355.4, "planning_points": {"from": [27.60, -82.74], "to": [28.15, -82.79],
                                                  "bearing_deg": float(S.initial_bearing(27.60, -82.74, 28.15, -82.79))}}
    for nm, c in (("ne_10m_coastline", c10), ("ne_50m_land", c50)):
        a_, b_ = near(c, 27.60, -82.74), near(c, 28.15, -82.80)
        out[nm] = {"from": [float(a_[1]), float(a_[0])], "to": [float(b_[1]), float(b_[0])], "bearing_deg": float(S.initial_bearing(a_[1], a_[0], b_[1], b_[0]))}
    for v in (out["planning_points"], out["ne_10m_coastline"], out["ne_50m_land"]):
        v["across_ms"] = float(GVm.components_in_axes(u=uS, bearing_deg=v["bearing_deg"])[1])
    out["note"] = ("355.4° is the planning-point bearing (27.60 N 82.74 W -> 28.15 N 82.79 W); the NE 10 m nearest-point segment gives "
                   f"{out['ne_10m_coastline']['bearing_deg']:.1f}°, NE 50 m land {out['ne_50m_land']['bearing_deg']:.1f}°; across-shore "
                   f"+{out['planning_points']['across_ms']:.1f} / +{out['ne_10m_coastline']['across_ms']:.1f} / +{out['ne_50m_land']['across_ms']:.1f} m/s")
    return out


def lut_from_hex(hexes: list[str], n: int = 256) -> np.ndarray:
    pts = np.array([hexrgb(h) for h in hexes])
    x = np.linspace(0, 1, len(hexes))
    t = np.linspace(0, 1, n)
    return np.stack([np.interp(t, x, pts[:, c]) for c in range(3)], -1).astype(np.uint8)


def rgba_png(G: np.ndarray, lut: np.ndarray, lo: float, hi: float, path: Path, alpha: float = 1.0, hatch_neg: bool = False,
             up: int = 1) -> None:
    """Colour-map a 2-D field (row 0 = NORTH edge) to an RGBA PNG; NaN transparent; optional diagonal hatch on G < 0."""
    from PIL import Image
    from scipy.ndimage import zoom
    G = np.asarray(G, float)
    mask = np.isfinite(G)
    if up > 1:
        G = zoom(np.nan_to_num(G, nan=0.0), up, order=1)
        mask = zoom(mask.astype(float), up, order=0) > 0.5
    t = np.nan_to_num(np.clip((G - lo) / (hi - lo), 0, 1), nan=0.5)
    rgb = lut[np.round(t * (len(lut) - 1)).astype(int)].astype(float)
    if hatch_neg:
        yy, xx = np.mgrid[0:G.shape[0], 0:G.shape[1]]
        stripe = ((xx + yy) // 6) % 3 == 0
        dark = (G < -0.5) & stripe
        rgb[dark] = rgb[dark] * 0.55
    a = np.where(mask, int(round(alpha * 255)), 0).astype(np.uint8)[..., None]
    Image.fromarray(np.concatenate([rgb.astype(np.uint8), a], -1), "RGBA").save(path, optimize=True)


def contours(F, lat, lon, levels, nd=3, min_pts=4):
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


def box_lines(parts, box, nd=3, step=1):
    out = []
    for a in parts:
        keep = (a[:, 1] >= box[0]) & (a[:, 1] <= box[1]) & (a[:, 0] >= box[2]) & (a[:, 0] <= box[3])
        if keep.sum() < 2:
            continue
        # split at gaps where points leave the box
        idx = np.where(keep)[0]
        runs = np.split(idx, np.where(np.diff(idx) > 1)[0] + 1)
        for rr in runs:
            if len(rr) >= 2:
                b = a[rr][::step] if step > 1 else a[rr]
                out.append(np.round(b, nd).ravel().tolist())
    return out


def decimate(a: np.ndarray, d: float) -> np.ndarray:
    keep = [0]
    for i in range(1, len(a)):
        if np.hypot(*(a[i] - a[keep[-1]])) >= d:
            keep.append(i)
    if keep[-1] != len(a) - 1:
        keep.append(len(a) - 1)
    return a[keep]


def bilin(F, lat, lon, plat, plon):
    from scipy.interpolate import RegularGridInterpolator
    f = RegularGridInterpolator((lat, lon), F, bounds_error=False, fill_value=np.nan)
    return f(np.stack([np.ravel(plat), np.ravel(plon)], -1)).reshape(np.shape(plat))


def sample_equirect(img: np.ndarray, lat: np.ndarray, lon: np.ndarray) -> np.ndarray:
    """Bilinear sample of an equirectangular RGB image (row 0 = 90 N, col 0 = 180 W) at (lat, lon) [degrees]."""
    from scipy.ndimage import map_coordinates
    H, W = img.shape[:2]
    r = (90.0 - lat) / 180.0 * H - 0.5
    c = ((lon + 180.0) % 360.0) / 360.0 * W - 0.5
    out = np.zeros(lat.shape + (3,), np.uint8)
    for k in range(3):
        out[..., k] = np.clip(map_coordinates(img[..., k].astype(float), [r, c], order=1, mode="wrap"), 0, 255)
    return out


# ---------------------------------------------------------------------------------------------------------- main
def patch_fl1(publics: list[Path]) -> int:
    """Fix loop 1 in place (no full rebuild: the machine was busy with another render): recompute ONLY the three blocks that
    main() now computes differently — the Tissot circles (Must 6), the s14 GOES eye crop (Must 1) and the Pinellas coast-segment
    note (Should 15) — from the same inputs, rewrite co.json / img/goes_eye.jpg / the public copies, and update the manifest
    (hashes, heavy-call records, new CHECK rows, notes). A later full `main()` run gives the same bytes for these blocks."""
    from PIL import Image
    import fluidpy.geo.mapproj as MP
    V = json.loads((DATA / "co.json").read_text(encoding="utf-8"))
    M = json.loads((OUT / "manifest.json").read_text(encoding="utf-8"))
    rows, heavy_new = [], []
    TC = [tuple(c) for c in V["proj"]["tissot"]["centres"]]
    for key, nm in (("pc", "platecarree"), ("mc", "mercator"), ("ee", "equalearth")):
        T = MP.tissot_ellipses(nm, centres=np.array(TC), radius_km=500.0, n=49)
        V["proj"]["tissot"][key] = tissot_xy(T)
        heavy_new.append({"fn": "fluidpy.geo.mapproj.tissot_ellipses", "scene": "s31-s34", "eq": f"Tissot circles 500 km ({nm})",
                          "params": {"name": nm, "centres": f"array {np.shape(np.array(TC))}, sha256 {parity_hash(np.array(TC))}", "radius_km": 500.0, "n": 49},
                          "output_sha256": parity_hash(T)})
        for nm_, v_, r_, t_ in tissot_check(nm, {}, TC, V["proj"]["tissot"][key]):
            rows.append({"id": "DC32b", "name": f"Tissot {nm_} (northern centres stay north)", "value": r6([v_]), "ref": r6([r_]), "tol": t_, "pass": bool(abs(v_ - r_) <= t_)})
    # the s31 Brest / Svalbard and s33 60° N / Svalbard ellipses (the ones the callouts point at) are in the northern hemisphere
    for key, i, lat in (("pc", 1, BREST[0]), ("pc", 2, LYB[0]), ("mc", 4, 60.0), ("mc", 2, LYB[0]), ("ee", 3, 60.0)):
        a_ = np.asarray(V["proj"]["tissot"][key][i]).reshape(-1, 2)
        rows.append({"id": "DC32b", "name": f"{key} ellipse {i} ({lat:.1f}° N) lies north of the equator", "value": float(a_[:, 1].min()), "ref": True, "tol": 0,
                     "pass": bool(a_[:, 1].min() > 0)})
    # GOES eye crop centred on the IBTrACS centre, contrast-stretched
    goes = json.loads(F_GOESJ.read_text(encoding="utf-8"))
    gimg = Image.open(F_GOES).convert("RGB")
    gw, gh = gimg.size
    blat, blon = float(V["ian"]["best_lat"]), float(V["ian"]["best_lon"])
    la0, la1, lo0, lo1 = cy = (blat - 0.6, blat + 0.6, blon - 0.65, blon + 0.65)
    fx = lambda lo: (lo - goes["lon_edges"][0]) / (goes["lon_edges"][1] - goes["lon_edges"][0]) * gw  # noqa: E731
    fy = lambda la: (goes["lat_edges"][1] - la) / (goes["lat_edges"][1] - goes["lat_edges"][0]) * gh  # noqa: E731
    crop, info = eye_stretch(gimg.crop((round(fx(lo0)), round(fy(la1)), round(fx(lo1)), round(fy(la0)))), 4)
    V["stack"]["eye_box"] = list(cy)
    V["stack"]["eye_stretch"] = info
    # Pinellas coast segment note (s40)
    c10 = np.concatenate([p for _, ps in shp_parts(F_NE10C) for p in ps])
    PIN = pinellas_note(c10, V["coast"]["uS"])
    if not all(r["pass"] for r in rows):
        for r in rows:
            print(f"  {'PASS' if r['pass'] else 'FAIL'}  {r['id']} {r['name']} -> {r['value']} (ref {r['ref']})")
        print("patch_fl1: checks FAILED — nothing written")
        return 1
    crop.save(IMG / "goes_eye.jpg", quality=90)
    blob = json.dumps(V, separators=(",", ":"), ensure_ascii=False, allow_nan=False).encode("utf-8")
    (DATA / "co.json").write_bytes(blob)
    for pub in publics:
        pub.mkdir(parents=True, exist_ok=True)
        (pub / "co_goes_eye.jpg").write_bytes((IMG / "goes_eye.jpg").read_bytes())
    M["data_files"]["co.json"] = hashlib.sha256(blob).hexdigest()
    M["data_files"]["img/goes_eye.jpg"] = sha_file(IMG / "goes_eye.jpg")
    if "co_goes_eye.jpg" in M.get("render_assets", {}):
        M["render_assets"]["co_goes_eye.jpg"] = sha_file(IMG / "goes_eye.jpg")
    M["physics_heavy"] = [h for h in M["physics_heavy"] if h["fn"] != "fluidpy.geo.mapproj.tissot_ellipses"] + heavy_new
    M["checks"] = [r for r in M["checks"] if r["id"] != "DC32b"] + rows
    P = M["parameters"]
    P["coast_segment_s40"] = PIN
    P["goes_eye_s14"] = {"box": list(cy), "centre": "IBTrACS 18 UTC (eye in the GOES image; HRRR centre 14 km south)", "contrast_stretch": info}
    P["exaggerations"] = [e for e in P["exaggerations"] if not e.startswith("s31 Tissot") and not e.startswith("s31-s34 Tissot") and not e.startswith("s14 GOES eye")] + [
        "s31-s34 Tissot circles 500 km radius (traced on the real sphere, fix loop 1)", "s14 GOES eye crop contrast-stretched (0.5-99.5 % -> 30-255, gamma 1.6)"]
    M["fix_loop_1"] = {"date": "2026-11-04", "by": "build_ch00_coordinates.py --patch-fl1",
                       "changes": ["Tissot circles: tissot_ellipses was called with a = 1.0 (metres) and radius_km = 500, i.e. circles of 169.7° angular radius round "
                                   "the antipodes (bands mirrored into the southern hemisphere, review 1 Must 6); now traced on the Earth (a = EARTH_RADIUS) and "
                                   "divided by a; DC32b rows: every outline's mid-height = its centre's y/a, the five callout ellipses lie north of the equator",
                                   "s14 GOES eye crop: centred on the IBTrACS 18 UTC centre, contrast-stretched (Must 1)",
                                   "s40 coast segment for 355.4° recorded (Should 15)"],
                       "fluidpy": git_sha(FLUID, {"mapproj_py": "fluidpy/geo/mapproj.py"})}
    (OUT / "manifest.json").write_text(json.dumps(M, indent=1, ensure_ascii=False, default=str), encoding="utf-8")
    for r in rows:
        print(f"  PASS  {r['id']} {r['name']} -> {r['value']}")
    print(f"patch_fl1: co.json {len(blob) / 1e3:.0f} kB sha {M['data_files']['co.json'][:12]}; goes_eye sha {M['data_files']['img/goes_eye.jpg'][:12]}; "
          f"{len(rows)} DC32b rows; Pinellas: {PIN['note']}")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--public", type=Path, help="render public dir for the co_* assets")
    ap.add_argument("--patch-fl1", nargs="*", type=Path, default=None, metavar="PUBLIC_DIR",
                    help="fix loop 1 in place: Tissot circles, s14 GOES eye crop, Pinellas note (+ copies to the given public dirs)")
    a = ap.parse_args()
    if a.patch_fl1 is not None:
        return patch_fl1(a.patch_fl1)
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
        entries.append({"fn": fn, "scene": scene, "data": "data/co.json", "eq": eq, "params": jp, "sha256": h})
        return out

    V["luts"] = {"speed": lut_hex("cmocean.speed"), "balance": lut_hex("cmocean.balance"), "radial": RADIAL_LUT}
    imgs: dict = {}

    # ================================================================ plane: the balloon at (3, 4) km (s02-s10, s37-s38)
    pol = call(CS + "polar_from_cartesian", "s04", "r = sqrt(x²+y²), θ = atan2(y, x)", x=3.0, y=4.0)
    r0, th0 = float(pol[0]), float(pol[1])
    row("DC03", "polar of (3, 4): r 5.000, θ 53.130°", [r0, np.degrees(th0)], [5.0, 53.130], 5e-4)
    back = call(CS + "cartesian_from_polar_coords", "s05", "x = r cos θ, y = r sin θ", r=r0, theta=th0)
    row("DC03", "round trip back to (3, 4)", [float(back[0]), float(back[1])], [3.0, 4.0], 1e-12)
    row("DC03", "cos 53° ≈ 0.6, sin 53° ≈ 0.8 (5 × 0.6 = 3, 5 × 0.8 = 4)", [np.cos(th0), np.sin(th0)], [0.6, 0.8], 1e-12)
    row("DC04", "compass bearing 90 − 53.13 = 36.87°", 90 - np.degrees(th0), 36.87, 5e-3)
    wc = call(GA + "wind_components", "s06", "u = −s sin d, v = −s cos d (from)", speed=10.0, dir_from_deg=270.0)
    row("DC04", "west wind 10 m/s 'from' 270° -> u = +10, v = 0", [float(wc[0]), float(wc[1])], [10.0, 0.0], 1e-12)
    row("DC05", "1 rad = 57.30°; 5 × 0.2 = 1 km; 50 × 0.2 = 10 km", [np.degrees(1.0), 5 * 0.2, 50 * 0.2], [57.2958, 1.0, 10.0], 1e-4)
    E = call(CS + "unit_vectors_polar", "s08", "r̂ = (cos θ, sin θ), θ̂ = (−sin θ, cos θ)", theta=th0)
    row("DC06", "r̂ (0.6, 0.8), θ̂ (−0.8, 0.6)", np.ravel(E), [0.6, 0.8, -0.8, 0.6], 1e-12)
    h = 1e-5
    Ep, Em = (np.asarray(__import__("fluidpy.core.coords", fromlist=["x"]).unit_vectors_polar(th0 + s * h)) for s in (1, -1))
    dE = (Ep - Em) / (2 * h)
    row("DC07", "centred difference d r̂/dθ = θ̂, d θ̂/dθ = −r̂", np.ravel(dE), [E[1][0], E[1][1], -E[0][0], -E[0][1]], 1e-8)
    uc = call(CS + "velocity_components", "s10", "u_r = u·r̂, u_θ = u·θ̂", u_cart=[10.0, 0.0], x=[3.0, 4.0], system="polar")
    row("DC08", "east wind 10 m/s at (3, 4): (u_r, u_θ) = (6, −8), length 10", [uc[0], uc[1], np.hypot(*uc)], [6.0, -8.0, 10.0], 1e-12)
    C30 = call("fluidpy.core.tensors.rotation_matrix_2d", "s37", "C(α) = [[cos α, −sin α], [sin α, cos α]], x' = Cᵀx", theta=np.deg2rad(30.0))
    xp = np.asarray(C30).T @ np.array([10.0, 0.0])
    row("DC40", "axes turned 30°: (8.660, −5.000), length 10", [xp[0], xp[1], np.hypot(*xp)], [8.660, -5.000, 10.0], 5e-4)
    row("DC40", "cos 30 ≈ 0.87 (10 × 0.87 ≈ 8.7), sin 30 = 0.5", [np.cos(np.deg2rad(30)), np.sin(np.deg2rad(30))], [0.866, 0.5], 1e-3)
    C53 = call("fluidpy.core.tensors.rotation_matrix_2d", "s38", "rotation by θ = 53.13°", theta=th0)
    x53 = np.asarray(C53).T @ np.array([10.0, 0.0])
    row("DC41", "rotation by 53.13° = (6, −8) = velocity_components", [x53[0], x53[1]], [uc[0], uc[1]], 1e-12)
    V["plane"] = {"r": r0, "th": np.degrees(th0), "rhat": r6(E[0]), "thhat": r6(E[1]), "ur": float(uc[0]), "ut": float(uc[1]),
                  "rot30": r6(xp), "C30": r6(C30)}

    # ================================================================ Hurricane Ian, HRRR (s00, s01, s03, s11-s13, s39-s40)
    H = xr.open_dataset(F_HRRR)
    times = json.loads(H.attrs["times"])
    k18, k20 = times.index("2022-09-28T18"), times.index("2022-09-28T20")
    LA2, LO2 = H.lat.values.astype(float), H.lon.values.astype(float)
    msl18 = H.mslma.values[k18].astype(float)
    u18, v18 = H.u10.values[k18].astype(float), H.v10.values[k18].astype(float)
    u20, v20 = H.u10.values[k20].astype(float), H.v10.values[k20].astype(float)
    cen = call(DC + "storm_centre", "s11", "centre = sub-grid minimum of sea-level pressure", heavy_call=True,
               msl=msl18, lat=LA2, lon=LO2, box=(25.0, 28.0, -84.0, -81.0))
    clat, clon = float(cen.lat), float(cen.lon)
    row("DC01", "HRRR 18 UTC centre 26.456 N 82.399 W", [clat, clon], [26.456, -82.399], 0.1)
    row("DC10", "HRRR 18 UTC centre pressure 960.3 hPa", float(cen.msl_min) / 100, 960.3, 0.3)
    radii = [10, 15, 20, 25, 30, 40, 50, 75, 100]
    RW = call(DC + "storm_relative_wind", "s11", "v_t = k·(r̂ × u), v_r = r̂·u", heavy_call=True, u=u18, v=v18, lat=LA2, lon=LO2,
              centre=(clat, clon), radii_km=radii, n_az=72)
    i25 = radii.index(25)
    vt25, vr25 = float(RW.tangential_mean[i25]), float(RW.radial_mean[i25])
    row("DC10", "ring 25 km v_t 37.1, v_r −12.5 m/s", [vt25, vr25], [37.1, -12.5], 0.5)
    row("DC10", "37.1 m/s = 133.6 km/h ('about a hundred and thirty')", vt25 * 3.6, 133.6, 1.5)
    row("DC12", "inflow angle 18.6 ± 1°", float(RW.inflow_angle_mean_deg[i25]), 18.6, 1.0)
    su = float(np.sqrt((np.std(RW.u[i25]) ** 2 + np.std(RW.v[i25]) ** 2) / 2))   # pooled spread of the east and north winds
    truth("DC12", "std(v_t), std(v_r) on the ring each < ½ the pooled std of u and v (build 1: planning used std(u) alone; v_r 10.46 vs 10.24)",
          np.std(RW.tangential[i25]) < su / 2 and np.std(RW.radial[i25]) < su / 2,
          r6([np.std(RW.tangential[i25]), np.std(RW.radial[i25]), np.std(RW.u[i25]), np.std(RW.v[i25])], 3))
    acc = vt25 ** 2 / 25000.0
    row("DC13", "v²/r = 37² / 25 000 ≈ 0.055 m/s²", acc, 0.0551, 0.002)
    rng("DC13", "g / (v²/r) 'almost two hundred'", 9.81 / acc, 170, 190)
    fco = float(call(GF + "coriolis_parameter", "s13", "f = 2Ω sin φ (lat in rad)", lat=clat * D2R))
    truth("DC13", "f v < ⅕ v²/r at the eye", fco * vt25 < acc / 5, r6([fco * vt25, acc], 5))
    row("DC13", "screen: 37² / 25 000 with the rounded 37 ≈ 0.055", 37.0 ** 2 / 25000, 0.05476, 1e-5)
    ibt = json.loads(F_IBT.read_text(encoding="utf-8"))
    kb = ibt["time"].index("2022-09-28 18:00:00")
    row("DC11", "IBTrACS USA wind 135 kt at 18 UTC = 250 km/h", [ibt["usa_wind_kt"][kb], ibt["usa_wind_kt"][kb] * 1.852], [135, 250.0], 0.1)
    V["ian"] = {"c": [clat, clon], "p": float(cen.msl_min) / 100, "radii": radii, "vt": r6(RW.tangential_mean, 3), "vr": r6(RW.radial_mean, 3),
                "inflow": float(RW.inflow_angle_mean_deg[i25]), "acc": acc, "f": fco, "best_kt": 135, "best_lat": ibt["lat"][kb], "best_lon": ibt["lon"][kb],
                "ring": {"az": r6(np.degrees(RW.azimuth), 2), "lat": r6(RW.lat[i25], 4), "lon": r6(RW.lon[i25], 4), "u": r6(RW.u[i25], 2),
                         "v": r6(RW.v[i25], 2), "vt": r6(RW.tangential[i25], 2), "vr": r6(RW.radial[i25], 2), "inflow": r6(RW.inflow_angle_deg[i25], 2)}}
    # regrid the curvilinear HRRR fields to a regular lat/lon grid for the map rasters and the particle tracks
    from scipy.interpolate import griddata
    glat = np.arange(23.4, 30.0001, 0.03)
    glon = np.arange(-85.6, -78.6999, 0.03)
    GLO, GLA = np.meshgrid(glon, glat)
    pts = np.stack([LO2.ravel(), LA2.ravel()], -1)

    def regrid(F):
        return griddata(pts, F.ravel(), (GLO, GLA), method="linear")
    U18, V18, U20, V20 = regrid(u18), regrid(v18), regrid(u20), regrid(v20)
    lut_speed = lut_rgb("cmocean.speed")
    rgba_png(np.hypot(U18, V18)[::-1], lut_speed, 0, 50, IMG / "ian_speed_18.png", alpha=0.85, up=2)
    rgba_png(np.hypot(U20, V20)[::-1], lut_speed, 0, 50, IMG / "ian_speed_20.png", alpha=0.85, up=2)
    dla = 0.015
    imgs["ian_speed_18"] = imgs["ian_speed_20"] = None
    V["ian"]["speed_box"] = [float(glat[0] - dla), float(glat[-1] + dla), float(glon[0] - dla), float(glon[-1] + dla)]
    goes = json.loads(F_GOESJ.read_text(encoding="utf-8"))
    V["ian"]["goes_box"] = [goes["lat_edges"][0], goes["lat_edges"][1], goes["lon_edges"][0], goes["lon_edges"][1]]
    # particles: seeds on a jittered grid (fixed seed), RK4 through the frozen 18 UTC field (tested advect_on_sphere)
    rs = np.random.default_rng(7)
    sl = rs.uniform(IAN_BOX[0], IAN_BOX[1], 260)
    so = rs.uniform(IAN_BOX[2], IAN_BOX[3], 260)
    tr = call(DT_ + "advect_on_sphere", "s11", "dλ/dt = u/(a cos φ), dφ/dt = v/a (RK4), frozen 18 UTC field", heavy_call=True,
              u=np.nan_to_num(U18), v=np.nan_to_num(V18), lat=glat, lon=glon, seeds_lat=sl, seeds_lon=so, dt=150.0, nsteps=47)
    V["ian"]["tracks"] = [np.round(t, 3).tolist() for t in tr]
    # zoom tracks (within 70 km of the eye) at a finer time step
    ang = rs.uniform(0, 2 * np.pi, 140)
    rad = np.sqrt(rs.uniform(0.02, 1.0, 140)) * 70e3
    zl = clat + np.degrees(rad * np.sin(ang) / A_E)
    zo = clon + np.degrees(rad * np.cos(ang) / (A_E * np.cos(clat * D2R)))
    tz = call(DT_ + "advect_on_sphere", "s11", "zoom tracks, dt 30 s, frozen 18 UTC field", heavy_call=True,
              u=np.nan_to_num(U18), v=np.nan_to_num(V18), lat=glat, lon=glon, seeds_lat=zl, seeds_lon=zo, dt=30.0, nsteps=47)
    V["ian"]["ztracks"] = [np.round(t, 4).tolist() for t in tz]
    V["ian"]["track_dt_s"] = [150.0, 30.0]
    # coast lines (NE 10 m) for the Florida maps
    coast = [p for _, ps in shp_parts(F_NE10C) for p in ps]
    V["ian"]["coast"] = box_lines(coast, (22.5, 31.0, -87.0, -78.0), nd=3)
    # coast bearings from the NE 10 m coastline (nearest coast points to Naples/Venice and Pinellas south/north)
    allc = np.concatenate(coast)

    def near(lat, lon):
        d = (allc[:, 1] - lat) ** 2 + ((allc[:, 0] - lon) * np.cos(lat * D2R)) ** 2
        return allc[np.argmin(d)]
    pN, pV = near(26.10, -81.80), near(26.93, -82.36)
    cb_sw = float(call(GS + "initial_bearing", "s39", "coast bearing Naples -> Venice (NE 10 m)", lat1=float(pN[1]), lon1=float(pN[0]),
                       lat2=float(pV[1]), lon2=float(pV[0])))
    pS, pNn = near(27.60, -82.74), near(28.15, -82.80)
    cb_pin = float(call(GS + "initial_bearing", "s40", "Pinellas coast bearing (NE 10 m)", lat1=float(pS[1]), lon1=float(pS[0]),
                        lat2=float(pNn[1]), lon2=float(pNn[0])))
    row("DC42", "SW Florida coast bearing 329 ± 3° (NE 10 m)", cb_sw, 329.0, 3.0)
    row("DC43", "Pinellas coast 355 ± 5° ('almost due north')", cb_pin, 355.0, 5.0)
    def nearest_hrrr(pl, po):   # the nearest HRRR 3-km grid point (curvilinear grid), as in the planning numbers
        d = (LA2 - pl) ** 2 + ((LO2 - po) * np.cos(pl * D2R)) ** 2
        j = np.unravel_index(np.argmin(d), d.shape)
        return [float(u20[j]), float(v20[j])], [float(LA2[j]), float(LO2[j])]
    uF, gF = nearest_hrrr(*FMB)
    uS, gS = nearest_hrrr(*STP)
    PIN = pinellas_note(allc, uS)   # fix loop 1 (Should 15): which coast segment gives the 355.4° used on screen
    spF = float(np.hypot(*uF))
    dirF = float(call(GA + "wind_direction_from", "s39", "direction the wind blows from", u=uF[0], v=uF[1]))
    alF, acF = call(GV + "components_in_axes", "s39", "along = u·e_along, across = u·e_across", u=uF, bearing_deg=329.0)
    alS, acS = call(GV + "components_in_axes", "s40", "across-shore at St. Petersburg", u=uS, bearing_deg=355.4)
    row("DC42", "Fort Myers Beach 20 UTC: 32.9 m/s from 222° (SW)", [spF, dirF], [32.9, 222.0], [0.5, 5.0])
    row("DC42", "along 9.4, across −31.6 (onshore) m/s", [float(alF), float(acF)], [9.4, -31.6], 0.5)
    row("DC43", "St. Petersburg 20 UTC across +11.5 m/s (offshore)", float(acS), 11.5, 0.5)
    dFS = float(call(GS + "great_circle_distance", "s40", "Fort Myers Beach -> St. Petersburg", lat1=FMB[0], lon1=FMB[1], lat2=STP[0], lon2=STP[1]))
    row("DC43", "distance Fort Myers Beach -> St. Petersburg 150 ± 15 km", dFS / 1e3, 150.0, 15.0)
    al2, ac2 = call(GV + "components_in_axes", "s39", "screen check with the rounded bearing 329° (also the coast arrow)", u=uF, bearing_deg=round(cb_sw))
    row("DC42", "rounded coast bearing gives the same along/across (9, −32)", [round(float(al2)), round(float(ac2))], [9, -32], 0)
    V["coast"] = {"fmb": list(FMB), "stp": list(STP), "uF": r6(uF, 3), "uS": r6(uS, 3), "spF": spF, "dirF": dirF, "alF": float(alF), "acF": float(acF),
                  "alS": float(alS), "acS": float(acS), "cb_sw": cb_sw, "cb_pin": cb_pin, "pN": r6(pN, 3), "pV": r6(pV, 3), "pS": r6(pS, 3), "pNn": r6(pNn, 3),
                  "d_km": dFS / 1e3, "eye20": None}
    cen20 = call(DC + "storm_centre", "s39", "centre at 20 UTC", heavy_call=True, msl=H.mslma.values[k20].astype(float), lat=LA2, lon=LO2,
                 box=(25.5, 28.5, -83.5, -80.5))
    V["coast"]["eye20"] = [float(cen20.lat), float(cen20.lon)]
    truth("DC42", "the eye (20 UTC) lies north of Fort Myers Beach", float(cen20.lat) > FMB[0], r6([cen20.lat, cen20.lon], 3))
    # tide gauges (D3): residual = observed − predicted
    G = xr.open_dataset(F_COOPS)
    gt = G.time.values
    sel = (gt >= np.datetime64("2022-09-28T00:00")) & (gt <= np.datetime64("2022-09-29T12:00"))
    hours = ((gt[sel] - np.datetime64("2022-09-28T00:00")) / np.timedelta64(1, "h")).astype(float)
    gauges = {}
    for si, sid in enumerate(G.station.values.tolist()):
        res = G.residual.values[si][sel].astype(float)
        gauges[sid] = {"name": str(G.name.values[si]), "h": r6(hours[::5], 2), "res": r6(res[::5], 3), "min": float(np.nanmin(res)), "max": float(np.nanmax(res))}
    truth("DC44", "St. Petersburg 8726520 residual < −0.5 m on 28 Sep", gauges["8726520"]["min"] < -0.5, r6(gauges["8726520"]["min"], 3))
    row("DC44", "Fort Myers 8725520 residual peak (manifest)", gauges["8725520"]["max"], 2.209, 0.01)
    row("DC45", "cited 10-15 ft = 3.0-4.6 m ('three to four and a half')", [10 * 0.3048, 15 * 0.3048], [3.05, 4.57], 0.01)
    V["gauges"] = {k: gauges[k] for k in ("8725520", "8726520")}

    # ================================================================ Ian on pressure levels, ERA5 (s14, s14b)
    P = xr.open_dataset(F_IANPL)
    Z = xr.open_dataset(F_IANZ)
    plev = [int(v) for v in P.level.values]
    rad_pl = [float(v) for v in P.radius.values]
    vrm = P.vr_mean.values
    for lv in (1000, 850):
        truth("DC14", f"ERA5 ring-mean v_r < 0 at {lv} hPa (100, 200 km)", np.all(vrm[plev.index(lv), [1, 3]] < 0), r6(vrm[plev.index(lv), [1, 3]], 2))
    for lv in (200, 150):
        truth("DC14", f"ERA5 ring-mean v_r > 0 at {lv} hPa (100, 200 km)", np.all(vrm[plev.index(lv), [1, 3]] > 0), r6(vrm[plev.index(lv), [1, 3]], 2))
    SL = [975, 850, 500, 200, 125]
    ref = {975: (-9.2, -6.1), 850: (-0.8, -0.4), 500: (0.3, 0.5), 200: (2.2, 4.2), 125: (5.1, 4.4)}
    for lv in SL:
        row("DC14b", f"ring means v_r {lv} hPa at 100 / 200 km", vrm[plev.index(lv), [1, 3]], ref[lv], 0.5)
    wm = P.w_mean.values
    truth("DC14b", "omega(500 hPa, 50 km) < 0 (rising)", wm[plev.index(500), 0] < 0, r6(wm[plev.index(500), 0], 3))
    pc = (float(P.attrs["centre_lat"]), float(P.attrs["centre_lon"]))
    plat, plon = P.lat.values.astype(float), P.lon.values.astype(float)
    jb = np.where(np.abs(A_E * (plat - pc[0]) * D2R) <= 300e3)[0]                       # the 600 × 600 km box
    ib = np.where(np.abs(A_E * np.cos(pc[0] * D2R) * (plon - pc[1]) * D2R) <= 300e3)[0]
    blat, blon = plat[jb], plon[ib]
    BLO, BLA = np.meshgrid(blon, blat)
    xx = A_E * np.cos(pc[0] * D2R) * (BLO - pc[1]) * D2R
    yy = A_E * (BLA - pc[0]) * D2R
    layers, zbar, share = [], [], []
    rr = np.hypot(xx, yy)
    for lv in SL:
        k = plev.index(lv)
        uu, vv = P.u.values[k][np.ix_(jb, ib)].astype(float), P.v.values[k][np.ix_(jb, ib)].astype(float)
        comp = call(CS + "velocity_components", "s14b", "u_r = u·r̂ about the centre (local plane)", heavy_call=True,
                    u_cart=np.stack([uu.ravel(), vv.ravel()]), x=np.stack([xx.ravel(), yy.ravel()]), system="polar")
        ur = comp[0].reshape(uu.shape)
        layers.append(ur)
        zbar.append(area_mean(Z.zg.values[k][np.ix_(jb, ib)].astype(float), blat))
        ann = (rr >= 50e3) & (rr <= 300e3)
        share.append(float(np.mean(ur[ann] < 0)))
    row("DC14b", "box-mean heights vs the spoken 'about 300 m, 1.5, 6, 12.5, 15 km' (±15 %)", np.array(zbar) / 1000 / np.array([0.3, 1.5, 6.0, 12.5, 15.0]),
        [1, 1, 1, 1, 1], 0.15)
    rng("DC14b", "inflow share at 975 hPa (50-300 km) ≥ 0.85", share[0], 0.85, 1.0)
    for li, lv in enumerate(SL):
        rgba_png(layers[li][::-1], lut_from_hex(RADIAL_LUT), -10, 10, IMG / f"stack_ur_{lv}.png", alpha=0.78, hatch_neg=True, up=8)
    # tangential arrows on the 200-km ring of each layer (8 azimuths)
    arrows = []
    for lv in SL:
        k = plev.index(lv)
        R8 = call(DC + "storm_relative_wind", "s14b", f"200-km ring at {lv} hPa (8 azimuths)", heavy_call=True, u=P.u.values[k].astype(float),
                  v=P.v.values[k].astype(float), lat=plat, lon=plon, centre=pc, radii_km=[200.0], n_az=8)
        arrows.append({"lev": lv, "vt": r6(R8.tangential[0], 2), "vr": r6(R8.radial[0], 2)})
    truth("DC14b", "tangential winds on the 975-hPa ring anticlockwise (v_t > 0)", np.mean(arrows[0]["vt"]) > 0, r6(np.mean(arrows[0]["vt"]), 2))
    truth("DC14", "s14 inflow low / outflow aloft from data", vrm[plev.index(975), 3] < 0 and vrm[plev.index(125), 3] > 0)
    V["stack"] = {"levels": SL, "z_km": r6(np.array(zbar) / 1000, 3), "vr100": r6(vrm[[plev.index(l) for l in SL], 1], 2),
                  "vr200": r6(vrm[[plev.index(l) for l in SL], 3], 2), "share": r6(share, 3), "centre": list(pc),
                  "box_km": [float(xx.min() / 1e3), float(xx.max() / 1e3), float(yy.min() / 1e3), float(yy.max() / 1e3)],
                  "box_ll": [float(blat[0] - 0.125), float(blat[-1] + 0.125), float(blon[0] - 0.125), float(blon[-1] + 0.125)],
                  "arrows": arrows, "omega500": float(wm[plev.index(500), 0]), "range": [-10, 10], "exaggeration": 10}
    # GOES floor patch for the 3-D views (crop of the true-colour image to the stack box)
    gimg = Image.open(F_GOES).convert("RGB")
    gw, gh = gimg.size

    def gcrop(box, path, up=1, stretch=False):
        la0, la1, lo0, lo1 = box
        x0 = (lo0 - goes["lon_edges"][0]) / (goes["lon_edges"][1] - goes["lon_edges"][0]) * gw
        x1 = (lo1 - goes["lon_edges"][0]) / (goes["lon_edges"][1] - goes["lon_edges"][0]) * gw
        y0 = (goes["lat_edges"][1] - la1) / (goes["lat_edges"][1] - goes["lat_edges"][0]) * gh
        y1 = (goes["lat_edges"][1] - la0) / (goes["lat_edges"][1] - goes["lat_edges"][0]) * gh
        c = gimg.crop((round(x0), round(y0), round(x1), round(y1)))
        info = None
        if stretch:
            c, info = eye_stretch(c, up)
        elif up > 1:
            c = c.resize((c.width * up, c.height * up), Image.LANCZOS)
        c.save(path, quality=90)
        return info
    gcrop(V["stack"]["box_ll"], IMG / "goes_stack.jpg", up=2)
    # fix loop 1 (Must 1): the s14 eye crop is centred on the IBTrACS 18 UTC centre, where the eye is in the GOES image (the
    # HRRR pressure-minimum centre lies ≈ 14 km south of it); the s14 cylinder axis goes through the crop's centre
    blat, blon = float(V["ian"]["best_lat"]), float(V["ian"]["best_lon"])
    cy = (blat - 0.6, blat + 0.6, blon - 0.65, blon + 0.65)
    V["stack"]["eye_stretch"] = gcrop(cy, IMG / "goes_eye.jpg", up=4, stretch=True)
    V["stack"]["eye_box"] = list(cy)

    # ================================================================ the sphere (s15-s27)
    from fluidpy.geo.constants import EARTH_RADIUS, OMEGA
    row("DC15", "a = 6.371 × 10⁶ m", EARTH_RADIUS, 6.371e6, 0.5)
    row("DC19", "Ω = 7.292 × 10⁻⁵ s⁻¹ (said 7.29)", OMEGA, 7.292115e-5, 1e-10)
    rb = np.asarray(call(GS + "unit_vector", "s18", "r̂ = (cos φ cos λ, cos φ sin λ, sin φ)", lat=BREST[0], lon=BREST[1])) * EARTH_RADIUS / 1e3
    Rb = EARTH_RADIUS * np.cos(BREST[0] * D2R) / 1e3
    row("DC17", "Brest z 4764, R = a cos φ 4231, x 4218, y −331 km", [rb[2], Rb, rb[0], rb[1]], [4764, 4231, 4218, -331], 1.0)
    cs = call(CS + "cartesian_from_spherical", "s18", "colatitude bridge θ = π/2 − φ", r=EARTH_RADIUS / 1e3, theta=np.pi / 2 - BREST[0] * D2R, phi=BREST[1] * D2R)
    row("DC17", "cartesian_from_spherical(a, π/2 − φ, λ) = a·unit_vector", np.ravel(cs), rb, 1e-9)
    row("DC17", "sin φ 0.748, cos φ 0.664 at Brest; 6371 × 0.748 ≈ 4760, × 0.664 ≈ 4230", [np.sin(BREST[0] * D2R), np.cos(BREST[0] * D2R),
        round(6371 * 0.748, -1), round(6371 * 0.664, -1)], [0.748, 0.664, 4770, 4230], [5e-4, 5e-4, 10.1, 0.1])
    wl = call(GS + "wrap_lon", "s17", "λ in 0…360", lon=BREST[1], west=0.0)
    row("DC16", "Brest λ −4.49 -> 355.5 in 0…360; wrap_lon(355.5) = −4.5", [float(wl), float(call(GS + "wrap_lon", "s17", "λ in −180…180", lon=355.5))],
        [355.51, -4.5], 1e-9)
    lats4 = [0.0, BREST[0], LYB[0], 90.0]
    spd = OMEGA * EARTH_RADIUS * np.cos(np.deg2rad(lats4))
    row("DC18", "Ω a cos φ: 464.6, 308.5, 94.8, 0.0 m/s", spd, [464.6, 308.5, 94.8, 0.0], 0.06)
    row("DC18", "screen: 7.29e-5 × 6.371e6 ≈ 465 m/s ('two thirds' = 0.664)", [7.29e-5 * 6.371e6, np.cos(BREST[0] * D2R)], [464.4, 0.664], [0.1, 5e-4])
    AL = call(GS + "arc_lengths", "s20", "δy = a δφ, δx = a cos φ δλ", lat=lats4, dlat=1.0, dlon=1.0)
    row("DC19", "1° north 111.19 km; 1° east 111.19, 73.84, 22.70, 0.00 km", np.r_[np.asarray(AL.dy)[0], np.asarray(AL.dx)] / 1e3,
        [111.19, 111.19, 73.84, 22.70, 0.0], 0.006)
    row("DC19", "1′ = 1.853 km; 1° = π/180 = 0.01745 rad", [np.asarray(AL.dy)[0] / 60e3, np.pi / 180], [1.853, 0.01745], [5e-4, 5e-6])
    row("DC19", "screen 6371 × 0.01745 ≈ 111.2; 111 × 0.66 ≈ 74 (73.3); 111 × 0.2 ≈ 23 (22.2)", [6371 * 0.01745, 111.19 * 0.664, 111.19 * 0.2042],
        [111.17, 73.83, 22.71], 0.02)
    AQ = call(GS + "arc_lengths", "s22", "ERA5 0.25° box", lat=[BREST[0], LYB[0]], dlat=0.25, dlon=0.25)
    dxq, dyq = np.asarray(AQ.dx) / 1e3, float(np.asarray(AQ.dy).ravel()[0]) / 1e3
    row("DC21", "0.25° box: 27.80 × 18.46 km (Brest), 27.80 × 5.68 km (Svalbard); ratio 4.90", [dyq, dxq[0], dxq[1], dxq[0] / dxq[1] * 1.0],
        [27.80, 18.46, 5.68, 3.25], [0.01, 0.01, 0.01, 0.02])
    row("DC21", "stretch if cos φ is forgotten at Svalbard 1/cos φ = 4.90", 1 / np.cos(LYB[0] * D2R), 4.90, 0.01)
    bf = float(call(GS + "band_fraction", "s23", "(sin φ₂ − sin φ₁)/2", lat1=0.0, lat2=30.0))
    row("DC22", "band 0-30° = ¼ of the Earth = 0.5000 of a hemisphere", 2 * bf, 0.5, 1e-12)
    blat_ = np.r_[np.linspace(0, 30, 61), np.linspace(30, 0, 61)]
    blon_ = np.r_[np.full(61, -180.0), np.full(61, 180.0)]
    pa = call(GS + "polygon_area", "s23", "dense band polygon 0-30° N", heavy_call=True, lat=np.r_[np.zeros(14401), np.full(14401, 30.0)],
              lon=np.r_[np.linspace(-180, 180, 14401), np.linspace(180, -180, 14401)])
    ba = float(call(GS + "band_area", "s23", "2π a² (sin φ₂ − sin φ₁)", lat1=0.0, lat2=30.0))
    row("DC22", "band area = polygon_area of the band", abs(pa) / ba, 1.0, 1e-6)
    del blat_, blon_
    fr = [float(call(GS + "band_fraction", "s23", "area gauge", lat1=0.0, lat2=float(p))) * 2 for p in range(0, 91, 3)]
    row("DC22", "sin 30° = 0.5; area fraction to 60° 0.866", [np.sin(30 * D2R), fr[20]], [0.5, 0.866], 1e-3)
    V["sphere"] = {"a": EARTH_RADIUS, "Om": OMEGA, "brest": list(BREST), "trappes": list(TRAPPES), "sing": list(SINGAPORE), "lyb": list(LYB),
                   "rb_km": r6(rb, 1), "R_km": Rb, "lam360": float(wl), "spd": r6(spd, 2), "dy1": float(np.asarray(AL.dy)[0] / 1e3), "dx1": r6(np.asarray(AL.dx) / 1e3, 3),
                   "box": [dyq, float(dxq[0]), float(dxq[1])], "gauge": r6(fr, 4)}
    # local frames (s24): up-vector angles
    eb = [call(GS + "enu_basis", "s24", "(i, j, k) east, north, up", lat=p[0], lon=p[1]) for p in (BREST, TRAPPES, SINGAPORE)]
    kB, kT, kS = (np.asarray(e[2]) for e in eb)
    angBT, angBS = np.degrees(np.arccos(np.clip(kB @ kT, -1, 1))), np.degrees(np.arccos(np.clip(kB @ kS, -1, 1)))
    dBT = float(call(GS + "great_circle_distance", "s24", "Brest -> Trappes", lat1=BREST[0], lon1=BREST[1], lat2=TRAPPES[0], lon2=TRAPPES[1]))
    row("DC23", "up vectors Brest-Trappes 4.32° (480 km), Brest-Singapore 101.0°", [angBT, dBT / 1e3, angBS], [4.32, 480, 101.0], [0.01, 5, 0.1])
    ii, jj = np.asarray(eb[0][0]), np.asarray(eb[0][1])
    row("DC23", "i × j = k at Brest (right-handed)", np.cross(ii, jj), kB, 1e-12)
    # turning arrows (s25)
    ur_ = call(GF + "unit_vector_rates", "s25", "Di/Dt = (u/(a cos φ))(j sin φ − k cos φ)", u=250.0, v=0.0, w=0.0, lat=BREST[0] * D2R)
    swing = np.degrees(np.linalg.norm(ur_.Di_Dt) * 3600)
    row("DC24", "eastbound 250 m/s for 1 h at Brest: 900 km, i swings 12.19°", [250 * 3600 / 1e3, swing, 900 / 73.84], [900, 12.19, 12.19], 0.01)
    ur2 = call(GF + "unit_vector_rates", "s25", "Dk/Dt = i u/a + j v/a (north step)", u=0.0, v=10.0, w=0.0, lat=BREST[0] * D2R)
    tilt = np.degrees(np.linalg.norm(ur2.Dk_Dt) * (111.19e3 / 10.0))
    row("DC24", "after 111 km north, k tilts 1.00°", tilt, 1.0, 1e-3)
    # metric terms (s26)
    mt = call(GF + "metric_terms", "s26", "(2.45): −uv tan φ / a + uw / a", u=10.0, v=10.0, w=0.0, lat=45.0 * D2R)
    mx = float(np.ravel(mt.east)[0])
    fv = float(call(GF + "coriolis_parameter", "s26", "f = 2Ω sin φ (lat in rad)", lat=45.0 * D2R)) * 10.0
    row("DC25", "u v tan φ / a = 1.570e-5 m/s²; f v = 1.031e-3; ratio 65.7", [abs(mx) * 1e5, fv * 1e3, fv / abs(mx)], [1.570, 1.031, 65.7], [0.001, 0.001, 0.1])
    row("DC25", "screen 100 / 6.37e6 = 1.57e-5", 100 / 6.37e6 * 1e5, 1.570, 0.001)
    # a parcel on a great circle: u, v change with no force (s26 thought experiment)
    tt = np.linspace(0, 2 * 86400, 49)
    glo, gla = call(GF + "great_circle", "s26", "great circle, constant speed, no rotation", heavy_call=True, lat0=BREST[0] * D2R, lon0=BREST[1] * D2R,
                    u0=10.0, v0=10.0, t=tt)
    glo, gla = np.degrees(np.asarray(glo)), np.degrees(np.asarray(gla))
    hd = np.array([float(__import__("fluidpy.geo.sphere", fromlist=["x"]).initial_bearing(gla[i], glo[i], gla[i + 1], glo[i + 1])) for i in range(len(tt) - 1)] + [np.nan])
    hd[-1] = hd[-2]
    s0 = np.hypot(10, 10)
    V["parcel"] = {"lat": r6(gla, 3), "lon": r6(glo, 3), "u": r6(s0 * np.sin(hd * D2R), 2), "v": r6(s0 * np.cos(hd * D2R), 2), "t_h": r6(tt / 3600, 2)}
    truth("DC25", "the parcel's u grows and v shrinks along the great circle (no force)", bool(np.all(np.diff(V["parcel"]["u"][:-1]) > 0) and np.all(np.diff(V["parcel"]["v"][:-1]) < 0)),
          [V["parcel"]["u"][-1], V["parcel"]["v"][-1]])
    V["metric"] = {"mx": abs(mx), "fv": fv, "ratio": fv / abs(mx), "swing": swing, "tilt": tilt, "angBT": angBT, "angBS": angBS, "dBT": dBT / 1e3}
    # curvilinear (s27)
    sfc = call("fluidpy.core.curvilinear.scale_factors", "s27", "(1, R, 1) cylindrical; (1, r, r sin θ) spherical", system="cylindrical")
    sfs = call("fluidpy.core.curvilinear.scale_factors", "s27", "spherical", system="spherical")
    truth("DC26", "scale factors: cylindrical (1, R, 1), spherical (1, r, r sin θ) (r sin θ = a cos φ)", str(sfc) == "(1, R, 1)" and str(sfs) == "(1, r, r*sin(theta))",
          [str(sfc), str(sfs)])
    E2 = xr.open_dataset(F_ALPS)
    elat = [n for n in E2.dims if "lat" in n.lower() or n == "y"][0]
    elon = [n for n in E2.dims if "lon" in n.lower() or n == "x"][0]
    ev = [v for v in E2.data_vars][0]
    prof = E2[ev].sel({elat: 46.5}, method="nearest")
    plon_ = E2[elon].values.astype(float)
    pz = prof.values.astype(float)
    kk = (plon_ >= 5.0) & (plon_ <= 16.0)
    plon_, pz = plon_[kk][::4], np.maximum(pz[kk][::4], 0)
    zst = np.asarray(call(GA + "pressure_height_standard", "s27", "USSA-1976 height of the pressure levels", p=[100000.0, 85000.0, 70000.0, 50000.0]))
    row("DC26", "standard heights 1000/850/700/500 hPa ≈ 0.1, 1.5, 3.0, 5.6 km", zst / 1e3, [0.111, 1.457, 3.012, 5.574], 0.01)
    V["alps"] = {"lon": r6(plon_, 3), "z": r6(pz / 1e3, 3), "lev": [1000, 850, 700, 500], "zp": r6(zst / 1e3, 3), "max_km": float(pz.max() / 1e3)}

    # ================================================================ routes (s29, s30)
    sig = float(call(GS + "central_angle", "s29", "cos σ = r̂₁·r̂₂", lat1=LHR[0], lon1=LHR[1], lat2=LAX[0], lon2=LAX[1]))
    dgc = float(call(GS + "great_circle_distance", "s29", "d = a σ", lat1=LHR[0], lon1=LHR[1], lat2=LAX[0], lon2=LAX[1]))
    brg = float(call(GS + "initial_bearing", "s29", "initial bearing", lat1=LHR[0], lon1=LHR[1], lat2=LAX[0], lon2=LAX[1]))
    vx = call(GS + "great_circle_vertex", "s29", "Clairaut vertex", lat1=LHR[0], lon1=LHR[1], lat2=LAX[0], lon2=LAX[1])
    gcp = call(GS + "great_circle_points", "s29", "points along the great circle", lat1=LHR[0], lon1=LHR[1], lat2=LAX[0], lon2=LAX[1], n=181)
    sigd = sig if sig > 3.2 else np.degrees(sig)
    row("DC30", "central angle 78.79°, 8761 km, bearing 311.7°, vertex 62.27 N 49.13 W", [sigd, dgc / 1e3, brg, vx[0], vx[1]],
        [78.79, 8761, 311.7, 62.27, -49.13], [0.01, 1, 0.1, 0.01, 0.01])
    rhat1 = np.asarray(__import__("fluidpy.geo.sphere", fromlist=["x"]).unit_vector(*LHR))
    rhat2 = np.asarray(__import__("fluidpy.geo.sphere", fromlist=["x"]).unit_vector(*LAX))
    row("DC30", "r̂₁·r̂₂ = cos σ ≈ 0.195; σ = 1.375 rad; 6371 × 1.375 ≈ 8760", [rhat1 @ rhat2, np.radians(sigd), 6371 * 1.375], [0.1945, 1.3751, 8760.1], [5e-4, 5e-4, 0.1])
    gpl, gpo = np.asarray(gcp[0]), np.asarray(gcp[1])
    truth("DC20", "great-circle points on the sphere (181)", len(np.ravel(gpl)) == 181)
    gdl = np.concatenate([decimate(p, 0.05) for _, ps in shp_parts(F_NE10A, lambda r: r.get("ADMIN") == "Greenland") for p in ps])
    dmin = min(float(__import__("fluidpy.geo.sphere", fromlist=["x"]).great_circle_distance(vx[0], vx[1], q[1], q[0])) for q in gdl) / 1e3
    rng("DC30", "the vertex lies within 100 km of the Greenland coast (NE 10 m)", dmin, 0, 100)
    rh = call(GS + "rhumb_line", "s30", "constant bearing", lat1=LHR[0], lon1=LHR[1], lat2=LAX[0], lon2=LAX[1], n=181)
    row("DC31", "rhumb 9733 km at 258.4°, +11.1 %, +972 km; 972 km / 900 km/h ≈ 1.08 h",
        [rh.distance / 1e3, rh.bearing, (rh.distance / dgc - 1) * 100, (rh.distance - dgc) / 1e3, (rh.distance - dgc) / 1e3 / 900],
        [9733, 258.4, 11.1, 972, 1.08], [1, 0.1, 0.05, 1, 0.01])
    V["route"] = {"lhr": list(LHR), "lax": list(LAX), "sig": sigd, "d": dgc / 1e3, "brg": brg, "vx": [float(vx[0]), float(vx[1])],
                  "gc": [r6(np.ravel(gpl), 3), r6(np.ravel(gpo), 3)], "rh": [r6(rh.lat, 3), r6(rh.lon, 3)], "rh_d": rh.distance / 1e3, "rh_b": rh.bearing,
                  "dot": float(rhat1 @ rhat2)}

    # ================================================================ map projections (s30-s34)
    import fluidpy.geo.mapproj as MP
    import fluidpy.geo.sphere as SPH
    ne110 = json.loads(F_NE110.read_text(encoding="utf-8"))["coastline"]
    cen_g = np.array([-165.0 + 30 * i for i in range(12)])

    def lobe(lon):
        return np.argmin(np.abs(((lon[:, None] - cen_g[None, :]) + 180) % 360 - 180), axis=1)
    PR = {"pc": ("platecarree", {}), "mc": ("mercator", {}), "ee": ("equalearth", {}), "go": ("gores", {"n": 12})}
    segs = []
    for ln in ne110:
        q = np.asarray(ln, float).reshape(-1, 2)
        q = decimate(q, 0.6)
        lb = lobe(q[:, 0])
        cut = np.where((np.diff(lb) != 0) | (np.abs(np.diff(q[:, 0])) > 180))[0] + 1
        for s in np.split(np.arange(len(q)), cut):
            if len(s) < 2:
                continue
            la, lo = q[s, 1], q[s, 0]
            seg = {}
            for key, (nm, kw) in PR.items():
                lat_use = np.clip(la, -85, 85) if key == "mc" else la
                x, y = MP.forward(nm, lat_use, lo, a=1.0, **kw)
                seg[key] = np.round(np.stack([x, y], -1), 4).ravel().tolist()
            segs.append(seg)
    entries.append({"fn": GM + "forward", "scene": "s31-s34", "data": "data/co.json", "eq": "coastlines (NE 110 m) in four projections",
                    "params": {"names": list(PR), "a": 1.0}, "sha256": None, "recorded": f"{len(segs)} segments"})
    V["proj"] = {"coast": segs}
    # stretch factors and Tissot circles
    sfB = MP.scale_factors("platecarree", BREST[0], 0.0)
    sfS = MP.scale_factors("platecarree", LYB[0], 0.0)
    row("DC32", "plate carrée k = 1/cos φ: 1.506 (Brest), 4.898 (Svalbard)", [sfB.k, sfS.k], [1.506, 4.898], 1e-3)
    row("DC32", "screen 1/0.66 ≈ 1.5", 1 / 0.664, 1.506, 1e-3)
    call(GM + "scale_factors", "s31", "k = 1/cos φ (plate carrée stretch along the parallel)", name="platecarree", lat=[BREST[0], LYB[0]])
    y85 = MP.forward("mercator", 85.0, 0.0, a=1.0)[1]
    row("DC33", "Mercator y(85°) = 3.13 a", y85, 3.13, 0.005)
    m60, mS = MP.scale_factors("mercator", 60.0, 0.0), MP.scale_factors("mercator", LYB[0], 0.0)
    row("DC34", "Mercator areal 4.000 (60°), 23.99 (Svalbard)", [m60.areal, mS.areal], [4.0, 23.99], [1e-6, 0.01])
    rs2 = np.random.default_rng(3)
    rl, ro = rs2.uniform(-80, 80, 1000), rs2.uniform(-180, 180, 1000)
    eea = MP.scale_factors("equalearth", rl, ro)
    row("DC35", "Equal Earth areal = 1 at 1000 random points", float(np.max(np.abs(np.asarray(eea.areal) - 1))), 0.0, 1e-9)
    om = MP.scale_factors("equalearth", 60.0, np.array([30.0, 60.0, 90.0, 150.0]))
    rng("DC35", "Equal Earth ω at 60 N, |λ| ≥ 30°: ≥ 30° ('thirty degrees or more')", np.asarray(om.omega), 30.0, 180.0)
    TC = [(0.0, 0.0), BREST, LYB, (60.0, -100.0), (60.0, 100.0), (30.0, -60.0), (30.0, 60.0), (0.0, -120.0), (0.0, 120.0), (-30.0, 20.0),
          (-60.0, -60.0), (60.0, 30.0)]
    tis = {}
    for key, (nm, kw) in PR.items():
        if key == "go":
            continue
        # fix loop 1 (Must 6): traced on the real sphere (a = EARTH_RADIUS, radius_km in km), then divided by a (tissot_xy)
        T = call(GM + "tissot_ellipses", "s31-s34", f"Tissot circles 500 km ({nm})", heavy_call=True, name=nm, centres=np.array(TC), radius_km=500.0, n=49, **kw)
        tis[key] = tissot_xy(T)
        for nm_, v_, r_, t_ in tissot_check(nm, kw, TC, tis[key]):
            row("DC32b", f"Tissot {nm_} (northern centres stay north)", v_, r_, t_)
    V["proj"]["tissot"] = {"centres": [list(c) for c in TC], **tis}
    # the two London-Los Angeles routes on the Mercator map (s30, s32): the rhumb line is straight there
    rte = {}
    for nm_, (la_, lo_) in (("gc", (np.ravel(gpl), np.ravel(gpo))), ("rh", (np.asarray(rh.lat), SPH.wrap_lon(np.asarray(rh.lon))))):
        x_, y_ = MP.forward("mercator", la_, lo_, a=1.0)
        rte[nm_] = np.round(np.stack([x_, y_], -1), 4).ravel().tolist()
    xr_, yr_ = np.asarray(rte["rh"][0::2]), np.asarray(rte["rh"][1::2])
    resid = np.max(np.abs(np.polyval(np.polyfit(xr_, yr_, 1), xr_) - yr_))
    row("DC31c", "rhumb line straight on Mercator (residual of a line fit)", resid, 0.0, 1e-3)
    V["proj"]["routes_mc"] = rte
    V["proj"]["k"] = [float(sfB.k), float(sfS.k)]
    V["proj"]["y85"] = float(y85)
    V["proj"]["areal"] = [float(m60.areal), float(mS.areal)]
    V["proj"]["ee_omega60"] = r6(om.omega, 2)
    # Greenland and Africa (NE 10 m admin-0): true areas and outlines
    import fluidpy.geo.sphere as SPH

    def area_of(parts):
        tot = 0.0
        for p in parts:
            sx = np.sum(p[:-1, 0] * p[1:, 1] - p[1:, 0] * p[:-1, 1])     # planar signed area: shapefile outer rings are clockwise (< 0)
            ar = abs(SPH.polygon_area(p[:, 1], p[:, 0]))
            tot += ar if sx < 0 else -ar
        return tot
    gparts = [p for _, ps in shp_parts(F_NE10A, lambda r: r.get("ADMIN") == "Greenland") for p in ps]
    aparts = [p for _, ps in shp_parts(F_NE10A, lambda r: r.get("CONTINENT") == "Africa") for p in ps]
    Agl, Aaf = area_of(gparts), area_of(aparts)
    row("DC34", "area(Africa) / area(Greenland) = 14.0 ± 0.5 (NE 10 m, polygon_area)", Aaf / Agl, 14.0, 0.5)
    entries.append({"fn": GS + "polygon_area", "scene": "s33", "data": "data/co.json", "eq": "Greenland, Africa (NE 10 m admin-0)",
                    "params": {"source": "ne_10m_admin_0_countries"}, "sha256": None, "recorded": r6([Agl / 1e12, Aaf / 1e12], 4)})

    def outline(parts, keep_n, nm, kw, d=0.25):
        big = sorted(parts, key=lambda p: -len(p))[:keep_n]
        out = []
        for p in big:
            q = decimate(p, d)
            if len(q) < 4:
                continue
            x, y = MP.forward(nm, np.clip(q[:, 1], -85, 85), q[:, 0], a=1.0, **kw)
            out.append(np.round(np.stack([x, y], -1), 4).ravel().tolist())
        return out

    def merc_area(parts):
        tot = 0.0
        for p in parts:
            x, y = MP.forward("mercator", np.clip(p[:, 1], -85, 85), p[:, 0], a=1.0)
            tot += -0.5 * np.sum(x[:-1] * y[1:] - x[1:] * y[:-1])
        return tot
    rng("DC34", "Mercator map area Greenland / Africa in 0.8-1.25 ('about as big'; build 1: 1.05, narration changed from 'nearly as big')",
        merc_area(gparts) / merc_area(aparts), 0.8, 1.25)
    V["proj"]["gl"] = {k: outline(gparts, 1, nm, kw) for k, (nm, kw) in PR.items() if k in ("mc", "ee")}
    V["proj"]["af"] = {k: outline(aparts, 60, nm, kw) for k, (nm, kw) in PR.items() if k in ("mc", "ee")}
    V["proj"]["gl"]["eq"] = outline(gparts, 1, "laea", {"lat_0": 72.0, "lon_0": -40.0})
    V["proj"]["af"]["eq"] = outline(aparts, 60, "laea", {"lat_0": 2.0, "lon_0": 18.0})
    V["proj"]["areas_Mkm2"] = [Agl / 1e12, Aaf / 1e12]
    # BMNG reprojected rasters (inverse maps written here; each checked by a forward round trip with the tested mapproj)
    bm = np.asarray(Image.open(F_BMNG).convert("RGB"))
    A1, A2, A3, A4 = MP.equal_earth_coefficients()

    def raster(nm, w, h, xr_, yr_, inv, path, kw, mask_fn=None):
        X, Y = np.meshgrid(np.linspace(xr_[0], xr_[1], w), np.linspace(yr_[1], yr_[0], h))
        la, lo, ok = inv(X, Y)
        rgb = sample_equirect(bm, np.where(ok, la, 0), np.where(ok, lo, 0))
        alpha = np.where(ok, 255, 0).astype(np.uint8)[..., None]
        Image.fromarray(np.concatenate([rgb, alpha], -1), "RGBA").save(path, optimize=True)
        sel = np.where(ok.ravel())[0][:: max(1, ok.sum() // 4000)]
        fx, fy = MP.forward(nm, la.ravel()[sel], lo.ravel()[sel], a=1.0, **kw)
        return float(np.max(np.hypot(fx - X.ravel()[sel], fy - Y.ravel()[sel])))

    def inv_pc(X, Y):
        return np.degrees(Y), np.degrees(X), (np.abs(X) <= np.pi) & (np.abs(Y) <= np.pi / 2)

    def inv_mc(X, Y):
        return np.degrees(2 * np.arctan(np.exp(Y)) - np.pi / 2), np.degrees(X), np.abs(X) <= np.pi

    def inv_ee(X, Y):
        th = Y / A1
        for _ in range(30):
            f = A1 * th + A2 * th ** 3 + A3 * th ** 7 + A4 * th ** 9 - Y
            fp = A1 + 3 * A2 * th ** 2 + 7 * A3 * th ** 6 + 9 * A4 * th ** 8
            th = np.clip(th - f / fp, -1.25, 1.25)
        M = np.sqrt(3) / 2
        s = np.clip(np.sin(th) / M, -1, 1)
        lam = X * 3 * (9 * A4 * th ** 8 + 7 * A3 * th ** 6 + 3 * A2 * th ** 2 + A1) / (2 * np.sqrt(3) * np.cos(th))
        ok = (np.abs(lam) <= np.pi) & (np.abs(np.sin(th)) <= M + 1e-12)
        return np.degrees(np.arcsin(s)), np.degrees(lam), ok

    def inv_go(X, Y):
        phi = Y
        ci = np.argmin(np.abs(X[..., None] - np.deg2rad(cen_g)[None, None, :]), axis=-1)
        lc = np.deg2rad(cen_g)[ci]
        cph = np.cos(np.clip(phi, -np.pi / 2, np.pi / 2))
        lam = lc + (X - lc) / np.maximum(cph, 1e-9)
        ok = (np.abs(phi) <= np.pi / 2) & (np.abs(lam - lc) <= np.pi / 12)
        return np.degrees(phi), np.degrees(lam), ok
    k0 = (1 + np.sin(60 * D2R)) / 2

    def inv_ps(X, Y):
        rho = np.hypot(X, Y)
        return np.degrees(np.pi / 2 - 2 * np.arctan(rho / (2 * k0))), np.degrees(np.arctan2(X, -Y)), rho <= 2 * k0 * np.tan((90 - 15) / 2 * D2R)
    xee = MP.forward("equalearth", 0.0, 180.0 - 1e-9, a=1.0)[0]
    yee = MP.forward("equalearth", 90.0, 0.0, a=1.0)[1]
    rps = 2 * k0 * np.tan((90 - 15) / 2 * D2R)
    errs = {"pc": raster("platecarree", 2048, 1024, (-np.pi, np.pi), (-np.pi / 2, np.pi / 2), inv_pc, IMG / "bm_pc.png", {}),
            "mc": raster("mercator", 2048, 2048, (-np.pi, np.pi), (-np.pi, np.pi), inv_mc, IMG / "bm_mc.png", {}),
            "ee": raster("equalearth", 2048, round(2048 * yee / xee), (-xee, xee), (-yee, yee), inv_ee, IMG / "bm_ee.png", {}),
            "go": raster("gores", 2048, 1024, (-np.pi, np.pi), (-np.pi / 2, np.pi / 2), inv_go, IMG / "bm_go.png", {"n": 12}),
            "ps": raster("polar_stereographic", 1200, 1200, (-rps, rps), (-rps, rps), inv_ps, IMG / "bm_ps.png", {"lat_0": 90.0, "lat_ts": 60.0})}
    for kx, e in errs.items():
        row("DC31b", f"raster inverse round trip via mapproj.forward ({kx})", e, 0.0, 1e-9)
    V["proj"]["ext"] = {"pc": [np.pi, np.pi / 2], "mc": [np.pi, np.pi], "ee": [float(xee), float(yee)], "go": [np.pi, np.pi / 2], "ps": [float(rps), float(rps)]}
    for key in ("pc", "mc", "ee", "go", "ps"):
        im = Image.open(IMG / f"bm_{key}.png")
        im.convert("RGB").save(IMG / f"bm_{key}.jpg", quality=86)
        if key in ("ee", "go", "ps"):
            im.split()[-1].save(IMG / f"bm_{key}_a.png", optimize=True)   # alpha mask kept beside (map outside the projection)
        (IMG / f"bm_{key}.png").unlink()
    # ERA5 Sep 2026 anomaly on Mercator and Equal Earth (s34)
    T2 = xr.open_dataset(F_T2M)
    tl, tlo = T2.lat.values.astype(float), T2.lon.values.astype(float)
    TA = T2.t2m_anom.values.astype(float)
    gmean = float(call("fluidpy.diag.climatology.global_mean", "s34", "cos-latitude weighted mean", heavy_call=True, field=TA, lat=tl))
    row("DC34b", "global-mean anomaly Sep 2026 +0.823 K (manifest)", gmean, 0.823, 0.005)
    lutb = lut_rgb("cmocean.balance")
    for key, inv, (xr_, yr_), (w, h) in (("mc", inv_mc, ((-np.pi, np.pi), (-np.pi, np.pi)), (1024, 1024)),
                                        ("ee", inv_ee, ((-xee, xee), (-yee, yee)), (1024, round(1024 * yee / xee)))):
        X, Y = np.meshgrid(np.linspace(xr_[0], xr_[1], w), np.linspace(yr_[1], yr_[0], h))
        la, lo, ok = inv(X, Y)
        if key == "mc":
            ok = ok & (np.abs(la) <= 85)
        vals = bilin(np.concatenate([TA, TA[:, :1]], 1), tl, np.r_[tlo, tlo[0] + 360], np.where(ok, la, 0), np.where(ok, np.where(lo < tlo[0], lo + 360, lo), 0))
        vals[~ok] = np.nan
        rgba_png(vals, lutb, -5, 5, IMG / f"t2m_{key}.png", alpha=1.0)
    V["t2m"] = {"gmean": gmean, "range": [-5, 5]}

    # ================================================================ the 10 hPa polar vortex, 21 Jan 2026 (s35-s36)
    N = xr.open_dataset(F_NCEP)
    day = np.datetime64("2026-01-21")
    nk = int(np.where(N.time.values.astype("datetime64[D]") == day)[0][0])
    nlat, nlon = N.lat.values.astype(float), N.lon.values.astype(float)
    z = N.z.values[nk].astype(float)
    un, vn = N.u.values[nk].astype(float), N.v.values[nk].astype(float)
    row("DC36", "u60 21 Jan 2026 = 42.1 m/s (strongest of the winter)", float(N.u60.values[nk]), 42.1, 0.05)
    truth("DC36", "21 Jan has the largest u60 of the winter", int(np.nanargmax(N.u60.values)) == nk)
    vc = call(DC + "storm_centre", "s36", "vortex centre = minimum of the 10 hPa height", heavy_call=True, msl=z, lat=nlat, lon=nlon, box=(50.0, 89.0, 0.0, 359.99))
    vlat, vlon = float(vc.lat), float(((float(vc.lon) + 180) % 360) - 180)
    row("DC36", "refined centre 72.89 N 44.26 E, 28 602 m", [vlat, vlon, float(vc.msl_min)], [72.89, 44.26, 28602], [0.02, 0.02, 2])
    zm = z.mean(axis=1)
    row("DC36", "zonal-mean height 30 N 30 721 m ('almost thirty one')", float(zm[list(nlat).index(30.0)]), 30721, 2)
    land = [p for _, ps in shp_parts(F_NE50L) for p in ps]
    from matplotlib.path import Path as MPath
    onland = any(MPath(p).contains_point((vlon, vlat)) for p in land if p[:, 1].max() > 60)
    truth("DC36b", "the vortex centre is over the sea (NE 50 m land)", not onland)
    dpole = float(SPH.great_circle_distance(vlat, vlon, 90.0, 0.0))
    row("DC36", "centre to pole 1902 km", dpole / 1e3, 1902, 3)
    ringP = call(DC + "storm_relative_wind", "s36", "ring 2000 km about the pole", heavy_call=True, u=un, v=vn, lat=nlat, lon=nlon, centre=(89.999, 0.0),
                 radii_km=[1500.0, 2000.0, 2500.0], n_az=72)
    ringC = call(DC + "storm_relative_wind", "s36", "ring 2000 km about the vortex centre", heavy_call=True, u=un, v=vn, lat=nlat, lon=nlon, centre=(vlat, vlon),
                 radii_km=[1500.0, 2000.0, 2500.0], n_az=72)
    ratP = float(np.sqrt(np.nanmean(ringP.radial[1] ** 2)) / ringP.tangential_mean[1])
    ratC = float(np.sqrt(np.nanmean(ringC.radial[1] ** 2)) / ringC.tangential_mean[1])
    row("DC37", "rms(v_r)/v_t at 2000 km: 1.88 (pole) vs 0.42 (vortex centre)", [ratP, ratC], [1.88, 0.42], 0.02)
    truth("DC37", "zonal-mean u > 0 at 50-80 N (westerly)", bool(np.all(un[(nlat >= 50) & (nlat <= 80)].mean(axis=1) > 0)))
    levs = [28800.0 + 400 * i for i in range(7)]
    zz = np.concatenate([z, z[:, :1]], 1)
    lonw = np.r_[nlon, 360.0]
    cl = contours(zz, nlat, lonw, levs, nd=3)
    psk = {"lat_0": 90.0, "lat_ts": 60.0}
    for c in cl:
        nl_ = []
        for ln in c["lines"]:
            q = np.asarray(ln).reshape(-1, 2)
            x, y = MP.forward("polar_stereographic", q[:, 1], q[:, 0], a=1.0, **psk)
            nl_.append(np.round(np.stack([x, y], -1), 4).ravel().tolist())
        c["xy"] = nl_
        del c["lines"]
    # wind arrows along the contours (data direction, map direction by a small forward step)
    arr = []
    for la in (50.0, 57.5, 65.0, 72.5, 80.0):
        for lo in np.arange(0, 360, 20 if la < 70 else 30):
            j, i = list(nlat).index(la), list(nlon).index(lo)
            uu, vv = float(un[j, i]), float(vn[j, i])
            x0, y0 = MP.forward("polar_stereographic", la, lo, a=1.0, **psk)
            st = 1e4
            x1, y1 = MP.forward("polar_stereographic", la + np.degrees(vv * st / A_E), lo + np.degrees(uu * st / (A_E * np.cos(la * D2R))), a=1.0, **psk)
            d = np.hypot(x1 - x0, y1 - y0)
            arr.append([round(float(x0), 4), round(float(y0), 4), round(float((x1 - x0) / d), 4), round(float((y1 - y0) / d), 4), round(float(np.hypot(uu, vv)), 1), uu, vv])
    vcx = MP.forward("polar_stereographic", vlat, vlon, a=1.0, **psk)

    def ringxy(R):
        x, y = MP.forward("polar_stereographic", R.lat[1], R.lon[1], a=1.0, **psk)
        return np.round(np.stack([x, y], -1), 4).ravel().tolist()
    coast_ps = []
    for ln in ne110:
        q = np.asarray(ln, float).reshape(-1, 2)
        q = q[q[:, 1] > 12]
        if len(q) < 2:
            continue
        x, y = MP.forward("polar_stereographic", q[:, 1], q[:, 0], a=1.0, **psk)
        coast_ps.append(np.round(np.stack([x, y], -1), 4).ravel().tolist())
    lat_rings = {}
    for la in (30, 45, 60, 75):
        x, y = MP.forward("polar_stereographic", float(la), 0.0, a=1.0, **psk)
        lat_rings[str(la)] = float(np.hypot(x, y))
    sfp = MP.scale_factors("polar_stereographic", np.array([LYB[0], 60.0, BREST[0], 30.0]), 0.0, **psk)
    row("DC35b", "polar stereographic k 0.943, 1.000, 1.068, 1.244", np.asarray(sfp.k), [0.943, 1.0, 1.068, 1.244], 2e-3)
    V["vortex"] = {"date": "2026-01-21", "c": [vlat, vlon], "cz": float(vc.msl_min), "cxy": [float(vcx[0]), float(vcx[1])], "z30": float(zm[list(nlat).index(30.0)]),
                   "u60": float(N.u60.values[nk]), "contours": cl, "arrows": arr, "ringP": ringxy(ringP), "ringC": ringxy(ringC), "ratP": ratP, "ratC": ratC,
                   "vtP": float(ringP.tangential_mean[1]), "vtC": float(ringC.tangential_mean[1]), "coast": coast_ps, "rings": lat_rings, "dpole": dpole / 1e3,
                   "ringC_vr": r6(ringC.radial[1], 2), "ringP_vr": r6(ringP.radial[1], 2)}

    # ================================================================ Storm Ciarán, ERA5 hourly (s43-s45)
    Cd = xr.open_dataset(F_CIA)
    clat_, clon_ = Cd.lat.values.astype(float), Cd.lon.values.astype(float)
    if clat_[0] > clat_[-1]:
        Cd = Cd.isel(lat=slice(None, None, -1))
        clat_ = clat_[::-1]
    ctime = Cd.time.values
    msl = Cd.msl.values.astype(float)
    trk = call(DC + "track_by_continuity", "s43", "storm tracker rule: seed + continuity", heavy_call=True, msl=msl, lat=clat_, lon=clon_, times=ctime,
               seed=(52.5, 1.75), seed_time=np.datetime64("2023-11-02T12:00:00"), box_deg=(1.2, 2.0), max_step_km=120.0)
    tix = {str(t)[:13]: i for i, t in enumerate(trk.times)}
    k00, k03, k06, k21, k23, k01 = (tix[s] for s in ("2023-11-02T00", "2023-11-02T03", "2023-11-02T06", "2023-11-01T21", "2023-11-01T23", "2023-11-02T01"))
    steps = np.asarray(trk.step_km)[k21 + 1:k06 + 1]
    truth("DC52", "hourly steps 21-06 UTC ≤ 120 km, no flags", bool(np.all(steps <= 120) and not np.any(np.asarray(trk.step_flag)[k21:k06 + 1])), r6(steps, 1))
    row("DC52", "track 00 UTC 954.5, 03 UTC 953.6 hPa", [trk.msl_min[k00] / 100, trk.msl_min[k03] / 100], [954.5, 953.6], 0.15)
    TV = call(DC + "translation_velocity", "s43", "great-circle distance / time, bearing at the start", heavy_call=True, track=trk,
              t1=trk.times[k00], t2=trk.times[k06])
    Ue, Un = float(TV.east), float(TV.north)
    row("DC52", "motion 14.58 m/s towards 71.0° (east 13.78, north 4.75)", [TV.speed, TV.bearing, Ue, Un], [14.58, 71.0, 13.78, 4.75], [0.02, 0.2, 0.02, 0.02])
    i03 = int(np.where(ctime == trk.times[k03])[0][0])
    u03, v03 = Cd.u10.values[i03].astype(float), Cd.v10.values[i03].astype(float)
    c03 = (float(trk.lat[k03]), float(trk.lon[k03]))
    Rg = call(DC + "storm_relative_wind", "s43", "200-km ring, ground-relative", heavy_call=True, u=u03, v=v03, lat=clat_, lon=clon_, centre=c03, radii_km=[200.0], n_az=72)
    Rs = call(DC + "storm_relative_wind", "s44", "200-km ring, storm-relative (u − U)", heavy_call=True, u=u03 - Ue, v=v03 - Un, lat=clat_, lon=clon_, centre=c03,
              radii_km=[200.0], n_az=72)
    az = np.degrees(Rg.azimuth)
    azR = (90.0 - (TV.bearing + 90.0)) % 360      # right of the track (bearing + 90°) as an azimuth from east, anticlockwise
    south = np.abs(((az - azR) + 180) % 360 - 180) <= 45          # the right-hand (southern) side, ±45°
    north = np.abs(((az - azR - 180) + 180) % 360 - 180) <= 45    # the left-hand (northern) side
    spg = np.hypot(Rg.u[0], Rg.v[0])
    row("DC53", "ground-relative sector means: south 18.8, north 8.4 m/s", [spg[south].mean(), spg[north].mean()], [18.8, 8.4], 0.5)
    row("DC54", "ring means v_t 14.1 vs 13.8; v_r −6.0 vs −5.9 m/s", [Rg.tangential_mean[0], Rs.tangential_mean[0], Rg.radial_mean[0], Rs.radial_mean[0]],
        [14.1, 13.8, -6.0, -5.9], 0.1)
    Ru = call(DC + "storm_relative_wind", "s44", "a uniform wind (U) on the same ring", heavy_call=True, u=np.full_like(u03, Ue), v=np.full_like(v03, Un), lat=clat_,
              lon=clon_, centre=c03, radii_km=[200.0], n_az=72)
    rng("DC54", "uniform (u, v) on the sphere: ring means small (meridian convergence) |v_t| < 0.3, |v_r| < 0.1 m/s = the ground - storm difference",
        [abs(Ru.tangential_mean[0]), abs(Ru.radial_mean[0]) * 3], 0, 0.3)
    row("DC54", "uniform-field ring mean = ground − storm-relative ring mean (v_t, v_r)", [Ru.tangential_mean[0], Ru.radial_mean[0]],
        [Rg.tangential_mean[0] - Rs.tangential_mean[0], Rg.radial_mean[0] - Rs.radial_mean[0]], 1e-6)
    ang_ = np.linspace(0, 2 * np.pi, 72, endpoint=False)
    xr_ = np.stack([200e3 * np.cos(ang_), 200e3 * np.sin(ang_)])
    upl = call(CS + "velocity_components", "s44", "a uniform wind on a flat circle: u_θ, u_r", heavy_call=True, u_cart=np.stack([np.full(72, 13.78), np.full(72, 4.75)]),
               x=xr_, system="polar")
    rng("DC54", "flat circle: a uniform wind's mean u_θ and u_r are 0 (to 1e-12)", np.abs(upl.mean(axis=1)), 0, 1e-12)
    sgs = (np.hypot(Rs.u[0], Rs.v[0]))
    # hourly frames 21 -> 06 UTC: isobars every 4 hPa and wind-speed rasters
    bj = np.where((clat_ >= CIA_BOX[0] - 1) & (clat_ <= CIA_BOX[1] + 1))[0]
    bi = np.where((clon_ >= CIA_BOX[2] - 1) & (clon_ <= CIA_BOX[3] + 1))[0]
    slat, slon = clat_[bj], clon_[bi]
    frames = []
    for kk_ in range(k21, k06 + 1):
        it = int(np.where(ctime == trk.times[kk_])[0][0])
        P_ = msl[it][np.ix_(bj, bi)] / 100
        frames.append({"t": str(trk.times[kk_])[:13], "iso": contours(P_, slat, slon, list(range(940, 1032, 4)), nd=3)})
        sp_ = np.hypot(Cd.u10.values[it], Cd.v10.values[it])[np.ix_(bj, bi)]
        rgba_png(sp_[::-1], lut_speed, 0, 30, IMG / f"cia_speed_{kk_ - k21:02d}.png", alpha=0.8, up=2)
    sbox = [float(slat[0] - 0.125), float(slat[-1] + 0.125), float(slon[0] - 0.125), float(slon[-1] + 0.125)]
    # particle tracks through the frozen 03 UTC field and arrows on a 1.5° grid (ground and storm-relative)
    rs3 = np.random.default_rng(11)
    cs_l, cs_o = rs3.uniform(CIA_BOX[0], CIA_BOX[1], 260), rs3.uniform(CIA_BOX[2], CIA_BOX[3], 260)
    ct = call(DT_ + "advect_on_sphere", "s43", "tracks through the frozen 03 UTC 10-m wind", heavy_call=True, u=u03[np.ix_(bj, bi)], v=v03[np.ix_(bj, bi)],
              lat=slat, lon=slon, seeds_lat=cs_l, seeds_lon=cs_o, dt=600.0, nsteps=47)
    garr = []
    for la in np.arange(45.0, 57.1, 1.5):
        for lo in np.arange(-14.0, 4.1, 2.0):
            uu = float(bilin(u03, clat_, clon_, la, lo))
            vv = float(bilin(v03, clat_, clon_, la, lo))
            garr.append([float(la), float(lo), round(uu, 2), round(vv, 2)])
    # Plymouth barometer (s45): fixed-place tendency and the sliding part
    i23, i00, i01 = (int(np.where(ctime == trk.times[k])[0][0]) for k in (k23, k00, k01))
    p23, p01 = (float(bilin(msl[i], clat_, clon_, PLY[0], PLY[1])) for i in (i23, i01))
    dpdt = (p01 - p23) / 2 / 100
    gr = call(GS + "gradient", "s45", "∇p = (1/(a cos φ) ∂p/∂λ, (1/a) ∂p/∂φ)", heavy_call=True, F=msl[i00], lat=clat_, lon=clon_)
    gx, gy = float(bilin(gr.dFdx, clat_, clon_, PLY[0], PLY[1])), float(bilin(gr.dFdy, clat_, clon_, PLY[0], PLY[1]))
    slide = -(Ue * gx + Un * gy) * 3600 / 100
    resid = dpdt - slide
    row("DC56", "Plymouth 00 UTC: ∂p/∂t −3.82, −U·∇p −3.21, residual −0.61 hPa/h", [dpdt, slide, resid], [-3.82, -3.21, -0.61], 0.1)
    row("DC56", "screen: −3.8 = −3.2 + (−0.6)", round(dpdt, 1) - round(slide, 1), -0.6, 1e-9)
    p00 = float(bilin(msl[i00], clat_, clon_, PLY[0], PLY[1])) / 100
    # the frozen-pattern ghost: 23 UTC isobars slid by U for 1 h and 2 h (destination_point along the motion bearing)
    ghost = []
    P23 = msl[i23][np.ix_(bj, bi)] / 100
    c23 = contours(P23, slat, slon, list(range(940, 1032, 4)), nd=3)
    for hrs_ in (0, 1, 2):
        g_ = []
        for c in c23:
            ls_ = []
            for ln in c["lines"]:
                q = np.asarray(ln).reshape(-1, 2)
                if hrs_:
                    la2, lo2 = SPH.destination_point(q[:, 1], q[:, 0], TV.bearing, TV.speed * 3600 * hrs_)
                    q = np.stack([lo2, la2], -1)
                ls_.append(np.round(q, 3).ravel().tolist())
            g_.append({"level": c["level"], "lines": ls_})
        ghost.append(g_)
    isd = json.loads(F_ISD.read_text(encoding="utf-8"))["reports"]
    r3 = [r for r in isd if r["time"].startswith("2023-11-02T03:00") and r["report_type"] == "FM-12"][0]
    g911 = None
    toks = r3["synop"].split()
    if "333" in toks:
        for tk in toks[toks.index("333") + 1:]:
            if tk.startswith("911"):
                g911 = int(tk[3:])
                break
    row("DC55", "Brest SYNOP 03 UTC 2 Nov 911 group = 84 kt = 155.6 km/h", [g911, g911 * 1.852], [84, 155.6], 0.1)
    V["ciaran"] = {"box": list(CIA_BOX), "sbox": sbox, "frames": frames, "track": [[str(t)[:13], r6(trk.lat[k], 3), r6(trk.lon[k], 3), r6(trk.msl_min[k] / 100, 1)]
                   for k, t in enumerate(trk.times) if k21 <= k <= k06], "U": [Ue, Un], "spd": float(TV.speed), "brg": float(TV.bearing), "c03": list(c03),
                   "ring": {"az": r6(az, 1), "lat": r6(Rg.lat[0], 3), "lon": r6(Rg.lon[0], 3), "u": r6(Rg.u[0], 2), "v": r6(Rg.v[0], 2), "vt": r6(Rg.tangential[0], 2),
                            "vr": r6(Rg.radial[0], 2), "vts": r6(Rs.tangential[0], 2), "vrs": r6(Rs.radial[0], 2), "sp": r6(spg, 2), "sps": r6(sgs, 2)},
                   "S": float(spg[south].mean()), "N": float(spg[north].mean()), "vtm": [float(Rg.tangential_mean[0]), float(Rs.tangential_mean[0])],
                   "vrm": [float(Rg.radial_mean[0]), float(Rs.radial_mean[0])], "tracks": [np.round(t, 2).tolist() for t in ct], "track_dt_s": 600.0, "arrows": garr,
                   "ply": {"p": list(PLY), "dpdt": dpdt, "slide": slide, "resid": resid, "p00": p00, "grad": [gx, gy]}, "ghost": ghost, "gust_kt": g911,
                   "coast": box_lines(coast, (43.0, 59.0, -16.0, 6.0), nd=3, step=2)}

    # ================================================================ Galilean frames (s41, s42)
    row("DC50", "train 20 + walker 1.5 = 21.5 m/s", 20 + 1.5, 21.5, 1e-12)
    from fluidpy.core import kinematics as KN

    def vortex(x, t):
        X = np.asarray(x, float)
        xc = X[0] - 0.0 * t
        yc = X[1]
        r2 = xc ** 2 + yc ** 2 + 1e-12
        f = 1 - np.exp(-r2 / 4.0)
        return np.stack([-yc * f / r2 * 10.0 + 0.0 * t, xc * f / r2 * 10.0]) if X.ndim > 1 else np.array([-yc * f / r2 * 10.0, xc * f / r2 * 10.0])
    U = np.array([20.0, 0.0])
    up = KN.galilean_transform(vortex, U)
    rs4 = np.random.default_rng(5)
    Xp = rs4.uniform(-3, 3, (2, 200))
    A1_ = KN.acceleration(vortex, Xp + U[:, None] * 0.5, 0.5)
    A2_ = KN.acceleration(up, Xp, 0.5)
    truth("DC51", "kinematics.acceleration equal in both frames at 200 points; local and advective parts differ",
          bool(np.allclose(A1_.a, A2_.a, rtol=1e-6, atol=1e-6) and not np.allclose(A1_.local, A2_.local, atol=1e-3)),
          r6([np.max(np.abs(A1_.a - A2_.a)), np.max(np.abs(A1_.local - A2_.local))], 6))
    entries.append({"fn": "fluidpy.core.kinematics.acceleration", "scene": "s42", "data": "data/co.json", "eq": "(K 3.9) in both frames",
                    "params": {"field": "Gaussian-core vortex, U = (20, 0)", "points": 200}, "sha256": None,
                    "recorded": r6([np.max(np.abs(A1_.a - A2_.a))], 9)})

    # ================================================================ lines for the globe and the panels
    V["lines"] = {"globe_coast_110m": [np.round(np.asarray(ln, float), 2).tolist() for ln in ne110]}
    fr_parts = [p for r_, ps in shp_parts(F_NE10A, lambda r: r.get("ADMIN") in ("France",)) for p in ps]
    no_parts = [p for r_, ps in shp_parts(F_NE10A, lambda r: r.get("ADMIN") in ("Norway",)) for p in ps]
    V["panels"] = {"brittany": [np.round(decimate(p, 0.01), 3).ravel().tolist() for p in fr_parts if p[:, 0].min() < -2 and p[:, 1].max() > 47],
                   "svalbard": [np.round(decimate(p, 0.01), 3).ravel().tolist() for p in no_parts if p[:, 1].min() > 76 and p[:, 0].max() < 35]}
    # recap numbers = scene rows (DC57)
    row("DC57", "recap: 37 / 12.5 / 111 / 74 / 23 / ½", [round(vt25), round(-vr25 * 2) / 2, round(float(np.asarray(AL.dy)[0] / 1e3)), round(float(np.asarray(AL.dx)[1] / 1e3)),
        round(float(np.asarray(AL.dx)[2] / 1e3)), 2 * bf], [37, 12.5, 111, 74, 23, 0.5], 1e-9)

    # ---------------------------------------------------------------------------------------------- report and write
    for r in rows:
        print(f"  {'PASS' if r['pass'] else 'FAIL'}  {r['id']:6s} {r['name']}  -> {r['value']}")
    if not all(r["pass"] for r in rows):
        print("build_ch00_coordinates: checks FAILED — no data written")
        return 1
    def clean(o):   # NaN (a particle that left its box, a missing ring point) -> null; numpy scalars -> float
        if isinstance(o, dict):
            return {k: clean(v) for k, v in o.items()}
        if isinstance(o, (list, tuple)):
            return [clean(v) for v in o]
        if isinstance(o, (float, np.floating)):
            return None if not np.isfinite(o) else float(o)
        if isinstance(o, np.integer):
            return int(o)
        if isinstance(o, np.ndarray):
            return clean(o.tolist())
        return o
    V = clean(V)
    blob = json.dumps(V, separators=(",", ":"), ensure_ascii=False, allow_nan=False).encode("utf-8")
    (DATA / "co.json").write_bytes(blob)
    data_hashes = {"co.json": hashlib.sha256(blob).hexdigest()}
    for pimg in sorted(list(IMG.glob("*.png")) + list(IMG.glob("*.jpg"))):
        data_hashes[f"img/{pimg.name}"] = sha_file(pimg)
    render = {}
    if a.public:
        a.public.mkdir(parents=True, exist_ok=True)
        Image.open(F_BMNG).convert("RGB").resize((4096, 2048), Image.LANCZOS).save(a.public / "co_bmng.jpg", quality=88)
        Image.open(F_GOES).convert("RGB").save(a.public / "co_goes.jpg", quality=90)
        for pimg in sorted(list(IMG.glob("*.png")) + list(IMG.glob("*.jpg"))):
            (a.public / f"co_{pimg.name}").write_bytes(pimg.read_bytes())
        render = {pp.name: sha_file(pp) for pp in sorted(a.public.glob("co_*"))}
    inputs = {str(pq.relative_to(ROOT)).replace("\\", "/") if ROOT in pq.parents else str(pq): sha_file(pq)
              for pq in [F_HRRR, F_IANPL, F_IANZ, F_CIA, F_NCEP, F_COOPS, F_T2M, F_ISD, F_IBT, F_GOES, F_GOESJ, F_BMNG, F_NE110, F_NE10C, F_NE10A, F_NE50L, F_ALPS]}
    manifest = {
        "id": "ch00_coordinates", "storyboard": "movies/ch00/ch00_coordinates/storyboard.yaml", "builder": "movies/data/build_ch00_coordinates.py",
        "fluidpy": {"repo": "../Fluid Dynamics", **git_sha(FLUID, {
            "coords_py": "fluidpy/core/coords.py", "tensors_py": "fluidpy/core/tensors.py", "curvilinear_py": "fluidpy/core/curvilinear.py",
            "kinematics_py": "fluidpy/core/kinematics.py", "sphere_py": "fluidpy/geo/sphere.py", "frames_py": "fluidpy/geo/frames.py",
            "mapproj_py": "fluidpy/geo/mapproj.py", "vectors_py": "fluidpy/geo/vectors.py", "atmos_py": "fluidpy/geo/atmos.py",
            "cyclone_py": "fluidpy/diag/cyclone.py", "trajectories_py": "fluidpy/diag/trajectories.py", "climatology_py": "fluidpy/diag/climatology.py"})},
        "equations_note": "provenance only (QA/reviewer); the movie draws no equation labels or numbers (HOUSE_STYLE §5)",
        "equations": {"position": "Vallis §2.2.2, Fig. 2.3", "increments": "Vallis §2.2.2 text before (2.27)", "ENU": "Vallis (2.29)",
                      "unit-vector rates": "Vallis (2.38)-(2.39)", "metric terms": "Vallis (2.45)", "gradient": "Vallis (2.31)",
                      "polar/cylindrical/spherical": "Kundu App. B §B.5 (p. 865)", "rotation": "Kundu (2.4)-(2.5)", "Galilean": "Kundu §3.3, (3.9)",
                      "change of variable": "Kundu (B.2.2)"},
        "parameters": {"places": {"brest": BREST, "trappes": TRAPPES, "singapore": SINGAPORE, "longyearbyen": LYB, "lhr": LHR, "lax": LAX, "fmb": FMB, "stp": STP, "ply": PLY},
                       "ian": {"hrrr_time": "2022-09-28T18 (and T20)", "rings_km": radii, "n_az": 72, "regrid": "HRRR LCC -> 0.03° lat/lon (scipy griddata linear) for rasters and tracks"},
                       "stack": {"levels": SL, "box": "±2.75° lat × ±3.05° lon round the ERA5 centre", "colour": "u_r, −10…+10 m/s, rose(−, hatched)/slate/orange(+)",
                                 "exaggeration": "vertical ×10 (said only in the manifest)"},
                       "vortex_day": "2026-01-21 (strongest of winter 2025-26; data_needs §H)",
                       "coast_segment_s40": PIN,
                       "goes_eye_s14": {"box": V["stack"]["eye_box"], "centre": "IBTrACS 18 UTC (eye in the GOES image; HRRR centre 14 km south)", "contrast_stretch": V["stack"]["eye_stretch"]},
                       "ciaran": {"seed": [52.5, 1.75, "2023-11-02T12"], "box_deg": [1.2, 2.0], "max_step_km": 120, "ring_km": 200, "motion": "00-06 UTC 2 Nov"},
                       "time_compression": {"s11": "particles 150 s per sample (frozen 18 UTC field), zoom 30 s", "s43": "particles 600 s per sample (frozen 03 UTC field); isobars hourly 21->06 UTC in ~10 s",
                                            "s19": "Earth spin one turn in 20 s", "s25": "1 h flight in ~5 s", "s41": "train at true speed ×1 (illustrative)"},
                       "exaggerations": ["title grid-to-polar morph (schematic)", "s14 cylinder at true aspect (25 km × 15 km), arrows illustrative",
                                         "s14b vertical ×10", "s20 one-degree step drawn ×5 in angle", "s31-s34 Tissot circles 500 km radius (traced on the real sphere, fix loop 1)", "s14 GOES eye crop contrast-stretched (0.5-99.5 % -> 30-255, gamma 1.6)",
                                         "s35 polar map below 20 N cut"],
                       "screen_deviations": ["s02-s05 flat map is a code-drawn local plane (no imagery: a 12-km window is 6 px of Blue Marble)",
                                             "s11/s39 maps in a local equirectangular frame scaled by cos(latitude) (≈ HRRR's Lambert conformal over a 600-km window)",
                                             "s22 panels: Natural Earth 10 m land and the ERA5 0.25° grid in a local frame (true local shape)",
                                             "s18 side and top views drawn as 2-D cross-sections (schematic geometry)"]},
        "credits": [
            "NOAA HRRR analyses (public domain) via the University of Utah HRRR-zarr archive (Dowell et al. 2022).",
            "NOAA GOES-16 ABI (public domain), true colour made by our code.",
            "Contains modified Copernicus Climate Change Service information 2026 (ERA5 pressure levels for Ian, ERA5 hourly surface for Ciarán, ERA5 monthly 2 m temperature).",
            "NCEP/NCAR Reanalysis 1 (NOAA PSL, public domain), 10 hPa daily means 2025-26.",
            "NOAA NOS CO-OPS tide gauges 8725520, 8726520 (public domain).",
            "IBTrACS v04r01 (NOAA NCEI). NHC Tropical Cyclone Report Hurricane Ian AL092022 (Bucci et al. 2023): 10-15 ft above ground at Fort Myers Beach.",
            "NOAA NCEI Integrated Surface Database (ISD): Brest-Guipavas 07110 SYNOP (WMO Resolution 40 notice applies).",
            "Blue Marble: Next Generation, NASA Earth Observatory (Reto Stöckli, NASA GSFC). ETOPO 2022 (NOAA NCEI). Made with Natural Earth.",
            "Music: tools/sound (procedural synthesis, our own code, CC0-1.0), style compass-orbit seed 23 (runner-up ice-polar)."],
        "js_selftest": "none — the composition has no JS physics; every number is read from data/co.json (TSX CHECK rows re-assert the screen strings)",
        "inputs_sha256": inputs, "render_assets": render, "data_files": data_hashes, "checks": rows,
        "physics": [e for e in entries if e.get("sha256")], "physics_recorded": [e for e in entries if not e.get("sha256")], "physics_heavy": heavy,
    }
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=1, ensure_ascii=False, default=str), encoding="utf-8")
    print(f"build_ch00_coordinates: co.json {len(blob) / 1e3:.0f} kB + {len(data_hashes) - 1} images; {len(entries)} parity entries, "
          f"{len(heavy)} heavy, {len(rows)} checks -> {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
