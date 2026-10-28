# IEM-METAR — METARs at 18 UTC 27 Oct 2026 (movie ch00_reading_weather_maps, D8)

- **Route**: IEM `cgi-bin/request/asos.py` (anonymous CSV) → `fluidpy.data.metar.fetch` → `fluidpy.data.fetch`.
  - The service has no bounding-box parameter, but without a station list it returns every station for windows of up
    to 24 h.
  - So one request covers 17:50–18:10 UTC for all stations: 1,046,188 B in 46.4 s, 4,876 reports from 4,730 stations.
  - `metar.read(box=)` cuts 30–50°N 85–65°W, and `metar.nearest_in_time` keeps one report per station within ±10 min
    of 18:00, which gives 669 stations.
  - Rate limit: about 1 request per second per IP (HTTP 429/503 beyond that).
- **Licence verdict**:
  - NWS/FAA observations are public domain, and IEM asks for credit.
  - Non-US METARs are WMO Res 40 (non-commercial); Canadian reports fall under the ECCC Open Government Licence.
  - **Redistributable: yes (non-commercial for non-US reports).** Credit: "Iowa Environmental Mesonet (Iowa State
    University); NOAA/NWS and FAA observations".
- **Derived products** (repo `data/derived/ch00/`):
  - `rwm_iem_metar_2026-10-27T18_30-50N_85-65W.json`, 318,157 B. Units are converted: °F→°C, inHg→hPa, kt kept plus
    m/s, mi→m. The raw METAR text is kept. A copy is on G: `derived/ch00/`.
  - `rwm_iem_metar_stations_2026-10-27T18.json`, 219,309 B: the positions of all 4,730 reporting stations (s58).
- **RM44, METAR part: FAIL.**
  - Only one WPC cold front enters the box: the hi-res polyline from 53.6°N 40.7°W to 37.7°N 75.6°W, whose tail lies
    on the Virginia coast.
  - Within 200 km of it there are 14 stations on one side and 10 on the other. Their circular-mean wind directions are
    49° and 50° (a **1° turn**, against the ≥ 40° required), and their median temperatures 20.9 and 19.2 °C.
  - Use the s56 fallback (drop "the wind turns across the front" for this chart, or show it on Ciarán's front at
    Brest instead).
- **D2 cross-check (Brest, 2023)**: `station=LFRB`, 2023-11-01T12Z to 11-02T09Z, gave 41 METARs (11,653 B in 3.4 s).
  The 00Z and 01Z texts are **identical** to ISD's REM strings (`LFRB 020000Z AUTO 22042G61KT 2400 RA BR … Q0963 …`,
  `LFRB 020100Z AUTO 24044G66KT 3600 RA BR … Q0962 … BECMG 27030G60KT`).
- **Quick-look**: `outputs/ch00/data/rwm_iem_metar_18z.png`.
- **Colab route**: the committed JSON.
- **Disk**: before, C: 47.7 GB and G: 561.4 GB free. After, C: 64.0 GB and G: 561.4 GB. Nothing evicted.
