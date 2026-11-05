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
