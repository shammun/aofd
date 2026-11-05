# ch00_coordinates_sphere (#5c, Part 3) — calculation & sync audit fixes (2026-11-05)

Source: `reports/ch00_movies.md` § "#5c ch00_coordinates_sphere — calculation & sync audit" (2 Must, 7 Should). All applied.
Light build only: no final TTS, no sound mix, no stills, no render.

## Items
| Item | What changed | Where |
|---|---|---|
| C1 (Must) | Re-voiced s20 S6 and s21 S4 to "twenty three hours, fifty six minutes and four seconds"; rows `T=23×3600+56×60+4` → `=82 800+3 360+4=86 164 s` (S4, on "is eighty six"); label "one turn: 23 h 56 min 4 s" | `cs_sB.tsx` S20, S21 |
| C2 (Must) | Re-voiced s26 S13 "This is also how, in Part 4, we'll turn a coast's latitudes and longitudes into kilometres."; keyword "Part 4: degrees → km" | `cs_sC.tsx` S26 |
| C3 | Ω = 7.292 × 10⁻⁵ (re-voiced s21 S5 and S7 "seven point two nine two"); U_eq ≈ 464.6 m/s (re-voiced S7 "four hundred and sixty four point six", decision); rows 464.6 × 0.9997 ≈ 464 (Singapore, new), × 0.9219 ≈ 428, × 0.6639 ≈ 308, × 0.2045 ≈ 95; recap s35 S8 re-voiced and its row to 464.6 | `cs_sB.tsx` S21, `cs_sC.tsx` S35 |
| C4 | Rows 2π × 6400 km ≈ 40 000 km; 40 000 ÷ 24 ≈ 1670 km/h; 464.6 m/s × 3.6 ≈ 1670 km/h; 1670 ÷ 900 ≈ 1.9 | S21 |
| C5 | Rows (S8, on "orbit"): 360° ÷ 365 days ≈ 1° a day; noon to noon 360° + 1° = 361°; 24 h = 1440 min; 1440 ÷ 360 = 4 min per 1° (with the existing sun/orbit glyph) | S20 |
| C6 | Khulna rows on their words: sin 22.8° ≈ 0.3875 (S3), cos 22.8° ≈ 0.9219 (S5), cos 89.6° ≈ 0.00698 (S8), sin 89.6° ≈ 1.000 (S9) | S19 |
| C7 | Width rows under the panels on each width word: 27.8 × 0.9997 ≈ 27.8, × 0.9219 ≈ 25.6, × 0.6639 ≈ 18.5, × 0.2045 ≈ 5.7 km | S26 |
| C8 | sin 10° ≈ 0.174, sin 20° ≈ 0.342; rows 0°→10°: 0.174 − 0 = 0.174; 10°→20°: 0.342 − 0.174 = 0.168; 20°→30°: 0.500 − 0.342 = 0.158 (on each spoken step; the band formula row makes room) | S31 |
| C9 | s18: √(4217² + 332²) = √(17 783 000 + 110 000) = √17 893 000 ≈ 4230; √(4230² + 4764²) = √(17 893 000 + 22 696 000) = √40 589 000 ≈ 6371 (the x, y, z lines make room; the coordinates move to the top); s19: 41² + 5873² + 2469² = 1 681 + 34 492 129 + 6 095 961 = 40 589 771, √ ≈ 6371; s32: a² = 6371² ≈ 40.6 × 10⁶ km², 2πa² ≈ 2π × 40.6 × 10⁶ ≈ 255 × 10⁶, 4πa² = 2 × 255 × 10⁶ = 510 × 10⁶; s34: 16.3 − 7.1 = 9.2 °C too cold | S18, S19, S32, S34 |

## Narration lines changed (6 sentences; script.md and storyboard.yaml)
- s20 S6: "…the Earth turns once every twenty three hours, fifty six minutes and four seconds."
- s21 S4: "Twenty three hours, fifty six minutes and four seconds is eighty six thousand one hundred and sixty four seconds."
- s21 S5: "…which is about seven point two nine two times ten to the minus five radians per second."
- s21 S7: "So the ground moves at seven point two nine two times ten to the minus five, times six point three seven one million metres, which is about four hundred and sixty four point six metres per second."
- s26 S13: "This is also how, in Part 4, we'll turn a coast's latitudes and longitudes into kilometres."
- s35 S8: "…about four hundred and sixty four point six metres per second at the equator."

## Data and CHECK rows
`movies/data/build_ch00_coordinates_sphere.py`: DS17 flag (C1) replaced by CHECK rows (23 × 3600, 56 × 60, sum 86 164; C5 360/365, 1440/360, 86 400 − 86 164); DS18 roundings to 464.6 / 464 / 428 / 308 / 95 and the C4 easy-check rows; new DS30 (C6-C9). **72 checks, 72 pass** (was 58), 2 flags left (DS24 s28, not in this audit).

## Gates (static, no browser)
tsc 0 errors · at_check 463 refs 0 failures · swap_check 0 overlaps, 0 tight swaps · cam_speed 0 > 90 °/s · eq_check 24/24 · SSR 10 366 scene-frames 0 errors, 0 NaN, 7/7 assets · SSR --3d 7 497 scene-frames 0 errors · make_timing OK.
swap_check / cam_speed regex fix (`/^(?:export )?const (\w+)/`) applied.

## Timing: PROVISIONAL (estimated)
No TTS run. `checks/revoice.py` gives each re-voiced sentence an estimated clip (measured length × new/old characters) and shifts the rest; `checks/make_timing.py [--sync]` applies it to dry run 3 and writes timing.json (`estimated_sentences` listed) and the storyboard times (scene t, sentence_times, target_duration_s, dry_run.audio_s, chapter_marks, skip_blocks). Total 2896.05 → **2900.003 s** (+3.95 s). The final TTS replaces all of it (`make_timing.py --sync` is idempotent).
