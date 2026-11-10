# Notebook Plan: ch00_derivatives_taylor

**Source movie:** `movies/ch00/ch00_derivatives_taylor/` — v1  
**Series position:** Stage 1 #4 (plan v2 series; viewing order position 6)  
**Duration:** ~49:07, ~88,347 frames  
**Status:** Final (review 4 PASS, 0 Must, 16 Should → §5b retro-fit pending)

---

## 1. Video Summary

The calculus foundations movie — teaches what a derivative *is* (limit of a difference quotient), then extends to partial derivatives, the total differential and the chain rule along a path, changing variables (z→p), perfect vs inexact differentials, hydrostatic balance and the scale height as a differential equation, and finally Taylor series with two practical applications: the Clausius-Clapeyron 7% rule and the Stefan-Boltzmann Planck response. Finite differences and truncation error close the loop back to numerics. No external data download — the movie is entirely mathematical with atmospheric thought-experiment examples (rising balloon, flying plane).

Music: tangent-glide style (NEW — to add to `tools/sound/styles.py`), B-flat major Lydian 4/4 at 72 bpm, FM electric piano building from 1 → 4 notes (the Taylor partial sums), seed 17.

---

## 2. Concepts Covered

| Concept | Equation ref |
|---------|-------------|
| Derivative as a limit: df/dx = lim_{h→0}[f(x+h)−f(x)]/h | — |
| Derivative as tangent slope | — |
| Partial derivatives; mixed partials commute ∂²f/∂x∂y = ∂²f/∂y∂x | Kundu App. B §B.1 (p. 857); Vallis (1.69) |
| Total differential: df = (∂f/∂x)dx + (∂f/∂y)dy | Kundu p. 858 display before (B.1.1) |
| Chain rule along a path: df/dt = (∂f/∂x)(dx/dt) + (∂f/∂y)(dy/dt) | Kundu (B.1.4) |
| Variable change z→p: ∂/∂z = (∂p/∂z)∂/∂p | Kundu (B.2.1) |
| Perfect (exact) vs inexact differentials | Vallis (1.53), (1.61)–(1.63), (1.65), (1.69) |
| Hydrostatic balance as a differential equation; scale height | Vallis (1.51), (1.53) |
| Taylor series and linearisation | Kundu (10.4)–(10.5) |
| Clausius-Clapeyron linearised: 7% rule | Vallis (18.27) |
| Stefan-Boltzmann linearised: Planck response λ ≈ 3.3 W m⁻² K⁻¹ | Vallis (14.1) form |
| Finite differences and truncation error | Kundu (10.6) |

**Key equations:**

$$\frac{df}{dx} = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}$$

$$df = \frac{\partial f}{\partial x}dx + \frac{\partial f}{\partial y}dy + \frac{\partial f}{\partial z}dz$$

$$\frac{dT}{dt} = \frac{\partial T}{\partial t} + \frac{\partial T}{\partial x}\frac{dx}{dt} + \frac{\partial T}{\partial y}\frac{dy}{dt} + \frac{\partial T}{\partial z}\frac{dz}{dt}$$

$$f(x_0 + h) = f(x_0) + h f'(x_0) + \frac{h^2}{2!}f''(x_0) + \frac{h^3}{3!}f'''(x_0) + \cdots$$

$$\frac{de_s}{dT} = \frac{L e_s}{R_v T^2} \quad \Longrightarrow \quad \frac{\Delta e_s}{e_s} \approx 7\%\ \text{per K}$$

$$F = \sigma T^4 \quad \Longrightarrow \quad \lambda_\text{Planck} = 4\sigma T_e^3 \approx 3.3\ \text{W m}^{-2}\ \text{K}^{-1} \quad (T_e \approx 255\ \text{K})$$

---

## 3. Data Sources

No external data downloads. All examples use:
- Atmospheric constants (R, L, Rv, g, σ) from `fluidpy` or defined inline
- Synthetic temperature profiles (rising balloon thought experiment)
- ERA5 Ciarán `data/derived/ch00/era5_ciaran_2023_sfc.nc` (optional illustration if needed)

---

## 4. Visualizations Per Scene

| Scene | What it shows | TSX source | Sound cue |
|-------|--------------|------------|-----------|
| s00_title | Title frame | `house/kit/title.tsx` | — |
| s09_partial_height | Balloon released and rising; T(z) curve and tangent | `dt_s09.tsx` | wind_gentle (0.12) |
| s16_flight_east | Small plane flying east; T(x) profile | `dt_s16.tsx` | engine_hum_far (0.08) |
| s17_flight_west | Plane turning west; ∂T/∂x sign flip | `dt_s17.tsx` | engine_hum_far (0.08) |
| s18_balloon_rate | Balloon climbing; total derivative dT/dt = ∂T/∂t + ẇ ∂T/∂z | `dt_s18.tsx` | wind_gentle (0.1) |
| s_taylor | Taylor partial sums 1→4 terms on a curve | `dt_taylor.tsx` | (FM piano phrases) |
| s_cc | Clausius-Clapeyron: es(T) curve + linearised tangent | `dt_cc.tsx` | — |
| s_planck | F = σT⁴; linearised around 255 K | `dt_planck.tsx` | — |
| s_fd | Finite difference error vs step size h | `dt_fd.tsx` | — |
| s_end | End card | `house/kit/end_card.tsx` | — |

---

## 5. Methodologies & Equations

### Numerical derivative vs analytic limit
```python
import numpy as np

def f(x): return np.sin(x) + 0.5 * x**2

x0 = 1.0
df_analytic = np.cos(x0) + x0  # analytic: d/dx[sin x + x²/2] = cos x + x

for h in [1e-1, 1e-3, 1e-6, 1e-10]:
    df_numerical = (f(x0 + h) - f(x0)) / h
    print(f"h={h:.0e}  err={abs(df_numerical - df_analytic):.2e}")
```

### Chain rule along a balloon path
```python
# Balloon rises: z(t) = w*t (vertical velocity w = 0.5 m/s)
# T(z) = 288 - 6.5*z/1000  (standard lapse rate, K per m)
w = 0.5          # m/s
dTdz = -6.5e-3   # K/m
dTdt_local = 0.0 # °C/s (no local change in T at fixed z)

dTdt_total_scratch = dTdt_local + w * dTdz   # = 0.5 × (-6.5e-3) = -3.25e-3 K/s

# fluidpy
from fluidpy.core.kinematics import material_derivative_terms
# (see function signature in fluidpy for the exact call)
```

### Taylor series partial sums
```python
import numpy as np

def taylor_sin(x0, x, n_terms):
    """Partial sum of Taylor series for sin around x0."""
    result, h = 0.0, x - x0
    for n in range(n_terms):
        sign = (-1)**n
        result += sign * np.sin(x0 + n * np.pi/2) * h**n / np.math.factorial(n)
    return result
```

### Clausius-Clapeyron 7% rule
```python
import numpy as np

L  = 2.501e6     # J/kg
Rv = 461.5       # J kg⁻¹ K⁻¹
T  = 293.15      # K (20°C)
es0, T0 = 611.2, 273.15

es = es0 * np.exp(L/Rv * (1/T0 - 1/T))
pct_per_K = L / (Rv * T**2) * 100   # ≈ 6.8–7.2 %/K
print(f"Clausius-Clapeyron: {pct_per_K:.1f} % per K")
```

### Stefan-Boltzmann Planck response
```python
import numpy as np

sigma = 5.67e-8  # W m⁻² K⁻⁴
Te = 255.0       # K (effective emission temperature)

F = sigma * Te**4   # ≈ 239 W/m²
lambda_Planck = 4 * sigma * Te**3   # ≈ 3.75 W m⁻² K⁻¹
print(f"F = {F:.0f} W/m²,  λ_Planck = {lambda_Planck:.2f} W m⁻² K⁻¹")
```

---

## 6. How to Replicate

1. **No data downloads needed** — all examples use constants and synthetic profiles.

2. **Run the fluidpy kinematics tests:**
   ```bash
   .venv/Scripts/python.exe -m pytest "../Fluid Dynamics/tests/core/test_kinematics.py" -q
   ```

3. **Execute the notebook** (`notebooks/ch00a_derivatives_taylor.ipynb`), kernel `aofd-venv`.

---

## 7. Notebook Outline

```
[MD]  # Chapter 0A · Derivatives and Taylor series
[MD]  ## The derivative: how fast does something change? (plain words)
[CODE] # Numerical derivative of sin(x); shrink h → converges to analytic value
[MD]  ## Partial derivatives: change in one direction at a time
[CODE] # T(x,y) on a grid; ∂T/∂x and ∂T/∂y; show mixed partials commute
[MD]  ## The total differential: change along any path
[CODE] # Chain rule: balloon dT/dt = ∂T/∂t + w ∂T/∂z; worked numbers
[MD]  ## Changing variables: z → p
[CODE] # ∂/∂z converted to ∂/∂p via dp/dz = −ρg
[MD]  ## Taylor series: approximate a function near a point
[CODE] # Taylor partial sums for sin(x) around x=0; plot convergence
[CODE] # Easy example: sin(0.1) ≈ 0.1 (one term), 0.0998 (two terms)
[MD]  ## Application 1 · Clausius-Clapeyron: why a warmer atmosphere holds ~7% more water per K
[CODE] # Linearised CC; compute % per K at 20°C; assert ≈ 7%
[MD]  ## Application 2 · Planck response: how strongly Earth radiates back
[CODE] # F = σT⁴; λ = 4σT³ at Te = 255 K ≈ 3.75 W m⁻² K⁻¹
[MD]  ## Finite differences and truncation error
[CODE] # First-order FD vs analytic; error O(h); second-order centred O(h²)
[MD]  *Reading card:* what does the scale height mean physically?
```
