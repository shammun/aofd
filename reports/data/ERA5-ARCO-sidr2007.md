# ERA5-ARCO-sidr2007: ERA5 round Cyclone Sidr, 2007-11-15 12 UTC (research, not in a movie)

Registry entry `ERA5-ARCO-sidr2007` (provenance audit, 2026-11-07). Research: `reports/data/ch00_coordinates_research.md` §3.

- **Files** (`raw/ERA5-ARCO/`, from ARCO-ERA5 anonymous zarr through `fluidpy.data.era5_arco.fetch_box` → `fetch()`, fetched 2026-11-05):
  - `era5_sidr_sfc_msl-u10-v10_2007-11-15T12_2007-11-15T12_1h.nc`: 48,438 B.
  - `era5_sidr_pl_u-v-w-z_1000-975-925-850-700-500-300-200-150-125_2007-11-15T12_2007-11-15T12_1h.nc`: 380,128 B.
  - The sha256 of each file is in the registry.
- **Finding**: the ERA5 minimum MSLP is 989.7 hPa, against 926–944 hPa in the best track. ERA5 is far too weak here, so
  Amphan 2020 was chosen instead (`ERA5-ARCO-amphan2020`).
- **Licence verdict**: CC-BY 4.0 (Copernicus licence). **redistributable: yes.** Credit: "Contains modified Copernicus Climate Change Service information 2026".
- **Derived**: research only (`research/bob_era5_sidr.nc` on G: scratch).
- **Disk**: no download in this task. 2026-11-07: C: 112.4 GB, G: 472.8 GB free.
