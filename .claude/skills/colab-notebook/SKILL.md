---
name: colab-notebook
description: How the per-chapter notebook, its Colab twin and its web page are built, executed and published in AOFD (Vallis) - notebooks/build_chNN.py with tools/nbkit.py (incl. the AOFD blocks kundu_recap, scratch_vs_lib, mechanism, reading_card, anatomy, magnitude_table, movie, figure), the setup cell that installs the pinned fluidpy tag on Colab and needs no keys, the data root, cell tags, FAST runs, headless execution on the aofd-venv kernel, what tools/publish_notebook.py produces, public-repo safety and the Colab save hazard. Load when creating, fixing or publishing any .ipynb.
---

# colab-notebook — one notebook, three deliverables

Chapter 0 has **three** notebooks (`ch00a_maths`, `ch00b_climate_basics`, `ch00c_reading_maps`), each with its own Colab
twin and page, under one chapter landing page. Every other chapter has one.

## 1. Build with code, never by hand
`notebooks/build_chNN.py` (committed) uses `tools/nbkit.py`:
```python
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "tools"))
from nbkit import ChapterNotebook

nb = ChapterNotebook("ch07")
nb.title(big_idea="…", roadmap=["…", "…"], prerequisites=["Bernoulli (Ch. 4)", "potential flow (Ch. 6)"])
nb.explainer_index([("dispersion_relation", "Why long waves outrun short ones", "phase vs group speed"), …])   # 5–10 rows
nb.setup()                                          # ⚙️ setup markdown + the setup code cell (tag: setup)
nb.section("7.2", "Linear surface waves", intro="**What is this section about?** …")   # one per book section
nb.recap("R02", "Bernoulli's equation", "…one paragraph…", where="Ch. 4 §4.9")        # RECAP tier
nb.core("C03", "The dispersion relation", question="Why do long waves travel faster than short ones?")   # CORE block
nb.md("#### The problem in plain words\n…")
nb.primer("tanh(x)", "A smooth step: ≈ x for small x, → 1 for large x. Here it switches between shallow and deep water.",
          code="import numpy as np                 # numbers\nprint(np.tanh([0.1, 1, 5]))          # [0.0997 0.7616 0.9999]")
nb.derivation("D03", "Where the dispersion relation comes from", ref="7.36",
              goal="Find how the frequency of a small surface wave depends on its wavelength and the depth.",
              start=(r"\nabla^2\phi = 0", "the flow under the wave has a velocity potential"),
              plan=["Try a wave-shaped potential.", "Apply the bottom and surface conditions.", "Eliminate the amplitude."],
              uses=["separation of variables (primer above)", "tanh (primer above)"],
              steps=[dict(did="Try a wave-shaped potential", tex=r"\phi = f(z)\cos(kx - \omega t)",
                          why="Allowed because Laplace's equation is linear; we choose this form because the surface is a travelling cosine.",
                          plain="Every depth moves with the same wave shape, just with a different strength f(z)."),
                     …],                                   # one small move per step, never "it can be shown"
              result=(r"\omega^2 = gk\tanh kH", "long waves feel the bottom; short waves do not"),
              interpret="…", check="units: both sides 1/s²; deep limit tanh → 1 gives ω² = gk",
              check_src="import sympy as sp   # symbolic check of the last steps\n…")   # required for ★★★
nb.worked_example("a 10 m wave in 2 m of water", "1. k = 2π/10 ≈ 0.63 m⁻¹ …")
nb.code("""
from fluidpy import ch07_gravity_waves as ch07      # the tested chapter module
omega = ch07.omega(k, H)                            # Eq. (7.36): frequency for wavenumber k in depth H
""", explain="1. … 2. …")
nb.figure("…plotting code, every line commented…", see="…", read="…", change="…")   # at least one visual per CORE block
nb.explainer("dispersion_relation", heading="Why long waves outrun short ones", why="…", tries=["Drag H…", "…"])
nb.note("The deep-water limit is the same relation with tanh → 1.", equation=r"\omega^2 = gk", ref="7.xx")   # NOTE
nb.animation("…"); nb.plotly("…"); nb.live("…"); nb.check_agree("…")
nb.pointer("Nonlinear shallow-water waves are only mentioned here; Ch. 13 returns to shallow water.")  # SKIP
nb.summary(clicked=["one line per CORE idea"], feeds_forward=["…"], left_out=["… (where to find it)"])
nb.save()                                           # → notebooks/ch07_gravity_waves.ipynb (no outputs)
```
**AOFD blocks** (PLANNING §8.1; skills `cross-book-continuity`, `from-scratch-code`, `teaching-style`):
```python
nb.kundu_recap("K03", "Thermal wind", kundu="ch13 §13.5", urls={...}, crosswalk=[("θ (colatitude)", "ϑ (latitude)", "cos θ = sin ϑ")], ...)
nb.scratch_vs_lib("2.12", scratch="...one operation per line, every line commented...",
                  lib="fluidpy.geo.balance.geostrophic_velocity(...)", rtol=1e-12, why_rtol="same closed form")   # tag eq:2.12
nb.anatomy(r"f\hat{\mathbf z}\times\mathbf u_g = -\nabla p/\rho_0", terms=[("Coriolis", "violet"), ("pressure gradient", "orange")])
nb.magnitude_table({"Coriolis": 1e-3, "pressure gradient": 1e-3, "advection": 1e-4}, dominant="geostrophic", ratio=("Ro", 0.1))
nb.mechanism("Coriolis", story=..., picture=..., equation=..., number=..., misconception=..., where_next=...)   # 🌍
nb.reading_card("fig_21_23", what=..., axes=..., encoding=..., feature=..., physics=..., source=...)        # 🗺️ before interpretation
nb.figure("figs/ch21/fig_21_23.py")                  # runs make(); caption + credit line from the registry
nb.movie("ch02_coriolis")                            # only once the movie is approved (published)
nb.scene("the_500hPa_surface")                       # standalone 3-D scene, full-window block
```
At the end of each book section: the **equation-code ledger** (eq → cell tag → status), checked by `coverage_check.py`.
`save()` refuses to write the notebook when a book section has no `nb.section(...)`, a CORE/RECAP id from the curation
has no block, a CORE block has no code or no visual, a derivation (D id) is missing, sits in the wrong CORE block, has a
step without why / in words, or is ★★★ without a sympy check, or the explainer count is outside 5–10. After executing,
`tools/coverage_check.py chNN --nb outputs/chNN/executed.ipynb` repeats the checks on real outputs and checks the
prerequisite ledger (design Part E).
Markdown is our own words; equations in LaTeX with their book numbers. Physics lives in `fluidpy/`, never only in a cell.

## 2. The setup cell (written by `nb.setup()`; identical in every chapter)
**Colab:**
```python
!git clone -q https://github.com/shammun/aofd.git /content/aofd || git -C /content/aofd pull -q
!pip install -q "fluidpy[geo,data] @ git+https://github.com/shammun/fluidpy@<library_pin>"   # pin from book.yaml
!pip install -q -e /content/aofd --no-deps
!pip install -q -r /content/aofd/requirements.txt    # only what Colab lacks (pint, cartopy, gsw, cmocean, pooch …)
os.environ.setdefault("AOFD_DATA_ROOT", "/content/aofd-data")
```
Never re-pin numpy/scipy/matplotlib (forces a runtime restart). **No keys by default**: figures load the committed
derived products in `data/derived/`; the optional refresh path (`REFRESH=True`) reads Colab *Secrets*
(`CDSAPI_KEY`, `EARTHDATA_USERNAME`, `EARTHDATA_PASSWORD`) and is flagged "local only" for heavy reductions.
Do not mount Google Drive by default.
**Local:** walk up to the folder with `book.yaml`; the data root comes from `AOFD_DATA_ROOT` (→ G:). Then
`os.chdir(ROOT)`, `sys.path.insert(0, ROOT)`, import `setup_notebook`, `show_viz`, `show_animation`, and set
`FAST = setup_notebook()` (env `FLUIDPY_FAST=1`).

## 3. Cell tags (honoured by the publish tool)
`setup` · `derivation` / `derivation-check` (step-by-step derivation and its sympy cell) · `explainer` (show_viz output → full-window block on the page, link card in the GitHub .ipynb) ·
`live-only` (ipywidgets → "run it in Colab" note on the page) · `animation` · `plotly` · `from-scratch` · `slow` ·
**AOFD:** `eq:N.M` (from-scratch + library + assert cell) · `kundu-recap` · `mechanism` · `reading-card` · `figure` ·
`scene` · `movie` · `refresh-only` (keyed data path, skipped on Colab by default).

## 4. Execute headlessly = verification
`.venv/Scripts/python.exe tools/run_notebook.py chNN [--fast] [--save]` — runs on the `aofd-venv` kernel (registered
once; it guarantees the venv interpreter, not Anaconda's `python3` kernel), prints runtime, slowest cells,
errors with the last traceback line, and outputs larger than 3 MB. Never `jupyter nbconvert` (PATH may dispatch to
Anaconda). Budget: < 6 min full run; if K derivations push a chapter past that, move them into a collapsible block, never drop
them (Q5); `FAST` for anything heavier.

## 5. Publish (`tools/publish_notebook.py chNN`, run by the site-publisher)
1. Gate: `tools/embed_check.py chNN` (explainers exist, are current, lint-clean, embedded exactly once).
2. Execute (0 errors; no `book values active` banner in any output).
3. Write `notebooks/chNN_<slug>_colab.ipynb` — outputs stripped, Colab metadata.
4. Write `notebooks/chNN_<slug>.ipynb` — **executed** (figures visible on GitHub), explainer outputs as link cards;
   data-credit footer from `data/registry.yaml`; approved movies as `<video controls preload="metadata">` blocks.
5. Write `notebooks/chNN_<slug>.html` — nbconvert lab template + site chrome (All chapters · All explainers ·
   prev/next · Open in Colab · Download .ipynb · View on GitHub · explainer cards), explainers full-window
   (`section.fp-viz`, 100 % × 100 % of the window), live-only notes, floating Contents (hidden while an explainer fills
   the screen), MathJax for markdown maths, plotly via require.js + CDN.
6. Regenerate `index.html`, `viz/index.html`, the README table (`tools/build_site.py`).
7. Audit: `tools/shot.py --page notebooks/chNN_<slug>.html`; then `tools/check_public.py`.

## 6. Public-repo safety and the Colab save hazard
- The executed `.ipynb` and the page come from the public-safe run (no private book values). `tools/check_public.py`
  fails on: any `_colab.ipynb` with outputs, the private-run banner anywhere, tracked `chapters/`, `outputs/`,
  `reports/viz/`, `tests/book_values_*`, page images.
- **Never use Colab's File → Save a copy in GitHub**: it commits outputs into `_colab.ipynb` on `main`. Save to Drive.
  If it happens: fetch, rebase, re-run `tools/publish_notebook.py chNN`, commit
  `chNN: restore outputs-stripped _colab.ipynb`, tell the user the old commit stays reachable by SHA; never force-push.

## 7. Lessons (the knowledge-keeper appends; one line each, dated by chapter)
- (machinery) `import site` inside tools resolves to the standard library module — the site builder is `tools/build_site.py`.
- (machinery) Anaconda's `python3` kernelspec can shadow the venv's; execution uses the dedicated `aofd-venv` kernel.
- (ch15) If an explainer file is newer than the executed notebook, re-execute (or re-embed) before publishing — the
  embedded `srcdoc` copy is the old one.
- (ch14) End widget cells with `_ = live(...)` so no repr and no empty output box is published.
- (ch16) `build_chNN.py` parses its arguments (argparse: `--dump`, `--help`) and builds only on an explicit command; an
  argument-less builder rebuilt the ch16 notebook when a parallel agent ran it with `--help`.
