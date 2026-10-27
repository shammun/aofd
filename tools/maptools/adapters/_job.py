"""Stdlib-only helpers shared by every adapter (they run in different Python environments)."""
from __future__ import annotations

import json
import sys
import time
from pathlib import Path


def load() -> tuple[dict, str]:
    """``python adapter.py JOB.json TOOL`` -> (job dict, tool name)."""
    job = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    tool = sys.argv[2] if len(sys.argv) > 2 else ""
    job["_t0"] = time.time()
    return job, tool


def done(job: dict, tool: str, version: str, outputs: list[str], notes: list[str] | None = None,
         licence_flags: list[str] | None = None) -> None:
    res = {"tool": tool, "tool_version": version, "outputs": outputs, "notes": notes or [],
           "licence_flags": licence_flags or [], "seconds": round(time.time() - job["_t0"], 2)}
    Path(job["workdir"], f"result_{tool}.json").write_text(json.dumps(res, indent=1), encoding="utf-8")
    print(json.dumps(res))


def hexrgb(h: str) -> tuple[int, int, int]:
    return int(h[1:3], 16), int(h[3:5], 16), int(h[5:7], 16)


def proj(job: dict) -> dict:
    p = job.get("projection") or {}
    if isinstance(p, str):
        p = {"name": p}
    b = job["bounds"]
    p.setdefault("name", "platecarree")
    p.setdefault("lon0", (b[0] + b[2]) / 2)
    p.setdefault("lat0", (b[1] + b[3]) / 2)
    return p
