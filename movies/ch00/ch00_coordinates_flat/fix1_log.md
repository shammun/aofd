# ch00_coordinates_flat (#5a) — fix loop 1 log (2026-11-05)

Input: `reports/ch00_movies.md` → "#5a ch00_coordinates_flat — build 1, review 1" (6 Must, 14 Should). Every item applied.
Files: `movies/src/ch00_coordinates_flat/{cf_lib.tsx (lib), cf_sA.tsx (A), cf_sB.tsx (B), cf_sC.tsx (C)}`; narration
`script.md`, `storyboard.yaml`, `timing.json`, `en.vtt`, `en.srt`; data `movies/data/build_ch00_coordinates_flat.py`, `manifest.json`.
Not rendered in this loop (resource rule: Part 2's heavy phase runs; K6 stills and the render are scheduled by the orchestrator).
Positions were set from the review-1 frames (`reports/movies/ch00_coordinates_flat/review1/full/`) and computed geometry.

## Narration (six sentences re-voiced, spliced)
`movies/src/ch00_coordinates_flat/checks/cf_fix1_splice.py` (method of `tools/movie_wb/splice_uf2fix3.py`): Kokoro af_bella ×1.0 with the
lexicon, one constant gain per clip to the BS.1770-4 loudness of the nearest unchanged neighbours, 5-ms look-ahead limiter at −1.5 dBTP,
every clip within ±1.5 LU of each neighbour (all pass; re-synthesis correlation 0.9899). The cue rebuild was first checked with no edit:
byte-identical to the build-1 `en.vtt` / `en.srt` (542 cues). Scratch: `G:/…/ch00_coordinates_flat/fix1/tts/`.

| scene · S (1-based) | old → new | Δt | cps |
|---|---|---|---|
| s13 S2 | "…for weather or climate." → "…for weather, climate or maps." | +0.450 s | 16.4 |
| s20 S20 | keep line: "turning the axes changes…" → "turning the axes **by an angle alpha** changes…" | +1.275 s | 14.8 |
| s24 S2 | "If that feels like too much, skip ahead…" → "You don't need these steps for the intuition of weather, climate science or maps, so if that feels like too much, skip ahead…" | +5.125 s | 15.6 |
| s24 S21 | "seven point one minus thirty one point five, about minus twenty four point four" → "seven point one four minus thirty one point four six, about minus twenty four point three" | +0.500 s | 13.9 |
| s24 S23 | "seven point one plus thirty one point five" → "seven point one four plus thirty one point four six" (same inputs as S21), "about thirty eight point six" kept | +0.700 s | 13.7 |
| s25 S12 | "…does it blow a little outward." → "…does it blow outward, by up to about fourteen metres per second." | +2.425 s | 15.9 |

After these six: 2317.225 s. **After U1 (final): 2359.1 s narration** (was 2306.75; +52.35 s), 70 773 frames + 75 hold = 70 848 frames
(39:21.6 with the hold), 381 sentences, **555 cues, 0 warnings**, self-check 0.0 ms. Storyboard synced by `checks/cf_fix1_sync.py` (voiceovers == timing sentences, `t`,
`sentence_times`, `target_duration_s`, fix-1 TTS record, `maths_skip` blocks + chapters from the manifest, s24 `calc_rows`, the
data_block "rounded" line, the colour contract). Skip chips and chapter marks are computed from `timing.json`: skip targets
**12:29, 16:48, 26:47, 34:29** (were 11:47, 16:05, 26:05, 33:39); chapters from s12 on move by 41.9–52.4 s. The narration never speaks a
chip time ("skip ahead to the time on screen"), so no spoken number depends on them.

## User note U1 (11:23) — s11, the "tenth of a degree" check (highest priority)
Problem: 8.7 m appeared with no inputs (no r = 5 km, no s = r Δθ, no 0.1° → rad); "the circle, magnified" showed no circle, station or
before/after balloon; "with no formula at all" was not honest (the 7.0 / 5.2 came from θ̂).
- **Narration** (`checks/cf_fix1b_splice.py`, same leveling method; block neighbours S15/S20 at −15.81 LUFS, all nine clips within ±1.5 LU,
  TP ≤ −1.59 dBTP): s11 S16–S19 (four sentences, 24.2 s) → nine sentences (66.1 s, +41.875 s), with a [beat] after each worked number:
  "And one last check, without using the theta hat formula. / The balloon is five kilometres from the station: three kilometres east and four
  north. / Turn it by a tenth of a degree. / In radians, that's a tenth times pi over one hundred and eighty, about zero point zero zero one seven
  four five. [beat] / By the arc rule, s equals r times theta, so it slides five thousand metres times that: about eight point seven metres along
  the circle. [beat] / Its position comes from x equals r cosine theta, and y equals r sine theta. / It moves from three thousand metres east and
  four thousand metres north, to about two thousand nine hundred and ninety three, and four thousand and five point two. / That's about seven
  metres west, and five point two metres north. [beat] / Dividing each by eight point seven gives about minus zero point eight and zero point six:
  theta hat again." (The spoken radian value is 0.001745, as on screen; "cosine"/"sine" per the spoken-symbol rule.)
- **Picture** (B: S11, `U1`, `arcU1`): from S16 a wide view — station at the origin, the 5-km circle, dashed east ray, the radius "r = 5 km",
  "θ ≈ 53°", the balloon "(3 km, 4 km)"; on S17 a gold zoom box round the balloon with two connector lines to a framed inset "magnified"
  (25 px per metre): the circle's own arc (radius 5000 m drawn exactly, straight to the eye), r̂ at the balloon, "before" and "after 0.1°";
  on "eight point seven" the gold 8.7-m slide with its label; on "seven metres west" / "five point two" the dashed legs "7.0 m" / "5.2 m";
  a gold tick on "theta hat again". Keyword "without the θ̂ formula" on S16.
- **Column**, one line per phrase (coordinator's arithmetic list): Δθ = 0.1° = 0.1 × π/180 ≈ 0.001745 rad · s = r Δθ = 5000 m × 0.001745 ≈ 8.7 m ·
  (x, y) = (r cos θ, r sin θ) · before, 53.13° = (3000, 4000) m · after = 53.13° + 0.1° = 53.23° · x = 5000 × cos 53.23° = 5000 × 0.598603 ≈ 2993.0 m ·
  y = 5000 × sin 53.23° = 5000 × 0.801046 ≈ 4005.2 m · Δx = 2993.0 − 3000 = −7.0 m (west) · Δy = 4005.2 − 4000 = +5.2 m (north) ·
  √(7.0² + 5.2²) = √76.04 ≈ 8.7 m = s · (−7.0, 5.2)/8.7 ≈ (−0.80, 0.60) = θ̂.
  Note: the coordinator's 4-decimal sin 53.23° = 0.8010 gives 5000 × 0.8010 = 4005.0, not 4005.2, so the screen shows 6 decimals
  (0.598603, 0.801046), which reproduce 2993.0 and 4005.2.
- **Data**: build DF09 gains 5 U1 rows (0.001745 rad and 8.73 m; before (3000, 4000); after θ 53.23°, (2993.0, 4005.2); cos/sin 0.598603 /
  0.801046 and √76.04 = 8.72; moved −7.0 / +5.2) → **63/63 CHECK**; `cf.json` gains `plane.before_m`, `after_m`, `th_after`; the TSX re-asserts
  every U1 screen number (`CHECK_U1`, 17 rows).

## Must
| id | scene | change | where |
|---|---|---|---|
| M1 | s19 | the flipped table is relabelled: rows **e′₁, e′₂**, columns **e₁, e₂** (the old labels fade at tFlip+8, before the cells move; the new ones come at tFlip+50, after they arrive: a gapped swap, 0 overlaps in swap_check). Every cell still reads C_ij = e_i · e′_j: row e′₂, column e₁ holds −sin α = C₁₂, as derived 80 s earlier | B: S19 labels |
| M2 | s24, s22 | on-map labels are full opacity while live, **50 px (s24) / 56 px (s22) bold KaTeX (`\boldsymbol`) with a dark halo** (haloW 0.11–0.12 → 6 px), at explicit spots in open water off their arrows and the coast: 0° both inside the ring between the eye and the arrows; 90° u_θ left of its arrow tip (24 px clear), u_r beyond its tip below the eye; 135° u_r outward up-left, u_θ beyond its tip down-left. The strings come from one table `LAB24` (CHECKed against the data). Degree labels 90°/135° moved outward (no more "135°90°" crowding). s22 tags u_r / u_θ beside their own arrow's middle, away from the other arrow and the coast | C: `LAB24`, `lab24`, S24 labels; S22 tags |
| M3 | s25 (+ s00, s03, s27) | s25: `SpeedBar` at (1480, 200) beside the map, between the keyword and the graph; the graph is 70 px lower and 70 px shorter (A y 300, h 300; ticks, legend unchanged). s27: `SpeedBar` in the text column under the beat-9 key while the mini map shows. s00 title map and s03 thumbnail: new compact bar `SpeedBarCompact` (bar 200 × 18, ticks 0/25/50 at 44 px, "wind speed (m/s)") under the source line; the s03 thumbnail and the radar panel are 40 px shorter to make room (bar ticks end ≤ y 860) | C: S25, S27; A: S00, S03; lib: `SpeedBarCompact` |
| M4 | s17 | "(x′, y′) = (4.6, 1.96)" is now two lines "(x′, y′)" / "= (4.6, 1.96)" above the arrow tip, ending at x ≈ 912 (asserted ≤ 1000 at module load); "(3, 4)" keeps its place until it hands over | B: `S17L`, S17 |
| M5 | s22 | the conversion line is `1 m/s = 3600 m/h = 3.6 km/h` at 48 px (was the dimensionally wrong "3600 s / 1000 m = 3.6" at ≈ 32 px); storyboard `calc_rows` updated | C: S22 |
| M6 | QA | not run in this loop (needs the fixed render). To run after the render: `tools/movie_qa.py … --storyboard … --captions movies/ch00/ch00_coordinates_flat/en.vtt --manifest movies/ch00/ch00_coordinates_flat/manifest.json` and record 15/15 | — |

## Should
| id | scene | change | where |
|---|---|---|---|
| S1 | s13, s14, s27 (+ s20) | one colour per quantity everywhere: **radial u_r rose, tangential u_θ teal**. s13: u_r band, "u_r = 6", "u_r: along r̂" rose; u_θ band teal with the hatch kept for the negative value, "u_θ = −8", "u_θ: along θ̂", the clockwise arc and "clockwise, seen from above" teal. s14: "6 r̂" band/arrow rose, "−8 θ̂" teal. s27 beat 6: the r̂ shadow rose, the θ̂ shadow teal. s20 "x′ = u_r, y′ = u_θ" in ink (was all teal). Storyboard colour contract rewritten | B: S13, S14, S20; C: S27 |
| S2 | s23 | "what do they mean?" stays until "square root" (no empty column); the √ row appears on "square root" with a phantom "≈"; "≈ 37 m/s" appears on "thirty seven" (a cont row), and the tip label "≈ 37 m/s" on the same word; the dashed resultant arrow on "an arrow" | C: S23 |
| S3 | s24 | one value everywhere: u_r = **−24.3** (data −24.32; 7.14 − 31.46 = −24.32) on the map, in the column, in the summary and in the voice; u_θ = **38.0** at 0° on the map, the column and the summary; 38.6 at 135° from the same 7.14 + 31.46. CHECK rows added in the TSX (7.14, 31.46, −24.32, 38.60, outflow max ≈ 14) and the build's DF24 row now checks 7.14 / 31.46 / −24.32 / 38.60 and data u_r ≈ −24.3 | C: CHECK_C, `LAB24`, S24; build DF24 |
| S4 | s25 | re-voiced: "only on the southwest side does it blow outward, by up to about fourteen metres per second" (DF25: max +14.15 m/s at 220°, positives at 185–250°) | script, storyboard |
| S5 | s13, s24, all chips | s13 S2 and s24 S2 re-voiced (weather, climate, maps); the chip reads **"every step · optional" / "skip to mm:ss"** | lib: `SkipChip`; script |
| S6 | s20 | keep line re-voiced: "turning the axes by an angle alpha changes…" | script, storyboard |
| S7 | s08, s09 | a dashed east ray (muted) from the station in both; s08 draws the radius from its first frame (5:38) | B: S08, S09 |
| S8 | s09 | the inset has no box; its arrows are labelled "slide" (gold) and r̂ (orange); it moved to the lower right (centre point (860, 820)): every part ≥ 50 px off the circle; "5.1 km" above its ghost tip, "4.9 km" below-left of its own; "slide" hides while the ghost arrows show | B: S09 |
| S9 | s03 | the axes are muted (new `c` prop on `AxesEN`, default unchanged), the unit arrows thicker (w 9, head 32); ŷ label beside the shaft (x 326, y 645), clear of tick "1" | lib: `AxesEN`; A: S03 |
| S10 | s03 | "same everywhere" places moved inside the panel and off the axes: (5.3, 1.5), (1.6, 4.6), (1.2, 2.2), (4.6, 4.4) (x̂ tips ≤ 6.3 km = x 930); once the balloon starts moving it becomes the diagram dot (as s08+), so its unit pair no longer covers the icon | A: S03 |
| S11 | s02 | the gold origin dot appears on "a starting point" (33.9 s) and pulses on "origin" | A: S02 |
| S12 | s18 | "top row: … ≈ 4.60" | B: S18 |
| S13 | s27 | recap grid: centre lines orange (w 5), others muted at 60 % (was near-background) | C: S27 |
| S14a | all Ian pictures | source line shortened to "Data: HRRR analysis (NOAA) · 28 Sep 2022, 18 UTC · centre: model's calm eye, ≈ 17 km SW of radar eye": two lines, no orphan, at every width used (690–1100 px); s27 source width 620 → 720 px (it would wrap to three lines at 620) | lib: `IAN_SRC`; C: S27 |
| S14b | s22 | the "−13 m/s: in" link now arrives from below the ring point (control point 170 px under it), no longer crossing the teal shaft | C: S22 |
| S14c | s14 | r̂ and θ̂ tip labels shown (80 %) through the rebuild | B: S14 |

## Checks run (no browser)
- `movies/data/build_ch00_coordinates_flat.py --public …/build1/public`: **63/63 CHECK pass** (58 + 5 U1); speed PNG byte-identical; `cf.json`
  changed only by the three U1 fields; manifest chapters / maths_skips / checks updated from the new timing.
- `npx tsc --noEmit`: 0 errors. `at_check`: 353 timing references, 0 failures. `swap_check` (regex fix applied: `/^(?:export )?const (\w+)/`):
  318 text elements, 0 text-over-text pairs, 0 swaps with a gap < 8 frames. `cam_speed` (same regex fix): 0 cameras above 90 °/s.
  `eq_check`: 23 storyboard equations, none missing, none unused.
- SSR `run.mjs --step 10`: 8512 scene-frames, 0 errors, 0 NaN frames; `--3d`: 8512 scene-frames, 0 errors; assets: none missing.
- script.md == timing sentences in all 29 scenes; storyboard voiceovers == timing (sync script check).

## Frames that change (for a targeted K6 + re-render)
Content changed: s00, s02, s03, s08, s09, s11 (U1), s13, s14, s15 (chip), s17, s18, s19, s20, s22, s23, s24, s25, s27.
Timing: unchanged up to s11 S15 (t < 681.85 s); from s11 S16 on everything shifts (+41.875 s, then +42.325 after s13 S2, +43.6 after s20 S20,
+48.725 / +49.225 / +49.925 inside s24, +52.35 from s25 S13). So everything from s11 S16 on must be re-rendered; before it only s00, s02, s03,
s08, s09 and the first 82 s of s11 changed (s01, s04–s07, s10 are frame-identical).

## Sound mix: NOT re-run (pending, scheduled by the orchestrator)
A first re-mix on the six-sentence narration was started after Part 2's mix ended and stopped when U1 arrived (it would have been stale).
It was not re-run on the U1 narration because Part 2's K6 stills (Chrome ×13) were running with 17 GB RAM free, and the C-item half of this
fix loop will change the narration again. Command (music identical: ice-polar seed 23, cue sheet `sound.yaml` validated with --check-only):
`.venv/Scripts/python.exe tools/sound/mix.py --narration "G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_flat/fix1b/tts/narration.wav"
--cues movies/ch00/ch00_coordinates_flat/sound.yaml --out-dir "G:/…/ch00_coordinates_flat/build1/sound5"`, then rename `narration_music.wav` →
`narration_music_cf.wav` (`cf_render.sh` / `cf_run.py join` now read `build1/sound5`, override with `SND=`; `cf_render.sh` QA now passes
`--captions`, `--manifest`, `--sound-cues`).

## Re-running after more narration changes (C-items)
Narration splices chain: `cf_fix1_splice.py` (build1/tts4 → fix1/tts) → `cf_fix1b_splice.py` (fix1/tts → fix1b/tts); a next splice copies
`cf_fix1b_splice.py` with OLD = fix1b. After any splice: `build_ch00_coordinates_flat.py --public …/build1/public` (manifest chapters +
maths_skips from timing.json) → `checks/cf_fix1_sync.py` (idempotent: storyboard voiceovers, t, sentence_times, skip blocks, chapters) →
`checks/cf_static.sh` (+ `ssr/run.mjs --3d`). Skip chips and keepTime read timing.json at render time.


# fix 1c — calculation audit (2026-11-05)

Input: `reports/ch00_movies.md` → "#5a ch00_coordinates_flat — calculation & sync audit" (C1–C43, 18 Must). Start: commit a09efd7 (fix 1a + U1).
Rules applied: one move per line, each line revealed on its spoken words (`AT`; at_check 460 refs, 0 failures); every new number has a CHECK row
in the build (DF28, 13 rows) and in the owning TSX (CHECK_A +9, CHECK_B +17, CHECK_U1 +2, CHECK_C +29); added steps sit inside the optional
blocks where the audit put them; outside them each addition is one short row.

## Narration (`checks/cf_fix1c_splice.py`, fix1b/tts → fix1c/tts)
37 timing sentences replaced by **compound entries**: the new text may hold several spoken sentences, each its own Kokoro clip (af_bella ×1.0,
lexicon) joined with the house 0.35-s gap, so every scene keeps its sentence count and every `SS`/`AT` index in the TSX stays valid. Each clip
is levelled to the BS.1770-4 loudness of the nearest unchanged neighbours (all within ±1.5 LU); 5-ms look-ahead limiter at −1.5 dBTP plus a
small gain trim when an inter-sample peak slipped past it (the first run stopped on s18 S9 part 2 at −1.16 dBTP; fixed by the trim, no
tolerance loosened). Raw Kokoro output is cached per sentence (`fix1c/tts/cache/`), so a re-run costs seconds. The limiter took up to 8.3 dB
off single peaks of a few clips (listen at QA).
Result: **2618.175 s narration** (+259.1 s; 78 546 frames + 75 hold = 78 621, **43:40.7** with the hold), 381 sentences, **619 cues,
0 warnings**, self-check 0.0 ms. Skip chips **14:11, 18:39, 29:42, 38:43**; chapters regenerated in the manifest and the storyboard.

## Per item
| C | Must | scene · S | narration | screen / picture | file |
|---|---|---|---|---|---|
| C1 | | s03 S3 | + three steps / four steps | 3x̂ = 3(1,0) = (3,0); 4ŷ = 4(0,1) = (0,4); (3,0)+(0,4) = (3,4); gold x̂ ×3 and ŷ ×4 tip to tail on their words | A S03 |
| C2 | yes | s04 S3 | squares spoken | √(3²+4²) → √(9+16) → √25 → 5 km; gold "3 km" / "4 km" on the legs, right-angle mark | A S04 |
| C3 | yes | s04 S6 | tangent defined, inverse said | tan θ = north side/east side = 4/3 ≈ 1.333; θ = tan⁻¹(1.333) ≈ 53.13° ≈ 53°; the legs pulse on "north side" / "east side" | A S04 |
| C4 | yes | s05 S7 | cos/sin defined; 3/5, 4/5 | cos θ = east side/r = 3/5 = 0.6; sin θ = north side/r = 4/5 = 0.8; x = r cos θ = 5×0.6 = 3; y = 5×0.8 = 4; "(θ ≈ 53.13°)"; "= 3 km" / "= 4 km" on the legs | A S05 |
| C5 | | s07 S6 | 2π ≈ 6.28; 360 ÷ 6.28 | 2π rad = 360°, 2π ≈ 6.283; 1 rad = 360°/2π = 360°/6.283 ≈ 57.3° | A S07 |
| C6 | | s07 S8 | "about eleven and a half degrees" | 0.2 rad ≈ 0.2×57.3° ≈ 11.5°; 10 km/1 km = 50 km/5 km = 10; wedge "0.2 rad", inner arc thickened with a gold ring | A S07 |
| C7 | yes | s08 S7 | "we draw r hat at the balloon…" | r̂ = (3,4)/5 → (3/5, 4/5) → (0.6, 0.8); ghost r̂ at the balloon from S3; the shrinking arrow reads "5", then "1"; tip "(0.6, 0.8)" | B S08 |
| C8 | | s08 S8 | squares and √ spoken | √(0.6²+0.8²) → √(0.36+0.64) → √1 = 1 (the stack leaves before S10) | B S08 |
| C9 | | s09 S10 | 5.1 / 4.9 km said | 5+0.1 = 5.1 ≠ 5; 5−0.1 = 4.9 ≠ 5; rejected stub labelled "clockwise: θ shrinks" | B S09 |
| C10 | | s10 S8–S9 | — | 40 % ghost of the unturned p, q steps and a gold dashed 90° arc to the turned ones | B S10 |
| C11 | yes | s10 S11 | the two products and the adds | → p(0,1)+q(−1,0) → (0,p)+(−q,0) → (0−q, p+0) → (−q, p) | B S10 |
| C12 | | s10 S16 | squares spoken | √((−4)²+3²) → √(16+9) = √25 = 5; |(3,4)| = √(9+16) = 5 | B S10 |
| C13 | | s11 S3–S4 | (kept) | (p,q)→(−q,p) and p = cos θ, q = sin θ under θ̂ = (−sin θ, cos θ) (the keyword they replace is removed) | B S11 |
| C14 | | s11 S6–S8 | (kept) | 30 % ghost of r̂'s triangle; the gold 90° arc stays, with a head; "sin θ, pointing west" with a gold link to −sin θ | B S11 |
| C15 | | s11 S10, S12 | substitutions spoken | θ = 0°: (−sin0°, cos0°) = (0,1); 90°: (−sin90°, cos90°) = (−1,0); θ ≈ 53.13°: (−0.8, 0.6); |θ̂| = √((−0.8)²+0.6²) → √(0.64+0.36) = 1; r̂ drawn beside θ̂ for the dot product | B S11 |
| C16 | | s11 U1 | (U1) | r = 5 km = 5000 m before s = rΔθ; "θ ≈ 53.13°" in the wide view; √(49+27.04); −7.0/8.7 ≈ −0.80 and 5.2/8.7 ≈ 0.60 as separate lines, then θ̂ ≈ (−0.80, 0.60) | B S11 |
| C17 | | s12 S2–S4 | — | θ = 0°/90°/180°: r̂ and θ̂ each a line with the substitution; "θ = 0° / 90° / 180°" at the balloon as it stops | B S12 |
| C18 | | s13 | — | locator (station, 5-km circle, balloon at 53°, gold box with a dashed lead to the close-up); "10 m/s / due east" on its words; "r̂, θ̂: length 1 · wind: its own scale" | B S13 |
| C19 | yes | s14 S4 | double minus spoken | 6r̂ = 6(0.6,0.8) = (6×0.6, 6×0.8) = (3.6,4.8); −8θ̂ = −8(−0.8,0.6) = ((−8)(−0.8), (−8)(0.6)) = (6.4,−4.8) | B S14 |
| C20 | | s14 S8 | squares spoken | √(6²+8²) = √(36+64) → √100 = 10 m/s; |(10,0)| = √(10²+0²) = 10 m/s | B S14 |
| C21 | | s15 S14 | √3/2 spoken | cos 30° = √3/2 = 1.732/2 ≈ 0.866; sin 30° = ½ = 0.5; the triangle is now drawn on the x̂′ arrow itself (it was on the 3-km point, so its "cos α / sin α" legs were really 3 cos α / 3 sin α) and reads "cos α ≈ 0.866", "sin α = 0.5" | B S15 |
| C22 | | s16 S3–S4 | — | (p,q)→(−q,p); p = cos α, q = sin α; then (cos α, sin α) → (−sin α, cos α); legs "cos α (north)", "sin α (west)" | B S16 |
| C23 | yes | s16 S8 | −0.433 + 0.433 spoken | ŷ′ = (−sin30°, cos30°) = (−0.5, 0.866); √((−0.5)²+0.866²) = √(0.25+0.75) = 1 (0.866² ≈ 0.75, exactly ¾); 0.866×(−0.5)+0.5×0.866 = −0.433+0.433 = 0 | B S16 |
| C24 | | s17 S15 | squares spoken | √(4.6²+1.96²) → √(21.16+3.84) → ≈ √25 = 5 km; keyword "shadows on the new axes" from S6 | B S17 |
| C25 | | s18 S7 | — | top row: cos α·x + sin α·y = x′; bottom row: −sin α·x + cos α·y = y′, each on its words (the matrix rows still light gold) | B S18 |
| C26 | | s18 S9 | bottom row spoken | 0.866×3+0.5×4 = 2.598+2 ≈ 4.60 = x′; −0.5×3+0.866×4 = −1.5+3.464 ≈ 1.96 = y′ | B S18 |
| C27 | yes | s18 S11, S14 | dot-product rule; the two other angles | â·b̂ = |â||b̂| cos γ = 1×1×cos γ = cos γ; x̂′·x̂ = cos α; x̂′·ŷ = cos(90°−α) = sin α; ŷ′·x̂ = cos(90°+α) = −sin α; ŷ′·ŷ = cos α; α = 30°: cos 60° = 0.5, cos 120° = −0.5; gold arcs "90° − α", "90° + α" | B S18 |
| C28 | | s19 S9 | product spoken | C₁₁…C₂₂: (1,0)·(…) then 1·… + 0·… term by term | B S19 |
| C29 | yes | s19 S16, S18 | number checks spoken | x′_j = x_i C_ij means x′_j = Σ_{i=1}^{2} x_i C_ij; j = 1 and j = 2 in four lines each, ending ≈ 4.60 ✓ / ≈ 1.96 ✓ (grid 20 px shorter) | B S19 |
| C30 | yes | s20 S7–S10 | — | inputs name θ (cos θ = 0.6, sin θ = 0.8); x′ = … = 6+0 = 6; y′ = … = −8+0 = −8; the 10 m/s wind drawn at the balloon with its shadows "6" (rose on r̂) and "−8" (teal hatch on θ̂) | B S20 |
| C31 | yes | s20 S17–S19 | — | the same turned pair α = 53° (muted, dashed) at θ = 0°, 53°, 150°, then the polar pairs bright; "turned axes: α = 53° everywhere", "polar: θ = 0°, 53°, 150°"; y′ label moved off the 150° pair | B S20 |
| C32 | yes | s22 S6, S10 | sums and ÷ 72 spoken | 360°÷5° = 72 points; a running "sum so far" while the ring dots light gold; ū_θ = 2505.9/72 ≈ 34.8 ≈ 35; ū_r = −957.2/72 ≈ −13.3 ≈ −13 | C S22 |
| C33 | | s22 S14–S15 | 69 m/s and the ring maximum 49 spoken | 135 kt × 1.85 ≈ 250 km/h; 250 ÷ 3.6 ≈ 69 m/s; "strongest on our ring ≈ 49 m/s" | C S22 |
| C34 | yes | s23 S5 | squares spoken | √(35²+13²) → √(1225+169) → √1394 ≈ 37.3 → ≈ 37 m/s (the arrow of the two averages; never called "the wind speed") | C S23 |
| C35 | yes | s23 S10 | 1923 s and ÷ 60 spoken | 25 km = 25 000 m; t = 25 000/13 ≈ 1923 s ≈ 1923/60 min ≈ 32 min | C S23 |
| C36 | yes | s23 S11 | 4490 s spoken | 2π×25 km = 2×3.1416×25 ≈ 157 km = 157 000 m; t = 157 000/35 ≈ 4490 s ≈ 75 min; a gold lap sweeps the ring, "157 km" | C S23 |
| C37 | | s23 S13 | "in any stretch of time…" | distance round/distance in = 35t/13t = 35/13 ≈ 2.7 | C S23 |
| C38 | yes | s24 S16 | −u × 1, the double minus spoken | 0°: (−8.7)(1)+(38.0)(0) = −8.7; −(−8.7)(0)+(38.0)(1) = 38.0; 90°: (−16.9)(0)+(−37.4)(1) = −37.4; −(−16.9)(1)+(−37.4)(0) = +16.9 | C S24 |
| C39 | | s24 S19 | "45 degrees short of due west", 1/√2 | cos 135° = −cos 45° = −1/√2 ≈ −0.707; sin 135° = sin 45° = 1/√2 ≈ 0.707; r̂ at 135° with equal west and north legs | C S24 |
| C40 | yes | s24 S22 | −(−10.1) spoken | u_θ = −(−10.1)(0.707) = 10.1×0.707 + (−44.5)(−0.707) = 7.14+31.46 ≈ 38.6 | C S24 |
| C41 | | s25 S10–S12 | — | "17", "47", "mean 35", "−40", "+14", "mean −13" on their words; rose band 185–250° "14 out"; keyword "72 − 14 = 58 points in" | C S25 |
| C42 | | s25 S7 | — | gold rings and values on the three phrases: v ≈ +38 (0°), v ≈ −46 (180°), u ≈ +25 (270°) | C S25 |
| C43 | yes | s26 S4–S5 | tangent rule and inverse spoken | tan(inflow angle) = opposite/next to it = in/round = 13.3/34.8 ≈ 0.38; inflow angle = tan⁻¹(0.38) ≈ 20.9° ≈ 21°; legs "34.8 round" (teal) and "13.3 in" (rose) | C S26 |

Not done exactly as written (judgement): C25's gold sweep is the existing gold row highlight; C27's gold links from the arcs to the matrix
entries are replaced by the arcs' own labels; C18's locator is a corner sketch with a gold lead, not a framed zoom. The storyboard
`calc_rows` were updated for s11, s18, s22 and s24 only; the new rows of the other scenes live in the TSX (eq_check covers the 23
storyboard equations, all present).

## Checks (no browser)
- Data build: **76/76 CHECK** (63 + 13 DF28); `cf.json` gains `ian.sum_vt`, `sum_vr`, `ring_vmax`.
- tsc 0 · at_check 460 references, 0 failures · swap_check 367 text elements, 0 overlaps, 0 swaps < 8 frames · cam_speed 0 · eq_check 23/23 ·
  SSR `--step 10` 9296 scene-frames, 0 errors, 0 NaN; `--3d` the same.
- script.md = timing in all scenes; storyboard voiceovers = timing (sync check).

## Re-render and mix
- The narration timing first changes at **s03 S3, 1:34.6 (frame 2838)**. With fix 1a's picture changes (s00 compact bar; s02 origin dot at
  0:33.9) the re-render starts at **frame 0** (whole movie).
- Final mix NOT run: 17.4 GB RAM free (< 18 GB rule), although no Remotion/Chrome job was running. Command (music identical, ice-polar seed 23;
  cue sheet passes `--check-only`):
  `.venv/Scripts/python.exe tools/sound/mix.py --narration "G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_flat/fix1c/tts/narration.wav" --cues movies/ch00/ch00_coordinates_flat/sound.yaml --out-dir "G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_flat/build1/sound6"`
  then rename `build1/sound6/narration_music.wav` → `narration_music_cf.wav`. `cf_render.sh` and `cf_run.py join` now default to `sound6`.

# K6 after fix 1c (2026-11-05)
Input: orchestrator run k6c1 (bundle of 3c1ec65, 3654 frames, `tools/k6_overlap.py` without `--timing`): FAIL, 3165 hits. Build-1 practice
(k6r1 → k6r4) runs the gate with `--timing movies/ch00/ch00_coordinates_flat/timing.json` (k6r4: 0 hits, 124 cross-fade text-text as INFO);
k6c1 with `--timing`: **2929 hits in 85 distinct faults** (text-stroke 1218, edge 974, text-fill 250, text-cbar 259, text-text 228). The
236 hits that `--timing` removes are the 10-frame scene cross-fades (both scenes' axes / source lines drawn at once).
Only the scene files changed (cf_sA/B/C.tsx); cf_lib.tsx, the house kit, audio, narration and timing are untouched.

## Rounds (all `--timing`; stills `cf_run.py stills TAG --jobs 3`)
| tag | frames | scope | hits |
|---|---|---|---|
| k6c1 | 3654 | full (orchestrator) | 2929 (3165 without `--timing`) |
| k6c2 | 2738 | the 17 changed scenes + 16 frames into the next scene (`k6c2_frames.txt`) | 706 (s04 slide, s11 "before", s12/s16/s24 rows still too wide, s15 fractions, s24 slide) |
| k6c3 | 1482 | the 7 scenes changed again (`k6c3_frames.txt`) | **0** |
| **k6c4** | **3654** | **full, final** | **0 (PASS, 685 INFO)**; without `--timing` 168, all in 39 frames within ±10 of a scene cut (cross-fades) |
Lesson: the `edge` box in the K6 json is the first glyph past 1842, not the row's end: real row ends were up to x 2069 (s24 90° u_r);
measure `max(r[2])` over the block before choosing a split or a size.

## Fixes (scene · what · how)
- **s04** θ = tan⁻¹ row split (`=tan⁻¹(1.333)` / `≈53.13°≈53°`, the second on "fifty three"+20); fraction rows h 110/100 → 132/128;
  "anticlockwise, seen from above" y 700 → 820, now `win(tAnti, tPol−18)` (the stack reaches y 717 before it slides); the r formula
  `r=√(x²+y²)` leaves at "fifty three"−12 with the r rows, so the rows sliding out over the stack's top never cross it.
- **s05** fraction rows h 110 → 132 (cos/sin θ over r touched their 3/5, 4/5 lines).
- **s10** "q west" (after the turn) at the west end of its step above "(−q, p)", off the gold 90° arc and the teal arrow.
- **s11** turned label "sin θ, pointing west" from x 185 (right of the θ̂ tip label), gold link from its right end; the reference circle
  0.55 → 0.45 opacity (background line); θ = 0° / 90° rows split at the result (`=(0, 1)` on "zero, one", `=(−1, 0)` on "minus one, zero");
  U1: "θ ≈ 53.13°" under the east ray inside the circle, inset frame x 570 → 540, w 420 → 450 ("5.2 m", "before" inside it); U1 column "="
  1250 → 1290, two lines visible (tallest pair 6 rows, y 370-760), x / y / Δx / Δy rows split at "=" / "≈" (+20…+50 frames).
- **s12** rows split at their results (180° rows ran to x 1980), two lines visible (the stop being spoken stays); **sync fix:** the balloon
  now waits at each stop for its sentence and moves in the sentence's last 40 frames (it used to leave 10 frames after "Due east", so the
  "θ = 0°" label rode along to 89°); stop labels 100 px inside the circle, shown while the balloon is at the stop.
- **s13** "shadow" 22 px lower (it touched "due east").
- **s14** `6r̂` row: `=(6×0.6, 6×0.8)` on "zero point six, zero point eight", `=(3.6, 4.8)` on "three point six".
- **s15** "cos α" starts right of the turned y′ ruler (x O+48), "sin α" 40 px right (clear of the α label); √3/2 rows h 100 → 140/130.
- **s16** rulers 0.55 → 0.45 opacity; "cos α (north)" right of its leg near the top (above x̂′), "sin α (west)" above its leg from the
  west end; x̂′ tip label beyond/below the tip; column "=" 1300 → 1240; x̂′·ŷ′ row split (`+0.5×0.866` on "plus zero point five times").
- **s18** "top/bottom row" 48 → 44 px; number matrix y 640 → 582 and the two products as a "="-aligned CalcStack (`x′ = 0.866×3+0.5×4`
  / `=2.598+2≈4.60` on "four point six again", `y′ = …` / `=−1.5+3.464≈1.96` on "one point nine six"); α = 30° row split; "90° + α"
  beside the arc's end, left of the ŷ′ arrow.
- **s19** both j-columns "=" 1250 → 1190.
- **s20** x′ / y′ as a CalcStack split at the results ("which is six", "which is minus eight"); `x′=u_r, y′=u_θ` y 625 → 750.
- **s22** ū_θ and ū_r on two lines each (division, then `≈34.8≈35 m/s` / `≈−13.3≈−13 m/s` under it, +20 frames); the m/s → km/h line 48 → 44 px.
- **s24** 0° / 90° rows split at their results ("minus eight point seven", "thirty eight", "minus thirty seven point four", "makes plus"),
  "=" 1250 at 44 px; cos 135° on two lines (`=−1/√2≈−0.707` on "minus one over"); the 135° work as two pages (u_r fades at u_θ's
  sentence −14 frames, u_θ in the same place, y 590) instead of one sliding stack; "west" at the leg's west end; the 0°/90°/135° tags
  come back only after their point's labels have gone (`fin(end)`).
- **s25** keywords y 110 → 96 (12 px clear of the colour bar); "v ≈ −46" above its ring between the curves, "u ≈ +25" up-left of its ring;
  "mean −13" under the rose curve right of "14 out".
- **s26** `=13.3/34.8≈0.38` y 370 → 400; the inverse on two lines (`≈20.9°≈21°` on "twenty one degrees").
No calculation row was removed; nothing below 44 px; every new row is tied to a spoken phrase (`AT`) or its row's frame + 15…50.

## Gates after the last change
tsc 0 · at_check 474 references, 0 failures · swap_check 367 text elements, 0 overlaps, 0 swaps < 8 frames · cam_speed 0 · eq_check 23/23 ·
SSR `--step 10` 9296 scene-frames, 0 errors, 0 NaN. Data build not touched (76/76 CHECK unchanged).
Re-render: picture changes in s04, s05, s10-s16, s18-s20, s22, s24-s26 (from 2:08, frame 4304); audio unchanged (sound6 mix).
Known, accepted: CalcStack's own slide (old lines fade while sliding up 12 frames) can cross text above a stack for 2-4 frames between
K6 samples (seen in s05 under "(θ ≈ 53.13°)"); s04 and s24 were changed where K6 caught it.


# fix 2 — review 2 (2026-11-05)

Input: `reports/ch00_movies.md` → "#5a ch00_coordinates_flat — fix 1, review 2" (5 Must, 13 Should). Start: commit 80af52e (fix 1c + K6).
Every item applied. Not rendered (no stills, K6 or render in this loop; the orchestrator schedules them).

## Narration (`checks/cf_fix2_splice.py`, fix1c/tts → fix2/tts; method of cf_fix1c_splice.py)
| item | s11 sentence | old → new | Δt | LUFS (neighbours) | TP |
|---|---|---|---|---|---|
| Must 2b | S20 | "s equals r times theta" → "s equals r times **the change in** theta" | +0.850 s | −15.93 (−15.85 / −15.99) | −1.82 dBTP |
| Must 2a | S23 | "That's about seven metres west, and five point two metres north." + "Check: seven squared is forty nine, and five point two squared is twenty seven point zero four." + "The square root of seventy six point zero four is about eight point seven: the same slide." (compound entry, 3 clips, 0.35-s gaps) | +13.675 s | −15.90 / −15.89 / −15.87 (−15.85 / −15.84) | ≤ −1.63 dBTP |

Result: **2632.700 s narration** (+14.525 s), 78 981 frames + 75 hold = 79 056 (**43:55.2**), 381 timing sentences, **623 cues, 0 warnings**,
self-check 0.0 ms. Timing unchanged before s11 S20 (807.425 s = 13:27.4); after it everything shifts +0.850 s, then +14.525 s after S23.
Skip chips **14:26, 18:53, 29:57, 38:58** (were 14:11, 18:39, 29:42, 38:43); chapters from s12 move +14.5 s (manifest + storyboard).
Sync: `cf_fix1_sync.py` now also reads `spliced_fix2` (idempotent); the s11 calc_rows duplicate-append of earlier runs is fixed (18 rows).

## Must
| id | scene | change |
|---|---|---|
| M1 | s11 S25 | the U1 wide view, inset, column, tick and link fade at the keep line (−10 f); the keep picture comes in: the balloon on its circle (station, east ray, θ arc), r̂ out on "r hat points away", θ̂ round on "theta hat points round", the gold +90° arc and "+90°" on "turned by ninety", an anticlockwise arc on the circle; the right column keeps r̂ = (cos θ, sin θ) and θ̂ = (−sin θ, cos θ) and adds "θ̂ = r̂ turned by +90°" (EQ_S09) and "anticlockwise, seen from above" |
| M2a | s11 U1 | √ rows on the new spoken check: "length = √(7.0² + 5.2²)" on "seven squared", "= √(49 + 27.04)" on "twenty seven point zero four", "= √76.04" on "The square root of seventy six", "≈ 8.7 m = s" on "is about eight point seven" (short left side "length": measured x ≥ 1156) |
| M2b | s11 U1 | re-voiced "s equals r times the change in theta" (matches s = rΔθ); the row's AT phrase follows |
| M2c | s11 U1 | "before: θ ≈ 53.13°" and "(x, y) = (3000, 4000) m" as two "="-aligned rows (left sides measured from x 1108) |
| M2d | s11 U1 | the gold tick right of "θ̂ ≈ (−0.80, 0.60)" (x 1660, the row's centre y 468) and a gold link up to θ̂ = (−sin θ, cos θ) |
| M3 | s03 S3 | the sum row is "3x̂ + 4ŷ = (3, 0) + (0, 4) = (3, 4)", "=" column 1240 → 1272: measured x 1079.6-1837.5 (it started at x 922, over the panel) |
| M4 | s22 S6/S10 | each running sum on two lines ("sum so far: … m/s" / "61 of 72 points"); the ū_r division in its own slot (y 688, top ≥ 24 px under "seen from above, NH"), up through S10-S11; the result row "ū_r ≈ −13.3 ≈ −13 m/s" (rose, y 780) stays to the end of the scene, linked to the rose mean arrow; "in: towards the eye" under it |
| M5 | s22 S12-S15 | the knots chain top-down in spoken order at y 500 / 565 / 630 / 695: official estimate 135 kt → 135 kt × 1.85 ≈ 250 km/h → 250 km/h ÷ 3.6 ≈ 69 m/s → strongest on our ring ≈ 49 m/s; the "−13 m/s: in" callout is gone (the ū_r row below the chain replaces it); the anticlockwise labels and the ū_r division leave 12 f before the chain starts |

## Should
| id | scene | change |
|---|---|---|
| S1 | s05, s07, s08, s15, s16, s23, s24 | \tfrac → \dfrac (row heights raised) for 3/5, 4/5, 360°/2π, 360°/6.283, 10 km/1 km = 50 km/5 km, (3/5, 4/5), ½, ¾, 1/√2 (both); s23 "1923 ÷ 60" and "4490 ÷ 60" inline |
| S2 | s11, s13 | "without the θ̂ formula" and "r̂, θ̂: length 1" set in KaTeX (\hat{\boldsymbol\theta}) |
| S3 | s04-s09, s11-s14, s20-s24, s26, s27 | the full wind u (arrows, "u", "10 m/s", "due east", "u = +10, v = 0") and the radius r (lines, "r", "r = 5 km", the 5 km / 50 km radii, s21 "r: from the centre", the s22 ring radius) in ink; teal stays for u_θ (and the rings); storyboard colour contract updated |
| S4 | s19, s24 | s19: "x′₁ = …" / "x′₂ = …" pinned on the first line while the three rows under it page (two visible); s24: the u_θ first row holds the whole sum on two lines ("= −(−10.1)(0.707)" / "+ (−44.5)(−0.707)"), then "= 10.1(0.707) + 44.5(0.707)" and "= 7.14 + 31.46 ≈ 38.6" (stack "=" 1250, measured ≤ x 1807) |
| S5 | s18 | the symbolic matrix y 450 → 420; "α = 30°:" then the number matrix at (1250, 572), ≈ 27 px clear below it; the products stack y 648 → 642 (rows 52 px) |
| S6 | s25 | u, v and their gold dots at 30 % from S8; colour bar y 200 → 186; the axis unit "m/s" left of the axis top; "47" above its peak; "mean 35" above the mean line at θ 22°-130° (clear of the θ = 0 dots and the teal curve); "+14" left of its peak with a rose leader tick; "14 out" up to −27; "mean −13" at θ 272°, 74 px under the mean line (no longer runs into "14 out") |
| S7 | s26 | the "tan(inflow angle)" left side fades with its rows (tFour − 18) |
| S8 | s10, s20 | s10 "(−4, 3)" centred above the turned tip (x 129-299), "4 west" right of it over its leg; s20 drawn on its own centre 70 px to the right (150° pair tip x ≈ 106; everything ≤ x 960) |
| S9 | s11 U1 | after: θ = 53.1301° + 0.1° = 53.2301°; x = 5000 × cos 53.2301° = 5000 × 0.598603 ≈ 2993.0 m; y = 5000 × sin 53.2301° = 5000 × 0.801046 ≈ 4005.2 m. CHECK rows: build DF09 "U1 fix 2" (53.1301, 53.2301, cos/sin 53.2301° and of the exact angle, 6 d.p.) and the spoken √ check row; TSX CHECK_U1 +6 |
| S10 | s11 U1 | inset 440 px tall and an outline only; "7.0 m" under the leg's middle; "before" under its dot, below "7.0 m"; "≈ 8.7 m" 86 px off the slide (was 48, on the arrowhead); "after 0.1°" up-left of its dot |
| S11 | s16 | the x′ ruler ran through "cos α (north)": "cos α" / "(north)" on two short lines right of the leg's top, clear of the ruler; "sin α (west)" 53 px higher |
| S12 | s23 S15 | the white upward arrow → a ⊙ mark (towards the viewer) with "rising" / "(out of the screen)" |
| S13 | s27 | each beat at full strength until its own sentence ends (it faded 22 f before the next sentence, while still spoken), the next ≥ 10 f later; keys in warm white; circles 0.5-0.6 → 0.9, grid 0.6 → 0.8; radius, hypotenuse and wind in ink |

## Checks (no browser renders)
- Data build: **78/78 CHECK** (76 + 2 DF09 fix-2 rows); `cf.json` unchanged; manifest chapters / maths_skips regenerated.
- tsc 0 · at_check 496 references, 0 failures · swap_check 379 text elements, 0 overlaps, 0 swaps < 8 frames · cam_speed 0 · eq_check 23/23 ·
  SSR `--step 10` 9323 scene-frames, 0 errors, 0 NaN; `--3d` the same.
- KaTeX widths of every new or changed row measured in headless Edge with the house sizing (\displaystyle, size/1.21): all inside x 1079.6-1837.5
  (s22 "strongest on our ring ≈ 49 m/s" unchanged, 1844.9 by CSS box, passed K6 in fix 1c).
- script.md = timing; storyboard voiceovers = timing (sync check); the sound cue sheet passes `--check-only` on the fix-2 narration (2635.2 s).

## Re-render and mix
- First changed frame: s03 at 1:39.6 (frame 2988; the s03 stack moved). Timing first changes at s11 S20, 13:27.4. Re-render the whole movie
  (chunk 0 already holds frame 2988). Content changed: s03-s16, s18-s27; s17 and s28 only shift in time.
- Mix NOT run: 13.5 GB RAM free (< 18 GB rule). Command (music identical, ice-polar seed 23; cue sheet validated):
  `.venv/Scripts/python.exe tools/sound/mix.py --narration "G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_flat/fix2/tts/narration.wav" --cues movies/ch00/ch00_coordinates_flat/sound.yaml --out-dir "G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_flat/build1/sound7"`
  then rename `build1/sound7/narration_music.wav` → `narration_music_cf.wav`. `cf_render.sh` and `cf_run.py join` now default to `sound7`.

## K6 after fix 2 (k6f2: 404 hits → k6f2z: 0)
| tag | frames | hits |
|---|---|---|
| k6f2 | 3680 (orchestrator) | 404 (367 text-cbar in s25; s16, s15, s18, s07, s11 text-text) |
| k6f2b | 1168 (s07, s11, s15, s16, s18, s25) | 122 ("47" vs colour bar 108; s15 cos 30° rows 12; s11 keyword 2) |
| k6f2c | 851 (s11, s15, s25) | 0 |
| **k6f2z** | **3680, full** | **0 (PASS, 686 INFO)** |

Fixes (source only; the S28 end-card change of 966bb77 is kept):
- s25: colour bar back at y 200; the graph moved down and made shorter (A y 300 → 340, h 300 → 260), so the bar is clear of the keywords and of "47".
- s16: "at right angles, like the old axes" moved from y 790 to 830.
- s15: the cos/sin 30° stack moved from y 250 to 230 (row heights 132 / 128 / 110); EQ_S15 moved from y 630 to 652.
- s18: the number matrix moved from x 1250 to 1272, clear of "α = 30°:".
- s07: the two 1-rad rows are 135 px tall (were 125).
- s11: the U1 stack moved from y 370 to 390 (the tick's yTh follows). The keyword "without the θ̂ formula" moved from y 300 to 294 and now leaves at "to about" − 14 f (before the long rows slide up through it).

Static gates after these fixes: tsc 0 · at_check 496 / 0 · swap_check 0 · cam_speed 0 · eq_check 23/23 · SSR 9323 scene-frames, 0 errors.
