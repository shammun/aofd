# ERA5-ARCO-nargis2008: ERA5 at Cyclone Nargis's landfall on the Irrawaddy delta (movie 5b, B11)

- **Route**: ARCO-ERA5 zarr (anonymous) → `fluidpy.data.era5_arco.fetch_box('2008-05-01T12', '2008-05-03T00', (13, 19), (92, 98))`
  → `fluidpy.data.fetch` (disk guard). **219,303 B in 29.6 s** on 2026-11-06 (sha256 `265e653d…cf44`); 37 hours × 25 × 25 points.
- **Licence**: Copernicus licence / CC-BY 4.0. **Redistributable: yes** (Copernicus attribution line).
- **Honesty check (ERA5 vs IBTrACS NI, 2 May 06–18 UTC)**: ERA5 box max 10-m wind **25.2 m/s**, min msl **982.0 hPa**;
  IMD 90 kt = **46.3 m/s** (3-min) / **962 hPa**; JTWC 115 kt = 59 m/s (1-min) / 937 hPa. ERA5 has ~0.55 of the IMD wind and
  is 20 hPa too shallow. **Directions only**, and say so in the voice. Track is good: ERA5 centre 16.25 N 94.5 E at 09 UTC vs
  IBTrACS 16.0 N 94.1 E (≈ 45 km).
- **Derived**: `derived/ch00/coord_storm_shore_winds.json → events.nargis`.
  - Coastal point: Irrawaddy delta coast south of Bogale, 15.778 N 95.174 E; ERA5 sea point 15.75 N 95.25 E (8.7 km).
  - Coast points (NE 10 m outer envelope): A 15.715 N 95.374 E → B 15.812 N 94.725 E; legs 10.8 km N, 69.5 km W; bearing 278.8°,
    **α = 171.2°**, ŷ′ = (−0.15, −0.99) points south, out to sea.
  - Chosen **11 UTC 2 May** (most negative across-shore of 06–18 UTC): u = +9.57, v = +16.46 (19.0 m/s from 210°, south-west)
    → along −6.93, **across −17.73 m/s, onto the land**. Across stays −15 to −18 m/s from 06 to 13 UTC, then the wind veers
    westerly and runs along the coast (−8.7 at 18 UTC).
  - msl at the sea point 989.3 hPa → ≈ 24 cm; ERA5 centre 982.1 hPa → ≈ 31 cm (IMD 962 hPa → ≈ 51 cm; JTWC 937 → ≈ 76 cm).
- **Colab route**: derived JSON; no keys. **Disk**: before/after C: 108.2 GB, G: 456.2 GB free. Nothing evicted.
