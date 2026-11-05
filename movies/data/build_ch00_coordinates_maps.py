"""Physics and real-data products for the Chapter-0 movie #5g "Coordinates, Part 7 — Maps: projections and the view from the
pole" (movies/ch00/ch00_coordinates_maps/storyboard.yaml, 24 scenes; CHECK rows DM05, DM13, DM16-DM31 named in the storyboard,
DC32b and DC34-DC37 carried from build 1, plus DM40+ for this split movie's other screen numbers).

Run with the main venv::

    .venv/Scripts/python.exe movies/data/build_ch00_coordinates_maps.py [--public <render public dir> ...]

Every number the movie shows or says is computed here by the tested functions named in the storyboard's ``physics_source``
fields (no download; every input is already on disk):

* ``fluidpy.geo.mapproj`` (forward: platecarree, mercator, equalearth, gores, polar_stereographic, laea; scale_factors;
  tissot_ellipses with a = EARTH_RADIUS, never 1 — build-1 lesson),
* ``fluidpy.geo.sphere`` (arc_lengths, great_circle_distance, great_circle_points, rhumb_line, isometric_latitude,
  polygon_area, destination_point, gradient, wrap_lon),
* ``fluidpy.core.coords`` (velocity_components, unit_vectors_polar), ``fluidpy.geo.sphere.enu_basis``,
* ``fluidpy.diag.cyclone`` (storm_centre, storm_relative_wind), ``fluidpy.diag.trajectories.advect_on_sphere``,
  ``fluidpy.diag.climatology.global_mean``,

on NCEP/NCAR R1 10 hPa daily means (21 Jan 2026), the ERA5 Sep 2026 2-m temperature anomaly, NASA Blue Marble NG and Natural
Earth (110 m coast, 10 m admin-0, 50 m land).

Writes movies/ch00/ch00_coordinates_maps/data/mp.json (numbers + small arrays the composition only indexes, projects with the JS
mirrors of the mapproj formulas — checked against the Python values stored in ``jscheck`` — and interpolates),
data/img/*.png|jpg|bin (map rasters reprojected here with inverse maps checked by a forward round trip, the 10 hPa height field,
the anomaly maps, the wind trails) and manifest.json (function, provenance, parameters, fluidpy git SHA, sha256 of every input
and data file, parity hashes, chapter marks and maths-skip targets from timing.json). All CHECK rows must pass before anything is
written (exit 1 otherwise). ``flags`` lists screen/voice roundings that a hand check finds inconsistent (reported to the
director; the storyboard voice is fixed). With ``--public`` it also writes every render asset (mp_*) into each given dir.
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
OUT = ROOT / "movies" / "ch00" / "ch00_coordinates_maps"
DATA = OUT / "data"
IMG = DATA / "img"
sys.path.insert(0, str(FLUID))
sys.path.insert(0, str(Path(__file__).resolve().parent))
import build_ch00_coordinates as B1  # noqa: E402  (shared helpers and input paths)
import xarray as xr  # noqa: E402

D2R = np.pi / 180.0
TITLE = "Coordinates, Part 7 — Maps: projections and the view from the pole"
A_KM = 6371.0
BREST = (48.39, -4.49)
LYB = (78.22, 15.65)              # Longyearbyen, Svalbard (Part 3)
LON = (51.51, -0.13)              # London (Part 6 route)
LAX = (34.05, -118.24)            # Los Angeles (Part 6 route; s17 tour)
PSK = {"lat_0": 90.0, "lat_ts": 60.0}
PS_EDGE = 20.0                    # the polar map is cut at 20 N (the NCEP file's southern edge)
GM, GS, CS, DC, DT_ = "fluidpy.geo.mapproj.", "fluidpy.geo.sphere.", "fluidpy.core.coords.", "fluidpy.diag.cyclone.", "fluidpy.diag.trajectories."
# s17 tour (storyboard params; Canada, Scandinavia and the Bering Strait label spots added for the spoken names)
PLACES = {"brest": ("Brest", 48.39, -4.49, "land"), "iceland": ("Iceland", 65.0, -19.0, "land"), "greenland": ("Greenland", 72.0, -40.0, "land"),
          "scandinavia": ("Scandinavia", 64.0, 16.0, "land"), "longyearbyen": ("Longyearbyen", 78.22, 15.65, "land"),
          "barents": ("Barents Sea", 75.0, 40.0, "sea"), "siberia": ("Siberia", 65.0, 100.0, "land"), "bering": ("Bering Strait", 65.8, -169.0, "sea"),
          "alaska": ("Alaska", 65.0, -150.0, "land"), "canada": ("Canada", 56.0, -100.0, "land"), "hudson": ("Hudson Bay", 60.0, -85.0, "sea"),
          "la": ("Los Angeles", 34.05, -118.24, "land")}
CHAPTERS = [("s00_title", "Maps: the question"), ("s02_part6_recap", "What we use from Parts 1, 3 and 6"), ("s03_flattening", "Flattening the Earth"),
            ("s04_plate_carree", "Every step: the flat square map and its stretch (optional maths)"), ("s06_gradient_preview", "Scale factors on weather grids"),
            ("s07_mercator_idea", "Mercator's idea"), ("s08_mercator_dy", "Every step: Mercator's formula (optional maths)"),
            ("s12_rhumb_straight", "Why the rhumb line is straight"), ("s13_area_stretch", "The price: areas"),
            ("s14_equal_earth", "Equal-area maps: pick the map for the job"), ("s15_why_many", "Why so many coordinate systems"),
            ("s16_globe_to_pole", "The view from the pole"), ("s17_where_is_what", "A tour of the polar map"), ("s18_vortex", "The stratospheric polar vortex"),
            ("s19_vortex_components", "East is round, north is in"), ("s20_origin_wheel", "Choosing the origin"), ("s22_recap", "To sum up")]
# (block, scene of the chip, scene whose FIRST sentence is the "If you skipped" line) — storyboard maths_skip.blocks
SKIPS = [("A", "s04_plate_carree", "s06_gradient_preview"), ("B", "s08_mercator_dy", "s12_rhumb_straight")]


def chapters() -> dict:
    """Chapter marks and the maths-skip targets from the current timing.json (user rule 2026-11-05)."""
    tp = OUT / "timing.json"
    if not tp.exists():
        return {}
    tm = json.loads(tp.read_text(encoding="utf-8"))
    by = {s["id"]: s for s in tm["scenes"]}
    mmss = lambda t: f"{int(t) // 60}:{int(t) % 60:02d}"  # noqa: E731
    ch = [{"time": mmss(0 if i == 0 else by[sid]["start"]), "t_s": round(0.0 if i == 0 else by[sid]["start"], 3), "title": ti, "scene": sid}
          for i, (sid, ti) in enumerate(CHAPTERS)]
    sk = []
    for blk, a, b in SKIPS:
        q = by[b]["sentences"][0]
        assert q["text"].startswith("If you skipped"), b
        j = next(i for i, s in enumerate(by[a]["sentences"]) if "skip ahead" in s["text"])
        sk.append({"block": blk, "chip_scene": a, "chip_sentence": j, "chip_at_s": round(by[a]["sentences"][j]["start"], 3), "skip_to": mmss(q["start"]),
                   "skip_to_s": round(q["start"], 3), "keep_scene": b, "keep_line": q["text"]})
    return {"chapters": ch, "maths_skips": sk, "timing_provisional": bool(tm.get("provisional"))}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--public", type=Path, nargs="*", default=[], help="render public dir(s) for the mp_* assets")
    a = ap.parse_args()
    from PIL import Image
    Image.MAX_IMAGE_PIXELS = None
    DATA.mkdir(parents=True, exist_ok=True)
    IMG.mkdir(parents=True, exist_ok=True)
    for p in list(IMG.glob("*.png")) + list(IMG.glob("*.jpg")) + list(IMG.glob("*.bin")):
        p.unlink()
    rows: list[dict] = []
    flags: list[dict] = []
    entries: list[dict] = []
    heavy: list[dict] = []
    V: dict = {}

    def row(wid, name, val, ref, tol):
        v, r = np.asarray(val, dtype=float), np.asarray(ref, dtype=float)
        ok = bool(np.all(np.abs(v - r) <= np.asarray(tol)))
        rows.append({"id": wid, "name": name, "value": B1.r6(np.ravel(v)[:12]), "ref": B1.r6(np.ravel(r)[:12]), "tol": tol, "pass": ok})

    def truth(wid, name, cond, value=None):
        rows.append({"id": wid, "name": name, "value": value if value is not None else bool(cond), "ref": True, "tol": 0, "pass": bool(cond)})

    def flag(wid, scene, what, screen, exact, note):
        flags.append({"id": wid, "scene": scene, "what": what, "screen_or_voice": screen, "hand_check": exact, "note": note})

    def call(fn: str, scene: str, eq: str, heavy_call: bool = False, **params):
        mod, name = fn.rsplit(".", 1)
        out = getattr(importlib.import_module(mod), name)(**params)
        if heavy_call:
            try:
                oh = B1.parity_hash(out) if not hasattr(out, "_fields") else B1.parity_hash(str(out))
            except Exception:
                oh = B1.parity_hash(str(out))
            heavy.append({"fn": fn, "scene": scene, "eq": eq, "params": {k: (v if isinstance(v, (int, float, str, type(None), tuple, list))
                          else f"array {np.shape(v)}, sha256 {B1.parity_hash(v)}" if not callable(v) else "callable") for k, v in params.items()},
                          "output_sha256": oh})
            return out
        jp = {k: (np.asarray(v).tolist() if isinstance(v, np.ndarray) else v) for k, v in params.items()}
        try:
            h = B1.parity_hash(out)
        except Exception:
            h = None
        entries.append({"fn": fn, "scene": scene, "data": "data/mp.json", "eq": eq, "params": jp, "sha256": h})
        return out

    def recorded(fn, scene, eq, params, value):
        entries.append({"fn": fn, "scene": scene, "data": "data/mp.json", "eq": eq, "params": params, "sha256": None, "recorded": value})

    import fluidpy.geo.mapproj as MP
    from fluidpy.geo import sphere as SPH
    from fluidpy.geo.constants import EARTH_RADIUS
    row("DM00", "EARTH_RADIUS = 6371 km (the movie's a)", EARTH_RADIUS / 1e3, A_KM, 1e-9)

    # ================================================================ s02 recap (Parts 1, 3, 6)
    AL = call(GS + "arc_lengths", "s02/s06", "δy = a δφ, δx = a cos φ δλ (1°) at Brest", lat=BREST[0])
    dy1, dx1 = AL.dy / 1e3, AL.dx / 1e3
    row("DM01", "1° north = 111.2 km, 1° east at Brest = 73.8 km (arc_lengths)", [dy1, dx1], [111.2, 73.8], [0.05, 0.05])
    dgc = call(GS + "great_circle_distance", "s02/s12", "London–Los Angeles great circle", lat1=LON[0], lon1=LON[1], lat2=LAX[0], lon2=LAX[1]) / 1e3
    RH = call(GS + "rhumb_line", "s02/s12", "London–Los Angeles rhumb line (constant bearing)", heavy_call=True, lat1=LON[0], lon1=LON[1], lat2=LAX[0], lon2=LAX[1], n=121)
    rh_d, rh_b = float(RH.distance) / 1e3, float(RH.bearing)
    row("DM13", "rhumb 9732.8 km, 258.49°, × 1.1116 of the great circle 8755 km, +977.5 km", [rh_d, rh_b, rh_d / dgc, rh_d - dgc, dgc],
        [9732.8, 258.49, 1.1116, 977.5, 8755.3], [0.1, 0.01, 1e-4, 0.2, 0.5])
    row("DM13", "screen '≈ 8755 km', '+11 %'", [round(dgc), round(100 * (rh_d / dgc - 1))], [8755, 11], 0)
    gcp = call(GS + "great_circle_points", "s02/s12", "London–Los Angeles great-circle track", heavy_call=True, lat1=LON[0], lon1=LON[1], lat2=LAX[0], lon2=LAX[1], n=121)
    V["routes"] = {"gc": [B1.r6(np.ravel(gcp[0]), 3), B1.r6(np.ravel(gcp[1]), 3)], "rh": [B1.r6(RH.lat, 3), B1.r6(SPH.wrap_lon(np.asarray(RH.lon)), 3)],
                   "d_gc": dgc, "d_rh": rh_d, "brg": rh_b, "lon": list(LON), "lax": list(LAX)}

    # ================================================================ s04 plate carrée: x = a λ, y = a φ (DM16)
    xB, yB = call(GM + "forward", "s04", "plate carrée x = a λ, y = a φ at Brest", name="platecarree", lat=BREST[0], lon=BREST[1], a=A_KM * 1e3)
    xB, yB = float(xB) / 1e3, float(yB) / 1e3
    row("DM16", "Brest on the plate carrée: x = −499.3 km, y = 5380.7 km", [xB, yB], [-499.3, 5380.7], [0.05, 0.05])
    row("DM16", "screen: 48.39° = 0.8446 rad, −4.49° = −0.0784 rad; 6371 × −0.0784 ≈ −500; 6371 × 0.8446 ≈ 5381", [BREST[0] * D2R, BREST[1] * D2R, 6371 * -0.0784, 6371 * 0.8446],
        [0.8446, -0.0784, -499.5, 5380.9], [5e-5, 5e-5, 0.05, 0.05])
    row("DM16", "2πa = 40 030 km ('about forty thousand'); 30° of the equator = 3336 km", [2 * np.pi * A_KM, 2 * np.pi * A_KM / 12], [40030.2, 3335.8], [0.05, 0.05])
    BS = (48.4, -4.5)       # the spoken Brest (Part 3's 48.4 N, 4.5 W; coordinator 2026-11-05: 5382 / 6167 in every part)
    xS, yS = call(GM + "forward", "s04", "plate carrée at the spoken Brest (48.4 N, 4.5 W)", name="platecarree", lat=BS[0], lon=BS[1], a=A_KM * 1e3)
    xS, yS = float(xS) / 1e3, float(yS) / 1e3
    row("DM16", "audit G2: 48.4 × π/180 = 0.84474 ≈ 0.8447 rad, −4.5 × π/180 = −0.07854 ≈ −0.0785; 6371 × −0.0785 = −500.1 ≈ −500; 6371 × 0.8447 = 5381.6 ≈ 5382 (exact 5381.8, Part 3 s23)",
        [BS[0] * D2R, BS[1] * D2R, 6371 * -0.0785, 6371 * 0.8447, xS, yS], [0.8447, -0.0785, -500.1, 5381.6, -500.4, 5381.8], [5e-5, 5e-5, 0.05, 0.05, 0.05, 0.05])
    truth("DM16", "audit G2 roundings: 5381.6 and 5381.8 → 5382; −500.1 → −500", round(6371 * 0.8447) == 5382 and round(yS) == 5382 and round(6371 * -0.0785) == -500)
    V["pc"] = {"brest_km": [xB, yB], "brest_rad": [BREST[0] * D2R, BREST[1] * D2R], "eq_km": 2 * np.pi * A_KM, "tick_km": 2 * np.pi * A_KM / 12,
               "brest_s": list(BS), "brest_s_km": [xS, yS], "brest_s_rad": [BS[0] * D2R, BS[1] * D2R]}

    # ================================================================ s05 k = 1/cos φ (DM17) + Tissot (DC32b)
    lat3 = np.array([BREST[0], 60.0, LYB[0]])
    SFp = call(GM + "scale_factors", "s05", "plate carrée stretch along the parallel k = 1/cos φ", name="platecarree", lat=lat3, lon=0.0)
    kp = np.asarray(SFp.k)
    row("DM17", "plate carrée k = 1.5059 (Brest), 2.0000 (60° N), 4.8983 (Longyearbyen); h = 1", list(kp) + list(np.asarray(SFp.h)),
        [1.5059, 2.0, 4.8983, 1, 1, 1], [5e-5, 5e-5, 5e-5, 1e-6, 1e-6, 1e-6])
    acB = A_KM * np.cos(BREST[0] * D2R)
    row("DM17", "a cos φ at Brest = 4230 km; 2π × 4230 = 26 580 km; 2π a cos φ = 26 582; 40 030 / 26 580 = 1.506", [acB, 2 * np.pi * 4230, 2 * np.pi * acB, 40030 / 26580],
        [4230.7, 26577.9, 26582.3, 1.506], [0.1, 0.1, 0.1, 5e-4])
    row("DM17", "screen cos: 0.664, 0.5, 0.204 → 1/0.664 ≈ 1.5, 1/0.5 = 2, 1/0.204 ≈ 4.9", [np.cos(BREST[0] * D2R), np.cos(LYB[0] * D2R), 1 / 0.664, 1 / 0.204],
        [0.664, 0.204, 1.506, 4.902], [5e-4, 5e-4, 5e-4, 5e-3])
    TC = [(0.0, 0.0), BREST, (60.0, 0.0), LYB, (60.0, 30.0), (30.0, 60.0), (30.0, -60.0), (0.0, -120.0), (0.0, 120.0), (-30.0, 20.0), (-60.0, -60.0), (60.0, -100.0)]
    rings_ll = []
    brg = np.linspace(0.0, 360.0, 49)
    for la0, lo0 in TC:
        la_, lo_ = SPH.destination_point(np.full_like(brg, la0), np.full_like(brg, lo0), brg, 500e3)
        lo_ = lo0 + (np.mod(np.asarray(lo_) - lo0 + 180.0, 360.0) - 180.0)
        rings_ll.append([B1.r6(la_, 4), B1.r6(lo_, 4)])
    recorded(GS + "destination_point", "s00/s03/s05/s07", "Tissot circles: 500 km on the real sphere (a = EARTH_RADIUS)", {"centres": [list(c) for c in TC], "r_m": 500e3, "n": 49},
             f"{len(TC)} rings × 49 points")
    tis = {}
    for key, nm in (("pc", "platecarree"), ("mc", "mercator"), ("ee", "equalearth")):
        T = call(GM + "tissot_ellipses", "s05/s07/s14", f"Tissot circles 500 km ({nm}), a = EARTH_RADIUS", heavy_call=True, name=nm, centres=np.array(TC), radius_km=500.0, n=49)
        xy = B1.tissot_xy(T)
        tis[key] = {"xy3": [L[:6] for L in xy], "w": [float(t.width_ratio) for t in T], "h": [float(t.height_ratio) for t in T]}
        for nm_, v_, r_, t_ in B1.tissot_check(nm, {}, TC, xy):
            row("DC32b", f"Tissot {nm_}", v_, r_, t_)
        # the JS mirror projects the lat/lon rings; the first three points of each ring are stored to check it
        rr = np.asarray(xy[1]).reshape(-1, 2)
        pr = np.stack(MP.forward(nm, np.asarray(rings_ll[1][0]), np.asarray(rings_ll[1][1]), a=1.0), -1)
        row("DC32b", f"Tissot ring at Brest ({nm}): destination_point ring projected = tissot_ellipses outline", float(np.max(np.abs(pr - rr))), 0.0, 1e-4)
    for key, i, lat in (("pc", 1, BREST[0]), ("pc", 3, LYB[0]), ("mc", 2, 60.0), ("mc", 3, LYB[0]), ("ee", 4, 60.0)):
        truth("DC32b", f"Tissot callout ellipse {key} #{i} lies north of the equator (centre {lat})", min(np.asarray(rings_ll[i][0])) > 0)
    row("DM17", "Brest Tissot oval on the plate carrée: width/height ratio ≈ 1.5 (width 1.5×, height 1×)", [tis["pc"]["w"][1] / tis["pc"]["h"][1], tis["pc"]["h"][1]], [1.506, 1.0], [0.02, 0.01])
    V["tissot"] = {"centres": [list(c) for c in TC], "ll": rings_ll, **tis}
    V["k"] = {"lat": list(lat3), "k": list(kp), "cos": [float(np.cos(l * D2R)) for l in lat3], "acB": acB}

    # ================================================================ s06 the slope on a grid (DM05)
    slope = 1.0 / dx1 * 100.0
    row("DM05", "1 °C over 73.84 km = 1.354 °C per 100 km ('about 1.4'); over 111.2 km it would be 0.899", [slope, 100 / dy1], [1.354, 0.899], [5e-4, 5e-4])
    # the same number from fluidpy.geo.sphere.gradient on a field that rises 1 K per degree of longitude
    glat, glon = np.arange(44.0, 53.0, 1.0), np.arange(-10.0, 1.0, 1.0)
    Tf = np.tile(glon[None, :], (glat.size, 1))
    G = call(GS + "gradient", "s06", "∇T on the sphere (Vallis (2.31)), T rising 1 K per degree east", heavy_call=True, F=Tf, lat=glat, lon=glon)
    gB = float(B1.bilin(np.asarray(G.dFdx), glat, glon, BREST[0], BREST[1])) * 1e5
    row("DM05", "sphere.gradient: ∂T/∂x at Brest = 1/(a cos φ) ∂T/∂λ = 1.354 K per 100 km", gB, 1.354, 2e-3)
    V["slope"] = {"dx": dx1, "dy": dy1, "slope": slope}

    # ================================================================ s07 / s08 Mercator stretch (DM18, DM19)
    SFm = call(GM + "scale_factors", "s07/s08", "Mercator h = k = 1/cos φ, ω = 0", name="mercator", lat=lat3, lon=0.0)
    row("DM18", "Mercator h = k = 1.506, 2.000, 4.898; ω = 0", list(np.asarray(SFm.h)) + list(np.asarray(SFm.k)) + list(np.asarray(SFm.omega)),
        [1.5059, 2.0, 4.8983, 1.5059, 2.0, 4.8983, 0, 0, 0], [5e-5] * 6 + [1e-5] * 3)
    d167, d222 = dy1 * float(np.asarray(SFm.h)[0]), dy1 * float(np.asarray(SFm.h)[1])
    row("DM19", "1° north drawn 167.45 km at Brest, 222.39 km at 60° N", [d167, d222], [167.45, 222.39], [0.01, 0.01])
    row("DM19", "screen 111.2 × 2 = 222.4", 111.2 * 2, 222.4, 1e-9)
    flag("F1", "s08_mercator_dy", "Brest drawn step", "'a hundred and eleven point two times one point five zero six … about a hundred and sixty seven point four'",
         f"111.2 × 1.506 = {111.2 * 1.506:.2f} (rounds to 167.5); the exact 111.19 × 1.5059 = {d167:.2f}",
         "voice kept ('167.4' = the exact 167.45 to 1 dp); the SCREEN writes the unrounded factors '111.19 × 1.5059 ≈ 167.4' so its arithmetic checks by hand (director: optional re-voice)")
    V["merc"] = {"h": list(np.asarray(SFm.h)), "d": [d167, d222]}

    # ================================================================ s09 the add-up table (DM20)
    st = 10.0 * D2R
    mids = np.arange(5.0, 90.0, 10.0)
    steps = st / np.cos(mids * D2R)
    tot = np.cumsum(steps)
    psi = call(GS + "isometric_latitude", "s09-s11", "ψ = ln tan(π/4 + φ/2) = Mercator y / a", lat=np.arange(10.0, 90.0, 10.0))
    row("DM20", "midpoint totals 0.1752 0.3559 0.5485 0.7615 1.0084 1.3126 1.7256 2.4000", tot[:8], [0.1752, 0.3559, 0.5485, 0.7615, 1.0084, 1.3126, 1.7256, 2.4000], 5e-5)
    row("DM20", "steps 0.1752 0.1807 0.1926; 1/cos 5° 15° 25° = 1.004 1.035 1.103; 80-90 step = 2.0025", [steps[0], steps[1], steps[2], 1 / np.cos(5 * D2R), 1 / np.cos(15 * D2R),
        1 / np.cos(25 * D2R), steps[8]], [0.1752, 0.1807, 0.1926, 1.004, 1.035, 1.103, 2.0025], [5e-5, 5e-5, 5e-5, 5e-4, 5e-4, 5e-4, 5e-4])
    row("DM20", "screen: 10° = 0.1745 rad; 0.1745 × 1.004 ≈ 0.175 ≈ 1116 km; 0.356; 0.549 (= 0.356 + 0.193)", [st, 0.1745 * 1.004, steps[0] * A_KM, 0.175 + 0.181, 0.356 + 0.193],
        [0.1745, 0.1752, 1116.2, 0.356, 0.549], [5e-5, 5e-4, 0.1, 1e-9, 1e-9])
    truth("DM20", "each 10° midpoint total lies below ln tan by 0.1-1.6 % up to 80°", bool(np.all((tot[:8] < np.asarray(psi)) & (np.asarray(psi) - tot[:8] < 0.016 * np.asarray(psi)))),
          B1.r6(100 * (np.asarray(psi) - tot[:8]) / np.asarray(psi), 2))
    st3 = [round(float(x), 3) for x in steps[:8]]
    run3 = list(np.round(np.cumsum(st3), 3))
    row("DM20", "audit G1 table rows 30-80°: 1/cos 35° 45° 55° 65° 75° = 1.221 1.414 1.743 2.366 3.864; drawn 0.213 0.247 0.304 0.413 0.674",
        [*(1 / np.cos(mids[3:8] * D2R)), *steps[3:8]], [1.221, 1.414, 1.743, 2.366, 3.864, 0.2131, 0.2468, 0.3043, 0.4130, 0.6743], [5e-4] * 5 + [5e-5] * 5)
    row("DM20", "audit G1: 0.1745 × the shown 1/cos = the shown drawn step (to 3 dp): 0.213, 0.247, 0.304, 0.413, 0.674",
        [round(0.1745 * c, 3) for c in (1.221, 1.414, 1.743, 2.366, 3.864)], [0.213, 0.247, 0.304, 0.413, 0.674], 1e-9)
    row("DM20", "audit G1: the shown running totals = sums of the shown steps: 0.175 0.356 0.549 0.762 1.009 1.313 1.726 2.400 (exact 1.0084 → said 'one point zero one')",
        run3, [0.175, 0.356, 0.549, 0.762, 1.009, 1.313, 1.726, 2.400], 1e-9)
    row("DM20", "audit G1: each shown total within 0.001 of the exact running total", np.abs(np.asarray(run3) - tot[:8]), [0] * 8, 1.1e-3)
    V["ladder"] = {"mid": list(mids), "sec": list(1 / np.cos(mids * D2R)), "step": list(steps), "tot": list(tot), "psi": list(np.asarray(psi))}

    # ================================================================ s10 ln tan (DM21)
    MPY = call(GM + "forward", "s10", "Mercator y = a ln tan(π/4 + φ/2) at 60° and Brest (a = 1)", name="mercator", lat=[60.0, BREST[0]], lon=0.0, a=1.0)
    y60, yB = float(np.asarray(MPY[1])[0]), float(np.asarray(MPY[1])[1])
    s1 = float(np.sum((1.0 * D2R) / np.cos(np.arange(0.5, 60.0, 1.0) * D2R)))
    row("DM21", "ln tan 75° = 1.31696; 1° midpoint sum = 1.31691; Brest 0.96768 a = 6165.1 km", [y60, s1, yB, yB * A_KM], [1.31696, 1.31691, 0.96768, 6165.1], [5e-6, 5e-6, 5e-6, 0.1])
    row("DM21", "screen: e = 2.718; tan 75° = 3.732; ln 3.732 = 1.317; 45 + 24.2 = 69.2; tan 69.2° = 2.632; ln 2.632 = 0.968",
        [np.e, np.tan(75 * D2R), np.log(3.732), 45 + BREST[0] / 2, np.tan((45 + BREST[0] / 2) * D2R), np.log(2.632)], [2.718, 3.732, 1.317, 69.2, 2.632, 0.968],
        [5e-4, 5e-4, 5e-4, 0.01, 5e-4, 5e-4])
    MPS = call(GM + "forward", "s10", "Mercator y at the spoken Brest 48.4 N (a = 1)", name="mercator", lat=48.4, lon=0.0, a=1.0)
    yBs = float(np.asarray(MPS[1]))
    row("DM21", "audit G3: tan 69.2° = 2.6325; ln 2.6325 = 0.96794 ≈ 0.968; 0.968 × 6371 = 6167.1 ≈ 6167 (exact 0.96794 × 6371 = 6166.8; coordinator 6167)",
        [np.tan(69.2 * D2R), np.log(2.6325), yBs, 0.968 * 6371, yBs * A_KM], [2.6325, 0.96794, 0.96794, 6167.1, 6166.8], [5e-5, 5e-5, 5e-5, 0.05, 0.05])
    truth("DM21", "audit G3 roundings: 6167.1 and 6166.8 → 6167; ln 2.6325 → 0.968", round(0.968 * 6371) == 6167 and round(yBs * A_KM) == 6167 and round(np.log(2.6325), 3) == 0.968)
    V["ln"] = {"y60": y60, "s1": s1, "s10": float(tot[5]), "yB": yB, "yB_km": yB * A_KM, "tan75": float(np.tan(75 * D2R)), "tanB": float(np.tan((45 + BREST[0] / 2) * D2R)),
               "yB_s": yBs, "yB_s_km": yBs * A_KM, "tanB_s": float(np.tan(69.2 * D2R))}

    # ================================================================ s11 slope check (DM22)
    y61, y59, y85 = (float(MP.forward("mercator", la_, 0.0, a=1.0)[1]) for la_ in (61.0, 59.0, 85.0))
    recorded(GM + "forward", "s11", "Mercator y/a at 61°, 59°, 85°", {"name": "mercator", "lat": [61, 59, 85], "a": 1.0}, B1.r6([y61, y59, y85], 6))
    slope60 = (y61 - y59) / (2 * D2R)
    row("DM22", "y(61°) = 1.3524, y(59°) = 1.2826, slope (centred) = 2.0007, 1/cos 60° = 2; y(85°) = 3.1313 a = 19 949.5 km", [y61, y59, slope60, 1 / np.cos(60 * D2R), y85, y85 * A_KM],
        [1.3524, 1.2826, 2.0007, 2.0, 3.1313, 19949.5], [5e-5, 5e-5, 5e-4, 1e-12, 5e-5, 0.3])
    row("DM22", "screen: 1.3524 − 1.2826 = 0.0698; 2° = 0.0349 rad; 0.0698 / 0.0349 = 2.00", [1.3524 - 1.2826, 2 * D2R, 0.0698 / 0.0349], [0.0698, 0.0349, 2.0], [1e-9, 5e-5, 5e-3])
    V["slope60"] = {"y61": y61, "y59": y59, "slope": slope60, "y85": y85, "y85_km": y85 * A_KM}

    # ================================================================ s12 rhumb straight on Mercator (DM23)
    SF45 = call(GM + "scale_factors", "s12", "Mercator stretch at the two legs (40°, 50° N)", name="mercator", lat=[40.0, 50.0], lon=0.0)
    xr_, yr_ = MP.forward("mercator", np.asarray(RH.lat), SPH.wrap_lon(np.asarray(RH.lon)), a=1.0)
    resid = float(np.max(np.abs(np.polyval(np.polyfit(xr_, yr_, 1), xr_) - yr_)))
    row("DM23", "tan(258.49° − 180°) = 4.91 west per 1 south; stretch 1/cos 40° = 1.31, 1/cos 50° = 1.56; rhumb residual from a straight line on Mercator",
        [np.tan((rh_b - 180) * D2R), np.asarray(SF45.k)[0], np.asarray(SF45.k)[1], resid], [4.91, 1.305, 1.556, 0.0], [0.01, 5e-4, 5e-4, 1e-9])
    yL_, yA_ = np.log(np.tan((45 + LON[0] / 2) * D2R)), np.log(np.tan((45 + LAX[0] / 2) * D2R))
    row("DM22", "audit G4 (cross-check of Part 6): y/a London 1.0523, LA 0.6327; Δy/a −0.4196; Δx/a = −118.11° = −2.0614; 2.0614 / 0.4196 = 4.913 ≈ 4.9 → 78.49° → 258.5°",
        [yL_, yA_, yA_ - yL_, (LAX[1] - LON[1]) * D2R, 2.0614 / 0.4196, np.degrees(np.arctan(2.0614 / 0.4196)) + 180, rh_b],
        [1.0523, 0.6327, -0.4196, -2.0614, 4.913, 258.49, 258.49], [5e-5, 5e-5, 5e-5, 5e-5, 5e-4, 0.005, 0.005])
    V["rh"] = {"slant": float(np.tan((rh_b - 180) * D2R)), "k40": float(np.asarray(SF45.k)[0]), "k50": float(np.asarray(SF45.k)[1])}

    # ================================================================ s13 areas (DM24, DC34)
    SFa = call(GM + "scale_factors", "s13", "Mercator areal scale 1/cos² φ at 60° N and Longyearbyen", name="mercator", lat=[60.0, LYB[0]], lon=0.0)
    row("DM24", "Mercator areal 4.000 (60° N), 23.99 (Longyearbyen); screen 4.9 × 4.9 = 24.01 ≈ 24; 200 × 200 = 40 000", [np.asarray(SFa.areal)[0], np.asarray(SFa.areal)[1], 4.9 * 4.9, 200 * 200 / (100 * 100)],
        [4.0, 23.99, 24.01, 4.0], [1e-5, 0.01, 1e-9, 0])

    def area_of(parts):
        tot_ = 0.0
        for p in parts:
            sx = np.sum(p[:-1, 0] * p[1:, 1] - p[1:, 0] * p[:-1, 1])     # shapefile outer rings are clockwise (< 0)
            ar = abs(SPH.polygon_area(p[:, 1], p[:, 0]))
            tot_ += ar if sx < 0 else -ar
        return tot_
    gparts = [p for _, ps in B1.shp_parts(B1.F_NE10A, lambda r: r.get("ADMIN") == "Greenland") for p in ps]
    aparts = [p for _, ps in B1.shp_parts(B1.F_NE10A, lambda r: r.get("CONTINENT") == "Africa") for p in ps]
    Agl, Aaf = area_of(gparts) / 1e12, area_of(aparts) / 1e12
    recorded(GS + "polygon_area", "s13", "Greenland, Africa (NE 10 m admin-0)", {"source": "ne_10m_admin_0_countries"}, B1.r6([Agl, Aaf], 4))
    # the voice and screen give the cited areas (Greenland 2 166 086 km², Statistics Greenland; Africa 30.37 million km²); polygon_area on the
    # Natural Earth 10 m outlines on a sphere gives 2.14 and 30.0 (1.3 % lower: sphere, generalised coast); the ratio is the same 14.0
    row("DC34", "Greenland, Africa areas (polygon_area, NE 10 m) within 2 % of the cited 2.17 and 30.4 million km²; 30.4 / 2.17 = 14.0; our ratio 14.0",
        [Agl / 2.166, Aaf / 30.37, 30.4 / 2.17, Aaf / Agl], [1.0, 1.0, 14.0, 14.0], [0.02, 0.02, 0.05, 0.5])
    flag("F4", "s13_area_stretch", "Greenland and Africa areas", "'two point one seven million … thirty point four million' (cited survey areas)",
         f"polygon_area on NE 10 m outlines (sphere): {Agl:.3f} and {Aaf:.2f} million km², ratio {Aaf / Agl:.2f}",
         "screen shows the cited 2.17 / 30.4 (as voiced); the computed ratio 14.0 is the same; the manifest records both")

    def merc_area(parts):
        t_ = 0.0
        for p in parts:
            x, y = MP.forward("mercator", np.clip(p[:, 1], -85, 85), p[:, 0], a=1.0)
            t_ += -0.5 * np.sum(x[:-1] * y[1:] - x[1:] * y[:-1])
        return t_
    rng_m = merc_area(gparts) / merc_area(aparts)
    row("DC34", "on the Mercator map Greenland's drawn area / Africa's in 0.8-1.25 ('about as big')", rng_m, 1.0, 0.25)

    def outline_ll(parts, keep_n, d=0.25):
        big = sorted(parts, key=lambda p: -len(p))[:keep_n]
        out = []
        for p in big:
            q = B1.decimate(p, d)
            if len(q) >= 4:
                out.append(np.round(q[:, ::-1], 3).ravel().tolist())     # flat [lat, lon, lat, lon, …]
        return out

    def outline_laea(parts, keep_n, lat0, lon0, d=0.25):
        big = sorted(parts, key=lambda p: -len(p))[:keep_n]
        out = []
        for p in big:
            q = B1.decimate(p, d)
            if len(q) >= 4:
                x, y = MP.forward("laea", q[:, 1], q[:, 0], a=1.0, lat_0=lat0, lon_0=lon0)
                out.append(np.round(np.stack([x, y], -1), 5).ravel().tolist())
        return out
    V["areas"] = {"gl_Mkm2": Agl, "af_Mkm2": Aaf, "areal": list(np.asarray(SFa.areal)), "gl": outline_ll(gparts, 1, 0.3), "af": outline_ll(aparts, 8, 0.3),
                  "gl_true": outline_laea(gparts, 1, 72.0, -40.0), "af_true": outline_laea(aparts, 8, 2.0, 18.0)}
    recorded(GM + "forward", "s13", "true-size outlines (laea about each centre; equal-area)", {"name": "laea", "centres": [[72, -40], [2, 18]], "a": 1.0}, "outlines")

    # ================================================================ s14 Equal Earth (DC35)
    rs2 = np.random.default_rng(3)
    rl, ro = rs2.uniform(-80, 80, 400), rs2.uniform(-180, 180, 400)
    eea = MP.scale_factors("equalearth", rl, ro)
    row("DC35", "Equal Earth areal = 1 at 400 random points", float(np.max(np.abs(np.asarray(eea.areal) - 1))), 0.0, 1e-9)
    om = call(GM + "scale_factors", "s14", "Equal Earth ω at 60° N 30° E", name="equalearth", lat=60.0, lon=30.0)
    row("DC35", "Equal Earth ω(60° N, 30° E) = 31.4° ('about thirty one')", float(om.omega), 31.4, 0.05)
    V["ee"] = {"omega60_30": float(om.omega), "A": list(MP.equal_earth_coefficients())}

    # ================================================================ s16 polar stereographic rings (DM27)
    rr = {}
    for la_ in (75, 60, 45, 30, PS_EDGE):
        x_, y_ = MP.forward("polar_stereographic", float(la_), 0.0, a=A_KM, **PSK)
        rr[str(int(la_))] = float(np.hypot(x_, y_))
    recorded(GM + "forward", "s16", "polar stereographic ring radii (lat_ts 60)", {"name": "polar_stereographic", "lat": [75, 60, 45, 30, 20], "lon": 0, **PSK, "a_km": A_KM}, B1.r6(list(rr.values()), 2))
    row("DM27", "ring radii 1565, 3186, 4924, 6864 km (75, 60, 45, 30° N)", [rr["75"], rr["60"], rr["45"], rr["30"]], [1565, 3186, 4924, 6864], 1.0)
    sfp = call(GM + "scale_factors", "s16", "polar stereographic k: 1 at 60° N", name="polar_stereographic", lat=[60.0, BREST[0], 30.0], lon=0.0, **PSK)
    row("DM27", "polar stereographic k = 1.000 at 60° N (true to scale there), 1.068 at Brest, 1.244 at 30° N", list(np.asarray(sfp.k)), [1.0, 1.068, 1.244], 2e-3)
    xs_, ys_ = MP.forward("polar_stereographic", [0.0, 0.0, 0.0, 0.0], [0.0, 90.0, 180.0, -90.0], a=1.0, **PSK)
    truth("DM27", "lon 0 at the bottom (y < 0), 90 E right (x > 0), 180 top (y > 0), 90 W left (x < 0)", bool(ys_[0] < 0 and xs_[1] > 0 and ys_[2] > 0 and xs_[3] < 0),
          B1.r6([xs_[0], ys_[0], xs_[1], ys_[1], xs_[2], ys_[2], xs_[3], ys_[3]], 4))
    V["ps"] = {"rings_km": rr, "k0": (1 + np.sin(60 * D2R)) / 2, "edge": PS_EDGE}

    # ================================================================ s17 the place tour (DM28)
    land = [p for _, ps in B1.shp_parts(B1.F_NE50L) for p in ps]
    from matplotlib.path import Path as MPath
    lpaths = [MPath(p) for p in land if p[:, 1].max() > 25]
    pl = {}
    for key, (nm, la_, lo_, kind) in PLACES.items():
        on = any(pp.contains_point((lo_, la_)) for pp in lpaths)
        truth("DM28", f"{nm} ({la_}, {lo_}) is on {kind} (NE 50 m land)", on == (kind == "land"))
        x_, y_ = MP.forward("polar_stereographic", la_, lo_, a=1.0, **PSK)
        pl[key] = {"name": nm, "ll": [la_, lo_], "xy": [float(x_), float(y_)], "kind": kind}
    q = {k: v["xy"] for k, v in pl.items()}
    truth("DM28", "screen quadrants: Brest bottom, left of the 0 spoke; Iceland left of 0; Greenland left of Iceland; Scandinavia right of 0; Siberia right; "
          "Bering top; Alaska left of the 180 spoke; Hudson Bay and Canada left; Los Angeles upper left, just INSIDE the 30° ring (34° N is poleward of 30° N)",
          bool(q["brest"][1] < 0 and q["brest"][0] < 0 and q["iceland"][0] < 0 and q["greenland"][0] < q["iceland"][0] and q["scandinavia"][0] > 0 and q["siberia"][0] > 0
               and q["bering"][1] > 0 and q["alaska"][0] < 0 and q["alaska"][1] > 0 and q["hudson"][0] < 0 and q["canada"][0] < 0 and q["la"][0] < 0 and q["la"][1] > 0
               and rr["45"] / A_KM < np.hypot(*q["la"]) < rr["30"] / A_KM))
    V["places"] = pl
    # outlines on the polar map: Greenland (s17 brightens) and the coast lines
    V["gl_ps"] = outline_ll(gparts, 1, 0.3)

    # ================================================================ coasts (lat/lon; the JS mirrors project them) and the JS-mirror check
    ne110 = json.loads(B1.F_NE110.read_text(encoding="utf-8"))["coastline"]
    coast = []
    for ln in ne110:
        qq = B1.decimate(np.asarray(ln, float).reshape(-1, 2), 0.6)
        if len(qq) >= 2:
            coast.append(np.round(qq[:, ::-1], 2).ravel().tolist())      # flat [lat, lon, …]
    V["coast"] = coast
    rs3 = np.random.default_rng(11)
    jl, jo = np.round(rs3.uniform(-80, 80, 16), 6), np.round(rs3.uniform(-179, 179, 16), 6)     # rounded first: the JS sees the same inputs
    jl_ps = np.round(rs3.uniform(PS_EDGE, 89, 16), 6)
    jc = {}
    for nm in ("platecarree", "mercator", "equalearth", "gores"):
        x_, y_ = MP.forward(nm, jl, jo, a=1.0)
        jc[nm] = {"lat": B1.r6(jl, 6), "lon": B1.r6(jo, 6), "x": B1.r6(x_, 9), "y": B1.r6(y_, 9)}
    x_, y_ = MP.forward("polar_stereographic", jl_ps, jo, a=1.0, **PSK)
    jc["polar_stereographic"] = {"lat": B1.r6(jl_ps, 6), "lon": B1.r6(jo, 6), "x": B1.r6(x_, 9), "y": B1.r6(y_, 9)}
    recorded(GM + "forward", "all", "JS-mirror check points (16 per projection, a = 1)", {"names": list(jc), "seed": 11}, "jscheck")
    V["jscheck"] = jc

    # ================================================================ rasters: Blue Marble reprojected (inverse maps, forward round trip DC31b)
    bm = np.asarray(Image.open(B1.F_BMNG).convert("RGB"))
    A1, A2, A3, A4 = MP.equal_earth_coefficients()
    k0 = (1 + np.sin(60 * D2R)) / 2

    def raster(nm, w, h, xr__, yr__, inv, path, kw, mode="RGB", src=bm):
        X, Y = np.meshgrid(np.linspace(xr__[0], xr__[1], w), np.linspace(yr__[1], yr__[0], h))
        la, lo, ok = inv(X, Y)
        rgb = B1.sample_equirect(src, np.where(ok, la, 0), np.where(ok, lo, 0))
        if mode == "RGBA":
            alpha = np.where(ok, 255, 0).astype(np.uint8)[..., None]
            Image.fromarray(np.concatenate([rgb, alpha], -1), "RGBA").save(path, optimize=True)
        else:
            Image.fromarray(rgb, "RGB").save(path, quality=86)
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
            f_ = A1 * th + A2 * th ** 3 + A3 * th ** 7 + A4 * th ** 9 - Y
            fp = A1 + 3 * A2 * th ** 2 + 7 * A3 * th ** 6 + 9 * A4 * th ** 8
            th = np.clip(th - f_ / fp, -1.25, 1.25)
        M = np.sqrt(3) / 2
        s = np.clip(np.sin(th) / M, -1, 1)
        lam = X * 3 * (9 * A4 * th ** 8 + 7 * A3 * th ** 6 + 3 * A2 * th ** 2 + A1) / (2 * np.sqrt(3) * np.cos(th))
        ok = (np.abs(lam) <= np.pi) & (np.abs(np.sin(th)) <= M + 1e-12)
        return np.degrees(np.arcsin(s)), np.degrees(lam), ok

    def inv_ps(X, Y):
        rho = np.hypot(X, Y)
        return np.degrees(np.pi / 2 - 2 * np.arctan(rho / (2 * k0))), np.degrees(np.arctan2(X, -Y)), rho <= 2 * k0 * np.tan((90 - PS_EDGE + 2) / 2 * D2R)
    xee = float(MP.forward("equalearth", 0.0, 180.0 - 1e-9, a=1.0)[0])
    yee = float(MP.forward("equalearth", 90.0, 0.0, a=1.0)[1])
    rps = float(2 * k0 * np.tan((90 - PS_EDGE) / 2 * D2R))
    errs = {"pc": raster("platecarree", 2048, 1024, (-np.pi, np.pi), (-np.pi / 2, np.pi / 2), inv_pc, IMG / "bm_pc.jpg", {}),
            "mc": raster("mercator", 2048, 2048, (-np.pi, np.pi), (-np.pi, np.pi), inv_mc, IMG / "bm_mc.jpg", {}),
            "ee": raster("equalearth", 1600, round(1600 * yee / xee), (-xee, xee), (-yee, yee), inv_ee, IMG / "bm_ee.png", {}, "RGBA"),
            "ps": raster("polar_stereographic", 1100, 1100, (-rps, rps), (-rps, rps), inv_ps, IMG / "bm_ps.jpg", PSK)}
    for kx, e in errs.items():
        row("DC31b", f"raster inverse round trip via mapproj.forward ({kx})", e, 0.0, 1e-9)
    V["ext"] = {"pc": [np.pi, np.pi / 2], "mc": [np.pi, np.pi], "ee": [xee, yee], "ps": [rps, rps]}
    # a Blue Marble crop round Brest for the s06 grid (equirectangular, 12° × 7°)
    cb = (44.5, 51.5, -11.0, 1.0)
    H_, W_ = bm.shape[:2]
    r0, r1 = int((90 - cb[1]) / 180 * H_), int((90 - cb[0]) / 180 * H_)
    c0, c1 = int((cb[2] + 180) / 360 * W_), int((cb[3] + 180) / 360 * W_)
    Image.fromarray(bm[r0:r1, c0:c1]).resize(((c1 - c0) * 4, (r1 - r0) * 4), Image.BICUBIC).save(IMG / "brest_crop.jpg", quality=88)
    V["brest_crop"] = {"box": [90 - r1 / H_ * 180, 90 - r0 / H_ * 180, c0 / W_ * 360 - 180, c1 / W_ * 360 - 180]}
    coast10 = [p for _, ps in B1.shp_parts(B1.F_NE10C) for p in ps]
    V["brest_coast"] = B1.box_lines(coast10, (43.5, 52.5, -12.0, 2.0), nd=3, step=1)

    # ================================================================ ERA5 Sep 2026 anomaly on Mercator and Equal Earth (s14)
    T2 = xr.open_dataset(B1.F_T2M)
    tl, tlo = T2.lat.values.astype(float), T2.lon.values.astype(float)
    TA = T2.t2m_anom.values.astype(float)
    gmean = float(call("fluidpy.diag.climatology.global_mean", "s14", "cos-latitude weighted mean anomaly (manifest only)", heavy_call=True, field=TA, lat=tl))
    row("DM40", "global-mean anomaly Sep 2026 +0.823 K (manifest; not spoken)", gmean, 0.823, 0.005)
    lutb = B1.lut_rgb("cmocean.balance")
    for key, inv, (xr__, yr__), (w, h) in (("mc", inv_mc, ((-np.pi, np.pi), (-np.pi, np.pi)), (1024, 1024)),
                                         ("ee", inv_ee, ((-xee, xee), (-yee, yee)), (1200, round(1200 * yee / xee)))):
        X, Y = np.meshgrid(np.linspace(xr__[0], xr__[1], w), np.linspace(yr__[1], yr__[0], h))
        la, lo, ok = inv(X, Y)
        if key == "mc":
            ok = ok & (np.abs(la) <= 85)
        vals = B1.bilin(np.concatenate([TA, TA[:, :1]], 1), tl, np.r_[tlo, tlo[0] + 360], np.where(ok, la, 0), np.where(ok, np.where(lo < tlo[0], lo + 360, lo), 0))
        vals[~ok] = np.nan
        B1.rgba_png(vals, lutb, -6, 6, IMG / f"t2m_{key}.png", alpha=1.0)
    V["t2m"] = {"range": [-6, 6], "gmean": gmean, "lut": B1.lut_hex("cmocean.balance")}

    # ================================================================ the 10 hPa polar vortex, 21 Jan 2026 (s18-s21; DC36, DC37)
    N = xr.open_dataset(B1.F_NCEP)
    nk = int(np.where(N.time.values.astype("datetime64[D]") == np.datetime64("2026-01-21"))[0][0])
    nlat, nlon = N.lat.values.astype(float), N.lon.values.astype(float)
    z = N.z.values[nk].astype(float)
    un, vn = N.u.values[nk].astype(float), N.v.values[nk].astype(float)
    vc = call(DC + "storm_centre", "s18/s21", "vortex centre = minimum of the 10 hPa height", heavy_call=True, msl=z, lat=nlat, lon=nlon, box=(50.0, 89.0, 0.0, 359.99))
    vlat, vlon = float(vc.lat), float(((float(vc.lon) + 180) % 360) - 180)
    row("DC36", "vortex centre 72.89 N 44.26 E, 28 602 m ('28.6 km'; '73° N, 44° E'; '72.9, 44.3')", [vlat, vlon, float(vc.msl_min)], [72.89, 44.26, 28602], [0.02, 0.02, 2])
    zm = z.mean(axis=1)
    z30 = float(zm[list(nlat).index(30.0)])
    row("DC36", "zonal-mean height along 30 N = 30 721 m ('thirty point seven')", z30, 30721, 2)
    spd = np.hypot(un, vn)
    jm, im = np.unravel_index(np.nanargmax(spd), spd.shape)
    vmax = float(spd[jm, im])
    row("DC36", "fastest wind 79.0 m/s at 60 N 90 E; × 3.6 = 284.4 km/h", [vmax, nlat[jm], nlon[im], vmax * 3.6], [79.0, 60.0, 90.0, 284.4], [0.05, 0, 0, 0.2])
    row("DC36", "screen and voice (fixed 2026-11-05, was 285): 79 m/s × 3.6 ≈ 284 km/h; the exact 78.95 × 3.6 = 284.2", [round(79 * 3.6), round(vmax * 3.6)], [284, 284], 0)
    row("DC36", "zonal-mean u at 60 N = 42.1 m/s; zonal-mean u > 0 at 50-80 N", [float(N.u60.values[nk]), float(np.min(un[(nlat >= 50) & (nlat <= 80)].mean(axis=1)))], [42.1, 10.0], [0.05, 10.0])
    onl = any(pp.contains_point((vlon, vlat)) for pp in lpaths)
    truth("DC36", "the vortex centre is over the sea (the Barents Sea; NE 50 m land)", not onl)
    dpole = float(call(GS + "great_circle_distance", "s21", "vortex centre to the pole", lat1=vlat, lon1=vlon, lat2=90.0, lon2=0.0)) / 1e3
    row("DC37", "centre to pole 1902 km ('about one thousand nine hundred')", dpole, 1902, 3)
    row("DC37", "audit G5: (90 − 72.9) × 111.2 = 1901.5 ≈ 1900 km; 33 / 17.5 = 1.89 ≈ 1.9; 20 / 47 = 0.43 ≈ 0.4; 'typically' = root-mean-square",
        [(90 - 72.9) * 111.2, 33 / 17.5, 20 / 47], [1901.5, 1.886, 0.4255], [0.05, 5e-4, 5e-4])
    row("DC37", "audit G7: 10 hPa / 1013 hPa = 0.0099 ≈ 0.01; y(85°) = 3.1313 a; 3.131 × 6371 = 19 948 ≈ 19 950", [10 / 1013, np.log(np.tan(87.5 * D2R)), 3.131 * 6371], [0.0099, 3.1313, 19947.6], [5e-5, 5e-5, 0.5])
    ringP = call(DC + "storm_relative_wind", "s21", "ring 2000 km about the pole", heavy_call=True, u=un, v=vn, lat=nlat, lon=nlon, centre=(89.999, 0.0), radii_km=[2000.0], n_az=72)
    ringC = call(DC + "storm_relative_wind", "s21", "ring 2000 km about the vortex centre", heavy_call=True, u=un, v=vn, lat=nlat, lon=nlon, centre=(vlat, vlon), radii_km=[2000.0], n_az=72)
    rmsP, rmsC = float(np.sqrt(np.nanmean(ringP.radial[0] ** 2))), float(np.sqrt(np.nanmean(ringC.radial[0] ** 2)))
    vtP, vtC = float(ringP.tangential_mean[0]), float(ringC.tangential_mean[0])
    row("DC37", "ring 2000 km: mean round 17.49 (pole) vs 47.39 (centre); rms in/out 32.9 vs 19.9; ratio 1.883 vs 0.419", [vtP, vtC, rmsP, rmsC, rmsP / vtP, rmsC / vtC],
        [17.49, 47.39, 32.9, 19.9, 1.883, 0.419], [0.01, 0.01, 0.05, 0.05, 0.002, 0.002])
    row("DC37", "screen: 17.5, 33, 1.9; 47, 20, 0.4", [round(vtP, 1), round(rmsP), round(rmsP / vtP, 1), round(vtC), round(rmsC), round(rmsC / vtC, 1)], [17.5, 33, 1.9, 47, 20, 0.4], 1e-9)
    # height field raster on the polar map (cmocean deep reversed: low = dark, high = pale), 28.4-31.2 km, south of 20 N transparent
    lutd = B1.lut_rgb("cmocean.deep")[::-1]
    Xp, Yp = np.meshgrid(np.linspace(-rps, rps, 900), np.linspace(rps, -rps, 900))
    la_p, lo_p, ok_p = inv_ps(Xp, Yp)
    ok_p = ok_p & (la_p >= PS_EDGE)
    zz = np.concatenate([z, z[:, :1]], 1)
    lonw = np.r_[nlon, 360.0]
    zv = B1.bilin(zz, nlat, lonw, np.where(ok_p, la_p, 45.0), np.where(ok_p, np.mod(lo_p, 360.0), 0.0)) / 1e3
    zv[~ok_p] = np.nan
    B1.rgba_png(zv, lutd, 28.4, 31.2, IMG / "z10_ps.png", alpha=1.0)
    row("DC36", "height raster range inside 28.4-31.2 km (colour bar)", [float(np.nanmin(zv)), float(np.nanmax(zv))], [28.4, 31.2], [0.0 + 0.25, 0.25])
    levs = [28800.0 + 400 * i for i in range(7)]
    cl = B1.contours(zz, nlat, lonw, levs, nd=2)
    for c in cl:
        c["lines"] = [np.asarray(L).reshape(-1, 2)[:, ::-1].ravel().tolist() for L in c["lines"]]     # → flat [lat, lon, …]
    # ring points and radial / tangential components (every 2nd of 72 → 36 ticks)
    def ring_out(R):
        return {"lat": B1.r6(np.asarray(R.lat)[0][::2], 3), "lon": B1.r6(np.asarray(R.lon)[0][::2], 3), "vr": B1.r6(np.asarray(R.radial)[0][::2], 2),
                "vt": B1.r6(np.asarray(R.tangential)[0][::2], 2)}
    # polar night on 21 Jan: solar declination (Cooper 1969 approximation) δ = −23.44° cos(360° (N + 10) / 365)
    decl = -23.44 * np.cos(2 * np.pi * (21 + 10) / 365.0)
    row("DM30", "solar declination 21 Jan = −20.2°; polar night north of 69.8° N", [decl, 90 + decl], [-20.2, 69.8], [0.05, 0.05])
    V["vortex"] = {"date": "2026-01-21", "c": [vlat, vlon], "cz": float(vc.msl_min), "z30": z30, "vmax": vmax, "vmax_at": [float(nlat[jm]), float(nlon[im])],
                   "u60": float(N.u60.values[nk]), "contours": cl, "dpole": dpole, "vtP": vtP, "vtC": vtC, "rmsP": rmsP, "rmsC": rmsC,
                   "ringP": ring_out(ringP), "ringC": ring_out(ringC), "night": 90 + decl, "lut": B1.lut_hex("cmocean.deep")[::-1], "range": [28.4, 31.2]}
    # s19: on the map, i is parallel to θ̂ and j to −r̂ (12 test points) — the map's polar arrows vs the projected east/north steps
    errs_ = []
    for la_, lo_ in [(60.0, -90.0)] + [(float(a_), float(b_)) for a_, b_ in zip(np.linspace(30, 85, 11), np.linspace(-170, 170, 11))]:
        x0_, y0_ = MP.forward("polar_stereographic", la_, lo_, a=1.0, **PSK)
        xe, ye = MP.forward("polar_stereographic", la_, lo_ + 1e-4, a=1.0, **PSK)
        xn, yn = MP.forward("polar_stereographic", la_ + 1e-4, lo_, a=1.0, **PSK)
        th_ = np.arctan2(y0_, x0_)
        UV = call(CS + "unit_vectors_polar", "s19", "r̂, θ̂ on the polar map", theta=float(th_)) if la_ == 60.0 else np.asarray(
            importlib.import_module("fluidpy.core.coords").unit_vectors_polar(float(th_)))
        rh_, thh = np.asarray(UV)[0], np.asarray(UV)[1]
        e_ = np.array([xe - x0_, ye - y0_]); e_ /= np.hypot(*e_)
        n_ = np.array([xn - x0_, yn - y0_]); n_ /= np.hypot(*n_)
        errs_.append(max(np.degrees(np.arccos(np.clip(e_ @ thh, -1, 1))), np.degrees(np.arccos(np.clip(-(n_ @ rh_), -1, 1)))))
    row("DM30", "i ∥ θ̂ and j ∥ −r̂ on the polar map at 12 points (angle error, degrees)", max(errs_), 0.0, 0.01)

    # wind trails: RK4 through the frozen 21 Jan 10 hPa wind (advect_on_sphere), 600-s steps, every 3rd kept (1 frame = 30 min)
    rs4 = np.random.default_rng(7)
    sl, so = [], []
    for la_ in np.arange(31.25, 88.0, 2.5):
        dlo = 2.5 / max(0.2, np.cos(la_ * D2R))
        for lo_ in np.arange(0.0, 360.0, dlo):
            sl.append(la_ + rs4.uniform(-1.0, 1.0)); so.append((lo_ + rs4.uniform(-dlo / 2, dlo / 2)) % 360)
    sl, so = np.asarray(sl), np.asarray(so)
    LTR, SUB = 180, 3
    trk = np.asarray(call(DT_ + "advect_on_sphere", "s00/s01/s18-s21", "RK4 trails through the frozen 21 Jan 2026 10 hPa wind (600-s steps)", heavy_call=True,
                          u=un, v=vn, lat=nlat, lon=nlon, seeds_lat=sl, seeds_lon=so, dt=600.0, nsteps=LTR * SUB))
    tk = trk[:, ::SUB][:, :LTR]
    la_t, lo_t = tk[..., 0], ((tk[..., 1] + 180) % 360) - 180
    R_ = 6371.0
    dd = R_ * 2 * np.arcsin(np.sqrt(np.sin((la_t[:, 1:] - la_t[:, :-1]) * D2R / 2) ** 2 + np.cos(la_t[:, 1:] * D2R) * np.cos(la_t[:, :-1] * D2R)
                                    * np.sin((lo_t[:, 1:] - lo_t[:, :-1]) * D2R / 2) ** 2))
    sp_t = np.concatenate([dd[:, :1], dd], 1) * 1e3 / (600.0 * SUB)
    good = np.isfinite(la_t)
    row("DM29", "trail speeds from the track steps: max ≤ 80 m/s (field max 79.0), median of the 60-70 N trails > 30 m/s",
        [float(np.nanmax(sp_t)) <= 80.5, float(np.nanmedian(sp_t[(la_t > 60) & (la_t < 70)])) > 30], [1, 1], 0)
    truth("DM29", "trails go round anticlockwise seen from above the North Pole (mean eastward displacement > 0 at 50-80 N)",
          bool(np.nanmean(((lo_t[:, 1:] - lo_t[:, :-1] + 540) % 360 - 180)[(la_t[:, 1:] > 50) & (la_t[:, 1:] < 80)]) > 0))
    llq = np.where(good[..., None], np.round(np.stack([la_t, lo_t], -1) * 100), -32768).astype("<i2")
    spq = np.clip(np.round(np.nan_to_num(sp_t) * 4), 0, 255).astype(np.uint8)
    (IMG / "trails.bin").write_bytes(llq.tobytes() + spq.tobytes())
    V["trails"] = {"n": int(tk.shape[0]), "L": LTR, "dt_s": 600.0, "sub": SUB, "frame_s": 600.0 * SUB, "file": "mp_trails.bin", "format": "Int16 lat,lon ×100 [N, L, 2] then Uint8 speed ×4 [N, L]; −32768 gap"}

    # ================================================================ s20 the flat ring with a moved origin (DM31)
    uc = call(CS + "velocity_components", "s20", "u_r = u·r̂, u_θ = u·θ̂ at P = (500, 1000) km from the new origin, u = (−10, 0)", u_cart=[-10.0, 0.0], x=[500.0, 1000.0], system="polar")
    uc = np.asarray(uc).ravel()
    dP = float(np.hypot(500, 1000))
    row("DM31", "|O₂P| = 1118 km; r̂ = (0.447, 0.894); u_r = −4.472, u_θ = 8.944, |u| = 10", [dP, 500 / dP, 1000 / dP, uc[0], uc[1], np.hypot(*uc)],
        [1118.0, 0.447, 0.894, -4.472, 8.944, 10.0], [0.1, 5e-4, 5e-4, 5e-4, 5e-4, 1e-9])
    uc0 = np.asarray(call(CS + "velocity_components", "s20", "origin at the ring's centre: u at the top of the ring", u_cart=[-10.0, 0.0], x=[0.0, 1000.0], system="polar")).ravel()
    row("DM31", "origin at the centre: u_r = 0, u_θ = 10 at the top of the ring", list(uc0), [0.0, 10.0], 1e-9)
    V["wheel"] = {"R_km": 1000.0, "shift_km": 500.0, "U": 10.0, "dP": dP, "ur": float(uc[0]), "ut": float(uc[1])}

    # ---------------------------------------------------------------------------------------------- report and write
    for r in rows:
        print(f"  {'PASS' if r['pass'] else 'FAIL'}  {r['id']:5s} {r['name']}  -> {r['value']}")
    for fl in flags:
        print(f"  FLAG  {fl['id']:5s} {fl['scene']} {fl['what']}: {fl['hand_check']}")
    if not all(r["pass"] for r in rows):
        print("build_ch00_coordinates_maps: checks FAILED — no data written")
        return 1

    def clean(o):
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
    V["consts"] = {"a_km": A_KM, "brest": list(BREST), "lyb": list(LYB)}
    V = clean(V)
    blob = json.dumps(V, separators=(",", ":"), ensure_ascii=False, allow_nan=False).encode("utf-8")
    (DATA / "mp.json").write_bytes(blob)
    data_hashes = {"mp.json": hashlib.sha256(blob).hexdigest()}
    for pimg in sorted(list(IMG.glob("*.png")) + list(IMG.glob("*.jpg")) + list(IMG.glob("*.bin"))):
        data_hashes[f"img/{pimg.name}"] = B1.sha_file(pimg)
    render = {}
    for pub in a.public:
        pub.mkdir(parents=True, exist_ok=True)
        Image.open(B1.F_BMNG).convert("RGB").resize((4096, 2048), Image.LANCZOS).save(pub / "mp_bmng.jpg", quality=88)
        for pimg in sorted(list(IMG.glob("*.png")) + list(IMG.glob("*.jpg")) + list(IMG.glob("*.bin"))):
            (pub / f"mp_{pimg.name}").write_bytes(pimg.read_bytes())
        render = {pp.name: B1.sha_file(pp) for pp in sorted(pub.glob("mp_*"))}
    inputs = {str(pq.relative_to(ROOT)).replace("\\", "/") if ROOT in pq.parents else str(pq): B1.sha_file(pq)
              for pq in [B1.F_NCEP, B1.F_T2M, B1.F_BMNG, B1.F_NE110, B1.F_NE10A, B1.F_NE10C, B1.F_NE50L]}
    manifest = {
        "id": "ch00_coordinates_maps", "title": TITLE, "storyboard": "movies/ch00/ch00_coordinates_maps/storyboard.yaml",
        "builder": "movies/data/build_ch00_coordinates_maps.py",
        "fluidpy": {"repo": "../Fluid Dynamics", **B1.git_sha(FLUID, {"mapproj_py": "fluidpy/geo/mapproj.py", "sphere_py": "fluidpy/geo/sphere.py",
                                                                     "coords_py": "fluidpy/core/coords.py", "cyclone_py": "fluidpy/diag/cyclone.py",
                                                                     "trajectories_py": "fluidpy/diag/trajectories.py"})},
        "equations_note": "provenance only (QA/reviewer); the movie draws no equation labels or numbers (HOUSE_STYLE §5)",
        "equations": {"h_phi = a, h_lambda = a cos phi": "Vallis §2.2.2 text before (2.27)", "x = a lambda, y = a phi": "Snyder (12-1, 12-2)",
                      "k = 1/cos phi": "Snyder (12-3) with phi_1 = 0", "grad T": "Vallis (2.31) horizontal part, r = a",
                      "dy = a dphi / cos phi; y = a ln tan(pi/4 + phi/2)": "Snyder (7-2)", "area stretch 1/cos^2 phi": "Snyder (7-3)",
                      "Equal Earth": "Šavrič et al. (2019) Eqs. (1)-(2)", "polar stereographic": "Snyder (21-5…21-7), lat_ts 60",
                      "u_theta = u, u_r = -v": "Part 1 D04 with i = theta-hat, j = -r-hat; Vallis (2.29)", "u_r = u . r-hat": "Part 1 D04"},
        "parameters": {"places": {k: v["ll"] for k, v in pl.items()}, "london": list(LON), "los_angeles": list(LAX), "brest": list(BREST), "longyearbyen": list(LYB),
                       "tissot": {"radius_km": 500, "a": "EARTH_RADIUS (6.371e6 m), divided by a for drawing", "centres": [list(c) for c in TC]},
                       "polar_map": {**PSK, "edge_lat": PS_EDGE},
                       "vortex": {"date": "2026-01-21", "level_hPa": 10, "contour_m": 400, "levels_m": levs, "ring_km": 2000, "n_az": 72, "ticks_drawn": 36},
                       "trails": {"seeds": "jittered 2.5-degree equal-area grid 30-88 N, numpy default_rng(7)", "n": int(tk.shape[0]), "dt_s": 600, "kept": "every 3rd step",
                                  "screen_time": "1 frame = 30 min of flow (1 s of screen = 15 h) through the frozen daily mean",
                                  "samples": LTR, "speed_uint8_cap_ms": 63.75},
                       "time_compression": {"s00": "title morph and trails in a few seconds", "s03": "the peel and stretch morph in about 4 s",
                                            "s16": "the globe turns about 20° per second (one turn per 18 s) while it is shown; flattening in about 3 s",
                                            "s18-s21": "trails 1 s of screen = 15 h through the frozen daily-mean wind"},
                       "exaggerations": ["Tissot circles 500 km in radius (visibility)", "s03/s16 morphs are linear blends of vertex positions between two projections "
                                         "(a drawing aid)", "s08 one-degree step magnified on the slice", "s12 the short rhumb piece magnified", "s19 vortex size bar: order of magnitude",
                                         "s20 an idealised ring of air (thought experiment)", "s06 the 1-degree, 1 °C example is illustrative (easy numbers)"],
                       "screen_deviations": [
                           "s00 title in the series layout of Parts 4 and 5 ('Coordinates · Part 7' 64 px, 'Maps' 150 px, 'made easy' 88 px, 'projections and' / 'the view from the pole' 68 px)",
                           "skip chips at the top of the maths column x 1076-1840 (the storyboard's x 1500-1840 cannot hold 'every step · optional · skip to m:ss' at the 44-px floor); "
                           "then the small 'optional maths' tag at x 1520-1840 until the block ends",
                           "s18 trails: 1 frame = 30 min (storyboard 1 s = 3 h): at 3 h per second a 14-frame tail of a 79 m/s parcel is 16 px on this map",
                           "trail seeds on a 2.5-degree grid (storyboard 1.5): ~1600 SVG trails instead of ~4800 (render cost); one 600-s RK4 step per sample → every 3rd step kept",
                           "polar map cut at 20 N (the NCEP file's edge) instead of 15 N"],
                       "data_report": "reports/data/ch00_coordinates_research.md (2026-11-05): polar stereo + particles from NCEP 10 hPa, Python RK tracks drawn as trails"},
        "credits": ["NCEP/NCAR Reanalysis 1 data provided by the NOAA PSL, Boulder, Colorado, USA (public domain): 10 hPa daily means, 21 Jan 2026.",
                    "Contains modified Copernicus Climate Change Service information 2026 (ERA5 monthly 2-m temperature, Sep 2026, base 1991-2020).",
                    "NASA Blue Marble Next Generation (NASA Earth Observatory).", "Made with Natural Earth.",
                    "Music: tools/sound (procedural synthesis, our own code, CC0-1.0); style per storyboard (polar-chart, seed 31) or its runner-up."],
        "js_selftest": "the TSX projects with JS mirrors of mapproj.forward (platecarree, mercator, equalearth, gores, polar_stereographic); mp_lib.tsx asserts them "
                       "against data jscheck (16 points each, |Δ| < 1e-9 a) at module load; CHECK rows in the scene files re-assert every screen string",
        **chapters(), "inputs_sha256": inputs, "render_assets": render, "data_files": data_hashes, "checks": rows, "flags": flags,
        "physics": [e for e in entries if e.get("sha256")], "physics_recorded": [e for e in entries if not e.get("sha256")], "physics_heavy": heavy,
    }
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=1, ensure_ascii=False, default=str), encoding="utf-8")
    print(f"build_ch00_coordinates_maps: mp.json {len(blob) / 1e3:.0f} kB + {len(data_hashes) - 1} files; {len(entries)} parity entries, "
          f"{len(heavy)} heavy, {len(rows)} checks ({sum(r['pass'] for r in rows)} pass), {len(flags)} flags -> {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
