# OISST-v21: NOAA daily OISST v2.1, Gulf Stream, 29 October 2026 (movie #6 D7, s37)

- **Route**: anonymous HTTPS through `fluidpy.data.oisst.fetch_day`. The global daily file is 1,526,077 B, so a remote subset would save nothing. The newest day is 2026-10-29, `_preliminary`; final files replace those after about two weeks (newest final on 2026-10-30: 2026-10-15).
- **Licence**: US Government work, public domain; NCEI asks for the citation Huang et al. 2021 (doi:10.1175/JCLI-D-20-0166.1). The data_needs row cites the year 2021, the NCEI page prints 2020 for the same J. Climate 34 paper; 2021 is the volume year. **Redistributable: yes.**
- **Product**: `oisst_gulfstream_2026-10-29.nc`, 46,078 B, on G: and in the repo. 30–45° N, 80–55° W; SST 8.1–28.2 °C.
- **DG36, PASS**: the largest drop within 50 km over water deeper than 2000 m is **6.52 °C over 34.8 km**, from 21.46 °C at 40.875° N 65.125° W to 14.94 °C at 41.125° N 64.875° W. S3 can state these. 3.8 K across 55.6 km also appears off Cape Hatteras (35.1–35.6° N, 74.9° W).
- **Pitfall**: without the depth limit the maximum is 6.58 °C at 41.125° N 66.125° W, at the edge of Georges Bank. I excluded that as a shelf front. SST alone cannot prove which warm-water edge is the current's north wall and which a detached ring; the quick-look shows the chosen point on the continuous meandering edge.
- **Pitfall**: OISST is 0.25° and optimally smoothed. MUR 0.01° would show sharper numbers.
- **Colab route**: the repo product, no keys.
- **Disk**: whole session, C: 60.4 → 61.0 GB free, G: 492.1 → 491.1 GB free, project data 98.07 → 99.01 GB. Render scratch moves these too. Nothing evicted.
