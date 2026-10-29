# NCEP1-uv-daily (with NCEP1-hgt-daily): NCEP R1 10 hPa height and wind, winter 2025–26 (movie #5 D1, s35–s36)

- **Route**: PSL THREDDS OPeNDAP via pydap, through `fluidpy.data.psl.fetch_daily_range`.
  - Server-side subset: time range, level 10 hPa, lat 90→20.
  - One file per variable and calendar year: `hgt`, `uwnd`, `vwnd` × 2025/2026, six subsets of 355–701 kB (3.26 MB in all), 3.3–4.7 s each.
  - About 9 min wall time, mostly pydap metadata latency.
  - Fallback: HTTPS whole-year files (hgt 85/18 MB, uwnd 156/32 MB, vwnd 159/33 MB for 2025/2026; HEAD-checked).
- **Pitfall: NCEP R1 has ended.** The last day is **2026-03-17** (NWS switch CDAS → CORe;
  https://psl.noaa.gov/news/2026/r1datanotice.html). The 2026 files end there and no later R1 days will appear.
  `psl.R1_LAST_DAY` clips requests. For "latest data" after March 2026, use ERA5 (CDS/ARCO).
- **Other pitfall**: PSL latitudes run N→S; the product sorts them S→N.
- **Licence**: US Government work, public domain. PSL acknowledgement string in the registry. **Redistributable: yes.**
- **Product**: `ncep_r1_10hPa_20251101_20260317.nc` (3,053,776 B, sha256 `d2173163…9247`), on G: and in the repo
  (`data/derived/ch00/`).
  - `z`, `u`, `v` on (137 days, 29 lat 20–90 N, 144 lon).
  - `u60`: zonal-mean u at 60° N.
- **Method**: centre = sub-grid minimum of z north of 45° N (`fluidpy.diag.cyclone.storm_centre`; do not pass a 0–360° box,
  which collapses to zero width modulo 360). Ring winds = `storm_relative_wind`, observed and geostrophic
  (`fluidpy.geo.atmos.geostrophic_wind_from_height`).
  - Re-run on A7 (6 Jan 2014), the method reproduces every planning number (28 059 m; 78.70° N 43.85° W; ratio 0.87 → 0.42).

| Day | Why | u60 | Centre (from pole) | z centre / z 30° N | rms v_r / v_t at 2000 km, pole → centre | Edge (max ring-mean v_t about the centre) |
|---|---|---|---|---|---|---|
| **2026-01-21 (recommended)** | strongest of the winter (max u60), strongly displaced | 42.1 m/s | 72.89° N 44.26° E, Barents Sea (1902 km) | 28 602 / 30 721 m | 1.88 → 0.42 (geo 1.76 → 0.39) | 51.8 m/s at 2500 km |
| 2026-01-05 | strong compact vortex | 41.9 | 77.21° N 4.32° E, Greenland Sea (1423 km) | 28 386 / 30 775 | 0.53 → 0.24 | 59.7 at 3000 km |
| 2026-02-09 | most displaced | 20.6 | 60.13° N 76.45° E, W Siberia (3322 km) | 28 957 / 30 714 | 9.1 → 0.37 | 46.4 at 1750 km |
| 2026-03-06 | wind reversal | −8.8 | 57.5° N 60° E (grid point) | 29 425 / 30 684 | about the pole v_t −16.8 (easterly) | 41.7 at 1250 km |

- **Notes on 2026-01-21**:
  - Observed winds reach 79 m/s (geostrophic 90).
  - DC36 numbers to reword: "about twenty eight and a half kilometres in the middle, almost thirty one at thirty degrees north" (30.7 km).
  - The centre is "almost seventy three degrees north, over the Barents Sea, north of Russia", **not** over Greenland.
  - **DC37 holds even more strongly than in 2014**: the ratio drops from 1.88 to 0.42.
- **March 2026 reversal**: zonal-mean u at 60° N, 10 hPa < 0 from 4 to 10 March (minimum −8.8 m/s on 6 March).
  - This meets the major-warming wind criterion (Charlton and Polvani 2007).
  - R1 stops on 17 March, leaving only 7 westerly days afterwards, so a midwinter warming cannot be told from the final warming.
  - No agency or journal text was found; there is only a secondary report (The Watchers, 5 Mar 2026, citing NOAA CPC).
  - **Safe wording**: "in early March 2026, the winds round the Arctic at that height turned round". No "split".
  - Late November 2025 came close (u60 = 1.3 m/s on 28 Nov) but did not reverse.
- **Quick look**: `outputs/ch00/data/d1_ncep_10hPa_2025-26.png` (four polar views and the u60 series; orientation right, lows over
  the Barents Sea / Siberia / Urals as computed).
- **Colab route**: load `data/derived/ch00/ncep_r1_10hPa_20251101_20260317.nc` (no keys). Refresh is anonymous OPeNDAP.
- **Disk**:

  | | C: free | G: free |
  |---|---|---|
  | Before | 67.7 GB | 536.1 GB |
  | After | 67.7 GB | 535.5 GB |

  The G: change is the parallel movie render scratch, not this fetch. Nothing was evicted.
