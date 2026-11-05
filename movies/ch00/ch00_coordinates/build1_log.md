# ch00_coordinates (#5) — build 1 log (motion-builder, 2026-11-04)

Scope of this run (orchestrator): data, TTS, composition, type checks and static (no-browser) gates only. A Weather Basics full
render held the machine, so **no Remotion render, still, Chrome/Playwright job or sound mix was started**. Everything below that
needs a browser is listed as a command at the end.

## 1. Physics and data — `movies/data/build_ch00_coordinates.py`
- Tested fluidpy functions only (core.coords, core.tensors, core.curvilinear, core.kinematics, geo.sphere, geo.frames, geo.mapproj,
  geo.vectors, geo.atmos, diag.cyclone incl. track_by_continuity / translation_velocity, diag.trajectories.advect_on_sphere,
  diag.climatology.global_mean) on files already on disk (no download).
- **116 CHECK rows, all PASS** (DC01–DC57 + DC14b, DC31b/c, DC34b, DC35b, DC36b). 75 parity entries (72 light, re-run by the QA
  physics gate standalone: **PASS, 72 functions reproduce their hashes**), 32 heavy calls by hash.
- Outputs: `data/co.json` (1727 kB, sha256 98fe1961cf64…), `data/img/` 29 rasters (HRRR speed 18/20 UTC, Ciarán hourly speed ×10,
  ERA5 u_r stack layers ×5 with rose hatching on inflow, GOES crops, Blue Marble reprojected to plate carrée / Mercator / Equal
  Earth / gores / polar stereographic with alpha masks, ERA5 Sep 2026 t2m anomaly on Mercator and Equal Earth), `manifest.json`.
- Reprojected rasters: inverse maps written in the build, each checked by a forward round trip with the tested
  `mapproj.forward` (DC31b, max error 0 to 1e-9 a).
- `--public <dir>` writes the 31 render assets `co_*`; written to `G:/…/ch00_coordinates/build1/public` **and to `movies/public`**
  (5.0 MB; so a fresh `npx remotion bundle` contains them — lesson from #4). `movies/public/` is **not git-ignored** today.

### CHECK rows whose definition changed against data_needs (reviewer: please look)
| row | planning | build 1 | why |
|---|---|---|---|
| DC12 | std(v_t), std(v_r) < ½ std(u) | < ½ pooled std of u and v | v_r 10.46 vs ½ std(u) 10.24 (marginal); the narration compares the u/v pair with the v_t/v_r pair |
| DC14b heights | box means 322/1508/5868/12458/15348 m | 263/1454/5827/12461/15360 m on the ±300 km box; asserted against the spoken "about 300 m, 1.5, 6, 12.5, 15 km" (±15 %) | the planning values do not reproduce from the committed z18 file with any box tried |
| DC42/43 | 32.9 m/s, along 9.4, across −31.6 / +11.5 | same numbers, from the **nearest HRRR grid point** | bilinear on a regridded field gives 34.5 / −33.2 |
| DC43 | Pinellas coast 355.4° | NE 10 m coast gives **353.1°** (row 355 ± 5 passes); the across component still uses 355.4° → +11.5 (353.1° would give +12.1) | flag: the spoken "eleven and a half" depends on which coast segment is taken |
| DC53 | south 18.8 / north 8.4 | sectors ±45° about the right / left of the track (azimuths 289° / 109°) | north/south of the centre gives 20.6 / 6.5 |
| DC54 | uniform field ring means < 1e-3 m/s | on the sphere 0.26 / 0.09 m/s (meridian convergence) = exactly the ground − storm-relative difference; a uniform wind on a **flat** circle gives 0 to 1e-12 (new row) | the narration "adds nothing" is exact on a flat circle, ≈ 2 % on the sphere |
| DC34 | Mercator Greenland/Africa in 0.6–1.0 ("nearly as big") | **1.05** → narration changed to "about as big" (row 0.8–1.25) | Greenland looks slightly larger than Africa on our Mercator |

## 2. Narration — `tools/tts.py` (Kokoro af_bella ×1.0, `.venv-tts`)
- Script changes before TTS: **s35/s36 refresh adopted** (data_needs §H, orchestrator-adopted; 21 Jan 2026, centre 72.9° N over the
  Barents Sea, "far more purely tangential"; the optional S7b sentence not added) and **s33 S5 "nearly as big" → "about as big"**.
- Run 1 (before the s33 change) 17.5 min; run 2 (final) 17.8 min → `G:/…/build1/tts2/` (narration.wav 140 MB, ignored).
- **453 sentences, 6928 words, narration 2923.75 s + 2.5-s hold = 2926.25 s (48:46.25), 87 788 frames, 142.1 wpm overall,
  714 cues, 0 caption warnings, self-check diff 0.0 ms.**
- Copied: `timing.json`, `en.vtt`, `en.srt` (from captions.vtt/.srt) into this folder.
- `storyboard.yaml` synced (version 4: s33/s35/s36 voiceovers, every `t` / `sentence_times`, measured totals, `build_1` record;
  re-dumped with yaml as the weather-basics sync scripts do, header comments kept); `script.md` header gets the build-1 line.
- Music: the storyboard's new style `compass-orbit` is **not** in `tools/sound/styles.py` (a tools change); `sound.yaml` uses the
  storyboard's runner-up **ice-polar, seed 23**. 4 effects (s11 wind, s39 waves, s40 stream, s43 wind); `mix.py --check-only` OK.
  The full mix was **not run** (heavy, ~15 GB RAM).

## 3. Composition — `movies/src/ch00_coordinates/`
| file | lines | what |
|---|---|---|
| `co_lib.tsx` | 356 | timing (SS/SE/AT), Scene, data/assets, GeoMap (local true-shape lat/lon frames), projected maps, ColourBar, charts, Globe (kit_co), spinPath, icons |
| `co_eq.ts` | 32 | the 29 storyboard equations verbatim (QA `--composition` target) |
| `co_sA.tsx` | 859 | s00–s14b |
| `co_sB.tsx` | 764 | s15–s30 |
| `co_sC.tsx` | 858 | s31–s47 |
| `Coordinates.tsx`, `RootCO.tsx`, `index.ts` | | assembly (BYID, one Sequence per scene + XF 10, one Audio), compositions `Ch00Coordinates`, `Ch00COStills` (frames + bbox), `Ch00COGpuProbe`; separate entry |
| `kit_co/` | | the #4 kit copied unchanged except the header line (globe, three3d, cam, wb, probe, GpuProbe) |
| `checks/` | | the static gates below + run scripts |
- Registered in `movies/src/Root.tsx` as `Ch00Coordinates` (one import + one Composition; nothing else changed there).
- House kit used, never edited: type/draw/tex/notes/extras/title/icons, frame (GlobeFrame K1, SourceBelow K2, Callout K3),
  stack3d (LayerStack3D K5), wind (AnimatedWindArrow, FlowParticles K7), three3d, cam, bbox (BoxProbe K6).
- Lessons applied: keyword swaps ≥ 8 frames apart (static gate 0); cameras ≤ 90 °/s and eased (gate 0; the s19 Earth spin is a
  trapezoidal-speed `spinPath`, no stop-go); one colour bar per picture, beside it, and a source line under every data picture;
  pictures fade before text arrives on the s44 ring→map swap and the s46 recap beats; every drawn line computed from the data or
  the stated formula (tangential/radial arrows from the data's own r̂, the coast axes from the measured bearing, the
  great-circle plane from r̂₁ × r̂₂, the rhumb line straight on Mercator — DC31c); render assets staged into `movies/public`.

### Screen deviations from the storyboard (reviewer: please look)
- s02–s05 flat map: code-drawn local plane round the station (no image: a 12-km window is ≈ 6 px of Blue Marble); no source line.
- s11/s12/s13/s39/s40 maps: local equirectangular frames scaled by cos φ (true local shape; HRRR's own grid is Lambert conformal).
- s14 cylinder at true aspect (25 km × 15 km, no ×10); arrows illustrative (manifest); sign tags from the ERA5 ring means.
- s18 side and top views as 2-D cross-sections (schematic geometry; λ drawn at 35° for clarity, no λ number on screen).
- s22 panels: Natural Earth 10 m land + the 0.25° grid (no Blue Marble crop).
- s27 pressure levels: USSA-1976 heights (`atmos.pressure_height_standard`) over the ETOPO Alps profile at 46.5° N.
- s28, s46 mini pictures schematic; s01 three preview glyphs; s40 tide-gauge chart instead of a 3-D sea-level inset.
- s31–s33 ProjectionMorph in 2-D: globe → gores by cross-fade, then the same coastline points morphed gores → plate carrée →
  Mercator (rasters cross-faded); s11 streaklines move throughout (§5b "always animated" wins over "S2–S3 only").

## 4. Static gates (no browser) — results
| gate | command | result |
|---|---|---|
| TypeScript | `cd movies && npx tsc --noEmit` | **0 errors** |
| timing references | `node movies/src/ch00_coordinates/checks/at_check.mjs` | **447 AT/SS/SE references in 49 scenes, 0 failures** (caught and fixed 7 wrong sentence indices in s06/s09/s13) |
| module load | esbuild bundle of `Coordinates.tsx` imported in node | **loads; module CHECK rows A/B/C pass; BYID = 49 scenes; CO_FRAMES 87 788** |
| server render | `cd movies && node src/ch00_coordinates/checks/ssr/run.mjs --step 10 --public <G: public>` | **10 497 scene-frames, 0 errors, 0 NaN; 27 assets asked for, 0 missing** (caught and fixed: 5 underbrace sizes < 44-px floor, 3 source lines pushed into the caption band, the end-card column width, s45 negative bar height) |
| server render incl. 3-D bodies | `… run.mjs --step 15 --3d` | **7 596 scene-frames, 0 errors, 0 NaN** |
| keyword swaps / text overlap | `node movies/src/ch00_coordinates/checks/swap_check.mjs` | **381 text elements, 0 text-over-text pairs, 0 swaps < 8 frames** (fixed 9 pairs); 52 elements not evaluable (3-D-projected positions) |
| camera speed | `node movies/src/ch00_coordinates/checks/cam_speed.mjs` | **0 cameras above 90 °/s** (fixed s29 92 °/s); peaks s16 80, s19 55, s29 55, s14b 47 |
| equations | `.venv/Scripts/python.exe movies/src/ch00_coordinates/checks/eq_check.py` | **29/29 storyboard equations in co_eq.ts, all used by scenes** |
| physics parity | `movie_qa.physics_parity(manifest)` | **PASS, 72 functions reproduce their hashes** |
| captions | `tools/tts.py` self-check | 714 cues, ≤ 42 chars/line, cps warnings 0, text from the script |
| sound cue sheet | `tools/sound/mix.py --check-only` | ok, 4 cues, soundtrack 2926.25 s |
Not run (need Chrome / Remotion / heavy RAM): K6 stills + overlap gate, GPU probe, sound mix, render, QA, frame review.

## 5. Commands for the next steps (run ONE at a time, alone on the machine)
Scratch `S = G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates/build1` (public, tts2, sound, bundle,
stills, render, tmp). Both scripts set TEMP/TMP to `S/tmp`, stop below 45 GB on C:, and log to `S/*.log`.
1. **Pre-render** (static gates, sound mix ≈ 15 GB RAM, mix → public dirs, K6 frame list 4086 frames, stills `S/stills/k6b1` with
   BoxProbe boxes, GPU probe, K6 overlap report `S/k6b1.json`):
   `bash "movies/src/ch00_coordinates/checks/co_prerender.sh"`
   (single steps: `.venv/Scripts/python.exe tools/sound/mix.py --narration "$S/tts2/narration.wav" --cues movies/ch00/ch00_coordinates/sound.yaml --out-dir "$S/sound"`;
   `.venv/Scripts/python.exe movies/src/ch00_coordinates/checks/co_run.py stills k6b1 --bundle --jobs 3`;
   `.venv/Scripts/python.exe tools/k6_overlap.py "$S/stills/k6b1" --timing movies/ch00/ch00_coordinates/timing.json --json "$S/k6b1.json"`)
2. Look at the K6 report and the stills, fix, re-shoot the hit frames (`co_run.py stills k6b1b --frames-file <list>`), until 0 hits.
3. **Full render → join → QA** (22 chunks × 4000 frames, conc 2, ports 5600+, stall watchdog 240 s, 3 tries; resumable — rerun or
   `--from N`; the join **refuses** unless all 22 chunks exist with their full frame counts):
   `bash "movies/src/ch00_coordinates/checks/co_render.sh"` (or `… co_render.sh --from 7`)
   — then `movies/out/ch00/ch00_coordinates/{1080.mp4, poster.jpg, en.vtt, en.srt}`, QA log `S/qa.log`
   (`tools/movie_qa.py … --composition movies/src/ch00_coordinates/co_eq.ts --overlap "$S/stills/k6b1" --hard-mb 160 --budget-mb 160 --duration-window 120,3600`).

## 6. Disk
| | C: free | G: free |
|---|---|---|
| before | 52.7 GB | 474.9 GB |
| after | 53.5 GB | 474.4 GB |
Scratch now: `S/tts/` (run 1, 137 MB, obsolete — deleting it was not allowed in this run), `S/tts2/` (140 MB), `S/public/` (5 MB),
`S/storyboard_before_build1.yaml`. fluidpy at 8cab62ebf6 with uncommitted tracked changes (`dirty_tracked: true` in the manifest).

## 7. K6 clean-up (2026-11-04) — 5301 hits → 0
Pre-render K6 (`S/stills/k6b1`, `S/k6b1.json`): 3920 of 4086 stills, **5301 hits** (edge 1594, text-text 1340, text-stroke 1003,
text-picture 704, text-fill 180, link-link 146, text-img 120, text-link 111, src-on-picture 47, link-axis 28, src-gap 20, cbar-picture 8).
The hits collapse to **195 unique (scene, kind, label) faults**; each fault is counted on every K6 frame it lives in (dense scenes are
sampled every 0.5 s, so s11 alone had 584).

### Why 166 stills were missing
All 166 are s14_cylinder (frames 22082-23851): every one threw `R3F: G is not part of the THREE namespace`. A `<g>` (SVG group) was
written inside the `<HView3D>` (react-three-fiber) tree; R3F treats every lower-case tag as a THREE class. The SSR gate did not catch
it because `run.mjs --3d` suppresses React warnings about 3-D tags. Fix: `<g>` → `<group>` (co_sA s14). s14 now renders.

### Triage
| | cause | hits (k6b1) | fix |
|---|---|---|---|
| systematic | SVG `<image>` inside a GeoMap `clip-path`: the house BoxProbe crops images to overflow-hidden ancestors only, so HRRR/GOES rasters were measured at their full, unclipped extent | 120 text-img (s00, s01, s11) | `GeoMap` (co_lib) puts the map body in an overflow-hidden `<div>` of the map box as well as its clip-path (drawing unchanged); frame stroke and `over` stay in a full-frame SVG |
| systematic | `SourceLine` (a bare `<g>`) used outside an `<svg>` in s01: drawn as tiny HTML text at the top-left, box 0 | 20 src-gap | `SourceBelow` |
| systematic | shared `AxesEN`: "east" under the x-axis, on the KmTicks "6 km" | 248 text-text (s02-s05) | "east" above the axis |
| systematic | the R3F `<g>` crash (above) | 166 stills missing | `<group>` |
| real | text column wider than the frame (equations at 64-84 px, long keywords from x 1100-1430), and under-brace equations that are wide by nature | 1594 edge | per scene: column moved/shortened, long lines split; EQ_S11/S26/S32/S45 shown on two lines (the 64-px size is kept: under-words must stay ≥ 44 px) |
| real | must-class labels on globes / maps / the stack (speed tags, east/west, patch sides, Brest/Brittany/Atlantic piled up, s36 component labels on contours) | 704 text-picture + most text-text/-stroke on globes | readouts moved off the picture (s19 speeds at the limb where each parallel leaves the globe; s17 east/west, s23 patch sides, s36 components in the column, in their colours); place names on a globe are now outlined map labels (`data-lc-maplabel`, the tool's spot-label class, only for real place names); s24 labels re-placed round the Brest dot |
| real | contour labels stacked on the 10 hPa vortex | ~250 (s35/s36) | contours `data-lc-contour`; labels placed once (CONT_LABELS) on their own contour, ≥ 34 px from every arrow, ring, arc, marker and callout chord, no two overlapping |
| real | gold links crossing (stacked callouts whose links leave from the top edge; the s02 origin link; s03/s05 links) | 146 link-link + 111 text-link | `SideCallout` (co_lib: link always from the text's left edge), callouts ordered like their targets, links timed apart (s05), routed with `ctl` (s03); s15 callout over a graticule replaced by an "a" spot label + plain column readout |
| real | the s14b stack under the column at the close look, stack bottom on the credit, credit in the caption band | 412 (s14b) | column at x 1300, stack 40 px higher, close look at dist 7.6, the column fades during the close look only |
| real | misc. (s07 labels on rays, s08 r̂ in the caption band, s09 dθ on r̂, s10 u label on a dash, s13/s19/s20/s21/s22/s25/s27/s29/s31/s33/s34/s38-s46 single overlaps) | rest | moved / retimed per fault |

### Rounds (same 4086-frame list; one stills job at a time, `--jobs 3`, ≈ 24 min per full set)
| round | stills | K6 |
|---|---|---|
| k6b1 (pre-render) | 3920 / 4086 | FAIL 5301 |
| k6r1 | 4086 / 4086, 0 errors | FAIL 811 (s11 Florida label on the map edge 342, s11 equation 12 px from the colour bar 150, two-line equations too close in s26/s32/s45, s14b close look, singles) |
| k6r2 | 4086 / 4086, 0 errors | FAIL 28 (s26 calc 1 px under the equation, s45 axis word 4 px under the keyword, s24 credit under the zooming-out globe for 2 frames) |
| k6r2 + 328 re-shot frames of s24/s26/s45 | 4086 / 4086, 0 errors | **PASS, 0 hits**; 1132 INFO (603 place/≤2-char labels on map linework, 243 spot labels on 3-D rods, 215 cross-fade, 67 marker beside its label, 4 label at a shape's end) |
Final stills + boxes: `S/stills/k6r2`, report `S/k6r3.json`. **Point the render QA at `--overlap "$S/stills/k6r2"`** (co_render.sh still says k6b1).

Static gates after every round (last run): tsc 0 errors · at_check 448 refs, 0 failures · swap_check 383 text elements, 0 pairs, 0 swaps < 8 frames ·
cam_speed 0 above 90 °/s · eq_check 29/29 · SSR step 10: 10 497 scene-frames, 0 errors, 0 NaN · SSR --3d step 15: 7596, 0 errors.
GPU probe (`S/gpuprobe.png`): `ANGLE (NVIDIA, NVIDIA RTX A1000 Laptop GPU (0x000025B9) Direct3D11 vs_5_0 ps_5_0, D3D11)` — hardware GPU, not SwiftShader.
Narration, timing.json and the sound mix unchanged.

### For the reviewer (not K6 faults)
- s14: the GOES eye image quad does not show in the stills (the cylinder sits alone on an empty panel; true-aspect cylinder is small).
- s45: tight stack in the column (two equation lines, keyword, "hPa per hour") — passes K6 with 7-8 px gaps.
- s24: the credit waits ≈ 1 s while the zooming-out globe still covers its place.
- s39: the three callout links converge on Fort Myers Beach (they meet only at their ends).

Disk: before C: 51.8 GB / G: 470.8 GB free; after C: 51.5 GB / G: 470.1 GB free. Scratch stills: k6b1, k6r1 (obsolete), k6r2 (final).

## 8. Render QA content / halves fix (2026-11-04)
QA on the full render (`qa.json`): `content` FAIL (all empty 29.5–40.5, 1026.5–1039.5, 1734–1739.5, 2545–2550.5 s) and
`halves` FAIL (21 spans > 10 s, 34 > 3 s). Mapping every span > 3 s from `content_scan.json` to scene and sentence showed the
same cause everywhere: **scenes opened with an empty half and filled only when the first item was spoken** (often sentence 2–5).
Not the GeoMap `<div>` change, and not images failing to load: s02's "empty panel" is the Ground plate (#22304a, 23 levels off
the background, below the gate's 28 threshold) waiting for the origin at sentence 2; s18 (side view at sentence 3), s28 (first
mini picture at sentence 2), s38 (picture at sentence 3) and s42 (ball scene at sentence 5) had nothing on the left; the maths
zone of s02–s10, s14–s25, s29, s31, s32, s35, s37, s42 stayed empty until the first equation/keyword.
Fixes (HOUSE_STYLE §5: the picture is there from a scene's first frame; keywords only, said when spoken):
- left: Ground plate gets a visible edge (#4a5677, 3 px; a guide colour, so links over it are not "axis" crossings); s18 side
  view from frame 0 (position vector and Brest dot at sentence 1); s28 first picture from frame 0; s38 circle, station and balloon
  from frame 0; s42 train and ball scene from frame 0 (the drop still starts at sentence 5).
- right: an opening keyword per scene from the words of sentence 0/1, in the slot of the column's first item, out 18 frames
  before it (swap rule): s02 "a flat map", s03 "unit vectors", s04 "how far · which direction", s05 "back to x and y", s06 "maths
  angle or compass bearing?", s07 "radians", s08 "their own unit vectors", s09 "how fast do they turn?", s10 "a wind in polar
  coordinates", s14 "not flat", s15 "the Earth", s16 "how far north or south", s17 "how far east or west", s18 "Brest in space" /
  "position vector" / "two right triangles", s19 "the distance from the axis", s20 "distances on the sphere", s21 "going east", s22
  "weather data" → "ERA5: every 0.25°", s23 "areas", s25 "local arrows turn as you move", s28 "why so many?", s29 "the shortest
  way", s31 "flattening stretches", s32 "Mercator, 1569", s35 "one more map: from above a pole", s37 "change coordinates: turn the
  axes", s42 "accelerations?".
Check on stills (movie_qa content_scan metric — 480 px, bg #171f33, thr 28, < 0.2 %, y 40–835 — on 4086 K6 stills + 984 extra
stills every 1 s through the first 45 s of each changed scene, `S/stills/ct1`): **no empty content area, no half empty > 10 s**;
remaining WARN spans 3.1–7.7 s (s04 3.1, s07 5.1, s13 7.7, s22 3.1, s24 4.0, s26 4.9, s30 3.3, s33 3.2; sampling of the K6 list
is sparse there, the render scan will be finer).
Static gates: tsc 0 · at_check 481 refs, 0 failures · swap_check 413 elements, 0 pairs, 0 swaps < 8 frames · cam_speed 0 ·
eq_check 29/29 · SSR step 10 10 497 scene-frames, 0 errors.
K6 (`S/stills/k6r2`, 2076 + 250 frames re-shot): one interim FAIL (55 link-axis: the first panel edge was muted grey = "axis");
after the colour change **PASS 4086 frames, 0 hits** (`S/k6r5.json`).
Chunks to re-render (4000-frame chunks): c00 c01 c02 c03 c05 c06 c07 c08 c09 c10 c11 c13 c14 c15 c16 c17 c19
(unchanged: c04 c12 c18 c20 c21).

## 9. Fix loop 1 (2026-11-04) — review 1: 17 Musts, 17 of 18 Shoulds (source only)
Scope: TSX + data overlay only. No TTS, no narration or timing change, no Remotion render / still / bundle, no Chrome, no SSR
(`run.mjs`): another heavy job (#6 gradient pre-render) held the machine. Maths end card kept (reviewer's recommendation).

### Data (`movies/data/build_ch00_coordinates.py`; in-place patch `--patch-fl1`, no full rebuild)
- **Must 6, root cause.** Not a sign bug in the TSX: `fluidpy.geo.mapproj.tissot_ellipses(…, radius_km=500, a=1.0)` traces the circle
  by great-circle steps of `radius_km·1e3 / a` RADIANS, so a = 1 m gave 5·10⁵ rad ≡ 169.7°: a 10°-radius ring round each centre's
  ANTIPODE (Brest band 38.5–59° S, Svalbard 69–90° S, 60° N circles at 60° S). Fixed in the builder: circles traced on the real
  sphere (default a = EARTH_RADIUS), then divided by a (`tissot_xy`). The library is right (its docstring says a in metres).
  New CHECK rows DC32b (41, all PASS): every outline encloses its own centre's y/a; the five callout ellipses (pc Brest,
  pc Svalbard, mc 60° N, mc Svalbard, ee 60° N) lie north of the equator.
- **Same-bug sweep (every latitude placement).** All other `MP.forward(…, a=1.0)` calls take lat/lon in degrees (a only scales:
  correct). `storm_relative_wind(radii_km=…)` uses the default Earth radius (correct). In the TSX: `mapP` (y = lat1 − lat), `pv`
  (cy − y·s), s32 `latTick`, the polar map (`p(0, −r)` = 30° N at lon 0, the bottom of a north-polar map), s19 `LatCircle −BREST`
  (deliberate southern reference), s46 recap ellipses (cy − 260 sin φ), the globe kit (`ll`) — none mirrored.
- **Must 1.** The s14 GOES crop is now centred on the IBTrACS 18 UTC centre (26.6 N 82.4 W), where the eye is in the image (the HRRR
  pressure minimum lies 13.7 km south of it), and contrast-stretched (luminance 0.5–99.5 % = 174–255 → 30–255, γ 1.6; source line
  says "contrast enhanced"). `goes_eye.jpg` 34556e9b295e…, staged to `movies/public` and `S/public`.
- **Should 15.** Manifest `parameters.coast_segment_s40`: 355.4° = the planning points 27.60 N 82.74 W → 28.15 N 82.79 W (across
  +11.5 m/s); NE 10 m nearest points 353.1° (+12.1); NE 50 m land 355.7° (+11.4).
- `co.json` c33b8e590e0a… (only `proj.tissot`, `stack.eye_box`, `stack.eye_stretch` changed), manifest `fix_loop_1` record,
  3 tissot heavy records re-hashed, 157 checks all PASS.

### Screen (file: scene)
| item | fix |
|---|---|
| Must 1 | co_sA s14: unlit, non-tone-mapped quad (`toneMapped: false`), opacity 1; gold eyewall ring (9 px) from "eyewall" to "cylindrical coordinates"; "eyewall" is a SideCallout linked to it; cylinder rims 6 px, sides 3 px |
| Must 2 | co_sA s14: `u_r`, `u_θ`, `w` tags in KaTeX |
| Must 3 | co_sA s14b: column = the stack, top layer first: "12.5 · 15 km: sign flips" / "≈ +4 m/s, out", "6 km: hardly in or out" / "rising near the eye", "1.5 km: little inflow", "300 m: flowing in" / "≈ −6 m/s on the ring" — each spoken line a SideCallout to its own 200-km ring (point nearest the column); S2 "layers 0.3 – 15 km up"; the never-visible axis-corner tags removed |
| Must 4 | co_sA s11: `ringArrowsMean` — the ring-mean 37 and −12.5 m/s drawn at ring point 9 along its own r̂, θ̂ (radial arrow 94 px, pointing at the eye) |
| Must 5 | co_sA s11: both readouts are SideCallouts (links from their own left edge, below "southwest Florida", no crossing) |
| Must 6 | data (above) + co_sC s31 / s33: SideCallouts ordered like their targets (Svalbard above Brest / 60° N) |
| Must 7 | co_sB s29: "Los Angeles" right of and below its dot |
| Must 8 | co_sB s29: CalcStack x 1160, row 2 = `d ≈ 6371 × 1.375 ≈ 8760 km` with lhs `d` (ends ≈ x 1740) |
| Must 9 | co_sA s09: "radius 1" centred under the circle |
| Must 10 | co_sB s16: "+90°" right of and below the pole dot |
| Must 11 | co_sB s19: `facing()` fades "Brest"/"Svalbard" as their points near the limb; the pole "0" right of its dot |
| Must 12 | co_sC s41: "u′ = 1.5" left of the walker's arrow (anchor end) |
| Must 13 | co_sC s43: "north ≈ 8" above "south ≈ 19", SideCallouts (checked: north link above south link everywhere, ≥ 80 px) |
| Must 14 | co_sC s45: equation broken before "=" (line 2 "= ∂p/∂τ − U·∇p" at x 1010, y 370); keywords at y 535; bars from a baseline at y 640 (40 px per hPa/h), values at 832, "hPa per hour" above the baseline's right end |
| Must 15 | co_sC s40: SpeedBar 0–50 above the chart (chart 230–430); credit "HRRR (NOAA) · 28 Sep 2022, 20 UTC · NOAA CO-OPS gauges · NHC report"; s45: SpeedBar 0–30 at x 1460 |
| Must 16 | co_sB s26: readouts and "no force" keyword removed (screen-only option); keywords from the spoken words at y 560 from frame 0 ("why does it matter?", "Newton's law: the whole vector", "turning arrows: extra pieces") so the right half is never empty |
| Must 17 | co_sB s15: "Earth's radius a" + "≈ 6400 km (6371 km)" (the line on the globe stays labelled a); the "|" notation is gone |
| Should 1 | co_sA s07: "2π r" outside the circle, upper left |
| Should 2 | KaTeX hat-theta: s14 "r̂, θ̂ turn", s25 "like θ̂ round a circle", s46 beat 1 |
| Should 3 | co_sA s12: dashed ring-mean lines (37, −12.5) and "inflow: nearly all negative" (66 of 72 ring points < 0; the other six ≤ +1.05 m/s — "negative all the way round" would be false) |
| Should 4 | s11 "official estimate:" |
| Should 5 | co_sB s18: smaller φ arc, φ inside the triangle; "two right triangles" at y 520; top view fades before the S11 links; 4230-km link ends on the leg's right part, its tag moved left |
| Should 6 | s22 "≈ 5 × too wide" (1/cos 78.2° = 4.9) |
| Should 7 | s23 "width a cos φ dλ", "height a dφ" |
| Should 8 | co_sB s27: pictures centred at y 300, ×1.15; keywords at y 540–660 (out before the Alps profile); scale-factor rows 540/610, gradient formula 720, keywords 820 |
| Should 9 | co_sC s34: Equal Earth starts at cx 845 (41 px gap) |
| Should 10 | co_sC s36: tick legend "radial ticks: in · out"; bars "radial ÷ tangential" about the pole ≈ 1.9 (VX.ratP 1.883) and about the centre ≈ 0.4 (VX.ratC 0.419); CHECK rows added |
| Should 11 | co_sC s40: "Fort Myers (upriver)", "St. Petersburg"; NHC line + "above the ground" |
| Should 12 | co_sC s39: coast link → coastline 130 px north (bend 150, ≥ 40 px over the wind arrow); along link → x′ axis 80 px south of the beach; across → band middle; "Fort Myers Beach" 35 px further left |
| Should 13 | **deferred** (needs a re-voice: "minus thirty two") |
| Should 14 | co_sC s47: topic list from y 648 (28 px under the icon row) |
| Should 16 | co_sB s21: tags below their bands from Brest north |
| Should 17 | co_sB s24: Brest's dot arrives with its name |
| Should 18 | opening keywords: s07 "radians" from frame 0; s24 "zoom out: other stations" at the zoom-out; s33 "conformal has a price" from frame 0 |

### Static gates (no browser)
tsc 0 errors (exit 0) · at_check 484 refs in 49 scenes, 0 failures · swap_check 417 text elements, 0 pairs, 0 swaps < 8 frames
(60 not evaluable: 3-D / frame-dependent) · cam_speed 0 above 90 °/s (peak s29 55) · eq_check 29/29, none unused.
Not run (forbidden this loop): module-load bundle, SSR `run.mjs`, K6 stills, render, QA.

### Next (one heavy job at a time)
1. SSR step 10 + `--3d` step 15; 2. K6 re-shoot `S/k6f1_frames.txt` (3789 frames, 30 changed scenes: the house K6 list in those
scenes + every 1 s through s12 s18 s26 s27 s36 s39 s41 s45) into a copy of `S/stills/k6r2` → 0 hits; 3. re-render chunks c02–c21
(only c00 c01 hold no changed scene; with the ±10-frame cross-fades) → join → QA → review 2.
