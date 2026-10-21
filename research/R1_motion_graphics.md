# R1 — Motion-graphics "movies" for the Vallis AOFD site: tools, stack, pipeline, agents

*Research note, 2026-10-20. Scope: per chapter, one or more 2–3-minute "movie-style" motion-graphics explainers (MP4/WebM +
poster + captions), made automatically by Claude Code agents on Windows 11 and published on GitHub Pages. Every claim
that comes from the web has its URL. Anything I could not confirm from a primary source is marked **(unverified)**.*

**Local machine check (done for this note):** `node v24.11.0`, `npm 11.6.3`, `winget v1.29` are installed. `ffmpeg`
is **not** on PATH. LaTeX (`latex`/MiKTeX) is **not** installed. `espeak-ng` is **not** installed. The fluidpy `.venv`
already has `playwright 1.62` and `imageio_ffmpeg 0.6` (which ships an ffmpeg binary). Node 24 is the current LTS
line, so Node does **not** need installing.

---

## 0. Recommendation in one paragraph

Use **one stack for the movies: Remotion (React, v4) + `@remotion/three` (three.js) + KaTeX for equations**, driven by
**physics data that Python precomputes from the tested `aofdpy` functions and exports to JSON**. Narration comes from
**Kokoro-82M** (local, Apache-2.0). Captions are written **from the script itself** (exact text) and timed from the
measured TTS clip durations, so no speech recognition is needed. The default has no music. Do **not** add Manim as a
second stack at the start. Manim is better only at morphing equations (`TransformMatchingTex`), and it needs MiKTeX,
a second render path and a second QA path. Keep it as an optional "derivation insert" tool, to adopt only if the
proof of concept shows that KaTeX-in-Remotion equation sequences look weak. Publish the MP4s from a **separate media
repository served by GitHub Pages**, not from the main site repo and not through Git LFS. Optionally mirror them to
YouTube by hand. Remotion is free for an individual or a non-profit
([remotion.dev/license](https://remotion.dev/license)), so Shammunul qualifies. **HyperFrames** (Apache-2.0, HTML-native)
is the fallback if the licence ever stops fitting.

---

## 1. How people (and Anthropic) use Claude to make motion graphics and explainer videos (2025–2026)

### 1.1 Remotion + Claude Code: the dominant pattern
- **Official Claude Code plugin from Remotion.** Install it with
  `claude plugin marketplace add remotion-dev/claude-code-plugin` and then `claude plugin install remotion@remotion`.
  It bundles the Remotion Agent Skills and adds `/remotion:remotion-create`.
  Docs: <https://remotion.dev/docs/ai/claude-code-plugin>. Source: <https://github.com/remotion-dev/claude-code-plugin>.
- **Remotion Agent Skills** (`npx skills add remotion-dev/skills`): `/remotion-best-practices`, `/remotion-create`,
  `/remotion-markup` (compositions, animation, layout, typography, audio, fonts, timing), `/remotion-studio`,
  `/remotion-render`, `/remotion-maps` (GeoJSON, MapLibre, CesiumJS 3-D flyovers, which suit global maps of winds and
  currents), `/remotion-captions`, `/remotion-docs` (fetches the current docs as Markdown), `/remotion-upgrade`,
  `/remotion-multimedia` (Mediabunny). <https://www.remotion.dev/docs/ai/skills>. Remotion also has a page on prompting
  coding agents: <https://www.remotion.dev/docs/ai/coding-agents>.
- **Community tutorials and examples:** Tella's guide
  (<https://www.tella.com/blog/how-to-use-remotion-agent-skills-with-claude-code>), OpenReplay's "Making videos with
  Claude Code + Remotion" (<https://blog.openreplay.com/making-videos-claude-code-remotion/>), MindStudio's piece on
  logo reveals and motion graphics
  (<https://mindstudio.ai/blog/remotion-claude-code-animated-logo-reveals-motion-graphics>), mer.vin's install notes
  (<https://mer.vin/2026/05/remotion-agent-skills-install-remotion-dev-skills-for-claude-code-and-cursor/>), and
  Remotion's prompt gallery, e.g. "Launch video on X", made with Claude Code + Opus
  (<https://www.remotion.dev/prompts/launch-video-on-x>). The repeated advice: give a **concrete brief** (duration,
  resolution, scene order, style rules). That is exactly what a storyboard file does.
- **The claim that "Anthropic's Claude Code team makes its launch videos with Remotion"** is repeated widely on X, but
  one write-up that tried to source it found no Anthropic case study
  (<https://www.mejba.me/blog/remotion-codex-motion-graphics-ai-video>). **(unverified)**

### 1.2 Anthropic's own product: "Claude Motion" (October 2026)
- Secondary coverage says Anthropic launched **Claude Motion** around 8 October 2026, together with Claude Dashboards.
  It turns reports and data into short animated videos that **Claude writes as code (no video-generation model)**,
  exportable as MP4, invoked with `/motion`, beta, Team/Enterprise only
  (<https://eesel.ai/blog/claude-motion>, <https://www.zemith.com/en/contents/claude-motion-graphics>,
  <https://ecosistemastartup.com/anthropic-lanza-claude-dashboards-y-motion-todo-lo-nuevo/>). **(unverified against
  anthropic.com; I could not fetch an official page.)**
- Relevance: it supports the design choice here, that **code-driven animation, not generative video**, is the honest
  route for physics. It is a claude.ai feature, though, not something Claude Code agents can call in a headless
  pipeline, and the plan tier is not confirmed. Do not depend on it.

### 1.3 Manim (3Blue1Brown style) + Claude
- **yusuke710/manim-skill** (<https://github.com/yusuke710/manim-skill>) is a Claude Code / Codex skill with a loop:
  narration lines → **local Kokoro TTS** → Manim code timed to the narration → render → mux into `video.mp4`. Subtitles
  are on by default. Visual review is **human** (timestamped notes in a viewer); the agent does not inspect its own
  frames. Its install notes are macOS-centric (cairo, MacTeX).
- **Nous Research's Hermes `manim-video` skill** and **affaan-m's `manim-video` skill (ECC)**, a 7-step thesis → scenes
  → outline → code → render → polish → handoff
  (<https://claudeskills.info/skills/affaan-m/ecc/manim-video/>,
  <https://claudeskills.info/ko/skills/nousresearch/hermes-agent/manim-video/>).
- **Research systems:** *Manimator* (paper/prompt → scene description → Manim code; <https://arxiv.org/html/2507.14306v1>)
  and *TheoremExplainAgent* (planner + coder agents making Manim videos of theorems; arXiv 2502.19400). Both report
  that the main failure is **visual layout errors that agents miss unless they look at frames**, which is why
  `movie-reviewer` is in the design below.
- **manim-voiceover** (<https://www.manim.community/plugin/manim-voiceover/>, v0.3.7). Its services are Azure,
  ElevenLabs, Coqui (offline), gTTS, OpenAI, pyttsx3 and a microphone recorder
  (<https://voiceover.manim.community/en/stable/services.html>). There is **no Kokoro/Piper service and no
  SRT/VTT export** in the documented list, so it would need a custom service class.

### 1.4 HTML-to-video built for agents: HyperFrames (HeyGen, open-sourced 2026)
- <https://github.com/heygen-com/hyperframes>: Apache-2.0, "Write HTML. Render video. Built for agents." It needs
  Node ≥ 22 and FFmpeg, and has `npx hyperframes init | preview | render` plus agent skills
  (`npx skills add heygen-com/hyperframes`). It has adapters for **GSAP, Lottie, Three.js, Anime.js, CSS, WAAPI**.
  About 68k stars.
- HeyGen's engineering write-up (<https://www.heygen.com/research/html-to-video>) is the best source on **determinism**.
  Each page exposes `window.__hf.seek(t)` ("the renderer never calls play()"). On Linux they use Chrome's
  `HeadlessExperimental.beginFrame` with `chrome-headless-shell --deterministic-mode --enable-begin-frame-control`. **On
  Windows and macOS they fall back to `Page.captureScreenshot` with heuristics**, which they call "not the most robust".
  For this Windows host, that is a real disadvantage compared with Remotion. Talk: <https://ai.engineer/talks/html-is-all-agents-need>.

### 1.5 Other code-to-video tools
- **Motion Canvas**: the original is **no longer maintained** and its site is offline. The community fork is
  **Canvas Commons** (<https://canvascommons.io/>), same API under `@canvas-commons/*`
  (<https://slama.dev/motion-canvas/1/>). It has excellent LaTeX and code animations but is editor-centric, and its
  future is uncertain.
- **Revideo** (<https://docs.re.video/>): a Motion Canvas fork with headless rendering. It came out of a YC company and
  its activity is uncertain **(unverified)**.
- **three.js captured to video yourself:** CCapture.js (<https://github.com/spite/ccapture.js>, old, browser-side),
  `puppeteer-capture` (deterministic `beginFrame`, works on Windows,
  <https://www.npmjs.com/package/puppeteer-capture>), Playwright screenshot per seeked frame + ffmpeg (Editframe's CLI
  path, <https://editframe.com/skills/composition/render-strategies>), React Three Fiber frame loop + Playwright
  (Lumafield, <https://barndoors.lumafield.com/rendering-ct-scan-animations-in-the-cloud/>), or WebCodecs
  `VideoEncoder` + a muxer such as Mediabunny (<https://mediabunny.dev>). All of these work, but you rebuild what
  Remotion already does (frame clock, audio mixing, encoding, preview studio).
- **GSAP**: now **100 % free, including commercial use and the former Club plugins**, since Webflow's 2025 change
  (<https://webflow.com/blog/gsap-becomes-free>). It is an animation *library*, not a renderer. It is usable inside
  HyperFrames, or inside Remotion if driven by `frame` (seek a paused timeline).
- **Theatre.js** (<https://www.theatrejs.com>): a keyframe editor for three.js. It is aimed at humans tweaking curves in
  a GUI, which gives agents nothing. Maintenance in 2025–26 is unclear **(unverified)**. Skip it.
- **Lottie** (<https://airbnb.io/lottie/>): a JSON vector-animation format, usually authored in After Effects. Not
  something agents write well. Use it only for small decorative icons, if at all.
- **matplotlib/ffmpeg (already in fluidpy)**: honest and tested, but it looks like a figure, not a movie. Keep it for
  notebook animations.

---

## 2. Comparison table

| Tool | Equations (LaTeX) | 3-D | Field / particle sims | Data maps | Determinism + headless CLI | Windows install needs | Render speed (indicative) | Licence | Output |
|---|---|---|---|---|---|---|---|---|---|
| **Remotion v4** (+`@remotion/three`) | KaTeX/MathJax as React components, no TeX install; morphing needs hand-made fades/highlights | **Yes**: React Three Fiber, `<ThreeCanvas>`; needs ANGLE GL (`Config.setChromiumOpenGlRenderer('angle')`) ([docs](https://www.remotion.dev/docs/three)) | Canvas2D / WebGL / SVG; pure function of `frame` or precomputed JSON | d3-geo, MapLibre, CesiumJS (`/remotion-maps`) | **Strong**: frame-indexed `useCurrentFrame()`, `npx remotion render` ([CLI](https://www.remotion.dev/docs/cli/render)), `delayRender` waits for data | Node LTS (present). Remotion downloads Chrome Headless Shell and ships its own ffmpeg in v4 (my understanding; verify in PoC) | Parallel (`--concurrency`); about 5–30 frames/s for 2-D, slower for heavy WebGL on CPU (SwiftShader) **(estimate)** | **Source-available**. Free for individuals, non-profits and for-profits with ≤ 3 employees; company licence otherwise ([licence](https://remotion.dev/license), [FAQ](https://www.remotion.dev/docs/license/faq), [pricing](https://www.remotion.dev/docs/pricing)); changes "slightly" in v5 ([LICENSE.md](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md)) | H.264/H.265/VP8/VP9/AV1/ProRes, `--crf` |
| **HyperFrames** | KaTeX in HTML | three.js adapter | Canvas/WebGL if clock adapted | any JS lib | Deterministic on **Linux only**; Windows uses a screenshot fallback ([HeyGen](https://www.heygen.com/research/html-to-video)) | Node ≥ 22, FFmpeg | similar to Remotion | **Apache-2.0** | MP4 |
| **Manim CE 0.22** | **Best**: real LaTeX, `TransformMatchingTex` morphs; or `manim[typst]` with no TeX | `ThreeDScene` (Cairo, slow and plain-looking); OpenGL renderer is experimental | Python: **can call `aofdpy` directly** | weak (no map projections) | Strong: `manim render -qh`, pure Python | uv/pip, MiKTeX (~1 GB) or Typst extra, ffmpeg via PyAV; MSVC build tools sometimes ([install](https://docs.manim.community/en/stable/installation/uv.html)) | Single-threaded per scene; 1080p60 is slow, 3-D slower | **MIT** | MP4/MOV/GIF/PNG |
| Canvas Commons / Revideo | good (LaTeX component) | limited | Canvas2D | weak | Revideo headless; Canvas Commons editor-first | Node | fast | MIT | MP4 |
| three.js + own capture (Playwright / puppeteer-capture / WebCodecs) | KaTeX overlay | **Yes** (native) | Yes | Yes | Only if you write the frame clock; `beginFrame` needed for exactness | Node or Python Playwright (present), ffmpeg | depends | MIT | anything |
| GSAP / Theatre.js / Lottie | n/a (libraries) | via three.js | — | — | need a renderer around them | npm | — | GSAP free standard licence; Theatre.js Apache-2.0/AGPL parts; Lottie MIT | — |
| matplotlib + imageio-ffmpeg (existing) | mathtext | mplot3d (weak) | Yes, tested | cartopy | Yes | present | moderate | BSD/PSF | MP4/GIF |

**Licence note for Shammunul.** Remotion's free tier explicitly covers "an individual, whether for personal or commercial
use" and "a non-profit or not-for-profit organization" ([FAQ](https://www.remotion.dev/docs/license/faq)). A personal
PhD teaching site is the individual case. Even if it were treated as a university (normally non-profit) project, it
stays free. The FAQ has **no explicit student or university clause** and invites email to `hi@remotion.dev` for
confirmation, which costs one email and is worth sending. Remotion is *not* OSI open source. Readers who fork the
public repo fall under the same licence, and most of them will also be individuals. The v5 licence change is the one
thing to watch, and the hedge is the HyperFrames fallback.

**Output size (2–3 min).** Flat-colour motion graphics compress extremely well: H.264 1080p30 at CRF 23–28 is roughly
**8–25 MB per 3 min**. Dense particle fields, noisy textures or film grain can push this to 50–100 MB. A size budget and
a "no full-screen noise" style rule are needed **(estimate; measure in PoC)**.

---

## 3. Narration and captions

### 3.1 TTS options (free and local first)
| Option | Quality | Local? | Licence / terms | Windows notes | Timing info |
|---|---|---|---|---|---|
| **Kokoro-82M** (`pip install kokoro soundfile`) ([GitHub](https://github.com/hexgrad/kokoro), [PyPI](https://pypi.org/project/kokoro/), [HF](https://huggingface.co/hexgrad/Kokoro-82M)) | **Very good** for its size; natural English voices | Yes, CPU is fine | **Apache-2.0** weights | Pulls PyTorch (large). `espeak-ng` MSI needed only for out-of-dictionary fallback. Lighter route: `kokoro-onnx` (<https://github.com/thewh1teagle/kokoro-onnx>) | per-segment durations (generate one clip per sentence) |
| **Piper** (`pip install piper-tts`) ([OHF-Voice/piper1-gpl](https://github.com/OHF-Voice/piper1-gpl)) | good, a bit flatter | Yes, very fast | Engine moved to **GPL-3.0** in 2025 (old rhasspy repo archived); **each voice has its own licence**, check MODEL_CARD | ONNX, no torch | per sentence |
| **edge-tts** (`pip install edge-tts`) ([GitHub](https://github.com/rany2/edge-tts)) | excellent neural voices | **No**, calls Microsoft Edge's online read-aloud service | Unofficial use of a Microsoft endpoint; terms grey, could break | trivial | `SubMaker` → **SRT** from word/sentence boundaries (VTT dropped in v7) |
| **Windows SAPI** (`System.Speech` via PowerShell, or `pyttsx3`) | robotic | Yes, zero install | OS licence | built in | none useful |
| Coqui XTTS / ElevenLabs / OpenAI / Azure | high | mixed | XTTS non-commercial (CPML); others paid/API key | — | — |

**Choice: Kokoro** as the default (local, deterministic, Apache-2.0, good quality, and already proven in
`manim-skill`). **Piper** is the light fallback. **No cloud TTS** in the automatic pipeline. Pin one voice (e.g.
`af_heart` or a British voice) and a speed in a project config, so every chapter sounds the same.

### 3.2 Captions: write them, don't transcribe them
- The director writes the exact narration text, so **captions come from the script**. TTS is run **per sentence**, each
  clip's duration is measured (`soundfile`), the clips are concatenated with fixed gaps, and WebVTT/SRT cues are
  written from those cumulative times. Timing is exact to the sample, with no Whisper errors on words like "geostrophic"
  or "Rossby".
- Optional word-level timing (karaoke-style highlighting): forced alignment with whisper.cpp
  (`@remotion/install-whisper-cpp`, used by Remotion's captions docs, <https://www.remotion.dev/docs/captions/>). Not
  needed by default.
- Formats: **WebVTT** for the web `<track kind="captions" srclang="en" default>` (<https://www.w3.org/TR/webvtt1/>),
  plus **SRT** for YouTube and download. Do **not** burn captions into the frames. Keep them as a separate track, so they
  stay accessible, searchable and translatable, and the frames stay clean.
- Caption QA rules (house style, borrowed from broadcast practice): ≤ 2 lines, ≤ 42 characters per line, ≤ 17
  characters per second, cue duration 1–7 s, maths spoken in words ("f equals two Omega sine phi"), and the on-screen
  equation carries the symbols.

### 3.3 Music and accessibility defaults
- **No music by default.** It is distracting for maths, causes licensing trouble, and competes with the narration. An
  optional very quiet bed can be added later from a CC0 source, with a licence record.
- Loudness normalised to about **−16 LUFS integrated** (`ffmpeg -af loudnorm`).
- **No autoplay with sound.** Show the poster and play on click. Respect `prefers-reduced-motion` (show the poster plus
  transcript first).
- **WCAG 2.3.1 "three flashes or below"** (<https://www.w3.org/WAI/WCAG21/Understanding/three-flashes-or-below-threshold.html>):
  no full-screen flashes, which matters for the instability "blow-up" scenes.
- Colour-blind-safe palettes (cividis/viridis-like for fields; never red/green alone for highs and lows).
- A full **text transcript** on the page under the video, which also serves SEO and offline reading.
- The narration describes what is moving ("the parcel drifts to the right of its path"), so the movie mostly works for
  low-vision users, with no separate audio-description track.

---

## 4. Recommended stack and install

### 4.1 Why one stack (Remotion) and not Manim + Remotion
1. **3-D GFD scenes are the core of this book** (rotating sphere, Coriolis, Rossby waves on the β-plane, baroclinic
   eddies, Hadley cell, gyres, Southern Ocean overturning). three.js through `@remotion/three` does these well, while
   Manim's 3-D is slow and looks plain.
2. **Maps.** `/remotion-maps` + d3-geo/MapLibre give projected globes and ocean basins. Manim has none.
3. **Reuse of the site's JS.** The explainers are vanilla JS + three.js with physics mirrors that already have parity
   rows. The same ES modules can be imported into Remotion scenes, so the physics code is not written a third time.
4. **Equations.** KaTeX renders every equation the site already shows. A "derivation strip" (one line at a time,
   colour-highlighted changed terms, cross-fades) covers ~90 % of what a 2–3-minute *overview* movie needs. Full
   step-by-step derivations already live in the notebook and the Derivation tabs. The movies are for intuition.
5. **Windows determinism.** Remotion renders by frame index through its own Chrome Headless Shell, which works on
   Windows. HyperFrames' fully deterministic path is Linux-only.
6. **One toolchain** means one render command, one QA script and one caption path, which makes agents more reliable
   and leaves fewer moving parts.
7. **Node 24 is already installed.** Manim would add MiKTeX (~1 GB), possibly MSVC build tools, and a second Python
   environment.

**When to add Manim:** only if the proof of concept shows that a specific segment type, "watch this equation morph
term-by-term", is clearly better in Manim. Then render such inserts with Manim CE (use `manim[typst]` to avoid MiKTeX
if Typst output is good enough) as separate clips and composite them in Remotion with `<OffthreadVideo>`. Treat that
as a later add-on, not part of the start-up.

### 4.2 Physics honesty: where the numbers come from
- **Heavy or complex physics** (QG two-layer eddies, Stommel/Munk gyres, Ekman spirals, Rossby dispersion,
  trajectories) is computed **in Python by the tested `aofdpy` functions**. A script
  `movies/data/build_chNN_<slug>.py` writes `movies/chNN/<slug>/data/*.json` (or `.bin` Float32 for big fields) plus a
  `manifest.json` (function name, book §/equation, parameters, git SHA, hash). Remotion loads it with `staticFile()` and
  only **interpolates** in time. The movie's physics is then exactly the tested physics, with no mirror to drift.
- **Light, analytic physics** (inertial circle, f = 2Ω sin φ, a dispersion relation) may be a pure JS function of
  `frame`. It must then be the *same* ES module as the explainer's mirror, with its `selftest()` parity rows, run by the
  QA tool.
- Remotion rules for determinism: everything is a function of `useCurrentFrame()`. Never use `requestAnimationFrame` or
  R3F `useFrame`. Use `random(seed)` instead of `Math.random`. Wait for data with `delayRender/continueRender`. Use
  fonts that are bundled locally.
- **Exaggeration labels.** Any visual exaggeration (vertical scale × 1000, deflection magnified, time compressed
  10⁵ ×) is drawn on screen in a small fixed "not to scale" badge. The storyboard has to list each one, and the reviewer
  checks for them.

### 4.3 Exact Windows install commands (for the setup session)
Run from a normal PowerShell or Git Bash in the Vallis repo root. Replace `.venv` with the Vallis project's venv.

```powershell
# 0. Already present: Node v24 LTS, npm 11, winget. If Node were missing:
#    winget install --id OpenJS.NodeJS.LTS -e

# 1. ffmpeg on PATH (for ffprobe-based QA, loudnorm, frame extraction; Remotion has its own copy)
winget install --id Gyan.FFmpeg -e
#    (open a new terminal afterwards; check with: ffprobe -version)

# 2. Remotion project inside the repo (non-interactive; versions pinned by package-lock.json)
mkdir movies; cd movies
npm init -y
npm i remotion@4 @remotion/cli@4 @remotion/three@4 @remotion/media-utils@4 @remotion/captions@4 `
      react@19 react-dom@19 three @react-three/fiber katex d3-geo
npm i -D typescript @types/react @types/three @types/d3-geo
npx remotion browser ensure          # downloads Chrome Headless Shell once
cd ..

# 3. Remotion's Claude Code plugin / skills (gives agents current, correct Remotion API knowledge)
claude plugin marketplace add remotion-dev/claude-code-plugin
claude plugin install remotion@remotion
#    alternative: npx skills add remotion-dev/skills

# 4. Local TTS (Kokoro) in the project venv
.venv/Scripts/python.exe -m pip install "kokoro>=0.9.4" soundfile numpy
#    optional fallback for unknown words: install espeak-ng from its MSI
#    https://github.com/espeak-ng/espeak-ng/releases   (or: winget search espeak)
#    lighter, torch-free alternative: .venv/Scripts/python.exe -m pip install kokoro-onnx soundfile

# 5. (Optional, only if Manim inserts are adopted later — separate venv recommended)
#    py -3.12 -m venv .venv-manim ; .venv-manim/Scripts/python.exe -m pip install "manim[typst]"
#    or full LaTeX: winget install --id MiKTeX.MiKTeX -e
```

Version pins (React 18 vs 19, exact Remotion 4.0.x) should follow whatever `/remotion-best-practices` and
`npx remotion versions` report on the day. All `@remotion/*` packages must share **one exact version**.

### 4.4 Proof of concept: a 20-second clip ("Coriolis: straight in space, curved on the turntable")
The goal is to prove every link of the chain once, on this Windows machine, before any chapter work.

| # | Step | Pass criterion |
|---|---|---|
| 1 | `movies/poc/storyboard.yaml`: 3 scenes (0–6 s turntable from above, inertial frame; 6–13 s same throw seen in rotating frame, curved path; 13–20 s KaTeX line for the Coriolis acceleration $-2\boldsymbol{\Omega}\times\mathbf{u}$ with its Vallis equation number taken from the page image, plus a 3-D globe showing f = 2Ω sin φ). Two narration sentences per scene | YAML validates against the schema |
| 2 | `poc_data.py`: analytic trajectory (inertial straight line; rotating-frame coordinates rotated by −Ωt) → `traj.json` + manifest | V1 test: radius and time of flight match analytic values |
| 3 | `tts.py`: Kokoro, one WAV per sentence → `narration.wav` + `captions.vtt` + `captions.srt` + `timing.json` | sum of clip durations + gaps = audio length ± 1 frame |
| 4 | Remotion composition 1920×1080, 30 fps, 600 frames; 2-D SVG scene, `<ThreeCanvas>` globe with `gl: angle`, KaTeX overlay, `<Audio>` | `npx remotion render PocCoriolis out/poc.mp4 --codec h264 --crf 23` exits 0 |
| 5 | `movie_qa.py out/poc.mp4` | duration 20.0 ± 0.1 s; size ≤ 4 MB; no black/frozen segments; captions inside the audio; loudness about −16 LUFS; contact sheet PNG written |
| 6 | Render twice and compare per-frame hashes (ffmpeg `framemd5`) | identical, or differences only in WebGL anti-aliasing (record which) |
| 7 | A fresh `movie-reviewer` agent views the contact sheet + 6 full frames | no clipped text, equation legible at 640 px wide, "not to scale" badge present |
| 8 | Embed in a test HTML page with `<video controls preload="metadata" poster>` + `<track>`, opened with Playwright | plays, captions show, no console errors |

Record: render wall time, frames per second, file size, and whether WebGL used the GPU or SwiftShader. These numbers
set the per-movie budgets.

---

## 5. Pipeline design

```
book pages (images) ─▶ movie-director ─▶ storyboard.yaml + script.md
                                        │
             aofdpy (tested) ──▶ build_data.py ──▶ data/*.json + manifest (hashes, §, eq)
                                        │
                     tts.py (Kokoro) ──▶ narration.wav + captions.vtt/.srt + timing.json
                                        │
                         motion-builder ─▶ src/chNN/<Slug>.tsx  ─▶ npx remotion render
                                        │
                                  movie_qa.py (automatic gates) ─▶ qa.json + contact sheets
                                        │
                                 movie-reviewer (fresh eyes) ─▶ reports/chNN_movies.md
                                        │
                                 publish_movie.py ─▶ media repo (Pages) + site page embed
```

### 5.1 Storyboard (the contract)
`movies/chNN/<slug>/storyboard.yaml`. The director writes it; the builder and reviewer both work from it.
```yaml
id: ch02_coriolis
title: "Why winds turn right: the Coriolis effect"
concepts: [C03, C04, C07]          # curation IDs this movie serves
target_duration_s: 150             # 120–180
fps: 30
size: [1920, 1080]
style: house-dark-v1               # palette, fonts, badge style
scenes:
  - id: s1_hook
    t: [0, 12]
    visual: "Hurricane satellite-style swirl (procedural, not a real image) → freeze → question text"
    voiceover: "Every big storm in the northern hemisphere spins the same way. Why?"
    on_screen_eq: null
    physics_source: null           # decorative scenes must say so
    exaggeration: ["procedural cloud field, illustrative only"]
  - id: s3_turntable
    t: [30, 62]
    visual: "Top view of rotating table; ball path in inertial vs rotating frame, split screen"
    voiceover: "..."
    on_screen_eq: {latex: "\\frac{D\\mathbf{u}}{Dt} + 2\\boldsymbol\\Omega\\times\\mathbf{u} = ...", vallis_eq: "(N.M)", page_png: "chapters/pages/..."}
    physics_source: {fn: "aofdpy.ch02_rotating.inertial_trajectory", params: {Omega: 0.5, u0: 1.0}, test: "tests/test_ch02.py::test_inertial_circle"}
    exaggeration: ["table rotation 0.5 rad/s, not Earth's 7.29e-5 rad/s"]
honesty_notes: ["Coriolis is an apparent force in the rotating frame; we say so in s3"]
quiz_hook: "Which way does the ball curve in the southern hemisphere?"
```
Rules: every scene has narration (an empty narration needs a reason). Every on-screen equation carries LaTeX **and** its
Vallis number, transcribed from the page image (the same rule as the notebooks). Every non-decorative visual names a
tested `physics_source`. Total narration ≤ about 150 words per minute (≈ 2.5 words/s), leaving visual breathing room.

### 5.2 Build and render
- Scene code: `movies/src/chNN/<Slug>.tsx` with one `<Sequence>` per storyboard scene. Durations come from
  `timing.json` (the narration drives the timing, and visuals stretch to fit), so audio and picture cannot drift.
- Shared house components (written once, reused by every chapter): `TitleCard`, `EqLine` (KaTeX + term highlight),
  `DerivationStrip`, `ScaleBadge`, `Globe` (three.js sphere + graticule + lat/lon arrows), `BetaPlane`, `ParticleField`
  (instanced points advected along precomputed paths), `MapPanel` (d3-geo), `LowerThird`, `EndCard` (link to the
  notebook and explainer).
- Render: `npx remotion render <Id> out/<slug>.mp4 --codec h264 --crf 23 --concurrency 50% --props props.json`. Props go
  through a **file**, because inline JSON breaks in Windows shells
  ([CLI docs](https://www.remotion.dev/docs/cli/render)). Then `ffmpeg -movflags +faststart` (and loudnorm, if not
  done in TTS). Poster: `npx remotion still <Id> poster.jpg --frame=<chosen>`.
- Optional second encode: AV1 WebM for about 30–50 % smaller files on modern browsers, with H.264 MP4 as a `<source>`
  fallback. Default: **H.264 MP4 only** (universal, one file).

### 5.3 Automatic QA (`tools/movie_qa.py`, Python, uses ffprobe/ffmpeg)
| Gate | How | Fails when |
|---|---|---|
| Duration | `ffprobe` | outside 120–180 s, or > ±3 % from the storyboard |
| Size | file stat | > budget (default 25 MB at 1080p for 3 min; hard cap 40 MB) |
| Codec/compat | ffprobe | not H.264 High/yuv420p/AAC, or no `faststart` |
| Black/frozen | `blackdetect`, `freezedetect` filters | black > 0.5 s outside fades; frozen > 4 s without narration on a static slide |
| Loudness | `ebur128` | outside −18…−14 LUFS; true peak > −1 dBTP |
| Flashes | luminance delta per frame from sampled frames | > 3 large flashes per second (WCAG 2.3.1) |
| Captions | parse VTT | cues out of order or outside audio, > 42 chars/line, > 17 cps, text ≠ script text |
| Physics parity | re-run `manifest.json` functions, compare hashes; run JS `selftest()` rows (as the explainers do now) | mismatch |
| Equations | grep composition for every `on_screen_eq.latex` in the storyboard; KaTeX render check (no `katex-error`) | missing or erroring equation |
| Frames for review | `ffmpeg -vf fps=1/5,scale=480:-1,tile=6x5` contact sheets + full-size frames at every scene midpoint and boundary | — (output for the reviewer) |

### 5.4 Publishing: where the MP4 lives
Facts: GitHub Pages sites are capped at **1 GB published**, source repos are **recommended ≤ 1 GB**, bandwidth is a
**100 GB/month soft limit**, and builds time out after 10 min
(<https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits>). Git blocks files over
100 MB (<https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github>).

Budget: about 20 chapters × 1–3 movies × ~20 MB = 0.4–1.2 GB, **plus every re-render kept in git history**. That does
not fit in the main site repo alongside notebooks and explainers.

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| Commit MP4s in the main site repo | simplest | blows the 1 GB budget; history bloat; slow clones | **No** |
| Git LFS | keeps repo small | LFS has a small free storage/bandwidth quota; classic Pages branch builds serve the pointer file unless built by an Actions workflow with `lfs: true` **(behaviour not confirmed from GitHub docs)**; every view counts against LFS bandwidth | **No** |
| **Separate media repo** (`<project>-media`) on GitHub Pages, `chNN/<slug>/{1080.mp4, poster.jpg, en.vtt, en.srt, transcript.md}` | its own 1 GB quota; correct MIME types and HTTP range requests (seeking works); fully automatic (`git push` by the orchestrator); same tooling | still capped at 1 GB; history grows with re-renders (mitigate: re-render rarely, keep 720p if needed, start `-media2` when > 800 MB; **no force-push**) | **Recommended default** |
| GitHub Release assets (≤ 2 GiB per file) | not counted in repo size; good archive | served as downloads (`application/octet-stream`, redirect); `<video>` playback and seeking in Safari not guaranteed **(test in PoC)** | Use as **archive / download link**, not as the player source |
| YouTube (unlisted → public), embedded via `youtube-nocookie.com` | adaptive streaming, unlimited bandwidth, phone-friendly, upload SRT | needs Shammunul's account and an OAuth upload (an outward-facing action); tracking and ads; not fully automatic | **Optional mirror**, done by hand by the user |

On the site page: `<video controls preload="metadata" playsinline poster="…">` with `<source>` pointing at the media-repo
Pages URL, a `<track kind="captions" srclang="en" label="English" default>`, the transcript below, and links "Download
MP4 (release)" and "Watch on YouTube" if mirrored. Posters and VTT are tiny and can live in the main repo too.

**Public-repo rule (as for fluidpy):** movies must contain **no book scans, figure crops or quoted text**. Every visual is
generated by our code, equations are typeset by us with their numbers, and narration is in our own words.
`check_public.py` should be extended to scan `storyboard.yaml`/`script.md`/VTT for long verbatim book passages.

---

## 6. Proposed agents

| Agent | Inputs | Outputs | Tools | Key rules |
|---|---|---|---|---|
| **`movie-director`** (storyboard) | curation + design docs for chapter N (CORE IDs, derivations), `knowledge/CUMULATIVE.md`, `notation.md`, rendered equation page images, existing explainers list, house style guide, `movies/MOVIES_BUDGET.md` | `movies/chNN/<slug>/storyboard.yaml`, `script.md` (narration with spoken-maths), `movies/chNN/plan.md` (which 1–3 movies cover which concept groups, and why motion beats the explainer here) | Read, Grep, Glob, Bash (render pages), Write | 120–180 s; hook in the first 10 s; one idea per scene; every equation with LaTeX + number from the page image; every non-decorative visual names a tested function; exaggerations listed; ends by pointing to the notebook and explainer; own words only |
| **`motion-builder`** (scene code + render), one per movie, run in parallel (each writes its own folder) | storyboard, `aofdpy` functions, shared house components, explainer JS mirrors | `movies/data/build_chNN_<slug>.py` → data JSON + manifest; `tts.py` outputs; `movies/src/chNN/<Slug>.tsx`; `out/chNN/<slug>.mp4`, `poster.jpg`, VTT/SRT; `reports/movies/chNN/<slug>/qa.json` | Read, Write, Edit, Bash | must run `movie_qa.py` until all gates pass; must **look at its own frames** (Read the PNG contact sheets) before handing back; ≤ 3 fix loops, then report; never edits shared components (orchestrator or knowledge-keeper promote them) |
| **`movie-reviewer`** (fresh eyes, read-only) | MP4 (via frames only), contact sheets, scene-boundary frames, storyboard, script, VTT, qa.json, book page images for the equations | `reports/chNN_movies.md`: per movie PASS / FIX with timestamped findings (e.g. "01:42 label overlaps globe; 02:05 eq sign differs from (N.M) page") | Read, Grep, Glob, Bash (frame extraction only), Write (report only) | checks physics honesty (direction of deflection, hemisphere sign, westward Rossby phase speed, gyre western intensification), equation fidelity, legibility at 640 px, pacing vs narration, caption accuracy, colour-blind safety, no flashes, "not to scale" badges; never edits the movie |

Orchestration: add a phase **"movie"** after explainers and notebook (it needs the CORE list and can reuse the explainer
components), in parallel with knowledge capture. Commit message: `chNN: movies — <n> movies, <total MB>, QA PASS`.
Publishing is part of `site-publisher` (or a small `publish_movie.py`), and the push to the media repo is done by the
orchestrator.

**Candidate movies for Vallis** (concept groups, not yet tied to chapter numbers): Coriolis and the rotating frame;
geostrophic and hydrostatic balance (thermal wind); inertia-gravity waves and geostrophic adjustment; Rossby waves on
the β-plane (westward phase propagation, group velocity); baroclinic instability (two-layer Eady/Phillips growth, eddy
heat flux); the Hadley cell and angular momentum; Ekman layers and pumping; wind-driven gyres (Sverdrup, Stommel/Munk
western intensification); the Southern Ocean overturning (residual circulation, eddy compensation); stratification and
the thermocline.

---

## 7. Risks and honest limits

1. **Physics can look right and be wrong.** A catchy swirl can show the wrong hemisphere sign or an eastward Rossby
   wave. Mitigations: physics comes only from tested functions or parity-checked mirrors; the storyboard lists the
   source per scene; the reviewer has a physics checklist. Agents still miss things, so Shammunul should watch each
   movie once before it goes public.
2. **Agents are weak at visual layout.** Text overlaps, clipped labels and unreadable equations are the most common
   failures reported for automated Manim/Remotion pipelines (Manimator, TheoremExplainAgent; `manim-skill` relies on
   human review). Frame-based review catches most of them but not motion problems such as jitter or pacing. Contact
   sheets at 1 frame per 5 s can miss a 1-second glitch. Add scene-boundary frames and a short GIF per scene for the
   reviewer.
3. **WebGL in headless Chrome on Windows.** It may fall back to CPU (SwiftShader): slow, and sometimes visually
   different. Use `gl: angle`, keep particle counts moderate, and measure in the PoC. Frame hashes may differ between
   machines because of anti-aliasing, so the determinism check is "same within tolerance", not bit-identical.
4. **Render time.** A 3-min 1080p30 movie is 5,400 frames. Expect minutes to tens of minutes per movie on a laptop
   **(estimate)**, and agents must wait for it (no placeholders). Use `--frames` to render only a changed scene while
   iterating.
5. **Licence drift.** Remotion is source-available with a licence change announced for v5. Pin v4 and email
   `hi@remotion.dev` to confirm the educational/individual use. HyperFrames (Apache-2.0) is the fallback. Scene logic
   kept in plain TS/JS modules (data loading, physics, layout maths) eases a port.
6. **TTS quality and pronunciation.** Kokoro mispronounces some jargon ("Ekman", "Sverdrup", "β-plane") and symbols.
   Keep a project pronunciation lexicon (respellings or phonemes) and have the reviewer listen to a sample, or at least
   read the script. edge-tts sounds better but is an online, unofficial endpoint: not for the automatic default.
7. **"Movie-style catchy" vs. honest.** Cinematic camera moves, glow and particles can imply precision that isn't there.
   House rule: decoration is allowed only when the storyboard labels it "illustrative", and the scale badge appears on
   every exaggerated scene.
8. **Storage creep.** Re-renders bloat the media repo history. Re-render only on content change, cap the total, and
   accept starting a second media repo later. Never force-push.
9. **Equation morphing.** KaTeX in Remotion does not give 3Blue1Brown-style glyph morphs out of the box. If that style
   is wanted, the Manim insert path (§4.1) is the escape hatch, at the cost of a second toolchain.
10. **Claims I could not verify:** Anthropic's own use of Remotion; official details of Claude Motion; Theatre.js and
    Revideo maintenance; GitHub Pages + LFS behaviour; whether Release assets play inline in every browser; Remotion
    bundling ffmpeg on Windows. Each is either avoided by the design or tested in the PoC.
