# ch00_derivatives_taylor — fix loop 3 log (source only, 2026-11-04)

Input: `reports/ch00_movies.md` → "ch00_derivatives_taylor — review 3" (9 Must, 12 Should). TSX only; no TTS, timing, data or
asset change (timing.json, narration and the fix-2 mix are reused unchanged; 88 422 frames as before).
Files: `movies/src/ch00_derivatives_taylor/DerivativesTaylor.tsx` (DT), `movies/src/ch00_derivatives_taylor/dt_lib.tsx` (lib).
Line numbers are in the working copy after this loop. Not rendered (no Chrome job allowed in this run): every position below was
set from the review-3 frames plus computed geometry, and still needs the K6 pass and a look at the frames.

## Must
| id | scene | change | where |
|---|---|---|---|
| M1 | s19 | "17 km" callout moved from y 540 to y 600 (bend −12), so its link runs under "−11.0 °C" (≈ 37 px clear) to the drift end; the `data-lc-maplabel` exemption on the isotherm labels is removed | DT:1489-1500 |
| M2 | s19 | "−2.6 °C in 12 h" now sits right of the bracket, level with it (x ≈ 660, y 170); both curves pass ≤ x 600 there; the two `data-lc-ok` exemptions on the curves are removed | DT:1459-1467 |
| M3 | s07 | map 920 × 560 (same 538 px/°, ends y 600); one label row at y 645 spaced ≥ 40 px: "colder (north)" x 110, "18.4 km" x 450, "27.8 km" x 660; each link only during its sentence (`linkEnd`: 18.4 to S3, 27.8 to S6, both "colder" to S7); 18.4 and 27.8 fade out before S7; "colder (north)" link is an explicit curve up the map's left side to the arrow head (never along the arrow, no link crossings); 27.8 targets the N–S bracket between the W–E bracket and the south dot; "gradient" takes x 450 on S7 | DT:575-578, 609-623, 645 |
| M4 | s08 | pressure axis 970–1000 hPa with a 970 tick; 977.7 / 976.0 stay inside the graph; dots/labels re-checked against the new scale | DT:652-654, 699 |
| M5 | s20 | CalcStack 50 px from y 360; bar chart 40 px higher (axis y 598–822, labels ≥ 10 px above their bars); dashed +3.7 guide now only from the dashed bar to the place bar's top (no longer cuts "+2.9"); source line shortened ("Data: ERA5 (C3S) 850 hPa temperature, wind · 1 Nov 2023, 18 UTC · Brittany", one line, ends ≈ x 1100) | DT:1582-1616, 3005-3006 |
| M6 | s36 | "line, series: too cold" (on the measured profile) replaced by a rose "too cold" just above the rose dashed curves' left ends (−74.6 °C, 14.95 km), left of the profile | DT:2354-2356 |
| M7 | s34 | link from the 1-km ring removed; the gold ring carries its own value "880.4" below-left (no curve there) | DT:2265-2267 |
| M8 | s09b | all five layers reveal from frame 0 (6 frames apart); two muted lines on the first frame: "holes: no 1000 hPa level" / "where the ground is higher" (until S1) | DT:865-867, 933-935 |
| M9 | s07, s08, s11, s12, s13, s14, s16, s17, s37, s47 | colour bars added. Maps: the s04 bar (`T850Bar`, −4/4/12 °C) at (130, 742) under the map in s07, s12, s16, s17; in the text column in s08 (x 1300, y 455, title on two lines, fades with the map), s37 beat 4 and s47 S3/S5 (x 1120/1100, y 742, two-line title). Landscapes (s11, s13, s14): box 940 × 620 (`LAND_BOX`) and the s05 bar ("temperature (°C) = height", new `LandBar`) at (130, 742); s37 beat 1 and s47 S2 get `LandBar` in the column. s07, s12: map 560 px tall (same scale); s16/s17: flight map 920 × 320 strip (same scale), readings y 400, s16 graph y 470–560, "if the rates held" y 646, s17 summary rows y 480 / 590. lib: `ColourBar` accepts a two-line title | DT:146-151, 407-408, 709-713, 1018-1019, 1061-1063, 1086, 1121, 1175, 1259-1261, 1324, 1369, 2413-2416, 2931-2933; lib:133-139 |

## Should
| id | scene | change | where |
|---|---|---|---|
| S1 | s15 | isotherms only from y 195 to the road (y 436); car readout + clock moved to the row above the panel (y 80); "100 km/h" rides under the road (y 522); "fixed: no change" y 585; −0.03 bracket/label unchanged in the clean band; `data-lc-contour` / `data-lc-maplabel` exemptions removed | DT:1220-1245 |
| S2 | s07 | "Brest" up-right of the gold dot (pB + 26, −70), clear of the bracket and the west point; map-label exemption removed | DT:609-610 |
| S3 | s43 | thermometer 50 px lower (top y 490, below the dashed bar); label "IPCC 3.2 per °C: ≈ 1.2 °C" | DT:2691-2692, 2699-2700 |
| S4 | s40 | `ESChart` gets `lab`; under the inset its axes and labels fade fully (curve stays at 15 %) | DT:2460-2470, 2533 |
| S5 | s09 | 4.26-km bracket starts 30 px above the 12.3 °C dot (its link start follows); "15 min" 40 px further left | DT:808-816 |
| S6 | s17 | summary thermometer at x 600 (≈ 30 px clear of "−8.6 °C/h"), "+2.9 °C/h" at x 640 | DT:1360-1368 |
| S7 | s17 | place temperature and map hour run on the flight clock (110 km at 360 km/h): place 5.1 → 6.0 °C | DT:1338-1343 |
| S8 | s09b | dim worked line on S1 under the equation: "(2.3 − 20.9) °C / 3.0 km ≈ −6.2" (from stack.trappes; 4 new CHECK rows) | DT:843-845, 943-945 |
| S9 | s09b | close look: in/out moves 1.8 s each (54 frames), whole look ≤ 5.6 s; camera then returns to the low side angle (el 16, az −92 → −96) of S1 | DT:876-883 |
| S10 | s42 | "≈ 240 W/m² global average" has no link | DT:2648-2649 |
| S11 | s26 / s32 / s03 / s26 / s45 | s26 unit line with display fractions at 46 px (y 814), H ≈ … 52 px at y 700; s32 d/dh, d²/dh² rows as `\dfrac` (150-px rows); s03 limit row y 655, d/dx row y 795; s26 ρ/p 50 px at y 335; s45 Taylor lines up 15 px (95 / 210 / 325) | DT:1868-1873, 2179-2182, 343-346, 2787-2790 |
| S12 | various | s02 10.3 °C below-right of its dot, 14.9 °C +24 px right (DT:269-275); s19 bars from x 1370 at 102 px/decade (DT:1441-1446, ticks/values); s23 axis word "x" in the tick row (DT:1738-1739); s27 "exponential" at (650 hPa, 6 km) (DT:1898-1899); s25 "300 K" rises with its cube (DT:1817-1818); s35 "343" right of its dot (DT:2306-2308); s32 "c h²" centred over the parabola (DT:2169-2171); s20 "Brest" named on "Over Brest" (DT:1561-1564); s09 balloon capped ≥ 84 px from the top (DT:759-763); s48 single notebook s 0.4 at y 482 (DT:2967-2968) | — |

## K6 exemptions
Removed: s19 `data-lc-ok` (both curves), s19 `data-lc-maplabel` (isotherm labels), s15 `data-lc-contour` + `data-lc-maplabel`, s07
"Brest" `data-lc-maplabel`. Kept: s20 "air parcel" (review 3: OK), s09b stack labels (not reviewed as hiding anything).

## Checks run (no browser)
- `npx tsc --noEmit` (movies/): 0 errors.
- Node module load of DerivativesTaylor.tsx (esbuild bundle, assets stubbed): all CHECK / SK_CHECK rows pass (incl. 4 new), scene count = timing.json, DT_FRAMES = 88 422.
- Not run: K6 stills, renders, QA (need Chrome / Remotion).

## Fix 3b (after K6 pass 3 on f5838b5: 13 hits) — no exemptions added
| hit | scene | change | where |
|---|---|---|---|
| link-axis (755, 304), 5 frames | s19 | the "∂T/∂z" keyword link now stops 18 px left of / 8 px under the gold profile instead of ending on it (the curve lost its `data-lc-ok` in fix 3) | DT:1468-1469 |
| text-stroke "Brest" × teal streak, 4 frames | s20 | "Brest" moved above-right of the dot (the parcel cube passed under it below-left, frames 34486-34672); once the label is shown, each streak is densified to ≤ 4-px steps and the part inside the label box (+6–8 px) is cut out; every visible run is its own `<path>` (the K6 probe joins the sub-paths of one path, so an M-break still read as a crossing) | DT:1561-1578 |
| text-fill "300 K" on the ground quad, 4 frames | s25 | the warmed parcel's label sits 88 px above its cube's top centre (clear of the top face) and rises with it, never straddling the ground's far edge; "p fixed" moved to x 300 so the two never read as one row | DT:1831-1834 |
| (seen in stills) | s15 | car readout x 572, clock x 925: "made-up frozen map" and "car: …" no longer run together | DT:1241-1242 |

K6 after 3b: `k6_pass3.sh k6final2` → PASS, 1425 frames, 0 hits, 473 INFO (stills and report in v1/fix3/stills/k6final2). No exemption added.
