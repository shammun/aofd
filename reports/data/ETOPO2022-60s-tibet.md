# ETOPO2022-60s-tibet: ETOPO 2022 60″ surface elevation, 25–42 N 72–105 E (Tibet and the Himalaya)

The registry entry `ETOPO2022-60s-tibet` already existed. This report was written by the provenance audit on 2026-11-07,
from the file on disk (opened with xarray).

- **Route**: OPeNDAP subset through `fluidpy.data.fetch()` with pydap, during the map-toolkit capability tests (2026-10-27 14:03).
  - Source: `https://www.ngdc.noaa.gov/thredds/dodsC/global/ETOPO2022/60s/60s_surface_elev_netcdf/ETOPO_2022_v1_60s_N90W180_surface.nc`.
- **File**: `raw/ETOPO2022-60s/etopo2022_60s_tibet_25-42N_72-105E.nc`, 5,661,752 B, sha256 `73b1ce33…1934` (matches the registry).
- **Contents**: `z` (lat 1020 × lon 1980), float32, metres (EGM2008 heights).
  - Latitude runs **S→N** (25.008 … 41.99); cell centres are 1/60° apart.
  - Range: 1.4 … 8157.4 m. The maximum is at 27.99 N, 86.93 E, the Everest cell.
  - The 60″ cell mean (8157 m) is lower than the summit height (8849 m), because each cell averages about 1.8 × 1.6 km of ground.
    Say "highest grid cell", not "Everest's height".
  - The file carries its provenance in its attributes: `fluidpy_source_url`, `fluidpy_subset`, `fluidpy_fetched`.
- **Licence verdict**: U.S. Government work, public domain. **redistributable: yes.** Credit "ETOPO 2022, NOAA NCEI"; cite doi:10.25921/fd45-gt74.
- **Derived**:
  - `movies/ch00/ch00_weather_basics/data/tibet_etopo.bin` + `.json`: 4-arc-minute block means, 255 × 495, float32.
    The relief close-up uses a vertical scale of ×30, which the narration states.
- **Used by**:
  - Movie `ch00_weather_basics` s39.
  - Movie `ch00_gradient`, whose builder reads the raw file as `F_TIB` (the manifest lists it in `inputs_sha256`).
- **Colab route**: the derived `.bin` is in the repo. Refresh is anonymous OPeNDAP (no keys).
- **Disk**: no download in this task. 2026-11-07: C: 112.4 GB free, G: 472.8 GB free. No evictions.
  The entry has no `derived_on_root`, so the file is not evictable.
