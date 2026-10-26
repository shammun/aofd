# RESUME — where the work stopped (2026-10-26, ≈ 11:00)

The SessionStart hook prints a pointer to this file. **On session start: read this file, give the user the short status
in "Tell the user" below, then start the steps in "Do automatically" without waiting** (the user asked for this on
2026-10-26: "start doing those automatically when I start a new session"). The older PoC questions in
`progress.json → setup.awaiting_user` are still open — list them in the status, but they do not block this movie work
(movie work on ch00_cross_product_why was requested and approved by the user, U-CP.1–7).

## Where we are
- **Movie `ch00_cross_product_why`** (Chapter 0 maths series, video 2 after the dot product; brief
  `reports/ch00_cross_product_brief.md`; house style `movies/HOUSE_STYLE.md`).
  - v1 rendered → review 1 FIX (18 MUST) → fix loop 1 → **v2 rendered** (33:26, 77.49 MB, QA 9 PASS + size WARN in the
    accepted 60–80 MB band), commit 414c736 → **review 2 FIX** (5 new MUST incl. s30 physics: inertial trace rotated
    90°), commit 565e589 → **fix loop 2 done in source only**, commit **19628fa** (all 5 MUST + M8 + 15 SHOULD, checked
    on stills; s30 trace, u and push now from one `inertial_oscillation` integration with tangent/centre CHECK rows).
  - **Render of fix loop 2 STOPPED because drive G: disconnected** (rule: never fall back to C:).
  - User preview: `movies/out/ch00/ch00_cross_product_why/preview_v2.mp4` (= v2; the user may be watching it — never
    overwrite or delete it; the user may send timestamped notes → fold them into the next fix loop).
  - `movies/out/.../1080.mp4` is still v2.
- **fluidpy**: `fluidpy.diag.trajectories` / `cyclone` / `_grid` + 43 tests committed (9176882, local, not pushed);
  full suite 2334 passed. (8 collection errors come from a stray `outputs/ch14/_resume_scratch/` in ../Fluid Dynamics —
  not ours, not deleted. A stray `ll.docx` there is not ours either.)
- **Not pushed**: aofd ≈ 51 commits, fluidpy 3 — push only on the user's go (question M8).
- Review-1 and review-2 reports: `reports/ch00_movies.md` (from line 1619 and 1897). Review frames in
  `reports/movies/ch00_cross_product_why/review{1,2}/` (local, ignored).

## Do automatically (in order)
1. **Check G:**: `.venv/Scripts/python.exe tools/disk_guard.py --report`. If G: is MISSING → tell the user and stop.
2. **Check the G: files are intact** (all under `G:/Geophysical Fluid Dynamics/aofd-data/`):
   - `scratch/movies/ch00_cross_product_why/v2/bundle/` (rebuilt 10:19 with all fix-loop-2 changes) and
     `v2/bundle/public/narration_music.wav` + `music.json`;
   - `scratch/movies/ch00_cross_product_why/v1/public/` (narration + music WAVs);
   - `derived/ch00/` and `movies/ch00/ch00_cross_product_why/data/real/` binaries (git-ignored, regenerable by
     `data/real/fetch_real_data.py`).
   - Then re-run `.venv/Scripts/python.exe movies/data/build_ch00_cross_product_why.py`: all CHECK rows must pass and
     the trail hashes stay 9a8c92dc… / 9b0c8502… / feade087…, inertial30.json f6bc9ef2….
   - If the bundle is gone or older than commit 19628fa: re-bundle from `movies/`:
     `npx remotion bundle src/index.ts --out-dir "<G:…>/v2/bundle" --public-dir "<G:…>/v1/public"`.
     If the WAVs are gone: regenerate with `tools/tts.py` (script.md, af_bella 1.0, the dry-run settings) and
     `tools/music.py score` (seed 7), as in the dot movie.
3. **Hand the render to the motion-builder** (a fresh `motion-builder` agent; give it this file and the review-2
   section of `reports/ch00_movies.md`). The render recipe that works on this machine:
   - kill orphan `remotion`/`chrome-headless-shell`/`ffmpeg` processes first;
   - **foreground** pieces (background shells get killed by the idle-memory reaper):
     `.venv/Scripts/python.exe tools/movie_cp/render_pieces.py "<G:…>/v2" 330 1000 2`, repeated until it prints DONE
     (pieces in `v2/pieces/`, ports 4400+; port 3311 is in a Windows excluded range);
   - join: `.venv/Scripts/python.exe tools/movie_cp/join2pass.py "<G:…>/v2" 172` → `v2/render/1080_2pass.mp4` (≤ 79 MB);
   - QA: `tools/movie_qa.py` with `--budget-mb 60 --hard-mb 80` (10 gates; size WARN in 60–80 is accepted);
   - scan: `.venv/Scripts/python.exe tools/movie_cp/vscan.py <mp4> <outdir> 1` (caption band y 880–1040 and 20-px edges);
   - copy to `movies/out/ch00/ch00_cross_product_why/1080.mp4` + poster + `index.html` (leave `preview_v2.mp4` alone);
   - builder checks frames of every touched scene itself: s04, s11 (5 orbit angles), s12, s15, s18, s23, s24, s26–s28,
     s30 (4 times), s32, s36, s39–s41, s44–s47.
4. **Commit** (orchestrator): `ch00: cross_product_why v3 render …`.
5. **Review 3** — a fresh `movie-reviewer` on the changed scenes plus a quick full-movie scan; verify review-2 items
   N-M1…N-M5, M8 and the SHOULD list; re-check the s11 "a" label near "a × b" at ≈ 06:51 (builder skipped S8) and the
   skipped s25 cut-away shape (S10, cosmetic). Fix loops ≤ 3, then report.
6. On PASS: tell the user the movie is ready (`movies/out/ch00/ch00_cross_product_why.html` / `1080.mp4`), ask for their
   notes, and mention `/approve-movie 0 ch00_cross_product_why` only after they approve.

## Tell the user (first reply, short)
- Where things stand (as above, in plain words), whether G: is back, and what is starting now.
- Open questions still waiting (from `progress.json → setup.awaiting_user`): M10 publish the dot movie
  (`! gh repo create shammun/aofd-media --public` then go for `/approve-movie 0 ch00_dot_product_why`), M8 push,
  M11 T1–T8 cosmetics, PoC A–G feedback, PoC E Colab run.
- Disk on C:/G:. Scratch can be cleaned after approval: `scratch/movies/ch00_cross_product_why/v1` (bundle ≈ 390 MB) and
  older pieces.

## When this movie is approved
Delete this file's "Do automatically" block (or the file) and the `resume` key in `progress.json`, so later sessions
don't redo it.
