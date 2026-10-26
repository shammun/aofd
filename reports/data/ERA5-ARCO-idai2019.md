# ERA5-ARCO-idai2019 — Tropical Cyclone Idai, ERA5 hourly 0.25° 10 m wind and MSLP (movie ch00_cross_product_why, scene 10)

- **Route**: the same as `ERA5-ARCO-ian2022` (ARCO-ERA5 zarr, anonymous, `fluidpy.data.era5_arco.fetch_box`).
  - **Selection**: 2019-03-11T00 to 03-15T23, hourly (120 times); 30–10°S, 30–50°E (81 × 81); `u10`, `v10`, `msl`.
  - **Guard size**: 9.45 MB. **File written**: 6,566,597 B in 119.3 s (from `logs/downloads.log`).
  - **Network transfer**: about 1.05 GB.
- **Timing note**: the in-script timer read 7602 s for this step because the host clock jumped about 2 h (the machine
  probably slept) during the run. The transfer time is the log's 119.3 s.
- **Licence verdict**: Copernicus licence / CC-BY 4.0, attribution required. **Redistributable: yes, with the credit
  line.**
- **Derived product**: `G:/Geophysical Fluid Dynamics/aofd-data/derived/ch00/era5_idai_2019.nc` (6.54 MB). It has the
  same variables as Ian.
  - **Movie copy**: `movies/ch00/ch00_cross_product_why/data/real/idai_2019.bin` (9,450,240 B) plus `idai_2019.json`.
- **Checks**:
  - **Central MSLP minimum (ERA5)**: 974.3 hPa at 2019-03-14T14 UTC, at 19.75°S 36.0°E (Mozambique Channel, about
    130 km off Beira).
  - **Track**: 17.25°S 43.0°E on 11 March (off western Madagascar), then due west along about 19.5–19.75°S.
  - **At landfall**: WMO and Copernicus EMS give landfall near Beira at about 23:30 UTC on 14 March. At 2019-03-14T23
    ERA5 has the centre at 19.75°S 34.75°E with 986.0 hPa, then inland: 996 hPa at 15T06 and 1005 hPa at 15T18.
  - **Strongest 10 m wind in the box**: 31.5 m s⁻¹ at 2019-03-14T08.
  - **Circulation sense**: the mean tangential wind (50–250 km) is negative (**clockwise seen from above**) in all
    120 hours (−4.0 to −17.7 m s⁻¹). At the minimum it is −11.7 m s⁻¹, so ζ̄ = −9.4×10⁻⁵ s⁻¹ (< 0, cyclonic in the
    SH). The radial wind is −8.0 m s⁻¹ (inflow in all 120 hours), and the inflow angle is 35°. **PASS.**
- **Honesty note**: ERA5 under-resolves the core. Idai's reported peak was about 940 hPa, against ERA5's 974 hPa. Use
  the field for the pattern and the rotation sense. The track moves in grid steps, so smooth it as for Ian.
- **Quick-look**: `outputs/ch00/data/p_idai_2019.png`.
- **Colab route**: load the movie copy. The refresh is anonymous (ARCO).
- **Credit line**: "Contains modified Copernicus Climate Change Service information 2026. Neither the European
  Commission nor ECMWF is responsible for any use that may be made of the Copernicus information or data it contains.
  ERA5 (Hersbach et al. 2020) via ARCO-ERA5 (Google Research)."
- **Disk**: before, C: 84.2 GB and G: 583.3 GB free. After, C: 76.7 GB and G: 583.3 GB. Project data went from 6.29
  to 6.30 GB. This step wrote 6.6 MB to G: and 9.5 MB to the repo on C:. The 7.5 GB C: drop happened during the
  clock jump and is **not** from these downloads: another process, or the system (pagefile/sleep), used C:. C: had
  recovered to 78.7–78.9 GB by the end of P4/P5.
