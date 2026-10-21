# Notation — Kundu ↔ Vallis crosswalk and the project's notation decisions

Our own words. Vallis meanings were checked against his notation pages (PDF 19–20, read privately, never copied);
Kundu meanings against the Kundu site's `knowledge/notation.md`. Per-symbol cards (unit, typical value, pitfall) live in
`symbols.yaml`; this file holds the **crosswalk** and the **rules**. The crossref-linker extends the crosswalk table
with every chapter's `analysis/chNN_kundu.md`; the knowledge-keeper merges it here.

## 1. Sign and symbol traps first

**⚠️ Latitude.** Vallis writes latitude **ϑ** (vartheta) and longitude **λ**; **θ is potential temperature** throughout
Vallis. Kundu ch13 writes latitude **θ** (f = 2Ω sin θ, (K 13.8)); Kundu ch04 writes latitude φ; Kundu App. B and every
spherical-coordinate formula use θ for the **colatitude** (angle from the pole) and φ for longitude. Chapter 0A's bridge
section does the substitution colatitude = π/2 − ϑ explicitly (sin ↔ cos swap, sign of the meridional derivative).
Many other GFD texts (and our earlier planning notes) write latitude φ — in this project's notebooks and code use the
**Vallis symbol ϑ in equations** and `lat` (degrees) / `lat_rad` in code.

**⚠️ Streamfunction sign.** Vallis (and Kundu ch13 §13.5/§13.16): **u = −∂ψ/∂y, v = ∂ψ/∂x** (u = k × ∇ψ = ∇⊥ψ) — high
ψ on the **right** of the flow, a low of ψ is a cyclone (NH, ζ = ∇²ψ > 0). Kundu ch04, ch06, ch11: u = +∂ψ/∂y,
v = −∂ψ/∂x — high ψ on the left. Every K-recap of Kundu ch04/ch06 material restates the sign. Overturning
streamfunctions (latitude–depth, latitude–pressure) carry their own sign, stated in every caption.

**⚠️ Lapse rate.** Vallis and meteorology: Γ ≡ −∂T/∂z (positive when temperature falls upward; dry adiabat +9.8 K/km,
stable when Γ < Γ_d). Kundu and **all fluidpy code**: Γ ≡ dT/dz (dry adiabat −9.8 K/km, stable when Γ > Γ_a).
**Project rule: compute with the Kundu sign (fluidpy `dT_dz` arguments), always show the meteorological value next to
it**, and write the stability inequality in the convention being displayed. `core.stratification.lapse_rate_convention`
converts.

**⚠️ Buoyancy vs density perturbation.** Vallis works with buoyancy **b = −g δρ/ρ₀** (or g δθ/θ̃): b > 0 is **lighter**
fluid. Kundu writes the density perturbation ρ′ (ρ′ > 0 is heavier) and the term −gρ′/ρ₀. N² = ∂b/∂z (Vallis) =
−(g/ρ₀) ∂ρ/∂z (Kundu, Boussinesq).

**⚠️ Velocity vectors.** Vallis: bold **u** = horizontal (u, v); bold **v** = 3-D (u, v, w); upright υ = meridional
component. Kundu: bold **u** = full 3-D velocity.

**⚠️ One letter, several meanings in Vallis** (context decides; our notebooks add a subscript or a word when two meet):
c_p (heat capacity / phase speed), q (QG or SW PV / specific humidity), η (entropy / perturbation height / enstrophy
dissipation), σ (ρ − 1000 / layer thickness ∂z/∂θ / Prandtl number), κ (R/c_p / diffusivity), α (specific volume /
aspect ratio), w (vertical velocity / mixing ratio), τ (wind stress / turnover time / optical depth), ω (vorticity /
frequency / pressure velocity — we write ω_p for Dp/Dt), β (∂f/∂y / expansion coefficients β_T, β_S, β_p), Re
(real part / Reynolds number), Pr (f₀/N / ν/κ), φ (p/ρ; curly φ = a passive tracer), Π (Exner function; Kundu Π =
Buckingham groups), k (bold italic = wave vector; upright = vertical unit vector).

**⚠️ Subscripts.** A subscript is a derivative only for a coordinate (u_y = ∂u/∂y, u_yy) or when the text says so; a
subscript 0 is a reference value; vector components are often superscripts (A^x). ∇_z, ∇_p name the coordinate held
fixed. Γ_z in Vallis is NOT a derivative.

## 2. Crosswalk table (seed; extended per chapter)

| Meaning | Kundu symbol | Vallis symbol | Note |
|---|---|---|---|
| latitude | θ (ch13), φ (ch04) | ϑ | ⚠️ §1 |
| colatitude (spherical coordinates) | θ (App. B) | — (Vallis uses latitude) | ch00a bridge |
| longitude | φ (App. B, spherical) | λ | |
| radius of the Earth | a, R | a | |
| rotation rate / vector | Ω, **Ω** | Ω, **Ω** | sidereal day |
| Coriolis parameter | f = 2Ω sin θ (K 13.8) | f = 2Ω sin ϑ | same physics |
| β | β (K 13.10) | β = ∂f/∂y = 2Ω cos ϑ / a | |
| velocity | **u** = (u, v, w) | **u** = (u, v) horizontal, **v** = (u, v, w) | ⚠️ §1 |
| vorticity vector / vertical | **ω**, ω_z or ζ | **ω**, ζ | |
| streamfunction (2-D) | ψ, u = +∂ψ/∂y (ch04) / u = −∂ψ/∂y (ch13) | ψ, u = −∂ψ/∂y | ⚠️ §1 |
| material derivative | D/Dt (K 3.5) | D/Dt; D_g/Dt with u_g | |
| pressure / reference pressure | p, p_o (θ reference) | p, p_R | code P_REF = 1e5 Pa |
| density / reference | ρ, ρ_0 | ρ, ρ_0 | |
| density perturbation / buoyancy | ρ′, −gρ′/ρ₀ | b = −gδρ/ρ₀ | ⚠️ §1 |
| buoyancy frequency | N (K 1.36) | N | |
| lapse rate | Γ ≡ dT/dz | Γ ≡ −∂T/∂z | ⚠️ §1 |
| potential temperature | θ (K 1.31) | θ | |
| potential density | ρ_θ (K 1.33) | ρ_θ, σ = ρ − 1000 | |
| specific volume | v | α | |
| specific entropy | s | η | |
| internal energy | e | I | |
| heat capacities | C_p, C_v | c_p, c_v | Vallis c_p also phase speed |
| gas constant (dry air) | R | R | 287 J/(kg K) |
| sound speed | c | c_s | |
| geopotential | Φ = gz (body-force potential) | Φ ≈ gz | Z = −H log(p/p_R) log-pressure height |
| kinematic pressure | p/ρ₀ | φ = p/ρ | |
| wave vector, frequency | **K** = (k, l, m), ω | **k** = (k, l, m), ω | |
| phase / group velocity | c, **c**_g | c_p, **c**_g | |
| deformation radius | Λ = c/f (ch13) | L_d, k_d = 1/L_d | |
| Ekman depth | δ = √(2ν_v/f) (K 13.29) | δ (§5.7) | check Vallis's factor when ch05 is analysed |
| wind stress | τ (K 13.22) | **τ**, τ̃ = **τ**/ρ | |
| SW potential vorticity | (ζ + f)/h | q = (ζ + f)/h | |
| Ertel PV | — | Q | PVU |
| Rossby / Reynolds / Richardson | Ro, Re, Ri | Ro = U/(fL), Re = UL/ν, Ri | |
| Prandtl | Pr = ν/κ | Pr = f₀/N (mostly) | ⚠️ |
| unit vectors | **e**_1, **e**_2, **e**_3 (or **e**_x…) | **i**, **j**, **k** | |
| Kronecker / alternating | δ_ij, ε_ijk | same | |

## 3. Project notation decisions

- **Equation references.** Vallis equations bare: `(2.12)`; Kundu equations with a K: `(K 13.15)`; Kundu App. B:
  `(B.3.9)` (Chapter 0A only, always "Kundu (B.3.9)" on first mention in a block). **Always with the maths beside the
  number** — never "by (2.12)" alone (coverage_check, lesson-reviewer). Equations are transcribed from page images.
- **IDs.** CORE `C01…` (Chapter 0: `C0A-01…`, `C0B-01…`, `C0C-01…`), NOTE `N01…`, K-recap `K01…`, recap `R01…`, skip
  `S01…`, derivation `D01…` (★–★★★), primers `P0-01…` (Kundu primers P001–P395 stay on the Kundu site), explainers
  `E01…` per chapter (Chapter 0: E01–E32 across the parts, PLANNING §9.1). IDs restart per chapter; cross-chapter refs say
  "ch02 C05".
- **Units.** SI in code and equations; displays may use hPa, km, °C, g/kg, Sv, PVU, days with the SI value available
  (hover card / Explain). Temperatures in formulas in kelvin. Ω from the sidereal day.
- **Numbers twice.** Easy and exact side by side: "≈ 10 m/s | 9.6 m/s" (R4 §1.8 table of easy constants).
- **Rotation sense.** Never "clockwise" without hemisphere and viewpoint; prefer cyclonic/anticyclonic with the clock
  sense in brackets.
- **Code names.** `lat`/`lon` in degrees, `lat_rad` in radians; `f`, `beta`, `N2`, `b`, `psi`, `zeta`; `dT_dz` for the
  Kundu-sign lapse rate; `Gamma_met` only when a meteorological value is displayed.
- **Grids.** `[j, i]` = (y, x) as in Kundu ch13; latitude ascending (PSL files run N→S — `sortby("lat")`); longitude
  0–360 unless a map needs −180–180, stated.
