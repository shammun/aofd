"""Claude Code PostToolUse hook for Write/Edit/MultiEdit (PLANNING §7.2). stdin = the tool-call JSON. Never blocks.

* ``viz/**/*.html`` and ``scenes/**/*.html`` → ``tools/viz_lint.py --quick <file>``;
* ``*.py`` under ``fluidpy/geo|data|diag`` (in ``../Fluid Dynamics``) → pyflakes + the docstring contract (public
  functions cite a Vallis § and equation, give units, and carry a validation label);
* ``movies/**/storyboard.yaml`` and ``data/registry.yaml`` → parses the YAML and checks the required keys.

Findings are printed to stderr with exit code 2 so Claude sees them (for PostToolUse that is feedback, not a block);
a clean file exits 0 silently.
"""
from __future__ import annotations

import ast
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
FLUIDPY = (ROOT.parent / "Fluid Dynamics").resolve()
PY = ROOT / ".venv" / "Scripts" / "python.exe"

STORYBOARD_KEYS = {"id", "title", "concepts", "target_duration_s", "fps", "size", "scenes"}
SCENE_KEYS = {"id", "t", "visual", "voiceover", "physics_source"}
REGISTRY_KEYS = {"url", "licence", "citation", "redistributable"}


def rel(p: Path, base: Path) -> str | None:
    try:
        return p.relative_to(base).as_posix()
    except ValueError:
        return None


def lint_viz(p: Path) -> str:
    tool = ROOT / "tools" / "viz_lint.py"
    if not tool.exists():
        return ""
    r = subprocess.run([str(PY), str(tool), "--quick", str(p)], cwd=ROOT, capture_output=True, text=True)
    return (r.stdout + r.stderr).strip() if r.returncode else ""


def docstring_contract(p: Path) -> list[str]:
    """Public functions in fluidpy/geo|data|diag: docstring with a § or 'Vallis', units (SI or brackets) and a
    validation label (V1-V7 or 'validated'/'Validation')."""
    out = []
    try:
        tree = ast.parse(p.read_text(encoding="utf-8"))
    except SyntaxError as e:
        return [f"syntax error: {e}"]
    for node in tree.body:
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and not node.name.startswith("_"):
            doc = ast.get_docstring(node) or ""
            miss = []
            if not re.search(r"§|Vallis|Kundu|\(\d+\.\d+\)", doc):
                miss.append("book § / equation")
            if not re.search(r"\[[^\]]*\]|SI|m s|s⁻¹|s\^-1|kg|K\b|Pa|dimensionless", doc):
                miss.append("units")
            if not re.search(r"\bV[1-7]\b|[Vv]alidat", doc):
                miss.append("validation label")
            if miss:
                out.append(f"{node.name}(): docstring lacks {', '.join(miss)}")
    return out


def pyflakes(p: Path) -> str:
    r = subprocess.run([str(PY), "-m", "pyflakes", str(p)], capture_output=True, text=True)
    return (r.stdout + r.stderr).strip()


def yaml_check(p: Path, kind: str) -> list[str]:
    import yaml

    try:
        d = yaml.safe_load(p.read_text(encoding="utf-8"))
    except Exception as e:
        return [f"YAML does not parse: {e}"]
    out = []
    if kind == "storyboard":
        miss = STORYBOARD_KEYS - set(d or {})
        if miss:
            out.append(f"storyboard missing keys {sorted(miss)}")
        for i, sc in enumerate((d or {}).get("scenes") or []):
            m = SCENE_KEYS - set(sc)
            if m:
                out.append(f"scene {i} ({sc.get('id', '?')}) missing {sorted(m)}")
            eq = sc.get("on_screen_eq")
            if eq and not (isinstance(eq, dict) and eq.get("latex") and eq.get("vallis_eq") is not None):
                out.append(f"scene {sc.get('id', i)}: on_screen_eq needs latex + vallis_eq")
    else:
        for key, ent in ((d or {}).get("datasets") or {}).items():
            m = REGISTRY_KEYS - set(ent or {})
            if m:
                out.append(f"registry {key}: missing {sorted(m)}")
    return out


def main() -> int:
    try:
        data = json.load(sys.stdin)
    except Exception:
        return 0
    ti = data.get("tool_input") or {}
    fp = ti.get("file_path") or ""
    if not fp:
        return 0
    p = Path(fp)
    if not p.is_absolute():
        p = Path(data.get("cwd") or ROOT) / p
    p = p.resolve()
    findings: list[str] = []
    r = rel(p, ROOT)
    if r and p.suffix == ".html" and (r.startswith("viz/") or r.startswith("scenes/")):
        out = lint_viz(p)
        if out:
            findings.append(out)
    elif r and r.startswith("movies/") and p.name == "storyboard.yaml":
        findings += yaml_check(p, "storyboard")
    elif r == "data/registry.yaml":
        findings += yaml_check(p, "registry")
    rf = rel(p, FLUIDPY)
    if rf and p.suffix == ".py" and re.match(r"fluidpy/(geo|data|diag)/", rf):
        out = pyflakes(p)
        if out:
            findings.append(out)
        findings += docstring_contract(p)
    if findings:
        print(f"post_write ({p.name}):\n" + "\n".join(f"  - {f}" for f in findings), file=sys.stderr)
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main())
