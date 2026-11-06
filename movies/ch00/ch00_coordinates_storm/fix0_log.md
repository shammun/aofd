# ch00_coordinates_storm (#5b) — fix 0 log (heavy phase, 2026-11-05)

Source: the pre-render "calculation & sync audit" (reports/ch00_movies.md, "## #5b ch00_coordinates_storm — calculation & sync audit
(2026-11-05)", 14 Must / 11 Should, B1–B25) plus the heavy-phase K6 round 0 (stills/k6r0, 4138 frames, 3967 hits / 135 unique faults,
taken on the pre-audit build). Coordinator choices: B1 highest priority; B12 option (a) re-voice; B14 like-for-like pressures; B13 box
continuity with a CHECK row.

## 1. Narration (final TTS, then splice)

* Final TTS: `tools/tts.py` af_bella × 1.0, whole script → `G:/…/ch00_coordinates_storm/build1/tts` (396 sentences, 2499.025 s, 607 cues,
  **0 warnings** after the s18 last sentence was reworded: 17.2 cps → "We drew the layers much farther apart than they really are, so that we
  can see between them." 16.3 cps). Re-voiced light-phase sentences (s19 S1, s20 S12, s21 S5, s23 S5, s30 S0/S6/S7) all used their current text.
* Fix-0 splice: `movies/src/ch00_coordinates_storm/checks/cst_fix0_splice.py` (Part 1's cf_fix1_splice method; extended to one-to-many).
  Re-synthesis correlation 0.9955; every clip within ±1.5 LU of its unchanged neighbours (final −15.6 … −17.3 LUFS, TP ≤ −1.64 dBTP).
  13 edits, 16 new clips → `G:/…/ch00_coordinates_storm/fix0/tts` (399 sentences, **2565.825 s**, 625 cues, **0 warnings**, self-check 0.0 ms).

| Item | Scene / sentence (0-based) | New narration | Δt |
|---|---|---|---|
| B6 | s04 S11 | "Turn by zero point zero one radians, about half a degree, to fifty three point seven degrees." | +4.05 s |
| B19 | s08 S7 | "… along an arrow pointing east, one, zero, which we'll call d hat." | +1.23 s |
| B4 | s08 S16 | where (−0.005, 0.1) comes from, in one sentence | +5.65 s |
| B3 | s08 S22 | "Divide each piece by the time step: the first two stay at about one, but the third goes from zero point one to zero point zero five to zero point zero two five, so as the time step shrinks, the third piece vanishes." | +9.58 s |
| B1 | s14 S15 | "In a tropical cyclone, that push is the pressure force, because the pressure is lowest in the eye." | +0.15 s |
| B1 | s14 S16 | "The Earth's spin pushes the other way, a little outward, about twenty times weaker, so the pressure force has to be a little stronger than the turning alone needs." | +5.38 s |
| B12a | s18 S7, s19 S3, s20 S10 | "one and a half kilometres" → "one point four kilometres" | +0.33 / +0.10 / +0.33 s |
| B13 | s20 S12 → S12–S15 | "Here's a quick check." · inflow through the side (30 km, 1 km, 16 m/s) · out through the lid: 2 × 1000 × 16 / 30 000 ≈ 1 m/s [beat] · radar: three metres per second, eight and a half kilometres up, towers near ten [beat] | +23.73 s |
| B14 | s23 S8–S9 | 90 kt ≈ 46 m/s and 956 hPa official; ERA5's lowest pressure only ≈ 967 → much too weak [beat] | +3.55 / +5.28 s |
| B25b | s27 S3 | "… and Ian's centre was about seventy five hectopascals below normal, so that's only about seventy five centimetres." | +7.48 s |

* Timing: `checks/make_timing.py --final <fix0/tts>` (new `--final` mode): timing.json, en.vtt, en.srt, storyboard t / sentence_times /
  target_duration_s (2568.325 s = 42:48 with the 2.5-s hold), maths_skip chips (**B1 chip on 155.28 s → skip to 11:38; B2 chip on
  709.70 s → skip to 20:09**), chapter marks (0:00, 1:28, 2:35, 11:38, 20:09, 23:19, 25:04, 26:22, 28:52, 31:19, 35:00, 35:51, 36:37,
  38:18, 39:00, 41:01), a `build_1.tts` record; the script README skip table. Storyboard voiceovers re-synced from script.md (8 scenes).

## 2. Data (movies/data/build_ch00_coordinates_storm.py)

New CHECK rows (all PASS; **93/93 CHECK, 0 narration flags**):
* DS30 (B13) box estimate w = 2h|u_r|/r = 2 × 1000 × 15.7 / 30 000 = 1.04 m/s (said with 16: 1.07) vs the continuity integral 1.04 m/s.
* DS21 (B14) 90 kt × 1.852 / 3.6 = 46.3 m/s; ERA5 lowest msl 966.9 hPa vs official 956 (11 hPa too high).
* DS25 (B25b) 1 hPa ↔ 0.0099 m; 1013 − 938 = 75 hPa → 0.75 m.
* `say` gains w_box, a_ms 46, a_msl 967; w_ring_z 9 → 8.5 (the voice now says "eight and a half").

## 3. Composition (cs_sA/sB/sC.tsx, cs_lib.tsx, cs_eq.ts)

| Item | Fix |
|---|---|
| B1 | s14: violet Coriolis arrow now OUTWARD with a head, 51 px (6 × its 1/20 length); keyed "pressure force: inward", "Earth's spin: ≈ 1/20, outward", "(violet arrow drawn 6× longer)"; S16 rows turning 0.048 inward / Earth's spin ≈ 0.0023 outward / 0.048/0.0023 ≈ 21 / pressure push ≈ 0.050; slate "worked out: Coriolis movie". Storyboard visual + a new honesty note. |
| B2 | s11/s12: "θ̂ (s05)", "v/r (s09)", "−r̂ (s06)" → "θ̂: from the turning rule", "v/r: how fast θ grows", "−r̂: θ̂ swings towards −r̂"; the s12 mini picture labels θ̂ and −r̂. |
| B3 | s08: grid fades at tHalf − 10; bars 100 px apart with their numbers; rows Δt = 1 / 0.5 / 0.25 and ÷Δt: 0.1 → 0.05 → 0.025 → 0; "first two stay ≈ 1". |
| B4 | s08: rows Δv = 11 − 10 = 1; d̂_new = (cos 0.1, sin 0.1) ≈ (0.995, 0.1) with the turned unit arrow drawn; 11(0.995, 0.1) moved to its own sentence; (10.945, 1.1) − (10, 0); Δd̂ = (−0.005, 0.1) before piece 2. |
| B5 | s08: inset at ZO (660, 400), 200 px per m/s ("change, drawn 3× larger"), a dashed gold leader from the grid's change arrow, pieces tagged (1, 0) / (−0.05, 1) / (−0.005, 0.1), "sum (0.945, 1.1)". |
| B6 | s04: one row per sentence (53.13°: 3/5, 4/5; 0.01 rad = 0.57° → 53.70°; cos 53.70° = 0.592 … −0.008; ÷0.01; sin 53.70° = 0.806 … +0.006; ÷0.01). |
| B7 | s04: move ≈ Δθ θ̂ = Δθ(−sin θ, cos θ) = (−sin θ Δθ, cos θ Δθ); the Δ rows stay to S7; the division row on S6 + "Δθ → 0: ≈ becomes =". |
| B8 | s06: r̂ and θ̂ ease back to the un-turned position on S18; the step-4 slide arrow slides onto −r̂ with "same direction". |
| B9 | s07: θ̂(53.70°) = (−sin, cos) = (−0.806, 0.592); the subtraction row; r̂ = (0.6, 0.8) ⇒ −r̂; "= −r̂" on S17; "same numbers as the slope check". |
| B10 | s09: "arc rule: Δs = r Δθ" (S7); (Δθ/Δt) = vΔt/(rΔt) = v/r with "Δt cancels" (S9). |
| B11 | s09: r = 25 km = 25 000 m, v = 34.8 (≈ 35); 1 rad = 180°/π ≈ 57.3°; 0.08 × 60 ≈ 4.8 ≈ 5°/min; 2π/0.00139 = 6.283/0.00139; ≈ 4500 s, 4500/60 = 75 min. |
| B12 | (a) re-voiced; tags rounded as spoken ("≈ 6 / 12 / 14 km"), CHECK_B z500/z200/z150 → 6 ± 0.25, 12 ± 0.5, 14 ± 0.3; z850 stays 1.4 ± 0.05. |
| B13 | s20: gold box r 0–30 km × z 0–1 km, inflow arrow into its side, three dashed up arrows out of its lid; rows in through the side 2πr h|u_r| / up through the lid πr² w / w = 2h|u_r|/r = 2×1000×16/30 000 ≈ 1 m/s; SS indices after S12 shifted +3. |
| B14 | s23: rows official 90 kt × 1.852 ≈ 167 km/h → 167 ÷ 3.6 ≈ 46 m/s → p_min ERA5 967 vs official 956 hPa; "ERA5's storm: much too weak"; CHECK_C rows a_ms / a_msl. |
| B15 | s03: wedge eases 20° → 5.7° on S15 and back on S16 ("0.1 rad ≈ 6°"); rows "= Δθ" (S14), 0.1 × 180°/π ≈ 5.7° ≈ 6°, s = 1 × 0.1 = 0.1. |
| B16 | s04: "slivers drawn 20× larger" → "turn drawn large (20°)". |
| B17 | s05: |Δr̂| = 0.09996 vs arc 0.1 + "straight ≈ curved (small turn)"; Δr̂/Δθ ≈ θ̂ → dr̂/dθ = θ̂; the middle slope line on S11. |
| B18 | s06 "s = 1 × Δθ = Δθ" on S13; s07 "r = 5 km", angles 0°/25°/53°, "tails together". |
| B19 | s08: "v = 10 m/s · d̂ = (1, 0), length 1" (S7), "→ 11 m/s" (S9), "· d̂ turns 0.1 rad" (S10); narration names d hat. |
| B20 | s11: S1 shows v = ~~(dr/dt) r̂~~ + r dr̂/dt; e1 on S8, "= v θ̂" appended on S9 (CalcStack cont). |
| B21 | s12: product rule then the same line with dv/dt θ̂ struck (S4); a = v·(−r̂ v/r) (S10); = −(v·v/r) r̂ = −(v²/r) r̂ (S11); EQ_S12 kept as the summary line. |
| B22 | s13: 100 km/h = 100 000 m / 3600 s ≈ 27.8 m/s; 27.8/0.048 ≈ 580 s; 580/60 ≈ 9.7 ≈ 10 min; storyboard row 570 → 580. |
| B23 | s14: "radius 34.8 m/s" on the dashed arc; "turn drawn 3× larger"; row 0.084 × 57.3 ≈ 4.8° ≈ 5°. |
| B24 | s23: the actual wind (round + in) and a gold "inflow angle" arc at the ring point; rows tan(inflow angle) = |u_r|/u_θ, 6.0/20.1 ≈ 0.30 ⇒ arctan ≈ 16.6° ≈ 17° (EQ_S23 and storyboard updated), 13.3/34.8 ≈ 0.38 ⇒ 20.9° ≈ 21°. |
| B25 | (a) s26 u = 22.2 E, v = 24.3 N, √(22.2² + 24.3²) = √(493 + 590) ≈ 32.9 m/s, "towards the NE = from the SW"; (b) s27 1013 − 938 ≈ 75 hPa ⇒ ≈ 75 cm, "75 cm: small next to 3-4.5 m"; (c) 10 × 0.3048 ≈ 3.0 m, 15 × 0.3048 ≈ 4.6 m; (d) s28 "St. Pete" → "Saint Petersburg"; (e) s29 "≈ 33 km" on the gold shelf line. |

K6 r0 / layout fixes made in the same pass: the s18/s19 layer stack never drew (Remotion's ThreeCanvas draws only on frame change;
textures landing later never reached the canvas — `advance()` on texture arrival, as TexQuad); skip chip text overflowed and clipped at
1842 (Part 1 wording "every step · optional" / "skip to mm:ss", data-lc-own); fraction rows in CalcStack had no height (a Part-2 wrapper
`CalcStack` in cs_lib gives `\frac` rows 2.2 × size); "− in / + out" moved inside the colour bar's own group; s01 world map clipped and
labels re-anchored; title line spacing (+8 px); s04 slope graphs moved below the rows, ticks 90/180/270; s04–s08 labels off circles and
arrows; s18 colour bar below the tags; s18/s19 source lines out of the caption band and no longer cross-faded on top of each other; s19
callouts 20 px lower; s20 images physically cropped (nested svg) and eye band owned; s21/s29 source lines one line; s23 SpeedBar 160 px;
s27 shelf plot 140 px lower, gauge chart inside 1842; swap_check/cam_speed `export const` regex fix (as Part 6) — nothing new revealed.

## 4. Gates (after fix 0)

tsc 0 · at_check 362 refs 0 failures · swap_check 378 elements, 0 overlaps, 0 tight swaps · cam_speed 0 > 90°/s · eq_check 18/18 ·
SSR 9213 scene-frames 0 errors, NaN 0 · SSR --3d 9213 frames, THREE-tag guard on 922 3-D frames, 0 errors · data 93/93 CHECK.

## 5. Still to do (held for the coordinator's go-ahead: one RAM-heavy / Chrome job at a time)

The fixed build is bundled (`G:/…/build1/bundle`; the pre-fix bundle kept as `bundle_pre_fix0`); the K6 frame list for the fixed
timing is written (`build1/k6_frames.txt`, 4215 frames). The build-1 mix (−16.01 LUFS, TP −3.4 dBTP) was made on the PRE-fix timing and
is quarantined as `build1/sound_pre_fix0_STALE` so it cannot be rendered by mistake. sound.yaml needs no change (s15 S2–S4 and s27 S0–S2
did not move inside their scenes).

1. Mix (≈ 15 GB RAM, ≥ 18 GB free first):
   `.venv/Scripts/python.exe tools/sound/mix.py --narration "G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_storm/fix0/tts/narration.wav" --cues movies/ch00/ch00_coordinates_storm/sound.yaml --out-dir "G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_storm/build1/sound"`
   then rename `build1/sound/narration_music.wav` → `narration_music_cst.wav`.
2. K6 round 1: `.venv/Scripts/python.exe movies/src/ch00_coordinates_storm/checks/cst_run.py stills k6r1 --jobs 3` (≈ 45 min),
   `.venv/Scripts/python.exe tools/k6_overlap.py <build1>/stills/k6r1 --json <build1>/k6r1.json --timing movies/ch00/ch00_coordinates_storm/timing.json`,
   `python <build1>/k6sum.py <build1>/k6r1.json`; fix to 0 hits (re-shoot only the faulty frames into a copy of the tag).
3. Render: `K6TAG=<clean tag> bash movies/src/ch00_coordinates_storm/checks/cst_render.sh` (resumable `--from N`).

# K6 round 1+ (2026-11-05)
Input: orchestrator run k6r1 (bundle of 1f4943d, 4215 frames, `--timing`): FAIL 2235 hits in 116 distinct faults (text-text 641, text-img 551,
text-stroke 358, edge 344, text-cbar 218, text-picture 54, src-on-picture 42, text-fill 27). Audio, narration, timing, data, house kit untouched;
only cs_lib.tsx, cs_sA/B/C.tsx changed. Method as Part 1 (fix1_log "K6 after fix 1c"): always `--timing`; measure max(r[2]) per block.

## Rounds (stills `cst_run.py stills TAG --jobs 3`; gate `tools/k6_overlap.py … --timing timing.json`)
| tag | frames | scope | hits |
|---|---|---|---|
| k6r1 | 4215 | full (orchestrator) | 2235 (116 faults) |
| k6r2 | 3612 | every scene except s00-s02, s15-s17, s22, s25 (unchanged) ± 16 frames (`k6r2_frames.txt`) | 29 (8 faults: s07 ×2, s12, s13 ×3, s20, s26) |
| k6r3 | 761 | s07, s11, s12, s13, s20, s26 ± 16 (`k6r3_frames.txt`) | NOT SHOT: held by the orchestrator (Part 1 has Chrome/GPU) |
| k6r4 | 4215 | full, final | to do after k6r3 |
All 8 k6r2 faults are fixed in source (below); the fixes after k6r2 are static- and SSR-checked only.

## Root causes
- **cs_lib `CalcStack` fraction height never applied**: the test was `/\frac/`, a regex for FORM FEED + "rac", so no `\frac` row got its
  height and every fraction row printed over the next (≈ 640 text-text hits in s03-s14). Now `/\d?frac/` (not `\tfrac`), h = 2.4 × size;
  rows with a hat or superscripts over a fraction get an explicit h (s12 140 @ 52 px, s13 130 @ 50 px).
- **s11 `e1.replace(/^\mathbf v/, "")`**: same bug (`\m` = "m"), so the row read "v v = r …" (a CONTENT error, now "v = r …").
- Rows wider than 1842 (s04, s05, s07, s08, s09, s14, s20, s23, s26, s27): split at "=", "⇒" or a comma, second part on its words.

## Fixes (scene · what)
- s03 "0.1 rad ≈ 6°" moves to 76° (left of both r̂ arrows) while the example plays.
- s04 move rows: the two divisions on two rows; check rows: each split (cos/sin values, Δθ ⇒ 53.70°, cos 53.70° / change, sin 53.70° /
  change, cont rows on "the sine is", "to fifty three point seven", "a change of"); the rows leave on "So the rule works" and the slope
  graphs come in then, larger (y 330, 300 × 220, ticks 90°/270°, titles 64 px up) — before they sat under the rows in the caption band.
- s05 "along θ̂" outside the unit circle; chord row split ("vs arc 0.1 (Δθ=0.1)" cont); "straight ≈ curved" y 560 → 630.
- s06 "same direction" inside the circle right of −r̂ (was across the circle and the arrow).
- s07 "53°" outside the circle (up-right of its balloon, clear of the gold link); "−r̂" up-left of the arrow tip; Δθ̂ row (to x 2300) as
  three aligned lines (\phantom), result on "minus zero point zero zero eight"; "slopes, part by part" became the keyword on S15.
- s08 Δd̂ row split, result on "a change of".
- s09 r / v on two lines; "Δt cancels" 610 → 645 and out at tRate − 20 (swap gap).
- s10 "r = 25 km" inside the ring under the arrow. s11 turning arc RR+70 → RR+34 (it ran through "Ian's ring" at the bottom); "v v" fix.
- s12 product-rule and a-rows h 140; "dv/dt = 0" y 560 → 596.
- s13 first stack y 220, fraction rows h 130, ends before EQ_S13 comes in (tAll − 12); gravity bars +15 px and in at tG + 14 (after the
  stack's slide); car rows' "=" column 1390 → 1300.
- s14 "radius 34.8 m/s" above the ring (y 128); balance rows: "(in)/(out)" (the colour keys above say inward/outward), pressure sum split
  at "= 0.050 m/s²", column y 470; "worked out: Coriolis movie" under the ring.
- s18 500-hPa tag y 560 → 575 (12 px from the colour bar). s19 the radar credit steps aside during the swing round / close look (the
  stack reached below y 810).
- s20 callouts +14 px (12 px under the bar); box rows: w = 2h|u_r|/r, then the numbers on "two times one thousand"; "r = 30 km …" y 786;
  the section pictures in an overflow-hidden div (the nested-svg crop was invisible to the probe during the radar zoom); the line
  labels fade near the box edge during the zoom; the two credits one after the other.
- s21 / s29 unzoomed globe dist 4.3 → 4.75 about (560, 430): disc r ≈ 369, bottom ≈ 799 (was 880: the credit sat on the disc); country
  names only for the opening view; "Sundarbans" an outlined map label.
- s23 "inflow angle" centred under the arrow tips (was out of the map's left edge); 90 kt row split on "ninety knots"; EQ_S23 and Ian's
  angle row each on two lines (cutAt at "⇒"); "a similar spiral angle" as the keyword on S12; storm labels moved up.
- s24 panels and bar 40 px lower (keywords sat on "height (km)" and 4 px from the bar).
- s26 (u, v) = (22.2 E, 24.3 N) m/s on one row; the length's result on its own line.
- s27 feet rows on two lines; 75 cm row/label and shelf axes moved down; gauge axes 1010 × 680 (date ticks overlapped); "Saint
  Petersburg" centred above its dot.
- s28 relayout: chart 160-760, two-line end labels right of it, notes above the map, Fort Myers inside the map, Saint Petersburg left of
  the map with a leader, colour bar under the map.
- s30 Yangon's name left of its dot; every name on the swipe picture (places, dates, "50 km", "N") fades within 6-30 px of the line.
- s31 the HRRR/ERA5 credit under the bar's "− in / + out". s32 end-card list rows 650 + 46 r (the fifth row reached y 882).
No calculation row removed; nothing below 44 px; every new row tied to a spoken phrase (AT) or its row's frame + 15…20.

## Gates after the last change
tsc 0 · at_check 372 refs, 0 failures · swap_check 381 elements, 0 overlaps, 0 swaps < 8 frames · cam_speed 0 > 90°/s (peak 20°/s s29) ·
eq_check 18/18 · SSR `--step 10` 9213 scene-frames, 0 errors, NaN 0 · SSR `--3d` 9213, THREE guard 922 3-D frames, 0 errors.

## Still to do (after the orchestrator's go-ahead; one Chrome job)
1. `.venv/Scripts/python.exe movies/src/ch00_coordinates_storm/checks/cst_run.py stills k6r3 --bundle --frames-file "<S>/k6r3_frames.txt" --jobs 3`
   then `tools/k6_overlap.py <S>/stills/k6r3 --timing movies/ch00/ch00_coordinates_storm/timing.json --json <S>/stills/k6r3_overlap.json`.
2. Final full pass `stills k6r4 --jobs 3` (4215 frames, ≈ 50 min, bundle unchanged) → 0 hits → render with `K6TAG=k6r4`.
Seen, not fixed (no K6 rule): s18 the stack's left corner and its km ticks leave the frame as the camera orbits to az −76 (ticks at
x −123…−6 by the end); s28 the four date ticks are 12 px apart (pass, but crowded).

## K6 round 1+ addendum: s18/s19 framing and the gauge date ticks (source only, no stills)
- **s18 / s19 stack camera**: dist 12.5 → 16 and principal point (540, 400) → (600, 400) in every non-close-look key (the s19 close look,
  dist 6.8, is unchanged). New check `movies/src/ch00_coordinates_storm/checks/stack_frame.ts` (esbuild-bundled, node) projects the stack's
  8 corners, the height-arrow tip, the tick ends and the s18 km labels with the house `orbitCam` / `projector` every frame. Before:
  s18 stack x −64…1080, km labels x −150…110; s19 x −88…1124, y −17…844. After: s18 stack x 151…1001, y 146…656, km labels x 71…280;
  s19 stack x 124…1044, y 68…727 (close look tLook…tLook+130 excluded: the camera is among the layers on purpose). All inside the
  GlobeFrame box x 40-1068 / y 40-788; labels start ≥ 60. cam_speed: s19 peak 67°/s (was 70), 0 above 90°/s.
- **Gauges date ticks (s27, s28, s31)**: "27 Sep 12 / 28 Sep 00 / 28 Sep 12 / 29 Sep 00" (188-196 px, 12 px apart in s28) →
  "12 UTC / 28 Sep / 12 UTC / 29 Sep" (≈ 140-145 px; ≥ 55 px apart in s28, ≥ 80 in s27, ≥ 95 in s31).
- Gates: tsc 0 · at_check 372 / 0 · swap_check 381, 0 overlaps, 0 swaps < 8 · cam_speed 0 > 90°/s · eq_check 18/18 · SSR 9213 / 0 errors /
  NaN 0 · SSR --3d 9213 / 0 errors. s18, s19, s27, s28, s31 join the k6r3 frame list (rebuild it before shooting).
