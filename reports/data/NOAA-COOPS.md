# NOAA-COOPS: tide gauges round Hurricane Ian, 27–30 Sep 2022 (movie #5 D3, s40, DC44)

- **Route**: CO-OPS Data API `datagetter` (anonymous JSON, no key), through the new F5 `fluidpy.data.coops.fetch_water_level`.
  - Settings: MHHW, metric, GMT, 6-minute data.
  - Requests are cut into 31-day chunks; an `"error"` reply raises `COOPSError` and is never cached.
  - Six requests (water_level and predictions × 3 stations): 287,639 B, 1.1–2.9 s each.
- **Pitfall fixed**: the API answers HEAD with `Content-Length: 0`. `fluidpy.data._head_size` now treats 0 as unknown, so
  the guard uses the fetcher's estimate (about 110 B per record). There is a test for this.
- **Licence**: US Government (NOAA), public domain. NOS asks for attribution and that modified data not be presented as
  official (https://tidesandcurrents.noaa.gov/disclaimers.html). **Redistributable: yes.**
- **Quality flag**: "v" (verified) at all three stations.
- **Product**: `coops_ian_surge_20220927_20220930.nc` (55,813 B, sha256 `c4f015cf…f548`), on G: and in the repo.
  - `water_level`, `prediction` and `residual` (observed − predicted) on (station, 6-min time).
- **Numbers (DC44 PASS)**:

  | Station | Location | Peak / lowest residual | Notes |
  |---|---|---|---|
  | 8726520 St. Petersburg | 27.761° N 82.627° W | **−1.755 m** at 23:00 UTC 28 Sep | observed −1.889 m relative to MHHW at 23:12 |
  | 8725520 Fort Myers | 26.648° N 81.871° W | **+2.209 m** at 22:18 UTC | observed 2.212 m above MHHW = **7.26 ft, the NHC TCR value** |
  | 8725110 Naples | 26.132° N 81.808° W | +1.91 m at 17:06 UTC | record then stops; the TCR says the station was destroyed (6.18 ft above MHHW) |

  - Calm residuals before the storm (27 Sep 00–12 UTC): +0.20 to +0.28 m.
- **Gauge-location caution**: 8725520 is in **downtown Fort Myers on the Caloosahatchee River, not on Fort Myers Beach**.
  The Fort Myers Beach value (10–15 ft above ground, NHC TCR) comes from USGS sensors and high-water marks. Do not label
  the gauge curve "Fort Myers Beach".
- **Quick look**: `outputs/ch00/data/d3_coops_ian.png`. The Tampa Bay trough and the Fort Myers spike come about 3 h after the 19:05 UTC landfall.
- **Tests**: `../Fluid Dynamics/tests/data/test_coops.py` (15 tests). Fixtures are recorded excerpts:
  `fixtures/coops_8726520_{water_level,predictions}_20220928T18.json`.
- **Colab route**: the repo product (no keys). Refresh is the anonymous API.
- **Disk**:

  | | C: free | G: free |
  |---|---|---|
  | Before | 68.7 GB | 536.2 GB |
  | After | 68.5 GB | 535.8 GB |

  Nothing was evicted.
