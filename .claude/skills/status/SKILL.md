---
name: status
description: Print AOFD (Vallis) progress per chapter and phase (analyze … publish, with Chapter 0 per part), explainers, 3-D scenes, data figures and movies, the fluidpy pin and whether it is a pushed tag, data accounts (tools/check_data_access.py), free space on C: and G: with the data cache size, environment and git state of both repos, and the exact next command to run. Usage - /status
disable-model-invocation: true
---

# /status

1. Read `progress.json`. One compact table: `ch | ana sco cur xr des imp dat ver rev viz 3d fig nb know lib pub | E S F M | notes`
   (✅ pass/done · ⏳ running · ❌ fail · ⛔ blocked · · todo; E explainers, S scenes, F figures, M movies as
   published/total). Chapter 0 shows rows `ch00a`, `ch00b`, `ch00c`. A chapter is finished only when `publish` is ✅.
2. Movies: every movie not `published`, with its state (`draft`, `qa_pass` → "waiting for you to watch: <path/URL>,
   then `/approve-movie N slug`"). Chapter 0: say whether batch 1 (M0-1..M0-3) has the user's feedback recorded.
3. Current chapter: Verdict + Open items of `reports/chNN_verification.md`; summary of `reports/chNN_viz.md`; Must-fix of
   `reports/chNN_review.md`, `chNN_lesson.md`, `chNN_code.md` — each ≤ 8 lines.
4. Library: `book.yaml → project.library_pin`; `git -C "../Fluid Dynamics" describe --tags`; ahead/behind origin;
   whether the pin is a pushed tag (`tools/sync_fluidpy.py --quiet`).
5. Data and disk: `.venv/Scripts/python.exe tools/disk_guard.py --report` (C: free vs 40 GB floor, G: free vs 50 GB
   floor, project data vs 150 GB cap, last evictions); `.venv/Scripts/python.exe tools/check_data_access.py --quick`
   (one line per source: OK / NEEDS LOGIN / FAIL — never print credentials).
6. Environment: Python and key package versions (one line), kernel `aofd-venv`, `.venv-tts` kokoro, `node`, `ffprobe`,
   Remotion version; `chapters/` split (count of `chNN.txt`).
7. Git (this repo and `../AOFD Media`): `git log --oneline -5`, clean or not, `origin` set or not, ahead/behind; site
   and media Pages roots via `curl -s -o /dev/null -w "%{http_code}"` when origins exist.
8. Next command, one of: `/setup-project --from <step>` · the PoC approval if the gate is waiting · the `! gh repo create
   …` commands if the PoC is approved but no origin exists · `/do-chapter N --from <first phase not pass>` ·
   `/make-movies N` when a notebook passed and its movies are `todo` · `/clear` then `/do-chapter N+1`.
