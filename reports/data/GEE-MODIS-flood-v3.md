# GEE-MODIS-flood-v3: MODIS v061 surface reflectance MxD09GQ (b1, b2, 250 m) + MxD09GA (b7, b4, b3, state_1km, 500 m) on one grid per event: Cyclone Nargis 2008 (Irrawaddy delta, 94.0-96.6 E, 15.6-17.1 N; Terra 21 Apr, 5 May; Aqua 2 May) and Cyclone Idai 2019 (Beira, 33.6-35.2 E, 20.6-19.3 S; Aqua 11 Mar, 19 Mar; Terra 25 Mar)

Written 2026-11-06 by the data agent from the registry entry (the data were fetched earlier by the 5b builder/flood research; no new download).

- **Route**: Google Earth Engine computePixels through fluidpy.data.fetch(ee://..., retrieve=...) and the disk guard (flood research v3, scratch/movies/ch00_coordinates/research/flood_v3/_scripts/fetch_pairs.py); the movie builder reads cache hits only (gee_cached)
- **Fetcher**: `fluidpy.data.fetch (ee:// with a retrieve callable; proposed fluidpy.data.gee)`; login: Earth Engine (the user's project; credentials outside the repo)
- **Licence**: NASA open data (MODIS, LP DAAC): no restrictions; credit NASA (https://lpdaac.usgs.gov/data/data-citation-and-policies/). **Redistributable: yes.**
- **Credit line**: NASA MODIS (LP DAAC) via Google Earth Engine
- **Citation**: Vermote, E., Wolfe, R. (2021). MODIS/Terra and Aqua Surface Reflectance Daily L2G Global 250m and 500m SIN Grid V061. NASA EOSDIS LP DAAC, doi:10.5067/MODIS/MOD09GQ.061, doi:10.5067/MODIS/MOD09GA.061
- **Size**: 135,074,372 B; fetched 2026-11-05; raw on G: under the data root: `raw/GEE/ch00_flood_v2/v3_nargis2008.npz`, `raw/GEE/ch00_flood_v2/v3_nargis2008.request.json`, `raw/GEE/ch00_flood_v2/v3_idai2019.npz`, `raw/GEE/ch00_flood_v2/v3_idai2019.request.json`
- **Coordinates**: EPSG:4326 grid, row 0 = north; Nargis 1600 x 962 px, Idai 1600 x 1383 px (square pixels in metres at the box centre)
- **Checks**: -
- **Used by**: movie ch00_coordinates_storm s31-s34 (natural colour 1-4-3 then false colour 7-2-1; user notes 2026-11-06)
- **Colab route**: the movie's committed derived images / JSON (no keys); refreshing needs the source route above.
- **Archive**: see `reports/data/ch00_storm_events_archive.md` for reuse in later cyclone movies.
- **Disk**: no download in this session (C: 108.2 GB, G: 456.0 GB free on 2026-11-06).
