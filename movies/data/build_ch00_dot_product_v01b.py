"""Physics data for the Chapter-0A movie ch00_dot_product_v01b, "The dot product: the part along, and where it is used"
(movies/ch00/ch00_dot_product_v01b/storyboard.yaml, plan 3: every v6 scene kept + the 0.1b additions).

Run with the main venv::

    .venv/Scripts/python.exe movies/data/build_ch00_dot_product_v01b.py

1. Every reused v6 scene (s00-s20, s21, s22) gets its data from the v6 builder
   (movies/data/build_ch00_dot_product_why.py), run unchanged but pointed at this movie's folder: the same 6 data files
   (pair, same_way, cheap, work, weather, sweep) and the same 121 CHECK rows and recorded fluidpy calls.
2. The additions (data_needs.md §B) are computed here by tested fluidpy functions and written to data/extra.json:
   D1 (s05a matching parts), D1b (s04 unit arrow), D1c (s07 ruler), D1d (s09 rectangles), C1 (s11a cart),
   D2 (s11b perpendicular push), R1 (s20b runway), F1 (s20c flux / sunlight, fluidpy.geo.terrain), W1 (s20d wind work),
   S1 (s20e similarity, fluidpy.diag.climatology.pattern_correlation).
3. Two globe pictures are rendered here from the NASA Blue Marble Next Generation image already on disk (cross-product
   movie, data/real/): a side view at the March equinox (s20c) and a view from above the South Pole (s20d), with the
   NCEP/NCAR R1 1991-2020 annual-mean 10-m winds over the Southern Ocean sampled at arrow points (s20d).
4. W2, the global wind work on the ocean circulation (about 1 TW, mostly over the Southern Ocean), is a CITED value
   (Wunsch 1998; cross-checked with Hughes & Wilson 2008), not computed; the citation is checked and stored in the
   manifest credits.

The composition (movies/src/ch00_dot_product_v01b/DotProductV01b.tsx) only indexes these samples by frame.
"""
from __future__ import annotations

import hashlib
import importlib
import json
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
FLUID = ROOT.parent / "Fluid Dynamics"
OUT = ROOT / "movies" / "ch00" / "ch00_dot_product_v01b"
DATA = OUT / "data"
REAL = ROOT / "movies" / "ch00" / "ch00_cross_product_why" / "data" / "real"
BMNG = REAL / "globe_bmng_topo_bathy_200409_5400x2700.jpg"
WIND = REAL / "wind_climatology.bin"
WIND_META = REAL / "wind_climatology.json"

sys.path.insert(0, str(FLUID))
sys.path.insert(0, str(Path(__file__).resolve().parent))
import build_ch00_dot_product_why as v6  # noqa: E402
from fluidpy.geo import vectors as V  # noqa: E402

A = [5.0, 1.0]
B = [1.0, 3.0]


def sha_file(p: Path) -> str:
    return hashlib.sha256(p.read_bytes()).hexdigest()


# ------------------------------------------------------------------------------------------------ globe pictures
def _bmng(reduce: int = 2) -> np.ndarray:
    from PIL import Image
    Image.MAX_IMAGE_PIXELS = None
    im = Image.open(BMNG).convert("RGB")
    if reduce > 1:
        im = im.reduce(reduce)
    return np.asarray(im).astype(np.float32)


def _sample(tex: np.ndarray, lat: np.ndarray, lon: np.ndarray) -> np.ndarray:
    H, W, _ = tex.shape
    col = ((lon + 180.0) / 360.0 * W).astype(int) % W
    row = np.clip(((90.0 - lat) / 180.0 * H).astype(int), 0, H - 1)
    return tex[row, col]


def ortho_image(tex: np.ndarray, n: int, centre_lat: float, centre_lon: float, night_side: str | None = None) -> np.ndarray:
    """Orthographic picture (n × n px, RGBA) of the textured globe seen from far above (centre_lat, centre_lon), north up
    (for a polar centre: the 0° meridian at the top of the picture for the south pole the way it is seen from below).
    Returns the image and nothing else; screen coordinates X right, Y up, unit radius."""
    yy, xx = np.mgrid[0:n, 0:n]
    X = (xx + 0.5) / n * 2 - 1
    Y = 1 - (yy + 0.5) / n * 2
    r2 = X ** 2 + Y ** 2
    inside = r2 <= 1.0
    Z = np.sqrt(np.clip(1 - r2, 0, 1))                 # towards the viewer
    lat, lon = screen_to_lonlat(X, Y, Z, centre_lat, centre_lon)
    rgb = _sample(tex, lat, lon)
    shade = 0.80 + 0.20 * Z                              # gentle limb darkening (no data colour change in the centre)
    if night_side in ("left", "right"):                  # the side away from the sun (terminator = vertical diameter)
        Xs = X if night_side == "left" else -X
        shade = shade * np.where(Xs < 0, 0.30 + 0.70 * np.clip(1 + Xs / 0.06, 0, 1), 1.0)
    rgb = rgb * shade[..., None]
    a = np.clip((1.0 - np.sqrt(r2)) * n / 2, 0, 1) * 255  # 1-px anti-aliased rim
    out = np.zeros((n, n, 4), dtype=np.uint8)
    out[..., :3] = np.where(inside[..., None], np.clip(rgb, 0, 255), 0).astype(np.uint8)
    out[..., 3] = np.where(inside, a, 0).astype(np.uint8)
    return out


def _basis(centre_lat: float, centre_lon: float):
    """Camera basis (right, up, toward-viewer) in Earth-centred (x to 0°E on the equator, y to 90°E, z north)."""
    p, l = np.radians(centre_lat), np.radians(centre_lon)
    fwd = np.array([np.cos(p) * np.cos(l), np.cos(p) * np.sin(l), np.sin(p)])        # centre point = towards viewer
    zn = np.array([0.0, 0.0, 1.0])
    if abs(centre_lat) > 89.0:                                                         # polar view: 0° meridian up
        up = np.array([1.0, 0.0, 0.0])
        up = up - fwd * np.dot(up, fwd)
    else:
        up = zn - fwd * np.dot(zn, fwd)
    up = up / np.linalg.norm(up)
    right = np.cross(up, fwd)
    return right, up, fwd


def screen_to_lonlat(X, Y, Z, centre_lat, centre_lon):
    right, up, fwd = _basis(centre_lat, centre_lon)
    P = X[..., None] * right + Y[..., None] * up + Z[..., None] * fwd
    lat = np.degrees(np.arcsin(np.clip(P[..., 2], -1, 1)))
    lon = np.degrees(np.arctan2(P[..., 1], P[..., 0]))
    return lat, lon


def lonlat_to_screen(lat, lon, centre_lat, centre_lon):
    right, up, fwd = _basis(centre_lat, centre_lon)
    p, l = np.radians(np.asarray(lat, float)), np.radians(np.asarray(lon, float))
    P = np.stack([np.cos(p) * np.cos(l), np.cos(p) * np.sin(l), np.sin(p)], axis=-1)
    return P @ right, P @ up, P @ fwd


def save_png(arr: np.ndarray, path: Path) -> None:
    from PIL import Image
    Image.fromarray(arr, "RGBA").save(path, optimize=True)


def main() -> int:
    # ------------------------------------------------------------------ 1. the v6 data, unchanged, into this folder
    v6.OUT, v6.DATA = OUT, DATA
    rc = v6.main()
    if rc != 0:
        print("v6 builder failed")
        return rc
    man = json.loads((OUT / "manifest.json").read_text(encoding="utf-8"))
    rows: list[dict] = []
    entries: list[dict] = []

    def row(name, val, ref, tol):
        ok = bool(np.all(np.abs(np.asarray(val, dtype=float) - np.asarray(ref, dtype=float)) <= tol))
        rows.append({"name": name, "value": v6.r6(np.ravel(val)[:4]), "ref": v6.r6(np.ravel(ref)[:4]), "tol": tol, "pass": ok})

    def call(fn: str, scene: str, eq: str, **params):
        mod, name = fn.rsplit(".", 1)
        out = getattr(importlib.import_module(mod), name)(**params)
        jparams = {k: (np.asarray(v).tolist() if isinstance(v, np.ndarray) else v) for k, v in params.items()}
        entries.append({"fn": fn, "scene": scene, "data": "data/extra.json", "eq": eq, "params": jparams,
                        "sha256": v6.parity_hash(out)})
        return out

    VEC = "fluidpy.geo.vectors."
    na, nb = float(V.norm(A)), float(V.norm(B))
    th = float(V.angle_between(A, B, degrees=True))

    # ------------------------------------------------------------------ D1b (s04): the unit arrow's piece = cos θ
    ang = np.arange(0.0, 180.0 + 1e-9, 1.0)
    uarr = np.round(np.stack([np.cos(np.radians(ang)), np.sin(np.radians(ang))], axis=-1), 12)
    piece = call(VEC + "scalar_projection", "s04", "piece a unit arrow marks off on a line = cos θ (ours)",
                 a=uarr.tolist(), b=[1.0, 0.0])
    stops = [0.0, th, 90.0, 180.0]
    stop_vals = [float(V.scalar_projection([np.cos(np.radians(s)), np.sin(np.radians(s))], [1.0, 0.0])) for s in stops]
    row("D1b unit arrow piece = cos θ on 0..180° (181 samples)", piece, np.cos(np.radians(ang)), 1e-11)
    row("D1b stops 0°, 60.3°, 90°, 180° → 1, 0.496, 0, −1", stop_vals, [1.0, 8 / np.sqrt(260), 0.0, -1.0], 1e-11)
    row("D1b piece at θ = 60.3° shown as 0.496", round(stop_vals[1], 3), 0.496, 1e-12)
    s04 = {"unit_angle_deg": v6.r6(ang), "unit_piece": v6.r6(piece), "stops_deg": v6.r6(stops), "stop_piece": v6.r6(stop_vals)}

    # ------------------------------------------------------------------ D1 (s05a): matching parts
    xh, yh = [1.0, 0.0], [0.0, 1.0]
    uu = [call(VEC + "dot", "s05a", f"unit-arrow dot {nm} (ours)", a=p, b=q)
          for nm, p, q in (("x̂·x̂", xh, xh), ("x̂·ŷ", xh, yh), ("ŷ·x̂", yh, xh), ("ŷ·ŷ", yh, yh))]
    terms = [A[0] * B[0] * uu[0], A[0] * B[1] * uu[1], A[1] * B[0] * uu[2], A[1] * B[1] * uu[3]]
    ab = call(VEC + "dot", "s05a", "a·b by components (Kundu (2.2), provenance)", a=A, b=B)
    row("D1 x̂·x̂, x̂·ŷ, ŷ·x̂, ŷ·ŷ = 1, 0, 0, 1", uu, [1, 0, 0, 1], 1e-15)
    row("D1 four terms 5·1(x̂·x̂), 5·3(x̂·ŷ), 1·1(ŷ·x̂), 1·3(ŷ·ŷ) = 5, 0, 0, 3", terms, [5, 0, 0, 3], 1e-15)
    row("D1 sum of terms = a·b = 8 = |a||b| cos θ", [sum(terms), ab, na * nb * np.cos(np.radians(th))], [8, 8, 8], 1e-12)
    row("D1 x̂·x̂ = 1·1·cos 0", uu[0], 1.0 * 1.0 * np.cos(0.0), 1e-15)
    row("D1 pieces of a: 5x̂ + 1ŷ = a; parts of b: 1x̂ + 3ŷ = b",
        np.r_[np.multiply(A[0], xh) + np.multiply(A[1], yh), np.multiply(B[0], xh) + np.multiply(B[1], yh)], np.r_[A, B], 0)
    s05a = {"unit_dots": v6.r6(uu), "terms": v6.r6(terms), "sum": v6.r6(sum(terms)), "a_dot_b": v6.r6(ab)}

    # ------------------------------------------------------------------ D1c (s07): b̂ as a ruler that turns
    phi_b = float(np.degrees(np.arctan2(B[1], B[0])))
    al = np.arange(0.0, 90.0 + 1e-9, 0.5)
    rul = np.round(np.stack([np.cos(np.radians(al)), np.sin(np.radians(al))], axis=-1), 12)
    read = call(VEC + "dot", "s07", "ruler reading a·(cos α, sin α) = 5 cos α + sin α (ours)", a=A, b=rul.tolist())
    rb = float(V.dot(A, [np.cos(np.radians(phi_b)), np.sin(np.radians(phi_b))]))
    row("D1c reading = 5 cos α + sin α on 0..90°", read, 5 * np.cos(np.radians(al)) + np.sin(np.radians(al)), 1e-11)
    row("D1c 2.53 at b's angle (71.57°), 5.00 at 0°, 1.00 at 90°", [rb, read[0], read[-1]], [8 / np.sqrt(10), 5.0, 1.0], 1e-11)
    row("D1c b's angle = 71.565°", phi_b, 71.56505118, 1e-6)
    s07 = {"ruler_alpha_deg": v6.r6(al), "ruler_reading": v6.r6(read), "phi_b_deg": v6.r6(phi_b), "reading_at_b": v6.r6(rb)}

    # ------------------------------------------------------------------ D1d (s09): the two rectangles
    sab = call(VEC + "scalar_projection", "s09", "shadow of a on b (rectangle width)", a=A, b=B)
    sba = call(VEC + "scalar_projection", "s09", "shadow of b on a (rectangle width)", a=B, b=A)
    rects = [[float(sab), nb], [float(sba), na]]
    row("D1d rectangles 2.530 × 3.162 and 1.569 × 5.099", np.ravel(rects), [2.529822, 3.162278, 1.568929, 5.099020], 1e-6)
    row("D1d both areas = 8.000", [rects[0][0] * rects[0][1], rects[1][0] * rects[1][1]], [8.0, 8.0], 1e-12)
    row("D1d shown sides 2.53 × 3.16 and 1.57 × 5.1 (rounded, areas ≈ 8)", [round(rects[0][0], 2), round(rects[0][1], 2),
        round(rects[1][0], 2), round(rects[1][1], 1)], [2.53, 3.16, 1.57, 5.1], 1e-12)
    s09 = {"rects": v6.r6(rects), "areas": v6.r6([rects[0][0] * rects[0][1], rects[1][0] * rects[1][1]])}

    # ------------------------------------------------------------------ C1 (s11a): the cart on rails
    Fv = 20.0 * np.array([np.cos(np.radians(60.0)), np.sin(np.radians(60.0))])
    track = [1.0, 0.0]
    along = call(VEC + "scalar_projection", "s11a", "part of the push along the track (ours)", a=Fv.tolist(), b=track)
    across = Fv - float(along) * np.asarray(track)
    s_roll = np.linspace(0.0, 5.0, 51)
    Wroll = call(VEC + "dot", "s11a", "work so far W(s) = F·(s, 0) (ours)", a=Fv.tolist(),
                 b=np.stack([s_roll, 0 * s_roll], axis=-1).tolist())
    row("C1 along part = 20 cos 60° = 10 N", along, 10.0, 1e-12)
    row("C1 across part (0, 17.3) N is at right angles to the track", [V.dot(across, track), across[1]], [0.0, 17.320508], 1e-6)
    row("C1 W over 5 m = 50 J (0 at the start)", [Wroll[0], Wroll[-1]], [0.0, 50.0], 1e-12)
    row("C1 the across part does no work over 5 m", V.dot(across, [5.0, 0.0]), 0.0, 1e-12)
    s11a = {"F": v6.r6(Fv), "along_N": v6.r6(along), "across_N": v6.r6(across), "roll_m": v6.r6(s_roll), "W_J": v6.r6(Wroll)}

    # ------------------------------------------------------------------ D2 (s11b): the whirl, a push always across
    nst = 120
    ph = np.linspace(0.0, 2 * np.pi, nst, endpoint=False)
    rhat = np.stack([np.cos(ph), np.sin(ph)], axis=-1)
    F_in = -rhat                                                    # string pull towards the centre
    ds = 2 * np.pi / nst
    steps = np.stack([-np.sin(ph), np.cos(ph)], axis=-1) * ds        # small steps along the circle (anticlockwise)
    Fd = call(VEC + "dot", "s11b", "F·d for every small step of the whirl (ours)", a=F_in.tolist(), b=steps.tolist())
    speed = np.full(nst, 1.0)                                       # |v| stays 1 (no work, energy unchanged)
    ke = 0.5 * speed ** 2
    row("D2 F·d = 0 for all 120 steps (≤ 1e-12)", np.max(np.abs(Fd)), 0.0, 1e-12)
    row("D2 total work over one turn = 0", np.sum(Fd), 0.0, 1e-12)
    row("D2 energy of motion constant (½|v|²)", np.ptp(ke), 0.0, 0.0)
    s11b = {"phase_rad": v6.r6(ph), "F_dot_d": v6.r6(Fd), "ke": v6.r6(ke)}

    # ------------------------------------------------------------------ R1 (s20b): wind along a runway
    vr = 10.0 * np.array([np.sin(np.radians(30.0)), np.cos(np.radians(30.0))])   # towards the north-east, 30° off north
    e_hat = [0.0, 1.0]
    v_along = call(VEC + "dot", "s20b", "v·ê, the wind along the runway (ours)", a=vr.tolist(), b=e_hat)
    v_ang = call(VEC + "angle_between", "s20b", "angle between the wind and the runway", a=vr.tolist(), b=e_hat, degrees=True)
    row("R1 v = (5.000, 8.660) m/s, 30° off the runway", [*vr, v_ang], [5.0, 8.660254, 30.0], 1e-6)
    row("R1 v·ê = 10 cos 30° = 8.660 m/s (shown ≈ 8.7)", [v_along, round(float(v_along), 1)], [8.660254, 8.7], 1e-6)
    row("R1 cos 30° = 0.866", round(float(np.cos(np.radians(30.0))), 3), 0.866, 1e-12)
    s20b = {"v": v6.r6(vr), "e_hat": e_hat, "v_dot_e": v6.r6(v_along), "angle_deg": v6.r6(v_ang),
            "across_m_s": v6.r6(vr[0])}

    # ------------------------------------------------------------------ F1 (s20c): sunlight through a window and on the ground
    tilt = np.arange(0.0, 90.0 + 1e-9, 1.0)
    s_hat = [-1.0, 0.0]                                              # towards the sun (the sun is on the left)
    n_win = np.round(np.stack([-np.cos(np.radians(tilt)), np.sin(np.radians(tilt))], axis=-1), 12)
    through = call(VEC + "dot", "s20c", "ŝ·n̂ for the window tilted 0..90° (Lambert's cosine law)", a=s_hat, b=n_win.tolist())
    row("F1 window ŝ·n̂ = 1, 0.5, 0 at tilt 0°, 60°, 90°", [through[0], through[60], through[90]], [1.0, 0.5, 0.0], 1e-11)
    lats = [0.0, 60.0]
    sv = call("fluidpy.geo.terrain.sun_vector", "s20c", "ŝ at equinox noon (elevation 90° − latitude, due south)",
              elevation_deg=[90.0 - la for la in lats], azimuth_deg=[180.0, 180.0])
    ins = [float(call("fluidpy.geo.terrain.insolation_factor", "s20c", f"ŝ·n̂ on flat ground at {la:.0f}°N, equinox noon",
                      normals=[0.0, 0.0, 1.0], sun_elev_deg=90.0 - la, sun_az_deg=180.0)) for la in lats]
    sdn = call(VEC + "dot", "s20c", "ŝ·n̂ with n̂ = local up (0, 0, 1)", a=np.asarray(sv).tolist(), b=[0.0, 0.0, 1.0])
    row("F1 ground ŝ·n̂ = 1.000 at the equator, 0.500 at 60°N (insolation_factor)", ins, [1.0, 0.5], 1e-12)
    row("F1 same by vectors.dot(sun_vector, up)", sdn, [1.0, 0.5], 1e-12)
    row("F1 spread factor 1/(ŝ·n̂) = 2 at 60°N", 1.0 / ins[1], 2.0, 1e-12)
    row("F1 declination set to 0: on the equinox day |δ| ≤ 0.4° changes cos 60° by ≤ 1 %",
        abs(np.cos(np.radians(60.4)) / 0.5 - 1.0), 0.0, 0.0125)
    # the side-view globe, the sun on the LEFT (as for the window): rays travel towards +X; the noon meridian is the left limb
    tex = _bmng(2)
    G_SIDE_N, NOON_LON = 560, 20.0
    side_c_lon = NOON_LON + 90.0
    side = ortho_image(tex, G_SIDE_N, 0.0, side_c_lon, night_side="right")
    save_png(side, DATA / "globe_side.png")
    limb = {}
    for la in lats:
        X, Y, Z = lonlat_to_screen(la, NOON_LON, 0.0, side_c_lon)
        limb[f"{la:.0f}"] = [float(X), float(Y), float(Z)]
    row("F1 60°N and the equator on the noon meridian sit on the left limb (Z = 0)", [limb["0"][2], limb["60"][2]],
        [0.0, 0.0], 1e-12)
    row("F1 limb points at 180° and 120° (60° above the leftward horizontal)",
        [np.degrees(np.arctan2(limb["0"][1], limb["0"][0])), np.degrees(np.arctan2(limb["60"][1], limb["60"][0]))], [180.0, 120.0], 1e-9)
    s20c = {"tilt_deg": v6.r6(tilt), "through": v6.r6(through), "lat_deg": lats, "s_hat_enu": v6.r6(sv),
            "ground_s_dot_n": v6.r6(ins), "spread": v6.r6(1.0 / ins[1]), "globe_px": G_SIDE_N, "noon_lon": NOON_LON,
            "limb_xy": {k: v6.r6(v[:2]) for k, v in limb.items()}}

    # ------------------------------------------------------------------ W1 (s20d): wind work on a current
    tau = [0.1, 0.0]
    uw = [[0.1, 0.0], [-0.1, 0.0]]
    pw = call(VEC + "dot", "s20d", "τ·u, power per square metre (with / against the current)", a=tau, b=uw)
    row("W1 τ·u = +0.0100 and −0.0100 W/m²", pw, [0.01, -0.01], 1e-15)
    row("W1 units: N m⁻² × m s⁻¹ = N m s⁻¹ m⁻² = W m⁻² (exponents of kg, m, s: 1, 0, −3)",
        np.add([1, -1, -2], [0, 1, -1]), [1, 0, -3], 0)
    # the South-Pole globe with the NCEP R1 1991-2020 annual-mean 10-m wind
    meta = json.loads(WIND_META.read_text(encoding="utf-8"))
    vu = next(v for v in meta["variables"] if v["name"] == "u10")
    vv = next(v for v in meta["variables"] if v["name"] == "v10")
    raw = np.fromfile(WIND, dtype="<f4")
    u10 = raw[vu["offset_bytes"] // 4: vu["offset_bytes"] // 4 + vu["count"]].reshape(vu["shape"])[0]   # annual mean
    v10 = raw[vv["offset_bytes"] // 4: vv["offset_bytes"] // 4 + vv["count"]].reshape(vv["shape"])[0]
    glat = np.asarray(meta["coords"]["lat"]); glon = np.asarray(meta["coords"]["lon"])
    band = (glat >= -60) & (glat <= -45)
    zon = np.nanmean(u10[band, :])
    row("W3 NCEP R1 annual-mean 10-m wind, 45–60°S: westerly (zonal mean u10 > 5 m/s)", zon > 5.0, 1, 0)
    G_S_N = 640
    south = ortho_image(tex, G_S_N, -90.0, 0.0)
    save_png(south, DATA / "globe_south.png")
    arrows = []
    for la in (-62.0, -55.0, -48.0, -41.0):
        i = int(np.argmin(np.abs(glat - la)))
        for lo in np.arange(0.0, 360.0, 15.0 if la < -50 else 12.0):
            j = int(np.argmin(np.abs(glon - lo)))
            u, w = float(u10[i, j]), float(v10[i, j])
            if not (np.isfinite(u) and np.isfinite(w)):
                continue
            X0, Y0, _ = lonlat_to_screen(glat[i], glon[j], -90.0, 0.0)
            # east and north unit vectors at the point, projected onto the screen
            d = 0.5
            Xe, Ye, _ = lonlat_to_screen(glat[i], glon[j] + d, -90.0, 0.0)
            Xn, Yn, _ = lonlat_to_screen(glat[i] + d, glon[j], -90.0, 0.0)
            ex = np.array([Xe - X0, Ye - Y0]); ex /= np.linalg.norm(ex)
            ny_ = np.array([Xn - X0, Yn - Y0]); ny_ /= np.linalg.norm(ny_)
            vec = u * ex + w * ny_
            arrows.append([v6.r6(float(X0)), v6.r6(float(Y0)), v6.r6(float(vec[0])), v6.r6(float(vec[1])), v6.r6(np.hypot(u, w))])
    # eastward at the 0° meridian points... check orientation: at lon 90°E (screen) eastward = clockwise seen from above S pole
    X90, Y90, _ = lonlat_to_screen(-55.0, 90.0, -90.0, 0.0)
    Xe90, Ye90, _ = lonlat_to_screen(-55.0, 91.0, -90.0, 0.0)
    cross_z = float(X90 * (Ye90 - Y90) - Y90 * (Xe90 - X90))
    row("W3 seen from above the South Pole, eastward is clockwise (cross product z < 0)", cross_z < 0, 1, 0)
    acc_lat = [-60.0, -50.0]
    acc_r = [float(np.cos(np.radians(la))) for la in acc_lat]
    s20d = {"tau": tau, "u": uw, "power_W_m2": v6.r6(pw), "globe_px": G_S_N, "wind_arrows": arrows,
            "zonal_mean_u10_45_60S": v6.r6(zon), "acc_band_lat": acc_lat, "acc_band_r": v6.r6(acc_r),
            "global_wind_work_TW": 1.0, "global_wind_work_note": "CITED (Wunsch 1998), not computed"}

    # ------------------------------------------------------------------ S1 (s20e): how alike two pressure patterns are
    PA = [3.0, 1.0, -2.0, -2.0]
    PB = [2.0, 2.0, -1.0, -3.0]
    prods = [a * b for a, b in zip(PA, PB)]
    dotAB = float(np.dot(PA, PB))
    nA, nB = float(np.sqrt(np.dot(PA, PA))), float(np.sqrt(np.dot(PB, PB)))
    rpc = call("fluidpy.diag.climatology.pattern_correlation", "s20e",
               "uncentred pattern correlation = cos θ = A·B/(|A||B|)", a=PA, b=PB)
    row("S1 products 6, 2, 2, 6; A·B = 16", [*prods], [6, 2, 2, 6], 0)
    row("S1 A·B = 16, |A|² = |B|² = 18", [dotAB, nA ** 2, nB ** 2], [16, 18, 18], 1e-12)
    row("S1 cos θ = 16/18 = 0.889 (pattern_correlation)", [rpc, dotAB / (nA * nB)], [16 / 18, 16 / 18], 1e-12)
    row("S1 shown ≈ 0.89; |A| = √18 = 4.243", [round(float(rpc), 2), nA], [0.89, 4.242641], 1e-6)
    gauge_c = [-1.0, 0.0, 1.0]
    s20e = {"A_hPa": PA, "B_hPa": PB, "products": prods, "dot": dotAB, "norm_A": v6.r6(nA), "norm_B": v6.r6(nB),
            "cos": v6.r6(rpc), "gauge": gauge_c}

    # ------------------------------------------------------------------ write extra.json and merge the manifest
    for r in rows:
        print(f"  {'PASS' if r['pass'] else 'FAIL'}  {r['name']}")
    if not all(r["pass"] for r in rows):
        print("build_ch00_dot_product_v01b: checks FAILED — extra.json not written")
        return 1
    extra = {"s04": s04, "s05a": s05a, "s07": s07, "s09": s09, "s11a": s11a, "s11b": s11b, "s20b": s20b,
             "s20c": s20c, "s20d": s20d, "s20e": s20e}
    blob = json.dumps(extra, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    (DATA / "extra.json").write_bytes(blob)
    man["data_files"]["extra.json"] = hashlib.sha256(blob).hexdigest()
    for png in ("globe_side.png", "globe_south.png"):
        man["data_files"][png] = sha_file(DATA / png)
    man["id"] = "ch00_dot_product_v01b"
    man["storyboard"] = "movies/ch00/ch00_dot_product_v01b/storyboard.yaml"
    man["builder"] = "movies/data/build_ch00_dot_product_v01b.py (runs movies/data/build_ch00_dot_product_why.py for the v6 data)"
    man["fluidpy"]["terrain_py_sha256"] = sha_file(FLUID / "fluidpy" / "geo" / "terrain.py")
    man["fluidpy"]["climatology_py_sha256"] = sha_file(FLUID / "fluidpy" / "diag" / "climatology.py")
    man["checks_v6"] = len(man["checks"])
    man["checks"] = man["checks"] + rows
    man["physics"] = man["physics"] + entries
    man["equations"].update({
        "matching_parts": "(5x̂ + ŷ)·(x̂ + 3ŷ) = 5·1 + 1·3 = 8 with x̂·ŷ = 0, x̂·x̂ = 1 (expansion of Kundu (2.2), ours; s05a)",
        "lambert": "ŝ·n̂ = cos(zenith angle), Lambert's cosine law (fluidpy.geo.terrain.insolation_factor; s20c)",
        "wind_work": "power per unit area τ·u [W m⁻²] (s20d)",
        "pattern_correlation": "cos θ = A·B/(|A||B|), uncentred pattern correlation (fluidpy.diag.climatology; s20e)"})
    man["parameters"].update({
        "s11a_F_N": 20.0, "s11a_angle_to_track_deg": 60.0, "s11a_roll_m": 5.0,
        "s11b_steps": nst, "s20b_wind_m_s": 10.0, "s20b_angle_off_runway_deg": 30.0,
        "s20c_declination_deg": 0.0, "s20c_noon_meridian_lon": NOON_LON,
        "s20d_tau_N_m2": tau, "s20d_u_m_s": uw, "s20e_A_hPa": PA, "s20e_B_hPa": PB})
    man["exaggeration"] = [
        "s11a cart and rails, s11b whirl, s20b runway, s20c window: illustrative glyphs with the stated numbers",
        "s20c globe: the sun's rays ignore the atmosphere; declination 0 (equinox day |δ| ≤ 0.4°)",
        "s20d tiles: illustrative easy numbers; the circumpolar current band (50–60°S) is schematic; the winds are data"]
    man["credits"] = {
        "W2_wind_work": {
            "value": "about 1 TW (10^12 W) of wind work on the oceanic general circulation, dominated by the mean zonal wind "
                     "over the Southern Ocean",
            "primary": "Wunsch, C. (1998): The work done by the wind on the oceanic general circulation. J. Phys. Oceanogr., "
                       "28(11), 2332-2340. doi:10.1175/1520-0485(1998)028<2332:TWDBTW>2.0.CO;2",
            "later": "Hughes, C. W. and C. Wilson (2008): Wind work on the geostrophic ocean circulation: an observational "
                     "study of the effect of small scales in the wind stress. J. Geophys. Res., 113, C02016. "
                     "doi:10.1029/2007JC004371 (0.76 TW with the current-relative stress)",
            "verified": "2026-10-28 by the motion-builder: DOIs resolved on api.crossref.org (title, authors, volume, pages); "
                        "the Wunsch abstract (OpenAlex) states 'The value of about 1 TW … is dominated by the work done by the "
                        "mean zonal wind in the Southern Ocean'; the Hughes & Wilson abstract gives 0.76 TW. Narration says "
                        "'about a million million watts, most of it over the Southern Ocean'."},
        "W3_ACC": "the Southern Ocean westerlies blow along the Antarctic Circumpolar Current (standard; winds on the globe: "
                  "NCEP/NCAR Reanalysis 1, 1991-2020 annual-mean 10-m wind, NOAA PSL, public domain)",
        "S2_analogues": "fix 1 (review 1, S10): the narration was softened to 'Weather maps can be compared this way to look "
                        "for past days like today' (a possibility, not a claim about who used the cosine). Background: "
                        "Lorenz, E. N. (1969), Atmospheric predictability as revealed by naturally occurring analogues, "
                        "J. Atmos. Sci., 26, 636-646, searched past maps for analogues but ranked them by RMS difference, "
                        "not by the cosine; the cosine of anomaly patterns is the anomaly correlation coefficient, a standard "
                        "forecast-verification score (WMO Manual on the GDPFS, WMO-No. 485), which the movie does not name",
        "R2_runway": "pilots resolve the wind into along-runway and crosswind parts (FAA Airplane Flying Handbook, "
                     "FAA-H-8083-3; crosswind chapter)",
        "imagery": "NASA Blue Marble Next Generation, topography + bathymetry, September 2004 (NASA Earth Observatory, public "
                   "domain), via movies/ch00/ch00_cross_product_why/data/real/",
        "wind_source_sha256": sha_file(WIND), "bmng_source_sha256": sha_file(BMNG),
        "sound": "music tools/sound/styles.py 'maths-calm' (= v6's pad), seed 7; effects synthesised by tools/sound/sfx.py "
                 "(wind_gentle under s11a, surf under s20d); all our own, CC0-1.0"}
    (OUT / "manifest.json").write_text(json.dumps(man, indent=1, ensure_ascii=False), encoding="utf-8")
    print(f"build_ch00_dot_product_v01b: v6 data + extra.json + 2 globe PNGs; {len(man['checks'])} checks "
          f"({man['checks_v6']} v6 + {len(rows)} new), {len(man['physics'])} parity entries -> {OUT}")
    for k, val in man["data_files"].items():
        print(f"  {k}  sha256 {val[:16]}…  {(DATA / k).stat().st_size / 1e3:.1f} kB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
