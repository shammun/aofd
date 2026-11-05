"""Physics and real-data products for the Chapter-0 movie #5d "Coordinates, Part 4 — Turning frames: local axes and how
they turn" (movies/ch00/ch00_coordinates_frames/storyboard.yaml, 30 scenes; CHECK rows DP02-DP28, build-1 rows DC23-DC25 and
DC42 kept under their storyboard names DP07 / DP12 / DP14).

Run with the main venv::

    .venv/Scripts/python.exe movies/data/build_ch00_coordinates_frames.py [--public <render public dir> ...]

Every number the movie shows or says is computed here by the tested functions named in the storyboard's ``physics_source``
fields (no download; files already on disk):

* ``fluidpy.geo.sphere`` (enu_basis, unit_vector, central_angle, great_circle_distance, arc_lengths, initial_bearing),
* ``fluidpy.geo.frames`` (unit_vector_rates, metric_terms, coriolis_parameter, great_circle),
* ``fluidpy.geo.vectors`` (dot, cross, components_in_axes), ``fluidpy.core.tensors.rotation_matrix_2d``,
  ``fluidpy.core.coords.unit_vectors_polar``, ``fluidpy.geo.atmos.wind_direction_from``,
* ``fluidpy.diag.cyclone.storm_centre`` (HRRR's own calm centre at 20 UTC, data report §1c) and
  ``fluidpy.diag.trajectories.advect_on_sphere`` (streaklines through the frozen 20 UTC field),
* ``fluidpy.data.ibtracs.storm_table`` (Amphan, NI basin, sid 2020136N10088).

Inputs: HRRR Ian analysis (G: derived), IBTrACS NI, Natural Earth 10 m coast / boundaries / places, NE 110 m globe lines,
NASA Blue Marble NG (the globe texture). Fluidpy calls that take a distance and a radius get SI metres (default a = 6.371e6 m).

Writes movies/ch00/ch00_coordinates_frames/data/fr.json (numbers and small arrays the composition only indexes and
interpolates; ``say`` = the spoken / written rounded values, each asserted here), data/img/*.png and manifest.json (function,
provenance, parameters, fluidpy git SHA, sha256 of inputs and data files, parity hashes, chapter marks + maths-skip targets from
timing.json). All CHECK rows must pass before anything is written (exit 1 otherwise). ``flags`` lists screen/voice roundings
that a hand check finds inconsistent (reported to the director; not CHECK failures because the storyboard voice is fixed).
"""
from __future__ import annotations

import argparse
import hashlib
import importlib
import json
import sys
import zipfile
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
FLUID = ROOT.parent / "Fluid Dynamics"
OUT = ROOT / "movies" / "ch00" / "ch00_coordinates_frames"
DATA = OUT / "data"
IMG = DATA / "img"
RAW = Path("G:/Geophysical Fluid Dynamics/aofd-data/raw")
F_IBT_NI = RAW / "IBTrACS-v04r01" / "IBTrACS.NI.v04r01.nc"
F_NE10B = RAW / "NE-10m-admin" / "ne_10m_admin_0_boundary_lines_land.zip"
F_NE10P = RAW / "NE-10m-places" / "ne_10m_populated_places_simple.zip"
sys.path.insert(0, str(FLUID))
sys.path.insert(0, str(Path(__file__).resolve().parent))
import build_ch00_coordinates as B1  # noqa: E402  (shared helpers: parity_hash, r6, sha_file, git_sha, lut_rgb, lut_hex, rgba_png, shp_parts, box_lines)
import xarray as xr  # noqa: E402

D2R = np.pi / 180.0
TITLE = "Coordinates, Part 4 — Turning frames: local axes and how they turn"
BREST, TRAPPES, SINGAPORE = (48.39, -4.49), (48.77, 2.01), (1.35, 103.82)
KHULNA, KHULNA_NE = (22.8, 89.6), (22.8419, 89.5581)
FMB = (26.45, -81.95)
AMPHAN = "2020136N10088"
GS, GF, GV, TN, CS, DC, DT_ = ("fluidpy.geo.sphere.", "fluidpy.geo.frames.", "fluidpy.geo.vectors.", "fluidpy.core.tensors.", "fluidpy.core.coords.",
                               "fluidpy.diag.cyclone.", "fluidpy.diag.trajectories.")
COAST_BOX = (25.2, 28.0, -83.6, -80.9)        # s10-s14 SW Florida maps
BOB_BOX = (17.0, 27.5, 83.0, 95.5)            # s09 Bay of Bengal zoom

CHAPTERS = [("s00_title", "Title"), ("s01_hook", "Local frames: the question"), ("s02_part3_recap", "Recap of Part 3"),
            ("s03_enu", "The local east-north-up frame"), ("s04_k_up", "Every step: up, east and north as numbers"),
            ("s08_other_stations", "Every place has its own frame"), ("s09_khulna", "Khulna"), ("s10_coast_frame", "A frame turned to a coast"),
            ("s11_coast_points", "Every step: the coast's bearing, 329 degrees"), ("s14_along_across", "Ian's wind along and across the coast"),
            ("s15_arrows_turn", "The arrows turn as you move"), ("s16_toolkit", "Every step: how fast the arrows turn"),
            ("s23_whole_vector", "Every step: Newton's law and the metric terms"), ("s26_glider", "What metric terms mean"),
            ("s27_metric_size", "How big they are"), ("s28_recap", "Recap"), ("s29_end", "End")]
# (block, scene of the skip line, scene of the "If you skipped" line) — storyboard skip_guidance.chapter_marks
SKIPS = [("A", "s04_k_up", "s07_enu_checks"), ("B", "s16_toolkit", "s22_add_motions"), ("C", "s23_whole_vector", "s25_dot_i_b")]


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


def places_ne(names: list[str]) -> dict:
    """lat/lon of Natural Earth 10 m populated places by name (point shapefile, pyshp)."""
    import shapefile
    out = {}
    with zipfile.ZipFile(F_NE10P) as z:
        base = [n for n in z.namelist() if n.endswith(".shp")][0][:-4]
        r = shapefile.Reader(shp=z.open(base + ".shp"), shx=z.open(base + ".shx"), dbf=z.open(base + ".dbf"), encoding="utf-8")
        flds = [f[0] for f in r.fields[1:]]
        for sr in r.iterShapeRecords():
            rec = dict(zip(flds, sr.record))
            nm = rec.get("name") or rec.get("NAME")
            if nm in names and nm not in out:
                out[nm] = [float(sr.shape.points[0][1]), float(sr.shape.points[0][0])]
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--public", type=Path, nargs="*", default=[], help="render public dir(s) for the fr_* assets")
    a = ap.parse_args()
    from PIL import Image
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
            heavy.append({"fn": fn, "scene": scene, "eq": eq, "params": {k: (v if isinstance(v, (int, float, str, type(None), tuple, list))
                          else f"array {np.shape(v)}, sha256 {B1.parity_hash(v)}") for k, v in params.items()},
                          "output_sha256": B1.parity_hash(out) if not hasattr(out, "_fields") and not hasattr(out, "__dataclass_fields__") else B1.parity_hash(str(out))})
            return out
        jp = {k: (np.asarray(v).tolist() if isinstance(v, np.ndarray) else v) for k, v in params.items()}
        try:
            h = B1.parity_hash(out)
        except Exception:
            h = None
        entries.append({"fn": fn, "scene": scene, "data": "data/fr.json", "eq": eq, "params": jp, "sha256": h})
        return out

    from fluidpy.geo.constants import EARTH_RADIUS, OMEGA
    A_KM = EARTH_RADIUS / 1e3
    row("DP02", "a = 6371 km (fluidpy.geo.constants.EARTH_RADIUS, metres)", A_KM, 6371.0, 1e-9)

    # ================================================================ s02 recap of Part 3 (Brest)
    rB = np.asarray(call(GS + "unit_vector", "s02", "r̂ = (cos φ cos λ, cos φ sin λ, sin φ)", lat=BREST[0], lon=BREST[1]))
    AL = call(GS + "arc_lengths", "s02", "δy = a δφ, δx = a cos φ δλ (1°)", lat=BREST[0], dlat=1.0, dlon=1.0)
    row("DP02", "1° north = 111.2 km ('about 111'); 1° east at Brest = 73.8 km ('about 74')", [float(AL.dy) / 1e3, float(AL.dx) / 1e3], [111.19, 73.84], 0.01)
    row("DP02", "height a sin φ = 4764 km, distance from the axis a cos φ = 4230 km (Part 3)", [A_KM * np.sin(BREST[0] * D2R), A_KM * np.cos(BREST[0] * D2R)], [4763.5, 4230.5], 0.5)
    rB3 = np.asarray(call(GS + "unit_vector", "s02", "Part 3 README point 48.4 N, 4.5 W (its rounded coordinates)", lat=48.4, lon=-4.5))
    row("DP02", "Part 3 README: Brest (48.4 N, 4.5 W) a r̂ = (4217, −332, 4764) km; 4230 km from the axis; 73.8 / 111.2 km per degree (Part 4's 48.39/−4.49 give the same 3-decimal unit arrows)",
        [*(A_KM * rB3), A_KM * np.hypot(rB[0], rB[1]), float(AL.dx) / 1e3, float(AL.dy) / 1e3],
        [4217, -332, 4764, 4230, 73.8, 111.2], [0.5, 0.5, 0.5, 1.0, 0.05, 0.05])

    # ================================================================ s03-s07 Brest's local frame
    eB = call(GS + "enu_basis", "s03", "(i, j, k) east, north, up in the Earth's axes", lat=BREST[0], lon=BREST[1])
    eB3 = [np.round(np.asarray(x), 3) for x in call(GS + "enu_basis", "s03", "Part 3's rounded Brest 48.4 N, 4.5 W", lat=48.4, lon=-4.5)]
    row("DP04", "3-decimal i, j, k identical for (48.39, −4.49) and Part 3's (48.4, −4.5)", [*np.ravel(eB3)], [*np.round(np.ravel([np.asarray(x) for x in eB]), 3)], 0)
    iB, jB, kB = (np.asarray(x, float) for x in eB)
    cp, sp, cl, sl = np.cos(BREST[0] * D2R), np.sin(BREST[0] * D2R), np.cos(BREST[1] * D2R), np.sin(BREST[1] * D2R)
    row("DP04", "cos φ 0.664, sin φ 0.748, cos λ 0.997, sin λ −0.078 (Brest 48.39 N, 4.49 W)", [cp, sp, cl, sl], [0.664, 0.748, 0.997, -0.078], 5e-4)
    row("DP04", "k_Brest = r̂ = (0.6620, −0.0520, 0.7477) to 1e-4 (storyboard)", kB, [0.6620, -0.0520, 0.7477], 1e-4)
    row("DP04", "k = unit_vector (up = the position arrow / a)", kB - rB, [0, 0, 0], 1e-15)
    row("DP04", "screen: 0.664 × 0.997 = 0.662; 0.664 × (−0.078) = −0.052; third 0.748", [0.664 * 0.997, 0.664 * -0.078, 0.748], [0.662, -0.052, 0.748], 6e-4)
    row("DP04", "|k|² = 0.662² + 0.052² + 0.748² ≈ 1 (screen numbers, ±0.002)", 0.662 ** 2 + 0.052 ** 2 + 0.748 ** 2, 1.0, 2e-3)
    C90 = np.asarray(call(TN + "rotation_matrix_2d", "s05", "C(π/2): (p, q) → (−q, p), the 90° turn of Part 1", theta=np.pi / 2))
    Rh = np.array([cl, sl])
    row("DP05", "i_Brest = (0.0783, 0.9969, 0) to 1e-4 (storyboard)", iB, [0.0783, 0.9969, 0.0], 1e-4)
    row("DP05", "i = R̂ = (cos λ, sin λ) turned +90° (rotation_matrix_2d(π/2) @ R̂), third part 0", [*(C90 @ Rh), iB[2]], [iB[0], iB[1], 0.0], 1e-12)
    row("DP05", "screen: −(−0.078) = 0.078, 0.997", [-(-0.078), 0.997], [round(iB[0], 3), round(iB[1], 3)], 1e-12)
    row("DP06", "j_Brest = (−0.7454, 0.0585, 0.6641) to 1e-4 (storyboard)", jB, [-0.7454, 0.0585, 0.6641], 1e-4)
    # j from the slice rule: j = −sin φ R̂ + cos φ ẑ, k = cos φ R̂ + sin φ ẑ (R̂ = (cos λ, sin λ, 0))
    R3, Z3 = np.array([cl, sl, 0.0]), np.array([0.0, 0.0, 1.0])
    pq = C90 @ np.array([cp, sp])           # (cos φ, sin φ) turned +90° in the (R̂, ẑ) slice
    row("DP06", "slice: k = cos φ R̂ + sin φ ẑ; j = (−sin φ) R̂ + (cos φ) ẑ from the 90° rule", [*(cp * R3 + sp * Z3 - kB), *(pq[0] * R3 + pq[1] * Z3 - jB)], [0] * 6, 1e-12)
    row("DP06", "screen (3-decimal factors): 0.748 × 0.997 = 0.746 vs −0.745 shown; 0.748 × 0.078 = 0.058 vs 0.059 shown (last-digit rounding)",
        [0.748 * 0.997, 0.748 * 0.078], [0.745, 0.059], 1.2e-3)
    # s07 checks
    dij = float(call(GV + "dot", "s07", "i·j", a=iB, b=jB))
    cij = np.asarray(call(GV + "cross", "s07", "i × j", a=iB, b=jB))
    row("DP07", "|i|² = 1, i·j = 0, i × j = k at Brest (right-handed) — build-1 DC23 kept", [float(iB @ iB), dij, *(cij - kB)], [1, 0, 0, 0, 0], 1e-12)
    row("DP07", "screen: 0.078² + 0.997² = 1.0001 ≈ 1", 0.078 ** 2 + 0.997 ** 2, 1.0, 2e-4)
    row("DP07", "screen: 0.078 × (−0.745) = −0.058; 0.997 × 0.059 = 0.059; sum ≈ 0", [0.078 * -0.745, 0.997 * 0.059, 0.078 * -0.745 + 0.997 * 0.059], [-0.058, 0.059, 0.0], 1e-3)
    xs = [0.997 * 0.664 - 0, 0 - 0.078 * 0.664, 0.078 * 0.059 - 0.997 * -0.745]
    row("DP07", "screen cross recipe with 3-decimal parts: (0.662, −0.052, 0.747) ≈ (0.662, −0.052, 0.748)", xs, [0.662, -0.052, 0.748], 1.2e-3)
    flag("DP07", "s07", "i × j third part", "0.748 (voice and screen)", "0.078×0.059 + 0.997×0.745 = 0.7474", "with the rounded parts it is 0.747; the exact cross product is 0.7477 (k). '≈' kept")
    V["brest"] = {"ll": list(BREST), "i": B1.r6(iB), "j": B1.r6(jB), "k": B1.r6(kB), "cs": B1.r6([cp, sp, cl, sl])}

    # ================================================================ s08 Trappes, Singapore
    eT = call(GS + "enu_basis", "s08", "Trappes frame", lat=TRAPPES[0], lon=TRAPPES[1])
    eS = call(GS + "enu_basis", "s08", "Singapore frame", lat=SINGAPORE[0], lon=SINGAPORE[1])
    kT, kS = np.asarray(eT[2]), np.asarray(eS[2])
    sBT = float(call(GS + "central_angle", "s08", "σ = angle at the centre", lat1=BREST[0], lon1=BREST[1], lat2=TRAPPES[0], lon2=TRAPPES[1]))
    dBT = float(call(GS + "great_circle_distance", "s08", "s = a σ (a in metres)", lat1=BREST[0], lon1=BREST[1], lat2=TRAPPES[0], lon2=TRAPPES[1]))
    angBT = np.degrees(np.arccos(np.clip(kB @ kT, -1, 1)))
    row("DP08", "Brest → Trappes 480 km; σ = 0.0753 rad = 4.32°; angle between the ups = σ (DC23)", [dBT / 1e3, sBT, np.degrees(sBT), angBT], [480, 0.0753, 4.32, 4.32], [0.5, 1e-4, 0.01, 0.01])
    row("DP08", "screen: 480 / 6371 = 0.0753 ≈ 0.075 rad ≈ 4.3°", [480 / 6371, np.degrees(480 / 6371)], [0.075, 4.3], [5e-4, 0.05])
    row("DP08", "k_S = (−0.239, 0.971, 0.024) (Singapore 1.35 N, 103.82 E)", kS, [-0.239, 0.971, 0.024], 5e-4)
    pr = [0.662 * -0.239, -0.052 * 0.971, 0.748 * 0.024]
    row("DP08", "screen products −0.158, −0.050, +0.018; sum −0.191", [*pr, sum(pr)], [-0.158, -0.050, 0.018, -0.191], 6e-4)
    angBS = np.degrees(np.arccos(np.clip(kB @ kS, -1, 1)))
    row("DP08", "k_B·k_S = −0.191 → 101.0° ('a hundred and one'); DC23", [float(kB @ kS), angBS, np.degrees(np.arccos(-0.191))], [-0.191, 101.0, 101.0], [5e-4, 0.1, 0.1])
    V["trappes"] = {"ll": list(TRAPPES), "k": B1.r6(kT), "dkm": dBT / 1e3, "sig": sBT, "deg": angBT}
    V["sing"] = {"ll": list(SINGAPORE), "k": B1.r6(kS), "dot": float(kB @ kS), "deg": angBS}

    # ================================================================ s09 Khulna + Amphan
    eK = call(GS + "enu_basis", "s09", "Khulna frame (22.8 N, 89.6 E)", lat=KHULNA[0], lon=KHULNA[1])
    iK, kK = np.asarray(eK[0]), np.asarray(eK[2])
    kKn = np.asarray(call(GS + "unit_vector", "s09", "Khulna (Natural Earth 22.8419, 89.5581)", lat=KHULNA_NE[0], lon=KHULNA_NE[1]))
    angBK, angBKn = np.degrees(np.arccos(kB @ kK)), np.degrees(np.arccos(kB @ kKn))
    row("DP09", "k_K = (0.006, 0.922, 0.388); screen 0.922 × 0.007 = 0.006, 0.922 × 1.000 = 0.922", [*kK, 0.922 * 0.007, 0.922 * 1.0], [0.006, 0.922, 0.388, 0.006, 0.922], 6e-4)
    pK = [0.662 * 0.006, -0.052 * 0.922, 0.748 * 0.388]
    row("DP09", "screen products 0.004, −0.048, 0.290; sum 0.246", [*pK, sum(pK)], [0.004, -0.048, 0.290, 0.246], 6e-4)
    row("DP09", "angle(k_B, k_K) 75.76° → 75.8° (22.8 N, 89.6 E as Part 3's README; screen and voice 75.8); NE point 75.7° (record); arccos 0.246 = 75.76°",
        [angBK, round(angBK, 1), angBKn, np.degrees(np.arccos(0.246))], [75.76, 75.8, 75.7, 75.76], [0.01, 1e-9, 0.05, 0.01])
    row("DP09", "i_K = (−1.000, 0.007, 0); i_B·i_K = −0.071 → 94.1° ('about 94')", [*iK, float(iB @ iK), np.degrees(np.arccos(iB @ iK))], [-1.0, 0.007, 0.0, -0.071, 94.1], [5e-4, 5e-4, 1e-12, 5e-4, 0.05])
    st = call("fluidpy.data.ibtracs.storm_table", "s09", "IBTrACS v04r01 NI, Amphan", heavy_call=True, path=str(F_IBT_NI), sid=AMPHAN, agencies=("usa", "newdelhi"))
    tt = np.array([np.datetime64(t.replace(" ", "T")) for t in st["time"]])
    la_, lo_ = np.array(st["lat"], float), np.array(st["lon"], float)
    sel = (tt >= np.datetime64("2020-05-18T00:00")) & (tt <= np.datetime64("2020-05-21T06:00"))
    th = ((tt - np.datetime64("2020-05-20T00:00")) / np.timedelta64(1, "h")).astype(float)
    hf = np.arange(th[sel][0], th[sel][-1] + 1e-9, 1 / 6)
    laf, lof = np.interp(hf, th, la_), np.interp(hf, th, lo_)
    dK = np.asarray(call(GS + "great_circle_distance", "s09", "Amphan centre (10-min linear interpolation) → Khulna (NE point)", heavy_call=True,
                         lat1=laf, lon1=lof, lat2=KHULNA_NE[0], lon2=KHULNA_NE[1])) / 1e3
    jm = int(np.argmin(dK))
    row("DP09", "Amphan's closest approach to Khulna 79.4 km → 'about seventy nine' (Part 2 s21: 79.36 km; audit D1), centre WEST of Khulna",
        [dK[jm], round(float(dK[jm])), float(lof[jm] < KHULNA_NE[1])], [79.37, 79, 1.0], [0.05, 0, 0])
    tmin = np.datetime64("2020-05-20T00:00") + np.timedelta64(int(round(hf[jm] * 60)), "m")
    truth("DP09", "closest approach on 20 May 2020, about 16 UTC (data report: ~15:50)", str(tmin).startswith("2020-05-20T15") or str(tmin).startswith("2020-05-20T16"), str(tmin))
    pl = places_ne(["Kolkata", "Khulna", "Dhaka"])
    truth("DP09", "Natural Earth places: Khulna, Kolkata found", "Kolkata" in pl and "Khulna" in pl, pl)
    V["khulna"] = {"ll": list(KHULNA), "ll_ne": list(KHULNA_NE), "i": B1.r6(iK), "k": B1.r6(kK), "deg": angBK, "deg_ne": angBKn, "iideg": float(np.degrees(np.arccos(iB @ iK))),
                   "kolkata": pl.get("Kolkata"), "amphan": {"time": [str(x) for x in tt[sel]], "lat": B1.r6(la_[sel], 2), "lon": B1.r6(lo_[sel], 2),
                                                            "closest_km": float(dK[jm]), "closest_at": [float(laf[jm]), float(lof[jm])], "closest_utc": str(tmin)}}
    # Bay of Bengal lines (NE 10 m coast + land boundaries), for the zoomed globe
    bob_c = B1.box_lines([p for _, ps in B1.shp_parts(B1.F_NE10C) for p in ps], BOB_BOX, nd=3)
    bob_b = B1.box_lines([p for _, ps in B1.shp_parts(F_NE10B) for p in ps], BOB_BOX, nd=3)
    V["lines"] = {"bob_coast": bob_c, "bob_border": bob_b,
                  "globe110": [np.round(np.asarray(ln, float), 2).tolist() for ln in json.loads(B1.F_NE110.read_text(encoding="utf-8"))["coastline"]]}

    # ================================================================ s10-s13 the coast frame (NE 10 m points near Naples and Venice)
    coast = [p for _, ps in B1.shp_parts(B1.F_NE10C) for p in ps]
    allc = np.concatenate(coast)

    def near(lat, lon):
        d = (allc[:, 1] - lat) ** 2 + ((allc[:, 0] - lon) * np.cos(lat * D2R)) ** 2
        return allc[np.argmin(d)]
    pN, pV = near(26.10, -81.80), near(26.93, -82.36)      # the build-1 manifest coast_segment points pN, pV
    A_, B_ = (float(pN[1]), float(pN[0])), (float(pV[1]), float(pV[0]))
    row("DP11", "coast points A = (26.099, −81.801), B = (26.922, −82.354) (build-1 pN, pV; NE 10 m)", [*A_, *B_], [26.099, -81.801, 26.922, -82.354], 6e-4)
    row("DP11", "screen: A 26.10 N 81.80 W, B 26.92 N 82.35 W", [round(A_[0], 2), round(-A_[1], 2), round(B_[0], 2), round(-B_[1], 2)], [26.10, 81.80, 26.92, 82.35], 1e-9)
    dphi, dlam = B_[0] - A_[0], B_[1] - A_[1]
    phim = 0.5 * (A_[0] + B_[0])
    ALc = call(GS + "arc_lengths", "s11", "δy = a δφ, δx = a cos φ_mid δλ (a in metres)", lat=phim, dlat=dphi, dlon=dlam)
    dy, dx = float(ALc.dy) / 1e3, float(ALc.dx) / 1e3
    row("DP11", "Δφ = +0.823°, Δλ = −0.553° (data 0.8235, −0.5527); in rad 0.0144 (0.823° = 0.01436), −0.00965", [dphi, dlam, dphi * D2R, 0.823 * D2R, dlam * D2R],
        [0.823, -0.553, 0.0144, 0.01436, -0.00965], [6e-4, 6e-4, 5e-5, 5e-6, 1e-5])
    row("DP11", "dy 91.51 km, dx −55.03 km (± 0.1), φ_mid 26.51°, cos 0.895", [dy, dx, phim, np.cos(phim * D2R)], [91.51, -55.03, 26.51, 0.895], [0.1, 0.1, 0.01, 5e-4])
    row("DP11", "screen: 6371 × 0.895 × (−0.00965) = −55.0", 6371 * 0.895 * -0.00965, -55.0, 0.05)
    row("DP11", "screen Δy: 6371 × 0.01436 = 91.5 (the 4-figure radians; see flags)", 6371 * 0.01436, 91.5, 0.05)
    tanb = abs(dx) / dy
    beta = np.degrees(np.arctan(tanb))
    brg = float(call(GS + "initial_bearing", "s12", "initial bearing A → B on the sphere (DC42)", lat1=A_[0], lon1=A_[1], lat2=B_[0], lon2=B_[1]))
    row("DP12", "tan β = 55.0 / 91.5 = 0.601; β = 31.0°; flat bearing 329.0°", [tanb, 55.0 / 91.5, beta, 360 - beta], [0.601, 0.601, 31.0, 329.0], [6e-4, 6e-4, 0.05, 0.05])
    row("DP12", "sphere bearing 329.1° (build-1 DC42 329.13° ± 0.05)", brg, 329.1, 0.05)
    C121 = np.asarray(call(TN + "rotation_matrix_2d", "s13", "C(α): columns x̂′ = (cos α, sin α), ŷ′ = (−sin α, cos α)", theta=np.deg2rad(121.0)))
    row("DP13", "α = 90 − 329 = −239 ≡ 121°; x̂′ = (−0.515, 0.857), ŷ′ = (−0.857, −0.515)", [90 - 329, 90 - 329 + 360, *C121[:, 0], *C121[:, 1]],
        [-239, 121, -0.515, 0.857, -0.857, -0.515], [0, 0, 5e-4, 5e-4, 5e-4, 5e-4])
    row("DP13", "check: 121° = 90° + 31°", 90 + 31, 121, 0)
    V["coast"] = {"A": [*A_], "B": [*B_], "dphi": dphi, "dlam": dlam, "phim": phim, "dy": dy, "dx": dx, "tanb": tanb, "beta": beta, "brg": brg, "alpha": 121.0,
                  "xp": B1.r6(C121[:, 0], 4), "yp": B1.r6(C121[:, 1], 4),
                  "lines": B1.box_lines(coast, (COAST_BOX[0] - 0.4, COAST_BOX[1] + 0.4, COAST_BOX[2] - 0.4, COAST_BOX[3] + 0.4), nd=3)}

    # ================================================================ s14 Ian's wind at Fort Myers Beach, HRRR 20 UTC
    H = xr.open_dataset(B1.F_HRRR)
    times = json.loads(H.attrs["times"])
    k20 = times.index("2022-09-28T20")
    LA2, LO2 = H.lat.values.astype(float), H.lon.values.astype(float)
    u20, v20 = H.u10.values[k20].astype(float), H.v10.values[k20].astype(float)
    d = (LA2 - FMB[0]) ** 2 + ((LO2 - FMB[1]) * np.cos(FMB[0] * D2R)) ** 2
    jj = np.unravel_index(np.argmin(d), d.shape)
    uF = [float(u20[jj]), float(v20[jj])]
    row("DP14", "nearest HRRR 3-km point to Fort Myers Beach, 20 UTC: u 22.232, v 24.293 m/s (storyboard params)", uF, [22.232, 24.293], 5e-4)
    spF = float(np.hypot(*uF))
    dirF = float(call("fluidpy.geo.atmos.wind_direction_from", "s14", "direction the wind blows from", u=uF[0], v=uF[1]))
    alF, acF = call(GV + "components_in_axes", "s14", "along = v·x̂′, across = v·ŷ′ (bearing 329°)", u=uF, bearing_deg=329.0)
    row("DP14", "32.9 m/s ('about 33') from 222° (south-west); along 9.4, across −31.6 — build-1 DC42", [spF, dirF, float(alF), float(acF)], [32.9, 222.0, 9.4, -31.6], [0.05, 1.0, 0.05, 0.05])
    row("DP14", "components_in_axes along/across axes = x̂′, ŷ′ of α = 121° (same arrows)", [float(alF) - float(np.array(uF) @ C121[:, 0]), float(acF) - float(np.array(uF) @ C121[:, 1])], [0, 0], 2e-3)
    row("DP14", "screen: 22.2 × (−0.515) = −11.4; 24.3 × 0.857 = 20.8; sum 9.4", [22.2 * -0.515, 24.3 * 0.857, 22.2 * -0.515 + 24.3 * 0.857], [-11.4, 20.8, 9.4], 0.05)
    row("DP14", "screen: 22.2 × (−0.857) = −19.0; 24.3 × (−0.515) = −12.5; sum −31.5 ('thirty one and a half', 'roughly 32')",
        [22.2 * -0.857, 24.3 * -0.515, 22.2 * -0.857 + 24.3 * -0.515], [-19.0, -12.5, -31.5], 0.05)
    row("DP14", "audit D4: 2-dp products 22.2 × (−0.857) = −19.03, 24.3 × (−0.515) = −12.51; sum −31.54 ≈ −31.5; data −31.57 within 0.05 of −31.54",
        [round(22.2 * -0.857, 2), round(24.3 * -0.515, 2), round(22.2 * -0.857, 2) + round(24.3 * -0.515, 2), float(acF)], [-19.03, -12.51, -31.54, -31.54], [0, 0, 1e-9, 0.05])
    truth("DP14", "audit D4: −31.54 rounds to −31.5 (screen and voice use 31.5 everywhere)", round(-31.54, 1) == -31.5)
    row("DP14", "audit D4 check: 9.4² ≈ 88, 31.5² ≈ 992, 88 + 992 = 1080, √1080 = 32.9 ≈ 33", [9.4 ** 2, 31.5 ** 2, 88 + 992, np.sqrt(1080)], [88.36, 992.25, 1080, 32.86], [1e-9, 1e-9, 0, 5e-3])
    # HRRR's own calm centre at 20 UTC (data report §1c: never the MSLP minimum)
    sp20 = np.hypot(u20, v20)
    pmin = call(DC + "storm_centre", "s14", "sea-level pressure minimum (only to place the speed search box)", heavy_call=True,
                msl=H.mslma.values[k20].astype(float), lat=LA2, lon=LO2, box=(25.5, 28.5, -83.5, -80.5))
    bx = (float(pmin.lat) - 0.3, float(pmin.lat) + 0.3, float(pmin.lon) - 0.3, float(pmin.lon) + 0.3)
    calm = call(DC + "storm_centre", "s14", "sub-grid minimum of the 10-m wind speed (HRRR's own calm centre)", heavy_call=True, msl=sp20, lat=LA2, lon=LO2, box=bx)
    eye = [float(calm.lat), float(calm.lon)]
    truth("DP14", "the model's calm centre (20 UTC) lies north of Fort Myers Beach", eye[0] > FMB[0], B1.r6(eye, 3))
    dEye = float(call(GS + "great_circle_distance", "s14", "calm centre → Fort Myers Beach", lat1=eye[0], lon1=eye[1], lat2=FMB[0], lon2=FMB[1])) / 1e3
    from scipy.interpolate import griddata
    glat = np.arange(23.4, 30.0001, 0.03)
    glon = np.arange(-85.6, -78.6999, 0.03)
    GLO, GLA = np.meshgrid(glon, glat)
    pts = np.stack([LO2.ravel(), LA2.ravel()], -1)
    U20 = griddata(pts, u20.ravel(), (GLO, GLA), method="linear")
    V20 = griddata(pts, v20.ravel(), (GLO, GLA), method="linear")
    B1.rgba_png(np.hypot(U20, V20)[::-1], B1.lut_rgb("cmocean.speed"), 0, 50, IMG / "ian_speed_20.png", alpha=0.9, hatch_neg=False, up=5)
    w_img = Image.open(IMG / "ian_speed_20.png").size
    truth("DP14", "speed raster ≥ 1024 px wide, no hatch (data report §1b)", w_img[0] >= 1024, list(w_img))
    dla = 0.015
    rs = np.random.default_rng(11)
    sl_ = rs.uniform(COAST_BOX[0], COAST_BOX[1], 240)
    so_ = rs.uniform(COAST_BOX[2], COAST_BOX[3], 240)
    tr = call(DT_ + "advect_on_sphere", "s14", "dλ/dt = u/(a cos φ), dφ/dt = v/a (RK4), frozen 20 UTC field", heavy_call=True,
              u=np.nan_to_num(U20), v=np.nan_to_num(V20), lat=glat, lon=glon, seeds_lat=sl_, seeds_lon=so_, dt=60.0, nsteps=47)
    V["ian"] = {"fmb": list(FMB), "grid_pt": [float(LA2[jj]), float(LO2[jj])], "u": uF, "sp": spF, "dir": dirF, "along": float(alF), "across": float(acF),
                "eye": eye, "eye_fmb_km": dEye, "speed_box": [float(glat[0] - dla), float(glat[-1] + dla), float(glon[0] - dla), float(glon[-1] + dla)],
                "tracks": [np.round(t, 4).tolist() for t in tr], "track_dt_s": 60.0}
    V["luts"] = {"speed": B1.lut_hex("cmocean.speed")}

    # ================================================================ s15-s22 turning arrows
    ur = call(GF + "unit_vector_rates", "s15", "Di/Dt = (u/(a cos φ))(j sin φ − k cos φ) (2.39a), u = 250 m/s", u=250.0, v=0.0, w=0.0, lat=BREST[0] * D2R)
    swing = np.degrees(np.linalg.norm(ur.Di_Dt) * 3600)
    row("DP15", "plane 250 m/s, 1 h: 900 km; i swings 12.19° (DC24); screen 900/74 = 12.16 ≈ 12", [250 * 3600 / 1e3, swing, 900 / 74], [900, 12.19, 12.16], 0.01)
    ur2 = call(GF + "unit_vector_rates", "s15", "Dk/Dt = j v/a (north step)", u=0.0, v=10.0, w=0.0, lat=BREST[0] * D2R)
    tilt = np.degrees(np.linalg.norm(ur2.Dk_Dt) * (111.19e3 / 10.0))
    row("DP15", "111 km north tilts k by 1.00° (DC24); screen 111/6371 = 0.0174 ('0.0175 rad = 1°')", [tilt, 111 / 6371, 111.2 / 6371], [1.0, 0.0174, 0.0175], [1e-3, 1e-4, 1e-4])
    E = np.asarray(call(CS + "unit_vectors_polar", "s16", "r̂ = (cos θ, sin θ), θ̂ = (−sin θ, cos θ) at θ = 53.13°", theta=np.deg2rad(53.13)))
    row("DP16", "Part 2 picture: r̂ = (0.6, 0.8), θ̂ = (−0.8, 0.6) at θ = 53.13°", np.ravel(E), [0.6, 0.8, -0.8, 0.6], 1e-4)
    u10 = call(GF + "unit_vector_rates", "s19", "east wind 10 m/s at Brest", u=10.0, v=0.0, w=0.0, lat=BREST[0] * D2R)
    Di = np.asarray(u10.Di_Dt)
    rate = float(np.linalg.norm(Di))
    R_m = EARTH_RADIUS * np.cos(BREST[0] * D2R)
    row("DP19", "|Di/Dt| = 2.364e-6 s⁻¹ = 10 / 4 230 000 m; j part 1.767e-6, k part −1.570e-6", [rate * 1e6, 10 / 4.23e6 * 1e6, Di[1] * 1e6, Di[2] * 1e6, R_m / 1e3],
        [2.364, 2.364, 1.767, -1.570, 4230.5], [1e-3, 1e-3, 1e-3, 1e-3, 0.5])
    row("DP19", "× 86 400 s = 0.204 rad = 11.70° per day ('about twelve degrees in a day')", [rate * 86400, np.degrees(rate * 86400)], [0.204, 11.70], [1e-3, 0.01])
    row("DP19", "(u/(a cos φ))(sin φ j − cos φ k) = library Di/Dt (no i part)", [*(Di - (10 / R_m) * (sp * np.array([0, 1, 0]) - cp * np.array([0, 0, 1])))], [0, 0, 0], 1e-15)
    # s22: the full rates and the orthogonality check (u = v = 10, lat 48.39)
    uu = call(GF + "unit_vector_rates", "s22", "(2.39a-c), u = v = 10 m/s at Brest", u=10.0, v=10.0, w=0.0, lat=BREST[0] * D2R)
    t_ = np.tan(BREST[0] * D2R)
    ref = {"Di": [0, 10 / R_m * sp, -10 / R_m * cp], "Dj": [-10 / EARTH_RADIUS * t_, 0, -10 / EARTH_RADIUS], "Dk": [10 / EARTH_RADIUS, 10 / EARTH_RADIUS, 0]}
    row("DP22", "D(i,j,k)/Dt in local (i, j, k) parts = the three lines of s22 (u = v = 10)", [*np.asarray(uu.Di_Dt), *np.asarray(uu.Dj_Dt), *np.asarray(uu.Dk_Dt)],
        [*ref["Di"], *ref["Dj"], *ref["Dk"]], 1e-15)
    row("DP22", "each change has no own part (i·Di = j·Dj = k·Dk = 0)", [uu.Di_Dt[0], uu.Dj_Dt[1], uu.Dk_Dt[2]], [0, 0, 0], 1e-18)
    Om = np.asarray(uu.Omega_flow)
    row("DP22", "D e/Dt = Ω_flow × e for e = i, j, k (the cross-product movie's rule)", [*(np.cross(Om, [1, 0, 0]) - uu.Di_Dt), *(np.cross(Om, [0, 1, 0]) - uu.Dj_Dt), *(np.cross(Om, [0, 0, 1]) - uu.Dk_Dt)],
        [0] * 9, 1e-18)
    V["turn"] = {"swing": swing, "tilt": tilt, "rate10": rate, "Di10": B1.r6(Di * 1e6, 4), "R_km": R_m / 1e3}

    # ================================================================ s23-s27 metric terms, the puck, the sizes
    mt = call(GF + "metric_terms", "s25", "(2.45) i row: −uv tan φ / a + uw / a (u = v = 10, w = 0, 45°)", u=10.0, v=10.0, w=0.0, lat=45.0 * D2R)
    mx = float(np.ravel(mt.east)[0])
    row("DP25", "east metric term −uv tan φ / a = −1.570e-5 m/s² (u = v = 10, w = 0, φ = 45°)", mx * 1e5, -1.570, 1e-3)
    mtw = call(GF + "metric_terms", "s25", "(2.45) i row with w = 1 m/s: + uw / a appears", u=10.0, v=10.0, w=1.0, lat=45.0 * D2R)
    row("DP25", "w = 1 m/s adds + u w / a = 1.57e-6 to the i row", (float(np.ravel(mtw.east)[0]) - mx) * 1e6, 10 / 6.371, 1e-6)
    tt2 = np.array([86400.0 - 1, 86400.0, 86400.0 + 1])
    glo, gla = call(GF + "great_circle", "s26", "great circle, constant speed, non-rotating sphere (a in metres)", heavy_call=True, lat0=45.0 * D2R, lon0=0.0,
                    u0=10.0, v0=10.0, t=tt2)
    glo, gla = np.asarray(glo, float), np.asarray(gla, float)
    u1 = EARTH_RADIUS * np.cos(gla[1]) * (glo[2] - glo[0]) / 2.0
    v1 = EARTH_RADIUS * (gla[2] - gla[0]) / 2.0
    row("DP26", "puck after 86 400 s: u 11.52, v 8.20, speed 14.142 (centred difference, h = 1 s)", [u1, v1, np.hypot(u1, v1)], [11.52, 8.20, 14.142], [0.005, 0.005, 5e-4])
    row("DP26", "screen: √(11.5² + 8.2²) = 14.12 ≈ 14.1 = √(10² + 10²)", [np.sqrt(11.5 ** 2 + 8.2 ** 2), np.sqrt(200)], [14.1, 14.1], 0.05)
    tp = np.linspace(0, 86400, 49)
    plo, pla = call(GF + "great_circle", "s26", "the puck's path over one day (49 samples)", heavy_call=True, lat0=45.0 * D2R, lon0=0.0, u0=10.0, v0=10.0, t=tp)
    plo, pla = np.degrees(np.asarray(plo)), np.degrees(np.asarray(pla))
    # u, v along the path by centred differences of the closed form (h = 1 s)
    pu, pv = [], []
    for t0 in tp:
        lo3, la3 = call(GF + "great_circle", "s26", "centred difference sample", heavy_call=True, lat0=45.0 * D2R, lon0=0.0, u0=10.0, v0=10.0, t=np.array([t0 - 1, t0, t0 + 1])) \
            if t0 in (0.0, 86400.0) else __import__("fluidpy.geo.frames", fromlist=["x"]).great_circle(45.0 * D2R, 0.0, 10.0, 10.0, np.array([t0 - 1, t0, t0 + 1]))
        lo3, la3 = np.asarray(lo3), np.asarray(la3)
        pu.append(EARTH_RADIUS * np.cos(la3[1]) * (lo3[2] - lo3[0]) / 2)
        pv.append(EARTH_RADIUS * (la3[2] - la3[0]) / 2)
    truth("DP26", "along the path u grows and v shrinks monotonically; speed stays 14.142 (± 1e-6)", bool(np.all(np.diff(pu) > 0) and np.all(np.diff(pv) < 0)
          and np.allclose(np.hypot(pu, pv), np.sqrt(200), atol=1e-6)), B1.r6([pu[0], pu[-1], pv[0], pv[-1]], 3))
    V["puck"] = {"lat": B1.r6(pla, 3), "lon": B1.r6(plo, 3), "u": B1.r6(pu, 3), "v": B1.r6(pv, 3), "t_h": B1.r6(tp / 3600, 2)}
    fco = float(call(GF + "coriolis_parameter", "s27", "f = 2Ω sin φ (lat in rad)", lat=45.0 * D2R))
    # ================================================================ calc & sync audit #5d (2026-11-05): every new screen number
    row("DP30", "D6 j at Brest with Part 3's 4-dp factors: −0.7478 × 0.9969 = −0.745, −0.7478 × (−0.0785) = 0.059, cos φ = 0.6639 → 0.664",
        [-0.7478 * 0.9969, -0.7478 * -0.0785, 0.6639, np.sin(BREST[0] * D2R), np.cos(BREST[1] * D2R), np.sin(BREST[1] * D2R)], [-0.7455, 0.0587, 0.6639, 0.7478, 0.9969, -0.0783], [5e-4, 5e-4, 1e-9, 5e-4, 5e-4, 5e-4])
    truth("DP30", "D6 roundings: −0.7455 → −0.745, 0.0587 → 0.059, 0.6639 → 0.664", [round(-0.7478 * 0.9969, 3), round(-0.7478 * -0.0785, 3), round(0.6639, 3)] == [-0.745, 0.059, 0.664])
    row("DP30", "D8 s07: j·k = −0.745 × 0.662 + 0.059 × (−0.052) + 0.664 × 0.748 = −0.493 − 0.003 + 0.497 ≈ 0; k·i = 0.662 × 0.078 − 0.052 × 0.997 = 0.052 − 0.052 = 0",
        [-0.745 * 0.662, 0.059 * -0.052, 0.664 * 0.748, -0.493 - 0.003 + 0.497, 0.662 * 0.078, -0.052 * 0.997, float(jB @ kB), float(kB @ iB)], [-0.493, -0.003, 0.497, 0.001, 0.052, -0.052, 0, 0],
        [5e-4, 5e-4, 5e-4, 1e-9, 5e-4, 5e-4, 1e-12, 1e-12])
    row("DP30", "D8 s08: Trappes 2.01° E − (−4.49°) = 6.50°; 6.50 × 73.8 km = 479.7 ≈ 480 km (great circle 480.4)", [TRAPPES[1] - BREST[1], 6.5 * 73.8, dBT / 1e3], [6.50, 479.7, 480], [1e-9, 0.05, 0.5])
    row("DP30", "D2 Khulna: cos 22.8° = 0.922, sin 22.8° = 0.388 (Part 3: 0.9219, 0.3875), cos 89.6° = 0.007, sin 89.6° = 1.000",
        [np.cos(22.8 * D2R), np.sin(22.8 * D2R), np.cos(89.6 * D2R), np.sin(89.6 * D2R)], [0.922, 0.388, 0.007, 1.000], [5e-4, 6e-4, 5e-4, 5e-4])
    row("DP30", "D2 dot: 0.662 × 0.006 = 0.004, −0.052 × 0.922 = −0.048, 0.748 × 0.388 = 0.290; sum 0.246; cos⁻¹ 0.246 = 75.8°",
        [0.662 * 0.006, -0.052 * 0.922, 0.748 * 0.388, 0.004 - 0.048 + 0.290, np.degrees(np.arccos(0.246))], [0.004, -0.048, 0.290, 0.246, 75.76], [5e-4, 5e-4, 5e-4, 1e-9, 0.01])
    row("DP30", "D2 east: i_K = (−sin 89.6°, cos 89.6°, 0) = (−1.000, 0.007, 0); i_B·i_K = 0.078 × (−1.000) + 0.997 × 0.007 = −0.078 + 0.007 = −0.071; cos⁻¹ = 94.1°",
        [-np.sin(89.6 * D2R), np.cos(89.6 * D2R), 0.078 * -1.0, 0.997 * 0.007, -0.078 + 0.007, np.degrees(np.arccos(-0.071))], [-1.0, 0.007, -0.078, 0.007, -0.071, 94.07], [5e-4, 5e-4, 1e-9, 5e-4, 1e-9, 0.01])
    row("DP30", "D3 radians: 1° = 0.01745 rad; 0.823 × 0.01745 = 0.01436; −0.553 × 0.01745 = −0.00965; middle latitude (26.10 + 26.92) / 2 = 26.51 ≈ 26.5; cos 26.5° = 0.895",
        [np.pi / 180, 0.823 * 0.01745, -0.553 * 0.01745, (26.10 + 26.92) / 2, np.cos(26.5 * D2R)], [0.01745, 0.01436, -0.00965, 26.51, 0.895], [5e-6, 5e-6, 5e-6, 1e-9, 5e-4])
    truth("DP30", "D3 (a): the second coast point is near Englewood FL (26.96 N, 82.35 W; < 6 km), not Venice FL (27.10 N, 82.45 W; > 20 km)",
          float(np.hypot((B_[0] - 26.962) * 111.19, (B_[1] + 82.352) * 111.19 * np.cos(B_[0] * D2R))) < 6
          and float(np.hypot((B_[0] - 27.100) * 111.19, (B_[1] + 82.454) * 111.19 * np.cos(B_[0] * D2R))) > 20,
          [round(float(np.hypot((B_[0] - 26.962) * 111.19, (B_[1] + 82.352) * 111.19 * np.cos(B_[0] * D2R))), 1),
           round(float(np.hypot((B_[0] - 27.100) * 111.19, (B_[1] + 82.454) * 111.19 * np.cos(B_[0] * D2R))), 1)])
    row("DP30", "D5: 10 / 4 230 000 = 2.36e-6 ≈ 2.4e-6 rad/s; 2.36e-6 × 86 400 = 0.204 rad; 0.204 × 57.3° = 11.7° ≈ 12°",
        [10 / 4.23e6 * 1e6, 2.36e-6 * 86400, 0.204 * 57.3, np.degrees(1)], [2.364, 0.204, 11.69, 57.30], [5e-4, 5e-4, 5e-3, 5e-3])
    row("DP30", "D7 puck first guess: 10 × 10 × 1 / 6 371 000 = 1.57e-5 m/s²; × 86 400 s = 1.36 ≈ 1.4 m/s; 10 + 1.4 = 11.4 (full path 11.52 → 11.5)",
        [10 * 10 * 1 / 6.371e6 * 1e5, 1.57e-5 * 86400, 10 + 1.4, u1], [1.570, 1.356, 11.4, 11.52], [5e-4, 5e-4, 1e-9, 0.005])
    row("DP30", "D8 s27: sin 45° = 0.707", np.sin(45 * D2R), 0.707, 5e-4)
    row("DP27", "f = 1.031e-4 s⁻¹; f v = 1.031e-3; ratio f v / (uv tan φ / a) = 65.7 ('about 66'); DC25", [fco * 1e4, fco * 10 * 1e3, fco * 10 / abs(mx)], [1.031, 1.031, 65.7], [1e-3, 1e-3, 0.05])
    row("DP27", "screen: 100 / 6.371e6 = 1.57e-5; 2 × 7.29e-5 × 0.707 = 1.031e-4; 1.03e-3 / 1.57e-5 = 65.6",
        [100 / 6.371e6 * 1e5, 2 * 7.29e-5 * 0.707 * 1e4, 1.03e-3 / 1.57e-5], [1.57, 1.031, 65.6], [1e-3, 1e-3, 0.05])
    row("DP27", "Ω = 7.292e-5 s⁻¹ (fluidpy.geo.constants)", OMEGA * 1e5, 7.292, 1e-3)
    tan80 = np.tan(80 * D2R)
    V["metric"] = {"mx": abs(mx), "f": fco, "fv": fco * 10, "ratio": fco * 10 / abs(mx), "tan80": tan80}

    # ================================================================ s28 recap = scene rows
    row("DP28", "recap: 75.8° / 329° / 9 along / 32 onto the land / 66×", [round(angBK, 1), round(brg), round(float(alF)), round(-float(acF)), round(fco * 10 / abs(mx))],
        [75.8, 329, 9, 32, 66], 0)
    V["say"] = say
    V["consts"] = {"a": EARTH_RADIUS, "Om": OMEGA}

    # ---------------------------------------------------------------------------------------------- report and write
    for r in rows:
        print(f"  {'PASS' if r['pass'] else 'FAIL'}  {r['id']:5s} {r['name']}  -> {r['value']}")
    for fl in flags:
        print(f"  FLAG  {fl['id']:5s} {fl['scene']} {fl['what']}: {fl['note']}")
    if not all(r["pass"] for r in rows):
        print("build_ch00_coordinates_frames: checks FAILED — no data written")
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
    (DATA / "fr.json").write_bytes(blob)
    data_hashes = {"fr.json": hashlib.sha256(blob).hexdigest()}
    for pimg in sorted(IMG.glob("*.png")):
        data_hashes[f"img/{pimg.name}"] = B1.sha_file(pimg)
    render = {}
    for pub in a.public:
        pub.mkdir(parents=True, exist_ok=True)
        Image.open(B1.F_BMNG).convert("RGB").resize((4096, 2048), Image.LANCZOS).save(pub / "fr_bmng.jpg", quality=88)
        for pimg in sorted(IMG.glob("*.png")):
            (pub / f"fr_{pimg.name}").write_bytes(pimg.read_bytes())
        render = {pp.name: B1.sha_file(pp) for pp in sorted(pub.glob("fr_*"))}
    inputs = {str(pq.relative_to(ROOT)).replace("\\", "/") if ROOT in pq.parents else str(pq): B1.sha_file(pq)
              for pq in [B1.F_HRRR, F_IBT_NI, B1.F_NE10C, F_NE10B, F_NE10P, B1.F_NE110, B1.F_BMNG]}
    manifest = {
        "id": "ch00_coordinates_frames", "title": TITLE, "storyboard": "movies/ch00/ch00_coordinates_frames/storyboard.yaml",
        "builder": "movies/data/build_ch00_coordinates_frames.py",
        "fluidpy": {"repo": "../Fluid Dynamics", **B1.git_sha(FLUID, {"sphere_py": "fluidpy/geo/sphere.py", "frames_py": "fluidpy/geo/frames.py",
                                                                     "vectors_py": "fluidpy/geo/vectors.py", "tensors_py": "fluidpy/core/tensors.py",
                                                                     "coords_py": "fluidpy/core/coords.py", "cyclone_py": "fluidpy/diag/cyclone.py",
                                                                     "trajectories_py": "fluidpy/diag/trajectories.py", "ibtracs_py": "fluidpy/data/ibtracs.py"})},
        "equations_note": "provenance only (QA/reviewer); the movie draws no equation labels or numbers (HOUSE_STYLE §5)",
        "equations": {"v = u i + v j + w k": "Vallis (2.29)", "Di/Dt, Dj/Dt, Dk/Dt": "Vallis (2.39a)-(2.39c), r = a", "u = a cos φ Dλ/Dt": "Vallis (2.28)",
                      "Dv/Dt product rule and metric terms": "Vallis (2.44a), (2.45)", "f = 2Ω sin φ": "Vallis (2.80)",
                      "great circles (no force)": "Vallis §2.2.4 (2.50a,b) with f = 0", "turned axes": "Kundu (2.4)-(2.5) family (Part 1 recap)"},
        "parameters": {"stations": {"Brest": list(BREST), "Trappes": list(TRAPPES), "Singapore": list(SINGAPORE), "Khulna": list(KHULNA), "Khulna_NE": list(KHULNA_NE)},
                       "coast_segment": {"A": [*A_], "B": [*B_], "source": "NE 10 m coastline vertices nearest Naples (26.10, −81.80) and Venice (26.93, −82.36) — build-1 pN, pV",
                                         "flat_bearing_deg": 360 - beta, "sphere_bearing_deg": brg},
                       "ian": {"hrrr_time": "2022-09-28T20", "point": "nearest HRRR 3-km grid point to Fort Myers Beach " + str(B1.r6(V["ian"]["grid_pt"], 4)),
                               "eye_marker": "HRRR's own calm centre (10-m wind-speed minimum in ±0.3° of the MSLP minimum), data report §1c", "eye": eye,
                               "regrid": "HRRR LCC -> 0.03° lat/lon (scipy griddata linear), raster ×5 (≥ 1024 px, no hatch)",
                               "tracks": "advect_on_sphere, 60 s per sample, frozen 20 UTC field (time compression, not badged)"},
                       "amphan": {"sid": AMPHAN, "file": "IBTrACS.NI.v04r01.nc", "closest_km": float(dK[jm]), "closest_utc": str(tmin)},
                       "turning": {"plane_ms": 250.0, "wind_ms": 10.0, "lat": BREST[0]}, "puck": {"lat0": 45.0, "lon0": 0.0, "u0": 10.0, "v0": 10.0, "t_s": 86400},
                       "metric": {"u": 10.0, "v": 10.0, "w": 0.0, "lat": 45.0},
                       "time_compression": {"s00/s01/s15": "a 250 m/s flight hour in a few seconds", "s26": "one day of puck travel in about 6 s",
                                            "s14": "streaklines 60 s per sample through the frozen 20 UTC field"},
                       "exaggerations": ["tripod arrows ≈ 800 km on the whole globe, ≈ 30-90 km zoomed (illustrative)", "Δλ, Δφ steps magnified to 15° in s16-s21",
                                         "half-Earth cuts (s04, s06, s20)", "s12 triangle drawn larger than the map", "s27 log-scale bars; the polar tan φ growth glyph is illustrative"],
                       "screen_deviations": ["s03 three.js globe zoom (the storyboard's runner-up) instead of a Cesium ETOPO drape; source line without ETOPO",
                                             "skip chip in the lower maths zone (as Part 1), 44 px, three lines with the storyboard's words",
                                             "s14 across row '≈ −31.5' (the voice), check row 31.6 with an 'unrounded' keyword (see flags)"],
                       "data_report": "reports/data/ch00_coordinates_research.md (2026-11-05) §1b, §1c, §3 applied"},
        "credits": ["NOAA HRRR analyses (public domain) via the University of Utah HRRR-zarr archive.", "IBTrACS v04r01 (NOAA NCEI).",
                    "NASA Blue Marble Next Generation (NASA Earth Observatory).", "Made with Natural Earth.",
                    "Music: tools/sound (procedural synthesis, our own code, CC0-1.0)."],
        "js_selftest": "none — every number is read from data/fr.json (TSX CHECK rows re-assert the screen strings; enAt of the kit = enu_basis to 1e-6)",
        **chapters(), "inputs_sha256": inputs, "render_assets": render, "data_files": data_hashes, "checks": rows, "flags": flags,
        "physics": [e for e in entries if e.get("sha256")], "physics_recorded": [e for e in entries if not e.get("sha256")], "physics_heavy": heavy,
    }
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=1, ensure_ascii=False, default=str), encoding="utf-8")
    print(f"build_ch00_coordinates_frames: fr.json {len(blob) / 1e3:.0f} kB + {len(data_hashes) - 1} images; {len(entries)} parity entries, "
          f"{len(heavy)} heavy, {len(rows)} checks ({sum(r['pass'] for r in rows)} pass), {len(flags)} flags -> {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
