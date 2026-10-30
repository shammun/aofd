# ERA5-ARCO-front-20221222-pl5: Winter Storm Elliott Arctic front, five levels (movie #6 D8, s33b)

- **Route**: `fluidpy.data.era5_arco.fetch_box`, anonymous ARCO-ERA5 zarr, through the guard. 1,914,530 B on disk, about 800 MB of network, 91.2 s. Both candidate hours (12, 18 UTC) in one raw file.
- **Licence**: CC-BY 4.0 (Copernicus), attribution line required. **Redistributable: yes.**
- **Product**: `era5_front_elliott_2022-12-22T12_pl5.nc`, 1,165,824 B, on G: and in the repo. `t`, `u`, `v`, `z`, `zg`, `sp`, `below_ground` on (level bottom→top, lat S→N, lon).
- **Hour chosen**: 12 UTC. Its 700 and 500 hPa gradients are stronger than at 18 UTC.
- **DG33b, measured** with `fluidpy.data.movie_gradient.front_tilt` (`front_fields`, 100-km smoothing). Lines through the 850 hPa front at 39, 40, 41° N. Distance from the 850 hPa front, positive towards the cold air:

  | Level | 39° N | 40° N | 41° N | Peak (K/100 km) |
  |---|---|---|---|---|
  | 1000 hPa | −250 km | −188 km | −212 km | 9.3–10.5 |
  | 850 hPa | 0 | 0 | 0 | 6.9–7.0 |
  | 700 hPa | +438 km | +450 km | +400 km | 5.1–5.5 |
  | 500 hPa | +300 km | +288 km | +275 km | 3.6–4.5 |
  | 300 hPa | +275 km | +275 km | +262 km | 3.1–4.0 |

  - 850 → 500 hPa ≥ 100 km: **PASS** (275–300 km).
  - "Monotonically towards the cold side": **FAIL**. The band moves back 125–162 km from 700 to 500 hPa and 13–25 km from 500 to 300 hPa.
  - "About nine kilometres": **PASS**, box-mean Z(300 hPa) = 9.01 km.
  - 18 UTC also fails: 700 → 500 hPa −37 to −50 km, 500 → 300 hPa −125 to −188 km.
  - Runner-up 14 Feb 2021 12 UTC (raw kept) fails worse: the 500 hPa peak is only 0.8–1.2 K/100 km, so there is no upper front to show.
- **Case status**: the spec says a failed DG33b rejects the case, and I did not loosen it. The orchestrator decides. What is true for Elliott: every layer above the surface lies on the cold side of the near-ground front, by 260–450 km. The sentence "The crowded band shifts towards the cold side as we climb" is true up to 700 hPa only.
- **Pitfalls**: 1000 hPa is below ground over 78 % of the box and at every point on the three lines (sp 978–991 hPa), so those values are ERA5's extrapolation. West of 105° W, 850 hPa is below ground too (13 % of the box). `below_ground` masks both.
- **Colab route**: the repo product, no keys.
- **Disk**: whole session, C: 60.4 → 61.0 GB free, G: 492.1 → 491.1 GB free, project data 98.07 → 99.01 GB. Render scratch moves these too. Nothing evicted.
