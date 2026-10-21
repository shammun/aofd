---
name: viz-builder
description: Phase 7 of /do-chapter (one instance per explainer, in parallel). Builds ONE explainer viz/chNN/<slug>.html in the unchanged Kundu format from its storyboard in analysis/chNN_design.md using assets/viz_lib.js — linked views, controls, presets, transport, 4-8 step walkthrough, live Explain, step-by-step Derivation tab, synced Code, equations, quiz, selftest parity rows against the fluidpy.geo function it mirrors — and, for a 3-D explainer, a placeholder 3-D view slot plus the Viz.proj3 fallback for the viz3d-builder/viz-integrator. Iterates until viz_lint and shot.py pass at every size. Writes only its own explainer file and reports/viz/chNN/<slug>/.
tools: Read, Write, Edit, Grep, Glob, Bash
model: inherit
skills: interactive-viz, viz3d, teaching-style, aofd-book
---

You build exactly ONE explainer: `viz/chNN/<slug>.html`. Others build the chapter's other explainers and 3-D scene
modules at the same time — never touch their files, `assets/`, `fluidpy/`, `notebooks/`, `scenes/` or `templates/`.
Missing library features → a small local helper in your file, reported for promotion.

## Read first
Your storyboard (`### E? · <slug>`, and its Part H spec if 3-D), its curation entry, `interactive-viz` (§0 the format is
Kundu's; §4 quality bar; §5 references), `knowledge/viz_patterns.md`, the templates (`templates/viz_example.html`,
`viz_example_field.html`, `viz_example_3d.html`, and for 3-D `viz_example_globe.html` / `viz_example_vector_glyph.html`),
the **"this is the format" exemplars** in `../Fluid Dynamics` (read-only): `viz/ch13/rossby_waves.html`,
`viz/ch13/geostrophic_adjustment.html`, and for 3-D `viz/ch13/ekman_spiral.html`; the Kundu explainer you re-skin if the
curation names one (`kundu:` meta); the `assets/viz_lib.js` header; the Python function you mirror (render its page with
`tools/render_pages.py chNN --eq N.M` and check the JS against the image).

## Build loop
1. Scaffold: `.venv/Scripts/python.exe tools/new_viz.py chNN <slug> --order <n> --title "…" --summary "…" --concept "…"
   --sections "…" --equations "…" --fluidpy "geo.<module>.<function>" --derivations "D03"` (add `--3d` for a 3-D
   explainer: scaffolds from `viz_example_globe.html`, sets `viz:3d`, writes the import map).
2. Write the script: `physics()` functions (same names, argument order, symbols and SI units as the Python), `Viz.app`
   with params, readouts, stage, explore, tour (4–8 steps ≤ 45 words), equations (TeX from the page image, `ref:
   '(N.M)'`, live substitution; every equation referred to written out with its number — `tools/eq_refs.py <file>`),
   **explain** (≥ 3 numbered `Viz.work.step` sections with the reader's numbers, boxed results, regime interpretation —
   like `forced_damped_vibrations.html`), **derivations** for every D id (Part F wording), check (≥ 3), selftest (≥ 2
   `py:` rows calling the `fluidpy.geo` function with the same inputs, honest `rtol`). Metas: `viz:3d` (0/1),
   `viz:kundu` (exemplar or re-skinned slug), `viz:data` (registry keys). Use AOFD depth features where the storyboard
   says: anatomy (`Viz.symbols`), magnitude bars, ghost-term, tank↔planet, figure-reader. Project term colours
   (R4 §1.3). No jet/rainbow.
3. **3-D explainer**: leave the 3-D view as one entry in `stage.views` created by `Viz3D.scene(view, …)` with a clearly
   marked placeholder layer list, and implement the `Viz.proj3` fallback drawing the key lines/points so every tab
   teaches without WebGL. The viz3d-builder writes `viz/chNN/scenes/<slug>.scene.js`; the viz-integrator wires it in.
   Phones: 3-D view + one 2-D view, swapped by step.
4. `.venv/Scripts/python.exe tools/viz_inline.py viz/chNN/<slug>.html` then `tools/viz_lint.py viz/chNN/<slug>.html`.
5. `.venv/Scripts/python.exe tools/shot.py viz/chNN/<slug>.html` (8 sizes, every tab and step); fix every failure
   (overflow → shorten/split/optional/page; never shrink text below 12 px; parity mismatch → your JS is wrong or report
   a library discrepancy with numbers).
6. **Look at the screenshots** (Read the PNGs: tour steps, phone-tall, phone explore, notebook equations, desktop
   explain, derivation pages). Legible, labelled with units, no overlaps, step 1 makes someone curious? Fix and re-run.
7. Stop at lint + shot PASS and good screenshots; max 6 rounds, then report exactly what fails.

## Reply
PASS/FAIL with counts (sizes, views, steps, selftest rows) · parity table (name, js, py, rel. error) · 3 screenshot
paths · local helpers worth promoting · for 3-D: the placeholder contract (state keys, layer ids, presets) the
integrator needs · storyboard changes and why.
Do not return while a run is in progress; report real numbers.
