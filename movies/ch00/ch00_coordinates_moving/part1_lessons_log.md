# ch00_coordinates_moving (#5e, Part 5): Part 1 lessons applied (2026-11-05)

Checklist: `movies/ch00/ch00_coordinates/part1_lessons_checklist.md`. This is a light-phase pass: no final TTS, no sound mix, no stills, no
render. The calculation audit (483491a) covered A1–A4, A7, B2 and B3.

## Lint (`tools/movie_symbol_lint.py`)
| | default | `--strict` |
|---|---|---|
| before | 7 (2 × C1 prime: "x′: from the back of the train", recap "v′ = v − U"; 5 × C2 `\tfrac`) | 55 (+ 48 display-level `\frac`) |
| after | **0** | **0** |

## Checklist
| Row | Result | Where / what |
|---|---|---|
| A1–A4, A7 | pass (audit 483491a) | |
| A5 "the change in …" | pass | s04/s05 "delta x prime", "delta t" (a short time), "the change of a sum is the sum of the changes". |
| A6 one rounding | pass | Trig scan clean (products only). |
| B1 magnified views | **fixed** | s10: the two vector insets (9 px per m/s, versus 6 on the map) already had gold links from the map points. They now carry the label "insets: 1.5× larger". |
| B2, B3 | pass (audit) | |
| B4 keep line has its own picture | **fixed** | s05 S14: the derivation rows (CalcStack, du/dt layered line) leave on the keep line. The speeds in both frames come back as KaTeX over the walker and the person beside the track (u′ = 1.5 m/s; u = 20 + 1.5 = 21.5 m/s), beside the two falling balls with the same 9.8 m/s² arrow. s14 S16: the derivation rows and "3. move it across the =" leave. The keep picture is the barometer, the pressure pattern sliding past, and the labelled line "barometer = storm changing − sliding past". |
| B5 icons inside boxes | **fixed** | s18 end card: the rails were 18 px from the box bottom and 20 px from its sides; they are now ≥ 26 px. The barometer (r 58) is ≥ 24 px. |
| B6 paged LHS visible | pass | Static CalcStack scan clean. |
| B7 vertical motion = ⊙/⊗ | n/a | No vertical motion on a plan view (gravity is drawn on side views of the train). |
| C1 maths typeset | **fixed** | s04 keyword "x′: from the back of the train" and the s17 recap beat "v′ = v − U" are now KaTeX (`x'`, `\mathbf v'=\mathbf v-\mathbf U`). |
| C2 `\dfrac` | **fixed** | 5 `\tfrac` and 48 `\frac` are now `\dfrac` (mv_eq.ts, mv_sA/C, storyboard.yaml). CalcStack: fraction-row height plus the bottom guard (mv_lib). |
| C3 one notation | pass | U is the frame speed; primes mark the moving frame; β is the bearing angle (s08). |
| C4 regex `\\` | pass | |
| D1 one colour convention | **fixed** | Full winds were teal in s02 (the Part 4 coast recap), s10 (the ground wind v in both insets, and its label) and s12 (the ring winds), and in the end-card glyph. They are now ink (s02) or slate (ground wind, as in s01); storm-relative winds stay warm white. The storyboard colour contract is updated. |
| D2 data frames | pass | Every Ciarán frame (s01, s08–s13, s15, s17) has its source line and its colour bar (static scan). |
| D3 recap at full contrast | **fixed** | s17: each beat stays at full strength until SE(j); the next enters 8 frames after its sentence starts. |
| E1 skip pattern | **fixed** | The chip is now "every step · optional / skip to mm:ss" (Part 1's box); the storyboard chip_text was updated. The s04 S2 and s14 S2 lead-ins lacked the not-needed sentence and have been re-voiced. Keep lines: s05 S14, s14 S16. |

## Narration changed (script.md + storyboard.yaml + checks/revoice.py; estimated timing)
- s04 S2: "If not, skip ahead to the time on screen**: you don't need them for the intuition of weather, climate or maps.**"
- s14 S2: "They're for anyone who wants every step **and aren't needed for the intuition of weather, climate or maps**, so skip ahead to the time on screen if you'd rather go straight to the numbers."
- Total 1319.548 → **1328.657 s**.

## Gates
- Data build: **63/63 CHECK pass**, 0 flags.
- New `checks/mv_static.sh` (this part had none): tsc, at_check, swap_check, cam_speed, symbol lint `--strict`, eq_check, SSR, SSR `--3d`, timing. Results are in the reply.
