"""M9/M10 automated scan: for every scene, the final-state frame (last sentence end − 6) and two mid-build frames
(1/3 and 2/3 of the scene), rendered as stills; count pixels that differ from the background #171f33 by more than 28
(max channel) inside the caption band y 880–1040 and within 20 px of the frame edges.
usage: scan_stills.py OUTNAME [--nobundle] [--only k,k,...]   (writes scan.json next to the stills)"""
import json, sys
from pathlib import Path
import numpy as np
from PIL import Image
sys.path.insert(0, str(Path(__file__).parent))
import stills as st  # noqa: E402

BG = np.array([23, 31, 51], dtype=np.int16)
TH = 28


def frames_for_scan(only=None):
    out = []
    for k, s in enumerate(st.sc):
        if only and k not in only:
            continue
        a = round(s["start"] * 30) if k else 0
        e = round(s["sentences"][-1]["end"] * 30) - 6
        b = round(st.sc[k + 1]["start"] * 30) if k + 1 < len(st.sc) else e + 70
        out += [(a + (e - a) // 3, f"s{k:02d}_m1"), (a + 2 * (e - a) // 3, f"s{k:02d}_m2"), (e, f"s{k:02d}_end")]
    return out


def analyse(path: Path):
    im = np.asarray(Image.open(path).convert("RGB")).astype(np.int16)
    d = np.abs(im - BG).max(axis=2) > TH
    band = int(d[880:1040, :].sum())
    edge = np.zeros_like(d)
    edge[:20, :] = True; edge[-20:, :] = True; edge[:, :20] = True; edge[:, -20:] = True
    edges = int((d & edge).sum())
    ys, xs = np.nonzero(d[880:1040, :])
    bb = [int(xs.min()), int(ys.min()) + 880, int(xs.max()), int(ys.max()) + 880] if band else None
    return band, edges, bb


if __name__ == "__main__":
    out = sys.argv[1]
    only = None
    if "--only" in sys.argv:
        only = {int(x) for x in sys.argv[sys.argv.index("--only") + 1].split(",")}
    fr = frames_for_scan(only)
    specs = [f"@{f}" for f, _ in fr]
    sys.argv = [sys.argv[0], out] + specs + (["--nobundle"] if "--nobundle" in sys.argv else [])
    outdir = st.SCR / "fl1" / out
    import subprocess
    tools = st.ROOT / "movies/out/ch00/ch00_cross_product_why/_tools/stills.mjs"
    outdir.mkdir(parents=True, exist_ok=True)
    if "--nobundle" in sys.argv:
        args = ["node", str(tools), str(st.SCR / "bundle_fl1"), str(st.SCR / "public_stills"), str(outdir), ",".join(str(f) for f, _ in fr)]
    else:
        args = ["node", str(tools), "--bundle", str(st.SCR / "public_stills"), str(outdir), ",".join(str(f) for f, _ in fr), "--bundle-out", str(st.SCR / "bundle_fl1")]
    r = subprocess.run(args, cwd=st.ROOT / "movies", capture_output=True, text=True)
    if "ERROR" in r.stdout:
        print(r.stdout[-2000:])
    rows = []
    for f, n in fr:
        p = outdir / f"f{f:05d}.jpg"
        if not p.exists():
            rows.append({"frame": f, "name": n, "missing": True}); continue
        band, edges, bb = analyse(p)
        rows.append({"frame": f, "name": n, "band_px": band, "edge_px": edges, "band_bbox": bb})
    (outdir / "scan.json").write_text(json.dumps(rows, indent=1))
    bad = [r for r in rows if r.get("missing") or r["band_px"] > 0 or r["edge_px"] > 0]
    print(f"{len(rows)} frames scanned, {len(bad)} with pixels in the caption band or at the edges")
    for r in bad:
        print(r)
