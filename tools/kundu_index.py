"""Build ``knowledge/kundu_index.yaml``: a machine-readable map of the finished Kundu site (the fluidpy repo).

The crossref-linker, concept-analyst and notebook-builder use it to write K-recap blocks with exact deep links
(PLANNING §8.1, skill ``cross-book-continuity``). It is read-only with respect to ``../Fluid Dynamics``.

For every Kundu chapter it records:

* ``notebook``: the published page URL; ``sections``: each numbered ``<h2 id>`` anchor (``13.5-Geostrophic-Flow``) with
  its full URL; ``cores``: each 🧩 CORE block's ``<h3 id>`` anchor with its CORE id and the equation labels it shows;
* ``derivations``: every ``### Dnn · …`` storyboard in ``analysis/chNN_design.md`` Part F (title, stars, step count,
  where it is taught);
* ``explainers``: every ``viz/chNN/*.html`` with its ``viz:*`` metas (title, sections, equations, fluidpy functions,
  derivations) and URL;
* ``concepts``: the rows of ``knowledge/concept_map.md`` for that chapter (concept, § / eq, fluidpy target, tier,
  where taught);
plus ``functions``: the public function names of every ``fluidpy.core`` and chapter module.

Usage::

    .venv/Scripts/python.exe tools/kundu_index.py            # writes knowledge/kundu_index.yaml
    .venv/Scripts/python.exe tools/kundu_index.py --check    # exit 1 if any explainer or section anchor is missing
"""
from __future__ import annotations

import argparse
import ast
import html
import re
import subprocess
import sys
import urllib.parse
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
KUNDU = (ROOT.parent / "Fluid Dynamics").resolve()
OUT = ROOT / "knowledge" / "kundu_index.yaml"


def site_url() -> str:
    b = yaml.safe_load((KUNDU / "book.yaml").read_text(encoding="utf-8"))
    return b["project"]["site_url"].rstrip("/")


def anchors(page: Path) -> tuple[list[dict], list[dict]]:
    """Numbered section anchors (h2) and CORE anchors (h3 starting with 🧩) of a published notebook page."""
    text = page.read_text(encoding="utf-8", errors="replace")
    sections, cores = [], []
    for lvl, aid in re.findall(r'<h([23])\s+id="([^"]+)"', text):
        dec = urllib.parse.unquote(html.unescape(aid))
        if lvl == "2":
            m = re.match(r"^(\d+\.\d+)-(.*)$", dec)
            if m:
                sections.append({"n": m.group(1), "title": m.group(2).replace("-", " "), "anchor": aid})
        elif dec.startswith("🧩"):
            cid = re.search(r"-(C\d{2})$", dec)
            eqs = re.findall(r"\((\d+\.\d+)\)", dec)
            title = re.sub(r"^🧩-", "", dec)
            title = re.sub(r"-C\d{2}$", "", title).replace("-", " ")
            cores.append({"id": cid.group(1) if cid else None, "equations": sorted(set(eqs), key=_eqkey),
                          "title": title[:160], "anchor": aid})
    return sections, cores


def _eqkey(e: str) -> tuple[int, int]:
    a, b = e.split(".")
    return int(a), int(b)


def derivations(design: Path) -> list[dict]:
    if not design.exists():
        return []
    out = []
    for line in design.read_text(encoding="utf-8", errors="replace").splitlines():
        m = re.match(r"^###\s+(D\d{2})\s*·\s*(.*)$", line)
        if not m:
            continue
        rest = m.group(2)
        steps = re.search(r"(\d+)\s+steps?", rest)
        stars = re.search(r"(★+)", rest)
        where = re.search(r"in\s+(C\d{2})[^()]*(?:\(([^)]*)\))?", rest)
        out.append({"id": m.group(1), "title": re.split(r"\s+—\s+★", rest)[0][:160],
                    "stars": len(stars.group(1)) if stars else None, "steps": int(steps.group(1)) if steps else None,
                    "core": where.group(1) if where else None,
                    "taught": where.group(2) if where and where.group(2) else None})
    return out


def explainer_meta(page: Path) -> dict:
    text = page.read_text(encoding="utf-8", errors="replace")[:20000]
    meta = {k: html.unescape(v) for k, v in re.findall(r'<meta name="viz:([a-z0-9]+)" content="([^"]*)"', text)}
    split = lambda k: meta.get(k, "").split() if meta.get(k) else []      # noqa: E731
    return {"slug": meta.get("slug", page.stem), "title": meta.get("title", ""), "order": meta.get("order"),
            "sections": split("sections"), "equations": split("equations"), "fluidpy": split("fluidpy"),
            "derivations": split("derivations"), "concept": meta.get("concept", "")[:240],
            "three_d": "THREE" in page.read_text(encoding="utf-8", errors="replace") and "Viz.three(" in text}


def concept_rows(cmap: Path) -> dict[str, list[dict]]:
    """Rows of the concept map grouped by chapter (the '**chNN — …**' separator rows)."""
    rows: dict[str, list[dict]] = {}
    cur = None
    for line in cmap.read_text(encoding="utf-8", errors="replace").splitlines():
        if not line.startswith("|"):
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        m = re.match(r"\*\*(ch\d{2})\b", cells[0])
        if m:
            cur = m.group(1)
            continue
        if cur is None or len(cells) < 6 or set(cells[0]) <= set("-: "):
            continue
        rows.setdefault(cur, []).append({"concept": cells[0][:200], "book": cells[1], "fluidpy": cells[2][:300],
                                         "label": cells[3], "tier": cells[4], "taught": cells[5]})
    return rows


def public_functions(py: Path) -> list[str]:
    try:
        tree = ast.parse(py.read_text(encoding="utf-8", errors="replace"))
    except SyntaxError:
        return []
    return sorted(n.name for n in tree.body if isinstance(n, (ast.FunctionDef, ast.ClassDef)) and not n.name.startswith("_"))


def build() -> dict:
    base = site_url()
    book = yaml.safe_load((KUNDU / "book.yaml").read_text(encoding="utf-8"))
    commit = subprocess.run(["git", "rev-parse", "--short", "HEAD"], cwd=KUNDU, capture_output=True,
                            text=True).stdout.strip()
    cmap = concept_rows(KUNDU / "knowledge" / "concept_map.md")
    chapters = []
    for c in book["chapters"]:
        cid, slug = c["id"], c["slug"]
        page = KUNDU / "notebooks" / f"{cid}_{slug}.html"
        nb_url = f"{base}/notebooks/{cid}_{slug}.html"
        secs, cores = anchors(page) if page.exists() else ([], [])
        for s in secs:
            s["url"] = f"{nb_url}#{s['anchor']}"
        for k in cores:
            k["url"] = f"{nb_url}#{k['anchor']}"
        exps = []
        for v in sorted((KUNDU / "viz" / cid).glob("*.html")):
            m = explainer_meta(v)
            m["url"] = f"{base}/viz/{cid}/{v.name}"
            exps.append(m)
        chapters.append({"id": cid, "number": c["number"], "title": c["title"], "slug": slug,
                         "notebook": nb_url if page.exists() else None, "sections": secs, "cores": cores,
                         "derivations": derivations(KUNDU / "analysis" / f"{cid}_design.md"),
                         "explainers": exps, "concepts": cmap.get(cid, [])})
    functions = {}
    for py in sorted((KUNDU / "fluidpy").rglob("*.py")):
        rel = py.relative_to(KUNDU).with_suffix("").as_posix().replace("/", ".")
        if rel.endswith("__init__") or "/_" in py.as_posix().replace(str(KUNDU), ""):
            continue
        names = public_functions(py)
        if names:
            functions[rel] = names
    return {"generated_by": "tools/kundu_index.py", "source_repo": "shammun/fluidpy", "source_commit": commit,
            "site": base, "book": "Kundu, Cohen & Dowling, Fluid Mechanics, 5th ed. (2012)",
            "counts": {"chapters": len(chapters), "sections": sum(len(c["sections"]) for c in chapters),
                       "cores": sum(len(c["cores"]) for c in chapters),
                       "derivations": sum(len(c["derivations"]) for c in chapters),
                       "explainers": sum(len(c["explainers"]) for c in chapters),
                       "concept_rows": sum(len(c["concepts"]) for c in chapters),
                       "modules": len(functions), "functions": sum(len(v) for v in functions.values())},
            "chapters": chapters, "functions": functions}


def check(idx: dict) -> list[str]:
    problems = []
    n_viz = len(list((KUNDU / "viz").glob("ch*/*.html")))
    if idx["counts"]["explainers"] != n_viz:
        problems.append(f"explainers indexed {idx['counts']['explainers']} != files {n_viz}")
    for c in idx["chapters"]:
        if not c["notebook"]:
            problems.append(f"{c['id']}: no published notebook page")
        if not c["sections"]:
            problems.append(f"{c['id']}: no numbered section anchors found")
        for e in c["explainers"]:
            if not e["title"]:
                problems.append(f"{c['id']}/{e['slug']}: no viz:title meta")
    return problems


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--check", action="store_true")
    a = ap.parse_args()
    idx = build()
    problems = check(idx)
    if not a.check:
        OUT.parent.mkdir(exist_ok=True)
        OUT.write_text("# GENERATED by tools/kundu_index.py from ../Fluid Dynamics — do not edit by hand.\n"
                       + yaml.safe_dump(idx, sort_keys=False, allow_unicode=True, width=160), encoding="utf-8")
        print(f"wrote {OUT.relative_to(ROOT).as_posix()} ({OUT.stat().st_size / 1e3:.0f} kB)")
    print("counts:", idx["counts"])
    for p in problems:
        print("  PROBLEM:", p)
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
