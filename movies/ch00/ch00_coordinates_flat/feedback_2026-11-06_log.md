# ch00_coordinates_flat (#5a) — user feedback 2026-11-06 / 2026-11-07 log

Brief: `movies/ch00/coordinates_series/master_plan_2026-11-07.md` (R1–R4, R6–R9, R19), narrowed by the user on 2026-11-07
("Part 1 needs only the MINIMUM … most of the frames are correct, so don't redo those things"). Base: fix 3
(`5a_coordinates_flat_fix3.mp4`, 43:55; commit 6aa7d66). Fix-3 frames looked at first (ffmpeg grabs at the user's times):
`reports/movies/ch00_coordinates_flat/fb1106/fix3/f_{2,7,1410,1678,1900…2633}.jpg` (title with "made easy" at 0:07; ū_r at 32:40 shown
only as −957.2/72; the three hand-worked points at 37:20–38:50; the "eastward, northward, round, in, out" legend at 40:23–40:45; the
recap mini map 43:20; the end card at 43:53, no picture fade).

## Scope changes during the loop (and what was reverted)
- First pass (2026-11-06 brief): also the C5 maths-font sweep (51 labels to KaTeX), a Part 2 pointer in s17, r̂/θ̂ numbers for the three
  worked points (s24 S8/S14/S19 re-voiced), a "why negative" sentence in s22 S11, storyboard number reconciliation in s21–s27.
- User 2026-11-07 ("only the MINIMUM"): **all of those were reverted to the fix-3 state** (cf_sA/cf_sB back to HEAD plus the two in-scope
  edits; the label strings, s17, s22 S11, the s24 worked points and the storyboard text restored; timing/script/captions restored to fix 2 and
  re-spliced with the reduced list). The maths-font lint therefore still reports the fix-3 count (51, unchanged, none new).

## R-items → change → evidence
| R | change (minimal scope) | evidence (stills, `G:/…/ch00_coordinates_flat/build1/stills/…`) |
|---|---|---|
| R1/R2 title + first sentence | s00: "made easy" and its pulse removed; new series layout `kit_cf/SeriesTitle.tsx` — line 1 "Coordinates" (150 px, house gradient, pulse ×1.06 on AT(0,"coordinates")), line 2 "Part 1 · Arrows on a flat map" (size fitted to the 975-px column, 67 px; ends x ≈ 1050), line 3 subtitle "polar coordinates / and rotated axes" (68 px). Voice: "In this video, we'll learn coordinates on a flat map, and see how meteorology uses them to measure the winds round a hurricane's eye." | k6x1/f00060 (pulse), f00210 (poster area); look/f00200 |
| R1 tensors | s19 S22 "…tensors, which we'll meet in our tensors movie, later in this series."; keyword "more: our tensors movie" | k6x1/f50432 |
| R3/R9 link to Part 2 | s25 S15 (at the "eastward, northward, round, in, out" legend): "The same idea works on a coast, where we turn the axes to split the wind into a part along the shore and a part across it. Wind blowing across the shore, towards the land, pushes sea water onto the coast, and in Part 2 we'll use these same equations to see that happen, with tide gauges and satellite pictures from before and after storms." Keyword "next, in Part 2: winds at a coast"; x′ (along, NNW) / y′ (across, ENE) arrows at Fort Myers Beach; "across the shore, towards the land: / sea water pushed onto the coast" | k6x1/f75250, f75500 |
| R3 teaser + ending | s27 S11: "In Part 2, we'll find out how fast r hat and theta hat turn as we go round, and add height to get cylindrical coordinates. Then we'll use these same turned axes to split coastal winds along and across the shore, and show on real maps, with tide gauges and satellite pictures from before and after storms, how the wind pushes water onto coasts." Four lines on their words; the "?" picture became the balloon going round with r̂, θ̂ turning. s28: the picture fades over the final 2.5-s hold (LEN−75 … LEN−5); the music bed fades in the mix tail (ice-polar fade-out 10 s, ends with the picture). No new idea in the last minute | k6x1/f80568, f80808, f81078; look/f81987, f82027 |
| R8 ū_r = (1/N)Σ | s22 S5 (four clips): the rule in symbols ū_r = (1/N) Σ_{i=1}^{N} u_{r,i}, N = 360°÷5° = 72 (gold), ū_θ alike; S6 screen: (38.0 + 37.8 + 38.3 + …)/72 above the running sum; S10 (three clips): "start with minus eight point seven at theta equals zero, minus ten point three at five degrees, and minus eleven point two at ten degrees …", written term by term on the words (the three ring points ringed in gold), then sum −957.2, ÷ 72, −13.3. Existing S11 ("the minus sign means … flowing in, towards the eye") kept | k6x1/f57257, f57688, f59421, f59821 |
| R7 eight points | three worked points unchanged; s24 S24 (four clips): "The other points work the same way, so here are five more, without the arithmetic." The map zooms (ring ≈ 230 px); all 8 points every 45° get u_r (rose) and u_θ (teal) arrows labelled with the values; legend "u_r: in (−) or out (+)", "u_θ: round"; keyword "in at 7 of 8 · out at 225°"; R8 link "And our first point, minus eight point seven at theta equals zero, is the very first term of the radial sum": ū_r = (−8.7 − 10.3 − 11.2 − …)/72 ≈ −13.3 m/s with −8.7 gold and the 0° point ringed | k6x1/f71153, f71738 (before the K6 fixes); k6x2 (after) |

All new numbers come from builder rows (85/85 CHECK, +7): DF24 "R7 eight points" u_r / u_θ at 0–315°, the rule reproduces the library at
all eight (< 0.2 m/s), "inflow at 7 of 8, outflow only at 225°"; DF22 "R8 first terms" of Σu_r and Σu_θ, Σu_r / 72 = −13.3 = the
library ring mean. The TSX re-asserts every on-screen value (`LAB8`, first terms, 7-of-8) against `cf.json` at module load.

## R19 fact check (before TTS)
`movies/ch00/coordinates_series/fact_check_2026-11-07.md` has three Part 1 rows, all **OK** (ring means 34.8 / −13.3, ranges 17–47 and
−40…+14 with 58 of 72 inward, inflow angle 21°): nothing to apply.

New factual claims added in this loop:

| scene · sentence | claim | source |
|---|---|---|
| s25 S15 | "Wind blowing across the shore, towards the land, pushes sea water onto the coast" (onshore wind drives storm surge) | NOAA NHC, Storm Surge Overview (https://www.nhc.noaa.gov/surge/): "storm surge is produced by water being pushed toward the shore by the force of the winds"; the original single movie (ch00_coordinates s39–s40) and Part 2 show it with the Fort Myers / St. Petersburg gauges |
| s25 picture | Fort Myers Beach shore runs about 329° (x′ along NNW, y′ across ENE) | the original movie's coast frame (ch00_coordinates s39, coast at 329°), the value Part 2 uses; drawn as a labelled sketch, not data (storyboard honesty note) |
| s22 S10 | first three terms of the radial sum: −8.7 (θ 0°), −10.3 (5°), −11.2 (10°) m/s | `data/cf.json` ring (fluidpy.diag.cyclone.storm_relative_wind); builder row DF22 "R8 first terms" |
| s24 S24 | inward at 7 of the 8 points every 45°, outward only at 225° | `cf.json` → `ian.pts8`; builder rows DF24 "R7 …" |
| s22 screen | first terms of the tangential sum 38.0, 37.8, 38.3 | `cf.json`; builder row DF22 |
| s27 S11 | Part 2 shows tide gauges and satellite before/after pictures | Part 2's storyboard (ch00_coordinates_storm s27–s34: gauges, Amphan / Nargis / Idai before-after) |

## Narration
`movies/src/ch00_coordinates_flat/checks/cf_fb1106_splice.py` (method of cf_fix2_splice.py: compound replacement, one Kokoro af_bella ×1.0
clip per spoken sentence, 0.35-s gaps, BS.1770-4 match to the nearest unchanged neighbours, limiter −1.5 dBTP, all clips within ±1.5 LU):
7 timing entries re-voiced (17 clips): s00 S1, s19 S22, s22 S5, s22 S10, s24 S24, s25 S15, s27 S11. Sentence indices unchanged.
`tools/script_wording_lint.py`: 0 findings (preview and final script.md).

**Result:** 2731.900 s narration + 2.5-s hold = **45:34.4** (81 957 + 75 = 82 032 frames; fix 3 was 43:55.2), **650 cues**, 0 caption
warnings, self-check 0.0 ms. Skip chips 14:25, 18:52, 29:55, 39:58. Storyboard voiceovers / times synced (`cf_fix1_sync.py`, now
idempotent across the fb1106 entries), feedback notes per changed scene (`cf_fb1106_storyboard.py`); manifest re-built (85/85 CHECK).

## Gates (after the last change)
tsc 0 · at_check 532 references, 0 failures · swap_check 416 text elements, 0 overlaps, 0 swaps < 8 frames · cam_speed 0 · eq_check 23/23 ·
SSR `--step 10` 9634 scene-frames, 0 errors, 0 NaN · wording lint 0 · symbol lint `--strict` 51 findings = the fix-3 C5 set, unchanged
(the C5 sweep was dropped by the user on 2026-11-07; the new labels use `$…$` KaTeX via the cf_lib Lbl, so none are new).

## Sound
`tools/sound/mix.py` → `build1/sound8` (music ice-polar seed 23, unchanged cue sheet): **−16.01 LUFS, true peak −3.31 dBTP, PASS**, 0 warnings;
renamed to `narration_music_cf.wav` (2734.40 s). `tools/sound/check.py`: music bed OK (0 clicks, TP −14.8); the full mix lists speech
transients as "clicks" (5537), the same pattern as fix 3's sound7 (5392), which was rendered and accepted.

## K6
| tag | frames | hits |
|---|---|---|
| k6x1 | 3807 (house list over the whole movie, `--timing`) | 107 edge, all in s24's new rows (legend label outside `<Svg>`, keyword and link row past x 1842) |
| k6x2 | 1813 (every K6 frame of s22-s24, every 15 frames through them, the 29 look frames) | 0 in the changed scenes; 3 text-text in s23 (f61207 s22→s23 cross-fade, f64177 a CalcStack slide), both unchanged fix-3 code and not on the house K6 list (accepted before: fix1 log "CalcStack's own slide") |
Combined on the house list: **0 hits** (k6x1 outside s24 + k6x2 on every k6x1 hit frame). Fixes: the two legend labels moved inside
`<Svg>` (a `foreignObject` outside an SVG fell into HTML flow, 1069 px down), "in at 7 of 8 · out at 225°", the link row on two lines (y 752 / 842);
s22 first-terms row y 670 → 685.

## Stills looked at (copies in `reports/movies/ch00_coordinates_flat/fb1106/look/`)
title f00060 / f00210 (layout fits, line 2 ends x ≈ 1050, ≥ 50 px clear of the animation) · s19 f50432 · s22 f57257 (rule in symbols), f57688
(N = 72 gold, ū_θ rule), f59401 (first terms), f59821 (−957.2/72, −13.3) · s24 f71026, f71200, f71791 (eight points, legend, link row) ·
s25 f75250, f75500 (coast pointer) · s27 f80568, f80808, f81078 (teaser lines) · s28 f81987 (fading), f82027 (background).

## Render (not run here; the orchestrator runs it)
The bundle in `build1/bundle` is the final code (k6x2). Whole movie (timing changes from 0:00.3):
`SND=sound8 K6TAG=k6x1 bash movies/src/ch00_coordinates_flat/checks/cf_render.sh`

# Addendum (user 2026-11-07, via the coordinator): the pointer names Part 2's IMPACT
- s25 S15 (now five clips; the first two kept): "… Wind blowing across the shore, towards the land, pushes sea water onto the coast. In Part 2,
  we'll use these same equations on real storms. We'll measure how much of the wind blew onto the land, see on tide gauges how high the water
  rose, and then look at the flooded land in satellite pictures taken before and after the storm." Screen: the two "across the shore …"
  lines leave at "In Part 2"; in their place, on their words, "Part 2: wind onto the land" / "→ water level" / "→ flood maps".
- s27 S11: "In Part 2, we'll find out how fast r hat and theta hat turn as we go round, and add height to get cylindrical coordinates. Then
  we'll use these same turned axes on real storms: how much wind blew onto the land, how high the water rose, and what the flooding looked
  like from space, before and after." Teaser lines 3-4 now "x′, y′: wind onto the land" / "water level, flooding before / after".
- Wording lint 0; re-spliced from fix 2 with the same script (cached clips reused; only these clips re-synthesised); at_check 536 / 0,
  swap_check 0 / 0, tsc 0, eq_check 23/23; manifest 85/85; storyboard synced.
- **New result: 2737.775 s + 2.5-s hold = 45:40.3 (82 209 frames), 651 cues**, 0 warnings. Timing changes only from s25 S15 (41:43) on.
- Mix `build1/sound9`: **−16.01 LUFS, true peak −3.34 dBTP, PASS**; music bed check OK (0 clicks). Render defaults now sound9.
- K6: k6x3 = the house-list frames from s25 on (657) + 8 look frames; **k6x4** = one folder with the whole house list (3818 frames):
  s00-s21 copied from k6x1, s22-s24 from k6x2 (both unchanged in code and timing since), s25-s28 from k6x3.
- K6 result: k6x3 665 frames, 0 hits; **k6x4 3818 frames (the whole house list, one folder), PASS, 0 hits** (821 INFO).
- Stills looked at: k6x3 f75674 / f75826 / f76045 (the three impact keywords on their words, clear of the x′/y′ arrows), f81081 / f81266
  (teaser lines 3-4), f82164 / f82204 (end-card fade); copies in `reports/movies/ch00_coordinates_flat/fb1106/look/k6x3_*`.
- Render (not run): `SND=sound9 K6TAG=k6x4 bash movies/src/ch00_coordinates_flat/checks/cf_render.sh` (bundle = final code, from k6x3).
