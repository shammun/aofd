# Notebook Plan: ch00_weather_basics

**Source movie:** `movies/ch00/ch00_weather_basics/` — v5 (UF2)  
**Series position:** 3 (Chapter 0 series; after cross-product Part 2)  
**Duration:** ~58:06, ~104,519 frames  
**Status:** Final (review 4 PASS, 0 Must, 16 Should → §5b retro-fit pending)

---

## 1. Video Summary

The first "real weather" movie in the series — no vectors, just the state of the atmosphere. Teaches what pressure, temperature, density, humidity and wind *are* from scratch, using a globe with a thin atmospheric shell as the central visual. The movie is split into two music sections: `air-flowing` for most of the movie and `storm-tense` during the Storm Ciarán application (scenes s54–s59). Ends with a preview of the global circulation (subtropical highs, ITCZ, trades, westerlies).

---

## 2. Concepts Covered

| Concept-ID | Concept | Equation ref |
|----|---------|-------------|
| 0B-G1 | Planet and its fluids: thin shell, layers, weather vs climate | — |
| 0B-G3 | State of air: pressure (hPa), temperature (K/°C), density, ideal gas, hydrostatic, scale height | Vallis (1.51), (1.53) |
| 0B-G4 | Water in air: specific humidity (g/kg), saturation, relative humidity, dew point, clouds | — |
| 0B-G8 | Highs and lows as observed (balance left to later movies) | — |
| 0B-G13 | Subtropical highs, ITCZ, trades, westerlies preview | — |
| 0B-G16 | Units: hPa, K and °C, g/kg, m/s, knots | — |
| 0B-G17 | Data words: observation, reanalysis, climatology | — |

**Key equations:**

$$p = \rho R T, \quad R_\text{dry} = 287\ \text{J kg}^{-1}\ \text{K}^{-1}$$

$$\frac{dp}{dz} = -\rho g \quad \text{(hydrostatic balance)}$$

$$H = \frac{RT_0}{g} \approx 8.5\ \text{km} \quad (T_0 = 288\ \text{K})$$

$$p(z) \approx p_0 \exp\!\left(-\frac{z}{H}\right)$$

**Scale heights:** T (8.5 km), water vapour (2 km), ozone (~25 km).

**Clausius-Clapeyron (linearised, see also derivatives movie):**
$$\frac{de_s}{dT} \approx \frac{L}{R_v T^2}\, e_s \quad\Longrightarrow\quad \frac{\Delta e_s}{e_s} \approx 7\%\ \text{per K}$$

---

## 3. Data Sources

| Source | Provider | Access | Variables | Region/Time | Use |
|--------|----------|--------|-----------|-------------|-----|
| ERA5 reanalysis | ECMWF / Copernicus | ARCO-ERA5 zarr (anonymous) | msl, u10, v10, t2m, q; z/u/v at 850+500 hPa | 35–70°N, 50°W–10°E; 2023-11-01/02 | Ciarán application s54–s59: pressure, wind, temperature |
| ERA5 reanalysis (global climatology) | ECMWF / Copernicus | ARCO-ERA5 zarr | msl, u850, t2m (DJF/JJA climatology) | Global | Subtropical highs, ITCZ preview |

**Credit:** "Contains modified Copernicus Climate Change Service information 2026. ERA5 (Hersbach et al. 2020) via ARCO-ERA5 (Google Research)."

**Derived products:**
- `data/derived/ch00/era5_ciaran_2023_sfc.nc` — shared with dot-product notebook
- `data/derived/ch00/era5_ciaran_2023_upper.nc` — shared with dot-product notebook

**Fetch code (Ciarán):** see `ch00_01_dot_product.md §3`.

**Fetch code (climatology):**
```python
from fluidpy.data.era5_arco import fetch_box
# DJF mean: pick representative month (e.g. 2020-01-15, single time step)
ds_clim = fetch_box(
    '2020-01-15T00', '2020-01-15T00',
    lat=(-90, 90), lon=(-180, 180),
    variables=['msl', 'u_component_of_wind', '2m_temperature'],
    pressure_levels=[850],
)
```

---

## 4. Visualizations Per Scene

| Scene | What it shows | TSX / component | Key visual |
|-------|--------------|-----------------|-----------|
| s00_title | Title + 3-D Globe (daytime true-colour mosaic) | `house/kit/title.tsx`, Globe3D | Globe3D with atmospheric haze |
| s01–s10 | The thin shell: atmosphere vs Earth radius | `wb_s01.tsx` | GlobeCrossSection, shell exaggeration |
| s11–s20 | Pressure vs height column; ideal gas p=ρRT | `wb_s11.tsx` | BarometerColumn, CalcStack |
| s21–s30 | Scale height; p(z) = p₀ e^(−z/H) | `wb_s21.tsx` | ExponentialCurve, GlobeLayers |
| s31–s40 | Water in air: q, relative humidity, dew point, clouds | `wb_s31.tsx` | CloudDiagram |
| s41–s53 | Highs and lows (observed); surface map | `wb_s41.tsx` | PressureMap |
| s54–s59 | Ciarán application (ERA5 msl/u10/v10/t2m) | `wb_s54.tsx` | ERA5Map, ColourBar, SourceLine |
| s60 | End card | `house/kit/end_card.tsx` | SeriesEndCard |

---

## 5. Methodologies & Equations

### Hydrostatic balance and scale height
```python
import numpy as np

g = 9.81     # m/s²
R = 287.0    # J kg⁻¹ K⁻¹ (dry air)
T0 = 288.0   # K (standard surface temperature)

H_scratch = R * T0 / g   # ≈ 8441 m ≈ 8.5 km

# Pressure profile
z = np.linspace(0, 50_000, 500)  # m
p0 = 101_325.0  # Pa
p = p0 * np.exp(-z / H_scratch)
```

### Ideal gas law
```python
rho = 1.225   # kg/m³ (standard sea level)
p_check = rho * R * T0   # should be ≈ 101_300 Pa
print(f"p = {p_check:.0f} Pa vs standard {p0:.0f} Pa")
```

### Saturation vapour pressure (Clausius-Clapeyron)
```python
import numpy as np

L  = 2.501e6   # J/kg latent heat of vaporisation
Rv = 461.5     # J kg⁻¹ K⁻¹ gas constant for water vapour
T  = 293.15    # K (20°C)
es0, T0_cc = 611.2, 273.15  # Pa, K (reference)

es_scratch = es0 * np.exp(L / Rv * (1/T0_cc - 1/T))

# Rate per K
des_dT = L / (Rv * T**2) * es_scratch   # Pa/K
pct_per_K = des_dT / es_scratch * 100    # ≈ 6.8–7.2 %
print(f"des/es per K = {pct_per_K:.1f}%")
```

---

## 6. How to Replicate

1. **ERA5 Ciarán data** already downloaded by the dot-product notebook.

2. **ERA5 climatology snapshot** (optional; ~10 MB):
   ```bash
   .venv/Scripts/python.exe -c "
   from fluidpy.data.era5_arco import fetch_box
   # run the climatology fetch above
   "
   ```

3. **Run the notebook** (`notebooks/ch00b_weather_basics.ipynb`), kernel `aofd-venv`.

---

## 7. Notebook Outline

```
[MD]  # Chapter 0B · Weather basics
[MD]  ## The thin shell: Earth vs atmosphere (plain words + numbers)
[CODE] # Earth radius 6371 km vs troposphere 12 km: ratio 0.19 %
[MD]  ## Pressure: the weight of air above you
[CODE] # Hydrostatic balance dp/dz = −ρg from scratch
[CODE] # Scale height H = RT/g ≈ 8.5 km; exponential pressure profile p(z)
[CODE] # Worked example: pressure at 5 km (easy: half of 1013 hPa ≈ 540 hPa)
[MD]  ## Temperature and the ideal gas
[CODE] # p = ρRT; from p and T → ρ at sea level
[MD]  ## Water in air: humidity, clouds and dew point
[CODE] # Clausius-Clapeyron: des/es ≈ 7% per K; plot es(T) 0–40°C
[CODE] # Relative humidity = e / es(T) × 100 %
[MD]  ## Highs and lows on a surface map
[CODE] # ERA5 Ciarán: contour map of msl; overlay u10/v10 arrows
[CODE] # Identify the low centre; note isobar spacing ∝ wind speed
[MD]  *Reading card:* what does a surface analysis map show?
[MD]  *Mechanism card:* why does pressure fall in a low?
[CODE] # ERA5 global snapshot: subtropical highs, ITCZ belt, trade winds
```
