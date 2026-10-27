# ch00_cross_product_why — the user's review of preview_v2.mp4 (2026-10-27)

Source: the user's `prompt_cross_product.docx` + screenshots `pb_1.png` … `pb_6.png` (repo root, local, not committed).
Timestamps are v2 times (33:26 cut); scene ids from `movies/ch00/ch00_cross_product_why/timing.json`.
These notes drive **v4** (a re-plan, not a fix loop). Length: allowed up to 50 min, hard max 52 min; only as long as the
teaching needs.

**Decision changes vs the brief (`reports/ch00_cross_product_brief.md`):**
- U-CP.4 said "no rotating-frame derivation". **Overridden:** the user now wants −2Ω × u derived and explained (where the
  2 and the minus come from), Ω × r derived (why v = Ω × r), and −2Ω × u → −f k × u derived step by step.
- The "why" of the cross product (why |a||b| sin θ, why perpendicular, what physical quantity it captures, more physics
  examples) must be expanded a lot, in the style of the dot-product movie (which explained *why* the dot formula).
- Avoid repeating the same cross-product reminders when they add nothing (UV2-24).

| # | v2 time | Scene | What the user asked | Kind |
|---|---|---|---|---|
| UV2-01 | 0:10 | s01 | Say: "In this video, we'll learn about the cross product, and see how this is used in meteorology to explain why the wind turns and why storms spin." | script (verbatim) |
| UV2-02 | 0:15 | s01 | Say: "Let's see what it is, why it's built the way it is, and what it tells us about the wind." | script (verbatim) |
| UV2-03 | 0:23 | s02 | Label the components on the plot: a = (5, 1) shown as 5 along x and 1 along y; b = (1, 3) likewise | visual |
| UV2-04 | 1:04 | s03 | The **r** label on the door is cut off at the door's edge (pb_1.png) — make it fully visible | visual |
| UV2-05 | 2:16 | s05 | Label the components of a and b on the axes (5 and 1; 1 and 3), from the first frame of the scene; keep the 3-component display at 2:35 (the user liked it) | visual |
| UV2-06 | 2:49 | s06 | "The answer is an arrow, so we need three components. Each one has a recipe." sounds mechanical and vague — say it specifically, in a natural tone | script |
| UV2-07 | 3:31 | s07 | Label a and b by components in the figure **and** write a = (5, 1, 0), b = (1, 3, 0) clearly (e.g. top left); the calculation itself is good | visual |
| UV2-08 | 4:20 | s08 | Vectors drawn without their component labels — label them (rule for the whole movie: whenever a numeric vector is drawn, its components are on screen, so nobody has to pause and go back) | visual, global |
| UV2-09 | 4:45 | s08 | Don't refer back to the dot-product video for |a| and |b|; compute the lengths right there (√(5²+1²), √(1²+3²)) | script + visual |
| UV2-10 | 5:50 → | s09–s10 (+ new) | **Big:** why |a × b| = |a||b| sin θ at all? What is the geometric intuition, what physical quantity does it capture, why is the result perpendicular to both, why is the length an area while the arrow points up/down? Why is it useful? Give real-life and physics examples beyond torque (e.g. angular momentum, force on a moving charge, a spinning wheel), say what a, b and a × b represent in each, and justify the formula the way the dot-product movie justified a·b. "Even after watching I'm lost about how this equation came and why it matters." | new teaching section |
| UV2-11 | 11:09 | s18 | The three **p** vectors have no labelled values — label them | visual |
| UV2-12 | 14:34 | s22 | **r** on the door cut off at the right edge again — fix | visual |
| UV2-13 | ~15:00 | s23 | User asks: is k a vector *around which* something turns? Answer this directly (k is the axis; k × turns a flat vector about it by 90°) | script |
| UV2-14 | 15:49 (and 15:03) | s23 | The map is pitch dark — use a **daytime satellite image** showing land structure (mix of land and ocean). Check every map/globe image in the movie for the same problem | imagery, global |
| UV2-15 | 15:32 | s23 | Why would anyone compute k × u? What does the northward result mean physically / geographically? | script + visual |
| UV2-16 | 15:38–15:40 | s23 | Why exactly 90° to the left — why not 30°, 40°, 2°, −40°? Why would we want to tweak the wind direction at all? Explain the logic | script + visual |
| UV2-17 | 15:50 | s23 | k × (westward-pointing case): in real life where does a 90°-left rotation of the wind happen, who needs it, why? | script |
| UV2-18 | 15:52–15:54 | s23 | "k × is a turning tool": why would we want a product of two vectors that rotates something? Explain well | script |
| UV2-19 | 16:08 | s24 | Yellow dashed axis (pb_2.png): must pierce the globe exactly at the North and South Poles; now the southern part lies on top of South America and the dashes are drawn over the globe. Fix the drawing code (depth/occlusion and pole position) | visual (code) |
| UV2-20 | 16:53 → 17:22 | s25 | The cut-away Earth is hard to read (pb_3.png) — the radius view right after it is good. **r is a vector?** Explain the position vector (from a point on the axis/centre to the place, with direction). **Why v = Ω × r?** Derive it simply and in detail with intuition (speed = Ω × distance from axis = Ω r sin θ; direction = along the circle of latitude ⇒ exactly the cross product) (pb_4.png) | script + visual + derivation |
| UV2-21 | 18:28 | s26–s28 | Ω and k are neither east nor north — the user reads this as "four directions" (east, north, Ω, k). Clarify: still 3-D; k is local up out of the ground; Ω is along the Earth's axis and splits into a north part Ω cos φ and an up part Ω sin φ (pb_5.png) | script + visual |
| UV2-22 | 18:35 | s27 | "−2Ω × u for each kilogram of air": show exactly how and why — where the 2 comes from and what the minus means | derivation (new) |
| UV2-23 | 18:55 | s28 | f = 2Ω sin φ frame and its equations are "a nightmare": expand, derive every equation shown, add the geometric interpretation | derivation + visual |
| UV2-24 | 19:50 | s29 | −2Ω × u → −f k × u (flat winds) has no derivation (pb_6.png): show in detail why these are the same for flat winds and what each side represents | derivation (new) |
| UV2-25 | 20:55 | s31 | The two parcels at 45° N / 45° S start over sea — use land locations (or the nearest sensible land) and a daytime image | imagery + data |
| UV2-26 | 21:25–21:28 | s31 | Re-check that the parcel's movement direction on the globe is physically correct; understand and fix if needed | physics check |
| UV2-27 | 22:22–22:28 | s33 | Make sure the trade winds are shown and described correctly | physics check |
| UV2-28 | 22:43–23:04 | s34 | Same for the westerlies; tie everything to the cross product where it helps, but drop repeated reminders that only add length | physics check + script |
| UV2-29 | 28:13 → 28:50 | s41–s43 | Too many new equations at once; "Coriolis equals pressure push" not understood; the maps from 28:46 are unclear. Explain what k × ∇p means physically (∇p points to high pressure; k × ∇p is the along-isobar direction), the geometric reasoning, why the balance happens, and step every equation | script + visual + derivation |
| UV2-30 | 28:38 | s42 | "geostrophic" is mispronounced — fix in `movies/lexicon.yaml` and check by ear on the TTS output | audio |
| UV2-31 | 30:20 | s45 | Storm Ciarán: use a **satellite image** of the storm (coastlines visible), and overlay administrative boundaries (shapefile) of the areas it crossed | imagery + data |

Also (from pb_3.png / pb_4.png): the cut-away "heart" shape and the Ω arrow drawn over it look wrong — redesign the
cut-away so it reads as a sliced Earth with the axis inside it.
