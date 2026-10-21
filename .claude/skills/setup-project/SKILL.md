---
name: setup-project
description: One-time (idempotent) bootstrap of the AOFD (Vallis) project, PLANNING §12 steps 1–11 - git and .gitignore first, copy the Kundu machinery from ../Fluid Dynamics, fluidpy packaging and tag, venvs (.venv, .venv-tts) and kernel, book.yaml from the PDF outline and the chapter split, CLAUDE.md/agents/skills/hooks, the Kundu cross-link index, the three.js kit, the movie toolchain, machinery self-tests, and the proof-of-concept gate (PoC A–G) that waits for the user's approval. Skips what PLANNING §15.8 says is already done. Usage - /setup-project · /setup-project --from 8 · /setup-project --check
disable-model-invocation: true
---

# /setup-project [--from STEP] [--check]

Idempotent: every step checks before acting. **At every step print what you are doing and free space on C: and G:**
(`tools/disk_guard.py --report`; before it exists: `Get-PSDrive C,G`). `--check` only prints the ✅/❌ checklist.
Do not start chapter work here. Already done before setup (§15.8, verify and build on it, never redo): fluidpy
`pyproject.toml` (bd249b9), `.venv` with the data stack + fluidpy editable + kernel `aofd-venv`, `.venv-tts` (Kokoro,
`af_bella`, speed 1.0), Remotion 4.0.537 in `movies/`, ffmpeg 9, the G: data root and env vars, CDS and Earthdata
accounts (tested), the secret guard (`tools/check_secrets.py`, `.githooks/`).

| # | Step | Done when |
|---|---|---|
| 1 | `git init -b main`; `.gitignore` (PLANNING §2.6 + credential block) **before anything else** | `git status` shows neither the PDF nor `_private/` |
| 2 | copy from `../Fluid Dynamics`: `.claude/` agents + skills, `tools/`, `assets/` (stamp d379326 in `viz_lib.js`), `templates/`, `GUIDE.md` skeleton, requirements; never overwrite AOFD's own `check_secrets.py`, hooks or credential tools | files present |
| 3 | fluidpy: empty `geo/ data/ diag/` packages + `tests/{geo,data,diag}`, version 0.3.0, `CHANGELOG.md`; full pytest; commit library paths; tag `v0.3.0`; **ask the user, then push** main + tag | `pip install -e "..\Fluid Dynamics"` works; tag on GitHub |
| 4 | venv check: imports (xarray, cartopy, gsw, pydap, cdsapi, earthaccess, fluidpy …), kernel `aofd-venv`, `AOFD_DATA_ROOT`, G: folders | imports OK |
| 5 | `tools/make_book_yaml.py` (outline → `book.yaml`, ch00 three parts), `tools/detect_chapters.py` exit 0, `tools/split_pdf.py --check` then split, render notation pages 19–20 | `chapters/ch01.txt … ch22.txt`, openers verified by eye on one page image |
| 6 | `CLAUDE.md`, 23 agents (§4), 26 skills (§5), `.claude/settings.json` + `tools/hooks/{guard_bash,guard_write,post_write}.py` (§7), `git config core.hooksPath .githooks` (pre-push chains `check_secrets.py --push` then `check_public.py`) | hooks fire on a test write and a test bash command |
| 7 | `tools/kundu_index.py` → `knowledge/kundu_index.yaml`; seed `symbols.yaml`, `glossary.yaml` (R4 §5), `CUMULATIVE.md`, `notation.md` crosswalk | index has every Kundu explainer and section anchor |
| 8 | `assets/viz3d.js/.css` (three 0.186.1, import map, lazy/dispose/context loss/audit, `Viz.proj3`), `tools/make_luts.py`, `tools/make_coast.py`; extend `viz_inline.py`, `viz_lint.py`, `shot.py --3d`, `new_viz.py --3d`; `tools/disk_guard.py`, `fluidpy.data.fetch` | old `templates/viz_example_3d.html` still PASS; new templates PASS |
| 9 | movie toolchain check; `tools/tts.py`, `tools/movie_qa.py`, `tools/publish_movie.py`, house components; the user installs the Remotion plugin (`! claude plugin marketplace add remotion-dev/claude-code-plugin`, `! claude plugin install remotion@remotion`) | `npx remotion render` of an empty composition exits 0 |
| 10 | self-tests: `pytest tests/test_machinery.py`, `tools/shot.py templates/viz_example.html`, `tools/pipeline_selftest.py` | all PASS |
| 11 | **Proof-of-concept gate** PoC A–G (PLANNING §12 table, §15.7: a generic test of each product kind, not Chapter 0's content), each built through the real agents and tools; record render times, sizes, GPU vs SwiftShader in `knowledge/viz_patterns.md` / `movie_patterns.md` | **stop and wait for the user's verdict** |

After the user approves (not before): step 12, the user creates `shammun/aofd` (+ Pages) and `shammun/aofd-media`
(+ Pages) with the `! gh …` commands of WORKFLOW_GUIDE §2.7 / PLANNING §13.1; step 13 is `/do-chapter 0`.

Commits during setup: `setup: <step> — <one line>` (explicit paths; the pre-commit secret check runs). Nothing is
pushed from this repo before the user has created it.

## Checklist + next step
Print ✅/❌ per step with its "done when" evidence and both drives' free space, then the next command.
