# Chapter 0 library verification — gradient movie #6 (`ch00_gradient`)      2026-10-28

AOFD at `b290a91`; fluidpy at `2634692` (the library under test) + **uncommitted tests written by this verifier**
(nothing committed). A data-scout had uncommitted work in `fluidpy/data/cds.py` and `tests/data/test_coops.py` during
the full-suite run. Those files are included in the counts below and were not touched by me. Plan:
`movies/ch00/ch00_gradient/data_needs.md` §C (G1–G3) and the CHECK rows DG06, DG23–DG26, DG13 (start point). The
**G1 sign correction** at the end of that file is applied: f k × u_g = **+F**.

## Environment
Python 3.12.1 · numpy 2.5.4 · scipy 1.18.1 · sympy 1.14.0 · xarray 2026.9.0 · pint 0.26.2 · pytest-xdist (AOFD
`.venv`, fluidpy editable). Disk before and after: C: 68 → 67 GB free, G: 530 GB free (no downloads; ERA5 Ciarán and
the ETOPO Alps subset were already on G:; G: stayed mounted throughout).

## Equations checked on the page images
| Equation | Page (pdf image / printed) | Matches the code |
|---|---|---|
| (1.45) dF̂_p = −p dS; (1.46) F̂_p = −∮ p dS; (1.47) F̂_p = −∫ ∇p dV; text: "per unit volume … −∇p, and the force per unit mass is ∇p/ρ" | ch01/p031 / 11 | yes, as −∇p/ρ. The printed per-mass sentence lacks the minus; (1.47) and (1.48) require it. The docstring already says so |
| (1.48) ∂v/∂t + (v·∇)v = −(1/ρ)∇p + ν∇²v + F_b | ch01/p032 / 12 | yes |
| (2.31) ∇φ = i (1/(r cos ϑ)) ∂φ/∂λ + j (1/r) ∂φ/∂ϑ + k ∂φ/∂r (ϑ latitude) | ch02/p081 / 61 | yes (horizontal part, r = a, through `sphere.gradient`) |
`binned_mean` and `descent_path` are diagnostics with no book equation. descent_path uses the (2.31) metric.

## Test files (fluidpy) and counts
| File | Test functions (items) | Status |
|---|---|---|
| `../Fluid Dynamics/tests/geo/test_atmos_pgf.py` | 16 (17; 2 real-data, skip without the G: product) | new, all pass |
| `../Fluid Dynamics/tests/diag/test_binned_mean.py` | 6 (6; 1 real-data) | new, all pass |
| `../Fluid Dynamics/tests/geo/test_terrain_descent.py` | 9 (10; 1 real-data) | new; **2 items fail by design** (the V3 order proof, see Defects) |

## Validation table
| Id / Eq. | fluidpy target | Evidence (V-levels) | Numbers | Label |
|---|---|---|---|---|
| G1, (1.47)/(1.48) | `geo.atmos.pressure_gradient_force_cartesian` | **V1** uniform gradient 1e-3 Pa/m, ρ = 1.2 → −1e-3/1.2 (the exact IEEE quotient); DG24, DG06; 50 random linear fields · **V2** pint: all four terms of (1.48) are accelerations, while ∇p alone (per volume) is not · **V2** D-row (1.45)→(1.46)→(1.47): sympy surface integral of −p dS on a shrinking cube, built face by face, for a general cubic p → −∇p per unit volume, with an O(h²) remainder; exact for linear p · **V7** F·∇p = −\|∇p\|²/ρ < 0 (1000 random cases, ρ from air to sea water); ∝ 1/ρ; zero gradient → zero force; ρ ≤ 0 raises | \|F\| = 8.333e-4 m s⁻² = 1/1200 to 4e-16; ×3600 = 3.0 m/s; DG24 1e-3/1.0 = 1e-3 exactly | analytic, symbolic, limit |
| G1, (1.47)/(1.48) with (2.31) | `geo.atmos.pressure_gradient_force` | **V1** uniform northward 1e-3 Pa/m on the sphere → F_y = −8.333e-4 at every node incl. edges; p linear in λ and ϑ exact incl. the one-sided edges; N→S order; hand centred differences (δx = a cos ϑ δλ) on a random field (DG23 by an independent route) · **V2** sympy (2.31) from the position vector: solve Jᵀ G = ∇_q p and project on (i, j, k) = printed (2.31); then −(1/ρ)·(2.31) = the coded F · **V2** sign of the geostrophic relation from (2.198): f k × u_g = +F, and the original "−F" is shown false · **V3** smooth trigonometric field, regional 40–60 N grid (interior and edges separately) and global periodic grid (seam columns) · **V5** consistency: f k × u_g from `geostrophic_wind_from_msl` (f and the cross product computed in the test with numpy) equals +F, Gaussian lows in both hemispheres and ERA5 Ciarán · **V7** F·∇p < 0 against an independent numpy gradient; F points into a low (cos angle < −0.999 on a 100–1500 km ring); poles NaN in F_x; ρ = p/(R_d T) per node; time stacks; hemisphere mirror; ρ ≤ 0 and shape guards; seam stencil = centred difference across 360°/0° (added after mutation) · **V1 real data** DG25 | linear-field error below the round-off floor 8ε\|p\|/(ρ a Δϑ cos 60°); V3 orders 2.0 ± 0.15 (asserted) on all three; geostrophic residual < 1e-10 of \|F\|max (synthetic and ERA5). **DG25** (Brest node 48.5 N 4.5 W, 03 UTC 2 Nov 2023, ρ 1.25): p 968.0 hPa; \|∇p\| 12.869 hPa/100 km; \|F\| 0.010295 m s⁻² (→ 0.0103); F towards 17.00°, ∇p towards 197.00° (exactly opposite, 1e-9); ×3600 = 37.06 m/s; library = hand centred difference to 1e-12 relative; a step along F lowers p (scipy bilinear) | analytic, symbolic, converged, benchmark, limit |
| G2 | `diag.climatology.binned_mean` | **V1** hand-worked 10-point example (12, 23, 35, 50; counts 3, 4, 2, 1), any shape, any order · **V1** empty bins → NaN with count 0; left-closed interior edges; last bin closed; outside ignored; open-ended bins and their centres; ±inf x dropped (added after mutation) · **V5** `scipy.stats.binned_statistic` mean and count + `np.histogram` on 10⁵ points with NaNs, a mask and values exactly on edges; non-uniform edges with empty bins; +inf last edge · **V7** one bin = plain mean; mask; affine in y; bin splitting is count-weighted additive; guards · **V1 real data** DG26 | vs scipy rtol 1e-12, counts exact. **DG26** (40–60 N, 30 W–5 E, NE 50 m sea mask, 9290 points): bins 10.03, 14.92, 17.14, 21.57, 22.80, 25.64 m/s; counts 1024, 5723, 1914, 467, 116, 46; monotonic increase; corr 0.628 | analytic, benchmark, limit |
| G3 | `geo.terrain.descent_path` | **V1** latitude-only field → a meridian (λ constant to 1e-9°), every step exactly step_m (haversine written here, rtol 1e-9), stops at the edge within one step · **V1** cone (distance from an apex) → great circle to the apex, cross-track < 0.1 % of the 270 km path, ends within one step of the apex · **V1** closed-form curve: steepest-descent curves are conformally invariant, so in Mercator coordinates F = X² + 2Y² gives Y = C X². The invariant ln Y − 2 ln X stays within 1e-4 at 0.005°/100 m while X falls from 94 km to < 1 km · **V3 FAILS** (order 1, not the claimed 2: Defects) · **V7** each stopping reason: minimum (within one step, 3 step sizes), flat (incl. a plateau), edge, n_max, nan at the pole (also when the start itself has a NaN gradient, added after mutation), grad_tol; periodic seam crossing equals the −180–180 grid result to 1e-9; output in the grid's lon convention; N→S latitude order; guards · **V1 real data** Mont Blanc (ETOPO 2022 60″) | Meridian 1e-9°; cone xt < 270 m; Mercator invariant < 1e-4. **Mont Blanc** from 45.8326 N 6.8652 E (step 200 m): 28 steps, 4072 → 1782 m, strictly downhill every step; heights = scipy bilinear of the DEM to 1e-6 m; each drop ≤ step × the steepest cell slope; first step within 30° of the independent −∇h; reason "minimum" | analytic, limit (converged: **fails**) |

Every computable item has at least two independent levels, and at least one of them is V1, V2, V3 or V5. Counts of test
functions per validation label (31 functions, 33 items): **analytic (V1)** 12 · **symbolic (V2)** 4 ·
**converged (V3)** 3 functions / 5 items (3 pass; descent_path's 2 fail) · **benchmark (V5)** 3 · **limit (V7)** 9 ·
book-value (V6) 0 (no book numbers in this batch) · qualitative 0 · unverified 0.

## Derivations (D rows)
| Result | Test | Intermediate lines checked |
|---|---|---|
| (1.45) → (1.46) → (1.47), per unit volume −∇p, per unit mass −∇p/ρ | `test_pgf_V2_derivation_146_to_147_surface_integral_on_shrinking_cube` | each face's −p dS with its outward normal; per-volume limit; O(h²) remainder; exact for linear p |
| (2.31) horizontal gradient on the sphere | `test_pgf_V2_derivation_231_spherical_gradient_from_position_vector` | Jᵀ G = ∇_q p; unit vectors along ∂R/∂λ, ∂R/∂ϑ, ∂R/∂r; all three components |
| (2.198) ⇒ f k × u_g = +F (G1 sign correction) | `test_pgf_V2_derivation_geostrophic_sign_f_k_cross_ug_equals_plus_F` | k × (u, v) = (−v, u); "−F" refuted |
No wrong intermediate line was found. The book's per-mass sentence after (1.47) has a missing minus, already documented in the docstring and data_needs.

## Functions used by the movie (data_needs §C, new G1–G3)
| Function | Tests |
|---|---|
| `pressure_gradient_force_cartesian` | `test_pgf_cartesian_V1_uniform_gradient_DG24_exact`, `_V2_dimensions_of_momentum_equation_terms`, `_V7_towards_low_pressure_and_inverse_density`, `test_pgf_V2_derivation_146_to_147_surface_integral_on_shrinking_cube` |
| `pressure_gradient_force` | `test_pgf_V2_derivation_231_…`, `test_pgf_V2_derivation_geostrophic_sign_…`, `test_pgf_sphere_V1_uniform_northward_gradient_8p333e4_everywhere`, `_V1_linear_in_lambda_and_theta_exact_including_edges`, `_V1_hand_centred_difference_at_interior_nodes`, `_V3_second_order_on_refining_regional_grids` (×2), `_V3_global_periodic_grid_order2`, `test_pgf_V5_geostrophic_consistency_f_k_cross_ug_equals_F`, `test_pgf_V7_points_down_the_gradient_and_into_a_low`, `test_pgf_V7_poles_nan_density_broadcast_and_guards`, `test_pgf_V1_real_data_ciaran_DG25_brest_node`, `test_pgf_V5_real_data_ciaran_geostrophic_consistency` |
| `binned_mean` | `test_binned_mean_V1_hand_ten_point_example`, `_V1_empty_bins_nan_count_zero_and_edge_rules`, `_V5_vs_scipy_binned_statistic_and_histogram`, `_V7_one_bin_is_global_mean_mask_and_linearity`, `_V7_guards`, `_V1_real_data_ciaran_DG26_wind_vs_pressure_gradient` |
| `descent_path` | `test_descent_path_V1_latitude_only_field_follows_a_meridian`, `_V1_cone_gives_great_circle_to_apex`, `_V1_mercator_paraboloid_closed_form_curve`, `_V3_order2_vs_closed_form_curve[joint]` **(FAIL)**, `[step_only]` **(FAIL)**, `_V7_stops_at_minimum_within_one_step`, `_V7_flat_edge_nmax_and_nan_at_pole`, `_V7_seam_lat_order_and_lon_convention`, `_V7_guards`, `_V1_real_data_mont_blanc_descends_monotonically` |

## Convergence studies
| Scheme | Grids | Observed order | Design order |
|---|---|---|---|
| `pressure_gradient_force`, regional 40–60 N, interior nodes | 1°, 0.5°, 0.25°, 0.125° | 2.0 ± 0.15 (asserted, pass) | 2 |
| same, edge nodes (one-sided second order) | same | 2.0 ± 0.15 (pass) | 2 |
| same, global periodic grid, seam columns | 4°, 2°, 1°, 0.5° | 2.0 ± 0.15 (pass) | 2 |
| `descent_path` vs closed-form Y = C X², grid and step together | 0.04°/800 m … 0.005°/100 m | **1.26** (pairwise 1.39, 1.26, 1.15) | 2 (docstring "second-order Runge–Kutta") |
| `descent_path`, step only (grid 0.0025°) | 1600 … 200 m | **0.65** (pairwise 0.37, 0.70, 0.86 → 1) | 2 |
| control: the same with the midpoint direction parallel-transported to the start (scratch copy) | same | 2.01 (joint), 2.03–2.32 (step only) | 2 |
| control: RK2 in (ϑ, λ) coordinates (scratch copy) | same | 2.01 (joint), 2.03–2.32 (step only) | 2 |

## Conservation / invariant residuals
| Invariant | Residual |
|---|---|
| f k × u_g − F (same ρ), synthetic lows in both hemispheres and ERA5 Ciarán 03 UTC | < 1e-10 × \|F\|max (asserted) |
| ∇p bearing − F bearing − 180°, Brest node | < 1e-9° |
| closed-form invariant ln Y − 2 ln X along the descent path (0.005°/100 m) | < 1e-4 |

## Benchmarks used (`reference/ch00/SOURCES.md`, section "ch00_gradient (#6)")
| Benchmark | Value | Our value | Source | Verified |
|---|---|---|---|---|
| binned mean and count | `scipy.stats.binned_statistic`, `np.histogram` | rtol 1e-12; counts identical | SciPy 1.18.1 / NumPy 2.5.4 | 2026-10-28 |
| geostrophic consistency | f k × u_g = +F, Vallis (2.198) | < 1e-10 relative | `geostrophic_wind_from_msl` (V1/V2/V3-tested in `tests/geo/test_atmos.py`) | 2026-10-28 |
| ERA5 Ciarán msl/u10/v10 + land mask; ETOPO 2022 60″ Alps | derived products on G: | DG25, DG26, Mont Blanc rows above | Hersbach et al. 2020 doi:10.1002/qj.3803; NOAA NCEI doi:10.25921/fd45-gt74 | 2026-10-28 |

## Numbers from the text
None in this batch: the DG rows are our own measurements on open data. No book values were used.

## Mutation check (scratch copy, never the real fluidpy)
Script `C:\Users\sislam27\AppData\Local\Temp\claude\C--Users-sislam27-Work-Climate-Dynamics-PHD-AOFD-Vallis\452bd717-3dc3-44dd-a766-123f0813a337\scratchpad\mutate.py`.
It copies `fluidpy/`, `tools/`, the conftest and the three new test files to a scratch tree; an import check confirms
the scratch `fluidpy` is the one loaded. It then applies one mutant at a time and runs the three files with the two
known-failing V3 items deselected (the baseline is 31 passed).
**46 mutants. First run: 41 killed. After 3 new assertions: 44 killed, and the 2 survivors are equivalent.**
- Covered: both PGF components' signs, ×ρ instead of ÷ρ, swapped components and returns, ρ guards, missing ρ, mean ρ,
  radius 2a, periodic forced off; binned edge side, last-bin closure, NaN y kept, mask ignored, count+1, empty → 0,
  centre at lo, equal or NaN edges accepted, off-by-one bin, ±inf x kept; descent ascent instead of descent (both
  stages), x/y swap, Euler, midpoint at full step, step from the midpoint, half step, no minimum stop, grad_tol,
  mislabelled reasons, no seam column, no longitude wrap, no latitude reversal, length off by one, stale F, bilinear
  weight swap, broken bilinear weight.
- The first run's survivors led to new assertions. `sph periodic False` → the seam stencil test (a one-sided edge is
  also second order, so the V3 order could not see it). `bin x inf kept` → an inf-x test. `desc nan labelled edge` →
  a start inside the pole cell.
- Equivalent survivors. `cart no scalar unwrap`: numpy arithmetic on 0-d arrays already returns `np.float64`.
  `bin halfinf centre swap`: both branch orders return "the finite edge".
- **Control:** the transported-direction fix of `descent_path` passes all 33 items, including both V3 order tests
  (33 passed). So the V3 test discriminates, and the defect is in the library, not the test.

## Figures reproduced with our code (local, `outputs/ch00/verify/`)
| Figure | File | Verdict |
|---|---|---|
| ERA5 msl 03 UTC 2 Nov 2023 with F = −(1/ρ)∇p arrows | `outputs/ch00/verify/gradient_ciaran_pgf_0300.png` | Every arrow points across the isobars towards lower pressure and into Ciarán's 953 hPa centre over the Channel. The Brest arrow (red) points NNE at 17.0° with \|F\| = 0.0103 m s⁻², the largest arrows packed where the isobars are tightest, south-west of the centre. |
| DG26 wind vs \|∇p\| over the sea | `outputs/ch00/verify/gradient_binned_wind_vs_gradp.png` | The binned means rise monotonically from 10.0 to 25.6 m/s through the scatter cloud. Counts are 1024 … 46, matching the planning table. |
| Mont Blanc descent on ETOPO 60″ | `outputs/ch00/verify/gradient_montblanc_descent.png` | The path leaves the summit cell to the SE, crossing contours roughly at right angles. Height falls monotonically from 4072 m to 1782 m over 5.6 km and stops on a valley floor. |
| descent_path convergence | `outputs/ch00/verify/gradient_descent_convergence.png` | The library lines follow slope 1 (step-only line flattening towards slope 1). Both corrected variants lie on slope 2 — a picture of the defect. |

## Defects (library; proven by failing tests, not patched)
1. **`fluidpy.geo.terrain.descent_path` is first-order accurate on the sphere, not second order as its docstring
   claims.** Failing tests: `tests/geo/test_terrain_descent.py::test_descent_path_V3_order2_vs_closed_form_curve[joint]`
   (observed order **1.26**; errors 4.59e-4, 1.75e-4, 7.32e-5, 3.30e-5) and `[step_only]` (observed order **0.65**;
   errors 2.12e-4, 1.64e-4, 1.01e-4, 5.57e-5; pairwise orders rising towards 1). Required: 2.0 ± 0.15.
   *Cause (confirmed by two independent corrected variants that reach 2.01):* the RK2 midpoint direction is a compass
   bearing measured at the midpoint, and the code applies it unchanged at the start point:
   `la_n, lo_n = destination_point(la, lo, b2, step_m, a=a)`. Meridians converge, so north at the midpoint differs from
   north at the start by ≈ (step/2a)·tan ϑ·sin b. That leaves a heading bias of O(step/a) in every step, which is a
   first-order error.
   *Fix (either works; scratch-tested):* (a) transport the direction: let `b1f` be the bearing of the start→midpoint great
   circle at the midpoint, `(initial_bearing(la_m, lo_m, la, lo) + 180) % 360`, and step with bearing `b1 + (b2 − b1f)`.
   (b) Take the RK2 step in (ϑ, λ) coordinates: dϑ/ds = −g_y/(a|g|), dλ/ds = −g_x/(a cos ϑ |g|), evaluated at the
   midpoint.
   *Impact:* physically negligible for the movie. The bias is ≈ 1.6e-5 rad at the default 200 m step at 46° N, so the
   5.6 km Mont Blanc path moves sideways by at most ≈ 0.1 m. Every V1, V7 and real-data check passes. But the docstring's
   "second-order Runge–Kutta" claim is false. The implementer should apply (a) or (b) and add "V3 order 2 (test above)"
   to the Validation line.

## Deviations & justifications
None in the code under test (no `# DEVIATION` markers). Test-side corrections made during the fix loops (none loosens a
spec tolerance):
1. The 8.333e-4 literal is 1 ulp from 1e-3/1.2, so the test asserts |F|·1200 = 1 to 4e-16 and keeps the exact-quotient equality.
2. sympy returns |cos ϑ| from the unit-vector norm. On the latitude interval (−π/2, π/2) this is cos ϑ.
3. Real-data F·∇p < 0 is compared against np.gradient on interior nodes only, because np.gradient is first order at the box edges.
4. The plateau stop is allowed one grid cell below the kink, because centred differences smear the kink over one cell.
5. The Mont Blanc drop bound uses one-sided cell slopes. The bilinear surface's slope inside a cell is bounded by them, not by centred node slopes.

## Open items
1. **Defect 1 above** (`descent_path` order 1). This is for the implementer. It is the only reason the verdict is FAIL.
2. **Docstring labels.** `pressure_gradient_force` says "Label: analytic, limit". Achieved: analytic, symbolic,
   converged, benchmark (consistency), limit. `pressure_gradient_force_cartesian` can add "symbolic (pint (1.48);
   (1.45)→(1.47) sympy)". `binned_mean` can add "benchmark (scipy binned_statistic)". None of the four Validation lines
   names its test file yet (`tests/geo/test_atmos_pgf.py`, `tests/diag/test_binned_mean.py`,
   `tests/geo/test_terrain_descent.py`). I did not edit library code.
3. **Movie note (DG13/s15, not a library defect).** From the Mont Blanc summit, the 60″ descent stops with reason
   "minimum" at 45.794 N 6.909 E, 1782 m, after 5.6 km. This end point is stable for steps from 25 to 400 m. It is a
   V-shaped valley floor where the centred-difference gradient flow converges, not a closed pit. "minimum" in
   `descent_path` therefore also means "the flow has reached a thalweg". The builder should end the "water runs down"
   line there, or say "reaches the valley floor". The 15″ product (D1) may move this point.
4. The Mont Blanc start coordinates (45.8326 N, 6.8652 E) are "to confirm" by the research-scout (data_needs §B). The
   test needs only a point in the summit region.
5. data_needs §C G1 row still shows the old "−(Fx, Fy)". The correction appended at the end of the file is right
   (confirmed symbolically and numerically here). The builder should read the appended note.

## Suites
- New files, after the mutation-driven additions: **31 passed, 2 failed** (the 2 V3 order proofs; with them deselected,
  31 passed, 2 deselected in 34.7 s).
- **Full fluidpy suite**, run from `../Fluid Dynamics`
  (`"../AOFD Vallis/.venv/Scripts/python.exe" -m pytest -q -n 8 -p no:cacheprovider tests`): **2 failed, 2913 passed,
  1 xfailed, 4 warnings in 1474.40 s (0:24:34)**. The 2 failures are exactly the two `descent_path` V3 items. The
  xfail is the documented strict xfail in `tests/geo/test_vectors_1a1b.py`. Every Kundu chapter test passed. (This run
  collected the three files before the three mutation-driven assertions were added inside existing tests. The item
  count is unchanged, and the files were re-run afterwards, as in the line above.)
- AOFD suite (`.venv/Scripts/python.exe -m pytest -q -n 8 -p no:cacheprovider tests`): **35 passed, 1 skipped**
  (`test_maptools.py`, slow, needs `AOFD_MAPTOOLS=1`).
- There is no `tests/test_ch00.py` chapter file for this batch. The CHECK rows DG06, DG23–DG26 and the Mont Blanc
  descent are asserted in the library tests above.

## Verdict: FAIL
`pressure_gradient_force`, `pressure_gradient_force_cartesian` and `binned_mean` meet the PASS bar. Each has at least 3
independent levels (V1 + V2/V3/V5 + V7), and DG25 and DG26 reproduce on ERA5. 44 of 46 mutants were killed and the 2
survivors are equivalent. `descent_path` passes V1 (meridian, great circle, closed-form Mercator curve), V7 and the
Mont Blanc real-data check. It fails its V3 order claim: observed order 1.26 (joint) and 0.65 (step only), against 2.
The cause is identified, and a two-line fix was scratch-verified to give order 2.01. The full fluidpy suite therefore
has 2 intentional failures. After the implementer's fix, re-run `tests/geo/test_terrain_descent.py` and the full suite.
No test tolerance needs to change.
