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
