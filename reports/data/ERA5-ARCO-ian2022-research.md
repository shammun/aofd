# ERA5-ARCO-ian2022-research: ERA5 round Hurricane Ian, 2022-09-28 18 UTC, 10 levels with z (research)

Registry entry `ERA5-ARCO-ian2022-research` (provenance audit, 2026-11-07). The subset differs from `ERA5-ARCO-ian2022-pl`
(18 levels, u v w only) and from `ERA5-ARCO-ian2022` (a four-day surface series).

- **Files** (`raw/ERA5-ARCO/`, from ARCO-ERA5 anonymous zarr through `fetch_box` → `fetch()`, fetched 2026-11-05):
  - `era5_ian_sfc_msl-u10-v10_2022-09-28T18_2022-09-28T18_1h.nc`: 37,740 B.
  - `era5_ian_pl_u-v-w-z_1000-975-925-850-700-500-300-200-150-125_2022-09-28T18_2022-09-28T18_1h.nc`: 245,855 B.
- **Findings**, from the comparison with HRRR and the TDR (`ch00_coordinates_research.md` §1d, `ch00_coordinates_vertical_motion.md` §2):
  - Maximum ring-mean v_t is 33.9 m/s at r = 75 km.
  - Minimum MSLP is 979.6 hPa, against 938 hPa in the best track.
  - Ring-mean w is only 0.28–0.45 m/s.
  - At 0.25° the eye fits inside one grid cell, so ERA5 is too coarse for the eyewall.
- **Licence verdict**: CC-BY 4.0. **redistributable: yes.**
- **Derived**: research only (`research/bob_era5_ian.nc` on G: scratch).
- **Disk**: no download in this task. 2026-11-07: C: 112.4 GB, G: 472.8 GB free.
