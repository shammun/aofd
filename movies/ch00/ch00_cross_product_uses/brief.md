# ch00_cross_product_uses — brief (movie-director, 2026-10-27)

Series position: **#3** of the approved plan v2, after #2 `ch00_cross_product`. Second split of `ch00_cross_product_why`
(v4 fix 2, commit 45406d0). House style binding. **Ending: the weather/climate ending** (HOUSE_STYLE §3 second variant,
word for word; concept "the cross product in physics").

## Stands on its own
Two short recap scenes (s02, s03) say what the cross product is (recipe, (0, 0, 14), area, right hand, swap, the part
across), mostly with v4's own sentences and audio, and point to #2.

## What it teaches
1. **Turning:** the door (no dot product now), torque τ = r × F with the part across (v4 s20–s22).
2. **Spin:** angular momentum L = r × p (v4 s22c) and **spinning up** when the string is pulled in (new s22f:
   0.5 m × 6 = 0.25 m × 12 = 3; skater; air spiralling into Hurricane Ian spins faster, with friction taking some away,
   shown on Ian's HRRR wind profile).
3. **Moving charges:** F = q v × B (v4 s22d) and **the aurora** (new s22g: helices along field lines, ovals near the
   magnetic poles, the VIIRS Day/Night Band image of the 10–11 May 2024 storm).
4. **The perpendicular push** turns without speeding up (v4 s22e) and a **uses grid** (new s19u).
5. **k × u**, why exactly 90° (v4 s23, s23a), **a spinning wheel v = ω × r** (new s23b, UV2-10's "spinning wheel"),
   then Earth: Ω, position vector, v = Ω × r derived (v4 s24–s25b).
6. **Coriolis preview** through the cross products: merry-go-round, the two Ω × u pieces, the 2 and the minus, Ω split,
   −f k × u, f, NH right / SH left, size, globe loops (v4 s26–s31); real winds, Ian, Idai, r × u spin (v4 s32–s38).
7. **Geostrophic preview:** one round low, ∇p, k × ∇p, adjustment, why the balance, the maths, numbers, Ciarán (v4
   s39–s46) and **today's map** (new s46a: GFS 18 UTC 27 Oct 2026 on GOES-19, geostrophic arrows vs the real 10-m
   winds).

## Cross-references (spoken, `related:` per scene, end card)
#2 cross product (s02) · #8 curl and #34 vorticity (s23b, s38) · #29 Coriolis (s26) · #48 general circulation (s34) ·
#6 gradient (s40) · #30 geostrophic wind (s41a) · #10A vector identities (s42) · #45/#42 storms (related lists only).
End card: six faint related thumbnails (#2, #8, #29, #30, #34, #45).

## Review-3 fixes folded in
R3-S1 (s20, s28a, s27a, s22c, s25a + cosmetic list), R3-S2 (s25b r label), R3-S3 (door in s04 and s22), C1 (s25a,
s26d, s28a–c, s29, s46), C3 (s42), C5 (s37), C6 (s39–s40a, s22e).

## Depth boundary
The Coriolis and geostrophic material stays at v4 depth (a preview through the cross product). #29 and #30 re-derive
everything from scratch (user rule) and go further (inertial oscillations in real drifters, β, ageostrophic wind…).

## Music and sound
A new score, **spin-and-push** (F-sharp minor → A major, 5/4 at 104 bpm, pluck ostinato + strings + frame drum + glass
line, air noise from s23; seed 23; to be added to `tools/sound/styles.py`); quiet effects: storm_bed under Ian/Idai,
wind_gusty under Ciarán, wind_gentle under the trades/westerlies and today's map.

## Length
Measured: see `script.md` header.


## Update 2026-10-28 (movie-director): this supersedes the sections above where they differ
The plan is now in `storyboard.yaml` and `script.md` (55 scenes, measured 40:23.2).

**What changed:**
- **Torque and door moved to #2.** This movie opens with three recaps (s01a–c) and s04_torque_recap. That scene adds the
  torque-vs-joule misconception: the same unit, but a different quantity (cross vs dot).
- **New scenes:**
  - s46b_ekman: the same quarter turn in the ocean, M_E = −(1/f) k × τ; 90° for the whole layer, 45° only at the
    surface.
  - s46c_upwelling: California, a real OISST day; cross then dot.
- **Upgraded scenes:**
  - s22e: flat energy bar, plus the pointer to the dot product's "a push across does no work".
  - s23: compass rose.
  - s24: Earth anticlockwise seen from above the North Pole.
  - s30: "only steers"; the inertial circle is named; 17 h is now a CHECK row.
- **Review-3 fixes:** R3-S1, R3-S2 (s25b), C1/C3/C5/C6, in the `visual` lines.
- **Ending:** the weather/climate ending in its **ocean** wording (meteorology, oceanography, atmospheric and climate
  science), because the movie now ends with an ocean application.
