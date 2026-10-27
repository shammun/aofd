# Chapter 0 movie series: the standing plan (user, 2026-10-27)

**Standing instruction (user, 2026-10-27).** Make the Chapter 0 videos one after another **on a loop, without waiting for
permission**. Videos only for now; notebooks, explainers and pushes come later. **Never push.** For each movie:
brief → director → data → builder → QA → **at least two review rounds**, fixing until PASS → finalize → **cumulative
report** to the user (every movie done so far, with paths) → start the next movie. When the user interrupts with
feedback, fix that first, then resume this list. Keep the user updated while working.

Every movie follows `movies/HOUSE_STYLE.md` (dot-product v6 look, opening, arc, voice, end card), uses three.js 3-D,
real data, real maps (daytime satellite imagery, coastlines and admin boundaries), and derives everything from
scratch in the informal Chapter 0 voice. Any good JS or Python mapping library may be added (e.g. d3-geo,
cartopy/geopandas for pre-rendered layers, Natural Earth, NASA GIBS imagery).

**Disk housekeeping, pre-authorised by the user.** After each movie is finalized: delete junk on C: (render pieces,
frame dumps, review frames, caches) without asking. Anything that might be reused is first copied to
`G:/Geophysical Fluid Dynamics/aofd-data/archive/movies/<slug>/`. Never touch a file the user is watching
(`preview_*.mp4`) until that movie is finalized. Floors still hold (C: 40 GB, G: 50 GB).

## The list (in order)
Lengths are targets set by the teaching, not quotas.

| # | Slug | What | Length | Status |
|---|---|---|---|---|
| 1 | `ch00_dot_product_why` | The dot product, and advection | 17:40 | done (v6, loved 2026-10-25); publish awaits M10 |
| 2 | `ch00_cross_product_why` | The full cross-product movie, v4 from the user's v2 review (`reports/ch00_cross_product_user_notes_v2.md`) | ≤ 50 min (max 52) | **in progress** (v3 render, v4 plan) |
| 2a | `ch00_cross_product` | Split part 1: the cross product only (what, why |a||b| sin θ, perpendicular, area, right-hand rule every way, components) | from v4, ~20–25 min | queued |
| 2b | `ch00_cross_product_uses` | Split part 2: the cross product across disciplines (torque, angular momentum, force on a moving charge, rigid rotation Ω × r, Coriolis and geostrophic previews), each expanded | ~25–35 min | queued |
| 3 | `ch00_weather_basics` | Basic weather and climate words from scratch: atmosphere layers, pressure (hPa), temperature, humidity, density, highs and lows, air masses, fronts, wind, reanalysis, with real data on 3-D globes | ~30 min | queued |
| 4 | `ch00_reading_weather_maps` | How to read maps: latitude/longitude, projections, isobars and height contours, highs/lows, wind barbs and arrows, fronts, satellite imagery (visible/IR), Buys-Ballot, using real dated maps | ~30 min | queued |
| 5 | `ch00_coriolis` | The Coriolis effect from scratch: what it is first on real maps and animation, then real-wind examples, then every derivation (rotating frame, the 2, the minus, Ω × r, f = 2Ω sin φ, β, inertial circles) | 30–40 min | queued |
| 6 | `ch00_geostrophic_wind` | Geostrophic and ageostrophic wind from scratch: pressure gradient, balance, adjustment, k × ∇p geometry, real analyses, where it fails (friction, curvature, equator), ageostrophic = actual − geostrophic, with real data | 30–40 min | queued |
| 7 | `ch00_thermal_wind` | Thermal wind from scratch: thickness, hypsometric idea, wind shear from temperature gradients, jet streams, real cross-sections and maps | 30–40 min | queued |
| 8 | `ch00_general_circulation` | The atmosphere's big flows (user, 2026-10-27): uneven heating; Hadley, Ferrel and polar cells; ITCZ; **subtropical highs** (Azores/Bermuda, Pacific, South Atlantic, Indian Ocean, Mascarene); trades, westerlies, polar easterlies; jet streams and storm tracks; monsoons (South Asian, West African); seasonal shifts. Real reanalysis climatologies on 3-D globes | 30–40 min | queued |
| 9 | `ch00_ocean_circulation` | The ocean's flows: wind-driven gyres, western boundary currents (Gulf Stream, Kuroshio, Agulhas), Antarctic Circumpolar Current, upwelling (coastal and equatorial), thermocline, thermohaline circulation and the AMOC; SST, sea-level and drifter data | 30–40 min | queued |
| 10 | `ch00_enso` | El Niño – Southern Oscillation from scratch: the Walker circulation, trades, thermocline tilt, Bjerknes feedback, El Niño vs La Niña, Niño 3.4 and SOI indices, real events (1997–98, 2015–16, 2023–24), global impacts (teleconnections) | 30–40 min | queued |
| 11 | `ch00_climate_modes` | Other modes of variability: NAO/AO, Indian Ocean Dipole, MJO, PDO, SAM, QBO; what an index and a teleconnection map are; real index time series and composites | 30–40 min | queued |
| 12+ | earlier-approved series (U-CP.6) | grad / div / curl + Gauss and Stokes; the climate machine (energy balance, greenhouse effect, now partly in 8); air and seawater basics; coordinates on a sphere; stability and buoyancy; Taylor series, linearisation and scaling | as needed | queued after 7 |

Order reasoning: 2a/2b reuse v4 material, so they come cheaply right after it; weather basics and map reading come
before Coriolis, geostrophic and thermal wind because those movies read real weather maps.

## Boundary with the chapter movies (2026-10-27)
Vallis treats these topics in depth: Coriolis, geostrophic and thermal wind in Ch 2 and Ch 5; adjustment in Ch 3;
ageostrophic, QG and Ekman in Ch 5, 10 and 21; Hadley cells and subtropical highs in Ch 14–15; gyres in Ch 19;
the MOC and ACC in Ch 21; ENSO in Ch 22.
- **A Chapter 0 movie is the first meeting.** It covers what the thing is, real data and maps, plain-physics why,
  and derivations at first-year-calculus level.
- **The chapter movie gives Vallis's own treatment.** That means the numbered equations, scaling (Ro, Boussinesq,
  pressure coordinates), QG, Ekman, the Hadley models, Sverdrup and Stommel, and the delayed oscillator. It opens with
  a short recap that links back to the Chapter 0 movie.
- Planners must not take chapter-level material into Chapter 0, and chapter movies must not re-teach Chapter 0 at length.

## Extra requirements for #10 ENSO and #11 climate modes (user, 2026-10-27)
- **Latest data, fetched at production time** (not frozen): the newest sea-surface temperature (NOAA OISST v2.1 daily and
  ERSST v5 monthly), the latest SST-anomaly world map and the current ENSO state (NOAA CPC ONI / Niño 3.4, the
  official advisory status, and the BoM/IRI outlook where they are open), plus the latest PDO, NAO, IOD (DMI), MJO
  (RMM), SAM and QBO index values from NOAA PSL/CPC, BoM and FU Berlin.
- **Historic vs recent.** Compare the current event with the big ones (1982–83, 1997–98, 2015–16, 2023–24, and the
  strongest La Niñas): peak ONI and Niño 3.4, duration, spatial extent of the anomaly, and rank tables; for other modes,
  index history with recent years highlighted.
- **Impacts with statistics, from cited sources only.** Deaths, economic losses, rainfall, drought and floods,
  coral bleaching, global temperature bumps, and how the current event compares with past ones. Use published
  datasets and studies only (e.g. EM-DAT, WMO and NOAA assessments, peer-reviewed attribution papers). Say how
  uncertain the death counts are, and never invent a figure; the source of every number goes in the storyboard and manifest.
- **Visuals:**
  - index animations (time series drawing themselves, with El Niño and La Niña shading);
  - animated 3-D globes of SST anomalies through an event (three.js, as in the cross-product movie);
  - static world maps;
  - composites and correlation (teleconnection) maps;
  - bar charts and rank charts.

  All of it is computed by tested `fluidpy.data` / `fluidpy.diag` functions.
- The research phase (research-scout) runs before the director for these movies.

## Cumulative log
| Date | Movie | Version | Length | Size | Reviews | Final path |
|---|---|---|---|---|---|---|
| 2026-10-25 | ch00_dot_product_why | v6 fix 1 | 17:40.6 | 51.27 MB | 6b PASS | movies/out/ch00/ch00_dot_product_why.html |
