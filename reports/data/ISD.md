# ISD — NOAA NCEI Global Hourly (ISD): Brest 1–2 Nov 2023 and SYNOPs at 03 UTC 2 Nov 2023 (movie ch00_reading_weather_maps, D1)

- **Route**: NCEI Access Data Service, `…/access/services/data/v1?dataset=global-hourly&stations=…&startDate=…&endDate=…
  &format=csv` (anonymous) → `fluidpy.data.isd.fetch` → `fluidpy.data.fetch`.
  - **Pitfall**: `boundingBox` is refused for global-hourly (HTTP 400 "A station is required", checked 2026-10-27).
    This contradicts the planning note. Box requests therefore list the stations from `isd-history.csv` that cover the
    date: 318 stations in 45–55°N 10°W–5°E, sent 80 per request (4 requests).
- **Licence verdict**:
  - NOAA part: US Government work. Non-US station reports (France, UK, Belgium …) are **WMO Resolution 40** exchanges:
    free for research and education, but not for commercial use or commercial redistribution, and the notice must
    travel with copies.
  - **Redistributable: yes, non-commercial only.** The notice is embedded in each product's `meta.wmo_res40_notice`.
    The movies are non-monetised, so the use is allowed.
  - Credit: "NOAA NCEI Global Hourly / Integrated Surface Database (ISD)".
- **Downloads**:

  | File | Bytes |
  |---|---|
  | Brest CSV | 94,644 (1.1 s) |
  | box part00 | 76,031 |
  | box part01 | 72,343 |
  | box part02 | 103,238 |
  | box part03 | 124,980 |
  | `isd-history_20261027.csv` | 2,914,601 (4.2 s) |

- **Derived products** (`fluidpy.data.movie_rwm.isd_products`; repo `data/derived/ch00/` + G: `derived/ch00/`):
  - `rwm_isd_brest_2023-11-01T12_2023-11-02T09.json`, 37,062 B: 59 reports (FM-12 + FM-15), decoded, with the raw
    SYNOP/METAR text.
  - `rwm_isd_synop_2023-11-02T03_45-55N_10W-5E.json`, 151,328 B: 246 SYNOPs at 03:00 UTC (206 with SLP). Each carries
    the ERA5 msl at the station (bilinear, from A1).
- **Brest re-read (it matches the plan table)**:

  | UTC | report | decoded |
  |---|---|---|
  | 1 Nov 18 | SYNOP `81518 10103 20098 39718 49833 58103 … 765//` | 150° 18 kt, 10.3/9.8 °C, SLP 983.3, station p 971.8 |
  | 2 Nov 00 | METAR `LFRB 020000Z AUTO 22042G61KT 2400 RA BR … 11/10 Q0963 …` | 220° 42 kt G61, QNH 963 |
  | 2 Nov 01 | METAR `LFRB 020100Z AUTO 24044G66KT 3600 RA BR … 11/09 Q0962 …` | 240° 44 kt G66, QNH 962 (lowest) |
  | 2 Nov 03 | SYNOP `82739 10092 20075 39582 49696 53055 763// 333 4/000 6///7 91084 90710 91184 555 6///5=` | 270° 39 kt, 9.2/7.5 °C, SLP 969.6, +5.5 hPa, ww 63; `907tt`=10 → `911ff` = 84 kt highest gust in the past hour |

  The highest METAR gust in the window is 75 kt (02:30 UTC). ISD stores wind in m/s × 10 (39 kt → 20.1 m/s), and the
  SYNOP text lacks the `AAXX YYGGiw` groups (ISD drops them).
- **RM27**: RMS(station SLP − ERA5 msl) is **0.86 hPa** over 206 stations (median −0.04), and 0.60 hPa without the
  outlier. The outlier is **Scilly St Mary's** (03800099999): 955.6 hPa against ERA5 964.4 hPa, 181 km from the ERA5
  centre (953.7 hPa at 50.0°N 3.75°W at 03Z; RM31 → '954'). It is suspect; keep it out of the hand analysis.
- **Quick-look**: `outputs/ch00/data/rwm_isd_synop_03z.png`. The winds turn anticlockwise round the low over the
  Channel, and the scatter lies on the 1:1 line.
- **Colab route**: the committed JSON.
- **Disk**: before, C: 61.8 GB and G: 562.9 GB free. After, C: 64.8 GB and G: 561.4 GB. C: dipped to 33.0 GB during
  part02 from another process (see the reply). Nothing evicted.
