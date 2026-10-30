# aofd movie house style (v1, 2026-10-25): binding for every movie

**The reference movie is `ch00_dot_product_why` v6 fix 1 (commit b8c6859, 17:40.6).**
- Storyboard and script: `movies/ch00/ch00_dot_product_why/{storyboard.yaml, script.md}`.
- Composition: `movies/src/ch00/DotProductWhy.tsx`.
- Data: `movies/data/build_ch00_dot_product_why.py`.

The user approved it on 2026-10-25 with "I love it", after six rounds of feedback. Those rounds are in
`reports/ch00_poc_user_feedback.md` (U-M.\*, U-M2–U-M6) and the reviews are in `reports/ch00_movies.md`.

Every later movie must look, sound, open, explain and end the same way, as if one creator made the whole series.
- This file **wins over** older rules in the `motion-graphics` skill, R1, PLANNING §8.4 and `knowledge/movie_patterns.md`.
- When something is not covered here, do what the reference movie does: open its storyboard and TSX and copy the pattern.
- Change this file only when the user changes a rule. Log the change in §12.

---

## 1. What a movie is
- **One concept or one tight group of concepts per movie, taught from zero.**
  - The viewer has first-year calculus and no climate background.
  - Never assume, and never skip a step. "Most viewers have no background" (U-M3.G3).
- **Length follows the teaching, not a cap.** Usual range is 8–18 min; the reference movie is 17:40. One movie, not split.
  - Do not cut something that is taught just to make it shorter.
  - Add scenes whenever a step is not crystal clear. The user explicitly prefers more scenes to confusion (U-M6.13).
- **The order is fixed: the idea first, then intuition and examples, then the application.**
  - Do not open with the puzzle (U-M.1).
  - The application is meteorology, oceanography or climate: it shows *why the maths matters*.

## 2. The arc (scene skeleton every movie follows)
| # | Beat | Reference scene | What it does |
|---|---|---|---|
| 0 | **Opening title** (the only heading in the movie) | s00 | Big colourful title plus a catchy animation driven by the movie's own data, plus **one** narrated sentence. See §3 |
| 1 | **Hook question** | s01 | "What is the dot product? Let's see what it is, why it's built this way, and what it tells us about the wind." The core picture appears on the first frame |
| 2 | **Building blocks** | s02–s03 | Define each ingredient in plain words (vector, components, length), then the definition, then a worked example with easy numbers and its result named ("a scalar") |
| 3 | **Second view or intuition** | s04–s07 | The other form (cos θ), the cases (same way / right angle / opposite), the picture (shadow), the unit-vector version |
| 4 | **Why it is built this way** | s08–s11 | "There are three good reasons." Each reason is its own scene with a concrete physical example (wind components, work on a sled) |
| 5 | **The application, slowly** | s12–s20 | Introduce the observers and the terms in words first, then the equation, then a concrete map with numbers. Answer *what the number means, for whom, and why that sign* (§6). Then a variation (twice as steep) |
| 6 | **Recap** | s21 | "To sum up, …": one idea per sentence, one screen beat per sentence, with mini pictures |
| 7 | **End card** | s22 | The series ending, word for word as in §3 |

Transitions are spoken bridges, never cards:
- "Now let's look at how the angle between the two arrows plays a role."
- "Now let's look at how the dot product is used in weather."
- "The first is…", "The second reason is practical…", "The third reason is…"
- "To see it at work, picture a map…"
- "So why does the balloon stay at thirteen?"

## 3. Opening and ending, exactly

### The opening title (s00, about 10 s; `movies/src/house/kit/title.tsx`)
**Left column, x 100–1075:**
- **Title:** `RiseText` at **150 px, weight 800**, filled with `TitleGradient` (teal `C.first` to gold `C.gold`). Letters rise 24 px and fade in over 8 frames with a 2-frame stagger; two lines ("The dot" / "product").
- **Promise:** "made easy" at **96 px**, warm white `C.key`. It pulses (×1.06) when the voice says "the easy way".
- **Subtitle:** "and how meteorology uses it" at **68 px**, warm white, with the application word in teal.
  - Change the application word per movie: meteorology, oceanography, the climate…

**Right column, x 1080–1840, y 180–636:** a catchy animation in two parts, both from the movie's data.
- **Part A:** the concept in motion. In the reference, q sweeps round p, the live signed value is shown (teal +, slate 0, rose −) and so is the signed shadow.
- **Part B:** cross-fade to the application, on the word for the application. In the reference, a mini temperature map with the isotherms sliding under a wind arrow and the fixed thermometer's reading ticking down.
- Keep the subtitle at least 50 px clear of the animation.

**One spoken sentence** in this pattern:
> "In this video, we'll learn the <concept> the easy way, and see how <field> uses it to <the application in plain words>."

Then the hook scene follows with a 10-frame cross-fade. The poster is the title frame (frame ≈ 200).

### The ending (s22): three sentences, keep the wording
> "This video is one of a series of related maths tutorials, so watch out for the others. They're made for students of atmospheric science, meteorology and fluid dynamics, and anyone else who needs these ideas. The notebook for this <concept>, and the notebooks for the other maths concepts, are on the website that goes with this video."

The words change only for the topic: "maths tutorials" may become "tutorials" for a physics movie, and the concept name changes.
- **Never** say "thanks for watching".
- **Never** name the book, an author or the explainer lab.
- **Never** show a URL, a path or a link.

**The screen:**
- four faint topic thumbnails along the top;
- the keyword lines "a series of maths tutorials" (68 px) and "atmospheric science · meteorology · fluid dynamics" (54 px);
- a notebook icon with "<concept> notebook";
- stacked notebook icons with "notebooks for the other maths concepts".

Then a **2.5-s silent hold** while the music fades.

### The ending for weather, climate and ocean movies (user, 2026-10-27)
Every movie whose topic is weather, climate, the atmosphere or the ocean (Chapter 0 from `ch00_weather_basics` on, and
all chapter movies of that kind) says, and writes on the end card, who the series is for and that it shows the maths:
> "This video is one of a series of related tutorials, so watch out for the others. They're made to help students of
> meteorology, atmospheric science and climate science, and anyone else who wants to learn not just these ideas, but
> the maths behind them too. The notebook for <these weather basics>, and the notebooks for the other concepts, are on
> the website that goes with this video."

- Ocean topics add oceanography to the list: "students of meteorology, oceanography, atmospheric and climate science".
- **The screen** is the same as above, but with three keyword lines:
  - "a series of tutorials" (68 px);
  - "meteorology · atmospheric science · climate" (54 px; ocean movies use "· oceanography");
  - "the ideas, and the maths behind them" (54 px, gold).
- The pure maths movies (dot product, grad/div/curl…) keep the maths-tutorial ending above. **Exception:** the
  cross-product movie uses the weather/climate ending (user, 2026-10-27: "use the new ending for the cross-product movie too"),
  because its second half is Coriolis and real weather.

## 4. Voice and narration
- **Voice:** Kokoro `af_bella`, speed **1.0**. Every movie sounds the same.
  - The narration is the measured audio (`tools/tts.py`); timing is never estimated.
  - Gaps: 0.35 s between sentences, 0.8 s between scenes, 0.3 s lead-in and tail.
- **Tone:** warm, informal, blog-like ("Let's…", "Now let's…", "Imagine…", "Suppose…"). Never "clearly" or "obviously", never telegraphic.
  - Full, easy, natural sentences (U-M3.G3).
  - No fragment chains such as "two arrows in, one number out" or "reason one: order".
- **Pace:** ≤ 150 words per minute overall (the reference: 149). One idea per sentence; dense ideas get more sentences, not denser ones (U-M2.G5).
  **Beats** (user decision 2026-10-28): end a sentence with `[beat]` to hold 1.5 s after a worked calculation (`tools/tts.py`; not spoken, not captioned). Use beats to give the viewer a moment with the numbers, which also keeps the overall pace ≤ 150; never as filler.
- **Goal first.** Each scene says what we want to find **before** computing it, and names the answer only **after** the calculation (U-M4.1):
  - "How much of this wind blows towards the east? To find out, we take the dot product… which is six. So six metres per second is the eastward part."
  - Never give the answer away inside the question (U-M4.1a).
- **Every new term or symbol is explained in plain words at first use** (U-M2.G4, U-M3.G5), then used consistently. For example:
  - "Advection means being carried along by the flow."
  - "An air parcel: a small volume of air that moves with the flow."
  - "These are called isotherms." The places are described first, then the name is given.
  - "Partial means only time changes; the place stays fixed."
  - "A kelvin step is the same size as a degree Celsius step."
- **Spoken maths is unambiguous:**
  - "partial capital T by partial small t", followed by "Here capital T stands for temperature, and small t for time" (U-M5.1);
  - "capital D T by D t";
  - "v dot grad T";
  - "x hat", "b hat";
  - "ten to the minus five kelvin per metre".
  - The vector a is said only as "vector a" + a word, or inside "a dot b" (Kokoro reads a lone "a" as the article).
- **Standard scientific words, defined once:** "air parcel" (never "bit of air"); "pointing in opposite directions" at 180°; "the way the temperature increases fastest" (never "uphill").
- **Observers are named concretely and never ambiguously** (U-M6.14):
  - "the fixed thermometer": a thermometer fixed at one place that never moves;
  - "the balloon" / "the balloon's air parcel": moves with the wind.
  - Never "the pole".
- **General rules are stated after each case,** right after the case's result. For example: "When two vectors point in opposite directions, their dot product is negative." (U-M5.2)
- **Every number on screen is spoken in words at the moment it appears,** and every spoken number is on screen.

## 5. Screen
- **No headings, kickers, part cards or scene counters** anywhere except the s00 title. "It looks like a PowerPoint presentation; this is a video." (U-M3.G1)
- **The screen carries keywords, symbols and numbers; the voice carries the explanation** (U-M3.G2). Never write a narrated sentence on screen.
- **No boxes, cards, chips or panels.** Emphasise by colour, size, a gold pointer (`Keyword`), an underbrace (`BraceNote`), a pulse or a highlight band. The reference's only exception was the s03 component tags.
- **No references:**
  - no equation numbers or labels;
  - no book or author names;
  - no footnotes, **except the data-source line below**;
  - no "not to scale" badges;
  - no "1 grid square = 1 unit";
  - no URLs (U-M2.G1, U-M2.G2, U-M3.G4, U-M3.G6).

  When a step refers back to an equation, label it a plain "(1)" inside that scene only.
- **Data-source line (user, 2026-10-28, U-WB-R1 — supersedes the old "no source strip" for data credits).** Every frame
  that plots real data (map, globe, station graph, sounding, satellite image, a specific event) carries one small source
  line at the bottom of the picture, e.g. "Data: ERA5 (Copernicus C3S) · 1 Nov 2023, 18 UTC · Brest". Name, time and
  place for specific events. Muted colour, ≥ 28 px, inside the safe area, never over the caption band; not spoken.
- **Colour bar on every coloured data field** (globe or map), with units (U-WB-R2). Hide it only during a zoom.
- **3-D for space (U-WB-R3):** areas and volumes in the narration (1 m², 1 m³, a column from the ground to the top of the
  atmosphere, slabs, air parcels) are drawn as 3-D objects with visible x, y, z (three.js), and the camera may move around them.
- **Globe camera (U-WB-R4):** globes rotate, zoom and fly to the place being discussed; give the globe the space; keep
  camera continuity between consecutive globe scenes.
- **Explain every number (U-WB-R5):** no calculation without saying what each factor is and why it is computed;
  derivations show every step (including the integration); each new quantity gets a "why we care" sentence.
- **Layout** (`movies/src/house/kit/type.ts`):
  - Content area y 40–860. The **caption band y 880–1040 stays empty**.
  - Picture zone x 80–1000, maths zone x 1060–1840; full-width scenes use x 80–1840.
  - No half of the screen may be empty for more than about 3 s (U-M4.2): the picture is there from a scene's first frame.
- **Type scale:** hero 128 · equation 84 (main equation 96) · calculation 68 · keyword 54 · **floor 44 px**. Nothing below 44, including graph ticks and colour-bar text (52 px). The kit throws on anything smaller.
- **Colours** (house-dark-v1, colour-blind safe; never hue alone for a sign):

  | Role | Colour | Hex |
  |---|---|---|
  | Background | | `#171f33` |
  | Ink | | `#e8ecf4` |
  | First vector and advection (a, p, v, F, +) | teal | `#2aa198` |
  | Second vector (b, q, d, ∇T, x̂, b̂) | orange | `#e8833a` |
  | Negative (with a hatch or dash and a "−" glyph) | rose | `#d9667f` |
  | Keywords | warm white | `#f4ecd2` |
  | Pointers, links, underlines | gold | `#d8b23a` |
  | ∂/∂t and the fixed thermometer | slate | `#aab4c8` |
  | Ticks and units only | muted | `#9aa6bd` |

  - Temperature maps use a perceptual colour map, never jet or rainbow.
  - A quantity keeps its colour through the whole movie; the material derivative row is warm white, not teal.
- **Labels sit at arrow tips** (`TipLabel` + `placeLabels`). The vector's components sit under the picture, e.g. "a = (5, 1)".
- **Strokes:**
  - vector arrows 10 px with 40-px heads; secondary lines 6 px;
  - pointers and links 5 px gold with open chevrons;
  - a shadow is a 20-px band in the caster's colour.

### 5b. Globes, images and layer stacks (user, 2026-10-29; binding for every movie)
- **Globe frame.** A 3-D globe gets a large frame, most of the screen's height and width; the model is the cross-product
  video at 29:30. When it zooms, rotates or flies to a place, its top, bottom, left and right edges **fade out softly**,
  so the box of the 3-D area is never visible. An unzoomed whole globe needs no fade. While zoomed, text may fade or sit
  behind, and the globe takes the main space.
- **Zoom-reveal (user, 2026-10-29; every movie, past and future):** whenever zooming into a place on a globe shows more data or helps understanding, use the two states of cross-product v5 56:57 → 57:02 (frames `outputs/viewing_2026-10-29/weather_basics/3.png` → `4.png`).
  1. **Not zoomed:** the whole globe sits on the left, clearly separate from the text column on the right.
  2. **Zoomed** (measured from the v5 code, `GlobeView` + `Vignette` in s33 of `movies/src/ch00/CrossProductWhy.tsx`):
     - **Size:** the globe renders full-bleed on the whole 1920 × 1080 canvas. The camera moves in from dist 4.3 to dist 2.4 over about 1.5 s, centred near x 600, y 470. It hops between places with a `globePath` keyed per sentence.
     - **Right side, behind the text:** a gradient from x 980 to x 1160 darkens the globe from 0 to 82 % background. From x 1160 to the right edge a flat 82 % background overlay lets the globe show dimly (about 18 %) behind the keyword column. It is darkened, not blurred, and it fades in over 1 s as the zoom starts.
     - **Top and left:** narrow 60-px fades at the frame edge. The globe reaches the background colour about 33 px from the edge.
     - **Right frame edge:** a 60-px fade (x 1860–1920).
     - **Bottom:** the globe fades to the background between y 800 and y 870. From y 870 down, the caption band is solid background.
     - **Source line:** v5 drew it at y 852, inside the bottom fade, so it partly lay on the faded globe. **New rule:** move the bottom fade up to y 760–830, so the source line at y 852 sits on solid background, below the globe.
  Keep the text on the faded part only. The source line stays below the globe in both states.
- **Zoom tours (user, 2026-10-29):** zoom, hover and move between places only when it adds new insight or information; never as decoration.
  - When the camera zooms into a place, the narration says what that place is and what is round it (the sea, the coast, the mountains, the nearby countries), and what the data show there.
  - Every zoom ends with a zoom out: the globe returns to the size and view it started from before the scene moves on.
  - This holds for weather maps too, when a scene tours several places or variables.
  - A named place is centred and labelled on the globe within about 1 s of being spoken (user, 2026-10-30).
- **Layer stacks: strictly no fly-throughs** (user, 2026-10-30, confirmed): the camera never passes through the layers. A short close look is allowed: zoom in close enough that the ground and the stacked levels can both be seen, and look from bottom to top (as at UF2 41:18). Do not go deep inside, and come back out after about 5–6 s. All camera moves between views happen from outside. Otherwise hover or orbit from outside, from the side at an angle, moving from bottom to top. Keep the colour bar visible. Use few, clearly separated layers (about 5) unless more add real insight. A quantity tied to places (e.g. tropopause height) reads better as a surface or marks over a flat map in a stack than as circles on a globe.
- **The house globe** (user, 2026-10-29): the reference for every 3-D globe, and above all one that zooms and moves from place to place, is the cross-product v5 sequence at 56:35–57:54 (s33_trades, then the westerlies; `movies/src/ch00/CrossProductWhy.tsx`; frame `outputs/viewing_2026-10-29/weather_basics/2.png`). Copy its look: a large globe, animated wind streaks, camera moves and hovers, soft fades on the edges. **Text may sit on the faded part of the globe**, as in that frame (keyword and numbers on the right), but never on the sharp, unfaded part. A coloured globe always has its colour bar with its label. Do not add extra titles to globes or maps (they take space); existing titles stay as they are. The source line always sits **below** the globe; that v5 sequence gets this fixed too.
- **Source lines sit fully below an image, globe, map or figure, or beside it where that fits better.** The one hard rule: a source line never lies on top of any part of the 3-D globe, map or image. Nothing is dropped: titles,
  dates, keywords, calculations, readouts and colour bars stay in the movie, placed beside or below the picture. Only
  short labels that point at a spot on the map (place names, H/L, fronts, station plots) may sit on it.
- **No text over images or over other text**, on any frame.
- **Colour bars never sit on a globe or map.** They go beside it, in the text column, as in the weather frames 5.png and 6.png. This holds in every scene and every zoom state.
- **Slabs and columns:** every vertical edge runs all the way to the top.
- **Wind arrows on a map or globe are always animated**, so the viewer sees the air moving. Use moving dashes or
  pulses along each arrow, or particles drifting along the flow at a speed scaled to the wind (scale stated). Arrows
  keep their direction and length from the data. The motion is not a time change in the wind unless the data are a
  time series.
- **Layer stacks** (`captests/X3_stacked_levels/threejs_layer_stack/X3Stack.mp4`, with many more than 3 layers): use them
  wherever a variable changes with height and the stack adds understanding. The camera flies round, through, inside and
  below the stack. Never reuse the same stack, data and place across movies; skip a stack where it adds nothing.
- Details and the weather items: `reports/ch00_weather_basics_user_feedback_round2.md`.

## 6. How things are explained and animated (the teaching moves the user liked)
- **Picture, then symbols, then numbers.** Build the situation in words and pictures first and name it after.
  - Rule east, rule north, "join the places with the same temperature right now", and only then "isotherms".
  - Describe the two observers, then the equation.
- **Equations are built, never read aloud as a string of symbols.**
  - First say what the equation *is for* ("Here is the equation the balloon's thermometer obeys. It tells us how anything the air carries… changes as we follow an air parcel.").
  - Then give each side its meaning with gold **underbraces** ("following the parcel", "one fixed place", "advection").
  - Then specialise it (φ → T), and point at the operator that is today's concept ("its dot is our dot product").
- **Every calculation is shown in full on screen,** aligned at "=" (`CalcStack`: ≤ 3 lines, older lines dim to 60 %).
  - Include the steps a novice would not do in their head: √ by Pythagoras for every length, unit cancellation (the "m" struck), and conversion (× 3600 s → per hour).
  - Rounded results are written "≈ 8", never "= 8.000".
- **Link the picture to the number** (U-M6.7, U-M6.9). When a number comes from a piece of the picture:
  - highlight that piece (a band, a shaded strip, a bracket);
  - label it on the picture ("shadow", "18 km across");
  - draw a short **gold link arrow** from the piece to the number (`CurvedLink` with a straight or gently bent path).

  Links must not cross each other, text, ticks or the colour bar.
- **Cases side by side with one thing changing.** "Let's keep one arrow fixed… and change only the other one." Each case is shown with its own calculation, then the rule is stated.
- **For each important number, answer: what it means, for whom, why that sign.**
  - Say the meaning in a sentence that a non-scientist could repeat: "how fast the wind carries the parcel into warmer places".
  - Give the units story: a rate in space × a speed = a rate in time.
  - Say which object it belongs to: "the balloon's air parcel, which is at the fixed thermometer right now".
  - Explain the sign with directions: ahead (downwind) is warmer, behind (upwind) is colder.
- **Contrast cases make a term visible.** In the reference:
  - Case 1, a frozen map: the parcel warms by the advection term, +0.18 K/h.
  - Case 2, the parcel keeps its temperature: the fixed thermometer cools by the same amount.

  Finish with a **three-row summary grid**: each term, what it means, who sees it, in each case (s19d).
- **Show change over time on a clock and a graph.**
  - A clock glyph "t = 1.2 h" runs at one constant rate per scene, with whole hours landing on the spoken numbers.
  - A `TimeGraph` shows the series: fixed thermometer a solid rose line with hour dots, balloon a teal line, frozen-map line in slate.
  - Moving items arrive one by one, each labelled by arrival ("in 1 h", "in 2 h"). When an item arrives, its number flies into the readout and onto the graph.
- **Zoom when a detail is small** (`MapCamera`). The km ticks re-label, so distances stay true. Hide the colour bar while zoomed.
- **Persistent objects stay put across cuts** (the vectors, the map, the icons). Scenes cross-fade over 10 frames.
- **Every reveal is tied to the words that say it.**
  - "S<k>" in the storyboard means sentence k.
  - A reveal inside a sentence is placed on the quoted words using the clip's character time (`AT(k, j, "words")` in the TSX).
  - Nothing appears before it is spoken (the reviewers check ±0.5 s).
- **Sliding or evolving fields move only while the voice describes them.**
- **Icons are simple and code-drawn** (`movies/src/house`): `PoleThermometer`, used for "the fixed thermometer"; `BalloonThermometer`; sled; sun; notebook; clock; camera with snapshot corners for "a snapshot of the map".

## 7. Physics honesty (unchanged rules, still binding)
- Every number and every moving thing comes from **tested `fluidpy` functions** via `movies/data/build_chNN_<slug>.py`, which also writes `data/*.json` and `manifest.json` with hashes.
  - CHECK rows assert every displayed number. The reference has 121 rows and 54 recorded calls.
  - The TSX only indexes and interpolates.
- KaTeX strings are `String.raw` constants, copied verbatim from the storyboard so the equations QA gate can find them.
- Equations are transcribed from the rendered page images (provenance `vallis_eq` / `page_png` lives in the storyboard for QA only, **never on screen**).
- **Storm trackers:** never label "the low" with the minimum of a search box (it can pick a different low). Seed on the
  storm and track it by continuity from the previous hour, with a CHECK row on the step length; front lines shown on a
  storm map are only the ones attached to the tracked low (weather basics review 1, 2026-10-28).
- Time compression is recorded in the manifest and is not badged on screen. Thought experiments are said as such ("imagine the map stays frozen").

## 8. Sound and captions
- **Music:** `tools/music.py score` (procedural, our own, CC0), seed 7.
  - The bed sits at −28 LUFS on its own, ducked 5 dB under speech.
  - A 2.5-s tail with the music fading.
  - The mix is normalised to −16 LUFS, true peak ≤ −1.5 dBTP (the reference: −16.0 / −3.6).
- **A different score for each movie** (user, 2026-10-27): no two movies share the same music. Each movie gets its
  own style matched to its content (e.g. calm ambient for the maths, airy/flowing for weather, deep and slow for the
  ocean, tense for storms, warm for the tropics), its own key, tempo and instrument palette. Same mixing rules as
  above (bed −28 LUFS, ducked under speech, −16 LUFS mix). The style, key and seed are recorded in the storyboard.
- **Sound effects where they fit** (user, 2026-10-27): water, a splash, waves breaking, rain, wind, a storm, thunder
  and the like, timed to the picture (a wave breaks on the frame it breaks; wind rises as the isobars tighten).
  - Only where the picture shows that thing, short and quiet: under the voice (about −30 to −24 LUFS short-term,
    ducked like the music), never covering a word, never more than one at a time.
  - Sources: our own synthesis (CC0) or CC0 / licence-checked libraries; every sound and its licence is listed in the
    manifest credits; no sound that needs on-screen attribution.
  - Captions name meaningful sounds for deaf viewers ("[waves breaking]") only where the sound carries meaning.
- **Captions:** `en.vtt` / `en.srt` written from the script, never transcribed.
  - ≤ 2 lines × 42 characters, ≤ 17 characters per second, cues 1–7 s.
  - No `line:` positioning; they sit in the empty caption band.
  - Break lines at natural phrases ("written partial capital T / by partial small t.").

## 9. Code to reuse (`movies/src/house/`)
- **`house/kit/type.ts`:** `T` (type scale), `SAFE` / `ZONE` (layout), `C` (colour roles), `floor()` (the 44-px guard).
- **`house/kit/draw.tsx`:** `Svg`, `Arrow`, `Lbl`, `Grid`, `Band` (shadow), `Dash`, `RightTick`, `Bracket`, `Arc`, `Strike`, `ProdRect`, `mkP`, `pulse`, `textW`.
- **`house/kit/tex.tsx`:** `TeX`, `Layered` (parts with per-part colour, underbraces and strikes), `CalcStack`, `splitEq`, `eqPieces`.
- **`house/kit/notes.tsx`:** `Keyword` (a warm-white word with gold pointers), `TipLabel`, `placeLabels`, `Balance` (+/− bars on a zero line).
- **`house/kit/extras.tsx`:** `CurvedLink`, `TimeGraph` (+ `tgXY`), `SunGlyph`.
- **`house/kit/title.tsx`:** `RiseText`, `TitleGradient` (the s00 title).
- **`house/kit/icons.tsx`:** clock, camera, snapshot corners, check, sled, droplet, notebook.
- **`house/index.tsx`:** `ramp`, `tex`, `HOUSE`, `TERM`, `PoleThermometer`, `BalloonThermometer`, `GhostArrow`, …
- **Scene scaffolding to copy from `DotProductWhy.tsx`:**
  - `Scene` (10-frame fade-in);
  - `SS` / `SE` / `AT` (sentence and phrase frames from timing.json);
  - `fin` / `fout`;
  - the one-constant-rate clock (`FPH`);
  - `InlineTeX`;
  - the camera helpers (`camAt`, `CamTMap`, `CamIsos`, `CamFrame`);
  - the `SCENES` list in a `Sequence` per scene with an `XF` overlap, plus one `<Audio>` of `narration_music.wav`.

  Promote a pattern into `house/` the second time a movie needs it.
- **The old house components (`TitleCard`, `LowerThird`, `Footnote`, `ScaleBadge`, `EqLine` labels) belong to the retired style.** Do not use them.

## 10. Production and QA (lessons that cost hours)
1. **Measure, never estimate.**
   - The movie-director runs a `tools/tts.py` dry run and reports real numbers: duration, words, sentences, cues, words per minute.
   - The builder runs the final TTS, then music, then render.
2. **Render:** bundle once and copy `narration_music.wav` and `music.json` into `<bundle>/public` (a prebuilt bundle ignores `--public-dir`).
   - Render 4000-frame chunks at **concurrency 3** with a 150-s stall watchdog that kills the process tree and retries up to 3 times. Use a fresh port per chunk, ≥ 3181.
   - Kill orphan `remotion render` node, chrome-headless-shell and ffmpeg processes first.
   - Join with the ffmpeg **concat filter** (one re-encode, crf 20, bt709, yuv420p, AAC 320k, faststart). `-c copy` concat drops frames.
   - The tool is `tools/render_chunks.py --scratch <G: folder> --comp <Id> --frames <total>`.
3. **`tools/movie_qa.py` with `--storyboard`:** 13 gates (since 2026-10-28 incl. `subtitles`: SRT twin = VTT and the copies beside the movie = source; `content`: no empty content area
   > 1.5 s on the navy background, which the black gate cannot see; and `halves`: picture or maths zone empty, WARN > 3 s,
   FAIL > 10 s).
   - The duration gate checks against timing.json's narration end (+0…5 s hold).
   - Size budget 60 MB (hard 80) for long movies.
4. **The builder looks at its own frames for every changed scene before the full render,** checking for:
   - collisions;
   - empty halves;
   - numbers off their words;
   - black KaTeX;
   - text under 44 px.
5. **A fresh movie-reviewer** reads the frames as a first-time learner, then there is a fix loop, then a re-review. Only then does the user watch.
6. Render scratch lives on G:. Report C: and G: free space before and after.

## 11. What the user still decides per movie
- The topic and the application.
- Feedback rounds: log them in `reports/chNN_poc_user_feedback.md`-style files with U-ids, and map each one to a scene and a fix.
- Publishing: only after `/approve-movie N slug`.

## 12. Change log
- 2026-10-25: created from the approved reference movie ch00_dot_product_why v6 fix 1 (user: "I love it… make sure next time … these design choices … are automatically passed to all the next videos").
- 2026-10-27: §3 adds the ending for weather, climate and ocean movies (user: say and write that the videos are made for students of meteorology, atmospheric science and climate, and anyone who wants to see the maths behind the ideas).
- 2026-10-27: §8 a different score per movie, matched to its content; sound effects (water, waves, rain, wind, storm…) where the picture shows them (user).
- 2026-10-27: §3 the cross-product movie takes the weather/climate ending (user).
- 2026-10-28: §10 QA has 12 gates (content, halves); §7 storm-tracker rule; §4 `[beat]` pauses (user).
- 2026-10-28: the split cross-product movies: Part 1 (definition, no weather) uses the maths ending; Part 2 and the full v5 use the weather ending (orchestrator, following the user's split request).
- 2026-10-28: §5 data-source line on every real-data frame, colour bars, 3-D for space, globe camera, explain every number (user feedback on weather basics, reports/ch00_weather_basics_user_feedback.md).
- 2026-10-29: §5b globe frame + edge fades when zoomed, source lines below images, no text over text, slab edges to the top, many-layer stacks where they add value (user, reports/ch00_weather_basics_user_feedback_round2.md).
- 2026-10-29: §5b wind arrows on maps and globes are always animated (user).
- 2026-10-29: §5b the house globe = cross-product v5 56:35–57:54; text allowed on the faded rim only; source below the globe (user).
- 2026-10-29: §5b zoom-reveal: an unzoomed globe stays separate from the text; a zoomed globe grows and its faded right part runs behind the text (user; frames 3.png → 4.png).
- 2026-10-29: §5b zoom tours: only where they add insight; narrate the place and its surroundings; always zoom back out to the start (user).
- 2026-10-30: §5b stacks never flown inside (hover outside, side angle, bottom to top; about 5 layers); places centred within 1 s of being spoken (user, round 3).
- 2026-10-30: §5b stacks — a short close look (≤ 5–6 s, ground and levels visible, not deep) is allowed; every move happens from outside (user).
