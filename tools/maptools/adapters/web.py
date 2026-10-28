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
for (const s of (J.sym || [])) {           // symbol layers without text: MapLibre text needs a glyph server
  const C = J.colors;
  if (s.type === 'fronts') { sources['f' + s.index] = {type: 'geojson', data: s.url};
    layers.push({id: 'fc' + s.index, type: 'line', source: 'f' + s.index, paint: {'line-color': '#ffffff', 'line-width': 6, 'line-opacity': 0.8}});
    layers.push({id: 'f' + s.index, type: 'line', source: 'f' + s.index, paint: {'line-color': ['match', ['get', 'kind'], 'warm', C.warm, 'occluded', C.occluded, 'stationary', C.trough, C.cold], 'line-width': 3}}); }
  if (s.type === 'points' || s.type === 'extrema') { sources['p' + s.index] = {type: 'geojson', data: s.url};
    layers.push({id: 'p' + s.index, type: 'circle', source: 'p' + s.index, paint: {'circle-radius': s.type === 'extrema' ? 7 : 4,
      'circle-color': s.type === 'extrema' ? ['match', ['get', 'kind'], 'low', C.low, C.high] : C.marker, 'circle-stroke-color': '#ffffff', 'circle-stroke-width': 1.5}}); }
  if (s.type === 'vectors') { sources['v' + s.index] = {type: 'geojson', data: s.lines_url};
    layers.push({id: 'v' + s.index, type: 'line', source: 'v' + s.index, paint: {'line-color': C.barb, 'line-width': 1.4}}); }
}
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
(async () => {
const J = %JOB%;
const b = J.bounds;
// 1. everything the frame shows is fetched and DECODED before deck.gl sees it: images as ImageBitmaps, GeoJSON as
//    objects. (A URL prop is loaded asynchronously and layer.isLoaded could pass before a BitmapLayer image was
//    drawn in a fresh page: capability tests 2026-10-27.)
const bitmap = async u => u ? createImageBitmap(await (await fetch(u)).blob()) : null;
const json = async u => u ? (await fetch(u)).json() : null;
const [rgbaImg, shadeImg, contours, overlays] = await Promise.all([bitmap(J.rgba), bitmap(J.shade), json(J.contours), json(J.overlays)]);
const sym = await Promise.all((J.sym || []).map(async s => ({...s, data: await json(s.url)})));
await document.fonts.ready;
const layers = [];
const bb = [b[0], Math.max(b[1], -85), b[2], Math.min(b[3], 85)];
if (J.terrain) {
  layers.push(new deck.TerrainLayer({id: 'terrain', minZoom: 0, maxZoom: 0, elevationData: J.terrain, texture: rgbaImg,
    bounds: [b[0], b[1], b[2], b[3]], meshMaxError: J.meshMaxError,
    elevationDecoder: {rScaler: 256 * J.exag, gScaler: 1 * J.exag, bScaler: J.exag / 256, offset: -32768 * J.exag},
    loadOptions: {worker: true, terrain: {skirtHeight: 0, workerUrl: '/lib/@loaders.gl/terrain/dist/terrain-worker.js'}},
    color: [255, 255, 255]}));
} else {
  layers.push(new deck.BitmapLayer({id: 'field', image: rgbaImg, bounds: bb}));
  if (shadeImg) layers.push(new deck.BitmapLayer({id: 'shade', image: shadeImg, opacity: J.shade_alpha, bounds: bb}));
}
const rgb = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
if (contours) layers.push(new deck.GeoJsonLayer({id: 'contours', data: contours, stroked: true, filled: false,
  getLineColor: rgb(J.ccolor), getLineWidth: J.cwidth, lineWidthUnits: 'pixels'}));
if (overlays) layers.push(new deck.GeoJsonLayer({id: 'ov', data: overlays, stroked: true, filled: false,
  getLineColor: f => f.properties.kind === 'borders' ? [77, 77, 77] : [26, 26, 26], getLineWidth: 0.8,
  lineWidthUnits: 'pixels'}));
// 2. symbol layers (recipe layers:): vectors as arrows, fronts as coloured lines with symbols as small glyphs,
//    H/L letters with the central pressure, points with labels (canvas font atlas: no glyph server)
const C = J.colors, FONT = 'Segoe UI, Arial, sans-serif';
const text = (id, data, o) => new deck.TextLayer({id, data, fontFamily: FONT, characterSet: 'auto',
  fontSettings: {sdf: true}, outlineWidth: 3, outlineColor: [255, 255, 255, 230], sizeUnits: 'pixels', ...o});
for (const s of sym) {
  const f = (s.data && s.data.features) || [];
  if (s.type === 'vectors') layers.push(new deck.LineLayer({id: 'vec' + s.index, data: s.data.segments,
    getSourcePosition: d => d[0], getTargetPosition: d => d[1], getColor: rgb(C.barb), getWidth: 1.4, widthUnits: 'pixels'}));
  if (s.type === 'fronts') {
    layers.push(new deck.PathLayer({id: 'frontcase' + s.index, data: f, getPath: d => d.geometry.coordinates,
      getColor: [255, 255, 255, 200], getWidth: 6, widthUnits: 'pixels', capRounded: true, jointRounded: true}));
    layers.push(new deck.PathLayer({id: 'front' + s.index, data: f, getPath: d => d.geometry.coordinates,
      getColor: d => rgb(C[d.properties.kind] || C.cold), getWidth: 3, widthUnits: 'pixels', capRounded: true, jointRounded: true}));
    layers.push(new deck.ScatterplotLayer({id: 'frontsym' + s.index, data: s.data.symbols || [], getPosition: d => d.p,
      getFillColor: d => rgb(C[d.kind] || C.cold), getRadius: 5, radiusUnits: 'pixels'}));
  }
  if (s.type === 'extrema') {
    layers.push(text('hl' + s.index, f, {getPosition: d => d.geometry.coordinates, getText: d => d.properties.kind === 'low' ? 'L' : 'H',
      getColor: d => rgb(C[d.properties.kind]), getSize: 44, fontWeight: 'bold', getTextAnchor: 'middle', getAlignmentBaseline: 'center'}));
    layers.push(text('hlv' + s.index, f, {getPosition: d => d.geometry.coordinates, getText: d => String(Math.round(d.properties.value)),
      getColor: d => rgb(C[d.properties.kind]), getSize: 20, fontWeight: 'bold', getPixelOffset: [0, 34], getTextAnchor: 'middle', getAlignmentBaseline: 'center'}));
  }
  if (s.type === 'points') {
    const pts = f.slice(0, s.max_labels || 8);
    if (s.marker !== false) layers.push(new deck.ScatterplotLayer({id: 'pt' + s.index, data: pts, getPosition: d => d.geometry.coordinates,
      getFillColor: rgb(C.marker), getLineColor: [255, 255, 255], stroked: true, lineWidthUnits: 'pixels', getLineWidth: 1.5, getRadius: 4, radiusUnits: 'pixels'}));
    if (s.label !== false) layers.push(text('ptl' + s.index, pts, {getPosition: d => d.geometry.coordinates, getText: d => d.properties.name,
      getColor: rgb(C.place), getSize: 18, getPixelOffset: [8, -8], getTextAnchor: 'start', getAlignmentBaseline: 'bottom'}));
  }
}
const W = J.W, H = J.H;
let viewState;
if (J.globe) {
  viewState = {longitude: J.lon0, latitude: J.lat0, zoom: J.zoom ?? 0.3};
} else {
  const vp = new deck.WebMercatorViewport({width: W, height: H});
  const f = vp.fitBounds([[b[0], Math.max(b[1], -85)], [b[2], Math.min(b[3], 85)]], {padding: 4});
  viewState = {longitude: f.longitude, latitude: f.latitude, zoom: f.zoom + (J.zoomOffset || 0), pitch: J.pitch, bearing: J.bearing};
}
// 3. ready = every layer and sub-layer loaded (a composite with no sub-layer yet is NOT loaded) AND the drawn
//    pixels unchanged for STABLE consecutive frames (as Cesium: tilesLoaded for 30 frames)
const STABLE = 30;
const probe = document.createElement('canvas'); probe.width = 160; probe.height = 90;
const pctx = probe.getContext('2d', {willReadFrequently: true});
const loaded = l => l.isLoaded && (!l.isComposite || (l.getSubLayers().length > 0 && l.getSubLayers().every(loaded)));
let stable = 0, last = null, frames = 0;
const d = new deck.Deck({parent: document.getElementById('map'), width: W, height: H, useDevicePixels: 1,
  views: J.globe ? new deck._GlobeView({resolution: 5}) : new deck.MapView({}), initialViewState: viewState,
  controller: false, layers, glOptions: {preserveDrawingBuffer: true},
  onError: e => { window.__errors = (window.__errors || []).concat(String(e && e.message)); },
  onAfterRender: () => {
    frames++;
    if (window.__ready) return;
    const ok = d.layerManager && d.layerManager.getLayers().filter(l => !l.parent).every(loaded);
    let same = false;
    if (ok) {
      pctx.clearRect(0, 0, 160, 90);
      pctx.drawImage(d.canvas, 0, 0, 160, 90);
      const px = pctx.getImageData(0, 0, 160, 90).data;
      if (last) {          // "unchanged": < 0.2 % of probe samples moved by > 2/255 (GlobeView lines z-fight)
        let n = 0;
        for (let i = 0; i < px.length; i += 1) if (Math.abs(px[i] - last[i]) > 2) n++;
        same = n / px.length < 0.002;
        window.__probeDiff = n / px.length;
      }
      last = px;
    } else { last = null; }
    stable = same ? stable + 1 : 0;
    window.__state = {stable, frames, loaded: !!ok, probeDiff: window.__probeDiff, notLoaded: d.layerManager ? d.layerManager.getLayers().filter(l => !loaded(l)).map(l => l.id) : null};
    if (stable >= STABLE) requestAnimationFrame(() => requestAnimationFrame(() => { window.__ready = true; }));
  }});
setInterval(() => { if (!window.__ready) d.redraw(true); }, 100);
})().catch(e => { window.__errors = [String(e && e.stack || e)]; window.__failed = true; });
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


SYM_COLORS = {"low": "#c1121f", "high": "#1d4ed8", "cold": "#1f4fd6", "warm": "#d62728", "occluded": "#7b2cbf",
              "trough": "#b5651d", "barb": "#3d4a63", "place": "#1d2433", "marker": "#1d2433"}   # cartostyle notebook


def symbol_layers(job, fr, work: Path, i: int, rel) -> list[dict]:
    """Recipe ``layers:`` for the browser tools: GeoJSON URLs, plus vectors as arrow segments (a subsampled grid,
    arrow length proportional to speed) and front symbols as dots every few points on the warm/cold side."""
    import numpy as np
    import xarray as xr

    out = []
    for lay in job["layers"]:
        s = {k: lay.get(k) for k in ("type", "index", "label", "marker", "max_labels")}
        f = lay["files"][min(i, len(lay["files"]) - 1)] if "files" in lay else lay.get("file")
        if lay["type"] == "vectors":
            g = xr.open_dataset(f)
            nx, ny = lay.get("density") or (20, 12)
            lo, la = g.lon.values, g.lat.values
            ii = np.linspace(0, lo.size - 1, int(nx)).round().astype(int)
            jj = np.linspace(0, la.size - 1, int(ny)).round().astype(int)
            u, v = g.u.values[np.ix_(jj, ii)], g.v.values[np.ix_(jj, ii)]
            sp = np.hypot(u, v)
            k = 0.6 * (lo[-1] - lo[0]) / nx / max(float(np.nanpercentile(sp, 95)), 1e-9)   # 95th pct = 0.6 cell
            segs, lines = [], []
            for a, y in enumerate(la[jj]):
                for c, x in enumerate(lo[ii]):
                    if not np.isfinite(sp[a, c]):
                        continue
                    dx = k * u[a, c] / max(np.cos(np.radians(y)), 0.2)
                    dy = k * v[a, c]
                    x1, y1 = x + dx, y + dy
                    ang = np.arctan2(dy, dx)
                    hl = 0.3 * np.hypot(dx, dy)
                    h1 = (x1 - hl * np.cos(ang - 0.45), y1 - hl * np.sin(ang - 0.45))
                    h2 = (x1 - hl * np.cos(ang + 0.45), y1 - hl * np.sin(ang + 0.45))
                    pts = [[float(x), float(y)], [float(x1), float(y1)]]
                    segs += [pts, [pts[1], [float(h1[0]), float(h1[1])]], [pts[1], [float(h2[0]), float(h2[1])]]]
                    lines.append([pts[0], pts[1], [float(h1[0]), float(h1[1])], pts[1], [float(h2[0]), float(h2[1])]])
            pj = work / f"web_vectors_{lay['index']}_{i:04d}.json"
            pj.write_text(json.dumps({"segments": segs}), encoding="utf-8")
            pl = work / f"web_vectors_{lay['index']}_{i:04d}.geojson"
            pl.write_text(json.dumps({"type": "FeatureCollection", "features": [
                {"type": "Feature", "properties": {}, "geometry": {"type": "LineString", "coordinates": c}}
                for c in lines]}), encoding="utf-8")
            s.update(url=rel(str(pj)), lines_url=rel(str(pl)))
        elif lay["type"] == "fronts":
            gj = json.loads(Path(f).read_text(encoding="utf-8"))
            sy = []
            for ft in gj["features"]:
                xy = np.asarray(ft["geometry"]["coordinates"], float)
                wl = ft["properties"].get("warm_left")
                kind = ft["properties"]["kind"]
                if wl is None or len(xy) < 3:
                    continue
                # cold: triangles into the warm air; warm/occluded: scallops into the cold air
                left = wl if kind == "cold" else (not wl)
                for q in range(1, len(xy) - 1, 6):
                    t = xy[q + 1] - xy[q - 1]
                    t[0] *= np.cos(np.radians(xy[q, 1]))
                    nrm = np.array([-t[1], t[0]]) / (np.hypot(*t) + 1e-12) * (1 if left else -1)
                    off = 0.35
                    sy.append({"p": [float(xy[q, 0] + off * nrm[0] / max(np.cos(np.radians(xy[q, 1])), 0.2)),
                                     float(xy[q, 1] + off * nrm[1])], "kind": kind})
            pj = work / f"web_fronts_{lay['index']}.json"
            pj.write_text(json.dumps({**gj, "symbols": sy}), encoding="utf-8")
            s["url"] = rel(str(pj))
        else:
            s["url"] = rel(f)
        out.append(s)
    return out


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
    if job.get("layers") and tool in ("deckgl", "maplibre"):
        cfg["sym"], cfg["colors"] = symbol_layers(job, fr, work, i, rel), SYM_COLORS
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
                    pg.wait_for_function("window.__ready === true || window.__failed === true",
                                         timeout=int(job["style"].get("timeout_s", 120)) * 1000)
                    if pg.evaluate("window.__failed === true"):
                        raise RuntimeError("page script failed")
                except Exception as e:  # noqa: BLE001
                    raise RuntimeError(f"{tool} page never became idle: {e}\nconsole: {msgs[:8]}\n"
                                       f"errors: {pg.evaluate('window.__errors || []')}\nblocked: {blocked[:5]}\n"
                                       f"state: {pg.evaluate('window.__state || null')}")
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
    if job.get("layers"):
        if tool == "maplibre":
            notes.append("symbol layers: fronts as coloured lines (no symbols), points/H-L as circles, vectors as "
                         "arrows; NO text (MapLibre text needs a glyph server; final frames are offline)")
        elif tool == "deckgl":
            notes.append("symbol layers: arrows for vectors (no WMO barbs), fronts as coloured lines with side dots "
                         "(no triangles/scallops), H/L + values and point labels without collision avoidance")
        else:
            notes.append(f"symbol layers are not drawn by {tool}")
    _job.done(job, tool, f"{ver}; chrome-headless-shell {pver}; GL {mode()}: {renderer}", outs, notes)


if __name__ == "__main__":
    main()
