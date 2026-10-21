# CUMULATIVE knowledge — aofd (Vallis, *Atmospheric and Oceanic Fluid Dynamics*, 2nd ed.)
(Rewritten by the knowledge-keeper after every chapter. Every agent reads this first, together with `notation.md`,
`viz_patterns.md`, `symbols.yaml`, `glossary.yaml` and `kundu_index.yaml`. Seeded 2026-10-20 in the setup session.)

---

## Part 1 — What the Kundu site already taught (the reader may have seen it; we re-teach it at first Vallis use)

Source: the finished fluidpy site, <https://shammun.github.io/fluidpy> (Kundu, Cohen & Dowling, *Fluid Mechanics*,
5th ed., 16 chapters, 136 explainers, 248 CORE blocks, 419 derivations — counts from `kundu_index.yaml`, fluidpy commit
89ef2e7 / site content at d379326). Deep links for every section, CORE block, derivation and explainer are in
`knowledge/kundu_index.yaml`; use those, never hand-typed URLs. **K-recap rule:** the first time Vallis uses an idea
listed here it is re-taught in full (CORE depth, Kundu derivation steps re-typed in Vallis notation, crosswalk table,
link); later uses get a short recap (skill `cross-book-continuity`).

Notebook URL pattern: `https://shammun.github.io/fluidpy/notebooks/chNN_<slug>.html`; explainers
`https://shammun.github.io/fluidpy/viz/chNN/<slug>.html`.

| Kundu ch (slug) | Key ideas taught (one line each) | Where Vallis needs it first |
|---|---|---|
| ch01 `introduction` | continuum ρ, p, T, u; Newton viscosity τ = μ du/dy; hydrostatics dp/dz = −ρg, USSA-1976, buoyancy; first law → Gibbs → c² → p = ρRT → p/ρ^γ; N², dry adiabat, θ (code Γ ≡ dT/dz, meteorology −dT/dz shown); Buckingham Π | Vallis §1.4–1.6, §2.7, §2.10 |
| ch02 `cartesian_tensors` | summation convention, rotation of axes, stress tensor, ε–δ identity, symmetric + antisymmetric split, principal axes, Gauss and Stokes theorems on grids | Ch. 0A (vectors, index notation, Gauss/Stokes) |
| ch03 `kinematics` | material derivative DF/Dt = ∂F/∂t + u·∇F (3.5); streamlines/pathlines/streaklines; Galilean frames; strain rate S and rotation ½ω; Rankine/Gaussian vortices; Reynolds transport theorem (3.35) | Ch. 0A 0.14, Vallis §1.1 |
| ch04 `conservation_laws` | mass (continuity), stream function (u = +∂ψ/∂y in Kundu ch04), momentum (Cauchy → Navier–Stokes), rotating frame ±2Ω×u′ and centrifugal, energy and dissipation ε ≥ 0, Bernoulli forms, **Boussinesq**, dimensionless NS | Vallis §1.2–1.3, §1.10, §2.1, §2.4 |
| ch05 `vorticity_dynamics` | vortex tubes, Kelvin's circulation theorem, baroclinic torque (∇ρ×∇p), Helmholtz laws, Dω/Dt (5.13) with stretching and tilting, Biot–Savart, rotating baroclinic vorticity (5.30), (ζ + f)/h | Vallis ch04 (vorticity, PV) |
| ch06 `ideal_flow` | Laplace equation, superposition, complex potential, cylinder lift L = ρUΓ, conformal maps, Laplace on a grid | Ch. 0A (Laplacian), elliptic solves later |
| ch07 `gravity_waves` | plane waves, ω² = gk tanh kH (7.28), particle orbits, energy, **group velocity**, rays and refraction, hydraulic jump, interfacial √(g′H), internal waves ω = N cos θ | Ch. 0A 0.16, Vallis ch06–07 |
| ch08 `laminar_flow` | Couette–Poiseuille, lubrication, Stokes' first/second problems (δ = √(2ν/ω)), similarity by exponent matching, creeping flow | Ch. 0A (similarity variables, B.2), Ekman analogies |
| ch09 `boundary_layers` | δ ~ L Re^{−1/2}, Blasius, Falkner–Skan, Thwaites, separation, jets, teacup secondary flow → Ekman | Vallis §5.7 (Ekman layer), ch19 boundary layers |
| ch10 `computational_fluid_dynamics` | stencils and order, FTCS and von Neumann stability, upwind/CFL, Galerkin, cell Péclet, MacCormack, C-grid projection | every from-scratch solver here |
| ch11 `instability` | normal modes → eigenvalue problem → neutral curve; Kelvin–Helmholtz; Rayleigh–Bénard; Miles–Howard Ri > ¼; Orr–Sommerfeld; energy method; Lorenz attractor | Vallis ch09, ch11 |
| ch12 `turbulence` | Reynolds averaging, eddy fluxes, Kolmogorov −5/3 and η, log law, mixing length, Richardson flux number, Taylor dispersion | Vallis ch11–13 |
| ch13 `geophysical_fluid_dynamics` | thin rotating shell, f = 2Ω sin θ (13.8, θ = latitude), **geostrophy, thermal wind (13.15)**, Taylor–Proudman, **Ekman spiral δ = √(2ν_v/f) (13.29), transport −τ/(ρf) (13.30), pumping**, vertical modes c_n² = gH_e (13.62), Poincaré/Kelvin/**Rossby waves**, geostrophic adjustment (one third of the energy kept), Rayleigh–Kuo β − U″, **Eady** σ = 0.31 fU₀/(NH) | Vallis ch02–ch09 almost throughout |
| ch14 `aerodynamics` | circulation and lift, Kutta condition, Zhukhovsky airfoils, lifting line, induced drag | (little) |
| ch15 `compressible_flow` | acoustics and d'Alembert, stagnation ratios, nozzles, shocks, Prandtl–Meyer | Vallis §1.8–1.9 (sound, incompressible limit) |
| ch16 `biofluid_mechanics` | pulsatile flow, Womersley number, elastic tubes | (none) |

**Reusable library (installed editable from `../Fluid Dynamics`; never change a `fluidpy.core` signature):**
`core.gfd` (f, β, f-/β-plane, geostrophy, thermal wind, Taylor–Proudman, Ekman family incl. pumping and Sverdrup
transport, SW/Poincaré/Kelvin dispersion, adjustment, inertia–gravity, Rossby ω/c_p/c_g, PV, Rayleigh–Kuo, Eady growth,
modes and fluxes, 2-D cascade, Rhines length — f signed, ValueError at f = 0), `core.rotating` (frame acceleration terms,
centrifugal potential, effective gravity, projectile paths), `core.shallow_water` (C-grid SW solver, PV, energy,
particles, linear QG evolve), `core.stratification` (N², parcel ODEs, lapse-rate conventions, θ), `core.vertical_modes`,
`core.thermo` (perfect gas, sound speed), `core.waves`, `core.operators`, `core.curvilinear`, `core.index_notation`,
`core.integral_theorems`, `core.kinematics`, `core.conservation`, `core.navier_stokes`, `core.statics`,
`core.dimensional`, `core.stability` (spectral eigen-solvers), `core.fd`, `core.mac`; notebook machinery
`core.embed.show_viz`, `core.anim`, `core.interact`, `core.style`, `core.units`. Full function list: `kundu_index.yaml →
functions` (2 490 public names in 78 modules).

**Kundu project rules that carry over** (lessons paid for in 16 chapters): every equation shown in full next to its
number; a number stands only beside the equation printed under it (render the page); every TeX-bearing JS string is
`String.raw`; write files with Write/Edit only; book-quoted numbers only in git-ignored `tests/book_values_*.json`; design
Part C (function contracts) first; "two values, the book's first"; a DEVIATION box wherever the code departs from the
book; figure notes written from the rendered figure; eigen-solvers return the leading mode or raise and are checked by
an independent route; an unread source is not a benchmark.

**Open Kundu items that may matter here:** ch13 slip #14 (westward flow over a step) has no ruling yet; `shot.py` lacks
`.katex-error`/control-character checks and real clicks (to be added in the AOFD `shot.py` work).

---

## Part 2 — Vallis start (nothing taught yet)

**Project.** `aofd` turns Vallis, *AOFD* (2nd ed., CUP 2017; 22 chapters in 4 parts, 966 PDF pages, pdf = printed + 20)
into one learning package per chapter (executed notebook, Colab twin, page, 5–14 explainers in the Kundu format with
three.js 3-D views, 0–4 standalone 3-D scenes, data figures rebuilt from open data, 1–3 narrated movies), for a reader
with first-year calculus and no climate background. Physics, data access and diagnostics go into `fluidpy.geo`,
`fluidpy.data`, `fluidpy.diag` (fluidpy v0.3.0, pinned by tag on Colab); book glue in `aofd/`. Spec: `PLANNING.md` (§15
wins over earlier sections).

**Chapter 0 — "Start here"** (not a book chapter; three parts, each its own notebook/Colab/page, informal blog-like voice;
about 12 explainers per part as a soft target; IDs `C0A-…`, `C0B-…`, `C0C-…`, primers `P0-…`):
- **0A · Maths from scratch** — all of Kundu Appendix B (B.1–B.6, item by item, PLANNING §15.5: partial and total
  derivatives, method of characteristics, changing variables and similarity variables, ∇ and all 13 identities
  (B.3.1)–(B.3.13), Gauss and Stokes, Dirac delta, the three coordinate systems and their operators, colatitude ↔
  latitude bridge) plus Taylor/linearisation, complex exponentials and waves, Fourier, ODE basics, scaling and
  nondimensional numbers.
- **0B · Climate and GFD basics** — the 17 groups of PLANNING §15.6 (planet and fluids, energy, state of air, water in the
  air, seawater, stability, rotation, balances, spin/PV, waves, instability, friction/Ekman, atmospheric and stratospheric
  circulation, ocean circulation, units, data words), tiered A/B/C, mechanism cards (R4 §4).
- **0C · Reading climate figures** — every figure type the book uses with a 5-question reading card (R4 §3), practised on
  anonymous open data (NCEP R1 500 hPa and zonal-mean u, ERSST v5, FU-Berlin QBO).
- Standalone scenes planned: `earth_thin_shell`, `vector_zoo`, `the_500hPa_surface`, `coriolis_merry_go_round`,
  `pv_skater`, `globe_unwrapping`. Movies: batch 1 = M0-1 climate machine, M0-2 spinning planet, M0-3 how to read a
  climate map (user watches, then batch 2 M0-4..M0-6 with that feedback). Narrator Kokoro `af_bella`, speed 1.0.

**State:** setup session in progress (PLANNING §12 steps 1–11); no Vallis chapter analysed, nothing taught yet. The
proof of concept (PoC A–G) samples one product of each kind and is **not** Chapter 0 content.

**Conventions decided so far:** see `notation.md` (Vallis latitude is ϑ and θ is potential temperature; Vallis ψ sign
u = −∂ψ/∂y; compute lapse rates with Kundu Γ = dT/dz and always show met Γ = −dT/dz; b > 0 = light).
