"""Tile label-check stills into review sheets (3 × 3 per sheet, frame label on each).
usage: montage.py <stills dir> [--per 9] [--width 640]"""
import sys
from pathlib import Path

from PIL import Image, ImageDraw

d = Path(sys.argv[1])
per = int(sys.argv[sys.argv.index("--per") + 1]) if "--per" in sys.argv else 9
W = int(sys.argv[sys.argv.index("--width") + 1]) if "--width" in sys.argv else 640
fs = sorted(d.glob("f*.jpg"))
cols = 3
for s in range(0, len(fs), per):
    grp = fs[s:s + per]
    ims = [Image.open(p).convert("RGB") for p in grp]
    h = round(W * ims[0].height / ims[0].width)
    rows = (len(ims) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * W, rows * h), (0, 0, 0))
    for i, (p, im) in enumerate(zip(grp, ims)):
        im = im.resize((W, h))
        ImageDraw.Draw(im).text((6, 4), p.stem, fill=(255, 255, 0))
        sheet.paste(im, ((i % cols) * W, (i // cols) * h))
    out = d / f"sheet_{s // per:02d}.png"
    sheet.save(out)
    print(out)
