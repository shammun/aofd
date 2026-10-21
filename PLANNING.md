# PLANNING — `aofd`: Vallis, *Atmospheric and Oceanic Fluid Dynamics* (2nd ed., 2017), learned through Python, 3-D explainers and short movies

*Master design document, written 2026-10-20, for a fresh Claude Code session started in
`C:\Users\sislam27\Work\Climate Dynamics PHD\AOFD Vallis`. It is the spec for building the project. Details already worked
out in the four research notes are cited, not repeated: **R1** `research/R1_motion_graphics.md` (movies), **R2**
`research/R2_threejs_3d.md` (three.js), **R3** `research/R3_open_data_and_figures.md` + **R3b**
`research/R3b_figure_catalogue.md` (open data, the 360-figure census), **R4** `research/R4_primers_and_map_reading.md`
(Chapter 0, reading cards, mechanism cards, skill additions).*

**Name correction applied throughout.** R1–R3 write `aofdpy.*`, `aofd.chNN_*.rossby_omega` or `aofd/data/` for the
physics and the data layer. That is superseded: **all reusable physics and data access go into `fluidpy`** (the shared
library, §2.4, §11); the AOFD repo holds only book-specific glue (`aofd/`). Read every `aofdpy.X`/`aofd.X` in R1–R3 as
`fluidpy.geo.X`, `fluidpy.data.X` or `fluidpy.diag.X`.

---

## 0. Executive summary

We repeat for Vallis what fluidpy did for Kundu — one learning package per chapter (executed notebook, Colab twin,
HTML page, interactive explainers), built by a multi-agent `/do-chapter N` pipeline with tested physics — and add five
things the Kundu project did not have:

1. **A Chapter 0 "Start here"** in three parts (0A maths incl. all of Kundu Appendix B, 0B climate/GFD basics,
   0C reading climate figures), informal blog-like voice, 3-D explainers, standalone 3-D scenes and up to six movies,
   so that a reader with no climate background can start (§9.1, §15, R4).
2. **Cross-book continuity**: every idea Kundu already taught is *re-taught in full* where Vallis first uses it (same
   depth as the Kundu site), with links to the exact Kundu notebook section, explainer and derivation, and with Kundu's
   derivations and `fluidpy` functions reused rather than rewritten.
3. **Python for essentially every equation**, written *from scratch* line by line with novice comments, next to the
   `fluidpy` call, with an assertion that they agree. Kundu's notebooks coded the A items; here every computable
   numbered equation gets a from-scratch cell (B items included).
4. **Honest 3-D and motion**: three.js 3-D views inside the *same* explainer app (the Kundu format, unchanged) wherever
   the third dimension helps — in every chapter, not only flagship scenes (R2) — and 2–3-minute narrated
   motion-graphics movies per chapter or per group of ideas, rendered locally with Remotion (R1).
5. **Real data**: the book's 60 observational figures (and 8 GCM figures, by analogue) rebuilt by our own code from open
   data (NOAA PSL, ERA5, WOA23, MIMOC, ECCO …), each with a "how to read this figure" card; pseudo-data only when nothing
   open exists, and then stamped as such (R3, R4 §3).

`fluidpy` stays the **single, growing library** (repo `shammun/fluidpy`, which also keeps the Kundu site). It gains
`fluidpy.geo`, `fluidpy.data`, `fluidpy.diag` now and `fluidpy.ml` later, is installed *editable* into the AOFD venv
from `../Fluid Dynamics`, and is pinned by git tag on Colab. The AOFD book lives in its own public repo **`shammun/aofd`**
(site `https://shammun.github.io/aofd`), movies in **`shammun/aofd-media`**. `/do-chapter N` runs everything through
`git push` and site integration after `check_public`; only the one-time repo creation, data accounts and watching each
movie before it goes public are left to the user.

### What's new vs fluidpy

| Area | fluidpy (Kundu) | aofd (Vallis) | Status |
|---|---|---|---|
| Book | 16 ch., 919 pp., pdf = printed + 27 | 22 ch. in 4 parts + **Ch. 0**, 966 pp., pdf = printed + 20 | changed |
| Repos | one repo = library + site | `shammun/aofd` (site + glue) · `shammun/fluidpy` (library, tagged) · `shammun/aofd-media` (MP4) | new |
| Physics location | `fluidpy/chNN_*.py`, `fluidpy/core/` | reusable → `fluidpy.geo/.data/.diag`; book glue → `aofd/chNN_*.py` | changed |
| Explainers | 5–10 / chapter | **5–14** / chapter (Ch. 0: 14); identical Kundu format + optional three.js view | changed |
| 3-D scenes | none | standalone full-window three.js scenes `scenes/chNN/` (0–4 per chapter, Ch. 0 up to 6), §15.1 | new |
| Disk | not managed | disk guard: 40 GB floor, 25 GB raw-data cap, LRU eviction of re-downloadable raw data, §15.2 | new |
| 3-D | `Viz.three` (three.js r128) in 3 of ~136 explainers | `assets/viz3d.js` (three.js 0.186.1, ES modules via import map), lazy, disposable, audited; `Viz.proj3` fallback | new |
| Movies | none (matplotlib MP4 animations only) | 1–3 movies of 2–3 min per chapter (Remotion + Kokoro TTS), async `/make-movies N` | new |
| Data figures | analytic / synthetic, few datasets | 60 observational + 8 GCM-analogue figures from open data; `data/registry.yaml`; derived products committed | new |
| Code | CORE items coded | **every computable equation**: from-scratch + library call + `assert` | changed |
| Prior knowledge | RECAP of earlier chapters | **K-recap**: full re-teaching of Kundu material + deep links into the Kundu site | new |
| Reader | fluid-mechanics learner | + no climate background: mechanism cards, reading cards, symbol atlas, glossary | new |
| Agents | 12 | 23 (12 adapted + 11 new) | changed |
| Skills | 17 | 26 (17 adapted/copied + 9 new) | changed |
| Hooks | git pre-push only | Claude Code PreToolUse/PostToolUse/SessionStart + git pre-commit/pre-push | new |
| Push | orchestrator pushes; first push by user | same, plus fluidpy tag push and media-repo push; movies need user approval | changed |

---

## 1. Goals, non-goals, audience

**Goals**
1. Exhaustive coverage of every Vallis section; tiered depth (A full treatment, B stated, C named — `book.yaml → policy`);
   every A-item derivation written out one move per step; nothing used unexplained (concept, symbol, maths tool, Python
   function, *climate term*).
2. Same four deliverables per chapter as fluidpy, same formats, same quality bar, same audits.
3. Continuity with Kundu: re-teach, link, reuse.
4. A library (`fluidpy`) that outlives the book: GFD physics, data access, diagnostics, later ML.
5. Honest visuals: every moving or coloured thing traces to a tested function or a cited dataset; exaggerations
   labelled; pseudo-data stamped.
6. Fully automated chapter runs, resumable, with gates; outward-facing first steps by the user.

**Non-goals**
- Reproducing book text, figures, tables or exercises (public repo; rule 9 of fluidpy carries over unchanged).
- Running full GCMs. Complex-model figures get a reanalysis analogue or a reduced model, labelled (R3 §0).
- Exercise solutions; bibliography reproduction.
- Generative-video or AI-image content. Movies are code-rendered from tested physics (R1 §1.2, §4.2).
- Rewriting the Kundu site. The AOFD session may *read* it and may change only `fluidpy/` library code and its tests.

**Audience**
- Shammunul (PhD, climate dynamics) working through Vallis.
- A reader with first-year calculus and no climate background: everything climate-specific (cyclonic, reanalysis,
  isopycnal, Sverdrup, anomaly, …) is defined on first use from `knowledge/glossary.yaml`, mechanisms get a one-screen
  🌍 card (R4 §4), every data figure a 🗺️ reading card (R4 §3).
- A Kundu-site reader moving on: K-recap blocks link back to what they already studied.
- Later: ML-for-climate readers reusing `fluidpy` models as data generators.

---

## 2. Repos, folders, environments

### 2.1 Folders on disk (siblings under `Climate Dynamics PHD/`)

| Folder | Git repo | Role |
|---|---|---|
| `Fluid Dynamics/` | `shammun/fluidpy` (exists) | library `fluidpy` + the finished Kundu site. AOFD work changes only `fluidpy/`, `tests/`, `pyproject.toml`, `CHANGELOG.md` |
| `AOFD Vallis/` | `shammun/aofd` (new, public) | this project: site, notebooks, explainers, glue package `aofd`, agents, tools |
| `AOFD Media/` | `shammun/aofd-media` (new, public, Pages) | rendered MP4 + poster + VTT/SRT + transcript per movie (R1 §5.4) |
| later `<Book 3>/` | `shammun/<book3>` | next book, built from the book-kit (§14) |

### 2.2 AOFD repo tree (mirrors fluidpy; ✱ = new vs fluidpy)

```
AOFD Vallis/
├─ CLAUDE.md  GUIDE.md  PLANNING.md  README.md  LICENSE (MIT, as fluidpy)  DATA_CREDITS.md (generated) ✱
├─ book.yaml  progress.json
├─ pyproject.toml ✱          # package "aofd" (glue), depends on fluidpy[geo,data]
├─ requirements.txt          # Colab-light: only what Colab lacks (pint, cartopy, gsw, cmocean, pooch, xarray-extras…)
├─ requirements-dev.txt ✱    # local: test, notebook, audit, PDF tools
├─ requirements-data.txt ✱   # local data stack (R3 §4.1)
├─ .claude/ settings.json · agents/ (23) · skills/ (26)
├─ .githooks/ pre-commit ✱ · pre-push
├─ aofd/ ✱                   # book glue only: chNN_<slug>.py (parameter sets, notebook helpers, figure wrappers)
├─ analysis/  chNN.md · chNN_curation.md · chNN_design.md · chNN_kundu.md ✱ · chNN_figures.md ✱
├─ research/  R1–R4 (+R3b) · chNN_scout.md ✱
├─ notebooks/ build_chNN.py · chNN_<slug>.ipynb · chNN_<slug>_colab.ipynb · chNN_<slug>.html
├─ viz/       index.html (gallery) · atlas.html ✱ (symbol atlas) · chNN/<slug>.html
│             chNN/scenes/<slug>.scene.js ✱ (3-D scene source, inlined into the explainer) · data/*.bin ✱ (≤ 2 MB each)
├─ figs/ ✱    chNN/fig_NN_MM.py (one per reproduced figure) · chNN/*.yaml (our schematic polylines, e.g. so_currents.yaml)
├─ data/ ✱    registry.yaml · derived/chNN/fig_NN_MM*.nc|.npz (≤ 10 MB each, ≤ 150 MB total) · pseudo/README.md
├─ movies/ ✱  package.json · package-lock.json · remotion.config.ts · tsconfig.json · lexicon.yaml (pronunciations)
│             MOVIES_BUDGET.md · src/house/*.tsx (TitleCard, EqLine, DerivationStrip, ScaleBadge, Globe, BetaPlane,
│             ParticleField, MapPanel, LowerThird, EndCard) · src/chNN/<Slug>.tsx
│             chNN/plan.md · chNN/<slug>/{storyboard.yaml, script.md, manifest.json, data/*.json, timing.json}
│             data/build_chNN_<slug>.py · out/ (ignored)
├─ tests/     test_chNN.py · test_figs_chNN.py ✱ · test_machinery.py · book_values_chNN.json (ignored)
├─ reference/chNN/           # cited benchmark data (small, licensed)
├─ reports/   chNN_{verification,review,code,viz,lesson,figures,movies,kundu}.md · data/<key>.md ✱
│             viz/** (ignored) · movies/** (ignored frames/contact sheets)
├─ knowledge/ CUMULATIVE.md · concept_map.md · notation.md · primers.md · viz_patterns.md · chNN.md
│             symbols.yaml ✱ · glossary.yaml ✱ · kundu_index.yaml ✱ (generated) · data_patterns.md ✱ · movie_patterns.md ✱
├─ assets/    viz_lib.js · viz_base.css (forked from fluidpy @ d379326) · viz3d.js ✱ · viz3d.css ✱
│             luts.json ✱ (cmocean/viridis 256-entry LUTs) · coast110.json ✱ (Natural Earth 110 m, int16) · aofd-site.css
├─ templates/ viz_template.html · viz_example{,_field,_3d}.html (copied) · viz_example_globe.html ✱ ·
│             viz_example_gpgpu.html ✱ · viz_example_vector_glyph.html ✱ · viz_example_figure_reader.html ✱
├─ tools/     (§2.5)
├─ index.html · movies.html ✱ · data.html ✱
├─ chapters/  (ignored: chNN.pdf, chNN.txt, pages/)
├─ _private/  (ignored: figure_refs/geo_*.png from the user, compare/ side-by-sides, book crops)
└─ outputs/   (ignored: figures, executed notebooks, self-test pages)
```

### 2.3 Media repo

```
AOFD Media/   (shammun/aofd-media, GitHub Pages on main /)
  index.html (plain list) · chNN/<slug>/{1080.mp4, poster.jpg, en.vtt, en.srt, transcript.md, manifest.json}
```
Posters and VTT are also copied into the site repo (tiny). Budget: ≤ 25 MB per movie (hard 40), start `aofd-media2`
above 800 MB; never force-push (R1 §5.4).

### 2.4 Changes to fluidpy (done in `../Fluid Dynamics`, committed there separately)

| Change | Why |
|---|---|
| Add `pyproject.toml` (setuptools; name `fluidpy`; version from `fluidpy/__init__.__version__`, now 0.2.0 → **0.3.0**) | fluidpy is not pip-installable today (no pyproject/setup) |
| Extras: `[geo]` xarray; `[data]` pooch, requests, netCDF4, h5netcdf, zarr, fsspec, gcsfs, cdsapi, earthaccess, gsw, cartopy, cmocean, metpy; `[diag]` scikit-image; later `[ml-torch]`, `[ml-jax]` | keep the Kundu install light |
| New subpackages `fluidpy/geo/`, `fluidpy/data/`, `fluidpy/diag/` (layout §11.1) | reusable Vallis physics, data access, diagnostics |
| `fluidpy/core/gfd.py`, `rotating.py`, `shallow_water.py`, `stratification.py`, `vertical_modes.py`, `thermo.py`, `waves.py` **stay where they are** (Kundu notebooks import them). `fluidpy.geo.*` imports from them (one implementation); new Vallis-specific functions live in `geo` | no Kundu regression; reuse before re-implementing |
| `tests/geo/`, `tests/data/`, `tests/diag/` | evidence for library functions |
| `CHANGELOG.md`, git tags `v0.3.0`, `v0.3.1`, … | Colab pins a tag |
| Release check `tools/release_check.py`: full fluidpy pytest (Kundu chapters included) + execute two Kundu notebooks (ch04, ch13) headless | the Kundu site must keep working |

What the existing core already covers (checked): `gfd.py` (2 237 lines: f, β, f-/β-plane, geostrophy, thermal wind,
Taylor–Proudman, the Ekman family incl. pumping and Sverdrup transport, shallow-water/Poincaré/Kelvin dispersion,
geostrophic adjustment, inertia–gravity waves, Rossby ω/c_p/c_g, PV, Rayleigh–Kuo, Eady growth/modes/fluxes, 2-D cascade,
Rhines length), `rotating.py` (frame acceleration terms, centrifugal potential, effective gravity, projectile paths),
`shallow_water.py` (C-grid SW solver, PV, energy, particles, linear QG evolve), `stratification.py` (N², parcel ODEs,
lapse-rate conventions, θ), `vertical_modes.py` (modes, WKB), `thermo.py` (perfect-gas thermodynamics, sound speed),
`waves.py` (dispersion helpers). Vallis Chs 1–9 can therefore reuse a large part — the crossref-linker records it.

### 2.5 Tools (copied from fluidpy, then changed; ✱ new)

| Tool | Change |
|---|---|
| `split_pdf.py`, `render_pages.py`, `detect_chapters.py` | offset +20; Ch. 0 has no split (reads notation pages 19–20 only) |
| `nbkit.py` | + `nb.kundu_recap`, `nb.scratch_vs_lib`, `nb.mechanism`, `nb.reading_card`, `nb.anatomy`, `nb.magnitude_table`, `nb.movie`, `nb.figure` (calls `figs/…`) |
| `coverage_check.py` | + equation-code coverage, K-recap links valid, undefined TeX symbol (atlas), data figure without reading card, "clockwise" without hemisphere, `(K n.m)` vs `(n.m)` numbering |
| `viz_lint.py` | max 14; `viz:3d` meta rules; jet/rainbow ban unless `viz:badexample`; provenance chip present on data layers |
| `shot.py` | + `--3d` (GL flags `--use-angle=swiftshader --enable-unsafe-swiftshader`, `?audit=1`, `viz3d:ready`, non-blank canvas, real drags/wheel, forced context loss/restore), page audit counts live WebGL contexts (R2 §5) |
| `viz_inline.py` | inlines `viz3d.js/css` + writes the import map for `viz:3d` explainers; inlines `scenes/<slug>.scene.js` |
| `new_viz.py` | `--3d` scaffold from `viz_example_globe.html` |
| `publish_notebook.py` | Colab setup cell installs pinned fluidpy tag; movie block; data-credit footer; reading-card styling |
| `build_site.py` | parts I–IV + Ch. 0 on index; `movies.html`; `data.html`; `viz/atlas.html` from `symbols.yaml` |
| `check_public.py` | + `_private/` and `figure_refs` references; scan storyboard/script/VTT; registry `redistributable: no` products not staged; origin must be `shammun/aofd` |
| `embed_check.py`, `run_notebook.py`, `progress.py`, `eq_refs.py`, `convergence.py`, `benchmarks.py`, `compare_fields.py`, `pipeline_selftest.py`, `build_guide_docx.py` | copied, paths/limits updated |
| ✱ `kundu_index.py` | builds `knowledge/kundu_index.yaml` from the fluidpy repo: concept_map rows (IDs, D-rows with step counts), notebook section anchors (from the published `.html` `<h2 id>`), explainer metas (`viz:*`), fluidpy function names; URLs on `shammun.github.io/fluidpy` |
| ✱ `crossref_check.py` | every K-recap link resolves (local file + anchor), every Kundu equation cited exists |
| ✱ `data_registry.py` | validate `data/registry.yaml`, write `DATA_CREDITS.md`, check licence flags of committed products |
| ✱ `make_luts.py`, `make_coast.py` | cmocean/viridis LUT JSON; Natural Earth 110 m coast as int16 (R2 §8.5) |
| ✱ `fig_check.py` | runs a figure script, checks numbers/orientation, writes private side-by-side into `_private/compare/` |
| ✱ `tts.py`, `movie_qa.py`, `publish_movie.py` | R1 §3.2, §5.3, §5.4 |
| ✱ `size_budget.py` | page ≤ 15 MB, explainer ≤ 600 KB, derived ≤ 10 MB/150 MB, any file < 50 MB, repo < 800 MB warning |
| ✱ `sync_fluidpy.py` | pin in `book.yaml` = an existing pushed tag that contains every function the chapter imports |
| ✱ `hooks/guard_bash.py`, `hooks/guard_write.py`, `hooks/post_write.py` | §7 |

### 2.6 .gitignore essentials

```
.venv/  .venv-*/  __pycache__/  *.pyc  .pytest_cache/  .ipynb_checkpoints/  *.log  ~$*
*.pdf  *.zip  *.docx
chapters/*            !chapters/_page_map.json
_private/
outputs/  reports/viz/  reports/movies/
tests/book_values_*.json
*.nc  *.npz  *.zarr/  !data/derived/**/*.nc  !data/derived/**/*.npz
data/raw/  data/cache/
movies/node_modules/  movies/out/  movies/**/audio/
.env  *.netrc  .cdsapirc
```

### 2.7 Python environment (Windows; Python 3.12 to match Colab)

```powershell
cd "C:\Users\sislam27\Work\Climate Dynamics PHD\AOFD Vallis"
py -3.12 -m venv .venv
.venv\Scripts\python.exe -m pip install -U pip wheel
# fluidpy, editable, from the sibling repo (after its pyproject.toml exists, §12 step 3)
.venv\Scripts\python.exe -m pip install -e "..\Fluid Dynamics[geo,data,diag]"
.venv\Scripts\python.exe -m pip install -e .                      # the aofd glue package
.venv\Scripts\python.exe -m pip install -r requirements-dev.txt -r requirements-data.txt
.venv\Scripts\python.exe -m ipykernel install --user --name aofd-venv --display-name "aofd (venv)"
.venv\Scripts\python.exe -m playwright install chromium            # fallback; audits use installed Edge/Chrome
```
`requirements-dev.txt`: as fluidpy's `requirements.txt` (numpy, scipy, sympy, matplotlib, pandas, pint, pyyaml, plotly,
ipywidgets, imageio-ffmpeg, pytest, pytest-xdist, jupyter, nbformat, nbconvert, nbclient, pypdf, pymupdf, playwright,
python-docx) + pyflakes. `requirements-data.txt` (R3 §4.1): xarray, dask[array], netCDF4, h5netcdf, zarr, fsspec, gcsfs,
aiohttp, pooch, requests, cdsapi, earthaccess, copernicusmarine (optional), gsw, ecco_v4_py, xgcm, neutralocean, metpy,
cartopy, shapely, pyproj, pyshp, cmocean, scikit-image, easyclimate (optional), climlab (optional). Windows-fragile
packages (`windspharm`, `dedalus`) are not installed; fall back to our own solvers or Colab/WSL (R3 §6.4).

**Movie toolchain** (R1 §4.3, verbatim commands there):
```powershell
winget install --id Gyan.FFmpeg -e                                  # then open a new terminal; ffprobe -version
cd movies; npm init -y
npm i remotion@4 @remotion/cli@4 @remotion/three@4 @remotion/media-utils@4 @remotion/captions@4 react@19 react-dom@19 three @react-three/fiber katex d3-geo
npm i -D typescript @types/react @types/three @types/d3-geo
npx remotion browser ensure; cd ..
claude plugin marketplace add remotion-dev/claude-code-plugin       # user runs these two (interactive)
claude plugin install remotion@remotion
py -3.12 -m venv .venv-tts
.venv-tts\Scripts\python.exe -m pip install "kokoro>=0.9.4" soundfile numpy   # torch stays out of the main venv
```
All `@remotion/*` share one exact version (pin from `npx remotion versions` on the day). Node v24.11.0 is present;
ffmpeg is not (checked). Optional later: `espeak-ng` MSI; Manim only if the PoC shows KaTeX equation sequences are weak
(R1 §4.1).

---

## 3. `book.yaml` draft

Outline read with pymupdf: 966 PDF pages; the page labels give **pdf = printed + 20** (PDF 21 is printed page 1, Part I).
Part dividers occupy PDF 21–22, 233–234, 529–530, 749–750. Notation pages: PDF 19–20. References 929–955, index 956–966.

```yaml
project:
  package: aofd                      # glue package in this repo
  library: fluidpy                   # shared physics/data library (sibling repo)
  library_path: "../Fluid Dynamics"
  library_repo: shammun/fluidpy
  library_pin: v0.3.0                # tag Colab installs; sync_fluidpy.py keeps it honest
  repo: shammun/aofd
  branch: main
  site_url: https://shammun.github.io/aofd
  media_repo: shammun/aofd-media
  media_url: https://shammun.github.io/aofd-media
  kundu_site: https://shammun.github.io/fluidpy
  site_title: "Atmospheric and Oceanic Fluid Dynamics (Vallis, 2nd ed.) — worked in Python, with 3-D explainers and movies"
  author: "Shammunul Islam"
  min_explainers_per_chapter: 5
  max_explainers_per_chapter: 14
  max_parallel_viz: 3                # browser audits are heavy
  max_parallel_agents: 6
  movies_per_chapter: [1, 3]
  movie_seconds: [120, 180]
  page_budget_mb: 15
  three_version: "0.186.1"
  tts: {engine: kokoro, voice: af_bella, speed: 1.0}   # chosen by the user 2026-10-20

policy:
  tier_a_full_treatment: [12, 18]    # hard max 18; K-recaps are not counted (they re-teach, they are not new)
  coverage: exhaustive
  equation_code: all_computable      # every computable numbered equation: from-scratch + fluidpy + assert
  kundu_recap: full_first_use        # first Vallis use = full re-teaching + links; later uses = short recap

book:
  title: "Atmospheric and Oceanic Fluid Dynamics: Fundamentals and Large-Scale Circulation"
  edition: "2nd"
  authors: ["Geoffrey K. Vallis"]
  publisher: "Cambridge University Press"
  year: 2017
  pdf: auto
  pdf_pages: 966
  printed_offset: 20
  notation_pdf_pages: [19, 20]
  parts:
    - {n: I,   title: "Fundamentals of Geophysical Fluid Dynamics", chapters: [1, 5]}
    - {n: II,  title: "Waves, Instabilities and Turbulence",        chapters: [6, 13]}
    - {n: III, title: "Large-Scale Atmospheric Circulation",        chapters: [14, 18]}
    - {n: IV,  title: "Large-Scale Oceanic Circulation",            chapters: [19, 22]}
```

Chapters (`pdf_start–pdf_end`, printed = pdf − 20; sections from the outline, our title case; each chapter's appendices
belong to it). Seeds are **priors for the curator, not decisions**; `[3D]` = a three.js view is expected to help,
`[data]` = uses a reproduced data figure, `[K…]` = re-skin/extend a Kundu explainer.

| id | Title · slug | PDF (printed) | Sections |
|---|---|---|---|
| ch00 | Maths and map-reading toolkit · `toolkit` | notation 19–20 (not a book chapter) | 0.1–0.22 as R4 §2.1 |
| ch01 | Equations of Motion · `equations_of_motion` | 23–74 (3–54) | 1.1 Time derivatives for fluids · 1.2 Mass continuity · 1.3 Momentum equation · 1.4 Equation of state · 1.5 Thermodynamic relations · 1.6 Thermodynamic equations for fluids · 1.7 Thermodynamics of seawater · 1.8 Sound waves · 1.9 Compressible and incompressible flow · 1.10 Energy budget · 1.11 Nondimensionalization and scaling · App. A ideal gas from the Gibbs function · App. B first law for fluids |
| ch02 | Effects of Rotation and Stratification · `rotation_stratification` | 75–124 (55–104) | 2.1 Rotating frame · 2.2 Spherical coordinates · 2.3 Tangent plane · 2.4 Boussinesq · 2.5 Anelastic · 2.6 Pressure and other vertical coordinates · 2.7 Scaling for hydrostatic balance · 2.8 Geostrophic and thermal wind balance · 2.9 Gradient wind · 2.10 Static instability, parcel method · App. A asymptotic Boussinesq |
| ch03 | Shallow Water Systems · `shallow_water` | 125–162 (105–142) | 3.1 Single layer · 3.2 Reduced gravity · 3.3 Multi-layer · 3.4 Continuous stratification to SW · 3.5 Geostrophic balance, thermal wind · 3.6 Form stress · 3.7 Conservation properties · 3.8 SW waves · 3.9 Geostrophic adjustment · 3.10 Isentropic coordinates · 3.11 Available potential energy |
| ch04 | Vorticity and Potential Vorticity · `vorticity_pv` | 163–190 (143–170) | 4.1 Vorticity and circulation · 4.2 Vorticity equation · 4.3 Circulation theorems · 4.4 Rotating frame · 4.5 PV conservation · 4.6 SW PV · 4.7 PV in approximate stratified models · 4.8 Impermeability of isentropes |
| ch05 | Geostrophic Theory · `geostrophic_theory` | 191–232 (171–212) | 5.1 Geostrophic scaling · 5.2 Planetary-geostrophic equations · 5.3 SW quasi-geostrophy · 5.4 Stratified QG · 5.5 QG and Ertel PV · 5.6 QG energetics · 5.7 Ekman layer |
| ch06 | Wave Fundamentals · `wave_fundamentals` | 235–270 (215–250) | 6.1 Fundamentals · 6.2 Group velocity · 6.3 Ray theory · 6.4 Rossby waves · 6.5 Stratified QG Rossby waves · 6.6 Energy propagation and reflection · 6.7 Group velocity revisited · 6.8 Poincaré energy propagation · App. A WKB |
| ch07 | Gravity Waves · `gravity_waves` | 271–316 (251–296) | 7.1 Surface waves · 7.2 Interfacial SW waves · 7.3 Internal waves · 7.4 Reflection · 7.5 Varying stratification · 7.6 Rotating frame · 7.7 Topographic generation · 7.8 Acoustic–gravity waves |
| ch08 | Linear Dynamics at Low Latitudes · `low_latitudes` | 317–354 (297–334) | 8.1 Rossby and gravity waves together · 8.2 Equatorial β-plane waves · 8.3 Rays and equatorial trapping · 8.4 Forced–dissipative flow · 8.5 Matsuno–Gill · App. A parabolic cylinder functions · App. B Matsuno–Gill relations |
| ch09 | Barotropic and Baroclinic Instability · `instability` | 355–398 (335–378) | 9.1 Kelvin–Helmholtz · 9.2 Parallel shear flow · 9.3 Necessary conditions · 9.4 Baroclinic instability · 9.5 Eady · 9.6 Two-layer · 9.7 Kinematic view · 9.8 Energetics · 9.9 β, shear and stratification (continuous) |
| ch10 | Waves, Mean Flows and their Interaction · `wave_mean_flow` | 399–432 (379–412) | 10.1 QG wave–mean-flow · 10.2 Eliassen–Palm flux · 10.3 TEM · 10.4 Non-acceleration · 10.5 Eddies in the Eady problem · 10.6–10.7 Necessary conditions (pseudomomentum, pseudoenergy) |
| ch11 | Basics of Incompressible Turbulence · `turbulence_basics` | 433–464 (413–444) | 11.1 The problem · 11.2 Kolmogorov · 11.3 2-D turbulence · 11.4 Predictability · 11.5 Passive tracer spectra |
| ch12 | Geostrophic Turbulence and Baroclinic Eddies · `geostrophic_turbulence` | 465–492 (445–472) | 12.1 Differential rotation · 12.2 Stratified geostrophic turbulence · 12.3 Scaling theory · 12.4 Baroclinic eddy phenomenology |
| ch13 | Turbulent Diffusion and Eddy Transport · `eddy_transport` | 493–528 (473–508) | 13.1 Diffusive transport · 13.2 Turbulent diffusion · 13.3 Two-particle diffusivity · 13.4 Mixing length · 13.5 Homogenization · 13.6 Diffusive and skew fluxes · 13.7 Eddy diffusion in atmosphere and ocean · 13.8 Thickness and PV diffusion |
| ch14 | The Overturning Circulation: Hadley and Ferrel Cells · `hadley_ferrel` | 531–558 (511–538) | 14.1 Basic features · 14.2 Steady Hadley model · 14.3 SW Hadley model · 14.4 Asymmetry about the equator · 14.5 Eddy effects · 14.6 Non-local eddy effects · 14.7 Ferrel cell |
| ch15 | Zonally Averaged Mid-Latitude Circulation · `midlatitude_circulation` | 559–604 (539–584) | 15.1 Surface westerlies, barotropic jet · 15.2 Layered models · 15.3 Eddy fluxes, a closed model · 15.4 Stratified model and the real atmosphere · 15.5 Tropopause height · 15.6 Stratification and tropopause model · App. A TEM in spherical PE |
| ch16 | Planetary Waves and Zonal Asymmetries · `planetary_waves` | 605–646 (585–626) | 16.1 Slowly varying medium · 16.2 Horizontal propagation · 16.3 Critical lines and layers · 16.4 WKB wave–mean-flow · 16.5 Vertical propagation · 16.6 In shear · 16.7 Forced stationary waves · 16.8 Thermal forcing · 16.9 Ray theory |
| ch17 | The Stratosphere · `stratosphere` | 647–692 (627–672) | 17.1 Overview · 17.2 Waves · 17.3 Momentum transport and deposition · 17.4–17.5 Residual circulation · 17.6 QBO · 17.7 Variability, extratropical wave–mean flow |
| ch18 | Water Vapour and the Tropical Atmosphere · `moist_tropics` | 693–748 (673–728) | 18.1 Moist ideal gas · 18.2 Relative humidity · 18.3 Convection · 18.4 Moist convection · 18.5 Radiative equilibrium · 18.6 RCE · 18.7 Vertically constrained equations · 18.8–18.9 Tropical scaling and balance · 18.10 Convectively coupled waves, MJO · App. A–C |
| ch19 | Wind-Driven Gyres · `wind_driven_gyres` | 751–780 (731–760) | 19.1 Depth-integrated circulation · 19.2 Viscosity instead of drag · 19.3 Zonal boundary layers · 19.4 Nonlinear problem · 19.5 Inertial solutions · 19.6 Topographic effects |
| ch20 | Structure of the Upper Ocean · `upper_ocean` | 781–820 (761–800) | 20.1 Vertical structure · 20.2 Continuous stratification model · 20.3 PV observations · 20.4 Main thermocline · 20.5 Thermocline scaling · 20.6 Internal thermocline · 20.7 Ventilated thermocline · App. A layered relations |
| ch21 | The MOC and the Antarctic Circumpolar Current · `moc_acc` | 821–880 (801–860) | 21.1 Sideways convection · 21.2 Its maintenance · 21.3 Box models · 21.4 Lab abyssal model · 21.5 Abyssal flow model · 21.6 Deep wind-driven overturning · 21.7 ACC · 21.8 Residual overturning model · 21.9 Interhemispheric model |
| ch22 | Equatorial Circulation and El Niño · `equatorial_enso` | 881–928 (861–908) | 22.1–22.2 Preliminaries · 22.3 Local undercurrent model · 22.4 Ideal-fluid undercurrent · 22.5 ENSO intro · 22.6 Walker circulation · 22.7 Oceanic response · 22.8 Coupled instability · 22.9 Conceptual models · 22.10 SW numerical solutions · App. A delayed oscillator |

**Explainer seeds** (priors; 3-D marked) and **movie seeds** (M = one 2–3-min movie):

| ch | Explainer seeds | Movie seeds |
|---|---|---|
| 00 | the 14 of R4 §2.2 with 3-D upgrades (§9.1) | M1 vectors, dot and cross in 3-D · M2 grad, div, curl and flux · M3 how to read a climate map |
| 01 | material vs local derivative on a weather balloon [K ch03]; mass budget box → continuity [3D cube]; seawater density in T–S space (gsw) [data-free]; potential temperature and θ-surfaces [3D]; sound waves and the incompressible limit; energy budget term bars; scaling machine (Ro, Fr, aspect ratio) | M1 what the fluid equations say, term by term |
| 02 | Coriolis on a spinning globe, inertial vs Earth frame [3D, K ch04 `rotating_frame_coriolis`]; effective gravity and the oblate Earth [3D]; spherical unit vectors and metric terms [3D]; f- and β-plane tangent plane [3D]; Boussinesq vs anelastic switch; pressure as vertical coordinate [3D slab]; geostrophic balance [K ch13]; thermal wind with sloping isotherms [3D, K ch13]; gradient wind cyclone/anticyclone; parcel method and N² [K ch01] | M1 Coriolis: straight in space, curved on Earth · M2 geostrophy and thermal wind |
| 03 | SW layer and reduced gravity [3D layers]; multi-layer stack; geostrophic adjustment with/without rotation [K ch13]; Poincaré/Kelvin waves [3D surface]; Margules front; isentropic coordinates; APE as flattening isentropes [3D] | M1 geostrophic adjustment |
| 04 | circulation and Kelvin's theorem [K ch05]; stretching and tilting [3D]; baroclinic generation (solenoids) [3D]; Ertel PV as spin × stratification [3D sheets]; SW PV column; PV impermeability | M1 potential vorticity, the skater and the layer |
| 05 | scale-analysis bars → QG; planetary-geostrophic vs QG regimes; PV inversion (ψ from q) [3D]; two-layer QG; Ekman spiral and pumping [3D, K ch13 `ekman_spiral`]; QG energetics | M1 balance: from the full equations to QG · M2 Ekman layers and pumping |
| 06 | phase vs group velocity [K ch07]; ray tracing; Rossby mechanism (β, one column) [3D β-plane]; Rossby dispersion and reflection [K ch13 `rossby_waves`]; vertical structure of stratified Rossby waves [3D] | M1 Rossby waves |
| 07 | internal wave cones and St Andrew's cross [3D, K ch07]; reflection off slopes; WKB wave guide [data: WOA23 N(z)]; inertia–gravity waves; lee waves over a ridge [3D]; acoustic–gravity | M1 internal waves |
| 08 | equatorial waves (Kelvin, Yanai, ER, IG) on the β-plane [3D]; dispersion diagram reader; equatorial trapping rays; Matsuno–Gill response [3D] | M1 equatorial waves and Matsuno–Gill |
| 09 | Kelvin–Helmholtz; Rayleigh–Kuo/Fjørtoft; shear-layer roll-up (pseudo-spectral); Eady growth and mode structure [3D, K ch13]; two-layer Phillips; kinematic view (wedge of instability) [3D]; Charney eigenproblem; rotating annulus regimes [3D tank] | M1 baroclinic instability: how weather is born |
| 10 | EP flux arrows; TEM vs Eulerian streamfunction; non-acceleration; Eady eddy-induced mean flow | M1 waves push the mean flow |
| 11 | Kolmogorov cascade; 2-D dual cascade (pseudo-spectral); Lorenz predictability [3D, K ch11]; tracer spectra | — (or merged with 12) |
| 12 | β-plane turbulence → zonal jets; Rhines scale; two-layer baroclinic turbulence lifecycle; deformation-radius map [data] | M1 turbulence on a rotating planet makes jets |
| 13 | random walk → diffusivity; drifter dispersion [data]; mixing length; homogenization; skew vs diffusive flux; GM eddy-induced circulation [3D isopycnals] | M1 eddies as mixers |
| 14 | angular-momentum ring [3D]; Held–Hou model; asymmetric Hadley cell; eddy-driven Ferrel cell; observed overturning [data, 3D globe wedge] | M1 the Hadley cell |
| 15 | stirred barotropic jet; layered models; EP flux and residual circulation in data [data]; tropopause height | M1 why westerlies at the surface |
| 16 | Rossby rays on the sphere [3D globe]; critical lines; Charney–Drazin vertical propagation; Charney–Eliassen stationary waves [data: ETOPO 45°N]; thermal forcing response | M1 planetary waves and mountains |
| 17 | Brewer–Dobson residual circulation [3D]; downward control; QBO 1-D model and data [data]; polar-vortex split (PV isosurfaces) [3D, data]; SSW composite with EP arrows [3D, data] | M1 QBO · M2 the polar vortex and SSWs |
| 18 | Clausius–Clapeyron; advection–condensation RH; moist adiabat and CAPE; radiative–convective equilibrium; Wheeler–Kiladis spectrum reader [data]; MJO composite [data] | M1 water vapour and the tropics |
| 19 | Sverdrup interior; Stommel/Munk western intensification [3D basin + tracers]; observed-wind North Atlantic gyre [data]; inertial (Fofonoff) gyres; topographic steering (f/h) [3D] | M1 wind-driven gyres |
| 20 | Ekman pumping into the thermocline [3D]; PV on isopycnals [data, 3D layer stack]; thermocline scaling; ventilated thermocline layers and shadow zone [3D] | M1 the ventilated thermocline |
| 21 | sideways convection; Stommel two-box with flow-direction glyphs (cf. Fig. 21.6) [3D tanks + dot/cross glyphs]; Stommel–Arons abyss [3D sector]; Southern-Ocean residual overturning and where water comes from/goes to (cf. Fig. 21.30) [3D streamtubes]; ACC and fronts map [data]; global MOC residual vs Eulerian [data] | M1 the overturning circulation · M2 the Southern Ocean |
| 22 | equatorial undercurrent; Walker circulation; thermocline tilt and Bjerknes feedback [3D slab, data]; Kelvin/Rossby wave response to wind bursts [3D]; delayed and recharge oscillators; ENSO data [data] | M1 El Niño |

---

## 4. Agents

Rules carried over: each agent has a fresh context and a self-contained brief; agents never commit; **no two agents
running at the same time write the same folder**; every brief ends with "do not return while a run is in progress;
report real numbers". Tools: R = Read, W = Write, E = Edit, G = Grep/Glob, B = Bash, Web = WebSearch/WebFetch.

| # | Agent | Phase | Origin | Inputs | Outputs (only writer of) | Tools | Justification |
|---|---|---|---|---|---|---|---|
| 1 | `concept-analyst` | 1 | adapted | chapter text, rendered pages, knowledge, `kundu_index.yaml`, R3b rows | `analysis/chNN.md`, `tests/book_values_chNN.json` | R W G B Web | + marks each item NEW / SEEN-Vallis / **SEEN-Kundu (with Kundu id)**; lists every figure with its R3b type; lists climate terms for the glossary |
| 2 | `research-scout` | 1 ∥ | **new** | chapter blurb, sections, R1–R4 | `research/chNN_scout.md` | R W G Web | finds open lecture notes, classic papers, standard misconceptions, published benchmark numbers with citations, lab movies (Weather in a Tank) and data sources — the analyst stays focused on the book |
| 3 | `concept-curator` | 2 | adapted | analysis, scout, kundu_index, seeds, policy | `analysis/chNN_curation.md` | R W G B Web | + **K tier** (K-recap ids `K01…`), equation-code plan, 5–14 explainers + backup each with a **3-D decision** (yes/no + why), figure list (R3b type, dataset key), movie groups, mechanism and reading cards |
| 4 | `crossref-linker` | 2b | **new** | curation K/R rows, `kundu_index.yaml`, Kundu `analysis/*_design.md` Part F | `analysis/chNN_kundu.md` | R W G B | exact Kundu URLs (section anchor, explainer, derivation id + step count), notation crosswalk (Kundu ↔ Vallis symbols, sign conventions), which Kundu derivation text and which `fluidpy` function to reuse — requirement 3 needs a dedicated, checkable map |
| 5 | `lesson-designer` | 3 ∥ | adapted | curation, kundu map | `analysis/chNN_design.md` | R W G B | + Part G **equation-code table** (eq → scratch spec → library fn → assert), K-recap storyboards, mechanism/reading cards, **3-D scene specs** (layers, presets, exaggeration, provenance, parity), figure captions brief |
| 6 | `concept-implementer` | 4 ∥ | adapted | analysis, curation, pages, design Part C | `../Fluid Dynamics/fluidpy/geo/**`, `…/fluidpy/diag/**`, `aofd/`, `scripts/` | R W E G B Web | physics goes into the library; book glue into `aofd/`; never `fluidpy/data/`; never edits `fluidpy/core/` signatures |
| 7 | `data-scout` | 4b ∥ | **new** | figure list, R3/R3b, registry | `../Fluid Dynamics/fluidpy/data/**`, `data/registry.yaml`, `data/derived/chNN/`, `reports/data/` | R W E G B Web | finds/checks licence/downloads/reduces/registers (R3 §5.1); separate from the implementer so data outages never block physics |
| 8 | `math-verifier` | 5 | adapted | code, tiers, design C/F/G | `tests/test_chNN.py`, `reference/chNN/`, `../Fluid Dynamics/tests/{geo,diag,data}/`, `reports/chNN_verification.md` | R W E G B Web | + library tests in the fluidpy repo; sympy re-derivation of ★★/★★★ |
| 9 | `derivation-reviewer` | 6 ∥ | copied (+K checks) | code vs page images | reply only (orchestrator writes `reports/chNN_review.md`) | R G B | fresh-eyes physics review; also checks reused Kundu functions are used in their stated regime and sign convention |
| 10 | `code-reviewer` | 6 ∥ and 8b | **new** | library diff (pass 1); executed notebook's scratch cells (pass 2) | reply only (pass 1) / `reports/chNN_code.md` (pass 2) | R G B | requirement 4 is about *code people read*: novice comments, one idea per line, names match symbols, no hidden library call inside "from scratch", asserts meaningful (tolerance justified), library API consistent, docstring contract; the derivation-reviewer judges physics, not pedagogy of code |
| 11 | `viz-builder` | 7 (×n) | adapted | storyboard, kundu exemplars, fluidpy fn | `viz/chNN/<slug>.html` (one file) | R W E G B | unchanged Kundu explainer format; for a 3-D explainer it builds the app with a placeholder 3-D view + `Viz.proj3` fallback |
| 12 | `viz3d-builder` | 7 ∥ (×m) | **new** | 3-D scene spec, `assets/viz3d.js`, fluidpy fn | `viz/chNN/scenes/<slug>.scene.js`, `reports/viz/chNN/<slug>/3d/` | R W E G B | scene module from Viz3D layers only, parity rows (CPU↔Py, GPU↔CPU, drawing invariants), perf note (R2 §8.3) |
| 13 | `viz-integrator` | 7 (after 11+12) | **new** | explainer file + scene | `viz/chNN/<slug>.html` (same file, after builder) | R W E G B | wires scene into `Viz.app` views/state/transport/tour/Explain/Code; runs `shot.py --3d`, context-loss and page context-count audit (R2 §8.3) |
| 14 | `viz-reviewer` | 7 gate | adapted | all explainers + screenshots | `reports/chNN_viz.md` | R W G B | + R2 §8.4 3-D checklist; compares against the named Kundu exemplar |
| 15 | `figure-reproducer` | 7b ∥ (×k) | **new** | derived products, R3 recipe, private crop | `figs/chNN/fig_NN_MM.py`, `tests/test_figs_chNN.py` (one function per fig, merged by orchestrator), `_private/compare/` | R W E G B | R3 §5.2; reading card text; 2–4 published numbers checked; "no copying" check |
| 16 | `notebook-builder` | 8 | adapted | design A/C/E/F/G, kundu map, explainer slugs, figure names | `notebooks/` | R W E G B | + K-recap blocks, scratch-vs-library cells, mechanism/reading cards, movie blocks |
| 17 | `lesson-reviewer` | 8 gate | adapted | executed notebook | `reports/chNN_lesson.md` | R W G B | + R4 §6.3 checks 7–14, K-recap completeness, equation-code coverage, no-climate-background read |
| 18 | `knowledge-keeper` | 9 ∥ | adapted | everything | `knowledge/` (+ `symbols.yaml`, `glossary.yaml`, `data_patterns.md`, `movie_patterns.md`), skill Lessons, `assets/viz_lib.js`/`viz3d.js` promotion (serial run) | R W E G B | memory |
| 19 | `library-steward` | 9 ∥ | **new** | fluidpy diff since last tag | `../Fluid Dynamics/{pyproject.toml, CHANGELOG.md, fluidpy/__init__.py}`; commits/tags in fluidpy repo | R W E G B | one owner for releases: runs `tools/release_check.py` (Kundu regression), bumps version, commits only library paths, tags, pushes the tag; updates `book.yaml → library_pin` via the orchestrator |
| 20 | `site-publisher` | 10 | adapted | notebook, explainers, figures, movies (approved) | pages, Colab twin, index, gallery, `movies.html`, `data.html`, `viz/atlas.html` | R W E G B | + sizes, data credits, movie embeds |
| 21 | `movie-director` | M1 | **new** | curation/design, pages, explainers | `movies/chNN/plan.md`, `movies/chNN/<slug>/{storyboard.yaml, script.md}` | R W G B | R1 §6 |
| 22 | `motion-builder` | M2 (×1–3) | **new** | storyboard, fluidpy, house components | `movies/data/build_chNN_<slug>.py`, `movies/chNN/<slug>/data/`, `movies/src/chNN/<Slug>.tsx`, `movies/out/chNN/<slug>/`, `reports/movies/chNN/<slug>/` | R W E B | R1 §6; looks at its own frames; ≤ 3 fix loops |
| 23 | `movie-reviewer` | M3 | **new** | frames, contact sheets, storyboard, VTT, qa.json | `reports/chNN_movies.md` | R W G B | R1 §6 physics-honesty checklist |

Removed nothing; renamed nothing. The `site-publisher` still never pushes (orchestrator does, §6.4).

---

## 5. Skills

| Skill | Origin | Key content / change |
|---|---|---|
| `aofd-book` | adapted from `fluids-book` | Vallis in one paragraph per part; chapter dependency map (Ch. 0 → 1–5 → 6–13 → 14–18 / 19–22); file naming; docstring contract (Vallis § + eq, SI, assumptions, validation label, **plus "Kundu: K§/eq if shared"**); equation numbering in text: Vallis `(2.12)`, Kundu `(K 13.15)`; notation flags (latitude symbol, sign of ψ, lapse-rate sign — memory rule: compute with Kundu Γ = dT/dz, always show met Γ = −dT/dz too, buoyancy b vs ρ′); "done" definition incl. movies optional/async |
| `teaching-style` | adapted | adds R4 §6.1 §1d–§1i (anatomy strip, magnitude bars, Like/Unlike, reading card before interpretation, rotation sense + hemisphere, easy/exact numbers, symbol atlas links), headings 🌍 Mechanism and 🗺️ How to read this figure; **§1j From scratch, then the library** (§8.1); **§1k K-recap blocks** (§8.1); "no climate background" rule |
| `cross-book-continuity` | **new** | when to K-recap (first Vallis use), what "full" means (same anatomy as a CORE block, Kundu derivation steps re-typed in Vallis notation with a crosswalk table), link format, reuse of Kundu code, later uses = short recap pointing to both the Vallis chapter and Kundu; how to read `kundu_index.yaml`; never edit the Kundu site |
| `from-scratch-code` | **new** | the equation-code rule: which equations count as computable; scratch cell anatomy (inputs with units → one line per operation → comment per line for a novice → result); allowed tools in scratch (numpy basics, loops first, then vectorised); assert recipe (`np.testing.assert_allclose(scratch, lib, rtol=…)` with tolerance justified: exact formula 1e-12, quadrature 1e-8, solver vs solver — convergence-based); non-computable equations → sympy check; tags `eq:N.M` |
| `interactive-viz` | adapted | cap 5–14; **§0 the format is Kundu's** (§8.2 here); exemplar list adds the Kundu exemplars; new depth features (anatomy, magnitude, ghost-term, tank↔planet, figure-reader, 3-D view); jet ban; parity incl. 3-D rows |
| `viz3d` | **new** (R2) | `Viz3D` API (R2 §8.2), import map, lifecycle (lazy, dispose, context loss), fallback ladder, LUTs, coast, glyph language for dot/cross/curl/balance + where-from/where-to probe (R2 §3.3), fixed-dt loop and one clock (R2 §4.2), performance table (R2 §5), honesty rules (R2 §6), review checklist (R2 §8.4) |
| `figure-reproduction` | **new** (R3, R4 §3) | reproduce the science, not the artwork; recipe format data → processing → plot → checks → fallback; house colours (cmocean/viridis, diverging centred); captions with product, period, base period, unit, sign convention, credit; reading card; pseudo-data stamping; private side-by-side only in `_private/compare/` |
| `open-data` | adapted from `data-and-benchmarks` | R3 §2 dataset catalogue and §2.4 access patterns in `fluidpy.data`; order of preference (anonymous → free login → substitute → pseudo); caching (`AOFD_DATA`, pooch hashes); committed derived products and licence flags; Colab default path loads derived products, refresh path uses Secrets |
| `motion-graphics` | **new** (R1) | storyboard schema (R1 §5.1), Remotion determinism rules, physics from tested functions (manifest), Kokoro per-sentence TTS + script-derived captions, house components, render commands, QA gates, size budget, publishing to the media repo, accessibility (no autoplay, WCAG flashes, transcript) |
| `fluidpy-library` | **new** | subpackage layout (§11.1), where a function goes, never break `fluidpy.core` (Kundu), test locations, CHANGELOG, tag/pin policy, release check |
| `python-viz` | adapted | + cartopy projections used (SouthPolarStereo, NorthPolarStereo, Robinson, Orthographic, Mollweide, PlateCarree), cmocean, plotly 3-D (Isosurface/Cone/Mesh3d) size limits |
| `math-to-python` | adapted | + spherical metric terms, β-plane, spectral/pseudo-spectral methods, sparse elliptic solves (Stommel–Munk), eigenproblems (Charney), DDEs (delayed oscillator) |
| `verify-implementation` | adapted | GFD benchmark catalogue (RAPID 17 Sv, QBO ≈ 28 months, Kelvin h_e ≈ 25 m, Munk width, Eady 0.31 f/N Λ); data-figure checks; GPU parity; scratch-vs-library parity is not evidence for the library (both may share a mistake) |
| `colab-notebook` | adapted | setup cell: clone `shammun/aofd`, `pip install "fluidpy[geo,data] @ git+https://github.com/shammun/fluidpy@<pin>"`, `pip install -e /content/aofd --no-deps`; no keys needed by default |
| `chapter-knowledge` | adapted | + `symbols.yaml`, `glossary.yaml`, `kundu_index.yaml`, data/movie patterns; promotion rules incl. `viz3d.js` |
| `explain-concept` | adapted | + Kundu link when SEEN-Kundu; data figure with reading card when relevant |
| `do-chapter` | rewritten | §6 |
| `make-movies` | **new** command | `/make-movies N [slug]` — async movie phase (§6.3) |
| `approve-movie` | **new** command | `/approve-movie N slug` — records the user's approval, publishes to media repo, enables the embed |
| `build-figure` | **new** command | `/build-figure N 21.23` — data-scout → figure-reproducer → notebook embed |
| `build-viz` | adapted | `--3d` path: builder ∥ viz3d-builder → integrator → reviewer |
| `release-fluidpy` | **new** command | `/release-fluidpy` — library-steward run outside a chapter |
| `setup-project` | rewritten | venvs, kernel, node/remotion/ffmpeg/kokoro checks, fluidpy editable, split + render, `kundu_index.py`, self-tests (§12) |
| `status` | adapted | + movies, figures, fluidpy pin, data accounts present |
| `notebook-chapter`, `publish-chapter`, `verify-chapter` | copied (paths) | publish-chapter adds the push steps of §6.4 |

---

## 6. The `/do-chapter N` pipeline

### 6.1 Phases

| # | Phase key | Agent(s) (∥ = same message) | Writes | Gate (send back once unless stated) |
|---|---|---|---|---|
| 0 | preflight | orchestrator | — | previous chapter `publish: pass`, `knowledge: done`; venv, fluidpy importable, `chapters/chNN.txt`; `tools/kundu_index.py` fresh |
| 1 | analyze ∥ scout | concept-analyst ∥ research-scout | `analysis/chNN.md` ∥ `research/chNN_scout.md` | every numbered equation once; every figure listed with R3b type; SEEN-Kundu marks have Kundu ids |
| 2 | curate | concept-curator | curation | fluidpy gates + K rows; A ≤ 18; 5–14 explainers + backup, each with a 3-D decision; every computable equation has a code plan; every data figure has a dataset key or "pseudo"; 1–3 movie groups |
| 2b | crossref | crossref-linker | `analysis/chNN_kundu.md` | `crossref_check.py` all links resolve; every K row has section URL + (explainer or "none") + derivation id or "new" |
| 3∥4∥4b | design ∥ implement ∥ data | lesson-designer ∥ concept-implementer ∥ data-scout | design ∥ fluidpy.geo/diag + aofd ∥ fluidpy.data + registry + derived | design: Parts A–G complete; implement: every Part C function exists; data: every planned figure has a derived product (or labelled pseudo) and a licence verdict |
| 5 | verify | math-verifier ⟲ implementer (≤ 3 loops) | tests (both repos), report | PASS; never by loosening tolerances; fluidpy full suite still green |
| 6∥7∥7b∥8 | review ∥ viz ∥ figures ∥ notebook | derivation-reviewer + code-reviewer(pass 1) ∥ viz-builder ×n + viz3d-builder ×m → viz-integrator ×m → viz-reviewer ∥ figure-reproducer ×k ∥ notebook-builder → code-reviewer(pass 2) ∥ lesson-reviewer | see §4 | viz: every explainer lint + shot (+ `--3d`) PASS at 8 sizes, ≤ 2 rebuild rounds, else backup; figures: numeric checks PASS; notebook: executes 0 errors, coverage_check clean (incl. equation-code), embed_check 5–14; lesson + code reports PASS (≤ 2 rounds each) |
| 9∥10 | knowledge ∥ library ∥ publish | knowledge-keeper ∥ library-steward ∥ site-publisher | knowledge ∥ fluidpy tag ∥ pages | tag pushed and `library_pin` updated; then publisher re-runs Colab twin with the new pin; page audit PASS; size budget PASS; check_public OK |
| push | orchestrator | — | `shammun/aofd` main | §6.4 |
| M | movies (async) | `/make-movies N` | §6.3 | user approval |

Parallel-safety audit of group 6∥7∥7b∥8: reviewers write nothing (pass 1); each viz-builder one HTML; each
viz3d-builder one scene file; the integrator touches an HTML only after its builder returned; figure-reproducers each one
`figs/chNN/fig_*.py` and return their test function in the reply (the orchestrator appends to `tests/test_figs_chNN.py`);
notebook-builder `notebooks/` only. The notebook embeds explainers by slug and figures by function name; its final
execution happens at the merge gate after all figures exist. `fluidpy/` is written only in phases 4, 4b (different
subfolders) and in fix loops (implementer alone).

Scheduling for a heavy chapter: at most `max_parallel_agents` (6) at once, of which at most 3 run browser audits.

### 6.2 progress.json

```json
{ "project": "aofd", "current_chapter": "ch02", "library_pin": "v0.3.1",
  "chapters": { "ch02": {
      "analyze": "pass", "scout": "pass", "curate": "pass", "crossref": "pass", "design": "pass",
      "implement": "pass", "data": "pass", "verify": "pass", "review": "pass", "code_review": "pass",
      "viz": "pass", "viz3d": "pass", "figures": "pass", "notebook": "pass", "knowledge": "done",
      "library": "pass", "publish": "pass",
      "movies": {"ch02_coriolis": "approved", "ch02_balance": "draft"},
      "explainers": ["…"], "scenes3d": ["…"], "figures_list": ["fig_02_…"], "fluidpy_tag": "v0.3.1",
      "page_mb": 11.2, "notebook_runtime_s": 140, "counts": {"A": 16, "B": 40, "C": 22, "K": 9, "R": 5, "S": 4, "D": 21, "eq_code": 88},
      "notes": "…", "updated": "2026-11-02" } } }
```
Status values as fluidpy (`todo/running/pass/fail/blocked`; knowledge `done`); movies `todo/draft/qa_pass/approved/published`.
Resumable: `--from P`, `--only P`, `--consult`, `--no-push` as fluidpy; a crashed `running` phase restarts from its start.

### 6.3 Movies as an async phase

`/make-movies N` may start once `notebook: pass` (it needs CORE ids, explainers and tested functions) and runs
independently of later chapters: movie-director → motion-builder ×(1–3) in parallel (each own folder) → `movie_qa.py`
→ movie-reviewer (≤ 3 loops) → status `qa_pass`; the movie is pushed to the media repo under `drafts/` (not linked from
the site) and the user is told to watch it. `/approve-movie N slug` moves it to `chNN/<slug>/`, sets `published`,
re-publishes the chapter page with the `<video>` block (R1 §5.4), commits and pushes both repos. Chapter N+1 is never
blocked by movies.

### 6.4 Automated publish + push (after the user's one-time repo creation)

1. `git add` of explicit path groups (never `chapters/`, `_private/`, `outputs/`, raw data); pre-commit hook runs.
2. `tools/check_public.py` (book-text n-gram scan against `chapters/chNN.txt`, page images, `_private`/`figure_refs`
   references, storyboard/VTT scan) → must print OK.
3. `tools/size_budget.py` → OK; `tools/data_registry.py --check` (committed derived products are redistributable);
   `tools/sync_fluidpy.py` (pin is a pushed tag); `_colab.ipynb` outputs stripped.
4. Commit `chNN: publish — <n> explainers (<m> 3-D), <k> figures, notebook <t>s, page <MB> MB`.
5. Remote checks: `origin` = `https://github.com/shammun/aofd(.git)` (guard refuses any other); `git fetch`; Colab-commit
   recovery as fluidpy; never force-push.
6. `git push` (pre-push hook repeats 2–3); poll the page URL until 200 (≤ 5 min), check one explainer URL, the Colab
   URL, the gallery and `index.html` card.
7. fluidpy: the library-steward already pushed `main` + tag in phase 9 (library paths only).
8. Commit + push `progress.json`. Final report ≤ 20 lines (fluidpy's list + 3-D scenes, figures with their checked
   numbers, movies pending approval, fluidpy tag).

Commit messages: `chNN: <phase> — <one line>` (aofd); `geo: <module> — <what> (for aofd chNN)` and
`release: vX.Y.Z` (fluidpy); `chNN: movie <slug> — <MB>, <s>` (media).

---

## 7. Hooks and settings

### 7.1 `.claude/settings.json`

```json
{
  "env": { "PYTHONIOENCODING": "utf-8", "PYTHONUTF8": "1",
           "AOFD_DATA": "C:\\Users\\sislam27\\AppData\\Local\\aofd\\Cache" },
  "permissions": {
    "additionalDirectories": [
      "C:\\Users\\sislam27\\Work\\Climate Dynamics PHD\\Fluid Dynamics",
      "C:\\Users\\sislam27\\Work\\Climate Dynamics PHD\\AOFD Media"
    ],
    "allow": [
      "Bash(.venv/Scripts/python.exe:*)", "Bash(.venv\\Scripts\\python.exe:*)", "Bash(.venv-tts/Scripts/python.exe:*)",
      "Bash(pytest:*)", "Bash(git status:*)", "Bash(git diff:*)", "Bash(git log:*)", "Bash(git add:*)",
      "Bash(git commit:*)", "Bash(git fetch:*)", "Bash(git rev-parse:*)", "Bash(git ls-files:*)", "Bash(git tag:*)",
      "Bash(git -C:*)", "Bash(git push:*)", "Bash(git describe:*)",
      "Bash(npx remotion:*)", "Bash(npm ci:*)", "Bash(npm run:*)", "Bash(ffprobe:*)", "Bash(ffmpeg:*)", "Bash(node:*)",
      "Bash(ls:*)", "Bash(mkdir:*)", "Bash(cp:*)", "Bash(grep:*)", "Bash(head:*)", "Bash(tail:*)", "Bash(wc:*)",
      "Bash(curl:*)", "Read", "Write", "Edit", "Glob", "Grep", "WebSearch", "WebFetch"
    ],
    "deny": [
      "Edit(*.pdf)", "Write(*.pdf)",
      "Bash(git push --force:*)", "Bash(git push -f:*)", "Bash(git push --force-with-lease:*)",
      "Bash(gh repo create:*)", "Bash(gh repo delete:*)", "Bash(gh api -X POST repos/*/pages:*)",
      "Bash(git config core.hooksPath:*)", "Bash(npm i -g:*)", "Bash(rm -rf:*)"
    ]
  },
  "hooks": {
    "SessionStart": [ { "hooks": [ { "type": "command",
        "command": "\"$CLAUDE_PROJECT_DIR/.venv/Scripts/python.exe\" \"$CLAUDE_PROJECT_DIR/tools/progress.py\" --brief" } ] } ],
    "PreToolUse": [
      { "matcher": "Bash", "hooks": [ { "type": "command",
        "command": "\"$CLAUDE_PROJECT_DIR/.venv/Scripts/python.exe\" \"$CLAUDE_PROJECT_DIR/tools/hooks/guard_bash.py\"" } ] },
      { "matcher": "Write|Edit|MultiEdit|NotebookEdit", "hooks": [ { "type": "command",
        "command": "\"$CLAUDE_PROJECT_DIR/.venv/Scripts/python.exe\" \"$CLAUDE_PROJECT_DIR/tools/hooks/guard_write.py\"" } ] }
    ],
    "PostToolUse": [
      { "matcher": "Write|Edit|MultiEdit", "hooks": [ { "type": "command",
        "command": "\"$CLAUDE_PROJECT_DIR/.venv/Scripts/python.exe\" \"$CLAUDE_PROJECT_DIR/tools/hooks/post_write.py\"" } ] }
    ]
  }
}
```
(`git config core.hooksPath .githooks` is run once by `/setup-project` before the deny rule matters; the setup skill
documents that the user may need to run it with `!`.)

### 7.2 What the hook scripts do (stdin = the tool call JSON; exit 2 = block with the reason on stderr)

| Hook | Rule |
|---|---|
| `guard_bash.py` | blocks: `git add` of `_private/`, `*.pdf`, `chapters/`, `outputs/`, `data/raw`, or `-A`/`.` inside the fluidpy repo (must name `fluidpy/ tests/ pyproject.toml CHANGELOG.md`); `git push` with `--force`, `-f`, `+refspec`; `git push` in this repo whose `origin` is not `shammun/aofd`, or in the fluidpy repo with staged paths outside library paths; before any `git push` here runs `check_public.py` + `size_budget.py` and blocks on failure; `git commit` in `../Fluid Dynamics` touching `notebooks/ viz/ knowledge/ analysis/ reports/ index.html book.yaml .claude/` (Kundu site is read-only from this session) |
| `guard_write.py` | blocks writes to `*.pdf`, to `../Fluid Dynamics/{notebooks,viz,knowledge,analysis,reports,.claude,templates,assets}` and its `index.html`/`book.yaml`; writes under `_private/` except `_private/compare/`; writes of files > 10 MB into the repo outside `data/derived/` |
| `post_write.py` | `viz/**/*.html` → `viz_lint.py --quick <file>` (prints findings, exit 2 so Claude sees them, never blocks); `*.py` under `fluidpy/geo|data|diag` → pyflakes + docstring-contract check (§ + eq + units + label); `movies/**/storyboard.yaml` and `data/registry.yaml` → schema validation; `notebooks/build_*.py` → nothing (too slow) |
| git `pre-commit` | staged-path rules as `guard_bash`; file size ≤ 10 MB unless under `data/derived/` (≤ 10 MB anyway) ; no `*.ipynb` with outputs in `*_colab.ipynb` |
| git `pre-push` | `check_public.py` + `size_budget.py` (fluidpy repo keeps its own pre-push) |

---

## 8. Content contracts

### 8.1 Notebook cell anatomy

**CORE block (A item)** — fluidpy's anatomy, extended (new parts ✱):
```
### 🧩 C07 · Geostrophic balance                         (Vallis §2.8)
plain words (story with ≥ 1 number + unit; every climate word glossary-linked on first use ✱)
🖼️ picture (figure / animation / 3-D still)  ·  ❓ the question
🔁 From Kundu — full K-recap block if this idea is SEEN-Kundu ✱ (below)
📐 the equation(s) in full with numbers: $f\hat{\mathbf z}\times\mathbf u_g=-\nabla p/\rho_0$ (2.xx)
   anatomy strip (term names, colour family) ✱ · magnitude table/bars with Earth values, dominant balance named ✱
🧮 Derivation D05 (goal · plan · tools · one move per step: did / line / why / in words · check · meaning; sympy for ★★★)
🔢 tiny worked example: easy numbers | exact numbers ✱ ("≈ 10 m/s | 9.6 m/s"), "that is like …" ✱
🐍 From scratch — eq (2.xx) ✱ : inputs with units, one operation per line, a comment per line for a novice
🐍 The library — `fluidpy.geo.balance.geostrophic_velocity(...)` ✱ + `np.testing.assert_allclose(scratch, lib, rtol=1e-12)`
📊 visualization + What you see / How to read it / What would change if…
🎮 explainer (full-window) · 🎬 movie link if one covers it ✱
🌍 Mechanism card if the idea is a mechanism ✱ (story · picture · one equation · number · misconception · where next)
⚠️ misconception / analogy as Like… / Unlike… ✱  ·  ➡️ where next (Vallis chapter + Kundu link)
```
**B/C NOTE** — inside the nearest A block; B: paragraph + equation in full + number + **if computable, a short
from-scratch cell + library call + assert ✱**; C: one sentence + pointer.

**K-recap block (🔁 From Kundu)** ✱ — first Vallis use of a Kundu idea:
```
> 🔁 From Kundu ch13 §13.5 — thermal wind
> [notebook section](https://shammun.github.io/fluidpy/notebooks/ch13_geophysical_fluid_dynamics.html#13.5-Geostrophic-Flow)
> · [explainer thermal_wind](https://shammun.github.io/fluidpy/viz/ch13/thermal_wind.html) · Kundu derivation ch13 D04 (7 steps)
notation crosswalk table (Kundu symbol ↔ Vallis symbol, sign conventions, e.g. Kundu latitude θ ↔ Vallis's)
the full re-teaching at CORE depth: plain words → equation (K 13.15) written out and its Vallis form (2.xx) →
derivation steps reused from the Kundu design Part F, re-typed in Vallis notation → tiny example →
from-scratch code + the existing fluidpy.core function + assert → figure (or the Kundu explainer embedded) →
"What Vallis adds" (generalisation, new approximation, new regime)
```
Later uses: a short 🔁 recap naming the Vallis chapter where it was re-taught and the Kundu link.
**📎 Primer** (unchanged, plus `P0-…` ids for Ch. 0). **🗺️ Reading card** (R4 §3.1, five questions + source line,
before any interpretation). **Equation-code ledger** at the end of each section (eq → cell tag → status), checked by
`coverage_check.py`. Equation numbers: Vallis bare `(n.m)`, Kundu `(K n.m)`; always with the maths beside them.

### 8.2 Explainer contract — the Kundu format is the baseline; 3-D is added inside it

**Copied verbatim as the baseline** (from `../Fluid Dynamics`, commit d379326): skill `interactive-viz` §1–§8
(contract, `Viz.app` API, fit rules, the 11-point quality bar of §4, reference explainers of §5, embedding of §8),
`templates/` (`viz_template.html`, `viz_example.html`, `viz_example_field.html`, `viz_example_3d.html`),
`assets/viz_lib.js`, `assets/viz_base.css`, `tools/viz_lint.py`, `tools/shot.py`, `tools/viz_inline.py`,
`tools/new_viz.py`, `tools/embed_check.py`, and `fluidpy.core.embed.show_viz` (full-window embedding in Jupyter, Colab
and the page). That means, unchanged: one self-contained `viz/chNN/<slug>.html`; a question as the title; linked views on
one state and one clock; controls and presets; transport (▶ ⏮ ⏭ ↺, scrubber, speed); status verdict; tabs Walkthrough
(4–8 steps) · Explore · **Explain** ("Explanation & interpretation", ≥ 3 numbered sections with the reader's numbers,
boxed results, regime-dependent interpretation) · **Derivation** (every D id the curation assigns, one move per page) ·
Equations (book-numbered, live, written out) · **Code** (synced Python, lines lit by the walkthrough) · Check yourself
(≥ 3); ≥ 2 depth features; `selftest()` parity rows against the fluidpy function; no scrolling at 360×640, 390×844,
844×390, 768×1024, 1280×720, 1000×700, 1366×768, 1920×1080 and in a notebook frame; no text below 12 px; full-window
block on the page. The preferred references stay Shammunul's Unit 4 mathlets (`forced_damped_vibrations.html` for the
Explain panel, `amplitude_phase_second_order_II_3.html` for numbered live derivations, `angular_frequency_explorer_1.html`
for linked views and modes).

**"This is the format" exemplars** (every builder opens these before building; the viz-reviewer compares against them):
1. **`viz/ch13/rossby_waves.html`** in fluidpy — <https://shammun.github.io/fluidpy/viz/ch13/rossby_waves.html> — the
   Kundu viz-review called it the chapter's best on a desktop: crest ▲ against group ◆ on one clock, chord = phase
   speed and tangent = group velocity on one ω(k) curve, a clicked column's vorticity budget traced in the walkthrough,
   11 Explain sections, two derivations (D22, D23) step-matched, 53 parity rows.
2. **`viz/ch13/geostrophic_adjustment.html`** — <https://shammun.github.io/fluidpy/viz/ch13/geostrophic_adjustment.html>
   — rated "excellent": snapshot vs period-mean vs closed-form end state, conserved quantity drawn flat, energy bill
   (one third kept), "no rotation first, then the same step on a turning earth"; ★★★ derivation D16 (11 steps); 67
   parity rows.
3. For a 3-D view inside the app: `templates/viz_example_3d.html` and `viz/ch13/ekman_spiral.html` (one depth cursor
   shared by the 3-D spiral, the hodograph and the transport integral — the best-rated 3-D-ish pattern, R2 §1.2).

**What changes**
- Count 5–14 per chapter (Ch. 0: 14); `viz:*` metas add `3d` (0/1), `kundu` (exemplar or re-skinned Kundu slug),
  `data` (registry keys).
- **three.js is added as a view, never as a different style**: a 3-D scene is one entry in `stage.views` created with
  `Viz3D.scene(view, …)` (R2 §8.2), sharing `app.state`, the transport clock, presets, the inspector (picking writes
  state), walkthrough steps (camera presets + layer reveal), Explain numbers and the Code tab. Portrait phones show the
  3-D view plus one 2-D view, swapped by step (R2 §1.2). Optional `modes` entry "3-D / flat". Without WebGL the
  `Viz.proj3` fallback draws the key lines and every tab still teaches.
- **3-D wherever it eases understanding, in every chapter**: the curator decides per explainer (yes/no + one-line
  reason, "earn the third dimension", R2 §6.1); a chapter with no 3-D explainer must say why in the curation. Expected
  share: about a third to a half of all explainers.
- New depth features (count toward "≥ 2"): anatomy, magnitude bars, ghost-term, tank↔planet, figure-reader, 3-D view
  (R4 §6.2). New library helpers: `Viz.symbols`, `Viz.magnitudeBars`, `Viz.ghost`, `Viz.figureReader`, `Viz.proj3`
  (promoted), and `Viz3D` in `assets/viz3d.js`.
- Parity adds GPU read-back rows and drawing invariants (cross product ⟂ inputs, Ekman transport ⟂ wind) (R2 §4.1).
- Colour: no jet/rainbow (except as the labelled bad example in Ch. 0 E11); project-wide term colours (R4 §1.3).
- **Flow-direction scenes** (requirement 10, e.g. the two-box model of Fig. 21.6 and the overturning pathways of
  Fig. 21.30, both redrawn by us): the glyph language of R2 §3.3 — dot product as shadow + signed bar (u·∇b: across or
  along isopycnals), cross product as parallelogram + arc + result arrow (−f ẑ×u, τ×ẑ/ρ₀f), curl as a loop
  circulation with a vertical arrow (Ekman pumping), and the where-from / where-to trajectory probe with yearly ticks.

### 8.3 Figure-reproduction contract

| Item | Rule |
|---|---|
| Scope | every R3b figure of type SEC/MAP (60) and GCM (8) is reproduced; SIM/ANA by our models/functions as needed by the curation; SCH redrawn only where it teaches (often as an explainer) |
| Code | `figs/chNN/fig_NN_MM.py`: `make(ax=None, refresh=False) -> Figure`, reads the derived product (or runs the model), commented for a novice, `if __name__ == "__main__":` |
| Provenance | caption ends with the credit line from the registry; the figure's metadata (PNG text chunk, plotly `meta`) carries dataset key, period, processing commit |
| Substitutions | a different variable or product says so in the caption (R3 §6.6: OLR for cloud brightness, reanalysis composite for a GCM composite, …) and is labelled **"model analogue"** or **"observed analogue"** |
| Pseudo-data | only when no open source exists: generated by `fluidpy.data.pseudo` with the observed pattern and magnitudes, stamped **"ILLUSTRATIVE — synthetic data"** on the figure, first word of the caption, `synthetic: true` in metadata, provenance chip *schematic* in 3-D |
| Checks | 2–4 numbers against independent published values (cited), orientation (lat not flipped, sign of ψ stated), projection/extent/axes in kind; private side-by-side with `_private/figure_refs` only for review |
| Style | own colormaps (cmocean/viridis, diverging centred), own layout and annotations; negative contours dashed, zero bold, interval stated |
| Teaching | 🗺️ reading card before interpretation; a figure-reader explainer when the figure type is new to the reader (R4 §3.2) |

### 8.4 Movie contract

R1 §5.1 storyboard schema (concept ids, 120–180 s, scenes with narration, `on_screen_eq` with LaTeX + Vallis number from
the page image, `physics_source` naming a tested fluidpy function or "decorative", exaggeration list, honesty notes,
quiz hook); narration ≤ 150 words/min in our own words; captions from the script (VTT + SRT); no music by default;
−16 LUFS; no autoplay; WCAG flash rule; "not to scale" badge on every exaggerated scene; end card linking to the
notebook section and the explainer; QA gates of R1 §5.3; ≤ 25 MB; public only after `/approve-movie`.

---

## 9. Chapter 0 and first-pass plans for Chapters 1–2

### 9.1 Chapter 0 — "Start here": maths, climate basics and reading maps (revised 2026-10-20 after user feedback)

**What Chapter 0 is.** Everything a first-time learner needs *before* Vallis Chapter 1, in one chapter with three
parts. Each part is its own notebook, Colab twin and page, because one notebook would be far too long. There is one
chapter landing page. **No later chapter may assume anything that Chapter 0 or an earlier chapter has not explained.**

| Part | Notebook / page | Content |
|---|---|---|
| **0A · Maths from scratch** | `ch00a_maths` | **All of Kundu Appendix B** ("Mathematical Tools and Resources", Kundu PDF pp. 884–895), expanded, plus the extra tools of R4 §2.1 |
| **0B · Climate and GFD basics** | `ch00b_climate_basics` | The physical ideas and vocabulary of climate dynamics for someone who has never studied it |
| **0C · Reading climate figures** | `ch00c_reading_maps` | How to read every kind of map, section and diagram the book uses, practised on real data |

**Writing style for Chapter 0 (and the plain-words parts of every chapter).** Informal, blog-like and conversational.
Start from scratch, as if talking to a curious friend: "Imagine you are standing on a hillside in fog…". Use short
blocks, each with a heading, one idea per block, and everyday analogies (each saying where it stops working). Every
symbol is introduced the moment it appears. Precision is not given up: the friendly paragraph comes first, then the
exact statement, then a tiny worked number, then code. Add this as a new `teaching-style` §1d "Chapter-0 voice", and
the lesson-reviewer checks it: no unexplained jargon, sentences you could say aloud, and no "clearly" or "obviously".

**Part 0A — maths from scratch.** The source is Kundu Appendix B, sections B.1–B.6. Equations are transcribed from
**Kundu page images** rendered in `../Fluid Dynamics` with `tools/render_pages.py`, read-only, never committed. Each
section also links to where the Kundu site already used it (mostly Kundu ch02–ch04 notebooks and explainers):

| Kundu App. B | 0A section(s), expanded for beginners |
|---|---|
| B.1 Partial and total differentiation | What a partial derivative is (slice a surface); total differential; chain rule; exact vs inexact differentials (why heat is not a state function, needed in Vallis ch. 1 thermodynamics); implicit differentiation |
| B.2 Changing independent variables | Switching what you hold fixed; Jacobians; why "∂/∂x at constant p" differs from "at constant z" (preview of pressure coordinates, Vallis §2.6) |
| B.3 Basic vector calculus | Scalars and vectors; components; **dot product** (shadow / "how much along"); **cross product** (area, right-hand rule, "turning"); triple products; a×(b×c) = b(a·c) − c(a·b); grad, div, curl, Laplacian; the identities fluid dynamics uses: ∇×∇φ = 0, ∇·(∇×A) = 0, (u·∇)u = ∇(u²/2) − u×(∇×u), ∇·(a×b), ∇×(a×b); flux; Gauss and Stokes theorems; index notation (light) |
| B.4 The Dirac delta function | A spike with area 1; sifting property; point sources and impulsive forcing (Green's functions preview) |
| B.5 Common 3-D coordinate systems | Cartesian, cylindrical, **spherical (longitude, latitude, radius: the Earth's coordinates)**; unit vectors that change direction from place to place |
| B.6 Equations in curvilinear coordinates | grad/div/curl/Laplacian in cylindrical and spherical form, rewritten in the latitude–longitude form Vallis uses (§2.2), with the metric terms explained |
| *added (R4)* | Taylor series and linearisation; complex exponentials and waves; Fourier ideas; ODE basics (decay, oscillation, growth); orders of magnitude, scaling and nondimensional numbers; material derivative |

**Part 0B — climate and GFD basics** (each concept as a 🌍 mechanism card, R4 §4: story → picture → one equation → a
number → a misconception → "where Vallis does it properly"):

- The atmosphere and ocean as **thin shells** on a sphere (draw to scale, then exaggerated, and say so).
- Pressure and **hydrostatic balance**; **geopotential and geopotential height**; why meteorologists use pressure as
  the vertical coordinate; what "the 500 hPa surface" is.
- Temperature, **potential temperature**, density, **buoyancy**, stratification and N²; ocean density from temperature
  and salinity.
- Rotation: the **Coriolis effect** (rotating-turntable story), f = 2Ω sin φ, the β-effect.
- **Geostrophic wind**: why wind blows *along* height contours, not across them; highs and lows in each hemisphere.
- **Vorticity**: relative, planetary and absolute (a paddle wheel riding the flow); **potential vorticity** as spin per
  thickness (the ice-skater column that spins up when stretched).
- Thermal wind (why the jet sits above the strongest temperature contrast).
- The big circulation features as forward pointers: Hadley and Ferrel cells, jet streams, storm tracks, Ekman
  transport, wind-driven gyres and western boundary currents, the overturning circulation, ENSO, QBO, polar vortex.
- Data words: observation, reanalysis, state estimate, model; climatology, anomaly, composite.

**Part 0C — reading climate figures** (🗺️ reading card for each, R4 §3; practice figures from anonymous open data,
R3): contours and contour intervals, filled vs line contours, dashed negatives, colourbars and diverging maps; map
projections (polar stereographic, Robinson, Mollweide, orthographic); **500 hPa geopotential-height maps** with the
geostrophic wind read off them; zonal means and latitude–height sections; p, log-p and height axes; isopycnal maps;
streamfunction maps (Sverdrup units, which way the flow goes, hemisphere sense); Hovmöller and time–height plots (QBO);
wavenumber–frequency spectra with dispersion curves; quiver and EP-flux arrow plots; 3-D isosurface figures. Practice
data: NCEP R1 daily 500 hPa height and wind, NCEP R1 monthly zonal-mean u, ERSST v5 anomaly, FU-Berlin QBO.

**IDs and limits.** CORE IDs `C0A-01…`, `C0B-01…`, `C0C-01…`. The 18-CORE cap applies **per part**, and so does the
14-explainer cap (≤ 42 explainers in total for Chapter 0). This needs the user's confirmation; see §13.2 Q11.

**Glue and library.** `aofd/ch00_toolkit.py` holds book glue. Reusable parts go to fluidpy: vector identities
(`fluidpy.geo.vectors`), operators on the sphere (`fluidpy.geo.sphere`), projection metrics, hydrostatic and
geopotential helpers (`fluidpy.geo.atmos`), and a Wheeler–Kiladis-style spectrum (`fluidpy.diag.spectra`). The seeds
`knowledge/symbols.yaml`, `knowledge/glossary.yaml` and `viz/atlas.html` are as in R4 §2.3 and §5.

**K-recaps:** the Kundu ch02 explainers (`rotation_of_axes`, `gauss_flux_box`, `stokes_circulation_loop`,
`strain_vs_rotation_split`), ch03 (`material_derivative_probe`, `vortex_paddle_wheels`), ch04
(`stream_function_spacing`) and ch07 (`dispersion_relation`, `group_velocity_packets`). Each is re-taught in full and
linked; it gets geophysical presets where R4 says so.

**Explainers (Kundu format, §8.2; ★ = with a three.js 3-D view).**

| Part | # | Slug | Idea |
|---|---|---|---|
| 0A | E01 | `vector_products_lab` ★ | drag a, b in 3-D; a·b as shadow and signed bar; a×b as parallelogram + right hand; preset "f k×u" (**PoC A**) |
| 0A | E02 | `vector_identity_builder` ★ | triple products; a×(b×c) lies in the b–c plane; orbit to check |
| 0A | E03 | `partial_derivative_slicer` ★ | a surface T(x, y); slice at constant y → ∂T/∂x; total differential as the tangent plane |
| 0A | E04 | `chain_rule_and_jacobian` | changing variables; what is held fixed; z vs p coordinates preview |
| 0A | E05 | `gradient_hillwalk` ★ | ∇T as steepest ascent; directional derivative = ∇T·n (cosine) |
| 0A | E06 | `divergence_curl_paddles` ★ | flux through a small cube's faces; paddle wheel whose axis is the curl |
| 0A | E07 | `flux_box_budget` ★ | Gauss by tiling cubes; Stokes by tiling loops |
| 0A | E08 | `laplacian_neighbours` | "you minus the average of your neighbours"; diffusion flattening a bump |
| 0A | E09 | `dirac_delta_spike` | narrowing pulses of area 1; sifting; point source response |
| 0A | E10 | `coordinates_and_unit_vectors` ★ | Cartesian/cylindrical/spherical; unit vectors rotating with position; metric terms |
| 0A | E11 | `taylor_linearise` | zoom until curved looks straight; linearising about a basic state |
| 0A | E12 | `complex_wave_pointer` ★ | helix e^{i(kx−ωt)} whose shadow is the cosine; phase and group speed |
| 0A | E13 | `material_derivative_balloon` | a balloon in the wind sensing temperature: local + advective change |
| 0A | E14 | `scaling_orders_of_magnitude` | term-magnitude bars; Rossby number from U, L, f |
| 0B | E15 | `thin_shell_to_scale` ★ | Earth with atmosphere and ocean at true scale vs exaggerated (labelled) |
| 0B | E16 | `hydrostatic_column` | pressure from the weight above; scale height; geopotential height |
| 0B | E17 | `isobaric_surface_3d` ★ | the 500 hPa surface sagging over cold air; heights → map contours |
| 0B | E18 | `buoyancy_parcel` | lift a parcel; stable, neutral, unstable; N² and oscillation (both lapse-rate conventions) |
| 0B | E19 | `coriolis_turntable_globe` ★ | ball on a turntable and on a globe; f = 2Ω sin φ by latitude; inertial circles |
| 0B | E20 | `geostrophic_wind_reader` | height-contour map; wind along contours; speed ∝ contour crowding; flip hemisphere |
| 0B | E21 | `vorticity_spin_meter` ★ | relative + planetary = absolute vorticity; paddle wheel on a rotating Earth |
| 0B | E22 | `pv_skater_column` ★ | stretch or squash a rotating column; spin changes; PV conserved |
| 0B | E23 | `thermal_wind_tilt` ★ | temperature contrast → tilted pressure surfaces → wind increasing with height |
| 0B | E24 | `climate_machine_tour` ★ | the global circulation as clickable parts (Hadley, jets, gyres, overturning) with pointers to chapters |
| 0C | E25 | `contour_colour_reader` | contours, intervals, colourbars, diverging maps; jet as the labelled bad example |
| 0C | E26 | `sphere_to_map` ★ | globe unwraps into the chosen projection; Tissot circles |
| 0C | E27 | `height_map_reader` | real 500 hPa day (NCEP R1): probe heights, winds, troughs and ridges |
| 0C | E28 | `section_and_vertical_axes` ★ | 3-D atmosphere slab collapses into a zonal mean; p, log p and z axes |
| 0C | E29 | `streamfunction_reader` ★ | ψ as a surface whose contours are streamlines; Sverdrups; hemisphere sense |
| 0C | E30 | `hovmoller_qbo_reader` | time–height plot of the QBO built step by step from real data |
| 0C | E31 | `spectrum_reader` | wavenumber–frequency spectrum with dispersion curves; what a ridge means |
| 0C | E32 | `isosurface_reader` ★ | one blob as an isosurface, three contour planes and a zonal mean |

Builders should merge or drop explainers if a part's curation shows fewer are needed. The minimum is 5 per part.

**Standalone 3-D scenes for Chapter 0** (§15.1): `earth_thin_shell`, `vector_zoo`, `the_500hPa_surface`,
`coriolis_merry_go_round`, `pv_skater`, `globe_unwrapping`.

**Chapter 0 movies** (motion graphics, 2–3 min each, narrated; order = recommended production order):

| # | Title | What the learner sees | Why it helps a first-timer |
|---|---|---|---|
| M0-1 | *The climate machine in three minutes* | Sunlight heats the tropics → rising air and the Hadley cell → Coriolis turns the flow → jets and storms → winds drag the ocean into gyres → cold water sinks and spreads → the whole engine on a spinning globe | The "why should I care" trailer that shows where every later chapter fits |
| M0-2 | *A spinning planet* | Turntable ball → Coriolis on the globe → f by latitude → geostrophic wind along height contours → highs and lows each hemisphere → the skater column (vorticity and PV) | Rotation is the single biggest new idea in Vallis |
| M0-3 | *How to read a climate map* | 3-D atmosphere → slice at 500 hPa → heights to contours → wind along contours → colourbar and anomalies → zonal mean section → QBO time–height plot | Turns "scary figures" into a skill |
| M0-4 | *Arrows that multiply: dot and cross* | Shadow (dot), area and turning (cross), right-hand rule, f k×u turning the wind, curl of wind stress pushing water up and down | Notation that appears on every page |
| M0-5 | *Slopes, flux and spin: grad, div, curl* | Hill-walk gradient → box outflow (div) → paddle wheel (curl) → Gauss and Stokes as tiling | Notation that appears on every page |
| M0-6 | *Riding with the flow* (optional) | Partial vs material derivative: a thermometer fixed on a pole vs one on a balloon | The most common beginner confusion in fluid dynamics |

Physics and data come from the same tested fluidpy functions and derived products as the explainers (R1 §5).

### 9.2 Chapter 1 (Equations of Motion) — Kundu continuity

| Vallis idea | Kundu source (re-taught in full + linked) | Kundu explainer to link/re-skin | Kundu derivations / code reused |
|---|---|---|---|
| time derivatives, material derivative (1.1) | ch03 §3.2–3.3 · `notebooks/ch03_kinematics.html#3.2-…`, `#3.3-…` | `ch03/material_derivative_probe`, `ch03/reynolds_transport_cv` | ch03 D-rows on D/Dt and RTT (from `kundu_index.yaml`); `fluidpy.core.kinematics` |
| mass continuity (1.2) | ch04 §4.2 · `ch04_conservation_laws.html#4.2-Conservation-of-Mass` | `ch04/control_volume_budgets` | ch04 continuity derivation; `fluidpy.core.conservation` |
| momentum equation (1.3) | ch04 §4.4–4.6 | `ch04/navier_stokes_term_balance`, `ch04/newtonian_stress_lab` | NS derivation; `fluidpy.core.navier_stokes` |
| equation of state, thermodynamic relations (1.4–1.6, App. A–B) | ch01 §1.8–1.9; ch04 §4.8 | `ch01/heat_work_paths`, `ch04/viscous_dissipation_heating` | `fluidpy.core.thermo` (perfect gas, cp/cv, sound speed) |
| seawater thermodynamics (1.7) | — (new; TEOS-10 via gsw) | — | new `fluidpy.geo.seawater` |
| sound waves; compressible vs incompressible (1.8–1.9) | ch15 §15.1–15.2; ch04 §4.9 | `ch15/sound_pulse_dalembert` | `fluidpy.core.acoustics` |
| energy budget (1.10) | ch04 §4.8 | `ch04/viscous_dissipation_heating` | ch04 energy derivation |
| nondimensionalisation and scaling (1.11) | ch01 §1.11; ch04 §4.11 | `ch01/buckingham_pi_machine`, `ch04/dynamic_similarity_models` | `fluidpy.core.dimensional` |

### 9.3 Chapter 2 (Rotation and Stratification) — Kundu continuity

| Vallis idea | Kundu source | Kundu explainer | Kundu derivations / code reused |
|---|---|---|---|
| rotating frame, Coriolis and centrifugal (2.1) | ch04 §4.7 `#4.7-Noninertial-Frame-of-Reference` | `ch04/rotating_frame_coriolis` (5 derivations incl. ★★★ D15) | `fluidpy.core.rotating` (frame terms, effective gravity, projectile paths) |
| spherical coordinates, metric terms (2.2) | ch13 §13.4 (thin shell); ch03 coordinate systems | — (new 3-D globe explainer) | ch13 D02 (Coriolis components, f = 2Ω sin, 9 steps); new `fluidpy.geo.sphere` |
| tangent plane, f- and β-plane (2.3) | ch13 §13.4 | — | `gfd.f_plane`, `beta_plane`, `beta_plane_error` |
| Boussinesq (2.4) | ch04 §4.9 | `ch04/boussinesq_buoyancy` | ch04 Boussinesq derivation; asymptotic version (App. A) is new |
| anelastic, pressure coordinates (2.5–2.6) | — (new) | — | new `fluidpy.geo.vertical_coords` |
| hydrostatic balance and its scaling (2.7) | ch01 §1.7; ch13 §13.4 | `ch04/navier_stokes_term_balance` (term bars) | `fluidpy.core.statics`, `gfd.thin_layer_terms` |
| geostrophic and thermal wind (2.8) | ch13 §13.5 `#13.5-Geostrophic-Flow` | `ch13/geostrophic_balance`, `ch13/thermal_wind` | ch13 D03 (6 steps), D04 (7), D05 Taylor–Proudman (7); `gfd.geostrophic_velocity`, `thermal_wind_*`, `taylor_proudman_residual` |
| gradient wind (2.9) | — (new) | — | new `fluidpy.geo.balance.gradient_wind` |
| static instability, parcel method, N² (2.10) | ch01 §1.10 `#1.10-Stability-of-Stratified-Fluid-Media`; ch13 §13.2 | `ch01/parcel_stability` | `fluidpy.core.stratification` (N², parcel ODE, lapse-rate convention — Kundu Γ = dT/dz with met Γ = −dT/dz shown alongside) |

Chapter 2 is the first heavy 3-D chapter (Coriolis on a globe, effective gravity, unit vectors, tangent plane, sloping
isotherms) and gets movies M1 (Coriolis) and M2 (geostrophy + thermal wind). Its K-recaps are long; to keep the A count
honest, K rows do not count toward the 18.

---

## 10. Verification

| Layer | Evidence (carried over ✓ / new ✱) |
|---|---|
| Library physics | ✓ V1–V7 ladder; computable CORE ≥ 2 independent levels; NOTE and every called function ≥ 1; ≤ 3 fix loops; never loosen tolerances; ✱ tests live in fluidpy `tests/geo|diag|data`, chapter-level in aofd `tests/test_chNN.py`; ✱ fluidpy full suite (incl. all Kundu chapters) must stay green on every change |
| From-scratch parity ✱ | every `eq:` cell asserts scratch ≈ library with a justified tolerance; `coverage_check.py` fails if a computable equation has no cell or a cell has no assert; the code-reviewer checks the scratch cell does not call the library (directly or via `aofd`). Parity is pedagogy, not evidence — library evidence comes from the V-ladder |
| Explainers | ✓ lint + shot at 8 sizes, parity rows, visual review; ✱ `--3d`: GL flags, `viz3d:ready`, non-blank canvas (pixel variance) at every size, real drags/wheel, forced context loss → message → restore, `renderer.info.memory` → 0 after dispose, page audit ≤ 8 live contexts, GPU read-back rows (float32 rtol stated), drawing invariants, data-texture spot values (lat not flipped) (R2 §4.1, §5, §8.4) |
| Data figures ✱ | `tests/test_figs_chNN.py`: 2–4 published numbers per figure (e.g. AMOC at 26°N ≈ 17 Sv vs RAPID; QBO period ≈ 28 months, maximum 10–20 hPa; Kelvin peak near h_e ≈ 25 m; subtropical Sverdrup ψ ≈ 30 Sv; PF/SAF south of Africa ≈ 50°S/45°S), orientation and sign checks, units; licence flag; size; pseudo-data stamped |
| Movies ✱ | `movie_qa.py` gates (R1 §5.3): duration, size, codec/faststart, black/frozen, loudness, flashes, captions = script, physics-manifest hash parity + JS selftest rows, every storyboard equation present and KaTeX-error-free; movie-reviewer physics checklist; user watches before publication |
| Teaching ✓/✱ | lesson-reviewer fluidpy checks + R4 §6.3 items 7–14 + K-recap completeness (all parts, valid links) + equation-code ledger + "no climate background" read |
| Public safety ✓/✱ | check_public (+ `_private`, storyboard/VTT, registry flags), size budget, origin guard |

---

## 11. fluidpy roadmap

### 11.1 Layout

```
fluidpy/
  core/            # unchanged API (Kundu); bug fixes only, never signature changes
  chNN_*.py        # Kundu chapter modules (unchanged)
  geo/             # Vallis-era GFD (imports core where physics already exists)
    constants.py   sphere.py (spherical coords, metrics, projections helpers)   frames.py (rotating frame on a sphere)
    seawater.py (gsw wrappers, linear EOS)   thermo_atmos.py (θ, θe, moist)   vertical_coords.py (p, log-p, σ, isentropic)
    balance.py (hydrostatic, geostrophic, thermal, gradient wind)   shallow_water.py (1-D/2-D, multi-layer, sphere)
    vorticity.py (circulation, PV Ertel/SW/QG)   qg.py (PV inversion, two-layer, continuous)   ekman.py
    waves/ (rossby, gravity, equatorial, rays, wkb)   instability/ (kh, rayleigh, eady, phillips, charney)
    wave_mean.py (EP flux, TEM, pseudomomentum)   turbulence.py (spectra, cascades, Rhines)
    models/ (pseudo-spectral 2-D, β-plane, two-layer QG, SW C-grid, 1-D QBO, Holton–Mass, advection–condensation,
             sideways convection, Stommel–Munk solver, box models, delayed/recharge oscillators, Matsuno–Gill)
    circulation/ (hadley, ferrel, stratosphere, moist, gyres, thermocline, moc, acc, enso)
  data/            # registry, fetchers (psl, era5_arco, wb2, cds, earthdata, woa, mimoc, ecco, fronts, ne, etopo),
                   # reduce.py (derived products with provenance attrs), pseudo.py (labelled synthetic fields)
  diag/            # zonal_mean, anomalies/climatology, streamfunctions (horizontal, MOC, mass), EP flux/TEM on data,
                   # wavenumber–frequency (Wheeler–Kiladis), spectra on the sphere, isentropic/isopycnal remapping
  ml/  (later)     # optional extras only
```

### 11.2 Phases

| When | Version | Content |
|---|---|---|
| Now (setup + Ch. 0–5) | 0.3.x | pyproject + extras; `geo.sphere/frames/balance/seawater/vertical_coords/vorticity/qg/ekman`; `data` registry + PSL/ERSST/FU-Berlin/NE fetchers; `diag.zonal_mean`, `diag.spectra` |
| Part II (Ch. 6–13) | 0.4–0.5 | waves, instability eigenproblems, wave–mean flow, pseudo-spectral and two-layer QG models, tracer dispersion; WOA23/GDP fetchers |
| Part III (Ch. 14–18) | 0.6 | Hadley/stratosphere/moist modules; ERA5 (ARCO, WB2, CDS), MERRA-2; diag EP flux/TEM on data, WK spectra, mass streamfunction |
| Part IV (Ch. 19–22) | 0.7 | gyre/thermocline/MOC/ENSO models; WOA23/MIMOC/ECCO/GODAS/RAPID; diag MOC (depth and density space), barotropic ψ |
| After Vallis | 1.0 | stable `geo/data/diag` API, docs site, xarray accessors (`ds.fluidpy.zonal_mean()`), CMIP6 via intake-esm (climate-model book) |
| Next: climate data work | 1.x | catalogue of derived climatologies, regridding (xESMF optional), budgets (heat, moisture, momentum), indices (ENSO, NAO, SAM, QBO) |
| Later: ML for climate | 2.x, extras `[ml-torch]`, `[ml-jax]` | `ml.datasets` (trajectories from `geo.models`: Lorenz-63/96, two-layer QG, SW, β-turbulence; WeatherBench2-format writers); `ml.pinns` (heat/Burgers/SW/QG residual losses built from the same tested operators); `ml.operators` (FNO, U-Net, DeepONet baselines); `ml.emulators` (QG/SW emulators, rollout metrics, energy-spectrum checks); `ml.differentiable` (JAX ports of SW/QG/2-D models with gradient tests against finite differences; interoperate with `jax-cfd`/`dinosaur`); evaluation = physics diagnostics from `diag` |

### 11.3 Versioning and releases

SemVer from 1.0; before 1.0 minor versions may add but never remove/rename anything the Kundu notebooks or a published
AOFD chapter imports. Every release: `tools/release_check.py` (full pytest + two Kundu notebooks + `aofd` imports),
CHANGELOG entry, annotated tag, push of `main` and the tag (library paths only), then `book.yaml → library_pin` bump in
aofd and a re-publish of the affected Colab twins. Editable install locally means AOFD always sees the working tree;
`sync_fluidpy.py` prevents publishing a chapter whose pin lacks a function it uses.

---

## 12. Build order for the setup session (empty folder → Chapter 0 published)

| # | Step | Done when |
|---|---|---|
| 1 | `git init` in `AOFD Vallis`; write `.gitignore` (§2.6) before anything else; confirm the PDF and `_private/` are ignored | `git status` shows neither |
| 2 | Copy from `../Fluid Dynamics`: `.claude/` (agents, skills), `tools/`, `assets/`, `templates/`, `.githooks/`, `CLAUDE.md`, `GUIDE.md` skeleton, `requirements*.txt`; record source commit d379326 in `assets/viz_lib.js` header | files present |
| 3 | In fluidpy (separate commits there): add `pyproject.toml` + extras, empty `geo/ data/ diag/` packages with `__init__`, `CHANGELOG.md`; run its full pytest; tag `v0.3.0`; push (fluidpy origin exists) | `pip install -e "..\Fluid Dynamics"` works |
| 4 | Create venvs (§2.7), kernel `aofd-venv`; install data stack; check cartopy/gsw import on Windows | imports OK |
| 5 | Adapt tools: offset 20, `book.yaml` (§3) via `detect_chapters.py`; `split_pdf.py` all chapters; render notation pages | `chapters/ch01.txt` … `ch22.txt` exist, openers verified |
| 6 | Rewrite `CLAUDE.md` (Vallis rules = fluidpy rules + §8 contracts + §7 safety), skills (§5), agents (§4); `.claude/settings.json` + hook scripts (§7); `git config core.hooksPath .githooks` | hooks fire on a test write |
| 7 | `tools/kundu_index.py` → `knowledge/kundu_index.yaml`; seed `symbols.yaml`, `glossary.yaml`, `CUMULATIVE.md` (Kundu summary + Vallis start), `notation.md` crosswalk | index has every Kundu explainer and section anchor |
| 8 | Build `assets/viz3d.js` per R2 §8.5 (Viz3D on three 0.186.1, import map, lazy/dispose/context-loss/audit, `Viz.proj3` promoted), `make_luts.py`, `make_coast.py`; extend `viz_inline.py`, `viz_lint.py`, `shot.py --3d`, `new_viz.py --3d` | `templates/viz_example_3d.html` (old r128 path) still PASS; new templates PASS |
| 9 | Movies toolchain (§2.7), `tts.py`, `movie_qa.py`, `publish_movie.py`, house components | `npx remotion render` of an empty composition exits 0 |
| 10 | Machinery self-tests: `pytest tests/test_machinery.py`, `shot.py templates/viz_example.html`, `pipeline_selftest.py` | all PASS |
| 11 | **Proof-of-concept gate** (below) — stop and ask the user to approve | user says go |
| 12 | User creates `shammun/aofd` + Pages and `shammun/aofd-media` + Pages (§13) | remotes exist |
| 13 | `/do-chapter 0` (full pipeline, 14 explainers, figures, then `/make-movies 0`) | Chapter 0 page live; movies after approval |

**Proof-of-concept gate (step 11)** — each item built through the real agents and tools, not by hand:

| PoC | What | Pass |
|---|---|---|
| A | Ch. 0 E01 `vector_products_lab` — **a 3-D primer explainer in the Kundu format**: `Viz.app` layout, linked 3-D + 2-D views, presets, transport, walkthrough, Explain with numbered sections, Derivation tab (a·b = |a||b|cos θ from components; |a×b| = area), Code tab, quiz, parity vs `fluidpy.geo` functions | lint + `shot.py --3d` PASS at 8 sizes; viz-reviewer compares with `rossby_waves`/`geostrophic_adjustment` and PASSes; fallback works with WebGL disabled |
| B | `templates/viz_example_globe.html` — Coriolis on a rotating globe with the cross-product glyph and where-from/where-to probe (the scene kit for Ch. 2/21) | parity rows (inertial vs Earth-frame path vs `fluidpy.core.rotating`), drawing invariant (result ⟂ inputs), context-loss restore |
| C | Fig. 21.23 Southern Ocean currents/fronts map (R3 §3.1) from Natural Earth + Orsi fronts + our polylines, with GDP-drifter twin panel and a reading card | front latitudes checked; private side-by-side reviewed; credit line |
| D | 20-s Coriolis test clip (R1 §4.4, all 8 steps) | `movie_qa.py` PASS; movie-reviewer PASS; plays with captions in a test page |
| E | Colab smoke: a stub notebook whose setup cell installs `fluidpy@v0.3.0` and loads a derived product | runs on Colab with no keys |
| F | Standalone scene `scenes/ch00/the_500hPa_surface.html` (§15.1) with real NCEP R1 heights, fetched through `fluidpy.data.fetch()` and the disk guard (§15.2) | `shot.py --3d` PASS; disk report printed; viz-reviewer PASS |
| G | A Chapter 0A sample block in the informal voice (Kundu B.3 dot product): friendly text → exact statement → number → from-scratch code + fluidpy call + assert | lesson-reviewer PASS on voice and completeness |
Record render times, sizes, GPU vs SwiftShader, and the user's verdict on look, voice and depth in
`knowledge/viz_patterns.md` and `knowledge/movie_patterns.md`.

---

## 13. User-only actions and open questions

### 13.1 Things only the user does (run with a leading `!` in Claude Code where shown)

| When | Action |
|---|---|
| Before step 9 | `! claude plugin marketplace add remotion-dev/claude-code-plugin` and `! claude plugin install remotion@remotion`; `! winget install --id Gyan.FFmpeg -e` if the classifier blocks it |
| Before publishing movies | email `hi@remotion.dev` to confirm the individual/educational licence (R1 §2) |
| Before step 13 | `! gh repo create shammun/aofd --public --source . --remote origin --push --description "Vallis's Atmospheric and Oceanic Fluid Dynamics learned through Python, 3-D explainers and movies"` then `! gh api -X POST repos/shammun/aofd/pages -f "source[branch]=main" -f "source[path]=/"` |
| Same | `! gh repo create shammun/aofd-media --public --description "Movies for shammun.github.io/aofd"` then clone it to `..\AOFD Media`, and `! gh api -X POST repos/shammun/aofd-media/pages -f "source[branch]=main" -f "source[path]=/"` |
| Before Ch. 12–13 (first keyed data) | Copernicus CDS account, accept the ERA5 licences, put the token in `%USERPROFILE%\.cdsapirc`; NASA Earthdata account (+ authorise GES DISC and PO.DAAC), credentials in `%USERPROFILE%\_netrc` or env vars; on Colab: Secrets `CDSAPI_KEY`, `EARTHDATA_USERNAME`, `EARTHDATA_PASSWORD` |
| Each movie | watch the draft, then `/approve-movie N slug` (or give fixes) |
| Optional | YouTube mirror (manual upload with the SRT) |

### 13.2 Open questions (each with a recommended default) — **Q1–Q10 defaults accepted by the user (§15.3); Q11–Q12 in §15.3 still open**

1. **Repo names** `shammun/aofd` + `shammun/aofd-media`? — *Default: yes.*
2. **Narration voice** (Kokoro `af_heart` vs a British voice) and speed? — **Answered 2026-10-20: Kokoro `af_bella` (American, female), speed 1.0.** Cloning the user's own voice (e.g. Chatterbox) stays an option to test later.
3. **Movies per chapter**: one overview always, up to three only where concept groups clearly differ? — *Default: 1 for
   short chapters (3, 4, 10, 11), 2 for the rest, 3 only for Ch. 0, 17, 21.*
4. **Chapter 11 movie**: merge with Ch. 12 (turbulence → jets) instead of its own? — *Default: merge.*
5. **K-recap length**: full CORE-depth re-teaching only at first Vallis use (later short)? — *Default: yes; if a
   chapter's notebook runtime exceeds 6 min, move K derivations into a collapsible block, never drop them.*
6. **Tier-A cap** stays 12–18 with K-recaps uncounted? — *Default: yes.*
7. **viz_lib fork**: AOFD owns its copy and back-ports generic fixes to fluidpy only when a Kundu page needs them? —
   *Default: yes; unify later in the book-kit (§14).*
8. **Pseudo-data tolerance**: is a labelled pseudo-data figure acceptable for the few figures with no open source
   (e.g. lab pipe spectra 11.4, aircraft spectra 12.9 — R3 offers model/reanalysis substitutes first)? — *Default:
   substitute first, pseudo only as last resort.*
9. **Keyed data timing**: create CDS/Earthdata accounts now, or when Ch. 12 needs them? — *Default: now (the Ch. 0
   reading cards only need anonymous sources, but it removes a later block).*
10. **Content licence**: MIT for code as fluidpy; CC BY 4.0 for notebook prose, explainers' text and movies? —
    *Default: yes.*

---

## 14. Future-books kit

After Vallis Chapter 3 (when the pipeline has run on four chapters including heavy 3-D and data), extract the
book-independent parts:

| Piece | Form | Contents |
|---|---|---|
| `bookkit` Claude Code plugin (`shammun/bookkit`, `.claude-plugin/plugin.json`) | agents, skills, commands, hooks | the 23 agents with book-specific text replaced by references to `book.yaml` and a generated `book-context` skill; teaching-style, interactive-viz, viz3d, figure-reproduction, open-data, motion-graphics, from-scratch-code, cross-book-continuity (generalised to "previous books" via each book's `*_index.yaml`) |
| `bookkit-tools` (pip) | Python | split/render PDF, nbkit, coverage/embed/public/size checks, shot, publish, site, movie QA, TTS, data registry tools |
| `viz-engine` (tagged GitHub repo served from jsDelivr) | JS/CSS | `viz_lib.js`, `viz3d.js`, base CSS, templates; books inline a pinned version |
| Template repo `shammun/book-template` | repo | folder skeleton, `.gitignore`, settings with hooks, `book.yaml` stub, `/setup-project` that fills it from a PDF outline |

A new book = a sibling folder (`Climate Dynamics PHD/<Book>/`), `git init`, install the plugin, copy the template, put
the PDF in, `/setup-project`, approve a PoC, then `/do-chapter 0…`. Each book gets its own public repo; `fluidpy` keeps
growing (GFD → climate modelling → ML for climate), and each new book's continuity index points back to every earlier
book's site.

---

## 15. Revision 2026-10-20 — user decisions and additions

### 15.1 Standalone three.js 3-D scenes (in every chapter, not only Chapter 0)

There are now two kinds of 3-D, both made by `viz3d-builder` and wired in by `viz-integrator`:

| Kind | Where | What it is |
|---|---|---|
| 3-D **view inside an explainer** | `viz/chNN/<slug>.html` | §8.2: the Kundu app layout, with three.js as one linked view or tab |
| **Standalone 3-D scene** | `scenes/chNN/<slug>.html` | A full-window cinematic three.js page about one concept (details below) |

A standalone scene has:
- a guided camera tour with timed caption cards ("what you are looking at");
- play, pause and step, plus a few sliders;
- a slim side panel with a plain-words explanation and the one key equation, written out with its number;
- a provenance chip (*data* / *model* / *schematic*) and a "not to scale" badge where exaggerated;
- links to the notebook section, the explainer and the movie.

Rules:
- **Budget:** standalone scenes don't count toward the explainer cap. A chapter has 0–4 of them (Chapter 0 up to 6,
  §9.1). The curator picks them where an immersive view teaches something an explainer can't: the global
  circulation, overturning pathways (Figs. 21.6 and 21.30), polar-vortex isosurfaces (Figs. 17.22–17.23), gyres on a
  globe, the ENSO thermocline.
- **Same quality machinery:** built on `assets/viz3d.js` (R2 §8). Physics shown in a scene mirrors a tested fluidpy
  function with selftest parity rows. Audit with `shot.py --3d` (non-blank canvas, GL flags, all sizes, works with
  reduced motion and has a fallback when WebGL is disabled). Then a `viz-reviewer` pass with the 3-D checklist (R2).
- **Integration:**
  - each scene is embedded full-window in the chapter notebook, Colab and page next to its CORE block;
  - it gets a card on the chapter landing page and an entry in a site-wide `scenes/index.html` 3-D gallery;
  - it is listed in `book.yaml → chapters[N].scenes`.
- **Pipeline:** phase 7 runs scene builders in parallel with the explainer builders. Each builder writes one file;
  the `max_parallel_viz` limit still applies.
- **Reuse:** scenes and movies share scene modules (the same globe, tank and column code feeds `@remotion/three`).

### 15.2 Disk-space guard for data, renders and caches

Measured on 2026-10-20: drive **C: 952 GB, 99 GB free (90 % used)**. All bulky outputs live on C:, so space is managed
automatically.

| Rule | Value |
|---|---|
| **Free-space floor** | Never let free space on C: drop below **40 GB**. A download, render or install that would cross it doesn't start. |
| **Data-cache cap** | The raw-data cache (`AOFD Data/raw/`, outside the repo) ≤ **25 GB**. Derived products ≤ 2 GB (committed part ≤ 150 MB, R3 §4). |
| **Other budgets** | Movie render scratch ≤ 10 GB, deleted after a movie passes QA. `reports/viz` screenshots are pruned to the latest run. Node, Remotion and Playwright caches are checked monthly. |
| **One door for downloads** | Every download goes through `fluidpy.data.fetch()`, which calls `tools/disk_guard.py`. That script estimates the size (HTTP `Content-Length`, the registry's size, or the subset size for zarr/OPeNDAP), checks the floor and the cap, and logs the result. No raw `curl`/`wget` for data; a PreToolUse hook warns on them. |
| **Download less** | Prefer server-side subsetting (OPeNDAP or zarr slices for the needed levels, dates and region) over whole files. Reduce to the derived product straight away, then the raw file becomes evictable. |
| **Eviction (only when needed)** | If a new download doesn't fit, evict least-recently-used **raw files that the registry tracks and that already have their derived product saved** (so they can be downloaded again). Never delete derived products, anything outside the cache folder, or any file the user made. Every eviction is logged in `data/evictions.log` with size and date. |
| **Reporting** | Every data step and every `/do-chapter` summary prints **free space before and after**, the cache size, and anything evicted. `/status` shows the same. |
| **Escalation** | If the floor would be crossed even after eviction, stop and ask the user. Suggest what could be cleaned (largest caches, old renders) without deleting it. |

`data-scout` and `motion-builder` must follow this. `site-publisher` also checks repo and Pages size budgets (R3 §4).

### 15.3 Decisions log (user, 2026-10-20)

- **Open questions §13.2 Q1–Q10:** the user accepted the recommended defaults ("I will go most of your suggestion").
  The user may still override any of them.
- **Chapter 0** is the three-part "Start here" chapter of §9.1. It includes **all of Kundu Appendix B**, expanded, plus
  climate basics (vorticity, potential vorticity, geopotential height and more) and map reading. It uses the informal
  blog-like voice and has its own 3-D explainers, standalone scenes and several movies.
- **Standalone three.js scenes** in all chapters (§15.1).
- **Data downloads are approved**, under the disk guard (§15.2).
- The user wants to be **kept informed at each step**, especially about downloads and disk use.
- **Precedence:** where earlier sections still say "Chapter 0 = 14 explainers, 3 movies" (§3 `book.yaml` ch0 entry,
  §4, §6, §12 step 13), §9.1 and this section win. The setup session updates `book.yaml` ch0 to three parts with their
  explainers, scenes and movies.
- **Q11 (answered 2026-10-20):** for Chapter 0 the explainer numbers apply **per part** (0A, 0B, 0C), with **about
  12 explainers per part as a soft target, not a hard cap**. The curator may go above or below it when the ideas need
  it, and says why in the curation document. Tools treat the count as a warning, not a failure, for Chapter 0.
- **three.js 3-D placement (user, 2026-10-20):** a 3-D view may sit inside an explainer, **or** be a standalone
  full-window page when the scene is dense or carries a lot of information. The designer decides per idea, and links
  both ways (explainer ↔ scene). This confirms §15.1.
- **Software installed (2026-10-20, before the setup session):** see §15.8.
- **Q12 (answered 2026-10-20):** make **M0-1 to M0-3 first**; the user watches them and gives feedback, then M0-4 to
  M0-6 are made with that feedback built in.

### 15.4 Data location: drive G: (user decision, 2026-10-20)

- **All downloaded data lives on `G:\Geophysical Fluid Dynamics`.** This covers raw downloads, reduced and derived
  products, and the movie render scratch area. On 2026-10-20, G: had 4.6 TB with **590 GB free (88 % used)**; the
  folder exists and is empty. Layout: `G:\Geophysical Fluid Dynamics\aofd-data\{raw,derived,scratch,logs}`.
- **The analysis code lives in the repo.** `fluidpy.data` and `figs/chNN/*.py` read from G: through one setting,
  `book.yaml → data.root: "G:/Geophysical Fluid Dynamics/aofd-data"`. The environment variable `AOFD_DATA_ROOT`
  overrides it, and on Colab the default is `/content/aofd-data`. No absolute paths appear anywhere else.
- **Disk guard (supersedes the location and limit rows of §15.2):**
  - G: keeps a **floor of 50 GB free**, and the project's data stays under a **cap of 150 GB**.
  - C: keeps its **40 GB floor** for the environments, Node and Remotion, Playwright and the repo.
  - Every download, render or install reports free space on **both drives** before and after.
  - Eviction rules are unchanged: only registry-tracked raw files that can be downloaded again and already have their
    derived product saved.
- **If G: is missing** (for example an unplugged external drive), `disk_guard.py` stops with a clear message. It never
  falls back silently to C:.
- **Small derived products** needed by Colab and the website (each ≤ 10 MB, ≤ 150 MB in total, redistributable only)
  are copied from G: into the repo's `data/derived/`.

### 15.5 Chapter 0A covers Kundu Appendix B completely, item by item

The source is saved privately as `_private/Kundu_AppendixB_Mathematical_Tools.pdf`: 12 pages, Kundu PDF pp. 884–895,
printed pp. 857–868. It is git-ignored and never published. Equations are transcribed from its rendered page images.
Every item below gets the Chapter 0 treatment:
- a friendly explanation;
- the exact statement with the equation written out and its number, e.g. (B.3.9);
- the derivation or proof one small move at a time;
- a tiny worked number;
- **from-scratch Python** (numpy and/or sympy, every line commented), then the fluidpy call (`fluidpy.core.operators`,
  `curvilinear`, `index_notation`, `integral_theorems`, plus new `fluidpy.geo.vectors` and `fluidpy.geo.sphere`) and an
  `assert` that they agree;
- a figure, explainer or 3-D view where it helps;
- a pointer to where Vallis uses it.

| Kundu App. B item | What Chapter 0A teaches and codes | Where Vallis needs it |
|---|---|---|
| **B.1** partial derivative; mixed partials commute | slicing a surface; ∂²f/∂x∂t = ∂²f/∂t∂x checked numerically and symbolically | everywhere |
| total derivative along a path (the unnumbered display before B.1.1) | a hiker's thermometer on a path through a temperature field | §1.1 |
| (B.1.1)–(B.1.4) material derivative, component, vector and index forms; (B.1.2)–(B.1.3) particle-velocity matching | the balloon riding the wind; the three notations side by side; when total = partial | §1.1 |
| (B.1.5)–(B.1.8) first-order PDE and the **method of characteristics** | curves in x–t along which the PDE becomes an ODE | advection, waves (ch. 6–7) |
| Example B.1, (B.1.9)–(B.1.16): advection with speed U(t) | solve it by characteristics; animate the travelling shape; check with a numerical solver; Kundu's two lessons (integrate rather than differentiate; difficulty moves, it doesn't vanish) | tracer advection, ch. 13 |
| integrating a partial derivative: "constants" become functions | ∫(Ax + By) dx = Ax²/2 + Bxy + C(y, z, t) | thermal wind integration (§2.8) |
| **B.2** (B.2.1) changing independent variables by the chain rule | general coordinate change; Jacobian picture | pressure and isentropic coordinates (§2.6) |
| Example B.2, (B.2.2): moving (Galilean) frame | why ∂/∂t picks up −U·∇ in a moving frame | Doppler shift, waves on a mean flow (ch. 6, 10) |
| (B.2.3) combination or similarity variable | collapsing a PDE to an ODE | boundary layers, Ekman |
| Example B.3: η = x tᵃ | worked derivatives; diffusion similarity solution coded | diffusion, ch. 13 |
| **B.3** ∇ as a vector operator; order matters, (u·∇) ≠ (∇·u) | a "derivative arrow" that acts on what follows it | everywhere |
| Cartesian ∇, gradient, divergence, curl (as a determinant) | each one computed by hand, with numpy finite differences, sympy and fluidpy | everywhere |
| **identities (B.3.1)–(B.3.13), all 13** | each one *proved* (index notation, step by step), *checked* in sympy, *checked numerically* on a random smooth field, and *pictured* where possible: ∇·x = 3, ∇×x = 0, ∇·(x/\|x\|³) = 0 (away from 0), (u·∇)x = u, product rules (B.3.5)–(B.3.7), ∇·(u×F) (B.3.8), ∇(u·F) (B.3.9, giving (u·∇)u = ∇(u²/2) − u×ω), ∇×(u×F) (B.3.10), ∇×∇ρ = 0 (B.3.11), ∇·(∇×u) = 0 (B.3.12), ∇×(∇×u) = ∇(∇·u) − ∇²u (B.3.13) | vorticity equation (ch. 4), Bernoulli, PV derivations |
| Gauss's theorem for scalars and vectors; Stokes's theorem | flux boxes and tiling; circulation loops; numerical verification on a cube and a disc | budgets, circulation theorems (ch. 4) |
| **B.4** Dirac delta as the limit of narrowing Gaussians (B.4.1) | animate σ → 0 with area fixed at 1 | point sources, Green's functions |
| properties (B.4.2)–(B.4.4), the 3-D delta, the clash with δ as a thickness | sifting checked numerically | |
| Example B.4 | worked integral, coded | |
| **B.5** Cartesian, cylindrical, spherical: position, unit vectors, **how unit vectors change with position**, ∇ operator, surface and volume integrals (area and volume elements) | 3-D explainer E10: unit vectors turning as you move; R dφ, r sin θ dφ, r² sin θ elements derived from small boxes; integrals checked numerically (sphere area, ball volume) | spherical equations (§2.2) |
| **B.6** plane polar, cylindrical, spherical: gradient, scalar Laplacian, divergence, curl/vorticity, vector Laplacian, strain rate and viscous stress, continuity, Navier–Stokes | every operator derived from B.5 rather than memorised; the "extra" metric terms (u_φ²/r, u_r u_θ/r, cot θ terms) explained as unit vectors turning; all coded and checked against sympy's vector module | spherical primitive equations, metric terms, thin-shell approximation (§2.2) |
| *bridge to Vallis* (added) | colatitude θ (Kundu) vs latitude φ (Vallis): the substitution and its sign changes; Earth-radius thin-shell approximation r ≈ a | §2.2–2.3 |

Plus the extra 0A tools from §9.1 (Taylor and linearisation, complex exponentials and waves, Fourier, ODE basics,
scaling and nondimensional numbers). **Coverage check:** `tools/coverage_check.py` gets an `--appendix-b` list of every
item above and fails if any is missing from `ch00a`.

### 15.6 Chapter 0B — the full list of climate and GFD basics

The short list in §9.1 was only a sketch. This is the full inventory. The curator tiers it (A = full block with
explainer or 3-D; B = stated and explained with a number; C = glossary line plus a pointer to the Vallis chapter that
develops it). Every item gets a plain-words explanation, and every formula gets code.

| Group | Concepts |
|---|---|
| 1 · The planet and its fluids | Earth's size and rotation; the atmosphere's layers (troposphere, tropopause, stratosphere and above); the ocean's layers (mixed layer, thermocline, deep and abyssal ocean); the **thin-shell** aspect ratio; weather vs climate; typical space and time scales of each |
| 2 · Why anything moves: energy | Sunlight and the latitude-dependent heating; outgoing infrared and the greenhouse effect (in brief); the energy imbalance between tropics and poles; poleward heat transport by atmosphere and ocean; the circulation as a heat engine |
| 3 · State of air | Pressure (hPa) and what it measures; temperature; density; ideal-gas law; **hydrostatic balance**; scale height; **geopotential and geopotential height**; thickness and the hypsometric equation; pressure as a vertical coordinate; lapse rate (Kundu Γ = dT/dz and meteorological Γ = −dT/dz, both shown); dry adiabatic lapse rate; **potential temperature** |
| 4 · Water in the air | Specific humidity and mixing ratio; saturation and Clausius–Clapeyron (≈ 7 % per K); relative humidity; latent heat; moist adiabats; **equivalent potential temperature**; clouds and precipitation (in brief) |
| 5 · State of seawater | Temperature, salinity (g/kg), density; the nonlinear equation of state (cold water is less sensitive); potential temperature and **potential density**; σ notation (σ = ρ − 1000); **isopycnals**; water masses (named) |
| 6 · Stability | Buoyancy; the parcel argument; stable, neutral, unstable; **N²** and buoyancy oscillations; convection; inversions |
| 7 · Rotation | Rotating frames; centrifugal force and effective gravity; the **Coriolis effect**; f = 2Ω sin φ; **β**; inertial oscillations; **Rossby number**; **Rossby radius of deformation** |
| 8 · Balances | **Geostrophic** balance and wind; highs and lows, cyclonic and anticyclonic sense in each hemisphere (Buys-Ballot); gradient and cyclostrophic wind; **thermal wind** |
| 9 · Spin | Circulation; **vorticity** (relative, planetary, absolute); **potential vorticity** (shallow-water and Ertel forms; units, PVU); PV conservation; isentropic surfaces; PV maps as weather maps |
| 10 · Waves | Gravity waves; Kelvin waves; **Rossby (planetary) waves**; equatorial waves; dispersion; phase vs group velocity |
| 11 · Instability and eddies | **Baroclinic instability** as the birth of storms; eddies vs the mean flow; turbulence and cascades (in brief) |
| 12 · Friction and boundary layers | Wind stress and its curl; the **Ekman layer**, Ekman transport, Ekman pumping and suction; coastal and equatorial upwelling |
| 13 · Atmospheric circulation | **Hadley**, Ferrel and polar cells; trade winds; ITCZ; monsoons (in brief); westerlies; subtropical and eddy-driven **jet streams**; storm tracks; stationary waves; Walker circulation |
| 14 · Stratosphere | Brewer–Dobson circulation; **polar vortex**; sudden stratospheric warmings; **QBO** |
| 15 · Ocean circulation | **Sverdrup balance**; subtropical and subpolar **gyres**; **western boundary currents** (Gulf Stream, Kuroshio, Agulhas); the Antarctic Circumpolar Current and Southern Ocean fronts; the **overturning circulation** (AMOC, "thermohaline"), deep-water formation and upwelling; **El Niño / ENSO** and the thermocline tilt |
| 16 · Units and measures | Sverdrup (10⁶ m³/s), hPa, K and °C, g/kg, PVU, W/m², day vs sidereal day |
| 17 · Data and averaging words | Observation, satellite retrieval, **reanalysis**, ocean **state estimate**, model/GCM; climatology, **anomaly**, composite; **zonal mean**; mean vs eddy (Reynolds averaging); a first look at EP flux and the residual circulation (pointer only) |

The A items (about 18) map onto explainers E15–E24, the Chapter 0 standalone scenes and movies M0-1 and M0-2. The rest
become B or C items, mechanism cards (R4 §4) or glossary entries (R4 §5), so **nothing in this table goes unexplained**.

### 15.7 What the proof-of-concept (§12, PoC A–G) is and is not

The PoC is a **generic setup test** of the machinery. It builds one sample of each *kind* of product (a 3-D explainer,
a globe scene, a real-data map, a movie clip, a Colab run, a standalone scene, a block written in the informal voice),
so the user can approve the look, voice and quality before any full chapter runs. **It is not the content of Chapter
0.** Chapter 0's content is §9.1 together with §15.5 (all of Kundu Appendix B) and §15.6 (the full climate-basics list).
`/do-chapter 0` produces it after the PoC is approved.

### 15.8 Done before the setup session (2026-10-20, from the Kundu session)

The setup session (§12) **skips** these steps. It verifies them and builds on them.

| Item | State |
|---|---|
| §12 step 3 (part) | `../Fluid Dynamics/pyproject.toml` committed locally in fluidpy (`bd249b9`, not pushed); extras `[geo,data,diag,dev]`; `*.egg-info/` ignored. Still to do: empty `geo/ data/ diag/` packages, tag `v0.3.0`, push. |
| §12 step 4 | `.venv` (Python 3.12.1): requirements-dev + requirements-data + xgcm, copernicusmarine, **pydap**, keyring; fluidpy editable. Kernel `aofd-venv` registered. fluidpy ch05/ch07/ch13 tests pass on it (358 passed, numpy 2.5.4). |
| OPeNDAP on Windows | netCDF4 1.7.5's bundled curl fails TLS ("Problem with the SSL CA cert"); no rc file or env var fixes it. **Remote OPeNDAP reads use `xr.open_dataset(url, engine="pydap")`.** `fluidpy.data` must default to pydap for `https://…/dodsC/…` URLs on Windows. |
| §12 step 9 (part) | `.venv-tts`: Kokoro 0.9.4 + CPU torch + soundfile (espeak-ng bundled via `espeakng-loader`; the winget espeak-ng is not needed). About 2× real time on CPU. Voice **af_bella**, speed 1.0 (user choice). Remotion 4.0.537 packages + headless shell installed in `movies/`; ffmpeg 9.0.2 on PATH. Still to do: the Remotion Claude Code plugin (user), `tts.py`, `movie_qa.py`, `publish_movie.py`. |
| Data root | `G:\Geophysical Fluid Dynamics\aofd-data\{raw,derived,scratch\movies,logs,cache\{cartopy,pooch}}`; user env vars `AOFD_DATA_ROOT` and `CARTOPY_DATA_DIR` (cartopy's Natural Earth cache on G:). |
| Data accounts | **CDS** (new token; ERA5 single-level and pressure-level monthly requests tested OK) and **NASA Earthdata** (login, GES DISC + "PODAAC app cumulus" approved; a real ECCO file and a MERRA-2 range read tested OK). Copernicus Marine skipped (optional). |
| Credentials | Working files in `%USERPROFILE%` (`.cdsapirc`, `_netrc`, `.netrc`) plus an encrypted copy in Windows Credential Manager, service `aofd` (`tools/secrets_vault.py save/list/colab/restore`). `tools/setup_credentials.py` writes both. Never in a repo, notebook, report or memory file. |
| Secret guard | `tools/check_secrets.py` (stdlib only) + `.githooks/pre-commit` (`--staged`) + `.githooks/pre-push` (`--push`) in **both** repos, and a credential/root-screenshot block in both `.gitignore`s. Tested: it blocks real token/password values, `key:` UUIDs, netrc lines, credential files and root screenshots, also on push after `--no-verify`. **The setup session keeps these hooks** (it runs `git config core.hooksPath .githooks`), chains `check_public.py` after `check_secrets.py --push`, and lists `check_secrets.py` in the `.claude/settings.json` hook docs (§7). |
| Tools added | `tools/check_data_access.py` (one-line OK/NEEDS LOGIN/FAIL per source, disk report), `tools/voice_samples.py`, `tools/build_guide_docx.py` (copied from fluidpy). |
| User guides | `WORKFLOW_GUIDE.md/.docx` (whole workflow, every phase) and `CREDENTIALS_GUIDE.md/.docx` (the three accounts, vault, protection). |
