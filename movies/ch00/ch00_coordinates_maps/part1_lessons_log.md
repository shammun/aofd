# ch00_coordinates_maps (#5g, Part 7): Part 1 lessons applied (2026-11-05)

Checklist: `movies/ch00/ch00_coordinates/part1_lessons_checklist.md`. This is a light-phase pass: no final TTS, no sound mix, no stills, no
render. The calculation audit (G1…, 483491a) covered A1–A4, A7, B2 and B3.

## Lint (`tools/movie_symbol_lint.py`)
| | default | `--strict` |
|---|---|---|
| before | 4 (C2 `\tfrac`: s05 × π/180, s08 × 1/cos φ, s19 r̂ = (500/1118, 1000/1118)) | 41 (+ 37 display-level `\frac`) |
| after | **0** | **0** |

## Checklist
| Row | Result | Where / what |
|---|---|---|
| A1–A4, A7 | pass (audit 483491a) | |
| A5 "the change in …" | pass | s08 S3–S7 "a small step north … by delta phi"; S12 "we write d instead of delta". |
| A6 one rounding | pass | The flags are unchanged and consistent: F1 (s08 shows the exact 111.19 × 1.5059 ≈ 167.4) and F4 (published areas 2.17 and 30.4 million km², spoken and shown alike). |
| B1 magnified views | **fixed** | s08: the north step is drawn 6° long; the label "drawn 6° long" was added. s12: the zoom box (gold ring on the globe, gold link) now says "magnified". |
| B2, B3 | pass (audit) | |
| B4 keep line has its own picture | pass | s06 S0–S2: the plate carrée with the stretch bands and ×1.5 / ×2 / ×4.9 (the key idea). s12 S0–S1: the ladder of stretched strips and "each strip × 1/cos φ": taller and taller towards the pole, never the pole. |
| B5 icons inside boxes | **fixed** | s23 end card: globe r 70 → 62, rings r 75 → 60, map frame y 90–220 → 94–216, the three flow lines y 90–225 → 96–214 (all ≥ 20 px inside). |
| B6 paged LHS visible | pass | Static CalcStack scan clean. |
| B7 vertical motion = ⊙/⊗ | n/a | s16 "rise up above the North Pole" is a camera move; no drawn vertical motion. |
| C1 maths typeset | pass | Lint 0. |
| C2 `\dfrac` | **fixed** | 4 `\tfrac` and 37 `\frac` are now `\dfrac` (mp_eq.ts, mp_sA/B/C, storyboard.yaml). CalcStack: fraction-row height plus the bottom guard (mp_lib). |
| C3 one notation | pass | u_r, u_θ, `\hat{\mathbf r}`, `\hat{\boldsymbol\theta}`, φ, λ. |
| C4 regex `\\` | pass | |
| D1 one colour convention | **fixed** | s20/s21: the wheel's wind arrows and the westward wind (with its label "u = −10, v = 0") were teal; they are now ink. u_θ bands stay teal and u_r bands rose. The storyboard colour contract is updated. |
| D2 data frames | pass | s14 temperature maps have the source line and the colour bar. The other maps are Blue Marble or outlines. |
| D3 recap at full contrast | pass | s22: a beat stays full until 10 frames before the next sentence (gaps ≥ 10 frames, after its own sentence ends); older pictures then sit at 60 %. |
| E1 skip pattern | pass | The chip reads "every step · optional · skip to mm:ss" (Part 1's words on one line in the top slot), then the "optional maths" tag. The s04 S1–S2 and s08 S1–S2 lead-ins say not needed for the intuition of weather, climate science or GIS. Keep lines: s06 S0, s12 S0. |

## Narration changed
None. Timing is unchanged (1949.810 s).

## Gates
- Data build: **122/122 CHECK pass**, 2 flags (F1, F4, unchanged).
- `checks/mp_static.sh`: added the symbol lint (`--strict`). Results are in the reply.
