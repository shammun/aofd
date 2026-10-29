"""UF1 fix loop 1: render review stills of the changed scenes from the prebuilt bundle (GPU ANGLE, ports 5600-5700).
usage: .venv/Scripts/python.exe tools/movie_wb/stills_uf1fix1.py <bundle> <out dir> [labels,…] [--port0 5600] [--jobs 2]
Frames are placed by scene id + sentence index + fraction of the sentence (from timing.json), so they track re-timings."""
from __future__ import annotations

import json
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
TM = json.loads((ROOT / "movies/ch00/ch00_weather_basics/timing.json").read_text(encoding="utf-8"))
S = {s["id"]: s for s in TM["scenes"]}
FPS = TM["fps"]
# label: (scene, sentence index or None for scene start, fraction of the sentence / seconds after the scene start)
SHOTS = {
    "s01_spin": ("s01_hook", 1, 0.2), "s01_ring": ("s01_hook", 1, 0.95), "s01_end": ("s01_hook", None, -1.0),
    "s02_zoom": ("s02_thin_shell", 2, 0.8), "s02_wedge": ("s02_thin_shell", 3, 0.95), "s02_shell": ("s02_thin_shell", 9, 0.9),
    "s03_fly": ("s03_air_parcel", 5, 0.5), "s03_xf": ("s03_air_parcel", 6, 0.1), "s03_land": ("s03_air_parcel", 7, 0.3), "s03_land2": ("s03_air_parcel", 7, 0.9),
    "s03_end": ("s03_air_parcel", None, -0.6),
    "s13_area": ("s13_slab", None, -2.0), "s14_start": ("s14_slab_weight", None, 1.5),
    "s18_start": ("s18_scale_height", None, 1.5), "s18_units": ("s18_scale_height", 6, 0.9),
    "s19_inset": ("s19_exponential", 6, 0.8), "s19b_start": ("s19b_integrate", None, 1.5), "s19b_lnp": ("s19b_integrate", 3, 0.5),
    "s20b_start": ("s20b_per_km", None, 1.5), "s20b_bars": ("s20b_per_km", 7, 0.95), "s20c_start": ("s20c_equal_slabs", None, 1.5),
    "s20c_matt": ("s20c_equal_slabs", 5, 0.8), "s20d_start": ("s20d_halving", None, 1.5),
    "s21_balloon": ("s21_balloon_pressure", 3, 0.5), "s23_src": ("s23_troposphere", None, -2.0), "s24_src": ("s24_stratosphere", None, -2.0),
    "s25_sing": ("s25_tropics", 2, 0.5), "s25_pole": ("s25_tropics", 4, 0.9),
    "s27b_keys": ("s27b_vapour_pressure", 3, 0.5), "s27b_boxes": ("s27b_vapour_pressure", 8, 0.8), "s27b_end": ("s27b_vapour_pressure", None, -1.0),
    "s31_src": ("s31_cloud_base", None, -2.0), "s32_src": ("s32_wind_vector", None, 3.0), "s36_kw": ("s36_weather_climate", None, -2.0),
    "s38_band": ("s38_reanalysis", 6, 0.5), "s39_close": ("s39_surface_pressure", None, -1.5),
    "s45_names": ("s45_air_masses", 3, 0.98), "s45_map": ("s45_air_masses", None, -1.0), "s46_bar": ("s46_fronts", None, 4.0),
    "s47_top": ("s47_cold_front", 1, 0.95), "s47_side": ("s47_cold_front", 3, 0.7), "s47_tri": ("s47_cold_front", 5, 0.9),
    "s47_wind": ("s47_cold_front", 7, 0.8), "s48_start": ("s48_warm_front", None, 1.0), "s48_tri": ("s48_warm_front", 2, 0.9),
    "s48_wind": ("s48_warm_front", 4, 0.8), "s48_true": ("s48_warm_front", 5, 0.95), "s49_src": ("s49_real_fronts", None, 3.0),
    "s53_links": ("s53_trades_westerlies", 4, 0.9), "s55_src": ("s55_ciaran_maps", None, 3.0), "s58_calc": ("s58_brest_cold_front", 2, 0.95),
}


def frame(sid: str, j, x: float) -> int:
    sc = S[sid]
    if j is None:
        t = sc["start"] + x if x >= 0 else sc["end"] + x
    else:
        s = sc["sentences"][j]
        t = s["start"] + (s["end"] - s["start"]) * x
    return int(round(t * FPS))


def main() -> int:
    a = [x for x in sys.argv[1:] if not x.startswith("--")]
    opt = lambda k, d: sys.argv[sys.argv.index(k) + 1] if k in sys.argv else d  # noqa: E731
    bundle, out = Path(a[0]), Path(a[1])
    labels = a[2].split(",") if len(a) > 2 and a[2] != "all" else list(SHOTS)
    port0, jobs = int(opt("--port0", "5600")), int(opt("--jobs", "2"))
    out.mkdir(parents=True, exist_ok=True)

    def one(i_lab):
        i, lab = i_lab
        fr = frame(*SHOTS[lab])
        dst = out / f"{lab}_{fr}.png"
        cmd = (f'npx remotion still "{bundle}" Ch00WeatherBasics "{dst}" --frame={fr} --port={port0 + (i % 90)} --gl=angle --log=error')
        r = subprocess.run(cmd, cwd=ROOT / "movies", shell=True, capture_output=True, text=True, encoding="utf-8", errors="replace")
        return lab, fr, r.returncode, (r.stderr or r.stdout)[-300:]
    with ThreadPoolExecutor(jobs) as ex:
        for lab, fr, rc, tail in ex.map(one, enumerate(labels)):
            print(f"{lab} frame {fr}: {'ok' if rc == 0 else 'FAIL ' + tail}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
