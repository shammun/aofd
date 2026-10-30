"""House kit K5, builder side (UF2, 2026-10-29): turn a level list into a layer-stack product for
``movies/src/house/kit/stack3d.tsx`` (LayerStack3D).

    from _stack import stack_product
    hdr, blob, rows = stack_product("stack_q", F, zg, levels, lat, lon, lo, hi, exaggeration=150, units="g/kg", ...)

Writes nothing itself: returns the JSON header (levels, area-mean geopotential height z̄ per level, optional per-latitude
strip means, the colour range, the exaggeration, the box, the byte layout of the Float32 little-endian blob) and the blob
(fields level by level, row 0 = the SOUTH edge, NaN where below ground), plus manifest rows (what was computed how).
Area means use cos(lat) weights (``fluidpy.diag.climatology.global_mean`` semantics on a box).
"""
from __future__ import annotations

import numpy as np


def area_mean(F: np.ndarray, lat: np.ndarray) -> float:
    """cos(lat)-weighted mean of a (lat, lon) field over its box, NaNs ignored."""
    w = np.cos(np.deg2rad(lat))[:, None] * np.ones_like(F)
    m = np.isfinite(F)
    return float(np.sum(np.where(m, F, 0) * w) / np.sum(w * m))


def stack_product(name: str, F: np.ndarray, zg: np.ndarray, levels, lat, lon, lo: float, hi: float, *, exaggeration: float,
                  units: str, lut: str, strips: bool = False, below_ground: np.ndarray | None = None, extra: dict | None = None
                  ) -> tuple[dict, bytes, list[dict]]:
    """F, zg: (level, lat, lon) with lat ascending (south first); zg geopotential height [m]. Returns (header, blob, rows)."""
    lat = np.asarray(lat, float)
    lon = np.asarray(lon, float)
    F = np.asarray(F, np.float32).copy()
    if below_ground is not None:
        F[np.asarray(below_ground, bool)] = np.nan
    if lat[0] > lat[-1]:
        F, zg, lat = F[:, ::-1], zg[:, ::-1], lat[::-1]
    nl, ny, nx = F.shape
    zbar = [area_mean(np.asarray(zg[k], float), lat) for k in range(nl)]
    hdr = {"name": name, "levels_hPa": [float(v) for v in levels], "lat": [float(lat[0]), float(lat[-1])], "lon": [float(lon[0]), float(lon[-1])],
           "ny": int(ny), "nx": int(nx), "units": units, "lut": lut, "range": [lo, hi], "exaggeration": exaggeration,
           "zbar_m": [round(z, 1) for z in zbar], "layout": "float32 LE, level-major, row 0 = south, NaN = no data",
           "bytes_per_level": int(ny * nx * 4)}
    if strips:
        hdr["strip_lat"] = [float(v) for v in lat]
        hdr["strip_zbar_m"] = [[round(float(np.nanmean(zg[k, j])), 1) for j in range(ny)] for k in range(nl)]
    if extra:
        hdr.update(extra)
    rows = [{"product": name, "what": f"{nl} layers {units}, area-mean heights (cos-lat weights)", "zbar_m": hdr["zbar_m"],
             "range": [lo, hi], "exaggeration": exaggeration}]
    return hdr, F.astype("<f4").tobytes(), rows
