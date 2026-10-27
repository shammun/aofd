"""The one browser for every browser-based adapter (MapLibre, deck.gl, Cesium, leafmap, three.js pages).

User decision 2026-10-27: Remotion's own ``chrome-headless-shell.exe`` (``movies/node_modules/.remotion/...``, read
only; Windows set to run it on the RTX A1000) with ``--use-angle=d3d11``, the same build and GPU the movies render
with. The WebGL renderer string is read from the page and recorded in the sidecar. If WebGL falls back to a software
renderer (SwiftShader / "Basic Render" / llvmpipe), the render **fails loudly**: there is no silent fallback.
``MAPTOOLS_GL=swiftshader`` is an explicit opt-in (machine-independent pixels, slower) and is stated in the sidecar.
"""
from __future__ import annotations

import os
from pathlib import Path

REPO = Path(__file__).resolve().parents[3]
SHELL = (REPO / "movies" / "node_modules" / ".remotion" / "chrome-headless-shell" / "win64"
         / "chrome-headless-shell-win64" / "chrome-headless-shell.exe")
COMMON = ["--force-color-profile=srgb", "--font-render-hinting=none", "--disable-lcd-text", "--ignore-gpu-blocklist",
          "--enable-gpu-rasterization", "--disable-gpu-sandbox"]
SOFTWARE = ("swiftshader", "basic render", "llvmpipe", "software", "microsoft basic")

RENDERER_JS = """() => {
  const c = document.createElement('canvas');
  const gl = c.getContext('webgl2') || c.getContext('webgl');
  if (!gl) return 'NO WEBGL';
  const e = gl.getExtension('WEBGL_debug_renderer_info');
  return e ? gl.getParameter(e.UNMASKED_RENDERER_WEBGL) + ' | ' + gl.getParameter(e.UNMASKED_VENDOR_WEBGL)
           : gl.getParameter(gl.RENDERER);
}"""


def mode() -> str:
    return "swiftshader" if os.environ.get("MAPTOOLS_GL") == "swiftshader" else "gpu"


def launch(pw):
    if not SHELL.exists():
        raise SystemExit(f"Remotion chrome-headless-shell not found at {SHELL} (run npm ci in movies/)")
    if mode() == "swiftshader":
        args = COMMON + ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"]
    else:
        args = COMMON + ["--use-gl=angle", "--use-angle=d3d11"]
    return pw.chromium.launch(headless=True, executable_path=str(SHELL), args=args)


def check_renderer(page) -> str:
    """Return the WebGL renderer string; raise if a GPU was required and a software renderer is in use."""
    r = page.evaluate(RENDERER_JS)
    if mode() == "gpu" and (r == "NO WEBGL" or any(s in r.lower() for s in SOFTWARE)):
        raise SystemExit(f"GPU WebGL not available (renderer: {r!r}). Not falling back silently. Check the "
                         f"Windows graphics setting for {SHELL.name} or set MAPTOOLS_GL=swiftshader explicitly.")
    return r
