"""Physics and real-data products for the Chapter-0 movie #5c "Coordinates, Part 3 — Our round Earth: latitude, longitude,
distances and areas" (movies/ch00/ch00_coordinates_sphere/storyboard.yaml v1, 37 scenes; CHECK rows DS01-DS29).

Run with the main venv::

    .venv/Scripts/python.exe movies/data/build_ch00_coordinates_sphere.py [--public <render public dir> ...]

Every number the movie shows or says is computed here by the tested functions named in the storyboard's ``physics_source``
fields, on files already on disk (no download):

* ``fluidpy.geo.sphere`` (unit_vector, meridian_points, parallel_points, arc_lengths, great_circle_points, wrap_lon,
  band_area, band_fraction, polygon_area, great_circle_distance), ``fluidpy.geo.constants`` (EARTH_RADIUS, OMEGA),
* ``fluidpy.core.coords`` (cartesian_from_spherical: the colatitude bridge; cartesian_from_polar_coords: the top view),
* ``fluidpy.data.naturalearth.read_records`` (NE 10 m admin-0: the countries on 48.4 N, the prime meridian's land crossings),
* ``fluidpy.data.ibtracs.storm_table`` (Amphan, NI basin, sid 2020136N10088: the s19 track and its closest approach to Khulna),
* ``fluidpy.diag.climatology.global_mean`` (ERA5 September 2026 2-m temperature, cos-latitude weights; s34).

Places (storyboard ``places``; one set across Parts 1-5): Brest 48.4 N 4.5 W, Khulna 22.8 N 89.6 E, Singapore 1.35 N
103.8 E, Longyearbyen 78.2 N 15.6 E, Greenwich 51.48 N 0. Fluidpy calls that take a radius get SI metres (a = 6.371e6 m: the
build-1 tissot lesson, never a = 1). Inputs: NASA Blue Marble NG (5400 px globe texture, 21600 px panel crops), Natural Earth
10 m coast / admin-0 / places, NE 110 m globe lines, IBTrACS v04r01 NI, ERA5 monthly t2m Sep 2026 (1°, CC-BY 4.0).

Writes movies/ch00/ch00_coordinates_sphere/data/cs.json (numbers and small arrays the composition only indexes and
interpolates), data/img/*, manifest.json (function, provenance, parameters, fluidpy git SHA, sha256 of inputs and data files,
parity hashes, chapter marks and maths-skip targets from timing.json). All CHECK rows must pass before anything is written
(exit 1 otherwise). ``flags`` lists screen/voice roundings a hand check finds inconsistent (for the director; not CHECK
failures because the voice is fixed until the final TTS).
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
OUT = ROOT / "movies" / "ch00" / "ch00_coordinates_sphere"
DATA = OUT / "data"
IMG = DATA / "img"
RAW = Path("G:/Geophysical Fluid Dynamics/aofd-data/raw")
F_IBT_NI = RAW / "IBTrACS-v04r01" / "IBTrACS.NI.v04r01.nc"
F_NE10P = RAW / "NE-10m-places" / "ne_10m_populated_places_simple.zip"
F_BMNG_HI = RAW / "BMNG-2004" / "world.topo.bathy.200409.3x21600x10800.jpg"
sys.path.insert(0, str(FLUID))
sys.path.insert(0, str(Path(__file__).resolve().parent))
import build_ch00_coordinates as B1  # noqa: E402  (shared helpers: parity_hash, r6, sha_file, git_sha, lut_hex, lut_rgb, rgba_png, shp_parts, box_lines, bilin, sample_equirect)

D2R = np.pi / 180.0
TITLE = "Coordinates, Part 3 — Our round Earth: latitude, longitude, distances and areas"
BREST, KHULNA, SING, LYB, GREENWICH = (48.4, -4.5), (22.8, 89.6), (1.35, 103.8), (78.2, 15.6), (51.48, 0.0)
AMPHAN = "2020136N10088"
GS, CS = "fluidpy.geo.sphere.", "fluidpy.core.coords."
BOB_BOX = (17.0, 27.5, 83.0, 95.5)     # s19 Bay of Bengal zoom

# chapter marks (storyboard chapter_marks: scene, title) and the maths-skip blocks (storyboard skip_blocks)
CHAPTERS = [("s00_title", "title, hook and look back"), ("s03_sphere", "the sphere, latitude and the parallel"),
            ("s07_colatitude", "colatitude and the sine-cosine swap"), ("s09_meridians", "meridians, the prime meridian, longitude"),
            ("s13_earth_axes", "Earth-centred x, y, z"), ("s14_brest_side", "Brest's position, step by step"), ("s19_khulna", "Khulna"),
            ("s20_spin_rate", "the spinning ground"), ("s22_distance_north", "distances north and east"), ("s26_grid_boxes", "ERA5 grid boxes"),
            ("s27_area_patch", "areas, step by step"), ("s33_archimedes", "Archimedes"), ("s34_global_mean", "global averages"),
            ("s35_recap", "to sum up")]
SKIPS = [("K1", "s08_sin_cos_swap", "s09_meridians"), ("K2", "s14_brest_side", "s21_ground_speeds"),
         ("K3", "s22_distance_north", "s25_degree_east"), ("K4", "s27_area_patch", "s34_global_mean")]
# s26 panels: (key, name, centre lat, centre lon) — every panel 120.8 km wide × 139 km tall (same km scale: 3.31 px/km)
PANELS = [("sing", "Singapore", 1.30, 103.85), ("khulna", "Khulna", 22.25, 89.45), ("brest", "Brest", 48.40, -4.55), ("lyb", "Longyearbyen", 78.20, 15.40)]
PANEL_PX = (400, 440)
PANEL_TALL_DEG = 1.25                  # five ERA5 boxes tall


def mmss(t: float) -> str:
    return f"{int(t) // 60}:{int(t) % 60:02d}"


def chapters() -> dict:
    """Chapter marks and the maths-skip targets from the current timing.json (user rule 2026-11-05)."""
    tp = OUT / "timing.json"
    if not tp.exists():
        return {}
    tm = json.loads(tp.read_text(encoding="utf-8"))
    by = {s["id"]: s for s in tm["scenes"]}
    ch = [{"time": mmss(0 if i == 0 else by[sid]["start"]), "t_s": round(0.0 if i == 0 else by[sid]["start"], 3), "title": ti, "scene": sid}
          for i, (sid, ti) in enumerate(CHAPTERS)]
    sk = []
    for blk, a, b in SKIPS:
        q = by[b]["sentences"][0]
        assert q["text"].startswith("If you skipped"), b
        j = next(i for i, s in enumerate(by[a]["sentences"]) if "skip ahead" in s["text"])
        sk.append({"block": blk, "chip_scene": a, "chip_sentence": j, "chip_at_s": round(by[a]["sentences"][j]["start"], 3), "skip_to": mmss(q["start"]),
                   "skip_to_s": round(q["start"], 3), "keep_scene": b, "keep_line": " ".join(s["text"] for s in by[b]["sentences"][:2])})
    return {"chapters": ch, "maths_skips": sk, "timing_provisional": bool(tm.get("provisional"))}


def places_ne(names: dict[str, str]) -> dict:
    """lat/lon of Natural Earth 10 m populated places by name and country (adm0name)."""
    import shapefile
    import zipfile
    out = {}
    with zipfile.ZipFile(F_NE10P) as z:
        base = [n for n in z.namelist() if n.endswith(".shp")][0][:-4]
        r = shapefile.Reader(shp=z.open(base + ".shp"), shx=z.open(base + ".shx"), dbf=z.open(base + ".dbf"), encoding="utf-8")
        flds = [f[0] for f in r.fields[1:]]
        for sr in r.iterShapeRecords():
            rec = dict(zip(flds, sr.record))
            nm = rec.get("name") or rec.get("NAME")
            if nm in names and nm not in out and (rec.get("adm0name") or rec.get("ADM0NAME")) == names[nm]:
                out[nm] = [float(sr.shape.points[0][1]), float(sr.shape.points[0][0])]
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--public", type=Path, nargs="*", default=[], help="render public dir(s) for the cs_* assets")
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
                          "output_sha256": B1.parity_hash(out) if not hasattr(out, "_fields") else B1.parity_hash(str(out))})
            return out
        jp = {k: (np.asarray(v).tolist() if isinstance(v, np.ndarray) else v) for k, v in params.items()}
        try:
            h = B1.parity_hash(out)
        except Exception:
            h = None
        entries.append({"fn": fn, "scene": scene, "data": "data/cs.json", "eq": eq, "params": jp, "sha256": h})
        return out

    from fluidpy.geo.constants import EARTH_RADIUS, OMEGA
    A_KM = EARTH_RADIUS / 1e3

    # ================================================================ s04 the radius
    row("DS01", "a = 6.371e6 m (fluidpy.geo.constants.EARTH_RADIUS, metres; easy 6400 km)", [EARTH_RADIUS, round(A_KM, -2)], [6.371e6, 6400], [0.5, 0])
    row("DS02", "balloon 10 km up: 10 / 6371 = 0.157 % ('about a sixth of one percent'; screen ≈ 0.16 %)", [10 / A_KM * 100, round(10 / A_KM * 100, 2), 1 / 6],
        [0.157, 0.16, 1 / 6], [5e-4, 1e-12, 1e-9])

    # ================================================================ s05 latitude
    rB = np.asarray(call(GS + "unit_vector", "s05", "r̂ = (cos φ cos λ, cos φ sin λ, sin φ)", lat=BREST[0], lon=BREST[1]))
    row("DS03", "the Brest arrow's angle above the equator plane asin(z/a) = 48.4°", np.degrees(np.arcsin(rB[2])), 48.4, 1e-9)
    # ================================================================ s06 the parallel (a circle round the axis)
    par = np.asarray(call(GS + "parallel_points", "s06", "parallel at 48.4 N: radius a cos φ (unit sphere)", lat=BREST[0], n=361))
    row("DS04", "every point of the 48.4° parallel: distance from the axis cos φ = 0.6639, height sin φ = 0.7478 (unit sphere)",
        [np.ptp(np.hypot(par[:, 0], par[:, 1])), np.mean(np.hypot(par[:, 0], par[:, 1])), np.mean(par[:, 2])], [0, 0.6639, 0.7478], [1e-12, 5e-5, 5e-5])
    adm = call("fluidpy.data.naturalearth.read_records", "s06", "NE 10 m admin-0 polygons", heavy_call=True, zip_path=str(B1.F_NE10A))
    from shapely.geometry import LineString
    lat_line = LineString([(-180.0, BREST[0]), (180.0, BREST[0])])
    on48: dict[str, list[list[float]]] = {}
    for rec, geom in adm:
        inter = geom.intersection(lat_line)
        if inter.is_empty:
            continue
        segs = getattr(inter, "geoms", [inter])
        for sg in segs:
            if sg.geom_type == "LineString":
                xs = [c[0] for c in sg.coords]
                on48.setdefault(rec["ADMIN"], []).append([round(min(xs), 3), round(max(xs), 3)])
    want48 = {"France", "Germany", "Austria", "Slovakia", "Hungary", "Ukraine", "Moldova", "Russia", "Kazakhstan", "China", "Mongolia",
              "United States of America", "Canada"}
    truth("DS05", "countries crossed by 48.4 N (NE 10 m admin-0) = the storyboard's 13 (France … Canada)", set(on48) == want48, sorted(on48))
    seg = {k: sorted(v) for k, v in on48.items()}
    lab48 = [("central Europe", float(np.mean(seg["Germany"][0]) + 3.5)), ("Ukraine", float(np.mean(max(seg["Ukraine"], key=lambda s: s[1] - s[0])))),
             ("Kazakhstan", float(np.mean(max(seg["Kazakhstan"], key=lambda s: s[1] - s[0])))), ("Mongolia", float(np.mean(max(seg["Mongolia"], key=lambda s: s[1] - s[0])))),
             ("United States", float(np.mean(max(seg["United States of America"], key=lambda s: s[1] - s[0])))),
             ("Canada", float(np.mean(max(seg["Canada"], key=lambda s: s[1] - s[0])))), ("Atlantic", -35.0)]
    inside = lambda nm, lo: any(sg[0] <= lo <= sg[1] for sg in seg[nm])  # noqa: E731
    truth("DS05", "label points lie on their country's crossing (central Europe on Austria or Germany; no land on 48.4 N between 50 W and 20 W)",
          all(inside(nm, lo) for (t, lo), nm in zip(lab48[1:6], ["Ukraine", "Kazakhstan", "Mongolia", "United States of America", "Canada"]))
          and (inside("Austria", lab48[0][1]) or inside("Germany", lab48[0][1]))
          and not any(sg[1] > -50 and sg[0] < -20 for v in seg.values() for sg in v), [[t, round(lo, 2)] for t, lo in lab48])
    V["par48"] = {"countries": sorted(on48), "seg": seg, "labels": [{"t": t, "lon": lo} for t, lo in lab48]}

    # ================================================================ s07-s08 colatitude, sine and cosine swap
    cs = np.asarray(call(CS + "cartesian_from_spherical", "s07", "colatitude bridge: (r, θ = 90° − φ, λ) → x, y, z", r=A_KM, theta=np.pi / 2 - BREST[0] * D2R,
                         phi=BREST[1] * D2R))
    row("DS06", "cartesian_from_spherical(a, 90° − φ, λ) = a·unit_vector(φ, λ) (km, to 1e-9)", cs - A_KM * rB, [0, 0, 0], 1e-9)
    colat = 90 - BREST[0]
    row("DS07", "colatitude 90 − 48.4 = 41.6°; sin 41.6° = cos 48.4° = 0.6639; cos 41.6° = sin 48.4° = 0.7478",
        [colat, np.sin(colat * D2R), np.cos(BREST[0] * D2R), np.cos(colat * D2R), np.sin(BREST[0] * D2R)], [41.6, 0.6639, 0.6639, 0.7478, 0.7478], [1e-12, 5e-5, 5e-5, 5e-5, 5e-5])
    row("DS07", "triangle: 180 − 90 − 48.4 = 41.6", 180 - 90 - BREST[0], 41.6, 1e-12)

    # ================================================================ s09-s10 meridians and the prime meridian
    mer = np.asarray(call(GS + "meridian_points", "s09", "half great circles pole to pole", lon=0.0, n=181))
    row("DS08", "meridian_points(0°): a half circle round the centre (|r| = 1, y = 0, from the South Pole to the North Pole)",
        [np.ptp(np.linalg.norm(mer, axis=1)), np.max(np.abs(mer[:, 1])), mer[0, 2], mer[-1, 2]], [0, 0, -1, 1], 1e-12)
    pm_line = LineString([(0.0, -90.0), (0.0, 90.0)])
    pmx: dict[str, list[list[float]]] = {}
    for rec, geom in adm:
        inter = geom.intersection(pm_line)
        if inter.is_empty:
            continue
        for sg in getattr(inter, "geoms", [inter]):
            if sg.geom_type == "LineString":
                ys = [c[1] for c in sg.coords]
                pmx.setdefault(rec["ADMIN"], []).append([round(max(ys), 3), round(min(ys), 3)])
    pm_ref = {"United Kingdom": [53.76, 50.79], "France": [49.33, 42.69], "Spain": [42.69, 39.94], "Algeria": [35.84, 21.85], "Mali": [21.85, 14.99],
              "Burkina Faso": [14.99, 11.1], "Ghana": [10.6, 5.62], "Antarctica": [-71.5, -90.0]}
    # extent of every country's crossing (the UK line crosses the Humber: two pieces, 53.76-53.6 and 53.54-50.79); Ghana and Spain (the line touches the Cap de la Nau coast again at 38.6-38.8 N): their main piece
    got = {k: ([max(sg[0] for sg in v), min(sg[1] for sg in v)] if k not in ("Ghana", "Spain") else max(v, key=lambda sg: sg[0] - sg[1])) for k, v in pmx.items()}
    for nm, (y0, y1) in pm_ref.items():
        g = got.get(nm, [np.nan, np.nan])
        row("DS08", f"prime meridian land crossing {nm}: {y0}…{y1}° (NE 10 m admin-0, shapely)", [g[0], g[1]], [y0, y1], 0.06)
    truth("DS08", "Togo/Ghana: the 0° line runs on or within 0.06° of the border between 11.1 and 10.6 N (Togo touches it or Ghana's crossing restarts there)",
          ("Togo" in pmx and any(s[0] >= 10.55 and s[1] <= 11.15 for s in pmx["Togo"])) or any(abs(s[0] - 10.6) < 0.06 for s in pmx.get("Ghana", [])),
          {k: pmx[k] for k in ("Togo", "Ghana") if k in pmx})
    truth("DS09", "Greenwich (51.48 N) within 0.01° of lon 0 and inside the UK crossing", abs(GREENWICH[1]) <= 0.01 and got["United Kingdom"][1] <= GREENWICH[0] <= got["United Kingdom"][0])
    pl = places_ne({"London": "United Kingdom", "Accra": "Ghana", "Valencia": "Spain", "Brighton": "United Kingdom", "Khulna": "Bangladesh", "Kolkata": "India", "Dhaka": "Bangladesh"})
    # the tour labels (s10): land at the middle of its crossing, seas and cities at standard positions (NE places where present)
    tour = [("Arctic Ocean", 86.0, 0.0), ("Greenland", 72.0, -38.0), ("Norway", 62.5, 9.0), ("Norwegian Sea", 67.5, 0.0), ("North Sea", 56.5, 1.5),
            ("Yorkshire", 54.0, -1.2), ("Greenwich", GREENWICH[0], 0.0), ("Brighton", *(pl.get("Brighton") or [50.82, -0.14])), ("English Channel", 50.2, 0.6),
            ("Normandy", 49.1, 0.3), ("France", 46.3, 1.6), ("Pyrenees", 42.7, 0.7), ("Spain", 40.8, -1.5), ("Valencia", *(pl.get("Valencia") or [39.47, -0.38])),
            ("Mediterranean Sea", 38.3, 2.6), ("Algeria", 29.0, 1.8), ("Sahara", 24.0, 0.0), ("Mali", 18.5, -1.2), ("Burkina Faso", 13.0, -0.9),
            ("Togo", 10.85, 0.9), ("Ghana", 8.0, -0.6), ("Accra", *(pl.get("Accra") or [5.56, -0.2])), ("Gulf of Guinea", 2.5, 0.8), ("equator", 0.0, 0.0),
            ("South Atlantic", -30.0, 0.0), ("Southern Ocean", -60.0, 0.0), ("Antarctica", -76.0, 0.0), ("South Pole", -90.0, 0.0)]
    truth("DS08", "NE places (by country) Accra, Valencia, London on or within 0.5° of the 0° line", all(k in pl and abs(pl[k][1]) < 0.5 for k in ("Accra", "Valencia", "London")),
          {k: pl.get(k) for k in ("Accra", "Valencia", "London", "Brighton")})
    V["pm"] = {"cross": {k: got[k] for k in pm_ref}, "togo": pmx.get("Togo"), "spain_all": pmx.get("Spain"), "uk_all": pmx.get("United Kingdom"), "tour": [{"t": t, "lat": float(la), "lon": float(lo)} for t, la, lo in tour]}

    # ================================================================ s11 longitude
    w1 = float(call(GS + "wrap_lon", "s11", "λ in −180…180", lon=355.5))
    w2 = float(call(GS + "wrap_lon", "s11", "λ in 0…360", lon=BREST[1], west=0.0))
    row("DS10", "wrap_lon(355.5) = −4.5; wrap_lon(−4.5, west=0) = 355.5; screen 360 − 4.5 = 355.5", [w1, w2, 360 - 4.5], [-4.5, 355.5, 355.5], 1e-12)

    # ================================================================ s13 Earth axes
    ex = [np.asarray(call(GS + "unit_vector", "s13", f"axis {n}", lat=la, lon=lo)) for n, la, lo in (("x̂ (0 N, 0 E)", 0.0, 0.0), ("ŷ (0 N, 90 E)", 0.0, 90.0), ("ẑ (90 N)", 90.0, 0.0))]
    row("DS10", "unit_vector(0,0) = x̂, (0,90) = ŷ, (90,0) = ẑ; x̂ × ŷ = ẑ", [*ex[0], *ex[1], *ex[2], *(np.cross(ex[0], ex[1]) - ex[2])],
        [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], 1e-12)

    # ================================================================ s14-s18 Brest's position
    sB, cB, clB, slB = np.sin(BREST[0] * D2R), np.cos(BREST[0] * D2R), np.cos(BREST[1] * D2R), np.sin(BREST[1] * D2R)
    rBk = A_KM * rB
    row("DS11", "z = a sin φ = 4764.2 km; screen sin 48.4° ≈ 0.7478, 6371 × 0.7478 ≈ 4764, easy 6400 × ¾ = 4800",
        [rBk[2], sB, 6371 * 0.7478, 6400 * 0.75], [4764.2, 0.7478, 4764.2, 4800], [0.05, 5e-5, 0.05, 0])
    par_r = np.asarray(call(GS + "parallel_points", "s16", "Brest's parallel, radius a cos φ (km)", lat=BREST[0], n=361, radius=A_KM))
    row("DS12", "a cos φ = 4229.9 km = the radius of Brest's parallel; screen cos 48.4° ≈ 0.6639, 6371 × 0.6639 ≈ 4230, easy 6400 × ⅔ ≈ 4270",
        [A_KM * cB, np.mean(np.hypot(par_r[:, 0], par_r[:, 1])), cB, 6371 * 0.6639, 6400 * 2 / 3], [4229.9, 4229.9, 0.6639, 4229.7, 4266.7], [0.05, 0.05, 5e-5, 0.05, 0.05])
    truth("DS12", "screen roundings: 4229.7 → 4230, 4266.7 → 4270 ('about')", round(6371 * 0.6639) == 4230 and round(6400 * 2 / 3, -1) == 4270)
    xy = np.asarray(call(CS + "cartesian_from_polar_coords", "s17", "top view: polar coordinates with r = a cos φ, θ = λ", r=A_KM * cB, theta=BREST[1] * D2R))
    row("DS13", "x = 4216.8 km, y = −331.9 km (polar rule = unit_vector); screen cos(−4.5°) ≈ 0.9969, sin ≈ −0.0785; 4230 × 0.9969 ≈ 4217, 4230 × (−0.0785) ≈ −332",
        [xy[0], xy[1], *(xy - rBk[:2]), clB, slB, 4230 * 0.9969, 4230 * -0.0785], [4216.8, -331.9, 0, 0, 0.9969, -0.0785, 4216.9, -332.06], [0.05, 0.05, 1e-9, 1e-9, 5e-5, 5e-5, 0.05, 0.05])
    row("DS14", "|r| = 6371.0 km; screen √(4217² + 332²) ≈ 4230, √(4230² + 4764²) ≈ 6371", [np.linalg.norm(rBk), np.hypot(4217, 332), np.hypot(4230, 4764)], [6371.0, 4230.05, 6370.9], [0.05, 0.05, 0.05])
    row("DS15", "r̂ = (0.6619, −0.0521, 0.7478); screen (0.662, −0.052, 0.748); cos² φ + sin² φ = 1", [*rB, cB ** 2 + sB ** 2], [0.6619, -0.0521, 0.7478, 1.0], [5e-5, 5e-5, 5e-5, 1e-15])
    V["brest"] = {"ll": list(BREST), "r_km": B1.r6(rBk, 3), "rhat": B1.r6(rB, 6), "sin": sB, "cos": cB, "cosl": clB, "sinl": slB, "R_km": A_KM * cB, "colat": colat}

    # ================================================================ s19 Khulna (+ Amphan from IBTrACS)
    rK = np.asarray(call(GS + "unit_vector", "s19", "Khulna r̂", lat=KHULNA[0], lon=KHULNA[1]))
    rKk = A_KM * rK
    sK, cK, clK, slK = np.sin(KHULNA[0] * D2R), np.cos(KHULNA[0] * D2R), np.cos(KHULNA[1] * D2R), np.sin(KHULNA[1] * D2R)
    row("DS16", "Khulna (41.0, 5873.1, 2468.9) km, |r| = 6371.0; a cos φ = 5873.2", [*rKk, np.linalg.norm(rKk), A_KM * cK], [41.0, 5873.1, 2468.9, 6371.0, 5873.2], 0.06)
    row("DS16", "screen: sin 22.8° ≈ 0.3875 → 6371 × 0.3875 ≈ 2469; cos ≈ 0.9219 → 6371 × 0.9219 ≈ 5873; cos 89.6° ≈ 0.00698 → 5873 × 0.00698 ≈ 41; √(41² + 5873² + 2469²) ≈ 6371",
        [sK, 6371 * 0.3875, cK, 6371 * 0.9219, clK, 5873 * 0.00698, slK, np.sqrt(41 ** 2 + 5873 ** 2 + 2469 ** 2)],
        [0.3875, 2468.8, 0.9219, 5873.4, 0.00698, 40.99, 1.000, 6371.0], [5e-5, 0.05, 5e-5, 0.05, 5e-6, 0.01, 5e-4, 0.05])
    st = call("fluidpy.data.ibtracs.storm_table", "s19", "IBTrACS v04r01 NI, Amphan", heavy_call=True, path=str(F_IBT_NI), sid=AMPHAN, agencies=("usa", "newdelhi"))
    tt = np.array([np.datetime64(t.replace(" ", "T")) for t in st["time"]])
    la_, lo_ = np.array(st["lat"], float), np.array(st["lon"], float)
    sel = (tt >= np.datetime64("2020-05-16T00:00")) & (tt <= np.datetime64("2020-05-21T06:00"))
    th = ((tt - np.datetime64("2020-05-20T00:00")) / np.timedelta64(1, "h")).astype(float)
    hf = np.arange(th[sel][0], th[sel][-1] + 1e-9, 1 / 6)
    laf, lof = np.interp(hf, th, la_), np.interp(hf, th, lo_)
    dK = np.asarray(call(GS + "great_circle_distance", "s19", "Amphan centre (10-min linear interpolation) → Khulna (a in metres)", heavy_call=True,
                         lat1=laf, lon1=lof, lat2=KHULNA[0], lon2=KHULNA[1])) / 1e3
    jm = int(np.argmin(dK))
    row("DS16", "Amphan passes within about 100 km of Khulna (storyboard rule: keep 'close to where … came ashore'); data report: 78 km W", [float(dK[jm] <= 100.0), float(lof[jm] < KHULNA[1])], [1, 1], 0)
    V["khulna"] = {"ll": list(KHULNA), "r_km": B1.r6(rKk, 3), "rhat": B1.r6(rK, 6), "sin": sK, "cos": cK, "cosl": clK, "sinl": slK, "R_km": A_KM * cK,
                   "amphan": {"lat": B1.r6(la_[sel], 2), "lon": B1.r6(lo_[sel], 2), "time": [str(x) for x in tt[sel]], "closest_km": float(dK[jm])},
                   "places": {k: pl.get(k) for k in ("Khulna", "Kolkata", "Dhaka")}}
    gla, glo = call(GS + "great_circle_points", "s01", "great-circle arc Brest → Khulna (91 points)", lat1=BREST[0], lon1=BREST[1], lat2=KHULNA[0], lon2=KHULNA[1], n=91)
    V["gc_bk"] = {"lat": B1.r6(gla, 3), "lon": B1.r6(glo, 3)}
    V["lines"] = {"bob_coast": B1.box_lines([p for _, ps in B1.shp_parts(B1.F_NE10C) for p in ps], BOB_BOX, nd=3)}
    ne110 = json.loads(B1.F_NE110.read_text(encoding="utf-8"))
    V["lines"]["globe110"] = [np.round(np.asarray(ln, float), 2).tolist() for ln in ne110["coastline"]]
    V["lines"]["borders110"] = [np.round(np.asarray(ln, float), 2).tolist() for ln in ne110["borders"]]

    # ================================================================ s20-s21 the spinning ground
    T_s = 2 * np.pi / OMEGA
    row("DS17", "T = 2π / Ω = 86164.1 s (sidereal day 23 h 56 min 4 s); Ω = 7.292e-5 rad/s", [T_s, OMEGA * 1e5, 23 * 3600 + 56 * 60 + 4], [86164.1, 7.292, 86164], [0.05, 5e-4, 0.1])
    row("DS17", "audit C1 (fixed): 23 × 3600 = 82 800, 56 × 60 = 3 360, 82 800 + 3 360 + 4 = 86 164 s (voice: 'twenty three hours, fifty six minutes and four seconds')",
        [23 * 3600, 56 * 60, 23 * 3600 + 56 * 60 + 4, round(T_s)], [82800, 3360, 86164, 86164], 0)
    row("DS17", "audit C5: 360° ÷ 365 days ≈ 1° a day (0.986); 24 h = 1440 min; 1440 ÷ 360 = 4 min per 1°; 86 400 − 86 164 = 236 s ≈ 4 min",
        [360 / 365, 24 * 60, 24 * 60 / 360, 86400 - 86164, (86400 - 86164) / 60], [0.986, 1440, 4, 236, 3.93], [5e-4, 0, 0, 0, 5e-3])
    lats_U = [0.0, SING[0], KHULNA[0], BREST[0], LYB[0], 90.0]
    U = OMEGA * EARTH_RADIUS * np.cos(np.deg2rad(lats_U))
    row("DS18", "U = Ω a cos φ: equator 464.6, Singapore 464.5, Khulna 428.3, Brest 308.5, Longyearbyen 95.0, pole 0 m/s", U, [464.6, 464.5, 428.3, 308.5, 95.0, 0.0], 0.06)
    row("DS18", "screen: 2π / 86 164 ≈ 7.29e-5; 40 000 km ÷ 24 h ≈ 1670 km/h; cos 78.2° ≈ 0.2045", [2 * np.pi / 86164 * 1e5, 40000 / 24, np.cos(LYB[0] * D2R)], [7.292, 1666.7, 0.2045], [5e-4, 0.05, 5e-5])
    truth("DS18", "spoken/screen speeds: equator 464.6 (one decimal, audit C3), then round(U): 464, 428, 308, 95, 0",
          round(U[0], 1) == 464.6 and [round(x) for x in U[1:]] == [464, 428, 308, 95, 0], [round(x, 2) for x in U])
    row("DS18", "audit C3 rows: 7.292e-5 × 6.371e6 = 464.6; 464.6 × 0.9997 ≈ 464 (464.5), × 0.9219 ≈ 428 (428.3), × 0.6639 ≈ 308 (308.4), × 0.2045 ≈ 95 (95.0)",
        [7.292e-5 * 6.371e6, 464.6 * 0.9997, 464.6 * 0.9219, 464.6 * 0.6639, 464.6 * 0.2045, np.cos(SING[0] * D2R)], [464.6, 464.46, 428.3, 308.4, 95.0, 0.9997], [0.05, 0.05, 0.05, 0.05, 0.05, 5e-5])
    truth("DS18", "audit C3 roundings: 464.46 → 464, 428.3 → 428, 308.4 → 308, 95.0 → 95",
          [round(464.6 * c) for c in (0.9997, 0.9219, 0.6639, 0.2045)] == [464, 428, 308, 95])
    row("DS18", "audit C4: 2π × 6400 ≈ 40 200 ('about 40 000 km'); 40 000 ÷ 24 ≈ 1667 ≈ 1670 km/h; 464.6 × 3.6 = 1672.6 ≈ 1670; 1670 ÷ 900 ≈ 1.86 ≈ 1.9",
        [2 * np.pi * 6400, 40000 / 24, 464.6 * 3.6, 1670 / 900], [40212, 1666.7, 1672.6, 1.856], [0.5, 0.05, 0.05, 5e-4])
    truth("DS18", "audit C4 roundings: 40 212 → 'about 40 000'; 1667 and 1673 → 1670; 1.856 → 1.9",
          round(2 * np.pi * 6400, -4) == 40000 and round(40000 / 24, -1) == 1670 and round(464.6 * 3.6, -1) == 1670 and round(1670 / 900, 1) == 1.9)
    V["spin"] = {"T": T_s, "Om": OMEGA, "lat": lats_U, "U": B1.r6(U, 3)}

    # ================================================================ s22-s25 distances
    AL = call(GS + "arc_lengths", "s22", "δy = a δφ, δx = a cos φ δλ (1°; a in metres)", lat=[0.0, SING[0], KHULNA[0], BREST[0], LYB[0], 90.0], dlat=1.0, dlon=1.0)
    dy1 = float(np.ravel(AL.dy)[0]) / 1e3
    dx1 = np.asarray(AL.dx, float) / 1e3
    row("DS19", "1° north = 111.19 km; π/180 = 0.01745; screen 6371 × 0.01745 ≈ 111.2; easy 6400 × 0.0175 = 112", [dy1, np.pi / 180, 6371 * 0.01745, 6400 * 0.0175],
        [111.19, 0.01745, 111.17, 112.0], [0.01, 5e-6, 0.01, 1e-9])
    AM = call(GS + "arc_lengths", "s23", "one minute and 48.4° of latitude", lat=BREST[0], dlat=1 / 60, dlon=0.0)
    AS = call(GS + "arc_lengths", "s23", "Brest to the equator along its meridian", lat=BREST[0], dlat=BREST[0], dlon=0.0)
    row("DS20", "1′ = 1.853 km ('111.2 ÷ 60 ≈ 1.85'); 48.4° = 5381.8 km (screen 48.4 × 111.2 ≈ 5382) > z 4764", [float(AM.dy) / 1e3, 111.2 / 60, float(AS.dy) / 1e3, 48.4 * 111.2],
        [1.853, 1.853, 5381.8, 5382.1], [5e-4, 5e-4, 0.05, 0.05])
    row("DS21", "1° east at Brest = 73.83 km; screen 4230 × 0.01745 ≈ 73.8; 73.8 / 111.2 ≈ ⅔", [dx1[3], 4230 * 0.01745, 73.8 / 111.2], [73.83, 73.81, 0.664], [0.01, 0.01, 5e-4])
    row("DS22", "1° east: Singapore 111.16, Khulna 102.51, Brest 73.83, Longyearbyen 22.74, pole 0 km", dx1[1:], [111.16, 102.51, 73.83, 22.74, 0.0], 0.01)
    row("DS22", "screen: 111.2 × 0.9997 ≈ 111.2, × 0.9219 ≈ 102.5, × 0.6639 ≈ 73.8, × 0.2045 ≈ 22.7",
        [111.2 * 0.9997, 111.2 * 0.9219, 111.2 * 0.6639, 111.2 * 0.2045, np.cos(SING[0] * D2R)], [111.17, 102.51, 73.83, 22.74, 0.9997], [0.01, 0.01, 0.01, 0.01, 5e-5])
    V["deg"] = {"dy1": dy1, "dx1": B1.r6(dx1, 4), "lat": [0.0, SING[0], KHULNA[0], BREST[0], LYB[0], 90.0], "min_km": float(AM.dy) / 1e3, "brest_eq_km": float(AS.dy) / 1e3}

    # ================================================================ s26 ERA5 boxes (0.25°)
    AQ = call(GS + "arc_lengths", "s26", "ERA5 0.25° box at the four places", lat=[SING[0], KHULNA[0], BREST[0], LYB[0]], dlat=0.25, dlon=0.25)
    tall = float(np.ravel(AQ.dy)[0]) / 1e3
    wide = np.asarray(AQ.dx, float) / 1e3
    row("DS23", "0.25° box: 27.80 km tall; wide 27.79, 25.63, 18.46, 5.69 km; 1/cos 78.2° = 4.89; screen 111.2 ÷ 4 ≈ 27.8, 27.8 ÷ 5.7 ≈ 4.9",
        [tall, *wide, 1 / np.cos(LYB[0] * D2R), 111.2 / 4, 27.8 / 5.7], [27.80, 27.79, 25.63, 18.46, 5.69, 4.89, 27.8, 4.877], [0.01, 0.01, 0.01, 0.01, 0.01, 0.005, 1e-9, 1e-3])
    truth("DS23", "spoken widths: 27.8, 25.6, 18.5 ('eighteen and a half'), 5.7 (Part 4 / #6 use 18.5)", [round(w, 1) for w in wide] == [27.8, 25.6, 18.5, 5.7], [round(w, 2) for w in wide])

    # the four panels: BMNG 21 600 px crops on a local equirectangular frame scaled by cos φ (true local shape), the 0.25° grid lines
    km_px = PANEL_TALL_DEG * dy1 / PANEL_PX[1]
    bm_im = Image.open(F_BMNG_HI)
    HW, HH = bm_im.size

    def crop_sample(box, LA, LO):
        """bilinear sample of the 21 600-px BMNG at (LA, LO) from a crop of the box only (row 0 = 90 N, col 0 = 180 W)"""
        from scipy.ndimage import map_coordinates
        r0 = int(np.floor((90.0 - box[1]) / 180.0 * HH)) - 4
        r1 = int(np.ceil((90.0 - box[0]) / 180.0 * HH)) + 4
        c0 = int(np.floor((box[2] + 180.0) / 360.0 * HW)) - 4
        c1 = int(np.ceil((box[3] + 180.0) / 360.0 * HW)) + 4
        sub = np.asarray(bm_im.crop((c0, r0, c1, r1)).convert("RGB"), dtype=np.float32)
        rr = (90.0 - LA) / 180.0 * HH - 0.5 - r0
        cc = (LO + 180.0) / 360.0 * HW - 0.5 - c0
        out = np.zeros(LA.shape + (3,), np.uint8)
        for kk in range(3):
            out[..., kk] = np.clip(map_coordinates(sub[..., kk], [rr, cc], order=1, mode="nearest"), 0, 255)
        return out
    coast10 = [p for _, ps in B1.shp_parts(B1.F_NE10C) for p in ps]
    panels = []
    for key, nm, la0, lo0 in PANELS:
        dlat = PANEL_TALL_DEG
        dlon = (PANEL_PX[0] * km_px) / (111.19 * np.cos(la0 * D2R))
        box = [la0 - dlat / 2, la0 + dlat / 2, lo0 - dlon / 2, lo0 + dlon / 2]
        W, H = PANEL_PX[0] * 2, PANEL_PX[1] * 2
        LO, LA = np.meshgrid(np.linspace(box[2], box[3], W), np.linspace(box[1], box[0], H))
        rgb = crop_sample(box, LA, LO)
        Image.fromarray(rgb, "RGB").save(IMG / f"panel_{key}.jpg", quality=88)
        place = {"sing": SING, "khulna": KHULNA, "brest": BREST, "lyb": LYB}[key]
        gc = [round(place[0] / 0.25) * 0.25, round(place[1] / 0.25) * 0.25]          # the ERA5 grid point nearest the place
        cell = [gc[0] - 0.125, gc[0] + 0.125, gc[1] - 0.125, gc[1] + 0.125]
        glat = [v for v in np.arange(-90.125, 90.2, 0.25) if box[0] < v < box[1]]
        glon = [v for v in np.arange(-180.125, 180.2, 0.25) if box[2] < v < box[3]]
        cw = float(np.ravel(call(GS + "arc_lengths", "s26", f"0.25° cell width at {nm}'s grid cell centre", lat=gc[0], dlat=0.25, dlon=0.25).dx)[0]) / 1e3
        panels.append({"key": key, "name": nm, "box": B1.r6(box, 4), "cell": cell, "glat": B1.r6(glat, 3), "glon": B1.r6(glon, 3), "cell_w_km": cw,
                       "coast": B1.box_lines(coast10, (box[0] - 0.05, box[1] + 0.05, box[2] - 0.05, box[3] + 0.05), nd=4)})
    truth("DS23", "the highlighted cells' own widths round to the same spoken values (27.8, 25.6, 18.4/18.5, 5.7)",
          [round(p["cell_w_km"], 1) for p in panels][0:2] == [27.8, 25.6] and abs(panels[2]["cell_w_km"] - 18.46) < 0.06 and round(panels[3]["cell_w_km"], 1) == 5.7,
          [round(p["cell_w_km"], 3) for p in panels])
    bm_im.close()
    V["era5"] = {"tall": tall, "wide": B1.r6(wide, 3), "ratio": 1 / np.cos(LYB[0] * D2R), "panels": panels, "km_px": km_px}

    # ================================================================ s27-s28 areas
    q = 0.25 * D2R
    a2 = A_KM ** 2
    flat = a2 * q * q * np.cos(np.deg2rad([0.0, KHULNA[0], BREST[0], LYB[0]]))

    def cell_poly(la, lo, d, n=64):
        """the lat-lon cell as a densified polygon (parallels sampled every d/n so polygon_area's great-circle edges follow them)"""
        s = np.linspace(-d / 2, d / 2, n + 1)
        lat = np.r_[np.full(n + 1, la - d / 2), la - d / 2 + (s + d / 2), np.full(n + 1, la + d / 2), la + d / 2 - (s + d / 2)]
        lon = np.r_[lo + s, np.full(n + 1, lo + d / 2), lo - s, np.full(n + 1, lo - d / 2)]
        return lat, lon
    ex_cells = []
    for la in (0.0, KHULNA[0], BREST[0], LYB[0]):
        cl, co = cell_poly(la, 0.0, 0.25)
        ex_cells.append(float(call(GS + "polygon_area", "s28", f"exact 0.25° cell at {la}° (densified edges, a in metres)", heavy_call=True, lat=cl, lon=co)) / 1e6)
    row("DS24", "box areas a² cos φ (0.25° in rad)²: 772.8, 712.4, 513.1, 158.0 km²; exact cells (polygon_area) agree < 2e-4",
        [*flat, *(np.array(ex_cells) / flat - 1)], [772.8, 712.4, 513.1, 158.0, 0, 0, 0, 0], [0.06, 0.06, 0.06, 0.06, 2e-4, 2e-4, 2e-4, 2e-4])
    exact_band = a2 * q * (np.sin((BREST[0] + 0.125) * D2R) - np.sin((BREST[0] - 0.125) * D2R))
    row("DS24", "Brest cell exact a² Δλ (sin φ₂ − sin φ₁) = polygon_area = 513.06 km² ('five hundred and thirteen point one')", [ex_cells[2], exact_band], [513.06, 513.06], 0.01)
    row("DS24", "screen: 0.25° ≈ 0.00436 rad; 6371² ≈ 40.6 million km²", [q, a2 / 1e6], [0.00436, 40.59], [4e-6, 0.005])
    # build 1 (2026-11-06): the two former DS24 flags (40.6 × 0.00436² = 771.8, not 773; 773 × 0.9219 = 712.6, not 712) are
    # fixed on screen: the rows carry one more digit (0.0043633, 40.59, 772.8) and then the spoken rounding, so every shown
    # product is true to its last digit (Part 1 lessons A1/A6). The voice keeps "0.00436", "40.6 million", "773", "712".
    row("DS24", "screen: 0.25° = 0.25 × π/180 = 0.0043633 ≈ 0.00436 rad; 6371² = 40.59 × 10⁶ ≈ 40.6 × 10⁶ km²", [0.25 * np.pi / 180, q, a2 / 1e6], [0.0043633, 0.0043633, 40.59], [5e-8, 5e-8, 0.005])
    row("DS24", "screen: 40.59 × 10⁶ × 0.0043633 × 0.0043633 ≈ 772.8 ≈ 773 km² (= the exact a² cos 0 (0.25° in rad)²)", [40.59e6 * 0.0043633 ** 2, flat[0]], [772.8, 772.8], [0.05, 0.05])
    row("DS24", "screen: 772.8 × 0.9219 ≈ 712.4, × 0.6639 ≈ 513.1, × 0.2045 ≈ 158.0", [772.8 * 0.9219, 772.8 * 0.6639, 772.8 * 0.2045], [712.4, 513.1, 158.0], 0.05)
    row("DS24", "screen roundings: 712.4 → 712, 513.1 → 513, 158.0 → 158 (the spoken values)", [round(712.4), round(513.1), round(158.0)], [712, 513, 158], 0)
    # the s27 patch at Brest, 5° × 5° (×20 an ERA5 box): exact vs flat
    pl5, po5 = cell_poly(BREST[0], BREST[1], 5.0, 200)
    p5 = float(call(GS + "polygon_area", "s27", "the 5° patch at Brest (exact)", heavy_call=True, lat=pl5, lon=po5)) / 1e6
    f5 = a2 * (5 * D2R) ** 2 * cB
    row("DS24", "s27 patch 5° × 5° at Brest: flat a² cos φ ΔφΔλ within 0.2 % of the exact area", p5 / f5 - 1, 0.0, 2e-3)
    V["area"] = {"a2": a2, "rad025": q, "flat": B1.r6(flat, 3), "exact": B1.r6(ex_cells, 3), "patch5": [p5, f5]}

    # ================================================================ s29-s33 bands
    ba30 = float(call(GS + "band_area", "s29", "2π a² (sin φ₂ − sin φ₁), a in metres", lat1=0.0, lat2=30.0)) / 1e6
    row("DS25", "slope of sine on 20-30°: 10° = 0.1745 rad, cos 25° = 0.906, 0.906 × 0.1745 ≈ 0.158; sin 30 − sin 20 = 0.5 − 0.342 = 0.158",
        [10 * D2R, np.cos(25 * D2R), 0.906 * 0.1745, np.cos(25 * D2R) * 10 * D2R, np.sin(30 * D2R) - np.sin(20 * D2R), np.sin(20 * D2R)],
        [0.1745, 0.906, 0.1581, 0.1582, 0.1580, 0.342], [5e-5, 5e-4, 1e-4, 1e-4, 1e-4, 5e-4])
    b2030 = float(call(GS + "band_area", "s30", "band 20-30 N", lat1=20.0, lat2=30.0)) / 1e6
    row("DS25", "band_area(20, 30) = 2π a² × 0.1580", b2030 / (2 * np.pi * a2), 0.1580, 1e-4)
    steps = np.sin(np.deg2rad([10, 20, 30])) - np.sin(np.deg2rad([0, 10, 20]))
    mid10 = sum(2 * np.pi * a2 * np.cos(np.deg2rad(m)) * 10 * D2R for m in (5, 15, 25))
    mid1 = sum(2 * np.pi * a2 * np.cos(np.deg2rad(m + 0.5)) * D2R for m in range(30))
    row("DS26", "steps 0.1736, 0.1684, 0.1580 sum 0.5000; screen 0.174 + 0.168 + 0.158 = 0.500; midpoint strips 10°: 1.0013 ×, 1°: 1.00001 × exact",
        [*steps, steps.sum(), 0.174 + 0.168 + 0.158, mid10 / ba30, mid1 / ba30], [0.1736, 0.1684, 0.1580, 0.5, 0.5, 1.0013, 1.00001], [5e-5, 5e-5, 5e-5, 1e-12, 1e-12, 5e-5, 5e-6])
    nh = float(call(GS + "band_area", "s32", "northern hemisphere", lat1=0.0, lat2=90.0)) / 1e6
    whole = float(call(GS + "band_area", "s32", "whole Earth", lat1=-90.0, lat2=90.0)) / 1e6
    f3030 = float(call(GS + "band_fraction", "s32", "share of the Earth between 30 S and 30 N", lat1=-30.0, lat2=30.0))
    f48 = float(call(GS + "band_fraction", "s32", "share of the NH south of Brest (×2: band_fraction is of the whole Earth)", lat1=0.0, lat2=BREST[0])) * 2
    row("DS27", "2π a² = 255.03, 4π a² = 510.06 million km²; band 0-30 = ½ NH; 30 S-30 N = 0.5000; NH south of 48.4 N = 0.7478",
        [nh / 1e6, whole / 1e6, ba30 / nh, f3030, f48], [255.03, 510.06, 0.5, 0.5, 0.7478], [0.005, 0.005, 1e-12, 1e-12, 5e-5])
    zb = [float(call(GS + "band_area", "s33", f"equal-height band {nm}", lat1=float(np.degrees(np.arcsin(z0))), lat2=float(np.degrees(np.arcsin(z1))))) / 1e6
          for nm, z0, z1 in (("sin φ 0-0.1", 0.0, 0.1), ("sin φ 0.8-0.9", 0.8, 0.9))]
    row("DS28", "Archimedes: equal steps in z = a sin φ give equal areas (0-0.1 vs 0.8-0.9: both 0.1 × 2π a² = 25.50 million km²)", [zb[0] / 1e6, zb[1] / 1e6, zb[0] / zb[1]],
        [25.503, 25.503, 1.0], [5e-4, 5e-4, 1e-12])
    V["band"] = {"steps": B1.r6(steps, 4), "b30": ba30, "nh": nh, "whole": whole, "f48": f48, "curve": B1.r6(np.sin(np.deg2rad(np.arange(0, 91))), 5)}

    # ================================================================ s34 global mean (ERA5 September 2026, 1°)
    import xarray as xr
    T2 = xr.open_dataset(B1.F_T2M)
    tl, tlo = T2.lat.values.astype(float), T2.lon.values.astype(float)
    TK = T2.t2m.values.astype(float)
    gw = float(call("fluidpy.diag.climatology.global_mean", "s34", "cos-latitude weighted mean of t2m (K)", heavy_call=True, field=TK, lat=tl)) - 273.15
    gp = float(np.nanmean(TK)) - 273.15
    row("DS29", "Sep 2026 t2m: weighted 16.27 °C, plain 7.11 °C, difference > 9 (screen 16.3, 7.1)", [gw, gp, gw - gp], [16.27, 7.11, 9.16], [0.005, 0.005, 0.01])
    row("DS29", "toy: (30 + 0) ÷ 2 = 15; cos 60° = ½; (30 × 1 + 0 × ½) ÷ 1.5 = 20", [(30 + 0) / 2, np.cos(60 * D2R), (30 * 1 + 0 * 0.5) / 1.5], [15, 0.5, 20], 1e-12)
    # ================================================================ calc & sync audit #5c (2026-11-05): every new screen number
    row("DS30", "C6 Khulna: sin 22.8° ≈ 0.3875, cos 22.8° ≈ 0.9219, cos 89.6° ≈ 0.00698, sin 89.6° ≈ 1.000",
        [np.sin(22.8 * D2R), np.cos(22.8 * D2R), np.cos(89.6 * D2R), np.sin(89.6 * D2R)], [0.3875, 0.9219, 0.00698, 1.000], [5e-5, 5e-5, 5e-6, 5e-4])
    row("DS30", "C7 box widths: 27.8 × 0.9997 ≈ 27.8, × 0.9219 ≈ 25.6, × 0.6639 ≈ 18.5, × 0.2045 ≈ 5.7",
        [27.8 * 0.9997, 27.8 * 0.9219, 27.8 * 0.6639, 27.8 * 0.2045], [27.8, 25.6, 18.5, 5.7], 0.05)
    row("DS30", "C8 steps: sin 10° ≈ 0.174, sin 20° ≈ 0.342, sin 30° = 0.500; 0.174 − 0 = 0.174, 0.342 − 0.174 = 0.168, 0.500 − 0.342 = 0.158",
        [np.sin(10 * D2R), np.sin(20 * D2R), np.sin(30 * D2R), 0.174 - 0, 0.342 - 0.174, 0.500 - 0.342], [0.174, 0.342, 0.500, 0.174, 0.168, 0.158], [5e-4, 5e-4, 1e-12, 1e-12, 1e-12, 1e-12])
    row("DS30", "C9 Brest squares: 4217² ≈ 17 783 000, 332² ≈ 110 000, sum ≈ 17 893 000, √ ≈ 4230; 4230² ≈ 17 893 000, 4764² ≈ 22 696 000, sum ≈ 40 589 000, √ ≈ 6371",
        [4217 ** 2 / 1e3, 332 ** 2 / 1e3, (4217 ** 2 + 332 ** 2) / 1e3, np.sqrt(17893000), 4230 ** 2 / 1e3, 4764 ** 2 / 1e3, (4230 ** 2 + 4764 ** 2) / 1e3, np.sqrt(40589000)],
        [17783, 110, 17893, 4230, 17893, 22696, 40589, 6371], [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5])
    row("DS30", "C9 Khulna squares: 41² = 1681, 5873² ≈ 34 492 000, 2469² ≈ 6 096 000, sum ≈ 40 590 000, √ ≈ 6371",
        [41 ** 2, 5873 ** 2 / 1e3, 2469 ** 2 / 1e3, (41 ** 2 + 5873 ** 2 + 2469 ** 2) / 1e4, np.sqrt(40590000)], [1681, 34492, 6096, 4059, 6371], [0, 0.5, 0.5, 0.5, 0.5])
    row("DS30", "C9 areas: a² = 6371² ≈ 40.6 × 10⁶ km²; 2π × 40.6 × 10⁶ ≈ 255 × 10⁶; 2 × 255 = 510",
        [6371 ** 2 / 1e6, 2 * np.pi * 40.6, 2 * 255], [40.6, 255.1, 510], [0.05, 0.05, 0])
    truth("DS30", "C9 roundings: 2π × 40.6 = 255.1 → 255", round(2 * np.pi * 40.6) == 255)
    row("DS30", "C9 global mean: 16.3 − 7.1 = 9.2 °C (exact 9.16)", [16.3 - 7.1, gw - gp], [9.2, 9.16], [1e-9, 0.01])
    TC = TK - 273.15
    lut = B1.lut_rgb("cmocean.thermal")
    import fluidpy.geo.mapproj as MP
    A1, A2, A3, A4 = MP.equal_earth_coefficients()

    def inv_ee(X, Y):
        th = Y / A1
        for _ in range(30):
            fth = A1 * th + A2 * th ** 3 + A3 * th ** 7 + A4 * th ** 9 - Y
            fp = A1 + 3 * A2 * th ** 2 + 7 * A3 * th ** 6 + 9 * A4 * th ** 8
            th = np.clip(th - fth / fp, -1.25, 1.25)
        M = np.sqrt(3) / 2
        s = np.clip(np.sin(th) / M, -1, 1)
        lam = X * 3 * (9 * A4 * th ** 8 + 7 * A3 * th ** 6 + 3 * A2 * th ** 2 + A1) / (2 * np.sqrt(3) * np.cos(th))
        ok = (np.abs(lam) <= np.pi) & (np.abs(np.sin(th)) <= M + 1e-12)
        return np.degrees(np.arcsin(s)), np.degrees(lam), ok
    xee = float(MP.forward("equalearth", 0.0, 180.0 - 1e-9, a=1.0)[0])
    yee = float(MP.forward("equalearth", 90.0, 0.0, a=1.0)[1])
    w_, h_ = 1200, round(1200 * yee / xee)
    X, Y = np.meshgrid(np.linspace(-xee, xee, w_), np.linspace(yee, -yee, h_))
    la, lo, ok = inv_ee(X, Y)
    # periodic in longitude: columns −179 … 180 plus −180 (= 180) at the front
    Fx = np.concatenate([TC[:, -1:], TC], 1)
    lox = np.r_[-180.0, tlo]
    vals = B1.bilin(Fx, tl, lox, np.where(ok, la, 0), np.where(ok, lo, 0))
    vals[~ok] = np.nan
    B1.rgba_png(vals, lut, -60, 40, IMG / "t2m_ee.png", alpha=1.0)
    sel = np.where(ok.ravel())[0][:: max(1, ok.sum() // 4000)]
    fx, fy = MP.forward("equalearth", la.ravel()[sel], lo.ravel()[sel], a=1.0)
    row("DS29", "Equal Earth raster inverse round trip via mapproj.forward (a = 1: map units, no distance)", float(np.max(np.hypot(fx - X.ravel()[sel], fy - Y.ravel()[sel]))), 0.0, 1e-9)
    # the polar rows 60-90 N on the plate carrée grid (the many thin boxes), 1° per row
    pc = TC[tl >= 60.0][::-1]
    B1.rgba_png(np.concatenate([pc[:, -1:], pc], 1)[:, :360], lut, -60, 40, IMG / "t2m_pc_polar.png", alpha=1.0, up=4)
    truth("DS29", "colour range −60 … +40 °C covers 99 % of the boxes (Antarctic interior colder: clipped)", np.mean((TC >= -60) & (TC <= 40)) >= 0.99, float(np.mean((TC >= -60) & (TC <= 40))))
    coast_ee = []
    # pass 2 (user 2026-11-07, old 45:22: "straight horizontal lines" across the ERA5 map). Cause: Natural Earth ends the lines that meet
    # the antimeridian (Chukotka, Wrangel Island, Fiji, Antarctica) with a point at exactly lon = +180°, and mapproj.forward wraps +180° to
    # −180°, so that one point lands on the far-left edge and its segment ran right across the map. Fix: a point at ±180° keeps the side of
    # its own line (sign of its nearest neighbour) and is pulled 1e-6° inside; any real ±180° step would also split the line.
    n_wrap = n_split = 0
    for ln in ne110["coastline"]:
        arr = np.asarray(ln, float).reshape(-1, 2).copy()
        for i in np.where(np.abs(arr[:, 0]) >= 180.0)[0]:
            nb = [arr[j, 0] for j in (i - 1, i + 1) if 0 <= j < len(arr) and abs(arr[j, 0]) < 180.0]
            arr[i, 0] = np.sign(nb[0] if nb else arr[i, 0]) * (180.0 - 1e-6)
            n_wrap += 1
        cut = np.where(np.abs(np.diff(arr[:, 0])) > 180.0)[0] + 1
        n_split += len(cut)
        for part in np.split(arr, cut):
            if len(part) < 2:
                continue
            ex_, ey_ = MP.forward("equalearth", part[:, 1], part[:, 0], a=1.0)
            coast_ee.append(np.round(np.stack([ex_ / xee, ey_ / yee], -1), 4).ravel().tolist())
    jump = max(float(np.max(np.abs(np.diff(np.asarray(c[0::2]))))) for c in coast_ee if len(c) >= 4)
    truth("DS29", f"Equal Earth coast: {n_wrap} points at ±180° kept on their own side, {n_split} lines split; no step wider than 0.3 of the half-width",
          jump < 0.3, jump)
    V["t2m"] = {"weighted": gw, "plain": gp, "range": [-60, 40], "ee_ext": [xee, yee], "coast_ee": coast_ee, "polar_rows": int(pc.shape[0])}
    V["luts"] = {"thermal": B1.lut_hex("cmocean.thermal")}

    V["consts"] = {"a": EARTH_RADIUS, "a_km": A_KM, "Om": OMEGA}
    V["places"] = {"brest": list(BREST), "khulna": list(KHULNA), "sing": list(SING), "lyb": list(LYB), "greenwich": list(GREENWICH)}
    ch = chapters()
    V["skips"] = {s["chip_scene"]: s["skip_to"] for s in ch.get("maths_skips", [])}

    # ---------------------------------------------------------------------------------------------- report and write
    for r in rows:
        print(f"  {'PASS' if r['pass'] else 'FAIL'}  {r['id']:5s} {r['name']}  -> {r['value']}")
    for fl in flags:
        print(f"  FLAG  {fl['id']:5s} {fl['scene']} {fl['what']}: {fl['note']}")
    if not all(r["pass"] for r in rows):
        print("build_ch00_coordinates_sphere: checks FAILED — no data written")
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
    (DATA / "cs.json").write_bytes(blob)
    data_hashes = {"cs.json": hashlib.sha256(blob).hexdigest()}
    for pimg in sorted(list(IMG.glob("*.png")) + list(IMG.glob("*.jpg"))):
        data_hashes[f"img/{pimg.name}"] = B1.sha_file(pimg)
    render = {}
    for pub in a.public:
        pub.mkdir(parents=True, exist_ok=True)
        Image.open(B1.F_BMNG).convert("RGB").resize((4096, 2048), Image.LANCZOS).save(pub / "cs_bmng.jpg", quality=88)
        for pimg in sorted(list(IMG.glob("*.png")) + list(IMG.glob("*.jpg"))):
            (pub / f"cs_{pimg.name}").write_bytes(pimg.read_bytes())
        render = {pp.name: B1.sha_file(pp) for pp in sorted(pub.glob("cs_*"))}
    inputs = {str(pq.relative_to(ROOT)).replace("\\", "/") if ROOT in pq.parents else str(pq): B1.sha_file(pq)
              for pq in [F_IBT_NI, B1.F_NE10C, B1.F_NE10A, F_NE10P, B1.F_NE110, B1.F_BMNG, F_BMNG_HI, B1.F_T2M]}
    manifest = {
        "id": "ch00_coordinates_sphere", "title": TITLE, "storyboard": "movies/ch00/ch00_coordinates_sphere/storyboard.yaml",
        "builder": "movies/data/build_ch00_coordinates_sphere.py",
        "fluidpy": {"repo": "../Fluid Dynamics", **B1.git_sha(FLUID, {"sphere_py": "fluidpy/geo/sphere.py", "constants_py": "fluidpy/geo/constants.py",
                                                                     "coords_py": "fluidpy/core/coords.py", "climatology_py": "fluidpy/diag/climatology.py",
                                                                     "naturalearth_py": "fluidpy/data/naturalearth.py", "ibtracs_py": "fluidpy/data/ibtracs.py",
                                                                     "mapproj_py": "fluidpy/geo/mapproj.py"})},
        "equations_note": "provenance only (QA/reviewer); the movie draws no equation labels or numbers (HOUSE_STYLE §5)",
        "equations": {"a (the Earth's radius)": "Vallis §2.2.2 p. 61", "(λ, φ, r) spherical coordinates": "Vallis §2.2.2 p. 61, Fig. 2.3",
                      "x = a cos φ cos λ, y = a cos φ sin λ, z = a sin φ": "Vallis §2.2.2 (Kundu App. B §B.5 with colatitude θ = 90° − φ)",
                      "δy = a δφ, δx = a cos φ δλ": "Vallis §2.2.2, text before (2.27)", "dA = a² cos φ dφ dλ": "from δx δy (Vallis §2.2.2)",
                      "U = Ω a cos φ": "our step (|Ω × r| of Vallis (2.36))", "global mean weights cos φ": "fluidpy.diag.climatology.global_mean"},
        "parameters": {"places": V["places"], "a_m": EARTH_RADIUS, "Omega": OMEGA,
                       "amphan": {"sid": AMPHAN, "file": "IBTrACS.NI.v04r01.nc", "closest_km_to_khulna": float(dK[jm]), "data_report": "reports/data/ch00_coordinates_research.md §3 (78 km W)"},
                       "era5_panels": {"tall_deg": PANEL_TALL_DEG, "px": list(PANEL_PX), "km_per_px": km_px, "projection": "local equirectangular scaled by cos φ (true local shape; storyboard asked LAEA: differences < 0.3 % over 1.25°)",
                                       "image": "BMNG 21 600 × 10 800 (1.85 km per pixel), bilinear"},
                       "t2m": {"file": "data/derived/ch00/era5_t2m_anom_2026-09_1deg.nc (variable t2m, K)", "weighted_C": gw, "plain_C": gp, "lut": "cmocean thermal, −60 … +40 °C"},
                       "exaggerations": ["1° steps drawn ×5 (s22, s24, s25)", "4.5° wedge ×6 inset (s11, s17)", "one-minute step ×60 inset (s23)", "balloon height ×50 (s03, s04)",
                                         "s27 patch 5° wide (×20 an ERA5 box)", "lifted caps and slid halves (s04-s08, s11, s14-s17, s22, s24)", "interior rings decorative"],
                       "time_compression": ["globe spins (s06, s09, s20, s21)", "the camera tour along the prime meridian (s10)", "the title slice (s00)"],
                       "speed_arrows": "s21: 1 px per 1.5 m/s on the globe (illustrative length)"},
        "credits": ["NASA Blue Marble Next Generation (NASA Earth Observatory).", "Made with Natural Earth.", "IBTrACS v04r01 (NOAA NCEI).",
                    "ERA5 monthly means (Copernicus Climate Change Service; contains modified Copernicus Climate Change Service information 2026).",
                    "Music: tools/sound (procedural synthesis, our own code, CC0-1.0)."],
        "js_selftest": "none — every number is read from data/cs.json (TSX CHECK rows re-assert the screen strings)",
        **ch, "inputs_sha256": inputs, "render_assets": render, "data_files": data_hashes, "checks": rows, "flags": flags,
        "physics": [e for e in entries if e.get("sha256")], "physics_recorded": [e for e in entries if not e.get("sha256")], "physics_heavy": heavy,
    }
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=1, ensure_ascii=False, default=str), encoding="utf-8")
    print(f"build_ch00_coordinates_sphere: cs.json {len(blob) / 1e3:.0f} kB + {len(data_hashes) - 1} images; {len(entries)} parity entries, "
          f"{len(heavy)} heavy, {len(rows)} checks ({sum(r['pass'] for r in rows)} pass), {len(flags)} flags -> {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
