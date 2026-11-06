# ch00_coordinates_sphere (#5c, Part 3) — fix loop 1 (2026-11-06)

Inputs: `reports/ch00_movies.md` § "#5c … build 1, review 1" (6 Must, 14 Should, 6 cosmetic) and
`reports/movies/ch00_coordinates_sphere/calc_audit.md` (5 Must, 13 Should). Build 1 = 48:22.87, QA 13/15 (content and halves FAIL at 2669–2687 s).
Item names: **R-** = review 1, **A-** = calc audit. Times below are build-1 times.

## Narration (9 sentences re-voiced, 4 of them one-to-many; Kokoro af_bella × 1.0, lexicon, spliced)
Text list: `movies/src/ch00_coordinates_sphere/checks/rf1_text.py` (`RF1`); text step run first, then `tools/script_wording_lint.py` → **0 findings**;
splice `checks/cs_rf1_splice.py` (copy of `cs_fix1_splice.py`; input `build1/fix1/tts`, output `build1/rf1/tts`); every new clip within ±1.5 LU of
its neighbours, true peak ≤ −1.68 dBTP; `make_timing.py --final build1/rf1/tts`.

| Item | Scene / sentence | Old → new |
|---|---|---|
| A-M2 (+R-S5) | s10 S12 | "… for more than eight thousand kilometres." → "… all the way to Antarctica." (no number: the km-per-degree rule comes in s22) |
| R-S2 | s20 S8 (+3) | the noon-to-noon rows are spoken: 360° ÷ 365 days ≈ 1° a day; 360° + 1° = 361°; 24 h = 1440 min and 1440 ÷ 360 = 4 min per degree |
| R-M5 | s20 S12 | "So, speed is …" → "Then, speed is distance divided by time." |
| R-M5 | s20 S14 | "Fourth, we pull out …" → "Now we pull out the part that's the same for every place: two pi divided by capital T." |
| R-S3 | s21 S8 (+3) | 2π × 6400 ≈ 40 000 km; 40 000 km in 24 h ≈ 1670 km/h; × 3.6 explained (3600 s per hour, 1000 m per km); 464.6 × 3.6 ≈ 1670 |
| R-S3 | s21 S9 | "That's almost twice as fast as a passenger jet." → jet 900 km/h named; 1670 ÷ 900 ≈ 1.9 spoken |
| A-M3, R-C6 | s21 S10 | Singapore "at one point three five degrees north … has cosine phi zero point nine nine nine seven, so …" (beat kept) |
| R-S10 | s33 S10 | "… by the same factor." → "… by one over cosine phi." |
| R-S8 | s34 S10 (+3) | T bar named; capital sigma = add up over all boxes, numbered j; T bar = Σ cos φ T ÷ Σ cos φ in words |

## Screen
| Item | Change | Where |
|---|---|---|
| R-M1, A-M1 | s34: keep picture held through S2 ("Here's where this matters"), goal keyword "global average?" on S2, "two boxes · same size in degrees" on S3; both boxes as outlines from S3 (+10 frames, after the keep picture's fade), each filled on its own sentence; "equator" on its word (S4), "60° N" on "sixty degrees north" (S5), "· area 1" / "· area ½" on "one half" (S7) | `cs_sC.tsx` S34 |
| R-M2 | true north-polar equator face: new `polar` lat cut in `kit_cs/earth.tsx` (each face point shows the surface straight above it: radius cos lat, angle = longitude; darkened ×0.5, opaque); the cap leaves completely (s11) / is not drawn (s17, s19). 0° spoke → Europe, 90° E → India, Brest's and Khulna's foot points sit under their own cities | `kit_cs/earth.tsx`, `cs_sA.tsx` S11, `cs_sB.tsx` S17/S19 |
| R-M3, A-S5 | s19 3-D "2469 km" tag left of the leg, inside the slice | S19 |
| R-M4 | s27 side lengths drawn after the GlobeFrame darkening (they sat under it), KaTeX 68 px, a in ink and the step in orange, kept with their gold links until "Collecting the pieces" | S27 |
| R-M6 | s18: "two steps together" leaves before S1; the brace comes in with its a cos φ term on S1, the rest of x on S2 | S18 |
| A-M5 | s18: (4217, −332, 4764) ÷ 6371 on "For Brest", ≈ (0.662, −0.052, 0.748) on "about zero point" ("Part 4: up" moved to y 580) | S18 |
| A-M3 | s21 rows: Singapore 1.35° N: cos 1.35° ≈ 0.9997 on its words; Longyearbyen 78.2° N: cos 78.2° ≈ 0.2045 on "seventy eight point two", the 95 m/s row on "So the ground there" | S21 |
| A-M4 | s32: on "three quarters" the tint cross-fades from 30° S–30° N to 0°–48.4° N; keyword "¾ of the northern hemisphere" and a "¾" on the band | S32 |
| R-S1 | keywords in the empty halves: s02 "the biggest round shape"; s05 "latitude: angle at the centre"; s09 "12 meridians, 30° apart"; s22 "first north, then east" (during the chip); s28 "area of one box?" | S02, S05, S09, S22, S28 |
| R-S2, A-S9 | s20 noon-to-noon rows on their spoken words, full ink, 50 px, until the next question | S20 |
| R-S3, A-S3 | s21: cos 0° = 1 row; U row "× 1"; each easy-check row on its words at full ink (house dimming of older rows); new row 1 m/s = 3600 m/h = 3.6 km/h | S21 |
| R-S4, A-S4 | s22: 360° = 2π rad on "or two pi radians" | S22 |
| R-S6 | s08 flat twin radius 200 → 260; the "colatitude" keyword gets a gold link to the wedge at Brest's corner | S08 |
| R-S7, A-S8 | s34: both polar caps outlined on the Equal Earth map (dashed parallels at ±60°, Equal Earth formula in JS); strip label "60–90° N and S: many thin boxes" (en dash); colour bar end arrow for the clipped < −60 °C and ticks at 52 px | S34, `cs_lib.tsx` ColourBar |
| R-S8 | s34: "T̄: the average temperature", "Σⱼ: add up over all boxes j", "cos φⱼ: the weight of box j" on their new sentences (KaTeX in labels) | S34 |
| R-S9 | s26: two large globes — latitude-longitude every 10° ("crowded at the pole") and a cubed sphere 8 × 8 per face ("boxes about the same size"); one source line below both; the old small globe and "other grids" keyword removed | S26 |
| R-S10 | s33: camera 3.6 → 4.4 (whole cylinder); the strip pair at 58–62° on sphere and cylinder, tagged "round: × cos φ" and "width: × 1/cos φ" | S33 |
| R-S11, A-S12 | s22 keywords "circle round / the centre" 60 px right of the flat Δy tag | S22 |
| R-S12 | s18 Pythagoras links come in from below / above (control points), clear of the Brest arrow and the 4217 tag | S18 |
| R-S13, A-S6 | every φ, λ, Ω, a, r, θ, z, ×, Σ, sin/cos in Keyword / Lbl / KeepLine / SideCallout is now KaTeX (`$…$` segments; Part 2's foreignObject label ported to `cs_lib.tsx` Lbl/Keyword, widths by `mixW`); s33 duplicate sans "height a sin φ = z" now one KaTeX callout; s35 x and y as KaTeX `x = a cos φ cos λ, y = a cos φ sin λ` at 52 px ink | all scene files |
| R-S14, A-S13 | s12 parallel tags drawn unclipped and 40 px further from the limb ("75°" no longer cut) | S12 |
| A-S1 | s23: z ≈ 4764 km < 5382 km on "four thousand seven hundred" | S23 |
| A-S2 | s11: "0 … +180° E" and "0 … −180°" on their words | S11 |
| A-S10 | s28: muted note "(unrounded inputs; rounded ones give ≈ 772)" under 772.8 ≈ 773 | S28 |
| A-S11 | s06: "48.4°" rides on the sweeping arc | S06 |
| R-C3 | s29: φ and φ + Δφ at the strip's edges | S29 |
| R-C6 | Singapore's cos φ spoken (s21 S10) | — |

Not done (cosmetic, reasons): R-C1 under-brace spacing (needs a TeX spacing change inside the equations; no overlap, only tight);
R-C2 calc-stack line counts / sizes (the stacks pass the bottom guard; re-laying 3 scenes is a larger change); R-C4 title subtitle colour
(house title component, shared: propose to the orchestrator); R-C5 s24 camera (the parallel-disc slice needs this viewing angle to face
the camera; moving it to Brest turns the cut face edge-on).

## Results
- Timing (`make_timing.py --final build1/rf1/tts`): audio **2989.150 s**, 89 675 frames; movie **2991.65 s = 49:51.65** (was 48:22.87, +88.8 s);
  37 scenes, 454 sentences, 7232 words, **735 cues** (was 712), TTS warnings none, self-check 0.0 ms. Skip chips: K1 8:49, K2 25:58, K3 32:59, K4 45:23.
- Splice: 9 replaced sentences → 17 new clips, every clip within ±1.5 LU of its neighbours (−15.55 … −16.58 LUFS), TP ≤ −1.68 dBTP; re-synthesis check passed.
- Mix (`checks/rf1_mix.sh`, `tools/sound/mix.py`, meridian-glass seed 31): **−16.01 LUFS, true peak −3.4 dBTP, PASS** → `build1/sound/narration_music_cs.wav`
  (the build-1 mix kept as `build1/sound_build1/`).
- Static gates: tsc 0 errors · at_check 495 refs, 0 failures · swap_check 0 overlaps, 0 tight swaps · cam_speed 0 > 90 °/s · eq_check 24/24 ·
  symbol lint `--strict` (with C5) **0** · SSR 10 679 scene-frames 0 errors, 0 NaN · SSR --3d 7718 scene-frames 0 errors.
- K6: **k6f1** 4676 frames (K6 list 4625 + 67 changed moments): 4 faults (s08 colatitude link over the sin φ tag and the axis; s21 map tag
  "Khulna ≈ 428" touching the new rows) → fixed. **k6f2** (same frames): 1 fault — s08 colatitude link crosses the flat rim (link-axis, 12 frames)
  → fixed in code (the link now ends just outside the rim, pointing in at Brest's corner). The re-check (k6f3 = k6f2 + the 115 s08 frames
  re-rendered, `build1/k6f3pass.sh`) could not run: the stills copy was stopped by the session's low-memory guard.
- Looked at: the 67 changed moments (`reports/movies/ch00_coordinates_sphere/fix1/sheet_00…16.jpg`) and `look_14615.jpg`; fixed after looking:
  s19 3-D "2469 km" tag (moved above-left of Khulna, it sat on the arrow), polar face darkened 0.5 → 0.4 (s17 tags over Greenland), s28 note
  shortened, s33 tags 22 px further right (they touched the cylinder edge).

## Lint (`tools/movie_symbol_lint.py`)
New rule **C5** (maths in the sans font): a Greek letter, ×/÷/√, sin/cos/tan, a lone x/y/z/r or one-letter label, or a fraction slash outside
`$…$` in a render string. On with the CLI `--strict` (`--no-c5` = the old `--strict`), off in the Python API unless `maths_text=True` (the
other parts' pytest stays as it was). Tests: `tests/test_machinery.py::test_movie_symbol_lint_c5_maths_text`, `…_sphere_c5_clean`.
