"""Build the PoC G sample: ONE Chapter-0A block on the dot product, in the informal Chapter-0 voice.

    .venv/Scripts/python.exe notebooks/build_poc_ch00a_dot.py           # writes notebooks/poc_ch00a_dot.ipynb (no outputs)
    .venv/Scripts/python.exe notebooks/build_poc_ch00a_dot.py --dump    # print the cell outline, write nothing

Design: analysis/ch00_poc_design.md "Part A/C · PoC G" (cells 1–19) and Part G (ledger rows). Brief: analysis/ch00_poc.md.
Equations transcribed from the page images: Kundu ch02 p. 41 (K 2.2), p. 52 (cosine form, unnumbered; (K 2.20), (K 2.21));
Kundu App. B p. 862 (div as a dot product with del, unnumbered); Vallis p. 5 (1.7) and p. 66 (2.55).
"""
from __future__ import annotations

import argparse
import pathlib
import sys

import yaml

ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))
from nbkit import ChapterNotebook  # noqa: E402

ATLAS = "https://shammun.github.io/aofd/viz/atlas.html"          # the symbol atlas page (built from knowledge/symbols.yaml)
K02 = "https://shammun.github.io/fluidpy/notebooks/ch02_cartesian_tensors.html"
K21 = f"{K02}#2.1-Scalars,-Vectors,-Tensors,-Notation"
K_LINKS = {
    "Kundu notebook §2.1": f"{K02}#2.1-Scalars,-Vectors,-Tensors,-Notation",
    "C01 summation convention": f"{K02}#%F0%9F%A7%A9-The-summation-convention:-a-repeated-index-is-a-sum-C01",
    "C08 alternating tensor (cross product)": f"{K02}#%F0%9F%A7%A9-The-alternating-tensor-%CE%B5_ijk-C08",
    "explainer rotation_of_axes": "https://shammun.github.io/fluidpy/viz/ch02/rotation_of_axes.html",
}

# ---- tex used everywhere (design §0, checked on the page images) -------------------------------------------------------
DOT_DEF = r"\mathbf a\cdot\mathbf b = a_1b_1 + a_2b_2 + a_3b_3 = \sum_{i=1}^{3} a_ib_i \equiv a_ib_i"
EQ_0A1 = r"\mathbf a\cdot\mathbf b = |\mathbf a|\,|\mathbf b|\cos\theta"
EQ_0A3 = (r"\underbrace{|\mathbf a|\cos\theta = \frac{\mathbf a\cdot\mathbf b}{|\mathbf b|}}_{\text{shadow length}},"
          r"\qquad \underbrace{\frac{\mathbf a\cdot\mathbf b}{|\mathbf b|^2}\,\mathbf b}_{\text{shadow as an arrow}}")
V17 = r"\frac{D\varphi}{Dt} = \frac{\partial\varphi}{\partial t} + (\boldsymbol v\cdot\nabla)\varphi"
V255 = r"\frac{D\boldsymbol u}{Dt} + \boldsymbol f\times\boldsymbol u = -\frac{1}{\rho}\nabla_z p"


def symbols_table(wanted: list[str], extra: list[tuple[str, str, str, str]]) -> str:
    """Rows for the symbols used in this block: atlas entries (knowledge/symbols.yaml) + Ch. 0A-only symbols."""
    atlas = yaml.safe_load((ROOT / "knowledge" / "symbols.yaml").read_text(encoding="utf-8"))["symbols"]
    entries = {e["symbol"]: e for fam in atlas.values() for e in fam}
    rows = ["| Symbol | Name | Unit | Meaning | ⚠️ Watch out |", "|---|---|---|---|---|"]
    for s in wanted:
        e = entries[s]                                  # KeyError = the atlas lacks it: fix the list, never guess
        pit = str(e.get("pitfall", "")).replace("|", "/")
        rows.append(f"| ${s}$ | {e['name']} | {e.get('unit', '')} | {e['meaning']} | {pit} |")
    for s, name, unit, meaning in extra:
        rows.append(f"| ${s}$ | {name} | {unit} | {meaning} | Chapter 0A symbol (not yet in the atlas) |")
    return "\n".join(rows)


def glossary_box(words: list[str], ours: dict[str, str]) -> str:
    """'Words used here': short definitions from knowledge/glossary.yaml, plus ours for words it does not have yet."""
    terms = {t["term"]: t for t in yaml.safe_load((ROOT / "knowledge" / "glossary.yaml").read_text(encoding="utf-8"))["terms"]}
    lines = ["> 📖 **Words used in this block**", ">"]
    for w in words:
        lines.append(f"> - **{w}** — {terms[w]['short']}")
    for w, d in ours.items():
        lines.append(f"> - **{w}** — {d}")
    return "\n".join(lines)


def show_eq(nb: ChapterNotebook, eq: str, tex: str) -> None:
    """Write the equation itself under the "From scratch — Eq. (n)" heading that nbkit.scratch_vs_lib just added."""
    head = next(c for c in reversed(nb.cells) if c.source.startswith(f"#### 🐍 From scratch — Eq. ({eq})"))
    head.source += f"\n\n$$ {tex} $$"


LEDGER_WHAT = {
    "K 2.2": r"$\mathbf a\cdot\mathbf b = a_1b_1 + a_2b_2 + a_3b_3$ (component recipe)",
    "0A.1": r"$\mathbf a\cdot\mathbf b = \lvert\mathbf a\rvert\lvert\mathbf b\rvert\cos\theta$ (the angle from the recipe)",
    "0A.3": r"$\lvert\mathbf a\rvert\cos\theta = \mathbf a\cdot\mathbf b/\lvert\mathbf b\rvert$, $(\mathbf a\cdot\mathbf b/\lvert\mathbf b\rvert^2)\,\mathbf b$ (the shadow)",
    "1.7-adv": r"$\mathbf u\cdot\nabla T$, the advection term of (1.7) $D\varphi/Dt = \partial\varphi/\partial t + (\boldsymbol v\cdot\nabla)\varphi$",
}


def ledger_md(nb: ChapterNotebook) -> str:
    """The equation-code ledger with a "what it is" column (equation written out, so no number stands alone)."""
    rows = ["| Eq. | What it is | Cell tag | Status |", "|---|---|---|---|"]
    rows += [f"| ({r['eq']}) | {LEDGER_WHAT[r['eq']]} | `{r['tag']}` | {r.get('kind', r['status'])} |" for r in nb.ledger]
    return "**📒 Equation-code ledger**\n\n" + "\n".join(rows)


def build() -> ChapterNotebook:
    nb = ChapterNotebook("ch00a", name="poc_ch00a_dot")

    # ---- title, explainer index, setup -------------------------------------------------------------------------------
    nb.title(
        big_idea="""
        *Proof-of-concept sample — one block of Chapter 0A, written in the Chapter-0 voice.*

        Vallis multiplies arrows on almost every page: the wind **dotted** with a temperature slope tells you how fast a
        place warms or cools, the wind **crossed** with the Earth's spin gives the Coriolis effect. This sample teaches
        the first of the two products from scratch: what it measures (a shadow), why the two ways of computing it give the
        same number, how to compute it by hand in Python and with the tested library, and where it shows up in Vallis.""",
        roadmap=["The dot product: how much of one arrow points along another (C0A-PoC1)"],
        prerequisites=["Arrows (vectors) as lists of components — introduced right here",
                       "Pythagoras and the cosine of an angle — school maths, primed below"])
    nb.explainer_index([("vector_products_lab", "What do a·b and a×b actually measure?",
                         "the dot product as a signed shadow, the cross product as an area that points")])
    nb.setup()

    # ---- section and CORE block --------------------------------------------------------------------------------------
    nb.section("0.3", "The dot product: how much of one arrow points along another", intro="""
        **What is this section about?** One way to multiply two arrows and get a plain number back. That number answers a
        very practical question — *how much of this arrow points along that one?* — and it sits inside almost every
        equation of Vallis, starting with the very first boxed one in Chapter 1.""")
    nb.core("C0A-PoC1", "The dot product",
            question="How much of the wind is actually blowing *toward* the warm air?")

    nb.md("""
        #### Imagine a breeze and a warm town

        Imagine you are standing in a flat field. A steady **breeze of 10 m/s** blows past you, heading toward the
        **north-east** (weather reports would call this a *south-westerly*, because forecasters name a wind after the
        direction it comes **from**). Somewhere to the **north** of you, the air is warmer.

        Here is the question: how much of that breeze is actually carrying air toward the warm side? Not all 10 m/s — part
        of the breeze is going sideways, toward the east, and that part does not bring you any closer to the warm air.

        Now picture a lamp straight overhead and a long line painted on the ground, pointing north. The breeze arrow casts a
        **shadow** on that line. The length of that shadow is the part that counts: here about **7 m/s** (we will get
        7.07 m/s in a minute). That's roughly a fast cycling speed — the other 7 m/s or so is going sideways.

        The **dot product** is exactly this "shadow along a direction", made precise. That's the whole idea; the rest of
        this block makes it exact, proves it, and turns it into code.""")

    nb.md(rf"""
        #### Arrows, written as numbers

        An **arrow** (mathematicians say *vector*) has a length and a direction. We write it in bold, like $\mathbf a$,
        and describe it by three numbers called its **components**: how far it goes east, how far north, and how far up.

        $$\mathbf a = (a_1, a_2, a_3) = (\text{{east part}},\ \text{{north part}},\ \text{{up part}}).$$

        These are the same three directions $x, y, z$ (east, north, up) that Vallis uses for a small patch of the Earth
        ([📇 atlas]({ATLAS})); the arrows of length one along them are called $\mathbf i, \mathbf j, \mathbf k$.

        Three more symbols, each the moment we need it:
        - $|\mathbf a|$ — the **length** of $\mathbf a$ (same unit as its components; for a wind, m/s).
        - $\mathbf b = (b_1, b_2, b_3)$ — a second arrow, the direction we measure *along* (in the story: north).
        - $\theta$ — the **angle between** the two arrows, somewhere from 0° (same direction) to 180° (opposite).

        > ⚠️ **Which convention?** In this block only, $\theta$ means "the angle between two arrows". In Vallis, $\theta$ is
        > **potential temperature** and latitude is the curly $\vartheta$; Kundu uses $\theta$ for latitude in his
        > Chapter 13 and for colatitude in Appendix B. And Vallis's $a$ (not bold) is the Earth's radius, 6371 km — our bold
        > $\mathbf a$ is just "some arrow".""")

    nb.primer("length from components (Pythagoras in 3-D)", r"""
        An arrow that goes $a_1$ east, $a_2$ north and $a_3$ up has length $|\mathbf a| = \sqrt{a_1^2 + a_2^2 + a_3^2}$ —
        Pythagoras, used twice (once on the floor, once up the wall). For $\mathbf a = (2, 1, 0)$ that is $\sqrt{5} \approx 2.236$.""",
        code="""
        import numpy as np                       # numpy: arrays and square roots
        a = np.array([2.0, 1.0, 0.0])            # an arrow: 2 east, 1 north, 0 up
        print(np.sqrt(a[0]**2 + a[1]**2 + a[2]**2))   # |a| = sqrt(4 + 1 + 0) = 2.236...""")

    # ---- the picture ---------------------------------------------------------------------------------------------------
    nb.figure("""
        import numpy as np                                    # arrays and trigonometry
        import matplotlib.pyplot as plt                       # plotting
        from matplotlib.patches import Arc                    # a circular arc, to mark the angle θ
        from fluidpy.core.style import COLORS                 # house colours: a teal, b orange (same as the explainer)

        a = np.array([2.0, 1.0])                              # arrow a = (2 east, 1 north), a pure example (no unit)
        b = np.array([1.0, 3.0])                              # arrow b = (1 east, 3 north): the direction we measure along
        len_b = np.sqrt(b[0]**2 + b[1]**2)                    # |b| = sqrt(10) ≈ 3.162 (Pythagoras)
        b_hat = b / len_b                                     # b shrunk to length 1: just its direction
        shadow = (a[0]*b[0] + a[1]*b[1]) / len_b              # shadow length (0A.3): (2·1 + 1·3)/3.162 ≈ 1.581
        foot = shadow * b_hat                                 # where the shadow ends on b's line: (0.5, 1.5)
        n_hat = (a - foot) / np.sqrt(((a - foot)**2).sum())   # unit arrow from the foot up to a's tip (⟂ to b)

        fig, ax = plt.subplots(figsize=(5.6, 5.0))            # one square-ish panel
        ax.plot([-0.4*b_hat[0], 1.2*b[0]], [-0.4*b_hat[1], 1.2*b[1]], color=COLORS["grid"], lw=1, zorder=0)  # b's line, extended
        ax.plot([0, foot[0]], [0, foot[1]], color=COLORS["teal"], lw=9, alpha=0.35, solid_capstyle="butt")    # the shadow (thick teal)
        ax.plot([a[0], foot[0]], [a[1], foot[1]], ls="--", color=COLORS["muted"], lw=1.3)                    # light ray from a's tip
        s = 0.14                                              # size of the right-angle tick [plot units]
        sq = np.array([foot - s*b_hat, foot - s*b_hat + s*n_hat, foot + s*n_hat])   # three corners of the tick
        ax.plot(sq[:, 0], sq[:, 1], color=COLORS["muted"], lw=1)                    # draw the little square corner
        for v, c, name in [(a, "teal", "a = (2, 1)"), (b, "orange", "b = (1, 3)")]:  # the two arrows from the origin
            ax.annotate("", xy=v, xytext=(0, 0), arrowprops=dict(arrowstyle="-|>", color=COLORS[c], lw=2.6, mutation_scale=18))
            ax.text(v[0] + 0.08, v[1] + 0.05, name, color=COLORS[c], fontsize=12, fontweight="bold")
        ang_a = np.degrees(np.arctan2(a[1], a[0]))            # direction of a, measured from east [°] ≈ 26.6
        ang_b = np.degrees(np.arctan2(b[1], b[0]))            # direction of b [°] ≈ 71.6
        ax.add_patch(Arc((0, 0), 1.3, 1.3, theta1=ang_a, theta2=ang_b, color=COLORS["ink"], lw=1.2))   # the angle between them
        ax.text(0.78, 0.40, f"θ = {ang_b - ang_a:.0f}°", fontsize=11)               # θ = 45°
        ax.text(foot[0] - 1.25, foot[1] + 0.05, f"shadow = |a| cos θ\\n= {shadow:.3f}", color=COLORS["teal"], fontsize=10)
        ax.set_xlim(-0.6, 3.2); ax.set_ylim(-0.4, 3.6); ax.set_aspect("equal")    # same scale on both axes (angles look right)
        ax.set_xlabel("east component"); ax.set_ylabel("north component")
        ax.set_title(f"a's shadow on b's line is {shadow:.2f} long\\na·b = shadow × |b| = {shadow:.3f} × {len_b:.3f} = {shadow*len_b:.0f}", fontsize=11)
        plt.show()""",
        see="""Two arrows from the same corner: **a** (teal) and **b** (orange), 45° apart. Light falls at right angles onto
        b's line (dashed ray, with the little square showing the right angle). The thick teal stripe is a's **shadow** on
        that line, 1.581 long.""",
        read=r"""Both axes are components (east and north), drawn at the same scale so angles are true. The shadow starts at
        the origin and ends at the point $(0.5,\ 1.5)$, where the dashed ray meets b's line. Multiply the shadow by b's length
        3.162 and you get 5 — the dot product, in the title.""",
        change="""Turn b to **(−1, 2)**, at right angles to a: the ray drops straight onto the origin and the shadow
        shrinks to a point, so a·b = 0. Turn it further, past 90°, and the shadow lands *behind* the origin — a negative
        dot product. (Try it in the explainer below with the *perpendicular* and *anti-parallel* presets.)""")

    # ---- from Kundu ----------------------------------------------------------------------------------------------------
    links = " · ".join(f"[{k}]({v})" for k, v in K_LINKS.items())
    nb.md(rf"""
        > 🔁 **From Kundu ch02 §2.1 and §2.8 — the dot product.** {links}
        >
        > Kundu introduces the dot product in his §2.1 as the first example of the summation convention and comes back to
        > it in §2.8 (vector, dot and cross products); his Appendix B §B.3 then uses it inside every $\nabla$ formula.
        > Here it is re-taught from zero, in Vallis's letters.

        | Kundu | Vallis / this notebook | Note |
        |---|---|---|
        | $\mathbf a\cdot\mathbf b$, $\mathbf u\cdot\mathbf v$ | $\mathbf a\cdot\mathbf b$ | same product; Kundu's §2.8 uses $\mathbf u,\mathbf v$, which in Vallis are winds |
        | $\mathbf e_1, \mathbf e_2, \mathbf e_3$ | $\mathbf i, \mathbf j, \mathbf k$ | unit arrows east, north, up |
        | $\theta$ = angle between the arrows (§2.8) | $\theta$ here; ⚠️ $\theta$ = potential temperature in Vallis | latitude is $\vartheta$ in Vallis |
        | $u, v$ = lengths of $\mathbf u, \mathbf v$ (§2.8) | $\lvert\mathbf a\rvert, \lvert\mathbf b\rvert$ | in Vallis $u, v$ are wind components, so we write lengths with bars |""")

    # ---- the exact statement -------------------------------------------------------------------------------------------
    nb.md(rf"""
        #### The precise version

        Here is the exact statement. For two arrows with components $\mathbf a = (a_1, a_2, a_3)$ and
        $\mathbf b = (b_1, b_2, b_3)$, the **dot product** is "multiply the matching parts and add them up":

        $$ {DOT_DEF} \qquad \text{{(K 2.2)}} $$

        (The last form, $a_ib_i$, is Kundu's shorthand: a repeated letter $i$ means "add over $i = 1, 2, 3$".)

        And the claim of this block — which we will *prove* in a moment — is that this recipe gives the shadow picture:

        $$ {EQ_0A1} \qquad \text{{(0A.1)}} $$

        Kundu states (0A.1) without a number (§2.8); we label it **(0A.1)** so that we can refer to it. Dividing by $|\mathbf b|$ gives the
        shadow itself, as a length or as an arrow lying along $\mathbf b$:

        $$ {EQ_0A3} \qquad \text{{(0A.3)}} $$

        ((0A.2) is kept for the cross product's area, $|\mathbf a\times\mathbf b| = |\mathbf a|\,|\mathbf b|\sin\theta$, in the next block.)""")
    nb.anatomy(EQ_0A1, ref="0A.1", terms=[
        (r"\mathbf a\cdot\mathbf b", "the dot product: a's share along b, times the length of b (computed as a₁b₁ + a₂b₂ + a₃b₃)", "teal (a) · orange (b) glyph pair"),
        (r"\lvert\mathbf a\rvert\cos\theta", "a's shadow on b's line — positive if a leans along b, negative if it leans against it", "teal"),
        (r"\lvert\mathbf b\rvert", "the length of the direction arrow; makes the product symmetric (a·b = b·a)", "orange"),
        (r"\cos\theta", "1 if parallel, 0 if at right angles, −1 if opposite", "—"),
    ])

    # ---- derivation ----------------------------------------------------------------------------------------------------
    nb.primer("law of cosines", r"""
        For any triangle with two sides $A$ and $B$ meeting at angle $\theta$, the third side $C$ obeys
        $C^2 = A^2 + B^2 - 2AB\cos\theta$. At $\theta = 90°$ the last term vanishes and you are back to Pythagoras; at
        $\theta = 0°$ it gives $C = |A - B|$ (a flattened triangle). Check with a 3-4-5 triangle: $25 = 9 + 16 - 0$.""",
        code="""
        import numpy as np                                   # trigonometry
        A, B = 3.0, 4.0                                      # two sides of a triangle
        for deg in (90, 60, 0):                              # three angles between them
            C2 = A**2 + B**2 - 2*A*B*np.cos(np.radians(deg))  # law of cosines: C² for this angle
            print(deg, "°  ->  C =", round(float(np.sqrt(C2)), 3))   # 5.0 at 90°, 3.606 at 60°, 1.0 at 0°""")
    nb.derivation(
        "D0A-PoC1", "the recipe and the shadow are the same number", ref="0A.1",
        goal="""Show that "multiply the matching components and add" (K 2.2) and "length × length × cos θ" — the shadow
        picture — always give the same number, for any two arrows.""",
        plan=["Build a triangle out of a, b and the arrow from b's tip to a's tip.",
              "Measure that third side twice: with the law of cosines (geometry) and with Pythagoras (components).",
              "Set the two answers equal and cancel everything that matches."],
        uses=["length from components (primer above)", "law of cosines (primer above)", "the rule (x − y)² = x² − 2xy + y²"],
        start=(DOT_DEF, "the component recipe (K 2.2). We assume neither arrow is zero; if one is, θ means nothing and both sides are 0."),
        steps=[
            dict(did="Draw the third side", tex=r"\mathbf c = \mathbf a - \mathbf b",
                 why="Head-to-tail addition says b + c = a, so c = a − b closes a triangle whose other two sides we know; a triangle is what the law of cosines needs.",
                 plain="c is the arrow that runs from b's tip to a's tip."),
            dict(did="Use the law of cosines on that triangle", tex=r"|\mathbf a-\mathbf b|^2 = |\mathbf a|^2+|\mathbf b|^2-2|\mathbf a||\mathbf b|\cos\theta",
                 why="The law of cosines holds for every triangle; θ is the angle between the sides a and b, which is exactly the corner at the origin.",
                 plain="This is the geometry route to the third side: it knows the angle but not the components."),
            dict(did="Measure the same side with Pythagoras", tex=r"|\mathbf a-\mathbf b|^2=(a_1-b_1)^2+(a_2-b_2)^2+(a_3-b_3)^2",
                 why="The components of a − b are a₁ − b₁, a₂ − b₂, a₃ − b₃, and a length squared is the sum of its squared components (primer).",
                 plain="This is the component route: it knows the numbers but not the angle."),
            dict(did="Expand one bracket", tex=r"(a_1-b_1)^2=a_1^2-2a_1b_1+b_1^2",
                 why="We use the school rule (x − y)² = x² − 2xy + y² with x = a₁ and y = b₁; the other two brackets work the same way with 2 and 3.",
                 plain="Each bracket gives a square of a, a square of b, and a mixed term with a minus 2."),
            dict(did="Expand all three and regroup", tex=r"|\mathbf a-\mathbf b|^2=(a_1^2+a_2^2+a_3^2)+(b_1^2+b_2^2+b_3^2)-2(a_1b_1+a_2b_2+a_3b_3)",
                 why="Addition can be done in any order, so we collect the a-squares, the b-squares and the mixed terms into three groups.",
                 plain="Squares of a, squares of b, and all the mixed products together."),
            dict(did="Recognise the three groups", tex=r"|\mathbf a-\mathbf b|^2=|\mathbf a|^2+|\mathbf b|^2-2\,\mathbf a\cdot\mathbf b",
                 why="The first two groups are |a|² and |b|² by Pythagoras, and the last bracket is the dot product recipe (K 2.2) word for word.",
                 plain="The mixed products are the dot product — that is where the recipe sneaks in."),
            dict(did="Set the two routes equal", tex=r"|\mathbf a|^2+|\mathbf b|^2-2\,\mathbf a\cdot\mathbf b=|\mathbf a|^2+|\mathbf b|^2-2|\mathbf a||\mathbf b|\cos\theta",
                 why="Step 2 and step 6 both describe |a − b|², the length of the same side, so their right-hand sides must be equal.",
                 plain="One side of one triangle, described in two languages."),
            dict(did="Cancel the matching squares", tex=r"-2\,\mathbf a\cdot\mathbf b=-2|\mathbf a||\mathbf b|\cos\theta",
                 why="Subtracting |a|² + |b|² from both sides keeps the equation true and removes everything the two routes already agree on.",
                 plain="Only the mixed part was ever different between the two descriptions."),
            dict(did="Divide both sides by −2", tex=r"\mathbf a\cdot\mathbf b=|\mathbf a||\mathbf b|\cos\theta",
                 why="Dividing both sides by the same nonzero number (−2) keeps the equation true and leaves the dot product alone on the left.",
                 plain="The component recipe equals length × length × cos θ — that is (0A.1)."),
        ],
        result=(EQ_0A1 + r"\qquad (0A.1)", "multiply-and-add equals the shadow of a on b, times the length of b."),
        interpret="""Because |a| cos θ is a's shadow on b's line, the dot product is (shadow) × |b|. So it is **positive**
        when the arrows lean the same way (θ < 90°), **zero** when they are at right angles, and **negative** when they
        lean against each other (θ > 90°). It fails to mean anything only when an arrow has zero length (no direction).
        Watch out: θ is the angle *between* the arrows (0° to 180°), not the angle of either arrow from the east axis.""",
        check="""**Units:** a·b carries (unit of a) × (unit of b) on both sides. **Limits:** a = b gives θ = 0 and
        a·a = |a|² (Pythagoras again); i·j = 0·1 + 1·0 + 0·0 = 0 and cos 90° = 0. **Numbers:** for a = (2, 1, 0),
        b = (1, 3, 0): 2·1 + 1·3 = 5, and √5 · √10 · cos 45° = 7.071 × 0.7071 = 5 (worked below). The flattened
        triangles at θ = 0° and 180° obey the law of cosines too, so no special case is needed.""",
        check_src=r"""
        import sympy as sp                                           # symbolic algebra: checks the moves, not just the answer
        a1, a2, a3, b1, b2, b3 = sp.symbols("a1 a2 a3 b1 b2 b3", real=True)   # six components, any real numbers
        a = sp.Matrix([a1, a2, a3]); b = sp.Matrix([b1, b2, b3])     # the two arrows
        dot = (a.T * b)[0]                                            # (K 2.2): a1 b1 + a2 b2 + a3 b3
        c = a - b                                                     # step 1: the third side
        side_pyth = sp.expand((c.T * c)[0])                           # step 3 + 5: |a − b|² by Pythagoras, expanded
        step6 = (a.T * a)[0] + (b.T * b)[0] - 2 * dot                 # step 6: |a|² + |b|² − 2 a·b
        assert sp.simplify(side_pyth - step6) == 0                    # steps 3–6 are exact algebra
        cos_t = sp.symbols("cos_theta", real=True)                    # cos θ as an unknown
        la, lb = sp.sqrt((a.T * a)[0]), sp.sqrt((b.T * b)[0])         # |a| and |b|
        sol = sp.solve(sp.Eq(step6, la**2 + lb**2 - 2*la*lb*cos_t), cos_t)[0]   # steps 7–9: solve for cos θ
        assert sp.simplify(sol - dot / (la * lb)) == 0                # cos θ = a·b / (|a||b|): that is (0A.1)
        print("D0A-PoC1 checked: |a−b|² expands to |a|²+|b|²−2a·b, so a·b = |a||b|cos θ")""")

    # ---- tiny example --------------------------------------------------------------------------------------------------
    nb.worked_example("a = (2, 1, 0) and b = (1, 3, 0), then the breeze", r"""
        | Quantity | Easy | Exact | How |
        |---|---|---|---|
        | $\mathbf a\cdot\mathbf b$ | 5 | 5 | $2\cdot1 + 1\cdot3 + 0\cdot0$ — (K 2.2) |
        | $\lvert\mathbf a\rvert$ | ≈ 2.2 | 2.236 | $\sqrt{4 + 1 + 0} = \sqrt5$ |
        | $\lvert\mathbf b\rvert$ | ≈ 3.2 | 3.162 | $\sqrt{1 + 9 + 0} = \sqrt{10}$ |
        | $\cos\theta$ | ≈ 0.7 | 0.7071 | $5 / (2.236 \times 3.162)$ — (0A.1) solved for $\cos\theta$ |
        | $\theta$ | 45° | 45.0° | the angle whose cosine is 0.7071 |
        | shadow $\lvert\mathbf a\rvert\cos\theta$ | ≈ 1.6 | 1.581 | $5 / 3.162$ — (0A.3) |

        **The breeze.** A 10 m/s wind heading north-east has equal east and north parts:
        $\mathbf u = (7.07, 7.07, 0)$ m/s (each is $10\cos45°$). Measure it along north, the unit arrow
        $\mathbf j = (0, 1, 0)$: $\mathbf u\cdot\mathbf j = 7.07\cdot0 + 7.07\cdot1 + 0\cdot0 \approx 7$ | **7.07 m/s**. That's
        like a fast cycling speed: 71 % of the breeze is carrying air toward the warm side, the rest is going sideways.""")

    # ---- from scratch, then the library --------------------------------------------------------------------------------
    nb.primer("numpy arrays, element by element", r"""
        A numpy array holds a list of numbers. `a * b` multiplies **matching** entries (first with first, second with
        second…) and gives a new array; `.sum()` adds the entries up. `np.arccos` turns a cosine back into an angle in
        radians and `np.degrees` converts radians to degrees.""",
        code="""
        import numpy as np                                 # arrays
        print(np.array([2, 1, 0]) * np.array([1, 3, 0]))   # matching entries multiplied: [2 3 0]
        print(np.degrees(np.arccos(0.5)))                  # the angle whose cosine is 0.5: 60 degrees""")
    nb.scratch_vs_lib("0A.1", r'''
        # 🐍 From scratch — eq (K 2.2) and (0A.1): a·b = a1*b1 + a2*b2 + a3*b3 = |a||b| cos θ   (no fluidpy here)
        import numpy as np                              # numpy only for arrays, square root and arccos
        a = np.array([2.0, 1.0, 0.0])                   # arrow a: 2 east, 1 north, 0 up (a pure example, no unit)
        b = np.array([1.0, 3.0, 0.0])                   # arrow b: 1 east, 3 north, 0 up

        dot_loop = 0.0                                  # start an empty running total
        for i in range(3):                              # visit the east, north and up parts in turn
            dot_loop = dot_loop + a[i] * b[i]           # add one matching pair (2·1, then 1·3, then 0·0): total 2, 5, 5

        products = a * b                                # the same thing all at once: matching parts multiplied [2, 3, 0]
        dot_ab = products.sum()                         # add them up: the dot product a·b = 5 (K 2.2)
        len_a = np.sqrt((a * a).sum())                  # length |a| = sqrt(a1² + a2² + a3²) ≈ 2.236 (Pythagoras)
        len_b = np.sqrt((b * b).sum())                  # length |b| ≈ 3.162
        cos_theta = dot_ab / (len_a * len_b)            # (0A.1) solved for cos θ ≈ 0.7071
        theta_rad = np.arccos(cos_theta)                # the angle whose cosine that is [rad]
        theta_deg = np.degrees(theta_rad)               # the same angle in degrees: 45
        print(f"loop: {dot_loop:.3f} | all at once: {dot_ab:.3f} | θ = {theta_deg:.1f}°")''',
        r'''
        # 🐍 The library — the same numbers through the tested fluidpy functions
        from fluidpy.geo import vectors as V                       # Chapter 0A vector toolkit (tested in fluidpy)
        dot_lib = V.dot(a, b)                                      # a·b, (K 2.2)
        theta_lib = V.angle_between(a, b, degrees=True)            # θ in degrees, from (0A.1) together with |a×b|
        np.testing.assert_allclose([dot_loop, dot_ab, theta_deg], [dot_lib, dot_lib, theta_lib], rtol=1e-12)
        # rtol 1e-12: the same closed-form arithmetic in both, so only round-off (~1e-16) can differ. The library gets θ
        # from atan2(|a×b|, a·b), which stays accurate near 0° and 180° where arccos loses digits — at 45° both agree to
        # ~1e-15, but do NOT reuse 1e-12 for a nearly parallel pair with this scratch arccos.
        print(f"scratch and library agree: a·b = {dot_lib:.3f}, θ = {theta_lib:.1f}°")''',
        explain="""
        1. `a`, `b` — the two arrows as arrays of three components (east, north, up).
        2. The loop builds `dot_loop` one matching pair at a time — this is (K 2.2) read aloud.
        3. `products = a * b` and `dot_ab = products.sum()` do the same thing in one go (numpy primer above).
        4. `len_a`, `len_b` are the lengths by Pythagoras; `cos_theta` is (0A.1) solved for cos θ; `theta_deg` turns it into degrees.
        5. The second cell asks `fluidpy.geo.vectors` for the same numbers and `assert_allclose` stops the notebook if they differ by more than one part in 10¹².

        **What does this show?** a·b = 5 and θ = 45.0° from both routes — the numbers of the tiny example.""")
    nb.ledger[-1]["kind"] = "scratch + library + assert (rtol 1e-12)"
    show_eq(nb, "0A.1", EQ_0A1 + r" \quad\text{with}\quad " + DOT_DEF)
    nb.ledger.insert(len(nb.ledger) - 1, {"eq": "K 2.2", "tag": "eq:0A.1", "status": "coded", "core": nb.current_core,
                                          "kind": "scratch + library + assert — shares the (0A.1) cells"})

    nb.scratch_vs_lib("0A.3", r'''
        # 🐍 From scratch — eq (0A.3): a's shadow on b, as a length and as an arrow   (no fluidpy here)
        shadow_len = dot_ab / len_b                     # shadow length |a| cos θ = a·b / |b| = 5 / 3.162 ≈ 1.581
        scale = dot_ab / (len_b * len_b)                # how many b's fit in the shadow: a·b / |b|² = 5 / 10 = 0.5
        shadow_vec = scale * b                          # the shadow as an arrow along b: 0.5 × (1, 3, 0) = (0.5, 1.5, 0)
        leftover = a - shadow_vec                       # what is left of a after removing its shadow: (1.5, −0.5, 0)
        check_perp = (leftover * b).sum()               # the leftover is at right angles to b, so this dot product is 0
        print(f"shadow = {shadow_len:.3f}, shadow arrow = {shadow_vec}, leftover·b = {check_perp:.1e}")''',
        r'''
        # 🐍 The library — scalar and vector projection
        shadow_len_lib = V.scalar_projection(a, b)                 # a·b / |b|
        shadow_vec_lib = V.projection(a, b)                        # (a·b / |b|²) b
        np.testing.assert_allclose(shadow_len, shadow_len_lib, rtol=1e-12)    # same formula → round-off only
        np.testing.assert_allclose(shadow_vec, shadow_vec_lib, rtol=1e-12, atol=1e-15)   # atol: the up part is exactly 0
        np.testing.assert_allclose(check_perp, 0.0, atol=1e-12)    # true value 0 → an absolute tolerance, not a relative one
        print("scratch and library agree:", round(shadow_len_lib, 3), shadow_vec_lib)''',
        explain=r"""
        1. `shadow_len` is (0A.3) as a length; `scale` is how many copies of b fit along the shadow.
        2. `shadow_vec` turns the shadow into an arrow lying along b — the end point $(0.5,\ 1.5)$ in the figure above.
        3. `leftover = a − shadow_vec` is the dashed light ray of the figure; its dot product with b is zero (at right angles).
        4. The library cell repeats both with `V.scalar_projection` and `V.projection` and asserts agreement.""")
    nb.ledger[-1]["kind"] = "scratch + library + assert (rtol 1e-12; atol for exact zeros)"
    show_eq(nb, "0A.3", EQ_0A3)

    # ---- explainer (show_viz("ch00", ...): the explainer lives in viz/ch00/, shared by the three Chapter-0 parts) ----------
    nb.md("""
        #### 🎮 Interactive: drag the arrows and watch the shadow

        The explainer below puts both arrows in 3-D. The thick teal stripe is the shadow, and the bar beside the origin
        *is* a·b (teal above zero, rose below). The second product, the cross product, is in the same explainer and gets
        its own block next.

        **What to try:**
        - Drag b until the bar hits exactly 0 — read θ. (Predict first: what angle will it be?)
        - Press ▶ and watch the bar rise and fall like a cosine while b swings round.
        - Pick the *anti-parallel* preset: why is a·b negative, and where does the shadow point?""")
    nb.code('show_viz("ch00", "vector_products_lab")   # full-width explainer; ⤢ Full screen for more room',
            tags=["explainer"])
    nb.explainers.append("vector_products_lab")       # nbkit.explainer() would write show_viz("ch00a", …); the file is viz/ch00/

    # ---- analogy, confusion --------------------------------------------------------------------------------------------
    nb.like_unlike(
        like="""a shadow on the floor under a lamp: tilt a stick away from the floor line and its shadow shrinks;
        stand it straight up and the shadow is a dot.""",
        unlike="""a real shadow, the dot product can be **negative** (the "shadow" lands behind the start, when the arrows
        lean against each other), and it is the shadow **times |b|** — a shadow alone is only |a| cos θ. If b is not
        a length-one arrow, the dot product is not a shadow length; divide by |b| first (0A.3).""")
    nb.md(r"""
        > ⚠️ **Common confusion:** a·b is a **number**, not an arrow. So $(\mathbf a\cdot\mathbf b)\,\mathbf c$ is an arrow
        > (the arrow $\mathbf c$ stretched by a number), but $\mathbf a\cdot(\mathbf b\cdot\mathbf c)$ does not make sense —
        > $\mathbf b\cdot\mathbf c$ is already a plain number and you cannot "dot" an arrow with a number.""")

    # ---- where Vallis uses it ------------------------------------------------------------------------------------------
    nb.primer("temperature gradient ∇T", r"""
        At every point, the **temperature gradient** $\nabla T = (\partial T/\partial x,\ \partial T/\partial y,\ \partial T/\partial z)$
        is an arrow that points toward warmer air, uphill on the temperature map, and whose length says how many kelvin you
        gain per metre. If it gets 1 K warmer for every 100 km you walk north, $\nabla T = (0,\ 10^{-5},\ 0)$ K/m. Lines of
        equal temperature on a map (**isotherms**) run at right angles to $\nabla T$. (The symbol $\partial T/\partial y$
        means "how fast T changes as you move north, holding everything else fixed"; Chapter 0A teaches it fully in its
        partial-derivative and gradient blocks.)""",
        code="""
        dT = 1.0                     # it gets 1 K warmer ...
        dy = 100e3                   # ... over 100 km northward [m]
        print(dT / dy, "K/m")        # the north part of ∇T: 1e-05 K/m""")
    nb.md(rf"""
        #### Where Vallis uses it: the wind carrying temperature

        Back to the breeze and the warm town. In Vallis's very first chapter, the rate at which a moving bit of air (a
        **fluid parcel**) sees a property $\varphi$ change — temperature, say — is the **material derivative**:

        $$ {V17} \qquad \text{{(1.7)}} $$

        Here $\boldsymbol v = (u, v, w)$ is the wind (bold italic in Vallis; for a flat wind $w = 0$ it is just the
        horizontal wind $\mathbf u$), $\partial\varphi/\partial t$ is the change you would measure standing still, and the
        last term is our dot product: the **wind dotted with the temperature gradient**, $\mathbf u\cdot\nabla T$. Read
        with (0A.1), that is (wind speed) × (how steep the temperature slope is) × cos(angle between them). This is
        **advection**: temperature being *carried* by the wind.

        If a parcel neither heats nor cools on its way ($DT/Dt = 0$), (1.7) says that at a fixed spot
        $\partial T/\partial t = -\mathbf u\cdot\nabla T$. A wind blowing **up** the temperature slope (from the cold side toward
        the warm side, $\mathbf u\cdot\nabla T > 0$) keeps bringing in colder air, so the spot **cools**.

        A number. Wind 10 m/s, at 60° to a northward temperature gradient of 1 K per 100 km:
        $\mathbf u\cdot\nabla T = 10 \times 10^{{-5}} \times \cos 60° = 5\times10^{{-5}}$ K/s. A day has 86 400 s, so
        that is ≈ **4 | 4.32 K per day** of cooling at a fixed spot (computed below). That's like going from a mild day to a
        noticeably cooler one overnight — tiny per second, but it keeps going as long as the wind does. Wind blowing **along** the isotherms ($\theta = 90°$) gives zero: no
        advection, however strong the wind.""")
    nb.scratch_vs_lib("1.7-adv", r'''
        # 🐍 From scratch — the advection term u·∇T in eq (1.7), with Earth numbers   (no fluidpy here)
        speed = 10.0                                    # wind speed |u| [m/s]
        angle = np.radians(60.0)                        # angle between the wind and ∇T (which points north) [rad]
        u_east = speed * np.sin(angle)                  # east part of the wind: 10 sin 60° ≈ 8.660 m/s
        u_north = speed * np.cos(angle)                 # north part of the wind: 10 cos 60° = 5.000 m/s
        u = np.array([u_east, u_north, 0.0])            # the wind arrow [m/s] (flat: no up part)
        gradT = np.array([0.0, 1.0 / 100e3, 0.0])       # ∇T: 1 K warmer per 100 km northward [K/m]
        adv = (u * gradT).sum()                         # u·∇T: multiply matching parts and add [K/s]
        adv_day = adv * 86400.0                         # the same per day (86 400 s in a day) [K/day]
        dTdt_here = -adv_day                            # (1.7) with DT/Dt = 0: change at a fixed spot [K/day]
        print(f"u·∇T = {adv:.3e} K/s = {adv_day:.3f} K/day → the fixed spot changes by {dTdt_here:+.3f} K/day")''',
        r'''
        # 🐍 The library — the same dot product
        adv_lib = V.dot(u, gradT)                                  # u·∇T [K/s]
        np.testing.assert_allclose(adv, adv_lib, rtol=1e-12)       # same multiply-and-add → round-off only
        print(f"scratch and library agree: {adv_lib:.3e} K/s")''',
        explain=r"""
        1. `u_east`, `u_north` split the 10 m/s wind into parts (a wind at 60° from north leans toward the east).
        2. `gradT` is the temperature-slope arrow from the primer; `adv` is the dot product (K 2.2) — the same recipe as before, now with units: (m/s) × (K/m) = K/s.
        3. `adv_day` converts to kelvin per day; `dTdt_here` puts in the minus sign: with $DT/Dt = 0$, (1.7) $\frac{DT}{Dt} = \frac{\partial T}{\partial t} + (\boldsymbol v\cdot\nabla)T$ gives $\partial T/\partial t = -\mathbf u\cdot\nabla T$.

        **What does this show?** 5.000 × 10⁻⁵ K/s, or 4.320 K per day of cooling at a spot downwind of the cold side.""")
    nb.ledger[-1]["kind"] = "B note: scratch + library + assert (rtol 1e-12)"
    show_eq(nb, "1.7-adv", r"\mathbf u\cdot\nabla T,\ \text{the last term of}\ " + V17 + r"\ \text{(1.7) with}\ \varphi = T")

    nb.md(rf"""
        **Two more places it hides.** Kundu's Appendix B writes the divergence of a wind as a dot product with the
        $\nabla$ arrow, $\nabla\cdot\mathbf u = \partial u/\partial x + \partial v/\partial y + \partial w/\partial z$
        (App. B §B.3, unnumbered) — multiply-and-add again, with "multiply" replaced by "take the slope of". And the cross
        product, next block, gives Vallis's Coriolis term $\boldsymbol f\times\boldsymbol u$ in

        $$ {V255} \qquad \text{{(2.55)}} $$

        with $\boldsymbol f = f\mathbf k = 2\Omega\sin\vartheta\,\mathbf k$ (Vallis writes the bold **f** for $f\mathbf k$;
        in Chapter 0 we write $f\,\mathbf k\times\mathbf u$). A dot product shows why that term never speeds the wind up:
        $\mathbf u\cdot(\mathbf k\times\mathbf u) = 0$, because the turned wind is at right angles to the wind.

        **Where next.** Chapter 0A §0.4 (the cross product, (K 2.20)–(K 2.21) and the area (0A.2)); Vallis §1.1 for (1.7);
        Kundu ch02 §2.8 ([notebook]({K21})).""")

    # ---- symbols, words, ledger ----------------------------------------------------------------------------------------
    nb.md("#### 📇 Symbols in this block\n\n" + symbols_table(
        ["x, y, z", r"\mathbf i, \mathbf j, \mathbf k", r"\mathbf u", r"\nabla", "T", r"\frac{D}{Dt}", r"\vartheta", r"\theta"],
        [(r"\mathbf a, \mathbf b", "two generic arrows (vectors)", "any (the unit of what they describe)",
          "Arrows given by components (east, north, up)."),
         (r"\lvert\mathbf a\rvert", "length (magnitude) of a", "unit of a", "√(a₁² + a₂² + a₃²), Pythagoras."),
         (r"\theta\ \text{(0A)}", "angle between two arrows", "rad (shown in °)", "0° same direction, 90° at right angles, 180° opposite."),
         (r"\mathbf a\cdot\mathbf b", "dot product", "unit of a × unit of b", "a₁b₁ + a₂b₂ + a₃b₃ = |a||b| cos θ: shadow × length.")])
        + f"\n\nFull entries (say-it, typical Earth values, Kundu names): [📇 symbol atlas]({ATLAS}).")
    nb.md(glossary_box(["Potential temperature"], {
        "Wind direction (south-westerly)": "forecasters name a wind after where it comes FROM; a south-westerly blows toward the north-east.",
        "Fluid parcel": "a small blob of air or water followed as it moves, small enough to have one temperature and one velocity.",
        "Advection": "a property (temperature, salt, moisture) being carried along by the wind or a current; in equations, u·∇T.",
        "Isotherm": "a line on a map joining places with the same temperature; ∇T is at right angles to it.",
        "Dot product / scalar projection": "multiply matching components and add / the signed length of one arrow's shadow along another.",
    }))
    nb.equation_ledger()
    nb.cells[-1].source = ledger_md(nb)

    nb.summary(
        clicked=["**a·b multiplies matching components and adds them** — (K 2.2) — and that equals |a||b| cos θ (0A.1): "
                 "a's shadow on b, times |b|. Zero means at right angles, negative means 'leaning against'. You can prove it "
                 "with one triangle measured two ways (D0A-PoC1)."],
        feeds_forward=[r"Vallis (1.7), $\frac{D\varphi}{Dt} = \frac{\partial\varphi}{\partial t} + (\boldsymbol v\cdot\nabla)\varphi$: the advection term $\mathbf u\cdot\nabla T$ is a dot product — wind along the temperature slope warms or cools a spot; wind along the isotherms does nothing.",
                       r"Chapter 0A §0.4: the cross product and $f\,\mathbf k\times\mathbf u$, the Coriolis term of Vallis (2.55), $\frac{D\boldsymbol u}{Dt} + \boldsymbol f\times\boldsymbol u = -\frac{1}{\rho}\nabla_z p$.",
                       "Chapter 0A ∇ blocks: divergence ∇·u is a dot product with the ∇ arrow."],
        left_out=["The cross product (Chapter 0A §0.4, PoC block C0A-PoC2 in the same explainer).",
                  "Dot products of tensors and the summation convention in general (Kundu ch02 §2.1, C01 — linked above)."])
    return nb


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="Build notebooks/poc_ch00a_dot.ipynb (PoC G).")
    ap.add_argument("--dump", action="store_true", help="print the cell outline and write nothing")
    args = ap.parse_args(argv)
    nb = build()
    if args.dump:
        for i, c in enumerate(nb.cells):
            print(f"{i:02d} {c.cell_type:8s} {','.join(c.metadata.get('tags', []))[:28]:28s} {c.source.splitlines()[0][:80] if c.source else ''}")
        return 0
    dest = nb.save()
    print(f"wrote {dest.relative_to(ROOT).as_posix()} ({len(nb.cells)} cells)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
