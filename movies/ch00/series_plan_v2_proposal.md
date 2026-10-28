# Chapter 0 movie series — plan v2 (APPROVED by the user, 2026-10-27: "I will go with your suggestions")

User request (2026-10-27): separate, very detailed from-scratch movies for every major maths term (Kundu's index),
every major atmospheric-science, meteorology, climate and ocean concept (cyclones, ocean currents, baroclinic vs
barotropic, skew-T …), in an order where each movie only uses what earlier movies taught; similar simple ideas may share
a movie; real data, indices and animation everywhere (ENSO and the other modes especially); generated sounds where they
fit; **reading weather maps comes last**, after all the major topics.

Every movie: built step by step from scratch; real maps (static, animated, 3-D globes, Cesium drapes, flights,
before/after sliders, data animation); best data + tool per visual; cartography skill; own music style + sound effects
where the picture shows them; latest data + history + cited impacts; house style; ≥ 2 reviews; Drive link.

## Order (each movie may use only the movies above it)

### Stage 0 · already made or in progress
| # | Movie | State |
|---|---|---|
| 0.1 | Dot product | done |
| 0.2 | Cross product (full, 48 min) | done |
| 0.3 | Weather basics (pressure, temperature, humidity, wind, highs/lows, fronts intro, reanalysis) | building |

### Stage 1 · The maths toolkit (Kundu's index, in dependency order)
| # | Movie | Kundu index terms covered |
|---|---|---|
| 1 | Vectors, components and index notation | scalars, vectors, components, Einstein summation, Kronecker delta, alternating tensor, epsilon–delta relation, triple products |
| 2 | The cross product (split 1, standalone) | cross product (from the final movie, review-3 fixes) |
| 3 | The cross product in physics (split 2) | torque, angular momentum, qv × B, Ω × r |
| 4 | Derivatives and Taylor series | partial derivatives, chain rule, perfect differential, Taylor series, linearisation |
| 5 | Coordinates: on a plane, a cylinder and a sphere | polar, cylindrical, spherical, curvilinear coordinates, rotation of axes, Galilean transformation, lat/lon geometry |
| 6 | The gradient | gradient operator, directional derivative, pressure and temperature gradients |
| 6A | **Contour maps and isolines** | what an isoline is; isobars, isotherms, isohyets, isotachs, isohypses, terrain contours, ocean isobaths and isopycnals on real maps; contour interval; why crowded lines mean a strong gradient; highs, lows, ridges, troughs, saddles (cols) read from contours |
| 6B | **How contour maps are made** | from stations to a grid (interpolation: nearest, inverse distance, objective analysis, data assimilation/reanalysis in plain words); contouring (marching squares), smoothing, labelling; artefacts and how to spot them; real station data vs ERA5 |
| 7 | Divergence, flux and Gauss's theorem | divergence, flux divergence, solenoidal vector, Gauss theorem |
| 8 | Curl, circulation and Stokes's theorem | curl, circulation, Stokes theorem, irrotational vector, solid-body rotation, rotation |
| 9 | The Laplacian, Laplace and Poisson equations | Laplacian, Laplace equation, harmonic function, Poisson equation |
| 10 | Riding with the flow: the material derivative | material / advective / particle / substantial derivative, Leibniz theorem, time derivatives of volume integrals (Reynolds transport), continuity |
| 10A | Vector identities I: ∇ with dot and cross | product rules ∇(fg), ∇·(fA), ∇×(fA), ∇·(A×B), ∇×(A×B), ∇(A·B); div curl = 0, curl grad = 0; every one tied to a weather/climate field |
| 10B | Vector identities II: the advection term and its relatives | (u·∇)u, u·∇T, ∇(|u|²/2) − u×ω (Lamb vector), ∇×(∇×u) = ∇(∇·u) − ∇²u, ∇·(ρu), Ω×(Ω×r); reading these 'scary' expressions term by term on real fields |
| 11 | Tensors made easy | second-order tensors, symmetric and antisymmetric, isotropic tensors, eigenvalues and eigenvectors, velocity-gradient, strain-rate and rotation tensors, stress tensor |
| 12 | Dimensional analysis, scaling and similarity | dimensional homogeneity, Buckingham Π, dimensional matrix, nondimensional parameters, dynamic similarity, order of magnitude (Rossby number preview) |
| 13 | Ordinary differential equations | growth/decay, the oscillator, phase space, matrix equations |
| 14 | Partial differential equations | diffusion, wave and Laplace equations, separation of variables, characteristics |
| 15 | Fourier series, transforms and spectra | Fourier, spectrum |
| 16 | Waves: phase, dispersion and group velocity | phase propagation, dispersion, group velocity |
| 17 | Potentials and the stream function | velocity potential, stream function, force potential, Helmholtz decomposition |
| 18 | Complex variables and conformal mapping | complex variables, complex potential, Cauchy–Riemann, conformal mapping, sources, sinks, doublets, line vortex |
| 19 | Perturbation methods | perturbation techniques, regular and singular perturbation, asymptotic expansion, similarity solutions |
| 20 | Stability and eigenvalue problems | stability, normal modes, instability (general) |
| 21 | Statistics of fields | averages (Reynolds, ensemble), anomalies and climatologies, correlation, autocorrelation, cross-correlation, spectra, indices |

### Stage 2 · Atmosphere physics
| # | Movie |
|---|---|
| 22 | The climate machine: energy balance, albedo, greenhouse effect, equator-to-pole surplus (CERES) |
| 23 | Air and seawater: equations of state, hydrostatic balance with height and depth |
| 23A | **Pressure as a vertical coordinate; constant-pressure charts** | why meteorologists use pressure instead of height; isobaric surfaces in 3-D on real data; how a constant-pressure chart differs from a constant-height chart |
| 23B | **Geopotential and geopotential height** | geopotential Φ, Z = Φ/g₀, why not plain height, units (m, dam), the real ERA5 500 hPa surface as a 3-D sheet; ridges and troughs as hills and valleys |
| 23C | **The standard pressure levels and what each shows** | 1000/925/850/700/500/300/250/200 hPa: typical heights, what forecasters read on each (fronts at 850, waves at 500, jets at 250), real charts for each |
| 23D | **Cross-sections and Hovmöller diagrams** | vertical cross-sections through real fronts and jets; time–longitude (Hovmöller) diagrams of real waves; how to read them |
| 24 | Atmospheric thermodynamics: first law, potential temperature, dry and moist lapse rates |
| 24A | **Isentropic surfaces and isentropic maps** | surfaces of constant potential temperature on real data, why air moves along them, isentropic charts |
| 25 | Stability, buoyancy and convection: Brunt–Väisälä frequency, stable/unstable/neutral |
| 26 | Water in the air: humidity measures, Clausius–Clapeyron, LCL, CAPE and CIN, how clouds and rain form |
| 27 | **The skew-T log-P diagram, in full detail** (every line, parcel theory, LCL/LFC/EL, CAPE/CIN, inversions, real soundings) |
| 28 | Clouds and cloud types (real satellite and ground imagery) |

### Stage 3 · Rotation and balanced flow
| # | Movie |
|---|---|
| 29 | The Coriolis effect (easy examples → 3-D Earth → maps; every equation from scratch) |
| 29A | **From F = ma to the atmosphere's equation of motion** (user, 2026-10-27; long, 45–60 min) | Newton's second law per unit mass; the forces one by one with real fields: pressure-gradient force −(1/ρ)∇p, gravity, friction/viscosity; the material derivative Du/Dt; moving into the rotating frame → Coriolis −2Ω×u and centrifugal (absorbed into effective gravity g); the full vector equation Du/Dt = −(1/ρ)∇p − 2Ω×u + g + F; its u, v, w components in local east/north/up coordinates, including the spherical curvature (metric) terms (uv tanφ/a, uw/a …) and the 2Ω cos φ terms; scale analysis on real data showing which terms matter (hydrostatic vertical balance, nearly geostrophic horizontal balance), leading to the primitive equations; every term sized with real ERA5 numbers and drawn on real maps. Uses #4, #5, #6, #10, #10A/B, #12, #23, #29; points forward to #30 geostrophic, #31 Ekman, #34 vorticity. |
| 30 | Geostrophic and ageostrophic wind; gradient, cyclostrophic and inertial flow |
| 31 | Friction and Ekman layers (air and ocean) |
| 32 | Thickness, the hypsometric equation and the thermal wind |
| 33 | **Barotropic vs baroclinic** |
| 34 | Vorticity, circulation and potential vorticity |
| 35 | Divergence and vertical motion (quasi-geostrophic intuition) |
| 36 | Geostrophic adjustment and the Rossby radius |

### Stage 4 · Waves
| # | Movie |
|---|---|
| 37 | Gravity waves and mountain waves |
| 38 | Rossby waves and blocking |
| 39 | Equatorial waves and the MJO |

### Stage 5 · Weather systems
| # | Movie |
|---|---|
| 40 | Air masses and fronts in depth; frontogenesis |
| 41 | **Baroclinic instability** (and barotropic instability) |
| 42 | **Extratropical cyclones**: how they form, life cycle, bomb cyclones (Ciarán and latest storms) |
| 43 | Jet streams and storm tracks |
| 44 | Thunderstorms, severe weather and tornadoes |
| 45 | **Tropical cyclones**: how they form, structure, intensity, real storms and impacts |
| 46 | Monsoons |
| 47 | The atmospheric boundary layer and turbulence |

### Stage 6 · The global atmosphere
| # | Movie |
|---|---|
| 48 | The general circulation: Hadley, Ferrel and polar cells, subtropical highs, ITCZ, trades and westerlies |
| 49 | The stratosphere: ozone, polar vortex, sudden warmings, QBO |
| 50 | Water vapour and the tropics |

### Stage 7 · The ocean
| # | Movie |
|---|---|
| 51 | The upper ocean: temperature, salinity, density, mixed layer, thermocline |
| 52 | Wind-driven gyres: Sverdrup balance and western intensification |
| 53 | Great currents I: Gulf Stream and Kuroshio |
| 54 | Great currents II: Agulhas, Brazil–Malvinas, East Australian |
| 55 | Great currents III: eastern boundary currents and upwelling (California, Humboldt, Canary, Benguela) |
| 56 | Equatorial currents and the undercurrent; the Somali current and the monsoon |
| 57 | The Antarctic Circumpolar Current and the Southern Ocean |
| 58 | The overturning circulation: AMOC, deep-water formation |
| 59 | Ocean eddies and mesoscale turbulence |
| 60 | Surface waves, tsunamis and tides |
| 61 | Sea level and sea ice |

### Stage 8 · Climate variability and change (real data, indices, animation, history, impacts)
| # | Movie |
|---|---|
| 62 | **ENSO** (latest SST and index, map, 3-D animation, comparison with past big events, deadliness, impacts) |
| 63 | Indian Ocean Dipole |
| 64 | PDO and AMO |
| 65 | NAO and the Arctic Oscillation |
| 66 | Southern Annular Mode |
| 67 | Climate change: forcing, feedbacks, observed warming |
| 68 | Extremes: heatwaves, droughts, floods |

### Stage 9 · Synthesis
| # | Movie |
|---|---|
| 69 | **Reading weather maps, in full detail** (everything above applied; data already fetched and frozen) |

## Notes
- User (2026-10-28): enhance the dot-product and especially the cross-product movies with more intuition behind each part of the maths and more 'when is it used' cases with animation, inspired by https://www.youtube.com/watch?v=w4x7RLUizJ0 (ideas only, our own words and visuals; research in `research/xprod_video_intuitions.md`). Applied to #2/#3 (cross-product splits) and a new dot-product version 0.1b.
- #1 is split into #1a (vectors, adding/subtracting, index notation, Kronecker delta) and #1b (ε, cross product in index form, ε–δ, triple products) (2026-10-28, length 56 min).
- User (2026-10-27), 10A/10B: for every identity, say exactly WHERE it is used (which equation: continuity, momentum, vorticity, energy/Bernoulli, thermodynamic/advection, Coriolis and centrifugal terms, Ekman, QG/PV), what each term MEANS physically and what it REPRESENTS, with enough worked examples on real fields and maps.
- User (2026-10-27), cross-references in every movie: whenever a movie uses an operator or group of operators that another movie explains in depth (earlier OR later in the series), it points to that movie in a short spoken line ("we built this step by step in the divergence movie" / "we'll take this apart fully in the vector-identities movie") and lists it among the related movies on the end card. The movie still explains enough to stand on its own (the Coriolis movie still derives everything from scratch, now also pointing to the related movies). Pointers are spoken and on the end card only: no on-screen citations or equation labels (house style). Each storyboard gets a `related:` list per scene (movie #, slug, what it covers).
- User (2026-10-27): the divergence (#7), curl (#8) and vorticity (#34) movies are long ones, about 30 min each (not shortened).
- User (2026-10-27): every maths movie is tied to meteorology, atmospheric science or climate science (real fields, real maps); every movie shows enough worked examples and maps; skew-T, Coriolis, ENSO and map-reading movies may run longer (45–60 min).
- The old V1–V24 list is absorbed: V1 → 10, V2 → 23, V3 → 24–25, V4 → 12, V5 → 29, V6 → 30, V7 → 32, V8 → 36, V9 → 34,
  V10 → 31, V11 → 37, V12 → 38, V13 → 39, V14 → 41, V15 → 47/59, V16 → 48, V17 → 43, V18 → 49, V19 → 50, V20 → 52,
  V21 → 51, V22 → 57–58, V23 → 62, V24 → 63–66.
- F4 (reading weather maps) data and library work already done are kept for #5 (sphere geometry) and #69.
