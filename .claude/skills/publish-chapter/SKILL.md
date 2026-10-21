---
name: publish-chapter
description: Publish (or re-publish) one chapter - embed check, execute, executed notebook, Colab twin pinned to the fluidpy tag, the web page with full-window explainers and scenes, approved movies and data credits, site index, explainer/scene galleries, movies.html, data.html and the symbol atlas, browser audit, size budget, public-repo check, commit, origin check, push, and confirm the GitHub Pages URLs. Usage - /publish-chapter 2 · /publish-chapter 2 --no-push · /publish-chapter site
disable-model-invocation: true
---

# /publish-chapter N [--no-push] | /publish-chapter site
- `site`: `.venv/Scripts/python.exe tools/build_site.py` (index with Ch. 0 + Parts I–IV, `viz/index.html`,
  `scenes/index.html`, `movies.html`, `data.html`, `viz/atlas.html` from `knowledge/symbols.yaml`, `DATA_CREDITS.md`
  via `tools/data_registry.py`), `tools/check_public.py`, `tools/size_budget.py`, commit `site: index and galleries`,
  push (unless `--no-push`).
- Chapter: `tools/sync_fluidpy.py` (the pin is a pushed tag containing every imported function); brief the
  `site-publisher` (brief header from `/do-chapter`); then run the **Publish and push** steps 1–8 of `/do-chapter`
  (explicit path groups, `check_public.py`, `size_budget.py`, `data_registry.py --check`, commit
  `chNN: publish — …`, origin must be `shammun/aofd`, fetch and Colab-commit recovery, push, poll the page URL for 200,
  check one explainer, one scene, the Colab URL, the gallery and the index card; never force-push). Set `publish: pass`.
- No `origin` yet: stop after the local commit and print the one-time `! gh repo create …` and `! gh api … pages`
  commands (WORKFLOW_GUIDE §2.7) for the user.
Print: page URL, galleries, Colab URL, page/ipynb sizes, runtime, audit verdict, disk C:/G:.
