"""fix loop 1 (#5c): contact sheets (2 x 2, 960 px stills with a label) of the changed moments in <S>/rf1_look.txt from stills TAG ->
reports/movies/ch00_coordinates_sphere/fix1/sheet_NN.jpg. usage: rf1_sheets.py TAG"""
import sys
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[4]
S = Path("G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_sphere/build1")
OUT = ROOT / "reports/movies/ch00_coordinates_sphere/fix1"


def main() -> int:
    tag = sys.argv[1]
    OUT.mkdir(parents=True, exist_ok=True)
    rows = [ln.split("\t") for ln in (S / "rf1_look.txt").read_text(encoding="utf-8").splitlines() if ln.strip()]
    for n in range(0, len(rows), 4):
        sheet = Image.new("RGB", (1920, 1080 + 60), (20, 20, 30))
        d = ImageDraw.Draw(sheet)
        for i, (fr, lab) in enumerate(rows[n:n + 4]):
            p = S / "stills" / tag / f"f{int(fr):05d}.jpg"
            x, y = (i % 2) * 960, (i // 2) * 570
            if p.exists():
                sheet.paste(Image.open(p).convert("RGB").resize((960, 540)), (x, y + 30))
            d.text((x + 8, y + 6), f"{fr} ({int(fr) / 30:.1f} s) {lab}", fill=(255, 220, 80))
        sheet.save(OUT / f"sheet_{n // 4:02d}.jpg", quality=85)
    print(f"{(len(rows) + 3) // 4} sheets -> {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
