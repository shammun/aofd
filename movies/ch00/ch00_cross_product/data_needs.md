# ch00_cross_product — data needs and new functions (movie-director, 2026-10-27)

Every download goes through `fluidpy.data.fetch()` and `tools/disk_guard.py`. Builder: `movies/data/build_ch00_cross_product.py`
(it may import the v4 builder's helpers; reused scenes read the v4 JSON in `movies/ch00/ch00_cross_product_why/data/`
or a copy). **Disk at planning: C: 27 GB free (below the 40-GB data floor: no download may land on C:), G: 562 GB.**

## A. Already on disk (reuse)
| Id | What | Where | Scenes |
|---|---|---|---|
| A1 | v4 scene data (examples, sweep, rhr, cases, door, …) | `movies/ch00/ch00_cross_product_why/data/*.json` | s00–s22b, s50 |
| A2 | Ian: IBTrACS track, GOES-16 true colour 18:01 UTC 28 Sep 2022, HRRR 10-m wind | `…/cross_product_why/data/real/{ibtracs_ian_2022.json, ian_goes16_truecolour_20220928T1801.jpg, ian_hrrr_2022.*}` | s51–s53 |
| A3 | Ciarán ERA5 msl 12 UTC 2 Nov 2023; MODIS Aqua true colour; NE 10m coast/borders | `data/derived/ch00/ciaran_2023_sfc_1102.*`, `ciaran_modis_aqua_truecolour_2023-11-02.jpg`, `ciaran_*_10m.geojson` | s00, s54–s55 |
| A4 | ETOPO 2022 60″ Alps 43–49°N, 4–17°E | `G:/…/raw/ETOPO2022-60s/etopo2022_60s_alps_43-49N_4-17E.nc` | s57–s59 |
| A5 | Blue Marble NG (5400 and 21600 px); Natural Earth 10m admin-0, admin-1, populated places | `…/cross_product_why/data/real/globe_bmng_*.jpg`, `G:/…/raw/BMNG-2004/`, `G:/…/raw/NE-10m-*` | s51, s55 (UK outline), s57 |

## B. New downloads
| Id | Dataset | Subset | Size | Licence | Scenes |
|---|---|---|---|---|---|
| D1 | **NOAA CO-OPS** water levels (new key `NOAA-COOPS`; API `api.tidesandcurrents.noaa.gov/api/prod/datagetter`, no key) | stations 8725520 Fort Myers, 8726520 St. Petersburg (+ 8725110 Naples as a spare); `water_level` (6-min, verified) and `predictions`, datum MHHW, 2022-09-27 00 UTC → 2022-09-30 23 UTC, metric, GMT | < 1 MB | US Government, public domain | s53 |
| D1b | NHC Tropical Cyclone Report Hurricane Ian AL092022 (Bucci et al. 2023) — citation only, not downloaded into the repo | the 10–15 ft (3.0–4.6 m) peak inundation above ground at Fort Myers Beach / Estero Island; landfall 19:05 UTC 28 Sep near Cayo Costa | — | cite | s51–s53 |
| D2 (optional) | Copernicus DEM GLO-30 tile N46 E007 (AWS open data `copernicus-dem-30m`) | Sion ± 0.3° | ~50 MB raw → 5 MB product | free, attribution "© DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018 provided under COPERNICUS by the European Union and ESA" | s57–s58 (only if the open question Q4 picks true-steepness slopes) |

Cited facts (data-scout confirms wording before the final TTS): UK area (ONS: 242 495 km² land, or 243 610 km² incl.
inland water — pick one; the narration only says "a little more than"); the Valais vineyards lie on the south-facing
(north/right) bank of the Rhône (Swiss Wine Valais or the Federal Office for Agriculture); the right-front quadrant rule
(NHC educational pages).

## C. New functions (fluidpy; the implementer writes them with tests)
| Id | Function | What | Lives in | Tests |
|---|---|---|---|---|
| F1 | `polygon_signed_area(x, y)` | ½ Σ (r_k × r_{k+1})_z, + for anticlockwise (shoelace / triangle fan via `cross`) | `fluidpy/geo/vectors.py` | V1 unit square ±1; V1 triangle; V7 reversed order flips sign; V5 vs `sphere.polygon_area` on an equal-area projection of a 500-km polygon (< 0.1 %) |
| F2 | `mapproj.forward('laea', lat, lon, lat0, lon0)` | Lambert azimuthal equal-area (Snyder 1987, (24-2)…(24-4)) | `fluidpy/geo/mapproj.py` | V1 centre → (0, 0); V4 `scale_factors` h·k = 1; V5 vs pyproj `+proj=laea` (< 1 m at 2000 km) |
| F3 | `surface_normals(z, lat, lon, a=EARTH_RADIUS)` | unit normals from east-edge × north-edge vectors (central differences, metric dx = a cos φ dλ) | `fluidpy/geo/terrain.py` (new) | V1 plane z = αx → (−α, 0, 1)/√(1+α²); V7 flat → (0, 0, 1); V5 equals the Horn normal |
| F4 | `insolation_factor(normals, sun_elev, sun_az)` = max(ŝ · n̂, 0) and `hillshade(z, lat, lon, azimuth, altitude)` | Lambert cosine law; cartographic hillshade | `fluidpy/geo/terrain.py` | V1 flat = sin(elev); V5 hillshade vs the GDAL formula on a cone; V7 slope facing away → 0 |
| F5 | `fluidpy.data.coops.fetch_water_level(station, begin, end, product, datum)` | CO-OPS JSON → xarray, through `fetch()` and the registry | `fluidpy/data/coops.py` (new) | offline fixture parse; units m; residual = observed − predicted |

Builder-only (CHECK rows, no library function): the local east/north km of the Ian track and towns (via F2), the side
signs (via `vectors.cross`), the contour of 968 hPa (`skimage.measure.find_contours`), the noon sun elevation
90° − φ + δ with δ = −23.44°, the ε_ijk check (`fluidpy.core.tensors.levi_civita`).

## D. CHECK rows (ids used in the storyboard)
X1–X3 (ε_ijk, swap, tilted normal) · M1–M3 (side signs vs bearing test, landfall within 10 km of NHC, km components ±2 km,
z values ±10 %) · M4–M7 (circulation sense, right-side speed, gauge residual signs, NHC quote) · A1–A5 (centre 955.9 hPa,
closed 968 contour, shoelace = sphere < 0.1 %, sign by orientation, UK ratio 1.05–1.25) · T1–T3 (slopes and aspects,
flat 0.343–0.348 / sunny 0.55–0.62 / shady 0.00–0.10, ratio 1.6–1.8, hillshade keeps the s57 cells).
**Rule:** if a CHECK fails, the narration changes to the data and the director re-runs the TTS dry run.

## Planning numbers (director's scratch run, 2026-10-27; the builder re-derives)
- Ian 15→19:05 UTC: d ≈ (49.8, 44.5) km; Fort Myers Beach r ≈ (24.9, −27.8) → z ≈ −2.5e3 km² (right); Sarasota
  r ≈ (−32.9, 71.2) → z ≈ +5.0e3 km² (left).
- Ciarán 12 UTC: centre 955.9 hPa at 52.5°N 1.75°E; closed isobars 960/964/968/972/976/980 hPa enclose 42 151 /
  133 628 / 273 492 / 451 460 / 976 544 / 1 519 015 km² (LAEA shoelace = spherical polygon to < 0.001 %); the contour
  order returned is clockwise (sign −).
- Rhône at 7.36°E, 21 Dec noon (sun elevation 20.3°): sunny slope 46.275°N tilt 18°, ŝ·n̂ = 0.58; shady slope 46.208°N
  tilt 19°, 0.05; flat 0.343. ETOPO 60″ slopes: median 1.4°, 99th percentile 19.7°.
