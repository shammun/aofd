# Movie patterns — aofd (Remotion + Kokoro motion graphics)

Lessons for the movie-director, motion-builder and movie-reviewer. Seeded from research note R1; the knowledge-keeper
adds what each `/make-movies N` run teaches. Skill: `motion-graphics`.

## Starting lessons (R1)

- **Code-rendered from tested physics, never generative video.** Heavy physics is precomputed in Python by tested
  `fluidpy` functions → `movies/chNN/<slug>/data/*.json` + `manifest.json` (function, Vallis §/eq, parameters, git SHA,
  hash); light analytic physics may be a pure JS function of the frame, but then it is the same module as the explainer
  mirror with its parity rows.
- **Determinism.** Everything is a function of `useCurrentFrame()`; no `requestAnimationFrame`/`useFrame`, `random(seed)`
  not `Math.random`, `delayRender` for data, local fonts. `<ThreeCanvas>` with `gl: angle`.
- **Narration drives timing.** Kokoro per sentence (voice **af_bella, speed 1.0**, `.venv-tts`, ≈ 2× real time on CPU);
  clip durations measured, concatenated with fixed gaps; VTT/SRT written **from the script**, not transcribed.
  ≤ 150 words/min; maths spoken in words; captions ≤ 2 lines × 42 chars, ≤ 17 cps, cues 1–7 s; never burnt in.
- **Pronunciation.** Keep `movies/lexicon.yaml` for Ekman, Sverdrup, β-plane, Rossby, Coriolis, Kelvin, geostrophic.
- **Honesty badges.** Every exaggeration (vertical ×1000, deflection magnified, time compressed) in a fixed "not to
  scale" badge listed in the storyboard; decorative scenes say `physics_source: null` and "illustrative".
- **Agents miss layout errors** (Manimator, TheoremExplainAgent): the builder must read its own contact sheets and
  scene-boundary frames; the reviewer gets frames + short per-scene GIFs.
- **Accessibility.** No music by default; −16 LUFS; no autoplay; WCAG 2.3.1 (≤ 3 flashes/s); transcript under the video;
  colour-blind-safe palettes.
- **Budget.** ≤ 25 MB per movie (hard 40); H.264 High yuv420p + AAC, `+faststart`; render scratch on
  `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies`, deleted after QA (≤ 10 GB); media repo never force-pushed.
- **Public only after the user watches it** (`/approve-movie N slug`). Chapter 0: batch 1 (M0-1..M0-3) first, feedback,
  then batch 2.

## PoC record (PLANNING §12 step 11, PoC D — 20-s Coriolis test clip, R1 §4.4)

| Step | Result |
|---|---|
| storyboard validates | |
| V1 trajectory test | |
| TTS: clips + gaps = audio length ± 1 frame | |
| render wall time / frames per second | |
| file size | |
| GPU or SwiftShader | |
| movie_qa.py gates | |
| render-twice framemd5 comparison | |
| movie-reviewer verdict | |
| test page playback with captions | |
| user verdict (voice, speed, pace, captions) | |
