---
name: open-data
description: Data and reference-value policy for aofd - the tier order (analytic/synthetic → cited benchmarks → anonymous open data → free-login APIs → substitute → labelled pseudo-data), the R3 dataset catalogue keys and exact access routes (NCEP1/NCEP2 PSL HTTPS, ARCO-ERA5 and WeatherBench2 zarr, ERA5 CDS, MERRA-2/ECCO/AIRS/CERES via earthaccess, OLR, FU Berlin QBO, WOA23, MIMOC, GODAS, ERSST/OISST, RAPID, GDP drifters, Orsi/Park–Durand fronts, Natural Earth, ETOPO), the one download door fluidpy.data.fetch() with tools/disk_guard.py (G: floor 50 GB, cap 150 GB; C: floor 40 GB; free space reported before and after), the G: data root, caching and eviction, data/registry.yaml with licence and redistributable flags, derived products (≤ 10 MB each, ≤ 150 MB committed), pydap for OPeNDAP on Windows, credentials, and the Colab default path that loads committed derived products with no keys. Load whenever a script, test, figure, scene, movie or notebook needs data or a reference number.
---

# open-data — where numbers and fields come from

## 1. Tier order (stop at the first tier that works)
1. **Analytic / synthetic** (deterministic, seeded) — the default for everything the book derives.
2. **Cited published benchmarks** in `reference/chNN/` (+ `SOURCES.md` row: value · source · DOI/URL · how obtained ·
   date). Never quote a benchmark from memory; "digitised from a plot" → looser tolerance, stated.
   GFD catalogue (verify-implementation): RAPID 17 Sv at 26°N, QBO ≈ 28 months, Kelvin h_e ≈ 25 m, Munk width,
   Eady σ_max = 0.31 f Λ/N.
3. **Anonymous open data** (PSL, NCEI, PMEL, ARCO/WB2, AADC, SEANOE, Natural Earth, FU Berlin, RAPID, GDP).
4. **Free-login APIs with server-side subsetting** (Copernicus CDS, NASA Earthdata, RDA, CMEMS) — accounts exist and
   were tested 2026-10-20 (CDS ERA5 monthly single/pressure levels; Earthdata ECCO + MERRA-2).
5. **Substitute dataset** with the same physics, flagged in the caption ("observed analogue").
6. **Pseudo-data** (`fluidpy.data.pseudo`) stamped "ILLUSTRATIVE — synthetic data" (skill `figure-reproduction`).
Values from the book itself are **not** a tier: private `tests/book_values_chNN.json` (git-ignored), `skipif`-guarded
tests; reports state only derived statements.

## 2. Dataset catalogue (R3 §2; keys used in `data/registry.yaml`)
| Key | Dataset | Route | Login | Licence |
|---|---|---|---|---|
| NCEP1 | NCEP/NCAR R1 (1948–, 2.5°, 17 levels to 10 hPa) | `https://downloads.psl.noaa.gov/Datasets/ncep.reanalysis.dailyavgs/pressure/{var}.{YYYY}.nc`; monthly `…/ncep.reanalysis.derived/pressure/{var}.mon.mean.nc`; daily LTM `….day.ltm.nc`; stress `…/surface_gauss/{u,v}flx.mon.mean.nc` | none | public domain (Kalnay 1996) |
| NCEP2 | NCEP–DOE R2 | `…/ncep.reanalysis2.derived/pressure/{var}.mon.mean.nc` | none | public domain |
| ARCO | ARCO-ERA5 0.25° hourly 37 levels | zarr `gs://gcp-public-data-arco-era5/ar/full_37-1h-0p25deg-chunk-1.zarr-v3` (anon) | none | CC-BY 4.0 (Copernicus) |
| WB2 | WeatherBench2 ERA5 (1.5°/0.7°, incl. RH, PV; 1990–2019 climatology) | `gs://weatherbench2/datasets/era5/…` | none | CC-BY 4.0 |
| ERA5-CDS | ERA5 on CDS (long monthly/daily series to 1 hPa) | `cdsapi`, `~/.cdsapirc` (url `https://cds.climate.copernicus.eu/api`) | CDS | CC-BY 4.0 |
| MERRA2 | MERRA-2 (to 0.1 hPa) | GES DISC via `earthaccess` / OPeNDAP | Earthdata | NASA open |
| OLR | NOAA interpolated daily OLR | `…/interp_OLR/olr.day.mean.nc` (349 MB) | none | public domain |
| CERES, AIRS | CERES EBAF; AIRS L3 | Earthdata / ASDC | Earthdata | NASA open |
| FUB | FU Berlin QBO (70–10 hPa) | `https://www.geo.fu-berlin.de/met/ag/strat/produkte/qbo/singapore.dat` | none | research use, cite Naujokat 1986 |
| SSW, IDX | SSW compendium; Niño-3, SOI, RMM | NOAA CSL; PSL/CPC (BoM needs a browser User-Agent) | none | open |
| WOA23 | World Ocean Atlas 2023 | `https://www.ncei.noaa.gov/data/oceans/woa/WOA23/DATA/…` | none | public domain |
| MIMOC | isopycnal climatology | `https://www.pmel.noaa.gov/mimoc/data/…nc.gz` | none | free, cite |
| GLODAP, RG | GLODAPv2; Roemmich–Gilson Argo | NCEI / SIO | none | CC-BY / free |
| ECCO | ECCO V4r4 state estimate | `earthaccess` → PO.DAAC (`ECCO_L4_*_V4R4`); **stream and reduce** (~20 GB raw → ~100 MB means) | Earthdata | NASA open |
| GODAS | NCEP GODAS | `…/Datasets/godas/{var}.{YYYY}.nc` | none | public domain |
| SST | OISST v2, ERSST v5 | `…/noaa.oisst.v2.highres/sst.mon.mean.nc`, `…/noaa.ersst.v5/sst.mnmean.nc` | none | public domain |
| RAPID | 26°N MOC | `https://rapid.ac.uk/sites/default/files/rapid_data/moc_transports.nc` | none | open, cite |
| CURR, DRIFT | GDP mean velocity; drifter trajectories (ERDDAP); OSCAR; CMEMS | AOML / ERDDAP / PO.DAAC / `copernicusmarine` | none / Earthdata / CMEMS | public domain / CC0 / attribution |
| FRONTS | Orsi 1995 (AADC), Park & Durand 2019 (SEANOE 10.17882/59800) | HTTPS | none | CC-BY 4.0 |
| NE, ETOPO, GEBCO | Natural Earth; ETOPO 2022; GEBCO 2024 | `naturalearth.s3.amazonaws.com/…`; NCEI THREDDS | none | public domain / attribution |
| GSW | TEOS-10 `gsw` | pip | — | BSD-3 |
Pitfalls: PSL latitudes run N→S (`sortby('lat')`); old PSL paths `…/Monthlies/` return 403; PSL OPeNDAP sometimes 503
(fall back to HTTPS); `uflx/vflx` sign check against the trades; ARCO is one hour per ~150 MB chunk (snapshots only,
time series via CDS/NCEP); WOA23 stores in-situ T and practical S (convert with gsw); confirm ECCO short-names with
`earthaccess.search_datasets`.

## 3. One door: `fluidpy.data.fetch()` + `tools/disk_guard.py` (PLANNING §15.2, §15.4)
- **Every download goes through `fluidpy.data.fetch(key_or_url, …)`**, which calls `tools/disk_guard.py`: estimate size
  (HTTP `Content-Length`, registry size, or zarr/OPeNDAP subset size), check floors and cap, log the result, then
  download. **No raw `curl`/`wget`/`requests.get` for data** (a PreToolUse hook warns).
- **Data root**: `book.yaml → data.root = "G:/Geophysical Fluid Dynamics/aofd-data"`, overridden by env
  `AOFD_DATA_ROOT`; on Colab `/content/aofd-data`. Layout `raw/` (downloads), `derived/` (reduced products),
  `scratch/` (incl. `scratch/movies` render scratch), `logs/` (`downloads.log`, `evictions.log`), `cache/{cartopy,pooch}`
  (`CARTOPY_DATA_DIR`). No other absolute path anywhere.
- **Guard**: G: keeps ≥ **50 GB free** and the project's data ≤ **150 GB**; C: keeps ≥ **40 GB free** (envs, Node,
  Remotion, Playwright, repo). A download/render/install that would cross a floor does not start. **If G: is missing,
  stop with a clear message — never fall back to C:.**
- **Report free space on C: and G: before and after** every data step, and in every `/do-chapter` summary and `/status`
  (cache size, anything evicted).
- **Download less**: server-side subsetting (OPeNDAP slices, zarr selections, CDS `area/grid/levels`) for the needed
  levels, dates and region; reduce to the derived product straight away.
- **Eviction (only when needed)**: least-recently-used **raw** files that the registry tracks, that can be downloaded
  again, and whose derived product exists. Never delete derived products, anything outside the data root, or any file
  the user made. Log each eviction (path, size, date) in `logs/evictions.log`. If the floor would still be crossed:
  stop, ask the user, suggest what could be cleaned (without deleting it).

## 4. Access patterns (house style)
```python
import xarray as xr
ds = xr.open_dataset(path).sortby("lat")                                  # PSL files: lat N->S
z500 = xr.open_zarr("gs://gcp-public-data-arco-era5/ar/full_37-1h-0p25deg-chunk-1.zarr-v3",
                    chunks=None, storage_options={"token": "anon"})["geopotential"].sel(time="2015-02-09T12", level=500) / 9.80665
ds = xr.open_dataset("https://…/dodsC/…", engine="pydap")                 # Windows: netCDF4's curl lacks TLS CA certs
```
CDS via `cdsapi.Client().retrieve(...)` with server-side `area`, `grid`, `pressure_level`; Earthdata via
`earthaccess.login(strategy="netrc")` locally, `"environment"` on Colab. Fetchers return a path or an `xarray.Dataset`
and have numpy docstrings with source, licence, citation, units.

## 5. Registry, derived products, credits
- `data/registry.yaml` (validated by `tools/data_registry.py`; schema-checked by the post-write hook): key, URL, access
  route, login, licence + licence URL, citation, size, sha256 (fixed files), variables, subset, coordinate order and sign
  conventions, fetch date, **`redistributable: yes/no`**, attribution string.
- **Derived products** (`.nc` float32 + zlib, provenance attrs: source, licence, citation, processing commit) live on G:
  `derived/`; small ones needed by Colab and the site are copied to repo `data/derived/chNN/fig_NN_MM*.nc|.npz`:
  **≤ 10 MB each, ≤ 150 MB total, redistributable only** (public domain, CC-BY, NASA open; JRA/CMEMS checked case by
  case). Larger → GitHub Release asset or Zenodo.
- `DATA_CREDITS.md` and `data.html` are generated from the registry; every figure caption ends with its credit line.
- Pooch hashes pinned for fixed files (yearly files, climatologies, WOA23, MIMOC); `None` + fetch date for growing files.

## 6. Credentials
CDS token in `%USERPROFILE%\.cdsapirc`; Earthdata in `%USERPROFILE%\_netrc` (and `.netrc`); encrypted copies in Windows
Credential Manager, service `aofd` (`tools/secrets_vault.py save/list/colab/restore`). **Never** in a repo, notebook,
report, log or memory file; `tools/check_secrets.py` blocks them in commits and pushes. Check access with
`.venv/Scripts/python.exe tools/check_data_access.py [cds|earthdata|marine]`. On Colab: Secrets `CDSAPI_KEY`,
`EARTHDATA_USERNAME`, `EARTHDATA_PASSWORD`, only on the refresh path.

## 7. Colab
Default path: notebooks load committed derived products (or a Release asset) — **no keys, every cell in seconds**.
Refresh path (`REFRESH=True`): anonymous sources as-is; keyed sources via Colab Secrets; heavy reductions (ECCO 20 GB,
high-Ra convection) flagged "local only". Do not mount Drive by default.

## 8. data-scout duties (R3 §5.1)
HEAD-check and actually open the file; record size, sha256, variables, coordinate order, sign conventions; read the
licence page and set `redistributable`; write the fetcher + reduction + derived product with provenance; quick-look PNG
for itself; `reports/data/<key>.md` (route, licence verdict, size, pitfalls, Colab route, **free space C:/G: before and
after**). Must not commit raw data, store keys, use book figures/tables as data, exceed budgets without asking, or call
a dataset open without opening it.

## Never
Fabricate a benchmark value or citation, silently swap datasets, embed base64 data in notebooks, commit raw or
book-derived data, or download outside the one door.
