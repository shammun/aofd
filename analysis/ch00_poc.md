# Proof of concept (PLANNING §12 step 11, PoC A–G) — orchestrator brief

The PoC is a **generic setup test**: one sample of each *kind* of product, built through the real agents and tools,
so the user can approve look, voice and depth before any chapter runs (§15.7). **It is not the content of Chapter 0.**
Where a PoC product will later be part of Chapter 0 (E01, the 500 hPa scene, the dot-product block), it is built to the
full standard and kept; `/do-chapter 0` revisits it after the user's verdict.

Decisions in force: narrator `af_bella` speed 1.0 · three.js 0.186.1 · Chapter 0 voice = informal blog-like (§9.1) ·
data root `G:/Geophysical Fluid Dynamics/aofd-data` via `fluidpy.data.fetch()` + `tools/disk_guard.py` · equations from
page images only (Vallis: `chapters/pages/…`; Kundu App. B: `_private/Kundu_AppendixB_Mathematical_Tools.pdf`, render
pages into `_private/` is not allowed → render to `chapters/pages/kundu_appB/` which is git-ignored).

## Items, IDs and owners

| PoC | Product (file) | IDs | Library functions it mirrors (to be implemented + tested) | Agents (in order) |
|---|---|---|---|---|
| A | `viz/ch00/vector_products_lab.html` — 3-D primer explainer in the Kundu format | C0A-PoC1 (dot product), C0A-PoC2 (cross product); D: a·b = \|a\|\|b\|cos θ from components; \|a×b\| = area | `fluidpy.geo.vectors`: `dot`, `cross`, `norm`, `angle_between`, `projection`, `scalar_projection`, `parallelogram_area`, `triple_scalar`, `k_cross` (f k×u) | concept-implementer → math-verifier; lesson-designer (storyboard) → viz-builder ∥ viz3d-builder → viz-integrator → viz-reviewer |
| B | `templates/viz_example_globe.html` — Coriolis on a rotating globe, cross-product glyph, where-from/where-to probe | C0B-PoC1 | `fluidpy.geo.frames`: inertial straight-line path on/over a sphere seen in the Earth frame; Earth-frame horizontal Coriolis −f k×u with f = 2Ω sin ϑ; reuse `fluidpy.core.rotating` (frame terms, projectile paths) where it exists | concept-implementer → math-verifier; lesson-designer → viz3d-builder (+ viz-builder for the app shell) → viz-integrator → viz-reviewer |
| C | `figs/ch21/fig_21_23.py` + reading card — Southern Ocean currents/fronts map with a GDP-drifter twin panel (R3 §3.1) | fig_21_23 | `fluidpy.data` fetchers: Natural Earth land + 10 m bathymetry bands (or ETOPO −3000 m), Orsi fronts (AADC), GDP mean surface velocity (AOML); our polylines `figs/ch21/so_currents.yaml` | data-scout → figure-reproducer (private side-by-side with `_private/figure_refs/geo_1.png`) |
| D | 20-s Coriolis test clip (R1 §4.4, all 8 steps) — `movies/poc/` | M-PoC | analytic trajectory from `fluidpy.geo.frames` / `fluidpy.core.rotating` | movie-director → motion-builder → `tools/movie_qa.py` → movie-reviewer; test page with `<video>` + `<track>` |
| E | Colab smoke notebook `notebooks/poc_colab_smoke.ipynb` (+ `_colab`) | — | setup cell installs `fluidpy@v0.3.0` from GitHub, loads one committed derived product (`data/derived/ch00/…`) with no keys | notebook-builder |
| F | `scenes/ch00/the_500hPa_surface.html` — standalone scene, real NCEP R1 500 hPa heights | S0B-PoC1 | `fluidpy.data.fetch` (NCEP R1 daily `hgt`, one day, subset if possible) → derived product (≤ 1 MB) → `fluidpy.geo.atmos` geostrophic wind from heights `u_g = −(g/f) ∂Z/∂y`, `v_g = (g/f) ∂Z/∂x` on the sphere | data-scout; concept-implementer (`geo.atmos`); lesson-designer (scene spec) → viz3d-builder → viz-reviewer |
| G | Chapter 0A sample block (Kundu B.3 dot product) in the informal voice — `notebooks/build_poc_ch00a_dot.py` → `notebooks/poc_ch00a_dot.ipynb` | C0A-PoC1 | `fluidpy.geo.vectors.dot`, `angle_between`, `projection` | lesson-designer (block design) → notebook-builder → lesson-reviewer (+ code-reviewer pass 2) |

## Gates (§12 table) and records
A: lint + `shot.py --3d` PASS at 8 sizes; viz-reviewer compares with `rossby_waves` / `geostrophic_adjustment` and
PASSes; fallback works with WebGL disabled. · B: parity rows (inertial vs Earth-frame path vs `fluidpy`), drawing
invariant (result ⟂ inputs), context-loss restore. · C: front latitudes checked (PF ≈ 50°S, SAF ≈ 45°S south of
Africa; ACC through Drake Passage; Agulhas retroflection near 20°E); private side-by-side reviewed; credit line. ·
D: `movie_qa.py` PASS; movie-reviewer PASS; plays with captions in a test page. · E: runs on Colab with no keys. ·
F: `shot.py --3d --scene` PASS; disk report printed; viz-reviewer PASS. · G: lesson-reviewer PASS on voice and
completeness.

Record render times, sizes, GPU vs SwiftShader and the user's verdict in `knowledge/viz_patterns.md` and
`knowledge/movie_patterns.md`. Report free space on C: and G: at every step.

## Library placement (fluidpy `v0.3.x`)
`fluidpy/geo/vectors.py`, `fluidpy/geo/frames.py`, `fluidpy/geo/atmos.py` (+ `fluidpy/geo/constants.py`);
`fluidpy/data/{__init__.py (fetch), registry.py, psl.py, naturalearth.py, fronts.py, gdp.py}`; tests in
`../Fluid Dynamics/tests/{geo,data}/`. Never change a `fluidpy.core` signature; the full fluidpy suite stays green.
`v0.3.0` is the empty-package tag (PoC E pins it); these functions go into `v0.3.1` after the PoC.
