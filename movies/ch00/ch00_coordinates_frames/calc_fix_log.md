# ch00_coordinates_frames (#5d, Part 4) — calculation & sync audit fixes (2026-11-05)

Source: `reports/ch00_movies.md` § "#5d ch00_coordinates_frames — calculation & sync audit" (0 Must, 8 Should). All applied.
Light build only: no final TTS, no sound mix, no stills, no render.

## Items
| Item | What changed | Where |
|---|---|---|
| D1 | Re-voiced s09 S3 "about seventy nine kilometres" (Part 2's 79; our own interpolation 79.4 km); callout "centre ≈ 79 km west" | `fr_sA.tsx` S09 |
| D2 | s09 maths as one stack, every move on screen: cos φ = 0.922, sin φ = 0.388; cos λ = 0.007, sin λ = 1.000; k̂_K = (0.922 × 0.007, 0.922 × 1.000, 0.388) ≈ (0.006, 0.922, 0.388); k̂_B·k̂_K = 0.662 × 0.006 + (−0.052) × 0.922 + 0.748 × 0.388 = 0.004 − 0.048 + 0.290 = 0.246; cos⁻¹ 0.246 ≈ 75.8°; î_K = (−sin 89.6°, cos 89.6°, 0) = (−1.000, 0.007, 0) ≈ −x̂; î_B·î_K = 0.078 × (−1.000) + 0.997 × 0.007 = −0.078 + 0.007 = −0.071; cos⁻¹(−0.071) ≈ 94° | S09 |
| D3 (a) | Second coast point named **Englewood** (4 km away; Venice FL is 22 km): re-voiced s11 S2 and S4, map label, storyboard notes | `fr_sB.tsx` S11 |
| D3 (b) | 1° = 0.01745 rad; Δφ = 0.823 × 0.01745 = 0.01436 (re-voiced s11 S9 "zero point zero one four three six", both places); Δλ = −0.553 × 0.01745 = −0.00965 rad | S11 |
| D3 (c) | φ_mid = (26.10 + 26.92)/2 = 26.51° ≈ 26.5° | S11 |
| D4 | Option chosen to keep CHECK rows strict: 2-dp products 22.2 × (−0.857) = −19.03, 24.3 × (−0.515) = −12.51, sum −31.54 ≈ −31.5, "roughly −32"; check 9.4² + 31.5² ≈ 88 + 992 = 1080, √1080 ≈ 32.9 ≈ 33 (re-voiced S9 with 31.5 / 1080 / "about thirty three"); summary "across ≈ −31.5"; the muted "unrounded: −31.6" removed. TSX CHECK compares the data (−31.57) with the shown sum −31.54 (tol 0.05) | S14 |
| D5 | 10 / 4 230 000 ≈ 2.36 × 10⁻⁶ ≈ 2.4 × 10⁻⁶ rad/s; 2.36 × 10⁻⁶ × 86 400 ≈ 0.204 rad; 0.204 × 57.3° ≈ 11.7° ≈ 12° | S19 |
| D6 | ĵ at Brest from its products with Part 3's 4-decimal sines/cosines (the 3-decimal ones round to −0.746 and 0.058): (−0.7478 × 0.9969, −0.7478 × (−0.0785), 0.6639) ≈ (−0.745, 0.059, 0.664) | S06 |
| D7 | The puck's first guess: uv tan φ / a = 10 × 10 × 1 / 6 371 000 ≈ 1.57 × 10⁻⁵ m/s²; × 86 400 s ≈ 1.4 m/s; u ≈ 10 + 1.4 = 11.4; muted "full great-circle path: 11.5" (the audit's "(notebook)" left out: no references on screen) | `fr_sC.tsx` S26 |
| D8 | s08: 2.01° − (−4.49°) = 6.50°, 6.50 × 73.8 km ≈ 480 km; s27: sin 45° ≈ 0.707; s07: ĵ·k̂ = −0.493 − 0.003 + 0.497 ≈ 0, k̂·î ≈ 0.052 − 0.052 + 0 = 0 | S07, S08, S27 |

## Narration lines changed (5 sentences)
- s09 S3: "…passed about seventy nine kilometres west of Khulna…"
- s11 S2: "And one near Englewood, further up the coast, …"
- s11 S4: "Going from Naples to Englewood, the latitude grows by …"
- s11 S9: "Zero point eight two three degrees is zero point zero one four three six radians, so the step north is six thousand three hundred and seventy one times zero point zero one four three six: about ninety one and a half kilometres."
- s14 S9: "A check: nine point four squared, plus thirty one point five squared, is about one thousand and eighty, and its square root is about thirty three, the full wind."

## Data and CHECK rows
`movies/data/build_ch00_coordinates_frames.py`: DP09 now checks 79.37 → 79 (flag removed); DP11, DP14, DP06 flags replaced by rows; new DP14 (D4) and DP30 (D2, D3, D5-D8) rows. **82 checks, 82 pass** (was 68), 1 flag left (DP07, not in this audit). fr.json unchanged.

## Gates
tsc 0 · at_check 380 refs 0 failures · swap_check 0 overlaps, 0 tight swaps · cam_speed 0 · eq_check 22/22 · SSR 8 386 scene-frames 0 errors · SSR --3d 6 067 scene-frames 0 errors · make_timing OK. Regex fix applied to swap_check / cam_speed.

## Timing: PROVISIONAL (estimated)
`checks/revoice.py` + `make_timing.py [--sync]` (as Part 3). Total 2360.975 → **2362.087 s** (+1.11 s); skip_guidance chip/skip times shifted (e.g. block B skip to 30:39).
