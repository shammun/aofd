# Chapter 0 (PoC G, `notebooks/poc_ch00a_dot.ipynb`): code review                    2026-10-21
3 eq cells (eq:0A.1, eq:0A.3, eq:1.7-adv) · 3 scratch + 3 library-check cells · 6 asserts · ledger complete: yes (4 rows: K 2.2, 0A.1, 0A.3, 1.7-adv, all scratch+lib+assert)

**Run.** The committed notebook has **no outputs** (every `execution_count` is null). I executed an in-memory copy with the
`aofd-venv` kernel (nbclient, cwd `notebooks/`) and saved it to the scratchpad; the repo file is unchanged. Runtime was 12.9 s, with no errors and every assert passing.
Default `jupyter nbconvert --execute` fails: kernelspec `python3` resolves to Anaconda, which has no fluidpy (`ModuleNotFoundError`).
Real numbers: a·b = 5.000 (loop and vectorised), θ = 45.0°; shadow = 1.581, shadow arrow (0.5, 1.5, 0), leftover·b = 1.3e-15;
u·∇T = 5.000e-05 K/s = 4.320 K/day, so the fixed spot changes by −4.320 K/day. Scratch vs library residuals: dot 0, θ 1.6e-16 relative,
scalar projection 0, vector projection ≤ 4.4e-16, advection 0.

Library signatures (`fluidpy/geo/vectors.py`): `dot(a, b)`, `angle_between(a, b, degrees=True)`, `scalar_projection(a, b)`,
`projection(a, b)`. Every call matches. Components sit on the last axis, which fits the (3,) arrays used here. There is no hidden library call
in any scratch cell: ch00a-023/027/038 use only numpy (`np.array`, `.sum`, `np.sqrt`, `np.arccos`, `np.degrees`,
`np.radians`, `np.sin/cos`). `V` is first imported in library cell ch00a-024, and `aofd` is not used. pyflakes reports nothing for the builder or for `vectors.py`.

## Must fix (cell · rule broken · concrete change)
1. **ch00a-003 (setup) → ch00a-024/028/039 · the library call must exist in the pinned library.** `book.yaml → library_pin: v0.3.0`,
   but `fluidpy/geo/vectors.py` was first committed in 6d2c52e (`git describe`: v0.3.0-1-g6d2c52e). So it is
   **not in v0.3.0** (`git show v0.3.0:fluidpy/geo/vectors.py` gives "not in 'v0.3.0'"). On Colab, `from fluidpy.geo import vectors`
   raises ImportError and all three library-check cells fail. The cells pass only because the venv installs fluidpy editable.
   `tools/sync_fluidpy.py` does not exist, so nothing catches this. Change: release v0.3.1 (`/release-fluidpy`), bump
   `library_pin`, rebuild (nbkit reads the pin at tools/nbkit.py:256).

## Should fix
1. **(notebook as delivered) · output printed.** Commit an executed copy, or execute it in the publish step with `kernel_name="aofd-venv"`.
   As committed, no reader sees the printed numbers and units the explain blocks interpret.
2. **ch00a-023 · one operation per line.** `len_a = np.sqrt((a * a).sum())` does three operations (square, sum, root), and so does `len_b`.
   Split it (`squares_a = a * a`, `len_a2 = squares_a.sum()`, `len_a = np.sqrt(len_a2)`) or say so in the comment.
3. **ch00a-024 · assert coverage and comment accuracy.** `len_a` and `len_b` are computed in scratch but never checked, although `V.norm` exists.
   Add `V.norm(a), V.norm(b)` to the assert list. The tolerance comment says "the same closed-form arithmetic in both", which is not true for θ
   (scratch uses arccos, the library uses atan2(|a×b|, a·b)). The next line admits this. Reword the first clause to "same formula for a·b; for θ two
   exact formulas that agree to round-off away from 0°/180°". The measured gap at 45° is 1.6e-16. I confirmed the caveat: for
   a = (1, 1e-7, 0) arccos gives 9.88e-8 rad against atan2's 1.00e-7, a 1 % error.
4. **ch00a-027/028 · output interpreted.** The print shows `leftover·b = 1.3e-15`, but the explain block says only "is zero".
   Add a **What does this show?** sentence: shadow 1.581 = the figure's stripe, end point (0.5, 1.5), and 1.3e-15 is round-off (zero to
   about 16 digits). The (0A.1) and (1.7-adv) blocks already have this sentence.
5. **ch00a-028 · atol justification.** "atol: the up part is exactly 0" is not why the atol is needed. Both third components are
   exactly 0.0, so they pass with rtol alone. The x and y differences are 1.1e-16 and 4.4e-16 against values 0.5 and 1.5, which is within rtol. Either drop
   `atol=1e-15` or say "guards an exact-zero component if the library ever returns −0.0 or 1e-17".
6. **ch00a-027 · scratch shows only one side of (0A.3).** The displayed equation is |a| cos θ = a·b/|b|. Only the right side is computed.
   Add `shadow_cos = len_a * cos_theta  # the left side, |a| cos θ` so the reader sees the two sides agree.
7. **ch00a-038 · the (0A.1) reading the prose promises.** The prose computes 10 × 10⁻⁵ × cos 60°, but the cell does only the component route.
   Add `len_gradT = 1.0 / 100e3` and `adv_cos = speed * len_gradT * np.cos(angle)  # (0A.1): |u||∇T| cos θ`, then print both.
   Name `angle` as `theta` to match the θ of (0A.1) used in the prose. `gradT = np.array([0.0, 1.0 / 100e3, 0.0])` folds a division
   into the input line: set `dT_dy = 1.0 / 100e3` first.
8. **(design, not notebook) · numbers.** `analysis/ch00_poc_design.md` (lines 510–513) says u·∇T = 5.000e-6 K/s = 0.432 K/day.
   The notebook's 5.000e-5 K/s = 4.320 K/day is correct (10 m/s × 1e-5 K/m × 0.5). Correct the design so later builders do not copy the 10× slip.

## Verified (no change)
- Loop first, then the vectorised form, for the sum (ch00a-023 builds a running total, then `a * b` and `.sum()` as "the same thing all at once").
- Names match the symbols: `a`, `b`, `dot_ab`, `len_a`, `cos_theta`, `theta_deg`, `shadow_len`, `shadow_vec`, `u`, `gradT`, `dTdt_here`.
  Every line has a novice comment with the equation part and a unit, or "no unit" stated for the pure example.
- Asserts compare the same quantity at non-trivial inputs (45°, not 0° or 90°). rtol 1e-12 is justified for exact formulas. The exact zero
  (`check_perp`) uses atol 1e-12 with a stated reason. No value is compared to itself.
- The ledger (ch00a-044) lists every `eq:` cell with status. It matches design Part G rows 1–4. The K-2.20/0A.2/k×u rows are for §0.4 and are out of scope here.
- Library docstrings carry Kundu refs, units, assumptions and validation labels. `dot` reuses `fluidpy.core.tensors.dot`, and no core signature was touched.

## Library pass 1 findings carried over
None from an earlier pass 1. New one: the pin and tag gap (Must fix 1).

## Verdict: FAIL
The cells themselves are good. The one blocker is the Colab pin (v0.3.0 lacks `fluidpy.geo.vectors`). After the release and pin bump, the code is a PASS,
with Should-fix items 2–7 as polish.
