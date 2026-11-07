# Batch fix plan: "the easy way" / "made easy" and stale pointers in six rendered Ch. 0 movies (2026-11-07)

Text-only preparation. Nothing was voiced, rendered, mixed, committed or deleted. This plan covers six movies:
0.1b, #2, 0.3, #3, 1a and #4. The sources are `series_audit_2026-11-07.md` (P2, §3a, §3b), `series_plan_v6.md` (§6 order, §10
queue), `HOUSE_STYLE.md` §3, and the memory notes `movie-spoken-wording`, `no-opening-recaps` and
`coordinates-series-continuity`. All old text and times below come from each movie's current `timing.json` in the repo,
not from the scripts.

## 0. Summary

| # | Movie | Folder (`movies/ch00/`) | Length now | Sentences to re-voice | of which "easy way" | Stale pointers | Title-frame edits | On-screen pointer labels | Opening recap | Heavy min (est.) |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 0.1b | `ch00_dot_product_v01b` | 25:50.3 | 1 | 1 | 0 | 1 | 0 | none | ~17 |
| 2 | #2 | `ch00_cross_product` | 32:38.6 | 4 | 1 | 3 | 1 | 2 | s02 (37 s, borderline) | ~32 |
| 3 | 0.3 | `ch00_weather_basics` | 58:04.0 | 1 | 1 | 0 | 1 | 0 | none | ~25 |
| 4 | #3 | `ch00_cross_product_uses` | 40:54.3 | 6 | 1 | 5 | 1 | 3 | **s01a–s01d (2:34)** | ~37 |
| 5 | 1a | `ch00_vectors_index_notation` | 35:12.7 | 7 (2 optional) | 1 | 6 | 1 | 4 | none | ~26 |
| 6 | #4 | `ch00_derivatives_taylor` | 49:04.9 | 2 | 1 | 1 | 1 | 0 | none | ~38 (incl. ~15 to rebuild a missing audio base) |
| | **Total** | | | **21** | **6** | **15** | **6** | **9** | 1 definite, 1 borderline | **~175 min** |

**Lint.** All 21 proposed sentences pass `tools/script_wording_lint.py` (0 findings). I ran it on a temporary script made
of the new lines; it reads only `script.md`-style files, so I could not run it on a single sentence. Each of the six
current scripts still gives one hit, the s00 "the easy way".

**Lengths.** Every new sentence is within ±5 % of the old character count, except #2/#3 s00 (−8 to −9 %). Dropping
"the easy way" makes each s00 sentence 0.6–0.9 s shorter. Estimates use old duration × (new characters / old
characters). Measure the real lengths with a Kokoro run in the splice step.

### Recommended splice mode: "slot-keep", so later frames never move

Every new clip is shorter than the old one, or at most about 0.2 s longer:

| Movie · scene | Old (s) | New, estimated (s) | Change (s) |
|---|---|---|---|
| 1a s11 | 7.13 | 7.33 | +0.20 |
| 1a s12c | 5.23 | 5.44 | +0.21 |

So the old `[start, end)` slot can be kept for every sentence:
- **Shorter clip:** put the new clip at the old start and pad with silence to the old end. For s00 the title simply holds
  0.6–0.9 s longer.
- **A clip up to 0.25 s longer:** take the extra from the following house gap. s11[9] and s12c[11] are the last sentences
  of their scenes, so the 0.8-s scene gap becomes ≥ 0.55 s.

Then:
- `timing.json` changes only that sentence's `end`;
- no later scene shifts;
- only the scenes that hold an edit, a pulse retarget or a changed label are re-rendered;
- every other frame can be reused or copied;
- `music.wav` and `sfx.wav` stay valid, so only narration + music is re-mixed.

If a measured clip is more than 0.25 s longer than its slot, use the shift mode of the existing splice tools for that
movie. Everything after the edit moves, so later scenes must be re-cut, for example with segment copying as in
`segments_parts.py`, or re-rendered. No existing tool has a slot-keep option. It is about 10 lines on top of
`cf_fix1_splice.py`: pad or trim the gap, and do not shift `t > old end`.

**Code and text must change together.** Each movie's `AT(k, j, phrase)` throws if the phrase is missing
(`DotProductV01b.tsx:55`). So every `AT(k, 0, "the easy way")` and every `AT(…, "next movie" / "The last video")` listed
below must be edited **in the same pass** as `timing.json`. If not, the bundle builds but the render throws.

**Title layout (HOUSE_STYLE §3).**
- Delete the `made easy` RiseText and its pulse `<g>`.
- Put the ×1.06 pulse on the concept title lines, triggered when the voice says the concept word.
- Move the subtitle up into the freed line, about −100 px.
- The precedent is the `#5a` diff in `a3869b1`, `kit_cf/SeriesTitle.tsx` (y = 250 / 390 / 540).
- Keep the subtitle ≥ 50 px clear of the right column. x does not change, so this holds.
- Re-take `poster.jpg` from the new title frame.
- In `storyboard.yaml` s00, update `visual`, `voiceover`, `sentence_times` and `screen_summary`.
- In `script.md`, update the s00 line and its "Screen:" note.

---

## 1. 0.1b · `ch00_dot_product_v01b` (pos 1)

**Sentences**

| Scene · idx | Time | Old → new | Dur old → est. |
|---|---|---|---|
| s00_title · 0 | 0:00.30–0:09.62 | "In this video, we'll learn the dot product ~~the easy way~~, and see how meteorology uses it to tell how fast the wind changes the temperature." → "In this video, we'll learn the dot product, and see how meteorology uses it to tell how fast the wind changes the temperature." | 9.33 → ~8.45 |

**Title frame:** `movies/src/ch00_dot_product_v01b/DotProductV01b.tsx`
- L278 `tEasy = AT(k, 0, "the easy way")` → `tName = AT(k, 0, "dot product")`.
- L297 the pulse → `pulse(f, tName, 12)`, moved to a `<g>` round L304–305 ("The dot" / "product").
- L306–308: delete the `made easy` group.
- L309–310: subtitle y 660/750 → 560/650.
- Text: `storyboard.yaml` L87–88 and L115; `script.md` L24.

**Pointers:** none stale. Every pointer checked:
- s20b[6] "a later video": #2 is the next movie, so this is true but loose; keep it;
- s20c[9] the climate machine video (M16);
- s21_recap[11] "the cross product, in the next video" (#2, pos 2).

**Opening recap:** none (s00 → s01 hook → s02 content).

**Not in this batch:** the §5b retro-fit s20c, and a fact table (audit §3b).

**Tooling**
- Splice: `tools/movie_wb/splice_dpv_fix1.py`. It uses a local-gain replace. **Its `SCR/public` and `SCR/fix1` paths no
  longer exist in scratch.** The current base (1550.325 s, the same as the repo `timing.json`) is
  `G:/…/aofd-data/archive/movies/ch00_dot_product_v01b_final/fix1/{narration.wav,timing.json,music.wav,sfx.wav}`.
  Point `OLD` there and write to a new `…/scratch/movies/ch00_dot_product_v01b/ew1107/`.
- Render: the last build is `archive/…/ch00_dot_product_v01b_final/r3/{bundle,render}`. `render/` holds 12 chunks
  `c00…`. Do not render into `r3/render`, because existing chunks are reused. Use `ew1107/render`.
- Estimated heavy work:
  - TTS 1;
  - bundle 3;
  - s00 render (≈10 s + cross-fade) 1;
  - mix 3;
  - join 4;
  - QA, vscan and poster 5;
  - **≈17 min.**

---

## 2. #2 · `ch00_cross_product` (pos 2; title "The cross product")

**Sentences**

| Scene · idx | Time | Old → new | Dur old → est. |
|---|---|---|---|
| s00_title · 0 | 0:00.30–0:09.93 | "In this video, we'll learn the cross product ~~the easy way~~, and see how physics uses it to describe turning, from opening a door to spinning a ball." → "In this video, we'll learn the cross product, and see how physics uses it to describe turning, from opening a door to spinning a ball." | 9.63 → ~8.77 |
| s22w_when_to_use · 2 | 29:20.92–29:32.38 | "…the centre of a turn, and, in the next video, a spin arrow, like Earth's spin, Omega." → "…the centre of a turn, and, in Part 2, a spin arrow, like Earth's spin, Omega." | 11.45 → ~10.89 |
| s22w_when_to_use · 5 | 29:58.78–30:12.75 | "…the push on a moving charge, and, in the next video, the speed of the spinning ground…" → "…the push on a moving charge, and, in Part 2, the speed of the spinning ground, Omega cross r, and the Coriolis push, minus two Omega cross u." | 13.98 → ~13.44 |
| s50_recap · 7 | 32:06.75–32:14.58 | "The next video puts the cross product to work on our spinning Earth, to explain why the wind turns and why storms spin." → "Part 2 puts the cross product to work on our spinning Earth, to explain why the wind turns and why storms spin." | 7.83 → ~7.30 |

Pointers: the next movie is now 0.3 (pos 3), and #3 is pos 4. Plan §10 wording: "Part 2".

**Title frame:** `movies/src/ch00/CrossProductWhy.tsx`, `TitleScene`. This component is shared with the v5 alternate
`ch00_cross_product_why`, whose s00 says "learn about".
- L374 `tEasy = AT(k, 0, p1 ? "the easy way" : "learn about")` → `p1 ? "cross product" : "learn about"`.
- L395 pulse → onto the L400–401 title lines.
- L402–404: delete `made easy`. This removes it from the v5 alternate too, which is wanted.
- L406–407: subtitle y 650/730 → 560/640.
- Text: `storyboard.yaml` L618–620, L646–647 and L654; `script.md` L17.

**On-screen pointer labels**
- L6209 `nextP1 = …includes("in the next video")` → `includes("in Part 2")`.
- L6267 label `"next video"` → `"Part 2"`, and `A5_("in the next")` → `A5_("in Part 2")`. If this is not changed, it falls
  through to `"and soon"` and throws.
- L6423 `"next: the spinning Earth"` → `"Part 2: the spinning Earth"`.

**Opening recap (flag only):** s02_dot_recall, 0:19.4–0:56.6 (37 s), "In the last video, we met the dot product…". It
sets up s03 ("But a number can't describe everything"), so it is close to a point-of-use recall. Its pointer is now
correct (0.1b comes right before).

**Note:** the ending teaser now names Part 2, while the movie that actually comes next is weather basics. That is
acceptable; no change is proposed.

**Tooling**
- Splice: `movies/out/ch00/ch00_cross_product_why/_tools/splice_fx1.py`, with an `OPS["p1"]` list. Base = **`G:/…/scratch/movies/ch00_cross_product_v5/fx1/p1/audio/`** (1958.625 s, the same as the repo), mix in
  `fx1/p1/mix/`. The script reads `SCR/<mv>/audio`, so set the base to `fx1/p1`.
- Sync: `sync_fx1.py`.
- Render: render pieces (`fx1_render.sh` / `tools/movie_cp/render_pieces.py`), then segment join (`segments_parts.py`,
  `join_cf.py`, `tools/movie_cp/join2pass.py`).
- Existing piece directories: `fx1/pieces_p1` (11), `fx1/pieces3_p1` (3), `pieces_p1` (4) and `fx1/final_p1`. Use a new
  `ew1107/pieces_p1`.
- Re-render s00, s22w (64 s) and s50 (66 s).
- Estimated heavy work:
  - TTS 2;
  - bundle 3;
  - render ≈3;
  - mix 3;
  - segment join ≈16 (cf2 took 983 s for #3);
  - QA 5;
  - **≈32 min.**

---

## 3. 0.3 · `ch00_weather_basics` (pos 3)

**Sentences**

| Scene · idx | Time | Old → new | Dur old → est. |
|---|---|---|---|
| s00_title · 0 | 0:00.30–0:10.70 | "In this video, we'll learn the basics of weather ~~the easy way~~, and see how meteorologists use them to read the weather and follow a real storm over one town." → "In this video, we'll learn the basics of weather, and see how meteorologists use them to read the weather and follow a real storm over one town." | 10.40 → ~9.54 |

**Title frame:** `movies/src/ch00_weather_basics/WeatherBasics.tsx`
- L506 `tEasy` → `AT(k, 0, "basics of weather")`.
- L517 pulse → onto L528–529 ("Weather" / "basics").
- L530–532: delete `made easy`.
- L533–534: subtitle y 660/744 → 560/644.
- Text: `storyboard.yaml` L74–76, L97, L102 and L115, plus the on-screen text list at **L5295 (`- made easy`) and L5298**,
  which are probably the K6 overlap and label inventory; `script.md` L32 (change log), L69 and L72.

**Pointers:** none stale.
- s35[4] and s44[5] point to Coriolis videos, which is true (#3 is next). Plan §10 says keep them.
- s50[2], s52[5], s53[7] and s59 are fine (audit §3a).

**Opening recap:** none.

**Tooling**
- Splice: `tools/movie_wb/splice_replace.py`, the pattern of the latest `splice_uf2fix3.py`. Base =
  **`G:/…/scratch/movies/ch00_weather_basics/uf2/fix3/tts/`** (3483.95 s, the same as the repo), mix in `uf2/fix3/sound/`.
- Sync: `sync_storyboard_uf2fix3.py`.
- Render: `uf2fix3_prerender.sh` / `uf2fix3_render.sh`, `rerender_chunks.py`, `join2pass.py`, `sound_mix.py`.
- The existing chunks in `uf2/render` (27) are reused by name. Use `uf2/ew1107/render`, or move the old ones aside if you
  re-run the uf2fix3 scripts unchanged.
- Estimated heavy work:
  - TTS 1;
  - bundle 4;
  - s00 render 1;
  - mix 5;
  - join ≈6;
  - QA, vscan and poster 8;
  - **≈25 min.**

---

## 4. #3 · `ch00_cross_product_uses` (pos 4; title "The cross product at work")

**Sentences**

| Scene · idx | Time | Old → new | Dur old → est. |
|---|---|---|---|
| s00_title · 0 | 0:00.30–0:12.03 | "…how the cross product works on our spinning Earth, ~~the easy way~~, and see how meteorology uses it…" → "In this video, we'll learn how the cross product works on our spinning Earth, and see how meteorology uses it to explain why the wind turns and why storms spin." | 11.73 → ~10.78 |
| s01a_recap_arrow · 0 | 0:26.12–0:31.57 | "First, a quick reminder of what the cross product is, from the last video." → "First, a quick reminder of what the cross product is, from Part 1." | 5.45 → ~4.86 |
| s01d_recap_push · 0 | 2:28.32–2:30.93 | "One more idea from that video." → "One more idea from Part 1." | 2.60 → ~2.25 |
| s27b_centrifugal · 2 | 15:57.75–16:03.80 | "To see which way it points, we use the vector triple product from the triple products video." → "To see which way it points, we use the vector triple product, a rule a later video proves." | 6.05 → ~5.92 |
| s47_recap · 4 | 39:25.68–39:38.03 | "In the last video, we saw that physics uses it for torque…" → "In Part 1, we saw that physics uses it for torque, angular momentum and the push on a moving charge, and that a push always at a right angle turns a motion without speeding it up." | 12.35 → ~11.82 |
| s47_recap · 10 | 40:16.32–40:28.07 | "The last video shows why the cross product is built this way, and later videos…" → "Part 1 shows why the cross product is built this way, and later videos in this series show how to read weather maps, and how grad, div and curl are built from these products." | 11.75 → ~11.23 |

Pointers: the last video is now 0.3. 1b, which proves the triple product, is at pos 98. This is plan §10 and audit §3a.

**Title frame:** `movies/src/ch00/CrossProductWhy.tsx`, `S00P2`
- L6438 `tEasy` → `AT(k, 0, "cross product")`.
- L6439 pulse → onto L6462–6464 ("The cross" / "product" / "at work").
- L6465–6467: delete `made easy`.
- L6468–6469: subtitle y 735/815 → 640/720.
- Text: `storyboard.yaml` L673 and L677; `script.md` L20 (and the L15 note).

**On-screen pointer labels**
- L5634 `"from the last video"` → `"from Part 1"`.
- L5638 `"the last video: why it's built this way"` → `"Part 1: why it's built this way"`, and
  `AT(k, iLast, "The last video")` → `AT(k, iLast, "Part 1 shows")`. If this is not changed, it throws.
- L5686, the end-card thumbnail tag `"last video"` → `"Part 1"`. This is visual only, but s48 must be re-rendered.
- L3580, the keyword `"vector triple product"`: its phrase is still in the sentence. OK.

**Opening recap: FLAG.** s01a_recap_arrow → s01d_recap_push, 0:26.1–3:00.3 (**2 min 34 s**), "First, a quick reminder…".
This is exactly what the user rejected (no-opening-recaps, 2026-11-07). The minimal batch only re-points it to Part 1. To
cut it, or move it to the point of use, the user must decide. Cutting 2:34 would shift everything after it, so it is not
a slot-keep job.

**Tooling**
- Splice: `splice_fx1.py`, with an `OPS["p2"]` list. Base = **`G:/…/scratch/movies/ch00_cross_product_v5/cf/p2/audio/`**
  (2454.25 s, the same as the repo; **not** `fx1/p2`, whose 1838.25 s is older). The mix is in `cf/p2/mix/`. The last
  final is `cf2/final_p2/1080.mp4`.
- Existing piece directories: `cf/pieces_p2` (7), `cf/piecesf1_p2` (2), `cf/piecesf2_p2` (9), plus the `fx1/*_p2`
  directories. Use `ew1107/pieces_p2`.
- Re-render s00, s01a (50 s), s01d (32 s), s27b (91 s), s47 (91 s) and s48 (end card).
- Estimated heavy work:
  - TTS 3;
  - bundle 3;
  - render ≈5;
  - mix 4;
  - segment join ≈16;
  - QA 6;
  - **≈37 min.**

---

## 5. 1a · `ch00_vectors_index_notation` (pos 5)

**Sentences**

| Scene · idx | Time | Old → new | Dur old → est. |
|---|---|---|---|
| s00_title · 0 | 0:00.30–0:12.85 | "…vectors and index notation ~~the easy way~~, and see…" → "In this video, we'll learn vectors and index notation, and see how meteorology uses them to write the wind, how it changes, and the warmth it carries, in a few short symbols." | 12.55 → ~11.68 |
| s11_other_axes · 9 | 7:10.30–7:17.43 | "Turning axes, and the other coordinates we use on a round Earth, get their own movie later in the series." → "Turning axes, and the coordinates we use on a round Earth, get a seven-part series soon, called Coordinates." | 7.13 → ~7.33 |
| s12c_add_forces · 11 (optional, §10) | 11:20.38–11:25.60 | "How each of these pushes arises gets its own movies later in the series." → "We met the Coriolis push in the cross product movie; the others come later." | 5.23 → ~5.44 |
| s12d_add_geostrophic · 4 (optional, §10) | 11:48.98–11:56.50 | "That imagined wind is called the geostrophic wind, and the geostrophic wind movie explains it in full." → "That imagined wind is the geostrophic wind, derived in the cross product movie on our spinning Earth." | 7.53 → ~7.45 |
| s15_dot_product · 10 | 20:47.00–20:52.47 | "The dot product has a whole movie of its own in this series, where we take it apart fully." → "We took the dot product apart fully in the dot product movie, the first in this series." | 5.48 → ~5.29 |
| s19_three_reasons · 5 | 23:11.08–23:21.20 | "…and a second one in the next movie, we can prove…" → "With a special symbol that we'll meet soon, and a second one in a later movie, we can prove rules about vectors by checking indices, instead of drawing pictures." | 10.13 → ~10.06 |
| s34_next · 2 | 34:40.35–34:45.43 | "That's the next movie in this series, which starts exactly where this one stops." → "That's a later movie in this series, which starts exactly where this one stops." | 5.08 → ~5.01 |

Notes on the pointers:
- s11 now uses the Coordinates name: #5a–#5g, pos 7–13, two movies later.
- s15: 0.1b is pos 1.
- s19 and s34: 1b is pos 98.
- s12c and s12d: #3 derived the Coriolis push and the geostrophic wind.

**Title frame:** `movies/src/ch00_vectors_index_notation/VectorsIndexNotation.tsx`
- L165 `tEasy` → `AT(k, 0, "vectors")`.
- L178 pulse → onto L183–184.
- L185–187: delete `made easy`.
- L188: subtitle y 640 → 540.
- Text: `storyboard.yaml` L131 and L138; `script.md` L29.

**On-screen pointer labels**
- L1568 `AT(k, 5, "next movie")` → `AT(k, 5, "later movie")`. If this is not changed, it throws.
- L1583 label `"next movie"` → `"later movie"`.
- L2268 Keyword `"next movie"` → `"later movie"`.
- L1479 `"dot product →"` → `"← dot product"`. The pointer now looks back.
- L776 `"coordinates →"`: keep it.

**Not in scope (flag):**
- The ending s34 still teases 1b, which is 93 movies away. There is no teaser to #4, which comes next.
- The s12c/s12d rewrites are optional (§10).

**Opening recap:** none.

**Tooling**
- Splice: `movies/out/ch00/ch00_vectors_index_notation/_tools/splice_fix2.py` (+ `splice_loud.py`). Base =
  **`G:/…/scratch/movies/ch00_vectors_index_notation/v3/tts/`** (2112.7 s, the same as the repo), mix in `v3/mix/`.
- Sync: `sync_storyboard_fix2.py`.
- Render: `render_vi2.py`, then `finish3.sh`.
- Existing pieces: `v3/pieces` (64) and `v2/pieces` (64, older). Use `v3/ew1107/pieces`.
- Re-render seven scenes, about 353 s of frames.
- Estimated heavy work:
  - TTS 3;
  - bundle 3;
  - render ≈5;
  - mix 4;
  - join ≈5;
  - QA 6;
  - **≈26 min.**

---

## 6. #4 · `ch00_derivatives_taylor` (pos 6)

**Sentences**

| Scene · idx | Time | Old → new | Dur old → est. |
|---|---|---|---|
| s00_title · 0 | 0:00.30–0:16.05 | "…partial derivatives, the chain rule and Taylor series ~~the easy way~~, and see…" → "In this video, we'll learn partial derivatives, the chain rule and Taylor series, and see how meteorology uses them to follow a weather balloon's temperature, and to find how much more water vapour it takes to saturate warmer air." | 15.75 → ~14.91 |
| s46_fd_grid · 10 | 47:13.72–47:18.32 | "Solving whole equations on grids has its own movie in this series." → "Solving whole equations on grids comes later in this series." | 4.60 → ~4.18 |

s46 has no numerical-methods movie to point to. Add finite-difference solving to W01's scope ("Partial differential
equations", pos 122), as audit P11 recommends.

**Title frame:** `movies/src/ch00_derivatives_taylor/DerivativesTaylor.tsx`
- L156 `tEasy` → `AT(k, 0, "partial derivatives")`.
- L177 pulse → onto L182–183.
- L184–186: delete `made easy`.
- L187: subtitle y 620 → 520.
- Text: `storyboard.yaml` L156–157 and L163; `script.md` L56.

**On-screen labels:** none tied to the changed sentences.

**Opening recap:** none.

**Other pointers:** checked and fine. All of them point later (#6, M07, M12, M13, T04, W/S), or back to 1a, 0.1b and 0.3.

**Tooling: a blocker to fix first.**
- `finish_fix3.sh` uses the mix `v1/fix2/mix`, and the fix-2 narration lives in `v1/fix2/tts`. **Neither folder exists
  on G: any more.** `v1/` holds only `fix3/`, `mix/`, `public/`, `render/` and `tts/`, and `v1/tts` is the build-1 base
  (2796.25 s).
- The current 2944.875-s narration therefore exists only inside the final AAC `1080.mp4`, mixed with music, so it cannot
  be spliced.
- Rebuild it first. Kokoro is deterministic. Re-run, in `.venv-tts`, from `movies/out/ch00/ch00_derivatives_taylor/_tools/`:
  1. `splice_fix1.py` (v1/tts → v1/fix1/tts);
  2. `splice_fix2.py` (→ v1/fix2/tts);
  3. `splice_loud_fix1.py` / `splice_loud_fix2.py`.
- Check that the result reproduces the repo `timing.json` sentence by sentence (total 2944.875 s), then re-mix
  `v1/fix2/mix` with `sound.yaml`. Only then splice s00 and s46.
- Render: `render_fix3.py` / `finish_fix3.sh`. `fix3/render` holds 89 chunks, and the script refuses fewer than 89, so
  use `v1/ew1107/render` with only the changed ranges plus a piece-swap join.
- Estimated heavy work:
  - rebuild ≈15;
  - TTS 1;
  - bundle 3;
  - render s00 + s46 (≈101 s) ≈2;
  - mix 6;
  - join 3;
  - QA 8;
  - **≈38 min.**

---

## 7. Order, checks and what stays open

1. **Pre-checks for all six, done once (light).**
   - Measure the 21 new clips with a Kokoro dry run (`tools/tts.py`, af_bella × 1.0) and confirm each fits the
     slot-keep rule.
   - Run `script_wording_lint.py` on each edited `script.md`. It must give 0 findings.
   - Run `tsc --noEmit` on the 5 edited TSX files.
2. **Then the heavy work, one movie at a time:** 0.1b → 0.3 → #4 (rebuild first) → 1a → #2 → #3.
   #2 and #3 share `CrossProductWhy.tsx` and one bundle, so render them back to back.
3. **Per movie:**
   - splice;
   - sync `storyboard.yaml`, `script.md` and the captions (`en.vtt` / `en.srt`);
   - render the changed scenes into `ew1107/`;
   - mix and join;
   - `tools/movie_qa.py` (+ `--overlap` stills of s00 and of each label change);
   - vscan; poster; free space on C: and G: before and after.
   - Free space on 2026-11-07: **C: 104 GB, G: 440 GB.**
4. **Open for the user (not in this batch):**
   - (a) #3's 2:34 opening recap: keep, cut, or move to the point of use.
   - (b) #2 s02's 37-s dot-product recall (borderline).
   - (c) 1a's ending teaser: 1b, not #4.
   - (d) Should #2 and #3 titles say "Part 1" / "Part 2" on screen, now that the voice says "Part 2"?
   - (e) The optional 1a s12c/s12d.
   - (f) Fact tables for these six movies (audit §3b recommends running them in this slot).
   - (g) The §5b retro-fit items queued for these movies (0.1b s20c; the 0.3 and #4 Shoulds).
5. **Files outside the six.** `ch00_cross_product_why` (the v5 alternate) loses "made easy" through the shared
   `TitleScene`. Its voice still says "learn about"; re-render it only if it is ever published.

## §8 Orchestrator decisions (2026-11-07, applying the user's standing rules; see memory no-opening-recaps, follow-my-recommendations)
1. #3: the 2 min 34 s opening recap of Part 1 is CUT (user rule, firm: no movie opens with a recap). Each fact it carried is recalled at its point of use (equation + "from Part 1" + one sentence). This shifts timing → #3 is re-timed and fully re-rendered (not slot-keep).
2. #2: the 37 s dot-product recall at s02 is cut to one point-of-use sentence where the dot product is first used.
3. 1a: the ending teaser points to #4 (the next movie in series_plan_v6), not a movie 93 places later.
4. #2/#3 title frames say "Part 1" / "Part 2" (consistent with the voice and the Coordinates series layout).
5. 1a optional rewrites s12c, s12d: applied.
6. Fact tables for all six movies are run before any TTS (verify-every-fact).
7. #4: rebuild its fix-2 narration from v1/tts with the fix-1/fix-2 splice scripts, verify against timing.json, then splice.
8. Render into new ew1107/ folders (never reuse old chunks). Order: after the Coordinates parts' heavy work, one movie at a time under HEAVY.lock.

## §9 Added 2026-11-07 (user): natural openings and arithmetic in the voice — apply in the same batch
- s00: replace "…and see how meteorology uses it/them to …" with "…and see how it's/they're used to …" (all six movies; same re-voice as the "easy way" line, so no extra splice).
- s01: replace the robotic "Let's see what X is, why it's built this way (the way it is), and what it tells us about …" with an easy-going lead-in naming the movie's own pieces ("Now let's dive into what the dot product is, how it's built and how it's used: its two forms, its shadow picture, and the wind."). One extra sentence per movie.
- Sweep each script with `tools/script_wording_lint.py` (now flags voiced arithmetic, sign rules, both opening formulas); re-voice every flagged sentence so the voice says what is combined and the result, while the screen keeps the full breakdown. This turns the slot-keep splice into a re-timed render where sentences shorten.
