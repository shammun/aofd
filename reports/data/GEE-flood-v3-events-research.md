# GEE-flood-v3-events-research: candidate flood pairs that were not adopted (Harvey, Florence, Ian, Nargis April, Idai S2)

Registry entry `GEE-flood-v3-events-research` (provenance audit, 2026-11-07).

- **Files**: five bundles in `raw/GEE/ch00_flood_v2/`, each with a `.request.json` sidecar that records the event, the landfall
  time, the days with their satellite and clear fraction, the bounds and the size. Fetched 2026-11-05.

  | Bundle | Dates | Clear fraction |
  |---|---|---|
  | `v3_harvey2017.npz` | 22 and 31 Aug 2017 | 0.64 / 0.91 |
  | `v3_florence2018.npz` | 6 and 19 Sep 2018 | 0.48 / 0.90 |
  | `v3_ian2022.npz` | 23 and 30 Sep 2022 | 0.95 / 0.94 |
  | `v3_nargis_apr.npz` | 15 and 17 Apr 2008 | 0.92 / 0.70 |
  | `v3_idai_s2.npz` | Sentinel-2 L1C, 10 and 25 Mar 2019 | — |

- **Route**: Earth Engine `computePixels` bundles through `fetch(ee://…)`. The script is
  `scratch/movies/ch00_coordinates/research/flood_v3/_scripts/fetch_pairs.py` (on G:), with `spec_*.json` files.
- **Licence verdict**: NASA MODIS open data; Copernicus Sentinel terms for Idai S2. **redistributable: yes.**
- **Use**: event survey only. The adopted pairs are Nargis 2008 and Idai 2019 MODIS, registered as `GEE-MODIS-flood-v3`.
- **Disk**: no download in this task. 2026-11-07: C: 112.4 GB, G: 472.8 GB free. Not evictable.
