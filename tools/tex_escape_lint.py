r"""Find non-raw JS template literals in movie scene code that contain a TeX backslash command.

In a plain template literal JS drops the backslash of an unknown escape (`\circ` -> `circ`), so KaTeX prints "circ"
instead of a degree sign (Part 2 fix2, s14 "26.5ᶜirc", 2026-11-08). TeX inside a template literal must use String.raw.

A small scanner follows nesting (template literal -> ${ code -> nested template literal ...), so a plain literal inside a
String.raw one is checked on its own. Line comments, block comments and ordinary strings are skipped.

Usage: .venv/Scripts/python.exe tools/tex_escape_lint.py [root ...]   (default movies/src); exit 1 if any finding.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

# a single backslash followed by a letter that is not a valid JS escape (n r t u x b f v are JS escapes)
BAD = re.compile(r"\\(?![nrtuxbfv])[A-Za-z]")


def literals(s: str) -> list[tuple[int, bool, str]]:
    """Return (start offset, is_raw, text outside ${...}) for every template literal in JS/TS source s."""
    out: list[tuple[int, bool, str]] = []
    i, n = 0, len(s)
    stack: list[str] = []          # 'code' frames for ${ ... } (brace depth tracked per frame)
    depth: list[int] = []

    def code(i: int, top: bool) -> int:
        """Scan code from i; return the index after the closing } of a ${ frame (top=False) or len(s)."""
        d = 0
        while i < n:
            c = s[i]
            if c == "/" and s.startswith("//", i):
                j = s.find("\n", i); i = n if j < 0 else j; continue
            if c == "/" and s.startswith("/*", i):
                j = s.find("*/", i + 2); i = n if j < 0 else j + 2; continue
            if c in "'\"":
                j = i + 1
                while j < n and s[j] != c and s[j] != "\n":
                    j += 2 if s[j] == "\\" else 1
                i = j + 1; continue
            if c == "`":
                i = tpl(i); continue
            if c == "{":
                d += 1
            elif c == "}":
                if d == 0 and not top:
                    return i + 1
                d -= 1
            i += 1
        return i

    def tpl(i: int) -> int:
        raw = s[max(0, i - 10):i].endswith("String.raw")
        start, j, text = i, i + 1, []
        while j < n:
            c = s[j]
            if c == "\\":
                text.append(s[j:j + 2]); j += 2; continue
            if c == "`":
                out.append((start, raw, "".join(text)))
                return j + 1
            if c == "$" and s.startswith("${", j):
                j = code(j + 2, False); continue
            text.append(c); j += 1
        out.append((start, raw, "".join(text)))
        return j

    code(0, True)
    return out


def scan(root: Path) -> list[str]:
    files = [root] if root.is_file() else sorted(root.rglob("*.tsx")) + sorted(root.rglob("*.ts"))
    hits: list[str] = []
    for p in files:
        s = p.read_text(encoding="utf-8", errors="ignore")
        for start, raw, text in literals(s):
            if not raw and BAD.search(text.replace("\\\\", "")):
                ln = s.count("\n", 0, start) + 1
                hits.append(f"{p}:{ln}: `{text[:80]}`")
    return hits


def main() -> int:
    roots = [Path(a) for a in sys.argv[1:]] or [Path("movies/src")]
    hits = [h for r in roots for h in scan(r)]
    print(f"tex_escape_lint: {len(hits)} finding(s)")
    for h in hits:
        print(h)
    return 1 if hits else 0


if __name__ == "__main__":
    sys.exit(main())
