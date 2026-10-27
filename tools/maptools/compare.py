"""Render one recipe with several tools (and/or datasets) and build a labelled contact sheet to pick the best.

Usage::

    .venv/Scripts/python.exe tools/maptools/compare.py RECIPE.yaml --tools mpl,pygmt,maplibre,qgis
    .venv/Scripts/python.exe tools/maptools/compare.py RECIPE.yaml --tools all
    .venv/Scripts/python.exe tools/maptools/compare.py RECIPE.yaml --tools mpl --data data/derived/ch00/gfs_mslp_latest.nc,data/derived/ch00/era5_global_2023-11-02T12_sfc_0p5.nc

``--data`` swaps ``data[0].path`` (same variable name and scaling; use ``--var`` if the variable is named
differently). Each cell is labelled with tool (+ dataset), tool version, render seconds and output pixels; a failed
cell says why. Writes ``outputs/maptools/compare/<recipe>__<stamp>.png`` and a ``.json`` with every sidecar, so the
choice and the runner-up can be recorded in the storyboard (``data:``, ``tool:``, ``why:``).
"""
from __future__ import annotations

import argparse
import copy
import datetime as dt
import json
import math
import sys
import textwrap
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import OUT, TOOLS, write_json  # noqa: E402
from render import load_recipe, render, tool_available  # noqa: E402


def _font(size: int):
    from PIL import ImageFont

    for f in ("C:/Windows/Fonts/segoeui.ttf", "C:/Windows/Fonts/arial.ttf"):
        try:
            return ImageFont.truetype(f, size)
        except OSError:
            pass
    return ImageFont.load_default()


def sheet(cells: list[dict], out: Path, title: str, cell_w: int = 640) -> Path:
    from PIL import Image, ImageDraw

    n = len(cells)
    cols = min(3, n) if n > 1 else 1
    rows = math.ceil(n / cols)
    ims = []
    for c in cells:
        if c.get("png") and Path(c["png"]).exists():
            im = Image.open(c["png"]).convert("RGB")
            s = cell_w / im.size[0]
            im = im.resize((cell_w, max(1, round(im.size[1] * s))), Image.Resampling.LANCZOS)
        else:
            im = None
        ims.append(im)
    cell_h = max([im.size[1] for im in ims if im is not None] or [360])
    lab_h, pad, head = 54, 12, 40
    W = cols * cell_w + (cols + 1) * pad
    H = head + rows * (cell_h + lab_h) + (rows + 1) * pad
    can = Image.new("RGB", (W, H), "#f4f4f4")
    d = ImageDraw.Draw(can)
    d.text((pad, 10), title, fill="#111", font=_font(18))
    f1, f2 = _font(16), _font(13)
    for k, (c, im) in enumerate(zip(cells, ims)):
        r, q = divmod(k, cols)
        x = pad + q * (cell_w + pad)
        y = head + pad + r * (cell_h + lab_h + pad)
        d.rectangle([x - 1, y - 1, x + cell_w, y + cell_h + lab_h], outline="#bbbbbb", fill="white")
        if im is not None:
            can.paste(im, (x, y + (cell_h - im.size[1]) // 2))
        else:
            for i, line in enumerate(textwrap.wrap("FAILED: " + c.get("error", "?"), 80)[:14]):
                d.text((x + 8, y + 8 + 16 * i), line, fill="#a00", font=f2)
        d.text((x + 6, y + cell_h + 4), c["label"], fill="#111", font=f1)
        d.text((x + 6, y + cell_h + 26), c.get("sub", ""), fill="#555", font=f2)
    out.parent.mkdir(parents=True, exist_ok=True)
    can.save(out)
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("recipe")
    ap.add_argument("--tools", default=None, help="comma list or 'all' (default: the recipe's tool list)")
    ap.add_argument("--data", default=None, help="comma list of alternative data paths for data[0]")
    ap.add_argument("--var", default=None, help="variable name for the alternative data (if different)")
    ap.add_argument("--cell", type=int, default=640)
    a = ap.parse_args()
    r = load_recipe(Path(a.recipe))
    if a.tools == "all":
        tools = [t for t in TOOLS if tool_available(t)[0] and t != "gee"]
    elif a.tools:
        tools = a.tools.split(",")
    else:
        tools = r["tool"] if isinstance(r["tool"], list) else [r["tool"]]
    datas = a.data.split(",") if a.data else [None]
    stamp = dt.datetime.now().strftime("%Y%m%dT%H%M%S")
    cells, sides = [], []
    for dp in datas:
        rr = copy.deepcopy(r)
        tag = ""
        if dp:
            d0 = rr["data"][0] if isinstance(rr["data"], list) else rr["data"]
            d0["path"] = dp
            if a.var:
                d0["var"] = a.var
            tag = Path(dp).stem
            rr["name"] = f"{r['name']}__{tag}"
        for t in tools:
            label = t + (f" | {tag}" if tag else "")
            out_dir = OUT / "compare" / f"{r['name']}__{stamp}" / (f"{t}__{tag}" if tag else t)
            try:
                s = render(rr, t, out_dir, quiet=True)
                o = s["outputs"][0]
                cells.append({"label": label, "png": o["path"],
                              "sub": f"{s['tool_version'][:60]} | {s['timing_s']['tool_total']} s | "
                                     f"{o.get('size')} px" + (f" | {len(s['notes'])} note(s)" if s["notes"] else "")})
                sides.append(s)
                print(f"[compare] {label}: OK {s['timing_s']['tool_total']} s")
            except Exception as e:  # noqa: BLE001
                msg = str(e).strip().splitlines()
                short = " | ".join(x for x in msg if x.strip())[-600:]
                cells.append({"label": label, "error": short})
                sides.append({"tool": t, "data": dp, "error": short})
                print(f"[compare] {label}: FAILED {short[-200:]}")
    from common import DATA

    base = DATA / "derived" / "maptools" if set(tools) & {"gee", "gibs", "stac"} else OUT
    out = base / "compare" / f"{r['name']}__{stamp}.png"
    sheet(cells, out, f"{r['name']} - {r.get('kind', 'png')} - {len(cells)} renders ({stamp})", a.cell)
    write_json(out.with_suffix(".json"), {"recipe": str(a.recipe), "cells": cells, "sidecars": sides})
    print(f"[compare] contact sheet {out}")


if __name__ == "__main__":
    main()
