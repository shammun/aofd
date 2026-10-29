# ch00_weather_basics — user feedback round 2 (2026-10-29)

Source: the user's `outputs/viewing_2026-10-29/weather_basics/prompt.docx` (+ `1.png`, a frame at about 0:33), on
`weather_basics_v4_uf1.mp4` (v4 UF1, commit a3e6a23). The timestamps below refer to that file. Everything here must be done
in the next weather build (UF2). The general rules (G1–G6) apply to **every** movie with a 3-D globe, image or layer
view (also recorded in `movies/HOUSE_STYLE.md` §5b).

## General rules (all movies)
| ID | Rule |
|---|---|
| G1 | **Globe framing as in the cross-product video at 29:30** (`cross_product_part2_centrifugal_review_pending.mp4`): the 3-D globe gets a large frame (most of the screen's height and width); when it zooms, rotates or flies to a place, its top, bottom, left and right edges **fade out softly**, so the viewer never sees the box of the 3-D area. Fades are only needed when the globe is zoomed or cut by its frame; an unzoomed whole globe needs none. |
| G2 | When a globe zooms in, text may fade out or move behind, and the globe may take over the main space. |
| G3 | **Source lines and labels go fully below the image or globe**, never on top of any part of it (e.g. 0:33 "Image: NASA VIIRS…" sits on the globe; 20:34 and 27:01 too). Check every frame. |
| G4 | **No text over images or other text**, anywhere (e.g. 27:07 "29/18 ≈ 1.61" on "1 kg of vapour"; "molecule share = 1.61 × mass share" on the text above). Inspect every frame. |
| G5 | **Air slabs and columns: every vertical edge goes all the way to the top** (3:26: the white corner lines stop below 20 km). Add edges to every slab or column frame. |
| G6 | **Vertical layer stacks** (like `G:/…/captests/X3_stacked_levels/threejs_layer_stack/X3Stack.mp4`, but with many more layers): use them wherever a variable changes with height and the stack adds understanding, with the camera flying round, through, inside and below the stack. Never the same stack, data and place in several movies (no monotony). Not where it adds nothing. Decide per movie, including dot product, cross product, vectors and later ones. |

## Weather basics items
| ID | Time (v4 UF1) | Feedback | What to do |
|---|---|---|---|
| U2-01 | 0:32 onward | Zoomed globe cut off at top and left | G1: larger globe frame, soft edge fades while zoomed |
| U2-02 | 0:33 (`1.png`) | The "× 40" circle with blue stripes is unclear | Remove it, or replace with a much simpler, explained picture of how thin the atmosphere is (e.g. true-scale shell on the globe, then a slice ×N labelled and spoken) |
| U2-03 | 0:33 | Source line on the globe | G3 |
| U2-04 | 2:28–2:30 | Parcel: blue trail line distracting | Remove the trail line |
| U2-05 | 2:28–2:30 | Parcel should look like a parcel | Many small dots moving inside the 3-D parcel box (molecules jostling) |
| U2-06 | 2:28–2:30 | Green wind arrows static | Animate the arrows (flowing, e.g. moving dashes or particles along them) |
| U2-07 | 3:26 | Column corner lines stop below 20 km | G5: all edges to the top; same for every slab frame |
| U2-08 | 10:35 | Hydrostatic equation runs off the right edge | Fit the whole ∂p/∂z = −ρg inside x ≤ 1840 |
| U2-09 | 12:45 | "If the pressure kept falling at its starting rate it would reach zero after exactly H" — not understood; then "it never gets there… H is the size of the climb that matters… how deep the atmosphere is…" — lost | Rewrite slowly with a picture: the tangent at the ground (slope −p₀/H) is a straight line that hits zero at z = H; the real curve bends away because the fall per metre is p/H, which shrinks as p shrinks; at z = H the real pressure is p₀/e ≈ 37 %, not zero. Say what H is and what it is **not** (not the top of the air) |
| U2-10 | 13:19 | "H = how deep the air is", warm vs cold — is there no air above H? | State clearly: air continues far above H; H is a **scale** (the height over which pressure falls by a factor e), not a lid |
| U2-11 | 13:38–13:40 | "T = 15 °C": temperature of what, where? | Say: we assume the whole column has one temperature, 15 °C (a typical surface value), to keep the sum simple; real columns get colder upward (later) |
| U2-12 | 13:48 | "H = 8.43 km" — height of what, what does it mean? | Explain the meaning for 15 °C air: climb 8.43 km and the pressure is down to 37 %; climb 2 × 8.43 and it is 14 % … |
| U2-13 | 13:48–14:30 | The "squash all the air to sea-level density" box is confusing (squash vs expand, which "real one", density changing) | Rebuild as a clear thought experiment, no expanding: "Take all the air above 1 m² (its weight is 101 325 N — that is what sea-level pressure means). Pretend air could not be squashed: every cubic metre has the sea-level density 1.225 kg/m³ all the way up. How tall a pile of this uniform air weighs the same 101 325 N? Height = p₀/(ρ₀g) = 8.43 km." Show the real column (thinning, endless) beside the pretend uniform block (sharp top), same weight. Then say: this is only a way to picture H — the real air is not uniform and has no top |
| U2-14 | 17:37 | "Each metre takes away 1/H of the pressure"; "1 km / 8.43 km"; "1 − e^(−1/8.43)" — no basis given | Show where it comes from: dp/dz = −p/H means a small climb Δz loses Δp ≈ p·Δz/H, so the *fraction* lost is Δz/H (km over km: a pure number, not a pressure). For a 1-km climb that estimate is 1/8.43 ≈ 12 %; the exact fraction over a whole km follows from p = p₀e^(−z/H): p(1 km)/p(0) = e^(−1/8.43) ≈ 0.888, so 1 − 0.888 ≈ 11 % — less because p shrinks during the climb |
| U2-15 | 18:34 | "why the curve bends" — new words out of nowhere | Use the words already used (e.g. "why the pressure falls more slowly higher up"); if "curve" is used, it must point at the drawn pressure–height line |
| U2-16 | 20:34 | Source line sits on the bottom of the image | G3 |
| U2-17 | 20:45 | "From its drift we get wind" | Say "From how the balloon drifts, we get the wind at each height" |
| U2-18 | 22:18 | "our car 5.8 km"(?) — unclear; "a little lower than our 5.8 km" | Fix the label (spelled out, no abbreviations); say clearly: 5.8 km is our own estimate of the half-pressure height from H; the measured value (NOAA/IGRA sounding, named) is about 5.5 km, a bit lower than our estimate |
| U2-19 | 27:01 | Zoomed globe: left/right edges cut; source line on globe | G1, G2, G3 |
| U2-20 | 27:07 | Text over text and over the image (29/18, molecule share) | G4 |
| U2-21 | 30:25 | Thermals animation still dull | Real Landsat/Sentinel-2 or other real satellite land image as the ground; show warm air rising from the ground (thermals, parcels) over it, eye-catching |
| U2-22 | 41:29 | The vertical front slice is good — keep it | Keep as is; optionally add a layer stack **after** it if it adds value (decide) |
| U2-23 | whole movie | Find other places where a variable changes with height | G6: add many-layer stacks there (temperature, pressure, humidity, wind with height), with fly-round / inside / below camera |
