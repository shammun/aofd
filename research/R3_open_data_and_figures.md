# R3 — Open data and figure reproduction for the Vallis (AOFD, 2nd ed., 2017) teaching site

*Research note, 2026-10-20. Companion file: `R3b_figure_catalogue.md` (all 360 figures, one row each).*
*Everything here is in our own words. No book text beyond figure numbers and short topic labels. Book crops stay in `_private/`.*

---

## 0. The decisions in one screen

| Question | Answer |
|---|---|
| How many figures need data? | **360 figures** in all. **60 are observational** (16 maps, 44 sections, zonal means, time series or spectra) and need downloads. **8** are output from complex models (GCMs): we rebuild them from reanalysis or from a reduced model, with a label saying which. **41** are model output we simulate ourselves. **124** are analytic plots and **127** are schematics. All 18 reference crops are covered by a recipe in §3. |
| Default atmosphere source (no login) | **NCEP/NCAR R1** from NOAA PSL over plain HTTPS: daily averages, monthly means and daily long-term means, 17 levels up to 10 hPa. For 0.25° detail or anything up to 1 hPa: **ARCO-ERA5** (Google Cloud zarr, anonymous) and the **WeatherBench2** ERA5 stores (anonymous, coarser, include a 1990–2019 climatology). |
| Long stratospheric time series (QBO up to 1 hPa) | **ERA5 monthly means from the Copernicus CDS** (free account and API key). Without a key: **FU Berlin `singapore.dat`** (70–10 hPa, anonymous). **MERRA-2** (free Earthdata login) reaches 0.1 hPa. |
| Default ocean sources | **WOA23** (NCEI, anonymous) for T, S and density sections. **MIMOC** (PMEL, anonymous; it ships an *isopycnal* grid) for PV on isopycnals. **ECCO V4r4** (NASA Earthdata, free login, via `earthaccess`) for transport, the barotropic streamfunction and the MOC. **RAPID** at 26°N as an independent check. |
| Small "always works" data | NOAA interpolated OLR, ERSST v5, OISST, GODAS, PSL/CPC index files, Natural Earth, ETOPO 2022, Orsi and Park–Durand fronts, FU Berlin QBO, RAPID. All anonymous HTTPS (all checked on 2026-10-20). |
| What is committed | Code; a data registry (URL, licence, citation, size, sha256, date fetched); **small derived products** (≤ 10 MB each, ≤ 150 MB in total) from public-domain or CC-BY sources; generated figures. **Never committed:** raw downloads, anything needing a login to redistribute, and book crops. |
| Colab | Notebooks load the committed (or GitHub-Release) derived products first, so Colab needs **no keys**. The full pipeline (download → reduce) runs locally or on Colab with keys stored in Colab *Secrets*. |
| New agents | **`data-scout`**: finds the source, checks the licence, downloads, caches, reduces to a derived product and writes the registry entry. **`figure-reproducer`**: writes the plotting code and the caption, checks the numbers, and makes a private side-by-side with the reference crop. Specs in §5. |
| Copyright rule for figures | We reproduce **the science, not the artwork**: same variable, region, projection type and contour logic, but our own colormaps (cmocean or viridis), layout and caption, with a data credit. Schematics are redrawn from the physics, never traced. |

---

## 1. How the figure census was done

* Captions were found in the PDF text with pymupdf. We matched `Fig. N.M` at the **start of a text block**, which catches real captions, and added a second pass that catches any `Fig. N.M` mention, which picks up 6 captions the first pass missed (7.15, 11.5, 14.2, 21.10, 21.27, 22.21). Together the two passes give **360 figures**, with no gaps in any chapter's numbering. The scripts are in the scratchpad (`caps.py`, `caps2.py`, `catalogue.py`). They are not committed, because their raw output contains caption text.
* Each figure was classified by hand from its caption (`R3b_figure_catalogue.md`):

| Type | Count | Plan |
|---|---|---|
| SCH schematic | 127 | Redraw as our own diagram where it teaches something, often as an explainer. Never trace. |
| ANA analytic | 124 | `fluidpy`-style tested functions. No data. |
| SIM we simulate | 41 | numpy/scipy (Dedalus optional). Cache the expensive runs as derived products. |
| SEC observational section / series / spectrum | 44 | Datasets in §2. |
| MAP observational map | 16 | Datasets in §2, cartopy. |
| GCM complex-model output | 8 | Reanalysis composite or a reduced model, labelled "model analogue" or "illustrative". |

* The chapters with the most data figures are 15 (EP fluxes and streamfunctions), 17 (stratosphere), 18 (water vapour) and 19–22 (ocean). Chapters 1–13 are almost entirely analytic or simulated. Their only data figures are 7.11 (ocean N profile), 11.4 (lab spectra), 12.9 (aircraft spectra), 12.13 (deformation-radius map) and 13.3–13.4 (drifters).

---

## 2. Dataset catalogue

"Login" means a **free** account. Checks were made on 2026-10-20: ✅ means the URL returned HTTP 200 and the file size shown; ⚠ means it needs attention. Licences are summarised; the `data-scout` re-reads the licence page and stores the exact URL in the registry.

### 2.1 Atmosphere

| Key | Dataset | Access route (exact) | Login | Licence | Size (typical pull) | Notes |
|---|---|---|---|---|---|---|
| **NCEP1** | NCEP/NCAR Reanalysis 1 (1948–present, 2.5°, 17 p-levels to 10 hPa; RH/q only to 300 hPa) | HTTPS ✅ `https://downloads.psl.noaa.gov/Datasets/ncep.reanalysis.dailyavgs/pressure/{var}.{YYYY}.nc` (daily), `.../ncep.reanalysis.derived/pressure/{var}.mon.mean.nc` (monthly), `.../ncep.reanalysis.derived/pressure/{var}.day.ltm.nc` (daily climatology), `.../ncep.reanalysis/pressure/{var}.{YYYY}.nc` (4×daily), `.../ncep.reanalysis.derived/surface_gauss/{u,v}flx.mon.mean.nc` (wind stress). OPeNDAP: `https://psl.noaa.gov/thredds/dodsC/Datasets/...` ⚠ (returned 503 on the test day; HTTPS works) | none | US Gov. public domain; cite Kalnay et al. 1996 | daily file 40–165 MB per variable per year; monthly 0.4 GB; `hgt.day.ltm` 256 MB | ⚠ The old paths `ncep.reanalysis/Monthlies/...` and `ncep.reanalysis/Dailies/...` now return **403**: use the paths here. `uflx/vflx` are surface momentum fluxes, so check the sign against the trades (τˣ < 0) before using them as wind stress. Latitude runs N→S. |
| **NCEP2** | NCEP–DOE R2 (1979–present, to 10 hPa) | ✅ `https://downloads.psl.noaa.gov/Datasets/ncep.reanalysis2.derived/pressure/{var}.mon.mean.nc` (daily: `ncep.reanalysis2.dailyavgs/`) | none | public domain | 0.26 GB per monthly variable | Better surface fluxes than R1; same 10 hPa top. |
| **ARCO** | ARCO-ERA5 (Google), 0.25°, hourly, 37 levels to 1 hPa, 1940 → about 3 months ago (store metadata: valid to 2026-06-30, ERA5T to 2026-10-13) | zarr ✅ `gs://gcp-public-data-arco-era5/ar/full_37-1h-0p25deg-chunk-1.zarr-v3` (HTTPS mirror `https://storage.googleapis.com/gcp-public-data-arco-era5/...`) | **none** (anonymous) | Copernicus/ERA5: CC-BY 4.0 with attribution ("Contains modified Copernicus Climate Change Service information") | **One chunk = 1 hour × 37 levels × full globe ≈ 150 MB raw per variable** | Has `potential_vorticity`, `geopotential`, `temperature`, `u/v`, `specific_humidity`, `top_net_thermal_radiation` (no RH: compute it with MetPy). Good for **snapshot dates**, not for long time series. |
| **WB2** | WeatherBench2 copies of ERA5 | ✅ `gs://weatherbench2/datasets/era5/1959-2023_01_10-6h-240x121_equiangular_with_poles_conservative.zarr` (1.5°, 6-hourly, 13 levels 50–1000 hPa, includes RH and PV); `.../1959-2023_01_10-full_37-1h-512x256_equiangular_conservative.zarr` (0.7°, 37 levels, chunks of 48 h × 1 level ≈ 25 MB); climatology ✅ `gs://weatherbench2/datasets/era5-hourly-climatology/1990-2019_6h_240x121_equiangular_with_poles_conservative.zarr` (dayofyear × hour × level) | none | ERA5 licence as above | climatology about 2.2 GB per variable in total; read only the seasons you need | Ends Jan 2023. **Best anonymous source for zonal-mean climatologies** (RH, θe, q, T, u). |
| **ERA5-CDS** | ERA5 on the Copernicus CDS: `reanalysis-era5-pressure-levels(-monthly-means)`, `derived-era5-pressure-levels-daily-statistics` | `cdsapi` (API `https://cds.climate.copernicus.eu/api`); also accept the dataset licence once on the website | **CDS account + personal access token** in `~/.cdsapirc` | CC-BY 4.0 | subset on the server (area, levels, grid such as `[2.5, 2.5]`), so pulls stay at a few MB to a few hundred MB | Needed for long monthly or daily series up to 1 hPa (QBO, SSW composites, EP fluxes) without TB-scale reads. |
| **MERRA2** | MERRA-2 (1980–present; 42 levels to **0.1 hPa**; e.g. `M2IMNPASM` monthly instantaneous pressure-level fields, `M2I3NPASM` 3-hourly) | GES DISC OPeNDAP or HTTPS via `earthaccess` | **NASA Earthdata** | NASA open data, no restrictions; cite Gelaro et al. 2017 | monthly per file about 0.4 GB, subset with OPeNDAP | For QBO/SAO up to 0.1 hPa (Fig. 17.13 top). No 1979. |
| **JRA** | JRA-55 (RDA ds628.0) and JRA-3Q (RDA d640000 ✅) | NSF NCAR RDA/GDEX HTTPS | RDA account (free) | JMA terms: free for research and education; check the redistribution clause | as needed | Third opinion for QBO and EP flux. JRA-3Q top 0.01 hPa. |
| **OLR** | NOAA interpolated daily OLR (1974–present, 2.5°) | ✅ `https://downloads.psl.noaa.gov/Datasets/interp_OLR/olr.day.mean.nc` (349 MB); uninterpolated: `.../uninterp_OLR/olr.day.mean.nc` | none | public domain; cite Liebmann & Smith 1996 | 349 MB | Wheeler–Kiladis and MJO figures. The book plots "cloud brightness" (CLAUS, on CEDA with a login). OLR is the standard open stand-in; say so in the caption. |
| **CERES** | CERES EBAF TOA Ed4.2.1 monthly | ASDC (`asdc.larc.nasa.gov/data/CERES/EBAF/`) or CERES ordering tool; Earthdata Search | Earthdata (ordering form may skip it) | NASA, no restrictions | about 0.1 GB | Fig. 14.1. Fallback without login: ERA5 TOA fluxes from WB2 (`mean_top_net_*`). |
| **AIRS** | AIRS/AMSU L3 monthly (`AIRS3STM`) | GES DISC via `earthaccess` | Earthdata | NASA open | 0.1 GB per month | Satellite RH and q for Figs 18.2–18.4 if we want to match "from satellite". Default: WB2 ERA5. |
| **FUB** | FU Berlin QBO winds (Canton/Gan/Singapore radiosondes, monthly, 70–10 hPa, 1953–present) | ✅ `https://www.geo.fu-berlin.de/met/ag/strat/produkte/qbo/singapore.dat` (35 kB), `.../qbo.dat` (50 kB) | none | free for research; cite Naujokat 1986 | 50 kB | Fixed-width text, so write a small parser. It is our ground truth for the 2016 disruption (Fig. 17.21). |
| **SSW** | SSW compendium (Butler et al. 2017; central dates per reanalysis) | ✅ `https://csl.noaa.gov/groups/csl8/sswcompendium/` | none | NOAA, open; cite | kB | Event list for composites (Fig. 17.25). Alternative: compute Charlton–Polvani dates ourselves from u(60°N, 10 hPa). |
| **IDX** | Climate indices: Niño-3 (✅ `https://psl.noaa.gov/data/correlation/nina3.anom.data`), SOI (✅ `https://www.cpc.ncep.noaa.gov/data/indices/soi`), RMM MJO (BoM `rmm.74toRealTime.txt`) | HTTPS | none | public | kB | ⚠ BoM returns **403 to curl**, so send a browser User-Agent, or compute RMM-like PCs from OLR + u850/u200 ourselves. |
| **PRECIP** | GPM IMERG / TRMM 3B42 (Earthdata); RSS SSM/I (remss.com, free registration, CC-BY); CPC/GPCP at PSL (✅ `downloads.psl.noaa.gov/Datasets/cpc_global_precip/`, anonymous) | as listed | as listed | as listed | GB-scale for IMERG | Only optional, for tropical-convection extras. No book figure needs it. |

### 2.2 Ocean

| Key | Dataset | Access route | Login | Licence | Size | Notes |
|---|---|---|---|---|---|---|
| **WOA23** | World Ocean Atlas 2023 (T, S, O₂…; 1° and 0.25°; 102 levels to 5500 m) | ✅ `https://www.ncei.noaa.gov/data/oceans/woa/WOA23/DATA/temperature/netcdf/decav/1.00/woa23_decav_t00_01.nc` (85 MB) and `.../salinity/.../woa23_decav_s00_01.nc` (77 MB); THREDDS ✅ `https://www.ncei.noaa.gov/thredds-ocean/catalog/woa23/DATA/catalog.html` | none | US Gov. public domain; cite Locarnini/Reagan et al. 2024 | 160 MB for annual 1° T+S | It stores *in-situ* T and *practical* S on depth levels, so convert with `gsw` (SA, CT, σ0/σ2, N²). `decav` = 1955–2022 average. |
| **MIMOC** | Monthly Isopycnal & Mixed-layer Ocean Climatology (Argo-era, 0.5°) | ✅ `https://www.pmel.noaa.gov/mimoc/data/MIMOC_SIGMA0_GRID_v2.2_CT_S_P_W_Yr_month{MM}.nc.gz` (**isopycnal grid**: pressure, CT, S on σ0 surfaces; 72 MB gz per month); `MIMOC_Z_GRID_v2.2_{CT_SA,PT_S}_month{MM}.nc.gz` (depth grid) | none | freely available; cite Schmidtko, Johnson & Lyman 2013 | 72 MB per month (isopycnal) | **Made for Fig. 20.5**: the layer thickness between σ0 surfaces comes straight from the pressure field. |
| **RG** | Roemmich–Gilson Argo climatology (2004–) | ✅ `https://sio-argo.ucsd.edu/RG/RG_ArgoClim_Temperature_2019.nc.gz` (695 MB) + salinity + monthly extensions | none | free; cite Roemmich & Gilson 2009 | 1.4 GB | Alternative to WOA23 for the Argo era. Not needed by default. |
| **GLODAP** | GLODAPv2.2016b mapped climatologies (T, S, nutrients, carbon); GLODAPv2.2023 bottle data (includes neutral density γⁿ) | ✅ `https://www.ncei.noaa.gov/data/oceans/ncei/ocads/data/0286118/GLODAPv2.2016b_MappedClimatologies/`; glodap.info | none | CC-BY 4.0 | about 0.5 GB mapped | For 21.28 (neutral-density section) we can take γⁿ directly from bottle data along 25°W (WOCE A16-type lines). |
| **ECCO** | ECCO V4r4 state estimate (1992–2017; LLC90 native and 0.5° lat-lon; monthly) | `earthaccess` → PO.DAAC cloud (`podaac-ops-cumulus-protected`). Collections such as `ECCO_L4_OCEAN_VOLUME_TRANSPORT_LLC0090GRID_MONTHLY_V4R4` (UVELMASS, VVELMASS), `ECCO_L4_OCEAN_VEL_05DEG_MONTHLY_V4R4`, `ECCO_L4_BOLUS_LLC0090GRID_MONTHLY_V4R4`, `ECCO_L4_GEOMETRY_LLC0090GRID_V4R4` (confirm each name with `earthaccess.search_datasets(keyword="ECCO V4r4")`). Requester-pays kerchunk references: `s3://ecco-model-granules/`. Tools: `ecco_v4_py`, `ecco_access` | **Earthdata** | NASA open, no restrictions; cite ECCO Consortium (Forget et al. 2015; Fukumori et al. 2021) | **Large**: about 20 MB per variable per month on LLC90, so 1992–2017 × 3 variables ≈ 20 GB. **Stream and reduce to time means (≈ 100 MB) once.** | Source for Figs 19.3, 19.4, 21.1, 21.17, 21.18, 21.29 and 22.1–22.2. |
| **GODAS** | NCEP Global Ocean Data Assimilation System (1980–present, monthly, 40 levels) | ✅ `https://downloads.psl.noaa.gov/Datasets/godas/{ucur,vcur,pottmp,salt,...}.{YYYY}.nc` (≈ 100–120 MB per year) | none | public domain | per year | Anonymous fallback for equatorial currents and ENSO Hovmöllers (22.1, 22.15), and a coarse stand-in for ECCO. |
| **SST** | NOAA OISST v2 (✅ `.../noaa.oisst.v2.highres/sst.mon.mean.nc`, 2.2 GB) · ERSST v5 (✅ `.../noaa.ersst.v5/sst.mnmean.nc`, 161 MB) | HTTPS | none | public domain | as shown | ERSST is enough for 22.13–22.14. Use the WOA23 surface level for the 19.1 climatology. |
| **RAPID** | RAPID-MOCHA 26°N MOC time series | ✅ `https://rapid.ac.uk/sites/default/files/rapid_data/moc_transports.nc` (1.2 MB) | none | open with citation (check the current version page) | 1.2 MB | Independent check that the ECCO Atlantic MOC peak is ≈ 17 Sv at 26°N. |
| **CURR** | OSCAR surface currents (PO.DAAC, Earthdata); CMEMS/AVISO MDT and geostrophic currents (**Copernicus Marine account**, `copernicusmarine` toolbox, free with attribution); **GDP drifter-derived mean velocity** (✅ `https://www.aoml.noaa.gov/phod/gdp/mean_velocity.php`, no login) | as listed | as listed | GDP: public domain; CMEMS: free licence, attribution | 10–500 MB | For a *data-driven* panel of Southern Ocean surface currents (21.23). Default: GDP climatology (anonymous). |
| **DRIFT** | NOAA Global Drifter Program trajectories (hourly/6-hourly; ERDDAP at AOML/OSMC) · GLAD Gulf of Mexico drifters (GRIIDC, CC0) | ERDDAP tabledap/HTTPS | none | public domain / CC0 | 10–100 MB per region and period | Figs 13.3 and 13.4 (the SCULP data in the book are not easy to obtain). |
| **FRONTS** | Orsi et al. 1995 ACC fronts (AADC: shapefile + CSV, ✅ `https://data.aad.gov.au/metadata/records/antarctic_circumpolar_current_fronts`) · Park & Durand 2019 altimetry fronts (SEANOE DOI 10.17882/59800, NetCDF 321 kB, ✅) | HTTPS | none | **CC-BY 4.0** (both) | < 1 MB | Five fronts: STF, SAF, PF, SACCF, SB. |
| **GSW** | TEOS-10 `gsw` (Python) | `pip install gsw` | — | BSD-3 | — | SA, CT, σθ, σ2, N², spiciness, `gsw.f`. Neutral density: `pygamma`/`gamma_n` wrappers or `neutralocean`. Check that whichever we use installs on Windows; if not, show σ2/σ4 and label it. |

### 2.3 Geography

| Key | Dataset | Access | Licence | Size | Use |
|---|---|---|---|---|---|
| **NE** | Natural Earth 1:50m/1:10m coastlines, land, bathymetry polygons | ✅ `https://naturalearth.s3.amazonaws.com/50m_physical/ne_50m_coastline.zip` (0.46 MB), ✅ `.../10m_physical/ne_10m_bathymetry_all.zip` (15.6 MB, depth bands 0/200/1000/2000/3000/…/10000 m) | **public domain** | MB | Cartopy uses it automatically (`cartopy.feature`). The bathymetry bands are ideal for the "shallower than 3000 m" shading in 21.23. |
| **ETOPO** | ETOPO 2022 (15″/30″/60″, bedrock or surface) | ✅ `https://www.ngdc.noaa.gov/thredds/fileServer/global/ETOPO2022/60s/60s_bed_elev_netcdf/ETOPO_2022_v1_60s_N90W180_bed.nc` (THREDDS; OPeNDAP subsetting available) | public domain | ≈ 0.5 GB at 60″ | Land–sea masks for the Stommel–Munk solver, topography for Charney–Eliassen (16.12) and the 3500 m mask in 12.13. Coarsen to 0.25° and cache. |
| **GEBCO** | GEBCO 2024 grid | gebco.net (zip, ≈ 4–7 GB) | public, attribution | big | Only if ETOPO is not enough. |

### 2.4 Access code patterns (house style)

All fetchers live in one module (proposed `aofd/data/`) and every fetcher **returns a path or an `xarray.Dataset`**, caching under `AOFD_DATA` (default `pooch.os_cache("aofd")`, i.e. `%LOCALAPPDATA%\aofd\Cache` on Windows and `~/.cache/aofd` on Colab/Linux).

```python
# aofd/data/registry.py  (sketch)
import os, pooch, xarray as xr
from pathlib import Path
CACHE = Path(os.environ.get("AOFD_DATA", pooch.os_cache("aofd")))

PSL = pooch.create(path=CACHE / "psl", base_url="https://downloads.psl.noaa.gov/Datasets/",
                   registry={"interp_OLR/olr.day.mean.nc": None,                 # updated daily -> no fixed hash
                             "ncep.reanalysis.dailyavgs/pressure/hgt.2015.nc": "sha256:<fill after first fetch>",
                             "ncep.reanalysis.derived/pressure/hgt.day.ltm.nc": "sha256:<…>"})

def ncep_daily(var: str, year: int) -> xr.Dataset:
    """NCEP/NCAR R1 daily mean on pressure levels (2.5 deg, top 10 hPa). Public domain."""
    fn = PSL.fetch(f"ncep.reanalysis.dailyavgs/pressure/{var}.{year}.nc", progressbar=True)
    return xr.open_dataset(fn).sortby("lat")          # PSL latitudes run N->S
```

```python
# ARCO-ERA5 / WeatherBench2: anonymous zarr (needs gcsfs; or fsspec HTTPS)
ds = xr.open_zarr("gs://gcp-public-data-arco-era5/ar/full_37-1h-0p25deg-chunk-1.zarr-v3",
                  chunks=None, storage_options={"token": "anon"})
z500 = ds["geopotential"].sel(time="2015-02-09T12", level=500) / 9.80665   # one ~150 MB chunk
z500.to_netcdf(CACHE / "derived" / "era5_z500_20150209T12.nc")            # cache the tiny derived field
```

```python
# Copernicus CDS (key in ~/.cdsapirc  ->  url: https://cds.climate.copernicus.eu/api  key: <token>)
import cdsapi
cdsapi.Client().retrieve("reanalysis-era5-pressure-levels-monthly-means",
    {"product_type": ["monthly_averaged_reanalysis"], "variable": ["u_component_of_wind"],
     "pressure_level": ["1","2","3","5","7","10","20","30","50","70","100","150","200","300","500","700","850","1000"],
     "year": [str(y) for y in range(1979, 2026)], "month": [f"{m:02d}" for m in range(1, 13)],
     "time": ["00:00"], "area": [5, -180, -5, 180], "grid": [1.0, 1.0], "data_format": "netcdf"},
    str(CACHE / "era5" / "u_eq_monthly_1979_2025.nc"))
```

```python
# NASA Earthdata (ECCO, MERRA-2, AIRS, CERES): free login, ~/.netrc or env vars, or interactive on Colab
import earthaccess
earthaccess.login()                                   # strategy="environment" in CI, "interactive" on Colab
hits = earthaccess.search_data(short_name="ECCO_L4_OCEAN_VOLUME_TRANSPORT_LLC0090GRID_MONTHLY_V4R4",
                               temporal=("2004-01-01", "2013-12-31"))
files = earthaccess.download(hits, local_path=CACHE / "ecco" / "vol_transport")
# reduce immediately to a time mean, keep the ~100 MB mean, delete the monthlies if space is tight
```

**Caching rules:** (i) raw files stay in `AOFD_DATA` and are never copied into the repo; (ii) every expensive reduction writes a **derived product** (`.nc`, float32, zlib-compressed, with the source, licence and citation in `attrs`) to `data/derived/<fig>/…`; (iii) notebooks read the derived product when it exists and only call the fetcher if asked (`REFRESH=True`); (iv) pooch hashes are pinned for files that do not change (yearly files, climatologies, WOA23, MIMOC) and left as `None` (with the fetch date recorded) for files that grow (OLR, monthly means).

---

## 3. Recipes for the 18 reference crops

Each recipe gives: **data → processing → plot → checks → fallback**. Equations are taken from the rendered book page when the code is written, following the fluidpy rule; the formulas here are only the standard definitions.

### 3.1 Southern Ocean currents, gyres and fronts — Fig. 21.23 (`geo_1`)
* **Data:** NE 50 m land (brown) + NE 10 m bathymetry bands (shade depths < 3000 m in a lighter teal, as the crop does), or ETOPO coarsened to 0.25° and contoured at −3000 m; Orsi fronts (AADC shapefile: STF, SAF, PF, SACCF, SB) and optionally Park–Durand; currents: **our own polylines** stored as data in `figs/ch21/so_currents.yaml` (ACC along SAF/PF, Weddell and Ross gyres, Agulhas Current with retroflection, Brazil–Malvinas confluence near 38°S, Leeuwin Current, East Australian Current, South Atlantic subtropical gyre), each with a label.
* **Data-driven twin panel** (recommended for teaching): streamlines of the GDP drifter-derived mean surface velocity (or ECCO surface velocity) over the same map. This shows that the schematic arrows are real.
* **Plot:** `ccrs.SouthPolarStereo()`, `set_extent([-180,180,-90,-30], ccrs.PlateCarree())`, circular boundary (the standard cartopy `mpath.Path` circle recipe), gridlines every 30° and 15°, arrows as `FancyArrowPatch` built from `transform_points`.
* **Checks:** the PF and SAF pass south of Africa at about 50°S and 45°S; the ACC goes through Drake Passage; the Agulhas retroflects near 20°E.
* **Fallback:** none needed. All inputs are public domain or CC-BY.

### 3.2 Global overturning, residual vs Eulerian — Fig. 21.18 (`geo_2`); Atlantic MOC — Fig. 21.1 (`geo_4`); Atlantic/Pacific — 21.29
* **Data:** ECCO V4r4 monthly `UVELMASS/VVELMASS` (Eulerian), GM bolus velocity (`ECCO_L4_BOLUS…`), `RHOAnoma` or T,S for σ2, grid geometry; time mean over 1992–2017 (or 2004–2017 to overlap RAPID).
* **Processing:**
  * Eulerian MOC: Ψ(y,z) = −∫ₓ∫_{−H}^{z} v dz′ dx, using `ecco_v4_py.calc_meridional_stf(ds, lat_vals, basin_name=…)` with basin masks `atlExt` (Atlantic) and `pacExt` + `indExt` (Indo-Pacific), or global.
  * Residual: add the bolus transport. The truer "residual" of the left panel comes from a **density-space MOC**: bin the transport by σ2 class, integrate, then map back to depth with the zonal-mean depth of each σ2 surface. This approximates the hydrographic inverse estimate.
  * Units: Sv (10⁶ m³ s⁻¹).
* **Plot:** latitude −80…80, depth 0–6 km (or the split upper 1 km / deep axis used for the Atlantic), diverging colormap (`cmocean.cm.balance`) centred on 0, contours every 2 Sv, labelled; bathymetry silhouette from the maximum depth along each latitude.
* **Checks:** Atlantic upper cell max ≈ 15–20 Sv near 30–40°N at 1 km; **26°N value close to RAPID (≈ 17 Sv)**; deep cell (AABW) about −2…−5 Sv below 4 km; Deacon cell present in the Eulerian Southern Ocean panel but largely cancelled in the residual.
* **Fallback (pseudo, labelled illustrative):** two-cell analytic streamfunction Ψ = Ψ₁ sin(π z/H₁)·g(y) + Ψ₂ … with the observed magnitudes.

### 3.3 2-D sideways (horizontal) convection at Ra = 10⁶ and 10⁹ — Fig. 21.4 (`geo_3`)
* **Model (ours):** 2-D Boussinesq in a 20 m × 10 m box, Pr = 10; top temperature decreasing linearly from the centre outward; insulating side and bottom walls. Free-slip walls let x be represented by cosine/sine series (DCT for T, DST for ψ). z uses Chebyshev or finite differences clustered toward the top. IMEX RK time stepping (vorticity–streamfunction form). Density from a linear equation of state ρ = ρ₀(1 − α(T − T₀)) mapped onto the 1026.5–1028 kg m⁻³ range.
* **Resolution:** Ra 10⁶: 128 × 64 runs in minutes. Ra 10⁹: the top boundary layer scales like Ra^(−1/5) ≈ 1.6 % of the depth, so use 1024 × 384 with clustering and spin up from the 10⁶ solution. CPU-hours, so **precompute once and ship the final state as a derived `.npz`**. If cost forces it, show 10⁸ and say so.
* **Alternative solver:** Dedalus v3 on Colab/WSL (Windows pip is fragile). Dedalus v3 needs one Fourier direction, so use free-slip walls with even/odd extension, or keep our own solver.
* **Plot:** left density (shared colour scale for both Ra), right ψ (separate scales), central sinking plume; x 0–20 m, z 0–10 m.
* **Checks:** sinking at the centre (where the top is coldest); thermocline thinner at higher Ra; ψ magnitude falls by about 10× from 10⁶ to 10⁹ in the nondimensional scaling used; Nusselt-number scaling close to Ra^(1/5).

### 3.4 PV on isopycnals — Atlantic, MIMOC — Fig. 20.5 (`geo_5`); Pacific and Indian — Fig. 20.4 (`geo_6`); sections 20.6–20.7
* **Data:** 20.5 uses MIMOC **isopycnal grid**, January (`month01`). 20.4 uses WOA23 annual 1° T,S (or MIMOC depth grid), with σ2 for the deep "37.0" surface.
* **Processing (20.5):** on σ0 levels σₖ, thickness h = (p_{k+1} − p_k)/(ρ g) (or via `gsw.z_from_p`); PV = |f| δσ/(ρ₀ h) [m⁻¹ s⁻¹], evaluated at the target surfaces 26.0, 26.5, 27.2 and about 27.77; mask where the layer outcrops or is missing.
* **Processing (20.4):** SA = `gsw.SA_from_SP`, CT = `gsw.CT_from_t`; σ0 or σ2; N² = `gsw.Nsquared`; PV ≈ (f/g) N² (or f ∂ρ/∂z / ρ₀); vertical linear interpolation of PV (and depth) to the target σ; average depth D̄ of each surface for the panel title.
* **Plot:** `ccrs.Orthographic(central_longitude=-40, central_latitude=25)` for the Atlantic, `(180, 5)` for the Pacific, `(80, -10)` for the Indian; `pcolormesh` + contours; sequential cmocean colormap (`thermal` or `amp`), not the book's jet; f taken positive in both hemispheres (|f|), as stated in the plotted quantity.
* **Checks:** a low-PV "pool" (homogenised) in the subtropical gyre near σ0 = 26.5 (Atlantic, the 18° Water area) and in the Pacific upper levels; deep levels dominated by βy; high PV at the equator.
* **Fallback:** none needed.

### 3.5 Stommel–Munk North Atlantic from observed winds — Fig. 19.8 (`geo_7`)
* **Data:** annual-mean wind stress. Choices: NCEP R1 `uflx/vflx.mon.mean` (sign-check, then τ = −flux if needed), **ERA5 `eastward/northward_turbulent_surface_stress`** (ARCO/CDS; better), or SCOW scatterometer climatology. Land mask from ETOPO or NE coarsened to 0.5° (flat bottom).
* **Model:** barotropic vorticity on a β-plane (or sphere) for 10–65°N, 100°W–0: β ∂ψ/∂x = (1/ρ₀) curl τ − r ∇²ψ + A_H ∇⁴ψ, with ψ = 0 on the coast (plus ∂ψ/∂n = 0 for the Munk term). Assemble with `scipy.sparse` (5- and 13-point stencils, metric terms cos φ) and solve with `spsolve`. Parameters: A_H ≈ 1–5 × 10⁴ m² s⁻¹ (Munk width (A_H/β)^(1/3) ≈ 50–80 km), small r. Grid ¼° so the boundary layer is resolved.
* **Plot:** PlateCarree 80°W–0, 20–65°N; filled contours in Sv (−40…40) with a diverging colormap, zero line in black.
* **Checks:** the Sverdrup interior ψ_S(x) = (1/(ρ₀β)) ∫_{x_E}^{x} curl τ dx′ gives ≈ 30 Sv in the subtropical gyre and ≈ −20 Sv subpolar; the western boundary current closes the gyre; separation near 35–40°N (too far north, as in the book's own remark); compare with 19.4 (ECCO).

### 3.6 Global barotropic streamfunction (state estimate) — Fig. 19.4 (`geo_8`) and 19.3 (N Atlantic)
* **Data:** ECCO V4r4 `UVELMASS` (or 0.5° `EVEL/NVEL`), time mean; `drF`, `dyG`, masks.
* **Processing:** depth-integrated U = Σ u Δz; ψ(x,y) = −∫_{y_S}^{y} U dy′ along each meridian, starting at Antarctica. Set ψ = 0 on the Americas so the ACC appears as an offset; the Indonesian Throughflow makes ψ different on either side of Australia/Asia, so the map is cut at 42°S as in the book. On the native LLC grid use `ecco_v4_py` / `xgcm` for the integration.
* **Plot:** `ccrs.Robinson(central_longitude=200)` (the crop is centred in the Pacific), 42°S–75°N, `cmocean.cm.balance` −45…45 Sv; clockwise positive (red), as stated in our own caption.
* **Checks:** Kuroshio and Gulf Stream recirculations 40–60 Sv; subtropical gyres positive (anticyclonic in the NH, clockwise); the SH subtropical gyres appear with the opposite sign as anticyclones there.
* **Fallback:** without Earthdata, a global Sverdrup ψ from ERA5/NCEP stress (labelled "Sverdrup estimate, not state estimate").

### 3.7 Wheeler–Kiladis wavenumber–frequency spectrum — Fig. 18.23 (`geo_9`)
* **Data:** NOAA interpolated daily OLR, 15°S–15°N, 1979–2016 (or to 2025).
* **Processing (WK99 / NCL `wkSpaceTime` conventions):**
  1. anomalies (remove the mean and the first 3 annual harmonics);
  2. split into **symmetric** ½[φ(y) + φ(−y)] and **antisymmetric** ½[φ(y) − φ(−y)] parts;
  3. 96-day segments with 65-day overlap, detrend, taper (split cosine bell);
  4. 2-D FFT in longitude and time (sign so that eastward is positive wavenumber), power summed over latitude and averaged over segments;
  5. background = average of the sym+antisym spectra smoothed many times with a 1-2-1 filter (≈ 10 passes in wavenumber; frequency passes increasing with frequency);
  6. plot raw/background with contours from 1.1 to 1.4 and up.
  Cross-check against `easyclimate.field.equatorial_wave.wk_spectra`.
* **Dispersion curves (Matsuno):** for equivalent depths h_e ∈ {8, 12, 25, 50, 90} m: c = √(g h_e); Kelvin ω = c k; for meridional index n: ω²/c² − k² − βk/ω = (2n+1) β/c (n = 1 ER and IG; n = 0 MRG/EIG). Convert to CPD and planetary zonal wavenumber s = k a.
* **Plot:** two panels (symmetric / antisymmetric), s ∈ [−20, 20], f ∈ [0, 0.8] CPD, dashed lines at periods 3, 6 and 30 d, right axis in days, labelled boxes (Kelvin, n=1 ER, MRG, n=1/2 WIG, n=0 EIG).
* **Checks:** Kelvin peak along h_e ≈ 25 m; MJO at s = 1–5, 30–60 d; ER at s ≈ −1…−10.
* **Data note:** the book uses satellite cloud brightness; our caption says OLR.

### 3.8 500 hPa geopotential, temperature and zonal wind — Fig. 18.22 (`geo_10`); RH at 500 hPa — Fig. 18.12 (`geo_11` top)
* **Data:** NCEP R1 daily averages for 2015 (`hgt`, `air`, `uwnd`, `rhum` 2015 files: 85 + 40… MB), select 2015-02-09 at 500 hPa. For finer RH texture use ERA5 (ARCO, 2015-02-09T12: q and T → `metpy.calc.relative_humidity_from_specific_humidity`).
* **Plot:** `ccrs.Robinson(central_longitude=-150)` (matches the crop's tick order); 18.22: three panels of line contours, **the same number of contour levels for each field** (e.g. 16 equally spaced between the field's min and max), negative u dashed; 18.12: RH shading 0–100 % (`Blues`) with red Z contours every 60 m.
* **Checks:** flat Z and T in the tropics vs strong gradients poleward of 30° (the point the figure makes); jets near 30–40°N/S; dry subtropical bands and moist filaments along storm tracks.
* **Derived product:** four 2-D fields (< 1 MB), committed.

### 3.9 Advection–condensation model snapshot — Fig. 18.13 (`geo_11` bottom)
* **Model (ours):** domain x, y ∈ [0, 1], periodic in x; imposed T(y) linear from +20 °C at y = 0 to −10 °C at y = 1; q_s(T) from Clausius–Clapeyron (or Bolton); streamfunction ψ = −U y + ε sin(2π k(x − c t)) sin(π y) (wavy streamlines; optional stochastic phase); moisture source at y = 0 (q = q_s); tracer q advected (semi-Lagrangian or upwind, 256²), diffused with κ, and **condensed instantly to q_s wherever q > q_s**.
* **Plot:** three panels: T(y), zonal-mean RH(y), RH map (0.3–1) with red ψ contours.
* **Checks:** zonal-mean RH dips to ≈ 0.5–0.6 in the interior; saturated tongues where flow comes from the warm side; RH increases toward y = 1 where air has just been condensed.

### 3.10 Zonal-mean RH with θe contours, JJA/DJF — Fig. 18.3 (`geo_12`); also 18.2, 18.4
* **Data:** WB2 ERA5 hourly climatology 1990–2019 at 1.5° (`relative_humidity`, `temperature`, `specific_humidity`, 13 levels 50–1000 hPa); select days of year for JJA/DJF and all four hours, then take the zonal mean (dask; read only the needed chunks, about 0.5 GB per variable per season). Alternatives: ERA5 CDS monthly means, AIRS L3 (satellite, like the book).
* **Processing:** θe = `metpy.calc.equivalent_potential_temperature(p, T, Td)` (Td from q); vertical coordinate Z = H ln(p₀/p), H = 7 km; RH with respect to water (or ERA5's mixed water/ice). Say which in the caption.
* **Plot:** RH shading 0–100 (`Blues`), θe contours (red) labelled at 280, 320, 360 and 400 K; latitude −90…90 with "Winter/Summer" labels; Z 0–18 km.
* **Checks:** moist deep tropics and boundary layer; dry subtropical free troposphere (RH < 30 %) in the winter hemisphere; θe surfaces sloping up from the tropical surface toward the extratropical upper troposphere.

### 3.11 SSW composite with EP-flux arrows (3-D + slices) — Fig. 17.25 (`geo_13`)
* **Book source:** a GCM composite. **Ours:** a reanalysis composite (labelled "observed analogue of a model composite").
* **Data:** daily u, v, T on pressure levels for 1979–2016 around each SSW central date, from the Butler compendium (≈ 25 events) or our own Charlton–Polvani detection (u at 60°N, 10 hPa reversing in Nov–Mar). Sources: NCEP R1 daily files (17 levels to 10 hPa) + `*.day.ltm.nc` climatology (anonymous), or ERA5 CDS daily statistics on a 2.5° grid, 20–90°N, to 1 hPa (better top).
* **Processing:**
  * Anomalies relative to the daily climatology.
  * EP flux in log-pressure or pressure form (Edmon, Hoskins & McIntyre 1980): F_φ = ρ₀ a cos φ (∂ū/∂z · v′θ′/∂θ̄/∂z − u′v′), F_z = ρ₀ a cos φ [(f − (a cos φ)⁻¹ ∂(ū cos φ)/∂φ) v′θ′/∂θ̄/∂z − u′w′]. Take eddies as deviations from the zonal mean on each day. Scale arrows for display (the usual √(1000/p) and 1/(π a) factors).
  * Composite over events at lags −60…+20 days.
* **Plot:** (a) plotly 3-D: isosurfaces of the ū anomaly (±2, 4… m/s) in (lat, lag, log p) with `go.Cone` EP arrows; (b) four latitude–log p panels (lags −40, −10, 0, +10 days): T anomaly shading (interval 1.5 K) + EP-flux anomaly arrows.
* **Checks:** upward EP-flux pulse 10–20 days before lag 0; polar-cap warming at 10 hPa > +10 K at lag 0; easterly anomaly descending afterwards.
* **Fallback:** the Holton–Mass model (17.26) gives a simulated analogue.

### 3.12 Polar-vortex 3-D views — Fig. 17.23 (geopotential anomalies; `geo_14`) and Fig. 17.22 (PV isosurfaces; `geo_15`)
* **17.23 data:** NCEP R1 daily `hgt` for 1979 and 1984, minus `hgt.day.ltm.nc` (anonymous), levels 200–10 hPa; dates 18/23/28 Feb 1984 (displacement) and 15/19/23 Feb 1979 (split). Optionally ERA5 (ARCO, one hour per day) for detail.
* **17.22 data:** ERA5 PV, T and u on 37 levels (ARCO; 14 and 30 Dec 1984, 12 UTC: 2 times × 2 variables ≈ 0.6 GB raw, cache only the NH subset). θ = T(p₀/p)^κ; interpolate PV to θ levels 400–850 K; Lait scaling Q* = Q (θ/θ₀)^(−4.5) with θ₀ = 475 K; isosurface at the value that outlines the vortex edge (≈ 35 PVU after scaling).
* **Plot:** coordinates (x, y) = polar-stereographic projection of (lon, lat ≥ 30°N), z = log p or θ; `plotly.graph_objects.Isosurface` (or `skimage.measure.marching_cubes` → `Mesh3d`), blue for negative anomaly or vortex and red for positive, translucent; base map from the cartopy Natural Earth raster (`stock_img`, public domain) as a `Surface` with surfacecolor.
* **Checks:** 1984: one vortex displaced off the pole, then warm high over the pole. 1979: two vortices after splitting. Dec 1984: one vortex on the 14th and two on the 30th.
* **Size:** export the plotly figure with decimated meshes (< 3 MB per page).

### 3.13 QBO time–height sections — Fig. 17.13 (1979–2010; `geo_18`) and Fig. 17.21 (2003–2016; `geo_16`)
* **Data:** ERA5 monthly u (CDS; area 5°S–5°N; levels 1–1000 hPa) → zonal and meridional mean. For the 0.1–1 hPa part of 17.13: MERRA-2 `M2IMNPASM` (Earthdata, from 1980), or show ERA5 to 1 hPa and say so. Check 17.21 against FU Berlin Singapore (70–10 hPa).
* **Processing:** bottom panel of 17.13: subtract the 1979–2010 monthly climatology (removes the SAO and annual cycle). Right axis: log-pressure height Z = H ln(1000/p), H = 7 km.
* **Plot:** `pcolormesh` (time, log p), −40…40 m/s diverging, zero contour in black; colorbar extended.
* **Checks:** QBO period ≈ 28 months, maximum at 10–20 hPa, westerlies descending faster than easterlies; SAO above ≈ 3 hPa; **the 2016 disruption** (westerlies cut by easterlies near 40 hPa) appears in both ERA5 and FU Berlin.
* **Derived product:** u(time, p) about 100 kB, CC-BY attribution, **committed**, so Colab needs no CDS key.

### 3.14 1-D QBO model time–height solution — Fig. 17.18 (`geo_17`), also 17.17, 17.19, 17.20
* **Model (ours):** Plumb-type 1-D equation for ū(z,t): ∂ū/∂t − ν ∂²ū/∂z² = −∂/∂z Σᵢ Fᵢ exp(−∫₀^z gᵢ(z′) dz′), with gᵢ = α N /(kᵢ (cᵢ − ū)²) and two waves c = ±1 of equal flux (exact nondimensional form taken from the book's equation, read from the page image when coding). Method of lines (≈ 300 points in z), ū = 0 at the bottom, sponge or zero-gradient at the top, implicit diffusion (Crank–Nicolson) + explicit forcing, guard against cᵢ − ū → 0.
* **Plot:** time 20–40 (nondimensional), z 0–3, filled contours −1…1, zero contour thick.
* **Checks:** periodic descending shear zones; period ≈ 4–5 time units for the book-like parameters; the period scales with 1/F as the theory predicts (a good explainer slider).

---

## 4. Python stack, data policy, size budget, Colab

### 4.1 Stack (pip on Windows unless noted)
| Need | Package | Note |
|---|---|---|
| arrays and labels | `xarray`, `numpy`, `scipy`, `pandas`, `dask[array]` | dask only for zarr climatologies and ECCO reductions |
| file formats | `netCDF4`, `h5netcdf`, `zarr` (keep a version that reads v2 stores; xarray ≥ 2024 handles both), `fsspec`, `gcsfs`, `aiohttp` | anonymous `gs://` reads |
| download and cache | `pooch` (hashes, `os_cache`), `requests` | |
| credentials | `cdsapi`, `earthaccess`, `copernicusmarine` | keys never in the repo |
| ocean | `gsw` (TEOS-10), `ecco_v4_py`, `xgcm`, `neutralocean` / `pygamma` | `xmip` only if CMIP6 models are ever used (with `intake-esm` on Pangeo GCS) |
| atmosphere | `metpy` (θe, RH, lapse rates, standard atmosphere), `windspharm` (streamfunction; needs `pyspharm`, and Windows wheels are uncertain: fallback is our own Poisson solve on the sphere or `pyshtools`), `easyclimate` (cross-check for WK spectra) | |
| maps | `cartopy` (Windows wheels exist; uses Natural Earth), `shapely`, `pyproj`, `geopandas` or `pyshp` (front shapefiles), `cmocean` | Projections used: SouthPolarStereo, NorthPolarStereo, Robinson, Orthographic, Mollweide, PlateCarree |
| 3-D | `plotly` (`Isosurface`, `Mesh3d`, `Cone`; works on static pages), `scikit-image` (marching cubes), `pyvista` (offline renders) | |
| models | numpy/scipy; optional `dedalus` (Colab/WSL), `climlab` (radiative columns) | |

**Separate venv for the AOFD repo.** The current fluidpy `.venv` has none of xarray, cartopy, gsw or zarr. Pin versions in `requirements-data.txt` and keep the light `requirements.txt` for Colab.

### 4.2 What lives where
| Item | Location | Committed? |
|---|---|---|
| Book PDF, book text, rendered pages, **reference crops** (`_private/figure_refs/`), side-by-side comparisons | `_private/` (git-ignored, checked by `check_public`) | **never** |
| Raw downloads (NetCDF, zarr reads, shapefiles) | `AOFD_DATA` cache outside the repo | never |
| Data registry (`data/registry.yaml`: key, URL, access route, login, licence + licence URL, citation, size, sha256, variables, subset, fetch date, redistributable yes/no) | repo | yes |
| Fetch and reduce code (`aofd/data/*.py`), figure scripts (`figs/chNN/fig_NN_MM.py`) | repo | yes |
| **Derived products** (`data/derived/chNN/fig_NN_MM*.nc|.npz`): reduced fields only, float32 + zlib, provenance in attrs | repo, **≤ 10 MB per file, ≤ 150 MB total**; larger ones → GitHub Release assets (≤ 2 GB each) or Zenodo DOI | yes, **only if the licence allows redistribution** (public domain, CC-BY, NASA open). ECCO/MERRA-2/ERA5 derived means are fine with attribution; JRA and CMEMS products must be checked case by case |
| Generated figures (PNG/SVG), plotly JSON | `outputs/` → copied into published pages | published pages yes; `outputs/` no |

**Size budget:** GitHub Pages sites ≤ 1 GB published; repo soft target < 1 GB; single files hard-blocked at 100 MB (warning at 50 MB); Git LFS is **not** served by Pages, so do not use it. Keep each chapter page under about 15 MB (the fluidpy pages ran to 9 MB with 10 explainers).

**Licence and credit:** every data figure caption ends with a credit line ("Data: NOAA PSL NCEP/NCAR Reanalysis 1; public domain" / "Contains modified Copernicus Climate Change Service information [year]" / "ECCO Consortium, ECCO V4r4"). One `DATA_CREDITS.md` page is generated from the registry.

### 4.3 Colab
* The setup cell clones the repo and installs `requirements.txt` (adding `cartopy gsw cmocean pooch gcsfs metpy` on Colab is quick).
* **Default path:** load derived products from the repo or a Release, so no login is needed and every cell runs in seconds.
* **Refresh path** (`REFRESH=True`): anonymous sources (PSL, WOA23, MIMOC, ARCO/WB2, FUB) work as-is; keyed sources read Colab *Secrets* (`google.colab.userdata.get("CDSAPI_KEY")`, `EARTHDATA_USERNAME/PASSWORD` → `earthaccess.login(strategy="environment")`). Heavy reductions (ECCO 20 GB, 1e9 convection run) are flagged "local only".
* Do not mount Google Drive by default. Offer it as an optional persistent `AOFD_DATA`.

---

## 5. Proposed agents

### 5.1 `data-scout`
**Purpose:** for a figure (or a dataset key), find the best **open** source, check its licence, download it, cache it, reduce it to the derived product and register everything. It runs before the `figure-reproducer`.

* **Reads:** R3, R3b, `data/registry.yaml`, the figure's catalogue row, the rendered book page (to know the variable, region, period, levels and units — never to copy).
* **Order of preference:** (1) anonymous HTTPS/zarr (PSL, NCEI, PMEL, ARCO/WB2, AADC, SEANOE, NE); (2) free-login API with server-side subsetting (CDS, Earthdata, RDA, CMEMS); (3) a substitute dataset with the same physics, flagged in the caption; (4) pseudo-data generator (`aofd/data/pseudo.py`) with "ILLUSTRATIVE — synthetic data" stamped on the figure and in its metadata.
* **Must do:** HEAD-check and actually open the file; record its size, sha256 (fixed files), variables, coordinate order and sign conventions (latitude N→S, flux signs, longitude 0–360); read the **licence page** and set `redistributable: yes/no` with the attribution string; write `aofd/data/<key>.py` with a fetcher that has a numpy docstring (source, licence, citation, units); write the reduction script and **derived product with provenance attrs**; produce a quick-look PNG for itself; write `reports/data/<key>.md` (route, licence verdict, size, pitfalls, Colab route).
* **Must not:** commit raw data; store keys; use book figures or tables as data; exceed the size budget without asking; claim a dataset is open without opening it.
* **Hands back:** registry diff, derived-product path and size, the licence verdict, and problems (403s, outages, renamed collections).

### 5.2 `figure-reproducer`
**Purpose:** turn a derived product (or a model run) into a teaching-quality figure that shows the same science as the book figure, in our own style, and prove it is right.

* **Reads:** the catalogue row, the data-scout report, the rendered book page and caption (for content only), the **private reference crop** `_private/figure_refs/geo_*.png` (or a crop it makes into `_private/`), `knowledge/` style notes.
* **Writes:** `figs/chNN/fig_NN_MM.py` (functions, type hints, commented for a novice, `if __name__ == "__main__":`), `outputs/chNN/fig_NN_MM.png` (+ plotly HTML for 3-D), a caption in our own words with a data credit and "illustrative" stamp if needed, `tests/test_fig_NN_MM.py` (numerical checks), and a **private side-by-side** `_private/compare/fig_NN_MM.png` (ours | reference crop) used only for review.
* **Checks (all recorded in `reports/figures/chNN.md`):** projection, extent and axes match in kind; units and sign conventions stated; **2–4 numbers checked against independent published values** (e.g. RAPID 17 Sv; QBO period ≈ 28 months; Kelvin h_e ≈ 25 m; Gulf Stream/Kuroshio ψ 30–60 Sv); visual comparison by eye with the crop (patterns, positions, magnitudes); and a **"no copying" check**: colormap, layout and annotations are ours, and no text or pixels come from the crop.
* **Loop:** at most 3 fix rounds with the data-scout (wrong level, sign or period), then report the discrepancy instead of tuning the figure to look like the book.

### 5.3 Where they fit in the chapter pipeline
data-scout runs after *curate* (once the curation lists which data figures the chapter shows) in parallel with *design*. figure-reproducer runs in parallel with viz-building and notebook-building. `lesson-reviewer` checks that each data figure has its reading notes; `check_public` is extended to fail if any file under `_private/` or any `figure_refs` path is referenced from a published page.

---

## 6. Risks and open points
1. **PSL THREDDS/OPeNDAP returned 503** on the test day and the old R1 directory names now return 403. Fetchers must use `downloads.psl.noaa.gov/Datasets/ncep.reanalysis.{dailyavgs,derived}/…` and fall back to whole-file HTTPS.
2. **ARCO-ERA5 is chunked one hour per chunk** (≈ 150 MB per variable). It is right for snapshots, wrong for time series; time series go through the CDS or NCEP.
3. **ECCO volume:** stream-and-reduce is mandatory. Confirm the V4r4 collection short-names at first use.
4. **Windows packaging:** `windspharm/pyspharm`, `dedalus` and some neutral-density packages may not install with pip on Windows. Fallbacks: our own solvers, or WSL/Colab.
5. **Licences to re-verify per dataset at download:** FU Berlin, MIMOC, RAPID (citation terms), JRA (redistribution), CMEMS (attribution text).
6. **Substitutions that change the variable** must say so in the caption: OLR instead of cloud brightness (18.23); reanalysis composite instead of GCM composite (17.25); ECCO density-space residual instead of a hydrographic inverse (21.18 left); ERA5 to 1 hPa instead of 0.1 hPa (17.13 top); JHTDB/model spectrum instead of lab pipe data (11.4); ERA5 KE spectrum instead of aircraft data (12.9).

---

## Sources (checked 2026-10-20)
* NOAA PSL data directories: https://downloads.psl.noaa.gov/Datasets/ · NCEP R1 page: https://psl.noaa.gov/data/gridded/data.ncep.reanalysis.html
* ARCO-ERA5: https://github.com/google-research/arco-era5 · https://cloud.google.com/storage/docs/public-datasets/era5 · WeatherBench2 bucket `gs://weatherbench2/datasets/era5/`
* Copernicus CDS: https://cds.climate.copernicus.eu/
* ECCO: https://www.ecco-group.org/products-ECCO-V4r4.htm · https://ecco-access.readthedocs.io/en/latest/Using_ECCO_access.html · https://ecco-v4-python-tutorial.readthedocs.io/AWS_Cloud_getting_started.html · https://podaac.jpl.nasa.gov/announcements/2021-04-27-ECCO-Version-4-Datasets-Release
* MIMOC: https://www.pmel.noaa.gov/mimoc/ · WOA23: https://www.ncei.noaa.gov/products/world-ocean-atlas · RG Argo: https://sio-argo.ucsd.edu/RG_Climatology.html · GLODAP: https://glodap.info/index.php/mapped-data-product/
* Orsi fronts (AADC): https://data.aad.gov.au/metadata/records/antarctic_circumpolar_current_fronts · Park & Durand fronts (SEANOE): https://www.seanoe.org/data/00486/59800/
* FU Berlin QBO: https://www.geo.fu-berlin.de/met/ag/strat/produkte/qbo/ · SSW compendium: https://csl.noaa.gov/groups/csl8/sswcompendium/
* RAPID: https://rapid.ac.uk/ · GDP drifters: https://www.aoml.noaa.gov/phod/gdp/ · Natural Earth: https://www.naturalearthdata.com/ · ETOPO 2022: https://www.ncei.noaa.gov/products/etopo-global-relief-model
* CERES EBAF: https://catalog.data.gov/dataset/ceres-energy-balanced-and-filled-ebaf-toa-monthly-means-data-in-netcdf-edition4-2-1 · JRA-3Q at RDA: https://rda.ucar.edu/datasets/d640000/
* Wheeler–Kiladis tools: https://easyclimate.readthedocs.io/en/stable/auto_gallery/filter/plot_wk_spectra.html · https://mdtf-diagnostics.readthedocs.io/en/main/sphinx_pods/Wheeler_Kiladis.html
