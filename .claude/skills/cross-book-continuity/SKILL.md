---
name: cross-book-continuity
description: How the Vallis (aofd) site re-teaches and links material the Kundu site (fluidpy, shammun.github.io/fluidpy) already taught - when an idea is SEEN-Kundu, the K tier and K-recap block (full CORE-depth re-teaching at first Vallis use, short recap later), the Kundu ↔ Vallis notation crosswalk and sign conventions, deep-link URL formats (notebook section anchors, explainers, derivation ids with step counts), reusing Kundu derivation steps and fluidpy.core functions instead of rewriting them, how to read knowledge/kundu_index.yaml and analysis/chNN_kundu.md, and the rule that the Kundu site is read-only. Load when analysing, curating, cross-linking, designing or building notebook cells for any idea Kundu covered, and when writing Chapter 0A (Kundu Appendix B).
---

# cross-book-continuity — re-teach, link, reuse

The reader may never have opened the Kundu site; the Kundu-site reader wants to know what is new. So every idea Kundu
already taught is **re-taught in full where Vallis first uses it**, at the same depth as on the Kundu site, with deep
links into it, and with Kundu's derivations and `fluidpy.core` functions **reused, not rewritten**.

## 1. Sources of truth
| File | What it gives | Who writes it |
|---|---|---|
| `knowledge/kundu_index.yaml` | every Kundu concept_map row (A ids, D rows with step counts), notebook section anchors (from the published `.html` `<h2 id>`), explainer metas (`viz:*`), fluidpy function names, with URLs on `https://shammun.github.io/fluidpy` | `tools/kundu_index.py` (generated; rerun in `/do-chapter` preflight) |
| `../Fluid Dynamics/analysis/chNN_design.md` Part F | Kundu's derivations written out step by step | read-only |
| `../Fluid Dynamics/knowledge/{concept_map,notation,primers}.md` | what Kundu taught, its symbols, its primers | read-only |
| `analysis/chNN_kundu.md` | this chapter's crosswalk: per K row the exact URLs, symbol table, sign conventions, which derivation text and which function to reuse | `crossref-linker` (phase 2b) |
| `tools/crossref_check.py` | every K-recap link resolves (local file + anchor), every cited Kundu equation exists | gate of phase 2b and of publish |

**The Kundu site is read-only from this session.** Never edit `../Fluid Dynamics/{notebooks,viz,knowledge,analysis,
reports,.claude,templates,assets}`, its `index.html` or `book.yaml` (hooks block it). Only `fluidpy/`, `tests/`,
`pyproject.toml`, `CHANGELOG.md` may change there, through the library workflow (`fluidpy-library`).

## 2. When an idea is K
- The concept-analyst marks each inventory item **NEW**, **SEEN-Vallis** (an earlier Vallis chapter or Ch. 0) or
  **SEEN-Kundu (Kundu id, e.g. ch13 C05 / D04)** by searching `kundu_index.yaml` (names, symbols, equations) — not memory.
- The curator gives every SEEN-Kundu item at its **first Vallis use** a K row (`K01…`); K rows do **not** count toward
  the 12–18 A cap. A later Vallis use is an R row (short recap).
- If Vallis generalises the idea (sphere instead of f-plane, compressible instead of Boussinesq), the K row re-teaches
  Kundu's version and the *new* part becomes (or joins) an A row: "What Vallis adds".

## 3. The K-recap block (notebook, `nb.kundu_recap`)
```
> 🔁 From Kundu ch13 §13.5 — thermal wind
> [notebook section](https://shammun.github.io/fluidpy/notebooks/ch13_geophysical_fluid_dynamics.html#13.5-Geostrophic-Flow)
> · [explainer thermal_wind](https://shammun.github.io/fluidpy/viz/ch13/thermal_wind.html) · Kundu derivation ch13 D04 (7 steps)
```
then, in order (all parts required — the lesson-reviewer checks completeness):
1. **Notation crosswalk** table: Kundu symbol ↔ Vallis symbol, meaning, unit, sign convention (e.g. Kundu colatitude θ ↔
   Vallis latitude ϑ; Kundu lapse rate Γ = dT/dz ↔ met Γ = −dT/dz; Kundu ω vorticity ↔ Vallis ω/ζ).
2. **Plain words** (CORE depth, teaching-style §1).
3. **The equations**: (K n.m) written out and its Vallis form (n.m) written out; both transcribed from page images.
4. **Derivation**: Kundu's Part F steps **re-typed in Vallis notation**, same number of steps, each with did / line / why /
   in words (the step count in the link line must match; `crossref_check.py` compares).
5. **Tiny example** (easy | exact numbers).
6. **Code**: from-scratch cell + the **existing `fluidpy.core` function** + `assert` (`from-scratch-code`).
7. **Picture**: a figure, or the Kundu explainer embedded via `show_viz` on its fluidpy Pages URL (or re-skinned with
   geophysical presets when the curation says so — the re-skin is a new AOFD explainer, the original stays untouched).
8. **What Vallis adds** — the generalisation, the new approximation or the new regime, pointing to the A block.

**Later uses:** `> 🔁 Recap — <idea> (taught in Vallis chNN §… as K03; Kundu ch13 §13.5 [link])` plus the equation written out.

## 4. Link formats
- Notebook section: `{kundu_site}/notebooks/<chNN_slug>.html#<anchor>` — anchors exactly as in `kundu_index.yaml`
  (Jupyter's `<h2 id>` style, e.g. `#13.5-Geostrophic-Flow`). Never hand-type an anchor.
- Explainer: `{kundu_site}/viz/<chNN>/<slug>.html`; derivation deep link `…#tab=derive&d=<k>&ds=<step>`.
- Derivation id: "Kundu derivation chNN Dkk (n steps)".
- In explainers: a "From Kundu" link in the Explain tab's last section and in the meta `viz:kundu`.

## 5. Reuse rules
- **Code**: call `fluidpy.core.*` (e.g. `gfd.geostrophic_velocity`, `rotating.*`, `stratification.*`) — `fluidpy.geo`
  wraps or extends it; never copy-paste a Kundu function into `geo`. A Vallis-specific variant (sphere, latitude
  argument) lives in `geo` and calls `core`. The derivation-reviewer checks the regime and sign convention of each reuse.
- **Text**: Kundu derivation steps are re-typed (our words, Vallis notation), never pasted with Kundu's symbols.
- **Explainers**: link or embed the Kundu explainer; re-skin only via a new file in `viz/chNN/`.
- **Chapter 0A** re-teaches all of Kundu Appendix B item by item from `_private/Kundu_AppendixB_Mathematical_Tools.pdf`
  page images (private), and links each item to where the Kundu site used it (mostly ch02–ch04).

## 6. Checks (automated + review)
`tools/crossref_check.py` (links + anchors + equation existence + step counts) · `coverage_check.py` (every K row has a
recap block with all eight parts; `(K n.m)` vs `(n.m)` numbering) · lesson-reviewer "K-recap completeness" · the
derivation-reviewer's regime/sign check on reused functions.
