"""ch00_coordinates_maps (#5g, Coordinates Part 7, the last part) REMAKE 2026-11-07: every narration change, in one place
(= Part 6's checks/r7_text.py, scenes and sentences of this part).

Master plan R1 (title, no "easy"), R3 (smooth series ending: recap with numbers, the gradient teaser, picture + music fade together), R16
(earlier results recalled at their point of use), R19 (fact row 7: "a few hundred" km), §C (no opening recap: s02 cut); continuity_plan §3
(5g recall table + teaser), §5 (title), §6 (ending), §7 (5g work list). House rules 2026-11-07: natural openings (s00 "see how they're used
to", s01 "Now let's dive into …"), show the arithmetic / voice the meaning (no read-out products, sums, divisions, squares, roots), non-obvious
inputs said (cosines, the letter a, Brest / Longyearbyen introduced where used).

SCENE = scene id -> the full new list of sentences ("[beat]" at the end of a sentence where wanted); sentences not changed are copied word
for word (their measured dry-run clips are spliced back). CUT = scenes removed. Rewrites movies/ch00/ch00_coordinates_maps/script.md (scene
paragraphs, a "> remake" note under each changed heading; the stale "> words · … measured" note of a changed scene is dropped) and the
storyboard voiceovers (line-based; the cut scene's block is removed). Idempotent.

usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_maps/checks/r7_text.py [--check]
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[4]
MOV = ROOT / "movies" / "ch00" / "ch00_coordinates_maps"
sys.path.insert(0, str(ROOT / "tools"))

CUT = ["s02_part6_recap"]

SCENE: dict[str, list[str]] = {
    # R1 / §5 / natural openings: no "easy", no "how meteorology uses them"; "Coordinates" (title line 1) pulses on "coordinates"
    "s00_title": [
        "In this video, we'll learn how coordinates flatten our round Earth into maps, and see how they're used to draw weather maps, and to "
        "read the winds high above the North Pole.",
    ],
    # natural openings: the lead-in names this part's own pieces, picking up Part 6's teaser (S0, S1, S3 re-used)
    "s01_hook": [
        "Why does Greenland look as big as Africa on so many maps, and how do forecasters draw the whole Arctic on one page?",
        "This is the last of seven parts on coordinates.",
        "Now let's dive into the maps themselves: the flat square map that weather data come on, Mercator's map, where the rhumb line comes "
        "out straight, and maps that keep areas true, with exactly what each one stretches.",
        "Then let's read a weather map drawn from above the North Pole.",
    ],
    # R16: the letter a (Part 3), the arc rule (Part 1), the distance north (Part 3) recalled where used; Brest introduced; S16-S17 no
    # read-out products
    "s04_plate_carree": [
        "Next, we'll build the simplest map step by step, with every number.",
        "That's for anyone who enjoys every step.",
        "For the intuition behind weather, climate science or GIS, you only need the result, so if it feels like a lot, skip ahead to the time on "
        "screen.",
        "We'll build it from the lines on the globe whose lengths we know.",
        "First, the equator.",
        "Cut it, and unroll it into a straight line across the page.",
        "Its length is two pi times the Earth's radius, which, as in Part 3, we write as the letter a, about six thousand three hundred and "
        "seventy one kilometres, so the equator is about forty thousand kilometres long.",
        "A place at longitude lambda, in radians, is the Earth's radius times lambda along the equator from the prime meridian.",
        "That's the arc rule, which we found in Part 1.",
        "So we set x equal to the Earth's radius times lambda. [beat]",
        "Second, the meridians.",
        "Each one runs from the equator to the pole, and a place at latitude phi is the Earth's radius times phi from the equator, along its "
        "meridian.",
        "That's the distance north, which we found in Part 3.",
        "So we draw every meridian as a straight line going up the page, and set y equal to the Earth's radius times phi. [beat]",
        "Let's try Brest, the port city at the western tip of France that we met in Part 3, at forty eight point four degrees north, and four "
        "and a half degrees west.",
        "In radians, that's zero point eight four four seven, and minus zero point zero seven eight five.",
        "So x, the Earth's radius times lambda, comes to about minus five hundred kilometres: just west of the middle line. [beat]",
        "And y, the Earth's radius times phi, comes to about five thousand three hundred and eighty two kilometres. [beat]",
        "That's exactly how far Brest is from the equator, walking north along its meridian.",
        "So along the equator, and along every meridian, this map is true to scale.",
        "It's called the plate carrée, French for flat square, and most weather data come on exactly this kind of grid.",
    ],
    # R16 (S3 Part 3 recall on screen); show-it-don't-voice-it S4, S6, S10-S12 (the cosines are the inputs: said, highlighted)
    "s05_stretch_k": [
        "Now look at a circle of latitude, called a parallel.",
        "On this map, every parallel is drawn as a straight line across the page, as long as the equator: two pi times the Earth's radius, "
        "about forty thousand and thirty kilometres.",
        "But on the globe, the parallel through Brest is a smaller circle.",
        "As we saw in Part 3, its radius is the Earth's radius times cosine phi, about four thousand two hundred and thirty kilometres.",
        "So its true length, two pi times that radius, is about twenty six thousand five hundred and eighty kilometres. [beat]",
        "The map draws twenty six thousand five hundred and eighty kilometres as forty thousand and thirty.",
        "So east-west distances at Brest are stretched: dividing the drawn length by the true length gives about one point five. [beat]",
        "Let's write that with symbols.",
        "The stretch, called k, is two pi times the Earth's radius, divided by two pi times the Earth's radius times cosine phi.",
        "The two pi and the radius cancel, so k equals one over cosine phi. [beat]",
        "At Brest, the cosine of phi is zero point six six four, so k is about one point five.",
        "At sixty degrees north, the cosine is zero point five, so k is two.",
        "And at Longyearbyen, the Arctic town on Svalbard that we met in Part 3, at seventy eight point two degrees north, the cosine is only "
        "zero point two zero four, so k is almost five. [beat]",
        "North-south distances aren't stretched at all.",
        "So a small circle near Brest is drawn as an oval, one and a half times wider than it is tall, and near the poles, shapes are squashed "
        "flat.",
    ],
    # R16: scale factors (Part 6) and the one-degree distances (Part 3) recalled where used (new S3; S4 = old S3)
    "s06_gradient_preview": [
        "If you skipped, here's what to keep.",
        "The simplest map uses longitude and latitude as x and y.",
        "It's true along the equator and along every meridian, but it stretches east-west distances by one over cosine phi: about one and a "
        "half times at Brest, two at sixty degrees north, and almost five at Svalbard.",
        "In Part 6, we called the distance walked for each radian of a coordinate its scale factor: the Earth's radius for latitude, and the "
        "radius times cosine phi for longitude.",
        "Scale factors like this matter for weather data, because most weather data come on exactly this kind of grid.",
        "Suppose two grid points near Brest are one degree of longitude apart, and the temperature differs by one degree Celsius between them.",
        "The slope we want is per kilometre, not per degree.",
        "So we divide by the true distance east, seventy three point eight kilometres, as we found in Part 3, not by the hundred and eleven "
        "point two kilometres of a degree north.",
        "That's about one point four degrees per hundred kilometres. [beat]",
        "In symbols, the eastward slope is one over the Earth's radius times cosine phi, times the change with longitude.",
        "Together with the northward slope, it makes the gradient on the sphere.",
        "We'll build it step by step in the next movie in this series: The gradient.",
        "Weather models also use a curvilinear coordinate in the vertical, pressure instead of height, which has its own movie too: Pressure as "
        "a vertical coordinate.",
    ],
    # show-it-don't-voice-it: S10 (the stretch is the input, said; the product stays on screen)
    "s08_mercator_dy": [
        "Now let's turn Mercator's idea into a formula, with every step and every number.",
        "This part is for learners who want to see how the formula is built; you don't need it for the intuition behind weather, climate "
        "science or GIS.",
        "If it feels like too much, skip ahead to the time on screen.",
        "Take a small step north on the globe, by delta phi.",
        "From Part 3, its true length is the Earth's radius times delta phi.",
        "On the flat square map, it's drawn just that long, while east-west is drawn one over cosine phi times too long.",
        "To keep the shapes, Mercator draws the north step one over cosine phi times longer too.",
        "So on his map, the step is drawn as the Earth's radius times delta phi, divided by cosine phi. [beat]",
        "Let's put in numbers.",
        "One degree north is a hundred and eleven point two kilometres on the ground, everywhere.",
        "At Brest, where the stretch is one point five zero six, Mercator draws it about a hundred and sixty seven point four kilometres long. "
        "[beat]",
        "At sixty degrees north, he draws it twice as long, about two hundred and twenty two point four kilometres. [beat]",
        "When the step is tiny, we write d instead of delta, as in Part 3.",
        "So d y equals the Earth's radius times d phi, divided by cosine phi.",
        "This says how fast the map's height grows as we go north: slowly near the equator, and faster and faster towards the pole.",
    ],
    # show-it-don't-voice-it: S6 (the product stays on screen; the voice says what is multiplied, then the result)
    "s09_adding_steps": [
        "So how high up the map is a place at latitude phi?",
        "It's the sum of all the drawn steps, from the equator up to phi.",
        "Let's add them up, ten degrees at a time.",
        "Ten degrees is zero point one seven four five radians.",
        "For each step, we use the stretch in the middle of the step.",
        "From zero to ten degrees, the middle is five degrees, where one over cosine is one point zero zero four.",
        "So the first drawn step, ten degrees in radians times that stretch, is about zero point one seven five Earth radii, or about one "
        "thousand one hundred and sixteen kilometres. [beat]",
        "From ten to twenty degrees, the middle is fifteen degrees, the stretch is one point zero three five, and the step is zero point one "
        "eight one.",
        "The running total is zero point three five six. [beat]",
        "From twenty to thirty degrees, the stretch is one point one zero three, the step is zero point one nine three, and the total is zero "
        "point five four nine. [beat]",
        "Let's speed up.",
        "The total reaches about one point zero one at fifty degrees, one point three one at sixty, one point seven three at seventy, and two "
        "point four at eighty. [beat]",
        "Look at the steps: they grow as we go north, because the stretch grows.",
        "The last ten degrees, from eighty to ninety, add at least two more on their own, and we'll see soon that they add far more.",
        "Navigators really did it this way: in fifteen ninety nine, the English mathematician Edward Wright published a table made by adding up "
        "such steps, one minute of latitude at a time.",
    ],
    # show-it-don't-voice-it: S9, S13 (the angle sums stay on screen); S10, S15 reworded (function values are the inputs, said)
    "s10_ln_formula": [
        "Adding up tiny steps like this is the integration we met in Part 3, and this sum has an exact answer.",
        "To write it, we need one new tool, the natural logarithm, written l n.",
        "The number e is about two point seven one eight.",
        "The natural logarithm of a number answers one question: e to what power gives this number?",
        "So l n of one is zero, because e to the power zero is one.",
        "And l n of e is one. [beat]",
        "Here's the answer to our sum: y equals the Earth's radius, times the natural logarithm of the tangent of forty five degrees plus half "
        "the latitude.",
        "Forty five degrees is pi over four radians, so on screen it's pi over four plus phi over two.",
        "Let's test it against our table.",
        "At sixty degrees, adding half the latitude to forty five degrees gives seventy five degrees.",
        "Its tangent is three point seven three two, and the l n of that is one point three one seven. [beat]",
        "Our ten-degree sum gave one point three one three, very close.",
        "With one-degree steps, the sum gives one point three one seven, the same to three decimals. [beat]",
        "At Brest, forty five degrees plus half its latitude gives sixty nine point two degrees.",
        "Its tangent is two point six three two five, and its l n is zero point nine six eight.",
        "So on a Mercator map, Brest sits zero point nine six eight Earth radii above the equator, about six thousand one hundred and sixty "
        "seven kilometres. [beat]",
        "On the flat square map, it was five thousand three hundred and eighty two.",
    ],
    # show-it-don't-voice-it: S6 (the division stays on screen), S13 (Earth radii, the product on screen)
    "s11_slope_check": [
        "How can we be sure the formula is right everywhere, not just at a few points?",
        "Its slope must match the drawn step: one over cosine phi for each radian of phi.",
        "Let's check its slope at sixty degrees with the centred difference from the derivatives movie.",
        "At sixty one degrees, the formula gives one point three five two four.",
        "At fifty nine degrees, it gives one point two eight two six. [beat]",
        "The difference is zero point zero six nine eight, and the two points are two degrees apart, which is zero point zero three four nine "
        "radians.",
        "Dividing the difference by that step gives about two point zero zero. [beat]",
        "And one over the cosine of sixty degrees is exactly two.",
        "So the formula's slope is the stretch we wanted.",
        "Two more checks.",
        "At the equator, the tangent of forty five degrees is one, and l n of one is zero, so y is zero, as it should be. [beat]",
        "And at the pole, the angle becomes ninety degrees, where the tangent has no end: it grows without limit.",
        "So the pole is infinitely far up the map.",
        "At eighty five degrees, y is already three point one three Earth radii, about nineteen thousand nine hundred and fifty kilometres. "
        "[beat]",
        "That's why Mercator maps are always cut off before the poles, usually somewhere past eighty degrees.",
    ],
    # R16: the rhumb line and its London-Los Angeles bearing recalled from Part 6 (S3, S7)
    "s12_rhumb_straight": [
        "If you skipped, here's what to keep.",
        "Mercator stretches north-south by the same amount as east-west, one over cosine phi, so his map grows taller and taller towards the "
        "poles, and it can never show the poles themselves.",
        "Now we can see why a rhumb line is straight on a Mercator map.",
        "A rhumb line, as we saw in Part 6, keeps one compass bearing.",
        "Zoom into any short piece of it.",
        "On the globe, it's a tiny slanted step: some distance west, and some distance south.",
        "Keeping the same bearing means the same slant everywhere.",
        "For Part 6's rhumb line from London to Los Angeles, at two hundred and fifty eight and a half degrees, every piece goes about four "
        "point nine kilometres west for each kilometre south. [beat]",
        "Now draw it on the Mercator map.",
        "At each latitude, Mercator stretches the west part and the south part by the same amount, one over cosine phi.",
        "Stretching both parts by the same amount leaves their ratio unchanged.",
        "So on the map, every piece of the route has the same slant, four point nine across for each one down.",
        "A line whose slant never changes is a straight line. [beat]",
        "The great circle keeps changing its bearing, so on this map it comes out curved, bulging towards the pole.",
        "The two routes swap looks: on the globe, the great circle looks straight and the rhumb line curves, and on Mercator's map it's the "
        "other way round.",
    ],
    # show-it-don't-voice-it: S3, S5, S7, S10 (the products, the square and the division stay on screen)
    "s13_area_stretch": [
        "But keeping shapes has a price: sizes.",
        "How much is an area stretched?",
        "Take a small square on the globe at sixty degrees north, a hundred kilometres on each side.",
        "Its area is ten thousand square kilometres.",
        "On a Mercator map, its width is stretched by two, and its height by two as well.",
        "So it's drawn two hundred kilometres wide and two hundred tall, an area of forty thousand square kilometres: four times too big. [beat]",
        "In general, the width is stretched by k and the height by k, so the area is stretched by k times k, k squared, which is one over cosine "
        "phi, squared.",
        "At Svalbard, k is about four point nine, and squaring it gives about twenty four, so areas there are drawn about twenty four times too "
        "big. [beat]",
        "That's why, on a Mercator map, Greenland looks about as big as Africa.",
        "In truth, Greenland covers about two point one seven million square kilometres, and Africa about thirty point four million.",
        "Dividing Africa's area by Greenland's gives about fourteen, so Africa is about fourteen times bigger. [beat]",
        "The Mercator map is great for directions and shapes, and poor for comparing sizes.",
    ],
    # R16: local east/north (Part 4) and theta hat (Part 1) named where used; R19 fact row 7: "a few hundred" km
    "s19_vortex_components": [
        "Let's describe these winds in the map's polar coordinates.",
        "Pick any point, and draw its local east and north arrows, as in Part 4.",
        "The east arrow points round the middle, anticlockwise as seen from above: it's exactly the theta hat of Part 1 at that point.",
        "The north arrow points straight at the middle, towards the pole.",
        "That's the opposite of r hat, which points outward.",
        "So the north arrow is minus r hat. [beat]",
        "That means the eastward wind u is the tangential wind round the pole, and the northward wind v is the radial wind with its sign "
        "flipped, because blowing north means blowing in.",
        "So u sub theta equals u, and u sub r equals minus v.",
        "Westerly winds, the winds from the west, go round anticlockwise, as seen from above the North Pole.",
        "So the polar vortex spins the same way as the hurricane in Part 1, but it's far wider: thousands of kilometres across, instead of a "
        "few hundred.",
        "And unlike a hurricane, it isn't fed by a warm sea: it forms because the polar stratosphere cools in the long winter night.",
    ],
    # show-it-don't-voice-it: S9 (Pythagoras), S10 (the division), S11 + S14 (the dot products); R16: components as in Part 1
    "s20_origin_wheel": [
        "There's one more choice hidden in polar coordinates: where to put the origin.",
        "Let's see why it matters with a simple flat example first.",
        "Picture a ring of air, a thousand kilometres from its own centre, going round anticlockwise at ten metres per second.",
        "With the origin at its centre, every air parcel on the ring moves purely round.",
        "The tangential wind is ten, and the radial wind is zero, all the way round.",
        "Now keep the same air, but move the origin five hundred kilometres to the west.",
        "Look at the top of the ring, due north of the centre.",
        "There, the wind blows due west: u is minus ten, and v is zero.",
        "Seen from the new origin, this point is five hundred kilometres east and a thousand kilometres north.",
        "Its distance comes from Pythagoras: we square the two legs, add them, and take the square root, which gives about one thousand one "
        "hundred and eighteen kilometres.",
        "To get its r hat, we divide each leg by that distance, which gives zero point four four seven and zero point eight nine four. [beat]",
        "As in Part 1, the radial wind is the dot product of the wind with r hat: we multiply u by r hat's first part and v by its second, and "
        "add them, which gives about minus four and a half.",
        "It looks as if the air is flowing in. [beat]",
        "The tangential wind uses theta hat, minus zero point eight nine four, zero point four four seven.",
        "Doing the same with theta hat's two parts gives about eight point nine. [beat]",
        "Same air, same wind, but the new origin splits it differently.",
        "Nothing is flowing in at all: the in and out part comes only from where we put the origin.",
    ],
    # R16: the ring split and average from Part 1 (S3)
    "s21_origin_vortex": [
        "Now back to the vortex.",
        "Its own centre isn't at the pole.",
        "It's at about seventy two point nine degrees north and forty four point three degrees east, over the Barents Sea, about one thousand "
        "nine hundred kilometres from the pole.",
        "Let's draw a ring two thousand kilometres from the pole, split the wind at each point on it into its round and in and out parts with "
        "the pole as the origin, and average round the ring, as in Part 1.",
        "The round part averages only about seventeen and a half metres per second, and the in and out part is typically about thirty three, "
        "almost twice as big: a ratio of about one point nine. [beat]",
        "Now draw a ring two thousand kilometres from the vortex's own centre instead.",
        "The round part averages about forty seven metres per second, and the in and out part is typically about twenty, less than half: a "
        "ratio of about zero point four. [beat]",
        "So about its own centre, the vortex is mostly spin, just like the hurricane round its eye.",
        "Choosing the origin is part of choosing good coordinates: put it at the centre of the thing that turns.",
        "When the polar vortex weakens or splits, cold air can spill south into the places where people live.",
        "That story has its own movies later in this series: Waves on the jet, and The polar vortex.",
    ],
    # R3 (last part: closes the series): the recap with numbers, one closing line, then the two-sentence teaser for #6 (continuity §3)
    "s22_recap": [
        "To sum up, flattening the Earth always stretches something.",
        "The flat square map, with x equal to the Earth's radius times lambda, and y equal to the radius times phi, is true along the equator "
        "and the meridians, but it stretches east-west by one over cosine phi: about one and a half times at Brest.",
        "Scale factors like this matter whenever we measure slopes on a weather grid, where one degree east at Brest is only seventy three "
        "point eight kilometres.",
        "Mercator stretches north-south by the same amount, so small shapes and angles stay right, and rhumb lines are straight.",
        "His map's height is the Earth's radius times l n of the tangent of forty five degrees plus half the latitude, which puts Brest about "
        "six thousand one hundred and sixty seven kilometres above the equator.",
        "But areas grow by one over cosine phi, squared, about twenty four times at Svalbard, so equal-area maps are better for comparing "
        "amounts.",
        "Seen from above the North Pole, a map is polar coordinates again: east is round, north is in, and the polar vortex is mostly spin "
        "about its own centre.",
        "With that, our seven parts on coordinates are complete, from arrows on a flat map to winds over the whole round Earth.",
        "Next in this series comes the gradient: how fast, and in which direction, temperature or pressure changes across a map.",
        "It's where the one over the Earth's radius times cosine phi that we met here does its real work.",
    ],
}

NOTE = "> remake 2026-11-07: changed (see remake_2026-11-07_log.md)."


def split(par: str) -> list[str]:
    import types
    sys.modules.setdefault("soundfile", types.ModuleType("soundfile"))
    import tts
    return tts.sentences(par)


def scene_blocks(md: str) -> list[tuple[str, int, int]]:
    lines = md.split("\n")
    heads = [(i, m.group(1)) for i, ln in enumerate(lines) if (m := re.match(r"^##\s+(s\d\d\w*)\s*$", ln))]
    return [(sid, i, heads[k + 1][0] if k + 1 < len(heads) else len(lines)) for k, (i, sid) in enumerate(heads)]


def main() -> int:
    check = "--check" in sys.argv
    sp = MOV / "script.md"
    md = sp.read_text(encoding="utf-8")
    lines = md.split("\n")
    new_vo: dict[str, str] = {}
    out: list[str] = []
    last = 0
    for sid, i, j in scene_blocks(md):
        out += lines[last:i]
        last = j
        if sid in CUT:
            continue
        block = lines[i:j]
        spk = [n for n, ln in enumerate(block) if n > 0 and ln.strip() and not ln.strip().startswith(">") and not ln.startswith("#")]
        sents = split(" ".join(block[n] for n in spk))
        if sid in SCENE:
            for s in SCENE[sid]:
                if len(split(s)) != 1:
                    print(f"FAIL {sid}: '{s[:60]}…' splits into {len(split(s))} sentences")
                    return 1
            sents = list(SCENE[sid])
            out += [block[0], NOTE, " ".join(sents), ""]
        else:
            out += block
        new_vo[sid] = " ".join(sents)
    out += lines[last:]
    txt = re.sub(r"\n{3,}", "\n\n", "\n".join(out))
    if check:
        print("check: OK,", len(new_vo), "scenes")
        return 0
    sp.write_text(txt, encoding="utf-8")
    sbp = MOV / "storyboard.yaml"
    sl = sbp.read_text(encoding="utf-8").split("\n")
    for sid in CUT:
        if f"- id: {sid}" not in sl:
            continue
        i0 = sl.index(f"- id: {sid}")
        i1 = next((i for i in range(i0 + 1, len(sl)) if sl[i].startswith("- id: ") or (sl[i].strip() and not sl[i].startswith(" "))), len(sl))
        sl = sl[:i0] + sl[i1:]
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    from revoice import _set_block
    for sid, v in new_vo.items():
        sl = _set_block(sl, sid, "voiceover", v)
    sbp.write_text("\n".join(sl), encoding="utf-8")
    sb = yaml.safe_load(sbp.read_text(encoding="utf-8"))
    bad = [s["id"] for s in sb["scenes"] if re.sub(r"\s+", " ", s["voiceover"]).strip() != new_vo.get(s["id"], "").strip()]
    print(f"script.md + storyboard: {len(sb['scenes'])} scenes ({', '.join(CUT)} cut); voiceovers differing from the script: {bad or 'none'}")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
