"""CesiumJS (no Ion) shots for ch00_weather_basics, rendered headless frame by frame and composited in Remotion with our
billboard labels (orchestrator 2026-10-27: "try a Cesium version next to the three.js one").

Shots (frame counts follow timing.json, one PNG per movie frame, the camera a pure function of the frame index):
  tibet    s39 close-up from the new sentence S4 to the scene end: ETOPO 2022 4′ heights (data/tibet_etopo.bin) ×30 as a
           CustomHeightmapTerrainProvider, the Blue Marble crop as SingleTile imagery over a Blue Marble globe.
  trappes  s21 whole scene: the 1 Nov 2023 true colour over a Blue Marble globe (flat terrain), the Trappes column (gold
           polyline, heights ×10 as said in the narration) with the camera descending from above France.
For every frame the page also returns the screen position of the label anchors (Cesium SceneTransforms), written to
<shot>/anchors.json, so Remotion draws its billboards exactly on the Cesium picture.

Browser: tools/maptools/adapters/_browser.py (Remotion's chrome-headless-shell, ANGLE D3D11 on the RTX; fails loudly on a
software renderer). Pages and data live in the scratch folder; the Cesium library is captests/_web/lib/cesium (read only).
usage: .venv/Scripts/python.exe tools/movie_wb/cesium_shots.py tibet trappes [--still]
"""
from __future__ import annotations

import functools
import http.server
import json
import shutil
import socketserver
import sys
import threading
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools" / "maptools" / "adapters"))
from _browser import check_renderer, launch  # noqa: E402

DATA_ROOT = Path("G:/Geophysical Fluid Dynamics/aofd-data")
SCR = DATA_ROOT / "scratch/movies/ch00_weather_basics/v2"
CES = SCR / "cesium"
PUB = SCR / "public"
MOVD = ROOT / "movies/ch00/ch00_weather_basics"
T = json.loads((MOVD / "timing.json").read_text(encoding="utf-8"))
FPS = 30


def scene(sid: str):
    sc = T["scenes"]
    k = [s["id"] for s in sc].index(sid)
    cut = 0 if k == 0 else round(sc[k]["start"] * FPS)
    end = round(sc[k + 1]["start"] * FPS) if k + 1 < len(sc) else T["total_frames"] + 75
    return sc[k], cut, end


PAGE = """<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;height:100%;background:#171f33;overflow:hidden}
#map{position:absolute;inset:0}.cesium-viewer-bottom,.cesium-widget-credits{display:none!important}</style>
<script>window.CESIUM_BASE_URL = "/captests/_web/lib/cesium/";</script><script src="/captests/_web/lib/cesium/Cesium.js"></script>
<link rel="stylesheet" href="/captests/_web/lib/cesium/Widgets/widgets.css"></head><body><div id="map"></div><script>
(async () => {
Cesium.Ion.defaultAccessToken = '';
const CFG = await (await fetch('cfg.json')).json();
let terrainProvider = new Cesium.EllipsoidTerrainProvider();
if (CFG.height) {
  const Z = new Float32Array(await (await fetch(CFG.height.bin)).arrayBuffer());
  const [w, s, e, n] = CFG.height.bounds, nx = CFG.height.nx, ny = CFG.height.ny, EX = CFG.height.ex;
  const sample = (lon, lat) => { if (lon < w || lon > e || lat < s || lat > n) return 0;
    const fx = (lon - w) / (e - w) * (nx - 1), fy = (lat - s) / (n - s) * (ny - 1);   // our grid: row 0 = south
    const i = Math.floor(fx), j = Math.floor(fy), i1 = Math.min(nx - 1, i + 1), j1 = Math.min(ny - 1, j + 1), u = fx - i, v = fy - j;
    const z = (1-u)*(1-v)*Z[j*nx+i] + u*(1-v)*Z[j*nx+i1] + (1-u)*v*Z[j1*nx+i] + u*v*Z[j1*nx+i1]; return Math.max(0, z) * EX; };
  const S = 65;
  terrainProvider = new Cesium.CustomHeightmapTerrainProvider({width: S, height: S, callback: (x, y, level) => {
    const r = new Cesium.GeographicTilingScheme().tileXYToRectangle(x, y, level); const out = new Float32Array(S * S);
    for (let jj = 0; jj < S; jj++) for (let ii = 0; ii < S; ii++) out[jj * S + ii] = sample(Cesium.Math.toDegrees(r.west + (r.east - r.west) * ii / (S - 1)),
      Cesium.Math.toDegrees(r.north - (r.north - r.south) * jj / (S - 1)));
    return out; }});
}
const viewer = new Cesium.Viewer('map', {baseLayer: false, baseLayerPicker: false, geocoder: false, homeButton: false, sceneModePicker: false,
  navigationHelpButton: false, animation: false, timeline: false, fullscreenButton: false, infoBox: false, selectionIndicator: false,
  terrainProvider, skyBox: false, skyAtmosphere: false, requestRenderMode: true, contextOptions: {webgl: {preserveDrawingBuffer: true}}});
viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#171f33');
viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#1d2740');
viewer.scene.globe.showGroundAtmosphere = false; viewer.scene.fog.enabled = false; viewer.scene.globe.enableLighting = false;
viewer.scene.globe.maximumScreenSpaceError = 1.2;
if (viewer.scene.sun) viewer.scene.sun.show = false; if (viewer.scene.moon) viewer.scene.moon.show = false;
for (const im of CFG.imagery) viewer.imageryLayers.add(Cesium.ImageryLayer.fromProviderAsync(Cesium.SingleTileImageryProvider.fromUrl(im.url,
  {rectangle: Cesium.Rectangle.fromDegrees(...im.bounds)})));
for (const L of (CFG.lines || [])) viewer.entities.add({polyline: {positions: Cesium.Cartesian3.fromDegreesArrayHeights(L.pts),
  width: L.width, material: Cesium.Color.fromCssColorString(L.color).withAlpha(L.alpha ?? 1)}});
const ease = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2, Lr = (a, b, t) => a + (b - a) * t;
const keyAt = i => { const K = CFG.keys; if (i <= K[0].f) return K[0]; for (let q = 1; q < K.length; q++) if (i <= K[q].f) {
  const A = K[q-1], B = K[q], t = ease((i - A.f) / Math.max(1, B.f - A.f));
  return {lon: Lr(A.lon, B.lon, t), lat: Lr(A.lat, B.lat, t), h: Math.exp(Lr(Math.log(A.h), Math.log(B.h), t)), heading: Lr(A.heading, B.heading, t), pitch: Lr(A.pitch, B.pitch, t)}; }
  return K[K.length - 1]; };
const setCam = i => { const c = keyAt(i); viewer.camera.setView({destination: Cesium.Cartesian3.fromDegrees(c.lon, c.lat, c.h),
  orientation: {heading: Cesium.Math.toRadians(c.heading), pitch: Cesium.Math.toRadians(c.pitch), roll: 0}}); };
const anchors = () => (CFG.anchors || []).map(a => { const p = Cesium.SceneTransforms.worldToWindowCoordinates(viewer.scene, Cesium.Cartesian3.fromDegrees(a[0], a[1], a[2]));
  return p ? [Math.round(p.x * 10) / 10, Math.round(p.y * 10) / 10] : null; });
setCam(0);
window.__N = CFG.n;
window.__frame = i => new Promise(res => { setCam(i); let k = 0, done = false; const h = viewer.scene.postRender.addEventListener(() => {
  if (viewer.scene.globe.tilesLoaded && ++k > 3) { done = true; h(); res(anchors()); } });
  const pump = () => { if (done) return; viewer.scene.requestRender(); setTimeout(pump, 16); }; pump(); });
let q = 0; viewer.scene.postRender.addEventListener(() => { if (viewer.scene.globe.tilesLoaded && ++q > 20) window.__loaded = true; });
const tick = () => { viewer.scene.requestRender(); if (!window.__loaded) setTimeout(tick, 50); }; tick();
})();
</script></body></html>"""


def shots() -> dict:
    out = {}
    # ---- tibet: s39 from sentence 4 (the new "thirty times taller" sentence) to the end
    sc, cut, end = scene("s39_surface_pressure")
    f0 = round(sc["sentences"][4]["start"] * FPS) - cut
    n = (end - cut) - f0 + 10
    te = json.loads((MOVD / "data/tibet_etopo.json").read_text(encoding="utf-8"))
    lat, lon = te["coords"]["lat"], te["coords"]["lon"]
    out["tibet"] = {"scene": "s39_surface_pressure", "f0": f0, "n": n, "size": [780, 520],
                    "height": {"bin": "tibet_etopo.bin", "bounds": [lon[0], lat[0], lon[-1], lat[-1]], "nx": len(lon), "ny": len(lat), "ex": 30},
                    "imagery": [{"url": "bmng.jpg", "bounds": [-180, -90, 180, 90]}, {"url": "bmng_tibet.jpg", "bounds": [72, 25, 105, 42]}],
                    "keys": [{"f": 0, "lon": 88.5, "lat": 17.0, "h": 2.3e6, "heading": 0, "pitch": -60},
                             {"f": n - 1, "lon": 86.5, "lat": 22.0, "h": 1.35e6, "heading": 6, "pitch": -45}],
                    "anchors": [[86.0, 33.5, 5500 * 30], [84.0, 28.0, 7000 * 30]],
                    "files": {"tibet_etopo.bin": MOVD / "data/tibet_etopo.bin", "bmng_tibet.jpg": PUB / "wb_bmng_tibet.jpg", "bmng.jpg": PUB / "wb_bmng.jpg"}}
    # ---- trappes: s21 whole scene; the column heights x10
    sc, cut, end = scene("s21_balloon_pressure")
    n = end - cut + 10
    s = lambda j: round(sc["sentences"][j]["start"] * FPS) - cut  # noqa: E731
    lon0, lat0 = 2.0083, 48.7746
    snd = json.loads((MOVD / "data/soundings.json").read_text(encoding="utf-8"))["trappes"]
    lon0, lat0 = snd["lon"], snd["lat"]
    top = snd["top_km"] * 1000 * 10
    out["trappes"] = {"scene": "s21_balloon_pressure", "f0": 0, "n": n, "size": [920, 820],
                      "imagery": [{"url": "bmng.jpg", "bounds": [-180, -90, 180, 90]}, {"url": "tc1101.jpg", "bounds": [-40, 35, 10, 65]}],
                      "lines": [{"pts": [lon0, lat0, 0, lon0, lat0, top], "width": 4, "color": "#d8b23a", "alpha": 0.8}],
                      "keys": [{"f": 0, "lon": -1.0, "lat": 44.0, "h": 2.4e6, "heading": 10, "pitch": -70},
                               {"f": s(4), "lon": 0.4, "lat": 46.6, "h": 6.0e5, "heading": 25, "pitch": -24},
                               {"f": n - 1, "lon": 0.8, "lat": 46.9, "h": 5.4e5, "heading": 30, "pitch": -20}],
                      "anchors": [[lon0, lat0, z * 10000] for z in range(0, 36)],
                      "files": {"bmng.jpg": PUB / "wb_bmng.jpg", "tc1101.jpg": PUB / "wb_ciaran_tc_20231101.jpg"}}
    return out


class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


def main() -> int:
    which = [a for a in sys.argv[1:] if not a.startswith("--")]
    still = "--still" in sys.argv
    S = shots()
    srv = socketserver.ThreadingTCPServer(("127.0.0.1", 0), functools.partial(Q, directory=str(DATA_ROOT)))
    srv.daemon_threads = True
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    port = srv.server_address[1]
    from playwright.sync_api import sync_playwright
    rep = {}
    with sync_playwright() as pw:
        br = launch(pw)
        for name in which:
            cfg = S[name]
            d = CES / name
            (d / "frames").mkdir(parents=True, exist_ok=True)
            for fn, src in cfg["files"].items():
                shutil.copyfile(src, d / fn)
            (d / "index.html").write_text(PAGE, encoding="utf-8")
            (d / "cfg.json").write_text(json.dumps({k: v for k, v in cfg.items() if k != "files"}), encoding="utf-8")
            W, H = cfg["size"]
            ctx = br.new_context(viewport={"width": W, "height": H}, device_scale_factor=1)
            pg = ctx.new_page()
            errs = []
            pg.on("pageerror", lambda e, _e=errs: _e.append(str(e)))
            pg.goto(f"http://127.0.0.1:{port}/{d.relative_to(DATA_ROOT).as_posix()}/index.html")
            rend = check_renderer(pg)
            pg.wait_for_function("window.__loaded === true", timeout=240000)
            idx = [0, cfg["n"] // 2, cfg["n"] - 1] if still else range(cfg["n"])
            anchors = {}
            t0 = time.time()
            for i in idx:
                anchors[i] = pg.evaluate("i => window.__frame(i)", i)
                pg.screenshot(path=str(d / "frames" / f"f_{i:05d}.png"))
            spf = (time.time() - t0) / max(1, len(list(idx)))
            ctx.close()
            (d / "anchors.json").write_text(json.dumps({"f0": cfg["f0"], "n": cfg["n"], "anchors": anchors}), encoding="utf-8")
            rep[name] = {"frames": len(list(idx)), "s_per_frame": round(spf, 3), "renderer": rend, "errors": errs[:3]}
            print(name, rep[name], flush=True)
        br.close()
    srv.shutdown()
    (CES / "report.json").write_text(json.dumps(rep, indent=1), encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
