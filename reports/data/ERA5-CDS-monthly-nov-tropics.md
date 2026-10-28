# ERA5-CDS-monthly-nov-tropics — ERA5 monthly 10 m wind and SST, November 1991–2023, 30° S–30° N (movie #1a D5)

- **Route**: CDS API through `fluidpy.data.cds.retrieve`.
  - Request: `reanalysis-era5-single-levels-monthly-means`, monthly_averaged_reanalysis, `10m_u/v_component_of_wind`,
    `sea_surface_temperature`; month 11 of 1991…2023; area [30, −180, −30, 180]; grid 1° × 1° (server-side); netCDF.
  - 4,513,000 B in 100.8 s transfer (165 s including the queue), sha256 `b2cae2c4…af9af`.
  - The whole tropical band was taken (not just 120° E–80° W), so the request does not cross the dateline and the
    product can be reused.
- **Product**: `era5_monthly_u10-v10-sst_nov_1991-2023_30S-30N_1deg.nc` (4,672,782 B, sha256 `6fced880…34db27`). On G: and
  in the repo.
  - Dims: (time 33, lat 61 S→N, lon 360 −180…179).
  - Variables: u10, v10 [m s⁻¹], sst [K, NaN over land].
  - Also stored: `*_clim` (the 1991–2020 November mean) and `*_anom_2023` (Nov 2023 minus `*_clim`), from
    `fluidpy.diag.climatology.monthly_anomaly` (F6), component-wise for the wind.
- **Check VI49** (cos-latitude mean over 5° S–5° N, 170–150° W):

  | | Climatology (Nov 1991–2020) | Nov 2023 | Anomaly |
  |---|---|---|---|
  | u10 | **−5.04 m/s** | **−3.72 m/s** | **+1.32 m/s** |
  | v10 | +0.51 | +0.38 | −0.13 |
  | SST | 301.03 K | 302.77 K | +1.75 K |

  - The anomaly sign is > 0, so the trades were weaker (westerly anomaly): **PASS**.
  - The magnitudes differ from the planning values (−6.0 / −3.5 / +2.5). **s12h should be reworded to the data**:
    about −5.0 → −3.7, a vector anomaly of about +1.3 m/s toward the east.
  - Niño-3.4 (5° S–5° N, 170–120° W) SST anomaly, Nov 2023: +1.81 K.
  - Equatorial (3° S–3° N) u10 anomaly: +2.9 m/s at 160° E, +3.9 m/s at 170° E. The westerly anomaly is strongest just
    west of the box.
- **Quick look**: `outputs/ch00/data/ql_era5_nov2023_anom.png`. The warm equatorial tongue runs 180°–280° E.
- **Licence verdict**: CC-BY 4.0 (Copernicus). **Redistributable: yes.**
- **Runner-up not needed**: NCEP R1 `uwnd.10m.mon.mean.nc`.
- **Colab**: loads the committed product.
- **Disk**: before C: 68.0 GB, G: 543.9 GB free; after C: 68.0 GB, G: 543.2 GB free. Nothing evicted.
