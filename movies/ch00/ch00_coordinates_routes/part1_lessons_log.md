# ch00_coordinates_routes (#5f, Part 6): Part 1 lessons applied (2026-11-05)

Checklist: `movies/ch00/ch00_coordinates/part1_lessons_checklist.md`. This is a light-phase pass: no final TTS, no sound mix, no stills, no
render. The calculation audit (483491a) covered A1–A4, A7, B2 and B3.

## Lint (`tools/movie_symbol_lint.py`)
| | default | `--strict` |
|---|---|---|
| before | 0 (an early "s11_route_shape" hit was a false positive in the tool, fixed there: `skipTo(…)` arguments are scene ids) | 1 (`\frac`) |
| after | **0** | **0** |

## Checklist
| Row | Result | Where / what |
|---|---|---|
| A1–A4, A7 | pass (audit 483491a) | |
| A5 "the change in …" | pass | s04 S1 "turning by a small angle delta theta walks r times delta theta"; S5–S6 "stepping north by delta phi …". |
| A6 one rounding | **fixed** | s10: the row "σ ≈ 78.74 × 0.01745 ≈ 1.3742" was wrong arithmetic (78.74 × 0.01745 = 1.3740); it now reads σ ≈ 78.738° × π/180 ≈ 1.3742, naming the exact angle (Part 1's 53.2301° pattern). The quick check "78.74 × 111.2 ≈ 8755" (actually 8755.9) now reads ≈ 8756, with a muted line "≈ 8755 (rounding)". Both sentences were re-voiced (below). The data build's two DM11 FLAGs are now CHECK rows; the TSX CHECK_B gains "quick" and "sig exact". |
| B1 magnified views | pass | No magnified views: the s13 `Magnifier` is an icon for "+150 m", and the s09 inset is Part 1's ring, a recap figure. |
| B2 shapes labelled | **fixed** | s11 keep line: "≈ 79°" at the Earth's centre had no arc; a gold arc between the two position lines is now drawn. |
| B3 | pass (audit) | |
| B4 keep line has its own picture | pass | s11 S0–S1: the globe with the two position lines from the centre, the 79° angle (now with its arc) and the 8755-km great circle: the key idea of the block. |
| B5 icons inside boxes | **fixed** | s15 end card: the two globe icons were r 70 (15 px); now r 62 (23 px). The compass (r 60) and the Mercator inset (y 95–212) were already inside. |
| B6 paged LHS visible | pass | Static CalcStack scan clean. |
| B7 vertical motion = ⊙/⊗ | n/a | No vertical motion. |
| C1 maths typeset | pass | Lint 0. Every r̂₁, r̂₂, σ, ψ is KaTeX. |
| C2 `\dfrac` | **fixed** | 1 `\frac` is now `\dfrac` (rt_sB, storyboard). CalcStack: fraction-row height plus the bottom guard (rt_lib). |
| C3 one notation | **fixed** | s12 used α for the bearing-triangle angle ("tan α = 2.0614 ÷ 0.4196"). α is the axis turn in Parts 1 and 4, so this is now β (as in s11 and Part 5). It is not spoken. |
| C4 regex `\\` | pass | |
| D1 one colour convention | **fixed** | London's position arrow r̂₁ (a radius direction) was teal; it is now ink (rt_lib Disc, rt_sA s05 arrow, rt_sB ×7, rt_sC s11 line). LA's r̂₂ stays orange. Round/true lengths stay teal. The storyboard colour contract is updated. |
| D2 data frames | pass | The Blue Marble globes and the Mercator chart carry source lines; there is no value raster. |
| D3 recap at full contrast | pass | s14: the current beat is at full ink, and older beats drop to 60 % only after the next sentence starts. |
| E1 skip pattern | pass | The chip already read "every step · optional / skip to mm:ss" (then the "optional maths" corner tag). The s08 S1–S2 lead-in says not needed for the intuition of weather, climate science or GIS. The keep line is s11 S0. |

## Narration changed (script.md + storyboard.yaml; new `checks/revoice.py`, make_timing.py `--sync`)
- s10 S2: "So seventy eight point seven four degrees, **or more exactly seventy eight point seven three eight, times pi over a hundred and eighty, is** about one point three seven four two radians."
- s10 S5: "Let's check it the quick way: seventy eight point seven four degrees, times a hundred and eleven point two kilometres per degree, is **about eight thousand seven hundred and fifty six kilometres, the same to within the rounding.**"
- This part had no revoice step. `checks/revoice.py` is copied from Part 3's (apply / sync / apply_text unchanged), and `make_timing.py` now applies it (`--sync` writes the storyboard times). Total 1017.375 → **1020.300 s**.

## Gates
- Data build: **57/57 CHECK pass, 0 flags** (was 55 + 2 flags).
- `checks/rt_static.sh`: added the symbol lint (`--strict`). Results are in the reply.
