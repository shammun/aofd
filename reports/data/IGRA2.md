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

## Refresh for movie #4 ch00_derivatives_taylor (D1, 2026-10-28)

- **HEAD checks on 2026-10-28**:
  - `access/data-por/FRM00007145-data.txt.zip` is 31,665,518 B (Last-Modified 27 Oct 2026 21:41 GMT), the same size as
    the copy on disk. Its last sounding is 2026-09-30T12.
  - `access/data-y2d/FRM00007145-data-beg2026.txt.zip` was fetched through `fluidpy.data.fetch`: 624,714 B in 2.0 s,
    sha256 `292db4a2…3f13`. It holds 499 soundings, 2026-01-01T00 → **2026-09-30T12**.
  - Neither file has any October 2026 sounding yet. IGRA's monthly update has not reached October.
- **Verdict**: the newest sounding available is still **2026-09-30T12**, so A3 is kept and no movie number changes. The POR
  file was not downloaded again (same size; same last sounding).
- **The 2026-09-30T12 sounding is identical in both files** (82 levels, every field).
- **Elapsed time** is present on 100 % of its levels, so the "> 90 % etime" rule passes.
- **DT01 PASS**:
  - Surface 997.5 hPa, 168 m, 19.8 °C (292.95 K), etime 0.
  - 850 hPa: z 1533 m (`fill_heights`), 12.3 °C, etime 312 s.
  - 500 hPa: z 5795 m, −11.8 °C, etime 1212 s.
- **DT20 PASS**: 82 levels, filled z to 32,460 m.
- **DT45 PASS**: `igra.wmo_tropopause` gives 13,072 m, 206.85 K.
- **DT46 PASS**: T(15 km) = 210.82 K and T(20 km) = 215.76 K, both above the tropopause's 206.85 K. The air warms above
  the tropopause, so "gets a little warmer" can stay.
- **Disk**: before C: 68.0 GB, G: 544.6 GB free; after C: 68.0 GB, G: 544.6 GB free. Nothing evicted.
- **Disk** (data-scout session 2026-10-27, all ch00_weather_basics downloads): before the first download C: 74.2 GB and G: 577.6 GB free, project data 11.96 GB; after the last one C: 74.0 GB and G: 576.2 GB free, project data 13.34 GB (raw 0.46 GB, up 0.18 GB from 0.28 GB). Nothing evicted. Every fetch printed and logged its own before/after line in `G:/Geophysical Fluid Dynamics/aofd-data/logs/downloads.log`.

## Stack check for #1a K1A, 2026-10-29 (no download)

- The Trappes sounding of 2023-11-01T00 has wind at 41 levels in all. Only **14** of them lie between the surface and
  200 hPa: 987, 925, 917, 850, 700, 518, 500, 400, 300, 275, 250, 228, 201 and 200 hPa. There are 21 up to 100 hPa.
  That is fewer than the 16 the plan assumed.
- Turning: the wind turns 40° clockwise in total from 987 to 200 hPa (seen from above, Northern Hemisphere; direction
  210° → 250°). Between neighbouring levels it turns clockwise in only 6 of 13 pairs.
- The 16-layer stack therefore uses `ERA5-CDS-trappes-20231101T00-uv16`, which agrees with this sonde within 1.5 m/s
  and 8° at the standard levels. The sonde stays the hodograph's source in s12g.

## Refresh 2026-10-30 (movie #6 D3)

- **Trappes year-to-date file fetched again**: 624,714 B, newest sounding still **2026-09-30T12**. Nothing newer exists in IGRA.
- **D3 is superseded**: s17, s18, s32 moved to the Singapore sounding (data_needs §G). Re-measured on `igra2_trappes_singapore_2023-11-01T00.nc`:
  - Surface 33 m, 27.7 °C; WMO tropopause 16 163 m, −81.3 °C; layer −6.758 K/km; ρ 1.168 kg/m³; ρg 11.45 Pa/m; dp/dz −10.918 Pa/m; 9.159 m per hPa. All PASS.
  - The §G text "surface → 925 hPa (798 m)": 798 m is the height of the 925 hPa level; the layer is 765 m thick. The pressure gradient already uses 765 m, so no number changes.
  - DG16s 675.8/4.059 = 166.5, plan 166. Spoken "more than a hundred and sixty" holds.
- **Disk**: whole session, C: 60.4 → 61.0 GB free, G: 492.1 → 491.1 GB free, project data 98.07 → 99.01 GB. Render scratch moves these too. Nothing evicted.
