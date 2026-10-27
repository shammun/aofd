"""Minimal stdio MCP smoke test for GIS MCP servers (RustGIS ``rustgis-cli mcp``, GeoLibre ``geolibre-mcp``).

Speaks JSON-RPC 2.0 over stdio (newline-delimited): initialize -> notifications/initialized -> tools/list ->
optional tools/call. Prints the server info, the tool names and each call's result summary; writes any returned PNG
image content to ``outputs/maptools/mcp/``.

    .venv/Scripts/python.exe tools/maptools/mcp_test.py --server rustgis --data data/derived/ch00/ciaran_coast_10m.geojson
    .venv/Scripts/python.exe tools/maptools/mcp_test.py --server geolibre
"""
from __future__ import annotations

import argparse
import base64
import json
import subprocess
import sys
import threading
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import DATA, OUT, REPO  # noqa: E402

SERVERS = {
    "rustgis": [str(DATA / "envs" / "rustgis-0.4.0" / "RustGIS-0.4.0-windows-x86_64" / "rustgis-cli.exe"), "mcp"],
    "geolibre": [str(REPO / ".venv-maps" / "Scripts" / "geolibre-mcp.exe"), "--root",
                 str(DATA / "scratch" / "geolibre_mcp")],
}


class Client:
    def __init__(self, cmd):
        self.p = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                                  text=True, encoding="utf-8", bufsize=1)
        self.n = 0
        self.err: list[str] = []
        threading.Thread(target=self._drain, daemon=True).start()

    def _drain(self):
        for line in self.p.stderr:
            self.err.append(line.rstrip())

    def send(self, method, params=None, notify=False):
        msg = {"jsonrpc": "2.0", "method": method}
        if params is not None:
            msg["params"] = params
        if not notify:
            self.n += 1
            msg["id"] = self.n
        self.p.stdin.write(json.dumps(msg) + "\n")
        self.p.stdin.flush()
        if notify:
            return None
        t0 = time.time()
        while time.time() - t0 < 120:
            line = self.p.stdout.readline()
            if not line:
                raise RuntimeError(f"server closed; stderr: {self.err[-5:]}")
            try:
                r = json.loads(line)
            except json.JSONDecodeError:
                continue
            if r.get("id") == self.n:
                return r
        raise TimeoutError(method)

    def close(self):
        try:
            self.p.stdin.close()
            self.p.wait(timeout=10)
        except Exception:  # noqa: BLE001
            self.p.kill()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--server", choices=list(SERVERS), default="rustgis")
    ap.add_argument("--data", action="append", default=[])
    ap.add_argument("--call", default=None, help="tool name to call after list (default: list_layers + view_map)")
    a = ap.parse_args()
    cmd = list(SERVERS[a.server])
    for d in a.data:
        cmd += ["--data", str((REPO / d) if not Path(d).is_absolute() else Path(d))]
    c = Client(cmd)
    report = {"server": a.server, "cmd": cmd}
    r = c.send("initialize", {"protocolVersion": "2025-06-18", "capabilities": {},
                              "clientInfo": {"name": "aofd-mcp-test", "version": "0.1"}})
    report["serverInfo"] = r.get("result", {}).get("serverInfo")
    report["protocol"] = r.get("result", {}).get("protocolVersion")
    c.send("notifications/initialized", notify=True)
    tl = c.send("tools/list", {})
    tools = tl.get("result", {}).get("tools", [])
    report["tools"] = [t["name"] for t in tools]
    calls = [a.call] if a.call else [n for n in ("list_layers", "view_map") if n in report["tools"]]
    out_dir = OUT / "mcp"
    out_dir.mkdir(parents=True, exist_ok=True)
    report["calls"] = {}
    for name in calls:
        t0 = time.time()
        res = c.send("tools/call", {"name": name, "arguments": {}})
        summ = []
        for item in res.get("result", {}).get("content", []):
            if item.get("type") == "image":
                p = out_dir / f"{a.server}_{name}.png"
                p.write_bytes(base64.b64decode(item["data"]))
                summ.append(f"image -> {p}")
            elif item.get("type") == "text":
                summ.append(item["text"][:300])
        report["calls"][name] = {"seconds": round(time.time() - t0, 2), "isError": res.get("result", {}).get(
            "isError", "error" in res), "content": summ or res.get("error")}
    c.close()
    report["stderr_tail"] = c.err[-5:]
    print(json.dumps(report, indent=1))


if __name__ == "__main__":
    main()
