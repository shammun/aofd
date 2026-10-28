# ch00_alternating_tensor_triple_products (#1b) — data needs, functions and CHECK rows (movie-director, 2026-10-28)

Split from `ch00_vectors_index_notation` v1 (71 scenes, 56:32) on 2026-10-28 (orchestrator decision 1 in that folder's
`data_needs.md`). This movie is v1 s33–s59 with its own title, hook, three recap scenes, a "three good reasons" scene,
recap and end card. Build script: `movies/data/build_ch00_alternating_tensor_triple_products.py`; products to
`movies/ch00/ch00_alternating_tensor_triple_products/data/` and `manifest.json`. Credits in the manifest and the
registry, never on screen.

## Scene map (v1 → 1b)
| 1b | v1 | 1b | v1 | 1b | v1 |
|---|---|---|---|---|---|
| s00_title | new | s12_omega | s39 | s23_parcel_volume | s50 |
| s01_hook | new | s13_coriolis_easy | s40 | s24_parcel_shear | s51 |
| s02_recap_vectors | new (from v1 s02–s12) | s14_coriolis_real | s41 | s25_flux_easy | s52 |
| s03_recap_index | new (from v1 s13–s18) | s15_coriolis_meaning | s42 | s26_flux_slanted | s53 |
| s04_recap_delta | new (from v1 s29–s32) | s16_coriolis_globe | s43 | s27_flux_meaning | s54 |
| s05_coriolis_why | s33 | s17_eps_delta | s44 | s28_vector_triple_plan | s55 |
| s06_cross_basics | s34 | s18_eps_delta_check | s45 | s29_vector_triple_steps | s56 |
| s07_epsilon_def | s35 | s19_eps_delta_why | s46 | s30_vector_triple_result | s57 |
| s08_epsilon_moves | s36 | s20_lagrange_steps | s47 | s31_double_turn | s58 |
| s09_cross_index | s37 | s21_lagrange_result | s48 | s32_centrifugal | s59 |
| s10_cross_check | s38 | s22_scalar_triple | s49 | s33_recap | new (v1 s60 second half) |
| s11_why_three_reasons | new | | | s34_end | v1 s61 (1b concept, related row starts with 1a) |

Every download goes through `fluidpy.data.fetch()` / `fluidpy.data.era5_arco.fetch_box` and `tools/disk_guard.py`
(G: floor 50 GB, project cap 150 GB, C: floor 40 GB). **Disk (2026-10-28, `df`): C: 66 GB free, G: 559 GB free.**

## A. Already on disk (re-use, no download)
| Id | What | Where | Scenes (1b) |
|---|---|---|---|
| A1 | ERA5 850 hPa t, q, u, v hourly 2023-11-01T12 → 11-02T12, 30–65° N, 40° W–15° E, 0.25° | `data/derived/ch00/era5_ciaran_2023_850hPa_1h.nc` | s00, s01, s02, s14, s24, s26, s27, s31 |
| A2 | ISD/SYNOP Brest-Guipavas (07110), 1–2 Nov 2023 | `data/derived/ch00/rwm_isd_brest_2023-11-01T12_2023-11-02T09.json` (raw on G:) | s02 (9.3 m/s), s24 (ratio) |
| A3 | ERA5 global single hour 2023-11-02T12 (0.5°) | `data/derived/ch00/era5_global_2023-11-02T12_sfc_0p5.nc` | fallback for s16 if D2 cannot be fetched |
| A4 | ERA5 hourly u10, v10, msl, t2m, Ciarán box | `G:/…/raw/ERA5-ARCO/era5_ciaran_2023_u10-v10-msl-t2m_2023-11-01T00_2023-11-02T23_1h.nc` | s02 (isobars), s05 (the low seen from above), s24 (surface vs 850 wind) |
| A5 | NASA GIBS true colour 2023-11-01 | `data/derived/ch00/ciaran_truecolour_2023-11-01_aqua_terra.jpg` | s01, s26 |
| A6 | Natural Earth 10 m coast, borders, admin-1; NE places | `data/derived/ch00/ciaran_{coast,borders,admin1_lines}_10m.geojson` | every map |
| A7 | BMNG globe base; ETOPO Brittany subset | `movies/ch00/ch00_cross_product_why/data/real/globe_bmng_*.jpg`; `G:/…/captests/…/etopo_brittany*` | s01, s02, s04, s05, s12, s16, s32 |
| A8 | Kundu page images (provenance only) | `../Fluid Dynamics/chapters/pages/ch02/p067.png` (2.1), `p068.png` (2.2), `p077.png` (2.16), `p078.png` (2.17–2.19), `p079.png` (2.20–2.22) | equations |
| A9 | Vallis page images (provenance only) | `chapters/pages/ch02/p077.png` (2.12, 2.13 and the identity Ω × (Ω × r⊥) = (Ω·r⊥)Ω − (Ω·Ω)r⊥), `p089.png` (2.77: Ω = (0, Ω cos ϑ₀, Ω sin ϑ₀); 2.79 k × u) | s05, s12, s31, s32 |

Planning numbers (tested library on the files on disk, 2026-10-27):

| Quantity | Value | Spoken as |
|---|---|---|
| Brest SYNOP 18 UTC 1 Nov (recap) | 9.3 m/s | s02 |
| ERA5 850 hPa, 48.5° N 4.5° W, 18 UTC | u 5.85, v 33.49 m/s; \|u\| 34.0; q 6.48 g/kg | s02, s14, s26, s27, s31 |
| Ω (ENU) at 48.45° N | (0, 4.837, 5.457) × 10⁻⁵ s⁻¹ | s12 |
| −2Ω × u (u = (5.85, 33.49, 0)) | (3.656, −0.633, 0.561) × 10⁻³ m s⁻²; \|flat\| 3.71 × 10⁻³ | s14, s15 |
| Easy Coriolis at 45° N, u = (0, 10, 0) | (+1.03 × 10⁻³, 0, ≈ 0) | s13 |
| Easy cross product (5,1,0) × (1,3,0) | (0, 0, 14); Lagrange 196 = 260 − 64 | s10, s21 |
| Brest → Saint-Malo (48.39° N 4.49° W → 48.65° N 2.00° W) | 185.6 km, initial bearing 80.1° → p = (183, 32, 0) km | s26 |
| Curtain flux u·(q × p) | 5945 km²·m/s = 5.94 × 10⁹ m³/s; × ρ₈₅₀ ≈ 1.06 → 6.3 × 10⁹ kg/s; × q → 4.1 × 10⁷ kg/s | s26, s27 |
| Centrifugal at Brest | Ω² a cos φ = 0.02247 m s⁻² (0.229 % of g); r⊥ = 4226 km | s32 |

## B. New downloads (shared with 1a; fetched once)
| Id | Dataset | Scenes (1b) | Notes |
|---|---|---|---|
| D1 | ARCO-ERA5 pressure levels 17–19 UTC 1 Nov 2023 (ω, T, u, v, z, q at 925/850/700 hPa) | s23 and s27 (ρ₈₅₀ = p/(R T)), s24 (shear 925 → 850) | full spec in 1a `data_needs.md` §B; one product under `data/derived/ch00/`, read by both build scripts |
| D2 | ARCO-ERA5 single levels, global, 18 UTC 1 Nov 2023 (t2m, u10, v10) | s16 (global wind + Coriolis push arrows) | fallback A3 |
| D3 (optional) | NASA GIBS true colour global 2023-11-01 | s16 globe base | as 1a |

D4 (GFS jet) and D5 (ERA5 monthly) are 1a-only.

Cited constants: Ω = 7.292115 × 10⁻⁵ s⁻¹ (WGS-84, `geo.constants.OMEGA`); a = 6371 km mean radius (`EARTH_RADIUS`);
equatorial minus polar radius 21.385 km (WGS-84 a = 6378.137 km, b = 6356.752 km); sidereal day 23 h 56 min 4 s.
Atmospheric river definition: AMS Glossary "atmospheric river" (no claim that this curtain is one; s27 says "streams
like this").

## C. Library functions
### Existing, tested (fluidpy; re-run by QA)
| Function | Used for (1b) | Test |
|---|---|---|
| `fluidpy.geo.vectors.{dot, cross, norm, parallelogram_area, triple_scalar, k_cross}` | every vector number; flux; parcel volume; quarter turns | `../Fluid Dynamics/tests/geo/test_vectors.py` (incl. `test_triple_scalar_V1_determinant_and_V7_cyclic`, `test_k_cross_V7_quarter_turn_properties`) |
| `fluidpy.core.tensors.{kronecker_delta, levi_civita, permutation_sign, epsilon_delta_residual, cross, cross_einsum, triple_product}` | δ (recap), 27-cell ε cube, 81-case check, index-form cross product, p × p = 0, vector triple product | `../Fluid Dynamics/tests/core/` (Kundu ch02 V-ladder, F12 rows) |
| `fluidpy.core.index_notation.{classify_indices, expand_indices, rename_dummy}` | s03 recap of the index rules | `../Fluid Dynamics/tests/core/` (index_notation) |
| `fluidpy.core.gfd.earth_rotation_local(lat)` | Ω = (0, Ω cos φ, Ω sin φ) | V1 Ω_z = f/2, \|Ω\| = Ω |
| `fluidpy.core.rotating.{coriolis_acceleration, centrifugal_acceleration}` | −2Ω × u; −Ω × (Ω × r) | V1 projectile test; V2 sympy potential |
| `fluidpy.geo.frames.coriolis_parameter` | f in the s16 global field | `tests/geo/test_frames.py` |
| `fluidpy.geo.sphere.{great_circle_distance, initial_bearing, unit_vector}` | the curtain; globe positions | `tests/geo/test_sphere.py` |
| `fluidpy.data.isd.decode`, `fluidpy.data.era5_arco.{fetch_box, open_box}` | recap station value; D1, D2 | `tests/data/` |

### New (implementer) — 1b's item
| Id | Function | Formula / method | Lives in | Tests |
|---|---|---|---|---|
| F4 | `volume_flux_parallelogram(u, p, q)` → m³/s | u·(p × q) (= `triple_scalar(u, p, q)`), with a docstring for the flux meaning | `fluidpy/geo/vectors.py` (thin wrapper; optional — the builder may call `triple_scalar` directly) | V1 10 m/s through a 100 km × 1 km east–west curtain = 10⁹ m³/s; V7 parallel window → 0 |

F1–F3, F5, F6 are 1a's. Builder-only CHECK rows (no new function): the 27-cell ε table and the 81-case table for the
cube and grid animations; ρ₈₅₀ = p/(R T); parcel mass; km²·m/s → m³/s.

## D. CHECK rows the builder must assert (VI-ids; 1b)
Recap (same values as 1a, re-asserted here so 1b stands alone): VI01 ISD 18 UTC 9.3 m/s · VI04 norm = 9.30 · VI06 ERA5
850 point u ∈ [5.7, 6.0], v ∈ [33.3, 33.7] · VI07 \|u\| = 34.0 ± 0.1 · VI18 δ = eye(3); δ_ii = 3.

VI19 ε has 6 non-zero of 27; permutation_sign table · VI20 epsilon_delta_residual() == 0; the two hand cases (+1, −1) ·
VI21 cross((5,1,0),(1,3,0)) = (0,0,14) = cross_einsum · VI22 Lagrange 196 = 260 − 64 · VI23 Ω_ENU(48.45°) = (0, 4.84,
5.46) × 10⁻⁵ · VI24 easy Coriolis at 45°, (0,10,0) → (+1.03 × 10⁻³, 0, ≈0) (spoken "plus one times ten to the minus
three", Ω_y = Ω_z ≈ 5.16 × 10⁻⁵ spoken "about five") · VI25 real −2Ω × u = (3.66, −0.63, 0.56) × 10⁻³; flat part ⟂ u
to 1e-12; bearing of the push 99.8°, of the wind 9.9° · VI26 9.81 / 5.6 × 10⁻⁴ ≈ 17 500 ("nearly twenty thousand") ·
VI27 \|flat\| × 3600 = 13.4 m/s · VI28 global field: sign(push × wind)_z = −sign(lat) for every arrow (right in NH,
left in SH) · VI29 parcel volume 10⁸ m³; ρ₈₅₀ from D1 ∈ [1.03, 1.09]; mass ≈ 1.06 × 10⁸ kg · VI30 sheared parcel
triple_scalar unchanged (10⁸) · VI31 easy flux 10⁹ m³/s · VI32 Brest→Saint-Malo 185.6 km, bearing 80.1°, p = (183, 32)
km · VI33 q × p = (−32, 183, 0) · VI34 flux 5945 km²·m/s ± 10 → 5.94 × 10⁹ m³/s; mass 6.3 × 10⁹ kg/s; vapour 4.1 × 10⁷
kg/s (q from A1) · VI35 vector triple check (1,0,0),(0,1,0),(1,1,0) → (0,1,0) both ways · VI36 k̂ × u, k̂ × (k̂ × u) with
the real wind · VI37 centrifugal 0.0225 m/s², 0.229 % of g; r⊥ = 4226 km · VI38 WGS-84 a − b = 21.385 km · VI39
surface/850 wind ratio 34.0 / 9.3 = 3.7 ("more than three times") · **VI51** (new, s11) cross_einsum(p, p) = 0 for
p = (5, 1, 0), and the i = 1 pair ε₁₂₃p₂p₃ + ε₁₃₂p₃p₂ = 0 · **VI52** (new, s11) cross(q, p) = −cross(p, q) = (0, 0, −14).
