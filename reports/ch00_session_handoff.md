# Session hand-off — 2026-10-23 (movie `ch00_dot_product_why` v3)

The next session reads this first (the SessionStart hook points here through `progress.json → setup.awaiting_user`).

## Where things stand
| Item | State |
|---|---|
| Movie v3 render (fix loop 1 of v2 + the s14 definition-card fix) | **Rendered** 2026-10-23 01:49: `movies/out/ch00/ch00_dot_product_why/1080.mp4`, 6:12 (371.9 s), 25.9 MB, new poster |
| QA (`tools/movie_qa.py`, 10 gates) on that render | **Not run.** Claude Code stopped the background chain for low system memory just after render + faststart + poster. The previous render (01:03, same movie without the card fix) passed 10/10: 371.90 s, 25.91 MB, −16.0 LUFS, peak −3.6 dBTP, 88 captions, 32 physics calls, 20 equations |
| Fresh movie-reviewer (review 4) | Not started (runs after QA) |
| Commit | Fix loop 1 + s14 edits committed locally as "QA pending"; nothing pushed |
| Changes in v3 vs v2 | s14: material derivative taught with two thermometers (pole = ∂T/∂t, local derivative; balloon = DT/Dt, following an **air parcel**, "a small volume of air that moves with the flow") + definition card; s17: "one degree per hundred kilometres is the map's slope, a rate in space" vs 0.180 K/h, a rate in time; s18 chip "the air carries its temperature, so the pattern slides with the wind"; captions re-broken (no one-word lines), lifted above the footnote strip |

## Next session, step by step
1. Run QA on the existing render (light, ffmpeg only, no re-render):
   `.venv/Scripts/python.exe tools/movie_qa.py movies/out/ch00/ch00_dot_product_why/1080.mp4 --storyboard movies/ch00/ch00_dot_product_why/storyboard.yaml --captions movies/out/ch00/ch00_dot_product_why/en.vtt --script movies/ch00/ch00_dot_product_why/script.md --manifest movies/ch00/ch00_dot_product_why/manifest.json --composition movies/src/ch00/DotProductWhy.tsx --id ch00_dot_product_why --duration 371.9 --duration-window 355,375 --budget-mb 60 --hard-mb 80`
2. If 10/10: commit the QA evidence, launch a fresh movie-reviewer (review 4 → `reports/ch00_movies.md`).
3. Send the user the link `movies/out/ch00/ch00_dot_product_why.html` with the review verdict.

## What the user validates NOW (this render)
- `movies/out/ch00/ch00_dot_product_why.html` — the whole 6:12 movie. Check especially:
  - 0:00–2:28 teaching first (definition, shadow, (0A.3) derivation, labels card at s04) before the question;
  - ~1:04 wording "the dot product equals the shadow" (U-M.5);
  - 3:30 Part 3 title; s14 at **3:33–4:19** material derivative, two thermometers, air parcel, definition card (U-M.9);
  - s17 at **4:55–5:14** rate in space vs rate in time (U-M.6);
  - s18 at **5:14–5:34** DT/Dt = 0 ⇒ ∂T/∂t = −v·∇T (U-M.7);
  - music level and feel (U-M.8); captions and source footnotes.

## Decisions open for the user
1. Length 6:12 is 2 s over the agreed 6:00–6:10 — accept (recommended) or trim one sentence.
2. Movie verdict after watching: PASS, or more feedback (round 2 of U-M).
3. P1: the end card links to `notebooks/poc_ch00a_dot.html`; that page must exist before `/approve-movie` — build it then (recommended) or drop the link.
4. Publishing: only after `/approve-movie`; needs `shammun/aofd-media` (`! gh repo create shammun/aofd-media --public`).

## Later (after this video)
- PoC A round-3 feedback (U-A.17 onward; A is not accepted yet).
- PoC B–G feedback, then the final PoC verdict → `setup.s11_poc = approved` → `/do-chapter 0`.
- PoC E: the user's own Colab run.
- Deferred house-component improvements proposed by the motion-builder: `ScaleBadge`/`Badge` `bottom` prop, EndCard credit ≥ 28 px and its background, DerivationStrip "why" text size, `--cue-line` flag in `tools/tts.py`, a caption-collision QA gate, `MapFrame` `eastRight`.
- Cleanup (user or after approval): G: `scratch/movies/ch00_dot_product_why/` (~2.3 GB), `scratch/colab_sim/` (1.1 GB), `scratch/movies/poc/`; optional `pip cache purge` (7.3 GB on C:).

Disk at hand-off: C: 86 GB free (floor 40), G: 589 GB free (floor 50).
