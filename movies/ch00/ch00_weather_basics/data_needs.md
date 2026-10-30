# ch00_weather_basics — data needs and new functions (movie-director, 2026-10-27; UF1 additions §G, 2026-10-28)

Every download goes through `fluidpy.data.fetch()` and `tools/disk_guard.py` (G: floor 50 GB, project cap 150 GB, C:
floor 40 GB). Raw files to `G:/Geophysical Fluid Dynamics/aofd-data/raw/<KEY>/`, movie products to
`movies/ch00/ch00_weather_basics/data/` (small JSON/bin) or `data/derived/ch00/` (re-usable, ≤ 10 MB each). Credits go
to `manifest.json` and the registry, never on screen. Disk at planning time: **C: 76 GB free, G: 579 GB free**.

## A. Already on disk (re-use, no download)
| Id | What | Where | Scenes |
|---|---|---|---|
| A1 | ERA5 hourly u10, v10, msl, t2m, 2023-11-01T00 → 11-02T23, 35–70°N, 50°W–10°E (0.25°) | `G:/…/raw/ERA5-ARCO/era5_ciaran_2023_u10-v10-msl-t2m_2023-11-01T00_2023-11-02T23_1h.nc` (lon 310…360, 0…10: wrap to −180…180 and sort) | s00, s55–s58 |
| A2 | ERA5 Ciarán 09/12/15 UTC 2 Nov sfc + 850/500 hPa z, u, v | `data/derived/ch00/ciaran_2023_{sfc,upper}_1102.{bin,json}` | s42–s44, s59 |
| A3 | MODIS Aqua true colour 2023-11-02 (35–70°N, 50°W–10°E) | `data/derived/ch00/ciaran_modis_aqua_truecolour_2023-11-02.{jpg,json}` | s43, s44, s59 |
| A4 | Natural Earth 10m coast, admin-0, admin-1 lines for the Ciarán box | `data/derived/ch00/ciaran_{coast,admin0,borders,admin1_lines}_10m.geojson` | s21, s36, s43–s59 |
| A5 | NCEP/NCAR R1 1991–2020 LTM 10-m wind and SLP | `movies/ch00/ch00_cross_product_why/data/real/wind_climatology.{bin,json}`; raw `G:/…/raw/NCEP1-sfc-ltm/` | s52, s53 |
| A6 | Blue Marble NG (topo, topo+bathy) 5400×2700 and 21600; NE shaded relief | `…/cross_product_why/data/real/globe_bmng_*.jpg`, `G:/…/raw/BMNG-2004*/` | globe bases, night-time bases (s49, s51) |

Planning numbers read from A1 (ERA5 grid point 48.5°N 4.5°W, nearest to Brest), used verbatim in the narration and to
be re-asserted by CHECK rows W49–W52:

| UTC | msl hPa | t2m °C | speed m/s | from ° |
|---|---|---|---|---|
| 11-01 12 | 997.4 | 13.5 | 10.1 | 244 |
| 11-01 18 | 982.1 | 12.0 | 13.1 | 155 (SSE) |
| 11-01 20 | 975.3 | 14.4 | 17.9 | 204 (SSW) |
| 11-02 00 | 963.1 | 12.6 | 18.6 | 221 (SW) |
| 11-02 01 | **962.1** (min) | 12.6 | 17.3 | 244 |
| 11-02 03 | 968.0 | 10.5 | 23.2 (45.1 kt) | 271 (W) |
| 11-02 06 | 976.2 | 10.5 | 15.1 | 279 |

Low centre (MSLP minimum in A1): 965.3 hPa 12 UTC 1 Nov → 953.7 hPa 03 UTC 2 Nov at 50.0°N 3.75°W → 955.9 hPa 12 UTC
2 Nov at 52.5°N 1.75°E. Box maximum at 12 UTC 2 Nov 1029.8 hPa at the box's southern edge (35°N 32.75°W): the Azores
high centre lies further south, so D2 (global) is needed for its value (s42 says "about one thousand and thirty",
CHECK W40 1027–1034 hPa; else the spoken number follows the data).

## B. New downloads (preferred open source first)
| Id | Dataset (key) | Subset | Size (est.) | Licence | Scenes | Why |
|---|---|---|---|---|---|---|
| D1 | **IGRA v2** radiosondes (NOAA NCEI, new key `IGRA2`) | station files `FRM00007145` (Trappes) and `SNM00048698` (Singapore), sounding 2023-11-01 12 UTC (fallback: nearest launch that reaches ≥ 10 hPa); `igra2-station-list.txt` | ~30 MB zipped per station (whole history) → keep one sounding each | public domain (US Gov) | s00, s21, s23–s25, s37 | real p(z) and T(z) from a balloon; station map |
| D2 | **ARCO-ERA5** global single hour (`ERA5-ARCO`) | 2023-11-02T12 UTC: `mean_sea_level_pressure`, `surface_pressure`, `geopotential_at_surface`, `2m_temperature`, `2m_dewpoint_temperature`, `10m_u/v_component_of_wind` (0.25°, global) | 7 × 4 MB float32 → product ~ 15 MB (keep 0.5° for the globe: ~4 MB) | CC-BY 4.0 (Copernicus) | s01, s27, s38, s39, s41, s42 | the global maps |
| D3 | ARCO-ERA5 pressure levels, Ciarán | 850 hPa `temperature`, `specific_humidity`, `u/v_component_of_wind`, 2023-11-01T12 → 11-02T12 hourly (or 3-hourly), 30–65°N, 40°W–15°E; plus `2m_dewpoint_temperature` hourly at the Brest point | ~1 GB transferred (one 37-level chunk per hour), product ~ 10 MB | CC-BY 4.0 | s45, s46, s49, s50, s57 | air masses, objective fronts, warm tongue at Brest |
| D4 | ERA5 column over Trappes | `temperature`, `geopotential` on 37 levels (1–1000 hPa), 2023-11-01T12, 49.0°N 2.0°E | inside a D3-type chunk | CC-BY 4.0 | s24 | stratosphere above the balloon's burst height (to ~48 km) |
| D5a | **NASA GIBS** true colour (`NASA-GIBS`) | 2023-11-01: `MODIS_Terra_CorrectedReflectance_TrueColor` + `MODIS_Aqua_…` mosaic, 35–65°N, 40°W–10°E, 0.02° | ~10 MB jpg | NASA open (no restriction; credit NASA EOSDIS GIBS/Worldview) | s00, s45, s54–s55 | Ciarán approaching, daytime |
| D5b | GIBS global daytime mosaic | 2023-11-02 `VIIRS_NOAA20_CorrectedReflectance_TrueColor` (fallback MODIS Aqua) global 0.05°, gaps (night, polar, swath seams) filled with BMNG by `fluidpy.data.gibs.mosaic_fill` | ~25 MB | NASA open | s01, s27, s37–s39, s41 | real daytime globe (no dark maps) |
| D6 | ERA5 2-m temperature time series at Brest (`ERA5-CDS` timeseries or ARCO) | 48.45°N 4.42°W, hourly → daily means, 1991-01-01 → 2023-12-31 | CDS `reanalysis-era5-single-levels-timeseries` (~5 MB) — preferred; fallback NCEP R1 `air.2m.gauss.YYYY.nc` via OPeNDAP at one point (33 small reads) and say "NCEP/NCAR reanalysis" in the manifest | CC-BY 4.0 / public domain | s36 | weather vs climate band |
| D7 | NCEP R1 LTM 2-m air temperature (`NCEP1-sfc-ltm`) | `air.2m.mon.ltm.1991-2020.nc` (annual mean of the 12 months) | ~1 MB | public domain | s51 | mean temperature globe |
| D8 | ERA5 November-mean temperature on pressure levels (`ERA5-CDS` monthly) | Nov 2023 (or Nov 1991–2020 mean), 37 levels, 1° | ~10 MB | CC-BY 4.0 | s25 inset | zonal-mean tropopause height (tropics ≈ 16 km, poles ≈ 8 km) |
| D9 (optional) | GIBS MODIS 250 m true colour of a dated fair-weather cumulus field | the scout picks a clear summer afternoon with a cloud-street / popcorn cumulus field over land (e.g. US Great Plains or northern France) | ~5 MB | NASA open | s31 (optional, open question Q5) | real flat-based cumulus field from space |
| D10 (optional) | ETOPO 2022 60″ | only if the s39 Tibet inset needs relief beyond ERA5 orography | 0.5 GB raw → ~5 MB | public domain | s39 | 3-D relief |

Cited constants (data-scout adds rows to `reference/ch00/SOURCES.md`): dry-air composition N₂ 78.084 %, O₂ 20.946 %,
Ar 0.934 % by volume (U.S. Standard Atmosphere 1976, Table 3); CO₂ global mean 2023 ≈ 419 ppm (NOAA GML); Everest
8849 m (2020 survey; only used as a tick, no number spoken); Denver 1609 m (one mile; s40 is a thought example);
nautical mile 1852 m (international definition, 1929); front slopes cold 1:50–1:100, warm 1:100–1:200 (any standard
synoptic textbook, cited by the scout; e.g. AMS Glossary "cold front" / "warm front").

## C. New functions (fluidpy — the implementer writes them with tests; never in the TSX)
| Id | Function | Formula / method | Lives in | Tests |
|---|---|---|---|---|
| F1 | `saturation_vapour_pressure(T, e0=612.0, T0=273.0, L=2.44e6, Rv=462.0)` → Pa | Vallis (18.28): e_s = e0 exp[(L/Rv)(1/T0 − 1/T)] (page `chapters/pages/ch18/p699.png`; constants from the Fig. 18.1 caption, p700) | `fluidpy/geo/moist.py` (new) | V1 e_s(T0) = e0; V2 sympy: satisfies (18.27) de_s/dT = L e_s/(Rv T²); V5 within 2 % of Bolton (1980) for −10…35 °C (cited); values 6.19, 12.24, 23.13, 41.91 hPa at 0, 10, 20, 30 °C |
| F2 | `dew_point(e, e0, T0, L, Rv)` → K | exact inverse of (18.28): 1/T_d = 1/T0 − (Rv/L) ln(e/e0) | `fluidpy/geo/moist.py` | V1 round trip dew_point(e_s(T)) = T; e = 15 hPa → 286.27 K (13.1 °C) |
| F3 | `relative_humidity(e, T)` → fraction | ℋ = e/e_s (Vallis §18.1.2 text, p696) | `fluidpy/geo/moist.py` | V1 15 hPa at 25 °C → 0.479; V7 = 1 at e = e_s |
| F4 | `specific_humidity(e, p, eps=0.622)` and `vapour_pressure_from_q(q, p)` | Vallis (18.12): q ≈ ε e/p, e ≈ 1.61 w p (p696); also the exact forms q = εe/(p − (1−ε)e) | `fluidpy/geo/moist.py` | V1 q = 0.020, p = 1000 hPa → e ≈ 32.2 hPa; V7 exact → approximate as e/p → 0 |
| F5 | `lifting_condensation_level(T, Td, p, cp=C_P, R=R_D)` → (z_lcl, p_lcl, T_lcl) | lift a parcel dry-adiabatically (T falls at g/c_p; p from `statics` hydrostatic with the parcel's T) conserving q until e(q, p) = e_s(T) (F1, F4); brentq on height | `fluidpy/geo/moist.py` | V1 Espy rule z ≈ 125 m × (T − Td) within 5 % for T − Td ≤ 15 K; V3 step convergence; V7 Td = T → z = 0; our case 25 °C / 13.1 °C → ≈ 1.5 km |
| F6 | `wind_direction_from(u, v)` → degrees and `wind_components(speed, dir_from_deg)` | meteorological convention: dir = atan2(−u, −v) mod 360, clockwise from north, the direction the wind blows FROM; inverse u = −s sin d, v = −s cos d | `fluidpy/geo/atmos.py` | V1 westerly (u>0, v=0) → 270°, southerly → 180°, (8, 6) → 233.13°; V7 round trip; calm → NaN |
| F7 | `KNOT = 1852/3600` m/s and `NAUTICAL_MILE = 1852` m | definitions | `fluidpy/geo/constants.py` | V1 10 m/s = 19.44 kt; NAUTICAL_MILE within 0.1 % of 2πa/21600 with a = 6371 km |
| F8 | `sea_level_pressure(p_s, z_s, T_s, lapse=0.0)` (optional wrapper) | isothermal: p_s e^{z_s/H}, H = R T_s/g (via `statics.isothermal_pressure(−z_s, p_s, T_s)`); lapse ≠ 0 via `statics.linear_lapse_pressure` with the column's mean temperature | `fluidpy/geo/atmos.py` | V1 835 hPa, 1609 m, 15 °C → 1010.5 hPa; V7 z_s = 0 → p_s; V1 equals the hypsometric (2.166) route |
| F9 | `thermal_front_parameter(T, lat, lon, smooth_km=100)` and `front_lines(T, u, v, lat, lon, threshold)` | TFP = −∇\|∇τ\| · ∇τ/\|∇τ\| (Renard & Clarke 1965) on smoothed 850-hPa T (or θw); lines = zero contour of the TFP gradient where \|∇τ\| exceeds a threshold; warm/cold by the sign of −v·∇τ (cold advection → cold front) | `fluidpy/diag/fronts.py` (new; `fluidpy/data/fronts.py` is the Orsi ocean-front reader, keep separate) | V1 analytic tanh front located within one grid length; V7 a moving cold/warm front gets the right type; V7 rotation invariance |
| F10 | `daily_climatology(series, base=(1991, 2020), quantiles=(0.1, 0.9), smooth_days=15)` | per calendar day (29 Feb merged) mean and quantiles over the base years, circular running smooth | `fluidpy/diag/climatology.py` (new) | V1 a pure annual cosine returns its own mean curve; V7 quantiles bracket 80 % of base-period days by construction |
| F11 | `lapse_rate_tropopause(T, z)` (WMO: lowest level where the lapse rate falls to ≤ 2 K/km and stays ≤ 2 K/km on average over the next 2 km) | WMO (1957) definition | `fluidpy/geo/atmos.py` | V1 on `standard_atmosphere` → 11.0 km; V7 an isothermal profile has its tropopause at the base |

Builder-only (no new library function, CHECK rows in `movies/data/build_ch00_weather_basics.py`): column mass p₀/g;
unit conversions; fraction of mass below (from `standard_atmosphere`); 0.28 mm shell; cos-latitude patch (via
`fluidpy.geo.vectors.dot`); Brest point extraction; hourly storm centre (via `fluidpy.diag.cyclone.storm_centre`).

## D. CHECK rows the builder must assert (W-ids used in the storyboard)
W01–W03 title readouts · W04 0.28 mm · W05 composition sums · W06 10 332 kg · W07 1013.25 hPa · W08 61 kg · W09 288.15 K ·
W10 R = 287.06 · W11 ρ = 1.2250 · W12 1.292 / 1.164 / 9.9 % · W13 sympy slab limit · W14–W16 12.01 Pa/m, 8.32 m/hPa,
35.7 hPa over 300 m · W17 sympy d/dz(p₀e^{−z/H}) = −p/H · W18–W20 373, 137, 507, 253 hPa, 11.2 %/km · W21 sounding vs
curve · W22 0.501/0.898/0.990 · W23 mean lapse 0–10 km in 5.5–7.5 K/km · W24 Trappes tropopause 9.5–12.5 km, −50…−62 °C ·
W25 stratopause 45–52 km · W26 Singapore tropopause 15.5–17.5 km, < −72 °C · W27 polar 7–10 km · W28 32.2 hPa ·
W29 e_s values · W30 RH 0.479 · W31 Td 13.1 °C · W32 LCL 1.35–1.65 km · W33 233.13° · W34 0.5144 m/s, 1853 m, 19.44 kt ·
W35 share of 2023 days in the band · W36 IGRA 2023 station count · W37 Tibet sp < 600 hPa · W38 1010.5 hPa ·
W39 isobar levels · W40 Azores high 1027–1034 hPa · W41 cloudiness low > high · W42 anticlockwise, inflow > 0 ·
W43 warm tongue ≥ 5 K · W44 front width · W45 wind jump > 30° · W46 symbol side · W47 cos 60° = 0.5 · W48 pressure
belts · W49–W52 Brest numbers in the table above.

**Rule.** If a CHECK fails, the narration changes to the data (never the reverse); the director re-runs the TTS dry
run for the changed sentences.

## E. Orchestrator decisions after the data fetch (2026-10-27)
- Q3: the e_s formula (18.28) stays off screen; the curve and its numbers are shown.
- Q5: the real cumulus field (24 Jun 2024, northern France, MODIS 250 m) is used in s31; its ERA5 numbers give a cloud base of 1.4 km.
- IGRA has no Trappes 12 UTC launch on 1 Nov 2023: both soundings are the 00 UTC 1 Nov ones ("around midnight on the first of November").
- W24: Trappes tropopause 10.88 km at −62.7 °C. The narration says "about minus sixty"; the CHECK range widens to −65 °C because it follows the data (not a loosened tolerance on a computed value).
- W25: the ERA5 column stops at 1 hPa (~47 km). The real column is drawn to 47 km, and the stratopause comes from the standard atmosphere, with the narration saying so in plain words.
- D11 latest map (GFS 00 UTC 27 Oct 2026): it is called "a weather-service analysis". The deepest low (934.9 hPa, 14.5°N 162.5°E) is described as "a typhoon over the western Pacific", unnamed unless confirmed. The Siberian high (1040.1 hPa) and the North Atlantic low (954.6 hPa, about as deep as Ciarán) are used for the comparison.

## F. Open after stage 1 (orchestrator, 2026-10-27), to settle when stage 2 resumes after the capability tests
- s21 column (×13) and s39 relief (×120) exaggerations: one narration sentence each, or redesign with the winning 3-D tool.
- The GFS "latest map" (00 UTC 27 Oct 2026) is in the data but not in the script: add a short "today's map vs Ciarán" beat (user's latest-data rule).
- D10 ETOPO 2022 (or a DEM via Earth Engine) for sharp Tibet/Alps relief: fetch if the capability tests pick a DEM-based terrain.
- CalcStack auto-height for fraction rows: house-kit change for the orchestrator.
- The four CHECK rows re-defined in stage 1 (W44, W45, s53, D11) were reviewed by the orchestrator: claims about the data, narration follows the data; accepted.
- s00 title: "and how meteorology uses them" is longer than the dot-product subtitle that touched its animation (user phone review 2026-10-27): keep the right-column animation >= 50 px clear (x >= ~1130).

## G. User feedback round 1 (UF1, movie-director, 2026-10-28)

Source: `reports/ch00_weather_basics_user_feedback.md` (U-WB-01…31, R1–R5). Planning numbers below were computed with the
fluidpy calls named in each row (scratch script, read-only); the builder re-asserts them as CHECK rows in
`movies/data/build_ch00_weather_basics.py`. **Disk at planning time: C: 28 GB free (below the 40 GB floor — no download
or install may touch C: until it is cleaned), G: 530 GB free.**

### G1. Data
| Id | What | Status / route | Scenes |
|---|---|---|---|
| D12 | **ERA5 pressure levels, slice round Ciarán** (`ERA5-CDS-ciaran2023-section`, new key): `temperature`, `specific_humidity`, `u/v_component_of_wind`, `vertical_velocity` (omega), `geopotential`; levels 1000, 975, 950, 925, 900, 875, 850, 825, 800, 775, 750, 700, 650, 600, 550, 500, 450, 400, 350, 300 hPa; 2023-11-01 **18 UTC** (add 15 and 21 UTC only if the builder wants the slice to evolve); area [51, −20, 46, 6] (N, W, S, E), 0.25° | **NEW download**, CDS API through `fluidpy.data.cds.retrieve` → `fluidpy.data.fetch(retrieve=...)` (disk guard; raw to `G:/…/raw/ERA5-CDS-ciaran2023-section/`, product to `data/derived/ch00/era5_ciaran_2023_section_48p5N_18UTC.nc`). Estimated ≈ 1.1 MB per hour (20 levels × 6 variables × 21 × 105 points), CC-BY 4.0 (Copernicus), attribution as the other ERA5-CDS rows | s47, s48 |
| — | ETOPO 2022 60″ Brittany, 46.5–49.5N 6.5W–1E | on disk (`G:/…/raw/ETOPO2022-60s/etopo2022_60s_brittany_46.5-49.5N_-6.5--1E.nc`, fetched in the capability tests); **registry row to add** (`ETOPO2022-60s-brittany`, same fields as `ETOPO2022-60s-tibet`) | s03 (Cesium terrain), s36 |
| — | Blue Marble NG 21600 (A6) crop of the Brittany box | on disk | s03 drape; s27 cloud-free globe (`IMG.bmng`) |
| — | ERA5 hourly u10/v10 (A1) | on disk | s03 parcel trajectory; s47–s48 ground wind arrows |
| — | MODIS Terra + Aqua 250 m true colour, 24 Jun 2024, 47–49.5N 0–4E | on disk (`data/derived/ch00/cumulus_france_2024-06-24_modis_{terra,aqua}_250m.{jpg,json}`, `NASA-GIBS-cumulus-france-2024-06-24`) | s26 (morning → afternoon), s31 |
| — | IGRA2 Trappes sounding 2024-06-24 12 UTC (35 levels, top 6 hPa) | on disk (`G:/…/raw/IGRA2/FRM00007145-data.txt.zip`, read with `fluidpy.data.igra.find_sounding` + `fill_heights`) | s26 |
| — | ERA5 850 hPa hourly T, u, v (A3 / `ERA5-CDS-ciaran2023-850`) | on disk (repo copy) | s49 particles |
| D13 (optional) | GIBS MODIS Terra 250 m true colour of a cloud-free day over Brittany (46.5–49.5N, 6.5W–1E) | only if the BMNG drape looks soft in the Cesium close-up; `fluidpy.data.gibs` → `fetch()`, ≈ 3 MB, NASA open | s03 |

No other download. All other UF1 changes reuse data already in the movie.

### G2. New functions (fluidpy, with tests; never in the TSX)
| Id | Function | Formula / method | Lives in | Tests |
|---|---|---|---|---|
| F12 | `MOLAR_MASS_DRY_AIR = 0.0289647` kg/mol, `MOLAR_MASS_WATER = 0.01801528` kg/mol | cited constants (U.S. Standard Atmosphere 1976; IUPAC) | `fluidpy/geo/constants.py` | V1 M_d/M_w = 1.6078 within 0.1 % of 1/`moist.EPSILON` (1.6077) and of R^v/R^d |
| F13 | `pressure_height(p, p0, T, R=R_D, g=G0)` → z [m] | z = H ln(p0/p), H = RT/g: inverse of the isothermal p = p0 e^{−z/H} (Vallis (1.186) and the text after it, page `chapters/pages/ch01/p062.png`) | `fluidpy/geo/atmos.py` | V1 round trip with `core.statics.isothermal_pressure`; V1 z(p0/2) = H ln 2 = 5846.5 m at 288.15 K; V7 p = p0 → 0 |
| F14 | `dry_parcel_ascent(z, T0, p0, lapse=None)` → (T, p, V/V0) | T = T0 − Γ_d z (Γ_d from `core.stratification.adiabatic_lapse_rate`), p from `core.statics.linear_lapse_pressure`, V/V0 = (T/T0)(p0/p) (gas law at fixed mass) | `fluidpy/geo/atmos.py` | V1 z = 0 → (T0, p0, 1); V1 V/V0 = (p0/p)^{1−R/c_p} (Poisson) within 1e-3 for small z; values 25 °C, 1013.25 hPa → 1.4 km: 11.3 °C, 860 hPa, 1.12 |
| F15 | `fluidpy.diag.sections`: `vertical_section(F, lat, lon, levels, path_lat, path_lon)` (bilinear along a parallel or great circle), `section_anomaly(S)` (minus the mean of each level along the path), `in_section_tracks(us, wz, s, z, seeds, dt, nsteps)` (RK4 in the (s, z) plane, w from `geo.atmos.omega_to_w`) | new module | `fluidpy/diag/sections.py` (new) | V1 a linear field is reproduced exactly; V7 reversing the path reverses the section; V1 tracks in uniform (u, w) are straight lines with slope w/u; V3 RK4 order |
| — | reuse: `diag.trajectories.advect_on_sphere` (s03 parcel, s49 particles), `diag.sounding.layer_lapse_rate` (s26), `moist.vapour_pressure_from_q`, `moist.relative_humidity` (s47 saturated shading), `core.statics.standard_atmosphere`, `isothermal_pressure`, `geo.atmos.scale_height` | — | — | existing tests |

### G3. CHECK rows (builder; W-ids used in the storyboard)
| Id | Assert | Planning value |
|---|---|---|
| W53 | 12 km / EARTH_RADIUS = 0.001884 (spoken "about two thousandths" = rounds to 0.002); × 150 mm = 0.283 mm (spoken 0.3) | 0.0018835; 0.2825 mm |
| W54 | desk globe 30 cm → radius 150 mm | 150 |
| W55 | sympy: m = ρ A Δz, W = m g, force balance p(z)A − p(z+Δz)A = ρ g Δz A ⇒ A cancels ⇒ p(z) − p(z+Δz) = ρ g Δz (extends W13) | symbolic |
| W56 | H from the spoken values 287 × 288.15 / 9.81 = 8430 m and `scale_height(288.15)` = 8434.7 m both round to 8.43 km | 8430.3 / 8434.7 m |
| W57 | homogeneous height p0/(ρ0 g) = 101 325/(1.225 × 9.81) = 8431.6 m (8.43 km) and = R T/g within 0.1 % (ρ0 = p0/(R T), W11) | 8431.6 m |
| W58 | sympy: the tangent of p0 e^{−z/H} at any z0 reaches p = 0 at z0 + H (s18 S9) | symbolic |
| W59 | sympy: ∫_{p0}^{p} dp'/p' = ln(p/p0); ∫_0^z (−1/H) dz' = −z/H; exp ⇒ p0 e^{−z/H} (extends W17) | symbolic |
| W60 | e = 2.71828 ("about two point seven two"); 1/e = 0.3679 ("about zero point three seven", "37 %"); p(H) = 372.8, p(2H) = 137.1 hPa (W18) | 0.368 |
| W61 | 1 km / H = 0.1186 ("about twelve percent"); 1 − e^{−1 km/H} = 0.1118 ("about eleven percent"); `isothermal_pressure`(1, 2 km) = 899.97, 799.35 hPa ("about nine hundred", "about eight hundred"); drops 113.3 and 100.6 hPa ("a hundred and thirteen", "a hundred and one") | as stated |
| W62 | equal-mass slab tops `pressure_height(p0(1 − k/10))` = 0.889, 1.882, 3.008, 4.309, 5.846, 7.729, 10.155, 13.575, 19.422 km; slab mass p0/(10 g) = 1033 kg ("about a thousand"); bottom 889 m ("about nine hundred"); ninth top 19.4 km ("about nineteen") | as stated |
| W63 | z(p0/2) = H ln 2 = 8.43 × 0.693 = 5.85 km ("five point eight"); ln 2 = 0.693 ("zero point six nine"); p at 5.85 and 11.69 km = 506.6, 253.3 hPa (screen "≈ 500", "≈ 250") (W20) | as stated |
| W64 | `standard_atmosphere` (geometric): p(5.5 km) = 505.1 hPa ("about five hundred and five"), 1 − p/p0 = 0.5015; p(16 km)/p0 = 0.1015; p(31 km)/p0 = 0.00995; USSA halving height 5.574 km < isothermal 5.846 km (s22 S7) | as stated (W22) |
| W65 | M_d/M_w = 28.96/18.02 = 1.607 and 1/ε = 1.6077 agree within 0.1 %; spoken 29/18 = 1.611 rounds to 1.61; molecule dots 100 : 161 | 1.607 |
| W66 | `vapour_pressure_from_q(0.020, 1e5)` = 32.15 hPa; 1.61 × 0.020 × 1000 = 32.2 ("about thirty-two") (W28) | 32.2 |
| W67 | IGRA Trappes 2024-06-24 12 UTC: `layer_lapse_rate` from the 1000-hPa level (181 m, 23.6 °C) to 850 hPa (1548 m, 9.8 °C) = 10.1 K/km (range 9–11 → "about ten degrees per kilometre"); dew-point depression at 850 hPa ≤ 0.5 K (0.1 K: saturated near 1.5 km, the cloud base); the rod's bracket spans 0.18–1.55 km | 10.1 K/km |
| W68 | MODIS cloud cover in the 24 Jun 2024 box: bright-pixel fraction (all three bands ≥ 0.7 of full scale) Aqua (13:20 UTC) ≥ 1.5 × Terra (10:20 UTC) ("the sky fill with them") | builder |
| W69 | `dry_parcel_ascent` 25 °C, 1013.25 hPa → 1.4 km: T ≈ 11.3 °C, p ≈ 860 hPa, V/V0 ≈ 1.12; the drawn radius uses 1 + 5 (r/r0 − 1) (exaggeration recorded in the manifest) | 1.12 |
| W70 | s47 slice (18 UTC 1 Nov, 48.5N): the cold-frontal zone (largest along-slice T gradient at 850 hPa, smoothed 100 km) lies at 14–11 W and slopes upward towards the west (cold side); its slope between 1:30 and 1:150. Narration keeps "about one kilometre up for every fifty to a hundred kilometres" if the slope is 1:40–1:120, else the sentence follows the data (rule §D) | builder |
| W71 | s48 slice: the warm-frontal zone reaches the ground within 1° of Brest (Brest's warm front 18–20 UTC, W51) and slopes upward towards the east with slope 1:80–1:300 ("one or two hundred kilometres" kept if 1:100–1:250) | builder |
| W72 | slice vertical exaggeration: 1621 km drawn over 1680 px (0.965 km/px), 8 km over 663 px (0.0121 km/px) ⇒ ×80.0 ± 1 % ("eighty times taller", s48 S6) | 80 |
| W73 | in-slice particles: RK4 tracks with u along the slice and w = `omega_to_w`, w drawn ×80 like the heights; a uniform-flow test track is straight; recycled seeds deterministic | builder |
| W74 | s49 particles: `advect_on_sphere` on the 18 UTC 850-hPa field, 3000 fixed seeds; mean particle speed equals the mean field speed along the tracks ±5 % | builder |
| W75 | s03 parcel: `advect_on_sphere` on A1 u10/v10 from 47.75N 3.6W at 12 UTC 1 Nov 2023, 36 steps of 600 s; ≥ 50 % of the path over Brittany's land (NE 10 m land mask); the path ends inland of or at the Channel coast; the box never leaves the ETOPO tile | builder |
| W76 | the s02 radius rod is EARTH_RADIUS = 6371 km ("six thousand three hundred and seventy-one") | 6 371 000 m |

### G4. Rule reminders for the builder
- R1 source-line texts are in each scene's `source_line` (exact strings); the QA gets a new check that each one is on
  screen while its picture is, and that scenes without real data have none.
- Colour bars (R2) carry the units named in the UF1 text, 52-px ticks, hidden only during fast camera moves.
- 3-D (R3) objects use kit_wb `View3D` / `Quad3D` / `Arrow3D` (or Cesium where named); labels are billboards, never draped.
- Globe camera keys (R4) are written in each UF1 text; consecutive globe scenes share the camera at the cut (storyboard
  `user_feedback_1.rule_R4_continuity`).
- The TSX `SCENES` list gains s18b, s19b, s20b, s20c, s20d and s27b; `timing.json` comes from the builder's final TTS run
  (the director's dry run is `G:/…/scratch/movies/ch00_weather_basics/dryrun_uf1/`).
- `sound_cues.yaml` must be re-timed from the new timing (storm-tense section = new s54 start → new s60 start).

## Implementer notes on §G CHECK rows (orchestrator, 2026-10-29)
- W64: the planning values 505.1 hPa / 0.1015 / 0.00995 are for GEOPOTENTIAL heights (`geometric=False`); state that, or use geometric 505.40 hPa / 0.10218 / 0.010179. The "USSA halving height 5.574 km" is wrong: exact inverse gives 5.482 km geometric (5.477 km geopotential) — still below the isothermal 5.846 km, so the s22 sentence holds with the corrected number.
- W70/W71 (front slopes, rough check on era5_ciaran_2023_section_48p5N_18UTC.nc): cold front ≈ 1:18 (steeper than the planned 1:30–1:150); warm front ≈ 1:63 (outside 1:80–1:300). The builder's W70/W71 asserts decide; if they agree with this rough check, the s47/s48 narration must follow the data (reword the slope ranges).
- W65: 28.9644/18.01528 = 1.6078 (= 1/ε within 3e-5); say "about 1.61".
- Verifier spec slips (2026-10-29): W56 = 8430.1 m (not 8430.3); W64 halving height 5.482 km geometric (not 5.574). W70: ERA5 cold front ≈ 1:15 (925→500 hPa), vertical below ~750 hPa at 0.25° — s47 narration must follow the data. User (2026-10-29): the ~51-min length is fine.

## H. User feedback round 2 (UF2, 2026-10-29) — data, library, checks
The full specification is `uf2_plan.md` §7 (D-UF2-1…3 fetches, F-UF2-1/2 library functions, CHECK rows W78–W93). As built
(`movies/data/build_ch00_weather_basics.py → uf2_block`, all rows PASS):
- D-UF2-1 `ERA5-ARCO-wb-stacks-20231102T12` → `data/derived/ch00/era5_wb_stack_q10_*.nc` (s27c) and `era5_wb_stack_t16_*_0p5.nc` (s38b);
  D-UF2-2 `ERA5-ARCO-wb-front-20231101T18` → `era5_wb_front_11lev_*.nc` (s48b); D-UF2-3 Sentinel-2 L2A Beauce 22 Aug 2024 → `s2_beauce_2024-08-22.{jpg,json}` (s31).
- Library: `fluidpy.diag.sounding.column_integral` (W85: vapour below 850 hPa / column = 0.450, "about half");
  `fluidpy.diag.fronts.front_by_level` (W86: max_step_km=80, kind='cold', locate='centre', traced 1000–650 hPa only; fit
  850–650 hPa 1:43.9 → 110 km over 1.5–4 km, "about a hundred kilometres").
- Narration follows the data (script.md UF2 change log): s27c "about ten kilometres" (z̄(300 hPa) = 9.70 km); s38b "about sixteen and a
  half kilometres" (0–10°N strip-mean tropopause 16.61 km, −76.7 °C; Europe 10.15 km, −52.0 °C); s48b "about a hundred kilometres".
- Products: `stack_q.{json,bin}`, `stack_t.{json,bin}`, `stack_front.{json,bin}` (house `movies/data/_stack.py`), `uf2.json`; public images
  `wb_s2_beauce.jpg`, `wb_s31_modis.jpg` (G: render public folder).
