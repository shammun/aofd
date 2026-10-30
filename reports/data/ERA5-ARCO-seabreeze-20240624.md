# ERA5-ARCO-seabreeze-20240624: Normandy winds and temperature, 24 June 2024 (movie #6 D5, s35)

- **Route**: `era5_arco.fetch_box`, 46,977 B, 12.5 s. Plus METAR, see `IEM-METAR.md`.
- **Licence**: CC-BY 4.0 (Copernicus). **Redistributable: yes.**
- **Product**: `era5_seabreeze_normandy_2024-06-24.nc`, 48,355 B, on G: and in the repo.
- **The onshore turn is real, so the s35 arrows can be data, not a cartoon**:

  | UTC | v10 at 49.5° N 0° E (Channel) | v10 at 49.0° N 0° E (inland) | t2m Channel / inland |
  |---|---|---|---|
  | 06 | −1.19 m/s | −0.66 m/s | 15.2 / 15.0 °C |
  | 09 | −1.16 | −0.90 | 18.9 / 22.0 |
  | 12 | −3.22 | −0.73 | 19.9 / 24.1 |
  | 15 | −4.98 | −1.02 | 19.4 / 25.2 |
  | 18 | −4.44 | −3.37 | 18.1 / 23.2 |

  Negative v10 is from the north, which is onshore on this coast. The onshore wind strengthens after late morning and reaches inland by 18 UTC.
- **Pitfall**: the morning wind was already weakly northerly, so this is a strengthening and inland spread more than a reversal. Say "the wind off the sea strengthens through the afternoon", not "the wind turned round".
- **Colab route**: the repo product, no keys.
- **Disk**: whole session, C: 60.4 → 61.0 GB free, G: 492.1 → 491.1 GB free, project data 98.07 → 99.01 GB. Render scratch moves these too. Nothing evicted.
