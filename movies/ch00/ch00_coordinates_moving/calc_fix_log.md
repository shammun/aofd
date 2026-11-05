# ch00_coordinates_moving (#5e, Part 5) — calculation & sync audit fixes (2026-11-05)

Source: `reports/ch00_movies.md` § "#5e ch00_coordinates_moving — calculation & sync audit" (1 Must, 5 Should). All applied.
Light build only: no final TTS, no sound mix, no stills, no render.

## Items
| Item | What changed | Where |
|---|---|---|
| E1 (Must) | South point to 2 decimals (decision): v′ = (13.47, 8.44) − (13.78, 4.75) = (−0.31, 3.69) ≈ (−0.3, 3.7); |v′| = √(0.31² + 3.69²) ≈ 3.7; north |v′| = √(324 + 102) ≈ 20.6 | `mv_sB.tsx` S10 |
| E2 | Where 13.54 and 0.111 come from: u = 10 + 5 sin(2πx/200 km); x = 25 km: 10 + 5 sin 45° = 10 + 3.54 = 13.54 m/s; "slope of sin(kx) is k cos(kx)" (restated); 5 × 2π/200 × cos 45° ≈ 0.111 (m/s)/km. Then 13.54 − 10 = 3.54, 3.54 × 3.6 ≈ 12.7 km/h; unit row (km/h)·((m/s)/km) = (m/s)/h; 10 × 3.6 = 36 km/h; 13.54 × 3.6 ≈ 48.7 km/h. Optional narration taken (re-voiced S2, S5 with 13.54 / 3.54); callout "13.54 m/s" | `mv_sA.tsx` S07 |
| E3 | The 00 → 06 UTC move with Part 3's flat rules: 00 h 49.667° N 5.717° W, 06 h 50.516° N 1.505° W; Δy = 6371 × 0.849 × 0.01745 ≈ 94.4 km; φ_mid = 50.09°; Δλ = 4.212 × 0.01745 = 0.07350 rad; Δx = 6371 × cos 50.09° × 0.07350 ≈ 300.4 km; √(94.4² + 300.4²) ≈ 315 km; 315 000 m ÷ 21 600 s ≈ 14.6 m/s; tan β = 300.4 ÷ 94.4 ≈ 3.18 ⇒ β ≈ 72.6° on average, muted "at the start: 71°". **Note:** the audit's 103/298 km were back-computed from 71°; the track itself gives 94/300 (flat average 72.6°; the great circle leaves at 71.0° and turns ≈ Δλ sin φ = 3.2°). The voice keeps "seventy one" (the start bearing used for U); optional narration not taken | `mv_sB.tsx` S08 |
| E4 | Middle of the side: U·θ̂ = |U| ≈ 14.6; out to ±45°: average cos ≈ 0.906; 14.6 × 0.906 ≈ 13.2; north "against the spin ≈ −13.0"; picture: θ̂ (key) and U (orange) arrows at five ring points (−40°…+40°) with U·θ̂ = 11.4, 14.6, 11.3 (data, every second point) | S11 |
| E5 | |∇p| ≈ 0.062 hPa/km towards 63°; along 71°: 0.062 × cos 8° ≈ 0.061 (the ∇p and U arrows with their 8° arc were already drawn) | `mv_sC.tsx` S15 |
| E6 | |U| ≈ 14.58 m/s × 3.6 ≈ 52.5 km/h | S15 |

## Narration lines changed (2 sentences)
- s07 S2: "Take one moment, at a place where the wind is thirteen point five four metres per second, and is getting stronger …"
- s07 S5: "Relative to you, the air at that place moves east at thirteen point five four minus ten: three point five four metres per second, or twelve point seven kilometres per hour."

## Data and CHECK rows
`movies/data/build_ch00_coordinates_moving.py`: flags F1, F2, F3 replaced by rows; new DP43 rows (E1-E6), new data `e3` (track ends, Δy, Δx) and `e4` (U·θ̂ at five points, mean cos); `say.slide` 13.54 / 3.54. **63 checks, 63 pass** (was 49), 0 flags. TSX CHECK_B extended (2-dp inputs, e3, e4).

## Gates
tsc 0 · at_check 294 refs 0 failures · swap_check 0 overlaps, 0 tight swaps · cam_speed 0 · eq_check 11/11 · SSR 4 707 scene-frames 0 errors, 14/14 assets · SSR --3d 3 398 scene-frames 0 errors · make_timing OK. Regex fix applied to swap_check / cam_speed.

## Timing: PROVISIONAL (estimated)
`checks/revoice.py` + `make_timing.py [--sync]`. Total 1318.575 → **1319.548 s** (+0.97 s); skip chip times shifted (16:30, skip to 18:03).
