"""One still per scene (last sentence end) from a label-check run, tiled 3 x 3. usage: scene_sheets.py <labels/TAG dir> [mid]"""
import json, sys
from pathlib import Path
from PIL import Image, ImageDraw
ROOT = Path(__file__).resolve().parents[2]
t = json.load(open(ROOT / "movies/ch00/ch00_weather_basics/timing.json", encoding="utf-8"))
d = Path(sys.argv[1]); out = d / "scenes"; out.mkdir(exist_ok=True)
fr = [(s["id"], round(s["sentences"][-1]["end"] * 30) - 6) for s in t["scenes"]]
W = 640
for g in range(0, len(fr), 9):
    sheet = Image.new("RGB", (3 * W, 3 * 360))
    for i, (sid, f) in enumerate(fr[g:g + 9]):
        p = d / f"f{f:05d}.jpg"
        if not p.exists():
            continue
        im = Image.open(p).convert("RGB").resize((W, 360)); ImageDraw.Draw(im).text((6, 4), sid, fill=(255, 255, 0))
        sheet.paste(im, ((i % 3) * W, (i // 3) * 360))
    sheet.save(out / f"sc_{g // 9:02d}.png")
print(out)
