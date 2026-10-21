---
name: build-viz
description: Build, rebuild or improve ONE interactive explainer or standalone 3-D scene for a chapter outside the full pipeline - storyboard it if needed (lesson-designer), build it (viz-builder; with --3d also viz3d-builder in parallel, then viz-integrator), review it (viz-reviewer with the 3-D checklist), embed it in the notebook if new, and commit. Usage - /build-viz 0 vector_products_lab --3d · /build-viz 2 thermal_wind_tilt "bigger arrows on phones" · /build-viz 2 new "gradient wind cyclone vs anticyclone" · /build-viz 0 --scene the_500hPa_surface
disable-model-invocation: true
---

# /build-viz N <slug | new> [--3d] [--scene] ["request"]
1. Read `progress.json` and `analysis/chNN_curation.md` (explainer list with 3-D decisions, scenes). Count existing
   `viz/chNN/*.html`: a chapter keeps 5–14 (Chapter 0: about 12 per part, soft — warn, do not fail). A new one beyond
   `book.yaml → project.max_explainers_per_chapter` → ask the user which to replace. Scenes (0–4; Ch. 0 up to 6) do not
   count toward the cap.
2. **New** (`new "<idea>"`): `concept-curator` adds an `### E<k> · <slug>` entry (CORE ids, why interactive, mirrored
   fluidpy function, 3-D decision yes/no + why, explainer vs standalone scene); `lesson-designer` adds its storyboard
   (and the 3-D scene spec: layers, camera presets, exaggeration, provenance, parity rows). Missing physics →
   `concept-implementer` then `math-verifier` (tests first).
3. **Build** (skills `interactive-viz`, `viz3d`):
   - 2-D: one `viz-builder` (Kundu format; opens the exemplars `rossby_waves`, `geostrophic_adjustment`,
     `ekman_spiral`) iterating on `tools/viz_lint.py` + `tools/shot.py` until PASS.
   - `--3d`: `viz-builder` (app with a placeholder 3-D view + `Viz.proj3` fallback) **∥** `viz3d-builder`
     (`viz/chNN/scenes/<slug>.scene.js` from `Viz3D` layers only, selftest rows CPU↔Py, GPU↔CPU, drawing invariants,
     perf note) in one message; then `viz-integrator` wires the scene into `Viz.app` (state, transport, presets,
     picking, walkthrough camera steps, Explain numbers, Code tab) and runs `tools/viz_inline.py`, `tools/shot.py --3d`
     (GL flags, `viz3d:ready`, non-blank canvas at all sizes, real drags/wheel, forced context loss/restore).
   - `--scene`: one `viz3d-builder` writes `scenes/chNN/<slug>.html` (guided camera tour with caption cards, play/pause/
     step, sliders, side panel with the key equation written out with its number, provenance chip, "not to scale"
     badge, links to notebook section, explainer and movie); `tools/shot.py --3d` must PASS, incl. reduced motion and
     the no-WebGL fallback.
   Pass the user's request verbatim.
4. **Review**: `viz-reviewer` limited to this slug (updates its section in `reports/chNN_viz.md`), with the R2 §8.4
   3-D checklist and a comparison against the named Kundu exemplar. Must-fix → back to the builder/integrator
   (max 2 rounds).
5. **Embed** (new only): `notebook-builder` adds `nb.explainer(...)` / `nb.scene(...)` where the storyboard places it;
   `tools/run_notebook.py chNN`; `tools/embed_check.py chNN`. Link explainer ↔ scene both ways.
6. Commit `chNN: viz — <slug>: <one line>` (or `viz3d`). If published, `/publish-chapter N`.
Print the shot verdict (incl. GPU vs SwiftShader), the parity table and the two best screenshot paths.
