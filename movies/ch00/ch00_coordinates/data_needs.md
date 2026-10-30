# ch00_coordinates (#5) — data needs, functions and CHECK rows (movie-director, 2026-10-28)

Every download goes through `fluidpy.data.fetch()` (or a fetcher that wraps it: `fluidpy.data.psl.fetch_daily`,
`fluidpy.data.era5_arco.fetch_box`, `fluidpy.data.cds.retrieve`, NEW `fluidpy.data.coops`) and `tools/disk_guard.py`
(G: floor 50 GB, project cap 150 GB, C: floor 40 GB). Raw files go to `G:/Geophysical Fluid Dynamics/aofd-data/raw/<KEY>/`;
movie products go to `movies/ch00/ch00_coordinates/data/` (small JSON/bin) or `data/derived/ch00/` (re-usable, ≤ 10 MB
each). Credits go in `manifest.json` and the registry, never on screen. Build script: `movies/data/build_ch00_coordinates.py`.

**Disk (2026-10-28, `df` at planning): C: 68 GB free, G: 545 GB free.** D1–D4 together are well under 1 GB of network
transfer and a few MB of products. Nothing was downloaded during planning (the director writes only in this folder).

## A. Already on disk (re-use, no download)
| Id | What | Where (registry key) | Scenes |
|---|---|---|---|
| A1 | ERA5 hourly u10, v10, msl, t2m, Storm Ciarán 2023-11-01T00 → 11-02T23, 35–70° N, 50° W–10° E, 0.25° | `G:/…/derived/ch00/era5_ciaran_2023_sfc.nc` (`ERA5-ARCO-ciaran2023`) | s43–s45, s46 |
| A2 | ERA5 hourly u10, v10, msl, Hurricane Ian 2022-09-26 → 29, 15–35° N, 95–70° W | `G:/…/derived/ch00/era5_ian_2022.nc` (`ERA5-ARCO-ian2022`) | s11 runner-up, s01 context |
| A3 | **HRRR 3-km hour-0 analyses, Ian, 2022-09-28 12–21 UTC** (mslma, psfc, u10, v10 earth-relative, 2-D lat/lon) | `G:/…/derived/ch00/hrrr_ian_2022.nc` (`HRRR-zarr-ian2022`); repo copy `movies/ch00/ch00_cross_product_why/data/real/ian_hrrr_2022.{bin,json}` | s00, s01, s11–s13, s39, s40 |
| A4 | GOES-16 ABI true colour + band 13, 2022-09-28 18:01 UTC | `movies/ch00/ch00_cross_product_why/data/real/ian_goes16_*` (`GOES16-ABI-ian2022`) | s11, s14, s39 |
| A5 | IBTrACS v04r01 Ian (and Idai) best tracks | `G:/…/derived/ch00/ibtracs_ian_2022.json` (`IBTrACS-v04r01`) | s11 (135 kt at 18 UTC) |
| A6 | Blue Marble NG 2004 topo+bathy 5400×2700 (and 21600); NE 10 m coast, admin-0, admin-1; NE 50 m land; NE 10 m places | `movies/ch00/ch00_cross_product_why/data/real/globe_bmng_*.jpg`, `G:/…/raw/BMNG-2004*`, `G:/…/raw/NE-10m-admin/`, `NE-50m-land/`, `NE-10m-places/` | every globe and map; s33 Greenland/Africa polygons |
| A7 | **NCEP/NCAR R1 daily geopotential height 2014, 17 levels incl. 10 hPa** (whole-year file) | `G:/…/raw/NCEP1-hgt-daily/hgt.2014.nc` (`NCEP1-hgt-daily`) | s35, s36 |
| A8 | ISD/SYNOP Brest 1–2 Nov 2023 (03 UTC 2 Nov SYNOP gust group 911 = 84 kt) | `data/derived/ch00/rwm_isd_brest_2023-11-01T12_2023-11-02T09.json` (`ISD`) | s44 |
| A9 | ETOPO 2022 60″ Brittany subset (Cesium drape heightmap); Alps profile for s27 if present | `G:/…/raw/ETOPO2022-60s/` | s24, s27 |
| A10 | Page images (provenance only, never on screen) | Vallis `chapters/pages/ch02/p081.png` (§2.2.2 increments, (2.27)–(2.33)), `p082.png` (Fig. 2.3 coordinates, (2.36)–(2.37)), `p083.png` ((2.38)–(2.45)), `p084.png` ((2.46)–(2.47)); Kundu `../Fluid Dynamics/chapters/pages/ch02/p069.png` ((2.4)–(2.5)), `ch03/p101.png` (§3.3, (3.9)); Kundu App. B `_private/Kundu_AppendixB_Mathematical_Tools.pdf` page 5 (printed 861, Example B.2, (B.2.2)) and page 9 (printed 865, §B.5 cylindrical and spherical coordinates, unit-vector dependencies, surface integral) | equations |

### Planning numbers (computed 2026-10-28 with the tested library on A1–A8; every one is re-asserted by a CHECK row)
| Quantity | Value | Spoken as / scene |
|---|---|---|
| polar of (3, 4) km; unit vectors there | r 5.000 km, θ 53.130°; r̂ (0.6, 0.8), θ̂ (−0.8, 0.6); bearing 36.87° | s04–s06, s08 |
| east wind 10 m/s at (3, 4): `velocity_components(..., "polar")` | u_r 6.000, u_θ −8.000 | s10, s38 |
| axes turned 30°: `rotation_matrix_2d` | (8.660, −5.000); rotation by 53.13° gives (6, −8) | s37, s38 |
| Ian HRRR 18 UTC centre (`storm_centre`) | 26.456° N, 82.399° W, 960.3 hPa (IBTrACS 26.6° N 82.4° W, 938 hPa, 135 kt) | s11 |
| Ian HRRR 18 UTC ring 25 km (`storm_relative_wind`, 72 azimuths) | v_t 37.10, v_r −12.50 m/s, inflow 18.6°, max speed on ring 50.4 m/s; v²/r 0.0551 m/s² | s11–s13 |
| Ian HRRR 18 UTC other rings (10–100 km) | v_t 19.4, 28.2, 35.0, 37.1, 36.2, 34.2, 29.5, 21.9, 18.2 m/s at 10, 15, 20, 25, 30, 40, 50, 75, 100 km | s12 chart |
| Ian translation 06→18 UTC 28 Sep (ERA5 continuity track) | 3.4 m/s towards 19° (slow; hence Ciarán for the Galilean scene) | — |
| Earth radius; 1° in radians | 6371 km; 0.017453 rad | s15, s20 |
| Brest 48.39° N 4.49° W position | z 4764 km, R = a cos φ 4231 km, x 4218 km, y −331 km | s18 |
| Ω a cos φ at 0, 48.39, 78.22, 90° | 464.6, 308.5, 94.8, 0.0 m/s (Ω 7.292115 × 10⁻⁵ s⁻¹) | s19 |
| 1° of latitude; 1′ | 111.19 km; 1.853 km | s20 |
| 1° of longitude at 0, 48.39, 78.22, 90° (`arc_lengths`) | 111.19, 73.84, 22.70, 0.00 km (cos φ 1, 0.6641, 0.2042, 0) | s21 |
| ERA5 0.25° box at Brest / Svalbard | 27.80 × 18.46 km / 27.80 × 5.68 km | s22 |
| area fraction equator → 30°, 60°, Arctic circle | 0.500, 0.866, 0.917 of a hemisphere; Earth 5.10 × 10⁸ km² | s23 |
| angle between up vectors | Brest–Trappes 4.32° (480 km); Brest–Singapore 101.0° | s24 |
| eastbound plane, 250 m/s for 1 h along 48.39° N | 900 km → 12.19° of longitude | s25 |
| metric term u v tan φ / a, u = v = 10 m/s, 45° | 1.570 × 10⁻⁵ m/s²; f v = 1.031 × 10⁻³; ratio 65.7 | s26 |
| LHR (51.47 N 0.45 W) → LAX (33.94 N 118.41 W) | central angle 78.79°; great circle 8761 km; initial bearing 311.7°; vertex 62.27° N 49.13° W; rhumb 9733 km at 258.4° (+11.1 %, 972 km) | s29, s30 |
| other routes checked (runner-ups) | JFK–NRT 10 830 / 12 745 km (+17.7 %, vertex 69.6° N); CDG–SFO 8963 / 10 140 km; LHR–JFK 5541 / 5759 km | — |
| plate carrée / Mercator stretch k = 1/cos φ | 1.506 (Brest), 4.898 (78.22°); Mercator areal 1.333 (30°), 2.268 (Brest), 4.000 (60°), 8.549 (70°), 23.99 (78.22°), 131.6 (85°) | s31, s33 |
| Mercator y(85°) | 3.13 a | s32 |
| Equal Earth (lon offset 30°) | areal 1.000; angular deformation ω 17.0° (0°), 10.4° (30°), 13.3° (48.4°), 31.4° (60°), 97.2° (78.2°) | s34 |
| polar stereographic (true at 60° N) | k 0.943 (78.2°), 1.000 (60°), 1.068 (48.4°), 1.244 (30°) | s35 |
| NCEP R1 10 hPa, 6 Jan 2014 | grid minimum 28 059 m at 77.5° N 45° W; refined centre (`storm_centre` on the height field) 78.70° N 43.85° W, 28 054 m; zonal-mean 30° N 30 924 m, 60° N 29 976 m, pole 28 299 m; geostrophic (`atmos.geostrophic_wind_from_height`) zonal-mean u at 60° N 53.8 m/s, max 108 m/s | s35, s36 |
| geostrophic ring winds at 2000 km (10 hPa) | about the pole v_t 45.7, rms v_r 39.8 (ratio 0.87); about the vortex centre v_t 58.7, rms v_r 24.4 (ratio 0.42) | s36 |
| SW Florida coast bearing (Naples 26.10 N 81.80 W → Venice 26.93 N 82.36 W) | 329.0°; Pinellas coast (27.60 → 28.15 N) 355.4° | s39, s40 |
| HRRR 20 UTC Fort Myers Beach (26.45 N 81.95 W) | u 22.2, v 24.3 (32.9 m/s from the SW); along 9.4, across −31.6 (onshore) | s39 |
| HRRR 20 UTC St. Petersburg (27.76 N 82.63 W) | u −10.2, v −16.0 (19.0 m/s); across +11.5 (offshore) | s40 |
| Ciarán continuity track (seed 52.5 N 1.75 E at 12 UTC 2 Nov) | 00 UTC 49.67 N 5.72 W 954.5 hPa; 03 UTC 50.12 N 3.73 W 953.6; 06 UTC 50.52 N 1.51 W 954.0; hourly steps 24–109 km | s43 |
| Ciarán motion 00→06 UTC 2 Nov | 14.58 m/s towards 71.0° (east 13.78, north 4.75 m/s); 21→03 UTC 15.48 m/s at 68° | s43, s45 |
| ring 200 km, 03 UTC: ground-relative sector means (±45° about right/left of track) | south 18.8, north 8.4 m/s; storm-relative south 8.5, north 20.9 (not spoken) | s43 |
| ring 200 km, 03 UTC ring means, ground vs storm-relative | v_t 14.1 vs 13.8; v_r −6.0 vs −5.9 m/s | s44 |
| Plymouth (50.25 N 4.25 W) 00 UTC 2 Nov | ∂p/∂t −3.82, −U·∇p −3.21, residual −0.61 hPa/h (960.8 hPa) | s45 |

The first planning tracker (a seed box west of Ireland) locked onto a different, older low at 56° N 12° W — exactly the
failure the storm-tracker rule (HOUSE_STYLE §7) warns about. The numbers above come from the continuity track seeded on
Ciarán's known 12 UTC 2 Nov position; F4 makes that the only route.

## B. New downloads (best source first, runner-up recorded)
| Id | Dataset (key) | Subset | Size | Licence | Scenes | Why / runner-up |
|---|---|---|---|---|---|---|
| D1 | **NCEP/NCAR R1 daily** `hgt` and `uwnd`, `vwnd` at 10 hPa (`NCEP1-hgt-daily` + new `NCEP1-uv-daily`; `fluidpy.data.psl.fetch_daily(date, level=10, var=…)`, OPeNDAP subsets) | every day 1 Dec 2025 → 31 Mar 2026, 10 hPa, 20–90° N | ~37 kB per day per variable (~13 MB) | US Government, public domain (PSL acknowledgement) | s35, s36 | series rule "latest data": the build picks the day with the largest zonal-mean 60° N wind (the strongest vortex) and re-derives every s35–s36 number; if a sudden warming occurred, it is not claimed without the CHECK of a wind reversal. Runner-up: keep 6 Jan 2014 (A7, on disk). Second runner-up: ERA5 10 hPa via ARCO (heavier: one 37-level chunk per variable-hour) |
| D2 | **ERA5 pressure levels, Ian** (`ERA5-ARCO`, `fluidpy.data.era5_arco.fetch_box`) | 2022-09-28T18; u, v, vertical velocity; 1000, 850, 500, 200, 150 hPa; 20–32° N, 90–75° W | ~0.4 GB network (37-level chunks), ~2 MB product | CC BY 4.0 (Copernicus) | s14 | the sign of the azimuthal-mean radial wind low (inflow) and aloft (outflow) round the eye (CHECK DC14). Runner-up: CDS `reanalysis-era5-pressure-levels` (account set up, same data, slower queue) |
| D3 | **NOAA CO-OPS water level and predictions** (new key `NOAA-COOPS`; NEW F5 `fluidpy.data.coops.fetch_water_level`, `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter`, no key) | stations 8725520 (Fort Myers) and 8726520 (St. Petersburg), 27–30 Sep 2022, 6-min `water_level` and `predictions`, datum MLLW, metric | < 1 MB | US Government, public domain | s40 | the real surge and the real Tampa Bay drop as tide-gauge curves (observed − predicted). Runner-up: USGS rapid-deployment gauges / high-water marks (STN) for Fort Myers Beach (closer to the 10–15 ft AGL value, heavier to parse) |
| D4 | **ERA5 monthly single levels** 2 m temperature (`ERA5-CDS-monthly`, CDS `reanalysis-era5-single-levels-monthly-means`) | latest complete month (Sep 2026 at planning) and the same month 1991–2020, global, 1° | ~30 MB raw → < 2 MB anomaly product | CC BY 4.0 | s34 | the same anomaly field drawn on Mercator and Equal Earth (area honesty; no number spoken). Runner-up: NCEP R1 monthly `air.2m` vs its own 1991–2020 LTM (PSL OPeNDAP, public domain, coarser) |
| D5 (optional) | Earth Engine Sentinel-2 / Landsat before-after of Fort Myers Beach (`GEE`, `tools/maptools` recipe) | Sep vs Oct 2022, cloud-masked | ~20 MB | Copernicus Sentinel / USGS Landsat (open) | s40 | a before/after swipe of the surge damage; runner-up: none (the gauge curves carry the message) |

Cited numbers (research-scout confirms wording and values before the build; they go to `reference/ch00/SOURCES.md` and the
manifest, never on screen):
- NHC Tropical Cyclone Report, Hurricane Ian (AL092022), Bucci, Alaka, Hagen, Delgado and Beven, 2023: peak storm-surge
  inundation of about 10–15 ft above ground level in the Fort Myers Beach / Estero Island area (s40, "ten to fifteen feet
  above the ground"); landfall in southwestern Florida near Cayo Costa about 19:05 UTC 28 Sep 2022 at about 130 kt (s11,
  s39 timing words "an hour before" / "about an hour after"). **To confirm** against the report PDF.
- IBTrACS v04r01 USA agency wind 135 kt at 18 UTC 28 Sep 2022 (A5, our file): s11 "about a hundred and thirty five knots".
- Tampa Bay water receding on 28 Sep 2022 (widely reported "reverse storm surge"): asserted only by D3 gauges (DC44).
- Mercator 1569 (Gerardus Mercator's world map, "Nova et Aucta Orbis Terrae Descriptio"): s32.
- Equal Earth projection: Šavrič, Patterson and Jenny 2019, Int. J. Geogr. Inf. Sci. 33, 454–465 (in `fluidpy.geo.mapproj`).
- Greenland ~2.17 million km², Africa ~30.4 million km² (ratio ~14): computed by us from Natural Earth polygons (DC34), not cited.
- The stratospheric polar vortex forms by radiative cooling of the polar stratosphere in the polar night (standard; e.g.
  Waugh, Sobel and Polvani 2017, BAMS 98, 37–44, "What is the polar vortex and how does it influence weather?"): s36.

## C. Library functions
### Existing, tested (fluidpy; re-run by QA)
| Function | Used for | Test |
|---|---|---|
| `fluidpy.core.coords.{polar_from_cartesian, cartesian_from_polar_coords, unit_vectors_polar, unit_vectors_cylindrical, unit_vectors_spherical, cartesian_from_spherical, velocity_components}` | s04–s10, s14, s18, s38 | `../Fluid Dynamics/tests/test_ch03.py` (Kundu ch03 V-ladder) |
| `fluidpy.core.tensors.rotation_matrix_2d` | s37, s38 | `tests/test_ch02.py` |
| `fluidpy.core.curvilinear.scale_factors` | s27 | `tests/test_ch03.py` / curvilinear tests |
| `fluidpy.core.kinematics.{galilean_transform, acceleration}` | s41, s42 | `tests/test_ch03.py` ((3.9) both frames) |
| `fluidpy.geo.vectors.components_in_axes` | s39, s40 | `tests/geo/test_vectors.py` |
| `fluidpy.geo.sphere.{unit_vector, parallel_points, meridian_points, wrap_lon, arc_lengths, central_angle, great_circle_distance, great_circle_points, great_circle_vertex, initial_bearing, rhumb_line, polygon_area, gradient}` | s15–s25, s29, s30, s33, s45 | `tests/geo/test_sphere.py` (V5 vs pyproj Geod) |
| `fluidpy.geo.mapproj.{forward, scale_factors, tissot_ellipses}` (platecarree, mercator, equalearth, polar_stereographic, gores, laea) | s22, s31–s35 | `tests/geo/test_mapproj.py` (V5 vs pyproj get_factors). Note: `scale_factors('polar_stereographic', 90)` returns k = 0 at the exact pole (finite-difference artefact); the movie never evaluates it at 90° |
| `fluidpy.geo.frames.coriolis_parameter` | s26, s13 note | `tests/geo/test_frames.py` |
| `fluidpy.geo.atmos.{geostrophic_wind_from_height, wind_components}` | s35, s36, s06 | `tests/geo/test_atmos.py` |
| `fluidpy.diag.cyclone.{storm_centre, storm_relative_wind}` | s11–s13, s36, s43, s44 | `tests/diag/test_cyclone.py` |
| `fluidpy.diag.trajectories.advect_on_sphere` | s11 streaklines | `tests/diag/test_trajectories.py` |
| `fluidpy.diag.climatology.global_mean` (from #4 F5) | s23 thumbnail | `tests/diag/test_climatology.py` |
| `fluidpy.data.{psl.open_daily, era5_arco.open_box, ibtracs.storm_table}` | data | `tests/data/test_*.py` |

### New (the implementer writes them with tests; never in the TSX)
| Id | Function | Formula / method | Lives in | Tests (V1 analytic, V2 symbolic, V5 benchmark, V7 limit) |
|---|---|---|---|---|
| F1 | `enu_basis(lat, lon)` → (i, j, k) as Earth-centred Cartesian unit vectors (shape (..., 3) each) | i = (−sin λ, cos λ, 0), j = (−sin φ cos λ, −sin φ sin λ, cos φ), k = r̂ (Vallis §2.2.2, Fig. 2.3; (2.29)); public version of the private `diag.cyclone._east_north` | `fluidpy/geo/sphere.py` | V1 orthonormal and i × j = k at 10⁴ random points (1e-13); V1 k = `unit_vector`; V1 at (0°, 0°): i = (0, 1, 0), j = (0, 0, 1); V7 near the pole i stays finite and turns with λ (documented: undefined at exactly ±90°, raise) |
| F2 | `unit_vector_rates(u, v, w, lat, a=EARTH_RADIUS)` → Ω_flow and (Di/Dt, Dj/Dt, Dk/Dt) in local (i, j, k) components; `metric_terms(u, v, w, lat, a)` → the three left-hand extra terms of (2.45) | Vallis §2.2.2, (2.38) Ω_flow = −i v/r + j u/r + k u tan ϑ/r; (2.39a)–(2.39c) Ω_flow × (i, j, k); (2.45) | `fluidpy/geo/frames.py` | V2 sympy: Ω_flow × i equals (2.39a) etc.; V2 (2.44a) with (2.39) gives (2.45); V7 finite difference of F1 along the path of a parcel moved by (u, v, w) for 1 s equals the rates (rel 1e-6); V1 u = v = w = 0 → 0; V1 the s26 numbers (1.570e-5) |
| F3 | `band_area(lat1, lat2, a=EARTH_RADIUS)` and `band_fraction(lat1, lat2)` | 2π a² (sin φ₂ − sin φ₁) (integral of the area element a² cos φ dφ dλ, Vallis §2.2.2 increments) | `fluidpy/geo/sphere.py` | V1 0–30° = ¼ of the Earth; V1 −90–90° = 4π a²; V5 equals `polygon_area` of a dense band polygon (1e-9) |
| F4 | `track_by_continuity(msl, lat, lon, times, seed, seed_time, box_deg=(1.2, 2.0), max_step_km=None)` → per-time centres (both directions from the seed) + step lengths; `translation_velocity(track, t1, t2)` → speed, bearing, (east, north) | `storm_centre` inside a box round the previous centre (HOUSE_STYLE §7 storm-tracker rule); great-circle step and bearing (`sphere`) | `fluidpy/diag/cyclone.py` | V1 a synthetic Gaussian low moving at 15 m/s towards 70° is recovered within 2 % in speed and 1° in bearing; V7 a second, deeper but distant low in the field is never picked; steps above `max_step_km` raise a flag; V1 the Ciarán steps 24–109 km/h (DC52) |
| F5 | `fetch_water_level(station, begin, end, product="water_level", datum="MLLW", units="metric", interval="6")`; `surge_residual(obs, pred)` | NOAA CO-OPS Data API through `fluidpy.data.fetch()` + disk guard; licence and citation in attrs | `fluidpy/data/coops.py` (new) | V1 a tiny recorded JSON parses to the right times and values; V1 residual of identical series = 0; V7 the residual's mean over a calm week is within ±0.15 m |
| F6 | JS mirror of `fluidpy.geo.mapproj.forward` (platecarree, mercator, equalearth, gores) for the three.js ProjectionMorph, an ES module with `selftest()` rows against Python values | same formulas as F2 of `ch00_reading_weather_maps` (Snyder 1987; Šavrič et al. 2019) | `movies/src/house/kit/proj.ts` (builder; reuse if #69's builder made it) | selftest rows: 20 (lat, lon) per projection vs `mapproj.forward` to 1e-9 relative |

Builder-only (CHECK rows in the build script, no new function): unit conversions (m/s ↔ km/h ↔ kt, ft ↔ m, rad ↔ °);
rounded-input arithmetic on screen (s04, s05, s07, s10, s18, s19, s20, s21, s25, s26, s29, s30, s37); coastline bearings
re-measured from NE 10 m coast segments; sector means of the ring winds; the frozen-pattern ghost of s45.

## D. CHECK rows the builder must assert (DC-ids)
DC01 title: HRRR 18 UTC centre within 0.1° of (26.456, −82.399); great-circle arc LHR–LAX has 181 points · DC02 (3, 4) km
offsets on the local plane · DC03 r 5.000, θ 53.130°, round trip to (3, 4) at 1e-12 · DC04 bearing 36.87°; a 10 m/s wind
"from" 270° gives u = +10, v = 0 (`atmos.wind_components`) · DC05 1 rad = 57.30°; 5 × 0.2 = 1 km, 50 × 0.2 = 10 km · DC06
r̂ (0.6, 0.8), θ̂ (−0.8, 0.6) · DC07 centred-difference d r̂/dθ = θ̂ and d θ̂/dθ = −r̂ to 1e-8 · DC08 (6, −8), length 10 ·
DC10 HRRR 18 UTC ring 25 km v_t 37.1 ± 0.5, v_r −12.5 ± 0.5 m/s, 960.3 hPa; 37.1 m/s = 133.6 km/h ("about a hundred and
thirty") · DC11 IBTrACS usa_wind 135 kt at 18 UTC = 250 km/h · DC12 inflow angle 18.6 ± 1°; std(v_t) and std(v_r) on the ring
each < ½ std(u) · DC13 v²/r 0.0551 ± 0.002 m/s²; g / (v²/r) in 170–190 ("almost two hundred"); f v at 26.5° N < ⅕ of v²/r ·
DC14 (D2) azimuthal-mean v_r < 0 at 1000 and 850 hPa and > 0 at 200 and 150 hPa on the 100- and 200-km rings (else S9
generic and the arrows illustrative) · DC15 a = 6.371 × 10⁶ m · DC16 `wrap_lon(355.5) = −4.5` · DC17 Brest z 4764, R 4231,
x 4218, y −331 km; `cartesian_from_spherical(a, π/2 − φ, λ)` equals `a · unit_vector(φ, λ)` to 1e-9 · DC18 464.6, 308.5,
94.8, 0.0 m/s; "two thirds" = 0.664 · DC19 111.19, 73.84, 22.70, 0.00 km; 1′ = 1.853 km · DC20 great-circle points on the
sphere (|r̂| = 1) · DC21 27.80 × 18.46 km; 27.80 × 5.68 km; ratio 4.90 ("several times") · DC22 band 0–30° = 0.5000 of a
hemisphere (F3 and polygon_area) · DC23 4.32° (480 km), 101.0° · DC24 12.19° · DC25 1.570 × 10⁻⁵ m/s²; f v 1.031 × 10⁻³;
ratio 65.7 ("about sixty five") · DC30 78.79°, 8761 km, 311.7°, vertex 62.27° N 49.13° W ("about sixty two degrees north,
near the west coast of Greenland": the vertex lies within 100 km of the NE 10 m Greenland coastline) · DC31 9733 km,
258.4°, +11.1 %, 972 km; 972 km at 900 km/h = 1.08 h ("about an hour") · DC32 k 1.506, 4.898 · DC33 Mercator y(85°) = 3.13 a
(`mapproj.forward`) · DC34 areal 4.000 (60°), 23.99 (78.22°); area(Africa)/area(Greenland) from NE admin-0 with
`polygon_area` = 14.0 ± 0.5; Mercator map-area ratio Greenland/Africa in 0.6–1.0 ("nearly as big") · DC35 Equal Earth areal
1 ± 1e-9 at 1000 random points; ω at 60° N ≥ 30° for |λ − λ₀| ≥ 30° ("thirty degrees or more") · DC36 10 hPa grid minimum
28 059 m (77.5° N 45° W), refined centre 78.70° N 43.85° W; zonal-mean height at 30° N 30 924 m ("almost thirty one") and the
centre value 28.05 km ("about twenty eight"); after D1, the same rows for the chosen day · DC37 rms(v_r)/v_t at 2000 km:
0.87 (pole) vs 0.42 (vortex centre); if the ratio does not drop for the chosen day, s36 S8 is reworded and re-measured ·
DC40 (8.660, −5.000), length 10 · DC41 rotation by 53.13° = (6, −8) = `velocity_components` to 1e-12 · DC42 Fort Myers Beach
20 UTC: 32.9 ± 0.5 m/s from 222 ± 5° (SW); along 9.4 ± 0.5; across −31.6 ± 0.5 m/s; coast bearing 329 ± 3° from NE 10 m
coast · DC43 St. Petersburg 20 UTC across +11.5 ± 0.5 m/s; Pinellas coast 355 ± 5° ("almost due north"); distance Fort Myers
Beach → St. Petersburg 150 ± 15 km · DC44 (D3) 8726520 observed − predicted < −0.5 m at some time on 28 Sep 2022 (else s40 S7
reworded); 8725520 residual peak recorded in the manifest (not spoken unless the scout confirms the gauge survived) · DC45
cited 10–15 ft AGL = 3.0–4.6 m ("three to four and a half") · DC50 20 + 1.5 = 21.5 · DC51 `kinematics.acceleration` equal in
both frames at 200 points while the local and advective parts differ (library V1 row re-run) · DC52 Ciarán continuity track:
all hourly steps ≤ 120 km; 00 UTC 954.5, 03 UTC 953.6 hPa; motion 14.58 m/s towards 71.0° ("about fifteen", "east-north-east") ·
DC53 200-km ring 03 UTC ground-relative sector means south 18.8 ± 0.5 ("about nineteen"), north 8.4 ± 0.5 m/s ("about
eight") · DC54 ring means v_t 14.1 vs 13.8 ("about fourteen in both"), v_r −6.0 vs −5.9 ("about six") m/s; a uniform field
gives ring means < 1e-3 m/s on the sphere at 200 km · DC55 ISD Brest 03 UTC 2 Nov 911 group = 84 kt = 155.6 km/h · DC56
Plymouth 00 UTC: ∂p/∂t −3.82, −U·∇p −3.21, residual −0.61 hPa/h (± 0.1) · DC57 recap numbers equal their scene rows.

## E. Pronunciations to check in the render (lexicon not edited; proposed entries)
Descartes (`[Descartes](/dAkˈɑɹt/)`), Longyearbyen (`[Longyearbyen](/lˈɔŋjɪɹbˌin/)`), Svalbard (`[Svalbard](/svˈɑlbɑɹd/)`),
Mercator (`[Mercator](/mɜɹkˈAtəɹ/)`), Gerardus (`[Gerardus](/ʤəɹˈɑɹdəs/)`), Galilei (`[Galilei](/ɡˌæləlˈAi/)`), colatitude
(default), graticule (`[graticule](/ɡɹˈætɪkjˌul/)`), rhumb (`[rhumb](/ɹˈʌm/)`: Kokoro may say "rumb" with a b), Ciarán
(exists), ERA5 (exists), Trappes (exists). Spoken letters to listen for: "r hat", "x hat prime", "C i j", "u v tangent phi",
"d phi", "d lambda", "d theta" (letter names, not run together). The Earth's radius is never spoken as a lone "a" (the
article problem); if a later edit needs it, add `"radius a ": "radius [A](/ˈA/) "` to the symbols block.

## F. Data-scout results (2026-10-28)
Products are on G: (`derived/ch00/`) and in the repo (`data/derived/ch00/`). Registry keys: `NCEP1-uv-daily` (+ `NCEP1-hgt-daily`),
`ERA5-ARCO-ian2022-pl`, `NOAA-COOPS`, `ERA5-CDS-monthly-t2m`. Reports: `reports/data/<key>.md`. Sources:
`research/ch00_coordinates_sources.md`. D5 was skipped.

| Id | Product (repo) | Size |
|---|---|---|
| D1 | `ncep_r1_10hPa_20251101_20260317.nc` (z, u, v, u60; 137 days, 20-90 N) | 3.05 MB |
| D2 | `era5_ian_2022-09-28T18_pl.nc` (u, v, w on 18 levels; ring-mean v_r, v_t, omega on (level, radius 50-500 km)) | 0.58 MB |
| D3 | `coops_ian_surge_20220927_20220930.nc` (observed, predicted, residual; 3 stations, 6-min) | 0.06 MB |
| D4 | `era5_t2m_anom_2026-09_1deg.nc` (Sep 2026 minus Sep 1991-2020) | 0.44 MB |

**D1 (s35-s36): recommended day 2026-01-21.** NCEP R1 **ended on 2026-03-17**, so winter 2025-26 is its last.
- 2026-01-21 is the strongest vortex of the winter: zonal-mean u at 60 N = 42.1 m/s. It is also strongly displaced.
- Centre (refined): **72.89 N 44.26 E, over the Barents Sea, north of Russia**, 1902 km from the pole. Height at the centre 28 602 m ("about twenty eight and a half kilometres").
- Zonal-mean height at 30 N: 30 721 m ("almost thirty one").
- Ring at 2000 km, rms v_r / v_t: about the pole **1.88**, about the vortex centre **0.42** (geostrophic 1.76 -> 0.39). DC37 holds: the ratio drops.
- Vortex edge (largest ring-mean v_t about the centre): 51.8 m/s at 2500 km. Strongest wind on the map 79 m/s.
- **s36 rewording needed**: the centre is "almost seventy three degrees north, over the Barents Sea", not "almost seventy nine, over Greenland". About the pole the winds are more in-and-out than round.
- Alternative closer to the current wording: 2026-01-05 (u60 41.9; centre 77.21 N 4.32 E, Greenland Sea, between Greenland and Svalbard; 28 386 m; z30 30 775 m; ratio 0.53 -> 0.24).
- The DC36 method re-run on 6 Jan 2014 reproduces every planning number.
- **March 2026 wind reversal** (safe wording): "in early March 2026, the winds round the Arctic at that height turned round".
  - Zonal-mean u at 60 N, 10 hPa was negative 4-10 March 2026 (minimum -8.8 m/s on 6 March): the major-warming wind criterion (Charlton and Polvani 2007).
  - R1 ends on 17 March, so midwinter vs final warming cannot be decided.
  - There is no primary text, only secondary reports. Do not claim a split.

**D2 (s14) DC14: PASS.** Ring-mean v_r at 100 / 200 km:

| Level | 1000 hPa | 975 hPa | 850 hPa | 200 hPa | 150 hPa |
|---|---|---|---|---|---|
| v_r (m/s) | -6.4 / -4.8 | -9.2 / -6.1 | -0.8 / -0.4 (marginal) | +2.2 / +4.2 | +3.4 / +2.5 |

- The inflow is **near the sea** (1000-925 hPa). The outflow is strongest at **200-125 hPa**, about 12-15 km up.
- Ascent in the eyewall ring: omega -2.3 Pa/s at 50 km, 850-800 hPa.
- ERA5 centre 26.454 N 82.391 W, 979.6 hPa (smoothed; best track 938 hPa).

**D3 (s40) DC44: PASS.**

| Station | Residual | Observed | Notes |
|---|---|---|---|
| 8726520 St. Petersburg | min **-1.755 m** at 23:00 UTC 28 Sep | -1.889 m relative to MHHW | Tampa Bay drained |
| 8725520 Fort Myers | max **+2.209 m** at 22:18 UTC | 2.212 m above MHHW = 7.26 ft | equals the NHC TCR value; gauge survived |
| 8725110 Naples | +1.91 m at 17:06 UTC | — | station destroyed afterwards |

- Calm residuals on 27 Sep (00-12 UTC): +0.20 to +0.28 m.
- **Gauge-location caution**: 8725520 is **downtown Fort Myers on the Caloosahatchee River, not Fort Myers Beach**.
  - The spoken "ten to fifteen feet above the ground" at Fort Myers Beach is VERIFIED against the NHC TCR (USGS sensors and high-water marks).
  - Do not label the gauge curve "Fort Myers Beach".

**D4 (s34).** September 2026, base 1991-2020 (30 years):
- Global-mean anomaly +0.823 K.
- 82.0 % of the Earth's area is warmer, but warm anomalies cover only 68.7 % of a Mercator map (|lat| <= 85). This is the area-honesty point in numbers (not spoken).

**Source check** (details in `research/ch00_coordinates_sources.md`):
- 10-15 ft AGL: VERIFIED (exact TCR quote). 135 kt at 18 UTC: VERIFIED (TCR best track; 938 mb). Landfall at Cayo Costa 19:05 UTC, 130 kt: VERIFIED.
- Mercator 1569, Equal Earth (Savric et al. 2019, IJGIS 33, 454-465), the nautical mile (1852 m), the ERA5 0.25-degree delivery grid (model about 31 km), and the vortex forming in the polar night (Waugh et al. 2017): all VERIFIED.

## Verifier notes (orchestrator, 2026-10-28; reports/ch00_coordinates_verification.md)
- DC22: "0.917 of a hemisphere north of the Arctic circle" holds only for 66.5°; with the 2023 Arctic circle (66.5634°) it is 0.9175 → say "about 0.92" or state 66.5°.
- F4 wording: Ciarán's hourly steps are 23.7–109.4 km per step (not km/h).
- Ciarán track minimum 953.65 hPa vs Met Office 953.3 hPa at Plymouth (secondary source); track passes within 50 km of Plymouth; 24-h fall 32.2 hPa.

## G. HOUSE_STYLE §5b amendment (movie-director, 2026-10-30; storyboard v2)
**No new download.** Every §5b change is layout (K1 GlobeFrame + zoom-reveal, K2 SourceBelow, K3 off-image readouts, K4
column edges, K5 LayerStack3D, K6 overlap gate; `movies/src/house/kit/{frame,bbox,col3d,stack3d,wind}.tsx` already exist
from weather basics UF2) plus one new scene. Each scene's `layout_5b` field in the storyboard says exactly what moves where.

**New scene s14b_ian_stack (Ian radial wind, 5 layers).** Data already committed: `data/derived/ch00/era5_ian_2022-09-28T18_pl.nc`
(u, v, w on 18 levels; ring means `vr_mean`, `vt_mean`, `w_mean` on 50-500 km) and `data/derived/ch00/era5_ian_2022-09-28T18_z18.nc`
(zg, same 49 x 61 grid), registry `ERA5-ARCO-ian2022-pl` (CC BY 4.0; attribution line in the manifest). Centre 26.454 N 82.391 W
(one centre for all levels). Layers chosen for one clear story each (numbers read 2026-10-30 from the committed files):

| Layer | Box-mean height | Ring-mean v_r 100 / 200 km (m/s) | Share of inflow points, 50-300 km | Spoken |
|---|---|---|---|---|
| 975 hPa | 322 m (49 m at the centre; 1000 hPa lies below sea level at the centre, so it is not used) | −9.2 / −6.1 | 91 % | "about three hundred metres", "almost everywhere", "about minus six" |
| 850 hPa | 1508 m | −0.8 / −0.4 | 48 % | "almost died away" |
| 500 hPa | 5868 m | +0.3 / +0.5; omega at 50 km −1.43 Pa/s (rising) | 48 % | "hardly flows in or out", "near the eye, it rises" |
| 200 hPa | 12 458 m | +2.2 / +4.2 | 31 % | "twelve and a half", "out at about four" |
| 125 hPa | 15 348 m | +5.1 / +4.4 (v_t −9.8 at 400 km: anticyclonic outflow, not spoken) | 22 % | "fifteen kilometres", "out at about four" |

CHECK **DC14b** (the builder asserts it, else the words change): the five ring means within ±0.5 m/s of the table; inflow share
at 975 hPa ≥ 0.85; omega(500 hPa, 50 km) < 0; the box-mean heights round to the spoken values. Per-point u_r for the layer
textures: `fluidpy.core.coords.velocity_components(u, v, "polar")` about the centre on the local plane, then `movies/data/_stack.py`
(Float32 textures, colour range −10…+10 m/s, vertical x10 in the manifest). The stack is not reused in any other movie.

**Narration changes measured** (`tools/tts.py` dry run 2026-10-30, `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/c56_5b_dryrun`,
af_bella x1.0, no caption warnings): s11 +2 sentences (zoom-in surroundings, zoom back out), scene 102.0 s; s14b new, 14
sentences, 216 words, 87.85 s; s24 +2 sentences (Brest's surroundings, zoom back out), 72.45 s. **Movie: 2808.75 → 2919.275 s
narration (+110.5 s), 48:41.8 with the hold; 49 scenes, 6910 words, 142.0 words per minute overall.**

**Still open (not §5b):** s35-s36 still say 6 January 2014; §F recommends the D1 refresh to 2026-01-21 (re-wording and a
re-measure). The orchestrator decides; the §5b layout of s35-s36 does not depend on the date.

**Lexicon:** no new words.
