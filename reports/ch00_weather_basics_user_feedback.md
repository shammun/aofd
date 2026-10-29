# ch00_weather_basics — user feedback round 1 (2026-10-28, VidNotes review of the final v3 fix 3)

Source: `movies/out/ch00/ch00_weather_basics/review_1080_20261028-2223.html` (73 notes, voice-typed; frames extracted to
`G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_weather_basics/user_review1/`). 33 notes have no comment
(tool misfire, per the user) and are not acted on; note 71 ("look it up", 37:03) is unclear — no action. Notes are
paraphrased from voice typing; the frame image beside each is the ground truth for *where*. Timestamps are of v3 fix 3.

## Standing rule changes (apply to every movie from now on)
- **U-WB-R1 — data-source credit on screen.** Every frame that plots real data (maps, globes, station graphs, soundings,
  satellite images, specific events) carries a small **source line** at the bottom of the frame (e.g. "Data: ERA5,
  Copernicus C3S · 1 Nov 2023 18 UTC"), with time and place for specific events. Not spoken. This replaces the earlier
  "no footnotes" rule for data credits only (equation labels and book references stay off screen). Notes 41, 47, 48,
  52, 53, 56, 58, 60, 61, 63, 64, 66, 69.
- **U-WB-R2 — a colour bar on every coloured data field** (globes and maps): what the colours mean, with units. Notes
  48, 53, 66.
- **U-WB-R3 — 3-D where it explains space.** Columns of air, slabs and parcels are drawn as 3-D objects (x, y, z) when
  the narration talks about areas or volumes (1 m², 1 m³, a column from the ground to the top). Notes 12, 18, 23.
- **U-WB-R4 — engaging camera on globes.** Globes rotate, zoom in/out and fly around to the place being discussed; use
  the space (bigger globe, smaller side chart); keep camera continuity between consecutive globe scenes (the user
  liked the continuity at 17:06 and wants it everywhere). Notes 8, 48, 51, 52, 60.
- **U-WB-R5 — every number and step explained.** No calculation appears without saying what each factor is and why we
  compute it; derivations show the integration step; "why do we care" intuition for each new quantity. Notes 10, 20,
  28, 29, 32, 35, 37, 39, 40, 42, 54.

## Items (scene ids from movies/ch00/ch00_weather_basics/storyboard.yaml)
| U-id | Time | Scene (approx.) | Note | What to change |
|---|---|---|---|---|
| U-WB-01 | 00:02.9 | s00 title | 1 | (User: "I love" the opening.) Keep. |
| U-WB-02 | 00:10.4 | s00 title | 3 | Title wording: the subtitle "…and how meteorology uses them" is wrong for this movie. Use e.g. "Weather basics / made easy / and how meteorologists read the weather" (director proposes; keep house title pattern). |
| U-WB-03 | 00:35.2 | early globe scene | 8 | Globe: rotate + zoom in/out + change direction while shown, for visual appeal (R4). |
| U-WB-04 | 00:45.1 | radius scene | 9 | When saying "radius 6371 km", rotate the Earth so the full radius from centre to surface is visible; draw it as a bold coloured line (not a white dashed line). |
| U-WB-05 | 00:56.5 | thin-atmosphere scale | 10 | The 12/6371 × 150 mm ≈ 0.3 mm calculation is unclear. Explain: we shrink the Earth to a 30-cm globe (radius 150 mm); the same shrink factor applied to the 12-km-deep weather layer gives 0.3 mm — about three sheets of paper. Say what each number is (12 km = depth of the weather layer, 6371 km = Earth's radius, the ratio = how thin, ×150 mm = on the small globe). |
| U-WB-06 | 01:40.4 | air parcel intro | 11 | Make the air-parcel idea concrete: zoom from the real 3-D globe into a 3-D scene (e.g. a landscape/town) and show a 3-D air parcel (a box/blob of air) moving from one place to another. If a city is too hard, any 3-D zoomed-in scene with parcels moving. |
| U-WB-07 | 02:32.6 | 1 m² column | 12 | Draw the 1 m² column as a 3-D column from the ground to the top of the atmosphere (x, y, z), so it clearly starts at the bottom and goes all the way up; camera can move around it (R3). |
| U-WB-08 | 07:34.3 | slabs | 18 | Slabs of air as 3-D transparent slabs with the 1-m² (or stated) square area visible (R3). |
| U-WB-09 | 08:14.2 | s? weight of a slab (m = ρΔz) | 20 | Show the steps: m = ρ V = ρ × (1 m² × Δz); W = m g = ρ g Δz (state mass = density × volume, weight = mass × gravity). Currently "m = ρΔz" skips the volume. |
| U-WB-10 | 10:44.6 | column / box | 23 | Same 3-D rule: the box occupies x, y and z with the 1 m² base visible (R3). |
| U-WB-11 | 10:53.7 | units reveal | 26 | Units appear late; show each unit the moment it is spoken. |
| U-WB-12 | 11:08.9 | scale height H = RT/g | 28 | Explain why we define H = RT/g, what it means (the height over which pressure falls by a factor e), and why we care (it sets how fast pressure drops with height; one number for "how thick the air is"). |
| U-WB-13 | 11:24.3 | 8.43 km / 1.225 example | 29 | The user was lost: explain why we compute H here (= 287 × 288 / 9.81 ≈ 8.43 km), what each number is (R, T, g), and why 1.225 kg/m³ appears (sea-level standard density) — and what the example is trying to show. Re-order so the purpose comes first. |
| U-WB-14 | 11:59.1 | isothermal derivation | 32 | Explain why we assume the same temperature at every height (a simplification to get a clean formula; real T varies — say so), and show the integration step by step: dp/p = −dz/H → ∫ from p0 to p and 0 to z → ln(p/p0) = −z/H → p = p0 e^(−z/H). |
| U-WB-15 | 12:17.7 | ÷ e every 8.4 km | 35 | Explain e ≈ 2.72 (where it comes from: the exponential; "divided by e" = "to about 37 %") and say it as "every 8.4 km up, pressure falls to about 37 % of what it was". |
| U-WB-16 | 12:19.3 | −11 % per km | 37 | Explain how −11 %/km is computed (1/H = 1/8.43 km ≈ 0.119 per km, so near the ground pressure falls by about 11–12 % per km; what it is a percentage of: the pressure at that height). |
| U-WB-17 | 12:27.7 | stacked-layers picture ("like") | 39 | The stacked boxes graphic is unclear — explain what it shows (each layer squashed by the weight above → thinner/denser near the ground) or replace with a clearer 3-D picture. |
| U-WB-18 | 12:43.8 | 8.43 × ln … | 40 | Show clearly which equation gives the height where pressure is halved/divided (z = H ln(p0/p)) and walk the numbers. |
| U-WB-19 | 13:22.4 | specific event | 41 | Source line (R1). |
| U-WB-20 | 14:04.0 | fraction of air below | 42 | Explain "fraction below = 1 − p(z)/p0" (pressure = weight of air above, so p/p0 is the share above; one minus it is the share below) and why 5.5 km gives 0.50. |
| U-WB-21 | 14:38.1 | balloon trail | 43 | Leave a small gap between the balloon and its trail line, and give the balloon's bottom/basket a different colour from the trail so they don't merge. |
| U-WB-22 | 16:01.7 | city values | 47 | Source line for every city value (R1). |
| U-WB-23 | 16:05.3 | 3-D globe with layers | 48 | Make the globe bigger (chart smaller), zoom in and fly to places to show the layer differs around the world; add a colour bar with values; source line (R1, R2, R4). |
| U-WB-24 | 16:31.2 | rising/cooling cartoon | 49 | The cartoon looks dull ("no one is going to love it"). Rethink: use real imagery/data (e.g. a real cumulus/thermal from satellite or a real sounding) with animation; make it engaging and informative. |
| U-WB-25 | 16:37.5 | expanding parcel | 50 | The parcel must visibly expand as it rises (lower pressure), drawn as a 3-D parcel, with a colour change as it cools (warm red at the bottom → cooler blue higher up). |
| U-WB-26 | 17:04.2 | Blue Marble globe | 51 | Use a less cloudy globe image; spin it around the equator, then change the spin direction (e.g. towards the north / south pole) for engagement. |
| U-WB-27 | 17:06.6 | specific humidity globe | 52 | (User liked the camera continuity into the humidity globe.) Keep that; add the data source (R1) and ensure the same continuity everywhere globes follow each other (R4). |
| U-WB-28 | 17:16.6 | data fields | 53 | Source line and colour bar for every plotted variable (R1, R2). |
| U-WB-29 | 17:35.2 | e ≈ 1.61 q p | 54 | Explain e ≈ 1.61 q p: q = specific humidity (kg of vapour per kg of air), p = air pressure, e = vapour pressure; 1.61 ≈ (molar mass of dry air)/(molar mass of water) = 28.96/18.02; the vapour's share of pressure follows its share of molecules. |
| U-WB-30 | 23:52.6, 24:19.4, 25:10.2, 25:13.3, 27:59.1, 28:00.2, 30:19.5, 32:01.0 | data maps/globes | 56, 58, 60, 61, 63, 64, 66, 69 | Source line (with time and location) on each (R1); colour bar at 30:19 (R2); at 25:10 spin the globe to show more of it (R4). |
| U-WB-31 | 31:22.5 | cold/warm air front cartoon | 68 | Much better animation of cold and warm air: use real data (e.g. ERA5 temperature/wind cross-section or 2-m temperature with many wind vectors), lots of moving air vectors/particles, make it engaging and informative. |

## Process
1. movie-director revises storyboard.yaml + script.md for U-WB-02, 05, 09, 12–18, 20, 29 (narration/explanations) and
   writes the visual specs for R1–R4, U-WB-03, 04, 06–08, 10, 11, 21, 23–28, 30, 31 (incl. data/tool choice for the new
   3-D scenes); TTS dry run.
2. motion-builder builds (3-D via @remotion/three / Cesium per map-toolkit), renders, QA (13 gates + a new check that
   every data frame has a source line).
3. Fresh reviews (≥ 2) then the user.
