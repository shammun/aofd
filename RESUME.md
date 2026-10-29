# RESUME — where the work stopped (2026-10-28 ~19:40: G: DISCONNECTED)

**On start / "resume": first check G: (`ls "G:/Geophysical Fluid Dynamics/aofd-data"`). If it is missing, tell the user and
stop all G: work (CLAUDE.md rule 11, never fall back to C:). If it is back: brief the user in 5 lines, then restart the
streams below in order, at most 3–4 agents at once, at most 2 builders (separate folders, ports 5100–5270 / 5600–5700;
Windows reserves 5271–5570). Standing rules: movies/ch00/series_plan.md, movies/HOUSE_STYLE.md, memory files
`ch00-movie-series-loop`, `follow-my-recommendations`. Never push. Agents never commit; the orchestrator commits.**

## Finished (final, on C: and on Drive — see outputs/drive_links.md)
| # | Movie | Final | Drive |
|---|---|---|---|
| 0.1 | Dot product v6 | 17:40 | yes |
| 0.1b | Dot product new version (all of v6 + additions) | 25:53, review 2 PASS | yes (`dot_product_v01b_fix1.mp4`) |
| 0.2 | Cross product v4 (full) | 48:28 | yes |
| 0.3 | Weather basics | 40:05, review 4 PASS | yes (`weather_basics_FINAL_v3_fix3.mp4`) |

## Streams to restart when G: is back
| # | Stream | State at stop | Restart with |
|---|---|---|---|
| 1 | **Cross product v5 + Part 1 + Part 2** (`movies/src/ch00/CrossProductWhy.tsx`, commit 3c92f2c) | All three MP4s on C:: `movies/out/ch00/ch00_cross_product_why/v5_1080.mp4` (58:42, 150.3 MB), `movies/out/ch00/ch00_cross_product/1080.mp4` (32:40), `movies/out/ch00/ch00_cross_product_uses/1080.mp4` (30:16, QA PASS final). v5 and Part 1 passed QA on fix-loop-1; the final (fix-loop-2) files still need the QA re-run + vscan. | Orchestrator: run QA on v5 from a staging folder whose en.vtt/en.srt are `v5_en.vtt`/`v5_en.srt` (the out folder's en.* are v4's), and on Part 1 in place (`--hard-mb 160 --budget-mb 120 --duration-window 120,3600`); commands in G:/…/scratch/movies/ch00_cross_product_v5/final2.sh. Then Drive upload of all three → **review 1 for each (movie-reviewer)** → fixes → review 2 → final → cumulative report → clean G: scratch `ch00_cross_product_v5/` (archive pieces). Leftover planner items not done (optional): s04 sign dial, s22b three lights, s22e/s30 energy bar, s23 compass sweep, s24 pole camera. |
| 2 | **#1a Vectors & index notation build** (`movies/src/ch00_vectors_index_notation/`, WIP commit c554b65) | Composition (45 scenes, tsc clean), data build 92 CHECK PASS, narration reworded to real data (jet 65 m/s; El Niño −5.0 → −3.7, +1.3), `index-lattice` style added, Kronecker lexicon. Final TTS failed when G: dropped; first-round still fixes not yet re-checked. | **motion-builder**: steps in the builder's hand-back (also below): build `--public G:/…/ch00_vectors_index_notation/v1/public`; final TTS (`tools/tts.py … script.md --out G:/…/v1/tts`), copy timing.json + captions, listen-check "Kronecker"; re-render review stills with `stills.mjs` (not the `<Freeze>` comp), ≤ 3 fix loops; mix (`index-lattice`, seed 11 + effects); render conc 2 ports 5100–5270; join (join.py crf/AAC); QA; vscan; frames. Then Drive → reviews. |
| 3 | **#5 Coordinates data + source check** (data-scout) | Stopped at G: drop; see its hand-back (if received) in the session; D1 latest-winter 10 hPa vortex, D2 ERA5 Ian winds aloft, D3 NOAA CO-OPS (new `fluidpy/data/coops.py`), D4 ERA5 monthly t2m anomaly; source check research/ch00_coordinates_sources.md (Ian surge 10–15 ft vs NHC report, 135 kt). | **data-scout** with the same brief (movies/ch00/ch00_coordinates/data_needs.md). |
| 4 | **#5 library tests** | F1–F4 committed (d726b6f in fluidpy: enu_basis, band_area, unit_vector_rates, metric_terms, track_by_continuity, translation_velocity); tests not written. Needs ERA5 Ciarán on G: for real-data rows. | **math-verifier** (V-ladder, mutation check, full suite from ../Fluid Dynamics) → reports/ch00_coordinates_verification.md. |
| 5 | **#1b build** | Plan + library + data done (registry keys ERA5-CDS-ciaran2023-pl etc.). Music `index-lattice-cycle` still to add. | **motion-builder** after #1a (reuse #1a's composition patterns; own folder `movies/src/ch00_alternating_tensor_triple_products/`). |
| 6 | **#4 Derivatives & Taylor build** | Plan (46:39, source check applied), library + tests done, data done (notes appended to its data_needs.md: DT26 wording, DT53 trends, DT61 240.6 W/m², cloudy D5). Music `tangent-glide` to add. | **motion-builder**. |
| 7 | **#69 Reading weather maps** | Data complete and verified (commit 7cc6a1d); notes in its data_needs.md (trough axis, SYNOP m/s, Brest 156 km/h not the storm's strongest gust). | Build later (series order: last). |

## After those (plan v2 order)
#6 Gradient, #6A Contour maps, #6B How contour maps are made, #7 Divergence (~30 min), #8 Curl (~30 min), #9 Laplacian,
#10 Material derivative, #10A/10B vector identities, #11 Tensors … #29 Coriolis, #29A F = ma → equation of motion … #69 last.

## Open with the user (not blocking)
M10 publish (needs `! gh repo create shammun/aofd-media --public`; 0.1b is now the dot-product movie to publish), M8 push
(user: don't push), PoC A–G feedback, PoC E Colab. `../Fluid Dynamics/ll.docx` is untracked and not ours — leave it.
%TEMP% on C: holds ~38 GB not from this project (user may run Disk Cleanup).

## Useful paths
- Drive links: `outputs/drive_links.md` (folder https://drive.google.com/drive/folders/1u6SWg5e2o0diQtTs15m8hp6GcVQaYyJ6). rclone lives on G: (G:/…/aofd-data/tools/rclone) — Drive upload also needs G:.
- Archives on G:: `archive/movies/ch00_weather_basics_v3_final/`, `archive/movies/ch00_dot_product_v01b_final/`, `archive/movies/ch00_cross_product_why_v4_final/`.
- Reviews and reports: `reports/ch00_movies.md`; verification reports `reports/ch00_*_verification.md`.

**User viewing copies:** `outputs/viewing_*/` hold the user's own snapshot copies of the movies (made 2026-10-29). Never overwrite, clean or delete them (tools/clean_scratch.py can reach outputs/ — exclude these).
