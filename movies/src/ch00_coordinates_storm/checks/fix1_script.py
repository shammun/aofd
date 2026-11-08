"""ch00_coordinates_storm (#5b) fix loop 1 after the r8 reviews (2026-11-07): the re-voiced sentences.

r8 review 1 Must 3 (s21 "it" read as Aila), Should 2 (s15 "That's because" explained nothing), Should 5 (s30: no voiced subtraction;
the inputs of 100 Pa / (rho g) said), Should 6 (s14: f named where it is shown, with Omega and phi), Should 9 / review 2 S12 (events:
"official centre pressure at that hour", and ERA5's own lowest pressure at the white circle said and shown); review 2 S8 (s09: one radian
said) and Nit 3 (s20: single radar towers near twelve, the TDR value is 11.6 m/s).

Each entry replaces ONE sentence of script.md (exact text, found exactly once). A replacement may be two sentences (s14 S16, s30 S6, the
three events): those scenes' later sentence indices shift by one, and the scene files are re-pointed by hand (at_check.mjs checks them;
EventWind locates its sentences by phrase).

Facts (checked 2026-11-07 against IBTrACS v04r01 on G:, agency columns): Amphan 2020-05-20 09 UTC newdelhi_pres 960 hPa (lifetime
minimum 920, 18 May); Nargis 2008-05-02 09 and 12 UTC 962 hPa (lifetime minimum 962); Idai 2019-03-14 18 UTC reunion_pres 955 hPa,
21 UTC 958 (lifetime minimum 940). ERA5's grid minimum of msl at the white circle (cs.json shore.<event>.pmin): 965.4, 982.1,
980.8 hPa. Sea-water density 1025 kg/m^3, g = 9.81 m/s^2: 100 Pa / (1025 x 9.81) = 0.0099 m. Ian's ring latitude 26.5 N (cs.json
ian_c). TDR single-tower maximum 11.6 m/s (cs.json w.tdr.point_max).

usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_storm/checks/fix1_script.py [--write] [--log]
"""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
SCP = ROOT / "movies/ch00/ch00_coordinates_storm/script.md"

PRESS_NEW = ("At the white circle, ERA5's lowest pressure is about {era} hectopascals, but its storm is too weak, so we take the official "
             "value. The official centre pressure at that hour was about {off} hectopascals, so the sea under the eye rose about {cm} centimetres.")
PRESS_OLD = "The official lowest pressure was about {off} hectopascals, so the sea under the eye rose about {cm} centimetres."
EV = [("s33_amphan_wind", "nine hundred and sixty five", "nine hundred and sixty", "fifty three"),
      ("s36_nargis_wind", "nine hundred and eighty two", "nine hundred and sixty two", "fifty one"),
      ("s39_idai_wind", "nine hundred and eighty one", "nine hundred and fifty five", "fifty eight")]

# (scene, old sentence, new text (one or two sentences), why)
FIX1: list[tuple[str, str, str, str]] = [
    ("s09_dtheta_dt",
     "That's about zero point zero eight degrees every second, or about five degrees every minute.",
     "One radian is about fifty seven point three degrees, so that's about zero point zero eight degrees every second, or about five degrees "
     "every minute.",
     "review 2 S8: '1 rad = 180°/π ≈ 57.3°' was on screen but never said"),
    ("s14_steady_but_turning",
     "The Earth's spin pushes the other way, a little outward, about twenty times weaker, so the pressure force has to be a little stronger "
     "than the turning alone needs.",
     "The Earth's spin pushes the other way, a little outward: that push is the speed times the Coriolis parameter f, which comes from the "
     "Earth's spin rate and Ian's latitude, about twenty six and a half degrees north. It's about twenty times weaker, so the pressure force "
     "has to be a little stronger than the turning alone needs.",
     "review 1 S6 / review 2 S8: f, Ω and φ are on screen, so the voice names them (two sentences)"),
    ("s15_cylinder",
     "That's because all the places at one distance r form a cylinder round the storm's axis.",
     "They're called cylindrical because all the places at one distance r form a cylinder round the storm's axis.",
     "review 1 S2: 'That's because' followed 'z is simply the height' and explained nothing"),
    ("s20_ian_curtain",
     "And radar on a hurricane-hunter aircraft measured it: about three metres per second, eight and a half kilometres up, with single "
     "towers near ten.",
     "And radar on a hurricane-hunter aircraft measured it: about three metres per second, eight and a half kilometres up, with single "
     "towers near twelve.",
     "review 2 Nit 3: the TDR single-tower maximum is 11.6 m/s"),
    ("s21_amphan_intro",
     "On the twentieth, it came ashore in the Sundarbans, the huge mangrove forest on the border between India's state of West Bengal and "
     "Bangladesh.",
     "On the twentieth of May, Amphan came ashore in the Sundarbans, the huge mangrove forest on the border between India's state of West "
     "Bengal and Bangladesh.",
     "review 1 Must 3: after the new Aila sentence 'it' read as Aila"),
    ("s30_onshore_piles",
     "When Ian came ashore, its centre's pressure was about nine hundred and forty one hectopascals, seventy two below the normal one "
     "thousand and thirteen, so the sea under the eye rose by only about seventy two centimetres.",
     "We get that centimetre by dividing one hectopascal, a hundred pascals, by the sea water's density, about one thousand and twenty five "
     "kilograms per cubic metre, times gravity, nine point eight one metres per second squared. When Ian came ashore, its centre's pressure "
     "was about nine hundred and forty one hectopascals, against a normal one thousand and thirteen, so the sea under the eye rose by only "
     "about seventy two centimetres.",
     "review 1 S5: no voiced subtraction; the inputs of 100 Pa / (ρ g) said (new sentence before it)"),
] + [(sid, PRESS_OLD.format(off=off, cm=cm), PRESS_NEW.format(era=era, off=off, cm=cm),
      "review 1 S9 + review 2 S12: ERA5's lowest pressure said and shown (R14b wind AND pressure); 'official centre pressure at that hour'")
     for sid, era, off, cm in EV]


def main() -> int:
    txt = SCP.read_text(encoding="utf-8")
    bad = 0
    for sid, old, new, _ in FIX1:
        n = txt.count(old)
        if n == 1:
            txt = txt.replace(old, new)
        elif n == 0 and new in txt:
            pass
        else:
            print(f"FAIL {sid}: old text found {n} times: {old[:60]}")
            bad += 1
    if bad:
        return 1
    if "--write" in sys.argv:
        SCP.write_text(txt, encoding="utf-8")
        print(f"script.md: {len(FIX1)} sentences replaced")
    if "--log" in sys.argv:
        print("| Scene | Old | New | Why |\n|---|---|---|---|")
        for sid, old, new, why in FIX1:
            print(f"| {sid} | {old} | {new} | {why} |")
    od = sum(len(o) for _, o, _, _ in FIX1)
    nd = sum(len(n) for _, _, n, _ in FIX1)
    print(f"{len(FIX1)} replacements; characters {od} -> {nd} ({nd - od:+d}; ≈ {(nd - od) / 15.5:+.0f} s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
