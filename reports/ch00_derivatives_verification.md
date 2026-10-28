# Chapter 0 movie `ch00_derivatives_taylor` (#4) — verification of library functions F1–F5      2026-10-28

AOFD at `102b237` (+ uncommitted movie work); fluidpy at `febd973` ("geo/diag: calculus, radiation, cc_fractional_rate,
sounding, global_mean/linear_trend … tests pending"). Verifier: math-verifier agent. Plan:
`movies/ch00/ch00_derivatives_taylor/data_needs.md` §C (F1–F5) and §D (DT rows). Library code not modified. Nothing
committed.

New test files (fluidpy, uncommitted): `tests/geo/test_calculus.py` (47 items), `tests/geo/test_radiation.py` (9),
`tests/geo/test_moist_cc_rate.py` (7), `tests/diag/test_sounding.py` (21), `tests/diag/test_global_mean_trend.py` (16):
**100 items, all pass**. AOFD: `reference/ch00/SOURCES.md` (new section), `reference/ch00/make_refs.py` (+
`benchmarks_derivatives.json`), this report; local figures in `outputs/ch00/verify/dt_*.png`.

## Environment
Python 3.12.1 · numpy 2.5.4 · scipy 1.18.1 · sympy 1.14.0 · xarray 2026.9.0 · pandas 3.0.6 · pint 0.26.2 · MetPy 1.7.1
(AOFD `.venv`, fluidpy installed editable).

## Equations checked on the page images (before any analytic or sympy row)
| Equation | Page (pdf / printed) | Matches the code |
|---|---|---|
| (1.4) δφ = ∂φ/∂t δt + ∂φ/∂x δx + ∂φ/∂y δy + ∂φ/∂z δz = ∂φ/∂t δt + δx·∇φ; (1.5) dφ/dt = ∂φ/∂t + dx/dt·∇φ | Vallis p024 / 4 | yes (`total_differential`, `chain_rule_rate`) |
| (1.7) Dφ/Dt = ∂φ/∂t + (v·∇)φ | Vallis p025 / 5 | yes (`chain_rule_rate` with the fluid velocity) |
| (1.69) ∂²I/∂η∂α = ∂²I/∂α∂η; (1.70) (∂T/∂α)_η = −(∂p/∂η)_α; (1.66a,b) T = (∂I/∂η)_α, p = −(∂I/∂α)_η | Vallis p037 / 17 | yes (`mixed_partials`, `exactness_residual`) |
| (14.1) σT⁴_rad = S(ϑ)(1 − α), σ = 5.67 × 10⁻⁸; effective emitting temperature (I/σ)^{1/4} | Vallis p532 / 512 | yes (`blackbody_flux`, `emission_temperature`; `planck_response` = d/dT, our step) |
| (18.27) de_s/dT = L e_s/(R^v T²); (18.28) | Vallis p699 / 679 | yes (`cc_fractional_rate` = (18.27)/e_s) |
| Kundu App. B §B.1: (∂/∂x_i)(∂f/∂t) = (∂/∂t)(∂f/∂x_i) (p. 857); d f/dt = Σ ∂f/∂x_i dX_i/dt + ∂f/∂t, (B.1.1)–(B.1.4) (p. 858) | `_private/Kundu_AppendixB…pdf` pp. 1–2 | yes |
| Kundu (10.4)–(10.6): T_{i±1} Taylor rows to Δx⁴; forward/backward O(Δx), centred O(Δx²) | Kundu ch10 p451 / 424 | yes (`taylor_polynomial`, `secant_slopes`) |

## Validation table
| Id | Function | Evidence (V-levels) | Numbers | Label | Verdict |
|---|---|---|---|---|---|
| F1 | `calculus.secant_slopes` | V1 x² → 6 ± h and 6 exactly, x³ closed forms (rtol 1e-12); V2 sympy series gives leading error −sin(1)/2 · h and −cos(1)/6 · h² and the code matches them (rel 2e-3 / 1e-4 at h = 1e-3); V3 orders forward 1, backward 1, centred 2 (± 0.15); V1 cross-check with `core.fd.stencil_derivative` (rel 1e-12); V7 shapes and guards | DT03 7, 6.1, 6.01; DT71 −4.294e-2, −9.001e-4 | analytic, symbolic, converged | PASS |
| F1 | `calculus.taylor_polynomial` | V1 e^h sums against exact `Fraction`s (rtol 1e-15) at h = 0.1, 1, −1.5; V2 equals sympy `series` partial sums of exp(sin x) cos x at x0 = 0.3, orders 0–9 (rtol 1e-12); V1 the (K 10.4)/(10.5) rows are exact for a quartic; V3 remainder orders 2, 3, 4, 5 for n = 1…4 (± 0.15); V7 order 20 → e (< 1e-12), 200 terms at h = 10 finite (no factorial overflow), guards | DT42 1, 1.1, 1.105, 1.1051667 and 1, 2, 2.5, 2.6667, 2.7083 | analytic, symbolic, converged, limit | PASS |
| F1 | `calculus.total_differential` | V1 exact for a linear 4-variable field (rel 1e-13); V2 equals the linear term d/dε φ(x + ε δx) from sympy (rel 1e-13); V3 error of the linearisation O(|δx|²) (order 2 ± 0.15); V7 broadcasting, guards | DT15 −0.32, −0.50, +1.45 → +0.63 | analytic, symbolic, converged | PASS |
| F1 | `calculus.chain_rule_rate` | V2 sympy d/dt F(X(t), Y(t), Z(t), t) for a 4-D field equals the library sum (rel 1e-12) — Vallis (1.5), Kundu (B.1.1); V7 centred difference along the sampled path → rate (rel < 1e-4 at dt = 50 s, order 2.00); V1 v = 0, steady field, frozen pattern F(x − Ut) → 0 (Galilean); V1 cross-check with `diag.advection.advection` on ERA5 (rel 1e-9) | DT18 ∓11.53 K/h, totals −8.61 / +14.45 K/h (rounded inputs; data_needs' −8.60 uses the full-precision ∂T/∂t); DT19 −3.68, −0.76 K/h | analytic, symbolic, limit | PASS |
| F1 | `calculus.mixed_partials` | V1 x²t → 2x and x²t² → 4xt exactly, both orders; V2 sympy x t → 1 and exact on a non-uniform grid; V3 order 2.0 ± 0.15 against the sympy mixed partial of sin x cos 2t e^{x/3}; V7 the two orders agree to ≤ 1e-9 of the scale on 5 random smooth fields on random non-uniform grids (the discrete (1.69); not accuracy evidence); V7 reversed axes, array = callable, guards | DT14 1.4285 × 10⁻⁹ K m⁻¹ s⁻¹ both orders, difference 1.4e-16 relative | analytic, symbolic, converged, limit | PASS |
| F1 | `calculus.exactness_residual` | V2 y dx ± x dy → 0, 2; −y dx + x dy → −2; V2 the gradient of three arbitrary functions → 0; V2 δq = c_v dT + (RT/α) dα → −R/α, δq/T → 0; **V2 derivation (1.66)→(1.69)→(1.70)** for the perfect gas I(η, α) = I0 e^{η/c_v} α^{−R/c_v}: construction gives pα = RT, the form T dη − p dα is exact, and the Maxwell relation (1.70) holds | DT30, DT38 | symbolic | PASS |
| F1 | `calculus.loop_integral`, `polygon_path` | V1 unit square −2 / 0 / +2 reversed (1e-12); V2 Green's theorem: sympy ∬(N_x − M_y) dA over a triangle for a non-polynomial form, trapezoid error 2nd order (order 2.0 ± 0.15) and < 1e-4 relative at n = 128; V1/V3 ∮ x²y dx on the unit circle = −π/4, order 2; V1 thermodynamic cycle in (T, α): ∮δq = R ΔT ln(α2/α1) (rel 1e-7), ∮δq/T = 0 (< 1e-12); V7 (n, 2) = tuple input, auto-closing of an open path (on forms nonzero on the closing segment), arrays for M, N; polygon corners exact, closed, shoelace area, equal sub-segments | DT31 −2.000, 0.000 | analytic, symbolic, converged | PASS |
| F2 | `radiation.SIGMA_SB`, `blackbody_flux`, `emission_temperature`, `planck_response` | V5 CODATA (scipy.constants, NIST CUU; rel 1e-9 — the library keeps 10 significant digits, 3.4e-11 off the exact value); V1 σ = 2π⁵k⁴/(15h³c²) from the exact SI h, k, c; V1 σT⁴ and (F/σ)^{1/4} by `math` on fields (rtol 1e-14), round trip; V2 sympy d(σT⁴)/dT = 4σT³; V2 the finite-warming remainder 6σT²ΔT² + 4σTΔT³ + σΔT⁴; V3 centred FD of `blackbody_flux` → 4σT³ (order 2, rel 1e-8 at h = 1e-3); V2 pint dimensions (W m⁻², W m⁻² K⁻¹); V7 T⁴ and F^{1/4} scalings, non-default σ honoured, guards | DT60 255.06 K, 3.764 W m⁻² K⁻¹; DT62 1.04 K, 1.22 K; DT63 3.786 vs 3.764, 39.91 vs 37.64 W m⁻²; docstring "0.6 % at ΔT = 1 K" → 0.59 % | analytic, symbolic, converged, benchmark | PASS |
| F3 | `moist.cc_fractional_rate` | V1 L/(R^v T²) by `math` (rtol 1e-15); **V2 derivation** sympy d ln e_s/dT of (18.28) = L/(R^v T²) = (18.27)/e_s; V3 centred FD of ln `saturation_vapour_pressure` (order 2, rel < 1e-7 at h = 1e-3); V5 Bolton (1980) log-derivative 17.67·243.5/(t + 243.5)² within 1 % for −10…35 °C with L(t) = (2.501 − 0.00237 t) × 10⁶ and R^v = 461.5; V5 MetPy 1.7.1 (Ambaum 2020 Eq. 13) log-derivative = L(T)/(R^v T²) with MetPy's constants (rel 1e-6, 250–310 K); V1 e_s(T+ΔT)/e_s(T) = exp(∫rate dT) (rel 1e-13); V2 pint [K⁻¹]; V7 monotone, guards | DT51 7.08, 6.36, 5.75 %/K; DT40 7.1; DT52 7.31 vs 7.08 %, 32.19 vs 28.31 %; DT50 6.19, 16.92, 41.91 hPa; DT54 7.7 %; caption constants are 2.4 % below Bolton at 0 °C (constant-L model) | analytic, symbolic, converged, benchmark | PASS |
| F4 | `sounding.ascent_rates` | V1 synthetic z = 5t, T = 15 − 6.5 z[km]: w 5, dT/dz −6.5 K/km, dT/dt −0.0325 K/s, met +6.5 (rtol 1e-12); V1 Δz/Δp, ΔT/Δp by hand on a random non-uniform column; V3 ΔT/Δz → T′(z_mid) at order 2.0 ± 0.15 (a mid-layer secant is a centred difference); V7 w·dT/dz = dT/dt and dT/dp = dT/dz·dz/dp per layer (rtol 1e-12, also on all ≥ 60 real Trappes layers); V1 NaN levels skipped, indices point into the inputs; V7 Δt = 0, Δz = 0, Δp = 0 → NaN without warnings; guards | DT21 ΔT −24.1 K, Δz 4262 m, −5.655 K/km; DT22 4.736 m/s; DT23 −0.02678 K/s, −1.607 K/min; DT28 −12.18 m/hPa, +0.0689 K/hPa; DT27 rising share ≥ 98 % | analytic, converged, limit | PASS |
| F4 | `sounding.layer_lapse_rate` | V1 linear profile → its slope for any z1, z2 incl. between levels and reversed (rel 1e-12); V1 a kinked profile by hand (interpolated end temperatures); V1 equals `ascent_rates` dTdz on adjacent levels (rtol 1e-12); V7 met = −kundu, symmetric in z1 ↔ z2, unordered/NaN input, guards | DT39 −4.86 K/km; 7.44 and −8.41 °C | analytic, limit | PASS |
| F4 | `sounding.drift` (default unit m) | V1 constant winds from W, S, NE (6 km E; 6 km N; −6000/√2 both); V1 linear wind ramp → trapezoid exact; V7 `top` at a level = truncation (rel 1e-13); V1 a mid-segment cut with interpolated wind (exact); V5 MetPy `wind_components` + `scipy.integrate.trapezoid` (rel 1e-12, random winds and the real Trappes ascent); V7 km = m/1000, default metres, cumulative arrays, NaN dropping, guards | DT25 (7.81, 14.61) km, 16.6 km, bearing 28.1° | analytic, benchmark, limit | PASS |
| F5 | `climatology.global_mean` | V1 constant → constant (numpy, xarray); **V1 on a cell-centre grid cos ϑ weights equal the exact band areas** sin ϑ_N − sin ϑ_S (random field, rel 1e-13); V1 cos²ϑ → 2/3, V3 node/midpoint error order 2.0 ± 0.15; V7 sin ϑ and cos 3λ → 0 (< 1e-14); V1 NaN-masked band mean by exact band areas (rel 1e-13), skipna=False → NaN; V7 xarray N→S order, `latitude/longitude` names, zonal profile, 1-D numpy, time axis kept; guards | ERA5 2023-11-02 12 UTC global t2m 14.83 °C (C3S Nov 2023 monthly mean 14.22 °C; plausibility ± 1 K); cos weights vs exact cell areas on the 0.25° node grid differ by 1.1e-4 K | analytic, converged, limit | PASS |
| F5 | `climatology.linear_trend` (incl. `autocorr`) | V1 exact line → slope, SE < 1e-12, per year/decade/century/float; V5 `scipy.stats.linregress` slope and stderr (rel 1e-11, n = 5, 50, 500 random times); **V1/V5 Santer et al. 2008 Eqs. (4)–(6) by an independent route** (np.polyfit residuals, n_e − 2 dof; rel 1e-11) and SE ratio √((n−2)/(n_e−2)); V7 white-noise calibration: 2000 seeded series, coverage of \|b/SE\| < 1.96 within 5 SE of 0.945; V7 AR(1) φ = 0.6, 1000 series: mean Santer SE / empirical spread = 1 ± 0.11, white-noise SE / spread < 0.6; V1 datetimes (365.25-day years), pandas = xarray = numpy, NaN drop; V7 n_e ≤ 2 → SE NaN without warnings (independently confirmed degenerate), guards | ERA5 Brest daily t2m 1991–2023: 0.280 ± 0.036 K/decade (white), ± 0.204 (Santer) — identical to linregress | analytic, benchmark, limit | PASS |

Mutation check (lesson ch01): 48 wrong variants patched one at a time into a scratch copy of `fluidpy/`
(`scratchpad/mut2`, import path asserted), each run against its module's new tests: **48 of 48 caught** after two test
fixes. First run 46/48: (C17) disabling the auto-close of an open loop was missed because my row's form y² dx + xy dy
vanishes on the closing segment x = 0; (R5) `planck_response` ignoring its `sigma` argument was missed because no row
passed a non-default σ. Both rows were strengthened and both mutants are now caught. Caught variants include forward-as-backward, centred
without the 2, missing factorial / (k+1)!, dropped last differential term, advection-tendency sign, crossed velocity
components, uniform-spacing assumption on non-uniform grids, ij meshgrid, exactness sign and wrong variables, left
Riemann loop sum, N dy sign, polygon corners duplicated / not closed, σ = 5.67e-8, Planck without the 4, cube-root T_e,
emissivity 0.98, CC rate with T, with R_d, ignoring R^v, ascent sign, met = Kundu sign (twice), NaN checked on z only,
dz/dp with ΔT, no interpolation in the layer, unsorted profile, rectangle-rule drift, u/v swapped, no interpolation at
`top`, km default, cos of degrees, NaN cells keeping weight, unweighted xarray mean, cos² weights, n − 1 dof, n_e
without (1 + r₁), r₁ of the data instead of the residuals, 365-day years, per decade = per year, SE without Σ(t − t̄)².

## Functions used by the movie builder (data_needs §C, new F1–F5) — test name each
| Function | Tests |
|---|---|
| `secant_slopes` | `test_secant_slopes_V1_quadratic_exact_rise_over_run`, `…_V1_cubic_closed_forms`, `…_V3_orders_of_accuracy_K10_6[×3]`, `…_V2_leading_error_coefficients_from_sympy_series`, `…_V1_agrees_with_core_fd_stencils_and_DT71`, `test_data_era5_brest_secant_slopes_DT11_DT72` |
| `taylor_polynomial` | `test_taylor_V1_exp_partial_sums_exact_rationals_DT42`, `test_taylor_V2_equals_sympy_series_partial_sums`, `test_taylor_V1_K10_4_rows_exact_for_a_quartic`, `test_taylor_V3_remainder_order_n_plus_1[×4]`, `test_taylor_V7_limits_order20_and_no_overflow` |
| `total_differential` | `test_total_differential_V1_exact_for_a_linear_field_eq_1_4`, `…_V1_DT15_rounded_inputs`, `…_V2_is_the_linear_term_of_sympy_series`, `…_V3_error_second_order_in_step` |
| `chain_rule_rate` | `test_chain_rule_V2_sympy_total_derivative_along_a_path_B1_1`, `…_V7_equals_centred_difference_along_sampled_path_DT16`, `…_V1_limits_and_frozen_pattern`, `…_V1_DT18_aeroplane_numbers`, `test_data_era5_brest_material_derivative_DT12_DT19` |
| `mixed_partials` | `test_mixed_partials_V1_polynomials_exact_both_orders`, `…_V2_sympy_xt_and_DT04`, `…_V3_second_order_to_analytic`, `…_V7_orders_agree_to_round_off_eq_1_69`, `test_data_era5_brest_mixed_partials_DT14` |
| `exactness_residual` | `test_exactness_V2_textbook_forms_DT30`, `…_V2_gradient_of_any_function_is_exact`, `…_V2_heat_not_exact_entropy_exact_DT38`, `…_V2_derivation_1_69_maxwell_1_70_perfect_gas` |
| `loop_integral`, `polygon_path` | `test_loop_V1_unit_square_DT31_and_reversal`, `test_loop_V2_greens_theorem_sympy_triangle_and_V3_order`, `test_loop_V1_circle_minus_pi_over_4_converged`, `test_loop_V1_thermodynamic_cycle_heat_vs_entropy`, `test_loop_V7_input_forms_and_auto_close`, `test_polygon_path_V1_corners_closure_and_area` |
| `SIGMA_SB`, `blackbody_flux`, `emission_temperature`, `planck_response` | `test_sigma_V5_codata_and_V1_from_defining_constants`, `test_blackbody_flux_V1_closed_form_and_V7_T4_scaling`, `test_blackbody_flux_V2_dimensions`, `test_emission_temperature_V1_round_trip_DT60`, `test_planck_response_V2_sympy_derivative_and_identity`, `test_planck_response_V3_centred_fd_of_blackbody_flux`, `test_planck_V2_finite_warming_remainder_DT63`, `test_planck_V1_no_feedback_warming_DT62` |
| `cc_fractional_rate` | `test_cc_rate_V1_closed_form_and_movie_numbers_DT51`, `test_cc_rate_V2_derivation_dlnes_dT_of_18_28_and_18_27`, `test_cc_rate_V3_centred_fd_of_ln_saturation_vapour_pressure`, `test_cc_rate_V5_bolton_1980_log_derivative_with_L_of_T`, `test_cc_rate_V5_metpy_ambaum_2020_is_L_of_T_over_Rv_T2`, `test_cc_rate_V1_finite_warming_exact_vs_linear_DT52` |
| `ascent_rates` | `test_ascent_V1_synthetic_linear_profile`, `…_V1_pressure_columns_and_V7_identities`, `…_V3_layer_gradient_second_order_at_mid_layer`, `…_V1_nan_levels_skipped_and_indices_point_back`, `…_V1_movie_example_DT21_DT23_DT28`, `test_data_trappes_ascent_DT21_DT23_DT28_and_identity` |
| `layer_lapse_rate` | `test_layer_lapse_V1_linear_profile_any_layer_and_conventions`, `…_V1_across_a_kink_by_hand`, `…_V1_equals_ascent_rates_on_adjacent_levels`, `test_data_trappes_layer_lapse_DT39` |
| `drift` | `test_drift_V1_constant_winds_compass_points`, `…_V1_linear_wind_ramp_exact_trapezoid`, `…_V7_top_equals_truncation_and_V1_interpolated_cut`, `…_V5_metpy_wind_components_and_scipy_trapezoid`, `test_data_trappes_drift_DT25_and_V5_route` |
| `global_mean` | `test_global_mean_V1_exact_cell_areas_on_cell_centre_grid`, `…_V1_V3_cos_squared_two_thirds`, `…_V7_antisymmetric_and_zonal_wave_vanish`, `…_V1_nan_skip_band_mean`, `…_V7_xarray_variants_match_numpy`, `test_data_era5_global_t2m_snapshot_plausible_and_exact_area` |
| `linear_trend` | `test_trend_V1_exact_line_and_units`, `test_trend_V5_scipy_linregress_slope_and_stderr`, `test_trend_V1_santer_formula_by_independent_route`, `test_trend_V7_white_noise_calibration`, `test_trend_V7_ar1_santer_correction_restores_the_spread`, `test_trend_V1_datetime_series_dataarray_and_nan`, `test_data_era5_brest_daily_trend_V5_linregress_and_autocorr` |

Counts per validation label (test names; parametrised counted once): V1 37 · V2 14 · V3 9 · V5 7 · V7 24 · data 11
(95 test functions, 100 items). No V4 (no conservation law in F1–F5); no V6 (no book-printed values used).

## Convergence studies (scheme | refinement | observed order | design order)
| Scheme | Refinement | Observed | Design |
|---|---|---|---|
| forward / backward secant, sin at 1 | h = 0.2 … 0.00625 | 1.00 ± 0.15 (both) | 1 (K 10.6) |
| centred secant, sin at 1 | same | 2.00 ± 0.15 | 2 (K 10.6) |
| Taylor remainder, sin at 0.5, n = 1…4 | h = 0.2 … 0.0125 | n + 1 ± 0.15 | n + 1 |
| linearisation error of `total_differential` | |δx| halved ×5 | 2 ± 0.15 | 2 |
| `chain_rule_rate` vs path centred difference | dt = 400 … 50 s | 2 ± 0.15 | 2 |
| `mixed_partials` vs analytic | n = 11 … 81 | 2 ± 0.15 | 2 |
| `loop_integral` (trapezoid) vs Green's theorem / −π/4 | n = 8 … 128 per edge; 64 … 512 on the circle | 2 ± 0.15 | 2 |
| `planck_response` vs centred FD of `blackbody_flux` | h = 8 … 0.5 K | 2 ± 0.15 | 2 |
| `cc_fractional_rate` vs centred FD of ln e_s | h = 4 … 0.25 K | 2 ± 0.15 | 2 |
| `ascent_rates` ΔT/Δz vs T′(z_mid) | Δz = 800 … 100 m | 2 ± 0.15 | 2 |
| `global_mean` cos²ϑ → 2/3 | 12 … 96 bands | 2 ± 0.15 | 2 (midpoint) |

## Conservation / invariant residuals
No conservation law in this batch. Identities: w·dT/dz − dT/dt per layer ≤ 1e-12 relative (synthetic and all real
Trappes layers); dT/dp − dT/dz·dz/dp ≤ 1e-12; the two orders of `mixed_partials` ≤ 1e-9 of the scale (random grids),
1.4e-16 relative on ERA5; ∮δq/T on the (T, α) cycle < 1e-12 J kg⁻¹ K⁻¹.

## Benchmarks used (all in `reference/ch00/SOURCES.md`, verified 2026-10-28)
| Benchmark | Value | Our value | Source |
|---|---|---|---|
| Stefan–Boltzmann σ | 5.670 374 419… × 10⁻⁸ W m⁻² K⁻⁴ (exact) | 5.670374419e-8 (rel 3.4e-11) | CODATA 2022, NIST CUU; `scipy.constants` |
| Trend SE with lag-1 autocorrelation | Santer et al. 2008 Eqs. (4)–(6) (after Santer et al. 2000a) | equal to rel 1e-11 (independent route) | doi:10.1002/joc.1756 |
| OLS slope, stderr | `scipy.stats.linregress` | equal to rel 1e-11 | SciPy 1.18.1 |
| d ln e_s/dT | Bolton (1980) Eq. (10) log-derivative | within 1 % on −10…35 °C (with L(t), R^v = 461.5) | doi:10.1175/1520-0493(1980)108<1046:TCOEPT>2.0.CO;2; L(t) Stull 1988 |
| d ln e_s/dT | MetPy 1.7.1 = Ambaum 2020 Eq. 13 | rel 1e-6 (250–310 K) | doi:10.1002/qj.3899 |
| wind components (from-direction) | MetPy 1.7.1 `wind_components` | drift equal to rel 1e-12 | MetPy |
| Global-mean surface air temperature Nov 2023 | 14.22 °C (monthly) | 14.83 °C (one 12 UTC hour) — plausibility only | C3S bulletin |
The GFD catalogue items (RAPID, QBO, Kelvin h_e, Munk, Eady, inertial period, f at 45°) do not apply to this batch.

## Numbers from the text (book vs ours)
None used (no V6). Vallis's rounded σ = 5.67 × 10⁻⁸ is 0.0066 % below CODATA; the movie uses CODATA.

## Figures reproduced with our code (local, `outputs/ch00/verify/`)
| Figure | File | Verdict |
|---|---|---|
| secant errors and Taylor remainders, log-log | `dt_secant_taylor_orders.png` | Forward and backward errors lie on the sympy leading term sin(1)h/2 (slope 1), centred on cos(1)h²/6 (slope 2), and the Taylor remainders have slopes 2–5, as designed. |
| Trappes 2026-09-30 12 UTC: profile with the 850→500 hPa secant and the 1.533 km tangent; w per layer; both lapse-rate signs | `dt_trappes_ascent.png` | The secant (−5.66 K/km) and tangent (−4.86 K/km) pass through the right levels, w sits at 2.5–6 m/s rising with height, and the Kundu/met signs mirror around zero with the ±9.76 K/km dry adiabats. |
| balloon drift track; σT⁴ with its tangent at T_e; CC rate vs Bolton | `dt_drift_planck_cc.png` | The drift ends at (7.8, 14.6) km NNE, the tangent 3.764 W m⁻² K⁻¹ touches σT⁴ at 255 K and undershoots on both sides, and the constant-L CC rate is a few % below Bolton in the cold and meets it near 30 °C. |

## Deviations & justifications
* No `# DEVIATION` in the new code.
* Tests do not encode any `data_needs` value that disagrees with the library. DT18's "−8.60 K/h" comes from the
  full-precision ∂T/∂t (2.9244 K/h); with the rounded 2.92 the total is −8.607, so the test accepts ±0.01.
* The ERA5 global-mean row is a plausibility check (one hour against a monthly mean), not a V5.

## Open items
1. **Stale docstrings (implementer):** all 15 new docstrings still say "Validation (planned): …" (calculus.py lines
   63, 110, 156, 198, 251, 300, 334, 380; radiation.py 61, 92, 122; moist.py 109; sounding.py 74, 135, 196;
   climatology.py 389, 476). They should state the achieved levels and name the tests above, for example
   loop_integral: "V2 Green's theorem (sympy, triangle), V1 −π/4 circle, V3 order 2".
2. **`linear_trend` citation (implementer):** the docstring cites Santer et al. 2000 "Eqs. (3)–(6)". I could not
   retrieve the 2000 paper, so those equation numbers are unconfirmed. The formula is confirmed as Santer et al. 2008
   (IJoC 28, 1703–1722) Eqs. (4)–(6), which state they follow Santer et al. 2000a. Suggest citing the 2008 paper
   as well.
3. **`linear_trend(autocorr=True)` with gaps (implementer, docstring):** NaN values are dropped before r₁ is computed,
   so samples on either side of a gap count as lag-1 neighbours. Harmless for the movie's complete monthly series.
   Worth one sentence in the docstring.
4. **`SIGMA_SB` docstring wording:** it says "exact value 5.670374419 × 10⁻⁸". That is the exact value truncated to 10
   significant digits (rel 3.4e-11). Wording only.
5. **DT53 / DT61 not testable yet:** datasets D3 (ERA5 monthly TCWV) and D4 (CERES EBAF OLR) are not on the data root.
   The functions they use (`global_mean`, `linear_trend`) are verified, but the two data CHECK rows need the
   downloads first.
6. Disk at the end of the run: C: 46 GB free (floor 40 GB), G: 551 GB free. No downloads, renders or installs.
7. **Kundu flake (pre-existing, not in this batch; owner: fluidpy Kundu tests, which I may not edit):**
   `tests/test_ch03.py::test_shear_strain_rate_V3_tracked_corner_closing` failed once in the full `-n 8` run (observed
   order 2.41 against the design 1.0; errors 3.7e-4, 7.2e-5, 8.1e-6, 2.9e-6). It draws `G = RNG.normal(size=(2, 2))` from
   the module-level `RNG = np.random.default_rng(3)`, so `G` depends on which ch03 tests ran before it in the same xdist
   worker. Adding 100 tests changed that scheduling. It passes alone (3/3) and in a serial run of `test_ch03.py`
   (120 passed). Hypothesis: for this draw of G the O(dt) coefficient of the corner-closing rate nearly vanishes, so
   the next order shows. Fix in the Kundu test: a local `np.random.default_rng(seed)` inside the test, or reject draws
   with a near-zero leading coefficient. Same class as the ch06 half-body flake in the weather_basics report.

## Test runs
| Run | Command | Result |
|---|---|---|
| New library tests | `pytest -q tests/geo/test_calculus.py tests/geo/test_radiation.py tests/geo/test_moist_cc_rate.py tests/diag/test_sounding.py tests/diag/test_global_mean_trend.py` (cwd `../Fluid Dynamics`) | **100 passed** (47 + 9 + 7 + 21 + 16) |
| **Full fluidpy suite** | `.venv/Scripts/python.exe -m pytest -q -n 8 -p no:cacheprovider tests` (cwd `../Fluid Dynamics`) | **1 failed, 2810 passed, 1 xfailed, 4 warnings in 2053.34 s (0:34:13)**. The failure is the Kundu ch03 flake (Open item 7). Before this batch: 2711 passed; + 100 new = 2811 = 2810 + 1. |
| Flake re-runs | `pytest tests/test_ch03.py::test_shear_strain_rate_V3_tracked_corner_closing` ×3; `pytest tests/test_ch03.py` serial | 1 passed ×3; **120 passed** |
| AOFD suite | `.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests` (cwd AOFD) | **35 passed, 1 skipped** (`test_maptools.py:152` slow, needs `AOFD_MAPTOOLS=1`), 89 warnings |
| Mutation check | `scratchpad/mutate_dt.py` on `scratchpad/mut2` | first run 46/48 (C17, R5 missed → tests strengthened); **final clean run of all 48 against the final tests: 48 of 48 caught** |

## Verdict: PASS for F1–F5; full-suite rule not met only by a pre-existing order-dependent Kundu flake (ch03)
Every new function has ≥ 2 independent evidence levels, at least one of them V1, V2, V3 or V5. All 100 new tests
pass. The full fluidpy suite has no failure caused by this batch, the AOFD suite is green, and no tolerance was
loosened. The ★★ derivations have V2 sympy tests: (1.66) → (1.69) → (1.70) Maxwell, d ln e_s/dT from (18.28), the
Taylor rows (K 10.4)/(10.5), Green's theorem for `loop_integral`, and the Planck finite-warming remainder. Before the
release the implementer should update the 15 "Validation (planned)" docstrings (Open item 1), and the Kundu ch03 test
needs a local seed (Open item 7).
