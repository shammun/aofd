"""Stage a QA-passed movie in the media repo (draft), or promote an approved draft (R1 §5.4, PLANNING §6.3).

The media repo is ``../AOFD Media`` (``shammun/aofd-media``, GitHub Pages). This tool only copies files and prints the
git commands; it never commits or pushes (the orchestrator does that, and never force-pushes).

Usage::

    .venv/Scripts/python.exe tools/publish_movie.py --draft ch02 coriolis --from <render folder>
        # <render folder> holds 1080.mp4 (or <slug>.mp4), poster.jpg, captions.vtt (→ en.vtt), captions.srt (→ en.srt),
        # transcript.md (or script.md), manifest.json; requires reports/movies/<chNN_slug>/qa.json with "pass": true
    .venv/Scripts/python.exe tools/publish_movie.py --approve ch02 coriolis
        # moves drafts/chNN/<slug>/ → chNN/<slug>/ in the media repo, copies poster.jpg + en.vtt into this repo
        # (movies/site/chNN/<slug>/), and prints the <video> embed block for the chapter page
    .venv/Scripts/python.exe tools/publish_movie.py --status        # media repo size and its movies

Budgets: ≤ 25 MB per movie (refuse above the hard cap of 40 MB); warn when the media repo working tree passes 800 MB
(start ``aofd-media2``).
"""
from __future__ import annotations

import argparse
import json
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MEDIA = (ROOT.parent / "AOFD Media").resolve()
BUDGET_MB, HARD_MB, REPO_WARN_MB = 25.0, 40.0, 800.0
MEDIA_URL = "https://shammun.github.io/aofd-media"

SOURCES = {  # published name -> candidate names in the render folder
    "1080.mp4": ["1080.mp4", "{slug}.mp4", "movie.mp4"],
    "poster.jpg": ["poster.jpg", "poster.png"],
    "en.vtt": ["en.vtt", "captions.vtt"],
    "en.srt": ["en.srt", "captions.srt"],
    "transcript.md": ["transcript.md", "script.md"],
    "manifest.json": ["manifest.json"],
}


def dir_mb(p: Path) -> float:
    return sum(f.stat().st_size for f in p.rglob("*") if f.is_file() and ".git" not in f.parts) / 1e6


def need_media() -> None:
    if not (MEDIA / ".git").exists():
        sys.exit(f"media repo not found at {MEDIA}. The user creates it once (WORKFLOW_GUIDE §2.7):\n"
                 "  ! gh repo create shammun/aofd-media --public --description \"Movies for shammun.github.io/aofd\"\n"
                 f"  then clone it to \"{MEDIA}\".")


def draft(ch: str, slug: str, src: Path) -> int:
    need_media()
    qa = ROOT / "reports" / "movies" / f"{ch}_{slug}" / "qa.json"
    if not qa.exists() or not json.loads(qa.read_text(encoding="utf-8")).get("pass"):
        sys.exit(f"refused: {qa.relative_to(ROOT)} missing or not pass (run tools/movie_qa.py first)")
    dest = MEDIA / "drafts" / ch / slug
    dest.mkdir(parents=True, exist_ok=True)
    copied = []
    for out, cands in SOURCES.items():
        hit = next((src / c.format(slug=slug) for c in cands if (src / c.format(slug=slug)).exists()), None)
        if hit is None:
            if out in ("1080.mp4", "en.vtt", "poster.jpg"):
                sys.exit(f"refused: {src} has none of {cands}")
            continue
        if out == "1080.mp4":
            mb = hit.stat().st_size / 1e6
            if mb > HARD_MB:
                sys.exit(f"refused: {hit.name} is {mb:.1f} MB > hard cap {HARD_MB:g} MB")
            if mb > BUDGET_MB:
                print(f"warning: {mb:.1f} MB > budget {BUDGET_MB:g} MB")
        shutil.copy2(hit, dest / out)
        copied.append(out)
    total = dir_mb(MEDIA)
    print(f"draft staged: {dest} ({', '.join(copied)}); media repo {total:.0f} MB")
    if total > REPO_WARN_MB:
        print(f"warning: media repo > {REPO_WARN_MB:g} MB — start aofd-media2")
    print("orchestrator (not this tool) then runs:")
    print(f'  git -C "{MEDIA}" add "drafts/{ch}/{slug}"')
    print(f'  git -C "{MEDIA}" commit -m "{ch}: movie {slug} (draft) — {dir_mb(dest):.1f} MB"')
    print(f'  git -C "{MEDIA}" push            # never --force')
    print(f"tell the user to watch: {MEDIA_URL}/drafts/{ch}/{slug}/1080.mp4")
    return 0


def approve(ch: str, slug: str) -> int:
    need_media()
    src = MEDIA / "drafts" / ch / slug
    if not (src / "1080.mp4").exists():
        sys.exit(f"no draft at {src}")
    dest = MEDIA / ch / slug
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists():
        shutil.rmtree(dest)
    shutil.move(str(src), str(dest))
    site = ROOT / "movies" / "site" / ch / slug
    site.mkdir(parents=True, exist_ok=True)
    for f in ("poster.jpg", "en.vtt"):
        if (dest / f).exists():
            shutil.copy2(dest / f, site / f)
    base = f"{MEDIA_URL}/{ch}/{slug}"
    transcript = (dest / "transcript.md").read_text(encoding="utf-8") if (dest / "transcript.md").exists() else ""
    print(f"approved: {dest}; poster + captions copied to {site.relative_to(ROOT).as_posix()}")
    print("embed block for the chapter page (no autoplay; captions on by default; transcript below):")
    print(f'<figure class="aofd-movie">\n  <video controls preload="metadata" playsinline poster="{base}/poster.jpg" '
          f'width="1920" height="1080" style="width:100%;height:auto">\n'
          f'    <source src="{base}/1080.mp4" type="video/mp4">\n'
          f'    <track kind="captions" srclang="en" label="English" src="{base}/en.vtt" default>\n  </video>\n'
          f'  <details><summary>Transcript</summary>\n\n{transcript.strip()}\n\n  </details>\n'
          f'  <p><a href="{base}/1080.mp4" download>Download MP4</a> · <a href="{base}/en.srt">SRT captions</a></p>\n'
          "</figure>")
    print("orchestrator then commits both repos (media: git mv drafts → chNN; site: poster/VTT + page) and pushes.")
    return 0


def status() -> int:
    if not (MEDIA / ".git").exists():
        print(f"media repo not created yet ({MEDIA})")
        return 0
    movies = sorted(p.parent.relative_to(MEDIA).as_posix() for p in MEDIA.rglob("1080.mp4"))
    print(f"media repo {MEDIA}: {dir_mb(MEDIA):.0f} MB, {len(movies)} movie(s)")
    for m in movies:
        print("  ", m, f"{(MEDIA / m / '1080.mp4').stat().st_size / 1e6:.1f} MB")
    return 0


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--draft", nargs=2, metavar=("CH", "SLUG"))
    g.add_argument("--approve", nargs=2, metavar=("CH", "SLUG"))
    g.add_argument("--status", action="store_true")
    ap.add_argument("--from", dest="src", help="render folder (with --draft)")
    a = ap.parse_args()
    if a.draft:
        if not a.src:
            ap.error("--draft needs --from <render folder>")
        return draft(a.draft[0], a.draft[1], Path(a.src))
    if a.approve:
        return approve(*a.approve)
    return status()


if __name__ == "__main__":
    sys.exit(main())
