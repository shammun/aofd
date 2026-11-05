# ch00_coordinates_storm — narration (movie-director, 2026-11-05)

Series plan v6 **#5b, position 8**: "Coordinates, Part 2 — Inside a tropical cyclone: turning arrows and cylindrical coordinates" (card: "Coordinates · Part 2" / "Inside a tropical cyclone" / "turning arrows and cylindrical coordinates"; the spoken title stays short; two storms, Ian and Amphan, in the content).
Split plan `movies/ch00/ch00_coordinates/split_plan.md` §2c. House style `movies/HOUSE_STYLE.md` (binding).
Voice Kokoro `af_bella`, speed 1.0. Chapter-0 informal voice; our own words; maths spoken in words; `[beat]` = 1.5-s hold
after a worked calculation (not spoken, not captioned). Lines starting with ">" are notes and are not spoken; the README
below uses `###` headings so that `tools/tts.py` does not read it as a scene.

### README

**Measured, not estimated** (`tools/tts.py` dry run; numbers block at the end of this README).

**Scene list** (measured length per scene; w = words; PENDING = the flood_visuals report fills the slots)

| # | Scene | One line | Length |
|---|---|---|---|
| 0 | s00_title | title 'Coordinates, Part 2'; one sentence; turning velocity arrow, then Ian's section | 15.1 s (37 w) |
| 1 | s01_hook | is a steadily circling parcel accelerating? (prediction asked); tropical cyclone = hurricane = cyclone; two storms, two roles; 'second of seven parts' | 72.7 s (181 w) |
| 2 | s02_part1_recap | Part 1 in 60 s: r, θ, arc rule, r̂, θ̂, u_r, u_θ, Ian ≈ 35 round / 13 in | 67.1 s (161 w) |
| 3 | s03_tip_on_circle | maths block 1 chip; D12 (1-3): r̂'s tip on the unit circle slides Δθ along θ̂ ('radius 1' inside, Must 9) | 111.1 s (280 w) |
| 4 | s04_slopes_sin_cos | D12 (4-6): slopes of cos and sin (owned here), check at 53° with Δθ = 0.01 | 121.3 s (281 w) |
| 5 | s05_dr_dtheta | D13: dr̂/dθ = θ̂ (two routes; 'dr̂ = θ̂ dθ' explained) | 69.7 s (162 w) |
| 6 | s06_dtheta_dtheta | D14 (1-5): dθ̂/dθ = −r̂ from scratch in five moves (same tail, quarter turn ahead, 90° rule) | 119.7 s (265 w) |
| 7 | s07_toward_centre | D14 (6 + checks): '−r̂' = back towards the centre, at the balloon; numbers; components | 117.5 s (277 w) |
| 8 | s08_product_rule | block 1 takeaway; maths block 2 chip; D15: product rule with easy numbers (10 → 11, 0.1-rad turn), three pieces, the tiny piece vanishes | 156.9 s (376 w) |
| 9 | s09_dtheta_dt | D16: dθ/dt = v/r; 34.8/25 000 ≈ 0.00139 rad/s ≈ 5°/min; lap ≈ 75 min | 101.1 s (224 w) |
| 10 | s10_position_arrow | D17 (1-2): velocity = rate of change of position; position = r r̂; product rule | 67.9 s (165 w) |
| 11 | s11_velocity_on_ring | D17 (3-5): dr/dt = 0, chain rule → v = v θ̂ (34.8 m/s along the ring) | 71.3 s (167 w) |
| 12 | s12_acceleration | D18: a = −(v²/r) r̂ (product rule, steady, chain rule, units); centripetal | 97.7 s (232 w) |
| 13 | s13_acceleration_numbers | block 2 takeaway; 0.048 m/s² (easy 0.049), ≈ 200 × smaller than g; a car to 100 km/h in ≈ 10 min | 65.5 s (148 w) |
| 14 | s14_steady_but_turning | D19: arrows tail to tail, Δv ≈ 2.9 m/s per minute → 0.048 again; pressure force; pointers M03, R01 | 118.8 s (278 w) |
| 15 | s15_cylinder | eyewall; cylindrical (r, θ, z); GOES-16 mesoscale plate on the radar eye (Must 1) | 55.8 s (136 w) |
| 16 | s16_three_parts | u = u_r r̂ + u_θ θ̂ + w ẑ; ẑ never turns (Must 2) | 49.4 s (119 w) |
| 17 | s17_ian_check | is Ian right? radar eye vs model centre 17 km WSW; 960 vs 938 hPa; the 'never mix centres' rule | 77.4 s (186 w) |
| 18 | s18_ian_stack | the stack redesigned: pressure levels, 5 HRRR layers with heights, diverging u_r, zero contour, no hatch | 91.8 s (228 w) |
| 19 | s19_ian_layers_lit | layers lit bottom → top, 100-km ring readouts −6.5 … +6.6; orbit; one close look ≤ 6 s | 57.4 s (144 w) |
| 20 | s20_ian_curtain | D20: ring averages → radius-height section: −16 in, +9 out, 55 spin; in-up-out; pointer U15 | 113.4 s (269 w) |
| 21 | s21_amphan_intro | the second storm, Amphan: globe zoom tour, landfall in the Sundarbans, 45 km W of Satkhira, 78 km W of Khulna | 56.2 s (137 w) |
| 22 | s22_amphan_eye | MODIS 18 May: the pinhole eye; same shape → same coordinates | 20.6 s (52 w) |
| 23 | s23_amphan_ring | ERA5 06 UTC 20 May, 100-km ring: 20 round, −6 in; 90 kt official; inflow angle 17° vs Ian's 21° | 97.3 s (217 w) |
| 24 | s24_amphan_curtain | Amphan's section beside Ian's: −11 in, +6 out, same in-up-out | 37.5 s (78 w) |
| 25 | s25_why_cylindrical | three good reasons: shape, physics, meaning | 51.3 s (113 w) |
| 26 | s26_onshore | back to Ian's landfall: 33 m/s from the SW, almost straight onto the land; 'Part 4 will measure exactly how much' | 46.6 s (123 w) |
| 27 | s27_surge | storm surge: wind push + shallow shelf + ≈ 1 cm/hPa; Fort Myers Beach 3-4.5 m above ground; gauges +2.2 / −1.8 m; the surge flips sides; pointers R06, F19 | 93.2 s (236 w) |
| 28 | s28_ian_record | no satellite saw Ian's surge; the two gauge lines are its record (PENDING v3: a swipe only if the flooding shows) | 41.6 s (104 w) |
| 29 | s29_flood_flight | three.js flight to the chosen flood event (provisional Amphan: ETOPO depth, 20/200 m lines, shelf ≈ 33 km, track) (PENDING v3) | 43.7 s (109 w) |
| 30 | s30_flood_swipe | ONE plain false-colour swipe, no overlay (provisional MODIS 7-2-1, 16 vs 29 May 2020); colours explained (PENDING v3); pointer F32 | 68.2 s (153 w) |
| 31 | s31_recap | 'To sum up', teaser to Part 3 (split plan wording) | 81.5 s (206 w) |
| 32 | s32_end | series end card, maths ending, word for word | 22.9 s (56 w) |

**Length:** 41:21.95 measured (5900 words; 41.5 min at the plan rate of 142 words per minute). The split plan's
estimate was ≈ 3640 words, 25.6 min; the user's derivation requests (D12-D20 with numbers), the Ian check, the stack + section
redesign, Amphan and the surge/flood scenes add the difference (the coast derivation moved to Part 4) (Part 1's 36:28 was accepted; depth not cut).

**User feedback covered** (Part 2 items of split plan §1a; `reports/ch00_coordinates_user_feedback.md`).
- [x] U-CO-004 "radius 1" cut off: s03, centred under the circle (Must 9).
- [x] U-CO-005 how dr̂ = θ̂ dθ: s03 (tip on the unit circle, arc = Δθ, along θ̂), s04 (slopes), s05 (both routes; the "dr̂ = θ̂ dθ" form said).
- [x] U-CO-006 "θ̂'s tip moves toward the centre, so −r̂", from scratch, very simply: s06 (five moves: same tail, a quarter turn ahead, same Δθ, slide ⟂ its own arrow, the 90° rule → −r̂), s07 (at the balloon: tails together, the change points back at the station; numbers (−0.6, −0.8); components).
- [x] U-CO-018 dθ/dt = v/r shown (not in the derivatives movie, said): s09 (D16 with numbers, lap 75 min).
- [x] U-CO-019 why differentiate v θ̂, is it the velocity: s10 (velocity = rate of change of position r r̂), s11 (→ v θ̂, "so yes"), s12 (acceleration = rate of change of velocity).
- [x] U-CO-020 dθ̂/dθ = −r̂ shown again clearly: s12 recalls the s06 picture beside the chain rule.
- [x] U-CO-021 how a steady speed still means acceleration: s14 (velocity = speed + direction; arrows tail to tail; Δv 2.9 m/s per minute → 0.048 m/s², the same number with no formula).
- [x] U-CO-022 is Ian shown correctly: s17 (radar eye vs model centre 17 km WSW, 960 vs 938 hPa, the never-mix rule); s15 plate centred on the radar eye; every wind number about the model's own centre.
- [x] U-CO-023 the stripes: our own hatch (research §1b); s18 uses a diverging map centred on 0, a bold zero contour, no hatch (not mentioned in the narration: build 1 was never published).
- [x] U-CO-024 a Bay of Bengal cyclone: Amphan, s21-s24 and (provisional, PENDING v3) s29-s30 (centre 78 km west of Khulna, 45 km west of Satkhira; their flooding).
- [x] U-CO-025 Ian's data and maps checked: research report adopted (HRRR prs for layers, radar/GOES M1 for the eye, 975 hPa masked).
- [x] U-CO-026 swap to the Bay storm if Ian could not be corrected: Ian corrected, Amphan added (both).
- [x] U-CO-027 better data: HRRR 3-km pressure levels, NEXRAD KTBW, GOES-16 mesoscale, MODIS (GIBS), ERA5 for the Bay (data products below).
- [x] U-CO-028 best tools: matplotlib textures → three.js / Remotion (research §5), stated per scene (`tool`, `runner_up`).
- [x] U-CO-029 vertical layers shown better (as weather basics / derivatives): s18-s19 house LayerStack3D, side view, orbit, one close look.
- [x] U-CO-030 values readable: s19 per-layer ring readouts linked to their layers; s20 one radius-height section with three marked numbers.
- [x] U-CO-031 rotate / view from angles: s19 orbit from outside (azimuth −40° → +40°, elevation 20° → 35°).
- [x] U-CO-032 which layer at which height: s18 height axis (0-15 km) + a pressure-and-height tag on every layer.
- [x] U-CO-054 every calculation clarified: goal → each factor named → CalcStack with inputs → meaning (s04, s07-s09, s13-s14, s23).
- [x] U-CO-057 nothing unexplained: slopes of sine and cosine (s04), the product rule (s08), the chain rule recalled (s11), pressure levels (s18), reanalysis (s23), false colour (s30).
- [→ Part 4] U-CO-090 how 329° is measured: moved to Part 4 with D21 (coordinator 2026-11-05: Part 4 derives it with Part 3's km); Part 2 s26 says only 'the coast runs NNW' and points ahead.
- [→ Part 4] U-CO-091 the along/across calculations: moved to Part 4 (D22); s26 says 'almost straight onto the land' and 'in Part 4, we'll … measure exactly how much'.
- [x] U-CO-092 GEE before/after slider + storm surge: s27 surge (onshore push, shelf, gauges, the flip); s28 Ian's surge measured by the gauges (no satellite saw it, said); s29 flight; s30 ONE plain false-colour swipe for the clearest cyclone flood (user decision; event, dates and bands PENDING flood_visuals v3).
- [x] U-CO-099 later-movie concepts ≤ 1 min, named in voice + keyword: Wind on weather charts (s14), Circular motion (s14), How tropical cyclones form (s20), Friction and Ekman layers (s27), storm surge (s27), flood mapping (s30).
- [x] U-CO-100 explained here with no later owner: slopes of sin/cos, product rule, ring-average section, coast bearing.
- [x] U-CO-101 smooth flow: "second of seven parts" (s01), Part 1 recap (s02), the split plan's teaser to Part 3 (s31, word for word).

**Review 1 and fix-loop-1 guards** (split plan §1b-§1c; `reports/ch00_movies.md` review 1; `build1_log.md` §9): Must 1 (s15), Must 2
(s16), Must 3 (superseded by s18-s19), Must 9 (s03), Must 15 (s26-s28 colour bars and dated credits); Should 2, 11 (s27-s28), 14 (s32),
18 (every scene); **Should 12, 13 ('minus thirty two') and 15 move to Part 4 with the coast derivation**; fix-loop rules 1-9 in the storyboard `guards`.

**Cross-part numbers** (one `_coords_common.py` CHECK module; Part 1 README).
| Number | Value here | Must match |
|---|---|---|
| Ian centre for winds | HRRR 10-m calm centre 26.506 N, 82.441 W, 18 UTC 28 Sep 2022 | Part 1 after its re-centring |
| 25-km ring, 10 m | u_θ 34.78 (said "about thirty five", "thirty four point eight"), u_r −13.30 ("about thirteen") | Part 1 s22-s27 |
| inflow angle | atan(13.30/34.78) = 20.9° ("twenty one") | **Part 1 s26/s27 currently say nineteen** (old centre): must become 21 |
| lap on the 25-km ring | 2π r / v = 4516 s ≈ 75 min | Part 1 s23 (currently "seventy one" with 37 m/s) |
| balloon | (3, 4) km, θ = 53.13°, r̂ = (0.6, 0.8), θ̂ = (−0.8, 0.6) | Part 1 s04-s13 |
| radar eye | 26.552 N, 82.278 W; eyewall radius 29.7 km | Part 1 "where the eye is" still, if used |
| Khulna | 22.8419 N, 89.5581 E; Satkhira 22.72 N, 89.07 E | Part 3 s14, Part 4 s06 |
| a | 6371 km (Part 3 introduces it; Part 2 uses km on a local map only) | Parts 3-5 |
| coast segment (for Part 4) | A 26.099 N 81.801 W → B 26.922 N 82.354 W, 329°; wind at Fort Myers Beach (22.232, 24.293) m/s, 20 UTC | Part 4 D21-D22 (kept in `data_block.ian.coast_for_part4`) |

**Data products for the builder** (exact sources, times and levels; all through `fluidpy.data.fetch()` and the disk guard).
| Product (registry key) | What | Time (UTC) | Levels / bands | Route | Scenes |
|---|---|---|---|---|---|
| HRRR-zarr-prs-ian2022 (new) | u, v, z (w unusable, ≈ 0) | 28 Sep 2022 18z analysis | 975, 925, 850, 700, 500, 300, 200, 150, 125 hPa (stack: 925, 850, 500, 200, 150; 975 masked where p_sfc < 975) | **new** `fluidpy.data.hrrr.fetch_fields(store="prs", levels=…)` (research `ian_hrrr_prs.py`) | s00, s18-s20, s24, s25 |
| HRRR-zarr-ian2022 (build 1) | 10-m u, v, msl | 18 and 20 UTC 28 Sep 2022 | surface | `fluidpy.data.hrrr.fetch_fields` | s02, s09, s13, s17, s26-s28 |
| NEXRAD-L2-KTBW-ian2022 (new) | reflectivity, eyewall fit (≥ 35 dBZ) | 18:01:48 UTC | 0.5° tilt | **new** `fluidpy.data.nexrad` (unidata-nexrad-level2, anonymous; MetPy reader) | s17 |
| GOES16-ABI-M1-ian2022 (new) | true colour, 0.5-km C02, stretched | 18:01 UTC | C01-C03 (CMIPM, M1) | `fluidpy.data.goes.fetch_abi` | s15, s16 |
| IBTrACS v04r01 (NA, NI) | tracks, 938 hPa (Ian), 90 kt / 956 hPa at 06 UTC 20 May (Amphan, IMD 3-min) | — | — | `fluidpy.data.ibtracs.storm_table` | s17, s21, s23, s29 |
| ERA5-ARCO-amphan2020 (new) | msl, 10-m u, v; u, v, w, z | 20 May 2020 06 UTC | 1000, 975, 925, 850, 700, 500, 300, 200, 150, 125 hPa | `fluidpy.data.era5_arco.fetch_box` + `vertical_ring_product` | s23, s24 |
| GIBS MODIS Terra | true colour 250 m | 18 May 2020 | — | `fluidpy.data.gibs.fetch_wms` | s22 |
| NOAA CO-OPS (build 1) | water level + predictions, 8725520 Fort Myers, 8726520 St. Petersburg | 27-30 Sep 2022 | — | `fluidpy.data.coops.fetch_water_level` | s27, s28 |
| ETOPO 2022 | shelf profile WSW of Fort Myers Beach | — | — | `fluidpy.data.etopo` | s27 |
| Natural Earth 10 m + NASA BMNG | coast, borders, places; globe | — | — | `fluidpy.data.naturalearth`, `nasa_bmng` | s21, s26, s29 |
| **PENDING flood_visuals v3** | ONE plain false-colour before/after pair, no overlay, for the clearest cyclone flood (scout picks the event) | provisional MODIS 7-2-1, Terra 16 May vs Aqua 29 May 2020 (Amphan), 88.05-89.95 E, 21.55-23.0 N | 7-2-1 | **new** `fluidpy.data.gee` or `fluidpy.data.gibs` | s30 |
| GEE-ETOPO1-bay (→ ETOPO 2022 15″) + GEE-MCD43A4-bay2020 (new) | Bay patch 84-94 E, 15-25 N: depth tint, 20/200 m isobaths (vector), NBAR land | NBAR 1-8 Feb 2020 | — | `fluidpy.data.etopo` + **new** gee | s29 (PENDING v3: the event's basin) |

**Maths-skip guidance (user rule 2026-11-05).** Two step-by-step blocks, each opened by one friendly line + an on-screen chip
"every step · not needed for the weather intuition · skip to mm:ss", and closed by "If you skipped, here's what to keep: …" (the
first sentence of the scene the chip points to, so skippers land on it). The mm:ss below are from this dry run; **refill after the
final TTS** (storyboard `maths_skip`, `chapter_marks`).
| Block | Steps | Starts | Skip to (takeaway) |
|---|---|---|---|
| B1 | D12-D14: how r̂ and θ̂ turn | 2:35 (s03_tip_on_circle) | 11:35 (s08_product_rule S0) |
| B2 | D15-D18: product rule → velocity → acceleration | 11:35 (s08_product_rule) | 19:49 (s13_acceleration_numbers S0) |

**Spoken-symbol rules.** "r hat", "theta hat", "delta theta", "d r hat by d theta", "d theta by d t", "v squared over r", "u sub r",
"u sub theta", "w", "z hat", "x hat prime", "y hat prime"; never a lone "a"; every clockwise/anticlockwise with "as seen from above"
(and the hemisphere for storms); "Saint Petersburg" written out (the sentence splitter breaks at "St.").

**Title** (user, 2026-11-05): "Coordinates, Part 2 — Inside a tropical cyclone: turning arrows and cylindrical coordinates"; card "Coordinates · Part 2" / "Inside a tropical cyclone" / "turning arrows and cylindrical coordinates"; the spoken s00 sentence stays short. Two storms with two roles: Ian (detailed 3-D winds, the coast and the surge), Amphan (another ocean, the same picture; the floods).

**Proposed lexicon entries** (not added; check by ear in the dry-run audio): Amphan → "Um-pun", Khulna → "Kool-nah", Satkhira →
"Shat-kee-rah", Sundarbans → "Sun-der-bunz", Kolkata → "Kol-kah-tah", Englewood (check), Sentinel (check), MODIS → "Moe-dis",
centripetal → "sen-trip-it-al" (check), centrifugal (check).

**Measured** (`tools/tts.py` dry run 2026-11-05 into `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_storm/dryrun6`,
Kokoro af_bella × 1.0, current `movies/lexicon.yaml`, not edited): **33 scenes, 395 sentences, 5900 words, 67 beats;
narration 2479.450 s + 2.5-s silent end-card hold = 2481.950 s (41:21.95)**; speech alone 2251.3 s = 157.2 words per
minute while speaking, **142.6 words per minute overall** (limit 150); 602 caption cues; warnings: ['s18_ian_stack s13: 17.2 chars/s > 17.0 (slow the speed or shorten)'].

## s00_title
In this video, we'll learn how turning arrows and cylinders work the easy way, and see how meteorology uses them to look inside a tropical cyclone: its spin, its winds in three dimensions, and its storm surge.

> 37 words · 1 sentences · 0 beats · 0.300–15.450 s (15.1 s; speech 14.3 s) · 0:00.30–0:15.45 (measured, dry run 2026-11-05).

## s01_hook
Picture an air parcel, a small volume of air that moves with the flow, going round the eye of a tropical cyclone at a steady speed, never faster and never slower. Is it accelerating? Hold on to your guess, because we'll answer it with arrows that turn. A tropical cyclone is a huge spinning storm that forms over a warm ocean. Near America it's called a hurricane, and near India and Bangladesh it's called a cyclone, but it's the same kind of storm. This is the second of seven parts on coordinates. In this part, we find out exactly how the arrows of polar coordinates change as we go round. Then we look inside two real storms, each with its own job. Hurricane Ian, which hit Florida in twenty twenty two, has the most detailed wind data, so it shows us the storm in three dimensions, and its storm surge. Cyclone Amphan, which hit India and Bangladesh in twenty twenty, shows that the same picture fits a storm in another ocean, and it shows us the floods a storm leaves behind.

> 181 words · 10 sentences · 0 beats · 15.450–88.150 s (72.7 s; speech 68.8 s) · 0:15.45–1:28.15 (measured, dry run 2026-11-05).

## s02_part1_recap
In Part 1, we met polar coordinates. A point is a distance r from the origin, at an angle theta from east, measured anticlockwise as seen from above. We also met the arc rule: on a circle of radius r, turning by an angle in radians walks you the radius times the angle. Each point has two unit vectors. R hat, cosine theta, sine theta, points straight away from the origin. Theta hat, minus sine theta, cosine theta, is r hat turned by ninety degrees anticlockwise, and it points the way theta grows. The parts of a wind along these two arrows are the radial wind, u sub r, and the tangential wind, u sub theta. Round Hurricane Ian's eye, twenty five kilometres out, the air went round at about thirty five metres per second, and in at about thirteen. And we saw that r hat and theta hat turn as we go round. Today, we find out exactly how fast.

> 161 words · 10 sentences · 0 beats · 88.150–155.275 s (67.1 s; speech 63.2 s) · 1:28.15–2:35.28 (measured, dry run 2026-11-05).

## s03_tip_on_circle
> MATHS BLOCK 1 (s03-s07) starts; chip 'every step · not needed for the weather intuition · skip to mm:ss' (= start of s08).
The next few minutes build these rules step by step, for anyone who wants to see every move. You don't need them for the weather, the climate science or the maps later on, so if it feels like too much, jump to the time on the screen, and you'll get the main idea there. Let's start with r hat on its own. Why do we care how it changes? Because we write winds with r hat and theta hat, and when an air parcel goes round, these arrows turn under it. To find the parcel's acceleration, we'll need to know how fast they turn. So draw r hat from the origin. Its length is one, so its tip sits on a circle of radius one, called the unit circle. And the tip is exactly the point cosine theta, sine theta. Now turn theta by a small amount. We call this small turn delta theta, where delta just means a small change. The tip slides along the unit circle. How far? By the arc rule, the distance is the radius times the angle, and the radius is one. So the tip slides a distance of one times delta theta, which is just delta theta. [beat] For example, a turn of zero point one radians, about six degrees, slides the tip about zero point one along the circle. [beat] And which way does it slide? Sliding along a circle is at right angles to the radius, and theta grows anticlockwise. That's exactly the direction of theta hat, as we found in Part 1. So, for a small turn, the tip of r hat moves a distance delta theta, in the direction of theta hat.

> 280 words · 20 sentences · 2 beats · 155.275–266.350 s (111.1 s; speech 101.3 s) · 2:35.28–4:26.35 (measured, dry run 2026-11-05).

## s04_slopes_sin_cos
This little picture gives us something that no earlier movie in this series has shown: how fast cosine and sine change. In the derivatives movie, we met the slope, or derivative: the small change in a quantity, divided by the small change that caused it, as both shrink towards zero. The tip's east part is cosine theta, and its north part is sine theta. The tip moved delta theta along theta hat, which is minus sine theta, cosine theta. So its east part changes by about minus sine theta times delta theta. And its north part changes by about cosine theta times delta theta. [beat] Now divide both changes by delta theta, and let delta theta shrink towards zero. The slope of cosine theta is minus sine theta. And the slope of sine theta is cosine theta. [beat] The minus sign makes sense: turning anticlockwise from east, the tip moves towards the west, so its east part shrinks. Let's check with numbers, at the balloon's angle from Part 1, about fifty three degrees, where the cosine is zero point six and the sine is zero point eight. Turn by zero point zero one radians. The cosine drops from zero point six zero zero to zero point five nine two, a change of minus zero point zero zero eight. Divided by zero point zero one, that's minus zero point eight: minus the sine. [beat] The sine grows from zero point eight zero zero to zero point eight zero six, a change of zero point zero zero six. Divided by zero point zero one, that's zero point six: the cosine. [beat] So the rule works. These two slopes will come back again and again in this series.

> 281 words · 18 sentences · 4 beats · 266.350–387.625 s (121.3 s; speech 109.9 s) · 4:26.35–6:27.62 (measured, dry run 2026-11-05).

## s05_dr_dtheta
Now let's put the two parts back together into one arrow. The change in r hat is the short arrow from its old tip to its new tip. We call it delta r hat. It's about theta hat times delta theta. [beat] Now divide by delta theta, and let it shrink. We get the rate of change of r hat with theta. We write it d r hat by d theta, and it equals theta hat. [beat] The letter d is how the derivatives movie writes a change when it's tiny. Some books multiply both sides by d theta, and write d r hat equals theta hat d theta. It's the same statement. We can also check it one part at a time. The slopes of cosine theta and sine theta are minus sine theta and cosine theta. Together, that's minus sine theta, cosine theta, which is theta hat. [beat] So both routes agree. In words: when theta grows, r hat swings towards theta hat.

> 162 words · 15 sentences · 3 beats · 387.625–457.325 s (69.7 s; speech 60.6 s) · 6:27.62–7:37.32 (measured, dry run 2026-11-05).

## s06_dtheta_dtheta
Now theta hat. How does theta hat change when theta grows? Let's take this slowly, one step at a time, and assume nothing. Step one. Theta hat is also an arrow of length one. So let's draw it from the origin too, from the same starting point as r hat. Its tip sits on the same unit circle. Step two. Theta hat is always r hat turned by ninety degrees. So its tip sits on the circle a quarter turn ahead of r hat's tip. Step three. Now turn theta by delta theta. R hat turns by delta theta, and theta hat, which always stays a quarter turn ahead, turns by the same delta theta. So its tip also slides a distance delta theta along the unit circle. Step four. Which way does it slide? The same rule as before: a tip sliding anticlockwise along the circle moves along its own arrow, turned by ninety degrees. So theta hat's tip moves along theta hat, turned by ninety degrees. [beat] Step five. Let's turn theta hat with Part 1's rule: swap the two numbers, and put a minus on the first. Theta hat is minus sine theta, cosine theta. Swapping gives cosine theta, minus sine theta. And a minus on the first gives minus cosine theta, minus sine theta. [beat] That's exactly minus r hat: the arrow r hat, flipped to point the other way. [beat] So, for a small turn, theta hat changes by about minus r hat times delta theta. And its rate of change with theta, d theta hat by d theta, is minus r hat.

> 265 words · 26 sentences · 3 beats · 457.325–577.050 s (119.7 s; speech 106.7 s) · 7:37.32–9:37.05 (measured, dry run 2026-11-05).

## s07_toward_centre
So what does minus r hat mean in the picture? Let's go back to the balloon, five kilometres from the station, and move it round its circle. At each place, draw theta hat at the balloon. Due east of the station, theta hat points north. A little further round, it leans to the west, towards the station's side. Now slide those arrows so that their tails touch. Their tips swing round, and the small change from one arrow to the next points back towards the station. That's minus r hat: from the balloon, back towards the centre of its circle. That's what we mean when we say that theta hat's tip moves towards the centre. [beat] Let's check with numbers. At fifty three degrees, theta hat is minus zero point eight, zero point six. After a turn of zero point zero one radians, it's minus zero point eight zero six, zero point five nine two. The change is minus zero point zero zero six, minus zero point zero zero eight. Divided by zero point zero one, that's minus zero point six, minus zero point eight. [beat] And r hat is zero point six, zero point eight, so that's minus r hat. [beat] We can also check it one part at a time with the new slopes. The slope of minus sine theta is minus cosine theta, and the slope of cosine theta is minus sine theta. Together, that's minus cosine theta, minus sine theta: minus r hat again. [beat] So here's the whole rule in words: turn the angle, and each arrow swings towards the other one. R hat swings towards theta hat, and theta hat swings towards minus r hat.

> 277 words · 20 sentences · 4 beats · 577.050–694.550 s (117.5 s; speech 105.5 s) · 9:37.05–11:34.55 (measured, dry run 2026-11-05).

## s08_product_rule
> MATHS BLOCK 1 takeaway (skip target of block 1 = this scene's first sentence); MATHS BLOCK 2 (s08-s12) starts; chip 'every step · skip to mm:ss' (= start of s13).
If you skipped, here's what to keep: as the angle grows, r hat swings towards theta hat, and theta hat swings towards minus r hat, back towards the centre. Next comes one more stretch with every step, from a new tool all the way to the acceleration. If you'd rather, jump to the time on the screen. Before we use these rules on a moving air parcel, we need one more tool, which no earlier movie in this series has shown. It's called the product rule. Here's the question it answers: how does a number times an arrow change, when both the number and the arrow change? Let's try easy numbers first. Take a speed of ten metres per second, along an arrow pointing east, one, zero. Their product is the arrow ten, zero. [beat] One second later, the speed has grown to eleven. And the arrow has turned by zero point one radians, to about zero point nine nine five, zero point one. The product is now eleven times that, which is ten point nine four five, one point one. So the product changed by zero point nine four five, one point one. [beat] Where does that change come from? There are three pieces. First, the change in the number, times the old arrow: one times one, zero, which is one, zero. Second, the old number, times the change in the arrow: ten times minus zero point zero zero five, zero point one, which is minus zero point zero five, one. Third, the two changes multiplied together: one times minus zero point zero zero five, zero point one, which is minus zero point zero zero five, zero point one. [beat] Add the three pieces, and we get zero point nine four five, one point one: the whole change. [beat] Now the key step. The third piece is a small change times a small change. If we halve the time step, the first two pieces halve, but the third one shrinks to a quarter. So after we divide by the time step and let it shrink, the third piece vanishes. What's left is the product rule. The rate of change of a number times an arrow is the number's rate times the arrow, plus the number times the arrow's rate. [beat]

> 376 words · 25 sentences · 5 beats · 694.550–851.475 s (156.9 s; speech 142.4 s) · 11:34.55–14:11.48 (measured, dry run 2026-11-05).

## s09_dtheta_dt
Now let's put an air parcel on Ian's ring, twenty five kilometres from the centre, going round at a steady speed. We'll call its speed v. On this ring, v is about thirty five metres per second. As the parcel goes round, its angle theta grows. How fast? Let's find out, one step at a time. In a short time, delta t, the parcel moves a distance v times delta t along the ring. [beat] By the arc rule, a distance along a circle is the radius times the angle. So the angle it turns through is that distance divided by the radius: v delta t over r. [beat] Now divide by delta t, and let it shrink. The rate at which theta grows, d theta by d t, is v over r. [beat] The derivatives movie didn't show this one, so let's put in the numbers. Thirty four point eight metres per second, divided by twenty five thousand metres, is about zero point zero zero one three nine radians per second. [beat] The metres cancel, and radians per second are left. That's about zero point zero eight degrees every second, or about five degrees every minute. [beat] So one full lap, two pi radians, takes two pi divided by zero point zero zero one three nine. That's about four thousand five hundred seconds, or about seventy five minutes. [beat]

> 224 words · 17 sentences · 6 beats · 851.475–952.550 s (101.1 s; speech 88.2 s) · 14:11.48–15:52.55 (measured, dry run 2026-11-05).

## s10_position_arrow
Next, the parcel's velocity. Why do we need it? Because acceleration is the rate of change of velocity, so we need the velocity first. And velocity is the rate of change of position: how far, and in which direction, the parcel moves each second. So let's write the parcel's position as an arrow from the centre of the eye. Its length is the distance r, and its direction is r hat. So the position arrow is r times r hat. [beat] That's just Part 1 read backwards. R hat is the arrow divided by its length, so the arrow is its length times r hat. For Ian's parcel, that's twenty five kilometres times r hat. Velocity is the rate of change of this arrow. It's a number, r, times an arrow, r hat, so we use the product rule. The rate of change of r times r hat is d r by d t times r hat, plus r times d r hat by d t. [beat]

> 165 words · 13 sentences · 2 beats · 952.550–1020.475 s (67.9 s; speech 61.1 s) · 15:52.55–17:00.48 (measured, dry run 2026-11-05).

## s11_velocity_on_ring
Now let's simplify, one term at a time. On a ring, the distance r never changes, so d r by d t is zero, and the first term drops out. [beat] For the second term, we need how fast r hat changes in time. R hat depends on theta, and theta depends on time. That's a chain, so we use the chain rule from the derivatives movie. D r hat by d t equals d r hat by d theta, times d theta by d t. We've found both: theta hat, and v over r. So d r hat by d t is theta hat times v over r. [beat] Now multiply by r. The two r's cancel, and the velocity is v times theta hat. [beat] So yes: v theta hat is the parcel's velocity. Its size is the speed v, and its direction is theta hat, along the ring. For Ian's parcel, that's thirty four point eight metres per second, along the ring, anticlockwise as seen from above.

> 167 words · 13 sentences · 3 beats · 1020.475–1091.750 s (71.3 s; speech 62.8 s) · 17:00.48–18:11.75 (measured, dry run 2026-11-05).

## s12_acceleration
Now we can answer the opening question. Acceleration is the rate of change of velocity. So we need the rate of change of v theta hat, which is a number times an arrow again. By the product rule, it's d v by d t times theta hat, plus v times d theta hat by d t. [beat] The parcel goes round at a steady speed, so d v by d t is zero, and the first term drops out. [beat] For the second term, we use the chain rule again. D theta hat by d t equals d theta hat by d theta, times d theta by d t. Remember the turning arrows: d theta hat by d theta is minus r hat, because theta hat swings towards minus r hat. And d theta by d t is v over r. So d theta hat by d t is minus r hat, times v over r. [beat] Now multiply by v. The acceleration is minus v squared over r, times r hat. [beat] The minus sign means that it points along minus r hat: inward, towards the centre of the ring. An acceleration that points to the centre of a circle is called a centripetal acceleration. Let's check the units. V squared is in metres squared per second squared. Dividing by r, in metres, leaves metres per second squared, which are the units of an acceleration. [beat]

> 232 words · 17 sentences · 5 beats · 1091.750–1189.450 s (97.7 s; speech 86.0 s) · 18:11.75–19:49.45 (measured, dry run 2026-11-05).

## s13_acceleration_numbers
> MATHS BLOCK 2 takeaway (skip target of block 2 = this scene's first sentence).
If you skipped, here's what to keep: an air parcel going round a circle at a steady speed v is always accelerating towards the centre, by v squared over r. So how big is it for Ian's parcel? Thirty four point eight squared is about twelve hundred and eleven. Divided by twenty five thousand metres, that's about zero point zero four eight metres per second squared. [beat] With easy numbers, thirty five squared over twenty five thousand is about zero point zero four nine, almost the same. [beat] Is that big? Gravity is nine point eight one metres per second squared, so this is about two hundred times smaller. [beat] But it acts all the time. A car with this acceleration would take about ten minutes to reach a hundred kilometres per hour. [beat] Here, instead of making the parcel faster, all of it goes into turning the parcel round the eye.

> 148 words · 10 sentences · 4 beats · 1189.450–1254.975 s (65.5 s; speech 57.0 s) · 19:49.45–20:54.97 (measured, dry run 2026-11-05).

## s14_steady_but_turning
So how can a steady speed still mean an acceleration? The answer is that velocity is more than speed. Velocity is speed and direction together. Let's see it with two velocity arrows, one minute apart. In one minute, theta grows by zero point zero zero one three nine times sixty, which is about zero point zero eight four radians, or about five degrees. [beat] Both arrows are thirty four point eight metres per second long, but they point in slightly different directions. Now slide them so that their tails touch. The short arrow from the first tip to the second is the change in velocity. It points towards the eye. [beat] How long is it? Its two ends lie on a circle of radius thirty four point eight, a small turn apart. So by the arc rule, it's about thirty four point eight times zero point zero eight four, which is about two point nine metres per second. [beat] Divide by sixty seconds, and we get about zero point zero four eight metres per second squared: the same acceleration, found with no formula at all. [beat] So a steady speed means no acceleration only when the direction stays the same too. Something must push the parcel inward all the time. In a tropical cyclone, it's mostly the pressure force, because the pressure is lowest in the eye. The Earth's spin adds a smaller push, about twenty times smaller here. How winds balance these pushes has its own movie later in this series: Wind on weather charts. And if you rode with the parcel, you'd feel this as a push outward, called the centrifugal force, which also has its own movie: Circular motion.

> 278 words · 19 sentences · 4 beats · 1254.975–1373.725 s (118.8 s; speech 107.0 s) · 20:54.97–22:53.72 (measured, dry run 2026-11-05).

## s15_cylinder
So far, our storm has been flat. But a real tropical cyclone is tall. Near the sea, the air spirals in. Close to the eye, it rises in a ring of towering clouds called the eyewall. And near the top, about twelve to fifteen kilometres up, it flows out again. Here's Ian from above, seen by a weather satellite at six in the evening, universal time. The clear hole in the middle is the eye, and the ring of bright cloud round it is the eyewall. To describe a tall, round storm, we add a third coordinate to polar coordinates: the height, z, measured straight up. The distance r, the angle theta and the height z are called cylindrical coordinates. That's because all the places at one distance r form a cylinder round the storm's axis.

> 136 words · 10 sentences · 0 beats · 1373.725–1429.550 s (55.8 s; speech 51.9 s) · 22:53.72–23:49.55 (measured, dry run 2026-11-05).

## s16_three_parts
In cylindrical coordinates, the wind has three parts. The radial wind, u sub r, points along r hat: in or out. The tangential wind, u sub theta, points along theta hat: round the eye. And the vertical wind, w, points along z hat: up or down. Written as one arrow, the wind is u sub r times r hat, plus u sub theta times theta hat, plus w times z hat. Z hat points straight up everywhere, just like x hat points east everywhere, so z hat never turns. Only r hat and theta hat turn as we go round, by the same rules we found today. So everything we've learned about turning arrows works in three dimensions too.

> 119 words · 8 sentences · 0 beats · 1429.550–1478.950 s (49.4 s; speech 46.1 s) · 23:49.55–24:38.95 (measured, dry run 2026-11-05).

## s17_ian_check
Before we look inside Ian, let's check where its eye really was, because different instruments see it differently. A weather radar on the coast near Tampa measures the rain round the storm. At six in the evening, its picture shows a ring of heavy rain, the eyewall, about thirty kilometres in radius, round an eye with almost no rain. This is the best picture of where the eye was. [beat] The weather model analysis that gives us Ian's winds in three dimensions puts its own calm centre about seventeen kilometres west-south-west of the radar's eye. And its lowest pressure is nine hundred and sixty hectopascals, while the official estimate is nine hundred and thirty eight. [beat] So the model is close, but a little off, and a little too weak. That's normal: a model with grid points every three kilometres can't hold the sharpest part of a storm exactly. So here's our rule. For where the eye is, we use the radar and the satellite. For the winds, we use the model, measured round the model's own centre. And we never mix the two centres in one picture.

> 186 words · 12 sentences · 2 beats · 1478.950–1556.325 s (77.4 s; speech 70.4 s) · 24:38.95–25:56.33 (measured, dry run 2026-11-05).

## s18_ian_stack
Now let's look inside Ian, layer by layer. Weather models store the wind on pressure levels: surfaces where the air pressure has one value, like nine hundred and twenty five hectopascals. Since the pressure drops as we go up, each level sits at a height, and we'll write that height beside it. Here are five layers round Ian's eye, from the model, at six in the evening. Each layer is a square about five hundred kilometres across. The lowest is at nine hundred and twenty five hectopascals, about seven hundred metres above the sea. We don't use a lower level, because near the eye the pressure at the sea surface was below nine hundred and seventy five hectopascals, so that level would lie under the sea there. Then come eight hundred and fifty hectopascals, about one and a half kilometres up, five hundred, about six kilometres, two hundred, about twelve kilometres, and one hundred and fifty, about fourteen kilometres. [beat] The colour on each layer is the radial wind, u sub r. Rose, with a minus sign, means that the air flows in, towards the eye. Blue, with a plus sign, means that it flows out. Pale means neither, and a dark line marks where the radial wind is exactly zero. We drew the heights much taller than they really are, so that we can see between the layers.

> 228 words · 13 sentences · 1 beats · 1556.325–1648.100 s (91.8 s; speech 85.6 s) · 25:56.33–27:28.10 (measured, dry run 2026-11-05).

## s19_ian_layers_lit
Let's light the layers one at a time, from the bottom up, and read each one on a ring a hundred kilometres from the centre. On the lowest layer, about seven hundred metres up, the air flows in on most of the ring. Round the ring, the radial wind averages about minus six and a half metres per second. [beat] At one and a half kilometres, it's almost zero. At six and at twelve kilometres, it's a little positive, about plus one. And at fourteen kilometres, the sign has flipped: the air flows out, at about plus six and a half metres per second. [beat] So the air comes in near the bottom, and goes out near the top. Now let's swing round the stack, to see it from another side. And here's one short, closer look from the side, just above the sea, looking up past the layers.

> RE-VOICE S1 (light phase 2026-11-05; new sentences timed at 142 wpm by checks/make_timing.py until the final TTS). Was: 144 words · 9 sentences · 2 beats · 1648.100–1705.475 s (57.4 s; speech 51.5 s) · 27:28.10–28:25.47 (measured, dry run 2026-11-05).

## s20_ian_curtain
Five layers still leave gaps, and cylindrical coordinates give us a neater picture. On every level, we can average round each ring, just as we averaged round one ring in Part 1. An average round a ring depends only on the distance r and the height z, because going all the way round removes theta. [beat] So we can draw the whole storm on one slice, with the distance from the centre along the bottom, and the height going up. This picture is called a radius-height section. Each colour is a ring average of the radial wind, now from all nine levels of the model. Near the sea, there's a thin layer of strong inflow. Its strongest ring average is about minus sixteen metres per second, thirty kilometres from the centre, about seven hundred metres up. [beat] Near the top, from about twelve kilometres up, the air flows out, at up to about plus nine metres per second. [beat] The dark lines show the tangential wind. Its strongest ring average is about fifty five metres per second, also thirty kilometres from the centre, about one and a half kilometres up. [beat] It's weaker right at the sea surface, where the sea slows the air, and it gets weaker higher up. The inflow alone says the air must rise, at about a metre per second… and radar on a hurricane-hunter aircraft measured it: about three metres per second at nine kilometres up, with single towers near ten. [beat] It rises in the eyewall, close to the eye. In, up and out: that's a tropical cyclone's overturning circulation, and cylindrical coordinates show it in one picture. How a tropical cyclone keeps this engine running has its own movie later in this series: How tropical cyclones form.

> RE-VOICE S12 (new: inflow → about a metre per second … radar measured about three, towers near ten) (light phase 2026-11-05; new sentences timed at 142 wpm by checks/make_timing.py until the final TTS). Was: 269 words · 16 sentences · 4 beats · 1705.475–1818.900 s (113.4 s; speech 102.8 s) · 28:25.47–30:18.90 (measured, dry run 2026-11-05).

## s21_amphan_intro
Now let's meet our second storm, on the other side of the world, in the Bay of Bengal, between India and Myanmar, with Bangladesh at its northern end. Remember, here a tropical cyclone is simply called a cyclone. In May twenty twenty, Cyclone Amphan formed in the south of the Bay. On the eighteenth of May, it became a super cyclonic storm, the strongest class there, and the first in the Bay of Bengal since nineteen ninety nine. On the twentieth, it came ashore in the Sundarbans, the huge mangrove forest on the border between India's state of West Bengal and Bangladesh. Its centre then passed close to Kolkata, about forty five kilometres west of Satkhira, and about seventy nine kilometres west of Khulna. So the Khulna and Satkhira districts of Bangladesh took much of its flooding.

> RE-VOICE S5 (seventy nine) (light phase 2026-11-05; new sentences timed at 142 wpm by checks/make_timing.py until the final TTS). Was: 137 words · 7 sentences · 0 beats · 1818.900–1875.100 s (56.2 s; speech 53.3 s) · 30:18.90–31:15.10 (measured, dry run 2026-11-05).

## s22_amphan_eye
Here's Amphan on the eighteenth of May, two days before landfall, seen by a NASA satellite. In the middle of its clouds is a tiny clear dot: a pinhole eye. It's the same shape as Ian, a round storm turning round a calm eye, so the same cylindrical coordinates fit it too.

> 52 words · 3 sentences · 0 beats · 1875.100–1895.650 s (20.6 s; speech 19.1 s) · 31:15.10–31:35.65 (measured, dry run 2026-11-05).

## s23_amphan_ring
Let's measure Amphan's winds the same way we did Ian's. There's no fine model like Ian's over the Bay of Bengal, so we use a global data set called ERA5. It's a reanalysis: a best estimate of past weather, made by blending observations with a weather model. Its grid boxes are about twenty eight kilometres wide, wider than Amphan's eye, so it smooths the storm a lot. Here's Amphan at six in the morning, universal time, on the twentieth of May, about four hours before landfall. We put the origin at ERA5's own centre, and draw a ring fifty kilometres out, where ERA5's spin is strongest. Ten metres above the sea, the tangential wind averages about twenty metres per second, and the radial wind about minus six. [beat] The air goes round anticlockwise as seen from above, just like Ian's, because both storms are in the northern hemisphere. The official estimate at that hour, averaged over three minutes, was about ninety knots, or about a hundred and sixty seven kilometres per hour. So the reanalysis is far too weak. [beat] But the shape is right. Six over twenty is zero point three, so Amphan's inflow angle is about seventeen degrees, close to Ian's twenty one. [beat] Two storms, in two different oceans, both spiral in at a similar angle.

> RE-VOICE S5 (fifty kilometres out) (light phase 2026-11-05; new sentences timed at 142 wpm by checks/make_timing.py until the final TTS). Was: 217 words · 13 sentences · 3 beats · 1895.650–1992.950 s (97.3 s; speech 88.8 s) · 31:35.65–33:12.95 (measured, dry run 2026-11-05).

## s24_amphan_curtain
Here's Amphan's radius-height section from ERA5, next to Ian's. The same pattern appears. Near the sea, the air flows in, at up to about minus eleven metres per second, a hundred kilometres from the centre. [beat] Near the top, it flows out, at up to about plus six. [beat] It's blurred, because ERA5's boxes are wide, but it's the same in, up and out. With cylindrical coordinates, two different storms, from two different data sets, fit into the same picture.

> 78 words · 6 sentences · 2 beats · 1992.950–2030.475 s (37.5 s; speech 32.7 s) · 33:12.95–33:50.47 (measured, dry run 2026-11-05).

## s25_why_cylindrical
So why do scientists who study tropical cyclones use cylindrical coordinates? There are three good reasons. The first is shape. A tropical cyclone is nearly round, so averaging round the rings turns a messy storm in three dimensions into one clear slice. The second is physics. With turning arrows, the inward acceleration, minus v squared over r, appears the moment we write the velocity down. With east and north arrows, the same acceleration hides inside changes of both parts. The third is meaning. The three parts, in, round and up, are exactly what we want to know: how fast the storm draws air in, how fast it spins, and where the air rises.

> 113 words · 9 sentences · 0 beats · 2030.475–2081.750 s (51.3 s; speech 47.7 s) · 33:50.47–34:41.75 (measured, dry run 2026-11-05).

## s26_onshore
Now let's come back down to the ground, to Ian's landfall on the coast of Florida. On a coast, east and north are not the most useful directions. What matters is how much of the wind blows along the shore, and how much blows across it, onto the land or out to sea. At eight in the evening, universal time, about an hour after landfall, the model's wind at Fort Myers Beach was about thirty three metres per second, from the south-west. The coast there runs towards the north-north-west, so that wind blew almost straight onto the land. In Part 4, we'll turn our axes to line up with the coast, and measure exactly how much of it pushed straight onto the coast.

> 123 words · 6 sentences · 0 beats · 2081.750–2128.375 s (46.6 s; speech 44.1 s) · 34:41.75–35:28.38 (measured, dry run 2026-11-05).

## s27_surge
That onshore push piles sea water up against the coast. The sea rises far above the normal tide, and this rise is called a storm surge. The wind's push does most of the work, especially over a wide, shallow sea floor like the one off southwest Florida. The low pressure helps a little: the sea rises by about one centimetre for every hectopascal that the pressure drops. [beat] At Fort Myers Beach, the official report found water ten to fifteen feet above the ground: about three to four and a half metres. [beat] A tide gauge up the river, at Fort Myers, measured the water about two point two metres above the normal tide. [beat] Now go about a hundred and sixty kilometres north, to Tampa Bay, on the other side of the storm's spin. There, the coast runs almost due north, and the wind blew out to sea. So the water was pushed away, and the gauge at Saint Petersburg read about one point eight metres below the normal tide. [beat] Same storm, opposite sides of the eye: onto the land on one side, out to sea on the other, and the surge flips with it. The wind along a coast matters too, because it can bring cold water up from below, which is a story for the movie on Friction and Ekman layers. And the full story of storm surge has its own movie later in this series.

> 236 words · 12 sentences · 4 beats · 2128.375–2221.550 s (93.2 s; speech 83.9 s) · 35:28.38–37:01.55 (measured, dry run 2026-11-05).

## s28_ian_record
> PENDING flood_visuals v3 (reports/data/ch00_coordinates_flood_visuals.md §v3): Ian gets NO swipe unless v3 finds its inland flooding clearly visible; then this scene may gain a swipe (swap rule in the storyboard). Visual now: the two NOAA gauge curves (build-1 s40) large.
What did satellites see of Ian's surge? Here's an honest answer: nothing. The surge drained back to the sea within hours, before any satellite or survey plane passed overhead. So the best record of it is the tide gauges we just met, which measure the water level every few minutes. Here are their two lines over a day and a half: the water rises by about two point two metres above the normal tide at Fort Myers, and drops by about one point eight metres below it at Saint Petersburg, both within a few hours of landfall. [beat] Those two lines are the surge, measured.

> 104 words · 6 sentences · 1 beats · 2221.550–2263.150 s (41.6 s; speech 37.9 s) · 37:01.55–37:43.15 (measured, dry run 2026-11-05).

## s29_flood_flight
> PENDING flood_visuals v3: the flight goes to the event the scout picks (provisional Amphan: globe, Bay of Bengal with ETOPO depth and the 20/200 m lines, landfall, track). Slots: {EVENT}, {BASIN}, {LANDFALL_PLACE}, {SHELF_KM}; re-voice the slot sentences.
Floods that last longer can be seen from space. Let's fly to one: the Bay of Bengal, after Cyclone Amphan in twenty twenty. The blue gets darker where the sea gets deeper. The white line marks where the sea is twenty metres deep, and the darker line two hundred metres. Off the Sundarbans, the sea stays shallower than twenty metres for about thirty three kilometres from the coast. [beat] A wide, shallow shelf like this lets a storm pile the water up high, just as off Florida. Here's Amphan's track, coming up from the south of the Bay, and crossing the coast in the Sundarbans on the twentieth of May.

> 109 words · 7 sentences · 1 beats · 2263.150–2306.850 s (43.7 s; speech 39.6 s) · 37:43.15–38:26.85 (measured, dry run 2026-11-05).

## s30_flood_swipe
> DECIDED flood_visuals v3 (user 2026-11-05): the swipe is Cyclone Nargis 2008 (Irrawaddy delta, Myanmar), MODIS Terra 7-2-1, 21 Apr 2008 (−11 d) | 5 May 2008 (+66 h, ≈ 3 d), landfall 2 May. Re-voice S0 (bridge), S6, S7.
Satellites caught a cyclone's flood most clearly for Cyclone Nargis, in the same Bay of Bengal, in May two thousand and eight. Here's a before and after picture from NASA's MODIS instrument. It's in false colour. The satellite measures light that our eyes can't see, shortwave infrared and near infrared, and we paint them red and green, with ordinary red light painted blue. In these colours, plants look bright green, bare ground looks brown, clouds look white, and water looks dark blue or black. That makes water easy to spot. On the left is the twenty first of April, eleven days before landfall. On the right is the fifth of May, about three days after. [beat] As the line glides across, dark water spreads over land that was green before. [beat] Both pictures are pinned to the same latitudes and longitudes, so every pixel compares the same patch of ground. Even so, the picture shows what the surge left behind, not the surge itself. How to map floods from space has its own movie later in this series.

> RE-VOICE S0 (new Nargis bridge), S6, S7 (Nargis dates) (light phase 2026-11-05; new sentences timed at 142 wpm by checks/make_timing.py until the final TTS). Was: 153 words · 11 sentences · 2 beats · 2306.850–2375.050 s (68.2 s; speech 61.6 s) · 38:26.85–39:35.05 (measured, dry run 2026-11-05).

## s31_recap
To sum up, the tip of r hat moves along a circle of radius one, so for a small turn delta theta, it moves delta theta along theta hat. That gave us the slopes of cosine and sine: minus sine, and cosine. So d r hat by d theta is theta hat, and d theta hat by d theta is minus r hat: each arrow swings towards the other one. The product rule says that a number times an arrow changes through both of them. On a ring, the angle grows at v over r, the velocity is v theta hat, and the acceleration is minus v squared over r, times r hat: inward, even at a steady speed. For Ian's ring, that's about zero point zero four eight metres per second squared, about two hundred times smaller than gravity. Adding the height z gives cylindrical coordinates, and averaging round the rings shows a tropical cyclone's in, up and out, in Ian and in Amphan alike. Wind blowing onto a coast piles up a storm surge. Tide gauges measured Ian's, and satellites can map the floods a surge leaves behind. In Part 3, we'll take these ideas to the biggest round shape of all: the Earth.

> 206 words · 10 sentences · 0 beats · 2375.050–2456.550 s (81.5 s; speech 77.5 s) · 39:35.05–40:56.55 (measured, dry run 2026-11-05).

## s32_end
This video is one of a series of related maths tutorials, so watch out for the others. They're made for students of atmospheric science, meteorology and fluid dynamics, and anyone else who needs these ideas. The notebook for coordinates, and the notebooks for the other maths concepts, are on the website that goes with this video.

> 56 words · 3 sentences · 0 beats · 2456.550–2479.450 s (22.9 s; speech 21.9 s) · 40:56.55–41:19.45 (measured, dry run 2026-11-05).
