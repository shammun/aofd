"""ch00_coordinates_sphere (#5c) remake 2026-11-07, user rule "show it, don't voice it" (memory dont-voice-simple-arithmetic, HOUSE_STYLE
§calculations): simple arithmetic of plain numbers stays ON SCREEN (CalcStack rows unchanged) but is no longer read aloud; the voice names what
is combined and gives the result. Whole-script sweep; ARITH = (scene, old sentence, new sentence). Idempotent (skips rows already applied).
usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_sphere/checks/r7_arith.py [--list]
"""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
SCP = ROOT / "movies/ch00/ch00_coordinates_sphere/script.md"

ARITH: list[tuple[str, str, str]] = [
    ("s07_colatitude", "For Brest, it's ninety minus forty eight point four, which is forty one point six degrees.",
     "For Brest, taking its latitude away from ninety degrees leaves forty one point six degrees."),
    ("s11_longitude", "Then Brest is at three hundred and sixty minus four point five, which is three hundred and fifty five point five degrees.",
     "Then Brest, four and a half degrees short of a full turn, is at three hundred and fifty five point five degrees."),
    ("s15_brest_z", "So z is six thousand three hundred and seventy one times zero point seven four seven eight, which is about four thousand seven hundred and sixty four kilometres.",
     "Multiplying the two, z is about four thousand seven hundred and sixty four kilometres."),
    ("s15_brest_z", "With easy numbers, six thousand four hundred times three quarters is four thousand eight hundred: about the same.",
     "With easy numbers, it comes out at four thousand eight hundred: about the same."),
    ("s16_brest_axis_distance", "So the distance from the axis is six thousand three hundred and seventy one times zero point six six three nine, which is about four thousand two hundred and thirty kilometres.",
     "Times the Earth's radius, six thousand three hundred and seventy one kilometres, the distance from the axis is about four thousand two hundred and thirty kilometres."),
    ("s16_brest_axis_distance", "With easy numbers, six thousand four hundred times two thirds is about four thousand two hundred and seventy: close.",
     "With easy numbers, it's about four thousand two hundred and seventy: close."),
    ("s17_brest_top", "So x is four thousand two hundred and thirty times zero point nine nine six nine, about four thousand two hundred and seventeen kilometres.",
     "So x, the distance from the axis times this cosine, is about four thousand two hundred and seventeen kilometres."),
    ("s17_brest_top", "So y is four thousand two hundred and thirty times minus zero point zero seven eight five, about minus three hundred and thirty two kilometres.",
     "So y, the distance from the axis times this sine, is about minus three hundred and thirty two kilometres."),
    ("s18_position_vector", "Then Pythagoras in the side view: the square root of four thousand two hundred and thirty squared, plus z squared, gives six thousand three hundred and seventy one.",
     "Then Pythagoras in the side view, with that distance and z, gives six thousand three hundred and seventy one."),
    ("s18_position_vector", "First, Pythagoras in the equator plane: the square root of x squared plus y squared gives back the distance from the axis, four thousand two hundred and thirty.",
     "First, Pythagoras in the equator plane: squaring x and y, adding them and taking the square root gives back the distance from the axis, four thousand two hundred and thirty."),
    ("s19_khulna", "So Khulna's height above the equator plane is six thousand three hundred and seventy one times zero point three eight seven five, about two thousand four hundred and sixty nine kilometres.",
     "So Khulna's height above the equator plane, the Earth's radius times this sine, is about two thousand four hundred and sixty nine kilometres."),
    ("s20_spin_rate", "A day of twenty four hours is one thousand four hundred and forty minutes, and one thousand four hundred and forty divided by three hundred and sixty is four minutes for each degree.",
     "A day has one thousand four hundred and forty minutes, so each degree of turn takes four minutes."),
    ("s21_ground_speeds", "So capital Omega is two pi divided by eighty six thousand one hundred and sixty four, which is about seven point two nine two times ten to the minus five radians per second.",
     "So capital Omega, two pi divided by capital T, is about seven point two nine two times ten to the minus five radians per second."),
    ("s21_ground_speeds", "So the ground moves at seven point two nine two times ten to the minus five, times six point three seven one million metres, which is about four hundred and sixty four point six metres per second.",
     "So the ground moves at capital Omega times the Earth's radius, which is about four hundred and sixty four point six metres per second."),
    ("s21_ground_speeds", "With easy numbers, the equator is two pi times six thousand four hundred kilometres, which is about forty thousand kilometres round.",
     "With easy numbers, the equator is about forty thousand kilometres round."),
    ("s21_ground_speeds", "Four hundred and sixty four point six times three point six is also about one thousand six hundred and seventy.",
     "So four hundred and sixty four point six metres per second is also about one thousand six hundred and seventy kilometres per hour."),
    ("s21_ground_speeds", "A passenger jet flies at about nine hundred kilometres per hour, and one thousand six hundred and seventy divided by nine hundred is about one point nine, so the ground at the equator moves almost twice as fast.",
     "A passenger jet flies at about nine hundred kilometres per hour, so the ground at the equator moves almost twice as fast."),
    ("s22_distance_north", "Times six thousand three hundred and seventy one kilometres, that's about one hundred and eleven point two kilometres.",
     "Times the Earth's radius, six thousand three hundred and seventy one kilometres, that's about one hundred and eleven point two kilometres."),
    ("s22_distance_north", "With easy numbers, six thousand four hundred times zero point zero one seven five is one hundred and twelve: about the same.",
     "With easy numbers, it's about one hundred and twelve: about the same."),
    ("s23_north_examples", "One minute of latitude is a sixtieth of a degree, so it's one hundred and eleven point two divided by sixty, which is about one point eight five kilometres.",
     "One minute of latitude is a sixtieth of a degree: about one point eight five kilometres."),
    ("s23_north_examples", "Forty eight point four degrees, times one hundred and eleven point two kilometres per degree, is about five thousand three hundred and eighty two kilometres.",
     "At one hundred and eleven point two kilometres per degree, Brest's forty eight point four degrees come to about five thousand three hundred and eighty two kilometres."),
    ("s24_distance_east", "For one degree at Brest, that's four thousand two hundred and thirty kilometres times zero point zero one seven four five, which is about seventy three point eight kilometres.",
     "For one degree at Brest, the radius of its parallel times one degree in radians gives about seventy three point eight kilometres."),
    ("s28_box_areas", "The radius squared is six thousand three hundred and seventy one squared, about forty point six million square kilometres.",
     "The radius squared is about forty point six million square kilometres."),
    ("s28_box_areas", "Times zero point zero zero four three six, and times zero point zero zero four three six again, that's about seven hundred and seventy three square kilometres, for a box on the equator.",
     "Times that quarter degree in radians, twice, that's about seven hundred and seventy three square kilometres, for a box on the equator."),
    ("s28_box_areas", "At Khulna, seven hundred and seventy three times zero point nine two one nine is about seven hundred and twelve square kilometres.",
     "At Khulna, where cosine phi is zero point nine two one nine, it's about seven hundred and twelve square kilometres."),
    ("s28_box_areas", "At Brest, times zero point six six three nine, it's about five hundred and thirteen.",
     "At Brest, the equator box times Brest's cosine phi is about five hundred and thirteen."),
    ("s28_box_areas", "At Longyearbyen, times zero point two zero four five, it's only about a hundred and fifty eight.",
     "At Longyearbyen, with its much smaller cosine phi, it's only about a hundred and fifty eight."),
    ("s30_slope_of_sine", "So cosine phi times delta phi is zero point nine zero six times zero point one seven four five, about zero point one five eight.",
     "So cosine phi times delta phi is about zero point one five eight."),
    ("s31_adding_strips", "Their steps in sine phi are zero point one seven four, zero point one six eight, and zero point one five eight.",
     "Each strip's step is the sine at its top minus the sine at its bottom."),
    ("s31_adding_strips", "They add up to zero point five, which is exactly the sine of thirty degrees.",
     "Together, they add up to zero point five, which is exactly the sine of thirty degrees."),
    ("s34_global_mean", "So the area-weighted average is thirty times one, plus zero times one half, all divided by one and a half.",
     "So the area-weighted average multiplies each temperature by its weight, adds them up, and divides by the sum of the weights."),
]


def main() -> int:
    if "--list" in sys.argv:
        for sid, a, b in ARITH:
            print(f"| {sid} | {a} | {b} |")
        return 0
    s = SCP.read_text(encoding="utf-8")
    n = 0
    for sid, a, b in ARITH:
        if s.count(a) == 1:
            s = s.replace(a, b); n += 1
        elif s.count(b) >= 1:
            continue
        else:
            print("NOT FOUND", sid, a[:60]); return 1
    SCP.write_text(s, encoding="utf-8")
    print(f"{n} sentences changed ({len(ARITH)} in the list)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
