# ch00_reading_weather_maps — brief (movie-director, 2026-10-27)

Series position: **F4** in `movies/ch00/series_plan.md` (after `ch00_weather_basics`, before `ch00_climate_machine`).
House style `movies/HOUSE_STYLE.md` is binding (reference `ch00_dot_product_why` v6): s00 opening title + one sentence →
hook question → building blocks → intuition → why → application → "To sum up" recap → the **weather/climate end card**
(§3, word for word, "the notebook for reading weather maps"). Voice Kokoro `af_bella` 1.0, informal Chapter-0 voice,
no headings except the title, keywords on screen, no references, badges or URLs, type floor 44 px, caption band empty.
This movie is *about* reading maps, so every map in it must model publication-grade cartography
(`.claude/skills/cartography/SKILL.md`: §1 pre-flight checklist per map, §2a synoptic rules, §2b imagery rules, §2f
globe rules; labels as billboards on 3-D, never draped).

## Audience and what it already knows
First-year calculus, no climate background. From `ch00_weather_basics` the viewer already has: air parcel, pressure,
hectopascal, density, kelvin, p = ρRT, hydrostatic balance, **scale height H = RT/g**, p = p₀e^(−z/H), "half the air lies
below 5.5 km", troposphere/tropopause and −6.5 °C per km, humidity and dew point, wind as a vector, **the "from"
direction convention, knots and the nautical mile**, weather vs climate, reanalysis (ERA5), sea-level pressure,
**isobars every 4 hPa, highs and lows**, air masses, cold and warm fronts (side views ×50, front symbols named in one
sentence), UTC, Storm Ciarán at Brest. From the cross-product movies: latitude as an angle at the centre, f = 2Ω sin φ,
the geostrophic wind "with the low on its left" (said once there; here it is re-observed as Buys Ballot's rule and not
assumed). Nothing else is assumed: radian, arc length, parallel, meridian, prime meridian, graticule, projection,
conformal, equal-area, Tissot's indicatrix, standard parallel, rhumb line, great circle, trough, ridge, geopotential
height, decametre, wind barb, pennant, METAR, SYNOP, okta, station model, pressure tendency, occluded and stationary
fronts, visible / infrared / water-vapour images, geostationary satellite, brightness temperature, Buys Ballot's rule,
surface analysis — each is defined in plain words at first use.

## The promise (s00)
"In this video, we'll learn to read weather maps the easy way, and see how forecasters use them to follow real storms,
from a satellite picture to a forecaster's chart." Title 'Reading' / 'weather maps', 'made easy', 'and how forecasters
use them' (application word 'forecasters' in teal).

## What is taught (in order; 61 scenes)
| Block | Scenes | Idea | Real data / tested function |
|---|---|---|---|
| Hook | s01 | a real forecaster's chart from the day the movie was made, "like a secret code" | WPC coded surface bulletin 18 UTC 27 Oct 2026 + GFS + GOES-East IR |
| Where is a place | s02–s05 | two angles from the centre; **latitude** (parallels), **longitude** (meridians, Greenwich), signs (+N/−S, +E/−W), 0–360° data sets (GFS), graticule | three.js globe; NEW `fluidpy.geo.sphere` |
| Distances on a sphere | s06–s08 | radians and arc length; **δy = a δφ, δx = a cos φ δλ** (Vallis §2.2.2 increments); 111 / 74 / 56 / 0 km per degree; great circle New York–Tokyo 10 850 km up to 70° N | NEW `sphere.arc_lengths`, `great_circle_*` |
| Flattening the globe | s09–s11 | orange-peel gores (why every flat map distorts); plate carrée = the data grid, stretched by 1/cos φ; **Tissot's indicatrix** | three.js ProjectionMorph (new kit), NEW `fluidpy.geo.mapproj` |
| Mercator | s12–s16 | stretch N–S too → **conformal**; **y = a ln tan(π/4 + φ/2)** as the integral of the stretch, checked by the chain rule; no poles (85° → 3.1a); Greenland vs Africa (×10 area, truly 14× smaller); rhumb line vs great circle (12 800 vs 10 850 km); tropics charts | `mapproj.forward/scale_factors` |
| Other projections | s17–s20 | **Equal Earth** (areas; climate maps later in the series); **polar stereographic** (true at 60°: −7 % / +87 %); **Lambert conformal conic** (cone, standard parallels 40/60, within ~2 % over 35–65° N); the forecasters' rule and scale bars | `mapproj.scale_factors` vs pyproj |
| Lines on maps | s21–s23 | reading isobars (labels, H/L with central pressure, hierarchy); **spacing → wind** (7.5 hPa/100 km and 22 m/s vs < 0.5 and 3–4 m/s); **troughs and ridges** at the ground | ERA5 Ciarán 12 UTC 2 Nov 2023; WPC TROF; NEW `diag.axes` |
| Upper air | s24–s27 | maps of the height of one pressure; the **500 hPa surface** in 3-D (×500 said; 5100 vs 6000 m), **geopotential height**, contours every 60 m in decametres; **why it dips**: z₅₀₀ = (R T̄/g) ln 2 (5070 vs 5480 m, Vallis (2.166) at constant T); troughs, ridges and winds aloft (69 m/s) | ERA5 z500; `atmos.hypsometric_thickness` |
| Wind on maps | s28–s31 | arrows / streamlines / **barbs**; barb rules (staff to the source, 5/10/50 kt, rounding, calm); 15 kt and 135 kt examples; real barbs on Ciarán | NEW `diag.station.barb_parts` |
| Station reports | s32–s38 | a real **METAR** from Brest at 00 UTC 2 Nov 2023, decoded group by group; the **station model** from the real 03 UTC **SYNOP** (8 oktas, 39 kt W, 9.2/7.5, 696 → 969.6, +55 → +5.5 hPa, ww 63); contrast with 18 UTC 1 Nov (SE 18 kt, 983.3, −10.3 hPa, heavy rain); hand-drawn isobars from ~20 real station reports vs ERA5; finding the cold front in station plots | NOAA ISD (NEW `fluidpy.data.isd`), NEW `diag.station` |
| Fronts on the chart | s39–s42 | cold/warm symbols (recap); **occluded** (side view ×50, then the real occlusion off Labrador); **stationary** front and **trough** lines (real WPC lines); Ciarán's **surface analysis built layer by layer** (objective fronts said to be a computer method) | `diag.fronts.front_lines`, `diag.cyclone.storm_centre` |
| Satellite images | s43–s47 | **visible** (reflected sunlight; Ciarán MODIS true colour), **infrared** (emitted heat, cold = white; same pass, band 31), **cloud-top height** ≈ (12 − (−50))/6.5 ≈ 9.5 km, **water vapour** (6.2 µm, dry tongue; geostationary defined), three views of one moment + a day-to-night IR loop | GIBS MODIS; GOES-19 bands 2/8/13 (Earth Engine) |
| Buys Ballot's rule | s48–s52 | observed rule (1857): back to the wind, low on the left (NH); tested at Brest 03 UTC (low 180 km NNE, ≈ 75° left: friction); aloft ≈ 90°; southern hemisphere reversed (Himawari full disk: typhoon 935 hPa anticlockwise, low south of Tasmania 945 hPa clockwise, both "seen from above"); fails near the equator; **why** left to the Coriolis and geostrophic movies | ERA5; GFS 27 Oct 2026; Himawari IR |
| Application | s53–s58 | read the real WPC chart of 18 UTC 27 Oct 2026 in four steps (letters: L 982, H 1033, L 961; spacing; fronts + IR cloud band + METARs across a cold front; context vs Ciarán 954, Brest gust 84 kt ≈ 156 km/h, ≈ 1.2 million homes without power [cited]); a short history beat (telegraph, 1850s) without any archive image | WPC + GFS + GOES + IEM METAR; ISD |
| Recap + end | s59–s60 | "To sum up, …" one beat per sentence; weather/climate end card | — |

## Deliberately left to later movies (pointed to, never depended on)
- **Why** the wind blows along isobars, why closer isobars mean stronger wind, why Buys Ballot's rule flips across the
  equator and fails there: `ch00_coriolis` (V5) and `ch00_geostrophic_wind` (V6). Here only observed, with the correct
  sense in each hemisphere and "seen from above" every time.
- Thickness and thermal wind beyond the one-sentence "cold columns are shorter": `ch00_thermal_wind` (V7).
- Rossby waves, jet meanders, the 500-hPa wave pattern: `ch00_rossby_waves` (V12); here named as troughs and ridges.
- Why fronts form, cyclone life cycles and occlusion dynamics: `ch00_baroclinic_instability` (V14).
- Radiation physics behind the satellite channels (emission, absorption bands): `ch00_climate_machine` (F5); here only
  "warmer things give off more infrared" and "water vapour absorbs and gives off at this wavelength".
- Gradient, divergence and the grad-in-spherical-coordinates formula: `ch00_grad_div_curl` (F6). This movie uses only
  the two arc-length increments δx = a cos φ δλ and δy = a δφ.

## Length
Set by the teaching. Measured by the `tools/tts.py` dry run (numbers in `script.md` and the storyboard header).

## Real dated data
Storm Ciarán 1–2 Nov 2023 (ERA5 hourly, MODIS Aqua true colour and band-31 IR, NOAA ISD METAR/SYNOP for Brest and ~60
stations round the Channel); the latest analysis when the movie was planned, **18 UTC 27 Oct 2026** (WPC coded
bulletin, GFS 0.25° analysis, GOES-19 bands 2/8/13, IEM METARs) and **00 UTC 27 Oct 2026** (GFS, Himawari-9 IR full
disk). The orchestrator decides whether to freeze these dates (recommended) or refresh them at build time (open
question Q1 in the reply; the rolling GIBS/THREDDS archives make a freeze urgent).
