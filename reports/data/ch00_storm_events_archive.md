# Storm-event data archive: Ian 2022, Amphan 2020, Nargis 2008, Idai 2019 (Coordinates Part 2 = movie 5b, and later cyclone movies)

Written 2026-11-06 by the data agent (user request 2026-11-07: keep every event's assets and results for later cyclone movies,
e.g. Bangladesh cyclone events, even if 5b drops an event's before/after).

**Every event has usable wind and msl data**, so no event has to be dropped for lack of wind data. The caveat is that **ERA5
is far too weak in the cores of Amphan, Nargis and Idai** (0.55–0.66 of the regional best-track wind). Use ERA5 for wind
**directions**, the sign of the across-shore part and the storm centre. Do not use it for peak speeds or central pressure.

All paths below are under the data root `G:/Geophysical Fluid Dynamics/aofd-data/` unless they start with `movies/`, `data/` or `reports/`.

## Common products and conventions
- **Derived JSON**: `derived/ch00/coord_storm_shore_winds.json` (55,786 B, sha256 `9f6b0742…2f79`).
  - Built by `fluidpy.data.movie_shore.shore_winds_product(cs_json=…, co_json=…)` (fluidpy working tree, not committed).
  - Holds per event: the coastal point; the two coast points with the km legs on a local flat km map (δy = a δϑ,
    δx = a cos ϑ̄ δλ, a = 6371 km); the bearing and α; x̂′ and ŷ′; and the hourly u, v, speed, from-direction, along, across,
    sign meaning and length check.
  - It also holds the msl at the coastal (sea) grid point, the storm centre (grid msl minimum) and its msl, the
    inverse-barometer rise at both, the IBTrACS rows, and the ERA5-vs-best-track ratio.
- **Turned axes (Part 1)**: α is measured anticlockwise from east. x̂′ = (cos α, sin α) runs along the shore, and
  ŷ′ = (−sin α, cos α) **points out to sea**.
  - along = u cos α + v sin α; across = −u sin α + v cos α. **across < 0 means onto the land.**
  - α = 90° − bearing (mod 360).
  - The seaward direction of ŷ′ is checked against Natural Earth 1:50 m land for every event: a point 20 km along ŷ′ is
    sea, and a point 20 km along −ŷ′ is land. All five sites pass.
- **Inverse barometer**: Δη = (1013 hPa − p)/(ρ g). With ρ = 1025 kg/m³ this is 0.995 cm per hPa, so "about 1 cm per hPa".
  The JSON gives both the rule-of-thumb value and the exact one.
- **Coastline**: Natural Earth 1:10 m (`raw/NE-10m-admin/ne_10m_coastline.zip`, registry `NE-10m-admin`, public domain).
- Quick look: `outputs/ch00/data/coord_storm_shore_winds_quicklook.png` (local, not committed).

## Per event

| | Ian 2022 (Florida) | Amphan 2020 (Sundarbans) | Nargis 2008 (Irrawaddy delta) | Idai 2019 (Beira) |
|---|---|---|---|---|
| Wind / msl source | HRRR 3 km analysis (`HRRR-zarr-ian2022`; `derived/ch00/hrrr_ian_2022.nc`, 12–21 UTC 28 Sep) | ERA5 (`ERA5-ARCO-amphan2020`; `raw/ERA5-ARCO/era5_amphan_*`: 06 UTC sfc + 10 levels; 09–15 UTC hourly) | ERA5 (`ERA5-ARCO-nargis2008`; `raw/ERA5-ARCO/era5_nargis_u10-v10-msl_2008-05-01T12_2008-05-03T00_1h.nc`) | ERA5 (`ERA5-ARCO-idai2019`; `raw/ERA5-ARCO/era5_idai_2019_…_2019-03-11T00_2019-03-15T23_1h.nc`, `derived/ch00/era5_idai_2019.nc`) |
| Coastal point | Fort Myers Beach 26.45 N 81.95 W; St. Petersburg 27.76 N 82.63 W | Sundarbans shore, Bangladesh 21.644 N 89.229 E (ERA5 sea pt 21.50 N 89.25 E, 16 km) | Delta coast S of Bogale 15.778 N 95.174 E (sea pt 15.75 N 95.25 E, 9 km) | Beira seafront (Macúti) 19.829 S 34.935 E (sea pt 20.00 S 35.00 E, 20 km) |
| Time (UTC) | 2022-09-28 20:00 | 2020-05-20 09:00 (landfall hour) | 2008-05-02 11:00 | 2019-03-14 19:00 |
| u, v [m/s] | FMB 22.23, 24.29; StP −10.25, −16.00 | −8.38, +20.96 | +9.57, +16.46 | −6.73, +20.93 |
| α (bearing) | FMB 121.0° (329.0°); StP 96.9° (353.1°) | 193.3° (256.7°) | 171.2° (278.8°) | 214.5° (235.5°) |
| along / across [m/s] | FMB +9.36 / **−31.57** onto land; StP −14.64 / **+12.11** out to sea | +3.35 / **−22.32** onto land | −6.93 / **−17.73** onto land | −6.30 / **−21.07** onto land |
| msl at coastal point → inverse barometer | FMB 971.5 hPa → 42 cm; StP 999.0 → 14 cm (HRRR) | 985.3 hPa → 28 cm (ERA5) | 989.3 → 24 cm (ERA5) | 986.6 → 26 cm (ERA5) |
| Centre msl → inverse barometer | HRRR 956.9 hPa (26.65 N 82.17 W) → 56 cm; best track 941 hPa at 19:05 landfall → 72 cm | ERA5 965.4 → 48 cm; IMD 960 → 53 cm | ERA5 982.1 → 31 cm; IMD 962 → 51 cm; JTWC 937 → 76 cm | ERA5 980.8 → 32 cm; RSMC 955 → 58 cm |
| Model vs best-track wind | HRRR 3 km resolves the core | 27.5 vs 46.3 m/s (IMD 90 kt): 0.59 | 25.2 vs 46.3 m/s (IMD 90 kt): 0.55 | 29.1 vs 44.2 m/s (RSMC 86 kt): 0.66 |
| Water evidence | CO-OPS gauges (`NOAA-COOPS`; `derived/ch00/coops_ian_surge_20220927_20220930.nc`): Fort Myers 8725520 +2.21 m, St. Petersburg 8726520 −1.76 m, Naples 8725110 +1.91 m then destroyed | — | ETOPO 60 s delta (`ETOPO2022-60s-irrawaddy`): 90 % of the land ≤ 5 m | — |
| Before/after images | GEE S1/S2/NAIP research (`GEE-ch00-coordinates-research`; `raw/GEE/ch00_flood_v2/ian_*`, `v3_ian2022.npz`) | Sentinel-1 radar pair (`GEE-S1-amphan2020`; `raw/GEE/ch00_flood_v2/close_s1.npz`, `close_jrc.npz`) → `movies/…/img/amphan_s1_{before,after}.jpg`, `amphan_s1_new.png` (124.9 km² new water); clouds `NASA-GIBS-amphan2020-clouds` | MODIS v3 (`GEE-MODIS-flood-v3`; `raw/GEE/ch00_flood_v2/v3_nargis2008.npz`) → `nargis_tc_{before,after}.jpg`, `swipe_{before,after}.jpg` | MODIS v3 (`v3_idai2019.npz`) → `idai_tc_*`, `idai_721_*`; VIIRS `NASA-GIBS-idai2019` |
| Storm images / track | GOES-16 (`GOES16-ABI-ian2022`), `IBTrACS-v04r01` (NA) | GIBS 18–20 May (`NASA-GIBS-amphan2020`), `IBTrACS-v04r01-NI` | GIBS 2 May (`NASA-GIBS-nargis2008`), IBTrACS NI | GIBS VIIRS 13–14 Mar, IBTrACS SI |

Why each time was chosen:
- **Ian, 20 UTC**: about an hour after the 19:05 UTC landfall. Fort Myers Beach is in the south-west eyewall, and
  St. Petersburg is ~160 km north on the other side of the eye.
- **Amphan, 09 UTC**: the IBTrACS landfall fix. The Bangladesh shore is ~115 km east of the centre, on the right-hand
  (southerly, onshore) side. The across-shore part stays −20 to −24 m/s until 13 UTC. 10 UTC is 1.6 m/s stronger.
- **Nargis, 11 UTC**: the most onshore hour of 06–18 UTC. The across-shore part stays −15 to −18 m/s from 06 to 13 UTC.
  After that the wind veers westerly and runs along the coast.
- **Idai, 19 UTC**: the most onshore hour of 15 UTC 14 Mar – 03 UTC 15 Mar. The ERA5 centre is 34 km east of Beira, two hours
  before the IBTrACS landfall fix. 18 UTC gives almost the same value (u −1.71, v +24.15 → across −20.88).
  After the eye passes (from 23 UTC), the wind turns north-easterly and runs along the shore (across −7 to −1.5).

## Numbers that disagree with the 5b plan (for the builder)
1. **St. Petersburg**. The plan gives α ≈ 97° with along −15.1 and across +11.5. Those values are not consistent with each other.
   - −15.12 / +11.50 (`co.json alS, acS`) come from bearing **355.4°** (α = 94.6°), taken from the planning points
     27.60 N 82.74 W → 28.15 N 82.79 W.
   - The measured NE 10 m segment St Pete Beach → Tarpon Springs gives **353.1° (α = 96.9°) → along −14.64, across +12.11**.
   - Either show α = 94.6° with −15.1 / +11.5, or α = 96.9° with −14.6 / +12.1. **Recommended: α = 96.9°**, because it matches
     the km legs (55.7 km N, 6.8 km W, tan β = 0.122).
   - Both pairs are in the JSON (`wind`, `wind_with_planning_bearing_355p4`).
2. **St. Petersburg position.** The coast used is the Pinellas Gulf coast, but the station (27.76 N 82.63 W) is on the Tampa Bay
   side of the peninsula. ŷ′ = west still points to the Gulf, but the outflow seen by gauge 8726520 is water leaving Tampa Bay.
   The plan's sentence "on Tampa Bay" is fine; "the coast runs almost due north" describes the Gulf shore.
3. **Ian's pressure-surge number.** The plan says "about 75 hPa below normal, so about 75 cm". The best track gives 938 hPa
   at 18 UTC (75 hPa below 1013), and 941 hPa at the 19:05 landfall (72 hPa → 72 cm). The HRRR 20 UTC centre is 956.9 hPa
   (56 cm). At Fort Myers Beach itself, HRRR gives 971.5 hPa → **42 cm**. Say "about 70 cm under the eye" or quote the 938 hPa time.
4. **Amphan at 06 UTC** (plan example: 21.5 N 89.0 E, u −17.4, v +12.3 → across −12.3) used α = 180°.
   At 09 UTC, with the measured α = 193.3°, the across-shore part is −22.3 m/s. The wind is now from the south-south-east,
   straight onshore.

## Suggested reuse
- **Bangladesh cyclone movies** (Amphan, plus Sidr/Aila later): the Amphan ERA5 boxes and the Sundarbans outer-coast
  envelope (`coast_axes` points). Also the S1 radar pair with its 124.9 km² new-water count, the GIBS cloud images (why
  optical before/after fails in the monsoon), IBTrACS NI, and the Aila Landsat 5 research renders.
- **Surge physics** (Ekman / storm-surge movies): Ian's opposite-sign gauges (+2.2 m / −1.8 m) with the along/across numbers.
  Also the inverse-barometer comparison (≈ 0.4–0.7 m of pressure rise vs 2–4 m observed, so wind set-up dominates).
- **Model-resolution lesson**: ERA5 vs best track (ratios 0.55–0.66) next to HRRR 3 km, which resolves Ian's core.
- **Southern Hemisphere contrast**: Idai's onshore side lies on the other side of its track; ERA5 hourly data for 11–15 Mar
  are already on G:.
- Refreshing: every ERA5 box can be re-fetched anonymously in under a minute (`fetch_box` with the subsets above).
  GEE needs the user's Earth Engine project.
