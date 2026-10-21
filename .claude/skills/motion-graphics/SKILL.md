---
name: motion-graphics
description: How aofd makes its 2–3-minute narrated motion-graphics movies - Remotion 4 (+ @remotion/three, KaTeX, d3-geo) driven by physics precomputed from tested fluidpy functions with a manifest, deterministic frame-indexed rendering on Windows, the storyboard.yaml schema and script.md, Kokoro TTS per sentence (voice af_bella, speed 1.0) with captions written from the script (VTT + SRT, timing.json), house components, render and poster commands, render scratch on G:, tools/movie_qa.py gates (duration, size, codec, black/frozen, loudness −16 LUFS, flashes, captions, physics parity, equations), the movie-reviewer, size budgets, publishing to shammun/aofd-media only after /approve-movie, and accessibility (no autoplay, WCAG flashes, transcript). Load when planning, scripting, building, rendering, checking, reviewing or publishing any movie, and for the PoC test clip.
---

# motion-graphics — honest movies from tested physics

Source: research note R1 (§3–§7); PLANNING §6.3, §8.4. Movies are **async** (`/make-movies N` after `notebook: pass`)
and never block chapter N+1. Chapter 0: M0-1…M0-3 first; the user watches them; M0-4…M0-6 are made with that
feedback built in (Q12).

## 1. Stack (installed in `movies/`)
Remotion **4.0.537** (all `@remotion/*` on one exact version), `@remotion/three`, `@remotion/media-utils`,
`@remotion/captions`, React 19, three 0.186.1, @react-three/fiber, KaTeX, d3-geo; Remotion's headless Chrome; ffmpeg /
ffprobe 9 on PATH. Narration: **Kokoro-82M** 0.9.4 in `.venv-tts` (CPU torch, espeak-ng bundled; ≈ 2× real time).
**Voice `af_bella`, speed 1.0** (`book.yaml → project.tts`) — every movie sounds the same. No Manim unless the PoC shows
KaTeX equation sequences are weak (then Manim CE inserts composited with `<OffthreadVideo>`). No generative video, no
AI images: every pixel is code-rendered.

## 2. Pipeline
```
pages + curation/design ─▶ movie-director ─▶ movies/chNN/<slug>/{storyboard.yaml, script.md}, movies/chNN/plan.md
fluidpy (tested) ─▶ movies/data/build_chNN_<slug>.py ─▶ movies/chNN/<slug>/data/*.json|.bin + manifest.json
tools/tts.py (Kokoro) ─▶ audio/narration.wav (ignored) + en.vtt + en.srt + timing.json
motion-builder ─▶ movies/src/chNN/<Slug>.tsx ─▶ npx remotion render ─▶ movies/out/chNN/<slug>/1080.mp4 + poster.jpg
tools/movie_qa.py ─▶ qa.json + contact sheets (reports/movies/…) ─▶ movie-reviewer ─▶ reports/chNN_movies.md
status qa_pass ─▶ drafts/ in the media repo (unlinked) ─▶ user watches ─▶ /approve-movie N slug ─▶ published
```

## 3. Storyboard (the contract) — `movies/chNN/<slug>/storyboard.yaml`
```yaml
id: ch02_coriolis
title: "Why winds turn right: the Coriolis effect"
concepts: [C03, C04, C07]          # curation ids this movie serves
target_duration_s: 150             # 120–180 (the PoC clip: 20)
fps: 30
size: [1920, 1080]
style: house-dark-v1
scenes:
  - id: s1_hook
    t: [0, 12]
    visual: "…"
    voiceover: "Every big storm in the northern hemisphere spins the same way. Why?"
    on_screen_eq: null
    physics_source: null           # decorative scenes must say so ("decorative")
    exaggeration: ["procedural cloud field, illustrative only"]
  - id: s3_turntable
    t: [30, 62]
    voiceover: "…"
    on_screen_eq: {latex: "\\frac{D\\mathbf{u}}{Dt} + 2\\boldsymbol\\Omega\\times\\mathbf{u} = …", vallis_eq: "(N.M)", page_png: "chapters/pages/…"}
    physics_source: {fn: "fluidpy.core.rotating.<fn>", params: {Omega: 0.5, u0: 1.0}, test: "tests/…::test_…"}
    exaggeration: ["table rotation 0.5 rad/s, not Earth's 7.29e-5 rad/s"]
honesty_notes: ["Coriolis is an apparent force in the rotating frame; we say so in s3"]
quiz_hook: "Which way does the ball curve in the southern hemisphere?"
```
Rules: every scene has narration (empty needs a reason); every on-screen equation has LaTeX **and** its Vallis number
from the page image; every non-decorative visual names a tested `physics_source`; every exaggeration listed; hook in the
first 10 s; one idea per scene; ends on an end card pointing to the notebook section and explainer. Narration ≤ 150
words/min (≈ 2.5 words/s), **our own words**, maths spoken in words ("f equals two Omega sine phi"). Pronunciations in
`movies/lexicon.yaml` (Ekman, Sverdrup, Rossby, β-plane…). The post-write hook schema-checks every storyboard.

## 4. Physics honesty
- Heavy physics (trajectories, gyres, Rossby dispersion, QG eddies) computed **in Python by tested fluidpy functions**:
  `build_chNN_<slug>.py` writes data JSON/Float32 `.bin` + `manifest.json` (function, Vallis §/eq, parameters, git SHA,
  hash). Remotion loads via `staticFile()` and only **interpolates** in time.
- Light analytic physics may be a JS function of `frame` — then it is the **same ES module** as the explainer mirror,
  with its `selftest()` rows run by QA.
- **Determinism**: everything is a function of `useCurrentFrame()`; never `requestAnimationFrame` or R3F `useFrame`;
  `random(seed)` not `Math.random`; `delayRender/continueRender` for data; bundled local fonts;
  `Config.setChromiumOpenGlRenderer('angle')` for `<ThreeCanvas>`.
- "Not to scale" badge (`ScaleBadge`) on every exaggerated scene; decoration only when labelled "illustrative".

## 5. Narration and captions (`tools/tts.py`)
Kokoro **one clip per sentence** from `script.md`; measure each clip (`soundfile`); concatenate with fixed gaps; write
`en.vtt` / `en.srt` cues from the cumulative times (exact text from the script, **no speech recognition**) and
`timing.json`; scene durations come from `timing.json` (narration drives timing; visuals stretch). Caption rules: ≤ 2
lines, ≤ 42 chars/line, ≤ 17 chars/s, cues 1–7 s. Captions are a separate track, never burned in. No music by default;
loudness normalised to **−16 LUFS** (`ffmpeg -af loudnorm`), true peak ≤ −1 dBTP.

## 6. House components (`movies/src/house/*.tsx`, written once, promoted by the orchestrator/knowledge-keeper only)
`TitleCard`, `EqLine` (KaTeX + term highlight in the project term colours), `DerivationStrip`, `ScaleBadge`, `Globe`
(three.js sphere + graticule + lat/lon arrows), `BetaPlane`, `ParticleField` (instanced points along precomputed paths),
`MapPanel` (d3-geo), `LowerThird`, `EndCard`. Scene modules are shared with `assets/viz3d.js` where possible.

## 7. Render (Windows: props via a file — inline JSON breaks in shells)
```powershell
cd movies
npx remotion render <CompId> out/chNN/<slug>/1080.mp4 --codec h264 --crf 23 --concurrency 50% --props props.json
ffmpeg -i in.mp4 -c copy -movflags +faststart out.mp4
npx remotion still <CompId> out/chNN/<slug>/poster.jpg --frame=<n>
```
Iterate with `--frames a-b`. **Render scratch on G:** (`<data root>/scratch/movies`, ≤ 10 GB, deleted after QA pass);
check the C:/G: disk guard before rendering and report free space before and after. Default output H.264 MP4 only.
Record render wall time, fps, size, and GPU vs SwiftShader.

## 8. QA gates (`tools/movie_qa.py`, ffprobe/ffmpeg)
| Gate | Fails when |
|---|---|
| Duration | outside 120–180 s (PoC: 20.0 ± 0.1 s) or > ±3 % from the storyboard |
| Size | > 25 MB for 3 min at 1080p (hard cap 40 MB; PoC ≤ 4 MB) |
| Codec | not H.264 High / yuv420p / AAC, or no faststart |
| Black/frozen | black > 0.5 s outside fades; frozen > 4 s without narration on a static slide |
| Loudness | outside −18…−14 LUFS; true peak > −1 dBTP |
| Flashes | > 3 large flashes per second (WCAG 2.3.1) |
| Captions | cues out of order or outside the audio, > 42 chars/line, > 17 cps, text ≠ script |
| Physics parity | manifest functions re-run, hashes compared; JS selftest rows |
| Equations | every `on_screen_eq.latex` present in the composition; no `katex-error` |
| Review frames | contact sheets (`fps=1/5,scale=480:-1,tile=6x5`) + full frames at every scene midpoint/boundary + a short GIF per scene |
Determinism check: render twice, compare `framemd5` (identical or WebGL anti-aliasing differences only, recorded).
The motion-builder **looks at its own frames** before handing back; ≤ 3 fix loops.

## 9. movie-reviewer checklist (fresh eyes, frames only)
Physics honesty (deflection direction, hemisphere sign, westward Rossby phase, western intensification), equation
fidelity vs the page image, legibility at 640 px, no clipped text, pacing vs narration, caption accuracy, colour-blind
safety, no flashes, "not to scale" badges present. Timestamped findings in `reports/chNN_movies.md`. Never edits the movie.

## 10. Publishing (only after the user approves)
- Media repo `shammun/aofd-media` (`../AOFD Media`, GitHub Pages): `chNN/<slug>/{1080.mp4, poster.jpg, en.vtt, en.srt,
  transcript.md, manifest.json}`; drafts under `drafts/` (not linked). **Public only after `/approve-movie N slug`**
  (the user watches every draft first). `tools/publish_movie.py` moves the draft, the orchestrator pushes; never
  force-push; start `aofd-media2` above 800 MB; re-render only on content change.
- Site embed: `<video controls preload="metadata" playsinline poster="…">` + `<track kind="captions" srclang="en"
  label="English" default>`, transcript below, download link; **no autoplay**; `prefers-reduced-motion` shows poster +
  transcript first. Posters and VTT also copied into the site repo.
- No book scans, crops or quoted text; `check_public.py` scans storyboard, script and VTT.
- Before the first public movie: the user has emailed `hi@remotion.dev` to confirm the individual/educational licence.

## 11. Lessons (the knowledge-keeper appends to `knowledge/movie_patterns.md` and here; one line each, dated)
