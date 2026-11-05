# ch00_coordinates (#5): split plan after the user's build-1 feedback (movie-director, 2026-11-05)

**What this is.** The plan for the major revision of #5 *Coordinates* (build 1, 48:46). The user's feedback
(`reports/ch00_coordinates_user_feedback.md`, 2026-11-05) asks for many new step-by-step derivations, labels and worked
calculations, better 3-D, a Bay of Bengal cyclone, a Google Earth Engine (GEE) surge slider, and a **split into at
least 4–5 consecutive parts**. This file holds: §1 the feedback map, §2 the split, §3 the concepts owned by later
movies (and what #6 must change), §4 effort, §5 risks, decisions and lexicon. The revised series order is in
`movies/ch00/series_plan_v6.md`. Plan only: no storyboard, script or data is written yet.

**Read for this plan:** the feedback (every line), `storyboard.yaml` v4, `script.md`, `timing.json` (build-1 times),
`build1_log.md` §1–§9, review 1 in `reports/ch00_movies.md` (17 Must, 18 Should), `movies/HOUSE_STYLE.md`,
`series_plan_v5.md`, the cross-product split (`ch00_cross_product`, `ch00_cross_product_uses`; its half-Earth slice in
`ch00_cross_product_uses` s24), the weather-basics and derivatives layer stacks and wind trails, #4's script (what it
teaches: limits, partials, total differential, the chain rule, the traveller's rate, change of variables, finite
differences; **not** taught there: slopes of sine and cosine, the product rule, integration, logs), #6's script,
Vallis pp. 61–63 (page images `chapters/pages/ch02/p082.png`, `p083.png`: (2.36)–(2.39), (2.44)–(2.45)), and the
`fluidpy` function list (`core.coords`, `core.tensors`, `geo.sphere`, `geo.frames`, `geo.mapproj`, `diag.cyclone`).

**Data side.** The data scout works in parallel (`reports/data/ch00_coordinates_research.md`, not written yet). Every
scene that depends on its answers is marked **[pending data report]** and is written so that its data can be swapped
(Ian ↔ the Bay of Bengal storm; HRRR ↔ ERA5 ↔ another product; GEE Sentinel-1 ↔ another before/after pair).

**Numbers below** were computed with the tested library on 2026-11-05 (`fluidpy.geo.sphere.unit_vector`,
`central_angle`, `constants`; plain numpy for the toy values) unless they are build-1 CHECK values. Lengths are
**planning estimates** from the measured build-1 rate (142 words per minute overall, beats included); each part's
storyboard gets a `tools/tts.py` dry run (HOUSE_STYLE §10.1) before it is built.

---

## 0. Summary

| | |
|---|---|
| Distinct user requests | **103** (U-CO-001 … U-CO-103), §1a |
| Review-1 items kept | 17 Must + 18 Should: all 17 Musts and 17 Shoulds fixed in fix loop 1; Should 13 (a re-voice) lands in Part 2, §1b |
| Fix-loop-1 changes carried | 9 data/screen rules, §1c |
| Parts | **5** (#5a–#5e), each a full house-style movie (title, hook, recap, end card) |
| Total length (est.) | **≈ 125 min** (build 1: 48:46): Part 1 ≈ 25.5, Part 2 ≈ 25.6, Part 3 ≈ 25.4, Part 4 ≈ 25.6, Part 5 ≈ 23.2 min |
| New narration (est.) | **≈ 78 min** (≈ 65 min of new teaching + ≈ 13 min of per-part titles, hooks, recaps and end cards) |
| Scenes | **131** (49 in build 1): 37 new, 75 rewritten from build-1 scenes, 19 kept with light edits |
| New derivations | **56** (D01–D56, step lists in §2) |
| New data products | 12 (§4), 5 of them pending the data report |

| Part | ID | Slug | Title | Old scenes | Est. |
|---|---|---|---|---|---|
| 1 | #5a | `ch00_coordinates_flat` | Coordinates, Part 1 — Arrows on a flat map: polar coordinates and rotated axes | s00–s08, s10–s12, s37–s38 | 25.5 min |
| 2 | #5b | `ch00_coordinates_storm` | Coordinates, Part 2 — Inside a tropical cyclone: turning arrows and cylindrical coordinates | s09, s13, s14, s14b, s39, s40 | 25.6 min |
| 3 | #5c | `ch00_coordinates_sphere` | Coordinates, Part 3 — Our round Earth: latitude, longitude, distances and areas | s15–s23 | 25.4 min |
| 4 | #5d | `ch00_coordinates_frames` | Coordinates, Part 4 — Moving frames: local axes and storm-relative winds | s24–s26, s41–s45 | 25.6 min |
| 5 | #5e | `ch00_coordinates_maps` | Coordinates, Part 5 — Routes and maps: great circles and map projections | s27–s36 | 23.2 min |

Naming follows the cross-product split: descriptive slugs under `movies/ch00/` (`ch00_cross_product`,
`ch00_cross_product_uses`), "Part 1 … Part 5" in the titles and the voice. The plan IDs are **#5a–#5e** so that #6
and every later number keep their meaning. The build-1 folder `ch00_coordinates` stays as the archive (not published).

---

## 1. Feedback map

### 1a. The user's requests (103)
Time = the user's timestamp; scene = build-1 scene and sentence (S0 = first sentence of the scene, from
`timing.json`); **Part** = where it lands (P1–P5 and the new scene id, see §2). "All" = a rule for every part.

| # | Time | Build-1 scene | Request | Change | Part · scene |
|---|---|---|---|---|---|
| 001 | 5:47 | s08 S2–S4 | θ̂ = (−sin θ, cos θ) appears without a derivation | new derivation D02–D03 before the formula | P1 s10, s11 |
| 002 | 5:47 | s08 S2 | why θ̂ is drawn where it is | D01: θ̂ is the way θ grows (hold r, turn θ: the point slides along the circle) | P1 s09 |
| 003 | 5:47 | s08 S2 | why that direction (anticlockwise), and how it gives the formula | D01 (+90°, not −90°) then D02 rule → D03 | P1 s09–s11 |
| 004 | 6:20 | s09 S0 | "radius 1" cut off at the right | Must 9 fix kept; the label sits inside the frame in the new scene | P2 s04 |
| 005 | 6:43 | s09 S5 | how can we write dr̂ = θ̂ dθ? | D12–D13 step by step (tip on the unit circle, arc = Δθ, direction θ̂, limit) with a numerical check | P2 s04, s05 |
| 006 | 6:49 | s09 S6 | "θ̂'s tip moves toward the centre, so −r̂": not understood | D14 from scratch: both arrows drawn from one tail, θ̂'s tip slides along its own circle; the 90° rule twice; component slopes; numeric check | P2 s06 |
| 007 | 7:28 | s10 S4 | write the values of u and θ during the u_r, u_θ calculation | the column shows u = (10, 0) m/s, θ = 53°, r̂ = (0.6, 0.8), θ̂ = (−0.8, 0.6) before the dot products | P1 s13 |
| 008 | 7:28 | s10 | label r̂ and θ̂ clearly | tip labels r̂, θ̂ on the arrows at the balloon for the whole scene | P1 s13 |
| 009 | 7:28 | s10 | label u_r and u_θ exactly when computed | the two component arrows grow on their words, labelled u_r = 6, u_θ = −8 | P1 s13 |
| 010 | 8:38 | s11 S4 | the eye is not at the centre (move up and left) | re-centre on the true circulation centre [pending data report: the HRRR pressure minimum sits 13.7 km S of the IBTrACS centre, build1_log §9] | P1 s19 |
| 011 | 9:17 | s11 S10 | what does 12.5 mean, how is it different from 37? | D10: ring average, 45 km/h inward, "33 min to the eye if nothing changed", one lap 71 min, 3 m round per 1 m in (a spiral) | P1 s20 |
| 012 | 9:50 | s12 S1 | eastward vs northward curves not labelled (dashed or solid?) | end labels on the curves ("eastward u", "northward v") + legend swatches in the column | P1 s22 |
| 013 | 9:50 | s12 S1 | show how u, v are got at some ring points | three ring points (θ = 0°, 90°, 225°) marked on the ring and on the graph, each with its arrow split into east and north parts and numbers | P1 s21 |
| 014 | 10:04 | s12 S3 | tangential and radial curves not labelled | end labels "round: u_θ", "in/out: u_r" + legend | P1 s22 |
| 015 | 10:04 | s12 S3 | show the calculation at a few points | D11 at the same three points: u_r = u cos θ + v sin θ, u_θ = −u sin θ + v cos θ with the numbers | P1 s21 |
| 016 | 10:04 | s12 S4–S7 | the explanation after the plot is not understood | rewritten slowly: the u, v curves swing because the arrow turns as we go round; u_θ stays near 37 and u_r stays negative; dashed mean lines; one sentence per idea | P1 s22 |
| 017 | 10:04 | s12 S6 | how is the inflow angle different from the other angles? | D10 + a four-angle contrast picture: θ (where the point is), bearing (direction from north), α (how far axes turn), inflow angle (wind vs ring) | P1 s23 |
| 018 | 11:35 | s13 S7 | show dθ/dt = v/r (is it in the derivatives movie? no) | D16 from the arc-length rule, numbers 0.00148 rad/s, 71-min lap | P2 s08 |
| 019 | 11:21 | s13 S6 | why differentiate v θ̂? is v θ̂ the velocity? | D17: velocity = rate of change of the position r r̂; product rule; on a ring it is v θ̂ | P2 s09 |
| 020 | 11:21 | s13 | show dθ̂/dθ = −r̂ again, clearly | recalled from P2 s06 with its picture | P2 s10 |
| 021 | 11:21 | s13 S11 | how can a steady component still mean acceleration? | D19: speed vs velocity; velocity arrows tail to tail; the difference points at the eye | P2 s11 |
| 022 | 12:20 | s14 | is Ian shown correctly from the data? | data re-check [pending data report]; on screen: storm centre, time and product named on the source line | P1 s19, P2 s14 |
| 023 | 13:20 | s14b S1 | the layers show stripes: what are they? | the stripes are our rose hatching for inflow (never explained); replace by a zero contour + "−" glyph + colour-bar legend, or explain the hatch once [pending data report: confirm no data artefact] | P2 s15 |
| 024 | 13:20 | s14b | add a Bay of Bengal cyclone (Amphan, Aila or Sidr) | **Amphan (May 2020)** recommended (best open data: ERA5, IBTrACS, Himawari-8, GPM, Sentinel-1) [pending data report] | P2 s17–s19 |
| 025 | 13:20 | s14b | check Ian's data and maps; correct the stripes | data scout re-check [pending data report] | P1, P2 |
| 026 | 13:20 | s14b | if Ian cannot be corrected, use the Bay storm everywhere instead | every Ian scene is written swappable (§2d) | P1, P2 |
| 027 | 13:20 | s14b | research better or more detailed data sources | data scout [pending data report] | P1, P2 |
| 028 | 13:20 | s14b | research tools and pick the best maps/visualizations | data scout (Remotion/three vs CesiumJS vs GEE vs Python renders) [pending data report] | all |
| 029 | 13:55 | s14b S6 | show the vertical layers better (as in weather basics / derivatives) | stack redesign: height axis with km ticks, a tag per layer, side orbit, layers lit bottom to top (§2, P2 s15) | P2 s15 |
| 030 | 13:55 | s14b | values at each layer are hard to read | per-layer readout beside its layer ("975 hPa ≈ 0.3 km: −6 m/s") with a gold link; plus an r–z curtain (ring averages by height) | P2 s15, s16 |
| 031 | 13:55 | s14b | rotate the stack, view it from different angles | camera orbits round the stack from outside (az ± 40°, el 15° → 35°), one close look ≤ 6 s (§5b) | P2 s15 |
| 032 | 13:55 | s14b | which layer is at which height? | height axis on the stack edge + the layer tags | P2 s15 |
| 033 | 15:00 | s15 S2 | slice the Earth to show r at the centre (as in cross product Part 2) | half-Earth slice (reuse `ch00_cross_product_uses` s24 Globe3D) with r from the centre | P3 s04 |
| 034 | 15:52 | s16 S8 | Brest's 48.4° angle shows as a vertical line | the slice face through Brest's meridian, φ arc at the centre, seen at 15° from face-on | P3 s05 |
| 035 | 15:52 | s16 S10 | which is colatitude and which is latitude? | both arcs on the same face: φ from the equator (gold), colatitude from the pole (slate) | P3 s06 |
| 036 | 15:52 | s16 S7 | what is a parallel, clearly | the parallel through Brest drawn round the globe, then sliced across: a disc round the axis | P3 s05 |
| 037 | 15:52 | s16 S11 | how sine and cosine swap places | D26 on the right triangle: the two acute angles swap roles | P3 s06 |
| 038 | 16:23 | s17 S1 | move from the top to the bottom of the globe to show how meridians are drawn | a meridian drawn pole to pole while the camera follows it down | P3 s07 |
| 039 | 16:23 | s17 | move across the globe to show the meridians | camera turns east, meridians drawn every 30° | P3 s07 |
| 040 | 16:23 | s17 S2 | label the prime meridian and the continents, countries, oceans it crosses | camera runs down 0°: Arctic Ocean, UK (Greenwich), English Channel, France, Spain, Mediterranean, Algeria, Mali, Burkina Faso, Togo/Ghana, Gulf of Guinea, Atlantic, Southern Ocean, Antarctica (from Natural Earth, CHECK row) | P3 s08 |
| 041 | 16:23 | s17 S8 | show the graticule clearly | meridians + parallels every 15° drawn in turn, named on the word | P3 s09 |
| 042 | 17:13 | s18 S2 | Brest by cutting the globe: which angle is what, how measured | sliced globe (meridian plane through Brest) | P3 s11 |
| 043 | 17:13 | s18 | globe and flat diagram drawn at the same time, every update mirrored | new two-view component: 3-D slice left, 2-D diagram right, each item drawn in both on the same frame, a gold "same" tick between them | P3 s11–s13 |
| 044 | 17:49 | s18 S9 | show the calculations of a cos φ cos λ and a cos φ sin λ | D24 with Brest numbers (x = 4217, y = −332 km) and Khulna (x = 46, y = 5872 km) | P3 s13, s14 |
| 045 | 17:49 | s18 | draw those on the globe and the diagram together | the equatorial slice (top view) in the same two-view layout | P3 s13 |
| 046 | 18:07 | s18 S10 | how is z = a sin φ? why is it z, which way does z point? | D23: axes defined first (z along the spin axis to the North Pole, x to 0° on the equator, y to 90° E), then the right triangle | P3 s10, s12 |
| 047 | 18:09 | s18 S11 | write what is calculated, what 6371 and 0.748 are | CalcStack: "height above the equator plane: z = a sin φ = 6371 km × sin 48.4° = 6371 × 0.748 ≈ 4764 km", each factor named on screen | P3 s12 |
| 048 | 18:09 | s18 S11 | label the values on the picture, write the inputs | the legs labelled with their km on both views | P3 s12 |
| 049 | 18:09 | s18 S12 | the same for the next calculation | "distance from the axis: a cos φ = 6371 × 0.664 ≈ 4230 km" with labels | P3 s12 |
| 050 | 18:09 | s15 / s18 | write what a is and its value | "a: the Earth's radius ≈ 6400 km (6371 km)" from P3 s04 on, and the voice says "we call it a" (Must 17 option b) | P3 s04 |
| 051 | 19:07 | s19 S4 | what is U, how do we get U = Ω a cos φ? | D27: one lap of a circle of radius a cos φ per day; U = 2π a cos φ / T; Ω = 2π / T | P3 s15 |
| 052 | 20:10 | s20 S2 | how do we get δy (and its values)? | D28 on the slice: a meridian is a circle of radius a round the centre + the arc rule | P3 s16 |
| 053 | 20:10 | s20 / s21 | how do we get δx (and its values)? | D29: slice across at Brest's latitude, a disc of radius a cos φ + the arc rule | P3 s17 |
| 054 | 20:10 | all | clarify all other equations and calculations | rule for every part: goal → each factor named → CalcStack → meaning | all |
| 055 | 21:08 | s21 S2–S6 | the picture can be much clearer | two-view: the sliced globe with the parallel disc, and the flat strip of four 1° steps at four latitudes, side by side | P3 s17, s18 |
| 056 | 21:08 | s21 | explain and visualise all equations there, use the globe better | every number with its circle drawn on the globe | P3 s17, s18 |
| 057 | 23:08 | all | anything not shown or derived before must be explained | §3 rule; primers for the slope of sine/cosine (P2), the product rule (P2), adding up = integration (P3), logs (P5) | all |
| 058 | 23:08 | s23 S1 | how is dA calculated? | D30: a small patch is nearly a rectangle with sides a dφ and a cos φ dλ, at right angles; ERA5 box areas | P3 s20 |
| 059 | 23:16–24:16 | s23 S2–S11 | the calculations after it are not understood | D31 one move per step: strip area → slope of sine → stair-steps add up → band area 2π a² sin φ → fraction sin φ → Archimedes' cylinder | P3 s21, s22 |
| 060 | 25:26 | s24 S11 | after Brest and Singapore add Khulna (or the Bangladesh city the cyclone crossed) | Khulna (22.8° N, 89.6° E) [pending data report: the city nearest Amphan's track]: up differs from Brest's up by ≈ 76° | P4 s06 |
| 061 | 26:18 | s25 S7 | derive Di/Dt, Dj/Dt, Dk/Dt step by step | D35–D38 from Part 2's turning rules (no new tool) | P4 s08–s11 |
| 062 | 26:18 | s25 | if another video derived them, say so but still show them | said: "we derive them here; the cross product movie met a related idea" (no earlier movie derived them) | P4 s08 |
| 063 | 26:30 | s26 S3 | Dv/Dt · i = … not understood: derive step by step | D39: product rule on u i + v j + w k, then dot with i, one term at a time | P4 s12, s13 |
| 064 | 28:34 | s27 S8 | ∇T without derivation: here or in a later movie? | ≤ 1 min here, named pointer to #6 *The gradient*; #6 s22 rewritten as a full derivation (§3b) | P5 s05, #6 |
| 065 | 30:12 | s29 S4 | "Los Angeles" cut off at the left | Must 7 fix kept; label right of and below its dot | P5 s07 |
| 066 | 30:12 | s29 | the visualization of the calculation is hard to see | the slicing plane through London, LA and the centre drawn as a translucent disc; the angle σ drawn at the centre; numbers in the column | P5 s07 |
| 067 | 30:12 | s29 | why make this calculation, how does it make sense? | goal first: flight distance and fuel; then the plan | P5 s06 |
| 068 | 30:12 | s29 | how is d = a σ? what is σ? | D45: σ = the angle at the Earth's centre; cos σ = r̂₁·r̂₂ with both r̂ written out; the arc rule | P5 s07, s08 |
| 069 | 31:56 | s31 S1 | why x = a λ, y = a φ make sense for this flattening | D48: unroll along the equator and the meridians, where lengths are true | P5 s12 |
| 070 | 32:14 | s31 S4 | how do we write k = 1/cos φ? | D48: a parallel drawn 2π a long, true length 2π a cos φ | P5 s13 |
| 071 | 32:45 | s32 S1–S2 | explain the Mercator idea in detail, intuitively | D49: a small circle on the globe, its ellipse on the plain map, stretched back into a circle | P5 s14 |
| 072 | 33:11 | s32 S5 | how is dy what is shown? | D49 | P5 s14 |
| 073 | 33:11 | s30 / s32 | why is the rhumb line preferred by some? | D47 + D52: one compass setting for the whole trip; straight on Mercator | P5 s10, s16 |
| 074 | 33:17 | s32 S6 | how do we get y = a ln tan(π/4 + φ/2)? step by step, with numbers | D50: add up the steps (table), the formula that matches the sum, slope check | P5 s15 |
| 075 | 33:48 | s33 S1 | how is the stretch factor calculated? | D51: k in both directions → k²; 60° → 4, Svalbard → 23.9 | P5 s17 |
| 076 | 34:07 | s33 S5 | "true size: …" sits on Greenland | maps placed under the text with ≥ 40 px clear | P5 s17 |
| 077 | 34:18 | s34 S0 | the two maps touch | Should 9 fix kept (41-px gap) | P5 s18 |
| 078 | 35:19 | s35 S0 | start from the rotating globe, move up and zoom to the top, stop at the map | globe turns, the camera rises to above the North Pole, then the globe opens into the flat polar map (polar stereographic, named) | P5 s20 |
| 079 | 35:19 | s35 | label longitudes and latitudes | rings 30/45/60/75° N, spokes 0°, 90° E, 180°, 90° W | P5 s20 |
| 080 | 35:19 | s35 | label a few major areas and say where they are (lat, lon) | short tour: Greenland, Iceland, Scandinavia, Siberia, Alaska, Canada, Barents Sea, with lat/lon spoken for three of them | P5 s21 |
| 081 | 35:19 | s35 | remove the labels later if cluttered | labels fade to 40 % when the 10-hPa field arrives, then off | P5 s22 |
| 082 | 36:04 | s35 S6 | make the wind look natural, moving along the lines (as in weather basics) | streak trails advected along the 10-hPa wind (`diag.trajectories.advect_on_sphere`, fading tails) [pending data report: ERA5 10-hPa u, v for 21 Jan 2026] | P5 s22 |
| 083 | 37:04 | s36 S6 | did not understand what is shown from here | D56 rewritten: two origins, ring arrows round each, the radial share bars 1.9 vs 0.4, a flat wheel analogy first | P5 s24 |
| 084 | 37:47 | s37 S4 | show the derivation of ŷ′ = (−sin α, cos α), and in the graph | D05: the 90° rule from Part 1 applied to x̂′, drawn | P1 s15 |
| 085 | 38:00 | s37 S5–S6 | what are x′, y′ and why dot products? | D06: "how much of the arrow lies along each new axis", the shadow from the dot product movie | P1 s16 |
| 086 | 38:00 | s37 | don't rush | one move per sentence, beats on the numbers | P1 s14–s18 |
| 087 | 38:36 | s38 S1 | how do we suddenly get the rotation matrix? | D07: line the two equations up, collect the four numbers into a table | P1 s17 |
| 088 | 38:48 | s38 S2 | what are x_i C_ij and e_i · e′_j? go slowly | D08: index notation recalled (1a), j = 1 and j = 2 written out in full, the four dot products computed | P1 s18 |
| 089 | 38:48 | s38 S3–S6 | the rest of that frame is not understood | D09: polar components are axes turned by θ, shown with the balloon (53°, 6 and −8) | P1 s18 |
| 090 | 40:00 | s39 S3 | how do we get 329°, measured from which line? | D21: two coast points on a km map, the triangle, angle west of north, bearing from north clockwise (Part 1's bearing rule) | P2 s22 |
| 091 | 40:00 | s39 S6–S8 | explain the along/across calculations | D22: α = 90° − 329° ≡ 121°, x̂′ and ŷ′ written, two dot products | P2 s23 |
| 092 | 40:35 | s40 S1 | GEE before/after inundation slider for Ian's surge | Sentinel-1 (or optical) before and after Fort Myers Beach, a slider moving left to right [pending data report] | P2 s25 |
| 093 | 42:53 | s42 S2–S4 | du/dt = dU/dt + du′/dt: how is it true? | D41: the change of a sum is the sum of the changes, divide by Δt | P4 s16 |
| 094 | 43:21 | s42 S8 | explain the equation shown | D42: the parcel's acceleration = local change + advection; a sliding-pattern example where each piece changes but the sum doesn't | P4 s17 |
| 095 | 44:45 | s43 S9 | explain storm-relative winds clearly | D43: u′ = u − U drawn as arrow subtraction at two ring points | P4 s19 |
| 096 | 46:12 | s45 S3 | explain each term step by step | D44 one move per step | P4 s21, s22 |
| 097 | 46:12 | s45 S3 | what is τ and ∂p/∂τ? never shown before | D44: τ is the time on the clock of an observer riding with the storm's pressure pattern; the traveller's chain rule from #4 | P4 s21 |
| 098 | 46:12 | s45 | "hPa per hour" touches the bars; no text on visuals | Must 14 fix kept; new layout checked by the K6 gate | P4 s22 |
| 099 | — | all | later-movie concepts: ≤ 1 min, then name the movie | §3a table; named in the voice and as a keyword | all |
| 100 | — | all | explain what is not asked and not planned later | §3a "owner: here" rows (slopes of sine/cosine, product rule, integration, logs, Archimedes) | all |
| 101 | — | all | split into ≥ 4–5 parts with a smooth flow | §2: 5 parts, recap and teaser at each seam | all |
| 102 | — | all | research first: data sources, analyses, additions, time | §4 + the data report | — |
| 103 | — | all | revise the plan; build the parts in order; then revise #6; pause #6 | `series_plan_v6.md`; #6 paused, §3b | — |

### 1b. Review 1 (17 Must, 18 Should): keep, never regress
State after fix loop 1 (`build1_log.md` §9; source fixed, not re-rendered). "Guard" is what each part's storyboard and
builder must keep.

| Item | Build-1 fault | State | Lands in | Guard |
|---|---|---|---|---|
| Must 1 | s14 GOES plate unreadable, "eyewall" points at nothing | fixed (unlit quad, IBTrACS-centred crop, contrast stretch, gold eyewall ring) | P2 s12 | keep the fixed `goes_eye.jpg` look; source line "contrast enhanced" |
| Must 2 | raw TeX `u_θ` on s14 | fixed (KaTeX) | P2 s12–s13 | no raw TeX anywhere (static grep in the builder) |
| Must 3 | s14b heights unlabelled | fixed (column = stack, SideCallouts) | P2 s15 | superseded by the redesign: height axis + per-layer tags |
| Must 4 | s11 radial arrow invisible | fixed (ring-mean arrows) | P1 s20 | radial arrow ≥ 90 px, rose, pointing at the eye |
| Must 5 | s11 link through "anticlockwise" | fixed (SideCallout) | P1 s20 | links leave from their text's left edge |
| Must 6 | stretch bands mirrored into the SH (tissot a = 1 bug) | fixed in the builder (DC32b) | P5 s13–s18 | DC32b rows kept; every band north of the equator |
| Must 7 | "Los Angeles" clipped | fixed | P5 s07 | label inside the canvas |
| Must 8 | s29 calc row on the globe limb | fixed (x 1160) | P5 s07 | CalcStack x ≥ 1100 |
| Must 9 | "radius 1" clipped | fixed | P2 s04 | inside the frame |
| Must 10 | "+90°" cut at the top | fixed | P3 s05 | inside the frame |
| Must 11 | s19 labels pile up at the limb | fixed (`facing()` fade) | P3 s15 | keep `facing()` |
| Must 12 | "u′ = 1.5" runs into the equation | fixed | P4 s15 | column x ≥ 1100 |
| Must 13 | s43 links cross | fixed | P4 s18 | north above south, SideCallouts |
| Must 14 | s45 cramped, "hPa per hour" on the bars | fixed | P4 s22 | redesigned with more space (two scenes) |
| Must 15 | s40/s45 no colour bar; credit without time | fixed | P2 s24, P4 s22 | colour bar + dated credit on every data frame |
| Must 16 | s26 unexplained readouts | fixed (screen only) | P4 s14 | now re-voiced: the great-circle glider thought experiment is said |
| Must 17 | the symbol a never introduced | fixed (screen) | P3 s04 | now also spoken: "we call it a" |
| Should 1 | "2π r" on the circle's stroke | fixed | P1 s07 | outside the circle |
| Should 2 | θ̂ hats beside the θ | fixed (KaTeX) | all | KaTeX hats only |
| Should 3 | "two fairly steady numbers" overstated | fixed (screen) | P1 s22 | re-voiced: "spin stays near 37; inflow stays negative all the way round" |
| Should 4 | "official best track" jargon | fixed | P1 s20 | "official estimate" |
| Should 5 | s18 φ on the leg, tags crowded | fixed | P3 s11–s13 | redesigned two-view |
| Should 6 | "× 4.9 too wide" not spoken | fixed (screen) | P3 s19 | now spoken |
| Should 7 | δ vs d | fixed | P3 s20 | one symbol: Δ for finite steps, d for the tiny limit, said once |
| Should 8 | s27 bottom half empty | fixed | P5 s03–s04 | halves gate |
| Should 9 | Equal Earth under Mercator | fixed | P5 s18 | ≥ 40-px gap |
| Should 10 | s36 ticks without legend | fixed (bars 1.9 / 0.4) | P5 s24 | keep the bars |
| Should 11 | gauge vs NHC heights look contradictory | fixed (labels) | P2 s24 | keep "Fort Myers (upriver)" and "above the ground" |
| Should 12 | s39 links converge | fixed | P2 s23 | links end on their own targets |
| Should 13 | "minus thirty two" not voiced | **deferred → done now** | P2 s23 | the re-voice says "minus thirty two" |
| Should 14 | end card icon touches text | fixed | all | 24-px gap |
| Should 15 | coast segment not recorded | fixed (manifest) | P2 s23 | manifest `coast_segment` kept |
| Should 16 | "74 km" on the radius line | fixed | P3 s18 | nudge kept |
| Should 17 | "Brest" before the zoom settles | fixed | P4 s05 | label after the camera stops |
| Should 18 | halves WARN spans | fixed (opening keywords) | all | an opening keyword from frame 0 in every scene |

### 1c. Fix-loop-1 and K6 lessons carried into every part (`build1_log.md` §7–§9)
1. **Tissot circles on the real sphere** (`tissot_ellipses(…, a=EARTH_RADIUS)` then ÷ a; DC32b, 41 rows). Never call it with a = 1.
2. **GOES eye crop** centred on IBTrACS 18 UTC (26.6 N, 82.4 W), contrast-stretched, unlit, `toneMapped: false`.
3. **Manifest `coast_segment_s40`** (355.4° Pinellas; 329° SW Florida) kept and extended to the D21 points.
4. **GeoMap** body inside an overflow-hidden `<div>` (K6 measures clipped rasters correctly); `SourceBelow`, never a bare `SourceLine` outside an `<svg>`.
5. **R3F**: never a lower-case SVG tag inside a three tree (`<g>` → `<group>`); the SSR `--3d` gate must not hide React warnings.
6. **Halves**: the picture is there from frame 0; an opening keyword from the scene's first words in the column slot.
7. **Keyword swaps ≥ 8 frames apart; cameras ≤ 90 °/s, eased; one colour bar per picture, beside it; a source line under every data picture.**
8. **K6 cannot see** raw TeX, edge clipping, label-on-KaTeX, link crossings, text over a globe limb, an axis through a word: the builder checks those by eye on its own stills (review 1's lesson).
9. **Render assets staged into `movies/public`** before any bundle; one Remotion/Chrome job at a time; TEMP/TMP on G:.

---

## 2. The split

### 2a. The flow
```
P1 flat map         Cartesian → polar → radians → r̂, θ̂ (derived) → components → turned axes, the rotation matrix
                    → polar = axes turned by θ → Ian: spin and inflow round the eye
   teaser: "a parcel going round at a steady speed: is it accelerating?"
P2 turning arrows   slopes of sine and cosine → dr̂/dθ, dθ̂/dθ → velocity v θ̂ → acceleration −v²/r r̂ → the cylinder
                    → Ian in 3-D (stack + r–z curtain) → Amphan (Bay of Bengal) → turned axes at the coast → surge (GEE slider)
   teaser: "now the biggest round shape of all: the Earth"
P3 the sphere       sliced Earth → latitude, colatitude → meridians, prime meridian, graticule → position vector (two views,
                    Brest and Khulna) → ground speed → δy, δx → grid boxes → dA → band areas (integration, Archimedes)
   teaser: "a forecaster's own arrows: east, north and up, and how they turn as the air moves"
P4 frames           east-north-up at Brest, Trappes, Singapore, Khulna → how i, j, k turn (derived) → the metric terms
                    → frames that move: Galilean → accelerations agree → a moving storm (Ciarán) → the fixed barometer, ∂p/∂τ
   teaser: "the shortest way round the Earth, and how to flatten it onto a map"
P5 maps             great circle (d = a σ) → rhumb line → plate carrée (k) → Mercator (derived) → areas → Equal Earth
                    → scale factors (∇T pointer to #6) → why so many systems → the view from the pole, the polar vortex
   next movie: #6 The gradient
```
Each part follows the house arc (HOUSE_STYLE §2): s00 title with one sentence → hook → (Parts 2–5: "In Part N−1, we…"
recap ≤ 60 s) → building blocks → intuition → why → application → "To sum up" recap whose last sentence is the teaser →
the series end card word for word (maths-tutorial ending: decision 2 in §5). Scene ids below are the new part's ids;
"← sNN" names the build-1 scene reused. **K** = kept (light edits only), **R** = rewritten, **N** = new.

### 2b. Part 1 — `ch00_coordinates_flat` (#5a) · "Coordinates, Part 1 — Arrows on a flat map: polar coordinates and rotated axes"
- **Starts:** the opening title (a balloon's arrow sweeping round a polar grid, then Ian's ring arrows). **Stops:** after
  Ian's spin and inflow (old s12), recap, end card.
- **s00 sentence (draft):** "In this video, we'll learn coordinates on a flat map the easy way, and see how meteorology
  uses them to measure the winds round a hurricane's eye."
- **Est. narration:** ≈ 1530 s ≈ **25.5 min** (≈ 3620 words). Kept/rewritten old ≈ 757 s, new ≈ 675 s, recap + end ≈ 98 s.

| New | ← old | K/R/N | One line |
|---|---|---|---|
| s00_title | s00 | R | title "Coordinates, Part 1"; one sentence; polar sweep → Ian ring |
| s01_hook | s01 | R | "What are coordinates, and why more than one kind?" |
| s02_coordinates | s02 | K | origin, axes, the balloon (3, 4) km |
| s03_cartesian_arrows | s03 | K | x̂, ŷ, the same everywhere |
| s04_polar | s04 | K | r = 5 km by Pythagoras, θ ≈ 53° |
| s05_polar_back | s05 | K | x = r cos θ, y = r sin θ, checked |
| s06_bearings | s06 | K | compass bearing = 90° − θ; "wind from" |
| s07_radians | s07 | K | s = r θ, 1 rad ≈ 57°, rings 5 and 50 km (Should 1 kept) |
| s08_r_hat | s08 S0–S1 | R | r̂ = (cos θ, sin θ) from s05 with r = 1; balloon (0.6, 0.8) |
| s09_where_theta_grows | — | N | D01: hold r, turn θ: the balloon slides along the circle; the tangent ⟂ radius; anticlockwise |
| s10_turn_90 | — | N | D02: the 90° turn rule (a, b) → (−b, a), on x̂, ŷ, then on (3, 4) |
| s11_theta_hat | s08 S2–S7 | R | D03: θ̂ = r̂ turned 90°: the triangle turned, its legs swap; θ̂ = (−sin θ, cos θ); checks at 0°, 90°, the balloon |
| s12_arrows_depend | s08 S6–S7 | R | move the balloon round: r̂, θ̂ turn with it; x̂, ŷ don't |
| s13_components | s10 | R | D04 with every value on screen (u, θ, r̂, θ̂), u_r = 6 and u_θ = −8 labelled as they appear, the wind rebuilt from them |
| s14_turn_axes | s37 S0–S3 | R | "keep the arrow, turn the rulers"; x̂′ = (cos α, sin α) (s08 again) |
| s15_y_prime | s37 S4 | N | D05: ŷ′ by the 90° rule, drawn |
| s16_new_components | s37 S5–S10 | R | D06: x′, y′ as shadows on the new axes; 30°: 8.7 and −5; length 10 |
| s17_matrix | s38 S0–S1 | R | D07: line the two equations up → the 2 × 2 table, row × column |
| s18_index_form | s38 S2–S6 | R | D08 + D09: x′_j = x_i C_ij written out for j = 1, 2; C_ij = e_i · e′_j, all four computed; polar = axes turned by θ |
| s19_ian_polar | s11 S0–S6 | R | Ian at 18 UTC 28 Sep 2022, origin in the eye (re-centred) [pending data report] |
| s20_spin_inflow | s11 S7–S14 | R | ring 25 km: spin ≈ 37, inflow ≈ −12.5 m/s; D10 meaning of 12.5 (Must 4, 5; Should 4 kept) |
| s21_ring_points | — | N | D11: three ring points, each wind split into u, v and into u_r, u_θ with numbers |
| s22_why_polar_storm | s12 S0–S5 | R | labelled curves (u, v swing; u_θ, u_r steady/negative), dashed means |
| s23_inflow_angle | s12 S6–S8 | R | four angles side by side; inflow angle ≈ 19°; vorticity pointer (U10) |
| s24_recap | s46 part | N | "To sum up …", last sentence the teaser to Part 2 |
| s25_end | s47 | K | series end card ("The notebook for coordinates …") |

**Derivations (Part 1).**
- **D01 θ̂ points the way θ grows.** (1) hold r at 5 km, turn θ a little; (2) the balloon slides along the circle of
  radius 5 km; (3) its distance from the station does not change, so the move has no part along r̂: it is at right
  angles to r̂ (the tangent is perpendicular to the radius); (4) of the two right angles, θ grows anticlockwise, so θ̂ is
  r̂ turned by +90°.
- **D02 the 90° turn rule.** (1) turn x̂ = (1, 0) by 90° anticlockwise: (0, 1); (2) turn ŷ = (0, 1): (−1, 0); (3) any
  arrow is a x̂ + b ŷ, and turning the whole arrow turns each piece; (4) so (a, b) → a(0, 1) + b(−1, 0) = (−b, a);
  (5) check on (3, 4) → (−4, 3): length 5, dot product (3)(−4) + (4)(3) = 0, so a right angle.
- **D03 θ̂ = (−sin θ, cos θ).** (1) r̂ = (cos θ, sin θ) (s05 with r = 1); (2) the rule with a = cos θ, b = sin θ;
  (3) picture: the r̂ triangle turned 90°: the east leg cos θ now points north, the north leg sin θ now points west;
  (4) checks: θ = 0 → θ̂ = north; θ = 90° → θ̂ = west; (5) balloon (0.6, 0.8) → (−0.8, 0.6), length 1, dot 0.
- **D04 components are dot products** (recap of the dot product movie). (1) the part along a unit vector is the dot
  product (the shadow); (2) u_r = (10)(0.6) + (0)(0.8) = 6; (3) u_θ = (10)(−0.8) + (0)(0.6) = −8; (4) rebuild:
  6 r̂ − 8 θ̂ = (3.6 + 6.4, 4.8 − 4.8) = (10, 0); (5) length √(36 + 64) = 10.
- **D05 ŷ′ = (−sin α, cos α):** D02 applied to x̂′ = (cos α, sin α), drawn on the turned axes.
- **D06 x′ = x cos α + y sin α, y′ = −x sin α + y cos α:** (1) "how much of the arrow lies along x̂′" = the dot product;
  (2) (x, y)·(cos α, sin α); (3) multiply out; (4) the same with ŷ′; (5) α = 30°: 10 × 0.866 ≈ 8.7, −10 × 0.5 = −5;
  length still 10.
- **D07 the rotation matrix:** (1) write the two lines with x under x and y under y; (2) the four numbers make a 2 × 2
  table; (3) "new = table × old", row times column, shown for the first row; (4) each number is a direction cosine:
  the dot product of an old and a new unit vector = the cosine of the angle between them.
- **D08 x′_j = x_i C_ij, C_ij = e_i · e′_j:** (1) recall from the vectors and index notation movie: x₁ = x, x₂ = y,
  e₁ = x̂, e₂ = ŷ, a repeated index is summed; (2) compute C₁₁ = x̂·x̂′ = cos α, C₁₂ = x̂·ŷ′ = −sin α, C₂₁ = ŷ·x̂′ = sin α,
  C₂₂ = ŷ·ŷ′ = cos α; (3) j = 1: x′₁ = x₁C₁₁ + x₂C₂₁ = x cos α + y sin α; (4) j = 2: x′₂ = x₁C₁₂ + x₂C₂₂ =
  −x sin α + y cos α; (5) both match D06. Pointer: *Tensors made easy* (T08) takes this rule further (≤ 15 s).
- **D09 polar components are a rotation by θ:** (1) set α = θ: x̂′ = r̂, ŷ′ = θ̂; (2) so (u_r, u_θ) = (x′, y′);
  (3) α = 53°: (6, −8), as in s13; (4) the only difference: in polar coordinates the angle changes from place to place.
- **D10 what the ring numbers mean:** (1) the ring average = add the 72 values, divide by 72; (2) −12.5 m/s ≈ 45 km/h
  towards the eye; (3) if it went on, a parcel 25 km out would reach the eye in 25 000 / 12.5 = 2000 s ≈ 33 min;
  (4) one lap at 37 m/s takes 2π × 25 km / 37 m/s ≈ 71 min, so the air spirals in (it rises in the eyewall instead of
  reaching the eye: one sentence, pointer U15); (5) inflow angle: tan β = 12.5 / 37, β ≈ 19°: the angle between the
  wind and the ring's tangent θ̂, unlike θ (where the point is), the bearing (direction from north) and α (how far the
  axes turn).
- **D11 three ring points:** u, v from the data at θ = 0°, 90°, 225° (say), then u_r = u cos θ + v sin θ and
  u_θ = −u sin θ + v cos θ (D06 with α = θ), numbers from the build (CHECK rows).

**Physics sources.** `fluidpy.core.coords.polar_from_cartesian`, `cartesian_from_polar_coords`, `unit_vectors_polar`,
`velocity_components`; `fluidpy.core.tensors.rotation_matrix_2d` (α = 30°, 90°, θ); `fluidpy.geo.atmos.wind_components`;
`fluidpy.diag.cyclone.storm_centre` + `storm_relative_wind` (HRRR 3 km, 18 UTC) [pending data report].
**Visual notes.** The 90° turn is animated as a real rotation of the triangle (not a cross-fade). Every number in a
CalcStack has its piece of the picture highlighted with a gold link (HOUSE_STYLE §6). The ring points are the same three
dots on the map, on the ring graph and in the column. Ian's map keeps its colour bar (0–50 m/s) and source line.

### 2c. Part 2 — `ch00_coordinates_storm` (#5b) · "Coordinates, Part 2 — Inside a tropical cyclone: turning arrows and cylindrical coordinates"
- **Starts:** title (a parcel going round the eye with its velocity arrow turning, the inward acceleration arrow
  appearing). **Stops:** after the surge and the GEE slider, recap, end card.
- **s00 sentence (draft):** "In this video, we'll learn how turning arrows and cylinders work the easy way, and see how
  meteorology uses them to understand a hurricane's spin, its winds in three dimensions, and its storm surge."
- **Opening recap (s02, ≤ 60 s):** "In Part 1, we met polar coordinates, the arrows r hat and theta hat, and the spin and
  inflow round Hurricane Ian's eye…"
- **Est. narration:** ≈ 1540 s ≈ **25.6 min** (≈ 3640 words). Old ≈ 359 s, new ≈ 1082 s, recap + end ≈ 98 s.

| New | ← old | K/R/N | One line |
|---|---|---|---|
| s00_title | — | N | title "Coordinates, Part 2"; parcel on a ring, turning velocity arrow |
| s01_hook | — | N | "A parcel goes round at a steady speed. Is it accelerating?" (prediction asked, not answered) |
| s02_part1_recap | — | N | r, θ, r̂, θ̂, components, Ian's 37 and −12.5 |
| s03_tip_on_circle | — | N | D12 (1)–(3): the tip of r̂ is the point (cos θ, sin θ); turn by Δθ: it moves Δθ along θ̂ |
| s04_slopes_sin_cos | s09 S0–S4 | R | D12 (4)–(6): slopes of cosine and sine, numeric check; "radius 1" inside (Must 9) |
| s05_dr_dtheta | s09 S4–S5 | R | D13: dr̂/dθ = θ̂ |
| s06_dtheta_dtheta | s09 S6–S7 | R | D14: θ̂ drawn from the same tail, its tip slides along −r̂; 90° rule twice; numeric check |
| s07_product_rule | — | N | D15: a number times an arrow, both changing (primer, with v θ̂ as the example) |
| s08_dtheta_dt | s13 S7 | R | D16: dθ/dt = v/r from the arc rule; 0.00148 rad/s, 71-min lap |
| s09_velocity | s13 S5–S6 | R | D17: position r r̂ → velocity v θ̂ |
| s10_acceleration | s13 S6–S9 | R | D18: −v²/r r̂, 0.055 m/s², units, about 180 × smaller than gravity |
| s11_steady_but_turning | s13 S10–S11 | R | D19: velocity arrows tail to tail; the difference points in; the pressure force supplies it (gradient wind pointer M03, ≤ 30 s) |
| s12_cylinder | s14 S0–S6 | K | r, θ, z; eyewall; cylinder (Must 1, 2 kept) |
| s13_three_parts | s14 S7–S8 | K | u_r, u_θ, w; only r̂, θ̂ turn |
| s14_ian_check | — | N | short: which product, which hour, why ERA5 for the 3-D view (smooths the peak), where the centre is [pending data report] |
| s15_ian_stack | s14b | R | stack redesign: 5–6 layers, height axis, per-layer tags and readouts, orbit from outside, one close look; stripes replaced (U-CO-023) [pending data report] |
| s16_ian_curtain | — | N | D20: the ring average at every radius and height → an r–z curtain: in at the bottom, up near the eye, out at the top |
| s17_amphan_intro | — | N | the Bay of Bengal: Amphan, 20 May 2020; globe zoom to the Bay, the Sundarbans, Kolkata, Khulna; zoom back out [pending data report] |
| s18_amphan_ring | — | N | Amphan's spin and inflow on a ring, numbers beside Ian's; same anticlockwise sense (NH) [pending data report] |
| s19_amphan_stack | — | N | Amphan's layers (or curtain), its own colour bar and source [pending data report] |
| s20_why_three_d | s14b S12–S13 | R | "in, up, out" with r, θ, z; "directions, not speeds" |
| s21_coast_axes | s39 S0–S2 | R | turned axes at a coast (Part 1's rule) |
| s22_coast_angle | s39 S2–S3 | R | D21: 329° from two coast points on a km map |
| s23_along_across | s39 S4–S8 | R | D22 with α = 121°: along ≈ 9, across ≈ −32 m/s ("minus thirty two", Should 13); Should 12, 15 kept |
| s24_surge | s40 S0–S6 | R | surge 3–4.5 m at Fort Myers Beach; Tampa Bay offshore +11.5, water fell (Must 15, Should 11 kept) |
| s25_gee_slider | — | N | before/after inundation slider at Fort Myers Beach [pending data report]; pointer to the floods movies (F32) and storm surge (F19) |
| s26_recap | — | N | "To sum up …", teaser to Part 3 |
| s27_end | s47 | K | end card |

**Derivations (Part 2).**
- **D12 slopes of cosine and sine** (owner: here; #4 did not teach them). (1) the tip of r̂ is the point (cos θ, sin θ)
  on a circle of radius 1; (2) turn by a small Δθ: by the arc rule the tip moves 1 × Δθ; (3) it moves along θ̂ =
  (−sin θ, cos θ) (Part 1); (4) so cos θ changes by about −sin θ Δθ and sin θ by about cos θ Δθ; (5) divide by Δθ and
  let it shrink (the limit from the derivatives movie): the slope of cos θ is −sin θ, of sin θ is cos θ; (6) check at
  53.13° with Δθ = 0.01: (−0.803, 0.596) against (−0.8, 0.6).
- **D13 dr̂/dθ = θ̂:** steps (2)–(5) of D12 written as one arrow: Δr̂ ≈ θ̂ Δθ, divide by Δθ.
- **D14 dθ̂/dθ = −r̂:** (1) θ̂ is also an arrow of length 1, and it turns with r̂; (2) draw both from the same tail;
  (3) θ̂'s tip moves Δθ along θ̂ turned by +90°; (4) the 90° rule on (−sin θ, cos θ) gives (−cos θ, −sin θ) = −r̂;
  (5) the same from D12's slopes, component by component; (6) in words: as the balloon goes round, θ̂ swings
  towards the direction pointing back at the station; numeric check (−0.596, −0.803).
- **D15 product rule for a number times an arrow** (owner: here). (1) at t: v θ̂; at t + Δt: (v + Δv)(θ̂ + Δθ̂);
  (2) multiply out: v θ̂ + Δv θ̂ + v Δθ̂ + Δv Δθ̂; (3) subtract v θ̂; (4) Δv Δθ̂ is tiny times tiny, so it vanishes
  in the limit; (5) divide by Δt.
- **D16 dθ/dt = v/r:** (1) arc rule s = r θ; (2) in Δt the parcel moves Δs = v Δt along the ring; (3) Δθ = Δs / r;
  (4) Δθ/Δt = v/r; (5) 37 / 25 000 = 0.00148 rad/s; one lap 2π / 0.00148 ≈ 4250 s ≈ 71 min.
- **D17 velocity on a ring is v θ̂:** (1) position = r r̂ (distance times direction); (2) product rule;
  (3) on a ring dr/dt = 0; (4) chain rule (derivatives movie): dr̂/dt = (dr̂/dθ)(dθ/dt) = θ̂ v/r; (5) r × θ̂ v/r = v θ̂.
- **D18 acceleration = −(v²/r) r̂:** (1) a = d(v θ̂)/dt; (2) product rule: (dv/dt) θ̂ + v dθ̂/dt; (3) steady spin:
  dv/dt = 0; (4) chain rule: dθ̂/dt = (dθ̂/dθ)(dθ/dt) = −r̂ v/r; (5) a = −(v²/r) r̂; (6) units m²/s² ÷ m = m/s²;
  (7) 37² / 25 000 ≈ 0.055 m/s², about 180 × smaller than gravity.
- **D19 steady speed, changing velocity:** velocity = speed and direction; two arrows 1 min apart moved tail to tail,
  the short difference arrow points at the eye.
- **D20 the azimuthal mean:** average round each ring at each height = the "θ-average"; why cylindrical coordinates
  make it one line.
- **D21 the coast angle 329°:** (1) two points on the SW Florida coast, A south and B north [coordinates from the data
  report]; (2) on the local km map (kilometres from latitude and longitude come in Part 3: one sentence): Δeast ≈ −31 km,
  Δnorth ≈ +51 km [exact values from the build]; (3) tan of the angle west of north = 31/51 → ≈ 31°; (4) bearings run
  clockwise from north, so 360° − 31° = 329°.
- **D22 along and across:** (1) Part 1's rule: maths angle = 90° − bearing = −239°, the same as 121°; (2) x̂′ =
  (cos 121°, sin 121°) ≈ (−0.52, 0.86) along the coast, ŷ′ = (−0.86, −0.52) out to sea (WSW); (3) the wind from 222° at
  33 m/s: u ≈ 22, v ≈ 25 m/s [build values]; (4) along = u·x̂′ ≈ 9.4, across = u·ŷ′ ≈ −31.6 m/s: "minus" = onto the land.

**Physics sources.** `fluidpy.core.coords.unit_vectors_polar` (centred differences), `unit_vectors_cylindrical`;
`fluidpy.diag.cyclone.storm_relative_wind` (HRRR, ERA5 pressure levels; azimuthal means); `fluidpy.data.stack.stack_product`;
`fluidpy.geo.sphere.initial_bearing`; `fluidpy.geo.vectors.components_in_axes`; `fluidpy.data.coops.fetch_water_level`;
GEE Sentinel-1 GRD via a new tested fetcher (`fluidpy.data` route, disk guard, licence "contains modified Copernicus
Sentinel data") [pending data report]; Amphan: ERA5 (ARCO) + IBTrACS (`fluidpy.data.ibtracs`) [pending data report].

**Stack redesign (U-CO-028–032), from the weather-basics stacks B/C and the derivatives s09b stack.**
- **Layers:** 5–6 clearly separated layers (975, 850, 700, 500, 200, 125 hPa if the sixth adds the 3-km step).
- **Height axis:** on the stack's left edge, km ticks (0, 3, 6, 9, 12, 15 km, 52 px). Each layer has a tag at its right
  edge ("0.3 km", "1.5 km", …). The vertical exaggeration goes in the manifest.
- **Colour:** u_r on a diverging map centred on 0, with a **white zero contour** on each layer. Inflow is marked by a
  "−" glyph in the colour bar, not by hatching on the layers (U-CO-023). The colour bar sits beside the stack, always visible.
- **Lighting order:** one layer lit at a time, bottom to top, with its ring average written beside it and a gold link to the ring.
- **Camera:** orbits from outside (azimuth −40° → +40°, elevation 15° → 35°), never inside. One close look of at most
  6 s from the side; tangential arrows as moving dashes.
- **Then the curtain:** an r–z section (radius 0–500 km × height 0–16 km) of the ring-mean u_r, with w as arrows, so
  the in-up-out loop reads at once.

### 2d. Part 3 — `ch00_coordinates_sphere` (#5c) · "Coordinates, Part 3 — Our round Earth: latitude, longitude, distances and areas"
- **Starts:** title (the Earth sliced along Brest's meridian, the latitude arc opening). **Stops:** after band areas and
  the cos φ weighting, recap, end card.
- **s00 sentence (draft):** "In this video, we'll learn coordinates on our round Earth the easy way, and see how
  meteorology uses them to measure distances and areas on its weather grids."
- **Opening recap (s02, ≤ 60 s):** polar and cylindrical coordinates, arc length, the turning rules, Ian and Amphan.
- **Est. narration:** ≈ 1525 s ≈ **25.4 min** (≈ 3610 words). Old ≈ 572 s, new ≈ 780 s, recap + end ≈ 98 s, recap of P2 45 s.

| New | ← old | K/R/N | One line |
|---|---|---|---|
| s00_title | — | N | title "Coordinates, Part 3"; sliced Earth |
| s01_hook | — | N | "How do we say where a place is on a round Earth, and how far apart two places are?" |
| s02_part2_recap | — | N | ≤ 60 s |
| s03_sphere | s15 S0–S3 | R | origin at the Earth's centre; spherical coordinates |
| s04_slice_radius | s15 | R | half-Earth slice (cross-product Part 2 component): r from the centre; "the Earth's radius: we call it a ≈ 6400 km (6371 km)" (Must 17, U-CO-033, 050) |
| s05_latitude | s16 S0–S8 | R | φ on the slice face at the centre, Brest 48.4° N; equator 0, poles ±90 (Must 10 kept); the parallel drawn and sliced across |
| s06_colatitude | s16 S9–S11 | R | D26: colatitude from the pole, the sine/cosine swap on one triangle |
| s07_meridians | s17 S0–S1 | R | a meridian drawn top to bottom, then meridians every 30° as the globe turns |
| s08_prime_meridian | s17 S2 | R | the 0° meridian tour, places and seas named as the camera passes |
| s09_longitude_graticule | s17 S3–S8 | R | λ, Brest −4.5° (355.5° in 0–360 data); the graticule drawn line by line |
| s10_axes | — | N | D23 (1): x, y, z of the Earth defined (z up the spin axis to the North Pole) |
| s11_brest_side | s18 S0–S6 | R | two-view: sliced globe and side diagram drawn together |
| s12_brest_z | s18 S6–S8, S11–S12 | R | D23 (2)–(5): z = a sin φ ≈ 4764 km, distance from the axis a cos φ ≈ 4230 km, every factor named |
| s13_brest_top | s18 S7–S9 | R | D24: top view slice; x = a cos φ cos λ ≈ 4217, y ≈ −332 km |
| s14_khulna | — | N | D25: the same for Khulna (46, 5872, 2471 km); length check 6371 |
| s15_ground_speed | s19 | R | D27: U = Ω a cos φ; equator 465, Brest 308, Khulna 428, Longyearbyen 95 m/s (Must 11 kept) |
| s16_distance_north | s20 | R | D28 on the slice: Δy = a Δφ; 111.2 km; the nautical mile |
| s17_distance_east | s21 S0–S3 | R | D29: slice across at Brest's latitude: Δx = a cos φ Δλ |
| s18_degree_east | s21 S4–S10 | R | four latitudes side by side (111, 102 at Khulna, 74, 23 km, 0); Should 16 kept |
| s19_grid_boxes | s22 | R | ERA5 boxes 27.8 × 18.5 km (Brest), × 25.6 (Khulna), × 5.7 (Svalbard); "about five times too wide" spoken (Should 6); callback to Part 2's coast kilometres |
| s20_area_patch | s23 S0–S2 | R | D30: dA = a² cos φ dφ dλ; ERA5 box areas (≈ 773, 712, 513, 158 km²) |
| s21_adding_strips | s23 S3–S5 | R | D31 (1)–(5): strips round the Earth, the stair-steps of sin φ, "adding up is integrating" |
| s22_band_fraction | s23 S6–S11 | R | D31 (6)–(8): half the Earth between 30° S and 30° N; Archimedes' cylinder; cos φ weighting of a global mean |
| s23_recap | — | N | "To sum up …", teaser to Part 4 |
| s24_end | s47 | K | end card |

**Derivations (Part 3).**
- **D23 z = a sin φ and the distance from the axis a cos φ.** (1) define the axes: z along the spin axis towards the
  North Pole, x from the centre to 0° on the equator, y to 90° E; (2) slice along Brest's meridian: a right triangle with
  long side a and angle φ at the centre; (3) the side along the axis direction is the height above the equator plane:
  a sin φ (opposite side = long side × sine, Part 1 s05); (4) the side in the equator plane is a cos φ, the distance from
  the axis; (5) Brest: 6371 km × sin 48.4° = 6371 × 0.748 ≈ 4764 km; 6371 × 0.664 ≈ 4230 km (each factor named on screen).
- **D24 x = a cos φ cos λ, y = a cos φ sin λ:** (1) look down from above the North Pole; (2) in the equator plane Brest's
  foot is a cos φ from the centre at angle λ from x; (3) Part 1's polar rule with r = a cos φ, θ = λ; (4) Brest λ = −4.5°:
  x ≈ 4230 × 0.997 ≈ 4217 km, y ≈ 4230 × (−0.078) ≈ −332 km (small and negative: just west of 0°).
- **D25 Khulna** (22.8° N, 89.6° E): (46, 5872, 2471) km, almost on the y axis; length √(x² + y² + z²) = 6371 km.
- **D26 colatitude and the swap:** (1) colatitude = 90° − φ, the angle from the pole (Brest 41.6°); (2) on the same
  triangle the two acute angles add to 90°; (3) the side opposite one is next to the other, so sin(colatitude) = cos φ and
  cos(colatitude) = sin φ; (4) so z = a cos(colatitude): books using colatitude have cosine where we have sine.
- **D27 ground speed U = Ω a cos φ:** (1) the place goes once round a circle of radius a cos φ (s12) per turn of the Earth;
  (2) U = distance ÷ time = 2π a cos φ / T; (3) Ω = 2π / T is the spin rate in radians per second (from the cross product
  movie; T ≈ 23 h 56 min, one turn against the stars, one clause); (4) U = Ω a cos φ; (5) 7.29 × 10⁻⁵ × 6.371 × 10⁶ ≈
  465 m/s at the equator, × 0.664 ≈ 308 at Brest, × 0.922 ≈ 428 at Khulna; (6) it points east.
- **D28 Δy = a Δφ:** (1) slice along a meridian: it is a circle of radius a round the centre; (2) the arc rule;
  (3) 1° = π/180 = 0.01745 rad → 6371 × 0.01745 ≈ 111.2 km; 1′ ≈ 1.85 km.
- **D29 Δx = a cos φ Δλ:** (1) slice across at Brest's latitude: the parallel is a circle of radius a cos φ round the
  axis; (2) the arc rule with Δλ; (3) 1° at Brest: 4230 × 0.01745 ≈ 73.8 km; Khulna 102.5, Longyearbyen ≈ 22.8, pole 0.
- **D30 dA:** (1) a small patch between two meridians and two parallels; (2) its sides are Δx and Δy, at right angles
  (meridians cross parallels at right angles); (3) for a small patch the area ≈ Δx × Δy = a² cos φ Δφ Δλ; (4) in the
  limit, dA = a² cos φ dφ dλ; (5) ERA5 quarter-degree boxes: 27.8 × 27.8 ≈ 773 km² at the equator, 27.8 × 18.5 ≈ 513 at
  Brest, 27.8 × 5.7 ≈ 158 at Svalbard.
- **D31 band areas** (integration, owner: here). (1) a strip all round, from φ to φ + Δφ: area ≈ 2π a cos φ × a Δφ;
  (2) Part 2's slope of sine: Δ(sin φ) ≈ cos φ Δφ; (3) so the strip area ≈ 2π a² × Δ(sin φ); (4) stack the strips from
  the equator up: their Δ(sin φ) steps add up to sin φ − sin 0 (a staircase picture); (5) band area = 2π a² sin φ; this
  adding-up is called integration, ∫₀^φ cos φ′ dφ′ = sin φ; (6) the hemisphere (φ = 90°) is 2π a², so the band's share
  is sin φ: sin 30° = ½; (7) Archimedes' picture: the band has the same area as a cylinder band of the same height
  a sin φ wrapped round the Earth; (8) why a global mean weights each latitude by cos φ (toy: two boxes, then ERA5).

**Physics sources.** `fluidpy.geo.sphere.unit_vector`, `parallel_points`, `meridian_points`, `wrap_lon`,
`arc_lengths`, `band_area`, `band_fraction`, `polygon_area`; `fluidpy.geo.constants.EARTH_RADIUS`, `OMEGA`;
`fluidpy.core.coords.cartesian_from_spherical` (colatitude bridge); `fluidpy.diag.climatology.global_mean`;
`fluidpy.data.naturalearth` (prime-meridian crossings: new CHECK rows).
**New component.** `TwoViewSlice` (house kit candidate): a three.js half-Earth (from `kit_cp`) on the left, an SVG
diagram on the right, both driven by one list of items {kind, frame}; an item appears in both views on the same frame,
with one gold tick between its two copies. The equatorial slice (top view) uses the same component.

### 2e. Part 4 — `ch00_coordinates_frames` (#5d) · "Coordinates, Part 4 — Moving frames: local axes and storm-relative winds"
- **Starts:** title (four stations with their own east-north-up arrows on the globe). **Stops:** after the fixed
  barometer, recap, end card.
- **s00 sentence (draft):** "In this video, we'll learn local frames, and frames that move, the easy way, and see how
  meteorology uses them to follow the winds and a moving storm."
- **Opening recap (s02, ≤ 60 s):** latitude, longitude, the position vector, δx and δy.
- **Est. narration:** ≈ 1535 s ≈ **25.6 min** (≈ 3630 words). Old ≈ 532 s, new ≈ 830 s, recap + end ≈ 98 s, recap of P3 45 s.

| New | ← old | K/R/N | One line |
|---|---|---|---|
| s00_title | — | N | title "Coordinates, Part 4" |
| s01_hook | — | N | "A forecaster at Brest uses east, north and up. Are those the same arrows at Khulna?" |
| s02_part3_recap | — | N | ≤ 60 s |
| s03_enu | s24 S0–S7 | R | i east, j north, k up at Brest; v = u i + v j + w k; i × j = k (cross product movie) |
| s04_enu_build | — | N | D33: k = r̂ (Part 3); i by the 90° rule in the top view; j by the 90° rule in the side view |
| s05_other_stations | s24 S8–S11 | R | zoom out (Should 17): Trappes 4.3°, Singapore 101° |
| s06_khulna | — | N | Khulna next to the others: up differs by ≈ 76° (D34); the Bay seen from the globe (U-CO-060) |
| s07_arrows_turn | s25 S0–S4 | R | the plane flying east 1 h, its east arrow swings 12° (kept) |
| s08_i_east | s25 S5–S7 | R | D35: moving east turns i like θ̂ round the parallel's circle |
| s09_jk_north | — | N | D36: moving north turns j, k like θ̂, r̂ round the meridian's circle |
| s10_jk_east | — | N | D37: moving east tilts j and k too |
| s11_add_motions | — | N | D38: add the two motions; the three rates on screen, with a 10-m/s number at Brest |
| s12_whole_vector | s26 S0–S2 | R | Newton's law is about the whole vector; D39 (1)–(3) |
| s13_metric_i | s26 S3 | R | D39 (4)–(7): Dv/Dt · i one term at a time |
| s14_metric_size | s26 S4–S10 | R | the glider thought experiment (Must 16, re-voiced), the size 1.6 × 10⁻⁵ vs Coriolis 1.0 × 10⁻³, 66 ×; pointer R04 |
| s15_galilean | s41 | K | the train: 20 + 1.5 = 21.5 m/s; x = x′ + U t (Must 12 kept) |
| s16_accel_same | s42 S0–S5 | R | D41 step by step; the falling ball |
| s17_parcel_accel | s42 S6–S10 | R | D42: local change + advection; a sliding-pattern example; rotating frames add Coriolis (cross product movie) |
| s18_ciaran | s43 S0–S7 | K | Ciarán 1–2 Nov 2023, 15 m/s ENE; south ≈ 19, north ≈ 8 (Must 13 kept) |
| s19_storm_relative | s43 S8–S9 | R | D43: u′ = u − U drawn at two ring points; "what you'd feel riding with the storm"; pointer U13 (≤ 15 s) |
| s20_invariant | s44 | K | ring spin ≈ 14, inflow ≈ 6 in both frames; Brest gust 84 kt |
| s21_tau | s45 S0–S4 | R | D44 (1)–(4): τ defined, the rider's rate, the traveller's chain rule |
| s22_barometer | s45 S4–S8 | R | D44 (5)–(7): Plymouth −3.8 = −0.6 − 3.2 hPa/h, with U and the gradient shown (Must 14, 15 kept); pointers T04, M25 |
| s23_recap | — | N | "To sum up …", teaser to Part 5 |
| s24_end | s47 | K | end card |

**Derivations (Part 4).** (Equations from the page images p082–p083: (2.36), (2.39a–c), (2.45); never labelled on screen.)
- **D33 the local arrows in Earth axes:** (1) k = r̂ = (cos φ cos λ, cos φ sin λ, sin φ) (Part 3 with a = 1); (2) top
  view: east is the polar θ̂ of the equator plane at angle λ: i = (−sin λ, cos λ, 0) (Part 1's 90° rule); (3) side
  view: north is the meridian's θ̂ at angle φ: j = (−sin φ cos λ, −sin φ sin λ, cos φ); (4) checks: lengths 1, dot
  products 0, i × j = k.
- **D34 how far apart two "ups" are:** cos of the angle = k₁ · k₂ (dot product movie): Brest–Trappes 4.3°,
  Brest–Khulna 75.7°, Brest–Singapore 101.0°.
- **D35 Di/Dt** (2.39a): (1) going east, a parcel goes round its parallel, a circle of radius a cos φ round the axis;
  (2) i plays θ̂, and R̂ (pointing straight out from the axis) plays r̂; (3) Part 2: dθ̂/dθ = −r̂, so Δi ≈ −R̂ Δλ;
  (4) Part 2's D16 with radius a cos φ: Δλ/Δt = u / (a cos φ); (5) Di/Dt = −(u / (a cos φ)) R̂; (6) the side view: R̂ =
  k cos φ − j sin φ, so −R̂ = j sin φ − k cos φ; (7) result: Di/Dt = (u / (a cos φ))(j sin φ − k cos φ); (8) going
  north leaves i alone (i is at right angles to the meridian's plane, which does not turn).
- **D36 going north:** (1) the parcel goes round a meridian, a circle of radius a round the centre; (2) j plays θ̂, k
  plays r̂; (3) Δφ/Δt = v / a; (4) Dk/Dt = (v/a) j, Dj/Dt = −(v/a) k.
- **D37 going east tilts j and k:** (1) side view: k = cos φ R̂ + sin φ ẑ and j = −sin φ R̂ + cos φ ẑ (ẑ the spin axis);
  (2) ẑ never turns; R̂ turns into i at the rate u / (a cos φ) (Part 2: dr̂/dθ = θ̂); (3) Dk/Dt = cos φ × u/(a cos φ) i
  = (u/a) i; (4) Dj/Dt = −sin φ × u/(a cos φ) i = −(u/a) tan φ i.
- **D38 add the two motions** (each rate is a speed over a radius, Part 2's pattern): Dj/Dt = −i (u/a) tan φ − k v/a
  (2.39b); Dk/Dt = i u/a + j v/a (2.39c). Number: u = 10 m/s at Brest: i turns 10 / 4.23 × 10⁶ ≈ 2.4 × 10⁻⁶ rad/s,
  about 12° per day. One sentence: "the cross product movie met a rotation rate like this; here we built it from turning circles".
- **D39 Dv/Dt · i** (2.45, first bracket). (1) v = u i + v j + w k; (2) the product rule on each of the three terms:
  Dv/Dt = (Du/Dt) i + u Di/Dt + (Dv/Dt) j + v Dj/Dt + (Dw/Dt) k + w Dk/Dt; (3) the goal: the eastward part, so dot with
  i; (4) i·i = 1, i·j = 0, i·k = 0, i · Di/Dt = 0 (D35 has no i part); (5) i · Dj/Dt = −(u/a) tan φ, so v times it gives
  −uv tan φ / a; (6) i · Dk/Dt = u/a, so w times it gives +uw/a; (7) Dv/Dt · i = Du/Dt − uv tan φ / a + uw/a;
  (8) size: u = v = 10 m/s at 45°: 100 × 1 / 6.371 × 10⁶ ≈ 1.6 × 10⁻⁵ m/s², against Coriolis 1.03 × 10⁻⁴ × 10 ≈ 1.0 ×
  10⁻³: about 66 times smaller. Pointer: *From F = ma to the equation of motion* (R04) uses these terms (≤ 20 s).
- **D41 du/dt = dU/dt + du′/dt:** (1) u = U + u′ at every moment; (2) over Δt: Δu = ΔU + Δu′ (the change of a sum is the
  sum of the changes); (3) divide by Δt; (4) the limit; (5) the train's velocity is steady: dU/dt = 0; (6) so du/dt = du′/dt.
- **D42 the parcel's acceleration in a fluid:** (1) in a fluid we follow an air parcel, not a ball; (2) the derivatives
  movie's material derivative, now for each wind component: local change + advection, ∂u/∂t + (u·∇)u; (3) a 1-D example:
  a pattern sliding east at U: on the ground the local change and the advection are both non-zero; riding with the
  pattern the local change is zero; (4) their sums are equal; (5) a turning frame adds Coriolis and centrifugal terms
  (cross product movie on our spinning Earth). Pointers: *The material derivative* (T04), *Vector identities II* (T06), ≤ 30 s.
- **D43 storm-relative wind:** (1) from D41's u = U + u′: u′ = u − U; (2) at a south-side point: 19 m/s east minus the
  storm's 15 m/s ENE, drawn as arrow subtraction; (3) at a north-side point; (4) the ring averages of spin and inflow do
  not change: a uniform wind adds as much on one side as it takes on the other (flat circle exact; ≈ 2 % on the sphere,
  build-1 DC54).
- **D44 ∂p/∂t = ∂p/∂τ − U·∇p:** (1) τ: the time on the clock of an observer riding with the storm's pressure pattern;
  ∂p/∂τ is the change that rider sees (the storm deepening or filling); (2) the derivatives movie's traveller: a traveller
  moving at U sees ∂p/∂t + U·∇p; (3) the rider is that traveller, so ∂p/∂τ = ∂p/∂t + U·∇p; (4) move U·∇p to the other
  side: ∂p/∂t = ∂p/∂τ − U·∇p; (5) Plymouth, midnight: U ≈ 15 m/s = 54 km/h, the pressure rising along U at ≈ 0.059 hPa/km
  [build value], so U·∇p ≈ 3.2 hPa/h; (6) the barometer: −3.8 hPa/h = −0.6 (storm changing) − 3.2 (storm arriving);
  (7) in words: most of what the barometer saw was the storm arriving.

**Physics sources.** `fluidpy.geo.sphere.enu_basis`, `unit_vector`, `central_angle`; `fluidpy.geo.frames.unit_vector_rates`,
`metric_terms`, `coriolis_parameter`, `great_circle` (glider); `fluidpy.core.kinematics.galilean_transform`,
`acceleration`; `fluidpy.diag.cyclone.track_by_continuity`, `storm_relative_wind`; `fluidpy.geo.sphere.gradient`
(Plymouth msl). All exist and are tested (build 1).

### 2f. Part 5 — `ch00_coordinates_maps` (#5e) · "Coordinates, Part 5 — Routes and maps: great circles and map projections"
- **Starts:** title (the London–Los Angeles great circle on the globe, then the same route curving on Mercator).
  **Stops:** after the polar vortex in polar coordinates, recap, end card. The next movie is #6 *The gradient*.
- **s00 sentence (draft):** "In this video, we'll learn routes and maps of our round Earth the easy way, and see how
  meteorology uses them to plan flights and read maps from above the pole."
- **Opening recap (s02, ≤ 60 s):** the position vector, δx and δy, local arrows, frames.
- **Est. narration:** ≈ 1393 s ≈ **23.2 min** (≈ 3300 words). Old ≈ 580 s, new ≈ 640 s, recap + end ≈ 98 s, recap of P4 45 s.

| New | ← old | K/R/N | One line |
|---|---|---|---|
| s00_title | — | N | title "Coordinates, Part 5" |
| s01_hook | — | N | "What is the shortest way from London to Los Angeles, and why does it look curved on most maps?" |
| s02_part4_recap | — | N | ≤ 60 s |
| s03_curvilinear | s27 S0–S6 | R | coordinate lines curve; scale factors r, a, a cos φ (Should 8 kept) |
| s04_scale_factors | s27 S6–S7 | R | scale factor = metres per unit of the coordinate, from Part 3's δx, δy |
| s05_gradient_preview | s27 S8–S10 | R | ∇T on the sphere ≤ 1 min, named pointer "next in this series: *The gradient*"; pressure as a vertical coordinate (M07) one clause |
| s06_shortest_way | s29 S0–S2 | R | goal first: flight distance, fuel and time |
| s07_great_circle | s29 S3–S6 | R | D45 (1)–(3): the slicing plane through both cities and the centre, σ at the centre (Must 7, 8 kept) |
| s08_sigma | s29 S6–S9 | R | D45 (4)–(7): r̂₁·r̂₂ written out, σ ≈ 78.7°, d ≈ 8760 km |
| s09_route_shape | s29 S9–S11 | K | leaves London NW (312°), up to 62° N near Greenland |
| s10_rhumb | s30 | R | D47: one compass setting; 258°, 9730 km, 11 % longer; why sailors liked it |
| s11_flattening | s31 S0–S1 | K | the orange-peel problem |
| s12_plate_carree | s31 S1–S3 | R | D48 (1)–(3): x = a λ, y = a φ, true along the equator and the meridians |
| s13_stretch_k | s31 S4–S7 | R | D48 (4)–(6): k = 1/cos φ; Brest 1.5, Svalbard 4.9 (Must 6 kept) |
| s14_mercator_idea | s32 S0–S5 | R | D49: a small circle → ellipse → stretched back to a circle; conformal |
| s15_mercator_y | s32 S5–S8 | R | D50: adding up the steps (table), y = a ln tan(π/4 + φ/2), slope check, the pole at infinity |
| s16_rhumb_straight | s32 S4 | R | D52: constant bearing is a straight line on Mercator |
| s17_area_stretch | s33 | R | D51: k²; Greenland vs Africa 14 ×; maps under the text (U-CO-076) |
| s18_equal_earth | s34 | K | Equal Earth; shapes skew; pick the map for the job (Should 9 kept); M02 pointer for chart projections |
| s19_why_many | s28 | R | "There are three good reasons": shape, measurement, meaning (the series' why) |
| s20_globe_to_pole | s35 S0–S2 | R | the turning globe, the camera rising above the North Pole, the globe opening into the flat polar map; rings and spokes labelled |
| s21_where_is_what | — | N | a short tour of the polar map: Greenland, Iceland, Scandinavia, Siberia, Alaska, Canada, Barents Sea, lat/lon spoken for three |
| s22_vortex | s35 S3–S7 | R | 10-hPa heights, 21 Jan 2026; natural streak trails along the contours [pending data report] |
| s23_vortex_components | s36 S0–S5 | R | D55: east = tangential, north = −radial; westerlies anticlockwise seen from above the North Pole |
| s24_origin_choice | s36 S5–S8 | R | D56: two origins (the pole, the vortex centre at 72.9° N), radial share 1.9 vs 0.4 (Should 10 kept); pointers U09, G03 |
| s25_recap | s46 part | N | "To sum up …"; the last sentence names *The gradient* as the next movie |
| s26_end | s47 | K | end card |

**Derivations (Part 5).**
- **D45 d = a σ:** (1) a great circle's centre is the Earth's centre, so its radius is a; (2) σ = the angle between the two
  position arrows at the centre; (3) the arc rule: d = a σ (σ in radians); (4) to find σ: the dot product of two unit
  arrows is the cosine of the angle between them (dot product movie); (5) r̂ from Part 3 with a = 1: London (0.622,
  −0.001, 0.783), Los Angeles (−0.392, −0.730, 0.560); (6) r̂₁·r̂₂ = −0.244 + 0.001 + 0.438 ≈ 0.195, so σ ≈ 78.7° ≈ 1.374
  rad; (7) d ≈ 6371 × 1.374 ≈ 8760 km.
- **D46 why the great circle is the shortest** (picture, no proof): of all circles through the two cities, the one
  through the centre is the biggest, so it bends least; a string pulled tight on a globe lies along it.
- **D47 the rhumb line:** one fixed compass bearing (258°) for the whole trip, easy to steer with a compass and no
  computer; it spirals towards a pole; 9730 km, about 11 % (≈ 970 km, about an hour of flying) longer.
- **D48 plate carrée:** (1) x = a λ: true length along the equator; (2) y = a φ: true length along every meridian
  (Part 3's δy); (3) a parallel at φ is drawn 2π a long; (4) its true length is 2π a cos φ (Part 3); (5) so east-west
  lengths are stretched by k = 2π a / (2π a cos φ) = 1/cos φ; (6) Brest 1/0.664 ≈ 1.5, Svalbard 1/0.205 ≈ 4.9.
- **D49 the Mercator idea:** (1) a small circle on the globe; (2) on the plain map it becomes an ellipse, k times too wide;
  (3) to make it round again, stretch north-south by the same k: each small step north a dφ is drawn k a dφ = a dφ / cos φ
  long; (4) shapes and angles are kept: conformal; (5) the price comes in D51.
- **D50 Mercator y by adding up:** (1) y = the sum of all the drawn steps a Δφ / cos φ from the equator to φ; (2) a table
  in 1° steps: y/a ≈ 0.175 at 10°, 0.549 at 30°, 0.968 at Brest, 1.317 at 60°, 2.27 at 78.2°; (3) the formula
  y = a ln tan(π/4 + φ/2) gives exactly these numbers (here "ln" is the natural logarithm, primed in one sentence with
  ln 1 = 0 and ln e = 1); (4) check its slope with the centred difference from the derivatives movie: at 60° it is
  ≈ 2.000 = 1/cos 60°; (5) as φ → 90°, tan → ∞, so the map can never reach the pole. (Symbolic chain-rule check:
  decision 5 in §5.)
- **D51 area stretch:** stretched by k in both directions, so areas by k²: 60° → 4; Svalbard → 23.9; Greenland 2.17 vs
  Africa 30.4 million km²: about 14 × in truth, about as big on Mercator (DC34).
- **D52 rhumb line straight on Mercator:** (1) a constant bearing means the east step and the north step keep the same
  ratio on the globe; (2) Mercator stretches both by the same k at each latitude; (3) so the ratio is the same on the map
  everywhere: a straight line.
- **D53 scale factors:** metres per unit of the coordinate: r for θ (Part 1), a for φ, a cos φ for λ (Part 3); the map's
  k compares the map's scale with the Earth's.
- **D54 the polar map as polar coordinates:** the distance from the middle grows with the distance from the pole
  (colatitude), the angle round is the longitude; the map is called polar stereographic (named, M02 recaps it).
- **D55 east = tangential, north = −radial:** at any point, i is the polar map's θ̂ (anticlockwise seen from above the
  North Pole) and j points at the middle, i.e. −r̂; so u_θ = u and u_r = −v.
- **D56 choosing the origin:** (1) a flat wheel spinning about a point off the middle: about its own centre the motion is
  all round; about another point it is partly in and out; (2) the vortex centre is at 72.9° N over the Barents Sea; (3)
  ring arrows drawn round each origin; (4) radial ÷ tangential ≈ 1.9 about the pole, ≈ 0.4 about the vortex centre.

**Physics sources.** `fluidpy.geo.sphere.central_angle`, `great_circle_distance`, `great_circle_points`,
`initial_bearing`, `great_circle_vertex`, `rhumb_line`, `isometric_latitude` (Mercator y), `polygon_area`;
`fluidpy.geo.mapproj.forward` ('platecarree', 'mercator', 'equalearth', 'polar_stereographic'), `scale_factors`,
`tissot_ellipses` (a = EARTH_RADIUS, DC32b); `fluidpy.core.curvilinear.scale_factors`; `fluidpy.data.psl.open_daily`
(10 hPa heights); `fluidpy.diag.trajectories.advect_on_sphere` (streak trails) [pending data report];
`fluidpy.diag.cyclone.storm_relative_wind` (two origins).

### 2g. Seams: recaps and teasers (draft lines, measured in the storyboards)
| Seam | Last recap sentence of the earlier part (teaser) | Opening recap of the next part (≤ 60 s) |
|---|---|---|
| P1 → P2 | "In Part 2, we'll ask whether air going round at a steady speed is accelerating, and look at a hurricane in three dimensions." | r, θ, r̂, θ̂, components as dot products, Ian's 37 round and 12.5 in |
| P2 → P3 | "In Part 3, we'll take these ideas to the biggest round shape of all: the Earth." | turning arrows, v θ̂ and −v²/r, r, θ, z, turned axes at a coast |
| P3 → P4 | "In Part 4, we'll stand at a weather station, and see how its own east, north and up arrows turn as the air moves." | latitude, longitude, the position vector, a sin φ and a cos φ, δx and δy |
| P4 → P5 | "In Part 5, we'll find the shortest way round the Earth, and see how to flatten it onto a map." | local arrows, how they turn, the metric terms, frames that move |
| P5 → #6 | "Next in this series, we'll measure how fast the temperature changes across a map: the gradient." | (#6 opens with its own hook; its s22 recaps Part 3) |

### 2h. Rules for all five parts
- **House style binding** (HOUSE_STYLE.md): no headings but the s00 title; keywords only; no boxes; no equation labels
  or book references; a data-source line and a colour bar on every data frame; 44-px floor; caption band empty; picture
  from frame 0; links never cross; the maths-tutorial end card word for word (decision 2).
- **Teaching (teaching-style):** goal first, one move per derivation step with its reason, easy | exact numbers
  ("≈ 6400 km (6371 km)"), every symbol said and written when it first appears, "clockwise" only with "seen from above"
  and the hemisphere, standard terms (air parcel, inflow, eyewall, colatitude, graticule …) defined once.
- **One set of places and numbers across all parts:** Brest 48.4° N, 4.5° W; Khulna 22.8° N, 89.6° E [pending data
  report]; Singapore 1.35° N; Trappes; Longyearbyen 78.2° N; London 51.5° N; Los Angeles 34.05° N; a = 6371 km;
  Ω = 7.29 × 10⁻⁵ s⁻¹. One build script per part, sharing a `_coords_common.py` of CHECK rows so a number never differs
  between parts (and matches #6, §3b).
- **Swappable data scenes:** every Ian scene names its product, time and centre in one parameter block; the Bay storm
  scenes take the same block; if the data report rules Ian out, P1 s19–s23 and P2 s14–s16, s21–s25 switch to the Bay storm
  with the same structure (the GEE slider then shows the Sundarbans coast).
- **Later-movie pointers** (§3a): spoken and written as a keyword ("more: *Vorticity in plain words*"), ≤ 1 min each.
- **Reuse:** house kit (`type`, `draw`, `tex`, `notes`, `extras`, `title`, `icons`, `frame`, `stack3d`, `wind`, `three3d`,
  `cam`, `bbox`, `col3d`); `kit_co` from build 1; the half-Earth slice and Globe3D from `kit_cp`; the weather-basics
  trails (`FlowParticles` + `advect_on_sphere`). New: `TwoViewSlice`, `TurnRule90` (an animated 90° rotation of an arrow and
  its component triangle), `RZCurtain`, `BeforeAfterSlider`, `GlobeToPolarMorph`. Each new piece is promoted to `house/kit`
  when a second movie needs it.

---

## 3. Concepts owned by later movies, and what #6 must change

### 3a. Later owners (v6 positions; ≤ 1 min here, the movie named in the voice and as a keyword)
| Concept touched here | Part · scene | Here | Owner (v6 pos) |
|---|---|---|---|
| Vorticity (a measure of spin) | P1 s23 | one sentence | U10 *Vorticity in plain words* (33) |
| Gradient wind balance (pressure force supplies −v²/r) | P2 s11 | ≤ 30 s | M03 *Wind on weather charts* (15) |
| Hurricane structure, eyewall rising, intensity classes (Amphan's "super cyclonic storm") | P1 s20, P2 s15–s18 | ≤ 1 min in total | U15 *How tropical cyclones form* (38) |
| Storm surge in full | P2 s24 | ≤ 1 min | F19 *…storm surge* (79) |
| Inundation mapping from Sentinel-1 | P2 s25 | the slider + one sentence | F32 *…floods II* (84) |
| Coastal upwelling (Ekman) | P2 s24 | one clause | R06 *Friction and Ekman layers* (113) |
| Centrifugal vs centripetal | P2 s10–s11 | one sentence | R01 *Circular motion* (108) |
| The gradient ∇T on the sphere | P5 s05 | ≤ 1 min | **#6 *The gradient* (12)**, s22–s23 (see §3b) |
| Pressure as a vertical coordinate | P5 s05 | one clause | M07 (17) |
| Metric terms in the momentum equation | P4 s14 | derived here; their use ≤ 20 s | R04 *From F = ma to the equation of motion* (111) |
| Coriolis and centrifugal in a turning frame | P4 s17 | ≤ 20 s (back-pointer) | #3 (done, 4), R02 (109) |
| The material derivative, advection of momentum | P4 s17 | ≤ 30 s | T04 (100), T06 (102) |
| Storm-relative helicity | P4 s19 | one clause | U13 *Severe storms* (36) |
| Pressure tendency maps, isallobars | P4 s22 | one clause | M25 *Reading maps over time I* (54) |
| Tensors | P1 s18 | ≤ 15 s | T08 *Tensors made easy* (104) |
| Chart projections (Lambert conformal), Tissot's indicatrix | P5 s18, s20 | names only | M02 (42) |
| Polar vortex, sudden warmings | P5 s22–s24 | ≤ 1 min | U09 (32), G03 (139) |
| Reading weather maps | P5 s18 | one clause | M05 onwards (43–56) |
| **Owned here (explained in full, no later owner):** slopes of sine and cosine (D12), the product rule (D15), adding up = integration (D31), Archimedes' band (D31), natural log as a name (D50), the 90° turn rule (D02), direction cosines (D07–D08), colatitude (D26), great-circle distance (D45), Mercator (D49–D50) | | full | — |

### 3b. What #6 *The gradient* must change (it is **paused**: no render until all five parts are final)
1. **s22_sphere → a full derivation of ∇T on the sphere.** Goal first, then: (1) the eastward slope is ΔT/Δx over a step
   east; (2) Part 3: Δx = a cos φ Δλ; (3) so ΔT/Δx = (1/(a cos φ)) ΔT/Δλ; (4) shrink the step with φ and the height held
   fixed: ∂T/∂x = (1/(a cos φ)) ∂T/∂λ ("partial by partial λ" said and defined); (5) the same northward with Δy = a Δφ;
   (6) assemble with i, j, k (Part 4): ∇T = i (1/(a cos φ)) ∂T/∂λ + j (1/a) ∂T/∂φ + k ∂T/∂z; (7) units check. Picture:
   the Part 3 sliced globe with Brest's parallel disc (reuse `TwoViewSlice`).
2. **s23_cos_example:** the two ERA5 points on a zoomed globe with their lat/lon; a CalcStack for Δx = a cos φ Δλ, then the
   slope, then the Svalbard factor (1/cos 78.2° ≈ 4.9) computed. **Reconcile Brest's quarter-degree width**: #5 says
   18.5 km at 48.4°, #6 says 18.4 km (≈ 48.5°): one shared CHECK row and one latitude for both.
3. **Pointer wording:** "as we saw in the coordinates movie" → "as we saw in Part 3 of the coordinates movies"; i, j, k
   recapped in ≤ 30 s from Part 4 instead of re-taught.
4. **No repeats:** the scale-factor idea (Part 5 s03–s04) is recapped in one sentence, not re-built.
5. **Renumbering:** #6 moves from v5 position 8 to v6 position 12; its storyboard's `series` block and any "next in this
   series" lines are checked against v6.
6. **Process:** #6's build 1 is K6-clean (k6r4) but unrendered. After the coordinates parts: re-voice s22–s23 (TTS
   splice), re-time, K6 re-shoot of the changed scenes, render, review. Estimated +3–4 min of narration.

---

## 4. Effort estimate

Reference rates (build 1, this machine: RTX A1000, one Remotion/Chrome job at a time): the TTS took 17.8 min for a
49-min movie; the render took ≈ 72 min for 48:46 (≈ 1.5 min per movie-minute); the K6 stills took ≈ 24 min per full set
(≈ 1 h with re-shoots); a full fix loop took ≈ 2–3 h of machine time.

| Part | Est. length | New narration | Scenes N / R / K = total | New data products | Build (agent) | Machine per pass | Passes | Machine total |
|---|---|---|---|---|---|---|---|---|
| 1 flat | 25.5 min | ≈ 11 min (+ 1.6 min recap/end) | 5 / 14 / 7 = 26 | 2: Ian re-centred ring + 3 ring points [pending] | ≈ 1 day (TurnRule90, rotation scenes) | TTS 9 min · K6 30–40 min · render 38 min | 2–3 | ≈ 3–4 h |
| 2 storm | 25.6 min | ≈ 18 min | 12 / 13 / 3 = 28 | 5: Ian stack v2 + r–z curtain, Amphan ring, Amphan stack/curtain, GEE before/after + mask, coast points [mostly pending] | ≈ 1.5–2 days (RZCurtain, BeforeAfterSlider, new fetcher) | 9 · 40 · 38 min | 2–3 | ≈ 4–5 h |
| 3 sphere | 25.4 min | ≈ 13 min | 6 / 18 / 1 = 25 | 2: prime-meridian crossings (Natural Earth), Khulna position + ERA5 box at Khulna | ≈ 1.5 days (TwoViewSlice, slice reuse) | 9 · 40 · 38 min | 2–3 | ≈ 3–4 h |
| 4 frames | 25.6 min | ≈ 14 min | 9 / 12 / 4 = 25 | 1: Khulna ENU + Plymouth ∇p along U (from data on disk) | ≈ 1 day | 9 · 35 · 38 min | 2–3 | ≈ 3–4 h |
| 5 maps | 23.2 min | ≈ 11 min | 5 / 18 / 4 = 27 | 2: polar-map labels + lat/lon, 10-hPa wind trails [pending] | ≈ 1.5 days (GlobeToPolarMorph) | 8 · 35 · 35 min | 2–3 | ≈ 3–4 h |
| **Total** | **≈ 125 min** | **≈ 78 min** | **37 / 75 / 19 = 131** | **12** | **≈ 7 days** | | | **≈ 16–21 h** |
| #6 revision | +3–4 min | ≈ 4 min | 2 rewritten | 0 | ≈ 0.5 day | splice + K6 + 48-min render | 1–2 | ≈ 2–3 h |

Notes: N = new, R = rewritten from a build-1 scene, K = kept with light edits; counts include titles, recaps and end cards. Reviews: 1 fresh review + 1 fix loop + 1 re-review per part
(≈ 1 h of agent time each). Disk: ≈ 2 GB of scratch per part on G: (stills, chunks), deleted after QA; C: has 48 GB free
today (the 45-GB action threshold is close: run the C: low-space action before the first render).

---

## 5. Risks, decisions, lexicon

### 5a. Biggest risks
1. **Total length.** ≈ 2 h over five parts (each ≈ 23–26 min, above the usual 8–18 min). The teaching sets it (HOUSE_STYLE §1),
   but the parts must stay tight: one idea per sentence, no repeats between parts beyond the ≤ 60-s recaps.
2. **Data (pending report).** Ian's eye position and the "stripes" may need a new centre or product. A good Bay of Bengal
   wind field at storm scale may not exist openly: ERA5 is 0.25° (≈ 28 km) and smooths the eye. IMDAA or HWRF archives
   may need accounts. Sentinel-1 may have no pass over Fort Myers in the 1–3 days after landfall: only S1A flew in 2022,
   on a 12-day repeat. The runner-ups are Sentinel-2/Landsat (clouds) or NOAA's public-domain post-storm aerial imagery.
   GEE is set up (project `uhiphd`, `.venv-maps`), but any GEE pull needs a tested `fluidpy.data` route and the disk guard.
3. **New maths load.** Slopes of sine and cosine, the product rule, integration and the natural log are not taught by any
   earlier movie. Each is built here in small steps; Mercator's closed form is the one place where a fully symbolic check
   would need two more facts (decision 5).
4. **New 3-D components** (TwoViewSlice, GlobeToPolarMorph, RZCurtain, BeforeAfterSlider) are the slowest part of the
   build and the likeliest K6 and halves failures. Prototype each as a captest before the part that needs it.
5. **Machine time and RAM:** five renders plus loops, one Remotion/Chrome job at a time; #6 waits; C: is near its 45-GB
   action threshold.
6. **Renumbering ripple:** v6 shifts every position from 8 on by +4. RESUME.md, knowledge files and any storyboard
   `series:` blocks that quote positions must be updated by the orchestrator. Spoken pointers name movies, not
   positions, so no narration changes.
7. **Consistency:** the same number in five parts and #6 (Brest's box width already differs: 18.5 vs 18.4 km). Shared
   CHECK rows are needed (§2h).

### 5b. Decisions for the user
1. **Five parts of ≈ 23–26 min (recommended)** or **six parts of ≈ 20 min.** For six, Part 2 splits after the 3-D stacks:
   "turning arrows and the hurricane in 3-D" ≈ 17 min, then "the coast, the surge and Amphan's landfall" ≈ 12 min.
2. **End card.** Either the maths-tutorial ending for all five parts (**recommended**: the concept is a maths tool,
   review 1's advice), or the weather ending for Part 2 (the hurricane) as the cross-product Part 2 precedent did.
3. **Bay of Bengal storm.** **Amphan, 20 May 2020 (recommended)**: ERA5, IBTrACS, Himawari-8, GPM and Sentinel-1 all exist.
   The alternatives are Sidr (2007; no Sentinel or Himawari) and Aila (2009). The city label (Khulna or another) follows
   the track in the data report.
4. **GEE slider source.** Sentinel-1 radar flood mask before/after (**recommended** if a pass exists within 3 days), else
   Sentinel-2 optical, else NOAA aerial imagery (public domain, very sharp, but a photo, not an inundation map).
5. **Mercator's closed form.** On screen: the add-up table, the formula matching it, and a numerical slope check
   (**recommended**; no new calculus). Or add the symbolic chain-rule check too. That needs the slope of ln x and of
   tan x, which no movie teaches yet (+≈ 1.5 min).
6. **Later-movie pointers on screen.** A keyword line naming the movie, e.g. "more: *Vorticity in plain words*".
   **Recommended**, as the feedback asks. The alternative is the voice only, which matches HOUSE_STYLE's
   "no references" rule more strictly.
7. **Build 1** stays unpublished as the archive (recommended), or is deleted after Part 5 is approved.

### 5c. Lexicon proposals (not added; check by ear in each part's dry run)
Amphan ("Um-pun"), Khulna ("Kool-nah"), Sundarbans ("Sun-der-bunz"), Satkhira ("Shat-kee-rah"), Kolkata ("Kol-kah-tah"),
Bakkhali ("Bok-kah-lee"), Sidr ("Sid-er"), Aila ("Eye-la"), Archimedes ("Ar-ki-mee-deez"), Greenwich ("Gren-itch"),
Descartes ("Day-kart"), Mercator, Gerardus, Galilei, Longyearbyen ("Long-yeer-bee-en"), Svalbard ("Svahl-bar"),
colatitude, graticule ("grat-i-kyool"), rhumb ("rum"), stereographic, Tissot ("Tee-so"), Barents ("Bar-ents"),
Burkina Faso, Togo. Already in the lexicon: Ciarán, ERA5, Trappes, Coriolis.
