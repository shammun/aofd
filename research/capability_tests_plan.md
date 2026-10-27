# Map, 3-D and animation capability tests — plan (user request, 2026-10-27)

Before any new weather, climate or ocean movie is built, every basic kind of visual we will need is tried with the
candidate tools **and with combinations of tools**, on our real data. The point is to learn what works, what works
well together and what does not work at all (dropped from later planning), not to test every possible combination.

Rules: real data only (`data/derived/ch00/`, G: raw, Earth Engine with project `uhiphd`, GIBS); render on the RTX via
Remotion's chrome-headless-shell; every output gets a sidecar (data, tool versions, GPU, time, licence, credit);
outputs under `outputs/captests/<id>/` (git-ignored) plus a contact sheet; short clips ≤ 20 s at 1080p.

## The cases (≈ 26)

| Id | Kind | What to make (real data) | Tools / combinations to try |
|---|---|---|---|
| S1 | Static synoptic map | Ciarán 12 UTC 2 Nov 2023: MSLP isobars every 4 hPa, H/L, 10-m wind, fronts (`front_lines`) | cartopy+MetPy · PyGMT · QGIS layout · d3-geo (Remotion still) · RustGIS · arcpy layout |
| S2 | Satellite + analysis | MODIS/VIIRS true colour 2 Nov 2023 under our isobars and borders | GIBS image + cartopy overlay · GIBS + d3-geo SVG overlay · GEE MODIS composite + PyGMT |
| S3 | Relief / location map | Brest, Trappes, Tibet, Alps locator maps with shaded relief | PyGMT · RustGIS · QGIS hillshade · GeoVista |
| S4 | Climatology map | 1991–2020 mean MSLP with subtropical highs and ITCZ | cartopy · PyGMT · GEE (ERA5 monthly) reduce → our plot |
| S5 | Chart from extracted values | Brest daily T 2023 vs 1991–2020 band; Niño 3.4 SST monthly 1982–now | GEE `reduceRegion` → CSV → matplotlib/Remotion chart · local ERA5 → same chart |
| A1 | Animated weather map | Ciarán hourly 12 UTC 1 Nov → 12 UTC 2 Nov: isobars sweep, fronts move, clock | cartopy frame sequence · d3-geo in Remotion (data-driven, no frames) · MapLibre frames + Remotion overlay |
| A2 | Wind particles / streaklines | Ciarán 10-m wind, seeded particles | our three.js particles in Remotion · deck.gl · datashader trails |
| A3 | Satellite loop | GOES GeoColor 24 h (e.g. 26 Oct 2026 cold front) and VIIRS daily for Ciarán | GIBS WMTS sequence + our labels · GEE `getVideoThumbURL`/filmstrip |
| A4 | Timelapse (GEE) | sea ice or SST over a season / a year | geemap timelapse · per-frame GEE thumbs + our colour bar in Remotion |
| A5 | Before / after wipe | a flood, fire scar or sea-ice minimum (pick one with clear data) | two GEE exports co-registered + Remotion wipe · leafmap split map (explore only) |
| A6 | Animated chart | Niño 3.4 or Brest series drawing itself, value counting | Remotion SVG from CSV · matplotlib frames |
| G1 | 3-D globe with a data field | global MSLP or T2m on a turning globe | three.js globe + cartopy/PyGMT equirect texture · GeoVista · MapLibre globe · deck.gl GlobeView · RustGIS globe |
| G2 | 3-D globe animation of data | hourly or daily field changing on the turning globe | three.js + texture sequence · GeoVista frames |
| T1 | 3-D terrain | Alps / Tibet with Blue Marble or Sentinel drape | three.js heightmap (PyGMT/RustGIS/GDAL prep) · MapLibre terrain · PyGMT grdview · GeoVista |
| T2 | 3-D terrain fly-over animation | camera move over Tibet with surface-pressure colours | three.js in Remotion · MapLibre camera path |
| T3 | Zoom from space to a town | globe → Europe → Brest | MapLibre globe→terrain (local PMTiles) · three.js globe + tile drape |
| X1 | Vertical section lifted out of a map | 850→200 hPa temperature section across Ciarán's fronts | three.js plane from xarray section over a map texture · matplotlib section + 3-D placement |
| X2 | Sounding column | Trappes IGRA profile as a 3-D column over a map of France, balloon rising | three.js column + PyGMT/cartopy base texture |
| X3 | Stacked pressure levels | 850 / 500 / 250 hPa fields as floating layers | three.js layer stack with textures |
| C1 | Combination: static map → 3-D | the same S1 map becoming a tilted 3-D plate with the low's pressure as height | cartopy/PyGMT texture + three.js displacement |
| C2 | Combination: GEE + three.js | GEE-derived texture (e.g. SST anomaly) on our globe | GEE export → three.js |
| C3 | Combination: RustGIS terrain + our overlays | RustGIS shaded relief + our isobars + labels in Remotion | RustGIS CLI → Remotion |
| C4 | Combination: QGIS / arcpy prep → movie | QGIS processing (contours, hillshade) or arcpy multidimensional raster → texture → three.js | qgis_process · arcpy |
| M1 | RustGIS MCP | the MCP server answers a terrain/hillshade request on our file | RustGIS MCP (if configured) |
| O1 | Ocean field animation | SST or currents loop (OISST / OSCAR / GEE HYCOM) | cartopy frames · three.js globe texture sequence · GEE timelapse |
| P1 | Performance & size | render time per frame and bitrate cost of the heaviest cases inside one Remotion composition | measured |

## For each case, record
works? (yes / partly / no) · best tool or combination · runner-up · what failed and why · time per frame · deterministic?
(bit-identical, pixel-close, or not) · licence and credit · a one-line verdict on how well it teaches.

## Output
`research/capability_tests.md` (results table + verdicts + "drop list" of tools/combinations not to use again),
contact sheets and clips under `outputs/captests/`, the best clips uploaded to the user's Drive (`aofd movies/capability
tests/`) with links, and updates to the `map-toolkit` skill (what works, recipes that worked).
