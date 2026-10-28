# ch00_vectors_index_notation (#1a) — data needs, functions and CHECK rows (movie-director, 2026-10-27; split 2026-10-28)

**Split (2026-10-28).** v1 (71 scenes, 56:32) is now two movies (orchestrator decision 1 below):
- **#1a `ch00_vectors_index_notation`** (this folder): v1 s00–s32 + new `s33_recap`, `s34_next` (spoken pointer to 1b),
  `s35_end`. Scene ids s00–s32 are unchanged from v1.
- **#1b `ch00_alternating_tensor_triple_products`** (`movies/ch00/ch00_alternating_tensor_triple_products/`): v1
  s33–s59 renumbered s05–s32, with its own title, hook, three recap scenes, a "three good reasons" scene, recap and end
  card. Its data needs are in its own `data_needs.md`.

Assignment of the shared items:

| Item | 1a (this movie) | 1b |
|---|---|---|
| D1 ARCO-ERA5 pressure levels (ω, T, u, v, z, q at 925/850/700 hPa) | s05 (850 hPa height ≈ 1.2 km), s09 (w over Brest), s27 (vertical-term size, not spoken) | s23/s27 (ρ₈₅₀ = p/(R T)), s24 (shear 925 → 850) |
| D2 ARCO-ERA5 single levels, global, 18 UTC | s02 (temperature globe) | s16 (global Coriolis arrows) |
| D3 GIBS true colour global (optional) | s02 globe base | s16 globe base |
| D4 GFS 0.25° 250 hPa (latest) | s12a (jet) | — |
| D5 ERA5 monthly means (Nov 1991–2023) | s12h (El Niño anomaly) | — |
| F1 `omega_to_w` | s09 | — |
| F2 `advection` | s00, s20–s28 | — |
| F3 `components_in_axes` | s11, s15 | — |
| F4 `volume_flux_parallelogram` | — | s25–s27 |
| F5 `geostrophic_wind_from_msl` | s12d | — |
| F6 `monthly_anomaly` | s12h | — |

D1 and D2 are fetched **once** (one product each under `data/derived/ch00/`) and read by both build scripts
(`movies/data/build_ch00_vectors_index_notation.py`, `movies/data/build_ch00_alternating_tensor_triple_products.py`).

Every download goes through `fluidpy.data.fetch()` / `fluidpy.data.era5_arco.fetch_box` and `tools/disk_guard.py`
(G: floor 50 GB, project cap 150 GB, C: floor 40 GB). Raw files to `G:/Geophysical Fluid Dynamics/aofd-data/raw/<KEY>/`,
movie products to `movies/ch00/ch00_vectors_index_notation/data/` (small JSON/bin) or `data/derived/ch00/` (re-usable,
≤ 10 MB each). Credits go to `manifest.json` and the registry, never on screen.

**Disk (2026-10-28, `df` at the split): C: 66 GB free, G: 559 GB free** (C: was 41 GB earlier today and 27 GB on
2026-10-27). If C: drops below 40 GB again the disk guard will refuse D1–D5 until C: is back above 40 GB (run
`tools/clean_scratch.py` / the cross-product archive step). Everything else in this movie is on disk.

## A. Already on disk (re-use, no download)
| Id | What | Where | Scenes (1a) |
|---|---|---|---|
| A1 | ERA5 850 hPa t, q, u, v hourly 2023-11-01T12 → 11-02T12, 30–65° N, 40° W–15° E, 0.25° | `data/derived/ch00/era5_ciaran_2023_850hPa_1h.nc` (raw `G:/…/raw/ERA5-CDS-ciaran2023-850/`) | s00, s01, s05, s11, s12f, s12i, s14, s15, s18, s24–s28, s31, s34 |
| A2 | ISD/SYNOP Brest-Guipavas (07110), 1–2 Nov 2023 | `G:/…/raw/ISD/isd_07110099999_2023-11-01_2023-11-02.csv` (also `data/derived/ch00/rwm_isd_brest_2023-11-01T12_2023-11-02T09.json`) | s02–s04, s08, s10, s27 |
| A3 | ERA5 global single hour 2023-11-02T12 (t2m, u10, v10, msl; 0.5°) | `data/derived/ch00/era5_global_2023-11-02T12_sfc_0p5.nc` | fallback for s02 if D2 cannot be fetched |
| A4 | ERA5 hourly u10, v10, msl, t2m, Ciarán box 2023-11-01T00 → 11-02T23 | `G:/…/raw/ERA5-ARCO/era5_ciaran_2023_u10-v10-msl-t2m_2023-11-01T00_2023-11-02T23_1h.nc` | s05 surface inset, s12d (isobars, 10-m wind), s12i (storm track) |
| A5 | NASA GIBS true colour 2023-11-01 (Aqua + Terra mosaic) | `data/derived/ch00/ciaran_truecolour_2023-11-01_aqua_terra.jpg` | s01, s05, s12d, s24 underlay option |
| A6 | Natural Earth 10 m coast, admin-0, admin-1 lines (Ciarán box); NE places | `data/derived/ch00/ciaran_{coast,borders,admin1_lines}_10m.geojson`; `G:/…/raw/NE-10m-places/` | every map |
| A7 | Blue Marble NG 2004 (globe base), ETOPO 2022 60″ Brittany subset (captests) | `movies/ch00/ch00_cross_product_why/data/real/globe_bmng_*.jpg`; `G:/…/captests/…/etopo_brittany*` | s01, s02, s06, s12 |
| A8 | Kundu page images (provenance only, never on screen) | `../Fluid Dynamics/chapters/pages/ch02/p067.png` (2.1), `p068.png` (2.2), `p077.png` (2.16), `p078.png` (2.17), `p079.png` (2.21–2.22, s34 teaser); App. B p862 (B.3.1, B.3.4) in `_private/Kundu_AppendixB_Mathematical_Tools.pdf` page 6 | equations |
| A9 | Vallis page images (provenance only) | `chapters/pages/ch02/p099.png` (§2.6.2: ω ≡ Dp/Dt) | s09 |
| A10 | IGRA2 Trappes sounding 00 UTC 1 Nov 2023 | (on disk, used by `ch00_weather_basics`) | s12g |

Planning numbers read from A1/A2/A4/A10 with the tested library (`fluidpy.geo.sphere.gradient`, `geo.atmos.wind_components`,
`era5_arco.storm_centre`) on 2026-10-27:

| Quantity | Value | Spoken as |
|---|---|---|
| Brest SYNOP 18 UTC 1 Nov | from 150°, 9.3 m/s, 10.3 °C → u = −4.65, v = 8.05 m/s | s04, s08, s10 |
| Brest SYNOP 20 UTC | from 210°, 13.4 m/s, 14.9 °C | s27 |
| ERA5 850 hPa, 48.5° N 4.5° W, 18 UTC | T 5.12 °C; u 5.85, v 33.49 m/s; \|u\| 34.0; q 6.48 g/kg | s11, s18, s26, s31 |
| ∂T/∂x, ∂T/∂y (0.25° centred) | −3.202, −2.494 K per 100 km (1° check: −3.165, −2.503) | s25 |
| u·∇T | −1.02 × 10⁻³ K/s = −3.68 K/h | s26, s33 |
| ERA5 850 T over Brest 17, 18, 19 UTC | 2.38, 5.12, 8.23 °C | s27 |
| ERA5 850 wind 17 UTC | (7.64, 23.33) m/s → change (−1.8, +10.2) | s12f, s14 |
| Along/across-coast components (axis bearing 80°) | 11.5 (from the rounded 5.8, 33.5; 11.6 from full precision), 32.0 | s11, s15 |
| Geostrophic (from MSLP, ρ₀ = 1.25, 0.25° gradient) vs ERA5 10-m wind at 48.0° N 6.0° W, 18 UTC | u_g = (30.9, 24.9); u = (10.0, 18.0); u_ag = (−20.9, −6.9) m/s (at 48.5° N 4.5° W the curvature is extreme: u_g (11.5, 47.6) vs (−5.6, 11.9); not used) | s12d |
| IGRA2 Trappes 00 UTC 1 Nov 2023 | 850 hPa 235° 17 m/s → (13.9, 9.8), z 1402 m; 500 hPa 255° 17 m/s → (16.4, 4.4), z 5550 m; shear (2.5, −5.4), 5.95 m/s; veering 235° → 255° | s12g |
| Ciarán centre (`era5_arco.storm_centre`, A4) | 18 UTC 1 Nov 48.75° N 11.75° W (960.7 hPa) → 00 UTC 2 Nov 49.75° N 5.75° W (954.6 hPa); ≈ 449 km in 6 h → c ≈ (20.1, 5.1) m/s; u − c at Brest 850 ≈ (−14.3, 28.4) | s12i |
| Airliner (thought example) | 250 + 50 = 300; 250 − 50 = 200; √(250² + 50²) = 254.95 m/s | s12a, s12b |
| Forces (easy numbers, units 10⁻⁴ m s⁻²) | P (0, 12.5), C (6, −8), F (−6, −4.5) → (0, 0); C ⟂ u for u ∥ (8, 6); \|C\| = 10 → \|u\| = 10⁻³ / f(48.45°) ≈ 9.2 m/s | s12c |
| ERA5 Nov trade winds, 5° S–5° N, 170–150° W (PLANNING values until D5) | climatology u ≈ −6.0, Nov 2023 u ≈ −3.5 → anomaly ≈ +2.5 m/s | s12h |
| Balloon drift (s31) | (5.8, 33.5) m/s × 3600 s → 21 km east, 121 km north ("about one hundred and twenty kilometres north") | s31 |

## B. New downloads (preferred open source first)
| Id | Dataset (key) | Subset | Size | Licence | Scenes | Why |
|---|---|---|---|---|---|---|
| D1 | **ARCO-ERA5** pressure levels (`ERA5-ARCO`) | 2023-11-01T17, T18 and T19 UTC; `vertical_velocity` (ω, Pa/s), `temperature`, `u/v_component_of_wind`, `geopotential`, `specific_humidity` at 925, 850, 700 hPa; box 40–58° N, 15° W–5° E | ~1–2 GB transferred (one full-level chunk per variable per hour), product ~ 3 MB | CC BY 4.0 (Copernicus) | 1a: s05 (850 hPa height ≈ 1.2 km), s09 (w over Brest), s27 (vertical-term size, not spoken); **shared with 1b** (s23/s27 ρ₈₅₀, s24 shear) | the up component w and the level height; the only field not already on disk |
| D2 | ARCO-ERA5 single levels, global (`ERA5-ARCO`) | 2023-11-01T18 UTC: `2m_temperature`, `10m_u/v_component_of_wind` (0.25° → product 0.5°) | 3 × 4 MB → ~3 MB product | CC BY 4.0 | 1a: s02 (temperature globe at the movie's moment); **shared with 1b** (s16 global Coriolis arrows) | one coherent moment for both movies; fallback A3 (12 UTC 2 Nov) |
| D4 | **GFS 0.25° analysis** (`GFS-ANL`, NOAA NOMADS/AWS open), latest cycle at production | 250 hPa `UGRD`, `VGRD` (+ 300 hPa for the streamlines' fallback), North Atlantic 20–75° N, 100° W–20° E | ~10 MB GRIB subset → ~2 MB product | US public domain | s12a | the jet stream on the day the video is made (series rule: latest data); jet maximum spoken "about seventy" (planning) |
| D5 | **ERA5 monthly means** (`ERA5-CDS-monthly`, CDS `reanalysis-era5-single-levels-monthly-means`, account set up) | `10m_u/v_component_of_wind` (+ `sea_surface_temperature` for the optional tint), November 1991–2023, 30° S–30° N, 120° E–80° W, 1° | ~15 MB | CC BY 4.0 | s12h | the climatology, Nov 2023 and the vector anomaly; fallback NCEP/NCAR R1 monthly `uwnd.10m.mon.mean.nc` via PSL OPeNDAP (open, public domain). GEE `ECMWF/ERA5/MONTHLY` ends 2020-06, so it cannot supply 2023 |
| D3 (optional) | NASA GIBS `MODIS_Terra/Aqua_CorrectedReflectance_TrueColor` 2023-11-01 global 0.05° (`NASA-GIBS`) | gaps filled with BMNG by `fluidpy.data.gibs.mosaic_fill` | ~25 MB | NASA open | s02 globe base (shared with 1b s16) | daytime imagery instead of a plain BMNG base |

Cited constants (data-scout adds to `reference/ch00/SOURCES.md`): a = 6371 km mean radius (`EARTH_RADIUS`); Einstein
introduced the convention in 1916 (Annalen der Physik 49, 769; only "Albert Einstein" is spoken, no date); ECMWF IFS
time step "a few minutes" (ECMWF IFS documentation; the scout confirms the current value, about 450 s at 9 km; only
"every few minutes" is spoken).

## C. Library functions
### Existing, tested (fluidpy; re-run by QA)
| Function | Used for (1a) | Test |
|---|---|---|
| `fluidpy.geo.vectors.{dot, norm, angle_between, scalar_projection, k_cross}` | every vector number; the coast component; s12c Coriolis ⟂ wind consistency row | `../Fluid Dynamics/tests/geo/test_vectors.py` (V1/V2/V7 rows) |
| `fluidpy.core.tensors.{kronecker_delta, rotation_matrix_2d, transform_vector}` (+ `levi_civita` for the s34 teaser cube only) | δ table, rotated axes; s34 cube cells | `../Fluid Dynamics/tests/core/` (Kundu ch02 V-ladder, F12 rows) |
| `fluidpy.core.index_notation.{classify_indices, tensor_order, rename_dummy, expand_indices, expand_indices_str}` | free/dummy labels, "nine terms" expansions, written-out sums shown on screen | `../Fluid Dynamics/tests/core/` (index_notation) |
| `fluidpy.core.rotating.coriolis_acceleration` | s34 teaser arrow only (computed and checked in 1b) | V1 projectile test |
| `fluidpy.geo.sphere.{gradient, great_circle_distance, initial_bearing, unit_vector}` | ∂T/∂x_i on the ERA5 grid; storm displacement; globe positions | `tests/geo/test_sphere.py` |
| `fluidpy.geo.atmos.{wind_components, wind_direction_from}` | from-direction → (u, v) (SYNOP, IGRA) | `tests/geo/test_atmos.py` |
| `fluidpy.data.isd.{read, decode}` | Brest SYNOP rows | `tests/data/test_isd.py` |
| `fluidpy.data.era5_arco.{fetch_box, open_box, storm_centre}` | D1, D2, storm track | `tests/data/test_era5_arco.py` |

### New (the implementer writes them with tests; never in the TSX) — 1a's items
| Id | Function | Formula / method | Lives in | Tests |
|---|---|---|---|---|
| F1 | `omega_to_w(omega, p, T, q=None, g=G0, R=R_D)` → m/s | w ≈ −ω/(ρ g), ρ = p/(R T_v), T_v = T(1 + 0.608 q) (hydrostatic: Dp/Dt ≈ w ∂p/∂z = −ρ g w; Vallis §2.6.2 ω ≡ Dp/Dt, page `chapters/pages/ch02/p099.png`, with ∂p/∂z = −ρg) | `fluidpy/geo/atmos.py` | V1 ω = −1 Pa/s, p = 850 hPa, T = 278 K → w ≈ +0.096 m/s; V7 sign (ω < 0 ⇔ rising); V7 q = 0 equals the dry form |
| F2 | `advection(F, u, v, lat, lon, w=None, dFdz=None)` → F-units/s | u ∂F/∂x + v ∂F/∂y (+ w ∂F/∂z) on the sphere via `sphere.gradient` and `vectors.dot` (the u_j ∂F/∂x_j of Kundu (2.2) + (2.22)) | `fluidpy/diag/advection.py` (new) or `fluidpy/geo/sphere.py` | V1 uniform gradient × uniform wind = analytic; V7 rotation invariance (rotate wind and gradient together); V7 F = x₁ (east distance) gives u (B.3.4) |
| F3 | `components_in_axes(u, bearing_deg)` → (along, across) | dot products with (sin b, cos b) and (−cos b, sin b) (wrapper on `core.tensors.rotation_matrix_2d`) | `fluidpy/geo/vectors.py` | V1 bearing 90° returns (u, v); V7 length invariant; V7 bearing + 180° flips both signs |
| F5 | `geostrophic_wind_from_msl(msl, lat, lon, rho0=1.25)` → (u_g, v_g) | u_g = −(1/ρ₀f) ∂p/∂y, v_g = (1/ρ₀f) ∂p/∂x on the sphere (`sphere.gradient`, `frames.coriolis_parameter`); equivalent to `atmos.geostrophic_wind_from_height` with Z = p/(ρ₀g₀) (Vallis §2.8, geostrophic balance — implementer renders the page) | `fluidpy/geo/atmos.py` | V1 uniform gradient analytic; V7 equals `geostrophic_wind_from_height` on Z = p/(ρ₀g₀); V7 sign check both hemispheres; NaN within 5° of the equator |
| F6 | `monthly_anomaly(field, month, year, base=(1991, 2020))` → anomaly (works on u and v separately, so vector anomalies are component-wise) | value minus the base-period mean of the same calendar month | `fluidpy/diag/climatology.py` (exists from weather basics: extend) | V1 a constant field gives 0; V7 anomaly of the base mean is 0; V1 vector anomaly = difference of the u and v anomalies |

F4 (`volume_flux_parallelogram`) moved to 1b.

Builder-only (CHECK rows in `movies/data/build_ch00_vectors_index_notation.py`, no new function): sin/cos 330° rows;
unit conversions (K/100 km → K/m, K/s → K/h); the nine-term grids (from `expand_indices_str`); the s34 teaser's six
non-zero ε cells.

## D. CHECK rows the builder must assert (VI-ids; 1a)
VI01 ISD 18 UTC row = (150°, 9.3 m/s, 10.3 °C) · VI02 wind_components(9.3, 150) = (−4.65, 8.054) · VI03 sin 330° = −0.5,
cos 330° = 0.8660 · VI04 norm(−4.65, 8.054, 0) = 9.30 · VI05 norm(6, 8, 0) = 10 · VI06 ERA5 850 point (48.5, −4.5) at
18 UTC: u ∈ [5.7, 6.0], v ∈ [33.3, 33.7], T ∈ [5.0, 5.3] °C · VI07 \|u\| = 34.0 ± 0.1; u_i u_i = 1155.9 ± 3 (rounded inputs
1155.9) · VI08 17 UTC wind (7.6, 23.3) ± 0.1; changes (−1.8, +10.2) · VI09 along/across = (11.5, 32.0) from (5.8, 33.5)
at bearing 80° (and 11.6 at full precision; the screen shows the rounded-input value) · VI10 e_along = (0.985, 0.174) ·
VI11 ∂T/∂x = −3.20 ± 0.1, ∂T/∂y = −2.49 ± 0.1 K/100 km at 0.25°, and the 1° centred difference within 0.1 of it
(robustness) · VI12 east term −1.86 × 10⁻⁴, north −8.37 × 10⁻⁴, sum −1.02 × 10⁻³ K/s, −3.68 K/h (spoken −3.7; also s33) ·
VI13 easy advection −9 × 10⁻⁴ K/s, −3.24 K/h · VI14 ERA5 850 T 17/19 UTC = 2.4/8.2 °C, rate 2.9 K/h · VI15 ISD 20 UTC
14.9 °C, 210° · VI16 D1 w over Brest 850 hPa 18 UTC ∈ [0.05, 0.3] m/s (else s09's "about ten centimetres per second"
and "around three hundred times" are re-worded to the data and re-measured) · VI17 z₈₅₀ over Brest ∈ [1.0, 1.4] km
("a little more than a kilometre") · VI18 δ = eye(3); δ_ii = 3 · VI40 Brest 10.3 °C → 14.9 °C (+4.6 °C between 18 and
20 UTC) · VI41 D4 jet maximum over the North Atlantic (spoken "about seventy"; reworded to the data) · VI42 250 ± 50 ·
VI43 √(50² + 250²) = 254.95 · VI44 force sum (0, 0), C ⟂ u, F ∥ −u, \|u\| ≈ 9.2 · VI45 u_g = (30.9, 24.9) ± 1,
u = (10.0, 18.0) ± 0.2, u_ag = u − u_g · VI46 (5,1) − (1,3) = (4, −2) · VI47 IGRA 850/500 hPa winds and heights as
tabled · VI48 shear (2.5, −5.4), 5.9 m/s, veering · VI49 D5 Nov clim and 2023 u at the box; anomaly sign > 0 (else s12h
is reworded) · VI50 storm displacement 449 ± 30 km, c = (20.1, 5.1) ± 1, u − c ≈ (−14.3, 28.4) · VI53 balloon drift
(5.8, 33.5) × 3600 s = (20.9, 120.6) km ("about one hundred and twenty kilometres north") · s34 teaser: VI19 (six
non-zero ε cells) and VI25 (push ⟂ wind, to its right), asserted in the 1b build and re-used.

VI19–VI39 and VI51–VI52 belong to 1b (its `data_needs.md`).

## Orchestrator decisions (2026-10-28)
1. Length 56:32 → split after s32 into **#1a "Vectors, adding and subtracting, index notation and the Kronecker delta"** (~33 min) and **#1b "The alternating tensor, the cross product in index form, ε–δ and triple products"** (~24 min + own title, hook and recap), per the user's preference for separate movies on distinct concepts.
2. Maths ending + related-movies row.
3. Globes at the movie's own moment (D2, ERA5 18 UTC 1 Nov); latest GFS only for the s12a jet.
4. Sentences that wait for D1/D4/D5 are reworded to the data and re-measured by the builder.
5. Add the music style `index-lattice` to `tools/sound/styles.py` (1a), and give 1b its own variant.

## Split applied (movie-director, 2026-10-28)
- Cut point kept **after s32**: 1a ends on a complete toolkit (vectors, adding/subtracting, the index rules, advection and
  the Kronecker delta), and every scene from s33 on depends on ε. 1a never needs ε; 1b needs only what its three recap
  scenes restate (the Brest moment and wind, the index rules and dot product, the delta).
- 1a's ending now points forward: `s34_next` says in one short scene what the alternating tensor will do and that "the
  next movie in this series … starts exactly where this one stops"; the end card's related row starts with 1b.
- 1b's music: `index-lattice-cycle` (variant of `index-lattice`, G minor, seed 13; spec in its storyboard).
