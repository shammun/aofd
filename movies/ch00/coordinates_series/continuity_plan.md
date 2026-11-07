# Coordinates series (5a–5g, then #6): continuity audit and plan, after the user's feedback of 2026-11-06

Written 2026-11-06 by the movie-director. Inputs:
- `user_feedback_2026-11-06.md` (12 paragraphs, all read);
- `movies/HOUSE_STYLE.md` §3, "Series parts", in the updated form: **no "so far / this time" opening recaps**;
- `movies/ch00/series_plan_v6.md`;
- every part's `script.md`, `storyboard.yaml` and `timing.json`;
- the original single movie `movies/ch00/ch00_coordinates/` (timing.json, 48:43.75; build-1 render 48:46);
- frames grabbed from `5_coordinates_build1.mp4` (8:54, 40:10, 41:09) and from `5a_coordinates_flat_fix3.mp4` (37:20, 39:40);
- the data on G: and in the repo.

**Coordinator correction (user, 2026-11-06), applied throughout.**
- No part opens with a "so far / this part" bridge.
- What the user wants instead: wherever a part shows along/across-shore winds before the flood before/after pictures, the equations used for them are on screen, with "derived in Part 1":
  - x′ = x cos α + y sin α
  - y′ = −x sin α + y cos α
- The rest of the cross-reference rule is unchanged. When a part uses an earlier result, the equation goes on screen with "derived in Part K", and the voice moves on to what the result means.

Times are `m:ss` from each movie's `timing.json`.
- 5b's timing.json is the notes-1 state (48:48). The notes-2 checkpoint (48:50) moves the later scenes by a few seconds.
- The user's timestamps for the original movie are within about 15 s of its timing.json, because the render runs 48:46 and timing.json says 48:43.75.

**Status of the numbers in this plan.** No script has been written yet, so every duration below is a planning figure. Each one has to be measured with a `tools/tts.py` dry run once the scripts are revised (HOUSE_STYLE §10).

---

## 1. Coverage map: the original movie → the seven parts

**Legend.**
- **D** = derived on screen, every step.
- **U** = used or stated, not derived.
- **⚠** = weaker than the original.
- **✗** = lost.

### 1a. The user's timestamps, mapped

| User's time (original) | Original scene · sentence (timing.json) | Now in | Part time | Status |
|---|---|---|---|---|
| ≈ 6:00–6:10, "theta hat turns when the head turns" | s08_polar_unit_vectors S6–S8 (6:02–6:17) | 5a s12_arrows_depend | 14:38–15:18 | D. 5a also derives r̂ (s08) and θ̂ (s09–s11) |
| ≈ 7:17, 10 m/s east wind: how much away, how much round | s10_polar_components S2–S9 (7:07–8:00) | 5a s13_components, s14_rebuild_general | 15:18–19:05 | D, stronger: inputs named, rebuild check, general formula u_r = u cos θ + v sin θ, u_θ = −u sin θ + v cos θ |
| ≈ 8:48, "the wind has two parts" | s11_ian_polar S6–S8 (8:42–8:55) | 5a s22_spin_inflow S1–S3 | 31:13–31:26 | D |
| ≈ 8:54, which way each part goes, on the map | s11 S8 (8:50) | 5a s22 (arrows at one ring point), s24_ring_points (r̂, θ̂ drawn at three real map points) | 31:13–39:10 | D, stronger. The fix3 frame at 37:20 shows r̂ and θ̂ at the 90° point on the HRRR map, the wind arrow split into u and v, and the inputs row |
| ≈ 9:57, eastward and northward wind graph round the ring | s12_why_polar_storm S2–S3 (9:49–10:02) | 5a s25_why_polar_storm S2–S7 | 39:10–39:48 | D. The fix3 frame at 39:40 shows u and v against θ, with the three hand-worked points as gold dots |
| Paragraph 2: "two steady lines … inflow angle ≈ 19°" | s12 S4–S8 (10:02–10:36) | 5a s25 S8–S15 + s26_inflow_angle S1–S5 | 39:48–41:22 | D, with the 72-point averages computed: **35 / −13.3 m/s, 21°** (the original's 37 / −12.5 / 19° used an older centre) |
| Paragraph 3: vorticity has its own movie | s12 S9 (10:36) | 5a s26 S12 | 41:55 | U, pointer kept |
| Paragraph 4: steady tangential wind, yet accelerating | s13_centripetal S1–S5 (10:43–11:10) | 5b s01 hook + s12_acceleration | 0:14 and 18:52–20:30 | D |
| Paragraph 5: d(v θ̂)/dt = −(v²/r) r̂ | s13 S6–S9 (11:10–11:53) | 5b s05–s12: dr̂/dθ, dθ̂/dθ, product rule, dθ/dt = v/r, velocity v θ̂, acceleration | 6:37–20:30 | D, every step (the original did it in four sentences) |
| Paragraph 6: steady components can still mean acceleration | s13 S12 (12:09) | 5b s14_steady_but_turning | 21:35–23:40 | D, plus the no-formula check with two arrows tail to tail |
| Paragraph 7: cylindrical = polar + height | s14_cylinder (12:16–13:15) | 5b s15_cylinder, s16_three_parts | 23:40–25:25 | ⚠ The original said it in one plain sentence (s14 S8, 13:01: "cylindrical coordinates are just polar coordinates with a height added"). 5b never says that sentence (paragraph 9). Fix in §3, 5b |
| ≈ 19:39, "cylindrical" calculation | s19_earth_cylinder (18:36–19:54): ground speed Ω a cos φ | 5c s20_spin_rate, s21_ground_speeds | 23:44–29:10 | D |
| ≈ 23:00 / 24:14, dA | s23_area (23:04–24:15) | 5c s27_area_patch … s34_global_mean | 36:05–47:27 | D (patch, box areas, strips, slope of sine, Archimedes, cos φ weighting with ERA5) |
| ≈ 27:02, DV/Dt · i = Du/Dt − uv tan φ / a + uw / a | s26_metric_terms S4 (26:46) | 5d s23_whole_vector, s24_dot_i_a, s25_dot_i_b | 30:50–34:57 | D, all six terms |
| ≈ 30:48, great circle | s29_great_circle (29:49–31:03) | 5f s05–s11 | 4:04–12:57 | D |
| Rhumb line, Mercator, conformal, area stretch | s30–s34 (31:03–35:17) | 5f s12–s13; 5g s03–s14 | — | D (Mercator: add-up table, ln tan, slope check) |
| View from the North Pole, changing coordinates there | s35–s36 (35:17–37:22) | 5g s16–s21 | 21:50–30:59 | D, plus the origin moved to the vortex centre |
| ≈ 39:20, along / across the shore | s39_coastline S1–S5 (39:21–39:54) | 5d s10_coast_frame … s14_along_across; 5b s26_onshore (words only) | 5d 12:09–19:39; 5b 36:56–37:43 | ⚠ The calculation sits in **5d, after** 5b has shown the gauges and floods. 5b says only "the wind blew almost straight onto the land … In Part 4 we'll measure it" |
| ≈ 40:07, Fort Myers Beach: 9 along, 32 across onto the land | s39 S6–S9 (39:54–40:22) | 5d s14_along_across | 17:52–19:39 | D, but in the wrong part for the flood story |
| ≈ 41:09, St. Petersburg out to sea +11.5 m/s, opposing arrows; tide gauges | s40_surge S5–S9 (40:45–41:20) | 5b s27_surge S7–S10, s28_ian_record | 38:37–40:04 | ✗ **The St. Petersburg along/across calculation is lost** (5b just says "the wind blew out to sea"). ✗ The opposing-arrow picture is lost. The gauges are kept (5b s28) |
| Before/after flood pictures | (not in the original; added for 5b) | 5b s29–s34 (Amphan radar, Nargis, Idai) | 40:04–47:00 | ⚠ No wind data, and no along/across calculation for any of the three events (paragraph 9) |

### 1b. Every original scene → part

| Original scene (time) | Concept / equation / application | Part, scenes | D/U | Note |
|---|---|---|---|---|
| s02 (0:29) | origin, axes, coordinates (3, 4), Cartesian | 5a s02 | D | |
| s03 (1:20) | x̂, ŷ, position 3x̂ + 4ŷ, fixed everywhere | 5a s03 | D | |
| s04 (2:11) | r = √(x² + y²), tan θ = 4/3, 53° | 5a s04 | D | |
| s05 (3:08) | x = r cos θ, y = r sin θ | 5a s05 | D | |
| s06 (3:52) | compass bearing = 90° − θ; "from" convention | 5a s06 | D (by example) | 5b and 5d use α = 90° − bearing (recall, §3) |
| s07 (4:32) | radians, arc rule s = r θ | 5a s07 | D | |
| s08 (5:36) | r̂, θ̂ at the balloon; they turn | 5a s08–s12 | D | 5a derives θ̂ via the 90° turn rule (−q, p) |
| s09 (6:18) | dr̂/dθ = θ̂, dθ̂/dθ = −r̂ | 5b s03–s07 | D | plus the slopes of sin and cos |
| s10 (7:03) | u_r, u_θ by dot products (6, −8) | 5a s13–s14 | D | |
| s11 (8:04) | Ian 18 UTC HRRR, ring 25 km, spin / inflow | 5a s21–s24 | D | 72-point averages and three points by hand |
| s12 (9:46) | why polar: u, v swing; u_r, u_θ steady; inflow angle | 5a s25–s26 | D | |
| s13 (10:44) | centripetal −v²/r r̂, 0.055 m/s² | 5b s08–s14 | D | 0.048 with the new 34.8 m/s |
| s14 (12:16) | cylindrical r, θ, z; ẑ fixed | 5b s15–s16 | ⚠ | see 1a |
| s14b (13:15) | layer stack, in at the bottom, out at the top | 5b s18–s20 (HRRR stack + radius–height section), s24 (Amphan ERA5) | D | stronger |
| s15–s17 (14:43) | sphere, latitude, colatitude, longitude, graticule | 5c s03–s12 | D | |
| s18 (17:06) | position vector a(cos φ cos λ, cos φ sin λ, sin φ) | 5c s13–s18 | D | |
| s19 (18:36) | distance from the axis a cos φ; ground speed | 5c s20–s21 | D | |
| s20–s21 (19:55) | Δy = a Δφ, Δx = a cos φ Δλ, 111 / 74 / 23 km | 5c s22–s25 | D | |
| s22 (22:07) | ERA5 grid boxes thin to the poles | 5c s26 | D | |
| s23 (23:04) | dA = a² cos φ dφ dλ, sin φ band share, cos φ weighting | 5c s27–s34 | D | |
| s24 (24:16) | ENU frame at Brest, other stations | 5d s03–s09 | D | i, j, k derived from the Part 3 vectors |
| s25 (25:28) | the arrows turn as you move | 5d s15–s22 | D | three rate equations |
| s26 (26:30) | metric terms, size vs Coriolis | 5d s23–s27 | D | |
| s27 (27:42) | curvilinear coordinates, scale factors | 5f s03–s04 | D | |
| s28 (28:54) | why so many coordinate systems (three reasons) | 5b s25 (cylindrical), 5g s15 (maps) | U | spread over parts; fine |
| s29–s30 (29:49) | great circle, rhumb line | 5f s05–s13 | D | |
| s31–s34 (31:49) | plate carrée, Mercator, area stretch, Equal Earth | 5g s03–s15 | D | |
| s35–s36 (35:17) | polar view, vortex components | 5g s16–s21 | D | |
| s37 (37:23) | turned axes x′, y′ | 5a s15–s17 | D | |
| s38 (38:31) | rotation matrix, direction cosines, index form, polar = turned axes | 5a s18–s20 | D | |
| s39 (39:22) | coast at 329°, FMB along / across | 5d s10–s14 (5b words only) | ⚠ | **moves to 5b (§2)** |
| s40 (40:23) | surge, StP out to sea, the bay fell; Ekman pointer | 5b s27–s28 | ⚠ / ✗ | StP calculation lost; **restore in 5b (§2)** |
| s41–s42 (41:29) | Galilean frames, acceleration unchanged | 5e s03–s06 | D | |
| s43–s44 (43:40) | Ciarán storm-relative winds, spin unchanged | 5e s08–s12 | D | |
| s45 (45:47) | fixed barometer, ∂p/∂τ split | 5e s13–s16 | D | |
| s46–s47 (46:55) | recap, end | each part | — | |

**Verdict on the user's question in paragraph 8** ("does what you've done meet my requirement?").
- Yes for almost everything. Every equation of the original is now derived step by step, most of them in more depth.
- 5a does show u_r and u_θ on the real Ian map, point by point. The frames show r̂ and θ̂ drawn at three real ring points, each wind split into u and v, the dot products, and the 72-point averages. That goes beyond the original.
- Two places fall short. Both are fixed by §2:
  1. **The shore-rotation calculation with real winds is not where the floods are.** It sits in 5d, after 5b has already shown the surge and the floods.
  2. **The St. Petersburg half of the original's "opposite sides of the eye" comparison is lost** (the calculation and the opposing arrows). The three flood events have no wind data and no across-shore calculation.

---

## 2. Decision: where the along/across-shore winds, the gauges and the floods belong

**Decision: in 5b, as one continuous block (coast frame → Ian's two stations → onshore reasoning → gauges → each flood event's wind calculation → its before/after).** The calculation moves out of 5d. 5d keeps a short recall and its 3-D point.

Reasons:
1. **All the maths it needs is taught by the end of 5b.**
   - The rotated-axes equations are derived in 5a (s15–s17), and 5a s20 already applies them to a wind (10, 0).
   - The bearing ↔ maths-angle rule is in 5a s06, the tangent rule in 5a s04, and the dot product in 5a s13.
   - The only extra input is the coast's angle. It needs two coastline points in kilometres, and 5b can read those off a **local flat map in kilometres**, which is 5a's world.
   - The conversion from latitude and longitude to kilometres (Δy = a Δφ, Δx = a cos φ Δλ) is 5c material. So 5b does not do it: it reads the km steps off the km grid, and 5d shows where those steps come from (§3, 5d).
2. **5b is the water part** (the user, paragraphs 9 and 11). The surge, the gauges and the floods are already there. Their reason, the across-shore wind, has to come before them, as HOUSE_STYLE §3 now requires: equation, then a worked calculation with real data, then the reasoning, then the evidence.
3. **Parts 6 and 7 (5f routes, 5g maps) have no wind-component maths.** Moving the floods there would put them 4–5 parts away from the rotation they depend on. They would also break those parts' single topics (routes, map projections).
4. **5d (local frames) comes after 5c.** Its value is the 3-D frame (k̂ kept, î and ĵ turned) and the lat/lon-to-km step. Neither is needed to see that "onshore wind piles up water".
5. This restores the original's teaching move exactly: the same storm, opposite sides of the eye, the across-shore sign flips, and the water flips with it. Every flood event then gets the same three beats: wind, across-shore number, picture.

### 2a. Exact scene order of the block in 5b

It replaces the current s26_onshore, s27_surge and s28_ian_record, and it wraps s29–s34. The block starts after s25_why_cylindrical.
- Scene ids are proposals.
- Sentences are drafts in the house voice.
- The numbers are from `cs.json` / `co.json` (HRRR 20 UTC) unless marked "builder".

| # | New id | What happens (voice → screen) | Data / physics_source |
|---|---|---|---|
| B1 | s26_coast_axes | "Now let's come back down to the ground, to Ian's landfall. On a coast, what matters is how much of the wind blows along the shore, and how much blows across it, onto the land or out to sea. To split a wind that way, we turn our axes to line up with the coast." **Screen, on "turn our axes":** x′ = x cos α + y sin α and y′ = −x sin α + y cos α (84 px) with the keyword **"derived in Part 1: turned axes"**. Then "For a wind, x and y become its east and north parts, u and v", with the wind form under it: u′ = u cos α + v sin α (along), v′ = −u sin α + v cos α (across). "So everything hangs on one number: the coast's angle, alpha." | `fluidpy.geo.vectors.components_in_axes`; `fluidpy.core.tensors.rotation_matrix_2d` |
| B2 | s27_coast_angle | **Goal first:** "Which way does the coast run?" The HRRR speed map at 60 % with a local km grid; two coast points, Naples and Englewood. On the km map, going up the coast moves about **91.5 km north and 55 km west** (km tags on the legs). Tangent = opposite over adjacent = 55 ÷ 91.5 ≈ 0.601, so the coast is 31° west of north. Bearing 360 − 31 = **329°** (recall bearing = 90° − θ, keyword "derived in Part 1: bearings"). α = 90 − 329 = −239 ≡ **121°**. x̂′ = (cos 121°, sin 121°) ≈ (−0.515, 0.857) points up the coast; ŷ′ ≈ (−0.857, −0.515) points west-south-west, out to sea. Say why north-north-west and not south-south-east: then ŷ′ points out to sea. | `cs.json → coast.naples, englewood, coast_brg = 329.1` (builder adds the km legs via `fluidpy.geo.sphere.arc_lengths`, shown as a flat km map; honesty note: "a local flat map in km") |
| B3 | s28_fmb_calc | Fort Myers Beach, 20 UTC on 28 Sep, about an hour after landfall: HRRR wind ≈ 33 m/s from the south-west, **u = 22.2, v = 24.3** (inputs row). Along = 22.2 × (−0.515) + 24.3 × 0.857 ≈ −11.4 + 20.8 ≈ **9.4 m/s**. Across = 22.2 × (−0.857) + 24.3 × (−0.515) ≈ −19.0 − 12.5 ≈ **−31.6 m/s**. "Minus means against ŷ′: not out to sea, but onto the land." Check √(9.4² + 31.6²) ≈ 33. The along (orange) and across (rose) arrows grow at the station with moving dashes, as in the original's 40:10 frame, gold-linked to their numbers. | `cs.json → coast.uF, spF, fromF`; `fluidpy.data.hrrr.fetch_fields` (sfc 20 UTC) + `components_in_axes` |
| B4 | s29_stp_calc | "Now go about a hundred and sixty kilometres north, to Saint Petersburg, on Tampa Bay, on the other side of the storm's spin." The coast there runs almost due north: bearing ≈ **353°**, so α ≈ **97°** (one line: 90 − 353 + 360). Wind **u = −10.25, v = −16.0** (≈ 19 m/s from the north-north-east). Along ≈ **−15.1**, across ≈ **+11.5**: plus means along ŷ′, **out to sea**. Then the two stations side by side, with **opposing across-shore arrows** (the original's 41:09 picture): rose onto the land at Fort Myers Beach, teal out to sea at St. Petersburg. Keyword "same storm, opposite sides of the eye". | `cs.json → coast.stp, uS` (in cs.json); **builder adds** `cb_pin = 353.09`, `alS = −15.12`, `acS = +11.50` (present in `co.json → coast`; recompute with `components_in_axes`) |
| B5 | s30_onshore_piles | The reasoning, said **before** any evidence. "Wind blowing onto the land drags the sea surface with it, and the water piles up against the coast. Wind blowing out to sea drags it away, and the water level drops." Shelf cross-section: wide and shallow off southwest Florida (`coast.shelf`), so the piled water has nowhere to go but up. "This rise is called a storm surge." The low pressure helps a little: about 1 cm per hPa, Ian about 75 hPa below normal, so about 75 cm (CalcStack, kept from the current s27 S4). Prediction prompt: "So what should the water have done at the two stations?" | `cs.json → coast.shelf`; builder arithmetic |
| B6 | s31_gauges | The answer from the tide gauges: Fort Myers about **+2.2 m** above the normal tide, Saint Petersburg about **−1.8 m** below it, both within a few hours of landfall. The two lines are drawn over 36 h, as in the original's frame, each gold-linked to its station's across-shore arrow. "The across-shore wind flipped its sign, and so did the water." The FMB survey (3–4.5 m above the ground) and "satellites saw nothing; the surge drained back within hours" are kept from the current s27/s28, shortened. Keep the Ekman and storm-surge movie pointers in one sentence. | `cs.json → coast.gauges` (8725520, 8726520); `fluidpy.data.coops.fetch_water_level` + residual |
| B7 | s32_flood_flight | (current s29) "Some floods last long enough to be seen from space." Bay of Bengal flight, the shallow Sundarbans shelf (20 m isobath about 33 km out), Amphan's track to landfall. | unchanged |
| B8 | s33_amphan_wind **(new)** | Amphan's 10-m wind on the Sundarbans coast from ERA5, with the coast frame turned to fit. The coast runs roughly west–east with the sea to the south. Pick the along arrow pointing west (bearing 270°, α = 180°), so that ŷ′ points south, out to sea, the same convention as Florida. The equations stay on screen with "derived in Part 1". Example from the downloaded 06 UTC field (builder to recompute): at 21.5 N, 89.0 E, u ≈ −17.4, v ≈ +12.3 → along ≈ +17.4, **across ≈ −12.3 m/s: onto the land**. Say that ERA5 is smooth and too weak (already said in s23). Arrows animated on the coast. | `fluidpy.data.era5_arco.fetch_box` (cs.json `amphan.arrows` = 06 UTC); coast bearing from `amphan.coast_map` via `fluidpy.geo.sphere.initial_bearing` |
| B9 | s34_amphan_radar | (current s30) the Sentinel-1 before/after and the pixel count, unchanged. | unchanged |
| B10 | s35_nargis_intro | (current s31) the delta, the track, landfall, the MODIS eye. | unchanged |
| B11 | s36_nargis_wind **(new)** | The same three beats: the delta coast faces south. Along arrow west (α = 180°), across = −v. The ERA5 wind at a delta-coast point a few hours before landfall, 2 May 2008 → across-shore number → "onto the land". | **missing data** (§2b) |
| B12 | s37_nargis_swipe | (current s32) natural colour first, then false colour. | unchanged |
| B13 | s38_idai_intro | (current s33) Mozambique Channel; SH, clockwise seen from above. | unchanged |
| B14 | s39_idai_wind **(new)** | The coast at Beira runs south-west to north-east with the sea to the south-east. Along arrow towards the south-west (bearing ≈ 225°, α ≈ 225°, so ŷ′ points south-east, out to sea; the builder measures the real bearing from the coastline). ERA5 at 18 UTC on 14 Mar, at 20.0 S, 35.0 E (downloaded): u ≈ −1.7, v ≈ +24.2 → across ≈ −18 m/s, **onto the land** (indicative). One sentence on the hemisphere, if the builder's numbers confirm it: "In the south, the storm turns the other way, so the onshore side lies on the other side of its track." | `ERA5-ARCO-idai2019` hourly (registry key exists) |
| B15 | s40_idai_swipe | (current s34) unchanged. | unchanged |

Scene rules for the block:
- **Order inside each event:** introduce the event (globe, place, track, date), then its wind and the across-shore calculation with the equation on screen, then the before/after picture.
- Each calculation shows the inputs row (u, v, α, cos α, sin α) on screen and in the voice before use (spoken-wording rule).

### 2b. Data availability per event (checked on G: and in the repo, 2026-11-06)

| Event | Wind field | Coast / station | Gauges / flood image | Missing |
|---|---|---|---|---|
| Ian (FMB, StP) | HRRR-zarr 12–21 UTC 28 Sep, hourly (registry `HRRR-zarr-ian2022`); FMB uF (22.23, 24.29) and StP uS (−10.25, −16.00) in `cs.json → coast` | FMB/StP positions, Naples/Englewood, coast_brg 329.1° in cs.json; StP coast bearing 353.09° and along/across (−15.12, +11.50) only in `co.json → coast` | CO-OPS 8725520 / 8726520 (+ 8725110) raw on G: (`raw/NOAA-COOPS/`); series in `cs.json → coast.gauges` | Builder: copy cb_pin / alS / acS into cs.json via `components_in_axes` (same HRRR hour); the km legs for B2. **Registry:** no `NOAA-COOPS` entry (raw files exist, not registered) |
| Amphan 2020 | ERA5-ARCO **only 2020-05-20 06 UTC** (`raw/ERA5-ARCO/era5_amphan_sfc_…T06…nc`, 53 × 57 points; plus pressure levels at 06 UTC) | `amphan.coast_map` (Natural Earth 10 m) in cs.json | GEE Sentinel-1 before/after (`raw/GEE/…amphan_s1_*`) | Recommended: ERA5 u10/v10/msl **09–15 UTC 20 May** (landfall 09 UTC; Satkhira closest 15:40 UTC), box 20–23.5 N, 87–91 E. A few MB through `fluidpy.data.era5_arco.fetch_box`. 06 UTC is usable as a fallback ("three hours before landfall"). **Registry:** no ERA5-Amphan, GEE S1 Amphan or IBTrACS NI entries |
| Nargis 2008 | **none downloaded** (no ERA5, no other wind field; only GIBS MODIS 2 May images and the IBTrACS NI track) | `nargis.coast` in cs.json | GEE MODIS v3 (`raw/GEE/ch00_flood_v2/v3_nargis*.npz`) | **Fetch** ERA5-ARCO u10/v10/msl, **2008-05-01T12 → 05-03T00 hourly, 13–19 N, 92–98 E** (a few MB). Honesty: the 2008 ERA5 storm is much weaker than the 90-kt best track; use it for directions, as with Amphan. **Registry:** no Nargis entries (GEE, GIBS, IBTrACS NI) |
| Idai 2019 | ERA5-ARCO hourly 11–15 Mar, 30–10 S, 30–50 E (`ERA5-ARCO-idai2019`, registered) | `idai.coast`, `coast_zoom` in cs.json | GEE MODIS v3 (`v3_idai2019.npz`) | Builder: the Beira coast bearing and the across-shore numbers at the landfall hours (18–21 UTC 14 Mar). Data complete |

**Note for the data agent.** The rule is that every derived product comes from `data/registry.yaml`. Several 5b sources are raw on G: and used in `cs.json`, but have no registry key:
- CO-OPS gauges, ERA5 Amphan, GEE S1/MODIS flood pairs, IBTrACS NI, GIBS Nargis/Amphan.

They need entries before 5b is published.

### 2c. Notation in the 5b block, and moving the Fort Myers calculation out of Part 4 (orchestrator decision, 2026-11-06)

**Notation: Part 1's, exactly.** The orchestrator decided this. I checked it against the 5a and 5d scripts and agree.
- **On screen in B1, with the keyword "derived in Part 1: turned axes":**
  - x̂′ = (cos α, sin α);
  - ŷ′ = (−sin α, cos α);
  - α is measured anticlockwise from east, as seen from above;
  - x′ = x cos α + y sin α;
  - y′ = −x sin α + y cos α.
- **Then "the same rule for the wind":**
  - u′ = u cos α + v sin α = **u**·x̂′, the part **along the shore**;
  - v′ = −u sin α + v cos α = **u**·ŷ′, the part **across the shore**.
- **The sign is said every time.** For example: "ŷ′ points out to sea, so a minus sign means onto the land".
  - Florida (Fort Myers Beach), Sundarbans, Irrawaddy delta and Beira: ŷ′ points to sea, by choosing the along direction so that ŷ′, its anticlockwise quarter turn, points seaward.
  - St. Petersburg: ŷ′ also points out to sea (west), so +11.5 means out to sea.
- 5d already uses the same x̂′, ŷ′ and α (script ≈ lines 154–174; data `fr.json → coast.xp, yp, alpha`), so nothing is renamed.

**Two possible clashes to watch (not blockers).**
1. **The prime means something else in 5e.** In 5e, u′ is the velocity seen in the moving frame (u = u′ + U). Within 5b the prime means "turned axes", which is Part 1's meaning. 5e defines its own prime on screen ("x′ measured from the back of the train"). To keep the two apart, 5b should also write keyword tags beside the numbers ("u′ = along", "v′ = across") and say "along" and "across" in the voice, not "u prime" and "v prime" alone.
2. **5b already uses v for something else.** Earlier in 5b, v is the parcel's speed on the ring (v θ̂, v²/r). In the coast block, v is the northward wind. B3 says so at first use ("u and v, the wind's east and north parts, as in Part 1"), and the inputs row writes "u = 22.2, v = 24.3 (east, north)".

**Moving the worked calculation from 5d into 5b.**

| Now in 5d (frames) | Goes to | 5b scene |
|---|---|---|
| s10_coast_frame: why along/across matters; x̂′ and ŷ′ from i, j | 5b, in 2-D form: x̂′ = (cos α, sin α), ŷ′ = (−sin α, cos α), recalled "derived in Part 1" | B1 |
| s11_coast_points: Naples and Englewood in lat/lon → 91.5 km N, 55 km W, using Δy = a Δφ and Δx = a cos φ Δλ | **stays in 5d** (it needs Part 3); 5b reads the same two legs off a km map | — (5b: B2 km map) |
| s12_coast_angle: tan β = 55 / 91.5, β = 31°, bearing 329° | 5b | B2 |
| s13_alpha: α = 90 − 329 + 360 = 121°; x̂′ ≈ (−0.515, 0.857), ŷ′ ≈ (−0.857, −0.515), out to sea | 5b | B2 |
| s14_along_across: FMB u = 22.2, v = 24.3 → along 9.4, across −31.6 (onto the land), check √ ≈ 33 | 5b | B3 |
| (not in 5d) St. Petersburg, bearing 353°, α ≈ 97°, along −15.1, across +11.5 (out to sea), opposing arrows | 5b (new, restores the original's 41:09) | B4 |

- The 5b s26 S6 sentence "In Part 4, we'll turn our axes … and measure exactly how much" is deleted; the calculation now happens on the spot.
- The 5b data (`cs.json → coast`) already holds FMB's u, the coast bearing and the Naples/Englewood points. The builder reuses 5d's `fr.json → coast` numbers (A, B, dy, dx, tanb, beta, brg, alpha, xp, yp, ian.along, ian.across) through the same functions: `fluidpy.geo.vectors.components_in_axes` and `fluidpy.geo.sphere.arc_lengths`. The CHECK rows stay identical between the two parts.

**What 5d keeps (about 3 min instead of 7.5).** Recommended: the recall, plus the step only 5d can do.
1. **s10 becomes a recall.** About 30 s; equations on screen with "derived in Part 1" and the result with "found in Part 2".
   - Voice: "In Part 2, we turned the axes to fit the coast of Florida: x prime along the shore, y prime out to sea, with alpha equal to a hundred and twenty one degrees, and Ian's wind split into about nine metres per second along the shore and thirty two onto the land."
   - Then the 3-D point, which is new in 5d: "In a station's local frame, we keep up, k hat, as it is, and turn only i hat and j hat." Screen: x̂′ = cos α î + sin α ĵ, ŷ′ = −sin α î + cos α ĵ, with k̂ unchanged.
2. **s11 is kept.** "Where did the ninety one and a half and fifty five kilometres come from?" The coastline latitudes and longitudes turn into kilometres with Δy = a Δφ and Δx = a cos φ Δλ, "derived in Part 3". This is the one step 5b could not do.
3. **s12 is cut to one sentence:** "so the coast's bearing, three hundred and twenty nine degrees, is the one we used in Part 2". S12 is dropped: its round-Earth bearing uses a Part 6 tool.
4. **s13 and s14 are cut** (now in 5b).
5. **Also in 5d:**
   - recap S4 becomes the lat/lon → km sentence of §3;
   - the title frame's Part B drops the coast turn;
   - 5e's opening recap, which mentions the coast, is removed anyway (§3).

An alternative is to keep only the 3-D local-frame sentence and cut s11 too. That saves another ~1:50, but the series would then never show where 5b's km legs come from, so it is not recommended.

---

## 3. Per part: ending recap + teaser, and cross-references

**Opening bridges are dropped (user correction).**
- Parts 3–7 each still open with a `sNN_partK_recap` scene, and Part 2's s01/s02 do the same:
  - 5b s01 S6–S11 + s02_part1_recap (1:33–2:41);
  - 5c s02_part2_recap (0:38–1:38);
  - 5d s02_part3_recap (0:39–1:52);
  - 5e s02_part4_recap (0:37–1:27);
  - 5f s02_part5_recap (0:34–1:30);
  - 5g s02_part6_recap (0:34–1:29).
- These are exactly the "so far" openings the user does not want. **Remove each one.** Each hook may keep its one identifying sentence ("This is the Nth of seven parts on coordinates").
- Every fact those recaps carried is instead recalled **where it is used**: the equation on screen, the keyword "derived in Part K: <name>", one spoken sentence, then on.

Teasers below follow the rule: what the next part covers, and why. They replace the current one-line teasers.

### 5a `ch00_coordinates_flat`, Part 1
- **Ending recap:** keep s27 S1–S10 (it is complete). Make sure S8 names the turned-axes lines, which Part 2 will use on a coast.
- **Teaser (replaces S11):** "In Part 2, we'll ask whether air going round the eye at a steady speed is accelerating, and find out exactly how fast r hat and theta hat turn. Then we'll look inside a hurricane in three dimensions, and use our turned axes to see how its winds push the sea onto the coast."
- **Cross-references (uses of earlier parts):** none. Pointers to earlier movies (vectors, dot product, weather basics) are already spoken.

### 5b `ch00_coordinates_storm`, Part 2
- **Ending recap (rewrite s35):** keep S1–S7, then:
  - "Turning the axes to fit the coast split Ian's wind into its parts along and across the shore."
  - "At Fort Myers Beach, about thirty two metres per second blew onto the land, and the water rose two point two metres. At Saint Petersburg, eleven and a half blew out to sea, and the water fell one point eight."
  - "The same across-shore wind blew onto the land before the floods after Amphan, Nargis and Idai."
- **Teaser:** "In Part 3, we'll take these ideas to the biggest round shape of all: the Earth. There, latitude and longitude turn into kilometres, which is how we can say exactly how far Fort Myers is from Saint Petersburg, or Khulna from the sea."
- **Must add: cylindrical said plainly** (paragraph 9), in s15 after S7, replacing S8–S10:
  - Voice: "Polar coordinates plus a height axis, z, are called cylindrical coordinates. Nothing else changes: r and theta are exactly the ones from Part 1, and z just counts metres straight up. They're called cylindrical because all the places at one distance r form a cylinder round the storm's axis."
  - Screen: the flat polar grid lifts into 3-D and a z axis rises from the eye; (r, θ) → (r, θ, z); "x = r cos θ, y = r sin θ — derived in Part 1" + "z = z"; keyword "polar + height = cylindrical".
- **Cross-references (equation on screen + keyword):**

| Where | Recalled result | On screen | Keyword |
|---|---|---|---|
| s03 (after removing s02) | r̂, θ̂ | r̂ = (cos θ, sin θ), θ̂ = (−sin θ, cos θ) = r̂ turned 90° | derived in Part 1: polar unit vectors |
| s03 S14 | arc rule | s = r Δθ | derived in Part 1: arc length |
| s06 S15 | turn by 90° rule | (p, q) → (−q, p) | derived in Part 1: quarter turn |
| s09 S3 (v ≈ 35 m/s) | u_r / u_θ calculation and the ring average | u_r = u cos θ + v sin θ, u_θ = −u sin θ + v cos θ; ⟨u_θ⟩ = (1/72) Σ ≈ 34.8 m/s | derived in Part 1: radial and tangential wind |
| s16 S2–S3 | the same two parts | the same two lines, now plus w | derived in Part 1 |
| s20 S2, s23 S7 | ring average of u_r per level / Amphan ring | ⟨u_r⟩ formula | derived in Part 1: ring average |
| s23 S12 | inflow angle | tan(inflow) = \|u_r\| / u_θ | derived in Part 1: inflow angle (Ian 21°) |
| B1 | turned axes | x′ = x cos α + y sin α, y′ = −x sin α + y cos α | derived in Part 1: turned axes |
| B2 | bearing ↔ maths angle; tangent | bearing = 90° − θ; tan = opposite / adjacent | derived in Part 1: bearings |
| B8, B11, B14 | turned axes again | the same two lines (the wind form) | derived in Part 1 |

### 5c `ch00_coordinates_sphere`, Part 3
- **Ending recap:** keep s35 S1–S13.
- **Teaser (replaces S14):** "In Part 4, we'll stand at a weather station and give it its own east, north and up arrows. As the air moves over the round Earth, those arrows turn by themselves, and that turning adds extra terms to how the wind changes."
- **Cross-references:**

| Where | Recalled | On screen + keyword |
|---|---|---|
| s04/s06 (where the cut face first shows a radius and an angle) | x = r cos θ, y = r sin θ | derived in Part 1: polar coordinates |
| s08 S9 (side = long side × cos / sin) | the same | derived in Part 1 |
| s11 S8 (east is anticlockwise) | θ anticlockwise from above | derived in Part 1 |
| s16–s17 (distance from the axis) | cylindrical r | defined in Part 2: cylindrical coordinates |
| s18 (unit position arrow) | r̂ = arrow ÷ length | derived in Part 1: unit vector |
| s20 S22 (ring speed) | dθ/dt = v/r ⇔ v = r Ω | derived in Part 2: angle rate on a ring |
| s22 S8, s24 | s = r Δθ | derived in Part 1: arc length |
| s30 S2 | d(sin φ)/dφ = cos φ | derived in Part 2: slopes of sine and cosine |
| s19 (Khulna, "Amphan from Part 2") | no equation; the place is recalled | fine as is |

- Also: s26 S14 says "in Part 4, we'll turn a coast's latitudes and longitudes into kilometres". Keep it; it now points to 5d's recall of the 5b coast (below).

### 5d `ch00_coordinates_frames`, Part 4
- **Ending recap:** S1–S3 and S5–S7 kept. S4 becomes: "With Part 3's rules, the coast points' latitudes and longitudes give the ninety one and a half and fifty five kilometres, so the coast frame of Part 2 sits exactly on the round Earth."
- **Teaser (replaces S8):** "In Part 5, we'll let the frame itself move, and ride along with a storm. That shows which parts of its winds belong to the storm itself, and which only come from its motion."
- **Coast block shrinks** (s10–s14, 12:09–19:39, 7.5 min → about 3 min):
  - s10 becomes a recall. Equations x′, y′ "derived in Part 1", the Florida coast at 329° and FMB 9.4 along / −31.6 across "found in Part 2"; then the 3-D point: k̂ stays, only î and ĵ turn.
  - s11 is kept: Naples → Englewood in lat/lon → km with Δy = a Δφ, Δx = a cos φ Δλ, "derived in Part 3". It explains where 5b's km legs came from.
  - s12 S12: "on the round Earth the bearing comes out the same, 329°". This uses `initial_bearing`, a Part-6 tool. Either cut it, or say "we'll see how to compute bearings on the sphere in Part 6".
  - s13–s14 are cut. They are now in 5b.
  - The title frame's Part B (the coast frame turning to 329°) becomes the turning tripod / metric bars.
- **Cross-references:**

| Where | Recalled | On screen + keyword |
|---|---|---|
| s04 S7 | unit position vector (cos φ cos λ, cos φ sin λ, sin φ) | derived in Part 3: position vector |
| s05 S10, s06 S8 | quarter-turn rule | derived in Part 1 |
| s10 | turned axes + the FMB result | derived in Part 1 / found in Part 2 |
| s11 | Δy = a Δφ, Δx = a cos φ Δλ | derived in Part 3: distances |
| s12 S8 | bearing = 90° − θ | derived in Part 1: bearings |
| s16 | dr̂/dθ = θ̂, dθ̂/dθ = −r̂, dθ/dt = v/r | derived in Part 2: turning arrows |
| s23 S8 | product rule | derived in Part 2: product rule |
| s24 S3 | component = dot product | derived in Part 1 |

- s02_part3_recap is removed. Its Earth-axes content (x̂ to 0 N 0 E, ẑ to the pole, a = 6371 km) is recalled at s04 with "derived in Part 3: Earth axes".

### 5e `ch00_coordinates_moving`, Part 5
- **Ending recap:** keep s17 S1–S9.
- **Teaser (replaces S10):** "In Part 6, we'll find the shortest way between two places on the round Earth: the great circle, and the rhumb line that sailors steered for centuries. It explains why flights from Europe to California pass over Greenland."
- **Cross-references:**

| Where | Recalled | On screen + keyword |
|---|---|---|
| s05/s06 (after removing s02) | Capital D by D t, the traveller rate | the derivatives movie (a series pointer, not a Part) |
| s08 S6 | bearing → east/north parts (u = speed × sin bearing, v = speed × cos bearing) | derived in Part 1: bearings |
| s09 S2, s11 | u_r, u_θ split and ring averages | u_r = u cos θ + v sin θ, u_θ = −u sin θ + v cos θ — derived in Part 1 |
| s07 S16 | turning frames add Coriolis | cross product movie (pointer) |

- s02_part4_recap is removed. Its S3 (coast) is dropped, and its i, j, k content is recalled at s08 ("derived in Part 4: local east and north").

### 5f `ch00_coordinates_routes`, Part 6
- **Ending recap:** keep s14 S1–S7.
- **Teaser (replaces S8):** "In Part 7, we'll flatten the Earth onto maps, and work out exactly what each map stretches. That's why the rhumb line comes out straight on the most famous map of all, and why weather data need care near the poles."
- **Cross-references:**

| Where | Recalled | On screen + keyword |
|---|---|---|
| s04 S2, s07 S7 | s = r Δθ | derived in Part 1: arc length |
| s04 S6–S8 | Δy = a Δφ, Δx = a cos φ Δλ | derived in Part 3: distances |
| s08 S5 | unit position vector | derived in Part 3: position vector |
| s09 | a · b = \|a\|\|b\| cos σ | dot product movie |
| s11 (heading) | local east, north at each point; bearing from north | derived in Part 4: local frame; Part 1: bearings |

- The 5d puck "goes along a great circle, which we'll meet in Part 6" is now paid off. Optionally add one line in s06: "the puck from Part 4 glided along exactly such a circle".

### 5g `ch00_coordinates_maps`, Part 7
- **Ending recap:** keep s22 S1–S7.
- **Teaser (replaces S8):** "Next in this series comes the gradient: how fast, and in which direction, temperature or pressure changes across a map. It's where the one over the radius times cosine phi that we met here does its real work."
- **Cross-references:**

| Where | Recalled | On screen + keyword |
|---|---|---|
| s04 S9, S13 | arc rule; Δy = a Δφ | derived in Part 1 / Part 3 |
| s05 S4 | radius of a parallel a cos φ | derived in Part 3 |
| s05/s06 | scale factors h_φ = a, h_λ = a cos φ | derived in Part 6: scale factors |
| s08 S5, S13 | true north step a Δφ | derived in Part 3 |
| s09/s10 | integration as adding strips | derived in Part 3: adding up strips |
| s12 | rhumb line = constant bearing | derived in Part 6 |
| s19 | east = θ̂ round the pole, north = −r̂ | derived in Part 1 (polar unit vectors) + Part 4 (local east, north) |
| s21 | ring split and averages | derived in Part 1 |

### #6 `ch00_gradient`
- **Ending:** s38 recap, then the end card. It is not a series part, but a one-sentence teaser to the next movie in the order (M01, contour maps) would match the series. Optional.
- **Cross-references (must change):**
  - s22 S2 "as we saw in the coordinates movie" names a movie that no longer exists. Replace it with:
    - Δy = a Δφ and Δx = a cos φ Δλ on screen, keyword "derived in Coordinates, Part 3";
    - the eastward slope (1 / (a cos φ)) ∂/∂λ, keyword "met in Coordinates, Part 7".
  - Then shorten s22 to the implication, because 5g s06 already built it.
  - s23 (ERA5 at Brest) stays; it is #6's own worked example.

---

## 4. Gaps, ordering problems and repetition

**Gaps (used before taught, or used silently).**
1. **5b uses along/across before 5d teaches it (now).** s26 says it in words and s27–s34 rely on it. Fixed by §2.
2. **5b B2 must not use the lat/lon → km rule** (a 5c result). The plan reads the legs off a km map and leaves the conversion to 5d s11. The storyboard's honesty note must say so.
3. **5d s12 S12 uses a great-circle initial bearing (5f) silently.** Cut it, or make it a pointer (§3, 5d).
4. **5d s26 says the puck "goes straight, along a great circle"** before 5f. Acceptable as a pointer ("which we'll meet in Part 6"); 5f pays it off.
5. **#6 s22 cites "the coordinates movie".** Re-point it to Parts 3 and 7 (§3).
6. **The recalls listed in §3 are currently done by the opening recap scenes,** not at the point of use. Once those scenes go, each listed recall has to be added, or later parts will use earlier results silently. This is the largest edit in 5c–5g: each needs about 4–8 on-screen recall lines, and each recall is one sentence.
7. **5b's Amphan distances (Satkhira 45 km, Khulna 79 km) and the 33-km shelf width are stated facts** computed with great-circle tools (5f). Fine as stated facts. Never show them as calculations in 5b.

**Ordering problems.**
- The along/across calculation sits after the surge and the floods (5d after 5b). Fixed by §2.
- The 5b hook S7–S11 promises "turning arrows, Ian, Amphan, floods" as a this-part preview. Trim it to one question plus one identifying sentence.

**Repetition.**
- The opening recap scenes in 5b–5g, about 6 min in all. Remove them (user).
- 5d s10–s14 repeated the coast frame that 5b now does. Shrink to the recall + lat/lon → km (§3).
- 5g s06_gradient_preview against #6 s22–s23. Both explain 1/(a cos φ) ∂/∂λ with a Brest example. Keep 5g's "if you skipped" version. #6 recalls it and keeps only its ERA5 example.
- Amphan's landfall geography is said in 5b s21 and again in 5d s09 (79 km west of Khulna). 5d should recall it as "Cyclone Amphan, from Part 2", without the full description.
- "How tropical cyclones form" is pointed to in both 5a s23 and 5b s20. Fine (two different contexts).

---

## 5. Title frames and first sentences ("made easy" / "the easy way")

| Part | Title frame now | First sentence now | Change |
|---|---|---|---|
| 5a | 'Coordinates · Part 1' / **'Arrows on a flat map'** / **'made easy' 88 px pulsing on AT(1,'the easy way')** / 'polar coordinates and rotated axes' | "… coordinates on a flat map **the easy way**, and see how meteorology uses them to measure the winds round a hurricane's eye." | Delete 'made easy' and its pulse. Voice: "In this video, we'll learn coordinates on a flat map, and see how meteorology uses them to measure the winds round a hurricane's eye." The pulse moves to the concept name on AT(1,'coordinates'). **Also** s19 S22 "Tensors made easy" → "our tensors movie" (HOUSE_STYLE §3) |
| 5b | 'Coordinates · Part 2' / 'Inside a tropical cyclone' / 'turning arrows and cylindrical coordinates' / **'made easy' 68 px pulsing on AT(0,'turning arrows and cylinders')** | "… how turning arrows and cylinders work, and see how meteorology uses them to look inside a tropical cyclone: its spin, its winds in three dimensions, and its storm surge." (no "easy") | Delete 'made easy'. Optionally end the sentence "…, and the storm surge its winds push onto the coast." (it now matches the coast block) |
| 5c | 'Coordinates · Part 3' / 'Our round Earth' / **'made easy' 96 px** / 'latitude, longitude, distances and areas' | no "easy" | Delete 'made easy' |
| 5d | 'Coordinates · Part 4' / 'Turning frames' / 'local axes and how they turn' | no "easy" | Title is clean. Part B animation: drop the coast-frame turn (the coast now lives in 5b) |
| 5e | 'Coordinates · Part 5' / 'Moving frames' / 'storm-relative winds' | clean | none |
| 5f | 'Coordinates · Part 6' / 'Routes' / 'great circles and rhumb lines' | clean | none |
| 5g | 'Coordinates · Part 7' / 'Maps' / 'projections and the view from the pole' | clean | none |
| #6 | 'The' / 'gradient' / **'made easy' 96 px** / 'and how meteorology uses it' | clean | Delete 'made easy'; the pulse moves to 'gradient' |

**One layout for all seven parts.** Parts 1–3 use a small 'Coordinates · Part N' above a big part name; Parts 4–7 put 'Coordinates · Part N' in the big gradient line. Pick one, so the series looks like one creator made it. The recommended layout:
- line 1: RiseText **'Coordinates'** (150 px, teal → gold), the concept name, pulsing when the voice says "coordinates";
- line 2: **'Part N · <part name>'** (68–96 px, warm white);
- line 3: the subtitle (68 px).

A 150-px 'Coordinates · Part 4' does not fit on one line in the 975-px column. Check the fit with the kit before rendering.

---

## 6. Endings (the last ~60 s of each part)

| Part | Last minute now | Smooth? | Change |
|---|---|---|---|
| 5a | s26 (the four angles side by side + the vorticity pointer) → s27 recap (84 s), one-line teaser → end card + 2.5-s hold, music fade | Mostly. Problem: the storyboard visuals of s22, s25, s26 and s27 still say '37', '−12.5' and '19°' (and s21–s26 carry "PENDING DATA REPORT"), while the voice says 35 / 13.3 / 21°. If the render followed the storyboard text, the recap minis contradict the voice. The fix3 frames checked are the ring scenes only | Reconcile the storyboard text and check the fix3 recap frames; the two-sentence teaser (§3); on the end card, fade picture and music together over the final 2.5 s |
| 5b | s34 Idai swipe (37 s, ends on a flood-mapping pointer) → s35 recap (85 s) with a one-line Part 3 teaser → end card | The recap jumps from cylinders to "wind blowing onto a coast piles up a storm surge" with no number, because 5b never computed one | New recap lines with the across-shore numbers and gauges (§3); two-sentence teaser; fade together |
| 5c | s34 global mean (2 min, ends on ERA5 cos-φ weighting) → s35 recap (2 min, 13 sentences) → teaser → end card | Smooth; the recap is long but one beat per sentence | Two-sentence teaser; fade together |
| 5d | s27 metric size → s28 recap → teaser → end card | Smooth | Recap S4 rewritten (coast); teaser with the why; fade together |
| 5e | s16 Plymouth meaning + the "Reading maps over time" pointer → s17 recap → teaser | Smooth | Teaser with the why; fade together |
| 5f | s13 why rhumb (ends "we'll see why … in Part 7") → s14 recap, which repeats the Part 7 teaser | Smooth, but the teaser is said twice (s13 S13 and s14 S8) | Drop s13 S13 (keep the keyword); the two-sentence teaser in the recap only |
| 5g | s21 origin + vortex pointers → s22 recap → "Next in this series, … the gradient" | Smooth | Teaser with the why; fade together |
| #6 | s37 Gulf Stream → s38 recap → end card with a related-movies row | Smooth; no teaser | Optional teaser to M01; fade together |

For every part:
- Check that the end-card component fades the picture with the music over the 2.5-s hold. The storyboards only say "silent hold while the music fades".
- Check that no new idea appears in the final minute. The only borderline case is 5a's s26 "four angles" grid: it is a summary of known angles, so it is fine.

---

## 7. Prioritised work list per part

### 5a `ch00_coordinates_flat` (first)
1. **s00:** remove 'made easy' (visual, pulse) and "the easy way" (voice). Re-voice S1. Apply the series title layout (§5).
2. **s19 S22:** "Tensors made easy" → "our tensors movie". Re-voice that sentence.
3. **Storyboard text vs voice.** Reconcile s21–s27:
   - remove the "PENDING DATA REPORT" markers if `reports/data/ch00_coordinates_research.md` now exists;
   - change '37', '−12.5' and '19°' to 35, −13.3 and 21°;
   - update the s24 table rows to the spoken values (90°: u_r −37.4, u_θ 16.9; 135°: −24.3, 38.6).

   Then check the fix3 frames of s22, s25, s26 and s27 for the same numbers. Re-render only what differs.
4. **s20:** add one on-screen line plus one sentence, after S10, for the wind form of the turned axes: u′ = u cos α + v sin α, v′ = −u sin α + v cos α. 5b recalls exactly this. (About 10 s.)
5. **s27:** the two-sentence teaser (§3), mentioning the coast use of the turned axes. End card: picture and music fade together.
6. Run the wording lint, then a TTS dry run of the changed sentences (s00 S1, s19 S22, s20 new line, s27 S11). Report the measured duration (now 43:52.70).

### 5b `ch00_coordinates_storm`
1. **s00:** remove 'made easy'; optionally adjust the last clause.
2. **Remove the "so far" opening:** cut s02_part1_recap and trim s01 S7–S11 to one sentence. Add the point-of-use recalls listed in §3 (s03, s06, s09, s16, s20, s23).
3. **s15/s16, cylindrical said plainly:** "polar coordinates plus a height axis z = cylindrical coordinates; nothing else changes". Equations (r, θ) → (r, θ, z) and x = r cos θ, y = r sin θ "derived in Part 1", z = z. Show the 3-D z axis rising from the eye.
4. **s09:** recall the u_r / u_θ formulas and Part 1's 72-point ring average on screen, with "derived in Part 1: radial and tangential wind", where v ≈ 34.8 m/s is taken.
5. **The coast block B1–B6 (§2a)** replaces s26–s28: turned-axes equations "derived in Part 1" → coast angle on the km map → FMB along / across → StP along / across with opposing arrows → "onshore wind piles water against the coast" → gauges.
6. **The flood events B7–B15:** each event gets its wind calculation (equations on screen, "derived in Part 1") before its before/after.
7. **Data (builder + data agent):**
   - copy the StP bearing and along/across into cs.json;
   - km legs for B2;
   - Amphan ERA5 09–15 UTC (recommended) and its coast point and bearing;
   - **fetch Nargis ERA5** (2008-05-01T12 → 05-03T00, 13–19 N, 92–98 E);
   - Idai coast bearing and across-shore numbers;
   - registry entries for CO-OPS, ERA5 Amphan/Nargis, GEE pairs, IBTrACS NI, GIBS.

   Disk checks before and after each fetch.
8. **s35 recap + teaser rewrite (§3).** End card: fade together.
9. Storyboard honesty notes:
   - the km map is a local flat approximation;
   - ERA5 is too weak for Amphan and Nargis, so it is used for directions;
   - HRRR 20 UTC is used for the coast winds;
   - the gauge at Fort Myers is up the river.

   quiz_hook: "On which side of the eye did the sea fall, and why?"
10. Wording lint → TTS dry run → report the real duration. Planning figure: about +6 min net, so about 55 min (to be measured). If the user finds that too long, the fallback is to drop the Nargis wind beat and keep Amphan and Idai.

### 5c `ch00_coordinates_sphere`
1. s00: remove 'made easy'; series title layout.
2. Cut s02_part2_recap. Add the point-of-use recalls (§3: s04/s08, s11, s16–s18, s20, s22/s24, s30).
3. Two-sentence teaser in s35. Fade together.

### 5d `ch00_coordinates_frames`
1. Shrink the coast block: s10 becomes a recall of 5b (equations "derived in Part 1", FMB "found in Part 2"), keep s11 (lat/lon → km, "derived in Part 3"), cut s13–s14, and fix the s12 S12 forward use.
2. Cut s02_part3_recap. Add the recalls (s04, s05/s06, s16, s23, s24).
3. s00 Part B animation without the coast. Recap S4 rewrite, teaser, fade together.

### 5e `ch00_coordinates_moving`
1. Cut s02_part4_recap; add the recalls (s06, s08, s09/s11).
2. Teaser with the why; fade together.

### 5f `ch00_coordinates_routes`
1. Cut s02_part5_recap; add the recalls (s04, s07, s08, s11).
2. Drop the duplicate teaser (s13 S13); recap teaser with the why; optionally pay off the Part 4 puck in s06; fade together.

### 5g `ch00_coordinates_maps`
1. Cut s02_part6_recap; add the recalls (s04–s06, s08–s10, s12, s19, s21).
2. Teaser with the why; fade together.

### #6 `ch00_gradient`
1. s00: remove 'made easy'.
2. s22: re-point "the coordinates movie" to "Coordinates, Part 3 / Part 7" with the equations on screen. Shorten s22 to the implication; keep s23.
3. Optional teaser to M01; fade together.

**After all the edits:** re-check §4 with the dependency script (`deps_v6.py`). Update `series_plan_v6.md`:
- the §5 rows "Storm surge … along/across-coast winds" and "Local frame" (the along/across calculation now lives in #5b);
- the F19 note.

That update is for the orchestrator; this plan edits no other file.
