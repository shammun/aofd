# Chapter 0 movie series: sequencing and content audit (2026-11-07, movie-director)

**Question (user):** "check whether all other videos are properly sequenced and their contents are properly and
sequentially planned or not."

**Scope.** All 180 movies of `series_plan_v6.md` (amended: seven Coordinates parts), the made movies' scripts and
storyboards, and the memory-level rules:
- basics before map reading;
- every concept explained before use;
- "made easy" removed;
- recall at the point of use;
- smooth teaser endings;
- every fact verified;
- no spoken "Step one".

The Coordinates parts' internal continuity is **not** redone here: `coordinates_series/continuity_plan.md` and
`master_plan_2026-11-07.md` stand, and are only cross-referenced. Two new Coordinates findings (spoken "Step one … six"
in 5d and 5e, and 5e's silent repeat of 1a's storm-relative wind) are added in §3.

**Method.**
- `deps_v6.py`, named in plan §6a, **is not in the repo**. A search of the project and the scratch folders found only
  references to it. I re-implemented the §6a checks: the script parses §4, §5 and §6 of the plan and checks that every
  prerequisite points earlier, every §4 home sits at or before position 44 and before its first need, and every §5
  "first taught" sits at or before "first used" with matching positions.
  - Result on the plan as written: **180 rows, 180 distinct IDs; 0 forward prerequisites, 0 unknown, 0 §5 violations,
    0 position mismatches, 0 §4 violations.**
- So **the plan is internally consistent.** The problems below come from checking the plan against **what the made
  movies actually say** (the spoken lines of every script, extracted scene by scene) and against the house rules added
  on 2026-11-06/07, which the plan predates.

---

## 0. Verdict in one paragraph

**The order of the blocks is right and does not need to change.** The opening runs 0.1b → #2 → 0.3 → #3 → 1a → #4 →
#5a–#5g → **#6 gradient → M01**, exactly as the user asked. After it come understanding (to pos 44), map reading
(45–58), forecasting (59–97), then later stages.

What does need fixing is **content and wording**, not positions:
1. One concept is worked three times with identical numbers. The ∇T example at Brest is done in 1a, #4 and #6, and #6
   would be the third, which is exactly where the user wants ∇T made clear.
2. "The easy way" is still spoken in eight made or written movies.
3. About 15 stale or wrong pointers sit in made movies and in the #69 storyboard. Eight of them are not yet in plan
   §10's queue.
4. Plan v6 §3 has re-scope notes that open movies with "recap (≤ 3 min)" blocks. Under the 2026-11-06 rule these become
   point-of-use recalls.
5. Two small sequence glitches in the forecasting block:
   - the "Heavy rainfall I / III / II" titles are seen in that order;
   - F37 (cold waves) sits in the heat-and-dry group.
6. The data-account first-need claim (F14, pos 76) is not what the case table says. EUMETSAT may be needed at
   **F22 (66)**, NCAR RDA at **F17 (78)**, and F14 itself needs no account.

Two local re-orders and one rename are recommended (§5). Everything else is fixed in place.

---

## 1. Key problems, most serious first

| # | Severity | Problem | Where | Fix (short) |
|---|---|---|---|---|
| P1 | **Must** (user instruction) | **#6 does not yet make ∇T clear.** ∇T is spread over s09, s17, s22–s23, s33, s33b, s34 and s36, between two long height and pressure blocks. It is never written out once as one equation with its three parts. Its main worked example (Brest: −3.2 and −2.5 °C per 100 km, length 4.1, the 34 m/s wind, 3.7 K/h) is the **same numbers already worked in 1a s24–s27 and in #4 s07**. #6 s22–s23 repeats 5g s06's Brest cos-φ example and its "almost five at Svalbard" | #6 `ch00_gradient` | A dedicated ∇T block (§2, #6), the split_plan §3b sphere derivation, and recall (not re-working) of the 1a/#4 Brest numbers and of 5g s06 |
| P2 | **Must** (rule of 2026-11-06, "ALL videos") | **"the easy way" is spoken in s00 and "made easy" is drawn on the title frame** of every made movie outside the Coordinates parts | 0.1b, #2, 0.3, #3, 1a, #4 (rendered); M01, 1b, #69 (written, not rendered); also the alternates 0.1 and 0.2 | Re-voice the one s00 sentence (TTS splice, ≈ 10 s each) and drop the "made easy" line. Ride on the pending §5b retro-fits. M01 and 1b get it before their TTS |
| P3 | **Must** | **Pointers in made movies that are now wrong** and are **not** in plan §10's queue | 1a s15, 1a s11, #4 s46, #6 s22 (in continuity_plan), #69 s02, s15, s18, s43, s47 | Exact rewrites in §3 |
| P4 | **Should** (house rule, plan-level) | **Plan v6 §3 tells 14 re-scoped movies to open with a "Recap (≤ 2–3 min)"** (U01, M03, M08, M16, U03, M13, U07, M04, U08, U13, U15, M02, M05, and M14's barb recap). Built as written, each would start with a "so far" block, which the user rejected on 2026-11-06 | `series_plan_v6.md` §3 | Rewrite each "Recap" bullet as **recalls at the point of use**: equation on screen, "derived in the <title> movie", one sentence. Keep the content list; move each item to the scene that uses it (§6, plan edits) |
| P5 | **Should** | **Spoken step numbering**: "Step one … Step five" in 5e s04, s05, s14 and "Step one … Step six" in 5d s18–s19. This breaks the spoken-wording rule of 2026-11-06 and was not caught by `continuity_plan.md` | 5d `ch00_coordinates_frames`, 5e `ch00_coordinates_moving` | "First, … Next, … Now, … So …". On-screen step chips stay |
| P6 | **Should** | **Repeated material across movies without a recall** | 5e s08–s12 vs 1a s12i (storm-relative wind, Ciarán, u − c); M01 s08–s09 vs #6 s12–s15 (contours, spacing, gradient across the lines); F19 vs 5b (Ian gauges, Nargis); F32 and CE15 vs 5b (Sentinel-1 before/after) and vs each other (CE15 "method" = F32) | Recall lines (§3); re-scope CE15 to the Derna case only, recalling F32's method |
| P7 | **Should** | **Data accounts: the plan's first-need claim is not what the case table says.** Plan v6 and the memory say all three accounts are first needed by F14 (pos 76). Per the v3 case table (§B1), F14 (Hagibis: Himawari AWS, GPM GMI, ASCAT) needs **no** account, only NASA Earthdata. **EUMETSAT** is first needed by **F22 (66)** for the Valencia 2024 Meteosat loop (open substitute: MODIS/VIIRS stills), else by F19 (81) for Meteosat-7 over Sidr and Aila. **NCAR RDA** is first needed by **F17 (78)** (Fani GFS 2019). **TIGGE** is first needed by **F17 (78)** (Fani) or **F19 (81)** (Sidr, Aila, Nargis) | plan §1a, §9; memory `remind-data-accounts` | Per-account first-need column (§4c). Reminder deadline moves to **pos 66**, or F22 is pinned to MODIS/VIIRS and the deadline stays at 78 |
| P8 | **Should** | **Forecasting titles out of order.** "Heavy rainfall I" is F21 (pos 65), "III" is F22 (66) and "II" is F20 (82), so a viewer meets I, III, II. **F37** "cold waves and the polar vortex link" is in the heat-and-dry group (92), after F26 heatwaves | plan §6, §7 | Rename F22 → "heavy rainfall II" and F20 → "heavy rainfall III" (IDs kept). Move F37 to the end of the winter group (after F25, before F26). Every prerequisite still points earlier (checked, §5) |
| P9 | **Should** | **The Hadley circulation is never explained before it is needed.** 0.3 s52 names the pressure belts and the ITCZ and says "how these belts are made … a later video on the general circulation" (G01, pos 139). U15 (40), U16 monsoon (41), F13 (75) and F17 (78) need "rising at the ITCZ, sinking in the subtropics, trades returning" as a picture. That is a basic term used in the understanding and map blocks without a home | U02 or U16; plan §4/§5 | Home a 1–2-min "Hadley circulation in words" in **U02** (convergence and vertical motion), recalled in U16. Add a b19 row to §4 |
| P10 | Could | **Plan prerequisites incomplete** (the spoken lines need them; all point earlier, so no reorder) | #6 (needs 1a, 0.3, #3, #5d), U18 (needs #5c), M25 (needs #5c), F32 (needs #5b), M17 (needs M16, already said in §3b but missing from §6) | Add to §6 (§6 below) |
| P11 | Could | **Later-stage tools with no home.** Complex exponentials (Euler's formula) are needed by W02 Fourier (123), but A01 complex variables is at 143. Kundu App. B items with no movie: method of characteristics (B.1.5–B.1.8), similarity variable (B.2.3, Ex. B.3), Dirac delta (B.4). "Solving whole equations on grids has its own movie" (#4 s46) points to no movie | W01, W02, T03; #4 s46 | Euler's formula as a short primer scene at the start of W02 (or move A01's first half before W01); characteristics + similarity → W01; Dirac delta → T03 (point source). #4 s46 re-voice (§3) |
| P12 | Could | **Plan housekeeping.** §6 statuses for #5a–#5g say "planned" (they are built and in the remake). §1b says "Part 5 ends by naming #6" (it is Part 7, 5g). `split_plan.md` §3b still says #6 is at "v6 position 12" (now 14) and "Part 5 s03–s04" for the scale factors (now 5f, Part 6). T08 is titled "**Tensors made easy**". `book.yaml → ch00.movies` still lists the six 2026-10-20 seeds | plan v6, split_plan, book.yaml | Orchestrator edits (§6) |

---

## 2. Every movie in plan order: what it teaches, what it assumes, problems

Legend:
- **OK** = everything it assumes is taught earlier, or explained on the spot in plain words.
- Positions are v6 (amended).
- "Uses early" = used before its home movie, but explained in words at that point. This is allowed, and the home movie
  must then recall it, not re-teach it from zero.

### 2a. Opening (pos 1–15): checked sentence by sentence against the scripts

| Pos | ID · slug | Status | Teaches | Assumes / uses early | Problems → fix |
|---|---|---|---|---|---|
| 1 | 0.1b `ch00_dot_product_v01b` (25:39) | done | dot product, components, cos form, unit vectors, work; isotherms, ∂T/∂x in words, **grad T (first)**, advection v·∇T, material derivative (named); runway, flux of sunlight, wind stress, pattern similarity | ∂ and D/Dt used early, explained in words (s13–s15) | s00 "the easy way" (P2). Pointers right: "the cross product, in the next video" (#2 is next); "the climate machine video" (M16) |
| 2 | #2 `ch00_cross_product` (32:40) | done | cross product, recipe, right-hand rule, torque, angular momentum, index form (first look) | 0.1b ✓; index notation forward-pointed to 1a ✓ | s00 "the easy way" (P2). s22w ×2 and s50 "next video" are already queued (§10: "Part 2") |
| 3 | 0.3 `ch00_weather_basics` (50:54) | done | pressure, hPa, hydrostatic, scale height, ∂p/∂z (in words), temperature with height, humidity, dew point, RH, cloud base, wind "from", fronts, air masses, isobars, pressure belts, ITCZ, Ciarán | — | s00 "the easy way" (P2). s52 pointer to the general-circulation video is fine, but the **Hadley picture has no home before U15/U16** (P9) |
| 4 | #3 `ch00_cross_product_uses` (40:57) | done | Ω, rotating frame, centrifugal, effective gravity, Coriolis −2Ω×u, f = 2Ω sin φ, inertial loops, grad p and −(1/ρ)∇p (stated), geostrophic wind (derived), Ciarán test, friction | #2 ✓, 0.3 ✓; d u/d t and grad p used early, in words | s00 "the easy way" (P2). Queued in §10: s01a, s01d, s47 "last video" → "Part 1"; **s27b vector triple product → "a rule a later video proves"** (1b is at 98) |
| 5 | 1a `ch00_vectors_index_notation` (34:36) | done | vectors, basis at Brest, adding (geostrophic, forces), subtracting (wind change, shear, hodograph, anomaly), relative velocity (storm-relative, Ciarán), index notation, ∂T/∂x_i, **∇T at Brest (−3.2, −2.5 per 100 km) and advection 3.7 K/h**, Kronecker δ | 0.1b ✓, #3 ✓ | s00 "the easy way" (P2). Queued: s34, s19, s12d, s12c. **New (not in §10):** s15 "The dot product has a whole movie of its own … where we take it apart fully" is in the future tense, but 0.1b was the first movie. s11 "Turning axes … get their own movie later" is now seven movies (§3) |
| 6 | #4 `ch00_derivatives_taylor` (46:39) | done | derivative as a limit, partial derivative, mixed partials, total differential, chain rule, traveller rate, **∂T/∂x at Brest −3.2 again**, change of variables, hydrostatic recall, exponential, first law, θ named, Taylor series, linearisation, Clausius–Clapeyron 7 %/K, σT⁴, finite differences | 1a ✓, 0.3 ✓ | s00 "the easy way" (P2). **s46 "Solving whole equations on grids has its own movie in this series"** → no such movie in the plan (P11) |
| 7–13 | #5a–#5g Coordinates, Parts 1–7 | remake per master plan | (see `continuity_plan.md` §1) | 0.1b, 1a, #2, #3, #4, 0.3 ✓ (every pointer checked: all earlier movies, or later movies by their current titles) | Covered by `continuity_plan.md` / `master_plan_2026-11-07.md`. **Add:** P5 (5d, 5e spoken "Step one…"); 5e s08–s12 recall 1a s12i ("we met the wind relative to a moving storm in the vectors movie: u minus c"), then go on to what is new (the Galilean proof, the ring split, ∂p/∂τ); 5e s14 uses grad p, so recall "grad p, from the cross product movie on our spinning Earth" |
| 14 | #6 `ch00_gradient` (31:43 build 1; paused) | revise | gradient of h, units, gradient field, directional derivative, steepest ascent, ⟂ to contours, spacing, lapse rate (∂T/∂z), three reasons, ∇ on the sphere, PGF box derivation −(1/ρ)∇p, Ciarán push, Coriolis link, vertical PGF, fronts, front stack, advection, sea breeze, jet, Gulf Stream | 0.1b, 1a, #3, #4, 0.3, #5c, #5d, #5f, #5g ✓ (all earlier) | **P1.** s00 still says "made easy" on the frame (continuity_plan §5). s22 "the coordinates movie". Ending has no teaser to M01. Its §6 prerequisite list lacks 1a, 0.3, #3, #5d (P10). Details below |
| 15 | M01 `ch00_contour_maps` (21:17, written 2026-10-30) | storyboard + script | isolines, interval, slicing, spacing, profile, isobaths, shapes (peak, ridge, valley, col), isobars, highs, lows, ridges, troughs, cols of pressure, isotherms, isohypses (named), family of iso-words | #6 ✓ (s02, s09, s20 say "the gradient movie"), 0.3 ✓ | s00 "the easy way" (P2). Written before the 2026-11-06/07 rules, so it needs: a fact table (R19 rule); the point-of-use recall pattern for #6's contour block, so s08–s09 say "as we saw in the gradient movie" and work **one new** case instead of re-deriving interval ÷ spacing; a teaser to U01 at the end |

#### #6 *The gradient*: the ∇T plan (P1)

This adds to `split_plan.md` §3b and `continuity_plan.md` §3 (#6). Both still apply: the full sphere derivation with
i, j, k from Part 4, the "Coordinates, Part 3 / Part 7" pointers, and "made easy" off.

1. **s00 sentence: make temperature visible.** "In this video, we'll learn the gradient, and see how meteorology uses it
   to find where the temperature and the pressure change fastest, which way the air is pushed, and where fronts are."
   Keep it to one sentence. Measure it.
2. **New s09a "grad capital T, put together"**, right after the gradient field (s09). Goal first: "We've met the
   temperature gradient twice already. Let's put it together in one place." Then:
   - recall 0.1b s15: straight isotherms one degree per 100 km apart give grad T = 10⁻⁵ K/m pointing east, keyword
     "met in the dot product movie";
   - write **∇T = x̂ ∂T/∂x + ŷ ∂T/∂y + ẑ ∂T/∂z** on screen, each term said in words with its unit (K/m);
   - Brest's two horizontal parts are **recalled** from 1a s25 and #4 s07, not re-read off the map: −3.2 and −2.5 °C per
     100 km, keyword "measured in the vectors movie";
   - what is new here: the **length** √(3.2² + 2.5²) ≈ 4.1 °C per 100 km and the **direction** ≈ 230°, towards the warm
     south-west, both computed on screen;
   - then the vertical part, as a pointer to s17: "and going up, about minus six point eight degrees per kilometre", so
     the vertical part is about 160 times the horizontal one (6.8 per km against 0.041 per km). Show the ratio as a
     calculation.
   - About 60–75 s, to be measured.
3. **s17 (lapse rate)** ends by putting its number into the ẑ slot of the s09a equation (one sentence).
4. **s22–s23 (sphere).** Use the split_plan §3b derivation, then the **ERA5 Brest example only**. 5g s06 already gave
   "a third too small" and "almost five at Svalbard", so #6 says it in one recall sentence ("as we found in Coordinates,
   Part 7") and computes the Brest slope, which 5g did not. Reconcile 18.4 vs 18.5 km (split_plan §3b item 2).
5. **s34 (advection).** 1a s26 already computed 3.7 K/h at Brest from the same wind. Recall it ("we found this in the
   vectors movie"). The new part, which 1a did not have, is the angle form: |∇T| × cos 138° × speed. Keep it, and drop
   the duplicate sentences.
6. **Ending.** The s38 recap gets one ∇T sentence ("grad capital T points towards warmer air, across the isotherms, and
   its length is how fast the temperature changes"). Add a teaser: "Next in this series, we'll learn to read the lines
   the gradient crosses: contour maps, from mountains to isobars." Fade picture and music together.
7. Net change: about +3–4 min (sphere derivation) + ~1 min (s09a) − ~1 min (repeats cut). Measure with a `tools/tts.py`
   dry run when the script is revised. Run the fact table before TTS (R19: tropopause 8–12 km, times in UTC).

### 2b. Understanding block (pos 16–44)

All prerequisites point earlier (script check). Content flags:

| Pos | ID | Assumes (key) | Flag → fix |
|---|---|---|---|
| 16 | U01 PGF recap, thermal lows/highs, lee troughs | #3, #6, 0.3, M01 | **P4**: the "Recap ≤ 3 min" opening becomes point-of-use recalls. A warm column expanding needs the scale height H = RT/g (0.3 s17–s18), so recall that at the heat-low scene (M08 derives the hypsometric equation later) |
| 17 | M03 wind on charts | #3, #5b (−v²/r), #6, U01 | P4 (recall #3's Coriolis and geostrophic wind where used). Gradient wind recalls 5b's centripetal acceleration "derived in Coordinates, Part 2" |
| 18 | U02 convergence, vertical motion | #4, #6, M03 | **P9**: home of "the Hadley circulation in words" (rising at the ITCZ, sinking in the subtropics, trades returning; recall 0.3 s52) |
| 19–21 | M07, M08, M09 | ✓ | M08: P4 |
| 22 | M16 climate machine | #4, 0.3, 0.1b | P4. 0.1b s20c promises "builds on exactly this", so M16 must recall 0.1b's sunlight-flux dot product on screen |
| 23–27 | U03, M12, M13, M14, M15 | ✓ | P4 for U03, M13, M14 (barb recap at point of use), M15 |
| 28–31 | U04, U05, U06, U07 | ✓ | U07: P4 |
| 32 | M04 fronts | 0.3, M01, M03, M12 | P4. #6 s33–s33b already showed the front as a ∇T band and a sloping surface, so recall it ("the gradient movie found the front on four layers") |
| 33–38 | U08 … U13 | ✓ | U08, U13: P4. U13's storm-relative wind recalls **#5e** (it currently names only 1a) |
| 39–41 | U14, U15, U16 | ✓ | U15: P4. U16 recalls the Hadley picture from U02 (P9) |
| 42 | U17 satellites | M16, M15, U12, #3 | ASCAT and GPM GMI need **NASA Earthdata** (confirm the login works; it is used by the registry) |
| 43 | U18 radar | U04, U05, #5a, 0.1b, M16 | Add prerequisite **#5c**: beam height over the curved Earth (P10) |
| 44 | M02 maps made + chart frame | #5c, #5g, 0.3, M01, M03, U17 | P4. It is built from #69 s02–s11: **#69 s02 "We built them in the coordinates movie"** → "in the coordinates movies, Parts 3 and 7" (§3) |

**Basics-before-map-reading rule (memory):** satisfied by the plan (§4 homes all ≤ 44, script-checked), **except the
Hadley circulation (P9)**, which M05/M22 and the F-tropical movies lean on. With b19 added to U02, the rule holds.

### 2c. Map-reading block (pos 45–58)

Order M05 → M06 → M10 → M21 → M22 → M23 → M11 → M24 → M17 → M18 → M19 → M25 → M26 → M20 is a sensible surface →
upper air → thickness → sections → soundings → images → models → time → capstone path. All prerequisites point earlier.

Flags:
- **The #69 storyboard (v3, 55:17) is the scene source for M02, M05, M06, M10, M17, M18, M19 and M20.** Its spoken
  pointers are stale and must be fixed when it is split (§3):
  - s02, coordinates;
  - s15 "the geostrophic wind movie" (now #3);
  - s18 "the Coriolis and geostrophic wind movies" (now #3 and M03);
  - s43 "the movie on how contour maps are made" (that is M02 itself);
  - **s47 "Isentropic maps … had their own movie too"**: R10 is at pos 119, after the map block, so the past tense is
    wrong.
- M25 adds prerequisite #5c, for the motion vector's map distance (P10).
- M17 adds M16 to its §6 prerequisites (aerosols; already promised in §3b).

### 2d. Forecasting block (pos 59–97)

The easy → hard order (method → everyday rain → mid-latitude → heavy rain → convection → tropical → monsoon → floods →
winter → heat and dry → warnings → capstone) is sound for a first-time learner. Flags:

| Item | Problem | Fix |
|---|---|---|
| F21 / F22 / F20 titles | "Heavy rainfall I" (65), "III" (66), "II" (82) | Rename: F22 → "…heavy rainfall II: training storms and flash floods"; F20 → "…heavy rainfall III: TC rain and stalled storms". IDs, folders and positions unchanged |
| F37 | Cold waves and the polar-vortex link sit in "heat and dry" (92), after heatwaves | Move to winter, right after F25 (new pos 91; F26 → 92). Prerequisites U09, M04, M21, F25 still earlier |
| F19 (81) | 5b now carries Ian's gauges (+2.2 / −1.8 m), the along/across calculation and Nargis, Amphan and Idai before/after | F19 **recalls** 5b (equations "derived in Coordinates, Part 1", results "found in Part 2"). Its new content is surge components, tide, shelf, inverse barometer in full, Sidr and Aila from `reports/data/ch00_storm_events_archive.md`, and warnings. Plan §3b's F19 note is updated to "along/across calculation in #5b" |
| F32 (86) | 5b showed the Amphan Sentinel-1 before/after and a pixel count | Add prerequisite #5b; F32 opens the method (dB change, threshold, masks) with a recall of 5b's slider |
| F22 (66) | Valencia DANA satellite = Meteosat (EUMETSAT account) | Data account (P7): use MODIS/VIIRS stills, or open the account before pos 66 |
| F10 | "from outlook to warning" sits inside the convection group, and F27 is warnings in full | Fine: F10 is the convective product chain, F27 is impacts and CPP. No change |

### 2e. Later stages (pos 98–180)

| Item | Flag | Fix |
|---|---|---|
| 1b (98) | Its three recap scenes of 1a are justified: 93 movies apart, and it is not a series part. Queued pointers (§10: s05, s32, s15) stand | s00 "the easy way" (P2) before TTS |
| T04 material derivative (102) | Pointed to by 0.1b, 1a, #4, #6 and 5e as "takes this apart fully". All of those first exposures say "later", which is correct | T04 recalls 0.1b s13 (the first sight of D/Dt) and #4's traveller rate |
| T08 | Title "Tensors made easy" | Rename "Tensors" (5a s19 already says "our tensors movie") |
| W02 (123) | Fourier needs e^{ikx}; A01 complex variables is at 143 | Euler's formula primer scene at the start of W02, with A01 recalling it (P11) |
| W01 (122) | Characteristics and similarity variables (App. B) have no home | Add them to W01's scope; Dirac delta → T03 |
| CE15 (178) | "Mapping a disaster from space (method; Derna 2023)" repeats F32's method | Re-scope to "Derna 2023 from space", recalling F32 |
| CE04–CE17 | Topical "2026" movies at pos 167–180 will date | Keep IDs; write the year into each scope only when its storyboard is written |
| R02 | Must state the hemisphere sign and that β is the northward gradient of f | Already in scope; no change |

---

## 3. Made movies vs the current order and house rules

### 3a. Pointer fixes NOT yet in plan v6 §10 (add them to the queue)

| Movie · scene | Now says | Change to | Why |
|---|---|---|---|
| 1a s15_dot_product | "The dot product has a whole movie of its own in this series, where we take it apart fully." | "We took the dot product apart in the dot product movie, the first in this series." | 0.1b is pos 1, so the future tense is wrong |
| 1a s11_other_axes | "Turning axes, and the other coordinates we use on a round Earth, get their own movie later in the series." | "Turning axes, and the other coordinates we use on a round Earth, get a series of their own later: the coordinates movies." | #5 is now seven parts (#5a–#5g) |
| #4 s46_fd_grid | "Solving whole equations on grids has its own movie in this series." | "Solving whole equations on grids comes later in this series, with partial differential equations." (and add finite-difference solving to W01's scope) | No numerical-methods movie in the plan |
| #6 s22_sphere | "…as we saw in the coordinates movie." | As in `continuity_plan.md` §3 (#6): "derived in Coordinates, Part 3" and "met in Coordinates, Part 7", equations on screen | Same as before (listed there; repeated here for completeness) |
| 5e s08–s12 | storm-relative wind introduced as new | Add one recall: "We met the wind relative to a moving storm in the vectors movie: the wind minus the storm's velocity." Keyword "met in the vectors movie" | 1a s12i did it on the same storm |
| 5d s18–s19, 5e s04, s05, s14 | "Step one … Step six" spoken | "First, … Next, … Then … Now … So …" | Spoken-wording rule (2026-11-06) |
| #69 s02_two_angles | "We built them in the coordinates movie" | "We built them in the coordinates movies, Parts 3 and 7" | Seven parts |
| #69 s15_geostrophic_idea | "We built the answer in the geostrophic wind movie." | "We built the answer in the cross product movie on our spinning Earth." | The geostrophic wind is derived in #3 (R05 is the full one, after the map block) |
| #69 s18_bb_south | "…as we saw in the Coriolis and geostrophic wind movies." | "…as we saw in the movie on wind on weather charts." | M03 owns the equatorial failure |
| #69 s43_station_map | "the method from the movie on how contour maps are made" | (inside M02 now) "the method we met earlier in this video" | s43 moves into M02 |
| #69 s47_levels | "Isentropic maps … had their own movie too." | "Isentropic maps … get their own movie later in this series." | R10 is at pos 119, after the map block |
| #69 s44_upper_air | "the pressure coordinates movie" | keep (M07, pos 19, is earlier) | ✓ |

The rest of §10's queue was rechecked against the scripts and stands as written: #2 s22w and s50; #3 s01a, s01d, s27b
and s47; 1a s34, s19, s12d and s12c; 1b s05, s32 and s15.

**Every other spoken pointer was checked and is right**, including:
- 0.3 s35, s52, s53, s59;
- #3 s27g (R01, R02);
- #4 s07, s21, s29, s38, s39 (#6, M07, M12, W/S, M13);
- #6 s07, s12, s30, s32, s34, s36, s37;
- M01 s02, s09, s20, s22;
- 5a–5g pointers by title (U15, U10, M03, R01, R06, F19, F32, R04, T04, U13, M25, M02, M07, U09, G03, #6).

**Risk:** the Coordinates parts name later movies **by title** ("Vorticity in plain words", "Reading maps over time",
"How weather maps are made"…). Any later re-title in the plan must grep the scripts first.

### 3b. "Easy" in titles and first sentences (P2)

| Movie | s00 sentence now | Fix | Cost |
|---|---|---|---|
| 0.1b | "…the dot product the easy way, and see…" | "…the dot product, and see…" | one-sentence TTS splice + title frame without "made easy" + re-render of s00 (~10 s) |
| #2 | "…the cross product the easy way, and see…" | "…the cross product, and see…" | same |
| 0.3 | "…the basics of weather the easy way, and see…" | "…the basics of weather, and see…" | same |
| #3 | "…on our spinning Earth, the easy way, and see…" | "…on our spinning Earth, and see…" | same |
| 1a | "…vectors and index notation the easy way, and see…" | "…vectors and index notation, and see…" | same |
| #4 | "…partial derivatives, the chain rule and Taylor series the easy way, and see…" | drop "the easy way" | same |
| M01, 1b, #69 | same pattern | fix in the script before TTS | none |
| 0.1, 0.2 (alternates) | same | only if ever published | — |

All made movies are rendered, so the change is a splice of one clip plus one re-render of s00. Recommended slot: the
pending §5b retro-fits (#2/#3 after M01; 1a and 0.1b after M03). Do 0.3 and #4 at the same time, because they have no
other pending slot. The 2026-11-07 fact rule should be run on these six movies at that slot too (a fact table per
movie). Only #6 and the Coordinates parts have one now.

### 3c. Repetition across movies (beyond the Coordinates parts)

| Repeated material | Movies | Keep where | Elsewhere |
|---|---|---|---|
| Brest ∇T −3.2 / −2.5 per 100 km, the 34 m/s wind, 3.7 K/h | 1a s24–s27, #4 s07, #6 s09, s34 | 1a (first full working) | #4 keeps its one-line slope (it teaches the partial derivative); **#6 recalls** (P1) |
| ∇ on the sphere, 1/(a cos φ) ∂/∂λ, Brest and Svalbard | 5g s06, #6 s22–s23 | #6 (full derivation) | 5g keeps its "if you skipped" preview; #6 recalls the Svalbard factor in one sentence |
| Storm-relative wind on Ciarán | 1a s12i, 5e s08–s12 | 5e (frames in full) | 5e recalls 1a (§3a) |
| Contours ⟂ gradient, spacing → steepness | #6 s12–s15, M01 s08–s09 | #6 (the gradient's property) | M01 recalls it and adds what is new (interval ÷ spacing read off a map) |
| Front as a ∇T band, sloping surface | #6 s33–s33b, M04 | M04 (fronts in full) | M04 recalls #6's front stack |
| Ian gauges, Nargis, Amphan S1 before/after | 5b, F19, F32, CE15 | 5b (first look), F19 (surge in full), F32 (method) | F19 and F32 recall 5b; CE15 recalls F32 |
| −(1/ρ)∇p | #3 (stated), #6 (derived), U01 (recap) | #6 | U01 recalls at point of use (P4) |

---

## 4. Is the rest of the plan a step-by-step path for a first-time learner?

### 4a. Jumps

1. **The Hadley circulation** (P9): used from U15 on and homed only in G01 (139). Fix: home it in U02.
2. **Complex exponentials before Fourier** (P11): fix in W02.
3. **Forty movies between the first map concept (M01, pos 15) and the first chart-reading movie (M05, pos 45).** This is
   the user's own rule (basics first), so it is not a defect. It does make M01 feel early. Mitigation: M01's teaser and
   U01's opening keep the map thread visible ("we'll read full weather charts once we know what each line means").
3b. **0.1b (pos 1) introduces D/Dt, ∂ and ∇T in plain words** before #4 and #6 teach them. This is allowed (explained
   on the spot), but #4, #6 and T04 must **recall** 0.1b, not present these as new. #6 does not yet do so (P1).
4. **The F block sits between the basics and the dynamics stages** (v4 decision D2, kept). The three F items that point
   to R10, R11 and W06 do so for depth only. ✓

### 4b. Redundancies

See §3c. The U/M physics–reading pairs (U17/M17, U18/M18, M14/M24) are a deliberate split, not a redundancy.

### 4c. Data-account dependencies (P7)

Taken from the v3 case table (§B1) and the v4/v5 movie rows. "Open" means no account is needed.

| Account | First movie that needs it (pos) | Why | Open substitute |
|---|---|---|---|
| **EUMETSAT Data Store** | **F22 (66)**: Valencia DANA 2024, Meteosat loop | Meteosat is the geostationary view over Spain | MODIS/VIIRS stills (GIBS). If chosen, the first need is **F19 (81)**: Meteosat-7 IODC over Sidr 2007 and Aila 2009 (substitute GridSat-B1 IR, HURSAT) |
| **NCAR RDA** | **F17 (78)**: Fani 2019 GFS steering (ds084.1) | GFS before 2021 is not on AWS | none good. ERA5 steering alone is possible, but there is no forecast |
| **ECMWF TIGGE** | **F17 (78)** (Fani ensembles), else **F19 (81)** (Sidr/Aila/Nargis) | ensembles before 2023 | ECMWF open data covers only 2023+ (Mocha, Remal, Helene) |
| NASA Earthdata (already used by the project) | **U17 (42)**: GPM GMI, ASCAT; **U18 (43)**: GPM DPR | microwave and space radar | — (confirm the login works) |
| CDS / CEMS-EWDS (GloFAS) | F33 (87) | v4 D3: check that the CDS login opens GloFAS | — |

F14 (76) is the plan's stated "first need". Its data (Hagibis: Himawari-8 AWS, GPM GMI, ASCAT; Mocha microwave) needs
**no** account beyond Earthdata. **Recommended:** keep the reminder rule. Set the **deadline at pos 66 (F22)**, unless
F22 is pinned to MODIS/VIIRS now, in which case the deadline is **pos 78 (F17)**. The memory note
`remind-data-accounts` should be updated by the orchestrator: it still says "v5 position 70 (F14)".

---

## 5. Recommended corrected order (only where needed)

**The opening, understanding and map-reading orders stay as they are.** The user's instruction holds: #5a–#5g → #6 (∇T
made clear) → M01.

| Change | From | To | Reason | Prerequisite check |
|---|---|---|---|---|
| F37 cold waves | pos 92 (heat and dry) | **pos 91**, end of the winter group (after F25) | it is a winter topic; it needs F25 (fog/cold nights) and U09 (polar vortex) | F26 moves 91 → 92; F26's prerequisites (U09, U07, M13, M21) are all earlier; F39 still after F26 ✓ |
| F22 / F20 titles | "heavy rainfall III" (66) / "II" (82) | "II" (66) / "III" (82) | viewers meet I, II, III in order | no position change |
| T08 title | "Tensors made easy" | "Tensors" | house rule | — |

With these, my re-implemented §6a checks give **0 forward prerequisites** (F37's prerequisites U09 34, M04 32, M21 48,
F25 90 are all before 91; F26 at 92 needs U09, U07, M13, M21, all earlier; F39 at 95 needs F26 at 92).

---

## 6. Prioritised fix list per movie

**Priority 1: before the next renders**
1. **#6 `ch00_gradient`:**
   - the ∇T block s09a and the s00 sentence (§2a);
   - the split_plan §3b sphere derivation;
   - the 1a/#4/5g repeats turned into recalls;
   - s22 pointers;
   - "made easy" off the title frame;
   - teaser to M01; fade together;
   - fact table;
   - TTS dry run, with measured times reported.
2. **5d / 5e (in their remake passes):** spoken "Step one … six" → flowing wording. 5e: recall 1a's storm-relative
   wind; recall grad p at s14.
3. **M01 `ch00_contour_maps`, before its TTS:**
   - s00 without "the easy way";
   - s08–s09 recall #6 rather than re-teach;
   - fact table (R19);
   - teaser to U01; re-measure.

**Priority 2: at the pending §5b retro-fit slots (TTS splices; one re-rendered s00 each)**

4. 0.1b, #2, 0.3, #3, 1a, #4: s00 without "the easy way" and the title frame without "made easy" (P2). Run a fact table
   per movie.
5. 1a: s15 and s11 (§3a), plus the queued s34, s19, s12d, s12c.
6. #2: s22w ×2, s50 (queued). #3: s01a, s01d, s27b, s47 (queued).
7. #4: s46 (§3a).

**Priority 3: plan edits for the orchestrator (`series_plan_v6.md`; this audit edits nothing else)**

8. §3: turn every "Recap (≤ N min)" bullet into point-of-use recalls (P4). The wording in each re-scope note becomes
   "Recall at point of use: …".
9. §4: add **b19, the Hadley circulation in words**. Home U02 (18); first needed by U15 (40); also used by U16, F13, F17
   (P9). §5 gets the same row.
10. §6 prerequisites:
    - #6 + 1a, 0.3, #3, #5d;
    - U18 + #5c;
    - M25 + #5c;
    - M17 + M16;
    - F32 + #5b.
11. §6/§7: F37 → pos 91 and F26 → 92; F22/F20 titles; T08 title.
12. §5 rows (from `continuity_plan.md`): the along/across calculation now lives in #5b; F19 note; CE15 re-scope.
13. Statuses:
    - #5a–#5g "in remake (master plan 2026-11-07)";
    - #6 "paused → revise after #5g";
    - §1b "Part 7 (5g) ends by naming #6".
14. `split_plan.md` §3b: "position 12" → 14; "Part 5 s03–s04" → "Part 6 (5f) s03–s04".
15. §1a/§9 data accounts: the per-account first-need table (§4c). Update the memory `remind-data-accounts` (deadline pos
    66, or 78 if F22 is pinned to MODIS/VIIRS).
16. §10: append the §3a rows.
17. Commit a real `movies/ch00/deps_v6.py`. The re-implementation used for this audit is described in "Method" above; it
    lives only in the session scratchpad.

**Priority 4: later-stage scopes (when their storyboards are written)**

18. W02: Euler's formula primer. W01: characteristics, similarity variables, solving on grids. T03: Dirac delta.
19. F19, F32, CE15: recall 5b and F32 instead of repeating them.
20. `book.yaml → chapters.ch00.movies`: replace the six 2026-10-20 seeds with a pointer to the series plan.

---

## 7. Answer to the user's question

- **Are the videos properly sequenced?** Yes. With one exception (F37, a one-step move inside the forecasting block)
  every movie sits after everything it needs. This was checked by script on all 180 rows, and again by hand against what
  the made movies actually say.
- **Are their contents properly and sequentially planned?** Mostly yes, with four content problems to fix:
  1. #6 must make ∇T clear in one place and stop re-working the Brest numbers that 1a and #4 already did;
  2. "the easy way" is still spoken in six finished movies and three written ones;
  3. about a dozen pointers in made movies are stale;
  4. the plan's re-scope notes would make 14 movies open with recaps that the house style now forbids.

  The Hadley circulation needs a home before the tropical movies.
- **Data accounts:** the plan's single "F14 at position 76" is not exact. EUMETSAT may be needed at 66 (F22), RDA and
  TIGGE at 78 (F17).
