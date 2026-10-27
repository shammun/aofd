"""Physics and real-data products for the Chapter-0A movie "The cross product: an arrow at right angles, and why the
wind turns" (movies/ch00/ch00_cross_product_why/storyboard.yaml, version 1: 49 scenes, items N1-N7).

Run with the main venv::

    .venv/Scripts/python.exe movies/data/build_ch00_cross_product_why.py            # everything that is ready
    .venv/Scripts/python.exe movies/data/build_ch00_cross_product_why.py --part core # analytic scenes only

Every number the movie shows is computed here by the tested functions named in the storyboard's ``physics_source``
fields: ``fluidpy.geo.vectors`` (``dot``, ``cross``, ``norm``, ``angle_between``, ``scalar_projection``,
``projection``, ``parallelogram_area``, ``triple_scalar``, ``k_cross``), ``fluidpy.geo.frames``
(``coriolis_parameter``, ``coriolis_horizontal``, ``coriolis_acceleration_horizontal``, ``inertial_circle``,
``inertial_oscillation_sphere``, ``great_circle``), ``fluidpy.core.rotating.coriolis_acceleration``,
``fluidpy.core.operators.gradient``, ``fluidpy.core.gfd`` (``parcel_adjust``, ``geostrophic_velocity``) and
``fluidpy.geo.atmos.geostrophic_wind_from_height``. Real-data streaklines come from
``fluidpy.diag.trajectories.advect_on_sphere`` (I1) and the storm rings from ``fluidpy.diag.cyclone`` (I2) when those
are installed; until then the particle part is skipped (never faked) and the rings use the storyboard's I2 fallback
(``fluidpy.geo.vectors.cross`` / ``dot`` with CHECK rows).

Writes movies/ch00/ch00_cross_product_why/data/*.json (+ trails_*.bin, Int16 lat/lon x 100) and manifest.json
(function, equation provenance, parameters, fluidpy git SHA + sha256 of the source files, sha256 of each data file,
and a parity hash per light call computed the way tools/movie_qa.py re-computes it). Heavy real-data calls are
recorded in ``physics_heavy`` with input-file hashes and output hashes (not re-run by QA). The checks below must pass
before anything is written (exit 1 otherwise). The composition (movies/src/ch00/CrossProductWhy.tsx) only indexes and
interpolates these samples.
"""
from __future__ import annotations

import argparse
import hashlib
import importlib
import json
import subprocess
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
FLUID = ROOT.parent / "Fluid Dynamics"
OUT = ROOT / "movies" / "ch00" / "ch00_cross_product_why"
DATA = OUT / "data"
REAL = DATA / "real"

sys.path.insert(0, str(FLUID))
from fluidpy.core import gfd as GFD  # noqa: E402
from fluidpy.core.operators import gradient  # noqa: E402
from fluidpy.geo import frames as FR  # noqa: E402
from fluidpy.geo import vectors as V  # noqa: E402
from fluidpy.geo.atmos import geostrophic_wind_from_height  # noqa: E402
from fluidpy.geo.constants import EARTH_RADIUS, G0, OMEGA, SIDEREAL_DAY  # noqa: E402

A3, B3 = [5.0, 1.0, 0.0], [1.0, 3.0, 0.0]
A2, B2 = [5.0, 1.0], [1.0, 3.0]
P3 = [3.0, 0.0, 0.0]
Q_CASES = [[2.0, 0.0, 0.0], [0.0, 2.0, 0.0], [-2.0, 0.0, 0.0], [0.0, -2.0, 0.0]]
DEG = np.pi / 180.0
VEC, FRM = "fluidpy.geo.vectors.", "fluidpy.geo.frames."

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


def lut_hex(name: str, n: int = 64) -> list[str]:
    """A colour map from the project LUT file (assets/luts.json, tools/make_luts.py), resampled to n hex colours."""
    import base64
    tab = json.loads((ROOT / "assets" / "luts.json").read_text(encoding="utf-8"))["tables"][name]
    rgb = np.frombuffer(base64.b64decode(tab), dtype=np.uint8).reshape(-1, 3)
    idx = np.round(np.linspace(0, len(rgb) - 1, n)).astype(int)
    return ["#%02x%02x%02x" % tuple(int(c) for c in rgb[i]) for i in idx]


def sha_file(p: Path) -> str:
    return hashlib.sha256(p.read_bytes()).hexdigest()


def read_bin(name: str) -> tuple[dict, dict]:
    """Read a data/real Float32 bin + json header -> (header, {var: ndarray})."""
    hdr = json.loads((REAL / f"{name}.json").read_text(encoding="utf-8"))
    raw = (REAL / hdr["bin"]).read_bytes()
    out = {}
    for v in hdr["variables"]:
        a = np.frombuffer(raw, dtype="<f4", count=v["count"], offset=v["offset_bytes"]).astype(float)
        out[v["name"]] = a.reshape(v["shape"])
    return hdr, out


def enu_offsets_km(lat, lon, clat, clon, a=EARTH_RADIUS):
    """Local tangent-plane (east, north) offsets [km] of points from a centre (equirectangular, r << a)."""
    dlon = (np.asarray(lon) - clon + 180.0) % 360.0 - 180.0
    return (a * np.cos(clat * DEG) * dlon * DEG / 1e3, a * (np.asarray(lat) - clat) * DEG / 1e3)


def dest_point(clat, clon, east_km, north_km, a=EARTH_RADIUS):
    """Inverse of enu_offsets_km (equirectangular)."""
    return clat + north_km * 1e3 / a / DEG, clon + east_km * 1e3 / (a * np.cos(clat * DEG)) / DEG


def _ll(lat, lon, r=1.0):
    """kit_cp/globe.tsx ll(): Y-up globe coordinates of (lat, lon) [deg]."""
    la, lo = np.radians(lat), np.radians(lon)
    return np.array([r * np.cos(la) * np.sin(lo), r * np.sin(la), r * np.cos(la) * np.cos(lo)])


def _cam_basis(cam):
    """kit_cp globeCam (no tilt/yaw): eye above (lat, lon) at `dist` Earth radii, looking at the surface point, north up."""
    lat, lon, dist = cam
    la, lo = np.radians(lat), np.radians(lon)
    n = np.array([-np.sin(la) * np.sin(lo), np.cos(la), -np.sin(la) * np.cos(lo)])
    surf = _ll(lat, lon)
    pos = surf + surf * (dist - 1.0)
    f = (surf - pos) / np.linalg.norm(surf - pos)
    right = np.cross(f, n); right /= np.linalg.norm(right)
    up = np.cross(right, f)
    return pos, f, right, up


def globe_screen(cam, lat, lon, r=1.0, M=None, W=1920, H=1080, fov=35.0, world=None):
    """Screen px of a globe point through the same pinhole camera as kit_cp (cam.ts projector, principal point at the
    canvas centre; a principal-point shift only translates and does not change any CHECK below)."""
    pos, f, right, up = _cam_basis(cam)
    q = np.asarray(world if world is not None else _ll(lat, lon, r), float)
    if M is not None:
        q = M @ q
    d = q - pos
    z = d @ f
    k = (H / 2) / np.tan(np.radians(fov) / 2) / z
    return np.array([W / 2 + k * (d @ right), H / 2 - k * (d @ up)])


def globe_matrix(spin, tilt_deg):
    """kit_cp globeMatrix: rotation about z by tilt, after a spin about Y."""
    c, s = np.cos(np.radians(tilt_deg)), np.sin(np.radians(tilt_deg))
    Rz = np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]])
    cs, ss = np.cos(spin), np.sin(spin)
    Ry = np.array([[cs, 0, ss], [0, 1, 0], [-ss, 0, cs]])
    return Rz @ Ry


def v4_parts(row, truth, call, files, pending, f45) -> None:
    """Items N8-N20, N22 of the v4 storyboard (the 'why' section, Ω × r, the merry-go-round, Ω split, the round low)."""
    import sympy as sp
    pair = files["pair.json"]
    a2, b2 = np.array(A2), np.array(B2)
    # ---------------------------------------------------------------- N8 box proof (s09a)
    polys = {"a_tri_1": [[0, 0], [5, 0], [5, 1]], "a_tri_2": [[6, 4], [1, 4], [1, 3]],
             "b_tri_1": [[5, 1], [6, 1], [6, 4]], "b_tri_2": [[0, 0], [0, 3], [1, 3]],
             "sq_1": [[5, 0], [6, 0], [6, 1], [5, 1]], "sq_2": [[0, 3], [1, 3], [1, 4], [0, 4]]}
    shoe = {k: 0.5 * abs(sum(p[i][0] * p[(i + 1) % len(p)][1] - p[(i + 1) % len(p)][0] * p[i][1] for i in range(len(p)))) for k, p in polys.items()}
    area = call(VEC + "parallelogram_area", "s09a", "pair.json", "box minus corners = |a×b| (ours)", a=A2, b=B2)
    row("N8 pieces: a-triangles 5, b-triangles 3, squares 2", [shoe["a_tri_1"] + shoe["a_tri_2"], shoe["b_tri_1"] + shoe["b_tri_2"], shoe["sq_1"] + shoe["sq_2"]], [5, 3, 2], 1e-12)
    row("N8 shoelace sum of the six pieces = 10; 24 − 10 = parallelogram_area = 14", [sum(shoe.values()), 24 - sum(shoe.values())], [10, area], 1e-12)
    a1, a2s, b1, b2s = sp.symbols("a1 a2 b1 b2")
    ident = sp.expand((a1 + b1) * (a2s + b2s) - a1 * a2s - b1 * b2s - 2 * a2s * b1 - (a1 * b2s - a2s * b1))
    truth("N8 sympy: (a1+b1)(a2+b2) − a1a2 − b1b2 − 2a2b1 − (a1b2 − a2b1) = 0", ident == 0)
    pair["box_proof"] = {"box": [[0, 0], [6, 0], [6, 4], [0, 4]], "box_area": 24, "polygons": polys, "areas": {k: r6(v) for k, v in shoe.items()},
                         "sums": {"a": 5, "b": 3, "squares": 2}, "area": r6(area)}
    # ---------------------------------------------------------------- N9 along / across (s18b) and the slide (s18c)
    along_b = np.asarray(call(VEC + "projection", "s18b", "pair.json", "part of b along a", a=B2, b=A2))
    across_b = b2 - along_b
    al, ac = float(np.linalg.norm(along_b)), float(np.linalg.norm(across_b))
    row("N9 along = 1.5689, across = 2.7456", [al, ac], [1.5689, 2.7456], 5e-5)
    row("N9 along² + across² = |b|² = 10", al ** 2 + ac ** 2, 10.0, 1e-12)
    row("N9 |a| × across = 14", np.linalg.norm(a2) * ac, 14.0, 1e-12)
    row("N9 across = |b| sin θ (display 3.162 × 0.868 ≈ 2.75)", [ac, round(3.162 * 0.868, 2)], [pair["norm_b"] * pair["sin_theta"], 2.74], 2e-2)
    row("N9 display 5.099 × 2.75 ≈ 14 (14.02)", round(5.099 * 2.75, 2), 14.02, 1e-9)
    ss = np.round(np.arange(0, 2.0 + 1e-9, 0.02), 4)
    bs = np.stack([b2[0] + ss * a2[0], b2[1] + ss * a2[1], 0 * ss], -1)
    cz = np.asarray(call(VEC + "cross", "s18c", "pair.json", "a×(b + s a) for s = 0..2", a=A3, b=bs.tolist()))[:, 2]
    row("N9 slide: cross z = 14 for every s (max |z − 14|)", float(np.max(np.abs(cz - 14))), 0.0, 1e-12)
    row("N9 slide: s = 1 gives b = (6, 4); 5×4 − 1×6 = 14", [*bs[50, :2], 5 * 4 - 1 * 6], [6, 4, 14], 1e-12)
    pair["split_b"] = {"along": r6(along_b), "across": r6(across_b), "along_len": r6(al), "across_len": r6(ac),
                       "display": {"along": 1.57, "across": 2.75}}
    pair["slide"] = {"s": ss.tolist(), "b": r6(bs[:, :2], 4), "cross_z": r6(cz)}
    # ---------------------------------------------------------------- N22 shadows on the walls (s22b)
    ta, tb = [2.0, 0.0, 1.0], [0.0, 2.0, 1.0]
    tc = np.asarray(call(VEC + "cross", "s22b", "pair.json", "tilted a × b (illustrative pair)", a=ta, b=tb))
    proj = {"yz": ([ta[1], ta[2]], [tb[1], tb[2]]), "zx": ([ta[2], ta[0]], [tb[2], tb[0]]), "xy": ([ta[0], ta[1]], [tb[0], tb[1]])}
    sh = [float(call(VEC + "parallelogram_area", "s22b", "pair.json", f"shadow on the {k} wall", a=p, b=q)) for k, (p, q) in proj.items()]
    row("N22 tilted cross = (−2, −2, 4); shadow areas (yz, zx, xy) = |components| = 2, 2, 4", [*tc, *sh], [-2, -2, 4, 2, 2, 4], 1e-12)
    ours = [float(V.parallelogram_area([A3[1], A3[2]], [B3[1], B3[2]])), float(V.parallelogram_area([A3[2], A3[0]], [B3[2], B3[0]])),
            float(V.parallelogram_area([A3[0], A3[1]], [B3[0], B3[1]]))]
    row("N22 ours: wall shadows 0, 0; floor 14", ours, [0, 0, 14], 1e-12)
    pair["shadows"] = {"a": ta, "b": tb, "cross": r6(tc), "areas_yz_zx_xy": r6(sh), "ours": ours}
    # ---------------------------------------------------------------- N10 torque along / across (s20)
    tq = files["torque.json"]
    rt = np.array(tq["r"])
    Fs = np.array(tq["F"])
    alongF = np.asarray(call(VEC + "scalar_projection", "s20", "torque.json", "part of F along the spanner", a=Fs.tolist(), b=rt.tolist()))
    acrossF = np.asarray(call(VEC + "parallelogram_area", "s20", "torque.json", "|r||F_across| (area) / |r| = part across", a=rt.tolist(), b=Fs.tolist())) / np.linalg.norm(rt)
    row("N10 F components (0, 50), (43.30, 25), (50, 0)", Fs[:, :2].ravel(), [0, 50, 43.30127, 25, 50, 0], 1e-4)
    row("N10 along 0, 43.3, 50; across 50, 25, 0", [*alongF, *acrossF], [0, 43.30127, 50, 50, 25, 0], 1e-4)
    row("N10 0.3 × across = |τ| = 15, 7.5, 0", 0.3 * acrossF, tq["tau_mag"], 1e-9)
    tq.update({"along_N": r6(alongF, 4), "across_N": r6(acrossF, 4), "F_display": [[0, 50, 0], [43.3, 25, 0], [50, 0, 0]]})
    # ---------------------------------------------------------------- N11 angular momentum and the moving charge (s22c, s22d)
    ex = {}
    rL, pL = [0.5, 0.0, 0.0], [0.0, 2.0 * 3.0, 0.0]
    L = np.asarray(call(VEC + "cross", "s22c", "examples.json", "L = r × p (angular momentum)", a=rL, b=pL))
    tens = np.asarray(call(VEC + "cross", "s22c", "examples.json", "string torque r × (−T r̂) = 0", a=rL, b=[-5.0, 0.0, 0.0]))
    row("N11 L = (0, 0, 3); string torque 0", [*L, *tens], [0, 0, 3, 0, 0, 0], 1e-12)
    push = np.asarray(call(VEC + "cross", "s22d", "examples.json", "x̂ × ẑ = −ŷ: v (east) × B (up) points south", a=[1.0, 0, 0], b=[0, 0, 1.0]))
    row("N11 v × B = (0, −1, 0) (south)", push, [0, -1, 0], 1e-12)
    tc_ = np.linspace(0, 2 * np.pi, 121)
    ch = call(FRM + "inertial_oscillation", "s22d", "examples.json", "charge circle: dv/dt = −f k × v, f = +1 (same equation; clockwise)",
              t=tc_.tolist(), u0=1.0, v0=0.0, f=1.0)
    row("N11 charge circle speed constant (1)", np.hypot(ch["u"], ch["v"]), 1.0, 1e-12)
    ex["angular_momentum"] = {"r": rL, "p": pL, "m": 2, "speed": 3, "L": r6(L)}
    ex["charge"] = {"v": [1, 0, 0], "B": [0, 0, 1], "push": r6(push), "circle_xy": r6(np.stack([ch["x"], ch["y"]], -1), 5),
                    "circle_uv": r6(np.stack([ch["u"], ch["v"]], -1), 5), "centre": [r6(ch["xc"]), r6(ch["yc"])]}
    # ---------------------------------------------------------------- N12 kicks (s22e)
    kicks = {}
    for n in (1, 10, 100):
        u = np.array([10.0, 0.0])
        pts = [u.copy()]
        for _ in range(n):
            kdir = np.asarray(V.k_cross(u)) / np.linalg.norm(u)
            row_ok = abs(float(V.dot(kdir, u))) < 1e-12
            if not row_ok:
                truth(f"N12 kick ⟂ u (n={n})", False)
            u = u + kdir * (1.0 / n)
            pts.append(u.copy())
        sp_ = float(call(VEC + "norm", "s22e", "examples.json", f"speed after {n} perpendicular kick(s)", a=u.tolist()))
        ang = float(np.degrees(np.arctan2(u[1], u[0])))
        kicks[str(n)] = {"speed": r6(sp_, 7), "turn_deg": r6(ang, 4), "tips": r6(np.array(pts), 6)}
    row("N12 speeds 10.0499, 10.0050, 10.0005", [kicks[k]["speed"] for k in ("1", "10", "100")], [10.0499, 10.0050, 10.0005], 1e-4)
    row("N12 turn 5.711°, 5.728°, 5.729°", [kicks[k]["turn_deg"] for k in ("1", "10", "100")], [5.711, 5.728, 5.729], 1e-3)
    truth("N12 every kick ⟂ the current velocity (dot = 0)", True)
    tk = np.linspace(0, 2 * np.pi / 1e-4, 241)
    io = call(FRM + "inertial_oscillation", "s22e", "examples.json", "continuous ⟂ push: circle (f = −1e-4, anticlockwise, the kicks' sense)",
              t=tk.tolist(), u0=10.0, v0=0.0, f=-1e-4)
    row("N12 circle speed 10 (1e-12)", np.hypot(io["u"], io["v"]), 10.0, 1e-9)
    kicks["circle_xy_km"] = r6(np.stack([io["x"], io["y"]], -1) / 1e3, 3)
    kicks["circle_uv"] = r6(np.stack([io["u"], io["v"]], -1), 5)
    ex["kicks"] = kicks
    files["examples.json"] = ex
    # ---------------------------------------------------------------- N13 why exactly 90° (s23a)
    tu = files["turning.json"]
    u5 = [5.0, 0.0]
    p30 = [np.cos(60 * DEG), np.sin(60 * DEG)]
    al30 = float(call(VEC + "scalar_projection", "s23a", "turning.json", "along part of a push 30° off the perpendicular", a=p30, b=u5))
    pperp = np.asarray(V.k_cross(u5)) / 5.0
    d90 = float(call(VEC + "dot", "s23a", "turning.json", "⟂ push · u = 0", a=pperp.tolist(), b=u5))
    row("N13 along part = sin 30° = 0.5 of the push; ⟂ push · u = 0", [al30, d90], [0.5, 0.0], 1e-12)
    tu["why90"] = {"push30": r6(p30), "along": r6(al30), "across": r6(float(np.sqrt(1 - al30 ** 2))), "perp": r6(pperp)}
    # ---------------------------------------------------------------- N15 r at 45°N, the ground speed (s25a-s25b)
    ea = files["earth.json"]
    r45 = EARTH_RADIUS * np.array([np.cos(45 * DEG), 0.0, np.sin(45 * DEG)])
    Om = [0.0, 0.0, OMEGA]
    th = float(call(VEC + "angle_between", "s25", "earth.json", "θ between Ω and r", a=Om, b=r45.tolist(), degrees=True))
    rad = float(np.linalg.norm(r45) * np.sin(th * DEG))
    v45 = np.asarray(call(VEC + "cross", "s25b", "earth.json", "v = Ω × r at 45°N", a=Om, b=r45.tolist()))
    row("N15 r45 = (4504.98, 0, 4504.98) km, |r| = 6371 km", [*(r45 / 1e3), np.linalg.norm(r45) / 1e3], [4504.98, 0, 4504.98, 6371.0], 0.01)
    row("N15 θ = 45°, radius 4504.98 km", [th, rad / 1e3], [45, 4504.98], 0.01)
    row("N15 Ω × r = (0, 328.51, 0) m/s = Ω |r| sin θ ŷ", [*v45, OMEGA * rad], [0, 328.51, 0, 328.51], 0.01)
    row("N15 display 7.29e-5 × 4 505 000 = 328.4, exact 328.51 → ≈ 329", round(float(v45[1])), 329, 0)
    row("N15 display 6371 × sin 45° ≈ 4505", round(6371 * np.sin(45 * DEG)), 4505, 0)
    ea.update({"r45_km": r6(r45 / 1e3, 2), "theta_deg": r6(th, 4), "radius_km": r6(rad / 1e3, 2), "v45": r6(v45, 3),
               "period_s": SIDEREAL_DAY})
    # ---------------------------------------------------------------- N14 the globe axis meets the texture's poles (s24 + globes)
    worst, leak = 0.0, 0
    for spin in np.linspace(0, 2 * np.pi, 13):
        M = globe_matrix(spin, 23.4)
        for cam in ((25.0, -40.0, 3.6), (18.0, -40.0, 4.2), (25.0, -10.0, 3.6)):
            pos = _cam_basis(cam)[0]
            for sgn in (1, -1):
                tex_pole = [globe_screen(cam, sgn * 90.0, lo, M=M) for lo in (-180, -90, 0, 90)]
                ax_hit = globe_screen(cam, 0, 0, M=M, world=[0, sgn, 0])
                worst = max(worst, max(float(np.hypot(*(p - ax_hit))) for p in tex_pole))
            # occlusion: sample the axis from −1.35 to 1.35; a sample is drawn iff no sphere hit lies between the eye and it
            for y in np.linspace(-1.35, 1.35, 109):
                q = M @ np.array([0.0, y, 0.0])
                d = q - pos; Lq = np.linalg.norm(d); d /= Lq
                bq = d @ pos; cq = pos @ pos - 1.0; disc = bq * bq - cq
                t_hit = -bq - np.sqrt(disc) if disc > 0 else np.inf
                drawn = t_hit >= Lq - 1e-9
                if drawn and abs(y) < 1.0:
                    leak += 1
    row("N14 texture poles vs axis–sphere intersections: max screen gap (px) ≤ 2", worst, 0.0, 2.0)
    row("N14 axis samples inside the sphere that a depth-tested render would draw", leak, 0, 0)
    # ---------------------------------------------------------------- N17 the merry-go-round (s26a-s27a)
    Wm = 0.5
    tm = np.round(np.arange(0, 3.7334, 1 / 30), 6)
    tp = call(FRM + "turntable_puck", "s26a", "merry.json", "ball launched across a turning disc (outside: straight)",
              t=tm.tolist(), x0=0.0, y0=-2.8, u0=0.0, v0=1.5, Omega=Wm, launch="inertial")
    xi, yi, xr, yr = (np.asarray(tp[k]) for k in ("x_inertial", "y_inertial", "x_rotating", "y_rotating"))
    u0R = np.array([0.0, 1.5]) - np.array([-Wm * -2.8, Wm * 0.0])        # v_I − Ω × r at the launch = (−1.4, 1.5)
    rp = call(FRM + "rotating_frame_path", "s27a", "merry.json", "the rider's equation integrated (Vallis (2.12) on a flat table)",
              t=tm.tolist(), x0=0.0, y0=-2.8, u0=float(u0R[0]), v0=float(u0R[1]), Omega=Wm, centrifugal=True)
    gap = float(np.max(np.hypot(np.asarray(rp["x"]) - xr, np.asarray(rp["y"]) - yr)))
    row("N17 launch in the rider's frame (−1.4, 1.5) m/s", u0R, [-1.4, 1.5], 1e-12)
    row("N17 rotating_frame_path vs turntable_puck: max gap < 1e-6 m", gap, 0.0, 1e-6)
    side = u0R[0] * (yr - (-2.8 + u0R[1] * tm)) - u0R[1] * (xr - (0.0 + u0R[0] * tm))
    truth("N17 rider's path right of its launch heading for t > 0 (k·(u0 × Δr) < 0)", bool(np.all(side[1:] < 0)))
    row("N17 outside path straight: x_inertial = 0", float(np.max(np.abs(xi))), 0.0, 1e-12)
    j = int(np.argmin(np.abs(tm - 1.2)))
    uR = np.array([rp["u"][j], rp["v"][j], 0.0]); rR = np.array([xr[j], yr[j], 0.0])
    vout = np.asarray(call("fluidpy.core.rotating.inertial_velocity", "s26b", "merry.json", "v_outside = u + Ω × r (rotating axes)",
                           U=[0.0, 0.0, 0.0], u_prime=uR.tolist(), Omega=[0, 0, Wm], x_prime=rR.tolist()))
    ang = Wm * tm[j]
    vin = np.array([vout[0] * np.cos(ang) - vout[1] * np.sin(ang), vout[0] * np.sin(ang) + vout[1] * np.cos(ang)])
    row("N17 u + Ω × r (turned back to the outside axes) = turntable U, V", vin, [tp["U"], tp["V"]], 1e-9)
    # carried arrow: an arrow fixed to the floor turns with it; its tip velocity = Ω × arrow
    ua = np.array([0.0, 1.0, 0.0]); base = np.array([1.2, -1.6, 0.0])
    tcarr = np.linspace(0, (np.pi / 3) / Wm, 61)
    E = [np.asarray(call("fluidpy.core.rotating.rotating_basis", "s26c", "merry.json", "floor axes carried round", Omega=[0, 0, Wm], t=float(t_))) for t_ in (0.0, 1e-4)]
    tipv = ((E[1].T @ ua) - (E[0].T @ ua)) / 1e-4
    row("N17 carried arrow: tip velocity (finite difference) = Ω × u", tipv, np.cross([0, 0, Wm], ua), 1e-4)
    ghosts = []
    for t_ in tcarr:
        Rb = np.asarray(R_basis([0, 0, Wm], float(t_)))
        ghosts.append([*(Rb.T @ base)[:2], *(Rb.T @ ua)[:2]])
    fo = np.asarray(call(VEC + "cross", "s26d", "merry.json", "floor velocity Ω × r at r = 1 and 1.5 m", a=[0, 0, Wm], b=[[1.0, 0, 0], [1.5, 0, 0]]))
    du = np.asarray(call(VEC + "cross", "s26d", "merry.json", "Ω × u for u = 0.5 m/s outward", a=[0, 0, Wm], b=[0.5, 0, 0]))
    row("N17 floor 0.5 → 0.75 m/s; change per second = Ω × u = (0, 0.25, 0)", [fo[0, 1], fo[1, 1], *(fo[1] - fo[0])], [0.5, 0.75, 0, 0.25, 0], 1e-12)
    row("N17 Ω × u equals the floor change", du, fo[1] - fo[0], 1e-12)
    ft = call("fluidpy.core.rotating.frame_acceleration_terms", "s27", "merry.json", "frame terms (kinematic: 2Ω × u, Ω × (Ω × r))",
              a_prime=[0.0, 0.0, 0.0], u_prime=[0.0, 1.0, 0.0], x_prime=[0.0, -2.5, 0.0], Omega=[0.0, 0.0, Wm])
    row("N17 2Ω × u = (−1, 0, 0); Ω × (Ω × r) = (0, 0.625, 0)", [*np.asarray(ft["coriolis"]), *np.asarray(ft["centripetal"])], [-1, 0, 0, 0, 0.625, 0], 1e-12)
    floor_rings = {str(rr_): r6(rr_ * Wm, 3) for rr_ in (1.0, 2.8)}
    files["merry.json"] = {"Omega": Wm, "radius": 3.0, "t": tm.tolist(), "inertial": r6(np.stack([xi, yi], -1), 5),
                           "rotating": r6(np.stack([xr, yr], -1), 5), "check_path": r6(np.stack([rp["x"], rp["y"]], -1), 5),
                           "max_gap_m": float(f"{gap:.3g}"), "u0_rider": r6(u0R), "two_views": {"j": j, "t": float(tm[j]), "u": r6(uR), "r": r6(rR),
                           "omega_x_r": r6(np.cross([0, 0, Wm], rR)), "v_outside": r6(vout)}, "carried": {"base": base.tolist(), "u": ua.tolist(),
                           "t": r6(tcarr, 4), "ghosts": r6(np.array(ghosts), 5), "tip_velocity": r6(tipv, 6)},
                           "new_ground": {"r_old": 1.0, "r_new": 1.5, "u": 0.5, "floor_old": r6(fo[0]), "floor_new": r6(fo[1]), "change": r6(du)},
                           "rings": floor_rings, "terms": {"coriolis_kin": r6(np.asarray(ft["coriolis"])), "centripetal": r6(np.asarray(ft["centripetal"]))}}
    # ---------------------------------------------------------------- N18 Ω split at 45°N; Ω × u; the flat part (s28a-s28c, s28_f)
    co = files["coriolis.json"]
    phi, lam = 45 * DEG, 0.5 * DEG
    e_ = [-np.sin(lam), np.cos(lam), 0.0]
    n_ = [-np.sin(phi) * np.cos(lam), -np.sin(phi) * np.sin(lam), np.cos(phi)]
    u_ = [np.cos(phi) * np.cos(lam), np.cos(phi) * np.sin(lam), np.sin(phi)]
    OmL = [float(call(VEC + "dot", "s28a", "coriolis.json", f"Ω · {nm} at 45°N 0.5°E", a=Om, b=v)) for nm, v in (("east", e_), ("north", n_), ("up", u_))]
    row("N18 Ω local (east, north, up) = (0, 5.156e-5, 5.156e-5)", OmL, [0, 5.1563e-5, 5.1563e-5], 1e-8)
    row("N18 display 7.29e-5 × cos 45° ≈ 5.16e-5", round(7.29e-5 * np.cos(phi), 7), 5.15e-5, 1.1e-7)
    Wsym, ph, uu, vv = sp.symbols("Omega phi u v")
    cs = sp.Matrix([0, Wsym * sp.cos(ph), Wsym * sp.sin(ph)]).cross(sp.Matrix([uu, vv, 0]))
    truth("N18 sympy Ω × u = (−Ω sin φ v, Ω sin φ u, −Ω cos φ u)",
          sp.simplify(cs - sp.Matrix([-Wsym * sp.sin(ph) * vv, Wsym * sp.sin(ph) * uu, -Wsym * sp.cos(ph) * uu])) == sp.zeros(3, 1))
    oxu = np.asarray(call(VEC + "cross", "s28b", "coriolis.json", "Ω × u at 45°N, u = (10, 0, 0)", a=OmL, b=[10.0, 0.0, 0.0]))
    row("N18 Ω × u = (0, 5.156e-4, −5.156e-4)", oxu, [0, 5.1563e-4, -5.1563e-4], 1e-8)
    full = np.asarray(call("fluidpy.core.rotating.coriolis_acceleration", "s28c", "coriolis.json", "−2Ω × u, 3-D", Omega=OmL, u=[10.0, 0.0, 0.0]))
    hor = np.asarray(call(FRM + "coriolis_horizontal", "s28c", "coriolis.json", "−f k × u (flat part)", u=10.0, v=0.0, lat=float(phi)))
    row("N18 coriolis_horizontal = flat part of −2Ω × u", hor, full[:2], 1e-12)
    ratio = G0 / abs(float(full[2]))
    row("N18 vertical part 1.03e-3 m/s²; g / vertical ≈ 9.5e3 (≈ 10 000 ×)", [abs(full[2]), round(ratio, -2)], [1.0313e-3, 9500], [2e-7, 100])
    kxu_s = np.asarray(V.k_cross([3.0, 4.0]))
    row("N18 k × u = (−v, u)", kxu_s, [-4.0, 3.0], 1e-12)
    flat = call(FRM + "coriolis_parameter", "s28_f", "coriolis.json", "f at 90°, 45°, 0°, −45°", lat=(np.array([90.0, 45.0, 0.0, -45.0]) * DEG).tolist())
    row("N18 f(90, 45, 0, −45) = 1.4584e-4, 1.0313e-4, 0, −1.0313e-4", flat, [1.4584e-4, 1.0313e-4, 0, -1.0313e-4], 1e-8)
    co.update({"omega_local": r6(OmL, 10), "omega_x_u_45N": r6(oxu, 10), "coriolis_3d_45N": r6(full, 10), "vertical_ratio": round(ratio),
               "f_by_lat": {"lat": [90, 45, 0, -45], "f": r6(flat, 10)}})
    # ---------------------------------------------------------------- N20 the round low (s39-s44)
    ge = files["geo.json"]
    hh = 5000.0
    xs = np.arange(-1800e3, 1800e3 + 1, hh)
    X, Y = np.meshgrid(xs, xs)
    prl = 99600.0 + 1e-3 * np.hypot(X, Y)                                  # Pa: 996 hPa + 1 hPa per 100 km
    g = call("fluidpy.core.operators.gradient", "s40", "geo.json", "∇p of the round low (5-km grid)", phi=prl.tolist(), h=hh)
    gx, gy = np.asarray(g)[0], np.asarray(g)[1]
    jp, ip = int(np.argmin(np.abs(xs + 1000e3))), int(np.argmin(np.abs(xs)))
    gp = np.array([gx[jp, ip], gy[jp, ip]])
    row("N20 isobars 1000/1004/1008/1012 hPa at r = 400/800/1200/1600 km", [(p - 99600) / 1e-3 / 1e3 for p in (100000, 100400, 100800, 101200)], [400, 800, 1200, 1600], 1e-9)
    row("N20 ∇p at the pin (0, −1000 km) = (0, −1e-3) Pa/m", gp, [0, -1e-3], 1e-9)
    kg = np.asarray(call(VEC + "k_cross", "s40a", "geo.json", "k × ∇p at the pin", u=gp.tolist()))
    row("N20 k × ∇p = (1e-3, 0) (east), ⟂ ∇p", [*kg, float(kg @ gp)], [1e-3, 0, 0], 1e-9)
    tang = np.array([1.0, 0.0])          # isobar tangent at a point due south of the centre
    row("N20 k × ∇p along the isobar tangent (|sin| of the angle)", abs(float((kg[0] * tang[1] - kg[1] * tang[0]) / np.linalg.norm(kg))), 0.0, 1e-9)
    ugeo = np.asarray(call("fluidpy.core.gfd.geostrophic_velocity", "s41a", "geo.json", "balanced wind at the pin", dpdx=0.0, dpdy=-1e-3, f=f45, rho0=1.2))
    cpush = np.array([f45 * ugeo[1], -f45 * ugeo[0]])                      # −f k × u
    ppush = -gp / 1.2
    row("N20 Coriolis push = −(pressure push) (0, ∓8.333e-4)", [*cpush, *ppush], [0, -8.3333e-4, 0, 8.3333e-4], 1e-8)
    row("N20 display −1.03e-4 × 8.1 ≈ −8.3e-4", round(1.03e-4 * 8.1, 5), 8.3e-4, 1e-6)
    ge["round_low"] = {"p0_hPa": 996, "hPa_per_100km": 1, "isobars_hPa": [1000, 1004, 1008, 1012], "isobar_r_km": [400, 800, 1200, 1600],
                       "window_km": 3600, "pin_km": [0, -1000], "gradp": r6(gp, 9), "k_cross_gradp": r6(kg, 9), "u_geo": r6(ugeo, 4),
                       "coriolis_push": r6(cpush, 9), "pressure_push": r6(ppush, 9)}


def R_basis(Om, t):
    from fluidpy.core.rotating import rotating_basis
    return rotating_basis(Omega=Om, t=t)


# ---------------------------------------------------------------------------------------------------------- main


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--part", choices=["all", "core"], default="all")
    args = ap.parse_args()
    DATA.mkdir(parents=True, exist_ok=True)
    rows: list[dict] = []
    entries: list[dict] = []
    heavy: list[dict] = []
    big_entries: list[dict] = []   # calls whose inputs are too big to replay from JSON (go to physics_heavy)
    files: dict[str, dict] = {}
    bins: dict[str, bytes] = {}
    pending: list[str] = []

    def row(name, val, ref, tol):
        v, r = np.asarray(val, dtype=float), np.asarray(ref, dtype=float)
        ok = bool(np.all(np.abs(v - r) <= tol))
        rows.append({"name": name, "value": r6(np.ravel(v)[:4]), "ref": r6(np.ravel(r)[:4]), "tol": tol, "pass": ok})
        return ok

    def truth(name, cond):
        rows.append({"name": name, "value": bool(cond), "ref": True, "tol": 0, "pass": bool(cond)})

    def call(fn: str, scene: str, data: str, eq: str, **params):
        mod, name = fn.rsplit(".", 1)
        out = getattr(importlib.import_module(mod), name)(**params)
        jp = {k: (np.asarray(v).tolist() if isinstance(v, np.ndarray) else v) for k, v in params.items()}
        if len(json.dumps(jp)) > 1_000_000:   # big input grid: keep the manifest < 10 MB; record hashes, not the grid
            big_entries.append({"fn": fn, "scene": scene, "data": f"data/{data}", "eq": eq,
                                "params": {k: (f"array {np.shape(v)}, sha256 {parity_hash(v)}" if np.ndim(v) else v)
                                           for k, v in params.items()},
                                "output_sha256": parity_hash(out)})
            return out
        entries.append({"fn": fn, "scene": scene, "data": f"data/{data}", "eq": eq, "params": jp, "sha256": parity_hash(out)})
        return out

    # ============================================================== pair.json (s01-s10, s15, s47): a = (5,1,0), b = (1,3,0)
    fp = "pair.json"
    axb = call(VEC + "cross", "s01,s07,s10,s11", fp, "Kundu (2.20) a×b (provenance only)", a=A3, b=B3)
    bxa = call(VEC + "cross", "s15", fp, "b×a = −a×b (Kundu §2.8 text)", a=B3, b=A3)
    ab = call(VEC + "dot", "s02", fp, "the last video: a·b", a=A2, b=B2)
    na = call(VEC + "norm", "s05,s08", fp, "|a|", a=A3)
    nb = call(VEC + "norm", "s05,s08", fp, "|b|", a=B3)
    th = call(VEC + "angle_between", "s08,s11", fp, "θ between a and b", a=A3, b=B3, degrees=True)
    area = call(VEC + "parallelogram_area", "s08,s09", fp, "|a×b| = |a||b| sin θ = area", a=A3, b=B3)
    sh = call(VEC + "scalar_projection", "s02,s09", fp, "shadow of a on b (the last video)", a=A2, b=B2)
    foot = call(VEC + "projection", "s02,s09", fp, "foot of the drop line", a=A2, b=B2)
    axb_a = call(VEC + "dot", "s10", fp, "(a×b)·a = 0", a=[0.0, 0.0, 14.0], b=A3)
    axb_b = call(VEC + "dot", "s10", fp, "(a×b)·b = 0", a=[0.0, 0.0, 14.0], b=B3)
    sin_t = float(np.sin(th * DEG))
    height = area / nb
    comp_terms = [[A3[1] * B3[2], A3[2] * B3[1]], [A3[2] * B3[0], A3[0] * B3[2]], [A3[0] * B3[1], A3[1] * B3[0]]]
    disp_sin = round(na, 3) * round(nb, 3) * round(sin_t, 3)
    disp_h = round(na, 3) * round(sin_t, 3)
    disp_area = round(nb, 3) * round(height, 2)
    row("N1 a×b = (0, 0, 14)", axb, [0, 0, 14], 1e-12)
    row("N1 a×b equals np.cross", axb, np.cross(A3, B3), 1e-12)
    row("N1 component terms 0−0, 0−0, 15−1", [t[0] - t[1] for t in comp_terms], axb, 1e-12)
    row("b×a = (0, 0, −14)", bxa, [0, 0, -14], 1e-12)
    row("a·b = 8 (last video)", ab, 8.0, 1e-12)
    row("|a| = √26 ≈ 5.099", na, 5.099, 5e-4)
    row("|b| = √10 ≈ 3.162", nb, 3.162, 5e-4)
    row("θ ≈ 60.3°", th, 60.3, 0.05)
    row("sin θ ≈ 0.868", sin_t, 0.868, 5e-4)
    row("area = |a×b| = 14", area, 14.0, 1e-12)
    row("N2 display 5.099×3.162×0.868 ≈ 13.995 (≈ 14, not = 14.000)", [abs(disp_sin - 14) < 0.01, round(disp_sin, 3) != 14.0], [1, 1], 0)
    row("N3 height = 14/|b| ≈ 4.4272", height, 14 / np.sqrt(10), 1e-9)
    row("N3 display 5.099×0.868 ≈ 4.43", round(disp_h, 2), 4.43, 1e-9)
    row("N3 display 3.162×4.43 ≈ 14", abs(disp_area - 14) < 0.05, 1, 0)
    row("shadow of a on b = 2.530", sh, 2.53, 5e-4)
    row("foot (0.8, 2.4)", foot, [0.8, 2.4], 1e-12)
    row("(a×b)·a = 0, (a×b)·b = 0", [axb_a, axb_b], [0, 0], 1e-12)
    files[fp] = {"a3": A3, "b3": B3, "a": A2, "b": B2, "a_dot_b": r6(ab), "shadow_a_on_b": r6(sh), "foot": r6(foot),
                 "norm_a": r6(na), "norm_b": r6(nb), "theta_deg": r6(th), "sin_theta": r6(sin_t),
                 "cos_theta": r6(np.cos(th * DEG)), "a_cross_b": r6(axb), "b_cross_a": r6(bxa),
                 "component_terms": comp_terms, "display_sin_factors": [round(na, 3), round(nb, 3), round(sin_t, 3)],
                 "display_sin_product": r6(disp_sin), "area": r6(area), "height": r6(height),
                 "display_height_product": r6(disp_h), "display_area_product": r6(disp_area),
                 "corners": [[0, 0], A2, [A2[0] + B2[0], A2[1] + B2[1]], B2],
                 "axb_dot_a": r6(axb_a), "axb_dot_b": r6(axb_b), "display_scale": 0.25}

    # ============================================================== sweep.json (s00, s18): p = (3,0,0), q = 2(cos θ, sin θ, 0)
    fs = "sweep.json"
    ths = np.arange(0.0, 360.0 + 1e-9, 2.0)
    qs = 2.0 * np.stack([np.cos(ths * DEG), np.sin(ths * DEG), 0 * ths], axis=-1)
    pxq = call(VEC + "cross", "s00,s18", fs, "p×q along the sweep", a=P3, b=qs.tolist())
    par = call(VEC + "parallelogram_area", "s00,s18", fs, "|p×q| = parallelogram area", a=P3, b=qs.tolist())
    row("sweep p×q z = 6 sin θ", pxq[:, 2], 6 * np.sin(ths * DEG), 1e-12)
    row("sweep p×q z at 0°, 90°, 180°, 270°", pxq[[0, 45, 90, 135], 2], [0, 6, 0, -6], 1e-12)
    row("sweep area = |p×q|", par, np.abs(pxq[:, 2]), 1e-12)
    files[fs] = {"p": P3, "theta_deg": r6(ths), "q_xyz": r6(qs), "pxq_z": r6(pxq[:, 2]), "area": r6(par)}

    # ============================================================== door.json (s03, s04, s22)
    fd = "door.json"
    r_door = [0.9, 0.0, 0.0]
    F_list = [[0.0, 1.0, 0.0], [-1.0, 0.0, 0.0], [0.0, -1.0, 0.0]]
    d_door = call(VEC + "dot", "s03", fd, "r·F (perpendicular, along, other side)", a=r_door, b=F_list)
    c_door = call(VEC + "cross", "s22", fd, "τ = r×F along the hinge", a=r_door, b=F_list)
    u_lr = [0.0, 3.0]
    pushes = [[1.0, 0.0], [-1.0, 0.0]]
    d_lr = call(VEC + "dot", "s04", fd, "u·push (east, west) = 0, 0", a=u_lr, b=pushes)
    c_lr = call(VEC + "cross", "s04", fd, "u×push tells east from west", a=u_lr, b=pushes)
    row("door r·F: 0 (right angle), −0.9 (along), 0", d_door, [0, -0.9, 0], 1e-12)
    row("door τ_z: +0.9, 0, −0.9", c_door[:, 2], [0.9, 0, -0.9], 1e-12)
    row("left/right: both dot products 0", d_lr, [0, 0], 1e-12)
    row("left/right: cross products −3 (east), +3 (west)", c_lr[:, 2], [-3, 3], 1e-12)
    files[fd] = {"r": r_door, "F": F_list, "dot": r6(d_door), "tau_z": r6(c_door[:, 2]),
                 "left_right": {"u": u_lr, "pushes": pushes, "dots": r6(d_lr), "cross_z": r6(c_lr[:, 2])}}

    # ============================================================== rhr.json (s11-s17): hand bases, axis products, views
    fr = "rhr.json"
    ex, ey, ez = [1.0, 0, 0], [0, 1.0, 0], [0, 0, 1.0]
    ahat, bhat = np.array(A3) / na, np.array(B3) / nb

    def basis(first, second, scene):
        t = call(VEC + "cross", scene, fr, "thumb = first × second (direction)", a=list(map(float, first)), b=list(map(float, second)))
        t = np.asarray(t) / np.linalg.norm(t)
        f = np.asarray(first, float) / np.linalg.norm(first)
        n = np.asarray(V.cross(t, f))
        det = call(VEC + "triple_scalar", scene, fr, "det[fingers, palm, thumb] = +1 (right hand)", a=f.tolist(), b=n.tolist(), c=t.tolist())
        return {"fingers": r6(f), "thumb": r6(t), "palm": r6(n), "second": r6(np.asarray(second) / np.linalg.norm(second)),
                "det": r6(det)}

    beats = {"s11": basis(ahat, bhat, "s11"), "s12": basis(ahat, bhat, "s12"), "s21": basis([1.0, 0, 0], [0, -1.0, 0], "s21"),
             "s24": basis([1.0, 0, 0], [0, 1.0, 0], "s24")}
    pairs = {"xy": (ex, ey), "yz": (ey, ez), "zx": (ez, ex), "yx": (ey, ex), "zy": (ez, ey), "xz": (ex, ez)}
    axes_res = {}
    for k, (p, q) in pairs.items():
        axes_res[k] = r6(call(VEC + "cross", "s14,s15,s16", fr, f"{k[0]}̂×{k[1]}̂", a=p, b=q))
        beats[k] = basis(p, q, "s14,s15")
    for k, b in beats.items():
        row(f"hand basis {k}: det = +1 (right hand, never mirrored)", b["det"], 1.0, 1e-12)
        row(f"hand basis {k}: palm turns towards the second arrow", np.dot(b["palm"], b["second"]) > 0, 1, 0)
    row("x̂×ŷ = ẑ, ŷ×ẑ = x̂, ẑ×x̂ = ŷ", [axes_res["xy"], axes_res["yz"], axes_res["zx"]], [ez, ex, ey], 1e-12)
    row("ŷ×x̂ = −ẑ, ẑ×ŷ = −x̂, x̂×ẑ = −ŷ", [axes_res["yx"], axes_res["zy"], axes_res["xz"]],
        [[0, 0, -1], [-1, 0, 0], [0, -1, 0]], 1e-12)
    # s16 front view: right = +x, up = +y, out of the screen = +z
    names = {(1, 0, 0): "right", (-1, 0, 0): "left", (0, 1, 0): "up", (0, -1, 0): "down", (0, 0, 1): "out", (0, 0, -1): "in"}
    screen_map = {k: names[tuple(int(round(c)) for c in axes_res[k])] for k in ["xy", "yx", "yz", "zy", "zx", "xz"]}
    row("s16 screen map out, in, right, left, up, down",
        [["out", "in", "right", "left", "up", "down"][i] == screen_map[k] for i, k in enumerate(["xy", "yx", "yz", "zy", "zx", "xz"])],
        [1] * 6, 0)
    view_dirs = {"above": [0.0, 0.0, -1.0], "below": [0.0, 0.0, 1.0], "side": [-0.94, -0.34, 0.0]}
    views = {k: r6(call(VEC + "dot", "s17", fr, "(a×b)·(−view dir): towards (+) or away (−)", a=list(map(float, axb)),
                        b=[-c for c in d])) for k, d in view_dirs.items()}
    row("s17 view signs +14 / −14 / 0", [views["above"], views["below"], views["side"]], [14, -14, 0], 1e-12)
    # s13 helix: r(t) = (R cos t, R sin t, p t/2π) is right-handed (anticlockwise from above and rising)
    tt = np.linspace(0, 2 * np.pi, 9)
    rr = np.stack([0.5 * np.cos(tt), 0.5 * np.sin(tt), 0 * tt], -1)
    rp = np.stack([-0.5 * np.sin(tt), 0.5 * np.cos(tt), 0 * tt], -1)
    hel = call(VEC + "triple_scalar", "s13", fr, "(r×r')·z > 0: right-handed thread", a=rr.tolist(), b=rp.tolist(), c=[0.0, 0.0, 1.0])
    truth("s13 helix right-handed at every sample ((r×r')·z = R² > 0)", np.all(np.asarray(hel) > 0))
    files[fr] = {"beats": beats, "axes_pairs": axes_res, "screen_map": screen_map, "views": views,
                 "theta_deg": r6(th), "cap": {"pitch_display": 0.32, "pitch_note": "lift per turn drawn ×4 a real cap thread (0.08 → 0.32 display units)",
                                             "sense": "+ angle = anticlockwise from above = rising (right-handed)"},
                 "helix_check": r6(hel)}

    # ============================================================== cases.json (s18)
    fc = "cases.json"
    pq = call(VEC + "cross", "s18", fc, "p×q, four cases", a=P3, b=Q_CASES)
    pa = call(VEC + "parallelogram_area", "s18", fc, "area of p, q", a=P3, b=Q_CASES)
    row("s18 p×q z: 0, 6, 0, −6", pq[:, 2], [0, 6, 0, -6], 1e-12)
    row("s18 areas 0, 6, 0, 6", pa, [0, 6, 0, 6], 1e-12)
    files[fc] = {"p": P3, "q": Q_CASES, "p_cross_q": r6(pq), "area": r6(pa)}

    # ============================================================== torque.json (s20, s21)
    ft = "torque.json"
    rt = [0.3, 0.0, 0.0]
    alph = [90.0, 30.0, 0.0]
    Fs = [[50 * np.cos(a * DEG), 50 * np.sin(a * DEG), 0.0] for a in alph]
    tau = call(VEC + "cross", "s20", ft, "τ = r×F (school definition of torque)", a=rt, b=Fs)
    tmag = call(VEC + "parallelogram_area", "s20", ft, "|τ| = |r||F| sin α", a=rt, b=Fs)
    tight = call(VEC + "cross", "s21", ft, "tighten / loosen", a=rt, b=[[0.0, -50.0, 0.0], [0.0, 50.0, 0.0]])
    row("τ_z = 15, 7.5, 0 N m", tau[:, 2], [15, 7.5, 0], 1e-9)
    row("|τ| = 15, 7.5, 0", tmag, [15, 7.5, 0], 1e-9)
    row("tighten τ = (0,0,−15), loosen (0,0,+15)", tight[:, 2], [-15, 15], 1e-12)
    files[ft] = {"r": rt, "alpha_deg": alph, "F": r6(Fs), "tau_z": r6(tau[:, 2]), "tau_mag": r6(tmag),
                 "tighten": r6(tight[0]), "loosen": r6(tight[1])}

    # ============================================================== turning.json (s23)
    fk = "turning.json"
    us = [[5.0, 0.0], [0.0, 5.0]]
    kxu = call(VEC + "k_cross", "s23", fk, "k×u: a quarter turn left (Vallis (2.79) k×u)", u=us)
    kxu3 = call(VEC + "cross", "s23", fk, "the same with k = (0,0,1)", a=[0.0, 0.0, 1.0], b=us)
    row("k×(5,0) = (0,5); k×(0,5) = (−5,0)", kxu, [[0, 5], [-5, 0]], 1e-12)
    row("k_cross equals cross((0,0,1), u)", kxu, kxu3[:, :2], 1e-12)
    row("|k×u| = |u| = 5", np.linalg.norm(kxu, axis=1), [5, 5], 1e-12)
    files[fk] = {"u": us, "k_cross_u": r6(kxu), "minus_k_cross_u": r6(-np.asarray(kxu)),
                 "terms": "k×u = (0×0 − 1×0, 1×5 − 0×0, 0×0 − 0×5) for u = (5, 0, 0)"}

    # ============================================================== earth.json (s24, s25)
    fe = "earth.json"
    lats = [0.0, 45.0, 90.0]
    rs = [[EARTH_RADIUS * np.cos(l * DEG), 0.0, EARTH_RADIUS * np.sin(l * DEG)] for l in lats]
    Om = [0.0, 0.0, OMEGA]
    vgr = call(VEC + "cross", "s25", fe, "v = Ω×r (Vallis (2.7) Ω×r term)", a=Om, b=rs)
    spd = np.linalg.norm(vgr, axis=1)
    row("Ω = 2π / 86 164.1 s = 7.2921e-5 rad/s", [OMEGA, 2 * np.pi / 86164.1], [7.292115e-5, 7.292115e-5], 1e-8)
    row("|Ω×r| = 464.58, 328.51, 0 m/s", spd, [464.58, 328.51, 0.0], 0.01)
    row("465 × cos 45° ≈ 329 m/s (display)", round(465 * np.cos(45 * DEG)), 329, 0)
    files[fe] = {"Omega": OMEGA, "sidereal_day_s": SIDEREAL_DAY, "a_m": EARTH_RADIUS, "lat_deg": lats, "ground_speed": r6(spd, 2),
                 "display": {"Omega": "7.29e-5", "speed_eq": 465, "speed_45": 329}}

    # ============================================================== coriolis.json (s27-s30)
    fo = "coriolis.json"
    om45 = [0.0, OMEGA * np.cos(45 * DEG), OMEGA * np.sin(45 * DEG)]
    acc45 = call("fluidpy.core.rotating.coriolis_acceleration", "s27", fo, "−2Ω×u (Vallis (2.12) term)", Omega=om45, u=[10.0, 0.0, 0.0])
    dotu = call(VEC + "dot", "s27", fo, "(−2Ω×u)·u = 0", a=np.asarray(acc45).tolist(), b=[10.0, 0.0, 0.0])
    row("(−2Ω×u)·u = 0 (no work)", dotu, 0.0, 1e-15)
    lat3 = [45.0, 0.0, -45.0]
    fl = call(FRM + "coriolis_parameter", "s28", fo, "f = 2Ω sin φ (Vallis (2.80))", lat=(np.asarray(lat3) * DEG).tolist())
    # Ω·k with k = (cos φ, 0, sin φ) in Earth-centred axes (λ = 0)
    shad = [call(VEC + "dot", "s28", fo, "Ω·k = Ω sin φ (dot product again)", a=Om, b=[np.cos(l * DEG), 0.0, np.sin(l * DEG)]) for l in lat3]
    row("f(45°, 0°, −45°) = 1.0313e-4, 0, −1.0313e-4", fl, [1.0313e-4, 0, -1.0313e-4], 1e-8)
    row("Ω·k = Ω sin φ", shad, [OMEGA * np.sin(l * DEG) for l in lat3], 1e-18)
    row("f = 2 Ω·k", fl, 2 * np.asarray(shad), 1e-18)
    tr = call(FRM + "coriolis_horizontal", "s29", fo, "−f k×u (Vallis (2.79)) at 45°N, 0°, 45°S", u=10.0, v=0.0, lat=(np.asarray(lat3) * DEG).tolist())
    tr = np.stack(tr, -1)
    row("turn rule: (0, −1.031e-3) right, 0, (0, +1.031e-3) left", tr, [[0, -1.0313e-3], [0, 0], [0, 1.0313e-3]], 2e-7)
    ic = call(FRM + "inertial_circle", "s30,s31", fo, "inertial circle radius U/f, period 2π/f (Vallis §2.9.2)", U=10.0, f=float(fl[0]))
    row("inertial period 16.92 h", ic["period"] / 3600, 16.92, 0.01)
    row("radius 96.97 km; diameter ≈ 193.9 km", ic["radius"] / 1e3, 96.97, 0.01)
    row("|−f k×u| = 1.0313e-3 m/s²", np.hypot(*tr[0]), 1.0313e-3, 2e-7)
    # s30: the f-plane inertial circle drawn from ONE integration (path, velocity and push all from the same solution)
    t30 = np.linspace(0.0, ic["period"], 241)
    io = call(FRM + "inertial_oscillation", "s30", "inertial30.json", "Vallis (3.126)-(3.127): free parcel on the f-plane, u0 = 10 m/s east at 45°N",
              t=t30.tolist(), u0=10.0, v0=0.0, f=float(fl[0]))
    x30, y30, u30, v30 = (np.asarray(io[k]) for k in ("x", "y", "u", "v"))
    ax30, ay30 = float(fl[0]) * v30, -float(fl[0]) * u30          # −f k×u = (f v, −f u)
    row("s30 circle centre = start + (0, −U/f)", [io["xc"], io["yc"]], [0.0, -10.0 / float(fl[0])], 1e-6)
    for j in (0, 60, 120, 180):                                    # 0, ¼, ½, ¾ period
        tx, ty = np.gradient(x30, t30)[j], np.gradient(y30, t30)[j]
        row(f"s30 t={t30[j] / 3600:.1f} h: u tangent to the trace (u·t̂ = |u|)", (u30[j] * tx + v30[j] * ty) / np.hypot(tx, ty), 10.0, 1e-2)
        cx_, cy_ = io["xc"] - x30[j], io["yc"] - y30[j]
        row(f"s30 t={t30[j] / 3600:.1f} h: push points to the centre (cos = 1)", (ax30[j] * cx_ + ay30[j] * cy_) / (np.hypot(ax30[j], ay30[j]) * np.hypot(cx_, cy_)), 1.0, 1e-9)
    files["inertial30.json"] = {"t_h": r6(t30 / 3600, 4), "x_km": r6(x30 / 1e3, 3), "y_km": r6(y30 / 1e3, 3), "u": r6(u30, 5), "v": r6(v30, 5),
                                "ax": r6(ax30, 9), "ay": r6(ay30, 9), "centre_km": [r6(io["xc"] / 1e3, 3), r6(io["yc"] / 1e3, 3)],
                                "radius_km": r6(ic["radius"] / 1e3, 3)}
    files[fo] = {"Omega_45N": r6(om45, 10), "accel_45N": r6(acc45, 9), "dot_with_u": r6(dotu, 12),
                 "lat_deg": lat3, "f": r6(fl, 9), "shadow": r6(shad, 10), "turn_rule": r6(tr, 9),
                 "size_45N": {"U": 10.0, "f": r6(fl[0], 9), "accel": r6(np.hypot(*tr[0]), 9), "period_h": r6(ic["period"] / 3600, 3),
                              "radius_km": r6(ic["radius"] / 1e3, 3), "sense": ic["sense"]}}

    # ============================================================== paths.json (s00, s26, s31)
    fpth = "paths.json"

    def track(lat0, lon0, hours, scene):
        t = np.arange(0, hours * 3600 + 1, 60.0)
        lo, la, u, v = call(FRM + "inertial_oscillation_sphere", scene, fpth, "Vallis (2.50a,b) with ∇p = 0 on the sphere (RK4, dt 60 s)",
                            lat0=lat0 * DEG, lon0=lon0 * DEG, u0=10.0, v0=0.0, t=t.tolist(), dt=60.0)
        return t, np.degrees(la), np.degrees(lo), np.asarray(u), np.asarray(v)

    # v4 (UV2-25, N16): the starts move over land: SW France (Dordogne) and Patagonia (Chubut)
    NS0, SS0 = (45.0, 0.5), (-45.0, -69.5)
    t17, nla, nlo, nu, nv = track(*NS0, 17, "s00,s31")
    _, sla, slo, su, sv = track(*SS0, 17, "s31")
    t6, n6la, n6lo, *_ = track(*NS0, 6, "s26")
    _, s6la, s6lo, *_ = track(*SS0, 6, "s26")
    gn = call(FRM + "great_circle", "s26", fpth, "f = 0 ghost (great circle)", lat0=NS0[0] * DEG, lon0=NS0[1] * DEG, u0=10.0, v0=0.0, t=t6.tolist())
    gs = call(FRM + "great_circle", "s26", fpth, "f = 0 ghost (great circle)", lat0=SS0[0] * DEG, lon0=SS0[1] * DEG, u0=10.0, v0=0.0, t=t6.tolist())
    # loop diameters (km) on the local plane
    ex_n, ny_n = enu_offsets_km(nla, nlo, *NS0)
    ex_s, ny_s = enu_offsets_km(sla, slo, *SS0)
    dn, ds_ = float(np.ptp(ny_n)), float(np.ptp(ny_s))
    row("NH track turns right first (v < 0 after 1 h)", nv[60] < 0, 1, 0)
    row("SH track turns left first (v > 0 after 1 h)", sv[60] > 0, 1, 0)
    row("N16 first-hour Δlat −0.0603° (N) / +0.0603° (S)", [nla[60] - NS0[0], sla[60] - SS0[0]], [-0.0603, 0.0603], 5e-4)
    try:
        lm = land_mask(np.concatenate([nlo, slo]), np.concatenate([nla, sla]))
        truth("N16 every 17-h track point over land (NE 50m land polygons)", bool(np.all(lm)))
    except Exception as e:  # noqa: BLE001
        pending.append(f"N16 land check not run ({e})")
    # screen-space turning sense through the s31 cameras (globe camera above the loop centre, north up)
    for nm, la_, lo_, want in (("N", nla, nlo, "clockwise"), ("S", sla, slo, "anticlockwise")):
        cam = (0.5 * (la_.max() + la_.min()), 0.5 * (lo_.max() + lo_.min()), 1.105)
        P2 = np.array([globe_screen(cam, a, b) for a, b in zip(la_[:121], lo_[:121])])
        d = np.diff(P2, axis=0)
        turn = float(np.sum(d[:-1, 0] * d[1:, 1] - d[:-1, 1] * d[1:, 0]))   # screen y down: > 0 = clockwise on screen
        truth(f"N16 s31 view {nm}: first 2 h turn {want} on screen (signed {turn:+.3g})", (turn > 0) == (want == "clockwise"))
    row("loop diameter (north-south extent) ≈ 193.9 km within 5 %", [abs(dn / 193.9 - 1) < 0.05, abs(ds_ / 193.9 - 1) < 0.05], [1, 1], 0)
    row("speed conserved 10 m/s", np.hypot(nu, nv), 10.0, 1e-6)
    sub = slice(None, None, 2)  # 2-min samples for the composition
    files[fpth] = {"t_h": r6(t17[sub] / 3600, 4), "nh_track": r6(np.stack([nla[sub], nlo[sub]], -1), 5),
                   "sh_track": r6(np.stack([sla[sub], slo[sub]], -1), 5),
                   "nh_start": list(NS0), "sh_start": list(SS0),
                   "t6_h": r6(t6[sub] / 3600, 4), "nh_track_6h": r6(np.stack([n6la[sub], n6lo[sub]], -1), 5),
                   "sh_track_6h": r6(np.stack([s6la[sub], s6lo[sub]], -1), 5),
                   "ghost_nh": r6(np.stack([np.degrees(gn[1])[sub], np.degrees(gn[0])[sub]], -1), 5),
                   "ghost_sh": r6(np.stack([np.degrees(gs[1])[sub], np.degrees(gs[0])[sub]], -1), 5),
                   "loop_diameter_km": [round(dn, 1), round(ds_, 1)], "inertial_diameter_km": r6(2 * ic["radius"] / 1e3, 1),
                   "nh_offsets_km": r6(np.stack([ex_n[sub], ny_n[sub]], -1), 2), "sh_offsets_km": r6(np.stack([ex_s[sub], ny_s[sub]], -1), 2)}

    # ============================================================== geo.json (s39-s44)
    fg = "geo.json"
    h = 5000.0
    xk = np.arange(0, 1200e3 + 1, h)
    yk = np.arange(0, 600e3 + 1, h)
    Y = np.meshgrid(xk, yk)[1]
    p = 101000.0 - 1.0e-3 * Y        # Pa: 1010 hPa at the south edge, 1 hPa per 100 km lower northwards
    grad = call("fluidpy.core.operators.gradient", "s39,s40", fg, "∇p on the 5-km strip grid (Kundu §2.9)", phi=p.tolist(), h=h)
    gx, gy = np.asarray(grad)[0], np.asarray(grad)[1]   # fluidpy order: component 0 = ∂/∂x (columns), 1 = ∂/∂y (rows)
    row("∇p = (0, −1.00e-3) Pa/m everywhere", [float(np.max(np.abs(gx))), float(np.mean(gy))], [0, -1e-3], 1e-12)
    rho = 1.2
    f45 = float(fl[0])
    push = [0.0, 1e-3 / rho]
    t34 = np.arange(0, 34 * 3600 + 1, 60.0)
    G = (0.0 + 1j * float(np.mean(gy))) / rho
    Vc = np.asarray(GFD.parcel_adjust(t34, G, f45))   # complex G: recorded in physics_heavy (JSON has no complex)
    heavy.append({"fn": "fluidpy.core.gfd.parcel_adjust", "scene": "s41", "eq": "frictionless adjustment (ours: (13.9a,b), uniform G)",
                  "params": {"t": "0..34 h, 60 s", "G": [G.real, G.imag], "f": f45, "r": 0.0, "V0": 0},
                  "output_sha256": parity_hash(np.stack([Vc.real, Vc.imag]))})
    # path: cumulative trapezoid of the velocity [km]
    dx = np.concatenate([[0], np.cumsum(0.5 * (Vc.real[1:] + Vc.real[:-1]) * 60.0)]) / 1e3
    dy = np.concatenate([[0], np.cumsum(0.5 * (Vc.imag[1:] + Vc.imag[:-1]) * 60.0)]) / 1e3
    ug = call("fluidpy.core.gfd.geostrophic_velocity", "s41,s43,s44", fg, "geostrophic wind (Vallis (2.197) components)",
              dpdx=0.0, dpdy=[-1.0e-3, -2.0e-3], f=f45, rho0=rho)
    ugs = np.asarray(ug[0])
    Tf = 2 * np.pi / f45
    nper = t34 <= 2 * Tf
    mean_u = np.trapezoid(Vc.real[nper], t34[nper]) / t34[nper][-1]
    row("parcel_adjust mean u over 2 periods = 8.08 m/s (1 %)", mean_u / 8.0807, 1.0, 0.01)
    row("geostrophic u = 8.08, 16.16 m/s", ugs, [8.0807, 16.161], 1e-3)
    row("loop radius 8.08/f = 78.3 km", ugs[0] / f45 / 1e3, 78.35, 0.05)
    row("adjust: speed max ≈ 2 × geostrophic", np.max(np.abs(Vc)) / ugs[0], 2.0, 0.01)
    kk = call(VEC + "k_cross", "s42", fg, "k×(k×u) = −u", u=np.asarray(V.k_cross([3.0, 4.0])).tolist())
    row("k×(k×u) = −u for u = (3, 4)", kk, [-3, -4], 1e-12)
    form = (1 / (f45 * rho)) * np.asarray(V.k_cross([0.0, -1e-3]))
    row("(1/(fρ)) k×∇p = geostrophic_velocity", form, [ugs[0], 0.0], 1e-12)
    frho = f45 * rho
    row("fρ = 1.2375e-4", frho, 1.2375e-4, 1e-8)
    row("display 1.00e-3/1.24e-4 = 8.06 (≈ 8.1)", round(1e-3 / 1.24e-4, 2), 8.06, 1e-9)
    sub = slice(None, None, 2)
    files[fg] = {"lut_dense_r": lut_hex("cmocean.dense", 64)[::-1], "lut_note": "cmocean dense reversed (assets/luts.json): light = high pressure",
                 "map_km": [1200, 600], "isobars_km": [0, 200, 400, 600], "isobar_hPa": [1010, 1008, 1006, 1004],
                 "gradp_Pa_m": [0.0, r6(np.mean(gy), 9)], "rho": rho, "push_m_s2": r6(push, 9), "f": r6(f45, 9),
                 "adjust_t_h": r6(t34[sub] / 3600, 4), "adjust_xy_km": r6(np.stack([150 + dx[sub], 300 + dy[sub]], -1), 3),
                 "adjust_uv": r6(np.stack([Vc.real[sub], Vc.imag[sub]], -1), 4), "geo_speed": r6(ugs[0], 4),
                 "loop_radius_km": r6(ugs[0] / f45 / 1e3, 2), "pieces_u": r6(ugs, 4), "kxkxu_check": r6(kk),
                 "worked": {"gradp": 1.0e-3, "f": r6(f45, 9), "rho": rho, "f_rho": r6(frho, 9), "u": r6(ugs[0], 4),
                            "display_quotient": round(1e-3 / 1.24e-4, 2)}}

    v4_parts(row, truth, call, files, pending, f45)

    if args.part == "all":
        real_parts(row, truth, call, entries, heavy, files, bins, pending)

    for r in rows:
        print(f"  {'PASS' if r['pass'] else 'FAIL'}  {r['name']}")
    if not all(r["pass"] for r in rows):
        print("build_ch00_cross_product_why: checks FAILED — no data written")
        return 1

    data_hashes = {}
    for name, obj in files.items():
        blob = json.dumps(obj, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
        (DATA / name).write_bytes(blob)
        data_hashes[name] = hashlib.sha256(blob).hexdigest()
    for name, blob in bins.items():
        (DATA / name).write_bytes(blob)
        data_hashes[name] = hashlib.sha256(blob).hexdigest()
    old = {}
    mpath = OUT / "manifest.json"
    if mpath.exists():
        old = json.loads(mpath.read_text(encoding="utf-8"))
        if args.part == "core":   # keep the real-data records of the last full run
            for k, v in (old.get("data_files") or {}).items():
                if k not in data_hashes and (DATA / k).exists():
                    data_hashes[k] = v
            heavy = old.get("physics_heavy", [])
            entries += [e for e in old.get("physics", []) if e.get("real")]
            rows += [r for r in old.get("checks", []) if r.get("real")]
    sb_credits = [
        "Contains modified Copernicus Climate Change Service information 2026 (ERA5 via ARCO-ERA5; Ian, Idai, Ciarán).",
        "NCEP/NCAR Reanalysis 1 data provided by the NOAA PSL, Boulder, Colorado, USA (long-term mean 1991-2020).",
        "Blue Marble: Next Generation, NASA Earth Observatory (Reto Stöckli, NASA GSFC).",
        "Made with Natural Earth (public domain).",
        "NOAA GOES-16 ABI imagery (public domain), NOAA Open Data Dissemination on AWS.",
        "Imagery from the NASA Worldview application, part of NASA ESDIS (VIIRS Corrected Reflectance, NASA LANCE).",
        "Derived from NOAA HRRR analyses (public domain), via the University of Utah HRRR-zarr archive on AWS.",
        "IBTrACS v04r01 best tracks (Knapp et al. 2010), NOAA NCEI (public domain).",
        "Music: 'rotation-turning' (B-flat major, 6/8), seed 3, tools/sound/styles.py, our own procedural score (CC0-1.0); no sound effects (movies/ch00/ch00_cross_product_why/sound.yaml).",
    ]
    manifest = {
        "id": "ch00_cross_product_why", "storyboard": "movies/ch00/ch00_cross_product_why/storyboard.yaml",
        "builder": "movies/data/build_ch00_cross_product_why.py",
        "fluidpy": {"repo": "../Fluid Dynamics", **git_sha(FLUID, {
            "vectors_py": "fluidpy/geo/vectors.py", "frames_py": "fluidpy/geo/frames.py", "atmos_py": "fluidpy/geo/atmos.py",
            "gfd_py": "fluidpy/core/gfd.py", "operators_py": "fluidpy/core/operators.py", "rotating_py": "fluidpy/core/rotating.py",
            "trajectories_py": "fluidpy/diag/trajectories.py", "cyclone_py": "fluidpy/diag/cyclone.py"})},
        "equations_note": "provenance only (QA/reviewer); the movie draws no equation labels or numbers (HOUSE_STYLE §5)",
        "equations": {"cross_components": "Kundu (2.20): (u2v3 − u3v2, u3v1 − u1v3, u1v2 − u2v1) (s06, s07)",
                      "cross_magnitude": "|a×b| = |a||b| sin θ, Kundu §2.8 unnumbered (s08, s09)",
                      "antisymmetry": "a×b = −b×a, Kundu §2.8 text (s15)",
                      "omega_cross_r": "Vallis (2.7) v_I = v_R + Ω×r (s25)", "coriolis": "Vallis (2.12) −2Ω×v_R (s27)",
                      "f": "Vallis (2.80) f = 2Ω sin ϑ (s28; the movie writes φ)", "f_k_cross_u": "Vallis (2.79) f₀×u = f₀ k×u (s23, s29)",
                      "geostrophic": "Vallis (2.195) f×u ≈ −∇p/ρ; components (2.197) (s42-s46)",
                      "inertial": "Vallis §2.9.2 after (2.234), §3.8.2 (3.126) (s30, s31)"},
        "parameters": {"a": A3, "b": B3, "p": P3, "q_cases": Q_CASES, "door_r": r_door, "torque_r_m": rt, "torque_F_N": 50,
                       "wind_s23_m_s": 5, "wind_s30_m_s": 10, "lat_s28_deg": lat3, "rho_kg_m3": rho,
                       "strip_map": "p = 1010 hPa − 1 hPa per 100 km northwards, 1200 × 600 km, 5-km grid",
                       "display_scale_cross": 0.25,
                       "time_compression": {"s00": "17 h of turning in ≈ 4 s", "s24": "one globe turn in 20 s of film",
                                            "s30": "17 h in a few seconds", "s31": "17 h in ≈ 8 s", "s41": "34 h in ≈ 20 s",
                                            "s32-s37": "streaklines ≈ 2 h of flow per frame (global), ≈ 2 min per frame (storms)"},
                       "exaggerations": ["a×b and p×q drawn at 0.25 of their length", "cap lift per turn ×4", "bolt travel ×3",
                                         "s26 tracks drawn 5× wider", "storm columns, Ω, k, τ and Coriolis arrows on display scales"]},
        "credits": sb_credits,
        "js_selftest": "none — the composition has no JS physics; every number is read from data/*.json",
        "pending": pending,
        "data_files": data_hashes, "checks": rows, "physics": entries,
        "physics_heavy": [h for h in heavy if (h.get("fn"), h.get("scene"), h.get("eq")) not in
                          {(b["fn"], b["scene"], b["eq"]) for b in big_entries}] + big_entries,
    }
    mpath.write_text(json.dumps(manifest, indent=1, ensure_ascii=False), encoding="utf-8")
    print(f"build_ch00_cross_product_why: {len(files)} json + {len(bins)} bin + manifest.json ({len(entries)} parity entries, "
          f"{len(heavy)} heavy, {len(rows)} checks) -> {OUT}")
    for k, val in data_hashes.items():
        if (DATA / k).exists():
            print(f"  {k}  sha256 {val[:16]}…  {(DATA / k).stat().st_size / 1e3:.1f} kB")
    if pending:
        print("PENDING:", "; ".join(pending))
    return 0


# ---------------------------------------------------------------------------------------------------------- real data


def land_mask(lon2, lat2):
    """Natural Earth 50m land polygons sampled at the grid points (True = land)."""
    from fluidpy.data import naturalearth as NE
    geoms = NE.read_polygons(NE.land_50m())
    return NE._grid_mask(geoms, ((lon2 + 180) % 360) - 180, lat2)


def trails_bin(tr: np.ndarray, spd: np.ndarray) -> bytes:
    """[N, L, 2] (lat, lon) degrees -> Int16 ×100 (lat, lon) then Uint8 speed (m/s × 4) per sample."""
    q = np.round(np.nan_to_num(tr, nan=-32768 / 100) * 100).clip(-32768, 32767).astype("<i2")
    s = np.round(np.nan_to_num(spd) * 4).clip(0, 255).astype("u1")
    return q.tobytes() + s.tobytes()


def real_parts(row, truth, call, entries, heavy, files, bins, pending) -> None:
    from scipy.interpolate import RegularGridInterpolator, griddata
    from scipy.ndimage import maximum_filter
    from skimage import measure

    def mark_real(n0, r0):
        for e in entries[n0:]:
            e["real"] = True

    # ---------------------------------------------------------------- P1: long-term mean surface winds (s32-s34)
    n0 = len(entries)
    hdr, W = read_bin("wind_climatology")
    lat = np.asarray(hdr["coords"]["lat"], float)
    lon = np.asarray(hdr["coords"]["lon"], float)
    u, v, msl = W["u10"][0], W["v10"][0], W["mslp"][0]
    LON, LAT = np.meshgrid(lon, lat)
    land = land_mask(LON, LAT)
    mx = maximum_filter(np.where(land, -np.inf, msl), size=(9, 9), mode="wrap")
    peak = (msl == mx) & ~land & (np.abs(LAT) > 15) & (np.abs(LAT) < 45) & (msl > 101800)
    hs = sorted([(float(LAT[j, i]), float(LON[j, i]), float(msl[j, i]) / 100) for j, i in zip(*np.nonzero(peak))], key=lambda t: -t[2])
    named = {"N Atlantic": (20, 45, 300, 360), "N Pacific": (20, 45, 170, 240), "S Atlantic": (-45, -20, 330, 360),
             "S Atlantic2": (-45, -20, 0, 15), "S Pacific": (-45, -20, 240, 290), "S Indian": (-45, -20, 50, 110)}
    highs = {}
    for k, (la0, la1, lo0, lo1) in named.items():
        c = [hh for hh in hs if la0 <= hh[0] <= la1 and lo0 <= hh[1] <= lo1]
        if c:
            highs[k.replace("2", "")] = highs.get(k.replace("2", "")) or {"lat": round(c[0][0], 2), "lon": round(((c[0][1] + 180) % 360) - 180, 2), "hPa": round(c[0][2], 1)}
    truth("P1: subtropical highs found over the ocean (N Atlantic, N Pacific, S Atlantic, S Pacific, S Indian)",
          all(k in highs for k in ["N Atlantic", "N Pacific", "S Atlantic", "S Pacific", "S Indian"]))
    row("P1: Azores high ≈ 1022 hPa", highs["N Atlantic"]["hPa"], 1022.1, 1.0)

    def sector(la, lo0, lo1):
        j = int(np.argmin(np.abs(lat - la)))
        sel = (lon >= lo0) & (lon <= lo1)
        return float(np.nanmean(u[j, sel][~land[j, sel]]))
    sec = {"15N Atlantic": sector(15, 320, 340), "15N central Pacific": sector(15, 180, 220), "15S east Pacific": sector(-15, 230, 260),
           "15S Indian": sector(-15, 60, 90), "15S Atlantic": sector(-15, 340, 355), "45N Atlantic": sector(45, 320, 345),
           "45N Pacific": sector(45, 160, 220), "45S Indian": sector(-45, 40, 100)}
    truth("P1: trades blow west at 15°N/S over the oceans (−4 … −8 m/s)", all(-8 < sec[k] < -4 for k in sec if k.startswith("15")))
    truth("P1: westerlies blow east at 45°N/S (+2.5 … +8 m/s)", all(2.5 < sec[k] < 8 for k in sec if k.startswith("45")))
    # N19 (UV2-27): the trades lean towards the equator (v) as well as west (u) over the Atlantic and the Pacific
    def sector_v(la, lo0, lo1):
        j = int(np.argmin(np.abs(lat - la)))
        sel = (lon >= lo0) & (lon <= lo1)
        return float(np.nanmean(v[j, sel][~land[j, sel]]))
    secv = {"15N Atlantic": sector_v(15, 320, 340), "15N central Pacific": sector_v(15, 180, 220), "15S Atlantic": sector_v(-15, 340, 355),
            "15S east Pacific": sector_v(-15, 230, 260), "15S Indian": sector_v(-15, 60, 90)}
    truth("N19 15°N: u < 0 and v < 0 (Atlantic, central Pacific)", all(sec[kk] < 0 and secv[kk] < 0 for kk in ("15N Atlantic", "15N central Pacific")))
    truth("N19 15°S: u < 0 and v > 0 (Atlantic, east Pacific, Indian)", all(sec[kk] < 0 and secv[kk] > 0 for kk in ("15S Atlantic", "15S east Pacific", "15S Indian")))
    hdg = {}
    for nm, (la0, v0) in {"NH trade": (28.0, -1.0), "SH trade": (-28.0, 1.0), "NH westerly": (38.0, 1.0), "SH westerly": (-38.0, -1.0)}.items():
        ax_, ay_ = FR.coriolis_horizontal(0.0, v0, la0 * DEG)
        bend = np.radians(70.0)
        push = np.array([ax_, ay_]) / np.hypot(ax_, ay_)
        d0 = np.array([0.0, v0])
        fin_ = np.cos(bend) * d0 + np.sin(bend) * push            # the drawn arrow turns 70° towards the push
        hdg[nm] = float((np.degrees(np.arctan2(fin_[0], fin_[1])) + 360) % 360)   # heading from north, clockwise
    truth(f"N19 turned-arrow headings: NH trade {hdg['NH trade']:.0f}° in (180, 270), SH trade {hdg['SH trade']:.0f}° in (270, 360)",
          180 < hdg["NH trade"] < 270 and 270 < hdg["SH trade"] < 360)
    truth(f"N19 westerly arrows end east-ish: {hdg['NH westerly']:.0f}°, {hdg['SH westerly']:.0f}° in (45, 135)",
          45 < hdg["NH westerly"] < 135 and 45 < hdg["SH westerly"] < 135)
    west_left = all(globe_screen((la_, lo_, 2.4), la_, lo_ - 2)[0] < globe_screen((la_, lo_, 2.4), la_, lo_)[0]
                    for la_, lo_ in ((15, -40), (-15, -20), (15, -150), (-15, -120)))
    truth("N19 west is screen-left for the north-up s33 camera keyframes", west_left)
    files["winds_mean.json"] = {"sectors_v_m_s": {kk: round(x, 2) for kk, x in secv.items()}, "turn_headings_deg": {kk: round(x, 1) for kk, x in hdg.items()}, "product":"NCEP/NCAR Reanalysis 1, 10 m wind and sea-level pressure, annual long-term mean 1991-2020, T62 Gaussian 94 x 192",
                                "highs": highs, "sectors_u_m_s": {k: round(x, 2) for k, x in sec.items()},
                                "spoken": {"trades": "about five to seven m/s towards the west at 15°N/S",
                                           "westerlies": "about three to seven and a half m/s towards the east at 45°N/S"}}
    heavy.append({"fn": "builder: scipy.ndimage.maximum_filter on P1 msl over ocean (NE 50m land mask)", "scene": "s32",
                  "input_sha256": sha_file(REAL / "wind_climatology.bin"), "output": highs})

    # ---------------------------------------------------------------- P2: Ian (s35, s36, s38)
    gh = json.loads((REAL / "ian_goes16_20220928T1801.json").read_text(encoding="utf-8"))
    ib = json.loads((REAL / "ibtracs_ian_2022.json").read_text(encoding="utf-8"))
    times = ib["time"]
    k18 = times.index("2022-09-28 18:00:00")
    trk = [[ib["lat"][k], ib["lon"][k], times[k]] for k in range(len(times)) if "2022-09-26" <= times[k][:10] <= "2022-09-28" and k <= k18 and times[k][11:13] in ("00", "06", "12", "18")]
    land_pt = [26.7, -82.2]
    trk.append([land_pt[0], land_pt[1], "2022-09-28 19:05 (landfall)"])
    kt130 = 130 * ib["units"]["kt_to_ms"]
    row("Ian landfall 130 kt = 66.9 m/s (≈ 67, spoken)", kt130, 66.9, 0.05)
    eye = [ib["lat"][k18], ib["lon"][k18]]
    row("Ian IBTrACS 18 UTC fix (26.6°N, 82.4°W)", eye, [26.6, -82.4], 0.11)
    # inward arrows at 300 km, the side they turn to from coriolis_horizontal (f > 0: right)
    az = np.arange(8) * 45.0
    starts = [dest_point(eye[0], eye[1], 300 * np.sin(a * DEG), 300 * np.cos(a * DEG)) for a in az]
    inward = np.stack([-np.sin(az * DEG), -np.cos(az * DEG)], -1) * 10.0
    acc = call(FRM + "coriolis_horizontal", "s36", "ian.json", "−f k×u turns the inflow right (NH)",
               u=inward[:, 0].tolist(), v=inward[:, 1].tolist(), lat=float(eye[0] * DEG))
    side = np.sign(np.asarray(V.cross(inward, np.stack(acc, -1)))[:, 2])
    truth("Ian: Coriolis turns every inward stream to its right (k·(u × a) < 0)", np.all(side < 0))
    # HRRR 18 UTC
    hh, H = read_bin("ian_hrrr_2022")
    ti = hh["coords"]["time"].index("2022-09-28T18:00")
    hlat, hlon = H["lat"], H["lon"]
    hu, hv, hp = H["u10"][ti], H["v10"][ti], H["psfc"][ti]
    jmin = np.unravel_index(np.nanargmin(hp), hp.shape)
    hc = [float(hlat[jmin]), float(hlon[jmin])]
    row("HRRR 18 UTC centre (26.43, −82.46)", hc, [26.43, -82.46], 0.06)
    # regrid HRRR to a regular 0.03° grid (for the trajectories and the ring)
    rlat = np.arange(23.4, 30.0 + 1e-9, 0.03)
    rlon = np.arange(-85.5, -78.6 + 1e-9, 0.03)
    RLON, RLAT = np.meshgrid(rlon, rlat)
    pts = np.stack([hlon.ravel(), hlat.ravel()], -1)
    gu = griddata(pts, hu.ravel(), (RLON, RLAT), method="linear")
    gv = griddata(pts, hv.ravel(), (RLON, RLAT), method="linear")
    heavy.append({"fn": "builder: scipy.interpolate.griddata HRRR 3-km 18 UTC → regular 0.03° (linear)", "scene": "s36,s38",
                  "input_sha256": sha_file(REAL / "ian_hrrr_2022.bin"), "output_sha256": parity_hash(np.nan_to_num(gu))})

    def ring(name, clat, clon, ulat, ulon, uu, vv, scene, hemi):
        """16 points on a 150-km ring: k·(r × u) by I2 (storm_relative_wind) when installed, always re-computed with
        fluidpy.geo.vectors.cross / dot (the storyboard's fallback) as a parity row."""
        try:
            cy = importlib.import_module("fluidpy.diag.cyclone")
        except ImportError:
            cy = None
        if cy is not None:
            rw = cy.storm_relative_wind(np.nan_to_num(uu), np.nan_to_num(vv), ulat, ulon, (clat, clon), [150.0], n_az=16)
            plat, plon = np.asarray(rw.lat)[0], np.asarray(rw.lon)[0]
            rhat = np.asarray(rw.rhat)[0]
            u_ms = np.stack([np.asarray(rw.u)[0], np.asarray(rw.v)[0]], -1)
            vt_i2 = np.asarray(rw.tangential)[0]
            azr = np.degrees(np.asarray(rw.azimuth))
            src = "fluidpy.diag.cyclone.storm_relative_wind (I2), cross-checked with fluidpy.geo.vectors.cross"
            heavy.append({"fn": "fluidpy.diag.cyclone.storm_relative_wind", "scene": scene, "params": {"radii_km": [150], "n_az": 16,
                          "centre": [clat, clon]}, "output_sha256": parity_hash(vt_i2)})
        else:
            azr = np.arange(16) * 22.5     # from east, anticlockwise (as I2)
            e_km, n_km = 150 * np.cos(azr * DEG), 150 * np.sin(azr * DEG)
            plat, plon = dest_point(clat, clon, e_km, n_km)
            rhat = np.stack([np.cos(azr * DEG), np.sin(azr * DEG)], -1)
            interp = lambda F: RegularGridInterpolator((ulat, ulon), np.nan_to_num(F), bounds_error=False)(np.stack([plat, plon], -1))  # noqa: E731
            u_ms = np.stack([interp(uu), interp(vv)], -1)
            vt_i2 = None
            src = "fallback: fluidpy.geo.vectors.cross / dot (I2 not installed)"
            pending.append(f"I2 fluidpy.diag.cyclone not installed: {name} ring uses the storyboard fallback (cross/dot)")
        r_m = rhat * 150e3
        rxu = call(VEC + "cross", scene, f"{name}_ring.json", "k·(r×u) on a 150-km ring (spin sign)", a=r_m.tolist(), b=u_ms.tolist())
        kz = np.asarray(rxu)[:, 2]
        rad = call(VEC + "dot", scene, f"{name}_ring.json", "radial wind r̂·u (inflow < 0)", a=rhat.tolist(), b=u_ms.tolist())
        if vt_i2 is not None:
            row(f"{name}: I2 tangential wind = k·(r̂×u) by vectors.cross", vt_i2, kz / 150e3, 1e-9)
        if hemi > 0:
            truth(f"{name}: k·(r×u) > 0 at all 16 ring points (anticlockwise)", np.all(kz > 0))
        else:
            truth(f"{name}: k·(r×u) < 0 at all 16 ring points (clockwise)", np.all(kz < 0))
        files[f"{name}_ring.json"] = {"centre": [round(float(clat), 3), round(float(clon), 3)], "radius_km": 150, "az_deg": r6(azr, 2),
                                     "pts": r6(np.stack([plat, plon], -1), 4), "rhat": r6(rhat, 5),
                                     "u": r6(u_ms, 3), "kz": r6(kz, 1), "vt": r6(kz / 150e3, 3), "vr": r6(rad, 3), "source": src}
        return kz

    ring("ian", hc[0], hc[1], rlat, rlon, gu, gv, "s38", +1)
    gt = json.loads((REAL / "ian_goes16_20220928T1801.json").read_text(encoding="utf-8"))
    files["ian.json"] = {"image": "ian_goes16_truecolour_20220928T1801.jpg", "ir": "ian_goes16_ir13_20220928T1801.png",
                         "lat_edges": gh["lat_edges"], "lon_edges": gh["lon_edges"], "scan": gt["scan_start_utc"],
                         "eye": eye, "hrrr_centre": hc, "landfall": land_pt, "track": trk, "landfall_ms": round(kt130, 1),
                         "inward_starts": r6(np.stack(starts, -1), 4) if False else [[round(s[0], 4), round(s[1], 4)] for s in starts],
                         "inward_az": az.tolist(), "turn_side": "right", "regrid": {"lat": [23.4, 30.0, 0.03], "lon": [-85.5, -78.6, 0.03]}}

    # ---------------------------------------------------------------- P3: Idai (s37, s38)
    ih, IA = read_bin("idai_2019")
    itimes = ih["coords"]["time"]
    k12 = itimes.index("2019-03-14T12:00")
    ilat = np.asarray(ih["coords"]["lat"], float)
    ilon = np.asarray(ih["coords"]["lon"], float)
    iu, iv, im = IA["u10"][k12], IA["v10"][k12], IA["msl"][k12]
    ilat_s = ilat if ilat[0] < ilat[-1] else ilat[::-1]
    flip = ilat[0] > ilat[-1]
    iu_s, iv_s, im_s = (iu[::-1], iv[::-1], im[::-1]) if flip else (iu, iv, im)
    jm = np.unravel_index(np.nanargmin(im_s), im_s.shape)
    ic_ = [float(ilat_s[jm[0]]), float(ilon[jm[1]])]
    ibi = json.loads((REAL / "ibtracs_idai_2019.json").read_text(encoding="utf-8"))
    kb = ibi["time"].index("2019-03-14 12:00:00")
    ieye = [ibi["lat"][kb], ibi["lon"][kb]]
    fI = call(FRM + "coriolis_parameter", "s37", "idai.json", "f < 0 at Idai's centre", lat=float(ieye[0] * DEG))
    row("Idai: f < 0 at the centre", fI < 0, 1, 0)
    k_ms = ibi["units"]["kt_to_ms"]
    row("Idai 115 kt = 59.2 m/s; 105 kt = 54.0 m/s", [115 * k_ms, 105 * k_ms], [59.2, 54.0], 0.05)
    ring("idai", ic_[0], ic_[1], ilat_s, ilon, iu_s, iv_s, "s38", -1)
    istarts = [dest_point(ieye[0], ieye[1], 300 * np.sin(a * DEG), 300 * np.cos(a * DEG)) for a in az]
    accI = call(FRM + "coriolis_horizontal", "s37", "idai.json", "−f k×u turns the inflow left (SH)",
                u=inward[:, 0].tolist(), v=inward[:, 1].tolist(), lat=float(ieye[0] * DEG))
    sideI = np.sign(np.asarray(V.cross(inward, np.stack(accI, -1)))[:, 2])
    truth("Idai: Coriolis turns every inward stream to its left", np.all(sideI > 0))
    files["idai.json"] = {"image": "idai_viirs_truecolour_2019-03-14.jpg", "lat_edges": [-30, -10], "lon_edges": [30, 50],
                          "eye": ieye, "era5_centre": ic_, "f": r6(fI, 9), "strength_ms": [54, 59],
                          "inward_starts": [[round(s[0], 4), round(s[1], 4)] for s in istarts], "inward_az": az.tolist(), "turn_side": "left"}

    # ---------------------------------------------------------------- particles (I1)
    try:
        TJ = importlib.import_module("fluidpy.diag.trajectories")
        adv = TJ.advect_on_sphere
    except (ImportError, AttributeError):
        adv = None
        pending.append("I1 fluidpy.diag.trajectories.advect_on_sphere not installed: streaklines (s32-s37) not built")
    if adv is not None:
        particles(adv, row, truth, heavy, files, bins, lat, lon, u, v, land, rlat, rlon, gu, gv, hc, ilat_s, ilon, iu_s, iv_s, ic_)

    # ---------------------------------------------------------------- P4b: Storm Ciarán at 12 UTC (s45, s46; N21, v4)
    TSTR = "2023-11-02T12:00"
    sh_, S = read_bin("ciaran_2023_sfc_1102")
    uh, U = read_bin("ciaran_2023_upper_1102")
    slat = np.asarray(sh_["coords"]["lat"], float)
    slon = np.asarray(sh_["coords"]["lon"], float)
    st = sh_["coords"]["time"].index(TSTR)
    ut = uh["coords"]["time"].index(TSTR)
    k850 = uh["coords"]["level"].index(850)
    mslp = S["msl"][st] / 100.0
    u10, v10 = S["u10"][st], S["v10"][st]
    z850 = U["z"][ut, k850]
    u850, v850 = U["u"][ut, k850], U["v"][ut, k850]
    lsm = S["land"] >= 0.5
    ug8, vg8 = call("fluidpy.geo.atmos.geostrophic_wind_from_height", "s45,s46", "storm.json",
                    "Vallis (2.215)/(2.198) geostrophic wind from 850 hPa heights (12 UTC)", Z=z850.tolist(), lat=slat.tolist(),
                    lon=slon.tolist(), lat_min=20.0)
    ug8, vg8 = np.asarray(ug8), np.asarray(vg8)
    jm = np.unravel_index(np.nanargmin(mslp), mslp.shape)
    low = [float(slat[jm[0]]), float(slon[jm[1]]), float(mslp[jm])]
    row("N21 Ciarán 12 UTC MSLP low (52.5°N, 1.75°E, 955.9 hPa)", low, [52.5, 1.75, 955.93], 0.06)
    jz = np.unravel_index(np.nanargmin(z850), z850.shape)
    row("N21 850 hPa height low at the same grid point", [slat[jz[0]], slon[jz[1]]], low[:2], 1e-9)
    levels = np.arange(np.ceil(mslp.min() / 4) * 4, mslp.max(), 4.0)
    iso = []
    for lev in levels:
        for c in measure.find_contours(mslp, lev):
            if len(c) < 8:
                continue
            c = measure.approximate_polygon(c, tolerance=0.4)
            la = np.interp(c[:, 0], np.arange(slat.size), slat)
            lo = np.interp(c[:, 1], np.arange(slon.size), slon)
            iso.append({"hPa": float(lev), "pts": [[round(a, 3), round(b, 3)] for a, b in zip(la, lo)]})
    from shapely.geometry import Point, shape
    from shapely.geometry import box as sbox
    from shapely.ops import unary_union
    gj = json.loads((ROOT / "data" / "derived" / "ch00" / "ciaran_land_50m.geojson").read_text(encoding="utf-8"))
    LANDU = unary_union([shape(ft["geometry"]) for ft in gj["features"]])
    SLON, SLAT = np.meshgrid(slon, slat)
    E_, N_ = enu_offsets_km(SLAT, SLON, low[0], low[1])
    RKM = np.hypot(E_, N_)
    # the orchestrator's CHECK (2026-10-27): sea points 300-1500 km from the centre at 12 UTC
    sea = (~lsm) & (RKM >= 300) & (RKM <= 1500) & np.isfinite(ug8) & (np.abs(SLAT) >= 20)
    sg = np.hypot(ug8, vg8)
    angd = np.degrees(np.abs(np.angle((u850 + 1j * v850) / (ug8 + 1j * vg8))))
    ratio = np.hypot(u850, v850) / np.where(sg > 0, sg, np.nan)
    med_a, frac10, med_r = float(np.nanmedian(angd[sea])), float(np.nanmean(angd[sea] <= 10)), float(np.nanmedian(ratio[sea]))
    row(f"N21 850 hPa vs geostrophic over sea 300-1500 km: median direction difference ≤ 10° ({med_a:.1f}°)", med_a, 0, 10)
    row(f"N21 ≥ 65 % of those points within 10° ({100 * frac10:.0f} %)", frac10 >= 0.65, 1, 0)
    row(f"N21 median speed ratio actual/geostrophic in 0.80-0.95 ({med_r:.3f})", med_r, 0.875, 0.075)
    # thinned sea points every 1.5° for the arrows, ≥ 0.5° from any coast, ≥ 300 km from the low
    arrows = []
    for j in np.arange(0, slat.size, 6):
        for i in np.arange(0, slon.size, 6):
            if lsm[j, i] or not np.isfinite(ug8[j, i]) or RKM[j, i] < 300:
                continue
            cd = float(LANDU.distance(Point(float(slon[i]), float(slat[j]))))
            if cd < 0.5:
                continue
            arrows.append({"lat": float(slat[j]), "lon": float(slon[i]), "geo": [round(float(ug8[j, i]), 2), round(float(vg8[j, i]), 2)],
                           "act": [round(float(u850[j, i]), 2), round(float(v850[j, i]), 2)],
                           "w10": [round(float(u10[j, i]), 2), round(float(v10[j, i]), 2)], "r_km": round(float(RKM[j, i]), 0),
                           "coast_deg": round(cd, 2)})
    truth("N21 every drawn arrow over open sea (≥ 0.5° from land) and ≥ 300 km from the low", len(arrows) > 40)
    ring_pts = [a for a in arrows if 300 <= a["r_km"] <= 600]
    rv = np.array([enu_offsets_km(a["lat"], a["lon"], low[0], low[1]) for a in ring_pts]) * 1e3
    gvv = np.array([a["geo"] for a in ring_pts])
    kzr = np.asarray(call(VEC + "cross", "s45", "storm.json", "k·(r×u_g) > 0: anticlockwise round the low", a=rv.tolist(), b=gvv.tolist()))[:, 2]
    row("N21 geostrophic anticlockwise on the 300-600 km ring (≥ 90 % of sea points)", np.mean(kzr > 0) >= 0.9, 1, 0)
    # geostrophic wind from msl (I3 fallback: Z = msl/(ρ₀ g₀)): only its direction is used (the isobar direction)
    ugs_, vgs_ = geostrophic_wind_from_height((mslp * 100.0) / (1.2 * G0), slat, slon, lat_min=20.0)
    heavy.append({"fn": "fluidpy.geo.atmos.geostrophic_wind_from_height", "scene": "s46", "eq": "I3 fallback: Z = msl/(ρ₀ g₀), ρ₀ = 1.2",
                  "input_sha256": sha_file(REAL / "ciaran_2023_sfc_1102.bin"), "output_sha256": parity_hash(np.nan_to_num(ugs_))})

    def bm(F, j, i):
        return float(np.nanmean(F[j - 2:j + 3, i - 2:i + 3]))
    # the two zoom points: TYPICAL sea points (1° box means closest to the medians), one west of the low, one in the North Sea
    regions = {"W flank": lambda a: a["lon"] < -4 and 46 <= a["lat"] <= 54, "North Sea": lambda a: a["lon"] > 1 and a["lat"] > 53.5}
    cmp = {}
    for name, sel in regions.items():
        best = None
        for a in arrows:
            if not sel(a) or not (300 <= a["r_km"] <= 1500):
                continue
            j, i = int(np.argmin(np.abs(slat - a["lat"]))), int(np.argmin(np.abs(slon - a["lon"])))
            if lsm[j - 2:j + 3, i - 2:i + 3].any():
                continue
            g = [bm(ug8, j, i), bm(vg8, j, i)]
            ac = [bm(u850, j, i), bm(v850, j, i)]
            an = float(np.degrees(abs(np.angle(complex(*ac) / complex(*g)))))
            rt_ = float(np.hypot(*ac) / np.hypot(*g))
            score = abs(an - med_a) / 10 + abs(rt_ - med_r) / 0.1
            if best is None or score < best[0]:
                best = (score, j, i, g, ac, an, rt_)
        _, j, i, g, ac, an, rt_ = best
        w = [bm(u10, j, i), bm(v10, j, i)]
        gs = [bm(ugs_, j, i), bm(vgs_, j, i)]
        ang10 = float(call(VEC + "angle_between", "s46", "storm.json", "10 m wind vs the isobar direction (friction turning)", a=w, b=gs, degrees=True))
        side = float(np.asarray(V.cross(gs, w))[2])
        cmp[name] = {"lat": float(slat[j]), "lon": float(slon[i]), "geo": r6(g, 2), "act": r6(ac, 2), "w10": r6(w, 2), "msl_geo": r6(gs, 2),
                     "speed_ratio": round(rt_, 3), "angle_850": round(an, 1), "angle_10m": round(ang10, 1), "k_dot_iso_cross_w10": round(side, 3),
                     "r_km": round(float(RKM[j, i]))}
        row(f"N21 {name} (typical point): 850 hPa direction within 10° ({an:.1f}°)", an, 0, 10)
        row(f"N21 {name}: speed ratio near the median ({rt_:.3f})", rt_, med_r, 0.06)
        truth(f"N21 {name}: 10 m wind turned towards the low (left of the isobar direction, {ang10:.0f}°)", side > 0)
    print("  compare", cmp)
    crowd = []
    gmag = np.where(lsm, 0, np.hypot(*np.gradient(mslp)))
    for o in np.argsort(gmag.ravel())[::-1]:
        j, i = np.unravel_index(o, gmag.shape)
        if slon[i] > 9 or slon[i] < -28 or slat[j] < 43 or slat[j] > 61:
            continue
        if all(np.hypot(*enu_offsets_km(slat[j], slon[i], c[0], c[1])) > 600 for c in crowd):
            crowd.append([float(slat[j]), float(slon[i])])
        if len(crowd) == 2:
            break
    # Natural Earth 10m coast / country borders / region borders for the map panel (data-scout e20037e), simplified
    lines = {}
    clip = sbox(-31.0, 42.0, 12.0, 62.5)
    for key, nm, tol in (("coast", "ciaran_coast_10m", 0.008), ("borders", "ciaran_borders_10m", 0.008), ("admin1", "ciaran_admin1_lines_10m", 0.01)):
        gj2 = json.loads((ROOT / "data" / "derived" / "ch00" / f"{nm}.geojson").read_text(encoding="utf-8"))
        out = []
        for ft in gj2["features"]:
            gm = shape(ft["geometry"]).intersection(clip).simplify(tol)
            for pp in getattr(gm, "geoms", [gm]):
                if pp.is_empty or not hasattr(pp, "coords"):
                    continue
                cs = np.round(np.asarray(pp.coords), 3)
                if len(cs) >= 2:
                    out.append(cs.ravel().tolist())
        lines[key] = out
    img = json.loads((ROOT / "data" / "derived" / "ch00" / "ciaran_modis_aqua_truecolour_2023-11-02.json").read_text(encoding="utf-8"))
    files["ciaran_lines.json"] = {"source": "Natural Earth 10m (public domain), via data/derived/ch00 (e20037e), clipped 31W-12E, 42-62.5N, simplified",
                                  **lines}
    files["storm.json"] = {"time": TSTR, "box": {"lat": [float(slat[0]), float(slat[-1])], "lon": [float(slon[0]), float(slon[-1])]},
                           "low": low, "second_low_note": "a weaker closed low (~972 hPa) near 55N 11W is not labelled",
                           "isobars": iso, "arrows": arrows, "compare": cmp, "crowd": crowd,
                           "stats_850": {"median_angle_deg": round(med_a, 2), "frac_within_10deg": round(frac10, 3), "median_speed_ratio": round(med_r, 3),
                                         "n_points": int(sea.sum()), "window_km": [300, 1500]},
                           "image": {"file": "ciaran_modis_aqua_truecolour_2023-11-02.jpg", "lat_edges": img["lat_edges"], "lon_edges": img["lon_edges"],
                                     "shape": img["shape"], "sha256": sha_file(ROOT / "data" / "derived" / "ch00" / "ciaran_modis_aqua_truecolour_2023-11-02.jpg")}}
    heavy.append({"fn": "builder: skimage.measure.find_contours (msl every 4 hPa, 12 UTC) + NE 50m land + ERA5 lsm + thinning", "scene": "s45,s46",
                  "input_sha256": sha_file(REAL / "ciaran_2023_sfc_1102.bin"), "upper_sha256": sha_file(REAL / "ciaran_2023_upper_1102.bin")})
    for e in list(entries):
        if e["fn"].endswith("geostrophic_wind_from_height"):
            entries.remove(e)
            heavy.append({**{k: e[k] for k in ("fn", "scene", "data", "eq", "sha256")},
                          "params": "Z = ERA5 850 hPa z at 2023-11-02T12 (ciaran_2023_upper_1102.bin), lat/lon of the box, lat_min 20",
                          "input_sha256": sha_file(REAL / "ciaran_2023_upper_1102.bin")})
    mark_real(n0, None)


def particles(adv, row, truth, heavy, files, bins, lat, lon, u, v, land, rlat, rlon, gu, gv, hc, ilat, ilon, iu, iv, ic_):
    """Streaklines of the real winds via fluidpy.diag.trajectories.advect_on_sphere (I1)."""
    import inspect
    rng = np.random.default_rng(11)
    sig = str(inspect.signature(adv))

    def run(name, U, Vv, la, lo, seeds_lat, seeds_lon, dt, n, scene, src_bin):
        tr = np.asarray(adv(U, Vv, la, lo, seeds_lat, seeds_lon, dt, n))
        # speed per sample by bilinear interpolation of |u|
        from scipy.interpolate import RegularGridInterpolator
        sp = RegularGridInterpolator((la, lo), np.hypot(np.nan_to_num(U), np.nan_to_num(Vv)), bounds_error=False, fill_value=0)
        ll = tr.reshape(-1, 2).copy()
        ll[:, 1] = np.where(ll[:, 1] < lo[0], ll[:, 1] + 360, ll[:, 1]) if lo[-1] > 180 else ll[:, 1]
        spd = sp(ll).reshape(tr.shape[:2])
        bins[f"trails_{name}.bin"] = trails_bin(tr if lo[-1] <= 180 else np.stack([tr[..., 0], ((tr[..., 1] + 180) % 360) - 180], -1), spd)
        heavy.append({"fn": "fluidpy.diag.trajectories.advect_on_sphere", "signature": sig, "scene": scene,
                      "params": {"seeds": int(len(seeds_lat)), "dt_s": dt, "nsteps": n, "seed": 11},
                      "input_sha256": sha_file(src_bin), "output_sha256": parity_hash(tr)})
        return tr, spd

    # global mean winds: 6000 area-uniform seeds, 2 h per frame, 90 samples
    N = 6000
    zs = rng.uniform(-np.sin(75 * DEG), np.sin(75 * DEG), N)
    slat, slon = np.degrees(np.arcsin(zs)), rng.uniform(0, 360, N)
    tr, spd = run("global", u, v, lat, lon, slat, slon, 7200.0, 89, "s32-s34", REAL / "wind_climatology.bin")
    truth("I1 global trails finite", np.isfinite(tr).mean() > 0.95)
    files["trails_global.json"] = {"n": N, "L": 90, "format": "Int16 (lat, lon) ×100 [N, L, 2] then Uint8 speed ×4 [N, L]",
                                   "dt_s": 7200, "seed": 11}
    # Ian HRRR 18 UTC, 3000 seeds within 400 km, 2 min per frame
    N2 = 3000
    rr = 400 * np.sqrt(rng.uniform(0, 1, N2))
    aa = rng.uniform(0, 2 * np.pi, N2)
    la2, lo2 = dest_point(hc[0], hc[1], rr * np.sin(aa), rr * np.cos(aa))
    tr2, _ = run("ian", np.nan_to_num(gu), np.nan_to_num(gv), rlat, rlon, la2, lo2, 120.0, 89, "s36", REAL / "ian_hrrr_2022.bin")
    files["trails_ian.json"] = {"n": N2, "L": 90, "dt_s": 120, "seed": 13, "centre": hc}
    N3 = 2000
    rr = 500 * np.sqrt(rng.uniform(0, 1, N3))
    aa = rng.uniform(0, 2 * np.pi, N3)
    la3, lo3 = dest_point(ic_[0], ic_[1], rr * np.sin(aa), rr * np.cos(aa))
    tr3, _ = run("idai", iu, iv, ilat, ilon, la3, lo3, 180.0, 89, "s37", REAL / "idai_2019.bin")
    files["trails_idai.json"] = {"n": N3, "L": 90, "dt_s": 180, "seed": 17, "centre": ic_}


if __name__ == "__main__":
    sys.exit(main())
