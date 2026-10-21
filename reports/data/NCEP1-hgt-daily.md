# NCEP1-hgt-daily — NCEP/NCAR Reanalysis 1, daily-mean geopotential height (PoC E, PoC F)

- **Route**: OPeNDAP subset via pydap (`fluidpy.data.psl.fetch_daily`) from
  `https://psl.noaa.gov/thredds/dodsC/Datasets/ncep.reanalysis.dailyavgs/pressure/hgt.2014.nc`, selecting one day and
  500 hPa on the server (37,106 bytes, 1.3 s). HTTPS fallback = the whole yearly file from
  `https://downloads.psl.noaa.gov/Datasets/ncep.reanalysis.dailyavgs/pressure/hgt.2014.nc`.
- **What happened (2026-10-21)**: the first OPeNDAP attempt failed while *writing* the subset (pydap passes the
  reserved `_NCProperties` attribute; fixed in `fetch`). The fallback ran through the guard: 84,885,420 bytes in
  132 s, sha256 `3e1cf6ef…e838` (pinned in the registry). The fixed OPeNDAP route then worked, and the two routes
  agree exactly (max |difference| = 0 m). The yearly file is registered and evictable (its derived product exists).
- **Licence verdict**: US Government work, public domain. PSL asks for the acknowledgement "NCEP/NCAR Reanalysis 1
  data provided by the NOAA PSL, Boulder, Colorado, USA, from their website at https://psl.noaa.gov"
  (https://psl.noaa.gov/data/gridded/data.ncep.reanalysis.html). Cite Kalnay et al. (1996). **Redistributable: yes.**
- **Pitfalls**: latitude runs N→S in the file (sorted S→N); lon 0–357.5 E; daily means are 00–24 UTC averages; old
  `…/ncep.reanalysis/Dailies/…` paths return 403; the pydap DAP2 warning is harmless.
- **Date choice — 2014-01-06**: the January 2014 North American cold outbreak (the "polar vortex" event). The 500 hPa
  map has one of the clearest trough–ridge pairs of the record. The trough is deepest at 90°W (lon 270°E) at
  40–50°N, over the Great Lakes, and the amplified ridge sits at 120–122.5°W (237.5–240°E) along the west coast. The
  zonal standard deviation of Z500 is 187 m at 50°N. The heights run from 4929 m to 5924 m. These give strong,
  easy-to-read geostrophic winds for the scene.
- **Derived product**: `data/derived/ch00/ncep_r1_z500_20140106.nc` (28,255 bytes; `z` [m] float32 zlib, 73×144,
  lat S→N, provenance attrs). Also on G: under `derived/ch00/`. Quick-look:
  `outputs/ch00/data/ql_ncep_r1_z500_20140106.png`.
- **Colab route**: the notebook loads the committed derived file and needs no keys. To refresh, run
  `fluidpy.data.psl.z500_day("2014-01-06")`, which is anonymous.
- **Disk**: C: 97.0 GB and G: 589.7 GB free at the start. After the HTTPS fallback: C: 90.9 GB, G: 589.6 GB. After
  the OPeNDAP subset: C: 90.9 GB, G: 589.6 GB. The C: drop happened during this phase but was not caused by these
  downloads, which all went to G:. Project data on G: is 0.08 GB.
