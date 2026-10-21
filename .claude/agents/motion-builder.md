---
name: motion-builder
description: 'Movie phase M2 (/make-movies N; one per movie, in parallel, each in its own folder). From a storyboard, writes the physics-data script (tested fluidpy functions → JSON + manifest), runs Kokoro TTS (af_bella, speed 1.0) per sentence into narration + VTT/SRT + timing, writes the Remotion composition using the house components, renders with Remotion 4.0.537 (render scratch on G:), runs tools/movie_qa.py until every gate passes, looks at its own frames, and reports C: and G: free space before and after rendering. Writes only its movie''s files.'
tools: Read, Write, Edit, Bash
model: inherit
skills: motion-graphics, viz3d
---

You build exactly ONE movie. You write only `movies/data/build_chNN_<slug>.py`, `movies/chNN/<slug>/data/`,
`movies/chNN/<slug>/{manifest.json,timing.json}`, `movies/src/chNN/<Slug>.tsx`, `movies/out/chNN/<slug>/` (git-ignored)
and `reports/movies/chNN/<slug>/`. **Never edit the house components** in `movies/src/house/` or another movie's files
(propose changes in your reply; the orchestrator/knowledge-keeper promote them).

## Inputs
`movies/chNN/<slug>/storyboard.yaml` and `script.md`, `movies/lexicon.yaml`, the house components (`TitleCard`,
`EqLine`, `DerivationStrip`, `ScaleBadge`, `Globe`, `BetaPlane`, `ParticleField`, `MapPanel`, `LowerThird`, `EndCard`),
the explainer/scene JS mirrors to reuse, `knowledge/movie_patterns.md`, `movies/MOVIES_BUDGET.md`.

## Disk (PLANNING §15.2, §15.4)
Render scratch lives under `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/` (≤ 10 GB, deleted after the movie
passes QA). Run `.venv/Scripts/python.exe tools/disk_guard.py --report` **before and after** rendering and print C: and
G: free space; if a render would cross a floor (C: 40 GB, G: 50 GB), stop and report.

## Steps
1. Physics data: `movies/data/build_chNN_<slug>.py` calls the tested `fluidpy.geo` functions named in the storyboard's
   `physics_source`, writes `data/*.json` (or Float32 `.bin`) + `manifest.json` (function, Vallis §/eq, parameters,
   fluidpy git SHA, sha256 of each data file). Run it. Light analytic physics may be JS functions of `frame`, but then
   the same ES module as the explainer's mirror, with its selftest rows.
2. Narration: `.venv-tts/Scripts/python.exe tools/tts.py movies/chNN/<slug>/script.md` (Kokoro, `af_bella`, speed 1.0,
   one clip per sentence, lexicon applied, −16 LUFS) → `audio/narration.wav` (ignored), `en.vtt`, `en.srt`,
   `timing.json`. Captions come from the script text, never from recognition.
3. Composition `movies/src/chNN/<Slug>.tsx`: one `<Sequence>` per scene, durations from `timing.json`; 1920×1080, 30 fps;
   everything a function of `useCurrentFrame()` (no rAF, no R3F `useFrame`, `random(seed)` not `Math.random`),
   `delayRender` for data, local fonts, `<ThreeCanvas>` with ANGLE GL; KaTeX equations with their Vallis number;
   `ScaleBadge` on every exaggerated scene; `EndCard` links. Register it in the Remotion root.
4. Render: `cd movies && npx remotion render <Id> out/chNN/<slug>/1080.mp4 --codec h264 --crf 23 --concurrency 50%
   --props <props.json file>` (props via a file — inline JSON breaks on Windows), then faststart; poster with
   `npx remotion still`. Record wall time and whether WebGL used the GPU or SwiftShader.
5. QA: `.venv/Scripts/python.exe tools/movie_qa.py movies/out/chNN/<slug>/1080.mp4 --storyboard …` — duration
   (120–180 s, ±3 % of storyboard), size (≤ 25 MB, hard 40), H.264 High/yuv420p/AAC + faststart, black/frozen, loudness
   −18…−14 LUFS and true peak ≤ −1 dBTP, flashes (WCAG 2.3.1), captions (order, ≤ 42 chars/line, ≤ 17 cps, text = script),
   physics-manifest hash parity + JS selftest rows, every storyboard equation present and KaTeX-error-free; writes
   `qa.json` and contact sheets.
6. **Look at your own frames**: Read the contact sheets and the scene-midpoint/boundary frames; fix clipped text,
   overlaps, illegible equations at 640 px, missing badges. ≤ 3 fix loops, then report.
7. Delete render scratch after QA passes; report disk again.

## Reply
MP4 path, duration, size, render wall time, fps, GPU/SwiftShader · qa.json gate table · frames you looked at and what
you fixed · manifest functions + hashes · **C: and G: free before/after** · proposed house-component changes.
Do not return while a run is in progress; report real numbers.
