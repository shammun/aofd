# R4 — Primers, the maths toolkit and map reading for the Vallis project

*Research note for the move from fluidpy (Kundu, Cohen & Dowling) to Vallis, **Atmospheric and Oceanic Fluid Dynamics**
(2nd ed., CUP 2017). Written 2026-10-20. It covers (a) a new **Chapter 0: the maths and map-reading toolkit**, (b)
plain-language mechanism explainers for readers with no climate background, and (c) changes to the `teaching-style`
skill and the `lesson-reviewer` checklist. It starts from what fluidpy already does: the `teaching-style` §1–§5 chain,
the `interactive-viz` §1/§4 contract, 396 primers in `knowledge/primers.md`, and the Ch. 2 explainers
`gauss_flux_box.html` and `stokes_circulation_loop.html`. Those set the depth bar that Chapter 0 has to match.*

---

## 0. What the best explainers do (sources and the lesson taken from each)

| Source | What they do well | What we take |
|---|---|---|
| 3Blue1Brown, *Divergence and curl* (Grant Sanderson, 2018) — https://www.3blue1brown.com/lessons/divergence-and-curl | Starts with a **fluid picture** (particles flowing out of a point, a twig spinning) and only then writes the formula. Gives each symbol a meaning in the picture. Shows that ∂Q/∂x − ∂P/∂y is "how much the flow on the right goes up minus how much the flow on the top goes right". | **The picture comes before the operator.** Each partial derivative inside div or curl is lit up on the picture as "this arrow minus that arrow". |
| 3Blue1Brown, *Essence of linear algebra / calculus* — https://www.3blue1brown.com | One idea per episode. A recurring visual vocabulary (yellow for one vector, green for the other). Asks "pause and ponder" questions *before* giving the answer. | **Colour stays the same across the whole chapter. Ask for a prediction before revealing anything.** |
| BetterExplained (Kalid Azad), *ADEPT method* — https://betterexplained.com/articles/adept-method/ ; *Vector calculus: understanding divergence* — https://betterexplained.com/articles/divergence/ | ADEPT means **A**nalogy → **D**iagram → **E**xample → **P**lain English → **T**echnical definition. Divergence is explained as "outgoingness", with a density-change analogy. | ADEPT fits on top of our problem → idea → maths → code → output chain. We add the **Analogy** step (with where it fails) to every Chapter 0 tool. |
| Bret Victor, *Explorable Explanations* (2011) — https://worrydream.com/ExplorableExplanations/ ; *Up and Down the Ladder of Abstraction* — https://worrydream.com/LadderOfAbstraction/ ; *Kill Math* — https://worrydream.com/KillMath/ | "Reactive documents": you drag a number in a sentence and every consequence updates. The **ladder of abstraction** goes from one concrete case, to a whole family of cases (a parameter sweep), to the general rule. Symbols are tied to things you can manipulate. | **Numbers you can drag inside the Explain text. Every explainer climbs the ladder: one case → a sweep over a parameter → the rule.** |
| Distill: Olah & Carter, *Research Debt* (2017) — https://distill.pub/2017/research-debt/ | "Research debt" is the pile of poor exposition and bad notation that every newcomer has to pay off alone. *Distillation* is the work of paying it off. Good notation and good diagrams are research outputs in their own right. | Chapter 0 is distillation: a **symbol atlas** and figure-reading cards pay off the notation debt once, so that later chapters don't keep paying it. |
| Seeing Theory (Brown Univ., D. Kunin et al.) — https://seeing-theory.brown.edu/ | Probability taught entirely through small direct-manipulation canvases, with the text next to the canvas and very little of it. | Short text beside a large canvas. One manipulation per concept. |
| Nicky Case, explorables — https://ncase.me/ ; the Explorable Explanations hub — https://explorabl.es/ | Playable systems (*Parable of the Polygons*, *The Evolution of Trust*). Prediction before play. A sandbox at the end. | **The last walkthrough step hands over a sandbox plus a challenge.** We already do this; Chapter 0 keeps it. |
| MIT *Weather in a Tank* (Illari & Marshall) — https://weathertank.mit.edu/ ; the Marshall & Plumb experiments — https://marshallplumb.mit.edu/experiments ; MIT News 2010 — https://news.mit.edu/2010/weather-tank-0317 | Rotating-tank experiments (Taylor columns, thermal wind, the Hadley regime, baroclinic eddies, gyres) are put **next to real atmospheric data**. A study of 700+ students at several universities found better gains in small lab groups. | **Every mechanism pairs the tank (the idealised physics) with the planet (a data figure).** The "tank ↔ Earth" twin view becomes a standard mode. |
| Marshall & Plumb, *Atmosphere, Ocean and Climate Dynamics: An Introductory Text* (2007) ; MIT 12.003 OCW — https://ocw.mit.edu/courses/12-003-atmosphere-ocean-and-climate-dynamics-fall-2008/ | Observations come first (a zonal-mean T section, a 500 hPa map), then the balance that explains them, then a tank demonstration. Heavy use of annotated data figures. Mathematics is kept to one balance at a time. | **Story → picture → one equation → number.** This is the order of our mechanism pattern (§4). |
| Vallis, *Essentials of Atmospheric and Oceanic Dynamics* (2019) and his older AOFD lecture notes (https://www.princeton.edu/~gkv/aofd, archived) | The author's own shorter route. Every chapter opens with the scaling argument and keeps the "dimensional analysis → balance" habit. | Teach **scaling and nondimensional numbers in Chapter 0**, because Vallis uses them on nearly every page. |
| COMET MetEd (UCAR) — https://www.meted.ucar.edu/ (free, needs registration) | Forecaster-training modules: annotated loops of weather maps, "what do you see?" questions on real charts, and step-by-step reading of skew-T diagrams and cross-sections. | **The "how to read this figure" card (§3)**: question-driven reading of a real chart before any interpretation. |
| NASA Earth Observatory, *How to interpret common false-colour images* — https://earthobservatory.nasa.gov/features/FalseColor/page6.php | Explains what each colour encodes *before* showing the picture, and gives a key for each band combination. | **Reading the encoding (colour → quantity) comes first.** |
| NOAA Climate.gov ENSO blog — https://www.climate.gov/news-features/blogs/enso/10-years-enso-blog ; polar vortex blog — https://www.climate.gov/news-features/blogs/polar-vortex/predicting-chances-polar-vortex-disruption-winter ; SST/OLR anomaly figure — https://www.climate.gov/media/12842 | Captions written for the public: "red = warmer than average", what the axes are (depth vs longitude), what "anomaly" is measured against. Conversational, numbers with units, honest about uncertainty. | Our caption style for anomaly maps and cross-sections. **Always say what the anomaly is relative to (the base period).** |
| Crameri, Shephard & Heron (2020), *The misuse of colour in science communication*, Nat. Commun. 11, 5444 — https://doi.org/10.1038/s41467-020-19160-7 ; colour maps — https://www.fabiocrameri.ch/colourmaps ; cmocean (Thyng et al. 2016) — https://matplotlib.org/cmocean/ | Rainbow ("jet") colour maps invent features and hide others, and they fail for colour-blind readers. Use perceptually uniform maps, and diverging maps centred on zero for anomalies. | The house colour rule (§3.4). One explainer (E10) **shows why jet misleads**. |
| Wheeler & Kiladis (1999), JAS 56, 374–399 — https://www.meteo.physik.uni-muenchen.de/~roger/Lectures/TropicalMetweb/Literature/JAS_1999_Wheeler&Kiladis.pdf | The canonical wavenumber–frequency figure: the raw spectrum divided by a smoothed background, with shallow-water dispersion curves for equivalent depths of about 12–50 m drawn on top. | The basis for explainer E12 and the "spectrum" reading card. |

**Six principles distilled from these sources.** These are the core of §1.
1. A concrete case comes before the abstraction. One case, then a sweep over a parameter, then the rule (Victor's ladder).
2. Introduce one symbol at a time, each tied to something visible on screen (3B1B, Distill).
3. Ask for a prediction before revealing (3B1B "pause and ponder", Nicky Case).
4. Explain the encoding first: say what colour, contour and arrow mean before saying what they show (Earth Observatory, MetEd).
5. Pair the idealised experiment with the real planet (Weather in a Tank, Marshall & Plumb).
6. Name where an analogy breaks (BetterExplained ADEPT, adapted). An analogy without its failure case breeds misconceptions.

---

## 1. Principles for making frightening equations intuitive

### 1.1 Concrete before abstract
- Open on **a scene with numbers**: "a 10 m/s wind blows over 1000 km of ocean at 45°N". The symbols come only after
  the reader has met the quantities. In the notebook, the 🧩 block's *problem* paragraph has to contain at least one
  number with a unit.
- Climb **Victor's ladder** in the explainer:
  - rung 1 is one fixed case (the walkthrough, steps 1–2);
  - rung 2 sweeps one parameter and shows the whole family as faint curves with the current one in bold (we already
    use "faint whole + bold so-far");
  - rung 3 states the general rule (the Equations / Derivation tab).

### 1.2 One symbol at a time — the "symbol reveal"
- The walkthrough reveals an equation **term by term**. Step k fades term k in, gives it its colour and draws its
  arrow or bar on the canvas.
  - Example: $\frac{D\mathbf u}{Dt} + 2\boldsymbol\Omega\times\mathbf u = -\frac{1}{\rho}\nabla p + \mathbf F$ is built
    up in four steps: acceleration (teal), Coriolis (violet), pressure (orange), friction (rose).
- Every symbol has a **hover card**. It gives:
  - its name in words ("f — the Coriolis parameter");
  - its unit (s⁻¹);
  - a typical Earth value (1.0×10⁻⁴ s⁻¹ at 45°);
  - a one-line meaning ("how fast the local vertical spins, times 2");
  - where it was introduced (the symbol atlas entry, §2.3).

  A new `viz_lib.js` helper, `Viz.symbols(atlas)`, can attach these cards to KaTeX output by matching `\htmlId`
  (KaTeX supports `\htmlClass`/`\htmlId` with `trust: true`).

### 1.3 Equation anatomy (colour-coded, clickable)
- Every displayed balance gets an **anatomy strip** underneath it: one braced label per term, giving its plain name,
  its physical role ("pushes from high to low pressure") and its size on screen.
  The reference for this is `fid_formula_lab.html` (clickable terms).
- Colour is **global for the whole project**, not just per chapter. A proposed palette (to be added to
  `knowledge/viz_patterns.md`):

  | Term family | Colour |
  |---|---|
  | time tendency ∂/∂t | slate |
  | advection u·∇ | teal |
  | Coriolis / rotation | violet |
  | pressure gradient | orange |
  | gravity / buoyancy | brown |
  | friction / diffusion | rose |
  | forcing / heating | gold |
  | β / planetary vorticity gradient | indigo |

  The same colour is used in the notebook LaTeX (`\color{}`), the bars, the curves and the legend.

### 1.4 Term-by-term magnitude bars (scale analysis made visible)
- For every balance, show a bar per term on a **log scale**, computed from the reader's slider values (U, L, H, f, N,
  …). The bars are coloured as in §1.3 and labelled with the order of magnitude ("10⁻³ m s⁻²").
  - A **"dominant balance" badge** names the two largest terms ("geostrophic: Coriolis ≈ pressure, Ro = 0.1").
  - A **ratio readout** shows that each nondimensional number *is* a ratio of two bars (Ro = advection bar ÷ Coriolis bar).
- This is the single most valuable device for Vallis. His chapters on simplified equations, quasi-geostrophy and
  planetary geostrophy are scale analysis from start to finish. A bar chart turns "neglect small terms" from an act of
  faith into something the reader can see.

### 1.5 Sliders that animate each term
- Each term gets its own **toggle**: switch the Coriolis term off and the inertial circle turns into a straight line;
  switch friction off and the Ekman spiral stops turning.
- Use the "what if this term were missing?" mode: a **ghost** run with the term removed, drawn faintly next to the full
  run. We already have the "ghost reference" pattern; it should be generalised as `Viz.ghost(termId)`.

### 1.6 Physical analogy — and where it fails
Every analogy appears as a two-row card: **Like… / Unlike…**. Examples:

| Idea | Like… | Unlike… (where the analogy fails) |
|---|---|---|
| Coriolis | a ball rolled across a spinning merry-go-round curves | the curving is real only in the rotating frame, and on a sphere only the local vertical component of Ω matters for horizontal flow (f = 2Ω sin φ); at the equator it vanishes |
| Geostrophic wind | a marble rolling round a bowl at constant height | there is no acceleration in geostrophy; the "orbit" is a force balance, not a centripetal one (that is gradient-wind balance) |
| Divergence | a crowd leaving a stadium | divergence is per unit volume and local; a whole region can have zero divergence while air is moving fast |
| Potential vorticity | a figure skater pulling in her arms | PV is conserved only for adiabatic, frictionless flow, and it involves stratification as well as spin |

### 1.7 Failure cases and limits as first-class content
- Every tool ends with **"When it breaks"**. Examples:
  - Taylor linearisation fails when the amplitude is no longer small, and the explainer shows the error growing;
  - geostrophy fails near the equator (f → 0) and at small scales (Ro ~ 1);
  - the hydrostatic approximation fails when the aspect ratio H/L is not small.
- The magnitude bars (§1.4) show the failure directly: the neglected bar grows until it is as tall as the kept ones.

### 1.8 Numbers you can say out loud
- Use Earth constants with easy round values, and show the honest value next to them:

  | Constant | Easy value | Honest value |
  |---|---|---|
  | Ω | 7×10⁻⁵ s⁻¹ | 7.29×10⁻⁵ s⁻¹ |
  | a | 6400 km | 6371 km |
  | g | 10 m s⁻² | 9.81 m s⁻² |
  | f₀ | 10⁻⁴ s⁻¹ | 1.03×10⁻⁴ s⁻¹ at 45° |
  | N (atmosphere) | 10⁻² s⁻¹ | 0.01–0.02 s⁻¹ in the troposphere |
  | H (scale height) | 7 km | 7–8 km |
  | ρ (air / sea water) | 1 / 1000 kg m⁻³ | 1.2 / 1025 kg m⁻³ |

- Show every derived number twice: **"≈ 10 m/s (easy) | 9.6 m/s (exact)"**. This is the tiny-example rule (§1 step 4
  of the skill), applied to geophysics.

---

## 2. Proposed Chapter 0 — "the maths and map-reading toolkit"

Chapter 0 is **not a chapter of the book**. It is a prerequisite course. Its IDs are `C0-…` and its primers are
`P0-…`, so it does not collide with the Vallis numbering. Its explainers live in `viz/ch00/`. The notebook is
`notebooks/ch00_toolkit.ipynb` with a Colab twin. The cap is raised to **12–14 explainers** for this chapter only
(`book.yaml → chapters.ch00.max_explainers: 14`).

### 2.1 Sections (notebook outline)

| § | Section | Content (each tool: plain words → picture → small numbers → code → "when it breaks") |
|---|---|---|
| 0.1 | Reading guide and the symbol atlas | How to use this chapter; the atlas (§2.3); our colour language; units and powers of ten |
| 0.2 | Scalars, vectors, components | Arrows vs numbers; components in (x, y, z) = (east, north, up); unit vectors **i, j, k**; length |
| 0.3 | The dot product | Projection, "how much of a along b"; work; **u·∇T** as a preview; zero ⇔ perpendicular |
| 0.4 | The cross product and the right-hand rule | Area and normal; sign by the right-hand rule; **k×u** rotates u by 90° to the left; **f k×u**; Ω×(Ω×r) (centrifugal) |
| 0.5 | Combinations | a·(b×c) is a volume; a×(b×c) = b(a·c) − c(a·b) ("BAC−CAB"); (a·∇)b; ∇·(a×b) = b·(∇×a) − a·(∇×b); **u·∇T**, **f×u**, **k·∇×u** (vertical vorticity ζ) |
| 0.6 | Index notation (lite) | Summation over a repeated index; δᵢⱼ; εᵢⱼₖ just enough to read Vallis's appendices; a recap that points to fluidpy Ch. 2 |
| 0.7 | Partial derivatives and the chain rule | Slicing a surface; holding a variable fixed (the "which variable is held fixed?" trap: ∂/∂t at a fixed point vs following the flow); the chain rule in several variables |
| 0.8 | Gradient | The uphill direction and steepness; isolines are ⊥ to ∇; the pressure-gradient force −∇p/ρ |
| 0.9 | Divergence | Outflow per unit volume; convergence ⇒ rising air; ∇·u = 0 |
| 0.10 | Curl and vorticity | Spin per unit area; paddle wheel; shear flow has vorticity; ζ = ∂v/∂x − ∂u/∂y; relative, planetary and absolute vorticity |
| 0.11 | Laplacian | "Value minus the average of the neighbours"; diffusion; ∇²ψ = ζ |
| 0.12 | Flux and flux divergence | Flux = amount × velocity; a box budget; why a *divergence* of flux changes the content; heat transport |
| 0.13 | Gauss and Stokes | The box and loop theorems; circulation; recaps of fluidpy Ch. 2 explainers, with fresh geophysical examples |
| 0.14 | Material derivative | D/Dt = ∂/∂t + u·∇; the weather vane vs the balloon; advection of temperature by a wind |
| 0.15 | Taylor series and linearisation | Small perturbations; mean + anomaly (ū + u′); dropping products of small terms |
| 0.16 | Complex exponentials and waves | e^{iθ} as a rotating pointer; e^{i(kx−ωt)}; phase and amplitude; the real part; wavenumber k, frequency ω, phase speed |
| 0.17 | Fourier ideas | Any wiggle = a sum of waves; spectrum; zonal wavenumber on a latitude circle (integer s = 1, 2, 3…); the Hovmöller diagram |
| 0.18 | Spherical coordinates and lat–lon | λ, φ, r; metres per degree (111 km · cos φ in longitude); local Cartesian (f-plane, β-plane); f = 2Ω sin φ, β = 2Ω cos φ / a |
| 0.19 | Scaling and orders of magnitude | The scale-analysis recipe; Fermi estimates; magnitude bars |
| 0.20 | Nondimensional numbers | Ro, Ek, Re, Fr, Bu, Ri, Burger and deformation radius L_d = NH/f, Rhines scale — each as a ratio of two bars |
| 0.21 | How to read climate figures | Contours, colourbars, projections, sections, vertical coordinates, streamfunctions, Hovmöller diagrams, spectra, vectors, isosurfaces, anomalies and composites, data products (§3) |
| 0.22 | Mechanisms in plain language | Coriolis, geostrophy, thermal wind, Hadley cell, jets, gyres, Ekman, overturning, ENSO, QBO, polar vortex — each as a 1-screen card (§4) that points to the Vallis chapter that derives it |
| ✅ | What should have clicked | One sentence per tool |

The chapter has 22 sections. Sections 0.2–0.20 are tools and each is a CORE block. The hard maximum of 18 CORE blocks
can stay if 0.2+0.3, 0.9+0.10 and 0.13+0.12 are merged.

### 2.2 The 14 explainers (12 required + 2 that can be dropped)

The bar is the same as the Unit 4 mathlets: linked views on one clock, Explain/Derivation/Code/Check tabs, presets,
term bars. Explainers that already exist in fluidpy Ch. 2 are **re-skinned with geophysical presets**, not rebuilt.

| # | Slug · question title | One-line idea | The learner manipulates | Linked views | 3-D? |
|---|---|---|---|---|---|
| E01 | `vector_products_lab` · *What do a·b and a×b actually measure?* | The dot product is a projection; the cross product is an area plus a normal direction (right-hand rule); triple product = volume | Drags the tips of a and b (and c); toggles the right-hand animation; preset "f k×u": a wind vector and its 90°-left rotation | 3-D arrow scene · projection bar · parallelogram/parallelepiped with area/volume readout · component table | **yes** (three.js orbit; 2-D fallback) |
| E02 | `vector_identity_builder` · *Why is a×(b×c) = b(a·c) − c(a·b)?* | Build the triple products and the BAC−CAB identity, and see that a×(b×c) lies in the plane of b and c | Picks an identity from a menu (BAC−CAB, ∇·(a×b), (a·∇)b); drags vectors; steps through index-notation lines | 3-D vectors · "term by term" coloured vectors that sum to the result · index-notation derivation tab | yes |
| E03 | `gradient_hillwalk` · *Which way is uphill, and how steep?* | ∇T points across the isolines, and its length is the steepness; directional derivative = ∇T·ŝ | Drags a walker on a temperature map; rotates the walking direction; picks presets (front, high, ridge) | Contour map · 3-D surface · directional derivative vs angle (a cosine) · readout of ∇T in K/100 km | yes (surface) |
| E04 | `divergence_curl_paddles` · *Does the flow spread or spin here?* | Divergence = net outflow from a tiny box; curl = spin of a tiny paddle wheel; a flow can do either, both or neither | Drops boxes and paddle wheels anywhere; mixes 4 basis flows (source, vortex, shear, strain) with sliders | Quiver + tracer particles · box with face-flux arrows · paddle wheel spinning · div/ζ maps · term strip showing ∂u/∂x + ∂v/∂y and ∂v/∂x − ∂u/∂y as "this arrow minus that arrow" | no |
| E05 | `laplacian_neighbours` · *What does ∇² measure?* | ∇²φ ∝ (average of the neighbours − value): a peak has ∇² < 0 and diffusion flattens it; ∇²ψ = ζ links a streamfunction to its vorticity | Paints bumps; runs diffusion; switches to "ψ → ζ" mode | Field · stencil inspector (5-point arithmetic) · time series of the peak value · ψ/ζ side by side | no |
| E06 | `flux_box_budget` · *Why does flux* divergence *change what is inside?* | The content of a box changes by (in − out); equal fluxes in and out mean no change even if the flux is huge | Sets inflow and outflow profiles, box size, heating; tiles boxes (interior faces cancel = Gauss) | Box budget animation · flux arrows on the faces · content vs time · F(x) curve with its slope shaded | no (re-skin of `gauss_flux_box`, plus a "heat transport by the ocean" preset) |
| E07 | `material_derivative_balloon` · *Why does the thermometer on a balloon read differently from the one on a mast?* | D/Dt = ∂/∂t + u·∇: local change = following change − advection | Sets wind speed, gradient, and local warming rate; switches between "mast" and "balloon" | Map with a moving front · two thermometer traces · three coloured bars (∂T/∂t, u·∇T, DT/Dt) that add up | no |
| E08 | `taylor_linearise` · *When can we drop the small stuff?* | f(x₀+δ) ≈ f + f′δ + ½f″δ²; mean + anomaly; products of anomalies are second order | Drags δ; adds terms one at a time; in "flow" mode sets the anomaly amplitude ε | Function + tangent + parabola · error vs δ on log–log axes (slope 2, then 3) · bars for ū·∂u′, u′·∂ū, u′·∂u′ | no |
| E09 | `complex_wave_pointer` · *How can e^{i(kx−ωt)} be a wave?* | A rotating pointer seen from the side is a cosine; k sets how fast the phase turns in x, ω how fast in t; c = ω/k | Sets k, ω, amplitude, phase; drags a point along x; adds a second wave (beats → group speed) | Rotating pointer (complex plane) · wave on a line · x–t (Hovmöller) plot with crest lines of slope c · Fourier bar | no |
| E10 | `sphere_to_map` · *How does a round Earth become a flat picture?* | Lat–lon, metres per degree, f = 2Ω sin φ; projections distort area, shape or distance; polar stereographic is used for the vortex, Robinson and Mollweide for global means | Rotates the globe; picks a projection; drags a "Tissot circle" stamp; toggles f(φ) shading | Orthographic globe · flat map in the chosen projection · Tissot ellipses · f and β vs latitude curve | **yes** |
| E11 | `contour_colour_reader` · *What is this map really telling me?* | Contour interval, filled vs line contours, dashed negatives, diverging colourmap centred on 0, jet vs perceptual maps | Changes contour interval, colourmap (jet/viridis/RdBu/cmocean balance), centre value, line/filled; clicks a point to read its value | One synthetic field drawn 4 ways · colourbar with the clicked value marked · histogram of values under the map · a "false feature" detector highlighting where jet invents edges | no |
| E12 | `streamfunction_reader` · *Which way does the flow go round this contour?* | u = −∂ψ/∂y, v = ∂ψ/∂x: flow follows ψ-contours with high ψ on the right; spacing = speed; cyclonic = anticlockwise in the NH and clockwise in the SH; Sverdrup = 10⁶ m³ s⁻¹ | Draws highs and lows; flips the hemisphere; switches between "horizontal ψ" (gyres, geostrophic p) and "overturning ψ" (latitude–depth, Sv) | ψ contours + particles · speed bar from contour spacing · hemisphere badge (cyclonic/anticyclonic) · transport between two clicked contours in Sv | no |
| E13 | `section_and_vertical_axes` · *Why is the y-axis upside down and logarithmic?* | Zonal mean → latitude–height section; pressure decreases with height; z* = −H ln(p/p₀); isopycnal surfaces in the ocean | Picks the vertical axis (z, p, log p, z*, σ/ρ); drags a cursor; toggles the zonal-average "collapse" animation | 3-D slab collapsing to a zonal mean · section on the chosen axis · conversion ruler hPa ↔ km · ocean density section with isopycnals | yes (the slab) |
| E14 | `hovmoller_spectrum_reader` · *How do I read a Hovmöller and a wavenumber–frequency plot?* | Tilted stripes in (x, t) are propagating waves (slope = speed); a 2-D Fourier transform turns them into peaks in (k, ω); dispersion curves tell which wave is which | Builds a field from waves (eastward Kelvin-like, westward Rossby-like, a QBO-like time–height pattern); toggles the background-ratio step | Hovmöller · time–height (QBO mode) · (k, ω) spectrum with shallow-water dispersion curves for an equivalent depth h (slider 12–50 m) · inspector | no |

Of these:
- **Reserve / backup:** a 3-D isosurface reader (`isosurface_reader`, three.js). It slices a 3-D blob and shows it as an
  isosurface, as contours on 3 planes, and as a zonal mean, which teaches that the three are the same object.
- **Can be dropped if the chapter is long:** E02 (fold into E01 as a mode) and E08 (fold into the notebook).
- **Already covered by fluidpy Ch. 2** and therefore shortened: `rotation_of_axes`, `gauss_flux_box`,
  `stokes_circulation_loop`. They are linked from the notebook with a one-line recap plus geophysical presets.
- **Mechanism cards** (§4) are **not** separate explainers in Chapter 0. They become modes of E12 (gyres, highs/lows)
  and E13 (Hadley cell, jets), and each gets a full explainer in the Vallis chapter that derives it.

### 2.3 Symbol atlas and glossary — design
- **One source of truth:** `knowledge/symbols.yaml`. Each entry has:
  `symbol` (TeX), `name`, `say_it` ("zeta"), `unit`, `typical` (Earth atmosphere / ocean values), `meaning` (≤ 20
  words), `first` (chapter·section·ID), `aka` (other books' symbols — e.g. Kundu ω vs Vallis ζ, Kundu Γ sign vs met
  Γ), `pitfall`, `see` (related symbols).
- **Three renderings, all generated from that file:**
  1. a notebook appendix table, grouped by family (rotation, thermodynamics, waves, operators, nondimensional numbers);
  2. hover cards in every explainer (`Viz.symbols`);
  3. a searchable `viz/atlas.html` page with a filter box, a family filter, and "show me where it is first used"
     links into the notebook pages.
- **Glossary vs atlas.** The atlas is for **symbols**. The glossary (§5) is for **words**. Both are linked from every
  page footer.
- **Convention flags.** Entries carry a ⚠️ flag when Vallis's convention differs from Kundu's or from common practice,
  for example:
  - the sign convention of ψ;
  - the sign of the lapse rate;
  - θ vs φ for latitude;
  - b (buoyancy) vs ρ′.

  The flag uses the existing "Which p_o?" pattern from the teaching-style lessons.
- **Lint.** `coverage_check.py` gains a rule: any TeX symbol in a markdown cell that is not in `symbols.yaml` and is
  not defined in the same cell gives a warning.

---

## 3. "How to read this figure" — the pattern for every reproduced data figure

Every later chapter that reproduces a **data figure** — reanalysis, observations or model output, always regenerated
by our own code from open data, never copied from the book — gets two things: a static figure with a **reading card**,
and an **interactive annotated version**.

### 3.1 The 5-question reading card (a fixed template, `nb.reading_card(...)`)
1. **What is plotted?** The quantity, its unit, and whether it is a raw value, an anomaly (relative to which base
   period) or a climatology (which months and years). Is it a zonal or time mean?
2. **Where and when are the axes?** The horizontal axis (longitude / latitude / time / wavenumber), the vertical axis
   (height / pressure / log-pressure / depth / density — and does it point down?), and the projection.
3. **How is value encoded?** The colourbar range and its centre, the contour interval, whether negatives are dashed,
   what arrows mean (their scale arrow), what stippling or hatching marks (significance).
4. **What is the one big feature?** Name the dominant pattern in one sentence ("westerly jets near 30–50° in both
   hemispheres, strongest in winter"), and give one number read off the figure with its unit.
5. **Which physics explains it, and what would change it?** Link to the CORE idea (thermal wind, Sverdrup balance…).
   Then state a "what would change if…" prediction (if the equator-to-pole contrast doubled, the jet would…).

A sixth line, **"Where it comes from"**, names the product (ERA5 reanalysis, ECCO state estimate, a CMIP model, an
observational analysis such as WOA). It also says why that matters (§3.3).

### 3.2 Interactive annotated version (`Viz.figureReader`)
- Layers you can toggle: **encoding** (highlights the colourbar and contour labels), **axes** (explains each axis in a
  callout), **feature** (draws the big feature's outline), **physics** (overlays the balance — e.g. thermal-wind arrows
  on a T section).
- **Probe:** hover or click to read the value, the anomaly, and the coordinates in human units ("45°N, 250 hPa ≈
  10.4 km"). The probe shows a reading "your eye might make" next to the true value.
- **Quiz mode:** the 5 questions as clickable answers on the figure ("click where the jet is strongest").
- Templates are kept per figure type (§3.4), so each new figure costs one configuration, not one build.

### 3.3 Figure types and what to teach for each

| Figure type | Key reading skills | Common misreading |
|---|---|---|
| Line contours vs filled contours | Interval = value step between lines; closely spaced lines = steep gradient; labels on lines; dashed = negative (Vallis and many journals); the zero line is often bold | Reading contour *spacing* as value; ignoring that the interval may change between panels |
| Colourbars and diverging maps | Sequential maps for magnitudes; diverging maps centred on 0 for anomalies; check the range and the saturation ends ("> 3"); perceptual maps (viridis, cmocean, Crameri) | Rainbow maps creating false bands; an asymmetric range making a small anomaly look big |
| Map projections | Polar stereographic (looking down on a pole, used for the vortex and sea ice); Robinson and Mollweide (whole globe; Mollweide is equal-area); orthographic (globe view); plate carrée lat–lon (areas near the pole are exaggerated) | Thinking the Arctic is huge on lat–lon maps; mis-locating the pole's direction on polar views |
| Zonal mean, latitude–height section | Averaged along longitude; x = latitude (often S→N), y = pressure (decreasing upward) or height; the tropopause is visible as a change in contour slope | Thinking a zonal mean is a slice at one longitude |
| Pressure / log-pressure axes | p decreases with height roughly exponentially; log-p axes make height almost linear; z* = −H ln(p/p₀) with H ≈ 7 km; 500 hPa ≈ 5.5 km, 250 hPa ≈ 10 km, 10 hPa ≈ 31 km | Reading the axis as linear height; forgetting that the axis points "down" in p |
| Isopycnal and density sections (ocean) | Depth downward; isopycnals slope up toward the pole; ventilation where they outcrop; σθ = ρ − 1000 kg m⁻³ | Thinking water moves across isopycnals easily |
| Streamfunction plots | Horizontal ψ: flow is along contours, with high ψ on the right for u = −∂ψ/∂y, v = ∂ψ/∂x (Vallis's sign); closer contours = faster; the transport between two contours = Δψ (Sv = 10⁶ m³ s⁻¹ in the ocean). Overturning ψ (lat–depth or lat–pressure): check the caption's sign, positive = clockwise in the plotted frame is common | Assuming one sign convention; confusing "clockwise on the page" with "cyclonic" |
| Highs, lows and rotation sense | Around a low in the NH the flow is anticlockwise (cyclonic); in the SH it is clockwise (still cyclonic). Cyclonic = the same sense as Earth's rotation seen from above the local pole. NH subtropical ocean gyres turn clockwise (anticyclonic) | Thinking "cyclonic = anticlockwise" everywhere |
| Hovmöller and time–height (QBO) | x or height against time; a tilted stripe = something propagating (slope = speed); QBO: alternating easterly and westerly regimes descending at about 1 km/month, period ≈ 28 months | Reading the slope as a "trend" rather than a propagation speed |
| Wavenumber–frequency spectra | Zonal wavenumber (positive = eastward in the usual convention) against frequency; ratio to a smoothed background; overlaid shallow-water dispersion curves label Kelvin, equatorial Rossby (ER), mixed Rossby–gravity (MRG) and inertio-gravity (IG) waves; MJO near k = 1–3, periods of 30–60 days | Treating the colours as raw power; forgetting the symmetric/antisymmetric split |
| Vector / quiver and EP-flux arrows | Arrow length = magnitude (find the reference arrow); EP-flux arrows are often rescaled differently in the two directions and by density, so read the caption; contours of ∇·F (EP-flux divergence) = wave drag on the mean flow | Comparing arrow lengths across panels with different scales |
| 3-D isosurface figures | A surface of constant value; lighting suggests shape, not value; check which value and whether it is an anomaly | Treating shading as data |
| Anomalies, climatologies, composites | Climatology = long-term mean for each calendar time; anomaly = value − climatology; composite = average over selected events (e.g. El Niño years) with significance stippling | Reading an anomaly map as the full field |
| Data products | **Observations** (sparse, direct); **reanalysis** (a model nudged toward the observations by data assimilation, e.g. ERA5 — dynamically consistent, but not exactly conserving); **state estimate** (ECCO — adjoint-fitted, conserves budgets, used for transports); **model output** (CMIP — a free-running climate, *not* the weather of a given date) | Treating reanalysis as measurement; comparing a free model's year 2000 with the observed year 2000 |

### 3.4 House rules for figures we regenerate
- **Colour.** Perceptually uniform maps only (viridis/cividis, cmocean, Crameri batlow/vik). Diverging maps are centred
  on zero with a symmetric range. Never jet, except in E11, where it appears *as the bad example*.
- **Contours.** Negative contours dashed, zero contour bold, interval stated in the caption.
- **Required caption elements.** Product, period, base period for anomalies, unit, sign convention of any
  streamfunction.
- **Data and licensing.** Data come from open sources (ERA5 via CDS, NOAA PSL, ECCO, WOA) under the existing
  `data-and-benchmarks` policy. The book's figures are never reproduced.

---

## 4. The plain-language mechanism explainer pattern

### 4.1 The pattern (one screen in an explainer; a 🌍 block in the notebook)

| Step | Content | Length |
|---|---|---|
| 1. **Story** | A concrete scene and a question ("Why do winds in a storm blow *around* the low instead of straight into it?") | 2–3 sentences, no symbols |
| 2. **Picture** | One diagram or tank-and-planet pair: the forces as coloured arrows, the flow, what you would see | 1 figure / canvas |
| 3. **One equation** | The governing balance, every term named in words under it (anatomy strip), its Vallis number when it exists | 1 line |
| 4. **Number** | Plug Earth values in (easy and exact) and get a speed, time or length that can be said out loud | 1–3 lines |
| 5. **Misconception** | The common wrong idea, why it is tempting, and why it is wrong | ⚠️ callout |
| 6. **Where next** | The Vallis section that derives it properly, and the data figure that shows it | 1 line |

### 4.2 The 11 mechanism cards (correct but beginner-level)
All numbers are order-of-magnitude values. The Vallis chapters do the derivations.

1. **Coriolis.**
   - *Story:* on a spinning planet, anything moving seems to drift sideways — to the right in the NH, to the left in
     the SH.
   - *Equation:* acceleration = −2**Ω**×**u**, whose horizontal part is −f **k**×**u** with f = 2Ω sin φ.
   - *Number:* at 45°, f ≈ 10⁻⁴ s⁻¹, so a 10 m/s wind feels 10⁻³ m s⁻² sideways — tiny, but over a day it bends the
     path completely (an inertial circle of period 2π/f ≈ 17 h).
   - *Misconception:* "Coriolis decides which way bathtubs drain." The effect is far too weak at that scale (Ro ≫ 1).
2. **Geostrophy.**
   - *Story:* for large, slow flows the pressure push and the Coriolis deflection cancel, so the wind blows *along*
     the isobars.
   - *Equation:* f **k**×**u**_g = −∇p/ρ.
   - *Number:* a 1 hPa change over 100 km at 45° gives u ≈ 8 m/s.
   - *Misconception:* "air flows from high to low." Only friction near the ground lets it cross the isobars a little.
     NH rule: with your back to the wind, low pressure is on your left.
3. **Thermal wind.**
   - *Story:* the cold pole and warm tropics make the pressure surfaces slope more and more with height, so the
     westerly wind grows with height.
   - *Equation:* f ∂u/∂z ≈ −(g/T) ∂T/∂y.
   - *Number:* 40 K across 4000 km over 10 km of height gives Δu ≈ 30 m/s.
   - *Misconception:* "the jet is caused by heat flowing poleward." The vertical shear is a *balance* with the
     temperature gradient, not a flow down that gradient.
4. **Hadley cell.**
   - *Story:* air rises in the hot, wet tropics, moves poleward aloft, sinks in the subtropics (deserts) and returns
     along the surface as the trade winds.
   - *Picture:* a latitude–pressure overturning streamfunction.
   - *Number:* about 100 Tg/s of mass, edge near 30°.
   - *Misconception:* "one cell goes all the way to the pole." Rotation stops it in the subtropics (angular momentum),
     and eddies take over beyond that.
5. **Jets.**
   - *Subtropical jet:* air moving poleward aloft keeps its angular momentum and speeds up eastward.
   - *Eddy-driven (polar-front) jet:* weather systems pump momentum into midlatitudes.
   - *Number:* 30–50 m/s at about 200–250 hPa.
   - *Misconception:* "the jet stream is one fixed ring." It meanders, splits and shifts with the seasons.
6. **Ekman layer.**
   - *Story:* wind drags the top of the ocean, rotation turns each layer a bit more, and the *net* water transport is
     90° to the right of the wind (NH).
   - *Equation:* M_E = τ × **k**/(ρ f) (transport per unit width).
   - *Number:* τ = 0.1 N m⁻² gives M ≈ 1 m² s⁻¹.
   - *Misconception:* "surface water moves with the wind." At the surface it moves at about 45°, and the depth
     integral at 90°.
7. **Gyres and Sverdrup balance.**
   - *Story:* winds pile water into the subtropics (Ekman convergence), pushing the column down; to keep its spin
     balanced against planetary vorticity, the column moves equatorward across the interior; the water returns in a
     narrow, fast western boundary current (the Gulf Stream).
   - *Equation:* βV = f ∂w/∂z, integrated to βV = curl τ/ρ.
   - *Number:* about 30 Sv for the North Atlantic subtropical gyre.
   - *Misconception:* "gyres are just water blown round by the wind." The interior flow is mostly *across* the wind
     direction, and the western intensification needs β.
8. **Overturning (AMOC / MOC).**
   - *Story:* dense water sinks at high latitudes in a few places, spreads at depth, and comes back up through mixing
     and wind-driven upwelling (the Southern Ocean).
   - *Number:* AMOC ≈ 17 Sv at 26°N (RAPID array).
   - *Misconception:* "a conveyor belt driven only by sinking." Wind and mixing set much of the return path.
9. **ENSO.**
   - *Story:* the trade winds pile warm water in the west Pacific; if they weaken, warm water sloshes east (El Niño),
     the rains move east, and the winds weaken further — a coupled ocean–atmosphere feedback (Bjerknes).
   - *Picture:* an SST anomaly map plus an equatorial depth–longitude section.
   - *Number:* Niño-3.4 anomaly ≥ +0.5 °C, events every 2–7 years.
   - *Misconception:* "El Niño is a warm current" — it is a basin-wide coupled pattern; "it makes everywhere warmer" —
     it shifts rainfall and temperature in both directions.
10. **QBO.**
    - *Story:* in the tropical stratosphere the zonal wind flips between easterly and westerly about every 14 months
      (a full cycle ≈ 28 months). The new regime appears at the top and creeps down, driven by upward-travelling
      waves that deposit momentum where they are absorbed.
    - *Picture:* a time–height Hovmöller.
    - *Number:* descent ≈ 1 km/month, winds ±20–30 m/s at 30 hPa.
    - *Misconception:* "it is driven by the seasons." Its period is not tied to the annual cycle.
11. **Polar vortex.**
    - *Story:* in the winter polar night the stratosphere gets very cold, so a strong westerly ring of wind forms
      around the pole (thermal wind) at 10–50 km.
    - *Number:* about 60 m/s at 10 hPa, 60°N in midwinter.
    - *Sudden stratospheric warming:* planetary waves from below can slow or reverse it, warming the polar
      stratosphere by tens of K in days.
    - *Misconception:* "the polar vortex is a cold storm coming south." It is a stratospheric wind system; cold
      outbreaks at the surface are an indirect consequence of it being disturbed. ENSO and the QBO modulate how often
      it is disrupted (Holton–Tan; see the NOAA polar vortex blog).

### 4.3 Explainer form
Each card is one Explore mode with a **Tank ↔ Planet** toggle. Tank modes follow the Weather in a Tank experiments
(Taylor column, thermal wind cylinder, Hadley/eddy annulus, gyre with a sloping bottom). Planet modes use a regenerated
data figure with a reading card. The anatomy strip and the magnitude bars sit under the equation. The full explainer
is built in the Vallis chapter where the mechanism is derived. Chapter 0 only gives the cards inside E12 and E13.

---

## 5. Beginner vocabulary (one line each, in our own words)

| Term | Plain-language definition |
|---|---|
| Geophysical fluid dynamics (GFD) | The physics of large-scale flows on a rotating planet with layered (stratified) fluids |
| Rotating frame | Describing motion as seen by someone standing on the spinning Earth; this introduces Coriolis and centrifugal terms |
| Coriolis parameter f | 2Ω sin(latitude): how strongly rotation deflects horizontal motion; zero at the equator, largest at the poles |
| β (beta) | How fast f increases northward (≈ 1.6×10⁻¹¹ m⁻¹ s⁻¹ at 45°); the cause of Rossby waves and western boundary currents |
| f-plane / β-plane | A local flat patch of the planet with constant f / with f changing linearly in y |
| Hydrostatic balance | Pressure at a level equals the weight of the fluid above; vertical acceleration is neglected |
| Geostrophic balance | Coriolis force balances the pressure-gradient force; the flow runs along isobars |
| Ageostrophic flow | The (small) part of the wind that is not geostrophic; it does the converging and the rising |
| Thermal wind | The vertical change of geostrophic wind tied to horizontal temperature (density) gradients |
| Stratification, N | Layering by density; the buoyancy frequency N is how fast a displaced parcel bobs (≈ 0.01 s⁻¹ in air) |
| Potential temperature θ | The temperature a parcel would have if brought adiabatically to 1000 hPa; conserved without heating |
| Buoyancy b | The upward force per unit mass from a density difference, −g ρ′/ρ₀ |
| Boussinesq approximation | Density differences are kept only where they multiply gravity; good for the ocean |
| Anelastic / pseudo-height | Ways of filtering sound waves from atmospheric equations; z* uses log-pressure as height |
| Isobaric / isentropic / isopycnal surface | A surface of constant pressure / of constant θ / of constant density |
| Vorticity ζ | Local spin of the fluid, k·∇×u; positive = anticlockwise seen from above |
| Planetary / absolute vorticity | f is the Earth's own spin at that latitude; absolute vorticity = ζ + f |
| Cyclonic / anticyclonic | Rotating the same way / the opposite way to the Earth seen from above the local pole (anticlockwise / clockwise in the NH, reversed in the SH) |
| Potential vorticity (PV) | Absolute vorticity times stratification (or ÷ layer thickness); conserved by adiabatic, frictionless flow — the master variable of large-scale dynamics |
| Rossby number Ro | U/(fL): inertia vs rotation; Ro ≪ 1 means rotation dominates |
| Ekman number Ek | Friction vs rotation, ν/(fH²) |
| Burger number Bu | (L_d/L)²: stratification vs rotation |
| Deformation radius L_d | NH/f (≈ 1000 km in the atmosphere, ≈ 30–50 km in the ocean): the scale of weather systems / ocean eddies |
| Rhines scale | √(U/β): beyond it, Rossby waves stop turbulence from growing and organise jets |
| Richardson number Ri | N² / (shear)²: stratification vs shear; Ri < 1/4 allows shear instability |
| Quasi-geostrophy (QG) | Equations for flows close to geostrophic balance, Ro ≪ 1; Vallis's workhorse |
| Shallow-water equations | A single thin layer of fluid with a free surface; the simplest model with gravity waves, rotation and PV |
| Rossby wave | A slow westward-propagating wave caused by β; the meanders of the jet |
| Kelvin wave | A wave trapped against a coast or the equator that moves with the boundary on its right (NH) or travels eastward along the equator |
| Inertia–gravity wave | A gravity wave modified by rotation; frequency between f and N |
| Dispersion relation | The rule ω(k) linking a wave's frequency to its wavenumber; it sets the phase and group speeds |
| Group velocity | The speed at which a wave packet's energy travels (can differ from the crest speed) |
| Baroclinic instability | The growth of weather systems from the energy stored in sloping density surfaces |
| Barotropic / baroclinic | Pressure surfaces parallel to density surfaces (flow the same at all heights) / not parallel (flow changes with height) |
| Eddy | A swirl departing from the mean flow; in GFD "eddies" (weather systems, ocean mesoscale eddies) transport heat and momentum |
| Zonal / meridional | East–west / north–south |
| Zonal mean, overbar and prime | The average around a latitude circle; u = ū + u′ splits mean and eddy |
| Eliassen–Palm (EP) flux | A vector measuring how eddies transport heat and momentum; its divergence is the eddy force on the mean flow |
| Residual circulation | The mean overturning once the eddies' effect on the mean is accounted for (TEM) |
| Hadley / Ferrel / polar cells | The three zonal-mean overturning cells; the Ferrel cell is indirect, driven by eddies |
| Jet stream (subtropical / eddy-driven) | Narrow bands of fast westerly wind near the tropopause |
| Tropopause / stratosphere | The boundary (~10–16 km) between the weather layer and the stable layer above |
| Sverdrup balance | In the ocean interior, northward flow is set by the wind-stress curl: βV = curl τ/ρ |
| Ekman layer / transport / pumping | The friction layer under the wind or above the ground; its net transport is 90° to the wind; convergence pushes water down (pumping) |
| Western boundary current | The narrow, fast current on the west side of an ocean basin (Gulf Stream, Kuroshio) |
| Gyre | A basin-wide ocean circulation loop (subtropical: anticyclonic; subpolar: cyclonic) |
| Thermocline | A depth range where temperature drops fast; separates the warm upper ocean from the cold abyss |
| Meridional overturning circulation (MOC/AMOC) | The zonally integrated north–south and up–down ocean circulation, measured in Sv |
| Sverdrup (Sv) | 10⁶ m³ s⁻¹ of volume transport (about all the world's rivers combined, ×100) |
| Mixed layer | The top tens of metres of the ocean, stirred by wind and cooling so that it is nearly uniform |
| ENSO | El Niño–Southern Oscillation: coupled year-to-year swings of tropical Pacific SST, winds and rain |
| QBO | Quasi-biennial oscillation: ~28-month reversal of tropical stratospheric winds, descending with time |
| MJO | Madden–Julian oscillation: a 30–60 day eastward-moving pulse of tropical rain and wind |
| Polar vortex / SSW | Winter westerly ring in the polar stratosphere / its sudden disruption and warming |
| Anomaly / climatology / composite | Departure from normal / the normal for that time of year / average over chosen events |
| Reanalysis / state estimate | Observations blended with a weather model into a complete gridded history / a model run fitted to observations that keeps budgets closed |
| Equivalent depth | The depth of the shallow-water layer that has the same wave speed as a mode of a stratified fluid |
| Wave–mean-flow interaction | Waves carrying momentum and depositing it where they break or are absorbed, changing the mean wind (QBO, SSW) |
| Angular momentum (axial) | Ωa²cos²φ + u a cos φ: conserved by a ring of air moving poleward without torque — why upper-level winds speed up poleward |

This is about 55 entries. It is the seed for `knowledge/glossary.yaml`, which the concept-analyst extends each chapter.

---

## 6. Suggested additions to the skills and the reviewer

### 6.1 `teaching-style` — new subsections
- **§1d Equation anatomy and magnitude.**
  - Every balance equation shown in a CORE block gets an anatomy strip: each term named in words under it, in the
    project colour of its family.
  - Every scale-analysed equation gets a term-magnitude table or bar chart with Earth values, and names the dominant
    balance and the nondimensional number that is the ratio of the bars.
- **§1e Analogy with its limit.**
  - Any analogy is written as **Like… / Unlike…**.
  - A mechanism block also states its misconception (§4 pattern).
- **§1f Read the figure before interpreting it.**
  - Every data figure gets the 5-question reading card (`nb.reading_card`), *before* the interpretation.
  - Captions state the product, the period, the base period, the unit, the projection and the streamfunction sign
    convention.
- **§1g Rotation sense and hemisphere.**
  - Never write "clockwise" without the hemisphere and the viewpoint. Prefer "cyclonic/anticyclonic" and add the
    clock sense in brackets.
- **§1h Two scales of numbers.**
  - Give easy values (Ω ≈ 7×10⁻⁵ s⁻¹, f ≈ 10⁻⁴ s⁻¹) and exact values side by side.
  - Every derived geophysical number is followed by "that is like …" (a walking speed, a day, the width of a country).
- **§1i Symbols from the atlas.**
  - A symbol's first use links to its atlas entry.
  - Convention differences with Kundu or common practice get a ⚠️ "Which convention?" callout. This generalises the
    "Which p_o?" lesson.
- **§2 headings:** add `### 🌍 Mechanism — <name>` (story · picture · one equation · number · misconception · where
  next) and `> 🗺️ **How to read this figure**`.

### 6.2 `interactive-viz` — new depth features and the library
- New depth features that count toward the "≥ 2" rule:
  - **anatomy** (clickable equation terms with hover cards, `Viz.symbols`);
  - **magnitude** (log-scale term bars with a dominant-balance badge);
  - **ghost-term** (run with a term removed);
  - **tank↔planet** mode;
  - **figure-reader** (layers + probe + quiz).
- Contract for Chapter 0: `max_explainers` = 14. The symbol atlas page `viz/atlas.html` is excluded from the count.
- Colour-map rule: perceptually uniform only. `viz_lint.py` warns on `jet`/`rainbow`/`hsv` unless the meta tag
  `viz:badexample` is set.

### 6.3 `lesson-reviewer` — new checklist items (add to the procedure)
7. **Symbol atlas.** Every symbol's first use links to or matches `knowledge/symbols.yaml`, with its unit and typical
   value. Missing → Must fix.
8. **Anatomy and magnitude.** Every balance equation in a CORE block has an anatomy strip. Every scale-analysis step
   has numbers for each term and names the dominant balance. Missing → Must fix.
9. **Reading cards.** Every data figure has all 5 questions answered (plus its source line) before the interpretation.
   Every anomaly states its base period. Every streamfunction states its sign convention. Missing → Must fix.
10. **Mechanism blocks.** Each has a story, picture, one equation, a number and a misconception, and the misconception
    is actually wrong for the stated reason (check its physics). A weak or vague misconception → Should fix.
11. **Rotation sense and hemisphere.** "Clockwise"/"anticlockwise" always comes with the hemisphere and viewpoint;
    "cyclonic" is used correctly in both hemispheres. An error → Must fix.
12. **Analogies.** Every analogy has its "Unlike…" line. Missing → Should fix.
13. **Colour.** No jet/rainbow maps. Diverging maps are centred on zero for anomalies. Negative contours are dashed or
    explained. → Should fix (Must fix if the figure misleads).
14. **No climate background assumed.** Read every 🌍 block as someone who has never seen a weather map. Any term not in
    the glossary or primed at that point → Must fix (this extends check 2).

### 6.4 Tooling notes (for the orchestrator)
- **Planned files** (none of these exist yet):
  - `tools/coverage_check.py` gains three warnings: undefined TeX symbol, figure without a reading card, "clockwise"
    without a hemisphere;
  - `tools/nbkit.py` gains `nb.reading_card`, `nb.mechanism` and `nb.anatomy`;
  - `knowledge/symbols.yaml`, `knowledge/glossary.yaml`;
  - `assets/viz_lib.js` gains `Viz.symbols`, `Viz.magnitudeBars`, `Viz.ghost`, `Viz.figureReader`.
- **Chapter 0's position in the pipeline.** Chapter 0 runs the normal 10 phases. Its "book pages" are Vallis's
  appendices and notation pages plus the chapter introductions. Its physics module is `fluidpy`-style:
  `aofd/ch00_toolkit.py`, which holds the vector identities, finite-difference operators on a sphere, projection
  metrics, and a Wheeler–Kiladis-style spectrum with its tests.

---

## Sources
All URLs are cited inline in the §0 table and in §3–§4.

*Verification note:* Most URLs above were confirmed by web search on 2026-10-20. The following
were not directly fetched and are given from their well-known canonical addresses:
- BetterExplained article paths;
- worrydream LadderOfAbstraction and KillMath;
- seeing-theory.brown.edu, ncase.me and explorabl.es;
- matplotlib.org/cmocean.

The approximate numbers in §4 are order-of-magnitude teaching values (AMOC ≈ 17 Sv from the RAPID array; QBO ≈ 28
months). They must be re-checked against cited sources by the math-verifier before they appear in a notebook.
