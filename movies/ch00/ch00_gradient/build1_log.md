# ch00_gradient (#6) — build 1 log (motion-builder, 2026-11-04)

Scope of this run (orchestrator): data, TTS, composition, type checks and static (no-browser) gates only. #5's full render held the
machine, so **no Remotion render, still, Chrome/Playwright job or sound mix was started**. Everything that needs a browser is listed
as a command at the end (§5). Machinery reused from #5 (copied, #5's files untouched): `kit_co` → `kit_gr`, `co_lib` patterns
(GeoMap overflow clip, SideCallout, Place = outlined map label), the checks (at_check, swap_check, cam_speed, eq_check, SSR,
co_run.py, label_stills, prerender/render scripts).

## 1. Physics and data — `movies/data/build_ch00_gradient.py`
- Tested fluidpy functions only: `core.operators` (gradient, directional_derivative), `core.tensors.rotation_matrix_2d`,
  `geo.calculus.total_differential`, `geo.vectors` (norm, angle_between), `geo.sphere` (gradient, arc_lengths, great_circle_distance,
  initial_bearing), `geo.terrain` (surface_normals, slope_aspect, descent_path = G3), `geo.atmos` (pressure_gradient_force = G1,
  pressure_gradient_force_cartesian, wind_direction_from), `diag.cyclone` (track_by_continuity, storm_centre),
  `diag.climatology.binned_mean` (G2), `diag.advection.advection`, `diag.fronts.front_fields`, `diag.sounding.layer_lapse_rate`,
  `diag.trajectories.advect_on_sphere`, `data.igra` (find_sounding, fill_heights, wmo_tropopause), `data.movie_gradient.front_tilt`.
- **99 CHECK rows, all PASS** (DG01–DG37 + DG10m, DG13d ×12, DG15s, DG16s, DG31s, DG33b). Parity: **44 light entries, re-run by the
  QA physics gate standalone: PASS, 44 functions reproduce their hashes**; 43 heavy calls recorded by hash.
- Outputs: `data/gr.json` (1214 kB, sha256 7eb85805c98f…), `data/img/` 18 rasters (850 hPa T and |∇T|, Ciarán and GFS 10-m wind
  speed, Mont Blanc 15″ heights and the Sentinel-2 crop, Alps 60″ slope, Himalaya 20′ blocks (nearest-upscaled, blocks stay blocks),
  four Elliott |∇T| layers, Normandy MODIS, GFS 250 hPa jet drape, OISST drape, Singapore Blue Marble floor, the BMNG globe texture,
  zm_t (unused)), `manifest.json` (functions, Vallis/Kundu provenance, parameters, fluidpy 8cab62ebf6 **dirty_tracked: true**
  (uncommitted `fluidpy/diag/axes.py` in ../Fluid Dynamics), sha256 of every input and data file, credits).
- `--public` writes the 18 render assets `gr_*` to `G:/…/ch00_gradient/build1/public` **and to `movies/public`** (3.0 MB).
- **One download**, through `fluidpy.data.gibs.fetch_wms` + the disk guard: MODIS Aqua true colour of the Normandy coast,
  24 Jun 2024, 48.9–50.1 N, 1.6 W–1.6 E, 1280 × 480 (113 221 B; key NASA-GIBS; C: 51.3 → 51.3 GB, G: 470.0 → 469.6 GB). The
  registered A10 image covers 47–49.5 N (Paris basin) and does not reach the Channel probe at 49.75 N. By eye (DG34): fair-weather
  cumulus over the land, a clear strip along the coast, clear sky over the Channel.

### Numbers / definitions that differ from the planning (reviewer: please look)
| row | planning | build 1 | why |
|---|---|---|---|
| DG25 Brest msl | "48.45 N 4.42 W" | the ERA5 **grid point 48.5 N 4.5 W** (as the 850 hPa scenes) | the planning values (12.87 hPa/100 km, 197°, 0.0103, 37 m/s) are the grid-point values; bilinear at the airport gives 12.45. The ISD gust stays the airport. |
| DG25 bracket | isobars every 4 hPa (multiples of 4) | isobars drawn at **954 + 4k** (…966, 970…) | Brest (968.0 hPa) then sits midway between two drawn isobars; the bracket between them along ∇p is 31.7 km (row 31 ± 1.5). With multiples of 4, Brest sits on the 968 line and the next one is 28.5 km away. |
| DG10 | ERA5 contours < 0.05 | the s12 right-angle ticks sit where the drawn contour is smoothest (middle half of its in-box part), errors 0.0003–0.006 | ticks at the raw middle point of the 850 isotherms reached 0.065 |
| DG10m (new) | — | Mont Blanc 60″: median \|cos\| between ∇h and the drawn contour 0.13 (< 0.17 = within 10° of square) | rough DEM at grid scale; builder's visual criterion, not a data_needs row |
| DG13 | 0.60 ± 0.05 | 0.573 on the **60″** grid (arrows + "about sixty percent"); the drape geometry is ETOPO **15″** ×2 (15″ max 1.29) | orchestrator D1 decision ("arrows may keep the 60″ grid") |
| DG33b | data scout's lines | `front_tilt(..., lon_window=(-104, -80))`: the default (−105, −80) put every 850 hPa seed on the below-ground Rockies edge (−105.6°); with −104 the scout's table is reproduced exactly (700: +438/+450/+400; 500: +300/+288/+275; 300: +275/+275/+262 km); fronts at 95.8–93.3 W ("central United States") |
| DG35 | Nov 2023, u_g | **Sep 2026 real zonal-mean u** (D6 decision): −6.37 K/1000 km at 45 N (850–300 hPa, **pressure-weighted**, stated in the manifest); jet 25.66 m/s at 45 N, 200 hPa, Z 12.15 km | spoken "about twenty six" (the scout suggested "twenty five"; 25.66 rounds to 26) |
| DG36 | qualitative | 21.46 → 14.94 °C, 6.52 °C over 34.8 km (29 Oct 2026, preliminary) | D7 measured; S3 now states it |
| DG31s | Trappes 868 / 11 170 | **Singapore** (the §G move): 9.16 m per hPa; Ciarán 31.08 km / 4 = 7.77 km per hPa → ratio **848**; ordinary day 100 km / 9.16 m = 10 917 | spoken "about eight hundred and fifty", "about ten thousand" (10 917 rounds to ≈ 11 000; the script's "about ten thousand" is kept and shown as "≈ 10 000×" — reviewer may prefer "about eleven thousand") |

## 2. Narration — `tools/tts.py` (Kokoro af_bella ×1.0, `.venv-tts`)
Script changes before the final TTS (all recorded in `script.md`'s header and storyboard `build_1.script_changes`):
1. **s29 S6 dropped** ("At the Pointe du Raz … two hundred and seven kilometres per hour"): unverified (orchestrator note 2026-10-28).
   "More than a million homes in France lost power" (Enedis, verified) stays.
2. **s33b_front_stack added** (data_needs §G; orchestrator decision 2026-10-30: keep Elliott 12 UTC and reword): 7 sentences, four
   layers 850/700/500/300 hPa (1000 hPa is below ground on the front and is not shown), "every layer above the bottom one has its
   crowded band on the cold side of the bottom front, between about two hundred and sixty and four hundred and fifty kilometres
   behind it"; place said as "the central United States".
3. **s36 → September 2026 real zonal-mean wind** (D6 decision): "near forty five", "about six degrees per thousand kilometres",
   "about twelve kilometres up", "about twenty six metres per second".
4. **s37 S3 states the measured north wall** (D7): "dropped by about six and a half degrees in about thirty five kilometres", dated
   29 Oct 2026.
5. **s18 S4 sign error fixed**: "grad capital T points almost straight up" → "points almost straight **down**, towards the warmer air
   below" (∂T/∂z < 0, so ∇T points down; caught while drawing the arrow).

Runs: run 1 (before fix 5) 1950.78 s → `G:/…/build1/tts/` (obsolete, 94 MB, kept: deleting scratch was not asked); **run 2 (final)
→ `G:/…/build1/tts2/`: 41 scenes, 304 sentences, 4626 words, narration 1952.90 s + 2.5-s hold = 1955.40 s (32:35.4), 58 662
frames, 141.9 wpm overall (155.3 while speaking), 489 cues, 0 caption warnings, self-check diff 0.0 ms.** Copied `timing.json`,
`en.vtt`, `en.srt` here; storyboard synced to **version 4** (`checks/gr_sync_storyboard.py`: s33b entry, every `t` /
`sentence_times` / voiceover, totals, `build_1` record; `tools/hooks/post_write.py` exit 0).

Music: the storyboard's new style `steepest-ascent` is not in `tools/sound/styles.py` (a tools change), so `sound.yaml` uses the
storyboard's runner-up **sun-radiant, seed 31** (not used by a finished movie). 4 effects (s15 wind_gentle, s16 stream, s29
wind_gusty, s35 waves_breaking; the storyboard names mapped to the library's). `mix.py --check-only`: ok, 4 cues, soundtrack 1955.4 s.
The mix itself was **not run**.

## 3. Composition — `movies/src/ch00_gradient/`
| file | lines | what |
|---|---|---|
| `gr_lib.tsx` | 382 | timing (SS/SE/AT), Scene, data/assets, GeoMap (#5 overflow clip), Place (outlined map label), SideCallout, ColourBar, `fitX` (throws when text would end past x 1842), charts, the hillside plan frame, Globe (kit_gr), SoftEdges, icons, ForceArrow (light-orange hollow head) |
| `gr_3d.tsx` | 66 | Mont Blanc drape (ETOPO 15″ ×2 under Sentinel-2), analytic terrains, Singapore floor |
| `gr_eq.ts` | 12 | the 9 storyboard equations verbatim |
| `gr_sA.tsx` | 430 | s00–s08 |
| `gr_sB.tsx` | 447 | s09–s16 |
| `gr_sC.tsx` | 475 | s17–s27 |
| `gr_sD.tsx` | 593 | s28–s39 incl. s33b |
| `Gradient.tsx`, `RootGR.tsx`, `index.ts` | | assembly (BYID, one Sequence per scene + XF 10, one Audio), compositions `Ch00Gradient`, `Ch00GRStills` (frames + bbox), `Ch00GRGpuProbe`; separate entry |
| `kit_gr/` | | #5's kit_co copied unchanged except the header line |
| `checks/` | | the static gates + run scripts (§4, §5) |
- Registered in `movies/src/Root.tsx` as `Ch00Gradient` (one import + one Composition; nothing else changed there).
- #5 K6 lessons applied by construction: text columns end before x 1842 (`fitX` in SideCallout / ColourBar / ClockText throws; the
  static swap check now also reports text past x 1842 or in the caption band: 0); no readouts on maps/globes/pictures (values,
  distances and bracket lengths are SideCallouts in the text column with gold links leaving from the label's left edge: s02, s09,
  s15, s17, s22, s23, s28, s29, s31, s33, s34, s35, s36, s37); place names are outlined map labels (`Place`, data-lc-maplabel); only
  three.js tags inside 3-D trees (the SSR `--3d` gate now FAILS on any non-THREE tag, with a negative self-test); source lines via
  `SourceBelow` below every data picture inside the frame; every render asset in both public dirs.

### Hand-checked geometry (orchestrator list)
- Hillside h = 30x + 40y: contours drawn along (−0.8, 0.6), ∇h along (0.6, 0.8) — at right angles, pointing uphill; contour spacing
  10 m / 50 m/km = 0.2 km = 30 px; ∇h arrow length ∝ 50; the 53° arc from east; the 30° axis turn gives legs 45.98 x̂′ + 19.64 ŷ′ that
  end exactly on the arrow tip; the four walkers' shadows = 50 cos θ (rose and backwards at 180°).
- s12 hill: ticks from the grid gradient on analytic ellipses (DG10 6e-5); ∇h points to the summit.
- s14: arrows 50 vs 200 m/km drawn 75 vs 300 px (4×), brackets on the 2 km / 0.5 km spacings, labels rising to the right = uphill.
- s09 / s34: ∇T legs at Brest −3.2 (west) and −2.5 (south) → SW, bearing arc 232° clockwise from north; wind from 190° drawn towards
  ~10°; the angle arc sweeps 138°; the shadow of ∇T on the wind is negative (rose, backwards).
- s18 (fixed): ∇T in the ×50 slice is computed in screen coordinates (0.04, 6.8/ex) — at right angles to the drawn isotherms and
  pointing down; 16° off vertical on the ×50 picture (0.3° in reality), which the narration's "almost straight down" covers.
- s28: ∇p at Brest towards 197° (SSW, away from the low), the force arrow opposite (NNE, to the low); bracket between the drawn 966
  and 970 isobars along ∇p (31.7 km).
- s30: anticlockwise arc round the low (NH); balance sketch: pressure push towards the low, Coriolis to the right of the wind (away
  from the low), wind along the isobar, friction tilts it towards the low.
- s33/s33b: ∇T arrows from the data point to the warm side; the upper-layer fronts sit 262–450 km on the cold side.

### Screen deviations from the storyboard (reviewer: please look)
- No CesiumJS: the Mont Blanc "drape" is a three.js terrain (ETOPO 15″ ×2) under the Sentinel-2 L2A crop of 26 Sep 2023 (credit
  "Copernicus Sentinel-2", not EOX: orchestrator D2).
- s02 probe readouts ("h = 1041 m" …) are unspoken numbers kept from the storyboard, now in the column with a link.
- s15 contours every 400 m (storyboard 200 m) to keep the drape readable; the '10 km' line is a dashed chord with its length in the column.
- s16 Himalaya: 20′ block-mean map + a block-mean profile along 86.83 E (25–33 N); "≈ 50 m" / "≈ 4900 m" chart labels.
- s17/s32: the column height is ×4 relative to the floor (1 world unit = 10 km across, 2.5 km up); the time-compressed ascent.
- s22: cell side labels moved from the globe to the column (callouts with links).
- s24: the parcel is a code-drawn 2-D box (molecules seeded with `random()`), not three.js.
- s29: only the first and last bars carry numbers (the spoken ones); the Pointe du Raz dot is gone with its sentence.
- s32: the Ciarán "inset" is a schematic pair of isobars 31 km apart (no second map); the parcel arrows are 3-D in the column.
- s36: the GFS jet globe is unzoomed (the storyboard's zoom is optional: "If the camera moves in…"); the section is drawn cell by
  cell on a log-p axis (100–1000 hPa).
- s37: zoom-reveal (dist 4.3 → 1.42 → 4.3, K1 frame + right panel), SST drape, the |∇SST| = 8 K/100 km contour in gold, the two
  north-wall points joined.
- s38: eight mini cells, keywords + small equations; s39: the maths end card with a 13-title related list in three columns.
- "height × 50" (s18) is a keyword tied to the spoken "we stretch the height", not a badge.

## 4. Static gates (no browser) — results
| gate | command | result |
|---|---|---|
| TypeScript | `cd movies && npx tsc --noEmit` | **0 errors** |
| timing references | `node movies/src/ch00_gradient/checks/at_check.mjs` | **343 AT/SS/SE references in 41 scenes, 0 failures** |
| text overlap / swaps / edge | `node movies/src/ch00_gradient/checks/swap_check.mjs` (now incl. SideCallout and an x > 1842 / caption-band check) | **268 text elements, 0 text-over-text pairs, 0 swaps < 8 frames, 0 past x 1842**; 20 elements not evaluable (3-D-projected positions). Fixed on the way: 14 edge hits, 12 pairs, 1 tight swap |
| camera speed | `node movies/src/ch00_gradient/checks/cam_speed.mjs` (incl. the drape camera) | **0 cameras above 90 °/s**; peaks s15 35, s33b 32, s37 14 °/s |
| equations | `.venv/Scripts/python.exe movies/src/ch00_gradient/checks/eq_check.py` | **9/9 storyboard equations in gr_eq.ts, all used** |
| server render | `cd movies && node src/ch00_gradient/checks/ssr/run.mjs --step 10 --public <G: public>` | see SSR line below |
| server render incl. 3-D | `… run.mjs --step 15 --3d` | see SSR line below |
| physics parity | `movie_qa.physics_parity(manifest)` | **PASS, 44 functions reproduce their hashes** |
| captions | `tools/tts.py` self-check | 489 cues, ≤ 42 chars/line, 0 cps warnings, text from the script |
| sound cue sheet | `tools/sound/mix.py --check-only` | ok, 4 cues, soundtrack 1955.4 s |
| storyboard schema | `tools/hooks/post_write.py storyboard.yaml` | exit 0 |
SSR (final, after every fix): `--step 10`: **7032 scene-frames, 0 errors, 0 NaN; 15 assets asked for, 0 missing**. `--step 15 --3d`: **5090 scene-frames, 0 errors, 0 NaN; 123 154 three.js tags checked against the THREE namespace, 0 unknown; negative self-test (a `<g>` inside a three.js tree) caught: PASS**. Fixed on the way: 2 source lines that would have reached the caption band (s17, s32), a SideCallout ending at x 1848 (s17), the end-card columns, one CHECK tolerance (ρ shown 1.17).
Not run (need Chrome / Remotion / heavy RAM): K6 stills + overlap gate, GPU probe, sound mix, render, QA, frame review.

## 5. Commands for the next steps (run ONE at a time, alone on the machine)
Scratch `S = G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_gradient/build1` (public, tts, tts2, sound, bundle, stills,
render, tmp). Both scripts set TEMP/TMP to `S/tmp`, stop below 45 GB on C: (G: < 50 GB stops gr_run.py), and log to `S/*.log`.
1. **Pre-render** (static gates incl. SSR and SSR `--3d`, data build into both public dirs, sound mix ≈ 15 GB RAM, mix → both public
   dirs, K6 frame list, stills `S/stills/k6b1` with BoxProbe boxes (bundle rebuilt from `src/ch00_gradient/index.ts`), GPU probe,
   K6 overlap report `S/k6b1.json`):
   `bash "movies/src/ch00_gradient/checks/gr_prerender.sh"`
2. Look at the K6 report and the stills, fix, re-shoot the hit frames
   (`.venv/Scripts/python.exe movies/src/ch00_gradient/checks/gr_run.py stills k6r1 --frames-file <list> --jobs 3`), until 0 hits.
3. **Full render → refuse-partial join → QA** (15 chunks × 4000 frames, conc 2, ports 5800+, stall watchdog 240 s, 3 tries;
   resumable — rerun or `--from N`; the join **refuses** unless every chunk exists with its full frame count; 2-pass join to
   ≤ 100 MB; poster via a props file):
   `K6TAG=<clean stills tag> bash "movies/src/ch00_gradient/checks/gr_render.sh"` (or `… gr_render.sh --from 7`)
   — then `movies/out/ch00/ch00_gradient/{1080.mp4, poster.jpg, en.vtt, en.srt}`, QA log `S/qa.log`
   (`tools/movie_qa.py … --composition movies/src/ch00_gradient/gr_eq.ts --overlap "$S/stills/$K6TAG" --hard-mb 110 --budget-mb 100
   --duration-window 120,3600`).

## 6. Disk
| | C: free | G: free |
|---|---|---|
| before (session start) | 51.5 GB | 469.6 GB |
| after | 51.2 GB | 469.7 GB |
Scratch now: `S/tts/` (run 1, obsolete), `S/tts2/` (final), `S/public/` (3 MB), `S/script.md` + `S/storyboard.yaml` (the v3 copies
before build 1), `S/ssr_final.log`.

## 7. K6 clean-up (2026-11-04) — 2862 hits → 0
Pre-render K6 (`S/stills/k6b1`, `S/k6b1.json`): 2993 stills, **2862 hits** (edge 1332, text-text 571, link-link 302, text-stroke 162,
text-fill 142, text-link 92, src-on-picture 59, text-picture 59, src-gap 55, link-axis 52, text-cbar 25, text-arrow3d 11), which collapse to
**80 (kind, label, label) faults**. Every fault was looked at on an annotated still (scratch `S/annot_b1/`).

### Triage and fixes
| | cause | fix (file) |
|---|---|---|
| systematic | data pictures 790 px tall ending at y 830: the source line ended at y 884.6 (> 880) — s02, s09, s28, s31, s33, s34, s37 (≈ 800 hits) | picture boxes 780 px (s37: source box 775) (`gr_sA` s02, `gr_sB` MB9/ZB9, `gr_sD` M28/Z28, M31, M33, ZB, s37) |
| systematic | equations and calc rows wider than the column (s04–s08, s09, s10, s11, s17, s18, s23, s25, s28, s34, s35): right edges 1849–2005 | per row: "=" column moved left and/or size reduced from the measured glyph widths (all ≥ 44 px; `\text{volume}` row stays 64 so its under-word stays ≥ 44); s15 calc as right-hand sides only from x 1200 (its left-hand sides reached over the terrain: text-picture); s28 "per 100 km" on its own line |
| systematic | CalcStack fraction rows with h 110–120 shorter than the measured glyph boxes (s25, s27) | h from the measured boxes (s25: 92/112/186/112 at size 48/64; s27 125) |
| systematic | the hillside's h = 0 contour drawn at 3 px / 0.7 under the leg labels ("0.71 km", "30 east", "ds cos α") | zero contour 2.5 px / 0.45 like the others (`gr_lib` PlaneContours); "east" moved under the right end of the axis (`gr_lib` AxesEN: it sat under "ds sin α" and the s04 link) |
| links | crossing gold links: s09, s15, s22, s23 (×2), s31, s33, s35, s36 | callout slots re-ordered to the order of their targets (s22, s23, s31, s33, s35 sea / 55 km / land, s36 jet / steep); s09 bearing link to the arc's south side; s15 "≈ 10 km" link routed under the summit (ctl); s22 bends swapped |
| links | s04 climb readout link crossed the east axis + label in every direction below it | link removed (teal readout + same sweep curve) |
| links | s03 links through "1 km east" / "30 m" and across s04's axis in the cross-fade | "30 m" above its rod, ∂h/∂y link routed under "1 km east" (ctl), both links out 14 frames before the scene ends |
| links | s16 "≈ 5 %" link across the y axis and the "3" tick | readout under the plateau inside the chart with a short link; chart axis words folded into the ticks ("km", "°N"), which also fixed "latitude (°N)" past y 880 and "height (km)" on "blocks ≈ 35 km" |
| links | s22 links across the graticule (muted grey = "axis" to the gate) | graticule in light slate #b8c2d6 at 0.4 (map lines, not chart axes) — see proposal |
| text | s02 "pressure" on the 2-line temperature source; s12 labels on the source; s14 "0.5 km" across five contour lines; s32 the Ciarán line on "1005 hPa"; s29 "mean wind" on the colour-bar ticks; s36 "0°N" on "1000"; s36 two source lines cross-fading on each other; s04 "better…" on the δh row, "50 m/km at 53°" on the axis word; s05 "53°" on the dashed leg; s11 "−180" on "−50" | moved / split / timed apart (s14 lines stop at y 350 with brackets and labels under them; s11 ticks −90/0/90; s36 sources fade one after the other; s23 "2 × 27.8 km" out before the −2.1 row) |
| fills / masks | s21 text inside a small filled box; s38 recap equation straddling its cell's edge; s33b source under the stack mask (K1 bottom fade); s35 source 10 px under its picture | two warm blocks with the words under them; cells 420 px wide, equation at 44 px; stack mask `clipY: 788`; default 16-px gap |
| clipped (eye) | s33/s33b two-line colour-bar titles cut by the top edge; s36 "hPa" cut by the top edge; s35 "Normandy" under the land link; s22 ∇F parts on "a = Earth's radius" | colour bars at y 150; section top at y 92; label moved; parts at y 422/662 |

### Rounds (one stills job at a time, `--jobs 3`, bundle rebuilt each round)
| round | stills | K6 |
|---|---|---|
| k6b1 (pre-render) | 2993 | FAIL 2862 |
| k6r1 (full list) | 2993 | FAIL 102 (s09/s15/s22 link-link 60, s22 equation on "a = Earth's radius" 18, s25 rows 3 px apart 12, s21 fill 5, s03 4 + 3) |
| k6r2 (817 frames: s03, s04, s09, s15, s21, s22, s25, s26, s33, s33b) | 817 | FAIL 30 (s09 link-link 26, s03→s04 cross-fade link-axis 4) |
| k6r3 (454 frames: s03, s09, s35, s36) | 454 | PASS 0 |
| k6r4 (full list, final, bundle rebuilt) | 2993 / 2993 | **PASS, 0 hits** (730 INFO: owner / end-label exemptions) |

Final stills + boxes: `S/stills/k6r4`, report `S/k6r4.json`. **Run the render with `K6TAG=k6r4 bash movies/src/ch00_gradient/checks/gr_render.sh`** (the script's default is still k6b1).
Static gates after the last change: tsc 0 errors · at_check 342 refs, 0 failures · swap_check 269 text elements, 0 pairs, 0 swaps < 8 frames · cam_speed 0 above 90 °/s ·
eq_check 9/9 · SSR step 10: 7032 scene-frames, 0 errors, 0 NaN, 0 missing assets · SSR --3d step 15: 5090 scene-frames, 0 errors, 123 154 THREE tags, `<g>` self-test PASS.
Narration, timing.json, storyboard and the sound cue sheet unchanged. Reviewer screen flag done: s03 3-D labels (rise labels above / beside their rods, links clear of labels). Not done: SVG overlays over 3-D are still drawn without depth occlusion (s00/s01/s15 arrows, s15 contours).
For the reviewer: s04 has no link from the climb readout to the needle any more; s16 chart axis words are in the ticks ("6 km", "26°N"); s22 graticule is light slate; s15 calc shows "3771 ÷ 10 056" without units; s10 EQ_S10 at 48 px, s34 calc at 44 px (the narrowest column fits).
Disk: before C: 49.9 GB / G: 467.2 GB free; after C: 49.9 GB / G: 466.0 GB free. Scratch stills: k6b1, k6r1–k6r3 (obsolete), k6r4 (final), annot_b1 (fault sheets).
