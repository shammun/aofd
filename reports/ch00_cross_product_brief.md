# Movie `ch00_cross_product_why`: the approved brief (user, 2026-10-25)

This is the second video of the Chapter 0 maths series, coming straight after `ch00_dot_product_why`.

**House style:** `movies/HOUSE_STYLE.md` is binding. The reference movie is `ch00_dot_product_why` v6.

**Length:** whatever the teaching needs. The user wrote "fine even if it crosses 25 minutes"; the expected length is about 22–27 min. The main objective is excellence, so add scenes rather than compress.

## User decisions (2026-10-25)
| ID | Decision |
|---|---|
| U-CP.1 | Approved the plan in this file. Recommendations accepted: no vorticity section, only a pointer to the later grad/div/curl video; right-hand rule shown with both a 3-D hand and a screw or bottle cap; torque with a spanner and a door as the everyday example. |
| U-CP.2 | **Link to the dot-product video** near the start. Say what we learned there, why the dot product is not enough (door torque; it cannot tell left from right), and how the cross product differs. Refer back to the dot-product examples (a = (5, 1), b = (1, 3); shadow; ∇T; isotherms → isobars) throughout. |
| U-CP.3 | **Real maps, real 3-D globes**: trade winds and westerlies turned by Coriolis on a real globe with real reanalysis winds; hurricanes on a real 3-D globe, anticlockwise seen from above in the Northern Hemisphere and clockwise in the Southern. "Real geography, so everything can be shown very clearly." Time is no object; aim for the best animation. |
| U-CP.4 | Coriolis and geostrophic wind are explained **from scratch but at basic level**, about 3 min each. Coriolis: what −2Ω × u does (the turning) and where f = 2Ω sin φ comes from, but not the rotating-frame derivation, which gets its own video. Geostrophic: what it is from scratch and how the equation u = (1/fρ) k × ∇p shows it, on a real weather map. |
| U-CP.5 | **Right-hand rule: show all the ways and all the directions.** Every orientation must appear: x × y = z, y × z = x, z × x = y and their reverses; arrows pointing up and down, left and right, into and out of the screen; seen from the top, from below, from the side; the hand turned to each orientation; the thumb flipping when the order is swapped; the curl-the-fingers version, the flat-hand (fingers and palm) version and the screw version. Use three.js with an orbiting camera so the 3-D is obvious. |
| U-CP.6 | Series order approved: (1) dot ✅, (2) cross (this movie), (3) grad / div / curl + Gauss and Stokes, (4) the climate machine, (5) air and seawater basics, (6) a spinning planet (the Coriolis video), (7) reading weather maps (isobars, highs and lows, Buys-Ballot, geostrophic in full), (8) coordinates on a sphere, (9) stability and buoyancy, (10) Taylor series, linearisation and scaling. Later, just in time: waves maths (before Chapter 6), water in the air (before Chapter 18), reading climate figures (before Chapter 14). |

## Scene plan (approved)
1. **Opening title** (house style). "The cross product / made easy / and how meteorology uses it", with a 3-D animation: two arrows sweep while a × b rises and shrinks with the parallelogram's area, then a cross-fade to a spinning globe with a wind arrow turning right.
2. **Link to the dot-product video.** The dot product is a number, a shadow, and it told us about advection. It is not enough:
   - **The door.** At a right-angle push the dot product is 0, yet the door turns the most. Along the door the dot product is largest, yet nothing turns.
   - **The wind.** The dot product cannot tell left from right.
   - So we need a product that is largest at right angles and gives an axis.
3. **Building blocks.** a = (5, 1, 0) and b = (1, 3, 0): a · b = 8, but a × b = (0, 0, 14). Show the three-component formula built one component at a time. The length is |a||b| sin θ = 5.099 × 3.162 × 0.869 ≈ 14, which is the parallelogram's area, with a gold link from the area to the 14.
4. **Right-hand rule, every way and every direction** (U-CP.5), in three.js. Then the cases:
   - same direction gives 0;
   - right angle gives the largest value;
   - opposite gives 0;
   - swapping the order flips the arrow.
5. **Dot vs cross summary grid:**

   | | Dot | Cross |
   |---|---|---|
   | Result | number | arrow |
   | Angle factor | cos θ | sin θ |
   | Picture | shadow | area |
   | Largest when | same way | right angle |
   | Order | doesn't matter | flips the sign |
   | Mechanics | work | torque |
   | Weather | v·∇T (advection) | k × ∇p (turning) |

6. **Torque**, with a spanner and a door. A 50 N push on a 0.3 m spanner gives 15 N·m at a right angle and 7.5 N·m at 30°.
7. **The turning tool k ×.** It rotates any flat arrow 90° to the left, shown on a map.
8. **Coriolis basics, about 3 min:**
   - Ω is the spin arrow along Earth's axis; a point on the ground moves at Ω × r, which is 465 m/s at the equator and 0 at the poles.
   - Air is turned right in the Northern Hemisphere and left in the Southern.
   - f = 2Ω sin φ, where Ω sin φ is the shadow of Ω on the local vertical (a dot-product link).
   - The turn is −f k × u.
9. **Real 3-D globe with long-term mean surface winds** (reanalysis). The trade winds blow from the subtropical highs towards the equator and are turned westward; the westerlies are turned eastward. The camera flies over the Atlantic and the Pacific. Reanalysis is defined in words.
10. **Real hurricanes on a 3-D globe** (ERA5 at 0.25°): Hurricane Ian (2022, Gulf of Mexico / Florida) turning anticlockwise seen from above, and Cyclone Idai (2019, Mozambique Channel) turning clockwise seen from above. The inflow is turned right in the north and left in the south.
11. **Geostrophic basics, about 3 min:**
    - Isobars are lines of equal pressure, like the isotherms of the dot-product video.
    - The pressure push runs from high to low; Coriolis turns the air until the two forces balance, so the wind blows along the isobars with low pressure on its left in the Northern Hemisphere.
    - Read u = (1/fρ) k × ∇p piece by piece.
    - Worked example: 4 hPa over 400 km gives about 8 m/s.
    - Show it on a real weather map of a real North Atlantic storm.
12. **Recap**, then the series end card. Mention that later videos cover Coriolis, weather maps, and grad, div and curl.

## Data (via `fluidpy.data.fetch()` and the disk guard; credits in the storyboard and manifest, never on screen)
- **ERA5 at 0.25°** (ARCO-ERA5 zarr, anonymous):
  - Hurricane Ian around 2022-09-27/28: 10 m wind and mean sea-level pressure.
  - Cyclone Idai around 2019-03-13/14: the same fields.
  - A North Atlantic winter storm: mean sea-level pressure and 10 m or 850 hPa winds (the data-scout picks a well-known case).
  - Small time and area subsets only.
- **Long-term mean surface winds:** ERA5 monthly climatology or NCEP long-term mean, at 1° or coarser.
- **Imagery and coastlines:** NASA Blue Marble (public domain) for the globe texture; Natural Earth coastlines.
