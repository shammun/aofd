"""NASA GIBS adapter (.venv-maps; open, no key): WMS GetMap in EPSG:4326 for the exact region and size.

Kinds: ``png`` (``gibs.date``), ``timelapse`` (``gibs.dates: {start, stop, step}``; GOES/Himawari GeoColor every
10 min, VIIRS/MODIS daily), ``before_after`` (``gibs.before.date`` / ``gibs.after.date``). Every response is archived
on G: by request hash, so re-renders are offline. GIBS keeps geostationary layers for a rolling window only (fetch at
production time; the archive keeps them). Use GIBS for **true-colour pictures**; its data layers use their own
(often rainbow) palettes: take the data product instead and colour it with cmocean.

    gibs:
      layer: VIIRS_SNPP_CorrectedReflectance_TrueColor   # or MODIS_Terra_CorrectedReflectance_TrueColor,
                                                          # GOES-East_ABI_GeoColor, Himawari_AHI_Band3_Red_Visible_1km
      format: image/jpeg
      date: "2023-11-02"            # or dates: {...}; times allowed for 10-min layers: "2026-10-26T12:00:00Z"
"""
from __future__ import annotations

import sys
import urllib.parse
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import _job  # noqa: E402
import _remote  # noqa: E402

WMS = "https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi"


def get(job, layer: str, date: str, fmt: str, records: list) -> bytes:
    W, H = job["size"]
    b = job["bounds"]
    t = date if "T" in date else date[:10]
    if "T" in t and not t.endswith("Z"):
        t += ":00Z" if t.count(":") == 1 else "Z"
    q = {"SERVICE": "WMS", "REQUEST": "GetMap", "VERSION": "1.3.0", "LAYERS": layer, "STYLES": "",
         "CRS": "EPSG:4326", "BBOX": f"{b[1]},{b[0]},{b[3]},{b[2]}", "WIDTH": W, "HEIGHT": H, "FORMAT": fmt,
         "TIME": t}
    url = WMS + "?" + urllib.parse.urlencode(q)

    def fetch():
        with urllib.request.urlopen(url, timeout=180) as r:
            data = r.read()
            if r.headers.get("Content-Type", "").startswith(("text", "application/vnd.ogc")):
                raise SystemExit(f"GIBS error for {layer} {t}: {data[:300]!r}")
            return data

    return _remote.cached(job, {"url": url}, fetch, "jpg" if "jpeg" in fmt else "png", records).read_bytes()


def main():
    job, tool = _job.load()
    g = job["recipe"]["gibs"]
    fmt = g.get("format", "image/jpeg")
    outs, records = [], []
    for fr, out in zip(job["frames"], job["outputs"]):
        layer = fr.get("layer", g["layer"])
        data = get(job, layer, str(fr.get("date")), fmt, records)
        _remote.draw_overlays(data, job, out, job["size"])
        outs.append(out)
    if job["kind"] == "timelapse" and job["style"].get("mp4"):
        m = _remote.mp4(outs, str(Path(outs[0]).parent.parent / f"{job['recipe']['name']}.mp4"),
                        int(job["style"].get("fps", 4)))
        if m:
            outs.append(m)
    hits = sum(r["cache_hit"] for r in records)
    _job.done(job, tool, "NASA GIBS WMS 1.3.0 (epsg4326/best)", outs,
              [f"{len(records)} request(s), {hits} from the G: archive"])
    import json

    p = Path(job["workdir"], f"result_{tool}.json")
    r = json.loads(p.read_text(encoding="utf-8"))
    r["requests"] = records
    p.write_text(json.dumps(r, indent=1, default=str), encoding="utf-8")


if __name__ == "__main__":
    main()
