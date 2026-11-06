# ch00_coordinates_sphere (#5c, Part 3): Part 1 lessons applied (2026-11-05)

Checklist: `movies/ch00/ch00_coordinates/part1_lessons_checklist.md` (user request 2026-11-05). This is a light-phase pass: no final TTS, no
sound mix, no stills, no render. The calculation audit (C1–C9, commit 483491a) already covered A1–A4, A7, B2 and B3. This pass re-checked
the rows that audit did not cover.

## Lint (`tools/movie_symbol_lint.py`)
| | default | `--strict` |
|---|---|---|
| before | 9 (7 × C2 `\tfrac`, 1 × C1 prime + Greek on one label) | 14 (+ 5 display-level `\frac`) |
| after | **0** | **0** |

## Checklist
| Row | Result | Where / what |
|---|---|---|
| A1 inputs + arithmetic | pass (audit 483491a) | Every row from C1–C9 is in place. The stack guard moved s17's rows, but the rows themselves are unchanged. |
| A2 one move per step | pass (audit) | |
| A3 rule restated | pass (audit) | The s22 arc rule (`Δy = a Δφ`) and s30 (slope of sine) are on screen. |
| A4 independent checks | pass (audit) | s18/s19: √(x² + y² + z²) = 6371, spoken. |
| A5 "the change in …" | pass | s22 S8 "delta phi, the change in latitude"; s24 S6–S7 "the change in longitude … delta lambda". Δ is never dropped in the voice. |
| A6 one rounding | pass | Scan: every shown cos/sin/tan matches its shown angle to the shown digits. 464.6 is used everywhere (audit decision). |
| A7 inputs before results | pass (audit) | |
| B1 magnified views | **fixed** | s11 (λ = −4.5° drawn 27°), s17 (the same, top view) and s23 (1′ of arc): new `Magnify` (cs_lib) adds a gold ring on the source in the wide view, a dashed gold leader to the inset, and "magnified 6×" / "1′ magnified 60×" (the old bare "× 6" / "1′ × 60" removed). The s17 inset moved to (1640, 420): at (1600, 560) it lay under the x, y equation lines at y 650. |
| B2 shapes labelled | pass (audit) | |
| B3 rows on their words | pass (audit) | |
| B4 keep line has its own picture | **fixed** | New `KeepPic` (cs_lib), one per keep line, drawn during the "If you skipped" sentences. s09 "swap": the meridian triangle with φ at the centre, 90° − φ from the axis, legs sin φ / cos φ, and `sin φ = cos(90° − φ)`. s21 "slice": height a sin φ, distance from the axis a cos φ, east ⊙ at Ω a cos φ, Ω arrow. s25 "steps": a globe; one degree north is the same everywhere, one degree east shrinks with cos φ. s34 "band": 30° S–30° N is half the area, and the same box is narrower near the pole (in the empty picture zone). s25: the four place names now appear after the keep picture (they had sat under it at 50 % from frame 0). |
| B5 icons inside boxes | **fixed** | s36 end card: the half disc and the globe were r 70 (15 px from the box edge); now r 60/62 (≥ 23 px). The other two icons were already ≥ 23 px. |
| B6 paged LHS visible | pass | Static scan of every CalcStack: no continuation line shows after its left-hand side has paged out. |
| B7 vertical motion = ⊙/⊗ | **fixed** (new picture) | The s21 keep slice draws "east" at Brest as ⊙ "out of the screen". There are no other plan views with vertical motion. |
| C1 maths typeset | **fixed** | s31 "φ′: the latitude of each strip" is now KaTeX (`\varphi'\text{: …}`). |
| C2 `\dfrac` ≥ 44 px | **fixed** | 7 `\tfrac` (cs_sB 3, cs_sC 4) and 5 `\frac` (cs_eq.ts, mirrored in storyboard.yaml) are now `\dfrac`. cs_lib CalcStack: a `\dfrac` row is 2.4 × its size tall (Part 2's K6 fix). A new bottom guard stops a stack from entering the caption band (y 880). It caught s17 (the last row sat at y ≈ 906); that stack now starts at 528. |
| C3 one notation | pass | `\hat{\mathbf r}`, `\hat{\mathbf x}/y/z`, φ, λ, Δφ, Δλ throughout. |
| C4 regex `\\` | pass | Lint C4: 0. cs_lib's new FRAC_ROW test is `/\\dfrac/`. |
| D1 one colour convention | **fixed** | The radius a and the position arrow were teal. They are now ink (`RAD = C.ink`, cs_lib) on 48 lines across cs_sA/sB/sC, including the s35 recap minis and the end-card icon. The ground-speed arrows (eastward, round the axis) stay teal. The storyboard colour contract is updated. |
| D2 data frames | pass | s34 ERA5 maps have the source line and the °C colour bar. The s26 panels and globes are Blue Marble imagery (source line, no value scale). |
| D3 recap at full contrast | **fixed** | s35: each beat used to start fading 10 frames before its sentence ended (gaps are 10–11 frames). Now it stays full until SE(j), and the next beat enters 8 frames after its sentence starts (swap gap kept). |
| E1 skip pattern | **fixed** | The chip read "every step: optional / not needed for the intuition / skip to"; it now reads Part 1's "every step · optional / skip to mm:ss" (the chip box height follows the line count). The s27 S4 lead-in said only "not needed for the intuition"; it now says "…of weather, climate science or mapping". The s08, s14 and s22 lead-ins already did. All four keep lines start "If you skipped, here's what to keep". Chip times come from `keepTime()` on timing.json, so they match the captions by construction; chapter marks and skip blocks are re-synced by make_timing.py `--sync`. |

## Narration changed (script.md + storyboard.yaml + checks/revoice.py; timing estimated, no TTS)
- s27 S4: "They're for anyone who wants every step, and not needed for the intuition **of weather, climate science or mapping**, so feel free to skip ahead to the time on screen."
- Total 2900.003 → **2902.464 s** (7 estimated sentences in all, 6 of them from the calculation audit).

## Gates
- Data build `movies/data/build_ch00_coordinates_sphere.py`: **72/72 CHECK pass**, 2 flags (DS24, unchanged).
- Static gates `checks/cs_static.sh` now include the symbol lint (`--strict`). Final results are in the reply.
