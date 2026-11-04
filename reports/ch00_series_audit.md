# Chapter 0 movie series: fresh-eyes audit of the order (2026-11-04)

**Scope.** The plan is `movies/ch00/series_plan_v4_proposal.md` (adopted 2026-10-30; 176 movies). I checked it against
what the movies **actually say**: the narration in `script.md` of every finished or in-progress movie, and the
storyboards that exist for #5, #6, M01, 1b and #69 (`ch00_reading_weather_maps`, v3). I read the narration only, so
on-screen labels are not checked. Read-only: no plan, script or storyboard was changed.

**Standing rule (user, 2026-11-04).** Every basic atmospheric-science term and concept must be taught before the
"Reading weather maps" block (v4 positions 40–54) starts.

---

## 1. Top findings (most important first)

1. **Wind barbs are used at position 22 but first taught at position 41.** M14 (skew-T, pos 22) draws "wind barbs on
   the side". M24, U13 and every upper-air chart also use them. v4 teaches barbs only in M05 (pos 41, #69 s38–s39).
   This is a real ordering bug. **Fix:** teach barbs in M03 (pos 13), the wind movie.
2. **Viewers would watch two movies twice.** The v4 viewing order lists:
   - 0.1 **and** 0.1b (pos 1, 2). 0.1b is 0.1 with seven extra scenes;
   - 0.2 full (pos 3, 69 min) **and** its two parts, #2 and #3 (pos 6, 7). The parts are the same scenes cut in two.

   **Fix:** keep 0.1 and 0.2 full as alternate cuts outside the viewing path. Viewers watch 0.1b, #2 and #3.
3. **Finished movies point to the wrong "next video".** These lines are wrong in the v4 order:
   - **0.3 weather basics** (in UF2 fix loop 3 now, so this is cheap to fix today):
     - s50 says "You'll learn to read these maps in detail in the next video";
     - s59 says "In the next video, we'll learn to read weather maps".

     In v4 the next movie is 1a, and map reading starts about 36 movies later. Also, 0.3 says three times that
     "later videos" explain the Coriolis turning (s35, s44, s59). But in v4, 0.2 (pos 3) has already explained it
     before 0.3 (pos 4).
   - **1a** s34: "the alternating tensor … That's the next movie in this series". But 1b is now at position 94.
   - **0.2 / #3** s27b: "we use the vector triple product from the triple products video". That video is 1b
     (pos 94), so the viewer has not seen it yet.
   - **#6 storyboard** (not built yet):
     - s07 says divergence, curl and the Laplacian "each have their own movie next in this series", but T01–T03 sit
       at positions 95–97;
     - s30 says "We'll build all of this step by step in the Coriolis movie, later in this series", but the viewer
       already saw it in #3.
   - **#5 storyboard** (not built yet), s12: "vorticity, in the curl movie". The viewer meets vorticity first in U10
     (pos 31), long before the curl movie (T02, pos 96).
4. **The plan under-counts what the finished movies already teach, so several planned movies repeat them.** The
   biggest overlaps:
   - **U01** (pressure-gradient force, 20–25 min) is almost all in #6:
     - s24–s29: −(1/ρ)∇p derived on a box, 1 hPa/100 km → 8×10⁻⁴ m s⁻², Ciarán's push;
     - s35: the sea breeze;
     - #3 s39–s41 covers the same ground again.
   - **M03** (Coriolis and geostrophic, 30–35 min) repeats #3 s23–s46. #3 already derives −2Ω×u and f = 2Ω sin φ,
     gives the hemisphere rule and the size of the push, shows the trades and westerlies, derives the geostrophic
     wind and tests it on Ciarán (15 % sub-geostrophic, friction inflow).
   - Smaller repeats:
     - **U03**: 0.3 already has 6.5 K/km and the tropopause by latitude, and #4 names the lapse rate and its sign;
     - **M13**: 0.3 has q, e ≈ 1.61qp, RH, dew point and cloud base; #4 has Clausius–Clapeyron, 7 %/K and latent
       heat;
     - **M04**: 0.3 has air masses, cold and warm fronts, front slope, the front stack and symbols;
     - **U13**: the hodograph is in 1a s12g;
     - **M16**: #4 has the 255 K emission temperature and the Planck response.

   **Fix:** re-scope these movies so they recap the earlier material and add only what is new (§6).
5. **Basic map words that no movie before the map block teaches.** These appear only in #69 (→ M05/M06) or nowhere:
   - Z/Zulu time, synoptic hours, initial vs valid vs lead time;
   - the projections weather charts use (Lambert conformal, polar stereographic; Tissot);
   - dew-point depression (0.3 computes the gap but never names it);
   - oktas, few/scattered/broken/overcast and ceiling;
   - visibility, mist and haze;
   - veering and backing (1a describes clockwise turning with height without the word);
   - synoptic scale vs mesoscale;
   - streamlines;
   - thermal (heat) lows;
   - tropical-cyclone intensity classes;
   - aerosols, dust and smoke;
   - gusts vs mean wind.

   Each one can go into an existing U/M movie (§5). **No new movie is needed.**
6. **M02 sits at position 40, the first slot of the map block.** Its job (observations → grid → analysis) is
   understanding, not chart reading. **Fix:** move it to the end of the understanding block and give it the "chart
   frame" scenes (#69 s02–s11: projections, legend, UTC/Z, valid and initial time). Then M05 is pure surface-chart
   reading, and the rule holds.
7. **Better order for the opening.** 0.1b → #2 → 0.3 → #3 → 1a → #4 → #5 → #6.
   - Part 2 (#3, Coriolis and geostrophic) comes right after weather basics, so its hPa, isobars, highs and lows,
     and reanalysis become recaps.
   - 0.3's own "later videos will explain the turning" lines become true.
8. **F before T/R/W/S is sensible for the stated goal**, with two caveats (§4c):
   - the first hazard F movies are the hardest ones (tropical-cyclone genesis, Dvorak, rapid intensification);
   - about 20 h of F has no new maths.

   This needs an optional F re-order and a "maths track" note, not renumbering.
9. **Prerequisite notation is confusing, but has no position bugs.** A script check of all 176 rows of §6 finds **no
   prerequisite listed at a later position**. The only exceptions are two harmless self-inclusions: M20 "M01–M26" and
   F28 "F01–F39". But bare digits ("3", "5") are movie numbers, not positions, which makes "U17 needs 3" look wrong
   (§4d).

---

## 2. Coverage table: what the done and in-progress movies actually teach

Source: the narration in each `script.md`. Weather words are in **bold**.

| v4 pos | ID · folder | Status | Maths taught | Weather and climate terms actually taught (scene) |
|---|---|---|---|---|
| 1 | 0.1 `ch00_dot_product_why` (17:40) | done | dot product, cosine form, shadow, unit vector, work | **air parcel**, **local rate ∂T/∂t**, **material derivative DT/Dt** (in words), **advection v·∇T**, **isotherms**, **temperature gradient ∇T** (preview), K vs °C step, warm/cold carried in (s12–s20) |
| 2 | 0.1b `ch00_dot_product_v01b` (25:52) | done | all of 0.1 + matching parts, ⊥ push does no work | all of 0.1 + **runway crosswind** (s20b), **sunlight on tilted ground / flux** (s20c), **wind stress τ·u** and the Southern Ocean (s20d), **pressure departures from usual values** (an anomaly in all but name) and **pattern similarity** (s20e); "hPa" in passing |
| 3 | 0.2 `ch00_cross_product_why` (1:09:15) | done | = #2 + #3 in one file | = #2 + #3 |
| 4 | 0.3 `ch00_weather_basics` (≈58 min) | in progress (UF2 review 3 = FIX) | integral, ln, e (inline) | **atmosphere thinness**, **composition**, **air parcel**, **pressure**, Pa, **hPa/mb**, **barometer**, **density**, **K/°C**, **ideal gas law**, **warm air lighter**, **hydrostatic balance**, **scale height** (5 views), **exponential p(z)**, **radiosonde**, **troposphere / tropopause / stratosphere / meso-, thermosphere**, tropopause by latitude, **heated from below**, **thermals**, **≈10 K/km cooling of rising air** (dry adiabatic in words), **water vapour vs cloud**, **specific humidity**, **vapour pressure e ≈ 1.61 q p**, **saturation vapour pressure**, **RH**, **dew point**, **dew and fog** (one line each), **cloud base** (the LCL computed, not named), **wind as a vector u, v**, **wind direction convention** (from; degrees clockwise from N), **ocean-current convention**, **m/s, km/h, knots**, **PGF in words**, **weather vs climate** (30-year normal, 10–90 % band), **observing network**, **reanalysis / ERA5**, **surface pressure vs MSLP reduction**, **isobars (4 hPa)**, **highs, lows, depression, cyclone, anticyclone**, **convergence into lows → rising → cloud; sinking under highs**, **10-m wind circulating lows** (NH/SH sense), **air masses** (mP/mT/cP/cT), **fronts**: cold and warm, slopes, the front stack, **front symbols** (cold and warm only), **warm sector**, **differential heating by latitude**, **subtropical highs**, **ITCZ**, **trades**, **westerlies**, **UTC** ("universal time"), **Ciarán** time series at Brest |
| 5 | 1a `ch00_vectors_index_notation` (35:15) | done | scalar/vector, components, magnitude, add/subtract, index notation, summation, Kronecker δ | **2-m temperature**, **UTC**, **ERA5**, **scalar/vector field**, **wind direction convention** (again), **u, v, w**, **w ≈ 10 cm/s** in a storm, **three-force balance (PGF + Coriolis + friction)**, **isobars**, **geostrophic** and **ageostrophic wind**, **wind shear**, **hodograph** with 850/500 hPa, **clockwise turning with height ↔ warm air** (veering, but not named), **anomaly**, **climatology** (1991–2020), **El Niño** (trade-wind anomaly), **storm-relative wind**, **warm advection** (+3.7 K/h at Brest), **warm front** |
| 6 | #2 `ch00_cross_product` (32:41) | done | cross product, right-hand rule, ε_ijk index form (s15a), torque, angular momentum, Lorentz force | none (pure maths) |
| 7 | #3 `ch00_cross_product_uses` (40:57) | done | k×, Ω, Ω×r, rotating-frame rule, the vector triple product (used but not proved) | **Earth's spin Ω**, **ground speed**, **latitude φ**, **Coriolis effect** derived (−2Ω×u), **centrifugal** + **effective gravity** + **geoid/oblateness**, **local ENU axes**, **f = 2Ω sin φ**, **NH right / SH left**, size and inertial period, **inertial loops** on a globe, **reanalysis**, **subtropical highs**, **trade winds**, **westerlies**, **hurricane**, **eye**, Ian (NH) vs Idai (SH) **spin sense**, **isobars**, **hPa**, **PGF −(1/ρ)∇p**, **geostrophic adjustment** (loops), **geostrophic balance** (high on the right: Buys Ballot, not named), **geostrophic wind formula** + numbers, a Ciarán test: **sub-geostrophic round a tight low**, **friction turns the wind toward the low** |
| 8 | #4 `ch00_derivatives_taylor` | in progress (fix loop 3; the plan's "fix loop 2" is stale) | rate, derivative, partials, total differential, chain rule, exact differentials, Taylor series, linearisation, finite differences | **∂T/∂x at Brest**, **pressure tendency** (−5 hPa/h), **radiosonde**, **lapse rate named, with its sign flip** (s09), **tropopause** (sign of dT/dz), **material derivative**, **T(p) via the chain rule** (pressure as a vertical coordinate, preview), **ideal gas** (fractional form; warm parcel 3.5 % lighter), **hydrostatic**, **scale height**, **first law**, **heat and work are not state functions**, **specific volume**, **c_v**, **entropy**, **potential temperature** (named only), **latent heat**, **Clausius–Clapeyron**, **7 %/K**, the **IPCC 7 %/K extreme-rain** link, **black body**, **σT⁴**, **emission temperature 255 K**, **Planck response 3.8 W m⁻² K⁻¹**, **CO₂ doubling forcing**, **feedbacks** (water vapour), **grid spacing / centred differences in models** |

**Storyboarded, not built** (narration in `script.md`):

| v4 pos | ID | Weather terms in the storyboard |
|---|---|---|
| 9 | #5 coordinates | polar coordinates round Ian's eye (**tangential vs radial wind**, **inflow angle 19°**), **centripetal**, **cylindrical stack** of Ian, **lat/lon**, **degree lengths**, **grid-cell area**, **ENU**, **metric terms**, **great circle**, **rhumb line**, **plate carrée**, **Mercator** (conformal), **Equal Earth** (equal-area), **polar view**, **rotating axes along/across a coast**, **storm surge** (Ian, Fort Myers), **Galilean frames**, **storm-relative motion**. **No Tissot, no Lambert conformal, no polar stereographic.** |
| 10 | #6 gradient | **field**, **∇h**, **directional derivative**, contours ⟂ ∇, **gradient units** (K/100 km, hPa/100 km), **∇T at Brest**, **Mont Blanc**, **runoff along −∇h**, **scale dependence of slope**, **Singapore sounding / tropopause**, **gradients on a sphere (cos φ)**, **PGF derived and worked (Ciarán, 1 hPa/100 km)**, **crowded isobars ↔ strong wind** (statistics), **Coriolis balance in words**, **"gradient wind" warning**, **GFS chart 27 Oct 2026**, **hydrostatic vs vertical PGF**, **fronts as strong ∇T**, **advection**, **sea breeze** (full mechanism), **jet above the strongest ∇T**, **thermal wind** (named), **Gulf Stream SST front** |
| 11 | M01 contour maps | **isoline interpolation**, contour rules, **interval**, colour bands and colour bar, **terrain contours (Fuji)**, **profile**, **∇ from spacing**, **coastline = 0 contour**, **isobaths**, **peak/ridge/valley/basin/col (Everest)**, **isobars**, **H/L**, **ridge, trough, col of pressure**, **crowded isobars → wind**, **isotherms** (the 0 °C January line), **isohypses of 500 hPa**, the **iso- family** (isohyets, isotachs, isopycnals) |
| 94 | 1b alternating tensor | ε_ijk, **Coriolis via ε** (again), ε–δ identity, Lagrange identity, scalar triple product (**parcel volume, flux**), vector triple product, **centrifugal** (again) |
| — | #69 reading weather maps v3 (to be split) | frame (s02–s11): lat/lon, degrees, flattening, **Tissot + Mercator**, **chart projections (Lambert conic)**, legend, **UTC/Z (Zulu)**, **valid vs initial time**, traps · s12–s28 surface chart incl. **Buys Ballot**, **tendency**, **occluded / stationary fronts**, **squall line / dryline**, **front clues incl. veering** · s29–s43 **METAR/SYNOP**, **visibility**, **oktas**, **present weather**, **barbs** · s44–s56 upper air, thickness, skew-T · s57–s67 satellites and radar (**dBZ**, Z–R) · s68–s73b models, ensembles · s74–s82 the Ciarán case |

### 2a. Where the plan's claims differ from the scripts
| Plan claim (§5 audit or §6) | Reality |
|---|---|
| PGF first taught in U01 (pos 12) | #6 s24–s29 (pos 10) derives and works it; #3 s40 (pos 7) gives the formula |
| Coriolis, f, hemisphere sign, geostrophic: M03 (pos 13) | #3 / 0.2 (pos 3/7) derive all of it and test it on Ciarán |
| Friction and cross-isobar inflow: M03 | 0.3 s44, 1a s12c–d, #3 s46, #6 s30 |
| Sea breeze: U01 / U07 | #6 s35 (full mechanism) |
| Convergence → rising, sinking under highs: U02 | 0.3 s43 in words (U02 adds the numbers) |
| Lapse-rate sign convention said once in U03 | #4 s09 already says it |
| Tropopause: U03 | 0.3 s24–s25, #4 s09b, #6 s17 |
| Dry adiabatic rate: M12 | 0.3 s26 and s31 give ≈ 10 K/km in words (M12 derives it) |
| LCL: M13 | 0.3 s31 computes the cloud base (the LCL) without the name |
| Clausius–Clapeyron, 7 %/K: M13 | #4 s39–s41 |
| Latent heat: M12 | #4 s39 defines it |
| Hodograph "explained from zero" in U13 | 1a s12g (pos 5) |
| Anomaly and climatology: M08 | 1a s12h (M08 adds the standard deviation) |
| El Niño one picture: U14 | 1a s12h already shows the trade-wind anomaly |
| Thermal wind in words and the jet: U08 | #6 s36 names both; 1a s12g links turning with height to warm air |
| Radiation, emission, Planck: M16 | #4 s42–s43; 0.1b s20c (flux); 0.3 s51 |
| Reanalysis: M02 (pos 40) | 0.3 s38 (and 1a, #3, #6) |
| Storm surge: F19 | #5 s39–s40 introduces it (Ian) |
| Projections incl. Tissot: #5 | #5 has no Tissot; Tissot and Lambert are in #69 s06–s07 (→ M05) |
| Centrifugal: R01 | #3 s27b–g (and 1b again) |
| §6 status "#4 fix loop 2" | fix loop 3 (RESUME.md) |
| §6 status "M01 plan being written" | storyboard and script exist |

---

## 3. (a) Used before taught

Real narration and storyboards were checked against the v4 order:

| # | Where used (pos) | Term / idea | First taught (pos) | Severity | Fix |
|---|---|---|---|---|---|
| a1 | M14 skew-T (22), U13 hodograph (34), M24 (48) | **wind barbs** | M05 (41) | **bug** | teach barbs in **M03** (13) |
| a2 | 0.2 / #3 s27b (3/7) | **vector triple product** "from the triple products video" | 1b (94) | stale pointer | re-voice one sentence in the pending §5b retro-fit of 0.2/#3 ("a rule called the vector triple product, which says … proved in a later video") |
| a3 | 1a s34 (5) | "next movie = alternating tensor" | 1b (94) | stale pointer | re-voice in the 1a §5b retro-fit ("a later movie") |
| a4 | 0.3 s50, s59 (4) | "in the next video we'll read weather maps" | M05 (41) | stale pointer | **change now, in UF2 fix loop 3** ("in later videos") |
| a5 | 0.3 s35, s44, s59 (4) | "later videos explain the Coriolis turning" | already shown in 0.2 (3) | contradiction in the v4 order | resolved by the order change in §6 (#3 after 0.3) |
| a6 | #6 s07 (10) | div, curl, Laplacian "next in this series" | T01–T03 (95–97) | stale pointer (not built) | storyboard: "later in this series" |
| a7 | #6 s30 (10) | "we'll build this in the Coriolis movie, later" | done in #3 (7) | contradiction (not built) | storyboard: "as we saw in the cross product movie; the Coriolis and geostrophic movie takes it further" |
| a8 | #5 s12 (9) | "vorticity, in the curl movie" | U10 (31) comes first | wrong target (not built) | storyboard: "in the vorticity movie" |
| a9 | M24 (48) | nor'wester soundings | F11 (81) | minor | M24 describes it on screen, or the nor'wester word goes into U12/U16 |
| a10 | M22 (45) | tropical easterly jet | U16 (37), not listed | minor | add U16 to the M22 prerequisites |

The §6 table itself is clean: no prerequisite sits at a later position. The checker script is in the scratchpad.

---

## 4. Gaps, duplicates and odd prerequisites

### 4a. (b) Basic terms the map block needs that no movie at positions 1–39 teaches
"Needed by" lists the first map-block users. "Best home" is an existing movie, extended (no new movies).

| # | Term or concept | Needed by | Taught now in | Best home (extension) |
|---|---|---|---|---|
| b1 | **Wind barbs** (calm, 5/10/50 kt, which end points where) and plotted wind arrows | M14, U13, M05, M06, M10, M21–M24 | M05 (41) | **M03** (pos 13): "how charts draw the wind" (#69 s38–s39 move here); M05 recaps |
| b2 | **Z/Zulu, 00/06/12/18 Z synoptic hours, local-time conversion** | M05, M06, M24 | M05 (#69 s09) | **M02** (moved to the end of the U block) |
| b3 | **Initial (analysis) time, valid time, lead time, "+24 h" labels; analysis vs forecast; one model run** | M05, M10, M19, M25 | M05 (#69 s10) | **M02** |
| b4 | **Projections on weather charts**: Lambert conformal, polar stereographic, Mercator, Tissot ellipses | M05, M21, M22 | M05 (#69 s06–s07); #5 has Mercator, equal-area and polar view only | **M02** (or one scene in #5 before it is built) |
| b5 | **Chart legend and units table**: hPa, dam, kt, °C, g/kg, mm, dBZ | all of M | scattered | **M02** (one recap scene) |
| b6 | **Dew-point depression (T − Td, "spread")** named | M06, M10 (700 hPa), M24, F25 | 0.3 s31 computes it without the name | **M13** |
| b7 | **Cloud amount in oktas; FEW/SCT/BKN/OVC; cloud base vs ceiling** | M06, M17, F25 | M06 (#69 s36) | **M15** |
| b8 | **Visibility** (what it is, metres and statute miles); **mist vs fog** (1 km), **haze**, smoke | M06, M17, F25, F36 | M06 (#69 s30–s31) | **U07** (fog section) |
| b9 | **Veering / backing**: in time (front passage) and with height (warm / cold advection) | M05, M10, M24, F06 | #69 s27; 1a describes it without the word | **M04** (frontal wind shifts) + **U08** (with height, with the 1a hodograph recap) |
| b10 | **Scales**: planetary, synoptic, mesoscale, storm scale ("synoptic chart") | M05 onwards, F | #69 only | **M03** (where rotation matters: sea breeze vs a low) |
| b11 | **Streamlines** (vs isobars and height contours) | M22, U16 (monsoon charts), M17 | nowhere | **U08** (one scene) |
| b12 | **Thermal (heat) lows and highs, lee troughs, the monsoon trough on surface charts** | M05 (South Asian charts), F11, F30 | #6 sea breeze only; U16 monsoon trough | **U01** (re-scoped: "where pressure differences come from") |
| b13 | **Tropical-cyclone intensity classes** (depression → storm → cyclone/hurricane; Saffir–Simpson, IMD scale; maximum sustained wind) | M05 (TC symbols), M17 (eye), F13–F18 | nowhere | **U15** |
| b14 | **Aerosols: dust, smoke, haze** (what they are, how they scatter and absorb) | M17 (dust RGB), F36, F38 | F36 itself | **M16** (one section) |
| b15 | **Gust vs mean wind** (averaging times) | M06 (METAR "G"), F05 | #6 uses "gust" undefined | **U07** (turbulent boundary layer) |
| b16 | **Seasons from the axial tilt** | U08, U16, M16 | 0.3 equinox only | **M16** (check its storyboard) |
| b17 | **Percentile** (the 10–90 % band named) | F26, F39, CE | 0.3 shows the band without the word | **M08** (next to the standard deviation) |
| b18 | **Chaos / predictability in one picture** (why forecasts need ensembles) | M19 | M19 itself | **M02** (one line) and M19 in full: acceptable |

**Chart conventions taught inside the block on purpose** (acceptable under the rule, because they are reading skills,
not concepts): METAR/SYNOP code groups, the station model layout, present-weather glyphs, isallobars, the trough-axis
method, the 5520/5640-m lines, RGB recipes, radar artefacts and verification scores.

**Already covered** (checked):
- UTC (0.3, 1a);
- anomaly and climatology (1a, M08);
- hPa and knots (0.3);
- dam (M08);
- wind direction (0.3, 1a);
- H/L, troughs, ridges and cols (M01; U09 aloft);
- precipitable water (M13, U06);
- isobars vs height contours (M01, M08);
- temperature advection (0.1, 1a, #6);
- moisture advection (U06);
- wind shear (1a, U08);
- freezing level (M14);
- tropopause (0.3);
- ensembles (M19);
- ω (M07);
- θe (M12);
- jet streaks (U08);
- vorticity (U10);
- occluded and stationary fronts (M04).

### 4b. (c) Duplicates and confusing order
| # | Issue | Why it matters | Proposal |
|---|---|---|---|
| c1 | 0.1 and 0.1b both in the path (pos 1, 2) | 0.1b = 0.1 + s05a, s11a, s11b, s20b–e; same narration otherwise | path keeps **0.1b**; 0.1 becomes "short cut (alternate)" |
| c2 | 0.2 full and #2 + #3 all in the path (pos 3, 6, 7) | the same 69 min twice | path keeps **#2 and #3** (shorter, and #3 opens with a recap); 0.2 becomes "single-file cut (alternate)" |
| c3 | 0.2 (Coriolis) before 0.3 (pressure, isobars) | #3 has to define hPa, isobars and reanalysis itself; 0.3 then says "later videos explain the turning" | order **0.1b → #2 → 0.3 → #3 → 1a** |
| c4 | U01 duplicates #6 + #3 | 20–25 min, mostly repeated | **re-scope to 12–15 min**: recap the PGF (3 min); then where pressure differences come from (heating → thermal lows/highs, heat lows over India and the Sahara, the sea-breeze cell in 3-D, piling air), lee troughs |
| c5 | M03 duplicates #3 | 30–35 min, about half repeated | **25 min**: recap #3 (3 min); then Buys Ballot by name, gradient and cyclostrophic winds, friction angles over land and sea, drifter inertial loops, the equator, scales (b10), barbs (b1) |
| c6 | 0.3 overlaps U03, M13, M04, U02 | the plan's scopes re-teach | each is told to recap 0.3/#4 in ≤ 2 min; lengths: U03 15–20, M13 25, M04 20 |
| c7 | U13 "hodograph from zero" | 1a s12g taught it | "recap from 1a, then storm-relative helicity" |
| c8 | M02 at pos 40 in the reading block | it is understanding; the rule wants it before | **move M02 to the end of the understanding block** + the chart-frame scenes (b2–b5, b18) |
| c9 | F block starts with the hardest hazard movies (F13 genesis, F14 Dvorak, F16 rapid intensification) right after F01 | a level jump; the M block ends on a mid-latitude low (Ciarán, M25/M26) | **optional re-order**: F01 → F29 rainfall → mid-latitude (F02, F03, F05) → rain (F04, F21, F22) → convection (F06, F07, F34, F09, F08, F11, F10, F12) → tropical (F13, F14, F15, F17, F16, F18, F19, F20) → monsoon (F30, F23) → floods (F31–F33) → winter (F24, F35, F25) → heat and dry (F26, F37, F36, F38, F39) → F27 → F28. All prerequisites still hold (checked by hand). |
| c10 | F (≈ 20 h) before T/R/W/S | sensible for the user's goal (D2), and every F movie works in words. But a Vallis reader waits about 90 movies for the formal div/curl/material derivative | keep D2; on the site, mark T01–T04 as an optional **maths track** that can be watched any time after U10, and mark F as skippable for Vallis Ch. 1 |
| c11 | Level jumps in 0–1 | #3 (rotating frames, geoid) and #4 (entropy, exact differentials, Planck) are denser than the gentle U block after them | not a bug. But R01/R02 later re-derive what #3 did, so **re-scope R02** to what #3 left out (the w terms, 3-D Coriolis, inertial oscillations in full, f- and β-plane) and make R01 a recap |
| c12 | 1b at 94 repeats Coriolis and centrifugal for the third time | fine as a tools movie before T08 | no change, apart from fixing the pointers a2 and a3 |

### 4c. (d) Odd prerequisites
| Row | Listed | Comment | Proposal |
|---|---|---|---|
| U17 | "M16, M15, U12, **3**" | "3" is **movie #3** (cross product Part 2, where Ω is introduced), not position 3. Logically right (geostationary orbit uses Ω) but reads like a bug | write movie numbers with a hash everywhere: **#2–#6**; U17 → "#3 (Ω)" |
| M03 | "2, 3, 5, 6, 0.3, U01" | same notation; and #3 already teaches most of M03 | "#3 (Coriolis, geostrophic), #6, U01" + the re-scope c5 |
| U10 | "…, 0.1b" | vorticity needs the cross product's r×u spin (#3 s38) more than the dot product | "#3, M03, U02, U09" |
| M16 | "4, 0.3" | 0.1b s20c says "the climate machine video builds on exactly this" | add 0.1b |
| U03 | "0.3, M07, M16" | #4 already gives the lapse-rate sign | add #4 |
| F19 | "F17, M08, M01" | #5 s39–s40 introduce the surge and along/across-coast components | add #5 |
| M14 | "M12, M13" | uses barbs | add M03 (after b1) |
| M22 | "M21, U08, U02" | tropical easterly jet | add U16 |
| M20 | "M01–M26" | includes itself | "M01–M19, M21–M26" |
| F28 | "F01–F39" | includes itself | "F01–F27, F29–F39" |
| R10 | "…, F02" | a theory movie depending on a forecasting movie is unusual, but it is consistent with D2 | keep |

---

## 5. Where each gap goes: the extension list
| Movie (new pos) | Add | Est. length change |
|---|---|---|
| **U01** (10) | re-scope (c4) + thermal and heat lows, lee troughs (b12) | 20–25 → **12–15 min** |
| **M03** (11) | recap #3; Buys Ballot; gradient and cyclostrophic winds; friction angles; inertial loops; **scales** (b10); **wind barbs and plotted winds** (b1, from #69 s38–s39) | 30–35 → **25–30 min** |
| **M16** (16) | **aerosols** (b14); **seasons and tilt** (b16) if missing | +3 min |
| **U03** (17) | recap 0.3/#4 instead of re-teaching | 25–30 → 15–20 min |
| **M08** (14) | name the **percentile** beside the standard deviation (b17) | +1 min |
| **M13** (19) | name the LCL as 0.3's cloud base; **dew-point depression** (b6) | 30–35 → 25–30 min |
| **M15** (21) | **oktas, FEW/SCT/BKN/OVC, ceiling** (b7) | +3 min |
| **U07** (25) | **visibility, mist/haze/fog thresholds** (b8); **gusts vs mean wind** (b15) | +4 min |
| **M04** (26) | recap 0.3; **veering/backing at fronts** (b9) | 25–30 → 20–25 min |
| **U08** (27) | **veering/backing with height** ↔ warm/cold advection (1a hodograph recap) (b9); **streamlines** (b11) | +3 min |
| **U13** (32) | hodograph as a recap (c7) | −2 min |
| **U15** (34) | **intensity classes, maximum sustained wind** (b13) | +3 min |
| **M02** (38, moved) | the **chart frame** from #69 s02–s11: projections incl. Lambert, polar stereographic and Tissot (b4), legend and units (b5), **UTC/Z and synoptic hours** (b2), **initial/valid/lead time, analysis vs forecast** (b3), chaos in one line (b18) | 25–30 → **35–40 min** (or split into two halves under one ID) |
| **M05** (39) | drops the frame and barbs (now in M02/M03); recaps them in 1 min | 25–30 → 20–25 min |

**Fix the pointers** (no new scenes):
- 0.3 s50/s59 (now);
- #5 s12 and #6 s07/s30 (before they are built);
- 1a s34 and 0.2/#3 s27b (in their pending §5b retro-fits).

---

## 6. Proposed corrected order (IDs kept; minimal moves)
**Changes:**
1. 0.1 and 0.2-full leave the viewing path (they stay as alternate cuts).
2. #3 moves to just after 0.3.
3. M02 moves to the end of the understanding block.

Everything else keeps its v4 order. New positions:

| New pos | ID | (v4 pos) | Block |
|---|---|---|---|
| 1 | 0.1b | 2 | basics and maths |
| 2 | #2 cross product Part 1 | 6 | |
| 3 | 0.3 weather basics | 4 | |
| 4 | #3 cross product Part 2 (Coriolis, geostrophic) | 7 | |
| 5 | 1a | 5 | |
| 6 | #4 | 8 | |
| 7 | #5 | 9 | |
| 8 | #6 | 10 | |
| 9 | M01 | 11 | understanding |
| 10 | U01 (re-scoped) | 12 | |
| 11 | M03 (+ barbs, scales) | 13 | |
| 12 | U02 | 14 | |
| 13 | M07 | 15 | |
| 14 | M08 | 16 | |
| 15 | M09 | 17 | |
| 16 | M16 | 18 | |
| 17 | U03 | 19 | |
| 18 | M12 | 20 | |
| 19 | M13 | 21 | |
| 20 | M14 | 22 | |
| 21 | M15 | 23 | |
| 22 | U04 | 24 | |
| 23 | U05 | 25 | |
| 24 | U06 | 26 | |
| 25 | U07 | 27 | |
| 26 | M04 | 28 | |
| 27 | U08 | 29 | |
| 28 | U09 | 30 | |
| 29 | U10 | 31 | |
| 30 | U11 | 32 | |
| 31 | U12 | 33 | |
| 32 | U13 | 34 | |
| 33 | U14 | 35 | |
| 34 | U15 | 36 | |
| 35 | U16 | 37 | |
| 36 | U17 | 38 | |
| 37 | U18 | 39 | |
| 38 | **M02 (+ chart frame)** | 40 | understanding (bridge) |
| 39 | M05 | 41 | **map reading starts** |
| 40 | M06 | 42 | |
| 41 | M10 | 43 | |
| 42 | M21 | 44 | |
| 43 | M22 | 45 | |
| 44 | M23 | 46 | |
| 45 | M11 | 47 | |
| 46 | M24 | 48 | |
| 47 | M17 | 49 | |
| 48 | M18 | 50 | |
| 49 | M19 | 51 | |
| 50 | M25 | 52 | |
| 51 | M26 | 53 | |
| 52 | M20 | 54 | |
| 53–91 | F block (v4 order, or the optional c9 order) | 55–93 | forecasting |
| 92–174 | 1b, T, R, W, S, G, A, O, CV, CE (v4 order) | 94–176 | |
| alt | 0.1 (short cut of 0.1b) · 0.2 (single-file cut of #2 + #3) | 1, 3 | outside the path |

**Check after the changes:**
- every prerequisite in §6 of v4 still points to an earlier position;
- barbs (M03, pos 11) now come before M14 (pos 20);
- every term in §4a is taught by position 38;
- the reading block (M05 → M20, positions 39–52) uses no basic concept it has not met.

## 7. Counts
| | v4 | After changes |
|---|---|---|
| Distinct movies (IDs) | 176 | **176** (no new movies, none deleted) |
| Movies in the viewing path | 176 (two titles counted twice in content) | **174** (0.1 and 0.2-full become alternates) |
| Understanding block | 29 (pos 11–39) | **30** (pos 9–38, with M02) |
| Map-reading block | 15 (pos 40–54) | **14** (pos 39–52) |
| F block | 39 | 39 |
| Extended or re-scoped movies | — | 14 (§5) + 6 pointer fixes |

## 8. What to do, by timing
| When | Action | Owner |
|---|---|---|
| **Now** (weather UF2 fix loop 3) | 0.3 s50, s59: "next video" → "later videos" (map reading); with the new order, keep "later videos explain the turning" | motion-builder (2-sentence TTS splice) |
| Before #5 and #6 are built | #5 s12 "curl movie" → "vorticity movie"; #6 s07 "next" → "later"; #6 s30 points back to the cross-product movie | movie-director |
| §5b retro-fits already queued | 0.2/#3 s27b (triple-product pointer); 1a s34 ("next movie" → "a later movie") | motion-builder |
| Before the M01 → M03 storyboards | adopt the §5 extensions in the U01, M03 and M02 scopes; amend v4 §6 positions and prerequisite notation (#N) | movie-director (plan v4.1) |
| Decision for the user | (1) drop 0.1 and 0.2-full from the path (recommended); (2) #3 after 0.3 (recommended); (3) M02 to the end of U with the chart frame (recommended); (4) optional F re-order c9 (recommended, low cost: nothing is built) | user |
