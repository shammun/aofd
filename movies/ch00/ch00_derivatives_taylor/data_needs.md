# ch00_derivatives_taylor (#4) — data needs, functions and CHECK rows (movie-director, 2026-10-28)

Every download goes through `fluidpy.data.fetch()` (or the dataset fetcher that wraps it: `fluidpy.data.cds.retrieve`,
`fluidpy.data.igra.fetch_station`, `fluidpy.data.gibs.fetch_wms`) and `tools/disk_guard.py` (G: floor 50 GB, project cap
150 GB, C: floor 40 GB). Raw files go to `G:/Geophysical Fluid Dynamics/aofd-data/raw/<KEY>/`; movie products go to
`movies/ch00/ch00_derivatives_taylor/data/` (small JSON/bin) or `data/derived/ch00/` (re-usable, ≤ 10 MB each). Credits go
in `manifest.json` and the registry, never on screen. Build script: `movies/data/build_ch00_derivatives_taylor.py`.

**Disk (2026-10-28, `df` at planning): C: 70 GB free, G: 553 GB free.** D1–D5 together are under 0.3 GB of raw data.

## A. Already on disk (re-use, no download)
| Id | What | Where | Scenes |
|---|---|---|---|
| A1 | ERA5 850 hPa t, q, u, v hourly 2023-11-01T12 → 11-02T12, 30–65° N, 40° W–15° E, 0.25° | `data/derived/ch00/era5_ciaran_2023_850hPa_1h.nc` (raw `G:/…/raw/ERA5-ARCO/era5_ciaran_850_t-q-u-v_850_2023-11-01T12_2023-11-02T12_1h.nc`) | s01, s04, s05, s07, s08, s10–s13, s16, s17, s20, s36, s46 |
| A2 | ISD/SYNOP Brest-Guipavas (07110), 1–2 Nov 2023 (t_c, slp_hpa, wind) | `data/derived/ch00/rwm_isd_brest_2023-11-01T12_2023-11-02T09.json` | s02, s08 |
| A3 | **IGRA2 Trappes (FRM00007145), period of record to 2026-09-30T12** (elapsed time on every level of the 2026 soundings) | `G:/…/raw/IGRA2/FRM00007145-data.txt.zip` (registry key `IGRA2`) | s00, s01, s09, s18, s19, s21, s26, s27, s30, s31, s34–s36 |
| A4 | ERA5 hourly msl, t2m, u10, v10, Ciarán box 2023-11-01T00 → 11-02T23 | `G:/…/raw/ERA5-ARCO/era5_ciaran_2023_u10-v10-msl-t2m_2023-11-01T00_2023-11-02T23_1h.nc` | s08 (the low's isobars) |
| A5 | NASA GIBS true colour 2023-11-01 (Aqua + Terra) | `data/derived/ch00/ciaran_truecolour_2023-11-01_aqua_terra.jpg` | s04 underlay, s38 thumbnail |
| A6 | Natural Earth 10 m coast, admin-0, admin-1 lines (Ciarán box) | `data/derived/ch00/ciaran_{coast,borders,admin1_lines}_10m.geojson` | every map |
| A7 | Blue Marble NG 2004; ETOPO 2022 60″ Brittany subset | `movies/ch00/ch00_cross_product_why/data/real/globe_bmng_*.jpg`; `G:/…/raw/ETOPO2022-60s/` | s09 globe, s22 hill |
| A8 | Page images (provenance only, never on screen) | Kundu App. B `_private/Kundu_AppendixB_Mathematical_Tools.pdf` pages 1–2 (§B.1, p. 857–858: partial and total differentiation, the unnumbered chain-rule display, (B.1.1)–(B.1.4)), page 4 ((B.2.1)); Kundu `../Fluid Dynamics/chapters/pages/ch10/p451.png` ((10.4)–(10.6)); Vallis `chapters/pages/ch01/p032.png` (1.50)–(1.51), `p033.png` (1.53), `p036.png` (1.61)–(1.65), `p037.png` (1.66)–(1.70); `chapters/pages/ch18/p699.png` (18.27)–(18.28); `chapters/pages/ch14/p532.png` (14.1) | equations |

### Planning numbers (computed 2026-10-28 with the tested library on A1–A3; every one is re-asserted by a CHECK row)
| Quantity | Value | Spoken as / scene |
|---|---|---|
| ISD Brest 18 / 20 UTC 1 Nov 2023 | 10.3 / 14.9 °C → 2.3 °C/h | s02 |
| ISD Brest slp 17 / 18 UTC | 988.3 / 983.3 hPa → −5.0 hPa/h | s08 |
| ERA5 850 hPa T at 48.5° N 4.5° W, 16–20 UTC | 2.11, 2.38, 5.12, 8.23, 6.82 °C; ∂T/∂t (17→19) = +2.92 K/h | s08, s16, s20 |
| ∂T/∂x at 0.25° (Δx = 18.4 km): forward / backward / centred | −3.319 / −3.086 / −3.202 K per 100 km | s07, s46 |
| ∂T/∂y centred 0.25° (forward −2.824) | −2.494 K per 100 km | s07 |
| centred ∂T/∂x at 0.5°, 1°, 2°, 3° (36.8, 73.7, 147.4, 221.0 km) | −3.168, −3.140, −2.238, −0.984 K per 100 km | s46 |
| mixed partials (0.25°, 17/19 UTC), both orders | 1.4285 × 10⁻⁹ K m⁻¹ s⁻¹ (identical) | s10 |
| 850 hPa wind at Brest 18 UTC | u 5.85, v 33.49 m/s | s20 |
| u·∇T; DT/Dt = ∂T/∂t + u·∇T | −3.68 K/h; −0.76 K/h | s20 |
| plane U = ±100 m/s: U ∂T/∂x; total | ∓11.53 K/h; −8.60 / +14.45 K/h (screen: 2.9 ∓ 11.5 = −8.6 / +14.4) | s16, s17 |
| Total-differential example (10 km E, 20 km N, 0.5 h) on rounded slopes | −0.32 − 0.50 + 1.45 = +0.63 K (full precision +0.64) | s12 |
| IGRA2 Trappes 2026-09-30T12: surface | 997.5 hPa, 168 m, 19.8 °C (292.95 K) | s26, s34 |
| … 850 hPa / 500 hPa | z 1533 / 5795 m (filled with `igra.fill_heights`); T 12.3 / −11.8 °C; etime 312 / 1212 s | s09, s18 |
| ∂T/∂z (850→500), w, dT/dt | −24.1 K / 4262 m = −5.655 K/km; 4.736 m/s; −0.02678 K/s = −1.607 K/min | s09, s18, s19 |
| ∂T/∂t at 5795 m from the 00 and 12 UTC soundings | −9.21 → −11.80 °C: −2.59 K in 12 h = −5.98 × 10⁻⁵ K/s | s19 |
| balloon drift to 500 hPa (IGRA wspd/wdir × etime, trapezoid) | 7.8 km E, 14.6 km N → 16.6 km towards 28° (NNE) | s19 |
| ∂z/∂p (850→500) and ∂T/∂p | −12.18 m/hPa; +0.0689 K/hPa (direct −24.1/−350 = 0.0689) | s21 |
| temperature line at 1.533 km: slope from 1.174 and 2.100 km levels | −4.86 K/km; at +1 km 7.44 (measured 6.87); at +4.26 km −8.41 (measured −11.8) | s31 |
| ρ₀ = p₀/(R T₀), −dp/dz, metres per hPa, H = R T₀/g | 1.186 kg/m³; 11.64 Pa/m; 8.59 m/hPa; 8570 m | s26, s34 |
| p at 887.0 hPa level (1006 m above the station): line / +bend / +cubic / exp | 880.4 / 887.3 / 887.0 / 887.0 hPa | s34 |
| p at the 500 hPa level (5627 m above): line / +bend / +cubic / exp; layer-mean T̄ and its exponential | 342.6 / 557.6 / 510.5 / 517.3 hPa; T̄ = 277.4 K → 498.7 hPa | s35 |
| WMO tropopause (`igra.wmo_tropopause`) | 13 072 m, 206.85 K (−66.3 °C) | s36 |
| three routes A (0.80 m³/kg, 280 K, 1004.5 hPa) → B (1.20 m³/kg, 280 K) | q = 26.79 (isochoric then isobaric) / 32.59 (isothermal) / 40.19 (isobaric then isochoric) kJ/kg; Δe = 0; Δη = 116.39 J kg⁻¹ K⁻¹ on all | s28, s29 |
| e_s(0, 15, 30 °C) (`moist.saturation_vapour_pressure`, L 2.44e6, R_v 462) | 6.19, 16.92, 41.91 hPa | s39 |
| L/(R_v T²) at 0, 15, 30 °C | 7.08, 6.36, 5.75 % per K | s40 |
| +1 K / +4 K at 0 °C: exact vs linear | 7.31 vs 7.08 %; 32.19 vs 28.31 % | s40 |
| T_e = (240/σ)^¼, 4σT_e³ | 255.06 K; 3.764 W m⁻² K⁻¹ | s42 |
| σ[(T_e + ΔT)⁴ − T_e⁴] vs 4σT_e³ ΔT | ΔT 1: 3.786 vs 3.764; ΔT 10: 39.91 vs 37.64 W m⁻² | s43 |
| no-feedback warming 3.93/3.764 and 3.93/3.22 | 1.04 K; 1.22 K | s43 |
| `core.fd.stencil_error("sin", 1, 0.1, …)` | forward −4.294 × 10⁻², central −9.001 × 10⁻⁴ | s45 |

## B. New downloads (best source first, runner-up recorded)
| Id | Dataset (key) | Subset | Size | Licence | Scenes | Why / runner-up |
|---|---|---|---|---|---|---|
| D1 | **IGRA2** Trappes period-of-record refresh (`IGRA2`, `fluidpy.data.igra.fetch_station("FRM00007145")`) | the newest 00 and 12 UTC soundings at production (keep 2026-09-30 if the newest lacks elapsed time on > 90 % of levels) | ~32 MB zip (overwrites A3) | NOAA NCEI, no restriction | s09, s18, s19, s30–s36 | series rule: latest data. If the date changes, every s09/s18/s19/s21/s26/s31/s34/s35 number is re-derived by the build script and the sentences are reworded and re-measured. Runner-up: keep A3 (on disk) |
| D2 | **ERA5 pressure levels** (`ERA5-CDS`, CDS `reanalysis-era5-pressure-levels`, account set up; `fluidpy.data.cds.retrieve`) | 2026-09-30 T00, T12 (and the sounding's day at production); `temperature`, `u/v_component_of_wind` at 850, 700, 500 hPa; box 45–52° N, 3° W–7° E, 0.25° | ~2 MB | CC BY 4.0 (Copernicus) | s19 (sideways term along the drift), s09 inset map | the horizontal ∂T/∂x, ∂T/∂y the balloon drifted through (CHECK DT26). Runner-up: GFS 0.25° analysis from the AWS archive `noaa-gfs-bdp-pds` (public domain; needs NEW F7: NOMADS keeps only ~10 days, so `gfs.fetch_analysis` cannot reach 30 Sep) |
| D3 | **ERA5 monthly single levels** (`ERA5-CDS-monthly`, CDS `reanalysis-era5-single-levels-monthly-means`) | `total_column_water_vapour`, 1979-01 → latest complete month, global, 1° (product: global-mean annual series + per-cell trend at 2°) | ~70 MB raw → < 2 MB product | CC BY 4.0 | s41 | latest + history of the water vapour the 7 % rule predicts. Runner-up: NCEP/NCAR R1 monthly `pr_wtr.eatm.mon.mean.nc` (PSL OPeNDAP, open, public domain; coarser, older physics) |
| D4 | **CERES EBAF-TOA Ed4.2** monthly (`CERES-EBAF`, NASA Earthdata via `earthaccess`, account set up) | `toa_lw_all_mon`, 2001-03 → latest month, global 1° | ~60 MB | NASA open data | s42, s43 | the measured ≈ 240 W/m² and an infrared globe. Runner-up: NOAA Interpolated OLR monthly (`NOAA-OLR`, PSL OPeNDAP, open; Liebmann & Smith 1996; not absolutely calibrated, so CERES is preferred for the global mean) |
| D5 (optional) | NASA GIBS true colour 2026-09-30 (`NASA-GIBS`, `gibs.fetch_wms`, Paris region 45–52° N, 3° W–7° E) | one day, 0.01° | ~6 MB | NASA open | s09 globe close-up | the Trappes launch day seen from space. Runner-up: BMNG (A7) |

Cited numbers (research-scout confirms wording and values before the build; they go to `reference/ch00/SOURCES.md` and the
manifest, never on screen):
- IPCC AR6 WG1 SPM A.1.2: global surface temperature 2011–2020 was 1.09 [0.95–1.20] °C above 1850–1900 (spoken "about one point one degrees since the late eighteen hundreds").
- IPCC AR6 WG1 SPM B.2.4 / Ch. 11 executive summary: heavy precipitation intensifies by about 7 % per °C of global warming (spoken "the heaviest daily rainfall becomes about seven percent more intense for each degree").
- IPCC AR6 WG1 Ch. 7 §7.3.2.1: effective radiative forcing of 2 × CO₂ = 3.93 ± 0.47 W m⁻²; Table 7.10: Planck response −3.22 W m⁻² K⁻¹.
- ECMWF IFS: high-resolution (HRES/ENS) grid about 9 km since 2016/2023 (spoken "about nine kilometres"; reworded if ECMWF has moved finer by production).
- Early climate models: a few hundred km grids (IPCC AR4 WG1 Ch. 1, Fig. 1.4 resolution history: ~500 km FAR, ~250 km SAR).
- Stefan–Boltzmann σ = 5.670374419 × 10⁻⁸ W m⁻² K⁻⁴ (CODATA 2018; Vallis quotes 5.67 × 10⁻⁸).

## C. Library functions
### Existing, tested (fluidpy; re-run by QA)
| Function | Used for | Test |
|---|---|---|
| `fluidpy.data.igra.{find_sounding, fill_heights, wmo_tropopause}` | the Trappes profile, heights, tropopause | `../Fluid Dynamics/tests/data/test_igra.py` |
| `fluidpy.geo.atmos.{wind_components, scale_height, hypsometric_thickness}` | balloon drift, H, layer-mean T check | `tests/geo/test_atmos.py` |
| `fluidpy.geo.sphere.gradient` | ∂T/∂x, ∂T/∂y on the ERA5 grid | `tests/geo/test_sphere.py` |
| `fluidpy.diag.advection.advection` | u·∇T (s20) | `tests/diag/test_advection.py` |
| `fluidpy.data.isd.decode` / the A2 product | Brest T and slp | `tests/data/test_isd.py` |
| `fluidpy.data.era5_arco.open_box` | A1 | `tests/data/test_era5_arco.py` |
| `fluidpy.core.thermo.{partial_derivative, perfect_gas_pressure, perfect_gas_density, path_heat_work_totals, process_path, perfect_gas_entropy_change}` | s06, s24, s25, s28, s29 | `../Fluid Dynamics/tests/test_ch01.py` (Kundu ch01 V-ladder) |
| `fluidpy.core.statics.{isothermal_pressure, scale_height}` | s26, s27, s34, s35 | `tests/test_ch01.py` |
| `fluidpy.core.stratification.lapse_rate_convention` | s09 both signs | `tests/test_ch01.py` |
| `fluidpy.core.fd.{taylor_table_sympy, fd_leading_error, stencil_taylor_coefficients, stencil_error, test_function, fd_derivative}` | s32, s44–s46 | `tests/test_ch10.py` (V2 rationals, V3 slopes) |
| `fluidpy.geo.moist.saturation_vapour_pressure` | s39–s41 | `tests/geo/test_moist.py` |

### New (the implementer writes them with tests; never in the TSX)
| Id | Function | Formula / method | Lives in | Tests (V1 analytic, V2 symbolic, V7 limit) |
|---|---|---|---|---|
| F1 | `secant_slopes(f, x0, steps)`; `taylor_polynomial(derivs, h, order=None)` (returns all partial sums); `total_differential(slopes, steps)` (returns terms + sum); `chain_rule_rate(dFdt, grad, velocity)` (terms + total); `mixed_partials(F, x, t)` (both orders by centred differences); `exactness_residual(M, N, x, y)` (sympy ∂M/∂y − ∂N/∂x); `loop_integral(M, N, path)` (trapezoid along a closed path) | Kundu App. B §B.1 (p. 857–858: partials, order of partials, the total-derivative display before (B.1.1)); Kundu (10.4) Taylor rows; Vallis §1.5.2 (1.69) equal mixed partials of an exact differential | `fluidpy/geo/calculus.py` (new module) | V1 x² at 3: secants 7, 6.1, 6.01; V1 e^h partial sums at 0.1 (1, 1.1, 1.105, 1.1051667) and V7 order 20 → e within 1e-12; V2 sympy `series` equals the partial sums; V1 x²t mixed partials = 2x both orders, and V7 finite-difference orders agree to round-off on random smooth fields; V7 chain_rule_rate equals the centred time-difference of a field sampled along a straight path (rel 1e-4 at small dt); V2 y dx + x dy → residual 0, y dx − x dy → 2; V1 unit-square loop −2 (anticlockwise) and 0 for the exact form |
| F2 | `SIGMA_SB`; `blackbody_flux(T)`; `emission_temperature(F)`; `planck_response(T)` = 4σT³ | Stefan's law as in Vallis §14.1, (14.1) σT⁴_rad = S(1 − α) | `fluidpy/geo/radiation.py` (new module) | V1 F = 240 → 255.06 K and back; V2 sympy d(σT⁴)/dT; V7 planck_response equals the centred numerical derivative of blackbody_flux (rel 1e-8); V1 4F/T identity |
| F3 | `cc_fractional_rate(T, L=L_V, Rv=R_V)` = L/(R_v T²) | Vallis §18.1.4, (18.27) divided by e_s | `fluidpy/geo/moist.py` | V1 273.15 K → 0.0708 K⁻¹; V7 equals d ln e_s/dT of `saturation_vapour_pressure` by centred differences (rel 1e-7); V7 decreases with T |
| F4 | `ascent_rates(z, T, etime, p=None)` → per-layer w, dT/dt, dT/dz (and dT/dp); `layer_lapse_rate(z, T, z1, z2)`; `drift(wspd, wdir, etime, top=None)` → (east, north) km | layer differences of a sounding; drift = ∫(u, v) dt along etime (trapezoid) with `atmos.wind_components`; Vallis §2.10 context for the lapse rate (both sign conventions, `knowledge/notation.md`) | `fluidpy/diag/sounding.py` (new) | V1 synthetic linear profile (T = 15 − 6.5z, z = 5t) → w 5 m/s, dT/dz −6.5 K/km, dT/dt −0.0325 K/s; V7 w·dT/dz = dT/dt identity per layer; V1 constant wind 10 m/s from the west for 600 s → 6 km east; V7 dT/dp = (dT/dz)(dz/dp) |
| F5 | `global_mean(field, lat)` (cos-latitude weights, NaN-aware); `linear_trend(series, per="decade")` (least squares, returns slope and its standard error) | area weighting on the sphere (Vallis §2.2 geometry; the weight cos ϑ of the area element) | `fluidpy/diag/climatology.py` (extend) | V1 constant field → that constant; V7 a field ∝ sin(lat) → 0; V1 trend of an exact line; V7 trend of white noise ≈ 0 within 3 SE |
| F6 | `fetch_ebaf_toa(start, end, var="toa_lw_all_mon")` | CERES EBAF-TOA Ed4.2 via `earthaccess` → `fluidpy.data.fetch()` + disk guard; licence and citation (Loeb et al. 2018, J. Climate 31, 895) in the attrs | `fluidpy/data/ceres.py` (new) | V1 a tiny recorded file parses; V7 global mean of the 2001–latest climatology within 235–245 W/m² |
| F7 (only if D2 falls back) | `gfs.fetch_archive(cycle, variables, levels, box)` | AWS `noaa-gfs-bdp-pds` GRIB2 byte-range subset (idx file) | `fluidpy/data/gfs.py` (extend) | V1 a recorded idx file gives the right byte ranges; V7 a re-fetched field equals the NOMADS one for a cycle both hold |

Builder-only (CHECK rows in the build script, no new function): unit conversions (K/100 km ↔ K/m, K/s ↔ K/h ↔ K/min,
hPa ↔ Pa); rounded-input arithmetic shown on screen (s12, s16, s17); the ETOPO trail heights and lengths (s22); the subsampled
grids of s46.

## D. CHECK rows the builder must assert (DT-ids)
DT01 Trappes 2026-09-30T12 levels: surface 997.5 hPa / 168 m / 19.8 °C; 850 hPa z 1533 ± 5 m, T 12.3 °C, etime 312 s; 500 hPa
z 5795 ± 10 m, T −11.8 °C, etime 1212 s · DT02 ISD 18/20 UTC 10.3/14.9 °C, rate 2.30 °C/h · DT03 secants 7, 6.1, 6.01;
derivative 6 · DT04 easy partials −0.03, +3; for x t: t and x (sympy) · DT10 ERA5 850 T at (48.5, −4.5) 18 UTC ∈ [5.0, 5.3] °C ·
DT11 ∂T/∂x −3.20 ± 0.02, ∂T/∂y −2.49 ± 0.02 K/100 km (0.25° centred) · DT12 T 17/18/19 UTC 2.38/5.12/8.23 °C, ∂T/∂t 2.92 ± 0.02 K/h ·
DT13 slp 988.3 → 983.3 hPa, −5.0 hPa/h · DT14 both mixed partials 1.43 × 10⁻⁹ ± 0.01 × 10⁻⁹ K m⁻¹ s⁻¹ and equal to 1e-12 relative;
sympy 2x · DT15 −0.32, −0.50, +1.45, sum +0.63 (rounded inputs); full precision +0.64 recorded · DT16 chain_rule_rate = direct
difference along a sampled path (library V7 row re-run) · DT17 car −3.0 °C/h · DT18 U ∂T/∂x = ∓11.53 K/h; totals −8.60/+14.45 (full),
−8.6/+14.4 (screen, one-decimal terms) · DT19 u·∇T −3.68 ± 0.05 K/h; DT/Dt −0.76 ± 0.05 K/h ("about zero point eight") · DT20 the
profile has ≥ 60 levels with T and filled z up to ≥ 30 km · DT21 ΔT −24.1 °C, Δz 4262 ± 10 m, ∂T/∂z −5.65 ± 0.02 K/km (screen
−5.7) · DT22 w 4.74 ± 0.02 m/s · DT23 dT/dt −0.0268 K/s, −1.61 K/min · DT24 ∂T/∂t at 5795 m −2.6 K/12 h, −6.0 × 10⁻⁵ K/s ·
DT25 drift (7.8, 14.6) ± 0.5 km, 16.6 km, bearing 28° ± 3° · DT26 sideways term |u ∂T/∂x + v ∂T/∂y| from D2 along the drift:
if it is not within 0.3–3 × 10⁻⁴ K/s, s19 sentence 8 is reworded to the data and re-measured · DT27 rising share ≥ 98 % (else s19
sentence 10 reworded) · DT28 ∂z/∂p −12.18 m/hPa, ∂T/∂p +0.0689 K/hPa both ways · DT29 ETOPO height gain on both trails equal to
1 m; trail lengths as drawn · DT30 exactness residuals 0 and 2 (sympy) · DT31 loop integrals −2.000 and 0.000 (trapezoid,
1e-6) · DT32 sympy dp = RT dρ + ρR dT; ∂²p/∂ρ∂T = R both orders · DT33 −3.45 % (linear), −3.33 % (exact) · DT34 H = 8570 ± 5 m ·
DT35 the measured p(z) lies below the isothermal exponential above 3 km at every level · DT36 heat 26.79/32.59/40.19 kJ/kg
(spoken 27/33/40), Δe = 0 on all · DT37 Δη 116.39 J kg⁻¹ K⁻¹ on all three routes · DT38 residuals R/α and 0 (sympy) · DT39
slope −4.86 K/km; 7.44 vs 6.87 (off 0.57: "half a degree"); −8.41 vs −11.8 (off 3.39) · DT40 title e_s tangent at 0 °C =
7.1 %/K · DT41 Taylor table rows s^p/p! for s = ±1 (sympy) · DT42 e^0.1 sums 1, 1.1, 1.105, 1.1051667 vs 1.1051709; e^1 sums
1, 2, 2.5, 2.6667, 2.7083 → 2.7183 · DT43 ρ₀ 1.186, 11.64 Pa/m, 8.59 m/hPa; 880.4, 887.3, 887.0; measured 887.0 at 1006 m ·
DT44 342.6, 557.6, 510.5, 517.3; T̄ 277.4 K → 498.7 hPa; measured 500.0 · DT45 tropopause 13 072 m, 206.85 K · DT50 e_s 6.19,
16.92, 41.91 hPa · DT51 7.08, 6.36, 5.75 %/K · DT52 +1 K 7.31 vs 7.08 %; +4 K 32.19 vs 28.31 % · DT53 D3 global-mean TCWV
1979→latest trend > 0 at 3 SE (the s41 sentence names no number; if the builder adds one, it is measured and re-timed) ·
DT54 1.09 × 7.08 % = 7.7 % ("about eight percent") · DT60 T_e 255.06 K; 4σT³ 3.764 · DT61 D4 global mean OLR 2001→latest in
235–245 W/m² (else s42 sentence 3 reworded) · DT62 3.93/3.764 = 1.04 K; 3.93/3.22 = 1.22 K · DT63 3.786 vs 3.764; 39.91 vs
37.64 W/m² · DT70 forward order 1, leading 1/2; central order 2, leading 1/6 · DT71 sin errors −4.294e-2, −9.001e-4 · DT72
s46 list ± 0.01 K/100 km.

## E. Pronunciations to check in the render (lexicon not edited; proposed entries)
Clausius–Clapeyron (`[Clausius](/klˈWziəs/)`, `[Clapeyron](/klæpˈAɹən/)` — the French "kla-pay-RON" is also heard; pick one
and keep it), Planck (`[Planck](/plˈɑŋk/)`), Stefan–Boltzmann (`[Boltzmann](/bˈOltsmən/)`), Taylor (default is fine),
factorial, nought (`[nought](/nˈɔt/)`), tropopause (`[tropopause](/tɹˈOpəpˌɔz/)`), linearisation, radiosonde (exists),
Trappes (exists), Ciarán (exists), ERA5 (exists). Spoken letters to listen for: "d x", "d T by d t", "e s", "R v", "c v"
(Kokoro must say the letter names, not "dee-ex" run together or "es"), "rho", "alpha", "sigma".
