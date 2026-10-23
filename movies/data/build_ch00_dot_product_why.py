"""Physics data for the Chapter-0A movie "What the dot product measures, and why it multiplies by the other length"
(movies/ch00/ch00_dot_product_why/storyboard.yaml, round 4: 21 scenes).

Run with the main venv::

    .venv/Scripts/python.exe movies/data/build_ch00_dot_product_why.py

Every number the movie shows is computed here by the tested functions named in the storyboard's ``physics_source``
fields: ``fluidpy.geo.vectors`` (``dot``, ``norm``, ``angle_between``, ``scalar_projection``, ``projection``,
``k_cross``), ``fluidpy.core.operators.gradient`` (∇T on the 5-km map grid, s15) and
``fluidpy.core.kinematics.material_derivative_terms`` (local / advective / total rates, s14, s18-s20, as an independent
cross-check of ∂T/∂t = −v·∇T). The composition (movies/src/ch00/DotProductWhy.tsx) only indexes these samples by
frame; it never recomputes physics. The wind is called **v** throughout (Vallis's letter in (1.7)).

Writes movies/ch00/ch00_dot_product_why/data/{pair,same_way,cheap,work,weather}.json and
movies/ch00/ch00_dot_product_why/manifest.json (function, equation, parameters, fluidpy git SHA + sha256 of the source
files, sha256 of each data file, and a parity hash per call computed the way tools/movie_qa.py re-computes it).
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
from fluidpy.core.operators import gradient  # noqa: E402
from fluidpy.geo import vectors as V  # noqa: E402

A = [5.0, 1.0]          # arrow a (teal)
B = [1.0, 3.0]          # arrow b (orange)
P7 = [3.0, 0.0]         # s07 arrow p (teal)
Q7 = [[2.0, 0.0], [0.0, 2.0], [-2.0, 0.0]]   # s07 arrows q (orange): same way, right angle, opposite
COS_PAIRS = {"0": ([3.0, 0.0], [2.0, 0.0]), "90": ([3.0, 0.0], [0.0, 2.0]), "180": ([3.0, 0.0], [-2.0, 0.0])}
V_WIND11 = [6.0, 8.0]   # s11 wind v, m/s
F_N, F_DEG = 20.0, 60.0  # s12 force
D5, D10 = [5.0, 0.0], [10.0, 0.0]
V_SPEED, V_DEG = 10.0, 60.0             # s14-s20 wind speed m/s and angle from grad T (east)
G1, G2 = 1.0e-5, 2.0e-5                 # K/m: 1 K per 100 km, then twice as steep
T_WEST = 10.0                           # °C at x = 0 km (first map)
T_PIN = 13.0                            # °C at the pin: the steep map is built around it
PIN_KM = (300.0, 180.0)
MAP_KM = (600.0, 360.0)
H_GRID = 5000.0                         # m, map grid spacing for ∇T (s15)


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
    files = {"vectors_py": "fluidpy/geo/vectors.py", "kinematics_py": "fluidpy/core/kinematics.py",
             "operators_py": "fluidpy/core/operators.py"}
    out = {"commit": run("rev-parse", "HEAD"),
           "dirty_tracked": bool(run("status", "--porcelain", "--untracked-files=no"))}
    for k, rel in files.items():
        out[f"{k}_tracked"] = bool(run("ls-files", rel))
        out[f"{k}_sha256"] = hashlib.sha256((repo / rel).read_bytes()).hexdigest()
    return out


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
    # ------------------------------------------------------------------ s01-s10, s21: the pair a = (5, 1), b = (1, 3)
    f1 = "pair.json"
    ab = call(VEC + "dot", "s01,s05,s06,s09", f1, "(K 2.2)", a=A, b=B)
    na = call(VEC + "norm", "s02,s06", f1, "|a| (Pythagoras)", a=A)
    nb = call(VEC + "norm", "s02,s06", f1, "|b| (Pythagoras)", a=B)
    th = call(VEC + "angle_between", "s06", f1, "(0A.1)", a=A, b=B, degrees=True)
    sh_ab = call(VEC + "scalar_projection", "s08-s10", f1, "(0A.3)", a=A, b=B)
    sh_ba = call(VEC + "scalar_projection", "s10", f1, "(0A.3)", a=B, b=A)
    p_ab = call(VEC + "projection", "s08-s10", f1, "(0A.3) times b-hat: foot of the drop-line", a=A, b=B)
    p_ba = call(VEC + "projection", "s10", f1, "(0A.3) times a-hat", a=B, b=A)
    kb = call(VEC + "k_cross", "s09,s10", f1, "rectangle side perpendicular to b", u=B)
    ka = call(VEC + "k_cross", "s10", f1, "rectangle side perpendicular to a", u=A)
    bhat = np.asarray(B) / nb
    a_bhat = call(VEC + "dot", "s08", f1, "(0A.3) a·b-hat", a=A, b=bhat.tolist())
    n_bhat = call(VEC + "norm", "s08", f1, "|b-hat| = 1", a=bhat.tolist())
    terms5 = [A[0] * B[0], A[1] * B[1], 0.0]           # 5·1, 1·3, 0·0 (the z-parts of the flat picture)
    terms8 = [A[0] * bhat[0], A[1] * bhat[1]]          # 5 × 0.316, 1 × 0.949
    cos_rem = {k: call(VEC + "angle_between", "s06", f1, f"cos reminder {k}°", a=p, b=q, degrees=True)
               for k, (p, q) in COS_PAIRS.items()}
    ba = V.dot(B, A)
    row("a·b = 5·1 + 1·3 = 8", ab, 8.0, 1e-12)
    row("terms 5, 3, 0 sum to a·b", sum(terms5), ab, 1e-12)
    row("|a| = √26 = 5.099", na, np.sqrt(26), 1e-12)
    row("|b| = √10 = 3.162", nb, np.sqrt(10), 1e-12)
    row("|a|² = 26, |b|² = 10 (Pythagoras)", [na ** 2, nb ** 2], [26, 10], 1e-12)
    row("θ = 60.255°", th, 60.2551187, 1e-6)
    row("(0A.1) |a||b|cos θ = a·b", na * nb * np.cos(np.radians(th)), ab, 1e-12)
    row("cos θ = 0.496", np.cos(np.radians(th)), 8 / np.sqrt(260), 1e-12)
    row("cos reminder: 0°, 90°, 180° → cos 1, 0, −1",
        [np.cos(np.radians(cos_rem[k])) for k in ("0", "90", "180")], [1, 0, -1], 1e-12)
    row("shadow a on b = 8/√10 = 2.530", sh_ab, 8 / np.sqrt(10), 1e-12)
    row("shadow b on a = 8/√26 = 1.569", sh_ba, 8 / np.sqrt(26), 1e-12)
    row("shadow = |a| cos θ (s08 step 2)", sh_ab, na * np.cos(np.radians(th)), 1e-12)
    row("projection a on b = (0.8, 2.4) (foot of the drop-line)", p_ab, [0.8, 2.4], 1e-12)
    row("projection b on a = (1.538, 0.308)", p_ba, [20 / 13, 4 / 13], 1e-12)
    row("(a − proj)·b = 0 (drop-line at right angles)", V.dot(np.subtract(A, p_ab), B), 0.0, 1e-12)
    row("b̂ = (0.316, 0.949), |b̂| = 1", np.r_[bhat, n_bhat], [0.316228, 0.948683, 1.0], 1e-6)
    row("a·b̂ = 1.581 + 0.949 = 2.530 = shadow", [terms8[0], terms8[1], a_bhat], [1.581139, 0.948683, sh_ab], 1e-6)
    row("symmetry a·b = b·a", ab, ba, 0.0)
    row("left rectangle area = shadow_ab × |b| = 8", sh_ab * nb, 8.0, 1e-12)
    row("right rectangle area = shadow_ba × |a| = 8", sh_ba * na, 8.0, 1e-12)
    row("k×b = (−3, 1), length |b|", np.r_[kb, V.norm(kb)], [-3, 1, np.sqrt(10)], 1e-12)
    rect_left = [[0, 0], list(p_ab), list(p_ab + kb), list(kb)]
    rect_right = [[0, 0], list(p_ba), list(p_ba - ka), list(-ka)]
    row("s09 rectangle corners (0,0), (0.8,2.4), (−2.2,3.4), (−3,1)", np.ravel(rect_left),
        [0, 0, 0.8, 2.4, -2.2, 3.4, -3, 1], 1e-12)
    row("right rectangle corner (2.538, −4.692)", rect_right[2], [2.538462, -4.692308], 1e-6)
    pair = {"a": A, "b": B, "a_dot_b": r6(ab), "b_dot_a": r6(ba), "terms": r6(terms5), "norm_a": r6(na), "norm_b": r6(nb),
            "norm_a_sq": r6(na ** 2), "norm_b_sq": r6(nb ** 2),
            "theta_deg": r6(th), "cos_theta": r6(np.cos(np.radians(th))),
            "cos_reminder": {k: {"p": list(COS_PAIRS[k][0]), "q": list(COS_PAIRS[k][1]), "theta_deg": r6(cos_rem[k]),
                                 "cos": r6(np.cos(np.radians(cos_rem[k])))} for k in COS_PAIRS},
            "shadow_a_on_b": r6(sh_ab), "shadow_b_on_a": r6(sh_ba), "proj_a_on_b": r6(p_ab), "proj_b_on_a": r6(p_ba),
            "b_hat": r6(bhat), "norm_bhat": r6(n_bhat), "a_dot_bhat": r6(a_bhat), "a_bhat_terms": r6(terms8),
            "k_cross_b": r6(kb), "k_cross_a": r6(ka), "rect_on_b": r6(rect_left), "rect_on_a": r6(rect_right),
            "area_on_b": r6(sh_ab * nb), "area_on_a": r6(sh_ba * na)}

    # ------------------------------------------------------------------ s07: how much two arrows point the same way
    f7 = "same_way.json"
    pq = call(VEC + "dot", "s07", f7, "(K 2.2) p·q", a=P7, b=Q7)
    ang7 = call(VEC + "angle_between", "s07", f7, "angle p, q", a=P7, b=Q7, degrees=True)
    sh7 = call(VEC + "scalar_projection", "s07", f7, "shadow of p on q (signed)", a=P7, b=Q7)
    row("p·q = 6, 0, −6", pq, [6, 0, -6], 1e-12)
    row("angles 0°, 90°, 180°", ang7, [0, 90, 180], 1e-12)
    row("shadow of p on q = 3, 0, −3", sh7, [3, 0, -3], 1e-12)
    same_way = {"p": P7, "q": Q7, "p_dot_q": r6(pq), "angle_deg": r6(ang7), "shadow_p_on_q": r6(sh7),
                "norm_q": r6(V.norm(Q7))}

    # ------------------------------------------------------------------ s11: cheap number, unit arrow, wind v
    f11 = "cheap.json"
    scales = np.linspace(1.0, 1.0 / np.sqrt(10.0), 61)            # b shrinks smoothly to the unit arrow b-hat
    b_series = np.outer(scales, B)
    dots_series = call(VEC + "dot", "s11", f11, "(K 2.2) a·(s b)", a=A, b=b_series)
    sh_series = call(VEC + "scalar_projection", "s11", f11, "(0A.3) shadow independent of |b|", a=A, b=b_series)
    len_series = V.norm(b_series)
    xh = [1.0, 0.0]
    v_x = call(VEC + "dot", "s11", f11, "v·x̂ (eastward part)", a=V_WIND11, b=xh)
    nv = call(VEC + "norm", "s11", f11, "|v|", a=V_WIND11)
    row("b shrinks to b̂, |b̂| = 1", [*b_series[-1], len_series[-1]], [0.316228, 0.948683, 1.0], 1e-6)
    row("a·b̂ = shadow = 2.530", dots_series[-1], 8 / np.sqrt(10), 1e-12)
    row("shadow unchanged while b shrinks", np.ptp(sh_series), 0.0, 1e-12)
    row("a·(s b) = s · 8", dots_series, 8 * scales, 1e-12)
    row("v·x̂ = 6 × 1 + 8 × 0 = 6, |v| = 10", [v_x, nv], [6, 10], 1e-12)
    cheap = {"a": A, "b": B, "scales": r6(scales), "b_series": r6(b_series), "len_series": r6(len_series),
             "dot_series": r6(dots_series), "shadow_series": r6(sh_series), "b_hat": r6(bhat),
             "a_dot_b": r6(ab), "norm_b": r6(nb), "shadow": r6(sh_ab),
             "v": V_WIND11, "x_hat": xh, "v_dot_xhat": r6(v_x), "norm_v": r6(nv),
             "proj_v_on_xhat": r6(V.projection(V_WIND11, xh))}

    # ------------------------------------------------------------------ s12: work
    f12 = "work.json"
    Fv = F_N * np.array([np.cos(np.radians(F_DEG)), np.sin(np.radians(F_DEG))])
    d_len = np.linspace(5.0, 10.0, 51)
    d_series = np.stack([d_len, 0 * d_len], axis=-1)
    W_series = call(VEC + "dot", "s12", f12, "W = F·d", a=Fv.tolist(), b=d_series)
    shF = call(VEC + "scalar_projection", "s12", f12, "shadow of F on d", a=Fv.tolist(), b=D5)
    shF10 = V.scalar_projection(Fv, D10)
    row("F = (10.000, 17.321) N", Fv, [10.0, 17.320508], 1e-6)
    row("shadow of F on d = 20 cos 60° = 10 N", shF, 10.0, 1e-12)
    row("W(5 m) = 50 J, W(10 m) = 100 J", [W_series[0], W_series[-1]], [50, 100], 1e-12)
    row("shadow unchanged when d doubles", shF10, shF, 1e-12)
    work = {"F": r6(Fv), "F_N": F_N, "F_deg": F_DEG, "d_m": r6(d_len), "W_J": r6(W_series), "shadow_N": r6(shF),
            "shadow_N_d10": r6(shF10), "angle_deg": r6(V.angle_between(Fv, D5, degrees=True))}

    # ------------------------------------------------------------------ s14-s20: the weather (wind v)
    fw = "weather.json"
    v = V_SPEED * np.array([np.cos(np.radians(V_DEG)), np.sin(np.radians(V_DEG))])
    # s15: ∇T from the tested gradient on the 5-km map grid. T is an (ny, nx) array (x = last axis); fluidpy's partial
    # counts directions from the last axis, so gradient(T, h)[0] = ∂T/∂x and [1] = ∂T/∂y (checked by the rows below)
    xs = np.arange(0.0, MAP_KM[0] * 1e3 + 1, H_GRID)                     # 121 points, m
    ys = np.arange(0.0, MAP_KM[1] * 1e3 + 1, H_GRID)                     # 73 points, m
    TT = T_WEST + G1 * xs[None, :] + 0.0 * ys[:, None]                    # (ny, nx), T rises eastward only
    gfull = gradient(TT, H_GRID)                                          # (∂T/∂x, ∂T/∂y)
    # recorded call: a 25 × 25 window of the same grid centred on the pin (the field is uniform; full grid checked here)
    i0, j0 = int(round(PIN_KM[1] * 1e3 / H_GRID)), int(round(PIN_KM[0] * 1e3 / H_GRID))
    patch = TT[i0 - 12:i0 + 13, j0 - 12:j0 + 13]
    gpatch = call("fluidpy.core.operators.gradient", "s15", fw, "∇T = (∂T/∂x, ∂T/∂y), Kundu §2.9 (2-D)",
                  phi=patch, h=H_GRID)
    dTdx, dTdy = float(gpatch[0][12, 12]), float(gpatch[1][12, 12])
    row("∇T on the full 5-km grid: ∂T/∂x = 1e-5 K/m everywhere", gfull[0], G1, 1e-15)
    row("∇T on the full 5-km grid: ∂T/∂y = 0 everywhere", gfull[1], 0.0, 1e-15)
    row("∇T at the pin = (1.00e-5 K/m, 0)", [dTdx, dTdy], [G1, 0.0], 1e-15)
    gT = [dTdx, dTdy]
    ngrad = call(VEC + "norm", "s15", fw, "|∇T|", a=gT)
    row("|∇T| = 1.00e-5 K/m", ngrad, G1, 1e-15)
    g2 = [G2, 0.0]
    # s16: v·∇T = (shadow of v on ∇T) × |∇T|
    adv1 = call(VEC + "dot", "s16", fw, "v·∇T (Vallis (1.7) advection term, φ = T)", a=v.tolist(), b=gT)
    sh_v1 = call(VEC + "scalar_projection", "s16,s17", fw, "shadow of v on ∇T", a=v.tolist(), b=gT)
    nv_w = call(VEC + "norm", "s16,s17", fw, "|v|", a=v.tolist())
    ang_vg = call(VEC + "angle_between", "s16", fw, "angle between v and ∇T", a=v.tolist(), b=gT, degrees=True)
    adv2 = call(VEC + "dot", "s20", fw, "v·∇T, map twice as steep", a=v.tolist(), b=g2)
    sh_v2 = call(VEC + "scalar_projection", "s20", fw, "shadow of v on ∇T, steep map", a=v.tolist(), b=g2)
    row("v = (5.000, 8.660) m/s, |v| = 10, 60° from ∇T", [*v, nv_w, ang_vg], [5.0, 8.660254, 10.0, 60.0], 1e-6)
    row("shadow of v on ∇T = 10 cos 60° = 5.00 m/s", sh_v1, 5.0, 1e-12)
    row("v·∇T = shadow × |∇T| = 5.00e-5 K/s", [adv1, sh_v1 * ngrad], [5e-5, 5e-5], 1e-17)
    row("v·∇T by components: 5.00 × 1e-5 + 8.66 × 0", v[0] * gT[0] + v[1] * gT[1], adv1, 1e-18)
    row("v·∇T = 0.180 K/h", adv1 * 3600, 0.18, 1e-12)
    row("steep: shadow still 5.00, v·∇T doubles", [sh_v2, adv2 / adv1], [5.0, 2.0], 1e-12)
    # s17: what 0.180 K per hour means
    km_warm = sh_v1 * 3600 / 1e3               # km per hour towards warmer air
    km_wind = nv_w * 3600 / 1e3                 # km per hour along the wind
    T_under0 = T_WEST + G1 * PIN_KM[0] * 1e3
    T_under1 = T_WEST + G1 * (PIN_KM[0] * 1e3 + v[0] * 3600)   # map value under the balloon after 1 h
    row("18.0 km per hour towards warmer air, 36.0 km along the wind", [km_warm, km_wind], [18.0, 36.0], 1e-9)
    row("18.0 km × 1 K per 100 km = 0.180 K", km_warm * 1e3 * G1, 0.18, 1e-12)
    row("map under the balloon 13.00 → 13.18 °C after 1 h", [T_under0, T_under1], [13.0, 13.18], 1e-9)
    # s14 + s17: balloon path x(t) = x_pin + v t, one sample per minute for 3 h (unwrapped km; s17 uses the first hour)
    tb = np.linspace(0.0, 3 * 3600.0, 181)
    bal_x = PIN_KM[0] + v[0] * tb / 1e3
    bal_y = PIN_KM[1] + v[1] * tb / 1e3
    row("balloon after 1 h at (318.0, 211.18) km; after 3 h (354.0, 273.53)", [bal_x[60], bal_y[60], bal_x[-1], bal_y[-1]],
        [318.0, 211.176915, 354.0, 273.530744], 1e-5)
    # s18-s20: independent cross-check with material_derivative_terms on T(x, t) = T0 + G (x − v_x t)
    vx = float(V.dot(v, [1.0, 0.0]))
    T_west2 = T_PIN - G2 * PIN_KM[0] * 1e3     # steep map T = 13 °C + G2 (x − x_pin) → 7 °C at x = 0
    mdt_rows = {}
    for tag, G, adv, Tw in (("G1", G1, adv1, T_WEST), ("G2", G2, adv2, T_west2)):
        Tf = lambda x, t, G=G, Tw=Tw: Tw + G * (x[0] - vx * t)  # noqa: E731
        uf = lambda x, t: np.array([v[0], v[1]])  # noqa: E731
        mdt = material_derivative_terms(Tf, uf, np.array([PIN_KM[0] * 1e3, PIN_KM[1] * 1e3]), 0.0, h=10.0, ht=10.0)
        mdt_rows[tag] = {"local_K_s": float(f"{mdt.local:.6e}"), "advective_K_s": float(f"{mdt.advective:.6e}"),
                         "total_K_s": float(f"{mdt.total:.6e}")}
        row(f"material_derivative_terms {tag}: local = −v·∇T, advective = v·∇T, total DT/Dt = 0",
            [mdt.local, mdt.advective, mdt.total], [-adv, adv, 0.0], 1e-12)
    t_h = np.linspace(0.0, 6.0, 121)
    T0p1 = T_WEST + G1 * PIN_KM[0] * 1e3     # 13 °C at the pin
    T0p2 = T_west2 + G2 * PIN_KM[0] * 1e3     # 13 °C at the pin on the steep map too (same place, gradient ×2)
    dTdt1, dTdt2 = -adv1, -adv2               # ∂T/∂t = −v·∇T when DT/Dt = 0
    Tp1 = T0p1 + dTdt1 * t_h * 3600
    Tp2 = T0p2 + dTdt2 * t_h * 3600
    shift_km = vx * t_h * 3600 / 1e3
    row("T(pole) 13.00 → 12.82 after 1 h → 11.92 after 6 h", [Tp1[0], Tp1[20], Tp1[-1]], [13.0, 12.82, 11.92], 1e-9)
    row("steep map: T(pole) 13.00 → 12.64 after 1 h → 10.84 after 6 h", [Tp2[0], Tp2[20], Tp2[-1]],
        [13.0, 12.64, 10.84], 1e-9)
    row("steep map: 7 °C at x = 0, 19 °C at x = 600 km", [T_west2, T_west2 + G2 * MAP_KM[0] * 1e3], [7.0, 19.0], 1e-9)
    row("−4.32 K per day, −8.64 K per day (steep)", [dTdt1 * 86400, dTdt2 * 86400], [-4.32, -8.64], 1e-12)
    rng = np.random.default_rng(20261022)
    # s19-s20 parcels (wrapped by the composition): 42 random starts
    n_par = 42
    x0 = rng.uniform(0, MAP_KM[0], n_par)
    y0 = rng.uniform(0, MAP_KM[1], n_par)
    px = x0[:, None] + v[0] * t_h[None, :] * 3600 / 1e3       # unwrapped km
    py = y0[:, None] + v[1] * t_h[None, :] * 3600 / 1e3
    # s18 tagged parcels: a jittered 8 × 4 grid (tags must not overlap), 1 h of drift, each keeps its temperature
    gx, gy = np.meshgrid(np.linspace(40, 505, 8), np.linspace(40, 260, 4))
    tx0 = (gx + rng.uniform(-14, 14, gx.shape)).ravel()
    ty0 = (gy + rng.uniform(-10, 10, gy.shape)).ravel()
    tag_T = T_WEST + G1 * tx0 * 1e3                            # its temperature at t = 0: the label it keeps
    tag_x = tx0[:, None] + v[0] * tb[None, :61] / 1e3
    tag_y = ty0[:, None] + v[1] * tb[None, :61] / 1e3
    row("tagged parcels stay inside the map for 1 h", [tag_x.max() <= MAP_KM[0], tag_y.max() <= MAP_KM[1]], [1, 1], 0)
    weather = {"v": r6(v), "speed": V_SPEED, "angle_deg": r6(ang_vg), "gradT": gT, "gradT_steep": g2,
               "norm_gradT": r6(ngrad), "dTdx_K_m": dTdx, "dTdy_K_m": dTdy, "grid_h_m": H_GRID,
               "shadow_m_s": r6(sh_v1), "shadow_steep_m_s": r6(sh_v2), "norm_v": r6(nv_w),
               "v_dot_gradT": float(f"{adv1:.6e}"), "v_dot_gradT_steep": float(f"{adv2:.6e}"),
               "K_per_h": r6(adv1 * 3600), "K_per_h_steep": r6(adv2 * 3600), "K_per_day": r6(adv1 * 86400),
               "km_per_h_towards_warm": r6(km_warm), "km_per_h_along_wind": r6(km_wind),
               "warming_met_K": r6(km_warm * 1e3 * G1), "T_under_balloon": [r6(T_under0), r6(T_under1)],
               "balloon_t_s": r6(tb), "balloon_x_km": r6(bal_x), "balloon_y_km": r6(bal_y),
               # local tendency at the pole, ∂T/∂t = −v·∇T (signed; the composition prints the sign from these)
               "dTdt_K_s": float(f"{dTdt1:.6e}"), "dTdt_K_s_steep": float(f"{dTdt2:.6e}"),
               "dTdt_K_h": r6(dTdt1 * 3600), "dTdt_K_h_steep": r6(dTdt2 * 3600),
               "dTdt_K_day": r6(dTdt1 * 86400), "dTdt_K_day_steep": r6(dTdt2 * 86400), "T_west_steep": r6(T_west2),
               "material_derivative": mdt_rows,
               "v_x": r6(vx), "T_west": T_WEST, "T_pin": T_PIN, "map_km": list(MAP_KM), "pin_km": list(PIN_KM),
               "t_h": r6(t_h), "shift_km": r6(shift_km), "T_pole": r6(Tp1), "T_pole_steep": r6(Tp2),
               "parcels_x_km": r6(px), "parcels_y_km": r6(py),
               "tags_x_km": r6(tag_x), "tags_y_km": r6(tag_y), "tags_T": r6(tag_T),
               "lut_thermal": thermal_lut(64), "lut_range_C": [4.0, 20.0]}

    for r in rows:
        print(f"  {'PASS' if r['pass'] else 'FAIL'}  {r['name']}")
    if not all(r["pass"] for r in rows):
        print("build_ch00_dot_product_why: checks FAILED — no data written")
        return 1

    files = {f1: pair, f7: same_way, f11: cheap, f12: work, fw: weather}
    for old in DATA.glob("*.json"):                     # round-3 files (s1_s3_pair.json …) are replaced
        if old.name not in files:
            old.unlink()
    data_hashes = {}
    for name, obj in files.items():
        blob = json.dumps(obj, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
        (DATA / name).write_bytes(blob)
        data_hashes[name] = hashlib.sha256(blob).hexdigest()
    manifest = {
        "id": "ch00_dot_product_why", "storyboard": "movies/ch00/ch00_dot_product_why/storyboard.yaml",
        "builder": "movies/data/build_ch00_dot_product_why.py",
        "fluidpy": {"repo": "../Fluid Dynamics", **git_sha(FLUID)},
        "equations": {"(K 2.2)": "Kundu §2.1 p. 41: a·b = a1b1 + a2b2 + a3b3 ≡ a_i b_i",
                      "(0A.1)": "a·b = |a||b| cos θ (our Chapter-0 label; Kundu §2.8 p. 52 unnumbered)",
                      "(0A.3)": "|a| cos θ = a·b̂ = a·b/|b| (ours; derived on screen in s08)",
                      "(Vallis 1.7)": "Vallis §1.1.2 p. 5: Dφ/Dt = ∂φ/∂t + (v·∇)φ",
                      "gradient": "Kundu §2.9 p. 52: ∇φ = e_i ∂φ/∂x_i (2-D here)",
                      "∂T/∂t = −v·∇T": "(Vallis 1.7) with φ = T and DT/Dt = 0 (derived on screen in s18)"},
        "parameters": {"a": A, "b": B, "p_s07": P7, "q_s07": Q7, "v_wind_s11_m_s": V_WIND11, "F_N": F_N,
                       "F_angle_deg": F_DEG, "d_m": [5, 10], "v_speed_m_s": V_SPEED, "v_angle_from_gradT_deg": V_DEG,
                       "gradT_K_m": [G1, G2], "grid_h_m": H_GRID, "T_west_C": T_WEST, "T_pin_C": T_PIN,
                       "steep_map": "T = 13 °C + 2e-5 K/m (x − x_pin)", "map_km": list(MAP_KM), "pin_km": list(PIN_KM),
                       "time_compression": {"s14": "1 h in 3 s (×1200)", "s17": "1 h in 4 s (×900)",
                                            "s18": "×1200", "s19_s20": "6 h in 6 s (×3600)"},
                       "parcel_seed": 20261022},
        "js_selftest": "none — the composition has no JS physics; every number is read from data/*.json",
        "data_files": data_hashes, "checks": rows, "physics": entries,
    }
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=1, ensure_ascii=False), encoding="utf-8")
    print(f"build_ch00_dot_product_why: {len(files)} data files + manifest.json ({len(entries)} parity entries, "
          f"{len(rows)} checks) -> {OUT}")
    for k, val in data_hashes.items():
        print(f"  {k}  sha256 {val[:16]}…  {(DATA / k).stat().st_size / 1e3:.1f} kB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
