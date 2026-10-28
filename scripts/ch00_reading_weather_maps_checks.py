"""Chapter 0 movie ``ch00_reading_weather_maps``: compute the plan's CHECK numbers that the new library functions
(F1 ``fluidpy.geo.sphere``, F2 ``fluidpy.geo.mapproj``, F3–F5 ``fluidpy.diag.station``, F10 ``fluidpy.diag.axes``)
produce, print them next to the plan's values and write them to ``<out>/rwm_checks.json``.

Usage::

    .venv/Scripts/python.exe scripts/ch00_reading_weather_maps_checks.py --out outputs/ch00 --no-show

The ERA5 rows (RM14, RM17, RM19) run only if ``data/derived/ch00/ciaran_2023_{sfc,upper}_1102.{bin,json}`` exist.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np

from fluidpy.diag import station
from fluidpy.diag.axes import trough_ridge_axes
from fluidpy.geo import mapproj, sphere
from fluidpy.geo.atmos import hypsometric_thickness
from fluidpy.geo.constants import KNOT

ROOT = Path(__file__).resolve().parents[1]
NYC, TOKYO = (40.71, -74.01), (35.68, 139.69)
BREST, LOW03 = (48.448, -4.419), (50.0, -3.75)


def _load(stem: str):
    meta_p = ROOT / "data" / "derived" / "ch00" / f"{stem}.json"
    if not meta_p.exists():
        return None, None
    meta = json.loads(meta_p.read_text(encoding="utf-8"))
    raw = np.fromfile(meta_p.parent / meta["bin"], dtype="<f4")
    out = {}
    for v in meta["variables"]:
        o = v["offset_bytes"] // 4
        out[v["name"]] = raw[o:o + v["count"]].reshape(v["shape"]).astype(float)
    return out, meta["coords"]


def compute() -> list[dict]:
    rows: list[dict] = []

    def row(rid: str, what: str, value, plan):
        rows.append({"id": rid, "what": what, "value": value, "plan": plan})

    row("RM01", "1° latitude [km]", round(sphere.arc_lengths(0.0).dy / 1e3, 2), 111.19)
    row("RM02", "1° longitude at 0/48.39/60/90° [km]",
        [round(float(sphere.arc_lengths(l).dx) / 1e3, 2) for l in (0, 48.39, 60, 90)], [111.19, 73.84, 55.60, 0.00])
    gc = sphere.great_circle_distance(*NYC, *TOKYO) / 1e3
    v = sphere.great_circle_vertex(*NYC, *TOKYO)
    row("RM03", "NYC–Tokyo great circle [km], vertex lat [°N]", [round(gc, 1), round(v[0], 2)], [10850, 69.8])
    pc = mapproj.scale_factors("platecarree", [0.0, 60.0, 89.9])
    row("RM04", "plate carrée k at 0/60/89.9°, h", [np.round(pc.k, 3).tolist(), np.round(pc.h, 6).tolist()],
        [[1, 2.000, 573], 1])
    tis = mapproj.tissot_ellipses("platecarree", [(60.0, 0.0), (75.0, 0.0)], 500.0)
    row("RM05", "Tissot width ×k at 60/75° (and finite 500-km circle)",
        [[round(t.k, 3) for t in tis], [round(t.width_ratio, 3) for t in tis]], [2.00, 3.86])
    m60 = mapproj.scale_factors("mercator", 60.0)
    row("RM06", "Mercator h, k, areal at 60°", [round(m60.h, 3), round(m60.k, 3), round(m60.areal, 3)],
        [2.000, 2.000, 4.000])
    row("RM07", "Mercator y/a at 85°", round(mapproj.forward("mercator", 85.0, 0.0, a=1.0)[1], 4), 3.1313)
    rl = sphere.rhumb_line(*NYC, *TOKYO)
    row("RM09", "rhumb, great circle, difference [km]; rhumb bearing [°]",
        [round(rl.distance / 1e3, 1), round(gc, 1), round(rl.distance / 1e3 - gc, 1), round(rl.bearing, 2)],
        [12788, 10850, 1938])
    ee = [mapproj.scale_factors("equalearth", la, lo) for la, lo in ((0, 0), (60, 0), (45, 179.99), (60, 179.99))]
    row("RM10", "Equal Earth areal; ω at (0,0), (60,0), (45,180), (60,180) [°]",
        [max(abs(e.areal - 1) for e in ee), [round(e.omega, 1) for e in ee]], ["1 ± 1e-6", "17 / 30 / 58"])
    ps = mapproj.scale_factors("polar_stereographic", [89.999, 60.0, 0.0])
    row("RM11", "polar stereographic (60°) k at pole/60/equator", np.round(ps.k, 3).tolist(), [0.933, 1.000, 1.866])
    lat = np.arange(35.0, 65.01, 0.25)
    k = mapproj.scale_factors("lcc", lat).k
    row("RM12", "LCC 40/60 k at 35, min (lat), 65; stretch 50→65 [%]",
        [round(k[0], 3), round(k.min(), 3), float(lat[k.argmin()]), round(k[-1], 3),
         round(100 * (mapproj.scale_factors("lcc", 65.0).k / mapproj.scale_factors("lcc", 50.0).k - 1), 1)],
        [1.018, 0.985, None, 1.023, 3.8])
    row("RM18", "z500 over 1000 hPa at 250/270 K [m] (R_D = 287.05, g0 = 9.80665)",
        [round(hypsometric_thickness(1000e2, 500e2, 250.0), 1), round(hypsometric_thickness(1000e2, 500e2, 270.0), 1)],
        [5071, 5477])
    kt = 68.65 / KNOT
    row("RM20", "68.65 m/s in kt → rounded → barb", [round(kt, 2), station.barb_round(kt), tuple(station.barb_parts(kt))],
        [133.5, 135, (2, 3, 1)])
    row("RM21", "15 kt barb", tuple(station.barb_parts(15)), (0, 1, 1))
    m = station.decode_metar("LFRB 020000Z AUTO 22042G61KT 2400 RA BR BKN014/// OVC022/// //////TCU 11/10 Q0963")
    row("RM23", "METAR 00 UTC: dir, kt, gust, vis, T, Td, QNH",
        [m.wind_dir, m.wind_speed_kt, m.gust_kt, m.visibility_m, m.temperature_C, m.dewpoint_C, m.qnh_hPa],
        [220, 42, 61, 2400, 11, 10, 963])
    s = station.decode_synop("07110 24421 82739 10092 20075 39582 49696 53055 763// 333 4/000 6///7 91084 90710 91184"
                             " 555 6///5")
    row("RM24", "SYNOP 03 UTC: N, dd, ff, T, Td, SLP, a, ppp, ww, 911ff",
        [s.cloud_cover_oktas, s.wind_dir, s.wind_speed_kt, s.temperature_C, s.dewpoint_C, s.slp_hPa, s.tendency_a,
         s.tendency_hPa, s.ww, s.gust_period_kt], [8, 270, 39, 9.2, 7.5, 969.6, 3, 5.5, 63, 84])
    row("RM25", "plot code 969.6 / decode '696' / tendency text",
        [station.plot_pressure_code(969.6), station.decode_plot_pressure("696"), station.tendency_code(3, 5.5).text],
        ["696", 969.6, "+55"])
    s18 = station.decode_synop("07110 04326 81518 10103 20098 39718 49833 58103 60072 765//")
    row("RM26", "SYNOP 18 UTC: dd, ff→barb, T, Td, SLP, a, Δp, ww",
        [s18.wind_dir, station.barb_round(s18.wind_speed_kt), s18.temperature_C, s18.dewpoint_C, s18.slp_hPa,
         s18.tendency_a, s18.tendency_hPa, s18.ww], [150, 20, 10.3, 9.8, 983.3, 8, -10.3, 65])
    d = sphere.great_circle_distance(*BREST, *LOW03) / 1e3
    b = sphere.initial_bearing(*BREST, *LOW03)
    row("RM37", "Brest → 03 UTC low [km], bearing [°], left of facing east [°]",
        [round(d, 1), round(b, 2), round(90.0 - b, 2)], [179, 15.5, 74.5])
    row("RM45", "84 kt in km/h", round(84 * KNOT * 3.6, 1), 155.6)

    sfc, c = _load("ciaran_2023_sfc_1102")
    up, cu = _load("ciaran_2023_upper_1102")
    if sfc is not None and up is not None:
        la, lo = np.array(c["lat"]), np.array(c["lon"])
        t = c["time"].index("2023-11-02T12:00")
        g = sphere.gradient(sfc["msl"][t], la, lo)
        out = []
        for p in ((50.25, -1.75), (35.5, -34.75)):
            i, j = int(np.argmin(abs(la - p[0]))), int(np.argmin(abs(lo - p[1])))
            out.append([round(g.magnitude[i, j] * 1e3, 2),
                        round(float(np.hypot(sfc["u10"][t][i, j], sfc["v10"][t][i, j])), 2)])
        row("RM14", "|∇p| [hPa/100 km] and 10-m wind [m/s]: Channel, Azores", out, [[7.48, 21.7], ["<0.5", "2.9–3.7"]])
        t2 = cu["time"].index("2023-11-02T12:00")
        z5 = up["z"][t2, cu["level"].index(500)]
        row("RM17", "z500 min, max [m]", [round(z5.min(), 1), round(z5.max(), 1)], [5114, 5968])
        tr = [a for a in trough_ridge_axes(z5, la, lo, smooth_km=300.0) if a.kind == "trough"][0]
        pick = {float(x): round(float(y), 2) for x, y in zip(tr.lat, tr.lon) if float(x) in (40.0, 45.0, 50.0, 55.0)}
        sp = np.hypot(up["u"][t2, 1], up["v"][t2, 1])
        i, j = np.unravel_index(np.argmax(sp), sp.shape)
        row("RM19", "z500 trough axis lon at 40/45/50/55° N (300 km smoothing); max |v500| [m/s] at",
            [pick, round(float(sp.max()), 2), float(la[i]), float(lo[j])],
            ["55N 1.75E … 40N 5.5W", 68.65, 40.5, -8.5])
    return rows


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--out", default="outputs/ch00")
    ap.add_argument("--no-show", action="store_true", help="accepted for uniformity (no figures)")
    args = ap.parse_args()
    rows = compute()
    for r in rows:
        print(f"{r['id']:5s} {r['what']}: {r['value']}   (plan {r['plan']})")
    out = Path(args.out)
    if not out.is_absolute():
        out = ROOT / out
    out.mkdir(parents=True, exist_ok=True)
    (out / "rwm_checks.json").write_text(json.dumps(rows, indent=1, default=str), encoding="utf-8")
    print(f"wrote {out / 'rwm_checks.json'}")


if __name__ == "__main__":
    main()
