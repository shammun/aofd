"""Show a standalone full-window 3-D scene (``scenes/chNN/<slug>.html``, PLANNING §15.1) in a notebook.

``fluidpy.core.embed.show_viz`` shows explainers from ``viz/``; scenes live in their own folder, so this small wrapper
does the same job for them: locally (Jupyter, VS Code) the file is inlined into an ``<iframe srcdoc>``; on Colab, where
the repository clone may lack the file or the browser blocks large srcdoc pages, it loads the GitHub Pages copy.
"""
from __future__ import annotations

import html
import re
import sys

from aofd import REPO


def _site_url() -> str:
    try:
        import yaml

        return yaml.safe_load((REPO / "book.yaml").read_text(encoding="utf-8"))["project"]["site_url"].rstrip("/")
    except Exception:
        return "https://shammun.github.io/aofd"


def scene_html(chapter: str, slug: str, height: str = "86vh") -> str:
    """The iframe HTML for ``scenes/<chapter>/<slug>.html`` (srcdoc locally, the Pages URL on Colab)."""
    if not re.fullmatch(r"[A-Za-z0-9_\-]+", chapter) or not re.fullmatch(r"[A-Za-z0-9_\-]+", slug):
        raise ValueError(f"bad chapter/slug: {chapter!r}/{slug!r}")
    rel = f"scenes/{chapter}/{slug}.html"
    url = f"{_site_url()}/{rel}"
    local = REPO / rel
    style = f"width:100%;height:{height};border:1px solid #e3e6ee;border-radius:12px"
    bar = (f'<div style="font:500 13px/1.3 sans-serif;padding:4px 2px">🌐 3-D scene · '
           f'<a href="{url}" target="_blank" rel="noopener">open full window ↗</a></div>')
    if "google.colab" in sys.modules or not local.is_file():
        return f'{bar}<iframe src="{url}" style="{style}" allow="fullscreen"></iframe>'
    doc = html.escape(local.read_text(encoding="utf-8"), quote=True)
    return f'{bar}<iframe srcdoc="{doc}" style="{style}" allow="fullscreen"></iframe>'


def show_scene(chapter: str, slug: str, height: str = "86vh") -> None:
    """Display the scene in the current notebook output."""
    from IPython.display import HTML, display

    display(HTML(scene_html(chapter, slug, height)))


__all__ = ["scene_html", "show_scene"]
