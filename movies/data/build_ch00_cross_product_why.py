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


# ---------------------------------------------------------------------------------------------------------- main


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--part", choices=["all", "core"], default="all")
    args = ap.parse_args()
    DATA.mkdir(parents=True, exist_ok=True)
    rows: list[dict] = []
    entries: list[dict] = []
    heavy: list[dict] = []
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

    t17, nla, nlo, nu, nv = track(45.0, -30.0, 17, "s00,s31")
    _, sla, slo, su, sv = track(-45.0, -20.0, 17, "s31")
    t6, n6la, n6lo, *_ = track(40.0, -30.0, 6, "s26")
    _, s6la, s6lo, *_ = track(-40.0, -20.0, 6, "s26")
    gn = call(FRM + "great_circle", "s26", fpth, "f = 0 ghost (great circle)", lat0=40 * DEG, lon0=-30 * DEG, u0=10.0, v0=0.0, t=t6.tolist())
    gs = call(FRM + "great_circle", "s26", fpth, "f = 0 ghost (great circle)", lat0=-40 * DEG, lon0=-20 * DEG, u0=10.0, v0=0.0, t=t6.tolist())
    # loop diameters (km) on the local plane
    ex_n, ny_n = enu_offsets_km(nla, nlo, 45.0, -30.0)
    ex_s, ny_s = enu_offsets_km(sla, slo, -45.0, -20.0)
    dn, ds_ = float(np.ptp(ny_n)), float(np.ptp(ny_s))
    row("NH track turns right first (v < 0 after 1 h)", nv[60] < 0, 1, 0)
    row("SH track turns left first (v > 0 after 1 h)", sv[60] > 0, 1, 0)
    row("loop diameter (north-south extent) ≈ 193.9 km within 5 %", [abs(dn / 193.9 - 1) < 0.05, abs(ds_ / 193.9 - 1) < 0.05], [1, 1], 0)
    row("speed conserved 10 m/s", np.hypot(nu, nv), 10.0, 1e-6)
    sub = slice(None, None, 2)  # 2-min samples for the composition
    files[fpth] = {"t_h": r6(t17[sub] / 3600, 4), "nh_track": r6(np.stack([nla[sub], nlo[sub]], -1), 5),
                   "sh_track": r6(np.stack([sla[sub], slo[sub]], -1), 5),
                   "nh_start": [45.0, -30.0], "sh_start": [-45.0, -20.0],
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
        "data_files": data_hashes, "checks": rows, "physics": entries, "physics_heavy": heavy,
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
    files["winds_mean.json"] = {"product": "NCEP/NCAR Reanalysis 1, 10 m wind and sea-level pressure, annual long-term mean 1991-2020, T62 Gaussian 94 x 192",
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

    # ---------------------------------------------------------------- P4: Storm Ciarán (s45, s46)
    sh_, S = read_bin("ciaran_2023_sfc")
    uh, U = read_bin("ciaran_2023_upper")
    slat = np.asarray(sh_["coords"]["lat"], float)
    slon = np.asarray(sh_["coords"]["lon"], float)
    st = sh_["coords"]["time"].index("2023-11-02T00:00")
    ut = uh["coords"]["time"].index("2023-11-02T00:00")
    mslp = S["msl"][st] / 100.0
    u10, v10 = S["u10"][st], S["v10"][st]
    z850 = U["z"][ut, 0]
    u850, v850 = U["u"][ut, 0], U["v"][ut, 0]
    SLON, SLAT = np.meshgrid(slon, slat)
    sland = land_mask(SLON, SLAT)
    ug8, vg8 = call("fluidpy.geo.atmos.geostrophic_wind_from_height", "s45,s46", "storm.json",
                    "Vallis (2.215)/(2.198) geostrophic wind from 850 hPa heights", Z=z850.tolist(), lat=slat.tolist(),
                    lon=slon.tolist(), lat_min=20.0)
    ug8, vg8 = np.asarray(ug8), np.asarray(vg8)
    jm = np.unravel_index(np.nanargmin(mslp), mslp.shape)
    low = [float(slat[jm[0]]), float(slon[jm[1]]), float(mslp[jm])]
    row("Ciarán 2023-11-02T00 low (49.75°N, 5.75°W, 954.6 hPa)", low, [49.75, -5.75, 954.6], 0.06)
    # isobars every 4 hPa (msl), lon/lat polylines, simplified
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
    # thinned sea points every 1.5° for the arrows (|lat| ≥ 20 is guaranteed by the box)
    js = np.arange(0, slat.size, 6)
    is_ = np.arange(0, slon.size, 6)
    arrows = []
    for j in js:
        for i in is_:
            if sland[j, i] or not np.isfinite(ug8[j, i]):
                continue
            d_km = np.hypot(*enu_offsets_km(slat[j], slon[i], low[0], low[1]))
            arrows.append({"lat": float(slat[j]), "lon": float(slon[i]), "geo": [round(float(ug8[j, i]), 2), round(float(vg8[j, i]), 2)],
                           "act": [round(float(u850[j, i]), 2), round(float(v850[j, i]), 2)],
                           "w10": [round(float(u10[j, i]), 2), round(float(v10[j, i]), 2)], "r_km": round(float(d_km), 0)})
    # anticlockwise round the low: k·(r × u_g) > 0 on a 400-km ring (sea points near the ring)
    ring_pts = [a for a in arrows if 300 <= a["r_km"] <= 500]
    rv = np.array([enu_offsets_km(a["lat"], a["lon"], low[0], low[1]) for a in ring_pts]) * 1e3
    gvv = np.array([a["geo"] for a in ring_pts])
    kzr = np.asarray(call(VEC + "cross", "s45", "storm.json", "k·(r×u_g) > 0: anticlockwise round the low",
                          a=rv.tolist(), b=gvv.tolist()))[:, 2]
    row("Ciarán: geostrophic anticlockwise on the 300-500 km ring (≥ 90 % of sea points)", np.mean(kzr > 0) >= 0.9, 1, 0)
    # comparison points (W flank, S flank) at 850 hPa and 10 m
    cmp = {}
    # geostrophic wind from msl (the I3 fallback: Z = msl / (ρ₀ g₀)); only its direction is used (the isobar direction)
    ugs_, vgs_ = geostrophic_wind_from_height((mslp * 100.0) / (1.2 * G0), slat, slon, lat_min=20.0)
    heavy.append({"fn": "fluidpy.geo.atmos.geostrophic_wind_from_height", "scene": "s46", "eq": "I3 fallback: Z = msl/(ρ₀ g₀), ρ₀ = 1.2",
                  "input_sha256": sha_file(REAL / "ciaran_2023_sfc.bin"), "output_sha256": parity_hash(np.nan_to_num(ugs_))})
    for name, (la, lo) in {"W flank": (49.75, -15.75), "S flank": (43.75, -5.75)}.items():
        j, i = int(np.argmin(np.abs(slat - la))), int(np.argmin(np.abs(slon - lo)))
        sl = (slice(j - 2, j + 3), slice(i - 2, i + 3))       # 1° × 1° box mean (5 × 5 points), as the data-scout's check
        bm = lambda F: float(np.nanmean(F[sl]))  # noqa: E731
        g, a_, w = [bm(ug8), bm(vg8)], [bm(u850), bm(v850)], [bm(u10), bm(v10)]
        gs = [bm(ugs_), bm(vgs_)]
        ang = call(VEC + "angle_between", "s46", "storm.json", "angle real vs geostrophic (850 hPa, 1° box means)", a=a_, b=g, degrees=True)
        a10 = call(VEC + "angle_between", "s46", "storm.json", "10 m wind vs the isobar direction (friction turning)", a=w, b=gs, degrees=True)
        # towards the low: the 10 m wind turned anticlockwise (to the left of the isobar direction) in the NH
        side = float(np.asarray(V.cross(gs, w))[2])
        cmp[name] = {"lat": float(slat[j]), "lon": float(slon[i]), "geo": r6(g, 2), "act": r6(a_, 2), "w10": r6(w, 2), "msl_geo": r6(gs, 2),
                     "speed_ratio": round(float(np.hypot(*a_) / np.hypot(*g)), 3), "angle_850": round(float(ang), 1),
                     "angle_10m": round(float(a10), 1), "k_dot_iso_cross_w10": round(side, 3)}
        row(f"Ciarán {name}: 850 hPa speed within 10 %", abs(cmp[name]["speed_ratio"] - 1), 0, 0.10)
        row(f"Ciarán {name}: 850 hPa direction within 5°", cmp[name]["angle_850"], 0, 5.0)
        truth(f"Ciarán {name}: 10 m wind turned towards the low (left of the isobar direction)", side > 0)
    print("  compare", cmp)
    row("Ciarán friction angles ≈ 13° (W) and ≈ 21° (S)", [cmp["W flank"]["angle_10m"], cmp["S flank"]["angle_10m"]], [13.0, 20.9], 1.0)
    # largest |∇msl| over sea (two places)
    gpy, gpx = np.gradient(mslp, axis=0), np.gradient(mslp, axis=1)
    gmag = np.where(sland, 0, np.hypot(gpx, gpy * 1.0))
    order = np.argsort(gmag.ravel())[::-1]
    crowd = []
    for o in order:
        j, i = np.unravel_index(o, gmag.shape)
        if all(np.hypot(*enu_offsets_km(slat[j], slon[i], c[0], c[1])) > 600 for c in crowd):
            crowd.append([float(slat[j]), float(slon[i])])
        if len(crowd) == 2:
            break
    # coastlines inside the box (Natural Earth 50m)
    ne = json.loads((REAL / "ne_lines_50m.json").read_text(encoding="utf-8"))
    coast = []
    for ln in ne["coastline"]:
        arr = np.asarray(ln).reshape(-1, 2)
        m = (arr[:, 0] >= slon[0] - 2) & (arr[:, 0] <= slon[-1] + 2) & (arr[:, 1] >= slat[0] - 2) & (arr[:, 1] <= slat[-1] + 2)
        if m.sum() >= 2:
            coast.append(arr[m].round(2).tolist())
    files["storm.json"] = {"time": "2023-11-02T00:00", "box": {"lat": [float(slat[0]), float(slat[-1])], "lon": [float(slon[0]), float(slon[-1])]},
                           "low": low, "isobars": iso, "arrows": arrows, "compare": cmp, "crowd": crowd, "coast": coast,
                           "spoken": {"friction_deg": [13, 21]}}
    heavy.append({"fn": "builder: skimage.measure.find_contours (msl every 4 hPa) + NE 50m land mask + thinning", "scene": "s45,s46",
                  "input_sha256": sha_file(REAL / "ciaran_2023_sfc.bin"), "upper_sha256": sha_file(REAL / "ciaran_2023_upper.bin")})
    # the geostrophic call above has a 141 x 241 field: keep it out of QA's re-run list (recorded as heavy)
    for e in list(entries):
        if e["fn"].endswith("geostrophic_wind_from_height"):
            entries.remove(e)
            heavy.append({**{k: e[k] for k in ("fn", "scene", "data", "eq", "sha256")},
                          "params": "Z = ERA5 850 hPa z at 2023-11-02T00 (ciaran_2023_upper.bin), lat/lon of the box, lat_min 20",
                          "input_sha256": sha_file(REAL / "ciaran_2023_upper.bin")})
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
