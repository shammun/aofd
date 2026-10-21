"""aofd — book glue for Vallis, *Atmospheric and Oceanic Fluid Dynamics* (2nd ed., 2017).

Only book-specific glue lives here (chapter parameter sets, notebook helpers, figure wrappers): ``aofd.chNN_<slug>``.
All reusable physics, data access and diagnostics live in the shared library ``fluidpy`` (``fluidpy.geo``,
``fluidpy.data``, ``fluidpy.diag``), so a scratch cell in a notebook never hides a library call behind ``aofd``.
"""
from __future__ import annotations

import os
import sys
from pathlib import Path

__version__ = "0.1.0"

REPO = Path(__file__).resolve().parents[1]


def data_root() -> Path:
    """Where downloaded and derived data live (PLANNING §15.4).

    Order: env ``AOFD_DATA_ROOT`` → ``/content/aofd-data`` on Colab → ``book.yaml -> data.root``
    (``G:/Geophysical Fluid Dynamics/aofd-data`` on the author's machine). Never inside the repository.
    """
    env = os.environ.get("AOFD_DATA_ROOT")
    if env:
        return Path(env)
    if "google.colab" in sys.modules or os.environ.get("COLAB_RELEASE_TAG"):
        return Path("/content/aofd-data")
    try:
        import yaml

        book = yaml.safe_load((REPO / "book.yaml").read_text(encoding="utf-8"))
        return Path(book["data"]["root"])
    except Exception:
        return Path.home() / "aofd-data"


def derived_dir() -> Path:
    """The committed small derived products in the repository (``data/derived``), read by notebooks and Colab."""
    return REPO / "data" / "derived"
