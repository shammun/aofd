"""Claude Code PreToolUse hook for Bash/PowerShell commands (PLANNING §7.2). stdin = the tool-call JSON.

Exit 2 = block (the reason goes to stderr, which Claude sees). Exit 0 = allow. Rules:

* ``git add`` of ``_private/``, ``*.pdf``, ``chapters/`` (except the page map), ``outputs/``, ``data/raw`` or credential
  files; ``git add -A`` / ``git add .`` / ``git add --all`` inside the fluidpy repo (``../Fluid Dynamics``) — there it
  must name library paths only (``fluidpy/ tests/ pyproject.toml CHANGELOG.md``);
* ``git push`` with ``--force``, ``-f``, ``--force-with-lease`` or a ``+refspec``;
* ``git push`` in this repo whose ``origin`` is not ``shammun/aofd``; before any push here, ``check_secrets.py --push``,
  ``check_public.py`` and ``size_budget.py`` (when present) must pass;
* ``git push`` in the fluidpy repo with staged changes outside library paths;
* ``git commit`` in ``../Fluid Dynamics`` that would commit Kundu-site paths (``notebooks/ viz/ knowledge/ analysis/
  reports/ index.html book.yaml .claude/``) — the Kundu site is read-only from this session;
* a warning (not a block) on raw ``curl``/``wget``/``Invoke-WebRequest`` downloads of data files: data goes through
  ``fluidpy.data.fetch()`` and the disk guard.
"""
from __future__ import annotations

import json
import re
import shlex
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
FLUIDPY = (ROOT.parent / "Fluid Dynamics").resolve()
PY = ROOT / ".venv" / "Scripts" / "python.exe"
LIB_PATHS = ("fluidpy/", "tests/", "pyproject.toml", "CHANGELOG.md")
KUNDU_SITE = ("notebooks/", "viz/", "knowledge/", "analysis/", "reports/", "index.html", "book.yaml", ".claude/",
              "templates/", "assets/")
FORBIDDEN_ADD = re.compile(r"(^|[\s/\"'])(_private/|chapters/(?!_page_map\.json)|outputs/|data/raw|[^\s\"']*\.pdf\b|"
                           r"\.cdsapirc|_?netrc\b|\.env\b)", re.I)
DATA_EXT = re.compile(r"\.(nc|nc4|grib2?|zarr|h5|hdf5?|tif|tiff|zip|gz|tar)(\b|$)", re.I)


def block(msg: str) -> None:
    print(f"guard_bash: BLOCKED — {msg}", file=sys.stderr)
    sys.exit(2)


def git(args: list[str], cwd: Path) -> str:
    try:
        return subprocess.run(["git", *args], cwd=cwd, capture_output=True, text=True, timeout=30).stdout
    except Exception:
        return ""


def repo_of(cmd: str, cwd: Path) -> Path:
    """Which repo a git command acts on: ``git -C <dir>``, a leading ``cd <dir> &&``, or the cwd."""
    m = re.search(r"git\s+-C\s+(\"[^\"]+\"|'[^']+'|\S+)", cmd)
    if m:
        d = m.group(1).strip("\"'")
        return (cwd / d).resolve() if not Path(d).is_absolute() else Path(d).resolve()
    m = re.match(r"\s*cd\s+(\"[^\"]+\"|'[^']+'|\S+)\s*(&&|;)", cmd)
    if m:
        d = m.group(1).strip("\"'").replace("/c/", "C:/", 1) if m.group(1).strip("\"'").startswith("/c/") \
            else m.group(1).strip("\"'")
        p = Path(d)
        return (cwd / p).resolve() if not p.is_absolute() else p.resolve()
    return cwd.resolve()


def in_fluidpy(p: Path) -> bool:
    try:
        p.relative_to(FLUIDPY)
        return True
    except ValueError:
        return False


def segments(cmd: str) -> list[str]:
    return [s.strip() for s in re.split(r"&&|\|\||;|\n", cmd) if s.strip()]


def check_add(seg: str, repo: Path) -> None:
    args = seg.split(None, 2)[2] if len(seg.split()) > 2 else ""
    if FORBIDDEN_ADD.search(" " + args):
        block(f"`{seg}` would stage private or book-derived files (_private, chapters, outputs, data/raw, *.pdf, "
              "credentials). Stage explicit public paths instead.")
    if in_fluidpy(repo):
        toks = [t.strip("\"'") for t in shlex.split(args, posix=True)] if args else []
        if any(t in ("-A", "--all", ".", "-u", "--update") for t in toks):
            block("`git add -A`/`.` inside ../Fluid Dynamics: name library paths only "
                  "(fluidpy/ tests/ pyproject.toml CHANGELOG.md).")
        paths = [t for t in toks if not t.startswith("-")]
        bad = [t for t in paths if not t.replace("\\", "/").startswith(LIB_PATHS)]
        if bad:
            block(f"in ../Fluid Dynamics only library paths may be staged; refused: {bad}")


def check_push(seg: str, repo: Path) -> None:
    toks = seg.split()
    if any(t in ("--force", "-f", "--force-with-lease") or t.startswith("--force") for t in toks) or \
            any(t.startswith("+") for t in toks[2:]):
        block("force-push is never allowed (PLANNING §6.4).")
    if in_fluidpy(repo):
        staged = [ln for ln in git(["diff", "--cached", "--name-only"], repo).splitlines() if ln]
        bad = [p for p in staged if not p.startswith(LIB_PATHS)]
        if bad:
            block(f"fluidpy push with staged non-library paths: {bad[:5]}")
        return
    try:
        repo.relative_to(ROOT)
    except ValueError:
        return                                  # another repo (e.g. AOFD Media): its own hooks apply
    origin = git(["remote", "get-url", "origin"], ROOT).strip()
    if origin and not re.search(r"github\.com[/:]shammun/aofd(\.git)?$", origin):
        block(f"origin is {origin!r}, not shammun/aofd.")
    for tool, args in (("check_secrets.py", ["--push"]), ("check_public.py", []), ("size_budget.py", [])):
        t = ROOT / "tools" / tool
        if not t.exists():
            continue
        r = subprocess.run([str(PY), str(t), *args], cwd=ROOT, capture_output=True, text=True)
        if r.returncode != 0:
            block(f"{tool} failed before push:\n{(r.stdout + r.stderr)[-1500:]}")


def check_commit(seg: str, repo: Path) -> None:
    if not in_fluidpy(repo):
        return
    staged = [ln for ln in git(["diff", "--cached", "--name-only"], repo).splitlines() if ln]
    if " -a" in f" {seg} " or "--all" in seg:
        staged += [ln for ln in git(["diff", "--name-only"], repo).splitlines() if ln]
    bad = [p for p in staged if p.startswith(KUNDU_SITE)]
    if bad:
        block(f"commit in ../Fluid Dynamics touches the Kundu site (read-only from this session): {bad[:5]}")


def main() -> int:
    try:
        data = json.load(sys.stdin)
    except Exception:
        return 0
    cmd = (data.get("tool_input") or {}).get("command") or ""
    cwd = Path(data.get("cwd") or ROOT)
    if not cmd:
        return 0
    for seg in segments(cmd):
        repo = repo_of(cmd, cwd)
        s = re.sub(r"^git\s+-C\s+(\"[^\"]+\"|'[^']+'|\S+)\s+", "git ", seg)
        if re.match(r"git\s+add\b", s):
            check_add(s, repo)
        elif re.match(r"git\s+push\b", s):
            check_push(s, repo)
        elif re.match(r"git\s+commit\b", s):
            check_commit(s, repo)
        if re.match(r"(curl|wget|Invoke-WebRequest|iwr)\b", s) and DATA_EXT.search(s):
            print("guard_bash: warning — data downloads go through fluidpy.data.fetch() and tools/disk_guard.py "
                  "(PLANNING §15.2), not raw curl/wget.", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
