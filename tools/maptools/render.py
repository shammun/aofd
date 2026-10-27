"""Render one map / globe / terrain visual from a YAML recipe with the tool it names (series_plan "Map toolkit set-up").

Usage (from the repo root, project .venv)::

    .venv/Scripts/python.exe tools/maptools/render.py tools/maptools/recipes/alps_relief.yaml
    .venv/Scripts/python.exe tools/maptools/render.py RECIPE.yaml --tool pygmt --out outputs/maptools/x
    .venv/Scripts/python.exe tools/maptools/render.py RECIPE.yaml --check     # render twice, report determinism
    .venv/Scripts/python.exe tools/maptools/render.py --list                  # tools, environments, availability

Flow: recipe -> ``prep.prepare`` (in .venv: cut, scale, colour LUT, contours, overlays, heightmaps -> job.json in a
G: scratch work dir) -> the tool's adapter in its own environment (subprocess) -> outputs + sidecar
``<output>.json`` with provenance (data files + sha256, licence + credit, tool + version, recipe sha256, pixel
sha256 and statistics, disk). See ``.claude/skills/map-toolkit/SKILL.md`` for the recipe format.
"""
from __future__ import annotations

import argparse
import copy
import datetime as dt
import json
import subprocess
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import ADAPTERS, DATA, ENVS, OUT, env_vars, REPO, SCRATCH, TOOLS, disk, pixel_diff, pixel_stats, sha256_text, write_json  # noqa: E402

import yaml  # noqa: E402

G_ONLY = {"gee", "gibs", "stac"}
G_OUT = DATA / "derived" / "maptools"           # rendered products of remote sources (never C:)

DETERMINISM = {
    "mpl": "byte-identical PNG (Agg, metadata stripped)",
    "pygmt": "pixel-identical on one machine (GMT + Ghostscript raster; PNG bytes may differ only in metadata)",
    "geovista": "pixel-identical on one machine (VTK offscreen software path); tolerance mean|d| <= 0.5/255",
    "maplibre": "pixel-identical on this machine and GPU (Remotion chrome-headless-shell, ANGLE D3D11, RTX A1000); other GPUs/drivers differ slightly: never mix frames of one shot",
    "deckgl": "pixel-identical on this machine and GPU (Remotion chrome-headless-shell, ANGLE D3D11, RTX A1000); other GPUs/drivers differ slightly: never mix frames of one shot",
    "cesium": "pixel-identical on this machine and GPU (Remotion chrome-headless-shell, ANGLE D3D11, RTX A1000); other GPUs/drivers differ slightly: never mix frames of one shot",
    "leafmap": "pixel-identical on this machine and GPU (Remotion chrome-headless-shell, ANGLE D3D11, RTX A1000); other GPUs/drivers differ slightly: never mix frames of one shot",
    "qgis": "pixel-identical on one machine (QgsMapRendererParallelJob -> QImage)",
    "arcgis": "pixel tolerance (arcpy ExportToPNG); mean|d| <= 0.5/255",
    "gee": "server-rendered thumbnail: same request -> same pixels while the asset is unchanged",
    "rustgis": "pixel tolerance; mean|d| <= 0.5/255",
}


def load_recipe(path: Path) -> dict:
    r = yaml.safe_load(path.read_text(encoding="utf-8"))
    r.setdefault("name", path.stem)
    return r


def recipe_hash(r: dict) -> str:
    core = {k: v for k, v in r.items() if k not in ("out", "notes", "description")}
    return sha256_text(json.dumps(core, sort_keys=True, default=str))


def tool_available(tool: str) -> tuple[bool, str]:
    env, mod, _ = TOOLS[tool]
    launcher = ENVS.get(env) or []
    if not launcher or not Path(launcher[0]).exists():
        return False, f"environment '{env}' not found ({launcher[0] if launcher else 'no launcher'})"
    if tool in ("maplibre", "deckgl", "cesium"):
        nm = REPO / "tools" / "maptools" / "js" / "node_modules"
        if not nm.exists():
            return False, "tools/maptools/js/node_modules missing: run install.py --step js"
    if not (ADAPTERS / mod).exists():
        return False, f"adapter {mod} missing"
    return True, "ok"


def outputs_for(r: dict, tool: str, out_dir: Path, nframes: int) -> list[str]:
    name, kind = r["name"], r.get("kind", "png")
    if kind in ("png_sequence", "timelapse"):
        return [str(out_dir / "frames" / f"{name}_{i:04d}.png") for i in range(nframes)]
    if kind == "before_after":
        return [str(out_dir / f"{name}_before.png"), str(out_dir / f"{name}_after.png")]
    if kind == "timeseries":
        return [str(out_dir / f"{name}.csv")]
    suffix = {"png": "", "texture": "_texture", "heightmap": "_height"}.get(kind, "")
    if nframes > 1:
        return [str(out_dir / f"{name}{suffix}_{i:04d}.png") for i in range(nframes)]
    return [str(out_dir / f"{name}{suffix}.png")]


def render(recipe: dict, tool: str | None = None, out_dir: Path | None = None, quiet: bool = False,
           timeout: int = 900, fresh: bool = False) -> dict:
    """Render ``recipe`` with ``tool`` (default: the recipe's ``tool``). Returns the sidecar dict."""
    import prep

    r = copy.deepcopy(recipe)
    tool = tool or (r["tool"][0] if isinstance(r["tool"], list) else r["tool"])
    r["tool"] = tool
    if tool not in TOOLS:
        raise SystemExit(f"unknown tool {tool!r}; known: {', '.join(TOOLS)}")
    ok, why = tool_available(tool)
    if not ok:
        raise RuntimeError(f"{tool}: {why}")
    tool_overrides = (r.get("per_tool") or {}).get(tool, {})
    for k, v in tool_overrides.items():               # e.g. per_tool: {pygmt: {projection: {...}}}
        r[k] = v
    h = recipe_hash(r)
    d0 = disk()
    t0 = time.time()
    prep_h = recipe_hash({k: v for k, v in r.items() if k not in ("tool", "per_tool")})
    work = SCRATCH / f"{r['name']}_{prep_h[:12]}"      # shared by every tool rendering the same recipe
    cached = work / "job.json"
    if r.get("gee") or r.get("gibs") or r.get("stac"):  # cheap: always rebuilt (the G: archive holds the data)
        job = prep.prepare_remote(r, work)
    elif cached.exists() and not fresh:           # same recipe hash -> same prepared files
        job = json.loads(cached.read_text(encoding="utf-8"))
    else:
        job = prep.prepare(r, work)
    t_prep = time.time() - t0
    out_dir = Path(out_dir or r.get("out") or OUT / r["name"] / tool)
    if not out_dir.is_absolute():
        out_dir = REPO / out_dir
    redirected = None
    if tool in G_ONLY and not str(out_dir).upper().startswith("G:"):
        # user rule 2026-10-27: everything exported from Earth Engine (and other remote archives) lives on G:
        try:
            rel = out_dir.relative_to(OUT)
        except ValueError:
            rel = Path(r["name"]) / tool
        redirected, out_dir = str(out_dir), G_OUT / rel
    job["outputs"] = outputs_for(r, tool, out_dir, len(job["frames"]))
    for o in job["outputs"]:
        Path(o).parent.mkdir(parents=True, exist_ok=True)
    jp = work / f"job_{tool}.json"
    write_json(jp, job)
    env, mod, _ = TOOLS[tool]
    cmd = [*ENVS[env], str(ADAPTERS / mod), str(jp), tool]
    t1 = time.time()
    p = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout, cwd=str(work), env=env_vars(env))
    t_tool = time.time() - t1
    res_path = work / f"result_{tool}.json"
    if p.returncode != 0 or not res_path.exists():
        msg = (p.stderr or "")[-3000:] + (p.stdout or "")[-1500:]
        raise RuntimeError(f"{tool} adapter failed (rc={p.returncode}):\n{msg}")
    res = json.loads(res_path.read_text(encoding="utf-8"))
    outs = [Path(o) for o in res["outputs"]]
    side = {
        "recipe_name": r["name"], "recipe_sha256": h, "recipe": r, "tool": tool, "tool_version": res["tool_version"],
        "environment": ENVS[env][0], "kind": job["kind"], "data": job["provenance"],
        "credit_line": "; ".join(dict.fromkeys(f"{d['credit']} ({d['licence']})" for d in job["provenance"])),
        "licence_flags": res.get("licence_flags", []) + [
            f"{d['path']}: {d['licence']} -> {d.get('licence_status')}" for d in job["provenance"]
            if not str(d.get("licence_status", "ok")).startswith("ok")],
        "licences": [{"dataset": d["path"], "licence": d["licence"], "status": d.get("licence_status", "ok"),
                      "credit": d["credit"]} for d in job["provenance"]],
        "remote_requests": res.get("requests", []),
        "outputs": [{"path": str(o), "frame_label": (job["frames"][i]["label"] if i < len(job["frames"]) else ""),
                     **(pixel_stats(o) if o.suffix == ".png" else {})} for i, o in enumerate(outs)],
        "determinism": DETERMINISM.get(tool, ""), "notes": res.get("notes", []),
        "timing_s": {"prep": round(t_prep, 2), "tool_total": round(t_tool, 2), "tool_inner": res.get("seconds")},
        "out_dir": str(out_dir), "redirected_from": redirected,
        "workdir": str(work), "rendered": dt.datetime.now().isoformat(timespec="seconds"),
        "disk_before": d0, "disk_after": disk(),
    }
    if job["kind"] in ("png_sequence", "timelapse"):
        sc = outs[0].parent.parent / f"{r['name']}_sequence.json"
    elif job["kind"] == "before_after":
        sc = outs[0].parent / f"{r['name']}_before_after.json"
    else:
        sc = outs[0].with_suffix(".json")
    if job["kind"] == "heightmap":
        side["heightmap"] = {k: job["frames"][0][k] for k in ("zmin", "zmax", "encoding")}
        side["bounds"] = job["bounds"]
    side["sidecar"] = str(sc)
    write_json(sc, side)
    if not quiet:
        print(f"[maptools] {tool}: {len(outs)} file(s) -> {outs[0]}  ({t_tool:.1f} s tool, {t_prep:.1f} s prep)")
        print(f"[maptools] sidecar {sc}")
        print(f"[maptools] disk C: {side['disk_after']['C_free_gb']} GB, G: {side['disk_after']['G_free_gb']} GB")
    return side


def check_determinism(recipe: dict, tool: str | None) -> dict:
    a = render(recipe, tool, quiet=True)
    first = [Path(o["path"]) for o in a["outputs"]]
    keep = [f.with_name(f.stem + "__run1" + f.suffix) for f in first]
    for f, k in zip(first, keep):
        k.write_bytes(f.read_bytes())
    b = render(recipe, tool, quiet=True)
    rep = []
    for o1, o2 in zip(keep, [Path(o["path"]) for o in b["outputs"]]):
        same_bytes = o1.read_bytes() == o2.read_bytes()
        rep.append({"file": str(o2), "same_bytes": same_bytes, **pixel_diff(o1, o2)})
        o1.unlink()
    print(json.dumps(rep, indent=1))
    return {"runs": rep}


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("recipe", nargs="?")
    ap.add_argument("--tool")
    ap.add_argument("--out")
    ap.add_argument("--check", action="store_true", help="render twice and compare (determinism)")
    ap.add_argument("--list", action="store_true")
    ap.add_argument("--fresh", action="store_true", help="redo the data preparation even if cached")
    a = ap.parse_args()
    if a.list or not a.recipe:
        for t, (env, mod, what) in TOOLS.items():
            ok, why = tool_available(t)
            print(f"{t:9s} {'OK ' if ok else 'N/A'} env={env:6s} {what}" + ("" if ok else f"  [{why}]"))
        return
    r = load_recipe(Path(a.recipe))
    if a.check:
        check_determinism(r, a.tool)
    else:
        render(r, a.tool, Path(a.out) if a.out else None, fresh=a.fresh)


if __name__ == "__main__":
    main()
