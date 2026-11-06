# ch00_coordinates_frames (#5d, Part 4): Part 1 lessons applied (2026-11-05)

Checklist: `movies/ch00/ch00_coordinates/part1_lessons_checklist.md`. This is a light-phase pass: no final TTS, no sound mix, no stills, no
render. The calculation audit (D1–D4, 483491a) covered A1–A4, A7, B2 and B3. This pass re-checked the rows that audit did not cover.

## Lint (`tools/movie_symbol_lint.py`)
| | default | `--strict` |
|---|---|---|
| before | 3 (2 × C1 combining hat in sans keywords, 1 × C2 `\tfrac`) | 132 (+ 129 display-level `\frac`) |
| after | **0** | **0** |

## Checklist
| Row | Result | Where / what |
|---|---|---|
| A1–A4, A7 | pass (audit 483491a) | |
| A5 "the change in …" | pass | s11 S8/S10 "the change in latitude / longitude, in radians". |
| A6 one rounding | pass | Trig scan clean. The s07 i × j third part is 0.747 with ≈ (flag DP07, unchanged). |
| B1 magnified views | pass | No insets. The zoom-reveals (s03, s07, s09) are continuous camera flights from the whole globe (wide view first). |
| B2, B3 | pass (audit) | |
| B4 keep line has its own picture | **fixed** | s07 S9: the zoomed Brest check (the CalcStack, the right-angle ticks, "= k̂") gave way to the whole globe with a tripod at five places, each up arrow continuing a dashed line from the Earth's centre. s22 S15: the 3 × 3 grid, the check tripod and Ω × B leave. New `TurnPic` (fr_dia) shows a side view of the surface with one parcel's î/k̂ at three places as it moves east, ĵ as ⊙, and "they turn at ≈ speed / a". s25 S12: the dense full equation leaves; `TurnPic wind` shows the same push-free wind at the three places ("the east number changes ⇒ metric terms"). EQ_S25 with its "metric terms" bracket stays. |
| B5 icons inside boxes | **fixed** | s29 end card: the tripod (11 px from the bottom) and the coast line (15 px) are now ≥ 20 px inside. |
| B6 paged LHS visible | pass | Static CalcStack scan clean. |
| B7 vertical motion = ⊙/⊗ | pass + new | Up (k̂) is only drawn in 3-D or side views. The new TurnPic draws north as ⊙ "out of the screen". |
| C1 maths typeset | **fixed** | s21 keywords "going east tilts ĵ and k̂ too" and "only R̂ turns" (combining hats in the sans font) are now KaTeX, 48 px (54 px ran to x 1893). |
| C2 `\dfrac` | **fixed** | 1 `\tfrac` and 131 `\frac` are now `\dfrac` (fr_eq.ts, fr_sA/B/C, storyboard.yaml). The `gold()` split strings use `\dfrac` too. CalcStack: fraction-row height 2.4 × plus the bottom guard (fr_lib). |
| C3 one notation | pass | α is the axis turn (s10/s13); β is the coast-angle triangle (s12). Hats: `\hat{\mathbf i,j,k,R,z}`, `\hat{\boldsymbol\theta}`. |
| C4 regex `\\` | pass | Lint C4: 0. |
| D1 one colour convention | **fixed** | The full Ian wind was teal in s00 (title) and s14; it is now ink. The along band stays teal and the across band rose. The storyboard colour contract is updated ("full winds ink or slate … never teal"). k̂ up stays teal (build-1 contract; it is not a wind). |
| D2 data frames | **fixed** | The s00 title HRRR wind-speed map had its source line but no colour bar; a `SpeedBar` now sits under it. s14 already had both. |
| D3 recap at full contrast | **fixed** | s28: each beat stays at full strength until SE(i); the next enters 8 frames after its sentence starts. |
| E1 skip pattern | **fixed** | The chip read "every step, for those who want it / not needed for weather, / climate or GIS / skip to"; it now reads "every step · optional / skip to mm:ss" (Part 1's box, y 740–856). The storyboard chip_text was updated to match. The s23 S3 lead-in lacked the not-needed sentence and has been re-voiced. The s04 and s16 lead-ins already named weather, climate and maps. Keep lines: s07 S9, s22 S15, s25 S12. |

## Narration changed (script.md + storyboard.yaml + checks/revoice.py; estimated timing)
- s23 S3: "They're for anyone who wants every step, **and you don't need them for the intuition of weather, climate or maps, so skip ahead to the time on screen if you like.**" (was "…and you can skip ahead to the time on screen without losing the weather story.")
- Total 2362.087 → **2364.560 s**.

## Gates
- Data build: **82/82 CHECK pass**, 1 flag (DP07, unchanged).
- `checks/fr_static.sh`: added the symbol lint (`--strict`), `ssr --3d` and the timing check. Results are in the reply.
