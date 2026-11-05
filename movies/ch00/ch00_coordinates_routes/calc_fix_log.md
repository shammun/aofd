# ch00_coordinates_routes (#5f, Part 6) — calculation & sync audit fixes (2026-11-05)

Source: `reports/ch00_movies.md` § "#5f ch00_coordinates_routes — calculation & sync audit" (0 Must, 4 Should). All applied, visual only.
Light build only: no final TTS, no sound mix, no stills, no render.

## Items
| Item | What changed | Where |
|---|---|---|
| F1 | s11, each on its spoken number (muted inputs, gold results): î₁ = (0.002, 1.000, 0), ĵ₁ = (−0.783, 0.002, 0.622); e = r̂₂·î₁, n = r̂₂·ĵ₁; e = −0.001 − 0.730 = −0.731; n = 0.307 − 0.001 + 0.348 = 0.654; tan β = 0.731 ÷ 0.654 ≈ 1.12 ⇒ 48°; 360° − 48° = 312°. Highest latitude from the cross product (taught) instead of Clairaut's rule (new): axis n̂ = r̂₁ × r̂₂ ÷ sin σ; n_z = (−0.454 − 0.000) ÷ 0.981 ≈ −0.463; "highest point: 90° from n̂"; cos φ_max = |n_z| = 0.463 ⇒ 62.4° N. At LA: east 0.549, north 0.813; tan = 0.549 ÷ 0.813 ≈ 0.675 ⇒ 34°; 34° + 180° = 214°. The three old result labels are replaced by these rows | `rt_sC.tsx` S11 |
| F2 | Decision: derived in Part 6 itself. s12 (S1-S3): ψ = ln tan(45° + φ/2) (Part 7: why); ψ_London = ln tan 70.755° = 1.0523, ψ_LA = ln tan 62.025° = 0.6327; Δψ = 0.6327 − 1.0523 = −0.4196; Δλ = −118.11° = −2.0614 rad; tan α = 2.0614 ÷ 0.4196 ≈ 4.913; α ≈ 78.49° west of south; 180° + 78.49° ≈ 258.5°; Δφ = −17.46° = −0.30473 rad; s = 6371 × 0.30473 ÷ cos 78.49° = 1941.4 ÷ 0.19947 ≈ 9733 km | S12 |
| F3 | Brest → Lisbon with the flat recipe: Δy = 9.67° × 111.2 ≈ 1075 km; Δx = 4.65° × 111.2 × cos 43.56° ≈ 375 km; √(1075² + 375²) ≈ 1139 km (great circle: 1138) — the flat recipe is honest to < 1 km here; "+ ≈ 150 m" gets the muted note "(the length rule, more digits)" (no "(notebook)": no references on screen). Magnifier moved down to make room | S13 |
| F4 | s03: 6371 × 0.01745 ≈ 111 km and 111.2 × cos 78.2° ≈ 23 km under the two keywords (row only; the optional voice not taken) | `rt_sA.tsx` S03 |

## Narration lines changed
None.

## Data and CHECK rows
`movies/data/build_ch00_coordinates_routes.py`: new DM20 (F1, F4) and DM21 (F2, F3) rows. **55 checks, 55 pass** (was 42), 2 flags left (DM11 σ roundings, verified as fine in the audit). rt.json unchanged.

## Gates
tsc 0 · at_check 174 refs 0 failures · swap_check 0 overlaps, 0 tight swaps · cam_speed 0 · eq_check 7/7 · SSR 3 581 scene-frames 0 errors · SSR --3d 2 580 scene-frames 0 errors · make_timing OK (unchanged, 1017.375 s). The regex fix was already present.

## Timing
Unchanged (no narration change); still the provisional dryrun2_spliced timing.
