# ch00_gradient (#6) — data needs, functions and CHECK rows (movie-director, 2026-10-28)

Every download goes through `fluidpy.data.fetch()` (or a fetcher that wraps it: `fluidpy.data.era5_arco.fetch_box`,
`fluidpy.data.cds.retrieve`, `fluidpy.data.gfs`, `fluidpy.data.metar`, NEW `fluidpy.data.oisst`) and `tools/disk_guard.py`
(G: floor 50 GB, project cap 150 GB, C: floor 40 GB). Raw files go to `G:/Geophysical Fluid Dynamics/aofd-data/raw/<KEY>/`;
movie products go to `movies/ch00/ch00_gradient/data/` (small JSON/bin) or `data/derived/ch00/` (re-usable, ≤ 10 MB each).
Credits go in `manifest.json` and the registry, never on screen. Build script: `movies/data/build_ch00_gradient.py`.

**Disk (2026-10-28, `df` at planning): C: 68 GB free, G: 534 GB free.** Nothing was downloaded during planning (the
director writes only in this folder); the planning numbers below come from files already on disk. D1–D7 together are
well under 1 GB of network transfer and < 30 MB of products.

## A. Already on disk (re-use, no download)
| Id | What | Where (registry key) | Scenes |
|---|---|---|---|
| A1 | ERA5 hourly msl, u10, v10, t2m, Storm Ciarán 2023-11-01T00 → 11-02T23, 35–70° N, 50° W–10° E, 0.25°; NE 50 m land mask on the grid | `G:/…/derived/ch00/era5_ciaran_2023_sfc.nc` (`ERA5-ARCO-ciaran2023`), `era5_ciaran_2023_sfc_1102.nc` (`ERA5-ARCO-ciaran2023-1102`, `land`) | s00, s01, s24, s28–s30 |
| A2 | ERA5 850 hPa t, q, u, v hourly 2023-11-01T12 → 02T12, 30–65° N, 40° W–15° E | `G:/…/derived/ch00/era5_ciaran_2023_850hPa_1h.nc` (`ERA5-CDS-ciaran2023-850`; repo copy 25 h) | s02, s09, s12, s23, s33, s34 |
| A3 | IGRA2 Trappes (FRM00007145) year-to-date 2026, sounding 2026-09-30T12 (82 levels, etime on all) | `G:/…/raw/IGRA2/FRM00007145-data-beg2026.txt.zip` (`IGRA2`) | s17, s18, s32 |
| A4 | ETOPO 2022 60″ Alps subset 43–49° N, 4–17° E (and Brittany, Paris, NW Europe, global 10′) | `G:/…/raw/ETOPO2022-60s/etopo2022_60s_alps_43-49N_4-17E.nc` | s01, s02, s15, s16 |
| A5 | ETOPO 2022 60″ Tibet subset 25–42° N, 72–105° E | `G:/…/raw/ETOPO2022-60s/etopo2022_60s_tibet_25-42N_72-105E.nc` (`ETOPO2022-60s-tibet`) | s16 |
| A6 | Blue Marble NG 2004 (5400 × 2700 and 21600), NE 10 m coast/admin/places, NE 50 m land | as in #5 (`BMNG-2004*`, `NE-10m-admin`, `NE-lines`, `NE-50m-land`) | every globe and map |
| A7 | ISD Brest 1–2 Nov 2023 (03 UTC 2 Nov SYNOP 911 group = 84 kt) | `data/derived/ch00/rwm_isd_brest_2023-11-01T12_2023-11-02T09.json` (`ISD`) | s29 |
| A8 | GFS 0.25° analysis 18 UTC 27 Oct 2026: msl, z500, u10, v10, orography | `data/derived/ch00/rwm_gfs_2026-10-27T18_chart.*` (`GFS-ANL-20261027-rwm`) | s31 |
| A9 | ERA5 t2m, d2m, msl, 2024-06-24 10 and 13 UTC, 46–50° N, 1° W–5° E | `data/derived/ch00/era5_cumulus_france_2024-06-24_t2m_d2m_msl.nc` (`ERA5-ARCO-cumulus-france-20240624`) | s35 |
| A10 | MODIS Aqua/Terra 250 m true colour, northern France, 2024-06-24 | `data/derived/ch00/cumulus_france_2024-06-24_modis_{aqua,terra}_250m.jpg` (`NASA-GIBS-cumulus-france-2024-06-24`) | s35 |
| A11 | ERA5 monthly t and z on 37 levels, Nov 2023, zonal means + tropopause | `data/derived/ch00/era5_zonal_t_z_tropopause_2023-11.nc` (`ERA5-CDS-monthly-pl`) | s36 |
| A12 | GFS 0.25° 250/300 hPa u, v, speed, 18 UTC 28 Oct 2026, North Atlantic | `data/derived/ch00/gfs_jet_250-300hPa_2026-10-28T18_natl.nc` (`GFS-ANL-jet250`) | s36 |
| A13 | GIBS true colour Trappes 2026-09-30 (column backdrop) | `data/derived/ch00/trappes_truecolour_2026-09-30_aqua_terra.jpg` (`NASA-GIBS-trappes-2026-09-30`) | s17, s32 |
| A14 | Page images (provenance only, never on screen) | Vallis `chapters/pages/ch01/p031.png` ((1.45)–(1.47) pressure force, "pressure-gradient force"), `ch01/p032.png` ((1.48), (1.50), (1.51)), `ch02/p081.png` ((2.27)–(2.33), gradient (2.31)), `ch02/p109.png` ((2.198) geostrophic, for the s30 pointer only, not shown); Kundu `../Fluid Dynamics/chapters/pages/ch02/p080.png` (printed 53: (∇φ)_i = ∂φ/∂x_i, ⟂ level surfaces, ∂φ/∂n = ∇φ·n, Fig. 2.7), Kundu App. B `_private/Kundu_AppendixB_Mathematical_Tools.pdf` page 5–6 (printed 861–862: §B.3 "the gradient operator is the general-purpose directional derivative", Cartesian ∇ and ∇ρ) | equations |

### Planning numbers (computed 2026-10-28 with the tested library on A1–A12; every one is re-asserted by a CHECK row)
| Quantity | Value | Spoken as / scene |
|---|---|---|
| hillside ∇h | (30, 40) m/km; NE step 30·0.707 + 40·0.707 = 49.50; sweep peak 50.000 at 53.13° from east (bearing 36.87°) | s03–s06 |
| directional derivatives | E 30, N 40, along ∇ 50, 60° 25, along contour 0, opposite −50 | s10, s13 |
| axes turned 30° | (45.98, 19.64), length 50.00 | s20 |
| ERA5 850 hPa, 18 UTC 1 Nov 2023, Brest grid point 48.5 N 4.5 W | T 5.12 °C; ∂T/∂x −3.202, ∂T/∂y −2.494 K/100 km; |∇T| 4.06; bearing 232° | s09 |
| hand centred difference at Brest | T(E) 4.511, T(W) 5.691 °C; δx 18.42 km (a cos φ δλ), δy 27.80 km; −1.180/36.84 km = −3.202; no-cosine −2.122 (ratio 0.663); cos 78.22° = 0.204 | s23 |
| wind and advection at Brest (850 hPa, 18 UTC) | (5.85, 33.49) m/s, 34.00 m/s, from 190° ("just west of south"); angle to ∇T 137.8°; ∂T/∂s along the wind −3.01 K/100 km; v·∇T −3.68 K/h | s34 |
| 850 hPa |∇T| map statistics (40–56 N, 20 W–2 E, 18 UTC) | median 0.96, 90th percentile 2.85, max 11.37 K/100 km at 49.0 N 12.5 W | s33 |
| ERA5 msl 03 UTC 2 Nov 2023, Brest (48.45 N 4.42 W) | p 968.0 hPa; |∇p| 12.87 hPa/100 km; 4 hPa per 31.1 km; ∇p towards 197°; PGF (ρ 1.25) 0.0103 m s⁻²; × 3600 s = 37 m/s | s28 |
| Ciarán centre 03 UTC (continuity track of #5, seed 52.5 N 1.75 E at 12 UTC 2 Nov) | 50.12 N 3.73 W, 953.6 hPa | s28 |
| 10-m wind vs |∇p| over the sea (40–60 N, 30 W–5 E, 03 UTC; 9290 sea points; corr 0.63) | bins 0–2: 10.0 (n 1024); 2–4: 14.9 (5723); 4–6: 17.1 (1914); 6–8: 21.6 (467); 8–10: 22.8 (116); 10–14: 25.6 m/s (46) | s29 |
| Brest 10-m wind ERA5 03 UTC; ISD gust | 23.2 m/s; 84 kt = 155.6 km/h | s29 |
| calm comparison 00 UTC 2 Nov (Azores high, 38 N 28 W) | 1024.0 hPa, 0.80 hPa/100 km, 6.6 m/s (not spoken; reserve) | — |
| GFS 18 UTC 27 Oct 2026 (orography < 50 m) | low 960.6 hPa at 66.0 N 12.0 W; max sea gradient 10.4 hPa/100 km at 70.25 N 23 W (wind 15.1); max 10-m wind 25.6 m/s at 63.0 N 1.25 E (gradient 9.1) | s31 |
| Mont Blanc | Chamonix (45.923 N 6.869 E) – summit (45.8326 N 6.8652 E) 10.06 km; cited heights 1035 m and 4806 m → 0.375; ETOPO 60″ summit cell 4169 m, Chamonix cell 1076 m; max |∇h| within the massif box 0.595; Alps-box median 0.025 | s15, s16 |
| Himalaya, 20′ block means of ETOPO 60″ | near Everest (27.5 N 86.83 E) |∇h| 0.049, towards 345°; Ganges plain median (25.2–26.5 N, 84–88 E) 49 m; plateau median (31–34 N, 85–95 E) 4926 m; transect 86.92 E: 74 m (26.5 N) → 7268 m (28.0 N); steepest 20′ block 0.087 at 41.8 N 80.2 E (Tian Shan; not spoken) | s16 |
| Trappes 12 UTC 30 Sep 2026 | surface 997.5 hPa, 168 m, 19.8 °C; 925 hPa 817 m 17.0 °C; 850 hPa 1533 m 12.3 °C; 500 hPa 5795 m −11.8 °C; WMO tropopause 13 072 m, −66.3 °C; surface → tropopause −6.672 K/km; 850 → 500 −5.65 K/km; stratosphere +0.83 K/km to 32 460 m | s17 |
| vertical vs horizontal T gradient | 6.67 K/km = 667 K/100 km; ÷ 4.06 = 164 ("about a hundred and sixty five") | s18 |
| vertical pressure gradient, surface → 925 hPa | −11.17 Pa/m = −0.112 hPa/m (1 hPa per 8.95 m); ρ = p/(R_d T) = 1.186 kg m⁻³; ρg 11.64 Pa/m; Ciarán 7.77 km per hPa → ratio 868; ordinary 1 hPa/100 km → 11 170 | s32 |
| Normandy 13 UTC 24 Jun 2024 (lon 0.0) | 49.25 N 24.6 °C (land), 49.50 N 19.9, 49.75 N 16.1 °C (sea); 55.6 km → 15.3 K/100 km; at 10 UTC 22.5 → 16.2 (11.3 K/100 km); msl box range 1013.0–1019.9 hPa (synoptic, not the breeze) | s35 |
| ERA5 Nov 2023 zonal means | 850–300 hPa layer-mean ∂T/∂y steepest −6.98 K/1000 km at 44 N; 500 hPa steepest −7.13 at 43 N; geostrophic u_g (from Z) max 31.5 m/s at 42 N, 250 hPa, Z 10 433 m; 200 hPa max 32.9 m/s at 35 N; T(30 N) − T(60 N): 21.3 (850), 19.1 (500), 15.1 K (300) | s36 |
| GFS 18 UTC 28 Oct 2026, 250 hPa | max 66.07 m/s (237.9 km/h) at 40.0 N 51.75 W | s36 |

## B. New downloads (best source first, runner-up recorded)
| Id | Dataset (key) | Subset | Size | Licence | Scenes | Why / runner-up |
|---|---|---|---|---|---|---|
| D1 | **ETOPO 2022 15″ surface** (new key `ETOPO2022-15s-montblanc`; NCEI THREDDS OPeNDAP via `fluidpy.data.fetch`) | 45.6–46.1° N, 6.6–7.2° E | ~1 MB | US Government, public domain (NOAA NCEI) | s01, s15, s16 | a crisper Cesium drape (~450 m); the spoken numbers stay the cited heights and the 60″ slope statistic (re-measured on 15″ by DG13; if the 15″ max differs, S9 says the new value). Runner-up: A4 (60″, on disk). Second runner-up: Copernicus GLO-30 DEM (30 m, heavier, licence attribution) |
| D2 | **Sentinel-2 cloudless 2023 mosaic (EOX)** tiles or **NASA GIBS** MODIS/VIIRS true colour (summer, low snow) | Mont Blanc box, ~10 m–250 m | ~10 MB | EOX s2cloudless CC BY-NC-SA 4.0 (allowed: series is noncommercial, credited) / GIBS public | s15, s16 | daytime imagery under the drape (user likes daytime satellite maps). Runner-up: GIBS VIIRS true colour 250 m (open, coarser) |
| D3 | IGRA2 Trappes refresh (`IGRA2`, `fluidpy.data.igra.fetch_station` y2d) | newest 12 UTC sounding with etime | < 1 MB | US Government, public domain | s17, s32 | series rule "latest data". Keep 2026-09-30T12 if no newer sounding is in IGRA (as at #4 planning); if refreshed, s17/s32 numbers and dates are re-worded and re-measured |
| D4 | GFS 0.25° analysis refresh (`GFS-ANL`, `fluidpy.data.gfs`) | newest cycle at build: msl, u10, v10, orography (North Atlantic); 250 hPa u, v | ~10 MB | public domain | s31, s36 | latest chart and jet; runner-up: keep A8/A12 (27 and 28 Oct 2026) |
| D5 | **ERA5 hourly u10, v10, t2m** 2024-06-24 06–18 UTC, 48–51° N, 1.5° W–2.5° E (`ERA5-ARCO`, `era5_arco.fetch_box`; single-level chunks) + **IEM ASOS/METAR** LFRG Deauville, LFRK Caen, LFOH Le Havre, LFOE Évreux (inland) (`IEM-METAR`, `fluidpy.data.metar`) | one day | ~40 MB network, < 1 MB product | CC BY 4.0 / IEM open | s35 | the onshore turn of the coastal winds in the afternoon (sea breeze) and the observed coast-inland temperature contrast. Runner-up: HRRR 3-km Florida sea-breeze day (CONUS only) |
| D6 | **ERA5 monthly means on pressure levels** u, t (`ERA5-CDS-monthly-pl`, `cds.retrieve`) | newest complete month (Sep 2026), 37 levels, 1°, reduced to zonal means | ~60 MB raw → < 1 MB | CC BY 4.0 | s36 | real zonal-mean u instead of the geostrophic estimate, and the latest month. Runner-up: A11 Nov 2023 with u_g from Z (on disk; planning values) |
| D7 | **NOAA OISST v2.1 daily** (new key `OISST-v21`; NEW F `fluidpy.data.oisst.fetch_day`, PSL/NCEI THREDDS OPeNDAP, no account) | newest final/preliminary day, 30–45° N, 80–55° W, 0.25° | < 1 MB | US Government, public domain (cite Huang et al. 2021, J. Climate 34, 2923–2939) | s37 | the Gulf Stream north wall: the largest cross-front drop over ≤ 50 km (DG36) written into S3. Runner-up: GHRSST MUR L4 0.01° (PO.DAAC, Earthdata account set up; sharper) |

Cited numbers (research-scout confirms wording and values before the build; they go to `reference/ch00/SOURCES.md` and the
manifest, never on screen):
- Mont Blanc 4805.59 m (2021 survey by the Haute-Savoie geometers; spoken "about four thousand eight hundred and six");
  Chamonix town about 1035 m (commune centre). **To confirm.**
- Storm Ciarán, 2 Nov 2023: Météo-France gust 207 km/h at Pointe du Raz (Finistère); about 1.2 million homes without power
  in France (Enedis) → "more than a million". **To confirm**, else s29 S6 is dropped.
- Explosive cyclogenesis concentrated near the Gulf Stream (and Kuroshio): Sanders and Gyakum 1980, Mon. Wea. Rev. 108,
  1589–1606 (s37 "winter storms often deepen fastest near it"). **To confirm** wording.
- Kundu printed p. 53 / Vallis (1.47)–(1.48), (1.51), (2.31): our own words; equations only.

## C. Library functions
### Existing, tested (fluidpy; re-run by QA)
| Function | Used for | Test |
|---|---|---|
| `fluidpy.core.operators.{gradient, directional_derivative}` | s03–s06, s10–s13, s19 | `../Fluid Dynamics/tests/test_ch02.py` (V1 quadratics, ∇φ·t = 0 on level sets, V3, V7) |
| `fluidpy.geo.calculus.total_differential` | s04 | `tests/geo/test_calculus.py` |
| `fluidpy.geo.vectors.{dot, norm, angle_between, scalar_projection}` | s05, s11, s20, s34 | `tests/geo/test_vectors.py` |
| `fluidpy.core.tensors.rotation_matrix_2d` | s20 | `tests/test_ch02.py` |
| `fluidpy.geo.sphere.{gradient, arc_lengths, great_circle_distance}` | s09, s15, s16, s22, s23, s28, s29, s31, s33, s35, s37 | `tests/geo/test_sphere.py` (V1, V3 order 2, V7 pole NaN) |
| `fluidpy.geo.terrain.{surface_normals, slope_aspect, hillshade}` | s15, s16 (cross-check of |∇h| and aspect; drape shading) | `tests/geo/test_terrain.py` |
| `fluidpy.geo.atmos.{geostrophic_wind_from_height, geostrophic_wind_from_msl, wind_direction_from}` | s36 (zonal-mean u_g with Z broadcast in longitude), s30 reserve, s34 | `tests/geo/test_atmos.py` |
| `fluidpy.geo.frames.coriolis_parameter` | s36 | `tests/geo/test_frames.py` |
| `fluidpy.diag.cyclone.{track_by_continuity, translation_velocity, storm_centre}` | s28 (centre), s33 (front attached to the low) | `tests/diag/test_cyclone_track.py`, `test_cyclone.py` |
| `fluidpy.diag.fronts.{front_fields, front_lines, thermal_front_parameter}` | s33 | `tests/diag/test_fronts.py` |
| `fluidpy.diag.advection.advection` | s34 (v·∇T equals |v| ∂T/∂s) | `tests/diag/test_advection.py` |
| `fluidpy.diag.sounding.layer_lapse_rate` (Kundu and met conventions) | s17 | `tests/diag/test_sounding.py` |
| `fluidpy.diag.trajectories.advect_on_sphere` | s00, s29 streaklines | `tests/diag/test_trajectories.py` |
| `fluidpy.data.{igra.find_sounding, fill_heights, wmo_tropopause; isd; gfs; era5_arco.open_box; naturalearth.land_mask_grid}` | data | `tests/data/test_*.py` |

### New (the implementer writes them with tests; never in the TSX)
| Id | Function | Formula / method | Lives in | Tests (V1 analytic, V2 symbolic, V5 benchmark, V7 limit) |
|---|---|---|---|---|
| G1 | `pressure_gradient_force(p, lat, lon, rho, a=EARTH_RADIUS)` → (Fx, Fy) [m s⁻²] and `pressure_gradient_force_cartesian(dpdx, dpdy, rho)` | −(1/ρ)∇p, Vallis (1.47) per volume divided by ρ (text after (1.47)), horizontal part with (2.31) | `fluidpy/geo/atmos.py` | V1 uniform gradient 1e-3 Pa/m, ρ = 1.2 → 8.333e-4 exactly; V7 points towards lower pressure (dot with ∇p < 0 everywhere); V5 consistency: f k × u_g from `geostrophic_wind_from_msl` equals −(Fx, Fy) to 1e-10 (same ρ); V7 pole NaN like `sphere.gradient` |
| G2 | `binned_mean(x, y, edges, mask=None)` → (centres, mean, count) | conditional mean of y in bins of x (sea points only via mask) | `fluidpy/diag/climatology.py` | V1 hand-made 10-point example; V1 empty bins → NaN with count 0; V7 one bin = global mean |
| G3 | `descent_path(F, lat, lon, start, step_m=200, n_max=500)` → (lat, lon) path along −∇F/|∇F| (RK2 on the sphere, stops at a minimum or the edge) | steepest descent on a gridded field (`sphere.gradient` + bilinear interpolation) | `fluidpy/geo/terrain.py` | V1 on a cone the path is a straight radial line to the apex's base direction; V1 on a plane it is a straight line along −∇F; V7 stops at a local minimum (|∇F| < tol) and at the edge |
| G4 | `fetch_day(date, box, version="v2.1")` and `open_day` | NOAA OISST v2.1 daily via PSL/NCEI THREDDS through `fluidpy.data.fetch()` + disk guard; licence/citation attrs | `fluidpy/data/oisst.py` (new) | V1 a recorded tiny NetCDF fixture parses to the right times/values; V7 the land mask → NaN; V1 units °C |

Builder-only (CHECK rows in the build script, no new function): unit conversions (Pa/m ↔ hPa per 100 km, m/s ↔ km/h ↔ kt,
K/km ↔ K per 100 km); rounded-input arithmetic on screen (s04, s05, s06, s13, s14, s15, s18, s20, s23, s27, s28, s32, s34,
s35); the four analytic hills of s03, s12, s14 and the title hill; isobar spacing = 4 hPa / |∇p|; block means of ETOPO
(20′) by `reshape().mean()` with the edge rows dropped; ρ = p/(R_d T) at the Trappes surface.

## D. CHECK rows the builder must assert (DG-ids)
DG01 title: ERA5 03 UTC 2 Nov msl loaded; title hill gradient at the gold point is (30, 40) m/km in its local frame ·
DG02 hook frames use the same products as s15/s28 · DG03 probe heights equal the ETOPO product values at their points ·
DG04 ∂h/∂x = 30, ∂h/∂y = 40 m/km from `operators.gradient` on the analytic plane (1e-12) · DG05 NE climb 30·cos 45° +
40·sin 45° = 49.497 (≈ 49.5; "zero point seven one" = 0.7071); sweep over 3601 directions peaks at 50.000 at 53.13°;
√(30² + 40²) = 50; `vectors.angle_between((30, 40), x̂)` = 53.13° · DG06 1 hPa per 100 km = 1e-3 Pa/m; 1 K/km = 100 K per
100 km · DG07 Brest 850 hPa 18 UTC: −3.20 ± 0.01, −2.49 ± 0.01 K/100 km; |∇T| 4.06 ("about four point one"); bearing
232 ± 2° ("about two hundred and thirty") · DG08 north check 30·0 + 40·1 = 40 · DG09 max over n̂ of ∇h·n̂ = |∇h| at θ = 0;
min −50 at 180° · DG10 on the drawn contours of the s12 hill and of the ERA5 fields, |∇F·t|/|∇F| < 1e-3 (hill, analytic)
and < 0.05 (ERA5, gridded) · DG11 50 cos 0 = 50, 50 cos 60° = 25, 50 cos 90° = 0 (|·| < 1e-12), −50 · DG12 100/2 = 50,
100/0.5 = 200 m/km; library gradient of the two analytic hills at the bracket midpoints equals these to 1 % · DG13
great-circle Chamonix–summit 10.06 ± 0.05 km ("about ten"); (4806 − 1035)/10 056 = 0.375 ("thirty seven and a half"); max
|∇h| within 5 km of the summit on the drape product 0.60 ± 0.05 ("about sixty percent"; re-worded if D1 changes it);
`terrain.slope_aspect` slope = arctan|∇h| within 0.5° · DG14 20′ block |∇h| near Everest 0.049 ± 0.005 ("about five
percent"), bearing 345 ± 10° (towards the plateau); plain median 49 m ("about fifty"); plateau median 4926 m ("almost five
thousand"); block size 37.1 km N–S, 32.9 km E–W at 27.5° N ("about thirty five kilometres across") · DG15 Trappes
2026-09-30T12: 168 m, 19.8 °C; tropopause 13 072 m, −66.3 °C (`wmo_tropopause`); 86.1 / 12.904 = 6.672 K/km ("about six
point seven"); `layer_lapse_rate` Kundu −6.67e-3 K/m, met +6.67e-3; stratosphere slope > 0 · DG16 667/4.06 = 164 ± 2
("about a hundred and sixty five") · DG17 16 directional derivatives equal `directional_derivative` · DG18 (45.98, 19.64),
length 50.000 · DG19 `arc_lengths(48.45, 0.25, 0.25)` = 27.80 × 18.44 km; at 78.22° 5.68 km E–W · DG20 T(E) 4.511, T(W)
5.691 °C at 48.5 N; δx 18.42 km; hand centred difference −3.202 equals `sphere.gradient` at the grid point to 1e-9;
no-cosine −2.122; ratio 0.663 ("a third too small"); cos 78.22° = 0.204 ("five times") · DG21 standard sea-level pressure
1013.25 hPa ("about a thousand and thirteen") · DG22 sympy: p(x + δx) − p(x) − p′(x)δx = O(δx²) · DG23 G1 equals
−(1/ρ)∇p from `sphere.gradient` · DG24 1e-3 Pa/m; /1.0 = 1e-3; /1.2 = 8.33e-4 ("eight ten-thousandths"); ×3600 = 3.0 m/s ·
DG25 Ciarán 03 UTC: centre by `track_by_continuity` 953.6 ± 0.3 hPa at 50.12 N 3.73 W ("about nine hundred and fifty
four", "about two hundred kilometres north of Brest": distance 192 ± 15 km, bearing 15 ± 10°); Brest |∇p| 12.87 ± 0.05 hPa/100 km; 400/12.87
= 31.1 km ("thirty one"); 4/31 × 100 = 12.9 ("about thirteen"; "thirteen times" the easy example); ∇p bearing 197 ± 5°
("south-south-west"), force bearing 17° ("north-north-east"); 0.01287/1.25 = 0.0103 ("about one hundredth"); ×3600 =
37.1 m/s ("about thirty seven") · DG26 sea-point bins at 03 UTC (40–60 N, 30 W–5 E, NE 50 m mask): < 2 → 10.0 ± 0.2
("ten"); > 10 → 25.6 ± 0.5 ("about twenty six"); monotonic increase across the six bins; corr 0.63 (manifest only); ISD
Brest 03 UTC 911 group 84 kt = 155.6 km/h ("about a hundred and fifty six") · DG27 (cited) Pointe du Raz 207 km/h ·
DG28 (cited) > 1 million homes without power · DG29 mean cross-isobar angle of the 10-m wind over the sea within 600 km of
the centre: towards low pressure, between 5° and 45° (else S7 says only "friction slows the wind") · DG30 GFS 27 Oct 2026
18 UTC: low 960.6 hPa at 66.0 N 12.0 W ("about nine hundred and sixty one", "just east of Iceland": within 150 km of the
NE 10 m Iceland coast, east side); max sea-point |∇p| (orography < 50 m) in 55–75 N, 35 W–5 E 10.4 ± 0.3 ("about ten";
"close to Ciarán's" = within 25 % of 12.87); max 10-m wind 25.6 ± 0.5 ("about twenty five") · DG31 Trappes surface →
925 hPa −11.17 Pa/m ("zero point one one hectopascals per metre"); 1/0.1117 = 8.95 m ("about nine"); 31.1 km/4 = 7.77 km
("about eight kilometres"); 7770/8.95 = 868 ("nearly nine hundred"); 100 000/8.95 = 11 170 ("about ten thousand"); ρ 1.186
("one point one nine"); ρg 11.64 ("eleven point six"); balloon 11.17 ("eleven point two") · DG32 850 hPa |∇T| at 18 UTC:
box median 0.96 ("about one"); max 11.37 ("about eleven") at 49.0 N 12.5 W; max/median 11.8 ("more than ten times"); the
band is within 500 km of the tracked centre ("near the storm"); front lines drawn only if attached to the tracked low ·
DG33 Brest wind 34.00 m/s ("thirty four"), from 190 ± 3° ("just west of south"); angle 137.8 ± 1° ("a hundred and thirty
eight"); 4.06 × cos 137.8° = −3.01 ("about minus three"); −3.01e-5 × 34.0 × 3600 = −3.68 K/h ("minus three point seven")
= `diag.advection` at the grid point to 1e-6 · DG34 Normandy 13 UTC: 24.6 and 16.1 °C at (49.25, 0) and (49.75, 0); 55.6 km
("about fifty five"); 15.3 K/100 km ("about fifteen", "sharper than the storm's front" = > 11.37); the MODIS image shows
cumulus over land and clear sky over the Channel at the coast (builder checks by eye; else S3 is re-worded) · DG35 Nov
2023 zonal means: layer-mean steepest −6.98 ± 0.1 K/1000 km at 44 ± 1 N ("about seven", "near forty four"); u_g max
31.5 ± 1 m/s ("about thirty") at 42 N, 250 hPa, Z 10.43 km ("about ten and a half"); the jet latitude within 3° of the
steepest-gradient latitude ("right above"); after D6: real zonal-mean u for the new month, same rows; GFS 28 Oct 2026
250 hPa max 66.07 m/s ("sixty six") = 237.9 km/h ("about two hundred and forty") · DG36 (after D7) the largest SST drop
across the Gulf Stream north wall over ≤ 50 km on the newest OISST day ("several degrees within a few tens of kilometres"
holds if the drop ≥ 3 °C over ≤ 50 km; S3 then states the measured numbers) · DG37 recap numbers equal their scene rows.

## E. Pronunciations to check in the render (lexicon not edited; proposed entries)
nabla (default G2P: check "NAB-luh"), Chamonix (`[Chamonix](/ʃˈæmənˌi/)`), Mont Blanc (`[Mont Blanc](/mˌɔn blˈɑŋk/)`),
Pointe du Raz (`[Pointe du Raz](/pwˈænt dʊ ɹˈɑ/)`), Normandy (default), Ganges (`[Ganges](/ɡˈænʤiz/)`, check), Everest
(default), Svalbard (`[Svalbard](/svˈɑlbɑɹd/)`, proposed by #5 too), ETOPO (`[ETOPO](/ˈitˌOpO/)` "EE-toe-poe"), GFS
(letters: `G F S`), UTC (letters: `U T C` — the script says "universal time" instead), Ciarán (exists), ERA5 (exists),
Trappes (exists), radiosonde (exists), hectopascals (exists). Spoken maths to listen for: "partial h by partial x",
"partial capital T by partial z", "grad h dot n hat", "partial f by partial x i", "d s", "d phi", "d lambda", "rho".

## Orchestrator notes (2026-10-28)
- s29 cited facts: already verified elsewhere (reports/data/ISD.md, #69 data): Brest peak gust 156 km/h (84 kt) per Météo-France BCMR Bretagne Nov 2023 — NOT the storm's strongest (Lanvéoc 170, Lannion 158 km/h; semaphores 190–200 km/h are not reference values per Météo-France); Enedis: 1.2 million homes in France without power (press release 7 Nov 2023). The "207 km/h at Pointe du Raz" claim is unverified — drop it or verify from a primary source before the build.
- Decisions: fetch D5 (sea-breeze winds) and D7 (OISST Gulf Stream); maths ending confirmed; add `steepest-ascent` style at build time.
