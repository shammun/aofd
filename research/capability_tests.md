# Map, 3-D and animation capability tests — results (2026-10-27)

Plan: `research/capability_tests_plan.md`. Everything was made from real data and rendered on this machine
(Remotion's chrome-headless-shell, ANGLE D3D11, RTX A1000). The outputs are **not in git**. They are in
`G:/Geophysical Fluid Dynamics/aofd-data/captests/` (about 3.6 GB):
- `INDEX.html`: every case and tool, with thumbnails, links, verdicts, timings and determinism;
- `README.md`;
- `showcase.mp4`: the narrated showcase, 9:52, 141 MB, captions muxed in plus `showcase.en.vtt`;
- one folder per case, with outputs, sidecars, `results.json` and `contact_sheet.png`;
- `_scripts/`: the code that made every output;
- the interactive pages, served with `python serve.py` (offline: local libraries, local XYZ tiles, no keys).

The Remotion compositions are in `movies/src/captests/`, with their own entry (`index.ts`, `Root.tsx`). The
shared `Root.tsx` and the `ch00*` folders were not touched. ArcGIS Pro / arcpy was **not tested** (user decision).

## Results

| Case | Works | Best | Runner-up | What failed and why | s/frame | Deterministic? | Teaching verdict |
|---|---|---|---|---|---|---|---|
| S1 synoptic map | yes | cartopy + MetPy + `cartostyle` movie preset | d3-geo SVG in Remotion (layer build) | The toolkit recipe carries no points, vectors or front symbols, so the PyGMT, QGIS, RustGIS and plain mpl maps were bare (fronts invisible). RustGIS always adds a scale bar. | 2.3–10.7 (tools); d3 0.13 | yes, bit-identical (all 5 tools) | The `cartostyle` chart reads like a forecaster's chart. The layer-by-layer build teaches best. |
| S2 satellite + analysis | yes | GIBS MODIS + cartostyle lines (white, dark halo) | GIBS + d3-geo overlay | The GEE MOD09GA daily composite has orbit-gap swaths. The first stretch burnt out the clouds. MODIS (~13:20 UTC) and ERA5 (12 UTC) differ by about an hour. The crop ends at 10 °E. | 22 (cartopy) | yes (cartopy) | Isobars over the spiral make "the low is the storm" obvious. |
| S3 relief / locator | yes | PyGMT relief; cartostyle for labelled locators | QGIS hillshade | The recipes have no markers or labels. The symmetric `topo` map turns shallow seas white. GeoVista output is unlabelled. | 1.2–22 | yes (Alps, all tools) | Relief alone does not locate a town. Add places, a scale bar and a locator globe. |
| S4 climatology | yes | GEE ERA5 monthly reduce → cartostyle Equal Earth | NCEP1 LTM + PyGMT | GEE `ECMWF/ERA5/MONTHLY` ends 2020-06, so the mean covers 1991-01 to 2020-06. NCEP1 shows reduction artefacts over Antarctica. | 4–11; reduce 13 s once | yes | The subtropical highs and the ITCZ stand out at once. |
| S5 charts from values | yes | GEE `reduceRegion`/`getRegion` → CSV → our chart | local ERA5 point file | None. ERA5-Land and ERA5 differ slightly: 78 vs 82 days above the 90th percentile. | <1 | archived by request hash | A climatological band plus one year answers "is this unusual?". |
| A1 animated weather map | yes | d3-geo in Remotion, driven by the data | cartopy frames + MetPy fronts | A min-in-box tracker picked the wrong low before 16 UTC on 1 Nov; backward tracking by continuity fixed it. Hours are cross-faded (interpolated). MapLibre is Web Mercator only. | d3 0.12; MapLibre 1.2; cartopy 1.8; QGIS 1.6; PyGMT 3.3 | yes (d3) | The low deepening and racing to Brittany is the most convincing clip. |
| A2 wind particles | yes | three.js particles (RK2 tracks) in Remotion | deck.gl TripsLayer page | datashader is not installed (not tested). In a fresh deck.gl page, frame 0 differed until the bitmap loaded. | 0.09; deck.gl 0.18 | three.js yes; deck.gl needs a stricter wait | Parcels spiral in across the isobars. |
| A3 satellite loop | yes | GIBS GOES-East GeoColor sequence + our coasts | GEE `getVideoThumbURL` (GOES-19 IR) | GIBS keeps geostationary imagery only for a rolling window (archive it at once). The GEE video is styled on the server, so there is no overlay control. | 2.5; GEE 0.7 | archived | Day-to-night GeoColor is beautiful; IR keeps the night visible. |
| A4 GEE timelapse | yes | per-frame GEE thumbs (cmocean) + Remotion colour bar | geemap `create_timelapse` | geemap needed 2 work-arounds (ffmpeg-python missing; mp4 failed) and bypasses our archive. | 7.5 (fetch once); 0.06 | archived | El Niño's tongue grows month by month. |
| A5 before/after | yes | GEE or STAC pair + Remotion swipe slider (glide, pause, reverse, settle, difference) | offline HTML swipe page | The leafmap split map was not built: it needs a tile server and CDN Leaflet. The Derna difference includes a lighting change. | 0.08 | archived pairs | The gliding divider makes the flood extent self-evident. |
| A6 animated chart | yes | Remotion SVG from the CSV | matplotlib frames | none | 0.06 / 0.24 | yes | Crisp vector numbers. |
| G1 globe + field | yes | three.js globe + cartopy texture | CesiumJS (no Ion) page | The PyGMT `texture` kind crashes (4.6-gigapixel raster, a toolkit bug). The MapLibre and deck.gl globes have polar holes and come out small. The RustGIS globe ignores `lon0/lat0`. | 0.07; Cesium page 0.35 | max 1/255 (three.js); Cesium identical | The Earth's temperature pattern becomes a picture. |
| G2 globe animation | yes | three.js globe + 24 hourly textures cross-faded | GeoVista frames | GEE ERA5 hourly at 1° is coarse for close-ups. | 0.06; GeoVista 0.66 | yes | The diurnal warm wave sweeps round. |
| T1 3-D terrain | yes | three.js heightmap + Blue Marble | deck.gl TerrainLayer / Cesium heightmap | Cesium streaks beyond the DEM edge. PyGMT needs one run per angle. | 0.08; others 1.3–8 | yes (three.js) | ×4–6 relief reads instantly; say the exaggeration aloud. |
| T2 terrain fly-over | partly | three.js fly-over in Remotion | MapLibre camera path | ERA5 0.5° surface-pressure colours are blocky at this scale, and the plateau looks flat. | 0.08; MapLibre 1.4 | yes | Show surface pressure on a flat map. Fly over Blue Marble. |
| T3 space → town | yes | MapLibre globe → terrain, local XYZ tiles | three.js globe + terrain cross-fade | No PMTiles library, so plain XYZ folders were used. Regional tiles need fill from the global layer. Tile templates must not be URL-encoded. | 0.66; three.js 0.07 | pixel-close (max 3/255) | "Where is Brest?" answered in 5 s. |
| X1 section from a map | yes | three.js plane with a matplotlib section texture, rising from the 850-hPa map | matplotlib section | The vertical scale is not to scale (say so). | 0.07 | yes | Links fronts on a map to sloping surfaces aloft. |
| X2 sounding column | yes | three.js column + base texture, rising balloon | — | The IGRA profile starts at 925 hPa. Vertical ×50. | 0.07 | yes | The clearest lapse-rate picture. |
| X3 stacked levels | yes | three.js layer stack (850 T, 500 Z, 250 wind) | — | Separate the layers early: at low angles they hide each other. | 0.07 | yes | "The atmosphere has floors." |
| **C1 static map → 3-D** | yes | **three.js** (exact equirectangular sphere patch, heightmap drape, tilted plate) **with billboard labels** | **CesiumJS** imagery drape | Draped **text** shears on slopes in every tool (PyGMT worst, with spikes). MapLibre at pitch 62° was not reproducible in a fresh page (15 % of pixels, max 240/255). GeoVista `add_base_layer(texture=)` crashes with pyvista 0.49 (an RGB mesh was used instead). RustGIS tilt is modest. A white last texture column gave a dateline seam (fixed by edge padding). | three.js 0.09–0.17; RustGIS 0.66; GeoVista 0.78; Cesium 0.51; MapLibre 0.92; PyGMT 3.5 | three.js and Cesium yes; MapLibre not at steep pitch | Shows where the storm sits on the Earth. Keep words off the drape. |
| C2 GEE + three.js | yes | GEE `computePixels` grid → our cmocean texture | GEE thumbnail as the texture | The GEE thumbnail paints masked land black. | 0.07 | archived | The 2023 El Niño tongue on a turning globe. |
| C3 RustGIS + overlays | partly | RustGIS `raster.function hillshade` → GeoTIFF → Remotion + our isobars | RustGIS `shadedRelief` PNG | A grey hillshade with no tint or coast reads as felt. The PNG export has unknown padding, so use the GeoTIFF. | 0.5 prep; 0.07 | yes | A prep tool; the picture needs a tint. |
| C4 QGIS prep → three.js | yes | `qgis_process` hillshade (multidirectional) + contours → three.js terrain | ArcGIS (not tested) | `qgis_process` takes ~25 s to start per call. | 52 s prep; 0.08 | yes | Contours on relief make height bands readable. |
| M1 RustGIS MCP | yes | `rustgis-cli mcp`: `run_command raster.function` hillshade on our DEM | GeoLibre MCP (authoring only) | `run` scripts need `id {json}` lines. The MCP server is not yet connected to Claude Code. GeoLibre cannot render without its app. | 0.1 per call | not measured | An agent helper, not a movie tool. |
| O1 ocean loop | yes | three.js globe texture sequence (GEE OISST grids) | cartopy Robinson frames | none | 0.07; cartopy 8.9 | yes | The warm water migrates with the seasons. |
| F1 camera flights | yes | three.js in Remotion: slerped, eased globe camera; hourly Ciarán drape; ETOPO-displaced globe; tropics pass | MapLibre globe+terrain flight | The drape resolution limits close-ups (30 px/° is soft at Brest). MapLibre runs at 0.76 s/frame and is limited by its tiles. | 0.09–0.10 | yes | The cross-product-movie flight works on real data. |
| P1 performance | yes | Remotion three.js, concurrency 2 | — | none | heaviest scene 0.089; 1 M-vertex globe 0.098 | 5 of 6 compositions bit-identical; G1 max 1/255 | Render time is not the constraint; data prep is. |

### Static map → 3-D verdict (user point 1)
**Best: three.js in Remotion.**
- Use an exact sphere patch for regional charts (SphereGeometry with phi/theta limits, so UVs run linearly in lon/lat).
- Use a full equirectangular texture for global maps.
- Use a heightmap drape for terrain, or a tilted plate whose height comes from the field.
- Drape **lines only**. Labels are screen billboards with a fixed pixel size. They fade at the limb
  (dot(normal, view) < 0.15) and go through a greedy collision pass.
- It is fast (0.09–0.17 s/frame), deterministic and fully scriptable.

**Runner-up: CesiumJS** (no Ion).
- Its imagery drape on the globe and on our custom heightmap is sharp and colour-true.
- It is deterministic and interactive.
- It is heavier (0.51 s/frame) and harder to compose with SVG overlays.

The other tools:
- **MapLibre**: good on the globe, but steep-pitch terrain frames are not reproducible.
- **GeoVista**: works only through an RGB-mesh work-around.
- **PyGMT `grdview`**: spikes and smeared text.
- **RustGIS**: gentle tilt only.

The contact sheet and clips are in `C1_static_map_to_3d/`, plus the interactive `cesium_drape.html` and `maplibre_drape.html`.

### Flights, sliders and animated statics (user points 2–4)
- **Flights** are in `F1_camera_flights/`:
  - space → Europe → Brest, with the storm field animating hourly and billboard L/Brest labels;
  - Brest → Alps → Tibet over ETOPO ×30;
  - a pass along the tropics and the ITCZ;
  - the MapLibre comparison flight.
- **Sliders** are in `A5_before_after/`. The Remotion Indus 2022 and Derna 2023 divider glides, pauses, reverses and
  settles, with dated BEFORE/AFTER labels and a difference pass.
- **Static maps in motion**:
  - the S1 layer build (base → isobars → fronts → winds → H/L);
  - Ken Burns reveals and pans of the cartostyle maps in the showcase;
  - drapes onto the globe.
- **Sound**: `tools/sound/mix.py` with a cue sheet.
  - Music: `data-curious` cross-faded with 4-s cosine ramps to `planet-wide` under the title and the globe/flight
    scenes.
  - Effects: whooshes on the flights, `wind_gusty` under the Ciarán loop and particles, `storm_bed` under the satellite
    loop, `stream` under the flood sliders, `surf` under the ocean globe, and a `tick` counter under the Niño chart.
  - The final mix measures −16.0 LUFS with a peak of −3.5 dBTP; `movie_qa` passes.

## Drop list
- **ArcGIS Pro / arcpy**: not tested (user decision).
- **PyGMT as a texture maker**: the `kind: texture` adapter fails. Make textures with mpl/cartopy.
- **PyGMT `grdview` drapes and animation**: spikes, smeared text, and one run per angle.
- **MapLibre and deck.gl globes for data fields**: Mercator data leave polar holes. Use three.js or Cesium.
- **MapLibre at steep pitch in final frames**: not reproducible.
- **leafmap split map in movies**: it needs CDN Leaflet and a tile server. Use the Remotion slider.
- **geemap `create_timelapse` in the pipeline**: it needs work-arounds and bypasses the archive. Use per-frame GEE thumbs.
- **Draped text on globes or terrain**: use billboards.
- **RustGIS globe**: it ignores lon0/lat0 and always draws a scale bar.
- **GeoVista `add_base_layer(texture=)`**: it crashes with pyvista 0.49.
- **datashader trails**: not installed.
- **GeoLibre MCP for frames**: it only authors projects.

## Recommended toolchain per visual kind
| visual | use | runner-up |
|---|---|---|
| synoptic chart (still) | cartopy + MetPy + `cartostyle` movie preset | d3-geo in Remotion |
| satellite + analysis | GIBS imagery + cartostyle lines | GIBS + d3-geo overlay |
| relief / locator | cartostyle (hillshade tint, places, scale bar, locator globe) | PyGMT |
| climatology | GEE reduce → cartostyle Equal Earth | PyGMT |
| chart from values | GEE/ERA5 → CSV → Remotion SVG chart | matplotlib |
| animated weather map | d3-geo in Remotion (data-driven) | cartopy frames |
| wind particles | three.js particles (Python RK2 tracks) | deck.gl TripsLayer page |
| satellite loop | GIBS sequence + our overlays | GEE video |
| timelapse | per-frame GEE thumbs + Remotion colour bar | geemap |
| before / after | GEE/STAC pair + Remotion swipe slider | offline HTML swipe |
| globe with a field / animation | three.js globe + cartopy textures | CesiumJS |
| static map → 3-D | three.js sphere patch / heightmap drape + billboards | CesiumJS imagery drape |
| terrain / fly-over | three.js heightmap + Blue Marble | deck.gl TerrainLayer |
| space → town zoom | MapLibre globe → terrain (local tiles) or a three.js flight | three.js cross-fade |
| sections, soundings, stacks | three.js planes/columns with matplotlib textures | — |
| terrain prep | `qgis_process` / RustGIS `raster.function` | numpy Horn hillshade |

## Toolkit issues found (for the orchestrator)
- **`tools/maptools/adapters/pygmt_adapter.py`, `kind: texture`**: GMT is asked for a 4.6-gigapixel raster, at both
  4096×2048 and 2048×1024, and PIL raises `DecompressionBombError`.
- **Recipe format**: it has no point, label, vector or front-symbol layers. Custom GeoJSON overlays all draw as thin
  coast lines.
- **web adapter**: the deck.gl ready check passes before the BitmapLayer image has loaded in a fresh page.
- **GeoVista adapter**: `add_base_layer(texture=)` crashes with pyvista 0.49 (`core.combine`).
- **Playwright video recording**: it needs `playwright install ffmpeg`, which was not allowed. The interaction clips
  were made from screenshot sequences instead.
- **PMTiles**: not installed in `tools/maptools/js`.

## Data used and new downloads
All new data went through `fluidpy.data.fetch` and the disk guard, or into the GEE/GIBS/STAC archive on G:.

New downloads:
- ETOPO 2022 60″ subsets: Brittany, Paris, Tibet and NW Europe (~16 MB);
- an ARCO-ERA5 upper-air box at 12 UTC on 2 Nov 2023 (t, z, u, v at 10 levels, 4 MB);
- GEE results under `raw/GEE/captest_*`:
  - ERA5 monthly mean MSLP;
  - ERA5 hourly T2m;
  - ERA5-Land daily at Brest;
  - OISST monthly grids;
  - the OISST anomaly texture;
  - GOES-19 IR video;
  - MOD09GA;
  - the Niño 3.4 CSV;
- GIBS GOES-East GeoColor for 26 Oct 2026.

Credits:
- ERA5: CC BY 4.0, Copernicus;
- NOAA OISST, GOES, ETOPO, NCEP1 and IGRA: public domain;
- NASA GIBS/MODIS/Blue Marble: open;
- Sentinel-2: Copernicus;
- Natural Earth: public domain.
