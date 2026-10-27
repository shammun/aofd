"""STAC / COG adapter (.venv-maps: pystac-client + rasterio): Sentinel-2 / Landsat scenes from open catalogues.

Default catalogue: Element 84 **Earth Search** (``https://earth-search.aws.element84.com/v1``; anonymous, public COGs on AWS).
Planetary Computer also works (``api: https://planetarycomputer.microsoft.com/api/stac/v1``, ``sign: planetary``;
needs ``pip install planetary-computer`` for anonymous URL signing; not installed by default).

For each frame (``date`` + ``window``, or ``start``/``stop``) the adapter searches the collection over the region,
keeps items under ``max_cloud`` %, sorts by cloud cover, and warps the best items' ``asset`` (default ``visual``,
an 8-bit RGB COG) onto one EPSG:4326 grid of exactly ``size`` pixels (GDAL picks the COG overview), filling gaps
from the next item. The result (and the chosen item ids) is archived on G: by request hash -> offline re-renders.
Kinds: ``png``, ``timelapse``, ``before_after``.

    stac:
      api: https://earth-search.aws.element84.com/v1
      catalog: earth-search
      collection: sentinel-2-l2a
      asset: visual
      max_cloud: 20
      before: {start: 2023-08-20, stop: 2023-09-08}
      after:  {start: 2023-09-12, stop: 2023-09-30}
"""
from __future__ import annotations

import io
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import _job  # noqa: E402
import _remote  # noqa: E402

import numpy as np  # noqa: E402


def window(fr: dict, g: dict) -> str:
    import datetime as dt

    if fr.get("start"):
        return f"{fr['start']}/{fr.get('stop', fr['start'])}"
    d = dt.date.fromisoformat(str(fr["date"])[:10])
    n = int(str(fr.get("window") or g.get("window", "10 day")).split()[0])
    return f"{d.isoformat()}/{(d + dt.timedelta(days=n)).isoformat()}"


def render_window(job, g, win: str, records: list) -> bytes:
    import rasterio
    from PIL import Image
    from pystac_client import Client
    from rasterio.enums import Resampling
    from rasterio.transform import from_bounds
    from rasterio.vrt import WarpedVRT

    W, H = job["size"]
    b = job["bounds"]
    request = {"api": g["api"], "collection": g["collection"], "asset": g.get("asset", "visual"), "bbox": b,
               "datetime": win, "max_cloud": g.get("max_cloud", 20), "size": [W, H], "max_items": g.get("max_items", 6)}

    def fetch():
        cat = Client.open(g["api"])
        items = list(cat.search(collections=[g["collection"]], bbox=b, datetime=win,
                                query={"eo:cloud_cover": {"lt": request["max_cloud"]}}, max_items=200).items())
        items.sort(key=lambda it: (it.properties.get("eo:cloud_cover", 100), it.id))
        if not items:
            raise SystemExit(f"no {g['collection']} items in {win} under {request['max_cloud']}% cloud")
        dst = np.zeros((3, H, W), dtype=np.uint8)
        filled = np.zeros((H, W), dtype=bool)
        used = []
        tr = from_bounds(*b, W, H)
        for it in items[: request["max_items"]]:
            href = it.assets[request["asset"]].href
            if g.get("sign") == "planetary":
                import planetary_computer

                href = planetary_computer.sign(href)
            with rasterio.Env(GDAL_DISABLE_READDIR_ON_OPEN="EMPTY_DIR", AWS_NO_SIGN_REQUEST="YES"):
                with rasterio.open(href) as src, WarpedVRT(src, crs="EPSG:4326", transform=tr, width=W, height=H,
                                                           resampling=Resampling.bilinear) as vrt:
                    a = vrt.read([1, 2, 3])
            m = (a.max(0) > 0) & ~filled
            dst[:, m] = a[:, m]
            filled |= m
            used.append({"id": it.id, "cloud": it.properties.get("eo:cloud_cover"), "datetime": str(it.datetime)})
            if filled.mean() > 0.995:
                break
        buf = io.BytesIO()
        Image.fromarray(np.moveaxis(dst, 0, -1), "RGB").save(buf, "PNG")
        (Path(job["archive"]) / "items_last.json").write_text(json.dumps(used, indent=1), encoding="utf-8")
        request["_items"] = used
        return buf.getvalue()

    return _remote.cached(job, request, fetch, "png", records).read_bytes()


def main():
    job, tool = _job.load()
    g = job["recipe"]["stac"]
    outs, records = [], []
    Path(job["archive"]).mkdir(parents=True, exist_ok=True)
    for fr, out in zip(job["frames"], job["outputs"]):
        data = render_window(job, g, window(fr, g), records)
        _remote.draw_overlays(data, job, out, job["size"])
        outs.append(out)
    if job["kind"] == "timelapse" and job["style"].get("mp4"):
        m = _remote.mp4(outs, str(Path(outs[0]).parent.parent / f"{job['recipe']['name']}.mp4"),
                        int(job["style"].get("fps", 4)))
        if m:
            outs.append(m)
    import importlib.metadata as md

    _job.done(job, tool, f"pystac-client {md.version('pystac-client')}, rasterio {md.version('rasterio')}", outs,
              [f"{len(records)} window(s), {sum(r['cache_hit'] for r in records)} from the G: archive"])
    p = Path(job["workdir"], f"result_{tool}.json")
    r = json.loads(p.read_text(encoding="utf-8"))
    r["requests"] = records
    p.write_text(json.dumps(r, indent=1, default=str), encoding="utf-8")


if __name__ == "__main__":
    main()
