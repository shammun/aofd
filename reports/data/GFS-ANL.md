# GFS-ANL — the latest global sea-level-pressure analysis (D11)

- **Why GFS**: it is the newest open, keyless analysis.
  - ERA5T on ARCO ends at 2026-10-19 (`valid_time_stop_era5t`), which is 8 days old.
  - NOAA's GFS 0.25° analysis runs every 6 h. Unidata's THREDDS keeps about 7 days of it (2026-10-20 00Z to 2026-10-27
    00Z at fetch time, 09 UTC on 27 Oct).
  - The NetCDF Subset Service cuts the variables on the server and returns **netCDF-4**. That avoids GRIB entirely:
    there is no cfgrib, eccodes or pygrib in `.venv`.
- **Route**: `https://thredds.ucar.edu/thredds/ncss/grid/grib/NCEP/GFS/Global_0p25deg_ana/GFS_Global_0p25deg_ana_<YYYYMMDD_HHMM>.grib2?var=Pressure_reduced_to_MSL_msl&var=Geopotential_height_surface&accept=netcdf4`,
  anonymous, through `fluidpy.data.fetch` (new module `fluidpy.data.gfs`).
  - No Content-Length is sent; the guard estimate is 6 MB per variable.
  - Two cycles, each 2.6 MB, fetched in 24–30 s.
- **Valid times**:
  - **2026-10-27 00:00 UTC** (the latest cycle).
  - **2026-10-26 12:00 UTC**, which matches the GIBS 2026-10-26 globe.
- **Product**: `gfs_mslp_latest.nc` (3,944,267 B). It holds msl [Pa] and zs [m], plus the low and high
  values and positions for each time.
  - Extrema are searched within 70°S–70°N and **only where the orography is 500 m or lower**.
  - Without that mask the "highest high" is 1057.8 hPa at 36.25°N 76.5°E (Karakoram) and 1053.6 hPa over Mongolia.
    These are sea-level-reduction artefacts.
- **Key numbers**:

  | | 2026-10-27 00Z | 2026-10-26 12Z |
  |---|---|---|
  | **Deepest low** | **934.9 hPa at 14.5°N 162.5°E** (western Pacific tropical cyclone) | 937.3 hPa at 14.25°N 162.75°E |
  | **Highest high** (ground ≤ 500 m) | **1040.1 hPa at 56.0°N 57.25°E** (Siberian high, Ural foothills) | 1039.1 hPa at 55.5°N 56.25°E |
  | North Atlantic low | **954.6 hPa at 59.25°N 15.5°W** (south of Iceland) | 961.4 hPa at 55.5°N 20.75°W |
  | Brest | 1007.7 hPa | 1011.1 hPa |

  - **Compare with Ciarán**: ERA5 minimum 953.7 hPa at 03 UTC on 2 Nov 2023. Today's North Atlantic low is about as
    deep.
  - The two products use **different reductions**: GFS PRMSL against ERA5 msl. They agree within about 1 hPa over the
    ocean and can differ by several hPa over high ground. Say "a weather-service analysis" rather than "ERA5" for this
    map.
  - **The tropical cyclone's name is not confirmed.** IBTrACS ACTIVE (fetched 2026-10-27, last fixes 00Z 25 Oct) has
    storm **IN-FA** (WP) at 11.5°N 165.3°E, 991 hPa, 54 kt. The 00Z 27 Oct low lies 3–4° WNW of that, which fits.
    Confirm with JTWC or JMA before the narration names it.
- **Licence verdict**: US Government work (public domain), redistributed unchanged by UCAR/Unidata.
  **Redistributable: yes.**
- **Pitfalls**:
  - The THREDDS window rolls, so `redownloadable: false`. Older cycles are on NCAR RDA ds084.1
    (doi:10.5065/D65D8PWK) or AWS `noaa-gfs-bdp-pds` (GRIB-2).
  - `fetch_analysis("latest")` returns whatever is newest at run time.
- **Disk** (data-scout session 2026-10-27, all ch00_weather_basics downloads): before the first download C: 74.2 GB and G: 577.6 GB free, project data 11.96 GB; after the last one C: 74.0 GB and G: 576.2 GB free, project data 13.34 GB (raw 0.46 GB, up 0.18 GB from 0.28 GB). Nothing evicted. Every fetch printed and logged its own before/after line in `G:/Geophysical Fluid Dynamics/aofd-data/logs/downloads.log`.
