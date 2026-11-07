# ETOPO2022-60s-alps, -swflorida, -captests: ETOPO 2022 60″ subsets not registered before 2026-11-07

This report covers three registry entries added by the provenance audit on 2026-11-07. All three are OPeNDAP subsets (pydap)
of `ETOPO_2022_v1_60s_N90W180_surface.nc` on the NCEI THREDDS server, fetched through `fluidpy.data.fetch()`.

**Licence verdict (all three)**: U.S. Government work, public domain. **redistributable: yes.**
Credit "ETOPO 2022, NOAA NCEI"; cite doi:10.25921/fd45-gt74.
**Coordinates (all three)**: latitude runs S→N, longitude −180…180, variable `z` [m] (EGM2008 heights; below 0 is the sea floor).

| Key | File (`raw/ETOPO2022-60s/`) | Bytes | Fetched | Used by |
|---|---|---|---|---|
| `ETOPO2022-60s-alps` | `etopo2022_60s_alps_43-49N_4-17E.nc` | 851,400 | 2026-10-27 11:39 (capability tests) | movie `ch00_gradient` s16: Alps slope map `data/img/alps_slope.png`, DG13. Movie `ch00_coordinates` s27 (build-1 archive): profile along 46.5 N in `co.json` key `alps`, DC26. `tools/maptools/recipes/alps_heightmap.yaml`, `alps_relief.yaml` |
| `ETOPO2022-60s-swflorida` | `etopo2022_60s_swflorida_24.5-27.5N_-84.5--81.5E.nc` (the name means 84.5–81.5 **W**) | 88,853 | 2026-11-05 05:18 (storm builder) | movie `ch00_coordinates_storm` s27: shelf profile WSW of Fort Myers Beach in `cs.json`. DS25: shallower than 20 m for ≥ 20 km; 50 m only beyond 80 km |
| `ETOPO2022-60s-captests` | `etopo2022_10min_global.nc` (10′ stride, global) | 5,820,510 | 2026-10-27 11:39 | map-toolkit capability tests only; no current reader |
| | `etopo2022_60s_paris_47.5-50N_0.5-4.5E.nc` | 136,600 | 2026-10-27 14:02 | same |
| | `etopo2022_60s_nweurope_40-58N_-12-12E.nc` | 4,422,767 | 2026-10-27 14:04 | same |

- The sha256 of every file is in the registry (taken from `logs/downloads.log`).
- None of the three entries has a `derived_on_root`, so the guard never evicts these files. Any of them can be downloaded again
  anonymously.
- Colab route: the movies ship only their derived images and JSON. No keys are needed.
- Disk: no download in this task. 2026-11-07: C: 112.4 GB, G: 472.8 GB free. No evictions.
