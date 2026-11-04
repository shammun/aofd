# RESUME — 2026-11-04 (session resumed after a stop)

**State now:** weather UF2 fix loop 2 rendered, joined (58:06, 156.7 MB, commit 4269d36), QA pass (duration/size pass with the movie's own windows), source_check 0 fails; on C: movies/out, G: viewing copy and Drive (outputs/drive_links.md). Review 3 running (reports/ch00_movies.md). #4 fix loop 3 (the last) source fixes running in a builder, no render yet; render #4 after it returns (one Remotion job at a time). Then continue the queue below (#5 → #6 → M01 → …) automatically, movie after movie (user re-confirmed 2026-11-04).
If this session died: if review 3 is not in reports/ch00_movies.md, rerun it; if #4 has fix3_log.md but no render, render it.

# (older) G: back 2026-10-30 (was disconnected ~09:45); queue restarted

Render 3 was restarted with `render_uf2.py --from 4` (log `uf2/render_fix1c_resume.log`); c00–c03 are verified at 4000 frames, and the bundle matches commit 25eb34b. If this session died, check which chunks exist and rerun with `--from <first missing>`. Data scout for #6 and M01 started alongside it.

Update: render 3 finished (57:51, on Drive); review 2 = FIX, 16 Must + 25 Should (reports/ch00_movies.md, "UF2 — review 2"). Fix loop 2 of weather starts when the #4 render finishes (one Remotion job at a time). Item 1 below is done up to review 2; item 3 and item 4 are done (suite: 3188 passed, 1 xfailed).

Update: #4 fix 2 on Drive (49:07, 745397a); review 3 = FIX, 9 Must + 12 Should, all TSX with no TTS (reports/ch00_movies.md, "ch00_derivatives_taylor — review 3"). #4 fix loop 3 (the last allowed before reporting to the user) starts when weather fix loop 2 releases Remotion.

**Resume in this order:**
1. Weather UF2 render 3: delete `uf2/render/c04*` if partial; run `tools/movie_wb/render_uf2.py` (TEMP/TMP on G:) for the missing chunks (~2 h); join with `join2pass.py <uf2/render> <uf2/public/narration_music.wav> <out> --mb 152 --abr 128k --alim 0.5`; copy to movies/out; run QA with `--overlap G:/…/uf2/stills/k6final2`, source_check, vscan; then G: viewing copy + Drive, then review 2.
2. #4 fix loop 2 render (the builder's report has the resume steps).
3. The data scout for #6 D8 (Elliott), #5 (21 Jan 2026), M01 D1–D3 (its report lists what is left).
4. The full fluidpy suite.
Meanwhile the render-2 weather movie (57:52, all fixes except the small render-3 polish) is on C: at movies/out/ch00/ch00_weather_basics/1080.mp4.

## Queue details (from before the disconnect)
 RESUME — the work queue (updated 2026-10-29 ~21:00)

**On start or "resume":**
1. Check that G: is there (`ls "G:/Geophysical Fluid Dynamics/aofd-data"`). If it is missing, tell the user and stop all G: work. Never fall back to C:.
2. Check C:. If it has less than 45 GB free, follow memory `c-drive-low-space-action` (archive `outputs/viewing_2026-10-29` to G:, clean C: scratch).
3. Brief the user, then continue the queue below in order.

**Rules:**
- Only ONE builder may run any Remotion or Chrome job (renders AND stills) at a time. RAM ran out twice on 2026-10-29/30 (0.7 GB free) and the page file grew to 30 GB, filling C:. Set TEMP and TMP to G: for every Remotion or Chrome process. At most 3–4 agents at once.
- Ports 5100–5270 or 5600–5700 (Windows reserves 5271–5570).
- Never push. Agents never commit; the orchestrator commits.
- Standing rules live in `movies/HOUSE_STYLE.md` (especially §5b, globes and layer stacks) and memories `ch00-movie-series-loop`, `follow-my-recommendations`, `globe-framing-and-layer-stacks`.
- **User, 2026-10-29: when the priority movie is finalized, resume the paused work automatically. After every finalized movie, start the next queued task without waiting.**

## Finished (final, on C: and on Drive — see outputs/drive_links.md; user copies now on G: at archive/movies/viewing_2026-10-29/viewing_2026-10-29/ (moved off C: 2026-10-29 21:05 under the low-space rule; new viewing copies go there too))
| # | Movie | Length | Note |
|---|---|---|---|
| 0.1 | Dot product v6 | 17:40 | |
| 0.1b | Dot product new (v6 + additions) | 25:52 | §5b retro-fit pending: s20c labels on the globe |
| 0.2 | Cross product v5 full | 1:09:15 | review 3 PASS; §5b retro-fit pending (source line drawn at a fixed y lands on pictures, about 31 places, shared with Part 2) |
| 0.2a | Cross product Part 1 | 32:41 | clean |
| 0.2b | Cross product Part 2 | 40:57 | review 3 PASS; §5b retro-fit pending |
| 1a | Vectors and index notation | 35:15 | review 3 PASS; §5b retro-fit (5 musts) + wind layer stack pending; 4 polish shoulds |

## Queue (in order; series plan v4 adopted 2026-10-30: movies/ch00/series_plan_v4_proposal.md, 176 movies)
| # | Stream | Next step |
|---|---|---|
| 1 | **Weather basics UF2** fix loop 1 pass 1b | QA → G: viewing copy + Drive → review 2 → final |
| 2 | **#4 Derivatives and Taylor** fix loop 2 (+ stack) | render after weather → QA → review 3 → final |
| 3 | **#5 Coordinates** → **#6 The gradient** (plans being amended for §5b) | build → ≥ 2 reviews → final |
| 4 | **M01 Contour maps** (height on contours first) | build → reviews |
| 5 | §5b retro-fit: cross product v5 + Part 2 | after M01 |
| 6 | **U01** pressure-gradient force → **M03** Coriolis/geostrophic/gradient/friction winds | in order |
| 7 | §5b retro-fit: #1a (+ wind stack) + 0.1b | after M03 |
| 8 | **U02** convergence/divergence → **M07** pressure as vertical coordinate → **M08 Geopotential** → **M09** standard levels → **M16** climate machine → **U03** lapse rates → **M12** first law/adiabats/θ/stability → **M13** humidity/CAPE → **M14 skew-T** → **M15** clouds → **U04–U18** (rain, snow/hail, rainfall, boundary layer, fronts M04, jet, waves, vorticity, cyclones, thunderstorms, severe storms, ocean, tropical cyclones, monsoon, satellite, radar) | understanding block, positions 11–39 |
| 9 | Map reading M02, M05, M06, M10, M21–M24, M11, M17–M19, M25–M26, M20 | positions 40–54 |
| 10 | Forecasting F01–F39 "Reading maps to predict…" | positions 55–93 |
| 11 | #1b, T, R, W, S, G, A, O, CV, CE (CE may jump in once its prerequisites are done) | v4 order |
| — | Full fluidpy suite after the renders (library fc51cf0) | when no render runs |

## Open with the user (not blocking)
- **REMIND THE USER (asked 2026-10-29):** open 3 free accounts: EUMETSAT Data Store (older Meteosat images for Sidr, Nargis, Aila), ECMWF (TIGGE forecast archive), NCAR RDA (older GFS runs). Needed before forecasting movies F14/F17/F18/F19; until then use GridSat-B1, HURSAT and NHC ATCF.
- M10 publish (needs `! gh repo create shammun/aofd-media --public`).
- M8 push: the user said don't push.
- PoC A–G feedback.
- C: cleanup only the user can do: restart the PC (page file), `pip cache purge`, Disk Cleanup.
- `../Fluid Dynamics/ll.docx` is untracked and not ours: leave it.

## Useful paths
- Drive links: `outputs/drive_links.md`. rclone is on G:.
- Reviews: `reports/ch00_movies.md`.
- User feedback: `reports/ch00_weather_basics_user_feedback{,_round2}.md`.
- Never clean `outputs/viewing_*`, except by the archive-to-G: rule when C: is below 45 GB.
