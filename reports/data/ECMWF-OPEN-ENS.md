# ECMWF-OPEN-ENS — IFS ensemble (open data), valid 18 UTC 27 Oct 2026 (movie ch00_reading_weather_maps, #69)

- **Route**: anonymous AWS mirror `https://ecmwf-forecasts.s3.eu-central-1.amazonaws.com/` (it keeps history; ECMWF's
  own portal `data.ecmwf.int/forecasts` keeps only the last 12 runs). Each `.grib2` has a JSON-lines `.index` with
  `_offset`/`_length` per message, and the lengths tile the file exactly (checked on `20261022120000-126h-enfo-ef`:
  8850 messages, total 4,343,751,783 B = file size). `fluidpy.data.ecmwf_open.fetch_fields` reads the index (cached
  under `raw/ECMWF-OPEN-ENS/index/`), keeps the wanted messages, merges adjacent byte ranges, downloads them with
  HTTP `Range` (8 in parallel; each reply must be 206 and the right length; each message must start with `GRIB` and end with `7777`) through
  `fluidpy.data.fetch(retrieve=…)` (so the disk guard and logging apply), and decodes with cfgrib 0.9.15 / eccodes 2.50.
- **Layout (checked 2026-10-29)**: `{YYYYMMDD}/{HH}z/ifs/0p25/enfo/{YYYYMMDDHH}0000-{step}h-enfo-ef.grib2`. Steps
  run 0–144 h every 3 h, then every 6 h to 360 h (00/12Z). The 06/18Z runs stop at 144 h. Pressure levels in `enfo`: 1, 2, 3, 4, 10, 50, 100, 150, 200, 250, 300,
  400, 500, 600, 700, 850, 925 and 1000 hPa. The 500-hPa field is `gh` (gpm); there is no `z`.
- **Pitfall: no control member.** Every `enfo-ef` index on AWS (and on the portal) holds `type=pf`, numbers 1–50 only.
  ECMWF's page lists the IFS control under `oper`/HRES, and only AIFS-ENS publishes `cf`. RM90 therefore fails as
  worded, so use **V-s72** (fifty members). A 51-member alternative with a control is ECMWF-OPEN-AIFS-ENS.
- **Licence verdict**: CC BY 4.0 plus the ECMWF Terms of Use for open data (https://apps.ecmwf.int/datasets/licences/general),
  no registration. **Redistributable: yes**, with attribution. Credit line: "ECMWF open data (CC BY 4.0)". The full attribution is in
  the registry (copyright ECMWF, the CC BY 4.0 link, a statement that the data were modified, and the disclaimer).
- **Downloads**: 7 GRIB files of 46.6–47.5 MB each, 100 messages per file (msl and gh500 × 50 members), about 0.47 MB per message,
  7 × 2.1 MB index files. The runs are 12Z 22/24/26 Oct (+126/+78/+30 h), 00Z 22/24/26 Oct (+138/+90/+42 h) and 18Z 27 Oct (+0 h).
  Each file took 30–70 s to transfer. Wall time was longer, about 1–2.5 min per file, because the disk guard reports before and after each one.
- **Derived products** (`fluidpy.data.movie_rwm_ecmwf.build_products`):

  | File | Where | Size | sha256 |
  |---|---|---|---|
  | `rwm_ecmwf_ens_2026-10-27T18.nc` (run × number × lat × lon, 0.25°, msl + z500) | G: `derived/ch00/` | 94,124,587 B | b389e21b…9087 |
  | `rwm_ecmwf_ens_2026-10-27T18.bin` (ensemble mean and s.d. of msl and z500, 1°, 7 runs) | repo `data/derived/ch00/` | 1,411,200 B | 9d8abb43…0bf6 |
  | `rwm_ecmwf_ens_2026-10-27T18.json` (header plus, per run, every member's low and its closed-isobar status, and 5520/5640/5760 m contours) | repo | 6,614,281 B | dd0e0511…0501 |

- **Low centres** (provisional until `fluidpy.diag` `match_low`, F24): for each member, the deepest grid point that is the msl minimum of its ±2° square,
  within 1200 km of the ECMWF analysis low (IFS HRES 18Z 27 Oct step 0, 983.15 hPa at 42.0° N 43.75° W). Each low
  carries a closed-isobar status: the depth to the highest isobar that rings this low alone (bounded within 1500 km and containing no other local minimum),
  `closed` (depth ≥ 1 hPa), `closed_2hPa`, and `n_closed_4hPa` (closed multiples of 4 hPa).
- **Spread table** (982 low; 50 members, 12Z runs and T+0):

  | Run | Lead | Lows found | No low | ≥ 1 closed 4-hPa isobar | Mean p | s.d. p | Min–max p | Pos. RMS spread | Max pair | Mean-position error | z500 s.d. along analysis 5520 m |
  |---|---|---|---|---|---|---|---|---|---|---|---|
  | 22 Oct 12Z | +126 h | 47 | 3 (members 3, 17, 30) | 45 | 1002.4 | 5.7 hPa | 984.9–1012.8 | 398 km | 1390 km | 649 km | 56.2 m |
  | 24 Oct 12Z | +78 h | 50 | 0 | 50 | 988.7 | 6.5 hPa | 976.5–1000.1 | 237 km | 928 km | 110 km | 26.5 m |
  | 26 Oct 12Z | +30 h | 50 | 0 | 50 | 986.4 | 2.2 hPa | 979.4–990.6 | 86 km | 297 km | 64 km | 7.3 m |
  | 27 Oct 18Z | +0 h | 50 | 0 | 50 | 982.1 | 1.5 hPa | 978.0–984.7 | 61 km | 199 km | 85 km | 2.6 m |

  For the 00Z runs: at +138 h, 50 lows, 593 km RMS spread, s.d. 6.2 hPa; at +90 h, 312 km and 7.3 hPa; at +42 h, 118 km and 3.7 hPa.
- **Checks**: the T+0 ensemble mean against the GFS analysis (same 0.25° box) gives msl RMS 1.18 hPa (0.46 hPa where GFS orography ≤ 500 m;
  PRMSL and ECMWF msl reduce differently over high ground), msl bias −0.09 hPa, z500 RMS 6.7 m and bias +5.5 m. Every GRIB
  `valid_time` is 2026-10-27T18:00 (RM104 PASS). ERA5 is not yet available for 27 Oct (the ERA5T lag is about 5 days), so there is no ERA5
  check.
- **Quick-look**: `outputs/ch00/data/rwm_ecmwf_ens_quicklook.png` shows the 5640-m spaghetti, the member lows and the msl spread at the four leads. North is up,
  and the trough and low sit near 42° N 43° W.
- **Colab route**: load the committed `.bin/.json` (no keys, no download). To refresh, run `python -m fluidpy.data.movie_rwm_ecmwf all`
  (anonymous; about 0.9 GB of byte ranges across the four ECMWF keys).
- **Disk**: before the first ECMWF fetch, C: 54.5 GB and G: 513.6 GB free. After the last fetch and the build, C: 54.1 GB and G: 511.7 GB
  free; project data 78.7 GB of 150. G: also moved because other sessions were rendering movies into `scratch/`. Nothing was evicted.
