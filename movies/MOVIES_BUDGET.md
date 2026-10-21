# Movie budgets (R1 §2, §5.3, §5.4; PLANNING §8.4)

| Item | Budget |
|---|---|
| Length | 120–180 s per movie (±3 % of the storyboard); PoC test clip 20 s |
| Frame | 1920×1080, 30 fps, H.264 High, yuv420p, AAC, `+faststart`, CRF 23 |
| Size | ≤ 25 MB per movie (hard cap 40 MB); PoC clip ≤ 4 MB |
| Audio | Kokoro `af_bella`, speed 1.0, −16 LUFS integrated (−18…−14 accepted), true peak ≤ −1 dBTP, no music |
| Narration | ≤ 150 words/min; one clip per sentence; fixed gaps (0.35 s between sentences, 0.8 s between scenes) |
| Captions | from the script, VTT + SRT, ≤ 2 lines, ≤ 42 chars/line, ≤ 17 cps, cues 1–7 s; never burned in |
| Flashes | ≤ 3 large flashes per second (WCAG 2.3.1) |
| Render scratch | `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/` ≤ 10 GB, deleted after QA passes |
| Media repo | `shammun/aofd-media`; start `aofd-media2` above 800 MB; never force-push |
| Publication | only after the user watches the draft and runs `/approve-movie N slug` |

Measured numbers (render wall time, fps, size, GPU vs SwiftShader) are recorded in `knowledge/movie_patterns.md`.
