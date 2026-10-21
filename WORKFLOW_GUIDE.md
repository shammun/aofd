# AOFD Vallis — Step-by-Step Workflow Guide

This guide walks you through the whole Vallis project in order: what is already installed, the few things only you
can do, the setup session, the proof of concept, and then **every phase of `/do-chapter N`**. For each phase it says
what happens, which agent does it, which file it writes, **what you should look at**, and what to do if something goes
wrong. `PLANNING.md` is the full technical specification. `SETUP_GUIDE.md` is the short overview. This guide is the one
to keep open while you work.

Colour code: **yellow boxes** are text you type into Claude Code exactly as written. **Grey boxes** are commands you
run in a terminal, or file contents.

## Part 1 — Where things stand (2026-10-20)

### 1.1 Installed and tested

| Item | Where | Status |
|---|---|---|
| Python 3.12 main environment | `AOFD Vallis\.venv` | book stack, climate-data stack (xarray, cartopy, gsw, metpy, cdsapi, earthaccess, copernicusmarine, xgcm, cmocean, zarr, gcsfs …) and `fluidpy` installed editable from `..\Fluid Dynamics` |
| Jupyter kernel | `aofd-venv` ("aofd (venv)") | registered |
| Narration environment | `AOFD Vallis\.venv-tts` | Kokoro 82M on CPU PyTorch; espeak-ng is bundled; about 2× real time; five sample voices made |
| Movie toolchain | `AOFD Vallis\movies` | Remotion 4.0.537, three.js 0.186.1, React 19, KaTeX, d3-geo; Remotion's headless Chrome downloaded |
| ffmpeg / ffprobe | winget (Gyan.FFmpeg 9.0.2) | on PATH |
| Git, GitHub CLI, Node 24 | system | present |
| Data folders | `G:\Geophysical Fluid Dynamics\aofd-data\{raw,derived,scratch,logs,cache}` | created |
| Environment variables | `AOFD_DATA_ROOT`, `CARTOPY_DATA_DIR` (both point to G:) | set for your user; open a **new** terminal to see them |
| `fluidpy` packaging | `..\Fluid Dynamics\pyproject.toml` | added so `pip install -e` works |
| Data-access checker | `tools\check_data_access.py` | tests every data source with a few-KB request. On 2026-10-20: **NCEP R1 (PSL), ERA5 on Google Cloud (WeatherBench 2), WOA23 (NCEI) and Natural Earth all OK** with no account; CDS, Earthdata and Copernicus Marine wait for your logins (Part 2) |
| OPeNDAP on Windows | `pydap` | netCDF4's built-in curl cannot find TLS certificates on this machine, so remote OPeNDAP reads use `engine="pydap"` |

### 1.2 Decisions recorded

- **Q11:** Chapter 0 counts explainers **per part** (0A, 0B, 0C), with **about 12 per part as a soft target**. The
  curator may go above or below it and says why. It is a guideline, not a hard rule.
- **three.js 3-D:** a 3-D view can live **inside an explainer** or, when the scene is dense, as a **standalone
  full-window page**. The two always link to each other.
- **Q12 (still open):** see section 2.4.

## Part 2 — What you do before Chapter 0 (your checklist)

Do these in order. Each takes a few minutes. Tick them off.

### 2.1 Copernicus Climate Data Store (ERA5) — needed

Your current `%USERPROFILE%\.cdsapirc` points to the **old ADS v2 address**
(`ads.atmosphere.copernicus.eu/api/v2`) with an old-style `uid:key` key. That address was switched off in 2024. It
was also the *Atmosphere* Data Store (air quality), not the *Climate* Data Store that holds ERA5.

1. Log in at **https://cds.climate.copernicus.eu** (or register; it is free).
2. Open your profile page and copy your **Personal Access Token**. It is one long code with **no** `12345:` in front.
3. Accept the licences: open the dataset pages **"ERA5 monthly averaged data on single levels"** and **"ERA5 monthly
   averaged data on pressure levels"**. Under *Download*, scroll to *Terms of use* and click **Accept**. Do the same
   for **"ERA5 hourly data on pressure levels"**.
4. Replace the contents of `C:\Users\sislam27\.cdsapirc` with these two lines (keep a copy of the old file if you
   still use ADS for something else):

```text
url: https://cds.climate.copernicus.eu/api
key: <your-personal-access-token>
```

5. Check it:

```powershell
cd "C:\Users\sislam27\Work\Climate Dynamics PHD\AOFD Vallis"
.venv\Scripts\python.exe tools\check_data_access.py cds
```

It should print `OK  cds_era5  ERA5 one-point request OK`.

### 2.2 NASA Earthdata (ECCO ocean state, MERRA-2, CERES, AIRS) — needed from about Chapter 12

1. Register at **https://urs.earthdata.nasa.gov** (free).
2. Under *Applications → Authorized Apps → Approve More Applications*, approve **NASA GESDISC DATA ARCHIVE** and
   **PO.DAAC**.
3. Create the file `C:\Users\sislam27\_netrc` (no extension) holding one line:

```text
machine urs.earthdata.nasa.gov login <your-username> password <your-password>
```

4. Check it: `.venv\Scripts\python.exe tools\check_data_access.py earthdata`

### 2.3 Copernicus Marine (optional; mean dynamic topography, altimetry)

1. Register at **https://data.marine.copernicus.eu** (free).
2. Run `.venv\Scripts\copernicusmarine.exe login` and type your username and password. The toolbox stores them in
   your user folder.
3. Check it: `.venv\Scripts\python.exe tools\check_data_access.py marine`

Keys never go into the repo. The `.gitignore` and a hook block `.cdsapirc`, `_netrc` and `.env`.

### 2.4 Two choices to make

**Narrator voice (Q2).** Listen to the five samples in `outputs\voice_samples\`: `af_heart`, `af_bella`,
`am_michael` (American) and `bf_emma`, `bm_george` (British). Pick one, and say whether the speed should be slower
(0.9) or faster (1.1).

**Q12 — how many Chapter 0 movies to make at first.** Chapter 0 has six planned movies of 2–3 minutes:

| Movie | Title | What it shows |
|---|---|---|
| M0-1 | The climate machine in three minutes | sunlight heats the tropics → Hadley cell → Coriolis → jets and storms → winds drive ocean gyres → deep water sinks |
| M0-2 | A spinning planet | Coriolis, f by latitude, geostrophic wind, highs and lows, vorticity and PV |
| M0-3 | How to read a climate map | slice the atmosphere at 500 hPa → contours → wind → colourbar and anomalies → zonal-mean section → Hovmöller plot |
| M0-4 | Arrows that multiply: dot and cross | dot product as a shadow, cross product as area and turning, f k × u |
| M0-5 | Slopes, flux and spin: grad, div, curl | hill-walk gradient, box outflow, paddle wheel, Gauss and Stokes |
| M0-6 | Riding with the flow (optional) | partial vs material derivative |

The question is: **make all six now**, or **make the first three, let you watch them and say what to change, then
make the other three** with your feedback built in? Movies are the slowest and newest product, so the recommended
answer is the second: a first batch of three.

### 2.5 Install the Remotion helper plugin for Claude Code

Type these two lines into the Claude Code prompt (the `!` runs them in the session):

```prompt
! claude plugin marketplace add remotion-dev/claude-code-plugin
! claude plugin install remotion@remotion
```

### 2.6 Remotion licence (before any movie is published)

Remotion is free for individuals. Send a one-line email to **hi@remotion.dev** saying you are an individual making
free educational videos, and keep the reply.

### 2.7 GitHub repositories (after the proof of concept is approved, not before)

```prompt
! gh repo create shammun/aofd --public --source . --remote origin --push --description "Vallis's Atmospheric and Oceanic Fluid Dynamics learned through Python, 3-D explainers and movies"
! gh api -X POST repos/shammun/aofd/pages -f "source[branch]=main" -f "source[path]=/"
! gh repo create shammun/aofd-media --public --description "Movies for shammun.github.io/aofd"
```

## Part 3 — The setup session (one time)

### 3.1 Start it

```powershell
cd "C:\Users\sislam27\Work\Climate Dynamics PHD\AOFD Vallis"
claude
```

Then paste:

```prompt
Read PLANNING.md (all sections, especially §9.1 and §15) and research/R1–R4, and WORKFLOW_GUIDE.md.
Software is already installed (WORKFLOW_GUIDE Part 1). Q11 = per part, ~12 explainers each, soft target.
Q12 = <your answer>. Narrator voice = <your choice>.
Execute the §12 build order up to the proof-of-concept gate (PoC A–G), skipping installs that are already done.
At every step tell me what you are doing and how much free space is left on C: and G:.
Stop and wait for my approval after the PoC.
```

### 3.2 What it does, and what you check

| Step | What happens | What you check |
|---|---|---|
| 1 | `git init`, `.gitignore` first | the session shows `git status`; the PDF and `_private\` must **not** appear |
| 2 | copies the Kundu machinery (agents, skills, tools, explainer library) | nothing to do |
| 3 | `fluidpy` gets empty `geo/`, `data/`, `diag/` packages, its tests run, tag `v0.3.0` | it asks before pushing to `shammun/fluidpy`: say yes |
| 4 | environment check (already installed) | imports OK |
| 5 | splits the Vallis PDF into chapters, finds the page offset | the first page of each chapter matches the book |
| 6 | writes `CLAUDE.md`, the 23 agents, the skills and the safety hooks | nothing to do |
| 7 | indexes the Kundu site for cross-links | nothing to do |
| 8 | builds the three.js 3-D kit | nothing to do |
| 9 | movie scripts (`tts.py`, QA, publish) | nothing to do |
| 10 | self-tests | all PASS |
| 11 | **proof of concept** (next part) | **you approve** |

## Part 4 — The proof of concept (one time)

You get seven samples, one of each *kind* of product. Judge the look, the voice and the depth. This is the cheapest
moment to change taste; after it, everything is mass-produced in this style.

| PoC | Open | Ask yourself |
|---|---|---|
| A — 3-D explainer (dot and cross product) | `viz\ch00\vector_products_lab.html` in a browser | Does it feel like the Kundu explainers? Can I rotate the 3-D view? Is the Explain tab clear? |
| B — Coriolis on a rotating globe | `templates\viz_example_globe.html` | Do I understand where the ball goes and why? |
| C — Southern Ocean map from real data | the figure plus its "how to read this figure" card | Does it match the science of the book's figure? |
| D — 20-second narrated movie clip | the MP4 in `movies\out\` | voice, speed, pace, captions |
| E — Colab test | the Colab link | does it run with no keys? |
| F — standalone 3-D scene, the 500 hPa surface | `scenes\ch00\the_500hPa_surface.html` | is it attractive and clear? Read the disk report. |
| G — a Chapter 0 text block (the dot product) | the notebook cell | is the informal tone right, with nothing unexplained? |

Reply in plain words, for example: *"A, B, D, E, G approved. C: make the fronts thicker. F: slower camera."* The
session records your verdict and fixes the style for every later chapter.

## Part 5 — Running a chapter: every phase of `/do-chapter N`

### 5.1 Before each chapter

1. Open a **fresh** Claude Code session in `AOFD Vallis` (memory lives in files, not in the chat).
2. Type `/status`. It shows where every chapter is, disk space on C: and G:, and which data accounts work.
3. Chapter N starts only when chapter N−1 is published and its knowledge is saved.
4. Type:

```prompt
/do-chapter 0
```

The pipeline runs by itself and reports after each phase. Your job is to **read the short reports** and spot-check
the files named below. You never have to run a phase by hand.

### 5.2 Phase 0 — preflight

**What happens:** the orchestrator checks the previous chapter is done, the environment imports, `fluidpy` is
importable, the chapter text exists, G: is connected and both disk floors are respected.

**You check:** nothing, unless it stops. If it says "G: drive not found", connect the drive and rerun.

### 5.3 Phase 1 — analyze ∥ research scout

**What happens:** the **concept-analyst** reads the chapter and renders every equation page as an image, because the
extracted text garbles maths. It writes the full **inventory** in `analysis\chNN.md`: every definition, theorem,
numbered equation (in LaTeX), example and figure. Each item is marked **NEW**, **SEEN-Vallis** or **SEEN-Kundu**
(with the Kundu id). Book numbers used as test evidence go to the private `tests\book_values_chNN.json`. At the same
time the **research-scout** collects outside material in `research\chNN_scout.md`: lecture notes, classic papers,
common misconceptions, benchmark numbers, lab movies and data sources.

**You check (5 min):** open `analysis\chNN.md`, read the summary at the top and the equation count. Spot-check two
equations you know against the book. If an equation is wrong, say so now: everything downstream copies it.

### 5.4 Phase 2 — curate, then 2b crossref

**What happens:** the **concept-curator** decides how deeply each item is taught. Coverage is complete, depth is
tiered:

| Tier | ID | Meaning |
|---|---|---|
| A · full treatment | `C01…` | the 12–18 load-bearing ideas: picture, question, step-by-step derivation, worked number, code, visualization |
| B · stated and explained | `N01…` | a paragraph, the equation and a number, inside the nearest A block |
| C · named | `N…` | one sentence and a pointer to where it is used later |
| K · Kundu recap | `K01…` | taught in Kundu; re-taught in full at its first Vallis use, with a link to the Kundu page |
| R · recap | `R01…` | taught in an earlier Vallis chapter; a short reminder |
| S · skip | `S01…` | exercises and bibliography; one pointer line |
| D · derivation | `D01…` (★–★★★) | written out one small move per step |

It also picks the **5–14 explainers** (Chapter 0: about 12 per part). For each it records why interaction beats a
static figure and whether it gets **3-D** (inside the explainer, or as a standalone scene when it is dense). It lists
the **data figures** with their dataset, and the **movie groups**. Then the **crossref-linker** writes
`analysis\chNN_kundu.md`: exact Kundu links, a symbol crosswalk (Kundu ↔ Vallis) and sign conventions.

**You check (10 min), the most valuable check:** in `analysis\chNN_curation.md`, read the **A list** and the
**explainer list**. Ask: *are these the ideas I most need to understand? Is anything I find hard missing?* Ask to move
an item up or down, or to add an explainer. Changing the plan here is cheap; changing it after Phase 7 is expensive.

### 5.5 Phases 3 ∥ 4 ∥ 4b — design ∥ implement ∥ data

These three run at the same time.

**Design:** the **lesson-designer** writes `analysis\chNN_design.md`, a cell-by-cell storyboard of the notebook. It
has every derivation written out step by step (*what we did · the line · why it is allowed · in words*), a storyboard
for each explainer and 3-D scene, the reading cards for data figures, and the **equation-code table** (each equation →
from-scratch code → library function → assertion that both agree).

**Implement:** the **concept-implementer** writes the physics as tested functions in `fluidpy` (`geo/`, `diag/`) and
the book glue in `aofd/`. Every docstring cites the Vallis section and equation, lists symbols with SI units, and
names its assumptions.

**Data:** the **data-scout** finds, licence-checks, downloads and reduces the data for each figure through the one
download door (`fluidpy.data.fetch`, with the disk guard). It saves small derived products and records them in
`data\registry.yaml`.

**You check:** the data report lists every download with its size, plus free space on C: and G: before and after.
Glance at it. For design, optionally read one derivation you find hard and see whether every step is clear.

### 5.6 Phase 5 — verify

**What happens:** the **math-verifier** proves the code right without a reference implementation. It uses an evidence
ladder: **V1** analytic solution, **V2** symbolic check (sympy), **V3** convergence, **V4** conservation, **V5**
published benchmark (e.g. RAPID 17 Sv, QBO ≈ 28 months), **V6** private book values, **V7** limits. Every A item needs
at least two levels. If a test fails, the implementer fixes the physics, up to 3 loops. **Tolerances are never
loosened to pass.**

**You check:** `reports\chNN_verification.md`, the PASS/FAIL line and any "discrepancy" note. A discrepancy usually
means a typo in the book or a sign convention; the report explains which.

### 5.7 Phases 6 ∥ 7 ∥ 7b ∥ 8 — review ∥ explainers ∥ figures ∥ notebook

The biggest phase. Up to 6 agents run at once.

| Track | Agents | Writes | Gate |
|---|---|---|---|
| Physics review | derivation-reviewer + code-reviewer | `reports\chNN_review.md` | must-fix items fixed |
| Explainers | viz-builder ×n, viz3d-builder ×m → viz-integrator → viz-reviewer | `viz\chNN\*.html`, `scenes\chNN\*.html` | lint + screenshots PASS at 8 window sizes, no scrolling |
| Data figures | figure-reproducer ×k | `figs\chNN\fig_NN_MM.py` | 2–4 published numbers checked |
| Notebook | notebook-builder → code-reviewer → lesson-reviewer | `notebooks\chNN_*.ipynb`, `reports\chNN_lesson.md` | executes with 0 errors; coverage clean; lesson PASS |

**You check (20–30 min), the second most valuable check:**

1. Open two explainers from `viz\chNN\`. Play the walkthrough, move the sliders, read the Explain and Derivation
   tabs. Does the idea *click*?
2. Open one standalone 3-D scene. Is it readable?
3. Look at one data figure and its reading card next to the book's figure.
4. Skim `reports\chNN_lesson.md`. Its must-fix list should be empty.

Tell the session what you want changed. It sends that track back to its builder.

### 5.8 Phases 9 ∥ 10 — knowledge ∥ library ∥ publish, then push

**What happens:** the **knowledge-keeper** saves what was learned (`knowledge\chNN.md`, the cumulative summary,
notation, the patterns that worked) so the next chapter starts smarter. The **library-steward** releases a new
`fluidpy` version (tag) and pins it. The **site-publisher** builds the web page, the Colab twin, the index and the
galleries, and runs the browser audit and the copyright check. Then the orchestrator commits and **pushes** to
`shammun/aofd` and waits until the page is live.

**You check:** open the page link in the final report. Click one explainer, one 3-D scene and the Colab button.

### 5.9 Movies — separate and not blocking: `/make-movies N`

Run after the chapter notebook passes:

```prompt
/make-movies 0
```

The **movie-director** writes a storyboard and script per movie. Each **motion-builder** renders one movie with
Remotion, three.js scenes, numbers from tested `fluidpy` functions, and Kokoro narration with captions. `movie_qa.py`
and the **movie-reviewer** check physics honesty, timing, captions and size. The draft goes to the media repo under
`drafts/`, which the site does not link to.

**You check:** watch each draft. Then either approve it:

```prompt
/approve-movie 0 m0_1_climate_machine
```

or reply with changes (e.g. "slower at 1:10, the arrow colours are confusing"). The next chapter never waits for
movies.

### 5.10 Resuming after a stop

| Situation | Type |
|---|---|
| Session ran out of context or crashed | open a new session, `/status`, then the command it suggests |
| Redo from a phase | `/do-chapter 0 --from viz` |
| Run one phase only | `/do-chapter 0 --only figures` |
| Build without pushing | `/do-chapter 0 --no-push` |
| Rebuild one explainer | `/build-viz 0 vector_products_lab` |
| Rebuild one data figure | `/build-figure 21 21.23` |
| Ask for an explanation right now | `/explain-concept 2 "why geostrophic wind follows height contours"` |

## Part 6 — How to study a finished chapter

The pipeline produces the material; this is the suggested order for learning from it.

1. **Watch the chapter movie** (if any): the big picture in 3 minutes.
2. **Read the notebook top to bottom** on the web page. For every 🧩 CORE block: read the plain words, then follow the
   derivation one step at a time. Cover the "why" column and say it yourself first.
3. **Open the explainer** linked from the block. Play the walkthrough, then try the presets, then answer the quiz
   *before* looking.
4. **Run the code on Colab.** Change one number in each worked example and predict the result first.
5. **Read every data figure with its reading card**: what is plotted, units, sign convention, then what it means.
6. **Write a one-paragraph summary** of each CORE idea in your own words. If you cannot, ask
   `/explain-concept N "<idea>"`.
7. **Do the book's exercises** for that chapter, using `fluidpy` for the calculations.

## Part 7 — Disk space and data rules (summary)

- Every download goes through one function that checks the size **before** downloading. Free space on C: and G: is
  reported before and after every data step.
- Floors: **C: 40 GB free**, **G: 50 GB free**. Project data cap: **150 GB** on G:.
- Only the needed slices are downloaded, then reduced to small derived products at once.
- Only re-downloadable, already-processed raw files are ever deleted, and every deletion is logged in
  `aofd-data\logs\evictions.log`.
- If G: is missing the project stops. It never fills C: instead.
- On 2026-10-20, after all installs: **C: 106 GB free, G: 633 GB free.**

## Part 8 — Troubleshooting

| Problem | What to do |
|---|---|
| `check_data_access.py` says `NEEDS LOGIN cds_era5` | redo section 2.1; the URL must be `https://cds.climate.copernicus.eu/api` and the key must have no `uid:` |
| CDS request fails with "required licences not accepted" | accept the licence on that dataset's page (section 2.1 step 3) |
| `NetCDF: I/O failure` / `SSL CA cert` when opening an OPeNDAP URL | open it with `xr.open_dataset(url, engine="pydap")` instead |
| A PSL or NCEI check says FAIL | those servers are sometimes down for maintenance; rerun later |
| A permission prompt blocks an install or `gh` command | run the exact command yourself with a leading `!` |
| A 3-D view says "needs WebGL" | update the graphics driver, or ask the session to rerun `shot.py --3d` |
| Movie render is slow | normal: minutes per movie on this laptop; the report gives render times |
| You want to change a decision | tell the session; it updates `PLANNING.md` §15 and the skills |
