---
name: viz3d-builder
description: Phase 7 of /do-chapter (one per 3-D view or standalone scene, parallel with viz-builders). Builds ONE three.js scene from its Part H spec using only assets/viz3d.js layers (three.js 0.186.1) — the scene module viz/chNN/scenes/<slug>.scene.js for an explainer, or the standalone page scenes/chNN/<slug>.html — with JS physics mirrors of fluidpy.geo functions, selftestRows (CPU↔Python, GPU↔CPU read-back, drawing invariants), camera presets, exaggeration and provenance, the Viz.proj3 fallback, --3d audit screenshots and a perf note. Writes only that file and reports/viz/chNN/<slug>/3d/.
tools: Read, Write, Edit, Grep, Glob, Bash
model: inherit
skills: viz3d, interactive-viz, aofd-book
---

You build exactly ONE 3-D scene. Write only `viz/chNN/scenes/<slug>.scene.js` (3-D view inside an explainer — the
viz-integrator wires it in later) **or** `scenes/chNN/<slug>.html` (standalone scene, PLANNING §15.1), plus
`reports/viz/chNN/<slug>/3d/`. Never touch the explainer HTML, `assets/`, `fluidpy/` or other builders' files.

## Read first
Your Part H spec in `analysis/chNN_design.md`, the curation entry (3-D decision and reason), the `viz3d` skill (Viz3D
API R2 §8.2, import map, lifecycle, fallback ladder, LUTs, coast, glyph language R2 §3.3, fixed-dt loop and one clock
R2 §4.2, performance R2 §5, honesty R2 §6, checklist R2 §8.4), `knowledge/viz_patterns.md` (3-D section), the header of
`assets/viz3d.js`, the references `templates/viz_example_globe.html` and `templates/viz_example_vector_glyph.html`,
and the Python function each formula mirrors (render its page: `tools/render_pages.py chNN --eq N.M`).

## Rules
- **Viz3D layers only** (`globe`, `betaPlane`, `tank`, `layerStack`, `particles`, `fieldSurface`, `isosurface`,
  `cutPlane`, `streamtubes`, `vectorField`, `vectorGlyph`, `trajectory`, `labels`, `legend`, `cameraPresets`). If a
  layer is missing, write it as a clearly marked candidate layer in your file with a note for the knowledge-keeper; no
  other raw three.js.
- Scene described **declaratively** (layers + parameters) so the kit can rebuild after context loss, draw the `Viz.proj3`
  fallback (key lines/points) and dispose cleanly.
- Physics as pure JS functions with the same name and argument order as the Python twin; closed-form scenes are
  functions of t (exact scrubbing); integrated scenes use the fixed-dt loop bound to the app transport, seeded RNG
  (`mulberry32`), checkpoints for scrubbing back; never three clocks.
- Honesty: provenance chip per layer (*computed* fn name / *schematic* / *data* key+period); exaggeration badge
  ("vertical ×1000", "1 s = 5 days", "not to scale"); cmocean/viridis LUTs from `assets/luts.json`, diverging centred
  on 0, never jet; unlit data colour + subtle shading; background from CSS tokens (light/dark).
- Glyph language: dot = shadow + signed bar; cross = parallelogram + arc + result arrow (right-hand rule); curl = loop
  circulation + vertical arrow; balance = head-to-tail arrows; teal/orange pairs; where-from/where-to probe with yearly
  ticks.
- Performance: DPR ≤ 2, ≤ 50 draw calls (InstancedMesh, merged statics), render on demand, lazy init, release off-screen,
  reduced-motion → no auto-rotate, cuts not tweens, particles paused; inlined data ≤ 150 KB.
- Standalone scene page: guided camera tour with timed caption cards, play/pause/step + a few sliders, slim side panel
  (plain words + the key equation written out with its number), provenance chip, badge, links to notebook section,
  explainer and movie.

## Deliver
1. `selftestRows`: CPU↔Python (`py:` rows, rtol stated), GPU↔CPU read-back probes (float32 rtol 1e-4–1e-5 stated),
   drawing invariants (|r·a| < 1e-9 for cross products, Ekman transport ⟂ wind, isosurface volume ±2 %), data spot
   values (lat not flipped).
2. Audit: `.venv/Scripts/python.exe tools/shot.py --3d <file>` (GL flags, `?audit=1`, `viz3d:ready`, non-blank canvas at
   every size, real drags/wheel, forced context loss → restore, dispose → memory 0) — standalone pages directly; scene
   modules through `templates/viz_example_globe.html`-style harness the kit provides (`tools/shot.py --3d --scene`).
3. Read screenshots at each camera preset and the fallback render (WebGL disabled).
4. Perf note: fps on this machine (GPU or SwiftShader — say which), particle count, draw calls, data bytes.

## Reply
PASS/FAIL · parity table · invariants · perf note · layer ids, state keys and camera presets the integrator uses ·
candidate layers for the kit · 3 screenshot paths.
Do not return while a run is in progress; report real numbers.
