# RESUME — where the work stopped (2026-10-28, user exit; ALL agents stopped cleanly and checkpoint-committed)

> **UPDATE 2026-10-28 (latest; read first).** Restart these streams (fresh agents, briefs below and in the table):
> 1. **Weather basics**: label check done; the render (`r2`) was in progress in `G:/…/scratch/movies/ch00_weather_basics/v2/`
>    (pieces in `r2/`, `r2_render.log`; `tools/movie_wb/join.py` new). Restart the motion-builder: resume the render
>    (re-render missing/partial pieces only), join, mix sound, QA, frame check → commit → Drive → reviews.
> 2. **#1 Vectors & index notation**: plan DONE and committed (56:32). Decision: **split into #1a / #1b** (see
>    `movies/ch00/ch00_vectors_index_notation/data_needs.md` "Orchestrator decisions"). Next: movie-director splits the
>    storyboard/script into `ch00_vectors_index_notation` (1a) and `ch00_alternating_tensor_triple_products` (1b) with own
>    title/hook/recap for 1b, re-measure; then data-scout D1/D2/D4/D5 + implementer F1–F6 + new music style `index-lattice`.
> 3. **#2/#3 cross-product splits**: planning was mid-way (files committed). Restart the movie-director; ALSO fold in
>    the user's new request: more intuition behind each part of the maths + more "when is it used" cases with
>    animation, inspired by https://www.youtube.com/watch?v=w4x7RLUizJ0 (ideas only, our own words/visuals).
> 4. **NEW — research the user's YouTube video** (research-scout): write `research/xprod_video_intuitions.md`
>    (intuitions for cross AND dot product, use cases, visual devices; map each onto our movies; no copying). Its
>    first attempt was stopped before writing anything. Feeds #2/#3 and a **new dot-product version 0.1b**.
> 5. **#69 reading-maps data** (data-scout): nearly done; finish registry/reports + s57 impact verification.
> 6. **Library tests** (math-verifier): `tests/geo/test_sphere.py`, `test_mapproj.py`, `tests/diag/test_station.py`,
>    `test_axes.py` written (committed as WIP); mutation check + figures + `reports/ch00_rwm_verification.md` remain.
> 7. **Map-toolkit fixes** (general-purpose): edits done (committed as WIP); run `tools/maptools/selftest.py` +
>    `tests/test_maptools.py`, fix anything red, report.
> Archives on G: (use from there): old cross-product previews `G:/…/archive/movies/ch00_cross_product_why_previews/`;
> local outputs (sound demos, maptools samples, release_check) `G:/…/archive/movies/local_outputs_2026-10-28/`;
> v4 narration/pieces `G:/…/archive/movies/ch00_cross_product_why_v4_final/`. C: watch: keep ≥ 40 GB free; Remotion
> temp bundles in %TEMP% are cleared with `tools/clean_scratch.py` (it accepts `%TEMP%/remotion-*`).
> Run at most 3–4 agents at once (the weekly limit was hit with 6).

## (previous snapshot, 2026-10-28 ~01:00, kept for detail)

The SessionStart hook points here. **On session start (or when the user says "resume"): read this file, give the user a
5-line status, then restart every stream below immediately, without waiting.** Each stream says exactly what to do.
Agents from the old session cannot be resumed by id in a new session: start a fresh agent of the named type with the
brief given here (all inputs are in files; nothing lives only in the old chat).

## Standing rules (unchanged; details in the files)
- Order of the series: **`movies/ch00/series_plan_v2_proposal.md` (APPROVED plan v2, 79 movies)**; rules in
  `movies/ch00/series_plan.md` (real data/maps, best data+tool per visual, cartography + map-toolkit skills, sound,
  latest data + history + impacts, Cesium liked, cross-references spoken + end card, never push, cleanup with
  `tools/clean_scratch.py`, Drive upload with `tools/drive_upload.py` + links in `outputs/drive_links.md`,
  ≥ 2 reviews, cumulative report after each final movie). House style `movies/HOUSE_STYLE.md`. Memory file
  `ch00-movie-series-loop` has the same rules.
- Never push. Agents never commit; the orchestrator commits. Two builders only with separate folders + Remotion entries.

## Streams (restart all)
| # | Stream | State at stop | Restart with |
|---|---|---|---|
| 1 | **0.3 Weather basics (stage 2 build)** — `movies/src/ch00_weather_basics/` (own entry), `movies/ch00/ch00_weather_basics/`, `tools/movie_wb/`, scratch `G:/…/scratch/movies/ch00_weather_basics/v2/` | Composition built with the capability-test winners (Cesium Tibet drape, ETOPO, latest-GFS beat, narration inserts spliced, sound mix tool); was fixing label-check issues; **no final render yet**. WIP committed (see git log "WIP"). | **motion-builder**: "Continue stage 2 of ch00_weather_basics from the WIP: read `movies/ch00/ch00_weather_basics/{data_needs.md §E–F, storyboard.yaml}`, `research/capability_tests.md`, map-toolkit + cartography skills; finish the shape-aware label check (`tools/movie_wb/label_check.py`), render on the RTX (ports 4600+, conc 3), mix sound (`tools/sound/mix.py`, `sound_cues.yaml`), QA `--hard-mb 160`, vscan, frame check; output `movies/out/ch00/ch00_weather_basics/1080.mp4`; don't commit." Then: commit → Drive upload → review 1 (movie-reviewer) → fixes → review 2 → final → cumulative report → cleanup. Title subtitle must stay ≥ 50 px clear of the animation. |
| 2 | **#1 Vectors & index notation — plan** (`movies/ch00/ch00_vectors_index_notation/`) | Planning, mid-dry-run (v3 TTS); vector addition/subtraction block with weather examples being added. | **movie-director**: finish the plan per the brief in the folder + user additions: vector addition & subtraction from scratch with real weather examples (geostrophic+ageostrophic=real wind, airspeed+jet, drifter=current+wind drift, forces on a parcel; shear hodograph from a real sounding, hourly wind change, El Niño trade-wind anomaly, storm-relative wind), cross-reference rule (`related:` per scene, spoken pointers + end card). TTS dry run; report length. |
| 3 | **#2/#3 Cross-product splits — plan** (`movies/ch00/ch00_cross_product/`, `ch00_cross_product_uses/`) | Planning, mid-dry-run. | **movie-director**: finish both plans (reuse v4 scenes + archived narration `G:/…/archive/movies/ch00_cross_product_why_v4_final/audio/`; fix review-3 R3-S1..S4; #2 maths ending, #3 weather ending; own music each; cross-references). |
| 4 | **#69 Reading weather maps — data + data-side library** | Data-scout had fetched the time-limited items (GFS 18 UTC/00 UTC 27 Oct, GOES-19 via Earth Engine, z500) and written `fluidpy/data/{isd,metar,wpc,movie_rwm}.py` + `goes/gibs/gfs` options + `tests/data/test_isd_metar_wpc.py` (78 data tests passed); was finishing D1/D7/D8/D10/D11, registry, reports, and the s57 impact verification. WIP committed. | **data-scout**: "Finish `movies/ch00/ch00_reading_weather_maps/data_needs.md` items not yet in `data/registry.yaml`; verify s57 impacts (Enedis ~1.2 M homes; 84-kt Brest gust) with cited sources; run the full fluidpy suite from `../Fluid Dynamics`; report." |
| 5 | **Library tests for sphere/mapproj/station/axes** (`../Fluid Dynamics/fluidpy/{geo/sphere,geo/mapproj,diag/station,diag/axes}.py`) | Verifier had just started (page images). Code WIP-committed. | **math-verifier** with the brief: V-ladder tests (pyproj parity, sympy Mercator, real METAR/SYNOP decode, barb edge cases, isobar exactness, axes on synthetic waves, mutation check), full suite from `../Fluid Dynamics`, write `reports/ch00_rwm_verification.md`. |
| 6 | **Map-toolkit bug fixes** (`tools/maptools/**`) | Mid-way (PyGMT texture size, deck.gl ready, GeoVista texture, recipe point/label/front layers). WIP committed. | **general-purpose**: finish the 4 fixes listed in `research/capability_tests.md` §"Toolkit issues found", run `tools/maptools/selftest.py` + `tests/test_maptools.py`. |

## After those, in order (plan v2)
#4 Derivatives & Taylor, #5 Coordinates (uses `fluidpy.geo.sphere/mapproj`), #6 Gradient, #6A Contour maps, #6B How
contour maps are made, #7 Divergence (~30 min), #8 Curl (~30 min), #9 Laplacian, #10 Material derivative, #10A/10B vector
identities (say where each is used + what it means), #11 Tensors … through #29 Coriolis, #29A F = ma → equation of motion
(long), … #69 Reading weather maps LAST. Plan 2–4 movies at a time.

## Open with the user (not blocking)
M10 publish dot product (needs `! gh repo create shammun/aofd-media --public`), M8 push (user: don't push), dot-product
phone-review title fix (stopped by user), PoC A–G feedback, PoC E Colab, restart Claude Code to load the RustGIS/GeoLibre
MCP servers, Copernicus Marine later, rclone own client id when the shared one retires.

## Useful paths
- Final movies on Drive: `outputs/drive_links.md` (folder https://drive.google.com/drive/folders/1u6SWg5e2o0diQtTs15m8hp6GcVQaYyJ6).
- Phone reviews: `/video-review_2` (rclone `gdrive_reviews:`), done list `outputs/reviews_done.md`.
- Capability tests (user's local review): `G:/Geophysical Fluid Dynamics/aofd-data/captests/` (INDEX.html, showcase.mp4).
