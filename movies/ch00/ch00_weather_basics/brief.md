# ch00_weather_basics — brief (movie-director, 2026-10-27)

Series position: #3 in `movies/ch00/series_plan.md` (after the cross-product movies, before `ch00_reading_weather_maps`).
House style `movies/HOUSE_STYLE.md` is binding (reference `ch00_dot_product_why` v6): s00 opening title + one sentence →
hook question → building blocks → intuition → why → application → "To sum up" recap → series end card. Voice Kokoro
`af_bella` 1.0, informal Chapter-0 voice, no headings except the title, keywords on screen, no references, badges or
URLs, type floor 44 px, captions band empty.

## Audience
First-year calculus, **no climate background**. Nothing is assumed: every word (air parcel, pressure, hectopascal,
density, kelvin, scale height, saturation, relative humidity, dew point, westerly, knot, reanalysis, isobar, high, low,
anticyclone, air mass, front, warm sector, UTC, subtropical high, ITCZ) is defined in plain words the first time it is
said, then used consistently. Symbols (p, ρ, T, R, g, z, Δz, ∂p/∂z, H, p₀, e, u, v, q) are named and given their
units and meaning the moment they appear.

## The promise (s00)
"In this video, we'll learn the basics of weather the easy way, and see how meteorology uses them to follow a real
storm as it passes over one town." Application: Storm Ciarán (1–2 Nov 2023) seen hour by hour at **Brest** — the
pressure falls 35 hPa in 13 h, the warm front (wind SSE → SSW, +2.4 °C) and the cold front (SW → W, 23 m/s = 45 kt,
−2.1 °C) pass, all from ERA5 numbers already on G:.

## What is taught (in order)
| Block | Scenes | Idea | Real data / tested function |
|---|---|---|---|
| The air | s02–s03 | thin shell (12 km vs 6371 km; 0.28 mm on a 30-cm globe, then drawn ×50 — said); composition; molecules; **air parcel** defined | constants; USSA-1976 composition (cited) |
| Pressure | s04–s07 | force ÷ area, equal in all directions, pascal; **pressure = weight of the air above** (10 300 kg per m²); why we are not crushed; hPa, mb, barometer | `statics` |
| Density, temperature, gas law | s08–s12 | ρ (a room holds 60 kg); kelvin; **p = ρRT built from molecules** (more molecules / faster molecules), R = 287; ρ = 1.225 at 15 °C; warm air ~10 % lighter (fronts later) | `thermo.perfect_gas_density` |
| Why pressure falls with height | s13–s20 | slab force balance, one move per line → **∂p/∂z = −ρg (1.51)**; 12 Pa/m, 1 hPa per 8 m; + gas law → ∂p/∂z = −pg/RT; **H = RT/g = 8.4 km** (units checked; equals the uniform-density height p₀/ρ₀g); ln-integration → **p = p₀e^{−z/H}**; e-folding, −11 %/km, halves every 5.8 km; mattress Like/Unlike | `statics.isothermal_pressure`, `geo.atmos.scale_height` |
| The real atmosphere | s21–s26 | radiosonde defined; real Trappes sounding vs the curve (agrees low, colder aloft → smaller H); mass below (50 % / 90 % / 99 % at 5.5 / 16 / 31 km); **troposphere** (−6.5 °C/km), **tropopause**, **stratosphere** (ozone), mesosphere/thermosphere named; Singapore contrast (one thing changed: place); why it is cold aloft (heated from below; expansion cooling ≈ 9.8 °C/km) | IGRA2 soundings; ERA5 column; `standard_atmosphere`; `adiabatic_lapse_rate` |
| Water | s27–s31 | vapour invisible vs cloud drops; specific humidity (0–20 g/kg, real ERA5 globe); vapour pressure (18.12); saturation from evaporation/landing balance; e_s curve (18.28): 6/12/23/42 hPa, doubles per ~10 °C; sponge Like/Unlike; **RH** 48 % worked; **dew point** 13 °C; dew, fog, cloud; cloud base 12 ÷ 8 ≈ 1.5 km, flat bases | NEW `fluidpy.geo.moist` |
| Wind | s32–s35 | vector, u and v, speed by Pythagoras (10 m/s); **from-convention**, degrees clockwise from north seen from above, 233° south-westerly; ocean currents opposite; m/s, km/h, knots (nautical mile = 1′ of latitude); pushed high → low, then turned aside (pointer to Coriolis/geostrophic) | `vectors.norm`; NEW `wind_direction_from`, `KNOT` |
| Weather, climate, data | s36–s38 | weather vs climate (Brest 2023 daily T over its 1991–2020 band); uneven observations (IGRA stations 2023); **reanalysis** (ERA5: model + observations, hourly since 1940, ≈ 30 km), jigsaw Like/Unlike | ERA5 point series; IGRA list |
| Pressure maps | s39–s44 | surface-pressure map dominated by mountains (Tibet < 600 hPa); **reduction to sea level** (835 hPa at 1609 m, 15 °C → 1010 hPa, thought example); MSLP and **isobars** (every 4 hPa); **highs/lows** (Ciarán 956, Azores ≈ 1030); why lows are cloudy and highs clear; real winds circle the low (anticlockwise seen from above, NH; reversed SH), pointer to Coriolis | ERA5 global hour 2023-11-02 12 UTC; MODIS true colour |
| Air masses and fronts | s45–s50 | air masses (polar/tropical × maritime/continental); fronts; cold front (wedge, steep ~1:50–1:100, showers, SW → W/NW); warm front (glides up 1:100–1:200, layered cloud, SE → S/SW); side views ×50 (said); **real fronts round Ciarán** (850 hPa T, objective front lines); map symbols (pointer to the next movie) | ERA5 850 hPa; NEW `fluidpy.diag.fronts` |
| Global preview (short, per the orchestrator's scope note) | s51–s53 | sunlight per m² ∝ cos latitude (1 m vs 2 m patch at 60°); poleward heat transport; **subtropical highs** and **ITCZ** named on the 1991–2020 mean MSLP globe, one or two sentences each; trades and westerlies; pointer to the general-circulation and Coriolis movies | NCEP R1 LTM (exists) |
| Application | s54–s59 | Ciarán 1 Nov afternoon satellite; hourly isobars 12 UTC 1 Nov → 12 UTC 2 Nov (965 → 954 hPa, centre crosses the Channel north of Brest); Brest pressure, warm front, cold front from the hourly ERA5 point; the storm next afternoon; pointers forward | ERA5 hourly (exists); GIBS |
| Recap + end | s60–s61 | "To sum up, …" one beat per sentence; house end card ("a series of related tutorials", "these weather basics") | — |

## Deliberately left to later movies (pointed to, never depended on)
- **Reading weather maps** (#4): projections, isobar reading practice, wind barbs, front symbols in detail, visible vs
  infrared imagery, Buys-Ballot's law. Here: isobars and H/L defined, front symbols named in one sentence.
- **Coriolis** (#5) and **geostrophic wind** (#6): why the wind circles lows (here only observed on real data, with the
  correct sense in each hemisphere) and why winds blow along isobars.
- **Thermal wind** (#7): thickness/hypsometric equation (2.166) beyond the isothermal case, jets.
- **General circulation** (#8): Hadley/Ferrel/polar cells, how the subtropical highs and the ITCZ form, monsoons, jets
  (here: named and defined in one or two sentences on a real mean-MSLP globe).
- **Stability and buoyancy** (#12+): the dry adiabatic lapse rate derived (here quoted as ≈ 9.8 °C per km with a
  plain-words reason), potential temperature, moist adiabats, convection.
- **Ocean, ENSO, climate modes** (#9–#11): not touched.
- The Clausius–Clapeyron formula itself (18.28) is used to draw the curve and compute every number, but not shown on
  screen (open question Q3).

## Length
Set by the teaching. Measured (see `script.md` header). The user's target is about 30 min ("a little more is fine").

## Real dated examples
Storm Ciarán, 1–2 Nov 2023 (ERA5 hourly, MODIS true colour, Natural Earth borders); Trappes and Singapore radiosondes,
12 UTC 1 Nov 2023 (IGRA2); ERA5 global hour 12 UTC 2 Nov 2023; Brest 2023 daily temperature vs 1991–2020; NCEP R1
1991–2020 means. All maps sit on daytime true colour or on shaded relief (never a dark map); night-time hours use the
Blue Marble/relief base, never black.
