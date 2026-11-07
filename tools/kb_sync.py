"""Mirror the project's knowledge (rules, plans, memory, agents, skills, how-tos, session transcripts) to G: and Drive.

The user asked (2026-11-07) that nothing is lost when a conversation is compacted: every rule, plan, style guide,
mixing rule, agent and skill definition, how-to playbook and the full session transcripts must also live on G:
(and the key text on Google Drive), so a later session can rebuild the full context from there.

Layout on G: (``KB``)::

    context_kb/README.md        start here after a compaction (how to resume, where everything is)
    context_kb/STATE.md         live state: what is running, what is next (kept current by the orchestrator)
    context_kb/CHANGELOG.md     dated one-line log of every major change (``--log "text"``)
    context_kb/howto/           playbooks: how each kind of movie, chart, map, mix, render, QA, upload was done
    context_kb/mirror/          copy of the repo's text knowledge (CLAUDE.md, PLANNING, HOUSE_STYLE, knowledge/,
                                .claude/agents, .claude/skills, movies plans/scripts/storyboards/logs, reports, registry)
    context_kb/memory/          copy of the auto-memory folder
    context_kb/user_skills/     copy of ~/.claude/skills (video-review_2 …)
    context_kb/transcripts/     every session transcript (*.jsonl, incl. subagent transcripts), copied incrementally

Drive (``--drive``): ``aofd knowledge base/`` gets README.md, STATE.md, CHANGELOG.md and ``aofd_kb_text.zip``
(howto + mirror + memory + user_skills; no transcripts, no book text), replaced in place on every sync.

Never copied: book PDFs, chapters/, _private/, credentials, audio, video, node_modules, virtual envs.

Usage::

    .venv/Scripts/python.exe tools/kb_sync.py                 # mirror to G: (fast, incremental)
    .venv/Scripts/python.exe tools/kb_sync.py --drive         # + upload the text bundle to Drive
    .venv/Scripts/python.exe tools/kb_sync.py --log "5a fb1 rendered, QA 15/15"   # append to CHANGELOG, then mirror
"""
from __future__ import annotations

import argparse
import datetime as dt
import os
import shutil
import subprocess
import sys
import zipfile
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
HOME = Path(os.environ.get("USERPROFILE", str(Path.home())))
PROJ = HOME / ".claude" / "projects" / "C--Users-sislam27-Work-Climate-Dynamics-PHD-AOFD-Vallis"
MEMORY = PROJ / "memory"
USER_SKILLS = HOME / ".claude" / "skills"
G_ROOT = Path("G:/Geophysical Fluid Dynamics/aofd-data")
KB = G_ROOT / "context_kb"
RCLONE = G_ROOT / "tools" / "rclone" / "rclone.exe"
DRIVE_FOLDER = "gdrive:aofd knowledge base"

TEXT_EXT = {".md", ".yaml", ".yml", ".json", ".py", ".sh", ".txt", ".toml", ".mjs", ".ts", ".tsx", ".jsx", ".js"}
MAX_BYTES = 3_000_000
# repo paths mirrored (globs relative to the repo); code is included only where it documents a pipeline
REPO_GLOBS = [
    "CLAUDE.md", "PLANNING.md", "GUIDE.md", "WORKFLOW_GUIDE.md", "RESUME.md", "README.md", "progress.json",
    "book.yaml", "data/registry.yaml",
    ".claude/settings.json", ".claude/agents/*.md", ".claude/skills/**/*",
    "knowledge/*",
    "movies/HOUSE_STYLE.md", "movies/README*.md",
    "movies/ch00/*.md", "movies/ch00/*.py", "movies/ch00/coordinates_series/*",
    "movies/ch00/*/*.md", "movies/ch00/*/*.yaml", "movies/ch00/*/manifest.json",
    "movies/src/*/checks/*.py", "movies/src/*/checks/*.sh", "movies/src/*/checks/*.md",
    "movies/data/*.py",
    "reports/*.md", "reports/data/*.md",
    "tools/*.py", "tools/sound/*.py", "tools/sound/*.md", "tools/maptools/*.md", "tools/maptools/*.py",
    "tools/hooks/*.py", "tools/movie_wb/*.py",
    "outputs/drive_links.md", "outputs/reviews_done.md",
]
SKIP_PARTS = {"node_modules", ".venv", ".venv-tts", ".venv-maps", "__pycache__", "chapters", "_private", ".git"}


def _secretish(p: Path) -> bool:
    n = p.name.lower()
    return any(k in n for k in ("credential", "secret", "token", ".netrc", "cdsapirc", "rclone.conf", ".env"))


def _copy_if_newer(src: Path, dst: Path) -> bool:
    """Copy src to dst when dst is missing or older/different in size. Returns True if copied."""
    try:
        s = src.stat()
    except OSError:
        return False
    if dst.exists():
        d = dst.stat()
        if d.st_size == s.st_size and d.st_mtime >= s.st_mtime - 1:
            return False
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dst)
    return True


def mirror_repo() -> int:
    n = 0
    seen: set[Path] = set()
    for pat in REPO_GLOBS:
        for src in REPO.glob(pat):
            if src in seen or not src.is_file() or SKIP_PARTS & set(src.relative_to(REPO).parts):
                continue
            seen.add(src)
            if src.suffix.lower() not in TEXT_EXT or src.stat().st_size > MAX_BYTES or _secretish(src):
                continue
            n += _copy_if_newer(src, KB / "mirror" / src.relative_to(REPO))
    return n


def mirror_tree(root: Path, dest: Path, exts: set[str] | None = None) -> int:
    n = 0
    if not root.exists():
        return 0
    for src in root.rglob("*"):
        if not src.is_file() or _secretish(src) or SKIP_PARTS & set(src.parts):
            continue
        if exts and src.suffix.lower() not in exts:
            continue
        n += _copy_if_newer(src, dest / src.relative_to(root))
    return n


def mirror_transcripts() -> int:
    """Every *.jsonl under the project folder (main sessions + subagent transcripts)."""
    n = 0
    for src in PROJ.rglob("*.jsonl"):
        if "memory" in src.relative_to(PROJ).parts:
            continue
        n += _copy_if_newer(src, KB / "transcripts" / src.relative_to(PROJ))
    return n


def log(text: str) -> None:
    KB.mkdir(parents=True, exist_ok=True)
    f = KB / "CHANGELOG.md"
    if not f.exists():
        f.write_text("# Knowledge-base change log (newest last)\n\n", encoding="utf-8")
    stamp = dt.datetime.now().strftime("%Y-%m-%d %H:%M")
    with f.open("a", encoding="utf-8") as fh:
        fh.write(f"- {stamp} — {text}\n")


def bundle() -> Path:
    out = KB / "aofd_kb_text.zip"
    tmp = out.with_suffix(".tmp")
    with zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as z:
        for name in ("README.md", "STATE.md", "CHANGELOG.md"):
            if (KB / name).exists():
                z.write(KB / name, name)
        for sub in ("howto", "mirror", "memory", "user_skills"):
            for f in (KB / sub).rglob("*"):
                if f.is_file():
                    z.write(f, str(f.relative_to(KB)))
    tmp.replace(out)
    return out


def drive_upload() -> None:
    if not RCLONE.exists():
        print("rclone missing: Drive step skipped")
        return
    files = [KB / n for n in ("README.md", "STATE.md", "CHANGELOG.md")] + [bundle()]
    for f in files:
        if f.exists():
            r = subprocess.run([str(RCLONE), "copyto", str(f), f"{DRIVE_FOLDER}/{f.name}"],
                               capture_output=True, text=True)
            print(("drive ok: " if r.returncode == 0 else "drive FAIL: ") + f.name + ("" if r.returncode == 0 else r.stderr[-300:]))


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--drive", action="store_true", help="also upload README/STATE/CHANGELOG + text bundle to Drive")
    ap.add_argument("--log", help="append a dated line to CHANGELOG.md first")
    ap.add_argument("--no-transcripts", action="store_true")
    a = ap.parse_args()
    if not G_ROOT.exists():
        sys.exit("G: data root missing: knowledge base not mirrored (never fall back to C:)")
    if a.log:
        log(a.log)
    counts = {
        "repo": mirror_repo(),
        "memory": mirror_tree(MEMORY, KB / "memory"),
        "user_skills": mirror_tree(USER_SKILLS, KB / "user_skills", TEXT_EXT),
        "transcripts": 0 if a.no_transcripts else mirror_transcripts(),
    }
    print("kb_sync -> " + str(KB) + ": copied " + ", ".join(f"{k} {v}" for k, v in counts.items()))
    if a.drive:
        drive_upload()


if __name__ == "__main__":
    main()
