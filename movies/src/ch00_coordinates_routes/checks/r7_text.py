"""ch00_coordinates_routes (#5f, Coordinates Part 6) REMAKE 2026-11-07: every narration change, in one place.

Master plan R1 (title, no "easy"), R3 (smooth ending: recap, two-sentence teaser, picture + music fade together), R16 (earlier results
recalled at their point of use), R19 (facts: Part 6's fact rows are all OK; new claims in the log's fact table), §C (no opening recap:
s02 cut); continuity_plan §3 (5f recall table + teaser), §5 (title), §6 (ending: drop s13's teaser line), §7 (5f work list: cut s02,
recalls at s04, s07, s08, s11, the Part 4 puck paid off in s06). House rules 2026-11-07: natural openings (s00 "see how they're used to",
s01 "Now let's dive into …"), show the arithmetic / voice the meaning (no read-out products, sums, divisions), non-obvious inputs said.

SCENE = scene id -> the full new list of sentences ("[beat]" at the end of a sentence where wanted); KEEP marks the sentences re-used
word for word (their measured clips are spliced back). CUT = scenes removed. Rewrites movies/ch00/ch00_coordinates_routes/script.md
(scene paragraphs, a "> remake" note under each changed heading; the stale "> words · … measured" note of a changed scene is dropped)
and the storyboard voiceovers (line-based; the cut scene's block is removed). Idempotent.

usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_routes/checks/r7_text.py [--check]
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[4]
MOV = ROOT / "movies" / "ch00" / "ch00_coordinates_routes"
sys.path.insert(0, str(ROOT / "tools"))

CUT = ["s02_part5_recap"]

SCENE: dict[str, list[str]] = {
    # R1 / §5 / natural openings: no "easy", no "how meteorology uses them"; "Coordinates" (title line 1) pulses on "coordinates"
    "s00_title": [
        "In this video, we'll learn about routes across our round Earth and the coordinates behind them, and see how they're used to plan "
        "the shortest flights.",
    ],
    # natural openings: the lead-in names this part's own pieces (S0, S1, S3 re-used)
    "s01_hook": [
        "What's the shortest way from London to Los Angeles, and why doesn't a plane fly the way a flat map seems to point?",
        "This is the sixth of seven parts on coordinates.",
        "Now let's dive into the pieces we need: scale factors, which turn a change in latitude or longitude into kilometres, and the great "
        "circle, the shortest route over our round Earth.",
        "Then let's meet the route that sailors used for centuries, and see why they liked it.",
    ],
    # R16: the arc rule (Part 1) and the distances / the letter a (Part 3) recalled where used; show-it-don't-voice-it in S10, S13
    "s04_scale_factors": [
        "How far do we walk when one coordinate changes by a small step?",
        "In Part 1, we found the arc rule: on a ring of radius r, turning by a small angle delta theta walks r times delta theta.",
        "So for theta, the distance walked is r times the step.",
        "That multiplier, the metres walked per unit of the coordinate, is called a scale factor.",
        "For theta, the scale factor is r.",
        "On the Earth, as we found in Part 3, stepping north by a small change in latitude, delta phi, walks the Earth's radius times delta phi.",
        "So the scale factor of latitude is the Earth's radius, which we write as the letter a, about six thousand three hundred and seventy one "
        "kilometres.",
        "Stepping east by a small change in longitude, delta lambda, walks round a parallel, a circle whose radius is the Earth's radius times "
        "cosine phi.",
        "So the scale factor of longitude is the Earth's radius times cosine phi.",
        "Let's put numbers on it at Brest, at forty eight point four degrees north.",
        "One degree is zero point zero one seven four five radians.",
        "So one degree north walks the Earth's radius times that, about a hundred and eleven point two kilometres. [beat]",
        "The cosine of forty eight point four degrees is zero point six six four.",
        "So one degree east walks those hundred and eleven point two kilometres times the cosine, only about seventy three point eight "
        "kilometres. [beat]",
        "The same one-degree step gives two different distances, and the scale factors keep track of that.",
    ],
    # continuity_plan §3: the Part 4 puck ("along a great circle, which we'll meet in Part 6") paid off (S0-S9 re-used)
    "s06_great_circle": [
        "Let's find the great circle through London and Los Angeles.",
        "London is at fifty one and a half degrees north, almost on the prime meridian.",
        "Los Angeles is at thirty four degrees north, and a hundred and eighteen degrees west.",
        "Picture a flat sheet slicing through the globe, so that it passes through London, through Los Angeles, and through the Earth's centre.",
        "Three points that aren't in a line fix exactly one flat sheet, just as three legs steady a stool.",
        "Where the sheet cuts the Earth's surface, it traces a great circle, and the part between the two cities is the great circle route.",
        "Why is it the shortest?",
        "Think of all the circles on the globe that pass through both cities.",
        "The great circle is the biggest of them, so between the two cities it bends the least.",
        "A string pulled tight between the two cities on a desk globe lies right along it.",
        "And the puck from Part 4, gliding over a smooth Earth with nothing pushing it, was moving along exactly such a great circle.",
    ],
    # show-it-don't-voice-it: S8, S12, S13 say what is combined (cosine phi times sine lambda …) and the result, not the products
    "s08_position_arrows": [
        "The next few minutes work out sigma step by step, with every number.",
        "They're here for anyone who enjoys seeing every step, but you don't need them for the intuition behind weather, climate science or GIS.",
        "If it feels like a lot, skip ahead to the time on screen, and you won't miss the big idea.",
        "To find sigma, we need the two position arrows of length one, r hat one for London and r hat two for Los Angeles.",
        "From Part 3, each one is cosine phi cosine lambda, cosine phi sine lambda, sine phi.",
        "London is at fifty one point five one degrees north, and zero point one three degrees west, so its lambda is minus zero point one "
        "three degrees.",
        "The cosine of fifty one point five one degrees is zero point six two two, and the cosine of minus zero point one three degrees is "
        "almost exactly one.",
        "So the first part is zero point six two two. [beat]",
        "The sine of minus zero point one three degrees is minus zero point zero zero two three, so the second part, cosine phi times sine "
        "lambda, is about minus zero point zero zero one. [beat]",
        "The third part is the sine of fifty one point five one degrees, zero point seven eight three. [beat]",
        "Los Angeles is at thirty four point zero five degrees north, and a hundred and eighteen point two four degrees west, so its lambda is "
        "minus a hundred and eighteen point two four degrees.",
        "Its cosine phi is zero point eight two nine, its cosine lambda is minus zero point four seven three, and its sine lambda is minus "
        "zero point eight eight one.",
        "So its first part, cosine phi times cosine lambda, is about minus zero point three nine two. [beat]",
        "Its second part, cosine phi times sine lambda, is about minus zero point seven three zero. [beat]",
        "And its third part, the sine of thirty four point zero five degrees, is zero point five six zero. [beat]",
    ],
    # show-it-don't-voice-it: the three products and their sum stay on screen; the voice says which parts are multiplied, then the result
    "s09_cos_sigma": [
        "Now let's use the rule from the dot product movie.",
        "The dot product of two arrows is the product of their lengths, times the cosine of the angle between them.",
        "Our two arrows both have length one, so their dot product is just the cosine of sigma.",
        "That's the shadow picture again: the shadow of one arrow of length one on the other.",
        "To take the dot product, we multiply London's first part by Los Angeles' first part, then the second parts, and then the third "
        "parts, and add the three products.",
        "That gives about zero point one nine five, so the cosine of sigma is zero point one nine five. [beat]",
        "Which angle has a cosine of zero point one nine five?",
        "A calculator's inverse cosine says about seventy eight point seven degrees. [beat]",
        "A cosine just below zero point two means an angle a little less than ninety degrees, so London and Los Angeles are almost a "
        "quarter of the way round the Earth from each other.",
    ],
    # show-it-don't-voice-it: S2, S3, S5 (the conversions and the product stay on screen)
    "s10_distance": [
        "The arc rule needs sigma in radians.",
        "One degree is pi over a hundred and eighty radians, about zero point zero one seven four five.",
        "So sigma, seventy eight point seven three eight degrees to be exact, is about one point three seven four two radians. [beat]",
        "Now the distance is the Earth's radius, six thousand three hundred and seventy one kilometres, times sigma in radians.",
        "That's about eight thousand seven hundred and fifty five kilometres. [beat]",
        "Let's check it the quick way: every degree of sigma is about a hundred and eleven point two kilometres, so seventy eight point seven "
        "four degrees make about eight thousand seven hundred and fifty six kilometres, the same to within the rounding. [beat]",
        "At a cruising speed of about nine hundred kilometres per hour, that's nearly ten hours in the air, before any help or hindrance "
        "from the winds.",
    ],
    # R16: the heading comes from Part 4's local east and north arrows (new S5; the on-screen F1 rows are now voiced as what is combined)
    "s11_route_shape": [
        "If you skipped, here's what to keep.",
        "Seen from the Earth's centre, London and Los Angeles are about seventy nine degrees apart, so the great circle route between them is "
        "about eight thousand seven hundred and fifty five kilometres long.",
        "Where does this route go?",
        "On most flat maps, Los Angeles looks to the west-south-west of London.",
        "But the great circle leaves London heading north-west, at a compass bearing of about three hundred and twelve degrees.",
        "That heading comes from London's own east and north arrows, from Part 4: we measure how much of Los Angeles' position arrow points "
        "along each one, and turn that into a compass bearing.",
        "It climbs to its highest latitude, about sixty two point four degrees north, near the south-west coast of Greenland.",
        "Then it turns south over northern Canada, and arrives at Los Angeles heading south-west, at a bearing of about two hundred and "
        "fourteen degrees. [beat]",
        "So along the way, the compass heading changes by almost a hundred degrees.",
        "That's why flights from Europe to California pass over Greenland and Canada.",
    ],
    # show-it-don't-voice-it: S5 (the division stays on screen)
    "s12_rhumb": [
        "Sailors used a different route for centuries.",
        "It's called the rhumb line: a route that keeps the same compass bearing all the way, so it crosses every meridian at the same angle.",
        "From London to Los Angeles, the rhumb line holds a bearing of about two hundred and fifty eight and a half degrees, a little south "
        "of due west.",
        "It stays further south than the great circle, and it's about nine thousand seven hundred and thirty three kilometres long. [beat]",
        "How much longer is that?",
        "Dividing the rhumb line's length by the great circle's gives about one point one one, so the rhumb line is about eleven percent "
        "longer. [beat]",
        "The extra is about nine hundred and seventy eight kilometres, more than an hour of flying at nine hundred kilometres per hour. [beat]",
        "And if you kept following a rhumb line, it would spiral round and round towards a pole.",
    ],
    # §6: the Part 7 teaser is said once, in the recap; s13's last sentence goes (its keyword stays)
    "s13_why_rhumb": [
        "So why would anyone choose the longer route?",
        "There are three reasons.",
        "The first is steering.",
        "A rhumb line needs one compass setting for the whole trip: set two hundred and fifty eight and a half degrees, and hold it.",
        "The great circle needs a new heading all the time, from three hundred and twelve degrees at London to two hundred and fourteen at "
        "Los Angeles.",
        "Before satellites and computers, a ship's navigator with a compass could steer a rhumb line easily, but a great circle only with a "
        "lot of calculation.",
        "The second reason is that, on short trips, the extra distance is tiny.",
        "From Brest to Lisbon, about one thousand one hundred and thirty eight kilometres, the rhumb line is only about a hundred and fifty "
        "metres longer. [beat]",
        "The third reason is a map.",
        "On the most famous flat map, the Mercator map, a rhumb line is a straight line.",
        "So a navigator could draw the route with a ruler, read off its angle, and steer by it.",
        "That's why long voyages were often split into a few rhumb-line legs that follow the great circle closely: each leg is easy to "
        "steer, and the whole route is nearly the shortest.",
    ],
    # R3 / continuity_plan §3: S0-S6 kept; the two-sentence teaser naming Part 7's content and why
    "s14_recap": [
        "To sum up, curvilinear coordinates have curved lines, unit vectors that turn, and scale factors that turn a change of coordinate "
        "into a distance.",
        "On the Earth, the scale factor of latitude is the Earth's radius, and of longitude, the radius times cosine phi.",
        "The shortest way between two places follows a great circle, whose centre is the Earth's centre.",
        "Its length is the Earth's radius times sigma, the angle at the centre, and the cosine of sigma is the dot product of the two "
        "position arrows.",
        "From London to Los Angeles, that's about seventy eight point seven degrees, or about eight thousand seven hundred and fifty five "
        "kilometres.",
        "Along the great circle, the compass heading changes all the way, from three hundred and twelve degrees to two hundred and fourteen.",
        "A rhumb line keeps one compass bearing, so it's easy to steer, but here it's about eleven percent longer.",
        "In Part 7, we'll flatten the Earth onto maps, and work out exactly what each map stretches.",
        "That explains why the rhumb line comes out straight on the most famous map of all, and why weather data on a grid need care near "
        "the poles.",
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
            want = [split(s)[0] if len(split(s)) == 1 else s for s in SCENE[sid]]
            for s in SCENE[sid]:
                if len(split(s)) != 1:
                    print(f"FAIL {sid}: '{s[:60]}…' splits into {len(split(s))} sentences")
                    return 1
            sents = want
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
