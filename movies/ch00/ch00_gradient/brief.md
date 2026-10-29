# ch00_gradient — brief (movie-director, 2026-10-28)

Series plan v2 (APPROVED, `movies/ch00/series_plan_v2_proposal.md`), **Stage 1 · #6 "The gradient"**: gradient operator,
directional derivative, pressure and temperature gradients. It may use only the movies above it (#1a, #1b, #2, #3, #4, #5
and Stage 0: 0.1/0.1b dot product, 0.2 cross product, 0.3 weather basics) and it **stands on its own**: the total
differential (#4), the dot product's cosine form (0.1b), unit vectors and index notation (#1a), the arc lengths
a dφ and a cos φ dλ (#5), pressure, isobars, fronts and hydrostatic balance (0.3) are each restated in a sentence where
they are used.

**Not absorbed (pointed to):** #6A *Contour maps and isolines* (what an isoline is, contour interval, reading highs, lows,
ridges, troughs and cols) and #6B *How contour maps are made* (stations → grid, interpolation, contouring, artefacts). This
movie uses contour lines, isotherms and isobars only as "lines where the field is the same" (s12), gives the one reading
rule the gradient needs ("crowded lines mean a big gradient", s14) and names both movies (s12; s16 points to #6B with the
scale-dependence of a gradient). Divergence (#7), curl (#8), Laplacian (#9), material derivative (#10), pressure
coordinates (#23A), Coriolis/geostrophic balance (#29), gradient wind (#30), thermal wind (#32), fronts (#40) and the
Gulf Stream (#53) are pointed to, never depended on.

House style `movies/HOUSE_STYLE.md` is binding: s00 opening title + one sentence → hook question → building blocks →
intuition → why ("three good reasons", s19–s21) → applications → "To sum up" recap → series end card. Voice Kokoro
`af_bella` ×1.0, informal Chapter-0 voice, `[beat]` holds after worked calculations, no headings except the title,
keywords on screen, no references, badges or URLs, type floor 44 px, caption band y 880–1040 empty, its own music score
(`steepest-ascent`, new). Memory rules: no equation labels or footnotes on screen; every new symbol explained in words;
standard terms ("scalar field", "gradient", "del operator", "directional derivative", "contour line", "isotherm",
"isobar", "pressure gradient force", "lapse rate", "tropopause", "hydrostatic balance", "front", "sea breeze",
"jet stream", "reanalysis"); "the way the temperature increases fastest" for ∇T (never "uphill" for temperature —
"uphill" is used only for real terrain).

## Audience
First-year calculus, no climate background. Defined at first use: field, scalar field, partial derivative (recalled),
total differential (recalled as "a small change is slope × step, summed"), gradient, nabla / del, grad, unit vector
(recalled), del operator, index notation (recalled), kelvin step = Celsius step, gradient field, reanalysis / ERA5
(recalled), directional derivative, unit vector n hat, angle alpha (direction) vs theta (between n̂ and ∇h), contour line,
isotherm, isobar, ETOPO (global relief data set), Chamonix/Mont Blanc (places), steepest descent (in words), radiosonde,
tropopause, lapse rate (both sign conventions), latitude φ / longitude λ / Earth's radius (recalled), pressure (recalled),
hectopascal (recalled), density ρ, pressure gradient force, Coriolis effect (named, pointer), friction (named), gradient
wind (warned: a different idea), GFS (an American weather model), hydrostatic balance (recalled), front (recalled), air
mass, advection (recalled), fixed thermometer, material derivative (named), sea breeze, jet stream, thermal wind (named),
Gulf Stream, sea-surface temperature.

## The promise (s00)
"In this video, we'll learn the gradient the easy way, and see how meteorology uses it to find which way the air is pushed,
and why the wind blows hardest where the isobars crowd together."
Title 'The' / 'gradient' / 'made easy' / 'and how meteorology uses it' (application word in teal).

## Real moments carry the movie (planning numbers computed 2026-10-28 with tested fluidpy functions on files on disk)
1. **Mont Blanc** (ETOPO 2022 60″ Alps subset, on disk; Cesium drape — the user liked it): Chamonix 1035 m → summit 4806 m
   (cited elevations; ETOPO smooths the summit to 4169 m) over 10.06 km (great circle) → average slope 0.375; ETOPO
   |∇h| up to 0.60 within the massif; Alps-box median 0.025. Himalaya at 20′ blocks: 4.9 % near Everest, pointing 345°
   (NNW, towards the plateau); Ganges plain median 49 m, plateau median 4926 m.
2. **Storm Ciarán, 18 UTC 1 Nov 2023, 850 hPa temperature** (ERA5, the #4 moment): at Brest ∂T/∂x −3.20, ∂T/∂y −2.49 K per
   100 km, |∇T| 4.06 pointing 232°; hand centred difference 4.511 vs 5.691 °C over 2 × 18.42 km (−3.20) vs the
   no-cosine mistake (−2.12, a third too small); wind 34.0 m/s at 137.8° to ∇T → ∂T/∂s −3.01 K/100 km → v·∇T −3.68 K/h.
   Front band max |∇T| 11.4 vs map median 0.96 K/100 km.
3. **Storm Ciarán, 03 UTC 2 Nov 2023, sea-level pressure** (ERA5; centre 953.6 hPa at 50.12 N 3.73 W by the continuity
   tracker of #5): at Brest |∇p| 12.87 hPa/100 km (isobars 4 hPa per 31 km), ∇p towards 197°, PGF 0.0103 m s⁻² (ρ 1.25)
   ≈ +37 m/s per hour if unopposed; over the sea (9290 points) mean 10-m wind rises from 10.0 m/s (|∇p| < 2) to 25.6 m/s
   (|∇p| > 10), correlation 0.63; Brest airport gust 84 kt (ISD SYNOP, same hour); cited: Pointe du Raz 207 km/h gust,
   > 1 million French homes without power (research-scout confirms).
4. **Trappes radiosonde, 12 UTC 30 Sep 2026** (IGRA2, newest on disk, the #4 sounding): 19.8 °C at 168 m, tropopause
   13 072 m at −66.3 °C → ∂T/∂z −6.67 K/km (lapse rate +6.7); stratosphere +0.8 K/km to 32.5 km; near-ground
   ∂p/∂z −11.17 Pa/m (1 hPa per 8.95 m) vs ρg 11.64 Pa/m (ρ 1.186) → 866× Ciarán's horizontal gradient, ~11 000× an
   ordinary 1 hPa/100 km.
5. **Normandy coast, 13 UTC 24 Jun 2024** (ERA5 t2m + MODIS 250 m, on disk from 0.3): 24.6 °C inland (49.25 N 0 E) vs
   16.1 °C over the Channel (49.75 N) over 55.6 km → 15.3 K/100 km; the sea breeze explained (D5 adds the observed
   onshore wind).
6. **The jet above the strongest temperature gradient** (ERA5 monthly Nov 2023 zonal means, on disk): 850–300 hPa
   layer-mean ∂T/∂y steepest −6.98 K/1000 km at 44 N; geostrophic zonal wind max 31.5 m/s at 42 N, 250 hPa (10.43 km).
   **Latest:** GFS 28 Oct 2026 18 UTC 250 hPa jet 66.1 m/s (238 km/h) at 40 N 51.75 W; GFS 27 Oct 2026 18 UTC low
   960.6 hPa just east of Iceland, sea gradient up to 10.4 hPa/100 km, 10-m wind up to 25.6 m/s.
7. **Gulf Stream north wall** (D7 OISST newest day; numbers added at build).

## What is taught (in order; 40 scenes)
| Block | Scenes | Idea | Real data / tested function |
|---|---|---|---|
| Title, hook | s00–s01 | promise; question | title hill; Ciarán msl; Mont Blanc drape |
| Fields, partials | s02–s03 | scalar field; ∂h/∂x = 30, ∂h/∂y = 40 m/km on a foggy hillside | ETOPO; `core.operators.gradient` |
| The sweep | s04–s05 | climb in every direction by the total differential (NE 49.5); peak 50 at 53° = the arrow (30, 40) | `geo.calculus.total_differential`, `core.operators.directional_derivative` |
| Definition | s06–s08 | ∇h = x̂ ∂h/∂x + ŷ ∂h/∂y (nabla, del, grad); the del operator, (∇f)_i = ∂f/∂x_i; units | Kundu printed p. 53, App. B p. 862 |
| Gradient field | s09 | ∇T over Brittany, Brest 4.1 K/100 km towards 232° | `geo.sphere.gradient` (ERA5 850) |
| Directional derivative | s10–s13 | derivation dh/ds = ∇h·n̂ (one move per step); why steepest (cos θ ≤ 1); why ⟂ contours; four walkers 50/25/0/−50 | `core.operators.directional_derivative`, `geo.vectors.*` |
| Spacing and scale | s14–s16 | interval/spacing; Mont Blanc 0.375, 60 %; steepest descent; scale dependence (Himalaya 5 %) | `geo.sphere.gradient`, `geo.terrain.*`, NEW G3 `descent_path` |
| 3-D | s17–s18 | radiosonde ∂T/∂z −6.7 K/km, lapse rate; 165× the horizontal; thin layer | `data.igra`, `diag.sounding.layer_lapse_rate` |
| Why | s19–s21 | three good reasons: one arrow for every direction; independent of axes (30° → 46, 19.6, length 50); nature responds to gradients | `core.tensors.rotation_matrix_2d` |
| Sphere | s22–s23 | (2.31) with r = a; the 1/(a cos φ) factor; Brest worked example (−3.20 vs −2.12); Svalbard 5× | `geo.sphere.arc_lengths`, `gradient` |
| Pressure gradient force | s24–s28 | pressure recap; box derivation of (1.47); −(1/ρ)∇p; high → low; easy 0.001 Pa/m → 0.0008 m s⁻² → 3 m/s per hour; Ciarán 13 hPa/100 km → 0.01 m s⁻² → 37 m/s per hour | NEW G1 `geo.atmos.pressure_gradient_force`, `diag.cyclone.track_by_continuity` |
| Crowded isobars | s29–s31 | binned 10-m wind vs |∇p|; Brest gust; cited impacts; why along the isobars (Coriolis pointer, friction, "gradient wind" warning); the latest GFS chart | `geo.sphere.gradient`, NEW G2 `binned_mean` |
| Vertical pressure gradient | s32 | 1 hPa per 9 m; 870× / 10 000×; hydrostatic (1.51) 11.6 vs 11.2 Pa/m; pressure coordinates pointer | `data.igra` |
| Temperature gradients | s33–s37 | fronts (11 vs 1 K/100 km); advection = |v| ∂T/∂s (−3.7 K/h); sea breeze 15 K/100 km; jet above the 44 N gradient (31.5 m/s; today 66 m/s); Gulf Stream north wall | `diag.fronts`, `diag.advection`, `geo.atmos.geostrophic_wind_from_height` |
| Recap, end | s38–s39 | "To sum up, …"; maths-tutorial end card with the related-movies row | — |

## Ending
**Maths ending** (HOUSE_STYLE §3: "The pure maths movies (dot product, grad/div/curl…) keep the maths-tutorial ending"),
as #4 and #5.

## Length
Set by the teaching. Measured in the dry run: see `script.md` (top) and `storyboard.yaml` (`dry_run`).

## Cross-references (user rule 2026-10-27)
Spoken pointers: derivatives and Taylor (#4: s03, s04, s25), vectors (#1a: s06, s07), dot product (0.1b: s10, s34),
coordinates (#5: s22), weather basics (0.3: s24, s32, s33), divergence / curl / Laplacian (#7–#9: s07), contour maps and how
they're made (#6A, #6B: s12), Coriolis (#29: s30), gradient wind (#30: s30), pressure coordinates (#23A: s32), material
derivative (#10: s34), thermal wind (#32: s36), ocean currents (#53: s37). End card related row: titles only. `related:`
per scene in the storyboard.

## Open questions for the orchestrator
1. **s37 Gulf Stream numbers wait for D7** (OISST v2.1, newest day; nothing for the Gulf Stream is on disk). The dry-run
   wording is qualitative ("several degrees within a few tens of kilometres"); after D7 the builder writes the measured
   drop and distance into S3 and re-measures (≈ +3 s). Recommendation: fetch D7 (open, < 5 MB). Runner-up: GHRSST MUR
   0.01° (Earthdata account is set up; sharper front, but heavier).
2. **Cited Ciarán impacts (s29 S6)**: Pointe du Raz gust 207 km/h and "more than a million homes in France lost power" are
   from memory of Météo-France / Enedis reports and must be confirmed by the research-scout before the build. Fallback:
   drop S6 (the Brest gust in S5 is from our own ISD file).
3. **Sea breeze wind (s35)**: the temperature gradient is measured; the onshore wind is explained, not shown with numbers.
   D5 (ERA5 u10/v10 06–18 UTC that day + IEM METAR at Deauville, Caen, Le Havre) would let the builder draw the real
   onshore turn. Recommendation: fetch D5; if the coastal winds did not turn onshore that afternoon, keep the explanation
   generic (it is) and draw the arrows as a cartoon (listed as illustrative).
4. **Mont Blanc imagery and DEM** (s15–s16): ETOPO 60″ is on disk (summit smoothed to 4169 m); D1 ETOPO 15″ makes the
   drape crisper. Imagery: D2 Sentinel-2 cloudless (EOX, CC BY-NC-SA; allowed by the series' noncommercial rule) or GIBS
   true colour. Recommendation: D1 + D2.
5. **Music**: add the new style `steepest-ascent` (spec in the storyboard) to `tools/sound/styles.py`; runner-up
   `sun-radiant` (not yet used by a finished movie).
6. **Equation symbol clash (s22), decided:** Vallis (2.31) writes the scalar as φ and latitude as ϑ; this series writes
   latitude φ (from #5). On screen the scalar is **F**: ∇F = i (1/(a cos φ)) ∂F/∂λ + j (1/a) ∂F/∂φ + k ∂F/∂r
   (`on_screen_eq.latex` of s22). The narration says "partial by partial lambda" without naming the field, so no
   re-wording is needed. Flagged for the reviewer, not for the user.
