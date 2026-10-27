"""Headless-browser adapter for MapLibre GL JS, deck.gl and CesiumJS (runs in the project .venv: Playwright Chromium).

Pattern ("wait until idle, then screenshot"):
1. a tiny local HTTP server serves ``/lib/`` = ``tools/maptools/js/node_modules`` and ``/work/`` = the job work dir;
2. every request that is not to 127.0.0.1 is **aborted** and logged (so no remote tiles, fonts or workers can sneak
   into a frame; the sidecar lists any blocked URL);
3. Remotion's chrome-headless-shell on the GPU (``--use-angle=d3d11``, RTX A1000; ``_browser.py``) at device scale
   1; the WebGL renderer string goes in the sidecar; a software renderer fails loudly (no silent SwiftShader);
4. the page sets ``window.__ready = true`` when the library says it is idle (MapLibre ``idle``; deck.gl
   ``onAfterRender`` with all layers loaded; Cesium ``globe.tilesLoaded`` for 10 consecutive frames), then two more
   animation frames pass and ``#map`` is screenshotted.
Only our prepared data are drawn: the coloured field (``rgba_*.png``), hillshade, contour and overlay GeoJSON, and for
3-D the Terrarium heightmap (deck.gl TerrainLayer) or a custom heightmap provider (Cesium, no Ion token).
"""
from __future__ import annotations

import functools
import http.server
import json
import socketserver
import sys
import threading
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import _job  # noqa: E402

LIB = Path(__file__).resolve().parents[1] / "js" / "node_modules"

COMMON_CSS = "html,body{margin:0;padding:0;background:#fff;overflow:hidden}#map{position:absolute;inset:0}"

MAPLIBRE = """<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="/lib/maplibre-gl/dist/maplibre-gl.css"><style>%CSS%
.maplibregl-ctrl-attrib,.maplibregl-ctrl-logo{display:none!important}</style></head>
<body><div id="map"></div><script type="module">
import * as maplibregl from '/lib/maplibre-gl/dist/maplibre-gl.mjs';
const J = %JOB%;
const b = J.bounds, lat = v => Math.max(-85, Math.min(85, v));
const coords = [[b[0], lat(b[3])], [b[2], lat(b[3])], [b[2], lat(b[1])], [b[0], lat(b[1])]];
const sources = {field: {type: 'image', url: J.rgba, coordinates: coords}};
const layers = [{id: 'bg', type: 'background', paint: {'background-color': '#ffffff'}},
                {id: 'field', type: 'raster', source: 'field', paint: {'raster-fade-duration': 0, 'raster-resampling': 'linear'}}];
if (J.shade) { sources.shade = {type: 'image', url: J.shade, coordinates: coords};
  layers.push({id: 'shade', type: 'raster', source: 'shade', paint: {'raster-opacity': J.shade_alpha, 'raster-fade-duration': 0}}); }
if (J.contours) { sources.contours = {type: 'geojson', data: J.contours};
  layers.push({id: 'contours', type: 'line', source: 'contours', paint: {'line-color': J.ccolor, 'line-width': J.cwidth}}); }
if (J.overlays) { sources.ov = {type: 'geojson', data: J.overlays};
  layers.push({id: 'coast', type: 'line', source: 'ov', filter: ['!=', ['get', 'kind'], 'borders'], paint: {'line-color': '#1a1a1a', 'line-width': 0.7}});
  layers.push({id: 'borders', type: 'line', source: 'ov', filter: ['==', ['get', 'kind'], 'borders'], paint: {'line-color': '#4d4d4d', 'line-width': 0.5, 'line-dasharray': [3, 2]}}); }
const style = {version: 8, sources, layers, projection: {type: J.globe ? 'globe' : 'mercator'}};
const map = new maplibregl.Map({container: 'map', style, attributionControl: false, interactive: false,
  fadeDuration: 0, preserveDrawingBuffer: true, pixelRatio: 1, center: [J.lon0, J.lat0], zoom: 1,
  pitch: J.pitch, bearing: J.bearing, maxPitch: 85});
map.on('error', e => { window.__errors = (window.__errors || []).concat(String(e.error && e.error.message)); });
map.once('load', () => {
  if (J.globe) { map.jumpTo({center: [J.lon0, J.lat0], zoom: J.zoom ?? 1.2}); }
  else { map.fitBounds([[b[0], lat(b[1])], [b[2], lat(b[3])]], {padding: 4, animate: false, pitch: J.pitch, bearing: J.bearing}); }
  map.once('idle', () => requestAnimationFrame(() => requestAnimationFrame(() => { window.__ready = true; })));
});
</script></body></html>"""

DECKGL = """<!doctype html><html><head><meta charset="utf-8"><style>%CSS%</style>
<script src="/lib/deck.gl/dist.min.js"></script></head><body><div id="map"></div><script>
const J = %JOB%;
const b = J.bounds;
let pending = 0;
const layers = [];
const done = () => {};
if (J.terrain) {
  layers.push(new deck.TerrainLayer({id: 'terrain', minZoom: 0, maxZoom: 0, elevationData: J.terrain, texture: J.rgba,
    bounds: [b[0], b[1], b[2], b[3]], meshMaxError: J.meshMaxError,
    elevationDecoder: {rScaler: 256 * J.exag, gScaler: 1 * J.exag, bScaler: J.exag / 256, offset: -32768 * J.exag},
    loadOptions: {worker: true, terrain: {skirtHeight: 0, workerUrl: '/lib/@loaders.gl/terrain/dist/terrain-worker.js'}},
    color: [255, 255, 255]}));
} else {
  layers.push(new deck.BitmapLayer({id: 'field', image: J.rgba, bounds: [b[0], Math.max(b[1], -85), b[2], Math.min(b[3], 85)],
    loadOptions: {worker: false}}));
  if (J.shade) layers.push(new deck.BitmapLayer({id: 'shade', image: J.shade, opacity: J.shade_alpha,
    bounds: [b[0], Math.max(b[1], -85), b[2], Math.min(b[3], 85)], loadOptions: {worker: false}}));
}
const rgb = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
if (J.contours) layers.push(new deck.GeoJsonLayer({id: 'contours', data: J.contours, stroked: true, filled: false,
  getLineColor: rgb(J.ccolor), getLineWidth: J.cwidth, lineWidthUnits: 'pixels', loadOptions: {worker: false}}));
if (J.overlays) layers.push(new deck.GeoJsonLayer({id: 'ov', data: J.overlays, stroked: true, filled: false,
  getLineColor: f => f.properties.kind === 'borders' ? [77, 77, 77] : [26, 26, 26], getLineWidth: 0.8,
  lineWidthUnits: 'pixels', loadOptions: {worker: false}}));
const W = J.W, H = J.H;
let viewState;
if (J.globe) {
  viewState = {longitude: J.lon0, latitude: J.lat0, zoom: J.zoom ?? 0.3};
} else {
  const vp = new deck.WebMercatorViewport({width: W, height: H});
  const f = vp.fitBounds([[b[0], Math.max(b[1], -85)], [b[2], Math.min(b[3], 85)]], {padding: 4});
  viewState = {longitude: f.longitude, latitude: f.latitude, zoom: f.zoom + (J.zoomOffset || 0), pitch: J.pitch, bearing: J.bearing};
}
let stable = 0;
const d = new deck.Deck({parent: document.getElementById('map'), width: W, height: H, useDevicePixels: 1,
  views: J.globe ? new deck._GlobeView({resolution: 5}) : new deck.MapView({}), initialViewState: viewState,
  controller: false, layers, glOptions: {preserveDrawingBuffer: true},
  onError: e => { window.__errors = (window.__errors || []).concat(String(e && e.message)); },
  onAfterRender: () => {
    const ok = d.props.layers.every(l => l.isLoaded);
    stable = ok ? stable + 1 : 0;
    if (stable >= 3 && !window.__ready) requestAnimationFrame(() => requestAnimationFrame(() => { window.__ready = true; }));
  }});
setInterval(() => { if (!window.__ready) d.redraw(true); }, 100);
</script></body></html>"""

CESIUM = """<!doctype html><html><head><meta charset="utf-8">
<script>window.CESIUM_BASE_URL = '/lib/cesium/Build/Cesium/';</script>
<script src="/lib/cesium/Build/Cesium/Cesium.js"></script>
<link rel="stylesheet" href="/lib/cesium/Build/Cesium/Widgets/widgets.css">
<style>%CSS% .cesium-viewer-bottom,.cesium-widget-credits{display:none!important}</style></head>
<body><div id="map"></div><script>
(async () => {
const J = %JOB%;
Cesium.Ion.defaultAccessToken = '';                       // no Ion: nothing is fetched from Cesium servers
const b = J.bounds;
let terrainProvider = new Cesium.EllipsoidTerrainProvider();
if (J.heights) {
  const buf = await (await fetch(J.heights)).arrayBuffer();
  const Z = new Float32Array(buf), nx = J.nx, ny = J.ny;      // row 0 = south
  const sample = (lon, lat) => {
    const fx = (lon - J.lon_first) / J.dlon, fy = (lat - J.lat_first) / J.dlat;
    if (fx < 0 || fy < 0 || fx > nx - 1 || fy > ny - 1) return 0;
    const i = Math.min(Math.floor(fx), nx - 2), j = Math.min(Math.floor(fy), ny - 2), u = fx - i, v = fy - j;
    const z = (1 - u) * (1 - v) * Z[j * nx + i] + u * (1 - v) * Z[j * nx + i + 1] + (1 - u) * v * Z[(j + 1) * nx + i] + u * v * Z[(j + 1) * nx + i + 1];
    return (isFinite(z) ? Math.max(z, 0) : 0) * J.exag;
  };
  const S = 65;
  terrainProvider = new Cesium.CustomHeightmapTerrainProvider({width: S, height: S, callback: (x, y, level) => {
    const r = new Cesium.GeographicTilingScheme().tileXYToRectangle(x, y, level);
    const out = new Float32Array(S * S);
    for (let jj = 0; jj < S; jj++) for (let ii = 0; ii < S; ii++) {
      const lon = Cesium.Math.toDegrees(r.west + (r.east - r.west) * ii / (S - 1));
      const lat = Cesium.Math.toDegrees(r.north - (r.north - r.south) * jj / (S - 1));
      out[jj * S + ii] = sample(lon, lat);
    }
    return out; }});
}
const viewer = new Cesium.Viewer('map', {baseLayer: false, baseLayerPicker: false, geocoder: false, homeButton: false,
  sceneModePicker: false, navigationHelpButton: false, animation: false, timeline: false, fullscreenButton: false,
  infoBox: false, selectionIndicator: false, terrainProvider, skyBox: false, skyAtmosphere: false,
  contextOptions: {webgl: {preserveDrawingBuffer: true}}, requestRenderMode: false, msaaSamples: 1});
viewer.scene.backgroundColor = Cesium.Color.WHITE;
viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#dddddd');
viewer.scene.globe.showGroundAtmosphere = false;
viewer.scene.fog.enabled = false;
if (viewer.scene.sun) viewer.scene.sun.show = false; if (viewer.scene.moon) viewer.scene.moon.show = false;
viewer.scene.globe.enableLighting = false;
viewer.clock.shouldAnimate = false;
viewer.clock.currentTime = Cesium.JulianDate.fromIso8601('2023-11-02T12:00:00Z');
const rect = Cesium.Rectangle.fromDegrees(b[0], Math.max(b[1], -90), b[2], Math.min(b[3], 90));
viewer.imageryLayers.add(Cesium.ImageryLayer.fromProviderAsync(Cesium.SingleTileImageryProvider.fromUrl(J.rgba, {rectangle: rect})));
if (J.shade) { const l = Cesium.ImageryLayer.fromProviderAsync(Cesium.SingleTileImageryProvider.fromUrl(J.shade, {rectangle: rect})); l.alpha = J.shade_alpha; viewer.imageryLayers.add(l); }
const lines = async (url, color, width) => {
  const ds = await Cesium.GeoJsonDataSource.load(url, {stroke: Cesium.Color.fromCssColorString(color), strokeWidth: width, clampToGround: false});
  viewer.dataSources.add(ds); };
if (J.contours) await lines(J.contours, J.ccolor, J.cwidth);
if (J.overlays) await lines(J.overlays, '#1a1a1a', 1);
if (J.camera) {
  const c = J.camera;
  viewer.camera.setView({destination: Cesium.Cartesian3.fromDegrees(c.lon, c.lat, c.height),
    orientation: {heading: Cesium.Math.toRadians(c.heading), pitch: Cesium.Math.toRadians(c.pitch), roll: 0}});
} else if (J.globe) {
  viewer.camera.setView({destination: Cesium.Cartesian3.fromDegrees(J.lon0, J.lat0, J.height ?? 1.25e7)});
} else {
  viewer.camera.setView({destination: rect});
}
let stable = 0;
viewer.scene.postRender.addEventListener(() => {
  stable = (viewer.scene.globe.tilesLoaded && viewer.dataSourceDisplay.ready) ? stable + 1 : 0;
  if (stable >= 30) window.__ready = true;
});
})().catch(e => { window.__errors = [String(e)]; window.__ready = true; });
</script></body></html>"""


from _browser import check_renderer, launch, mode  # noqa: E402


class _Handler(http.server.SimpleHTTPRequestHandler):
    roots: dict[str, Path] = {}
    pages: dict[str, str] = {}

    def translate_path(self, path):
        path = path.split("?", 1)[0]
        for pre, root in self.roots.items():
            if path.startswith(pre):
                return str(root / path[len(pre):].lstrip("/"))
        return str(Path(self.roots["/work/"]) / "__nope__")

    def do_GET(self):
        p = self.path.split("?", 1)[0]
        if p in self.pages:
            body = self.pages[p].encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        return super().do_GET()

    def log_message(self, *a):
        pass

    def guess_type(self, path):
        if str(path).endswith(".mjs"):
            return "text/javascript"
        return super().guess_type(path)


def serve(work: Path):
    _Handler.roots = {"/lib/": LIB, "/work/": work}
    srv = socketserver.ThreadingTCPServer(("127.0.0.1", 0), _Handler)
    srv.daemon_threads = True
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, srv.server_address[1]


def page_config(job, fr, tool, work: Path, i: int) -> dict:
    W, H = job["size"]
    p = _job.proj(job)
    st = job["style"]
    c = st.get("contours") or {}
    cam = job.get("camera") or {}
    rel = lambda x: "/work/" + Path(x).relative_to(work).as_posix() if x else None  # noqa: E731
    cfg = {"W": W, "H": H, "bounds": job["bounds"], "rgba": rel(fr["rgba_png"]), "shade": rel(fr.get("shade_png")),
           "shade_alpha": float(st.get("shade_alpha", 0.35)), "contours": rel(fr.get("contours")),
           "overlays": rel(job.get("overlays")), "ccolor": c.get("color", "#222222"),
           "cwidth": float(c.get("width", 0.8)) * 1.2, "lon0": p["lon0"], "lat0": p["lat0"],
           "globe": p["name"].lower() in ("orthographic", "ortho", "globe"), "zoom": p.get("zoom"),
           "pitch": float(90 - cam["elevation"]) if cam else 0.0,
           "bearing": float((cam.get("azimuth", 180) + 180) % 360) if cam else 0.0,
           "exag": float(cam.get("exaggeration", 1)) if cam else 1.0, "meshMaxError": 20, "zoomOffset": cam.get("zoom_offset", 0)}
    if tool == "deckgl" and cam and fr.get("terrarium_png"):
        cfg["terrain"] = rel(fr["terrarium_png"])
    if tool == "cesium" and cam:
        import numpy as np
        import xarray as xr

        f = xr.open_dataset(fr["nc"])["field"]
        hb = work / f"heights_{i:04d}.bin"
        np.asarray(f.values, dtype="<f4").tofile(hb)
        lon, lat = f.lon.values, f.lat.values
        cfg.update({"heights": rel(str(hb)), "nx": int(lon.size), "ny": int(lat.size), "lon_first": float(lon[0]),
                    "lat_first": float(lat[0]), "dlon": float(lon[1] - lon[0]), "dlat": float(lat[1] - lat[0])})
        b = job["bounds"]
        import math

        az = float(cam.get("azimuth", 170))
        dist_deg = float(cam.get("distance_deg", (b[3] - b[1]) * 1.1))
        clat = (b[1] + b[3]) / 2 - dist_deg * math.cos(math.radians(az - 180)) * 0.8
        clon = (b[0] + b[2]) / 2 - dist_deg * math.sin(math.radians(az - 180)) * 0.8 / max(math.cos(math.radians(clat)), .2)
        cfg["camera"] = {"lon": cam.get("lon", clon), "lat": cam.get("lat", clat),
                         "height": float(cam.get("height_m", (b[3] - b[1]) * 111_000 * 0.8)), "heading": (az + 180) % 360,
                         "pitch": -float(cam.get("elevation", 35))}
    return cfg


def main():
    job, tool = _job.load()
    from playwright.sync_api import sync_playwright

    work = Path(job["workdir"])
    W, H = job["size"]
    tmpl = {"maplibre": MAPLIBRE, "deckgl": DECKGL, "cesium": CESIUM}[tool]
    srv, port = serve(work)
    outs, notes, blocked = [], [], []
    versions = {}
    for name in ("maplibre-gl", "deck.gl", "cesium"):
        pj = LIB / name / "package.json"
        if pj.exists():
            versions[name] = json.loads(pj.read_text(encoding="utf-8"))["version"]
    try:
        with sync_playwright() as pw:
            br = launch(pw)
            pver = br.version
            renderer = None
            for i, (fr, out) in enumerate(zip(job["frames"], job["outputs"])):
                cfg = page_config(job, fr, tool, work, i)
                html = tmpl.replace("%CSS%", COMMON_CSS).replace("%JOB%", json.dumps(cfg))
                _Handler.pages = {f"/page_{i}.html": html}
                ctx = br.new_context(viewport={"width": W, "height": H}, device_scale_factor=1)
                pg = ctx.new_page()

                def route(r, _b=blocked):
                    u = r.request.url
                    if u.startswith(f"http://127.0.0.1:{port}/") or u.startswith("data:") or u.startswith("blob:"):
                        return r.continue_()
                    _b.append(u)
                    return r.abort()

                pg.route("**/*", route)
                msgs = []
                pg.on("console", lambda m, _m=msgs: _m.append(f"{m.type}: {m.text}")
                      if m.type in ("error", "warning") else None)
                pg.on("pageerror", lambda e, _m=msgs: _m.append(f"pageerror: {e}"))
                pg.goto(f"http://127.0.0.1:{port}/page_{i}.html")
                if renderer is None:
                    renderer = check_renderer(pg)
                try:
                    pg.wait_for_function("window.__ready === true", timeout=int(job["style"].get("timeout_s", 120)) * 1000)
                except Exception as e:  # noqa: BLE001
                    raise RuntimeError(f"{tool} page never became idle: {e}\nconsole: {msgs[:8]}\n"
                                       f"errors: {pg.evaluate('window.__errors || []')}\nblocked: {blocked[:5]}")
                errs = pg.evaluate("window.__errors || []")
                if errs:
                    notes.append(f"frame {i} page errors: {errs[:3]}")
                if msgs:
                    notes.append(f"frame {i} console: {msgs[:3]}")
                try:
                    pg.locator("#map").screenshot(path=out, animations="disabled")
                except Exception as e:  # noqa: BLE001  (a dropped GPU page: retry once, recorded in notes)
                    notes.append(f"frame {i} screenshot retried after: {str(e).splitlines()[0][:120]}")
                    ctx.close()
                    br.close()
                    br = launch(pw)
                    ctx = br.new_context(viewport={"width": W, "height": H}, device_scale_factor=1)
                    pg = ctx.new_page()
                    pg.route("**/*", route)
                    pg.goto(f"http://127.0.0.1:{port}/page_{i}.html")
                    pg.wait_for_function("window.__ready === true", timeout=180_000)
                    pg.locator("#map").screenshot(path=out, animations="disabled")
                outs.append(out)
                ctx.close()
            br.close()
    finally:
        srv.shutdown()
    if blocked:
        notes.append(f"blocked {len(blocked)} non-local request(s): {sorted(set(blocked))[:5]}")
    ver = {"maplibre": f"maplibre-gl {versions.get('maplibre-gl')}", "deckgl": f"deck.gl {versions.get('deck.gl')}",
           "cesium": f"cesium {versions.get('cesium')}"}[tool]
    notes.append(f"WebGL renderer: {renderer} (mode {mode()})")
    _job.done(job, tool, f"{ver}; chrome-headless-shell {pver}; GL {mode()}: {renderer}", outs, notes)


if __name__ == "__main__":
    main()
