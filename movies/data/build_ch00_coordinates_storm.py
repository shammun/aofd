"""Physics and real-data products for the Chapter-0 movie #5b "Coordinates, Part 2 — Inside a tropical cyclone: turning
arrows and cylindrical coordinates" (movies/ch00/ch00_coordinates_storm/storyboard.yaml, 33 scenes; CHECK rows DS01-DS30).

Run with the main venv (one heavy Python process; TEMP/TMP on G:)::

    .venv/Scripts/python.exe movies/data/build_ch00_coordinates_storm.py [--public <render public dir> ...]

Every number the movie shows or says is computed here by the tested functions named in the storyboard's
``physics_source`` fields:

* ``fluidpy.core.coords`` (unit_vectors_polar, unit_vectors_cylindrical, velocity_components),
  ``fluidpy.core.kinematics.lagrangian_velocity_acceleration``, ``fluidpy.geo.frames.coriolis_parameter``,
  ``fluidpy.geo.sphere`` (great_circle_distance, central_angle, initial_bearing, destination_point),
* ``fluidpy.diag.cyclone`` (storm_centre, storm_relative_wind), ``fluidpy.diag.radar.beam_height``,
* data access through ``fluidpy.data.fetch()`` and the disk guard only (every file below is a cache hit of the research
  fetches except the small ETOPO 2022 60″ subset off south-west Florida):
  - HRRR-zarr **prs** store, 9 levels × (UGRD, VGRD, VVEL, HGT), the research window — the NEW route (``store='prs'``)
    written here with ``fetch()`` directly, mirroring research/_scripts/ian_hrrr_prs.py (proposed for fluidpy.data.hrrr);
  - NEXRAD Level-II KTBW 18:01:48 UTC (s3 unidata-nexrad-level2, anonymous) — NEW route, MetPy reader (proposed
    fluidpy.data.nexrad);
  - GOES-16 ABI L2 CMIPM mesoscale M1 C01-C03 18:01:25 UTC (``fluidpy.data.goes.to_latlon``);
  - ERA5 ARCO Amphan 2020-05-20T06 (``fluidpy.data.era5_arco.fetch_box``), GIBS MODIS Terra 2020-05-18
    (``fluidpy.data.gibs.fetch_wms``), IBTrACS NI (``fluidpy.data.ibtracs.storm_table``);
  - the GEE pair and the GEE flight patch (MODIS MOD09/MYD09 7-2-1 16 / 29 May 2020; MCD43A4 NBAR + ETOPO1) — NEW route
    ``fetch(ee://…, retrieve=…)`` as research/flood_v2/_scripts/geefetch.py (proposed fluidpy.data.gee); here every
    array is a cache hit (the retrieve callable refuses to run: Earth Engine lives in .venv-maps);
* the build-1 files on disk: HRRR sfc 18/20 UTC (G: derived), IBTrACS Ian, CO-OPS gauges, Natural Earth 10 m, Blue Marble.
* measured rising air (DS29-DS30, reports/data/ch00_coordinates_vertical_motion.md §3): the NOAA P-3 tail Doppler radar Level-2
  analysis 220928H1_1023 through ``fetch(ftp://…, retrieve=<ftplib>)`` (cache hit; HRD data, original NOT redistributable; a
  decompressed working copy on G: scratch) → ring means of w; the HRRR f00 wrfprs GRIB2 through ``fetch()`` (cache hit) → a box
  subset with eccodes (cached on G: scratch) → the continuity w that the analysed inflow implies (method of the research
  vm_sections.py, proposed for fluidpy.diag.cyclone).

Data report (reports/data/ch00_coordinates_research.md §1b-§1d) applied: wind numbers round HRRR's OWN calm centre
(26.506 N, 82.441 W, the 10-m wind-speed minimum; = Part 1), pictures of the eye round the radar eye (26.552 N,
82.278 W); never both centres on one data picture; no hatch; diverging u_r map centred on 0 with a bold zero contour;
975 hPa masked below ground; layer textures >= 1024 px. Distances handed to fluidpy are in metres (``radii_km`` is the
one argument the library defines in km).

Writes movies/ch00/ch00_coordinates_storm/data/cs.json (numbers and small arrays the composition only indexes and
interpolates; ``say`` = the spoken/written rounded values, each asserted against the data here), data/img/*.png|jpg and
manifest.json (function, provenance, parameters, fluidpy git SHA, sha256 of inputs and data files, parity hashes).
Every CHECK row must pass before anything is written (exit 1 otherwise). Rows of kind "flag" test a NARRATION claim that
the data do not support; they never block the data (the screen does not show the claim) and are listed for the director.
"""
from __future__ import annotations

import argparse
import hashlib
import importlib
import json
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
FLUID = ROOT.parent / "Fluid Dynamics"
OUT = ROOT / "movies" / "ch00" / "ch00_coordinates_storm"
DATA = OUT / "data"
IMG = DATA / "img"
sys.path.insert(0, str(FLUID))
sys.path.insert(0, str(Path(__file__).resolve().parent))
import build_ch00_coordinates as B1  # noqa: E402  (shared helpers: parity_hash, r6, sha_file, git_sha, lut_rgb, lut_hex, shp_parts, box_lines)
import xarray as xr  # noqa: E402

D2R = np.pi / 180.0
A_E = 6.371e6
G0 = 9.80665
TITLE = "Coordinates, Part 2 — Inside a tropical cyclone: turning arrows and cylindrical coordinates"
CALM = (26.506, -82.441)                 # HRRR's own calm centre (10-m speed minimum) = Part 1
RADAR_EYE = (26.552, -82.278)            # NEXRAD KTBW eyewall-circle centre (research §1c)
FMB, STP = B1.FMB, B1.STP
NAPLES, ENGLEWOOD = (26.099, -81.801), (26.922, -82.354)
CS, DC, KIN, SPH = "fluidpy.core.coords.", "fluidpy.diag.cyclone.", "fluidpy.core.kinematics.", "fluidpy.geo.sphere."
RAWD = Path("G:/Geophysical Fluid Dynamics/aofd-data/raw")
F_PART1 = ROOT / "movies" / "ch00" / "ch00_coordinates_flat" / "data" / "cf.json"
F_NI = RAWD / "IBTrACS-v04r01" / "IBTrACS.NI.v04r01.nc"
F_NEB = RAWD / "NE-10m-admin" / "ne_10m_admin_0_boundary_lines_land.zip"
# the radial-wind diverging map (storyboard colour contract): rose (−, inflow) ↔ pale ↔ blue (+, outflow), symmetric
UR_LUT = ["#8f2c4a", "#c4506d", "#e08aa0", "#f1c9d2", "#f2ede4", "#c4d8ee", "#8db5e2", "#4f86c9", "#2c5a9e"]
UR_LIM = 16.0
SPEED_LUT = "cmocean.speed"
DBZ_LUT = "cmocean.thermal"
HRRR_PRS = "s3://hrrrzarr/prs/20220928/20220928_18z_anl.zarr"
PRS_LEVELS = [975, 925, 850, 700, 500, 300, 200, 150, 125]
PRS_BOX = ((24.5, 28.5), (-84.5, -80.5))     # the research window (cache hits)
PRS_BOX_STACK = ((24.0, 29.0), (-85.2, -79.7))   # ±250 km round the calm centre and a margin (stack layers)
STACK_LEVELS = [925, 850, 500, 200, 150]
NEXRAD_URL = "https://unidata-nexrad-level2.s3.amazonaws.com/2022/09/28/KTBW/KTBW20220928_180148_V06"
GOES_B = "https://noaa-goes16.s3.amazonaws.com/ABI-L2-CMIPM/2022/271/18/"
GOES_FILES = {1: "OR_ABI-L2-CMIPM1-M6C01_G16_s20222711801253_e20222711801310_c20222711801367.nc",
              2: "OR_ABI-L2-CMIPM1-M6C02_G16_s20222711801253_e20222711801310_c20222711801369.nc",
              3: "OR_ABI-L2-CMIPM1-M6C03_G16_s20222711801253_e20222711801310_c20222711801378.nc"}
AMPHAN_SID = "2020136N10088"
ERA5_LEVELS = [1000, 975, 925, 850, 700, 500, 300, 200, 150, 125]
ETOPO_URL = "https://www.ngdc.noaa.gov/thredds/dodsC/global/ETOPO2022/60s/60s_surface_elev_netcdf/ETOPO_2022_v1_60s_N90W180_surface.nc"
PLACES_BD = {"Kolkata": (22.57, 88.36), "Satkhira": (22.72, 89.07), "Khulna": (22.842, 89.558)}
# flood visuals v3 DECIDED by the user 2026-11-05 (reports/data/ch00_coordinates_flood_visuals.md §v3.2): Amphan keeps the zoom
# flight, track, landfall and shelf (s29); the swipe (s30) is Cyclone Nargis 2008 (Irrawaddy delta), MODIS 7-2-1; Ian: no swipe.
FLOOD = {"status": "DECIDED v3 (user 2026-11-05): flight = Amphan, swipe = Nargis 2008", "EVENT": "Cyclone Amphan", "BASIN": "Bay of Bengal",
         "LANDFALL_PLACE": "Sundarbans", "bay_box_wsen": [84.0, 15.0, 94.0, 25.0]}
NARGIS = {"EVENT": "Cyclone Nargis", "YEAR": 2008, "PLACE": "Irrawaddy delta, Myanmar", "SENSOR": "MODIS (Terra)", "BANDS": "7-2-1",
          "BEFORE": "21 Apr 2008", "AFTER": "5 May 2008", "LANDFALL": "2 May 2008", "box_wsen": [94.0, 15.6, 96.6, 17.1], "crop_wsen": [94.15, 15.70, 96.45, 17.10],
          "stretch": [[0.0, 0.32], [0.0, 0.42], [0.0, 0.20]],
          "places": [["Yangon", 16.80, 96.16], ["Pathein", 16.78, 94.73], ["Bogale", 16.29, 95.40], ["Labutta", 16.15, 94.76]]}
# measured rising air (reports/data/ch00_coordinates_vertical_motion.md §3, user 2026-11-05): NOAA P-3 tail Doppler radar (TDR),
# mission 20220928H1, analysis 09:49-12:47 UTC (centre 10:23), HRD Level 2; anonymous FTP (the AOML HTTPS tree is down).
# Original files are NOT redistributable (HRD policy): the raw file stays on G:, only ring means and pictures ship.
TDR_HOST = "ftp.aoml.noaa.gov"
TDR_PATH = "/pub/hrd/data/radar/level2/2022/ian/20220928H1/220928H1_1023_xy.nc.gz"
TDR_BYTES = 8_266_017                                      # FTP SIZE (research get_tdr.py, 2026-11-05)
TDR_T = "2022-09-28T10:23"
TDR_COV = 0.7                                              # a ring mean needs >= 70 % of the ring's grid cells with data
W_LIM = 4.0                                                # colour range of the w panel 0 .. +4 m/s (≤ 0 drawn as 0)
W_LUT = "cmocean.dense"
# the continuity cross-check needs all 37 HRRR f00 pressure levels with T and q: the NOAA GRIB (the zarr store has 9 levels, no T)
HRRR_F00_URL = "https://noaa-hrrr-bdp-pds.s3.amazonaws.com/hrrr.20220928/conus/hrrr.t18z.wrfprsf00.grib2"
VM_RES = Path("G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates/research/vertical_motion")
SCR = Path("G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_storm/build1/vm")
RD_AIR = 287.04


def gee_cached(name: str, ext: str = "npy") -> Path:
    """A GEE array of the flood research through fetch() (cache hit). The retrieve callable refuses to run here: a re-fetch
    needs Earth Engine (.venv-maps, research/flood_v2/_scripts/geefetch.py)."""
    from fluidpy.data import fetch

    def _refuse(tmp: Path) -> None:
        raise RuntimeError(f"GEE array {name} is not cached; fetch it with research/flood_v2/_scripts (needs .venv-maps)")
    return fetch(f"ee://ch00_flood_v2/{name}", key="GEE", fname=f"ch00_flood_v2/{name}.{ext}", expected_bytes=20_000_000,
                 retrieve=_refuse, quiet=True)


def s1_new_water(vb_: np.ndarray, va_: np.ndarray, jrc_seasonality: np.ndarray, sbox: list[float]) -> dict:
    """Amphan's new water in the Sentinel-1 pair (s30; UN-SPIDER practice, adapted): VV < −18 dB after and not before, a drop of
    ≥ 3 dB, not permanent water (JRC seasonality ≥ 10 months), blobs ≥ 9 px (8-connected). Shared by the full build and the
    notes-2 patch (notes2 S5: the pixel count and the pixel area are shown and said; the counted pixels are marked on the picture).

    Parameters: vb_, va_ VV [dB] before / after (NaN = no data); jrc_seasonality [months]; sbox [W, S, E, N] [degrees].
    Returns {mask (bool array), n_px, km2_px [km²], px_m [m], new_km2 [km²], valid (bool array)}."""
    from scipy import ndimage as NDI
    s1w = vb_.shape[1]
    px_km = (sbox[2] - sbox[0]) * 111.32 * np.cos(np.deg2rad(0.5 * (sbox[1] + sbox[3]))) / s1w
    km2_px = px_km ** 2
    valid = np.isfinite(vb_) & np.isfinite(va_)
    wb_s, wa_s = (vb_ < -18.0) & valid, (va_ < -18.0) & valid
    new_raw = wa_s & ~wb_s & ((va_ - vb_) <= -3.0) & ~(jrc_seasonality >= 10)
    lab_, nlab_ = NDI.label(new_raw, structure=np.ones((3, 3)))
    sizes_ = NDI.sum(new_raw, lab_, index=np.arange(1, nlab_ + 1))
    new_s1 = np.isin(lab_, 1 + np.where(sizes_ >= 9)[0])
    n_px = int(new_s1.sum())
    return {"mask": new_s1, "n_px": n_px, "km2_px": float(km2_px), "px_m": float(px_km * 1000), "new_km2": float(n_px * km2_px), "valid": valid}


S1_SAY = {"s1_npx": 34700, "s1_px_m": 60, "s1_px_km2": 0.0036}   # notes2 S5: as said and shown (rounded)


def s1_fields(NW: dict) -> dict:
    """the cs.json fields of the new-water count (notes2 S5)"""
    return {"n_new_px": NW["n_px"], "px_m": NW["px_m"]}


def s1_rows(row, NW: dict) -> None:
    """DS38 (notes2 S5): the inputs of the 125 km², as shown and said: ≈ 34 700 pixels × (60 m × 60 m = 0.0036 km²) ≈ 125 km²"""
    row("DS38", f"Sentinel-1 new water = pixel count × pixel area: {NW['n_px']} px × {NW['km2_px']:.7f} km² = {NW['new_km2']:.2f} km²; pixel side "
        f"{NW['px_m']:.2f} m ('sixty metres'); 60 × 60 = 3600 m² = 0.0036 km²; said 34 700 × 0.0036 = 124.92 ≈ 125 km²",
        [NW["n_px"] * NW["km2_px"], NW["px_m"], 60 * 60 / 1e6, abs(NW["n_px"] - S1_SAY["s1_npx"]), S1_SAY["s1_npx"] * S1_SAY["s1_px_km2"]],
        [124.92, 60.0, 0.0036, 0, 125.0], [0.05, 0.5, 1e-12, 50, 0.5])


def s1_mask_png(mask: np.ndarray, path: Path) -> None:
    """notes2 S5: the counted new-water pixels as a cyan RGBA overlay at the radar picture's own grid (one picture pixel = one radar
    pixel; transparent elsewhere). Display aid only: the count is mask.sum()."""
    rgb = np.zeros(mask.shape + (3,), np.uint8)
    rgb[...] = (0, 229, 255)
    png_rgba(rgb, np.where(mask, 255, 0).astype(np.uint8), path)


def storm_stretch(rgb: np.ndarray, lo: float = 120.0, hi: float = 252.0, gamma: float = 1.6) -> np.ndarray:
    """notes2 S6: contrast enhancement of the GIBS MODIS Aqua true-colour picture of Nargis (2 May 2008), whose cloud tops are
    nearly uniform white: one linear stretch lo…hi → 0…1 on all three channels, then γ (the eye and the spiral bands show;
    the source line says 'contrast enhanced', as the GOES and MODIS Amphan pictures)."""
    x = np.clip((rgb.astype(np.float32) - lo) / (hi - lo), 0, 1) ** gamma
    return (x * 255 + 0.5).astype(np.uint8)


def tdr_retriever(path: str):
    """the FTP retrieve callable for fetch() (research vertical_motion/_scripts/get_tdr.py)"""
    def run(out: Path) -> None:
        import ftplib
        f = ftplib.FTP(TDR_HOST, timeout=120)
        f.login()
        with open(out, "wb") as fh:
            f.retrbinary(f"RETR {path}", fh.write)
        f.quit()
    return run


def tdr_ring_mean(F: np.ndarray, r: np.ndarray, edges: np.ndarray, min_cov: float = 0.5) -> tuple[np.ndarray, np.ndarray]:
    """Azimuthal (ring) means of a TDR field (level, y, x) in radius bins about the analysis origin; a bin with less than
    `min_cov` of its cells holding data is NaN. Mirrors research vertical_motion/_scripts/tdr_section.py::ring_mean."""
    nz = F.shape[0]
    M = np.full((nz, len(edges) - 1), np.nan)
    Cv = np.zeros_like(M)
    for j in range(len(edges) - 1):
        m = (r >= edges[j]) & (r < edges[j + 1])
        if not m.any():
            continue
        sub = F[:, m]
        Cv[:, j] = np.isfinite(sub).mean(axis=1)
        with np.errstate(all="ignore"):
            M[:, j] = np.nanmean(sub, axis=1)
    M[Cv < min_cov] = np.nan
    return M, Cv


def hrrr_grib_box(p: Path, out: Path, box=PRS_BOX) -> Path:
    """Box subset of an HRRR wrfprs GRIB2, message by message with eccodes (u, v earth-relative; ω, z, T, q on all isobaric
    levels 100-1000 hPa). Mirrors research vertical_motion/_scripts/hrrr_grib_prs.py; the product is cached on G: scratch."""
    if out.exists():
        return out
    import eccodes as ec
    import fluidpy.data.hrrr as HR
    keep = {"w": "omega", "u": "u", "v": "v", "gh": "z", "t": "t", "q": "q"}
    fields: dict = {}
    js = is_ = lat = lon = None
    with open(p, "rb") as fh_:
        while True:
            g = ec.codes_grib_new_from_file(fh_)
            if g is None:
                break
            try:
                sn, tl = ec.codes_get(g, "shortName"), ec.codes_get(g, "typeOfLevel")
                if tl != "isobaricInhPa" or sn not in keep:
                    continue
                lv = float(ec.codes_get_double(g, "level")) if ec.codes_get(g, "pressureUnits") == "hPa" else ec.codes_get_double(g, "level") / 100.0
                if lv < 100 or lv > 1000:
                    continue
                nj, ni = ec.codes_get(g, "Nj"), ec.codes_get(g, "Ni")
                if js is None:
                    la = ec.codes_get_array(g, "latitudes").reshape(nj, ni)
                    lo = ec.codes_get_array(g, "longitudes").reshape(nj, ni)
                    lo = np.where(lo > 180, lo - 360, lo)
                    m = (la >= box[0][0]) & (la <= box[0][1]) & (lo >= box[1][0]) & (lo <= box[1][1])
                    jj, ii = np.where(m)
                    js, is_ = slice(jj.min(), jj.max() + 1), slice(ii.min(), ii.max() + 1)
                    lat, lon = la[js, is_].astype(np.float32), lo[js, is_].astype(np.float32)
                fields[(keep[sn], lv)] = ec.codes_get_values(g).reshape(nj, ni)[js, is_].astype(np.float32)
            finally:
                ec.codes_release(g)
    levels = sorted({lv for (_, lv) in fields}, reverse=True)
    st = {k: np.stack([fields[(k, lv)] for lv in levels]) for k in keep.values()}
    ue, ve = HR.earth_relative(st["u"], st["v"], lon[None].astype(float))
    st["u"], st["v"] = np.asarray(ue, np.float32), np.asarray(ve, np.float32)
    ds = xr.Dataset({k: (("level", "y", "x"), v) for k, v in st.items()} | {"lat": (("y", "x"), lat), "lon": (("y", "x"), lon)},
                    coords={"level": ("level", np.array(levels, np.float32), {"units": "hPa"})},
                    attrs={"source_url": HRRR_F00_URL, "processing": "box 24.5-28.5N 84.5-80.5W, winds earth-relative; omega = VVEL [Pa/s]; z = HGT [gpm]"})
    out.parent.mkdir(parents=True, exist_ok=True)
    tmp = out.with_suffix(".part.nc")
    ds.to_netcdf(tmp, encoding={k: {"zlib": True, "complevel": 4} for k in ds.data_vars})
    tmp.replace(out)
    return out


def continuity_w(rc_m: np.ndarray, z_m: np.ndarray, rho: np.ndarray, vr: np.ndarray, smooth_km: float = 12.0, ztop_m: float = 13e3) -> np.ndarray:
    """Ring-mean w from ring-mean ρ and u_r by the steady (∂ρ/∂t neglected) axisymmetric continuity equation in cylindrical coordinates,
        (1/r) ∂(r ρ ū_r)/∂r + ∂(ρ w̄)/∂z = 0  ⇒  ρ w̄(r, z) = −∫₀^z (1/r) ∂(r ρ ū_r)/∂r dz′,  w̄(z = 0) = 0
    (Vallis §1.2 "The Mass Continuity Equation", steady and ring-averaged, written in cylindrical coordinates (Kundu App. B
    §B.5); provenance only, no equation number transcribed here). rc_m radii [m] (n_r,),
    z_m heights [m] (n_z,) ascending, rho [kg m⁻³] and vr [m s⁻¹] (n_z, n_r). ū_r is smoothed by a `smooth_km` boxcar in r
    before the r-derivative; trapezoid rule upward; NaN above `ztop_m` (error piles up). Mirrors research
    vertical_motion/_scripts/vm_sections.py::continuity_w (proposed for fluidpy.diag.cyclone)."""
    dr = rc_m[1] - rc_m[0]
    nsm = max(1, int(round(smooth_km * 1e3 / dr)))
    if nsm > 1:
        ker = np.ones(nsm) / nsm
        vr = np.array([np.convolve(np.pad(row_, nsm // 2, mode="edge"), ker, mode="valid")[: row_.size] for row_ in vr])
    flux = rc_m[None, :] * rho * vr
    div = np.gradient(flux, rc_m, axis=1) / rc_m[None, :]
    rw = np.zeros_like(div)
    for k_ in range(1, div.shape[0]):
        rw[k_] = rw[k_ - 1] - 0.5 * (div[k_] + div[k_ - 1]) * (z_m[k_] - z_m[k_ - 1])
    w_ = rw / rho
    w_[z_m > ztop_m] = np.nan
    return w_


def hrrr_ring_continuity(H: xr.Dataset, centre, edges_km: np.ndarray) -> dict:
    """Ring-mean u_r, ρ, z of an HRRR pressure-level box (grid-point bins about `centre`, pressure levels below the sea
    dropped point by point) and the continuity w (research vm_sections.py::model_section, continuity part). ρ = p/(R_d T_v),
    T_v = T (1 + 0.608 q); u_r = (u x + v y)/r on the local tangent plane (x = a cos ϑc Δλ, y = a Δϑ; metres)."""
    g_ = lambda k_: H[k_].values.astype(float)  # noqa: E731
    lev = H.level.values.astype(float)
    lat_, lon_ = H.lat.values.astype(float), H.lon.values.astype(float)
    u_, v_, z_ = g_("u"), g_("v"), g_("z")
    rho = (lev * 100.0)[:, None, None] / (RD_AIR * g_("t") * (1 + 0.608 * g_("q")))
    x_ = A_E * np.cos(centre[0] * D2R) * (lon_ - centre[1]) * D2R
    y_ = A_E * (lat_ - centre[0]) * D2R
    r_ = np.hypot(x_, y_)
    ur = (u_ * x_ + v_ * y_) / np.where(r_ > 0, r_, np.nan)
    below = z_ < 0
    ur[below], rho[below] = np.nan, np.nan
    zb = np.where(below, np.nan, z_)
    rkm = r_ / 1e3
    rc = 0.5 * (edges_km[1:] + edges_km[:-1])

    def bins(F):
        out = np.full((F.shape[0], len(rc)), np.nan)
        for j_ in range(len(rc)):
            m = (rkm >= edges_km[j_]) & (rkm < edges_km[j_ + 1])
            if m.sum() >= 3:
                with np.errstate(all="ignore"):
                    out[:, j_] = np.nanmean(F[:, m], axis=1)
        return out
    VRb, RHb, Zb = bins(ur), bins(rho), bins(zb)
    o = np.argsort(np.nanmean(Zb, axis=1))
    VRb, RHb, Zb, lev = VRb[o], RHb[o], Zb[o], lev[o]
    ok = np.isfinite(Zb).all(axis=1) & np.isfinite(VRb).all(axis=1)
    Zc = np.vstack([np.zeros((1, Zb.shape[1])), Zb[ok]])
    WC = continuity_w(rc * 1e3, Zc, np.vstack([RHb[ok][:1], RHb[ok]]), np.vstack([VRb[ok][:1], VRb[ok]]))
    return {"rc": rc, "z": Zc.mean(axis=1), "wc": WC, "levels": lev[ok], "vr": VRb[ok]}


def slanted_max(F: np.ndarray, rc: np.ndarray, zc_km: np.ndarray, heights=(2, 5, 8, 11), rlim=(15, 80)) -> list[list[float]]:
    """the strongest ring-mean value at each height (nearest level) for rlim[0] ≤ r ≤ rlim[1]: [[z, value, r], …]"""
    out = []
    for zk in heights:
        k_ = int(np.nanargmin(np.abs(zc_km - zk)))
        f_ = np.where((rc >= rlim[0]) & (rc <= rlim[1]), F[k_], np.nan)
        j_ = int(np.nanargmax(f_))
        out.append([float(zc_km[k_]), float(f_[j_]), float(rc[j_])])
    return out


def png_rgba(rgb: np.ndarray, alpha: np.ndarray | None, path: Path) -> None:
    from PIL import Image
    a = np.full(rgb.shape[:2], 255, np.uint8) if alpha is None else alpha.astype(np.uint8)
    Image.fromarray(np.dstack([rgb.astype(np.uint8), a]), "RGBA").save(path, optimize=True)


def colour(F: np.ndarray, lut: np.ndarray, lo: float, hi: float) -> np.ndarray:
    t = np.nan_to_num(np.clip((F - lo) / (hi - lo), 0, 1), nan=0.5)
    return lut[np.round(t * (len(lut) - 1)).astype(int)]


def zero_line(F: np.ndarray, width: int = 2) -> np.ndarray:
    """pixels next to a sign change of F (the bold zero contour), dilated by `width`"""
    from scipy.ndimage import binary_dilation
    s = np.sign(np.nan_to_num(F, nan=0.0))
    e = np.zeros(F.shape, bool)
    e[1:, :] |= (s[1:, :] * s[:-1, :] < 0)
    e[:, 1:] |= (s[:, 1:] * s[:, :-1] < 0)
    e &= np.isfinite(F)
    return binary_dilation(e, iterations=width)


def draw_lines(img: np.ndarray, lines_px: list[np.ndarray], rgb, w: int) -> np.ndarray:
    from PIL import Image, ImageDraw
    im = Image.fromarray(img)
    d = ImageDraw.Draw(im)
    for L in lines_px:
        if len(L) >= 2:
            d.line([tuple(map(float, p)) for p in L], fill=tuple(rgb), width=w, joint="curve")
    return np.asarray(im)


def notes2_patch(publics: list[Path]) -> int:
    """notes-2 fast path (2026-11-06, the full build takes ≈ 1 h): the same functions as the full build (s1_new_water, s1_mask_png,
    s1_fields, s1_rows, storm_stretch) on the same cached inputs; asserts that the recomputed new-water area equals the one in
    cs.json, then adds amphan_s1.n_new_px / px_m and say.s1_npx / s1_px_m / s1_px_km2, writes img/amphan_s1_new.png and the
    contrast-enhanced img/nargis_storm.jpg, appends the DS38 rows and refreshes the manifest's data / asset hashes and sizes."""
    from PIL import Image
    import fluidpy.data.gibs as GB2
    V = json.loads((DATA / "cs.json").read_text(encoding="utf-8"))
    M = json.loads((OUT / "manifest.json").read_text(encoding="utf-8"))
    rows: list[dict] = []

    def row(wid, name, val, ref, tol):
        v, r = np.asarray(val, dtype=float), np.asarray(ref, dtype=float)
        ok = bool(np.all(np.abs(v - r) <= np.asarray(tol)))
        rows.append({"id": wid, "name": name, "value": B1.r6(np.ravel(v)[:12]), "ref": B1.r6(np.ravel(r)[:12]), "tol": tol, "pass": ok, "kind": "check"})
    SBOX = V["amphan_s1"]["box_wsen"]
    S1 = np.load(gee_cached("close_s1", "npz"))
    JR = np.load(gee_cached("close_jrc", "npz"))["jrc"]
    vb_ = S1["s1_o150_2020-05-16"]["VV"].astype(np.float32)
    va_ = S1["s1_o150_2020-05-22"]["VV"].astype(np.float32)
    vb_[vb_ == 0], va_[va_ == 0] = np.nan, np.nan
    NW = s1_new_water(vb_, va_, JR["seasonality"], SBOX)
    if abs(NW["new_km2"] - V["amphan_s1"]["new_km2"]) > 1e-9 or abs(NW["km2_px"] - V["amphan_s1"]["km2_px"]) > 1e-15:
        print(f"notes2 patch: recomputed new water {NW['new_km2']} km² != cs.json {V['amphan_s1']['new_km2']} — stop")
        return 1
    s1_rows(row, NW)
    if not all(r["pass"] for r in rows):
        print("notes2 patch: DS38 FAILED", rows)
        return 1
    s1_mask_png(NW["mask"], IMG / "amphan_s1_new.png")
    gst = GB2.fetch_wms("MODIS_Aqua_CorrectedReflectance_TrueColor", "2008-05-02", (12.6, 19.6), (89.5, 100.5), width=1920, tag="nargis_storm")
    Image.fromarray(storm_stretch(np.asarray(Image.open(gst).convert("RGB")))).save(IMG / "nargis_storm.jpg", quality=92)
    V["amphan_s1"].update(s1_fields(NW))
    V["say"].update(S1_SAY)
    blob = json.dumps(V, separators=(",", ":"), ensure_ascii=False, allow_nan=False).encode("utf-8")
    (DATA / "cs.json").write_bytes(blob)
    imgs = sorted(list(IMG.glob("*.png")) + list(IMG.glob("*.jpg")))
    data_hashes = {"cs.json": hashlib.sha256(blob).hexdigest(), **{f"img/{p.name}": B1.sha_file(p) for p in imgs}}
    render = M.get("render_assets", {})
    for pub in publics:
        pub.mkdir(parents=True, exist_ok=True)
        for pimg in imgs:
            (pub / f"cst_{pimg.name}").write_bytes(pimg.read_bytes())
        render = {pp_.name: B1.sha_file(pp_) for pp_ in sorted(pub.glob("cst_*"))}
    M["data_files"], M["render_assets"] = data_hashes, render
    M["data_sizes_bytes"] = {k: (DATA / k).stat().st_size for k in data_hashes}
    M["checks"] = [r for r in M["checks"] if r["id"] != "DS38"] + rows
    M["parameters"]["flood_u1"]["amphan_s1"]["count"] = (f"notes2: {NW['n_px']} new-water pixels × {NW['km2_px']:.7f} km² (pixel side {NW['px_m']:.2f} m); "
                                                         "img/amphan_s1_new.png = the counted pixels (cyan, display only)")
    M["parameters"]["amphan"]["nargis_storm"] = "notes2: GIBS MODIS Aqua 2008-05-02 true colour, contrast enhanced (all channels 120-252 → 0-255, γ 1.6)"
    M["notes2_patch"] = "2026-11-06: build_ch00_coordinates_storm.py --notes2-patch (same functions as the full build)"
    (OUT / "manifest.json").write_text(json.dumps(M, indent=1, ensure_ascii=False, default=str), encoding="utf-8")
    print(f"notes2 patch: {NW['n_px']} px × {NW['km2_px']:.7f} km² = {NW['new_km2']:.3f} km²; px {NW['px_m']:.2f} m; DS38 pass; {len(imgs)} images; public {len(publics)}")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--public", type=Path, nargs="*", default=[], help="render public dir(s) for the cst_* assets (prefix cst_: Part 3 owns cs_)")
    ap.add_argument("--notes2-patch", action="store_true", help="notes-2 fast path: add the S1 pixel count + mask and the contrast-enhanced "
                    "Nargis picture to the existing cs.json / img / manifest (the full build makes the same products)")
    a = ap.parse_args()
    if a.notes2_patch:
        return notes2_patch(a.public)
    from PIL import Image
    from scipy.interpolate import griddata
    from scipy.ndimage import zoom as ndzoom
    from fluidpy.data import fetch
    Image.MAX_IMAGE_PIXELS = None
    DATA.mkdir(parents=True, exist_ok=True)
    IMG.mkdir(parents=True, exist_ok=True)
    for p in list(IMG.glob("*.png")) + list(IMG.glob("*.jpg")):
        p.unlink()
    import yaml
    VO = {s_["id"]: s_["voiceover"] for s_ in yaml.safe_load((OUT / "storyboard.yaml").read_text(encoding="utf-8"))["scenes"]}  # narration flags read the storyboard
    rows: list[dict] = []
    entries: list[dict] = []
    heavy: list[dict] = []
    inputs: list[Path] = []
    V: dict = {}
    say: dict = {}

    def row(wid, name, val, ref, tol):
        v, r = np.asarray(val, dtype=float), np.asarray(ref, dtype=float)
        ok = bool(np.all(np.abs(v - r) <= np.asarray(tol)))
        rows.append({"id": wid, "name": name, "value": B1.r6(np.ravel(v)[:12]), "ref": B1.r6(np.ravel(r)[:12]), "tol": tol, "pass": ok, "kind": "check"})

    def truth(wid, name, cond, value=None):
        rows.append({"id": wid, "name": name, "value": value if value is not None else bool(cond), "ref": True, "tol": 0, "pass": bool(cond), "kind": "check"})

    def flag(wid, name, cond, value, note):
        rows.append({"id": wid, "name": name, "value": value, "ref": True, "tol": 0, "pass": bool(cond), "kind": "flag", "note": note})

    def desc(v):
        if isinstance(v, (int, float, str, type(None), tuple, list)):
            return v if not (isinstance(v, (tuple, list)) and len(v) > 12) else f"list of {len(v)}"
        if callable(v):
            return f"callable {getattr(v, '__name__', 'lambda')}"
        if isinstance(v, (xr.Dataset, xr.DataArray)):
            return f"xarray {type(v).__name__} ({', '.join(map(str, getattr(v, 'dims', {})))})"
        try:
            return f"array {np.shape(v)}, sha256 {B1.parity_hash(v)}"
        except Exception:
            return str(type(v))

    def call(fn: str, scene: str, eq: str, heavy_call: bool = False, **params):
        mod, name = fn.rsplit(".", 1)
        out = getattr(importlib.import_module(mod), name)(**params)
        if heavy_call:
            heavy.append({"fn": fn, "scene": scene, "eq": eq, "params": {k: desc(v) for k, v in params.items()},
                          "output_sha256": B1.parity_hash(out) if not hasattr(out, "_fields") else B1.parity_hash(str(out))})
            return out
        jp = {k: (np.asarray(v).tolist() if isinstance(v, np.ndarray) else v) for k, v in params.items()}
        try:
            h = B1.parity_hash(out)
        except Exception:
            h = None
        entries.append({"fn": fn, "scene": scene, "data": "data/cs.json", "eq": eq, "params": jp, "sha256": h})
        return out

    gcd = lambda p, q: float(call(SPH + "great_circle_distance", "-", "s = a σ (metres)", lat1=p[0], lon1=p[1], lat2=q[0], lon2=q[1]))  # noqa: E731
    brg = lambda p, q: float(call(SPH + "initial_bearing", "-", "α = atan2(sin Δλ cos ϑ₂, …)", lat1=p[0], lon1=p[1], lat2=q[0], lon2=q[1]))  # noqa: E731
    lut_ur = B1.lut_from_hex(UR_LUT)

    # ================================================================ the maths (s03-s14)
    th0 = float(np.arctan2(4.0, 3.0))                     # the balloon's angle from Part 1 (53.13°)
    E0 = call(CS + "unit_vectors_polar", "s03", "r̂ = (cos θ, sin θ), θ̂ = (−sin θ, cos θ)", theta=th0)
    row("DS02", "θ = 53.13°: r̂ = (0.6, 0.8), θ̂ = (−0.8, 0.6) (Part 1)", [np.degrees(th0), *np.ravel(E0)], [53.13, 0.6, 0.8, -0.8, 0.6], [5e-3, 1e-12, 1e-12, 1e-12, 1e-12])
    E1 = call(CS + "unit_vectors_polar", "s03", "r̂ after a 0.1-rad turn", theta=th0 + 0.1)
    ch = float(np.hypot(*(E1[0] - E0[0])))
    row("DS02", "tip of r̂ after a 0.1-rad turn: chord 0.09996 (≈ 0.1); 0.1 rad = 5.73° (≈ 6°); arc 1 × 0.1", [ch, np.degrees(0.1), 1 * 0.1], [0.09996, 5.73, 0.1], [5e-6, 5e-3, 1e-12])
    E2 = call(CS + "unit_vectors_polar", "s04", "r̂ after a 0.01-rad turn", theta=th0 + 0.01)
    c1, s1 = float(E2[0][0]), float(E2[0][1])
    row("DS03", "cos, sin after 0.01 rad: 0.59197, 0.80596 (screen 0.592, 0.806)", [c1, s1, round(c1, 3), round(s1, 3)], [0.59197, 0.80596, 0.592, 0.806], [5e-6, 5e-6, 0, 0])
    row("DS03", "FD slopes (−0.80299, 0.59599); screen (0.592 − 0.600)/0.01 = −0.8, (0.806 − 0.800)/0.01 = 0.6",
        [(c1 - 0.6) / 0.01, (s1 - 0.8) / 0.01, (0.592 - 0.600) / 0.01, (0.806 - 0.800) / 0.01], [-0.80299, 0.59599, -0.8, 0.6], [5e-5, 5e-5, 1e-9, 1e-9])
    row("DS03", "slivers: −sin θ Δθ = −0.008, cos θ Δθ = 0.006", [-0.8 * 0.01, 0.6 * 0.01], [-0.008, 0.006], 1e-15)
    h = 1e-4
    Ep, Em = call(CS + "unit_vectors_polar", "s05", "r̂(θ + h)", theta=th0 + h), call(CS + "unit_vectors_polar", "s05", "r̂(θ − h)", theta=th0 - h)
    dr = (np.asarray(Ep[0]) - np.asarray(Em[0])) / (2 * h)
    dth = (np.asarray(Ep[1]) - np.asarray(Em[1])) / (2 * h)
    row("DS04", "centred difference d r̂/dθ = θ̂ (1e-8)", dr - np.asarray(E0[1]), [0, 0], 1e-8)
    row("DS05", "centred difference d θ̂/dθ = −r̂ (1e-8)", dth + np.asarray(E0[0]), [0, 0], 1e-8)
    tr = (lambda p: (-p[1], p[0]))(tuple(E0[1]))          # Part 1's turn rule (p, q) → (−q, p) on θ̂
    row("DS05", "turn rule on θ̂ = (−sin θ, cos θ): swap (cos θ, −sin θ), minus first (−cos θ, −sin θ) = −r̂", [*tr, *(-np.asarray(E0[0]))], [-0.6, -0.8, -0.6, -0.8], 1e-12)
    t2 = np.asarray(E2[1])
    row("DS06", "θ̂(53.13° + 0.01) = (−0.80596, 0.59197) (screen −0.806, 0.592)", [*t2, round(t2[0], 3), round(t2[1], 3)], [-0.80596, 0.59197, -0.806, 0.592], [5e-6, 5e-6, 0, 0])
    row("DS06", "FD (θ̂(+0.01) − θ̂)/0.01 = (−0.59599, −0.80299); screen (−0.006, −0.008)/0.01 = (−0.6, −0.8) = −r̂",
        [*((t2 - np.asarray(E0[1])) / 0.01), -0.806 + 0.8, 0.592 - 0.6, (-0.806 + 0.8) / 0.01, (0.592 - 0.6) / 0.01], [-0.59599, -0.80299, -0.006, -0.008, -0.6, -0.8], [5e-5, 5e-5, 1e-12, 1e-12, 1e-9, 1e-9])
    for tdeg in (0.0, 25.0):
        Et = call(CS + "unit_vectors_polar", "s07", f"θ̂ at the balloon, θ = {tdeg:.0f}°", theta=np.deg2rad(tdeg))
        truth("DS06", f"θ = {tdeg:.0f}°: θ̂ points {'north' if tdeg == 0 else 'north, leaning west'} ({B1.r6(Et[1], 3)})",
              (abs(Et[1][0]) < 1e-12 and Et[1][1] == 1.0) if tdeg == 0 else (Et[1][0] < 0 and Et[1][1] > 0.8), B1.r6(Et[1], 4))
    V["circle"] = {"th": np.degrees(th0), "rhat": B1.r6(E0[0]), "thhat": B1.r6(E0[1]), "chord01": ch, "cs001": [c1, s1], "th001": B1.r6(t2)}
    # D15 product rule with easy numbers
    v0, v1, turn = 10.0, 11.0, 0.1
    d0 = np.array([1.0, 0.0])
    d1 = np.asarray(call(CS + "unit_vectors_polar", "s08", "d̂ after a 0.1-rad turn = r̂(0.1)", theta=turn)[0])
    P0, P1 = v0 * d0, v1 * d1
    dP = P1 - P0
    pieces = [(v1 - v0) * d0, v0 * (d1 - d0), (v1 - v0) * (d1 - d0)]
    row("DS07", "d̂(0.1) = (0.99500, 0.09983) (screen (0.995, 0.1)); product (10.945, 1.098) (screen (10.945, 1.1))",
        [*d1, *P1, 11 * 0.995, 11 * 0.1], [0.995, 0.09983, 10.945, 1.098, 10.945, 1.1], [5e-5, 5e-5, 5e-4, 5e-4, 1e-9, 1e-9])
    row("DS07", "pieces (1, 0), (−0.050, 0.998), (−0.005, 0.100) sum to the change (0.945, 1.098)",
        [*pieces[0], *pieces[1], *pieces[2], *(pieces[0] + pieces[1] + pieces[2] - dP)], [1, 0, -0.050, 0.998, -0.005, 0.100, 0, 0], [1e-12, 1e-12, 5e-4, 5e-4, 5e-4, 5e-4, 1e-12, 1e-12])
    row("DS07", "screen pieces with the rounded arrow: 1(1,0) + 10(−0.005, 0.1) + 1(−0.005, 0.1) = (0.945, 1.1)",
        [1 + 10 * -0.005 + 1 * -0.005, 0 + 10 * 0.1 + 1 * 0.1], [0.945, 1.1], 1e-12)
    halv = []
    for dt in (1.0, 0.5, 0.25):                                    # speed grows 1 m/s per s, arrow turns 0.1 rad per s
        dd = np.asarray(call(CS + "unit_vectors_polar", "s08", f"d̂ after Δt = {dt} s", theta=turn * dt)[0]) - d0
        halv.append([float(np.hypot(*(1.0 * dt * d0))), float(np.hypot(*(v0 * dd))), float(np.hypot(*(1.0 * dt * dd)))])
    hv = np.array(halv)
    row("DS07", "halving Δt: first two pieces halve, the cross piece quarters (ratios)", [hv[0, 0] / hv[1, 0], hv[0, 1] / hv[1, 1], hv[0, 2] / hv[1, 2], hv[1, 2] / hv[2, 2]],
        [2.0, 2.0, 4.0, 4.0], [1e-12, 0.01, 0.02, 0.02])
    # the product rule against the tested FD velocity of v(t) d̂(t) (v = 10 + t, angle 0.1 t)
    fP = lambda t: (10.0 + t) * np.array([np.cos(0.1 * t), np.sin(0.1 * t)])  # noqa: E731
    uP, _ = call(KIN + "lagrangian_velocity_acceleration", "s08", "u = dr/dt (central difference)", heavy_call=True, r_of_t=fP, t=0.0)
    row("DS07", "product rule (dv/dt) d̂ + v dd̂/dt = (1, 1.0) = FD derivative of v d̂ at t = 0", np.asarray(uP) - np.array([1.0, 10.0 * 0.1]), [0, 0], 1e-6)
    V["prod"] = {"d1": B1.r6(d1), "P1": B1.r6(P1), "dP": B1.r6(dP), "pieces": [B1.r6(p) for p in pieces], "halv": B1.r6(hv, 4)}

    # ================================================================ Hurricane Ian 10-m (s02, s09-s14, DS01)
    H = xr.open_dataset(B1.F_HRRR)
    inputs.append(B1.F_HRRR)
    times = json.loads(H.attrs["times"])
    k18, k20 = times.index("2022-09-28T18"), times.index("2022-09-28T20")
    LA2, LO2 = H.lat.values.astype(float), H.lon.values.astype(float)
    u18, v18 = H.u10.values[k18].astype(float), H.v10.values[k18].astype(float)
    sp18 = np.hypot(u18, v18)
    calm = call(DC + "storm_centre", "s17", "sub-grid minimum of the 10-m wind speed (the model's calm centre)", heavy_call=True,
                msl=sp18, lat=LA2, lon=LO2, box=(26.3, 26.7, -82.6, -82.25))
    pmin = call(DC + "storm_centre", "s17", "sub-grid minimum of the HRRR sea-level pressure", heavy_call=True,
                msl=H.mslma.values[k18].astype(float), lat=LA2, lon=LO2, box=(25.0, 28.0, -84.0, -81.0))
    row("DS01", "storyboard calm centre 26.506 N 82.441 W within 1.5 km of storm_centre(10-m speed)", gcd(CALM, (float(calm.lat), float(calm.lon))) / 1e3, 0.0, 1.5)
    RW = call(DC + "storm_relative_wind", "s02", "v_t = k·(r̂ × u), v_r = r̂·u on the 25-km ring", heavy_call=True, u=u18, v=v18, lat=LA2, lon=LO2,
              centre=CALM, radii_km=[25], n_az=72)
    vt25, vr25 = float(RW.tangential_mean[0]), float(RW.radial_mean[0])
    row("DS01", "ring 25 km, 72 points: v_t 34.80, v_r −13.30 m/s; inflow angle 20.9° (= Part 1; the task brief's 34.78 is 34.805 in the data)", [vt25, vr25, float(RW.inflow_angle_mean_deg[0])], [34.80, -13.30, 20.9], [0.01, 0.01, 0.05])
    if F_PART1.exists():
        cf = json.loads(F_PART1.read_text(encoding="utf-8"))
        row("DS01", "Part 1 cf.json ring means identical (34.80 / −13.30)", [cf["ian"]["vt"] - vt25, cf["ian"]["vr"] - vr25], [0, 0], 1e-9)
        inputs.append(F_PART1)
    say.update({"vt": 35, "vr": -13, "v348": 34.8})
    row("DS01", "said / written: about 35 round, 13 in; 34.8 (s09-s14)", [round(vt25), round(vr25), round(vt25, 1)], [35, -13, 34.8], 0)
    # D16-D19 on the ring
    r_m, v_ms = 25000.0, vt25
    om = v_ms / r_m
    row("DS08", "ω = v/r = 1.3922e-3 rad/s; 0.0798°/s; 4.79°/min; lap 4513 s = 75.2 min", [om, np.degrees(om), np.degrees(om) * 60, 2 * np.pi / om, 2 * np.pi / om / 60],
        [1.3922e-3, 0.0798, 4.79, 4513, 75.2], [5e-7, 5e-4, 5e-3, 2, 0.05])
    row("DS08", "screen: 34.8/25 000 = 0.00139; × 57.3 = 0.080 (≈ 0.08°/s) ≈ 4.8°/min (≈ 5); 2π/0.00139 = 4520 s (≈ 4500) = 75.3 min (≈ 75)",
        [34.8 / 25000, 0.00139 * 57.3, 0.00139 * 57.3 * 60, 2 * np.pi / 0.00139, 2 * np.pi / 0.00139 / 60], [0.00139, 0.0796, 4.78, 4520, 75.3], [5e-6, 5e-4, 5e-3, 5, 0.1])
    ring = lambda t: r_m * np.array([np.cos(om * t), np.sin(om * t)])  # noqa: E731
    t_ = 600.0
    uR, aR = call(KIN + "lagrangian_velocity_acceleration", "s11", "FD velocity and acceleration of r(t) = r(cos ωt, sin ωt)", heavy_call=True, r_of_t=ring, t=t_, h=0.5)
    Et_ = call(CS + "unit_vectors_polar", "s11", "r̂, θ̂ at the parcel (t = 600 s)", theta=om * t_)
    row("DS09", "FD velocity = v θ̂ (relative 1e-6)", (np.asarray(uR) - v_ms * np.asarray(Et_[1])) / v_ms, [0, 0], 1e-6)
    row("DS10", "FD acceleration = −(v²/r) r̂ (relative 1e-6)", (np.asarray(aR) + v_ms ** 2 / r_m * np.asarray(Et_[0])) / (v_ms ** 2 / r_m), [0, 0], 1e-6)
    acc = v_ms ** 2 / r_m
    row("DS11", "v²/r = 0.04845 m/s²; screen 34.8² = 1211.04 (≈ 1211); 1211/25 000 = 0.0484 (≈ 0.048); 35²/25 000 = 0.049",
        [acc, 34.8 ** 2, 1211 / 25000, 35 ** 2 / 25000], [0.04845, 1211.04, 0.04844, 0.049], [5e-5, 0.01, 5e-5, 1e-12])
    row("DS11", "g / a = 202.5 (≈ 200); 100 km/h = 27.8 m/s; screen 27.8/0.048 = 579 s (written ≈ 580 s ≈ 10 min; the storyboard row's 570 is corrected); data 573 s = 9.6 min",
        [9.81 / acc, 100 / 3.6, 27.8 / 0.048, round(27.8 / 0.048, -1), 27.78 / acc, 27.78 / acc / 60], [202.5, 27.78, 579.2, 580, 573.3, 9.56], [0.1, 0.01, 0.1, 0, 1.0, 0.02])
    dth60 = om * 60
    E60a, E60b = call(CS + "unit_vectors_polar", "s14", "θ̂ at t", theta=0.0), call(CS + "unit_vectors_polar", "s14", "θ̂ 60 s later", theta=dth60)
    dv = v_ms * (np.asarray(E60b[1]) - np.asarray(E60a[1]))
    chord, arc = float(np.hypot(*dv)), v_ms * dth60
    row("DS12", "Δθ in 60 s = 0.0835 rad (≈ 0.084) = 4.79° (≈ 5°); chord 2.9064, arc 2.9073 m/s (≈ 2.9); ÷ 60 = 0.04844 / 0.04845",
        [dth60, np.degrees(dth60), chord, arc, chord / 60, arc / 60], [0.0835, 4.79, 2.9064, 2.9073, 0.04844, 0.04845], [5e-5, 5e-3, 5e-4, 5e-4, 5e-5, 5e-5])
    row("DS12", "screen: 0.00139 × 60 = 0.0834 (≈ 0.084); 34.8 × 0.084 = 2.92 (≈ 2.9); 2.9/60 = 0.0483 (≈ 0.048)", [0.00139 * 60, 34.8 * 0.084, 2.9 / 60], [0.0834, 2.923, 0.04833], [5e-5, 5e-3, 5e-5])
    truth("DS12", "Δv points at the eye (−r̂ at the mid angle, cos > 0.999)",
          float(dv @ -np.array([np.cos(dth60 / 2), np.sin(dth60 / 2)]) / chord) > 0.999, B1.r6(dv, 4))
    fcor = float(call("fluidpy.geo.frames.coriolis_parameter", "s14", "f = 2Ω sin ϑ (ϑ in radians)", lat=np.deg2rad(26.5)))
    row("DS12", "f(26.5° N) = 6.508e-5 s⁻¹; f v = 2.265e-3 m/s²; (v²/r)/(f v) = 21.39 (≈ 20)", [fcor, fcor * v_ms, acc / (fcor * v_ms)], [6.508e-5, 2.265e-3, 21.39], [5e-8, 5e-6, 0.05])
    say.update({"om": 0.00139, "acc": 0.048, "g_ratio": 200, "dth60": 0.084, "dv60": 2.9, "lap_s": 4500, "lap_min": 75})
    V["ring"] = {"r_km": 25, "v": v_ms, "vr": vr25, "om": om, "acc": acc, "dth60": dth60, "dv60": chord, "f": fcor, "fratio": acc / (fcor * v_ms),
                 "az": B1.r6(np.degrees(RW.azimuth), 2), "u": B1.r6(RW.u[0], 2), "vv": B1.r6(RW.v[0], 2), "vt_pts": B1.r6(RW.tangential[0], 2), "vr_pts": B1.r6(RW.radial[0], 2)}
    # the s01 world outline (Natural Earth 110 m, flat [lon, lat, …]) and the s02 mini map round the calm centre
    ne110 = json.loads(B1.F_NE110.read_text(encoding="utf-8"))
    inputs.append(B1.F_NE110)
    V["world"] = [ln for ln in ne110["coastline"] if len(ln) >= 8]
    V["ian_c"] = list(CALM)
    V["coast_ian"] = B1.box_lines([p_ for _, ps in B1.shp_parts(B1.F_NE10C) for p_ in ps], (CALM[0] - 0.7, CALM[0] + 0.7, CALM[1] - 0.8, CALM[1] + 0.8), nd=3)
    # cylindrical unit vectors (s16)
    Ecyl = [np.asarray(call(CS + "unit_vectors_cylindrical", "s16", f"e_R, e_φ, e_z at φ = {p}°", phi=np.deg2rad(p))) for p in (0, 120, 240)]
    row("DS14", "ẑ identical at φ = 0, 120, 240°; r̂ turns by the azimuth (e_R(120°) = (−0.5, 0.866, 0))",
        [*(Ecyl[1][2] - Ecyl[0][2]), *(Ecyl[2][2] - Ecyl[0][2]), *Ecyl[1][0]], [0, 0, 0, 0, 0, 0, -0.5, 0.8660, 0], [0, 0, 0, 0, 0, 0, 1e-12, 5e-5, 0])

    # ================================================================ GOES-16 M1 plate round the radar eye (s15-s16, DS13)
    import fluidpy.data.goes as GO
    gp = {b: fetch(GOES_B + fn, key="GOES16-ABI", expected_bytes=12_000_000, quiet=True) for b, fn in GOES_FILES.items()}
    inputs += list(gp.values())
    half = 60.0                                                        # km: a 120 × 120 km plate
    dla, dlo = half / 111.2, half / (111.2 * np.cos(RADAR_EYE[0] * D2R))
    gbox = (RADAR_EYE[0] - dla, RADAR_EYE[0] + dla, RADAR_EYE[1] - dlo, RADAR_EYE[1] + dlo)
    res = 0.004
    ch_ = {}
    for b in (1, 2, 3):
        dsb = xr.open_dataset(gp[b])
        o_, glats, glons = call("fluidpy.data.goes.to_latlon", "s15", f"ABI fixed grid → lat/lon (C{b:02d}, nearest)", heavy_call=True,
                                ds=dsb, field="CMI", lat=(gbox[0], gbox[1]), lon=(gbox[2], gbox[3]), res=res)
        ch_[b] = np.clip(np.nan_to_num(o_), 0, 1)
    del GO
    Rr, Bb, Nn = ch_[2], ch_[1], ch_[3]
    Gg = np.clip(0.45 * Rr + 0.1 * Nn + 0.45 * Bb, 0, 1)
    rgb = (np.stack([Rr, Gg, Bb], -1) ** (1 / 2.2) * 255).astype(np.uint8)
    lum = rgb.mean(-1)
    lo_, hi_ = np.percentile(lum, [0.5, 99.5])
    st_ = (30 + 225 * np.clip((rgb.astype(float) - lo_) / (hi_ - lo_), 0, 1) ** 1.6).astype(np.uint8)
    gim = Image.fromarray(st_)
    gim = gim.resize((gim.width * 4, gim.height * 4), Image.LANCZOS)
    gim.save(IMG / "goes_eye.jpg", quality=92)
    gc = ((gbox[0] + gbox[1]) / 2, (gbox[2] + gbox[3]) / 2)
    row("DS13", "plate centred on the radar eye (≤ 2 km); 120 × 120 km; ≥ 1024 px", [gcd(gc, RADAR_EYE) / 1e3, 2 * half, min(gim.size) >= 1024], [0, 120, 1], [2.0, 0, 0])
    GLA_, GLO_ = np.meshgrid(glats, glons, indexing="ij")
    dk = np.hypot((GLA_ - RADAR_EYE[0]) * 111.2, (GLO_ - RADAR_EYE[1]) * 111.2 * np.cos(RADAR_EYE[0] * D2R))
    eye_l, wall_l = float(lum[dk < 8].mean()), float(lum[(dk > 22) & (dk < 38)].mean())
    truth("DS13", f"eye pixels darker than the eyewall ring (mean luminance {eye_l:.0f} < {wall_l:.0f})", eye_l < wall_l - 5, [eye_l, wall_l])
    V["goes"] = {"box": list(gbox), "half_km": half, "stretch": {"lum_lo": float(lo_), "lum_hi": float(hi_), "out": [30, 255], "gamma": 1.6}}

    # ================================================================ NEXRAD KTBW radar eye (s17, DS15)
    from metpy.io import Level2File
    pr_ = fetch(NEXRAD_URL, key="NEXRAD-L2", expected_bytes=19_400_000, quiet=True)
    inputs.append(pr_)
    L2 = Level2File(str(pr_))
    rlat, rlon = float(L2.sweeps[0][0][1].lat), float(L2.sweeps[0][0][1].lon)
    az = np.array([ray[0].az_angle for ray in L2.sweeps[0]])
    el0 = float(np.mean([ray[0].el_angle for ray in L2.sweeps[0]]))
    hdr = L2.sweeps[0][0][4][b"REF"][0]
    rng = hdr.first_gate + np.arange(hdr.num_gates) * hdr.gate_width          # km
    ref = np.array([ray[4][b"REF"][1] for ray in L2.sweeps[0]], dtype=float)
    gr = np.asarray(call("fluidpy.diag.radar.beam_ground_range", "s17", "ground range of the 0.5° beam (4/3-Earth)", heavy_call=True, r=rng * 1e3, elev_deg=el0))
    PLAT = np.zeros((len(az), len(rng)))
    PLON = np.zeros_like(PLAT)
    for i_, a_ in enumerate(az):                                           # gate positions by the tested destination point (metres)
        q = call(SPH + "destination_point", "s17", "gate positions along each ray", heavy_call=True, lat=rlat, lon=rlon, bearing=float(a_), distance=gr)
        PLAT[i_], PLON[i_] = np.asarray(q[0]), np.asarray(q[1])
    rbox_h = 80.0
    rla, rlo = rbox_h / 111.2, rbox_h / (111.2 * np.cos(RADAR_EYE[0] * D2R))
    rbox = [RADAR_EYE[0] - rla, RADAR_EYE[0] + rla, RADAR_EYE[1] - rlo, RADAR_EYE[1] + rlo]
    rres = 0.004
    rlats = np.arange(rbox[1] - rres / 2, rbox[0], -rres)
    rlons = np.arange(rbox[2] + rres / 2, rbox[3], rres)
    RLO, RLA = np.meshgrid(rlons, rlats)
    sel = (PLAT > rbox[0] - 0.2) & (PLAT < rbox[1] + 0.2) & (PLON > rbox[2] - 0.2) & (PLON < rbox[3] + 0.2) & np.isfinite(ref)
    from scipy.spatial import cKDTree
    cosr = np.cos(RADAR_EYE[0] * D2R)
    tree = cKDTree(np.c_[PLAT[sel], PLON[sel] * cosr])
    dd_, ii_ = tree.query(np.c_[RLA.ravel(), RLO.ravel() * cosr])
    dbz = ref[sel][ii_].reshape(RLA.shape)
    dbz[(dd_.reshape(RLA.shape) * 111.2) > 2.0] = np.nan
    # eyewall circle: inner edge of the >= 35 dBZ ring on 72 rays from a first guess (IBTrACS 26.6 N 82.4 W), Kasa fit, 4 passes
    cen = np.array([26.6, -82.4])
    from scipy.interpolate import RegularGridInterpolator
    fdbz = RegularGridInterpolator((rlats[::-1], rlons), dbz[::-1], bounds_error=False, fill_value=np.nan)
    for _ in range(4):
        ptsE = []
        for a_ in np.arange(0, 360, 5.0):
            rr_ = np.arange(3.0, 60.0, 0.25)
            qa = cen[0] + rr_ * np.cos(a_ * D2R) / 111.2
            qo = cen[1] + rr_ * np.sin(a_ * D2R) / (111.2 * np.cos(cen[0] * D2R))
            zz = fdbz(np.c_[qa, qo])
            hit = np.where(zz >= 35)[0]
            if hit.size:
                ptsE.append((qa[hit[0]], qo[hit[0]]))
        P_ = np.array(ptsE)
        X_ = (P_[:, 1] - cen[1]) * 111.2 * np.cos(cen[0] * D2R)
        Y_ = (P_[:, 0] - cen[0]) * 111.2
        Am = np.c_[2 * X_, 2 * Y_, np.ones_like(X_)]
        sol = np.linalg.lstsq(Am, X_ ** 2 + Y_ ** 2, rcond=None)[0]
        cen = np.array([cen[0] + sol[1] / 111.2, cen[1] + sol[0] / (111.2 * np.cos(cen[0] * D2R))])
        rfit = float(np.sqrt(sol[2] + sol[0] ** 2 + sol[1] ** 2))
    row("DS15", f"eyewall circle fit (inner edge of ≥ 35 dBZ, {len(P_)} rays) within 3 km of the research radar eye; radius ≈ 30 km",
        [gcd(tuple(cen), RADAR_EYE) / 1e3, rfit], [0.0, 29.7], [3.0, 4.0])
    d_eye = gcd(RADAR_EYE, CALM) / 1e3
    b_eye = brg(RADAR_EYE, CALM)
    sig = float(call(SPH + "central_angle", "s17", "σ between the radar eye and the model centre", lat1=RADAR_EYE[0], lon1=RADAR_EYE[1], lat2=CALM[0], lon2=CALM[1]))
    row("DS15", "radar eye → model centre 17.0 km (≈ 17) at bearing 252.5° (WSW: 247.5-258.75); a σ = distance",
        [d_eye, b_eye, sig * 6.371e3 - d_eye], [17.0, 252.5, 0], [0.15, 0.3, 1e-6])
    ibt = json.loads(B1.F_IBT.read_text(encoding="utf-8"))
    inputs.append(B1.F_IBT)
    kb = ibt["time"].index("2022-09-28 18:00:00")
    row("DS15", "HRRR msl minimum 960.3 hPa (said 960); IBTrACS USA 938 hPa at 18 UTC", [float(pmin.msl_min) / 100, ibt["usa_pres_hPa"][kb]], [960.3, 938], [0.05, 0])
    lut_dbz = B1.lut_rgb(DBZ_LUT)
    rgbR = colour(dbz, lut_dbz, 0, 60)
    alR = np.where(np.isfinite(dbz) & (dbz >= 5), 255, 0)
    up = 3
    png_rgba(np.repeat(np.repeat(rgbR, up, 0), up, 1), np.repeat(np.repeat(alR, up, 0), up, 1), IMG / "radar_ktbw.png")
    # the HRRR 10-m speed on the SAME box (the model's calm centre marked; never the radar eye on this picture)
    PTS = np.stack([LO2.ravel(), LA2.ravel()], -1)
    sp_box = griddata(PTS, sp18.ravel(), (RLO, RLA), method="linear")
    rgbS = colour(sp_box, B1.lut_rgb(SPEED_LUT), 0, 55)
    png_rgba(np.repeat(np.repeat(rgbS, up, 0), up, 1), None, IMG / "hrrr_s17.png")
    truth("DS15", "radar and model pictures ≥ 1024 px", min(Image.open(IMG / "radar_ktbw.png").size) >= 1024, list(Image.open(IMG / "radar_ktbw.png").size))
    coast = [p for _, ps in B1.shp_parts(B1.F_NE10C) for p in ps]
    inputs.append(B1.F_NE10C)
    say.update({"radar_r": 30, "d_eye": 17, "p_model": 960, "p_best": 938})
    V["s17"] = {"box": rbox, "radar": [rlat, rlon], "eye_fit": B1.r6(cen, 4), "r_fit": rfit, "radar_eye": list(RADAR_EYE), "calm": list(CALM),
                "d_eye": d_eye, "brg": b_eye, "pmin": float(pmin.msl_min) / 100, "best": ibt["usa_pres_hPa"][kb], "elev": el0,
                "coast": B1.box_lines(coast, (rbox[0] - 0.1, rbox[1] + 0.1, rbox[2] - 0.1, rbox[3] + 0.1), nd=3)}

    # ================================================================ HRRR on pressure levels: stack and section (s18-s20, DS16-DS18)
    import fluidpy.data.hrrr as HR
    from fluidpy.data import open_remote
    sfc_isel = eval(xr.open_dataset(RAWD / "HRRR-zarr" / "hrrr_ian_2022_20220928T18_u10.nc").attrs["fluidpy_subset"], {"slice": slice})["isel"]  # recorded by fetch()
    dx = float(H.x.values[1] - H.x.values[0])
    X0 = float(H.x.values[0]) - sfc_isel["projection_x_coordinate"].start * dx
    Y0 = float(H.y.values[0]) - sfc_isel["projection_y_coordinate"].start * dx
    XF, YF = X0 + np.arange(1799) * dx, Y0 + np.arange(1059) * dx               # the HRRR CONUS grid (1799 × 1059, 3 km)

    def window_xy(fn):
        isel = eval(xr.open_dataset(fn).attrs["fluidpy_subset"], {"slice": slice})["isel"]
        return XF[isel["projection_x_coordinate"]], YF[isel["projection_y_coordinate"]]
    out_ = {}
    win = None                                                             # the research window (needed only on a cache miss)
    for lv in PRS_LEVELS:
        for var in ("UGRD", "VGRD", "VVEL", "HGT"):
            fname = f"hrrr_prs_ian_20220928T18_{lv}mb_{var}.nc"
            if win is None and not (RAWD / "HRRR-zarr" / fname).exists():
                c0 = open_remote(HRRR_PRS, group="850mb/UGRD")
                win = HR.box_index(c0["projection_x_coordinate"].values, c0["projection_y_coordinate"].values, *PRS_BOX)
            isel = {"projection_y_coordinate": win[0], "projection_x_coordinate": win[1]} if win else {}
            fn = fetch(HRRR_PRS, key="HRRR-zarr", fname=fname, quiet=True, subset={"group": f"{lv}mb/{var}/{lv}mb", "vars": [var], "isel": isel})
            inputs.append(Path(fn))
            out_[(lv, var)] = xr.open_dataset(fn)[var].values.astype(float)
    # the window's lat/lon from the research product of the same window (identical subsets; grid from HRRR's projection)
    PLO, PLA = (np.asarray(q_, float) for q_ in HR.lonlat_grid(*window_xy(RAWD / "HRRR-zarr" / "hrrr_prs_ian_20220928T18_850mb_UGRD.nc")))
    RP = xr.open_dataset("G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates/research/ian_hrrr_prs_18z.nc")
    row("DS16", "window lat/lon from HRRR's projection = the research product's (grid reproduced)", [float(np.nanmax(np.abs(PLA - RP.lat.values))), float(np.nanmax(np.abs(PLO - RP.lon.values)))], [0, 0], 1e-4)
    U = np.stack([out_[(lv, "UGRD")] for lv in PRS_LEVELS])
    Vv = np.stack([out_[(lv, "VGRD")] for lv in PRS_LEVELS])
    ue, ve = call("fluidpy.data.hrrr.earth_relative", "s18", "grid-relative → earth-relative winds (α = sin 38.5° (λ − λ₀))", heavy_call=True, u=U, v=Vv, lon=PLO[None])
    ue, ve = np.asarray(ue), np.asarray(ve)
    row("DS16", "earth-relative winds equal the research product (rotation reproduced)", [float(np.nanmax(np.abs(ue - RP.u.values))), float(np.nanmax(np.abs(ve - RP.v.values)))], [0, 0], 1e-3)
    Z = np.stack([out_[(lv, "HGT")] for lv in PRS_LEVELS])
    W = np.stack([out_[(lv, "VVEL")] for lv in PRS_LEVELS])
    zbar = np.nanmean(Z, axis=(1, 2)) / 1e3
    ksl = [PRS_LEVELS.index(lv) for lv in STACK_LEVELS]
    row("DS16", "box-mean heights 925/850/500/200/150 hPa = 0.70/1.43/5.80/12.44/14.25 km", zbar[ksl], [0.70, 1.43, 5.80, 12.44, 14.25], 0.01)
    row("DS16", "spoken 0.7 / 1.5 / 6 / 12 / 14 km within 15 %; tags 0.7 / 1.4 / 5.8 / 12.4 / 14.3", [*(zbar[ksl] / np.array([0.7, 1.5, 6, 12, 14]) - 1),
        *(np.round(zbar[ksl], 1) - np.array([0.7, 1.4, 5.8, 12.4, 14.2]))], [0] * 10, [0.15] * 5 + [0.051] * 5)
    psfc = H.psfc.values[k18].astype(float) / 100
    psfc_p = griddata(PTS, psfc.ravel(), (PLO, PLA), method="linear")
    truth("DS16", f"975 hPa below ground near the core: min p_sfc = {np.nanmin(psfc):.1f} hPa < 975 (HRRR msl min 960.3)", np.nanmin(psfc) < 975, float(np.nanmin(psfc)))
    wmax = float(max(np.nanmax(np.abs(W[i_])) / (lv * 100 / (287.0 * 200.0) * G0) for i_, lv in enumerate(PRS_LEVELS)))
    row("DS16", f"HRRR analysed ω tiny: max |ω| = {np.nanmax(np.abs(W)):.3f} Pa/s ⇒ |w| ≤ |ω|/(ρg) < 0.1 m/s (ρ at T = 200 K, conservative), far below eyewall updrafts of metres per second: not used (storyboard said |ω| ≤ 0.02: it is 0.095)",
        wmax, 0.0, 0.1)
    # ring means at 100 km per level (s19) and the section (s20)
    radii = list(range(5, 205, 5))
    VT = np.full((len(PRS_LEVELS), len(radii)), np.nan)
    VR = np.full_like(VT, np.nan)
    for i_, lv in enumerate(PRS_LEVELS):
        Rw = call(DC + "storm_relative_wind", "s20", f"ring means {lv} hPa, 5-200 km, 72 azimuths", heavy_call=True, u=ue[i_], v=ve[i_], lat=PLA, lon=PLO,
                  centre=CALM, radii_km=radii, n_az=72)
        vt_, vr_ = np.asarray(Rw.tangential_mean, float), np.asarray(Rw.radial_mean, float)
        # below ground: a ring with any point where the level's pressure exceeds the surface pressure is masked
        pr_ring = griddata(PTS, psfc.ravel(), (np.asarray(Rw.lon).ravel(), np.asarray(Rw.lat).ravel()), method="linear").reshape(np.shape(Rw.lat))
        bad = np.any(pr_ring < lv, axis=1)
        vt_[bad], vr_[bad] = np.nan, np.nan
        VT[i_], VR[i_] = vt_, vr_
    k100 = radii.index(100)
    vr100 = VR[ksl, k100]
    row("DS17", "ring means at 100 km: 925 −6.5, 850 +0.5, 500 +0.9, 200 +0.9, 150 +6.6 m/s (±0.3)", vr100, [-6.5, 0.5, 0.9, 0.9, 6.6], 0.3)
    row("DS17", "screen: −6.5, ≈ 0, +1, +1, +6.5", [round(vr100[0], 1), abs(vr100[1]) < 1, round(vr100[2]), round(vr100[3]), round(vr100[4] * 2) / 2], [-6.5, 1, 1, 1, 6.5], 0)
    R925 = call(DC + "storm_relative_wind", "s19", "925-hPa ring points 50-300 km (inflow share)", heavy_call=True, u=ue[PRS_LEVELS.index(925)], v=ve[PRS_LEVELS.index(925)],
                lat=PLA, lon=PLO, centre=CALM, radii_km=list(range(50, 301, 10)), n_az=72)
    rr925 = np.asarray(R925.radial)
    share = float(np.nanmean(rr925 < 0))
    R100 = call(DC + "storm_relative_wind", "s19", "925-hPa 100-km ring points", heavy_call=True, u=ue[PRS_LEVELS.index(925)], v=ve[PRS_LEVELS.index(925)],
                lat=PLA, lon=PLO, centre=CALM, radii_km=[100], n_az=72)
    share100 = float(np.mean(np.asarray(R100.radial) < 0))
    s19s1 = VO["s19_ian_layers_lit"]
    flag("DS17", f"s19 S1 inflow claim (925 hPa): inflow share {share:.2f} of valid points 50-300 km, {share100:.2f} on the 100-km ring; 'almost everywhere' needs ≥ 0.85, "
         f"'on most of the ring' needs > 0.5 (narration now: {'on most of the ring' if 'on most of the ring' in s19s1 else 'almost everywhere'})",
         ("on most of the ring" in s19s1 and share100 > 0.5) or share >= 0.85, [round(share, 3), round(share100, 3)],
         "narration: 'the air flows in on most of the ring' (s19 S1, applied 2026-11-05); re-voice in the heavy phase")
    i925 = PRS_LEVELS.index(925)
    jmin = int(np.nanargmin(VR[i925]))
    imx, jmx = np.unravel_index(np.nanargmax(VR), VR.shape)
    itm, jtm = np.unravel_index(np.nanargmax(VT), VT.shape)
    row("DS18", "min ring-mean u_r −15.7 m/s at 30 km, 925 hPa (0.70 km) (said −16, 30 km, 700 m)", [float(np.nanmin(VR)), VR[i925, jmin], radii[jmin]], [-15.7, -15.7, 30], [0.05, 0.05, 0])
    row("DS18", "max ring-mean u_r ≈ +9 m/s at 125 hPa (15.3 km) — the data put it at 125 km (storyboard: 150 km)", [float(np.nanmax(VR)), PRS_LEVELS[imx], radii[jmx], zbar[imx]],
        [9.2, 125, 125, 15.3], [0.05, 0, 0, 0.1])
    row("DS18", "max ring-mean u_θ 54.99 m/s (≈ 55) at 30 km, 850 hPa (1.43 km); 10-m u_θ(25 km) 34.80 (weaker at the sea)", [float(np.nanmax(VT)), radii[jtm], PRS_LEVELS[itm], vt25],
        [54.99, 30, 850, 34.80], [0.01, 0, 0, 0.01])
    truth("DS18", "975 hPa rings masked below ground near the core (5-15 km at least)", bool(np.all(np.isnan(VR[0, :3]))), B1.r6(VR[0, :8], 1))
    say.update({"sec_min": -16, "sec_max": 9, "vt_max": 55})
    # layer textures: a ±250 km square round the calm centre on the local tangent plane, 256² → ×4 = 1024²
    half_k = 250.0
    n0 = 256
    xs = np.linspace(-half_k, half_k, n0) * 1e3
    XX, YY = np.meshgrid(xs, xs[::-1])                     # row 0 = north
    # the stack layers need a ±250 km square: a wider window of the same store (NEW small fetches, 5 levels × U, V; the index
    # window from HRRR's own projection, no listing call)
    js2, is2 = HR.box_index(XF, YF, *PRS_BOX_STACK)
    wide = {}
    for lv in STACK_LEVELS:
        for var in ("UGRD", "VGRD"):
            fn = fetch(HRRR_PRS, key="HRRR-zarr", fname=f"hrrr_prs_ian500_20220928T18_{lv}mb_{var}.nc", quiet=True,
                       subset={"group": f"{lv}mb/{var}/{lv}mb", "vars": [var], "isel": {"projection_y_coordinate": js2, "projection_x_coordinate": is2}})
            inputs.append(Path(fn))
            wide[(lv, var)] = xr.open_dataset(fn)[var].values.astype(float)
    WLO, WLA = (np.asarray(q_, float) for q_ in HR.lonlat_grid(XF[is2], YF[js2]))
    px = A_E * np.cos(CALM[0] * D2R) * (WLO - CALM[1]) * D2R
    py = A_E * (WLA - CALM[0]) * D2R
    P2 = np.c_[px.ravel(), py.ravel()]
    wue, wve = call("fluidpy.data.hrrr.earth_relative", "s18", "earth-relative winds, the 500-km stack window", heavy_call=True,
                    u=np.stack([wide[(lv, "UGRD")] for lv in STACK_LEVELS]), v=np.stack([wide[(lv, "VGRD")] for lv in STACK_LEVELS]), lon=WLO[None])
    wue, wve = np.asarray(wue), np.asarray(wve)
    layer_stats = []
    lut_coast = (240, 240, 240)
    coast_s = B1.box_lines(coast, (23.5, 29.5, -85.5, -79.0), nd=3)
    for lv in STACK_LEVELS:
        i_ = STACK_LEVELS.index(lv)
        ug = griddata(P2, wue[i_].ravel(), (XX, YY), method="linear")
        vg = griddata(P2, wve[i_].ravel(), (XX, YY), method="linear")
        okm = np.isfinite(ug) & np.isfinite(vg) & (np.hypot(XX, YY) > 1.0)
        comp = call(CS + "velocity_components", "s18", f"u_r = u·r̂ on the local plane, {lv} hPa (x, y in metres)", heavy_call=True,
                    u_cart=np.stack([ug[okm], vg[okm]]), x=np.stack([XX[okm], YY[okm]]), system="polar")
        urg = np.full(XX.shape, np.nan)
        urg[okm] = np.asarray(comp)[0]
        U4 = ndzoom(np.nan_to_num(urg), 4, order=1)
        M4 = ndzoom(np.isfinite(urg).astype(float), 4, order=0) > 0.5
        U4[~M4] = np.nan
        rgbL = colour(U4, lut_ur, -UR_LIM, UR_LIM)
        zl = zero_line(U4, 2)
        rgbL[zl] = (34, 30, 40)
        if lv == 925:                                       # the coast on the bottom layer (white)
            def toPx(lines):
                outL = []
                for ln in lines:
                    a_ = np.asarray(ln).reshape(-1, 2)
                    x_ = A_E * np.cos(CALM[0] * D2R) * (a_[:, 0] - CALM[1]) * D2R
                    y_ = A_E * (a_[:, 1] - CALM[0]) * D2R
                    outL.append(np.c_[(x_ / 1e3 + half_k) / (2 * half_k) * 1024, (half_k - y_ / 1e3) / (2 * half_k) * 1024])
                return outL
            rgbL = draw_lines(rgbL.astype(np.uint8), toPx(coast_s), lut_coast, 3)
        png_rgba(rgbL, np.where(M4, 235, 0), IMG / f"ur_{lv}.png")
        layer_stats.append({"lv": lv, "valid": float(M4.mean()), "min": float(np.nanmin(U4)), "max": float(np.nanmax(U4))})
    truth("DS16", "layer textures 1024 px, ≥ 98 % of the 500-km square has data, no hatch", all(s_["valid"] > 0.98 for s_ in layer_stats) and Image.open(IMG / "ur_925.png").size[0] == 1024,
          [round(s_["valid"], 4) for s_ in layer_stats])
    # tangential dashes on each layer's 100-km ring: v_t at 8 azimuths (data)
    dash = []
    for lv in STACK_LEVELS:
        i_ = PRS_LEVELS.index(lv)
        Rw8 = call(DC + "storm_relative_wind", "s18", f"v_t at 8 points of the 100-km ring, {lv} hPa", heavy_call=True, u=ue[i_], v=ve[i_], lat=PLA, lon=PLO, centre=CALM, radii_km=[100], n_az=8)
        dash.append(B1.r6(Rw8.tangential[0], 2))
    truth("DS17", "tangential dashes anticlockwise (v_t > 0) at all 8 points of every layer's ring", all(min(d_) > 0 for d_ in dash), [min(d_) for d_ in dash])
    # the section raster: x radius 0-200 km (1000 px), y height 0-16 km (800 px); linear in r and z between data; masked outside
    zlev = zbar.copy()
    nx_, ny_ = 1000, 800
    rq = np.linspace(0, 200, nx_)
    zq = np.linspace(16, 0, ny_)
    SEC = np.full((ny_, nx_), np.nan)
    for j_, zz in enumerate(zq):
        kk = np.searchsorted(zlev, zz)
        if kk == 0 or kk >= len(zlev):
            continue
        w_ = (zz - zlev[kk - 1]) / (zlev[kk] - zlev[kk - 1])
        lo_row, hi_row = VR[kk - 1], VR[kk]
        rowv = (1 - w_) * lo_row + w_ * hi_row
        SEC[j_] = np.interp(rq, radii, rowv, left=np.nan, right=np.nan)
    rgbX = colour(SEC, lut_ur, -UR_LIM, UR_LIM)
    rgbX[zero_line(SEC, 2)] = (34, 30, 40)
    png_rgba(rgbX, np.where(np.isfinite(SEC), 255, 0), IMG / "sec_ian.png")

    def vt_lines(VTg, rads, zl, levels, box=(200, 16)):
        """u_θ contours of a (level, radius) table as polylines in (r km, z km) + one label point per line (greedy, ≥ 70 px apart
        in the 920 × 720 px section box)"""
        from skimage.measure import find_contours
        rq2 = np.linspace(rads[0], min(rads[-1], box[0]), 300)
        zq2 = np.linspace(max(zl[np.isfinite(VTg).any(1)].min(), 0), min(zl.max(), box[1]), 240)
        G_ = np.full((len(zq2), len(rq2)), np.nan)
        for j_, zz in enumerate(zq2):
            kk = min(max(np.searchsorted(zl, zz), 1), len(zl) - 1)
            w_ = (zz - zl[kk - 1]) / (zl[kk] - zl[kk - 1])
            G_[j_] = np.interp(rq2, rads, (1 - w_) * VTg[kk - 1] + w_ * VTg[kk])
        outl, labs = [], []
        for lev in levels:
            for cline in find_contours(np.nan_to_num(G_, nan=-99), lev):
                if len(cline) < 8:
                    continue
                r_ = np.interp(cline[:, 1], np.arange(len(rq2)), rq2)
                z_ = np.interp(cline[:, 0], np.arange(len(zq2)), zq2)
                pts = np.round(np.c_[r_, z_][::2], 2)
                outl.append({"level": float(lev), "pts": pts.ravel().tolist()})
                pxs = np.c_[pts[:, 0] / box[0] * 920, (1 - pts[:, 1] / box[1]) * 720]
                order = np.argsort(np.abs(np.arange(len(pts)) - len(pts) * 0.55))
                for q in order:
                    if all(np.hypot(*(pxs[q] - np.array(L_["px"]))) > 90 for L_ in labs) and 30 < pxs[q][0] < 880 and 40 < pxs[q][1] < 690:
                        labs.append({"level": float(lev), "r": float(pts[q, 0]), "z": float(pts[q, 1]), "px": pxs[q].tolist()})
                        break
        return outl, labs
    zl_ian = zlev.copy()
    VTm = VT.copy()
    VTm[np.isnan(VTm)] = 0.0
    vtl, vtlab = vt_lines(np.where(np.isnan(VT), np.nan, VT), np.array(radii, float), zl_ian, [10, 20, 30, 40, 50])
    truth("DS18", "u_θ contour labels: one per level 10-50, none within 90 px of another", len({L_["level"] for L_ in vtlab}) == 5, [L_["level"] for L_ in vtlab])
    V["stack"] = {"levels": STACK_LEVELS, "z_km": B1.r6(zbar[ksl], 3), "vr100": B1.r6(vr100, 2), "vt100": B1.r6(VT[ksl, k100], 2), "half_km": half_k, "lim": UR_LIM,
                  "dash_vt": dash, "share925": share, "share925_100": share100}
    V["sec"] = {"radii": radii, "levels": PRS_LEVELS, "z_km": B1.r6(zlev, 3), "vr": B1.r6(VR, 2), "vt": B1.r6(VT, 2), "vt_lines": vtl, "vt_labels": vtlab,
                "min": [float(np.nanmin(VR)), radii[jmin], float(zbar[i925])], "max": [float(np.nanmax(VR)), radii[jmx], float(zbar[imx])],
                "vtmax": [float(np.nanmax(VT)), radii[jtm], float(zbar[itm])], "vt10_25": vt25, "box": [0, 200, 0, 16]}

    # ================================================================ measured rising air (s19-s20, DS29-DS30)
    # (a) NOAA P-3 tail Doppler radar ring means of w (the measured updraught); (b) the continuity w that the HRRR f00 inflow
    # implies (the "must rise" number). reports/data/ch00_coordinates_vertical_motion.md §2-§3.
    import gzip
    import shutil
    SCR.mkdir(parents=True, exist_ok=True)
    tdr_gz = fetch(f"ftp://{TDR_HOST}{TDR_PATH}", key="HRD-TDR", fname=TDR_PATH.rsplit("/", 1)[-1], expected_bytes=TDR_BYTES,
                   retrieve=tdr_retriever(TDR_PATH), quiet=True)
    inputs.append(Path(tdr_gz))
    tdr_nc = SCR / "tdr_220928H1_1023_xy.nc"                # working copy on G: scratch (never redistributed, never committed)
    if not tdr_nc.exists():
        with gzip.open(tdr_gz, "rb") as fa, open(SCR / "tdr.part", "wb") as fb:
            shutil.copyfileobj(fa, fb)
        (SCR / "tdr.part").replace(tdr_nc)
    TD = xr.open_dataset(tdr_nc)
    Wt = TD["W"].isel(time=0).transpose("level", "y", "x").values.astype(float)
    Wt[(Wt < -900) | (np.abs(Wt) > 1e4)] = np.nan
    zt = TD.level.values.astype(float)                       # km, 0-18 every 0.5
    XT, YT = np.meshgrid(TD.x.values.astype(float), TD.y.values.astype(float))
    rT = np.hypot(XT, YT)                                    # km from the analysis origin (the HRD storm centre)
    tdr_origin = (float(TD.attrs["ORIGIN_LATITUDE"]), float(TD.attrs["ORIGIN_LONGITUDE"]))
    RBT = np.arange(0, 152, 2.0)
    rcT = 0.5 * (RBT[1:] + RBT[:-1])
    Wr5, CovT = tdr_ring_mean(Wt, rT, RBT, 0.5)              # the research product's rule (≥ 50 %) for the parity row
    RZ = xr.open_dataset(VM_RES / "tdr_rz.nc")
    dW = np.abs(Wr5 - RZ.w.values.astype(float))
    row("DS29", "TDR ring means (2-km bins, ≥ 50 % cover) = the research product tdr_rz.nc (max |Δw|, NaN masks equal, max |Δcover|)",
        [float(np.nanmax(dW)), float(np.any(np.isfinite(Wr5) != np.isfinite(RZ.w.values))), float(np.max(np.abs(CovT - RZ.w_coverage.values)))], [0, 0, 0], [1e-5, 0, 1e-6])
    WT = np.where(CovT >= TDR_COV, Wr5, np.nan)              # used everywhere below: ≥ 70 % of the ring
    m80 = (rcT >= 15) & (rcT <= 80)
    Wpk = np.where(m80[None, :], WT, np.nan)
    kpk, jpk = np.unravel_index(np.nanargmax(Wpk), Wpk.shape)
    row("DS29", f"peak ring-mean w (≥ 70 % of the ring, r 15-80 km, any height) {Wpk[kpk, jpk]:.2f} m/s at {zt[kpk]:.1f} km, r {rcT[jpk]:.0f} km: ≈ 3.3 at 8-9.5 km, ≈ 45 km (said: about three, nine kilometres up)",
        [Wpk[kpk, jpk], zt[kpk], rcT[jpk]], [3.3, 8.75, 45], [0.1, 0.75, 4])
    slT = slanted_max(WT, rcT, zt)
    row("DS29", "slanted ring max at 2 / 5 / 8 / 11 km = 0.35 / 1.51 / 3.33 / 2.35 m/s at r 33 / 49 / 45 / 53 km (the s19 arrow lengths 0.4 / 1.5 / 3.3 / 2.4)",
        [*[q[1] for q in slT], *[q[2] for q in slT]], [0.35, 1.51, 3.33, 2.35, 33, 49, 45, 53], [0.01] * 4 + [0] * 4)
    band = (rcT >= 35) & (rcT <= 60)
    with np.errstate(all="ignore"):
        wband = np.nanmean(WT[:, band], axis=1)
    wb23, wb5, wb10 = float(np.nanmean(wband[(zt >= 2) & (zt <= 3)])), float(wband[zt == 5.0][0]), float(wband[zt == 10.0][0])
    row("DS29", f"eyewall-band (35-60 km) mean w at 2-3 / 5 / 10 km = {wb23:.2f} / {wb5:.2f} / {wb10:.2f} m/s — the scout's ≈ 0.4 / 1.5 / 2.4: 10 km confirmed; "
        "5 km is 1.15 (the 1.5 is the slanted ring max at 49 km); 2-3 km is 0.25 with the 70 % rule (0.46 with 50 %). Not shown, not said",
        [wb23, wb5, wb10], [0.25, 1.15, 2.43], 0.01)
    m100 = rT <= 100
    Wp = np.where(m100[None], Wt, np.nan)
    ipt = np.unravel_index(np.nanargmax(Wp), Wp.shape)
    row("DS29", f"strongest single updraught (r ≤ 100 km) {np.nanmax(Wp):.1f} m/s at {zt[ipt[0]]:.1f} km, r {rT[ipt[1], ipt[2]]:.0f} km; 99.9th percentile "
        f"{np.nanpercentile(Wp, 99.9):.1f}: in 10-12 m/s (said: single towers near ten; screen ≈ 10-12)",
        [float(np.nanmax(Wp)), float(np.nanpercentile(Wp, 99.9))], [11.0, 8.9], [1.0, 0.05])
    eye_edge = float(min(rcT[np.isfinite(Wr5[k_])].min() for k_ in range(len(zt)) if 2 <= zt[k_] <= 12 and np.isfinite(Wr5[k_]).any()) - 1.0)
    truth("DS29", f"no radar data in the clear eye: no ring mean (even at 50 % cover) inside {eye_edge:.0f} km at 2-12 km (scout: ≈ 22); the screen's grey "
          f"'no echoes' band is drawn 0-{eye_edge:.0f} km from this number", 18 <= eye_edge <= 23, eye_edge)
    # outward lean of the updraught: per height, the w-weighted radius of the strong ascent (w ≥ half that height's ring max, r 25-80 km)
    def r_half(zz):
        q_ = WT[zt == zz][0]
        m_ = (rcT >= 25) & (rcT <= 80) & np.isfinite(q_)
        pk_ = np.nanmax(np.where(m_, q_, np.nan))
        wgt = np.where(m_ & (q_ >= 0.5 * pk_), q_, 0.0)
        return float((wgt * rcT).sum() / wgt.sum())
    zs_ = zt[(zt >= 2) & (zt <= 11)]
    rbar = [r_half(zz) for zz in zs_]
    lean_z = [2.0, 5.0, 8.0, 11.0]
    lean_r = [r_half(zz) for zz in lean_z]
    slope, r0 = np.polyfit(zs_, rbar, 1)
    lean5 = (lean_r[-1] - lean_r[0]) / (lean_z[-1] - lean_z[0]) * 5
    row("DS29", f"the updraught leans outward: strong-ascent radius {' → '.join(f'{q:.0f}' for q in lean_r)} km at 2 / 5 / 8 / 11 km, i.e. {lean5:.0f} km per 5 km "
        f"of height from 2 to 11 km (scout: 10-15); nearly upright at 45-50 km between 3 and 10 km (straight-line fit {5 * slope:.0f} km per 5 km). "
        "The s19/s20 up arrows follow these four radii", [lean5, float(np.all(np.diff(lean_r) > 0))], [12.5, 1], [2.5, 0])
    dt_h = (np.datetime64("2022-09-28T18:00") - np.datetime64(TDR_T)) / np.timedelta64(1, "m") / 60
    row("DS29", f"radar analysis centre {TDR_T} UTC vs the HRRR 18 UTC winds: {dt_h:.1f} h (source line: ≈ 8 h)", [round(dt_h)], [8], 0)
    # the w panel raster: x radius 0-100 km (1000 px), y height 0-14 km (700 px); linear between ring bins and levels; NaN transparent
    nxw, nyw = 1000, 700
    rqw, zqw = np.linspace(0, 100, nxw), np.linspace(14, 0, nyw)
    WIMG = np.full((nyw, nxw), np.nan)
    for j_, zz in enumerate(zqw):
        kk = int(np.searchsorted(zt, zz))
        kk = min(max(kk, 1), len(zt) - 1)
        a_ = (zz - zt[kk - 1]) / (zt[kk] - zt[kk - 1])
        WIMG[j_] = np.interp(rqw, rcT, (1 - a_) * WT[kk - 1] + a_ * WT[kk], left=np.nan, right=np.nan)
    lut_w = B1.lut_rgb(W_LUT)
    rgbW = colour(np.clip(WIMG, 0, None), lut_w, 0.0, W_LIM)
    png_rgba(rgbW, np.where(np.isfinite(WIMG), 255, 0), IMG / "tdr_w.png")
    truth("DS29", "w panel 1000×700 px, r 0-100 km × z 0-14 km, colour 0 … +4 m/s (cmocean dense), ≤ 0 drawn as 0, gaps transparent",
          Image.open(IMG / "tdr_w.png").size == (1000, 700), [float(np.nanmin(WIMG)), float(np.nanmax(WIMG))])

    # (b) continuity: the inflow alone says how fast the air must rise (HRRR f00 GRIB, 37 levels with T and q)
    f00 = fetch(HRRR_F00_URL, key="HRRR-aws", fname=HRRR_F00_URL.rsplit("/", 1)[-1], quiet=True)
    inputs.append(Path(f00))
    f00nc = hrrr_grib_box(Path(f00), SCR / "hrrr_prs_18z_f00.nc")
    HF = xr.open_dataset(f00nc)
    HR0 = xr.open_dataset(VM_RES / "hrrr_prs_18z_f00.nc")
    row("DS30", "HRRR f00 GRIB box (37 levels; u, v earth-relative; z, T, q) = the research product (max |Δ| of u, v, z, t, q)",
        [float(np.nanmax(np.abs(HF[v_].values - HR0[v_].values))) for v_ in ("u", "v", "z", "t", "q")], [0] * 5, [1e-4, 1e-4, 1e-3, 1e-4, 1e-8])
    edges4 = np.arange(0, 154, 4.0)
    CR = hrrr_ring_continuity(HF, (26.48, -82.39), edges4)   # the research's wind centre: reproduces the report's table row (d)
    slR = slanted_max(CR["wc"], CR["rc"], CR["z"] / 1e3)
    row("DS30", "method parity: continuity w about the research's wind centre (26.48 N 82.39 W) = report §2 row (d) 1.01 / 0.76 / 0.88 / 1.07 m/s at 18 / 22 / 26 / 26 km",
        [*[q[1] for q in slR], *[q[2] for q in slR]], [1.01, 0.76, 0.88, 1.07, 18, 22, 26, 26], [0.005] * 4 + [0] * 4)
    CC = hrrr_ring_continuity(HF, CALM, edges4)              # the movie's centre (the s20 section's)
    slC = slanted_max(CC["wc"], CC["rc"], CC["z"] / 1e3)
    selz, selr = (CC["z"] > 1e3) & (CC["z"] < 12e3), (CC["rc"] >= 18) & (CC["rc"] <= 26)
    wc_mean = float(np.nanmean(CC["wc"][selz][:, selr]))
    row("DS30", f"continuity w round the calm centre: mean over r 18-26 km, z 1-12 km = {wc_mean:.2f} m/s; slanted max {', '.join(f'{q[1]:.2f}' for q in slC)} m/s at "
        f"{', '.join(f'{q[2]:.0f}' for q in slC)} km — ≈ 1 m/s at r ≈ 18-26 km (said: about a metre per second; method spread 0.8-1.6, report)",
        [wc_mean, *[q[2] for q in slC]], [1.0, 22, 22, 22, 22], [0.15, 4, 4, 4, 4])
    # fix 0 B13 (pre-render audit): the s20 box estimate the narration now walks through. Air enters a cylinder r = 30 km through
    # its side in a layer h ≈ 1 km at |u_r| ≈ 16 m/s (the section's strongest ring-mean inflow, −15.7 m/s at 30 km, 925 hPa) and
    # leaves through the lid: 2π r h |u_r| = π r² w → w = 2 h |u_r| / r. It must agree with the continuity integral (DS30, ≈ 1 m/s).
    ur_box = abs(V["sec"]["min"][0])
    w_box = 2 * 1000.0 * ur_box / 30_000.0
    w_box_said = 2 * 1000.0 * 16 / 30_000.0
    row("DS30", f"s20 box estimate (B13): w = 2 h |u_r| / r = 2 × 1000 m × {ur_box:.1f} m/s / 30 000 m = {w_box:.2f} m/s (said with 16: {w_box_said:.2f}, "
        f"'about one'); the section minimum is at r = {V['sec']['min'][1]} km; agrees with the continuity integral {wc_mean:.2f} m/s within 0.15",
        [w_box, w_box_said, V["sec"]["min"][1], abs(w_box - wc_mean)], [1.0, 1.0, 30, 0], [0.1, 0.1, 0, 0.15])
    say.update({"w_box": {"h_m": 1000, "ur": 16, "r_m": 30000, "w": round(w_box_said, 2)}})
    say.update({"w_cont": 1, "w_ring": 3, "w_ring_z": 8.5, "w_tower": 10})
    V["w"] = {"tdr": {"origin": tdr_origin, "time_utc": TDR_T, "cov": TDR_COV, "lim": W_LIM, "lut": B1.lut_hex(W_LUT),
                      "peak": [float(Wpk[kpk, jpk]), float(zt[kpk]), float(rcT[jpk])], "slanted": slT, "band35_60": [wb23, wb5, wb10],
                      "point_max": [float(np.nanmax(Wp)), float(zt[ipt[0]]), float(rT[ipt[1], ipt[2]])], "p999": float(np.nanpercentile(Wp, 99.9)),
                      "eye_km": eye_edge, "lean_z": lean_z, "lean_r": lean_r, "lean_km_per_5km": float(lean5), "fit_km_per_km": float(slope),
                      "rbar": B1.r6(rbar, 2), "rbar_z": zs_.tolist(),
                      "box": [0, 100, 0, 14], "dt_h": float(dt_h)},
              "cont": {"mean_18_26": wc_mean, "slanted": slC, "centre": list(CALM), "research_centre_parity": slR}}

    # ================================================================ Cyclone Amphan: ERA5, IBTrACS, MODIS (s21-s24, DS19-DS22)
    import fluidpy.data.era5_arco as EA
    ps = EA.fetch_box("2020-05-20T06", "2020-05-20T06", (14.0, 27.0), (81.0, 95.0), variables=("msl", "u10", "v10"), tag="amphan_sfc")
    pp = EA.fetch_box("2020-05-20T06", "2020-05-20T06", (14.0, 27.0), (81.0, 95.0), variables=("u", "v", "w", "z"), levels=ERA5_LEVELS, tag="amphan_pl")
    inputs += [Path(ps), Path(pp)]
    S = xr.open_dataset(ps).isel(time=0).sortby("latitude")
    Pp = xr.open_dataset(pp).isel(time=0).sortby("latitude")
    alat, alon = S.latitude.values.astype(float), S.longitude.values.astype(float)
    alon = np.where(alon > 180, alon - 360, alon)
    ALO, ALA = np.meshgrid(alon, alat)
    amsl = S["mean_sea_level_pressure"].values.astype(float)
    au, av = S["10m_u_component_of_wind"].values.astype(float), S["10m_v_component_of_wind"].values.astype(float)
    ac = call(DC + "storm_centre", "s23", "sub-grid minimum of ERA5 sea-level pressure", heavy_call=True, msl=amsl, lat=ALA, lon=ALO, box=(19.5, 22.0, 86.5, 89.5))
    acen = (float(ac.lat), float(ac.lon))
    row("DS21", "ERA5 centre 20.657 N 87.796 E; msl min 966.9 hPa", [acen[0], acen[1], float(ac.msl_min) / 100], [20.657, 87.796, 966.9], [0.005, 0.005, 0.05])
    AR = call(DC + "storm_relative_wind", "s23", "10-m ring means at 50/100/200/300 km", heavy_call=True, u=au, v=av, lat=ALA, lon=ALO, centre=acen, radii_km=[50, 100, 200, 300], n_az=72)
    avt, avr = np.asarray(AR.tangential_mean), np.asarray(AR.radial_mean)
    row("DS21", "the strongest ERA5 spin is on the 50-km ring (v_t 20.1 vs 19.7 at 100 km): v_t 20.08 (≈ 20), v_r −5.97 (≈ −6) m/s, inflow angle 16.55° (≈ 17)", [avt[0], avr[0], int(np.argmax(avt)), float(AR.inflow_angle_mean_deg[0]), avt[1], avr[1]],
        [20.08, -5.97, 0, 16.55, 19.72, -9.07], [0.01, 0.01, 0, 0.01, 0.01, 0.01])
    flag("DS21", "s23 S5 names the ring where ERA5's spin is strongest: the strongest spin and the spoken 20 / −6 m/s are on the 50-km ring (narration must say 'fifty kilometres out')",
         "fifty kilometres out" in VO["s23_amphan_ring"] and "a hundred kilometres out" not in VO["s23_amphan_ring"], [50, 100],
         "narration: 'a hundred kilometres out' → 'fifty kilometres out' (s23, applied 2026-11-05; re-voice); the screen draws the 50-km ring")
    row("DS21", "screen: 6.0/20.1 = 0.299 (≈ 0.30) → 16.6° (≈ 17°); 13.3/34.8 = 0.382 (≈ 0.38) → 20.9° (≈ 21°); 90 kt × 1.852 = 166.7 (≈ 167) km/h",
        [6.0 / 20.1, np.degrees(np.arctan(6.0 / 20.1)), 13.3 / 34.8, np.degrees(np.arctan(13.3 / 34.8)), 90 * 1.852], [0.30, 16.6, 0.38, 20.9, 166.7], [0.0015, 0.05, 0.003, 0.05, 0.05])
    ni = call("fluidpy.data.ibtracs.storm_table", "s21", "IBTrACS NI Amphan fixes", heavy_call=True, path=F_NI, sid=AMPHAN_SID, agencies=("usa", "newdelhi"))
    inputs.append(F_NI)
    tt = ni["time"]
    k06 = tt.index("2020-05-20 06:00:00")
    row("DS21", "IBTrACS 06 UTC 20 May: WMO (IMD, 3-min) 90 kt, 956 hPa", [ni["wmo_wind_kt"][k06], ni["wmo_pres_hPa"][k06]], [90, 956], 0)
    # fix 0 B14 (pre-render audit): like with like — the official 90 kt in m/s, and the two LOWEST PRESSURES (ERA5 967 vs official 956)
    row("DS21", "s23 like-for-like (B14): 90 kt × 1.852 / 3.6 = 46.3 (≈ 46) m/s; ERA5 lowest msl 966.9 (≈ 967) hPa vs official 956: ERA5 11 hPa too high (too weak)",
        [90 * 1.852 / 3.6, float(ac.msl_min) / 100, float(ac.msl_min) / 100 - ni["wmo_pres_hPa"][k06]], [46.3, 967, 11], [0.05, 0.5, 0.5])
    say.update({"a_ms": 46, "a_msl": 967})
    nd_w = [w for w in ni.get("newdelhi_wind_kt", []) if w is not None]
    kpk = int(np.nanargmax([w if w is not None else -1 for w in ni["newdelhi_wind_kt"]]))
    row("DS19", "IMD peak 130 kt, 920 hPa on 18 May", [max(nd_w), ni["newdelhi_pres_hPa"][kpk], int(tt[kpk][8:10])], [130, 920, 18], 0)
    # track, 3-hourly, interpolated to 10 min for the closest approaches (distances in metres from the tested function)
    tsec = np.array([np.datetime64(t.replace(" ", "T")) for t in tt]).astype("datetime64[s]").astype(float)
    tlat, tlon = np.array(ni["lat"], float), np.array(ni["lon"], float)
    tf = np.arange(tsec[0], tsec[-1], 600.0)
    flat, flon = np.interp(tf, tsec, tlat), np.interp(tf, tsec, tlon)
    close = {}
    for nm, (pla, plo) in PLACES_BD.items():
        dists = np.asarray(call(SPH + "great_circle_distance", "s21", f"track → {nm} (metres)", heavy_call=True, lat1=flat, lon1=flon, lat2=pla, lon2=plo))
        j_ = int(np.argmin(dists))
        close[nm] = {"km": float(dists[j_] / 1e3), "west": bool(flon[j_] < plo), "utc": str(np.datetime64(int(tf[j_]), "s"))}
    row("DS19", "closest approach Kolkata ≈ 17 km, Satkhira ≈ 45 km, Khulna ≈ 79 km (track west of both)",
        [close["Kolkata"]["km"], close["Satkhira"]["km"], close["Khulna"]["km"], close["Satkhira"]["west"], close["Khulna"]["west"]], [17, 45, 79, 1, 1], [3, 3, 0.5, 0, 0])
    kh_words = {78: "seventy eight", 79: "seventy nine", 80: "eighty"}.get(round(close["Khulna"]["km"]), "?")
    flag("DS19", f"s21 S5 Khulna distance: the track (IBTrACS 3-hourly, linear in time, 10-min steps) passes {close['Khulna']['km']:.1f} km west (screen ≈ {round(close['Khulna']['km'])}); "
         f"narration must say '{kh_words} kilometres west of Khulna'", f"{kh_words} kilometres west of Khulna" in VO["s21_amphan_intro"], round(close["Khulna"]["km"], 1),
         "narration: 'seventy eight' → 'seventy nine' (s21 S5, applied 2026-11-05; re-voice)")
    sel_t = [i_ for i_, t in enumerate(tt) if "2020-05-16" <= t[:10] <= "2020-05-21"]
    track = [[tt[i_], tlat[i_], tlon[i_], ni["wmo_wind_kt"][i_] if ni["wmo_wind_kt"][i_] is not None else None] for i_ in sel_t]
    lf = [i_ for i_ in sel_t if ni["landfall_km"][i_] is not None and ni["landfall_km"][i_] == 0]
    row("DS19", "IBTrACS first land fix 21.4 N 88.1 E at 09 UTC 20 May", [tlat[lf[0]], tlon[lf[0]], int(tt[lf[0]][11:13]), int(tt[lf[0]][8:10])], [21.4, 88.1, 9, 20], [0.05, 0.05, 0, 0])
    # the 10-m speed map 85-92 E, 17.5-24.5 N + data arrows
    mb = (17.5, 24.5, 85.0, 92.0)
    sb_ = (ALA >= mb[0]) & (ALA <= mb[1])
    mi = np.where((alat >= mb[0]) & (alat <= mb[1]))[0]
    mj = np.where((alon >= mb[2]) & (alon <= mb[3]))[0]
    asp = np.hypot(au, av)[np.ix_(mi, mj)]
    del sb_
    lat_m, lon_m = alat[mi], alon[mj]
    fine = ndzoom(asp[::-1], 8, order=1)                                   # row 0 = north, ×8 bilinear (pixels only)
    png_rgba(colour(fine, B1.lut_rgb(SPEED_LUT), 0, 30), None, IMG / "amphan_speed.png")
    arrows = []
    for la_ in np.arange(18.0, 24.01, 0.75):
        for lo_a in np.arange(85.5, 91.51, 0.75):
            jj, ii = int(np.argmin(abs(alat - la_))), int(np.argmin(abs(alon - lo_a)))
            arrows.append([float(alat[jj]), float(alon[ii]), round(float(au[jj, ii]), 2), round(float(av[jj, ii]), 2)])
    truth("DS21", "the box grid is ERA5's own 0.25° (one box ≈ 28 km at 20.7° N)", abs(0.25 * 111.2 - 27.8) < 0.1 and abs(lat_m[1] - lat_m[0] - 0.25) < 1e-6, 0.25 * 111.2)
    say.update({"a_vt": 20, "a_vr": -6, "a_kt": 90, "a_kmh": 167, "a_ang": 17, "i_ang": 21})
    # section: ring means 25-400 km, 10 levels; heights from ERA5 geopotential (box mean / g0); levels below the sea-level pressure masked
    arad = [25, 50, 75, 100, 150, 200, 300, 400]
    AVT = np.full((len(ERA5_LEVELS), len(arad)), np.nan)
    AVR = np.full_like(AVT, np.nan)
    fmsl = RegularGridInterpolator((alat, alon), amsl / 100, bounds_error=False, fill_value=np.nan)
    azm = np.zeros(len(ERA5_LEVELS))
    for i_, lv in enumerate(ERA5_LEVELS):
        k_ = list(Pp.level.values).index(lv)
        uu = Pp["u_component_of_wind"].values[k_].astype(float)
        vv = Pp["v_component_of_wind"].values[k_].astype(float)
        azm[i_] = float(np.nanmean(Pp["geopotential"].values[k_])) / G0 / 1e3
        Rw = call(DC + "storm_relative_wind", "s24", f"ERA5 ring means {lv} hPa", heavy_call=True, u=uu, v=vv, lat=ALA, lon=ALO, centre=acen, radii_km=arad, n_az=72)
        pm = fmsl(np.c_[np.asarray(Rw.lat).ravel(), np.asarray(Rw.lon).ravel()]).reshape(np.shape(Rw.lat))
        bad = np.any(pm < lv, axis=1)
        a1, a2 = np.asarray(Rw.tangential_mean, float), np.asarray(Rw.radial_mean, float)
        a1[bad], a2[bad] = np.nan, np.nan
        AVT[i_], AVR[i_] = a1, a2
    i975 = ERA5_LEVELS.index(975)
    im_, jm_ = np.unravel_index(np.nanargmin(AVR), AVR.shape)
    iM_, jM_ = np.unravel_index(np.nanargmax(AVR), AVR.shape)
    row("DS22", "Amphan section: min ring-mean u_r −11.1 m/s at 100 km, 975 hPa (≈ 0.3 km); max +6.2 at 200 km, 150 hPa",
        [AVR[im_, jm_], arad[jm_], ERA5_LEVELS[im_], azm[i975], AVR[iM_, jM_], arad[jM_], ERA5_LEVELS[iM_]], [-11.1, 100, 975, 0.3, 6.2, 200, 150], [0.05, 0, 0, 0.1, 0.05, 0, 0])
    nxa, nya = 1000, 800
    rqa = np.linspace(0, 300, nxa)
    zqa = np.linspace(16, 0, nya)
    SA = np.full((nya, nxa), np.nan)
    for j_, zz in enumerate(zqa):
        kk = np.searchsorted(azm, zz)
        if kk == 0 or kk >= len(azm):
            continue
        w_ = (zz - azm[kk - 1]) / (azm[kk] - azm[kk - 1])
        SA[j_] = np.interp(rqa, arad, (1 - w_) * AVR[kk - 1] + w_ * AVR[kk], left=np.nan, right=np.nan)
    rgbA = colour(SA, lut_ur, -UR_LIM, UR_LIM)
    rgbA[zero_line(SA, 2)] = (34, 30, 40)
    png_rgba(rgbA, np.where(np.isfinite(SA), 255, 0), IMG / "sec_amphan.png")
    say.update({"a_min": -11, "a_max": 6})
    # MODIS Terra 18 May (GIBS): the pinhole eye
    import fluidpy.data.gibs as GB
    # #5b review 1 M8 (2026-11-06): the old box (12-19 N) ended 1.4° south of the eye, so the 600-km crop (eye ± 2.7°) ran past the
    # image's bottom edge: the slice was cut at row 1400 while crop_true still said 10.69 N, and the picture was stretched 1.32× in
    # latitude (the real eye drawn ≈ 126 px below the ring). The box now reaches 9 N (the crop fits; asserted below), lossless PNG
    # (the contrast stretch amplified the JPEG blocks).
    MOD_S, MOD_N = 9.0, 19.0
    mp = GB.fetch_wms("MODIS_Terra_CorrectedReflectance_TrueColor", "2020-05-18", (MOD_S, MOD_N), (83.0, 90.0), width=1400, tag="ch00co_amphan_b",
                      fmt="image/png", expected_bytes=9_000_000)
    inputs.append(Path(mp))
    mim = np.asarray(Image.open(mp).convert("RGB")).astype(float)
    mh, mw = mim.shape[:2]
    k18m = tt.index("2020-05-18 06:00:00")
    ib18 = (tlat[k18m], tlon[k18m])
    from scipy.ndimage import gaussian_filter, uniform_filter
    Lm = gaussian_filter(mim.mean(-1), 1.0)
    ringm = uniform_filter(Lm, 15) * 225 - uniform_filter(Lm, 7) * 49
    ringm /= (225 - 49)
    contrast = ringm - Lm
    mlat = MOD_N - (np.arange(mh) + 0.5) / mh * (MOD_N - MOD_S)
    mlon = 83.0 + (np.arange(mw) + 0.5) / mw * 7.0
    MLO, MLA = np.meshgrid(mlon, mlat)
    dkm_ = np.hypot((MLA - ib18[0]) * 111.2, (MLO - ib18[1]) * 111.2 * np.cos(ib18[0] * D2R))
    cand = np.where(dkm_ < 80, contrast, -1e9)
    ei, ej = np.unravel_index(np.argmax(cand), cand.shape)
    eye = (float(MLA[ei, ej]), float(MLO[ei, ej]))
    row("DS20", "MODIS pinhole eye (darkest spot against its 15-px surround) within 30 km of IBTrACS 06 UTC 18 May (13.4 N, 86.2 E)",
        [gcd(eye, ib18) / 1e3, ib18[0], ib18[1]], [0, 13.4, 86.2], [30, 0.05, 0.05])
    # M8 CHECK: the eye is the darkest pixel (σ = 2 px smoothed luminance) within 40 km of itself, to 5 px
    L2m = gaussian_filter(mim.mean(-1), 2.0)
    dke = np.hypot((MLA - eye[0]) * 111.2, (MLO - eye[1]) * 111.2 * np.cos(eye[0] * D2R))
    di_, dj_ = np.unravel_index(np.argmin(np.where(dke < 40, L2m, 1e9)), L2m.shape)
    row("DS20", "MODIS eye within 5 px of the darkest pixel (σ = 2 px luminance) within 40 km (#5b review 1 M8)", [float(np.hypot(di_ - ei, dj_ - ej))], [0], [5.0])
    hw_ = 300.0 / 111.2
    crop = (eye[0] - hw_, eye[0] + hw_, eye[1] - hw_ / np.cos(eye[0] * D2R), eye[1] + hw_ / np.cos(eye[0] * D2R))
    ci0, ci1 = int((MOD_N - crop[1]) / (MOD_N - MOD_S) * mh), int((MOD_N - crop[0]) / (MOD_N - MOD_S) * mh)
    cj0, cj1 = int((crop[2] - 83.0) / 7 * mw), int((crop[3] - 83.0) / 7 * mw)
    truth("DS20", f"MODIS crop rows {ci0}-{ci1} / cols {cj0}-{cj1} inside the {mh} × {mw} image (no clipped, stretched crop; #5b review 1 M8)",
          0 <= ci0 < ci1 <= mh and 0 <= cj0 < cj1 <= mw, [ci0, ci1, cj0, cj1])
    if not (0 <= ci0 < ci1 <= mh and 0 <= cj0 < cj1 <= mw):
        raise SystemExit("MODIS crop runs past the image: widen the GIBS box")
    sub_ = mim[ci0:ci1, cj0:cj1]
    # contrast enhanced (said on the source line), one linear stretch for all three channels: luminance p10 … p99.9 of the crop
    # → 30 … 255, γ 2.0 (the cloud shield is near-white; the stretch shows its texture and the dark pinhole)
    mlo_, mhi_ = np.percentile(sub_.mean(-1), [10, 99.9])
    sub_ = 30 + 225 * np.clip((sub_ - mlo_) / (mhi_ - mlo_), 0, 1) ** 2.0
    ce_ = (ei - ci0, ej - cj0)
    truth("DS20", "after the stretch the eye (7-px disc) is darker than its 15-30 px annulus by ≥ 40 grey levels",
          float(sub_.mean(-1)[ce_[0] - 3:ce_[0] + 4, ce_[1] - 3:ce_[1] + 4].mean()) < float(np.concatenate([sub_.mean(-1)[ce_[0] - 30:ce_[0] + 31, ce_[1] + 15:ce_[1] + 31].ravel(),
                                                                                                              sub_.mean(-1)[ce_[0] - 30:ce_[0] + 31, ce_[1] - 30:ce_[1] - 14].ravel()]).mean()) - 40)
    mc = Image.fromarray(sub_.astype(np.uint8))
    mc = mc.resize((1200, int(round(1200 * mc.height / mc.width))), Image.LANCZOS)
    mc.save(IMG / "modis_amphan.jpg", quality=92)
    crop_true = (MOD_N - ci1 / mh * (MOD_N - MOD_S), MOD_N - ci0 / mh * (MOD_N - MOD_S), 83.0 + cj0 / mw * 7, 83.0 + cj1 / mw * 7)
    borders = [p for _, ps in B1.shp_parts(F_NEB) for p in ps]
    inputs.append(F_NEB)
    V["amphan"] = {"c": list(acen), "msl": float(ac.msl_min) / 100, "radii10": [50, 100, 200, 300], "vt10": B1.r6(avt, 2), "vr10": B1.r6(avr, 2),
                   "inflow": float(AR.inflow_angle_mean_deg[0]), "ring_km": 50, "box": list(mb), "img_box": [float(lat_m[0] - 0.125), float(lat_m[-1] + 0.125), float(lon_m[0] - 0.125), float(lon_m[-1] + 0.125)],
                   "arrows": arrows, "best06": {"kt": ni["wmo_wind_kt"][k06], "hpa": ni["wmo_pres_hPa"][k06]}, "peak": {"kt": max(nd_w), "hpa": ni["newdelhi_pres_hPa"][kpk], "t": tt[kpk]},
                   "track": [[t, B1.r6(la_, 2), B1.r6(lo_, 2), w] for t, la_, lo_, w in track], "landfall": [tlat[lf[0]], tlon[lf[0]], tt[lf[0]]],
                   "places": {k: list(v) for k, v in PLACES_BD.items()}, "close": close,
                   "coast": B1.box_lines(coast, (5.0, 30.0, 75.0, 100.0), nd=2, step=2), "borders": B1.box_lines(borders, (5.0, 30.0, 75.0, 100.0), nd=2, step=2),
                   "coast_map": B1.box_lines(coast, (17.0, 25.0, 84.5, 92.5), nd=3), "borders_map": B1.box_lines(borders, (17.0, 25.0, 84.5, 92.5), nd=3),
                   "modis": {"crop": list(crop_true), "eye": list(eye), "ib18": list(ib18), "stretch": {"lum_lo": float(mlo_), "lum_hi": float(mhi_), "out": [30, 255], "gamma": 2.0}},
                   "sec": {"radii": arad, "levels": ERA5_LEVELS, "z_km": B1.r6(azm, 3), "vr": B1.r6(AVR, 2), "vt": B1.r6(AVT, 2),
                           "min": [float(AVR[im_, jm_]), arad[jm_], float(azm[im_])], "max": [float(AVR[iM_, jM_]), arad[jM_], float(azm[iM_])], "box": [0, 300, 0, 16]}}

    # ================================================================ back to the coast, the surge, the gauges (s26-s28, DS24-DS26)
    u20, v20 = H.u10.values[k20].astype(float), H.v10.values[k20].astype(float)

    def nearest(p):
        d = (LA2 - p[0]) ** 2 + ((LO2 - p[1]) * np.cos(p[0] * D2R)) ** 2
        j_ = np.unravel_index(np.argmin(d), d.shape)
        return float(u20[j_]), float(v20[j_]), float(LA2[j_]), float(LO2[j_])
    uF, vF, laF, loF = nearest(FMB)
    uS, vS, laS, loS = nearest(STP)
    spF = float(np.hypot(uF, vF))
    frm = float((np.degrees(np.arctan2(-uF, -vF)) + 360) % 360)
    row("DS24", "Fort Myers Beach nearest HRRR point 20 UTC: (22.232, 24.293) m/s, 32.93 m/s (≈ 33) from 222.5° (SW)", [uF, vF, spF, frm], [22.232, 24.293, 32.93, 222.5], [0.005, 0.005, 0.01, 0.1])
    cb = brg(NAPLES, ENGLEWOOD)
    row("DS24", "coast Naples → Englewood bearing 329.1° (NNW = 326.25-348.75; the 'NNW' word only, numbers in Part 4)", cb, 329.1, 0.1)
    truth("DS24", "wind from the SW blows within 45° of straight onto a coast running 329° (from 222.5° vs onshore normal 239°)", abs(((frm - (cb - 90)) + 180) % 360 - 180) < 45, frm - (cb - 90))
    cbS = 355.4
    import fluidpy.geo.vectors as GVm
    acrS = float(call("fluidpy.geo.vectors.components_in_axes", "s27", "along/across the St. Petersburg coast (355.4°)", u=[uS, vS], bearing_deg=cbS)[1])
    row("DS25", "St. Petersburg wind (−10.25, −16.0) blows out to sea (across +11.5 m/s in the 'left = offshore' axes of Part 4)", [uS, vS, acrS], [-10.25, -16.0, 11.5], [0.01, 0.01, 0.05])
    del GVm
    dFS = gcd(FMB, STP) / 1e3
    row("DS25", "Fort Myers Beach → St. Petersburg 160.5 km (≈ 160)", dFS, 160.5, 0.1)
    row("DS25", "NHC 10-15 ft = 3.05-4.57 m ('three to four and a half')", [10 * 0.3048, 15 * 0.3048], [3.05, 4.57], 0.005)
    # fix 0 B25b: the inverted barometer for Ian (official 938 hPa vs the 1013-hPa standard): 1 hPa ↔ 100 Pa / (ρ g) ≈ 1 cm
    row("DS25", "s27 (B25b): 1 hPa ↔ 100 / (1025 × 9.81) = 0.0099 m (≈ 1 cm); 1013 − 938 = 75 hPa → 0.75 m ('only about seventy five centimetres')",
        [100 / (1025 * G0), 1013 - say["p_best"], (1013 - say["p_best"]) * 100 / (1025 * G0)], [0.0099, 75, 0.746], [0.00005, 0, 0.005])
    Gg_ = xr.open_dataset(B1.F_COOPS)
    inputs.append(B1.F_COOPS)
    gt = Gg_.time.values
    w0, w1 = np.datetime64("2022-09-27T12:00"), np.datetime64("2022-09-29T00:00")
    selg = (gt >= w0) & (gt <= w1)
    hrs = ((gt[selg] - w0) / np.timedelta64(1, "h")).astype(float)
    gauges = {}
    for si_, sid_ in enumerate(Gg_.station.values.tolist()):
        if sid_ not in ("8725520", "8726520"):
            continue
        res_ = Gg_.residual.values[si_][selg].astype(float)
        jx = int(np.nanargmax(res_)) if sid_ == "8725520" else int(np.nanargmin(res_))
        gauges[sid_] = {"name": str(Gg_.name.values[si_]), "h": B1.r6(hrs[::2], 2), "res": B1.r6(res_[::2], 3), "ext": float(res_[jx]), "ext_h": float(hrs[jx]),
                        "lat": float(Gg_.lat.values[si_]), "lon": float(Gg_.lon.values[si_])}
    land_h = (np.datetime64("2022-09-28T19:05") - w0) / np.timedelta64(1, "h")
    row("DS25", "Fort Myers residual peak 2.209 m (≈ +2.2); St. Petersburg min −1.755 m (≈ −1.8)", [gauges["8725520"]["ext"], gauges["8726520"]["ext"]], [2.209, -1.755], 0.005)
    row("DS26", "both extremes within 4 h of landfall (19:05 UTC = h 31.1 of the 36-h window)", [abs(gauges["8725520"]["ext_h"] - land_h) <= 4, abs(gauges["8726520"]["ext_h"] - land_h) <= 4,
        float(land_h), hrs[-1] - hrs[0]], [1, 1, 31.083, 36], [0, 0, 0.01, 0])
    say.update({"fmb_ms": 33, "fmb_from": "SW", "res_fm": 2.2, "res_stp": -1.8, "d_fs": 160})
    # HRRR 20 UTC speed map, SW Florida → Tampa Bay; arrows from the data
    cb_box = (25.6, 28.4, -83.6, -81.2)
    clat = np.arange(cb_box[1] - 0.005, cb_box[0], -0.01)
    clon = np.arange(cb_box[2] + 0.005, cb_box[3], 0.01)
    CLO, CLA = np.meshgrid(clon, clat)
    sp20 = griddata(PTS, np.hypot(u20, v20).ravel(), (CLO, CLA), method="linear")
    sp20 = ndzoom(np.nan_to_num(sp20), 2, order=1)
    png_rgba(colour(sp20, B1.lut_rgb(SPEED_LUT), 0, 50), None, IMG / "ian_speed_20.png")
    arr20 = []
    for la_ in np.arange(25.8, 28.31, 0.3):
        for lo_a in np.arange(-83.4, -81.31, 0.3):
            d = (LA2 - la_) ** 2 + ((LO2 - lo_a) * np.cos(la_ * D2R)) ** 2
            j_ = np.unravel_index(np.argmin(d), d.shape)
            arr20.append([round(float(LA2[j_]), 3), round(float(LO2[j_]), 3), round(float(u20[j_]), 2), round(float(v20[j_]), 2)])
    # the shelf profile WSW of Fort Myers Beach: ETOPO 2022 60″ subset (NEW small download through fetch() and the guard)
    ep = fetch(ETOPO_URL, key="ETOPO2022-60s", fname="etopo2022_60s_swflorida_24.5-27.5N_-84.5--81.5E.nc", quiet=True,
               subset={"vars": ["z"], "sel": {"lat": slice(24.5, 27.5), "lon": slice(-84.5, -81.5)}})
    inputs.append(Path(ep))
    ET = xr.open_dataset(ep)
    etz = ET.z.values.astype(float)
    fet = RegularGridInterpolator((ET.lat.values, ET.lon.values), etz, bounds_error=False, fill_value=np.nan)
    sk = np.arange(0, 150.1, 2.0)
    qq = call(SPH + "destination_point", "s27", "points WSW (247.5°) of Fort Myers Beach (metres)", heavy_call=True, lat=FMB[0], lon=FMB[1], bearing=247.5, distance=sk * 1e3)
    prof = fet(np.c_[np.asarray(qq[0]), np.asarray(qq[1])])
    k20m = int(np.argmax(prof < -20))
    row("DS25", "shelf WSW of Fort Myers Beach: shallower than 20 m for ≥ 20 km, 50 m only beyond 80 km (wide, shallow)", [sk[k20m], sk[int(np.argmax(prof < -50))] if np.any(prof < -50) else 999],
        [40, 120], [20, 40])
    V["coast"] = {"box": list(cb_box), "fmb": [*FMB], "stp": [*STP], "uF": [uF, vF], "uS": [uS, vS], "spF": spF, "fromF": frm, "coast_brg": cb, "naples": list(NAPLES), "englewood": list(ENGLEWOOD),
                  "arrows": arr20, "coast": B1.box_lines(coast, (cb_box[0] - 0.2, cb_box[1] + 0.2, cb_box[2] - 0.2, cb_box[3] + 0.2), nd=3), "d_fs": dFS,
                  "shelf": {"km": sk.tolist(), "z": B1.r6(prof, 1)}, "gauges": gauges, "land_h": float(land_h), "window": ["2022-09-27T12", "2022-09-29T00"]}

    # ================================================================ PENDING v3: the flood flight + swipe (provisional Amphan; s29-s30, DS27-DS28)
    zb = np.load(gee_cached("zoom_base", "npz"))
    inputs.append(gee_cached("zoom_base", "npz"))
    nb = zb["nbar"]
    bed = zb["etopo1"]["bedrock"].astype(float)
    hB, wB = bed.shape
    W_, S_, E_, N_ = FLOOD["bay_box_wsen"]
    blat = N_ - (np.arange(hB) + 0.5) / hB * (N_ - S_)
    blon = W_ + (np.arange(wB) + 0.5) / wB * (E_ - W_)
    shelf = {}
    for lon_c in (89.0,):
        j_ = int(round((lon_c - W_) / (E_ - W_) * wB))
        col_ = bed[:, j_]
        coast_i = next(i for i in range(hB - 1, -1, -1) if col_[i] >= 0)
        k_ = next((i for i in range(coast_i + 1, hB) if col_[i] < -20), None)
        shelf[f"{lon_c}E"] = {"coast_lat": float(blat[coast_i]), "km_to_20m": None if k_ is None else float((blat[coast_i] - blat[k_]) * 111.2)}
    row("DS28", "shelf at 89.0 E: coast → 20-m isobath ≈ 33 km (ETOPO1, the GEE flight patch; provisional, v3)", shelf["89.0E"]["km_to_20m"], 33.0, 3.0)
    from skimage.measure import find_contours
    iso = {}
    for lev in (20, 200):
        Ls = []
        for cl in find_contours(np.where(bed > 0, 1.0, bed), -lev):
            if len(cl) < 20:
                continue
            la_ = np.interp(cl[:, 0], np.arange(hB), blat)
            lo_ = np.interp(cl[:, 1], np.arange(wB), blon)
            Ls.append(np.round(np.c_[lo_, la_][::3], 3).ravel().tolist())
        iso[str(lev)] = Ls
    rgbN = np.dstack([nb[n_].astype(np.float32) / 1e4 for n_ in ("Nadir_Reflectance_Band1", "Nadir_Reflectance_Band4", "Nadir_Reflectance_Band3")])
    land = (np.clip(rgbN / 0.18, 0, 1) ** (1 / 1.6) * 255).astype(np.uint8)
    dpt = np.clip(-bed, 1, 4000)
    tt_ = np.log10(dpt) / np.log10(4000)
    light, dark = np.array([150, 205, 222.0]), np.array([12, 30, 72.0])
    sea = (light[None, None] * (1 - tt_[..., None]) + dark[None, None] * tt_[..., None]).astype(np.uint8)
    seam = bed < 0
    patch = np.where(seam[..., None], sea, land)
    alp = np.where(~seam & (rgbN.sum(-1) <= 0), 0, 255)
    png_rgba(patch, alp, IMG / "bay_patch.png")
    depth_lut = ["#%02x%02x%02x" % tuple(int(c) for c in (light * (1 - t) + dark * t)) for t in np.linspace(0, 1, 16)]

    # ---- the swipe (user decision 2026-11-05, flood_visuals §v3.2): Cyclone Nargis 2008, Irrawaddy delta, MODIS Terra 7-2-1
    #      21 Apr (−11 d) | 5 May (+66 h), one fixed stretch (R 0-0.32, G 0-0.42, B 0-0.20, γ 1), b7 gaps filled from the
    #      nearest valid pixel (stated); landfall day 2 May Aqua true colour (GIBS). Mirrors research/flood_v3/_scripts/prep_pairs.py.
    from scipy import ndimage as NDI
    nz_path = gee_cached("v3_nargis2008", "npz")
    inputs.append(nz_path)
    NZ = np.load(nz_path)
    Wn, Sn, En, Nn = NARGIS["box_wsen"]
    Wc, Sc, Ec, Nc = NARGIS["crop_wsen"]

    def m721(key):
        a_ = NZ[key]
        raw = np.dstack([a_[b].astype("f4") for b in ("sur_refl_b07", "sur_refl_b02", "sur_refl_b01")])
        gaps = []
        for c in range(3):
            bad = raw[..., c] < -1000
            gaps.append(float(bad.mean()))
            if bad.any():
                idx = NDI.distance_transform_edt(bad, return_distances=False, return_indices=True)
                raw[..., c] = raw[..., c][tuple(idx)]
        o_ = np.empty(raw.shape, np.float32)
        for b in range(3):
            lo_b, hi_b = NARGIS["stretch"][b]
            o_[..., b] = np.clip((raw[..., b] / 1e4 - lo_b) / (hi_b - lo_b), 0, 1)
        img_ = (o_ * 255 + 0.5).astype(np.uint8)
        hh, ww = img_.shape[:2]
        x0, x1 = round((Wc - Wn) / (En - Wn) * ww), round((Ec - Wn) / (En - Wn) * ww)
        y0, y1 = round((Nn - Nc) / (Nn - Sn) * hh), round((Nn - Sc) / (Nn - Sn) * hh)
        return img_[y0:y1, x0:x1], gaps, a_.shape
    bef, gb_, shb = m721("2008-04-21_MOD")
    aft, ga_, sha = m721("2008-05-05_MOD")
    Image.fromarray(bef).save(IMG / "swipe_before.jpg", quality=92)
    Image.fromarray(aft).save(IMG / "swipe_after.jpg", quality=92)
    row("DS27", "Nargis swipe pair on one grid (same shape, same box), one fixed stretch; b7 gap fill ≤ 15 % per band",
        [bef.shape == aft.shape, shb == sha, max(gb_), max(ga_)], [1, 1, 0, 0], [0, 0, 0.15, 0.15])
    # water reads dark: the share of dark-blue (water-like) land-box pixels grows from before to after (b7 & b2 low)
    def wet(img_):
        return float(np.mean((img_[..., 0] < 60) & (img_[..., 1] < 90)))
    wb_, wa_ = wet(bef), wet(aft)
    row("DS27", f"the flood reads: dark (SWIR and NIR low) share grows from {wb_:.2f} (21 Apr) to {wa_:.2f} (5 May), by ≥ 0.10", [wa_ - wb_ >= 0.10], [1], 0)
    nsid = "2008117N11090"
    nt = call("fluidpy.data.ibtracs.storm_table", "s30", "IBTrACS NI Nargis fixes", heavy_call=True, path=F_NI, sid=nsid, agencies=("usa", "newdelhi"))
    ntt = nt["time"]
    nl = [i_ for i_, t in enumerate(ntt) if nt["landfall_km"][i_] == 0]
    k09 = ntt.index("2008-05-02 09:00:00")
    k12 = ntt.index("2008-05-02 12:00:00")
    row("DS27", "IBTrACS Nargis: landfall flag first 0 at 09 UTC 2 May (16.0 N 94.1 E; crossing before 12 UTC, 16.0 N 94.5 E) — landfall day 2 May",
        [nt["lat"][k09], nt["lon"][k09], int(ntt[nl[0]][11:13]), int(ntt[nl[0]][8:10]), nt["lat"][k12], nt["lon"][k12]],
        [16.0, 94.1, 9, 2, 16.0, 94.5], [0.05, 0.05, 0, 0, 0.05, 0.05])
    row("DS27", "dates from landfall (≈ 10-12 UTC 2 May): 21 Apr = −11 d; 5 May ≈ Terra 04-05 UTC = +66 h (from 10 UTC 2 May)",
        [(np.datetime64("2008-05-02") - np.datetime64("2008-04-21")) / np.timedelta64(1, "D"), (np.datetime64("2008-05-05T04") - np.datetime64("2008-05-02T10")) / np.timedelta64(1, "h")],
        [11, 66], 0)
    import fluidpy.data.gibs as GB2
    gst = GB2.fetch_wms("MODIS_Aqua_CorrectedReflectance_TrueColor", "2008-05-02", (12.6, 19.6), (89.5, 100.5), width=1920, tag="nargis_storm")
    inputs.append(Path(gst))
    Image.fromarray(storm_stretch(np.asarray(Image.open(gst).convert("RGB")))).save(IMG / "nargis_storm.jpg", quality=92)   # notes2 S6: contrast enhanced
    ntrack = [[t, nt["lat"][i_], nt["lon"][i_], nt["wmo_wind_kt"][i_]] for i_, t in enumerate(ntt) if "2008-04-28" <= t[:10] <= "2008-05-03"]
    say.update({"shelf_km": 33, "n_before_d": 11, "n_after_h": 66})
    V["flood"] = {**FLOOD, **{"nargis": {**NARGIS, "track": ntrack, "landfall_fix": [nt["lat"][nl[0]], nt["lon"][nl[0]], ntt[nl[0]]], "storm_img_box": [12.6, 19.6, 89.5, 100.5],
                  "gaps": [gb_, ga_], "wet": [wb_, wa_], "swipe_px": list(bef.shape[:2])}},
                  "shelf": shelf, "iso": iso, "depth_lut": depth_lut}

    # ================================================================ user notes 2026-11-06 (prompt_b.docx): the flood section (s30-s34, DS31-DS36)
    # Natural colour first (MODIS bands 1-4-3, the same granules, box and pinning as the 7-2-1 pair), the Nargis and Idai case studies
    # (IBTrACS tracks, intensity at landfall, NASA pictures of the storms), the Idai before/after back (v3 runner-up), and the Amphan
    # Sentinel-1 radar pair (optical pictures cloud-covered for days). Every array is a cache hit of the flood research fetches.
    def gapfill(raw):
        gaps = []
        for c in range(raw.shape[-1]):
            bad = raw[..., c] < -1000
            gaps.append(float(bad.mean()))
            if bad.any():
                idx = NDI.distance_transform_edt(bad, return_distances=False, return_indices=True)
                raw[..., c] = raw[..., c][tuple(idx)]
        return raw, gaps

    def crop_px(img_, box_wsen, crop_wsen):
        hh, ww = img_.shape[:2]
        Wb, Sb, Eb, Nb = box_wsen
        Wc_, Sc_, Ec_, Nc_ = crop_wsen
        x0, x1 = round((Wc_ - Wb) / (Eb - Wb) * ww), round((Ec_ - Wb) / (Eb - Wb) * ww)
        y0, y1 = round((Nb - Nc_) / (Nb - Sb) * hh), round((Nb - Sc_) / (Nb - Sb) * hh)
        return img_[y0:y1, x0:x1]
    TC_STRETCH = {"hi": 0.28, "gamma": 1.5}                 # natural colour: reflectance 0 … 0.28 → 0 … 1, then ^(1/1.5); one stretch for every date

    def modis_pair(npz, key, box_wsen, crop_wsen):
        """(true colour 1-4-3, false colour 7-2-1, gap fractions) of one MODIS day, cropped; one fixed stretch each (7-2-1 = the Nargis one)"""
        a_ = npz[key]
        tc, gtc = gapfill(np.dstack([a_[b].astype("f4") for b in ("sur_refl_b01", "sur_refl_b04", "sur_refl_b03")]))
        fc, gfc = gapfill(np.dstack([a_[b].astype("f4") for b in ("sur_refl_b07", "sur_refl_b02", "sur_refl_b01")]))
        # b1 is 250 m, b4 and b3 are 500 m on the same grid: one Gaussian (σ = half a 500-m pixel) on all three bands so the colours line
        # up (no red / cyan fringes at cloud edges); stated in the manifest
        px_m = (box_wsen[2] - box_wsen[0]) * 111320.0 * np.cos(np.deg2rad(0.5 * (box_wsen[1] + box_wsen[3]))) / tc.shape[1]
        sig = 0.5 * 500.0 / px_m
        tc = np.dstack([gaussian_filter(tc[..., c], sig) for c in range(3)])
        tco = (np.clip(tc / 1e4 / TC_STRETCH["hi"], 0, 1) ** (1 / TC_STRETCH["gamma"]) * 255 + 0.5).astype(np.uint8)
        fco = np.empty(fc.shape, np.float32)
        for b in range(3):
            lo_b, hi_b = NARGIS["stretch"][b]
            fco[..., b] = np.clip((fc[..., b] / 1e4 - lo_b) / (hi_b - lo_b), 0, 1)
        fco = (fco * 255 + 0.5).astype(np.uint8)
        return crop_px(tco, box_wsen, crop_wsen), crop_px(fco, box_wsen, crop_wsen), max(gtc + gfc)

    # ---- Nargis in natural colour (s32): the same two granules (Terra 21 Apr, 5 May), the same crop
    tcb, fcb, g1_ = modis_pair(NZ, "2008-04-21_MOD", NARGIS["box_wsen"], NARGIS["crop_wsen"])
    tca, fca, g2_ = modis_pair(NZ, "2008-05-05_MOD", NARGIS["box_wsen"], NARGIS["crop_wsen"])
    row("DS31", "Nargis natural-colour pair: same grid and crop as the 7-2-1 pair; the 7-2-1 crop here = the swipe images (pinning); gap fill ≤ 15 %",
        [tcb.shape == bef.shape, tca.shape == aft.shape, int(np.abs(fcb.astype(int) - bef.astype(int)).max()), int(np.abs(fca.astype(int) - aft.astype(int)).max()), max(g1_, g2_)],
        [1, 1, 0, 0, 0], [0, 0, 0, 0, 0.15])
    Image.fromarray(tcb).save(IMG / "nargis_tc_before.jpg", quality=92)
    Image.fromarray(tca).save(IMG / "nargis_tc_after.jpg", quality=92)

    def brownness(img_):
        """share of pixels whose colour is brownish (R ≥ G ≥ B, R − B ≥ 25 grey levels, not cloud-white): 'floodwater and wet soil both look brown'"""
        r_, g_, b_ = (img_[..., i].astype(int) for i in range(3))
        return float(np.mean((r_ >= g_) & (g_ >= b_) & (r_ - b_ >= 25) & (r_ < 200)))
    # where the 7-2-1 'after' picture shows new dark water, the natural-colour 'after' picture is brown, not blue (why false colour is needed)
    new_w = ((aft[..., 0] < 60) & (aft[..., 1] < 90)) & ~((bef[..., 0] < 60) & (bef[..., 1] < 90))
    tca_new = tca[new_w]
    tc_new_brown = brownness(tca_new[None]) if tca_new.size else 0.0
    tc_new_blue = float(np.mean(tca_new[:, 2].astype(int) > tca_new[:, 0].astype(int) + 20)) if tca_new.size else 1.0
    row("DS31", f"natural colour hides the flood: of the pixels that turn to dark water in 7-2-1 ({new_w.mean():.2f} of the picture), {tc_new_brown:.2f} look brown "
        f"and only {tc_new_blue:.2f} look blue in natural colour", [tc_new_brown >= 0.5, tc_new_blue <= 0.15], [1, 1], 0)
    # the colour key from the picture itself (s32 swatches): median colour of each class in the 7-2-1 'before' picture
    rB, gB, bB = (bef[..., i].astype(int) for i in range(3))
    cls = {"plants": (gB > rB + 40) & (gB > 120), "dry fields": (rB > gB + 25) & (rB > 150) & (bB > 100) & (bB < 200), "clouds": (rB > 215) & (gB > 215) & (bB > 215),
           "water": (rB < 40) & (gB < 50) & (bB > 60)}
    key_rgb = {k_: [int(np.median(bef[m_][:, i])) for i in range(3)] for k_, m_ in cls.items()}
    truth("DS31", "7-2-1 colour key from the picture: dry fields pink (R > G, B mid), plants green, water dark blue, clouds white; each class ≥ 0.5 % of the picture",
          all(m_.mean() >= 0.005 for m_ in cls.values()) and key_rgb["dry fields"][0] > key_rgb["dry fields"][1] and key_rgb["water"][2] > key_rgb["water"][0],
          {k_: [round(float(m_.mean()), 3), key_rgb[k_]] for k_, m_ in cls.items()})

    # ---- Nargis as a case study (s31): IBTrACS NI track, phases, landfall intensity, the closest approach to Yangon
    YANGON = (16.80, 96.16)
    nlat, nlon = np.array(nt["lat"], float), np.array(nt["lon"], float)
    wkt = nt["wmo_wind_kt"]
    k25 = 0
    kw = int(np.argmin(nlon[:ntt.index("2008-05-01 00:00:00")]))                 # the westernmost fix before the turn
    row("DS32", "Nargis (IBTrACS NI 2008117N11090): first fix 25 Apr 12 UTC at 10.5 N 90.3 E (south of the Bay); west to 85.4 E by 28 Apr; north to 15.6 N by 1 May 00 UTC",
        [int(ntt[k25][8:10]), nlat[k25], nlon[k25], nlon[kw], int(ntt[kw][8:10]), nlat[ntt.index("2008-05-01 00:00:00")]], [25, 10.5, 90.3, 85.4, 28, 15.6], [0, 0.05, 0.05, 0.05, 0, 0.05])
    row("DS32", "then east: 88.5 E (1 May 00 UTC) → 94.1 E at the first land fix (09 UTC 2 May, 16.0 N): the delta's south-western corner (Cape Negrais ≈ 16.0 N 94.2 E)",
        [nlon[ntt.index("2008-05-01 00:00:00")], nlon[k09], nlat[k09], abs(nlon[k09] - 94.2) <= 0.2], [88.5, 94.1, 16.0, 1], [0.05, 0.05, 0.05, 0])
    row("DS32", "landfall intensity (WMO = IMD, 3-min) 09-12 UTC 2 May: 90 kt, 962 hPa; 90 × 1.852 = 166.7 (≈ 167) km/h; ÷ 3.6 = 46.3 (≈ 46) m/s",
        [wkt[k09], wkt[k12], nt["wmo_pres_hPa"][k09], 90 * 1.852, 90 * 1.852 / 3.6], [90, 90, 962, 166.7, 46.3], [0, 0, 0, 0.05, 0.05])
    tN = np.array([np.datetime64(t.replace(" ", "T")) for t in ntt]).astype("datetime64[s]").astype(float)
    tfN = np.arange(tN[k09], tN[-1], 600.0)
    dY = np.asarray(call(SPH + "great_circle_distance", "s31", "Nargis track → Yangon (metres)", heavy_call=True, lat1=np.interp(tfN, tN, nlat), lon1=np.interp(tfN, tN, nlon),
                         lat2=YANGON[0], lon2=YANGON[1]))
    row("DS32", f"then it crossed the delta eastward: 95.6 E at 18 UTC 2 May, closest approach to Yangon {dY.min() / 1e3:.0f} km (≤ 30 km) on 3 May",
        [nlon[ntt.index("2008-05-02 18:00:00")], dY.min() / 1e3 <= 30], [95.6, 1], [0.05, 0])
    # the MODIS Aqua picture of 2 May (s31): the eye is the darkest spot within 80 km of the 06 UTC fix (16.0 N 93.6 E), just off the coast
    sim = np.asarray(Image.open(gst).convert("RGB")).astype(float)
    sh_, sw_ = sim.shape[:2]
    slat = 19.6 - (np.arange(sh_) + 0.5) / sh_ * 7.0
    slon = 89.5 + (np.arange(sw_) + 0.5) / sw_ * 11.0
    SLO, SLA = np.meshgrid(slon, slat)
    k06 = ntt.index("2008-05-02 06:00:00")
    Ls_ = gaussian_filter(sim.mean(-1), 2.0)
    dk_ = np.hypot((SLA - nlat[k06]) * 111.2, (SLO - nlon[k06]) * 111.2 * np.cos(nlat[k06] * D2R))
    ei_, ej_ = np.unravel_index(np.argmin(np.where(dk_ < 80, Ls_, 1e9)), Ls_.shape)
    neye = (float(SLA[ei_, ej_]), float(SLO[ei_, ej_]))
    row("DS32", "the eye in the MODIS Aqua picture of 2 May (darkest spot, σ = 2 px) lies within 30 km of the IBTrACS 06 UTC fix and ≥ 30 km west of the coast (94.2 E)",
        [gcd(neye, (nlat[k06], nlon[k06])) / 1e3 <= 30, (94.2 - neye[1]) * 111.2 * np.cos(16 * D2R) >= 30], [1, 1], 0)
    # the delta is low: ETOPO 2022 60″ land heights in the swipe box (NEW small OPeNDAP subset through fetch() and the guard)
    epd = fetch(ETOPO_URL, key="ETOPO2022-60s", fname="etopo2022_60s_irrawaddy_15.6-17.6N_94-96.6E.nc", quiet=True,
                subset={"vars": ["z"], "sel": {"lat": slice(15.6, 17.6), "lon": slice(94.0, 96.6)}})
    inputs.append(Path(epd))
    ETd = xr.open_dataset(epd)
    zd = ETd.z.values.astype(float)
    dl, dn = ETd.lat.values, ETd.lon.values
    insw = (dl[:, None] >= 15.7) & (dl[:, None] <= 17.1) & (dn[None, :] >= 94.6) & (dn[None, :] <= 96.0)   # the delta plain (the hills of the Arakan Yoma west of 94.6 E left out)
    landd = zd[insw & (zd > 0)]
    share5 = float(np.mean(landd <= 5.0))
    row("DS32", f"the Irrawaddy delta is low: of the land in 15.7-17.1 N, 94.6-96.0 E, {share5:.2f} lies ≤ 5 m above sea level, median {np.median(landd):.1f} m "
        "('most of it only a few metres above the sea')", [share5 >= 0.5], [1], 0)
    nlines = B1.box_lines(coast, (14.0, 18.5, 93.0, 97.5), nd=3)
    V["nargis"] = {"track": [[t, nlat[i_], nlon[i_], wkt[i_]] for i_, t in enumerate(ntt) if t[:10] <= "2008-05-03"], "landfall": [nlat[k09], nlon[k09], ntt[k09]],
                   "lf_kt": wkt[k09], "lf_hpa": nt["wmo_pres_hPa"][k09], "west": [nlat[kw], nlon[kw], ntt[kw]], "turn": [nlat[ntt.index("2008-05-01 00:00:00")], nlon[ntt.index("2008-05-01 00:00:00")]],
                   "yangon": list(YANGON), "yangon_km": float(dY.min() / 1e3), "eye": list(neye), "eye_fix": [nlat[k06], nlon[k06]], "storm_box": [12.6, 19.6, 89.5, 100.5],
                   "low_share5": share5, "low_median": float(np.median(landd)), "coast": nlines, "tc_stretch": TC_STRETCH, "key_rgb": key_rgb,
                   "tc_new_brown": tc_new_brown, "tc_new_blue": tc_new_blue}
    say.update({"n_kt": 90, "n_kmh": 167, "n_ms": 46})

    # ---- Idai (s33-s34): IBTrACS SI track, landfall, the VIIRS picture of 14 Mar, the MODIS pair (v3 runner-up) in both colourings
    F_SI = RAWD / "IBTrACS-v04r01" / "IBTrACS.SI.v04r01.nc"
    it_ = call("fluidpy.data.ibtracs.storm_table", "s33", "IBTrACS SI Idai fixes", heavy_call=True, path=F_SI, sid="2019063S18038", agencies=("usa", "reunion"))
    inputs.append(F_SI)
    itt = it_["time"]
    ilat, ilon, iwk = np.array(it_["lat"], float), np.array(it_["lon"], float), it_["wmo_wind_kt"]
    ki0 = itt.index("2019-03-09 06:00:00")
    klf = next(i_ for i_, t in enumerate(itt) if t >= "2019-03-14" and it_["landfall_km"][i_] == 0)
    k15 = itt.index("2019-03-15 00:00:00")
    row("DS33", "Idai (IBTrACS SI 2019063S18038) in the Mozambique Channel: WMO (Réunion, 10-min) 30 kt at 06 UTC 9 Mar (40.2 E) → 105 kt on 13-14 Mar (38.5-37.9 E)",
        [iwk[ki0], ilon[ki0], max(w for w in iwk[ki0:klf] if w is not None)], [30, 40.2, 105], [0, 0.05, 0])
    row("DS33", "first land fix 21 UTC 14 Mar (19.8 S 35.2 E); WMO at 00 UTC 15 Mar 85 kt, 960 hPa (19.7 S 34.8 E, at Beira); 85 × 1.852 = 157.4 km/h ÷ 3.6 = 43.7 (≈ 44) m/s",
        [int(itt[klf][11:13]), int(itt[klf][8:10]), ilat[klf], ilon[klf], iwk[k15], it_["wmo_pres_hPa"][k15], 85 * 1.852, 85 * 1.852 / 3.6], [21, 14, -19.8, 35.2, 85, 960, 157.4, 43.7],
        [0, 0, 0.05, 0.05, 0, 0, 0.05, 0.05])
    truth("DS33", "21 UTC 14 Mar - 00 UTC 15 Mar = 23:00-02:00 local time in Beira (UTC+2): 'around midnight, between the fourteenth and the fifteenth'", True, ["23:00", "02:00"])
    igb = GB2.fetch_wms("VIIRS_SNPP_CorrectedReflectance_TrueColor", "2019-03-14", (-30.0, -10.0), (30.0, 50.0), width=2000, tag="idai")   # cache hit (registry NASA-GIBS-idai2019)
    inputs.append(Path(igb))
    vim = Image.open(igb).convert("RGB")
    vim.resize((1600, 1600), Image.LANCZOS).save(IMG / "idai_viirs.jpg", quality=90)
    iz_path = gee_cached("v3_idai2019", "npz")
    inputs.append(iz_path)
    IZ = np.load(iz_path)
    IBOX, ICROP = [33.6, -20.6, 35.2, -19.3], [33.8, -20.2, 34.95, -19.35]
    itb, ifb, g3_ = modis_pair(IZ, "2019-03-11_MYD", IBOX, ICROP)
    ita, ifa, g4_ = modis_pair(IZ, "2019-03-25_MOD", IBOX, ICROP)
    row("DS34", "Idai pair: Aqua 11 Mar | Terra 25 Mar 2019 on one grid (same crop 33.80-34.95 E, 20.20-19.35 S), the Nargis stretches; gap fill ≤ 15 %",
        [itb.shape == ita.shape, ifb.shape == ifa.shape, max(g3_, g4_)], [1, 1, 0], [0, 0, 0.15])
    for nm_, im_ in (("idai_tc_before", itb), ("idai_tc_after", ita), ("idai_721_before", ifb), ("idai_721_after", ifa)):
        Image.fromarray(im_).save(IMG / f"{nm_}.jpg", quality=92)
    dk_b, dk_a = (ifb[..., 0] < 60) & (ifb[..., 1] < 90), (ifa[..., 0] < 60) & (ifa[..., 1] < 90)
    cl_b = (ifb.astype(int).sum(-1) > 600)
    new_i = float(np.mean(dk_a & ~dk_b & ~cl_b))
    row("DS34", f"the Idai flood reads in 7-2-1: pixels dark (water) on 25 Mar that were neither dark nor cloud on 11 Mar = {new_i:.3f} of the picture (≥ 0.05; "
        f"dark share {wet(ifb):.2f} → {wet(ifa):.2f}, the sea is in both)", [new_i >= 0.05], [1], 0)
    lf_t = np.datetime64("2019-03-14T21:00")
    row("DS34", "dates from landfall (21 UTC 14 Mar): Aqua 11 Mar ≈ 11 UTC = −3.4 d ('three and a half days before'); Terra 25 Mar ≈ 08 UTC = +10.5 d ('about ten days after')",
        [(lf_t - np.datetime64("2019-03-11T11:00")) / np.timedelta64(1, "h") / 24, (np.datetime64("2019-03-25T08:00") - lf_t) / np.timedelta64(1, "h") / 24], [3.4, 10.5], [0.1, 0.1])
    ilines = B1.box_lines(coast, (-32.0, -8.0, 28.0, 52.0), nd=2, step=2)
    V["idai"] = {"track": [[t, ilat[i_], ilon[i_], iwk[i_]] for i_, t in enumerate(itt) if "2019-03-09" <= t[:10] <= "2019-03-16"], "landfall": [ilat[klf], ilon[klf], itt[klf]],
                 "lf_kt": iwk[k15], "lf_hpa": it_["wmo_pres_hPa"][k15], "viirs_box": [-30.0, -10.0, 30.0, 50.0], "box_wsen": IBOX, "crop_wsen": ICROP,
                 "before": "11 Mar 2019", "after": "25 Mar 2019", "places": [["Beira", -19.84, 34.84], ["Buzi", -19.87, 34.62], ["Dondo", -19.61, 34.74]],
                 "coast": ilines, "coast_zoom": B1.box_lines(coast, (-21.0, -18.5, 33.5, 35.5), nd=3), "wet": [wet(ifb), wet(ifa)]}
    say.update({"i_kt": 85, "i_kmh": 157, "i_ms": 44})

    # ---- Amphan (s30): optical pictures cloud-covered for days (GIBS MODIS Terra 21 and 22 May), then the Sentinel-1 radar pair
    SBOX = [88.8, 22.12, 89.92, 22.75]
    cl_imgs = {}
    for d_ in ("2020-05-21", "2020-05-22"):
        gp_ = GB2.fetch_wms("MODIS_Terra_CorrectedReflectance_TrueColor", d_, (21.45, 23.35), (87.6, 90.8), width=1000, tag="amphan_after_clouds", expected_bytes=1_500_000)
        inputs.append(Path(gp_))
        cl_imgs[d_] = np.asarray(Image.open(gp_).convert("RGB"))
        Image.fromarray(crop_px(cl_imgs[d_], (87.6, 21.45, 90.8, 23.35), SBOX)).resize((1120, 660), Image.LANCZOS).save(IMG / f"amphan_clouds_{d_[-2:]}.jpg", quality=90)
    cloudy = {d_: float(np.mean(crop_px(cl_imgs[d_], (87.6, 21.45, 90.8, 23.35), SBOX).mean(-1) > 170)) for d_ in cl_imgs}
    row("DS35", f"Amphan's coast hidden by cloud after landfall: bright (cloud) share of the radar box in MODIS Terra true colour 21 May {cloudy['2020-05-21']:.2f}, 22 May {cloudy['2020-05-22']:.2f} (≥ 0.6)",
        [cloudy["2020-05-21"] >= 0.6, cloudy["2020-05-22"] >= 0.6], [1, 1], 0)
    s1p, jrp = gee_cached("close_s1", "npz"), gee_cached("close_jrc", "npz")
    inputs += [s1p, jrp]
    S1 = np.load(s1p)
    JR = np.load(jrp)["jrc"]
    vb_ = S1["s1_o150_2020-05-16"]["VV"].astype(np.float32)
    va_ = S1["s1_o150_2020-05-22"]["VV"].astype(np.float32)
    vb_[vb_ == 0], va_[va_ == 0] = np.nan, np.nan
    NW = s1_new_water(vb_, va_, JR["seasonality"], SBOX)
    km2_px, valid, new_s1, new_km2 = NW["km2_px"], NW["valid"], NW["mask"], NW["new_km2"]
    s1_mask_png(new_s1, IMG / "amphan_s1_new.png")
    s1_rows(row, NW)
    row("DS36", "Sentinel-1 (orbit 150, VV) 16 → 22 May 2020, 88.80-89.92 E, 22.12-22.75 N: new water (VV < −18 dB after, not before, drop ≥ 3 dB, not permanent water "
        "(JRC seasonality ≥ 10 months), blobs ≥ 9 px) = 124.9 km² ('about a hundred and twenty five'); √125 = 11.18 ('a square eleven kilometres on each side')",
        [new_km2, np.sqrt(125), 11 * 11], [124.9, 11.18, 121], [0.1, 0.005, 0])
    for nm_, vv_ in (("amphan_s1_before", vb_), ("amphan_s1_after", va_)):
        g_ = (np.nan_to_num(np.clip((vv_ + 24.0) / 24.0, 0, 1)) * 255 + 0.5).astype(np.uint8)       # VV −24 … 0 dB → grey 0 … 255, one stretch for both dates
        Image.fromarray(g_).save(IMG / f"{nm_}.jpg", quality=90)
    row("DS36", "dates: 16 May 23:55 UTC (before Amphan; it formed that day far south); 22 May 23:55 UTC − first land fix 09 UTC 20 May = 2.6 d ('two and a half days after landfall')",
        [(np.datetime64("2020-05-22T23:55") - np.datetime64("2020-05-20T09:00")) / np.timedelta64(1, "h") / 24], [2.6], [0.05])
    V["amphan_s1"] = {"box_wsen": SBOX, "new_km2": new_km2, "km2_px": float(km2_px), "valid_km2": float(valid.sum() * km2_px), "stretch_db": [-24, 0], "threshold_db": -18,
                      "times_utc": ["2020-05-16T23:55", "2020-05-22T23:55"], "orbit": 150, "cloudy": cloudy, "coast": B1.box_lines(coast, (21.9, 22.95, 88.6, 90.1), nd=3),
                      "places": [["Satkhira", PLACES_BD["Satkhira"][0], PLACES_BD["Satkhira"][1]]], **s1_fields(NW)}
    say.update({"s1_km2": 125, "s1_side": 11, **S1_SAY})

    # ---- s24: what the dark lines and the empty corners of the two radius-height sections are (user notes item 7)
    from skimage.measure import find_contours as fc_

    def zero_info(Sx, rmax):
        ny2, nx2 = Sx.shape
        cs_ = fc_(Sx, 0.0, mask=np.isfinite(Sx))
        rz = lambda cl: np.c_[cl[:, 1] / (nx2 - 1) * rmax, 16 - cl[:, 0] / (ny2 - 1) * 16]  # noqa: E731
        main = max(cs_, key=len)
        mrz = rz(main)
        # the label goes on the low in | out border (z 0.9-4 km, r 55-90 % of the axis), searched over every piece of the contour
        allrz = np.concatenate([rz(c_) for c_ in cs_])
        lowb = allrz[(allrz[:, 1] > 0.9) & (allrz[:, 1] < 4) & (allrz[:, 0] > 0.55 * rmax) & (allrz[:, 0] < 0.9 * rmax)]
        lp = lowb[np.argmin(np.abs(lowb[:, 0] - 0.75 * rmax))] if len(lowb) else mrz[len(mrz) // 2]
        closed = [rz(c_) for c_ in cs_ if len(c_) > 40 and np.hypot(*(c_[0] - c_[-1])) < 2 and (rz(c_)[:, 1] > 3).all()]
        pocket = max(closed, key=len).mean(0) if closed else None
        fin_ = np.isfinite(Sx)
        rows_valid = np.where(fin_.any(1))[0]
        z_top = 16 - rows_valid.min() / (ny2 - 1) * 16
        col0 = np.where(fin_.any(0))[0].min() / (nx2 - 1) * rmax
        # the empty corner: on the lowest row that has data, the empty run from the left; its height at a third of that radius
        row_b = rows_valid.max()
        bottom = np.where(fin_[row_b - 2])[0]
        r_corner = bottom.min() / (nx2 - 1) * rmax if len(bottom) else rmax
        jc = int(round((col0 + r_corner) / 2 / rmax * (nx2 - 1)))      # halfway between the first data column and the corner's edge
        zc = 16 - np.where(fin_[:, jc])[0].max() / (ny2 - 1) * 16
        return {"line_pt": [float(lp[0]), float(lp[1])], "pocket": None if pocket is None else [float(pocket[0]), float(pocket[1])], "z_top": float(z_top),
                "r_first": float(col0), "corner": [float(r_corner), float(zc)], "n_lines": len(cs_)}
    zi_ian, zi_amp = zero_info(SEC, 200), zero_info(SA, 300)
    row("DS37", f"s24: the dark lines are u_r = 0 contours (Ian {zi_ian['n_lines']}, Amphan {zi_amp['n_lines']} pieces, each with a closed pocket); no data: above the top level "
        f"(Ian {zi_ian['z_top']:.1f} km, Amphan {zi_amp['z_top']:.1f} km), the bottom-left corner below the sea surface (Ian r < {zi_ian['corner'][0]:.0f} km, z < {zi_ian['corner'][1]:.1f} km; "
        f"Amphan r < {zi_amp['corner'][0]:.0f} km, z < {zi_amp['corner'][1]:.1f} km), Amphan inside its first ring (r < {zi_amp['r_first']:.0f} km)",
        [zi_ian["pocket"] is not None, zi_amp["pocket"] is not None, zi_ian["z_top"] < 16, zi_amp["z_top"] < 16, zi_ian["corner"][0] > 10, zi_amp["corner"][0] > 25, round(zi_amp["r_first"])],
        [1, 1, 1, 1, 1, 1, 25], 0)
    V["sec"]["zero"] = zi_ian
    V["amphan"]["sec"]["zero"] = zi_amp
    V["luts"] ={"ur": UR_LUT, "speed": B1.lut_hex(SPEED_LUT), "dbz": B1.lut_hex(DBZ_LUT), "depth": depth_lut}
    row("DS23", "s25/s31 recap numbers = scene rows: 0.048 m/s², ≈ 200 × smaller than g, 35 / 13", [round(acc, 3), round(9.81 / acc, -2), round(vt25), round(-vr25)], [0.048, 200, 35, 13], 0)
    V["say"] = say

    # ---------------------------------------------------------------------------------------------- report and write
    for r in rows:
        tag = ("PASS" if r["pass"] else "FAIL") if r["kind"] == "check" else ("ok  " if r["pass"] else "FLAG")
        print(f"  {tag}  {r['id']:5s} {r['name']}  -> {r['value']}")
    hard = [r for r in rows if r["kind"] == "check" and not r["pass"]]
    if hard:
        print(f"build_ch00_coordinates_storm: {len(hard)} check(s) FAILED — no data written")
        return 1

    def clean(o):
        if isinstance(o, dict):
            return {k: clean(v) for k, v in o.items()}
        if isinstance(o, (list, tuple)):
            return [clean(v) for v in o]
        if isinstance(o, (float, np.floating)):
            return None if not np.isfinite(o) else float(o)
        if isinstance(o, (bool, np.bool_)):
            return bool(o)
        if isinstance(o, np.integer):
            return int(o)
        if isinstance(o, np.ndarray):
            return clean(o.tolist())
        return o
    V = clean(V)
    blob = json.dumps(V, separators=(",", ":"), ensure_ascii=False, allow_nan=False).encode("utf-8")
    (DATA / "cs.json").write_bytes(blob)
    data_hashes = {"cs.json": hashlib.sha256(blob).hexdigest()}
    imgs = sorted(list(IMG.glob("*.png")) + list(IMG.glob("*.jpg")))
    for pimg in imgs:
        data_hashes[f"img/{pimg.name}"] = B1.sha_file(pimg)
    # the globe (s21, s29): the Blue Marble of the cross-product movie, unchanged
    render = {}
    for pub in a.public:
        pub.mkdir(parents=True, exist_ok=True)
        for pimg in imgs:
            (pub / f"cst_{pimg.name}").write_bytes(pimg.read_bytes())
        (pub / "cst_bmng.jpg").write_bytes(B1.F_BMNG.read_bytes())
        render = {pp_.name: B1.sha_file(pp_) for pp_ in sorted(pub.glob("cst_*"))}
    inputs.append(B1.F_BMNG)
    seen, inp = set(), {}
    for pq in inputs:
        pq = Path(pq)
        if str(pq) in seen:
            continue
        seen.add(str(pq))
        inp[str(pq.relative_to(ROOT)).replace("\\", "/") if ROOT in pq.parents else str(pq)] = B1.sha_file(pq)
    sizes = {k: (DATA / k).stat().st_size for k in data_hashes}
    manifest = {
        "id": "ch00_coordinates_storm", "title": TITLE, "storyboard": "movies/ch00/ch00_coordinates_storm/storyboard.yaml",
        "builder": "movies/data/build_ch00_coordinates_storm.py",
        "fluidpy": {"repo": "../Fluid Dynamics", **B1.git_sha(FLUID, {"coords_py": "fluidpy/core/coords.py", "kinematics_py": "fluidpy/core/kinematics.py",
                                                                     "frames_py": "fluidpy/geo/frames.py", "sphere_py": "fluidpy/geo/sphere.py",
                                                                     "vectors_py": "fluidpy/geo/vectors.py", "cyclone_py": "fluidpy/diag/cyclone.py",
                                                                     "radar_py": "fluidpy/diag/radar.py", "hrrr_py": "fluidpy/data/hrrr.py", "goes_py": "fluidpy/data/goes.py",
                                                                     "era5_arco_py": "fluidpy/data/era5_arco.py", "gibs_py": "fluidpy/data/gibs.py", "ibtracs_py": "fluidpy/data/ibtracs.py",
                                                                     "data_init_py": "fluidpy/data/__init__.py"})},
        "equations_note": "provenance only (QA/reviewer); the movie draws no equation labels or numbers (HOUSE_STYLE §5)",
        "equations": {"r̂, θ̂ and their θ-derivatives; cylindrical (r, θ, z)": "Kundu App. B §B.5 (printed p. 865; page image read 2026-11-05)",
                      "slopes of cos and sin, product rule, dθ/dt = v/r, v θ̂, −(v²/r) r̂": "derived on screen (D12-D19); checked against fluidpy.core.kinematics (Vallis §3.2 / Kundu (3.1))",
                      "storm-relative wind": "Vallis §2.2.2 (2.28)-(2.29) via fluidpy.diag.cyclone"},
        "parameters": {
            "ian": {"hrrr_sfc": "2022-09-28T18 (rings, s17), T20 (coast)", "hrrr_prs": {"url": HRRR_PRS, "levels_hPa": PRS_LEVELS, "window": PRS_BOX,
                    "route": "NEW: fetch(HRRR_PRS, key='HRRR-zarr', subset={'group': '<lv>mb/<var>/<lv>mb', …}) per level and variable (research ian_hrrr_prs.py)"},
                    "centre_winds": {"used": list(CALM), "method": "HRRR 10-m wind-speed minimum (the model's calm centre; = Part 1)"},
                    "centre_pictures": {"used": list(RADAR_EYE), "method": "NEXRAD KTBW 0.5° eyewall-circle fit (inner edge of ≥ 35 dBZ, Kasa least squares, 4 passes)",
                                        "fit_here": B1.r6(cen, 4), "radius_km": rfit},
                    "stack": {"levels_hPa": STACK_LEVELS, "square_km": 2 * half_k, "grid": "256² local tangent plane (x = a cos ϑc Δλ, y = a Δϑ; metres), griddata linear, ×4 order-1",
                              "colour": f"u_r diverging rose (−) ↔ pale ↔ blue (+), ±{UR_LIM} m/s, bold dark zero contour, NO hatch", "vertical_exaggeration": "×15 (stated in the scene list)"},
                    "section": {"radii_km": "5-200 every 5", "n_az": 72, "heights": "box-mean HRRR geopotential height per level", "mask": "a ring with any point where p_level > p_sfc (HRRR 18 UTC)"},
                    "w": "HRRR analysed ω NOT used (f00 carries no vertical motion: |ω| ≤ 0.095 Pa/s, 1-6 distinct values per level; report vertical_motion §1). "
                         "Measured: NOAA P-3 TDR 20220928H1 10:23 UTC ring-mean w (2-km bins, ≥ 70 % of the ring, about the HRD analysis origin 25.79 N 82.86 W); "
                         "derived: continuity w from the HRRR f00 (GRIB, 37 levels) ring-mean inflow round the calm centre (4-km bins, 12-km boxcar, w = 0 at the sea, cut at 13 km)",
                    "tdr": {"url": f"ftp://{TDR_HOST}{TDR_PATH}", "bytes": TDR_BYTES, "redistributable": False, "time_utc": TDR_T, "coverage_min": TDR_COV,
                            "panel": "r 0-100 km × z 0-14 km, cmocean dense 0 … +4 m/s, ≤ 0 drawn as 0; eye 0-22 km grey 'no echoes'",
                            "time_offset": "≈ 8 h before the HRRR 18 UTC winds (source line only)"}},
            "amphan": {"era5": "ARCO 2020-05-20T06, sfc + 10 pl; centre = ERA5 msl minimum", "rings_km": [50, 100, 200, 300], "section_radii_km": arad,
                       "section_mask": "a ring with any point where p_level > msl", "ibtracs_sid": AMPHAN_SID, "modis": "GIBS MODIS Terra 2020-05-18 (PNG 1400 × 2000 px, 9-19 N, 83-90 E); crop 600 km about the eye, contrast enhanced (lum p10-p99.9 → 30-255, γ 2)"},
            "flood_v3": {**FLOOD, "nargis": NARGIS},
            "flood_u1": {"note": "user notes 2026-11-06 (prompt_b.docx) items 8-11", "natural_colour": "MODIS bands 1-4-3 of the same granules and crops as the 7-2-1 pairs, "
                         "a Gaussian of half a 500-m pixel on all three bands (b1 250 m, b4/b3 500 m), reflectance 0-0.28 → 0-1, γ 1.5 (one stretch for every date)", "amphan_s1": {"orbit": 150, "box_wsen": [88.8, 22.12, 89.92, 22.75],
                         "dates_utc": ["2020-05-16T23:55", "2020-05-22T23:55"], "grey": "VV −24 … 0 dB", "new_water": "VV < −18 dB after, not before, drop ≥ 3 dB, not JRC "
                         "seasonality ≥ 10 months, blobs ≥ 9 px (8-connected): 124.9 km² (UN-SPIDER practice, adapted)"},
                         "nargis_ibtracs": "NI 2008117N11090; WMO = IMD 3-min", "idai_ibtracs": "SI 2019063S18038; WMO = RSMC La Réunion 10-min",
                         "idai_pair": "v3_idai2019: Aqua 2019-03-11 | Terra 2019-03-25, crop 33.80-34.95 E, 20.20-19.35 S", "s24_zero": "u_r = 0 contour points and no-data extents (DS37)",
                         "stack_spacing": "s18-s19: layers evenly spaced 0.9 units apart (heights not to scale; tags carry the heights)"},
            "time_compression": {"s01/s09": "one 75-min lap in ≈ 8-10 s", "s15": "streak families illustrative", "s18-s19": "tangential dashes animate one analysis hour"},
            "exaggerations": ["s03-s07 small turns drawn at 20°", "s04 slivers ×20", "s14 5° turn drawn at 15°", "s15-s16 vertical ×4", "s18-s19 layers evenly spaced (not to scale; user notes 2026-11-06)",
                              "s30 microwave pulses schematic", "s30-s34 swipe lines animate a comparison, not a time change",
                              "s20/s24 height axis stretched", "s27 sea-level inset ×50, shelf profile vertical exaggeration", "s14 isobars schematic", "s20/s24 in and out arrows schematic (summary of the u_r section)",
                              "s19 up arrows: TDR slanted ring-max w at 2/5/8/11 km on a schematic ring (the TDR ring radius, the stack's centre), length ∝ w, lean = the fitted outward slope"],
            "screen_deviations": ["s18 layers on a 500-km local tangent-plane square (true local shape, one centre for all levels; vortex tilt ignored, research §1d)",
                                  "s20 max outflow marker at the data's 125 km (storyboard text: 150 km)"],
            "data_report": "reports/data/ch00_coordinates_research.md (2026-11-05) §1b-§1d, §3 applied"},
        "credits": ["NOAA HRRR analyses (public domain) via the University of Utah HRRR-zarr archive.", "NOAA NEXRAD Level-II KTBW (public domain), NOAA NODD / Unidata.",
                    "NOAA GOES-16 ABI L2 CMIPM (public domain), true colour and contrast stretch by our code.", "ERA5: Contains modified Copernicus Climate Change Service information 2026 (ARCO-ERA5).",
                    "NASA Worldview / GIBS MODIS Terra corrected reflectance (NASA open data).", "IBTrACS v04r01 (NOAA NCEI). NOAA CO-OPS tide gauges (public domain). NHC TCR AL092022 (cited).",
                    "ETOPO 2022 and ETOPO1 (NOAA NCEI). MODIS MOD09/MYD09 and MCD43A4 (NASA LP DAAC) via Google Earth Engine.",
                    "Blue Marble: Next Generation, NASA Earth Observatory. Made with Natural Earth.",
                    "Vertical wind: NOAA P-3 tail Doppler radar (Level 2, mission 20220928H1) — NOAA AOML Hurricane Research Division; Gamache 1995 / Reasor et al. 2009 (synthesis); "
                    "Fischer, Rogers, Reasor and Gamache 2022, Mon. Wea. Rev. 150, 2255-2278, doi:10.1175/MWR-D-21-0223.1. Original files not redistributed; courtesy note to the HRD radar lead before publishing (user).", "Music: tools/sound (procedural synthesis, our own code, CC0-1.0).",
                    "Contains modified Copernicus Sentinel data 2020 (Sentinel-1 GRD, ESA), processed in Google Earth Engine (s30, user notes 2026-11-06).",
                    "NASA Worldview / GIBS VIIRS (Suomi NPP) and MODIS (Terra, Aqua) corrected reflectance (NASA open data) (s30, s31, s33).",
                    "MODIS MOD09/MYD09 v061 surface reflectance (NASA LP DAAC) via Google Earth Engine: Nargis 2008 and Idai 2019 pairs (s32, s34).",
                    "JRC Global Surface Water v1.4 (EC JRC / Google), seasonality: permanent water left out of the Sentinel-1 new-water count (s30).",
                    "ETOPO 2022 60 arc-second (NOAA NCEI): the Irrawaddy delta heights (s31)."],
        "js_selftest": "none — every number is read from data/cs.json (TSX CHECK rows re-assert the screen strings)",
        "inputs_sha256": inp, "render_assets": render, "data_files": data_hashes, "data_sizes_bytes": sizes, "checks": rows,
        "flags": [r for r in rows if r["kind"] == "flag"],
        "physics": [e for e in entries if e.get("sha256")], "physics_recorded": [e for e in entries if not e.get("sha256")], "physics_heavy": heavy,
    }
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=1, ensure_ascii=False, default=str), encoding="utf-8")
    nflag = sum(1 for r in rows if r["kind"] == "flag" and not r["pass"])
    print(f"build_ch00_coordinates_storm: cs.json {len(blob) / 1e3:.0f} kB + {len(imgs)} images ({sum(sizes.values()) / 1e6:.1f} MB); {len(entries)} parity entries, "
          f"{len(heavy)} heavy, {sum(1 for r in rows if r['kind'] == 'check')} checks ({sum(r['pass'] for r in rows if r['kind'] == 'check')} pass), {nflag} narration flag(s) -> {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
