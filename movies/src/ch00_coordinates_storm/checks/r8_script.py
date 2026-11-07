"""ch00_coordinates_storm (#5b) pass r8, 2026-11-07: "show it, don't voice it" (user rule 2026-11-07, HOUSE_STYLE §5 calculations;
memory dont-voice-simple-arithmetic) + the user's clarification (relate the numbers in the voice: say what is combined and where each
number comes from, then the result; never read out the individual products / sums / sign rules that the screen shows).

Every sentence below is replaced in script.md (exact text, found exactly once, its [beat] mark kept). The sentence COUNT of every
scene is unchanged, so SS(k, j) / SE(k, j) indices stay valid; AT phrases that the new text no longer contains are re-pointed in the
scene files (see R8_AT below, applied by hand and checked by at_check.mjs). On-screen content is unchanged.

usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_storm/checks/r8_script.py [--write] [--log]
  --write  rewrite script.md         --log  print the markdown old -> new table for the remake log
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
MOV = ROOT / "movies/ch00/ch00_coordinates_storm"
SCP = MOV / "script.md"

# (scene, sentence index, old, new, why)
R8: list[tuple[str, int, str, str, str]] = [
    ("s00_title", 0,
     "In this video, we'll learn how turning arrows and cylindrical coordinates work, and see how meteorology uses them to look inside a "
     "tropical cyclone, and to measure how its winds push the sea onto the coast.",
     "In this video, we'll learn how turning arrows and cylindrical coordinates work, and see how they're used to look inside a tropical "
     "cyclone, and to measure how its winds push the sea onto the coast.",
     "user rule for openings 2026-11-07: 'see how they're used to …', not 'how meteorology uses them'"),
    ("s03_tip_on_circle", 14,
     "So the tip slides a distance of one times delta theta, which is just delta theta.",
     "So the tip slides a distance of just delta theta.",
     "one × Δθ not read out (radius one said in S13)"),
    ("s04_slopes_sin_cos", 12,
     "The cosine drops from zero point six zero zero to zero point five nine two, a change of minus zero point zero zero eight.",
     "The cosine drops from zero point six zero zero to zero point five nine two.",
     "the subtraction stays on screen"),
    ("s04_slopes_sin_cos", 13,
     "Divided by zero point zero one, that's minus zero point eight: minus the sine.",
     "Its change, divided by the turn, is minus zero point eight: minus the sine.",
     "relates: change ÷ turn, then the result"),
    ("s04_slopes_sin_cos", 14,
     "The sine grows from zero point eight zero zero to zero point eight zero six, a change of zero point zero zero six.",
     "The sine grows from zero point eight zero zero to zero point eight zero six.",
     "the subtraction stays on screen"),
    ("s04_slopes_sin_cos", 15,
     "Divided by zero point zero one, that's zero point six: the cosine.",
     "Its change, divided by the turn, is zero point six: the cosine.",
     "relates: change ÷ turn, then the result"),
    ("s07_toward_centre", 15,
     "Now divide each number by delta theta, zero point zero one, and we get minus zero point six, minus zero point eight.",
     "Now divide each number by delta theta, and we get minus zero point six, minus zero point eight.",
     "Δθ = 0.01 named in S11; not repeated as a divisor"),
    ("s08_product_rule", 11,
     "The product is now eleven times that, which is ten point nine four five, one point one.",
     "The new speed times the new arrow is about ten point nine four five, one point one.",
     "relates the two factors; 11 × (0.995, 0.1) on screen"),
    ("s08_product_rule", 15,
     "First, the change in the number, times the old arrow: one times one, zero, which is one, zero.",
     "First, the change in the number, times the old arrow, gives one, zero.",
     "1 × (1, 0) on screen"),
    ("s08_product_rule", 16,
     "Second, the old number times the change in the arrow, which went from one, zero to zero point nine nine five, zero point one, a change of "
     "minus zero point zero zero five, zero point one: ten times that is minus zero point zero five, one.",
     "Second, the old number times the change in the arrow: the arrow changed by minus zero point zero zero five, zero point one, so this "
     "piece is minus zero point zero five, one.",
     "subtraction and 10 × (…) on screen; the arrow's change and the piece named"),
    ("s08_product_rule", 17,
     "Third, the two changes multiplied together: one times minus zero point zero zero five, zero point one, which is minus zero point zero "
     "zero five, zero point one.",
     "Third, the two changes multiplied together give minus zero point zero zero five, zero point one.",
     "1 × (…) on screen"),
    ("s09_dtheta_dt", 5,
     "Then u sub r is ten times zero point six, which is six, and u sub theta is minus ten times zero point eight, which is minus eight.",
     "Multiplying the wind's parts by the cosine and the sine, as the two formulas say, u sub r is six, and u sub theta is minus eight.",
     "the user's own example (−10 × 0.8): products on screen, voice relates and gives the results"),
    ("s09_dtheta_dt", 6,
     "Round Ian's ring, we did this at seventy two points, one every five degrees, and averaged them: the sum of the seventy two values of u "
     "sub theta, divided by seventy two, is about thirty four point eight metres per second.",
     "Round Ian's ring, we did this at seventy two points, one every five degrees, and the average of the seventy two values of u sub theta "
     "is about thirty four point eight metres per second.",
     "sum ÷ 72 on screen (the ring-average equation)"),
    ("s09_dtheta_dt", 17,
     "Thirty four point eight metres per second, divided by twenty five thousand metres, is about zero point zero zero one three nine radians "
     "per second.",
     "The speed, thirty four point eight metres per second, divided by the radius, twenty five thousand metres, is about zero point zero "
     "zero one three nine radians per second.",
     "v and r named with their numbers on screen (S16 rows) and in S0 / S6"),
    ("s09_dtheta_dt", 20,
     "So one full lap, two pi radians, takes two pi divided by zero point zero zero one three nine.",
     "So one full lap, two pi radians, takes two pi divided by this rate.",
     "relates: lap angle ÷ rate"),
    ("s13_acceleration_numbers", 2,
     "Thirty four point eight squared is about twelve hundred and eleven.",
     "For Ian's ring, we square the speed, thirty four point eight metres per second, then divide by the radius, twenty five thousand metres.",
     "34.8² and ÷ 25 000 on screen; voice says what is combined"),
    ("s13_acceleration_numbers", 3,
     "Divided by twenty five thousand metres, that's about zero point zero four eight metres per second squared.",
     "That gives about zero point zero four eight metres per second squared.",
     "result only"),
    ("s13_acceleration_numbers", 4,
     "With easy numbers, thirty five squared over twenty five thousand is about zero point zero four nine, almost the same.",
     "Rounding the speed to thirty five gives about zero point zero four nine, almost the same.",
     "35² / 25 000 on screen; also drops 'easy'"),
    ("s14_steady_but_turning", 4,
     "In one minute, theta grows by zero point zero zero one three nine times sixty, which is about zero point zero eight four radians, or "
     "about five degrees.",
     "In one minute, theta grows by its rate times sixty seconds: about zero point zero eight four radians, or about five degrees.",
     "relates rate × 60 s; product on screen"),
    ("s14_steady_but_turning", 11,
     "So by the arc rule, it's about thirty four point eight times zero point zero eight four, which is about two point nine metres per second.",
     "So by the arc rule, radius times angle, it's about two point nine metres per second.",
     "34.8 × 0.084 on screen"),
    ("s20_ian_curtain", 14,
     "All of it has to leave through the cylinder's lid, which is a much bigger area, so it rises more slowly: two times one thousand times "
     "sixteen, divided by thirty thousand, is about one metre per second.",
     "All of it has to leave through the cylinder's lid, which is a much bigger area, so it rises more slowly: twice the depth times the "
     "inflow speed, divided by the radius, is about one metre per second.",
     "2 × 1000 × 16 / 30 000 on screen; voice names the quantities"),
    ("s23_amphan_ring", 11,
     "Six over twenty is zero point three, so Amphan's inflow angle is about seventeen degrees, close to Ian's twenty one.",
     "The radial wind over the tangential wind gives Amphan an inflow angle of about seventeen degrees, close to Ian's twenty one.",
     "6 / 20 = 0.3 on screen; voice relates the two winds"),
    ("s27_coast_angle", 3,
     "So the coast leans west of north, by an angle whose tangent is the opposite side over the adjacent side: fifty five over ninety one "
     "point five.",
     "So the coast leans west of north, by an angle whose tangent is the opposite side, the west leg, over the adjacent side, the north leg.",
     "55 / 91.5 on screen; voice says which leg goes where"),
    ("s27_coast_angle", 5,
     "So the coast runs thirty one degrees west of north: a compass bearing of three hundred and sixty minus thirty one, which is three "
     "hundred and twenty nine degrees.",
     "So the coast runs thirty one degrees west of north: measured clockwise from north, that's a compass bearing of three hundred and "
     "twenty nine degrees.",
     "360 − 31 on screen"),
    ("s27_coast_angle", 7,
     "So alpha is ninety minus three hundred and twenty nine, which is minus two hundred and thirty nine degrees, and adding a full turn, "
     "three hundred and sixty, gives a hundred and twenty one degrees.",
     "So alpha is ninety degrees minus the bearing, which comes out negative, and adding a full turn gives a hundred and twenty one degrees.",
     "90 − 329 = −239 and +360 on screen; the full-turn idea kept"),
    ("s28_fmb_calc", 3,
     "The part along the shore is u cosine alpha plus v sine alpha: twenty two point two times minus zero point five one five, plus twenty "
     "four point three times zero point eight five seven.",
     "The part along the shore is u cosine alpha plus v sine alpha: we multiply the east part, u, by the cosine of alpha, minus zero point "
     "five one five, and the north part, v, by its sine, zero point eight five seven.",
     "the user's clarification example: relate, don't read the products"),
    ("s28_fmb_calc", 4,
     "That's about minus eleven point four, plus twenty point eight, which is about nine point four metres per second.",
     "Adding the two products gives about nine point four metres per second.",
     "−11.4 + 20.8 on screen"),
    ("s28_fmb_calc", 5,
     "The part across the shore is minus u sine alpha plus v cosine alpha: minus twenty two point two times zero point eight five seven, plus "
     "twenty four point three times minus zero point five one five.",
     "The part across the shore is minus u sine alpha plus v cosine alpha: now u goes with minus the sine, and v with the cosine.",
     "relate, don't read the products"),
    ("s28_fmb_calc", 6,
     "That's about minus nineteen, minus twelve point five, which is about minus thirty one point five metres per second.",
     "Adding these two products gives about minus thirty one point five metres per second.",
     "−19 − 12.5 on screen"),
    ("s28_fmb_calc", 9,
     "Let's check that it's the same wind: nine point four squared plus thirty one point five squared is about a thousand and eighty one, and "
     "its square root is about thirty two point nine, the thirty three metres per second we started with.",
     "Let's check that it's the same wind: we square the along and across parts, add them, and take the square root, which gives about "
     "thirty two point nine, the thirty three metres per second we started with.",
     "9.4² + 31.5² = 1081 and √ on screen; voice: square, add, root (user 2026-11-07 squares rule)"),
    ("s29_stp_calc", 2,
     "Six point eight over fifty five point seven is about zero point one two two, so the coast leans only about seven degrees west of north, "
     "a bearing of about three hundred and fifty three degrees.",
     "With the same tangent rule, west leg over north leg, the coast leans only about seven degrees west of north, a bearing of about three "
     "hundred and fifty three degrees.",
     "6.8 / 55.7 on screen"),
    ("s29_stp_calc", 3,
     "So alpha is ninety minus three hundred and fifty three, plus three hundred and sixty, which is about ninety seven degrees, with a "
     "cosine of about minus zero point one two two and a sine of about zero point nine nine three.",
     "So alpha, ninety degrees minus the bearing, plus a full turn, is about ninety seven degrees, with a cosine of about minus zero point "
     "one two two and a sine of about zero point nine nine three.",
     "90 − 353 + 360 on screen"),
    ("s29_stp_calc", 5,
     "Across the shore, minus u sine alpha is about ten point one, and v cosine alpha is about two.",
     "Across the shore, we take minus u sine alpha, and v cosine alpha, and add them.",
     "the two products on screen"),
    ("s29_stp_calc", 8,
     "Along the shore, u cosine alpha plus v sine alpha is about one point two, minus fifteen point nine, which is minus fourteen point seven, "
     "so it also ran down the coast, towards the south.",
     "Along the shore, u cosine alpha plus v sine alpha comes to about minus fourteen point seven, so the wind also ran down the coast, "
     "towards the south.",
     "1.2 − 15.9 on screen"),
    ("s33_amphan_wind", 5,
     "Twenty one point nine over ninety two point nine is about zero point two three six, so the coast runs about thirteen degrees south of "
     "west.",
     "The south leg over the west leg gives the tangent, so the coast runs about thirteen degrees south of west.",
     "21.9 / 92.9 on screen"),
    ("s33_amphan_wind", 6,
     "That's a bearing of two hundred and seventy minus thirteen, which is two hundred and fifty seven degrees.",
     "Measured clockwise from north, that's a bearing of two hundred and fifty seven degrees.",
     "270 − 13 on screen"),
    ("s33_amphan_wind", 7,
     "So alpha is ninety minus two hundred and fifty seven, plus three hundred and sixty, which is about a hundred and ninety three degrees, "
     "with a cosine of about minus zero point nine seven four and a sine of about minus zero point two two five.",
     "So alpha, ninety degrees minus the bearing, plus a full turn, is about a hundred and ninety three degrees, with a cosine of about minus "
     "zero point nine seven four and a sine of about minus zero point two two five.",
     "90 − 257 + 360 on screen"),
    ("s33_amphan_wind", 10,
     "Across the shore, minus u sine alpha is about minus one point nine, and v cosine alpha is about minus twenty point five.",
     "Across the shore, we take minus u sine alpha, and v cosine alpha, and add them.",
     "the two products on screen"),
    ("s33_amphan_wind", 12,
     "The official lowest pressure was about nine hundred and sixty hectopascals, fifty three below normal, so the sea under the eye rose "
     "about fifty three centimetres.",
     "The official lowest pressure was about nine hundred and sixty hectopascals, so the sea under the eye rose about fifty three "
     "centimetres.",
     "1013 − 960 on screen; the cm-per-hPa rule was said in s30"),
    ("s36_nargis_wind", 4,
     "Ten point eight over sixty nine point five is about zero point one five five, so the coast runs about nine degrees north of west.",
     "The north leg over the west leg gives the tangent, so the coast runs about nine degrees north of west.",
     "10.8 / 69.5 on screen"),
    ("s36_nargis_wind", 5,
     "That's a bearing of two hundred and seventy plus nine, which is two hundred and seventy nine degrees.",
     "Measured clockwise from north, that's a bearing of two hundred and seventy nine degrees.",
     "270 + 9 on screen"),
    ("s36_nargis_wind", 6,
     "So alpha is ninety minus two hundred and seventy nine, plus three hundred and sixty, which is about a hundred and seventy one degrees, "
     "with a cosine of about minus zero point nine eight eight and a sine of about zero point one five six.",
     "So alpha, ninety degrees minus the bearing, plus a full turn, is about a hundred and seventy one degrees, with a cosine of about minus "
     "zero point nine eight eight and a sine of about zero point one five six.",
     "90 − 279 + 360 on screen"),
    ("s36_nargis_wind", 9,
     "Across the shore, minus u sine alpha is about minus one point five, and v cosine alpha is about minus sixteen point three.",
     "Across the shore, we take minus u sine alpha, and v cosine alpha, and add them.",
     "the two products on screen"),
    ("s36_nargis_wind", 11,
     "The official lowest pressure was about nine hundred and sixty two hectopascals, fifty one below normal, so the sea under the eye rose "
     "about fifty one centimetres.",
     "The official lowest pressure was about nine hundred and sixty two hectopascals, so the sea under the eye rose about fifty one "
     "centimetres.",
     "1013 − 962 on screen"),
    ("s39_idai_wind", 5,
     "Thirty five point nine over fifty two point three is about zero point six eight six, so the coast runs about thirty four degrees south "
     "of west.",
     "The south leg over the west leg gives the tangent, so the coast runs about thirty four degrees south of west.",
     "35.9 / 52.3 on screen"),
    ("s39_idai_wind", 6,
     "That's a bearing of two hundred and seventy minus thirty four, which is two hundred and thirty six degrees.",
     "Measured clockwise from north, that's a bearing of two hundred and thirty six degrees.",
     "270 − 34 on screen"),
    ("s39_idai_wind", 7,
     "So alpha is ninety minus two hundred and thirty six, plus three hundred and sixty, which is about two hundred and fourteen degrees, with "
     "a cosine of about minus zero point eight two nine and a sine of about minus zero point five five nine.",
     "So alpha, ninety degrees minus the bearing, plus a full turn, is about two hundred and fourteen degrees, with a cosine of about minus "
     "zero point eight two nine and a sine of about minus zero point five five nine.",
     "90 − 236 + 360 on screen"),
    ("s39_idai_wind", 10,
     "Across the shore, minus u sine alpha is about minus three point seven, and v cosine alpha is about minus seventeen point three.",
     "Across the shore, we take minus u sine alpha, and v cosine alpha, and add them.",
     "the two products on screen"),
    ("s39_idai_wind", 12,
     "The official lowest pressure was about nine hundred and fifty five hectopascals, fifty eight below normal, so the sea under the eye rose "
     "about fifty eight centimetres.",
     "The official lowest pressure was about nine hundred and fifty five hectopascals, so the sea under the eye rose about fifty eight "
     "centimetres.",
     "1013 − 955 on screen"),
    ("s34_amphan_radar", 9,
     "Each pixel is a square sixty metres on each side, so it covers three thousand six hundred square metres, or zero point zero zero three "
     "six square kilometres.",
     "Each pixel is a square sixty metres on each side, so it covers zero point zero zero three six square kilometres.",
     "60 × 60 = 3600 m² on screen"),
    ("s34_amphan_radar", 10,
     "Thirty four thousand seven hundred times zero point zero zero three six is about a hundred and twenty five square kilometres of new "
     "water.",
     "The number of dark pixels times the area of one pixel is about a hundred and twenty five square kilometres of new water.",
     "34 700 × 0.0036 on screen; voice relates count × area"),
    ("s38_idai_intro", 5,
     "Times one point eight five two, that's about a hundred and fifty seven kilometres per hour.",
     "With the knot converted as for Nargis, that's about a hundred and fifty seven kilometres per hour.",
     "× 1.852 on screen (the conversion idea was said in s35)"),
    ("s38_idai_intro", 6,
     "Divided by three point six, it's about forty four metres per second.",
     "And in metres per second, it's about forty four.",
     "÷ 3.6 on screen (said in s35)"),
]

# AT phrases re-pointed in the scene files (scene, sentence, old phrase -> new phrase); at_check.mjs proves them
R8_AT = [
    ("s00_title", "AT(k, 0, \"meteorology\") -> AT(k, 0, \"they're used\") (the picture swap)"),
    ("s04_slopes_sin_cos", "AT(k, 12, \"a change of\") -> AT(k, 13, \"Its change\"); division row tCr -> AT(k, 13, \"divided by\")"),
    ("s04_slopes_sin_cos", "AT(k, 14, \"a change of\") -> AT(k, 15, \"Its change\"); division row tSr -> AT(k, 15, \"divided by\")"),
    ("s08_product_rule", "S16: \"which went from\" -> \"the change in the arrow\"; \"a change of\" -> \"the arrow changed by\"; \"ten times that\" -> \"so this piece\""),
    ("s13_acceleration_numbers", "÷ 25 000 row: tDiv -> AT(k, 2, \"divide by the radius\")"),
    ("s14_steady_but_turning", "AT(k, 11, \"thirty four point eight times\") -> AT(k, 11, \"radius times angle\")"),
    ("s20_ian_curtain", "AT(k, 14, \"two times one thousand\") -> AT(k, 14, \"twice the depth\")"),
    ("s28_fmb_calc", "AT(k, 3, \"twenty two\") -> AT(k, 3, \"we multiply\"); AT(k, 5, \"minus twenty two\") -> AT(k, 5, \"now u goes\")"),
    ("s38_idai_intro", "AT(k, 5, \"one point eight five two\") -> AT(k, 5, \"With the knot\"); AT(k, 6, \"three point six\") -> AT(k, 6, \"in metres per second\")"),
]


def main() -> int:
    txt = SCP.read_text(encoding="utf-8")
    tm = json.loads((MOV / "timing.json").read_text(encoding="utf-8"))
    by = {s["id"]: s for s in tm["scenes"]}
    bad = 0
    for sid, j, old, new, _ in R8:
        cur = by[sid]["sentences"][j]["text"]
        if cur != old and cur != new:
            print(f"note {sid} S{j}: timing.json has an intermediate text (re-voiced next): {cur!r}")
        n = txt.count(old)
        if n == 1:
            txt = txt.replace(old, new)
        elif n == 0 and new in txt:
            pass   # already applied
        else:
            print(f"FAIL {sid} S{j}: old text found {n} times")
            bad += 1
    if bad:
        return 1
    if "--write" in sys.argv:
        SCP.write_text(txt, encoding="utf-8")
        print(f"script.md: {len(R8)} sentences replaced")
    if "--log" in sys.argv:
        print("| Scene | S | Old | New | Why |\n|---|---|---|---|---|")
        for sid, j, old, new, why in R8:
            print(f"| {sid} | {j} | {old} | {new} | {why} |")
    od = sum(len(o) for _, _, o, _, _ in R8)
    nd = sum(len(n) for _, _, _, n, _ in R8)
    print(f"{len(R8)} sentences; characters {od} -> {nd} ({nd - od:+d}; ≈ {(nd - od) / 15.5:+.0f} s at the movie's ≈ 15.5 chars/s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
