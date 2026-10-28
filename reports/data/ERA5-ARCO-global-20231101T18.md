# ERA5-ARCO-global-20231101T18 — ERA5 global 2 m temperature and 10 m wind, 18 UTC 1 Nov 2023 (movies #1a D2, #1b D2)

- **Route**: ARCO-ERA5 zarr `gs://gcp-public-data-arco-era5/ar/full_37-1h-0p25deg-chunk-1.zarr-v3` (anonymous).
  - Read with `fluidpy.data.era5_arco.fetch_box("2023-11-01T18", …, lat (−90, 90), lon (0, 359.75), variables t2m, u10, v10,
    tag "global")`, which goes through `fluidpy.data.fetch` and the disk guard.
  - The guard was given 12.47 MB (uncompressed subset). 3 single-level chunks, about 3 MB each over the network.
  - Raw file: 8,388,317 B in 5.0 s transfer (67 s including opening the store), sha256 `aa529bfc…beb8`.
- **Products**:
  - `era5_global_2023-11-01T18_sfc.nc`: 0.25°, 721 × 1440, 8,336,343 B, sha256 `592152b8…0b83`. On G: only.
  - `era5_global_2023-11-01T18_sfc_0p5.nc`: every second grid point (values unchanged), 361 × 720, 2,188,858 B,
    sha256 `3ca4cef7…d79e`. On G: and in the repo `data/derived/ch00/`.
  - Both have lat S→N, lon −180…179.75, t2m [K], u10/v10 [m s⁻¹], time 2023-11-01T18 UTC.
- **Checks**:
  - Global-mean t2m (cos-latitude weights, `fluidpy.diag.climatology.global_mean`) is 287.68 K. The range is 216.8–314.0 K.
  - Brest grid point (48.5° N 4.5° W): t2m 12.0 °C, u10 = (−5.61, 11.89) m/s. This matches the planning table
    (−5.6, 11.9).
  - Strongest 10 m wind on the globe: 27.7 m/s at 48.5° N 13.0° W. That is Ciarán's southern flank.
- **Quick look**: `outputs/ch00/data/ql_era5_global_2023-11-01T18.png`. Antarctica is south, the Sahara and South America are
  warm, the trades blow westward, and the Southern Ocean westerlies are visible. The orientation is correct.
- **Licence verdict**: CC-BY 4.0 (Copernicus). **Redistributable: yes**, with the attribution "Contains modified Copernicus
  Climate Change Service information 2026 …".
- **Fallback**: A3 (12 UTC 2 Nov) is no longer needed for s02 / s16.
- **Colab**: loads the committed 0.5° product. No key needed.
- **Disk**: before C: 68.0 GB, G: 543.3 GB free; after C: 68.0 GB, G: 543.3 GB free. Nothing evicted.
