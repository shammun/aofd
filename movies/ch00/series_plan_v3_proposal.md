# Chapter 0 movie series: plan v3 (PROPOSAL, movie-director, 2026-10-29; not approved yet)

v2 (`series_plan_v2_proposal.md`, approved 2026-10-27) is unchanged and still in force until the user approves this file.

**User requests behind v3 (2026-10-29, verbatim where quoted):**
1. "I think reading a map would come earlier and so plan and order the videos that will cover the basic concepts needed
   for reading weather and meteorological maps earlier."
2. "Also design a series of videos on cyclones, heavy rainfall, how to forecast them using maps, how to get those
   signals, how to use radar maps and others to forecast cyclone track and others."
3. In the forecasting series, use at least 4 Bay of Bengal cyclones, including Aila (2009) and Sidr (2007), and
   2 USA cases. Check open data for each case, and give each case a different teaching job.
4. Make **the jet stream** and **the polar vortex** two separate movies.
5. Add forecasting movies on **thunderstorms, tornadoes and other severe weather**: ingredients, storm types, radar
   signatures, hail and downbursts, outlooks, watches and warnings, lightning. Add fog, heat, blizzards, dust and flash
   floods. Nor'westers (kalbaishakhi) are the regional case.
6. Make **geopotential** one full, dedicated movie of about 30–40 min in the early map-reading block, before the
   upper-air charts.
7. A new series, **"Current events and analysis"**, with real and latest data compared with history and with
   published studies. It includes ≥ 3 polar-vortex/USA movies, recent ENSO ("why it can be the biggest in history",
   tested against the data), and recent hurricanes round the USA. It adds two disaster movies: Cyclone Ditwah in Sri
   Lanka (Nov 2025), and the 2026 Tibet → Nepal glacier collapse and outburst flood (the user asked for "Sri Lanka's
   glacier burst"; Sri Lanka has no glaciers, so both are made).

Everything else in v2 still applies: the rules, the notes, house style, ≥ 2 reviews, real data, §5 source lines and
§5b globes and stacks. The order of the finished and in-progress movies does not change: 0.1, 0.1b, 0.2 (with its
Part 1 = #2 and Part 2 = #3), 0.3, #1a and #4.

---

## 0. Summary
- **Map reading moves from last (v2 #69) to right after the maths essentials** (#1a–#6). It becomes a **20-movie block,
  M01–M20**, which teaches every concept a reader needs for:
  - surface charts;
  - station plots;
  - upper-air charts;
  - soundings;
  - satellite images;
  - radar;
  - forecast charts.

  The first chart-reading movie (M05, surface charts) comes 5th in the block.
- **v2 #69 is split into 7 movies:**
  - M05 surface chart;
  - M06 station plots;
  - M10 upper-air charts;
  - M17 satellite;
  - M18 radar;
  - M19 models and ensembles;
  - M20 the capstone, "one storm through every chart".

  M20 keeps the folder `ch00_reading_weather_maps`. Each split reuses the scenes of the v3 storyboard, already planned
  and measured (§A3).
- **Lighter concept movies come into the block**, so that no chart uses an idea before it is taught:
  - contours and how maps are made (v2 6A, 6B);
  - pressure as a vertical coordinate (23A);
  - **geopotential, as a full movie** (23B, which now also owns thickness);
  - standard levels (23C);
  - cross-sections (23D);
  - thermodynamics lite (24, with the parcel half of 25);
  - humidity (26);
  - the skew-T (27);
  - clouds (28);
  - the climate machine (22).

  **Two new short "first look" movies** give the intuition early:
  - why the wind blows along the isobars (Coriolis and geostrophic);
  - fronts and the cyclone life cycle.

  The full Coriolis and geostrophic movies (v2 #29, #30) keep their place in the rotation stage.
- **The heavy maths moves after the map block**, in the order that dynamics needs it:
  - divergence, curl, Laplacian, the material derivative, the identities, potentials, tensors, scaling, ODEs and
    statistics come before rotation;
  - PDEs, Fourier and waves come before the wave stage;
  - stability and eigenvalues come before baroclinic instability;
  - complex variables and perturbation methods come before the ocean.
- **New dedicated movies:** S01 *The jet stream* (before baroclinic instability, cyclones and forecasting) and G03
  *The polar vortex* (after the stratosphere). v2 #43 becomes "storm tracks" and v2 #49 drops the vortex.
- **New forecasting series F01–F28**, placed after the weather systems and the global atmosphere and before the ocean.
  It covers:
  - signals on maps;
  - extratropical and bomb cyclones;
  - severe storms and tornadoes, hail, downbursts and lightning;
  - outlooks, watches and warnings;
  - nor'westers;
  - nowcasting;
  - the tropical-cyclone life cycle (genesis, satellite and Dvorak in plain words, microwave, radar, rapid
    intensification, steering, ensembles and the cone);
  - storm surge;
  - heavy rain (tropical-cyclone rain, atmospheric rivers and orographic rain, training convection, monsoon
    depressions);
  - winter storms, fog, dust and heat;
  - warnings and impacts;
  - a Bay of Bengal capstone.

  The cases are 7 Bay of Bengal cyclones (Sidr, Nargis, Aila, Fani, Amphan, Mocha, Remal), 4 US hurricanes (Katrina,
  Harvey, Ian, Helene), 1 West Pacific typhoon (Hagibis, with Haiyan as a contrast) and 13 severe-weather and
  heavy-rain cases.
- **New current-events series CE01–CE17** (Part D) comes last in viewing order. Production may jump the queue once a
  movie's prerequisites exist. Data are refreshed just before each build. It covers:
  - polar vortex ×3;
  - El Niño 2026 ×3 (size test, impacts, food/health);
  - the latest US hurricane season;
  - record years;
  - marine heatwaves;
  - Arctic ice;
  - the 2026 monsoon and Bangladesh floods;
  - the Bay of Bengal season;
  - California ARs;
  - European heat;
  - a remote-sensing damage-mapping method movie;
  - Cyclone Ditwah in Sri Lanka;
  - the 2026 Himalayan glacier collapse.
- **Total: 141 movies in v3**, against 86 numbered rows in v2. Of these, 11 are done, in progress or already planned with
  a storyboard (Stage 0–1), plus M20 (#69 v3 storyboard).

## 0b. Numbering
v3 numbers each planned movie by **stage code + two digits**. The codes are:

| Code | Stage |
|---|---|
| M | maps |
| T | toolkit maths |
| R | rotation |
| W | waves |
| S | weather systems |
| G | global atmosphere |
| F | forecasting |
| A | advanced maths |
| O | ocean |
| CV | climate variability |
| CE | current events |

This avoids clashes with the v2 integers, so "v3 M20" can never be mistaken for "v2 #20". The finished and
in-progress movies keep their ids (0.1, 0.1b, 0.2, 0.3, 1a, 1b, 2, 3, 4, 5, 6). Every row in Part C has a **v2 → v3
crosswalk** and its folder slug. Existing folders keep their names (`ch00_coordinates` = #5, `ch00_gradient` = #6,
`ch00_reading_weather_maps` = M20).

---

## Part A · Map reading early

### A1. The minimum concept chain for reading charts
The leftmost column is what a reader must have before reading the chart named in the second column.

```
0.3 weather basics ──┬─ pressure, hydrostatic, sea-level pressure, isobars, highs/lows, fronts intro, humidity, wind units, reanalysis
#4 derivatives ──────┤  partial ∂/∂t (tendency), exact differentials (thermo), exponentials, Planck curve (IR)
#5 coordinates ──────┤  lat/lon, degree lengths, projections, Tissot, polar coordinates (radar), polar view
#6 gradient ─────────┤  spacing → strength, pressure-gradient force, crowded isobars
0.1b dot product ────┘  advection v·∇T
        │
M01 contours ─ M02 how maps are made ─ M03 Coriolis + geostrophic (first look) ─ M04 fronts + cyclone life cycle (first look)
        │                                                                                   │
        └──────────────► M05 SURFACE CHART ◄────────────────────────────────────────────────┘
                         M06 STATION PLOTS (METAR, SYNOP, station model)
M07 pressure as a coordinate ─ M08 GEOPOTENTIAL (+ hypsometric, thickness) ─ M09 standard levels
                         M10 UPPER-AIR CHARTS (850 advection, 500 troughs, 250 jet, thickness)
                         M11 CROSS-SECTIONS + HOVMÖLLER
M12 rising air (θ, lapse rates, parcel stability) ─ M13 water in the air (CC, LCL, CAPE/CIN)
                         M14 SKEW-T
M15 clouds ─ M16 climate machine (radiation, IR, water-vapour absorption)
                         M17 SATELLITE   M18 RADAR (incl. Doppler basics)
                         M19 MODELS + ENSEMBLES
                         M20 ONE STORM THROUGH EVERY CHART (capstone)
```

Candidates from the brief that map reading does **not** need in full, and why:
- **#23 hydrostatic.** 0.3 already derived it for air. The seawater half moves to O01.
- **#29 Coriolis in full and #30 geostrophic in full.** M03 gives the intuition, f = 2Ω sin φ and the balance in words
  and one line. Every derivation stays in R02 and R05.
- **#32 thermal wind.** M10 states the observation: the jet sits above the strongest temperature contrast. The thermal
  wind itself is taught in R07, and the jet movie S01 builds on it. Thickness, the hypsometric part of v2 #32, moves
  into M08.
- **#40 frontogenesis and #42 cyclone dynamics.** M04 gives the observed life cycle (the Norwegian model, the
  conveyor belts in words). The dynamics stays in S03 and S05.

### A2. The early map-reading block, in order
Lengths are **planning estimates, not TTS measurements**. Each storyboard gets a `tools/tts.py` dry run when it is
written. Where scenes come from the #69 v3 storyboard, the measured minutes of those scenes are given (computed from
the storyboard `t` spans).

| v3 | Title | Scope (what it teaches) | Prereqs | Real data / case | Est. length | §5b moments |
|---|---|---|---|---|---|---|
| **M01** | Contour maps and isolines (v2 6A) | Teaches what an isoline is, then each kind: isobars, isotherms, isohyets, isotachs, isohypses, terrain contours, isobaths. It covers the contour interval, why crowded lines mean a strong gradient, and how to read highs, lows, ridges, troughs and cols. | 5, 6, 0.3 | ERA5 MSLP and T2m; ETOPO terrain (Alps); GEBCO/ETOPO isobaths | 25–30 min | terrain → contour lift-off (3-D hill sliced into contours); one zoom tour Alps → Po valley |
| **M02** | How weather maps are made (v2 6B) | Goes from stations to a grid: nearest-neighbour, inverse-distance and objective analysis, then data assimilation and reanalysis in plain words. It covers contouring (marching squares), smoothing and labels, and the artefacts to watch for. | M01, 0.3 | ISD SYNOPs vs ERA5 (a day other than Ciarán); `station.interpolate_stations` | 25–30 min | globe of the real observing network (stations, radiosondes, aircraft, satellites) |
| **M03** | Why the wind blows along the isobars: Coriolis and geostrophic wind, a first look (**new**) | The intuition, not the derivation. The merry-go-round and the spinning Earth show deflection to the right in the NH and left in the SH. It gives f = 2Ω sin φ (with the local-spin picture), geostrophic balance in words and one line, and Buys Ballot. It shows why the balance fails near the equator and why friction turns surface wind across the isobars toward low pressure. Every derivation is pointed to R02/R05. | 2, 3, 5, 6, 0.3 | ERA5 10-m wind vs geostrophic wind on a real low; GDP drifter inertial loops | 25–30 min | house globe: f-colour on the globe (colour bar beside), zoom to a NH low and a SH low, back out |
| **M04** | Fronts and cyclones: a first look (**new**) | Covers air masses (recap of 0.3), the four front types in 3-D, and the Norwegian life cycle: wave → open → occluded → decay. It adds the warm and cold conveyor belts and the dry slot in words, and the cloud signatures (comma, frontal bands). It stays observational, with the dynamics pointed to S03/S05. | 0.3, M01, M03 | **Storm Éowyn, 24 Jan 2025** (ERA5 hourly; MODIS/VIIRS via GIBS; IBTrACS not applicable) | 25–30 min | **layer stack** of θ_e at 1000/925/850/700 hPa through Éowyn's frontal zone (cold air undercutting); globe follow of the low |
| **M05** | Reading the surface chart (#69 split) | Covers the map's frame: lat/lon, degree length, projections, Tissot, the chart's small print, UTC vs local, initial vs valid time, and the traps. Then the chart: isobars every 4 hPa, sea-level reduction (worked), spacing → wind, the worked geostrophic wind, Buys Ballot at Brest and in the SH, tendency and isallobars, troughs, ridges and cols. Then every front type, squall lines and drylines, front clues, and a chart built layer by layer. **Barb reading (#69 s38–s39) moves here**, because every chart shows barbs. | M01–M04, 5 | #69 s02–s28 + s38–s39 (Ciarán ERA5/ISD, Oklahoma dryline 2013, GFS 27 Oct 2026); measured **16.4 + 1.6 min** of planned scenes | 25–30 min | globe → map unrolling with Tissot (from #69 s00); zoom tour Brest → Biscay → Channel |
| **M06** | Station plots: METAR, SYNOP and the station model (#69 split) | Covers the observing network, METAR decoded, American remarks, SYNOP group by group, the station-model layout, oktas, present-weather symbols on 4 real stations, the plotted pressure code, tendency glyphs, two Brest plots nine hours apart, and hand isobars from 214 SYNOPs. | M05 | #69 s29–s37, s40–s43 (ISD, IEM METAR 27 Oct 2026); measured **≈ 7.7 min** | 18–22 min | globe of 4 730 METAR stations lighting up in 20 min |
| **M07** | Pressure as a vertical coordinate (v2 23A) | Why meteorologists use p instead of z, and isobaric surfaces in 3-D on real data. A constant-pressure chart is not a constant-height chart, and pressure surfaces can run "underground" over high terrain. | 0.3, M01 | ERA5 over **Tibet/Himalaya** (surfaces 850/700/600/500 intersecting the plateau) | 18–22 min | **layer stack** of isobaric surfaces over the Tibetan Plateau, the camera flying under the 850-hPa sheet where it dives into the rock |
| **M08** | **Geopotential: the height of a pressure, and how forecasters use it** (v2 23B, now full; absorbs v2 #32's thickness half) | See the dedicated spec in §A5. | 4, 6, 0.3, M01, M03, M07 | **Pacific Northwest heat dome, 27–29 Jun 2021** (ERA5); **cut-off low Daniel, 9–10 Sep 2023** (ERA5); a winter 540-dam day (scout picks one; not Ciarán, not La Grande) | **30–40 min** | **layer stack** of z at 1000/925/850/700/500/300/250/200 hPa over the heat dome, every sheet bulging; fly round, through and under. 500-hPa sheet fly-over (troughs = valleys). Globe of z500 anomaly |
| **M09** | The standard pressure levels and what each shows (v2 23C) | Covers 1000/925/850/700/500/300/250/200 hPa: typical heights, and what forecasters read on each (850 fronts and advection, 700 moisture and steering, 500 waves, 250 jets). | M07, M08 | ERA5 on one day per level, each a different place; Trappes-free (Trappes stays in M14) | 15–20 min | one stack, a "level elevator" through a single column over the Bay of Bengal in the monsoon (new place) |
| **M10** | Reading upper-air charts (#69 split) | Covers the 850-hPa chart, temperature advection (worked), 500-hPa troughs and ridges, how the trough axis is found, the cut-off low, the 250-hPa jet and isotachs, and the rain–snow line applied. The concepts come from M08/M09; this movie *reads* real charts. | M05, M08, M09, 0.1b | #69 s48–s54 (Ciarán ERA5 ten levels, GFS 27 Oct 2026); measured **≈ 4.6 min** + new worked charts | 20–25 min | Ciarán ten-level stack stays in M20 only (no reuse); here a flat-map tour 850 → 500 → 250 with a cross-fade |
| **M11** | Cross-sections and Hovmöller diagrams (v2 23D) | Covers vertical cross-sections through a real front and a real jet (θ, wind, humidity) and how to read time–longitude diagrams (sloping lines = moving features). The wave theory is left to W06. | M08–M10, M04 | ERA5 section across Éowyn's cold front (different from M04's stack: section, not levels); NCEP R1 / ERA5 Hovmöller of v250 | 20–25 min | section "cut out" of a globe and lifted into 3-D |
| **M12** | Rising air: the first law, potential temperature, lapse rates and parcel stability (v2 24 + the parcel half of 25) | Covers the first law for an air parcel, why rising air cools, the dry adiabatic lapse rate, potential temperature, the moist lapse rate in words and numbers, stable/unstable/neutral by the parcel method, and inversions. N and the oscillation are left to W04. | 4, 0.3, M07 | IGRA2 soundings (Oklahoma City 20 May 2013 for unstable; a winter inversion: Salt Lake City); ERA5 θ | 30–35 min | a 3-D column with a rising parcel against its surroundings |
| **M13** | Water in the air: humidity, Clausius–Clapeyron, LCL, CAPE and CIN, how clouds and rain form (v2 26) | | M12, 4 (CC linearisation) | IGRA2 + ERA5 CAPE (Bangladesh pre-monsoon, Apr 2024); IMERG | 30–35 min | precipitable-water globe (ERA5 tcwv, colour bar beside) |
| **M14** | The skew-T log-P diagram, in full detail (v2 27; absorbs #69 s55–s56) | Every line on the diagram; parcel theory; LCL, LFC, EL; CAPE and CIN; inversions; the freezing level and the tropopause; real soundings including Trappes in Ciarán. | M12, M13 | IGRA2 Trappes 2 Nov 2023 (#69 s55–s56, measured 1.3 min); OUN 20 May 2013; Dhaka/Kolkata pre-monsoon (IGRA2 station check) | 45–60 min | balloon rising through a real 3-D profile; skew-T drawn beside the column |
| **M15** | Clouds and cloud types (v2 28) | | M12, M13 | GIBS MODIS/VIIRS; GOES-19; ground photos only from open sources | 25–30 min | globe of a daily cloud fraction (colour bar beside) |
| **M16** | The climate machine: sunlight in, infrared out (v2 22) | Covers energy balance, albedo, the greenhouse effect and the equator-to-pole surplus. **It also adds what the satellite channels need**: infrared emission vs temperature (Planck from #4), the water-vapour absorption band and brightness temperature. | 4, 0.3 | CERES EBAF (on G:) | 30–40 min | CERES net-radiation globe; IR-out globe |
| **M17** | Reading satellite images (#69 split) | Covers geostationary vs polar orbits, visible, infrared, cloud-top height, water vapour, RGB composites (new: airmass, dust and night-fog RGB named), reading shapes (comma, dry slot, frontal bands) and a typhoon eye. | M15, M16, M04 | #69 s57–s63 (MODIS, GOES-19, Himawari-9); measured **3.6 min** + RGBs | 25–30 min | 3-D orbits round the globe (geostationary vs polar), the GOES full disk wrapping onto the globe |
| **M18** | Reading weather radar (#69 split) | Covers how radar ranges (r = cΔt/2), beam height and the Earth's curvature, dBZ and Z = 200 R^1.6, mosaics vs one radar, and the artefacts (ground clutter, bright band, beam blockage). It adds **Doppler velocity basics** (inbound and outbound colours, the zero line, reading veering with height) and dual-pol in one sentence. The Iowa derecho mosaic is used here. | 5 (polar coords), 4, M13 | #69 s64–s67 (IEM n0q 27 Oct 2026, 10 Aug 2020); NEXRAD Level II KDMX 2020 (AWS); measured **2.5 min** + Doppler | 25–30 min | 3-D radar beam leaving the dish and rising over the curved Earth; PPI cone |
| **M19** | Forecast charts, models and ensembles (#69 split) | Covers NWP and assimilation (recap of M02), four GFS charts valid at one time, verification, the precipitation panel, GFS vs ECMWF IFS, the map score (RMSE), what AIFS is, physics vs machine learning, the ECMWF 51-member ensemble spaghetti and the spread shrinking. | M02, M05, M10 | #69 s68–s73b (GFS-FC, ECMWF open IFS/ENS/AIFS on G:); measured **8.2 min** | 20–25 min | spaghetti on a globe slice; ensemble lows as dots |
| **M20** | Reading weather maps: one storm through every chart (#69 capstone; **keeps `ch00_reading_weather_maps`**) | The opening hook (the real WPC chart "like a secret code"). Ciarán through every chart as a 3-D stack, its impacts, the latest WPC chart read in five steps, and weather → climate (the 30-year November mean). The recap ties back to M01–M19. | M01–M19 | #69 s00–s01, s74–s84 (Ciarán ten-level ERA5, WPC, GFS, GOES, IEM, NCEP R1 LTM); measured **6.6 min** + linking | 20–25 min | **Ciarán ten-level stack** (its only use in the series), flown top-down |

Block total, planning estimate: **about 8–10 h** for 20 movies.

### A3. How #69 v3 is split (scene ranges; measured spans from `storyboard.yaml`)
| #69 v3 scenes | Measured | Goes to |
|---|---|---|
| s00–s01 (title, hook) | 0.59 min | M20 opening (the WPC "secret code" hook) |
| s02–s11 (frame, projections, small print, time, traps) | 6.02 min | M05 |
| s12–s28 (surface chart, fronts) | 10.42 min | M05 |
| s29–s37, s40–s43 (stations) | ≈ 7.7 min | M06 |
| s38–s39 (barbs) | ≈ 1.6 min | M05 (barbs are on every chart) |
| s44–s47 (height of a pressure, 500 sheet, why it dips, levels) | ≈ 2.7 min | ideas move to M07–M09 (re-planned there at full depth); data reused in M10 |
| s48–s52 (850, advection, 500 shapes, trough axis, jet) | ≈ 3.6 min | M10 |
| s53–s54 (thickness, rain–snow) | ≈ 1.0 min | concept in M08, applied in M10 |
| s55–s56 (Trappes skew-T) | 1.30 min | M14 |
| s57–s63 (satellites) | 3.57 min | M17 |
| s64–s67 (radar) | 2.50 min | M18 |
| s68–s73b (models, ensembles, ECMWF) | 8.24 min | M19 |
| s74–s82 (Ciarán stack, impacts, latest chart, climate) | 4.59 min | M20 |
| s83–s84 (recap, end) | 1.41 min | each movie gets its own recap and end card |

The data, the functions F1–F26 and the CHECK rows RM01–RM105 in `ch00_reading_weather_maps/data_needs.md` carry over by
scene. Each split's storyboard lists the RM rows it inherits. Nothing has to be fetched again. Rolling-archive items
already fetched (GFS-FC, ECMWF open data) are on G:.

### A4. Every concept #69 uses → the movie that teaches it first → the first map-reading movie that uses it
| Concept used in #69 | First taught in (v3) | First used in a map-reading movie |
|---|---|---|
| Latitude, longitude, degree length (111 km, a cos φ) | #5 coordinates | M05 |
| Projections, plate carrée, Mercator, Tissot, polar view | #5 | M05 (Lambert conic is taught there itself) |
| Contour line, contour interval, isobar/isotherm/isotach/isohypse | M01 (named in #6) | M05 |
| Highs, lows, ridges, troughs, cols from contours | M01 | M05 |
| Gradient, spacing → strength, pressure-gradient force | #6 | M05 |
| Interpolation, analysis, data assimilation, reanalysis | M02 (reanalysis named in 0.3) | M05, M19 |
| Pressure, hPa, hydrostatic balance | 0.3 | M05 |
| Sea-level pressure reduction | 0.3 (s40), worked in M05 | M05 |
| Coriolis deflection, f = 2Ω sin φ, hemisphere sign | M03 (full: R02) | M05 |
| Geostrophic balance, geostrophic wind | M03 (full: R05) | M05 |
| Friction turns wind across isobars | M03 (full: R06) | M05 |
| Buys Ballot's rule, failure at the equator | M03 | M05 |
| Partial time derivative → pressure tendency, isallobars | #4 (∂/∂t), M05 teaches the chart use | M05 |
| Wind direction, speed units, knots | 0.3 | M05 (barbs taught there) |
| Air masses, front types, front symbols | 0.3 + M04 | M05 |
| Occlusion, cyclone life cycle, comma cloud, dry slot | M04 (dynamics: S05) | M05, M17, M20 |
| Squall line, dryline | M04 | M05 |
| UTC vs local; initial vs valid time; forecast hour | M05 itself (UTC named in 0.3) | M05 |
| METAR, SYNOP, remarks, station model, oktas, present weather, tendency code | M06 itself | M06 |
| Pressure as a vertical coordinate, isobaric surface | M07 | M10 |
| Geopotential, geopotential height, decametres | M08 | M10 |
| Height contours behave like isobars; geostrophic wind on a pressure surface | M08 (with M03) | M10 |
| Hypsometric equation, thickness, warm columns taller, rain–snow line | M08 | M10 |
| Height anomaly, blocking high, cut-off low | M08 (blocking dynamics: W06, S01) | M10 |
| Standard levels 850/700/500/300/250 and what each shows | M09 | M10 |
| Temperature advection −v·∇T | 0.1b dot product | M10 |
| Trough axis (method) | M08 (shape) + M10 (method) | M10 |
| Jet stream, jet streak, isotachs | M01 (isotach) + M10 (reading); full S01 | M10 |
| Cross-section, Hovmöller | M11 | M11 |
| Lapse rate, potential temperature, stability | M12 | M14 |
| Dew point, saturation, Clausius–Clapeyron, LCL, CAPE, CIN | 0.3 (dew point) + M13 | M14 |
| Skew-T lines, freezing level, tropopause on a sounding | M14 | M14 |
| Cloud types | M15 | M17 |
| Infrared emission, brightness temperature, water-vapour channel | #4 (Planck) + M16 | M17 |
| Orbits (geostationary altitude) | M17 itself (Ω from #3) | M17 |
| Radar ranging, beam height, dBZ, Z–R | M18 itself (polar coordinates #5; drops M13) | M18 |
| Doppler radial velocity | M18 itself (dot product 0.1b: velocity along the beam) | M18 |
| NWP model, chaos, ensemble, member, spread, probability, RMSE, ML model | M19 itself (deepened: T11 statistics) | M19 |
| Upper low over the surface low → stopped deepening | M04 (stated), M20 applies; full S05 | M20 |
| Weather vs climate, 30-year mean, anomaly | 0.3 (s36) + M08 (anomaly) | M20 |

No row is used before its teaching movie.

### A5. M08: Geopotential, the height of a pressure, and how forecasters use it (full spec)
**Title.** "Geopotential: the height of a pressure surface, and how forecasters read it every day."
**Prerequisites.**
- #4: integrals, ln and exponentials;
- #6: gradient;
- 0.3: hydrostatic balance and p = ρRT;
- M01: contours;
- M03: geostrophic, first look;
- M07: pressure coordinate.

**Length.** 30–40 min (user).

**Arc and scenes (house style):**
1. s00 title + one sentence. The hook: "on 29 June 2021 the 500-hPa surface over British Columbia stood about 6 km
   up. What does that number mean, and why did it signal 49.6 °C at Lytton?" The ERA5 value and the Lytton record
   are checked rows; the record is cited to ECCC.
2. **What geopotential Φ is.** The work to lift 1 kg from sea level to height z: Φ = ∫₀^z g dz′, in J/kg = m²/s². It
   is energy per kilogram. Why use it rather than plain height: g varies a little with latitude and height, and Φ makes
   the equations on pressure surfaces clean.
3. **Geopotential height Z = Φ/g₀.** It is in metres, and charts label it in decametres ("552" = 5520 m). A worked
   example compares Z and z at 500 hPa: the difference is tiny.
4. **From the hypsometric equation.** dΦ = −R T d(ln p) is derived one move per step from hydrostatic balance and the
   ideal gas law. Integrating gives Z₂ − Z₁ = (R T̄ / g₀) ln(p₁/p₂). Worked: T̄ = 255 K, 1000 → 500 hPa → ≈ 5.2 km.
   Uses `fluidpy.geo.atmos.hypsometric_thickness` and `layer_mean_temperature` (F18).
5. **Warm columns are taller.** Two columns, warm and cold: the 500-hPa surface stands higher over the warm one. A
   layer stack of 8 height surfaces over the 2021 heat dome shows every surface bulging upward together. The camera
   flies round, through and under it.
6. **The 500-hPa chart as a landscape.** ERA5 z500 as a 3-D sheet (vertical exaggeration said aloud): ridges are
   hills, troughs are valleys, and the camera flies along the jet's edge. This is a different place and date from #69
   (the heat dome, then a Northern Hemisphere view).
7. **Height contours act like isobars.** On a pressure surface, the slope of Z plays the role of the pressure gradient.
   u_g = (g₀/f) k × ∇_p Z, stated with the picture (a pointer to M03, derivation in R05). Worked: 60 m per 300 km at
   45° N → ≈ 19 m/s. The wind blows along the contours, with low heights on its left in the NH.
8. **Thickness 1000–500 hPa.** The thickness map, the 5400-m (540-dam) rule of thumb for rain vs snow in North America,
   why it is only a rule (warm noses, freezing rain), and the 528-dam rule for Britain (cited, as #69 C10). The example
   is a winter day with METAR rain and snow reports, chosen by the scout. It is not Ciarán and not La Grande, which
   stay in M10.
9. **Height anomalies.** The value minus the 1991–2020 ERA5 mean for the date. The heat dome stood out at
   about +3 to +4 standard deviations (a checked row, worded to the data).
10. **Blocking highs and cut-off lows.** An omega block (the 2021 dome) and a cut-off low (Daniel, Sep 2023, before the
    Libya floods; impacts cited to WMO). Blocks stall the weather; the dynamics is pointed to W06/S01.
11. **How forecasters use height charts every day.**
    - the 500-hPa pattern first;
    - troughs upstream mean bad weather downstream;
    - the 5520/5640-m lines as storm-track markers;
    - thickness for precipitation type;
    - anomalies for heat and cold.
12. "To sum up" recap, then the weather end card.

**Data:** ERA5 ARCO z, t at 8 levels over 30–70° N, 160–100° W for 27–29 Jun 2021; ERA5 z500 for Daniel; the ERA5
1991–2020 daily z500 climatology (ARCO; computed by a new `fluidpy.diag.climatology.daily_anomaly` if it does not
exist); one winter day's thickness with IEM METARs.

**Functions:** `geo.atmos.{hypsometric_thickness, layer_mean_temperature (F18), geostrophic_wind}`, plus a new
`geo.atmos.geopotential_from_height(z, lat)` (the g(φ, z) integral, Vallis §2.x, from the page image).

### A6. Why this order
- A chart is read with **only the concepts M01–M19 teach**. They are all concept movies at first-year level. None needs
  vector identities, tensors, PDEs, Fourier or complex variables.
- **The early "first look" movies (M03, M04)** let the reader understand *why* winds follow isobars and what a cyclone's
  life cycle looks like. The long movies (R02 Coriolis, R05 geostrophic, S03 fronts, S05 cyclones) later give the full
  derivations, and they point back.
- **Data reuse and §5b.** Every stack has its own data and place: Éowyn (M04), Tibet (M07), the heat dome (M08), the
  monsoon column (M09), Ciarán ten-level (M20 only). The stacks of the weather-basics revision (Ciarán fronts, humidity,
  T) are not reused.

---

## Part B · The forecasting series (F01–F28)

**Placement.** After the map block (M), the dynamics (R, W), the weather systems (S, including S01 jet stream, S07
thunderstorms, S08 tropical cyclones, S09 monsoons) and the global atmosphere (G). It comes **before the ocean**,
because forecasting needs only "warm water and ocean heat content", which F13 defines. The voice is the same as the
rest of the series (Chapter-0 informal, house style). Each movie is a "how a forecaster does it" movie: signal → map →
number → decision, on a real case with real data.

### B1. The case table (open data checked 2026-10-29)
Probe results: listings and HTTP 200s fetched by the director on 2026-10-29. "✓ probed" means a real file or listing
was returned. "✓ known" means a public archive whose coverage is documented but was not probed for this exact date.

| Case | Basin | Teaching job (movie) | IBTrACS | ERA5 | Rain | Satellite | Radar | Forecasts |
|---|---|---|---|---|---|---|---|---|
| **Sidr**, 15 Nov 2007 | Bay of Bengal | storm surge on the Bangladesh coast; warnings that worked vs Bhola 1970 (F19, F27) | NI file ✓ probed (newdelhi + usa agencies) | ✓ (ARCO, 1940→) | IMERG V07 ✓ probed (2007/11 listing; V07 starts Jun 2000); TRMM 3B42 as runner-up | GridSat-B1 IR ✓ probed (2007-11-15); Meteosat-7 IODC (EUMETSAT Data Store, **free account needed**); MODIS (GIBS) ✓ known; HURSAT-B1 v06 ✓ probed | **no open ground radar** (BMD/IMD); TRMM PR overpass (PPS/Earthdata) to check | TIGGE from Oct 2006 (**ECMWF account**); NCEI GFS archive (to verify) |
| **Nargis**, 2 May 2008 | Bay of Bengal → Myanmar | surge in a delta without warnings reaching people; an unusual eastward track (F19 contrast, F27) | NI ✓ | ✓ | IMERG ✓ known | GridSat-B1 ✓ known; Meteosat-7 (account); MODIS ✓ | none open; TRMM PR to check | TIGGE (account) |
| **Aila**, 25 May 2009 | Bay of Bengal | surge + embankment breaches in the Sundarbans, months of salt-water flooding (F19) | NI ✓ | ✓ | IMERG ✓ | GridSat-B1 ✓ probed (2009-05-25); MODIS ✓ | none open; TRMM PR to check | TIGGE (account); TIGGE CXML tracks at NCAR RDA ds330.3 (free RDA account; probe timed out, to verify) |
| **Fani**, 26 Apr – 4 May 2019 | Bay of Bengal → Odisha | **track forecasting**: a long-lived storm that recurved north-northeast; a success of track forecasts and mass evacuation (F17, F27) | NI ✓ | ✓ | IMERG ✓ | **Himawari-8 AWS ✓ probed** (2019-05-02); MODIS/VIIRS ✓ | none open; GPM DPR overpass to check | NCAR RDA ds084.1 GFS 0.25° (free account); TIGGE (account); ECMWF open data **not** yet (starts 2023) |
| **Amphan**, 16–21 May 2020 | Bay of Bengal → Sundarbans | **rapid intensification** in a very warm bay; intensity forecasting (F16); MJO and genesis context (F13) | NI ✓ | ✓ | IMERG HH ✓ probed (2020 day 141) | **Himawari-8 AWS ✓ probed** (2020-05-19); GPM GMI microwave (Earthdata) | none open; GPM DPR overpass to check | RDA GFS (account); TIGGE (account) |
| **Mocha**, 9–14 May 2023 | Bay of Bengal → Myanmar/Bangladesh | **genesis signals** and **satellite + microwave** reading of an intense storm (F13, F14) | NI ✓ | ✓ | IMERG ✓ | **Himawari-9 AWS ✓ probed** (2023-05-13); GPM GMI | none open | **ECMWF open data AWS ✓ probed** (2023-05-12, 0.4° beta ENS); GFS AWS ✓ probed (2023-05-12) |
| **Remal**, 24–28 May 2024 | Bay of Bengal → Bangladesh/W Bengal | **capstone**: forecast end to end with ensembles, ECMWF TC tracks, rain and surge (F28); ensemble cone vs IMD bulletins (F18) | NI ✓ | ✓ | IMERG ✓ | **Himawari-9 AWS ✓ probed** (2024-05-26) | none open | **ECMWF open data 0.25° + AIFS ✓ probed** (2024-05-25); **ECMWF ENS/HRES TC track BUFR (`tf`) ✓ probed**; GFS + GEFS AWS ✓ |
| **Katrina**, 29 Aug 2005 | Gulf of Mexico | surge record on the US Gulf coast; high-water marks; levee failure (F19) | NA file ✓ (on G:) | ✓ | IMERG ✓ (2005) | GridSat-B1 ✓ known (GOES-12); NOAA CLASS (account) | **NEXRAD KLIX + KMOB ✓ probed** (2005-08-29, Level II on `unidata-nexrad-level2`) | pre-TIGGE; NHC ATCF a-deck model tracks **✓ probed** (`aal122005`); USGS STN high-water marks (API redirect, to verify) |
| **Harvey**, 25–31 Aug 2017 | Gulf → Texas | **heavy rain from a stalled hurricane** (F20) | NA ✓ | ✓ | NCEP Stage IV (open, NCAR EOL, to verify); IMERG ✓ | **GOES-16 AWS ✓ probed** (2017 day 239) | **NEXRAD KHGX ✓ probed** | ATCF a-deck ✓ probed (`aal092017`); RDA GFS (account); TIGGE |
| **Ian**, 26–30 Sep 2022 | Gulf → SW Florida | **TC on Doppler radar**: eye, eyewall, rainbands, velocity max (F15); RI over the Gulf (F16 second case); US gauges (F19) | **on G:** | **on G:** (hourly + 18 levels) | IMERG ✓; MRMS AWS ✓ (2020+) | **GOES-16 on G:** | **NEXRAD KTBW ✓ probed**; HRRR on G: | ATCF ✓ probed (`aal092022`); NHC cone shapefile ✓ probed; GFS AWS ✓; **COOPS gauges on G:** |
| **Helene**, 24–27 Sep 2024 | Gulf → Big Bend → Appalachians | **ensemble tracks, the cone and model guidance** (F18); inland orographic flood (F20 second case) | NA ✓ | ✓ | **MRMS QPE AWS ✓ probed** (2024-09-27); IMERG ✓ | **GOES-16 AWS ✓ probed** (2024 day 270) | **NEXRAD KTLH ✓ probed**; KGSP | **ECMWF open data ✓ probed** (2024-09-25, AIFS + IFS); ECMWF `tf` tracks (as Remal); GEFS AWS; NHC cone ✓ probed (`al092024`); ATCF |
| **Hagibis**, 5–13 Oct 2019 | West Pacific → Japan | **Dvorak in plain words, microwave eyewall**, explosive intensification (F14); Japan heavy rain (F20 aside) | WP file ✓ probed | ✓ | IMERG ✓ | Himawari-8 AWS ✓ known (bucket covers 2019) | JMA radar **not open**; GPM DPR overpass to check | RDA GFS; TIGGE |
| *Haiyan*, 8 Nov 2013 (contrast) | West Pacific → Philippines | surge in Tacloban: one sentence and one map in F19 | WP ✓ | ✓ | IMERG ✓ | GridSat-B1 / HURSAT ✓ known | none | TIGGE |
| Ciarán, 1–2 Nov 2023 | N Atlantic → Brittany | bomb cyclone forecast, with the models (F05); **on G:** | n/a | on G: | IMERG ✓ | GOES-16/MODIS on G: | — | ECMWF open data ✓ (2023), GFS AWS |
| Grayson (US "bomb cyclone"), 3–5 Jan 2018 | NW Atlantic | explosive deepening rate scaled by latitude (F05 second case) | n/a | ✓ | IMERG ✓ | GOES-16 AWS ✓ known | NEXRAD ✓ known | RDA GFS; TIGGE |
| Moore tornado, 20 May 2013 | Oklahoma | severe ingredients (F06), hook, couplet and **debris signature** (F08), the outlook → watch → warning day (F10) | n/a | ✓ | — | GOES-13 via GridSat / CLASS | **NEXRAD KTLX ✓ probed** (V06 = dual-pol) | SPC reports CSV ✓ probed; SPC outlook archive ✓ probed; IEM warning polygons ✓ probed; IGRA2 OUN |
| Mayfield tornado, 10–11 Dec 2021 | Kentucky | night-time long-track tornado, GLM, warning lead time (F08, F10) | n/a | ✓ | MRMS ✓ | **GOES-16 + GLM AWS** ✓ known | NEXRAD KPAH ✓ known | SPC, IEM ✓; GFS AWS |
| Dakotas derecho, 12 May 2022 | US northern Plains | storm types: squall line, bow echo, derecho (F07) | n/a | ✓ | MRMS ✓ | GOES-16 + GLM ✓ known | NEXRAD KFSD ✓ known | SPC reports ✓ |
| Iowa derecho, 10 Aug 2020 | US Midwest | downbursts and lightning jumps (F09); runner-up for F07 | n/a | ✓ | MRMS ✓ | **GLM ✓ probed** (2020 day 223) | **NEXRAD KDVN ✓ probed** | SPC ✓ |
| Bara–Parsa tornado, 31 Mar 2019 | Nepal Terai | South Asian severe storm (F11) | n/a | ✓ | IMERG ✓ | Himawari-8 AWS ✓ known | none open | — |
| Bangladesh nor'wester day (scout picks one in Apr 2023–24 from BMD/press reports) | Bangladesh | kalbaishakhi ingredients and lifecycle (F11) | n/a | ✓ | IMERG ✓ | Himawari-9 ✓ | none open (BMD) | ECMWF open data ✓ |
| Kentucky flash flood, 28 Jul 2022 | Appalachians | training convection and nowcasting (F12, F22) | n/a | ✓ | MRMS ✓ | GOES-16 ✓ | NEXRAD KJKL ✓ known | GFS AWS, ECMWF open data (2022: not yet; starts 2023) |
| Valencia DANA, 29 Oct 2024 | Spain | cut-off low + Mediterranean moisture + training; flash floods (F22) | n/a | ✓ | IMERG ✓; AEMET gauge totals cited | Meteosat (EUMETSAT, account); MODIS/VIIRS ✓ | AEMET radar archive **not open** | ECMWF open data ✓ |
| California atmospheric rivers, 26 Dec 2022 – 17 Jan 2023 | NE Pacific → California | IVT, AR scale, orographic rain (F21) | n/a | ✓ (IVT computed) | MRMS ✓; IMERG ✓ | GOES-17/18 AWS ✓ known | NEXRAD ✓ known | ECMWF open data ✓ (Jan 2023 onward), GFS AWS |
| Sylhet/Meghalaya floods, mid-Jun 2022 | NE Bangladesh / India | monsoon orographic rain at Cherrapunji, floods downstream (F21) | n/a | ✓ | IMERG ✓ | Himawari-8 ✓; Sentinel-1 flood extent (Copernicus, open) | none open | GFS AWS |
| Monsoon depression (scout picks one; candidate: late-Aug 2024 depression over Bangladesh–Tripura with the Feni floods, to verify; runner-up Pakistan 2022, GEE frames on G:) | Bay of Bengal / land | monsoon depressions and where the rain falls (F23) | NI (if listed) | ✓ | IMERG ✓ | Himawari-9 ✓; Sentinel-1 ✓ | none open | ECMWF open data ✓ |
| Elliott blizzard, 22–26 Dec 2022 | US Great Lakes | blizzards, lake-effect snow, flash freeze (F24) | n/a | ✓ | MRMS ✓ | GOES-16 ✓ | NEXRAD KBUF ✓ known | GFS AWS |
| Indo-Gangetic winter fog (scout picks one, e.g. late Dec 2024) | N India / Bangladesh | fog forecasting (F25) | n/a | ✓ | — | Himawari-9 night-fog RGB ✓; MODIS ✓ | — | ECMWF open data ✓ |
| North India dust storms, 2 May 2018 | Rajasthan / Uttar Pradesh | dust storms and haboobs (F25) | n/a | ✓ (+ CAMS dust, open with the CDS account) | — | Himawari-8 ✓; MODIS AOD (GIBS) ✓ | none | RDA GFS |
| South Asia heat, Apr 2024; UK 40 °C, 19 Jul 2022 | Bangladesh/India; UK | heatwaves, heat domes, wet-bulb temperature (F26) | n/a | ✓ | — | MODIS LST ✓ | — | ECMWF open data ✓ (2024); GFS AWS |

**Spread of the Bay of Bengal cases across movies:**

| Case | Movies | What it teaches there |
|---|---|---|
| Sidr + Aila | F19 | surge |
| Nargis | F19, F27 | contrast: surge without warnings |
| Fani | F17, F27 | track, evacuation |
| Amphan | F16, F13 aside | rapid intensification |
| Mocha | F13, F14 | genesis, satellite, microwave |
| Remal | F18, F28 | ensembles, capstone |

**US cases:**

| Case | Movies | What it teaches there |
|---|---|---|
| Ian | F15, F16, F19 | radar, RI, gauges |
| Katrina | F19 | surge, high-water marks |
| Harvey | F20 | stalled rain |
| Helene | F18, F20 | cone, inland flood |

### B2. The forecasting movies
Prerequisites are given in v3 codes. Every movie also has the map block (M01–M20) behind it. Lengths are planning
estimates.

| v3 | Title | Scope (2–3 lines) | Prereqs | Real case + source | Est. length | §5b moments |
|---|---|---|---|---|---|---|
| **F01** | How a forecast is made today: from observations to warnings | Covers the chain: observations → assimilation → models → ensembles → forecaster → warning → action. It names the time ranges (nowcast, short, medium, sub-seasonal) and contrasts deterministic and probabilistic forecasts. It introduces "ingredients-based" thinking and previews the series. | M19, T11, S05, S08 | One day, 26 May 2024 (Remal's landfall day): the ECMWF open data chart, IMD bulletin text paraphrased (no quote), Himawari-9 | 25–30 min | globe of the global observing system for one 6-h window (stations, sondes, aircraft, satellites) |
| **F02** | Signals on the map I: pressure falls, vorticity and PV anomalies | Covers the 3-h and 12-h tendency map, falls ahead of the low, relative vorticity at 500 hPa, absolute vorticity maxima, PV on the dynamic tropopause (2 PVU) and PV streamers. It asks "where will a low deepen?" | R09, R10, R11, M10 | Grayson, Jan 2018 (ERA5) | 30–35 min | **layer stack** of PV on 5 isentropic surfaces (300–340 K) with the tropopause fold; fly under it |
| **F03** | Signals on the map II: jet streaks and divergence aloft | Covers the four-quadrant jet-streak model (ageostrophic circulation in words, pointer to R11), 250-hPa divergence, the left-exit and right-entrance rules (NH) and their SH mirror, coupled jets, and upper troughs "digging". | S01, R11, M10 | ERA5 250 hPa, US Christmas 2022 cyclogenesis (Elliott's upper support) | 25–30 min | 3-D jet streak with rising and sinking arrows in the entrance/exit quadrants; column cut through the exit region |
| **F04** | Signals on the map III: moisture — precipitable water, IVT, plumes and atmospheric rivers | Covers precipitable water (tcwv), integrated vapour transport (IVT = ∫ q v dp / g, derived), AR detection threshold (250 kg m⁻¹ s⁻¹), moisture plumes on water-vapour imagery, and the standardized anomaly of PW. | M13, M17, 0.1b, T11 | California ARs Jan 2023 (ERA5 IVT computed), GOES-18 WV | 25–30 min | globe of IVT filaments (colour bar beside), zoom along the AR to its landfall, back out |
| **F05** | Forecasting extratropical and bomb cyclones | Covers the bomb criterion (24 hPa in 24 h × sin φ / sin 60°), signals 1–3 days ahead (upper trough, jet exit, warm moist inflow), the sting jet and damaging-wind areas, model guidance (GFS, IFS, AIFS) and ensemble low positions. | F02–F04, S05, M19 | **Ciarán 2023** (on G:: ERA5, ECMWF open data, GFS-FC) + Grayson 2018 | 35–40 min | globe follow of Ciarán's ensemble lows; deepening clock |
| **F06** | Severe-storm ingredients: moisture, instability, lift and shear | Covers CAPE and CIN from M13/M14 in use, deep-layer shear (0–6 km), storm-relative helicity, hodographs explained from zero, the cap and lifting mechanisms (fronts, drylines, outflow), and composite parameters in words (STP). | M14, R07, S07 | Moore, 20 May 2013 (ERA5 CAPE and shear, IGRA2 OUN) | 30–35 min | 3-D hodograph rising out of a column; **layer stack** of wind at 6 levels (surface → 500 hPa) turning with height over Oklahoma |
| **F07** | Storm types on radar and satellite: cells, squall lines, MCSs, derechos and supercells | Covers single cells, multicells, the squall line and bow echo, the rear-inflow jet, the MCS and MCC on IR, the derecho definition, and the supercell structure (mesocyclone, forward and rear flank). | F06, M17, M18 | **Dakotas derecho, 12 May 2022** (NEXRAD KFSD AWS, GOES-16 IR + GLM, SPC reports) | 30–35 min | 3-D supercell built from a real radar volume (reflectivity isosurfaces) |
| **F08** | Tornadoes on radar: hook echo, velocity couplet and debris signature | Covers reflectivity hook, velocity couplet (inbound/outbound next to each other), rotation strength (ΔV), the dual-pol debris signature (low correlation coefficient), and range and beam-height limits. | M18, F07 | **Moore 2013** (KTLX V06 dual-pol, AWS) + **Mayfield 2021** (KPAH, GLM) | 30–35 min | 3-D radar volume slices at 4 tilts round the couplet, the camera circling the hook |
| **F09** | Hail, downbursts and lightning | Covers hail signals (high dBZ above the freezing level, the three-body scatter spike, MESH from MRMS), downbursts and microbursts (velocity divergence near the ground, the rear-inflow jet), and lightning from GOES GLM (flash density, lightning jumps). | F07, F08, M14 | Iowa derecho 2020 (KDVN, GLM on AWS); a 2023–24 US hail day from SPC reports + MRMS MESH (AWS, 2020+; scout picks) | 30–35 min | GLM flashes as a 3-D point cloud above the radar map |
| **F10** | Outlooks, watches and warnings | Covers SPC Day 1–3 probabilistic outlooks (categories from probabilities), watches (boxes) vs warnings (polygons), lead time, false alarms and verification against storm reports, and impact-based warnings. It adds the IMD and BMD colour-coded and nowcast warnings (described; no open archive). | F06–F09 | Moore 2013 day: SPC 1630Z outlook ✓, watch, IEM warning polygons ✓, SPC reports ✓; Mayfield timeline | 25–30 min | map timeline only (no globe) |
| **F11** | Nor'westers (kalbaishakhi) and South Asian pre-monsoon storms | Covers the moist southerlies from the Bay vs dry northwesterlies, the dryline-like boundary, very high CAPE in April–May, squall lines moving southeast, overshooting tops on Himawari, and hail and tornadoes (Bara 2019). It notes the observing gaps (no open radar, no GLM over Asia). | F06, F07, S09 | Bara–Parsa 31 Mar 2019 (Himawari-8, ERA5, IMERG); a Bangladesh nor'wester day 2023–24 (Himawari-9, ERA5, ECMWF open data) | 30–35 min | globe zoom to the Bengal delta with the two air streams animated, then back out; θ_e layer stack over Bangladesh |
| **F12** | Nowcasting: the next two hours from radar and satellite | Covers extrapolation (optical flow, as in the open-source pysteps; our tested function), growth and decay limits, the "two-hour wall", satellite nowcasting where there is no radar, and flash-flood nowcasting. | M18, F07, T11 | Kentucky 28 Jul 2022 (NEXRAD KJKL, MRMS); our extrapolation vs what happened (scored) | 25–30 min | radar field advected forward on the map with the vector field animated |
| **F13** | Tropical-cyclone genesis: the signals | Covers SST above ≈ 26.5 °C and ocean heat content, low vertical shear, mid-level moisture, low-level vorticity (monsoon trough), the MJO phase and divergence aloft. It describes genesis-probability maps from the ensembles and how IMD and NHC watch a disturbance. | S08, W07, F04 | **Mocha 2023** (ERA5, OISST, Himawari-9, ECMWF open-data ENS 2023); Amphan 2020 MJO aside | 30–35 min | globe of SST + shear (two colour bars beside) with the Bay zoom; **layer stack** of RH at 5 levels over the pre-Mocha disturbance |
| **F14** | Reading a tropical cyclone on satellite: Dvorak in plain words, and microwave | Covers IR patterns (curved band → CDO → eye), the Dvorak idea (pattern → T-number → wind, in words), why cirrus hides the eyewall and why 89/37 GHz microwave sees it, scatterometer winds (ASCAT), and eyewall replacement. | M17, S08 | **Hagibis 2019** (Himawari-8 10-min IR, GPM GMI, ASCAT via Earthdata) + Mocha 2023 microwave | 30–35 min | eye zoom on a Himawari globe; microwave swath draped over the IR |
| **F15** | Tropical cyclones on radar | Covers eye and eyewall in reflectivity, spiral rainbands, Doppler velocity max and the wind-speed estimate from radial velocity, rain rates in the eyewall, beam-height limits offshore, and spaceborne radar (GPM DPR) where ground radar is not open (Bay of Bengal). | M18, F14 | **Ian 2022** (NEXRAD KTBW AWS ✓, HRRR + GOES-16 on G:); Amphan GPM DPR overpass (if found) | 30–35 min | 3-D radar volume of Ian's eyewall; camera through the eye |
| **F16** | Rapid intensification and intensity forecasting | Covers the RI definition (≥ 30 kt in 24 h), ingredients (OHC, low shear, moist core, symmetric convection), why intensity is harder than track, statistical predictors in words, and model intensity errors. | F13–F15 | **Amphan 2020** (IBTrACS, ERA5, OISST/OHC, Himawari-8, GPM); Ian's RI over the Gulf | 30–35 min | intensity vs time chart beside a globe zoom on the Bay's warm pool |
| **F17** | Steering and track forecasting | Covers the steering flow (deep-layer mean 850–200 hPa), the subtropical ridge, beta drift (from W06 Rossby waves), recurvature, and binary interaction in one sentence. It explains why tracks are predictable and how errors have shrunk (cited). | W06, G01, S08, M10 | **Fani 2019** (IBTrACS, ERA5 steering computed, Himawari-8; RDA GFS forecasts) | 30–35 min | globe with the steering-flow streaks animated and Fani's track drawing; zoom to Odisha, back out |
| **F18** | Ensemble tracks, the cone of uncertainty and model guidance | Covers ensemble TC tracks (ECMWF `tf` BUFR, GEFS), strike probability, how the NHC cone is built (circles enclosing about two-thirds of the past official errors), consensus, GFS vs IFS vs AIFS tracks, and what the cone does **not** show (size, rain, surge). | F17, M19, T11 | **Helene 2024** (ECMWF open data + `tf`, GEFS AWS, NHC cone shapefiles ✓, ATCF) + Remal 2024 vs IMD official track | 30–35 min | spaghetti of 51 member tracks on a globe, the cone forming from them |
| **F19** | Storm surge | Covers the parts of a surge: wind setup on a shallow shelf, pressure (≈ 1 cm per hPa), tide timing and waves. It explains why the Bay of Bengal is the world's surge hotspot (shallow, wide, funnel-shaped, low delta), and how cyclone shelters and warnings cut deaths (cited, EM-DAT/BMD). | F17, M08, 5 (no ocean movie needed; F19 defines the shelf ideas itself) | **Sidr 2007, Aila 2009** (IBTrACS radii, ERA5 winds, ETOPO shelf, GridSat/MODIS, Global Flood Database / MODIS inundation); Nargis 2008 contrast; **Katrina 2005** (KLIX, USGS high-water marks); **Ian** (COOPS on G:); Haiyan one-line | 35–40 min | 3-D shelf bathymetry with the surge dome moving onto the Sundarbans (vertical exaggeration said); zoom tour Meghna estuary → Sundarbans → Chittagong, back out |
| **F20** | Heavy rain I: tropical-cyclone rain and stalled storms | Covers rain rate × duration, slow motion as the killer, the right-front quadrant, the predecessor rain event, orographic rain in mountains far inland, and QPF maps. | F15, F17, M13 | **Harvey 2017** (Stage IV / IMERG, KHGX, GOES-16) + **Helene 2024** Appalachians (MRMS AWS, KGSP) | 30–35 min | accumulated-rain sheet in 3-D over terrain (Appalachians), vertical exaggeration said |
| **F21** | Heavy rain II: atmospheric rivers and orographic rain | Covers IVT meets terrain, the rain shadow, upslope rain rate ≈ IVT × slope (worked), the AR category scale, and the monsoon orographic extreme at Cherrapunji. | F04, M13, M01 | California Jan 2023 ARs (ERA5 IVT, MRMS, NEXRAD) + **Sylhet/Meghalaya Jun 2022** (IMERG, ERA5, Sentinel-1 floods) | 30–35 min | globe zoom on the Khasi Hills with ETOPO relief and the moist flow climbing it |
| **F22** | Heavy rain III: training convection, MCSs and flash floods | Covers back-building and training ("echo training"), quasi-stationary boundaries, cut-off lows over warm seas, and flash-flood guidance in words. | F07, F12, M08 | **Valencia DANA 2024** (ERA5, IMERG, AEMET totals cited) + Kentucky 2022 (KJKL, MRMS) | 30–35 min | z500 cut-off low on a globe over the Mediterranean, zoom to Valencia, back out |
| **F23** | Monsoon depressions and monsoon floods | Covers the monsoon trough, depressions forming over the head of the Bay and moving west-northwest, heaviest rain to the southwest of the centre (a checked row on the case), and the flood forecast chain. | S09, F04, F13 | Scout-picked Bay of Bengal depression (candidate Aug 2024 Bangladesh–Tripura; runner-up Pakistan 2022) — IMERG, ERA5, Himawari-9, Sentinel-1 | 25–30 min | **layer stack** of vorticity at 4 levels through the depression (vortex tilted southwest with height, if the data show it) |
| **F24** | Winter storms: blizzards, nor'easters, lake-effect snow and freezing rain | Covers precipitation type from thickness and the warm nose on the skew-T (freezing rain), lake-effect bands, nor'easter structure, blizzard criteria and flash freezes. | M08, M14, F05 | **Elliott, Dec 2022** (ERA5, GOES-16, NEXRAD KBUF, IGRA2 Buffalo) | 30–35 min | skew-T column beside the lake-effect band; globe follow of the Arctic front |
| **F25** | Fog and dust storms | Covers radiation fog (clear sky, light wind, small dew-point depression), advection fog, the night-fog RGB, and Indo-Gangetic winter fog. For dust: haboobs from outflows, dust RGB and aerosol optical depth, and visibility. | M13, M17, F07 | Indo-Gangetic fog (Himawari-9, MODIS, ERA5) + north India dust storm 2 May 2018 (Himawari-8, MODIS AOD, CAMS) | 25–30 min | Himawari night-fog RGB draped on a globe, zoom to the Ganges plain, back out |
| **F26** | Heatwaves and heat domes | Covers blocking and subsidence (from M08/S01), soil-moisture feedback, wet-bulb temperature and heat index (derived), and forecasting heat days ahead. | M08, S01, M13 | South Asia Apr 2024 (ERA5, MODIS LST) + UK 19 Jul 2022 (ERA5, ISD) | 25–30 min | globe of T2m anomaly with the block's z500 contours, Bangladesh zoom |
| **F27** | Warnings and impacts: from forecast to action | Covers Bangladesh maritime signals and the Cyclone Preparedness Programme, IMD colour codes, NHC products, evacuation lead time, shelters, the fall of cyclone deaths in Bangladesh over 50 years (cited), and flooding, landslides, power and crops. It shows how to read a warning honestly. | F17–F19 | Sidr / Nargis contrast; Fani evacuation (cited); Amphan in COVID-19 (cited) | 25–30 min | map timeline (globe only for the closing sweep across basins) |
| **F28** | Forecasting a Bay of Bengal cyclone end to end (capstone) | Day −7 → landfall + 2 days, one forecaster's sequence: genesis signals → first ensemble tracks → intensity → cone → rain and surge → warnings → verification against IBTrACS, IMERG and impacts. | F01–F27 | **Remal 2024** (ECMWF open data + `tf` tracks, AIFS, GFS/GEFS AWS, Himawari-9, IMERG, ERA5, IBTrACS NI) | 40–50 min | the full house-globe sequence: Bay zoom, ensemble tracks, rain sheet over the delta, back out |

Series length estimate: about 14–16 h for 28 movies.

---

## Part D · Current events and analysis (CE01–CE17; user additions 2026-10-29)
**What these movies are.** Each one takes something happening now, or a very recent disaster, and does four things:
- analyses it with the latest real data, quantitatively and qualitatively;
- sets it against the historical observations;
- checks it against published studies;
- says honestly what is known and what is debated.

The house style is unchanged. Every number is a CHECK row, and impacts are cited only.

**Placement.** They form **Stage 12**, after the movies their ideas depend on. In *viewing* order they come after
climate variability (CV), because the polar-vortex, ENSO and hurricane analyses need G03, CV01, CV04 and F13–F18.
**Because they are news, production may jump the queue** as soon as a movie's prerequisites are finished. The
prerequisites column says exactly which those are.

**Data refresh rule (binding for every CE movie).** All CE data are **re-fetched just before each build**, then frozen
for that build. This covers indices, analyses, best tracks, satellite scenes, impact figures and outlooks. The rules
for each build:
- The storyboard records the **"data as of" date**, and every source line carries the data date.
- The narration says "as of <month year>".
- If the build slips more than about 2 weeks, the director re-runs the refresh and the CHECK rows, and re-words to the
  data.
- Provisional products are named as provisional: ERA5T, IMERG Early/Late, IBTrACS "provisional", NHC operational
  advisories.

Index state read on 2026-10-29 (CPC, for planning only), to be re-read at build:

| Index | Season | Value |
|---|---|---|
| ONI | JAS 2026 | **+2.16** (rising from +0.46 in MAM) |
| RONI | JAS 2026 | **+1.69** |

### D1. The CE movies
| v3 | Title | Scope | Prereqs | Data (open; licence; access route) | GIS and satellite layers | Est. length |
|---|---|---|---|---|---|---|
| **CE01** | Where is the polar vortex now, and how do we measure it? | Measures the vortex with the 10-hPa zonal-mean wind at 60° N, the 10-hPa height field, and the vortex **centroid and aspect ratio** (2-D moment diagnostics). It covers the major-SSW criterion (wind reversal at 60° N, 10 hPa) and the minor-warming and final-warming definitions. It shows **winter 2025–26 day by day**, then the current winter as it starts, with the GFS and ECMWF forecasts of the stratosphere. | G03, T11, M08 | NCEP R1 10 hPa (on G:, ends 2026-03-17; public domain; PSL THREDDS); **ERA5/ERA5T** 10–100 hPa (CC BY 4.0; ARCO/CDS); **GFS** 10 hPa (public domain; AWS `noaa-gfs-bdp-pds`); ECMWF open data upper levels (CC BY 4.0; AWS; top level to verify, probably 50 hPa); NASA MERRA-2 (Earthdata) as a cross-check; CPC stratosphere monitoring (public domain) | polar-stereographic globe cap of z10 (colour bar beside); the centroid track as a moving dot with the ellipse; a **layer stack** of z at 10/30/50/100 hPa on the latest date (a different date from G03) | 30–35 min |
| **CE02** | How a weak vortex reaches the ground: this winter's US cold outbreaks | Covers downward coupling ("dripping paint" time–height plots of the annular mode), the AO/NAO indices, and the tropospheric routes that need no SSW (a stretched vortex, wave reflection). It analyses **each 2025–26 US cold outbreak**: ERA5 T2m anomalies, daily records broken (GHCN-Daily), wind chill and impacts (cited). It ends with what the stratosphere did before each outbreak. | CE01, CV04 | ERA5 (CC BY 4.0); **CPC AO/NAO daily indices** (public domain); **GHCN-Daily** (NOAA NCEI, public domain; AWS `noaa-ghcn-pds`); NOAA Storm Events (public domain); **NOAA NCEI US records** (public domain); impacts from NWS/NOAA reports, cited | US county map of record lows (Census TIGER boundaries, public domain); GOES-19 clouds over the cold air (lake-effect streets); MODIS/VIIRS snow cover (GIBS); time–height plot of the annular-mode index | 35–40 min |
| **CE03** | The record: past SSWs and US cold outbreaks, and what science says | Covers the **SSW record since 1958** (an open compendium, cited) and the US cold events of **Jan 1985, Dec 1989, Jan 2014, Jan–Feb 2019 and Feb 2021 (Texas)**: how many followed an SSW, the lag, and the counter-examples. It presents the **Arctic-amplification debate fairly**: papers arguing for a link vs model studies finding a weak or no link, and where the IPCC AR6 assessment stands (low confidence). It also covers warming trends in US cold extremes. | CE01, CE02, CV06 | ERA5 back to 1940 (CC BY 4.0); NCEP R1 1948– (public domain); GHCN-Daily; SSW compendium data (open, cited; to verify the current host); NCEI billion-dollar disasters (public domain); ERCOT/FERC Texas 2021 reports (cited) | small multiples of five cold events (T2m anomaly maps); index time series drawing themselves; a timeline | 35–40 min |
| **CE04** | El Niño 2026: how big is it, and could it be the biggest on record? | **Tests the user's question against the data; it is not a claim.** It compares ONI/Niño-3.4 with the peaks of 1877–78 (reconstructions only, wide uncertainty), 1982–83, 1997–98 and 2015–16. The **relative index RONI** is the key honest point: part of today's Niño-3.4 warmth is the whole tropics warming. It adds OLR (where the rain moved), **subsurface heat content** (TAO/TRITON, GODAS, Argo, warm water volume) and sea-level anomaly from altimetry. The forecasts are the IRI plume, CPC probabilities and C3S multi-model, with spread. It ends with a ranking table and the verdict worded to the data at build time. | CV01, T11, M17 | **CPC ONI, RONI, Niño indices** (public domain; cpc.ncep.noaa.gov ✓ probed); **OISST v2.1, ERSST v5** (public domain; PSL/NCEI); HadISST (Met Office, non-commercial with credit) for 1870s context; **NOAA interpolated OLR** (public domain); **TAO/TRITON** (PMEL, public domain); **NCEP GODAS** (public domain); **PMEL warm water volume**; Argo (CC BY 4.0); **NASA SSH (PO.DAAC, Earthdata)**, with CMEMS still not set up (gap); **IRI ENSO plume** (Columbia IRI, free use with credit) and **C3S seasonal** (CDS account ✓) | animated SST-anomaly globe (OISST daily; house globe, Pacific zoom and back out); **3-D Pacific thermocline section** from GODAS/TAO (a layer stack of temperature at 6 depths, the camera under the sea surface); altimetry SSH map; ranking bar chart | 40–45 min |
| **CE05** | El Niño 2026's impacts I: rain, drought, fire and vegetation, region by region | Covers five regional impact maps: South America (Peru/Ecuador floods, the Amazon and northeast Brazil drought), Southern Africa (drought), South and Southeast Asia (monsoon deficit, Indonesian fires), Australia, and the USA (the southern-tier wet winter outlook). Each has rain anomaly + vegetation + fire + drought index, then what history says for that region (the El Niño composite vs this year). | CE04, CV01, M17 | **GPM IMERG** (NASA, open; Earthdata); **CHIRPS** (UCSB CHC, CC BY 4.0 — verify); **MODIS/VIIRS NDVI** (NASA, open; GEE/GIBS); **FIRMS active fire** (NASA, open); **SPEIbase** (CSIC, open — verify licence); **US Drought Monitor** (NDMC/USDA/NOAA, open with credit); ERA5 soil moisture (CC BY 4.0) | five regional maps (Natural Earth admin-1); NDVI anomaly swipe (before/after); a fire-count timeline; a globe opening that visits each region in turn and zooms back out | 40–45 min |
| **CE06** | El Niño 2026's impacts II: food, fisheries, coral and health | Covers crop conditions and yields (maize in Southern Africa, rice in Southeast Asia, wheat and soy outlooks), food-security outlooks, the Peru anchoveta season (catch quota or cancellation), coral bleaching (heat stress), dengue and other climate-sensitive disease reports, with honest causal language ("consistent with", "made more likely"). | CE05 | **FAO GIEWS** country briefs and **FAOSTAT** (CC BY 4.0); **FEWS NET** outlooks and IPC maps (open with credit); **USDA FAS Crop Explorer** / GEOGLAM Crop Monitor (open); **IMARPE/PRODUCE** anchoveta reports (Peru government, cited); FAO FishStat (CC BY-NC-SA 3.0 IGO, non-commercial use fits); **NOAA Coral Reef Watch** degree-heating weeks (public domain); **PAHO PLISA dengue** (open, cited), WHO reports (cited) | IPC phase choropleth (FEWS NET shapefiles); DHW globe for coral; crop-calendar timeline; landings bar chart | 35–40 min |
| **CE07** | The latest hurricane season round the USA, warm oceans and El Niño | Covers the latest Atlantic and East Pacific seasons storm by storm (best tracks), **ACE** computed from 6-hourly winds, rapid-intensification counts, **Atlantic/Gulf ocean heat content**, vertical shear (ERA5 200–850 hPa), and the **ENSO teleconnection** (El Niño usually raises Atlantic shear: did it this year?). It adds record SSTs and the extratropical lows and nor'easters along the US coast this year. Attribution is in fair language (the IPCC AR6 assessment; rapid studies cited as such). | F13–F18, CE04, CV06 | **IBTrACS** (public domain; weekly provisional) and **NHC HURDAT2 / TC reports** after the season (public domain); NHC operational advisories (public domain); **AOML TCHP / ocean heat content** (public domain); **OISST** (public domain); ERA5 (CC BY 4.0); GOES-19 (public domain; AWS); NEXRAD landfalls (AWS) | season-track globe with ACE bars beside; OHC map of the Gulf (colour bar beside); a shear map with the ENSO composite; a GOES-19 loop of the strongest storm | 35–40 min |
| **CE08** | Record-warm years: what 2023–2026 tell us | Covers the global mean temperature from four datasets, the El Niño bump vs the trend, the record months, and what explains 2023–24 (cited studies, including open questions). It places 2026 and makes a 2027 outlook (cited). | CV06, CE04 | ERA5 / C3S monthly bulletins (CC BY 4.0); NASA GISTEMP (public domain); HadCRUT5 (OGL); Berkeley Earth (CC BY 4.0); NOAA GlobalTemp (public domain) | warming-stripe globe; anomaly map animation | 30–35 min |
| **CE09** | The latest marine heatwaves | Covers the Hobday categories, the North Atlantic 2023 event, the newest events (OISST daily), and impacts on coral, fisheries and hurricanes. | O02, CV06 | OISST (public domain); NOAA CRW (public domain); NOAA PSL marine-heatwave tracker (open) | MHW-category globe; SST-anomaly swipe | 30–35 min |
| **CE10** | The Arctic sea-ice minimum, 2026 | Covers September extent and volume against the satellite record, with trends and uncertainty. | O12, CV06 | NSIDC Sea Ice Index (open with credit; Earthdata/NSIDC); OSI SAF (EUMETSAT, open); PIOMAS volume (UW, open with credit) | polar globe with the ice edge for each year; extent time series | 25–30 min |
| **CE11** | The 2026 South Asian monsoon and the Bangladesh floods | Covers onset, breaks and withdrawal, the seasonal rain anomaly against the IMD and BMD normals, monsoon depressions this season, the Brahmaputra/Meghna flood peaks, and our own flood-extent map (method CE15). | S09, F23, CE15 | IMERG (open); IMD seasonal statistics (web, cited); **Bangladesh FFWC** bulletins (web, cited; no open archive API: gap); **Sentinel-1** (Copernicus open; Planetary Computer ✓ probed); **GloFAS** (CEMS; CDS account ✓); ERA5 | Sentinel-1 flood swipe over the delta; a district choropleth (geoBoundaries, CC BY 4.0); a basin map (HydroSHEDS, free with credit) | 35–40 min |
| **CE12** | Bay of Bengal cyclone season review, 2026 | Covers the pre- and post-monsoon seasons storm by storm: tracks, intensity, RI, rain, landfall impacts (cited) and forecast skill. The post-monsoon season ends in December, so the build waits for it. | F13–F19, F27 | IBTrACS NI (public domain); IMD RSMC reports (web, cited); Himawari-9 (AWS); IMERG; ECMWF open data `tf` tracks (CC BY 4.0) | season-track globe; per-storm Himawari panels | 30–35 min |
| **CE13** | The California atmospheric-river season (latest winter) | Covers the count of ARs by category, IVT, snowpack and reservoirs against normal, and floods and drought relief. | F04, F21 | ERA5 IVT (computed); CW3E AR catalogue (open, cited); **CDEC / SNOTEL** (state/USDA, public); MRMS (AWS) | IVT filament globe; snowpack bar chart; Sierra terrain flyover with rain sheet | 30–35 min |
| **CE14** | Europe's summer 2026 heat | Covers heatwaves by country, records, the blocking and soil-moisture setting, and mortality estimates (cited studies only). | F26, CE08 | ERA5 (CC BY 4.0); E-OBS (ECA&D, non-commercial research, fits); ISD; C3S European State of the Climate (cited) | T2m-anomaly map animation; z500 block on a globe | 30–35 min |
| **CE15** | Mapping a disaster from space: SAR floods, landslide scars, terrain and exposure (method movie) | Covers how SAR sees water (dark, smooth surfaces; before/after change detection, threshold and log-ratio, derived), how NDVI and brightness change reveal landslide scars, and how slope comes from a DEM. Exposure = hazard footprint ∩ buildings, roads, cropland, people. It covers accuracy and false alarms (shadow, urban double-bounce), and cartographic standards (scale bar, north arrow where needed, legend, source and date). | M01, M02, M17, M18, 5, 6 | **Derna / Storm Daniel 2023** (STAC scenes already on G: `raw/STAC/stac_derna_2023`); Sentinel-1/2 (Copernicus open); Copernicus GLO-30 DEM (free, attribution); ESA WorldCover (CC BY 4.0); MS Buildings (ODbL) | before/after swipes; 3-D terrain flyover of the Wadi Derna valley; exposure choropleth | 30–35 min |
| **CE16** | **Cyclone Ditwah: the Sri Lanka floods and landslides (Nov 2025)** | See §D2. | CE15, S08, F20, F21, M17 | §D2 | §D2 | **40–45 min** (≥ 30) |
| **CE17** | **The 2026 Himalayan glacier collapse and outburst flood (Tibet → Nepal)** | See §D3. | CE15, CE16 (method reuse), F22 (flash floods), CV06 | §D3 | §D3 | 35–40 min |

**On the name "Sri Lanka's glacier burst".** Sri Lanka has no glaciers, so the user's request is met by two movies:
CE16, the Sri Lanka disaster (Ditwah floods and landslides), and CE17, the Himalayan glacier collapse. Each movie says
in one plain sentence which kind of event it is, and the end card points to the other.

### D2. CE16: Cyclone Ditwah, the Sri Lanka floods and landslides (late Nov 2025)
- **Facts to verify first.** The research scout must confirm and cite these before any narration: dates, track,
  landfall, peak intensity, district totals, and the death toll. The death toll is **about 607 according to the
  coordinator's note; it is not yet verified**. Sources: Sri Lanka **Disaster Management Centre** situation reports,
  **UN OCHA** sitreps on ReliefWeb, IFRC.
- **Arc:**
  1. the hook: a map of Sri Lanka lighting up with rain totals;
  2. the storm (track, intensity, rain rates);
  3. the setting (the northeast monsoon, the central highlands, orographic lift, wet antecedent soils);
  4. **our own damage mapping**, step by step with the CE15 method;
  5. our estimate by district;
  6. checked against the reported figures;
  7. what helped and what failed (warnings, cited);
  8. the recap.
- **Meteorology data:**
  - **IBTrACS NI** (public domain; v04r01 weekly, now final or provisional);
  - **GPM IMERG Final** (NASA, open; Earthdata; Final for Nov 2025 should exist by now, verify) for rain totals and
    peak rates;
  - **ERA5** (CC BY 4.0) for TCWV, IVT, 850-hPa wind and soil moisture;
  - **Himawari-9** (NOAA AWS, open) for the IR loop;
  - ISD/GSOD Sri Lankan stations (WMO Res. 40);
  - **NASA LHASA** landslide nowcast and the Global Landslide Catalog (open) as a cross-check.
- **Damage-mapping data (all via STAC or Earth Engine, map-toolkit recipes):**
  - **Sentinel-1 GRD/RTC** for before/after flood extent (Copernicus open; Planetary Computer ✓ probed, or ASF);
  - **Sentinel-2 L2A** for NDVI and brightness change and landslide scars (Copernicus open; Planetary Computer ✓ /
    Element84 Earth Search ✓ probed);
  - **Landsat C2 L2** as a cloud fallback (USGS, public domain; Planetary Computer ✓);
  - **Copernicus GLO-30 DEM** for slope (free with attribution; Planetary Computer ✓);
  - **ESA WorldCover 10 m** for cropland (CC BY 4.0; Planetary Computer ✓);
  - building footprints from **Microsoft** (ODbL; Planetary Computer ✓), **Google Open Buildings v3** (CC BY 4.0 /
    ODbL; GEE) and **OSM** (ODbL; Geofabrik);
  - **OSM roads** (ODbL);
  - population from **WorldPop** (CC BY 4.0) and **GHSL** (CC BY 4.0);
  - **district boundaries** from **geoBoundaries** (CC BY 4.0) or the OCHA COD on HDX (check the licence).
- **Cross-checks:**
  - the **Copernicus EMS rapid mapping** activation for Sri Lanka, if one exists. The public API needs the activation
    code, so the scout finds the EMSR number on the CEMS site;
  - **UNOSAT** products (HDX);
  - Sentinel Asia (JAXA) maps, if published.
- **Our estimate:** buildings, people, cropland (ha) and roads (km) inside the flood and landslide footprints, by
  district. This uses new tested functions:
  - `fluidpy.diag.rs.{sar_change_flood, ndvi_change, slope_from_dem}`;
  - `fluidpy.diag.exposure.zonal_counts`.

  The estimate is set side by side with DMC and OCHA, with honest error sources: SAR misses floods under trees and in
  towns; clouds hide Sentinel-2.
- **§5b and pictures:**
  - a house globe zooming to Sri Lanka with the IMERG total, then back out;
  - before/after swipes (SAR, then Sentinel-2);
  - **3-D terrain flyovers** of the worst landslide districts (GLO-30, vertical exaggeration said aloud);
  - district choropleths beside the reported numbers;
  - a timeline from the storm to the warnings to the peak to the reports.

  Colour bars sit beside the maps, and source lines (with the "data as of" date) sit below.

### D3. CE17: the Himalayan glacier collapse and glacial-lake outburst flood, 28 Aug 2026 (Tibet → Nepal)
- **Facts to verify first.** This event is reported in the coordinator's note and is **after the director's knowledge**.
  The scout must confirm with citations:
  - the location (glacier, lake, Tibetan catchment);
  - the date and time;
  - the river path (Bhotekoshi/Sunkoshi and/or Trishuli);
  - the damage and casualties.

  Sources: Nepal **DRR portal** and the Department of Hydrology and Meteorology (DHM), **ICIMOD** rapid assessments,
  OCHA/ReliefWeb, and peer-reviewed or preprint analyses if they exist.
- **Arc:**
  1. the hook: before/after imagery of the source;
  2. glaciers and glacial lakes 101 (defined from zero, with glossary entries);
  3. what failed (ice collapse or moraine breach; worded to the evidence);
  4. the flood's path down the DEM (our flow routing and run-out);
  5. the damage downstream (our map);
  6. the warming trend in the Himalaya;
  7. the past GLOFs;
  8. the recap.
- **Data:**
  - **Sentinel-2 L2A** and **Landsat 8/9 C2** before and after (open; Planetary Computer / Earth Search);
  - **Sentinel-1** through cloud (open);
  - the **Copernicus GLO-30 DEM** (free with attribution), plus NASADEM (public domain) and ALOS AW3D30 (JAXA, free
    with registration, verify) for runout;
  - **glacier inventories:** **RGI 7.0** (CC BY 4.0; NSIDC) and GLIMS;
  - **glacial lakes:** **ICIMOD** glacial-lake inventories (open with credit, verify the licence) and published HMA lake
    datasets (Zenodo, CC BY 4.0);
  - **glacier mass change:** Hugonnet et al. 2021 (open);
  - the **warming trend** from ERA5 (CC BY 4.0) and the ICIMOD HKH Assessment (cited);
  - river levels from Nepal DHM (web; no open archive API: gap);
  - buildings, roads, population and admin as in CE16.
- **Past GLOFs:** the scout verifies each:
  - Humla 2025 (coordinator's note);
  - **Thame, Khumbu, 16 Aug 2024**;
  - the **Bhotekoshi, July 2016** (Gongbatongshacuo);
  - **South Lhonak, Sikkim, Oct 2023**;
  - the 2021 Melamchi debris flow, as a contrast.
- **New tested functions:** `fluidpy.diag.terrain.{flow_path_d8, runout_reach_angle}` and
  `fluidpy.diag.rs.lake_area_change`.
- **§5b and pictures:**
  - a globe zoom from the Tibetan Plateau to the source, with its surroundings named (the Himalayan crest, the Nepal
    border), then back out;
  - before/after swipes of the lake and the glacier;
  - a **3-D DEM flyover down the flood path**;
  - a damage map by village or municipality;
  - a GLOF timeline map of the Himalaya.

---

## Part C · The whole v3 list, in order
Status words:
- **done**: finalised (some have §5b retro-fits pending, see RESUME.md);
- **in progress**: being built or paused mid-fix;
- **planned (storyboard)**: a storyboard already exists;
- **planned**: not started.

| # | Title | Stage | Status | Prereqs | v2 # | Folder |
|---|---|---|---|---|---|---|
| 0.1 | Dot product (v6) | 0 | done | — | 0.1 | ch00_dot_product_why |
| 0.1b | Dot product, new version | 0 | done (§5b retro-fit pending) | — | 0.1b | ch00_dot_product_v01b |
| 0.2 | Cross product (full) | 0 | done (§5b retro-fit pending) | 0.1 | 0.2 | ch00_cross_product_why |
| 0.3 | Weather basics | 0 | done; UF2 revision in progress | — | 0.3 | ch00_weather_basics |
| 1a | Vectors and index notation | 1 Maths essentials | done (§5b retro-fit pending) | 0.1 | 1a | ch00_vectors_index_notation |
| 1b | The alternating tensor and triple products | 1 | planned (storyboard) | 1a | 1b | ch00_alternating_tensor_triple_products |
| 2 | The cross product (Part 1) | 1 | done | 1a | 2 | ch00_cross_product |
| 3 | The cross product in physics (Part 2) | 1 | done (§5b retro-fit pending) | 2 | 3 | ch00_cross_product_uses |
| 4 | Derivatives and Taylor series | 1 | in progress (paused, fix loop 1) | 1a | 4 | ch00_derivatives_taylor |
| 5 | Coordinates: plane, cylinder, sphere | 1 | planned (storyboard) | 1a, 2, 4 | 5 | ch00_coordinates |
| 6 | The gradient | 1 | planned (storyboard) | 4, 5, 0.1b | 6 | ch00_gradient |
| M01 | Contour maps and isolines | 2 Map reading | planned | 5, 6, 0.3 | 6A | new |
| M02 | How weather maps are made | 2 | planned | M01 | 6B | new |
| M03 | Why the wind blows along the isobars (Coriolis + geostrophic, first look) | 2 | planned | 2, 3, 5, 6 | — (new) | new |
| M04 | Fronts and cyclones: a first look | 2 | planned | 0.3, M01, M03 | — (new; light part of 40/42) | new |
| M05 | Reading the surface chart | 2 | planned (scenes in #69 v3) | M01–M04 | 69 (part) | new, from ch00_reading_weather_maps |
| M06 | Station plots: METAR, SYNOP, station model | 2 | planned (scenes in #69 v3) | M05 | 69 (part) | new, from #69 |
| M07 | Pressure as a vertical coordinate | 2 | planned | 0.3, M01 | 23A | new |
| M08 | Geopotential: the height of a pressure surface, and how forecasters read it | 2 | planned | 4, 6, M01, M03, M07 | 23B (+ thickness half of 32) | new |
| M09 | The standard pressure levels | 2 | planned | M07, M08 | 23C | new |
| M10 | Reading upper-air charts | 2 | planned (scenes in #69 v3) | M05, M08, M09, 0.1b | 69 (part) | new, from #69 |
| M11 | Cross-sections and Hovmöller diagrams | 2 | planned | M04, M08–M10 | 23D | new |
| M12 | Rising air: first law, θ, lapse rates, parcel stability | 2 | planned | 4, 0.3, M07 | 24 (+ parcel part of 25) | new |
| M13 | Water in the air: humidity, CC, LCL, CAPE/CIN, rain | 2 | planned | M12 | 26 | new |
| M14 | The skew-T log-P diagram, in full | 2 | planned | M12, M13 | 27 (+ #69 s55–s56) | new |
| M15 | Clouds and cloud types | 2 | planned | M12, M13 | 28 | new |
| M16 | The climate machine (+ satellite channels' physics) | 2 | planned | 4, 0.3 | 22 | ch00_climate_machine (name from v1 list) |
| M17 | Reading satellite images | 2 | planned (scenes in #69 v3) | M04, M15, M16 | 69 (part) | new, from #69 |
| M18 | Reading weather radar (incl. Doppler basics) | 2 | planned (scenes in #69 v3) | 4, 5, M13 | 69 (part) | new, from #69 |
| M19 | Forecast charts, models and ensembles | 2 | planned (scenes in #69 v3) | M02, M05, M10 | 69 (part) | new, from #69 |
| M20 | Reading weather maps: one storm through every chart | 2 | planned (storyboard v3, to be cut down) | M01–M19 | 69 | **ch00_reading_weather_maps** |
| T01 | Divergence, flux and Gauss's theorem | 3 Maths for dynamics | planned | 6 | 7 | |
| T02 | Curl, circulation and Stokes's theorem | 3 | planned | 6, 2 | 8 | |
| T03 | The Laplacian; Laplace and Poisson equations | 3 | planned | T01 | 9 | |
| T04 | The material derivative | 3 | planned | 4, 0.1b, T01 | 10 | |
| T05 | Vector identities I | 3 | planned | T01, T02 | 10A | |
| T06 | Vector identities II: the advection term | 3 | planned | T04, T05 | 10B | |
| T07 | Potentials and the stream function | 3 | planned | T01–T03 | 17 | |
| T08 | Tensors made easy | 3 | planned | 1a, 1b, T05 | 11 | |
| T09 | Dimensional analysis, scaling and similarity | 3 | planned | 4 | 12 | |
| T10 | Ordinary differential equations | 3 | planned | 4 | 13 | |
| T11 | Statistics of fields | 3 | planned | M08 (anomaly), M19 | 21 | |
| R01 | Circular motion: centripetal and centrifugal | 4 Rotation | planned | 5, 1b | 28B | |
| R02 | The Coriolis effect, in full | 4 | planned | 1b, 3, 5, R01, M03 | 29 | ch00_coriolis (v1 name) |
| R03 | Centripetal vs centrifugal vs Coriolis | 4 | planned | R01, R02, T09 | 29B | |
| R04 | From F = ma to the equation of motion | 4 | planned | T04–T06, T09, R02 | 29A | |
| R05 | Geostrophic and ageostrophic wind; gradient, cyclostrophic, inertial | 4 | planned | R04, M03, T10 | 30 | |
| R06 | Friction and Ekman layers | 4 | planned | R05, T10 | 31 | |
| R07 | The thermal wind | 4 | planned | R05, M08 | 32 (thermal-wind half) | |
| R08 | Barotropic vs baroclinic | 4 | planned | R07 | 33 | |
| R09 | Vorticity, circulation and potential vorticity | 4 | planned | T02, R05, M12 | 34 | |
| R10 | Isentropic surfaces, isentropic and PV maps | 4 | planned | R09, M12 | 24A | |
| R11 | Divergence and vertical motion (QG intuition) | 4 | planned | T01, R09 | 35 | |
| R12 | Geostrophic adjustment and the Rossby radius | 4 | planned | R05, T10 | 36 | |
| W01 | Partial differential equations | 5 Waves | planned | T03, T10 | 14 | |
| W02 | Fourier series, transforms and spectra | 5 | planned | W01 | 15 | |
| W03 | Waves: phase, dispersion, group velocity | 5 | planned | W02 | 16 | |
| W04 | Buoyancy oscillations, N, and static stability in full | 5 | planned | M12, T10 | 25 (N half) | |
| W05 | Gravity waves and mountain waves | 5 | planned | W03, W04 | 37 | |
| W06 | Rossby waves and blocking | 5 | planned | W03, R09 | 38 | |
| W07 | Equatorial waves and the MJO | 5 | planned | W06, W05 | 39 | |
| S01 | **The jet stream** | 6 Weather systems | planned | R07, W06, M08, M10 | — (new; jet half of 43) | new |
| S02 | Stability and eigenvalue problems | 6 | planned | T10, W03 | 20 | |
| S03 | Air masses and fronts in depth; frontogenesis | 6 | planned | M04, R07, T05 | 40 | |
| S04 | Baroclinic (and barotropic) instability | 6 | planned | S01, S02, R08 | 41 | |
| S05 | Extratropical cyclones | 6 | planned | S03, S04, R11 | 42 | |
| S06 | Storm tracks | 6 | planned | S04, S05, T11 | 43 (renamed) | |
| S07 | Thunderstorms, severe weather and tornadoes | 6 | planned | M14, R07, R01 | 44 | |
| S08 | Tropical cyclones | 6 | planned | R05, R06, M13, R01 | 45 | |
| S09 | Monsoons | 6 | planned | M16, S08, W07 | 46 | |
| S10 | The boundary layer and turbulence | 6 | planned | R06, T08, W04 | 47 | |
| G01 | The general circulation | 7 Global atmosphere | planned | S06, R06 | 48 | |
| G02 | The stratosphere: ozone, Brewer–Dobson, QBO | 7 | planned | M16, W07 | 49 (vortex moved out) | |
| G03 | **The polar vortex** | 7 | planned | G02, S01, W06 | — (new; vortex part of 49) | new |
| G04 | Water vapour and the tropics | 7 | planned | M13, G01 | 50 | |
| F01 | How a forecast is made today | 8 Forecasting | planned | M19, T11, S05, S08 | new | |
| F02 | Signals I: pressure falls, vorticity and PV anomalies | 8 | planned | R09–R11, M10 | new | |
| F03 | Signals II: jet streaks and divergence aloft | 8 | planned | S01, R11 | new | |
| F04 | Signals III: moisture, PW, IVT, atmospheric rivers | 8 | planned | M13, M17, T11 | new | |
| F05 | Forecasting extratropical and bomb cyclones | 8 | planned | F02–F04, S05 | new | |
| F06 | Severe-storm ingredients | 8 | planned | M14, R07, S07 | new | |
| F07 | Storm types on radar and satellite | 8 | planned | F06, M17, M18 | new | |
| F08 | Tornadoes on radar | 8 | planned | F07 | new | |
| F09 | Hail, downbursts and lightning | 8 | planned | F07, F08 | new | |
| F10 | Outlooks, watches and warnings | 8 | planned | F06–F09 | new | |
| F11 | Nor'westers and South Asian pre-monsoon storms | 8 | planned | F06, F07, S09 | new | |
| F12 | Nowcasting: the next two hours | 8 | planned | M18, F07, T11 | new | |
| F13 | Tropical-cyclone genesis: the signals | 8 | planned | S08, W07, F04 | new | |
| F14 | Reading a TC on satellite: Dvorak and microwave | 8 | planned | M17, S08 | new | |
| F15 | Tropical cyclones on radar | 8 | planned | M18, F14 | new | |
| F16 | Rapid intensification and intensity forecasting | 8 | planned | F13–F15 | new | |
| F17 | Steering and track forecasting | 8 | planned | W06, G01, S08 | new | |
| F18 | Ensemble tracks, the cone and model guidance | 8 | planned | F17, M19, T11 | new | |
| F19 | Storm surge | 8 | planned | F17, M08 | new | |
| F20 | Heavy rain I: TC rain and stalled storms | 8 | planned | F15, F17, M13 | new | |
| F21 | Heavy rain II: atmospheric rivers and orographic rain | 8 | planned | F04, M13 | new | |
| F22 | Heavy rain III: training convection and flash floods | 8 | planned | F07, F12 | new | |
| F23 | Monsoon depressions and monsoon floods | 8 | planned | S09, F04, F13 | new | |
| F24 | Winter storms: blizzards, nor'easters, lake-effect, freezing rain | 8 | planned | M08, M14, F05 | new | |
| F25 | Fog and dust storms | 8 | planned | M13, M17, F07 | new | |
| F26 | Heatwaves and heat domes | 8 | planned | M08, S01, M13 | new | |
| F27 | Warnings and impacts: from forecast to action | 8 | planned | F17–F19 | new | |
| F28 | Forecasting a Bay of Bengal cyclone end to end (capstone) | 8 | planned | F01–F27 | new | |
| A01 | Complex variables and conformal mapping | 9 Advanced maths | planned | W02 | 18 | |
| A02 | Perturbation methods | 9 | planned | T10, W01 | 19 | |
| O01 | Seawater: equation of state and pressure with depth | 10 Ocean | planned | 0.3, M07 | 23 (ocean half) | |
| O02 | The upper ocean | 10 | planned | O01 | 51 | |
| O03 | Wind-driven gyres: Sverdrup and western intensification | 10 | planned | R06, R09, A02 | 52 | |
| O04 | Great currents I: Gulf Stream and Kuroshio | 10 | planned | O03 | 53 | |
| O05 | Great currents II: Agulhas, Brazil–Malvinas, East Australian | 10 | planned | O03 | 54 | |
| O06 | Great currents III: eastern boundaries and upwelling | 10 | planned | R06, O03 | 55 | |
| O07 | Equatorial currents, the undercurrent, the Somali current | 10 | planned | W07, S09 | 56 | |
| O08 | The Antarctic Circumpolar Current | 10 | planned | O03 | 57 | |
| O09 | The overturning circulation, AMOC | 10 | planned | O02, O08 | 58 | |
| O10 | Ocean eddies and mesoscale turbulence | 10 | planned | S04, S10 | 59 | |
| O11 | Surface waves, tsunamis and tides | 10 | planned | W03 | 60 | |
| O12 | Sea level and sea ice | 10 | planned | O02, O09 | 61 | |
| CV01 | ENSO | 11 Climate variability and change | planned | O07, W07, T11 | 62 | ch00_enso (v1 name) |
| CV02 | Indian Ocean Dipole | 11 | planned | CV01 | 63 | |
| CV03 | PDO and AMO | 11 | planned | CV01 | 64 | |
| CV04 | NAO and the Arctic Oscillation | 11 | planned | S06, G03 | 65 | |
| CV05 | Southern Annular Mode | 11 | planned | CV04 | 66 | |
| CV06 | Climate change: forcing, feedbacks, observed warming | 11 | planned | M16 | 67 | |
| CV07 | Extremes: heatwaves, droughts, floods (the climate view; the forecasting view is F19–F26) | 11 | planned | CV06, F26 | 68 | |
| CE01 | Where is the polar vortex now, and how do we measure it? | 12 Current events | planned | G03, T11, M08 | new | |
| CE02 | How a weak vortex reaches the ground: this winter's US cold outbreaks | 12 | planned | CE01, CV04 | new | |
| CE03 | The record: past SSWs, US cold outbreaks and the science debate | 12 | planned | CE01, CE02, CV06 | new | |
| CE04 | El Niño 2026: how big is it, and could it be the biggest on record? | 12 | planned | CV01, T11, M17 | new | |
| CE05 | El Niño 2026 impacts I: rain, drought, fire, vegetation | 12 | planned | CE04 | new | |
| CE06 | El Niño 2026 impacts II: food, fisheries, coral, health | 12 | planned | CE05 | new | |
| CE07 | The latest hurricane season round the USA, warm oceans and El Niño | 12 | planned | F13–F18, CE04, CV06 | new | |
| CE08 | Record-warm years 2023–2026 | 12 | planned | CV06, CE04 | new | |
| CE09 | The latest marine heatwaves | 12 | planned | O02, CV06 | new | |
| CE10 | The Arctic sea-ice minimum, 2026 | 12 | planned | O12, CV06 | new | |
| CE11 | The 2026 South Asian monsoon and Bangladesh floods | 12 | planned | S09, F23, CE15 | new | |
| CE12 | Bay of Bengal cyclone season review, 2026 | 12 | planned | F13–F19, F27 | new | |
| CE13 | The California atmospheric-river season | 12 | planned | F04, F21 | new | |
| CE14 | Europe's summer 2026 heat | 12 | planned | F26, CE08 | new | |
| CE15 | Mapping a disaster from space (method; Derna 2023) | 12 | planned | M01, M02, M17, M18, 5, 6 | new | |
| CE16 | Cyclone Ditwah: the Sri Lanka floods and landslides (Nov 2025) | 12 | planned | CE15, S08, F20, F21, M17 | new | |
| CE17 | The 2026 Himalayan glacier collapse and outburst flood (Tibet → Nepal) | 12 | planned | CE15, CE16, F22, CV06 | new | |

Count by stage:

| Stage | Movies |
|---|---|
| 0–1 | 11 |
| M | 20 |
| T | 11 |
| R | 12 |
| W | 7 |
| S | 10 |
| G | 4 |
| F | 28 |
| A | 2 |
| O | 12 |
| CV | 7 |
| CE | 17 |
| **Total** | **141** |

v2 had 86 numbered rows. The difference:
- +2 first looks (M03, M04);
- +6 from splitting #69 into 7;
- +2 dedicated movies (S01 jet stream, G03 polar vortex);
- +28 forecasting movies;
- +17 current-events movies.

### C1. Dedicated movie specs: the jet stream and the polar vortex
**S01 · The jet stream** (35–45 min). *Prereqs:* R07 thermal wind, W06 Rossby waves and blocking, M08, M10.
- **Scope:**
  1. what a jet is (a narrow river of fast air near the tropopause);
  2. why it exists: thermal wind from the equator-to-pole temperature contrast (R07), plus angular momentum for the
     subtropical jet (pointer to G01);
  3. the polar-front jet vs the subtropical jet, and the jet in each season;
  4. jet streaks and isotachs (entrance and exit, pointer to F03);
  5. waviness, Rossby waves on the jet, and blocking (omega, Rex);
  6. the link to storms (storms form under the jet's exit regions and steer along it; eddies feed the jet, pointer to
     S06);
  7. the jet and flights: the record transatlantic crossing during Storm Ciara, Feb 2020 (cited);
  8. the southern hemisphere jet.
- **Real data (ERA5 250 hPa):**
  - the Ciara jet, 8–9 Feb 2020;
  - the 2010 Russian blocking summer;
  - the January climatology with the subtropical jet over the Himalaya;
  - a southern-hemisphere winter day.
- **§5b:**
  - a globe with animated 250-hPa streaks (house globe), zoomed onto the North Atlantic jet streak and back out;
  - a **layer stack of wind speed at 850/500/300/250/200/100 hPa** over the Atlantic, showing the jet core forming
    with height (Feb 2020);
  - a cross-section cut from the globe.

**G03 · The polar vortex** (35–45 min). *Prereqs:* G02 stratosphere, S01 jet stream, W06 Rossby waves.
- **Scope:**
  1. two different vortices: the **stratospheric** polar vortex (winter, 10–50 hPa, ringed by the polar-night jet) vs
     the **tropospheric** polar vortex/circumpolar westerlies; why the media mix them up;
  2. why the vortex forms: no sunlight, so radiative cooling of the polar stratosphere;
  3. sudden stratospheric warmings: upward Rossby waves break, the 10-hPa winds at 60° N reverse, and the stratosphere
     warms by tens of degrees in days;
  4. displaced vs split vortex;
  5. downward influence over weeks, to a negative NAO and cold-air outbreaks (with honest uncertainty);
  6. the southern vortex and the ozone hole (pointer to G02).
- **Real data:**
  - **winter 2025–26 NCEP R1 10-hPa height and wind (on G:, ends 2026-03-17)**: read it first and say what it shows;
  - ERA5 for the **Jan 2019 split** and the late-Jan 2019 US Midwest cold;
  - the **Jan 2021 SSW** and the **Feb 2021 Texas outbreak** (ERA5, ISD, cited ERCOT impacts);
  - the 60° N 10-hPa zonal-mean wind time series for many winters.
- **§5b:**
  - a polar globe view with the 10-hPa vortex as a coloured cap (colour bar beside), splitting in time;
  - a **layer stack of geopotential height at 10/30/50/100/250/500 hPa** over the pole during the Jan 2019 split,
    showing it descend; fly up through the stack.
  - This differs from M08's stack: other levels, place and date.

---

## What changed vs v2 (and why)
1. **Map reading moves from Stage 9 to Stage 2** (user request 1). The block M01–M20 comes right after the maths
   essentials, so charts appear in the series' first ~30 movies instead of its last.
2. **#69 is split into seven movies** (M05, M06, M10, M17, M18, M19, M20). One 55-min synthesis covered six different
   skills. Each skill now gets its own movie at the point where its concepts have just been taught. The measured scenes
   are reused, and M20 keeps the folder and the capstone role.
3. **Two new first-look movies** (M03 Coriolis + geostrophic, M04 fronts and cyclones). A chart cannot be read honestly
   without them. The long derivation movies (R02, R05, S03, S05) still come where the maths allows.
4. **v2 6A, 6B, 23A–D, 24, 26, 27, 28 and 22 move into the map block.** They are concept movies at first-year level.
5. **Geopotential is a full 30–40-min movie** (M08, user request 6). It absorbs the thickness and hypsometric half of
   v2 #32. The thermal-wind half stays in R07.
6. **v2 #25 is split.** Parcel stability goes into M12, because the skew-T needs it. N, the buoyancy oscillation, goes
   to W04 after ODEs, because it needs the oscillator.
7. **v2 #23's seawater half moves to the ocean stage (O01).** 0.3 already derived hydrostatic balance for air.
8. **The heavy maths moves later, each item just before it is needed:**
   - T01–T11 before rotation (the equation of motion needs the material derivative, identities and scaling; T11
     statistics comes before the forecasting ensembles);
   - W01–W03 before the waves;
   - S02 eigenvalues before baroclinic instability;
   - A01–A02 (complex variables, perturbation) before the ocean, where western boundary layers need singular
     perturbation.
9. **The jet stream and the polar vortex get dedicated movies** (S01, G03; user request 4). S01 sits before baroclinic
   instability and cyclones, so the cyclone and forecasting movies can use it. v2 #43 becomes S06 "Storm tracks", and
   v2 #49 becomes G02 "ozone, Brewer–Dobson, QBO".
10. **Weather systems (S) now come before the global atmosphere (G)**, because the jet and cyclones feed the general
    circulation's eddy story. **Forecasting (F) comes after G**, because track forecasting needs the subtropical ridge
    (G01) and polar-vortex outbreaks feed F24/F26.
11. **New forecasting series F01–F28** (user requests 2, 3, 5): cyclones, heavy rain, severe weather, signals on maps,
    radar and satellite, track, intensity, surge, warnings and a capstone. Its cases are 7 Bay of Bengal storms and
    4 US hurricanes, and each case teaches a different thing.
12. **v2 #68 Extremes stays in climate variability** as the climate-change view, and it points to the forecasting
    movies.
13. **New Stage 12, current events and analysis (CE01–CE17)** (user request 7). It covers the latest data, history
    and the literature, with a binding refresh-before-build rule. It adds a method movie (CE15) so that the damage maps
    in CE11, CE16 and CE17 use only what has been taught.

## Data gaps and decisions for the orchestrator/user
1. **No open ground-radar archive for Bangladesh, India or Myanmar.** The BMD and IMD sites show current images only;
   IMD's radar page loads but has no archive. Substitutes:
   - GPM DPR (2014+) and TRMM PR (1997–2015) overpasses through NASA Earthdata (account exists); for each case the
     scout checks whether an overpass caught the storm core;
   - IMERG for rain.

   The F11, F15, F19 and F28 narration says this gap plainly.
2. **Meteosat-7 IODC images for Sidr, Nargis and Aila** need a free EUMETSAT Data Store account. Meanwhile there are
   open substitutes, both probed:
   - GridSat-B1 (0.07°, 3-hourly IR);
   - HURSAT-B1 v06.

   MODIS via GIBS adds daytime true colour. *Ask the user* whether to register at EUMETSAT. The same account would
   also open Meteosat for Valencia 2024 and MTG lightning over Europe and Africa.
3. **TIGGE (2006+) needs a free ECMWF account** (accept the TIGGE terms). The TIGGE cyclone-track files at NCAR RDA
   ds330.3 need a free RDA account; the probe timed out, so this is to verify. **Katrina 2005 predates TIGGE.** Its
   model guidance comes only from the NHC ATCF a-deck (probed, open).
4. **GFS before 2021 is not on AWS.** Use NCAR RDA ds084.1 (0.25°, 2015+, free account) for Harvey, Fani, Amphan and
   Hagibis. NCEI holds older GFS (to verify).
5. **ECMWF open data starts in 2023** (0.4° beta until early 2024). It covers Mocha, Ciarán, Remal, Helene and Valencia
   (probed). The ENS/HRES **tropical-cyclone track BUFR (`tf`) exists** (probed 2024-05-25). It needs a BUFR decoder:
   `eccodes` is already proposed in the #69 decision G2, and `pdbufr` or eccodes-python would read it.
6. **No open lightning data over South Asia.** GLM covers only the Americas (probed on AWS). ISS-LIS (2017–2023, GHRC
   via Earthdata) is sparse. F11 says so.
7. **There are no openly archived Bangladesh tide-gauge records for Sidr and Aila** (UHSLC and the IOC sea-level
   facility to check). Surge heights come from cited post-event surveys. A new tested
   `fluidpy.geo.surge.{wind_setup, inverse_barometer}` will compute the teaching numbers. US surge uses COOPS (Ian, on
   G:) and USGS high-water marks (Katrina; the STN API redirected, to verify).
8. **Harvey rain:** MRMS on AWS starts in Oct 2020. For Harvey use NCEP Stage IV (NCAR EOL, open, to verify) or IMERG.
9. **AEMET (Valencia) and JMA (Hagibis) radar archives are not open.** Use IMERG plus cited gauge totals.
10. **NCEP R1 ended 2026-03-17.** G03 uses R1 for winter 2025–26 (on G:) and ERA5 for anything later.
11. **Impact numbers (deaths, losses, evacuations)** come only from cited sources: EM-DAT (free registration), BMD/IMD
    reports, NOAA NCEI billion-dollar list, WMO. None is quoted in this plan; each is a CHECK row at storyboard time.
12. **New library work implied** (the implementer writes it with tests, the data-scout writes the fetchers):
    - `fluidpy.data.{nexrad_l2, mrms, glm, imerg, gridsat, himawari_aws, spc, iem_warnings, ecmwf_tc_bufr, atcf}`;
    - `fluidpy.diag.{ivt, shear_helicity, nowcast_extrapolate, tc_steering, bomb_rate}`;
    - `fluidpy.geo.{surge, atmos.geopotential_from_height, atmos.wet_bulb}`;
    - `diag.radar` extensions (radial velocity, couplet ΔV).
13. **Order decision for the user:** M16 (climate machine) sits just before the satellite movie, not at the start of
    the block. *Recommended*, because it then gives the IR physics exactly where it is used.
14. **Folder decision:** M20 keeps `ch00_reading_weather_maps`. M05, M06, M10, M17, M18 and M19 get new folders whose
    storyboards are cut from the #69 v3 storyboard. Proposed slugs: `ch00_reading_surface_charts`,
    `ch00_station_plots`, `ch00_reading_upper_air_charts`, `ch00_reading_satellite_images`,
    `ch00_reading_weather_radar`, `ch00_forecast_charts_ensembles`. *Recommended.*
15. **CE data gaps:**
    - the ReliefWeb API needs an *approved appname* (probe: 403), so OCHA sitreps are read on the web and cited;
    - the Copernicus EMS public API needs the activation code, so the scout looks up the EMSR number;
    - there are no open archive APIs for Bangladesh FFWC or Nepal DHM river levels;
    - CMEMS altimetry is still not set up (NASA PO.DAAC SSH is used instead);
    - HadISST and E-OBS are non-commercial, which fits these unmonetised movies;
    - **the CE16 death toll (about 607) and every CE17 fact are coordinator-reported and must be verified by the
      research scout before any narration**. The CE17 event is after the director's knowledge.
16. **CE scheduling:** CE04–CE06 (El Niño, now at ONI +2.16) and CE01–CE02 (the coming winter) are time-sensitive.
    *Recommended:* allow them to jump the queue once their prerequisites are done. If the user wants them sooner, a
    shorter stand-alone version can re-explain its prerequisites inline.

## Adopted (orchestrator, 2026-10-29, under the user's "go with your recommendation")
v3 replaces v2 as the series order. The finished and in-progress movies keep their place: 0.1, 0.1b, 0.2 and Parts 1 and 2, 0.3, #1a, #4. Then: #1b, #5, #6, then the map-reading block M01–M20, and the rest in v3 order.
- The planner's recommendations are accepted: the climate machine goes just before the satellite movie (M16); the slugs for the #69 split folders are as proposed; CE01–CE02 and CE04–CE06 may jump the queue once their prerequisites are done.
- Free accounts (EUMETSAT, ECMWF for TIGGE, NCAR RDA): **the user must open these**. Until then, use the open substitutes (GridSat-B1, HURSAT, the NHC ATCF archive).
- Before narration, a research scout must verify every fact about Ditwah and the 2026 glacier collapse.
