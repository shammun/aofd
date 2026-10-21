---
name: make-movies
description: Make the 2–3-minute narrated motion-graphics movies for one chapter (async, never blocks the next chapter) - movie-director plans and storyboards, motion-builders (one per movie, in parallel) precompute physics from tested fluidpy functions, narrate with Kokoro af_bella, render with Remotion, run movie_qa.py and look at their own frames, movie-reviewer checks physics honesty, then drafts are pushed to the media repo's drafts/ for the user to watch. Usage - /make-movies 0 · /make-movies 2 · /make-movies 2 ch02_coriolis · /make-movies 0 --batch 2
disable-model-invocation: true
---

# /make-movies N [slug] [--batch k]

Starts only when chapter N has `notebook: pass` (it needs CORE ids, explainers and tested functions). Runs independently
of later chapters. Skill `motion-graphics` holds the storyboard schema, render and QA rules; read it.

**Chapter 0 (Q12, user 2026-10-20):** batch 1 = **M0-1 climate machine, M0-2 spinning planet, M0-3 how to read a
climate map** — made first; the user watches them and gives feedback; that feedback goes into
`knowledge/movie_patterns.md` and the storyboards of batch 2 (M0-4 dot and cross, M0-5 grad/div/curl, M0-6 riding with
the flow, optional). `--batch 2` refuses to start until batch 1 has the user's verdict recorded.

## Steps
0. Preflight: `.venv-tts` imports kokoro; `movies/node_modules` present (`npm ci` in `movies/` if not); `ffprobe -version`;
   disk report (`tools/disk_guard.py --report`): render scratch goes to `G:/…/aofd-data/scratch/movies` (≤ 10 GB, deleted
   after QA pass); stop if a floor would be crossed.
1. `movie-director` (one agent) → `movies/chNN/plan.md` (which 1–3 movies cover which concept groups and why motion
   beats the explainer) + per movie `movies/chNN/<slug>/{storyboard.yaml, script.md}`: 120–180 s, hook in 10 s, one idea
   per scene, every equation LaTeX + Vallis number from the page image, every non-decorative visual names a tested
   `physics_source`, exaggerations listed, ≤ 150 words/min, own words only. Validate storyboards against the schema.
2. `motion-builder` × (1–3), **one message, each writes only its own movie folders**: `movies/data/build_chNN_<slug>.py`
   → `data/*.json` + `manifest.json` (function, §/eq, params, git SHA, hash); `tools/tts.py` (Kokoro `af_bella`, speed 1.0,
   per sentence, `movies/lexicon.yaml`) → narration WAV + VTT + SRT + `timing.json`; `movies/src/chNN/<Slug>.tsx` from
   house components only; `npx remotion render <Id> … --codec h264 --crf 23` (props via a file); `tools/movie_qa.py`
   until all gates pass; Reads its own contact sheets and scene-boundary frames; ≤ 3 fix loops, then report.
3. `movie-reviewer` (fresh eyes, read-only) → `reports/chNN_movies.md`: per movie PASS/FIX with timestamps (deflection
   direction and hemisphere, westward Rossby phase, western intensification, equation fidelity vs the page, legibility at
   640 px, pacing, captions = script, colour-blind safety, flashes, "not to scale" badges). FIX → back to that builder
   (≤ 3 loops).
4. Status `qa_pass`. Push the draft to `../AOFD Media` under `drafts/chNN/<slug>/` (`tools/publish_movie.py --draft`;
   commit `chNN: movie <slug> — <MB>, <s>`; the media repo must exist — otherwise stop and give the user the
   `! gh repo create shammun/aofd-media …` commands). The site never links drafts.
5. Delete render scratch for passed movies; disk report again; record render wall time, fps, size, GPU vs SwiftShader
   in `knowledge/movie_patterns.md` (via the knowledge-keeper or yourself at the end).
6. Tell the user: the draft URLs / local MP4 paths, durations, sizes, the reviewer verdict, and
   "watch it, then `/approve-movie N <slug>` or tell me what to change".
