# AOFD Vallis — Setup and Working Guide

This guide explains how to turn Vallis, *Atmospheric and Oceanic Fluid Dynamics* (2nd ed., 2017), into a learning
website with the same pipeline that built the Kundu `fluidpy` site, plus the new features: Chapter 0, three.js 3-D,
movies, real-data figures and cross-book continuity. The full technical specification is `PLANNING.md` in this folder.
This guide covers **what to do, in what order, and what to expect**.

## 1. Where everything is

| Location | What it holds | Public? |
|---|---|---|
| `C:\Users\sislam27\Work\Climate Dynamics PHD\AOFD Vallis\` | The new project. It becomes the git repo `shammun/aofd` (site `https://shammun.github.io/aofd`) | yes, except the items below |
| `AOFD Vallis\Atmospheric and Oceanic Fluid Dynamics ….pdf` | The Vallis book | **never** (git-ignored) |
| `AOFD Vallis\PLANNING.md` | Master design document (sections 0–15) | yes |
| `AOFD Vallis\SETUP_GUIDE.md` / `.docx` | This guide | yes |
| `AOFD Vallis\research\R1–R4` | Research: movies (R1), three.js (R2), open data and the 360-figure catalogue (R3, R3b), Chapter 0 and map reading (R4) | yes |
| `AOFD Vallis\_private\` | Book figure crops you shared (`figure_refs\geo_*.png`), Kundu Appendix B extract (`Kundu_AppendixB_Mathematical_Tools.pdf`), backup of the first plan | **never** (git-ignored) |
| `C:\…\Fluid Dynamics\` | `fluidpy` repo: the shared, growing Python library plus the finished Kundu site | yes (existing) |
| `G:\Geophysical Fluid Dynamics\aofd-data\` | All downloaded data: raw, derived, render scratch, logs | not in git |
| `C:\…\AOFD Media\` (created later) | Repo `shammun/aofd-media` with the movies | yes |

## 2. What has been decided

- **One repo per book.** Vallis content goes only to the new repo `shammun/aofd`. Nothing from Vallis is pushed to
  `shammun/fluidpy`.
- **`fluidpy` is the one shared library.** Reusable physics, data access and diagnostics go into `fluidpy.geo`,
  `fluidpy.data` and `fluidpy.diag` (and `fluidpy.ml` later). The Vallis repo installs it in editable mode, and Colab
  installs a pinned tag.
- **Continuity with Kundu.** When Vallis uses something Kundu taught, it is re-taught in full at its first use and
  linked to the Kundu notebook section and explainer.
- **Code for every equation.** Each computable equation gets a from-scratch version, commented line by line, next to
  the `fluidpy` call, with an assertion that both agree.
- **Explainers in the Kundu format**: the same layout, tabs (Explain, Derivation, Code), walkthrough, quiz and
  no-scroll fit. three.js 3-D is added as a view inside the same app. A chapter has 5–14 explainers.
- **Standalone three.js 3-D scenes**: full-window, guided camera tours, 0–4 per chapter (Chapter 0 up to 6), embedded
  in the chapter page and listed in a 3-D gallery.
- **Movies**: narrated motion-graphics videos of 2–3 minutes, made with Remotion, three.js and local Kokoro
  narration. There are 1–3 per chapter, and each needs your approval before it goes public.
- **Real-data figures**: the book's data figures are rebuilt by our own code from open data. Pseudo data is used only
  as a last resort, and is then clearly labelled.
- **Chapter 0 "Start here"** has three parts:
  - **0A** maths from scratch, including **all of Kundu Appendix B**;
  - **0B** climate and GFD basics, about 17 groups of concepts;
  - **0C** reading climate maps and figures.

  It is written in an informal, blog-like voice and has its own explainers, 3-D scenes and movies.
- **`/do-chapter N` is fully automatic**, up to pushing to GitHub and updating the website, after the copyright,
  size and version checks.
- **Disk space is managed.** Data goes to G:, with at least 50 GB kept free there and a 150 GB cap for this project.
  C: keeps at least 40 GB free. Free space on both drives is reported at every step.
- **All 10 earlier open questions use the recommended defaults.** Two remain open; see section 9.

## 3. Before you start: check these once

| Item | How to check | If missing |
|---|---|---|
| Claude Code | `claude --version` | Install from claude.com/claude-code |
| Git and the GitHub CLI | `git --version`, `gh auth status` | `winget install Git.Git`, `winget install GitHub.cli`, `gh auth login` |
| Python 3.12 | `py -3.12 --version` | `winget install Python.Python.3.12` |
| Node.js (LTS) | `node --version` (v24 is installed) | `winget install OpenJS.NodeJS.LTS` |
| ffmpeg | `ffmpeg -version` | The setup session installs it (`winget install --id Gyan.FFmpeg -e`) |
| G: drive | Open `G:\Geophysical Fluid Dynamics` | Plug in or connect the drive; the project stops if G: is missing |

## 4. Step by step: start the setup session

**Step 1.** Open a terminal (PowerShell) and go to the new folder:

```powershell
cd "C:\Users\sislam27\Work\Climate Dynamics PHD\AOFD Vallis"
claude
```

**Step 2.** Paste this first prompt, replacing the answers in brackets if you choose differently:

```prompt
Read PLANNING.md (all sections, especially §9.1 and §15) and research/R1–R4.
My answers: Q11 = per part, Q12 = M0-1..M0-3 first.
Data goes to G:\Geophysical Fluid Dynamics (PLANNING §15.4).
Execute the §12 build order up to the proof-of-concept gate (PoC A–G).
At every step tell me what you are doing and how much free space is left on C: and G:.
Stop and wait for my approval after the PoC.
```

**Step 3.** Follow along. The session will:

1. Make the folder a git repo and write `.gitignore` first, so the PDF and `_private\` can never be committed.
2. Copy the Kundu machinery (agents, skills, tools, explainer library, templates) from `..\Fluid Dynamics` and adapt
   it.
3. Make `fluidpy` installable: add `pyproject.toml` and new empty subpackages, run its tests, and tag `v0.3.0`. These
   commits go to the `fluidpy` repo.
4. Create the Python environment (xarray, cartopy, gsw, zarr, cmocean and others) and the notebook kernel.
5. Split the Vallis PDF into chapters and read the page offsets.
6. Write the new `CLAUDE.md`, the 23 agents, 26 skills, hooks and settings.
7. Build the Kundu index, used for the continuity links.
8. Build the three.js 3-D kit (`assets/viz3d.js`, three.js 0.186.1) and upgrade the audit tools.
9. Install the movie toolchain (Remotion and its Claude Code plugin, ffmpeg, Kokoro narration).
10. Run the machinery self-tests.
11. Build the **proof of concept** and stop for your approval.

**If a command is blocked** by the permission system (for example installing software or creating a repo), the
session gives you the exact command. Type it with a leading `!` in the Claude Code prompt, for example
`! winget install --id Gyan.FFmpeg -e`.

## 5. The proof of concept: what you will be asked to approve

The proof of concept is a **generic test of the machinery**. It produces one sample of each *kind* of product, so you
can judge look, voice and quality before anything is mass-produced. **It is not Chapter 0 itself.** Chapter 0's full
content (all of Appendix B and the full climate-basics list) is produced afterwards by `/do-chapter 0`.

| PoC | What you will see | What to judge |
|---|---|---|
| A | `vector_products_lab`: a 3-D dot and cross product explainer in the Kundu format | Does it feel like the Kundu explainers? Is the 3-D view clear? |
| B | Coriolis on a rotating globe, with the cross-product arrows and the "where from / where to" probe | Is the motion intuitive and honest? |
| C | The Southern Ocean currents and fronts map, rebuilt from open data, with a "how to read this figure" card | Does it match the science of the book's figure? Is the reading card helpful? |
| D | A 20-second Coriolis movie clip with narration and captions | Voice choice and speed, look, pace |
| E | A Colab test notebook | Does it run on Colab with no keys? |
| F | The standalone 3-D scene "the 500 hPa surface" with real NCEP data (first real download to G:) | Is the cinematic scene attractive and clear? Check the disk report. |
| G | A Chapter 0 block in the informal voice (Kundu B.3, the dot product) | Is the tone right: friendly, from scratch, nothing unexplained? |

Reply with approval or with changes. The session records your verdict, then continues.

## 6. Things only you do

| When | What | Command or link |
|---|---|---|
| Before the movie toolchain | Install the Remotion plugin if the session asks | `! claude plugin marketplace add remotion-dev/claude-code-plugin` then `! claude plugin install remotion@remotion` |
| Before publishing movies | Confirm the free Remotion licence for an individual | Email hi@remotion.dev (one line) |
| After the PoC is approved | Create the site repo and turn on Pages | `! gh repo create shammun/aofd --public --source . --remote origin --push` then `! gh api -X POST repos/shammun/aofd/pages -f "source[branch]=main" -f "source[path]=/"` |
| Same | Create the media repo | `! gh repo create shammun/aofd-media --public`, clone it to `..\AOFD Media`, and enable Pages the same way |
| Soon (recommended now) | Free data accounts | Copernicus CDS (cds.climate.copernicus.eu): accept the ERA5 licence and save the key in `%USERPROFILE%\.cdsapirc`. NASA Earthdata (urs.earthdata.nasa.gov): authorise GES DISC and PO.DAAC. |
| Each movie | Watch the draft, then approve it or ask for fixes | `/approve-movie N <slug>` |

## 7. Daily use after setup

| Command | What it does |
|---|---|
| `/status` | Where every chapter is, what to run next, disk space on C: and G: |
| `/do-chapter 0` | Whole pipeline for Chapter 0: analysis, curation, design, code, verification, explainers, 3-D scenes, figures, notebooks, publish, push |
| `/do-chapter N --from PHASE` | Resume a chapter from a phase after an interruption |
| `/make-movies N` | Storyboard, render and check the chapter's movies (runs separately so chapters are never blocked) |
| `/approve-movie N <slug>` | Publish a movie you have watched |
| `/build-figure N <fig>` | Rebuild one data figure |
| `/explain-concept N "<idea>"` | Ask for an explanation of one idea right now |

**Rules of thumb:**
- Run one chapter at a time. Chapter N starts after chapter N−1 is published.
- Open a fresh Claude Code session for each chapter. Memory lives in the files (`knowledge\`, `progress.json`), not
  in the chat.
- If a session runs out of context or stops, start a new one in the same folder and run `/status`.

## 8. Data and disk-space rules

- Every download goes through one function (`fluidpy.data.fetch`), which checks the size against the limits *before*
  downloading and logs the result.
- Only the needed slices are downloaded (levels, dates, regions), then reduced to small derived products straight away.
- If space runs short, only raw files that can be downloaded again and are already processed are deleted. Every
  deletion is logged in `aofd-data\logs\evictions.log`.
- Derived products, your files, and anything outside the data folder are never deleted.
- If even that is not enough, the session stops and asks you.
- If G: is not connected, the session stops and tells you. It never fills C: instead.

## 9. Open questions (answer in the first prompt)

- **Q11.** For Chapter 0 only: do the limits (18 full-treatment ideas, 14 explainers) apply **per part** (0A, 0B,
  0C), allowing up to 42 explainers, or to the whole chapter? *Recommended: per part.*
- **Q12.** Make all six Chapter 0 movies at once, or **M0-1 to M0-3 first** and the rest after you review them?
  *Recommended: the first three first.*

## 10. Safety: the repo is public, the books are not

- Never commit or publish book text, page images, figure crops, scans or transcribed tables. Equations are shown with
  their numbers, explanations are in our own words, and figures are drawn by our code.
- `_private\`, the PDFs and `chapters\` are git-ignored. Hooks block committing them and block force-pushes.
- A copyright check (`tools/check_public.py`) runs before every push.
- Never use Colab's *Save a copy in GitHub*.

## 11. Troubleshooting

| Problem | What to do |
|---|---|
| "G: drive not found" | Connect the drive, then `/do-chapter N --from <phase>` |
| A permission prompt blocks an install or `gh` command | Run the given command yourself with a leading `!` |
| A 3-D view shows "needs WebGL" in the audit | The audit flags from R2 are missing; ask the session to rerun `shot.py --3d` |
| A movie renders slowly | Normal (minutes per movie); the session reports render times |
| You want to change a decision | Tell the session; it updates `PLANNING.md` §15 and the relevant skill |
