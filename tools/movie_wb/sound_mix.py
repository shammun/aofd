"""Soundtrack for ch00_weather_basics: tools/sound/mix.py with a two-style bed ('air-flowing'; 'storm-tense' under the
Ciarán application s54-s59) cross-faded with 4-s raised-cosine ramps (as the capability-test showcase did).
usage: .venv/Scripts/python.exe tools/movie_wb/sound_mix.py <narration.wav> <out dir> [--check]"""
import json
import sys
from pathlib import Path

import numpy as np
import yaml

REPO = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO / "tools" / "sound")); sys.path.insert(0, str(REPO / "tools"))
import styles  # noqa: E402
import mix  # noqa: E402

MOV = REPO / "movies/ch00/ch00_weather_basics"
CUES = MOV / "sound_cues.yaml"
SEC = yaml.safe_load(CUES.read_text(encoding="utf-8"))["music"]["sections"]
STORM = [(float(s["from_s"]), float(s["to_s"])) for s in SEC if s["style"] == "storm-tense"]
_compose, _info = styles.compose, styles.info


def compose(style, duration, seed=7):
    if style != "weather-basics-blend":
        return _compose(style, duration, seed)
    a = _compose("air-flowing", duration, 21).astype(np.float64)
    b = _compose("storm-tense", duration, 22).astype(np.float64)
    n = min(len(a), len(b)); a, b = a[:n], b[:n]
    t = np.arange(n) / getattr(styles, "SR", 44100)
    w = np.zeros(n)
    for t0, t1 in STORM:
        r = 4.0
        up = np.clip((t - (t0 - r / 2)) / r, 0, 1); dn = np.clip(((t1 + r / 2) - t) / r, 0, 1)
        w = np.maximum(w, 0.5 - 0.5 * np.cos(np.pi * np.minimum(up, dn)))
    a /= np.sqrt((a ** 2).mean()) + 1e-12; b /= np.sqrt((b ** 2).mean()) + 1e-12
    wa = w[:, None] if a.ndim == 2 else w
    m = np.sqrt(1 - wa) * a + np.sqrt(wa) * b
    return (0.5 * m / np.abs(m).max()).astype(np.float32)


def info(style):
    if style != "weather-basics-blend":
        return _info(style)
    return {**_info("air-flowing"), "style": "air-flowing + storm-tense (cross-faded)",
            "description": f"storm-tense during {STORM} s (s54-s59), air-flowing elsewhere", "licence": "CC0-1.0",
            "source": "tools/sound/styles.py (procedural synthesis, our own code)"}


styles.compose, styles.info = compose, info
mix.styles = styles
if __name__ == "__main__":
    nar, out = Path(sys.argv[1]), Path(sys.argv[2])
    rep = mix.build(nar, CUES, out, MOV / "timing.json", check_only="--check" in sys.argv)
    print(json.dumps(rep, indent=1, default=str)[:4000])
