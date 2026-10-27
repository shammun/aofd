# ERA5-CDS-ciaran2023-850 — 850 hPa air masses round Ciarán, hourly (D3)

- **Route, first attempt (anonymous)**: ARCO-ERA5 `fetch_box` for t, q, u and v at 850 hPa, 01T12–02T12, over
  30–65°N, 40°W–15°E.
  - One ARCO chunk holds all 37 levels of one variable-hour, so 100 chunks crossed the network (about 10 GB).
  - It took **3,887 s (65 min)** and wrote 8,541,419 B.
- **Route, kept (free login)**: one CDS request through `fluidpy.data.cds.retrieve` → `fetch(retrieve=…)`.
  - Dataset `reanalysis-era5-pressure-levels`, level 850, area [65, −40, 30, 15], every hour of 1–2 Nov (48 h).
  - 11,155,301 B in 115 s, including the queue.
  - Both routes ran because the ARCO job looked dead: its log stayed empty, and the process check misread it. They
    agree to GRIB packing precision: max |ARCO − CDS| is 0.0008 K for T, 0.0007 m/s for u and v, and 1.6e-7 kg/kg for q.
  - **Lesson**: for one pressure level over many hours, CDS is far cheaper than ARCO.
- **Products**:
  - `era5_ciaran_2023_850hPa_1h.nc`: 01T12–02T12, 25 h, 5,604,593 B, repo and G:.
  - `era5_ciaran_2023_850hPa_1h_48h.nc`: 01T00–02T23, 10,749,446 B, G: only (over the 10 MB repo limit).
  - Variables t [K], q [kg/kg], u, v [m/s]. Latitude S→N, longitude −40…15.
- **Brest hourly** (second CDS time-series request, 27,239 B, 85 s): `era5_brest_2023-11-01_02_t2m_d2m_msl_1h.nc`
  (19,242 B, repo). It is registered under ERA5-CDS-timeseries.
  - MSLP and t2m reproduce the A1 table exactly (W49–W52 consistent).
  - The 2 m dew point is new:

    | Time (UTC) | 01T12 | 01T18 | 01T20 (warm sector) | 02T00 | 02T01 | 02T03 | 02T06 |
    |---|---|---|---|---|---|---|---|
    | Dew point (°C) | 7.6 | 10.6 | **13.0** | 10.1 | 11.0 | 7.5 | 6.6 |

  - Under the warm front the dew point rises by 5.4 K. Behind the cold front it falls by 3.5 K in 2 h.
- **Key numbers**:
  - T850 at the Brest grid point: 2.5 °C at 01T12 → **6.0 °C at 01T21** → 0.8 °C at 02T12.
  - Along 48.5°N at 01T18, T850 jumps from **1.0 °C at 14°W to 7.8 °C at 12°W (+6.8 K)** across the cold front.
    **W43 (≥ 5 K) passes.**
  - Warm-sector maximum over 42–56°N, 20°W–10°E: 11.2 °C at 01T18 and 14.8 °C at 02T00.
  - Largest q: 11.4 g/kg.
- **Pitfall**: 850 hPa lies below ground over the Atlas and the Alps. ERA5's values there are extrapolated (the bright
  spot near 31°N 0°E in the quick-look), so mask them with the orography in D2.
- **Licence verdict**: CC-BY 4.0 (Copernicus). **Redistributable: yes.**
- **Colab**: the committed 25-h file, no key. A refresh needs CDS (Colab Secret) or the slow anonymous ARCO route.
- **Quick-look**: `outputs/ch00/data/ql_ciaran_850.png`.
- **Disk**:
  - Before the CDS fetch: C: 74.0 GB and G: 576.3 GB free.
  - After: C: 74.0 GB and G: 576.2 GB free; project data 13.33 GB (raw 0.46 GB).
  - The ARCO job's own log: before C: 74.2 and G: 577.5; after C: 74.0 and G: 576.2. The G: drop mostly comes from
    another agent's render scratch.
