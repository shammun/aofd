# Coordinates series: lessons from Part 1, applied to every part (user, 2026-11-05)

The user asked that all their Part 1 feedback apply to Parts 2–7. Everything must be explained in detail. Nothing is shown without being derived or worked. Every mathematical symbol and notation must render correctly.

Each part's builder checks its own part against every row below. Each row comes from the user's own notes, Part 1 review 1, the calculation audit (C1–C43), review 2, or K6.

## A. Calculations and derivations (user notes 11:23 and 11:37; audit C1–C43)
- [ ] A1 **No result without its inputs.** Every spoken or shown number has its inputs and its arithmetic on screen, one line per spoken phrase. This covers unit and degree↔radian conversions, square roots with the actual squares, dot products term by term, divisions, and averages (the sum and the count).
- [ ] A2 **One move per step.** Signs get their own line: −(−a) = +a, and minus × minus = plus.
- [ ] A3 **Restate the rule on screen** whenever the voice uses a rule from earlier ("by the arc rule" → write s = r Δθ). Define tan, cos and sin from a triangle with labelled sides the first time they are used.
- [ ] A4 **Show checks independently.** A check of a formula must not use that formula. Before/after positions come from x = r cos θ, y = r sin θ. Length checks are spoken as well as shown.
- [ ] A5 **Say the change in the angle when the formula uses one.** If the screen shows Δθ, the voice says "the change in theta".
- [ ] A6 **Keep exact values consistent.** Use the same value on the map, in the column, in the voice and in the recap (one rounding). If an angle is rounded on screen (53.23°), its cos and sin are for the shown angle, or the row says which exact angle (53.2301°) is used.
- [ ] A7 **Restate inputs before a derived result.** E.g. 13.3 / 34.8 = 0.382 → tan⁻¹ ≈ 20.9° ≈ 21°, with the triangle drawn.

## B. Pictures follow the voice (user notes 11:23 and 43:15; review 2)
- [ ] B1 **Every zoomed or magnified view shows what it magnifies.** That means a wide view first, a zoom box or leader line, the label "magnified" or "drawn N× larger", and labelled before/after markers.
- [ ] B2 **Label every drawn shape when it is spoken.** Triangle sides carry their values; arcs carry their angles; a reference ray (e.g. east) is drawn for every angle.
- [ ] B3 **A row appears on the words that say it.** Keep it visible until its result is spoken; never let it vanish before then.
- [ ] B4 **The "If you skipped, here's what to keep" line shows its own picture** (the key idea), not leftovers from the optional block.
- [ ] B5 **Keep every icon, arrow and ring fully inside its box or panel**, including on the end-card icons, with at least 20 px margin. Keep all text inside x 60 … 1842 and out of the caption band.
- [ ] B6 **Paged or split columns keep their left-hand side visible** ("x′₁ =", "u_θ =") while the right-hand side pages.
- [ ] B7 **A vertical motion on a plan view is drawn as ⊙ (out of the screen) or ⊗ (into it)**, never as an up-arrow that reads as "north".

## C. Symbols and notation render correctly (user notes 13:06 and 15:23)
- [ ] C1 **Typeset maths symbols as maths everywhere** (TeX/KaTeX), including inside labels, keywords and captions on screen. This covers any symbol with a hat, dot, bar, prime, arrow, subscript or superscript (θ̂, r̂, x̂′, ū_r, u_θ, e′₁, v², 10⁻⁵). A combining accent in the plain sans font puts the hat beside the letter.
- [ ] C2 **Write fractions as `\dfrac`, at least 44 px.** Inline `\frac` is too small.
- [ ] C3 **Use one notation per quantity across all seven parts**: θ̂/r̂, u_r/u_θ, α for the axis turn, Δθ for a change.
- [ ] C4 **In a JS regex literal, a TeX command needs `\\`** (`/\\frac/`, `/\\mathbf/`). A single backslash silently matches something else. Part 2 found two bugs of this kind.

## D. Colours and data frames
- [ ] D1 **One colour convention in every part.** Tangential u_θ is teal, radial u_r is rose; the full wind and the radius are ink, never teal.
- [ ] D2 **Every data frame has its source line (below the image) and its colour bar,** including small inset or thumbnail maps.
- [ ] D3 **The recap is at full contrast.** Each recap beat stays at full strength until its sentence ends.

## E. Skip guidance
- [ ] E1 **Every derivation block follows the skip pattern.** It starts with a spoken lead-in: optional, and not needed for the intuition of weather, climate or maps. The chip reads "every step · optional / skip to mm:ss", and its time is checked against the captions file (VTT). The block ends with "If you skipped, here's what to keep: …". Chapter marks equal the real scene starts.

## Tools
- `tools/movie_symbol_lint.py`: flags maths symbols written in plain-text labels (C1), inline `\frac` (C2) and single-backslash TeX in regex literals (C4). Run it in every part's static gates.
