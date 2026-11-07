# GEE-S1-amphan2020: Sentinel-1 GRD IW sigma0 (VV, VH, dB), relative orbits 150 and 48, 16 / 22 / 28 May and 3 Jun 2020, per-day mosaics with a 50-m focal median, 88.80-89.92 E, 22.12-22.75 N (Satkhira and the Sundarbans, Cyclone Amphan); plus JRC Global Surface Water v1.4 occurrence and seasonality on the same grid

Written 2026-11-06 by the data agent from the registry entry (the data were fetched earlier by the 5b builder/flood research; no new download).

- **Route**: Google Earth Engine computePixels through fluidpy.data.fetch(ee://..., retrieve=...) and the disk guard (flood research v2, scratch/movies/ch00_coordinates/research/flood_v2/_scripts/amphan_close.py); the movie builder reads cache hits only
- **Fetcher**: `fluidpy.data.fetch (ee:// with a retrieve callable; proposed fluidpy.data.gee)`; login: Earth Engine (the user's project; credentials outside the repo)
- **Licence**: Copernicus Sentinel data terms (free, full and open; attribution 'Contains modified Copernicus Sentinel data 2020'); JRC GSW v1.4 CC-BY 4.0 (https://sentinels.copernicus.eu/documents/247904/690755/Sentinel_Data_Legal_Notice). **Redistributable: yes.**
- **Credit line**: Contains modified Copernicus Sentinel data 2020, processed in Google Earth Engine; EC JRC / Google Global Surface Water v1.4
- **Citation**: Copernicus Sentinel-1 GRD (ESA); Pekel, J.-F., Cottam, A., Gorelick, N., Belward, A. S. (2016): High-resolution mapping of global surface water and its long-term changes. Nature 540, 418-422, doi:10.1038/nature20584
- **Size**: 116,615,068 B; fetched 2026-11-05; raw on G: under the data root: `raw/GEE/ch00_flood_v2/close_s1.npz`, `raw/GEE/ch00_flood_v2/close_s1.request.json`, `raw/GEE/ch00_flood_v2/close_jrc.npz`, `raw/GEE/ch00_flood_v2/close_jrc.request.json`
- **Coordinates**: EPSG:4326 grid 1920 x 1168, row 0 = north; o150 at 23:55-23:56 UTC, o48 at 00:03-00:04 UTC
- **Checks**: new water orbit 150, 16 -> 22 May 2020 = 124.9 km^2 (VV < -18 dB after, not before, drop >= 3 dB, not JRC seasonality >= 10 months, blobs >= 9 px); research flood_v2/s1/numbers.json
- **Used by**: movie ch00_coordinates_storm s30 (the radar before/after; user notes 2026-11-06 item 11), s35 (recap thumbnail)
- **Colab route**: the movie's committed derived images / JSON (no keys); refreshing needs the source route above.
- **Archive**: see `reports/data/ch00_storm_events_archive.md` for reuse in later cyclone movies.
- **Disk**: no download in this session (C: 108.2 GB, G: 456.0 GB free on 2026-11-06).
