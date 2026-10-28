---
name: map-toolkit
description: The aofd map and 3-D visual toolkit agents run on their own (with the 2026-10-27 capability-test verdicts, recommended toolchain per visual kind and drop list in §12) - one recipe (YAML) rendered by any of 13 tools behind adapters (matplotlib/cartopy, PyGMT, GeoVista/pyvista, MapLibre GL JS, deck.gl, CesiumJS without Ion, leafmap, RustGIS, QGIS, ArcGIS Pro/arcpy, Google Earth Engine, NASA GIBS, STAC/COG Sentinel-2/Landsat) incl. archived timelapses, before/after pairs and time-series CSVs via tools/maptools/render.py, side-by-side contact sheets with compare.py, selftest.py, the per-visual "data + tool + why + runner-up" choice rule from movies/ch00/series_plan.md, recipe examples for every visual kind (synoptic map, relief, 3-D terrain, globe, texture, heightmap, data-animation frames, satellite overlay), feeding outputs to three.js and Remotion (textures, heightmaps, PNG sequences via staticFile), licences and credit lines (no Esri/Google/Bing/Mapbox imagery), Earth Engine datasets, determinism rules, environments (.venv-maps, GMT micromamba env on G:, tools/maptools/js), the RustGIS/GeoLibre MCP servers. Load for any map, globe, 3-D terrain, section, satellite image, data animation or chart in a movie, explainer or figure.
---

# map-toolkit — the best data and the best tool for every visual

Source: `movies/ch00/series_plan.md` ("Maps and animation…", "Map toolkit set-up", user 2026-10-27),
`research/movie_maps_toolkit.md` (survey, trials T1–T7, matrix §3, data §4, risks §9). Code: `tools/maptools/`.

## 1. When to load
Any **map, globe, 3-D terrain, vertical section, sounding, satellite image, data animation or chart** in a movie
(`motion-graphics`), explainer (`interactive-viz`, `viz3d`) or data figure (`figure-reproduction`). Also when a
reviewer asks "could this static picture be a real map or a data animation?".

## 2. The choice rule (user, 2026-10-27: "don't be rigid … not one time")
For **every** visual, separately, at planning, again while building the scene, and again at review if it is weak:
1. List candidate **datasets** (ERA5 vs GFS vs MERRA-2 vs stations vs satellite; resolution, period, base period,
   licence) and candidate **tools or stacks** (matrix in research §3, table in §4 below).
2. **Try the promising ones** on that visual: `compare.py RECIPE --tools a,b,c [--data x,y]` (one contact sheet).
3. Pick by clarity of the message, looks, honesty (data traceable), determinism, licence, render time and size.
4. Record it in the storyboard scene:
   ```yaml
   data: ERA5 msl 0.25° 12 UTC 2 Nov 2023 (data/derived/ch00/era5_global_2023-11-02T12_sfc_0p5.nc)
   tool: mpl (cartopy LCC + prepared isobars) -> Remotion <Img> sequence
   why: crispest isobars and coast at 1080p, byte-deterministic, 6 s/frame
   runner_up: pygmt (nicer frame, but 2x slower and no MetPy fronts)
   compare: outputs/maptools/compare/ciaran_isobars__20261027T121737.png
   ```
The general survey is only the starting list, never the decision.

## 3. Commands (repo root; all run from the project `.venv`, which calls the right environment)
| Command | What |
|---|---|
| `.venv/Scripts/python.exe tools/maptools/render.py RECIPE.yaml [--tool T] [--out DIR] [--fresh]` | one render + sidecar `<png>.json` |
| `.venv/Scripts/python.exe tools/maptools/render.py RECIPE.yaml --tool T --check` | render twice; bytes/pixels equal? |
| `.venv/Scripts/python.exe tools/maptools/render.py --list` | tools, environments, availability |
| `.venv/Scripts/python.exe tools/maptools/compare.py RECIPE.yaml --tools mpl,pygmt,qgis[,…|all] [--data a.nc,b.nc] [--var v]` | contact sheet in `outputs/maptools/compare/` |
| `.venv/Scripts/python.exe tools/maptools/selftest.py [--quick] [--tools …] [--only tool:recipe,…] [--determinism] [--update \| --update-missing]` | adapter self-test (`--update-missing` writes references for new cases only) |
| `.venv/Scripts/python.exe tools/maptools/qgis_process.py list --grep hill` / `run gdal:hillshade INPUT=… OUTPUT=…` | QGIS processing (GDAL/GRASS/native) for prep |
| `.venv/Scripts/python.exe tools/maptools/install.py --step report` | versions, sizes, disk |
| `.venv/Scripts/python.exe tools/maptools/mcp_test.py --server rustgis|geolibre [--data f]` | MCP smoke test |
Outputs: `outputs/maptools/<recipe>/<tool>/` (git-ignored); `gee`/`gibs`/`stac` outputs: `G:/…/aofd-data/derived/maptools/<recipe>/<tool>/` (never C:). Prepared grids: `G:/…/aofd-data/scratch/maptools_runs/<recipe>_<hash>/`
(shared by all tools for one recipe; `--fresh` redoes it).

## 4. Tools: strengths, weaknesses, environment
| tool | env | best for | weak at | 1 render (here) |
|---|---|---|---|---|
| `mpl` (matplotlib + cartopy) | `.venv` | synoptic maps, isobars, climatology, sections, **textures and heightmaps**, PNG sequences; MetPy fronts | 3-D | 3–16 s, **byte-identical** |
| `pygmt` (GMT 6.7) | micromamba env `G:/…/envs/gmt` | publication relief/location maps, `grdgradient` shading, `grdview` 3-D stills | camera moves (each angle a new run), speed of grdview | 4–65 s, pixel-identical |
| `geovista` (pyvista/VTK) | `.venv-maps` | quick xarray → globe, model grids (cubed sphere, ICON, ORCA); warped regional terrain | fine cartography | 7 s |
| `maplibre` (GL JS 6.16) | Remotion chrome-headless-shell, GPU | Web-Mercator/globe maps with GeoJSON lines; pitch | poles (±85°), terrain needs tiles (use deck.gl/three.js) | 4–7 s |
| `deckgl` (9.4) | same browser | **TerrainLayer** 3-D terrain from our Terrarium heightmap + drape, `_GlobeView`, TripsLayer for trails | labels; GlobeView experimental | 6–31 s |
| `cesium` (1.146, **no Ion**) | same browser | globe with our single-tile imagery + **CustomHeightmapTerrainProvider** from our grid | heavy, slow first frame; default terrain/imagery need Ion (never used) | 6–16 s |
| `leafmap` (folium) | `.venv-maps` | quick HTML previews for notebooks/storyboarding | final frames (Mercator only, CDN JS) | 11 s |
| `rustgis` (0.4.0 Python Session) | `.venv-maps` | very fast batch maps, `map.terrain` tilts, many projections incl. globe, raster functions (hillshade, slope, viewshed) | always draws a scale bar; v0.x changes fast | 1.5–3 s |
| `qgis` (3.34.1, user's install) | `python-qgis.bat` (Py 3.9) | cartographic layouts, rule-based styling, labelling, **processing** (GDAL/GRASS) | 3-D view not exported headless | 2–11 s |
| `arcgis` (Pro 3.7, user's install) | `propy.bat` (`arcgispro-py3`) | heavy raster/multidimensional analysis (Spatial + Image Analyst licensed), layouts | slow start (~50 s arcpy import); Esri content licences | 55–135 s |
| `gee` (earthengine-api 1.7.50) | `.venv-maps` | **timelapse, before/after, time series (CSV)**, server-side composites, long satellite records, ERA5-Land/IMERG/MODIS/OISST without downloads | quotas; thumbnails ≤ ~32 MB | 5–30 s |
| `gibs` (NASA GIBS WMS) | `.venv-maps` | true-colour satellite pictures: VIIRS/MODIS daily, GOES/Himawari GeoColor every 10 min; timelapse, before/after | data layers use rainbow palettes (take data instead); geostationary archive is a rolling window | 1–6 s |
| `stac` (Earth Search / Planetary Computer) | `.venv-maps` | Sentinel-2 / Landsat scenes (10–30 m) for close zooms and event before/after | cloud cover; scene edges (mosaicked from the best items) | 10–25 s |

Notes per tool:
- **PyGMT** grids come only from `prep` (never `@earth_relief` remote grids in an adapter run; fetch DEMs through
  `fluidpy.data.fetch`). The env is used without activation: `common.env_vars("gmt")` puts `Library/bin` (Ghostscript
  `gswin64c`) on PATH and `GMT_USERDIR` on G:.
- **QGIS 3-D**: QGIS 3-D map views need an interactive OpenGL window; this adapter renders 2-D only and says so in
  `notes` when a recipe has a `camera`. For 3-D use deck.gl / RustGIS / GeoVista / PyGMT / three.js.
- **ArcGIS**: layers are only our own open data; any default basemap the user's settings add is removed and logged
  in `notes`; sidecar `licence_flags` says no Esri basemap / Living Atlas was used. RGB composites have no arcpy
  colorizer: the adapter sets an identity stretch through the CIM (`getDefinition("V3")`), else colours drift.
  `propy.bat …/arcgis_adapter.py --licence` lists extensions. Prep where arcpy is strong:
  `style.contours.engine: arcgis` (`arcpy.sa.Contour`), `style.hillshade: arcgis` (`arcpy.sa.Hillshade`), and for
  multidimensional netCDF/zarr in a prep script: `arcpy.md.MakeMultidimensionalRasterLayer`,
  `arcpy.ia.AggregateMultidimensionalRaster`, `arcpy.ia.GenerateTrendRaster`, `arcpy.md.SubsetMultidimensionalRaster`.
- **PyGMT `kind: texture`**: the map is always cropped (`savefig(crop=True)`) and rasterised at the dpi that maps the
  map width to exactly `size[0]` pixels; the height follows the region's lon:lat aspect (2:1 global) and the size is
  capped at `MAX_TEXTURE` = 16384 x 8192 (sidecar `notes` say when it was changed). The old crash: GMT modern mode
  draws on an 11.6-m page, so an uncropped save was a ~4.6-gigapixel raster.
- **GeoVista texture route**: `add_base_layer(texture=)` crashes with geovista 0.5.3 + pyvista 0.49 (`core.combine`).
  The adapter's `add_texture()` makes each image pixel one cell of `gv.Transform.from_1d(lon_edges, lat_edges,
  data=rgb, rgb=True)` (rows north to south), drawn unlit, reduced (Lanczos) to at most 1.5 M cells
  (`MAX_TEXTURE_CELLS`; 7200x3600 GIBS -> 1732x866, 31 s at 800x800).
- **GeoVista**: never give a mesh a translucent NaN colour (`nan_opacity=0`): VTK then depth-sorts the whole globe
  wrongly and the far hemisphere shows through. Always `ResetCameraClippingRange()` after moving the camera.
- **Web tools** (MapLibre, deck.gl, Cesium, leafmap, any three.js page): one browser, `adapters/_browser.py`: Remotion's
  `movies/node_modules/.remotion/…/chrome-headless-shell.exe` with `--use-angle=d3d11` on the RTX A1000 (user's
  Windows graphics setting). The WebGL renderer string is recorded in the sidecar (`tool_version`, `notes`); a software
  renderer **fails loudly**. `MAPTOOLS_GL=swiftshader` is an explicit opt-in only. Pages are `tools/maptools/js/node_modules` on 127.0.0.1; **every non-local request is aborted**
  and listed in `notes`; deck.gl's terrain worker is served locally (`@loaders.gl/terrain/dist/terrain-worker.js`).

## 5. Recipe format (`tools/maptools/recipes/*.yaml` are working examples)
```yaml
name: ciaran_isobars            # output file stem
tool: mpl                       # default tool (compare.py overrides)
kind: png                       # png | png_sequence | texture (2:1 equirect, no axes) | heightmap (16-bit + Terrarium)
data:
  - path: data/derived/ch00/era5_global_2023-11-02T12_sfc_0p5.nc   # repo-relative, absolute, or ${DATA}/raw/...
    var: msl
    scale: 0.01                 # Pa -> hPa (value*scale + offset)
    units: hPa
    time: first                 # first | all | "2023-11-02T12" | [list] | {start, stop, step}
    level: 850                  # if the variable has a level dim
    stride: 1                   # subsample
region: [-30, 20, 35, 65]       # lon0, lon1, lat0, lat1 | global
projection: {name: lambert_conformal, lon0: -5, lat0: 50}   # platecarree|mercator|robinson|orthographic|lambert_conformal|stereographic
camera: {azimuth: 170, elevation: 35, exaggeration: 6, zsize_cm: 1.0}   # 3-D tools; exaggeration must be said in narration
style:
  cmap: cmocean.dense_r         # cmocean.* or viridis family; jet/rainbow/hsv refused by prep
  vmin: 950
  vmax: 1030
  center: null                  # diverging: symmetric about this value
  hillshade: false              # true (Horn, prep) | arcgis
  shade_alpha: 0.35
  contours: {interval: 4, color: "#111111", width: 0.9, labels: false, engine: prep}   # engine: prep|qgis|arcgis
overlays: [coast, borders]      # coast|coast_110m|borders|land (Natural Earth from G: raw) or {geojson: path, kind: coast}
layers: []                      # symbol layers: points + labels, H/L centres, vectors, fronts (section 5a)
labels: false
size: [1920, 1080]
per_tool: {pygmt: {size: [1280, 720]}}   # optional per-tool overrides
```
A second `data:` item with `role: texture` (or `underlay`) is an equirectangular image (bounds from `bounds:
[w, s, e, n]`, else its sidecar JSON `bounds_wsen` / `lon_edges`+`lat_edges`, else global). GeoVista drapes it as an
RGB cell mesh (`recipes/globe_texture.yaml`); `style.show_field: false` hides the scalar field under it (the default
when a texture is given) and `style.texture: field` drapes the LUT-coloured (+ hillshaded) field image instead.

## 5a. Symbol layers: full synoptic charts (`layers:`; example `recipes/ciaran_synoptic.yaml`)
Overlays are lines only (any GeoJSON overlay draws as a thin coast line). Points, labels, wind and fronts go in
`layers:`, prepared once by `prep.prepare_layers` into tool-neutral files in the work dir:
```yaml
layers:
  - type: vectors                # u/v from data[0].path unless given; same time spec as data[0]
    u: {var: u10}                # or {path, var, time, level, scale}
    v: {var: v10}
    scale: 1.94384               # m/s -> kt (barbs are in knots)
    units: kt
    style: barbs                 # barbs (WMO) | arrows
    density: [14, 9]             # barbs across x down, regridded in the map plane
    margin_deg: 0                # widen the cut (degrees) if barbs must reach the frame edge
  - type: fronts                 # GeoJSON LineStrings with properties.kind: cold|warm|occluded|stationary|trough
    path: tools/maptools/recipes/layers/fronts_era5_2023-11-02T12.geojson
    temperature: {path: data/derived/ch00/era5_ciaran_2023_850hPa_1h.nc, var: t, time: "2023-11-02T12"}
                                 # orients the symbols: cold triangles into the warm air, warm scallops into the cold
  - type: extrema                # H / L letter + central value under it
    auto: {window_deg: 10, min_prominence: 4, max: 4}   # found in the recipe field per frame (cartostyle.find_extrema)
    # path: hl.geojson           # or fixed centres: Points with properties kind (low|high) and value (or hPa)
    # letters: {low: T, high: H} # e.g. German charts
  - type: points                 # Natural Earth places and/or a GeoJSON and/or inline items
    places: {max_scalerank: 7, keep: [London, Paris, Brest], rename: {"København": Copenhagen}}  # zip default: NE 10m simple
    # path: stations.geojson     # Points with properties name, rank (lower = more important), kind
    # items: [{name: Brest, lon: -4.49, lat: 48.39, rank: 0}]
    promote: [Brest]             # the story place: labelled first, leader line allowed
    max_labels: 7
    label: true                  # false = markers only
    marker: true
```
Prepared files: `points_<k>.geojson`, `extrema_<k>_<t>.geojson`, `vectors_<k>_<t>.nc` (u, v in the layer units),
`fronts_<k>.geojson` (each front gets `warm_left`, the warm side relative to its drawing direction, from the
temperature) + `fronts_<k>_t.nc`. Every layer source is in the sidecar `data[]` with licence and credit (our GeoJSON
layers carry top-level `licence` / `attribution`). Labels never drape on textures, globes or terrain.

| tool | vectors | fronts | H / L | points + labels |
|---|---|---|---|---|
| `mpl` (`cartostyle`) | WMO barbs (`wind_barbs`) or arrows | WMO/NWS symbols, MetPy, oriented by temperature (`draw_fronts`) | `mark_extrema` | `label_points`: Imhof positions, halos, collision-free; order H/L → promoted places → isobar values (`style.contours.labels`) → other places; drops reported in `notes` |
| `pygmt` | arrows (length ~ speed) | GMT `-Sf` triangles / semicircles on the `warm_left` side | letters + value (halo) | dot + label (halo), **no collision avoidance** |
| `deckgl` | arrows | coloured line + side dots | TextLayer letters + value | dots + TextLayer labels, no collision avoidance |
| `maplibre` | arrows | coloured lines | circles (no text: needs a glyph server) | circles, no text |
| `geovista`, `cesium`, others | not drawn (sidecar `notes` say so) | | | |
Style preset for mpl: `style.cartostyle: movie | notebook | print` (default notebook, sized to the render).
**Final synoptic charts: mpl + cartostyle.** The others are for comparison or a quick look.
Google Earth Engine recipes replace `data:` with a `gee:` block (`recipes/gee_era5_mslp.yaml`; see §8).

Recipe per visual kind (start from these files):
| kind | recipe | first tools to compare |
|---|---|---|
| synoptic isobar map | `ciaran_isobars.yaml` | mpl, pygmt, qgis |
| global field map | `global_mslp.yaml` | mpl, pygmt, qgis, rustgis |
| relief / 3-D terrain still | `alps_relief.yaml` (camera) | pygmt, deckgl, rustgis, geovista, cesium |
| globe still | `globe_mslp.yaml` | geovista, cesium, mpl (orthographic) |
| three.js globe texture | `global_texture.yaml` (kind texture) | mpl, pygmt |
| full synoptic chart (barbs, fronts, H/L, places) | `ciaran_synoptic.yaml` (`layers:`) | mpl (cartostyle); pygmt, deckgl for comparison |
| image draped on a globe (GeoVista) | `globe_texture.yaml` (data item `role: texture`) | geovista, cesium, three.js |
| heightmap for three.js / deck.gl | `alps_heightmap.yaml` (kind heightmap) | mpl |
| data animation frames | `ciaran_850_loop.yaml` (png_sequence) | mpl, pygmt, qgis |
| satellite + analysis | add a second `data:` item `{path: …gibs….jpg, role: underlay}`; mpl draws it with `imshow(extent)` in a figure script | mpl |
| server-side composite | `gee_era5_mslp.yaml` | gee |

## 5b. Remote sources: timelapse, before/after, time series (GEE, GIBS, STAC)
Recipes put a `gee:`, `gibs:` or `stac:` block where local recipes put `data:`.

**User rule (2026-10-27): nothing downloaded or exported from Earth Engine (or GIBS/STAC) ever lands on C:.** That
covers GeoTIFF/COG, thumbnails, filmstrips, video, CSV/Parquet tables, shapefiles/GeoJSON, any raster or vector:
- every server response is archived at `G:/Geophysical Fluid Dynamics/aofd-data/raw/<GEE|GIBS|STAC>/<recipe-or-purpose>/<request-hash>/`
  as `data.<ext>` + `request.json` (asset IDs, region, dates, scale/offset, composite, visualisation, reducer,
  scale_m, licence + credit, time fetched, sha256);
- rendered products of these tools go to `G:/…/aofd-data/derived/maptools/<recipe>/<tool>/` (render.py redirects any
  C: `--out` for `gee`/`gibs`/`stac` and records `redirected_from` in the sidecar; compare sheets that include them go
  to `G:/…/derived/maptools/compare/`);
- the `.venv-maps` subprocess runs with `TEMP`/`TMP`/`TMPDIR` = `G:/…/scratch/tmp_maps`, `GEEMAP_CACHE`,
  `LEAFMAP_CACHE`, `XDG_CACHE_HOME`, `MPLCONFIGDIR` under `G:/…/cache/`; in your own geemap/leafmap code pass
  `out_dir=` / `filename=` on G: (e.g. `geemap.download_ee_image(img, "G:/…/raw/GEE/<purpose>/<hash>/x.tif")`);
- `selftest.py` FAILs any remote case whose output or archive path is not on G:.
A re-render with the same request reads the archive and never touches the network (`MAPTOOLS_OFFLINE=1` makes a
miss an error). The sidecar lists every request with `cache_hit`. Copy only what a movie needs (frames, CSV) into
the movie's `data/` at build time, with the sidecar's provenance.

| kind | what you get | teaches best | example recipe |
|---|---|---|---|
| `timelapse` | `frames/<name>_NNNN.png` (+ `<name>.mp4` with `style.mp4`), one composite per step | **change over time**: El Niño building, a monsoon season, sea ice retreat, a storm crossing, snow cover | `gee_sst_anom_timelapse.yaml` (OISST anomaly, monthly), `gibs_ciaran_timelapse.yaml` (VIIRS daily) |
| `before_after` | `<name>_before.png`, `<name>_after.png` (same region, projection, size, stretch; + `_diff.png` with `style.diff` on GEE) for a split/wipe/swipe in Remotion | **an event's impact**: flood extent, wildfire scar, glacier retreat, drought NDVI, SST before/after a cyclone, sea ice minimum vs a past year | `gee_flood_before_after.yaml` (2022 Indus floods, MODIS false colour), `stac_derna_before_after.yaml` (Derna 2023, Sentinel-2) |
| `timeseries` | `<name>.csv` + `.parquet` (start, value[_region…], units, asset, band, reducer, scale_m) + a quick `_chart.png`; the movie/notebook draws its own chart from the CSV | **"is this unusual compared with history?"**: Niño 3.4 anomaly, a city's T2m, basin rainfall, regional NDVI; ranks, records, anomalies vs a base period | `gee_nino34_timeseries.yaml`, `gee_dhaka_t2m_timeseries.yaml` |
| `png` | one picture | a single moment | `gee_era5_mslp.yaml` |

GEE block keys: `asset`, `band` or `rgb: [b1,b2,b3]`, `scale`/`offset` (server-side), `composite`
(first|mean|median|max|min|mosaic), `window` (default = step), `dates: {start, stop, step: "1 month"|"7 day"|"6 hour"}`
or `date`, `before`/`after: {start, stop}` or `{date}`, `filter_lt: {CLOUDY_PIXEL_PERCENTAGE: 30}`, for time series
`geometry: {point: [lon, lat]} | {bbox: [w, s, e, n]} | {geojson: path}` (several features → one column each, `name`
property), `reducer`, `scale_m`. Visualisation = recipe `style` (`cmap` cmocean/viridis LUT sent as the palette,
`vmin`/`vmax`); true colour/false colour via `rgb` + `vmin`/`vmax` (+ `gamma`). Never rainbow.
GIBS block: `layer`, `format`, `date`/`dates`/`before`/`after` (10-min GOES layers take times). STAC block: `api`,
`catalog`, `collection`, `asset` (default `visual`), `max_cloud`, `max_items`, windows as above.
Exploring before a storyboard: `geemap.Map().split_map(...)` / `leafmap.split_map(...)` in a notebook (`.venv-maps`
kernel) is fine for looking; the **movie frames come only from the exported images**.
Time-series charts are data, not pictures: load the CSV in `movies/data/build_<slug>.py`, compute anomalies/ranks with
tested code, and draw with the house chart components (draw-on lines, counting values).

## 6. Feeding three.js and Remotion
- **Textures**: `kind: texture` → equirectangular 2:1 PNG, edges at ±180°/±90°, sRGB. In the movie, copy it into the
  movie's `data/` (or the bundle `public/` via the build script) and load with the kit loader:
  `const tex = useTex(staticFile("wb/t2m_texture.png"));` (`kit_*/globe.tsx` delays render until loaded).
- **Heightmaps**: `kind: heightmap` → `<name>_height.png` (16-bit grey, z = zmin + v/65535·(zmax − zmin)) and
  `<name>_height_terrarium.png` (z = R·256 + G + B/256 − 32768); the sidecar holds `bounds`, `zmin`, `zmax`. Displace a
  `PlaneGeometry` in a vertex shader or on the CPU; multiply by the stated exaggeration.
- **Image sequences**: `kind: png_sequence` → `frames/<name>_0000.png …`; in Remotion pick
  `staticFile(`seq/${name}_${String(i).padStart(4, "0")}.png`)` with `i` a pure function of `useCurrentFrame()`;
  cross-fade between data hours if the data step is coarser than the frame step (say "interpolated" in the manifest).
- **Lines**: prepared `contours_*.geojson` / `overlays.geojson` in the work dir are the same lines every tool drew:
  reuse them as three.js line geometry so 2-D and 3-D shots agree.
- Every file used goes in the movie manifest with the sidecar's `data[]` (path, sha256, licence, credit).

## 7. Licences and credits
The sidecar `credit_line` is built from netCDF `licence`/`attribution` attributes (fallbacks in `common.LICENCE_FALLBACK`).
- ERA5 (CDS/ARCO/GEE): CC BY 4.0, "Contains modified Copernicus Climate Change Service information".
- GFS, NOAA OISST/ERSST/GOES, ETOPO 2022 (doi:10.25921/fd45-gt74), USGS SRTM: US public domain (credit NOAA/USGS).
- NASA GIBS / MODIS / VIIRS / IMERG / Blue Marble: open, credit "NASA EOSDIS GIBS / Worldview".
- Natural Earth: public domain ("Made with Natural Earth").
- Sentinel-2: "Contains modified Copernicus Sentinel data <year>". EOX s2cloudless 2018+ is CC BY-NC-SA (allowed: non-monetised; credit EOX).
- Every sidecar has a `licences` list (dataset, licence, status, credit) and `credit_line`. **User decision
  2026-10-27: the movies are educational and non-monetised**, so noncommercial (CC BY-NC) datasets are allowed
  (status `ok (noncommercial …)`), always credited. Status `check` = read the catalogue page (GEE partner/community
  datasets such as `JAXA/`, `projects/sat-io/`, Planetary Computer collections) and record the result.
- **Never**: Esri basemaps/Living Atlas, Google, Bing, Mapbox imagery, Cesium Ion default assets (terms forbid or
  restrict redistribution in public video/repos). Tool licences (GMT LGPL, QGIS GPL, ArcGIS proprietary) do not
  restrict our outputs.

## 8. Google Earth Engine
Project from env `AOFD_EE_PROJECT` (default `uhiphd`, the user's registered project; not a secret);
`ee.Initialize(project=…)` with the credentials the user created with `earthengine authenticate` (stored in
`%USERPROFILE%\.config\earthengine\`; never copy them anywhere). Free tier = noncommercial; download results once,
store on G: with provenance, never fetch at render time. Datasets we would use (licence = the source's):
| asset | use | licence |
|---|---|---|
| `ECMWF/ERA5/HOURLY`, `ECMWF/ERA5/DAILY`, `ECMWF/ERA5_LAND/HOURLY` | weather/climate fields, land climatologies | CC BY 4.0 (Copernicus) |
| `NASA/GPM_L3/IMERG_V07` | rain rate, monsoon, cyclone totals | NASA open |
| `NOAA/CDR/OISST/V2_1`, `NOAA/CDR/SST_PATHFINDER/V53` | SST and anomalies | public domain |
| `NOAA/GFS0P25` | forecast fields | public domain |
| `NOAA/GOES/16/MCMIPF`, `NOAA/GOES/18/MCMIPF` | archived full-disk imagery for any date | public domain |
| `MODIS/061/MOD09GA`, `MODIS/061/MCD43A4`, `MODIS/061/MOD10A1` | true colour, snow cover, NDVI seasons | NASA open |
| `COPERNICUS/S2_SR_HARMONIZED` | cloud-free 10 m drapes for close zooms | Copernicus Sentinel terms (attribution) |
| `LANDSAT/LC09/C02/T1_L2` | 30 m composites | public domain (USGS) |
| `NASA/NASADEM_HGT/001`, `USGS/SRTMGL1_003`, `COPERNICUS/DEM/GLO30` | terrain | public domain / Copernicus DEM free with attribution |
| `NASA/OCEANDATA/MODIS-Aqua/L3SMI` | SST, chlorophyll | NASA open |
Avoid `JAXA/GPM_L3/GSMaP` and other assets whose page restricts use, unless checked.

## 9. Determinism rules
- One recipe → one prepared work dir (hash of the recipe minus the tool) → every tool reads identical numbers.
- **Byte-identical**: mpl (Agg, PNG metadata stripped). **Pixel-identical on this machine**: PyGMT, GeoVista, QGIS,
  RustGIS (verify with `--check`). **Pixel-identical on this machine and GPU**: web tools (Remotion chrome-headless-shell, ANGLE D3D11, RTX A1000,
  device scale 1, `window.__ready` only after the library's idle event + extra frames; Cesium waits for
  `globe.tilesLoaded && dataSourceDisplay.ready` for 30 frames; deck.gl decodes every image (ImageBitmap) and parses
  every GeoJSON before building the Deck, then waits until every layer and sub-layer is loaded and a canvas probe is
  unchanged for 30 frames). Measured 2026-10-28, two fresh-page renders each: deck.gl BitmapLayer maps (Ciarán
  isobars, the same with an 8192-px image) byte-identical; the synoptic chart with point/label/front layers,
  TerrainLayer (Alps) and `_GlobeView` are approx-stable — the synoptic chart differs in 3-13 of ~1 M pixels by ≤ 6/255
  near fronts/labels (re-measured 2026-10-28, three renders), the others by 1/255 in 2-25 pixels (GPU rasterisation, not loading). Another GPU/driver changes pixels slightly.
  **Tolerance** (mean |Δ| ≤ 0.5/255): ArcGIS export. GEE thumbnails change if the catalogue is reprocessed.
- Never mix frames of one shot from two tools, GPUs or machines; record the tool version from the sidecar.
- No wall-clock anything: camera and time are recipe values (or a function of the frame number in Remotion).
- No remote tiles, fonts or workers in final frames (web adapter aborts them; RustGIS basemap `blank`).

## 10. MCP servers (drafted, the orchestrator decides)
Draft: `tools/maptools/mcp_rustgis.json`. RustGIS `rustgis-cli mcp` (portable exe on G:, stdio, 12 tools incl.
`view_map`, `snapshot`, `run_tool`, `run_command`; file and network access OFF unless `--yes`; data passed with
`--data`; audit log in `%LOCALAPPDATA%\RustGIS\mcp-audit`). GeoLibre `geolibre-mcp --root <dir>` (authors
`.geolibre.json` projects; reads/writes only inside `--root`; 60+ tools; previews need the GeoLibre app).

## 11. Environments and disk
`.venv-maps` (repo root, git-ignored, ~1.6 GB), `G:/…/aofd-data/envs/gmt` (micromamba, ~1.4 GB; root prefix
`envs/_micromamba`, packages `cache/conda-pkgs`), `tools/maptools/js/node_modules` (~0.6 GB), RustGIS portable
`G:/…/envs/rustgis-0.4.0`. Caches on G: (`cache/pip`, `cache/npm`, `cache/geovista`, `cache/gmt_user`).
Install/upgrade only with `tools/maptools/install.py` (C: floor 12 GB for installs; reports disk before/after).
Never install into `.venv`, `.venv-tts`, `movies/`, QGIS or ArcGIS Pro.

## 12. Capability tests: what works (2026-10-27; `research/capability_tests.md`)
The evidence is on G: in `captests/` (`INDEX.html`, `showcase.mp4`, and `_scripts/` holding every script that made
an output). These defaults hold for the movies until a new test says otherwise. Still run §2 for every visual.

| visual | use | runner-up | proven by |
|---|---|---|---|
| synoptic chart | cartopy + MetPy + `cartostyle` movie preset (cartography skill) | d3-geo SVG in Remotion, built layer by layer | `S1_*/cartopy_metpy_pro/s1_pro.py`, `CTS1Build` |
| satellite + analysis | GIBS image (`data/derived/ch00/*modis*`) + cartostyle lines (white, dark halo) | GIBS + d3-geo overlay | `_scripts/pro_maps.py s2` |
| relief / locator | cartostyle hillshade tint + places + scale bar + locator globe | PyGMT | `pro_maps.py s3` |
| climatology | GEE `ee.data.computePixels` server mean → nc → cartostyle Equal Earth | PyGMT | `_scripts/gee_jobs.py s4` |
| chart from values | GEE `reduceRegion` (render.py `kind: timeseries`) / `getRegion` per year → CSV → Remotion SVG | matplotlib | `CTA6Chart` |
| animated weather map | d3-geo in Remotion; hourly contours precomputed to JSON; cross-fade the hours | cartopy frames | `CTA1D3` |
| wind particles | Python RK2 tracks (scipy RegularGridInterpolator, fixed seed) → `.bin` → three.js `lineSegments`/`points` | deck.gl TripsLayer page | `CTA2Particles` |
| satellite loop | GIBS `timelapse` (GOES-East GeoColor hourly; archive at once: rolling window) | GEE `getVideoThumbURL` (IR, day and night) | `A3_*` |
| timelapse | GEE `kind: timelapse` frames (cmocean palette) + a Remotion colour bar | geemap (needs work-arounds) | `CTA4Bar` |
| before/after | GEE/STAC `before_after` + Remotion slider (eased keyframes: glide, pause, reverse, settle; then a difference pass) | offline HTML swipe | `flights.tsx Slider` |
| globe + field / animation | three.js `SphereGeometry` + cartopy `kind: texture` (sequence; cross-fade in a shader) | CesiumJS SingleTile | `CTG1Globe`, `CTG2Globe` |
| static map → 3-D | three.js: exact sphere patch (`SphereGeometry(r, …, π+w, e−w, 90−n, n−s)`), heightmap drape, tilted plate; **lines draped, labels as billboards** | CesiumJS imagery drape + custom heightmap | `CTH2HGlobe`, `CTH2HTerrain`, `CTC1Plate` |
| terrain / fly-over | three.js `PlaneGeometry` displaced from ETOPO (float32 `.bin`) + Blue Marble crop | deck.gl TerrainLayer | `CTT1Terrain` |
| camera flights | slerp the sub-camera point, ease log(distance) and tilt (`flights.tsx flight()`); ETOPO-displaced globe (`displacementMap`, ×30) | MapLibre globe + terrain | `CTFlightA/B/C` |
| space → town | MapLibre globe → terrain, local XYZ tiles (`_scripts/tiles.py`) | three.js globe → terrain cross-fade | `T3_*` |
| sections, soundings, stacks | three.js planes/columns with matplotlib textures | — | `CTX1/2/3` |
| terrain prep | `qgis_process` `gdal:hillshade` (multidirectional) / `gdal:contour`; RustGIS `raster.function hillshade` → `share.exportRaster` | Horn hillshade in prep | `C4_*`, `C3_*` |

Recipes and patterns that worked:
- **Remotion three.js textures must be loaded before the canvas mounts.** The kit's `Stage assets=[…]` preloads
  textures and `.bin` files. A texture that arrives after R3F has drawn the frame is never drawn: the frame comes out
  blank.
- **ShaderMaterial**: `#include <colorspace_fragment>` must sit on its own line.
- **Remotion bundles copy `public/` at bundle time.** Re-bundle after changing any asset or JSON.
- **Render in pieces in the foreground**: 1500 frames at concurrency 2, ports 4800+. Measured cost was 0.06–0.17
  s/frame; the heaviest scene took 0.09.
- **Equirectangular drapes**: savefig can leave a white last column, which shows as a dateline seam. Pad the edge
  columns.
- **Draped text fails on terrain and globes** in every tool.
  - Draw it in Remotion as billboards with a fixed pixel size.
  - Fade them at the limb (dot < 0.15).
  - Run a greedy collision pass in priority order (kit `Billboards`).
- **MapLibre tiles**:
  - Build tile URLs as `new URL(base) + "{z}/{x}/{y}.png"`, so the braces are not percent-encoded.
  - Fill regional tiles from the global layer outside their bounds.
  - Use one terrain source at a time, switched by zoom.
  - Wait for `idle` per frame.
  - Steep-pitch frames do not repeat in a fresh page.
- **Interactive pages work offline**: libraries in `captests/_web/lib`, `serve.py` (ES modules and workers do not
  run from `file://`).
- **Screen recordings**: Playwright video needs `playwright install ffmpeg`. Use a screenshot per interaction step
  instead (`_scripts/interact.py`).
- **GEE grids for our own colouring**:
  ```
  ee.data.computePixels({"expression": img, "fileFormat": "NUMPY_NDARRAY",
                         "grid": {"dimensions": …, "affineTransform": …, "crsCode": "EPSG:4326"}})
  ```
  Archive the result with `adapters/_remote.cached`. GEE `ECMWF/ERA5/MONTHLY` ends 2020-06. GEE `NOAA/GOES/19/MCMIPF`
  is current.
- **A storm-centre track** needs continuity: take the nearest local minimum to the previous hour's centre. A
  min-in-box search jumps between lows.

Drop list:
- **ArcGIS**: not tested (user decision).
- **PyGMT `grdview` drapes and animation.**
- **MapLibre and deck.gl data globes**: polar holes.
- **MapLibre at steep pitch in final frames.**
- **leafmap split map** (CDN, tile server) and **geemap timelapse** in the pipeline.
- **Draped text.**
- **RustGIS globe**: ignores lon0/lat0.
- **GeoVista `add_base_layer(texture=)`**: crashes with pyvista 0.49; the adapter uses its RGB-mesh `add_texture()`.
- **datashader**: not installed.
- **GeoLibre MCP for frames.**

MCP:
- `rustgis-cli mcp` answers `run_command {"command": "raster.function", "params": {...}}` in about 0.1 s.
- The `run` tool takes `id {json}` lines.
