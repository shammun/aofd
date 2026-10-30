# Chapter 0 movie series: plan v4 (PROPOSAL, movie-director, 2026-10-30; not approved yet)

v3 (`series_plan_v3_proposal.md`, adopted 2026-10-29) stays in force until the user approves this file. v4 keeps all
**141 v3 movies with their v3 numbers and stage codes**. It removes none of them. It **adds 35 new movies** in three
stages:
- 18 in a new stage **U, "Understanding weather"**;
- 6 in **M, map reading**;
- 11 in **F, forecasting**, now called **"Reading maps to predict…"**.

It also extends or re-scopes some v3 movies, and **re-orders the stages** so that understanding comes before map
reading, and map reading before forecasting. **Total: 176 movies.**

Anything this file does not restate is unchanged from v3 and is still specified there:
- the v3 case table (§B1);
- the jet-stream and polar-vortex specs (§C1);
- the current-events specs (§D1–D3);
- the rules, house style and data-refresh rule.

## 0. What the user asked (2026-10-30)
**Feedback, in substance.**
- These must come *before* any map-reading movie:
  - height on contour maps;
  - geopotential height;
  - the lapse rate and the adiabatic lapse rates;
  - everything needed to read a skew-T;
  - "and maybe some more".
- The present order rushes and misses things. Reading maps means looking at one map, or a **series of maps over time**,
  and saying **what is going to happen**.
- Nobody can predict from a map without first understanding:
  - how a storm is made;
  - how rain forms;
  - how wind and the ocean play a part;
  - how to read all those data.
- Make separate movies on reading maps to predict:
  - cyclones;
  - storms;
  - rainfall and heavy rainfall;
  - floods: geography matters, with Google Earth Engine inundation maps and animations;
  - thunderstorms;
  - lightning;
  - snowfall;
  - "and many others".

**The user's clarification (relayed by the coordinator).**
- Keep v3's 141 movies and its stage structure (0–1, M, T, R, W, S, G, F, A, O, CV, CE). Throw nothing away.
- Put each new item in the stage where it belongs:
  - understanding goes in a physics or weather-systems stage, or in a new U stage before map reading;
  - reading map sequences goes in M;
  - "Reading maps to predict…" goes in F, merged, extended or added to.
- Stages may be re-ordered. Report the new total, the stage of every new movie, and a per-stage count table.

## 1. Summary

### 1a. Count per stage
| Stage | Code | v3 count | New in v4 | v4 total |
|---|---|---|---|---|
| Basics and maths essentials | 0–1 | 11 | 0 | 11 |
| **Understanding weather** (new stage) | **U** | 0 | **18** | **18** |
| Map reading | M | 20 | **6** | 26 |
| Maths for dynamics | T | 11 | 0 | 11 |
| Rotation | R | 12 | 0 | 12 |
| Waves | W | 7 | 0 | 7 |
| Weather systems (now "in depth") | S | 10 | 0 | 10 |
| Global atmosphere | G | 4 | 0 | 4 |
| Forecasting: "Reading maps to predict…" | F | 28 | **11** | 39 |
| Advanced maths | A | 2 | 0 | 2 |
| Ocean | O | 12 | 0 | 12 |
| Climate variability and change | CV | 7 | 0 | 7 |
| Current events and analysis | CE | 17 | 0 | 17 |
| **Total** | | **141** | **35** | **176** |

### 1b. Where every new movie went
- **U (18):**
  - U01 the pressure-gradient force;
  - U02 convergence, divergence and vertical motion;
  - U03 temperature with height;
  - U04 how rain forms;
  - U05 ice, snow, hail and precipitation type;
  - U06 how much it rains;
  - U07 the boundary layer and the day–night cycle;
  - U08 the jet stream (first look);
  - U09 waves on the jet, blocks and the polar vortex (first look);
  - U10 vorticity in plain words;
  - U11 how extratropical cyclones are made;
  - U12 how thunderstorms work;
  - U13 severe storms;
  - U14 the ocean's role in weather;
  - U15 how tropical cyclones form;
  - U16 monsoons (first look);
  - U17 how satellites see;
  - U18 how radar sees.
- **M (6):**
  - M21 the 500-hPa chart;
  - M22 the jet-level charts;
  - M23 thickness charts;
  - M24 skew-T reading practice;
  - M25 reading maps over time I (tendencies and motion);
  - M26 reading maps over time II (development and extrapolation).
- **F (11):**
  - F29 rainfall;
  - F30 monsoon onset and breaks;
  - F31 floods I (geography);
  - F32 floods II (Sentinel-1 inundation maps and animations in Earth Engine);
  - F33 floods III (GloFAS and river gauges);
  - F34 lightning;
  - F35 freezing rain and ice storms;
  - F36 dust storms;
  - F37 cold waves and the polar vortex;
  - F38 fire weather;
  - F39 drought onset.

### 1c. The viewing order of the blocks
```
Stage 0–1  0.1 · 0.1b · 0.2 (+ Parts 1–2 = #2, #3) · 0.3 · #1a · #4 · #5 · #6      (finished, plus the maths maps need)
   │
UNDERSTANDING BLOCK (29 movies): the 18 new U movies, interleaved with the 11 v3 concept movies of stage M
   (M01, M03, M04, M07, M08, M09, M12, M13, M14, M15, M16). Those keep their M numbers and are counted in M,
   but they are watched here, because they are understanding, not chart reading.
   │
MAP-READING BLOCK (15 movies): M02, M05, M06, M10, M21, M22, M23, M11, M24, M17, M18, M19, M25, M26, M20
   │
FORECASTING BLOCK F, "Reading maps to predict…" (39 movies)
   │
#1b · T · R · W · S (in depth) · G · A · O · CV · CE            (v3 order; CE may jump the queue as in v3)
```
**Why the M concept movies sit in the understanding block.**
- The clarification keeps the stage codes, so they keep their numbers.
- The feedback says these ideas must come before any chart is read.

The alternative would be to renumber them as U movies. That breaks the v3 crosswalk and the folder names, so it is not
recommended (decision D1 in §9).

**Light "first look" movies before the block.** None stay ahead of it.
- v3's two first looks are now inside the understanding block, at the point where their prerequisites exist:
  - M03, Coriolis and geostrophic, extended;
  - M04, fronts, now air masses and fronts. Its cyclone life cycle moves to U11.
- M01 (contours) opens the block. The user named "height on contour maps" first, and every later movie draws on it.
- v3 M02 (how maps are made) moves to the start of the reading block. It is about where a chart comes from, so it helps
  only once charts are read.

**Why the wind comes before geopotential.**
- M08 (geopotential) shows that *height contours act like isobars* (the geostrophic wind on a pressure surface). Its
  "how forecasters use it" part also needs the wind.
- The wind (U01, M03, U02) needs only the sea-level isobars of 0.3 and the gradient of #6.
- So: contours → PGF → Coriolis and geostrophic → convergence, and then pressure coordinates → geopotential → levels.
  v3 had the same order (M03 before M07 and M08).

**Why the climate machine (M16) moves from just before the satellite movie to the start of the thermodynamics.**
- Night-time infrared cooling is needed by:
  - inversions (U03);
  - the boundary layer and fog (U07);
  - heatwaves.
- So radiation must be known early. The satellite channels (U17, M17) still use it. This reverses v3 decision 13.

---

## 2. Part U · The understanding block (29 movies, in viewing order)

Lengths are **planning estimates, not TTS measurements**. Each storyboard gets a `tools/tts.py` dry run when it is
written, as HOUSE_STYLE requires. The §5b rules apply throughout:
- stacks are seen **from outside only**: a side angle, bottom to top, about 5 layers, and one close look of ≤ 5–6 s;
- globes zoom and then always zoom back out;
- colour bars sit beside the picture, and source lines sit below it.

Every stack below has its own data and place.

| Pos | ID | Title | Scope: what it teaches | Prereqs | Real data and cases | Est. length | §5b moments |
|---|---|---|---|---|---|---|---|
| 11 | **M01** | Contour maps and isolines (v3, unchanged; plan being written) | Height on a terrain contour map first. Then isobars, isotherms, isohyets, isotachs, isohypses and isobaths; the contour interval; crowded lines = steep; highs, lows, ridges, troughs, cols. | 5, 6, 0.3 | ETOPO Alps; ERA5 MSLP/T2m; GEBCO isobaths | 25–30 min | terrain → contours lifting off a 3-D hill; Alps → Po valley zoom and back |
| 12 | **U01** | Why air is pushed: the pressure-gradient force (**new**) | From isobar spacing to a force per kilogram, −(1/ρ)∇p, worked with real isobars (≈ 1 hPa per 100 km → ≈ 10⁻³ m s⁻²). Why air would rush from high to low, and how fast it would get after an hour without rotation. The sea breeze as an almost pure PGF wind (small, short-lived, so rotation hardly matters). Pressure differences from heating (recap of 0.3) and from piling up air. | 6, 0.3, M01 | ERA5 MSLP round a real low (scout picks, not Ciarán); a sea-breeze day (ERA5 10-m wind + ISD, Chennai or Florida) | 20–25 min | none (flat maps; animated wind arrows) |
| 13 | **M03** | Why the wind blows along the isobars: Coriolis, geostrophic, gradient and friction winds (v3 first look, **extended**) | v3 scope, plus: the **gradient wind** (curved flow: weaker than geostrophic round lows, stronger round highs), **cyclostrophic** balance in tornadoes and dust devils (one worked number), and **friction** turning surface wind 10–20° across the isobars over sea and 25–40° over land, toward low pressure. Derivations still in R02/R05. | 2, 3, 5, 6, 0.3, U01 | ERA5 10-m wind vs geostrophic on a real low; GDP drifter inertial loops | 30–35 min | house globe: f-colour (bar beside), zoom to a NH low and a SH low, back out |
| 14 | **U02** | Convergence, divergence and vertical motion (**new**) | Air that piles up must go somewhere. Surface convergence into a low (from M03's friction) → rising; divergence aloft lets it rise; sinking under highs. The divergence number ∂u/∂x + ∂v/∂y (partials from #4) from a box of winds, worked. Vertical speeds: cm/s in large systems, m/s in storms. Why rising air means clouds and sinking air means clear skies. | 4, 6, M03 | ERA5 divergence at 10 m and 250 hPa + vertical velocity over a real low (scout picks); MODIS cloud field on the same day | 25–30 min | a 3-D "chimney" column over the low: inflow at the bottom, outflow at the top (from outside, side angle) |
| 15 | **M07** | Pressure as a vertical coordinate (v3, re-scoped) | v3 scope. It adds ω (Pa/s) as the vertical speed charts actually plot, linked to U02's w. | 0.3, M01, U02 | ERA5 over Tibet/Himalaya | 18–22 min | layer stack of isobaric surfaces over the Tibetan Plateau, **seen from outside** (v3's "fly under" removed, §5b 2026-10-30) |
| 16 | **M08** | Geopotential: the height of a pressure surface, and how forecasters read it (v3 full, 30–40 min; **one change**) | v3 §A5 scenes 1–12. **Change:** scene 8 keeps the 540-dam rain–snow rule as a first look. The warm-nose and freezing-rain caveat moves to U05 and M23, where the ice process and the skew-T are known. Scene 9 also defines the **standard deviation** in words, for the anomaly. | 4, 6, 0.3, M01, M03, M07 | PNW heat dome 2021; cut-off low Daniel 2023; a winter 540-dam day (v3) | 30–40 min | heat-dome stack **from outside** (v3's "through and under" removed); 500-hPa sheet orbit; z500 anomaly globe |
| 17 | **M09** | The standard pressure levels (v3) | v3 scope. It adds what each level shows for **prediction** (preview of M10–M22). | M07, M08 | ERA5, one day per level | 15–20 min | "level elevator": a column over the Bay of Bengal, seen from outside |
| 18 | **M16** | The climate machine: sunlight in, infrared out (v3, **moved earlier**, extended) | v3 scope. It adds **night cooling**: the ground radiates infrared, and clear and dry nights cool most, which leads to inversions, dew and fog. It also adds the surface energy budget in words. | 4, 0.3 | CERES EBAF; a clear vs a cloudy night (ERA5 T2m + ISD, same station) | 30–40 min | CERES net-radiation globe; IR-out globe |
| 19 | **U03** | Temperature with height: the environmental lapse rate, inversions and the standard atmosphere (**new**) | What a balloon measures: the environmental lapse rate (ELR) on real soundings, the 6.5 K/km standard atmosphere (ICAO) and how far real days depart from it. Three kinds of inversion (radiation, subsidence, frontal) and why they trap smog and fog. The tropopause on a sounding. The meteorology sign convention Γ = −dT/dz, said once. | 0.3, M07, M16 | IGRA2: Trappes summer noon vs winter dawn; Salt Lake City winter inversion (moved here from v3 M12); Dhaka monsoon | 25–30 min | a 3-D column of the real sounding beside a flat map of the station (from outside) |
| 20 | **M12** | Rising air: the first law, dry and moist adiabats, potential temperature and parcel stability (v3, **extended**) | v3 scope (first law, dry adiabatic 9.8 K/km, θ, the moist rate in words and numbers, the parcel method, stable/unstable/neutral). It adds **latent heat** and **θe** explicitly (needed by fronts and storms), and **absolute vs conditional instability**. Inversions are now recapped from U03. | 4, 0.3, M07, U03 | IGRA2 OUN 20 May 2013 (unstable); ERA5 θ and θe | 30–35 min | a 3-D column with a rising parcel beside its surroundings |
| 21 | **M13** | Water in the air: humidity, Clausius–Clapeyron, LCL, CAPE and CIN (v3) | v3 scope. It adds the **wet-bulb temperature** (needed for heat stress and precipitation type) and "7 % more vapour per kelvin". How clouds and rain form becomes a short preview; U04 and U05 teach it in full. | M12, 4 | IGRA2 + ERA5 CAPE, Bangladesh Apr 2024; IMERG | 30–35 min | precipitable-water globe (bar beside) |
| 22 | **M14** | The skew-T log-P diagram, in full (v3, 45–60 min) | Every line: isotherms (skewed), isobars (log), dry adiabats, moist adiabats, mixing-ratio lines, plus wind barbs on the side. Parcel path, LCL, LFC, EL, CAPE, CIN, inversions, freezing level, tropopause. Trappes moves to M24 (practice); here the soundings are built line by line. | M12, M13 | IGRA2 OUN 2013; Dhaka/Kolkata pre-monsoon | 45–60 min | balloon rising through a 3-D profile; skew-T drawn beside the column |
| 23 | **M15** | How clouds form, and cloud types (v3, **extended**) | v3 scope (genera, heights, look). It adds the **four ways to lift air**: surface heating, mountains (orographic), fronts and convergence, each with its typical cloud. It also adds the mixing (contrail and fog) and cooling routes to saturation. | M12, M13, U02 | GIBS MODIS/VIIRS; GOES-19; open-licence ground photos | 25–30 min | daily cloud-fraction globe (bar beside) |
| 24 | **U04** | How rain forms: from cloud droplets to raindrops (**new**) | Why most cloud droplets never fall (10 µm vs 1 mm; fall speeds worked). Condensation nuclei. Collision–coalescence ("warm rain") in tropical and maritime clouds. Drop size and fall speed. Drizzle vs rain. Why some clouds rain and others do not. | M13, M15 | IMERG over the tropics; GPM DPR overpass of a warm-rain shower (Earthdata) | 20–25 min | 3-D cloud column with droplets growing (illustrative, labelled as a thought experiment in the narration) |
| 25 | **U05** | Ice, snow and hail, and what reaches the ground (**new**) | Supercooled water down to −40 °C. Ice nuclei. The **Bergeron–Findeisen** process (ice grows at the expense of droplets, because saturation over ice is lower), snowflake habits, riming and graupel, **hail** growth in strong updrafts (layers, size vs updraft speed). Then **precipitation type**: snow, rain, sleet (ice pellets) and **freezing rain** from the warm-nose profile, drawn on a sounding. The thickness rule from M08 is revisited. | M13, M14, U04, M08 | IGRA2 freezing-rain sounding (Quebec 5 Apr 2023 or Montreal; scout); MRMS precipitation-type product (AWS) | 30–35 min | layer stack of temperature at 5 levels over a freezing-rain zone, the warm nose visible (from outside) |
| 26 | **U06** | How much it rains: rain rates, moisture supply and mountains (**new**) | Rain rate ≈ updraft × moisture × efficiency, worked. Stratiform rain (wide, steady, frontal) vs convective rain (narrow, intense). **Precipitable water** and **moisture transport** (IVT in words, then the formula), and **atmospheric rivers** in words. **Orographic rain** and the rain shadow (Khasi Hills vs the Shillong plateau lee, the Western Ghats). Duration × rate = total. **Return period** ("1-in-100-year") defined. | U02, M13, M15, U04, U05 | ERA5 IVT over an AR (not the Jan 2023 California series, which stays in F21); IMERG annual rain over the Khasi Hills | 30–35 min | globe zoom from the Bay of Bengal onto the Khasi Hills with relief, the moist flow climbing, back out |
| 27 | **U07** | The boundary layer and the day–night cycle: local winds, night inversions and fog (**new**) | The mixed layer grows by day and collapses at night. The surface energy budget (sensible vs latent, wet vs dry soil: the seed of the heatwave feedback). Sea and land breezes, mountain and valley winds, **föhn** and downslope winds. The **nocturnal low-level jet**. How **fog** forms (radiation, advection, upslope, evaporation). | M03, M12, M13, M16, U03 | ERA5 boundary-layer height (diurnal); ISD hourly; Indo-Gangetic fog morning (MODIS); Great Plains LLJ night (ERA5 850 hPa) | 30–35 min | a 3-D slab of the boundary layer over a coast, breathing day and night (from outside) |
| 28 | **M04** | Air masses and fronts (v3 first look, **re-scoped**) | v3 scope for air masses, the four fronts in 3-D, the frontal weather sequence, squall lines and **drylines**, and the front clues. **The cyclone life cycle moves to U11** (it now needs U08–U10). | 0.3, M01, M03, M12 (θe) | Éowyn's frontal zone → θe stack (v3) | 25–30 min | θe layer stack at 1000/925/850/700/500 hPa through the front (from outside) |
| 29 | **U08** | The jet stream: why it exists and how it steers weather (first look, **new**) | Warm columns are taller (M08), so height surfaces slope down toward the pole, more with height. So the geostrophic wind grows with height: the **thermal wind in words**. The polar-front and subtropical jets, seasons, **jet streaks** and the entrance/exit rule in words (where air rises), vertical **wind shear**. The full movie is S01. | M03, M08, M09, U02 | ERA5 250 hPa, a winter day (not Ciara 2020, which stays in S01) | 25–30 min | house globe with animated 250-hPa streaks; zoom to a jet streak and back out |
| 30 | **U09** | Waves on the jet: troughs, ridges, blocks and the polar vortex (first look, **new**) | Troughs and ridges as waves that drift east (usually); the 3–5 day rhythm. **Blocking** (omega, Rex) and why it stalls weather into heatwaves, floods and droughts. Cut-off lows (recap of M08). Air sinking under ridges warms by compression (M12). The **polar vortex**: the stratospheric and tropospheric ones, and why the media mix them up; sudden warmings in one picture. Full: W06, G03. | U08, M08, M12 | ERA5 z500 time series over a 2010 Russian-block week (S01 keeps a different view of it; this one is the time loop); NCEP R1 10 hPa winter 2025–26 (on G:) | 25–30 min | polar-cap globe of z500 drifting over 10 days (bar beside) |
| 31 | **U10** | Vorticity in plain words (**new**) | Spin of a small patch of air. Shear and curvature vorticity, the sign (positive = cyclonic in the NH), planetary vorticity f, absolute vorticity, and 500-hPa vorticity maxima at troughs. **Vorticity advection** ahead of a trough marks rising air (a rule of thumb, with the why in words from U02; full R09, R11). | M03, M09, U02, U09, 0.1b | ERA5 500-hPa vorticity on a trough day | 20–25 min | paddle-wheels riding a real 500-hPa flow (illustrative paddles on real winds) |
| 32 | **U11** | How extratropical cyclones are made: birth, life and death (**new**; the life cycle moved from v3 M04) | The Norwegian life cycle (wave → open → occluded → decay), now **with the why**: an upper trough and a jet exit over a surface front, divergence aloft (U02), vorticity advection (U10). Conveyor belts and the dry slot. Why the low stops deepening when it sits under the upper low. Bomb cyclones in words. Shapiro–Keyser named. Full: S05. | M04, U08, U09, U10, U02 | Éowyn 2025 (ERA5 hourly, life cycle as a time series; distinct from M04's stack) | 30–35 min | globe follow of the low through its life, back out; 500-hPa and surface maps side by side in time |
| 33 | **U12** | How thunderstorms work (**new**) | Ingredients: moisture, instability, lift (M13, M14). The single-cell life cycle (towering cumulus → mature → dissipating), the gust front and **outflow boundary**, multicells, **training** and back-building, MCSs. **Lightning physics**: charge separation by graupel and ice collisions (U05), cloud-to-ground strokes, thunder. Full: S07. | M14, U05, U02 | GOES-16 IR loop of a summer storm day (scout); IGRA2 sounding the same day | 30–35 min | 3-D cell growing from a real sounding's CAPE (shape illustrative, heights from data) |
| 34 | **U13** | Severe storms: wind shear, supercells, tornadoes, hail and downbursts (**new**) | **Shear** and the **hodograph** explained from zero; storm-relative helicity in words. Why shear organises storms. The supercell (mesocyclone, updraft, forward and rear flanks). Tornado formation (what is known and not known). Large hail (U05 + strong updraft). Downbursts and microbursts, derechos. | U12, U08, M03 (cyclostrophic) | IGRA2 OUN 20 May 2013 hodograph (as an illustration; the forecast case stays in F06) | 30–35 min | 3-D hodograph rising out of a column; wind layer stack at 5 levels turning with height (from outside) |
| 35 | **U14** | The ocean's role in weather: SST, evaporation, heat content and El Niño (**new**) | Sea-surface temperature (SST) maps. Evaporation grows with wind, warmth and dryness (bulk formula in words). The mixed layer and **ocean heat content** (why depth of warm water matters). The cold wake behind a storm. Marine heatwaves in one picture. **El Niño in one picture** (full: CV01). Sea breezes and lake effect come back later. | M13, M16, U07 | OISST daily; ERA5 latent heat flux; AOML TCHP; Argo profile in the Bay of Bengal | 25–30 min | SST globe (bar beside), zoom to the Bay of Bengal and back; a 3-D slab of upper-ocean temperature with depth (from outside) |
| 36 | **U15** | How tropical cyclones form, and why warm oceans matter (**new**) | Ingredients: SST ≳ 26.5 °C over a deep warm layer (U14), moist mid-levels, low shear (U08), a seed disturbance, and **5° from the equator** (f ≠ 0, M03). Structure: eye, eyewall, rainbands, warm core. The heat engine in words (latent heat, M12). Why they weaken over land and cold water. Spin sense by hemisphere; basin names (hurricane, typhoon, cyclone). The **steering flow** in words (subtropical high, 0.3 pressure belts). Full: S08. | U14, M12, M13, M03, U02, U08 | IBTrACS global tracks; OISST; Himawari-9 IR of a mature cyclone (not one of the F cases) | 30–35 min | IBTrACS track globe (no tracks within 5° of the equator, shown), zoom to a mature eye, back out |
| 37 | **U16** | Monsoons: a first look (**new**) | Land–sea heating contrast (M16, U14), the ITCZ's seasonal march, the South Asian monsoon (onset, active and break spells), **monsoon depressions** over the head of the Bay, the **MJO/BSISO** in words (an eastward-moving envelope of rain every 30–60 days), the Tibetan Plateau and the jets. Full: S09. | U14, U06, U08, U15 | ERA5 850-hPa winds Jan vs Jul; IMERG climatology; NOAA OLR | 25–30 min | globe of 850-hPa winds reversing between seasons (animated), Bay zoom and back |
| 38 | **U17** | How satellites see (**new**; the physics half of v3 M17) | Geostationary vs polar orbits (Ω from #3). Channels: visible (reflected sunlight), infrared (emission and brightness temperature from M16), water vapour (absorption band, emission from the middle troposphere). **Microwave** sees through cirrus (89/37 GHz ice scattering). **Scatterometers** read wind from sea roughness. The **lightning mapper** (GLM: optical flashes at the cloud top). Resolution vs revisit. | M16, M15, U12, 3 | GOES-19 (Earth Engine route on G:), Himawari-9 AWS, GPM GMI, ASCAT (Earthdata) | 25–30 min | 3-D orbits round the globe; a GOES full disk wrapping onto the globe |
| 39 | **U18** | How radar sees (**new**; the physics half of v3 M18) | Ranging, r = cΔt/2. Beam height over the curved Earth (#5). The radar equation in words, dBZ, and Z = 200 R^1.6 (with drops and hail from U04/U05). **Doppler**: only the speed along the beam (dot product 0.1b). **Dual-pol** (ZDR, correlation coefficient) in plain words. Space radar (GPM DPR) and **SAR** (radar imaging of the ground: smooth water is dark) as a bridge to the flood movies. | U04, U05, 5, 0.1b, M16 | NEXRAD Level II (AWS) one volume; GPM DPR swath; one Sentinel-1 scene | 25–30 min | 3-D beam leaving the dish and rising over the curved Earth; PPI cone |

**The block, planning estimate:** about 13–15 h for 29 movies.

---

## 3. Part M · The map-reading block (15 movies, in viewing order)

Every M movie now ends with a **"what happens next?"** beat: one chart, one prediction, then the next chart. This
prepares for F.

| Pos | ID | Title | Scope | Prereqs | Real data and cases | Est. length | §5b moments |
|---|---|---|---|---|---|---|---|
| 40 | **M02** | How weather maps are made (v3) | Stations → grid, objective analysis, data assimilation, reanalysis, contouring, and the artefacts. | M01, 0.3 | ISD vs ERA5 | 25–30 min | globe of the real observing network |
| 41 | **M05** | Reading the surface chart (v3) | v3 scope: the frame, isobars, fronts and barbs. **Pressure tendency and isallobars move to M25**, where maps over time are read. | M01, M03, M04, U11, 5 | #69 s02–s28 + s38–s39 | 25–30 min | globe → map unrolling with Tissot; Brest zoom tour and back |
| 42 | **M06** | Station plots: METAR, SYNOP and the station model (v3) | v3 scope; the tendency code is read here (∂p/∂t from #4). | M05, M15, U04, U05 | #69 s29–s37, s40–s43 | 18–22 min | globe of 4 730 METAR stations |
| 43 | **M10** | Reading upper-air charts I: 850 and 700 hPa (v3, **re-scoped to two levels**) | 850 hPa: temperature advection (worked), fronts, the low-level jet and the moisture feed. 700 hPa: relative humidity, steering of showers, the 0 °C and −10 °C lines. **500 moves to M21 and 250 to M22.** | M05, M08, M09, U07, M04, 0.1b | #69 s48–s49 + new (GFS 27 Oct 2026; Ciarán ERA5 850) | 20–25 min | flat-map tour 850 → 700 |
| 44 | **M21** | Reading upper-air charts II: the 500-hPa chart (**new**) | Height contours, troughs and ridges, finding the trough axis, short-wave vs long-wave troughs, cut-off lows, blocks, **500-hPa vorticity maxima** and vorticity advection, the 5520/5640-m lines. Where to expect bad weather downstream. | M10, U09, U10 | #69 s50–s51 + ERA5 on a short-wave day (scout) | 20–25 min | z500 sheet orbited from outside, troughs as valleys |
| 45 | **M22** | Reading upper-air charts III: 300, 250 and 200 hPa (**new**) | Isotachs, the jet core, **jet streaks** and their entrance and exit regions, upper divergence over surface lows (U02), the subtropical jet, and the jet over the Bay of Bengal in the monsoon (the tropical easterly jet). | M21, U08, U02 | #69 s52 + ERA5 250 hPa | 20–25 min | globe with animated 250-hPa streaks, a jet-streak zoom and back |
| 46 | **M23** | Reading thickness charts (**new**) | 1000–500 hPa and 1000–850 hPa thickness. Thickness ridges and troughs. **Thickness advection** (warm or cold). The 540/528-dam lines **with their limits** (warm nose, U05). Thickness and the jet (U08). | M08, M10, U05, U08 | #69 s53–s54 + a winter mixed-precipitation day (scout; IEM METAR FZRA/SN reports) | 20–25 min | none (flat maps) |
| 47 | **M11** | Cross-sections and Hovmöller diagrams (v3) | v3 scope. | M04, M08, M10, M21, M22 | ERA5 section; Hovmöller of v250 | 20–25 min | section lifted from a globe into 3-D |
| 48 | **M24** | Skew-T reading practice: eight real soundings (**new**) | Read, in order: a severe-storm day (loaded gun, cap), a dawn radiation inversion with fog, a freezing-rain warm nose, a snow sounding, a tropical monsoon profile, a pre-monsoon nor'wester sounding (Kolkata or Dhaka, if in IGRA2), an elevated mixed layer, and Trappes in Ciarán (#69 s55–s56). Each ends with "what weather today?" and then the observed weather. | M14, U05, U07, U12, U13 | IGRA2 (eight stations, real dates; each checked against ISD/METAR weather) | 30–35 min | none (diagrams); a short map inset for each station |
| 49 | **M17** | Reading satellite images (v3, re-scoped to reading) | v3 scope minus the physics (now in U17): visible, IR, cloud-top height, WV, **RGB composites** (airmass, dust, night fog), shapes (comma, dry slot, bands), **overshooting tops and cold rings**, typhoon eye, and **GLM lightning maps**. | U17, M15, U11, U12 | #69 s57–s63 + RGB + GLM | 25–30 min | GOES full disk on the globe, zoom and back |
| 50 | **M18** | Reading weather radar (v3, re-scoped to reading) | v3 scope minus the physics (now in U18): mosaics vs one radar, reflectivity patterns (stratiform, convective, bright band), artefacts, **Doppler velocity** reading (inbound/outbound, zero line, veering), and **dual-pol** images (hail and debris hints). | U18, U12, U13 | #69 s64–s67; KDMX 2020 | 25–30 min | PPI cone over the curved Earth |
| 51 | **M19** | Forecast charts, models and ensembles (v3) | v3 scope. It adds **verification words** (hit, miss, false alarm, error) and **probability** and **spread** in plain words, so F needs no T11. | M02, M05, M10, M21, M22 | #69 s68–s73b | 25–30 min | spaghetti on a globe slice |
| 52 | **M25** | Reading maps over time I: tendencies and how systems move (**new**) | A sequence of real charts 6 h apart. Pressure tendency maps and **isallobars** (falls ahead of a low). Tracking a low, a front and a trough: the **motion vector**, speed in km/h (worked from map distance, #5). Steering by the 500-hPa flow (the "follow the 500 wind at about half speed" rule of thumb, checked on the case). Loops of satellite and radar. | M05, M21, M17, M18, 4, 5 | ERA5 3-hourly charts over 48 h of a mid-latitude low (scout picks; not Ciarán, Éowyn or Grayson); GOES loop | 25–30 min | globe follow of the low as the frames step, back out |
| 53 | **M26** | Reading maps over time II: development, extrapolation and model trends (**new**) | Is the system **deepening or filling**? (the pressure drop rate). Is the trough sharpening, the front speeding up or slowing? **Extrapolation** vs **persistence** vs the **model**: scored on the case. Run-to-run model trends (dprog/dt). When extrapolation fails: development, stalling, recurvature. Then a 5-step routine to read any sequence. | M25, M19 | Same low as M25, extended to 96 h, plus GFS/ECMWF runs (open data, 2023+); our extrapolation vs what happened | 25–30 min | ensemble lows as dots stepping in time on a globe slice |
| 54 | **M20** | Reading weather maps: one storm through every chart, and through time (v3 capstone, `ch00_reading_weather_maps`, **extended**) | v3 scope plus a **time-sequence finale**: Ciarán's charts from −72 h to landfall, read with the M25/M26 routine, then the outcome. Recap of M01–M26. | all of the above | #69 s00–s01, s74–s84 + ECMWF open-data runs for Ciarán (on G:) | 25–30 min | Ciarán ten-level stack (its only use), seen from outside |

**The block, planning estimate:** about 6–7 h.

### 3a. How #69 v3 is split now (it replaces v3 §A3)
| #69 v3 scenes | Goes to |
|---|---|
| s00–s01 (title, hook) | M20 |
| s02–s28 (frame, surface chart, fronts) | M05 |
| s29–s37, s40–s43 (stations) | M06 |
| s38–s39 (barbs) | M05 |
| s44–s47 (height of a pressure, 500 sheet, levels) | ideas in M07–M09; data reused in M21 |
| s48–s49 (850, temperature advection) | M10 |
| s50–s51 (500 shapes, trough axis) | M21 |
| s52 (jet) | M22 |
| s53–s54 (thickness, rain–snow) | M23 |
| s55–s56 (Trappes skew-T) | M24 |
| s57–s63 (satellites) | U17 (orbits, channels) + M17 (reading) |
| s64–s67 (radar) | U18 (s64–s65 physics) + M18 (s66–s67 reading) |
| s68–s73b (models, ensembles) | M19 |
| s74–s82 (Ciarán stack, impacts, latest chart, climate) | M20 |
| s83–s84 | each movie gets its own recap and end card |

The RM CHECK rows and the functions F1–F26 in `ch00_reading_weather_maps/data_needs.md` carry over by scene.

---

## 4. Part F · "Reading maps to predict…" (39 movies)

**What every F movie does** (the user's brief). It takes a set of **real charts in time order**, as a forecaster saw
them, and works through them:
1. reads them with the M routine;
2. **makes the call** (where, when, how strong, how sure) and freezes it on screen;
3. then **checks the call against what really happened**, with observations that were not used to make it.

The arc stays the house arc. The application section is the "call and check".

**Titles.** Every F title now reads "Reading maps to predict…". The v3 numbers are kept (F01–F28), and F29–F39 are new.
The v3 case table (§B1) still holds for F01–F28, with the case changes listed in §4b.

**Placement.** Right after the map-reading block, and before #1b and the dynamics stages.
- Every concept an F movie uses is taught in stage 0–1, the understanding block, the map block or the F movie itself
  (see the audit in §5).
- Three v3 F items needed dynamics; each moves:
  - the 2-PVU PV maps of v3 F02 move into **R10**, which already teaches isentropic and PV maps, now with a "PV signals
    for forecasters" section;
  - the ageostrophic jet-streak circulation of v3 F03 is given in words from U08 and M22; the full QG version stays in
    R11;
  - the mechanism of beta drift (v3 F17) is shown as an observed drift; the mechanism stays in W06.

**Key to the "time sequence" column.** T0 = the event (landfall, the peak, the first storm). T−n h = charts issued or
valid n hours before it. "Check" = what the call is compared with.

### 4a. The F movies, in viewing order
| Pos | ID | Title | Scope (2–3 lines) | Maps read · time sequence · check | Prereqs | Real cases, open data and sources | Est. length | §5b moments |
|---|---|---|---|---|---|---|---|---|
| 55 | **F01** | Reading maps to predict: the forecaster's method (v3) | The chain from observations to models to forecaster to warning. Time ranges. Ingredients-based thinking. **The 6-step routine** used in every later F movie (pattern → ingredients → timing → model and ensemble → call → check). | Surface, 500, 850, satellite, ensemble · T−72, −48, −24, −6 h · Check: IMD best track, IMERG | M19, M26, U15 | Remal landfall day, 26 May 2024 (ECMWF open data, Himawari-9, IMERG) | 25–30 min | observing-system globe for one 6-h window |
| | | **Cyclones** | | | | | | |
| 56 | **F13** | …the birth of a tropical cyclone: genesis signals (v3) | SST and OHC, shear, mid-level moisture, low-level vorticity, MJO phase, genesis probability from ensembles, how IMD and NHC watch a low. | SST, OHC, 200–850 shear, 700 RH, 850 vorticity, OLR, ENS genesis probability · T−7 d → T−1 d (daily) · Check: the IBTrACS genesis time | U14, U15, U16, U10, M19 | **Mocha 2023** (ERA5, OISST, Himawari-9, ECMWF ENS 2023 ✓); Amphan MJO aside | 30–35 min | SST + shear globe (two bars beside), Bay zoom and back; RH stack at 5 levels over the disturbance (from outside) |
| 57 | **F14** | …a tropical cyclone's strength from satellite: Dvorak and microwave (v3) | IR patterns, the Dvorak idea in words, microwave eyewalls, ASCAT winds, eyewall replacement. | Himawari IR every 10 min, 89 GHz, ASCAT · T−48 h → peak, 3-hourly · Check: the best-track intensity | U17, M17, U15 | **Hagibis 2019** (Himawari-8, GPM GMI, ASCAT); Mocha 2023 microwave | 30–35 min | eye zoom on the Himawari globe; microwave swath over the IR |
| 58 | **F15** | …a landfalling cyclone on radar (v3) | Eye, eyewall, bands, Doppler velocity max, rain rates, beam limits; GPM DPR where there is no ground radar. | NEXRAD reflectivity and velocity, HRRR, GOES · T−12 h → landfall, hourly · Check: COOPS winds and gauges | U18, M18, F14 | **Ian 2022** (KTBW ✓, HRRR and GOES on G:); Amphan DPR (if found) | 30–35 min | 3-D radar volume of the eyewall, orbited **from outside** (v3's "camera through the eye" removed) |
| 59 | **F17** | …the track: steering (v3, re-scoped) | Deep-layer steering, the subtropical ridge, recurvature; beta drift **as an observed drift** (mechanism W06); why tracks are predictable. | 850–200 mean wind, 500 heights, IR · T−5 d → landfall, 12-hourly · Check: our steering track vs the best track, error in km | U15, M21, M25 | **Fani 2019** (IBTrACS, ERA5, Himawari-8, RDA GFS) | 30–35 min | globe with steering streaks and Fani's track drawing; zoom to Odisha and back |
| 60 | **F16** | …the intensity: rapid intensification (v3) | RI definition, ingredients, why intensity is harder than track, model intensity errors. | OHC, shear, IR, microwave · T−72 h → peak, 6-hourly · Check: the best-track intensity curve | F13, F14, F15 | **Amphan 2020**; Ian's Gulf RI | 30–35 min | intensity curve beside a Bay warm-pool globe zoom |
| 61 | **F18** | …with ensembles and the cone (v3) | Ensemble tracks, strike probability, the NHC cone, consensus, GFS vs IFS vs AIFS, and what the cone leaves out. | ENS `tf` tracks, GEFS, NHC cones · T−5 d → landfall, daily runs · Check: the best track vs the cone | F17, M19 | **Helene 2024**; Remal 2024 vs the IMD official track | 30–35 min | 51 member tracks on a globe, the cone forming |
| 62 | **F19** | …storm surge (v3) | Wind setup, inverse barometer, tides, the shelf; why the Bay is the surge hotspot; shelters and warnings. | Wind radii, MSLP, bathymetry, tide tables · T−48 h → landfall · Check: surveyed surge (cited), COOPS, USGS HWMs | F17, M08, M01 (isobaths) | **Sidr 2007, Aila 2009**, Nargis contrast, **Katrina 2005**, Ian, Haiyan in one line (v3) | 35–40 min | 3-D shelf with the surge dome (vertical exaggeration said), Meghna zoom tour and back |
| | | **Extratropical storms and windstorms** | | | | | | |
| 63 | **F02** | …where a low will form and deepen: pressure falls, vorticity and jet support (v3 F02, **re-scoped**) | Tendency maps, 500-hPa vorticity advection, the upper trough approaching a surface front, jet-exit support (from v3 F03's basics). **The 2-PVU PV part moves to R10.** | Isallobars, 500 vorticity, 250 isotachs, surface · T−48, −36, −24, −12, 0 h · Check: the ERA5 low and its central-pressure curve | M25, M21, M22, U10, U11 | Grayson, Jan 2018 (ERA5) | 30–35 min | 500 and surface maps stepping in time side by side; vorticity stack at 5 levels (from outside) |
| 64 | **F03** | …the support aloft: jet streaks and divergence (v3, re-scoped to words) | The four-quadrant jet-streak rule in words, coupled jets, troughs digging. The ageostrophic and QG version stays in R11. | 250 isotachs, divergence, 500 · T−48 → 0 h · Check: where the low deepened most | M22, U08, U02 | US Christmas 2022 cyclogenesis (Elliott's upper support) | 25–30 min | 3-D jet streak with rising and sinking arrows (from outside) |
| 65 | **F05** | …windstorms and bomb cyclones (v3, **extended**) | The bomb criterion, signals 1–3 days ahead, **the sting jet and damaging gusts**, gust maps, model and ensemble low positions. **Added:** the windstorm warning call verified against gust observations. | Surface, 500, 250, WV, gust forecasts · T−96 → 0 h, 12-hourly runs · Check: ISD gusts, ERA5 track | F02, F03, M19, U11 | **Ciarán 2023** (on G:, ECMWF open data runs) + **Eunice, 18 Feb 2022** (sting jet; ERA5, ISD gusts; Met Office records cited) + Grayson (deepening rate) | 35–40 min | globe follow of Ciarán's ensemble lows, back out |
| | | **Rainfall and heavy rainfall** | | | | | | |
| 66 | **F29** | …rainfall: will it rain, where, when and how much (**new**) | The everyday call. Ingredients for rain (moisture, lift, instability), the timing of a front, PoP (probability of precipitation) and QPF (amount) in plain words, showers vs steady rain, how to read the precipitation panel. | Surface fronts, 850 RH and θe, 700 RH, precipitation panel, radar loop · T−48, −24, −12, −3 h · Check: IMERG + ISD gauge totals, and a hit/miss table for 10 stations | M19, M26, U06, M04 | **A: an ordinary frontal rain day over Ireland/Britain** (scout picks in 2024–25: 5–20 mm, with ECMWF open data); **B: a Dhaka pre-monsoon day with showers vs a dry day** (ERA5, IMERG, Himawari-9, ISD Dhaka) | 25–30 min | none (maps, radar loop) |
| 67 | **F04** | …a moisture plume: PW, IVT and atmospheric rivers (v3) | PW, IVT (derived), the AR threshold, plumes on WV, standardised PW anomaly (SD from M08). | TCWV, IVT, WV imagery · T−5 d → landfall · Check: the observed IVT and rain | U06, M17, M08 | California ARs Jan 2023 (ERA5 IVT, GOES-18 WV) | 25–30 min | IVT filament globe, zoom along the AR and back |
| 68 | **F21** | …heavy rainfall I: atmospheric rivers and mountains (v3) | IVT meets terrain, the rain shadow, upslope rain ≈ IVT × slope, the AR scale, Cherrapunji. | IVT, 850 wind, DEM, QPF · T−72 → 0 h · Check: MRMS / IMERG totals | F04, U06, M01 | California Jan 2023 + **Sylhet/Meghalaya Jun 2022** (IMERG, ERA5) | 30–35 min | Khasi Hills relief globe zoom and back (not U06's view: this one is a time loop of the rain) |
| 69 | **F20** | …heavy rainfall II: tropical-cyclone rain and stalled storms (v3) | Rate × duration, slow motion, the right-front quadrant, the predecessor rain event, inland orographic rain, QPF. | TC track forecast, steering, QPF, radar, IMERG · T−5 d → T+3 d · Check: Stage IV / MRMS / IMERG totals | F15, F17, U06 | **Harvey 2017** + **Helene 2024** | 30–35 min | accumulated-rain sheet over the Appalachians (vertical exaggeration said) |
| 70 | **F22** | …heavy rainfall III: training storms, cut-off lows and flash floods (v3) | Back-building and training, stationary boundaries, cut-off lows over warm seas, flash-flood guidance. | 500 cut-off, SST, 850 θe, radar loop · T−72 → 0 h · Check: IMERG, AEMET totals (cited), MRMS | U12, M21, M18 | **Valencia DANA 2024** + Kentucky 2022 | 30–35 min | z500 cut-off on a globe, Valencia zoom and back |
| 71 | **F30** | …monsoon onset and breaks (**new**) | The IMD onset criteria for Kerala (rain at 14 stations, westerly depth, low OLR) and Bangladesh onset. Active and break spells, the BSISO/MJO phase as a 2–4 week signal, a cyclone delaying onset. | 850 winds, OLR, TCWV, BSISO phase diagram, IMERG · T−20 d → onset, daily · Check: the IMD-declared onset date (cited) and IMERG | U16, M19, F13 | **2023 onset delayed by Cyclone Biparjoy** (Kerala 8 Jun 2023, IMD cited) + **2024** (Kerala 30 May, with Remal) (ERA5, NOAA OLR, IMERG, ECMWF open data; BSISO index source to verify) | 25–30 min | globe of 850-hPa winds switching on over the Arabian Sea and Bay, zoom to Kerala and back |
| 72 | **F23** | …monsoon depressions and monsoon floods (v3) | The monsoon trough, depressions moving west-northwest, heaviest rain southwest of the centre (checked on the case). | MSLP, 850 vorticity, IMERG · T−5 d → T+3 d · Check: IMERG, Sentinel-1 extent | U16, F04, F13 | Scout-picked depression (candidate Aug 2024 Bangladesh–Tripura with the Feni floods) | 25–30 min | vorticity stack at 4 levels through the depression (from outside) |
| | | **Floods: geography matters** | | | | | | |
| 73 | **F31** | …floods I: why geography decides who floods (**new**) | From rain to river: the catchment, infiltration vs runoff (soil type, saturation, land cover, cities), travel time down the river, floodplains. The **DEM** as a gridded contour map (M01), slope, flow direction, and **HAND** (height above the nearest drainage) as a flood-prone map. Why the same rain floods one valley and not the next. | IMERG accumulation (daily), DEM, HAND, rivers, soil texture, land cover, ERA5-Land soil moisture · T−10 d → peak: antecedent soil wetness, then the rain days · Check: the observed flood extent (from F32) vs the HAND-predicted zone | M01, U06, F21, F23 | **Sylhet–Sunamganj, Jun 2022** (Meghna–Surma basin under the Meghalaya rain) + **Pakistan, Aug 2022** (Indus; GEE frames on G:, `raw/GEE/gee_indus_flood_2022`). All in **Google Earth Engine**: `COPERNICUS/DEM/GLO30`, `MERIT/Hydro/v1_0_1` (HAND, flow direction; licence to verify, dual CC BY-NC 4.0 / ODbL), `WWF/HydroSHEDS` rivers and basins (free with credit), `ESA/WorldCover/v200` (CC BY 4.0), OpenLandMap soil texture (CC BY-SA 4.0), `ECMWF/ERA5_LAND`, `NASA/GPM_L3/IMERG_V07`, `JRC/GSW1_4` permanent water | 30–35 min | **3-D DEM flyover** of the Surma basin from Meghalaya down to the haor wetlands, seen from above and outside (vertical exaggeration said), then back out; a layer stack of DEM / soil / land cover / HAND over the same area (4 layers, from outside) |
| 74 | **F32** | …floods II: inundation maps and animations from Sentinel-1 in Google Earth Engine (**new**) | Why radar sees floods through cloud (U18: smooth water is dark). Before/after **change detection** (dB difference, a threshold derived on screen, Otsu named), masking permanent water (JRC) and steep slopes (HAND > 15 m). Errors: flooded forest and towns (double bounce), wind-roughened water. Then **an inundation animation**, one frame per pass. | Sentinel-1 VV backscatter, every pass (12-day repeat on one orbit while only S1A flew, Dec 2021 – 2025; ascending + descending ≈ 6 days); IMERG accumulation beside · pre-flood baseline → each pass through the peak → recession · Check: Copernicus EMS / GFM extents and UNOSAT maps (cited), MODIS/VIIRS where cloud-free | F31, U18 | **Pakistan Jun–Oct 2022** (animation over Sindh; the frames already on G:) + **Sylhet Jun 2022** + **Feni Aug 2024** + **Valencia Oct 2024** (urban limits). GEE `COPERNICUS/S1_GRD` (Copernicus open; "contains modified Copernicus Sentinel data"), project `uhiphd`, `.venv-maps`; `GLOBAL_FLOOD_DB/MODIS_EVENTS/V1` for a 2000–2018 contrast (Bangladesh 2004/2007); Copernicus GFM (open) | 30–35 min | **inundation animation** draped on the DEM, the camera hovering outside; a globe zoom to Sindh and back; before/after swipe |
| 75 | **F33** | …floods III: river floods days ahead with GloFAS and river gauges (**new**) | River discharge and **return periods** (from U06), how GloFAS turns forecast rain into river flow (ensemble discharge, exceedance probabilities), reading a gauge hydrograph (rise, crest, fall), the warning chain (FFWC, CWC and NWS described; no open archive for the South Asian ones, said plainly). | GloFAS ensemble discharge maps and hydrographs, gauge time series, IMERG · T−10 d → crest, daily runs · Check: the observed gauge crest and the Sentinel-1 extent (F32 method) | F31, F32, M19 | **Helene, Sep 2024**: USGS NWIS gauges in western North Carolina (French Broad at Asheville; public domain) with GloFAS forecasts + **Brahmaputra/Jamuna, Jul 2024** (GloFAS vs Sentinel-1; FFWC bulletins cited). **GloFAS** through the CEMS Early Warning Data Store (ECMWF login; CC BY 4.0; access to verify) | 30–35 min | river-network globe zoom (HydroRIVERS) onto the Brahmaputra and back; hydrograph beside the map |
| | | **Thunderstorms, lightning, hail, tornadoes** | | | | | | |
| 76 | **F06** | …thunderstorms: the ingredients on maps and soundings (v3) | CAPE and CIN in use, deep-layer shear, SRH, the cap, lifting mechanisms, composite parameters in words. | 12Z soundings, CAPE, 0–6 km shear, surface dew points and fronts, 850 LLJ · T−24, −12, −6 h · Check: SPC storm reports | M24, U12, U13 | Moore, 20 May 2013 (ERA5, IGRA2 OUN) | 30–35 min | wind stack at 6 levels over Oklahoma (from outside) |
| 77 | **F07** | …storm types and damaging winds: cells, squall lines, derechos, supercells, downbursts (v3, **extended** with v3 F09's downbursts) | Single cells to supercells on radar and IR; the bow echo, the rear-inflow jet, **downbursts and microbursts** (velocity divergence near the ground). | Radar reflectivity and velocity, GOES IR, GLM · hourly loop through the event · Check: SPC wind reports | F06, M17, M18 | **Dakotas derecho 2022** + Iowa derecho 2020 (KDVN ✓) | 30–35 min | 3-D supercell from a real radar volume (from outside) |
| 78 | **F34** | …lightning (**new**; the lightning half of v3 F09) | Where and when lightning strikes; flash density from GOES **GLM**. The **lightning jump** as a sign of a strengthening storm. Night storms and the Catatumbo hot spot. The South Asian gap (no GLM; ISS-LIS sparse) and why Bangladesh's lightning deaths make it matter. | GLM flash-extent density every 5 min, IR, radar · T−60 min → the severe report · Check: the reports after the jump, and the lightning count vs the forecast area | U12, U17, M17, F07 | Iowa derecho 2020 (GLM ✓ probed, from v3 F09) + **Lake Maracaibo** (GLM climatology, GOES-16/18 AWS) + ISS-LIS / TRMM LIS climatology over Bangladesh and Meghalaya (GHRC, Earthdata); Bangladesh lightning deaths (cited) | 25–30 min | GLM flashes as a 3-D point cloud above the map (from outside); globe zoom to Lake Maracaibo and back |
| 79 | **F09** | …hail (v3 F09, **re-scoped** to hail) | High dBZ above the freezing level, the three-body scatter spike, MESH, the freezing level on the sounding, why large hail needs strong updrafts and shear. | Radar volume, MESH, sounding · T−6 h → the storm, 5-min volumes · Check: SPC hail reports (sizes) | U05, U13, M18, M24 | A 2023–24 US hail day (scout; SPC + MRMS MESH) + Bangladesh nor'wester hail (cited) | 25–30 min | radar volume slices at 4 tilts round the hail core (from outside) |
| 80 | **F08** | …tornadoes (v3) | Hook, couplet, ΔV, dual-pol debris signature, range limits. | NEXRAD velocity + CC, sounding, SPC mesoanalysis-like maps from ERA5 · T−3 h → touchdown, volume by volume · Check: the NWS damage track | F07, M18, U13 | Moore 2013 + Mayfield 2021 | 30–35 min | 4 radar tilts round the couplet (from outside) |
| 81 | **F11** | …nor'westers (kalbaishakhi) (v3) | Moist southerlies vs dry northwesterlies, the boundary, high April–May CAPE, squall lines moving southeast, overshooting tops, hail and tornadoes, observing gaps. | 850 winds, θe, Kolkata/Dhaka sounding, Himawari IR loop · T−24 h → the squall, hourly · Check: IMERG, ISD gusts, press-reported damage (cited) | F06, F07, U16 | Bara–Parsa 2019 + a Bangladesh nor'wester day 2023–24 | 30–35 min | Bengal-delta globe zoom with the two air streams, back out; θe stack (from outside) |
| 82 | **F10** | …from outlook to warning: a severe-storm day hour by hour (v3, **case changed**) | SPC Day 1–3 outlooks, watches vs warnings, lead time, false alarms, impact-based warnings; IMD/BMD warnings described. | SPC outlooks, watch boxes, warning polygons, radar · Day −3 → the event, hourly on the day · Check: reports vs polygons (hit, miss, false alarm) | F06–F09 | **Rolling Fork, 24 Mar 2023** (SPC, IEM polygons, NEXRAD KDGX); Mayfield timeline aside (Moore stays in F06/F08) | 25–30 min | map timeline only |
| 83 | **F12** | …the next two hours: nowcasting (v3, **case changed**) | Extrapolation (our tested optical-flow function), growth and decay limits, the two-hour wall, satellite nowcasting where there is no radar. | Radar loop, satellite loop · T−2 h → T0 in 5-min steps · Check: our nowcast vs the observed radar (scored) | M18, M26, F07 | **New York City flash flood, 29 Sep 2023** (KOKX, MRMS) + a satellite-only nowcast of the F11 nor'wester (Himawari-9) (Kentucky stays in F22) | 25–30 min | radar field advected forward with the vector field animated |
| | | **Winter** | | | | | | |
| 84 | **F24** | …snowfall and blizzards (v3 F24, **re-scoped**: freezing rain moves to F35) | Precipitation type from thickness and 850 temperature, snow-to-liquid ratio, **lake-effect** bands (cold air over a warm lake: U14, M12), nor'easter structure, blizzard criteria, flash freezes. | 1000–500 thickness, 850 T, lake SST, radar, surface · T−72 → 0 h · Check: snowfall reports (GHCN-D, NWS), visibility (ISD) | M23, M24, F05, U05 | **Elliott, Dec 2022** (Buffalo; ERA5, GOES-16, KBUF, IGRA2) | 30–35 min | skew-T beside the lake band; globe follow of the Arctic front |
| 85 | **F35** | …freezing rain and ice storms (**new**) | The warm nose on the skew-T, surface temperature just below 0 °C, how long it lasts, ice accretion (mm) and why ~10 mm brings down lines and trees. Sleet vs freezing rain. | Soundings, 850 T and 2-m T, thickness, METAR FZRA · T−48 → 0 h · Check: METAR precipitation-type reports, outages (cited) | U05, M23, M24 | **Quebec, 5 Apr 2023** (ERA5, IGRA2 Maniwaki/Albany, IEM METAR; Hydro-Québec outages cited) + **Jan 1998 ice storm** (ERA5) as history | 25–30 min | temperature stack with the warm nose (not U05's case; from outside) |
| 86 | **F25** | …fog (v3 F25, **re-scoped**: dust moves to F36) | Radiation fog (clear sky, light wind, small dew-point depression), advection fog, the night-fog RGB, fog lifting by day, Indo-Gangetic winter fog. | Evening dew-point depression map, wind, sounding inversion, night-fog RGB · 18 local → 09 local, hourly · Check: ISD visibility (Delhi, Dhaka, Kolkata) | U07, M17, M24 | Indo-Gangetic fog (scout picks, Dec 2024 – Jan 2025; Himawari-9, MODIS, ERA5, ISD) | 25–30 min | night-fog RGB draped on a globe, Ganges-plain zoom and back |
| | | **Heat, cold, dust, fire, drought** | | | | | | |
| 87 | **F26** | …heatwaves (v3) | Blocking and sinking air, soil-moisture feedback, wet-bulb temperature and heat index, forecasting heat days ahead. | z500, 850 T, soil moisture, T2m forecasts · T−10 d → peak · Check: ISD maxima, records (cited) | U09, U07, M13, M21 | South Asia Apr 2024 + UK 19 Jul 2022 | 25–30 min | T2m anomaly globe with z500 contours, Bangladesh zoom and back |
| 88 | **F37** | …cold waves, and the polar vortex link (**new**) | Arctic air masses (M04), the trough that brings them south, wind chill, the stratospheric polar vortex as a **2–6 week** signal (U09): when it helps and when it does not. A South Asian cold wave with fog (the cold-day mechanism). | z500, 850 T, MSLP, 10-hPa height and 60° N wind, AO index · T−4 weeks (stratosphere) → T−5 d → T0 · Check: GHCN-D minima, records | U09, M04, M21, F25 | **US mid-Jan 2024 Arctic outbreak** (ERA5, GHCN-D, CPC AO; the scout checks the vortex state and the narration says what it was) + **Bangladesh/north India cold wave, Jan 2024** (ERA5, ISD; BMD cited; scout verifies). G03 and CE01–CE03 keep 2019, 2021 and 2025–26. | 30–35 min | polar-cap globe of 10-hPa height (bar beside); a z stack at 10/50/250/500/850 hPa (from outside; not G03's levels or date) |
| 89 | **F36** | …dust storms (**new**; the dust half of v3 F25) | Haboobs from thunderstorm outflow (U12), dust from strong dry winds, the dust RGB, aerosol optical depth (AOD), visibility. | Surface wind, outflow on radar/IR, dust RGB, CAMS AOD forecasts · T−24 h → T0 · Check: ISD visibility, MODIS AOD | U12, M17, U07 | **North India, 2 May 2018** (v3 case; Himawari-8, MODIS AOD, CAMS) + **Saharan plume, Jun 2020** (GOES-16 dust RGB, CAMS) | 25–30 min | dust plume on the globe crossing the Atlantic, zoom to the Caribbean and back |
| 90 | **F38** | …fire weather (**new**) | Low humidity, strong and gusty downslope winds (U07 föhn and Santa Ana), dry fuels; fire-weather indices in words; red-flag days. | MSLP gradient, 700 wind, RH, fuel dryness, GOES fire detections · T−72 → 0 h · Check: FIRMS detections, ISD gusts, burned area (cited) | U07, M03, M19 | **Los Angeles, 7–8 Jan 2025** (Santa Ana; ERA5, ISD/IEM ASOS, GOES-18 FDC, FIRMS; impacts cited) + **Maui, 8 Aug 2023** (Dora's pressure gradient + downslope winds) | 25–30 min | 3-D terrain of the Santa Monica and San Gabriel mountains with downslope wind streaks (from outside) |
| 91 | **F39** | …drought onset (**new**) | Drought is slow: rain deficit → soil moisture → vegetation → rivers. The SPI and SPEI (standardised anomaly from M08) and **flash drought** (heat + no rain + wind). Persistent ridges (U09), the ENSO link (U14). | Monthly rain anomaly, SPI-1/3, ERA5-Land soil moisture, NDVI, z500 anomaly · T−3 months → onset, weekly · Check: US Drought Monitor / European Drought Observatory maps (open, cited) | U09, U14, M08, F26 | **US flash drought 2012** (USDM, ERA5-Land, MODIS NDVI) + **Europe 2022** (EDO, ERA5-Land) | 25–30 min | soil-moisture anomaly globe stepping weekly, Midwest zoom and back |
| | | **From forecast to action** | | | | | | |
| 92 | **F27** | …and act: warnings and impacts (v3) | Bangladesh signals and the CPP, IMD colours, NHC products, evacuation lead time, the fall in cyclone deaths, flood, landslide and crop impacts. | Warning products in time order · T−72 h → landfall · Check: outcomes (cited) | F17–F19, F33 | Sidr/Nargis, Fani, Amphan (v3) | 25–30 min | map timeline |
| 93 | **F28** | …a Bay of Bengal cyclone end to end (v3 capstone) | Day −7 → landfall + 2 days, with all the F steps, now including rain → river → inundation (F31–F33). | Everything · T−7 d → T+2 d · Check: IBTrACS, IMERG, Sentinel-1 extent, impacts | F01–F39 | **Remal 2024** (+ Sentinel-1 over the Sundarbans coast in GEE) | 40–50 min | full house-globe sequence, back out |

**The series, planning estimate:** about 19–21 h for 39 movies.

### 4b. Case changes against v3 §B1 (all other v3 cases unchanged)
- F07 takes the Iowa derecho for downbursts. F34 takes it for lightning, the job v3 F09 gave it.
- F10 moves from Moore to **Rolling Fork 2023**, so that Moore is not used three times.
- F12 moves from Kentucky to **NYC 29 Sep 2023**, so that Kentucky is not used twice.
- F05 adds **Eunice 2022** for the sting jet.

**Bay of Bengal cases (≥ 5).** There are 7:
- Sidr, Aila and Nargis (F19, F27);
- Fani (F17);
- Amphan (F16);
- Mocha (F13, F14);
- Remal (F01, F18, F28, F30).

The Bay also appears in F23, F31–F33, F11 and F25.

**US cases (≥ 2).** There are 4: Katrina (F19), Harvey (F20), Ian (F15, F16, F19) and Helene (F18, F20, F33).

**New cases, open data not yet probed for v4.** The research scout probes them before each storyboard:
- Eunice 2022;
- Rolling Fork 2023;
- NYC 2023;
- Biparjoy 2023;
- Sylhet 2022 Sentinel-1;
- Feni 2024;
- Brahmaputra 2024;
- Quebec 2023;
- Saharan plume 2020;
- LA 2025;
- Maui 2023;
- the 2012 and 2022 droughts;
- the Jan 2024 cold waves.

Each has a documented open archive:
- ERA5;
- IMERG;
- GOES on AWS;
- NEXRAD on AWS;
- Sentinel-1 in Earth Engine;
- USDM and EDO;
- FIRMS;
- GHCN-D;
- USGS NWIS.

### 4c. The Earth Engine flood recipe (F31–F33, reused by CE11, CE15, CE16)
- **Route.** Earth Engine (project `uhiphd`, the user's account, noncommercial tier). Run from `.venv-maps`, with TEMP
  on G:. Export through `fluidpy.data.fetch(retrieve=…)` → `raw/GEE/…`, and record each export in
  `data/registry.yaml`. This is the route already used for GOES-19 and the Indus 2022 frames.
- **New tested functions:**
  - `fluidpy.diag.rs.sar_change_flood(pre_db, post_db, threshold_db, perm_water, hand, hand_max)`;
  - `fluidpy.diag.rs.otsu_threshold`;
  - `fluidpy.diag.hydro.{hand_mask, return_period_gumbel}`;
  - `fluidpy.data.glofas`;
  - `fluidpy.data.usgs_nwis`.

  The scratch-vs-library parity rule applies in the notebook.
- **Animation.** One frame per Sentinel-1 pass, labelled with its date. Frames are never interpolated between passes:
  the time steps are real acquisition dates. The narration says the revisit (12 days on one orbit while S1A flew alone;
  Sentinel-1C has added passes since 2025).
- **Honesty.** Every map states:
  - the threshold;
  - the masks;
  - the passes used;
  - the known misses (flooded vegetation, towns, wind roughening).

  Extents are compared with Copernicus GFM/EMS and UNOSAT (cited), and never claimed as official.

---

## 5. Dependency audit: every concept used in a reading or predicting movie → where it is first taught

"First used" means the first M or F movie that relies on it. "Itself" means the movie teaches it on screen before
using it. **No row is used before its teaching movie in the viewing order** (positions are in §6).

| Concept | First taught (pos) | First used in M/F (pos) |
|---|---|---|
| Latitude, longitude, degree length, distance on a map | #5 (9) | M05 (41) |
| Projections, Tissot, polar view | #5 (9) | M05 (41) |
| Partial derivative, ∂/∂t at a place | #4 (8) | M06 (42) |
| Gradient, spacing → strength | #6 (10) | M05 (41) |
| Advection −v·∇T | 0.1b (2) | M10 (43) |
| Pressure, hPa, hydrostatic, sea-level reduction | 0.3 (4) | M05 (41) |
| Dew point, RH, saturation (first pass) | 0.3 (4) | M06 (42) |
| Air masses, fronts (first pass), front symbols | 0.3 (4), M04 (28) | M05 (41) |
| Subtropical highs, trades, westerlies | 0.3 (4) | F17 (59) |
| Contour, interval, isobar, isotherm, isotach, isohypse, isobath; highs, lows, ridges, troughs, cols | M01 (11) | M05 (41) |
| Terrain contours, DEM as a gridded height map | M01 (11), F31 itself | F31 (73) |
| Pressure-gradient force | U01 (12) | M05 (41) |
| Sea breeze | U01 (12), U07 (27) | F25 (86) |
| Coriolis, f = 2Ω sin φ, hemisphere sign | M03 (13) | M05 (41) |
| Geostrophic wind, Buys Ballot, equatorial failure | M03 (13) | M05 (41) |
| Gradient wind, cyclostrophic balance | M03 (13) | F08 (80) |
| Friction, cross-isobar inflow | M03 (13) | M05 (41) |
| Convergence, divergence, rising and sinking air | U02 (14) | M22 (45) |
| ω (Pa/s) as vertical velocity | M07 (15) | M22 (45) |
| Pressure as a vertical coordinate, isobaric surface | M07 (15) | M10 (43) |
| Geopotential, geopotential height, dam | M08 (16) | M10 (43) |
| Height contours act like isobars | M08 (16) | M21 (44) |
| Hypsometric equation, thickness, warm columns taller | M08 (16) | M23 (46) |
| Anomaly, standard deviation (in words) | M08 (16) | F04 (67) |
| Blocking high, cut-off low (observed) | M08 (16), U09 (30) | M21 (44) |
| Standard levels and what each shows | M09 (17) | M10 (43) |
| Radiation balance, infrared cooling at night | M16 (18) | F25 (86) |
| Brightness temperature, WV absorption | M16 (18), U17 (38) | M17 (49) |
| Environmental lapse rate, inversions, tropopause | U03 (19) | M24 (48) |
| First law, dry adiabatic lapse rate, θ | M12 (20) | M24 (48) |
| Moist adiabat, latent heat, θe | M12 (20) | M10 (43) |
| Absolute vs conditional instability, parcel method | M12 (20) | M24 (48) |
| Clausius–Clapeyron, 7 % per K, mixing ratio | M13 (21) | F04 (67) |
| Wet-bulb temperature | M13 (21) | F26 (87) |
| LCL, CAPE, CIN | M13 (21) | M24 (48) |
| Skew-T lines, LFC, EL, freezing level | M14 (22) | M24 (48) |
| Four lifting mechanisms, cloud types | M15 (23) | M06 (42) |
| Warm rain, drop sizes | U04 (24) | M06 (42) (present weather) |
| Ice process (Bergeron), snow, graupel, hail growth | U05 (25) | M06 (42) |
| Precipitation type, warm nose, freezing rain, sleet | U05 (25) | M23 (46) |
| Rain rate, stratiform vs convective | U06 (26) | M18 (50) |
| Precipitable water, IVT, atmospheric river | U06 (26) | F04 (67) |
| Orographic rain, rain shadow | U06 (26) | F21 (68) |
| Return period | U06 (26) | F22 (70) |
| Boundary layer, day–night cycle, surface energy budget | U07 (27) | F26 (87) |
| Nocturnal low-level jet | U07 (27) | M10 (43) |
| Föhn and downslope winds | U07 (27) | F38 (90) |
| How fog forms (four types) | U07 (27) | F25 (86) |
| Dryline, squall line | M04 (28) | F06 (76) |
| Thermal wind (in words), jets, jet streak entrance/exit | U08 (29) | M22 (45) |
| Vertical wind shear | U08 (29), U13 (34) | F06 (76) |
| Troughs and ridges as moving waves | U09 (30) | M21 (44) |
| Polar vortex (two kinds), SSW in one picture | U09 (30) | F37 (88) |
| Sinking under ridges → warming | M12 (20), U09 (30) | F26 (87) |
| Vorticity, sign, vorticity maxima, vorticity advection → rising | U10 (31) | M21 (44) |
| Cyclone life cycle, occlusion, conveyor belts, dry slot | U11 (32) | M05 (41) |
| Bomb cyclone (words) | U11 (32) | F05 (65) (criterion computed there) |
| Sting jet | F05 itself (65) | F05 (65) |
| Thunderstorm life cycle, outflow boundary, gust front | U12 (33) | M17 (49) |
| Training, back-building, MCS | U12 (33) | F22 (70) |
| Lightning physics | U12 (33) | M17 (49) (GLM) |
| Hodograph, helicity, supercell, mesocyclone | U13 (34) | M18 (50) |
| Tornado formation, downbursts, derechos, large hail | U13 (34) | F07 (77) |
| SST, evaporation, ocean heat content, mixed layer, cold wake | U14 (35) | F13 (56) |
| El Niño (one picture) | U14 (35) | F39 (91) |
| Tropical-cyclone ingredients, 26.5 °C, 5° rule, structure, warm core | U15 (36) | F01 (55) |
| Steering flow (words) | U15 (36) | M25 (52) |
| Beta drift (observed drift; mechanism W06) | F17 itself (59) | F17 (59) |
| Monsoon, onset, active and break, monsoon depression | U16 (37) | F30 (71) |
| MJO / BSISO in words | U16 (37) | F13 (56) |
| Geostationary vs polar orbits, VIS, IR, WV channels | U17 (38) | M17 (49) |
| Microwave, scatterometer, GLM instrument | U17 (38) | M17 (49), F14 (57) |
| Radar ranging, beam height, dBZ, Z–R | U18 (39) | M18 (50) |
| Doppler radial velocity, dual-pol (ZDR, CC) | U18 (39) | M18 (50) |
| SAR (smooth water dark) | U18 (39) | F32 (74) |
| Interpolation, assimilation, reanalysis | M02 (40) | M05 (41) |
| UTC vs local, initial vs valid time | M05 itself (41) | M05 (41) |
| Wind barbs | M05 itself (41) | M05 (41) |
| METAR, SYNOP, station model, tendency code | M06 itself (42) | M06 (42) |
| Temperature advection on 850 hPa | M10 itself (43) | M10 (43) |
| Trough axis method, 5520/5640-m lines | M21 itself (44) | M21 (44) |
| Thickness advection, 540/528 rules and their limits | M23 itself (46) | M23 (46) |
| Cross-section, Hovmöller | M11 itself (47) | M11 (47) |
| RGB composites, overshooting tops | M17 itself (49) | M17 (49) |
| Radar artefacts, bright band | M18 itself (50) | M18 (50) |
| NWP, ensemble, member, spread, probability, verification words, RMSE | M19 itself (51) | M19 (51) |
| Pressure tendency map, isallobars, motion vector | M25 itself (52) | M25 (52) |
| Deepening rate, extrapolation vs persistence vs model, dprog/dt | M26 itself (53) | M26 (53) |
| The 6-step forecast routine | F01 itself (55) | F01 (55) |
| Dvorak, RI definition, cone of uncertainty, surge parts, tide (observed) | F14, F16, F18, F19 itself | same |
| PoP, QPF | F29 itself (66) | F29 (66) |
| AR scale | F21 itself (68) | F21 (68) |
| IMD onset criteria | F30 itself (71) | F30 (71) |
| Catchment, runoff, infiltration, HAND, land cover, soil texture | F31 itself (73) | F31 (73) |
| Change detection, threshold, masks | F32 itself (74) | F32 (74) |
| Discharge, hydrograph, GloFAS exceedance | F33 itself (75) | F33 (75) |
| Lightning jump | F34 itself (78) | F34 (78) |
| MESH, three-body spike | F09 itself (79) | F09 (79) |
| Debris signature | F08 itself (80) | F08 (80) |
| Outlook, watch, warning, POD/FAR | F10 itself (82) (hit/miss from M19) | F10 (82) |
| Optical-flow extrapolation | F12 itself (83), M26 (idea) | F12 (83) |
| Lake effect, snow ratio, blizzard criteria | F24 itself (84) | F24 (84) |
| Ice accretion | F35 itself (85) | F35 (85) |
| Wind chill, AO index | F37 itself (88) | F37 (88) |
| AOD, haboob | F36 itself (89) | F36 (89) |
| Fire-weather indices, fuel dryness | F38 itself (90) | F38 (90) |
| SPI/SPEI, flash drought | F39 itself (91) | F39 (91) |
| Warning systems (CPP, signals, colour codes) | F27 itself (92); stated in F19 (62) | F19 (62) |

**Checks.**
- The audit was written against the viewing positions of §6. Every "first taught" position is smaller than or equal to
  its "first used" position.
- The prerequisites of v3 F movies that pointed to later stages (S05, S08, R07, R09–R11, W06, W07, G01, S01, T11) are
  each replaced in §4a by a U or M movie, or moved (PV to R10).
- No F or M movie now needs T, R, W, S or G.

---

## 6. The full ordered list (176 movies)
Status words:
- **done**: final (§5b retro-fits pending where noted, as in RESUME.md);
- **in progress**: being built;
- **planned (storyboard)**: a storyboard exists;
- **planned**: not started.

| Pos | ID | Title | Stage | Status | Prerequisites | v3 number |
|---|---|---|---|---|---|---|
| 1 | 0.1 | Dot product (v6) | 0 | done | — | 0.1 |
| 2 | 0.1b | Dot product, new version | 0 | done (§5b retro-fit pending) | — | 0.1b |
| 3 | 0.2 | Cross product (full) | 0 | done (§5b retro-fit pending) | 0.1 | 0.2 |
| 4 | 0.3 | Weather basics | 0 | in progress (UF2 fix loop) | — | 0.3 |
| 5 | 1a | Vectors and index notation | 1 | done (§5b retro-fit pending) | 0.1 | 1a |
| 6 | 2 | The cross product (Part 1) | 1 | done | 1a | 2 |
| 7 | 3 | The cross product in physics (Part 2) | 1 | done (§5b retro-fit pending) | 2 | 3 |
| 8 | 4 | Derivatives and Taylor series | 1 | in progress (fix loop 2) | 1a | 4 |
| 9 | 5 | Coordinates: plane, cylinder, sphere | 1 | planned (storyboard) | 1a, 2, 4 | 5 |
| 10 | 6 | The gradient | 1 | planned (storyboard) | 4, 5, 0.1b | 6 |
| 11 | M01 | Contour maps and isolines | M (understanding block) | planned (plan being written) | 5, 6, 0.3 | M01 |
| 12 | U01 | Why air is pushed: the pressure-gradient force | U | planned (new) | 6, 0.3, M01 | — |
| 13 | M03 | Coriolis, geostrophic, gradient and friction winds | M (understanding block) | planned | 2, 3, 5, 6, 0.3, U01 | M03 (extended) |
| 14 | U02 | Convergence, divergence and vertical motion | U | planned (new) | 4, 6, M03 | — |
| 15 | M07 | Pressure as a vertical coordinate | M (understanding block) | planned | 0.3, M01, U02 | M07 |
| 16 | M08 | Geopotential: the height of a pressure surface | M (understanding block) | planned | 4, 6, 0.3, M01, M03, M07 | M08 |
| 17 | M09 | The standard pressure levels | M (understanding block) | planned | M07, M08 | M09 |
| 18 | M16 | The climate machine: sunlight in, infrared out | M (understanding block) | planned | 4, 0.3 | M16 (moved earlier) |
| 19 | U03 | Temperature with height: lapse rate, inversions, standard atmosphere | U | planned (new) | 0.3, M07, M16 | — |
| 20 | M12 | Rising air: first law, adiabats, θ, θe, parcel stability | M (understanding block) | planned | 4, 0.3, M07, U03 | M12 (extended) |
| 21 | M13 | Water in the air: humidity, CC, wet-bulb, LCL, CAPE/CIN | M (understanding block) | planned | M12, 4 | M13 |
| 22 | M14 | The skew-T log-P diagram, in full | M (understanding block) | planned | M12, M13 | M14 |
| 23 | M15 | How clouds form, and cloud types | M (understanding block) | planned | M12, M13, U02 | M15 (extended) |
| 24 | U04 | How rain forms | U | planned (new) | M13, M15 | — |
| 25 | U05 | Ice, snow, hail and precipitation type | U | planned (new) | M13, M14, U04, M08 | — |
| 26 | U06 | How much it rains: rates, moisture supply, mountains | U | planned (new) | U02, M13, M15, U04, U05 | — |
| 27 | U07 | The boundary layer and the day–night cycle | U | planned (new) | M03, M12, M13, M16, U03 | — |
| 28 | M04 | Air masses and fronts | M (understanding block) | planned | 0.3, M01, M03, M12 | M04 (life cycle moved to U11) |
| 29 | U08 | The jet stream: a first look | U | planned (new) | M03, M08, M09, U02 | — |
| 30 | U09 | Waves on the jet: troughs, ridges, blocks, polar vortex | U | planned (new) | U08, M08, M12 | — |
| 31 | U10 | Vorticity in plain words | U | planned (new) | M03, M09, U02, U09, 0.1b | — |
| 32 | U11 | How extratropical cyclones are made | U | planned (new) | M04, U08, U09, U10, U02 | — (from M04's second half) |
| 33 | U12 | How thunderstorms work | U | planned (new) | M14, U05, U02 | — |
| 34 | U13 | Severe storms: shear, supercells, tornadoes, hail, downbursts | U | planned (new) | U12, U08, M03 | — |
| 35 | U14 | The ocean's role in weather | U | planned (new) | M13, M16, U07 | — |
| 36 | U15 | How tropical cyclones form | U | planned (new) | U14, M12, M13, M03, U02, U08 | — |
| 37 | U16 | Monsoons: a first look | U | planned (new) | U14, U06, U08, U15 | — |
| 38 | U17 | How satellites see | U | planned (new) | M16, M15, U12, 3 | — (physics half of M17) |
| 39 | U18 | How radar sees | U | planned (new) | U04, U05, 5, 0.1b, M16 | — (physics half of M18) |
| 40 | M02 | How weather maps are made | M | planned | M01, 0.3 | M02 |
| 41 | M05 | Reading the surface chart | M | planned (scenes in #69 v3) | M01, M03, M04, U11, 5 | M05 |
| 42 | M06 | Station plots: METAR, SYNOP, station model | M | planned (scenes in #69 v3) | M05, M15, U04, U05 | M06 |
| 43 | M10 | Reading upper-air charts I: 850 and 700 hPa | M | planned (scenes in #69 v3) | M05, M08, M09, U07, M04, 0.1b | M10 (re-scoped) |
| 44 | M21 | Reading upper-air charts II: 500 hPa | M | planned (new) | M10, U09, U10 | — |
| 45 | M22 | Reading upper-air charts III: 300/250/200 hPa | M | planned (new) | M21, U08, U02 | — |
| 46 | M23 | Reading thickness charts | M | planned (new) | M08, M10, U05, U08 | — |
| 47 | M11 | Cross-sections and Hovmöller diagrams | M | planned | M04, M08, M10, M21, M22 | M11 |
| 48 | M24 | Skew-T reading practice: eight real soundings | M | planned (new) | M14, U05, U07, U12, U13 | — |
| 49 | M17 | Reading satellite images | M | planned (scenes in #69 v3) | U17, M15, U11, U12 | M17 (re-scoped) |
| 50 | M18 | Reading weather radar | M | planned (scenes in #69 v3) | U18, U12, U13 | M18 (re-scoped) |
| 51 | M19 | Forecast charts, models and ensembles | M | planned (scenes in #69 v3) | M02, M05, M10, M21, M22 | M19 (extended) |
| 52 | M25 | Reading maps over time I: tendencies and motion | M | planned (new) | M05, M21, M17, M18, 4, 5 | — |
| 53 | M26 | Reading maps over time II: development and extrapolation | M | planned (new) | M25, M19 | — |
| 54 | M20 | Reading weather maps: one storm through every chart and through time | M | planned (storyboard v3, to be cut down) | M01–M26 | M20 (extended) |
| 55 | F01 | …the forecaster's method | F | planned | M19, M26, U15 | F01 |
| 56 | F13 | …the birth of a tropical cyclone | F | planned | U14, U15, U16, U10, M19 | F13 |
| 57 | F14 | …strength from satellite: Dvorak and microwave | F | planned | U17, M17, U15 | F14 |
| 58 | F15 | …a landfalling cyclone on radar | F | planned | U18, M18, F14 | F15 |
| 59 | F17 | …the track: steering | F | planned | U15, M21, M25 | F17 (re-scoped) |
| 60 | F16 | …the intensity: rapid intensification | F | planned | F13, F14, F15 | F16 |
| 61 | F18 | …with ensembles and the cone | F | planned | F17, M19 | F18 |
| 62 | F19 | …storm surge | F | planned | F17, M08, M01 | F19 |
| 63 | F02 | …where a low will form and deepen | F | planned | M25, M21, M22, U10, U11 | F02 (PV part to R10) |
| 64 | F03 | …the support aloft: jet streaks and divergence | F | planned | M22, U08, U02 | F03 (re-scoped) |
| 65 | F05 | …windstorms and bomb cyclones | F | planned | F02, F03, M19, U11 | F05 (extended) |
| 66 | F29 | …rainfall | F | planned (new) | M19, M26, U06, M04 | — |
| 67 | F04 | …a moisture plume: PW, IVT and atmospheric rivers | F | planned | U06, M17, M08 | F04 |
| 68 | F21 | …heavy rainfall I: atmospheric rivers and mountains | F | planned | F04, U06, M01 | F21 |
| 69 | F20 | …heavy rainfall II: TC rain and stalled storms | F | planned | F15, F17, U06 | F20 |
| 70 | F22 | …heavy rainfall III: training storms and flash floods | F | planned | U12, M21, M18 | F22 |
| 71 | F30 | …monsoon onset and breaks | F | planned (new) | U16, M19, F13 | — |
| 72 | F23 | …monsoon depressions and monsoon floods | F | planned | U16, F04, F13 | F23 |
| 73 | F31 | …floods I: geography (DEM, rivers, soil, land cover; GEE) | F | planned (new) | M01, U06, F21, F23 | — |
| 74 | F32 | …floods II: Sentinel-1 inundation maps and animations (GEE) | F | planned (new) | F31, U18 | — |
| 75 | F33 | …floods III: GloFAS and river gauges | F | planned (new) | F31, F32, M19 | — |
| 76 | F06 | …thunderstorms: the ingredients | F | planned | M24, U12, U13 | F06 |
| 77 | F07 | …storm types and damaging winds | F | planned | F06, M17, M18 | F07 (+ downbursts from F09) |
| 78 | F34 | …lightning | F | planned (new) | U12, U17, M17, F07 | — (lightning half of F09) |
| 79 | F09 | …hail | F | planned | U05, U13, M18, M24 | F09 (re-scoped) |
| 80 | F08 | …tornadoes | F | planned | F07, M18, U13 | F08 |
| 81 | F11 | …nor'westers (kalbaishakhi) | F | planned | F06, F07, U16 | F11 |
| 82 | F10 | …from outlook to warning | F | planned | F06–F09 | F10 (case changed) |
| 83 | F12 | …the next two hours: nowcasting | F | planned | M18, M26, F07 | F12 (case changed) |
| 84 | F24 | …snowfall and blizzards | F | planned | M23, M24, F05, U05 | F24 (re-scoped) |
| 85 | F35 | …freezing rain and ice storms | F | planned (new) | U05, M23, M24 | — (from F24) |
| 86 | F25 | …fog | F | planned | U07, M17, M24 | F25 (re-scoped) |
| 87 | F26 | …heatwaves | F | planned | U09, U07, M13, M21 | F26 |
| 88 | F37 | …cold waves and the polar vortex link | F | planned (new) | U09, M04, M21, F25 | — |
| 89 | F36 | …dust storms | F | planned (new) | U12, M17, U07 | — (from F25) |
| 90 | F38 | …fire weather | F | planned (new) | U07, M03, M19 | — |
| 91 | F39 | …drought onset | F | planned (new) | U09, U14, M08, F26 | — |
| 92 | F27 | …and act: warnings and impacts | F | planned | F17–F19, F33 | F27 |
| 93 | F28 | …a Bay of Bengal cyclone end to end (capstone) | F | planned | F01–F39 | F28 |
| 94 | 1b | The alternating tensor and triple products | 1 | planned (storyboard) | 1a | 1b (moved later) |
| 95 | T01 | Divergence, flux and Gauss's theorem | T | planned | 6, U02 | T01 |
| 96 | T02 | Curl, circulation and Stokes's theorem | T | planned | 6, 2, U10 | T02 |
| 97 | T03 | The Laplacian; Laplace and Poisson equations | T | planned | T01 | T03 |
| 98 | T04 | The material derivative | T | planned | 4, 0.1b, T01 | T04 |
| 99 | T05 | Vector identities I | T | planned | T01, T02 | T05 |
| 100 | T06 | Vector identities II: the advection term | T | planned | T04, T05 | T06 |
| 101 | T07 | Potentials and the stream function | T | planned | T01–T03 | T07 |
| 102 | T08 | Tensors made easy | T | planned | 1a, 1b, T05 | T08 |
| 103 | T09 | Dimensional analysis, scaling and similarity | T | planned | 4 | T09 |
| 104 | T10 | Ordinary differential equations | T | planned | 4 | T10 |
| 105 | T11 | Statistics of fields | T | planned | M08, M19 | T11 |
| 106 | R01 | Circular motion: centripetal and centrifugal | R | planned | 5, 1b | R01 |
| 107 | R02 | The Coriolis effect, in full | R | planned | 1b, 3, 5, R01, M03 | R02 |
| 108 | R03 | Centripetal vs centrifugal vs Coriolis | R | planned | R01, R02, T09 | R03 |
| 109 | R04 | From F = ma to the equation of motion | R | planned | T04–T06, T09, R02 | R04 |
| 110 | R05 | Geostrophic and ageostrophic wind; gradient, cyclostrophic, inertial | R | planned | R04, M03, T10 | R05 |
| 111 | R06 | Friction and Ekman layers | R | planned | R05, T10 | R06 |
| 112 | R07 | The thermal wind | R | planned | R05, M08, U08 | R07 |
| 113 | R08 | Barotropic vs baroclinic | R | planned | R07 | R08 |
| 114 | R09 | Vorticity, circulation and potential vorticity | R | planned | T02, R05, M12, U10 | R09 |
| 115 | R10 | Isentropic surfaces, isentropic and PV maps (+ PV signals for forecasters, from F02) | R | planned | R09, M12, F02 | R10 (extended) |
| 116 | R11 | Divergence and vertical motion (QG intuition; jet-streak circulation in full) | R | planned | T01, R09, U02, F03 | R11 (extended) |
| 117 | R12 | Geostrophic adjustment and the Rossby radius | R | planned | R05, T10 | R12 |
| 118 | W01 | Partial differential equations | W | planned | T03, T10 | W01 |
| 119 | W02 | Fourier series, transforms and spectra | W | planned | W01 | W02 |
| 120 | W03 | Waves: phase, dispersion, group velocity | W | planned | W02 | W03 |
| 121 | W04 | Buoyancy oscillations, N, and static stability in full | W | planned | M12, T10 | W04 |
| 122 | W05 | Gravity waves and mountain waves | W | planned | W03, W04 | W05 |
| 123 | W06 | Rossby waves and blocking (+ beta drift of cyclones, from F17) | W | planned | W03, R09, U09 | W06 (extended) |
| 124 | W07 | Equatorial waves and the MJO | W | planned | W06, W05, U16 | W07 |
| 125 | S01 | The jet stream (full) | S | planned | R07, W06, M08, M22, U08 | S01 |
| 126 | S02 | Stability and eigenvalue problems | S | planned | T10, W03 | S02 |
| 127 | S03 | Air masses and fronts in depth; frontogenesis | S | planned | M04, R07, T05 | S03 |
| 128 | S04 | Baroclinic (and barotropic) instability | S | planned | S01, S02, R08 | S04 |
| 129 | S05 | Extratropical cyclones in depth | S | planned | S03, S04, R11, U11 | S05 |
| 130 | S06 | Storm tracks | S | planned | S04, S05, T11 | S06 |
| 131 | S07 | Thunderstorms, severe weather and tornadoes in depth | S | planned | M14, R07, R01, U12, U13 | S07 |
| 132 | S08 | Tropical cyclones in depth | S | planned | R05, R06, M13, R01, U15 | S08 |
| 133 | S09 | Monsoons in depth | S | planned | M16, S08, W07, U16 | S09 |
| 134 | S10 | The boundary layer and turbulence | S | planned | R06, T08, W04, U07 | S10 |
| 135 | G01 | The general circulation | G | planned | S06, R06 | G01 |
| 136 | G02 | The stratosphere: ozone, Brewer–Dobson, QBO | G | planned | M16, W07 | G02 |
| 137 | G03 | The polar vortex (full) | G | planned | G02, S01, W06, U09 | G03 |
| 138 | G04 | Water vapour and the tropics | G | planned | M13, G01 | G04 |
| 139 | A01 | Complex variables and conformal mapping | A | planned | W02 | A01 |
| 140 | A02 | Perturbation methods | A | planned | T10, W01 | A02 |
| 141 | O01 | Seawater: equation of state and pressure with depth | O | planned | 0.3, M07, U14 | O01 |
| 142 | O02 | The upper ocean | O | planned | O01 | O02 |
| 143 | O03 | Wind-driven gyres: Sverdrup and western intensification | O | planned | R06, R09, A02 | O03 |
| 144 | O04 | Great currents I: Gulf Stream and Kuroshio | O | planned | O03 | O04 |
| 145 | O05 | Great currents II: Agulhas, Brazil–Malvinas, East Australian | O | planned | O03 | O05 |
| 146 | O06 | Great currents III: eastern boundaries and upwelling | O | planned | R06, O03 | O06 |
| 147 | O07 | Equatorial currents, the undercurrent, the Somali current | O | planned | W07, S09 | O07 |
| 148 | O08 | The Antarctic Circumpolar Current | O | planned | O03 | O08 |
| 149 | O09 | The overturning circulation, AMOC | O | planned | O02, O08 | O09 |
| 150 | O10 | Ocean eddies and mesoscale turbulence | O | planned | S04, S10 | O10 |
| 151 | O11 | Surface waves, tsunamis and tides | O | planned | W03 | O11 |
| 152 | O12 | Sea level and sea ice | O | planned | O02, O09 | O12 |
| 153 | CV01 | ENSO | CV | planned | O07, W07, T11, U14 | CV01 |
| 154 | CV02 | Indian Ocean Dipole | CV | planned | CV01 | CV02 |
| 155 | CV03 | PDO and AMO | CV | planned | CV01 | CV03 |
| 156 | CV04 | NAO and the Arctic Oscillation | CV | planned | S06, G03 | CV04 |
| 157 | CV05 | Southern Annular Mode | CV | planned | CV04 | CV05 |
| 158 | CV06 | Climate change: forcing, feedbacks, observed warming | CV | planned | M16 | CV06 |
| 159 | CV07 | Extremes: heatwaves, droughts, floods (the climate view) | CV | planned | CV06, F26, F31–F33, F39 | CV07 |
| 160 | CE01 | Where is the polar vortex now, and how do we measure it? | CE | planned | G03, T11, M08 | CE01 |
| 161 | CE02 | How a weak vortex reaches the ground: this winter's US cold outbreaks | CE | planned | CE01, CV04, F37 | CE02 |
| 162 | CE03 | The record: past SSWs, US cold outbreaks and the science debate | CE | planned | CE01, CE02, CV06 | CE03 |
| 163 | CE04 | El Niño 2026: how big is it, and could it be the biggest on record? | CE | planned | CV01, T11, M17 | CE04 |
| 164 | CE05 | El Niño 2026 impacts I: rain, drought, fire, vegetation | CE | planned | CE04, F39 | CE05 |
| 165 | CE06 | El Niño 2026 impacts II: food, fisheries, coral, health | CE | planned | CE05 | CE06 |
| 166 | CE07 | The latest hurricane season round the USA, warm oceans and El Niño | CE | planned | F13–F18, CE04, CV06 | CE07 |
| 167 | CE08 | Record-warm years 2023–2026 | CE | planned | CV06, CE04 | CE08 |
| 168 | CE09 | The latest marine heatwaves | CE | planned | O02, CV06 | CE09 |
| 169 | CE10 | The Arctic sea-ice minimum, 2026 | CE | planned | O12, CV06 | CE10 |
| 170 | CE11 | The 2026 South Asian monsoon and Bangladesh floods | CE | planned | S09, F23, F30, F32, F33 (the flood-mapping method; v3 pointed to CE15, which comes later) | CE11 |
| 171 | CE12 | Bay of Bengal cyclone season review, 2026 | CE | planned | F13–F19, F27 | CE12 |
| 172 | CE13 | The California atmospheric-river season | CE | planned | F04, F21 | CE13 |
| 173 | CE14 | Europe's summer 2026 heat | CE | planned | F26, CE08 | CE14 |
| 174 | CE15 | Mapping a disaster from space (method; Derna 2023) | CE | planned | M01, M02, M17, M18, F32, 5, 6 | CE15 |
| 175 | CE16 | Cyclone Ditwah: the Sri Lanka floods and landslides (Nov 2025) | CE | planned | CE15, S08, F20, F21, F32, M17 | CE16 |
| 176 | CE17 | The 2026 Himalayan glacier collapse and outburst flood (Tibet → Nepal) | CE | planned | CE15, CE16, F22, F31, CV06 | CE17 |

**Count check.**

| Stage | Movies |
|---|---|
| 0–1 | 11 |
| U | 18 |
| M | 26 |
| T | 11 |
| R | 12 |
| W | 7 |
| S | 10 |
| G | 4 |
| F | 39 |
| A | 2 |
| O | 12 |
| CV | 7 |
| CE | 17 |
| **Total** | **176** |

**Folders.** These keep their folders:
- 0.1, 0.1b, 0.2, 0.3, 1a, 1b, #2, #3, #4, #5, #6;
- M20 keeps `ch00_reading_weather_maps`.

Proposed new slugs:
- **U movies:** `ch00_u01_pressure_gradient_force`, `ch00_u02_convergence_divergence`, `ch00_u03_temperature_with_height`,
  `ch00_u04_how_rain_forms`, `ch00_u05_ice_snow_hail`, `ch00_u06_how_much_it_rains`, `ch00_u07_boundary_layer`,
  `ch00_u08_jet_stream_first_look`, `ch00_u09_waves_blocks_polar_vortex`, `ch00_u10_vorticity`,
  `ch00_u11_extratropical_cyclones`, `ch00_u12_thunderstorms`, `ch00_u13_severe_storms`, `ch00_u14_ocean_role`,
  `ch00_u15_tropical_cyclones`, `ch00_u16_monsoons_first_look`, `ch00_u17_how_satellites_see`,
  `ch00_u18_how_radar_sees`.
- **The #69 splits:** the v3 slugs.
- **New M and F movies:** `ch00_<id>_<short_title>`.

---

## 7. What changed vs v3
1. **A new stage, U "Understanding weather" (18 new movies)**, is placed before map reading. It covers the user's whole
   list: the PGF, convergence, temperature with height, rain, snow and hail, rain amounts, the boundary layer and fog,
   the jet, waves and blocks and the polar vortex, vorticity, cyclone formation, thunderstorms, severe storms, the
   ocean's role, tropical cyclones, monsoons, and satellite and radar physics.
2. **The 11 v3 concept movies of stage M** (M01, M03, M04, M07, M08, M09, M12–M16) keep their numbers and stage. They
   are watched inside the understanding block, interleaved with U, so that every idea comes before its first use. All
   map *reading* now starts at position 40, not at v3's ~16.
3. **Extensions:**
   - M03: gradient, cyclostrophic and friction winds in full words;
   - M12: latent heat, θe, conditional instability;
   - M13: wet-bulb;
   - M15: the four lifting mechanisms;
   - M16: night cooling and the surface energy budget;
   - M19: verification and probability words;
   - M20: a time-sequence finale.
4. **Re-scopes:**
   - M04 hands its cyclone life cycle to U11;
   - M10 keeps 850 and 700 hPa only;
   - M17 and M18 hand their physics to U17 and U18 and become pure reading;
   - M05 hands tendencies and isallobars to M25;
   - M08 hands the freezing-rain caveat to U05 and M23.
5. **M16 (climate machine) moves from just before the satellite movie to the start of the thermodynamics**, because
   night cooling is needed by inversions, fog and heat (this reverses v3 decision 13).
6. **6 new M movies:** one per upper level (M21 for 500 hPa, M22 for the jet levels), thickness (M23), skew-T practice
   (M24), and **two movies on reading maps over time** (M25 tendencies and motion; M26 development, extrapolation and
   model trends).
7. **F becomes "Reading maps to predict…".**
   - Each movie reads real charts in time order, makes a call and checks it against what happened.
   - It adds **11 movies**: rainfall, monsoon onset and breaks, three flood movies (geography; Sentinel-1 inundation
     maps and animations in Earth Engine; GloFAS and gauges), lightning (GLM), freezing rain and ice storms, dust
     storms, cold waves with the polar-vortex link, fire weather and drought onset.
   - Splits:
     - v3 F09 → F07 (downbursts) + F34 (lightning) + F09 (hail);
     - v3 F24 → F24 (snow) + F35 (freezing rain);
     - v3 F25 → F25 (fog) + F36 (dust).
8. **F moves from after stage G to right after the map block.** Every F prerequisite now points to U or M:
   - the 2-PVU PV signals move to R10;
   - the full jet-streak and QG circulation stays in R11;
   - the mechanism of beta drift goes to W06.
9. **Four F case changes:**
   - F05 adds Eunice 2022;
   - F07 takes the Iowa derecho;
   - F10 uses Rolling Fork 2023;
   - F12 uses NYC 2023.

   The Bay of Bengal cases (7) and the US cases (4) are kept.
10. **#1b moves after F** (before T). Nothing before T needs the alternating tensor. It was already queued there in
    RESUME.md.
11. **§5b corrections** to v3 wording, to the 2026-10-30 rule that stacks are never flown through:
    - "fly under the 850 sheet" (M07);
    - "fly round, through and under" (M08);
    - "fly under it" (v3 F02);
    - "camera through the eye" (F15).

    All are now views from outside. CE04's "camera under the sea surface" becomes a side view of the Pacific section
    from outside.
12. **Prerequisites of later stages are updated** so that they name the U movies they now build on: T01, T02, R07,
    R09–R11, W06, W07, S01, S05, S07–S10, G03, O01, CV01, CV07, CE02, CE05, CE11 and CE15–CE17. Nothing in those stages
    is removed.
13. **Total 176** (v3 141; +18 U, +6 M, +11 F).

## 8. Why motion beats the explainer here (series level)
The ideas of this series change in **time** and in **height**:
- a parcel rising and cooling;
- a front sliding under warm air;
- a cyclone growing under a jet exit;
- a flood spreading pass by pass;
- a call made at T−48 h and then checked.

A static explainer shows one state. The movies show the sequence, which is exactly what the user asked for ("a series
of maps over time — and telling what's going to happen").

## 9. Decisions for the user and the orchestrator
1. **D1: the stage of the 11 concept movies.** They keep their M numbers and are watched in the understanding block
   (recommended: it keeps the v3 crosswalk and folders intact). The alternative is to renumber them as U19–U29, which
   is tidier but breaks the cross-references.
2. **D2: F before the dynamics stages** (recommended: it is what the user wants to reach). The cost is that three F
   items point forward to R10, R11 and W06 for depth only, never for a concept the movie needs.
3. **D3: the Earth Engine flood movies (F31–F33).** They use the existing GEE project route. GloFAS needs the CEMS
   Early Warning Data Store, which takes an ECMWF login; the existing CDS login may cover it, to verify. *Ask the user*
   only if it does not.
4. **The v3 data gaps still hold**, and the user still has to open three accounts: EUMETSAT, ECMWF for TIGGE, and NCAR
   RDA. New gaps:
   - no open river-gauge archive for Bangladesh FFWC or India CWC, so F33 uses GloFAS + Sentinel-1 there and USGS gauges
     in the US;
   - no GLM over South Asia (F34 says so);
   - the BSISO index source is to verify (F30);
   - the licence of MERIT Hydro is to verify (F31; fallback: HAND computed from GLO-30 by our own tested
     `hydro.hand_mask`).
5. **New library work implied:**
   - `fluidpy.diag.rs.{sar_change_flood, otsu_threshold}`;
   - `fluidpy.diag.hydro.{hand_mask, return_period_gumbel}`;
   - `fluidpy.diag.drought.spi`;
   - `fluidpy.diag.fireweather` (a simple index, cited);
   - `fluidpy.data.{glofas, usgs_nwis, ghcnd}`;
   - the v3 list (§ gaps 12).
6. **Retro-fit slots** (from RESUME.md, adjusted to the new order):
   - the §5b retro-fit of cross-product v5 + Part 2 after M01;
   - the §5b retro-fits of #1a (+ wind stack) and 0.1b after M03. v3 had them after M05, which now sits at position 41.

## 10. The first 10 movies to build after #4 and weather basics are final
| Order | ID | Title | Status now | Est. length |
|---|---|---|---|---|
| 1 | #5 | Coordinates: plane, cylinder, sphere | storyboard, plan being amended for §5b | (storyboard measured at build) |
| 2 | #6 | The gradient | storyboard, plan being amended | (storyboard measured at build) |
| 3 | M01 | Contour maps and isolines (height on contour maps first) | plan being written | 25–30 min |
| 4 | U01 | Why air is pushed: the pressure-gradient force | new | 20–25 min |
| 5 | M03 | Coriolis, geostrophic, gradient and friction winds | planned (extended) | 30–35 min |
| 6 | U02 | Convergence, divergence and vertical motion | new | 25–30 min |
| 7 | M07 | Pressure as a vertical coordinate | planned | 18–22 min |
| 8 | M08 | Geopotential: the height of a pressure surface (the full 30–40-min movie) | planned (spec v3 §A5 + §2 change) | 30–40 min |
| 9 | M09 | The standard pressure levels | planned | 15–20 min |
| 10 | M16 | The climate machine: sunlight in, infrared out (+ night cooling) | planned (moved earlier) | 30–40 min |

The next three after these are U03 (temperature with height), M12 (adiabats and θ) and M13 (humidity, CAPE). They
bring the lapse rates and the skew-T (M14, position 22) before any chart is read, as the user asked.

## Adopted (orchestrator, 2026-10-30, under the user's "go with your recommendation")
v4 replaces v3 as the series order.
- **D1:** keep the M numbers and folders.
- **D2:** forecasting comes before the dynamics stages, with pointers forward to R10, R11 and W06.
- **D3:** check whether the CDS login opens GloFAS before F33.
- The scout probes the 13 new v4 cases before their storyboards are written.
