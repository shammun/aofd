# Chapter 0 verification — weather basics UF1 library additions (movie `ch00_weather_basics`)   2026-10-29, fluidpy c98a247 (tests uncommitted), aofd 776151f

Scope: the functions committed in fluidpy c98a247 for the UF1 revision (data_needs.md §G2 F12–F15, CHECK rows W53–W76 and
the orchestrator's implementer notes): `geo.constants.{MOLAR_MASS_DRY_AIR, MOLAR_MASS_WATER, MOLAR_MASS_RATIO}`,
`geo.atmos.{pressure_height, pressure_height_standard, equal_mass_slabs, dry_parcel_ascent}`,
`diag.sections.{section_path, vertical_section, section_anomaly, along_section_wind, in_section_tracks}`.
Equations read from the page images (2026-10-29): (1.53) ch01/p033, (1.103)–(1.105) ch01/p044, (1.185)–(1.186)
ch01/p062, (2.245)–(2.246) ch02/p119. Every docstring formula matches the page.

New test files (fluidpy, not committed):
- `../Fluid Dynamics/tests/geo/test_atmos_heights_parcel.py` — 24 tests
- `../Fluid Dynamics/tests/diag/test_sections.py` — 19 tests (2 on the real ERA5 slice; they ran, nothing skipped)

Result: **43 passed** (also with `-W error`), 0 skipped.

## Environment
Python 3.12.1 · numpy 2.5.4 · scipy 1.18.1 · sympy 1.14.0 · xarray 2026.9.0 · MetPy 1.7.1 · pyproj 3.8.0.

## Validation table
| Concept / Eq. | fluidpy target | Evidence (V-levels) | Numbers | Label |
|---|---|---|---|---|
| μ^d, R = R*/μ̄ (1.53) | `MOLAR_MASS_DRY_AIR` | V1 USSA-1976 composition sum Σ M_i f_i; V1 identity with core; V1 R_D = R*/μ^d | sum agrees to < 2e-5 rel; R_D identity 1e-14 | analytic |
| μ^v | `MOLAR_MASS_WATER` | V5 NIST WebBook 18.0153; V1 2·1.00794 + 15.9994 | within 5e-5 g/mol (NIST's rounding) | benchmark, analytic |
| μ^d/μ^v ≈ 1/ε (18.6) | `MOLAR_MASS_RATIO` | V1 = R^v/R^d (1e-14); V7 vs 1/ε = 1/0.622 | 1.60777; vs 1/ε 3e-5 rel; W65 spoken 28.96/18.02 within 0.1 % | analytic, limit |
| z = H ln(p0/p), (1.186) inverted | `pressure_height` | V1 closed forms (H ln 2, z(p0/e) = H, 3 temperatures, broadcast); V1 round trip with `core.statics.isothermal_pressure`; V2 sympy dsolve of ∂p/∂z = −pg/(RT), solve for z, W58 tangent, W59 integrals; V5 MetPy `thickness_hydrostatic`; V7 p0 → 0, monotone, guard | closed form 1e-14 rel; round trip < 1e-9 m; MetPy 1e-10 rel | analytic, symbolic, benchmark, limit |
| USSA-1976 inverse | `pressure_height_standard` | V1 round trip with `core.statics.standard_atmosphere` 0–84.852 km (geopotential) and 0–85.99 km (geometric); V1 troposphere closed form typed here; V1 every layer base and mid-layer typed formula; V5 PDAS Table 1 (geometric Z = 5–50 km); V7 limits, ordering, out-of-range raise | round trip < 1e-8 m (geopot.), < 1e-6 m (geometric); PDAS within H_s·1e-3 (table has 4–5 figures) | analytic, benchmark, limit |
| equal-mass slabs (2.50c integrated) | `equal_mass_slabs` | V1 tops = H ln(n/(n−k)) for n = 2, 3, 7, 10, 50; V1 independent route: `quad` of ρ(z) between tops = p0/(ng) (isothermal and USSA); V7 standard model below 11 km = linear-lapse closed form, guards | tops 1e-13 rel; slab masses 1e-9 rel (both models); W62 nine tops all exact to 3 dp | analytic, limit |
| dry adiabatic ascent (1.105), (1.53), (2.246) | `dry_parcel_ascent` | V1 start state, neutral column T = T0 − gz/c_p, Poisson V/V0 = (p0/p)^{1−κ}, θ conserved in 4 environments; V1 non-default gas (κ ≠ 2/7); V2 sympy from (1.104) to T = T0(p/p0)^κ, Poisson ratio, (2.245)→(2.246), hydrostatic residual of the neutral column; V5 MetPy `dry_lapse`, `potential_temperature`; V1 isothermal env vs `solve_ivp` of dT/dz = −(g/c_p)T/T_env; V7 Kundu sign (lapse = −6.5e-3 reproduces USSA p), p_env callable = array = lapse, sign-flip mutant differs | 1e-12 rel closed forms; MetPy 1e-10; solve_ivp 1e-9; W69: 11.3 °C, 860 hPa, V/V0 = 1.124 | analytic, symbolic, benchmark, limit |
| section path (2.27), great circles | `section_path` | V1 parallel length a cos ϑ Δλ; V1 haversine length, equal arc steps, polyline legs; V7 reversal, guards | 1e-14 / 1e-12 rel; W72 1621 km, ×80.0 within 1 % | analytic, limit |
| vertical section | `vertical_section` | V1 linear field exact (parallel, great circle, polyline; synthetic and real ERA5 grid); V1 grid nodes; V5 scipy `RegularGridInterpolator`; V3 grid refinement; V3 path refinement of ∫F ds; V7 reversal, N→S, 0–360 lon, leading dims, outside → NaN, NaN levels, global seam, guards | linear < 1e-11; scipy < 1e-12; orders 1.99 and 2.00 | analytic, benchmark, converged, limit |
| along-slice anomaly | `section_anomaly` | V1 zero mean per level, level-only field → 0, per-level and full references, numpy = xarray path, NaN handling | 1e-12 | analytic |
| along-slice wind (2.28)–(2.29) | `along_section_wind` | V1 eastward/westward parallel ±u, northward/southward meridian ±v; V5 pyproj great-circle azimuths (tangent 7 m/s kept, normal 3 m/s removed); real data u_s = u on 48.5° N | interior 1e-12, ends < 1e-6 (O(Δλ³)), pyproj < 1e-6 | analytic, benchmark |
| Dr/Dt = v in the slice (§1.1.2), RK4 | `in_section_tracks` | V1 uniform flow straight lines (slope w/u, W73), linear shear on tilted 2-D z, exponential stretching; V1 solid-body rotation radius; V3 RK4 order; V7 leaving → NaN for good, s/z descending orders, deterministic, guards | radius drift 4.2e-11 per period; order 4.00 | analytic, converged, limit |
| real ERA5 slice | sections chain | V1 linear field on the real grid; nodes = file values; V5 scipy at off-grid points; qualitative cold-front location and tilt (W70) | see Open items | analytic, benchmark, qualitative |

## Functions used by the movie builder (§G2) — test names
- constants: `test_molar_mass_dry_air_V1_ussa_composition_sum`, `test_molar_mass_water_V5_nist_and_atomic_weights`, `test_molar_mass_ratio_V1_gas_constants_and_epsilon`
- `pressure_height`: `test_pressure_height_V1_closed_forms_isothermal`, `…_V1_round_trip_core_isothermal`, `…_V2_symbolic_inverse_and_hydrostatic_ode`, `…_V5_metpy_thickness_hydrostatic`, `…_V7_limits_and_guards`; `test_scale_height_V1_spoken_W56_W57`
- `pressure_height_standard`: `…_V1_round_trip_core_0_84km`, `…_V1_troposphere_closed_form_halving`, `…_V1_layer_bases_and_upper_closed_forms`, `…_V5_pdas_table1`, `…_V7_limits_and_W64_numbers`
- `equal_mass_slabs`: `…_V1_isothermal_tops_and_W62`, `…_V1_mass_by_density_quadrature`, `…_V7_standard_model_and_guards`
- `dry_parcel_ascent`: `…_V1_start_neutral_column_and_poisson`, `…_V1_W69_numbers`, `…_V2_derivation_poisson_and_gamma_d`, `…_V5_metpy_dry_lapse_and_theta`, `…_V1_non_default_gas`, `…_V1_isothermal_env_vs_solve_ivp`, `…_V7_environments_and_signs`
- `section_path`: `…_V1_parallel_length_and_W72`, `…_V1_great_circle_and_polyline_lengths`, `…_V7_reversal_and_guards`
- `vertical_section`: `…_V1_linear_field_exact_parallel_and_great_circle`, `…_V1_grid_points_and_V5_scipy_bilinear`, `…_V3_grid_refinement_second_order`, `…_V3_path_refinement_line_integral`, `…_V7_reversal_lat_order_lon_convention_leading_dims`, `…_V7_outside_nan_global_wrap_and_guards`, `…_V1_real_grid_linear_field_and_nodes`
- `section_anomaly`: `…_V1_zero_mean_level_field_and_reference`
- `along_section_wind`: `…_V1_parallels_and_meridians`, `…_V5_pyproj_azimuth_great_circle`
- `in_section_tracks`: `…_V1_uniform_straight_lines_W73`, `…_V1_linear_fields_sampled_exactly_tilted_levels`, `…_V1_solid_body_rotation_radius`, `…_V3_rk4_fourth_order`, `…_V7_leaving_nan_orientation_and_guards`
- real data: `test_sections_qualitative_real_cold_front_location_and_tilt`

## Convergence studies
| Scheme | Grids / steps | Observed order | Design |
|---|---|---|---|
| `in_section_tracks` RK4, solid-body rotation, half period | 10, 20, 40, 80 (160) steps | 3.9995 (3.9997 with 5 levels) | 4 |
| `vertical_section` bilinear, sin·cos field | Δ = 1, 0.5, 0.25, 0.125 (0.0625)° | 1.988 (1.990) | 2 |
| trapezoid ∫F ds along a great-circle section (tests `s`) | n = 11, 21, 41, 81 (161) | 2.003 (2.002) | 2 |

## Conservation / invariant residuals
- Solid-body rotation radius over one period (400 steps): max |r/r0 − 1| = 4.2e-11.
- Potential temperature along the parcel path (MetPy θ): ptp/θ < 1e-12.
- Slab masses by density quadrature: each slab within 1e-9 of p0/(10g) in both atmospheres; n slabs hold p0/g.

## Benchmarks used (`reference/ch00/SOURCES.md`, rows dated 2026-10-29)
| Benchmark | Value | Ours | Source |
|---|---|---|---|
| Water molar mass | 18.0153 g/mol | 18.01528 | NIST Chemistry WebBook (fetched 2026-10-29) |
| USSA-1976 dry-air molar mass | 28.9644 (Σ composition table) | 28.9644 | NASA-TM-X-74335 |
| USSA-1976 p at Z = 5…50 km | PDAS Table 1 | heights within H_s·1e-3 | pdas.com bigtables (fluidpy reference/ch01) |
| Dry adiabat, θ, isothermal thickness | MetPy 1.7.1 | 1e-10 rel | Unidata MetPy |
| Great-circle azimuths | pyproj 3.8.0 Geod (sphere a = 6.371e6 m) | < 1e-6 m/s on a 7 m/s wind | PROJ / GeographicLib |

## Numbers from the spec (CHECK rows)
| Row | Spec | Ours | Comment |
|---|---|---|---|
| W56 | 287 × 288.15 / 9.81 = **8430.3** m | **8430.08** m | arithmetic slip in the spec; both still round to 8.43 km (test asserts 8430.08 and the 8.43 rounding) |
| W57 | 8431.6 m, within 0.1 % of RT/g | yes | — |
| W62 | 0.889 … 19.422 km, 1033 kg | all nine exact to 3 dp | — |
| W63 | H ln 2 = 5846.5 m | 5846.5 m | — |
| W64 | 505.1 hPa / 0.1015 / 0.00995 | geopotential values confirmed; geometric 505.40 hPa / 0.10218 / 0.010179 | implementer note confirmed; USSA halving height 5.477 km geopotential, **5.482 km geometric** (spec's 5.574 km wrong), below the isothermal 5.846 km |
| W65 | 1.607 / 1.6077 | 1.60777; 3e-5 from 1/ε | — |
| W69 | 11.3 °C, 860 hPa, 1.12 | 11.3 °C, 860 hPa, 1.124 | — |
| W72 | 1621 km, ×80 ± 1 % | 1621 km, ×80.0 | — |
| W70 | cold front at 14–11 W, slope 1:30–1:150 | at 850 hPa 12.75 W; vertical below 750 hPa, then tilts west to 14.0 W at 450 hPa; 925→500 hPa slope ≈ 1:15 | location confirmed; **slope steeper than the planned range** (implementer's rough 1:18 confirmed); narration must follow the data |

## Figures reproduced with our code (`outputs/ch00/verify/`, local)
| Figure | Verdict |
|---|---|
| `uf1_pressure_heights.png` | The USSA inverse passes through every PDAS point, the isothermal curve runs above it (warmer column, deeper), and the slab tops lie on the isothermal curve. |
| `uf1_dry_parcel.png` | Neutral-column parcel temperature lies on T0 − gz/c_p, MetPy's dry adiabat (dotted) overlays both environments, and V/V0 overlays Poisson's (p0/p)^{1−κ}. |
| `uf1_era5_section_front.png` | The 48.5° N slice shows a cold air mass west of 13 W, the frontal line (largest smoothed eastward dT/ds) vertical below 2 km and tilting west with height to about 7 km, and 6-h in-slice tracks rising over the warm sector. |
| `uf1_convergence.png` | All three studies lie on their design slopes (4, 2, 2) over 4 levels. |

## Mutation check (scratch copy, the editable install bypassed; `scratchpad/mut/mutate.py`, `mutate2.py`)
50 mutants over `constants.py`, `atmos.py` (new functions), `sections.py` and `_grid._bilinear`: **46 killed, 4 survived, all 4 equivalent**:
- `searchsorted(..., side="left")` in `pressure_height_standard`: at a base pressure both layers give the same height (continuity), so there is nothing to see. The −2 offset variant was killed.
- polyline `great_circle_distance(lat1, lon2, lat2, lon1)`: the haversine is even in Δλ, so the swap is exact.
- removing the `inside` mask from only u or only w in `_SectionSampler._column`: the other component is still NaN and the particle becomes NaN anyway. Removing the mask itself (both, or only the top check) was killed.

First round: κ = 2/7 survived because fluidpy's R_D/C_P and MetPy's Rd/Cp_d both equal 2/7 exactly. I added `test_dry_parcel_ascent_V1_non_default_gas` (κ = 0.2854), and it kills that mutant (ch15 lesson: test with non-default gas properties).

## Deviations & justifications
- `MOLAR_MASS_DRY_AIR` = 0.0289644 kg/mol (USSA-1976) rather than the plan's 0.0289647 (CIPM-2007): the implementer's DEVIATION note says this keeps one source with `R_D`. The relative difference is 1e-5 and does not change the ratio 1.6078. Accepted.
- Test-side fixes during the run (not tolerance changes): W56 asserted at the true product 8430.08 m; the geometric round trip stops at 85.99 km because core clamps H(86 km) = 84852.04 m to the 84852 m top; the end-point azimuth in the pyproj test used the wrong element of `Geod.inv`.

## Open items
0. **Flaky Kundu test (library owner, not this change):** `test_ch05.py::test_gaussian_tube_V1_cartesian_field_and_sections` draws from a module-level `RNG` and its divergence bound 1e-6 sits close to the observed round-off × h² (1.19e-6 under one xdist order). Hypothesis: a stencil step h = 1e-4 gives round-off of order 1e-16/h² × |ω| ≈ 1e-8 relative per term, amplified at points near the tube core. Suggest a per-test seeded generator (and, if justified, a bound tied to the stencil error) through the owner. I did not edit it.
1. **W70 front slope (needs the movie builder/director):** the cold front in the ERA5 slice is about 1:15 (925→500 hPa) and vertical in the lowest 2.5 km at 0.25° resolution. That is outside the planned 1:30–1:150, and outside the 1:40–1:120 needed to keep "about one kilometre up for every fifty to a hundred kilometres". Under rule §D the s47 narration must follow the data. The test checks only location (14–11 W), westward tilt and a wide sanity band of 1:50–1:5. Label: qualitative.
2. **W71 warm front:** not tested here, because it depends on the builder's warm-front detector (the implementer's rough check gave about 1:63, outside 1:80–1:300). The builder's W71 assert decides.
3. **Stale docstrings (library owner):** the `Validation:` lines of all nine new functions still say "planned …" (`atmos.py` lines 575, 613, 674, 745; `sections.py` lines 62, 113, 155, 197, 306). They should be updated to the achieved levels and test names above. I did not edit them (verifier never patches `fluidpy/`).
4. **Spec slips to correct in data_needs.md §G3:** W56 should read 8430.1 m, not 8430.3; W64's halving height should read 5.482 km geometric, not 5.574 km (already in the implementer note).

## Suites
C: 72 GB free before the run (≥ 45 GB), so the **full** fluidpy suite ran once, alone, from `../Fluid Dynamics`
(`pytest -q -n 8 -p no:cacheprovider tests`). Full log: `outputs/ch00/verify/uf1_fluidpy_full_suite.log` (local).
- **fluidpy full suite: 1 failed, 2957 passed, 1 xfailed, 4 warnings in 2060.43 s (34:20).**
  The one failure is `tests/test_ch05.py::test_gaussian_tube_V1_cartesian_field_and_sections` (Kundu ch05): the
  stencil divergence of the Gaussian tube was 1.19e-6 at one of 12 random points against a bound of 1e-6.
  **It is unrelated to this change** (c98a247 touches only `geo/atmos.py`, `geo/constants.py` and `diag/sections.py`,
  and the test calls none of them). It is **order-dependent**: the points come from a module-level `RNG`, so under xdist
  they depend on which tests ran before it on the same worker. Re-run serially: `tests/test_ch05.py` **135 passed**
  (143.95 s), and the test alone passes. Earlier full runs (2882 passed) did not hit it.
- New UF1 test files: 43 passed (included in the count above).
- AOFD repo suite (`tests/`): **35 passed, 1 skipped** in 23.27 s.
- Disk after: C: 72 GB free, G: 526 GB free.

## Verdict: PASS for the nine UF1 functions (every function ≥ 2 independent levels, at least one of V1/V2/V3/V5; 43/43 tests; mutation 46/50 killed, 4 equivalent). The **full-suite gate is not clean**: 1 order-dependent Kundu ch05 failure, unrelated and passing serially (Open item 0). By the strict rule this is FAIL until that flake is fixed or the orchestrator accepts it.
