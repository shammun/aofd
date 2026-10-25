"""Physics data for the Chapter-0A movie "What the dot product measures, and why it multiplies by the other length"
(movies/ch00/ch00_dot_product_why/storyboard.yaml, version 6: 28 scenes; v5 adds N1-N12, v6 adds V1-V5 and V7:
sweep.json for the s00 title, the forward span / strip of s17, the frozen-map Case 1 of s17b, the queued parcels of
s19a, the camera zoom window and the s19d three-rates grid).

Run with the main venv::

    .venv/Scripts/python.exe movies/data/build_ch00_dot_product_why.py

Every number the movie shows is computed here by the tested functions named in the storyboard's ``physics_source``
fields: ``fluidpy.geo.vectors`` (``dot``, ``norm``, ``angle_between``, ``scalar_projection``, ``projection``,
``k_cross``), ``fluidpy.core.operators.gradient`` (∇T on the 5-km map grid, s15) and
``fluidpy.core.kinematics.material_derivative_terms`` (local / advective / total rates, s14, s18-s20, as an independent
cross-check of ∂T/∂t = −v·∇T). v4 adds the isotherm positions (s14), the along-isotherm part of the wind (s16, via
``projection``) and the upwind track (s19, recorded ``dot`` calls). The composition (movies/src/ch00/DotProductWhy.tsx) only indexes these samples by
frame; it never recomputes physics. The wind is called **v** throughout. The ``eq`` strings in the manifest are
provenance for QA and review only; the movie draws no equation labels (storyboard rule G1).

Writes movies/ch00/ch00_dot_product_why/data/{pair,same_way,cheap,work,weather,sweep}.json and
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


def clock_rate() -> str:
    """ONE model clock for s12, s18, s19a, s20 (storyboard clock_rate): 0 h on the spoken 'thirteen' and 3 h on
    'twelve point four six' in s19a sentence 2 (clip-proportional character times from timing.json, the same rule as
    AT() in DotProductWhy.tsx)."""
    tp = OUT / "timing.json"
    if not tp.exists():
        return "timing.json missing"
    scs = {s["id"]: s for s in json.loads(tp.read_text(encoding="utf-8"))["scenes"]}
    if "s19a_pole_cools" not in scs or "s17b_frozen" not in scs:
        return "v6 scenes not in timing.json"

    def rate(sid: str, j: int, p1: str, p3: str) -> float:
        s = scs[sid]["sentences"][j]
        at = lambda ph: s["start"] + (s["end"] - s["start"]) * s["text"].index(ph) / len(s["text"])  # noqa: E731
        return (at(p3) - at(p1)) / 2.0                     # whole hours 1 and 3 on the spoken numbers
    r19 = rate("s19a_pole_cools", 5, "twelve point eight two after", "twelve point four six after")
    r17 = rate("s17b_frozen", 2, "thirteen point one eight after", "thirteen point five four after")
    return {"s19a (also s12, s18, s20)": f"1 h in {r19:.3f} s (x {3600 / r19:.0f})",
            "s17b": f"1 h in {r17:.3f} s (x {3600 / r17:.0f})", "s00": "1 h in 4.000 s (x 900), title"}


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
    ab = call(VEC + "dot", "s01,s03,s08,s09", f1, "Kundu (2.2) definition (provenance)", a=A, b=B)
    na = call(VEC + "norm", "s02,s04", f1, "|a| (Pythagoras)", a=A)
    nb = call(VEC + "norm", "s02,s04", f1, "|b| (Pythagoras)", a=B)
    th = call(VEC + "angle_between", "s04", f1, "cosine form (1), Kundu §2.8 unnumbered (provenance)", a=A, b=B, degrees=True)
    sh_ab = call(VEC + "scalar_projection", "s06-s09", f1, "shadow = a·b/|b| (ours)", a=A, b=B)
    sh_ba = call(VEC + "scalar_projection", "s09", f1, "shadow of b on a (ours)", a=B, b=A)
    p_ab = call(VEC + "projection", "s06-s09", f1, "shadow times b-hat: foot of the drop-line", a=A, b=B)
    p_ba = call(VEC + "projection", "s09", f1, "shadow of b on a times a-hat", a=B, b=A)
    kb = call(VEC + "k_cross", "s08,s09", f1, "rectangle side perpendicular to b", u=B)
    ka = call(VEC + "k_cross", "s09", f1, "rectangle side perpendicular to a", u=A)
    bhat = np.asarray(B) / nb
    a_bhat = call(VEC + "dot", "s07", f1, "a·b-hat (ours)", a=A, b=bhat.tolist())
    n_bhat = call(VEC + "norm", "s07", f1, "|b-hat| = 1", a=bhat.tolist())
    terms5 = [A[0] * B[0], A[1] * B[1], 0.0]           # 5·1, 1·3, 0·0 (the z-parts of the flat picture)
    terms8 = [A[0] * bhat[0], A[1] * bhat[1]]          # 5 × 0.316, 1 × 0.949
    cos_rem = {k: call(VEC + "angle_between", "s04", f1, f"cos reminder {k}°", a=p, b=q, degrees=True)
               for k, (p, q) in COS_PAIRS.items()}
    ba = V.dot(B, A)
    row("a·b = 5·1 + 1·3 = 8", ab, 8.0, 1e-12)
    row("terms 5, 3, 0 sum to a·b", sum(terms5), ab, 1e-12)
    row("|a| = √26 = 5.099", na, np.sqrt(26), 1e-12)
    row("|b| = √10 = 3.162", nb, np.sqrt(10), 1e-12)
    row("|a|² = 26, |b|² = 10 (Pythagoras)", [na ** 2, nb ** 2], [26, 10], 1e-12)
    row("θ = 60.255°", th, 60.2551187, 1e-6)
    row("(1) |a||b|cos θ = a·b", na * nb * np.cos(np.radians(th)), ab, 1e-12)
    row("cos θ = 0.496", np.cos(np.radians(th)), 8 / np.sqrt(260), 1e-12)
    row("cos reminder: 0°, 90°, 180° → cos 1, 0, −1",
        [np.cos(np.radians(cos_rem[k])) for k in ("0", "90", "180")], [1, 0, -1], 1e-12)
    row("shadow a on b = 8/√10 = 2.530", sh_ab, 8 / np.sqrt(10), 1e-12)
    row("shadow b on a = 8/√26 = 1.569", sh_ba, 8 / np.sqrt(26), 1e-12)
    row("shadow = |a| cos θ (s06 row 2)", sh_ab, na * np.cos(np.radians(th)), 1e-12)
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
    row("s08 rectangle corners (0,0), (0.8,2.4), (−2.2,3.4), (−3,1)", np.ravel(rect_left),
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

    # ------------------------------------------------------------------ s05: how much two arrows point the same way
    f7 = "same_way.json"
    pq = call(VEC + "dot", "s05", f7, "definition 1, p·q", a=P7, b=Q7)
    ang7 = call(VEC + "angle_between", "s05", f7, "angle p, q", a=P7, b=Q7, degrees=True)
    sh7 = call(VEC + "scalar_projection", "s05", f7, "shadow of p on q (signed)", a=P7, b=Q7)
    row("p·q = 6, 0, −6", pq, [6, 0, -6], 1e-12)
    row("angles 0°, 90°, 180°", ang7, [0, 90, 180], 1e-12)
    row("shadow of p on q = 3, 0, −3", sh7, [3, 0, -3], 1e-12)
    same_way = {"p": P7, "q": Q7, "p_dot_q": r6(pq), "angle_deg": r6(ang7), "shadow_p_on_q": r6(sh7),
                "norm_q": r6(V.norm(Q7))}

    # ------------------------------------------------------------------ s07 (b shrinks to b-hat) and s10 (wind v, x-hat)
    f11 = "cheap.json"
    scales = np.linspace(1.0, 1.0 / np.sqrt(10.0), 61)            # b shrinks smoothly to the unit arrow b-hat
    b_series = np.outer(scales, B)
    dots_series = call(VEC + "dot", "s07", f11, "definition 1, a·(s b)", a=A, b=b_series)
    sh_series = call(VEC + "scalar_projection", "s07", f11, "shadow independent of |b|", a=A, b=b_series)
    len_series = V.norm(b_series)
    xh = [1.0, 0.0]
    v_x = call(VEC + "dot", "s10", f11, "v·x̂ (eastward part)", a=V_WIND11, b=xh)
    nv = call(VEC + "norm", "s10", f11, "|v|", a=V_WIND11)
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

    # ------------------------------------------------------------------ s11: work
    f12 = "work.json"
    Fv = F_N * np.array([np.cos(np.radians(F_DEG)), np.sin(np.radians(F_DEG))])
    d_len = np.linspace(5.0, 10.0, 51)
    d_series = np.stack([d_len, 0 * d_len], axis=-1)
    W_series = call(VEC + "dot", "s11", f12, "W = F·d", a=Fv.tolist(), b=d_series)
    shF = call(VEC + "scalar_projection", "s11", f12, "shadow of F on d", a=Fv.tolist(), b=D5)
    shF10 = V.scalar_projection(Fv, D10)
    row("F = (10.000, 17.321) N", Fv, [10.0, 17.320508], 1e-6)
    row("shadow of F on d = 20 cos 60° = 10 N", shF, 10.0, 1e-12)
    row("W(5 m) = 50 J, W(10 m) = 100 J", [W_series[0], W_series[-1]], [50, 100], 1e-12)
    row("shadow unchanged when d doubles", shF10, shF, 1e-12)
    work = {"F": r6(Fv), "F_N": F_N, "F_deg": F_DEG, "d_m": r6(d_len), "W_J": r6(W_series), "shadow_N": r6(shF),
            "shadow_N_d10": r6(shF10), "angle_deg": r6(V.angle_between(Fv, D5, degrees=True))}

    # ------------------------------------------------------------------ s12-s20: the weather (wind v)
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
    gpatch = call("fluidpy.core.operators.gradient", "s14,s15", fw, "∇T = (∂T/∂x, ∂T/∂y), Kundu §2.9 (2-D, provenance)",
                  phi=patch, h=H_GRID)
    dTdx, dTdy = float(gpatch[0][12, 12]), float(gpatch[1][12, 12])
    row("∇T on the full 5-km grid: ∂T/∂x = 1e-5 K/m everywhere", gfull[0], G1, 1e-15)
    row("∇T on the full 5-km grid: ∂T/∂y = 0 everywhere", gfull[1], 0.0, 1e-15)
    row("∇T at the pin = (1.00e-5 K/m, 0)", [dTdx, dTdy], [G1, 0.0], 1e-15)
    gT = [dTdx, dTdy]
    ngrad = call(VEC + "norm", "s15", fw, "|∇T|", a=gT)
    row("|∇T| = 1.00e-5 K/m", ngrad, G1, 1e-15)
    g2 = [G2, 0.0]
    # U-M4.3 (fix loop 3): |∇T| by Pythagoras on screen in s16b and s20, sqrt((∂T/∂x)² + (∂T/∂y)²)
    ngrad2 = call(VEC + "norm", "s20", fw, "|∇T| on the steep map (Pythagoras, U-M4.3)", a=g2)
    row("U-M4.3 |∇T| = sqrt((1.00e-5)² + 0²) = 1.00e-5 K/m", [ngrad, np.sqrt(gT[0] ** 2 + gT[1] ** 2)], [1e-5, 1e-5], 1e-18)
    row("U-M4.3 |∇T| steep = sqrt((2.00e-5)² + 0²) = 2.00e-5 K/m", [ngrad2, np.sqrt(g2[0] ** 2 + g2[1] ** 2)], [2e-5, 2e-5], 1e-18)
    # s16: v·∇T = (shadow of v on ∇T) × |∇T|
    adv1 = call(VEC + "dot", "s16", fw, "v·∇T, advection term of the material derivative, Vallis (1.7) (provenance)", a=v.tolist(), b=gT)
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
    # s16: the part of the wind along the isotherms, v − projection(v, ∇T)  (v4, new)
    pv = call(VEC + "projection", "s16", fw, "projection of v on ∇T (the part towards warmer air)", a=v.tolist(), b=gT)
    v_along = np.asarray(v) - np.asarray(pv)
    row("v − proj(v, ∇T) = (0, 8.660) m/s along the isotherm", v_along, [0.0, 8.660254], 1e-6)
    row("along-isotherm part ⟂ ∇T (dot = 0)", V.dot(v_along, gT), 0.0, 1e-18)
    # s14: isotherm positions x = (T − T_west)/G  (v4, new)
    iso_T = np.arange(11.0, 16.0)
    iso_km = (iso_T - T_WEST) / G1 / 1e3
    row("isotherms 11..15 °C at x = 100..500 km", iso_km, [100, 200, 300, 400, 500], 1e-9)
    row("tested gradient across the isotherms: 1 °C per 100 km", [dTdx * 1e5], [1.0], 1e-12)
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
    # s19 (v4, new): the upwind track. The air that reaches the pole after n hours is now at pin − v n h; its present
    # temperature is T_pin + ∇T·(−v n h), one recorded dot-product call per dot.
    up_t_h = [1, 2, 3]
    up_x, up_y, up_dT = [], [], []
    for n in up_t_h:
        off = (-np.asarray(v) * n * 3600.0).tolist()                     # m
        dT = call(VEC + "dot", "s19", fw, f"∇T·(−v t), upwind dot {n} h (ours)", a=gT, b=off)
        up_x.append(PIN_KM[0] + off[0] / 1e3)
        up_y.append(PIN_KM[1] + off[1] / 1e3)
        up_dT.append(float(dT))
    up_T = [T_PIN + d for d in up_dT]
    row("upwind dots: dT = −0.18, −0.36, −0.54 K", up_dT, [-0.18, -0.36, -0.54], 1e-12)
    row("upwind dots' temperature now = T(pole) at 1, 2, 3 h (t_h indices 20, 40, 60)", up_T,
        [Tp1[20], Tp1[40], Tp1[60]], 1e-9)
    row("upwind positions = balloon path run backwards (pin − v t)", np.r_[up_x, up_y],
        np.r_[2 * PIN_KM[0] - bal_x[[60, 120, 180]], 2 * PIN_KM[1] - bal_y[[60, 120, 180]]], 1e-9)
    row("upwind dots inside the map", [min(up_x) > 0, max(up_x) < MAP_KM[0], min(up_y) > 0, max(up_y) < MAP_KM[1]],
        [1, 1, 1, 1], 0)
    row("t_h samples at 1, 2, 3 h", [t_h[20], t_h[40], t_h[60]], [1.0, 2.0, 3.0], 1e-12)
    # s19: balloon path over the 6-h run, sampled at t_h (the balloon keeps 13.00 °C; it leaves the map near 5.8 h)
    bal6_x = PIN_KM[0] + v[0] * t_h * 3600 / 1e3
    bal6_y = PIN_KM[1] + v[1] * t_h * 3600 / 1e3
    row("balloon 6-h path matches the 3-h path at 1 h", [bal6_x[20], bal6_y[20]], [bal_x[60], bal_y[60]], 1e-9)
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
               "lut_thermal": thermal_lut(64), "lut_range_C": [4.0, 20.0],
               # v4 additions (storyboard new_builder_data)
               "isotherms_km": r6(iso_km), "isotherm_T_C": r6(iso_T), "v_along_isotherm_m_s": r6(v_along),
               "proj_v_on_gradT_m_s": r6(pv),
               "upwind_t_h": up_t_h, "upwind_x_km": r6(up_x), "upwind_y_km": r6(up_y), "upwind_dT_K": r6(up_dT),
               "upwind_T_C": r6(up_T), "balloon6_x_km": r6(bal6_x), "balloon6_y_km": r6(bal6_y)}

    # ================================================================== v5 additions (storyboard new_builder_data N1-N12)
    # N1 (s04): the display product of the rounded factors (R1): 5.099 × 3.162 × 0.496 = 7.997, shown "≈ 8"
    cos_th = float(np.cos(np.radians(th)))
    dcf = [round(float(na), 3), round(float(nb), 3), round(cos_th, 3)]
    dcp = dcf[0] * dcf[1] * dcf[2]
    row("N1 display product 5.099 × 3.162 × 0.496 within 0.005 of 8", abs(dcp - 8.0), 0.0, 0.005)
    row("N1 display product is NOT 8.000 to 3 dp (so the screen says ≈ 8)", round(dcp, 3) != 8.0, 1, 0)
    row("N1 display factors (5.099, 3.162, 0.496)", dcf, [5.099, 3.162, 0.496], 1e-12)
    # N2 (s07): the display sum with the shown digits (R2): 5 × 0.316 + 1 × 0.949 = 2.529, shown "≈ 2.53"
    dbh = [round(float(bhat[0]), 3), round(float(bhat[1]), 3)]
    dbt = [A[0] * dbh[0], A[1] * dbh[1]]
    dbs = dbt[0] + dbt[1]
    row("N2 display b̂ = (0.316, 0.949); terms 1.580, 0.949; sum 2.529", [*dbh, *dbt, dbs],
        [0.316, 0.949, 1.58, 0.949, 2.529], 1e-9)
    row("N2 |display sum − a·b̂| < 0.005", abs(dbs - a_bhat), 0.0, 0.005)
    # N3 (s16a): the along-isotherm part brings no change (recorded dot) and 10 sin 60° = 8.660
    along_dot = call(VEC + "dot", "s16a", fw, "v_along·∇T = 0: moving along an isotherm brings no change (ours)",
                     a=np.round(v_along, 12).tolist(), b=gT)
    row("N3 v_along·∇T = 0", along_dot, 0.0, 1e-18)
    row("N3 v_along[1] = 10 sin 60° = 8.660254", v_along[1], V_SPEED * np.sin(np.radians(V_DEG)), 1e-6)
    # N4 (s16b, s20): the display chains [shadow m/s, |∇T| K/m, v·∇T K/s, K per hour]
    chain1 = [float(sh_v1), float(ngrad), float(adv1), float(adv1 * 3600)]
    chain2 = [float(sh_v2), float(V.norm(g2)), float(adv2), float(adv2 * 3600)]
    row("N4 chain G1 = [5.00, 1.00e-5, 5.00e-5, 0.18]", chain1, [5.0, 1e-5, 5e-5, 0.18], 1e-12)
    row("N4 chain G2 = [5.00, 2.00e-5, 1.00e-4, 0.36]", chain2, [5.0, 2e-5, 1e-4, 0.36], 1e-12)
    row("N4 1 °C/100 km = 1 K/1e5 m = 1e-5 K/m; 1 °C/50 km = 2e-5 K/m", [1.0 / 1e5, 1.0 / 5e4], [G1, G2], 1e-18)
    # N5 (s18, s19a): sliding isotherms, one sample per minute over 0-3 h; shift = scalar_projection(v, x̂) t
    iso_t_h = np.linspace(0.0, 3.0, 181)
    v_east = call(VEC + "scalar_projection", "s18,s19a", fw, "eastward speed of the pattern v·x̂ (ours)",
                  a=v.tolist(), b=[1.0, 0.0])
    iso5_T = np.arange(10.0, 17.0)                                        # 10..16 °C
    iso5_x0 = (iso5_T - T_WEST) / G1 / 1e3                                # 0..600 km at t = 0
    iso_shift = float(v_east) * iso_t_h * 3600 / 1e3                      # km
    iso_x = iso5_x0[:, None] + iso_shift[None, :]
    row("N5 isotherm shift after 1 h = 18.0 km (t index 60)", iso_x[3, 60] - iso_x[3, 0], 18.0, 1e-9)
    row("N5 shift after 3 h = 54.0 km", iso_shift[-1], 54.0, 1e-9)
    # the map field T(x, t) = T_west + G (x − v_x t) evaluated on the 5-km profile (the composition only interpolates it)
    prof_x = np.arange(-200.0, 800.0 + 1e-9, 5.0)                         # km, wide enough for 3 h of sliding
    T_field = lambda xk, t_s, G=G1, Tw=T_WEST: Tw + G * (np.asarray(xk) * 1e3 - vx * t_s)  # noqa: E731
    prof_T1 = T_field(prof_x, 0.0)
    prof_T2 = T_field(prof_x, 0.0, G2, T_west2)
    row("profile: 13.00 °C at the pin (300 km), both maps", [np.interp(300, prof_x, prof_T1), np.interp(300, prof_x, prof_T2)],
        [13.0, 13.0], 1e-12)
    # N6 (s19a): the pole series evaluated on the sliding field (not the formula)
    pin_m = np.array(PIN_KM) * 1e3
    T_pole_field = T_field(PIN_KM[0], iso_t_h * 3600)
    row("N6 T_pole_field = 13 − 0.18 t", T_pole_field, 13.0 - 0.18 * iso_t_h, 1e-9)
    row("N6 T_pole_field at 0, 1, 2, 3 h = 13.00, 12.82, 12.64, 12.46", T_pole_field[[0, 60, 120, 180]],
        [13.0, 12.82, 12.64, 12.46], 1e-9)
    row("N6 material_derivative_terms local at the pin = −5.00e-5 K/s", mdt_rows["G1"]["local_K_s"], -5e-5, 1e-15)
    # N7 (s19a): the balloon series on the sliding field, and DT/Dt = 0 at its positions after 1, 2, 3 h
    bal_xm = pin_m[0] + v[0] * iso_t_h * 3600
    T_balloon_field = T_field(bal_xm / 1e3, iso_t_h * 3600)
    row("N7 T_balloon_field = 13.00 all along", T_balloon_field, 13.0, 1e-9)
    Tf1 = lambda x, t: T_WEST + G1 * (x[0] - vx * t)  # noqa: E731
    uf1 = lambda x, t: np.array([v[0], v[1]])  # noqa: E731
    bal_mdt = []
    for n in (1, 2, 3):
        xb = pin_m + v * n * 3600.0
        md = material_derivative_terms(Tf1, uf1, xb, n * 3600.0, h=10.0, ht=10.0)
        bal_mdt.append(float(f"{md.total:.6e}"))
    row("N7 material_derivative_terms total at the balloon after 1, 2, 3 h = 0", bal_mdt, [0, 0, 0], 1e-12)
    row("N7 balloon inside the map up to 3 h", [bal_x[-1] < MAP_KM[0], bal_y[-1] < MAP_KM[1]], [1, 1], 0)
    # N8 (s19c): the balance as bookkeeping: moved to a spot that read +0.18 t warmer on the t = 0 map; local −0.18 t
    bal_t = [1, 2, 3]
    moved, local = [], []
    for n in bal_t:
        mv = call(VEC + "dot", "s19c", fw, f"∇T·(v t), t = {n} h: moved to a spot that was warmer (ours)",
                  a=gT, b=(np.asarray(v) * n * 3600.0).tolist())
        moved.append(float(mv))
        xb = (pin_m[0] + v[0] * n * 3600.0) / 1e3
        local.append(float(T_field(xb, n * 3600.0) - T_field(xb, 0.0)))
    bsum = [m + lo for m, lo in zip(moved, local)]
    row("N8 moved = +0.18, +0.36, +0.54 K", moved, [0.18, 0.36, 0.54], 1e-12)
    row("N8 local = −0.18, −0.36, −0.54 K", local, [-0.18, -0.36, -0.54], 1e-9)
    row("N8 sums = 0", bsum, [0, 0, 0], 1e-9)
    row("N8 T_under_balloon[1] = 13.18 °C (t = 0 map)", T_under1, 13.18, 1e-9)
    iso_1318_x0 = (T_under1 - T_WEST) / G1 / 1e3
    row("N8 the 13.18 °C line of the t = 0 map lies under the 1-h balloon (x = 318 km)", iso_1318_x0, bal_x[60], 1e-9)
    # N9 (s17, s19a): the upwind track's far end, 4 h upwind
    far = np.array(PIN_KM) - v * 4 * 3600.0 / 1e3
    row("N9 upwind far point (228.0, 55.29) km inside the map", [*far, far[0] > 0, far[1] > 0], [228.0, 55.29234186, 1, 1], 1e-6)
    # upwind dots drifting with the air (per-minute tracks; each reaches the pole at n hours and stops there)
    up_tr_x = [np.minimum(up_x[i] + v[0] * iso_t_h * 3600 / 1e3, PIN_KM[0]).tolist() for i in range(3)]
    up_tr_y = [np.minimum(up_y[i] + v[1] * iso_t_h * 3600 / 1e3, PIN_KM[1]).tolist() for i in range(3)]
    row("upwind dot tracks reach the pole at 1, 2, 3 h", [up_tr_x[i][60 * (i + 1)] for i in range(3)], [300, 300, 300], 1e-9)
    # N10 (s17): across-isotherm and along-wind distance of the 1-h upwind dot
    off1 = (pin_m - np.array([up_x[0], up_y[0]]) * 1e3).tolist()
    across1 = call(VEC + "scalar_projection", "s17", fw, "across-isotherm distance of the 1-h upwind dot (m, ours)",
                   a=off1, b=gT)
    along1 = call(VEC + "norm", "s17", fw, "along-wind distance of the 1-h upwind dot (m)", a=off1)
    row("N10 across 18.0 km, along 36.0 km", [across1 / 1e3, along1 / 1e3], [18.0, 36.0], 1e-9)
    # N11 (s20): isotherms of the steep map, every 50 km (8..18 °C), sliding on the same clock
    isoS_T = np.arange(8.0, 19.0)
    isoS_x0 = (isoS_T - T_west2) / G2 / 1e3
    isoS_x = isoS_x0[:, None] + iso_shift[None, :]
    row("N11 steep isotherms at 50..550 km, spacing 50 km", [isoS_x0[0], isoS_x0[-1], np.ptp(np.diff(isoS_x0)),
                                                            np.diff(isoS_x0)[0]], [50, 550, 0, 50], 1e-9)
    T_pole_steep_field = T_field(PIN_KM[0], iso_t_h * 3600, G2, T_west2)
    row("N11 steep pole 13.00 → 12.64 after 1 h (field)", T_pole_steep_field[[0, 60]], [13.0, 12.64], 1e-9)
    # N12 (s11): work by components
    wct = [float(Fv[0] * D5[0]), float(Fv[1] * D5[1])]
    row("N12 10.000 × 5 + 17.321 × 0 = 50 J = W(5 m)", [*wct, sum(wct)], [50.0, 0.0, W_series[0]], 1e-9)
    # s17 / s19b / s19c display numbers
    row("0.18 °C per 18 km: 18 km × 1 °C/100 km = v·∇T × 1 h", 18.0 * 1.0 / 100.0, float(adv1 * 3600), 1e-12)

    # ================================================================== v6 additions (storyboard new_builder_data V1-V5)
    # V1 (s00_title): q of length 2 sweeps round p = (3, 0); one recorded dot call on the stacked q, one projection call
    fs = "sweep.json"
    sw_deg = np.arange(0.0, 360.0 + 1e-9, 2.0)                                # 181 samples
    sw_q = 2.0 * np.stack([np.cos(np.radians(sw_deg)), np.sin(np.radians(sw_deg))], axis=-1)
    sw_q = np.round(sw_q, 12)                                                  # exact zeros at 90°, 270°
    sw_dot = call(VEC + "dot", "s00", fs, "p·q(θ) for the title sweep (definition, ours)", a=P7, b=sw_q.tolist())
    sw_sh = call(VEC + "scalar_projection", "s00", fs, "shadow of q on p (signed, ours)", a=sw_q.tolist(), b=P7)
    row("V1 p·q = 6 cos θ on 181 samples", sw_dot, 6.0 * np.cos(np.radians(sw_deg)), 1e-11)
    row("V1 p·q at 0°, 90°, 180° = same_way.json (6, 0, −6)", np.asarray(sw_dot)[[0, 45, 90]], pq, 1e-11)
    row("V1 shadow of q on p = 2 cos θ", sw_sh, 2.0 * np.cos(np.radians(sw_deg)), 1e-11)
    sgn = np.sign(np.round(np.asarray(sw_dot), 9))
    row("V1 sign series runs + → 0 → − (first sign change at 90°)", [sgn[0], sgn[45], sgn[90]], [1, 0, -1], 0)
    sweep = {"p": P7, "q_len": 2.0, "theta_deg": r6(sw_deg), "q_xy": r6(sw_q), "p_dot_q": r6(sw_dot),
             "shadow_q_on_p": r6(sw_sh)}
    # V2 (s17_meaning): the forward meaning of +0.18 K per hour, the balloon parcel's 1-h span across the isotherms
    fwd_disp = (np.asarray(v) * 3600.0).tolist()
    fwd_across = call(VEC + "scalar_projection", "s17", fw, "1-h displacement across the isotherms (m, ours)", a=fwd_disp, b=gT)
    fwd_along = call(VEC + "norm", "s17", fw, "1-h displacement along the wind (m)", a=fwd_disp)
    fwd_span = [PIN_KM[0], PIN_KM[0] + float(fwd_across) / 1e3]
    T0 = lambda xk: T_WEST + G1 * np.asarray(xk) * 1e3  # noqa: E731   the t = 0 (frozen) map
    fwd_strip = [float(T0(fwd_span[0])), float(T0(fwd_span[1]))]
    row("V2 across 18.0 km, along 36.0 km", [fwd_across / 1e3, fwd_along / 1e3], [18.0, 36.0], 1e-9)
    row("V2 span = [300.0, 318.0] km; span end = balloon_x_km[60]", [*fwd_span, fwd_span[1] - bal_x[60]], [300.0, 318.0, 0.0], 1e-9)
    row("V2 strip = [13.00, 13.18] °C = T_under_balloon", fwd_strip, [T_under0, T_under1], 1e-9)
    row("V2 18 km × 1 °C/100 km = 0.18 = K_per_h", (fwd_across / 1e3) * 1.0 / 100.0, adv1 * 3600, 1e-12)
    # V3 (s17b, s19c): Case 1, the frozen map: the pole stays 13.00, the balloon reads T0 where it is
    frz_bal = T0(bal_x)                                               # bal_x is on the iso_t_h grid (181, 0-3 h)
    frz_pole = np.full_like(frz_bal, float(T0(PIN_KM[0])))
    frz_dot = []
    for n in (1, 2, 3):
        dv = call(VEC + "dot", "s17b", fw, f"∇T·(v t), t = {n} h on the frozen map (ours)",
                  a=gT, b=(np.asarray(v) * n * 3600.0).tolist())
        frz_dot.append(float(dv))
    Tfz = lambda x, t: T_WEST + G1 * x[0]  # noqa: E731   frozen field, no t
    frz_md = [material_derivative_terms(Tfz, uf1, xp, 0.0, h=10.0, ht=10.0) for xp in
              [pin_m] + [pin_m + v * n * 3600.0 for n in (1, 2, 3)]]
    row("V3 frozen material_derivative_terms: local 0, advective +5e-5, total +5e-5 K/s (pin and 1, 2, 3 h)",
        [[m.local, m.advective, m.total] for m in frz_md], [[0.0, 5e-5, 5e-5]] * 4, 1e-12)
    row("V3 13 + ∇T·(v t) = frozen_balloon_T_C at samples 60, 120, 180 = 13.18, 13.36, 13.54",
        [13.0 + d for d in frz_dot] + list(frz_bal[[60, 120, 180]]), [13.18, 13.36, 13.54] * 2, 1e-9)
    row("V3 frozen pole = 13.00 at every sample", frz_pole, 13.0, 1e-12)
    row("V3 mirror of Case 2: frozen_balloon − 13 = −(T_pole_field − 13)", frz_bal - 13.0, -(T_pole_field - 13.0), 1e-9)
    frz_marks_km = [float(bal_x[60]), float(bal_x[120]), float(bal_x[180])]
    row("V3 frozen marks at 318, 336, 354 km", frz_marks_km, [318.0, 336.0, 354.0], 1e-9)
    frozen_mdt = {"local_K_s": float(f"{frz_md[0].local:.6e}"), "advective_K_s": float(f"{frz_md[0].advective:.6e}"),
                  "total_K_s": float(f"{frz_md[0].total:.6e}"), "total_K_h": r6(frz_md[0].total * 3600)}
    # V4 (s19a): the queued parcels, labelled by arrival, and the graph range
    up_across = []
    for i in range(3):
        offn = (pin_m - np.array([up_x[i], up_y[i]]) * 1e3).tolist()
        up_across.append(float(call(VEC + "scalar_projection", "s19a", fw,
                                    f"across-isotherm distance of the {i + 1}-h parcel (m, ours)", a=offn, b=gT)) / 1e3)
    row("V4 queued parcels 18, 36, 54 km across the isotherms", up_across, [18.0, 36.0, 54.0], 1e-9)
    row("V4 upwind_T_C[n] = T_pole_field_C at 60 (n+1)", up_T, T_pole_field[[60, 120, 180]], 1e-9)
    graph_rng = [12.4, 13.6]
    allg = np.r_[frz_bal, frz_pole, T_pole_field, T_balloon_field]
    row("V4 every graph value inside 12.4-13.6 °C", [allg.min() >= graph_rng[0], allg.max() <= graph_rng[1]], [1, 1], 0)
    # V5 (s17, s17b): the camera zoom window (4.0 px/km)
    zw = [[220.0, 440.0], [160.0, 292.0]]
    inside = lambda p: zw[0][0] <= p[0] <= zw[0][1] and zw[1][0] <= p[1] <= zw[1][1]  # noqa: E731
    pts = [PIN_KM, (bal_x[60], bal_y[60]), (bal_x[180], bal_y[180]), (300.0, 200.0), (400.0, 200.0)] + \
          [(x, 200.0) for x in frz_marks_km]
    row("V5 pin, 1-h ghost, 3-h balloon, 13 and 14 °C isotherms, frozen marks inside the zoom window",
        [inside(p) for p in pts], [1] * len(pts), 0)
    row("V5 window 220 km x 4 px/km = 880 px wide, 132 km = 528 px high", [(zw[0][1] - zw[0][0]) * 4, (zw[1][1] - zw[1][0]) * 4],
        [880, 528], 1e-9)
    # V7 (s19d_three_rates): the 3 x 2 grid [advection, local, material] x [map frozen, our story], K per hour,
    # from material_derivative_terms at the pin on the frozen field and on the sliding field
    md_frz = frz_md[0]
    md_sld = material_derivative_terms(Tf1, uf1, pin_m, 0.0, h=10.0, ht=10.0)
    three = [[md_frz.advective * 3600, md_sld.advective * 3600], [md_frz.local * 3600, md_sld.local * 3600],
             [md_frz.total * 3600, md_sld.total * 3600]]
    row("V7 three rates: advection +0.18 | +0.18, local 0 | −0.18, material +0.18 | 0 K/h", three,
        [[0.18, 0.18], [0.0, -0.18], [0.18, 0.0]], 1e-9)
    row("V7 row 3 = row 1 + row 2 in each column", [three[2][j] - three[0][j] - three[1][j] for j in (0, 1)], [0, 0], 1e-12)
    weather["three_rates_K_h"] = {"rows": ["advection", "local", "material"], "cols": ["map frozen", "our story"],
                                  "values": [[round(float(x), 6) + 0.0 for x in rw] for rw in three]}
    weather.update({
        "fwd_across_km_1h": r6(fwd_across / 1e3), "fwd_along_km_1h": r6(fwd_along / 1e3), "fwd_span_km": r6(fwd_span),
        "fwd_strip_T_C": r6(fwd_strip),
        "frozen_t_h": r6(iso_t_h), "frozen_balloon_T_C": r6(frz_bal), "frozen_pole_T_C": r6(frz_pole),
        "frozen_mdt": frozen_mdt, "frozen_dot_K": r6(frz_dot), "frozen_marks_km": r6(frz_marks_km),
        "frozen_marks_T_C": r6(frz_bal[[60, 120, 180]]),
        "arrival_t_h": [1, 2, 3], "upwind_across_km": r6(up_across), "graph_T_range_C": graph_rng,
        "zoom_window_km": zw, "zoom_px_per_km": 4.0})

    # v5 layout: the product rectangles on the side that fits the larger pair plane (same areas, k_cross sides)
    rect_b_right = [[0, 0], list(p_ab), list(np.asarray(p_ab) - kb), list(-np.asarray(kb))]
    rect_a_up = [[0, 0], list(p_ba), list(np.asarray(p_ba) + ka), list(ka)]
    row("s08 rectangle on b, right side: corners (0.8, 2.4), (3.8, 1.4), (3, −1); area 8",
        [*np.ravel(rect_b_right[1:]), sh_ab * V.norm(kb)], [0.8, 2.4, 3.8, 1.4, 3, -1, 8.0], 1e-9)
    row("s09 rectangle on a, upper side: corner (0.538, 5.308); area 8", [*rect_a_up[2], sh_ba * V.norm(ka)],
        [0.538462, 5.307692, 8.0], 1e-6)
    pair.update({"rect_on_b_right": r6(rect_b_right), "rect_on_a_up": r6(rect_a_up),
                 "display_cos_factors": dcf, "display_cos_product": round(dcp, 6),
                 "display_bhat": dbh, "display_bhat_terms": r6(dbt), "display_bhat_sum": round(dbs, 6)})
    work.update({"work_component_terms": r6(wct)})
    weather.update({
        "along_dot_gradT": float(along_dot), "v_along_check_10sin60": r6(v_along[1]),
        "chain_G1": chain1, "chain_G2": chain2,
        "norm_gradT_steep": r6(ngrad2), "pyth_G1": [float(gT[0]), float(gT[1]), float(ngrad)],
        "pyth_G2": [float(g2[0]), float(g2[1]), float(ngrad2)],
        "iso_t_h": r6(iso_t_h), "iso_T_C": r6(iso5_T), "iso_x_km": r6(iso_x), "iso_shift_km": r6(iso_shift),
        "prof_x_km": r6(prof_x), "prof_T_C": r6(prof_T1), "prof_T_steep_C": r6(prof_T2),
        "T_pole_field_C": r6(T_pole_field), "T_balloon_field_C": r6(T_balloon_field), "balloon_mdt_total_K_s": bal_mdt,
        "balance_t_h": bal_t, "balance_moved_K": r6(moved), "balance_local_K": r6(local), "balance_sum_K": r6(bsum),
        "iso_1318_x0_km": r6(iso_1318_x0),
        "upwind_far_km": r6(far), "upwind_track_x_km": r6(up_tr_x), "upwind_track_y_km": r6(up_tr_y),
        "across_km_1h": r6(across1 / 1e3), "along_km_1h": r6(along1 / 1e3),
        "isotherms_steep_T_C": r6(isoS_T), "isotherms_steep_km": r6(isoS_x0), "isotherms_steep_x_km": r6(isoS_x),
        "T_pole_steep_field_C": r6(T_pole_steep_field)})

    for r in rows:
        print(f"  {'PASS' if r['pass'] else 'FAIL'}  {r['name']}")
    if not all(r["pass"] for r in rows):
        print("build_ch00_dot_product_why: checks FAILED — no data written")
        return 1

    files = {f1: pair, f7: same_way, f11: cheap, f12: work, fw: weather, fs: sweep}
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
        "equations_note": "provenance only (QA/reviewer); the movie draws no equation labels except a plain (1) (rule G1)",
        "equations": {"dot_components": "Kundu §2.1 p. 41 (2.2): a·b = a1b1 + a2b2 + a3b3 (s03)",
                      "dot_cosine": "a·b = |a||b| cos θ, Kundu §2.8 p. 52 unnumbered; on screen a plain (1) (s04, s06)",
                      "shadow": "|a| cos θ = a·b̂ = a·b/|b| (ours; derived on screen in s06, s07)",
                      "material_derivative": "Vallis §1.1.2 p. 5 (1.7) Dφ/Dt = ∂φ/∂t + (v·∇)φ, shown as v·∇φ (s13)",
                      "gradient": "Kundu §2.9 p. 52: ∇φ = e_i ∂φ/∂x_i (2-D here, s14, s15)",
                      "local_tendency": "∂T/∂t = −v·∇T: material derivative with φ = T and DT/Dt = 0 (derived on screen in s18)"},
        "parameters": {"a": A, "b": B, "p_s07": P7, "q_s07": Q7, "v_wind_s11_m_s": V_WIND11, "F_N": F_N,
                       "F_angle_deg": F_DEG, "d_m": [5, 10], "v_speed_m_s": V_SPEED, "v_angle_from_gradT_deg": V_DEG,
                       "gradT_K_m": [G1, G2], "grid_h_m": H_GRID, "T_west_C": T_WEST, "T_pin_C": T_PIN,
                       "steep_map": "T = 13 °C + 2e-5 K/m (x − x_pin)", "map_km": list(MAP_KM), "pin_km": list(PIN_KM),
                       "time_compression": clock_rate(),
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
