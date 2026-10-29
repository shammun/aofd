# Chapter 0 library verification — coordinates movie #5 (`ch00_coordinates`)      2026-10-28

AOFD at `cc5c55d` (+ uncommitted `progress.json` from the orchestrator); fluidpy at `2cf407d` (library under test: commit
`d726b6f`) + **uncommitted tests written by this verifier** (nothing committed). A data-scout had uncommitted work in
`fluidpy/data/cds.py` and `tests/data/test_coops.py` during the full-suite run (included in the counts below; not touched
by me). Plan: `movies/ch00/ch00_coordinates/data_needs.md` §C (F1–F4) and CHECK rows DC22–DC25 and DC52.

## Environment
Python 3.12.1 · numpy 2.5.4 · scipy 1.18.1 · sympy 1.14.0 · xarray 2026.9.0 · pyproj 3.8.0 (PROJ 9.8.1) · pytest-xdist
3.8.0 (AOFD `.venv`, fluidpy editable). Disk before and after: C: 69 → 68 GB free, G: 536 GB free (no downloads; the
ERA5 Ciarán product was already on G:).

## Equations checked on the page images
| Equation | Page (pdf image / printed) | Matches the code |
|---|---|---|
| Fig. 2.3: i, j, k point towards increasing λ, ϑ, z; (2.36) Ω = Ω(j cos ϑ + k sin ϑ); (2.37) u/(r cos ϑ)(j cos ϑ + k sin ϑ) = j u/r + k u tan ϑ/r | ch02/p082 / 62 | yes (`enu_basis`; the (2.36)→(2.38) construction is re-run in sympy) |
| (2.38) Ω_flow = −i v/r + j u/r + k u tan ϑ/r; (2.39a) Di/Dt = u/(r cos ϑ)(j sin ϑ − k cos ϑ); (2.39b) Dj/Dt = −i (u/r) tan ϑ − k v/r; (2.39c) Dk/Dt = i u/r + j v/r | ch02/p083 / 63 | yes (`unit_vector_rates`, line by line) |
| (2.44a) Dv/Dt = … + u Di/Dt + v Dj/Dt + w Dk/Dt; (2.44b) … + Ω_flow × v; (2.45) i(Du/Dt − uv tan ϑ/r + uw/r) + j(Dv/Dt + u² tan ϑ/r + vw/r) + k(Dw/Dt − (u² + v²)/r) | ch02/p083 / 63 | yes (`metric_terms`, signs of (2.45)) |
`band_area` uses the §2.2.2 increments (δx, δy) = (r cos ϑ δλ, r δϑ) (p081 / 61); `track_by_continuity` and
`translation_velocity` are diagnostics (no book equation).

## Test files (fluidpy) and counts
| File | Test functions (items) | Status |
|---|---|---|
| `../Fluid Dynamics/tests/geo/test_sphere_enu_band.py` | 13 (13) | new, all pass |
| `../Fluid Dynamics/tests/geo/test_frames_unit_vector_rates.py` | 12 (16, parametrised V3) | new, all pass |
| `../Fluid Dynamics/tests/diag/test_cyclone_track.py` | 14 (14; 4 real-data, skip without the G: product) | new, all pass |

## Validation table
| Id / Eq. | fluidpy target | Evidence (V-levels) | Numbers | Label |
|---|---|---|---|---|
| F1, (2.29), Fig. 2.3 | `geo.sphere.enu_basis` | **V1** orthonormal + i × j = k (numpy cross) at 10⁴ random points; closed-form components; known points (0°,0°), (0°,90°E), (45°N,180°); k = `unit_vector` · **V2** sympy i = ∂r/∂λ/\|∂r/∂λ\|, j = ∂r/∂ϑ/\|∂r/∂ϑ\|, k = r̂ from the position vector (\|∂r/∂λ\| = r cos ϑ, \|∂r/∂ϑ\| = r, orthogonal) · **V5** PROJ `+proj=topocentric` on a sphere, 200 random points · **V7** 89.999999° finite and i turns by Δλ; ±90°, NaN raise; hemisphere mirror; λ + 360° periodic; broadcasting | orthonormality 2.2e-16 (bound 1e-13); closed form < 1e-14; PROJ 1.2e-14 (bound 1e-12); DC23 Brest–Trappes 4.32° (479.9 km → 480), Brest–Singapore 101.0°, = haversine central angle to 1e-9 | analytic, symbolic, benchmark, limit |
| F3 | `geo.sphere.band_area` | **V1** 2πa²\|Δ sin ϑ\|: 4πa², ¼ sphere for 0–30°, either order; adaptive quadrature of 2πa² cos ϑ (50 random bands) · **V3** midpoint sum of grid cells, observed order 2.000 · **V5** `pyproj.Geod(a=b).polygon_area_perimeter` of a densified 0–30° sector ×36 and of a 60° polar-cap ring; library `polygon_area` of the same polygon · **V7** additivity, mirror symmetry, a² scaling, monotone, guards at ±90° (+1e-12 allowance) | quadrature ≤ 1e-12 of 4πa²; sector rel 1.0e-7 (both area codes agree to < 1e-9); cap rel < 1e-6; DC22 0–30° = 0.5000 of a hemisphere (closed form and polygon_area) | analytic, converged, benchmark, limit |
| F3 | `geo.sphere.band_fraction` | **V1** = band_area/(4πa²) and = \|Δ sin ϑ\|/2 (500 random pairs, rtol 1e-14); 0.25, 0.5, 1.0; in [0, 1]; float for scalars · **V5** DC22 via `polygon_area` (same value) | s23: 0.500, 0.866 (= √3/2 to 1e-15), Earth 5.10 × 10⁸ km²; Arctic circle see Open items | analytic, benchmark |
| F2, (2.38)–(2.39) | `geo.frames.unit_vector_rates` | **V2** (D-row) sympy (2.36)→(2.37)→(2.38), then Ω_flow × (i, j, k) = printed (2.39a–c); library = printed forms at 400 states · **V2** independent geometry: chain-rule derivative of the Cartesian i, j, k along λ(t), ϑ(t) with (2.28), projected on the triad = Ω_flow × e symbolically; library agrees (thin shell and r = a + 30 km) · **V3** centred differences of `enu_basis` along a curved trajectory, 4 states · **V1** zero velocity → 0; DC24; antisymmetry e_b·De_a/Dt = −e_a·De_b/Dt (orthonormality) with axial vector = Ω_flow · **V7** equator, velocity reversal, guards (pole, NaN, 48.39 "degrees", a ≤ 0), broadcasting | V2 rtol 1e-13 / 1e-12; V3 orders 2.000, 2.000, 2.000, 2.000; at h = 1 s rel 4.0e-10 – 2.0e-9 (spec 1e-6); antisymmetry < 1e-14 of scale; DC24 12.19° (= Δλ = 900 km/(a cos ϑ) exactly, 1e-10) | symbolic, converged, analytic, limit |
| F2, (2.44a)→(2.45) | `geo.frames.metric_terms` | **V2** (D-row ★) sympy (2.44a) with (2.39) = (2.44b) Ω_flow × v = printed (2.45); dimensional homogeneity of every term (pint) · **V3** centred differences of u i + v j + w k at fixed (u, v, w) along a trajectory, 2 states · **V4** the metric terms do no work: u·m_east + v·m_north + w·m_up = 0 (kinetic energy unchanged) at 10⁴ states · **V1** identity u Di/Dt + v Dj/Dt + w Dk/Dt (library rates) = metric_terms = Ω_flow × v (numpy cross); DC25 · **V7** equator (only uw/r, vw/r), hemisphere mirror, 1/r deep scaling, quadratic under reversal, near-pole growth finite, guards | V3 orders 2.000, 2.000; V4 residual max 1.5e-16 of (\|v\|³(1+\|tan ϑ\|)/a); identity max 3.5e-18 m s⁻² (rel 2.0e-16); DC25 1.570e-05 m s⁻², f v 1.031e-03, ratio 65.7 | symbolic, converged, conserved, analytic, limit |
| F4 | `diag.cyclone.track_by_continuity` | **V1** synthetic Gaussian low (σ 300 km, 30 hPa) moving 15 m/s towards 70° on a great circle (positions from `pyproj.Geod.fwd`), seeded mid-track off-centre, tracked both ways; step_km = haversine of tracked centres; datetime64 and seconds; 2-D curvilinear grid ≡ 1-D · **V7** deeper distant low (50 hPa, 1000 km away): whole-field `storm_centre` picks it every hour, the tracker never; max_step_km flag + RuntimeWarning (6-hourly steps 324 km vs 200/400 km); a jump to a neighbour flagged once; too-fast storm → edge_flag; refined-but-near-edge case (found by mutation) → edge_flag; lost centre → NaN onward; guards · **V1 real data** ERA5 Ciarán (DC52) · **V7 real data** the domain minimum 00–12 UTC 1 Nov is a different, deeper low 974–1175 km away (964.8–968.5 hPa), never picked · **V5 published** Met Office numbers | synthetic position error max 0.031 km (< 0.1 cell); Ciarán: seed offset 7.4 km, steps 23.7–109.4 km, no step or edge flags (limit 120 km), 00 UTC 49.67°N 5.72°W 954.5 hPa, 03 UTC 50.12°N 3.73°W 953.6 hPa, 06 UTC 50.52°N 1.51°W 954.0 hPa; track minimum 953.65 hPa vs Met Office Plymouth 953.3 hPa (+0.04 %), passes within 50 km of Plymouth; 24-h fall 32.2 hPa (> 24 hPa) | analytic, limit, benchmark |
| F4 | `diag.cyclone.translation_velocity` | **V1** synthetic: every 6-h window vs the exact geodesic (`Geod.inv` on the true positions); hand-built track vs haversine; four cardinals · **V5** `pyproj.Geod.inv` distance/azimuth on the tracked centres · **V7** t1↔t2 reversal gives the same speed and direction (both `at` modes); "mid" bearing = the geodesic's midpoint azimuth (pyproj npts) and "mid" − "start" ≈ (Δλ/2) sin ϑ; east² + north² = speed²; guards (same time, NaN centre, bad `at`) · **V1 real data** DC52 | synthetic speed rel error ≤ 3.7e-5, bearing ≤ 0.003° (spec 2 % / 1°; a tightened 1e-3 / 0.05° assertion added); vs pyproj < 1e-9°; Ciarán 00→06 UTC 14.58 m/s towards 71.0° (ENE), east 13.78, north 4.75 m/s; 21→03 UTC 15.48 m/s at 68° | analytic, benchmark, limit |

Every computable item has ≥ 2 independent levels including at least one of V1/V2/V3/V5. Counts of test functions per
validation label (39 functions, 43 items): **analytic (V1)** 15 · **symbolic (V2)** 5 · **converged (V3)** 3 (7 cases) ·
**conserved (V4)** 1 · **benchmark (V5)** 3 · **limit (V7)** 12 · book-value (V6) 0 (no book numbers in this batch) ·
qualitative 0 · unverified 0.

## Derivations (D rows)
| Result | Test | Intermediate lines checked |
|---|---|---|
| (2.36) → (2.37) → (2.38) → (2.39a–c) | `test_unit_vector_rates_V2_derivation_236_to_239` | (2.37) as printed; Ω_flow before and after adding −(v/r) i; each Ω_flow × e |
| (2.44a) with (2.39) → (2.44b) → (2.45) | `test_metric_terms_V2_derivation_244a_244b_to_245` | (2.44a) = (2.44b) and each = (2.45) |
| (2.39) from the geometry (route independent of (2.38)) | `test_unit_vector_rates_V2_derivation_from_geometry_chain_rule` | chain rule with Dλ/Dt = u/(r cos ϑ), Dϑ/Dt = v/r (2.28) |
No wrong intermediate line found.

## Functions used by the movie (data_needs §C, new F1–F4)
| Function | Tests |
|---|---|
| `enu_basis` | `test_enu_basis_V1_orthonormal_right_handed_1e4_points`, `_V1_closed_form_known_points_and_k_is_unit_vector`, `_V2_derivation_from_position_vector`, `_V5_vs_proj_topocentric`, `_V7_near_pole_finite_turns_with_lon_and_pole_raises`, `_V7_hemisphere_mirror_and_lon_periodicity`, `_V1_DC23_angle_between_up_vectors` |
| `band_area`, `band_fraction` | `test_band_area_V1_closed_form_values_and_DC22`, `_V1_quadrature_of_area_element`, `_V3_midpoint_sum_of_grid_cells_order2`, `_V5_vs_pyproj_geod_and_polygon_area_dense_band`, `_V7_additivity_symmetry_scaling_and_guards`, `test_band_fraction_V1_equals_area_over_sphere_and_bounds` |
| `unit_vector_rates` | `test_unit_vector_rates_V2_derivation_236_to_239`, `_V2_derivation_from_geometry_chain_rule`, `_V1_zero_velocity_and_DC24_airliner`, `_V1_orthonormality_constraints`, `_V3_finite_difference_of_enu_basis_order2` (×4), `test_unit_vector_rates_and_metric_terms_V7_equator_mirror_deep_and_guards` |
| `metric_terms` | `test_metric_terms_V2_derivation_244a_244b_to_245`, `_V2_dimensions`, `_V1_DC25_values`, `_V3_finite_difference_of_velocity_vector_order2` (×2), `_V4_workless_kinetic_energy`, `_V1_identity_244a_with_unit_vector_rates`, (V7 shared test above) |
| `track_by_continuity` | `test_track_by_continuity_V1_synthetic_low_15ms_towards_70deg`, `_V1_seconds_times_and_curvilinear_grid`, `_V7_deeper_distant_low_never_picked`, `_V7_max_step_flag_and_warning`, `_V7_jump_to_neighbour_is_flagged`, `_V7_too_fast_storm_sets_edge_flag`, `_V7_refined_centre_within_half_cell_of_box_edge_is_flagged`, `_V7_lost_centre_and_errors`, `_V1_ciaran_DC52_steps_and_pressures`, `_V7_ciaran_deeper_low_on_1_nov_never_picked`, `_V5_ciaran_published_met_office_numbers` |
| `translation_velocity` | `test_translation_velocity_V1_hand_track_vs_independent_geodesic`, `_V7_time_reversal_and_mid_bearing`, `_V1_ciaran_DC52_motion` (+ synthetic test above) |

## Convergence studies
| Scheme | Grids | Observed order | Design order |
|---|---|---|---|
| centred difference of `enu_basis` along a curved path vs `unit_vector_rates` (4 states incl. 85° N) | h = 400, 200, 100, 50 s | 2.000, 2.000, 2.000, 2.000 | 2 |
| centred difference of u i + v j + w k vs `metric_terms` (2 states) | h = 400 … 50 s | 2.000, 2.000 | 2 |
| midpoint sum of a² cos ϑ Δϑ Δλ cells vs `band_area` (12–71°) | n = 8 … 128 | 2.000 | 2 |

## Conservation / invariant residuals
| Invariant | Residual |
|---|---|
| metric terms do no work, v·m = 0 (V4) | 1.5e-16 relative, 10⁴ random states |
| (2.44a) identity: u Di/Dt + v Dj/Dt + w Dk/Dt = metric_terms (V1) | 3.5e-18 m s⁻² (2.0e-16 relative) |
| orthonormality of (i, j, k) (V1) | 2.2e-16 |

## Benchmarks used (`reference/ch00/SOURCES.md`, section "ch00_coordinates (#5)")
| Benchmark | Value | Our value | Source | Verified |
|---|---|---|---|---|
| ECEF → ENU rotation | PROJ `+proj=topocentric`, sphere R = 6 371 km | max diff 1.2e-14 | PROJ 9.8.1 / pyproj 3.8.0 | 2026-10-28 |
| Geodesic forward/inverse, polygon area (sphere) | `pyproj.Geod(a=b)` | < 1e-9° azimuth; band sector rel 1e-7 (chord error) | Karney 2013, doi:10.1007/s00190-012-0578-z | 2026-10-28 |
| Ciarán record MSLP | 953.3 hPa, Plymouth, 2 Nov 2023 (Met Office) | ERA5 track minimum 953.65 hPa (+0.04 %, bound 1 %) | Met Office statement via Totnes Times / Weatherzone (secondary) | 2026-10-28 |
| Ciarán explosive deepening | > 24 hPa in 24 h (Met Office) | 32.2 hPa in 24 h | as above | 2026-10-28 |

## Mutation check (scratch copy, never the real fluidpy)
Script `…/scratchpad/mutate.py`: copies `fluidpy/`, `tools/`, the conftest and the three new test files to a scratch tree
(import check confirms the scratch `fluidpy` is the one loaded), applies one mutant at a time, runs the three files.
**46 mutants, 45 killed.** Covered: j/i signs, latitude-as-colatitude, pole guards, band sin→cos, lost factor 2, lost
abs, a² → a, fraction of hemisphere, midpoint approximation; every component of Ω_flow, Di, Dj, Dk and of the three metric
terms (signs, tan→sin, u↔v, w² added, vw/2r), the degrees guard and radius guard; tracker forward/backward from the seed
instead of the previous centre, no search box, swapped box half-sizes, flag threshold, step units and index shift,
warning removed, seed offset at the wrong time, seconds→minutes; translation speed, reversed start bearing,
east↔north, no reversal for t2 < t1, mid = start, wrong radius.
- First run: 44/46. Survivor "edge test off" (`edge_flag` without the near-box-edge test) led to a new test:
  for symmetric lows a centre within ½ cell of the box edge always has its nearest node on the edge row, where
  `storm_centre` does not refine, so `refined = False` already raises the flag. A random search found the near-edge
  branch reachable only for skewed lows (14 of 20 000 trials). One such case is now pinned in
  `test_track_by_continuity_V7_refined_centre_within_half_cell_of_box_edge_is_flagged`, which kills the mutant.
- Remaining survivor "no stop after lost" (`continue` instead of `break`) is an **equivalent mutant**: once a centre
  is NaN, every later search box has NaN bounds, selects nothing, and later times stay NaN either way.

## Figures reproduced with our code (local, `outputs/ch00/verify/`)
| Figure | File | Verdict |
|---|---|---|
| Ciarán continuity track vs whole-domain minimum; step lengths and centre pressure | `outputs/ch00/verify/ciaran_track_continuity.png` | The track runs smoothly from 46.7°N 32°W to 55.3°N 2.8°E with every hourly step below the 120 km line. The whole-domain minima (red crosses) sit on a separate, deeper low near 56°N 23°W for the first 13 h and then coincide with the track. The centre pressure bottoms out at 953.6 hPa, just above the Met Office's 953.3 hPa. |
| V3 convergence of the unit-vector rates | `outputs/ch00/verify/unit_vector_rates_convergence.png` | All three error lines are straight and parallel to the slope-2 guide over 25–400 s, including the 85°N case. |

## Deviations & justifications
None in the code under test (no `# DEVIATION` markers in the new functions). Test-side corrections made during the fix
loops (none of them loosens a spec tolerance):
1. DC22's Arctic-circle value: pinned 0.917 at 66.5° and 0.9175 at 66.5634° (see Open items).
2. V3 metric test: the rel 1e-6 bound now applies at h = 1 s, as the spec states, not at h = 50 s where truncation error dominates.
3. Ciarán sub-grid check: the refined pressure is allowed to lie up to 0.2 hPa below / 0.1 hPa above the local grid
   minimum. Measured range −12.3 … +6.0 Pa. A least-squares quadratic smooths, so it can sit slightly above the lowest node.
4. pyproj: PROJ strings are built with `float(x):.17g`. numpy 2's `repr` would otherwise write `np.float64(…)` into the
   pipeline and PROJ would silently misparse it, giving errors of order 1.

## Open items
1. **Docstrings say "Validation (planned)"** in all seven new functions (`sphere.py` lines 135, 171, 194; `frames.py` 198,
   239; `cyclone.py` 405, 482). The implementer should replace these with the levels achieved and the test files above,
   e.g. enu_basis "V1, V2, V5 (PROJ topocentric 1.2e-14), V7; tests/geo/test_sphere_enu_band.py". I did not edit library code.
2. **DC22 / planning-table rounding (movie data, not library):** "0.917 of a hemisphere for the Arctic circle" holds
   only for ϑ = 66.5°. With the 2023 Arctic circle at 66.5634° the fraction is 0.91750, which rounds to 0.918. The
   builder should say "about 0.92" or state 66.5°.
3. **data_needs F4 wording:** it says "the Ciarán steps 24–109 km/h". These are km per hourly step (23.7–109.4 km). Cosmetic.
4. **Observation on the pre-existing `storm_centre` (not in this batch):** `msl_min` is the least-squares quadratic's
   minimum, so it can sit up to 6 Pa above the lowest grid value (Ciarán 10 UTC 1 Nov). This is harmless for the 0.1 hPa
   CHECK values, but the docstring could say "fitted minimum (may exceed the lowest node by a few Pa)".
5. The V5 Ciarán pressure source is a secondary report of the Met Office statement. The Met Office's own post was not
   retrieved, and the Reading paper (Gray & Volonté 2024, doi:10.1002/wea.7620) was behind bot protection.

## Suites
- New files: 43 passed (`tests/geo/test_sphere_enu_band.py`, `tests/geo/test_frames_unit_vector_rates.py`,
  `tests/diag/test_cyclone_track.py`).
- **Full fluidpy suite**, run from `../Fluid Dynamics`
  (`.venv/Scripts/python.exe -m pytest -q -n 8 -p no:cacheprovider tests`): **2882 passed, 1 xfailed, 4 warnings in
  1489.15 s (0:24:49)**. The xfail is the documented strict xfail in `tests/geo/test_vectors_1a1b.py`.
- AOFD suite (`.venv/Scripts/python.exe -m pytest -q -n 8 -p no:cacheprovider tests`): **35 passed, 1 skipped**
  (`test_maptools.py:152`, slow, needs `AOFD_MAPTOOLS=1`).
- There is no `tests/test_ch00.py` chapter file for this batch. The movie CHECK rows DC22–DC25 and DC52 are asserted in the
  library tests above.

## Verdict: PASS
All seven functions have ≥ 2 independent evidence levels, with V1/V2/V3/V5 represented. Both ★ derivations are
re-run in sympy. The convergence orders are 2.000 (design 2). Both suites are green. 45 of 46 mutants were killed and
the survivor is equivalent. Nothing is unverified. The open items are documentation and movie-wording notes, not
physics defects.
