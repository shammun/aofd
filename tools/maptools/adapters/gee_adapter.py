"""Google Earth Engine adapter (.venv-maps: earthengine-api + geemap). Needs the USER's authentication.

Project: env ``AOFD_EE_PROJECT`` (default ``uhiphd``, the user's registered Earth Engine Cloud project; not a
secret). ``ee.Initialize(project=...)`` uses the credentials ``earthengine authenticate`` stored in the user's profile
(``%USERPROFILE%\\.config\\earthengine\\``); this adapter never reads, copies or writes that file.

Kinds (recipe ``kind``):
* ``png``          one image (``gee.date``) -> PNG, palette = recipe LUT (cmocean/viridis), our overlays on top.
* ``timelapse``    ``gee.dates: {start, stop, step}`` -> one composite per step (``composite`` over
                   ``[date, date + window]``) -> ``frames/<name>_NNNN.png`` (+ ``<name>.mp4`` if ``style.mp4``).
* ``before_after`` ``gee.before`` / ``gee.after`` (``date`` or ``start``/``stop``) -> two co-registered PNGs with the
                   same region, size and visualisation (+ ``<name>_diff.png`` with ``style.diff``).
* ``timeseries``   ``reduceRegion`` (point / bbox / GeoJSON) per step -> ``<name>.csv`` + ``.parquet`` + a quick
                   chart PNG; ``geometry.geojson`` with several features -> one column per feature (``name`` prop).
Every server response (thumbnail PNG or getInfo JSON) is archived on G: by request hash (``_remote.cached``), so a
re-render never hits the network; the sidecar lists each request, cache hit/miss and sha256.

Recipe block::

    gee:
      asset: NOAA/CDR/OISST/V2_1       # ImageCollection (collection: false for an Image)
      band: sst                         # or rgb: [b1, b2, b3] for true colour
      scale: 0.01                       # value * scale + offset, server-side
      offset: 0
      composite: mean                   # first | mean | median | max | min (per window)
      window: "1 month"                 # composite window (default = the step, or "1 hour" for a single date)
      dates: {start: 2023-06-01, stop: 2024-03-01, step: "1 month"}
      reducer: mean                     # timeseries: mean | median | sum | min | max
      scale_m: 25000                    # timeseries: reduceRegion scale in metres
      geometry: {bbox: [-170, -5, -120, 5]}   # or {point: [lon, lat]} or {geojson: path}
"""
from __future__ import annotations

import json
import os
import sys
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import _job  # noqa: E402
import _remote  # noqa: E402

DEFAULT_PROJECT = "uhiphd"


def init():
    import ee

    project = os.environ.get("AOFD_EE_PROJECT", DEFAULT_PROJECT)
    try:
        ee.Initialize(project=project)
    except Exception as e:  # noqa: BLE001
        raise SystemExit(f"GEE not initialised for project '{project}': {e}\n"
                         f"The user must run once:  .venv-maps\\Scripts\\earthengine.exe authenticate")
    return ee, project


def _advance(ee, d, window: str):
    n, unit = window.split()
    unit = unit.rstrip("s")
    return ee.Date(d).advance(float(n), unit)


def window_of(g: dict, fr: dict) -> tuple[str, str | None, str]:
    if fr.get("start"):
        return fr["start"], fr.get("stop"), ""
    d = fr.get("date") or g.get("date")
    w = fr.get("window") or g.get("window")
    if not w and isinstance(g.get("dates"), dict):
        w = g["dates"].get("step")
    return d, None, w or "1 hour"


def image_for(ee, g: dict, fr: dict):
    if not g.get("collection", True):
        img = ee.Image(g["asset"])
    else:
        start, stop, w = window_of(g, fr)
        t0 = ee.Date(start)
        t1 = ee.Date(stop) if stop else _advance(ee, start, w)
        col = ee.ImageCollection(g["asset"]).filterDate(t0, t1)
        if g.get("filter_lt"):                       # e.g. {CLOUDY_PIXEL_PERCENTAGE: 30}
            for k, v in g["filter_lt"].items():
                col = col.filter(ee.Filter.lt(k, v))
        comp = g.get("composite", "first")
        img = {"first": lambda c: c.first(), "mean": lambda c: c.mean(), "median": lambda c: c.median(),
               "max": lambda c: c.max(), "min": lambda c: c.min(), "mosaic": lambda c: c.mosaic()}[comp](col)
    if g.get("rgb"):
        return img.select(g["rgb"])
    return img.select([g["band"]]).multiply(float(g.get("scale", 1))).add(float(g.get("offset", 0)))


def thumb(ee, job, img, records, tag: str, palette=None, vmin=None, vmax=None) -> bytes:
    g = job["recipe"]["gee"]
    W, H = job["size"]
    b = job["bounds"]
    vis = {"min": job["vmin"] if vmin is None else vmin, "max": job["vmax"] if vmax is None else vmax}
    if not g.get("rgb"):
        vis["palette"] = [c.lstrip("#") for c in (palette or job["lut"])]
    if g.get("gamma"):
        vis["gamma"] = g["gamma"]
    request = {"asset": g["asset"], "band": g.get("band") or g.get("rgb"), "scale": g.get("scale", 1),
               "offset": g.get("offset", 0), "composite": g.get("composite", "first"), "frame": tag,
               "filter_lt": g.get("filter_lt"), "bounds": b, "size": [W, H], "vis": vis, "crs": "EPSG:4326"}

    def fetch():
        region = ee.Geometry.Rectangle([b[0], b[1], b[2], b[3]], "EPSG:4326", False)
        url = img.getThumbURL({**vis, "region": region, "dimensions": f"{W}x{H}", "crs": "EPSG:4326",
                               "format": "png"})
        with urllib.request.urlopen(url, timeout=300) as r:
            return r.read()

    return _remote.cached(job, request, fetch, "png", records).read_bytes()


def geometry(ee, spec: dict):
    if "point" in spec:
        return {"_": ee.Geometry.Point(spec["point"])}
    if "bbox" in spec:
        return {"_": ee.Geometry.Rectangle(spec["bbox"], "EPSG:4326", False)}
    gj = json.loads(Path(spec["geojson"]).read_text(encoding="utf-8"))
    out = {}
    for i, ft in enumerate(gj["features"]):
        out[str(ft.get("properties", {}).get("name", i))] = ee.Geometry(ft["geometry"])
    return out


def timeseries(ee, job, out_csv: str, records: list) -> list[str]:
    import pandas as pd

    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
    from prep import expand_dates

    g = job["recipe"]["gee"]
    starts = expand_dates(g["dates"])
    step = g["dates"].get("step", "1 month") if isinstance(g["dates"], dict) else "1 month"
    geoms = geometry(ee, g["geometry"])
    red = {"mean": ee.Reducer.mean(), "median": ee.Reducer.median(), "sum": ee.Reducer.sum(),
           "min": ee.Reducer.min(), "max": ee.Reducer.max()}[g.get("reducer", "mean")]
    request = {"asset": g["asset"], "band": g["band"], "scale": g.get("scale", 1), "offset": g.get("offset", 0),
               "composite": g.get("composite", "mean"), "starts": starts, "step": step,
               "geometry": g["geometry"], "reducer": g.get("reducer", "mean"), "scale_m": g.get("scale_m", 10000)}

    def fetch():
        feats = []
        for s in starts:
            img = image_for(ee, {**g, "window": step}, {"date": s})
            props = {"start": s}
            for name, geom in geoms.items():
                v = img.reduceRegion(red, geom, float(g.get("scale_m", 10000)), bestEffort=True,
                                     maxPixels=1e9).get(g["band"])
                props["value" if name == "_" else f"value_{name}"] = v
            feats.append(ee.Feature(None, props))
        info = ee.FeatureCollection(feats).getInfo()
        return json.dumps([f["properties"] for f in info["features"]]).encode()

    rows = json.loads(_remote.cached(job, request, fetch, "json", records).read_text(encoding="utf-8"))
    df = pd.DataFrame(rows)
    cols = ["start"] + sorted(c for c in df.columns if c.startswith("value"))
    df = df[cols]
    df["units"] = job["units"]
    for k in ("asset", "band", "reducer", "scale_m"):
        df[k] = request[k]
    df.to_csv(out_csv, index=False, lineterminator="\n")
    pq = str(Path(out_csv).with_suffix(".parquet"))
    df.to_parquet(pq, index=False)
    png = str(Path(out_csv).with_name(Path(out_csv).stem + "_chart.png"))
    _remote.chart(out_csv, png, f"{g['asset']} {g['band']} ({request['reducer']})", job["units"], job["size"])
    return [out_csv, pq, png]


def main():
    job, tool = _job.load()
    ee, project = init()
    g = job["recipe"]["gee"]
    kind = job["kind"]
    st = job["style"]
    outs, records, notes = [], [], []
    if kind == "timeseries":
        outs = timeseries(ee, job, job["outputs"][0], records)
    else:
        imgs = []
        for fr, out in zip(job["frames"], job["outputs"]):
            img = image_for(ee, g, fr)
            imgs.append(img)
            data = thumb(ee, job, img, records, fr["label"])
            _remote.draw_overlays(data, job, out, job["size"])
            outs.append(out)
        if kind == "before_after" and st.get("diff"):
            d = imgs[1].subtract(imgs[0])
            lo, hi = st.get("diff_range", [-(job["vmax"] - job["vmin"]) / 2, (job["vmax"] - job["vmin"]) / 2])
            sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
            from prep import lut

            data = thumb(ee, job, d, records, "diff", palette=lut(st.get("diff_cmap", "cmocean.balance"), 64),
                         vmin=lo, vmax=hi)
            dp = str(Path(outs[0]).with_name(Path(outs[0]).stem.replace("_before", "") + "_diff.png"))
            _remote.draw_overlays(data, job, dp, job["size"])
            outs.append(dp)
        if kind == "timelapse" and st.get("mp4"):
            m = _remote.mp4(outs, str(Path(outs[0]).parent.parent / f"{job['recipe']['name']}.mp4"),
                            int(st.get("fps", 4)))
            if m:
                outs.append(m)
    hits = sum(r["cache_hit"] for r in records)
    notes.append(f"{len(records)} server request(s), {hits} from the G: archive; credit Google Earth Engine + the "
                 f"dataset provider")
    res_extra = {"requests": records}
    _job.done(job, tool, f"earthengine-api {ee.__version__} (project {project})", outs, notes)
    p = Path(job["workdir"], f"result_{tool}.json")
    r = json.loads(p.read_text(encoding="utf-8"))
    r.update(res_extra)
    p.write_text(json.dumps(r, indent=1, default=str), encoding="utf-8")


if __name__ == "__main__":
    main()
