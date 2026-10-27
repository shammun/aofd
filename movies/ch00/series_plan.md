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

## The list (in order) — rewritten 2026-10-27 to follow Vallis chapter by chapter
User (2026-10-27): Chapter 0 gets a first-meeting movie for **every major topic of Vallis Ch 1–22, in book order**.
Bridge movies may be added where they help. When a chapter meets the topic again, its own movie links back to the
Chapter 0 movie and adds what Chapter 0 left out. **Real data and real maps throughout.** If a dataset needs an
account we don't have, tell the user exactly how to get it (see "Data access" below) and use an open substitute meanwhile.
Lengths are targets set by the teaching, not quotas (most 25–40 min).

### Part F · Foundations (maths and reading the weather)
| # | Slug | What | Status |
|---|---|---|---|
| F1 | `ch00_dot_product_why` | The dot product, and advection (17:40) | done (v6); publish awaits M10 |
| F2 | `ch00_cross_product_why` | The full cross-product movie, v4 from the user's v2 review (≤ 50 min) | **in progress** |
| F2a | `ch00_cross_product` | Split 1: the cross product only | queued |
| F2b | `ch00_cross_product_uses` | Split 2: the cross product across physics (torque, L, qv × B, Ω × r, Coriolis/geostrophic previews) | queued |
| F3 | `ch00_weather_basics` | Atmosphere layers, pressure, temperature, density, p = ρRT, humidity, wind conventions, highs/lows, air masses, fronts, weather vs climate, reanalysis | **planning** |
| F4 | `ch00_reading_weather_maps` | Lat/lon and projections (coordinates on a sphere), isobars and height contours, wind barbs, fronts, visible/IR satellite images, Buys-Ballot | queued |
| F5 | `ch00_climate_machine` | Energy balance: sunlight in, infrared out, greenhouse effect, equator-to-pole surplus/deficit (CERES) — the engine behind every later movie | queued |
| F6 | `ch00_grad_div_curl` | Gradient, divergence, curl, Gauss and Stokes, on real fields (∇T, ∇p, ITCZ convergence, a storm's vorticity) | queued |

### Part V · Vallis topics in book order (first meeting)
| # | Vallis | Slug | What | Status |
|---|---|---|---|---|
| V1 | Ch 1 | `ch00_riding_with_the_flow` | Material derivative, advection, continuity; a parcel's view vs a fixed observer; drifters and radiosondes | queued |
| V2 | Ch 1 | `ch00_air_and_seawater` | Equations of state: ideal gas; seawater density from T and S; hydrostatic balance with height and depth (Argo, WOA, radiosondes) | queued |
| V3 | Ch 1–2 | `ch00_stability_buoyancy` | Potential temperature, lapse rates, buoyancy, stable vs unstable, N, convection; real soundings | queued |
| V4 | Ch 2 | `ch00_scaling_taylor` | Taylor series, linearisation, scale analysis, the Rossby number (weather vs bathtub) | queued |
| V5 | Ch 2 | `ch00_coriolis` | Coriolis from scratch (30–40 min). **Order (user, 2026-10-27): easy everyday examples and animation FIRST, not maps** (a ball rolled across a merry-go-round seen from outside and by a rider, throwing a ball to a friend on a turntable, a rotating tank, a pendulum). **Then** the spinning Earth in 3-D. **Only then** real maps and real winds. After that the derivations (rotating frame, the 2, the minus, f, β, inertial circles; real drifter loops) | queued |
| V6 | Ch 2, 5 | `ch00_geostrophic_wind` | Geostrophic and ageostrophic wind (30–40 min): balance, k × ∇p, real analyses, where it fails (friction, curvature, equator) | queued |
| V7 | Ch 2 | `ch00_thermal_wind` | Thermal wind (30–40 min): thickness, shear from temperature gradients, jets on real cross-sections and maps | queued |
| V8 | Ch 3 | `ch00_adjustment_rossby_radius` | Shallow-water picture, geostrophic adjustment, the Rossby radius (storms ~1000 km, ocean eddies ~50 km) | queued |
| V9 | Ch 4 | `ch00_vorticity_pv` | Vorticity, circulation, potential vorticity (the spinning skater); real vorticity and PV maps | queued |
| V10 | Ch 5 | `ch00_ekman` | Ekman spiral and transport, coastal upwelling, Ekman pumping, surface winds crossing isobars (real SST, chlorophyll) | queued |
| V11 | Ch 6–7 | `ch00_waves` | Wave basics (phase, group, dispersion), gravity waves: swell, internal waves, mountain-wave clouds on satellite images | queued |
| V12 | Ch 6, 16 | `ch00_rossby_waves` | Rossby waves: why they go west, jet meanders, blocking, stationary waves; 500 hPa maps, Hovmöller diagrams | queued |
| V13 | Ch 8 | `ch00_equatorial_waves` | Why the equator is special; equatorial Kelvin and Rossby waves; MJO preview; OLR and sea-level data | queued |
| V14 | Ch 9 | `ch00_baroclinic_instability` | Why weather systems form; a real storm's life cycle; fronts forming | queued |
| V15 | Ch 11–13 | `ch00_turbulence_eddies` | Turbulence and eddies: cascade, 2-D vs 3-D, ocean eddies from altimetry, eddy heat transport | queued |
| V16 | Ch 14 | `ch00_hadley_ferrel` | Hadley, Ferrel and polar cells; ITCZ; subtropical highs; trades, westerlies, polar easterlies; deserts; seasons | queued |
| V17 | Ch 15 | `ch00_jets_storm_tracks` | Jet streams, storm tracks, eddies driving the westerlies | queued |
| V18 | Ch 17 | `ch00_stratosphere` | Ozone heating, polar vortex, sudden stratospheric warmings, the QBO | queued |
| V19 | Ch 18 | `ch00_water_vapour_tropics` | Water vapour, clouds, convection, ITCZ, monsoons, tropical cyclones, MJO | queued |
| V20 | Ch 19 | `ch00_gyres_boundary_currents` | Wind-driven gyres; western boundary currents (Gulf Stream, Kuroshio, Agulhas, Brazil, East Australian); drifters, altimetry, SST | queued |
| V21 | Ch 20 | `ch00_upper_ocean` | Mixed layer, thermocline, seasonal cycle, mode waters (Argo, WOA) | queued |
| V22 | Ch 21 | `ch00_overturning_acc` | Overturning circulation and the AMOC (RAPID), deep-water formation, the Antarctic Circumpolar Current and its fronts | queued |
| V23 | Ch 22 | `ch00_enso` | ENSO (30–40 min): Walker circulation, thermocline tilt, Bjerknes feedback, indices, latest state, historic comparison, impacts (requirements below) | queued |
| V24 | after Ch 22 | `ch00_climate_modes` | NAO/AO, IOD, MJO, PDO, SAM, QBO: indices, teleconnection maps, latest values (requirements below) | queued |

Order reasoning: F2a/F2b reuse v4 material, so they come cheaply right after it; the rest of Part F gives the tools
every later movie uses; Part V follows Vallis's order, so each movie only needs earlier ones.

### Data access (checked 2026-10-27)
- **Open, no account:** ARCO-ERA5, NOAA PSL/NCEP, OISST, ERSST, CPC indices, WOA23, GDP drifters, RAPID, Argo,
  NASA GIBS, Natural Earth, ETOPO, FU Berlin QBO, BoM indices.
- **Accounts set up:** CDS (ERA5), NASA Earthdata (ECCO, CERES, MERRA-2, AIRS, OSCAR, PO.DAAC altimetry).
- **Missing: Copernicus Marine (CMEMS).** It has the best gridded sea level, currents and ocean reanalysis (DUACS, GLORYS).
  Open substitutes meanwhile: PO.DAAC altimetry, OSCAR, ECCO. To add it, register free at
  https://data.marine.copernicus.eu/register, then run `! .venv\Scripts\python.exe tools/setup_credentials.py marine`.

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
