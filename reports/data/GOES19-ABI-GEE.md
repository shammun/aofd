# GOES19-ABI-GEE — GOES-19 ABI bands 2, 8, 13 at 18 UTC 27 Oct 2026 and the hourly loop (movie ch00_reading_weather_maps, D9)

- **Route**:
  - Earth Engine `NOAA/GOES/19/MCMIPF` (full disk, 16 bands, 2 km, every 10 min), project `uhiphd` (the user's
    authentication; nothing stored).
  - `ee.data.computePixels` on an EPSG:4326 grid (nearest neighbour); the raw integers are calibrated with each image's
    `CMI_Cnn_scale` / `offset`.
  - Call chain: `fluidpy.data.goes.fetch_cmi_ee` → `fluidpy.data.fetch(retrieve=)`, so each set is **one guarded
    transfer**, an `.npz` under `raw/GEE/`.
  - Run from `.venv-maps` (it has `earthengine-api`) with `PYTHONPATH=../Fluid Dynamics` and TEMP on G:.
  - F8 also adds `satellite=` to `goes.find_file` / `fetch_abi` / `bucket()`. The default stays 16, unchanged.
    GOES-19 is GOES-East since April 2025, and `noaa-goes16` no longer covers it.
- **Licence verdict**: NOAA data, public domain. Access is through Earth Engine's noncommercial tier, which is fine
  because the movies are non-monetised. **Redistributable: yes.** Credit: "NOAA GOES-19 ABI (public domain), via Google
  Earth Engine".
- **Downloads**:

  | File | Bytes | Time | Content |
  |---|---|---|---|
  | `goes19_d9_C02-C08-C13_2026-10-27T1800_0.04deg.npz` | 7,153,448 | 33.8 s | 3 bands, 1000×1875 |
  | `goes19_d9_C02_2026-10-27T1800_0.02deg.npz` | 7,151,018 | 9.9 s | band 2, 2000×3750 |
  | `goes19_d9_loop_C02-C13_2026-10-27T18_2026-10-27T23_0.04deg.npz` | 25,298,523 | 28.5 s | 6 hourly scans × 2 bands |

  The **00–06 UTC 28 Oct** scans were not yet in Earth Engine at fetch time (the latest scan at 00:10 UTC was 23:20;
  the lag is about 50 min). Earth Engine keeps the collection, so this is not urgent. Re-run
  `fetch_d9`-style with `ee_scans(19, "2026-10-28T00:00", "2026-10-28T06:10")` after about 07 UTC 28 Oct.
- **Derived products** (`movie_rwm.goes_products`; repo `data/derived/ch00/`):
  - Encoding: 8-bit grey PNG, `k=0` = missing, `value = lo + (k−1)(hi−lo)/254`.
  - Ranges: C02 is 0…1 (reflectance), C08 is 180…280 K (0.39 K steps), C13 is 180…320 K (0.55 K steps).
  - `rwm_goes19_2026-10-27T1800_C02.png` (0.02°) is 2,587,790 B, `…_C08.png` is 458,665 B, `…_C13.png` is 852,543 B,
    and the sidecar `rwm_goes19_2026-10-27T1800.json` is 2,229 B.
  - The loop is `rwm_goes19_loop_2026-10-27T{18..23}_{C02,C13}.png`, 12 files, 7.6 MB together, with sidecar
    `rwm_goes19_loop.json`.
- **Checks**:
  - The scan starts at 18:00:20 and ends at 18:09:51 UTC.
  - C13 spans 200.2–305.5 K (p1 225.7, p99 296.4), inside 180–320 K.
  - **RM34**: C08 spans 197.7–252.0 K. The minimum is 2.3 K below the stated 200 K, so widen the wording to "about
    200–250 K". A dry tongue is present: 22.8 % of pixels within 800 km SW of the 982 low have C08 > 245 K (max
    251.7 K).
  - **RM44, IR part**: along the 982 low's main cold front (hi-res, from 43.0°N 42.0°W, 97 points every ~20 km, the
    coldest C13 within ±0.12°), BT < 240 K at **56 %** of points (median 233.5 K). This is **just below the 60 %**
    CHECK; the narration should say "most of the front" rather than a number.
  - The band-2 frames go dark after sunset, from about 21 UTC (night).
  - The quick-looks `outputs/ch00/data/ql_rwm_goes19_*` show the comma cloud at 43°N 43°W with the front trailing SW,
    and the WV dry slot wrapping into the low.
- **Colab route**: the committed PNGs and JSON; no Earth Engine needed.
- **Disk**: before, C: 48.5 GB and G: 561.4 GB free. After, C: 66.5 GB and G: 561.3 GB. Nothing evicted.
