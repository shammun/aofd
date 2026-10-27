# ch00_weather_basics — data needs and new functions (movie-director, 2026-10-27)

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
