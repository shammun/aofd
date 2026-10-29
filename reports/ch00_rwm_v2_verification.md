# Chapter 0 library verification — reading weather maps v2 (#69): radar, ensemble, orbits, layer-mean T, skew-T, cols, METAR remarks      2026-10-29

AOFD at `93e7b41` (+ uncommitted movie work of other agents); fluidpy at `3a3985d` ("movie #69; tests pending") +
**uncommitted tests by the verifier** (nothing committed). Verifier: math-verifier agent. Plan:
`movies/ch00/ch00_reading_weather_maps/data_needs.md` §C (F13, F14, F17 diag part, F18–F22) and CHECK rows RM46–RM89.
Library code was not modified; defects are proven by strict-xfail tests and listed below.

## Environment
Python 3.12.1 · numpy 2.5.4 · scipy 1.18.1 · sympy 1.14.0 · matplotlib 3.11.2 · contourpy 1.4.0 · MetPy 1.7.1 (AOFD
`.venv`, fluidpy editable). Disk before the work: C: 70 GB free, G: 521 GB free (C: ≥ 45 GB → full suite run).

## Equations checked on the page images
| Equation | Page (pdf / printed) | Matches the code |
|---|---|---|
| (2.166) z(p₂) − z(p₁) = −(R/g) ∫_{p₁}^{p₂} T d ln p (with Φ = gz) | p103 / 83 | yes — `layer_mean_temperature` is its constant-T (ln p-weighted mean) inverse; code uses g₀ for geopotential height (docstring says so) |
| §2.2.2 (δx, δy) = (r cos ϑ δλ, r δϑ); (2.31) ∇ϕ = i (1/(r cos ϑ)) ∂ϕ/∂λ + j (1/r) ∂ϕ/∂ϑ + k ∂ϕ/∂r | p081 / 61 | yes — `saddle_points` metric (hx = a cos ϑ Δλ, hy = a Δϑ) |
Radar, orbits, skew-T drawing, METAR/SYNOP codes and ensemble statistics are not Vallis equations (Doviak & Zrnić
1993; Marshall & Palmer 1948; Kepler/Newton; Herlofson 1947; FMH-1; WMO-No. 306) — sources in
`reference/ch00/SOURCES.md` (new section "ch00_reading_weather_maps v2").

## Test files (fluidpy, new, uncommitted)
| File | Test functions (cases) | Result |
|---|---|---|
| `tests/diag/test_radar.py` | 12 | 12 passed |
| `tests/diag/test_ensemble.py` | 14 | 14 passed |
| `tests/geo/test_orbits.py` | 6 | 6 passed |
| `tests/geo/test_atmos_layer_mean.py` | 6 | 6 passed |
| `tests/diag/test_sounding_skewt.py` | 9 | 9 passed (incl. the surface-at-0 °C case added after mutation round 1) |
| `tests/diag/test_axes_saddle.py` | 9 (1 strict xfail = defect D2) | 8 passed, 1 xfailed |
| `tests/diag/test_station_remarks.py` | 16 (+ 73 extra parametrised cases: 74 rows of 4677; 1 strict xfail = defect D1) | 83 passed, 1 xfailed |
| **total** | **72 functions, 139 cases** | **137 passed, 2 xfailed** (also clean under `-W error::RuntimeWarning`) |

## Validation table
| Id | Function | Evidence (V-levels) | Numbers | Label |
|---|---|---|---|---|
| F14 | `radar.echo_range`, `echo_delay` | V1 r = cΔt/2 on 301 times (rtol 1e-15), c = 299 792 458 exact; V7 round trip, c/n scaling, guards | RM74: 1 ms → 149.896229 km → "149.9 km" | analytic, limit |
| F14 | `dbz_to_z`, `z_to_dbz` | V1 decades; V1 dBZ by natural logs (rtol 1e-14); V7 round trip −30…75 dBZ (< 1e-12 dB), NaN, Z = 0 → −inf, Z < 0 raises | | analytic, limit |
| F14 | `z_to_rain_rate`, `rain_rate_to_z`, `dbz_to_rain_rate`, `rain_rate_to_dbz` | V1 RM75 by an independent log route (rtol 1e-13); V7 round trips, +10 dBZ ⇒ ×10^(1/b) for (200, 1.6) and (300, 1.4), curves cross at 7.59 mm/h; **V5 physical route: Marshall–Palmer 1948 DSD integrated (quad, Γ(7) = 720) → 296 R^1.47, within 2 dB of 200 R^1.6 over 1–100 mm/h** | RM75: 0.648 / 11.53 / 48.6 mm/h; 1 mm/h → 23.01 dBZ; DSD vs power law max 1.70 dB (1 mm/h) | analytic, benchmark, limit |
| F14 | `beam_height`, `beam_ground_range` | V1 plane-vector geometry (|P| − R, atan2) for k_e = 1, 4/3, 1.21 on 400 random beams (rtol 1e-11); **V2 sympy law of cosines → h, sine rule → s, series → r sin θ + r² cos²θ/(2R)**; V7 flat-Earth limit (a = 1e21: r sin θ, r cos θ), 1/a convergence of the curvature term (ratio 2.000 ± 1e-3), θ = 90° → r, s ≤ r, h0, monotone in k_e; V1 small-angle bound; **V5 NWS ROC WSR-88D beam-height tables, 44 rows, 11 elevations, k = 1.21, per-row bound r·sin 0.005° + r² sin²φ/(2ka) + 0.05 m** (4/3 Earth misses the 0.48°/60 km row by 25 m: discriminating) | 0.5° at 230 km → 5.12 km (k = 4/3) | analytic, symbolic, benchmark, limit |
| F17 | `ensemble.ensemble_mean`, `spread` | V1 hand mean, identical members → field / 0, ±d → d√2 (ddof 1) and d (ddof 0), √(30/31) ratio; **V5 numpy nanmean/nanstd with 15 % NaN members, both ddof, other axis (rtol 1e-12)**; V7 all-NaN / < ddof+1 → NaN, M = 0 → NaN, no warnings | population/sample 1.63 % for M = 31 | analytic, benchmark, limit |
| F17 | `probability` | V1 12/31 = 0.387; V1 complements P(>T) + P(≤T) = P(<T) + P(≥T) = 1 with ties and NaN; V1 count vs nansum; V7 threshold field broadcast, member axis moved, 0 ≤ P ≤ 1 | RM83 needs real GEFS (open) | analytic, limit |
| F17 | `member_contours` | V1 field linear in λ → exact meridians (atol 1e-12) for 4 members; **V3 closed circle radius error order 2.0 ± 0.25** (h = 1…0.125°); **V5 matplotlib `contour` vertex sets identical (2e-9)** for 3 noisy members; V7 N→S latitudes same line, NaN column splits a loop, level not crossed → [[]], M = 0 → [], 2-D input raises | | analytic, converged, benchmark, limit |
| F17 | `mean_along_contour` | V1 constant → itself, v = 2ϑ + 1 on a parallel → 92, v = λ → mid-longitude −30, two meridian pieces weighted by length (and by length after NaN-truncating one); **V3 parallel length → a cos ϑ Δλ, order 2.0 ± 0.15** (chords), error 1e-5 at 0.5°; V7 no crossing → (NaN, 0) | | analytic, converged, limit |
| F22 | `orbits.geostationary_radius`, `geostationary_altitude`; constants `GM_EARTH`, `EARTH_RADIUS_EQUATORIAL` | V1 constants pinned to WGS-84/IERS; **V5 Nelson (2001): 42 164.172 km (±5 m), +0.522 km with oblateness (our J₂ iteration: 0.522 ± 0.002), 35 786 km, 3.075 km/s**; **V2 sympy GM/r² = Ω²r ⇒ r = (GM/Ω²)^{1/3}, T = 2π/Ω, v = Ωr**; V7 r³Ω² = GM (1e-14), solar-day trap +76.9 km, mean-radius altitude +7.137 km exactly, GM^{1/3}Ω^{−2/3} scaling, guards | RM72: 35 786.04 km | analytic, symbolic, benchmark, limit |
| F22 | `circular_orbit_period`, `circular_orbit_speed` | V5 NASA Aqua 705 km → 98.8 min (ours 98.88, bound 0.2 % justified by rounding + radius ambiguity); V1 v·T = 2πr (1e-14); V1 Kepler log-slope 3/2 (1e-12); V1 period at GEO = 2π/Ω (1e-12) | | analytic, benchmark |
| F18 | `atmos.layer_mean_temperature` | V1 round trip with `hypsometric_thickness` (12 cases, rtol 1e-14); **V2 sympy integration of (2.166) at constant T, solved for T, 20 random cases (1e-13)**; V1 non-isothermal profiles (T linear in ln p → (T₁+T₂)/2; exponential → closed form, 1e-6); **V5 MetPy `thickness_hydrostatic` of a wiggly sounding → ln p-weighted mean (1e-6), our/MetPy ratio = R_d ratio (1e-12)**; V7 p₁ = p₂ / negative raise, swap symmetry, Pa = hPa, 1/R scaling | RM68: 5371 m → 264.7 K = −8.4 °C; 5400 m → 266.1 K | analytic, symbolic, benchmark, limit |
| F19 | `sounding.skewt_xy` | V1 isotherms straight at tan(skew) in drawn units for 4 angles × 3 aspects × 3 T (rtol 1e-12); V1 equal ln p → equal y, edges, isobars horizontal, bottom isobar → T_range; **V5 MetPy `SkewT` display transform, rotation 30/45/60° ⇔ skew_deg 60/45/30° (atol 1e-12)**; V7 emagram limit, broadcasting, guards | see note N3 on the angle convention | analytic, benchmark, limit |
| F19 | `level_crossing`, `freezing_level` | V1 200 random linear profiles exact (1e-12); V1 inversion with 3 crossings and "down"/"up" filters; exactly-on-level counted once, plateau, end level; NaN levels; pressure coordinate; V1 surface cases (≤ 0 °C → surface, never → NaN, warm nose above); **data RM71: IGRA2 Trappes 00 UTC 2 Nov 2023 → 2144.8 m**, equal to the hand interpolation, single crossing, second route (T linear in ln p + hypsometric) 1.6 m away; RM70 dew-point depression ≤ 0.4 K 964–554 hPa | RM71 2.14 km ✓ | analytic, limit |
| F20 | `axes.saddle_points` | V1 F quadratic in (λ, ϑ) off-grid (3 shapes incl. cross term): location, value exact (1e-9), Fxx/Fyy/Fxy with the (2.31) metric (1e-9); **V2 sympy covariant Hessian on the sphere (Christoffels of a² cos²ϑ dλ² + a² dϑ²) = coordinate forms at ∇F = 0, ≠ elsewhere**; V1 x² − y² on a sphere patch → Fxx 2, Fyy −2, det −4 (1e-12); **V3 off-grid col of a wave field, location order 3.34 (asserted ≥ 1.85)**; V7 bowls/domes/planes/constant → none; egg-crate cols all det < 0 and on the analytic set; N→S rows identical; λ shift; min_abs_det; periodic grid cols at λ = 0 (seam) and 180°; **data RM53: GFS msl 18 UTC 27 Oct 2026 (35–65° N, 85–35° W): 2 cols (46.8° N 43.4° W, 996.4 hPa; 60.4° N 37.2° W, 986.0 hPa), det < 0, ring test (500 km): both cols alternate 4 times (+8.0 / −13.6 hPa and +11.8 / −5.6 hPa extremes)** | RM53 ✓; **defect D2** (seam col reported at lon 360.0) | analytic, symbolic, converged, limit |
| F13 | `station.decode_metar_remarks` | V1 PAFB (RM57) and KSXT reports, synthetic report with every group (signs, trace, "////", 24-h max/min, snow, flags); V7 SLP 9/10 boundary (499 → 1049.9, 500 → 950.0) and all 1000 tenths 950.0–1049.9; **V5 IEM decoded columns over the raw all-station CSV: 3 104 reports with RMK — SLP 1 825 (all equal except 2 self-inconsistent Alaska reports, see N2), T/Td 3 812 values (934 tenth-°F exact, 2 878 whole-°F within ½ °F), Prrrr 75, 4/sss 5 — 0 disagreements**; V7 tendency structure on 1 533 real 5appp groups (sign from code table 0200, |Δp| = ppp/10) with a decoder written in the test | RM57 ✓ (SLP 1032.9, T/Td 0.9/0.9, a = 2 +1.2 hPa) | analytic, benchmark, limit |
| F13 | `Metar.tendency_a`, `tendency_hPa`, `remarks_decoded` | V1 defaults without RMK; RMK tenths replace body T/Td; Td NaN when the T group has no Td half (documented); `remarks_decoded` = `decode_metar_remarks`; field excluded from hash | | analytic |
| F21 | `station.metar_wx_to_ww` | **V1 74 rows of WMO code table 4677** (NODC copy read today) incl. drizzle/rain/snow intensities, showers, freezing, TS ± hail, fog 44/45/48/49, MIFG/BCFG/VCFG/VCSH, DRSN 36/37 vs BLSN 38/39, dust; V1 4678 abbreviation set; V7 selection: highest figure, 17 over 20–49, TS + separate precipitation → 95/96/97/99, group order irrelevant (50 random sets); V1 RM59 four s37 stations (CYAH 71, PAFB 45, ESKS 51, MDJB 95, with T/Td); **V5 MetPy `wx_code_map` on 49 common single groups**; data: every IEM wxcodes string in the window maps (UP and VCTS → None, documented) | **defect D1** (+SHRA → 82) | analytic, benchmark, limit |

## Functions used by the movie builders — test names
| Function | Tests |
|---|---|
| radar.echo_range / echo_delay | `test_echo_range_V1_out_and_back_RM74`, `test_echo_range_V7_round_trip_and_guards` |
| radar.dbz_to_z / z_to_dbz | `test_dbz_V1_decibel_definition`, `test_dbz_V7_round_trip_nan_zero_negative` |
| radar Z–R (4 functions) | `test_marshall_palmer_V1_movie_values_RM75`, `test_marshall_palmer_V7_round_trips_and_scaling`, `test_marshall_palmer_V5_drop_size_distribution_consistency` |
| radar.beam_height / beam_ground_range | `test_beam_height_V1_vector_geometry_any_ke`, `test_beam_height_V2_sympy_law_of_cosines`, `test_beam_height_V7_flat_earth_and_vertical_limits`, `test_beam_height_V1_small_angle_form_error_bound`, `test_beam_height_V5_wsr88d_roc_table` |
| ensemble.ensemble_mean / spread | `test_ensemble_mean_V1_hand_and_identical_members`, `test_spread_V1_two_members_and_ddof`, `test_mean_spread_V5_numpy_nan_statistics`, `test_mean_spread_V7_empty_and_all_nan_no_warnings` |
| ensemble.probability | `test_probability_V1_counts_and_complements`, `test_probability_doctest` |
| ensemble.member_contours | `test_member_contours_V1_linear_field_gives_exact_meridian`, `test_member_contours_V3_circle_radius_second_order`, `test_member_contours_V5_matplotlib_identical_vertices`, `test_member_contours_V7_orientation_nan_and_guards` |
| ensemble.mean_along_contour | `test_mean_along_contour_V1_constant_and_linear_in_latitude`, `test_mean_along_contour_V3_parallel_length_converges`, `test_mean_along_contour_V1_weights_by_length_not_vertex_count` |
| orbits.* + constants | `test_orbit_constants_V1_pinned_to_wgs84`, `test_geostationary_V1_published_values_RM72`, `test_geostationary_V2_sympy_force_balance_and_kepler`, `test_geostationary_V7_invariants_and_solar_day_trap`, `test_circular_orbit_V5_aqua_and_V1_vT_equals_circumference`, `test_orbits_doctest` |
| atmos.layer_mean_temperature | `test_layer_mean_T_V1_round_trip_isothermal`, `test_layer_mean_T_V2_sympy_from_2166`, `test_layer_mean_T_V1_ln_p_weighted_mean_of_a_real_profile`, `test_layer_mean_T_V1_movie_numbers_RM68`, `test_layer_mean_T_V5_metpy_thickness_hydrostatic`, `test_layer_mean_T_V7_guards_signs_and_broadcasting` |
| sounding.skewt_xy | `test_skewt_V1_isotherms_straight_at_the_skew_angle_in_drawn_units`, `test_skewt_V1_log_p_axis_and_edges`, `test_skewt_V5_metpy_skewT_axes_transform`, `test_skewt_V7_emagram_limit_broadcast_and_guards` |
| sounding.level_crossing / freezing_level | `test_level_crossing_V1_linear_profile_exact_anywhere`, `test_level_crossing_V1_inversion_directions_and_exact_levels`, `test_freezing_level_V1_surface_cases`, `test_freezing_level_real_trappes_RM70_RM71`, `test_sounding_doctests` |
| axes.saddle_points | `test_saddle_V1_quadratic_in_lambda_theta_exact_off_grid`, `test_saddle_V2_sympy_covariant_hessian_equals_coordinate_form_at_stationary_point`, `test_saddle_V1_local_x2_minus_y2_on_a_sphere_patch`, `test_saddle_V3_off_grid_col_of_a_non_quadratic_field_converges`, `test_saddle_V7_bowls_and_domes_have_no_cols`, `test_saddle_V7_orientation_shift_and_min_abs_det`, `test_saddle_V7_periodic_global_grid_col_on_the_seam`, `test_saddle_V7_periodic_lon_stays_in_grid_span` (strict xfail, D2), `test_saddle_data_gfs_col_between_two_highs_and_two_lows_RM53` |
| station.decode_metar_remarks + Metar fields | `test_remarks_V1_pafb_report_RM57`, `test_remarks_V1_ksxt_and_precipitation_groups`, `test_remarks_V1_synthetic_groups_and_V7_sign_digits`, `test_remarks_V7_slp_9_10_boundary`, `test_metar_new_fields_V1_defaults_and_rmk_precedence`, `test_remarks_V5_iem_decoded_columns_all_stations`, `test_remarks_V7_tendency_structure_on_real_reports` |
| station.metar_wx_to_ww | `test_ww_V1_wmo_code_table_4677_rows` (74 cases), `test_ww_V1_fog_sky_visibility_and_none_cases`, `test_ww_V7_selection_rules`, `test_ww_V1_docstring_example_and_s37_stations_RM59`, `test_ww_V5_metpy_wx_code_map_where_both_follow_wmo`, `test_ww_V1_heavy_rain_shower_is_81_not_violent` (strict xfail, D1), `test_ww_real_reports_every_iem_wxcode_maps_without_error`, `test_ww_V1_code_table_4678_abbreviations_recognised` |

## Convergence studies
| Scheme | Grids | Observed order | Design order |
|---|---|---|---|
| `member_contours` circle radius (marching squares, linear on edges) | h = 1, 0.5, 0.25, 0.125° | 1.99 (errors 1.5e-2 → 2.4e-4°) | 2 |
| `mean_along_contour` parallel length (great-circle chords) | Δλ = 4, 2, 1, 0.5° | 2.00 (rel. 1.3e-4 → 2.0e-6) | 2 |
| `saddle_points` off-grid col of a wave field (3 × 3 quadratic fit) | h = 1, 0.5, 0.25, 0.125° | 3.34 (2.3e-4 → 2.7e-7°; odd-order error terms cancel for this separable field) | ≥ 2 (asserted ≥ 1.85) |
| `beam_height` curvature term vs a (limit study, not a discretisation) | a = 1e9, 2e9 m | ratio 2.000 (± 1e-3) | 1/a |

## Conservation / invariant residuals
r³Ω² − GM: < 1e-14 relative. v·T − 2πr: < 1e-14. P(>T) + P(≤T) − 1: ≤ 1e-15. echo_range ∘ echo_delay: 1e-15.
dBZ round trip: < 1e-12 dB. Isothermal round trip of (2.166): < 1e-14.

## Benchmarks used
| Benchmark | Value | Ours | Source | Verified |
|---|---|---|---|---|
| Geostationary radius (point mass) | 42 164.172 km | 42 164.173 km | Nelson 2001, Via Satellite | 2026-10-29 |
| Oblateness shift | +0.522 km | +0.522 km (our J₂ iteration) | same | 2026-10-29 |
| Geostationary altitude | 35 786 km | 35 786.04 km | same (nominal) | 2026-10-29 |
| GEO speed | 3.075 km/s | 3.0747 km/s | same | 2026-10-29 |
| Aqua period at 705 km | 98.8 min | 98.88 min (+0.08 %) | NASA Aqua page | 2026-10-29 |
| WSR-88D beam heights (44 rows) | e.g. 739.7 m (0.48°, 60 km) | within the per-row bound (max |Δ| 5.6 m at 6.73°/60 km = the small-angle term the ROC omits + angle rounding) | NWS ROC tables | 2026-10-29 |
| MP DSD → Z | 296 R^1.47 | within 1.70 dB of 200 R^1.6 (1–100 mm/h) | Marshall & Palmer 1948 | 2026-10-29 |
| METAR remarks | IEM decoded mslp/tmpf/dwpf/p01i/snowdepth | 0 disagreements (2 excluded self-inconsistent reports) | IEM archive, raw CSV on G: | 2026-10-29 |
| ww table | WMO 4677 rows | 74/74 rows except +SHRA (D1) | WMO-No. 306 via NOAA NODC | 2026-10-29 |
| MetPy wx_code_map, SkewT, thickness_hydrostatic | — | equal (49 codes; 1e-12; 1e-6) | MetPy 1.7.1 | 2026-10-29 |

## CHECK rows covered by these tests
RM53 ✓ (cols in the s20 frame) · RM57 ✓ · RM59 ✓ (ww and T/Td of the four stations) · RM68 ✓ central value (band
note N1) · RM70 ✓ · RM71 ✓ freezing level 2.14 km · RM72 ✓ geostationary part · RM74 ✓ · RM75 ✓ · RM83/RM84 not
testable (no GEFS data on disk; Open item 3).

## Mutation check (scratch copy, library untouched)
Script `…/scratchpad/mutate.py` (session scratchpad, not committed): copies `fluidpy/` and the 7 new test files to a
scratch tree (import probe confirmed the scratch `fluidpy` is loaded), applies one mutant at a time, runs the module's
test file with `-x`, restores. **71 mutants** — radar 14, ensemble 10, orbits + constants 7, layer_mean_temperature 4,
sounding 9, saddle_points 8, station (remarks, Metar fields, ww) 19.

| Round | Killed | Survivors and action |
|---|---|---|
| 1 (670 s) | 68 / 71 | #23 `mean_along_contour` weights Σ v̄ × mean ℓ instead of Σ ℓ v̄ (all test contours had equal segments) → added `test_mean_along_contour_V1_unequal_segments_trapezoid`; #41 `freezing_level` surface test `<` instead of `<=` (equivalent on every profile tested) → added a surface-exactly-0 °C-under-a-warm-layer case; #44 aimed at `level_crossing`'s NaN filter but replaced the identical first occurrence in another function (an invalid mutant) → re-aimed at occurrence 2 |
| 2 (re-run of the three) | 3 / 3 | — |
| **Total** | **71 / 71** | 0 equivalent mutants |

## Figures reproduced with our code (local, `outputs/ch00/verify/`)
| Figure | File | Verdict |
|---|---|---|
| Beam height 0.5° for k_e = 1, 4/3, 1.21 with ROC points | `rwm_v2_beam_height.png` | The 1.21 curve passes through the ROC 0.48° points and the flat-Earth line is the tangent at the radar, as it must be. |
| Z–R: 200 R^1.6 vs the integrated MP DSD, RM75 points | `rwm_v2_marshall_palmer.png` | The two laws cross near 10–50 mm/h and differ by < 2 dB elsewhere in the rain range; the RM75 points sit on the power law. |
| Trappes 00 UTC 2 Nov 2023 on `skewt_xy` (45°) with the freezing level | `rwm_v2_skewt_trappes.png` | Isotherms are straight 45° lines, T and Td nearly coincide from 964 to 554 hPa (RM70) and the star sits between 850 and 700 hPa (RM71); axis tick labels overlap (cosmetic, our plot). |
| GFS msl 18 UTC 27 Oct 2026 with `saddle_points` | `rwm_v2_cols_gfs.png` | The 46.8° N col sits between the 982-hPa low to the south and the Labrador lows to the north, with higher pressure east and west — a textbook col. |

## Defects found (library code not changed)
- **D1 (medium) — `metar_wx_to_ww("+SHRA")` returns 82 ("rain showers, violent").** WMO 4677: 80 slight, 81 moderate
  or heavy, 82 violent; METAR "+" is heavy → 81 (MetPy also 81). The snow (85, 86, 86) and mixed (83, 84, 84) shower
  triples are right; only `_WW_SHOWER[frozenset({"RA"})] = (80, 81, 82)` breaks the pattern. Proof:
  `test_ww_V1_heavy_rain_shower_is_81_not_violent` (strict xfail; obtained 82, expected 81). Fix: `(80, 81, 81)`.
- **D2 (low) — `saddle_points` on a periodic grid returns a seam col at lon = 360.0** (not in [lon₀, lon₀ + 360)):
  `lo[0] + np.mod(−ε, 360)` rounds to 360.0. Same point on the globe; a builder filtering `lon < 360` drops it.
  Proof: `test_saddle_V7_periodic_lon_stays_in_grid_span` (strict xfail; obtained [90, 270, 360, 180]). Fix: the
  `wind_direction_from` round-off guard (`np.where(lon_s >= lo[0] + 360, lon_s − 360, lon_s)`).
- **D3 (docstring) — `fluidpy/geo/orbits.py`** (module docstring and `geostationary_radius` Validation line) says
  "Soop 1994: 42 164.17 km **with J₂**; point mass 42 164.2 km". 42 164.17 km is the **point-mass** Kepler radius; with
  oblateness it is 42 164.70 km (Nelson 2001: +0.522 km; our J₂ iteration +0.522 km). The "J₂ adds ≈ 0.5 km" statement
  is right; the attribution of the number is wrong.
- **D4 (docstring, stale validation text)** — `radar.beam_height` cites "V5 Doviak & Zrnić (1993) Fig. 2.7 curves"
  (not tested: the V5 used is the NWS ROC table); `ensemble.spread` cites "V7 spread grows with lead time on real GEFS
  runs (RM84)" (no GEFS data yet); `sounding.level_crossing` says "data test planned" (now done:
  `test_freezing_level_real_trappes_RM70_RM71`); `station.decode_metar_remarks` says "V5 … over the 669-report set
  (planned)" (now done over 3 104 reports). Outside this batch, `geo/atmos.py` lines 611, 649, 710, 781 still say
  "Validation: planned" for functions verified on 2026-10-29 (`20d3086`).

## Notes for the movie director / builder (not defects)
- **N1 (RM68)** — the row's two ranges disagree at the lower edge: thickness 5350–5390 m ↦ T̄ 263.7–265.7 K, not
  264–266 K. The asserted Brest value 5371 m → 264.7 K (−8.4 °C) is unaffected; widen the T̄ band or narrow the
  thickness band.
- **N2 (IEM SLP)** — IEM's `mslp` departs from the 9/10 rule on 2 of 1 825 reports (PFTO SLP827 → IEM 1082.7, ours
  982.7; PACX SLP908 → 1090.8 / 990.8). Both reports contradict their own altimeter settings (hypsometric SLP 1035.6 /
  1030.4 hPa, ≥ 39 hPa from either candidate); ours is the nearer candidate in both. Do not use these two stations on a
  station-plot frame.
- **N3 (skew-T angle convention)** — `skewt_xy(skew_deg)` is the isotherm angle from the horizontal; MetPy's
  `SkewT(rotation=ρ)` shears by ρ from the vertical, so skew_deg = 90° − ρ (they coincide only at 45°; MetPy's default
  30 is a 60° chart). The docstring's "chart conventions as in … MetPy SkewT" holds at 45° only — pass 90 − ρ when
  matching a MetPy figure.
- **N4 (ww)** — `VCTS` and `UP` alone map to None (no glyph; documented). VCTS occurs in the 18 UTC 27 Oct window; MetPy
  uses 13 ("lightning visible, no thunder heard") for it. PRFG → 41 (ours) vs 44 (MetPy) and IC → 76 (ours, = diamond
  dust in 4677) vs 78 (MetPy): ours follow the table wording.
- **N5 (remarks)** — 5 real Alaska reports end a 5appp group with ";" (e.g. PASV "57008;"); such tokens are not decoded
  (no tendency). IEM text artefact, not FMH-1; strip punctuation in the builder if those stations are shown.
- **N6 (C11 citation)** — Marshall & Palmer (1948) give the exponential DSD (N₀ = 8000 m⁻³ mm⁻¹, Λ = 4.1 R^−0.21),
  which integrates to Z = 296 R^1.47; "Z = 200 R^1.6" is the relation textbooks attribute to them (the secondary
  sources found today do not show it in the paper itself). Keep "Marshall–Palmer relation" on screen; the manifest
  citation should say "commonly attributed to".

## Open items
1. **D1** `+SHRA → 82` (fix `_WW_SHOWER` RA triple to (80, 81, 81)); the movie shows SHRA (81) only — no frame wrong
   today, but any "+SHRA" station would get the violent-shower glyph.
2. **D2** seam col at lon 360.0 (round-off guard in `saddle_points`).
3. **RM83, RM84 (GEFS member count; spread T+120 > 2 × T+24)** cannot be verified: no GEFS members on disk (N4 needs the
   GRIB decoder decision, data_needs §G2). `spread`/`probability`/`member_contours` are verified on synthetic and
   reference statistics only; the docstring's RM84 claim is unverified until the data exist.
4. **Precedence rule source** — "highest code figure; 17 over 20–49" is coded and tested (V7) as the docstring states;
   today's web check could not reach the WMO-No. 306 notes to table 4677 that state it (NODC copy lists the table rows
   only). Re-verify against the WMO Manual before the build.
5. **D3, D4** docstring corrections (orbits J₂ attribution; four stale Validation lines in this batch + four in
   `geo/atmos.py`).
6. Notes N1 (RM68 band) and N6 (C11 citation wording) for the director.

## Suite runs
| Run | Command | Result |
|---|---|---|
| New fluidpy test files | `.venv/Scripts/python.exe -m pytest <7 files> -q -p no:cacheprovider -W error::RuntimeWarning` (from `../Fluid Dynamics`) | **137 passed, 2 xfailed** in 14 s |
| **Full fluidpy suite** (alone, C: 70 GB free ≥ 45) | `.venv/Scripts/python.exe -m pytest -q -n 8 tests` from `../Fluid Dynamics` | **3097 passed, 3 xfailed, 284 warnings in 1137 s (18:57)**, exit 0. xfails: D1, D2 and the documented `trough_ridge_axes` limitation (`tests/diag/test_axes.py:148`). Log kept: `outputs/ch00/verify/fluidpy_full_suite_rwm_v2_2026-10-29.log` (local, ignored). The run includes the data-scout's uncommitted `tests/data/test_coops.py` changes. |
| AOFD repo suite | `.venv/Scripts/python.exe -m pytest tests -q -p no:cacheprovider` | **35 passed, 1 skipped** in 39 s |

Disk: before C: 70 GB / G: 521 GB free; after C: 69 GB / G: 521 GB free. No downloads (all data already on G: or in
`data/derived/ch00`); nothing evicted.

## Verdict: PASS (with two proven defects open as strict xfails)
Every new function has ≥ 2 independent levels with at least one of V1/V2/V3/V5 (most have V1 + V5 or V1 + V2), every
movie-called function is covered, both suites are green, mutation 71/71. Not PASS-blocking but must be fixed before a
frame relies on them: **D1** (`+SHRA` → 82 instead of 81; no current frame shows +SHRA) and **D2** (seam col at
lon 360.0; the s20 frame is regional, not affected). RM83/RM84 stay unverified until GEFS members exist (Open item 3).
The orchestrator may treat D1 as blocking for `metar_wx_to_ww` if any +SHRA station enters a frame.
