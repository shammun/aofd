"""Install the map / 3-D toolkit environments (series_plan.md "Map toolkit set-up", user 2026-10-27).

Three separate environments, never the project ``.venv`` / ``.venv-tts`` / ``movies/``:

* ``.venv-maps``  (Python 3.12, repo root, git-ignored): geovista/pyvista, leafmap, geemap, earthengine-api,
  rasterio, xarray, cmocean ... (pip cache on G:).
* ``<data root>/envs/gmt`` (micromamba env on G:, root prefix and package cache on G:): GMT 6 + PyGMT, because pip
  cannot supply the GMT binary on Windows.
* ``tools/maptools/js`` (its own package.json; npm cache on G:): maplibre-gl, deck.gl, cesium, three.
* ``<data root>/envs/rustgis-0.4.0``: the RustGIS portable zip (rustgis-cli.exe: batch renders + MCP server).

Disk rule: C: may go down to 12 GB free for these installs, no lower. Free space on C: and G: is printed before and
after every step and appended to ``<data root>/logs/maptools_install.log``.

Usage::

    .venv/Scripts/python.exe tools/maptools/install.py --step all        # or venv | gmt | js | report
    .venv/Scripts/python.exe tools/maptools/install.py --step report     # versions + sizes only
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import shutil
import subprocess
import sys
import urllib.request
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
DATA = Path(os.environ.get("AOFD_DATA_ROOT", "G:/Geophysical Fluid Dynamics/aofd-data"))
VENV = REPO / ".venv-maps"
VPY = VENV / "Scripts" / "python.exe"
MAMBA_DIR = DATA / "envs" / "_micromamba"
MAMBA = MAMBA_DIR / "micromamba.exe"
GMT_ENV = DATA / "envs" / "gmt"
JS_DIR = REPO / "tools" / "maptools" / "js"
PIP_CACHE = DATA / "cache" / "pip"
NPM_CACHE = DATA / "cache" / "npm"
CONDA_PKGS = DATA / "cache" / "conda-pkgs"
LOG = DATA / "logs" / "maptools_install.log"
C_FLOOR_GB = 12.0
GB = 1024 ** 3

# pip set for .venv-maps (pins chosen from what resolved on 2026-10-27; see the skill for the tested versions)
VENV_PKGS = [
    "numpy", "scipy", "xarray", "netCDF4", "pyyaml", "pillow", "imageio", "cmocean", "matplotlib",
    "rasterio", "pyproj", "shapely", "geopandas",
    "pyvista", "geovista",
    "leafmap", "geemap", "earthengine-api",
    "playwright", "rustgis==0.4.0", "geolibre[mcp]==3.5.1",
]
RUSTGIS_ZIP = "https://github.com/opengeos/RustGIS/releases/download/v0.4.0/RustGIS-0.4.0-windows-x86_64-portable.zip"
RUSTGIS_DIR = DATA / "envs" / "rustgis-0.4.0"
GMT_PKGS = ["python=3.12", "gmt>=6.5", "pygmt", "ghostscript", "xarray", "netcdf4", "pyyaml", "pillow", "numpy"]
MAMBA_URL = "https://github.com/mamba-org/micromamba-releases/releases/latest/download/micromamba-win-64"


def free_gb(p: str) -> float:
    return shutil.disk_usage(p).free / GB


def disk_line(tag: str) -> str:
    line = f"{dt.datetime.now():%Y-%m-%d %H:%M:%S} {tag}: C: {free_gb('C:/'):.1f} GB free, G: {free_gb('G:/'):.1f} GB free"
    LOG.parent.mkdir(parents=True, exist_ok=True)
    with LOG.open("a", encoding="utf-8") as fh:
        fh.write(line + "\n")
    print(line, flush=True)
    return line


def need_c(gb: float, what: str) -> None:
    """Stop if installing ~``gb`` GB on C: would cross the 12 GB install floor."""
    have = free_gb("C:/")
    if have - gb < C_FLOOR_GB:
        raise SystemExit(f"STOP: {what} needs ~{gb:.1f} GB on C:, only {have:.1f} GB free (floor {C_FLOOR_GB} GB)")
    if not Path("G:/").exists():
        raise SystemExit("STOP: G: is missing (never fall back to C:)")


def run(cmd: list[str], env: dict | None = None, cwd: Path | None = None) -> None:
    print("+", " ".join(f'"{c}"' if " " in c else c for c in cmd), flush=True)
    subprocess.run(cmd, check=True, env={**os.environ, **(env or {})}, cwd=cwd)


def dir_size(p: Path) -> float:
    tot = 0
    for root, _, files in os.walk(p):
        for f in files:
            try:
                tot += (Path(root) / f).stat().st_size
            except OSError:
                pass
    return tot / GB


def step_venv() -> None:
    disk_line("venv before")
    need_c(3.0, ".venv-maps")
    if not VPY.exists():
        run([r"C:\Python312\python.exe", "-m", "venv", str(VENV)])
    run([str(VPY), "-m", "pip", "install", "--cache-dir", str(PIP_CACHE), "-U", "pip"])
    run([str(VPY), "-m", "pip", "install", "--cache-dir", str(PIP_CACHE), *VENV_PKGS])
    disk_line(f"venv after ({dir_size(VENV):.2f} GB)")


def step_gmt() -> None:
    disk_line("gmt before")
    MAMBA_DIR.mkdir(parents=True, exist_ok=True)
    if not MAMBA.exists():
        print("downloading micromamba ->", MAMBA, flush=True)
        urllib.request.urlretrieve(MAMBA_URL, MAMBA)
    env = {"MAMBA_ROOT_PREFIX": str(MAMBA_DIR / "root"), "CONDA_PKGS_DIRS": str(CONDA_PKGS)}
    if not (GMT_ENV / "python.exe").exists():
        run([str(MAMBA), "create", "-y", "-p", str(GMT_ENV), "-c", "conda-forge", *GMT_PKGS], env=env)
    disk_line(f"gmt after (env {dir_size(GMT_ENV):.2f} GB, pkgs {dir_size(CONDA_PKGS):.2f} GB)")


def step_js() -> None:
    disk_line("js before")
    need_c(1.5, "tools/maptools/js node_modules")
    npm = shutil.which("npm.cmd") or shutil.which("npm") or "npm"
    run([npm, "install", "--no-audit", "--no-fund", "--cache", str(NPM_CACHE)], cwd=JS_DIR)
    disk_line(f"js after ({dir_size(JS_DIR / 'node_modules'):.2f} GB)")


def step_rustgis() -> None:
    """Portable RustGIS 0.4.0 (rustgis-cli.exe for the MCP server and batch renders) unpacked on G:."""
    import zipfile

    disk_line("rustgis before")
    exe = RUSTGIS_DIR / "RustGIS-0.4.0-windows-x86_64" / "rustgis-cli.exe"
    if not exe.exists():
        RUSTGIS_DIR.mkdir(parents=True, exist_ok=True)
        z = RUSTGIS_DIR / "portable.zip"
        urllib.request.urlretrieve(RUSTGIS_ZIP, z)
        with zipfile.ZipFile(z) as zf:
            zf.extractall(RUSTGIS_DIR)
        z.unlink()
    disk_line(f"rustgis after ({dir_size(RUSTGIS_DIR):.2f} GB)")


def report() -> dict:
    out: dict = {"disk": {"C_free_gb": round(free_gb("C:/"), 1), "G_free_gb": round(free_gb("G:/"), 1)}}
    if VPY.exists():
        code = ("import importlib.metadata as m, json\n"
                "def v(p):\n"
                "    try: return m.version(p)\n"
                "    except Exception: return None\n"
                "print(json.dumps({p: v(p) for p in %r}))") % (
            ["pyvista", "geovista", "vtk", "leafmap", "geemap", "earthengine-api", "rasterio", "cmocean",
             "matplotlib", "xarray", "playwright", "rustgis", "geolibre"],)
        r = subprocess.run([str(VPY), "-c", code], capture_output=True, text=True)
        out[".venv-maps"] = {"path": str(VENV), "size_gb": round(dir_size(VENV), 2),
                             "versions": json.loads(r.stdout) if r.returncode == 0 else r.stderr[-400:]}
    gpy = GMT_ENV / "python.exe"
    if gpy.exists():
        r = subprocess.run([str(gpy), "-c", "import pygmt,json;print(json.dumps({'pygmt':pygmt.__version__,"
                            "'gmt':pygmt.clib.Session.__enter__(pygmt.clib.Session()).info['version']}))"], capture_output=True, text=True)
        out["gmt-env"] = {"path": str(GMT_ENV), "size_gb": round(dir_size(GMT_ENV), 2),
                          "versions": r.stdout.strip() or r.stderr[-400:]}
    nm = JS_DIR / "node_modules"
    if nm.exists():
        vers = {}
        for name in ["maplibre-gl", "deck.gl", "cesium", "three"]:
            pj = nm / name / "package.json"
            if pj.exists():
                vers[name] = json.loads(pj.read_text(encoding="utf-8"))["version"]
        out["js"] = {"path": str(nm), "size_gb": round(dir_size(nm), 2), "versions": vers}
    print(json.dumps(out, indent=2))
    return out


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--step", default="report", choices=["all", "venv", "gmt", "js", "rustgis", "report"])
    a = ap.parse_args()
    if a.step in ("venv", "all"):
        step_venv()
    if a.step in ("gmt", "all"):
        step_gmt()
    if a.step in ("js", "all"):
        step_js()
    if a.step in ("rustgis", "all"):
        step_rustgis()
    report()


if __name__ == "__main__":
    main()
