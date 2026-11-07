# NOAA-ERI: NOAA NGS Emergency Response Imagery, Hurricane Ian, 30 Sep 2022 (Fort Myers Beach tiles)

Registry entry `NOAA-ERI` (added by the provenance audit, 2026-11-07). Research: `reports/data/ch00_coordinates_research.md` §4,
`reports/data/ch00_coordinates_flood_visuals.md` §3.

- **Route**: anonymous HTTPS from the NODD bucket `noaa-eri-pds`, through `fluidpy.data.fetch()` (whole GeoTIFF tiles).
- **Files** (`raw/NOAA-ERI/`):

  | Tile | Bytes | Time | Fetched | Used for |
  |---|---|---|---|---|
  | `20220930bC0815700w262700n.tif` | 70,086,745 | 23.3 s | 2026-11-05 00:45 | v1 `fmb_aerial_*` slider (research) |
  | `20220930bC0815745w262745n.tif` | 132,126,103 | 63.1 s | 2026-11-05 01:51 | v2 aerial swipe: Times Square, the pier, Matanzas Pass bridge (research) |

  The sha256 values are in the registry.
- **Contents**: 8-bit RGB at ≈ 25 cm. The tile name gives the NW corner as packed degree-minute-second digits.
  The "before" image is NAIP Dec 2021 on the same footprint (`GEE-flood-v2-ian2022`, `ian_naip_20220930bC0815745w262745n.npz`).
- **Licence verdict**: NOAA NODD, checked 2026-11-07 on the AWS registry page. The terms say NODD data is
  *"open to the public and can be used as desired"*. NOAA asks for attribution of unaltered data, no implied endorsement,
  and modified data must not be presented as original. **redistributable: yes.**
  Suggested citation: "NOAA Emergency Response Imagery was accessed on 2026-11-05 from https://registry.opendata.aws/noaa-eri".
- **Use**: research only. No movie or repo product reads these tiles yet: the Ian aerial slider was proposed but not adopted.
  The research products are on G: scratch (`research/before_after/`, `research/flood_v2/clips/ian_aerial_swipe_mid.png`).
- **Colab route**: none (not used).
- **Disk**: no download in this task. Original fetches: C: 48.2 GB; G: 465.7 GB (first tile) and 496.1 GB (second tile).
  2026-11-07: C: 112.4 GB, G: 472.8 GB. No evictions. Neither tile has a `derived_on_root`, so neither is evictable.

Source: [NOAA Emergency Response Imagery on AWS (registry, licence)](https://registry.opendata.aws/noaa-eri/)
