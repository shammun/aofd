"""Check that every climate-data source the book needs is reachable from this machine (PLANNING §15.4, research R3).

Each check downloads at most a few kilobytes (metadata or a one-point slice) and never writes outside the data root.
Run:  .venv/Scripts/python.exe tools/check_data_access.py          (all checks)
      .venv/Scripts/python.exe tools/check_data_access.py cds      (only the checks whose name contains "cds")
Prints one line per source: OK / NEEDS LOGIN / FAIL, plus free space on C: and G: before and after.
"""
from __future__ import annotations

import os
import shutil
import sys
import traceback
from collections.abc import Callable
from pathlib import Path

DATA_ROOT = Path(os.environ.get("AOFD_DATA_ROOT", r"G:\Geophysical Fluid Dynamics\aofd-data"))
HOME = Path.home()


def free_gb(path: str) -> float:
    """Free space on the drive holding `path`, in GB."""
    return shutil.disk_usage(path).free / 1e9


def disk_report(tag: str) -> None:
    """Print free space on C: and G: (the project's two drives)."""
    g = free_gb("G:\\") if Path("G:\\").exists() else float("nan")
    print(f"[disk {tag}] C: {free_gb('C:\\'):.1f} GB free | G: {g:.1f} GB free | data root {DATA_ROOT}")


# ---------------------------------------------------------------- anonymous sources (no account needed)
def ncep_r1_opendap() -> str:
    """NOAA PSL NCEP/NCAR Reanalysis 1 monthly 500 hPa heights over OPeNDAP (used by PoC F, Ch 0C maps)."""
    import xarray as xr
    url = "https://psl.noaa.gov/thredds/dodsC/Datasets/ncep.reanalysis/Monthlies/pressure/hgt.mon.mean.nc"
    ds = xr.open_dataset(url, engine="pydap")  # pydap: netCDF4's bundled curl cannot find CA certs on Windows
    z = float(ds["hgt"].sel(level=500).isel(time=0).sel(lat=45, lon=0, method="nearest"))
    return f"{len(ds.time)} months, Z500(45N,0E, first month) = {z:.0f} m"


def weatherbench2_era5_zarr() -> str:
    """ERA5 on Google Cloud (WeatherBench 2 ARCO zarr) - anonymous ERA5 without a CDS key."""
    import xarray as xr
    url = "gs://weatherbench2/datasets/era5/1959-2023_01_10-6h-64x32_equiangular_conservative.zarr"
    ds = xr.open_zarr(url, storage_options={"token": "anon"}, chunks=None)
    return f"{len(ds.data_vars)} variables, {ds.sizes.get('time', '?')} times"


def woa23_thredds() -> str:
    """NOAA NCEI World Ocean Atlas 2023 annual temperature climatology (ocean sections)."""
    import xarray as xr
    url = ("https://www.ncei.noaa.gov/thredds-ocean/dodsC/woa23/DATA/temperature/netcdf/decav/1.00/"
           "woa23_decav_t00_01.nc")
    ds = xr.open_dataset(url, engine="pydap", decode_times=False)
    return f"depth levels = {ds.sizes['depth']}"


def natural_earth_cartopy() -> str:
    """Natural Earth coastlines through cartopy (cached under CARTOPY_DATA_DIR on G:)."""
    import cartopy
    import cartopy.io.shapereader as shpreader
    cache = os.environ.get("CARTOPY_DATA_DIR", str(DATA_ROOT / "cache" / "cartopy"))
    cartopy.config["data_dir"] = cache
    path = shpreader.natural_earth(resolution="110m", category="physical", name="coastline")
    return f"coastline shapefile at {path}"


# ---------------------------------------------------------------- sources that need a free account
def cds_era5() -> str:
    """Copernicus Climate Data Store: credentials file + a one-point ERA5 monthly request (a few KB)."""
    rc = HOME / ".cdsapirc"
    if not rc.exists():
        raise PermissionError("no ~/.cdsapirc")
    text = rc.read_text()
    if "cds.climate.copernicus.eu/api" not in text or "/api/v2" in text:
        raise PermissionError("~/.cdsapirc must say  url: https://cds.climate.copernicus.eu/api")
    import cdsapi
    target = DATA_ROOT / "scratch" / "cds_check.nc"
    cdsapi.Client(quiet=True, progress=False).retrieve(
        "reanalysis-era5-single-levels-monthly-means",
        {"product_type": ["monthly_averaged_reanalysis"], "variable": ["2m_temperature"], "year": ["2020"],
         "month": ["01"], "time": ["00:00"], "area": [45, 0, 45, 0], "data_format": "netcdf"},
        str(target),
    )
    size = target.stat().st_size
    target.unlink()
    return f"ERA5 one-point request OK ({size} bytes, deleted)"


def nasa_earthdata() -> str:
    """NASA Earthdata login (ECCO, MERRA-2, CERES, AIRS) from ~/_netrc or EARTHDATA_USERNAME/PASSWORD."""
    import earthaccess
    have_env = os.environ.get("EARTHDATA_USERNAME") and os.environ.get("EARTHDATA_PASSWORD")
    have_rc = (HOME / "_netrc").exists() or (HOME / ".netrc").exists()
    if not (have_env or have_rc):
        raise PermissionError("no ~/_netrc and no EARTHDATA_USERNAME/PASSWORD")
    auth = earthaccess.login(strategy="environment" if have_env else "netrc")
    if not auth.authenticated:
        raise PermissionError("Earthdata rejected the credentials")
    hits = earthaccess.search_datasets(keyword="ECCO V4r4 ocean velocity monthly", count=1)
    return f"logged in; ECCO search returned {len(hits)} collection(s)"


def copernicus_marine() -> str:
    """Copernicus Marine (CMEMS) toolbox credentials (optional: mean dynamic topography, altimetry)."""
    import copernicusmarine
    if not copernicusmarine.login(check_credentials_valid=True):
        raise PermissionError("not logged in (run: .venv/Scripts/copernicusmarine.exe login)")
    return "credentials valid"


CHECKS: dict[str, tuple[Callable[[], str], bool]] = {
    # name: (check, needs an account)
    "ncep_r1_opendap": (ncep_r1_opendap, False),
    "weatherbench2_era5_zarr": (weatherbench2_era5_zarr, False),
    "woa23_thredds": (woa23_thredds, False),
    "natural_earth_cartopy": (natural_earth_cartopy, False),
    "cds_era5": (cds_era5, True),
    "nasa_earthdata": (nasa_earthdata, True),
    "copernicus_marine": (copernicus_marine, True),
}


def main(argv: list[str]) -> int:
    if not Path("G:\\").exists():
        print("G: drive not found - connect it first (the project never falls back to C:).")
        return 2
    (DATA_ROOT / "scratch").mkdir(parents=True, exist_ok=True)
    disk_report("before")
    failures = 0
    for name, (check, keyed) in CHECKS.items():
        if argv and not any(a in name for a in argv):
            continue
        try:
            print(f"OK          {name:25s} {check()}")
        except PermissionError as exc:
            print(f"NEEDS LOGIN {name:25s} {exc}")
            failures += keyed
        except Exception as exc:  # report and carry on with the other sources
            print(f"FAIL        {name:25s} {type(exc).__name__}: {str(exc).splitlines()[0][:160]}")
            if "-v" in argv:
                traceback.print_exc()
            failures += 1
    disk_report("after")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
