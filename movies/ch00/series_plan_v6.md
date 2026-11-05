# Chapter 0 movie series: plan v6 — 2026-11-05 (movie-director): #5 split into five parts

**Status.** v6 = v5 (adopted 2026-11-04) with one change asked by the user on 2026-11-05
(`reports/ch00_coordinates_user_feedback.md`): **#5 *Coordinates* is split into five consecutive parts, #5a–#5e**, after
the build-1 feedback, and **#6 *The gradient* is paused** until the five parts are done, then revised so that ∇T on the
sphere is derived clearly. The split itself (feedback map, scenes, derivations, effort) is in
`movies/ch00/ch00_coordinates/split_plan.md`. The user's decisions on the split (`split_plan.md` §5b) may still change
part lengths; positions do not depend on them unless a sixth part is chosen (then every position from 12 on moves by
one more).

**What v6 changes.** Everything v5 says still holds, with these edits:
- the five parts replace #5 at positions 7–11, so **every later position moves by +4**;
- the prerequisites that named #5 now name the part they need;
- the concept audit (§5) has six new rows for what the parts teach;
- three statuses are brought up to date (0.3 and #4 final, #6 paused).

Titles, scopes, data and IDs of all other movies are unchanged. v5 §2 (changes vs v4) and §8 (the v5 pointer fixes) are
kept below as records, with their v5 positions.

**Standing rule (user, 2026-11-04), still binding.** Every basic atmospheric-science term and concept is taught **before
the map-reading block starts**: in v6, by **position 42** (M02, the last understanding-block movie). The map-reading
block runs **43–56**. **F14**, the first movie that needs the EUMETSAT / ECMWF (TIGGE) / NCAR RDA accounts, is at
**position 74** (v5: 70).

---

## 1. Summary

### 1a. Counts
| | v5 | v6 |
|---|---|---|
| Distinct movies (IDs) | 176 | **180** (#5 → #5a–#5e: +4) |
| Movies in the viewing order | 174 | **178** |
| Alternate cuts outside the viewing order | 2 (0.1, 0.2) | 2 (unchanged) |
| 0–1 basics and maths (viewing order) | 8 (pos 1–8) | **12** (pos 1–12) |
| Understanding block | 30 (pos 9–38) | 30 (**pos 13–42**, M02 last) |
| Map-reading block | 14 (pos 39–52) | 14 (**pos 43–56**) |
| Forecasting block F | 39 (pos 53–91) | 39 (**pos 57–95**) |
| Later stages (1b, T, R, W, S, G, A, O, CV, CE) | 83 (pos 92–174) | 83 (**pos 96–178**) |
| First movie needing the EUMETSAT / ECMWF / NCAR accounts | F14 (pos 70) | **F14 (pos 74)** |

Stage counts: 0–1: **15** (was 11), U: 18, M: 26, T: 11, R: 12, W: 7, S: 10, G: 4, F: 39, A: 2, O: 12, CV: 7, CE: 17;
total **180**.

### 1b. The viewing order of the blocks
```
OPENING (12)         0.1b → #2 → 0.3 weather basics → #3 → 1a → #4 → #5a → #5b → #5c → #5d → #5e → #6
   │
UNDERSTANDING (30)   M01 · U01 · M03 · U02 · M07 · M08 · M09 · M16 · U03 · M12 · M13 · M14 · M15 · U04 · U05 · U06 · U07
                     · M04 · U08 · U09 · U10 · U11 · U12 · U13 · U14 · U15 · U16 · U17 · U18 · M02 (bridge: the chart frame)
   │                 ── every basic term is taught by here (pos 42) ──
MAP READING (14)     M05 · M06 · M10 · M21 · M22 · M23 · M11 · M24 · M17 · M18 · M19 · M25 · M26 · M20   (pos 43–56)
   │
FORECASTING (39)     method → everyday rain → mid-latitude storms → heavy rain → convection → tropical → monsoon
                     → floods → winter → heat and dry → warnings → capstone   (pos 57–95, §7)
   │
LATER (83)           1b · T · R · W · S · G · A · O · CV · CE   (pos 96–178)

ALTERNATE CUTS       0.1 (short cut of 0.1b) · 0.2 (single-file cut of #2 + #3) — outside the numbered order
```

**Why the parts sit here.** They keep #5's place between #4 (derivatives, chain rule) and #6 (gradient). Part 2 needs
#4's limits and chain rule. Part 4's ∂p/∂τ needs #4's traveller rate. #6's gradient on the sphere needs Part 3's
δx = a cos φ δλ and Part 4's i, j, k. Part 5 ends by naming #6 as the next movie.

### 1c. Alternate cuts (outside the numbered viewing order)
Unchanged from v5 §1c: 0.1 (`ch00_dot_product_why` v6, 17:40, the house-style reference) and 0.2 (`ch00_cross_product_why`
v5 full, 1:09:15). The #5 build 1 (`ch00_coordinates`, 48:46) is **not** an alternate cut: it is an unpublished archive.

---

## 2. Changes in v6 vs v5
1. **#5 → #5a–#5e** (positions 7–11):

   | Pos | ID | Slug | Title | Est. | Build-1 scenes |
   |---|---|---|---|---|---|
   | 7 | #5a | `ch00_coordinates_flat` | Coordinates, Part 1 — Arrows on a flat map: polar coordinates and rotated axes | 25.5 min | s00–s08, s10–s12, s37–s38 |
   | 8 | #5b | `ch00_coordinates_storm` | Coordinates, Part 2 — Inside a tropical cyclone: turning arrows and cylindrical coordinates | 25.6 min | s09, s13, s14, s14b, s39, s40 + Amphan + GEE slider |
   | 9 | #5c | `ch00_coordinates_sphere` | Coordinates, Part 3 — Our round Earth: latitude, longitude, distances and areas | 25.4 min | s15–s23 |
   | 10 | #5d | `ch00_coordinates_frames` | Coordinates, Part 4 — Moving frames: local axes and storm-relative winds | 25.6 min | s24–s26, s41–s45 |
   | 11 | #5e | `ch00_coordinates_maps` | Coordinates, Part 5 — Routes and maps: great circles and map projections | 23.2 min | s27–s36 |

   Total ≈ 125 min (build 1: 48:46). Lengths are planning estimates; each storyboard gets a `tools/tts.py` dry run.
2. **Every position from v5 8 on moves by +4.** In the live sections (§3–§7, §9, §10) every "pos N", "position N" and
   "ID (N)" is the v6 position. The tables in §6 and §7 carry a "v5 pos" column.
3. **Prerequisites re-pointed to the part they need:**
   - #6 → #5c, #5e; M01 → #5e; M03 → #5b (gradient-wind pointer);
   - U18 → #5a (radar r, θ); M02 and M05 → #5c, #5e; M25 → #5d (∂p/∂τ);
   - F19 → #5b (surge); R01 → #5b (−v²/r); R02 → #5d (turning i, j, k); CE15 → #5b (before/after slider), #5c.
4. **Concept audit (§5):**
   - the five #5 rows now name their part;
   - six new rows: slopes of sine and cosine, the product rule, integration (#5b, #5c); position vector, ground speed
     and area element (#5c); local frames and metric terms (#5d); Galilean frames and ∂p/∂τ (#5d); great circles and
     Mercator (#5e); the before/after inundation picture (#5b).
5. **Polar stereographic** is now named in #5e (the user asked for a full explanation of the polar map). M02 still names
   Lambert conformal and Tissot's indicatrix, and recaps polar stereographic in one line.
6. **Statuses:**
   - 0.3 weather basics and #4 are final (2026-11-04);
   - **#6 is paused**: build 1 is K6-clean but not rendered, and its s22–s23 are re-voiced after #5e (split_plan §3b);
   - #5 build 1 is archived;
   - #5a–#5e are planned.
7. **Build order** (user, 2026-11-05): #5a → #5b → #5c → #5d → #5e → #6 revision → M01 → U01 → … in viewing order.
   One Remotion/Chrome job at a time.
8. **Data accounts.** F14, the first movie that needs EUMETSAT, ECMWF (TIGGE) and NCAR RDA, moves to position 74. The
   reminder rule (every 3–4 finished movies and at every update) is unchanged.
9. **Checks** (§6a): `deps_v6.py` reads this file. Every prerequisite must point earlier, every §4 home must sit at or
   before position 42 and before its first need, and every §5 "first taught" must come at or before "first used", with
   printed positions matching §6.

---

## 2b. Record: changes in v5 vs v4 (v5 positions; unchanged text)
1. **A · Alternate cuts.** 0.1 (v6, 17:40) and the full 0.2 (1:09:15) leave the viewing order (v4 positions 1 and 3).
   Viewers watch 0.1b, #2 and #3, which contain the same teaching. They are listed in §1c.
2. **B · New opening order** 0.1b → #2 → 0.3 → #3 → 1a → #4 → #5 → #6 (v4: 0.1 · 0.1b · 0.2 · 0.3 · 1a · #2 · #3 · #4 ·
   #5 · #6). Positions 1–8.
3. **C · M02 moves** from v4 position 40 (first of the map block) to **position 38, the end of the understanding block**,
   and is extended with the chart-frame scenes of #69 v3 s02–s11 (projections incl. Lambert conformal, polar
   stereographic and Tissot; legend and units; UTC/Z and synoptic hours; initial, valid and lead time; traps) and one
   line on chaos. **35–40 min.** M05 drops the frame and the wind barbs (barbs → M03) and recaps both in about a minute.
   The #69 split is amended in §3 (M02, M03, M05 notes).
4. **D · Forecasting re-ordered easy → hard** (§7): F01 → F29 → mid-latitude (F02, F03, F05) → heavy rain (F04, F21, F22)
   → convection (F06, F07, F34, F09, F08, F11, F10, F12) → tropical (F13, F14, F15, F17, F16, F18, F19, F20) → monsoon
   (F30, F23) → floods (F31–F33) → winter (F24, F35, F25) → heat and dry (F26, F37, F36, F38, F39) → F27 → F28. Every
   prerequisite still points earlier (checked by script, §6a).
5. **E · 14 movies re-scoped** (§3): U01, M03, M16, U03, M08, M13, M15, U07, M04, U08, U13, U15, M02, M05. Each now
   recaps, in ≤ 2–3 minutes, what the finished movies already teach (audit §2), and absorbs its share of the 18 untaught
   basic terms (§4). **Wind barbs go into M03.** Thirteen more movies the audit names get short notes (§3b): U02, M12,
   M14, U10, U14, U17, M06, M17, M22, M24, F19, R01, R02.
6. **Prerequisite notation and lists** (audit §4c):
   - movie numbers are written **#2–#6** everywhere (v4 wrote bare digits, so "U17 needs 3" looked like position 3);
   - added: **0.1b → M16**, **#4 → U03**, **#5 → F19**, **M03 → M14** (barbs), **U16 → M22** (tropical easterly jet),
     #3 → U01/M03/U10/U17/R01/R02, 1a → U08/U13/U14, M04 → U08, U07 → M06, M16 → M17, M02 → M05, U17 → M02;
   - self-inclusions removed: M20 "M01–M19, M21–M26", F28 "F01–F27, F29–F39";
   - **#2 now needs 0.1b, not 1a.** v4 listed 1a for #2, which would point forward in the new opening. #2 does not need
     it: its s15a introduces the index form on the spot and says "which the index-notation video builds step by step"
     (a correct forward pointer, 1a is at pos 5). 1a likewise needs 0.1b (v4: 0.1, now an alternate).
7. **Statuses brought up to date:** 0.3 weather basics is in **UF2 fix loop 3**; #4 is in **fix loop 3** (v4 said 2);
   **M01 has a storyboard and script** (v4: "plan being written"); #5 and #6 are storyboard v3 with the v5 pointer fixes;
   #2, #3, 1a and 1b carry "pointer re-voice queued" (§10).
8. **#5 and #6 pointer fixes done** in their storyboards and scripts (measured, §8). **Tissot check:** #5 *does* draw
   Tissot circles (s31–s34) and its polar view is polar stereographic (s35), but names neither in the narration; the
   audit read the narration only. The plan claim stands for the pictures; M02 adds the names and Lambert conformal (§8).
9. **New stale pointers found** while checking the new opening (not in the audit): #2 says "the next video" puts the
   cross product to work on the spinning Earth, and #3 says "from the last video" for Part 1 — with 0.3 now between them,
   both are wrong. Queued in §10 with the others.
10. **Maths-track note (audit c10).** On the site, T01–T04 are marked an optional **maths track** that can be watched any
    time after U10, and the F block is marked skippable for a reader heading straight to Vallis Ch. 1. Positions are
    not changed.
11. **Lengths** of the re-scoped movies are planning estimates (no storyboard yet). Each storyboard gets a `tools/tts.py`
    dry run when it is written (HOUSE_STYLE). Block estimate: understanding about 13–15 h for 30 movies (the M02 move
    adds about 38 min; the re-scopes save about 20 min); map reading about 5.5–6.5 h; F about 19–21 h (unchanged).

---

## 3. Re-scope notes (E): the 14 movies
Format per movie: **recap** (what finished movies already teach, with scenes — say it, never re-derive it) · **new** (what
this movie adds) · **terms absorbed** (§4 numbers) · **drops** · length · prerequisites. Data and cases are v4's unless
stated. "≤ 3 min recap" is a cap, not a target.

### U01 (pos 14) · Where pressure differences come from: the PGF (recap), thermal lows and highs, lee troughs
- **Recap (≤ 3 min):** the box derivation of −(1/ρ)∇p and its size, 1 hPa per 100 km → ≈ 8 × 10⁻⁴ m s⁻², Ciarán's push
  (#6 s24–s29); the formula on the spinning Earth (#3 s39–s41); the sea breeze as a PGF wind (#6 s35). No re-derivation.
- **New:** where pressure differences come from. Heating: a warm column expands, so surface pressure falls under it,
  which makes **thermal (heat) lows** and **thermal highs** (cold continental highs). Real cases: the summer heat lows over
  north-west India and Pakistan and over the Sahara; the winter Siberian high (ERA5 MSLP monthly means). The **monsoon
  trough** as a chain of heat lows, first look (full: U16). The sea-breeze cell in 3-D with its return flow aloft (adds
  the vertical half to #6's surface picture). Piling up air raises pressure (preview of U02). **Lee troughs**: air
  sinking down the lee side of a long ridge stretches and warms, so a trough appears on surface charts (east of the
  Rockies, east of the Andes). One worked number kept from v4: how fast air would get after an hour with the PGF alone.
- **Terms absorbed:** b12 (thermal lows and highs, lee troughs, the monsoon trough on surface charts).
- **Drops:** the PGF derivation and the full sea-breeze mechanism (both in #6).
- **Length:** 20–25 → **12–15 min**. **Prereqs:** #3, #6, 0.3, M01.

### M03 (pos 15) · Wind on weather charts: Buys Ballot, gradient, cyclostrophic and friction winds, scales, wind barbs
- **Recap (≤ 3 min):** #3 s23–s46 derive −2Ω × u and f = 2Ω sin φ, give the hemisphere rule (right in the NH, left in the
  SH), the size of the push and the inertial period, show inertial loops, trades and westerlies, derive the geostrophic
  wind and test it on Ciarán (about 15 % sub-geostrophic round the tight low; friction turns the surface wind toward
  the low). Recap only.
- **New:** **Buys Ballot's law** by name (back to the wind, low pressure on the left in the NH, on the right in the SH) on
  a NH and a SH low; why geostrophy fails within a few degrees of the equator (f → 0); the **gradient wind** (curved
  isobars: weaker than geostrophic round lows, stronger round highs, and why highs have slack centres), worked;
  **cyclostrophic** balance in tornadoes and dust devils (one worked number); **friction angles** 10–20° over the sea and
  25–40° over land, measured on ERA5 10-m wind against the geostrophic wind; observed inertial loops of GDP drifters
  (the ocean version of #3's globe loops). **Scales** (planetary, synoptic, mesoscale, storm scale), with where rotation
  matters (Rossby number in words: a sea breeze against a low). **Wind barbs and plotted wind arrows** (from #69 s38–s39):
  the shaft points to where the wind comes from, half barb 5 kt, full barb 10 kt, pennant 50 kt, calm circle, barbs on
  the other side in the SH; read on a real chart.
- **Terms absorbed:** b1 (barbs), b10 (scales).
- **Drops:** re-deriving the Coriolis term and the geostrophic wind (#3; full derivations stay in R02 and R05).
- **Length:** 30–35 → **25–30 min**. **Prereqs:** #3, #5b, #6, 0.3, U01. Barbs come before their first use in M14 (pos 24).

### M08 (pos 18) · Geopotential (+ standard deviation and percentile)
- **Recap:** anomaly and climatology (1a s12h, 1991–2020) and the 10–90 % band of 0.3 (weather vs climate). Anomaly is
  not re-taught.
- **New (one change on top of v4):** scene 9 defines the standard deviation in words and **names the percentile**: the
  10–90 % band of 0.3 runs from the 10th to the 90th percentile.
- **Terms absorbed:** b17. **Length:** 30–40 → **31–41 min**. **Prereqs:** unchanged (#4, #6, 0.3, M01, M03, M07).

### M16 (pos 20) · The climate machine (+ night cooling, seasons, aerosols)
- **Recap (≤ 2 min):** σT⁴, the 255-K emission temperature, the Planck response 3.8 W m⁻² K⁻¹, CO₂ forcing and the
  water-vapour feedback (#4 s42–s43); sunlight on tilted ground as a flux (0.1b s20c, which says "the climate machine
  video builds on exactly this"); differential heating by latitude (0.3 s51).
- **New:** v4 night cooling and the surface energy budget, plus **seasons from the axial tilt** (0.3 shows the equinox
  only) and **aerosols**: dust, smoke, sea salt and sulphate haze, how they scatter and absorb sunlight, what haze looks
  like (aerosol optical depth in words; F36 measures it).
- **Terms absorbed:** b14 (aerosols), b16 (seasons). **Length:** 30–40 → **33–43 min**. **Prereqs:** #4, 0.3, 0.1b.

### U03 (pos 21) · Temperature with height: real soundings, the standard atmosphere and inversions
- **Recap (≤ 2 min):** the cooling of rising air, ≈ 6.5 K/km on average and the tropopause by latitude (0.3 s23–s25); the
  lapse rate named, with its sign flip (#4 s09, s09b); the Singapore sounding and its tropopause (#6 s17). The sign
  convention Γ = −dT/dz is recapped in one line, not re-taught.
- **New:** the environmental lapse rate on real soundings and how far real days depart from the ICAO standard atmosphere;
  three inversions (radiation, subsidence, frontal) and why they trap smog and fog; the tropopause read on a sounding.
- **Length:** 25–30 → **15–20 min**. **Prereqs:** 0.3, #4, M07, M16.

### M13 (pos 23) · Water in the air: mixing ratio, wet-bulb, dew-point depression, LCL, CAPE/CIN
- **Recap (≤ 2 min):** specific humidity q, e ≈ 1.61 q p, saturation, RH, dew point and the cloud base computed from them
  (0.3 s27–s31); Clausius–Clapeyron, 7 % more vapour per kelvin and latent heat (#4 s39–s41).
- **New:** mixing ratio; the **wet-bulb temperature**; **dew-point depression** (T − Td, the forecaster's "spread") by name;
  the **LCL named** as 0.3's cloud base and found from the spread (about 125 m per kelvin of spread); CAPE and CIN.
- **Terms absorbed:** b6. **Drops:** re-teaching q, RH, dew point and Clausius–Clapeyron.
- **Length:** 30–35 → **25–30 min**. **Prereqs:** M12, #4, 0.3.

### M15 (pos 25) · How clouds form, cloud types, and cloud amount
- **New (added to v4):** cloud amount in **oktas** (eighths of the sky); **FEW** 1–2, **SCT** 3–4, **BKN** 5–7, **OVC** 8
  oktas; **cloud base vs ceiling** (the lowest broken or overcast layer). Read on a sky photo and a satellite pixel.
- **Terms absorbed:** b7. **Length:** 25–30 → **28–33 min**. **Prereqs:** unchanged (M12, M13, U02).

### U07 (pos 29) · The boundary layer and the day–night cycle (+ visibility, mist, haze, fog; gusts vs mean wind)
- **Recap (≤ 1 min):** the sea breeze (#6 s35); U07 adds the land breeze, mountain and valley winds, föhn and the LLJ.
- **New (added to v4):** **visibility** (what it is, metres and statute miles, how sensors measure it); **mist vs fog**
  (visibility above or below 1 km), **haze** (dry particles, recap of M16) and smoke. **Gusts vs the mean wind**: a mean
  over minutes (10 min for WMO reports, 2 min in US METARs) against a 3-s peak, worked on ISD hourly reports (the
  storyboard checks the averaging rules against the WMO and NWS documents).
- **Terms absorbed:** b8, b15. **Length:** 30–35 → **34–39 min**. **Prereqs:** #6, M03, M12, M13, M16, U03.

### M04 (pos 30) · Air masses and fronts (+ veering and backing at a front)
- **Recap (≤ 2 min):** air masses mP/mT/cP/cT, cold and warm fronts, their slopes, the front stack, the two front symbols
  and the warm sector (0.3); warm advection at a warm front (1a, +3.7 K/h at Brest).
- **New:** occluded and stationary fronts, squall lines and drylines, the frontal weather sequence, the front clues; and
  **veering and backing**: veering is a clockwise change of wind direction (seen from above), backing anticlockwise, in
  both hemispheres; a NH cold front veers the wind (south-west → north-west), a SH cold front backs it (north-west →
  south-west).
- **Terms absorbed:** b9 (in time). **Drops:** re-teaching air masses and the two basic fronts.
- **Length:** 25–30 → **20–25 min**. **Prereqs:** unchanged (0.3, M01, M03, M12).

### U08 (pos 31) · The jet stream: a first look (+ veering and backing with height, streamlines)
- **Recap (≤ 2 min):** the jet above the strongest temperature gradient and the thermal wind named (#6 s36); the 1a
  hodograph (850/500 hPa) where the wind turned clockwise with height over warm air (1a s12g).
- **New (added to v4):** the 1a picture **named**: in the NH, wind veering with height means warm advection and backing
  with height means cold advection (the SH is the other way round), from the thermal wind in words. **Streamlines**:
  lines that follow the wind everywhere, used where isobars fail (the tropics); streamlines vs isobars vs height
  contours, on 850-hPa winds over the Indian monsoon (the same picture U16 builds on).
- **Terms absorbed:** b9 (with height), b11. **Length:** 25–30 → **28–33 min**. **Prereqs:** 1a, M03, M04, M08, M09, U02.

### U13 (pos 36) · Severe storms (hodograph recap)
- **Recap (≤ 2 min):** the hodograph, wind shear and storm-relative wind (1a s12g and s12i). The hodograph is no longer
  "explained from zero".
- **New:** storm-relative helicity in words, why shear organises storms, supercells, tornadoes, large hail, downbursts and
  derechos (v4).
- **Length:** 30–35 → **28–33 min**. **Prereqs:** 1a, U12, U08, M03.

### U15 (pos 38) · How tropical cyclones form, and how their strength is classed
- **Recap (≤ 2 min):** hurricane, eye, Ian (NH) vs Idai (SH) spin sense (#3 s35–s38); Ian's tangential and radial winds and
  the 19° inflow angle (#5a s19–s23) and the centripetal acceleration and 3-D winds (#5b s08–s19); f ≠ 0 off the equator (#3, M03).
- **New (added to v4):** **intensity classes** and the **maximum sustained wind** (its averaging time: 1 min for NHC, 3 min for IMD,
  10 min for WMO, which ties back to U07's gusts): tropical depression → tropical storm → hurricane / typhoon /
  cyclone; Saffir–Simpson categories 1–5; the IMD scale (depression to super cyclonic storm). Thresholds are read from
  the NHC and IMD documents in the storyboard.
- **Terms absorbed:** b13. **Length:** 30–35 → **33–38 min**. **Prereqs:** unchanged (U14, M12, M13, M03, U02, U08).

### M02 (pos 42, moved from v4 40) · How weather maps are made, and the chart frame
- **Part 1 (v3 scope, ≈ 20 min):** from observations to a grid: the observing network (reuse #69 s29's network data; the
  scene itself stays in M06), satellites and radars as observations (recap U17/U18), objective analysis, data
  assimilation, reanalysis (recap 0.3 s38, 1a, #3, #6: the viewer has used ERA5 since 0.3), contouring and its artefacts.
- **Part 2, the chart frame (≈ 15–20 min, #69 s02–s11 moved here):**
  - s02–s05 latitude, longitude, degrees, flattening: a 1-min recap of #5c (latitude, longitude, δx, δy) and #5e s12–s13 (plate carrée);
  - s06 Tissot and Mercator: **Tissot's indicatrix named**, recapping the circles #5e drew (s13–s18);
  - s07 chart projections: **Lambert conformal conic** (mid-latitude charts), **polar stereographic** (hemispheric charts;
    the view #5e s20 opens into and names; M02 recaps it), Mercator (tropical charts);
  - s08 the **legend and units table**: hPa, dam, kt, °C, g/kg, mm, dBZ, each with the movie that taught it;
  - s09 **UTC and Z (Zulu)**, the synoptic hours 00/06/12/18 Z, local-time conversion (Dhaka UTC+6, Brest UTC+1/+2);
  - s10 **initial (analysis) vs valid time, lead time, "+24 h"**, analysis vs forecast, one model run;
  - s11 the traps;
  - one line on **chaos**: tiny differences grow, which is why forecasters run ensembles (M19 in full).
- **Terms absorbed:** b2, b3, b4, b5, b18.
- **Length:** 25–30 → **35–40 min** (or two halves under one ID, M02 parts 1 and 2, if the storyboard runs long).
- **Prereqs:** #5c, #5e, 0.3, M01, M03, U17. It is the bridge into the map block: everything M05 opens with is known.

### M05 (pos 43) · Reading the surface chart
- **Drops:** the frame (#69 s02–s11 → M02) and the barbs (#69 s38–s39 → M03). A **1-min recap** of both opens the movie.
- **Keeps:** #69 s12–s28 (isobars, sea level, spacing, the geostrophic idea and number as an application of #3 and M03,
  Buys Ballot at Brest and in the south as practice of M03, troughs and ridges, fronts as a recap of M04 applied to the
  chart, squall lines and drylines, front clues incl. veering, building the analysis). Tendencies and isallobars stay in
  M25 (v4).
- **Length:** 25–30 → **20–25 min**. **Prereqs:** M01, M02, M03, M04, U11, #5c, #5e.

### 3a. The #69 v3 split, amended
| #69 v3 scenes | v4 went to | v5 goes to |
|---|---|---|
| s02–s11 (frame: lat/lon, degrees, flattening, Tissot + Mercator, chart projections, legend, UTC/Z, valid/initial, traps) | M05 | **M02** |
| s12–s28 (surface chart, fronts) | M05 | M05 |
| s38–s39 (barbs) | M05 | **M03** |
| all other rows | v4 §3a | unchanged |

### 3b. Short notes on the other movies the audit names
| Movie (pos) | Note |
|---|---|
| U02 (16) | Convergence into lows → rising, sinking under highs is already said in words (0.3 s43); U02 recaps it in one line and adds the numbers. |
| M12 (22) | ≈ 10 K/km for rising air is in 0.3 s26 and s31 (words) and the first law, latent heat and θ (named) in #4: recap them, then derive. |
| M14 (24) | Prereq M03 added (barbs); a 30-s barb recap where the wind column is drawn. |
| U10 (33) | Prereqs "#3 (spin r × u), M03, M09, U02, U09": vorticity builds on #3's r × u spin, not on the dot product. Vorticity is first met here (#5a s23 points here). |
| U14 (37) | El Niño's trade-wind anomaly is already pictured in 1a s12h: recap it, then the one-picture mechanism. |
| U17 (40) | Prereq written "#3 (Ω)" (geostationary orbit uses Earth's spin). |
| M06 (44) | Oktas (M15), visibility and gusts (U07) are recaps here; prereq U07 added. |
| M17 (51) | Dust and smoke on RGB images recap M16's aerosols; prereq M16 added. |
| M22 (47) | Prereq U16 added (the tropical easterly jet). |
| M24 (50) | The nor'wester sounding is described on screen as "a pre-monsoon storm day over Bengal" (nor'westers come in F11). |
| F19 (79) | Prereq #5b: #5b s21–s25 introduce the surge, the along/across-coast winds and a before/after inundation slider (Ian, Fort Myers); F19 recaps them. |
| R01 (108) | A recap of #3 s27b–g (centrifugal, effective gravity, the geoid) and 1b, then what is new (circular motion in full). |
| R02 (109) | Re-scoped to what #3 left out: the w terms, the full 3-D Coriolis term (the cos φ parts), inertial oscillations in full, the f- and β-plane. |

---

## 4. The 18 basic terms the map block needs, and their homes
Positions are v6 viewing positions. "First needed by" is the earliest movie in the order that uses the term. Every home
sits at or before position 42 (the last understanding-block movie, M02) and before its first need.

| # | Term or concept | Home (pos) | First needed by (pos) | Also used by |
|---|---|---|---|---|
| b1 | Wind barbs (calm, 5/10/50 kt, which end points where) and plotted wind arrows | M03 (15) | M14 (24) | M14, U13, M05, M06, M10, M21–M24 |
| b2 | Z (Zulu) time, synoptic hours 00/06/12/18 Z, local-time conversion | M02 (42) | M05 (43) | M05, M06, M24 |
| b3 | Initial (analysis) time, valid time, lead time, "+24 h"; analysis vs forecast; one model run | M02 (42) | M05 (43) | M05, M10, M19, M25 |
| b4 | Projections on weather charts: Lambert conformal, polar stereographic, Mercator; Tissot ellipses named | M02 (42) | M05 (43) | M05, M21, M22 |
| b5 | Chart legend and units table: hPa, dam, kt, °C, g/kg, mm, dBZ | M02 (42) | M05 (43) | all of M |
| b6 | Dew-point depression (T − Td, "spread") named | M13 (23) | M06 (44) | M06, M10, M24, F25 |
| b7 | Cloud amount in oktas; FEW/SCT/BKN/OVC; cloud base vs ceiling | M15 (25) | M06 (44) | M06, M17, F25 |
| b8 | Visibility (m and statute miles); mist vs fog (1 km); haze; smoke | U07 (29) | M06 (44) | M06, M17, F25, F36 |
| b9 | Veering / backing: in time at a front (M04) and with height ↔ warm/cold advection (U08) | M04 (30), U08 (31) | M05 (43) | M05, M10, M24, F06 |
| b10 | Scales: planetary, synoptic, mesoscale, storm scale | M03 (15) | M05 (43) | M05 onwards, F |
| b11 | Streamlines (vs isobars and height contours) | U08 (31) | U16 (39) | U16, M22, M17 |
| b12 | Thermal (heat) lows and highs, lee troughs, the monsoon trough on surface charts | U01 (14) | M05 (43) | M05, F11, F30 |
| b13 | Tropical-cyclone intensity classes; maximum sustained wind | U15 (38) | M05 (43) | M05, M17, F13–F18 |
| b14 | Aerosols: dust, smoke, haze (what they are, how they scatter and absorb) | M16 (20) | M17 (51) | M17, F36, F38 |
| b15 | Gust vs mean wind (averaging times) | U07 (29) | M06 (44) | M06, F05 |
| b16 | Seasons from the axial tilt | M16 (20) | U08 (31) | U08, U16 |
| b17 | Percentile (the 10–90 % band named) | M08 (18) | F26 (89) | F26, F39, CE |
| b18 | Chaos / predictability in one picture (why forecasts need ensembles) | M02 (42) | M19 (53) | M19 |

**Chart conventions taught inside the map block on purpose** (reading skills, not concepts; allowed by the rule, audit
§4a): METAR/SYNOP code groups, the station-model layout, present-weather glyphs, isallobars, the trough-axis method,
the 5520/5640-m lines, RGB recipes, radar artefacts and verification scores.

---

## 5. Concept audit: where each concept is first taught, and first used
Re-done for the v6 order (v5 §5 with the #5 parts), with the audit's corrections: what the finished movies actually teach (audit §2a)
replaces v4's "first taught" where they came earlier, and the 18 terms are added. "Itself" means the movie teaches it on
screen before using it. Checked by script: every teaching movie listed sits at or before the first use.

| Concept | First taught in (pos) | First used in (pos) |
|---|---|---|
| Latitude, longitude, degree length, distance on a map | #5c (9) | M05 (43) |
| Plate carrée, Mercator, Equal Earth, the polar view (polar stereographic, named), with Tissot circles drawn | #5e (11) | M05 (43) |
| Chart projections named: Lambert conformal, polar stereographic; Tissot's indicatrix named | M02 (42) | M05 (43) |
| Partial derivative, ∂/∂t at a place | #4 (6) | M06 (44) |
| Gradient, spacing → strength | #6 (12) | M05 (43) |
| Advection −v·∇T | 0.1b (1) | M10 (45) |
| Pressure, hPa, hydrostatic, sea-level reduction, reanalysis (first pass) | 0.3 (3) | M05 (43) |
| Dew point, RH, saturation (first pass) | 0.3 (3) | M06 (44) |
| Air masses, cold and warm fronts, front symbols (first pass) | 0.3 (3) | M05 (43) |
| Occluded and stationary fronts, drylines, squall lines | M04 (30) | M05 (43) |
| Subtropical highs, trades, westerlies | 0.3 (3), #3 (4) | F17 (76) |
| Contour, interval, isobar, isotherm, isotach, isohypse, isobath; highs, lows, ridges, troughs, cols | M01 (13) | M05 (43) |
| Terrain contours, DEM as a gridded height map | M01 (13) | F31 (83) |
| Pressure-gradient force −(1/ρ)∇p (formula #3, derived and worked #6, recapped U01) | #3 (4), #6 (12), U01 (14) | M05 (43) |
| Thermal (heat) lows and highs, lee troughs | U01 (14) | M05 (43) |
| Sea breeze | #6 (12), U01 (14), U07 (29) | F25 (88) |
| Coriolis, f = 2Ω sin φ, hemisphere sign, inertial loops | #3 (4) | M05 (43) |
| Geostrophic wind (derived, tested on Ciarán) | #3 (4) | M05 (43) |
| Buys Ballot by name, equatorial failure of geostrophy | M03 (15) | M05 (43) |
| Gradient wind, cyclostrophic balance | M03 (15) | U13 (36) |
| Friction and cross-isobar inflow (first pass); friction angles over land and sea | 0.3 (3), #3 (4), M03 (15) | M05 (43) |
| Scales: planetary, synoptic, mesoscale, storm | M03 (15) | M05 (43) |
| Wind barbs and plotted winds | M03 (15) | M14 (24) |
| Convergence, divergence, rising and sinking air (words 0.3, numbers U02) | 0.3 (3), U02 (16) | M22 (47) |
| ω (Pa/s) as vertical velocity | M07 (17) | M22 (47) |
| Pressure as a vertical coordinate, isobaric surface | M07 (17) | M10 (45) |
| Geopotential, geopotential height, dam | M08 (18) | M10 (45) |
| Height contours act like isobars | M08 (18) | M21 (46) |
| Hypsometric equation, thickness, warm columns taller | M08 (18) | M23 (48) |
| Anomaly and climatology (1a); standard deviation and percentile (M08) | 1a (5), M08 (18) | F04 (62) |
| Blocking high, cut-off low (observed) | M08 (18), U09 (32) | M21 (46) |
| Standard levels and what each shows | M09 (19) | M10 (45) |
| Emission temperature, σT⁴, Planck response (#4); radiation balance, night cooling (M16) | #4 (6), M16 (20) | F25 (88) |
| Seasons from the axial tilt | M16 (20) | U08 (31) |
| Aerosols: dust, smoke, haze | M16 (20) | M17 (51) |
| Brightness temperature, WV absorption | M16 (20), U17 (40) | M17 (51) |
| Lapse rate and its sign (#4); environmental lapse rate, inversions, standard atmosphere (U03) | #4 (6), U03 (21) | M14 (24) |
| Tropopause (first pass 0.3; on a sounding U03) | 0.3 (3), U03 (21) | M24 (50) |
| First law, dry adiabatic lapse rate, θ | #4 (6), M12 (22) | M24 (50) |
| Latent heat (#4); moist adiabat, θe (M12) | #4 (6), M12 (22) | M10 (45) |
| Absolute vs conditional instability, parcel method | M12 (22) | M24 (50) |
| Clausius–Clapeyron, 7 % per K (#4); mixing ratio (M13) | #4 (6), M13 (23) | F04 (62) |
| Wet-bulb temperature | M13 (23) | F26 (89) |
| Dew-point depression (spread) | M13 (23) | M06 (44) |
| LCL (0.3's cloud base, named in M13), CAPE, CIN | 0.3 (3), M13 (23) | M24 (50) |
| Skew-T lines, LFC, EL, freezing level | M14 (24) | M24 (50) |
| Four lifting mechanisms, cloud types | M15 (25) | M06 (44) |
| Oktas, FEW/SCT/BKN/OVC, ceiling | M15 (25) | M06 (44) |
| Warm rain, drop sizes | U04 (26) | M06 (44) |
| Ice process (Bergeron), snow, graupel, hail growth | U05 (27) | M06 (44) |
| Precipitation type, warm nose, freezing rain, sleet | U05 (27) | M23 (48) |
| Rain rate, stratiform vs convective | U06 (28) | M18 (52) |
| Precipitable water, IVT, atmospheric river | U06 (28) | F04 (62) |
| Orographic rain, rain shadow | U06 (28) | F21 (63) |
| Return period | U06 (28) | F22 (64) |
| Boundary layer, day–night cycle, surface energy budget | U07 (29) | F26 (89) |
| Nocturnal low-level jet | U07 (29) | M10 (45) |
| Föhn and downslope winds | U07 (29) | F38 (92) |
| How fog forms (four types) | U07 (29) | F25 (88) |
| Visibility, mist, haze; gusts vs mean wind | U07 (29) | M06 (44) |
| Veering and backing at a front | M04 (30) | M05 (43) |
| Veering and backing with height ↔ warm and cold advection | 1a (5), U08 (31) | M10 (45) |
| Streamlines | U08 (31) | U16 (39) |
| Thermal wind (named #6; in words U08), jets, jet streak entrance/exit | #6 (12), U08 (31) | M22 (47) |
| Vertical wind shear (1a), hodograph (1a) | 1a (5), U08 (31) | F06 (65) |
| Troughs and ridges as moving waves | U09 (32) | M21 (46) |
| Polar vortex (picture #5e; two kinds, SSW U09) | #5e (11), U09 (32) | F37 (90) |
| Sinking under ridges → warming | M12 (22), U09 (32) | F26 (89) |
| Vorticity, sign, vorticity maxima, vorticity advection → rising | U10 (33) | M21 (46) |
| Cyclone life cycle, occlusion, conveyor belts, dry slot | U11 (34) | M05 (43) |
| Bomb cyclone (words) | U11 (34) | F05 (61) |
| Thunderstorm life cycle, outflow boundary, gust front | U12 (35) | M17 (51) |
| Training, back-building, MCS | U12 (35) | F22 (64) |
| Lightning physics | U12 (35) | M17 (51) |
| Storm-relative helicity, supercell, mesocyclone | U13 (36) | M18 (52) |
| Tornado formation, downbursts, derechos, large hail | U13 (36) | F07 (66) |
| SST, evaporation, ocean heat content, mixed layer, cold wake | U14 (37) | F13 (73) |
| El Niño (picture 1a; one-picture mechanism U14) | 1a (5), U14 (37) | F39 (93) |
| Hurricane, eye, spin sense by hemisphere (#3); tangential and radial winds, inflow angle (#5a); centripetal acceleration, 3-D in-up-out winds, a Bay of Bengal cyclone (#5b) | #3 (4), #5a (7), #5b (8) | F14 (74) |
| Tropical-cyclone ingredients, 26.5 °C, 5° rule, warm core | U15 (38) | F01 (57) |
| Tropical-cyclone intensity classes, maximum sustained wind | U15 (38) | M05 (43) |
| Steering flow (words) | U15 (38) | M25 (54) |
| Monsoon, onset, active and break, monsoon depression | U16 (39) | F30 (81) |
| MJO / BSISO in words | U16 (39) | F13 (73) |
| Geostationary vs polar orbits, VIS, IR, WV channels | U17 (40) | M17 (51) |
| Microwave, scatterometer, GLM instrument | U17 (40) | M17 (51) |
| Radar ranging, beam height, dBZ, Z–R | U18 (41) | M18 (52) |
| Doppler radial velocity, dual-pol (ZDR, CC) | U18 (41) | M18 (52) |
| SAR (smooth water dark) | U18 (41) | F32 (84) |
| Storm surge (first look, along/across-coast winds, before/after inundation slider) | #5b (8) | F19 (79) |
| Slopes of sine and cosine; the product rule; integration as adding up (band areas, Archimedes) | #5b (8), #5c (9) | T01 (97) |
| Position vector on the sphere, ground speed Ω a cos φ, area element and cos φ weighting | #5c (9) | #6 (12) |
| Local east-north-up frame, how i, j, k turn, metric terms (first look) | #5d (10) | R04 (111) |
| Galilean change of frame, storm-relative wind (1a), ∂p/∂τ for a moving pattern | 1a (5), #5d (10) | U13 (36) |
| Great circles, rhumb lines, map scale factors, Mercator derived | #5e (11) | M05 (43) |
| Satellite before/after inundation picture (first look) | #5b (8) | F32 (84) |
| Interpolation, assimilation, contouring and its artefacts | M02 (42) | M05 (43) |
| UTC (0.3, 1a); Z/Zulu and synoptic hours (M02) | 0.3 (3), M02 (42) | M05 (43) |
| Initial vs valid vs lead time, analysis vs forecast | M02 (42) | M05 (43) |
| Chart legend and units | M02 (42) | M05 (43) |
| Chaos / predictability (one line M02; full M19) | M02 (42) | M19 (53) |
| METAR, SYNOP, station model, tendency code | M06 (44) itself | M06 (44) |
| Temperature advection on 850 hPa | M10 (45) itself | M10 (45) |
| Trough-axis method, 5520/5640-m lines | M21 (46) itself | M21 (46) |
| Thickness advection, 540/528 rules and their limits | M23 (48) itself | M23 (48) |
| Cross-section, Hovmöller | M11 (49) itself | M11 (49) |
| RGB composites, overshooting tops | M17 (51) itself | M17 (51) |
| Radar artefacts, bright band | M18 (52) itself | M18 (52) |
| NWP, ensemble, member, spread, probability, verification words | M19 (53) itself | M19 (53) |
| Pressure tendency map, isallobars, motion vector | M25 (54) itself | M25 (54) |
| Deepening rate, extrapolation vs persistence vs model, dprog/dt | M26 (55) itself | M26 (55) |
| The 6-step forecast routine | F01 (57) itself | F01 (57) |
| PoP, QPF | F29 (58) itself | F29 (58) |
| Sting jet | F05 (61) itself | F05 (61) |
| AR scale | F21 (63) itself | F21 (63) |
| Lightning jump | F34 (67) itself | F34 (67) |
| MESH, three-body spike | F09 (68) itself | F09 (68) |
| Debris signature | F08 (69) itself | F08 (69) |
| Outlook, watch, warning, POD/FAR (hit/miss from M19) | F10 (71) itself | F10 (71) |
| Optical-flow extrapolation (idea in M26) | F12 (72) itself | F12 (72) |
| Dvorak | F14 (74) itself | F14 (74) |
| Beta drift (observed; mechanism W06) | F17 (76) itself | F17 (76) |
| RI definition | F16 (77) itself | F16 (77) |
| Cone of uncertainty | F18 (78) itself | F18 (78) |
| Surge components, tide (observed); warning systems stated | F19 (79) itself | F19 (79) |
| IMD onset criteria | F30 (81) itself | F30 (81) |
| Catchment, runoff, infiltration, HAND, land cover, soil texture | F31 (83) itself | F31 (83) |
| Change detection, threshold, masks | F32 (84) itself | F32 (84) |
| Discharge, hydrograph, GloFAS exceedance | F33 (85) itself | F33 (85) |
| Lake effect, snow ratio, blizzard criteria | F24 (86) itself | F24 (86) |
| Ice accretion | F35 (87) itself | F35 (87) |
| Wind chill, AO index | F37 (90) itself | F37 (90) |
| AOD, haboob | F36 (91) itself | F36 (91) |
| Fire-weather indices, fuel dryness | F38 (92) itself | F38 (92) |
| SPI/SPEI, flash drought | F39 (93) itself | F39 (93) |
| Warning systems in full (CPP, signals, colour codes) | F27 (94) itself | F27 (94) |

---

## 6. The full ordered list (178 movies in the viewing order)
Status words: **done** (final; §5b retro-fits and pointer re-voices pending where noted) · **in progress** · **planned
(storyboard)** · **planned**. "Block" is the viewing block. "v5 pos" is the movie's position in plan v5. Movie numbers of
the opening are written with a hash (#2–#6); 0.1b, 0.3, 1a and 1b keep their names. The alternate cuts 0.1 and 0.2 are
in §1c, not here.

| Pos | ID | Title | Block | Status | Prerequisites | v5 pos |
|---|---|---|---|---|---|---|
| 1 | 0.1b | Dot product (the viewing cut: 0.1 v6 + matching parts, crosswind, flux, wind stress, pattern similarity) | 0–1 basics and maths | done (§5b retro-fit pending: s20c) | — | 1 |
| 2 | #2 | The cross product (Part 1) | 0–1 basics and maths | done (pointer re-voice queued, §10) | 0.1b | 2 |
| 3 | 0.3 | Weather basics | 0–1 basics and maths | done (UF2 review 4 PASS, 2026-11-04; 16 Shoulds → §5b retro-fit) | — | 3 |
| 4 | #3 | The cross product on our spinning Earth (Part 2: Coriolis, geostrophic wind) | 0–1 basics and maths | done (§5b retro-fit + pointer re-voice queued, §10) | #2, 0.3 | 4 |
| 5 | 1a | Vectors and index notation | 0–1 basics and maths | done (§5b retro-fit + pointer re-voice queued, §10) | 0.1b | 5 |
| 6 | #4 | Derivatives and Taylor series | 0–1 basics and maths | done (final 2026-11-04; 14 Shoulds → §5b retro-fit) | 1a | 6 |
| 7 | #5a | Coordinates, Part 1 — Arrows on a flat map: polar coordinates and rotated axes (`ch00_coordinates_flat`, ≈ 25.5 min) | 0–1 basics and maths | planned (split plan 2026-11-05; build 1 archived) | 0.1b, 1a | 7 |
| 8 | #5b | Coordinates, Part 2 — Inside a tropical cyclone: turning arrows and cylindrical coordinates (Ian, Amphan, the coast and the surge) (`ch00_coordinates_storm`, ≈ 25.6 min) | 0–1 basics and maths | planned (split plan 2026-11-05) | #5a, #4, #3 | 7 |
| 9 | #5c | Coordinates, Part 3 — Our round Earth: latitude, longitude, distances and areas (`ch00_coordinates_sphere`, ≈ 25.4 min) | 0–1 basics and maths | planned (split plan 2026-11-05) | #5a, #5b, #3 | 7 |
| 10 | #5d | Coordinates, Part 4 — Moving frames: local axes and storm-relative winds (`ch00_coordinates_frames`, ≈ 25.6 min) | 0–1 basics and maths | planned (split plan 2026-11-05) | #5b, #5c, #2, #4 | 7 |
| 11 | #5e | Coordinates, Part 5 — Routes and maps: great circles and map projections (`ch00_coordinates_maps`, ≈ 23.2 min) | 0–1 basics and maths | planned (split plan 2026-11-05) | #5c, #5d, 0.1b, #4 | 7 |
| 12 | #6 | The gradient | 0–1 basics and maths | **paused** (build 1 K6-clean, not rendered; revised after #5e: split_plan §3b) | #4, #5c, #5e, 0.1b | 8 |
| 13 | M01 | Contour maps and isolines | understanding | planned (storyboard + script written) | #5e, #6, 0.3 | 9 |
| 14 | U01 | Where pressure differences come from: the pressure-gradient force (recap), thermal lows and highs, lee troughs | understanding | planned (re-scoped in v5, §3) | #3, #6, 0.3, M01 | 10 |
| 15 | M03 | Wind on weather charts: Buys Ballot, gradient, cyclostrophic and friction winds, scales, and wind barbs | understanding | planned (re-scoped in v5, §3) | #3 (Coriolis, geostrophic), #5b, #6, 0.3, U01 | 11 |
| 16 | U02 | Convergence, divergence and vertical motion | understanding | planned (new; v5 note, §3b) | #4, #6, M03 | 12 |
| 17 | M07 | Pressure as a vertical coordinate | understanding | planned | 0.3, M01, U02 | 13 |
| 18 | M08 | Geopotential: the height of a pressure surface (+ standard deviation and percentile) | understanding | planned (re-scoped in v5, §3) | #4, #6, 0.3, M01, M03, M07 | 14 |
| 19 | M09 | The standard pressure levels | understanding | planned | M07, M08 | 15 |
| 20 | M16 | The climate machine: sunlight in, infrared out (+ night cooling, seasons, aerosols) | understanding | planned (re-scoped in v5, §3) | #4, 0.3, 0.1b | 16 |
| 21 | U03 | Temperature with height: real soundings, the standard atmosphere and inversions | understanding | planned (re-scoped in v5, §3) | 0.3, #4, M07, M16 | 17 |
| 22 | M12 | Rising air: first law, adiabats, θ, θe, parcel stability | understanding | planned (v5 note, §3b) | #4, 0.3, M07, U03 | 18 |
| 23 | M13 | Water in the air: mixing ratio, wet-bulb, dew-point depression, LCL, CAPE/CIN | understanding | planned (re-scoped in v5, §3) | M12, #4, 0.3 | 19 |
| 24 | M14 | The skew-T log-P diagram, in full | understanding | planned (v5 note, §3b) | M12, M13, M03 (barbs) | 20 |
| 25 | M15 | How clouds form, cloud types, and cloud amount (oktas, FEW/SCT/BKN/OVC, ceiling) | understanding | planned (re-scoped in v5, §3) | M12, M13, U02 | 21 |
| 26 | U04 | How rain forms | understanding | planned (new) | M13, M15 | 22 |
| 27 | U05 | Ice, snow, hail and precipitation type | understanding | planned (new) | M13, M14, U04, M08 | 23 |
| 28 | U06 | How much it rains: rates, moisture supply, mountains | understanding | planned (new) | U02, M13, M15, U04, U05 | 24 |
| 29 | U07 | The boundary layer and the day–night cycle (+ visibility, mist, haze, fog; gusts vs mean wind) | understanding | planned (re-scoped in v5, §3) | #6, M03, M12, M13, M16, U03 | 25 |
| 30 | M04 | Air masses and fronts (+ veering and backing at a front) | understanding | planned (re-scoped in v5, §3) | 0.3, M01, M03, M12 | 26 |
| 31 | U08 | The jet stream: a first look (+ veering and backing with height, streamlines) | understanding | planned (re-scoped in v5, §3) | 1a (hodograph), M03, M04, M08, M09, U02 | 27 |
| 32 | U09 | Waves on the jet: troughs, ridges, blocks, polar vortex | understanding | planned (new) | U08, M08, M12 | 28 |
| 33 | U10 | Vorticity in plain words | understanding | planned (new; v5 note, §3b) | #3 (spin r × u), M03, M09, U02, U09 | 29 |
| 34 | U11 | How extratropical cyclones are made | understanding | planned (new) | M04, U08, U09, U10, U02 | 30 |
| 35 | U12 | How thunderstorms work | understanding | planned (new) | M14, U05, U02 | 31 |
| 36 | U13 | Severe storms: shear (hodograph recap), helicity, supercells, tornadoes, hail, downbursts | understanding | planned (re-scoped in v5, §3) | 1a (hodograph), U12, U08, M03 | 32 |
| 37 | U14 | The ocean's role in weather | understanding | planned (new; v5 note, §3b) | 1a (El Niño picture), M13, M16, U07 | 33 |
| 38 | U15 | How tropical cyclones form, and how their strength is classed | understanding | planned (re-scoped in v5, §3) | U14, M12, M13, M03, U02, U08 | 34 |
| 39 | U16 | Monsoons: a first look | understanding | planned (new) | U14, U06, U08, U15 | 35 |
| 40 | U17 | How satellites see | understanding | planned (new; v5 note, §3b) | M16, M15, U12, #3 (Ω) | 36 |
| 41 | U18 | How radar sees | understanding | planned (new) | U04, U05, #5a, 0.1b, M16 | 37 |
| 42 | M02 | How weather maps are made, and the chart frame (projections, legend and units, UTC/Z, initial/valid/lead time) | understanding (bridge to maps) | planned (re-scoped in v5, §3) | #5c, #5e, 0.3, M01, M03, U17 | 38 |
| 43 | M05 | Reading the surface chart (frame and barbs recapped from M02/M03) | map reading | planned (scenes in #69 v3; re-scoped in v5, §3) | M01, M02, M03, M04, U11, #5c, #5e | 39 |
| 44 | M06 | Station plots: METAR, SYNOP, station model | map reading | planned (scenes in #69 v3; v5 note, §3b) | M05, M15, U04, U05, U07 | 40 |
| 45 | M10 | Reading upper-air charts I: 850 and 700 hPa | map reading | planned (scenes in #69 v3) | M05, M08, M09, U07, M04, 0.1b | 41 |
| 46 | M21 | Reading upper-air charts II: 500 hPa | map reading | planned (new) | M10, U09, U10 | 42 |
| 47 | M22 | Reading upper-air charts III: 300/250/200 hPa | map reading | planned (new; v5 note, §3b) | M21, U08, U02, U16 | 43 |
| 48 | M23 | Reading thickness charts | map reading | planned (new) | M08, M10, U05, U08 | 44 |
| 49 | M11 | Cross-sections and Hovmöller diagrams | map reading | planned | M04, M08, M10, M21, M22 | 45 |
| 50 | M24 | Skew-T reading practice: eight real soundings | map reading | planned (new; v5 note, §3b) | M14, U05, U07, U12, U13 | 46 |
| 51 | M17 | Reading satellite images | map reading | planned (scenes in #69 v3; v5 note, §3b) | U17, M15, M16, U11, U12 | 47 |
| 52 | M18 | Reading weather radar | map reading | planned (scenes in #69 v3) | U18, U12, U13 | 48 |
| 53 | M19 | Forecast charts, models and ensembles | map reading | planned (scenes in #69 v3) | M02, M05, M10, M21, M22 | 49 |
| 54 | M25 | Reading maps over time I: tendencies and motion | map reading | planned (new) | M05, M21, M17, M18, #4, #5d | 50 |
| 55 | M26 | Reading maps over time II: development and extrapolation | map reading | planned (new) | M25, M19 | 51 |
| 56 | M20 | Reading weather maps: one storm through every chart and through time | map reading | planned (#69 storyboard v3, to be split) | M01–M19, M21–M26 | 52 |
| 57 | F01 | …the forecaster's method | forecasting · method | planned | M19, M26, U15 | 53 |
| 58 | F29 | …rainfall | forecasting · everyday rain | planned (new) | M19, M26, U06, M04 | 54 |
| 59 | F02 | …where a low will form and deepen | forecasting · mid-latitude storms | planned | M25, M21, M22, U10, U11 | 55 |
| 60 | F03 | …the support aloft: jet streaks and divergence | forecasting · mid-latitude storms | planned | M22, U08, U02 | 56 |
| 61 | F05 | …windstorms and bomb cyclones | forecasting · mid-latitude storms | planned | F02, F03, M19, U11 | 57 |
| 62 | F04 | …a moisture plume: PW, IVT and atmospheric rivers | forecasting · heavy rain | planned | U06, M17, M08 | 58 |
| 63 | F21 | …heavy rainfall I: atmospheric rivers and mountains | forecasting · heavy rain | planned | F04, U06, M01 | 59 |
| 64 | F22 | …heavy rainfall III: training storms and flash floods | forecasting · heavy rain | planned | U12, M21, M18 | 60 |
| 65 | F06 | …thunderstorms: the ingredients | forecasting · convection | planned | M24, U12, U13 | 61 |
| 66 | F07 | …storm types and damaging winds | forecasting · convection | planned | F06, M17, M18 | 62 |
| 67 | F34 | …lightning | forecasting · convection | planned (new) | U12, U17, M17, F07 | 63 |
| 68 | F09 | …hail | forecasting · convection | planned | U05, U13, M18, M24 | 64 |
| 69 | F08 | …tornadoes | forecasting · convection | planned | F07, M18, U13 | 65 |
| 70 | F11 | …nor'westers (kalbaishakhi) | forecasting · convection | planned | F06, F07, U16 | 66 |
| 71 | F10 | …from outlook to warning | forecasting · convection | planned | F06–F09 | 67 |
| 72 | F12 | …the next two hours: nowcasting | forecasting · convection | planned | M18, M26, F07 | 68 |
| 73 | F13 | …the birth of a tropical cyclone | forecasting · tropical | planned | U14, U15, U16, U10, M19 | 69 |
| 74 | F14 | …strength from satellite: Dvorak and microwave | forecasting · tropical | planned | U17, M17, U15 | 70 |
| 75 | F15 | …a landfalling cyclone on radar | forecasting · tropical | planned | U18, M18, F14 | 71 |
| 76 | F17 | …the track: steering | forecasting · tropical | planned | U15, M21, M25 | 72 |
| 77 | F16 | …the intensity: rapid intensification | forecasting · tropical | planned | F13, F14, F15 | 73 |
| 78 | F18 | …with ensembles and the cone | forecasting · tropical | planned | F17, M19 | 74 |
| 79 | F19 | …storm surge | forecasting · tropical | planned (v5 note, §3b) | #5b (surge), F17, M08, M01 | 75 |
| 80 | F20 | …heavy rainfall II: TC rain and stalled storms | forecasting · tropical | planned | F15, F17, U06 | 76 |
| 81 | F30 | …monsoon onset and breaks | forecasting · monsoon | planned (new) | U16, M19, F13 | 77 |
| 82 | F23 | …monsoon depressions and monsoon floods | forecasting · monsoon | planned | U16, F04, F13 | 78 |
| 83 | F31 | …floods I: geography (DEM, rivers, soil, land cover; GEE) | forecasting · floods | planned (new) | M01, U06, F21, F23 | 79 |
| 84 | F32 | …floods II: Sentinel-1 inundation maps and animations (GEE) | forecasting · floods | planned (new) | F31, U18 | 80 |
| 85 | F33 | …floods III: GloFAS and river gauges | forecasting · floods | planned (new) | F31, F32, M19 | 81 |
| 86 | F24 | …snowfall and blizzards | forecasting · winter | planned | M23, M24, F05, U05 | 82 |
| 87 | F35 | …freezing rain and ice storms | forecasting · winter | planned (new) | U05, M23, M24 | 83 |
| 88 | F25 | …fog | forecasting · winter | planned | U07, M17, M24 | 84 |
| 89 | F26 | …heatwaves | forecasting · heat and dry | planned | U09, U07, M13, M21 | 85 |
| 90 | F37 | …cold waves and the polar vortex link | forecasting · heat and dry | planned (new) | U09, M04, M21, F25 | 86 |
| 91 | F36 | …dust storms | forecasting · heat and dry | planned (new) | U12, M17, U07 | 87 |
| 92 | F38 | …fire weather | forecasting · heat and dry | planned (new) | U07, M03, M19 | 88 |
| 93 | F39 | …drought onset | forecasting · heat and dry | planned (new) | U09, U14, M08, F26 | 89 |
| 94 | F27 | …and act: warnings and impacts | forecasting · action | planned | F17–F19, F33 | 90 |
| 95 | F28 | …a Bay of Bengal cyclone end to end (capstone) | forecasting · capstone | planned | F01–F27, F29–F39 | 91 |
| 96 | 1b | The alternating tensor and triple products | later · 1 | planned (storyboard; pointer fixes queued, §10) | 1a | 92 |
| 97 | T01 | Divergence, flux and Gauss's theorem | later · T | planned | #6, U02 | 93 |
| 98 | T02 | Curl, circulation and Stokes's theorem | later · T | planned | #6, #2, U10 | 94 |
| 99 | T03 | The Laplacian; Laplace and Poisson equations | later · T | planned | T01 | 95 |
| 100 | T04 | The material derivative | later · T | planned | #4, 0.1b, T01 | 96 |
| 101 | T05 | Vector identities I | later · T | planned | T01, T02 | 97 |
| 102 | T06 | Vector identities II: the advection term | later · T | planned | T04, T05 | 98 |
| 103 | T07 | Potentials and the stream function | later · T | planned | T01–T03 | 99 |
| 104 | T08 | Tensors made easy | later · T | planned | 1a, 1b, T05 | 100 |
| 105 | T09 | Dimensional analysis, scaling and similarity | later · T | planned | #4 | 101 |
| 106 | T10 | Ordinary differential equations | later · T | planned | #4 | 102 |
| 107 | T11 | Statistics of fields | later · T | planned | M08, M19 | 103 |
| 108 | R01 | Circular motion: centripetal and centrifugal | later · R | planned (v5 note, §3b) | #3 (centrifugal), #5b, 1b | 104 |
| 109 | R02 | The Coriolis effect, in full | later · R | planned (v5 note, §3b) | 1b, #3, #5d, R01, M03 | 105 |
| 110 | R03 | Centripetal vs centrifugal vs Coriolis | later · R | planned | R01, R02, T09 | 106 |
| 111 | R04 | From F = ma to the equation of motion | later · R | planned | T04–T06, T09, R02 | 107 |
| 112 | R05 | Geostrophic and ageostrophic wind; gradient, cyclostrophic, inertial | later · R | planned | R04, M03, T10 | 108 |
| 113 | R06 | Friction and Ekman layers | later · R | planned | R05, T10 | 109 |
| 114 | R07 | The thermal wind | later · R | planned | R05, M08, U08 | 110 |
| 115 | R08 | Barotropic vs baroclinic | later · R | planned | R07 | 111 |
| 116 | R09 | Vorticity, circulation and potential vorticity | later · R | planned | T02, R05, M12, U10 | 112 |
| 117 | R10 | Isentropic surfaces, isentropic and PV maps (+ PV signals for forecasters, from F02) | later · R | planned | R09, M12, F02 | 113 |
| 118 | R11 | Divergence and vertical motion (QG intuition; jet-streak circulation in full) | later · R | planned | T01, R09, U02, F03 | 114 |
| 119 | R12 | Geostrophic adjustment and the Rossby radius | later · R | planned | R05, T10 | 115 |
| 120 | W01 | Partial differential equations | later · W | planned | T03, T10 | 116 |
| 121 | W02 | Fourier series, transforms and spectra | later · W | planned | W01 | 117 |
| 122 | W03 | Waves: phase, dispersion, group velocity | later · W | planned | W02 | 118 |
| 123 | W04 | Buoyancy oscillations, N, and static stability in full | later · W | planned | M12, T10 | 119 |
| 124 | W05 | Gravity waves and mountain waves | later · W | planned | W03, W04 | 120 |
| 125 | W06 | Rossby waves and blocking (+ beta drift of cyclones, from F17) | later · W | planned | W03, R09, U09 | 121 |
| 126 | W07 | Equatorial waves and the MJO | later · W | planned | W06, W05, U16 | 122 |
| 127 | S01 | The jet stream (full) | later · S | planned | R07, W06, M08, M22, U08 | 123 |
| 128 | S02 | Stability and eigenvalue problems | later · S | planned | T10, W03 | 124 |
| 129 | S03 | Air masses and fronts in depth; frontogenesis | later · S | planned | M04, R07, T05 | 125 |
| 130 | S04 | Baroclinic (and barotropic) instability | later · S | planned | S01, S02, R08 | 126 |
| 131 | S05 | Extratropical cyclones in depth | later · S | planned | S03, S04, R11, U11 | 127 |
| 132 | S06 | Storm tracks | later · S | planned | S04, S05, T11 | 128 |
| 133 | S07 | Thunderstorms, severe weather and tornadoes in depth | later · S | planned | M14, R07, R01, U12, U13 | 129 |
| 134 | S08 | Tropical cyclones in depth | later · S | planned | R05, R06, M13, R01, U15 | 130 |
| 135 | S09 | Monsoons in depth | later · S | planned | M16, S08, W07, U16 | 131 |
| 136 | S10 | The boundary layer and turbulence | later · S | planned | R06, T08, W04, U07 | 132 |
| 137 | G01 | The general circulation | later · G | planned | S06, R06 | 133 |
| 138 | G02 | The stratosphere: ozone, Brewer–Dobson, QBO | later · G | planned | M16, W07 | 134 |
| 139 | G03 | The polar vortex (full) | later · G | planned | G02, S01, W06, U09 | 135 |
| 140 | G04 | Water vapour and the tropics | later · G | planned | M13, G01 | 136 |
| 141 | A01 | Complex variables and conformal mapping | later · A | planned | W02 | 137 |
| 142 | A02 | Perturbation methods | later · A | planned | T10, W01 | 138 |
| 143 | O01 | Seawater: equation of state and pressure with depth | later · O | planned | 0.3, M07, U14 | 139 |
| 144 | O02 | The upper ocean | later · O | planned | O01 | 140 |
| 145 | O03 | Wind-driven gyres: Sverdrup and western intensification | later · O | planned | R06, R09, A02 | 141 |
| 146 | O04 | Great currents I: Gulf Stream and Kuroshio | later · O | planned | O03 | 142 |
| 147 | O05 | Great currents II: Agulhas, Brazil–Malvinas, East Australian | later · O | planned | O03 | 143 |
| 148 | O06 | Great currents III: eastern boundaries and upwelling | later · O | planned | R06, O03 | 144 |
| 149 | O07 | Equatorial currents, the undercurrent, the Somali current | later · O | planned | W07, S09 | 145 |
| 150 | O08 | The Antarctic Circumpolar Current | later · O | planned | O03 | 146 |
| 151 | O09 | The overturning circulation, AMOC | later · O | planned | O02, O08 | 147 |
| 152 | O10 | Ocean eddies and mesoscale turbulence | later · O | planned | S04, S10 | 148 |
| 153 | O11 | Surface waves, tsunamis and tides | later · O | planned | W03 | 149 |
| 154 | O12 | Sea level and sea ice | later · O | planned | O02, O09 | 150 |
| 155 | CV01 | ENSO | later · CV | planned | O07, W07, T11, U14 | 151 |
| 156 | CV02 | Indian Ocean Dipole | later · CV | planned | CV01 | 152 |
| 157 | CV03 | PDO and AMO | later · CV | planned | CV01 | 153 |
| 158 | CV04 | NAO and the Arctic Oscillation | later · CV | planned | S06, G03 | 154 |
| 159 | CV05 | Southern Annular Mode | later · CV | planned | CV04 | 155 |
| 160 | CV06 | Climate change: forcing, feedbacks, observed warming | later · CV | planned | M16 | 156 |
| 161 | CV07 | Extremes: heatwaves, droughts, floods (the climate view) | later · CV | planned | CV06, F26, F31–F33, F39 | 157 |
| 162 | CE01 | Where is the polar vortex now, and how do we measure it? | later · CE | planned | G03, T11, M08 | 158 |
| 163 | CE02 | How a weak vortex reaches the ground: this winter's US cold outbreaks | later · CE | planned | CE01, CV04, F37 | 159 |
| 164 | CE03 | The record: past SSWs, US cold outbreaks and the science debate | later · CE | planned | CE01, CE02, CV06 | 160 |
| 165 | CE04 | El Niño 2026: how big is it, and could it be the biggest on record? | later · CE | planned | CV01, T11, M17 | 161 |
| 166 | CE05 | El Niño 2026 impacts I: rain, drought, fire, vegetation | later · CE | planned | CE04, F39 | 162 |
| 167 | CE06 | El Niño 2026 impacts II: food, fisheries, coral, health | later · CE | planned | CE05 | 163 |
| 168 | CE07 | The latest hurricane season round the USA, warm oceans and El Niño | later · CE | planned | F13–F18, CE04, CV06 | 164 |
| 169 | CE08 | Record-warm years 2023–2026 | later · CE | planned | CV06, CE04 | 165 |
| 170 | CE09 | The latest marine heatwaves | later · CE | planned | O02, CV06 | 166 |
| 171 | CE10 | The Arctic sea-ice minimum, 2026 | later · CE | planned | O12, CV06 | 167 |
| 172 | CE11 | The 2026 South Asian monsoon and Bangladesh floods | later · CE | planned | S09, F23, F30, F32, F33 (the flood-mapping method; v3 pointed to CE15, which comes later) | 168 |
| 173 | CE12 | Bay of Bengal cyclone season review, 2026 | later · CE | planned | F13–F19, F27 | 169 |
| 174 | CE13 | The California atmospheric-river season | later · CE | planned | F04, F21 | 170 |
| 175 | CE14 | Europe's summer 2026 heat | later · CE | planned | F26, CE08 | 171 |
| 176 | CE15 | Mapping a disaster from space (method; Derna 2023) | later · CE | planned | M01, M02, M17, M18, F32, #5b, #5c, #6 | 172 |
| 177 | CE16 | Cyclone Ditwah: the Sri Lanka floods and landslides (Nov 2025) | later · CE | planned | CE15, S08, F20, F21, F32, M17 | 173 |
| 178 | CE17 | The 2026 Himalayan glacier collapse and outburst flood (Tibet → Nepal) | later · CE | planned | CE15, CE16, F22, F31, CV06 | 174 |

### 6a. Checks (script: `deps_v6.py`, adapted from `deps_v5.py`)
- every prerequisite in the table above points to an **earlier** position (0 forward, 0 unknown);
- every home in §4 sits at or before position 42 and before the term's first need;
- every "first taught" in §5 sits at or before its "first used";
- 178 rows, 178 distinct IDs; with the 2 alternate cuts, 180 = v5's 176 + 4 (the #5 parts).

The run on 2026-11-05 is reported in the movie-director's reply.

---

## 7. The forecasting block, easy → hard (D)
The block now opens on the everyday rain call and mid-latitude storms (the M block ends on a mid-latitude low, Ciarán in
M20), climbs through convection, and reaches the tropical-cyclone movies (genesis, Dvorak, rapid intensification) once
the reader has made a dozen calls. Monsoon, floods, winter, heat and dry follow; warnings and the Bay of Bengal capstone
close it. Cases, scopes and data are v4's (§4a–§4c of v4).

| v6 pos | ID | Group | v5 pos | Prerequisites (all earlier) |
|---|---|---|---|---|
| 57 | F01 | method | 53 | M19, M26, U15 |
| 58 | F29 | everyday rain | 54 | M19, M26, U06, M04 |
| 59 | F02 | mid-latitude storms | 55 | M25, M21, M22, U10, U11 |
| 60 | F03 | mid-latitude storms | 56 | M22, U08, U02 |
| 61 | F05 | mid-latitude storms | 57 | F02, F03, M19, U11 |
| 62 | F04 | heavy rain | 58 | U06, M17, M08 |
| 63 | F21 | heavy rain | 59 | F04, U06, M01 |
| 64 | F22 | heavy rain | 60 | U12, M21, M18 |
| 65 | F06 | convection | 61 | M24, U12, U13 |
| 66 | F07 | convection | 62 | F06, M17, M18 |
| 67 | F34 | convection | 63 | U12, U17, M17, F07 |
| 68 | F09 | convection | 64 | U05, U13, M18, M24 |
| 69 | F08 | convection | 65 | F07, M18, U13 |
| 70 | F11 | convection | 66 | F06, F07, U16 |
| 71 | F10 | convection | 67 | F06–F09 |
| 72 | F12 | convection | 68 | M18, M26, F07 |
| 73 | F13 | tropical | 69 | U14, U15, U16, U10, M19 |
| 74 | F14 | tropical | 70 | U17, M17, U15 |
| 75 | F15 | tropical | 71 | U18, M18, F14 |
| 76 | F17 | tropical | 72 | U15, M21, M25 |
| 77 | F16 | tropical | 73 | F13, F14, F15 |
| 78 | F18 | tropical | 74 | F17, M19 |
| 79 | F19 | tropical | 75 | #5b (surge), F17, M08, M01 |
| 80 | F20 | tropical | 76 | F15, F17, U06 |
| 81 | F30 | monsoon | 77 | U16, M19, F13 |
| 82 | F23 | monsoon | 78 | U16, F04, F13 |
| 83 | F31 | floods | 79 | M01, U06, F21, F23 |
| 84 | F32 | floods | 80 | F31, U18 |
| 85 | F33 | floods | 81 | F31, F32, M19 |
| 86 | F24 | winter | 82 | M23, M24, F05, U05 |
| 87 | F35 | winter | 83 | U05, M23, M24 |
| 88 | F25 | winter | 84 | U07, M17, M24 |
| 89 | F26 | heat and dry | 85 | U09, U07, M13, M21 |
| 90 | F37 | heat and dry | 86 | U09, M04, M21, F25 |
| 91 | F36 | heat and dry | 87 | U12, M17, U07 |
| 92 | F38 | heat and dry | 88 | U07, M03, M19 |
| 93 | F39 | heat and dry | 89 | U09, U14, M08, F26 |
| 94 | F27 | action | 90 | F17–F19, F33 |
| 95 | F28 | capstone | 91 | F01–F27, F29–F39 |

**Checked by hand as well as by script:** F23 needs F13 (genesis, now in the tropical group before it) and F04; F30
needs F13; F31 needs F21 and F23; F37 needs F25 (winter, before heat); F39 needs F26; F10 needs F06–F09 (all in the
convection group before it); F12 uses the F11 nor'wester for its satellite-only nowcast (F11 comes first); F20 needs
F15 and F17; F27 needs F17–F19 and F33; F28 needs everything. F29's PoP and QPF now come before every F movie that uses
a QPF panel (F20, F21, F22).

---

## 8. Record: #5 and #6 pointer fixes done in v5 (storyboards v3) and the Tissot check (v5 positions)

**Superseded for #5 by the split (v6 §2).** The pointer lines below live on in the parts where their scenes went (s12 → #5a s23, s19 → #5c s15, s42 → #5d s17). The Tissot note still holds: #5e draws the circles; M02 names them.
Done 2026-11-04 in `movies/ch00/ch00_coordinates/` and `movies/ch00/ch00_gradient/` (storyboard.yaml and script.md, text
and measured times only; the visuals and data are unchanged apart from the thumbnail notes). Each new sentence was
measured with `tools/tts.py` (af_bella × 1.0, dry run `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/v5_pointer_dryrun`;
the old sentences re-measured to exactly their recorded lengths), every other clip kept and shifted.

| Movie · scene | Old line | New line | Clip (s) |
|---|---|---|---|
| #6 s07_operator | "…and each of them has its own movie next in this series." | "…and each of them has its own movie later in this series." | 9.000 → 9.075 |
| #6 s30_coriolis | "We'll build all of this step by step in the Coriolis movie, later in this series." | "We built all of this in the cross product movie on our spinning Earth, and a later Coriolis movie takes it further." | 5.225 → 7.375 |
| #5 s12_why_polar_storm | "The spin also has its own measure, called vorticity, in the curl movie of this series." | "The spin also has its own measure, called vorticity, which has its own movie later in this series." (U10 is where it is first met) | 5.950 → 6.600 |
| #5 s19_earth_cylinder | "…which is the story of the Coriolis movie in this series." | "…as we saw in the cross product movie on our spinning Earth." | 10.750 → 11.000 |
| #5 s42_galilean_accel | "…the Coriolis and centrifugal effects, which is the story of the Coriolis movie." | "…which we met in the cross product movie on our spinning Earth." | 9.700 → 10.600 |

#5 s19 and s42 are the same kind of error as #6 s30 (the viewer saw #3 three movies earlier), so they were fixed too.
New totals: **#5** 49 scenes, 453 sentences, 6917 words, narration 2921.075 s + 2.5-s hold = **2923.575 s (48:43.58)**,
142.0 words per minute; **#6** 40 scenes, 298 sentences, 4493 words, narration 1900.875 s + 2.5-s hold =
**1903.375 s (31:43.38)**, 141.6 words per minute. Both storyboards pass `tools/hooks/post_write.py`; each carries an
`amendment_v5_pointers` block. Other #5/#6 pointers were checked against the v5 order and are right ("the gradient …
next in this series" in #5 s27: #6 is next; contour maps and how they are made, pressure coordinates, thermal wind,
material derivative, Ekman, the stratosphere: all later).

**Tissot.** The plan's claim ("projections, Tissot, polar view: #5") is **supported by the storyboard**: #5 s31–s34 draw
equal 500-km Tissot circles that ride along the globe → plate carrée → Mercator → Equal Earth morphs
(`fluidpy.geo.mapproj.tissot_ellipses`, with gold links from the stretch numbers), and s35's view from above the pole is
polar stereographic (true at 60° N). The narration names neither ("a small circle stays a circle"), which is why the
audit missed them. So nothing is added to #5 (a 49-minute movie); the correction goes into the plan: §5 lists the
pictures under #5 and the **names** (Tissot's indicatrix, polar stereographic) plus **Lambert conformal** under M02.

---

## 9. Carried over from v4 and v5 (adjusted to v6 positions)
- **Decisions D1–D3** (v4 §9) stand: M numbers and folders kept; F before the dynamics stages; check whether the CDS
  login opens GloFAS before F33.
- **Retro-fit slots** (RESUME.md, adjusted): the §5b retro-fit of cross product v5 + Part 2 after M01 (pos 13); the §5b
  retro-fits of 1a (+ wind stack) and 0.1b after M03 (pos 15). The pointer re-voices of §10 ride in those retro-fits.
- **The first 10 movies to build** after #4 and weather basics are final: #5a–#5e, #6 (revised), M01, U01 (now 12–15 min), M03 (now
  25–30 min, with barbs and scales), U02, M07, M08 (31–41), M09, M16 (33–43). The next three are U03 (15–20), M12 and
  M13 (25–30).
- **Data accounts** the user still has to open: EUMETSAT, ECMWF (TIGGE), NCAR RDA (v3/v4).

---

## 10. Pointer fixes to queue (finished movies and 1b; not edited here)
These movies are either finished (re-voice by a TTS splice in their pending §5b retro-fit) or not built yet (1b). None
was touched in this pass: weather basics and #4 are in fix loops, and 1a and #3 wait for their §5b retro-fits.

| Movie · scene | Now says | Change to | Why (v5 order) | When |
|---|---|---|---|---|
| 0.3 s50, s59 | (audit a4) "next video … read weather maps" | **already done** in the working copy (UF2 fix loop 3): s59 now says "Later in this series, we'll learn to read weather maps like this one in detail"; no "next video" is left | map reading starts at pos 43 | confirm at its final QA |
| 0.3 s35, s44, s59 | "later videos explain the Coriolis turning" | keep | true now: #3 comes right after 0.3 | — |
| #2 s22w_when_to_use | "…and, in the next video, a spin arrow, like Earth's spin…" / "…and, in the next video, the speed of the spinning ground…" | "…in Part 2…" (both) | 0.3 now sits between #2 and #3 | with the cross-product §5b retro-fit (needs a Part 1 re-open; 2 sentences) |
| #2 s50_recap | "The next video puts the cross product to work on our spinning Earth…" | "Part 2 puts the cross product to work on our spinning Earth…" | same | same |
| #3 s01a_recap_arrow | "…from the last video." | "…from Part 1." | the last video is now 0.3 | #3 §5b retro-fit |
| #3 s01d_recap_push | "One more idea from that video." | "One more idea from Part 1." | same | #3 §5b retro-fit |
| #3 s27b_centrifugal | (audit a2) "…the vector triple product from the triple products video." | "…a rule called the vector triple product, which a later video proves." | 1b is at pos 96 | #3 §5b retro-fit |
| #3 s47_recap | "In the last video, we saw…" / "The last video shows why the cross product is built this way…" | "In Part 1, we saw…" / "Part 1 shows why…" | same as s01a | #3 §5b retro-fit |
| 1a s34_next | (audit a3) "That's the next movie in this series…" | "That's a later movie in this series…" | 1b is at pos 96 | 1a §5b retro-fit |
| 1a s19_three_reasons | "…and a second one in the next movie…" | "…and a second one in a later movie…" | same (the next movie is #4) | 1a §5b retro-fit |
| 1a s12d_add_geostrophic | "…the geostrophic wind movie explains it in full." | "…as we saw in the cross product movie on our spinning Earth." (optional) | #3 now comes before 1a | 1a §5b retro-fit, optional |
| 1a s12c_add_forces | "How each of these pushes arises gets its own movies later in the series." | "We met the Coriolis push in the cross product movie; the others get their own movies later." (optional) | same | optional |
| 0.2 (alternate) s27b, s47 | as #3 s27b (a2) | as #3 s27b | only if the alternate cut is ever published | with its §5b retro-fit |
| 1b s05_coriolis_why | "Where it comes from is derived step by step in the Coriolis movie, later in this series." | "Where it comes from, we derived in the cross product movie on our spinning Earth." | #3 (pos 4) derived it | before 1b is built |
| 1b s32_centrifugal | "The Coriolis movie shows how this pull is folded into gravity." | "The cross product movie on our spinning Earth showed how this pull is folded into gravity." | #3 s27e did | before 1b is built |
| 1b s15_coriolis_meaning | "How this push balances the push from pressure is the story of the geostrophic wind movie." | "…as we saw in the cross product movie on our spinning Earth." (optional) | #3 s41–s44 did | before 1b is built |

**Checked and fine:** 0.1b ("the cross product, in the next video" → #2 is next; "the climate machine video" → M16);
#4 (every pointer goes to a later movie); M01 (pointers back to #6 and 0.3, forward to M08).

**For the orchestrator:** RESUME.md's queue line should point to this file (v6) from 2026-11-05.
