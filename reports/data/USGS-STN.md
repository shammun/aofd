# USGS-STN: USGS Short-Term Network high-water marks for Hurricane Ian (FAILED fetch, nothing kept)

Written by the provenance audit, 2026-11-07. The registry entry is `USGS-STN` in `data/registry.yaml`.

- **What was tried**: on 2026-11-05 at 00:53:58, the coordinates research (`reports/data/ch00_coordinates_research.md` §6–§7) fetched
  `https://stn.wim.usgs.gov/STNServices/Events.json` through `fluidpy.data.fetch()`.
  - The request went through the disk guard and was logged: 8,464 B, 1.3 s, sha256 `29c66519…4c29`.
  - The server sent back the Flood Event Viewer web app's HTML page instead of JSON, so the endpoint has moved.
  - The research agent deleted the file the same day. It is **not on disk** (`raw/USGS-STN/` does not exist).
- **Outcome**: we got no high-water marks for Ian, and no product, movie or figure uses USGS STN data.
  - The Fort Myers Beach surge height quoted in the movie comes from the NHC Tropical Cyclone Report (see `NOAA-COOPS.md`).
- **Licence (checked 2026-11-07 on the USGS copyrights page)**:
  - Data written or produced by USGS is in the U.S. public domain. Credit it as "Credit: U.S. Geological Survey".
  - STN data may be provisional and can be revised.
  - Verdict: **redistributable: yes**, with credit. This only matters if the data is ever fetched.
- **Route for a retry (not done; downloads were not allowed in this task)**:
  - The Flood Event Viewer `https://stn.wim.usgs.gov/FEV` links to an "STN Web Services Documentation" page. Find the current
    Events, Sites and HWMs endpoints there.
  - Then filter by event "Hurricane Ian 2022, FL" and fetch the HWM JSON or CSV through `fetch()`.
  - Note: the web search on 2026-11-07 did **not** confirm a new endpoint.
- **Colab route**: none (no product).
- **Disk**: no download in this task. 2026-11-07: C: 112.4 GB free, G: 472.8 GB free. No evictions.

Sources: [USGS copyrights and credits](https://www.usgs.gov/information-policies-and-instructions/copyrights-and-credits) ·
[STN Flood Event Viewer](https://stn.wim.usgs.gov/FEV) ·
[USGS FEV programme page](https://www.usgs.gov/mission-areas/water-resources/science/usgs-flood-event-viewer-providing-hurricane-and-flood-response)
