# Session hand-off — 2026-10-23 evening (movie `ch00_dot_product_why` v4)

The next session reads this first (the SessionStart hook points here through `progress.json → setup.awaiting_user`).
**First reply of the next session:** a short status in the CLAUDE.md "update" format built from this file, then ask the user for
their round-3 movie feedback and wait. Do not start any fix, push, publish or chapter work before the user answers.

## What the user thinks (2026-10-23, end of session)
- **The user is still NOT satisfied with the v4 video.** They will give round-3 feedback in the new session: what they did not
  like and where to improve/change. Collect it item by item into `reports/ch00_poc_user_feedback.md` as a new section
  "Movie — user round 3 on v4" (ids U-M3.*), map each item to a v4 scene (timestamps below), agree the fix plan, then run
  movie-director → motion-builder → movie_qa → fresh movie-reviewer, exactly as this session did.
- Decisions already given this session (keep them): length up to ~8 min, 8:12 accepted; 180° = "pointing in opposite directions";
  the s19 shaded wedge replaced by the upwind track (1 h / 2 h / 3 h dots); build the notebook page (done).
- Round-2 rules that stay in force (U-M2.G1–G5): no equation labels, book/author names, footnotes or "not to scale" badges;
  plain (1) only where a step refers back; stand-out titles; explain every new term at first use; narration matches the screen.

## What Claude Code did this session (all committed locally, NOT pushed — 13+ commits ahead of origin/main)
| Step | Outcome | Commit |
|---|---|---|
| QA on the v3 render | PASS 10/10 (then superseded) | — |
| User round-2 feedback on v3 logged (U-M2.G1–G5, U-M2.1–17) | `reports/ch00_poc_user_feedback.md` | 4b1d5d2 |
| movie-director: storyboard + script v4 | 22 scenes, 90 sentences, 1142 words | 4b1d5d2 |
| site-publisher: end-card page `notebooks/poc_ch00a_dot.html` + Colab twin; `tools/publish_notebook.py --poc`; `tools/embed_check.py` 3-D KeyError fix + `--notebook` mode | page audit PASS (laptop + phone), machinery tests 15 passed | 7eb99d5 |
| motion-builder: v4 build + render (new `movies/src/ch00/SceneTitle.tsx`) | 492.18 s, 30.85 MB, QA 10/10 | d029eba |
| movie-reviewer review 4 | FIX: M1 s19 clock behind the voice, M2 s11 labels overlap; S1–S11 | 998c79d |
| motion-builder fix loop 1 | 492.18 s, 30.95 MB, QA 10/10 | d5bcb3f |
| movie-reviewer review 4b | PASS → `qa_pass`; all 22 U-M2 items PASS; optional S12 open | f670230 |

QA of the current render: −16.0 LUFS, peak −3.5 dBTP, 0 flashes, 113 captions, 36 physics hashes, 36 equations, 0 black.

## The current video (v4 fix 1) — scene map for locating the user's feedback
File: `movies/out/ch00/ch00_dot_product_why.html` (MP4 `movies/out/ch00/ch00_dot_product_why/1080.mp4`, 8:12).
| Scene | Time (s) | Title |
|---|---|---|
| s01_hook | 0–8.5 | Two arrows in, one number out |
| s02_arrows | 8.5–33.2 | Vectors and their components |
| s03_definition | 33.2–54.8 | Definition 1 + worked example |
| s04_cosine | 54.8–74.4 | Definition 2, equation (1) |
| s05_angle_cases | 74.4–100.9 | Angle sets the sign (p fixed) |
| s06_shadow | 100.9–133.0 | The shadow, step by step |
| s07_unit_vector | 133.0–163.4 | Same shadow with b̂ |
| s08_question | 163.4–173.0 | Why multiply by \|b\|? (Part 2) |
| s09_reason1_order | 173.0–187.2 | Reason 1 · order |
| s10_reason2_cheap | 187.2–210.0 | Reason 2 · cheap, wind (6, 8), x̂ |
| s11_work | 210.0–244.3 | Reason 3 · work |
| s12_parcel | 244.3–276.8 | Two thermometers, air parcel (Part 3) |
| s13_equation | 276.8–303.3 | Dφ/Dt = ∂φ/∂t + v·∇φ |
| s14_isotherms | 303.3–329.1 | Isotherms, ∂T/∂x, ∂T/∂y |
| s15_grad_t | 329.1–348.3 | ∇T |
| s16_advection_number | 348.3–377.2 | v·∇T = shadow × steepness |
| s17_space_time | 377.2–396.6 | Rate in space vs rate in time |
| s18_label_zero | 396.6–421.3 | DT/Dt = 0 ⇒ ∂T/∂t = −v·∇T |
| s19_pole_cools | 421.3–444.0 | Upwind track |
| s20_twice_steep | 444.0–462.5 | Twice as steep |
| s21_recap | 462.5–484.9 | What the dot product measures |
| s22_end | 484.9–492.2 | End card |

Sources: `movies/ch00/ch00_dot_product_why/{storyboard.yaml, script.md (changelog at top), timing.json, manifest.json}`,
`movies/src/ch00/{DotProductWhy.tsx, SceneTitle.tsx}`, physics `movies/data/build_ch00_dot_product_why.py`.
Reviews: `reports/ch00_movies.md` (review 4, 4b). QA: `reports/movies/ch00_dot_product_why/qa.json` (git-ignored).
QA command: as in the previous hand-off but `--duration <measured> --duration-window 470,500 --budget-mb 60 --hard-mb 80`.

## What the user needs to do
**Next session (first):** give round-3 feedback on the v4 video, item by item with timestamps.

**Then / later:**
1. Optional S12 (s16 "components ✓" chip visible only 0.3 s at ~6:16): fold into round 3.
2. Decide on pushing the local commits to origin/main. The end card's notebook link is
   https://shammun.github.io/aofd/notebooks/poc_ch00a_dot.html, which returns 404 until the push.
3. When the movie passes: `! gh repo create shammun/aofd-media --public`, then `/approve-movie 0 ch00_dot_product_why`.
4. PoC A round-3 feedback (A not accepted yet); PoC B–G feedback; PoC E: run the Colab link yourself
   (Runtime → Run all, no keys) — then the final PoC verdict → `setup.s11_poc = approved` → `/do-chapter 0`.
5. Optional cleanup (the session may not delete):
   - G: `scratch/movies/ch00_dot_product_why/` (~2.9 GB incl. v4/, review4_v4/, review4b_v4fix1/), `scratch/colab_sim/` (1.1 GB), `scratch/movies/poc/`
   - C: `! .venv\Scripts\python.exe -m pip cache purge` (7.3 GB)
6. Untracked `ll.docx` in `../Fluid Dynamics` — the user's? (not touched)

## Deferred technical follow-ups (orchestrator, no user action)
- Promote `SceneTitle`/`PartCard` to `movies/src/house/`; EndCard two-line link rows; `tools/music.py --lift` + configurable fades;
  `tools/movie_qa.py` multi-sheet contact sheets for long movies; `tools/tts.py --cue-line`; lexicon pattern for "arrow a" + punctuation.
- fluidpy: `fluidpy/core/style.py:46` `"axes.titleweight": "semibold"` causes a findfont warning (fix in the next library change; full suite must stay green).
- Chapter publish tool: data-credit footer, scene blocks, Chapter 0 parts (ch00a/b/c) in embed_check before the real Chapter 0.
- Render alone at modest concurrency (one low-memory stop happened on 2026-10-23 morning).

Disk at hand-off: C: ~83 GB free (floor 40), G: ~588 GB free (floor 50).
