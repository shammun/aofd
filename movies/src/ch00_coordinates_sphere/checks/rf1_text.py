"""ch00_coordinates_sphere (#5c) fix loop 1: the ONE list of re-voiced sentences (review 1 + calculation & sync audit, 2026-11-06).

RF1 = [(item, scene id, old sentence index 0-based in the build-1 timing, [new sentences])]; a trailing " [beat]" keeps a beat.
`python rf1_text.py` writes the new text into script.md and the storyboard voiceovers BEFORE the TTS (so tools/script_wording_lint.py
runs on the final wording); checks/cs_rf1_splice.py then synthesises exactly these sentences (its script.md step sees them already).
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

RF1: list[tuple[str, str, int, list[str]]] = [
    ("M2 calc", "s10_prime_meridian", 12, ["Then it runs south over the open South Atlantic and the Southern Ocean, all the way to Antarctica."]),
    ("S2 rev", "s20_spin_rate", 8, [
        "It's four minutes shorter than a day from noon to noon, because the Earth also moves along its orbit round the Sun.",
        "In a year of three hundred and sixty five days, the Earth goes once round the Sun, so each day it moves about one degree along its orbit.",
        "So from noon to noon, the Earth turns about three hundred and sixty one degrees, not three hundred and sixty.",
        "A day of twenty four hours is one thousand four hundred and forty minutes, and one thousand four hundred and forty divided by three hundred and sixty is four minutes for each degree.",
    ]),
    ("M5 rev", "s20_spin_rate", 12, ["Then, speed is distance divided by time."]),
    ("M5 rev", "s20_spin_rate", 14, ["Now we pull out the part that's the same for every place: two pi divided by capital T."]),
    ("S3 rev", "s21_ground_speeds", 8, [
        "With easy numbers, the equator is two pi times six thousand four hundred kilometres, which is about forty thousand kilometres round.",
        "And forty thousand kilometres in twenty four hours is about one thousand six hundred and seventy kilometres per hour.",
        "To turn metres per second into kilometres per hour, we multiply by three point six, because an hour has three thousand six hundred seconds, and a kilometre has a thousand metres.",
        "Four hundred and sixty four point six times three point six is also about one thousand six hundred and seventy.",
    ]),
    ("S3 rev", "s21_ground_speeds", 9, ["A passenger jet flies at about nine hundred kilometres per hour, and one thousand six hundred and seventy divided by nine hundred "
                                        "is about one point nine, so the ground at the equator moves almost twice as fast."]),
    ("M3 calc", "s21_ground_speeds", 10, ["Singapore, at one point three five degrees north, almost on the equator, has cosine phi zero point nine nine nine seven, "
                                          "so it moves at about four hundred and sixty four metres per second. [beat]"]),
    ("S10 rev", "s33_archimedes", 10, ["But the Earth's surface there is steep, so the strip is wider along the surface than its height, by one over cosine phi."]),
    ("S8 rev", "s34_global_mean", 10, [
        "That's why a global average gives each latitude a weight of cosine phi.",
        "We write the average temperature as T bar.",
        "The Greek capital letter sigma means add up over all the boxes, which we number with the letter j.",
        "So T bar is the sum of cosine phi times the temperature, divided by the sum of the cosines.",
    ]),
]


def main() -> int:
    here = Path(__file__).resolve().parent
    sys.path.insert(0, str(here))
    import revoice  # noqa: E402
    root = here.parents[3]
    mov = root / "movies/ch00/ch00_coordinates_sphere"
    tm = json.loads((mov / "timing.json").read_text(encoding="utf-8"))
    by = {s["id"]: s for s in tm["scenes"]}
    rv: dict[str, dict[int, tuple[str, str]]] = {}
    for _, sid, j, news in RF1:
        old = by[sid]["sentences"][j]["text"]
        new = " ".join(re.sub(r"\s*\[beat\]\s*$", "", n) for n in news)
        rv.setdefault(sid, {})[j] = (old, new)
    for line in revoice.apply_text(mov / "script.md", mov / "storyboard.yaml", revoice=rv):
        print(line)
    return 0


if __name__ == "__main__":
    sys.exit(main())
