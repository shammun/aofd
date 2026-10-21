---
name: release-fluidpy
description: Release a new fluidpy version outside a chapter run - the library-steward runs tools/release_check.py (full fluidpy pytest incl. every Kundu chapter, two Kundu notebooks executed headless, aofd imports), bumps the version, writes the CHANGELOG, commits only library paths, tags vX.Y.Z and pushes main + the tag; then book.yaml → library_pin is bumped and affected Colab twins re-published. Usage - /release-fluidpy · /release-fluidpy 0.3.1 · /release-fluidpy --dry-run
disable-model-invocation: true
---

# /release-fluidpy [X.Y.Z] [--dry-run]

Skill `fluidpy-library` §5 holds the policy. Pushing a tag to `shammun/fluidpy` is outward-facing: ask the user before
the first push of a session unless they already said yes for this release.

1. In `../Fluid Dynamics`: `git status` (only library paths may be dirty: `fluidpy/`, `tests/`, `pyproject.toml`,
   `CHANGELOG.md`; anything else → stop), `git log <last tag>..HEAD --oneline`, `git diff <last tag> --stat -- fluidpy`.
   Version: the argument, else patch bump for fixes/additions within a part, minor bump at a new book part (§11.2).
   Before 1.0 nothing a Kundu notebook or a published AOFD chapter imports may be removed or renamed — check the diff
   for removed `def`/`class` names and stop if any.
2. Brief `library-steward`: run `.venv/Scripts/python.exe tools/release_check.py` (full pytest `-n 8`, execute Kundu
   ch04 and ch13 notebooks headless, `python -c "import aofd, fluidpy.geo, fluidpy.data, fluidpy.diag"`); on any failure
   stop and report (no release with a red Kundu test). Then bump `fluidpy/__init__.__version__`, add the CHANGELOG
   entry (Added / Changed / Fixed, with "for aofd chNN"), commit `release: vX.Y.Z` (library paths only), annotated tag
   `vX.Y.Z`, `git push origin main` and `git push origin vX.Y.Z` (never force). `--dry-run` stops before the commit.
3. In AOFD: set `book.yaml → project.library_pin` and `progress.json → library_pin`; `tools/sync_fluidpy.py` must pass;
   re-run `tools/publish_notebook.py chNN` for every published chapter whose Colab twin pins an older tag only if it
   needs a new function (otherwise leave them pinned); commit `release: pin fluidpy vX.Y.Z`.
4. Report: version, test counts (passed/failed/skipped), notebook runtimes, tag URL, chapters re-published.
