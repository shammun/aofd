# COPDEM-GLO30: Copernicus DEM GLO-30 round Fuji and Everest (movie M01 D2, new fetcher F1)

- **Route**: anonymous AWS HTTPS, `fluidpy.data.copdem.fetch_tiles` through `fetch`. Six tiles, 215,785,385 B, about 305 s. Plan: 4 tiles. The Everest crop reaches 87.05° E, so it also needs the two E087 tiles. N34 E138 was fetched as asked, but no crop reaches it.
- **Licence**: I read the licence PDF. Free, worldwide, no time limit; reproduction, distribution, communication to the public, adaptation (Art. 4). Art. 6 requires, for adapted data, the notice "produced using Copernicus WorldDEM-30 © DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018 provided under COPERNICUS by the European Union and ESA; all rights reserved", the sentence "The organisations in charge of the Copernicus programme by law or by delegation do not incur any liability for any use of the Copernicus WorldDEM-30", and no implied endorsement. **Redistributable: yes, derived crops included.** The movie manifest must carry both sentences.
- **Decoder**: the COGs are DEFLATE + floating predictor 3. `imagecodecs` and `rasterio` are not in `.venv`, so `read_tile` undoes the predictor itself (tested exactly on a synthetic block, and real summits come out right). No new install.
- **Products** (G: only; `data/derived` is at 147.0 of 150 MB):

  | File | Grid | Size |
  |---|---|---|
  | `copdem_fuji_35p05-35p60N_138p50-139p00E.nc` | 1981 × 1800 | 8,649,446 B |
  | `copdem_everest_27p80-28p10N_86p70-87p05E.nc` | 1081 × 1261 | 3,068,006 B |

- **Checks**:

  | Row | Measured | Plan | Verdict |
  |---|---|---|---|
  | DM01, DM06 Fuji summit | 3768.4 m at 35.3606° N 138.7272° E | ≥ 3700; 3776 ± 30 | PASS |
  | DM06 summit to Tokyo Station | 100.6 km | 100 ± 10 | PASS |
  | DM07 500–3500 m contours | all exist | | PASS |
  | DM08 upper spacing (steepest, 3 azimuths) | 350, 383, 292 m; median 350 | 350 ± 70 | PASS |
  | DM08 lower spacing (radial line) | 3610, 1740, 1236 m; median 1740 | 2000 ± 500 | PASS |
  | DM09 interval/spacing | 0.572 (az 45°) | 0.571 | PASS |
  | DM11 Everest | **8737.8 m** | 8849 ± 60 | **FAIL, −111 m** |
  | DM11 Lhotse | **8416.0 m** at 27.9617° N 86.9325° E | 8516 ± 60 | **FAIL, −100 m** |
  | DM13 South Col | 7860.3 m at 27.9745° N 86.9317° E, raw cell 7857 m; rises N and S, falls E and W | 7900 ± 60 | PASS |

- **Pitfalls**:
  - The DEM shaves sharp summits. Spoken heights stay the cited ones, but the top contour on the Everest map is 8700 m, so no 8800 m line exists.
  - It is a surface model: forest and snow are included. On Fuji's lower slopes the steepest-path spacing fails ("level not reached") because of that noise, so the lower row uses a radial line. Smooth first, or use `method="line"`.
  - Keep coordinates float64. Float32 longitudes make an arc-second grid fail the uniform-grid test (`write_nc(coords_float64=True)` added).
- **Colab route**: the crops are not in the repo. `fetch_tiles` is anonymous, about 215 MB. The movie builder's small heightmaps are the committed route.
- **Disk**: whole session, C: 60.4 → 61.0 GB free, G: 492.1 → 491.1 GB free, project data 98.07 → 99.01 GB. Render scratch moves these too. Nothing evicted.
