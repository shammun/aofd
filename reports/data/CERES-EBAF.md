# CERES-EBAF — CERES EBAF-TOA Ed4.2.1 monthly outgoing longwave radiation, 2000-03 → 2026-08 (movie #4 D4, DT61)

- **New fetcher F6**: `fluidpy.data.ceres` (`../Fluid Dynamics/fluidpy/data/ceres.py`).
  - `fetch_ebaf_toa(start, end, var="toa_lw_all_mon", version=None, refresh=False)` returns an `xarray.Dataset`.
  - Its attrs are licence "NASA open data …", citation Loeb et al. 2018 J. Climate 31, 895, `dataset_key`, `granule` and
    `edition`.
  - Also in the module: `open_ebaf`, `ebaf_product`, `find_granule`, `granule_months`.
  - Tests: `../Fluid Dynamics/tests/data/test_ceres.py`, five tests, no network. The recorded tiny fixture is
    `tests/data/fixtures/ceres_ebaf_toa_tiny.nc` (40.6 KB: 3 months, every 10th 1° cell, one fill value).
    - V1: the recorded tiny file parses.
    - The fetch goes through `fluidpy.data.fetch` with the right name and size.
    - Product global means.
    - V7: the global mean of the product's climatology lies in 235–245 W m⁻²; ours equals CERES's series to < 0.5 W m⁻².
- **Route**:
  - Earthdata (`earthaccess`, netrc login) finds collection `CERES_EBAF-TOA`, **Edition4.2.1** (C3880497643-LARC_CLOUD).
    **Edition4.2 is no longer listed**: 4.2.1 superseded it (TOA release date 25 Nov 2024; it uses MERRA-2 inputs).
  - One granule holds the whole record: `CERES_EBAF-TOA_Edition4.2.1_200003-202608.nc`. It is netCDF-3 classic with 67
    variables, about 0.96 GB.
  - Server-side subsetting is not available. The cloud OPeNDAP endpoint returns 404 for this collection.
  - Remote streaming with `earthaccess.open` + scipy works (the first test took 430 s, all in memory). The real run then
    failed on a CloudFront 503.
  - The fetcher therefore downloads the granule into a temporary folder inside `fetch(retrieve=…)`, with the guard given
    the peak of 1043 MB. It cuts `toa_lw_all_mon` + `gtoa_lw_all_mon` and deletes the granule.
  - Result: raw subset 23,796,059 B (zlib), sha256 `2849df2e…9066`; 95.8 s transfer, 155 s in total.
- **Product**: `ceres_ebaf-toa_olr_2000-03_2026-08.nc` (244,593 B, sha256 `0aa7e897…68bd`). On G: and in the repo.
  - Our cos-latitude global-mean series, CERES's `gtoa_lw_all_mon`, annual means of the complete years 2001–2025, the
    climatology map 2001-01…2026-08 and the 2026-08 map.
  - Longitude −179.5…179.5, latitude S→N.
- **DT61**: global-mean OLR over 2001-01 → 2026-08 is **240.61 W m⁻²**. Over 2001–2025 it is 240.58. CERES's own global
  series gives 240.51. All lie in 235–245: **PASS**.
  - Our global mean vs CERES's monthly series: maximum |difference| 0.11 W m⁻² (independent route).
  - Annual means: 240.06 (2001) → 241.45 W m⁻² (2025).
  - T_e = (240.61/σ)^¼ = 255.23 K (σ CODATA 2022). The movie's rounded 240 W m⁻² gives 255.06 K (DT60).
- **Quick look**: `outputs/ch00/data/ql_ceres_olr.png`.
  - OLR is low over the ITCZ, the Maritime Continent, Tibet and Antarctica.
  - It is highest (~300 W m⁻²) over the subtropical deserts and clear subtropical oceans.
  - The seasonal cycle of the global mean runs 236–246 W m⁻², peaking in July.
- **Licence verdict**: NASA open data, "openly shared, without restriction, in accordance with the EOSDIS Data Use and
  Citation Guidance". **Redistributable: yes.** Credit: "CERES EBAF-TOA Ed4.2.1, NASA Langley Research Center / ASDC". Cite
  Loeb et al. (2018) and the dataset DOI 10.5067/TERRA-AQUA-NOAA20/CERES/EBAF-TOA_L3B004.2.1 (taken from the file's
  attributes).
- **Pitfalls**:
  - The granule is re-issued each month with one more month, so its name and hash change. Refresh with `refresh=True`.
  - The netCDF-3 file has no chunk index, so it cannot be cut remotely.
  - `earthaccess` reports `size` in MiB.
- **Colab**: loads the committed product (no Earthdata key). The refresh path needs the Colab Secrets
  `EARTHDATA_USERNAME`/`EARTHDATA_PASSWORD` (`strategy="environment"`) and about 1 GB of temporary disk.
- **Disk**: before C: 67.8 GB, G: 542.6 GB free; after C: 67.8 GB, G: 542.6 GB free. The temporary 0.96 GB copy was deleted
  in the same call. Nothing evicted.
- **Runner-up not needed**: NOAA Interpolated OLR.
