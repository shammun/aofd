---
name: build-figure
description: Build or rebuild ONE of the book's data figures from open data outside the full pipeline - data-scout finds, licence-checks, downloads (through fluidpy.data.fetch and the disk guard) and reduces the data and registers it; figure-reproducer writes figs/chNN/fig_NN_MM.py, its caption and reading card, checks 2–4 published numbers and makes a private side-by-side; then the notebook embed. Usage - /build-figure 21 21.23 · /build-figure 17 17.13 "extend to 2025" · /build-figure 0 practice_500hPa
disable-model-invocation: true
---

# /build-figure N <fig> ["request"]

Skills `open-data` and `figure-reproduction` hold the rules; read them. Look up the figure's row in
`research/R3b_figure_catalogue.md` (type SEC/MAP/GCM/SIM/ANA/SCH, dataset keys) and, if it is a reference crop, its
recipe in `research/R3_open_data_and_figures.md` §3.

1. Disk report (`tools/disk_guard.py --report`) — C: floor 40 GB, G: floor 50 GB and project cap 150 GB.
2. **Data** (`data-scout`; skip if `data/registry.yaml` already has a fresh derived product for this figure): source in
   the order anonymous → free login with server-side subsetting → substitute (labelled) → pseudo (stamped
   "ILLUSTRATIVE — synthetic data"); HEAD-check and open it; read the licence page; download only through
   `fluidpy.data.fetch()`; reduce at once to a derived product with provenance attrs on G:; copy it into
   `data/derived/chNN/` only if ≤ 10 MB and redistributable; registry entry + `reports/data/<key>.md`.
3. **Figure** (`figure-reproducer`): `figs/chNN/fig_NN_MM.py` with `make(ax=None, refresh=False) -> Figure` (commented
   for a novice, `if __name__ == "__main__":`), our colour maps and layout (the science, not the artwork), caption with
   product, period, base period, unit, projection, sign convention and the registry credit line; the 🗺️ reading card
   text (five questions + source line); 2–4 numbers checked against cited published values, orientation and sign checks
   → a test function returned in the reply (you append it to `tests/test_figs_chNN.py`); a private side-by-side with
   `_private/figure_refs/` in `_private/compare/` for review only. ≤ 3 fix rounds with the data-scout, then report the
   discrepancy instead of tuning the figure to look like the book.
4. Run `.venv/Scripts/python.exe -m pytest tests/test_figs_chNN.py -q -k <fig>` and look at the PNG yourself.
5. If the chapter notebook exists: brief `notebook-builder` to add `nb.reading_card(...)` + `nb.figure(...)` where the
   design places it; `tools/run_notebook.py chNN`.
6. Commit `chNN: figures — fig <N.M>: <one line>` (code, registry, small derived product, test; never raw data or
   `_private/`). Disk report again. Print: figure path, checked numbers vs sources, licence verdict, sizes.
