# ch00_contour_maps (M01) — data needs, functions and CHECK rows (movie-director, 2026-10-30)

Every download goes through `fluidpy.data.fetch()` (or a fetcher that wraps it) and `tools/disk_guard.py` (G: floor 50 GB,
project cap 150 GB, C: floor 40 GB). Raw files to `G:/Geophysical Fluid Dynamics/aofd-data/raw/<KEY>/`; movie products to
`movies/ch00/ch00_contour_maps/data/` (JSON / Float32 .bin) or `data/derived/ch00/` (re-usable, ≤ 10 MB each). Credits go in
`manifest.json` and the registry, and on screen only as the one-line source under each data picture (HOUSE_STYLE §5). Build
script: `movies/data/build_ch00_contour_maps.py`. Nothing was downloaded during planning; the planning numbers below were read
from files already on disk (2026-10-30). **Scope (coordinator, 2026-10-30):** contours and isolines as a concept (terrain, the
sea floor, isobars, isotherms, height of a pressure surface); no forecasting claims.

**Disk at planning (2026-10-30):** C: about 52 GB free, G: about 520 GB free (last logged values; the data agent measures before
and after each fetch).

## A. Already on disk (re-use, no download)
| Id | What | Where (registry key) | Scenes |
|---|---|---|---|
| A1 | ERA5 single hour **2023-11-02 12 UTC**, global, 0.25° raw (msl, sp, zs, t2m, d2m, u10, v10) and its 0.5° product | raw `G:/…/raw/ERA5-ARCO/era5_global_msl-sp-zs-t2m-d2m-u10-v10_2023-11-02T12_2023-11-02T12_1h.nc`; product `data/derived/ch00/era5_global_2023-11-02T12_sfc_0p5.nc` (`ERA5-ARCO-global-20231102T12`) | s02-s05, s15-s20 (maps: the 0.25° raw; North America and the western Atlantic only, so Ciarán over Europe is outside every frame) |
| A2 | ERA5 500-hPa geopotential, same hour, global 0.5° | `G:/…/derived/ch00/rwm_era5_z500_global_2023-11-02T12_0p5.nc` (+ repo .bin/.json) (`ERA5-ARCO-z500-global-20231102T12`) | s22 |
| A3 | Blue Marble NG 2004 topo+bathy (5400 and 21600 px), Natural Earth 10 m coast, admin-0/1, populated places, physical labels | `BMNG-2004`, `BMNG-2004-21600`, `NE-10m-admin`, `NE-10m-places`, `NE-lines` | globes s06, s11, s15; place labels |
| A4 | NCEP/NCAR R1 monthly LTM 1991-2020, air.2m (2.5° T62) | `G:/…/raw/NCEP1-sfc-ltm/air.2m.mon.ltm.1991-2020.nc` (`NCEP1-sfc-ltm`) | s21 planning numbers and runner-up only |
| A5 | ETOPO 2022 60″ Tibet subset (25-42 N, 72-105 E) | `ETOPO2022-60s-tibet` | s11-s13 planning numbers only (smooths Everest to 8157 m; the 3-D uses D2) |

### Planning numbers (read 2026-10-30 from A1, A2, A4; every one becomes a CHECK row)
| Quantity | Value | Spoken (scene) |
|---|---|---|
| msl highs (local maxima, 2.5-sigma smoothing) | 1034.1 hPa at 37.5 N 80.0 W (western Virginia, zs 558 m); 1029.8 hPa at 35.0 N 32.5 W (Azores High) | "about a thousand and thirty four", "about a thousand and thirty" (s17) |
| msl lows | 985.2 hPa at 60.0 N 83.0 W (Hudson Bay; a second minimum 983.4 at 67.5 N 84.5 W, Foxe Basin); 990.9 at 47.5 N 49.5 W (east of Newfoundland); 991.5 at 50.0 N 129.5 W (off British Columbia, frame edge, not named) | "about nine hundred and eighty five", "about nine hundred and ninety one" (s17) |
| col (saddle) | gradient minimum with negative Hessian determinant at 28.0 N 58.0 W, 1018.4 hPa (second candidate 29.0 N 63.5 W, 1016.8): along 28 N the pressure falls from 1022 (80 W) to 1016.6 (65 W) and rises to 1026 (30 W); along 58 W it rises from 1012 (14 N) to 1018.4 (29 N) and falls to 1013 (44-47 N); 10-m wind 3.3 m/s | "south-east of Bermuda", "about a thousand and eighteen", "about three metres per second" (s19) |
| strongest sea-level pressure gradient over water (zs < 50 m) in 20-72 N, 150-40 W | 6.38 hPa per 100 km at 58.0 N 82.0 W (Hudson Bay), 10-m wind 18.1 m/s | "about six hectopascals in a hundred kilometres", "about eighteen" (s20) |
| median over water | 1.08 hPa per 100 km; 10-m wind 7.1 m/s; correlation |∇p| vs wind 0.76 (manifest only) | "about one", "about seven" (s20) |
| z500 range in 12-68 N, 130-20 W | min 4916 m at 60.5 N 81.0 W (Hudson Bay); max 5973 m at 33.5 N 42.5 W | "about four thousand nine hundred", "almost six thousand" (s22) |
| z500 shapes | along 45 N: 5709 (122 W) ridge, 5411 (58 W) trough, 5765 (34 W) ridge | trough over eastern North America, ridges over the west and over the Atlantic (s22) |
| January 0 °C isotherm (NCEP R1 LTM, planning) | 0 °C reached at 73.3 N at 0° (Norwegian Sea); at 39.0 N at 90 W and 100 W (US Midwest/Plains) | "about forty degrees north", "about seventy", "about three thousand three hundred kilometres" (s21; ERA5 D1 re-asserts, 30° of latitude = 3336 km) |

## B. New downloads (best source first, runner-up recorded)
| Id | Dataset (proposed key) | Subset | Size | Licence | Scenes | Why / runner-up |
|---|---|---|---|---|---|---|
| D1 | **ERA5 monthly means, 2-m temperature, January 1991-2020** (extend `ERA5-CDS-monthly-t2m`, now September only; CDS `reanalysis-era5-single-levels-monthly-means` through `fluidpy.data.cds.retrieve`) | January of each year 1991-2020, 2t, 20-85 N, 170 W-60 E, 0.25° → 30-year mean product | ~60 MB raw → < 4 MB product | CC BY 4.0 (Copernicus) | s21 | real isotherms bending over the North Atlantic; runner-up A4 NCEP R1 LTM (on disk, 2.5°: lines too coarse at 1080p) |
| D2 | **Copernicus DEM GLO-30** (new key `COPDEM-GLO30`; new fetcher F1) | tiles `Copernicus_DSM_COG_10_N35_00_E138_00_DEM` + `N34_00_E138_00` (Fuji and the Suruga coast) and `N27_00_E086_00` + `N28_00_E086_00` (Everest, Lhotse, the Khumbu valleys), from the AWS Open Data bucket `copernicus-dem-30m` (anonymous HTTPS COG reads) | ~4 × 30-45 MB raw → crops 35.05-35.60 N 138.50-139.00 E and 27.80-28.10 N 86.70-87.05 E as Float32 / 16-bit heightmaps < 10 MB | Copernicus DEM licence (free, worldwide, any use, attribution: "© DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018 provided under COPERNICUS by the European Union and ESA; all rights reserved"); data-scout confirms redistribution of derived crops | s06-s13, s00 | 30 m resolves Fuji's summit crater and the South Col; runner-up NASADEM / SRTM GL1 (30 m, NASA, public; voids on the Himalaya), second runner-up ETOPO 2022 15″ (≈ 450 m, too smooth for the col) |
| D3 | **ETOPO 2022 15-arc-second surface** (extend the `ETOPO2022-60s` family: new key `ETOPO2022-15s-fuji`; OPeNDAP subset through `fluidpy.data.fetch`, the route already used for the 60″ subsets) | 34.40-35.80 N, 138.10-139.30 E (Fuji, Suruga Bay to the Suruga Trough) | < 3 MB | NOAA NCEI, public domain | s10 (isobaths), s07 sea floor | land and sea in one grid for the zero contour and the isobaths; runner-up GEBCO 2024 grid (15″, free, attribution "GEBCO Compilation Group (2024)") |
| D4 (optional) | Sentinel-2 L2A true colour of Fuji (a clear autumn day) through the map-toolkit `stac` adapter | 35.2-35.5 N, 138.6-138.9 E | ~30 MB raw → 4096-px texture | Copernicus Sentinel data, free and open (notice) | s07 drape (if used) | the default drape is a hypsometric tint + hillshade (clearer for contours, no clouds); the photo drape only if the user prefers realism |

Facts cited (research-scout confirms wording; they go to `reference/ch00/SOURCES.md` and the manifest, never on screen):
- Mount Fuji 3776 m (Geospatial Information Authority of Japan); "about a hundred kilometres south-west of Tokyo"; the Fuji
  Five Lakes at its northern foot; Suruga Bay to the south, the deepest bay in Japan, floor reaching about 2500 m (D3 asserts
  the depth, DM10).
- Mount Everest 8848.86 m (joint China-Nepal announcement, 2020; spoken "eight thousand eight hundred and forty nine"), Lhotse
  8516 m (fourth highest), South Col about 7906 m ("about seven thousand nine hundred"); D2 asserts the saddle (DM13).
- "Col" from French for neck, a mountain pass (dictionary etymology); "iso" Greek isos, equal; baros weight, thermos heat,
  hypsos height, bathos depth, hyetos rain, tachos speed, pyknos dense.
- Weather charts draw isobars every 4 hPa (NWS Unified Surface Analysis Manual; WMO practice) — said as "what weather maps use".

## C. Library functions
### Existing, tested (re-run by QA)
| Function | Used for | Test |
|---|---|---|
| `fluidpy.geo.sphere.gradient` | s09 (terrain slope check), s20 (|∇p| over water) | `tests/geo/test_sphere.py` |
| `fluidpy.geo.sphere.great_circle_distance` | s08, s10, s21 distances | `tests/geo/test_sphere.py` |
| `fluidpy.diag.axes.trough_ridge_axes` | s18 trough and ridge axes on msl; s22 on z500 | `tests/diag/test_axes.py` |
| `fluidpy.diag.axes.saddle_points` | s19 col on msl; s13 South Col on the DEM | `tests/diag/test_axes.py` |
| `fluidpy.data.cds.retrieve`, `fluidpy.data.fetch` | D1, D3 | `tests/data/` |
| `fluidpy.data.naturalearth` | coasts, places | `tests/data/` |

### New (the implementer writes them with docstrings — Vallis § where applicable, SI units, validation label — and V-ladder tests; never in the TSX)
| Id | Function | Method | Lives in | Tests |
|---|---|---|---|---|
| F1 | `fetch_tiles(bbox, product="GLO-30")`, `mosaic(bbox)` | Copernicus DEM COG tile names from the bbox; reads through `fluidpy.data.fetch` + disk guard; licence and citation in attrs | `fluidpy/data/copdem.py` | V1 tile names for three boxes (incl. one crossing a tile edge); V1 a tiny recorded COG window parses to the right shape and georeference; offline guard refuses a fetch above the cap |
| F2 | `isolines(field, lat, lon, levels)` → per level a list of (lat, lon) paths | marching squares with linear interpolation between grid points (skimage `find_contours` on the index grid, mapped to lat/lon) | `fluidpy/diag/contours.py` (new) | V1 a plane field gives straight lines at the exact positions; V1 a cone h = H − s r gives circles of radius (H − level)/s (to 0.1 cell); V1 lines never cross (pairwise intersection test on a random smooth field); V3 the cone radius error falls with grid refinement |
| F3 | `crossing_fraction(v1, v2, level)` | (level − v1)/(v2 − v1), raises if level is not between | `fluidpy/diag/contours.py` | V1 (1014, 1018, 1016) → 0.5; (1015, 1019, 1016) → 0.25 (the s03 numbers) |
| F4 | `contour_spacing(field, lat, lon, level_a, level_b, start)` → distance along the steepest path between two adjacent levels, and interval / spacing | integrate the unit gradient direction (from `sphere.gradient`) from `start` until `level_b` is crossed, great-circle steps | `fluidpy/diag/contours.py` | V1 cone: spacing = interval / s exactly; V5 interval / spacing equals |∇h| from `sphere.gradient` within 5 % on smooth terrain; V7 tiny interval → |∇h| |
| F5 | `local_extrema(field, lat, lon, smooth_km=300, min_prominence=...)` → highs and lows with value and position | Gaussian smoothing in km, maximum/minimum filter, prominence threshold; positions refined by a quadratic fit (like `cyclone.storm_centre`) | `fluidpy/diag/axes.py` | V1 two Gaussian highs and two lows recovered within one grid cell; V7 a weak bump below the prominence is ignored; V1 the A1 numbers (1034.1, 1029.8, 985.2, 990.9) |

Builder-only (CHECK rows in the build script): unit arithmetic on screen (s03, s05, s08, s09, s10, s16, s17, s20, s21); the
V-shape orientation test for ridges and valleys (sign of the contour curvature against the downhill direction); the hourglass
test at the cols (two higher and two lower sectors round the saddle).

## D. CHECK rows the builder must assert (DM-ids)
DM01 title: Fuji DEM summit ≥ 3700 m in the crop; the msl panel's H at 37.5 ± 1° N, 80 ± 1° W · DM02 the s02 number grid
(every 2°) prints the A1 values rounded to whole hPa; the grid holds a 1014/1018 neighbour pair and a 1015/1019 pair (for s03)
· DM03 `crossing_fraction` 0.5 and 0.25 · DM04 rule checks on the drawn isobars: no crossings (F2 V1), every line closed or
leaving the frame · DM05 interval 4 hPa; the 1016/1020 labels exist on the s05 frame; a point midway between them reads 1018 ±
0.7 hPa; the 1-hPa map has ≥ 3 × as many line segments as the 4-hPa map and the 10-hPa map loses the col's hourglass (no 1018
saddle visible) · DM06 Fuji 3776 m cited; summit crop maximum within 30 m; 100 ± 10 km to Tokyo (great circle, Tokyo Station);
lakes north, Suruga Bay south (positions from NE 10 m) · DM07 the 500-m contours 500…3500 m all exist on the DEM, vertical x2 in
the manifest · DM08 200-m contour spacing near the summit (steepest path from 3400 m to 3600 m, three azimuths, median) =
350 ± 70 m; on the lower slopes (1000 → 1200 m, three azimuths) = 2.0 ± 0.5 km; else the words change to the measured values ·
DM09 200/350 = 0.571 ("about zero point five seven", "fifty seven metres"); 200/2000 = 0.10; F4 V5 consistency with
`sphere.gradient` · DM10 Suruga Bay deepest point in D3 within 60 km of the coast: 2500 ± 300 m ("about two and a half
kilometres below"); summit-to-floor distance < 100 km ("within less than a hundred kilometres") · DM11 Everest 8849 m and Lhotse
8516 m cited; DEM summits within 60 m; Nepal-China border through the summit (NE 10 m admin-0) · DM12 ridge and valley V tests on
the 200-m contours along three Khumbu river valleys below the glaciers (Imja / Dudh Kosi sections) point up-valley; a ridge test
on Everest's south-east ridge points downhill · DM13 `saddle_points` on the DEM between Everest and Lhotse: 7900 ± 60 m (cited
7906 m), two higher and two lower sectors (hourglass) · DM15 the s15 frame (12-68 N, 130-20 W, Lambert conformal) holds every
named feature; Ciarán (east of 20 W) is outside it · DM16 isobars every 4 hPa; labels 1020 and 1024 present · DM17 `local_extrema`
values and positions = the planning table ± 1 hPa / ± 1°; "near Virginia" (the high within 150 km of the Virginia border), "near the
Azores islands" (within 800 km of 38 N 28 W), "over Hudson Bay" (the low over water), "east of Newfoundland" (low east of 52.6 W)
· DM18 `trough_ridge_axes`: a trough axis running south from the Hudson Bay low and a ridge axis from the eastern-US high, each
≥ 800 km long, else the sentence names only what is found · DM19 col at 28-29.5 N, 57-64 W, 1017-1019 hPa; ≥ 300 km from
Bermuda to its south-east; 10-m wind there < 4 m/s; the two lower sectors point north and south, the higher east and west · DM20
6.4 ± 0.5 and 1.1 ± 0.2 hPa per 100 km; 18.1 ± 1 and 7.1 ± 1 m/s · DM21 (D1) ERA5 January 1991-2020 0 °C isotherm: 40 ± 3° N
between 100 and 85 W; ≥ 68° N off the Norwegian coast (5-15 E, over sea); difference × 111.2 km = "about three thousand three
hundred" ± 300 km (else re-worded); the |∇T| maximum of the frame lies along the North American east coast (within 300 km of the
coast) · DM22 z500 min 4916 ± 20 m over Hudson Bay, max 5973 ± 20 m over the subtropical Atlantic; the 60-m interval; trough over
eastern North America and the two ridges from `trough_ridge_axes` on z500 · DM24 recap numbers equal their scene rows.

## E. Pronunciations to check in the render (lexicon not edited; proposed entries)
Suruga (`[Suruga](/sʊɹˈuɡə/)`), Lhotse (`[Lhotse](/lˈoʊtsˌA/)`), Khumbu (`[Khumbu](/kˈʊmbu/)`), isohypse
(`[isohypses](/ˈIsəhˌIpsɪz/)`), isohyet (`[isohyets](/ˌIsəhˈIəts/)`), isobath (`[isobaths](/ˈIsəbˌæθs/)`), isopycnal
(`[isopycnals](/ˌIsəpˈɪknəlz/)`), isotach (`[isotachs](/ˈIsətˌæks/)`), isoline (default expected), Azores, Bermuda, Newfoundland,
Fuji (defaults expected; listen once).

## Orchestrator decisions on the data scout's report (2026-10-30; apply when building)
- **DM21**: s21 says "about thirty eight", "more than seventy", "almost four thousand" (3929 km). The east coast is an example of a strong gradient, not the frame's maximum (Sierra Nevada 28.8, SW Greenland 25.2 K/100 km): do not call it the strongest.
- **DM11**: the DEM reads Everest 8737.8 m and Lhotse 8416.0 m, 111 and 100 m low. s11 keeps cited heights; rewrite the check against the DEM and do not imply the 3-D model reaches the cited summit.
- **DM17**: use `smooth_km=100` (1034.2, 1029.7, 984.3, 991.3 hPa all pass).
- **DM19**: the col's axes are diagonal, so s19 "north or south falls, west or east rises" is wrong. Reword: pressure rises towards the north-east and south-west, falls towards the south-east and north-west; wind "about two metres per second" (2.2).
- **Repo budget**: `data/derived` is at 147.0 of 150 MB; new large products stay on G:.
