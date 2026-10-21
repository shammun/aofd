# R3b — Figure catalogue: Vallis, *Atmospheric and Oceanic Fluid Dynamics* (2nd ed., 2017)

Every figure number found in the PDF (captions extracted by text, see R3 §1), classified for reproduction.
Labels are our own short topic words, not caption text. **Never copy a book figure; regenerate it with our code.**

Type codes: **SCH** schematic (redraw as our own diagram, or link to an explainer) · **ANA** analytic plot (formula / tiny ODE or eigen-solve) · **SIM** model output we simulate ourselves · **GCM** output of a complex model (reproduce from reanalysis/state estimate, or a reduced model, labelled) · **MAP** observational / reanalysis / state-estimate map · **SEC** observational section, zonal mean, profile, time series or spectrum. ★ = one of the 18 reference crops (`_private/figure_refs/geo_*.png`), with a full recipe in R3 §3. Dataset keys are defined in R3 §2.

**Totals (360 figures):** SCH 127 · ANA 124 · SEC 44 · SIM 41 · MAP 16 · GCM 8
 → **60 data figures** need downloads; 8 GCM figures need reanalysis or a reduced model.


## Chapter 1 — Equations of motion

| Fig. | Type | Topic (our words) | Data / how to reproduce |
|---|---|---|---|
| 1.1 | SCH | mass budget, cuboid control volume |  |
| 1.2 | SCH | mass budget, arbitrary control volume |  |
| 1.3 | ANA | seawater density in T-S space (two pressures) | TEOS-10 `gsw.rho`/`gsw.sigma0` on a T-S grid; no download |
| 1.4 | ANA | potential temperature vs p, T, S | `gsw.pt_from_t`; no download |
| 1.5 | ANA | density sensitivity to theta, S, p | `gsw.rho`; optional WOA23 T-S scatter overlay |

## Chapter 2 — Rotation and stratification

| Fig. | Type | Topic (our words) | Data / how to reproduce |
|---|---|---|---|
| 2.1 | SCH | vector seen in rotating frame |  |
| 2.2 | SCH | effective gravity, true vs approx. sphere |  |
| 2.3 | SCH | spherical coordinates and unit vectors |  |
| 2.4 | SCH | rotation vector components; f-, beta-plane |  |
| 2.5 | SCH | geostrophic flow round highs/lows |  |
| 2.6 | SCH | thermal-wind mechanism |  |
| 2.7 | SCH | parcel on curved path (gradient wind) |  |
| 2.8 | SCH | parcel displacement, static stability |  |

## Chapter 3 — Shallow water

| Fig. | Type | Topic (our words) | Data / how to reproduce |
|---|---|---|---|
| 3.1 | SCH | shallow-water layer |  |
| 3.2 | SCH | column mass budget |  |
| 3.3 | SCH | reduced-gravity layer |  |
| 3.4 | SCH | multi-layer shallow water |  |
| 3.5 | SCH | two-layer shallow water |  |
| 3.6 | SCH | geostrophic SW flow |  |
| 3.7 | SCH | Margules relation |  |
| 3.8 | ANA | Poincare vs non-rotating SW dispersion |  |
| 3.9 | ANA | top-hat release, non-rotating (d'Alembert) |  |
| 3.10 | ANA | linear geostrophic adjustment of a step |  |
| 3.11 | SIM | SW adjustment with/without rotation | 1-D linear/nonlinear SW finite-volume solver |
| 3.12 | SCH | APE: flattening sloped isentropes |  |
| 3.13 | SCH | isopycnal vs height surface (APE) |  |

## Chapter 4 — Vorticity and PV

| Fig. | Type | Topic (our words) | Data / how to reproduce |
|---|---|---|---|
| 4.1 | SCH | circulation in axisymmetric vortex |  |
| 4.2 | SCH | vortex tube through material sheet |  |
| 4.3 | SCH | material line element evolution |  |
| 4.4 | SCH | vorticity tilting |  |
| 4.5 | SCH | vortex stretching |  |
| 4.6 | SCH | solenoids, baroclinic generation |  |
| 4.7 | SCH | circuit projected on equatorial plane |  |
| 4.8 | SCH | fluid element between tracer surfaces |  |
| 4.9 | SCH | geometry of PV conservation |  |
| 4.10 | SCH | column-volume argument for SW PV |  |
| 4.11 | SCH | PV substance between isentropes |  |

## Chapter 5 — Geostrophic theory

| Fig. | Type | Topic (our words) | Data / how to reproduce |
|---|---|---|---|
| 5.1 | SCH | two-layer QG system |  |
| 5.2 | SCH | multi-layer QG system |  |
| 5.3 | SCH | two-level QG model |  |
| 5.4 | SCH | idealised boundary layer |  |
| 5.5 | ANA | atmospheric Ekman hodograph |  |
| 5.6 | ANA | bottom/top Ekman profiles |  |
| 5.7 | SCH | Ekman layer under geostrophic flow |  |
| 5.8 | ANA | ocean Ekman spiral (SH) |  |
| 5.9 | SCH | upper and lower Ekman layers |  |

## Chapter 6 — Wave fundamentals

| Fig. | Type | Topic (our words) | Data / how to reproduce |
|---|---|---|---|
| 6.1 | SCH | phase lines of a 2-D wave |  |
| 6.2 | ANA | beats: two close wavenumbers |  |
| 6.3 | ANA | wave packet and envelope |  |
| 6.4 | ANA | stationary-phase integrand |  |
| 6.5 | ANA | ray paths of two packets | ray-tracing ODEs |
| 6.6 | SCH | Rossby wave mechanism |  |
| 6.7 | ANA | barotropic/baroclinic Rossby dispersion |  |
| 6.8 | ANA | Rossby dispersion diagram, group vs phase |  |
| 6.9 | SCH | Rossby reflection at western wall (physical space) |  |
| 6.10 | SCH | Rossby reflection (wavevector space) |  |

## Chapter 7 — Gravity waves

| Fig. | Type | Topic (our words) | Data / how to reproduce |
|---|---|---|---|
| 7.1 | ANA | particle orbits, deep vs shallow water waves |  |
| 7.2 | ANA | internal-wave dispersion, full vs hydrostatic |  |
| 7.3 | SCH | internal-wave crests, k and c_g |  |
| 7.4 | SCH | parcel forces in internal wave |  |
| 7.5 | SCH | internal-wave cones |  |
| 7.6 | SCH | angles used for internal waves |  |
| 7.7 | SCH | reflection, shallow slope |  |
| 7.8 | SCH | reflection, steep slope |  |
| 7.9 | SCH | reflection changing wavelength |  |
| 7.10 | ANA | rays at a turning height (cusp) |  |
| 7.11 | SEC | ocean density and N profile | WOA23 annual T,S at one station -> `gsw.Nsquared`; or analytic thermocline profile |
| 7.12 | ANA | oceanic wave guide, m^2(z) | use N(z) from 7.11 (WOA23) or analytic |
| 7.13 | ANA | group-velocity rays in wave guide |  |
| 7.14 | SCH | parcel forces, inertia-gravity wave |  |
| 7.15 | SCH | flow over small topography, set-up |  |
| 7.16 | ANA | flow over sinusoidal ridge, two regimes |  |
| 7.17 | ANA | flow over bell-shaped ridge |  |
| 7.18 | ANA | bell ridge, smaller U |  |
| 7.19 | ANA | acoustic-gravity dispersion, isothermal |  |

## Chapter 8 — Low latitudes

| Fig. | Type | Topic (our words) | Data / how to reproduce |
|---|---|---|---|
| 8.1 | ANA | Rossby-gravity propagation diagrams |  |
| 8.2 | ANA | Rossby-gravity dispersion, frequency gap |  |
| 8.3 | ANA | planetary-geostrophic Rossby wave locus |  |
| 8.4 | SCH | westward drift of PG Rossby waves |  |
| 8.5 | ANA | parabolic-cylinder (Hermite) structures |  |
| 8.6 | ANA | equatorial-wave dispersion curves, m=0..3 |  |
| 8.7 | SIM | SW-on-sphere power spectrum with dispersion overlay | nonlinear SW on the sphere (e.g. `shtns`/`dinosaur`/own spectral code) + space-time FFT; or forced linear beta-plane model; cheaper: run equatorial beta-plane SW (fig 22.18 code) with noise forcing |
| 8.8 | SCH | SW gravity wave, interface and velocity |  |
| 8.9 | SCH | force balance across Kelvin wave |  |
| 8.10 | ANA | rays in equatorial wave guide |  |
| 8.11 | ANA | Matsuno-Gill, symmetric heating | steady linear damped equatorial beta-plane solve (spectral in x, FD in y) |
| 8.12 | ANA | Matsuno-Gill overturning streamfunctions | steady linear damped equatorial beta-plane solve (spectral in x, FD in y) |
| 8.13 | ANA | Matsuno-Gill, antisymmetric heating | steady linear damped equatorial beta-plane solve (spectral in x, FD in y) |
| 8.14 | ANA | Matsuno-Gill, off-equator heating | steady linear damped equatorial beta-plane solve (spectral in x, FD in y) |
| 8.15 | ANA | Matsuno-Gill, line heating | steady linear damped equatorial beta-plane solve (spectral in x, FD in y) |
| 8.16 | ANA | Matsuno-Gill line-heating profiles | steady linear damped equatorial beta-plane solve (spectral in x, FD in y) |

## Chapter 9 — Barotropic and baroclinic instability

| Fig. | Type | Topic (our words) | Data / how to reproduce |
|---|---|---|---|
| 9.1 | SCH | vortex-sheet basic state |  |
| 9.2 | SCH | smooth vs piecewise profiles |  |
| 9.3 | SCH | point jet profile |  |
| 9.4 | SCH | barotropically unstable profiles |  |
| 9.5 | ANA | Rayleigh shear-layer growth rate and c |  |
| 9.6 | SIM | nonlinear shear-layer roll-up (vorticity) | 2-D doubly periodic pseudo-spectral vorticity code |
| 9.7 | SIM | total vs perturbation streamfunction | same run as 9.6 |
| 9.8 | ANA | example profiles and U'' |  |
| 9.9 | SCH | baroclinically unstable basic state |  |
| 9.10 | ANA | Eady growth rate and phase speed |  |
| 9.11 | ANA | Eady growth rate in k-l plane |  |
| 9.12 | ANA | Eady most-unstable mode structure |  |
| 9.13 | ANA | growth rate, 2/4/8 levels vs continuous | matrix eigenproblem |
| 9.14 | ANA | two-layer Phillips growth rates, beta values |  |
| 9.15 | ANA | two-layer growth-rate contours, neutral curve |  |
| 9.16 | ANA | minimum shear for instability vs k |  |
| 9.17 | ANA | two-layer unstable wave structure |  |
| 9.18 | SCH | interacting Eady edge waves |  |
| 9.19 | ANA | two-layer vs continuous (Charney) growth | vertical eigenproblem (`scipy.linalg.eig`) |
| 9.20 | ANA | Charney vs Eady modal structure | vertical eigenproblem |
| 9.21 | ANA | effect of a stratosphere on instability | vertical eigenproblem |
| 9.22 | ANA | oceanic baroclinic instability, four profiles | vertical eigenproblem; optional realistic N(z) from WOA23 |

## Chapter 10 — Wave-mean-flow interaction

| Fig. | Type | Topic (our words) | Data / how to reproduce |
|---|---|---|---|
| 10.1 | SCH | isentrope displacement from mean |  |
| 10.2 | ANA | EP vector in Eady problem |  |
| 10.3 | ANA | Eulerian vs residual streamfunction, Eady |  |
| 10.4 | ANA | Eady mean-flow and buoyancy tendencies |  |
| 10.5 | ANA | Eady tendencies near lid/surface |  |

## Chapter 11 — Incompressible turbulence

| Fig. | Type | Topic (our words) | Data / how to reproduce |
|---|---|---|---|
| 11.1 | SCH | local vs non-local triads |  |
| 11.2 | SCH | energy cascade cartoon |  |
| 11.3 | ANA | Kolmogorov spectrum with ranges | model spectrum (Pope 2000 form) |
| 11.4 | SEC | lab pipe-flow 3-D spectra collapse | Superpipe data not public -> JHTDB isotropic DNS spectra (free token) or Pope model spectrum, labelled illustrative |
| 11.5 | SCH | 2-D filament stretching/folding |  |
| 11.6 | SCH | spectral centroid argument |  |
| 11.7 | SCH | 2-D turbulence dual cascade cartoon |  |
| 11.8 | SIM | free 2-D turbulence vorticity/streamfunction | pseudo-spectral 2-D code |
| 11.9 | SIM | forced-dissipative 2-D spectrum | pseudo-spectral 2-D code |
| 11.10 | SIM | Lorenz attractor | `solve_ivp` |
| 11.11 | SIM | Lorenz sensitivity to perturbation | `solve_ivp` |
| 11.12 | ANA | energy vs passive-tracer spectra, 3-D/2-D |  |

## Chapter 12 — Geostrophic turbulence

| Fig. | Type | Topic (our words) | Data / how to reproduce |
|---|---|---|---|
| 12.1 | ANA | Rossby vs turbulent frequency in k |  |
| 12.2 | ANA | anisotropic wave-turbulence boundary (dumbbell) |  |
| 12.3 | SIM | beta-plane spectrum evolution | pseudo-spectral beta-plane code |
| 12.4 | SIM | beta-plane vorticity -> zonal jets | same code |
| 12.5 | SCH | putative beta-plane spectra |  |
| 12.6 | ANA | PV staircase and jets |  |
| 12.7 | SIM | beta-plane turbulence snapshots + zonal mean | same code with forcing/drag |
| 12.8 | SCH | two-layer baroclinic turbulence schema |  |
| 12.9 | SEC | tropopause-level aircraft KE spectra | GASP raw data not open -> ERA5 250 hPa KE spectrum (spherical harmonics, `pyshtools`, ARCO-ERA5 snapshots) + labelled k^-3 / k^-5/3 reference; mesoscale range not resolved -> note |
| 12.10 | SIM | baroclinic lifecycle spectra | two-layer QG pseudo-spectral model |
| 12.11 | SIM | lifecycle energy conversions | same |
| 12.12 | ANA | oceanic vs uniform buoyancy profiles + modes | analytic profile; optional WOA23 profile |
| 12.13 | MAP | first baroclinic deformation radius, global ocean | WOA23 1deg annual T,S -> `gsw` N^2 -> WKB L_d = (1/|f|pi) int N dz (or eigen-solve); ETOPO mask for <3500 m; Robinson |
| 12.14 | SIM | lifecycle with oceanic stratification | two-layer/multi-layer QG |
| 12.15 | SIM | energy paths by vertical mode | multi-layer QG |

## Chapter 13 — Turbulent diffusion

| Fig. | Type | Topic (our words) | Data / how to reproduce |
|---|---|---|---|
| 13.1 | SCH | change of integration variables |  |
| 13.2 | ANA | idealised Lagrangian velocity correlation |  |
| 13.3 | SEC | drifter tracks, Gulf of Mexico (25-day) | SCULP not easily fetched -> NOAA GDP hourly drifters (AOML/NCEI, ERDDAP) or GLAD (GRIIDC, CC0), clip to Gulf, 25-day segments; cartopy PlateCarree |
| 13.4 | SEC | pair relative dispersion vs time | GLAD/GDP drifter pairs within 1 km; mean-square separation |
| 13.5 | SCH | downgradient flux argument |  |
| 13.6 | SCH | GM skew flux along isopycnals |  |
| 13.7 | SCH | GM eddy-induced circulation |  |

## Chapter 14 — Hadley and Ferrel cells

| Fig. | Type | Topic (our words) | Data / how to reproduce |
|---|---|---|---|
| 14.1 | SEC | TOA absorbed solar and OLR vs latitude | CERES EBAF TOA monthly (ASDC, Earthdata) or NOAA interp. OLR + ERA5 TOA net SW (WB2 store); sin-lat axis |
| 14.2 | SEC | annual zonal-mean u and T (and theta) | NCEP R1 monthly (`ncep.reanalysis.derived/pressure`) or ERA5 monthly; log-p axis |
| 14.3 | SEC | atmospheric mass MOC, DJF | reanalysis monthly v -> psi = 2 pi a cos(phi)/g int v dp |
| 14.4 | SCH | simple Hadley cell |  |
| 14.5 | SCH | angular-momentum ring |  |
| 14.6 | ANA | Held-Hou theta_E vs theta_M |  |
| 14.7 | ANA | Held-Hou U_E vs U_M |  |
| 14.8 | SCH | moist Hadley schematic |  |
| 14.9 | SCH | off-equatorial heating Hadley model |  |
| 14.10 | ANA | Lindzen-Hou solutions |  |
| 14.11 | ANA | upper winds: AM-conserving vs observed | analytic + NCEP/ERA5 200 hPa zonal mean u |
| 14.12 | SEC | DJF eddy heat and momentum fluxes | daily/6-hourly reanalysis (NCEP R1 daily averages, or ERA5); transient eddies about monthly mean; log-p axis H=7.5 km |
| 14.13 | SCH | eddy-flux influence on Hadley cell |  |
| 14.14 | GCM | zonal wind: reanalysis vs idealised dry GCM | left: reanalysis zonal mean u; right: Held-Suarez run with a light dynamical core (e.g. `dinosaur` JAX, or pseudo/illustrative) |
| 14.15 | GCM | overturning: reanalysis vs dry GCM | as 14.14 |
| 14.16 | SEC | isentropic mass streamfunction, DJF | 6-hourly reanalysis u,v,T -> theta coordinates (Townsend & Johnson style binning) |
| 14.17 | SCH | eddy-driven Ferrel cell (Eulerian view) |  |

## Chapter 15 — Mid-latitude zonal-mean circulation

| Fig. | Type | Topic (our words) | Data / how to reproduce |
|---|---|---|---|
| 15.1 | SEC | zonal wind at 150W, DJF and MAM | NCEP R1/ERA5 monthly u, select 150W, seasonal mean; lat-p section |
| 15.2 | SCH | eddy effect on circulation round a latitude |  |
| 15.3 | SCH | stirring -> Rossby waves -> zonal flow |  |
| 15.4 | SCH | bow-shaped momentum convergence |  |
| 15.5 | ANA | mean flow from confined stirring | pseudomomentum budget formula |
| 15.6 | SCH | stirred region radiates Rossby waves |  |
| 15.7 | SIM | barotropic vorticity on sphere, stirred: mean u | spherical-harmonic barotropic model (`shtns` or `pyspharm`; or `dinosaur`) |
| 15.8 | SIM | pseudomomentum stirring/dissipation | same run |
| 15.9 | SCH | single active layer over topography |  |
| 15.10 | SCH | form drag on a layer |  |
| 15.11 | SCH | two isentropic layers |  |
| 15.12 | SCH | two-layer thermodynamics |  |
| 15.13 | SCH | two-layer PV fluxes |  |
| 15.14 | ANA | two-layer eddy-flux profiles |  |
| 15.15 | ANA | diffusive closure, two-layer zonal model |  |
| 15.16 | SEC | zonal-mean Ertel PV with theta | ERA5 PV + T (WB2/ARCO or CDS monthly) or compute PV from NCEP u,v,T; annual & DJF |
| 15.17 | GCM | EP flux in idealised PE model | Held-Suarez run or illustrative; recipe as 15.18 |
| 15.18 | SEC | observed EP flux and divergence, NH | 6-hourly/daily reanalysis u,v,T; primitive-equation EP flux in log-p; arrows scaled per Edmon et al. |
| 15.19 | SCH | EP fluxes in baroclinic atmosphere |  |
| 15.20 | SEC | EP divergence over zonal-mean u | as 15.18 |
| 15.21 | SEC | momentum vs heat-flux parts of EP divergence | as 15.18 |
| 15.22 | SEC | Eulerian vs isentropic/residual streamfunction, DJF | reanalysis (as 14.3, 14.16; TEM residual) |
| 15.23 | SCH | lower-atmosphere residual overturning schematic |  |
| 15.24 | ANA | US standard atmosphere T(z) + layers | piecewise-linear standard-atmosphere formula (`metpy`/own) |
| 15.25 | SEC | observed T profiles vs dry/moist adiabats | reanalysis annual zonal-mean T at chosen latitudes; `metpy.calc.moist_lapse`/`dry_lapse` |
| 15.26 | ANA | tropopause height vs dT and optical depth | grey radiative-convective column model |

## Chapter 16 — Planetary waves

| Fig. | Type | Topic (our words) | Data / how to reproduce |
|---|---|---|---|
| 16.1 | ANA | parameters: uniform flow, critical line |  |
| 16.2 | ANA | group velocity, turning latitude |  |
| 16.3 | ANA | parameters: broad jet |  |
| 16.4 | ANA | group velocity, critical line |  |
| 16.5 | SCH | Rossby-wave critical layer |  |
| 16.6 | ANA | propagating vs evanescent boundary (Charney-Drazin) |  |
| 16.7 | SCH | upward Rossby wave phase tilt |  |
| 16.8 | ANA | two vertical wind profiles |  |
| 16.9 | ANA | vertical propagation to turning line |  |
| 16.10 | ANA | vertical propagation to critical line |  |
| 16.11 | ANA | response to Gaussian ridge vs sinusoid |  |
| 16.12 | ANA | Charney-Eliassen with Earth topography at 45N | ETOPO 2022 (or NE/GEBCO) zonal profile at 45N, smoothed; compare observed stationary 500 hPa height (NCEP/ERA5) |
| 16.13 | ANA | Charney-Eliassen split into contributions | as 16.12 |
| 16.14 | ANA | Rossby wave train from delta ridge |  |
| 16.15 | GCM | baroclinic response to tropical heat source | reduced: linear baroclinic model on sphere, or illustrative |
| 16.16 | GCM | response to mid-latitude heat source | as 16.15 |
| 16.17 | SEC | observed DJF stationary streamfunction 300 hPa (+ linear model) | left: reanalysis u,v 300 hPa DJF -> `windspharm` streamfunction, remove zonal mean; right: linear stationary-wave model (GCM-like, labelled illustrative) |
| 16.18 | ANA | Rossby rays from point source in observed 300 hPa wind | ray tracing on DJF zonal-mean (or 2-D) 300 hPa u from NCEP/ERA5 |
| 16.19 | SIM | linear response to circular mountain | linear barotropic vorticity model on sphere, observed basic state |

## Chapter 17 — Stratosphere

| Fig. | Type | Topic (our words) | Data / how to reproduce |
|---|---|---|---|
| 17.1 | GCM | zonal-mean radiative-equilibrium T, Jan/Jul | illustrative: Held-Suarez-type T_eq plus stratospheric profile, or column radiative code (`climlab` grey/RRTMG) per latitude |
| 17.2 | SEC | zonal-mean T and u to 100 km, January | CIRA-86 (CEDA, free login) or NRLMSIS (`pymsis`) for T + gradient-wind u; ERA5/MERRA-2 below 1/0.01 hPa |
| 17.3 | MAP | geopotential at 1000/500/200/20 hPa, 1 Feb 2000 | NCEP R1 daily `hgt.2000.nc` (or ERA5 ARCO); NorthPolarStereo |
| 17.4 | MAP | advected PV tracer, lower stratosphere 1992 | reconstruct: contour/semi-Lagrangian advection of ERA5 450-475 K PV with ERA5 winds for 12 days (SIM on data) |
| 17.5 | MAP | PV on 310 K and 475 K, 19 Jan 2005 | ERA5 PV,T on pressure (ARCO/WB2) -> interpolate to theta; NorthPolarStereo |
| 17.6 | SEC | stratospheric residual streamfunction (TEM) | reanalysis daily u,v,T -> TEM residual psi*; 4 seasons |
| 17.7 | SCH | Brewer-Dobson residual circulation cartoon |  |
| 17.8 | SCH | upward gravity-wave phase relations |  |
| 17.9 | ANA | equatorial wave dispersion in m-k space |  |
| 17.10 | SEC | EP flux + u, NH summer/winter | as 15.18 but to 1 hPa (ERA5) |
| 17.11 | SCH | downward control cartoon |  |
| 17.12 | ANA | zonally symmetric response to westward force | linear 2-D (lat-z) TEM model, frequency-dependent |
| 17.13 ★ | SEC | QBO time-height, 1979-2010 (+deseasonalised) | ERA5 monthly u (CDS) 5S-5N, 1000-1 hPa; MERRA-2 to 0.1 hPa (Earthdata); FU Berlin for check |
| 17.14 | SEC | QBO and SAO amplitude lat-height | same data; band-pass (QBO 20-40 mo, SAO 6 mo) then RMS |
| 17.15 | SCH | QBO initial instability schema |  |
| 17.16 | SCH | QBO cycle schema |  |
| 17.17 | SIM | 1-D QBO model, u at two levels | Plumb/Holton-Lindzen 1-D PDE, method of lines |
| 17.18 ★ | SIM | 1-D QBO model, time-height | same |
| 17.19 | SIM | 1-D QBO model u profiles | same |
| 17.20 | SIM | 1-D QBO with Rossby absorption variant | same, extra wave |
| 17.21 ★ | SEC | QBO 2003-2016 and 2016 disruption | FU Berlin `singapore.dat` (70-10 hPa) + ERA5 monthly 100-10 hPa |
| 17.22 ★ | SEC | 3-D polar vortex PV isosurface, Dec 1984 | ERA5 PV (ARCO, 6-hourly) -> theta levels 400-850 K -> Lait-scaled Q*; plotly/pyvista isosurface |
| 17.23 ★ | SEC | 3-D height-anomaly isosurfaces: 1984 displacement, 1979 split | ERA5 Z 200-10 hPa daily anomaly vs 1981-2010 daily climatology; plotly isosurface on polar-stereo grid |
| 17.24 | SCH | SSW wave-mean flow schema |  |
| 17.25 ★ | GCM | SSW composite: u anomaly + EP-flux arrows (3-D), T slices | reanalysis composite over SSW central dates (Butler et al. compendium / Charlton-Polvani on NCEP R1 or ERA5 daily); EP flux anomalies; plotly |
| 17.26 | SIM | Holton-Mass model u evolution | Holton-Mass (1976) 1-D/2-D model |
| 17.27 | SIM | Holton-Mass wave streamfunction | same |

## Chapter 18 — Water vapour and tropics

| Fig. | Type | Topic (our words) | Data / how to reproduce |
|---|---|---|---|
| 18.1 | ANA | saturation vapour pressure, CC vs empirical | analytic + Bolton/`metpy.calc.saturation_vapor_pressure` |
| 18.2 | SEC | zonal-mean specific humidity (log scale), JJA/DJF 2008 | AIRS L3 (GES DISC, Earthdata) or ERA5 q (WB2 climatology / CDS monthly) |
| 18.3 ★ | SEC | zonal-mean RH with theta_e contours, JJA/DJF | ERA5 (WB2 6-hourly climatology 1990-2019, anonymous) or AIRS; `metpy` theta_e |
| 18.4 | SEC | RH along theta_e isolines (DJF) | same as 18.3 |
| 18.5 | SIM | 1-D diffusion-condensation steady state |  |
| 18.6 | SIM | diffusion-condensation with cold trap |  |
| 18.7 | MAP | annual RH at 925 hPa | ERA5 RH (WB2 climatology) or NCEP R1 `rhum.mon.mean`; Robinson |
| 18.8 | SIM | stochastic advection-condensation, one cell | Lagrangian/Eulerian tracer with condensation |
| 18.9 | SIM | advection-condensation, larger diffusivity |  |
| 18.10 | SIM | stochastic advection-condensation RH |  |
| 18.11 | SIM | RH for small/large diffusivity |  |
| 18.12 ★ | MAP | RH 500 hPa + height, 9 Feb 2015 | NCEP R1 daily `rhum.2015`,`hgt.2015` or ERA5 ARCO 2015-02-09; Robinson |
| 18.13 ★ | SIM | 2-D advection-diffusion-condensation snapshot | own numpy model |
| 18.14 | SCH | small convection in large-scale flow |  |
| 18.15 | ANA | saturated adiabatic lapse rate in p-T |  |
| 18.16 | SCH | conditional instability |  |
| 18.17 | SCH | moist convective adjustment |  |
| 18.18 | ANA | grey radiative-equilibrium profiles |  |
| 18.19 | ANA | radiative-convective equilibrium | grey RCE column (`climlab` or own) |
| 18.20 | ANA | solar absorption band effect |  |
| 18.21 | ANA | tropopause height vs lapse rate, optical depth |  |
| 18.22 ★ | MAP | 500 hPa height, T, u, 9 Feb 2015 | NCEP R1 daily (`hgt/air/uwnd.2015`) or ERA5 ARCO; Robinson |
| 18.23 ★ | SEC | Wheeler-Kiladis wavenumber-frequency spectrum | NOAA interpolated daily OLR (PSL, anonymous); sym/antisym FFT + background |
| 18.24 | SEC | MJO composite OLR + streamfunction | NOAA OLR + NCEP R1 200/850 hPa winds; RMM phases (BoM index); `windspharm` |

## Chapter 19 — Wind-driven gyres

| Fig. | Type | Topic (our words) | Data / how to reproduce |
|---|---|---|---|
| 19.1 | MAP | global SST climatology | WOA23 0-m annual T (or NOAA OISST v2.1 climatology); Robinson |
| 19.2 | SCH | idealised global gyres and currents (labels) | own schematic over Natural Earth coastlines |
| 19.3 | MAP | N Atlantic 75 m velocity + barotropic streamfunction (state estimate) | ECCO V4r4 (Earthdata) UVEL/VVEL at 75 m, barotropic psi; PlateCarree/LambertConformal |
| 19.4 ★ | MAP | global barotropic streamfunction (state estimate) | ECCO V4r4 vertically integrated transport -> psi; Robinson |
| 19.5 | ANA | two Sverdrup solutions for a stress |  |
| 19.6 | ANA | Stommel single/double gyre |  |
| 19.7 | ANA | Stommel vs Munk solutions |  |
| 19.8 ★ | SIM | Stommel-Munk solve for N Atlantic, observed winds | wind stress climatology (NCEP R1 uflx/vflx or ERA5 or SCOW) + ETOPO coast mask; sparse solve |
| 19.9 | ANA | Stommel with linear stress |  |
| 19.10 | ANA | nonlinear perturbation to Stommel |  |
| 19.11 | SIM | nonlinear Stommel/Munk (Newton) |  |
| 19.12 | SCH | inertial boundary layers |  |
| 19.13 | ANA | Fofonoff free mode |  |
| 19.14 | ANA | beta-plume Green function |  |
| 19.15 | ANA | two-gyre Sverdrup over f/h contours |  |
| 19.16 | SIM | two-gyre homogeneous model, flat vs sloping |  |

## Chapter 20 — Upper ocean structure

| Fig. | Type | Topic (our words) | Data / how to reproduce |
|---|---|---|---|
| 20.1 | ANA | PV contours q = beta y + A psi_B |  |
| 20.2 | ANA | upper/lower PV and streamfunction (Rhines-Young) |  |
| 20.3 | ANA | PV homogenisation solutions |  |
| 20.4 ★ | MAP | PV f d(rho)/dz on isopycnals, Pacific and Indian | WOA23 or MIMOC T,S -> `gsw` sigma0/sigma2, N^2 -> interpolate to sigma surfaces; Orthographic |
| 20.5 ★ | MAP | PV on isopycnals, Atlantic (MIMOC, January) | MIMOC isopycnal grid (pressure on sigma0) -> layer thickness h -> |f| d_sigma/(rho h); Orthographic |
| 20.6 | SEC | PV vs latitude at sigma0 26.5, Atlantic and Pacific | same data, meridional sections |
| 20.7 | SEC | Pacific PV along dateline on several sigma | same data |
| 20.8 | SEC | N Atlantic density sections (53W and zonal) | WOA23 annual T,S -> `gsw.sigma0` |
| 20.9 | SEC | mean temperature profiles, N Pacific and Atlantic | WOA23 (or WOCE climatology via WOA) station profiles |
| 20.10 | SCH | single-cell MOC cartoon |  |
| 20.11 | SCH | thermocline scaling |  |
| 20.12 | ANA | 1-D thermocline ODE solutions | `solve_bvp` |
| 20.13 | ANA | 1-D thermocline, no Ekman pumping | `solve_bvp` |
| 20.14 | SCH | internal thermocline boundary layer |  |
| 20.15 | SCH | single-hemisphere thermocline idealisation |  |
| 20.16 | SCH | reduced-gravity single layer |  |
| 20.17 | SCH | ventilated thermocline layers |  |
| 20.18 | ANA | LPS ventilated thermocline thicknesses |  |
| 20.19 | SCH | shadow zone |  |
| 20.20 | ANA | LPS N-S thickness sections |  |
| 20.21 | ANA | LPS with different outcrop |  |
| 20.22 | ANA | pool regions, three moving layers |  |
| 20.23 | SCH | multi-layer notation |  |

## Chapter 21 — MOC and ACC

| Fig. | Type | Topic (our words) | Data / how to reproduce |
|---|---|---|---|
| 21.1 ★ | SEC | Atlantic MOC streamfunction (Sv) | ECCO V4r4 basin MOC (`ecco_v4_py.calc_meridional_stf`, Atlantic mask); RAPID 26N as check |
| 21.2 | SEC | Atlantic zonal-mean sigma_theta (split depth axis) | WOA23 annual T,S -> `gsw.sigma0`, Atlantic basin mask |
| 21.3 | SCH | sideways (horizontal) convection set-up |  |
| 21.4 ★ | SIM | 2-D sideways convection, Ra 1e6 and 1e9 | Dedalus v3 (Colab/WSL) or own vorticity-streamfunction solver |
| 21.5 | SCH | parcel interchange |  |
| 21.6 | SCH | Stommel two-box model |  |
| 21.7 | ANA | two-box graphical solution, hysteresis |  |
| 21.8 | SCH | three-box model |  |
| 21.9 | ANA | three-box solutions | `solve_ivp` |
| 21.10 | SCH | Stommel-Arons-Faller tank |  |
| 21.11 | ANA | flow in rotating sector experiments |  |
| 21.12 | SCH | Stommel-Arons abyssal model structure |  |
| 21.13 | ANA | Stommel-Arons in sphere vs rectangle |  |
| 21.14 | SCH | abyssal mass budget |  |
| 21.15 | SCH | Stommel-Arons single sector |  |
| 21.16 | SCH | Stommel-Arons two hemispheres |  |
| 21.17 | MAP | N Atlantic currents at 2500 m (DWBC) | ECCO V4r4 UVEL/VVEL at 2500 m; quiver/speed |
| 21.18 ★ | SEC | global overturning: residual (density-space) vs Eulerian | ECCO V4r4: Eulerian depth MOC + GM bolus -> residual; density-space MOC remapped to depth |
| 21.19 | SCH | idealised Southern Ocean geometry |  |
| 21.20 | ANA | surface buoyancy, Ekman velocities, streamlines |  |
| 21.21 | ANA | single-hemisphere MOC model section |  |
| 21.22 | ANA | two-hemisphere MOC model section |  |
| 21.23 ★ | MAP | Southern Ocean currents, gyres and fronts | Natural Earth + ETOPO/GEBCO + Orsi (AADC) / Park-Durand (SEANOE) fronts + own arrows; SouthPolarStereo |
| 21.24 | GCM | eddying channel PE model zonal-mean T | illustrative: zonally averaged residual-mean channel model, or idealised QG channel run |
| 21.25 | SCH | eddy fluxes and form drag in channel |  |
| 21.26 | SCH | standing eddy meridional flow |  |
| 21.27 | ANA | Eulerian, bolus, residual streamfunctions in channel | idealised analytic streamfunctions |
| 21.28 | SEC | neutral density at 25W, Atlantic | WOA23 T,S (or GLODAPv2 mapped) -> gamma^n (`pygamma`/`neutralocean`; else sigma2/sigma4 labelled) |
| 21.29 | SEC | Atlantic and Pacific overturning | ECCO V4r4 basin MOC (Atlantic, Indo-Pacific masks) |
| 21.30 | SCH | global overturning processes |  |
| 21.31 | ANA | single-hemisphere MOC model (AABW cell) |  |
| 21.32 | ANA | interhemispheric MOC model |  |
| 21.33 | SCH | northern-region thermal wind in MOC model |  |

## Chapter 22 — Equatorial circulation and ENSO

| Fig. | Type | Topic (our words) | Data / how to reproduce |
|---|---|---|---|
| 22.1 | SEC | equatorial zonal-current sections (Pac, Atl, Ind) | NOAA GODAS `ucur` (PSL, anonymous) or ECCO V4r4; lat-depth at chosen longitudes |
| 22.2 | MAP | Pacific vertically integrated zonal transport: obs vs Sverdrup | ECCO/GODAS transport vs Sverdrup from NCEP/ERA5 wind stress |
| 22.3 | SCH | equatorial Sverdrup flow |  |
| 22.4 | ANA | three idealised wind profiles + transports |  |
| 22.5 | ANA | undercurrent profiles: drag vs viscosity |  |
| 22.6 | ANA | vertical profile of equatorial current |  |
| 22.7 | SEC | equatorial density sections + d(sigma)/dz | WOA23 annual T,S along equator -> `gsw` |
| 22.8 | SCH | local undercurrent zonal section |  |
| 22.9 | ANA | absolute-vorticity-conserving zonal current |  |
| 22.10 | SCH | streamlines feeding undercurrent |  |
| 22.11 | SIM | inertial undercurrent streamlines |  |
| 22.12 | SIM | nondimensional undercurrent solutions | `solve_bvp` |
| 22.13 | MAP | December SST 1996, 1997 and difference | NOAA OISST v2 monthly or ERSST v5 (PSL); Pacific PlateCarree |
| 22.14 | SEC | Nino-3 SST and -SOI time series | PSL `nina3.anom.data` / ERSST box mean; CPC SOI |
| 22.15 | SEC | 2015-16 ENSO Hovmollers: upper-300 m T, surface u | GODAS `pottmp` + NCEP R1/ERA5 surface wind, 2S-2N |
| 22.16 | SCH | ENSO end-member cross-sections |  |
| 22.17 | ANA | Matsuno-Gill for normal vs El Nino heating |  |
| 22.18 | SIM | equatorial beta-plane SW, Gaussian hump | linear SW finite-difference |
| 22.19 | SCH | wind-anomaly-induced Kelvin/Rossby waves |  |
| 22.20 | ANA | delayed-oscillator stability regime |  |
| 22.21 | SIM | delayed-oscillator time series | DDE stepping (own) / `ddeint` |
| 22.22 | SIM | SW thermocline response to wind | linear SW |
| 22.23 | SIM | recharge: h_E, h_W and wind | same |
