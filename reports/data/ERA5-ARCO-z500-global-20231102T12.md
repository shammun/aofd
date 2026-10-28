# ERA5-ARCO-z500-global-20231102T12 — ERA5 global 500 hPa height, 12 UTC 2 Nov 2023 (movie ch00_reading_weather_maps, D3)

- **Route**:
  - ARCO-ERA5 zarr (anonymous) → `fluidpy.data.era5_arco.fetch_box(lat=(-90, 90), lon=(0, 359.75), variables=("z",),
    levels=[500], times=["2023-11-02T12:00"])` → `fluidpy.data.fetch` (zarr subset).
  - The guard estimated 4.16 MB; the raw file is 1,917,019 B and took 16.4 s. One 37-level chunk was read, about
    120 MB of network traffic.
- **Licence verdict**: Copernicus licence / CC-BY 4.0. **Redistributable: yes, with the credit line.** Credit:
  "Contains modified Copernicus Climate Change Service information 2023 …".
- **Derived products** (`movie_rwm.era5_z500_global`):
  - `rwm_era5_z500_global_2023-11-02T12_0p5.nc`, 536,227 B, on G: `derived/ch00/`.
  - `rwm_era5_z500_global_2023-11-02T12_0p5.bin/.json`, 1,039,680 + 13,030 B, in the repo.
  - Processing: z/9.80665, every second point (0.5°, 361×720), lat S→N, lon −180…179.5.
- **Checks**:
  - The global range is 4609–5973 m.
  - The minimum near Ciarán is 5114 m at 52.5°N 1.5°E, which matches A2's 5114 m at 52.5°N 1.25°E (RM17).
  - The NH minimum north of 20°N is 4916 m at 60.5°N 81°W (Hudson Bay).
  - Quick-look: `outputs/ch00/data/rwm_era5_z500_nh.png` (polar view, wavy 60-m contours).
- **Colab route**: the committed `.bin/.json`.
- **Disk**: before, C: 47.6 GB and G: 561.4 GB free. After, C: 64.0 GB and G: 561.4 GB. Nothing evicted.
