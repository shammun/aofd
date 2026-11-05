"""Physics and real-data products for the Chapter-0 movie #5e "Coordinates, Part 5 — Moving frames: storm-relative winds"
(movies/ch00/ch00_coordinates_moving/storyboard.yaml, 19 scenes; CHECK rows DC50-DC56 kept from build 1 under their names,
new rows DP29-DP42 for the split movie's new numbers).

Run with the main venv::

    .venv/Scripts/python.exe movies/data/build_ch00_coordinates_moving.py [--public <render public dir> ...]

Every number the movie shows or says is computed here by the tested functions named in the storyboard's ``physics_source``
fields (no download; every input is already on disk):

* ``fluidpy.core.kinematics`` (galilean_transform, acceleration, pathline) — the train, the falling ball, the sliding gust
  pattern (Kundu §3.3, (3.8), (3.9)),
* ``fluidpy.geo.calculus.chain_rule_rate`` — the traveller's rate (Vallis (1.5), Kundu (B.1.4)) for the anemometer, the rider
  and the Plymouth barometer (Kundu (B.2.2) in vector form),
* ``fluidpy.geo.sphere`` (enu_basis, gradient, destination_point, great_circle_distance, initial_bearing),
* ``fluidpy.diag.cyclone`` (track_by_continuity, translation_velocity, storm_relative_wind),
  ``fluidpy.diag.trajectories.advect_on_sphere``, ``fluidpy.core.coords.velocity_components``,

on ERA5 hourly surface fields for Storm Ciarán (G: derived, ARCO ERA5), the ISD SYNOP of Brest-Guipavas, Natural Earth 10 m
coast and NASA Blue Marble NG (the s02 globe mini).

Writes movies/ch00/ch00_coordinates_moving/data/mv.json (numbers + small arrays the composition only indexes and interpolates;
``say`` = the spoken / written rounded values, each asserted here), data/img/*.png (Ciarán wind-speed and sea-level-pressure
rasters, perceptual LUTs) and manifest.json (function, provenance, parameters, fluidpy git SHA, sha256 of inputs and data
files, parity hashes, chapter marks + maths-skip targets from timing.json). All CHECK rows must pass before anything is
written (exit 1 otherwise). ``flags`` lists screen/voice roundings that a hand check finds inconsistent (reported to the
director; not CHECK failures because the storyboard voice is fixed). With ``--public`` it also writes every render asset
(mv_*) into each given dir (movies/public and the G: build1/public).
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
OUT = ROOT / "movies" / "ch00" / "ch00_coordinates_moving"
DATA = OUT / "data"
IMG = DATA / "img"
sys.path.insert(0, str(FLUID))
sys.path.insert(0, str(Path(__file__).resolve().parent))
import build_ch00_coordinates as B1  # noqa: E402  (shared helpers: parity_hash, r6, sha_file, git_sha, lut_rgb, lut_hex, rgba_png, contours, shp_parts, box_lines, bilin)
import xarray as xr  # noqa: E402

D2R = np.pi / 180.0
TITLE = "Coordinates, Part 5 — Moving frames: storm-relative winds"
BREST = (48.39, -4.49)
PLY = (50.25, -4.25)            # Plymouth (the ERA5 grid point the storyboard names)
NEWQUAY = (50.42, -5.08)        # the s01 'Cornish shore' spot (hook icons; arrow lengths only, no number on screen)
CIA_BOX = (44.0, 58.0, -15.0, 5.0)
GS, DC, DT_, KN, GC, CS = ("fluidpy.geo.sphere.", "fluidpy.diag.cyclone.", "fluidpy.diag.trajectories.", "fluidpy.core.kinematics.",
                           "fluidpy.geo.calculus.", "fluidpy.core.coords.")
CHAPTERS = [("s00_title", "Title"), ("s01_hook", "Riding with a storm: the question"), ("s02_part4_recap", "Recap of Part 4"),
            ("s03_train", "A frame that moves: the train"), ("s04_velocities_add", "Every step: why speeds add"),
            ("s05_accel_same", "Every step: accelerations stay the same"), ("s06_parcel_accel", "An air parcel's acceleration in two frames"),
            ("s07_sliding_pattern", "A sliding gust pattern, in numbers"), ("s08_ciaran", "Storm Ciarán"), ("s09_lopsided", "Why the winds were lopsided"),
            ("s10_storm_relative", "Storm-relative winds"), ("s12_invariant", "What does not change"), ("s13_tau", "What a fixed barometer sees"),
            ("s14_tau_derive", "Every step: linking the barometer and the rider"), ("s15_plymouth", "Plymouth, in numbers"),
            ("s17_recap", "Recap"), ("s18_end", "End")]
# (block, scene of the skip line, scene of the "If you skipped" line) — storyboard skip_guidance.chapter_marks
SKIPS = [("A", "s04_velocities_add", "s05_accel_same"), ("B", "s14_tau_derive", "s14_tau_derive")]


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
        q = by[b]["sentences"][-1]
        assert q["text"].startswith("If you skipped"), b
        j = next(i for i, s in enumerate(by[a]["sentences"]) if "skip ahead" in s["text"])
        sk.append({"block": blk, "chip_scene": a, "chip_sentence": j, "chip_at_s": round(by[a]["sentences"][j]["start"], 3), "skip_to": mmss(q["start"]),
                   "skip_to_s": round(q["start"], 3), "keep_line": q["text"]})
    return {"chapters": ch, "maths_skips": sk, "timing_provisional": bool(tm.get("provisional"))}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--public", type=Path, nargs="*", default=[], help="render public dir(s) for the mv_* assets")
    a = ap.parse_args()
    from PIL import Image
    Image.MAX_IMAGE_PIXELS = None
    DATA.mkdir(parents=True, exist_ok=True)
    IMG.mkdir(parents=True, exist_ok=True)
    for p in list(IMG.glob("*.png")) + list(IMG.glob("*.jpg")):
        p.unlink()
    rows: list[dict] = []
    flags: list[dict] = []
    entries: list[dict] = []
    heavy: list[dict] = []
    V: dict = {}
    say: dict = {}

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
        entries.append({"fn": fn, "scene": scene, "data": "data/mv.json", "eq": eq, "params": jp, "sha256": h})
        return out

    def recorded(fn, scene, eq, params, value):
        entries.append({"fn": fn, "scene": scene, "data": "data/mv.json", "eq": eq, "params": params, "sha256": None, "recorded": value})

    from fluidpy.core import kinematics as KNm
    from fluidpy.geo import sphere as SPH
    from fluidpy.geo.constants import EARTH_RADIUS

    # ================================================================ s03-s05 the train (Galilean frames, Kundu §3.3)
    U_tr = np.array([20.0, 0.0])

    def walker_ground(x, t):            # the walker seen from the ground: 21.5 m/s east, everywhere (a uniform field)
        X = np.asarray(x, float)
        return np.stack([np.full(X.shape[1:], 21.5), np.zeros(X.shape[1:])]) if X.ndim > 1 else np.array([21.5, 0.0])
    up = KNm.galilean_transform(walker_ground, U_tr)
    u_rider = np.asarray(up(np.array([5.0, 0.0]), 3.0))
    row("DC50", "train: ground 21.5 m/s seen from the train = 1.5 m/s (galilean_transform); 20 + 1.5 = 21.5", [u_rider[0], u_rider[1], 20 + 1.5], [1.5, 0.0, 21.5], 1e-12)
    recorded(KN + "galilean_transform", "s03", "u′(x′, t′) = u(x′ + U t′, t′) − U", {"u": "uniform 21.5 m/s east", "U": [20.0, 0.0], "x′": [5.0, 0.0], "t′": 3.0},
             B1.r6(u_rider, 9))
    row("DC50", "x = x′ + U t: the back of the train after t = 3 s is 60 m from the station; walker 4 m ahead → 64 m", 20 * 3 + 4, 64.0, 0)

    def walker_speeding(x, t):          # the walker speeds up from 21.5 to 22.0 m/s in 1 s (ground), 0.5 m/s²
        X = np.asarray(x, float)
        sh = X.shape[1:] if X.ndim > 1 else ()
        return np.stack([np.full(sh, 21.5 + 0.5 * t), np.zeros(sh)]) if X.ndim > 1 else np.array([21.5 + 0.5 * t, 0.0])
    Ag = KNm.acceleration(walker_speeding, np.array([0.0, 0.0]), 0.5, ht=1e-3)
    Ar = KNm.acceleration(KNm.galilean_transform(walker_speeding, U_tr), np.array([0.0, 0.0]), 0.5, ht=1e-3)
    row("DC51", "walker speeding up: acceleration 0.5 m/s² from the ground and from the train (kinematics.acceleration)", [Ag.a[0], Ar.a[0]], [0.5, 0.5], 1e-6)
    row("DC51", "screen: 1.5 → 2.0 and 21.5 → 22.0: + 0.5 m/s in 1 s in both frames", [2.0 - 1.5, 22.0 - 21.5], [0.5, 0.5], 0)
    recorded(KN + "acceleration", "s05", "Du/Dt in both frames (walker speeding up)", {"u": "21.5 + 0.5 t (ground)", "U": [20.0, 0.0]}, B1.r6([Ag.a[0], Ar.a[0]], 9))

    def vortex(x, t):                    # build-1 DC51: a translating-frame check on a non-uniform field (local and advective parts differ)
        X = np.asarray(x, float)
        xc, yc = X[0], X[1]
        r2 = xc ** 2 + yc ** 2 + 1e-12
        fco = 1 - np.exp(-r2 / 4.0)
        out = np.stack([-yc * fco / r2 * 10.0 * (1 + 0.1 * t), xc * fco / r2 * 10.0])
        return out
    upv = KNm.galilean_transform(vortex, U_tr)
    rs = np.random.default_rng(5)
    Xp = rs.uniform(-3, 3, (2, 200))
    A1 = KNm.acceleration(vortex, Xp + U_tr[:, None] * 0.5, 0.5)
    A2 = KNm.acceleration(upv, Xp, 0.5)
    truth("DC51", "kinematics.acceleration equal in both frames at 200 points of an unsteady vortex; local and advective parts differ",
          bool(np.allclose(A1.a, A2.a, rtol=1e-6, atol=1e-6) and not np.allclose(A1.local, A2.local, atol=1e-3)),
          B1.r6([np.max(np.abs(A1.a - A2.a)), np.max(np.abs(A1.local - A2.local))], 6))
    recorded(KN + "acceleration", "s05/s06", "(K 3.9) in both frames", {"field": "Gaussian-core vortex ×(1 + 0.1 t), U = (20, 0)", "points": 200},
             B1.r6([np.max(np.abs(A1.a - A2.a))], 9))
    row("DC51", "ball: g = 9.81 m/s² ('nine point eight') in both frames (vertical acceleration does not depend on a steady horizontal U)", 9.81, 9.8, 0.05)
    V["train"] = {"U": 20.0, "u1": 1.5, "sum": 21.5, "acc": [1.5, 2.0, 21.5, 22.0], "g": 9.81}
    say["train"] = {"U": "20", "u1": "1.5", "sum": "21.5", "acc": "+0.5", "g": "9.8"}

    # ================================================================ s07 the sliding gust pattern (D42b), m and s inside, per hour on screen
    L, Upat, amp, mean = 200e3, 10.0, 5.0, 10.0
    k_ = 2 * np.pi / L

    def gust(x, t):
        X = np.asarray(x, float)
        u = mean + amp * np.sin(k_ * (X[0] - Upat * t))
        return np.stack([u, np.zeros_like(u)])
    x0 = L / 8                                       # phase 45° at t = 0
    Gg = call(KN + "acceleration", "s07", "ground: ∂u/∂t + u ∂u/∂x (K 3.9)", heavy_call=True, u=gust, x=np.array([x0, 0.0]), t=0.0, h=1.0, ht=1.0)
    gp = KNm.galilean_transform(gust, np.array([Upat, 0.0]))
    Gr = call(KN + "acceleration", "s07", "rider: ∂u′/∂t′ + u′ ∂u′/∂x′ (K 3.9, primed)", heavy_call=True, u=gp, x=np.array([x0, 0.0]), t=0.0, h=1.0, ht=1.0)
    u_at = float(gust(np.array([x0, 0.0]), 0.0)[0])
    dudx = amp * k_ * np.cos(np.pi / 4)               # m/s per m
    H = 3600.0
    loc_g, adv_g, loc_r, adv_r = Gg.local[0] * H, Gg.advective[0] * H, Gr.local[0] * H, Gr.advective[0] * H
    row("DP32", "u = 13.536 m/s, ∂u/∂x = 0.1111 m/s per km at phase 45°", [u_at, dudx * 1e3], [13.536, 0.1111], [5e-4, 5e-5])
    row("DP32", "ground local −3.999, advection +5.412; rider local 0, advection +1.414 m/s per hour (kinematics.acceleration)",
        [loc_g, adv_g, loc_r, adv_r], [-3.999, 5.412, 0.0, 1.414], [2e-3, 2e-3, 2e-3, 2e-3])
    row("DP32", "sums agree: ground −4.0 + 5.4 = rider 0 + 1.4 (both 1.414)", [loc_g + adv_g, loc_r + adv_r], [1.414, 1.414], 2e-3)
    tr_g, tot_g = call(GC + "chain_rule_rate", "s07", "anemometer + advection = dF/dt along the wind", dFdt=-Upat * dudx, grad=[dudx], velocity=[u_at])
    tr_r, tot_r = call(GC + "chain_rule_rate", "s07", "rider: frozen pattern + relative wind", dFdt=0.0, grad=[dudx], velocity=[u_at - Upat])
    row("DP32", "chain_rule_rate = kinematics.acceleration (ground and rider totals)", [tot_g * H, tot_r * H], [loc_g + adv_g, loc_r + adv_r], 1e-3)
    # the screen arithmetic: 13.5 − 10 = 3.5 m/s = 12.7 km/h; 10 m/s = 36 km/h; 13.5 m/s = 48.7 km/h (unrounded 48.73)
    row("DP32", "screen: 3.5 × 3.6 = 12.6 ('twelve point seven' = 3.536 × 3.6 = 12.73); 36 × 0.111 = 4.0; 48.7 × 0.111 = 5.4; 12.7 × 0.111 = 1.4",
        [(u_at - Upat) * 3.6, 36 * 0.111, 48.7 * 0.111, 12.7 * 0.111, u_at * 3.6], [12.73, 4.0, 5.4, 1.41, 48.73], [0.01, 0.01, 0.01, 0.01, 0.01])
    # profile 0-400 km (t = 0) and the anemometer / parcel over one hour
    xs = np.linspace(0, 400e3, 201)
    prof = mean + amp * np.sin(k_ * xs)
    th = np.linspace(0, H, 61)
    anem = mean + amp * np.sin(k_ * (x0 - Upat * th))
    path = call(KN + "pathline", "s07", "the parcel's path dr/dt = u(r, t) (K 3.8)", heavy_call=True, u=gust, r0=np.array([x0, 0.0]), t0=0.0, t_eval=th)
    parc = mean + amp * np.sin(k_ * (path[0] - Upat * th))
    rng_ = (anem[-1] < anem[0]) and (parc[-1] > parc[0])
    truth("DP32", "over one hour the anemometer's wind falls (13.5 → 8.3) and the parcel's wind rises (13.5 → 14.6)", rng_, B1.r6([anem[0], anem[-1], parc[0], parc[-1]], 2))
    row("DP32", "parcel's wind after 1 h ≈ 13.54 + 1.4 at first (slope at t = 0 = 1.414 m/s per hour)", (parc[1] - parc[0]) / (th[1] - th[0]) * H, 1.414, 0.02)
    # calc & sync audit #5e E2: the pattern's value and slope at x = 25 km, and the unit conversions, every step on screen
    row("DP43", "E2: x0 = 25 km = 200/8 (phase 45°); 5 sin 45° = 3.536 → 3.54; 10 + 3.54 = 13.54; slope 5 × 2π/200 × cos 45° = 0.1111 m/s per km",
        [x0 / 1e3, 5 * np.sin(np.pi / 4), 10 + 3.54, 5 * 2 * np.pi / 200 * np.cos(np.pi / 4), u_at], [25.0, 3.536, 13.54, 0.1111, 13.536], [1e-12, 5e-4, 1e-9, 5e-5, 5e-4])
    row("DP43", "E2: 13.54 − 10 = 3.54; 3.54 × 3.6 = 12.74 ≈ 12.7 km/h; 10 × 3.6 = 36; 13.54 × 3.6 = 48.74 ≈ 48.7; 12.7 × 0.111 = 1.41 ≈ 1.4",
        [13.54 - 10, 3.54 * 3.6, 10 * 3.6, 13.54 * 3.6, 12.7 * 0.111], [3.54, 12.74, 36.0, 48.74, 1.41], [1e-9, 5e-3, 1e-9, 5e-3, 5e-3])
    truth("DP43", "E2 roundings: 12.744 → 12.7, 48.744 → 48.7 (voice 'twelve point seven', 'forty eight point seven')", round(3.54 * 3.6, 1) == 12.7 and round(13.54 * 3.6, 1) == 48.7)
    V["slide"] = {"L_km": 200, "U": Upat, "amp": amp, "mean": mean, "x0_km": x0 / 1e3, "u": u_at, "dudx_km": dudx * 1e3, "loc_g": loc_g, "adv_g": adv_g,
                  "loc_r": loc_r, "adv_r": adv_r, "x_km": B1.r6(xs / 1e3, 1), "prof": B1.r6(prof, 3), "th": B1.r6(th / H, 4), "anem": B1.r6(anem, 3),
                  "parc": B1.r6(parc, 3), "parc_x_km": B1.r6(path[0] / 1e3, 2)}
    say["slide"] = {"u": "13.54", "slope": "0.111", "rel": "3.54", "rel_kmh": "12.7", "U_kmh": "36", "u_kmh": "48.7", "loc_g": "−4.0", "adv_g": "+5.4", "adv_r": "+1.4"}

    # ================================================================ s02 Brest's local frame (recap mini; Part 4 numbers)
    eB = call(GS + "enu_basis", "s02", "(i, j, k) east, north, up at Brest", lat=BREST[0], lon=BREST[1])
    V["brest"] = {"ll": list(BREST), "i": B1.r6(eB[0], 4), "j": B1.r6(eB[1], 4), "k": B1.r6(eB[2], 4)}
    row("DP29", "Brest k = (0.662, −0.052, 0.748) (Part 4)", np.asarray(eB[2]), [0.662, -0.052, 0.748], 5e-4)

    # ================================================================ Storm Ciarán, ERA5 hourly (s00, s01, s08-s17)
    Cd = xr.open_dataset(B1.F_CIA)
    clat, clon = Cd.lat.values.astype(float), Cd.lon.values.astype(float)
    if clat[0] > clat[-1]:
        Cd = Cd.isel(lat=slice(None, None, -1))
        clat = clat[::-1]
    ctime = Cd.time.values
    msl = Cd.msl.values.astype(float)
    trk = call(DC + "track_by_continuity", "s08", "storm tracker rule: seed + continuity", heavy_call=True, msl=msl, lat=clat, lon=clon, times=ctime,
               seed=(52.5, 1.75), seed_time=np.datetime64("2023-11-02T12:00:00"), box_deg=(1.2, 2.0), max_step_km=120.0)
    tix = {str(t)[:13]: i for i, t in enumerate(trk.times)}
    k21, k23, k00, k01, k03, k06 = (tix[s] for s in ("2023-11-01T21", "2023-11-01T23", "2023-11-02T00", "2023-11-02T01", "2023-11-02T03", "2023-11-02T06"))
    steps = np.asarray(trk.step_km)[k21 + 1:k06 + 1]
    truth("DC52", "hourly steps 21-06 UTC ≤ 120 km (47-77 km), no flags", bool(np.all(steps <= 120) and np.all(steps >= 40) and not np.any(np.asarray(trk.step_flag)[k21:k06 + 1])),
          B1.r6(steps, 1))
    row("DC52", "track 00 UTC 954.5 hPa ('nine hundred and fifty four and a half'), 03 UTC 953.6 hPa", [trk.msl_min[k00] / 100, trk.msl_min[k03] / 100], [954.5, 953.6], [0.05, 0.15])
    TV = call(DC + "translation_velocity", "s08", "great-circle distance / time, bearing at the start", heavy_call=True, track=trk, t1=trk.times[k00], t2=trk.times[k06])
    Ue, Un, spd, brg = float(TV.east), float(TV.north), float(TV.speed), float(TV.bearing)
    row("DC52", "motion 14.58 m/s towards 71.0° (east 13.78, north 4.75)", [spd, brg, Ue, Un], [14.58, 71.0, 13.78, 4.75], [0.02, 0.2, 0.02, 0.02])
    row("DP33", "screen: |U| ≈ 14.6 m/s ≈ 52.5 km/h; 14.6 sin 71° ≈ 13.8; 14.6 cos 71° ≈ 4.8; 'roughly fifteen'",
        [round(spd, 1), spd * 3.6, 14.6 * np.sin(71 * D2R), 14.6 * np.cos(71 * D2R), round(spd)], [14.6, 52.5, 13.8, 4.8, 15], [0, 0.05, 0.05, 0.05, 0])
    # calc & sync audit #5e E3: the 00 -> 06 UTC move with Part 3's flat rules (one move per row on screen)
    la0, lo0, la1, lo1 = (float(trk.lat[k00]), float(trk.lon[k00]), float(trk.lat[k06]), float(trk.lon[k06]))
    dphi3, dlam3, pm3 = round(la1, 3) - round(la0, 3), round(lo1, 3) - round(lo0, 3), (round(la0, 3) + round(la1, 3)) / 2
    dy3 = 6371 * round(dphi3, 3) * 0.01745
    lam3 = round(round(dlam3, 3) * 0.01745, 5)
    dx3 = 6371 * round(np.cos(round(pm3, 2) * D2R), 4) * lam3
    row("DP43", "E3: 00 UTC (49.667 N, 5.717 W), 06 UTC (50.516 N, 1.505 W); Δφ 0.849°, Δλ 4.212°, φ_mid 50.09°",
        [round(la0, 3), round(lo0, 3), round(la1, 3), round(lo1, 3), dphi3, dlam3, round(pm3, 2)], [49.667, -5.717, 50.516, -1.505, 0.849, 4.212, 50.09], [0, 0, 0, 0, 1e-9, 1e-9, 0])
    row("DP43", "E3: Δy = 6371 × 0.849 × 0.01745 = 94.4 km; Δλ = 4.212 × 0.01745 = 0.07350 rad; cos 50.09° = 0.6416; Δx = 6371 × 0.6416 × 0.07350 = 300.4 km",
        [dy3, lam3, round(np.cos(50.09 * D2R), 4), dx3], [94.39, 0.07350, 0.6416, 300.44], [5e-3, 1e-9, 0, 5e-3])
    row("DP43", "E3: √(94.4² + 300.4²) = 314.9 ≈ 315 km; 315 000 / 21 600 = 14.58 ≈ 14.6 m/s (= translation_velocity 14.58)",
        [np.hypot(94.4, 300.4), 315000 / 21600, spd], [314.88, 14.583, 14.58], [5e-3, 5e-4, 0.02])
    row("DP43", "E3: tan β = 300.4 / 94.4 = 3.18 → 72.6° on the flat map (the average direction); the great circle leaves at 71.0° (initial_bearing) and turns ≈ Δλ sin φ = 3.2°",
        [300.4 / 94.4, np.degrees(np.arctan2(300.4, 94.4)), brg, 4.212 * np.sin(50.09 * D2R)], [3.18, 72.55, 70.95, 3.23], [5e-3, 0.01, 0.1, 5e-3])
    V["e3"] = {"ll0": [round(la0, 3), round(lo0, 3)], "ll6": [round(la1, 3), round(lo1, 3)], "dy": dy3, "dx": dx3}
    # the centre: 'just off the tip of Cornwall' at 00 UTC; Plymouth to the centre
    c00 = (float(trk.lat[k00]), float(trk.lon[k00]))
    dP = float(call(GS + "great_circle_distance", "s15", "Plymouth – centre at 00 UTC", lat1=c00[0], lon1=c00[1], lat2=PLY[0], lon2=PLY[1])) / 1e3
    bP = float(call(GS + "initial_bearing", "s15", "bearing centre → Plymouth", lat1=c00[0], lon1=c00[1], lat2=PLY[0], lon2=PLY[1]))
    row("DP40", "Plymouth ≈ 123 km from the 00 UTC centre, to its north-east (bearing 22.5-67.5°)", [dP], [123.0], 1.5)
    truth("DP40", "centre → Plymouth bearing is north-east", 22.5 <= bP <= 67.5, round(bP, 1))
    truth("DP33", "00 UTC centre 'just off the tip of Cornwall' (49.4-50.2 N, 7.0-5.0 W)", 49.4 <= c00[0] <= 50.2 and -7.0 <= c00[1] <= -5.0, B1.r6(c00, 2))

    # ---------------- the 03 UTC ring (s09-s12)
    i03 = int(np.where(ctime == trk.times[k03])[0][0])
    u03, v03 = Cd.u10.values[i03].astype(float), Cd.v10.values[i03].astype(float)
    c03 = (float(trk.lat[k03]), float(trk.lon[k03]))
    Rg = call(DC + "storm_relative_wind", "s09", "200-km ring, ground-relative", heavy_call=True, u=u03, v=v03, lat=clat, lon=clon, centre=c03, radii_km=[200.0], n_az=72)
    Rs = call(DC + "storm_relative_wind", "s10", "200-km ring, storm-relative (v − U)", heavy_call=True, u=u03 - Ue, v=v03 - Un, lat=clat, lon=clon, centre=c03,
              radii_km=[200.0], n_az=72)
    Ru = call(DC + "storm_relative_wind", "s11", "a uniform wind U on the same ring", heavy_call=True, u=np.full_like(u03, Ue), v=np.full_like(v03, Un), lat=clat,
              lon=clon, centre=c03, radii_km=[200.0], n_az=72)
    az = np.degrees(Rg.azimuth)
    azR = (90.0 - (brg + 90.0)) % 360      # right of the track (bearing + 90°) as an azimuth from east, anticlockwise
    dS = np.abs(((az - azR) + 180) % 360 - 180)
    dN = np.abs(((az - azR - 180) + 180) % 360 - 180)
    south, north = dS <= 45, dN <= 45
    tg, ts, tu = Rg.tangential[0], Rs.tangential[0], Ru.tangential[0]
    S_g, N_g, S_s, N_s, S_u, N_u = float(tg[south].mean()), float(tg[north].mean()), float(ts[south].mean()), float(ts[north].mean()), float(tu[south].mean()), float(tu[north].mean())
    row("DP34", "sector-mean round part (ground): south 18.20, north 6.91 m/s ('about eighteen', 'about seven')", [S_g, N_g], [18.20, 6.91], 0.3)
    row("DP36", "sector-mean round part riding along: south 4.99, north 19.94; the motion's round part S +13.21, N −13.03", [S_s, N_s, S_u, N_u],
        [4.99, 19.94, 13.21, -13.03], 0.3)
    row("DP36", "ground − motion = rider, sector by sector (exact)", [S_g - S_u, N_g - N_u], [S_s, N_s], 1e-9)
    row("DP36", "screen: 18.2 − 13.2 = 5.0; 6.9 − (−13.0) = 19.9; ≈ 13 both sides", [18.2 - 13.2, 6.9 + 13.0, round(S_u), round(-N_u)], [5.0, 19.9, 13, 13], 1e-9)
    row("DP36", "screen rounding: 18.2, 6.9, 13.2, −13.0, 5.0, 19.9 = the sector means to 0.1", [S_g, N_g, S_u, N_u, S_s, N_s], [18.2, 6.9, 13.2, -13.0, 5.0, 19.9], 0.051)
    truth("DP34", "the southern sector is centred on the right of the track (bearing + 90° = 161°, azimuth 289°)", abs(azR - 289.0) < 0.5, round(azR, 2))
    iS, iN = int(np.argmin(dS)), int(np.argmin(dN))
    pS, pN = (float(Rg.lat[0][iS]), float(Rg.lon[0][iS])), (float(Rg.lat[0][iN]), float(Rg.lon[0][iN]))
    gS, gN = (float(Rg.u[0][iS]), float(Rg.v[0][iS])), (float(Rg.u[0][iN]), float(Rg.v[0][iN]))
    sS, sN = (gS[0] - Ue, gS[1] - Un), (gN[0] - Ue, gN[1] - Un)
    row("DP35", "points: south (48.43, −2.80), north (51.81, −4.73)", [*pS, *pN], [48.43, -2.80, 51.81, -4.73], 0.06)
    row("DP35", "ground (13.47, 8.44) / (−4.22, −5.33); storm-relative (−0.32, 3.68) / (−18.00, −10.08)", [*gS, *gN, *sS, *sN],
        [13.47, 8.44, -4.22, -5.33, -0.32, 3.68, -18.00, -10.08], 0.03)
    row("DP35", "storm-relative = the ring's own v − U interpolation (Rs) at the same points", [Rs.u[0][iS], Rs.v[0][iS], Rs.u[0][iN], Rs.v[0][iN]], [*sS, *sN], 1e-6)
    row("DP35", "|v′| south 3.7, north 20.6 m/s ('gentle three point seven', 'about twenty point six')", [np.hypot(*sS), np.hypot(*sN)], [3.7, 20.6], 0.05)
    row("DP35", "screen north: (−4.2, −5.3) − (13.8, 4.8) = (−18.0, −10.1); |(−18.0, −10.1)| = 20.6", [-4.2 - 13.8, -5.3 - 4.8, np.hypot(18.0, 10.1)], [-18.0, -10.1, 20.6], [1e-9, 1e-9, 0.05])
    row("DP35", "screen south east part: 13.5 − 13.8 = −0.3", 13.5 - 13.8, -0.3, 1e-9)
    # calc & sync audit #5e E1: the south point to 2 decimals; Pythagoras for both lengths
    row("DP43", "E1: south ground (13.47, 8.44), U (13.78, 4.75) to 2 dp; (13.47 − 13.78, 8.44 − 4.75) = (−0.31, 3.69); √(0.31² + 3.69²) = 3.70",
        [round(gS[0], 2), round(gS[1], 2), round(Ue, 2), round(Un, 2), 13.47 - 13.78, 8.44 - 4.75, np.hypot(0.31, 3.69)], [13.47, 8.44, 13.78, 4.75, -0.31, 3.69, 3.703],
        [0, 0, 0, 0, 1e-9, 1e-9, 5e-4])
    row("DP43", "E1 north: 18.0² = 324, 10.1² = 102.01 ≈ 102; √(324 + 102) = 20.64 ≈ 20.6", [18.0 ** 2, 10.1 ** 2, np.sqrt(324 + 102)], [324, 102.01, 20.64], [1e-9, 1e-9, 5e-3])
    # calc & sync audit #5e E4: the motion's round part on each side = |U| × the average of cos(angle between U and θ̂) over the ±45° side
    mcos = S_u / spd
    row("DP43", "E4: middle of the south side U·θ̂ = |U| (14.6); average cos over ±45° = 0.906; 14.6 × 0.906 = 13.2; north side −13.0",
        [float(tu[iS]), mcos, 14.6 * 0.906, N_u], [14.58, 0.906, 13.23, -13.03], [0.05, 5e-4, 5e-3, 0.03])
    tu5 = [float(tu[(iS + d) % len(tu)]) for d in (-8, -4, 0, 4, 8)]
    row("DP43", "E4 picture: U·θ̂ (data, vtu) at ring points −40°, −20°, 0°, +20°, +40° along the south side = 11.4, 13.8, 14.6, 13.7, 11.3 (screen, 1 dp)",
        [round(x, 1) for x in tu5], [11.4, 13.8, 14.6, 13.7, 11.3], 1e-9)
    row("DP43", "E4 picture: ≈ |U| cos(offset) (11.2, 13.7, 14.6, 13.7, 11.2) within 0.3 (the ring's points are 5° apart in azimuth on the sphere, not on the flat map)", tu5,
        [spd * np.cos(40 * D2R), spd * np.cos(20 * D2R), spd, spd * np.cos(20 * D2R), spd * np.cos(40 * D2R)], 0.3)
    V["e4"] = {"tu5": tu5, "di": [-8, -4, 0, 4, 8], "mcos": mcos}
    # ring means (s12, DC54)
    row("DC54", "ring means v_t 14.1 vs 13.8; v_r −6.0 vs −5.9 m/s", [Rg.tangential_mean[0], Rs.tangential_mean[0], Rg.radial_mean[0], Rs.radial_mean[0]],
        [14.1, 13.8, -6.0, -5.9], 0.06)
    row("DC54", "uniform-field ring mean = ground − storm-relative ring mean (v_t, v_r); 0.26 ('zero point three')", [Ru.tangential_mean[0], Ru.radial_mean[0], round(float(Ru.tangential_mean[0]), 1)],
        [Rg.tangential_mean[0] - Rs.tangential_mean[0], Rg.radial_mean[0] - Rs.radial_mean[0], 0.3], [1e-6, 1e-6, 0])
    ang_ = np.linspace(0, 2 * np.pi, 72, endpoint=False)
    xr_ = np.stack([200e3 * np.cos(ang_), 200e3 * np.sin(ang_)])
    upl = call(CS + "velocity_components", "s12", "a uniform wind on a flat circle: u_r, u_θ", heavy_call=True,
               u_cart=np.stack([np.full(72, Ue), np.full(72, Un)]), x=xr_, system="polar")
    row("DC54", "flat circle: a uniform wind's mean u_r and u_θ are 0 (to 1e-12)", np.abs(np.asarray(upl).mean(axis=1)), [0.0, 0.0], 1e-12)
    # ---------------- hourly frames 21 -> 06 UTC: isobars every 4 hPa, wind-speed and msl rasters
    bj = np.where((clat >= CIA_BOX[0] - 1) & (clat <= CIA_BOX[1] + 1))[0]
    bi = np.where((clon >= CIA_BOX[2] - 1) & (clon <= CIA_BOX[3] + 1))[0]
    slat, slon = clat[bj], clon[bi]
    lut_speed = B1.lut_rgb("cmocean.speed")
    lut_p = B1.lut_rgb("cividis")
    frames = []
    for kk in range(k21, k06 + 1):
        it = int(np.where(ctime == trk.times[kk])[0][0])
        P_ = msl[it][np.ix_(bj, bi)] / 100
        frames.append({"t": str(trk.times[kk])[:13], "iso": B1.contours(P_, slat, slon, list(range(940, 1032, 4)), nd=3)})
        sp_ = np.hypot(Cd.u10.values[it], Cd.v10.values[it])[np.ix_(bj, bi)]
        B1.rgba_png(sp_[::-1], lut_speed, 0, 30, IMG / f"cia_speed_{kk - k21:02d}.png", alpha=0.8, up=2)
        B1.rgba_png(P_[::-1], lut_p, 950, 1010, IMG / f"cia_msl_{kk - k21:02d}.png", alpha=0.85, up=2)
    sbox = [float(slat[0] - 0.125), float(slat[-1] + 0.125), float(slon[0] - 0.125), float(slon[-1] + 0.125)]
    # particle tracks through the frozen 03 UTC 10-m wind (animated wind; the motion is not a time change)
    rs3 = np.random.default_rng(11)
    cs_l, cs_o = rs3.uniform(CIA_BOX[0], CIA_BOX[1], 260), rs3.uniform(CIA_BOX[2], CIA_BOX[3], 260)
    ct = call(DT_ + "advect_on_sphere", "s08", "tracks through the frozen 03 UTC 10-m wind", heavy_call=True, u=u03[np.ix_(bj, bi)], v=v03[np.ix_(bj, bi)],
              lat=slat, lon=slon, seeds_lat=cs_l, seeds_lon=cs_o, dt=600.0, nsteps=47)
    # the s01 'Cornish shore' spot: ground and rider wind (arrow lengths only)
    gC = (float(B1.bilin(u03, clat, clon, *NEWQUAY)), float(B1.bilin(v03, clat, clon, *NEWQUAY)))
    V_hook = {"ll": list(NEWQUAY), "g": [round(gC[0], 2), round(gC[1], 2)], "s": [round(gC[0] - Ue, 2), round(gC[1] - Un, 2)]}
    truth("DP31", "s01: the shore and the rider see different winds at the same spot (|v| ≠ |v − U| by > 2 m/s)", abs(np.hypot(*gC) - np.hypot(gC[0] - Ue, gC[1] - Un)) > 2,
          B1.r6([np.hypot(*gC), np.hypot(gC[0] - Ue, gC[1] - Un)], 2))
    # ---------------- Plymouth barometer (s13-s16)
    i23, i00, i01 = (int(np.where(ctime == trk.times[k])[0][0]) for k in (k23, k00, k01))
    p23, p00, p01 = (float(B1.bilin(msl[i], clat, clon, PLY[0], PLY[1])) / 100 for i in (i23, i00, i01))
    row("DP40", "Plymouth p(23, 00, 01 UTC) = 964.13, 960.77, 956.49 hPa", [p23, p00, p01], [964.13, 960.77, 956.49], 0.02)
    dpdt = (p01 - p23) / 2
    gr = call(GS + "gradient", "s15", "∇p = (1/(a cos φ) ∂p/∂λ, (1/a) ∂p/∂φ)", heavy_call=True, F=msl[i00], lat=clat, lon=clon)
    gx, gy = float(B1.bilin(gr.dFdx, clat, clon, *PLY)), float(B1.bilin(gr.dFdy, clat, clon, *PLY))   # Pa per m
    gmag, gdir = np.hypot(gx, gy) * 1e3 / 100, (np.degrees(np.arctan2(gx, gy)) + 360) % 360       # hPa per km, bearing of increase
    along = (gx * np.sin(brg * D2R) + gy * np.cos(brg * D2R)) * 1e3 / 100                         # hPa per km along U
    terms, tot = call(GC + "chain_rule_rate", "s14", "∂p/∂τ = ∂p/∂t + U·∇p (the rider is a traveller at U)", dFdt=dpdt / 3600 * 100, grad=[gx, gy], velocity=[Ue, Un])
    UgP = float(terms[1] + terms[2]) * 3600 / 100          # U·∇p in hPa/h
    dpdtau = float(tot) * 3600 / 100
    row("DC56", "Plymouth 00 UTC: ∂p/∂t −3.82, −U·∇p −3.21, residual ∂p/∂τ −0.61 hPa/h", [dpdt, -UgP, dpdtau], [-3.82, -3.21, -0.61], 0.02)
    row("DP40", "|∇p| 0.0618 hPa/km towards 63°; along U 0.0613 ('zero point zero six one')", [gmag, gdir, along], [0.0618, 63.0, 0.0613], [3e-4, 1.5, 3e-4])
    row("DP40", "U·∇p = speed × slope along U (exact)", spd * 3.6 * along, UgP, 1e-9)
    row("DP40", "screen: (956.5 − 964.1)/2 = −3.8; 52.5 × 0.061 ≈ 3.2; −3.8 + 3.2 = −0.6", [(956.5 - 964.1) / 2, 52.5 * 0.061, -3.8 + 3.2], [-3.8, 3.2, -0.6], [1e-9, 0.01, 1e-9])
    row("DP40", "screen rounding: 964.1, 956.5, −3.8, 0.061, 3.2, −0.6 = the data to their last digit", [p23, p01, dpdt, along, UgP, dpdtau],
        [964.1, 956.5, -3.8, 0.061, 3.2, -0.6], [0.05, 0.05, 0.05, 0.0005, 0.05, 0.05])
    # calc & sync audit #5e E5, E6: the slope along U is a dot product; the m/s → km/h step
    row("DP43", "E5: |∇p| = 0.0618 ≈ 0.062 hPa/km towards 63°; angle to U 71 − 63 = 8°; 0.062 × cos 8° = 0.0614 ≈ 0.061",
        [round(gmag, 3), round(gdir), round(brg) - round(gdir), 0.062 * np.cos(8 * D2R), along], [0.062, 63, 8, 0.0614, 0.0613], [0, 0, 0, 5e-5, 5e-4])
    row("DP43", "E6: 14.58 m/s × 3.6 = 52.49 ≈ 52.5 km/h", [round(spd, 2), round(spd, 2) * 3.6], [14.58, 52.49], [0, 5e-3])
    c23m, c01m = trk.msl_min[k23] / 100, trk.msl_min[k01] / 100
    row("DP41", "centre msl_min 954.9 -> 954.0 hPa in 2 h: −0.47 hPa/h ('about minus half')", [c23m, c01m, (c01m - c23m) / 2], [954.9, 954.0, -0.47], [0.05, 0.05, 0.03])
    row("DP41", "screen: (954.0 − 954.9)/2 = −0.45 ≈ −0.5 (the exact −0.47)", (954.0 - 954.9) / 2, -0.45, 1e-9)
    row("DP42", "s16 bars: −3.8 = −0.6 − 3.2", -0.6 - 3.2, -3.8, 1e-9)
    # the frozen-pattern ghost: 23 UTC isobars slid by U for 1 h and 2 h (destination_point along the motion bearing)
    P23 = msl[i23][np.ix_(bj, bi)] / 100
    c23 = B1.contours(P23, slat, slon, list(range(940, 1032, 4)), nd=3)
    ghost = []
    for hrs in (0, 1, 2):
        g_ = []
        for c in c23:
            ls_ = []
            for ln in c["lines"]:
                q = np.asarray(ln).reshape(-1, 2)
                if hrs:
                    la2, lo2 = SPH.destination_point(q[:, 1], q[:, 0], brg, spd * 3600 * hrs)
                    q = np.stack([lo2, la2], -1)
                ls_.append(np.round(q, 3).ravel().tolist())
            g_.append({"level": c["level"], "lines": ls_})
        ghost.append(g_)
    recorded(GS + "destination_point", "s13", "frozen 23 UTC isobars slid along U for 1 h and 2 h", {"bearing": brg, "distance_m": [spd * 3600, spd * 7200]},
             B1.r6([spd * 3600 / 1e3, spd * 7200 / 1e3], 3))
    # 1-D pressure profile along U through Plymouth at 00 UTC (s14 picture: 'a 1-D pressure profile sliding right')
    sprof = np.linspace(-300e3, 300e3, 121)
    pl_, po_ = SPH.destination_point(np.full(sprof.size, PLY[0]), np.full(sprof.size, PLY[1]), np.where(sprof >= 0, brg, (brg + 180) % 360), np.abs(sprof))
    pprof = np.asarray(B1.bilin(msl[i00], clat, clon, pl_, po_)) / 100
    row("DP40", "1-D profile along U: centred slope at Plymouth = 0.061 hPa/km (bilinear profile ≈ gradient)", (pprof[61] - pprof[59]) / 10.0, along, 0.004)
    # ---------------- Brest SYNOP gust (s12)
    isd = json.loads(B1.F_ISD.read_text(encoding="utf-8"))["reports"]
    r3 = [r for r in isd if r["time"].startswith("2023-11-02T03:00") and r["report_type"] == "FM-12"][0]
    g911 = None
    toks = r3["synop"].split()
    if "333" in toks:
        for tk in toks[toks.index("333") + 1:]:
            if tk.startswith("911"):
                g911 = int(tk[3:])
                break
    row("DC55", "Brest SYNOP 03 UTC 2 Nov 911 group = 84 kt = 155.6 km/h ('about a hundred and fifty six')", [g911, g911 * 1.852], [84, 155.6], 0.1)
    coast = [p for _, ps in B1.shp_parts(B1.F_NE10C) for p in ps]
    V["ciaran"] = {"box": list(CIA_BOX), "sbox": sbox, "frames": frames, "track": [[str(t)[:13], B1.r6(trk.lat[k], 3), B1.r6(trk.lon[k], 3), B1.r6(trk.msl_min[k] / 100, 2)]
                   for k, t in enumerate(trk.times) if k21 <= k <= k06], "U": [Ue, Un], "spd": spd, "brg": brg, "c00": list(c00), "c03": list(c03), "azR": azR,
                   "ring": {"az": B1.r6(az, 1), "lat": B1.r6(Rg.lat[0], 3), "lon": B1.r6(Rg.lon[0], 3), "u": B1.r6(Rg.u[0], 2), "v": B1.r6(Rg.v[0], 2),
                            "rhat": B1.r6(np.asarray(Rg.rhat)[0], 4) if hasattr(Rg, "rhat") else None,
                            "vt": B1.r6(tg, 2), "vr": B1.r6(Rg.radial[0], 2), "vts": B1.r6(ts, 2), "vrs": B1.r6(Rs.radial[0], 2), "vtu": B1.r6(tu, 2),
                            "south": [int(i) for i in np.where(south)[0]], "north": [int(i) for i in np.where(north)[0]]},
                   "sec": {"S_g": S_g, "N_g": N_g, "S_s": S_s, "N_s": N_s, "S_u": S_u, "N_u": N_u},
                   "pts": {"S": {"i": iS, "ll": list(pS), "g": list(gS), "s": list(sS)}, "N": {"i": iN, "ll": list(pN), "g": list(gN), "s": list(sN)}},
                   "vtm": [float(Rg.tangential_mean[0]), float(Rs.tangential_mean[0]), float(Ru.tangential_mean[0])],
                   "vrm": [float(Rg.radial_mean[0]), float(Rs.radial_mean[0]), float(Ru.radial_mean[0])],
                   "tracks": [np.round(t, 2).tolist() for t in ct], "track_dt_s": 600.0, "hook": V_hook,
                   "ply": {"p": list(PLY), "p3": [p23, p00, p01], "dpdt": dpdt, "UgP": UgP, "dpdtau": dpdtau, "grad": [gx, gy], "gmag": gmag, "gdir": gdir,
                           "along": along, "dist_km": dP, "brg_from_c": bP, "prof_s_km": B1.r6(sprof / 1e3, 1), "prof_p": B1.r6(pprof, 3)},
                   "cmin": [float(c23m), float(trk.msl_min[k00] / 100), float(c01m)], "ghost": ghost, "gust_kt": g911,
                   "coast": B1.box_lines(coast, (43.0, 59.0, -16.0, 6.0), nd=3, step=2), "brest": list(BREST)}
    V["luts"] = {"speed": B1.lut_hex("cmocean.speed"), "p": B1.lut_hex("cividis")}
    say["ciaran"] = {"p00": "954.5", "spd": "14.6", "kmh": "52.5", "brg": "71°", "Ue": "13.8", "Un": "4.8", "S": "18", "N": "7", "vtm": "14.1 / 13.8", "vrm": "−6.0 / −5.9",
                     "gust": "84 kt ≈ 156 km/h", "p23": "964.1", "p01": "956.5", "dpdt": "−3.8", "along": "0.061", "UgP": "3.2", "dpdtau": "−0.6", "dist": "123 km"}
    # ================================================================ s17 recap = scene rows
    row("DP42", "recap: U ≈ 15 m/s; spin ≈ 14; −3.8 at Plymouth; 9.8; −4.0 + 5.4 = 1.4", [round(spd), round(float(Rg.tangential_mean[0])), round(dpdt, 1), round(loc_g, 1) + round(adv_g, 1)],
        [15, 14, -3.8, 1.4], 1e-9)
    V["lines"] = {"globe110": [np.round(np.asarray(ln, float), 2).tolist() for ln in json.loads(B1.F_NE110.read_text(encoding="utf-8"))["coastline"]]}
    V["say"] = say
    V["consts"] = {"a": EARTH_RADIUS}

    # ---------------------------------------------------------------------------------------------- report and write
    for r in rows:
        print(f"  {'PASS' if r['pass'] else 'FAIL'}  {r['id']:5s} {r['name']}  -> {r['value']}")
    for fl in flags:
        print(f"  FLAG  {fl['id']:5s} {fl['scene']} {fl['what']}: {fl['note']}")
    if not all(r["pass"] for r in rows):
        print("build_ch00_coordinates_moving: checks FAILED — no data written")
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
    (DATA / "mv.json").write_bytes(blob)
    data_hashes = {"mv.json": hashlib.sha256(blob).hexdigest()}
    for pimg in sorted(IMG.glob("*.png")):
        data_hashes[f"img/{pimg.name}"] = B1.sha_file(pimg)
    render = {}
    for pub in a.public:
        pub.mkdir(parents=True, exist_ok=True)
        Image.open(B1.F_BMNG).convert("RGB").resize((4096, 2048), Image.LANCZOS).save(pub / "mv_bmng.jpg", quality=88)
        for pimg in sorted(IMG.glob("*.png")):
            (pub / f"mv_{pimg.name}").write_bytes(pimg.read_bytes())
        render = {pp.name: B1.sha_file(pp) for pp in sorted(pub.glob("mv_*"))}
    inputs = {str(pq.relative_to(ROOT)).replace("\\", "/") if ROOT in pq.parents else str(pq): B1.sha_file(pq)
              for pq in [B1.F_CIA, B1.F_ISD, B1.F_NE10C, B1.F_NE110, B1.F_BMNG]}
    manifest = {
        "id": "ch00_coordinates_moving", "title": TITLE, "storyboard": "movies/ch00/ch00_coordinates_moving/storyboard.yaml",
        "builder": "movies/data/build_ch00_coordinates_moving.py",
        "fluidpy": {"repo": "../Fluid Dynamics", **B1.git_sha(FLUID, {"kinematics_py": "fluidpy/core/kinematics.py", "coords_py": "fluidpy/core/coords.py",
                                                                     "calculus_py": "fluidpy/geo/calculus.py", "sphere_py": "fluidpy/geo/sphere.py",
                                                                     "cyclone_py": "fluidpy/diag/cyclone.py", "trajectories_py": "fluidpy/diag/trajectories.py"})},
        "equations_note": "provenance only (QA/reviewer); the movie draws no equation labels or numbers (HOUSE_STYLE §5)",
        "equations": {"x = x' + Ut, t' = t": "Kundu §3.3 text before (3.9) (x'_o = 0)", "u = u' + U": "Kundu §3.3", "accelerations equal": "Kundu (3.9)",
                      "DT/Dt, Du/Dt": "Vallis §1.1.2 (1.5), (1.7); Kundu (B.1.4)", "v' = v − U": "Kundu §3.3 rearranged",
                      "x' = x − Ut, tau = t; dp/dt = dp/dtau − U·grad p": "Kundu (B.2.1)-(B.2.2), Example B.2 (xi written x')",
                      "ring components": "Vallis (2.28)-(2.29) via diag.cyclone.storm_relative_wind"},
        "parameters": {"places": {"Plymouth": list(PLY), "Brest": list(BREST), "Newquay_hook": list(NEWQUAY)},
                       "train": {"U": 20.0, "walker": 1.5, "speeding": "1.5 -> 2.0 m/s in 1 s", "g": 9.81},
                       "gust_pattern": {"u": "10 + 5 sin(2π (x − 10 t) / 200 km) m/s", "point_phase_deg": 45, "U": 10.0, "fluidpy_steps": {"h_m": 1.0, "ht_s": 1.0}},
                       "ciaran": {"seed": [52.5, 1.75, "2023-11-02T12"], "box_deg": [1.2, 2.0], "max_step_km": 120, "ring_km": 200, "n_az": 72,
                                  "sectors": "±45° about the right (bearing + 90°) and left of the track", "motion": "00-06 UTC 2 Nov (translation_velocity, at='start')",
                                  "plymouth": "bilinear msl at 50.25 N 4.25 W; centred hourly difference 23-01 UTC; fluidpy.geo.sphere.gradient of msl at 00 UTC"},
                       "time_compression": {"s00": "title animations (train, hourly isobars) in a few seconds", "s07": "one hour of the gust pattern in about 4 s",
                                            "s08": "hourly fields 21 -> 06 UTC at about 1 h per 1.5 s; particles 600 s per sample through the frozen 03 UTC field",
                                            "s13": "the frozen-pattern ghost slid 1 h and 2 h in a few seconds"},
                       "exaggerations": ["s01 icons illustrative", "s02 tripod arrows ≈ 800 km on the globe mini", "s06 parcel cube and map illustrative (no data)",
                                         "s10 inset arrows enlarged (scale in the scene: 9 px per m/s)", "s14 1-D profile = the real 00 UTC msl along U through Plymouth"],
                       "screen_deviations": ["s00 title in the series layout of Parts 1 and 4 ('Coordinates · Part 5' 64 px, 'Moving' / 'frames' 150 px, 'made easy' 88 px, "
                                             "'storm-relative winds' 68 px) instead of the storyboard's one-line 150-px 'Coordinates · Part 5' (does not fit x 100-1075)",
                                             "skip chips in the lower maths zone (as Parts 1 and 4)", "s10 south calc written with '≈' (flag F3)"],
                       "data_report": "reports/data/ch00_coordinates_research.md (2026-11-05): Ciarán unchanged from build 1"},
        "credits": ["Contains modified Copernicus Climate Change Service information 2026 (ERA5 hourly surface for Ciarán, via the ARCO ERA5 store).",
                    "NOAA NCEI Integrated Surface Database (ISD): Brest-Guipavas 07110 SYNOP (WMO Resolution 40 notice applies).",
                    "NASA Blue Marble Next Generation (NASA Earth Observatory).", "Made with Natural Earth.",
                    "Music: tools/sound (procedural synthesis, our own code, CC0-1.0); style per storyboard (passing-front, seed 43) or its runner-up."],
        "js_selftest": "none — every number is read from data/mv.json (TSX CHECK rows re-assert the screen strings)",
        **chapters(), "inputs_sha256": inputs, "render_assets": render, "data_files": data_hashes, "checks": rows, "flags": flags,
        "physics": [e for e in entries if e.get("sha256")], "physics_recorded": [e for e in entries if not e.get("sha256")], "physics_heavy": heavy,
    }
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=1, ensure_ascii=False, default=str), encoding="utf-8")
    print(f"build_ch00_coordinates_moving: mv.json {len(blob) / 1e3:.0f} kB + {len(data_hashes) - 1} images; {len(entries)} parity entries, "
          f"{len(heavy)} heavy, {len(rows)} checks ({sum(r['pass'] for r in rows)} pass), {len(flags)} flags -> {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
