---
name: approve-movie
description: Record the user's approval of one watched movie draft, publish it to the media repo (chNN/<slug>/ with MP4, poster, VTT, SRT, transcript, manifest), enable the <video> block on the chapter page, and commit and push both repos. Only the user runs this, after watching the draft. Usage - /approve-movie 0 m0_1_climate_machine · /approve-movie 2 ch02_coriolis "fine, but slower at 1:10 next time"
disable-model-invocation: true
---

# /approve-movie N slug ["note"]

This is the user's explicit go-ahead for an outward-facing publication of that one movie. Never run it on your own.

1. Check `progress.json → chapters.chNN.movies[slug] == "qa_pass"` and that `reports/chNN_movies.md` says PASS for it;
   otherwise stop and say what is missing. A note from the user goes into `knowledge/movie_patterns.md` (dated) and,
   for Chapter 0 batch 1, into the batch-2 brief.
2. `tools/publish_movie.py chNN <slug>` (skill `motion-graphics`): moves `drafts/chNN/<slug>/` → `chNN/<slug>/` in
   `../AOFD Media` (`1080.mp4`, `poster.jpg`, `en.vtt`, `en.srt`, `transcript.md`, `manifest.json`), updates the media
   `index.html`, copies poster + VTT into this repo (`movies/chNN/<slug>/`), checks size (≤ 25 MB, hard 40) and the media
   repo total (warn > 800 MB; then start `aofd-media2`). Never force-push.
3. Commit + push the media repo: `chNN: movie <slug> — <MB>, <s>`; poll the MP4 URL on Pages until 200 (range requests
   work → seeking works).
4. Set the movie `published`; re-publish the chapter page (`tools/publish_notebook.py chNN`) so the notebook's
   `nb.movie(...)` block becomes a `<video controls preload="metadata" playsinline poster>` with the caption track, the
   transcript below and the end-card links; `tools/check_public.py`; commit `chNN: publish — movie <slug>`; push.
5. Report: page URL with the movie, media URL, size, duration, disk C:/G:.
