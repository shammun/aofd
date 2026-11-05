"""Physics products for the Chapter-0 movie #5f "Coordinates, Part 6 — Routes: great circles and rhumb lines"
(movies/ch00/ch00_coordinates_routes/storyboard.yaml, 16 scenes; CHECK rows DM01-DM17, incl. the storyboard's DM04, DM07,
DM09-DM14).

Run with the main venv::

    .venv/Scripts/python.exe movies/data/build_ch00_coordinates_routes.py [--public <render public dir> ...]

Every number the movie shows or says is computed here by the tested functions named in the storyboard's ``physics_source``
fields (no download; files already on disk):

* ``fluidpy.geo.sphere`` (unit_vector, arc_lengths, parallel_points, meridian_points, central_angle, great_circle_distance,
  great_circle_points, great_circle_vertex, initial_bearing, destination_point, rhumb_line, isometric_latitude),
* ``fluidpy.core.curvilinear.scale_factors`` (polar/cylindrical and spherical, symbolic),
* ``fluidpy.geo.mapproj.forward('mercator')`` (the s01 / s11 / s13 / s14 Mercator charts),
* ``fluidpy.geo.constants.EARTH_RADIUS`` (a = 6371 km; every distance call gets SI metres).

Inputs: Natural Earth 50 m land (the Mercator charts and the Greenland check), NE 110 m globe lines, NASA Blue Marble NG
(the globe texture). No weather data in this part.

Writes movies/ch00/ch00_coordinates_routes/data/rt.json (numbers and small arrays the composition only indexes and
interpolates) and manifest.json (functions, provenance, parameters, fluidpy git SHA, sha256 of inputs, data and render assets,
parity hashes, chapter marks + the maths-skip target from timing.json). All CHECK rows must pass before anything is written
(exit 1 otherwise). ``flags`` lists screen/voice roundings that a hand check finds slightly inconsistent (reported to the
director; not CHECK failures because the storyboard voice is fixed).
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
OUT = ROOT / "movies" / "ch00" / "ch00_coordinates_routes"
DATA = OUT / "data"
sys.path.insert(0, str(FLUID))
sys.path.insert(0, str(Path(__file__).resolve().parent))
import build_ch00_coordinates as B1  # noqa: E402  (shared helpers: parity_hash, r6, sha_file, git_sha, shp_parts, F_NE50L, F_NE110, F_BMNG)

D2R = np.pi / 180.0
TITLE = "Coordinates, Part 6 — Routes: great circles and rhumb lines"
LONDON, LA = (51.51, -0.13), (34.05, -118.24)          # city centres (storyboard honesty note)
BREST, LISBON, LYB = (48.39, -4.49), (38.72, -9.14), (78.22, 15.65)
GS, GM = "fluidpy.geo.sphere.", "fluidpy.geo.mapproj."
TILTS = (20.0, 40.0, 60.0)                              # s06 small circles through both cities (planes tilted about the chord)

# storyboard chapter_marks (titles verbatim) and maths_skip block
CHAPTERS = [("s00_title", "Routes: the question"), ("s02_part5_recap", "What we use from Parts 1, 3, 4 and 5"),
            ("s03_curvilinear", "Curvilinear coordinates and scale factors"), ("s05_shortest_way", "The shortest way: great circles"),
            ("s07_sigma", "The angle sigma and d = a sigma"), ("s08_position_arrows", "Every step: working out sigma (optional maths)"),
            ("s11_route_shape", "Where the route goes"), ("s12_rhumb", "The rhumb line"), ("s13_why_rhumb", "Why sailors liked the rhumb line"),
            ("s14_recap", "To sum up")]
SKIPS = [("A", "s08_position_arrows", ["s08_position_arrows", "s09_cos_sigma", "s10_distance"], "s11_route_shape")]


def chapters() -> dict:
    """Chapter marks and the maths-skip target from the current timing.json (user rule 2026-11-05). The first mark is 0:00
    (t 0.3 s = the first word); the skip target is the start of s11, whose FIRST sentence is the keep line."""
    tp = OUT / "timing.json"
    if not tp.exists():
        return {}
    tm = json.loads(tp.read_text(encoding="utf-8"))
    by = {s["id"]: s for s in tm["scenes"]}
    mmss = lambda t: f"{int(t) // 60}:{int(t) % 60:02d}"  # noqa: E731
    ch = [{"time": mmss(by[sid]["start"]), "t_s": round(by[sid]["start"], 3), "title": ti, "scene": sid} for sid, ti in CHAPTERS]
    sk = []
    for blk, a, block, tgt in SKIPS:
        q = by[tgt]["sentences"][0]
        assert q["text"].startswith("If you skipped"), tgt
        j = next(i for i, s in enumerate(by[a]["sentences"]) if "skip ahead" in s["text"])
        sk.append({"block": blk, "chip_scene": a, "block_scenes": block, "chip_sentence": j, "chip_at_s": round(by[a]["sentences"][j]["start"], 3),
                   "skip_to_scene": tgt, "skip_to": mmss(by[tgt]["start"]), "skip_to_s": round(by[tgt]["start"], 3), "keep_line": q["text"]})
    return {"chapters": ch, "maths_skips": sk, "timing_provisional": bool(tm.get("provisional"))}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--public", type=Path, nargs="*", default=[], help="render public dir(s) for the rt_* assets")
    a = ap.parse_args()
    from PIL import Image
    import sympy as sp
    DATA.mkdir(parents=True, exist_ok=True)
    rows: list[dict] = []
    flags: list[dict] = []
    entries: list[dict] = []
    V: dict = {}

    def row(wid, name, val, ref, tol):
        v, r = np.asarray(val, dtype=float), np.asarray(ref, dtype=float)
        ok = bool(np.all(np.abs(v - r) <= np.asarray(tol)))
        rows.append({"id": wid, "name": name, "value": B1.r6(np.ravel(v)[:12]), "ref": B1.r6(np.ravel(r)[:12]), "tol": tol, "pass": ok})

    def truth(wid, name, cond, value=None):
        rows.append({"id": wid, "name": name, "value": value if value is not None else bool(cond), "ref": True, "tol": 0, "pass": bool(cond)})

    def flag(wid, scene, what, screen, exact, note):
        flags.append({"id": wid, "scene": scene, "what": what, "screen_or_voice": screen, "hand_check": exact, "note": note})

    def call(fn: str, scene: str, eq: str, **params):
        mod, name = fn.rsplit(".", 1)
        out = getattr(importlib.import_module(mod), name)(**params)
        jp = {k: (np.asarray(v).tolist() if isinstance(v, np.ndarray) else v) for k, v in params.items()}
        try:
            h = B1.parity_hash(out)
        except Exception:
            h = None
        entries.append({"fn": fn, "scene": scene, "data": "data/rt.json", "eq": eq, "params": jp, "sha256": h})
        return out

    from fluidpy.geo.constants import EARTH_RADIUS
    A_KM = EARTH_RADIUS / 1e3
    row("DM01", "a = 6371 km (fluidpy.geo.constants.EARTH_RADIUS, metres)", A_KM, 6371.0, 1e-9)

    # ================================================================ s02 recap (Parts 1, 3)
    AL = call(GS + "arc_lengths", "s02", "δy = a δφ, δx = a cos φ δλ (1°, Brest)", lat=BREST[0], dlat=1.0, dlon=1.0)
    rB = np.asarray(call(GS + "unit_vector", "s02", "r̂ = (cos φ cos λ, cos φ sin λ, sin φ) (Brest)", lat=BREST[0], lon=BREST[1]))
    cB, sB, cLb, sLb = np.cos(BREST[0] * D2R), np.sin(BREST[0] * D2R), np.cos(BREST[1] * D2R), np.sin(BREST[1] * D2R)
    row("DM02", "r̂ formula = unit_vector at Brest", rB - np.array([cB * cLb, cB * sLb, sB]), [0, 0, 0], 1e-15)
    row("DM02", "1° north = 111.19 km ('about a hundred and eleven'); 1° east at Brest = 73.84 km = 111.19 × cos φ", [float(AL.dy) / 1e3, float(AL.dx) / 1e3, float(AL.dy) / 1e3 * cB],
        [111.19, 73.84, 73.84], 0.005)
    row("DM02", "a ≈ 6400 km (easy), 6371 km (exact)", [round(A_KM, -2), A_KM], [6400, 6371], 1e-9)

    # ================================================================ s03 curvilinear: 1° of longitude near the equator and near the pole
    AL0 = call(GS + "arc_lengths", "s03", "1° east at the equator", lat=0.0, dlat=1.0, dlon=1.0)
    ALy = call(GS + "arc_lengths", "s03", "1° east at Longyearbyen 78.22 N", lat=LYB[0], dlat=1.0, dlon=1.0)
    row("DM03", "1° east: 111.19 km at the equator ('≈ 111 km'), 22.70 km at 78.22° N ('≈ 23 km'); ratio 1/cos = 4.9 (Part 3)",
        [float(AL0.dx) / 1e3, float(ALy.dx) / 1e3, 1 / np.cos(LYB[0] * D2R)], [111.19, 22.70, 4.9], [0.005, 0.005, 0.01])
    hS = call("fluidpy.core.curvilinear.scale_factors", "s03", "spherical (r, θ colatitude, φ longitude): (1, r, r sin θ)", system="spherical")
    hC = call("fluidpy.core.curvilinear.scale_factors", "s03", "cylindrical (R, φ, z): (1, R, 1)", system="cylindrical")
    lat_ = sp.symbols("varphi")
    cv = importlib.import_module("fluidpy.core.curvilinear")
    qS, qC = cv.coordinates("spherical"), cv.coordinates("cylindrical")
    h_lam = sp.simplify(hS[2].subs(qS[1], sp.pi / 2 - lat_))              # colatitude θ = π/2 − φ
    truth("DM03", "scale factors: polar ring h_θ = r (cylindrical h₂ = R); sphere h_φ = r (= a), h_λ = r sin(colat) = r cos φ",
          sp.simplify(hC[1] - qC[0]) == 0 and sp.simplify(hS[1] - qS[0]) == 0 and sp.simplify(h_lam - qS[0] * sp.cos(lat_)) == 0,
          f"cyl {hC}, sph {hS}, h_lambda {h_lam}")

    # ================================================================ s04 scale factors at Brest
    deg = np.pi / 180
    row("DM04", "1° = π/180 = 0.01745 rad; 6371 × 0.01745 = 111.17 ≈ 111.2; arc_lengths dy 111.19 km (storyboard 111.19)",
        [deg, 6371 * 0.01745, float(AL.dy) / 1e3], [0.01745, 111.2, 111.19], [5e-6, 0.05, 0.005])
    row("DM04", "cos 48.4° = 0.664; 111.2 × 0.664 = 73.84 ≈ 73.8; arc_lengths dx 73.84 km (storyboard)", [np.cos(48.4 * D2R), 111.2 * 0.664, float(AL.dx) / 1e3],
        [0.664, 73.8, 73.84], [5e-4, 0.05, 0.005])
    V["scale"] = {"dy": float(AL.dy) / 1e3, "dx": float(AL.dx) / 1e3, "deg": deg, "cos": float(cB), "eq": float(AL0.dx) / 1e3, "lyb": float(ALy.dx) / 1e3}

    # ================================================================ s05 great circles vs the 60° N parallel
    P60 = np.asarray(call(GS + "parallel_points", "s05", "60° N parallel (unit sphere): centre on the axis at sin 60°", lat=60.0, n=73))
    M0 = np.asarray(call(GS + "meridian_points", "s05", "Greenwich meridian (half great circle)", lon=0.0, n=37))
    M180 = np.asarray(call(GS + "meridian_points", "s05", "its partner, 180°", lon=180.0, n=37))
    row("DM05", "60° N parallel: radius cos 60° = 0.5, centre height sin 60° = 0.866 (above the Earth's centre)", [np.hypot(P60[:, 0], P60[:, 1]).max(), P60[:, 2].mean()],
        [0.5, 0.8660], 1e-4)
    row("DM05", "meridian + partner: a full circle through the centre (plane normal ŷ, |r| = 1)", [np.abs(M0[:, 1]).max(), np.abs(M180[:, 1]).max(), np.abs(np.linalg.norm(M0, axis=1) - 1).max()],
        [0, 0, 0], 1e-12)

    # ================================================================ s06-s10 the great circle London - Los Angeles
    r1 = np.asarray(call(GS + "unit_vector", "s08", "r̂₁ London", lat=LONDON[0], lon=LONDON[1]))
    r2 = np.asarray(call(GS + "unit_vector", "s08", "r̂₂ Los Angeles", lat=LA[0], lon=LA[1]))
    gla, glo = call(GS + "great_circle_points", "s06", "slerp of r̂ (181 points)", lat1=LONDON[0], lon1=LONDON[1], lat2=LA[0], lon2=LA[1], n=181)
    gla, glo = np.asarray(gla), np.asarray(glo)
    nrm = np.cross(r1, r2)
    nrm = nrm / np.linalg.norm(nrm)
    G3 = np.stack([np.cos(gla * D2R) * np.cos(glo * D2R), np.cos(gla * D2R) * np.sin(glo * D2R), np.sin(gla * D2R)], -1)
    row("DM06", "great circle points lie in the plane through both cities and the centre (|n̂·r̂| max)", np.abs(G3 @ nrm).max(), 0.0, 1e-12)
    row("DM06", "voice: London 'fifty one and a half N, almost on the prime meridian'; LA 'thirty four N, a hundred and eighteen W'",
        [LONDON[0], abs(LONDON[1]), LA[0], -LA[1]], [51.5, 0.13, 34.0, 118.0], [0.011, 0.131, 0.051, 0.241])
    nlat, nlon = float(np.degrees(np.arcsin(nrm[2]))), float(np.degrees(np.arctan2(nrm[1], nrm[0])))
    V["plane"] = {"n": B1.r6(nrm), "lat": nlat, "lon": nlon}
    # DM07: small circles through both cities (planes tilted about the chord): all longer than the great circle between them
    sig = float(call(GS + "central_angle", "s07", "σ = atan2(|r̂₁ × r̂₂|, r̂₁ · r̂₂)", lat1=LONDON[0], lon1=LONDON[1], lat2=LA[0], lon2=LA[1]))
    dgc = float(call(GS + "great_circle_distance", "s10", "d = a σ (a in metres)", lat1=LONDON[0], lon1=LONDON[1], lat2=LA[0], lon2=LA[1]))
    u = (r2 - r1) / np.linalg.norm(r2 - r1)
    small = []
    for t in TILTS:
        nt = nrm * np.cos(t * D2R) + np.cross(u, nrm) * np.sin(t * D2R)
        h = float(nt @ r1)
        cc, rho = h * nt, np.sqrt(1 - h * h)
        e1 = (r1 - cc) / rho
        e2 = np.cross(nt, e1)
        th12 = float(np.arctan2(e2 @ (r2 - cc), e1 @ (r2 - cc)))
        th = np.linspace(0, th12, 241)
        P = cc + rho * (np.cos(th)[:, None] * e1 + np.sin(th)[:, None] * e2)
        sla, slo = np.degrees(np.arcsin(np.clip(P[:, 2], -1, 1))), np.degrees(np.arctan2(P[:, 1], P[:, 0]))
        seg = np.asarray(call(GS + "great_circle_distance", "s06", f"small circle tilt {t:.0f}°: chord sum of 240 steps", lat1=sla[:-1], lon1=slo[:-1], lat2=sla[1:], lon2=slo[1:]))
        Ls = float(seg.sum()) / 1e3
        exact = A_KM * rho * abs(th12)
        thf = np.linspace(0, 2 * np.pi, 145)
        Pf = cc + rho * (np.cos(thf)[:, None] * e1 + np.sin(thf)[:, None] * e2)
        row("DM07", f"tilt {t:.0f}°: through both cities (|r|=1, ends), arc a ρ θ = {exact:.0f} km = 240-step great-circle chord sum (rel 1e-4)",
            [np.abs(np.linalg.norm(P, axis=1) - 1).max(), np.linalg.norm(P[0] - r1), np.linalg.norm(P[-1] - r2), (Ls - exact) / exact], [0, 0, 0, 0], [1e-12, 1e-12, 1e-12, 1e-4])
        small.append({"tilt": t, "rho": rho, "len_km": exact, "lat": B1.r6(sla[::4], 3), "lon": B1.r6(slo[::4], 3),
                      "flat": B1.r6(np.degrees(np.arcsin(np.clip(Pf[:, 2], -1, 1))), 3), "flon": B1.r6(np.degrees(np.arctan2(Pf[:, 1], Pf[:, 0])), 3)})
    truth("DM07", "every small circle through both cities is longer between them than the great circle (8755 km); smaller circle → longer",
          all(s["len_km"] > dgc / 1e3 for s in small) and small[0]["len_km"] < small[1]["len_km"] < small[2]["len_km"], [round(s["len_km"]) for s in small])
    V["small"] = small

    # s07 / s08 numbers
    cs1 = [np.cos(LONDON[0] * D2R), np.cos(LONDON[1] * D2R), np.sin(LONDON[1] * D2R), np.sin(LONDON[0] * D2R)]
    cs2 = [np.cos(LA[0] * D2R), np.cos(LA[1] * D2R), np.sin(LA[1] * D2R), np.sin(LA[0] * D2R)]
    row("DM08", "1° of σ = a π/180 = 111.19 km ('a hundred and eleven point two'); 10° = 1111.9 km ('≈ 1112')", [A_KM * deg, A_KM * deg * 10], [111.2, 1112], [0.01, 0.5])
    row("DM09", "r̂₁ (0.6224, −0.0014, 0.7827), r̂₂ (−0.3920, −0.7299, 0.5599) (storyboard, 1e-4)", [*r1, *r2], [0.6224, -0.0014, 0.7827, -0.3920, -0.7299, 0.5599], 1e-4)
    row("DM09", "London cos φ 0.622, cos λ 1.000, sin λ −0.0023, sin φ 0.783", cs1, [0.622, 1.000, -0.0023, 0.783], [5e-4, 5e-4, 5e-5, 5e-4])
    row("DM09", "LA cos φ 0.829, cos λ −0.473, sin λ −0.881, sin φ 0.560", cs2, [0.829, -0.473, -0.881, 0.560], 5e-4)
    row("DM09", "screen: 0.622 × 1.000 = 0.622; 0.622 × (−0.0023) = −0.0014 ≈ −0.001; 0.829 × (−0.473) = −0.392; 0.829 × (−0.881) = −0.730",
        [0.622 * 1.0, 0.622 * -0.0023, 0.829 * -0.473, 0.829 * -0.881], [0.622, -0.001, -0.392, -0.730], [1e-9, 5e-4, 5e-4, 5e-4])
    row("DM09", "screen vectors = exact to 3 d.p.", [*np.round(r1, 3), *np.round(r2, 3)], [0.622, -0.001, 0.783, -0.392, -0.730, 0.560], 1e-9)
    dot = float(r1 @ r2)
    pr = [0.622 * -0.392, -0.001 * -0.730, 0.783 * 0.560]
    row("DM10", "screen products −0.244, +0.001 (0.00073), 0.438; sum 0.195", [*pr, sum(pr)], [-0.244, 0.001, 0.438, 0.195], [5e-4, 3e-4, 5e-4, 5e-4])
    row("DM10", "r̂₁·r̂₂ = 0.1953 = cos σ; σ = 78.738° = 1.37424 rad; arccos 0.195 = 78.76° ('about seventy eight point seven')",
        [dot, np.cos(sig), np.degrees(sig), sig, np.degrees(np.arccos(0.195))], [0.1953, 0.1953, 78.738, 1.37424, 78.75], [5e-5, 5e-5, 5e-4, 5e-5, 0.02])
    row("DM10", "'almost a quarter of the way round': 78.7 / 360 = 22 % (less than 90°)", [np.degrees(sig) / 360, float(np.degrees(sig) < 90)], [0.22, 1], [0.005, 0])
    row("DM11", "d = a σ = 8755.3 km; screen 6371 × 1.3742 = 8755.0 ≈ 8755; 8755 / 900 = 9.73 ≈ 9.7 h ('nearly ten hours')",
        [dgc / 1e3, A_KM * sig, 6371 * 1.3742, 8755 / 900], [8755.3, 8755.3, 8755.0, 9.7], [0.05, 0.05, 0.05, 0.05])
    row("DM11", "78.738 × 111.195 = 8755.3 (the per-degree check with exact factors)", np.degrees(sig) * A_KM * deg, 8755.3, 0.05)
    row("DM11", "screen: 78.74 × 0.01745 = 1.3740 ≈ 1.374 (exact π/180: 1.3743); 78.74 × 111.2 = 8755.9 ≈ 8756", [78.74 * 0.01745, 78.74 * deg, 78.74 * 111.2],
        [1.3740, 1.3743, 8755.9], 6e-4 * np.array([1, 1, 200]))
    flag("DM11", "s10", "σ ≈ 78.74 × 0.01745 ≈ 1.3742 rad (screen and voice)", "1.3742", "78.74 × 0.01745 = 1.3740; 78.74 × π/180 = 1.3743; σ = 1.37424 rad",
         "the rounded factor 0.01745 gives 1.3740; '1.3742' is the exact σ. Screen keeps '≈ 1.3742' as voiced (rounding of the factor, not of σ)")
    flag("DM11", "s10", "78.74 × 111.2 km ≈ 8755 km (screen and voice)", "8755", "78.74 × 111.2 = 8755.9 (→ 8756); 78.738 × 111.195 = 8755.3",
         "with the rounded 111.2 the product rounds to 8756; with the exact per-degree length 111.195 it is 8755.3. 'about … eight thousand seven hundred and fifty five' kept")

    # ================================================================ s11 the route's shape
    brg0 = float(call(GS + "initial_bearing", "s11", "initial bearing London → LA (Snyder 5-4b)", lat1=LONDON[0], lon1=LONDON[1], lat2=LA[0], lon2=LA[1]))
    back = float(call(GS + "initial_bearing", "s11", "initial bearing LA → London (arrival = back + 180°)", lat1=LA[0], lon1=LA[1], lat2=LONDON[0], lon2=LONDON[1]))
    brg1 = (back + 180.0) % 360.0
    vx = call(GS + "great_circle_vertex", "s11", "Clairaut vertex", lat1=LONDON[0], lon1=LONDON[1], lat2=LA[0], lon2=LA[1])
    row("DM12", "bearing 311.8° ('about 312', north-west), vertex 62.37° N 48.96° W, arrival 214.0° (south-west); change 97.8° ('almost a hundred')",
        [brg0, vx[0], -vx[1], brg1, brg0 - brg1], [311.8, 62.37, 48.96, 214.0, 97.8], [0.05, 0.005, 0.005, 0.05, 0.1])
    truth("DM12", "vertex on the arc (on_arc) and = max latitude of the 181 points (±0.01°)", bool(vx[2]) and abs(gla.max() - vx[0]) < 0.01, [float(gla.max()), vx[0]])
    hd = np.asarray(call(GS + "initial_bearing", "s11", "heading at each route point = initial bearing towards LA", lat1=gla[:-1], lon1=glo[:-1], lat2=LA[0], lon2=LA[1]))
    head = np.concatenate([hd, [brg1]])
    truth("DM16", "heading falls monotonically 311.8° → 214.0° along the route (181 points)", bool(np.all(np.diff(head) < 0)) and abs(head[0] - brg0) < 1e-9, B1.r6(head[::18], 2))
    land = [p for _, ps in B1.shp_parts(B1.F_NE50L) for p in ps]
    gl = max((p for p in land if p[:, 1].mean() > 60 and -75 < p[:, 0].mean() < -10), key=len)     # Greenland (the biggest polygon there)
    dG = np.asarray(call(GS + "great_circle_distance", "s11", "vertex → Greenland's coast (NE 50 m land vertices)", lat1=vx[0], lon1=vx[1], lat2=gl[:, 1], lon2=gl[:, 0])) / 1e3
    row("DM12", "vertex 'near the south-west coast of Greenland': nearest Greenland coast point ≤ 100 km, south of 64° N, west of 45° W",
        [float(dG.min()) < 100, gl[np.argmin(dG), 1] < 64, gl[np.argmin(dG), 0] < -45], [1, 1, 1], 0)
    # "Then it turns south over northern Canada": the route points after the vertex that lie inside Canada (NE 10 m admin-0
    # polygons, point in polygon) — the route enters Canada right after Greenland and leaves it into the USA before LA
    from matplotlib.path import Path as MPath
    canada = [MPath(pp) for rec, ps in B1.shp_parts(B1.F_NE10A, want=lambda r: r.get("ADMIN") == "Canada") for pp in ps if len(pp) > 50]
    inC = np.array([any(cp.contains_point((lo, la)) for cp in canada) for la, lo in zip(gla, glo)])
    iv = int(np.argmax(gla))
    after = np.where(inC[iv:])[0] + iv
    truth("DM12", "after the vertex the route goes south over Canada: points in Canada (NE 10 m) come after the vertex, and the latitude falls all the way",
          after.size >= 20 and bool(np.all(np.diff(gla[iv:]) < 0)) and not inC[:iv].any(),
          {"points_in_canada": int(after.size), "lat_in": float(gla[after[0]]), "lon_in": float(glo[after[0]]), "lat_out": float(gla[after[-1]]), "lon_out": float(glo[after[-1]])})
    V["route"] = {"london": list(LONDON), "la": list(LA), "r1": B1.r6(r1), "r2": B1.r6(r2), "cs1": B1.r6(cs1), "cs2": B1.r6(cs2), "dot": dot,
                  "sig_deg": float(np.degrees(sig)), "sig_rad": sig, "d_km": dgc / 1e3, "brg0": brg0, "brg1": brg1, "vx": [float(vx[0]), float(vx[1])],
                  "gc": [B1.r6(gla, 4), B1.r6(glo, 4)], "head": B1.r6(head, 3)}

    # ================================================================ s12 the rhumb line
    rh = call(GS + "rhumb_line", "s12", "constant bearing α = atan2(Δλ, Δψ), s = a √(Δφ² + q²Δλ²)", lat1=LONDON[0], lon1=LONDON[1], lat2=LA[0], lon2=LA[1], n=181)
    rkm = rh.distance / 1e3
    row("DM13", "rhumb 9732.8 km, 258.49°, ratio 1.1116, extra 977.5 km (storyboard)", [rkm, rh.bearing, rkm / (dgc / 1e3), rkm - dgc / 1e3],
        [9732.8, 258.49, 1.1116, 977.5], [0.05, 0.005, 5e-5, 0.05])
    row("DM13", "screen: 9733 / 8755 = 1.111 ≈ 1.11 ('eleven percent'); 9733 − 8755 = 978; 978 / 900 = 1.09 ≈ 1.1 h ('more than an hour'); 258.5 = 11.5° south of west",
        [9733 / 8755, 9733 - 8755, 978 / 900, 270 - 258.5], [1.11, 978, 1.1, 11.5], [0.002, 0, 0.015, 0])
    gl_at = np.interp(np.asarray(rh.lon)[::-1], glo[::-1], gla[::-1])[::-1]
    truth("DM13", "the rhumb line stays further south than the great circle at every longitude between the cities",
          bool(np.all(np.asarray(rh.lat)[1:-1] < gl_at[1:-1] + 1e-9)), float(np.max(np.asarray(rh.lat)[1:-1] - gl_at[1:-1])))
    # the spiral (s12 inset): keep the bearing 258.49° beyond LA towards the South Pole: λ − λ_LA = tan α (ψ − ψ_LA)
    psi = np.asarray(call(GS + "isometric_latitude", "s12", "ψ = ln tan(π/4 + φ/2) along the spiral", lat=np.linspace(LA[0], -89.0, 900)))
    psiLA = float(call(GS + "isometric_latitude", "s12", "ψ at LA", lat=LA[0]))
    sla = np.linspace(LA[0], -89.0, 900)
    slo = LA[1] + np.degrees(np.tan(rh.bearing * D2R) * (psi - psiLA))
    pieces = [call(GS + "rhumb_line", "s12", "spiral piece bearing", lat1=float(sla[i]), lon1=float(slo[i]), lat2=float(sla[i + 30]), lon2=float(slo[i + 30]), n=2).bearing
              for i in range(0, 869, 30)]
    row("DM13", f"spiral: every piece keeps bearing 258.49° ({len(pieces)} pieces, rhumb_line); turns round the pole {abs(slo[-1] - slo[0]) / 360:.1f} times by 89° S",
        [np.max(np.abs(np.asarray(pieces) - rh.bearing)), float(abs(slo[-1] - slo[0]) / 360 > 3)], [0, 1], [1e-6, 0])
    keep = np.unique(np.concatenate([np.arange(0, 900, 3), [899]]))
    V["rhumb"] = {"lat": B1.r6(rh.lat, 4), "lon": B1.r6(rh.lon, 4), "km": rkm, "brg": rh.bearing, "ratio": rkm / (dgc / 1e3), "extra": rkm - dgc / 1e3,
                  "spiral": [B1.r6(sla[keep], 3), B1.r6(slo[keep], 3)]}

    # ================================================================ s13 Brest - Lisbon, rhumb-line legs
    bl_g = float(call(GS + "great_circle_distance", "s13", "Brest → Lisbon great circle", lat1=BREST[0], lon1=BREST[1], lat2=LISBON[0], lon2=LISBON[1])) / 1e3
    bl_r = call(GS + "rhumb_line", "s13", "Brest → Lisbon rhumb line", lat1=BREST[0], lon1=BREST[1], lat2=LISBON[0], lon2=LISBON[1], n=41)
    bgl, bgo = call(GS + "great_circle_points", "s13", "Brest → Lisbon great circle points", lat1=BREST[0], lon1=BREST[1], lat2=LISBON[0], lon2=LISBON[1], n=41)
    row("DM14", "Brest–Lisbon 1138.12 / 1138.27 km; rhumb + 0.149 km ('about a hundred and fifty metres'); 'about one thousand one hundred and thirty eight'",
        [bl_g, bl_r.distance / 1e3, bl_r.distance / 1e3 - bl_g, round(bl_g)], [1138.12, 1138.27, 0.149, 1138], [0.005, 0.005, 0.0015, 0])
    lla, llo = call(GS + "great_circle_points", "s13", "5 points on the great circle (4 legs)", lat1=LONDON[0], lon1=LONDON[1], lat2=LA[0], lon2=LA[1], n=5)
    legs, ltot = [], 0.0
    for i in range(4):
        lg = call(GS + "rhumb_line", "s13", f"rhumb leg {i + 1}", lat1=float(lla[i]), lon1=float(llo[i]), lat2=float(lla[i + 1]), lon2=float(llo[i + 1]), n=31)
        ltot += lg.distance / 1e3
        legs.append({"lat": B1.r6(lg.lat, 4), "lon": B1.r6(lg.lon, 4), "brg": lg.bearing})
    row("DM14", "4 rhumb legs between 5 great-circle points = 8830 km, +0.86 % on the great circle (storyboard)", [ltot, 100 * (ltot / (dgc / 1e3) - 1)], [8830, 0.86], [1.0, 0.01])
    V["bl"] = {"brest": list(BREST), "lisbon": list(LISBON), "gc_km": bl_g, "rh_km": bl_r.distance / 1e3, "extra_m": (bl_r.distance / 1e3 - bl_g) * 1e3,
               "gc": [B1.r6(bgl, 4), B1.r6(bgo, 4)], "rh": [B1.r6(bl_r.lat, 4), B1.r6(bl_r.lon, 4)]}
    V["legs"] = {"pts": [B1.r6(lla, 4), B1.r6(llo, 4)], "legs": legs, "km": ltot}

    # ================================================================ Mercator charts (s01, s11, s13, s14): a = 1, x = λ, y = ψ
    def merc(lat, lon, scene, what):
        x, y = call(GM + "forward", scene, f"Mercator x = a(λ − λ₀), y = a ln tan(π/4 + φ/2): {what}", name="mercator", lat=np.clip(np.asarray(lat, float), -85, 85), lon=np.asarray(lon, float), a=1.0)
        return np.asarray(x), np.asarray(y)
    mx_r, my_r = merc(rh.lat, rh.lon, "s01", "the rhumb line London → LA")
    mx_g, my_g = merc(gla, glo, "s01", "the great circle London → LA")
    A3 = np.stack([mx_r - mx_r[0], my_r - my_r[0]], -1)
    resid = np.abs(A3[:, 0] * A3[-1, 1] - A3[:, 1] * A3[-1, 0]).max()
    ang = np.degrees(np.arctan2(A3[-1, 0], A3[-1, 1])) % 360
    row("DM15", "on Mercator the rhumb line is straight (collinearity residual) and its angle from 'up' is the bearing 258.49°", [resid, ang], [0, rh.bearing], [1e-12, 1e-9])
    # NE 50 m land outlines south of 80° N, decimated to 0.35°, projected in ONE forward call and split back per polygon
    polys = [pp for pp in (B1.decimate(p, 0.35) for p in land if p[:, 1].max() >= -62.0 and len(p) >= 4) if len(pp) >= 4]
    allp = np.concatenate(polys)
    fx, fy = merc(allp[:, 1], allp[:, 0], "s01", "NE 50 m land outlines (all decimated vertices)")
    cut = np.cumsum([len(pp) for pp in polys])[:-1]
    mland = [np.round(np.stack([x, y], -1), 4).ravel().tolist() for x, y in zip(np.split(fx, cut), np.split(fy, cut))]
    row("DM15", "land outlines: Mercator x = λ (rad) for every vertex; y increases with latitude", [np.abs((fx - np.radians(allp[:, 0]) + np.pi) % (2 * np.pi) - np.pi).max(), float(np.all(np.diff(fy[np.argsort(allp[:, 1])]) >= -1e-12))],
        [0, 1], [1e-12, 0])
    lgx = [merc(np.asarray(L["lat"]), np.asarray(L["lon"]), "s13", f"rhumb leg {i + 1}") for i, L in enumerate(legs)]
    cx, cy = merc([LONDON[0], LA[0]], [LONDON[1], LA[1]], "s01", "London, Los Angeles")
    V["mc"] = {"land": mland, "rh": B1.r6(np.stack([mx_r, my_r], -1).ravel(), 4), "gc": B1.r6(np.stack([mx_g, my_g], -1).ravel(), 4),
               "legs": [B1.r6(np.stack([x, y], -1).ravel(), 4) for x, y in lgx], "cities": B1.r6(np.stack([cx, cy], -1).ravel(), 5)}
    V["lines"] = {"globe110": [np.round(np.asarray(ln, float), 2).tolist() for ln in json.loads(B1.F_NE110.read_text(encoding="utf-8"))["coastline"]]}

    # ================================================================ s14 recap = scene numbers
    row("DM17", "recap: 78.7° / 8755 km / 312° → 214° / +11 %", [round(np.degrees(sig), 1), round(dgc / 1e3), round(brg0), round(brg1), round(100 * (rkm / (dgc / 1e3) - 1))],
        [78.7, 8755, 312, 214, 11], 0)
    V["consts"] = {"a": EARTH_RADIUS}
    V["places"] = {"london": list(LONDON), "la": list(LA), "brest": list(BREST), "lisbon": list(LISBON), "lyb": list(LYB)}

    # ---------------------------------------------------------------------------------------------- report and write
    for r in rows:
        print(f"  {'PASS' if r['pass'] else 'FAIL'}  {r['id']:5s} {r['name']}  -> {r['value']}")
    for fl in flags:
        print(f"  FLAG  {fl['id']:5s} {fl['scene']} {fl['what']}: {fl['note']}")
    if not all(r["pass"] for r in rows):
        print("build_ch00_coordinates_routes: checks FAILED — no data written")
        return 1

    def clean(o):
        if isinstance(o, dict):
            return {k: clean(v) for k, v in o.items()}
        if isinstance(o, (list, tuple)):
            return [clean(v) for v in o]
        if isinstance(o, (float, np.floating)):
            return None if not np.isfinite(o) else float(o)
        if isinstance(o, (bool, np.bool_)):
            return bool(o)
        if isinstance(o, np.integer):
            return int(o)
        if isinstance(o, np.ndarray):
            return clean(o.tolist())
        return o
    V = clean(V)
    blob = json.dumps(V, separators=(",", ":"), ensure_ascii=False, allow_nan=False).encode("utf-8")
    (DATA / "rt.json").write_bytes(blob)
    data_hashes = {"rt.json": hashlib.sha256(blob).hexdigest()}
    render = {}
    for pub in a.public:
        pub.mkdir(parents=True, exist_ok=True)
        Image.open(B1.F_BMNG).convert("RGB").resize((4096, 2048), Image.LANCZOS).save(pub / "rt_bmng.jpg", quality=88)
        render = {pp.name: B1.sha_file(pp) for pp in sorted(pub.glob("rt_*"))}
    inputs = {str(pq.relative_to(ROOT)).replace("\\", "/") if ROOT in pq.parents else str(pq): B1.sha_file(pq) for pq in [B1.F_NE50L, B1.F_NE110, B1.F_BMNG]}
    manifest = {
        "id": "ch00_coordinates_routes", "title": TITLE, "storyboard": "movies/ch00/ch00_coordinates_routes/storyboard.yaml",
        "builder": "movies/data/build_ch00_coordinates_routes.py",
        "fluidpy": {"repo": "../Fluid Dynamics", **B1.git_sha(FLUID, {"sphere_py": "fluidpy/geo/sphere.py", "mapproj_py": "fluidpy/geo/mapproj.py",
                                                                     "curvilinear_py": "fluidpy/core/curvilinear.py", "constants_py": "fluidpy/geo/constants.py"})},
        "equations_note": "provenance only (QA/reviewer); the movie draws no equation labels or numbers (HOUSE_STYLE §5)",
        "equations": {"r̂ = (cos φ cos λ, cos φ sin λ, sin φ)": "Vallis §2.2.2 geometry (Fig. 2.3; Part 3)",
                      "h_θ = r, h_φ = a, h_λ = a cos φ": "Vallis §2.2.2, text before (2.27): (δx, δy, δz) = (r cos ϑ δλ, r δϑ, δr)",
                      "d = a σ": "arc rule (Part 1); fluidpy.geo.sphere.great_circle_distance (Snyder 1987 5-3a)",
                      "cos σ = r̂₁ · r̂₂": "dot product of unit vectors; fluidpy.geo.sphere.central_angle (Snyder 1987 5-3)",
                      "initial bearing": "Snyder 1987 (5-4b)", "rhumb line": "Snyder 1987 (7-2), isometric latitude ψ"},
        "parameters": {"places": {"London": list(LONDON), "Los Angeles": list(LA), "Brest": list(BREST), "Lisbon": list(LISBON), "Longyearbyen": list(LYB),
                                  "note": "city centres, not airports (build 1's LHR/LAX gave 8761 km)"},
                       "small_circle_tilts_deg": list(TILTS), "cruise_kmh": 900, "great_circle_plane_normal": {"lat": nlat, "lon": nlon},
                       "spiral": "bearing 258.49° kept beyond LA to 89° S (λ − λ_LA = tan α (ψ − ψ_LA)); every 30-sample piece re-checked with rhumb_line",
                       "legs": "4 rhumb-line legs between 5 equally spaced great-circle points",
                       "mercator": "a = 1, λ₀ = 0, latitudes clipped to ±85°; NE 50 m land decimated to 0.35° (outline only)",
                       "time_compression": {"s00/s11/s13": "a ≈ 10-h flight drawn in a few seconds (plane glyph)"},
                       "exaggerations": ["s03 1-degree wedges magnified ×10", "s04 1-degree steps magnified (10°) on the half-Earth", "s06 disc and string are drawing aids",
                                         "s12 spiral inset extends the line beyond the route (illustrative)", "compass dials and plane glyphs are icons"],
                       "true_bearings": "compass bearings are true bearings; magnetic variation ignored (not said)"},
        "credits": ["NASA Blue Marble Next Generation (NASA Earth Observatory).", "Made with Natural Earth.",
                    "Music: tools/sound (procedural synthesis, our own code, CC0-1.0)."],
        "js_selftest": "none — every number is read from data/rt.json (TSX CHECK rows re-assert the screen strings; the kit's ll() = unit_vector to 1e-6)",
        **chapters(), "inputs_sha256": inputs, "render_assets": render, "data_files": data_hashes, "checks": rows, "flags": flags,
        "physics": [e for e in entries if e.get("sha256")], "physics_recorded": [e for e in entries if not e.get("sha256")],
    }
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=1, ensure_ascii=False, default=str), encoding="utf-8")
    print(f"build_ch00_coordinates_routes: rt.json {len(blob) / 1e3:.0f} kB; {len(entries)} parity entries, {len(rows)} checks "
          f"({sum(r['pass'] for r in rows)} pass), {len(flags)} flags -> {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
