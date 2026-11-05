# ch00_coordinates_maps (#5g, Part 7) — calculation & sync audit fixes (2026-11-05)

Source: `reports/ch00_movies.md` § "#5g ch00_coordinates_maps — calculation & sync audit" (1 Must, 6 Should). All applied.
Light build only: no final TTS, no sound mix, no stills, no render.

## Items
| Item | What changed | Where |
|---|---|---|
| G1 (Must) | The "speed up" table filled (decision): rows 30–40° … 70–80° with middle, 1/cos (1.221, 1.414, 1.743, 2.366, 3.864), drawn (0.213, 0.247, 0.304, 0.413, 0.674) and running total; row pitch 52 px, cells 46 px; each row about 1.3 s before its spoken total. Totals shown are the sums of the shown steps (0.762, **1.009**, 1.313, 1.726, 2.400; exact 1.0084, said "one point zero one") so the arithmetic on screen is exact | `mp_sB.tsx` S09 |
| G2 | The spoken Brest (48.4° N, 4.5° W, as Part 3): ×π/180 = 0.8447, −0.0785 (the audit's "× 0.01745" gives 0.8446, so the exact factor is written); x = 6371 × (−0.0785) ≈ −500; y = 6371 × 0.8447 ≈ **5382** km (decision); callouts and s10's flat-map label 5382. Re-voiced s04 S15-S17 and s10 S16. (Part 7's data used 48.39/−4.49; the screen numbers now come from new data fields at 48.4/−4.5, the map markers keep 48.39) | `mp_sA.tsx` S04, S10 |
| G3 | tan 69.2° ≈ 2.6325, ln 2.6325 ≈ 0.968, 0.968 × 6371 ≈ **6167** km (decision); re-voiced s10 S14 ("two point six three two five") and S15 ("six thousand one hundred and sixty seven") | S10 |
| G4 | Cross-check of Part 6 (decision: Part 7 is the cross-check): "check: y = a ln tan(45° + φ/2)"; London 1.0523 a, LA 0.6327 a; Δy = −0.4196 a, Δx = −2.0614 a; 2.0614 ÷ 0.4196 ≈ 4.9 ⇒ 258.5° (on "four point nine") | S12 |
| G5 | (90° − 72.9°) × 111.2 ≈ 1900 km; ratio = 33 ÷ 17.5 ≈ 1.9; ratio = 20 ÷ 47 ≈ 0.4; bar labels "in/out (rms)" (keeps "typically" in the voice) | `mp_sC.tsx` S21 |
| G6 | Muted two-line slate "31°: from the / Equal Earth formulas" during S10 (the gold Tissot patch at 60° N, 30° E was already on both maps); "(notebook)" left out | S14 |
| G7 | s11: 85°: y ≈ 3.131 a, 3.131 × 6371 ≈ 19 950 km; s18: 10 hPa ÷ 1013 hPa ≈ 0.01; s08 left as is (the audit found it fine) | S11, S18 |

## Narration lines changed (6 sentences)
- s04 S15: "In radians, that's zero point eight four four seven, and minus zero point zero seven eight five."
- s04 S16: "So x is six thousand three hundred and seventy one times minus zero point zero seven eight five, about minus five hundred kilometres: just west of the middle line."
- s04 S17: "And y is six thousand three hundred and seventy one times zero point eight four four seven, about five thousand three hundred and eighty two kilometres."
- s10 S14: "Its tangent is two point six three two five, and its l n is zero point nine six eight."
- s10 S15: "…above the equator, about six thousand one hundred and sixty seven kilometres."
- s10 S16: "On the flat square map, it was five thousand three hundred and eighty two."

## Data and CHECK rows
`movies/data/build_ch00_coordinates_maps.py`: new rows in DM16 (G2), DM20 (G1: 1/cos, drawn, shown running totals = sums of shown steps, each within 0.001 of the exact), DM21 (G3; flag F2 removed), DM22 (G4), DC37 (G5, G7); new data `pc.brest_s*`, `ln.yB_s*`, `ln.tanB_s`. **122 checks, 122 pass** (was 111), 2 flags left (F1 s08 167.4, F4 areas; both judged fine in the audit). TSX CHECK_A/B extended.

## Gates
tsc 0 · at_check 407 refs 0 failures · swap_check 0 overlaps, 0 tight swaps · cam_speed 0 · eq_check 13/13 · SSR 6 935 scene-frames 0 errors, 10/10 assets · SSR --3d 5 006 scene-frames 0 errors · make_timing OK. Regex fix applied to swap_check / cam_speed.

## Timing: PROVISIONAL (estimated)
`checks/revoice.py` + `make_timing.py [--sync]`. Total 1949.1 → **1949.810 s** (+0.71 s); maths_skip / chapter_marks times shifted. `dry_run.with_end_hold_s` is not refreshed (the final TTS rewrites it).
