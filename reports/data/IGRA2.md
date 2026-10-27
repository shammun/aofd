# IGRA2 — radiosonde soundings at Trappes and Singapore, 1 Nov 2023 (movie ch00_weather_basics, D1)

- **Route**: NOAA NCEI HTTPS, anonymous, through `fluidpy.data.fetch` (`fluidpy.data.igra`). IGRA keeps only the
  whole period-of-record file per station for past years (`access/data-por/<ID>-data.txt.zip`), so the subset is made
  after download.
  - Trappes `FRM00007145-data.txt.zip`: 31,665,518 B in 18.4 s. Singapore `SNM00048698-data.txt.zip`: 54,991,332 B in
    34.0 s. `igra2-station-list.txt`: 260,950 B in 0.7 s. The files are re-made daily, so sha256 is recorded but not pinned.
- **Format**: the fixed columns are in `doc/igra2-data-format.txt` and `doc/igra2-list-format.txt`. The codes −8888
  and −9999 become NaN, and the units are converted to SI (Pa, K, fraction, m/s, s).
  - The station list has one row with no ID or coordinates (line 955), which the parser skips.
- **Which sounding**: the target was 12 UTC on 1 Nov 2023. **Trappes has no 12 UTC sounding on 1 Nov in IGRA.** The
  launches near that time are:
  - 00 UTC 1 Nov: top 5.9 hPa;
  - 00 UTC 2 Nov: stops at 18.4 hPa;
  - 12 UTC 2 Nov: top 6.1 hPa.

  Both stations therefore use the **nominal 00 UTC 1 Nov 2023** launch (released 23:31 UTC on 31 Oct). Singapore's
  10 UTC sounding has no heights above 300 hPa, and its 00 UTC sounding is complete.
- **Heights**: Trappes reports heights only at standard levels. The significant levels are filled with the hypsometric
  equation, Vallis (2.166) (`igra.fill_heights` → `fluidpy.geo.atmos.hypsometric_thickness`), anchored on the nearest
  reported level.
  - Check: remove each reported height and fill it again. The error is under 13 m up to 10 hPa (Trappes) and under
    6 m (Singapore).
  - The surface level, filled downward, comes out at 166 m. The station elevation is 168 m.
- **Key numbers** (product `igra2_trappes_singapore_2023-11-01T00.nc`):

  | | Trappes 48.77°N 2.01°E | Singapore 1.37°N 103.98°E |
  |---|---|---|
  | levels / top | 64 / 5.9 hPa at 33.9 km | 121 / 5.41 hPa at 35.4 km |
  | surface | 987 hPa, 12.4 °C | 1008.5 hPa, 27.7 °C, z 33 m |
  | **WMO tropopause** | **10.88 km, −62.7 °C, 228 hPa** (= the station's own tropopause flag; 2nd flag at 47.2 hPa) | **16.16 km, −81.3 °C, 109.9 hPa** (= the station flag) |

  - **CHECK W24** (9.5–12.5 km, −50…−62 °C): the height passes. The temperature is **0.7 K colder than the range**, so
    the narration should say "about minus sixty".
  - **W26** (15.5–17.5 km, < −72 °C): passes.
- **Stations**: 941 of the 2,931 IGRA stations have a record that spans 2023 (first year ≤ 2023 ≤ last year). This is
  W36. It is an upper bound: a station with a gap over 2023 would still count. The file is
  `igra2_stations_2023.json` (56,563 B).
- **Pitfalls**:
  - Relative humidity is not reported by either station. Use the dew-point depression `dpd`.
  - Wind direction is the direction the wind blows FROM.
  - The header lat/lon is in degrees × 10⁴.
  - Launch time vs nominal hour: the 00 UTC sounding is released about 30 min earlier.
- **Licence verdict**: NOAA/NCEI distribution under the WMO data policy (free and unrestricted exchange), cite the
  dataset (doi:10.7289/V5X63K0Q). **Redistributable: yes.**
- **Colab route**: load the committed `data/derived/ch00/igra2_*.nc|json` (no keys). Refresh with `igra.fetch_station`
  (anonymous, about 87 MB).
- **Quick-look**: `outputs/ch00/data/ql_soundings_zonal.png` (T(z), p(z) against p₀e^{−z/8.4 km}).
- **Disk** (data-scout session 2026-10-27, all ch00_weather_basics downloads): before the first download C: 74.2 GB and G: 577.6 GB free, project data 11.96 GB; after the last one C: 74.0 GB and G: 576.2 GB free, project data 13.34 GB (raw 0.46 GB, up 0.18 GB from 0.28 GB). Nothing evicted. Every fetch printed and logged its own before/after line in `G:/Geophysical Fluid Dynamics/aofd-data/logs/downloads.log`.
