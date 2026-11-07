"""Flag narration wording the user banned (movies/HOUSE_STYLE.md §3, user 2026-11-06/07).

Checks the spoken lines of movie scripts (lines starting with '>' or '#' and the README are notes, not speech):
"the easy way", spoken numbered steps ("Step one", "step 2"), "assume nothing", "never mix the two centres",
maker credits ("by the author"), "made easy", "how meteorology uses", the robotic hook formula
("why it's built this way"), voiced simple arithmetic and voiced sign rules.

Usage: .venv/Scripts/python.exe tools/script_wording_lint.py movies/ch00/<slug>/script.md [...]
Exit code 1 if anything is found.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

BANNED = [
    (re.compile(r"\bthe easy way\b", re.I), "no 'the easy way' in the opening"),
    (re.compile(r"\bstep (one|two|three|four|five|six|seven|eight|nine|ten|\d+)\b(?!\s+over)", re.I),
     "no spoken numbered steps; let them flow (First… Now… So…)"),
    (re.compile(r"\bassume nothing\b", re.I), "private reassurance"),
    (re.compile(r"\bnever mix the two cent", re.I), "private reassurance"),
    (re.compile(r"\bby the author\b", re.I), "no maker credit"),
    (re.compile(r"\bmade easy\b", re.I), "no 'made easy' anywhere, voice or title (user 2026-11-06)"),
]

# House rule (user 2026-11-07): simple arithmetic stays on screen but is NOT voiced. The voice says what is combined
# and where each number comes from, then the result ("adding the two parts gives 10 and 0"), never "3.6 plus 6.4 is 10".
_W = (r"(?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|"
      r"seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|point)")
_NUM = rf"(?:minus\s+)?(?:\d[\d.,]*|{_W}(?:[\s-]+(?:and\s+)?{_W})*)"
_OP = r"(?:plus|minus|times|multiplied\s+by|divided\s+by)"
_RES = r"(?:,?\s*(?:equals|is|are|gives|makes|comes\s+to|that's|which\s+is|about|roughly|so|=))"
BANNED += [
    (re.compile(r"\bhow meteorology uses\b", re.I),
     "say 'see how they're used to …', not 'how meteorology uses them' (user 2026-11-07)"),
    (re.compile(r"\bwhy (it's|it is|they're|they are) built (this|the) way\b", re.I),
     "robotic hook formula; use an easy-going lead-in naming this movie's pieces ('Now let's dive into …') (user 2026-11-07)"),
    (re.compile(rf"\b{_NUM}\s+{_OP}\s+{_NUM}{_RES}", re.I),
     "voiced arithmetic: show it on screen, say what is combined + the result (house rule 2026-11-07)"),
    (re.compile(rf"\b{_NUM}\s+squared(\s+(is|equals|gives)|,?\s+(plus|and)\s+{_NUM}\s+squared)", re.I),
     "voiced squares: say 'we square each component, add them and take the square root' + the result (house rule 2026-11-07)"),
    (re.compile(rf"\bsquare root of\s+{_NUM}{_RES}", re.I),
     "voiced square root of a plain number: show it, say the result (house rule 2026-11-07)"),
    (re.compile(r"\bminus times (a )?minus\b|\bnegative times (a )?negative\b", re.I),
     "voiced sign rule: leave it on screen (house rule 2026-11-07)"),
]


def spoken_lines(path: Path) -> list[tuple[int, str]]:
    """Return (line number, text) for narration lines: after the README, not notes or headings."""
    out, in_readme = [], False
    for i, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        s = line.strip()
        if s.startswith("### README"):
            in_readme = True
            continue
        if s.startswith("## ") or s.startswith("# "):
            in_readme = False
            continue
        if in_readme or not s or s.startswith((">", "#", "|", "-", "*")):
            continue
        out.append((i, s))
    return out


def lint(path: Path) -> list[str]:
    """List every banned phrase in the spoken lines of one script."""
    hits = []
    for n, s in spoken_lines(path):
        for rx, why in BANNED:
            for m in rx.finditer(s):
                hits.append(f"{path}:{n}: '{m.group(0)}' — {why}")
    return hits


if __name__ == "__main__":
    allhits = [h for p in sys.argv[1:] for h in lint(Path(p))]
    print("\n".join(allhits) if allhits else "script_wording_lint: 0 findings")
    sys.exit(1 if allhits else 0)
