# Chapter 0 movies: retro-fit plan for HOUSE_STYLE §5b (rules G1–G6)

The movie-director wrote this plan on 2026-10-29. It is a plan only: no storyboard was edited, nothing was rendered and nothing was committed.

**Sources.** `movies/HOUSE_STYLE.md` §5b and `reports/ch00_weather_basics_user_feedback_round2.md` (G1–G6). The model frame for G1 is cross product Part 2 at 29:30.

**What I checked**
- The storyboards in `movies/ch00/*/storyboard.yaml`.
- The review history in `reports/ch00_movies.md`.
- **484 frames** extracted with ffmpeg from the rendered movies in `movies/out/ch00/*/`. Each sampled scene got frames at 20 %, 55 % and 90 % of its length. Every scene got its midpoint frame, and there are some extra frames.
- The frames, contact sheets and crops (53 MB) are in `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/retrofit_5b/`, with one folder per movie: `part2/`, `part1/`, `v5/`, `dotv6/`, `dot01b/`, `vec1a/`, `deriv4/` (`mid/` = midpoints).

**Out of scope.** Weather basics is planned separately and is left out here. Its layer stacks are reserved: temperature, pressure, humidity and wind with height around Brest and Storm Ciarán, 2023. No stack below reuses that combination of variable, place and date.

Times are `m:ss` in the rendered file named for each movie. Scene ids are the storyboard ids.

---

## 0. Summary

| Movie | State | Must | Should | Optional | Layer-stack idea (G6) | Re-open? |
|---|---|---|---|---|---|---|
| 0.1 dot product v6 (`ch00_dot_product_why`) | final; superseded by 0.1b | 0 | 0 | 1 | none (no value) | **No** |
| 0.1b dot product (`ch00_dot_product_v01b`) | final (review 2 PASS) | 1 | 3 | 1 | none (no value) | **Yes, one scene** (s20c) |
| 0.2 cross product v4 (`ch00_cross_product_why/1080.mp4`) | superseded by v5 | — | — | — | — | **No** (retired) |
| Cross product v5 full (`ch00_cross_product_why/v5_1080.mp4`) | final (review 3 PASS) | 31 (23 scenes) | 14 | 0 | none (no value) | **Yes, if v5 is published** (same scenes as Part 2) |
| Cross product Part 1 (`ch00_cross_product`) | final | 0 | 1 | 0 | none | **No** |
| Cross product Part 2 (`ch00_cross_product_uses`) | final (review 3 PASS) | 31 (23 scenes) | 13 | 0 | none (no value) | **Yes** (the 29:30 model frame itself breaks G3) |
| #1a vectors and index notation | final (review 3 PASS) | 5 | 10 | 2 | **wind vector and its components at 16 heights above Trappes** (the hodograph made 3-D) | **Yes** (5 musts + a valuable stack) |
| #4 derivatives and Taylor | in progress (fix loop) | 2 | 9 | 0 | **∂T/∂z between 16 layers over northern France, 30 Sep 2026, tropopause** | fold into the current fix loop |
| #1b alternating tensor, triple products | planned (storyboard pre-§5b) | 9 + G3 everywhere | 2 | 1 | optional: air crossing the coast as 20 flux ribbons | amend storyboard |
| #5 coordinates | planned | 8 + G3 everywhere | 7 | 1 | **Ian in cylindrical coordinates: radial wind on 18 levels** | amend storyboard |
| #6 gradient | planned | 7 + G3 everywhere | 1 | 0 | **∇T on 12 levels through a sloping cold front** (new case) | amend storyboard |
| #69 reading weather maps | planned | 13 + G3 (22 scenes) | 8 | 0 | **thickness as 9 slabs between 10 pressure levels** | amend storyboard |
| #7 divergence | not started | — | — | — | **convergence low, divergence aloft: the ITCZ, July mean, 12 levels** | write with §5b |
| #8 curl | not started | — | — | — | **vorticity of a typhoon on 12 levels: cyclonic low, anticyclonic outflow aloft** | write with §5b |
| #28B circular motion | not started | — | — | — | none (no value) | write with §5b |
| #29 Coriolis | not started | — | — | — | **the night-time low-level jet: inertial turning on 12 layers over the Great Plains** | write with §5b |
| #29B centripetal vs centrifugal vs Coriolis | not started | — | — | — | none (no value) | write with §5b |
| rest of series v2 | not started | — | — | — | one distinct stack each where it earns it (§6) | write with §5b |

How the counts work:
- **Must**: breaks a rule the user stated in G1–G5, or a rule-level G4 overlap.
- **Should**: a likely break that depends on the reading in §1 (Q1), or a size or legibility issue under G1.
- **Optional**: polish.
- For finished movies the counts are scene-items seen on frames. For planned movies they are storyboard scenes to amend, so they cost no render.

---

## 1. How the rules are read (please confirm Q1 and Q4 in §8)

- **G1/G2 globe frame.**
  - A 3-D globe (or half-Earth, Cesium drape or zoomed globe patch) gets a large frame: most of the screen's height and width, like Part 2 at 29:30.
  - When it zooms, rotates or flies, the frame's four edges fade softly. A hard rectangle (the 3-D box) must never show.
  - A whole, unzoomed globe needs no fade.
  - While zoomed, text may fade or sit behind, and the globe takes the main space.
  - A globe under about 600 px across in a content scene is a **should** (it is "too small", not "boxed").
- **G3 source lines.**
  - The data-source line sits **wholly below** the picture's bottom edge (≥ 16 px gap) and above the caption band (y < 880).
  - The cause is shared. `SourceLine` in `movies/src/ch00/CrossProductWhy.tsx` (and its twins in `kit_vi`, `kit_dt`) draws at a fixed **y = 852**, whatever the picture's size. Every picture whose bottom reaches below y ≈ 836 therefore gets its credit printed on it.
- **G4 no text over images or over text.** The reading I recommend (Q1):
  - **Must**:
    - Text over other text, in any amount.
    - On a real image or globe (satellite, Blue Marble, reanalysis field, CERES): titles, dates, keywords, calculations and readouts ("k × u = (0, 5, 0)", "about 450 km in 6 h"), colour bars and colour-bar captions, insets and graphs.
  - **Should**: short feature labels on a real image.
    - Place names, H/L, tip letters (u, k × u), scale bars, station plots.
    - Move them off the image with a gold leader line where possible. Keep them only where the label *is* the content, as with the station plots in #69, with the dark 3-px outline.
  - **Optional**: labels on code-drawn idealised maps (the dot-product map), which the user approved in v6.
- **G5.** Every vertical edge of an air slab or column frame runs from its floor to its top face. Slabs between two sheets have posts from the lower sheet to the upper one.
- **G6.** A many-layer stack (≫ 3 layers, unlike the 3-layer captest `X3Stack.mp4`) is used only where a variable changes with height and the stack teaches something a profile or a slice cannot.
  - The camera goes round, through, inside and below the stack.
  - Each movie has a different variable, place, date or idea.

---

## 2. Shared fixes: build once, then every movie uses them

The weather-basics UF2 build already needs K1, K2, K4 and K5. To avoid three more forks (kit_cp, kit_vi, kit_dt), build them once in `movies/src/house/kit/` and import them everywhere.

| ID | Component | What it does | Used by |
|---|---|---|---|
| K1 | `GlobeFrame` (`house/kit/frame.tsx`) | Large frame (default x 80–1840 when full width, 80–1000 in the picture zone, y 40–820), CSS mask with soft linear fades on all four edges while `zoom > 1` or the globe is cut; no fade for a whole globe. Optional text "behind" mode for G2. | every globe, half-Earth, Cesium and satellite-patch scene |
| K2 | `SourceBelow` | Takes the picture's bounding box and puts the source line ≥ 16 px under it (and inside y 40–872). It **throws** if the picture's bottom is > 856, so the layout must leave room. Replaces the fixed-y `SourceLine` in all kits. | every data scene |
| K3 | `Callout` (off-image label) | Puts a title, keyword or readout in the free zone with a gold `CurvedLink` to its feature. The link may not cross text (house §6). | G4 must items |
| K4 | slab/column edges (`col3d` from `kit_wb`) | Four posts and top/bottom rims; edges always span floor → top; optional dz highlight. | 1a s09, #4 s25, #6 s17/s32, #69 s13/s44/s53, #5 s14 |
| K5 | `LayerStack3D` (`house/kit/stack3d.tsx`) + `movies/data/_stack.py` | N textured layers (Float32 → colour map in the shader, one shared colour bar, 52-px ticks), real heights from geopotential (vertical exaggeration recorded in the manifest, not badged). Camera presets: `orbit`, `flyThrough` (between two layers), `inside`, `below` (look up), `topDown`. Per-layer glyphs: arrows, tip letters, isolines. Deterministic (frame-driven). | every stack in §3–§6 |
| K6 | QA gate `overlap` in `tools/movie_qa.py` | Every 0.5 s, compare the text bounding boxes with each other and with the image/globe masks. FAIL on text–text overlap or on must-class text inside an image mask. Start from the cross-product v4 builder's label checker (its reports are under `G:/…/v4/labels/`; it is not in `tools/`). Add the three overlap kinds review 2 said it missed: text vs filled shapes, vs arrows and arcs, vs links. | all re-renders and new movies |

**Cost.** About one builder day for K1–K6 together, most of it shared with weather basics UF2. Do this first. Every re-render below assumes K1–K6 exist.

**Render-cost basis** (real numbers from `G:/…/scratch/movies/ch00_cross_product_v5/fx1/render.log`): 1000-frame pieces render in 60–68 s (≈ 15–16 fps) on this machine. That makes **≈ 1 min of render per 33 s of changed video** for 2-D scenes, and about 2× that for three.js globe scenes. On top of that:
- chunk splice and QA: ≈ 30 min per movie;
- a targeted fresh review: ≈ 1 h per movie.

---

## 3. Finished movies

### 3.1 Cross product Part 2 (`ch00_cross_product_uses`, 40:56.8) and v5 (`ch00_cross_product_why/v5_1080.mp4`, 69:14.6)

Part 2 and v5 render the **same scene code** (`movies/src/ch00/CrossProductWhy.tsx`), so every fix lands in both. The v5 time for s23–s46 is the Part 2 time + 28:07.2 (s23 3:00.2 → 31:07.4; s45 37:21.6 → 65:28.8). Frames: `retrofit_5b/part2/`, `v5/`.

**Must**

| ID | Rule | Scenes (Part 2 time) | What is wrong (seen on frames) | Fix |
|---|---|---|---|---|
| P2-M1 | G3 | s01 0:12.8–0:26.1 · s23 3:00–4:05 · s23a 4:05–4:59 · s25a 5:43–6:34 · s25 6:34–7:23 · s25b 7:23–8:19 · s27c 17:16–18:17 · s27e 19:05–20:05 · s28a 22:48–23:46 · s28b 23:46–24:28 · s28c 24:28–25:14 · s30 26:32–27:10 · s32 27:45–28:18 · s33 28:18–29:03 · **s34 29:03–29:47 (the model frame at 29:30)** · s35 29:47–30:07 · s36 30:07–31:04 · s37 31:04–31:47 · s45 37:22–38:14 · s46 38:14–38:58 (**20 scenes**) | The fixed-y source line (y 852) is printed on the globe's lower limb, the half-Earth's face, or the bottom rows of the satellite image (crop `part2/crop_bottoms.jpg`; full frame `model_2930.jpg`) | K2. Lift each picture so its bottom is ≤ 820 (globes: centre up ~30 px or radius −20 px; images: crop 30 px); the line then sits at y ≈ 840 |
| P2-M2 | G4 text over text | s29 26:04–26:32 · s38 31:47–32:19 | s29: "f > 0 · right" runs into "Image: NASA Blue Marble…". s38: "north: anticlockwise" and "south: clockwise" are printed **on** the source line, and both are unreadable (`part2/s38_spin_sign_01935.7.jpg`) | Move the two keyword rows up to y ≈ 790, under the panels (panels end at 760); the source line goes below |
| P2-M3 | G4 text on image | s23 (top-down phase, 3:40–4:05: "u = (0, 5, 0) m/s", "k × u = (−5, 0, 0)") · s23a ("across: turns", "along: speeds up", "k × u = (0, 5, 0)", "u = (5, 0, 0) m/s", "30°") · s29 (tile readouts "k × u = (0, 10)", "u = (10, 0) m/s", "−f k × u") · s31 ("45°N · France", "45°S · Patagonia · Argentina", "10 m/s · east" on the patches) · s36 ("Hurricane Ian · 28 September 2022", "3-km weather model") · s37 ("Cyclone Idai · 14 March 2019", "cyclone", "≈ 54–59 m/s") (**6 scenes**) | Titles, dates and readouts are printed on the imagery | K3: titles go above the picture or into the keyword column; readouts go to the maths zone with gold links; only the tip letters stay at the arrow tips |
| P2-M4 | G1 | s27c (zoomed end, 17:50–18:17) · s28a 22:48–23:46 · s38 31:47–32:19 (**3 scenes**) | The zoomed half-Earth is cut by a straight edge (s27c right edge at x ≈ 990; s28a bottom and right). The two 3-D storm panels in s38 are hard rectangles, so the 3-D box shows | K1 fades on all four edges while zoomed. s38: two GlobeFrames with soft edges, or one shared frame |

**Should**

| ID | Rule | Scenes | What | Fix |
|---|---|---|---|---|
| P2-S1 | G1 size | s24 4:59–5:43 | Globe ≈ 510 px across beside a long keyword list | Radius +35 % (picture zone allows ≈ 760 px) |
| P2-S2 | G4 (Q1) | s23, s28b, s28c, s30, s35, s36, s37, s45, s46 (9) | Feature labels on the imagery: "north", "east", "Ω cos φ", "u = (u, v, 0)" on the Blue Marble floor; "push", "100 km", "500 km"; "eye", "Florida", "Mozambique"; "England", "Cornwall", "Bretagne", "France" and the "1"/"2" markers on Ciarán | Per Q1 (b): keep with an outline where the label is the content (place names on Ciarán); move vector component labels off the floor tile |
| P2-S3 | G4 limb labels | s24 ("west → east" on the limb) · s26 ("right"/"left" on the limb) (2) | Labels sit on the globe's edge | Move them just outside the silhouette |
| P2-S4 | credits | s28_f 25:14–26:04 | "Image: NASA Blue Marble" is shown, but the scene shows only drawn discs | Drop the line in s28_f (SOURCES table) |

**Optional.** None. **Stack (G6): none.**
- The cross-product application is one level: k × ∇p, the turn of a flat wind, the spin sign of a storm.
- A stack of geostrophic winds by level would teach the thermal wind (#32), not the cross product.
- Storm spin by level belongs to #8 (curl).
- Adding either to a final 41-min movie adds length, not understanding.

**Cost**
- About 20 changed scenes ≈ 18 min of video ≈ 33 000 frames, mostly three.js. That is ≈ 60–70 min of render for Part 2, the same again for v5, then splice, QA and one targeted review.
- **Total ≈ 5 h of wall time** (one builder session). There is no TTS change and no timing change.
- Part 1 needs no render (§3.2).

### 3.2 Cross product Part 1 (`ch00_cross_product`, 32:41.1)

Frames: `retrofit_5b/part1/`. Part 1 has no real imagery and no zoomed globe; its globes are small schematic glyphs in s00, s50 and s51.

| ID | Priority | Scene | What | Fix |
|---|---|---|---|---|
| P1-S1 | should | s18c 17:40–18:22 (also v5 s18c) | "base 5.099 · height 2.75" and "a × b = (0, 0, 14)" touch with a 0-px gap (`part1/crop_s18c.jpg`) | +20 px line gap; fold into the v5 render only |

No must items, so no re-render. **Stack: none.**

### 3.3 Cross product v4 (`ch00_cross_product_why/1080.mp4`, 48:27.8)

Superseded by v5 (series plan v2: "0.2 → v5"). **Retire, no work.**

### 3.4 Dot product v6 (`ch00_dot_product_why`, 17:40.6)

Frames: `retrofit_5b/dotv6/`. No globe, no real image and no source line. The map is idealised and code-drawn. Its labels are outlined and sit on the field ("fixed place", "1 °C per 100 km", "13.18 °C", "towards warmer air", "12.82 °C in 1 h").
- **D6-O1 (optional, Q1 c):** only if the user wants even the idealised-map labels off the map.
- The user approved v6 ("I love it"), and 0.1b carries every v6 scene. **Do not re-open v6.** Anything here goes into 0.1b.
- **Stack: none** (the dot product's application is a single-level advection map).

### 3.5 Dot product 0.1b (`ch00_dot_product_v01b`, 25:52.8)

Frames: `retrofit_5b/dot01b/` (`s20c_flux_01323.1.jpg`).

| ID | Priority | Rule | Scene | What | Fix |
|---|---|---|---|---|---|
| D1-M1 | must | G3/G4 | s20c 21:08.5–22:09.2 | "60°N", "× 2 ground" and "equator" are printed on the Blue Marble globe; the gold link passes over the globe | Labels outside the silhouette (left of the beams) with short leader lines; "× 2 ground" moves to the maths zone beside ŝ · n̂ = cos 60° = 0.5 |
| D1-S1 | should | G1 size | s20c | The globe is ≈ 540 px at the 60° step and ≈ 280 px at the midpoint (the scene opens small) | GlobeFrame, ≈ 760 px from the cut onwards |
| D1-S2 | should | credit | s20c, s20d (22:09–23:14) | No source line for the Blue Marble globes (house memory: data-source line on data frames) | K2 "Image: NASA Blue Marble Next Generation" under each globe |
| D1-S3 | should | G4 (Q1) | s20d | "Southern Ocean" link ends on the globe; fine if Q1 (b) | none, or move the ring to the coast |
| D1-O1 | optional | G4 (Q1 c) | s12–s20 idealised map | inherited v6 labels | only if Q1 (c) |

**Stack: none.**
- The dot product measures "how much along" at one place and one level (wind along a runway, sunlight through a surface, wind work).
- A height stack would repeat #1a (components by level) or #6 (∇T by level) and add length without a new idea.

**Cost.** s20c and s20d ≈ 126 s ≈ 3800 frames (globe) ≈ 8 min of render, plus splice and QA plus a targeted review: **≈ 1.5 h**.

### 3.6 #1a vectors and index notation (`ch00_vectors_index_notation`, 35:15.2)

Frames: `retrofit_5b/vec1a/` (+ `mid/`).

**Must**

| ID | Rule | Scene | What (frame) | Fix |
|---|---|---|---|---|
| V-M1 | G4 | s05 2:19.4–2:48.4 | The keyword "vector field", the time stamp "1.2 km up · 18 UTC" (white on white cloud, unreadable) and the "30 m/s" key are printed on the MODIS image (`vec1a/s05_vector_field_00145.2.jpg`) | Keyword to the free zone (K3); "1.2 km up · 18 UTC" and the 30-m/s key go below the image, above the source line (image ends at 816 → shrink 40 px) |
| V-M2 | G4 | s12h 15:40.6–16:55.9 | "November 2023", "5 m/s" and the "average" inset label sit on the wind-field image | Title above the image; key and inset label below it |
| V-M3 | G4 | s12i 16:55.9–17:49.5 | "about 450 km in 6 h", "c = (20, 5) m/s" and "6 pm UTC" are printed on the satellite image | Readouts to the maths zone with gold links; the clock below the image |
| V-M4 | G3/G4 | s24 26:58.6–27:27.4 | On the zoom, the map grows down over its own colour bar and the caption "temperature, 1.2 km up" (`vec1a/s24_real_map_01644.5.jpg`) | House rule: hide the colour bar during a zoom, or zoom inside a GlobeFrame-style fixed frame (K1) |
| V-M5 | G3/G4 | s31 31:55.8–32:54.0 | The colour bar, "km east" and "a map of x₁" are drawn inside the map | Colour bar and caption below the map |

**Should**
- **V-S1 (Q1):** feature labels on real imagery. s01 "Brest" on the globe; s05 "Storm Ciarán low pressure"; s12a "jet stream", "New York", "London"; s12d "972 hPa", "968", "Brest", "L"; s12f "5 pm"/"6 pm" and the "6 pm UTC" clock; s15 "e along the coast", "11.5"; s23 "colder"/"warmer"; s25 "100 km", "−3.2 °C", "grad T"; s26 "(5.8, 33.5)", "+3.7 K per hour" (9 scenes).
- **V-S2 (G4, link over text):** s15 19:41–20:53. The gold link from "11.5" crosses the calculation "u · e = …". Bend it below the line.

**Optional**
- **V-O1:** s09 (5:02–5:27). Two planes (relief floor and the 850-hPa plane) and no column frame. Add four K4 posts so the "about 1.2 km" layer reads as a slab. Not a G5 break today: there are no edges, so none stop short.
- **V-O2:** soft edges on the tilted relief tiles in s06, s07 and s12. They are floors, not globes, so G1 does not apply.

**Stack (G6): K1A, the wind in 16 layers above Trappes.** Rated should, and clearly valuable.
- **Why it adds understanding.** s12g states "clockwise going up (seen from above)" from a 2-D hodograph that a first-time viewer cannot see in 3-D. The stack shows the same arrows where they live, one per height: longer as we climb, and turning clockwise seen from above. It also shows that each layer has its own two components.
- **Variable, levels, region and time.** The horizontal wind vector (u₁, u₂) and its component legs, at 16 reported levels from the surface to 200 hPa (the hodograph's own levels). The place is Trappes; the time is 1 Nov 2023, 00 UTC.
  - **Data:** `IGRA2` (registered, already used by s12g; no download).
  - Richer option (a field of arrows per layer): a new key `ERA5-ARCO-trappes-20231101T00-uv16`, holding u and v on 16 levels (1000–200 hPa), 45–52 N, 2 W–8 E, 0.25° (< 1 MB).
  - Not the weather-basics combination: wind *vectors* (not T, p or q), at Paris, at 00 UTC.
- **Camera.**
  - `orbit` from the side: lengths grow.
  - `topDown`, looking straight down through the translucent stack: the arrows fan clockwise.
  - `flyThrough` between the 850- and 500-hPa layers, which light up as the two hodograph arrows.
  - `below`: the slowest arrow is nearest the ground.
- **Narration (draft, measured in §7):** "Let's stack the wind above Trappes at sixteen heights, one thin layer for each. Every layer holds one arrow, with its own east and north components. From the side, the arrows grow longer as we climb. Now let's look straight down through the stack. Going up, the arrows turn clockwise, seen from above. That's the same turning the hodograph showed, now layer by layer."
- **Where.** A new scene s12g2 right after s12g (14:26.8–15:40.6), before the anomaly scene s12h.
- **Physics source.** `fluidpy.diag.sounding` reader of the IGRA2 profile (as in s12g) and `fluidpy.geo.vectors.components_in_axes`. Add a CHECK row on the turning sense (sign of the cross product of successive arrows, which is negative for clockwise).

**Cost**
- Must fixes: 5 scenes ≈ 4.6 min of video ≈ 8300 frames ≈ 10–15 min of render.
- New stack scene: ≈ 30 s, a 6-sentence TTS splice and a new manifest entry.
- With splice, QA and a targeted review: **≈ 5–6 h**.

### 3.7 #4 derivatives and Taylor (`ch00_derivatives_taylor`; frames from `build1_1080.mp4`, 46:38.8; times below from the repo `timing.json`, 48:27.2, which is ahead of build1)

Frames: `retrofit_5b/deriv4/` (`x_sheet.jpg`, `s41_cc_climate_02407.1.jpg`).

| ID | Priority | Rule | Scene | What | Fix |
|---|---|---|---|---|---|
| T-M1 | must | G1 | s09 6:43–7:54 | The globe flies to Trappes inside a box: the zoomed globe is cut flat at top and bottom, then a hard-edged rectangle of Europe (`deriv4/x_sheet.jpg`) | K1 GlobeFrame with edge fades, large frame during the flight |
| T-M2 | must | G4 | s41 39:56–40:50 | The W/m²–T graph (axes, ticks) and "≈ 240 W/m² global average" are drawn over the CERES globe | Graph to the maths zone; the readout outside the silhouette with a gold link |
| T-S1 | should | G1 size | s40 38:48–39:56, s41 | The CERES globe is ≈ 400–540 px | GlobeFrame ≈ 760 px |
| T-S2 | should | G4 (Q1) | s07, s08, s12, s16, s17, s19 (6) | Readouts and labels on the ERA5 maps ("8.2 °C", "fixed thermometer", "20 km", "+30 min", "7.6 °C", "≈ 360 km/h", "17 km") | Per Q1 (b): readouts (numbers) off the map with links; place names may stay |
| T-S3 | should | G4 link | s19 16:32–17:54 | Gold link crosses the 10⁻³ tick labels | Re-route below the axis |
| T-S4 | should | G4 / G5 | s25 23:27–24:16 | The column's edges do reach the top (G5 passes), but "weight" sits on the column's edge line | Label left of the column |

**Stack (G6): K4, ∂T/∂z between 16 layers.** Rated should, and valuable.
- **Why it adds understanding.**
  - s09 gets ∂T/∂z ≈ −5.7 °C/km from two points of one profile. The stack shows that "partial T by partial z" is a field: every gap between two layers, everywhere over the region, has its own finite difference.
  - It shows the tropopause as the height where the gaps stop cooling.
  - It ties into the finite-difference scenes s44–s46 (models difference *between their levels*).
- **Variable, levels, region and time.** Temperature on 16 pressure levels, 1000–100 hPa, with the gaps labelled ΔT/Δz from geopotential heights. The region is 45–52 N, 3 W–7 E, at 30 Sep 2026, 12 UTC: the movie's own Trappes case.
  - **Data:** a new extension of the registered `ERA5-CDS-trappes-20260930-pl`, from 3 levels (850/700/500) to 16 levels, adding t and z (≈ 0.3 MB).
  - Distinct from weather basics (France 2026, not Brittany 2023) and from #6.
- **Camera.**
  - `orbit` around the stack (warm at the bottom, cold on top, one colour bar).
  - `flyThrough` *down* the gaps at Trappes, with a vertical needle through the stack and each gap's number lit as we pass.
  - `inside` at the 200–150-hPa gap, where the sign changes.
  - `below`.
- **Narration (draft, measured in §7):** "Now let's look at all the air above northern France at once, as sixteen layers, from near the ground to about sixteen kilometres up. Each layer is coloured by its temperature, on one colour scale. Between two neighbouring layers, the change in temperature divided by the gap in height is a step towards partial capital T by partial z. Let's fly down through the gaps. Almost every gap says the same thing: colder going up. Only near the top do the gaps stop cooling. That's the tropopause, where the air above is no longer colder."
  - The heights ("sixteen kilometres") and the tropopause level come from CHECK rows.
  - The sentence about the gaps only holds if the case's 100-hPa level is above the tropopause. Verify it with `fluidpy.geo.atmos.lapse_rate_tropopause`.
- **Where.** A new scene s09b right after s09.
- **Physics source.** `fluidpy.diag.sounding.layer_lapse_rate` (per gap, both lapse-rate conventions) and `fluidpy.geo.atmos.lapse_rate_tropopause`.

**Cost.** In the current fix loop: storyboard and script edits, an ≈ 45-s scene, and T-M1/T-M2 relayouts. This adds about 1.5 h to the loop. No separate re-open.

---

## 4. Planned movies: amend the storyboard before the build (no render cost)

These storyboards were written before §5b. Amend each in one pass, with K1–K6 named in the `visual:` fields. Each needs:
- a one-line `layout_5b:` note per scene;
- "GlobeFrame (fades while zoomed)" on every moving globe;
- "SourceBelow" on every data scene;
- labels moved off images;
- K4 edges on every column.

### 4.1 #1b alternating tensor and triple products (`ch00_alternating_tensor_triple_products`, 27:55.6 planned)

- **Must (G1):**
  - s01_hook and s12_omega: the globe camera moves.
  - s05_coriolis_why: a spinning globe with a real low; it must be large.
  - s16_coriolis_globe and s32_centrifugal: half-Earth and globe. Use GlobeFrame, ≥ 760 px.
- **Must (G4):**
  - s01: the 'Brest' billboard plus keywords (keywords off the globe).
  - s16: the Coriolis readouts on the globe, which go to the maths zone.
- **Must (G5):**
  - s23_parcel_volume: the parallelepiped's four slanted edges run base → top face.
  - s25_flux_easy: flux box edges complete.
- **G3:** every data scene uses SourceBelow.
- **Should:** s14_coriolis_real and s31_double_turn, the zoomed Brest map. Use a fixed frame and hide the colour bar while zoomed.
- **Stack (optional), K1B: flux ribbons.**
  - The air crossing the Brittany north coast, as 20 vertical ribbons (one per level, 1000–300 hPa) along the coast.
  - The scalar triple product (u Δt) · (along × up) gives the volume per second through each ribbon. Summing the ribbons gives the column's flow.
  - Data: the registered `ERA5-CDS-ciaran2023-section` (20 levels, 46–51 N, 1 Nov 2023 18 UTC). **But weather basics uses this file and place** (front slice, s47/s48). The stack is different (a normal flux on ribbons, not temperature or a front), yet the place and date repeat. **Recommend skipping it**, unless WB UF2 drops that file (Q4).
  - Draft narration and timing in §7. The place would be s27_flux_meaning. The function is `fluidpy.geo.vectors.triple_scalar` plus `fluidpy.diag.sections.along_section_wind`.

### 4.2 #5 coordinates (`ch00_coordinates`, 46:51.3 planned)

- **Must (G1):** s01_hook, s11_ian_polar (the zoom to the eye), s15_sphere (orbiting), s24_enu (Cesium close-up), s25_enu_turn and s29_great_circle (camera moves). Use GlobeFrame with edge fades on every zoom or flight.
- **Must (G4):** s11 (billboards 'Fort Myers', 'Tampa', 'Naples' and readouts on GOES: readouts off-image), s26 (u and v readouts on the globe go to the maths zone).
- **Must (G5):** s14_cylinder. The translucent cylinder's outline (silhouette lines and the top rim) runs from the sea to 15 km.
- **Should (Q1):** place billboards on the globe in s17, s19 ('Brest', 'Longyearbyen'), s22, s29, s31 and s32. Keep them outlined, or put them outside with leader lines.
- **Stack (should, strong), K5: Ian in cylindrical coordinates.** Upgrades s14_cylinder from illustrative streaks to real data.
  - **Variable:** the radial wind u_r (inflow negative, rose with a hatch and a "−" glyph; outflow positive, orange) as each layer's colour, with the tangential wind u_θ as arrows.
  - **Levels and time:** 18 levels, 1000–100 hPa, Hurricane Ian, 2022-09-28 18 UTC.
  - **Data:** `ERA5-ARCO-ian2022-pl`, registered and already in #5's data_needs. No download.
  - **Camera:** `orbit` round the cylinder; `flyThrough` up the eye; `topDown` from the top layer looking down at the outflow; `below` looking up at the inflow.
  - **Narration (draft, measured in §7):** "Here is Ian's real wind, cut into eighteen layers, from the sea to about sixteen kilometres up. On each layer, the colour shows the radial wind, the part blowing in or out. Near the sea, it's inflow, with a minus sign: the air rushes in towards the eye. Let's fly up through the eye and look back down from the top. Up here, the sign flips: the air streams out, away from the centre. The same three coordinates, r, theta and z, describe every layer."
  - **Physics:** `fluidpy.diag.cyclone.storm_relative_wind` per level (centre from `storm_centre` on the 10-m wind/MSLP). CHECK rows: the sign of u_r at 1000 and 150 hPa, and the height of the sign change.
- **Stack (optional), pressure as the vertical coordinate.**
  - s27_curvilinear: 10 isobaric sheets draped over the Alps; terrain-following near the ground, nearly flat aloft.
  - New data: ERA5 z on 10 levels over 43–49 N, 4–16 E on one calm day, plus an ETOPO 2022 Alps tile.
  - **Coordinate with #23A**, which owns pressure coordinates. If #5 uses the Alps, #23A uses a cold trough (§6). Both is fine, as the place and idea differ.

### 4.3 #6 gradient (`ch00_gradient`, 31:21.2 planned)

- **Must (G1):** s22_sphere (globe), s36_jet (globe with the GFS 250-hPa jet) and s37_gulf_stream (globe turning to the US coast). Use GlobeFrame and fades while turning.
- **Must (G5):** the columns in s07_operator (small air column), s17_lapse_rate and s32_vertical_pressure (Trappes column), and s25_box. Every edge runs to the top.
- **G3:** every data scene uses SourceBelow. This includes the Cesium drapes in s01 and s15, whose credit goes under the drape.
- **Should (monotony, the spirit of G6):** s17_lapse_rate uses the **same Trappes 30 Sep 2026 sounding as #4 s09** for the same quantity, ∂T/∂z.
  - Switch #6 s17 to the registered **Singapore** IGRA2 sounding (2023-11-01 00 UTC). A tropical tropopause near 16–17 km gives a fresh contrast and a new number.
  - Or keep Trappes and change #4's case. Keeping #4 is cheaper (§3.7).
- **Stack (should), K6: ∇T through a sloping front.**
  - **Variable:** temperature with grad T arrows (orange) on each of 12 levels, 1000–300 hPa, over a strong cold front. Isotherms every 2 °C; arrows at grid points.
  - **Why it adds understanding:**
    - The gradient is a per-level horizontal vector.
    - Where the isotherms crowd, the arrows are longest, and that crowded band *moves towards the cold side as we climb*: the frontal surface slopes.
    - This is the 3-D idea that s33_fronts can only state.
  - **Case:** new, chosen by the data agent. It must be outside NW Europe 2023 and France 2026 (for example a well-documented Great Plains or East Asian winter front). New data: ERA5 t on 12 levels, about a 25° × 25° box, one hour (< 2 MB). Key `ERA5-CDS-front-<date>-pl12`.
  - **Camera:** `orbit`, `flyThrough` *along* the front at mid-height, `below` (the ground front lies ahead of the upper one).
  - **Narration (draft, measured in §7):** "A front isn't just a line on the ground map. Let's stack twelve temperature maps above a strong cold front, from the ground to about nine kilometres up. On every layer, the orange arrows are grad capital T, pointing towards warmer air. Where the isotherms crowd, the arrows are longest. That's the front on that layer. Fly along the stack, and the crowded band shifts towards the cold side as we climb. So a front is a sloping surface, and its gradient is measured layer by layer."
  - **Where:** a new s33b after s33_fronts.
  - **Physics:** `fluidpy.geo.sphere.gradient` per level. CHECK rows: the position of the |∇T| maximum by level, which must tilt towards the cold side (the case is rejected if it does not).

### 4.4 #69 reading weather maps (`ch00_reading_weather_maps`, 55:17.5 planned)

- **Must (G1):** s01_hook (flight), s09_utc, s18_bb_south (Himawari globe), s57_orbits, s61_water_vapour, s63_typhoon (zoom), s74_case_stack (globe camera moves). Use GlobeFrame and fades.
- **Must (G4, titles and readouts on images):**
  - s00 and s01: the "T+72 h" clock over the chart goes beside it.
  - s12 isobars: the title goes outside the chart.
  - s58_visible, s68_models and s71d_ai_model: keyword overlays on satellite or model images.
  - s04_degrees and s06_tissot_mercator: degree readouts on the globe.
- **Must (G5):**
  - s13_sea_level (barometer column);
  - s44_upper_air (slab at a fixed height: posts to the top);
  - s47_levels (tall column: edges up to the 250-hPa sheet);
  - s53_thickness (slab between the 1000- and 500-hPa sheets: posts from sheet to sheet).
- **G3:** all 22 scenes with a "source line" use SourceBelow. **Charts must leave room**: chart bottom ≤ 820.
- **Should (Q1):** this movie *teaches* reading labels on maps (station plots, front symbols, isobar labels, H/L). Q1 (b) keeps them on the map with outlines. Q1 (a) would make the movie impossible. 8 scenes: s12, s16, s18, s20, s24, s43, s45, s49.
- **Stack (should), K69: thickness slabs.** s53_thickness is upgraded from one highlighted slab to the whole stack.
  - **Variable:** the 9 slabs between the 10 ERA5 levels (1000–200 hPa). Each slab's thickness is coloured by its layer-mean temperature (hypsometric equation). The 1000–500-hPa slab collapses into the thickness chart.
  - **Data:** `ERA5-ARCO-ciaran2023-10lev`, registered and already used by #69 (s47–s54). No download.
  - **Physics:** `fluidpy.geo.atmos.hypsometric_thickness` and `layer_mean_temperature`. A CHECK row: thickness ↔ mean T, slab by slab.
  - **Camera:** `orbit`, `below` (the cold air is a dip in every slab), `flyThrough` the 1000–500 slab, then `topDown` as the chart.
  - **Narration (draft, measured in §7):** "Let's cut the air over the chart into nine slabs, between ten pressure levels. Each slab's thickness, its top height minus its bottom height, is coloured by how warm the slab is. Warm slabs are thick, and cold slabs are thin. From below, the cold air shows up as a dip in every slab. Stack the slabs from a thousand up to five hundred hectopascals, and we get the thickness chart."
  - **Overlap (Q4):** the same storm as weather basics, a different day (2 Nov 12 UTC), file and variable (heights and thickness, not T/p/q/wind profiles).
    - If WB UF2 stacks the same 10-level file, switch K69 to the movie's "latest chart" case.
    - That case needs new data: `GFS-ANL-20261027T18-pl12`, the GFS 0.25° analysis z and t on 12 levels, 10–80 N, 170 W–10 E (NOMADS/AWS, ≈ 20 MB raw → < 3 MB derived). It extends the registered `GFS-ANL-20261027T18-upper` (4 levels).
- **s47_levels, standard levels: keep it short (5 levels, a recap).** The narration already points to the standard-levels movie #23C. #23C owns the full many-level standard-level stack (§6), so the two movies don't repeat each other.

---

## 5. The named next movies (#7, #8, #28B, #29, #29B): write with §5b from the start

| # | Stack? | Variable · levels · place · time | Data key (new unless said) | Camera | Narration (draft, measured §7) | Where |
|---|---|---|---|---|---|---|
| #7 divergence (~30 min) | **Yes (should)** | Horizontal divergence ∇·u (rose hatched "−" = convergence, teal "+" = divergence), 12 levels 1000–100 hPa; the ITCZ, tropical Pacific/Atlantic; **July mean 1991–2020** | `ERA5-CDS-monthly-pl-july-clim`: u, v, ω, 12 levels, 30 S–30 N, 1°, July 1991–2020 (≈ 10 MB raw → 2 MB) | `orbit`; `flyThrough` up the rain band (hatching fades at mid-levels, the "level of non-divergence"); `topDown` at 200 hPa (outflow); ω arrows threading the middle | "Let's stack the divergence of the wind at twelve heights over the tropical Pacific, in an average July. … What goes in at the bottom rises through the middle and leaves at the top." | after the first real-data divergence scene, before Gauss's theorem (the column's net in = out) |
| #8 curl (~30 min) | **Yes (should)** | Relative vorticity ζ = k · ∇ × u, 12 levels 1000–100 hPa; **a West-Pacific typhoon** (for example Haiyan, 2013-11-07 00 UTC; the data agent confirms) | `ERA5-ARCO-<typhoon>-pl12`: u, v, 12 levels, 15° box round the IBTrACS centre (registered `IBTrACS-v04r01` for the track) | `orbit`; `flyThrough` up the eye; `inside` at the sign change; `topDown` on the anticyclonic outflow | "Here's the curl of the wind, the spin, in twelve layers through a typhoon. … One storm, two signs of curl, at different heights." | after curl is defined on a real map, before Stokes's theorem |
| #28B circular motion | **No** | — | — | — | — | The movie is about one circle, v²/r and the rotating frame. Height structure adds nothing at this point (honest skip). |
| #29 Coriolis (45–60 min) | **Yes (should, strong)** | The ageostrophic wind u − u_g on 12 levels 1000–700 hPa (the lowest ≈ 3 km), hourly through one clear summer night: **the Great Plains low-level jet** (Oklahoma/Kansas); the case is chosen by the data agent from a documented LLJ night | `ERA5-CDS-llj-<date>-pl12`: u, v, z hourly 00–14 UTC, 12 levels, 30–42 N 105–90 W (≈ 5 MB) | `topDown` with a clock: the low-layer arrows' ageostrophic part swings clockwise, about a quarter turn per 5 h; `orbit` to contrast the still upper layers; `below` | "Here's a Coriolis effect we can watch: the wind over Oklahoma on a clear summer night, at ten heights. … That's the Coriolis effect, turning moving air to the right." | after inertial circles, as the real-world proof |
| #29B comparison | **No** | — | — | — | — | Side-by-side apparent-force scenes on one rotating frame; a stack would distract (honest skip). |

Physics honesty for #29:
- At 36° N the inertial period 2π/f = 2π/(2Ω sin φ) is about 20.4 h.
- What turns is the deviation from the geostrophic wind, not the whole wind (the Blackadar mechanism). The narration says "the part of the wind that differs from the geostrophic wind".
- The turning is clockwise **seen from above in the Northern Hemisphere**.
- `fluidpy.geo.atmos.geostrophic_wind_from_height` (exists) gives u_g. `fluidpy.geo.frames.inertial_oscillation` (exists) is the reference curve. Add a CHECK row on the turning rate against f.

---

## 6. The rest of series plan v2: one distinct stack where it earns it

The aim is no monotony: each stack has its own variable, place, date and idea. Decide each at storyboard time. The data is new unless a key is named.

| # | Movie | Stack | Variable · place · time (proposal) |
|---|---|---|---|
| 6A / 6B | contour maps / how they are made | no | single-level maps |
| 9–21 | Laplacian … statistics (maths) | no | (#10 material derivative, #10A/B identities, #11 tensors, #12–#21: one level or abstract) |
| 22 | climate machine | no | top-of-atmosphere budgets |
| 23 | air and seawater | yes | **ocean** density σθ at 15 depths (0–2000 m), North Atlantic, Argo gridded climatology, the "with depth" twin of air |
| 23A | pressure coordinates | yes | isobaric sheets (12) dipping over a cold upper trough, a US winter trough (new case); sheets, not slabs |
| 23B | geopotential | no | one 500-hPa sheet (single surface) |
| 23C | standard levels | **yes, the owner** | 8 standard levels, each with its forecaster field (850 T, 700 RH, 500 Z, 300/250 isotachs), a US winter storm, GFS archive (not Ciarán) |
| 23D | cross-sections / Hovmöller | no | slices, not stacks |
| 24 | thermodynamics | no | (θ by level goes to 24A) |
| 24A | isentropic surfaces | yes | θ sheets 290–330 K rising poleward, NH winter mean, ERA5 monthly |
| 25 | stability | optional | N² in the gaps of a sounding with an inversion (avoid the #4 idea; only if it shows the inversion clearly) |
| 26 | water in the air | yes | specific humidity on 10 levels in an atmospheric river (US West Coast), moisture confined below ≈ 700 hPa |
| 27 | skew-T | no | the diagram is the tool |
| 28 | clouds | optional | ERA5 cloud fraction by level: low, mid and high decks over one cyclone |
| 30 | geostrophic / gradient wind | no | one level |
| 31 | Ekman layers | yes | wind turning with **height** in the lowest 1.5 km (15 levels), a windy winter day over the North Sea, plus the ocean Ekman spiral (in time it is #29's idea; in height it is distinct) |
| 32 | thickness / thermal wind | yes | T and wind on 12 levels across the East-Asian winter jet (the strongest thermal wind on Earth): shear ∝ k × ∇T |
| 33 | barotropic vs baroclinic | yes | two stacks side by side: isobars ∥ isotherms (a blocking high) vs crossing (a growing wave) |
| 34 | vorticity, PV | optional | PV on 8 isentropic levels, a tropopause fold (avoid repeating #8) |
| 35 | divergence and vertical motion | optional | ω on 12 levels over a deepening cyclone (only if distinct from #7) |
| 37 | gravity and mountain waves | yes | θ sheets over the Andes or Rockies showing tilted wave crests (local, not #24A's global sheets) |
| 38 | Rossby waves, blocking | optional | Z anomaly on 10 levels of an equivalent-barotropic block |
| 39 | equatorial waves, MJO | optional | zonal-wind anomaly, low-level westerly vs upper easterly (first baroclinic mode) |
| 41 | baroclinic instability | **yes, strong** | Z anomaly on 10 levels of a growing wave: trough axis **tilting westward with height** |
| 42 / 43 | cyclones / jets | optional | warm conveyor belt (q, ω) / jet core |
| 44 | thunderstorms | yes | radar reflectivity CAPPIs every 1 km through a supercell (NEXRAD/MRMS 3-D, open on AWS) |
| 45 | tropical cyclones | yes | **warm-core** T anomaly on 12 levels (peak near 300–250 hPa), a recent Atlantic hurricane not Ian (wind in #5, vorticity in #8) |
| 46 | monsoons | yes | wind reversal with height over India, July: low-level Somali jet vs the upper tropical easterly jet |
| 47 | boundary layer | optional | θ and q layers growing through a day |
| 48 | general circulation | no | zonal means are sections |
| 49 | stratosphere | yes | the polar vortex on 9 levels 100–1 hPa through the winter 2025–26 warming (registered `NCEP1-hgt-daily` 10 hPa + new levels) |
| 50 | water vapour, tropics | optional | — |
| 51 | upper ocean | yes | Argo temperature at 15 depths: mixed layer and thermocline, one basin |
| 52–55 | gyres, great currents | yes, once | Gulf Stream velocity and temperature at depth layers (GLORYS/ECCO), only in one of #52–#55 |
| 56 | equatorial undercurrent | yes | zonal current layers: westward surface, eastward core at ≈ 100 m |
| 57 / 58 | ACC / AMOC | yes, once | winter deep mixing as density layers in the Labrador Sea (#58) |
| 59–61 | eddies, waves, sea level | no | — |
| 62 | ENSO | yes | subsurface T anomaly at 12 depths along the equatorial Pacific (thermocline tilt), latest event vs 1997 |
| 63 / 64 | IOD / PDO-AMO | no | avoid repeating #62 |
| climate change | — | yes | warming by level: troposphere warms, stratosphere cools (ERA5 trends) |

---

## 7. Draft stack narration, measured (tools/tts.py dry run)

**The run.**
- Input: `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/retrofit_5b/tts/script.md`, the draft sentences of §3–§5 verbatim.
- Output: `…/retrofit_5b/tts/out/`.
- Command: `.venv-tts/Scripts/python.exe tools/tts.py <script> --out <dir>`, voice `af_bella` ×1.0, current `movies/lexicon.yaml`.
- Result: **9 scenes, 51 sentences, 281.70 s of audio** (679 s wall), 64 caption cues, self-check diff −0.0 ms (OK).

| Draft scene | Sentences | Words | Scene s (speech s) | wpm | Note |
|---|---|---|---|---|---|
| K1A #1a wind stack | 6 | 64 | 27.62 (25.07) | 139.0 | **caption warning:** s4 "Now let's look straight down through the stack." 17.2 chars/s > 17. Drop "straight" before the build |
| K1B #1b flux ribbons (optional, recommend skip) | 4 | 59 | 23.00 (21.15) | **153.9 > 150** | shorten one sentence if ever used |
| K4 #4 ∂T/∂z stack | 7 | 95 | 39.62 (36.73) | 143.8 | — |
| K5 #5 Ian stack | 6 | 85 | 35.08 (32.52) | 145.4 | — |
| K6 #6 front stack | 7 | 87 | 36.85 (33.95) | 141.7 | — |
| K69 #69 thickness stack | 5 | 71 | 28.88 (26.68) | 147.5 | — |
| K7 #7 ITCZ divergence | 5 | 70 | 28.53 (26.32) | 147.2 | — |
| K8 #8 typhoon curl | 5 | 65 | 28.47 (26.27) | 137.0 | — |
| K29 #29 low-level jet | 6 | 78 | 33.35 (31.30) | 140.3 | — |

The scene times include the 0.35-s sentence gaps but not the 0.8-s scene gaps. Each stack adds about 25–40 s to its movie.

**Honesty notes the builder must carry into the storyboards:**
- Every number in these sentences ("sixteen kilometres", "nine kilometres", "a quarter turn every five hours") becomes a CHECK row from the data before the final TTS. Change the words if the data disagree.
- Vertical exaggeration of each stack goes in the manifest; it is not badged.
- "Clockwise" always carries "seen from above" and the hemisphere.
- K29 says that the *ageostrophic part* turns.
- K5 and K8 state the sign (inflow −, anticyclonic outflow) with a "−" glyph and hatching, never with hue alone.

---

## 8. Recommendation

1. **Build the shared kit first (K1–K6, §2), together with weather basics UF2**, and promote it to `movies/src/house/kit/`. Add the K6 overlap gate to `tools/movie_qa.py`, so G3/G4 are checked on every frame from now on and no longer by eye.
2. **Re-open these finished movies (must items exist):**
   - **Cross product Part 2: yes.** It has 31 must items in 23 scenes, and the frame the user named as the G1 model (29:30) itself has its source line on the globe.
     - The fixes are layout only: no TTS, no timing change. About 5 h for Part 2 and v5 together.
     - **No stack**: none adds understanding to the cross product.
   - **v5 full: yes, only if v5 will be published** (Q2). Same code, same fixes. Otherwise publish Part 1 + Part 2 and leave v5 as the master.
   - **#1a vectors: yes.** 5 musts (text on images in s05, s12h, s12i; colour bar under the zoom in s24 and inside the map in s31), plus the **K1A wind stack**. The stack is clearly valuable: it makes s12g's "clockwise going up" visible. About 5–6 h.
   - **0.1b dot product: yes, s20c only** (labels on the globe), with the missing Blue Marble credits (s20c, s20d). About 1.5 h. **No stack.**
3. **Do not re-open:**
   - **Part 1**: 0 must, 1 should. Fold it into the v5 render only.
   - **v6**: superseded by 0.1b; it has no globe and no real image.
   - **v4**: retired.
4. **#4 derivatives (in progress):** fold T-M1 (s09 boxed globe flight), T-M2 (s41 graph on the CERES globe) and the **K4 ∂T/∂z stack** into the current fix loop.
5. **Planned movies:** amend the #1b, #5, #6 and #69 storyboards with §5b before any build (§4).
   - Adopt the stacks K5 (Ian), K6 (front) and K69 (thickness).
   - Skip #1b's optional ribbons (overlap with weather basics).
   - Switch #6 s17 away from the #4 Trappes sounding.
   - Write #7, #8 and #29 with their stacks from the start. No stacks for #28B and #29B.

### New data (all small; every fetch goes through `fluidpy.data.fetch()` and the disk guard; G: has 522 GB free, C: 53 GB)

| Key (proposed) | For | Content | Size |
|---|---|---|---|
| `ERA5-CDS-trappes-20260930-pl` (**extend**, not new) | #4 K4 | t, z on 16 levels 1000–100 hPa, 2026-09-30 12 UTC, 45–52 N 3 W–7 E | < 1 MB |
| `ERA5-ARCO-trappes-20231101T00-uv16` (optional) | #1a K1A | u, v on 16 levels, 45–52 N 2 W–8 E, 2023-11-01 00 UTC (otherwise registered `IGRA2` only) | < 1 MB |
| `ERA5-CDS-front-<date>-pl12` | #6 K6 | t on 12 levels 1000–300 hPa round a strong cold front (case outside NW Europe 2023 / France 2026) | < 2 MB |
| `ERA5-CDS-monthly-pl-july-clim` | #7 | u, v, ω on 12 levels, July 1991–2020 mean, 30 S–30 N, 1° | ≈ 10 MB raw → 2 MB |
| `ERA5-ARCO-<typhoon>-pl12` | #8 | u, v on 12 levels, 15° box round an IBTrACS West-Pacific typhoon centre | < 3 MB |
| `ERA5-CDS-llj-<date>-pl12` | #29 | u, v, z hourly 00–14 UTC, 12 levels 1000–700 hPa, 30–42 N 105–90 W, a documented LLJ night | ≈ 5 MB |
| `GFS-ANL-20261027T18-pl12` (fallback only, Q4) | #69 K69 | GFS z, t on 12 levels, 10–80 N 170 W–10 E | ≈ 20 MB raw → < 3 MB |
| ERA5 z 10 levels over the Alps + ETOPO 2022 Alps tile (optional) | #5 s27 | pressure surfaces over terrain | < 5 MB |

The stacks for #5 (`ERA5-ARCO-ian2022-pl`) and #69 (`ERA5-ARCO-ciaran2023-10lev`) need no new data.

### New library functions (fluidpy; each with a docstring, Vallis § + eq, SI units and V-ladder tests; the full fluidpy suite stays green)

| Function | For | Validation |
|---|---|---|
| `fluidpy.geo.sphere.divergence(u, v, lat, lon, a)`: spherical ∇·u with the −v tan φ / a metric term | #7 (and #10, #35) | V1: solid-body rotation → 0; V1: a known potential flow; V7: small-box limit → Cartesian |
| `fluidpy.geo.sphere.vorticity(u, v, lat, lon, a)`: relative vorticity k · ∇ × u on the sphere | #8 (and #34) | V1: solid-body rotation u = ω a cos φ → ζ = 2ω sin φ; V7: Cartesian limit |
| (none new) | #1a, #4, #5, #6, #29, #69 stacks | they use existing functions: `diag.sounding.layer_lapse_rate`, `geo.atmos.lapse_rate_tropopause`, `diag.cyclone.storm_relative_wind`, `geo.sphere.gradient`, `geo.atmos.hypsometric_thickness` / `layer_mean_temperature`, `geo.atmos.geostrophic_wind_from_height`, `geo.frames.inertial_oscillation`, `geo.vectors.components_in_axes` |

Movie-side (not fluidpy):
- K1–K6 (§2);
- `movies/data/_stack.py`, the shared level → Float32 texture, height and colour-range builder, writing the manifest rows.

### Questions for the user

- **Q1. What may sit on a map or image (G3/G4)?**
  - (a) Nothing at all.
  - (b) **Recommended:** no titles, dates, keywords, calculations, readouts, colour bars, insets or source lines on any image or globe. Short outlined feature labels (place names, H/L, tip letters, station plots) may stay where the label *is* the content. #69 needs this.
  - (c) Anything, if outlined.
  - The "should" counts above follow (b).
- **Q2. v5 or the split?** Fix and render both v5 and Part 2, or publish only Part 1 + Part 2? **Recommend:** fix the shared code once, render Part 2 now, and render v5 only if v5 will be published.
- **Q3. Re-open #1a for the wind stack**, or only for its 5 musts? **Recommend:** both in one pass (the stack is ≈ 30 s and reuses data already in the movie).
- **Q4. Same storm, different stack.** Should #69's thickness stack over Ciarán (2 Nov 12 UTC, heights) count as a repeat of weather basics' stacks (Brest, 1 Nov, T/p/q/wind)? **Recommend:** not a repeat, unless WB UF2 stacks the same 10-level file. In that case K69 switches to the 27 Oct 2026 GFS case.

## 9. Decisions (orchestrator, 2026-10-29, under the user's "go with your recommendation")
- Q1: (b). Never put titles, dates, keywords, calculations, readouts, colour bars or source lines on a map or image. Short outlined feature labels (place names, H/L, station plots) may stay.
- Q2: re-render both v5 and Part 2. The user asked for the full v5 as well as the split.
- Q3: yes. #1a gets its 5 musts and the wind stack in one pass.
- Q4: not a repeat, as long as weather basics does not stack the same 10-level Ciarán file. The UF2 planner has been told.
- Order of work:
  1. The shared §5b kit, built with weather basics UF2.
  2. #4: musts now in the current fix loop; its stack in the next loop, once the 16-level data is in.
  3. Cross v5 + Part 2 re-layout.
  4. #1a.
  5. 0.1b s20c.
  6. Amend the storyboards of #1b, #5, #6 and #69 before their builds.
  7. #6 moves to the Singapore sounding.
