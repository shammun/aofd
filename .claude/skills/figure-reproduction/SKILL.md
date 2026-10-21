---
name: figure-reproduction
description: How aofd rebuilds the Vallis book's observational and model figures from open data with our own code - "reproduce the science, not the artwork"; the recipe format data → processing → plot → checks → fallback; figs/chNN/fig_NN_MM.py with make(ax=None, refresh=False); house colours (cmocean/viridis, diverging centred, dashed negatives, bold zero); captions with product, period, base period, unit, sign convention and credit line; the 5-question reading card and figure-reader explainer; model/observed-analogue and pseudo-data stamping; 2–4 published numbers checked per figure; private side-by-sides only in _private/compare/. Load when planning, coding, testing, captioning or reviewing any data figure (R3b types SEC, MAP, GCM, and SIM/ANA figures the curation asks for).
---

# figure-reproduction — the science, not the artwork

Sources: R3 §1, §3 (18 worked recipes, e.g. Fig. 21.23 in R3 §3.1), §5.2; R4 §3; PLANNING §8.3. The figure census is
`research/R3b_figure_catalogue.md` (360 figures: SCH 127 · ANA 124 · SEC 44 · SIM 41 · MAP 16 · GCM 8).

## 1. Scope
| Type | Treatment |
|---|---|
| **SEC / MAP** (60 observational) | every one reproduced from open data (skill `open-data`) |
| **GCM** (8) | reanalysis composite or a reduced model, labelled **"observed analogue"** / **"model analogue"** |
| **SIM / ANA** | by our tested models/functions, when the curation needs them |
| **SCH** | redrawn only where it teaches (often as an explainer or scene); never traced |
Only the figure **number** and our short topic words appear in public files — no caption text, no pixels from the book.

## 2. Recipe format (in `analysis/chNN_figures.md`, one block per figure)
**Data** (registry keys, variables, levels, period, region) → **Processing** (each step, units, sign conventions,
anomaly base period) → **Plot** (projection, extent, axes, contour levels, colormap) → **Checks** (2–4 numbers vs
independent cited values, orientation, units) → **Fallback** (substitute dataset or labelled pseudo-data).
Example (Fig. 21.23, R3 §3.1): NE land + NE 10 m bathymetry (depth < 3000 m shaded) + Orsi fronts (STF, SAF, PF, SACCF,
SB) + our own current polylines `figs/ch21/so_currents.yaml`, `ccrs.SouthPolarStereo()` with circular boundary, plus a
GDP-drifter mean-velocity twin panel; checks: PF ≈ 50°S and SAF ≈ 45°S south of Africa, ACC through Drake Passage,
Agulhas retroflection near 20°E.

## 3. Code contract — `figs/chNN/fig_NN_MM.py`
```python
def make(ax=None, refresh: bool = False) -> "matplotlib.figure.Figure":
    """Fig. 21.23 analogue: Southern Ocean fronts and currents (our drawing from open data).

    Data: NE (public domain), Orsi et al. 1995 fronts (AADC, CC-BY 4.0), GDP drifter climatology (public domain).
    Reads data/derived/ch21/fig_21_23*.nc (refresh=True re-runs fluidpy.data fetch + reduce).
    """
if __name__ == "__main__":
    make().savefig("outputs/ch21/fig_21_23.png", dpi=150)
```
- Reads the **derived product** (repo `data/derived/chNN/` or the G: data root); `refresh=True` calls `fluidpy.data`
  fetchers through the disk guard. Never reads raw files from a fixed path.
- Commented for a novice; functions, type hints; no absolute paths (data root from `book.yaml → data.root` /
  `AOFD_DATA_ROOT`).
- **Provenance in metadata**: PNG text chunk / plotly `meta` with dataset keys, period, processing commit;
  `synthetic: true` for pseudo-data.
- Tests in `tests/test_figs_chNN.py` (one function per figure, returned by the figure-reproducer, merged by the
  orchestrator): the 2–4 published numbers (cited), orientation (lat not flipped; ψ sign stated), units, licence flag,
  file size.

## 4. House style (R4 §3.4)
- Perceptually uniform colormaps only (viridis/cividis, cmocean thermal/haline/dense/deep/balance/curl/delta, Crameri
  batlow/vik). **Diverging maps centred on zero with a symmetric range.** Never jet/rainbow.
- Contours: **negative dashed, zero bold**, interval stated in the caption; same number of levels across panels when
  comparing fields.
- Our own layout, annotations, fonts; projections from cartopy (SouthPolarStereo, NorthPolarStereo, Robinson,
  Orthographic, Mollweide, PlateCarree).
- **Caption** (our words): what is plotted · product · period · base period for anomalies · unit · projection ·
  streamfunction sign convention · substitution note if the variable/product differs · **credit line from the registry**
  ("Data: NOAA PSL NCEP/NCAR Reanalysis 1; public domain" / "Contains modified Copernicus Climate Change Service
  information [year]" / "ECCO Consortium, ECCO V4r4").

## 5. Substitutions and pseudo-data
- A different variable or product says so in the caption (OLR for cloud brightness 18.23; reanalysis composite for a GCM
  composite 17.25; ECCO density-space residual for a hydrographic inverse 21.18; ERA5 to 1 hPa instead of 0.1 hPa 17.13;
  model spectra for lab/aircraft data 11.4/12.9) and carries the **"observed analogue" / "model analogue"** label.
- **Pseudo-data only when no open source exists** (substitute first, PLANNING §13.2 Q8): generated by
  `fluidpy.data.pseudo` with the observed pattern and magnitudes, stamped **"ILLUSTRATIVE — synthetic data"** on the
  figure and as the first words of the caption, `synthetic: true` in metadata, provenance chip *schematic* in 3-D.

## 6. Teaching: reading card + figure-reader
- Every data figure in a notebook gets the **🗺️ reading card** (`nb.reading_card`) *before* interpretation
  (teaching-style §1g): what is plotted · axes and projection · encoding · the one big feature with one number · which
  physics and a "what would change if…" · where it comes from (observation / reanalysis / state estimate / model).
- A **figure-reader explainer** (`Viz.figureReader`: toggle layers encoding/axes/feature/physics; probe with value,
  anomaly and human-unit coordinates; quiz mode) when the figure type is new to the reader (R4 §3.2–3.3 table of figure
  types and their common misreadings).

## 7. Checks and the private comparison
- 2–4 numbers against **independent published values with citations** (RAPID 17 Sv at 26°N; QBO ≈ 28 months, max
  10–20 hPa; Kelvin peak h_e ≈ 25 m; subtropical Sverdrup ψ ≈ 30 Sv; PF/SAF ≈ 50°S/45°S south of Africa) — never tuned
  to look like the book.
- Projection, extent and axes in kind; orientation and sign checks.
- **Private side-by-side** (ours | the user's reference crop `_private/figure_refs/geo_*.png`) via `tools/fig_check.py`
  into `_private/compare/fig_NN_MM.png` — for review only, never referenced from a published file (`check_public.py`).
- **"No copying" check**: colormap, layout, annotations are ours; no text or pixels from the crop.
- ≤ 3 fix rounds with the data-scout (wrong level, sign, period); then report the discrepancy.
Report: `reports/chNN_figures.md` (per figure: data, numbers checked with sources, verdict, size).
