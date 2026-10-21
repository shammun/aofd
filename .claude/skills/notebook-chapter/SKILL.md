---
name: notebook-chapter
description: Rebuild and headlessly execute one chapter's teaching notebook (or one Chapter 0 part) with the notebook-builder agent - e.g. after physics fixes, a new explainer, scene or figure, or teaching feedback - optionally applying the user's requested changes to the storyboard first, then the code-reviewer (pass 2) and lesson-reviewer gates. Usage - /notebook-chapter 2 · /notebook-chapter 0 --part 0A · /notebook-chapter 2 "add a tiny example for the gradient wind"
disable-model-invocation: true
---

# /notebook-chapter N [--part 0A|0B|0C] ["change request"]
1. If a change request is given, append it to `analysis/chNN_design.md` Part A under "## Revisions (<date>)" in one or
   two lines (you, not an agent).
2. Brief `notebook-builder` exactly as phase 8 of `/do-chapter` (brief header from that skill) plus the change request.
   Chapter 0 parts build `notebooks/ch00a_maths.ipynb`, `ch00b_climate_basics.ipynb`, `ch00c_reading_maps.ipynb`.
3. Gate: `.venv/Scripts/python.exe tools/run_notebook.py chNN` OK (0 errors, runtime ≤ 6 min);
   `tools/coverage_check.py chNN --nb outputs/chNN/executed.ipynb` clean (equation-code ledger, K-recap links, reading
   cards, symbols/glossary, "clockwise" with hemisphere; for 0A also `--appendix-b`); `tools/embed_check.py chNN` OK.
4. `code-reviewer` pass 2 (scratch cells) → `reports/chNN_code.md`; `lesson-reviewer` → `reports/chNN_lesson.md`
   (incl. the Chapter-0 voice check where relevant). Must-fix → notebook-builder, max 2 rounds.
5. `progress.json → notebook: pass`; commit `chNN: notebook — …`. If the chapter was published, `/publish-chapter N`.
   Print notebook path, runtime, cells by kind, eq-code count, figures, disk C:/G:.
