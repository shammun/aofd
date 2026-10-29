# ch00_reading_weather_maps — brief v2 (movie-director, 2026-10-29)

**User request (2026-10-29):** the reading-weather-maps movie must be *very detailed* and at least 40–50 minutes long,
with many worked, real examples. v1 (61 scenes, 34:49) is replaced by this v2 (85 scenes; measured length in
`script.md` and the storyboard header).

Series position: **#69, the last movie of plan v2** (`movies/ch00/series_plan_v2_proposal.md`, Stage 9 · Synthesis).
So it may point *back* to every earlier movie ("we built this in the … movie") and re-explain just enough to stand alone.
House style `movies/HOUSE_STYLE.md` is binding (reference `ch00_dot_product_why` v6): s00 opening title + one sentence →
hook question → building blocks → intuition → why → application → "To sum up" recap → the **weather/climate end card**
(§3, word for word, "the notebook for reading weather maps"). Voice Kokoro `af_bella` 1.0, informal Chapter-0 voice,
no headings except the title, keywords on screen, no boxes, no references or URLs, type floor 44 px, caption band empty.
**§5 rules added 2026-10-28 apply to every scene:** a data-source line (dataset · time · place) on every real-data frame;
a colour bar with units on every coloured field; 3-D wherever space is the idea (columns, slabs, stacked levels, the
cone, orbits, the radar beam); globes rotate, zoom and fly with camera continuity between consecutive globe scenes;
every number and every step explained. Every map follows the cartography skill (§1 pre-flight list, §2a synoptic,
§2b imagery, §2f globes); best dataset **and** best tool per visual, with a runner-up, recorded per scene.

## Audience and what it already has
First-year calculus, no climate background — and, because this movie comes last, the whole series behind it. Pointed
back to (spoken, never on screen; storyboard `related:`): #5 coordinates (lat/lon, arc lengths, projections, Mercator
derived), #6 gradient (contour spacing), #6A contour maps, #6B how contour maps are made (interpolation, data
assimilation), weather basics (pressure, fronts, air masses, Ciarán at Brest, UTC, knots), dot product 0.1b (v·∇T),
#10 material derivative, #21 statistics of fields (anomalies, ensembles), #22 climate machine (infrared), #23A pressure
coordinates, #23B geopotential height, #23C standard levels, #24A isentropic maps, #26 water in the air, #27 skew-T,
#28 clouds, #29 Coriolis, #30 geostrophic wind, #32 thickness, #38 Rossby waves, #42 extratropical cyclones, #43 jets,
#44 thunderstorms, #45 tropical cyclones, #48 general circulation. Each term is still defined in plain words at first
use here (okta, METAR, SYNOP, isallobar, isotach, thickness, dBZ, ensemble, valid time …).

## The promise (s00)
"In this video, we'll learn to read weather maps the easy way, and see how forecasters use them to follow real storms,
from the first weather report to tomorrow's forecast." Title 'Reading' / 'weather maps', 'made easy', 'and how
forecasters use them' ('forecasters' teal); Part A globe → map with Tissot circles; Part B the 27 Oct 2026 chart
building itself, ending on a 'T+72 h' clock.

## What is taught (85 scenes, in order)
| Block | Scenes | Idea | Real data / tested function |
|---|---|---|---|
| Opening | s00–s01 | title; the real WPC chart "like a secret code"; the road map | WPC CODSUS + GFS + GOES-19, 18 UTC 27 Oct 2026 |
| The map's frame | s02–s11 | two angles (pointer to #5); latitude and longitude, Brest; **how far is a degree** (111 km, a cos φ); flattening and the plate carrée stretch; **Tissot + Mercator** (conformal; Greenland vs Africa); the forecasters' projections (Mercator / polar stereographic / **Lambert**, ±2 %; equal-area for amounts); **the small print** (units, contour interval, colour bar, source line); **UTC vs local** (Brest +1, New York −4); **initial vs valid time, forecast hour, analysis**; **traps** (0–360 longitudes, sea-level pressure over mountains: GFS 1058 hPa on the Karakoram) | `sphere`, `mapproj` (tested); zoneinfo; GFS 00Z 27 Oct |
| The surface chart | s12–s20 | isobars every 4 hPa, labels, H/L with central pressure, "a low is relative"; **why sea-level pressure** (Brest 971.8 → 983.3 hPa at 99 m, 8.5 m/hPa); spacing → wind (7.5 vs < 0.5 hPa/100 km); **the geostrophic balance** (pointer to #30) and **a worked geostrophic wind** west of Spain (3 hPa/100 km → 24 m/s; observed 17 m/s ≈ 70 %, friction); **Buys Ballot** tested at Brest (75°, friction); southern hemisphere on Himawari (typhoon 935, low 945; "seen from above"); fails at the equator; **pressure tendency and isallobars** (−10.9 / +15.0 hPa in 3 h; motion NE); troughs, ridges, cols | ERA5; ISD; `geostrophic_wind_from_msl`, `decode_synop`, `hypsometric_thickness`, `track_by_continuity` |
| Fronts of every kind | s21–s28 | cold front with Brest's real passage (220° → 270°, Td 10 → 7.5); warm front and warm sector (−10.3 hPa, Td 13.0); occluded (×50 side view; WPC off Labrador); stationary and trough lines (12 and 38 on the latest chart); **squall-line symbol and the dryline with real Oklahoma METARs** (Duncan Td 21 °C vs Lawton 6 °C, 44 km, 20 May 2013; Moore tornado); finding a front in station plots; Ciarán's surface analysis built layer by layer | ISD, IEM METAR (NEW N7), WPC, `diag.fronts` |
| Stations and the station model | s29–s43 | the observing network (4 730 stations in 20 min); **METAR** decoded (Brest 00 UTC); **American remarks** decoded (Fairbanks fog: altimeter vs SLP — two pressures; T group; 5appp tendency); **SYNOP** decoded group by group (Brest 03 UTC, gust 84 kt = 156 km/h); the station-model layout (and the °F trap); **oktas**; **present-weather symbols on four real stations** (snow La Grande, fog Fairbanks, drizzle Sweden, thunderstorm Santo Domingo); **barbs** (15 kt; 39 → 40; the 83-m/s jet → 161 → 160 kt = 3 pennants + 1 long); plotted pressure code (696, 329); **tendency glyphs** (codes 8 and 3); two Brest plots nine hours apart; hand isobars from 214 SYNOPs (RMS 0.87 hPa) | ISD; IEM METAR raw (exists); `station.*` (tested) + NEW F13 remarks, F21 wx→ww |
| Upper air | s44–s56 | height of a pressure (pointer #23A); the 500-hPa sheet in 3-D (×500; 5114–5968 m; decametres; #23B); why it dips (5070 vs 5480 m); **standard levels** (850 ≈ 1.5 km … 250 ≈ 10.4 km; what each shows; #23C, #24A); **850-hPa chart** (Brest 0.8 °C, Genoa 10.1, max 13.7 over eastern Spain); **temperature advection worked** (18.5 m/s × 5.2 K/100 km → 3.5 K/h cooling; pointer to the dot product); 500-hPa troughs and ridges with the computed axis (bends to the cut-off low; Buys Ballot aloft ≈ 90°); **how the trough axis is found**; **cut-off low** (5114 m); **250-hPa jet and isotachs** (83 m/s ≈ 161 kt ≈ 300 km/h; jet streak); **thickness** (Brest 5371 m → 265 K, −8 °C) and the **rain–snow line** (5400 / 5280 m rules of thumb; Brest rained at 537 dam; La Grande snowed); **a radiosonde on a skew-T** (Trappes: saturated to 550 hPa, freezing level 2.1 km, tropopause 10.2 km at −57 °C, winds 21 → 49 m/s; pointer #27) | ERA5 ten-level 12 UTC 2 Nov 2023 (on disk, NEW registration N1); IGRA2 Trappes (on disk); `advection`, `axes`, `hypsometric_thickness`, `pressure_height_standard` + NEW F18, F19 |
| Satellites | s57–s63 | **geostationary vs polar orbits** (36 000 km / 700 km; 3-D); visible; infrared; cloud-top height (9.5 km); water vapour (GOES-19, dry tongue; three views folded in); **reading shapes** (comma, cold-front band < −30 °C along much of it, dry slot); **typhoon eye and 16-km tops** on Himawari | MODIS (GIBS), GOES-19 (Earth Engine), Himawari-9 (GIBS) — all on disk |
| Radar | s64–s67 | **how radar ranges** (r = cΔt/2: 1 ms → 150 km); **dBZ and Marshall–Palmer** (20/40/50 dBZ → 0.65/11.5/49 mm/h); the US mosaic at the latest chart's time vs METARs (rain over MN/WI/IA, heavy rain at Madeline Island); **the 2020 Iowa derecho** squall line on radar | IEM NEXRAD n0q mosaics (NEW N5) + NEW F14, F15 |
| Forecast charts | s68–s73 | NWP models and data assimilation (#6B); **four GFS charts valid at one time** (T+120, T+72, T+24, T+0); **verification** (1001 hPa / 477 km → 993 / 199 km → 985 / 59 km → 982); the **pressure + 6-h precipitation panel**; **ensembles**, chaos, 31 members, probability (12/31 ≈ 39 %, a thought example); **spaghetti plots** (5520-m line, T+120 vs T+24) | GFS forecast runs (NEW N3, rolling: **fetch now**); GEFS members (NEW N4) + NEW F16, F17 |
| One storm, the latest chart, climate | s74–s82 | **Ciarán through every chart, top-down, as a 3-D stack** (250 jet / 500 trough / 850 cold air / surface 956; upper low 34 km above the surface low → stopped deepening; minimum 954 earlier); impacts (Brest 156 km/h, Lanvéoc ≈ 170 km/h, ≈ 1.2 M homes without power); **the latest WPC chart read in five steps** (letters; spacing 9.3 hPa/100 km, 27 m/s; fronts, the weak Virginia front; aloft: trough along ~52° W, jet 66 m/s; conclusion) with a one-line history (telegraph, 1850s); **weather → climate** (November mean 1991–2020: Icelandic low 999, Azores high 1022) | WPC, GFS, GOES, IEM, NCEP R1 LTM (on disk) |
| Recap + end | s83–s84 | "To sum up, …" one beat per sentence; weather/climate end card | — |

## What changed from v1 (and why)
- **Added (new teaching):** chart small print, UTC vs local, initial vs valid time, traps; sea-level reduction (worked);
  geostrophic wind (worked); pressure tendency and isallobars; cols; every front type with real station passages,
  squall lines and drylines; METAR remarks; SYNOP decoded; oktas; present-weather symbols on four real stations;
  tendency glyphs; standard levels; the 850-hPa chart and temperature advection (worked); trough-axis method; cut-off
  low; 250-hPa jet and isotachs; thickness and the rain–snow line (with its trap); a real radiosonde on a skew-T;
  satellite orbits; reading cloud shapes; typhoon cloud tops; radar (ranging, dBZ, rain rates, three real mosaics);
  forecast charts, verification, precipitation panel, ensembles and spaghetti; Ciarán as a 3-D stack; the five-step
  reading of the latest chart incl. the air above; weather → climate.
- **Moved to the coordinates movie (#5, already made):** the great circle, the Mercator integral and its chain-rule
  check, the rhumb line (v1 s08, s13, s14, s16). This movie keeps the stretch idea, Tissot and conformal maps and
  says "we built them in the coordinates movie". *(Orchestrator decision 3 of 2026-10-27 kept the calculus when this
  movie came 4th; it now comes last and #5 derives it — flagged for the orchestrator.)*
- **Cut for length:** v1 s28 (arrows vs streamlines vs barbs) and s31 (barbs on the reanalysis map) — barbs are taught
  in s38–s39 and appear on every chart; v1 s50 (Buys Ballot aloft) and s52 (rule fails at the equator) are folded into
  s50 and s18 as one sentence each.
- **Fixed from the verifier and orchestrator notes:** the 500-hPa trough axis is drawn from `diag.axes` (bends to the
  cut-off low), never a straight 5.5° W line; Irish/Dutch/Belgian SYNOPs decoded with `wind_unit="m/s"`; Brest's
  156 km/h is never called Ciarán's strongest gust (Lanvéoc ≈ 170 named); Enedis ≈ 1.2 M homes; the METAR wind-turn
  claim across the Virginia front failed (RM44) and is now said honestly as "a weak front"; the IR claim says "much of".

## Deliberately left to the earlier movies (pointed to)
The derivations of geostrophic balance and why Buys Ballot flips (#29, #30); the hypsometric equation in full (#32);
Rossby waves and blocking (#38); the cyclone life cycle and occlusion dynamics (#42); jet-streak dynamics (#43);
parcel theory, CAPE and moist adiabats on the skew-T (#27); radiation physics of the satellite channels (#22); how
interpolation and data assimilation work (#6B).

## Real dated data
Storm Ciarán 1–2 Nov 2023 (ERA5 hourly and ten-level, ISD SYNOP/METAR, MODIS, IGRA2 Trappes); the frozen "latest"
analysis **18 UTC 27 Oct 2026** (WPC bulletin, GFS, GOES-19, IEM METARs, IEM radar mosaic) and **00 UTC 27 Oct 2026**
(GFS, Himawari-9); GFS forecasts valid 18 UTC 27 Oct 2026 from the 22/24/26 Oct runs and GEFS members (to fetch);
two historic US cases (dryline 20 May 2013, derecho 10 Aug 2020); Hurricane Ian radar is no longer used (cut for
length). Climate: NCEP/NCAR R1 November mean 1991–2020.

## Length
Set by the teaching; target 40–50 min (user). Measured by the `tools/tts.py` dry run (numbers in `script.md` and the
storyboard header). A first draft of the expanded plan ran to 9 400 words (> 60 min) and was tightened by merging
scenes (lat+lon, Buys Ballot + Brest test, squall + dryline, METAR remarks, cut-off into the trough axis, three
satellite views into water vapour, history into the latest chart) and trimming every narration.
