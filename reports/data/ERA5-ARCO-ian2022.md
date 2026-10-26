# ERA5-ARCO-ian2022 — Hurricane Ian, ERA5 hourly 0.25° 10 m wind and MSLP (movie ch00_cross_product_why, scene 10)

- **Route**: the ARCO-ERA5 zarr `gs://gcp-public-data-arco-era5/ar/full_37-1h-0p25deg-chunk-1.zarr-v3`, read anonymously
  with gcsfs through `fluidpy.data.fetch` (new zarr branch; `fluidpy.data.era5_arco.fetch_box`).
  - **Selection**: 2022-09-26T00 to 09-29T23, hourly (96 times); 15–35°N, 95–70°W (81 × 101); `u10`, `v10`, `msl`.
  - **Guard size**: 9.43 MB. **File written**: 6,484,026 B in 118 s.
  - **Network transfer**: about 0.85 GB, because each zarr chunk is one global hour of one variable (2–3.5 MB).
- **Two zarr pitfalls (fixed in `fluidpy.data.open_remote`)**:
  1. With zarr 3.4, `xr.open_zarr(url)` without `zarr_format=2, consolidated=True` lists every array and hangs for more
     than 10 minutes.
  2. On Windows, the default Proactor event loop makes the interpreter hang at exit inside zarr's loop clean-up.
     `open_remote` switches to the selector policy before opening a zarr store.
- **Licence verdict**: ERA5 is under the Copernicus licence (CC-BY 4.0 on the CDS), and attribution is required. The
  ARCO copy is the same data; Google's code is Apache-2.0. **Redistributable: yes, with the credit line.** Cite
  Hersbach et al. (2020) QJRMS 146:1999, doi:10.1002/qj.3803; CDS doi:10.24381/cds.adbb2d47; and Carver & Merose (2023).
- **Derived product**: `G:/Geophysical Fluid Dynamics/aofd-data/derived/ch00/era5_ian_2022.nc` (6.46 MB). It holds
  `u10`, `v10` [m s⁻¹] and `msl` [Pa] on (time, lat S→N, lon −95…−70), plus per-hour `centre_lat`, `centre_lon`
  (grid point of minimum MSLP), `msl_min` [Pa], and `vt_annulus` / `vr_annulus` (mean 10 m tangential / radial wind
  50–250 km from the centre; tangential positive = anticlockwise seen from above).
  - **Movie copy**: `movies/ch00/ch00_cross_product_why/data/real/ian_2022.bin` (9,426,432 B, Float32 LE, all
    variables) plus `ian_2022.json`.
- **Checks**:
  - **Central MSLP minimum (ERA5)**: 971.9 hPa at 2022-09-28T10 UTC, at 25.75°N 82.75°W (south-west Florida shelf).
  - **At landfall**: NHC put landfall near Cayo Costa at about 19:05 UTC on 28 September (radar, NHC update
    2022-09-28 1910 UTC). At 2022-09-28T19 ERA5 has the centre at 26.5°N 82.25°W with 980.7 hPa.
  - **Strongest 10 m wind in the box**: 32.4 m s⁻¹ at 2022-09-28T11.
  - **Circulation sense**: the mean tangential wind is positive (**anticlockwise seen from above**) in all 96 hours
    (+9.5 to +15.6 m s⁻¹). At the MSLP minimum it is +14.7 m s⁻¹, so the area-mean vorticity inside 250 km is
    ζ̄ = 2v̄_t/r = +1.18×10⁻⁴ s⁻¹ (> 0, cyclonic in the NH). The radial wind is −8.1 m s⁻¹ (inflow in all 96 hours),
    and the mean inflow angle is 29°. **PASS.**
- **Honesty note for the script**: ERA5 at 0.25° does not resolve the eye wall. NHC's advisory gave about 940 hPa and
  150 mph (67 m s⁻¹) at landfall, against ERA5's 972 hPa and 32 m s⁻¹. Use the ERA5 field for the **pattern and
  sense of rotation**, not for intensity numbers. The track (MSLP argmin) moves in 0.25° grid steps: smooth it in the
  movie builder (for example, a 3–5 h running mean or a parabolic fit round the minimum).
- **Quick-look**: `outputs/ch00/data/p_ian_2022.png`.
- **Colab route**: load the movie copy. The refresh is anonymous (ARCO): `fluidpy.data.era5_arco.fetch_box(...)`,
  then `storm_product(...)`.
- **Credit line**: "Contains modified Copernicus Climate Change Service information 2026. Neither the European
  Commission nor ECMWF is responsible for any use that may be made of the Copernicus information or data it contains.
  ERA5 (Hersbach et al. 2020) via ARCO-ERA5 (Google Research)."
- **Disk**: C: 84.2 GB and G: 583.3 GB free, both before and after. Project data went from 6.28 to 6.29 GB.
