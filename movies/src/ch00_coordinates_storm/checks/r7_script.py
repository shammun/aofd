"""ch00_coordinates_storm (#5b) remake 2026-11-07 (master plan R1, R3, R10-R16, R14b, R19): rewrite script.md, the narration source.

Scenes kept verbatim keep their paragraph; changed scenes are rebuilt here from the n2 sentences (by index, beats kept) plus the new
sentences; new scenes are inserted; scenes are renumbered in story order (s26-s31 coast block, s33/s36/s39 event winds, s41 recap,
s42 end). Every number in the new sentences is the builder's shown arithmetic (cs.json -> shore, CHECK DS40-DS47): this script reads
cs.json and fails if a spoken number differs from it.
usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_storm/checks/r7_script.py [--write]
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
MOV = ROOT / "movies/ch00/ch00_coordinates_storm"
SCP = MOV / "script.md"
T = json.loads(Path("G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_storm/n2/tts/timing.json").read_text(encoding="utf-8"))   # the notes-2 narration (the source of the re-used sentences)
SH = json.loads((MOV / "data/cs.json").read_text(encoding="utf-8"))["shore"]
OLD = {s["id"]: s["sentences"] for s in T["scenes"]}


def o(sid: str, *idx: int) -> list[str]:
    """old sentences (with their [beat] marks) by index"""
    out = []
    for j in idx:
        x = OLD[sid][j]
        out.append(x["text"] + (" [beat]" if x.get("beat") else ""))
    return out


# ---- spoken numbers (words) from the builder's shown arithmetic --------------------------------------------------------------------
ONES = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split()
TENS = "_ _ twenty thirty forty fifty sixty seventy eighty ninety".split()


def iw(n: int) -> str:
    """integer in words (house style: 'a hundred and twenty one')"""
    if n < 20:
        return ONES[n]
    if n < 100:
        return TENS[n // 10] + ("" if n % 10 == 0 else " " + ONES[n % 10])
    if n < 1000:
        h, r = divmod(n, 100)
        head = "a hundred" if h == 1 else ONES[h] + " hundred"
        return head + ("" if r == 0 else " and " + iw(r))
    th, r = divmod(n, 1000)
    head = "a thousand" if th == 1 else iw(th) + " thousand"
    return head + ("" if r == 0 else (" and " if r < 100 else " ") + iw(r))


def dw(x: float, nd: int = 1, sign: bool = False) -> str:
    """decimal in words: 9.4 -> 'nine point four', -0.515 -> 'minus zero point five one five'"""
    s = f"{abs(x):.{nd}f}"
    a, b = s.split(".") if "." in s else (s, "")
    b = b.rstrip("0")
    w = iw(int(a)) + (" point " + " ".join(ONES[int(c)] for c in b) if b else "")
    pre = "minus " if x < 0 else ("plus " if sign and x > 0 else "")
    return pre + w


def kmw(x: float) -> str:
    return dw(abs(x), 1)


F, S_, A, N, I = (SH[k]["shown"] for k in ("fmb", "stp", "amphan", "nargis", "idai"))
IB = SH["ian_ib"]

NEW: dict[str, list[str]] = {}
NEW["s00_title"] = ["In this video, we'll learn how turning arrows and cylindrical coordinates work, and see how meteorology uses them to look inside a "
                    "tropical cyclone, and to measure how its winds push the sea onto the coast."]
NEW["s01_hook"] = o("s01_hook", 0, 1, 2, 3, 4, 5) + [
    "Part 1 gave us polar coordinates, with their two arrows, r hat and theta hat, which turn as we go round.",
    "In this part, we find out how fast they turn, add a height to get cylindrical coordinates, and then use Part 1's turned axes to see, on "
    "real maps, how a storm's wind pushes the sea onto the coast."]
# user 2026-11-07 (coordinator): no recap scene; s02_part1_recap is cut, its content is recalled at the point of use
NEW["s09_dtheta_dt"] = o("s09_dtheta_dt", 0) + [
    "How fast does the air go round on that ring?",
    "We measured it in Part 1.",
    "At each point, we split the wind's east and north parts, u and v, into a radial and a tangential part: u sub r equals u cosine theta plus "
    "v sine theta, and u sub theta equals minus u sine theta plus v cosine theta.",
    "For example, take an east wind of ten metres per second, so u is ten and v is zero, at the balloon's point from Part 1, where cosine theta "
    "is zero point six and sine theta is zero point eight.",
    "Then u sub r is ten times zero point six, which is six, and u sub theta is minus ten times zero point eight, which is minus eight. [beat]",
    "Round Ian's ring, we did this at seventy two points, one every five degrees, and averaged them: the sum of the seventy two values of u sub "
    "theta, divided by seventy two, is about thirty four point eight metres per second.",
    "In this part, we'll call that speed round the ring v, so from now on, v means the speed, not the north part of the wind."] + o(
    "s09_dtheta_dt", *range(3, 17))
NEW["s15_cylinder"] = o("s15_cylinder", *range(0, 7)) + [
    "On the flat map, polar coordinates use two numbers: the distance r and the angle theta.",
    "To describe a tall storm, we add a third number: the height z, measured straight up from the sea.",
    "Polar coordinates plus this height are called cylindrical coordinates: r, theta and z.",
    "Nothing else changes: r and theta mean exactly what they meant in Part 1, so x is still r cosine theta, y is still r sine theta, and z is "
    "simply the height."] + o("s15_cylinder", 9)
NEW["s21_amphan_intro"] = o("s21_amphan_intro", 0, 1, 2) + [
    "On the eighteenth of May, its winds reached the top class on the India Meteorological Department's scale, called a super cyclonic storm.",
    "No storm in the Bay of Bengal had reached that class since nineteen ninety nine.",
    "That class measures only the strongest wind over the sea, not the harm on land.",
    "In between, weaker storms hit Bangladesh very hard: Cyclone Sidr in two thousand and seven killed thousands of people, and Cyclone Aila "
    "in two thousand and nine flooded Khulna and Satkhira for months."] + o("s21_amphan_intro", 4) + [
    "Its centre then passed close to Kolkata.",
    "It passed about forty five kilometres west of Satkhira, and about seventy nine kilometres west of Khulna, both in Bangladesh."] + o(
    "s21_amphan_intro", 6)

# ---- the coast block (continuity plan §2a B1-B6) ------------------------------------------------------------------------------------
NEW["s26_coast_axes"] = ["Now let's come back down to the ground, to the landfall of Hurricane Ian, the storm we measured in Part 1, on the coast of Florida."] +     o("s26_onshore", 1, 2) + [
    "To split a wind that way, we turn our axes to line up with the coast, just as we learned in Part 1.",
    "There, we turned the x axis by an angle alpha, measured anticlockwise from east, as seen from above.",
    "The new axis, x hat prime, is cosine alpha, sine alpha, and y hat prime, a quarter turn anticlockwise from it, is minus sine alpha, "
    "cosine alpha.",
    "And we derived the coordinates in the turned axes: x prime equals x cosine alpha plus y sine alpha, and y prime equals minus x sine alpha "
    "plus y cosine alpha.",
    "In matrix form, that's one rotation matrix times the column x, y.",
    "A wind is an arrow too, so the same rule works for it, with x and y replaced by the wind's east and north parts, u and v.",
    "So the wind's part along the shore is u cosine alpha plus v sine alpha, and its part across the shore is minus u sine alpha plus v "
    "cosine alpha.",
    "We'll point x hat prime along the coast, so that y hat prime points out to sea.",
    "Then a positive across-shore part blows out to sea, and a negative one blows onto the land.",
    "So everything hangs on one number: the coast's angle, alpha."]
NEW["s27_coast_angle"] = [
    "Which way does the coast run near Fort Myers Beach?",
    "Here's the coast on a flat map marked in kilometres, with two points on it: Naples in the south, and Englewood in the north.",
    f"Going up the coast from Naples to Englewood, we move about {kmw(F['dy'])} kilometres north, and {kmw(F['dx'])} kilometres west.",
    f"So the coast leans west of north, by an angle whose tangent is the opposite side over the adjacent side: {kmw(F['dx'])} over {kmw(F['dy'])}.",
    f"That's about {dw(F['tan'], 3)}, and the angle is about {iw(F['beta'])} degrees. [beat]",
    f"So the coast runs {iw(F['beta'])} degrees west of north: a compass bearing of three hundred and sixty minus {iw(F['beta'])}, which is "
    f"{iw(F['bearing'])} degrees. [beat]",
    "In Part 1, we found that a compass bearing is ninety degrees minus the maths angle, so the maths angle is ninety degrees minus the bearing.",
    f"So alpha is ninety minus {iw(F['bearing'])}, which is minus {iw(-F['alpha_raw'])} degrees, and adding a full turn, three hundred and sixty, "
    f"gives {iw(F['alpha'])} degrees. [beat]",
    f"The cosine of {iw(F['alpha'])} degrees is about {dw(F['cos'], 3)}, and its sine is about {dw(F['sin'], 3)}.",
    f"So x hat prime is about {dw(F['cos'], 3)}, {dw(F['sin'], 3)}: it points up the coast, towards the north-north-west.",
    f"And y hat prime is about {dw(-F['sin'], 3)}, {dw(F['cos'], 3)}: it points west-south-west, out into the Gulf of Mexico. [beat]",
    "That's why we picked the north-north-west way along the coast, and not the south-south-east way: then y hat prime points out to sea."]
NEW["s28_fmb_calc"] = ["Now the wind."] + o("s26_onshore", 3) + [
    f"Its east part, u, was about {dw(F['u'])} metres per second, and its north part, v, was about {dw(F['v'])}.",
    f"The part along the shore is u cosine alpha plus v sine alpha: {dw(F['u'])} times {dw(F['cos'], 3)}, plus {dw(F['v'])} times {dw(F['sin'], 3)}.",
    f"That's about {dw(F['al_terms'][0])}, plus {dw(F['al_terms'][1])}, which is about {dw(F['along'])} metres per second. [beat]",
    f"The part across the shore is minus u sine alpha plus v cosine alpha: minus {dw(F['u'])} times {dw(F['sin'], 3)}, plus {dw(F['v'])} times "
    f"{dw(F['cos'], 3)}.",
    f"That's about {dw(F['ac_terms'][0])}, {dw(F['ac_terms'][1])}, which is about {dw(F['across'])} metres per second. [beat]",
    "The minus sign means against y hat prime: not out to sea, but onto the land.",
    f"So about {dw(-F['across'])} metres per second blew straight onto the land, and only about {dw(F['along'])} along the coast.",
    f"Let's check that it's the same wind: {dw(F['along'])} squared plus {dw(-F['across'])} squared is about {iw(F['sq'])}, and its square root is about "
    f"{dw(F['root'])}, the thirty three metres per second we started with. [beat]"]
NEW["s29_stp_calc"] = [
    "Now go about a hundred and sixty kilometres north, to Saint Petersburg, on Tampa Bay, on the other side of the storm's eye.",
    f"Next to it, the Gulf coast runs almost due north: from Saint Pete Beach to Tarpon Springs, it moves about {kmw(S_['dy'])} kilometres north, "
    f"and {kmw(S_['dx'])} kilometres west.",
    f"{kmw(S_['dx']).capitalize()} over {kmw(S_['dy'])} is about {dw(S_['tan'], 3)}, so the coast leans only about {iw(S_['beta'])} degrees west of north, "
    f"a bearing of about {iw(S_['bearing'])} degrees.",
    f"So alpha is ninety minus {iw(S_['bearing'])}, plus three hundred and sixty, which is about {iw(S_['alpha'])} degrees, with a cosine of about "
    f"{dw(S_['cos'], 3)} and a sine of about {dw(S_['sin'], 3)}. [beat]",
    f"The model's wind there, at the same hour, was about nineteen metres per second from the north-north-east: u about {dw(S_['u'])}, and v about "
    f"{dw(S_['v'])}.",
    f"Across the shore, minus u sine alpha is about {dw(S_['ac_terms'][0])}, and v cosine alpha is about {dw(S_['ac_terms'][1])}.",
    f"Together, that's about {dw(S_['across'], 1, True)} metres per second. [beat]",
    "Plus means along y hat prime: out to sea.",
    f"Along the shore, u cosine alpha plus v sine alpha is about {dw(S_['al_terms'][0])}, {dw(S_['al_terms'][1])}, which is {dw(S_['along'])}, so it "
    "also ran down the coast, towards the south. [beat]",
    "So here's the same storm, on opposite sides of its eye: at Fort Myers Beach, the wind blew onto the land, and at Saint Petersburg, it blew "
    "out to sea."]
NEW["s30_onshore_piles"] = [
    "What does that do to the sea?",
    "Wind blowing onto the land drags the sea surface with it, and the water piles up against the coast.",
    "Wind blowing out to sea drags the water away from the coast, and the level drops.",
    "Where the water piles up, the sea rises far above the normal tide, and this rise is called a storm surge."] + o("s27_surge", 2) + [
    "The low pressure helps a little: the sea rises by about one centimetre for every hectopascal that the pressure drops.",
    f"When Ian came ashore, its centre's pressure was about {iw(int(IB['hpa']))} hectopascals, {iw(int(IB['deficit']))} below the normal one "
    f"thousand and thirteen, so the sea under the eye rose by only about {iw(int(IB['cm_rule']))} centimetres.",
    "So what should the water have done at our two stations?"]
NEW["s31_gauges"] = [
    "Tide gauges, which measure the water level every few minutes, give the answer.",
    "At Fort Myers, up the river, the water rose about two point two metres above the normal tide.",
    "At Saint Petersburg, it fell about one point eight metres below the normal tide, both within a few hours of landfall.",
    "The across-shore wind flipped its sign, and so did the water."] + o("s27_surge", 4) + o("s28_ian_record", 0) + [
    "Almost nothing.",
    "The surge peaked in the evening, under the storm's clouds, and drained back to the sea within hours, so the pictures taken from space and "
    "from survey planes in the next days show the damage, not the surge itself.",
    "So the two gauge lines are the surge, measured."] + o("s27_surge", 10, 11)


def event(nm: str, intro: list[str], place: list[str], legs: str, ydir: str, wind_from: str, end: list[str]) -> list[str]:
    E = SH[nm]["shown"]
    ib = SH[nm]["ib"]
    return intro + place + [
        legs,
        f"So alpha is ninety minus {iw(E['bearing'])}, plus three hundred and sixty, which is about {iw(E['alpha'])} degrees, with a cosine of about "
        f"{dw(E['cos'], 3)} and a sine of about {dw(E['sin'], 3)}.",
        f"Then y hat prime points {ydir}, out to sea.",
        f"ERA5's wind there was about {dw(E['speed']) if E['speed'] % 1 else iw(int(E['speed']))} metres per second, from the {wind_from}: u about "
        f"{dw(E['u'], 1, True)}, and v about {dw(E['v'], 1, True)}.",
        f"Across the shore, minus u sine alpha is about {dw(E['ac_terms'][0])}, and v cosine alpha is about {dw(E['ac_terms'][1])}.",
        f"Together, that's about {dw(E['across'])} metres per second: onto the land. [beat]",
        f"The official lowest pressure was about {iw(int(ib['hpa']))} hectopascals, {iw(int(ib['deficit']))} below normal, so the sea under the eye "
        f"rose about {iw(int(ib['cm_rule']))} centimetres."] + end


def legs_line(E: dict, way: str, ew: str, ns: str, lean: str, base: str) -> str:
    return (f"Going {way} along the coast there, we move about {kmw(E['dx'])} kilometres {ew} and {kmw(E['dy'])} kilometres {ns}. "
            f"{kmw(min(abs(E['dx']), abs(E['dy']))).capitalize()} over {kmw(max(abs(E['dx']), abs(E['dy'])))} is about {dw(E['tan'], 3)}, so the coast "
            f"runs about {iw(E['beta'])} degrees {lean} of west. "
            f"That's a bearing of {base}, which is {iw(E['bearing'])} degrees.")


NEW["s33_amphan_wind"] = event(
    "amphan",
    ["Before we look for Amphan's flood, let's see which way its wind blew on the coast.",
     "We use ERA5 again, at nine in the morning, universal time, on the twentieth of May, as Amphan reached the coast.",
     f"Remember that ERA5 smooths the storm: its strongest wind near Amphan is only about {iw(round(SH['amphan']['ratio'] * 10))} tenths of the official "
     "estimate, so we use it for the direction of the wind, not its full strength."],
    ["We pick a point on the Sundarbans shore of Bangladesh, east of the centre."],
    legs_line(A, "west", "west", "south", "south", f"two hundred and seventy minus {iw(A['beta'])}"),
    "south", "south-south-east",
    ["So Amphan's wind pushed the sea onto the Sundarbans coast, over that wide, shallow shelf.", "There's no tide-gauge record of the water there in our data, so next come the pictures from space."])
NEW["s36_nargis_wind"] = event(
    "nargis",
    ["We use ERA5 again, at eleven in the morning, universal time, on the second of May, around the time of landfall.",
     "Again, ERA5's storm is too weak, at only about half of the official wind, so we use it for the direction."],
    ["Our point is on the delta's coast, south of the town of Bogale."],
    legs_line(N, "west", "west", "north", "north", f"two hundred and seventy plus {iw(N['beta'])}"),
    "south", "south-south-west",
    ["So Nargis drove the sea onto the delta, where most of the land lies only a few metres above it.", "There's no tide-gauge record of the water there in our data, so next come the pictures from space.", "Let's zoom in, to see the delta before and after the storm."])
NEW["s39_idai_wind"] = event(
    "idai",
    ["Here's ERA5's wind at seven in the evening, universal time, on the fourteenth of March, a few hours before landfall.",
     f"Its strongest wind is about {iw(round(SH['idai']['ratio'] * 3))} thirds of the official estimate, so once more we use it for the direction.",
     "Idai turns clockwise, as seen from above, so on its western side, where Beira was, the wind blew in from the sea."],
    ["Our point is Beira's seafront."],
    legs_line(I, "south-west", "west", "south", "south", f"two hundred and seventy minus {iw(I['beta'])}"),
    "south-east", "south-south-east",
    ["So Idai's wind pushed the sea onto Beira's coast, and into the mouths of its rivers.", "There's no tide-gauge record of the water there in our data, so next come the pictures from space."])

NEW["s35_nargis_intro"] = ["Some of the best-known flood pictures from space of a Bay of Bengal cyclone come from Cyclone Nargis, in May two thousand and eight."] + \
    o("s31_nargis_intro", *range(1, 12)) + ["Before we look at the flood, let's see which way its wind blew on the delta's coast."]
NEW["s41_recap"] = o("s35_recap", *range(0, 7)) + [
    "Turning the axes to fit the coast split Ian's wind into its parts along and across the shore.",
    f"At Fort Myers Beach, about {dw(-F['across'])} metres per second blew onto the land, and the gauge up the river at Fort Myers rose about two point "
    "two metres.",
    f"At Saint Petersburg, about {dw(S_['across'])} blew out to sea, and the water fell about one point eight metres.",
    f"Before the floods after Amphan, Nargis and Idai, the across-shore wind blew onto the land too: about {dw(-A['across'])}, {dw(-N['across'])} and "
    f"{dw(-I['across'])} metres per second in ERA5."] + o("s35_recap", 9, 10) + [
    "There, we'll learn to turn latitudes and longitudes into kilometres, the rule behind the kilometre maps we used for today's coasts."]

# ---- order (new id, source of an unchanged paragraph) ------------------------------------------------------------------------------
ORDER = [("s00_title", None), ("s01_hook", None)] + [(s, s) for s in (
    "s03_tip_on_circle", "s04_slopes_sin_cos", "s05_dr_dtheta", "s06_dtheta_dtheta", "s07_toward_centre", "s08_product_rule")] + [("s09_dtheta_dt", None)] + \
    [(s, s) for s in ("s10_position_arrow", "s11_velocity_on_ring", "s12_acceleration", "s13_acceleration_numbers", "s14_steady_but_turning")] + \
    [("s15_cylinder", None)] + [(s, s) for s in ("s16_three_parts", "s17_ian_check", "s18_ian_stack", "s19_ian_layers_lit", "s20_ian_curtain")] + \
    [("s21_amphan_intro", None)] + [(s, s) for s in ("s22_amphan_eye", "s23_amphan_ring", "s24_amphan_curtain", "s25_why_cylindrical")] + \
    [("s26_coast_axes", None), ("s27_coast_angle", None), ("s28_fmb_calc", None), ("s29_stp_calc", None), ("s30_onshore_piles", None), ("s31_gauges", None),
     ("s32_flood_flight", "s29_flood_flight"), ("s33_amphan_wind", None), ("s34_amphan_radar", "s30_amphan_radar"), ("s35_nargis_intro", None),
     ("s36_nargis_wind", None), ("s37_nargis_swipe", "s32_nargis_swipe"), ("s38_idai_intro", "s33_idai_intro"), ("s39_idai_wind", None),
     ("s40_idai_swipe", "s34_idai_swipe"), ("s41_recap", None), ("s42_end", "s36_end")]
RENAME = {src: new for new, src in ORDER if src and src != new}


def main() -> None:
    txt = Path("G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_storm/tmp/script_n2_backup.md").read_text(encoding="utf-8")   # the notes-2 script (idempotent re-runs)
    head, _, rest = txt.partition("\n## s00_title")
    blocks = re.split(r"\n(?=## s\d\d)", "## s00_title" + rest)
    by = {}
    for b in blocks:
        sid = b.split("\n", 1)[0][3:].strip()
        by[sid] = b
    out = []
    for new, src in ORDER:
        if src:
            b = by[src]
            if src != new:
                b = b.replace(f"## {src}", f"## {new}", 1)
            # notes-only lines (">") of renamed scenes stay; the spoken paragraph is unchanged
            out.append(b.rstrip("\n"))
        else:
            para = " ".join(NEW[new])
            note = {"s26_coast_axes": "> R13 B1: Part 1's turned axes recalled exactly ('derived in Part 1'), then the wind form (along / across tags).",
                    "s27_coast_angle": "> R13 B2: the coast angle on a local flat km map (the lat/lon -> km rule is Part 3; the legs are read off the map).",
                    "s28_fmb_calc": "> R13 B3: Fort Myers Beach along / across from the shown inputs (cs.json shore.fmb.shown, DS40).",
                    "s29_stp_calc": "> R13 B4: Saint Petersburg out to sea, opposing arrows (shore.stp.shown, DS41).",
                    "s30_onshore_piles": "> R13 B5: the reasoning before the evidence; Ian's centre 941 hPa at the 19:05 UTC landfall -> 72 cm (DS43).",
                    "s31_gauges": "> R13 B6: the gauges (+2.2 m / -1.8 m), fact rows 9 ('almost nothing').",
                    "s33_amphan_wind": "> R14/R14b: ERA5 20 May 2020 09 UTC; across from the shown inputs (DS44-DS47).",
                    "s36_nargis_wind": "> R14/R14b: ERA5 2 May 2008 11 UTC (DS44-DS47).",
                    "s39_idai_wind": "> R14/R14b: ERA5 14 Mar 2019 19 UTC (DS44-DS47)."}.get(new, "> remake 2026-11-07: rewritten (see remake_2026-11-07_log.md).")
            out.append(f"## {new}\n{note}\n{para}\n")
    new_txt = head.rstrip("\n") + "\n\n" + "\n\n".join(o_.rstrip("\n") for o_ in out) + "\n"
    remark = ("### Remake 2026-11-07\n\n**Remake 2026-11-07** (master plan R1, R3, R10-R16, R14b, R19; `remake_2026-11-07_log.md`): the opening says what Part 1 covered "
              "and what Part 2 covers; recalls of Part 1 at the point of use; cylindrical coordinates said plainly; the coast block s26-s31 (turned axes -> coast "
              "angle -> Fort Myers Beach -> Saint Petersburg -> the reasoning -> the gauges); an across-shore calculation before each flood (s33, s36, s39); "
              "fact-check rows 1, 2, 9, 10 applied; recap with the numbers and a two-sentence teaser. The scene table below the README is historical.\n\n")
    new_txt = new_txt.replace("### README\n", "### README\n\n" + remark, 1) if "### Remake 2026-11-07" not in new_txt else new_txt
    if "--write" in sys.argv:
        SCP.write_text(new_txt, encoding="utf-8")
    for k in ("s01_hook", "s09_dtheta_dt", "s26_coast_axes", "s27_coast_angle", "s28_fmb_calc", "s29_stp_calc", "s30_onshore_piles", "s31_gauges",
              "s33_amphan_wind", "s36_nargis_wind", "s39_idai_wind", "s41_recap"):
        print(f"== {k}")
        for s in NEW[k]:
            print("  ", s)
    print("renames:", RENAME)


if __name__ == "__main__":
    main()
