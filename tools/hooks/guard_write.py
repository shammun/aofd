"""Claude Code PreToolUse hook for Write/Edit/MultiEdit/NotebookEdit (PLANNING §7.2). stdin = the tool-call JSON.

Exit 2 = block (reason on stderr). Blocks:

* writes to any ``*.pdf``;
* writes into the Kundu site in ``../Fluid Dynamics`` (``notebooks/ viz/ knowledge/ analysis/ reports/ .claude/
  templates/ assets/``, ``index.html``, ``book.yaml``) — only ``fluidpy/``, ``tests/``, ``pyproject.toml`` and
  ``CHANGELOG.md`` may change there (the ``tools/`` folder too, for ``release_check.py``);
* writes under ``_private/`` except ``_private/compare/`` (private side-by-sides);
* a Write of more than 10 MB into this repo outside ``data/derived/``;
* credentials written into the repo (``.cdsapirc``, ``netrc``, ``.env``).
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
FLUIDPY = (ROOT.parent / "Fluid Dynamics").resolve()
FLUIDPY_OK = ("fluidpy/", "tests/", "pyproject.toml", "CHANGELOG.md", "tools/release_check.py")
MAX_BYTES = 10 * 1024 * 1024


def block(msg: str) -> None:
    print(f"guard_write: BLOCKED — {msg}", file=sys.stderr)
    sys.exit(2)


def rel(p: Path, base: Path) -> str | None:
    try:
        return p.relative_to(base).as_posix()
    except ValueError:
        return None


def main() -> int:
    try:
        data = json.load(sys.stdin)
    except Exception:
        return 0
    ti = data.get("tool_input") or {}
    fp = ti.get("file_path") or ti.get("notebook_path") or ""
    if not fp:
        return 0
    p = Path(fp)
    if not p.is_absolute():
        p = Path(data.get("cwd") or ROOT) / p
    p = p.resolve()
    if p.suffix.lower() == ".pdf":
        block(f"{p.name}: PDFs are read-only.")
    r = rel(p, FLUIDPY)
    if r is not None and not r.startswith(FLUIDPY_OK):
        block(f"../Fluid Dynamics/{r}: the Kundu site is read-only from the AOFD session; only fluidpy/, tests/, "
              "pyproject.toml, CHANGELOG.md (and tools/release_check.py) may change.")
    r = rel(p, ROOT)
    if r is None:
        return 0
    if r.startswith("_private/") and not r.startswith("_private/compare/"):
        block(f"{r}: _private/ is read-only except _private/compare/.")
    name = p.name.lower()
    if name in (".cdsapirc", "_netrc", ".netrc", ".env") or name.startswith(".env."):
        block(f"{r}: credentials never go into the repo (they live in %USERPROFILE% and the Credential Manager).")
    content = ti.get("content")
    if isinstance(content, str) and len(content.encode("utf-8", "ignore")) > MAX_BYTES and \
            not r.startswith("data/derived/"):
        block(f"{r}: {len(content) / 1e6:.1f} MB file outside data/derived/ (limit 10 MB).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
