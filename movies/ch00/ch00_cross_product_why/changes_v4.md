# ch00_cross_product_why — v4 re-plan: what changes and why

Draft written 2026-10-27 into `movies/ch00/ch00_cross_product_why/v4_draft/` (`storyboard.yaml`, `script.md`, this
file). The live `storyboard.yaml` / `script.md` (v2/v3 source, commit 19628fa) are untouched while v3 renders.
Source of the review: `reports/ch00_cross_product_user_notes_v2.md` (UV2-01 … UV2-31 + the cut-away note).

**Measured, not estimated.** `tools/tts.py` dry runs on 2026-10-27, spliced (G:, `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_cross_product_why/dryrun/v4draft_merged`: the full run `v4draft_a` of the 69-scene draft + the patch run `v4draft_b` that measured the restored s22b and the reworded s45 sentence 2 on their own, same voice and gaps; input `v4_draft/script.md`, the current `movies/lexicon.yaml`): **71 scenes, 496 sentences, 7218 words, 2892.750 s narration + 2.5-s silent end-card hold = 2895.250 s (48:15.2)**; speech alone 2687.4 s = 161.2 words per minute while speaking, **149.6 words per minute overall** (limit 150); 716 caption cues; self-check {'expected_s': 2860.3, 'audio_s': 2860.3, 'diff_ms': -0.0, 'len_ok': True, 'cues_ok': True}; Kokoro render 1243.5 s; warnings: ['s40a_k_cross_gradp s4: 17.0 chars/s > 17.0 (slow the speed or shorten)'].

**After the dry runs:** the one caption warning (s40a S4, 17.0 characters per second) was fixed by shortening that sentence to "Looking along this new arrow, the low is on its left, and the high is on its right." (about 1 s shorter, not re-measured; the builder's final TTS measures it). The self-check line above is the full run's (2860.3 s); the patch run's self-check was also 0.0 ms.

## 1. Decision changes against the brief

- **U-CP.4 overridden (user, 2026-10-27).** The movie now derives v = Ω × r (s25a–s25b), −2Ω × u (s26a–s27a: the two
  equal Ω × u pieces and the minus; the centrifugal term kept out in one sentence) and −2Ω × u → −f k × u component by
  component (s28a–s28c). The "it gets its own video later" sentence is gone.
- **The "why" of the cross product is a section of its own** (s09a, s18a–s22e), built like the dot-product movie's
  "three reasons": the sine is the *part across* (the dot product used the part along); sliding b along a changes
  nothing; only the part across turns things (torque); the arrow is the *normal* of the plane, its length the area;
  physics examples with what a, b and a × b mean each time; why a push at right angles turns without speeding up.
- **Geostrophic section re-sequenced** on one round low with four isobars, one equation per step, the balance argued
  in words before the maths, and checked with numbers (s39–s44).
- **Storm Ciarán** is shown on a true-colour satellite image of 2 Nov 2023 with country and region borders; the
  analysis time moves from 00 UTC to 12 UTC so the isobars match the picture (s45–s46).
- **Global rules applied:** every numeric vector drawn carries its components on screen (UV2-08); no back-reference to
  the earlier video for simple things (UV2-09; kept only for the approved link in s02 and the shadow callback in s09 /
  s18b); every map or globe uses the daytime Blue Marble texture at full brightness (UV2-14).

## 2. UV2 item → scene(s) → what changes

| # | Scene(s) (v4 ids) | What changes |
|---|---|---|
| UV2-01 | s00_title | The spoken sentence is the user's wording verbatim ("…learn about the cross product, and see how this is used in meteorology to explain why the wind turns and why storms spin."); the title screen itself is unchanged; the "made easy" pulse moves to "learn about" |
| UV2-02 | s01_hook | "…why it's built the way it is…" verbatim |
| UV2-03 | s02_dot_recall | Dashed component legs on the plot: a = 5 along x, 1 up; b = 1 along x, 3 up, each labelled (54 px), from the sentence that names them to the end of the scene |
| UV2-04 | s03_door | Door re-framed (target and distance), `r` label placed against the projected door edge and a 40-px canvas margin; frame self-check at every sentence start |
| UV2-05 | s05_axes | Component legs and labels from the scene's first frame (before the camera tilt); the 3-component display (v2 2:35) unchanged |
| UV2-06 | s06_recipe | "The answer is an arrow… Each one has a recipe." replaced by: "Since the answer is an arrow, we need to know how far it reaches along x, along y and along z: its three components." + slot words 'along x/y/z' on screen; ends "We'll soon see why it's built like this." (answered in s09a) |
| UV2-07 | s07_worked | 'a = (5, 1, 0)' and 'b = (1, 3, 0)' fixed top left of the maths zone for the whole scene; legs on the figure; the calculation unchanged |
| UV2-08 | global; s01, s02, s05–s10, s14, s15, s17, s18, s20–s22c, s22e, s23, s23a, s24, s25a, s25b, s28a, s28b, s29, s30, s31, s44 | Every numeric vector drawn has its components on screen (tip label or under the picture): a, b, a × b, p, q, r, F, τ, L, p, kicks, u, k, k × u, Ω (Earth axes and local), r = (4505, 0, 4505) km, v = (0, 329, 0) m/s, ∇p, k × ∇p, the two pushes. Unitless sketches (door, s04 wind, proton) carry no numbers and say so in `exaggeration` |
| UV2-09 | s08_sine (and s09, s18, s39) | |a| and |b| computed on screen by Pythagoras with brackets and links (√26 ≈ 5.099, √10 ≈ 3.162); θ from cos θ = 8 / (5.099 × 3.162) ≈ 0.496; "from the last video" gone; "we did the same for the dot product" (s18) and "we did the same with temperature in the last video" (s39) dropped |
| UV2-10 | s09a_box_proof, s18a_why_question, s18b_across_part, s18c_slide, s20_torque (moved, rewritten), s22a_plane_normal, s22b_component_shadows, s22c_angular_momentum, s22d_moving_charge, s22e_perp_push, s19_grid (moved, updated), s47_recap | The new "why" section. **s09a** why 5×3 − 1×1 *is* the area (box 6 × 4 = 24 minus 5 + 3 + 2 = 14; with letters everything cancels except a₁b₂ − a₂b₁). **s18a** asks the user's questions out loud. **s18b** b split into the part *along* a (1.57) and the part *across* (2.75 = |b| sin θ); |a × b| = |a| × across = 5.1 × 2.75 ≈ 14 — the exact parallel of the dot product. **s18c** slide b's tip along a to (6, 4): area and a × b stay 14 (5×4 − 1×6). **s20** only the part across turns a bolt: torque = lever arm × part across (15, 7.5, 0 N·m with F = (0, 50, 0), (43.3, 25, 0), (50, 0, 0) N). **s22a** why perpendicular: a turning or a sweep happens in a plane; a plane is named by its normal; length = how much (area), direction = which plane and which way round; the area lies flat, the arrow is its label — answers "if the length is an area, why does it point up/down?". **s22b** (restored) each component is the area of the parallelogram's shadow on the wall that leaves that direction out — why each component "leaves out its own direction"; ours lies flat, so the wall shadows are 0 and only 14 is left. **s22c** angular momentum L = r × p (r = (0.5, 0, 0) m, p = (0, 6, 0) kg m/s → (0, 0, 3)); the string pulls along r so it cannot change the spin. **s22d** force on a moving charge F = q v × B (east × up = south), always ⟂ v: bends the path, never changes the speed. **s22e** why a push at 90° only turns: 1 kick → 10.05 m/s, 10 kicks → 10.005, 100 kicks → 10.0005; continuous ⟂ push → circle, push · u = 0, no work. (Ω × r on a spinning body is the Earth case, s25a–s25b.) |
| UV2-11 | s18_cases | 'p = (3, 0, 0)' on the big p and '(3, 0, 0)' on each of the three copies |
| UV2-12 | s22_door_again | As UV2-04 (same Door3D fix) |
| UV2-13 | s23_k_cross | "Think of k as an axle standing at that place: turning on a map happens around it." + an axle cylinder with a turning arc round it; the 90° arc is drawn round the axle |
| UV2-14 | s23, s23a, s24, s28b, s29, s31, s32, s35, global | Cause (data-scout): the v2 s23 crop was 94 % unlit deep ocean shown at 25 % opacity. s23 now uses `data/derived/ch00/bmng_patch_s23_biscay_45N_0p5E.jpg` (37–53°N, 10.81°W–11.81°E: France, Biscay, Iberia, S England) at opacity 0.6–0.8; every globe uses the daytime Blue Marble NG at full brightness (no veil, no night side); streaklines get a 1-px dark edge |
| UV2-15 | s23_k_cross, s23a_why_turn | "For a wind blowing east, north is exactly the direction ninety degrees to its left" with a stick figure facing downwind; s23a: k × u "names the direction straight to the wind's left, with the wind's own size" |
| UV2-16 | s23a_why_turn, s22e_perp_push, s30_coriolis_size | Why exactly 90°: Earth's spin pushes moving air always at a right angle (like the magnet on the proton); a push 30° off would have a part along the wind and change its speed (contrast case drawn); so we need exactly a quarter turn times a strength; the wind is bent a little at a time, never snapped by 90° (struck ghost); s30 "without changing its speed" |
| UV2-17 | s23a_why_turn, s40a_k_cross_gradp, s29 | Who needs a left turn: the Coriolis push (−f k × u, the left tool with a minus → right in the NH) and weather maps, where k × ∇p turns "the direction in which pressure rises into the direction the wind blows" (preview sketch in s23a, full use in s40a) |
| UV2-18 | s23a_why_turn | Why a product that rotates: it writes "the direction to the left of the wind, same size" in one symbol, which is exactly the form of the Coriolis push (push = strength × k × u) |
| UV2-19 | s24_spin (and every globe) | Axis, Ω and texture share one tilted parent; axis ends at (0, ±1.35, 0) so it leaves the sphere exactly at the texture's poles; depth test on, so no dashes are drawn over the globe; a 3-D selftest row asserts ≤ 2 px between the texture's poles and the axis–sphere intersections at every keyframe (N14) |
| UV2-20 | s25a_position_vector (new), s25_ground_speed (rewritten), s25b_direction (new) | Position vector explained (centre → place, length 6371 km, direction out through the place, components (4505, 0, 4505) km at 45°N). Speed derived: circle of latitude, centre on the axis, radius = |r| sin θ ≈ 4505 km, distance 2π × radius per turn of 2π/Ω → speed Ω |r| sin θ = |Ω × r|; direction east ⟂ to Ω and r (right hand) ⇒ v = Ω × r; recipe with numbers → (0, 329, 0) m/s; 465 m/s at the equator, 0 at the poles. **Cut-away redesigned**: a clean half-Earth cut along the meridian plane through the place, the axis and r drawn *on* the flat face (HalfEarth3D) — no quarter wedge, no "heart" |
| UV2-21 | s28a_local_axes (new) | Still 3-D: east, north, up (= k) at 45°N; "Omega isn't a fourth direction": it lies in the north–up plane and splits into Ω cos φ (north) + Ω sin φ (up), both 5.16 × 10⁻⁵ s⁻¹ at 45°; Ω = (0, Ω cos φ, Ω sin φ); pole: all up; equator: all north |
| UV2-22 | s26_coriolis_effect, s26a_merry_go_round, s26b_two_views, s26c_carried_arrow, s26d_new_ground, s27_coriolis_term, s27a_minus_check | −2Ω × u derived on a merry-go-round: outside velocity u + Ω × r; piece ① the arrow u carried round (Ω × u), piece ② the floor's speed changes under the moving ball (Ω × u), piece ③ Ω × (Ω × r) (centrifugal); Newton outside → du/dt = real pushes − 2Ω × u − Ω × (Ω × r); the 2 = two equal pieces, the minus = moved to the rider's side; centrifugal absorbed into gravity (one sentence). "Push per kilogram = acceleration" defined. Visual check: closed-form path (turntable_puck) vs the integrated rider's equation land on top of each other (gap ≈ 3 × 10⁻¹¹ m) |
| UV2-23 | s28b_components (new), s28_f (rewritten) | Ω × u by the recipe, one component per sentence: (−Ω sin φ v, Ω sin φ u, −Ω cos φ u); f = 2Ω sin φ defined from the up part with its picture (pole spins about up at full rate, equator not at all) and its value at 45° (1.03 × 10⁻⁴ s⁻¹); SH negative |
| UV2-24 | s28c_flat_part (new), s29_turn_rule | First two components = Ω sin φ (−v, u, 0) = Ω sin φ k × u (k × u computed by the recipe on screen); vertical part ≈ 1 × 10⁻³ m/s² vs g ≈ 9.8 (about 10 000 × smaller) → dropped; result −2Ω sin φ k × u = −f k × u. s29 no longer repeats the result |
| UV2-25 | s31_globe_paths, s26, s25a | Start points over land (data-scout): 45.0°N 0.5°E (Dordogne, near Bergerac; loop 43.23–45.00°N, 0.78°W–1.72°E) and 45.0°S 69.5°W (Chubut, Patagonia; loop 43.23–45.00°S, 70.78–68.28°W): the whole 97-km-radius loops stay on land; paths.json starts change from [45, −30] / [−45, −20] to [45.0, 0.5] / [−45.0, −69.5]; patches `bmng_patch_s31_dordogne_45N_0p5E.jpg`, `bmng_patch_s31_chubut_45S_69p5W.jpg`; borders and place keywords |
| UV2-26 | s31_globe_paths | Physics re-checked: NH launched east turns right → south, clockwise loop seen from above; SH → north, anticlockwise (planning run: first-hour Δlat −0.060° / +0.060°). New CHECK projects the first 2 h of each track through the *actual camera* and asserts the screen-space turning sense, so a mirrored camera or flipped longitude cannot pass; the narration now says "towards the south" / "towards the north" |
| UV2-27 | s33_trades | Narration and arrows re-checked (NH air heading south turned right → west, blows from the NE; SH heading north turned left → west, from the SE). Last sentence now says both components: "…lean towards the west, and towards the equator" — checked on the data (P1 annual means at 15°N: v −3.1 Atlantic, −2.0 central Pacific; at 15°S: +1.0 Atlantic, +1.5 east Pacific, +3.2 Indian m/s; u < 0). The "let's fly" sentence folded into the camera move; heading-quadrant and screen-west CHECK rows (N19) |
| UV2-28 | s29, s33, s34, s38, s19 | Repeated reminders dropped: s29's restated result, s33's fly-over sentence, s34's "This is a simple picture" + separate closing merged into one sentence, s38 shortened to 6 sentences; one cross-product tie kept where it helps (s38 measures the spin with r × u) |
| UV2-29 | s39_isobars, s40_pressure_push, s40a_k_cross_gradp (new), s41_adjust, s41a_balance (new), s42_geo_equation, s43_geo_pieces, s44_geo_numbers | One round low, four isobars drawn one at a time; a pin south of the low. ∇p points away from the low (towards higher pressure), the push −(1/ρ)∇p towards the low; k × ∇p = ∇p turned left = along the isobars (s40a); the adjustment told slowly in a close-up; **why the balance**: steady → pushes add to zero → equal and opposite → Coriolis push towards the high → the wind (its quarter turn right) blows along the isobars, high on the right (s41a, in words); then the maths one move per line from "the pushes add to zero" to u = (1/(fρ)) k × ∇p (s42); numbers with components and a closing balance check (8.3 × 10⁻⁴ m/s² each way, s44) |
| UV2-30 | lexicon (see §6) | "geostrophic" fixed with a phoneme override; every hard word listed for an ear check |
| UV2-31 | s45_storm_map, s46_real_winds | Base map `data/derived/ch00/ciaran_modis_aqua_truecolour_2023-11-02.jpg` (MODIS Aqua, ≈ 13:20 UTC at the storm) with `ciaran_coast_10m`, `ciaran_borders_10m` / `ciaran_admin0_10m` and `ciaran_admin1_lines_10m` overlays; ERA5 isobars and 850 hPa geostrophic arrows at **12 UTC** (low at 52.5°N 1.75°E over East Anglia, under the cloud spiral). Narration: the image is "early in the afternoon of the second of November" and the isobars are "from the reanalysis at the same time"; s46 speaks no numbers (CHECK rows hold them) |
| cut-away | s25a, s25, s25b, s28a | The "heart" quarter-wedge is replaced by HalfEarth3D: Earth cut through the axis and the place, the axis inside on the flat face, r and the latitude arc on the face |

## 3. Section plan and durations (measured)

| Section | v4 scenes | Words | v4 measured | v2 measured | Δ |
|---|---|---|---|---|---|
| A. Opening, hook, why the dot product is not enough | 5 | 329 | 2:07.1 | 2:15.9 | -9 s |
| B. Building blocks: axes, recipe, worked example, sine, area, why the recipe is an area, right angles | 7 | 809 | 5:21.4 | 4:13.7 | +68 s |
| C. Right-hand rule, every way and direction | 7 | 625 | 4:05.8 | 4:31.2 | -25 s |
| D. Cases, then WHY (across part, slide, torque, door, normal, components as shadows, angular momentum, moving charge, perpendicular push), grid | 13 | 1429 | 9:25.9 | 4:00.9 | +325 s |
| E. The turning tool k × and why exactly 90° | 2 | 312 | 1:58.6 | 1:03.7 | +55 s |
| F. Spinning Earth: Ω, position vector, v = Ω × r derived | 4 | 487 | 3:19.2 | 1:39.5 | +100 s |
| G. Coriolis derived: merry-go-round, two Ω × u pieces, the 2 and the minus, computer check | 7 | 639 | 4:22.6 | 1:09.7 | +193 s |
| H. On Earth: Ω split, components, −f k × u, f, turn rule, size, globe loops | 7 | 722 | 4:54.4 | 2:26.8 | +148 s |
| I. Real winds: reanalysis, trades, westerlies | 3 | 303 | 2:02.3 | 2:12.6 | -10 s |
| J. Storms: Ian, Idai, spin measured with r × u | 4 | 364 | 2:31.5 | 2:49.9 | -18 s |
| K. Geostrophic: round low, ∇p, k × ∇p, adjustment, why the balance, the maths, numbers, Ciarán | 10 | 950 | 6:25.5 | 5:22.7 | +63 s |
| L. Recap and series end card (+ 2.5-s hold) | 2 | 249 | 1:40.8 | 1:39.7 | +1 s |
| **Total** | **71** | **7218** | **48:15.2** | **33:26.2** | **+889 s** |

## 4. New tested physics and data the builder needs

### 4.1 New library function (fluidpy)
| Name | What it computes | Where | Tests |
|---|---|---|---|
| `fluidpy.geo.frames.rotating_frame_path(t, x0, y0, u0, v0, Omega, centrifugal=True)` (I4) | Integrates the rotating-frame equation du/dt = −2Ω × u − Ω × (Ω × r) on a flat table (Vallis (2.12), §2.1; Kundu §4.7) with solve_ivp DOP853 | `../Fluid Dynamics/fluidpy/geo/frames.py` | V1 equals `turntable_puck(launch="rotating")` to 1e-8 m; V4 Jacobi integral; V7 Ω → 0 straight line; centrifugal=False equals `inertial_oscillation` with f = 2Ω. Fallback: builder-local solve_ivp + CHECK (the comparison already exists as `test_turntable_puck_V1_matches_rotating_frame_ode`) |

Everything else uses existing, tested functions: `fluidpy.geo.vectors.{cross, dot, norm, angle_between, projection,
scalar_projection, parallelogram_area, k_cross, triple_scalar}`, `fluidpy.geo.frames.{coriolis_parameter,
coriolis_horizontal, coriolis_acceleration_horizontal, inertial_circle, inertial_oscillation,
inertial_oscillation_sphere, turntable_puck, to_inertial_lon, great_circle}`, `fluidpy.core.rotating.{inertial_velocity,
rotating_basis, frame_acceleration_terms, coriolis_acceleration, centrifugal_acceleration}`, `fluidpy.core.gfd.{parcel_adjust,
geostrophic_velocity}`, `fluidpy.core.operators.gradient`, `fluidpy.geo.atmos.geostrophic_wind_from_height`,
`fluidpy.diag.trajectories.advect_on_sphere`, `fluidpy.diag.cyclone.storm_relative_wind`, `fluidpy.geo.constants`.

### 4.2 New builder data (`movies/data/build_ch00_cross_product_why.py`, CHECK rows in the manifest)
| Id | Scene | What | Key CHECK |
|---|---|---|---|
| N8 | s09a | box proof: six leftover polygons, 24 − 5 − 3 − 2 | shoelace sum 10; sympy letter identity |
| N9 | s18b, s18c | b split along/across a (1.569, 2.746); slide b + s a | along² + across² = 10; cross z = 14 for all s |
| N10 | s20 | torque along/across parts, F components | 0.3 × across = |τ| |
| N11 | s22c, s22d | L = r × p = (0, 0, 3); v × B direction (0, −1, 0); charge circle | string torque 0; speed constant |
| N12 | s22e | 1/10/100 perpendicular kicks: 10.0499, 10.0050, 10.0005 m/s; 5.71°–5.73°; continuous circle | each kick ⟂ velocity; circle speed 10 |
| N13 | s23a | 30°-off push split | along part = ½ |push| |
| N14 | s24 + all globes | axis/pole projection selftest | ≤ 2 px; axis hidden inside the sphere |
| N15 | s25a–s25b | r45 = (4504.98, 0, 4504.98) km; radius 4504.98 km; Ω × r = (0, 328.51, 0) m/s; 464.58 at 0° | cross = Ω|r| sin θ ŷ |
| N16 | s26, s31 | tracks from 45°N 1°E and 45°S 70°W | first-hour Δlat ∓0.0603°; all points over land; screen-space turning sense |
| N17 | s26a–s27a | merry.json: turntable paths (Ω = 0.5 rad/s, start (0, −2.8 m), 1.5 m/s), two views, carried arrow, new ground, terms, check paths | path right of motion; v_outside = U, V; tip velocity = Ω × u; floor change = Ω × u; gap < 1e-6 m |
| N18 | s28a–s28c | Ω local (0, 5.156e-5, 5.156e-5); Ω × u components; flat part | sympy identity; coriolis_horizontal = flat part of core.rotating.coriolis_acceleration; vertical/g = 9513 |
| N19 | s33, s34 | P1 v-component sector means, arrow headings | equatorward v at 15°N/S (Atlantic, Pacific); heading quadrants; west = screen-left |
| N20 | s39–s44 | round low (996 hPa + 1 hPa/100 km), pin at r = 1000 km, balance | isobar radii; ∇p = (0, −1e-3); k × ∇p along the isobar; pushes cancel |
| N22 | s22b | shadow areas of a tilted parallelogram; ours flat | projection areas = |components| (2, 2, 4); ours 0, 0, 14 |
| N21 | s45–s46 | Ciarán at 12 UTC on the satellite image | anticlockwise ring; 850 hPa within 10 % / 10° at the shown sea points; u10 crosses towards the low |

### 4.3 New data and imagery (via `fluidpy.data.fetch()` and the disk guard; credits in the storyboard/manifest only)
| Key | What | Scenes |
|---|---|---|
| **P4b — the one open data task** | ARCO-ERA5 0.25° z, u, v at 850 hPa, 2023-11-02 **12 UTC** (optionally 13 UTC for surface and 850 hPa, closer to the 13:20 overpass), 35–70°N, 50°W–15°E (the existing upper-air file stops at 06 UTC; the surface file already has 12 UTC: centre 955.9 hPa at 52.5°N 1.75°E) | s45, s46 |
| P6 (delivered, e20037e) | `data/derived/ch00/ciaran_modis_aqua_truecolour_2023-11-02.{jpg,json}`: MODIS Aqua corrected reflectance, GIBS daily mosaic, 35–70°N, 50°W–10°E, 0.02°, no gaps; ≈ 13:20 UTC at the storm; CC0 | s45, s46, s47 |
| P7 (delivered, e20037e) | `data/derived/ch00/ciaran_{admin0,borders,admin1_lines,coast}_10m.geojson`; Natural Earth 50m land polygons still needed by the builder for the s31 land CHECK and the s45 sea mask | s31, s45, s46 |
| P8 (delivered, e20037e) | daytime BMNG patches `bmng_patch_s23_biscay_45N_0p5E`, `bmng_patch_s31_dordogne_45N_0p5E`, `bmng_patch_s31_chubut_45S_69p5W` (.jpg + .json) | s23, s23a, s25a, s28b, s29, s31 |
| P5 (reuse) | Blue Marble NG topo+bathy (already on disk) at full brightness; crops for the map patches of s23, s23a, s28b, s29 (Bay of Biscay/France/Spain; Gulf of Guinea; Patagonia) | s23–s31 |

### 4.4 New composition pieces (motion-builder)
`HalfEarth3D` (meridian-plane half-globe with the axis on the face — replaces the heart cut-away), `LocalFrame3D`
(east/north/up + vector legs), `MerryGoRound2D` (outside / rider views, floor-velocity rings, carried-arrow ghosts),
`KickPolygon` (s22e), `SatMapPanel` (raster base + coastlines + admin borders + isobars + arrows), and two fixes:
`Globe3D` axis/texture parenting and depth (UV2-19, daytime texture UV2-14), `Door3D` label placement (UV2-04/UV2-12).

## 5. What was cut to stay under 50 minutes (nothing taught was removed)
- Wording tightened in about 40 scenes (two- and three-sentence merges); s17 lost its "from the side" beat (the rule is
  unchanged); s16 lost the "first/next" framing.
- s22b (each component as the area of a shadow on a wall) was cut in the first pass and is **restored** (orchestrator
  decision 2026-10-27; measured 32.1 s).
- The sine-values sentence (0 / 1 / 0) of v2 s08 is now said only once, in s18 with the cases.

## 6. Lexicon (UV2-30) — proposed changes to `movies/lexicon.yaml` (not applied here; the draft folder is the only write target)
Phonemes checked with Kokoro's own G2P (misaki + the espeak fallback, `.venv-tts`, 2026-10-27):

| Word | Now in the lexicon | Kokoro phonemes now | Proposed entry | Phonemes with the entry |
|---|---|---|---|---|
| geostrophic (spoken "jee-oh-STROFF-ick") | `"jee-oh-strof-ic"` | ʤˈiˈOstɹˈɑfˈIk — the "-ic" becomes a stressed "EYE-k": this is the mispronunciation the user heard | `geostrophic: "[geostrophic](/ʤˌiOstɹˈɑfɪk/)"` (or simply delete the respelling: misaki's dictionary already gives ʤˌiOstɹˈɑfɪk) | ʤˌiOstɹˈɑfɪk = jee-oh-STRAH-fik (American "o" in "stroff") |
| geostrophy | `"jee-oh-stroffy"` | ʤˈiˈOstɹˈɑfi (every syllable stressed) | `geostrophy: "[geostrophy](/ʤˌiOstɹˈɑfi/)"` (not spoken in v4) | ʤˌiOstɹˈɑfi |
| Coriolis | `"Cor-ee-oh-liss"` | kˈɔɹˈiˈOlˈɪs (four stresses, a bit choppy) | optional `Coriolis: "[Coriolis](/kˌɔɹiˈOlɪs/)"` | kˌɔɹiˈOlɪs = kor-ee-OH-liss |
| Ciarán | `"Keer-awn"` | kˈɪɹˈɔn | keep | — |
| hectopascals | none (plain word) | hˈɛktəpˌæskᵊlz | keep (none needed) | — |
| reanalysis | none | ɹˌiənˈæləsɪs | keep | — |
| Idai | `"Ee-dye"` | ˈidˈI | keep | — |
| Patagonia, Argentina | none | pˌæTəɡˈOniə | keep | — |
| centrifugal, merry-go-round, proton, angular | none | sɛntɹˈɪfjəɡəl · mˈɛɹiɡOɹˌWnd | keep | — |

Listen-check list for the final TTS (all occur in the draft): geostrophic (s41a, s42), Coriolis (many), Ciarán (s45),
hectopascals (s39, s44, s45), reanalysis (s32, s45, s46), Idai (s37, s38), Patagonia (s31), centrifugal (s27, s27a),
merry-go-round (s26a–s28_f), "small u" (s28b–s28c), "k cross k cross u" (s42), "rho" (s40, s42–s44), "Omega cosine phi"
(s28a–s28b), "x hat cross z hat" (s22d).

## 7. Decisions taken (orchestrator, 2026-10-27, under the user's standing order)
1. Length 48:15.2 (48.3 min): accepted.
2. UV2-01 wording used verbatim; the title card stays as in the house style ("made easy").
3. s22b restored.
4. Merry-go-round first, then the tilted Earth: accepted.
5. Land start points: accepted, refined by the data-scout to 45.0°N 0.5°E (Dordogne) and 45.0°S 69.5°W (Chubut).
6. Ciarán at ERA5 12 UTC, s46 numbers only in CHECK rows: accepted.
7. Image wording: "early in the afternoon of the second of November", isobars "from the reanalysis at the same time"
   (the orchestrator's data note asked the narration to say both are from the same time, early afternoon). MODIS Aqua
   passed the storm at about 13:20 UTC and ERA5 is 12 UTC (≈ 80 min, ≈ 50 km of storm motion); fetching 13 UTC with
   P4b would make the match exact to the hour.
8. Lexicon: the orchestrator applies the geostrophic / geostrophy / ageostrophic / Coriolis IPA fix to `movies/lexicon.yaml`.

## 8. Split movies (movies/ch00/series_plan.md: 2a `ch00_cross_product`, 2b `ch00_cross_product_uses`)
Every scene carries a `split` field in `storyboard.yaml`. Each section opens with its own bridge sentence and re-states
its numbers, so the blocks lift out:

| Block | Scenes | Goes to |
|---|---|---|
| Opening, hook | s00, s01 | both (re-worded per movie) |
| Why the dot product is not enough | s02–s04 | 2a |
| Building blocks + why the recipe is an area | s05–s10 (incl. s09a) | 2a |
| Right-hand rule, every way | s11–s17 | 2a |
| Cases and the geometric why | s18, s18a, s18b, s18c, s22a, s22b | 2a |
| Summary grid | s19 | both (2a the maths rows, 2b the uses rows) |
| Physics uses: torque, door, angular momentum, moving charge, perpendicular push | s20, s21, s22, s22c, s22d, s22e | 2b (each to be expanded there) |
| k × and why exactly 90° | s23, s23a | 2b |
| Rigid rotation v = Ω × r | s24, s25a, s25, s25b | 2b |
| Coriolis derived (merry-go-round) and on Earth | s26–s31 | 2b (preview depth; full in `ch00_coriolis`) |
| Real winds, storms | s32–s38 | 2b optional / later `ch00_coriolis` |
| Geostrophic + Ciarán | s39–s46 | 2b preview; full in `ch00_geostrophic_wind` |
| Recap, end card | s47, s48 | both (re-worded per movie) |

Seams to fix when splitting: s20's "Why would anyone want the part across?" and s22a's spanner callback assume s18b and
s20 came first (2b needs one bridge sentence recalling the part across; 2a needs s22a's spanner sentence replaced by
the parallelogram alone); s23a's "like the magnet's push on the proton" and "like our small kicks" assume s22d and s22e
(both are in 2b, in order).
