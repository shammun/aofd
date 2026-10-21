---
name: verify-chapter
description: Re-run only the verification phase for a chapter (V1-V7 evidence ladder proportional to curation tiers, library tests in ../Fluid Dynamics/tests/{geo,data,diag}, chapter tests in tests/test_chNN.py, data-figure checks, benchmark references, report), with the implementer fix loop and the full fluidpy regression suite, then re-check explainer/scene parity, figures and notebook execution. Usage - /verify-chapter 2
disable-model-invocation: true
---

# /verify-chapter N
Same as phase 5 of `/do-chapter` (brief header from that skill): brief `math-verifier`; on FAIL loop with
`concept-implementer` (max 3; physics fixes only, public signatures stable, never loosened tolerances); the **fluidpy
full suite incl. every Kundu chapter** must stay green
(`.venv/Scripts/python.exe -m pytest "../Fluid Dynamics/tests" -q -n 8`); update `progress.json → verify`; commit
`chNN: verify — …` (and the library tests in `../Fluid Dynamics` with `geo: … (for aofd chNN)`, library paths only).
Because code may have changed, then run `tools/shot.py --chapter chNN --quick` and `--3d` (selftest and GPU parity),
`.venv/Scripts/python.exe -m pytest tests/test_figs_chNN.py -q`, and `tools/run_notebook.py chNN`; report all.
If the chapter was published, suggest `/publish-chapter N` (and `/release-fluidpy` if library code changed).
Print: the Verdict, counts per validation label, convergence orders, benchmarks used, Open items.
