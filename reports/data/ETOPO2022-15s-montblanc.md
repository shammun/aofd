# ETOPO2022-15s-montblanc: ETOPO 2022 15″, Mont Blanc (movie #6 D1, s01, s15, s16)

- **Route**: OPeNDAP subset (pydap) via `fluidpy.data.etopo.fetch_15s`, tile `N60E000` (named by the north-west corner), 76,807 B, 1.4 s. The server answered 503 for the first minutes; a retry after 45 s worked.
- **Licence**: US Government work, public domain. **Redistributable: yes.**
- **Product**: `etopo2022_15s_montblanc_45.6-46.1N_6.6-7.2E.nc`, 73,127 B, on G: and in the repo. No false soundings.
- **Checks**:
  - Summit cell 4692.8 m (cited 4806). Chamonix cell 1041 m (cited 1035).
  - DG13 distance 10.056 km PASS; mean slope 0.375 PASS.
  - **DG13 max |∇h| within 5 km of the summit: 1.286 at 45.823° N 6.890° E (plan 0.60 ± 0.05): FAIL.** The median there is 0.586 and the 90th percentile 0.902. The 60″ grid gives 0.573 (PASS), so the sixty percent belongs to the coarser grid.
  - The s15 line "the slope on this map reaches about sixty percent" holds only if the arrows use the 60″ grid. On the 15″ drape it should read "more than a hundred and twenty percent". data_needs allows that re-wording.
- **Colab route**: the repo product, no keys.
- **Disk**: whole session, C: 60.4 → 61.0 GB free, G: 492.1 → 491.1 GB free, project data 98.07 → 99.01 GB. Render scratch moves these too. Nothing evicted.
