# Chapter 0 movies — plan

## Series order (PLANNING §15.11, user decision 2026-10-25; replaces the M0-1…M0-6 list and the batch order of Q12)
Every movie follows `movies/HOUSE_STYLE.md` (binding; reference `ch00_dot_product_why` v6). Length follows the
teaching (per-movie override of `book.yaml → project.movie_seconds`; QA window = measured narration end + hold ± 3 %).

| # | Movie | Slug | Status |
|---|---|---|---|
| 1 | The dot product | `ch00_dot_product_why` | ✅ approved v6 ("I love it") |
| 2 | The cross product | `ch00_cross_product_why` | **v1 storyboard + script (this update)**; brief `reports/ch00_cross_product_brief.md` (U-CP.1–6) |
| 3 | grad / div / curl + Gauss and Stokes | — | next |
| 4 | The climate machine | — | before ch. 1 |
| 5 | Air and seawater basics | — | before ch. 1 |
| 6 | A spinning planet (the Coriolis video: the rotating-frame derivation) | — | before ch. 2 |
| 7 | Reading weather maps (isobars, highs and lows, Buys-Ballot, geostrophic in full) | — | before ch. 2 |
| 8 | Coordinates on a sphere | — | before ch. 2 |
| 9 | Stability and buoyancy | — | before ch. 2 |
| 10 | Taylor series, linearisation and scaling | — | before ch. 2 |
| later | waves maths (before ch. 6), water in the air (before ch. 18), reading climate figures (before ch. 14) | — | just in time |

## Movie 2 — `ch00_cross_product_why` (v1, 2026-10-25)

| Slug | Title | Concepts | Length | Status |
|---|---|---|---|---|
| `ch00_cross_product_why` | The cross product: an arrow at right angles, and why the wind turns | C0A-PoC2 (cross product; remap when the Chapter-0 curation exists), with first looks at f = 2Ω sin φ, −f k × u and the geostrophic wind (taught in full in movies 6 and 7) | **2006.15 s = 33:26.2** measured (`tools/tts.py` dry run v4: 49 scenes, 419 sentences, 4870 words, 2003.65 s narration + 2.5-s hold, 145.7 words per minute overall, 494 cues) | storyboard + script written; needs the data-scout products P1–P5, the implementer functions I1–I3 (or their fallbacks), the builder script and the new kit components |

**What it does.** 49 scenes in the house arc. Opening title (s00) and hook (s01); the link to the dot product (s02:
a = (5, 1), b = (1, 3), a·b = 8, the shadow, v·∇T on the isotherm map) and why a number is not enough (s03 the door,
s04 left vs right); building blocks (s05 the third axis, s06 the component recipe said without spoken subscripts,
s07 (0, 0, 14)); intuition (s08 |a||b| sin θ ≈ 14, s09 the dropped line of the last video becomes the height and the
parallelogram's area is 14, s10 perpendicular checked with dot products); the right-hand rule in seven scenes (s11
curl grip with a 360° orbit, s12 flat grip, s13 bottle cap and screw, s14 the cycle x̂ × ŷ = ẑ …, s15 the reverses
and b × a, s16 all six directions on a flat screen with ⊙/⊗, s17 the same a × b from the top, below and the side);
the cases (s18) and the dot-vs-cross grid (s19); why (s20–s22: torque on a spanner, 15 and 7.5 N·m, the door again);
the application slowly: the turning tool k × (s23), Coriolis basics (s24–s31: Ω, Ω × r = 465 m/s, the effect in words,
−2Ω × u, f from the shadow of Ω on k, −f k × u right/left, 1 mm/s per second and the 17-hour circle, the globe tracks),
real winds on a real globe (s32–s34: reanalysis, subtropical highs, trades, westerlies), real storms (s35–s38: GOES-16 and VIIRS
images draped on the globe, HRRR/ERA5 winds spiralling in, Ian anticlockwise, Idai clockwise, observed strengths from IBTrACS only, the spin measured with r × u), the geostrophic wind (s39–s46: isobars, the pressure
push, the adjustment loops, u = (1/(fρ)) k × ∇p derived and read, 4 hPa over 400 km ≈ 8.1 m/s, the real storm map
with real 10 m winds); recap (s47) and the series end card (s48).

**Why motion beats the explainer here.** `viz/ch00/vector_products_lab.html` shows one state at a time from a fixed
set of views. The cross product's difficulty is *direction in three dimensions*, which a still picture hides: the movie
orbits the camera round the hand and the arrows, turns the hand to every orientation and flips it when the order is
swapped, shows the same turn reading anticlockwise from above and clockwise from below, spins a bottle cap and a
screw, and then carries the same rule onto a turning globe where air parcels curve right and left, reanalysis winds
stream round the subtropical highs, and two real storms spin in opposite senses. The geostrophic part needs a sequence
(a parcel released at rest, turned, looping, averaging along the isobars) that only motion shows.

**Reused modules.** House kit (`movies/src/house/kit/`: type scale, colours, CalcStack, Keyword, TipLabel, placeLabels,
CurvedLink, title, icons); `DotProductWhy.tsx` scaffolding (Scene, SS/SE/AT, XF, InlineTeX, the clock), its PairBase
(s02, s09 handovers), GM map code (s02 mini map, s39–s44 strip map), MapCamera, three-panel layout (s18) and end card;
`house/Globe.tsx` as the base of the new Globe3D. **New kit components** (spec in the storyboard's
`composition_changes`): Scene3D, CamPath3D, Arrow3D, Axes3D, Label3D, Floor3D, Parallelogram3D, Hand3D, BottleCap3D,
Screw3D, Door3D, Spanner3D, Globe3D, GlobeArrow3D, WindTrails3D, IsobarLayer, TitleCross3D, CircleDotCross; one new
colour role C.rot (violet) for cross-product results and rotation. Physics: `fluidpy.geo.vectors` (cross, dot, norm,
angle_between, parallelogram_area, triple_scalar, k_cross, projection), `fluidpy.geo.frames` (coriolis_parameter,
coriolis_horizontal, coriolis_acceleration_horizontal, inertial_circle, inertial_oscillation_sphere, great_circle),
`fluidpy.geo.constants.OMEGA`, `fluidpy.core.rotating.coriolis_acceleration`, `fluidpy.core.gfd` (parcel_adjust,
geostrophic_velocity), `fluidpy.core.operators.gradient`, `fluidpy.geo.atmos.geostrophic_wind_from_height`; new
implementer needs I1 `fluidpy.diag.trajectories.advect_on_sphere`, I2 `fluidpy.diag.cyclone` (storm_centre,
storm_relative_wind), I3 `fluidpy.geo.atmos.geostrophic_wind_from_pressure` (I2 and I3 have fallbacks on tested
functions; I1 has none).

## Movie 1 — `ch00_dot_product_why` (history)
### Override (2026-10-22)
The user asked for one movie now (feedback U-A.17, `reports/ch00_poc_user_feedback.md`). This **overrides** the
`/make-movies` preconditions: the Chapter-0 batch order (batch 1 = M0-1 climate machine, M0-2 spinning planet, M0-3
reading a climate map, Q12) and `notebook: pass`. Chapter-0 curation (`analysis/ch00_curation.md`) does not exist yet,
so the concept id is the PoC id **C0A-PoC1** (the dot product). Remap it when the curation exists. Batch 1 and batch 2
are still planned as in `book.yaml`; this movie is outside both batches and does not use up a batch slot.

**Round-4 overrides (user, 2026-10-22), for this movie only:** length **6:00–6:10** (book.yaml `project.movie_seconds`
is 120–180 s and `tools/movie_qa.py` gates on it, so the orchestrator must pass a per-movie duration target);
**background music** (MOVIES_BUDGET.md and `knowledge/movie_patterns.md` say "no music"): our own procedural pad from
`tools/music.py` (CC0), bed about −28 LUFS, ducked a further 5 dB under speech; the size budget (≤ 25 MB per 3 min)
scales to about 50 MB for 6 min and needs the orchestrator's decision.

### Version 5 (2026-10-24)
User round 3 (U-M3.G1-G6, U-M3.1-24) and the decisions of 2026-10-24 supersede the round-4 notes below where they differ:
one movie of about 12 min (per-movie override of `project.movie_seconds`; QA window 712-756 s, size budget 60 MB);
no headings, scene titles, part cards or counter; the screen carries keywords, symbols and numbers only (no boxes
except the s03 component tags); no references, no "not to scale", no book name and no lab in the ending; the weather
part follows one story with one assumption (DT/Dt = 0), pole first, then the equation, then the balance. Reused:
the v4 pair plane, map kit (TMap, parcels, upwind track), sled scene; new kit components Keyword, TipLabel,
CalcStack, BraceNote, Balance (`movies/src/ch00/kit/`, promotion to `house/` by the orchestrator). The changelog
(item -> fix -> scene) is at the top of `ch00_dot_product_why/script.md`; the builder additions N1-N12 are in the
storyboard (`new_builder_data`). The round-4 text below is history.

### Movie

| Slug | Title | Concepts | Length | Status |
|---|---|---|---|---|
| `ch00_dot_product_why` | What the dot product measures, and why it multiplies by the other length | C0A-PoC1 | **v5: 733.75 s = 12:13.8** (narration measured at 731.25 s, tools/tts.py dry run v5b; 1809 words, 114 sentences, 25 scenes; 148 wpm overall, + 2.5-s end-card hold) | v5 storyboard + script written 2026-10-24 from the user's round-3 feedback (U-M3.*); needs the build-script additions N1-N12 and a re-build |

**What it does (round 4).** Part 1 (0:00–2:28) teaches the dot product first: arrows and components with Pythagoras;
definition 1 (K 2.2) with the subscripts, the repeated index and ≡ explained; how to read the labels K, 0A and Vallis
(with a footnote strip on every frame that shows a labelled equation); the worked 8; definition 2 (0A.1) with a cosine
reminder; "how much two arrows point the same way" with 6, 0, −6; the shadow and (0A.3) derived one move per step.
Part 2 (2:28–3:30) asks "why times |b|, why not stop at the shadow?" and gives reason 1 (order), reason 2 (cheap; with a
unit arrow the dot product IS the shadow; v·x̂ = eastward part) and reason 3a (work). Part 3 (3:30–5:55) rebuilds the
weather reason slowly: Vallis (1.7) at the top first, the pole and balloon thermometers, ∇T built from two slopes,
v·∇T = (|v| cos θ)|∇T| written out, what 0.180 K per hour means (a rate in time, 18 km per hour × 1 K per 100 km),
DT/Dt = 0 and the algebra to ∂T/∂t = −v·∇T, the pole cooling, and the twice-as-steep punch line (shadow still 5 m/s,
cooling −0.360 K/h). Part 4: recap, the sign rule in one line, end card to the vector products lab.

**Why motion beats the explainer here.** The explainer `viz/ch00/vector_products_lab.html` shows one state at a
time. The user's questions are about a *sequence* (definition → shadow → why |b|) and about *changes*, which need a
guided order: the derivation strip revealing one move per sentence; b shrinking to unit length while the shadow stays;
the two shadows and the two equal-area rectangles; the balloon drifting 36 km while only 18 km of it is towards warmer
air; the pole thermometer falling while the balloon's stays at 13.00 °C; the map doubling its steepness while the shadow
stays at 5 m/s. The end card sends viewers back to the explainer to try it themselves.

**Reused modules.**
- Existing scenes in `movies/src/ch00/DotProductWhy.tsx`: the pair plane (`PairBase`, P12), `S3` (reason 1, now s10),
  `S4` (reason 2, now s11, wind renamed v, new caption), `S5` (work, now s12), the weather map kit (`TMap`, `MapFrame`,
  `ColourBar`, parcels, upwind cone, pole pin) for s14–s20, `S9` end card (now s21), plus `Gauge`, `ProdRect`, `Band`,
  `Bracket`, `Arc`, `EqBox`, `Chip`, `Card`, `Badge`.
- House components (`movies/src/house/`): `TitleCard`, `EqLine`, `DerivationStrip` (s08, s18), `ScaleBadge`,
  `EndCard`; palette `glyphA` teal / `glyphB` orange, `TERM.advection` teal, `TERM.tendency` slate, `TERM.friction`
  rose for negatives.
- **New house component needed: `Footnote`** (props: `items: string[]`, full-width strip y ≈ 1012–1072, ≥ 28 px muted
  ink on `HOUSE.panel`, joins items with " · ", wraps to two lines at most); text comes from the storyboard's
  `footnotes:` map via each scene's `footnote:` keys. Badges and grid notes move above it. Note for the orchestrator:
  player captions also sit at the bottom; consider a VTT `line:` setting in `tools/tts.py` so cues sit above the strip.
- New small illustrative icons: balloon with thermometer, pole thermometer (pin exists), crossed-out ghost arrow (s05).
- Physics: `fluidpy.geo.vectors` (`dot`, `norm`, `scalar_projection`, `projection`, `angle_between`, `k_cross`),
  `fluidpy.core.operators.gradient` (∇T on the map grid; `[0]` is ∂T/∂x for an `(ny, nx)` array) and
  `fluidpy.core.kinematics.material_derivative_terms`. `movies/data/build_ch00_dot_product_why.py` must add the new
  numbers listed in the storyboard (s02 Pythagoras, s06 cos reminder, s07 p·q, s08 a·b̂ terms, s14 balloon path, s15
  gradient, s17 18.0 / 36.0 km per hour and 13.18 °C, s19 balloon tag 13.00 °C) and rename the s4/s6/s7 wind keys
  from u to v.

**Before the builder starts.** Add to `movies/lexicon.yaml → respell`: `Vallis: "Valiss"` and `Kundu: "Koondoo"`
(checked with Kokoro phonemes; the measured timing already includes them).
