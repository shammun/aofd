"""Real data for the Chapter 0 movie ``ch00_cross_product_why`` (scenes 9-11): fetch through fluidpy.data.fetch()
(disk guard), reduce to derived products on the data root, write render-ready copies next to this file, run the
sanity checks and draw quick-look PNGs into outputs/ch00/data/.

Run:  .venv/Scripts/python.exe "movies/ch00/ch00_cross_product_why/data/real/fetch_real_data.py" [p1 p2 p3 p4 p5]

Products (data root = book.yaml data.root / env AOFD_DATA_ROOT):
  P1 derived/ch00/ncep_r1_sfc_wind_mslp_ltm_1991-2020.nc    -> wind_climatology.{bin,json}
  P2 derived/ch00/era5_ian_2022.nc                          -> ian_2022.{bin,json}
  P3 derived/ch00/era5_idai_2019.nc                         -> idai_2019.{bin,json}
  P4 derived/ch00/era5_ciaran_2023_{sfc,upper}.nc           -> ciaran_2023_{sfc,upper}.{bin,json}
  P5 Blue Marble Sept 2004, NE 50m coastlines+borders, NE SR_50M relief -> globe_*.jpg|png, ne_lines_50m.json
Every number printed here is also written to checks.json.
"""
from __future__ import annotations

import json
import shutil
import sys
import time
from pathlib import Path

import numpy as np

import fluidpy.data as fd
from fluidpy.data import era5_arco as ea
from fluidpy.data import nasa_bmng, naturalearth, psl
from fluidpy.data.reduce import write_bin_json

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[4]
QL = REPO / "outputs" / "ch00" / "data"
DER = fd.data_root() / "derived" / "ch00"
CHECKS = HERE / "checks.json"


def _checks() -> dict:
    return json.loads(CHECKS.read_text(encoding="utf-8")) if CHECKS.exists() else {}


def _rel(v):
    """Replace absolute local paths by ``<data_root>/…`` or repo-relative paths (the repo is public)."""
    if isinstance(v, dict):
        return {k: _rel(x) for k, x in v.items()}
    if isinstance(v, list):
        return [_rel(x) for x in v]
    if isinstance(v, str):
        for base, tag in ((str(fd.data_root()), "<data_root>/"), (str(REPO), "")):
            for b in (base, base.replace("/", "\\")):
                if v.startswith(b):
                    return tag + Path(v[len(b):].lstrip("\\/")).as_posix()
    return v


def _save(key: str, val: dict) -> None:
    c = _checks()
    c[key] = _rel(val)
    CHECKS.write_text(json.dumps(c, indent=1), encoding="utf-8")


def _disk(tag: str) -> str:
    s = fd.disk_report()
    print(f"[disk {tag}] {s}", flush=True)
    return s


def _mb(p: Path) -> float:
    return round(p.stat().st_size / 1e6, 3)


# ------------------------------------------------------------------------------------------------ P1
def p1() -> None:
    import matplotlib.pyplot as plt
    import xarray as xr

    before = _disk("P1 before")
    t0 = time.perf_counter()
    nc = psl.surface_wind_climatology()
    ds = xr.open_dataset(nc)
    b, j = write_bin_json(ds, HERE / "wind_climatology", ["u10", "v10", "mslp"])
    ann = ds.sel(season="ann")
    res = {"derived": str(nc), "derived_MB": _mb(nc), "bin_MB": _mb(b), "json_MB": _mb(j),
           "grid": f"T62 Gaussian {ds.sizes['lat']} x {ds.sizes['lon']}", "seconds": round(time.perf_counter() - t0, 1)}
    # zonal means and ocean sectors (lon 0..360 E)
    def zm(lat, lo=None, hi=None, season="ann"):
        a = ds["u10"].sel(season=season).sel(lat=lat, method="nearest")
        if lo is not None:
            a = a.sel(lon=slice(lo, hi))
        return round(float(a.mean()), 2)
    res["u_zonal_mean"] = {f"{la}": zm(la) for la in (15, -15, 45, -45, 50, -50)}
    res["u_sectors_ann"] = {"15N central Pacific 180-220E": zm(15, 180, 220), "15N Atlantic 320-340E": zm(15, 320, 340),
                            "15S east Pacific 230-260E": zm(-15, 230, 260), "15S Indian 60-90E": zm(-15, 60, 90),
                            "15S Atlantic 340-355E": zm(-15, 340, 355), "45N Atlantic 320-345E": zm(45, 320, 345),
                            "45N Pacific 160-220E": zm(45, 160, 220), "45S Indian 40-100E": zm(-45, 40, 100),
                            "50S zonal ring": zm(-50)}
    res["mslp_hPa_ann"] = {"Azores high max 20-45N 320-350E": round(float(ann["mslp"].sel(lat=slice(20, 45), lon=slice(320, 350)).max()) / 100, 1),
                           "N Pacific high max 20-45N 180-240E": round(float(ann["mslp"].sel(lat=slice(20, 45), lon=slice(180, 240)).max()) / 100, 1),
                           "Icelandic low min 50-70N 300-360E": round(float(ann["mslp"].sel(lat=slice(50, 70), lon=slice(300, 360)).min()) / 100, 1),
                           "global min/max": [round(float(ann["mslp"].min()) / 100, 1), round(float(ann["mslp"].max()) / 100, 1)]}
    res["pass_trades"] = all(v < 0 for k, v in res["u_sectors_ann"].items() if k.startswith("15")) and \
        res["u_zonal_mean"]["15"] < 0 and res["u_zonal_mean"]["-15"] < 0
    res["pass_westerlies"] = res["u_zonal_mean"]["45"] > 0 and res["u_zonal_mean"]["-45"] > 0
    res["disk_before"], res["disk_after"] = before, _disk("P1 after")
    _save("P1", res)
    print(json.dumps(res, indent=1))
    # quick-look
    QL.mkdir(parents=True, exist_ok=True)
    fig, axs = plt.subplots(3, 1, figsize=(11, 13))
    for ax, s in zip(axs, ["ann", "djf", "jja"]):
        d = ds.sel(season=s)
        cs = ax.contourf(d.lon, d.lat, d.mslp / 100, levels=np.arange(980, 1036, 4), cmap="cividis")
        ax.quiver(d.lon[::3], d.lat[::3], d.u10[::3, ::3], d.v10[::3, ::3], scale=200, width=0.0015)
        ax.set_title(f"NCEP R1 1991-2020 {s}: MSLP [hPa] and 10 m wind"); fig.colorbar(cs, ax=ax)
    fig.tight_layout(); fig.savefig(QL / "p1_wind_climatology.png", dpi=90); plt.close(fig)


# ------------------------------------------------------------------------------------------------ P2 / P3 storms
STORMS = {
    "ian_2022": dict(start="2022-09-26T00", end="2022-09-29T23", lat=(15, 35), lon=(-95, -70),
                     title="Hurricane Ian 2022: ERA5 hourly 10 m wind and MSLP", region="15-35N, 95-70W",
                     hemi="N"),
    "idai_2019": dict(start="2019-03-11T00", end="2019-03-15T23", lat=(-30, -10), lon=(30, 50),
                      title="Tropical Cyclone Idai 2019: ERA5 hourly 10 m wind and MSLP",
                      region="30-10S, 30-50E (Mozambique Channel)", hemi="S"),
}


def storm(name: str) -> None:
    import matplotlib.pyplot as plt
    import xarray as xr

    cfg = STORMS[name]
    before = _disk(f"{name} before")
    t0 = time.perf_counter()
    raw = ea.fetch_box(cfg["start"], cfg["end"], cfg["lat"], cfg["lon"], ("u10", "v10", "msl"), tag=name)
    t_fetch = time.perf_counter() - t0
    nc = ea.storm_product(raw, name, cfg["title"], f"{cfg['start']} to {cfg['end']} UTC, hourly", cfg["region"])
    ds = xr.open_dataset(nc)
    b, j = write_bin_json(ds, HERE / name, ["u10", "v10", "msl", "centre_lat", "centre_lon", "msl_min",
                                            "vt_annulus", "vr_annulus"])
    k = int(np.argmin(ds["msl_min"].values))
    tmin = str(ds.time.values[k])[:16]
    vt = ds["vt_annulus"].values
    vr = ds["vr_annulus"].values
    # vorticity sign at the deepest time from the annulus mean (Stokes: zeta_bar = 2 vt / r)
    w = ea.annulus_winds(ds.u10.values[k], ds.v10.values[k], ds.lat.values, ds.lon.values,
                         float(ds.centre_lat[k]), float(ds.centre_lon[k]))
    spd = np.hypot(ds.u10.values, ds.v10.values)
    res = {"raw": str(raw), "raw_MB": _mb(Path(raw)), "derived": str(nc), "derived_MB": _mb(nc), "bin_MB": _mb(b),
           "json_MB": _mb(j), "fetch_seconds": round(t_fetch, 1),
           "grid": f"0.25 deg, {ds.sizes['lat']} lat x {ds.sizes['lon']} lon", "times": ds.sizes["time"],
           "period": f"{cfg['start']} .. {cfg['end']} UTC hourly",
           "msl_min_hPa": round(float(ds.msl_min[k]) / 100, 1), "msl_min_time": tmin,
           "msl_min_at": [round(float(ds.centre_lat[k]), 2), round(float(ds.centre_lon[k]), 2)],
           "max_10m_speed_ms": round(float(spd.max()), 1),
           "max_10m_speed_time": str(ds.time.values[int(np.argmax(spd.reshape(spd.shape[0], -1).max(1)))])[:16],
           "vt_annulus_50_250km_at_min": round(w["vt"], 1), "vr_annulus_at_min": round(w["vr"], 1),
           "inflow_angle_deg_at_min": round(w["inflow_deg"], 1), "zeta_mean_250km_at_min": float(f"{w['zeta_mean']:.3g}"),
           "sense_at_min": w["sense"], "hours_anticlockwise": int((vt > 0).sum()), "hours_clockwise": int((vt < 0).sum()),
           "hours_inflow": int((vr < 0).sum())}
    every6 = {str(t)[:13]: [round(float(a), 2), round(float(o), 2), round(float(p) / 100, 1)]
              for t, a, o, p in zip(ds.time.values[::6], ds.centre_lat.values[::6], ds.centre_lon.values[::6],
                                    ds.msl_min.values[::6])}
    res["track_6h_lat_lon_hPa"] = every6
    want = "anticlockwise" if cfg["hemi"] == "N" else "clockwise"
    res["pass_sense"] = (res["sense_at_min"] == want) and (res["hours_anticlockwise" if want == "anticlockwise"
                                                                 else "hours_clockwise"] == res["times"])
    res["disk_before"], res["disk_after"] = before, _disk(f"{name} after")
    _save(name, res)
    print(json.dumps(res, indent=1))
    QL.mkdir(parents=True, exist_ok=True)
    fig, axs = plt.subplots(1, 2, figsize=(13, 5.5))
    for ax, kk in zip(axs, [0, k]):
        d = ds.isel(time=kk)
        cs = ax.contourf(d.lon, d.lat, np.hypot(d.u10, d.v10), levels=np.arange(0, 52, 4), cmap="viridis")
        ax.contour(d.lon, d.lat, d.msl / 100, levels=np.arange(900, 1030, 4), colors="w", linewidths=0.6)
        ax.quiver(d.lon[::4], d.lat[::4], d.u10[::4, ::4], d.v10[::4, ::4], scale=600, width=0.002)
        ax.plot(ds.centre_lon, ds.centre_lat, "r-", lw=1)
        ax.set_aspect(1 / np.cos(np.deg2rad(float(d.lat.mean()))))
        ax.set_title(f"{name} {str(d.time.values)[:16]} speed [m/s], MSLP 4 hPa"); fig.colorbar(cs, ax=ax)
    fig.tight_layout(); fig.savefig(QL / f"p_{name}.png", dpi=90); plt.close(fig)


# ------------------------------------------------------------------------------------------------ P4 Ciaran
CIARAN = dict(lat=(35, 70), lon=(-50, 10), sfc_start="2023-11-01T00", sfc_end="2023-11-02T23",
              upper_times=["2023-11-01T12", "2023-11-01T18", "2023-11-02T00", "2023-11-02T06"], levels=[850, 500])


def p4() -> None:
    import matplotlib.pyplot as plt
    import xarray as xr

    from fluidpy.geo.atmos import geostrophic_wind_from_height
    from fluidpy.geo.constants import R_D

    c = CIARAN
    before = _disk("P4 before")
    t0 = time.perf_counter()
    raw_s = ea.fetch_box(c["sfc_start"], c["sfc_end"], c["lat"], c["lon"], ("u10", "v10", "msl", "t2m"),
                         tag="ciaran_2023")
    t1 = time.perf_counter()
    raw_u = ea.fetch_box("", "", c["lat"], c["lon"], ("z", "u", "v"), levels=c["levels"], tag="ciaran_2023",
                         times=c["upper_times"])
    t2 = time.perf_counter()
    reg = "35-70N, 50W-10E (North Atlantic, Bay of Biscay, British Isles)"
    nc_s = ea.box_product(raw_s, "ciaran_2023_sfc", "Storm Ciaran 2023: ERA5 hourly MSLP, 10 m wind, 2 m temperature",
                          f"{c['sfc_start']} to {c['sfc_end']} UTC, hourly", reg)
    nc_u = ea.box_product(raw_u, "ciaran_2023_upper", "Storm Ciaran 2023: ERA5 850 and 500 hPa height and wind",
                          ", ".join(c["upper_times"]) + " UTC", reg)
    s = xr.open_dataset(nc_s)
    u = xr.open_dataset(nc_u)
    s3 = s.isel(time=slice(None, None, 3))
    b1, j1 = write_bin_json(s3, HERE / "ciaran_2023_sfc", ["msl", "u10", "v10"])
    b2, j2 = write_bin_json(u, HERE / "ciaran_2023_upper", ["z", "u", "v"])
    lat, lon = s.lat.values, s.lon.values
    clat, clon, pmin = ea.storm_centre(s.msl.values, lat, lon)
    k = int(np.argmin(pmin))
    res = {"raw_sfc": str(raw_s), "raw_sfc_MB": _mb(Path(raw_s)), "raw_upper": str(raw_u),
           "raw_upper_MB": _mb(Path(raw_u)), "fetch_seconds_sfc": round(t1 - t0, 1),
           "fetch_seconds_upper": round(t2 - t1, 1), "derived_sfc": str(nc_s), "derived_sfc_MB": _mb(nc_s),
           "derived_upper": str(nc_u), "derived_upper_MB": _mb(nc_u), "bin_sfc_MB (3-hourly)": _mb(b1),
           "bin_upper_MB": _mb(b2), "grid": f"0.25 deg, {s.sizes['lat']} x {s.sizes['lon']}",
           "msl_min_hPa": round(float(pmin[k]) / 100, 1), "msl_min_time": str(s.time.values[k])[:16],
           "msl_min_at": [float(clat[k]), float(clon[k])],
           "track_3h": {str(t)[:13]: [float(a), float(o), round(float(p) / 100, 1)] for t, a, o, p in
                        zip(s.time.values[::3], clat[::3], clon[::3], pmin[::3])}}
    # geostrophic vs actual at points around the low, at each upper time
    comp = {}
    for ti in c["upper_times"]:
        ss = s.sel(time=ti)
        uu = u.sel(time=ti)
        cla, clo, pm = ea.storm_centre(ss.msl.values, lat, lon)
        cla, clo = float(cla[0]), float(clo[0])
        rho = ss.msl / (R_D * ss.t2m)                               # near-surface density [kg m-3]
        ug_s, vg_s = geostrophic_wind_from_height(ss.msl.values / (1.0 * ea.G0), lat, lon)  # rho = 1 first
        ug_s, vg_s = ug_s / rho.values, vg_s / rho.values           # then divide by the local density
        out = {"centre": [cla, clo, round(float(pm[0]) / 100, 1)]}
        for lev in (850, 500):
            zl = uu.z.sel(level=lev).values
            ug, vg = geostrophic_wind_from_height(zl, lat, lon)
            uu_l, vv_l = uu.u.sel(level=lev).values, uu.v.sel(level=lev).values
            out[f"{lev}"] = {}
            for lab, (dla, dlo) in {"S flank (-6 deg lat)": (-6, 0), "W flank (-10 deg lon)": (0, -10),
                                    "N flank (+6 deg lat)": (6, 0), "SE (-5, +6)": (-5, 6)}.items():
                pla, plo = cla + dla, clo + dlo
                if not (lat.min() + 1 < pla < lat.max() - 1 and lon.min() + 1 < plo < lon.max() - 1):
                    continue
                j_ = int(np.abs(lat - pla).argmin()); i_ = int(np.abs(lon - plo).argmin())
                # 1x1 deg box mean (5x5 points) to smooth grid noise
                sl = (slice(j_ - 2, j_ + 3), slice(i_ - 2, i_ + 3))
                rec = {"at": [float(lat[j_]), float(lon[i_])],
                       "geo_uv": [round(float(np.nanmean(ug[sl])), 1), round(float(np.nanmean(vg[sl])), 1)],
                       "act_uv": [round(float(np.mean(uu_l[sl])), 1), round(float(np.mean(vv_l[sl])), 1)]}
                if lev == 850:
                    rec["msl_geo_uv"] = [round(float(np.nanmean(ug_s[sl])), 1), round(float(np.nanmean(vg_s[sl])), 1)]
                    rec["10m_uv"] = [round(float(np.mean(ss.u10.values[sl])), 1), round(float(np.mean(ss.v10.values[sl])), 1)]
                    rec["rho_sfc"] = round(float(rho.values[sl].mean()), 3)
                ga, aa = np.array(rec["geo_uv"]), np.array(rec["act_uv"])
                rec["speed_geo_act"] = [round(float(np.hypot(*ga)), 1), round(float(np.hypot(*aa)), 1)]
                rec["angle_act_minus_geo_deg"] = round(float(np.degrees(np.angle(complex(*aa) / complex(*ga)))), 1)
                if lev == 850:
                    gs, a10 = np.array(rec["msl_geo_uv"]), np.array(rec["10m_uv"])
                    rec["speed_mslgeo_10m"] = [round(float(np.hypot(*gs)), 1), round(float(np.hypot(*a10)), 1)]
                    rec["angle_10m_minus_mslgeo_deg"] = round(float(np.degrees(np.angle(complex(*a10) / complex(*gs)))), 1)
                out[f"{lev}"][lab] = rec
        comp[ti] = out
    res["geostrophic_check"] = comp
    res["disk_before"], res["disk_after"] = before, _disk("P4 after")
    _save("P4", res)
    print(json.dumps(res, indent=1))
    QL.mkdir(parents=True, exist_ok=True)
    fig, axs = plt.subplots(1, 2, figsize=(14, 6))
    ti = c["upper_times"][2]
    ss, uu = s.sel(time=ti), u.sel(time=ti, level=850)
    ax = axs[0]
    cs = ax.contourf(lon, lat, np.hypot(ss.u10, ss.v10), levels=np.arange(0, 36, 3), cmap="viridis")
    ax.contour(lon, lat, ss.msl / 100, levels=np.arange(940, 1040, 4), colors="w", linewidths=0.7)
    ax.quiver(lon[::8], lat[::8], ss.u10[::8, ::8], ss.v10[::8, ::8], scale=500, width=0.002)
    ax.set_title(f"Ciaran {ti}: MSLP (4 hPa), 10 m wind [m/s]"); fig.colorbar(cs, ax=ax)
    ax = axs[1]
    ug, vg = geostrophic_wind_from_height(uu.z.values, lat, lon)
    ax.contour(lon, lat, uu.z, levels=np.arange(1000, 1700, 30), colors="k", linewidths=0.7)
    ax.quiver(lon[::8], lat[::8], uu.u[::8, ::8], uu.v[::8, ::8], color="C0", scale=700, width=0.002, label="actual")
    ax.quiver(lon[::8], lat[::8], ug[::8, ::8], vg[::8, ::8], color="C3", scale=700, width=0.002, label="geostrophic")
    ax.legend(loc="lower left"); ax.set_title("850 hPa height (30 m), actual (blue) vs geostrophic (red)")
    for a in axs:
        a.set_aspect(1 / np.cos(np.deg2rad(52)))
    fig.tight_layout(); fig.savefig(QL / "p4_ciaran.png", dpi=90); plt.close(fig)


# ------------------------------------------------------------------------------------------------ P5 globe
def p5() -> None:
    from PIL import Image

    before = _disk("P5 before")
    res = {}
    for kind, outname in (("topography", "globe_bmng_topo_200409_5400x2700.jpg"),
                          ("topography-bathymetry", "globe_bmng_topo_bathy_200409_5400x2700.jpg")):
        p = nasa_bmng.fetch_image(9, kind)
        im = Image.open(p)
        dst = HERE / outname
        shutil.copyfile(p, dst)
        shutil.copyfile(p, DER / outname) if DER.exists() else None
        res[kind] = {"raw": str(p), "size": list(im.size), "MB": _mb(dst), "sha256": fd.sha256(p), "url": nasa_bmng.url(9, kind)}
    lj = naturalearth.polylines_json(HERE / "ne_lines_50m.json", "50m", 2)
    lj110 = naturalearth.polylines_json(HERE / "ne_lines_110m.json", "110m", 2)
    for f in (lj, lj110):
        shutil.copyfile(f, DER / f.name)
    d = json.loads(lj.read_text(encoding="utf-8"))
    res["ne_lines_50m"] = {"path": str(lj), "MB": _mb(lj), "coastline_lines": len(d["coastline"]),
                           "coastline_points": sum(len(x) // 2 for x in d["coastline"]),
                           "border_lines": len(d["borders"]), "border_points": sum(len(x) // 2 for x in d["borders"])}
    res["ne_lines_110m"] = {"path": str(lj110), "MB": _mb(lj110)}
    for f in ("ne_50m_coastline.zip", "ne_110m_coastline.zip", "ne_50m_admin_0_boundary_lines_land.zip",
              "ne_110m_admin_0_boundary_lines_land.zip"):
        res.setdefault("ne_sha256", {})[f] = fd.sha256(fd.data_root() / "raw" / "NE-lines" / f)
    sr = naturalearth.shaded_relief_png(HERE / "globe_ne_shaded_relief_5400x2700.png", 5400)
    shutil.copyfile(sr, DER / sr.name)
    res["ne_relief"] = {"path": str(sr), "MB": _mb(sr), "size": list(Image.open(sr).size),
                        "raw_sha256": fd.sha256(fd.data_root() / "raw" / "NE-SR-50m" / "SR_50M.zip")}
    res["disk_before"], res["disk_after"] = before, _disk("P5 after")
    _save("P5", res)
    print(json.dumps(res, indent=1))
    # quick-look: texture + coastlines overlay (orientation check)
    import matplotlib.pyplot as plt

    QL.mkdir(parents=True, exist_ok=True)
    im = np.asarray(Image.open(HERE / "globe_bmng_topo_200409_5400x2700.jpg").reduce(4))
    fig, ax = plt.subplots(figsize=(12, 6))
    ax.imshow(im, extent=(-180, 180, -90, 90))
    for pl in d["coastline"]:
        a = np.asarray(pl).reshape(-1, 2)
        ax.plot(a[:, 0], a[:, 1], "y-", lw=0.3)
    ax.set_title("BMNG Sept 2004 + NE 50m coastlines (yellow): orientation check")
    fig.tight_layout(); fig.savefig(QL / "p5_globe_overlay.png", dpi=90); plt.close(fig)


if __name__ == "__main__":
    DER.mkdir(parents=True, exist_ok=True)
    jobs = sys.argv[1:] or ["p1", "p2", "p3", "p4", "p5"]
    for jb in jobs:
        {"p1": p1, "p2": lambda: storm("ian_2022"), "p3": lambda: storm("idai_2019"), "p4": p4, "p5": p5}[jb]()
