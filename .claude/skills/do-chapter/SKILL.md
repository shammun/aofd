---
name: do-chapter
description: 'Run the whole AOFD (Vallis) pipeline for one chapter autonomously - preflight, analyze ∥ scout, curate (exhaustive coverage, tiered depth, K-recaps, 5–14 explainers with 3-D decisions, figures, movie groups), crossref to Kundu, design ∥ implement (fluidpy.geo/diag + aofd glue) ∥ data (fluidpy.data, disk guard), verify, review ∥ viz/viz3d ∥ figures ∥ notebook, knowledge ∥ library release ∥ publish, push - with parallel subagents where safe, gates, fix loops, progress tracking, a commit per phase and a C:/G: disk report per phase. Movies run separately (/make-movies). Usage - /do-chapter 2 · /do-chapter 2 --from viz · /do-chapter 2 --only figures · /do-chapter 0 --part 0B · /do-chapter 2 --consult · /do-chapter 2 --no-push'
disable-model-invocation: true
---

# /do-chapter N [--from P] [--only P] [--part 0A|0B|0C] [--consult] [--no-push]

You are the **orchestrator**. You delegate; you do not write physics, tests, notebooks, explainers or figures yourself.
Keep your context small: read `progress.json`, `book.yaml`, agent *replies* and verdict lines, not whole files. Every
brief is self-contained and ends with: *"Do not return while a run is in progress; wait for it and report real numbers."*

**Brief header** (top of every brief, filled in):
```
Project: aofd — Vallis, Atmospheric and Oceanic Fluid Dynamics (2nd ed., 2017) → tested Python (fluidpy), notebook,
Kundu-format explainers with three.js 3-D, standalone scenes, data figures from open data, movies.
Repo root: C:\Users\sislam27\Work\Climate Dynamics PHD\AOFD Vallis (Windows, path has spaces; .venv/Scripts/python.exe;
write code with Write/Edit, not heredocs). Library: ../Fluid Dynamics (fluidpy, editable; change only fluidpy/, tests/).
Data root: G:/Geophysical Fluid Dynamics/aofd-data (book.yaml → data.root). Rules: CLAUDE.md. Do not commit.
Chapter: chNN — N. <title> · slug <slug> · sections <…> · PDF <s>-<e> (printed = pdf − 20) · fluidpy pin <tag>
Text: chapters/chNN.txt (maths garbled — tools/render_pages.py chNN --eq N.M, then Read the PNG)
Read first: knowledge/CUMULATIVE.md, notation.md, symbols.yaml, glossary.yaml, kundu_index.yaml, viz_patterns.md
```

**Disk report** (PLANNING §15.2/§15.4): before and after **every** phase print one line
`disk: C: <free> GB (floor 40) · G: <free> GB (floor 50) · project data <GB>/150 · evicted <n>` from
`.venv/Scripts/python.exe tools/disk_guard.py --report`. If G: is missing or a floor would be crossed, stop (`blocked`)
and tell the user what could be cleaned — never delete outside the eviction rules, never fall back to C:.

## 0. Preflight (no agents)
1. Read the `book.yaml` row and `progress.json`. Sequential rule: the previous chapter has `publish: pass` and
   `knowledge: done` (unless the user overrides). Chapter 0 is first; chapter 1 needs Chapter 0 published.
2. Environment: `.venv` imports `fluidpy` (editable) and `aofd`; `chapters/chNN.txt` exists (else `tools/split_pdf.py
   chNN`); `tools/kundu_index.py --check` fresh (else run it); G: present; `git rev-parse` works.
3. Resume: `--from P` needs every earlier phase `pass`/`done`; `--only P` runs one phase and its gate; otherwise start at
   the first phase not `pass`. A crashed `running` phase restarts from its start (its files are inputs, not results).
4. Print the plan (phases, parallel groups, agents, expected files) in ≤ 12 lines; continue unless `--consult`.

**Chapter 0** runs the same phases **per part** (`ch00a` maths, `ch00b` climate basics, `ch00c` reading maps; `--part`
selects one, default all three in order, sharing one analyze/scout). Inputs are Kundu App. B
(`_private/Kundu_AppendixB_Mathematical_Tools.pdf`, page images only), the notation pages (PDF 19–20), R4, PLANNING
§9.1, §15.5 (every App. B item — `coverage_check.py --appendix-b` must pass for 0A) and §15.6 (all 17 groups — nothing
unexplained for 0B). Explainers: **about 12 per part, a soft target** (Q11): the curator says why if it goes above or
below; tools warn, not fail; minimum 5 per part. Tier-A cap 18 per part. Informal blog-like voice (teaching-style §1d).
Standalone scenes up to 6 for Chapter 0.

## Phases (`progress.json` keys) and gates — send back once on a failed gate unless stated
| # | Key | Agent(s) (∥ = one message) | Writes | Gate |
|---|---|---|---|---|
| 1 | `analyze` ∥ `scout` | `concept-analyst` ∥ `research-scout` | `analysis/chNN.md` + private `tests/book_values_chNN.json` ∥ `research/chNN_scout.md` | every numbered equation once (count lines `(N.M)` in the text vs inventory); every figure listed with its R3b type; SEEN-Kundu rows carry Kundu ids; climate terms listed for the glossary |
| 2 | `curate` | `concept-curator` | `analysis/chNN_curation.md` | every inventory row has ID + depth; A ≤ 18 (K rows not counted); K rows for every SEEN-Kundu first use; 5–14 explainers + backup, each with a **3-D decision** (yes/no + why; a chapter with no 3-D says why) and an explainer-vs-scene choice; 0–4 standalone scenes; every computable equation has a code plan; every data figure a dataset key or "pseudo"; 1–3 movie groups; mechanism and reading cards listed. Print A list, explainers, scenes, figures, movies. `--consult` stops here (`blocked`) |
| 2b | `crossref` | `crossref-linker` | `analysis/chNN_kundu.md` | `tools/crossref_check.py chNN` all links resolve; every K row has a section URL + (explainer or "none") + derivation id or "new"; notation crosswalk table present |
| 3∥4∥4b | `design` ∥ `implement` ∥ `data` | `lesson-designer` ∥ `concept-implementer` ∥ `data-scout` | design ∥ `fluidpy/geo`, `fluidpy/diag`, `aofd/` ∥ `fluidpy/data`, `data/registry.yaml`, derived products, `reports/data/` | design Parts A–G complete (G = equation-code table; 3-D scene specs with layers, presets, exaggeration, provenance, parity); every Part C function exists (`grep "def <name>"`); every planned figure has a derived product (or labelled pseudo) and a licence verdict; data report lists sizes and disk before/after |
| 5 | `verify` | `math-verifier` ⟲ `concept-implementer` (≤ 3 loops) | tests in both repos, `reports/chNN_verification.md` | PASS, never by loosening tolerances; **fluidpy full suite (all Kundu chapters) green** |
| 6∥7∥7b∥8 | `review`, `code_review` ∥ `viz`, `viz3d` ∥ `figures` ∥ `notebook` | `derivation-reviewer` + `code-reviewer` (pass 1) ∥ `viz-builder` ×n + `viz3d-builder` ×m → `viz-integrator` ×m → `viz-reviewer` ∥ `figure-reproducer` ×k ∥ `notebook-builder` → `code-reviewer` (pass 2) ∥ `lesson-reviewer` | see agents | viz: every explainer and scene lint + `shot.py` (+ `--3d`) PASS at 8 sizes, ≤ 2 rebuild rounds, else backup; figures: numeric checks PASS; notebook executes with 0 errors, `coverage_check.py` clean (incl. equation-code ledger, K-recap links, reading cards), `embed_check.py` 5–14; lesson + code reports PASS (≤ 2 rounds each) |
| 9∥10 | `knowledge` ∥ `library` ∥ `publish` | `knowledge-keeper` ∥ `library-steward` ∥ `site-publisher` | `knowledge/` ∥ fluidpy tag ∥ pages | tag pushed (ask the user the first time) and `library_pin` updated, then the publisher re-runs the Colab twin with the new pin; page audit PASS; `size_budget.py` PASS; `check_public.py` OK |
| push | — | orchestrator | `shammun/aofd` main | §"Publish and push" below |
| M | `movies` | `/make-movies N` (async, never blocks N+1) | media repo `drafts/` | user approval |

**Parallel-safety (group 6∥7∥7b∥8):** reviewers write nothing in pass 1 (you write `reports/chNN_review.md` from the
reply); each viz-builder writes one `viz/chNN/<slug>.html`; each viz3d-builder one `viz/chNN/scenes/<slug>.scene.js`
or `scenes/chNN/<slug>.html`; an integrator touches an explainer only after its builder returned; figure-reproducers
each write one `figs/chNN/fig_*.py` and return their test function in the reply (you append to
`tests/test_figs_chNN.py`); notebook-builder writes `notebooks/` only and embeds explainers by slug and figures by
function name; its final execution is at the merge gate. `fluidpy/` is written only in phases 4, 4b (different
subfolders) and in fix loops (implementer alone).
**Scheduling:** at most `max_parallel_agents` (6) at once, of which at most `max_parallel_viz` (3) run browser audits.

**Fix loops.** Verify FAIL → implementer (physics only, signatures stable) → verifier, max 3, then `verify: fail` and
stop. Review must-fix code → implementer, then the chapter tests (+ verifier if tests changed). Viz must-fix → the same
builder/integrator (max 2), still failing → delete, note it in `viz_patterns.md`, build the backup; never publish fewer
than 5 explainers (Chapter 0: 5 per part). Lesson/code must-fix → notebook-builder (max 2).

**Merge gate** (after group 6–8): `.venv/Scripts/python.exe -m pytest -q tests` · fluidpy full pytest ·
`tools/shot.py --chapter chNN --quick` (+ `--3d`) · `tools/run_notebook.py chNN --save` · `tools/coverage_check.py chNN
--nb outputs/chNN/executed.ipynb` · `tools/embed_check.py chNN` · `reports/chNN_{lesson,viz,code}.md` PASS.

After each phase: update `progress.json` (status, one-line notes, `updated`), then commit explicit path groups
(never `git add -A`; never `chapters/`, `_private/`, `outputs/`, raw data): `chNN: <phase> — <one line>`.

## progress.json (per chapter)
```json
{ "project": "aofd", "current_chapter": "ch02", "library_pin": "v0.3.1",
  "chapters": { "ch02": { "analyze": "pass", "scout": "pass", "curate": "pass", "crossref": "pass", "design": "pass",
    "implement": "pass", "data": "pass", "verify": "pass", "review": "pass", "code_review": "pass", "viz": "pass",
    "viz3d": "pass", "figures": "pass", "notebook": "pass", "knowledge": "done", "library": "pass", "publish": "pass",
    "movies": {"ch02_coriolis": "approved"}, "explainers": [], "scenes3d": [], "figures_list": [], "fluidpy_tag": "v0.3.1",
    "page_mb": 11.2, "notebook_runtime_s": 140, "counts": {"A": 16, "B": 40, "C": 22, "K": 9, "R": 5, "S": 4, "D": 21, "eq_code": 88},
    "disk": {"C_free_gb": 0, "G_free_gb": 0}, "notes": "", "updated": "YYYY-MM-DD" } } }
```
Status: `todo/running/pass/fail/blocked` (knowledge `done`); movies `todo/draft/qa_pass/approved/published`. Chapter 0
keeps one block per part (`ch00a`, `ch00b`, `ch00c`) plus `ch00` for the landing page.

## Publish and push (PLANNING §6.4; after the user created the repos once)
1. `git add` explicit path groups; the pre-commit hook runs `check_secrets.py --staged`.
2. `tools/check_public.py` (book-text n-gram scan against `chapters/chNN.txt`, page images, `_private`/`figure_refs`
   references, storyboard/script/VTT scan, registry `redistributable: no` products) → OK.
3. `tools/size_budget.py` → OK; `tools/data_registry.py --check`; `tools/sync_fluidpy.py` (pin is a pushed tag containing
   every imported function); `_colab.ipynb` outputs stripped.
4. Commit `chNN: publish — <n> explainers (<m> 3-D), <s> scenes, <k> figures, notebook <t>s, page <MB> MB`.
5. Remote: `origin` must be `https://github.com/shammun/aofd(.git)` (guard refuses others); no origin → stop and give the
   user the exact `! gh repo create …` commands (WORKFLOW_GUIDE §2.7). `git fetch`; a "Created using Colab" commit →
   rebase, re-run `publish_notebook.py`, commit `chNN: restore outputs-stripped _colab.ipynb`. Never force-push.
6. Unless `--no-push`: `git push` (pre-push repeats 2–3); poll the page URL until 200 (≤ 5 min); check one explainer
   URL, one scene URL, the Colab URL, the gallery and the `index.html` card.
7. fluidpy `main` + tag were pushed by the library-steward in phase 9 (library paths only).
8. Commit + push `progress.json`.

## Final report (≤ 20 lines)
Verdict and validation counts; tiers (A/B/C/K/R/S/D, eq_code); explainers (slug · 3-D? · shot PASS); scenes; figures
with their checked numbers; notebook runtime; page MB; fluidpy tag; URLs (page, gallery, Colab); movies pending
(`/make-movies N`); disk C:/G: before → after; "Next: `/clear` then `/do-chapter N+1`".

## Orchestration rules
- One chapter per session; `/clear` between chapters — everything needed is on disk.
- A failed gate leaves `fail` + notes and stops; nothing downstream runs on unverified code.
- An agent returning placeholders or "still running" is re-briefed to wait and report real numbers.
- A machinery tool that misbehaves → `tools/pipeline_selftest.py`, a small careful fix, commit `tools: …`, continue.
- Outward-facing steps (first push of a repo, fluidpy tag push the first time, movie publication) need the user's yes.
