# Notebook Plan: ch00_5a_coordinates_flat

**Source movie:** `movies/ch00/ch00_coordinates_flat/` — v1  
**Series position:** 7 (#5a in plan v6; Part 1 of 7-part coordinates series)  
**Duration:** ~43:41, TTS 2185.75 s / 508 cues  
**Status:** Final (QA 15/15, Drive `1lGJ6upEyWYlhx0QcP6hVAxE3DsCOU_AV`, verification review PASS)

---

## 1. Video Summary

The first coordinates movie builds from scratch: Cartesian axes, polar coordinates (r, θ), the unit vectors r̂ and θ̂ as arrows that rotate with the point, rotation of axes and the rotation matrix, and the rotation-matrix application to Hurricane Ian's ring-mean tangential and radial winds. The key insight is that polar unit vectors *depend on place* — unlike Cartesian unit vectors which are always the same everywhere. The application shows three ring points by hand and the inflow angle (the small tilt of real wind inward from pure tangential).

Music: compass-orbit style (NEW — to add to `tools/sound/styles.py`), seed 23.  
Colour contract: unit vectors/axes **orange**; position arrow **teal**; polar tangential **teal**, radial **rose**; a negative component keeps its colour with a hatch and a '−' glyph.

---

## 2. Concepts Covered

| Concept | Equation ref |
|---------|-------------|
| Origin, Cartesian axes, constant unit vectors x̂, ŷ | — |
| Plane polar coordinates (r, θ): x = r cos θ, y = r sin θ | — |
| r = √(x²+y²); maths angle θ vs compass bearing vs wind "from" | — |
| Radians and arc length s = rθ | — |
| r̂ = (cos θ, sin θ) = arrow/|arrow| (the way r grows) | Kundu App. B §B.5 |
| θ̂ = (−sin θ, cos θ); 90° turn rule (p,q)→(−q,p) | Kundu App. B §B.5 |
| Polar unit vectors depend on place | — |
| Radial and tangential wind components as dot products | — |
| Rotation of axes: x̂' = (cos α, sin α), ŷ' = (−sin α, cos α) | — |
| Rotation matrix and direction cosines; x'ⱼ = xᵢ Cᵢⱼ, Cᵢⱼ = êᵢ·ê'ⱼ | Kundu (2.4)–(2.5) |
| Polar components = Cartesian axes turned by local angle θ | — |
| Hurricane Ian ring-mean tangential/radial winds and inflow angle | — |

**Key equations:**

$$x = r\cos\theta,\quad y = r\sin\theta,\quad r = \sqrt{x^2+y^2}$$

$$\hat{r} = \begin{pmatrix}\cos\theta\\\sin\theta\end{pmatrix}, \qquad \hat{\theta} = \begin{pmatrix}-\sin\theta\\\cos\theta\end{pmatrix}$$

$$u_r = \mathbf{u}\cdot\hat{r} = u\cos\theta + v\sin\theta$$

$$u_\theta = \mathbf{u}\cdot\hat{\theta} = -u\sin\theta + v\cos\theta$$

$$C_{ij} = \hat{e}_i \cdot \hat{e}'_j, \qquad x'_j = x_i C_{ij} \quad \text{(Kundu (2.5))}$$

**Inflow angle:** $\alpha_\text{in} = \arctan(u_r / |u_\theta|)$; a typical hurricane has α_in ≈ 15–25°.

---

## 3. Data Sources

| Source | Provider | Access | Variables | Region/Time | Use |
|--------|----------|--------|-----------|-------------|-----|
| NOAA P-3 Tail Doppler Radar | NOAA AOML HRD | `ftp.aoml.noaa.gov/pub/hrd/data/radar/level2/2022/ian/20220928H1/` | u, v, w (3-D radar winds) in xy and vert_inbound NetCDF | Hurricane Ian, 2022-09-28 ~10 UTC | Ring-mean tangential/radial wind; inflow angle |
| HRRR model | NOAA/NSSL | `s3://hrrrzarr/prs/20220928/20220928_18z_anl.zarr` (anonymous S3) | u, v at multiple pressure levels | Ian ~18 UTC 2022-09-28, SE US | Layer-stack illustration (see also #5b) |
| IBTrACS v04r01 | NOAA NCEI | `fluidpy.data.ibtracs.fetch_basin('NA')` | lat, lon, wind | Ian: `2022266N12294` | Storm centre for ring calculation |

**Credits:**
- TDR: "Vertical wind: NOAA P-3 hurricane-hunter tail Doppler radar, 28 Sep 2022 ≈ 10 UTC — NOAA AOML Hurricane Research Division."
  - ⚠️ Raw files NOT redistributable. Only derived ring means and pictures are fine. User must send HRD courtesy note before publishing.
- HRRR: "HRRR analysis (NOAA/NSSL); data via hrrrzarr (MesoWest/NOAA)." (public domain)
- IBTrACS: "IBTrACS v04r01 best tracks (Knapp et al. 2010), NOAA NCEI (public domain)."

**TDR files:**
- `raw/hrd_tdr/ian2022/220928H1_1023_xy.nc.gz` — 8,266,017 B, sha256 `a36e853f…3a3d`
- `raw/hrd_tdr/ian2022/220928H1_1023_vert_inbound.nc.gz`

**Key derived numbers:**
- Ring-mean peak w ≈ 3.3 m/s at 8–9.5 km altitude, r ≈ 45 km radius
- Strongest single updraft: 11.6 m/s at 13 km
- Inflow angle α ≈ 18–22° (from ring-mean u_r / |u_θ| at r = 45 km)

**HRRR access code:**
```python
import zarr, s3fs, numpy as np

fs = s3fs.S3FileSystem(anon=True)
store = s3fs.S3Map(
    "s3://hrrrzarr/prs/20220928/20220928_18z_anl.zarr",
    s3=fs, check=False
)
ds = zarr.open(store)
# documented in reports/data/HRRR-zarr-ian2022.md
```

**IBTrACS fetch code:**
```python
from fluidpy.data.ibtracs import fetch_basin
ian = fetch_basin('NA', storm_id='2022266N12294')
centre_lat = ian['lat'].sel(time='2022-09-28T18:00')
centre_lon = ian['lon'].sel(time='2022-09-28T18:00')
```

---

## 4. Visualizations Per Scene

| Scene | What it shows | TSX source | Sound |
|-------|--------------|------------|-------|
| s00_title | Title frame | `house/kit/title.tsx` | — |
| s01–s07 | Cartesian axes, unit vectors, Cartesian components of wind | `cf_s01.tsx` | — |
| s08_r_hat | r̂ as unit radius arrow; tip traces unit circle | `cf_s08.tsx` | — |
| s09–s10 | θ̂ via 90° turn rule; θ̂ perpendicular to r̂ | `cf_s09.tsx` | — |
| s11–s14 | Radial/tangential wind split; magnitude bars | `cf_s11.tsx` | — |
| s15–s17 | Rotation of axes; rotation matrix C | `cf_s15.tsx` | — |
| s18 | Table: C and C^T at 45° | `cf_s18.tsx` | — |
| s19–s20 | Polar components = rotated axes | `cf_s19.tsx` | — |
| s21_ian_polar | Hurricane Ian: streaklines (HRRR), ring superimposed | `cf_s21.tsx` | wind_strong_far (0.12) |
| s22–s27 | Three ring points by hand; inflow angle worked example | `cf_s22.tsx` | — |
| s_end | End card | `house/kit/end_card.tsx` | — |

TSX source directory: `movies/src/ch00_coordinates/` — file `co_sA.tsx` or dedicated `cf_*.tsx`.

---

## 5. Methodologies & Equations

### Polar unit vectors
```python
import numpy as np

theta = np.radians(37.0)   # arbitrary angle

r_hat_scratch = np.array([np.cos(theta), np.sin(theta)])
t_hat_scratch = np.array([-np.sin(theta), np.cos(theta)])

# Verify orthonormality
assert abs(np.dot(r_hat_scratch, t_hat_scratch)) < 1e-12
assert abs(np.linalg.norm(r_hat_scratch) - 1.0) < 1e-12
```

### Radial and tangential wind components
```python
import numpy as np

def polar_decompose(u, v, theta):
    """Decompose wind (u eastward, v northward) into radial + tangential."""
    r_hat = np.array([np.cos(theta), np.sin(theta)])
    t_hat = np.array([-np.sin(theta), np.cos(theta)])
    wind = np.array([u, v])
    u_r = np.dot(wind, r_hat)
    u_t = np.dot(wind, t_hat)
    return u_r, u_t

# fluidpy call
from fluidpy.geo.vectors import dot, scalar_projection
# or fluidpy.diag.cyclone ring-mean decomposition
```

### Rotation matrix
```python
import numpy as np

def rotation_matrix_2d(alpha):
    """C_ij = e_i · e'_j; alpha anticlockwise from x-axis."""
    ca, sa = np.cos(alpha), np.sin(alpha)
    return np.array([[ca, sa], [-sa, ca]])

alpha = np.radians(45.0)
C = rotation_matrix_2d(alpha)
# Note: movie's s18 table is C^T (the convention stated in conventions.py)
```

### Inflow angle (Hurricane Ian)
```python
import numpy as np

# From derived ring-mean data
u_r_mean = -4.5     # m/s (inward, so negative)
u_t_mean = 50.0     # m/s (tangential, anticlockwise)

alpha_in_scratch = np.degrees(np.arctan2(abs(u_r_mean), abs(u_t_mean)))
print(f"Inflow angle ≈ {alpha_in_scratch:.1f}°")
```

---

## 6. How to Replicate

1. **IBTrACS Ian track:**
   ```bash
   .venv/Scripts/python.exe -c "from fluidpy.data.ibtracs import fetch_basin; fetch_basin('NA', storm_id='2022266N12294')"
   ```

2. **HRRR layer stack** (documented in `reports/data/HRRR-zarr-ian2022.md`):
   ```bash
   .venv/Scripts/python.exe -c "import zarr, s3fs; ..."
   ```

3. **TDR ring-mean data** (not redistributable; derived ring-mean already computed):
   - Check `data/derived/ch00/ian_tdr_ring_mean.json` exists before running.

4. **Execute the notebook** (`notebooks/ch00a_coordinates_flat.ipynb`), kernel `aofd-venv`.

---

## 7. Notebook Outline

```
[MD]  # Chapter 0A · Coordinates, Part 1 — Arrows on a flat map
[MD]  ## Cartesian coordinates: the simplest grid (plain words)
[CODE] # Wind u=(3,4) m/s; Cartesian components; magnitude 5 m/s
[MD]  ## Plane polar coordinates (r, θ)
[CODE] # From scratch: (x,y) → (r,θ) and back; check round-trip
[CODE] # From scratch: r̂ = (cos θ, sin θ); θ̂ = (−sin θ, cos θ); verify ⊥
[MD]  ## Radial and tangential wind components
[CODE] # u_r = u·r̂; u_θ = u·θ̂; from scratch + assert fluidpy.geo.vectors.dot
[CODE] # Worked example: Ian at three ring points (easy numbers)
[MD]  ## Rotation of axes
[CODE] # Rotation matrix C; x' = Cx; verify C Cᵀ = I
[CODE] # Show: polar decomposition = Cartesian rotated by θ
[MD]  ## Application: Hurricane Ian ring-mean winds
[CODE] # Load derived ring-mean TDR data; compute u_r, u_θ profile vs r
[CODE] # Inflow angle α = arctan(|u_r|/u_θ) ≈ 18–22°
[CODE] # Map: HRRR 10-m wind + Ian track + ring at r=45 km
[MD]  *Reading card:* what does the inflow angle tell us?
[MD]  *Mechanism card:* why do hurricanes spiral in?
```
