# ch00_coordinates_storm (#5b): Part 1 lessons checklist (2026-11-05)

Checked against `movies/ch00/ch00_coordinates/part1_lessons_checklist.md`, row by row. Source-only changes in `cs_lib.tsx` and
`cs_sA/B/C.tsx` (plus `checks/swap_check.mjs`, which now measures `$…$` maths by its plain look-alike). No voice change was needed, so
the narration, timing, captions, chips, marks and the sound mix are untouched. No stills were shot and nothing was committed.

| Row | Verdict | What was checked / changed |
|---|---|---|
| A1 inputs on screen | pass (audit B1-B25) | Every number has its inputs and arithmetic, one line per spoken phrase. K6 round 1 split the long rows at their spoken words; no row was removed. |
| A2 one move per step | pass | Sign steps have their own lines: s06 swap / minus first; s07 Δθ̂ subtraction on three aligned lines. |
| A3 restate the rule | pass | s09 and s14 write the arc rule (Δs = r Δθ; 34.8 × 0.084). s05, s07 and s13 restate the turning rule and v²/r. tan, cos and sin are defined from the triangle in Part 1, and s23 now draws the triangle again (A7). |
| A4 independent checks | pass | s04 checks the slopes with cos/sin of 53.70° (not the slope rule). s07 checks dθ̂/dθ with the same numbers. s14 checks v²/r with the arc rule (no formula). |
| A5 "the change in theta" | pass, no voice change | The voice names Δθ "delta theta" and defines it on screen and in the voice (s03: "delta just means a small change"; keyword "Δθ: a small change in θ"). Elsewhere it says "theta grows by", "turn by" or "the angle it turns through". |
| A6 one rounding | pass | 34.8 / −13.3, 0.048 m/s², 21° and 17° are the same in the map, rows, voice and recap. |
| A7 inputs before derived result | **fixed** | s23: each storm's right triangle is drawn next to its angle rows. The round leg u_θ is teal, the in leg \|u_r\| rose, the actual wind ink and the angle gold; the sides are labelled 20.1 / 6.0 and 34.8 / 13.3 at one scale (4.6 px per m/s). |
| B1 zoom shows what it magnifies | **fixed** (s22) | s22 MODIS zoom now says "zoomed 3.4×: frame ≈ 180 km wide" (computed from the crop box). s03/s04 ("turn drawn large (20°)"), s08 ("change, drawn 3× larger", gold leader) and s14 ("turn drawn 3× larger") already labelled. |
| B2 label drawn shapes | pass (+A7 triangles) | Arcs carry Δθ / 0.1 rad / 5°, and the reference rays are drawn. |
| B3 row on its words, kept to its result | pass | New split rows use `AT(...)` phrases. Stacks slide only after the next spoken line. |
| B4 keep line shows its own picture | pass | s08 S0 shows its own picture: the two arrows swinging, with gold arcs. s13 S0 shows the ring, the parcel, v and the inward v²/r arrow. Neither shows leftovers from the optional block. |
| B5 icons inside their boxes ≥ 20 px | **fixed** | s01 ring thumbnails: all icon points now within 33 px of the ring centre (r 54), so ≥ 20 px margin (were 4-15 px). End card: the cylinder's lower rim moved 205 → 198 (≥ 22 px from the card edge). Text stays inside x 60…1842 and out of the caption band (K6). |
| B6 paged columns keep their left side | pass | Split rows keep their left-hand side: `\phantom{Δθ̂=}`, `\phantom{Δd̂}`, `\phantom{w}=`, and "=" columns. Cont rows stay in their line. |
| B7 vertical motion on plan views as ⊙/⊗ | pass | Up arrows appear only in side views (s19 stack, s20/s24 sections) and on the oblique s25 sketch. |
| C1 maths typeset | **fixed** | 35 label strings carried combining hats or super/subscripts (r̂, θ̂, d̂, Δr̂, −r̂, v², m/s², u_θ, dr/dt, dv/dt). They are now `$…$` KaTeX via a math-capable `Lbl` / `Keyword` in cs_lib (foreignObject HTML label, same font, size, weight, colour, anchor and dark halo). Labels without `$` still use the house components unchanged. s20 "u_θ ≈ 55 m/s" was written with a literal underscore and is now typeset. |
| C2 \dfrac ≥ 44 px | **fixed** | 63 `\frac` → `\dfrac` in the scene TeX. The s04 `\tfrac35` / `\tfrac45` became `\dfrac{3}{5}` / `\dfrac{4}{5}`. Every CalcStack row is ≥ 44 px. The EQ_ constants in cs_eq.ts stay as in the storyboard; they render full size (the house draws in `\displaystyle`). `movie_symbol_lint` 0 findings; `--strict` flags only those cs_eq.ts constants (26). |
| C3 one notation | pass | θ̂ / r̂, u_r / u_θ, Δθ for a change throughout. The s31 recap keyword is fully typeset: v/r · v θ̂ · −(v²/r) r̂. |
| C4 regex `\\` | **fixed** (K6 round 1/2) | cs_lib `/\frac/` → `/\\d?frac/`, and s11 `/^\mathbf v/` → `/^\\mathbf v/` (the screen read "v v = r …"). No other TeX regex literals. |
| D1 colours | **fixed** | The radius and the full wind are now ink: s02 r line + label; s09 r line + label; s10 position arrow r r̂ + "r = 25 km"; s11 radius arrow; s08 product vectors (10, 0), (10.945, 1.1); s26/s27 the full-wind arrows at Fort Myers Beach and Saint Petersburg. Tangential stays teal and radial rose. |
| D2 source + colour bar on data frames | **fixed** (end card) | Every data picture has its source line below and its colour bar (s00, s02, s17-s30, s25 minis, s31). The end-card thumbnail was the HRRR section image with neither; it is now a drawn in-up-out schematic. |
| D3 recap full contrast | pass | Each s31 beat is at full strength until its sentence ends: `win(t(j), t(j+1) − 8)`, and the sentence ends ≈ 10 frames before t(j+1). |
| E1 skip pattern | pass | s03 S0-S1 and s08 S1-S2 give the spoken optional lead-in. The chip reads "every step · optional / skip to mm:ss". The keep lines are s08 S0 at 11:38 and s13 S0 at 20:09, and the chip times equal the VTT cues (00:11:38.600, 00:20:09.950). Chapter marks were not regenerated (no timing change). |

## Gates after the checklist changes
- symbol lint (`tools/movie_symbol_lint.py movies/src/ch00_coordinates_storm`): 0 findings
- tsc: 0 errors
- at_check: 372 references, 0 failures
- swap_check: 384 elements, 0 overlaps, 0 swaps < 8 frames
- cam_speed: 0 cameras above 90°/s
- eq_check: 18/18
- SSR `--step 10`: 9213 scene-frames, 0 errors, NaN 0
- SSR `--3d`: 9213 scene-frames, 0 errors
- stack_frame: s18 / s19 inside the frame

## Next (Chrome)
Labels changed in most scenes (s01-s14, s18-s32), so k6r3 should be a full pass with a fresh bundle:
`cst_run.py stills k6r3 --bundle --jobs 3`, then `tools/k6_overlap.py <S>/stills/k6r3 --timing …`.
The new HTML maths labels (foreignObject) and the s23 triangles are new to the box probe; look at their K6 hits first.
