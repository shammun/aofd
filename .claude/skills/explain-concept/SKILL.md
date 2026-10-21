---
name: explain-concept
description: Explain one concept, equation, mechanism or figure from a chapter to the user right now, in Shammunul's teaching style, grounded in the book's rendered pages and the project's tested code - plain words, the idea, the maths step by step, a tiny worked example with easy | exact numbers, runnable Python (from scratch + the fluidpy call, executed, real output), a Kundu link when the idea was already taught there, a reading card for any data figure, and links to the notebook section, explainer, scene or movie; optionally saves it as a study note. Usage - /explain-concept 2 "why geostrophic wind follows height contours"
---

# /explain-concept N "<concept>"
For learning, not for the pipeline. Work directly (no subagents unless the search is large).

1. **Locate**: grep `analysis/chNN.md`, `analysis/chNN_curation.md`, `analysis/chNN_kundu.md`, `knowledge/chNN.md`,
   `knowledge/concept_map.md`, `knowledge/glossary.yaml`, `knowledge/symbols.yaml` and `chapters/chNN.txt`; render the
   page(s) with `.venv/Scripts/python.exe tools/render_pages.py chNN --eq N.M` (or `--find "<phrase>"`) and read them.
   For Chapter 0, the sources are Kundu App. B (`_private/`) and the notation pages (`tools/render_pages.py ch00 --pdf 19-20`).
2. **SEEN-Kundu?** If `knowledge/kundu_index.yaml` (or the chapter's `analysis/chNN_kundu.md`) has the idea, say so
   first: one line "Kundu taught this in chNN §… (link to `https://shammun.github.io/fluidpy/...#anchor`, explainer …,
   derivation D.. with k steps)", the notation crosswalk (Kundu symbol ↔ Vallis symbol, sign changes), then what Vallis adds.
3. **Explain** in the `teaching-style` chain: plain words (a scene with a number and a unit; for a no-climate-background
   reader define every climate word from the glossary) → the idea (ASCII sketch) → the maths step by step with every
   equation written out next to its number (Vallis `(2.12)`, Kundu `(K 13.15)`; for a derived result the full §1c
   derivation, one move per step: did · line · why · in words; a sympy check from a scratch file for anything hard) →
   anatomy of the balance and term magnitudes with Earth values → tiny example, easy | exact ("≈ 10 m/s | 9.6 m/s"),
   "that is like …" → Python: a from-scratch version (one operation per commented line) **and** the tested `fluidpy`
   call, with an assert that they agree; run it with `.venv/Scripts/python.exe` from a scratch file and show the real
   output → what the output shows → ⚠️ the common misconception (Like… / Unlike…) → ✅ what should click.
4. **Data figure?** Give the 🗺️ reading card first (what is plotted + unit + anomaly base period; axes and projection;
   encoding — colourbar centre, contour interval, dashed negatives, arrow scale; the one big feature with one number;
   the physics and a "what would change if"; where the data come from). Rotation sense always with hemisphere.
5. **Point to where it lives**: notebook section, explainer (`viz/chNN/<slug>.html` + tab/step), standalone scene,
   movie (if published), figure script, function and test names.
6. If the user asks to keep it: write `notes/chNN_<short_slug>.md` (our words, no book prose; equations with numbers).
   Never commit book text or page images.
