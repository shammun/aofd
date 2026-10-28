# Chapter 0 library verification — reading weather maps (#69), vectors 1a/1b, cross product #2, dot product 0.1b      2026-10-28

AOFD at `9e9ac20` (+ uncommitted movie work); fluidpy at `a1ed4f0` (Batch A WIP `801a3e4`, Batch B `cd72c50`,
Batch C `a1ed4f0`) + **uncommitted tests** (nothing committed by the verifier). Verifier: math-verifier agent. Plans:
`movies/ch00/ch00_reading_weather_maps/data_needs.md` (F1–F5, F10, RM rows), `movies/ch00/ch00_vectors_index_notation/data_needs.md`
(F1–F3, F5, F6), `movies/ch00/ch00_alternating_tensor_triple_products/data_needs.md` (F4),
`movies/ch00/ch00_cross_product/data_needs.md` (F1–F4, T1/T2), `movies/ch00/ch00_dot_product_v01b/data_needs.md` (S1/F1).

## Environment
Python 3.12.1 · numpy 2.5.4 · scipy 1.18.1 · sympy 1.14.0 · pyproj 3.8.0 (PROJ 9.8.1) · MetPy 1.7.1 (AOFD `.venv`,
fluidpy editable). pyproj is not in `../Fluid Dynamics/.venv`: every pyproj test is guarded by `importorskip`.

## Equations checked on the page images
| Equation | Page (pdf / printed) | Matches the code |
|---|---|---|
| §2.2.2 (δx, δy, δz) = (r cos ϑ δλ, r δϑ, δr); (2.27) Dϕ/Dt in spherical coordinates; (2.31) ∇ϕ | p081 / 61 | yes (`sphere.arc_lengths`, `sphere.gradient`, `diag.advection`, `terrain.surface_normals` metric) |
| (2.50c) 0 = −(1/ρ) ∂p/∂z − g; (2.51) shallow D/Dt | p085 / 65 | yes (`omega_to_w`) |
| §2.6.2 ω ≡ Dp/Dt, (2.144) | p099 / 79 | yes |
| (2.198) f u_g = −(1/(ρa)) ∂p/∂ϑ, f v_g = (1/(aρ cos ϑ)) ∂p/∂λ, f = 2Ω sin ϑ; Fig. 2.5 (anticlockwise round a low for f > 0) | p109 / 89 | yes (`geostrophic_wind_from_msl`) |
| (18.14) p = ρR T = ρR^d T_v; (18.15) T_v = T[1 + q(1/ε − 1)] ≈ T(1 + 0.61q) | p696 / 676 | yes |
Map projections, station codes, hillshade and pattern correlation are not Vallis equations (Snyder 1987; WMO-No. 306;
Esri/Horn; Taylor 2001 — see `reference/ch00/SOURCES.md`).

## Test files (fluidpy) and counts
| File | Tests (functions) | Status |
|---|---|---|
| `tests/geo/test_sphere.py` | 26 | WIP file completed; 5 `allclose` calls tightened (default atol 1e-8 swamped 1e-7 gradients) |
| `tests/geo/test_mapproj.py` | 19 (+ parametrised: 39 cases) | WIP file, unchanged |
| `tests/diag/test_station.py` | 25 (+ parametrised: 93 cases, 1 strict xfail) | + 3 real-data tests (669 METARs, 263 SYNOPs, RM27 isobars), + 4PPPP ≥ 1050 hPa case |
| `tests/diag/test_axes.py` | 11 (1 strict xfail = documented limitation) | + real ERA5 z500 test; curvature test tightened (atol 0) |
| `tests/geo/test_atmos_1a.py` | 11 | new (Batch B) |
| `tests/geo/test_vectors_1a1b.py` | 10 (1 strict xfail = docstring bug) | new (Batch B) |
| `tests/diag/test_advection.py` | 7 | new (Batch B) |
| `tests/diag/test_monthly_anomaly.py` | 5 | new (Batch B) |
| `tests/geo/test_polygon_laea.py` | 9 | new (Batch C) |
| `tests/geo/test_terrain.py` | 7 (+ parametrised: 10 cases) | new (Batch C) |
| `tests/diag/test_pattern_correlation.py` | 4 | new (Batch C) |

## Validation table

### Batch A — reading weather maps
| Id | Function | Evidence (V-levels) | Numbers | Label |
|---|---|---|---|---|
| F1 | `sphere.unit_vector`, `parallel_points`, `meridian_points`, `wrap_lon` | V1 axes/norm/inverse map; V1 parallel radius a cos ϑ, meridian coplanar; V7 wrap round trip on 14 401 values | 1e-14–1e-15 | analytic, limit |
| F1 | `sphere.arc_lengths` | V1 RM01/RM02; V2 sympy \|∂r/∂λ\| = a cos ϑ, \|∂r/∂ϑ\| = a, orthogonal | 111.19 / 73.84 / 55.60 / 0.00 km per degree | analytic, symbolic |
| F1 | `central_angle`, `great_circle_distance`, `initial_bearing`, `destination_point`, `great_circle_points`, `great_circle_vertex` | V5 pyproj.Geod (sphere) 500 random pairs; V1 haversine written in the test; V1 Clairaut vertex + dense max; V1 cardinals | distance rel < 1e-10; bearing < 1e-9°; destination < 1e-9°; npts < 1e-9°; NY–Tokyo 10 850 km, vertex 69.8° N | analytic, benchmark |
| F1 | `isometric_latitude`, `rhumb_line` | V2 sympy dψ/dϑ = sec ϑ; V1 meridian/equator/parallel limits; V1 straight on Mercator (residual < 1e-12); V3 chord sum → distance, order 2.00 ± 0.15 | RM09 12 788 / 10 850 / 1 938 km | symbolic, analytic, converged |
| F1 | `polygon_area` | V1 octant πa²/2; V5 pyproj polygon_area_perimeter (60 random polygons, rel < 1e-9); V1 polar cap 2πa²(1 − sin ϑ); V3 cap and lat–lon cell order 2 | | analytic, benchmark, converged |
| F1 | `sphere.gradient` | V1 sin ϑ and λ fields; V3 order 2 on global and regional grids; V7 pole NaN, periodic detection, roll, shape | | analytic, converged, limit |
| F2 | `mapproj.forward` (6 projections) | V5 PROJ for 11 parameter sets (< 1e-6 m); V5 gores per lobe vs PROJ sinu; V2 sympy Mercator y, conformality; V3 Mercator y vs Simpson of a sec ϑ, order 4; V7 lon_0 shift, aliases, south = mirror of north, LCC tangent limit | RM07 y/a = 3.1313 at 85° | benchmark, symbolic, converged, limit |
| F2 | `scale_factors`, `tissot_ellipses`, `equal_earth_coefficients` | V5 PROJ get_factors (11 sets, rel < 1e-7, ω < 1e-5°); V1 Mercator sec ϑ, plate carrée, LCC k = 1 on both parallels, stereographic k; V2 sympy Equal Earth Jacobian ≡ 1 for any coefficients; V1 Tissot widths exact; V7 width/height → k/h at O(r²) | RM04, RM06 (2, 2, 4), RM10 ω = 57.7° at 60° N 150° E, RM11 (0.933, 1, 1.866), RM12 (1.018, 0.985, 1.022) | benchmark, analytic, symbolic, limit |
| F3 | `decode_metar`, `describe_weather` | V1 Brest 00/01 UTC table + ISD fields; **V5 IEM decoded columns for 41 LFRB + 669 US/Canadian reports** (speed, gust, direction, SLP exact; T/Td = RMK tenths exactly and ≤ ½ °F from IEM's whole-°F; QNH < 0.02 hPa); V5 MetPy on reports without "//////"; V1 MPS/KMH/VRB/SM/RMK forms | IEM's two "A302" reports are malformed (IEM returns 102 hPa); we return NaN and flag the group as unparsed | analytic, benchmark |
| F3 | `decode_synop` | V1 Brest 18/03 UTC table + ISD fields; V1 synthetic groups (m/s iw, 00fff, 4a3hhh, trace, calm, 910 ≠ 911, 4PPPP ≥ 1050); **V5 NCEI ISD decoding of 263 real SYNOPs** (T, Td, direction, SLP, station pressure exact; speed within ISD's 0.1 m/s storage step) | Ireland (039xx), Netherlands (062–063xx), Belgium (064xx) report m/s; ISD drops AAXX YYGGiw so the caller must pass `wind_unit` for those; the 8 SLPs ISD left blank agree with ERA5 within 2.3 hPa | analytic, benchmark |
| F4 | `barb_round`, `barb_parts`, `plot_pressure_code`, `decode_plot_pressure`, `tendency_code` | V1 15 edge cases (2.4999/2.5, 47.4999/47.5, 68.65 m/s → 135 kt); V1 dense sweep 0–300 kt structure; V1 every tenth 950.0–1049.9 round trip; V1 code table 0200 (9 rows) | RM20, RM21, RM25 | analytic |
| F5 | `interpolate_stations`, `interpolate_isobars` | V1 linear field exact (< 1e-9 hPa) and straight contours; V7 midpoint rule RM27; V1 closed loops around a low (halfway on every spoke); V1 vs matplotlib.tri (independent Delaunay + linear, < 1e-9); V7 max_edge gap; **V5 real 03 UTC SYNOPs: RMS(decoded SLP − ERA5) = 0.87 hPa ≤ 1.5 (RM27)**; vertices on the TIN < 1e-9 | 214 stations | analytic, limit, benchmark |
| F10 | `zonal_extrema`, `trough_ridge_axes` | V1 troughs/ridges of a wave (< 2e-4°); V3 parabola vertex order 3.0 ± 0.25; V1 grid curvature exact (now atol 0); V1 axis lengths a Δϑ; V1 tilted axis; V7 smoothing, shift (whole and sub-grid), chaining break; V7 real z500: regional cut = global interior; data RM19 | z500 12 UTC 2 Nov: one trough axis 40–55° N at 4.9–6.8° W south of 48.5° N, bending to ≈ 0° at 50–55° N | analytic, converged, limit |

### Batch B — movies 1a / 1b
| Id | Function | Evidence (V-levels) | Numbers | Label |
|---|---|---|---|---|
| F1 | `atmos.omega_to_w` | V1 closed form on 500 random states (rtol 1e-14) and the movie number; V2 sympy derivation from ω ≈ w ∂p/∂z, (2.50c), (18.14)–(18.15); **V5 MetPy `vertical_velocity` (rtol 1e-12 with MetPy's constants; 3.7e-5 with ours = exactly the R_d/ε difference)**; V2 pint; V7 sign, q = 0, T_v factor, broadcasting | ω = −1 Pa/s, 850 hPa, 278 K → +0.0957 m/s | analytic, symbolic, benchmark, limit |
| F2 | `diag.advection` | V1 linear fields exact + warm-advection sign; V1 F = eastward/northward distance gives u / v (B.3.4); V2 sympy (2.27) truth and **V3 order 2.0 ± 0.15**; **V4 ∮ u·∇F dA → 0 for non-divergent u (order 2)**; V7 solid-body flow along contours → 0, u_g·∇p = 0, vertical term, λ shift, k × u rotation, N→S | ∇T = (−3.202, −2.494) K/100 km, u = (5.8, 33.5) → −1.02e-3 K/s = −3.68 K/h | analytic, symbolic, converged, conserved, limit |
| F3 | `vectors.components_in_axes` | V1 cardinals + the coast numbers; V1 field vs written dot products (25 bearings); V2 sympy e_across = k̂ × e_along, orthonormal, length; V7 length, b + 180, b + 360, rebuild, b + 90 | bearing 80°: (11.5, 32.0) | analytic, symbolic, limit |
| F4 | `vectors.volume_flux_parallelogram` | V1 curtain 1e9 m³/s (sign by edge order); V1 = det; V1 \|u\|A cos; V2 sympy ε_ijk form; V2 pint; V7 parallel window, antisymmetry, shear, linearity | | analytic, symbolic, limit |
| F5 | `atmos.geostrophic_wind_from_msl` | V1 p linear in ϑ / λ exact (round-off floor 8ε\|p\|/(ρ₀ f a Δϑ)); V2 sympy (2.198) truth and **V3 order 2.0 ± 0.15**; V2 pint; V7 equals `geostrophic_wind_from_height` on Z = p/(ρ₀g₀) in float64 (< 3e-11 m/s) and the float32 gap reproduced (1e-4 < gap < 0.1 m/s); V7 cyclonic both hemispheres, NaN bands, ∝ 1/ρ₀; V7 ERA5: 10-m wind turned toward low pressure | ERA5 12 UTC 2 Nov 2023 over sea: median turn +16.3° (25–65° N), −14.9° (25–65° S); median \|u₁₀\|/\|u_g\| 0.71 / 0.69 | analytic, symbolic, converged, limit |
| F6 | `climatology.monthly_anomaly` | V1 constant → 0; V1 trend + seasonal + spatial → s (Y − 2005.5); V1 vs xarray `groupby("time.month")` (independent route); V1 daily input weighted per year (pooled weighting differs, so the test discriminates); V1 vector anomaly component-wise; V7 base-mean year, missing years, NaN, Series = DataArray, errors | | analytic, limit |

### Batch C — cross product #2, dot product 0.1b
| Id | Function | Evidence (V-levels) | Numbers | Label |
|---|---|---|---|---|
| F1 | `vectors.polygon_signed_area`, `triangle_fan_areas` | V1 unit square ±1, triangle 6, regular 1000-gon, far-from-origin ring; V1 fan ¼ each from the centre and hand values from an off-centre hub; V1 Σ fan = area for 200 random hubs and rings; V2 sympy Green's theorem → shoelace; **V5 vs `sphere.polygon_area` of a 500-km circle projected with LAEA, convergence order 2 in n** | rel 2.3e-7 at n = 360 (plan: 2.5e-6); clockwise bearings → negative area | analytic, symbolic, benchmark, converged |
| F2 | `mapproj.forward("laea")`, `scale_factors("laea")` | V1 centre → (0, 0), radius 2a sin(c/2), azimuth preserved; V2 sympy Jacobian = cos ϑ (equal area; exact for the polar aspect); V1 areal = a_max·b_min = 1; **V5 PROJ laea (4 centres, < 1e-6 m; get_factors rel < 1e-7)**; V7 errors, alias, antipode singular | see Open item 4 on "h·k = 1" | analytic, symbolic, benchmark, limit |
| F3 | `terrain.surface_normals`, `slope_aspect`, `sun_vector` | V1 planes exact for both stencils (+ N→S); V1 Horn stencil written in the test; V3 central vs analytic hill, order 2.0 ± 0.15; V1 compass aspects (rising east faces west, …); V1 sun vectors | flat ground: \|n_h\| < 1e-15 (round-off), aspect NaN | analytic, converged |
| F4 | `terrain.insolation_factor`, `hillshade` | V1 flat sin e; **sin(e + β) for an 18° south slope** (0.6202), sin(e − β) for a 19° north slope (0.0227), 0 beyond; V1 Duffie & Beckman cos θ on 200 random planes; **V5 Esri/GDAL hillshade algorithm transcribed from the Esri documentation, on a cone, 3 light directions (< 1e-12 off the apex)**; V7 flat, away, z_factor, errors | T2: flat 0.3474 (band 0.343–0.348), sunny 0.6202 (the band 0.55–0.62 misses it by 2e-4 — as the orchestrator noted, the formula is tested) | analytic, benchmark, limit |
| S1/F1 | `climatology.pattern_correlation` | V1 16/18 = 0.8889, ±1, 0, random vs written cosine; **V5 centred = `np.corrcoef`**; V1 integer weights = duplicated points; V1 cos ϑ weights vs written sum; V7 scale, sign, shift (centred only), NaN skip/propagate, flat → NaN, errors, xarray input | | analytic, benchmark, limit |

## Functions used by the movie builders — test names
| Function | Tests (file) |
|---|---|
| sphere.* (F1) | `test_sphere.py`: `test_unit_vector_V1_axes_and_norm`, `test_arc_lengths_V1_degree_lengths_RM01_RM02`, `test_great_circle_distance_V5_vs_pyproj_geod`, `test_initial_bearing_V5_vs_pyproj_and_V1_cardinals`, `test_destination_point_V5_vs_pyproj_and_V1_round_trip`, `test_rhumb_line_V1_straight_on_mercator_and_RM09`, `test_polygon_area_V5_vs_pyproj_random_polygons`, `test_gradient_V3_second_order_global_and_regional` … |
| mapproj.* (F2) | `test_mapproj.py`: `test_forward_V5_vs_pyproj[*]`, `test_scale_factors_V5_vs_pyproj_get_factors[*]`, `test_mercator_V2_y_closed_form_sympy_and_RM07`, `test_tissot_V7_ratios_tend_to_k_and_h_as_r_to_0` …; `test_polygon_laea.py`: `test_laea_V5_vs_pyproj`, `test_laea_V2_jacobian_equal_area_sympy` |
| station.* (F3–F5) | `test_station.py`: `test_decode_metar_V5_vs_iem_decoded_columns_669_reports`, `test_decode_synop_V5_vs_isd_decoded_fields_263_reports`, `test_barb_parts_V1_edge_cases_RM20_RM21[*]`, `test_isobars_data_synop_03utc_RM27` … |
| axes.* (F10) | `test_axes.py`: `test_zonal_extrema_V1_troughs_and_ridges_of_a_wave`, `test_trough_ridge_axes_data_era5_z500_ciaran_RM19` … |
| omega_to_w, geostrophic_wind_from_msl | `test_atmos_1a.py` (all 11) |
| components_in_axes, volume_flux_parallelogram | `test_vectors_1a1b.py` |
| advection | `test_advection.py` |
| monthly_anomaly | `test_monthly_anomaly.py` |
| polygon_signed_area, triangle_fan_areas, laea | `test_polygon_laea.py` |
| terrain.* | `test_terrain.py` |
| pattern_correlation | `test_pattern_correlation.py` |

## Convergence studies
| Scheme | Grids | Observed order | Design |
|---|---|---|---|
| `sphere.gradient` (global / regional) | 36–288 lon points | 2.0 ± 0.15 (asserted) | 2 |
| `rhumb_line` chord sum | 41–641 points | 2.0 ± 0.15 | 2 |
| `polygon_area` cap, lat–lon cell | 37–577 / 4–64 edges | 2.0 ± 0.15 | 2 |
| Mercator y vs Simpson quadrature | 16–256 intervals | 4.0 ± 0.25 | 4 |
| Tissot width/height → k, h | r = 800…100 km | 2.0 ± 0.25 | 2 |
| `zonal_extrema` parabola vertex | 5°–0.625° | 3.0 ± 0.25 | 3 |
| `geostrophic_wind_from_msl` vs sympy (2.198) | 72–576 lon points | 2.0 ± 0.15 | 2 |
| `advection` vs sympy (2.27) | 72–576 | 2.0 ± 0.15 | 2 |
| `advection` global integral (V4) | 72–288 | 2.0 ± 0.25 | 2 |
| `surface_normals` central vs analytic hill | 0.02°–0.0025° | 2.0 ± 0.15 | 2 |
| LAEA shoelace vs spherical excess (500-km circle) | n = 90–720 | 2.0 ± 0.15 | 2 |

## Conservation / invariant residuals
∮ u·∇F cos ϑ dλ dϑ / ∮ |u·∇F| for a non-divergent u: decreasing at order 2, < 1e-3 at 1.25° (V4). u_g·∇p with u_g from
the same p: at round-off. Equal-area: Equal Earth, gores and LAEA areal scale 1 within 1e-9 (finite-difference floor).

## Benchmarks used
All in `reference/ch00/SOURCES.md` (section "ch00 reading weather maps …", verified 2026-10-28): pyproj/PROJ 9.8.1
(Karney 2013; Snyder 1987), IEM python-metar decoded columns, NCEI ISD decoded fields, MetPy 1.7.1 (`parse_metar`,
`vertical_velocity`), ERA5 msl at stations, Esri "How Hillshade works" (WebFetch 2026-10-28), Taylor (2001) / numpy.

## Numbers from the text
No Vallis book values are involved (Chapter 0 movie numbers are our own planning numbers); no V6 rows.

## Figures reproduced with our code (local, `outputs/ch00/verify/`, made by the verifier's scratch script)
| Figure | File | Verdict |
|---|---|---|
| Tissot circles on Mercator / Equal Earth / LAEA (50° N) | `tissot_mercator_equalearth_laea.png` | Mercator circles grow poleward without distortion of shape, Equal Earth and LAEA keep their area but shear away from the centre — as the scale factors say. |
| Hand isobars through 214 decoded SYNOPs, 03 UTC 2 Nov 2023 | `isobars_synop_03utc_vs_era5.png` | Closed 956–968 hPa rings round the Ciarán low over the Channel with station-minus-ERA5 colours mostly within ±1 hPa; a few open isobar ends at the 300-km triangle cut are expected. |
| ERA5 z500 with trough/ridge axes, 12 UTC 2 Nov 2023 | `z500_trough_ridge_axes.png` | The trough axes follow the lowest heights through the cut-off low and the trough south-west of it, ridges sit on the height maxima; the 40–48° N trough lies at 5–7° W and bends to the low centre further north. |
| Angle from u_g (msl) to u₁₀ over the sea | `geostrophic_vs_10m_turning.png` | Two clean, opposite-signed peaks (NH +16°, SH −15°): the surface wind is turned toward low pressure in both hemispheres. |
| Hillshade of a cone; sunny/flat/shady Lambert factors | `terrain_hillshade_insolation.png` | The north-west flank is brightest for light from the north-west; the curves are sin(e + 18°), sin e and max(sin(e − 19°), 0) with the 21 Dec noon line at 20.3°. |

## Mutation check (scratch copy of `fluidpy/`, never the library)
71 wrong variants, one at a time (`…/scratchpad/mutate.py`). **First pass: 67 of 71 caught.** Missed, and fixed in the
tests (each then caught):
* A1 (∂²F/∂x² without cos ϑ in `axes.zonal_extrema`): the curvature V1 test used `np.allclose` with the default
  atol = 1e-8 on values ~1e-13 m⁻² — it compared nothing. Now atol = 0 (and five similar `allclose` calls on 1e-3…1e-7
  magnitudes in the sphere and advection tests were tightened the same way).
* T5 (4PPPP thousands threshold 100 → 50): no test had SLP ≥ 1050 hPa; a 1060.0 hPa case was added.
* B6, B7 (equator mask; f-plane at 45° in `geostrophic_wind_from_msl`): the mutation pattern also matched
  `geostrophic_wind_from_height`; re-targeted — both caught.
* C3 (fan hub y taken from x₀): the only per-triangle test used a hub with x₀ = y₀; an off-centre hub was added.
**Final full re-run after the test fixes: 71 of 71 caught.**

Caught variants include: missing cos ϑ (arc lengths, k, gores, curvature, east edge, v_g), ½ factors (ψ, Mercator y,
fan), bearing atan2 order, central angle complement, polar-cap side, PROJ stencil weights, stereographic y sign and k₀,
LCC n sign, Equal Earth derivative coefficient, barb rounding half-to-even, pennant = 100 kt, plot-pressure threshold,
SYNOP sign digit, dd offset, inHg constant, tendency sign, isobar midpoint shortcut, km/h, 910/911 swap, barycentric
weight, RMK T sign, parabola offset/value sign, trough/ridge swap, chain limit, T_v with (1 − ε), ω→w sign, density
ignoring q, u_g sign, mask width, f-plane, bearing as math angle (both senses), active vs passive rotation, flux edge
order, u/v swap, vertical term sign, seam-as-edges, pooled vs per-year climatology, inclusive base end, anomaly sign,
LAEA k′ (×2, stereographic), LAEA y sign, normal into the ground, Horn /4 and even padding, aspect math angle, sun
azimuth as math angle, unclipped |ŝ·n̂|, unweighted centring, cos of degrees, wrong norm.

## Deviations & justifications
* `axes.py` `# DEVIATION` (zonal minimum of the smoothed field instead of Knippertz's box trough parameter; km chaining
  limit): accepted — for a sinusoidal wave both give the same axis (V1 tests), and the E–W-trough limitation is pinned
  by a strict xfail.

## Defects found (library not edited; reported for the implementer)
1. **`station.interpolate_stations` (known, strict xfail since the WIP):** hull stations return NaN at their own
   position (86 of 3000 stations over 50 random networks) — the query x is wrapped relative to lon₀, the triangulation
   relative to lon[0]; hull points land ~1e-9 m outside. Docstring promises exact values at the stations.
2. **`vectors.volume_flux_parallelogram` docstring sign (new, strict xfail `test_volume_flux_docstring_side_claim`):**
   "u·(q × p) with q up counts flow to the right of p (looking along p) as positive" — ẑ × p points to the **left** of
   p (up × east = north), so flow to the right gives a negative flux. The code is right; the sentence must say "left"
   (or swap to `(u, p, q)`). A movie that follows the sentence would draw the wrong side.
3. **Stale docstrings:** 51 "Validation (planned)" lines across the nine modules; the LAEA line says "V4 laea areal
   scale h·k = 1" (h·k = 1 is false for the oblique aspect, see Open item 4; and an areal-scale identity is V1, not V4).
4. Minor (no test fails): `decode_metar` returns `wind_dir = 0.0` for a calm "00000KT" (IEM and `decode_synop` give
   no direction); consider NaN for calm, as the docstring's "NaN if variable/missing" suggests.

## Open items
1. Defect 1 above (`interpolate_stations` hull NaN) — implementer fix; the strict xfail will then flip and must be
   removed.
2. Defect 2 above (flux docstring "right" → "left") — implementer fix; the strict xfail will then need rewriting as a
   passing test of the corrected sentence.
3. Docstring "Validation (planned)" → achieved levels for all functions in this report (implementer / knowledge-keeper).
4. data_needs `ch00_cross_product` F2 says "V4 scale_factors h·k = 1" for LAEA: true only for the polar aspect; the
   oblique LAEA centred at 52.5° N has h·k up to > 1.5 off the central meridian (meridians and parallels are not
   orthogonal on the map). The tested invariant is areal = a_max·b_min = 1. Movie text should say "equal area", not
   "h times k is one".
5. RM19 ("trough axis 55° N → 40° N at 5.5° W"): on the 12 UTC 2 Nov z500 the axis is at 4.9–6.8° W only south of
   48.5° N; north of 49° N it bends east to ≈ 0° (the cut-off low). The movie should not draw a straight 5.5° W line
   to 55° N.
6. T2 band "sunny 0.55–0.62" excludes the exact 18° south slope value 0.6202 (2e-4 above); widen the band or quote the
   formula (orchestrator already noted this).
7. SYNOPs from ISD carry no iw: for Irish, Dutch and Belgian stations the builder must call
   `decode_synop(…, wind_unit="m/s")` (or use ISD's decoded speed), or speeds are 1.94× too small.

## Suites
* Batch files (11 files above), AOFD `.venv`, from `../Fluid Dynamics`: **223 passed, 3 xfailed** (strict xfails:
  `interpolate_stations` hull defect, flux docstring defect, documented E–W-trough limitation of `trough_ridge_axes`).
* **Full fluidpy suite** `.venv/Scripts/python.exe -m pytest -q -n 8 tests`, run from `../Fluid Dynamics`:
  **2709 passed, 3 xfailed, 4 warnings in 1109 s** (exit 0; the 3 xfails are the ones above).
* **AOFD suite** `pytest -q tests`: **35 passed, 1 skipped** (`test_maptools.py` slow case, needs `AOFD_MAPTOOLS=1`).
* Library untouched: `git status fluidpy/` clean; mutations only in the scratch copy.

## Verdict: PASS (with defects reported)
Every function in Batches A, B and C has at least two independent evidence levels (at least one V1/V2/V3/V5), all
tests pass in both repos, the mutation check catches 71 of 71 variants. Two library defects are pinned by strict
xfails and listed in Open items 1–2 (one wrong hull value in `interpolate_stations`, one wrong side word in a
docstring); neither changes a number the movies use if the builder follows Open items 4–7.
