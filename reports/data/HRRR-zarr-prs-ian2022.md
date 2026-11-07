# HRRR-zarr-prs-ian2022: HRRR 3 km pressure-level analysis round Hurricane Ian, 2022-09-28 18 UTC

Registry entry `HRRR-zarr-prs-ian2022` (provenance audit, 2026-11-07). This is a sub-key of the `HRRR-zarr` log family; its subset
differs from `HRRR-zarr-ian2022`, which holds the surface store.

- **Route**: the anonymous HRRR-zarr archive `s3://hrrrzarr/prs/20220928/20220928_18z_anl.zarr`, read one level and one variable
  per call: `fetch(HRRR_PRS, key="HRRR-zarr", subset={"group": "<lv>mb/<var>/<lv>mb", "isel": window})`. Each call takes about 75 s,
  mostly remote metadata.
- **Files** (`raw/HRRR-zarr/`, 46 files, 1,342,462 B in total (downloads.log)):
  - `hrrr_prs_ian_20220928T18_<lv>mb_{UGRD,VGRD,VVEL,HGT}.nc`: 9 levels (975, 925, 850, 700, 500, 300, 200, 150, 125 hPa) on the
    research window, 24.5–28.5 N, 84.5–80.5 W (172 × 158 points). 36 files.
  - `hrrr_prs_ian500_20220928T18_<lv>mb_{UGRD,VGRD}.nc`: 5 levels (925, 850, 500, 200, 150 hPa) on a wider ±250 km square for the
    layer stack. 10 files.
- **Pitfalls**:
  - Winds are grid-relative; rotate them with `fluidpy.data.hrrr.earth_relative`.
  - The hour-0 VVEL holds no usable vertical motion (see `HRRR-aws.md`).
  - Near the core, 975 hPa lies below ground, so mask points where p > p_sfc.
  - At 500 hPa the ±10 m/s u_r dipole comes from vortex tilt plus storm motion; it is not inflow.
- **Checks**:
  - Maximum ring-mean v_t is 56.8 m/s at r = 30 km (850 hPa).
  - Ring-mean inflow reaches about −16 m/s below about 1.5 km.
  - Outflow sits above about 12 km.
- **Licence verdict**: NOAA NODD, open to the public. **redistributable: yes.**
  Credit: "Derived from NOAA HRRR analyses (University of Utah HRRR-zarr archive)".
- **Derived**:
  - Repo: `movies/ch00/ch00_coordinates_storm/data/img/ur_{925,850,500,200,150}.png`, `sec_ian.png` and `cs.json` (s18–s20, DS16–DS18).
  - G: scratch: `research/ian_hrrr_prs_18z.nc`.
- **Disk**: no download in this task. 2026-11-07: C: 112.4 GB, G: 472.8 GB free. Not evictable (no `derived_on_root`).
