"""Release check for the shared library ``fluidpy`` (PLANNING §2.4, §11.3) — run before every fluidpy tag.

1. the **full fluidpy pytest** (every Kundu chapter, plus ``tests/geo|data|diag``) on the AOFD venv, with UTF-8 console
   encoding (the chapter scripts print Greek letters);
2. **two Kundu notebooks executed headless** (default ch04 and ch13) on the ``aofd-venv`` kernel. They are executed from
   copies in ``outputs/release_check/`` so the Kundu site's files are never modified;
3. ``import aofd`` and ``import fluidpy.geo, fluidpy.data, fluidpy.diag`` succeed and ``fluidpy.__version__`` matches
   the latest CHANGELOG heading.

Usage::

    .venv/Scripts/python.exe tools/release_check.py               # all three
    .venv/Scripts/python.exe tools/release_check.py --no-pytest   # notebooks + imports only
    .venv/Scripts/python.exe tools/release_check.py --notebooks ch04 ch07

Exit 0 = the release may be tagged. Prints free space on C:/G: before and after.
"""
from __future__ import annotations

import argparse
import os
import re
import shutil
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
KUNDU = (ROOT.parent / "Fluid Dynamics").resolve()
PY = ROOT / ".venv" / "Scripts" / "python.exe"
ENV = dict(os.environ, PYTHONUTF8="1", PYTHONIOENCODING="utf-8", MPLBACKEND="Agg")


def disk() -> str:
    r = subprocess.run([str(PY), str(ROOT / "tools" / "disk_guard.py")], capture_output=True, text=True, env=ENV)
    return (r.stdout or r.stderr).strip()


def run_pytest(workers: int) -> bool:
    t0 = time.time()
    r = subprocess.run([str(PY), "-m", "pytest", "tests", "-q", "-n", str(workers), "-p", "no:cacheprovider"],
                       cwd=KUNDU, env=ENV, capture_output=True, text=True)
    tail = [ln for ln in r.stdout.splitlines() if ln.startswith(("FAILED", "ERROR")) or " passed" in ln]
    print(f"[pytest] {time.time() - t0:.0f} s")
    for ln in tail[-25:]:
        print("   ", ln)
    return r.returncode == 0


def run_notebook(cid: str) -> bool:
    import nbformat
    from nbclient import NotebookClient

    nbs = sorted((KUNDU / "notebooks").glob(f"{cid}_*.ipynb"))
    nbs = [p for p in nbs if not p.stem.endswith("_colab")]
    if not nbs:
        print(f"[notebook] {cid}: not found")
        return False
    src = nbs[0]
    work = ROOT / "outputs" / "release_check"
    work.mkdir(parents=True, exist_ok=True)
    dst = work / src.name
    shutil.copyfile(src, dst)
    nb = nbformat.read(dst, as_version=4)
    t0 = time.time()
    os.environ.update({"PYTHONUTF8": "1", "MPLBACKEND": "Agg"})
    client = NotebookClient(nb, timeout=1800, kernel_name="aofd-venv", resources={"metadata": {"path": str(KUNDU / "notebooks")}})
    try:
        client.execute()
        ok = True
        err = ""
    except Exception as e:                       # CellExecutionError carries the traceback
        ok, err = False, str(e).splitlines()[-1][:300] if str(e) else repr(e)
    nbformat.write(nb, dst)
    print(f"[notebook] {src.name}: {'OK' if ok else 'FAIL'} in {time.time() - t0:.0f} s {err}")
    return ok


def check_imports() -> bool:
    code = ("import fluidpy, fluidpy.geo, fluidpy.data, fluidpy.diag; import aofd; print(fluidpy.__version__)")
    r = subprocess.run([str(PY), "-c", code], capture_output=True, text=True, env=ENV, cwd=ROOT)
    ver = r.stdout.strip()
    log = (KUNDU / "CHANGELOG.md").read_text(encoding="utf-8") if (KUNDU / "CHANGELOG.md").exists() else ""
    m = re.search(r"^## v(\d+\.\d+\.\d+)", log, re.M)
    ok = r.returncode == 0 and m is not None and m.group(1) == ver
    print(f"[imports] fluidpy {ver or '?'} | CHANGELOG top v{m.group(1) if m else '?'} | aofd import "
          f"{'OK' if r.returncode == 0 else 'FAIL: ' + r.stderr.strip()[-200:]}")
    return ok


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--no-pytest", action="store_true")
    ap.add_argument("--notebooks", nargs="*", default=["ch04", "ch13"])
    ap.add_argument("-n", "--workers", type=int, default=8)
    a = ap.parse_args()
    print("disk before:", disk())
    results = {}
    if not a.no_pytest:
        results["pytest"] = run_pytest(a.workers)
    for cid in a.notebooks:
        results[f"nb_{cid}"] = run_notebook(cid)
    results["imports"] = check_imports()
    print("disk after: ", disk())
    print("RELEASE CHECK", "PASS" if all(results.values()) else "FAIL", results)
    return 0 if all(results.values()) else 1


if __name__ == "__main__":
    sys.exit(main())
