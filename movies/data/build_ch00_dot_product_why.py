"""Physics data for the Chapter-0A movie "Why times the other length?" (movies/ch00/ch00_dot_product_why/storyboard.yaml).

Run with the main venv::

    .venv/Scripts/python.exe movies/data/build_ch00_dot_product_why.py

Every number the movie shows is computed here by the tested ``fluidpy.geo.vectors`` functions named in the storyboard's
``physics_source`` fields (``dot``, ``norm``, ``angle_between``, ``scalar_projection``, ``projection``, ``k_cross``), with
``fluidpy.core.kinematics.material_derivative_terms`` as an independent cross-check of the advection numbers (s6, s7).
The composition (movies/src/ch00/DotProductWhy.tsx) only indexes these samples by frame; it never recomputes physics.

Writes movies/ch00/ch00_dot_product_why/data/{s1_s3_pair,s4_cheap,s5_work,s6_s7_advection,s8_sign}.json and
movies/ch00/ch00_dot_product_why/manifest.json (function, equation, parameters, fluidpy git SHA + sha256 of vectors.py,
sha256 of each data file, and a parity hash per call computed the way tools/movie_qa.py re-computes it).
The checks below must pass before anything is written (exit 1 otherwise).
"""
from __future__ import annotations

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
OUT = ROOT / "movies" / "ch00" / "ch00_dot_product_why"
DATA = OUT / "data"

sys.path.insert(0, str(FLUID))
from fluidpy.core.kinematics import material_derivative_terms  # noqa: E402
from fluidpy.geo import vectors as V  # noqa: E402

A = [5.0, 1.0]          # arrow a (teal)
B = [1.0, 3.0]          # arrow b (orange)
U_WIND = [6.0, 8.0]     # s4 wind, m/s
F_N, F_DEG = 20.0, 60.0  # s5 force
D5, D10 = [5.0, 0.0], [10.0, 0.0]
U_ADV, U_ADV_DEG = 10.0, 60.0           # s6 wind speed m/s and angle from grad T
G1, G2 = 1.0e-5, 2.0e-5                 # K/m: 1 K per 100 km, then twice as steep
T_WEST = 10.0                           # °C at x = 0 km
PROBE_KM = (300.0, 180.0)
MAP_KM = (600.0, 360.0)


def parity_hash(out) -> str:
    """Same rule as tools/movie_qa.py::physics_parity (float array bytes, else sorted JSON with str())."""
    try:
        blob = np.ascontiguousarray(np.asarray(out, dtype=float)).tobytes()
    except Exception:
        blob = json.dumps(out, sort_keys=True, default=str).encode()
    return hashlib.sha256(blob).hexdigest()


def r6(a) -> list | float:
    arr = np.asarray(a, dtype=float)
    if arr.ndim == 0:
        return round(float(arr), 6)
    return np.round(arr, 6).tolist()


def git_sha(repo: Path) -> dict:
    run = lambda *a: subprocess.run(["git", "-C", str(repo), *a], capture_output=True, text=True).stdout.strip()  # noqa: E731
    src = repo / "fluidpy" / "geo" / "vectors.py"
    kin = repo / "fluidpy" / "core" / "kinematics.py"
    return {"commit": run("rev-parse", "HEAD"),
            "vectors_py_tracked": bool(run("ls-files", "fluidpy/geo/vectors.py")),
            "dirty_tracked": bool(run("status", "--porcelain", "--untracked-files=no")),
            "vectors_py_sha256": hashlib.sha256(src.read_bytes()).hexdigest(),
            "kinematics_py_sha256": hashlib.sha256(kin.read_bytes()).hexdigest()}


def thermal_lut(n: int = 64) -> list[str]:
    """cmocean 'thermal' from the project LUT file (assets/luts.json, tools/make_luts.py), resampled to n hex colours."""
    tab = json.loads((ROOT / "assets" / "luts.json").read_text(encoding="utf-8"))["tables"]["cmocean.thermal"]
    rgb = np.frombuffer(base64.b64decode(tab), dtype=np.uint8).reshape(-1, 3)
    idx = np.round(np.linspace(0, len(rgb) - 1, n)).astype(int)
    return ["#%02x%02x%02x" % tuple(int(c) for c in rgb[i]) for i in idx]


def main() -> int:
    DATA.mkdir(parents=True, exist_ok=True)
    rows: list[dict] = []

    def row(name, val, ref, tol):
        ok = bool(np.all(np.abs(np.asarray(val, dtype=float) - np.asarray(ref, dtype=float)) <= tol))
        rows.append({"name": name, "value": r6(np.ravel(val)[:4]), "ref": r6(np.ravel(ref)[:4]), "tol": tol, "pass": ok})

    entries: list[dict] = []

    def call(fn: str, scene: str, data: str, eq: str, **params):
        mod, name = fn.rsplit(".", 1)
        out = getattr(importlib.import_module(mod), name)(**params)
        jparams = {k: (np.asarray(v).tolist() if isinstance(v, np.ndarray) else v) for k, v in params.items()}
        entries.append({"fn": fn, "scene": scene, "data": f"data/{data}", "eq": eq, "params": jparams,
                        "sha256": parity_hash(out)})
        return out

    VEC = "fluidpy.geo.vectors."
    # ------------------------------------------------------------------ s1-s3: the pair a = (5, 1), b = (1, 3)
    f1 = "s1_s3_pair.json"
    ab = call(VEC + "dot", "s1-s3", f1, "(K 2.2)", a=A, b=B)
    na = call(VEC + "norm", "s2", f1, "|a| from (K 2.2)", a=A)
    nb = call(VEC + "norm", "s2", f1, "|b| from (K 2.2)", a=B)
    th = call(VEC + "angle_between", "s2", f1, "(0A.1)", a=A, b=B, degrees=True)
    sh_ab = call(VEC + "scalar_projection", "s1-s3", f1, "(0A.3)", a=A, b=B)
    sh_ba = call(VEC + "scalar_projection", "s3", f1, "(0A.3)", a=B, b=A)
    p_ab = call(VEC + "projection", "s1-s3", f1, "(0A.3) times b-hat", a=A, b=B)
    p_ba = call(VEC + "projection", "s3", f1, "(0A.3) times a-hat", a=B, b=A)
    kb = call(VEC + "k_cross", "s3", f1, "rectangle side perpendicular to b", u=B)
    ka = call(VEC + "k_cross", "s3", f1, "rectangle side perpendicular to a", u=A)
    ba = V.dot(B, A)
    row("a·b = 5·1 + 1·3 = 8", ab, 8.0, 1e-12)
    row("|a| = √26 = 5.099", na, np.sqrt(26), 1e-12)
    row("|b| = √10 = 3.162", nb, np.sqrt(10), 1e-12)
    row("θ = 60.255°", th, 60.2551187, 1e-6)
    row("(0A.1) |a||b|cos θ = a·b", na * nb * np.cos(np.radians(th)), ab, 1e-12)
    row("shadow a on b = 8/√10 = 2.530", sh_ab, 8 / np.sqrt(10), 1e-12)
    row("shadow b on a = 8/√26 = 1.569", sh_ba, 8 / np.sqrt(26), 1e-12)
    row("projection a on b = (0.8, 2.4)", p_ab, [0.8, 2.4], 1e-12)
    row("projection b on a = (1.538, 0.308)", p_ba, [20 / 13, 4 / 13], 1e-12)
    row("(a − proj)·b = 0 (drop-line at right angles)", V.dot(np.subtract(A, p_ab), B), 0.0, 1e-12)
    row("symmetry a·b = b·a", ab, ba, 0.0)
    row("left rectangle area = shadow_ab × |b| = 8", sh_ab * nb, 8.0, 1e-12)
    row("right rectangle area = shadow_ba × |a| = 8", sh_ba * na, 8.0, 1e-12)
    row("k×b = (−3, 1), length |b|", np.r_[kb, V.norm(kb)], [-3, 1, np.sqrt(10)], 1e-12)
    rect_left = [[0, 0], list(p_ab), list(p_ab + kb), list(kb)]
    rect_right = [[0, 0], list(p_ba), list(p_ba - ka), list(-ka)]
    row("left rectangle corner (−2.2, 3.4)", rect_left[2], [-2.2, 3.4], 1e-12)
    row("right rectangle corner (2.538, −4.692)", rect_right[2], [2.538462, -4.692308], 1e-6)
    pair = {"a": A, "b": B, "a_dot_b": r6(ab), "b_dot_a": r6(ba), "norm_a": r6(na), "norm_b": r6(nb),
            "theta_deg": r6(th), "cos_theta": r6(np.cos(np.radians(th))),
            "shadow_a_on_b": r6(sh_ab), "shadow_b_on_a": r6(sh_ba), "proj_a_on_b": r6(p_ab), "proj_b_on_a": r6(p_ba),
            "k_cross_b": r6(kb), "k_cross_a": r6(ka), "rect_on_b": r6(rect_left), "rect_on_a": r6(rect_right),
            "area_on_b": r6(sh_ab * nb), "area_on_a": r6(sh_ba * na)}

    # ------------------------------------------------------------------ s4: cheap number, unit arrow, wind components
    f4 = "s4_cheap.json"
    scales = np.linspace(1.0, 1.0 / np.sqrt(10.0), 61)            # b shrinks smoothly to the unit arrow b-hat
    b_series = np.outer(scales, B)
    dots_series = call(VEC + "dot", "s4", f4, "(K 2.2) a·(s b)", a=A, b=b_series)
    sh_series = call(VEC + "scalar_projection", "s4", f4, "(0A.3) shadow independent of |b|", a=A, b=b_series)
    len_series = V.norm(b_series)
    bhat = b_series[-1]
    xh, yh = [1.0, 0.0], [0.0, 1.0]
    u_x = call(VEC + "dot", "s4", f4, "u·x̂", a=U_WIND, b=xh)
    u_y = call(VEC + "dot", "s4", f4, "u·ŷ", a=U_WIND, b=yh)
    nu = call(VEC + "norm", "s4", f4, "|u|", a=U_WIND)
    row("b̂ = (0.316, 0.949), |b̂| = 1", np.r_[bhat, len_series[-1]], [0.316228, 0.948683, 1.0], 1e-6)
    row("a·b̂ = shadow = 2.530", dots_series[-1], 8 / np.sqrt(10), 1e-12)
    row("shadow unchanged while b shrinks", np.ptp(sh_series), 0.0, 1e-12)
    row("a·(s b) = s · 8", dots_series, 8 * scales, 1e-12)
    row("u·x̂ = 6, u·ŷ = 8, |u| = 10", [u_x, u_y, nu], [6, 8, 10], 1e-12)
    cheap = {"a": A, "b": B, "scales": r6(scales), "b_series": r6(b_series), "len_series": r6(len_series),
             "dot_series": r6(dots_series), "shadow_series": r6(sh_series), "b_hat": r6(bhat),
             "a_dot_b": r6(ab), "norm_b": r6(nb), "shadow": r6(sh_ab),
             "u": U_WIND, "x_hat": xh, "y_hat": yh, "u_dot_xhat": r6(u_x), "u_dot_yhat": r6(u_y), "norm_u": r6(nu),
             "proj_u_on_xhat": r6(V.projection(U_WIND, xh))}

    # ------------------------------------------------------------------ s5: work
    f5 = "s5_work.json"
    Fv = F_N * np.array([np.cos(np.radians(F_DEG)), np.sin(np.radians(F_DEG))])
    d_len = np.linspace(5.0, 10.0, 51)
    d_series = np.stack([d_len, 0 * d_len], axis=-1)
    W_series = call(VEC + "dot", "s5", f5, "W = F·d", a=Fv.tolist(), b=d_series)
    shF = call(VEC + "scalar_projection", "s5", f5, "shadow of F on d", a=Fv.tolist(), b=D5)
    shF10 = V.scalar_projection(Fv, D10)
    row("shadow of F on d = 20 cos 60° = 10 N", shF, 10.0, 1e-12)
    row("W(5 m) = 50 J, W(10 m) = 100 J", [W_series[0], W_series[-1]], [50, 100], 1e-12)
    row("shadow unchanged when d doubles", shF10, shF, 1e-12)
    work = {"F": r6(Fv), "F_N": F_N, "F_deg": F_DEG, "d_m": r6(d_len), "W_J": r6(W_series), "shadow_N": r6(shF),
            "shadow_N_d10": r6(shF10), "angle_deg": r6(V.angle_between(Fv, D5, degrees=True))}

    # ------------------------------------------------------------------ s6-s7: advection
    f6 = "s6_s7_advection.json"
    u = U_ADV * np.array([np.cos(np.radians(U_ADV_DEG)), np.sin(np.radians(U_ADV_DEG))])
    g1, g2 = [G1, 0.0], [G2, 0.0]
    adv1 = call(VEC + "dot", "s6", f6, "u·∇T (Vallis (1.7) advection term)", a=u.tolist(), b=g1)
    adv2 = call(VEC + "dot", "s7", f6, "u·∇T, map twice as steep", a=u.tolist(), b=g2)
    sh_u1 = call(VEC + "scalar_projection", "s6", f6, "shadow of u on ∇T", a=u.tolist(), b=g1)
    sh_u2 = V.scalar_projection(u, g2)
    ngrad = V.norm(g1)
    ux = float(V.dot(u, [1.0, 0.0]))                         # eastward part: the isotherms slide at this speed
    row("shadow of u on ∇T = 5.00 m/s", sh_u1, 5.0, 1e-12)
    row("u·∇T = 5.00e-5 K/s", adv1, 5e-5, 1e-17)
    row("u·∇T = 0.180 K/h", adv1 * 3600, 0.18, 1e-12)
    row("steep: shadow still 5.00, u·∇T doubles", [sh_u2, adv2 / adv1], [5.0, 2.0], 1e-12)
    # independent cross-check: T(x, t) = T0 + G (x − u_x t) carried by the wind (each parcel keeps its T)
    for G, adv in ((G1, adv1), (G2, adv2)):
        Tf = lambda x, t, G=G: T_WEST + G * (x[0] - ux * t)  # noqa: E731
        uf = lambda x, t: np.array([u[0], u[1]])  # noqa: E731
        mdt = material_derivative_terms(Tf, uf, np.array([PROBE_KM[0] * 1e3, PROBE_KM[1] * 1e3]), 0.0, h=10.0, ht=10.0)
        row(f"material_derivative_terms G={G:g}: local = −u·∇T, advective = u·∇T, total 0",
            [mdt.local, mdt.advective, mdt.total], [-adv, adv, 0.0], 1e-12)
    t_h = np.linspace(0.0, 6.0, 121)
    T0p1 = T_WEST + G1 * PROBE_KM[0] * 1e3   # 13 °C at the pin
    T0p2 = T_WEST + G2 * PROBE_KM[0] * 1e3   # 16 °C at the pin on the steep map
    dTdt1, dTdt2 = -adv1, -adv2               # ∂T/∂t = −u·∇T when DT/Dt = 0
    Tp1 = T0p1 + dTdt1 * t_h * 3600
    Tp2 = T0p2 + dTdt2 * t_h * 3600
    shift_km = ux * t_h * 3600 / 1e3
    row("T(pin) 13.00 → 12.82 after 1 h → 11.92 after 6 h", [Tp1[0], Tp1[20], Tp1[-1]], [13.0, 12.82, 11.92], 1e-9)
    row("−4.32 K per day", dTdt1 * 86400, -4.32, 1e-12)
    rng = np.random.default_rng(20261022)
    n_par = 42
    x0 = rng.uniform(0, MAP_KM[0], n_par)
    y0 = rng.uniform(0, MAP_KM[1], n_par)
    px = x0[:, None] + u[0] * t_h[None, :] * 3600 / 1e3       # unwrapped km; the composition wraps into the map
    py = y0[:, None] + u[1] * t_h[None, :] * 3600 / 1e3
    adv = {"u": r6(u), "speed": U_ADV, "angle_deg": U_ADV_DEG, "gradT": [G1, 0.0], "gradT_steep": [G2, 0.0],
           "norm_gradT": r6(ngrad), "shadow_m_s": r6(sh_u1), "shadow_steep_m_s": r6(sh_u2),
           "u_dot_gradT": float(f"{adv1:.6e}"), "u_dot_gradT_steep": float(f"{adv2:.6e}"),
           "K_per_h": r6(adv1 * 3600), "K_per_h_steep": r6(adv2 * 3600), "K_per_day": r6(adv1 * 86400),
           "u_x": r6(ux), "T_west": T_WEST, "map_km": list(MAP_KM), "probe_km": list(PROBE_KM),
           "t_h": r6(t_h), "shift_km": r6(shift_km), "T_pin": r6(Tp1), "T_pin_steep": r6(Tp2),
           "parcels_x0": r6(x0), "parcels_y0": r6(y0), "parcels_x_km": r6(px), "parcels_y_km": r6(py),
           "lut_thermal": thermal_lut(64), "lut_range_C": [10.0, 22.0]}

    # ------------------------------------------------------------------ s8: b swings, |b| fixed
    f8 = "s8_sign.json"
    th0 = float(th)
    grid = np.unique(np.round(np.r_[np.arange(th0, 180.0, 0.05), th0, 90.0, 120.0, 180.0], 9))
    phi_a = np.arctan2(A[1], A[0])
    grid[0] = th0                                   # the exact angle of (1, 3), unrounded
    bs = np.sqrt(10.0) * np.stack([np.cos(phi_a + np.radians(grid)), np.sin(phi_a + np.radians(grid))], axis=-1)
    bs[0] = B                                       # start from b = (1, 3) itself (differs from the formula by ~1e-16)
    d8 = call(VEC + "dot", "s8", f8, "(0A.1) a·b as b swings", a=A, b=bs)
    s8 = call(VEC + "scalar_projection", "s8", f8, "(0A.3) signed shadow", a=A, b=bs)
    p8 = call(VEC + "projection", "s8", f8, "shadow vector on b's line", a=A, b=bs)
    t8 = call(VEC + "angle_between", "s8", f8, "θ readout", a=A, b=bs, degrees=True)
    k8 = call(VEC + "k_cross", "s8", f8, "rectangle side ⟂ b", u=bs)
    i90, i120, i180 = (int(np.argmin(np.abs(grid - g))) for g in (90.0, 120.0, 180.0))
    row("θ readout = swing angle", t8, grid, 1e-9)
    row("first sample is b = (1, 3)", bs[0], B, 1e-12)
    row("θ=90: a·b = 0, shadow 0", [d8[i90], s8[i90]], [0, 0], 1e-12)
    # independent route: b(120°) = (|b|/|a|) R(120°) a; the storyboard's (−2.087, 2.375) truncates 2.3758 (shown 2.376)
    c, s_ = np.cos(np.radians(120)), np.sin(np.radians(120))
    row("θ=120: b = (|b|/|a|) R(120°) a = (−2.087, 2.376)", bs[i120],
        np.sqrt(10 / 26) * np.array([c * A[0] - s_ * A[1], s_ * A[0] + c * A[1]]), 1e-12)
    row("θ=120: a·b = −8.062, shadow −2.550", [d8[i120], s8[i120]], [-8.062258, -2.549510], 1e-6)
    row("θ=180: b = (−3.101, −0.620)", bs[i180], [-3.101, -0.620], 5e-4)
    row("θ=180: a·b = −|a||b| = −16.12, shadow −5.099", [d8[i180], s8[i180]], [-np.sqrt(260), -np.sqrt(26)], 1e-9)
    row("θ=180: shadow vector is a itself", p8[i180], A, 1e-12)
    row("cos θ = a·b/(|a||b|) at 180° = −1", d8[i180] / np.sqrt(260), -1.0, 1e-12)
    row("a·b = shadow × |b| on every sample", d8, s8 * np.sqrt(10), 1e-12)
    sign = {"a": A, "norm_a": r6(na), "norm_b": r6(nb), "theta_deg": r6(grid), "b": r6(bs), "a_dot_b": r6(d8),
            "shadow": r6(s8), "proj": r6(p8), "k_cross_b": r6(k8), "theta_readout_deg": r6(t8),
            "i90": i90, "i120": i120, "i180": i180, "minus_norm_a_norm_b": r6(-np.sqrt(260))}

    for r in rows:
        print(f"  {'PASS' if r['pass'] else 'FAIL'}  {r['name']}")
    if not all(r["pass"] for r in rows):
        print("build_ch00_dot_product_why: checks FAILED — no data written")
        return 1

    files = {f1: pair, f4: cheap, f5: work, f6: adv, f8: sign}
    data_hashes = {}
    for name, obj in files.items():
        blob = json.dumps(obj, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
        (DATA / name).write_bytes(blob)
        data_hashes[name] = hashlib.sha256(blob).hexdigest()
    manifest = {
        "id": "ch00_dot_product_why", "storyboard": "movies/ch00/ch00_dot_product_why/storyboard.yaml",
        "builder": "movies/data/build_ch00_dot_product_why.py",
        "fluidpy": {"repo": "../Fluid Dynamics", **git_sha(FLUID)},
        "equations": {"(K 2.2)": "Kundu §2.1 a·b = a_i b_i", "(0A.1)": "a·b = |a||b| cos θ (our Chapter-0 label)",
                      "(0A.3)": "|a| cos θ = a·b̂ = a·b/|b| (ours)", "(1.7)": "Vallis §1.1 Dφ/Dt = ∂φ/∂t + (v·∇)φ"},
        "parameters": {"a": A, "b": B, "u_wind_s4_m_s": U_WIND, "F_N": F_N, "F_angle_deg": F_DEG, "d_m": [5, 10],
                       "u_s6_m_s": U_ADV, "u_angle_from_gradT_deg": U_ADV_DEG, "gradT_K_m": [G1, G2],
                       "T_west_C": T_WEST, "map_km": list(MAP_KM), "probe_km": list(PROBE_KM),
                       "time_compression": "6 h in 6 s (×3600)", "parcel_seed": 20261022,
                       "s8_theta_grid": "angle_between(a, b) … 180° step 0.05° plus 90, 120, 180 exactly"},
        "js_selftest": "none — the composition has no JS physics; every number is read from data/*.json",
        "data_files": data_hashes, "checks": rows, "physics": entries,
    }
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=1, ensure_ascii=False), encoding="utf-8")
    print(f"build_ch00_dot_product_why: {len(files)} data files + manifest.json ({len(entries)} parity entries) -> {OUT}")
    for k, v in data_hashes.items():
        print(f"  {k}  sha256 {v[:16]}…  {(DATA / k).stat().st_size / 1e3:.1f} kB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
