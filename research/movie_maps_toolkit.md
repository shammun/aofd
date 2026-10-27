# Movie maps toolkit: maps, animated maps and 3-D maps for the weather, climate and ocean movies

Research pass asked for in `movies/ch00/series_plan.md` § "Maps and animation" (user, 2026-10-27).
Written 2026-10-27. Trials ran on this machine (Windows 11, Chrome-headless-shell from Remotion 4.0.537, ANGLE/D3D11).
Throwaway installs and code: `G:/Geophysical Fluid Dynamics/aofd-data/scratch/maptools/`.
Result images: `outputs/maptools/t*_*` (git-ignored).

**The user's rule: no single tool wins.** Each kind of visual gets the best tool, or the best stack of tools, and the
best data. That is the matrix in §3 and §4. The installs that were really tested are in §7, ready for the setup step.

---

## 0. The answer in brief

| # | Stack (rank by value ÷ effort) | Use it for | Effort to adopt | Proven here |
|---|---|---|---|---|
| 1 | **Python prepares textures → three.js renders in Remotion** (DEM heightmap + Blue Marble/GIBS/our colour field → displaced mesh or globe) | regional terrain in 3-D, globes with data, cross-sections lifted out of the map, sounding columns, particle winds | **S** (we already have @remotion/three; add a `TerrainTile` and a `DataGlobe` component) | T1: bit-identical frames, 0.25 s/frame |
| 2 | **NASA GIBS WMS/WMTS time series → image sequence** (GOES GeoColor every 10 min, VIIRS/MODIS daily, IMERG) | real satellite loops (fronts, cyclones, monsoon), the "latest" state | **S** (a `fluidpy.data` fetcher + a frame-sequence component) | T6: 48-frame GOES-East day loop; Milton MODIS series |
| 3 | **PyGMT** (relief shading, `grdimage`, `grdview`, coast, colour bars) | static relief and location maps, relief textures for (1); 3-D perspective stills | **M** (needs its own conda env, because GMT is a C binary) | T3: works; 2–14 s per image |
| 4 | **MapLibre GL JS in Remotion** (globe projection + `raster-dem` terrain + raster layers) | "zoom from space down to a town", a flight over real terrain | **M** (new npm dep + delayRender/idle pattern; local tile cache for determinism) | T2: visually deterministic; 0.02 % of pixels differ at the horizon at high pitch |
| 5 | **RustGIS CLI** (`rustgis-cli run … share.exportMap`) | fast batch relief/location maps, quick terrain tilts, a globe of vectors; a terrain/hydrology toolbox | **S** (portable exe, no runtime) | T5: bit-identical, 0.4 s/frame |
| 6 | **GeoVista (pyvista)** | a quick globe of an xarray field, and unstructured model grids (cubed sphere, ICON, MPAS, LFRic) | **S** (pip in its own venv; VTK is large) | T4: bit-identical, 0.8 s/frame warm |
| 7 | **Google Earth Engine (geemap)** → exported GeoTIFF/PNG → textures | cloud-free Sentinel-2/Landsat composites for close zooms, MODIS snow and NDVI seasons, quick server-side reductions (IMERG totals, ERA5-Land climatologies) | **M** plus a **user account** (§8) | not run: no account, by instruction |
| 8 | cartopy/matplotlib + MetPy (already in `.venv`) | synoptic MSLP + fronts, climatology maps, sections, skew-T | 0 | already used in the series |

Do not adopt: **CesiumJS** as the main engine (heavy; Ion token for its best terrain and imagery; our three.js does
the same honestly), **kepler.gl** (an exploration app, not a frame renderer), **leaflet/leafmap/GeoLibre as renderers**
(interactive, raster-tile 2-D; useful for *exploring* data before a storyboard). Particle winds stay in our own
three.js code (webgl-wind is only a reference).

---

## 1. What "RustGIS" and "GeoLibre" are (the user's links: rustgis.app, github.com/opengeos/RustGIS, github.com/opengeos/GeoLibre)

Both are real, new and very active. Both come from **opengeos**, the organisation of Qiusheng Wu, who also wrote leafmap and geemap.

| | **RustGIS** | **GeoLibre** |
|---|---|---|
| What it is | A desktop GIS written in pure Rust, drawn on the GPU (egui). The same app also runs as WebAssembly at web.rustgis.app. It has a ribbon UI like ArcGIS Pro, and every button is a scriptable command | A "cloud-native" GIS platform: a Tauri v2 + React + TypeScript app on **MapLibre GL JS + deck.gl + DuckDB-WASM**, with CesiumJS/ArcGIS as switchable engines. It runs in a browser, on desktop and mobile, and in Jupyter |
| Maturity | Created 2026-10-10; **v0.4.0** (2026-10-25); 2.1 k stars. Very young and fast-moving | Created 2026-05-27; Python package **3.5.1**; 8.2 k stars; Zenodo DOI. Young, but in heavy use |
| Licence | Apache-2.0 | MIT |
| Windows | Yes: installer, MSI, MSIX, **portable zip** (47 MB, tested), `winget install OpenGeos.RustGIS`, a PyPI wheel `rustgis` (cp312 win_amd64, tested) | Yes: desktop installer, Microsoft Store, `pip install geolibre` (tested) |
| API | **`rustgis-cli`**: about 3 480 command ids (`commands` lists them as JSON), `run --cmd 'id={json}' … --save x.rgis`, `render in.geojson out.png`, an **MCP server** (`rustgis-cli mcp`), a Python `Session` class | Python: `geolibre.Map`, `Layer`, `load_project`/`save_project`, colour ramps, a Dash component; a JS app with plugins; an R package |
| Rendering we can use | **`share.exportMap` → PNG**, deterministic (identical SHA-256 over two runs), 0.4–1.1 s per call. Shaded relief, `map.terrain` with tilt and bearing, `map.projection` globe or any EPSG, raster colour maps, Zarr layers (`layer.addZarr`, with a time index), WMTS with time. `share.export3d` writes OBJ for extruded features (could be loaded in three.js) | No headless image export from Python. Underneath it is MapLibre/deck.gl, so for frames we would drive MapLibre ourselves (T2) |
| Data processing for us | **Yes, a real gain:** 1 000+ GeoLibre/Whitebox tools (hillshade, multidirectional hillshade, slope, flow accumulation, viewshed, terrain derivatives, reprojection, clip, zonal statistics, Zarr time-series reductions) in one exe with no GDAL needed. Good for preparing relief and hydrology layers | Its 1 000+ geoprocessing tools run in the browser (WASM, the `geolibre-rust` crate). From Python it is mainly a viewer/authoring layer |
| Verdict | **Adopt as a helper:** a fast batch map-frame renderer (a relief or location map in 0.4 s) and a terrain toolbox. Its CLI makes it easy for agents to script. It is not the main movie engine: the cartography looks like a GIS (a scale bar is always drawn), there is no animation timeline, and v0.x may change | **Use it to explore**, not to make frames. When a storyboard needs a quick look at a STAC, PMTiles or GeoParquet layer, it is handy. Its rendering stack is the one we test directly (MapLibre, deck.gl) |

"rustgis" also once meant the Rust `geo`/`gdal`/`geozero` crates. Those are libraries, not renderers. RustGIS
already bundles what we would want from them, so we do not write Rust ourselves.

---

## 2. Trials run (≤ 30 min each; images under `outputs/maptools/`)

The shared harness is `scratch/maptools/scripts/shoot.py`. It is a stand-in for Remotion: it uses Remotion's own
`chrome-headless-shell` (`movies/node_modules/.remotion/...`) with `--use-gl=angle --use-angle=d3d11`. It serves the
page on localhost and calls `window.renderFrame(f)`, which returns a Promise that resolves when the frame is fully
drawn (the `delayRender` analogue). It screenshots each frame, repeats the whole run, and compares SHA-256 frame by frame.

| Trial | What | Result | Images |
|---|---|---|---|
| **T1 three.js terrain** (our stack) | Tibet/Himalaya: AWS Terrain Tiles (terrarium, z6, about 2.1 km/px) decoded in Python to a float32 height grid (768×512 mesh). Draped with (a) a matplotlib LightSource hillshade on cmocean `topo`, and (b) **GIBS Blue Marble NG tiles on the same Web-Mercator z6 grid** (so no reprojection is needed). The camera path is a pure function of the frame number | **Bit-identical across runs.** 230–320 ms/frame at 1280×720 on Iris Xe. Data prep 27 s (mostly imports). Blue Marble at ×8 looks cinematic: snow line, lakes, Tarim desert, Brahmaputra. ×20 is too spiky; **×5–8 is right** and is said aloud | `t1_threejs_tibet_bluemarble_x8_f000.png`, `…_f150.png`, `t1_threejs_tibet_relieftex_x20.png` |
| **T2 MapLibre globe → terrain** | MapLibre GL JS 6.16.0, `projection: globe`, GIBS Blue Marble raster, AWS terrarium `raster-dem` terrain ×2.5 + hillshade. The camera goes from space over the Indian Ocean down to Everest (240 frames). `interactive:false, fadeDuration:0, preserveDrawingBuffer`; per frame `jumpTo` → wait `idle` | Works. Frames 0–180 are identical to ≤ 1/255 (invisible). **Frame 240 (zoom 9, pitch 72°): 0.02 % of pixels differ by up to 29/255, at the horizon.** Terrain tiles at different levels of detail arrive in a different order. A stricter wait (`areTilesLoaded` + 2 extra idles) did **not** remove it. 0.5–2.7 s/frame with network tiles. Blue Marble (500 m) is soft below about zoom 8; a close zoom needs Sentinel-2 or Landsat imagery (GEE, or EOX s2cloudless) | `t2_maplibre_globe_terrain_f0000/0120/0180/0240.png` |
| **T3 PyGMT** | `@earth_relief_02m` (SRTM15+ v2.7) Tibet: `grdimage` + shading + coast + colour bar (2-D), and `grdview` perspective (3-D) | 2-D: publication grade in 2.1 s. 3-D: 13.6 s per view, looks like a "scientific plot", and every camera angle is a fresh run, so it is **not a camera-move engine**. Ghostscript must be in the env and you must call through `micromamba run`, or PyGMT cannot find it | `t3_pygmt_tibet_relief_2d.png`, `t3_pygmt_tibet_grdview_3d.png` |
| **T4 GeoVista** | Global 30′ relief on a sphere + Natural Earth 10 m coasts, offscreen | **Bit-identical**, 12.7 s cold / **0.8 s warm**. Nice for xarray → globe and for unstructured meshes. Lighting and look are plainer than T1. It caches into `%LOCALAPPDATA%\geovista` (set `GEOVISTA_CACHEDIR` to G:) | `t4_geovista_relief_globe.png` |
| **T5 RustGIS CLI** | The T1 DEM written as a GeoTIFF (EPSG:3857); `raster.symbology shadedRelief`, `map.goToXY`, `share.exportMap`; then `map.terrain` + pitch 60°; and the sample globe | **Bit-identical**, 0.4 s per render (1.1 s cold). The relief rendering is good. The terrain tilt works, but the relief stays modest. A scale bar is always drawn. Absolute **Windows paths are required** (`G:/…`; `/g/…` fails) | `t5_rustgis_tibet_shaded_relief.png`, `t5_rustgis_tibet_terrain_tilt.png`, `t5_rustgis_sample_globe.png` |
| **T6 GIBS time series** | (a) Hurricane Milton, 4–10 Oct 2024, MODIS Terra true colour + IMERG rain rate, daily. (b) **GOES-East ABI GeoColor, 26 Oct 2026, every 30 min (48 frames)**, Gulf of Mexico to the western Atlantic | (a) MODIS has **black swath gaps** every day, and the IMERG PNG uses a rainbow-like palette. For a movie: use the IMERG *data* coloured with cmocean, not the GIBS picture. (b) **Superb:** a cold front sweeping off the US east coast, with city lights at night giving way to the day disk. GIBS keeps GOES for a **rolling window only** (Sept 2026 worked; Jan 2026 returned an empty tile), so fetch it at production time and archive it on G:. Each frame is 120–200 kB; the ffmpeg blend makes a 6 MB mp4 | `t6_gibs_goes_geocolor_20261026{.mp4,_sheet.jpg}`, `t6_gibs_modis_imerg_milton{.mp4,_sheet.jpg}` |
| **T7 deck.gl `_GlobeView`** | deck.gl 9.4.0 UMD: BitmapLayer (Blue Marble) + PathLayer graticule on the globe | Frames 60 and 120 are bit-identical. **Frame 0 differs between runs**, because the image finished loading after "ready". The first frame must wait for `layer.isLoaded`. 50–120 ms/frame. GlobeView is still `_experimental` (no terrain, no atmosphere) | `scratch/.../shots/deckglobe_r*_f*.png` |

A parallel harness by another session (`tools/maptools/`, untracked) has rendered the same Alps relief and Storm
Ciarán isobars with mpl, PyGMT, MapLibre, deck.gl, Cesium, QGIS, RustGIS and leafmap. See
`outputs/maptools/compare/alps_relief__20261027T120743.png`. Its Chromium runs used **SwiftShader** (software GL):
slower, but the same on every machine. My runs used the **Intel Iris Xe** through ANGLE, not the RTX A1000 (§9, risk R3).
Its Cesium isobar frame was blank and its deck.gl one had no contours at the time of reading. That agrees with the
verdict that Cesium and deck.gl add effort without adding value for our flat analysis maps.

---

## 3. The matrix: visual kind × tool (and stacks)

Legend for each cell: **quality / determinism / effort / licence / render time**.
- Q = look (5 best).
- D = determinism: ✔ bit-identical, ≈ visually identical, ✗ live or time-driven.
- E = effort S/M/L.
- Lic = tool licence (data licences are in §4).
- t = time per 1280×720 frame on this machine.

"three.js" means our @remotion/three components fed by Python-made textures.

### 3a. Animated and 3-D kinds

| Visual kind | three.js ← Python textures | MapLibre in Remotion | deck.gl | CesiumJS | GeoVista | PyGMT | RustGIS CLI | GIBS / GEE image sequence | cartopy/mpl frames | **Best → runner-up** |
|---|---|---|---|---|---|---|---|---|---|---|
| **Global field on a 3-D globe** (SST anomaly, T2m, OLR, precipitable water) | Q5 D✔ E S (house globe exists) BSD/MIT t≈0.1–0.3 s; field coloured in Python with cmocean → equirect PNG → sphere texture | Q4 D≈ E M BSD-3; raster on globe OK, data colouring awkward | Q3 D≈ E M MIT; `_GlobeView` experimental | Q4 D≈ E L Apache-2.0 (Ion for defaults) | Q3 D✔ E S BSD-3 t 0.8 s; good for native model meshes | ✗ (orthographic still only) | Q2 globe of vectors only | GEE: compute the field server-side → PNG → texture; GIBS: picture-only layers (rainbow palettes) | Q3 D✔ orthographic stills per frame, 1–3 s | **three.js + Python texture → GeoVista** (for unstructured grids) |
| **Regional terrain in 3-D** (Alps, Tibet, Andes, Rockies) | **Q5 D✔ E S t 0.25 s (T1)** | Q4 D≈ E M t 1–3 s (T2) | Q4 D≈ E M (TerrainLayer) | Q4 D≈ E L | Q3 D✔ E S | Q3 D✔ (stills), 14 s, no camera move | Q3 D✔ E S 0.4 s (T5) | GEE Sentinel-2/Landsat composite = the best **drape** at close zoom | ✗ | **three.js mesh (Python DEM + drape) → MapLibre terrain** |
| **Zoom from space down to a town** | Q4 D✔ E L (needs a tiled LOD globe) | **Q5 D≈ E M (T2)**; local PMTiles for D✔ | Q3 E M | Q5 D≈ E L, with own imagery and terrain | ✗ | ✗ | Q2 | GEE: high-res composite tiles for the last 10 s | ✗ | **MapLibre globe + terrain with local tiles → three.js two-stage (globe → regional mesh cross-fade)** |
| **Hourly weather loop** (isobars, fronts, wind barbs, rain) | Q5 D✔ E M: field textures per hour + isobars as line geometry from Python contours (`skimage.measure.find_contours` or matplotlib `contour` paths → GeoJSON) | Q4 D≈ E M: GeoJSON isobars per frame, `setData` | Q4 D≈ E M (ContourLayer computes on GPU; labels weak) | ✗ effort | ✗ | Q4 D✔ per hour, 2–5 s | Q3 D✔ | **GIBS GOES GeoColor 10-min loop under the isobars** (T6) is the real-weather backdrop | **Q4 D✔ E S: cartopy contours per hour (house style already)** | **2-D: cartopy frames over a GOES loop. 3-D: three.js with a texture per hour** |
| **Wind particles / streaklines** | **Q5 D✔ E M**: our own seeded particle advection in a fixed-dt loop from frame 0 (or particles pre-integrated in Python, positions stored per frame) | Q3: custom layer needed | Q4 D≈ (deck.gl TripsLayer with pre-computed tracks) | ✗ | ✗ | ✗ | ✗ | ✗ | Q3 streamplot per frame | **three.js with Python-integrated trajectories → deck.gl TripsLayer** |
| **Satellite imagery time series** | Q5 as a globe/plane texture sequence | Q4 raster `setTiles` per time | Q3 | Q4 | ✗ | Q3 | Q3 WMTS + time slider | **GIBS GOES/Himawari/Meteosat (10-min), VIIRS daily; GEE for cloud-free composites** | Q4 2-D frames | **GIBS sequence → Remotion `<Img>` sequence (2-D) or three.js texture (3-D)** |
| **Vertical cross-section lifted out of a map** | **Q5 D✔ E M**: section image (Python, ERA5 pressure levels) on a vertical plane rising out of the map plane; the camera tilts | ✗ (cannot stand a plane up) | Q3 (BitmapLayer with 3-D bounds) | Q3 | Q4 (3-D slicing of a volume) | Q3 (2-D only) | ✗ | ✗ | Q4 2-D sections (standard) | **three.js plane + Python section → mpl 2-D section with a Remotion 3-D transform** |
| **Ocean SST + currents loop** | **Q5 D✔ E M**: SST texture per day + current streaklines (as winds) | Q4 D≈ | Q4 | Q3 | Q4 D✔ (ocean model grids) | Q3 | ✗ | GEE OISST/HYCOM daily frames | Q4 2-D | **three.js globe/region → cartopy 2-D frames** |
| **Sounding column** (balloon rising through a real profile) | **Q5 D✔ E S**: column of IGRA/ERA5 levels on the map, coloured by T, with the balloon icon | ✗ | Q3 ColumnLayer | ✗ | ✗ | ✗ | ✗ | ✗ | 2-D skew-T (MetPy maths, house drawing) | **three.js column + house 2-D skew-T side by side** |

### 3b. Static maps, charts and sections

| Visual kind | cartopy/mpl (+MetPy) | PyGMT | RustGIS | three.js still | MapLibre still | GIBS/GEE underlay | **Best → runner-up** |
|---|---|---|---|---|---|---|---|
| **Synoptic MSLP + fronts map** | **Q5 D✔ 1–3 s**; MetPy front path-effects (`ColdFront`, `WarmFront`, `OccludedFront`); H/L labels; house colours | Q4 D✔ 2–5 s; front symbols via `plot(style="f…")` | Q3 | Q3 | Q3 | GOES GeoColor underlay makes it real | **cartopy + MetPy (+ GOES underlay) → PyGMT** |
| **Climatology map** (Jan/Jul T, precipitation, winds) | **Q5 D✔** with cmocean and centred diverging maps | Q5 D✔ (beautiful coasts, `grdimage`) | Q3 | — | — | GEE for server-side means of long records | **cartopy → PyGMT** (pick PyGMT when relief must show under the field) |
| **Relief / location map** | Q3 (LightSource OK) | **Q5 D✔ (T3)** | Q4 D✔ 0.4 s (T5) | Q4 | Q4 | Blue Marble / GEE composite | **PyGMT → RustGIS** |
| **Satellite + analysis overlay** (cloud picture + isobars/jet) | **Q5 D✔**: GIBS image requested in EPSG:4326 for the exact bbox → `imshow(extent=…)` in PlateCarree, contours on top | Q4 (`grdimage` of an RGB GeoTIFF) | Q3 | Q4 | Q4 | GIBS GeoColor/VIIRS | **cartopy over GIBS 4326 → MapLibre raster + GeoJSON** |
| **Time-series charts** (index, ranks, record) | Q4 static | — | — | — | — | — | **The house Remotion/d3 chart components (draw-on, counting values) → matplotlib frames** |
| **Sections and profiles** (zonal-mean T and u, Hovmöller) | **Q5 D✔** | Q4 | ✗ | Q4 when lifted (3a) | ✗ | — | **cartopy/mpl → PyGMT** |

---

## 4. The best DATA for each kind (resolution · latency for "latest" · licence)

| Visual kind | Best data | Runner-up / for "latest" | Licence (redistribution of derived frames) | Data + tool combinations that work |
|---|---|---|---|---|
| Global field on a globe | **ERA5** 0.25°, hourly, latency about 5 days (ERA5T) via CDS; ARCO-ERA5 zarr (GCS, no key) lags by months | **GFS** 0.25°, 4 runs/day, about 4 h latency (NOMADS / AWS `noaa-gfs-bdp-pds`) for "today" | ERA5: **CC BY 4.0 since 2 Jul 2025** (credit "Copernicus Climate Change Service / ECMWF"). GFS: US public domain | ERA5/GFS → xarray → cmocean PNG (equirect) → three.js sphere |
| Regional terrain | **Copernicus DEM GLO-30/90** (30/90 m), or **AWS Terrain Tiles** (terrarium; SRTM + GMTED + ETOPO1 mix; tiled, so no reprojection; T1) | **ETOPO 2022** (15″, land + bathymetry, NOAA), **SRTM15+ / GEBCO 2024** for bathymetry; ALOS AW3D30 (JAXA) | Copernicus DEM: free with attribution. Terrain Tiles: open, with an attribution list (some national DEMs inside need credit). ETOPO: public domain. GEBCO: public domain with attribution. AW3D30: free, "© JAXA". SRTM: public domain | DEM z-tiles + **GIBS Blue Marble on the same WMTS grid** (no reprojection) → three.js; PyGMT `@earth_relief` for 2-D |
| Drape imagery | **Blue Marble NG** (500 m, monthly 2004; NASA) for zoom ≤ 7 | **Sentinel-2 cloud-free composite** (10 m; GEE, or EOX s2cloudless), **Landsat** composite (30 m, GEE) for close zooms | Blue Marble: NASA, free with credit. Sentinel-2 L2A: free with "contains modified Copernicus Sentinel data". **EOX s2cloudless 2016 = CC BY 4.0, 2018+ = CC BY-NC-SA 4.0** (our NC teaching fits; check monetisation). Landsat: public domain. **Avoid Esri World Imagery, Google, Bing and Mapbox satellite (ToS forbid this use)** | GEE `Export.image` of a median composite → GeoTIFF → drape texture |
| Hourly weather loop | **ERA5 hourly** (MSLP, 10 m wind, 850 hPa T, precipitation) for past events | **GFS analysis/forecast** for "now"; **ICON (DWD open data, 13 km, CC BY 4.0)** or **ECMWF open data (0.25°, CC BY 4.0)** for forecasts | as row 1 | ERA5 hourly → cartopy frames or three.js textures, over **GOES/Meteosat imagery** |
| Wind particles | **ERA5 u10/v10 or 850/250 hPa winds**, hourly | GFS 0.25° | as row 1 | trajectories integrated in Python (`fluidpy`, RK4) → JSON/binary → three.js lines |
| Satellite imagery | **GIBS: GOES-East/West ABI GeoColor, Himawari AHI, Meteosat** (2 km, **10 min**, rolling archive) for loops; **VIIRS SNPP/NOAA-20 true colour** (375 m daily, no gaps at low latitude) for single days | MODIS Terra/Aqua (250 m daily, **swath gaps**, T6). GEE `NOAA/GOES/16/MCMIPF` for archived full-disk (any date) | NASA/NOAA imagery: open, credit "NASA EOSDIS GIBS" (+ "NOAA/NESDIS, CIRA" for GeoColor) | GIBS WMS in EPSG:4326 for cartopy; WMTS 3857 for MapLibre/three.js tiles |
| Vertical cross-section | **ERA5 pressure levels** (37 levels, 0.25°) | MERRA-2 (0.5°×0.625°, 72 model levels; Earthdata login, ~3 weeks latency) | ERA5 CC BY 4.0; MERRA-2 NASA open | ERA5 → section in Python → texture on a three.js vertical plane |
| Ocean SST + currents | **NOAA OISST v2.1** (0.25°, daily, ~1-day preliminary latency) | **OSTIA** (0.05°, daily, Copernicus Marine) for sharp fronts; **ERSST v5** (2°, monthly) for long records. Currents: **OSCAR v2** (0.25°, NASA PO.DAAC), **CMEMS GLORYS/analysis** (1/12°) | OISST/ERSST: NOAA public domain. OSTIA/CMEMS: free with registration and attribution ("E.U. Copernicus Marine Service Information"). OSCAR: NASA open | OISST anomalies → cmocean `balance` texture → three.js globe; currents → streaklines |
| Sounding column | **IGRA v2** stations (NOAA, public domain) | ERA5 column at a point (smooth, any place and time) | public domain / CC BY 4.0 | IGRA → MetPy (θ, LCL) → three.js column + house skew-T |
| Synoptic map | ERA5 MSLP + 850 hPa θe (fronts drawn objectively with the thermal front parameter, computed by us) | GFS; **NOAA WPC coded surface bulletin** fronts (US-centred, public domain) | as above | cartopy + MetPy fronts |
| Climatology map | **ERA5 monthly means 1991–2020** | NCEP/NCAR R1 (2.5°, PSL), WorldClim (land only) | ERA5 CC BY 4.0; NCEP public domain | cartopy/PyGMT |
| Relief / location map | **SRTM15+ via PyGMT `@earth_relief`** (15″–60′), ETOPO 2022 | GEBCO 2024 | free with citation (Tozer et al. 2019) | PyGMT `grdimage` + `coast` |
| Time-series charts | ERA5/ERSST/OISST indices, NOAA CPC/PSL index files, RAPID AMOC, NSIDC sea ice | — | mostly public domain | house chart components |
| Global teaching animations | **NASA SVS** and **NOAA Science On a Sphere** (cloud, SST, CO₂ movies) as *reference* or as an occasional clip | — | SOS: most datasets NOAA/NASA public, but **partner datasets carry their own restrictions, and the catalogue says "educational use"**. Check each dataset page before use. **Prefer rebuilding from source data** | rebuild with our tools; use only to inspire |

---

## 5. Tool-by-tool notes (what each adds, determinism, licence, Windows, cost, fit with three.js)

- **Google Earth Engine** (+ `earthengine-api` 1.7.50, `geemap` 0.38.9; both pip-installed fine in the scratch venv).
  - **Adds:** petabyte catalogue and server-side compute. Cloud-free Sentinel-2/Landsat median composites; MODIS snow cover and NDVI seasonal cycles; ERA5-Land (`ECMWF/ERA5_LAND/HOURLY`); GPM IMERG V07; NOAA OISST; SRTM, ALOS AW3D30, Copernicus DEM; GOES-16/18 full-disk archive.
  - **Export routes:**
    - `ee.Image.getThumbURL` gives a PNG/JPG of ≤ about 32 MB.
    - `ImageCollection.getFilmstripThumbURL` gives frames tiled in one PNG/JPG; `dimensions` is per frame.
    - `getVideoThumbURL` gives a **GIF only** (palette-limited, not movie-grade).
    - `ee.data.computePixels` / `getDownloadURL` give GeoTIFF/NumPy.
    - `Export.image.toDrive`/`toCloudStorage` handle large rasters.
    - geemap wraps all of these (`geemap.download_ee_image`, `ee_export_image`, `create_timelapse`).
  - **For us:** filmstrip PNG or `computePixels` arrays → our own colouring → textures. Never use the GIF.
  - **Determinism:** a server render can change when the catalogue is reprocessed, so **download once, store it on G: with provenance, and never fetch at render time**.
  - **Licence:** the GEE ToS is noncommercial for free tiers, and outputs keep the *source dataset's* licence. Each catalogue page states it: Copernicus (Sentinel, ERA5-Land) is free with attribution / CC BY 4.0; NASA (MODIS, IMERG, SRTM) has no restrictions; NOAA (OISST, GOES) is public domain; JAXA ALOS needs "© JAXA".
  - **Cost:** free noncommercial Cloud project. Since 27 Apr 2026 the Community Tier has a monthly quota of 150 EECU-hours; Contributor is 1 000 EECU-h and needs a billing account; Partner is by application. Our use (a few composites per movie) fits easily in Community.
  - **Fit:** textures for three.js or MapLibre.
  - **Risk:** see §9 R6 on a monetised channel.
- **leaflet / leafmap 0.63.1:** interactive 2-D slippy maps in Jupyter (ipyleaflet, folium, maplibre and deck backends). leafmap's `maplibregl` backend can save an HTML page, which we could screenshot. But that is just MapLibre with more layers in between, so drive MapLibre directly. **Use it for exploring data** while storyboarding. MIT.
- **MapLibre GL JS 6.16.0** (BSD-3; v6 is ESM-only and needs WebGL2). Globe projection (since v5) + `raster-dem` terrain (terrarium/mapbox encodings) + hillshade + raster/GeoJSON layers. Remotion has an official guide (remotion.dev/docs/maps): `interactive:false`, `fadeDuration:0`, `preserveDrawingBuffer`, `useDelayRender`, `once('idle')` per frame, render with `--gl=angle --concurrency=1`, and **never `map.remove()`**. Serve the worker locally (`setWorkerUrl`), not from unpkg. **Remaining non-determinism (T2):** terrain level-of-detail at steep pitch. Fix: (a) local tiles from a **PMTiles** file on G: with a fixed `maxzoom`, (b) a tolerance-based QA gate (p99.9 pixel diff ≤ 2), (c) avoid pitches above 60° at the horizon, or (d) switch to the three.js mesh for the final seconds.
- **deck.gl 9.4.0** (MIT): `TerrainLayer`, `TileLayer`, `BitmapLayer`, `ContourLayer`, `TripsLayer` (animated tracks: good for pre-computed particle trails), `_GlobeView` (experimental: no terrain, no atmosphere). Deterministic when the frame waits for `layer.isLoaded` (T7). **pydeck/lonboard** are Python front-ends for notebooks, not frame renderers. **hubble.gl** (vis.gl) renders deck.gl animations frame by frame to video; it is an alternative path, but Remotion already does that job.
- **CesiumJS 1.146.0** (Apache-2.0). It has the best virtual globe (terrain, atmosphere, time-dynamic CZML). But the **default World Terrain and Bing imagery need a Cesium ion token** (free community tier; ToS on caching). Google Photorealistic 3D Tiles need a Google Maps API key with restrictive ToS. With our own imagery (`SingleTileImageryProvider`/`UrlTemplateImageryProvider`) and self-hosted terrain it is fine, but heavy (≈ 100 MB package, slow first frame: 15.7 s in the parallel harness) and it adds nothing over T1/T2. **Not recommended** except for CZML satellite orbits if we ever need them.
- **globe.gl 2.46.2 / three-globe** (MIT). Quick three.js globes with arcs, points, hex-bins and an atmosphere. It runs its own animation loop, so we would have to drive it per frame. Our house globe already covers this. **Borrow ideas** (the atmosphere glow shader, arcs) rather than the dependency.
- **kepler.gl** (MIT): an exploration app; video export needs hubble.gl. Not for us.
- **datashader / hvplot / geoviews** (BSD-3): fast rasterisation of millions of points (drifter tracks, Argo floats, lightning) to an image, which can become a texture. Use **datashader** when a movie shows *all* the GDP drifters or Argo profiles. It goes in `.venv` (pure Python; low conflict risk).
- **PyGMT 0.19.0 / GMT 6.7.0** (BSD-3 / LGPL-3): the best static relief and coast cartography (T3), `grdgradient` shading, `grdview` perspective stills, `@earth_relief`, `@earth_age` and other remote grids with automatic caching. It **needs conda** (GMT and Ghostscript are C binaries) and must live in its own env.
- **pyvista / GeoVista 0.5.3** (MIT / BSD-3, Met Office/bjlittle): xarray → globe in a few lines, native support for unstructured meshes (LFRic cubed sphere, ORCA, ICON), offscreen PNG, bit-identical (T4). VTK is large (about 300 MB). Use it for quick globes and model-grid stories ("what a climate model's grid looks like").
- **matplotlib/cartopy relief shading:** `LightSource.shade(…, blend_mode="soft")` is what made the T1 relief texture. It is fine for textures; PyGMT is better for finished maps.
- **earthkit (ECMWF)** (Apache-2.0): `earthkit-data` reads GRIB/NetCDF/CDS/ECMWF open data with one call, and `earthkit-plots` 1.0.x does quick-look maps (matplotlib/cartopy). It is useful for **reading ECMWF open data and GRIB** (GFS/ICON) without boilerplate. The plots duplicate our cartopy house style. Optional, in `.venv`.
- **webgl-wind** (mapbox, ISC) and similar windy-style layers run on a wall clock with GPU random seeds. **Not deterministic as shipped.** We do particles our own way: seeded, with a fixed dt from frame 0, or integrated in Python.
- **GDAL / rasterio** (MIT / BSD-3; rasterio 1.5.2 wheels include GDAL). Use them for `gdaldem hillshade/color-relief`, reprojection (`rasterio.warp.reproject`), writing GeoTIFF/COG, and **`rio-rgbify`** (MIT) to encode a DEM as terrain-RGB tiles for MapLibre. Add rasterio to `.venv` (small risk; it is a binary wheel with its own GDAL).
- **NASA GIBS** (open, no key): WMS (`/wms/epsg4326/best/wms.cgi`, any bbox and size, a `TIME` parameter) and WMTS (EPSG:3857 `GoogleMapsCompatible_LevelN`). It has 1 000+ layers, including GOES/Himawari/Meteosat GeoColor, VIIRS/MODIS true colour, IMERG, MERRA-2 and SST. **Picture layers use their own palettes (often rainbow)**, so use them for true-colour imagery and take *data* for quantities.
- **NOAA Science On a Sphere** datasets: equirectangular movie frames, mostly public NOAA/NASA. Partner sets are restricted, and the catalogue says "for educational use". Use them as inspiration or a rare clip with credit; prefer rebuilding.
- **Other strong 2025–2026 options:**
  - **PMTiles** (single-file tile archives, BSD) for **offline, deterministic MapLibre tiles** (strongly recommended with T2).
  - **Mapterhorn** (open terrain tiles, 2025; verify licence per source before use).
  - **Blender + BlenderGIS** (GPL tool; outputs free) for cinematic one-off terrain fly-throughs if three.js ever looks too plain (effort L, render minutes per frame).
  - **QGIS 3.x** (GPL; the parallel harness has a `qgis` adapter) for print-quality layouts.
  - **NASA SVS** for reference looks.

---

## 6. Recommended toolchain, ranked (value for the user ÷ effort)

1. **three.js terrain/globe components fed by Python textures** (value 5, effort S–M).
   - New house components: `TerrainTile` (heightmap + drape + exaggeration label in the manifest), `DataGlobe` (equirect texture sequence + coast lines), `LiftedSection` (vertical plane), `SoundingColumn`.
   - Python side: `fluidpy.data` fetchers for Terrain Tiles / Copernicus DEM / ETOPO and for GIBS WMTS on the same tile grid.
   - Evidence: T1.
2. **GIBS satellite loops** (value 5, effort S). A `fluidpy.data.gibs` fetcher (WMS 4326 for cartopy, WMTS 3857 for tiles); archive frames on G:; a Remotion `<ImgSequence>` with cross-fade. Evidence: T6.
3. **cartopy/MetPy frames for 2-D weather loops + GOES underlay** (value 5, effort S; already the house way). Add MetPy front path-effects and the GIBS underlay.
4. **PyGMT in its own env** (value 4, effort M). Relief and location maps; relief textures; climatology maps with relief. Evidence: T3.
5. **MapLibre globe → terrain with local PMTiles** (value 4, effort M). The "space to town" shot only. Evidence: T2 + determinism caveat.
6. **RustGIS CLI** (value 3, effort S). Fast relief and location frames and terrain processing. Evidence: T5.
7. **GeoVista** (value 3, effort S). Model-grid globes. Evidence: T4.
8. **GEE via geemap** (value 3–4 when close zooms or long satellite records are needed; effort M; user account). Composites → drape textures.
9. **datashader** (value 2–3, effort S) for dense point clouds (drifters, Argo).

How it combines with three.js: every Python or GIS product becomes a **texture (PNG/JPG, sRGB), a height grid
(float32 .bin or 16-bit PNG), or geometry (GeoJSON / JSON of line strings / glTF/OBJ)**. These are written by
`movies/data/build_<slug>.py` into the movie's `data/`, listed in the manifest with their source and licence, and loaded
with `staticFile()` + `delayRender` before frame 0. Every camera and time value is a function of `useCurrentFrame()`.

---

## 7. Install recipes actually tested on this machine (for the setup step)

Isolation rule: **anything with large native binaries or a pinned numpy gets its own environment** and talks to
the movie pipeline through files. Nothing below was installed into `.venv` or `movies/`.

| Tool | Env type (tested) | Versions | Disk | Conflicts with `.venv` (numpy 2.5.4, xarray 2026.9.0, matplotlib 3.11.2, cartopy 0.26.0) / `movies/` (React 19.3.1, Remotion 4.0.537, three 0.186.1) | Needs a browser? |
|---|---|---|---|---|---|
| **GeoVista + pyvista + rasterio + cmocean** | `py -3.12 -m venv <dir>`; `pip install geovista rasterio pillow requests cmocean matplotlib` | geovista 0.5.3, pyvista 0.49.1, vtk 9.7.1, rasterio 1.5.2, cmocean 4.0.3 | 685 MB (venv incl. VTK) | Same numpy major; VTK adds about 300 MB and pins nothing in `.venv`. **Separate venv recommended** (VTK/pyvista churn). rasterio alone could go into `.venv` | No (VTK offscreen, OpenGL) |
| **PyGMT** | micromamba (single exe) → `micromamba create -p <env> -c conda-forge python=3.12 pygmt ghostscript`; run via `micromamba run -p <env> python …` | pygmt 0.19.0, GMT 6.7.0, GDAL 3.13.3, ghostscript 10.08, numpy 2.5.4, xarray 2026.9.0 | 1.9 GB before `micromamba clean -a`, **1.4 GB after** | **Must be a separate conda env** (GMT and Ghostscript DLLs). Calling the env's `python.exe` directly fails to find Ghostscript; always use `micromamba run` | No |
| **RustGIS** | portable zip `RustGIS-0.4.0-windows-x86_64-portable.zip` (also `pip install rustgis` = `Session` wrapper; `winget install OpenGeos.RustGIS`) | 0.4.0 | 166 MB unpacked | None (standalone exe) | No (own GPU renderer) |
| **GeoLibre, leafmap, geemap, earthengine-api** | `py -3.12 -m venv`; `pip install rustgis geolibre leafmap geemap` | geolibre 3.5.1, leafmap 0.63.1, maplibre (py) 0.3.6, geemap 0.38.9, earthengine-api 1.7.50, ipyleaflet 0.20.0, numpy 2.5.4 | **1.2 GB** (pulls jupyter/ipywidgets/geopandas stacks) | Pulls many Jupyter and widget pins. **Separate venv** (`.venv` has jupyterlab 4.6.4 and ipywidgets 8.1.9, so a pin clash is likely). Import of geolibre is slow (> 1 min cold) | leafmap/GeoLibre maps need a browser to *see*; GEE does not |
| **MapLibre GL JS, deck.gl, CesiumJS, globe.gl, three** | `npm init -y; npm i maplibre-gl three deck.gl@9 cesium globe.gl` in a **separate folder** (the parallel harness uses `tools/maptools/js/`) | maplibre-gl 6.16.0, deck.gl 9.4.0, cesium 1.146.0, globe.gl 2.46.2, three 0.186.1 | **812 MB** node_modules (all five; Cesium is the largest) | Putting maplibre-gl into `movies/` is low risk (no React dependency; ESM). **deck.gl** brings luma.gl/WebGL2, OK. **Cesium**: big, keep out of `movies/`. **globe.gl** pulls its own `three` (version mismatch risk with three 0.186.1) and must stay out of `movies/` | **Yes**: Remotion's `chrome-headless-shell` (`movies/node_modules/.remotion/…`); Playwright's own Chromium in `.venv` is the wrong build (1234 vs expected 1248), so pass `executable_path` |
| **cartopy, matplotlib, MetPy, cmocean** | already in `.venv` | cartopy 0.26.0, matplotlib 3.11.2 | — | — | No |
| **d3-geo** | already in `movies/` | 3.1.1 | — | — | (Remotion) |

### Minimal headless commands (each renders one PNG; runtime measured here)

```bash
S="G:/Geophysical Fluid Dynamics/aofd-data/scratch/maptools"

# three.js / MapLibre / deck.gl page in Remotion's Chrome: frames 0,150, twice, SHA compare (0.25 s/frame three.js; 0.5-2.7 s MapLibre)
.venv/Scripts/python.exe -I "$S/scripts/shoot.py" "terrain.html?tex=bm&exag=8" "$S/shots" 0,150 --runs 2
.venv/Scripts/python.exe -I "$S/scripts/shoot.py" maplibre.html "$S/shots" 0,240 --runs 2

# PyGMT (2.1 s 2-D map, 13.6 s grdview; first call downloads @earth_relief tiles, 30 s)
MAMBA_ROOT_PREFIX="$S/mamba/root" "$S/mamba/micromamba.exe" run -p "$S/mamba/envs/gmt" python -I "$S/scripts/pygmt_tibet.py" "$S/shots"

# GeoVista (12.7 s cold, 0.8 s warm)
"$S/venv/Scripts/python.exe" -I "$S/scripts/geovista_globe.py" "$S/shots"

# RustGIS (0.4 s warm; use G:/ style absolute paths)
"$S/rustgis_portable/RustGIS-0.4.0-windows-x86_64/rustgis-cli.exe" run \
  --cmd 'layer.addData={"path":"tibet_dem_3857.tif","name":"dem"}' \
  --cmd 'raster.symbology={"layer":"dem","type":"shadedRelief","azimuth":315,"altitude":40,"zFactor":2}' \
  --cmd 'map.goToXY={"lon":88,"lat":32,"scale":12000000}' \
  --cmd 'share.exportMap={"path":"G:/…/shots/rustgis_relief.png","width":1280,"height":720}'

# GIBS time series (15 s for 7 days x 2 layers incl. mp4)
"$S/venv/Scripts/python.exe" -I "$S/scripts/gibs_series.py" "$S/shots"
```

---

## 8. What needs the user

1. **Google Earth Engine (optional; only if we want close-zoom composites or long satellite records).** I created nothing and logged in nowhere. The steps are:
   1. With a Google account, open https://console.cloud.google.com → create a project (e.g. `aofd-ee`).
   2. Register it for **noncommercial use** at https://code.earthengine.google.com/register. Choose "Unpaid usage", type "Academia & Research" (or Education), and answer the questions (PhD climate-dynamics teaching material). Leave it in the **Community Tier**; no billing account is needed.
   3. In the Cloud Console, **enable the Earth Engine API** for that project.
   4. In a separate env (setup step), run: `! "<gee-venv>/Scripts/earthengine.exe" authenticate`. A browser opens; sign in; the token is written to `%USERPROFILE%\.config\earthengine\credentials` (outside the repo, as rule 11 requires).
   5. Tell us the project id. Code will call `ee.Initialize(project="<id>")`.
   
   **What we gain:** cloud-free Sentinel-2 or Landsat drapes for the last seconds of a "space-to-town" zoom; MODIS snow and NDVI seasons; GOES archive frames for any past date; quick server-side IMERG or ERA5-Land totals.
2. **Decision: is the YouTube channel (or any outlet) monetised?** If yes, (a) GEE's noncommercial terms are doubtful (rebuild from the original open sources instead, not via GEE), and (b) CC BY-NC data (EOX s2cloudless 2018+) must be avoided. Recommendation: treat the movies as noncommercial teaching; use CC BY / public-domain data only, so the question never bites.
3. **Decision: which GPU renders movies.** ANGLE picked the Intel Iris Xe, not the RTX A1000. For speed, set Windows *Settings → System → Display → Graphics* to "High performance" for `chrome-headless-shell.exe` (Remotion's), or keep Intel for consistency. Either way, **render a whole movie on one GPU** (§9 R3).
4. **Decision: accept "visual determinism" for MapLibre terrain shots** (≤ 0.02 % pixels differ, only at steep pitch), or require bit-exactness (then use three.js for those shots). Recommendation: accept, with a QA gate on the pixel diff.
5. **Approve the extra environments** (PyGMT conda env ~ 1.4 GB, GeoVista venv ~ 0.7 GB, JS map folder ~ 0.8 GB, RustGIS 0.17 GB, all on G:) before the setup step installs them for agents.

---

## 9. Risks

| # | Risk | Where | Mitigation |
|---|---|---|---|
| R1 | **Live tiles break determinism** (late tiles, LOD races, servers changing) | MapLibre, Cesium, deck.gl TileLayer, GIBS at render time | Fetch everything at *build* time into the movie's `data/` or a PMTiles file on G:; render offline; per-frame `idle` + a QA pixel-diff gate. T2 shows the residual 0.02 % at steep pitch |
| R2 | **First frame races** (image or texture not yet loaded) | deck.gl T7 frame 0, any WebGL page | `delayRender` until every texture `onLoad` / `layer.isLoaded`; render frame 0 twice and keep the second |
| R3 | **GPU and driver differences** change pixels | ANGLE picks Intel Iris Xe here; the parallel harness used SwiftShader | One movie = one GPU; record the renderer string in `qa.json`; never mix frames from two machines |
| R4 | **Licences** | ToS imagery (Esri/Google/Bing/Mapbox), CC BY-NC (s2cloudless 2018+), SOS partner data, GEE noncommercial | Only CC BY / public-domain sources; a licence column in `data/registry.yaml` and the manifest; credit line in the movie description; rebuild instead of reusing |
| R5 | **Rainbow palettes in picture services** | GIBS IMERG/SST picture layers | Use data products and colour them with cmocean; GIBS only for true-colour imagery |
| R6 | **GEE output terms** | GEE free tier is noncommercial; the ToS restricts redistributing "Content" | Treat GEE as a compute convenience; the exported product keeps the source licence; keep the method reproducible outside GEE |
| R7 | **Render time** | MapLibre 1–3 s/frame with terrain; PyGMT 2–14 s; Cesium 15 s first frame | three.js for long shots (0.25 s/frame); MapLibre only for the 5–15 s space-to-town shot; pre-render PyGMT stills, then animate them in Remotion (pan/zoom/cross-fade) |
| R8 | **Size** | 4K drapes, 10-min satellite loops, 16-bit heightmaps | Crop to the region; JPEG q≈90 for drapes; ≤ 2048² textures; GOES frames ~150 kB at 880×770; the 160 MB movie cap still holds |
| R9 | **Young tools change fast** | RustGIS v0.x (14 days old), GeoLibre 3.x, MapLibre v6 ESM | Pin exact versions in the setup recipe; keep them optional helpers, never the only path |
| R10 | **GIBS retention** for geostationary loops | GOES GeoColor via GIBS: a rolling window (Sep 2026 OK, Jan 2026 empty) | Fetch at production time and archive on G:; for older dates use NOAA's GOES on AWS (`noaa-goes16/18`, public) and our own true-colour recipe, or GEE |
| R11 | **Honesty** | vertical exaggeration, gap-filled imagery, blended frames | Exaggeration said in the narration (house rule); interpolated satellite frames noted in the manifest; MODIS swath gaps either shown honestly or VIIRS used instead |

---

## 10. Disk

- **Before:** C: 70 GB free, G: 575 GB free.
- **After the trials** (before clean-up): C: 65 GB, G: 563 GB.
- **Scratch:** `G:/…/scratch/maptools`; data downloads 27 MB (DEM tiles, GIBS, GOES, `@earth_relief`). See the hand-off report for the final size after clean-up.
- **C: drift:** the C: drop is not from this task, which wrote nothing large to C: except the GeoVista cache (`%LOCALAPPDATA%\geovista`, a few MB) and `outputs/maptools/t*` (≈ 22 MB).

## 11. Sources

- RustGIS: https://github.com/opengeos/RustGIS (README, releases v0.4.0), https://rustgis.app, https://itsfoss.com/rustgis-open-source-gis-tool/
- GeoLibre: https://github.com/opengeos/GeoLibre (README), https://geolibre.app, https://gishub.org/blog/geolibre/
- Remotion maps guide: https://www.remotion.dev/docs/maps
- MapLibre GL JS: https://maplibre.org/projects/gl-js/, globe roadmap https://maplibre.org/roadmap/maplibre-gl-js/globe-view
- Earth Engine noncommercial tiers: https://developers.google.com/earth-engine/guides/noncommercial_tiers ; ToS https://earthengine.google.com/terms ; noncommercial https://earthengine.google.com/noncommercial ; `getVideoThumbURL` / `getFilmstripThumbURL` API docs at developers.google.com/earth-engine/apidocs
- Copernicus CC BY 4.0 (2 Jul 2025): https://forum.ecmwf.int/t/cc-by-licence-to-replace-licence-to-use-copernicus-products-on-02-july-2025/13464
- GeoVista: https://github.com/bjlittle/geovista ; earthkit-plots: https://earthkit-plots.readthedocs.io
- NOAA SOS catalogue terms: https://sos.noaa.gov/catalog ; NASA data use policy: https://www.earthdata.nasa.gov/earth-observation-data/data-use-policy
- NASA GIBS: https://nasa-gibs.github.io/gibs-api-docs/ ; AWS Terrain Tiles: https://registry.opendata.aws/terrain-tiles/
- PyGMT `@earth_relief` (SRTM15+ v2.7, Tozer et al. 2019): https://www.pygmt.org
