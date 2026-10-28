# ch00_cross_product — brief (movie-director, 2026-10-27)

Series position: **#2** of the approved plan v2 (`movies/ch00/series_plan_v2_proposal.md`), after #1 "Vectors, components
and index notation", before #3 `ch00_cross_product_uses`. It is the first of the two splits of the finished
`ch00_cross_product_why` (v4 fix 2, 48:28, commit 45406d0, review 3 PASS). House style `movies/HOUSE_STYLE.md` is
binding: s00 title + one sentence → hook → building blocks → intuition → why → application → "To sum up" → end card.
**Ending: the maths ending** (HOUSE_STYLE §3, first variant, word for word; concept "this cross product").

## What it teaches
The cross product only, from zero: why the dot product is not enough (the door, left vs right), the axes and unit
vectors, the recipe, a worked example, |a||b| sin θ, the parallelogram area, why the recipe is an area (box proof), the
right angle check, the right-hand rule in four ways and from every side, the cycle and the swap, **the index form with
ε_ijk (new, brief; pointer to #1)**, the cases, then the "why" section (the part across, sliding along, the normal of a
plane, components as shadows), and the summary grid.

## Application (new; the user asked for weather examples and maps in every maths movie)
The cross product gives three things — a **sign**, a **length** and a **direction** — and weather maps use all three:
1. **Sign → left or right of a storm's track** (s51–s53): Hurricane Ian, 28 Sep 2022, on the GOES-16 image with the
   IBTrACS track; d × r for Fort Myers Beach (right, ≈ −2500 km²) and Sarasota (left, ≈ +5000 km²); why the right side
   is usually hit hardest (circulation + motion add), with the real tide gauges (Fort Myers up, St. Petersburg/Tampa Bay
   down) and the NHC's surveyed 3–4.5 m inundation at Fort Myers Beach.
2. **Length → the area inside an isobar** (s54–s55): Storm Ciarán at 12 UTC 2 Nov 2023 on the MODIS image; the
   968-hPa isobar filled by a fan of triangles, each half a cross product; ≈ 270 000 km², a little more than the UK
   (planning run 273 492 km², equal-area map = sphere within 0.1 %); the sign flips with the direction of travel; the
   shoelace formula named.
3. **Direction → the sunny side of a valley** (s57–s59): the Alps in 3-D (ETOPO 60″, ×3 said), the Rhône at Sion; the
   normal = east edge × north edge; sunshine ∝ ŝ · n̂ with the 21 Dec noon sun (20°): flat 0.34, south-facing 0.58
   (+70 %), north-facing 0.05 (planning run); vineyards on the sunny side; shaded relief maps are made this way.

## Cross-references (user rule 2026-10-27; spoken, `related:` per scene, end card)
#1 index notation and ε_ijk (s15a) · #6 gradient (s19, s59) · #10 material derivative (s19) · #29 Coriolis and #45
tropical cyclones (s53) · #8 curl (s55, loop sums) · #22 climate machine (s58, sunlight per square metre) · #3 the
uses movie (recap). End card: six faint "related" thumbnails (#1, #3, #6, #8, #22, #45), no slugs or URLs.

## Review-3 fixes folded in
R3-S3 (s03 door tick and snap), R3-S4 (s08 link knot), R3-S1 (s09 empty half; cosmetic s03, s08, s14, s17), C1 (s17,
s22a), C4 (s12, s18c), C5 (s02, s08 short cues), C6 (s19 heads). R3-S2 and the rest belong to #3.

## Not here (in #3 or later)
Torque, the spanner and door-as-torque, angular momentum, qv × B, the perpendicular push, k ×, Ω × r, Coriolis,
geostrophic (#3); why storms spin (#29); advection in depth (#10).

## Music and sound
A new score, **geometry-crystal** (E-flat major, 3/4 at 76 bpm, glass pad + celesta + marimba, seed 21; to be added to
`tools/sound/styles.py`); quiet effects only where the picture shows them (storm_bed under Ian, waves_breaking while the
coast floods, a whoosh on the Alps flight).

## Length
Measured: see `script.md` header (v4 clips + dry run of every new sentence).


## Update 2026-10-28 (movie-director): this supersedes the sections above where they differ
The plan is now in `storyboard.yaml` and `script.md` (46 scenes, measured 35:43.7).

**What changed:**
- **Torque moved in** (orchestrator, from the user's reference video): the "Not here" line no longer holds for torque.
  - v4 s20_torque (the slanted spanner) and s21_torque_axis are in the why section.
  - They are followed by the new scenes s21a_minus_sign (two mini-torques fight → the minus sign) and
    s22d_tilted_axis (a ball brushed off centre → a torque about a tilted axis).
  - s03_door gains the lever-arm (near vs far from the hinge) anchor.
- **New intuition scenes:**
  - s15a ε sign cube;
  - s18d along/across right triangle (Lagrange);
  - s22x glass sheet (why perpendicular);
  - s53a runway crosswind (cross half).
- **Upgraded scenes:** s02, s04 (sign dial), s07 (plane case first), s14/s15 (cycle + recipe pattern), s17 (two-faced
  card), s18 (continuous sweep + contrast with the dot product), s18c (live area), s19 (closing pair).
- **Review-3 fixes:** in the `visual` "CHANGES FOR THIS MOVIE" lines (R3-S1 s03/s08/s09/s20, R3-S3 s03/s22, R3-S4 s08,
  C1/C4/C5/C6).
- **Ending:** the maths ending, word for word.
