"""Render review stills of the cross-product movie.
usage: st.py OUTNAME spec [spec ...] [--nobundle]
spec: "k" (all sentence ends of scene k), "k:j" (end of sentence j), "k:jm" (middle of sentence j), "k:js" (start + 15),
      "@F" (absolute frame F). Sentence ends are end − 6 frames (build complete).
Bundles once into G:/…/v1/bundle_fl1 (unless --nobundle), renders into G:/…/v1/fl1/OUTNAME/fNNNNN.jpg and prints a map."""
import json, subprocess, sys
from pathlib import Path

ROOT = Path(r"C:\Users\sislam27\Work\Climate Dynamics PHD\AOFD Vallis")
SCR = Path(r"G:\Geophysical Fluid Dynamics\aofd-data\scratch\movies\ch00_cross_product_why\v1")
t = json.load(open(ROOT / "movies/ch00/ch00_cross_product_why/timing.json", encoding="utf-8"))
sc = t["scenes"]


def frames(spec: str) -> list[tuple[int, str]]:
    if spec.startswith("@"):
        return [(int(spec[1:]), spec)]
    if ":" not in spec:
        k = int(spec)
        return [(round(x["end"] * 30) - 6, f"s{k:02d}_S{j:02d}") for j, x in enumerate(sc[k]["sentences"])]
    k, j = spec.split(":")
    k = int(k)
    mode = "e"
    if j[-1] in "ms":
        mode, j = j[-1], j[:-1]
    x = sc[k]["sentences"][int(j)]
    if mode == "m":
        return [(round((x["start"] + x["end"]) / 2 * 30), f"s{k:02d}_S{int(j):02d}m")]
    if mode == "s":
        return [(round(x["start"] * 30) + 15, f"s{k:02d}_S{int(j):02d}s")]
    return [(round(x["end"] * 30) - 6, f"s{k:02d}_S{int(j):02d}")]


if __name__ == "__main__":
    out = sys.argv[1]
    specs = [a for a in sys.argv[2:] if not a.startswith("--")]
    fr = [p for s in specs for p in frames(s)]
    outdir = SCR / "fl1" / out
    outdir.mkdir(parents=True, exist_ok=True)
    (outdir / "map.json").write_text(json.dumps({f"f{f:05d}.jpg": n for f, n in fr}, indent=0))
    tools = ROOT / "movies/out/ch00/ch00_cross_product_why/_tools/stills.mjs"
    if "--nobundle" in sys.argv:
        args = ["node", str(tools), str(SCR / "bundle_fl1"), str(SCR / "public_stills"), str(outdir), ",".join(str(f) for f, _ in fr)]
    else:
        args = ["node", str(tools), "--bundle", str(SCR / "public_stills"), str(outdir), ",".join(str(f) for f, _ in fr), "--bundle-out", str(SCR / "bundle_fl1")]
    r = subprocess.run(args, cwd=ROOT / "movies", capture_output=True, text=True, shell=False)
    print(r.stdout[-3000:], r.stderr[-3000:])
    for f, n in fr:
        print(f"f{f:05d}.jpg  {n}")
