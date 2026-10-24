# ch00_dot_product_why v5: physics and teaching analysis

Analyst: physics & pedagogy (v5 planning). Date 2026-10-24. Read-only on the movie files.
Inputs: `reports/ch00_poc_user_feedback.md` (U-M3.G1–G6, U-M3.1–U-M3.23), the user's own words in `Video_Prompt_2.docx`
(extracted with zipfile), v4 `script.md`, `storyboard.yaml`, `movies/data/build_ch00_dot_product_why.py`,
`movies/src/ch00/DotProductWhy.tsx`, and `fluidpy/geo/vectors.py` and `fluidpy/core/kinematics.py` (read-only).
Length decision: v5 runs 10–12 min as one movie.

**Bottom line.** Every v4 number is right: 66/66 build checks PASS, and a re-run into the scratchpad gives the same
sha256 for all five data files. There are **two rounding slips on screen** (s04, s07). The user was confused in s16–s19
because of how the story was told, not because of a wrong number. **s17 freezes the map and calls v·∇T "what the
moving air parcel meets"**, as if the balloon warms. **s18 then says the balloon never changes.** These are two
opposite assumptions (∂T/∂t = 0, then DT/Dt = 0), shown one after the other, and the first one is never called
hypothetical. v5 must tell one story, with one assumption, from the pole's point of view.

---

## 1. Number audit (s02–s20)

How I checked: I ran the build script's `main()` with `OUT`/`DATA` pointed at the scratchpad
(`.venv/Scripts/python.exe`, numpy and fluidpy as installed). **66/66 checks PASS.** The five data files are
byte-identical to the committed ones (pair `ec7c1454…`, same_way `7ce05570…`, cheap `433ed377…`, work `1ed37614…`,
weather `73a9aa8a…`). I recomputed the rounded on-screen products by hand with numpy.

| Scene | Quantity | Formula | Value | Status |
|---|---|---|---|---|
| s02 | a, b | given | (5, 1), (1, 3) | OK |
| s02 | \|a\| | √(5² + 1²) = √26 | 5.0990 | OK |
| s02 | \|b\| | √(1² + 3²) = √10 | 3.1623 | OK |
| s03 | a·b | 5×1 + 1×3 | 8 | OK |
| s04 | θ | angle_between | 60.255° (shown "60.3°") | OK |
| s04 | cos θ | 8/√260 | 0.49614 → 0.496 | OK |
| s04 | \|a\|\|b\|cos θ | 5.099 × 3.162 × 0.496 | **7.997**, but the screen says "= 8.000" | **FLAG R1** |
| s05 | p·q | (3,0)·(2,0), (0,2), (−2,0) | 6, 0, −6 | OK |
| s06 | shadow of a on b | 8/√10 = 8/3.162 | 2.5298 → 2.530 | OK |
| s07 | b̂ | (1/3.162, 3/3.162) | (0.3162, 0.9487) → (0.316, 0.949) | OK |
| s07 | a·b̂ | 5 × 0.316 + 1 × 0.949 | **2.529** with the shown digits; the screen says 2.530 | **FLAG R2** |
| s08 | shadow × \|b\| | 2.530 × 3.162 | 7.99986 → 8.000 | OK |
| s09 | shadow of b on a | 8/√26 = 8/5.099 | 1.5689 → 1.569; × 5.099 = 8.0003 → 8.000 | OK |
| s10 | v·x̂ | (6, 8)·(1, 0) | 6 m/s, \|v\| = 10 m/s | OK (see W9: a second, different "v" later) |
| s11 | F | 20 (cos 60°, sin 60°) N | (10.000, 17.321) N | OK |
| s11 | shadow of F on d | 20 cos 60° | 10.0 N (same for d = 5 m and 10 m) | OK |
| s11 | W | F·d, d = (5, 0) m, (10, 0) m | 50 J, 100 J | OK |
| s14 | isotherms | x = (T − 10 °C)/(1e-5 K/m) | 11…15 °C at 100…500 km | OK |
| s15 | ∇T | `gradient` on the 5-km grid | (1.00e-5 K/m, 0) everywhere | OK |
| s16 | v | 10 (cos 60°, sin 60°) | (5.000, 8.660) m/s | OK |
| s16 | shadow of v on ∇T | 10 cos 60° | 5.00 m/s | OK |
| s16 | along-isotherm part | v − projection(v, ∇T) = 10 sin 60° | (0, 8.660) m/s | OK. **The screen never shows "10 × sin 60°"** (U-M3.18) |
| s16 | v·∇T | 5.00 × 1e-5 (+ 8.66 × 0) | 5.00e-5 K/s | OK |
| s16 | per hour | 5.00e-5 × 3600 | 0.180 K/h | OK |
| s17 | across-isotherm distance per hour | 5.00 m/s × 3600 s | 18.0 km/h (36.0 km/h along the wind) | OK |
| s17 | 18 km × 1 °C/100 km | | 0.180 °C | OK in number. **Misleading in framing** (§4, W1) |
| s17 | "map under the balloon" | T₀(pin + v·1 h) on the **frozen** map | 13.18 °C | Hypothetical number; must never be shown as the balloon's reading |
| s18 | material_derivative_terms (G1) | sliding field T = 10 + G(x − vₓt) | local −5.00e-5, advective +5.00e-5, total 0 K/s | OK (independent finite-difference check) |
| s19 | pole | 13 − 0.18 t | 13.00, 12.82, 12.64, 12.46 (1, 2, 3 h); 11.92 (6 h) | OK |
| s19 | upwind dots | pin − v·n h | (282.0, 148.8), (264.0, 117.6), (246.0, 86.5) km; T now 12.82, 12.64, 12.46 °C | OK; they equal the pole's later readings exactly |
| s19 | balloon | constant | 13.00 °C; it leaves the 360-km map at 5.77 h | OK. Any 6-h balloon track must be wrapped or stopped before 5.77 h |
| s20 | steeper map | 1 °C per 50 km = 1 K / 50 000 m | 2.00e-5 K/m (7 °C at x = 0 to 19 °C at 600 km; pin still 13 °C) | OK |
| s20 | v·∇T | 5.00 × 2e-5 | 1.00e-4 K/s = 0.360 K/h | OK |
| s20 | pole | 13 − 0.36 t | 12.64 (1 h), 10.84 (6 h) | OK |
| extra | per day | | −4.32 K/day, −8.64 K/day | OK. 1 °C/100 km and a few K/day are realistic mid-latitude sizes; label the map "an idealised map" (v4 does) |
| extra | 12 °C isotherm reaches the pole | (13 − 12)/0.18 | 5.56 h | Not used in v4. A useful anchor (§2, beat W8) |

**Rounding flags**
- **R1 (s04).** `EQ_COSN` writes "5.099 × 3.162 × 0.496 = 8.000". The product of those rounded factors is 7.997.
  Fix options: write "≈ 8"; or keep 4 decimals (5.0990 × 3.1623 × 0.4961 = 7.9998 ≈ 8.000); or show
  √26 × √10 × 8/√260 = 8 exactly.
- **R2 (s07).** `EQ_SHBH` writes "5 × 0.316 + 1 × 0.949 = 2.530". With those digits it is 1.580 + 0.949 = 2.529. The
  data row uses 1.581139 (= 5 × 0.316228). Fix: show b̂ = (0.3162, 0.9487) and 5 × 0.3162 + 1 × 0.9487 = 1.5811 +
  0.9487 = 2.5298 ≈ 2.530; or write "≈ 2.53".
- **R3.** The 1-hour pole value is 12.82 because 0.18 is exact here (5 × 1e-5 × 3600 = 0.18). No rounding issue.

**Sign risks**
- **S1.** v·∇T > 0 here: the wind has a part along ∇T, so it blows from the cold side towards the warm side. A fixed
  point therefore **cools**, because ∂T/∂t = −v·∇T. Meteorologists call this **cold advection**. Many textbooks call
  −v·∇T "the temperature advection", so the sign convention of the word "advection" is a trap. Let the movie call
  v·∇T "**the advection term**", and say in words that a positive value here means colder air is being brought in.
  Never say "advection +0.18 K/h, so it warms".
- **S2.** "Blows sixty degrees from grad T" (s16). In weather talk, "a wind from X" names the direction the wind comes
  **from**. Say "the wind blows towards a direction 60° to the left of ∇T, turned from east towards north" (towards the
  north-north-east), or simply show it and say "at sixty degrees to ∇T".

---

## 2. The causal story for s16–s19 (one idea per beat)

**The rule for v5:** never freeze the map while the balloon moves. Tell the whole story with **one assumption**
(each air parcel keeps its temperature, DT/Dt = 0) and from **one point of view first** (the pole). The 0.18 is then
introduced as "how fast colder air is carried over a fixed spot", not as anything the balloon gains.

| # | Idea (narration, plain words) | What the screen shows | Data (build script) |
|---|---|---|---|
| W1 | "Now a wind blows across this map at ten metres per second, at sixty degrees to ∇T." | Map with isotherms 11–15 °C; ∇T arrow (east); wind arrow v, 10 m/s, with a 60° arc between them | existing: `v`, `angle_between(v, ∇T)` = 60° |
| W2 | "Let's split the wind into two parts: one straight across the isotherms, one along them." | v splits into two arrows: across = 10 × cos 60° = **5.00 m/s** (orange, along ∇T); along = 10 × sin 60° = **8.66 m/s** (grey, along the isotherm); a right-angle mark between them | existing: `scalar_projection(v, ∇T)` = 5.00; `v − projection(v, ∇T)` = (0, 8.66). **New check row:** v_along[1] = 10 sin 60° |
| W3 | "Moving along an isotherm changes nothing: every point on that line has the same temperature. So the 8.66 m/s part brings no change at all, and only the 5 m/s part matters." | A short dot slides along the 13 °C isotherm; a readout stays 13 °C; then "8.66 × 0 = 0" | **New recorded call:** `dot(v_along, ∇T)` = 0 |
| W4 | "The 5 m/s part is the shadow of the wind on ∇T. Each hour it carries air 5 × 3600 = 18 km straight across the isotherms, from the cold side towards the warm side." | Bracket 18.0 km across the isotherms; arrow labelled "cold side → warm side" | existing: `km_per_h_towards_warm` = 18.0 |
| W5 | "Multiply the shadow by the length of ∇T: v·∇T = 5 m/s × 10⁻⁵ K/m = 5 × 10⁻⁵ K per second. That is 0.18 kelvin per hour; a change of one kelvin is the same as a change of one degree Celsius." | The line v·∇T = 5.00 × 1.00×10⁻⁵ = 5.00×10⁻⁵ K/s; × 3600 s/h = **0.18 K/h**. Units cancel visibly (m/s × K/m) | existing |
| W6 | "What does 0.18 per hour mean? Look at the pole, which stays put. The wind keeps replacing the air above it with air from the cold side." | Camera on the pole; the upwind direction (lower left, where the wind comes from) marked "upwind" | existing upwind track |
| W7 | "Suppose each air parcel keeps its own temperature: no sun, no mixing. Then the whole temperature pattern is carried along with the air. The isotherms slide 18 km to the east each hour." | Isotherms slide east; parcel tags keep their numbers; an hour clock reads **0 h, 1 h, 2 h, 3 h** (one rate, e.g. 1 h in 4 s, for all of s16–s19) | **New:** `iso_x_km[t]` = x_iso + (shadow) × t, precomputed (v4 computes the shift in the JS, see W12) |
| W8 | "So the pole's thermometer **falls**: 13.00, 12.82, 12.64, 12.46 °C. It loses 0.18 °C every hour. In about five and a half hours the 12-degree line reaches it." | Pole readout stepping on the clock; the upwind dots tagged 12.82, 12.64, 12.46 °C arriving in turn; a small graph of the pole falling | existing pole series and upwind `dot` calls. **New:** pole series computed by evaluating the sliding field at the pin (not the formula 13 − 0.18 t); 12 °C arrival at 5.56 h |
| W9 | "The balloon moves with the air, so it carries the same parcel all along: its thermometer stays at **13 °C**." | The balloon readout fixed at 13.00 next to the pole readout, side by side on the same clock (two columns: pole · balloon) | **New:** balloon series = sliding field evaluated on the balloon path, constant 13.00; check with `material_derivative_terms` total = 0 at each sample |
| W10 | The equation, once the picture is clear: "Put DT/Dt = 0 into our equation: ∂T/∂t = −v·∇T. ∇T points towards warm air and the wind has a part that way, so v·∇T is positive (+0.18 K/h). The minus sign turns it into a fall at the pole: −0.18 K/h. Colder air is being brought in; weather forecasters call this cold advection." | Strip 0 = ∂T/∂t + v·∇T → ∂T/∂t = −v·∇T; values under the terms: −0.18 = −(+0.18) | existing `material_derivative_terms` (local −5e-5, advective +5e-5, total 0 K/s) |
| W11 | The balance, seen from the balloon: "Why does the balloon stay at 13? In one hour it moves 18 km towards the warm side, to where the map read 13.18 an hour ago. But in that hour every place has cooled by 0.18. The two cancel: 13 + 0.18 − 0.18 = 13." | A two-term balance bar on the clock: "moved to a warmer spot +0.18 t" and "every spot cooled −0.18 t" → sum 0, balloon 13.00, at t = 1, 2, 3 h | **New:** recorded `dot(∇T, v t)` = +0.18 t (t = 1, 2, 3 h) and local part −0.18 t from the sliding field at the balloon's place. For a straight-line (linear) field and a uniform wind this split is exact at finite t |

**Which way the cause runs.** The parcel keeps its temperature (an assumption about the physics). Therefore the
pattern is carried by the wind. Therefore fixed points cool. W11 is only bookkeeping: the pole does not cool "in order
to" keep the balloon at 13 °C.

**Honesty notes**
- Every moving thing above traces to `fluidpy.geo.vectors` (`dot`, `scalar_projection`, `projection`, `norm`,
  `angle_between`), `fluidpy.core.operators.gradient` (∇T), and `fluidpy.core.kinematics.material_derivative_terms`
  (local, advective and total rates).
- The sliding field T(x, t) = T_W + G (x − vₓ t) is the exact solution of DT/Dt = 0 for a uniform wind.
  `material_derivative_terms` checks it independently, by finite differences: total = 0 and local = −v·∇T, at the pole
  and along the balloon path.
- v4's "pole series" is the formula Tp1 = 13 − adv·t. v5 should evaluate the field instead and assert that the two
  agree.
- v4's s18 isotherm shift (`shift = wx.v_x * (drift*60)/1000`) and s19 `far` point are computed **in the composition**.
  This is minor, but it breaks "the composition never recomputes physics". Precompute `iso_x_km` per minute sample.

**s20 (the steeper map), beats**
1. "Now make the temperature change twice as fast across the map: one degree every **50 km** instead of every 100.
   The isotherms move twice as close together."
2. "∇T doubles: 1 K over 50 000 m = 2 × 10⁻⁵ K/m."
3. "The wind is the same, so its shadow on ∇T is still 5 m/s: the shadow belongs to the wind."
4. "v·∇T = 5.00 × 2 × 10⁻⁵ = 1.0 × 10⁻⁴ K/s; × 3600 = **0.36 K/h**, twice 0.18. The pole now falls twice as fast:
   13.00 → 12.64 after one hour."
5. "The shadow alone could not know this. Only multiplying by the length of ∇T brings in how steep the temperature
   map is."

This is the same lesson as the work scene, and the narration should say so.

Data: all of these numbers already exist (`adv2`, `sh_v2`, `Tp2`, `material_derivative_terms` G2). Add display
terms 5.00 × 2.00e-5 and one check row: 1 °C/50 km = 2e-5 K/m.

---

## 3. s11 work (vector F, vector d)

| # | Idea | Screen | Data |
|---|---|---|---|
| K1 | "Here is a physics example. Pull a sled with a force of 20 newtons, angled 60° above the ground. Force is a vector: it has a size and a direction." | Arrow **F**, 20 N at 60°, with F = (10.0, 17.3) N under it | existing `F` |
| K2 | "The sled moves 5 m along the ground. That move is also a vector, called the displacement **d**: an arrow from where the sled starts to where it stops." | Arrow **d** = (5, 0) m along the ground | existing `D5` |
| K3 | "Only the part of the force along the motion helps the sled move. That part is the shadow of F on d: 20 × cos 60° = 10 N. The 17.3-N part pulls straight up, across the motion, and does no work." | Drop-line from F's tip; shadow 10 N (teal); 17.3 N (muted) | existing `scalar_projection(F, d)` = 10 |
| K4 | "The work is that 10-newton force times the distance: 10 N × 5 m = **50 joules**." | W = 10 N × 5 m = 50 J; also as components F·d = 10.0 × 5 + 17.3 × 0 = 50 J | existing `W_series[0]`; **new** display terms 10.000×5, 17.321×0 |
| K5 | "Now pull the same sled twice as far, 10 m. The shadow is still 10 N; it has not changed at all. But the work doubles: 10 N × 10 m = **100 joules**." | d grows from 5 to 10 m (the existing 51-sample series); shadow label fixed at 10 N; W counts 50 → 100 J | existing `W_series`, `shF10` |
| K6 | "That's the point. The shadow, F cos θ, is not yet the work, because it does not know how far the sled went. To get the work we must multiply it by the length of the other arrow, \|d\|. That is exactly what the dot product does: W = F·d = \|F\| cos θ × \|d\|." | One line W = F·d = (\|F\| cos θ) × \|d\| = 10 × 5 = 50 J, with "shadow" and "the other length" pointed to | existing |

Optional link to s09 (order does not matter): "The shadow of d on F is 5 × cos 60° = 2.5 m, and 2.5 m × 20 N is also
50 J." This needs a **new** recorded `scalar_projection(d, F)` = 2.5.

---

## 4. Wording in v4 that is wrong or misleading

| ID | Scene | v4 wording | Problem | Say instead |
|---|---|---|---|---|
| W1 | s17 (narration and screen) | "Each hour, the air gains eighteen kilometres towards warmth, reaching spots that were point one eight degrees warmer"; the column "rate in TIME: **what the moving air parcel meets**, 0.180 K per hour"; "after 1 h the parcel is over a spot that was 0.180 °C warmer" | **The main cause of the user's confusion.** The map is frozen (`shiftKm = 0`), so the screen implies the balloon's reading rises 0.18 K/h. That is the ∂T/∂t = 0 scenario, the opposite of s18's DT/Dt = 0. "Gains … towards warmth" sounds like warming. | Drop the frozen-map framing. Use W4–W8: "the wind carries air 18 km per hour across the isotherms, from the cold side towards the warm side, so the air over the pole is replaced by colder air". If 13.18 is ever shown, label it "where the map read 13.18 an hour ago" and use it only in the W11 balance. |
| W2 | s17 | "rate in TIME" for v·∇T | v·∇T is the advection term, not the rate anyone measures (with DT/Dt = 0 the pole measures −v·∇T and the balloon measures 0) | Keep "space vs time" only as: 1 °C per 100 km is a rate in space; 0.18 °C per hour is how fast the pole's temperature changes. |
| W3 | s13 | "The last term is the change from being carried across the map: the advection of phi" | Ambiguous about whose change. v·∇φ is the **difference** between what the moving thermometer and the fixed thermometer see. The convention clash in S1 also applies. | Plain-words definition, §5 Q6 |
| W4 | s15 | "Grad T points **uphill**, towards warmer air; its length is how steep the map is" | Jargon (U-M3.17). "Steep" is undefined for a temperature map. | "∇T points the way temperature increases fastest, straight across the isotherms from colder to warmer. Its length is how many degrees the temperature rises per metre in that direction." |
| W5 | s18 | "the pattern slides with the wind" | True only here: DT/Dt = 0 **and** a wind that is the same everywhere. With a wind that varies from place to place, the pattern is stretched and bent. With heating, it is not merely carried. | "Here, where the wind is the same everywhere, the whole pattern slides along with the air. Because the isotherms are straight north–south lines, we only see them move east, 18 km each hour." |
| W6 | s16 | "a wind of ten metres per second blows sixty degrees from grad T" | Weather "from" names the source direction (S2) | "…blows at sixty degrees to ∇T" |
| W7 | s15–s16 | "ten to the minus five kelvin per metre" right after "1 °C per 100 km" | °C vs K is never explained; the conversion is not shown | "A change of one degree Celsius is a change of one kelvin, so 1 °C per 100 km = 1 K per 100 000 m = 10⁻⁵ K/m." |
| W8 | s21 | "the wind's warming or cooling" | The wind does not heat anything; it carries warmer or colder air | "how fast the wind changes the temperature at a fixed place, by bringing in warmer or colder air" |
| W9 | s10 → s16 | v = (6, 8) m/s in s10, then a different wind v = 10 m/s at 60° | Same letter, two winds | Say "another wind" in s16, or use the same wind in both. Note: (6, 8) has \|v\| = 10, so a 53.1° angle would reuse it. That changes the 5.00/8.66 split to 6/8 and needs a re-run, so keep it optional. |
| W10 | s12 | "Its rate, capital D T by D t, is the material derivative" | Correct, but "material" is never explained | "'Material' because it follows the same piece of material, the same air parcel." |
| W11 | s14 | "The thin lines are isotherms" | An isotherm map is a **snapshot** at one moment (U-M3.19a) | "…lines of equal temperature **at this moment**; we'll see in a minute that they can move." |
| W12 | composition | s18 `shift` and s19 `far` computed in TSX | Breaks the "composition only indexes data" rule (minor) | Precompute in the build |
| W13 | s04, s07 | "= 8.000", "= 2.530" after rounded factors | R1, R2 | as in §1 |
| W14 | various | time compression 1 h in 3 s (s12), 4 s (s17, s18), 6 h in 6 s (s19, s20) | Clock speed changes between scenes in the one story that needs a steady clock | One rate for s16–s19 (1 h in 4 s), a visible "0 h / 1 h / 2 h / 3 h" clock; s20 may say "faster clock" |

Checked and correct (keep): "partial means only time changes; the place stays fixed"; air parcel = "a small volume
of air that moves with the flow"; "material derivative = the rate following an air parcel";
∂T/∂t = −v·∇T derived by subtraction; the upwind dots equal the pole's later readings; "the shadow belongs to the
wind".

---

## 5. Answers to the user's questions (to relay)

1. **What does 0.18 K per hour mean? Whose temperature, where, and with what sign?** It is the size of the advection
   term v·∇T. The wind carries air across the isotherms at 5 m/s, which is 18 km each hour. The temperature changes
   by 1 °C per 100 km. So each hour the air over any **fixed spot** is replaced by air from 18 km further towards the
   cold side, which is 0.18 °C colder. If air keeps its own temperature, the **pole's** thermometer **falls** by 0.18 °C
   per hour (13.00 → 12.82 → 12.64 → 12.46). The **balloon's** thermometer stays at 13 °C. Nothing anywhere warms
   at 0.18 °C per hour. (1 K = 1 °C for a change.)

2. **Where does 8.66 m/s come from, and why mention it?** It is 10 × sin 60°, the part of the 10 m/s wind that blows
   **along** the isotherms. 10 × cos 60° = 5 m/s is the part straight across them. Moving along an isotherm keeps you
   at the same temperature, so the 8.66 m/s part changes nothing (8.66 × 0 = 0). Only the 5 m/s shadow on ∇T
   matters. That is why the dot product uses the shadow.

3. **Are the isotherms a snapshot? Do they change?** Yes, the map is a snapshot. If each air parcel keeps its
   temperature and the wind is the same everywhere, the whole pattern is carried along with the air. Here the
   isotherms move east by 18 km every hour. (If the wind varied from place to place, the pattern would also stretch
   and bend; with heating it would change in other ways too.)

4. **Colder air from the lower left?** Right. Lower left is **upwind**, where the wind comes from, and that is the cold
   side. The air that will sit over the pole in 1, 2, 3 hours is now at 12.82, 12.64 and 12.46 °C, so the pole cools.
   Small correction to "the wind is getting colder": the air does not get colder; colder air arrives.

5. **Why does the balloon stay at 13 °C while the pole falls? The user's reading checked.**
   - *Right:* in one hour the balloon moves to a place where the map **used to read** 13.18 (+0.18). In that same hour
     every place has cooled by 0.18 (−0.18). The two cancel, 13 + 0.18 − 0.18 = 13. In symbols:
     DT/Dt = ∂T/∂t + v·∇T = −0.18 + 0.18 = 0.
   - *To fix:* the cause runs the other way. We **assume** the parcel keeps its temperature. That forces the pattern
     to be carried, and **that** makes the pole cool. The pole does not cool "in order to" keep the balloon at 13, and
     the pole's fall is not "why" the balloon stays the same.
   - Also, "advection +0.18 K/h" does not mean anything warms. The **plus** sign means the wind blows from the cold side
     towards the warm side. The minus in ∂T/∂t = −v·∇T turns that into cooling at a fixed spot. Forecasters call it
     cold advection.

6. **Advection, in plain words.** Advection means *carrying something along with a flow*. The wind carries air, and
   the air carries its temperature, its moisture and its smoke with it. At a fixed place, things change because
   different air arrives. The term v·∇T measures how fast this happens: the speed of the wind straight across the
   isotherms, times how fast temperature changes across them. In the equation it is the difference between what the
   moving thermometer sees (DT/Dt) and what the fixed one sees (∂T/∂t).
   - **Local rate ∂T/∂t:** how fast the temperature changes with time at one fixed place (the pole).
   - **Material derivative DT/Dt:** how fast it changes for a thermometer riding with the same air parcel (the
     balloon). "Material" = following the same material.
   - **∇T ("grad T"):** an arrow made from the two slopes (∂T/∂x, ∂T/∂y). It points the way temperature increases
     fastest, at right angles to the isotherms, and its length is the degrees per metre in that direction. This
     replaces "uphill".
   - **Isotherm:** a line joining places that have the same temperature at one moment.

7. **s11, why multiply the shadow by \|d\|?** F (force) and d (displacement, start to end) are both vectors. The
   shadow F cos θ = 10 N is the part of the force along the motion, and it stays 10 N however far you pull. Work must
   grow with distance: 10 N × 5 m = 50 J, and 10 N × 10 m = 100 J (double the distance, double the work). So the
   shadow must be multiplied by the length of the **other** arrow, \|d\|. That is exactly W = F·d = \|F\| cos θ \|d\|.

8. **s20.** 1 °C every 50 km = 1 K / 50 000 m = 2 × 10⁻⁵ K/m, so ∇T doubles. The wind's shadow is still 5 m/s.
   v·∇T = 5 × 2 × 10⁻⁵ = 10⁻⁴ K/s = 0.36 K/h, twice as fast: the pole now reads 12.64 °C after one hour.

---

## 6. New build-script items for v5 (summary)

All of these use tested functions only. The composition only indexes the results.

| Item | Function | Value / check |
|---|---|---|
| Along-isotherm part brings no change | `vectors.dot(v_along, ∇T)` (recorded) | 0; plus check row v_along[1] = 10 sin 60° = 8.660 |
| Sliding isotherms | x_iso(t) = x_iso,0 + `scalar_projection(v, ∇T)` · t, one sample per minute | 18.0 km/h; replaces the JS `shift` |
| Pole series from the field | evaluate T(pin, t) on the sliding field; assert equal to 13 − 0.18 t; `material_derivative_terms` local = −5e-5 K/s at the pin | 13.00, 12.82, 12.64, 12.46 |
| Balloon series | T(pin + v t, t) constant; `material_derivative_terms` total = 0 along the path | 13.00 |
| Balance terms at t = 0, 1, 2, 3 h | `dot(∇T, v t)` (recorded) = +0.18 t; the local part at the balloon's place = −0.18 t | sum 0 |
| 12 °C isotherm over the pole (optional) | (T_pin − 12)/(v·∇T) | 5.56 h |
| s11 component terms, plus optional reverse shadow | display 10.000 × 5, 17.321 × 0; `scalar_projection(d, F)` | 50 J; 2.5 m × 20 N = 50 J |
| s20 display terms | from `adv2` | 5.00 × 2.00e-5 = 1.00e-4 K/s → 0.360 K/h |
| Rounding fixes | display only | R1, R2 |
