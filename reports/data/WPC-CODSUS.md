# WPC-CODSUS — WPC coded surface bulletin, valid 18 UTC 27 Oct 2026 (movie ch00_reading_weather_maps, D7)

- **Route**: IEM AFOS NWS-text archive, `retrieve.py?pil=CODSUS&sdate=2026-10-27T17:00Z&edate=2026-10-27T23:59Z&fmt=text`
  (anonymous) → `fluidpy.data.wpc.fetch_text` → `fluidpy.data.fetch`. 19,152 B in 1.2 s. The parsing chain is
  `wpc.split_products` → `wpc.bulletin` (MetPy 1.7.1 `parse_wpc_surface_bulletin`) → `movie_rwm.wpc_geojson`.
- **The download holds 7 products**: the 21Z and 18Z bulletins in both variants, some repeated. The 18Z products are
  the regular `ASUS01 KWBC 271935` (an identical copy is `271934`) and the high-resolution `ASUS02 KWBC 271800`
  (7-digit positions, tenths of a degree).
- **Licence verdict**: NOAA/NWS/WPC, US Government work, public domain. **Redistributable: yes.** Credit: "NOAA NWS
  Weather Prediction Center (coded surface bulletin), via the Iowa Environmental Mesonet".
- **Derived product**: `rwm_wpc_codsus_2026-10-27T18.geojson`, 90,084 B, in the repo `data/derived/ch00/` and on G:
  `derived/ch00/`. It holds both variants (property `hires`), the feature type, the strength (hPa for H/L) and the
  valid time.
- **Checks**:
  - **Counts**: the regular variant has 20 lows, 19 highs, 16 cold, 9 warm, 4 occluded, 12 stationary and 38 troughs,
    which is exactly the plan. The high-resolution variant is the same except for **5** occluded segments.
  - **RM42**: L 982 at 43°N 43°W (hi-res 43.0°N 43.0°W); H 1033 at 48°N 79°W (47.8°N 79.3°W); L 961 at 66°N 11°W
    (66.5°N 11.4°W).
  - **RM29**: an OCFNT starts at the 972 low at 58°N 53°W (hi-res 58.4°N 52.6°W), off Labrador.
  - **RM30**: there are 12 STNRY and 38 TROF segments.
  - The bulletin agrees with GFS 18Z within about 1 hPa (see GFS-ANL-20261027-rwm.md).
- **Pitfalls**:
  - Positions are degrees **west**; MetPy returns longitude negative. A leading '-' marks a southern latitude.
  - In the regular variant one OCFNT is degenerate (two identical points at 43°N 43°W). The renderer should use the
    hi-res variant.
  - The year is not in the bulletin; pass `year=2026`.
- **Colab route**: the committed GeoJSON.
- **Disk**: C: 38.4 GB free before (a transient dip from another process, see the reply) and 44.1 GB after. G: 562.8 →
  561.4 GB. Nothing evicted.
