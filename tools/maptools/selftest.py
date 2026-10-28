"""Self-test of every map-toolkit adapter: render tiny known maps, compare with stored references, time each tool.

    .venv/Scripts/python.exe tools/maptools/selftest.py                 # all tools (several minutes; ArcGIS ~1-2 min)
    .venv/Scripts/python.exe tools/maptools/selftest.py --tools mpl,pygmt,qgis
    .venv/Scripts/python.exe tools/maptools/selftest.py --quick         # skip the slow ones (arcgis, cesium, leafmap)
    .venv/Scripts/python.exe tools/maptools/selftest.py --update        # (re)write references after a deliberate change
    .venv/Scripts/python.exe tools/maptools/selftest.py --determinism   # render each case twice, report byte/pixel equality
    .venv/Scripts/python.exe tools/maptools/selftest.py --only mpl:ciaran_synoptic --update-missing   # new case refs

Test maps (recipes in ``tools/maptools/recipes/``): Alps relief (ETOPO 2022, hillshade, 3-D camera), global MSLP
(ERA5 12 UTC 2 Nov 2023, Robinson, isobars), Storm Ciaran isobars (same field, Lambert, 10 m coasts/borders), MSLP
globe (orthographic), plus a three.js texture and a heightmap (mpl), the PyGMT texture, the GeoVista RGB-mesh
texture globe (GIBS true colour) and the full synoptic chart with symbol layers (mpl, pygmt, deckgl). References in
``tools/maptools/refs/selftest_refs.json``: decoded-pixel sha256 + mean RGB, std and non-white fraction.

Verdict per case: PASS-exact (same pixels), PASS-approx (|mean RGB| <= 2.0 per channel, |std| <= 3.0,
|non-white| <= 0.01 of the reference: tolerates GPU/driver/font antialiasing), FAIL, or SKIP (product missing,
not licensed, or not authenticated - with the reason). Exit code 1 if any FAIL.
"""
from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import OUT, TOOLDIR, disk, pixel_diff, write_json  # noqa: E402
from render import load_recipe, render, tool_available  # noqa: E402

REFS = TOOLDIR / "refs" / "selftest_refs.json"
R = TOOLDIR / "recipes"
CASES: list[tuple[str, str]] = [
    ("mpl", "ciaran_isobars"), ("mpl", "global_mslp"), ("mpl", "global_texture"), ("mpl", "alps_heightmap"),
    ("mpl", "ciaran_synoptic"),
    ("pygmt", "alps_relief"), ("pygmt", "global_mslp"), ("pygmt", "global_texture"), ("pygmt", "ciaran_synoptic"),
    ("geovista", "globe_mslp"), ("geovista", "globe_texture"),
    ("maplibre", "ciaran_isobars"), ("deckgl", "alps_relief"), ("deckgl", "ciaran_isobars"),
    ("deckgl", "ciaran_synoptic"), ("cesium", "globe_mslp"),
    ("leafmap", "ciaran_isobars"),
    ("rustgis", "alps_relief"), ("rustgis", "ciaran_isobars"),
    ("qgis", "ciaran_isobars"), ("qgis", "alps_relief"),
    ("arcgis", "ciaran_isobars"),
    ("gee", "gee_era5_mslp"), ("gee", "gee_sst_anom_timelapse"), ("gee", "gee_flood_before_after"),
    ("gee", "gee_nino34_timeseries"), ("gee", "gee_dhaka_t2m_timeseries"),
    ("gibs", "gibs_ciaran_timelapse"), ("stac", "stac_derna_before_after"),
]
SLOW = {"arcgis", "cesium", "leafmap", "stac"}
TOL = {"mean_rgb": 2.0, "std": 3.0, "nonwhite": 0.01}


def skip_reason(tool: str) -> str | None:
    ok, why = tool_available(tool)
    if not ok:
        return why
    return None


def judge(stats: dict, ref: dict | None) -> str:
    if ref is None:
        return "NEW (no reference; run --update)"
    if stats["pixel_sha256"] == ref["pixel_sha256"]:
        return "PASS-exact"
    if stats["size"] != ref["size"]:
        return f"FAIL size {stats['size']} != {ref['size']}"
    dm = max(abs(a - b) for a, b in zip(stats["mean_rgb"], ref["mean_rgb"]))
    ds, dn = abs(stats["std"] - ref["std"]), abs(stats["nonwhite"] - ref["nonwhite"])
    if dm <= TOL["mean_rgb"] and ds <= TOL["std"] and dn <= TOL["nonwhite"]:
        return f"PASS-approx (dmean {dm:.2f}, dstd {ds:.2f}, dnonwhite {dn:.4f})"
    return f"FAIL (dmean {dm:.2f}, dstd {ds:.2f}, dnonwhite {dn:.4f})"


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--tools", default=None)
    ap.add_argument("--quick", action="store_true")
    ap.add_argument("--update", action="store_true")
    ap.add_argument("--determinism", action="store_true")
    ap.add_argument("--only", default=None, help="comma list of cases tool:recipe (e.g. mpl:ciaran_synoptic)")
    ap.add_argument("--update-missing", action="store_true",
                    help="write references only for cases that have none (new cases); never overwrite")
    a = ap.parse_args()
    want = set(a.tools.split(",")) if a.tools else None
    only = set(a.only.split(",")) if a.only else None
    refs = json.loads(REFS.read_text(encoding="utf-8")) if REFS.exists() else {}
    rows, fails = [], 0
    d0 = disk()
    t_all = time.time()
    for tool, rec in CASES:
        if want and tool not in want:
            continue
        if only and f"{tool}:{rec}" not in only:
            continue
        if a.quick and tool in SLOW:
            continue
        key = f"{tool}:{rec}"
        why = skip_reason(tool)
        if why:
            rows.append((key, "SKIP", why, 0.0))
            continue
        r = load_recipe(R / f"{rec}.yaml")
        out_dir = OUT / "selftest" / tool
        t0 = time.time()
        try:
            s = render(r, tool, out_dir, quiet=True)
        except Exception as e:  # noqa: BLE001
            msg = str(e)
            if tool in ("gee", "gibs", "stac") and ("getaddrinfo" in msg or "NameResolution" in msg
                                                     or "offline and not archived" in msg):
                rows.append((key, "SKIP", "network unavailable and not in the G: archive", 0.0))
            elif tool == "gee" and ("not initialised" in msg or "authenticate" in msg):
                rows.append((key, "SKIP", "GEE not authenticated (user: earthengine authenticate)", 0.0))
            elif tool == "arcgis" and ("licen" in msg.lower() or "NotLicensed" in msg):
                rows.append((key, "SKIP", "ArcGIS Pro not licensed / not signed in", 0.0))
            else:
                rows.append((key, "FAIL", msg.strip().splitlines()[-1][:200] if msg.strip() else "error", 0.0))
                fails += 1
            continue
        dt_ = time.time() - t0
        if tool in ("gee", "gibs", "stac"):            # user rule: remote exports never on C:
            bad = [x["path"] for x in s["outputs"] if not x["path"].upper().startswith("G:")]
            bad += [q["archive"] for q in s.get("remote_requests", []) if not q["archive"].upper().startswith("G:")]
            if bad:
                rows.append((key, "FAIL", f"remote output on C: {bad[:2]}", time.time() - t0))
                fails += 1
                continue
        o = next(x for x in s["outputs"] if x["path"].endswith(".png"))      # timeseries: the chart PNG
        stats = {k: o[k] for k in ("size", "pixel_sha256", "mean_rgb", "std", "nonwhite")}
        csvs = [x["path"] for x in s["outputs"] if x["path"].endswith(".csv")]
        if csvs:
            import pandas as pd

            stats["csv_rows"] = len(pd.read_csv(csvs[0]))
        if a.update or (a.update_missing and key not in refs):
            refs[key] = stats | {"tool_version": s["tool_version"]}
            verdict = "UPDATED"
        else:
            verdict = judge(stats, refs.get(key))
            if verdict.startswith("FAIL"):
                fails += 1
        extra = ""
        if a.determinism:
            first = Path(o["path"])
            o_png = first
            keep = first.with_name(first.stem + "__run1.png")
            keep.write_bytes(first.read_bytes())
            try:
                s2 = render(r, tool, out_dir, quiet=True)
                second = Path(next(x for x in s2["outputs"] if x["path"].endswith(".png"))["path"])
                same = keep.read_bytes() == second.read_bytes()
                pdiff = pixel_diff(keep, second)
                extra = (f" | rerun: bytes {'same' if same else 'differ'}, mean|d| {pdiff.get('mean_abs')}, "
                         f"max {pdiff.get('max')}")
            except Exception as e:  # noqa: BLE001
                extra = f" | rerun failed: {str(e).strip().splitlines()[-1][:120]}"
            finally:
                keep.unlink(missing_ok=True)
        rows.append((key, verdict, f"{s['tool_version'][:70]}{extra}", dt_))
    if a.update or a.update_missing:
        write_json(REFS, refs)
    w = max(len(k) for k, *_ in rows) if rows else 10
    print(f"{'case':{w}s}  {'verdict':44s} {'time':>7s}  detail")
    for k, v, d, t in rows:
        print(f"{k:{w}s}  {v[:44]:44s} {t:6.1f}s  {d}")
    d1 = disk()
    print(f"\ntotal {time.time() - t_all:.0f} s | FAIL {fails} | disk C: {d0['C_free_gb']} -> {d1['C_free_gb']} GB, "
          f"G: {d0['G_free_gb']} -> {d1['G_free_gb']} GB")
    write_json(OUT / "selftest" / "last_run.json", {"rows": rows, "fails": fails})
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
