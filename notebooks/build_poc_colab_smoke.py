"""Build the PoC E Colab smoke notebook (analysis/ch00_poc.md, row E).

    .venv/Scripts/python.exe notebooks/build_poc_colab_smoke.py           # writes notebooks/poc_colab_smoke_colab.ipynb (no outputs)
    .venv/Scripts/python.exe notebooks/build_poc_colab_smoke.py --dump    # print the outline, write nothing

The executed twin ``notebooks/poc_colab_smoke.ipynb`` is written by running the ``_colab`` file headlessly (aofd-venv kernel).
What it tests: the nbkit setup cell (clone shammun/aofd + pip install the pinned fluidpy tag on Colab), loading a committed
derived product with xarray and **no keys**, a cartopy NorthPolarStereo map with a cmocean colour map, and the pin.
"""
from __future__ import annotations

import argparse
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))
from nbkit import ChapterNotebook, _book  # noqa: E402

PIN = _book()["project"]["library_pin"].lstrip("v")   # book.yaml → project.library_pin, e.g. "0.3.1"


def build() -> ChapterNotebook:
    nb = ChapterNotebook("ch00c", name="poc_colab_smoke_colab")
    nb.md("""
        # PoC E · Colab smoke test — one committed data file, no keys

        A tiny notebook that checks the plumbing every chapter relies on:

        1. the **setup cell** finds (or, on Colab, clones) the `aofd` repository and installs the pinned `fluidpy` release;
        2. a **derived data product committed in the repository** opens with `xarray` — no account, no API key, no download;
        3. a **map** draws with `cartopy` (North Polar Stereographic projection) and a `cmocean` colour map;
        4. the installed `fluidpy` is exactly the pinned version.

        If every cell runs without an error, a reader can open any chapter in Colab and run it.""")
    nb.setup()

    nb.md("""
        ## 1 · Which library did we get?

        The book pins one release of the shared library so that every notebook sees the same functions. On Colab the setup
        cell installed it from GitHub; on your computer it is the copy installed in the project's environment.""")
    nb.code(f"""
        import importlib.metadata as md                           # reads installed package versions
        print("fluidpy", fluidpy.__version__, "from", pathlib.Path(fluidpy.__file__).parent)   # where it was imported from
        assert fluidpy.__version__ == "{PIN}", f"expected fluidpy {PIN}, got {{fluidpy.__version__}}"   # the pin (book.yaml)
        for pkg in ("numpy", "xarray", "netCDF4", "cartopy", "cmocean", "matplotlib"):          # the packages this notebook needs
            print(f"  {{pkg:10s}} {{md.version(pkg)}}")                                           # all came with fluidpy[geo,data]""")

    nb.md("""
        ## 2 · No keys needed

        Data in the book come from files already in the repository (`data/derived/`), made once from open archives. The
        cell below only *reports* whether any credential is visible to Python; nothing here reads one. (Refreshing data
        from the archives is a separate, optional, local-only path.)""")
    nb.code("""
        cred_env = [k for k in ("CDSAPI_KEY", "CDSAPI_URL", "EARTHDATA_USERNAME", "EARTHDATA_PASSWORD") if os.environ.get(k)]  # keyed-access variables
        cred_files = [p.name for p in (pathlib.Path.home() / ".cdsapirc", pathlib.Path.home() / ".netrc", pathlib.Path.home() / "_netrc") if p.exists()]
        print("credential variables set:", cred_env or "none")       # informational only: nothing below uses them
        print("credential files present:", cred_files or "none")     # informational only: nothing below opens them
        REFRESH = False                                               # the default path never downloads anything""")

    nb.md("""
        ## 3 · Open the committed data file

        One day of the **500 hPa geopotential height** from the NCEP/NCAR Reanalysis 1. In plain words: the height (in
        metres) of the level in the sky where the air pressure is 500 hPa — about half of the pressure at the ground, so
        roughly halfway up through the mass of the air. A **reanalysis** blends observations with a weather model into a
        complete, gridded history. Low heights mean the air column underneath is cold.""")
    nb.code("""
        import xarray as xr                                        # labelled arrays read from netCDF files
        path = ROOT / "data" / "derived" / "ch00" / "ncep_r1_z500_20140106.nc"   # committed in the repository (≈ 28 kB)
        ds = xr.open_dataset(path)                                 # opens the file lazily (no download)
        z = ds["z"]                                                # 500 hPa geopotential height [m], shape (lat, lon)
        print(z.dims, z.shape, z.attrs.get("units"))               # ('lat', 'lon') (73, 144) m
        for k, v in ds.attrs.items():                              # provenance written when the file was made
            print(f"  {k:15s} {str(v)[:110]}")
        print(f"min {float(z.min()):.0f} m, max {float(z.max()):.0f} m, lat {float(ds.lat[0])} → {float(ds.lat[-1])}")
        def lowest(box):                                           # the lowest height inside a lat/lon box, and where
            i = box.argmin(dim=["lat", "lon"])                     # grid indices of the minimum
            lon = (float(box.lon[i["lon"]]) + 180) % 360 - 180     # longitude shown as −180…180 (negative = west)
            return float(box[i["lat"], i["lon"]]), float(box.lat[i["lat"]]), lon
        print("deepest low north of 20°N: %.0f m at %.1f°N, %.1f°E" % lowest(z.sel(lat=slice(20, 90))))
        print("deepest low over North America: %.0f m at %.1f°N, %.1f°E" % lowest(z.sel(lat=slice(35, 60), lon=slice(260, 300))))
        print(f"at 45°N: {float(z.sel(lat=45, lon=275)):.0f} m over the Great Lakes (85°W) vs "
              f"{float(z.sel(lat=45, lon=240)):.0f} m over the US west coast (120°W)")   # the trough–ridge contrast""",
            explain="""
            1. `path` points at the file inside the repository; on Colab that is the clone in `/content/aofd`.
            2. `xr.open_dataset` reads its labels (latitude, longitude) and attributes; `z` is the height field in metres.
            3. The attributes say where the numbers came from (source URL, licence, citation, processing) — this is what the figure caption and credit line use.""")

    nb.reading_card(
        what="500 hPa geopotential height [m], NCEP/NCAR Reanalysis 1, daily mean of 6 January 2014 (raw values, not an anomaly).",
        axes="Map of the Northern Hemisphere from 20°N to the pole, North Polar Stereographic projection (the pole in the centre, "
             "latitude circles every 30°, longitude lines every 60°).",
        encoding="Colour = height, cmocean *thermal* from about 4900 m (dark) to 5900 m (light); contours every 60 m, the 5400 m "
                 "contour bold. Grey lines are coastlines (Natural Earth 1:110m, from a file in the repository).",
        feature="The lowest heights (about 4930 m) sit over central Siberia near 65°N, 105°E, and a second deep trough (about 5010 m "
                "at 55°N, 85°W) dips south over eastern North America: at 45°N the Great Lakes are about 630 m lower than the US west coast.",
        physics="Low 500 hPa heights sit over cold air columns (cold air is denser, so pressure falls off faster with height). "
                "On a warmer day the bowl would be shallower and the 5400 m contour would retreat poleward.",
        source="Reanalysis (observations blended with a weather model), NOAA PSL; public domain. "
               "Credit: NCEP/NCAR Reanalysis 1 data provided by the NOAA PSL, Boulder, Colorado, USA.")
    nb.figure("""
        import json, base64                                       # to decode the committed coastline file
        import numpy as np                                        # arrays
        import matplotlib.pyplot as plt                           # plotting
        import matplotlib.path as mpath                           # a circle, to cut the polar map round
        import cartopy.crs as ccrs                                # map projections
        import cmocean                                            # perceptually uniform ocean/atmosphere colour maps

        coast = json.loads((ROOT / "assets" / "coast110.json").read_text())       # Natural Earth 1:110m, committed (no download)
        pts = np.frombuffer(base64.b64decode(coast["data"]), dtype="<i2").reshape(-1, 2) / coast["scale"]   # (lon, lat) [°]
        starts = list(coast["starts"]) + [len(pts)]               # where each coastline polyline begins and ends

        nh = z.sel(lat=slice(20, 90))                             # Northern Hemisphere poleward of 20°N (lat runs S→N)
        lon_c = np.append(nh.lon.values, 360.0)                   # repeat the first longitude at 360° to close the circle
        z_c = np.concatenate([nh.values, nh.values[:, :1]], axis=1)   # same for the data, so there is no gap at 0°

        fig = plt.figure(figsize=(6.2, 6.2))                      # one square map
        ax = plt.axes(projection=ccrs.NorthPolarStereo(central_longitude=-90))    # North America at the bottom
        ax.set_extent([-180, 179.999, 20, 90], crs=ccrs.PlateCarree())  # 20°N to the pole (179.999: cartopy 0.26 collapses on −180…180)
        theta = np.linspace(0, 2 * np.pi, 120)                    # a circle in axes coordinates …
        ax.set_boundary(mpath.Path(np.c_[np.sin(theta), np.cos(theta)] * 0.5 + 0.5), transform=ax.transAxes)  # … makes the map round
        pcm = ax.pcolormesh(lon_c, nh.lat, z_c, cmap=cmocean.cm.thermal, vmin=4900, vmax=5900,
                            shading="nearest", transform=ccrs.PlateCarree())     # colour = height [m]
        levels = np.arange(4920, 5941, 60)                        # contour every 60 m (the forecasters' 6 dam)
        ax.contour(lon_c, nh.lat, z_c, levels=levels, colors="k", linewidths=0.5, transform=ccrs.PlateCarree())
        ax.contour(lon_c, nh.lat, z_c, levels=[5400], colors="k", linewidths=1.8, transform=ccrs.PlateCarree())  # 5400 m bold
        for i0, i1 in zip(starts[:-1], starts[1:]):               # draw each coastline polyline
            ax.plot(pts[i0:i1, 0], pts[i0:i1, 1], color="0.45", lw=0.6, transform=ccrs.Geodetic())
        ax.gridlines(xlocs=range(-180, 181, 60), ylocs=[30, 60], color="0.6", lw=0.4, ls=":")   # latitude circles, longitudes
        fig.colorbar(pcm, ax=ax, shrink=0.75, pad=0.04, label="500 hPa geopotential height [m]")
        ax.set_title("500 hPa height, 6 Jan 2014: cold troughs over Siberia and North America", fontsize=11)
        plt.show()""",
        see="""A round map of the Northern Hemisphere with the pole in the middle. Heights are lowest (dark) near the pole
        and highest (light) toward 20°N, but the bowl is lopsided: the darkest patch is over central Siberia, and a second dark lobe reaches south over
        eastern North America (the cold-air outbreak of early January 2014).""",
        read="""Each thin contour is 60 m apart; where they crowd, the height changes fast, and (as Chapter 0B will show)
        the wind is strong and blows along them. The bold contour is 5400 m, a handy marker of where the cold air ends.""",
        change="""Pick a summer day instead: the whole field rises by a couple of hundred metres, the colours lighten and the
        5400 m contour shrinks to a small ring near the pole.""")
    return nb


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="Build notebooks/poc_colab_smoke_colab.ipynb (PoC E).")
    ap.add_argument("--dump", action="store_true", help="print the outline and write nothing")
    args = ap.parse_args(argv)
    nb = build()
    if args.dump:
        for i, c in enumerate(nb.cells):
            print(f"{i:02d} {c.cell_type:8s} {c.source.splitlines()[0][:90] if c.source else ''}")
        return 0
    nb.nb.metadata["colab"] = {"provenance": [], "name": "poc_colab_smoke_colab.ipynb"}   # Colab opens it as a fresh notebook
    dest = nb.save(allow_missing=["explainers"])     # a smoke test embeds no explainer (deliberate)
    print(f"wrote {dest.relative_to(ROOT).as_posix()} ({len(nb.cells)} cells)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
