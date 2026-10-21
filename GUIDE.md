# Guide: Vallis's *Atmospheric and Oceanic Fluid Dynamics* → notebooks, Colab, web pages, 3-D explainers and movies

**Project folder (Claude Code runs here):** `C:\Users\sislam27\Work\Climate Dynamics PHD\AOFD Vallis`
**Public results (after the proof of concept is approved):** repository `https://github.com/shammun/aofd` · site
`https://shammun.github.io/aofd/` · movies `https://shammun.github.io/aofd-media/` · library
`https://github.com/shammun/fluidpy` (shared with the finished Kundu site `https://shammun.github.io/fluidpy/`).

This file is the short map. The step-by-step guide to keep open while working is **`WORKFLOW_GUIDE.md`**; the full
technical specification is **`PLANNING.md`** (its §15 records every decision you made); accounts and keys are in
**`CREDENTIALS_GUIDE.md`**; `CLAUDE.md` holds the rules every session and agent follows.

## Part 0 — the machine in one screen

| Piece | Where | What it does |
|---|---|---|
| The book | `*.pdf` in this folder (never committed) | split into `chapters/` by `tools/split_pdf.py` using `book.yaml` (pdf = printed + 20) |
| The library | `../Fluid Dynamics/fluidpy/{geo,data,diag}` | all physics, data access and diagnostics, with tests; tagged releases (`v0.3.0` …) pinned by Colab |
| Book glue | `aofd/` | chapter parameter sets and notebook helpers |
| Agents and skills | `.claude/agents/` (23), `.claude/skills/` (27) | the pipeline; `/do-chapter N` runs it |
| Safety | `.claude/settings.json` hooks + `.githooks/` | no book content, credentials or force-push ever leave this machine |
| Data | `G:\Geophysical Fluid Dynamics\aofd-data` | every download goes through the disk guard (G: floor 50 GB, cap 150 GB; C: floor 40 GB) |
| Movies | `movies/` (Remotion) + `.venv-tts` (Kokoro, voice af_bella, speed 1.0) | published only after you approve each one |

## Part 1 — one-time setup
Done in the setup session (PLANNING §12 steps 1–11, ending with the proof of concept). Your own steps: WORKFLOW_GUIDE
Part 2 and PLANNING §13.1.

## Part 2 — the everyday loop
`/status` → `/do-chapter N` → read the short phase reports → spot-check (WORKFLOW_GUIDE Part 5) → `/make-movies N` →
watch the drafts → `/approve-movie N slug`.

## Part 3 — commands
`/setup-project` · `/do-chapter N [--from P] [--only P] [--no-push]` · `/status` · `/build-viz N <slug> [--3d]` ·
`/build-figure N <fig>` · `/make-movies N [slug]` · `/approve-movie N slug` · `/release-fluidpy` · `/verify-chapter N`
· `/notebook-chapter N` · `/publish-chapter N` · `/explain-concept N "<concept>"`.

*(This guide grows as the project runs; the Kundu-era guide is `../Fluid Dynamics/GUIDE.md`.)*
