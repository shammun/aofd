"""Physics data for PoC D "Coriolis: straight in space, curved on the turntable" (movies/poc/storyboard.yaml).

Run with the main venv::

    .venv/Scripts/python.exe movies/data/build_poc.py

Calls only tested fluidpy functions (named in the storyboard's physics_source fields):

* s1  fluidpy.geo.frames.turntable_puck            t = linspace(0, 6, 181) s  -> inertial straight line, table angle
* s2  fluidpy.geo.frames.turntable_puck            t = linspace(0, 6, 136) s  -> rotating-frame path (replayed ×1.33)
      fluidpy.geo.frames.coriolis_acceleration_horizontal  u_R, v_R, f = 2Ω = 1 s⁻¹ -> violet arrow −f k×v_R
* s3  fluidpy.geo.frames.coriolis_parameter        lat = deg2rad(linspace(−90, 90, 181)), Ω = 7.292115e-5 s⁻¹

Writes movies/poc/data/{s1_inertial,s2_rotating,s3_coriolis_f}.json and movies/poc/manifest.json (function, Vallis
§/eq, parameters, fluidpy git SHA + sha256 of frames.py, sha256 of every data file, and a parity hash per call computed
exactly the way tools/movie_qa.py re-computes it). Before writing, the V1 checks below must pass (exit 1 otherwise).
"""
from __future__ import annotations

import hashlib
import json
import subprocess
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
FLUID = ROOT.parent / "Fluid Dynamics"
OUT = ROOT / "movies" / "poc"
DATA = OUT / "data"

sys.path.insert(0, str(FLUID))
from fluidpy.geo import frames  # noqa: E402

OMEGA_TABLE, U0 = 0.5, 0.15
OMEGA_EARTH = 7.292115e-5


def parity_hash(out) -> str:
    """Same rule as tools/movie_qa.py::physics_parity (float array bytes, else sorted JSON with str())."""
    try:
        blob = np.ascontiguousarray(np.asarray(out, dtype=float)).tobytes()
    except Exception:
        blob = json.dumps(out, sort_keys=True, default=str).encode()
    return hashlib.sha256(blob).hexdigest()


def r6(a) -> list:
    return [round(float(x), 6) for x in np.asarray(a).ravel()]


def git_sha(repo: Path) -> dict:
    run = lambda *a: subprocess.run(["git", "-C", str(repo), *a], capture_output=True, text=True).stdout.strip()  # noqa: E731
    src = repo / "fluidpy" / "geo" / "frames.py"
    return {"commit": run("rev-parse", "HEAD"),
            "frames_py_tracked": bool(run("ls-files", "fluidpy/geo/frames.py")),
            "dirty": bool(run("status", "--porcelain")),
            "frames_py_sha256": hashlib.sha256(src.read_bytes()).hexdigest()}


def checks(p1: dict, p2: dict, ax, ay, u_r, v_r, f) -> list[dict]:
    rows = []

    def row(name, val, ref, tol):
        ok = bool(np.all(np.abs(np.asarray(val) - np.asarray(ref)) <= tol))
        rows.append({"name": name, "value": r6(np.atleast_1d(val))[:4], "ref": r6(np.atleast_1d(ref))[:4],
                     "tol": tol, "pass": ok})

    t1 = np.asarray(p1["t"])
    # V1 straight line in the inertial frame: x_I = U0 t, y_I = 0 (launch from the axis, Ω×r = 0)
    row("V1 inertial path x_I = 0.15 t", p1["x_inertial"], U0 * t1, 1e-12)
    row("V1 inertial path y_I = 0", p1["y_inertial"], 0 * t1, 1e-12)
    row("V1 time of flight: x_I(6 s) = 0.900 m (rim 1.0 m reached at 6.67 s)", p1["x_inertial"][-1], 0.9, 1e-12)
    # V4 radius preserved by the frame rotation
    t2 = np.asarray(p2["t"])
    row("V4 |x_R| = |x_I| = 0.15 t", np.hypot(p2["x_rotating"], p2["y_rotating"]), U0 * t2, 1e-12)
    # storyboard spot values
    s3 = frames.turntable_puck(3.0, 0, 0, U0, 0, OMEGA_TABLE)
    row("spot x_R(3 s) = 0.032 m", s3["x_rotating"], 0.032, 5e-4)
    row("spot y_R(3 s) = -0.449 m", s3["y_rotating"], -0.449, 5e-4)
    row("spot x_R(6 s) = -0.891 m", p2["x_rotating"][-1], -0.891, 5e-4)
    row("spot y_R(6 s) = -0.127 m", p2["y_rotating"][-1], -0.127, 5e-4)
    # V1 rotating path solves (2.12): dv/dt = -2Ω×v - Ω×(Ω×r) (DOP853), launch v_R = (0.15, 0) at the axis
    try:
        from scipy.integrate import solve_ivp

        Om = OMEGA_TABLE

        def rhs(_t, s):
            x, y, u, v = s
            return [u, v, 2 * Om * v + Om ** 2 * x, -2 * Om * u + Om ** 2 * y]
        sol = solve_ivp(rhs, (0, 6), [0, 0, U0, 0], method="DOP853", rtol=1e-11, atol=1e-13, t_eval=t2)
        row("V1 rotating path = solve_ivp of (2.12) x", sol.y[0], p2["x_rotating"], 1e-8)
        row("V1 rotating path = solve_ivp of (2.12) y", sol.y[1], p2["y_rotating"], 1e-8)
        row("velocity mirror u_R = d x_R/dt (ODE)", sol.y[2], u_r, 1e-8)
        row("velocity mirror v_R = d y_R/dt (ODE)", sol.y[3], v_r, 1e-8)
    except ImportError:
        rows.append({"name": "V1 solve_ivp", "pass": False, "value": "scipy missing"})
    # Coriolis arrow: ⟂ v_R, |a| = |f||v|, to the right (cross product z < 0) for f > 0
    row("Coriolis a·v_R = 0", ax * u_r + ay * v_r, 0 * u_r, 1e-12)
    row("Coriolis |a| = f|v_R|", np.hypot(ax, ay), 1.0 * np.hypot(u_r, v_r), 1e-12)
    rows.append({"name": "V7 Ω>0 deflects right (v × a has z < 0)",
                 "pass": bool(np.all(u_r * ay - v_r * ax < 0)), "value": float(np.max(u_r * ay - v_r * ax))})
    # f spot values
    lat = np.deg2rad([90.0, 45.0, 0.0, -45.0])
    row("f(90,45,0,-45) s^-1", frames.coriolis_parameter(lat, OMEGA_EARTH), [1.4584e-4, 1.0313e-4, 0, -1.0313e-4], 1e-8)
    return rows


def main() -> int:
    DATA.mkdir(parents=True, exist_ok=True)
    common = dict(x0=0.0, y0=0.0, u0=U0, v0=0.0, Omega=OMEGA_TABLE, launch="rotating")
    t1 = np.linspace(0.0, 6.0, 181)
    t2 = np.linspace(0.0, 6.0, 136)
    p1 = frames.turntable_puck(t1, **common)
    p2 = frames.turntable_puck(t2, **common)
    # rotating-frame velocity, Eq. (2.7) differentiated: v_R = R(−Ωt) v_I − Ω k×r_R
    ang = np.asarray(p2["angle"])
    c, s = np.cos(ang), np.sin(ang)
    U, V = p2["U"], p2["V"]
    u_r = U * c + V * s + OMEGA_TABLE * np.asarray(p2["y_rotating"])
    v_r = -U * s + V * c - OMEGA_TABLE * np.asarray(p2["x_rotating"])
    f_table = 2 * OMEGA_TABLE
    ax, ay = frames.coriolis_acceleration_horizontal(u_r, v_r, f_table)
    lat_deg = np.linspace(-90.0, 90.0, 181)
    fvals = frames.coriolis_parameter(np.deg2rad(lat_deg), OMEGA_EARTH)

    rows = checks(p1, p2, ax, ay, u_r, v_r, fvals)
    for r in rows:
        print(f"  {'PASS' if r['pass'] else 'FAIL'}  {r['name']}")
    if not all(r["pass"] for r in rows):
        print("build_poc: V1 checks FAILED — no data written")
        return 1

    files = {
        "s1_inertial.json": {"scene": "s1_inertial", "t": r6(t1), "x_inertial": r6(p1["x_inertial"]),
                             "y_inertial": r6(p1["y_inertial"]), "angle": r6(p1["angle"]),
                             "units": {"t": "s", "x": "m", "angle": "rad"}, "table_radius_m": 1.0},
        "s2_rotating.json": {"scene": "s2_rotating", "t": r6(t2), "x_rotating": r6(p2["x_rotating"]),
                             "y_rotating": r6(p2["y_rotating"]), "angle": r6(p2["angle"]),
                             "x_inertial": r6(p2["x_inertial"]), "y_inertial": r6(p2["y_inertial"]),
                             "u_rotating": r6(u_r), "v_rotating": r6(v_r),
                             "coriolis_ax": r6(ax), "coriolis_ay": r6(ay), "f_table": f_table,
                             "units": {"t": "s", "x": "m", "u": "m/s", "a": "m/s^2", "f": "1/s"}},
        "s3_coriolis_f.json": {"scene": "s3_equation", "lat_deg": r6(lat_deg), "f": [float(f"{v:.6e}") for v in fvals],
                               "Omega": OMEGA_EARTH, "units": {"lat": "deg", "f": "1/s"}},
    }
    data_hashes = {}
    for name, obj in files.items():
        blob = json.dumps(obj, separators=(",", ":")).encode()
        (DATA / name).write_bytes(blob)
        data_hashes[name] = hashlib.sha256(blob).hexdigest()

    # parity entries: params are plain JSON so tools/movie_qa.py can call fn(**params) and re-hash
    entries = [
        {"fn": "fluidpy.geo.frames.turntable_puck", "scene": "s1_inertial", "data": "data/s1_inertial.json",
         "vallis": "§2.1, Eq. (2.7)", "params": {"t": t1.tolist(), **common}},
        {"fn": "fluidpy.geo.frames.turntable_puck", "scene": "s2_rotating", "data": "data/s2_rotating.json",
         "vallis": "§2.1, Eq. (2.12)", "params": {"t": t2.tolist(), **common}},
        {"fn": "fluidpy.geo.frames.coriolis_acceleration_horizontal", "scene": "s2_rotating",
         "data": "data/s2_rotating.json", "vallis": "§2.3, Eq. (2.79); §2.9, Eq. (2.233)",
         "params": {"u": u_r.tolist(), "v": v_r.tolist(), "f": f_table}},
        {"fn": "fluidpy.geo.frames.coriolis_parameter", "scene": "s3_equation", "data": "data/s3_coriolis_f.json",
         "vallis": "§2.3, Eq. (2.80)", "params": {"lat": np.deg2rad(lat_deg).tolist(), "Omega": OMEGA_EARTH},
         "units": {"lat": "rad (np.deg2rad of linspace(-90, 90, 181) deg)", "Omega": "rad/s", "f": "1/s"},
         "spot": {"f_45N": float(frames.coriolis_parameter(np.deg2rad(45.0), OMEGA_EARTH))}},
    ]
    import importlib

    for e in entries:
        mod, fn = e["fn"].rsplit(".", 1)
        e["sha256"] = parity_hash(getattr(importlib.import_module(mod), fn)(**e["params"]))
    manifest = {
        "id": "poc_coriolis_turntable", "storyboard": "movies/poc/storyboard.yaml", "builder": "movies/data/build_poc.py",
        "fluidpy": {"repo": "../Fluid Dynamics", **git_sha(FLUID)},
        "parameters": {"Omega_table_rad_s": OMEGA_TABLE, "u0_m_s": U0, "table_radius_m": 1.0, "f_table_s-1": f_table,
                       "Omega_earth_rad_s": OMEGA_EARTH, "s2_playback": "6 s of table time in 4.5 s (×1.33)"},
        "data_files": data_hashes, "checks": rows, "physics": entries,
    }
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=1, ensure_ascii=False), encoding="utf-8")
    print(f"build_poc: {len(files)} data files + manifest.json -> {OUT}")
    for k, v in data_hashes.items():
        print(f"  {k}  sha256 {v[:16]}…")
    return 0


if __name__ == "__main__":
    sys.exit(main())
