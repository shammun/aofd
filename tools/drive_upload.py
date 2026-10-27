"""Upload a finished movie (or any review file) to the user's Google Drive and print a private link to watch it on a phone.

The user asked for this on 2026-10-27 ("upload a finished video to Google Drive … so that even using mobile, I can
check all the different videos"). Uploads go through rclone (G:/Geophysical Fluid Dynamics/aofd-data/tools/rclone/,
v1.75.2, checksum checked) with a remote called ``gdrive`` that the user configured once with the ``drive.file`` scope,
so rclone can only see files it uploaded itself. The OAuth token lives in rclone's own config under %APPDATA%, never
in this repo.

Files stay PRIVATE: the link printed is the normal Drive "view" link, which only the owner (and anyone they share it
with by hand) can open. This tool never creates an "anyone with the link" share; that would publish an unapproved movie.

Usage::

    .venv/Scripts/python.exe tools/drive_upload.py movies/out/ch00/ch00_cross_product_why/preview_v4.mp4 \
        --folder "aofd movies/ch00_cross_product_why" [--name v4.mp4]
    .venv/Scripts/python.exe tools/drive_upload.py --check          # is the remote configured and reachable?
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

RCLONE = Path("G:/Geophysical Fluid Dynamics/aofd-data/tools/rclone/rclone.exe")
REMOTE = "gdrive"
ROOT = "aofd movies"


def rclone(*args: str, capture: bool = True) -> str:
    """Run rclone with the given arguments and return stdout (raises on failure)."""
    if not RCLONE.exists():
        sys.exit(f"rclone not found at {RCLONE}")
    r = subprocess.run([str(RCLONE), *args], capture_output=capture, text=True)
    if r.returncode != 0:
        sys.exit(f"rclone {' '.join(args[:2])} failed:\n{r.stderr if capture else ''}")
    return r.stdout if capture else ""


def check() -> None:
    """Confirm the gdrive remote exists and answers."""
    remotes = rclone("listremotes").split()
    if f"{REMOTE}:" not in remotes:
        sys.exit(f"no '{REMOTE}:' remote yet: the user runs the one-time `rclone config` step")
    rclone("lsd", f"{REMOTE}:", "--max-depth", "1")
    print(f"OK: {REMOTE}: is configured and reachable")


def upload(src: Path, folder: str, name: str | None) -> None:
    """Copy one file to gdrive:<folder>/<name> (resumable, with progress) and print its private view link."""
    if not src.is_file():
        sys.exit(f"not a file: {src}")
    dest = f"{REMOTE}:{folder}/{name or src.name}"
    print(f"uploading {src} ({src.stat().st_size / 1e6:.1f} MB) -> {dest}")
    rclone("copyto", str(src), dest, "--drive-chunk-size", "64M", "--progress", capture=False)
    info = json.loads(rclone("lsjson", "--stat", dest))
    print(f"done: {dest}")
    print(f"private link (opens for the Drive owner): https://drive.google.com/file/d/{info['ID']}/view")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("src", nargs="?", type=Path)
    ap.add_argument("--folder", default=ROOT, help=f"Drive folder (default '{ROOT}')")
    ap.add_argument("--name", help="file name on Drive (default: the local name)")
    ap.add_argument("--check", action="store_true", help="only check the remote")
    a = ap.parse_args()
    if a.check or a.src is None:
        check()
        return
    upload(a.src, a.folder, a.name)


if __name__ == "__main__":
    main()
