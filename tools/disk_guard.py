"""Disk guard for downloads, renders and installs (PLANNING §15.2, superseded in location and limits by §15.4).

Rules (from ``book.yaml -> data.guard``):

* **G:** (the data root, ``G:/Geophysical Fluid Dynamics/aofd-data``) keeps a floor of **50 GB free**, and everything
  the project keeps under the data root stays below a cap of **150 GB**.
* **C:** (environments, Node/Remotion, Playwright, the repo) keeps a floor of **40 GB free**.
* If the data root's drive is missing (unplugged external drive), the guard **stops** with a clear message. It never
  falls back to C:.
* If a new download does not fit, it may evict least-recently-used **raw** files that the registry tracks, that can be
  downloaded again and whose derived product already exists. Nothing else is ever deleted. Every eviction is logged in
  ``<root>/logs/evictions.log``. (Eviction needs ``data/registry.yaml``; until a raw file is registered it is never
  evictable.)
* Every check is logged in ``<root>/logs/disk_guard.log`` and reports free space on both drives.

Python use (``fluidpy.data.fetch`` calls this before every download)::

    from tools.disk_guard import check, report        # or: import disk_guard after sys.path insert
    ok = check(need_bytes=150e6, what="ARCO-ERA5 z500 2015-02-09T12")   # raises DiskGuardError if it cannot fit

Command line::

    .venv/Scripts/python.exe tools/disk_guard.py                    # one-line report: C:, G:, cache size
    .venv/Scripts/python.exe tools/disk_guard.py --need 2.5GB --what "ECCO UVELMASS 1992-2017"
    .venv/Scripts/python.exe tools/disk_guard.py --json

Exit code 0 = fits (or report only), 3 = would cross a floor/cap, 4 = data drive missing.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GB = 1024 ** 3

DEFAULTS = {"root": "G:/Geophysical Fluid Dynamics/aofd-data", "root_env": "AOFD_DATA_ROOT",
            "guard": {"G": {"floor_gb": 50, "project_cap_gb": 150}, "C": {"floor_gb": 40}}}


class DiskGuardError(RuntimeError):
    """Raised when a download/render would cross a floor or cap, or the data drive is missing."""


def _config() -> dict:
    cfg = dict(DEFAULTS)
    try:
        import yaml

        book = yaml.safe_load((ROOT / "book.yaml").read_text(encoding="utf-8"))
        cfg.update(book.get("data", {}) or {})
    except Exception:          # book.yaml missing (e.g. a Colab clone of fluidpy only): keep defaults
        pass
    return cfg


def data_root() -> Path:
    """The data root: env ``AOFD_DATA_ROOT`` overrides ``book.yaml -> data.root``; on Colab ``/content/aofd-data``."""
    cfg = _config()
    env = os.environ.get(cfg.get("root_env", "AOFD_DATA_ROOT"))
    if env:
        return Path(env)
    if "google.colab" in sys.modules or os.environ.get("COLAB_RELEASE_TAG"):
        return Path(cfg.get("colab_root", "/content/aofd-data"))
    return Path(cfg["root"])


def _drive_of(p: Path) -> str:
    return (p.drive or p.anchor or "/").rstrip("\\/") or "/"


def _free(path: Path) -> int:
    return shutil.disk_usage(path).free


def dir_size(p: Path) -> int:
    """Total bytes under ``p`` (0 if missing)."""
    if not p.exists():
        return 0
    total = 0
    for dirpath, _dirs, files in os.walk(p):
        for f in files:
            try:
                total += os.path.getsize(os.path.join(dirpath, f))
            except OSError:
                pass
    return total


def status() -> dict:
    """Free space on C: and the data drive, the project's data size, and the limits."""
    cfg, root = _config(), data_root()
    g = cfg["guard"]
    out = {"time": dt.datetime.now().isoformat(timespec="seconds"), "data_root": str(root),
           "data_drive": _drive_of(root), "data_drive_present": root.anchor == "" or Path(root.anchor).exists()}
    c_anchor = Path(os.environ.get("SystemDrive", "C:") + "\\") if os.name == "nt" else Path("/")
    out["C_free_gb"] = round(_free(c_anchor) / GB, 1)
    out["C_floor_gb"] = g["C"]["floor_gb"]
    if out["data_drive_present"]:
        out["data_free_gb"] = round(_free(Path(root.anchor) if root.anchor else root) / GB, 1)
        out["data_used_gb"] = round(dir_size(root) / GB, 2)
        out["raw_gb"] = round(dir_size(root / "raw") / GB, 2)
        out["cache_gb"] = round(dir_size(root / "cache") / GB, 2)
        out["scratch_gb"] = round(dir_size(root / "scratch") / GB, 2)
    out["data_floor_gb"] = g["G"]["floor_gb"]
    out["project_cap_gb"] = g["G"]["project_cap_gb"]
    return out


def report(s: dict | None = None) -> str:
    s = s or status()
    if not s["data_drive_present"]:
        return f"C: {s['C_free_gb']} GB free | data drive {s['data_drive']} MISSING ({s['data_root']})"
    return (f"C: {s['C_free_gb']} GB free (floor {s['C_floor_gb']}) | {s['data_drive']} {s['data_free_gb']} GB free "
            f"(floor {s['data_floor_gb']}) | project data {s['data_used_gb']} GB of {s['project_cap_gb']} "
            f"(raw {s['raw_gb']}, cache {s['cache_gb']}, scratch {s['scratch_gb']})")


def _log(root: Path, name: str, line: str) -> None:
    try:
        (root / "logs").mkdir(parents=True, exist_ok=True)
        with open(root / "logs" / name, "a", encoding="utf-8") as f:
            f.write(line.rstrip() + "\n")
    except OSError:
        pass


def check(need_bytes: float = 0.0, what: str = "", on: str = "data") -> dict:
    """Check that ``need_bytes`` more on the data drive (``on='data'``) or on C: (``on='C'``) stays within the rules.

    Returns the status dict (with ``need_gb``); raises :class:`DiskGuardError` if the data drive is missing or a
    floor/cap would be crossed. Eviction is not attempted here; the caller (``fluidpy.data.fetch``) may call
    :func:`evict` and retry.
    """
    s = status()
    root = data_root()
    need_gb = need_bytes / GB
    s["need_gb"] = round(need_gb, 3)
    s["what"] = what
    if on == "data":
        if not s["data_drive_present"]:
            raise DiskGuardError(f"data drive {s['data_drive']} not found ({s['data_root']}). Connect the drive and "
                                 "rerun; the project never falls back to C:.")
        if s["data_free_gb"] - need_gb < s["data_floor_gb"]:
            msg = (f"{what or 'request'} needs {need_gb:.2f} GB; {s['data_drive']} would drop below its "
                   f"{s['data_floor_gb']} GB floor ({s['data_free_gb']} GB free)")
            _log(root, "disk_guard.log", f"{s['time']} REFUSED {msg}")
            raise DiskGuardError(msg)
        if s["data_used_gb"] + need_gb > s["project_cap_gb"]:
            msg = (f"{what or 'request'} needs {need_gb:.2f} GB; project data would exceed its "
                   f"{s['project_cap_gb']} GB cap ({s['data_used_gb']} GB used)")
            _log(root, "disk_guard.log", f"{s['time']} REFUSED {msg}")
            raise DiskGuardError(msg)
    else:
        if s["C_free_gb"] - need_gb < s["C_floor_gb"]:
            msg = (f"{what or 'request'} needs {need_gb:.2f} GB on C:; C: would drop below its {s['C_floor_gb']} GB "
                   f"floor ({s['C_free_gb']} GB free)")
            if s["data_drive_present"]:
                _log(root, "disk_guard.log", f"{s['time']} REFUSED {msg}")
            raise DiskGuardError(msg)
    if s["data_drive_present"]:
        _log(root, "disk_guard.log", f"{s['time']} OK need={need_gb:.3f}GB on={on} what={what!r} | {report(s)}")
    return s


def evict(need_bytes: float, registry: dict | None = None, dry_run: bool = False) -> list[dict]:
    """Free space by evicting LRU raw files that are registered, re-downloadable and already reduced.

    ``registry`` maps raw relative paths (under ``<root>/raw``) to entries with ``redownloadable: true`` and
    ``derived: <path>``; only files whose derived product exists are candidates. Returns the evicted entries.
    """
    root = data_root()
    registry = registry or {}
    cands = []
    for rel, ent in registry.items():
        p = root / "raw" / rel
        der = ent.get("derived")
        if p.is_file() and ent.get("redownloadable") and der and (root / der).exists():
            cands.append((p.stat().st_atime, p, rel))
    freed, out = 0, []
    for _atime, p, rel in sorted(cands):
        if freed >= need_bytes:
            break
        size = p.stat().st_size
        if not dry_run:
            p.unlink()
            _log(root, "evictions.log", f"{dt.datetime.now().isoformat(timespec='seconds')} evicted raw/{rel} "
                                        f"{size / 1e6:.1f} MB")
        freed += size
        out.append({"path": f"raw/{rel}", "mb": round(size / 1e6, 1)})
    return out


def _parse_size(s: str) -> float:
    s = s.strip().upper().replace(" ", "")
    for unit, mult in (("TB", 1024 ** 4), ("GB", GB), ("MB", 1024 ** 2), ("KB", 1024), ("B", 1)):
        if s.endswith(unit):
            return float(s[: -len(unit)]) * mult
    return float(s)


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--need", default=None, help="size to check, e.g. 150MB or 2.5GB")
    ap.add_argument("--what", default="")
    ap.add_argument("--on", choices=["data", "C"], default="data")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--report", action="store_true", help="one-line report (the default when --need is absent)")
    a = ap.parse_args()
    try:
        s = check(_parse_size(a.need), a.what, a.on) if a.need else status()
    except DiskGuardError as e:
        print(f"DISK GUARD: {e}")
        print(report())
        return 4 if "not found" in str(e) else 3
    print(json.dumps(s, indent=1) if a.json else report(s))
    return 0 if s.get("data_drive_present", True) else 4


if __name__ == "__main__":
    sys.exit(main())
