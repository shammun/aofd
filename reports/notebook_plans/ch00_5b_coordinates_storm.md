# Notebook Plan: ch00_5b_coordinates_storm

**Source movie:** `movies/ch00/ch00_coordinates_storm/` — v1  
**Series position:** 8 (#5b in plan v6; Part 2 of 7-part coordinates series)  
**Duration:** build 1 audio 2479.45 s (~41:19); final ~42:48  
**Status:** Final (QA 15/15, Drive `1fWM8lyOIsliiQKKq7jHwyFS0VxiV0mRr`, verification review PASS)

---

## 1. Video Summary

The second coordinates movie goes inside a tropical cyclone. It derives how the polar unit vectors change with angle (d r̂/dθ = θ̂, d θ̂/dθ = −r̂), builds up to centripetal acceleration, then extends to 3-D cylindrical coordinates (**u** = u_r r̂ + u_θ θ̂ + w ẑ). The centrepiece is Hurricane Ian in full 3-D: a HRRR layer stack, the NOAA P-3 TDR ring-average r–z section showing inflow → eyewall updraft → outflow. Then Cyclone Amphan (Bay of Bengal 2020) for the same picture in a different ocean. Storm surge sign flip and tide gauges end the dynamics half. The last section shows floods from space: Amphan's inundation by Sentinel-1 SAR (through cloud), and Nargis 2008 / Idai 2019 in false colour (band 7-2-1) to explain how flood mappers use infrared.

Music: eyewall-spiral style (NEW — to add `tools/sound/styles.py`), D minor Dorian 6/8 at 76 bpm, low cello ostinato + tremolo strings, seed 31.  
TSX source: `movies/src/ch00_coordinates/co_sB.tsx`, `co_sC.tsx`; checks in `movies/src/ch00_coordinates/checks/ssr/`.

---

## 2. Concepts Covered

| Concept | Equation ref |
|---------|-------------|
| d r̂/dθ = θ̂ and d θ̂/dθ = −r̂ (slopes of cos and sin) | Kundu App. B §B.5 |
| Product rule for a number times an arrow | — |
| dθ/dt = v/r from arc rule; velocity = rate of change of position | — |
| Centripetal acceleration: **a** = −(v²/r) r̂ | — |
| Cylindrical coordinates (r, θ, z); only r̂, θ̂ turn, ẑ fixed | — |
| **u** = u_r r̂ + u_θ θ̂ + w ẑ | — |
| Hurricane Ian 3-D: eye, eyewall, inflow, outflow | — |
| General term: tropical cyclone (hurricane = Atlantic/eastern Pacific; cyclone = elsewhere) | — |
| Cyclone Amphan Bay of Bengal 2020: ring means, inflow angle, r-z section | — |
| Storm surge and its sign flip: onshore push vs sign of across-shore wind | — |
| Floods from space: SAR (Sentinel-1) sees through cloud; false colour 7-2-1 | — |

**Key equations:**

$$\frac{d\hat{r}}{d\theta} = \hat{\theta}, \qquad \frac{d\hat{\theta}}{d\theta} = -\hat{r}$$

$$\frac{d\theta}{dt} = \frac{u_\theta}{r} \quad \Longrightarrow \quad \mathbf{v} = \dot{r}\hat{r} + r\dot{\theta}\hat{\theta} = u_r\hat{r} + u_\theta\hat{\theta}$$

$$\mathbf{a} = \left(\ddot{r} - \frac{u_\theta^2}{r}\right)\hat{r} + \left(r\ddot{\theta} + \frac{u_r u_\theta}{r}\right)\hat{\theta} \qquad \text{(cylindrical)}$$

**Centripetal (pure circular motion, u_r = 0):**

$$\mathbf{a} = -\frac{u_\theta^2}{r}\hat{r}$$

**Nargis coast example:**
- Coast bearing α = 171.2°
- Across-shore wind component at 11 UTC 2 May 2008: −17.73 m/s (onshore)

---

## 3. Data Sources

| Source | Provider | Access | Variables | Region/Time | Use |
|--------|----------|--------|-----------|-------------|-----|
| HRRR model | NOAA/NSSL | `s3://hrrrzarr/prs/20220928/20220928_18z_anl.zarr` (anonymous) | u, v at 10-m + multiple pressure levels | Ian, 2022-09-28T18, SE US | 3-D layer stack showing inflow/outflow structure |
| NOAA P-3 TDR | NOAA AOML HRD | `ftp.aoml.noaa.gov/pub/hrd/data/radar/level2/2022/ian/` | 3-D u, v, w in NetCDF | Ian, 2022-09-28 ~10 UTC | Ring-mean r–z section: w vs r and z |
| ERA5 (Amphan, Bay of Bengal) | ECMWF / Copernicus | `fluidpy.data.era5_arco.fetch_box` | u, v at 925/850 hPa | 5–25°N, 80–100°E; 2020-05-18/21 | Amphan ring means, inflow angle, r-z section |
| ERA5 (Nargis 2008) | ECMWF / Copernicus | `fluidpy.data.era5_arco.fetch_box` | u10, v10, msl | 13–19°N, 92–98°E; 2008-05-01T12 to 05-03T00 | Shore wind calculation for Nargis |
| IBTrACS v04r01 | NOAA NCEI | `fluidpy.data.ibtracs.fetch_basin('NI')` | lat, lon, wind | Amphan: `2020121N08097`; Nargis: `2008121N12089` | Storm centres for ring calculation |
| IBTrACS v04r01 | NOAA NCEI | `fluidpy.data.ibtracs.fetch_basin('SI')` | lat, lon, wind | Idai: `2019063S18038` | Flood scene context |
| GEE Sentinel-1 SAR | ESA / Google Earth Engine | GEE JavaScript API + `earthaccess` / `ee` Python API | VV backscatter (GRD) | Amphan flood box: 88.80–89.92°E, 22.12–22.75°N; orbit 150; 16/22/28 May 2020 | Flood inundation map (124.9 km² new water) |
| JRC Global Surface Water v1.4 | EC JRC / Google | GEE (`JRC/GSW1_4/GlobalSurfaceWater`) | occurrence, seasonality | Same box | Baseline water mask for SAR flood extent |

**Credits:**
- HRRR: "HRRR analysis (NOAA/NSSL); data via hrrrzarr (MesoWest/NOAA)." (public domain)
- TDR: "NOAA P-3 hurricane-hunter tail Doppler radar, 28 Sep 2022 ≈ 10 UTC — NOAA AOML Hurricane Research Division." ⚠️ NOT redistributable. User must send HRD courtesy note before publishing.
- ERA5: "Contains modified Copernicus Climate Change Service information 2026. ERA5 (Hersbach et al. 2020) via ARCO-ERA5 (Google Research)."
- IBTrACS: "IBTrACS v04r01 best tracks (Knapp et al. 2010), NOAA NCEI (public domain)."
- Sentinel-1 / GEE: "Contains modified Copernicus Sentinel data 2020, processed in Google Earth Engine; EC JRC / Google Global Surface Water v1.4 (Pekel et al. 2016)."

**Derived products:**
- `data/derived/ch00/coord_storm_shore_winds.json` — events: `nargis` (coast α=171.2°, across-shore −17.73 m/s), `amphan`, `ian`
- `raw/GEE/ch00_flood_v2/close_s1.npz` — Sentinel-1 SAR backscatter mosaic (not redistributable raw; derived flood mask fine)
- `raw/GEE/ch00_flood_v2/close_jrc.npz` — JRC GSW baseline

**ERA5 Amphan fetch:**
```python
from fluidpy.data.era5_arco import fetch_box

ds_amphan = fetch_box(
    '2020-05-18T00', '2020-05-21T00',
    lat=(5, 25), lon=(80, 100),
    variables=['u_component_of_wind', 'v_component_of_wind', 'msl'],
    pressure_levels=[925, 850],
)
```

**ERA5 Nargis fetch:**
```python
ds_nargis = fetch_box(
    '2008-05-01T12', '2008-05-03T00',
    lat=(13, 19), lon=(92, 98),
    variables=['u10', 'v10', 'msl'],
    pressure_levels=None,
)
```

**GEE Sentinel-1 SAR (JavaScript API for the flood map):**
```javascript
// Script in reports/data/GEE-S1-amphan2020.md
var s1 = ee.ImageCollection('COPERNICUS/S1_GRD')
  .filterBounds(ee.Geometry.Rectangle([88.80, 22.12, 89.92, 22.75]))
  .filterDate('2020-05-16', '2020-05-29')
  .filter(ee.Filter.eq('relativeOrbitNumber_start', 150))
  .select('VV');

var before = s1.filterDate('2020-05-16', '2020-05-17').first();
var after  = s1.filterDate('2020-05-21', '2020-05-23').first();
var flooded = after.lt(-16).and(before.gt(-14));
```

**GEE Python API (export):**
```python
import ee
ee.Initialize()

# See reports/data/GEE-S1-amphan2020.md for full export script
# Saves VV backscatter before/after + flood mask to raw/GEE/ch00_flood_v2/
```

---

## 4. Visualizations Per Scene

| Scene | What it shows | TSX source | Sound |
|-------|--------------|------------|-------|
| s00_title | Title "Part 2 — Inside a tropical cyclone" | `house/kit/title.tsx` | — |
| s01–s07 | d r̂/dθ = θ̂: tip slides along unit circle | `cs_s01.tsx` | — |
| s08–s12 | Product rule; dθ/dt = v/r; velocity derivation | `cs_s08.tsx` | — |
| s13–s14 | Centripetal acceleration −v²/r r̂ | `cs_s13.tsx` | — |
| s15_cylinder | 3-D cylinder: streak families (u_r, u_θ, w) | `cs_s15.tsx` (3-D) | wind_strong_far (0.1) |
| s16–s18_ian_stack | Ian eye (radar), HRRR layer stack | `co_sB.tsx` | — |
| s19–s22 | TDR ring-mean r–z section: inflow/updraft/outflow | `co_sB.tsx` | — |
| s23–s26 | Amphan: ERA5 ring means, inflow angle, r-z section | `co_sC.tsx` | — |
| s27_surge | Storm surge: onshore push; Saint Petersburg gauge drop | `cs_s27.tsx` | waves_breaking (0.12) + water_draining (0.1) |
| s28–s32 | Amphan SAR flood: Sentinel-1 before/after swipe | `cs_s28.tsx` | — |
| s33–s36 | Nargis 2008 and Idai 2019: false colour 7-2-1 (infrared) | `cs_s33.tsx` | — |
| s_end | End card | `house/kit/end_card.tsx` | — |

---

## 5. Methodologies & Equations

### Derivatives of polar unit vectors
```python
import numpy as np

def r_hat(theta): return np.array([np.cos(theta), np.sin(theta)])
def t_hat(theta): return np.array([-np.sin(theta), np.cos(theta)])

def d_r_hat_dtheta_scratch(theta):
    # Numerical derivative
    dtheta = 1e-7
    return (r_hat(theta + dtheta) - r_hat(theta)) / dtheta

theta = np.radians(37.0)
np.testing.assert_allclose(d_r_hat_dtheta_scratch(theta), t_hat(theta), atol=1e-5)
# Proves dr̂/dθ = θ̂
```

### Centripetal acceleration (pure circular)
```python
# Hurricane Ian: mean tangential wind at eyewall ~ 60 m/s, r ~ 45 km
u_theta = 60.0     # m/s
r = 45_000.0       # m

a_centripetal = u_theta**2 / r    # m/s² (directed inward)
print(f"Centripetal = {a_centripetal:.4f} m/s² = {a_centripetal/9.81*1000:.1f} mg")
```

### Ring-mean wind decomposition (cyclone diagnostics)
```python
from fluidpy.diag.cyclone import ring_mean_decompose
# ring_mean_decompose(u, v, lat_grid, lon_grid, storm_lat, storm_lon, radii_km)
# Returns: u_r(r), u_theta(r) ring-mean profiles
```

### Shore-wind component (Nargis)
```python
import numpy as np

coast_bearing = 171.2   # degrees clockwise from N
coast_normal = coast_bearing + 90.0  # direction coast faces (into sea)

# ERA5 10-m wind at Nargis landfall (11 UTC 2 May 2008)
u10, v10 = -4.2, -17.0   # m/s (from derived data)

# Across-shore component (positive = onshore)
coast_rad = np.radians(coast_normal)
across_shore = u10 * np.sin(coast_rad) + v10 * np.cos(coast_rad)
# Should be ≈ -17.73 m/s (from derived coord_storm_shore_winds.json)
```

---

## 6. How to Replicate

1. **ERA5 Amphan:**
   ```bash
   .venv/Scripts/python.exe -c "from fluidpy.data.era5_arco import fetch_box; # run amphan fetch"
   ```

2. **ERA5 Nargis:**
   ```bash
   .venv/Scripts/python.exe -c "from fluidpy.data.era5_arco import fetch_box; # run nargis fetch"
   ```

3. **TDR ring-mean data** (not redistributable; use derived product):
   - Check `data/derived/ch00/ian_tdr_ring_mean.json` exists.
   - For the full TDR: request from `ftp.aoml.noaa.gov/pub/hrd/data/radar/level2/2022/ian/20220928H1/`

4. **GEE flood map:**
   - Run the script in `reports/data/GEE-S1-amphan2020.md` in GEE Code Editor.
   - Or use the Python GEE API (requires `earthaccess` auth): same script, exported to `raw/GEE/ch00_flood_v2/`.

5. **Execute the notebook** (`notebooks/ch00a_coordinates_storm.ipynb`), kernel `aofd-venv`.

---

## 7. Notebook Outline

```
[MD]  # Chapter 0A · Coordinates, Part 2 — Inside a tropical cyclone
[MD]  ## How the polar arrows change: dr̂/dθ = θ̂ (plain words)
[CODE] # Numerical proof: (r̂(θ+dθ) − r̂(θ))/dθ → θ̂; plot unit circle
[CODE] # Same for dθ̂/dθ = −r̂
[MD]  ## Velocity in polar coordinates
[CODE] # Derivation: d(r r̂)/dt = u_r r̂ + u_θ θ̂; product rule step by step
[CODE] # Centripetal acceleration: a = −v²/r r̂; Ian eyewall numbers
[MD]  ## Cylindrical coordinates: adding the z-axis
[CODE] # u = u_r r̂ + u_θ θ̂ + w ẑ; show which unit vectors change, which don't
[MD]  ## Hurricane Ian in 3-D
[CODE] # Load HRRR layer stack; plot tangential/radial winds at multiple levels
[CODE] # Load TDR ring-mean data; plot r–z section (w, u_r, u_θ)
[CODE] # Inflow → eyewall updraft → outflow: label and annotate
[MD]  ## Cyclone Amphan (Bay of Bengal 2020)
[CODE] # ERA5 Amphan: ring-mean u_r, u_θ vs radius
[CODE] # Inflow angle: compare Ian and Amphan
[MD]  ## Storm surge: the sign flip
[CODE] # Nargis ERA5: across-shore wind component −17.73 m/s (onshore)
[CODE] # Shore wind equation; sign convention explained
[MD]  ## Floods from space
[CODE] # Load Amphan SAR (close_s1.npz): before/after swipe → flood extent
[CODE] # 124.9 km² new water; colour scale; source line
[CODE] # False colour 7-2-1: Nargis and Idai; why infrared reveals floods
[MD]  *Reading card:* what does the r–z section tell us about tropical cyclone structure?
[MD]  *Mechanism card:* why do tropical cyclones have an eye?
```
