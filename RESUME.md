# RESUME — the work queue (updated 2026-10-29 ~21:00)

**On start or "resume":**
1. Check that G: is there (`ls "G:/Geophysical Fluid Dynamics/aofd-data"`). If it is missing, tell the user and stop all G: work. Never fall back to C:.
2. Check C:. If it has less than 45 GB free, follow memory `c-drive-low-space-action` (archive `outputs/viewing_2026-10-29` to G:, clean C: scratch).
3. Brief the user, then continue the queue below in order.

**Rules:**
- Run one heavy render at a time (Windows page-file growth filled C: on 2026-10-29). At most 3–4 agents at once.
- Ports 5100–5270 or 5600–5700 (Windows reserves 5271–5570).
- Never push. Agents never commit; the orchestrator commits.
- Standing rules live in `movies/HOUSE_STYLE.md` (especially §5b, globes and layer stacks) and memories `ch00-movie-series-loop`, `follow-my-recommendations`, `globe-framing-and-layer-stacks`.
- **User, 2026-10-29: when the priority movie is finalized, resume the paused work automatically. After every finalized movie, start the next queued task without waiting.**

## Finished (final, on C: and on Drive — see outputs/drive_links.md; user copies now on G: at archive/movies/viewing_2026-10-29/viewing_2026-10-29/ (moved off C: 2026-10-29 21:05 under the low-space rule; new viewing copies go there too))
| # | Movie | Length | Note |
|---|---|---|---|
| 0.1 | Dot product v6 | 17:40 | |
| 0.1b | Dot product new (v6 + additions) | 25:52 | §5b retro-fit pending: s20c labels on the globe |
| 0.2 | Cross product v5 full | 1:09:15 | review 3 PASS; §5b retro-fit pending (source line drawn at a fixed y lands on pictures, about 31 places, shared with Part 2) |
| 0.2a | Cross product Part 1 | 32:41 | clean |
| 0.2b | Cross product Part 2 | 40:57 | review 3 PASS; §5b retro-fit pending |
| 1a | Vectors and index notation | 35:15 | review 3 PASS; §5b retro-fit (5 musts) + wind layer stack pending; 4 polish shoulds |

## Queue (in order)
| # | Stream | State | Next step |
|---|---|---|---|
| 1 | **Weather basics UF2** (user feedback round 2, U2-01…29; plan `movies/ch00/ch00_weather_basics/uf2_plan.md`) | Builder running: kit K1–K7, final TTS, stills, full render. The s48b front stack waits for the `front_by_level` D3 fix | QA → Drive → viewing copy `weather_basics_v5_uf2.mp4` → reviews (≥ 2) → final |
| 1b | Library fixes D1/D2/D3 (`column_integral`, `front_by_level`) | Implementer running; report `reports/ch00_weather_basics_uf2_verification.md` | commit the fluidpy diag code + tests after the full suite passes |
| 2 | **#4 Derivatives and Taylor**, fix loop 1 | **PAUSED** by the user for UF2. State in `G:/…/scratch/movies/ch00_derivatives_taylor/v1/fix1/PAUSED.md` (halves FAIL, a few pieces to re-render) | resume after UF2 is final → QA → commit → review 2; then its 16-level ∂T/∂z stack (data committed) |
| 3 | §5b retro-fit: cross product v5 + Part 2 (layout only, no TTS) | planned (`movies/ch00/retrofit_5b_plan.md`) | builder, after #4 |
| 4 | §5b retro-fit: #1a (5 musts + Trappes wind stack, data committed) | planned | builder |
| 5 | §5b retro-fit: 0.1b s20c | planned | builder |
| 6 | #1b, #5, #6, #69 builds | plans exist; amend the storyboards for §5b first (#69 v3 with ECMWF data, committed) | in series order |
| 7 | Rest of the series | `movies/ch00/series_plan_v2_proposal.md` | in order |

## Open with the user (not blocking)
- M10 publish (needs `! gh repo create shammun/aofd-media --public`).
- M8 push: the user said don't push.
- PoC A–G feedback.
- C: cleanup only the user can do: restart the PC (page file), `pip cache purge`, Disk Cleanup.
- `../Fluid Dynamics/ll.docx` is untracked and not ours: leave it.

## Useful paths
- Drive links: `outputs/drive_links.md`. rclone is on G:.
- Reviews: `reports/ch00_movies.md`.
- User feedback: `reports/ch00_weather_basics_user_feedback{,_round2}.md`.
- Never clean `outputs/viewing_*`, except by the archive-to-G: rule when C: is below 45 GB.
