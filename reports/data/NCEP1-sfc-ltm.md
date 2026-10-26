# NCEP1-sfc-ltm — NCEP/NCAR R1 1991–2020 mean 10 m wind and sea-level pressure (movie ch00_cross_product_why, scene 9)

- **Route**: three whole files over HTTPS through `fluidpy.data.fetch` (`fluidpy.data.psl.fetch_surface_ltm`), from
  `https://downloads.psl.noaa.gov/Datasets/ncep.reanalysis.derived/`: `surface_gauss/uwnd.10m.mon.ltm.1991-2020.nc`
  (1,155,868 B), `surface_gauss/vwnd.10m.mon.ltm.1991-2020.nc` (1,169,158 B), `surface/slp.mon.ltm.1991-2020.nc`
  (552,234 B). Each file holds 12 monthly long-term means. sha256 values are pinned in the registry. The files are fixed
  (last modified 2021-07-27).
- **What happened (2026-10-25)**: PSL was slow. One HEAD request timed out at 30 s, and each file took 49–53 s
  (about 23 kB/s). The fetcher now passes the HEAD sizes as `expected_bytes`, so the disk guard still has a size when
  HEAD fails.
- **Licence verdict**: US Government work, public domain. PSL asks for the acknowledgement "NCEP/NCAR Reanalysis 1
  data provided by the NOAA PSL, Boulder, Colorado, USA, from their website at https://psl.noaa.gov". Cite Kalnay et
  al. (1996). **Redistributable: yes.**
- **Derived product**: `G:/Geophysical Fluid Dynamics/aofd-data/derived/ch00/ncep_r1_sfc_wind_mslp_ltm_1991-2020.nc`
  (481 kB). It holds `u10`, `v10` [m s⁻¹] and `mslp` [Pa] on (season = ann, djf, jja; lat 94 Gaussian S→N, ±88.54°;
  lon 192, 0–358.125 °E, Δλ = 1.875°). The seasonal means weight each month by its length. SLP comes on a 2.5° grid
  and is linearly interpolated to the wind grid, with longitude wrapped.
  - **Movie copy**: `movies/ch00/ch00_cross_product_why/data/real/wind_climatology.bin` (649,728 B, Float32 LE) plus
    `wind_climatology.json` (header: shapes, byte offsets, units, lat/lon, provenance).
- **Checks** (annual mean 10 m u):
  - **Trades (u < 0)**: zonal mean −3.10 m s⁻¹ at 15°N and −3.93 at 15°S. Ocean sectors: central Pacific 15°N −6.86,
    Atlantic 15°N −4.93, east Pacific 15°S −6.71, Indian 15°S −6.20, Atlantic 15°S −6.55. **PASS.**
  - **Westerlies (u > 0)**: zonal mean +1.67 at 45°N and +5.55 at 45°S. N Atlantic 45°N +3.17, N Pacific 45°N +3.55,
    S Indian 45°S +7.51, 50°S ring +6.90. **PASS.**
  - **Subtropical highs (annual MSLP maxima)**: Azores 1022.1 hPa, North Pacific 1021.9 hPa. The Icelandic low
    minimum is 1003.5 hPa.
  - **Quick-look**: `outputs/ch00/data/p1_wind_climatology.png`. It shows the Siberian high and the Aleutian and
    Icelandic lows in DJF, the Indian-monsoon south-westerlies in JJA, and the circumpolar trough at about 65°S.
- **Pitfalls**: PSL latitudes run N→S (sorted here). The LTM time axis is year 0001, so open with
  `decode_times=False`. SLP over high ground (Antarctic plateau, Tibet, Greenland) is a reduction to sea level, not a
  real pressure: the annual field reaches 1035 hPa over Antarctica. Mask or de-emphasise land above about 1500 m on
  the globe. NCEP R1 is 1.9° resolution, which is fine for the planetary pattern but not for coastal jets.
- **Colab route**: load the committed movie copy (or the derived netCDF). The refresh is anonymous:
  `fluidpy.data.psl.surface_wind_climatology()`.
- **Credit line**: "NCEP/NCAR Reanalysis 1 data provided by the NOAA PSL, Boulder, Colorado, USA, from their website
  at https://psl.noaa.gov (public domain)."
- **Disk**: C: 84.2 GB and G: 583.3 GB free, both before and after. Project data went from 6.27 to 6.28 GB.
