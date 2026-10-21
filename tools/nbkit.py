"""Building blocks for chapter notebooks (used by ``notebooks/build_chNN.py``), so every chapter has the same shape
and the coverage rules are checked the moment the notebook is saved.

    import sys, pathlib; sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "tools"))
    from nbkit import ChapterNotebook

    nb = ChapterNotebook("ch07")
    nb.title(big_idea="…", roadmap=["…"], prerequisites=["…"])
    nb.explainer_index([("dispersion_relation", "Why long waves outrun short ones", "phase vs group speed"), …])  # 5–10
    nb.setup()
    nb.section("7.2", "Linear liquid-surface gravity waves")   # one per book section; save() checks all are present
    nb.core("C03", "The dispersion relation")                  # every NEW idea is a CORE block (IDs from the curation)
    nb.md("### The problem in plain words\n…")
    nb.primer("hyperbolic tangent tanh", "…plain words…", code="…3-line numeric demo…")   # any concept not taught elsewhere
    nb.worked_example("a 10 m wave in 2 m of water", "1. … 2. …")
    nb.derivation("D02", "Where the dispersion relation comes from", ref="7.27", goal="…", start=(r"…", "in words"),
                  steps=[dict(did="Substitute the wave form", tex=r"…", why="Allowed because …", plain="…"), …],
                  result=(r"…", "in words"), check_src="…sympy, every line commented…")   # inside its CORE block
    nb.code("…", explain="…")                                  # every line commented
    nb.figure("…plotting code…", see="…", read="…", change="…")   # a visual + its three reading notes
    nb.animation("…"); nb.plotly("…"); nb.live("…"); nb.check_agree("…")
    nb.explainer("dispersion_relation", heading="…", why="…", tries=["…"])
    nb.recap("R02", "Bernoulli's equation", "…one paragraph…", where="Ch. 4 §4.9")   # an idea taught in an earlier chapter
    nb.note("…", equation=r"c = \\sqrt{gH}", ref="7.xx")      # a restatement/special case shown inside its CORE block
    nb.pointer("…")                                             # SKIP: history, exercises, deferred material
    nb.summary(clicked=[…], feeds_forward=[…], left_out=[…])
    nb.save()                                                   # notebooks/ch07_gravity_waves.ipynb

``save()`` refuses to write the notebook when:
  * a book section from ``book.yaml`` has no ``section(...)``;
  * a CORE item listed in ``analysis/chNN_curation.md`` (IDs ``C01``, ``C02`` … in the tiers table) has no ``core(...)``
    block, or its block has no code cell or no visual (figure, animation, plotly figure or explainer);
  * a DERIVATION listed in the curation (IDs ``D01``… in the derivations table) has no ``derivation(...)``, sits in
    another CORE block, or is ★★★ (hard) without a sympy check;
  * the number of explainers is outside ``book.yaml → project.min/max_explainers_per_chapter`` (5–10).
``tools/coverage_check.py chNN`` repeats these checks on the executed notebook (real outputs) and checks the
prerequisite ledger.

AOFD additions (PLANNING §2.5, §8.1): Chapter 0 parts (``ChapterNotebook("ch00a")`` -> ``notebooks/ch00a_maths.ipynb``),
CORE ids ``C0A-01``/``C0A-PoC1``, the Colab setup cell that installs the pinned fluidpy tag, and the blocks
``kundu_recap`` · ``scratch_vs_lib`` · ``ledger_row`` · ``equation_ledger`` · ``mechanism`` · ``reading_card`` ·
``data_figure`` · ``anatomy`` · ``magnitude_table`` · ``like_unlike`` · ``movie`` · ``scene``. For Chapter 0 the explainer
count is a soft target (warning only, Q11).

Cell metadata written here (read by ``tools/publish_notebook.py`` and ``tools/coverage_check.py``):
  tags: ``setup`` · ``explainer`` · ``animation`` · ``plotly`` · ``figure`` · ``live-only`` · ``from-scratch`` · ``primer`` · ``recap``
        · ``derivation`` · ``derivation-check``
  ``metadata.fluidpy.core`` = the CORE id the cell belongs to; ``metadata.fluidpy.derivation`` = the D id
"""
from __future__ import annotations

import re
import textwrap
from pathlib import Path

import nbformat as nbf
import yaml

ROOT = Path(__file__).resolve().parents[1]
VISUAL_TAGS = {"figure", "animation", "plotly", "explainer"}
VISUAL_CODE = re.compile(r"plt\.|\.plot\(|show_animation|slider_figure|animate_figure|fig\.show\(|show_viz\(|imshow|contour|quiver|streamplot")


def _book() -> dict:
    return yaml.safe_load((ROOT / "book.yaml").read_text(encoding="utf-8"))


def explainer_limits(book: dict | None = None) -> tuple[int, int]:
    proj = (book or _book()).get("project", {})
    return int(proj.get("min_explainers_per_chapter", 5)), int(proj.get("max_explainers_per_chapter", 10))


MAX_EXPLAINERS = explainer_limits()[1] if (ROOT / "book.yaml").exists() else 5

SETUP_MD = """## ⚙️ Setup — run this cell first

It works in three places without changes:
* **Google Colab** — clones the public repository `{repo}` into `/content/aofd`, installs the shared library
  `fluidpy` at the pinned release `{pin}` and the few packages Colab lacks. **No account or key is needed**: data come from
  small files already in the repository.
* **Jupyter / VS Code on your computer** — finds the repository root (the folder with `book.yaml`); `fluidpy` is
  already installed there.
* **The published web page** — already executed; nothing to run.
"""

SETUP_CODE = """# ── Setup: find (or fetch) the aofd repository, install fluidpy {pin}, then load the house style ─────────────
import os, sys, subprocess, pathlib                     # standard library only, so this cell never fails on imports

IN_COLAB = "google.colab" in sys.modules                 # True when this notebook runs inside Google Colab
REPO_URL = "https://github.com/{repo}.git"               # the public repository with the notebooks and explainers
FLUIDPY = "fluidpy[geo,data] @ git+https://github.com/{library_repo}@{pin}"   # the tested library, pinned release

if IN_COLAB:
    ROOT = pathlib.Path("/content/aofd")                 # where the repository is cloned on Colab
    if not ROOT.exists():                                 # first run in this Colab session: clone it
        subprocess.run(["git", "clone", "--depth", "1", REPO_URL, str(ROOT)], check=True)
    subprocess.run([sys.executable, "-m", "pip", "install", "-q", FLUIDPY], check=True)          # the library
    subprocess.run([sys.executable, "-m", "pip", "install", "-q", "-r", str(ROOT / "requirements.txt")], check=True)
    subprocess.run([sys.executable, "-m", "pip", "install", "-q", "-e", str(ROOT), "--no-deps"], check=True)  # book glue
    os.environ.setdefault("AOFD_DATA_ROOT", "/content/aofd-data")   # downloads go here (only on a refresh)
else:
    ROOT = pathlib.Path.cwd().resolve()                   # start where Jupyter was launched …
    while not (ROOT / "book.yaml").exists() and ROOT != ROOT.parent:
        ROOT = ROOT.parent                                # … and walk up until we find the repository root

os.chdir(ROOT)                                            # relative paths (data/, viz/) now resolve from the root
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))                         # make `import aofd` work even without the install

import fluidpy                                            # the shared library (physics, data access, diagnostics)
from fluidpy.core.style import setup_notebook            # matplotlib + plotly style shared with the explainers
from fluidpy.core.embed import show_viz                  # shows an interactive explainer in the notebook
from fluidpy.core.anim import show_animation             # plays a matplotlib animation inline
FAST = setup_notebook()                                   # FAST=True (env FLUIDPY_FAST=1) shrinks grids for quick runs
print(f"IN_COLAB = {{IN_COLAB}} | repository root: {{ROOT.name}} | fluidpy {{fluidpy.__version__}} | FAST = {{FAST}}")
"""

LIVE_NOTE = ("> ▶️ **Live cell.** The widget below needs a running Python kernel. On the web page it is frozen — open this "
             "notebook in Colab (button at the top) or run it locally to drag the sliders.")


def curation_items(chapter: str) -> dict[str, dict]:
    """Rows of the tiers and derivations tables in ``analysis/chNN_curation.md``: ``{id: {"tier", "item", "row"}}``.

    The table's first column is the ID (``C07``, ``R02``, ``N03``, ``S01``) and one column is the tier
    (CORE / RECAP / NOTE / SKIP). Derivation rows (``D01``…) get tier ``DERIVATION`` plus ``core`` (the C id they belong
    to), ``hard`` (★★★ or "hard" in the row) and ``explainers`` (backticked slugs in the LAST column). Rows without an
    ID are ignored."""
    path = ROOT / "analysis" / f"{chapter}_curation.md"
    if not path.exists():
        return {}
    out: dict[str, dict] = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) < 3 or not re.fullmatch(r"`?[CRNSD]\d{2,3}`?", cells[0]):
            continue
        key = cells[0].strip("`")
        if key.startswith("D"):
            core = next((m.group(0) for c in cells[1:] for m in [re.search(r"\bC\d{2,3}\b", c)] if m), "")
            out[key] = {"tier": "DERIVATION", "item": cells[1], "row": cells, "core": core,
                        "hard": any("★★★" in c or re.search(r"\bhard\b", c, re.I) is not None for c in cells[1:]),
                        "explainers": re.findall(r"`([a-z0-9_]+)`", cells[-1])}
            continue
        tier = next((c.upper() for c in cells[1:] if c.strip("* ").upper() in {"CORE", "RECAP", "NOTE", "SKIP"}), "")
        out[cells[0].strip("`")] = {"tier": tier.strip("* "), "item": cells[1], "row": cells}
    return out


class ChapterNotebook:
    """Accumulates cells for one chapter notebook and writes ``notebooks/chNN_<slug>.ipynb``."""

    def __init__(self, chapter: str, name: str | None = None):
        """``chapter`` is a book.yaml id (``ch02``) or a Chapter 0 part (``ch00a``, ``ch00b``, ``ch00c``). ``name`` overrides
        the file stem (e.g. ``"poc_ch00a_dot"`` for the proof-of-concept sample)."""
        book = _book()
        row = next((c for c in book["chapters"] if c["id"] == chapter), None)
        if row is None:
            for c in book["chapters"]:
                part = next((q for q in c.get("parts", []) if q["id"] == chapter), None)
                if part:
                    row = {**c, **part, "number": c["number"], "sections": [], "part_of": c["id"]}
                    break
        if row is None:
            raise KeyError(f"{chapter} not in book.yaml")
        self.chapter, self.row, self.book = chapter, row, book
        self.slug = row["slug"]
        self.name = name or f"{chapter}_{self.slug}"
        self.soft_explainer_cap = chapter.startswith("ch00")     # Q11: Chapter 0 about 12 per part, a soft target
        self.warnings: list[str] = []
        self.ledger: list[dict] = []              # equation-code ledger rows (eq, cell tag, status)
        self.nb = nbf.v4.new_notebook()
        self.cells = self.nb.cells
        self.explainers: list[str] = []
        self._has_setup = False
        self.covered: set[str] = set()
        self.current_core: str | None = None
        self.cores: dict[str, dict] = {}          # id -> {"title", "code": n, "visual": n}
        self.recaps: set[str] = set()
        self.primers: list[str] = []
        self.derivations: dict[str, dict] = {}    # id -> {"core", "title", "steps", "check"}

    # ---- primitives -------------------------------------------------------------------------------------------------
    def _add(self, cell, tags: list[str] | None = None):
        if tags:
            cell.metadata["tags"] = tags
        if self.current_core:
            cell.metadata.setdefault("fluidpy", {})["core"] = self.current_core
            info = self.cores[self.current_core]
            if cell.cell_type == "code":
                info["code"] += 1
                if (tags and VISUAL_TAGS & set(tags)) or VISUAL_CODE.search(cell.source):
                    info["visual"] += 1
        self.cells.append(cell)
        return cell

    def md(self, text: str, tags: list[str] | None = None) -> "ChapterNotebook":
        self._add(nbf.v4.new_markdown_cell(textwrap.dedent(text).strip("\n")), tags)
        return self

    def code(self, src: str, explain: str | None = None, tags: list[str] | None = None) -> "ChapterNotebook":
        """A code cell (every line commented for a novice) optionally followed by its plain-words explanation."""
        self._add(nbf.v4.new_code_cell(textwrap.dedent(src).strip("\n")), tags)
        if explain:
            body = textwrap.dedent(explain).strip()
            if not body.startswith("**"):
                body = "**What does the code above do?**\n\n" + body
            self.md(body)
        return self

    # ---- structure ----------------------------------------------------------------------------------------------------
    def title(self, big_idea: str, roadmap: list[str], prerequisites: list[str] | None = None) -> "ChapterNotebook":
        r, b = self.row, self.book["book"]
        lines = [
            f"# Chapter {r['number']} — {r['title']}",
            "",
            f"*{b['title']}, {b['edition']} edition — {', '.join(b['authors'])} ({b['year']}).*",
            "This notebook teaches every new idea of the chapter with plain words, step-by-step mathematics, small worked "
            "examples, tested Python from the `fluidpy` package, figures, animations and interactive explainers. It does "
            "not reproduce the book's text or figures; equations are cited by their numbers so you can follow along in "
            "your copy.",
            "",
            "---",
            "",
            "**The big idea in one paragraph**",
            "",
            textwrap.dedent(big_idea).strip(),
            "",
            "**Road map** — the new ideas of this chapter, in the order they build on each other:",
            "",
        ]
        lines += [f"{i + 1}. {s}" for i, s in enumerate(roadmap)]
        if prerequisites:
            lines += ["", "**What you should already know** (each is recapped where it is used):", ""] + [f"- {x}" for x in prerequisites]
        self.cells.append(nbf.v4.new_markdown_cell("\n".join(lines)))
        return self

    def explainer_index(self, items: list[tuple[str, str, str]]) -> "ChapterNotebook":
        """Table of the chapter's interactive explainers: (slug, title, what it makes clear)."""
        lo, hi = explainer_limits(self.book)
        if len(items) > hi:
            raise ValueError(f"at most {hi} explainers per chapter (got {len(items)})")
        lines = ["## 🎮 Interactive explainers in this chapter", "", "| # | Explainer | What it makes clear |", "|---|---|---|"]
        lines += [f"| {i + 1} | **{t}** | {why} |" for i, (_s, t, why) in enumerate(items)]
        lines += ["", "Each one opens right where its idea is taught and fills the window (no scrolling). Start with the "
                  "**Walkthrough**, then **Explore** with the sliders and presets, read **Explain** (every number worked "
                  "out with your settings, and what it means), step through the **Derivation** where there is one, read "
                  "the **Equations** and the **Code**, and finish with **Check yourself**. On the "
                  "web page they are full-window; in Colab and Jupyter they appear in the cell output (use ⤢ *Full screen* "
                  "or *Open in new tab* for more room)."]
        self.cells.append(nbf.v4.new_markdown_cell("\n".join(lines)))
        return self

    def setup(self) -> "ChapterNotebook":
        proj = self.book.get("project", {})
        fmt = dict(repo=proj.get("repo", "shammun/aofd"), library_repo=proj.get("library_repo", "shammun/fluidpy"),
                   pin=proj.get("library_pin", "v0.3.0"))
        self.current_core = None
        self.md(SETUP_MD.format(**fmt))
        self.code(SETUP_CODE.format(**fmt), tags=["setup"])
        self._has_setup = True
        return self

    def section(self, number: str, title: str, intro: str = "") -> "ChapterNotebook":
        """A notebook section for one book section ("7.2") or two merged short ones ("7.3–7.4" / "7.3, 7.4")."""
        self.current_core = None
        self.covered.update(re.findall(r"\d+\.\d+", number))
        self.md(f"---\n\n## {number} {title}\n\n{textwrap.dedent(intro).strip()}")
        return self

    def core(self, cid: str, title: str, question: str = "") -> "ChapterNotebook":
        """Start the block of a CORE (new) idea. Every following cell belongs to it until the next core/section/recap.
        The block must contain at least one code cell and one visual — ``save()`` checks it."""
        if not re.fullmatch(r"C\d{2,3}|C0[ABC]-(\d{2}|PoC\d)", cid):
            raise ValueError(f"CORE ids look like C07 or C0A-01 (got {cid!r})")
        if cid in self.cores:
            raise ValueError(f"CORE {cid} started twice")
        self.cores[cid] = {"title": title, "code": 0, "visual": 0}
        self.current_core = None
        head = f"### 🧩 {title}"
        if question:
            head += f"\n\n*The question:* {textwrap.dedent(question).strip()}"
        self.current_core = cid
        self.md(head)
        return self

    def recap(self, rid: str, title: str, text: str, where: str) -> "ChapterNotebook":
        """A RECAP item: an idea taught in an earlier chapter, reminded in plain words where it is needed."""
        self.current_core = None
        self.recaps.add(rid)
        self._add(nbf.v4.new_markdown_cell(f"> 🔁 **Recap — {title}** ({where}). {textwrap.dedent(text).strip()}"), ["recap"])
        return self

    def primer(self, term: str, text: str, code: str | None = None) -> "ChapterNotebook":
        """A 📎 primer: explains a concept, symbol, maths tool or Python function the moment it is first used, when the
        notebook does not teach it separately (it stays inside the current CORE block)."""
        self.primers.append(term)
        self._add(nbf.v4.new_markdown_cell(f"> 📎 **Primer — {term}.** {textwrap.dedent(text).strip()}"), ["primer"])
        if code:
            self._add(nbf.v4.new_code_cell(textwrap.dedent(code).strip("\n")), ["primer"])
        return self

    def note(self, text: str, equation: str | None = None, ref: str | None = None) -> "ChapterNotebook":
        """A NOTE item: a restatement or special case shown next to its CORE parent, optionally with the equation."""
        body = textwrap.dedent(text).strip()
        if equation:
            tag = f"\\qquad \\text{{({ref})}}" if ref else ""
            body += f"\n\n$$ {equation.strip()} {tag} $$"
        self._add(nbf.v4.new_markdown_cell(f"📝 **Note.** {body}"))
        return self

    def pointer(self, text: str) -> "ChapterNotebook":
        """A SKIP item: one line saying where the idea is covered instead."""
        self._add(nbf.v4.new_markdown_cell(f"*↪ {textwrap.dedent(text).strip()}*"))
        return self

    def worked_example(self, title: str, steps_md: str) -> "ChapterNotebook":
        """A tiny example with easy numbers, traced step by step (before the general code)."""
        self.md(f"#### ✏️ Tiny example: {title}\n\n{textwrap.dedent(steps_md).strip()}")
        return self

    def derivation(self, key: str, title: str, goal: str, start: str | tuple[str, str], steps: list,
                   result: str | tuple[str, str], ref: str = "", plan: list[str] | None = None,
                   uses: list[str] | None = None, interpret: str = "", check: str = "",
                   check_src: str | None = None) -> "ChapterNotebook":
        """A step-by-step derivation (``D03`` from the curation) inside the current CORE block.

        One small move per step, never "it can be shown". Each step is ``dict(did=…, tex=…, why=…, plain=…)`` (or the
        tuple ``(did, tex, why, plain)``): ``did`` = the move in a few words ("divide both sides by m"), ``tex`` = the new
        line, ``why`` = why the move is allowed and why we make it (name the rule; a rule not taught yet needs a primer
        first), ``plain`` = what the new line says in words. ``start``/``result`` are LaTeX or ``(tex, in words)``.
        ``check_src`` = a code cell that verifies the result with sympy (required for ★★★ derivations; every line
        commented). The same steps, word for word, drive the explainer's Derivation tab when one exists."""
        if not re.fullmatch(r"D\d{2,3}|D0[ABC]-(\d{2}|PoC\d)", key):
            raise ValueError(f"derivation ids look like D03 (got {key!r})")
        if key in self.derivations:
            raise ValueError(f"derivation {key} written twice")
        if not self.current_core:
            raise ValueError(f"derivation {key} must sit inside a CORE block (call nb.core(...) first)")
        if not goal.strip():
            raise ValueError(f"derivation {key}: say in plain words what we want to show (goal)")
        norm = []
        for i, st in enumerate(steps, 1):
            d = dict(zip(("did", "tex", "why", "plain"), st)) if isinstance(st, (tuple, list)) else dict(st)
            miss = [k for k in ("did", "tex", "why", "plain") if not str(d.get(k, "")).strip()]
            if miss:
                raise ValueError(f"derivation {key} step {i}: missing {miss}")
            if len(str(d["why"]).split()) < 6:
                raise ValueError(f"derivation {key} step {i}: 'why' is too short — say why the move is allowed and why we make it")
            norm.append(d)
        if len(norm) < 2:
            raise ValueError(f"derivation {key}: {len(norm)} step(s) — show every move (at least 2 steps)")

        def pair(x):
            return (x, "") if isinstance(x, str) else (x[0], x[1] if len(x) > 1 else "")

        def ded(t):
            return textwrap.dedent(t).strip()

        start_tex, start_plain = pair(start)
        res_tex, res_plain = pair(result)
        lines = [f"#### 🧮 Derivation — {title}" + (f" (Eq. {ref})" if ref else ""), "",
                 f"**What we want to show.** {ded(goal)}", ""]
        if plan:
            lines += ["**The plan.**", ""] + [f"{i}. {ded(x)}" for i, x in enumerate(plan, 1)] + [""]
        if uses:
            lines += ["**Tools we use** (each explained before this point): " + " · ".join(uses), ""]
        lines += ["**We start from**", "", f"$$ {start_tex.strip()} $$", ""]
        if start_plain:
            lines += [f"*In words:* {ded(start_plain)}", ""]
        for i, d in enumerate(norm, 1):
            lines += ["---", "", f"**Step {i} of {len(norm)} — {ded(d['did'])}.**", "", f"$$ {d['tex'].strip()} $$", "",
                      f"- *Why we can do this:* {ded(d['why'])}", f"- *In words:* {ded(d['plain'])}", ""]
        lines += ["---", "", "**Result**", "", f"$$ {res_tex.strip()} $$", ""]
        if res_plain:
            lines += [f"*In words:* {ded(res_plain)}", ""]
        if interpret:
            lines += [f"**What it means.** {ded(interpret)}", ""]
        if check:
            lines += [f"**Check it.** {ded(check)}", ""]
        cell = self._add(nbf.v4.new_markdown_cell("\n".join(lines).rstrip()), ["derivation"])
        cell.metadata.setdefault("fluidpy", {})["derivation"] = key
        if check_src:
            cc = self._add(nbf.v4.new_code_cell(textwrap.dedent(check_src).strip("\n")), ["derivation-check"])
            cc.metadata.setdefault("fluidpy", {})["derivation"] = key
        self.derivations[key] = {"core": self.current_core, "title": title, "steps": len(norm), "check": bool(check_src)}
        return self

    def figure_notes(self, see: str, read: str, change: str) -> "ChapterNotebook":
        text = "\n\n".join([f"**What you see.** {textwrap.dedent(see).strip()}",
                            f"**How to read it.** {textwrap.dedent(read).strip()}",
                            f"**What would change if…** {textwrap.dedent(change).strip()}"])
        self._add(nbf.v4.new_markdown_cell(text))
        return self

    def figure(self, src: str, see: str, read: str, change: str, explain: str | None = None) -> "ChapterNotebook":
        """A static figure cell followed by its three reading notes."""
        self.code(src, explain=explain, tags=["figure"])
        return self.figure_notes(see, read, change)

    def explainer(self, slug: str, heading: str, why: str, tries: list[str]) -> "ChapterNotebook":
        lo, hi = explainer_limits(self.book)
        if slug in self.explainers:
            raise ValueError(f"explainer {slug} embedded twice")
        if len(self.explainers) >= hi and not self.soft_explainer_cap:
            raise ValueError(f"at most {hi} explainers per chapter")
        self.explainers.append(slug)
        try_md = "\n".join(f"- {t}" for t in tries)
        self.md(f"#### 🎮 Interactive: {heading}\n\n{textwrap.dedent(why).strip()}\n\n**What to try:**\n{try_md}")
        viz_ch = self.row.get("part_of", self.chapter)          # Chapter 0 parts share viz/ch00/
        self.code(f'show_viz("{viz_ch}", "{slug}")   # full-width explainer; ⤢ Full screen for more room',
                  tags=["explainer"])
        return self

    def animation(self, src: str, explain: str | None = None) -> "ChapterNotebook":
        return self.code(src, explain=explain, tags=["animation"])

    def plotly(self, src: str, explain: str | None = None) -> "ChapterNotebook":
        return self.code(src, explain=explain, tags=["plotly"])

    def live(self, src: str, explain: str | None = None) -> "ChapterNotebook":
        self.md(LIVE_NOTE)
        return self.code(src, explain=explain, tags=["live-only"])

    def check_agree(self, src: str) -> "ChapterNotebook":
        """The from-scratch version next to the tested fluidpy function, with an assertion that both agree."""
        return self.code(src, tags=["from-scratch"])

    # ---- AOFD blocks (PLANNING §8.1, R4 §1–§4) ---------------------------------------------------------------------
    def kundu_recap(self, kid: str, title: str, kundu: str, urls: dict, crosswalk: list, body_md: str, adds: str,
                    derivation: str = "") -> "ChapterNotebook":
        """🔁 From Kundu — the full K-recap block at the first Vallis use of a Kundu idea. ``urls`` maps link labels to
        kundu_index URLs; ``crosswalk`` rows are (Kundu symbol, Vallis symbol, note); ``body_md`` is the full
        re-teaching (plain words → equation → derivation → example); ``adds`` = "What Vallis adds". Code, figure and
        derivation cells follow with the normal methods."""
        self.current_core = None
        self.recaps.add(kid)
        links = " · ".join(f"[{k}]({v})" for k, v in urls.items())
        head = f"> 🔁 **From Kundu {kundu} — {title}** ({kid})  \n> {links}"
        if derivation:
            head += f" · Kundu derivation {derivation}"
        table = "| Kundu | Vallis | Note |\n|---|---|---|\n" + "\n".join(f"| {a} | {b} | {c} |" for a, b, c in crosswalk)
        self._add(nbf.v4.new_markdown_cell(f"{head}\n\n**Notation crosswalk**\n\n{table}\n\n{textwrap.dedent(body_md).strip()}"
                                           f"\n\n**What Vallis adds.** {textwrap.dedent(adds).strip()}"),
                  ["recap", "kundu-recap"])
        return self

    def scratch_vs_lib(self, eq: str, scratch_src: str, lib_src: str, explain: str | None = None,
                       eq_tex: str = "") -> "ChapterNotebook":
        """🐍 From scratch, then the library: two cells for equation ``eq`` ("2.12", "K 13.15", "B.3.9", "0A.1").
        ``eq_tex`` is the equation itself (shown next to its number — never the number alone, CLAUDE.md rule 3).
        The scratch cell must not call fluidpy/aofd; the library cell must assert that both agree."""
        if re.search(r"\b(fluidpy|aofd)\.", scratch_src) or re.search(r"^\s*(from|import)\s+(fluidpy|aofd)\b", scratch_src, re.M):
            raise ValueError(f"eq {eq}: the from-scratch cell calls the library — it must compute by hand")
        if not re.search(r"assert_allclose|assert ", lib_src):
            raise ValueError(f"eq {eq}: the library cell must assert that scratch and library agree")
        tag = "eq:" + eq.replace(" ", "")
        self.md(f"#### 🐍 From scratch — ${eq_tex.strip()}$ ({eq})" if eq_tex else f"#### 🐍 From scratch — Eq. ({eq})")
        self.code(scratch_src, tags=["from-scratch", tag])
        self.code(lib_src, explain=explain, tags=["library-check", tag])
        self.ledger.append({"eq": eq, "tex": eq_tex, "tag": tag, "status": "coded", "core": self.current_core})
        return self

    def ledger_row(self, eq: str, status: str, why: str = "") -> "ChapterNotebook":
        """Record an equation without a scratch/library pair: ``status`` = "sympy" (checked symbolically) or
        "not computable" (with ``why``)."""
        ok = status in ("sympy", "not computable")
        self.ledger.append({"eq": eq, "tag": "", "status": "coded" if ok else status, "why": why,
                            "kind": status, "core": self.current_core})
        return self

    def equation_ledger(self) -> "ChapterNotebook":
        """The equation-code ledger table for the current block (eq → cell tag → status)."""
        rows = [r for r in self.ledger if r.get("core") == self.current_core] or self.ledger
        table = "| Eq. | Cell tag | Status |\n|---|---|---|\n" + "\n".join(
            f"| {('$' + r['tex'] + '$ ') if r.get('tex') else ''}({r['eq']}) | `{r['tag']}` | {r.get('kind', r['status'])} |"
            for r in rows)
        self._add(nbf.v4.new_markdown_cell(f"**📒 Equation-code ledger**\n\n{table}"), ["ledger"])
        return self

    def anatomy(self, tex: str, terms: list, ref: str = "") -> "ChapterNotebook":
        """The equation in full with an anatomy strip: ``terms`` = (term TeX, plain name and role, colour family)."""
        tag = f"\\qquad \\text{{({ref})}}" if ref else ""
        rows = "| Term | What it is | Family |\n|---|---|---|\n" + "\n".join(f"| ${t}$ | {w} | {c} |" for t, w, c in terms)
        self._add(nbf.v4.new_markdown_cell(f"$$ {tex.strip()} {tag} $$\n\n**Anatomy**\n\n{rows}"), ["anatomy"])
        return self

    def magnitude_table(self, rows: list, dominant: str) -> "ChapterNotebook":
        """Term-magnitude table: (term TeX, easy estimate, exact value, unit) + the dominant balance in words."""
        body = "| Term | Easy estimate | Exact | Unit |\n|---|---|---|---|\n" + "\n".join(
            f"| ${t}$ | {e} | {v:.3g} | {u} |" for t, e, v, u in rows)
        self._add(nbf.v4.new_markdown_cell(f"**📏 How big is each term?**\n\n{body}\n\n**Dominant balance:** {dominant}"),
                  ["magnitude"])
        return self

    def like_unlike(self, like: str, unlike: str) -> "ChapterNotebook":
        """An analogy with the place where it breaks (teaching-style: Like… / Unlike…)."""
        self._add(nbf.v4.new_markdown_cell(f"> 💡 **Like…** {textwrap.dedent(like).strip()}  \n"
                                           f"> 🚧 **Unlike…** {textwrap.dedent(unlike).strip()}"), ["analogy"])
        return self

    def mechanism(self, name: str, story: str, picture_src: str, equation: str, number: str, misconception: str,
                  where_next: str, ref: str = "") -> "ChapterNotebook":
        """🌍 Mechanism card (R4 §4): story · picture (a code cell) · one equation · a number · misconception · where next."""
        tag = f"\\qquad \\text{{({ref})}}" if ref else ""
        self.md(f"### 🌍 Mechanism — {name}\n\n**The story.** {textwrap.dedent(story).strip()}")
        self.code(picture_src, tags=["figure", "mechanism"])
        self.md(f"**One equation.**\n\n$$ {equation.strip()} {tag} $$\n\n**A number.** {textwrap.dedent(number).strip()}\n\n"
                f"> ⚠️ **Misconception.** {textwrap.dedent(misconception).strip()}\n\n**Where next.** {where_next}")
        return self

    def reading_card(self, what: str, axes: str, encoding: str, feature: str, physics: str, source: str) -> "ChapterNotebook":
        """🗺️ How to read this figure — the five questions + source line, always BEFORE the interpretation."""
        self._add(nbf.v4.new_markdown_cell(
            "> 🗺️ **How to read this figure**\n>\n"
            f"> 1. **What is plotted?** {what}\n> 2. **Where and when are the axes?** {axes}\n"
            f"> 3. **How is value encoded?** {encoding}\n> 4. **What is the one big feature?** {feature}\n"
            f"> 5. **Which physics explains it, and what would change it?** {physics}\n>\n> **Where it comes from.** {source}"),
            ["reading-card"])
        return self

    def data_figure(self, fig: str, call_src: str, card: dict, see: str, read: str, change: str) -> "ChapterNotebook":
        """A reproduced data figure (``figs/chNN/fig_NN_MM.py``): reading card first, then the figure, then notes."""
        self.reading_card(**card)
        self.code(call_src, tags=["figure", f"fig:{fig}"])
        return self.figure_notes(see, read, change)

    def scene(self, chapter: str, slug: str, heading: str, why: str) -> "ChapterNotebook":
        """A standalone full-window 3-D scene (``scenes/chNN/<slug>.html``) embedded next to its CORE block."""
        self.md(f"#### 🌐 3-D scene: {heading}\n\n{textwrap.dedent(why).strip()}")
        self.code('from aofd.embed import show_scene      # scenes live in scenes/, not viz/\n'
                  f'show_scene("{chapter}", "{slug}")          # standalone 3-D scene, full window', tags=["scene"])
        return self

    def movie(self, slug: str, title: str, poster: str, url: str = "") -> "ChapterNotebook":
        """🎬 A movie block (only after /approve-movie): poster + link; the page gets the <video> block."""
        link = f"[watch]({url})" if url else "(published after approval)"
        self._add(nbf.v4.new_markdown_cell(f"#### 🎬 Movie: {title}\n\n![poster]({poster})\n\n{link}"), ["movie"])
        return self

    def summary(self, clicked: list[str], feeds_forward: list[str], left_out: list[str] | None = None) -> "ChapterNotebook":
        self.current_core = None
        c = "\n".join(f"- {x}" for x in clicked)
        f = "\n".join(f"- {x}" for x in feeds_forward)
        lo = ("\n\n**Not taught here (and where to find it)**\n" + "\n".join(f"- {x}" for x in left_out)) if left_out else ""
        self.md(f"---\n\n## ✅ What should have clicked\n\n{c}\n\n**What later chapters build on**\n\n{f}{lo}")
        return self

    # ---- checks and output --------------------------------------------------------------------------------------------
    def missing_sections(self) -> list[str]:
        """Book sections (from book.yaml) that have no ``section(...)`` in this notebook yet."""
        numbers = [re.match(r"\s*(\d+\.\d+)", s).group(1) for s in self.row.get("sections", []) if re.match(r"\s*\d+\.\d+", s)]
        return [n for n in numbers if n not in self.covered]

    def coverage_problems(self, allow_missing: list[str] | None = None) -> list[str]:
        allow = set(allow_missing or [])
        problems = []
        miss = [n for n in self.missing_sections() if n not in allow]
        if miss:
            problems.append(f"book sections with no nb.section(...): {miss} — every section must appear in the notebook")
        for cid, info in self.cores.items():
            if info["code"] == 0:
                problems.append(f"CORE {cid} ({info['title']}) has no code cell")
            if info["visual"] == 0:
                problems.append(f"CORE {cid} ({info['title']}) has no visual (figure / animation / plotly / explainer)")
        planned = curation_items(self.chapter)
        for cid, row in planned.items():
            if cid in allow:
                continue
            if row["tier"] == "CORE" and cid not in self.cores:
                problems.append(f"CORE {cid} from the curation ({row['item']}) has no nb.core('{cid}', …) block")
            if row["tier"] == "RECAP" and cid not in self.recaps:
                problems.append(f"RECAP {cid} from the curation ({row['item']}) has no nb.recap('{cid}', …)")
            if row["tier"] == "DERIVATION":
                got = self.derivations.get(cid)
                if not got:
                    problems.append(f"DERIVATION {cid} from the curation ({row['item']}) has no nb.derivation('{cid}', …)")
                else:
                    if row.get("core") and got["core"] != row["core"]:
                        problems.append(f"DERIVATION {cid} sits in {got['core']} but the curation puts it in {row['core']}")
                    if row.get("hard") and not got["check"]:
                        problems.append(f"DERIVATION {cid} is ★★★ (hard) but has no check_src (sympy verification cell)")
        lo, hi = explainer_limits(self.book)
        if not (lo <= len(self.explainers) <= hi) and "explainers" not in allow:
            msg = f"{len(self.explainers)} explainers embedded (need {lo}–{hi})"
            if self.soft_explainer_cap:
                self.warnings.append(msg + " — Chapter 0 soft target (about 12 per part), warning only")
            else:
                problems.append(msg)
        for row in self.ledger:
            if row["status"] != "coded":
                problems.append(f"equation-code ledger: ({row['eq']}) is {row['status']}")
        return problems

    def save(self, allow_missing: list[str] | None = None) -> Path:
        """Write the notebook, refusing when the coverage rules fail (see the module docstring). ``allow_missing`` may
        list section numbers, item ids or "explainers" to bypass a check deliberately (say why in the builder)."""
        if not self._has_setup:
            raise ValueError("call .setup() — every notebook needs the setup cell")
        problems = self.coverage_problems(allow_missing)
        if problems:
            raise ValueError("notebook coverage check failed:\n  - " + "\n  - ".join(problems))
        self.nb.metadata["kernelspec"] = {"name": "python3", "display_name": "Python 3", "language": "python"}
        self.nb.metadata["language_info"] = {"name": "python"}
        self.nb.metadata["fluidpy"] = {"chapter": self.chapter, "explainers": self.explainers,
                                      "cores": sorted(self.cores), "recaps": sorted(self.recaps), "primers": self.primers,
                                      "derivations": self.derivations, "ledger": self.ledger}
        for i, c in enumerate(self.cells):           # stable, readable cell ids
            c["id"] = f"{self.chapter}-{i:03d}"
        nbf.validate(self.nb)
        for w in self.warnings:
            print("nbkit warning:", w)
        dest = ROOT / "notebooks" / f"{self.name}.ipynb"
        dest.parent.mkdir(exist_ok=True)
        nbf.write(self.nb, dest)
        return dest


def notebook_path(chapter: str) -> Path:
    row = next(c for c in _book()["chapters"] if c["id"] == chapter)
    return ROOT / "notebooks" / f"{chapter}_{row['slug']}.ipynb"


def explainer_calls(nb_path: Path) -> list[str]:
    """``slug`` of every ``show_viz("chNN", "slug")`` call in a notebook, in order."""
    nb = nbf.read(nb_path, as_version=4)
    out = []
    for c in nb.cells:
        if c.cell_type == "code":
            out += [m.group(2) for m in re.finditer(r"show_viz\(\s*[\"'](\w+)[\"']\s*,\s*[\"']([\w\-]+)[\"']", c.source)]
    return out
