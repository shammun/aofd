"""Physics and real-data products for the Chapter-0 movie #5a "Coordinates, Part 1: on a flat map, from Cartesian to polar
and turned axes" (movies/ch00/ch00_coordinates_flat/storyboard.yaml, 29 scenes; CHECK rows DF02-DF27).

Run with the main venv::

    .venv/Scripts/python.exe movies/data/build_ch00_coordinates_flat.py [--public <render public dir> ...]

Every number the movie shows or says is computed here by the tested functions named in the storyboard's
``physics_source`` fields:

* ``fluidpy.core.coords`` (polar_from_cartesian, cartesian_from_polar_coords, unit_vectors_polar, velocity_components),
  ``fluidpy.core.tensors`` (rotation_matrix_2d, direction_cosines, transform_vector, dot), ``fluidpy.geo.atmos.wind_components``,
* ``fluidpy.diag.cyclone`` (storm_centre, storm_relative_wind), ``fluidpy.diag.trajectories.advect_on_sphere``,

on files already on disk (no download): the HRRR Ian analysis (G: derived), IBTrACS Ian, Natural Earth 10 m coast.

Data report (reports/data/ch00_coordinates_research.md §1b-§1c, 2026-11-05) applied:
* the storm centre is HRRR's OWN calm (10-m wind-speed minimum) centre, 26.506 N 82.441 W, so the marker sits at the
  centre of the field on screen (never mixed with another centre in one picture; the GOES underlay of build 1 is dropped
  because its eye is the real eye, ≈ 17 km NE of the model's); the 25-km ring then gives v_t 34.8, v_r −13.3 m/s;
* no hatch anywhere (the build-1 "stripes" were our own hatch_neg), rasters ≥ 1024 px.

Writes movies/ch00/ch00_coordinates_flat/data/cf.json (numbers and small arrays the composition only indexes and
interpolates; ``say`` = the spoken/written rounded values, each asserted against the data here), data/img/*.png and
manifest.json (function, provenance, parameters, fluidpy git SHA, sha256 of inputs and data files, parity hashes).
All CHECK rows must pass before anything is written (exit 1 otherwise).
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
OUT = ROOT / "movies" / "ch00" / "ch00_coordinates_flat"
DATA = OUT / "data"
IMG = DATA / "img"
sys.path.insert(0, str(FLUID))
sys.path.insert(0, str(Path(__file__).resolve().parent))
import build_ch00_coordinates as B1  # noqa: E402  (shared helpers: parity_hash, r6, sha_file, git_sha, lut_rgb, lut_hex, rgba_png, shp_parts, box_lines)
import xarray as xr  # noqa: E402

D2R = np.pi / 180.0
A_E = 6.371e6
IAN_BOX = (24.0, 29.5, -85.0, -79.5)
# data report §1c: HRRR's own calm centre (10-m wind-speed minimum), the radar eye for the record
CALM = (26.506, -82.441)
RADAR_EYE = {"lat": 26.552, "lon": -82.278, "time": "2022-09-28T18:01:48Z", "site": "NEXRAD KTBW 0.5°", "eyewall_radius_km": 29.7}
TITLE = "Coordinates, Part 1 — Arrows on a flat map: polar coordinates and rotated axes"
CS, DC, DT_ = "fluidpy.core.coords.", "fluidpy.diag.cyclone.", "fluidpy.diag.trajectories."
TN = "fluidpy.core.tensors."


CHAPTERS = [("s00_title", "Title"), ("s01_hook", "What are coordinates?"), ("s02_coordinates", "Origin, axes and Cartesian coordinates"),
            ("s04_polar", "Polar coordinates"), ("s06_bearings", "Maths angle, compass bearing and wind 'from'"), ("s07_radians", "Radians and arc length"),
            ("s08_r_hat", "The unit vector r-hat"), ("s09_where_theta_grows", "Every step: theta-hat and the 90-degree turn rule"),
            ("s12_arrows_depend", "Polar unit vectors depend on place"), ("s13_components", "Every step: a wind's radial and tangential parts"),
            ("s15_turn_axes", "Every step: turned axes and the rotation matrix"), ("s21_ian_polar", "Hurricane Ian in polar coordinates"),
            ("s23_what_numbers_mean", "What 35 and 13 mean"), ("s24_ring_points", "Every step: three ring points by hand"),
            ("s25_why_polar_storm", "Why hurricane scientists use polar coordinates"), ("s26_inflow_angle", "The inflow angle and four angles"),
            ("s27_recap", "Recap"), ("s28_end", "End")]
SKIPS = [("s09_where_theta_grows", "s11_theta_hat"), ("s13_components", "s14_rebuild_general"), ("s15_turn_axes", "s20_polar_is_turned"), ("s24_ring_points", "s24_ring_points")]


def chapters() -> dict:
    """Chapter marks (time, title) and the maths-skip targets from the final timing.json (user rule 2026-11-05)."""
    tp = OUT / "timing.json"
    if not tp.exists():
        return {}
    tm = json.loads(tp.read_text(encoding="utf-8"))
    by = {s["id"]: s for s in tm["scenes"]}
    mmss = lambda t: f"{int(t) // 60}:{int(t) % 60:02d}"  # noqa: E731
    ch = [{"time": mmss(0 if i == 0 else by[sid]["start"]), "t_s": round(0.0 if i == 0 else by[sid]["start"], 3), "title": ti, "scene": sid}
          for i, (sid, ti) in enumerate(CHAPTERS)]
    sk = []
    for a, b in SKIPS:
        q = by[b]["sentences"][-1]
        assert q["text"].startswith("If you skipped"), b
        sk.append({"block_from": a, "skip_line_s": round(by[a]["sentences"][0]["start"], 3), "skip_to": mmss(q["start"]), "skip_to_s": round(q["start"], 3), "keep_line": q["text"]})
    return {"chapters": ch, "maths_skips": sk}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--public", type=Path, nargs="*", default=[], help="render public dir(s) for the cf_* assets")
    a = ap.parse_args()
    from PIL import Image
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
        ok = bool(np.all(np.abs(v - r) <= np.asarray(tol)))
        rows.append({"id": wid, "name": name, "value": B1.r6(np.ravel(v)[:9]), "ref": B1.r6(np.ravel(r)[:9]), "tol": tol, "pass": ok})

    def truth(wid, name, cond, value=None):
        rows.append({"id": wid, "name": name, "value": value if value is not None else bool(cond), "ref": True, "tol": 0, "pass": bool(cond)})

    def call(fn: str, scene: str, eq: str, heavy_call: bool = False, **params):
        mod, name = fn.rsplit(".", 1)
        out = getattr(importlib.import_module(mod), name)(**params)
        if heavy_call:
            heavy.append({"fn": fn, "scene": scene, "eq": eq, "params": {k: (v if isinstance(v, (int, float, str, type(None), tuple, list))
                          else f"array {np.shape(v)}, sha256 {B1.parity_hash(v)}") for k, v in params.items()},
                          "output_sha256": B1.parity_hash(out) if not hasattr(out, "_fields") and not hasattr(out, "__dataclass_fields__") else B1.parity_hash(str(out))})
            return out
        jp = {k: (np.asarray(v).tolist() if isinstance(v, np.ndarray) else v) for k, v in params.items()}
        try:
            h = B1.parity_hash(out)
        except Exception:
            h = None
        entries.append({"fn": fn, "scene": scene, "data": "data/cf.json", "eq": eq, "params": jp, "sha256": h})
        return out

    say: dict = {}

    # ================================================================ the flat map: the balloon at (3, 4) km (s02-s20)
    row("DF02", "balloon 3 km east, 4 km north (easy numbers)", [3.0, 4.0], [3, 4], 0)
    pol = call(CS + "polar_from_cartesian", "s04", "r = sqrt(x²+y²), θ = atan2(y, x)", x=3.0, y=4.0)
    r0, th0 = float(pol[0]), float(pol[1])
    row("DF03", "polar of (3, 4): r 5, θ 53.13°", [r0, np.degrees(th0)], [5.0, 53.130], 5e-4)
    row("DF03", "screen: √(3²+4²) = √25 = 5; tan θ = 4/3 → θ ≈ 53°", [np.sqrt(9 + 16), np.tan(th0), round(np.degrees(th0))], [5, 4 / 3, 53], 1e-12)
    back = call(CS + "cartesian_from_polar_coords", "s05", "x = r cos θ, y = r sin θ", r=r0, theta=th0)
    row("DF03", "round trip back to (3, 4); 5 × 0.6 = 3, 5 × 0.8 = 4", [float(back[0]), float(back[1]), 5 * 0.6, 5 * 0.8], [3, 4, 3, 4], 1e-12)
    row("DF04", "compass bearing 90 − 53.13 = 36.87° (said 37); 90 − 53 = 37", [90 - np.degrees(th0), 90 - 53], [36.87, 37], [5e-3, 0])
    wc = call("fluidpy.geo.atmos.wind_components", "s06", "u = −s sin d, v = −s cos d ('from')", speed=10.0, dir_from_deg=270.0)
    row("DF04", "west wind 10 m/s from 270° → u = +10, v = 0", [float(wc[0]), float(wc[1])], [10.0, 0.0], 1e-12)
    row("DF05", "1 rad = 57.30° (said 57); 5 × 0.2 = 1 km; 50 × 0.2 = 10 km", [np.degrees(1.0), 5 * 0.2, 50 * 0.2], [57.2958, 1.0, 10.0], 1e-4)
    E = call(CS + "unit_vectors_polar", "s08", "r̂ = (cos θ, sin θ), θ̂ = (−sin θ, cos θ)", theta=th0)
    row("DF06", "r̂ = (3, 4)/5 = (0.6, 0.8); θ̂ = (−0.8, 0.6)", np.ravel(E), [0.6, 0.8, -0.8, 0.6], 1e-12)
    row("DF06", "|r̂|² = 0.36 + 0.64 = 1", [0.36 + 0.64, float(np.hypot(*E[0]))], [1, 1], 1e-12)
    # D01: the slide when θ grows has no part along r̂
    from fluidpy.core import coords as CO
    dth = 1e-4
    p1 = np.asarray(CO.cartesian_from_polar_coords(5.0, th0)), np.asarray(CO.cartesian_from_polar_coords(5.0, th0 + dth))
    sl = (p1[1] - p1[0]) / np.hypot(*(p1[1] - p1[0]))
    row("DF07", "θ grows by 1e-4 rad at r = 5: slide · r̂ ≈ 0 (≤ 1e-4), slide ≈ θ̂", [float(sl @ E[0]), *sl], [0, -0.8, 0.6], 1e-4)
    for dr, ref in ((0.1, 5.1), (-0.1, 4.9)):
        row("DF07", f"a move with a part {dr:+} km along r̂ changes the distance to {ref} km", np.hypot(*(np.array([3, 4]) + dr * E[0])), ref, 1e-12)
    # D02: the 90° turn
    C90 = call(TN + "rotation_matrix_2d", "s10", "C(π/2): columns (0, 1), (−1, 0); C @ v turns v by +90°", theta=np.pi / 2)
    row("DF08", "x̂ → (0, 1), ŷ → (−1, 0) (columns of C(π/2))", np.ravel(np.asarray(C90).T), [0, 1, -1, 0], 1e-12)
    t34 = np.asarray(C90) @ np.array([3.0, 4.0])
    row("DF08", "(3, 4) turned +90° = (−4, 3); length √(16+9) = 5", [*t34, np.hypot(*t34)], [-4, 3, 5], 1e-12)
    d0 = float(call(TN + "dot", "s10", "(3, 4)·(−4, 3) = −12 + 12 = 0", a=[3.0, 4.0], b=[-4.0, 3.0]))
    row("DF08", "dot product 3 × (−4) + 4 × 3 = 0 (right angle)", d0, 0.0, 1e-12)
    # D03: θ̂ checks
    for tdeg, ref in ((0.0, [0, 1]), (90.0, [-1, 0])):
        Et = call(CS + "unit_vectors_polar", "s11", f"θ̂ at θ = {tdeg:.0f}°", theta=np.deg2rad(tdeg))
        row("DF09", f"θ = {tdeg:.0f}°: θ̂ = {ref}", Et[1], ref, 1e-12)
    row("DF09", "|θ̂| = √(0.64 + 0.36) = 1; r̂·θ̂ = −0.48 + 0.48 = 0", [0.64 + 0.36, 0.6 * -0.8 + 0.8 * 0.6, float(E[0] @ E[1])], [1, 0, 0], 1e-12)
    q0 = np.asarray(CO.cartesian_from_polar_coords(5000.0, th0))
    q1 = np.asarray(call(CS + "cartesian_from_polar_coords", "s11", "the balloon turned by 0.1°", r=5000.0, theta=th0 + np.deg2rad(0.1)))
    dq = q1 - q0
    row("DF09", "0.1° slide: (−6.99, 5.23) m, chord 8.73 m (said 7.0 west, 5.2 north, 8.7)", [*dq, np.hypot(*dq)], [-6.99, 5.23, 8.73], 0.01)
    row("DF09", "arc rule: 5000 m × 0.001745 rad = 8.7 m; 0.1° = 0.001745 rad", [5000 * np.deg2rad(0.1), np.deg2rad(0.1)], [8.727, 0.001745], [1e-3, 5e-7])
    row("DF09", "(−7.0, 5.2)/8.7 ≈ (−0.80, 0.60); true direction ≈ θ̂ within 0.1°", [-7.0 / 8.7, 5.2 / 8.7, *(dq / np.hypot(*dq))], [-0.80, 0.60, -0.8, 0.6], [0.01, 0.01, 1e-3, 1e-3])
    # fix 1, user note U1 (s11 last check, no θ̂ used): the positions before / after the 0.1° turn from x = r cos θ, y = r sin θ
    th1d = np.degrees(th0) + 0.1
    row("DF09", "U1: 0.1° = 0.1 × π/180 = 0.001745 rad; s = r Δθ = 5000 × 0.001745 = 8.73 m", [0.1 * np.pi / 180, 5000 * 0.1 * np.pi / 180], [0.001745, 8.727], [5e-7, 1e-3])
    row("DF09", "U1: before (3000, 4000) m = 5000 (cos 53.13°, sin 53.13°)", [*q0], [3000.0, 4000.0], 1e-6)
    row("DF09", "U1: after θ = 53.23°: x = 5000 cos 53.23° ≈ 2993.0 m, y = 5000 sin 53.23° ≈ 4005.2 m", [th1d, *q1], [53.23, 2993.0, 4005.2], [0.005, 0.05, 0.05])
    row("DF09", "U1: cos 53.23° = 0.598603, sin 53.23° = 0.801046; 5000 × those = 2993.0, 4005.2; √(7.0² + 5.2²) = √76.04 = 8.72 ≈ s",
        [np.cos(np.deg2rad(th1d)), np.sin(np.deg2rad(th1d)), 5000 * 0.598603, 5000 * 0.801046, np.hypot(7.0, 5.2)], [0.598603, 0.801046, 2993.0, 4005.2, 8.72],
        [5e-7, 5e-7, 0.05, 0.05, 0.005])
    row("DF09", "U1: moved ≈ 7.0 m west, 5.2 m north (screen 2993.0 − 3000 = −7.0; 4005.2 − 4000 = 5.2)", [*dq, 2993.0 - 3000, 4005.2 - 4000], [-7.0, 5.2, -7.0, 5.2], [0.02, 0.04, 1e-9, 1e-9])
    for tdeg, ref in ((0.0, [1, 0, 0, 1]), (90.0, [0, 1, -1, 0]), (180.0, [-1, 0, 0, -1])):
        Et = call(CS + "unit_vectors_polar", "s12", f"r̂, θ̂ at θ = {tdeg:.0f}°", theta=np.deg2rad(tdeg))
        row("DF10", f"θ = {tdeg:.0f}°: r̂, θ̂ = {ref}", np.ravel(Et), ref, 1e-12)
    uc = call(CS + "velocity_components", "s13", "u_r = u·r̂, u_θ = u·θ̂", u_cart=[10.0, 0.0], x=[3.0, 4.0], system="polar")
    row("DF11", "east wind (10, 0) at (3, 4): (u_r, u_θ) = (6, −8)", [uc[0], uc[1], 10 * 0.6 + 0 * 0.8, 10 * -0.8 + 0 * 0.6], [6, -8, 6, -8], 1e-12)
    rb = 6 * np.array([0.6, 0.8]), -8 * np.array([-0.8, 0.6])
    row("DF12", "6 r̂ = (3.6, 4.8); −8 θ̂ = (6.4, −4.8); sum (10, 0); √(36+64) = 10", [*rb[0], *rb[1], *(rb[0] + rb[1]), np.sqrt(36 + 64)],
        [3.6, 4.8, 6.4, -4.8, 10, 0, 10], 1e-12)
    a30 = np.deg2rad(30.0)
    C30 = call(TN + "rotation_matrix_2d", "s15", "C(α): columns x̂′ = (cos α, sin α), ŷ′ = (−sin α, cos α)", theta=a30)
    C30 = np.asarray(C30)
    row("DF13", "x̂′ = (0.866, 0.5) (cos 30 ≈ 0.87 / 0.866, sin 30 = 0.5)", C30[:, 0], [0.8660, 0.5], 5e-5)
    row("DF14", "ŷ′ = (−0.5, 0.866); |ŷ′|² = 0.25 + 0.75 = 1; x̂′·ŷ′ = 0", [*C30[:, 1], 0.25 + 0.75, float(C30[:, 0] @ C30[:, 1])], [-0.5, 0.8660, 1, 0], 5e-5)
    xp = call(TN + "transform_vector", "s17", "x′_j = x_i C_ij (= Cᵀx)", u=[3.0, 4.0], C=C30)
    row("DF15", "(3, 4) in axes turned 30°: (4.598, 1.964), length 5", [xp[0], xp[1], np.hypot(*xp)], [4.598, 1.964, 5.0], 5e-4)
    row("DF15", "screen: 3 × 0.866 = 2.60; + 2 = 4.60; −1.5 + 4 × 0.866 = −1.5 + 3.46 = 1.96; √(4.6² + 1.96²) ≈ √25",
        [3 * 0.866, 3 * 0.866 + 2, 4 * 0.866, -1.5 + 3.464, 4.6 ** 2 + 1.96 ** 2], [2.60, 4.60, 3.46, 1.96, 25.0], [5e-3, 5e-3, 5e-3, 5e-3, 0.05])
    row("DF16", "matrix rows × (3, 4): Cᵀ(30°) @ (3, 4) = (4.598, 1.964)", C30.T @ np.array([3.0, 4.0]), [4.598, 1.964], 5e-4)
    Cdc = call(TN + "direction_cosines", "s19", "C_ij = e_i · e′_j", E_old=np.eye(2), E_new=C30.T)
    row("DF17", "direction_cosines(I, rows x̂′, ŷ′) = rotation_matrix_2d(30°): C11 cos, C12 −sin, C21 sin, C22 cos",
        np.ravel(Cdc), [np.cos(a30), -np.sin(a30), np.sin(a30), np.cos(a30)], 1e-12)
    row("DF17", "x_i C_ij = (4.598, 1.964) (j = 1: x C11 + y C21; j = 2: x C12 + y C22)",
        [3 * Cdc[0, 0] + 4 * Cdc[1, 0], 3 * Cdc[0, 1] + 4 * Cdc[1, 1]], [4.598, 1.964], 5e-4)
    C53 = np.asarray(call(TN + "rotation_matrix_2d", "s20", "axes turned by α = θ = 53.13°", theta=th0))
    w53 = call(TN + "transform_vector", "s20", "the east wind in axes turned by θ", u=[10.0, 0.0], C=C53)
    p53 = call(TN + "transform_vector", "s20", "the position (3, 4) in axes turned by θ", u=[3.0, 4.0], C=C53)
    row("DF18", "α = θ: x̂′ = r̂, ŷ′ = θ̂; wind → (6, −8) = velocity_components; (3, 4) → (5, 0)",
        [*C53[:, 0], *C53[:, 1], *w53, *p53], [0.6, 0.8, -0.8, 0.6, uc[0], uc[1], 5, 0], 1e-12)
    row("DF18", "screen: 1.8 + 3.2 = 5; −2.4 + 2.4 = 0", [3 * 0.6 + 4 * 0.8, -3 * 0.8 + 4 * 0.6], [5, 0], 1e-12)
    V["plane"] = {"r": r0, "th": np.degrees(th0), "rhat": B1.r6(E[0]), "thhat": B1.r6(E[1]), "ur": float(uc[0]), "ut": float(uc[1]),
                  "slide_m": B1.r6(dq, 3), "before_m": B1.r6(q0, 3), "after_m": B1.r6(q1, 3), "th_after": float(np.degrees(th0) + 0.1), "C30": B1.r6(C30), "xp30": B1.r6(xp), "turn34": B1.r6(t34)}

    # ================================================================ Hurricane Ian, HRRR 18 UTC (s00, s01, s03, s21-s27)
    H = xr.open_dataset(B1.F_HRRR)
    times = json.loads(H.attrs["times"])
    k18 = times.index("2022-09-28T18")
    LA2, LO2 = H.lat.values.astype(float), H.lon.values.astype(float)
    u18, v18 = H.u10.values[k18].astype(float), H.v10.values[k18].astype(float)
    msl18 = H.mslma.values[k18].astype(float)
    sp18 = np.hypot(u18, v18)
    calm = call(DC + "storm_centre", "s21", "sub-grid minimum of the 10-m wind speed (the model's calm centre)", heavy_call=True,
                msl=sp18, lat=LA2, lon=LO2, box=(26.3, 26.7, -82.6, -82.25))
    pmin = call(DC + "storm_centre", "s21", "sub-grid minimum of sea-level pressure (build 1's marker, for the record)", heavy_call=True,
                msl=msl18, lat=LA2, lon=LO2, box=(25.0, 28.0, -84.0, -81.0))
    import fluidpy.geo.sphere as SPH
    d_calm = float(SPH.great_circle_distance(CALM[0], CALM[1], float(calm.lat), float(calm.lon))) / 1e3
    d_radar = float(SPH.great_circle_distance(CALM[0], CALM[1], RADAR_EYE["lat"], RADAR_EYE["lon"])) / 1e3
    d_pmin = float(SPH.great_circle_distance(CALM[0], CALM[1], float(pmin.lat), float(pmin.lon))) / 1e3
    row("DF20", "data-report calm centre 26.506 N 82.441 W within 1.5 km of storm_centre(10-m speed)", d_calm, 0.0, 1.5)
    row("DF20", "model calm centre ≈ 17 km from the radar eye (source line), ≈ 7 km from the HRRR pressure minimum", [d_radar, d_pmin], [17.0, 7.0], [1.5, 1.0])
    radii = [10, 15, 20, 25, 30, 40]
    RW = call(DC + "storm_relative_wind", "s22", "v_t = k·(r̂ × u), v_r = r̂·u", heavy_call=True, u=u18, v=v18, lat=LA2, lon=LO2,
              centre=CALM, radii_km=radii, n_az=72)
    i25 = radii.index(25)
    vt, vr = float(RW.tangential_mean[i25]), float(RW.radial_mean[i25])
    ring = {"az": np.degrees(RW.azimuth), "u": RW.u[i25], "v": RW.v[i25], "vt": RW.tangential[i25], "vr": RW.radial[i25]}
    row("DF21", "ring 25 km, 72 points: v_t 34.8, v_r −13.3 m/s (data report)", [vt, vr], [34.8, -13.3], 0.05)
    say.update({"vt": 35, "vr": -13, "kmh": 126})
    row("DF21", "said: about 35 and minus 13; 35 × 3.6 = 126 km/h", [round(vt), round(vr), 35 * 3.6], [35, -13, 126], 1e-9)
    row("DF21", "ring-mean v_t largest near 25 km ('ring of strongest winds', within 1 m/s of the max over 10-40 km)", max(RW.tangential_mean) - vt, 0.0, 1.0)
    truth("DF21", "v_t > 0 at every ring point (anticlockwise seen from above, NH)", bool(np.all(ring["vt"] > 0)), B1.r6(ring["vt"].min(), 2))
    ibt = json.loads(B1.F_IBT.read_text(encoding="utf-8"))
    kb = ibt["time"].index("2022-09-28 18:00:00")
    row("DF22", "IBTrACS USA 135 kt at 18 UTC; 135 × 1.85 = 250 km/h (1.852 exact)", [ibt["usa_wind_kt"][kb], 135 * 1.85, 135 * 1.852], [135, 249.75, 250.0], [0, 0.01, 0.1])
    say.update({"res": 37, "res_kmh": 47, "t_s": 1900, "t_min": 32, "lap_km": 157, "lap_min": 75, "ratio": 2.7, "tan": 0.38, "angle": 21})
    row("DF23", "√(35² + 13²) = 37.3 ≈ 37 (data √(34.8² + 13.3²) = 37.3)", [np.sqrt(35 ** 2 + 13 ** 2), np.hypot(vt, vr)], [37.3, 37.3], 0.1)
    row("DF23", "13 × 3.6 = 46.8 ≈ 47 km/h", 13 * 3.6, 47, 0.25)
    row("DF23", "25 000 / 13 = 1923 s ≈ 1900 s ≈ 32 min (data 1881 s)", [25000 / 13, 25000 / 13 / 60, 25000 / -vr], [1923, 32.05, 1881], [1, 0.05, 2])
    row("DF23", "2π × 25 km = 157 km; 157 000 / 35 = 4486 s ≈ 75 min (data 4514 s)", [2 * np.pi * 25, 157000 / 35 / 60, 2 * np.pi * 25000 / vt / 60], [157.1, 74.8, 75.2], 0.1)
    row("DF23", "35 / 13 = 2.69 ≈ 2.7 ('almost three'); data 2.62", [35 / 13, vt / -vr], [2.69, 2.62], 0.01)
    # three points by hand (az 0, 90, 135)
    pts = {}
    for azd in (0, 90, 135):
        j = int(np.argmin(np.abs(ring["az"] - azd)))
        pts[azd] = {"u": float(ring["u"][j]), "v": float(ring["v"][j]), "ur": float(ring["vr"][j]), "ut": float(ring["vt"][j]), "j": j}
    row("DF24", "θ = 0: u −8.66, v 38.03 → u_r = u ≈ −8.7, u_θ = v ≈ 38", [pts[0]["u"], pts[0]["v"], pts[0]["ur"], pts[0]["ut"]], [-8.7, 38.0, -8.7, 38.0], 0.1)
    row("DF24", "θ = 90°: u −16.9, v −37.4 → u_r = v = −37.4, u_θ = −u = 16.9", [pts[90]["u"], pts[90]["v"], pts[90]["ur"], pts[90]["ut"]], [-16.9, -37.4, -37.4, 16.9], 0.05)
    row("DF24", "θ = 135°: u −10.1, v −44.5 → u_r −24.3, u_θ 38.6", [pts[135]["u"], pts[135]["v"], pts[135]["ur"], pts[135]["ut"]], [-10.1, -44.5, -24.3, 38.6], 0.1)
    c135, s135 = np.cos(np.deg2rad(135)), np.sin(np.deg2rad(135))
    # fix 1 (review 1 Should 3): one value everywhere, the data's −24.32 → "−24.3"; the screen and voice use 7.14 and 31.46
    row("DF24", "screen θ = 135°: 10.1 × 0.707 = 7.14; 44.5 × 0.707 = 31.46; 7.14 − 31.46 = −24.32 ≈ −24.3 (= data −24.32); 7.14 + 31.46 = 38.60 ≈ 38.6",
        [10.1 * 0.707, 44.5 * 0.707, 7.14 - 31.46, 7.14 + 31.46, pts[135]["ur"], -10.1 * c135 + -44.5 * s135], [7.14, 31.46, -24.32, 38.60, -24.3, -24.31],
        [0.005, 0.005, 1e-9, 1e-9, 0.05, 0.02])
    row("DF24", "the rule u cos θ + v sin θ, −u sin θ + v cos θ reproduces the library at the three points",
        [p["u"] * np.cos(np.deg2rad(az)) + p["v"] * np.sin(np.deg2rad(az)) - p["ur"] for az, p in pts.items()], [0, 0, 0], 0.15)
    npos = int(np.sum(ring["vr"] >= 0))
    row("DF25", "ring ranges: v_t 16.9-46.8 ('17 to 47'), v_r −40.1 to +14.1 ('minus 40 to plus 14')",
        [ring["vt"].min(), ring["vt"].max(), ring["vr"].min(), ring["vr"].max()], [17, 47, -40, 14], 0.5)
    row("DF25", "v_r < 0 at 58 of 72 ring points; the positive ones lie 185-250° (the southwest side)", [72 - npos, ring["az"][ring["vr"] >= 0].min(), ring["az"][ring["vr"] >= 0].max()], [58, 185, 250], [0, 5, 5])
    row("DF25", "u, v swing from plus to minus by tens of m/s", [ring["u"].min(), ring["u"].max(), ring["v"].min(), ring["v"].max()], [-32.2, 30.3, -46.4, 44.5], 0.1)
    row("DF26", "tan = 13.3/34.8 = 0.382 ≈ 0.38; atan → 20.9° ≈ 21 (= Part 2); library inflow angle of the means 20.9°",
        [13.3 / 34.8, np.degrees(np.arctan(13.3 / 34.8)), float(RW.inflow_angle_mean_deg[i25])], [0.38, 20.9, 20.9], [0.005, 0.1, 0.1])
    V["ian"] = {"c": list(CALM), "pmin": [float(pmin.lat), float(pmin.lon), float(pmin.msl_min) / 100], "radar": RADAR_EYE, "d_radar_km": d_radar,
                "radii": radii, "vtm": B1.r6(RW.tangential_mean, 3), "vrm": B1.r6(RW.radial_mean, 3), "vt": vt, "vr": vr,
                "inflow": float(RW.inflow_angle_mean_deg[i25]), "best_kt": 135,
                "ring": {"az": B1.r6(ring["az"], 2), "lat": B1.r6(RW.lat[i25], 4), "lon": B1.r6(RW.lon[i25], 4), "u": B1.r6(ring["u"], 2),
                         "v": B1.r6(ring["v"], 2), "vt": B1.r6(ring["vt"], 2), "vr": B1.r6(ring["vr"], 2), "rhat": B1.r6(np.asarray(RW.rhat)[i25], 4) if hasattr(RW, "rhat") else None},
                "pts": {str(k): v for k, v in pts.items()}, "npos": npos}
    # regrid to 0.03° lat/lon for the raster and the streaklines (as build 1)
    from scipy.interpolate import griddata
    glat = np.arange(23.4, 30.0001, 0.03)
    glon = np.arange(-85.6, -78.6999, 0.03)
    GLO, GLA = np.meshgrid(glon, glat)
    ptsg = np.stack([LO2.ravel(), LA2.ravel()], -1)
    U18 = griddata(ptsg, u18.ravel(), (GLO, GLA), method="linear")
    V18 = griddata(ptsg, v18.ravel(), (GLO, GLA), method="linear")
    B1.rgba_png(np.hypot(U18, V18)[::-1], B1.lut_rgb("cmocean.speed"), 0, 50, IMG / "ian_speed_18.png", alpha=0.92, hatch_neg=False, up=5)
    w_img = Image.open(IMG / "ian_speed_18.png").size
    truth("DF20", "speed raster ≥ 1024 px wide, no hatch (data report §1b)", w_img[0] >= 1024, list(w_img))
    dla = 0.015
    V["ian"]["speed_box"] = [float(glat[0] - dla), float(glat[-1] + dla), float(glon[0] - dla), float(glon[-1] + dla)]
    rs = np.random.default_rng(7)
    sl_ = rs.uniform(IAN_BOX[0], IAN_BOX[1], 260)
    so_ = rs.uniform(IAN_BOX[2], IAN_BOX[3], 260)
    tr = call(DT_ + "advect_on_sphere", "s21", "dλ/dt = u/(a cos φ), dφ/dt = v/a (RK4), frozen 18 UTC field", heavy_call=True,
              u=np.nan_to_num(U18), v=np.nan_to_num(V18), lat=glat, lon=glon, seeds_lat=sl_, seeds_lon=so_, dt=150.0, nsteps=47)
    V["ian"]["tracks"] = [np.round(t, 3).tolist() for t in tr]
    ang = rs.uniform(0, 2 * np.pi, 160)
    rad = np.sqrt(rs.uniform(0.02, 1.0, 160)) * 70e3
    zl = CALM[0] + np.degrees(rad * np.sin(ang) / A_E)
    zo = CALM[1] + np.degrees(rad * np.cos(ang) / (A_E * np.cos(CALM[0] * D2R)))
    tz = call(DT_ + "advect_on_sphere", "s21", "zoom tracks, dt 30 s, frozen 18 UTC field", heavy_call=True,
              u=np.nan_to_num(U18), v=np.nan_to_num(V18), lat=glat, lon=glon, seeds_lat=zl, seeds_lon=zo, dt=30.0, nsteps=47)
    V["ian"]["ztracks"] = [np.round(t, 4).tolist() for t in tz]
    V["ian"]["track_dt_s"] = [150.0, 30.0]
    coast = [p for _, ps in B1.shp_parts(B1.F_NE10C) for p in ps]
    V["ian"]["coast"] = B1.box_lines(coast, (22.5, 31.0, -87.0, -78.0), nd=3)
    V["luts"] = {"speed": B1.lut_hex("cmocean.speed")}

    # ================================================================ recap (s27)
    row("DF27", "recap numbers = scene rows: 35 / 13 / 21°", [round(vt), round(-vr), say["angle"]], [35, 13, round(float(RW.inflow_angle_mean_deg[i25]))], 0)
    V["say"] = say

    # ---------------------------------------------------------------------------------------------- report and write
    for r in rows:
        print(f"  {'PASS' if r['pass'] else 'FAIL'}  {r['id']:5s} {r['name']}  -> {r['value']}")
    if not all(r["pass"] for r in rows):
        print("build_ch00_coordinates_flat: checks FAILED — no data written")
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
    V = clean(V)
    blob = json.dumps(V, separators=(",", ":"), ensure_ascii=False, allow_nan=False).encode("utf-8")
    (DATA / "cf.json").write_bytes(blob)
    data_hashes = {"cf.json": hashlib.sha256(blob).hexdigest()}
    for pimg in sorted(IMG.glob("*.png")):
        data_hashes[f"img/{pimg.name}"] = B1.sha_file(pimg)
    render = {}
    for pub in a.public:
        pub.mkdir(parents=True, exist_ok=True)
        for pimg in sorted(IMG.glob("*.png")):
            (pub / f"cf_{pimg.name}").write_bytes(pimg.read_bytes())
        render = {pp.name: B1.sha_file(pp) for pp in sorted(pub.glob("cf_*.png"))}
    inputs = {str(pq.relative_to(ROOT)).replace("\\", "/") if ROOT in pq.parents else str(pq): B1.sha_file(pq) for pq in [B1.F_HRRR, B1.F_IBT, B1.F_NE10C]}
    manifest = {
        "id": "ch00_coordinates_flat", "title": TITLE, "storyboard": "movies/ch00/ch00_coordinates_flat/storyboard.yaml", "builder": "movies/data/build_ch00_coordinates_flat.py",
        "fluidpy": {"repo": "../Fluid Dynamics", **B1.git_sha(FLUID, {"coords_py": "fluidpy/core/coords.py", "tensors_py": "fluidpy/core/tensors.py",
                                                                     "atmos_py": "fluidpy/geo/atmos.py", "sphere_py": "fluidpy/geo/sphere.py",
                                                                     "cyclone_py": "fluidpy/diag/cyclone.py", "trajectories_py": "fluidpy/diag/trajectories.py"})},
        "equations_note": "provenance only (QA/reviewer); the movie draws no equation labels or numbers (HOUSE_STYLE §5)",
        "equations": {"polar position and unit vectors": "Kundu App. B §B.5 (printed p. 865)", "rotation of axes, direction cosines": "Kundu (2.4)-(2.5)",
                      "storm-relative wind": "Vallis §2.2.2 (2.28)-(2.29) via fluidpy.diag.cyclone"},
        "parameters": {"balloon_km": [3, 4], "alpha_deg": 30, "east_wind_ms": [10, 0],
                       "ian": {"hrrr_time": "2022-09-28T18", "centre": {"used": list(CALM), "method": "HRRR's own calm centre (10-m wind-speed minimum), data report §1c",
                                                                        "storm_centre_speed_min": [float(calm.lat), float(calm.lon)], "hrrr_msl_min": V["ian"]["pmin"],
                                                                        "radar_eye": RADAR_EYE, "distance_to_radar_eye_km": d_radar},
                               "ring_km": 25, "n_az": 72, "regrid": "HRRR LCC -> 0.03° lat/lon (scipy griddata linear), raster ×5 (≥ 1024 px, no hatch)",
                               "underlay": "none (build 1's GOES underlay dropped: its eye is the real eye, ≈ 17 km from the model's; never mix centres)"},
                       "time_compression": {"s21": "particles 150 s per sample (frozen 18 UTC field), zoom 30 s", "s00/s12": "one balloon lap in about 4 s / over three sentences"},
                       "exaggerations": ["s09 the 'little' turn drawn at 15°", "s11 the 0.1° slide magnified in an inset", "unit arrows drawn ≈ 180 px on a km map",
                                         "s22-s24 ring-mean and point arrows on one m/s scale", "s23 constant-inflow spiral is illustrative"],
                       "screen_deviations": ["s02-s07 flat map is a code-drawn local plane (no imagery: a 12-km window is ≈ 6 px of Blue Marble), as in build 1",
                                             "s21-s25 maps in a local equirectangular frame scaled by cos(latitude)"],
                       "data_report": "reports/data/ch00_coordinates_research.md (2026-11-05) §1b, §1c applied"},
        "credits": ["NOAA HRRR analyses (public domain) via the University of Utah HRRR-zarr archive.",
                    "IBTrACS v04r01 (NOAA NCEI). Radar eye position from NOAA NEXRAD KTBW Level-II (public domain; data report).",
                    "Made with Natural Earth.", "Music: tools/sound (procedural synthesis, our own code, CC0-1.0)."],
        "js_selftest": "none — every number is read from data/cf.json (TSX CHECK rows re-assert the screen strings)",
        **chapters(), "inputs_sha256": inputs, "render_assets": render, "data_files": data_hashes, "checks": rows,
        "physics": [e for e in entries if e.get("sha256")], "physics_recorded": [e for e in entries if not e.get("sha256")], "physics_heavy": heavy,
    }
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=1, ensure_ascii=False, default=str), encoding="utf-8")
    print(f"build_ch00_coordinates_flat: cf.json {len(blob) / 1e3:.0f} kB + {len(data_hashes) - 1} images; {len(entries)} parity entries, "
          f"{len(heavy)} heavy, {len(rows)} checks ({sum(r['pass'] for r in rows)} pass) -> {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
