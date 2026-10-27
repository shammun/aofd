"""leafmap adapter (.venv-maps): leafmap.foliumap (Leaflet) -> HTML -> headless Chromium screenshot.

No basemap tiles: the prepared coloured field is an ImageOverlay (embedded as a data URL), contours and overlays are
GeoJSON layers. Leaflet/folium JS and CSS come from the public CDNs folium pins (library code, not data); every other
remote request (tile servers, fonts) is aborted and listed in the notes. Web Mercator only (Leaflet). Best use:
quick interactive previews and HTML maps for notebooks; for final frames prefer MapLibre/deck.gl/cartopy.
"""
from __future__ import annotations

import json
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import _job  # noqa: E402

LIB_HOSTS = ("cdn.jsdelivr.net", "cdnjs.cloudflare.com", "unpkg.com", "code.jquery.com", "netdna.bootstrapcdn.com",
             "maxcdn.bootstrapcdn.com", "rawcdn.githack.com")


from _browser import check_renderer, launch, mode  # noqa: E402


def main():
    job, tool = _job.load()
    import folium
    import leafmap.foliumap as lf
    from playwright.sync_api import sync_playwright

    W, H = job["size"]
    b = job["bounds"]
    lat = lambda v: max(-85.0, min(85.0, v))  # noqa: E731
    work = Path(job["workdir"]) / "leafmap"
    work.mkdir(exist_ok=True)
    outs, notes, blocked = [], [], []
    st = job["style"]
    c = st.get("contours") or {}
    with sync_playwright() as pw:
        br = launch(pw)
        for i, (fr, out) in enumerate(zip(job["frames"], job["outputs"])):
            m = lf.Map(center=[(b[1] + b[3]) / 2, (b[0] + b[2]) / 2], zoom=3, tiles=None, draw_control=False,
                       measure_control=False, fullscreen_control=False, attribution_control=False,
                       search_control=False, layers_control=False, scale_control=False, zoom_control=False,
                       toolbar_control=False, locate_control=False)
            import numpy as np
            from PIL import Image

            img = np.asarray(Image.open(fr["rgba_png"]).convert("RGBA"))
            ys = np.linspace(b[3], b[1], img.shape[0])
            img = img[(ys <= 85.0) & (ys >= -85.0)]      # Web Mercator cannot show the poles
            folium.raster_layers.ImageOverlay(img, bounds=[[lat(b[1]), b[0]], [lat(b[3]), b[2]]], opacity=1.0,
                                              mercator_project=True).add_to(m)
            if fr.get("contours"):
                folium.GeoJson(json.loads(Path(fr["contours"]).read_text(encoding="utf-8")),
                               style_function=lambda f: {"color": c.get("color", "#222222"),
                                                         "weight": float(c.get("width", 0.8)) * 1.2}).add_to(m)
            if job.get("overlays"):
                folium.GeoJson(json.loads(Path(job["overlays"]).read_text(encoding="utf-8")),
                               style_function=lambda f: {"color": "#1a1a1a", "weight": 0.8, "fill": False,
                                                         "dashArray": "4 3" if f["properties"].get("kind") == "borders"
                                                         else None}).add_to(m)
            m.fit_bounds([[lat(b[1]), b[0]], [lat(b[3]), b[2]]], padding=(4, 4))
            html = work / f"map_{i:04d}.html"
            m.save(str(html))
            ctx = br.new_context(viewport={"width": W, "height": H}, device_scale_factor=1)
            pg = ctx.new_page()

            def route(r, _b=blocked):
                u = r.request.url
                if u.startswith(("file:", "data:", "blob:")) or any(h in u for h in LIB_HOSTS):
                    return r.continue_()
                _b.append(u)
                return r.abort()

            pg.route("**/*", route)
            pg.goto(html.as_uri(), wait_until="networkidle")
            renderer = check_renderer(pg)
            pg.wait_for_timeout(800)              # Leaflet has no idle event for overlays: settle time
            pg.screenshot(path=out, full_page=False)
            outs.append(out)
            ctx.close()
        br.close()
    if blocked:
        notes.append(f"blocked {len(blocked)} non-library request(s): {sorted(set(blocked))[:5]}")
    import importlib.metadata as md

    notes.append(f"WebGL renderer: {renderer} (mode {mode()})")
    _job.done(job, tool, f"leafmap {md.version('leafmap')}, folium {folium.__version__}; GL {mode()}: {renderer}",
              outs, notes)


if __name__ == "__main__":
    main()
