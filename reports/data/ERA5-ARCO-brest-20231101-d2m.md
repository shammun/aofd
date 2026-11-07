# ERA5-ARCO-brest-20231101-d2m: ERA5 hourly 2 m dew point and temperature near Brest, 1–2 Nov 2023 (cross-check)

Registry entry `ERA5-ARCO-brest-20231101-d2m` (provenance audit, 2026-11-07). It registers the derived product
`derived/ch00/era5_brest_2023-11-01_02_d2m_t2m_1h.nc`, which before was named only in a `raw_note` of `ERA5-CDS-ciaran2023-850`.

- **Raw**: `raw/ERA5-ARCO/era5_brest_d2m-t2m_2023-11-01T00_2023-11-02T23_1h.nc`.
  - 21,748 B, sha256 `1901c404…3f5b`. Fetched 2026-10-27 from ARCO-ERA5 (anonymous) through `fetch_box`.
  - The same raw file is also listed under `ERA5-CDS-ciaran2023-850`, which uses it as a cross-check route.
- **Derived**: `derived/ch00/era5_brest_2023-11-01_02_d2m_t2m_1h.nc`, 26,353 B, sha256 `272da5ec…d64e`. Opened 2026-11-07:
  - variables d2m and t2m [K], float32;
  - 48 hours × 5 × 5 points; latitude S→N 48.0–49.0; longitude −5.0 to −4.0 (wrapped from 355–356 E);
  - provenance attributes present: `dataset_key`, `source_url`, `licence`, `citation`, `processing`, `fluidpy_commit c4cb835+dirty`, `created`.
- **Role**: an ARCO cross-check of the CDS point series `era5_brest_2023-11-01_02_t2m_d2m_msl_1h.nc` (`ERA5-CDS-timeseries`).
  That CDS series is the one in the repo and the one movie `ch00_weather_basics` uses. No movie reads this product directly.
  It stays on G: only.
- **Licence verdict**: CC-BY 4.0 (Copernicus). **redistributable: yes.**
- **Disk**: no download in this task. 2026-11-07: C: 112.4 GB, G: 472.8 GB free. The raw file is evictable: the derived product exists.
