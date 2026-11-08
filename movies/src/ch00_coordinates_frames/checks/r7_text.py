"""ch00_coordinates_frames (#5d, Coordinates Part 4) REMAKE 2026-11-07: the narration changes, in one place.

Master plan R1 (title, no "easy"), R3 (smooth ending), R15 (the Fort Myers Beach calculation now lives in Part 2; 5d keeps a recall
and its own 3-D and lat/lon -> km steps), R16 (recall at the point of use), R19 (facts), §C (no opening recap: s02 cut);
continuity_plan §2c (5d coast block), §3 (5d recall table, recap S4, teaser), §5 (title), §6 (ending), §7 (5d work list);
series_audit P5 (no spoken "Step one ... six" in s18-s19).

Each entry: scene id -> {sentence index (in the CURRENT script): new text, or None to drop it} or a full list of sentences (the
scene is rewritten). CUT = scenes removed. The tool rewrites movies/ch00/ch00_coordinates_frames/script.md (scene paragraphs; a
"> remake 2026-11-07" note line under each changed heading) and the storyboard voiceovers (line-based; the cut scenes' blocks are
removed). Idempotent: a second run finds the new text in place.

usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_frames/checks/r7_text.py [--check]
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[4]
MOV = ROOT / "movies" / "ch00" / "ch00_coordinates_frames"
sys.path.insert(0, str(ROOT / "tools"))

CUT = ["s02_part3_recap", "s12_coast_angle", "s13_alpha", "s14_along_across"]

# full rewrites (lists of sentences, "[beat]" kept at the end of a sentence where wanted)
SCENE: dict[str, list[str]] = {
    # R1 / §5: no "easy", the first sentence says what this part is about; "Coordinates" pulses on "coordinates"
    "s00_title": [
        # opening rule 2026-11-07: not "how meteorology uses them"; "see how they're used to …"
        "In this video, we'll learn local frames, the coordinates every weather station uses, and see how they're used to "
        "follow the wind as the air moves over the round Earth.",
    ],
    # §2c item 1: s10 becomes a recall of Part 2 (equations "derived in Part 1", result "found in Part 2") + the 3-D point, then the
    # question that leads to s11 (where Part 2's km legs come from). S3, S4 are the old S4, S5 (re-used clips).
    "s10_coast_frame": [
        "Sometimes a forecaster turns her east and north arrows on purpose.",
        "On a coast, what matters is the part of the wind blowing along the shore, and the part blowing across it, onto the land or out to sea.",
        "We did exactly this in Part 2, for Hurricane Ian at Fort Myers Beach, on the south-west coast of Florida, with the turned axes from Part 1.",
        "The new along arrow, x hat prime, is cosine alpha times i hat, plus sine alpha times j hat.",
        "The new across arrow, y hat prime, is that one turned by ninety degrees: minus sine alpha times i hat, plus cosine alpha times j hat.",
        "The coast there runs at a bearing of three hundred and twenty nine degrees, so alpha was a hundred and twenty one degrees, and y hat prime pointed out to sea.",
        "Then Ian's wind split into about nine point four metres per second along the shore, and about minus thirty one and a half across it, which means onto the land.",
        "In three dimensions, there's one more arrow: we keep up, k hat, as it is, and turn only i hat and j hat, by the angle alpha, anticlockwise as seen from above.",
        "One question was left open in Part 2: the coast's two legs, ninety one and a half kilometres north and fifty five kilometres west, were read off a flat map in kilometres.",
        "Now we can work them out from latitude and longitude.",
    ],
    # recap: S3 rewritten (continuity_plan §3 5d S4), the teaser in two sentences naming Part 5's content (R3)
    "s28_recap": [
        "To sum up, a forecaster's local frame has three arrows: i hat east, j hat north and k hat up, and the wind is u i hat, plus v j hat, plus w k hat.",
        "Up is the arrow from the Earth's centre, east comes from turning in the view from above the pole, and north from turning in the meridian slice.",
        "Every place has its own frame: Brest's up and Khulna's up are about seventy five point eight degrees apart.",
        "With Part 3's rules, the latitudes and longitudes of Naples and Englewood gave the coast's two legs, ninety one and a half kilometres north and fifty five west: "
        "the legs behind the coast's bearing of three hundred and twenty nine degrees in Part 2.",
        "As the air moves, the arrows turn by themselves, at speeds divided by radii.",
        "So the eastward acceleration is capital D u by D t, minus u v tangent phi over the radius, plus u w over the radius: two metric terms that come only from the turning arrows.",
        "For an ordinary wind, they're about sixty six times smaller than the Coriolis effect, but weather and climate models keep them.",
        "In Part 5, we'll let the frame itself move, and ride along with a storm as it crosses the English Channel.",
        "That shows which parts of the storm's winds come from its own spin, and which come only from its motion, and what a barometer sees as the storm passes.",
    ],
}

# single-sentence edits: scene -> {index: (old text or None for "append", new text)}
EDIT: dict[str, dict[int, tuple[str | None, str]]] = {
    "s01_hook": {4: ("Let's see what local frames are, how to turn them to fit a coast, how they turn by themselves as the air moves, and why that matters for the wind.",
                     "Let's see what local frames are, how they differ from place to place, how they turn by themselves as the air moves, and why that matters for the wind.")},
    # R16: Part 3's Earth axes (was in the cut s02) and latitude / longitude recalled where first used
    "s04_k_up": {
        3: ("Each of the three arrows can be written with the Earth's fixed axes, x hat, y hat and z hat.",
            "Each of the three arrows can be written with the Earth's fixed axes from Part 3: x hat points to latitude zero and longitude zero, y hat to latitude zero "
            "and ninety degrees east, and z hat to the North Pole."),
        7: ("So k hat is cosine phi cosine lambda, cosine phi sine lambda, sine phi. [beat]",
            "So k hat is cosine phi cosine lambda, cosine phi sine lambda, sine phi, where phi is the latitude and lambda the longitude. [beat]"),
    },
    # continuity_plan §4: Amphan recalled as "from Part 2", without the full description
    "s09_khulna": {3: ("In May twenty twenty, the centre of Cyclone Amphan passed about seventy nine kilometres west of Khulna, and the sea flooded the coast to its south.",
                       "In May twenty twenty, the centre of Cyclone Amphan, which we met in Part 2, passed about seventy nine kilometres west of Khulna, and the sea "
                       "flooded the coast to its south.")},
    # §2c item 3: the old s12 shrinks to one sentence here (the bearing Part 2 used); its round-Earth bearing (a Part 6 tool) is cut
    "s11_coast_points": {14: (None,
                              "These are the two legs Part 2 used for the coast's bearing: fifty five over ninety one and a half is zero point six zero one, the tangent of "
                              "thirty one degrees, so the bearing is three hundred and sixty minus thirty one, which is three hundred and twenty nine degrees. [beat]")},
    # R16: Part 3's km per degree recalled at its use
    "s15_arrows_turn": {4: ("At Brest, one degree of longitude is about seventy four kilometres, so that's nine hundred divided by seventy four: about twelve degrees of longitude. [beat]",
                            "As we found in Part 3, at Brest one degree of longitude is about seventy four kilometres, so that's nine hundred divided by seventy four: about "
                            "twelve degrees of longitude. [beat]")},
    # series_audit P5: no spoken step numbers (the on-screen step chips stay)
    "s18_i_east_a": {
        3: ("Step one: how fast does lambda grow?", "First, how fast does lambda grow?"),
        6: ("Step two: Part 2's rule says theta hat changes towards minus r hat.", "Next, Part 2's rule says theta hat changes towards minus r hat."),
        8: ("Step three: multiply the two, by the chain rule.", "Now multiply the two, by the chain rule."),
    },
    "s19_i_east_b": {
        5: ("Step four: multiply the first line by cosine phi, and the second line by sine phi.",
            "Next, multiply the first line by cosine phi, and the second line by sine phi."),
        6: ("Step five: take the second line away from the first.", "Then take the second line away from the first."),
        11: ("Step six: put minus capital R hat into step three.", "Now put minus capital R hat into the chain-rule result we found a moment ago."),
    },
}

# USER RULE 2026-11-07 "show it, don't voice it" (HOUSE_STYLE §calculations; memory dont-voice-simple-arithmetic): plain-number arithmetic
# stays ON SCREEN (the CalcStack rows are unchanged) but is not read aloud; the voice names what is combined and the result. Applied
# AFTER EDIT (old = the text after EDIT). Symbolic steps (equations, the product / chain rule) are genuinely new steps and stay voiced.
ARITH: dict[str, dict[int, tuple[str, str]]] = {
    "s04_k_up": {
        12: ("So the first part of k hat is zero point six six four times zero point nine nine seven, which is zero point six six two.",
             "Multiplying these out, the first part of k hat is about zero point six six two."),
        13: ("The second is zero point six six four times minus zero point zero seven eight, which is minus zero point zero five two.",
             "The second is about minus zero point zero five two."),
    },
    "s07_enu_checks": {
        1: ("For i hat, zero point zero seven eight squared, plus zero point nine nine seven squared, is one. [beat]",
            "For i hat, the squares of its parts add up to one. [beat]"),
        2: ("The dot product of i hat and j hat is zero point zero seven eight times minus zero point seven four five, plus zero point nine nine seven times zero point zero five nine, plus zero.",
            "Next, the dot product of i hat and j hat: we multiply the matching parts, and add them."),
        3: ("That's minus zero point zero five eight, plus zero point zero five nine: zero, up to rounding.",
            "That gives zero, up to rounding."),
    },
    "s08_other_stations": {
        5: ("By the arc rule, that's the distance divided by the radius: four hundred and eighty over six thousand three hundred and seventy one.",
            "By the arc rule, that's the distance divided by the Earth's radius."),
        12: ("That's minus zero point one five eight, minus zero point zero five zero, plus zero point zero one eight, which is minus zero point one nine one. [beat]",
             "That gives minus zero point one nine one. [beat]"),
    },
    "s09_khulna": {
        6: ("Dotted with Brest's up, that's zero point zero zero four, minus zero point zero four eight, plus zero point two nine zero: zero point two four six.",
            "Dotted with Brest's up, that gives zero point two four six."),
    },
    "s11_coast_points": {
        9: ("Zero point eight two three degrees is zero point zero one four three six radians, so the step north is six thousand three hundred and seventy one times zero point zero one four three six: about ninety one and a half kilometres. [beat]",
            "In radians, zero point eight two three degrees is zero point zero one four three six, so the step north is the radius times that: about ninety one and a half kilometres. [beat]"),
        12: ("So the step east is six thousand three hundred and seventy one, times zero point eight nine five, times minus zero point zero zero nine six five: about minus fifty five kilometres. [beat]",
             "With the change in longitude, minus zero point zero zero nine six five radians, the step east comes out at about minus fifty five kilometres. [beat]"),
        14: ("These are the two legs Part 2 used for the coast's bearing: fifty five over ninety one and a half is zero point six zero one, the tangent of thirty one degrees, so the bearing is three hundred and sixty minus thirty one, which is three hundred and twenty nine degrees. [beat]",
             "These are the two legs Part 2 used for the coast's bearing: their ratio, zero point six zero one, is the tangent of thirty one degrees, so the coast runs thirty one degrees west of north, a bearing of three hundred and twenty nine degrees. [beat]"),
    },
    "s15_arrows_turn": {
        3: ("In one hour, it covers two hundred and fifty times three thousand six hundred metres: nine hundred kilometres. [beat]",
            "In one hour, it covers nine hundred kilometres. [beat]"),
        4: ("As we found in Part 3, at Brest one degree of longitude is about seventy four kilometres, so that's nine hundred divided by seventy four: about twelve degrees of longitude. [beat]",
            "As we found in Part 3, at Brest one degree of longitude is about seventy four kilometres, so that's about twelve degrees of longitude. [beat]"),
    },
    "s20_jk_north": {
        9: ("A hundred and eleven kilometres north, divided by six thousand three hundred and seventy one kilometres, is zero point zero one seven five radians: the one-degree tilt of up that we saw before. [beat]",
            "A hundred and eleven kilometres north, over the Earth's radius, is about zero point zero one seven five radians: the one-degree tilt of up that we saw before. [beat]"),
    },
    "s27_metric_size": {
        2: ("U v tangent phi over the radius is ten times ten times one, divided by six point three seven one million metres.",
            "Let's put these numbers into u v tangent phi over the radius, with the Earth's radius, six point three seven one million metres."),
        3: ("That's about one point six times ten to the minus five metres per second squared. [beat]",
            "That gives about one point six times ten to the minus five metres per second squared. [beat]"),
        5: ("Two times seven point two nine times ten to the minus five, times zero point seven zero seven, is one point zero three times ten to the minus four per second.",
            "With the Earth's spin rate, Omega, seven point two nine times ten to the minus five per second, f at forty five degrees is about one point zero three times ten to the minus four per second."),
        6: ("Times ten metres per second, that's about one point zero times ten to the minus three. [beat]",
            "Multiplying by the northward wind, ten metres per second, gives about one point zero times ten to the minus three. [beat]"),
    },
}

# USER CLARIFICATION 2026-11-07: keep RELATING the numbers in the voice (what is combined, where each number comes from), without reading
# the individual products / sums; then the result. Applied after ARITH (old = the ARITH text).
ARITH2: dict[str, dict[int, tuple[str, str]]] = {
    # opening rule 2026-11-07: no robotic "Let's see what X is" lead-in; an easy-going "Now let's dive into …"
    "s01_hook": {4: ("Let's see what local frames are, how they differ from place to place, how they turn by themselves as the air moves, and why that matters for the wind.",
                     "Now let's dive into local frames: how they differ from place to place, how they turn by themselves as the air moves, and why that matters for the wind.")},
    "s04_k_up": {
        12: ("Multiplying these out, the first part of k hat is about zero point six six two.",
             "The first part of k hat is cosine phi times cosine lambda, which comes to about zero point six six two."),
        13: ("The second is about minus zero point zero five two.",
             "The second, cosine phi times sine lambda, comes to about minus zero point zero five two."),
    },
    "s07_enu_checks": {
        1: ("For i hat, the squares of its parts add up to one. [beat]",
            "For i hat, the squares of its east and north parts add up to one. [beat]"),
        2: ("Next, the dot product of i hat and j hat: we multiply the matching parts, and add them.",
            "Next, the dot product of i hat and j hat: we multiply their first parts, their second parts and their third parts, and add them."),
    },
    "s08_other_stations": {
        12: ("That gives minus zero point one nine one. [beat]", "Those three products add up to minus zero point one nine one. [beat]"),
    },
    "s09_khulna": {
        # house rule 2026-11-07: inputs a viewer can't see at a glance (trig values) are SAID (and highlighted on their words)
        5: ("Its up arrow is zero point zero zero six, zero point nine two two, zero point three eight eight. [beat]",
            "There, cosine phi is zero point nine two two, sine phi zero point three eight eight, cosine lambda zero point zero zero seven and sine lambda "
            "almost exactly one, so its up arrow is zero point zero zero six, zero point nine two two, zero point three eight eight. [beat]"),
        6: ("Dotted with Brest's up, that gives zero point two four six.",
            "Dotted with Brest's up, part by part, that gives zero point two four six."),
    },
    "s11_coast_points": {
        9: ("In radians, zero point eight two three degrees is zero point zero one four three six, so the step north is the radius times that: about ninety one and a half kilometres. [beat]",
            "One degree is zero point zero one seven four five radians, so zero point eight two three degrees is zero point zero one four three six radians, and the "
            "step north is the radius times that: about ninety one and a half kilometres. [beat]"),
        12: ("With the change in longitude, minus zero point zero zero nine six five radians, the step east comes out at about minus fifty five kilometres. [beat]",
             "With the change in longitude, minus zero point zero zero nine six five radians, the step east, the radius times cosine phi times that, comes to about "
             "minus fifty five kilometres. [beat]"),
    },
    "s27_metric_size": {
        5: ("With the Earth's spin rate, Omega, seven point two nine times ten to the minus five per second, f at forty five degrees is about one point zero three times ten to the minus four per second.",
            "With the Earth's spin rate, Omega, seven point two nine times ten to the minus five per second, and the sine of forty five degrees, about zero point "
            "seven zero seven, f is about one point zero three times ten to the minus four per second."),
    },
    "s15_arrows_turn": {
        3: ("In one hour, it covers nine hundred kilometres. [beat]",
            "In one hour, which is three thousand six hundred seconds, it covers nine hundred kilometres. [beat]"),
    },
}

NOTE = "> remake 2026-11-07: changed (see remake_2026-11-07_log.md)."


def split(par: str) -> list[str]:
    import types
    sys.modules.setdefault("soundfile", types.ModuleType("soundfile"))
    import tts
    return tts.sentences(par)


def scene_blocks(md: str) -> list[tuple[str, int, int]]:
    """(id, start line, end line) of every '## sNN' scene in the script"""
    lines = md.split("\n")
    heads = [(i, m.group(1)) for i, ln in enumerate(lines) if (m := re.match(r"^##\s+(s\d\d\w*)\s*$", ln))]
    out = []
    for k, (i, sid) in enumerate(heads):
        j = heads[k + 1][0] if k + 1 < len(heads) else len(lines)
        out.append((sid, i, j))
    return out


def main() -> int:
    check = "--check" in sys.argv
    sp = MOV / "script.md"
    md = sp.read_text(encoding="utf-8")
    lines = md.split("\n")
    new_vo: dict[str, str] = {}
    out: list[str] = []
    last = 0
    problems = []
    for sid, i, j in scene_blocks(md):
        out += lines[last:i]
        last = j
        if sid in CUT:
            continue
        block = lines[i:j]
        # the spoken paragraph: the non-empty, non-note, non-heading lines
        spk = [n for n, ln in enumerate(block) if n > 0 and ln.strip() and not ln.strip().startswith(">") and not ln.startswith("#")]
        par = " ".join(block[n] for n in spk)
        sents = split(par)
        changed = False
        if sid in SCENE:
            want = SCENE[sid]
            if sents != want:
                sents, changed = list(want), True
        if sid in EDIT:
            for idx, (old, new) in sorted(EDIT[sid].items()):
                later = {d.get(sid, {}).get(idx, (None, None))[1] for d in (ARITH, ARITH2)} - {None}
                if idx < len(sents) and sents[idx] in later:   # already rewritten by a later pass (idempotent)
                    continue
                if old is None:            # append at idx (idempotent)
                    if idx < len(sents) and sents[idx] == new:
                        continue
                    if idx != len(sents):
                        problems.append(f"{sid}: append at {idx} but the scene has {len(sents)} sentences")
                        continue
                    sents.append(new)
                    changed = True
                    continue
                if sents[idx] == new:
                    continue
                if sents[idx] != old:
                    problems.append(f"{sid} S{idx}: expected\n    {old}\n  found\n    {sents[idx]}")
                    continue
                sents[idx] = new
                changed = True
        for D_ in (ARITH, ARITH2):
          if sid not in D_:
            continue
          for idx, (old, new) in sorted(D_[sid].items()):
                if D_ is ARITH and sents[idx] == ARITH2.get(sid, {}).get(idx, (None, None))[1]:
                    continue
                if sents[idx] == new:
                    continue
                if sents[idx] != old:
                    problems.append(f"{sid} S{idx} (ARITH): expected {old!r}, found {sents[idx]!r}")
                    continue
                sents[idx] = new
        text = " ".join(sents)
        new_vo[sid] = text
        if sid in SCENE or sid in EDIT or sid in ARITH:
            # changed scene: heading, the remake note, the paragraph (the old measured note is stale and dropped)
            out += [block[0], NOTE, text, ""]
        else:
            out += block
    out += lines[last:]
    if problems:
        print("FAIL", *problems, sep="\n  ")
        return 1
    txt = re.sub(r"\n{3,}", "\n\n", "\n".join(out))
    if check:
        print("check: OK,", len(new_vo), "scenes")
        return 0
    sp.write_text(txt, encoding="utf-8")
    # storyboard: drop the cut scenes' blocks, set the voiceovers
    sbp = MOV / "storyboard.yaml"
    sl = sbp.read_text(encoding="utf-8").split("\n")
    for sid in CUT:
        if f"- id: {sid}" not in sl:
            continue
        i0 = sl.index(f"- id: {sid}")
        i1 = next((i for i in range(i0 + 1, len(sl)) if sl[i].startswith("- id: ") or (sl[i].strip() and not sl[i].startswith(" "))), len(sl))
        sl = sl[:i0] + sl[i1:]
    from revoice import _set_block  # line-based block setter (comments and layout kept)
    for sid, v in new_vo.items():
        sl = _set_block(sl, sid, "voiceover", v)
    sbp.write_text("\n".join(sl), encoding="utf-8")
    sb = yaml.safe_load(sbp.read_text(encoding="utf-8"))
    ids = [s["id"] for s in sb["scenes"]]
    bad = [s["id"] for s in sb["scenes"] if re.sub(r"\s+", " ", s["voiceover"]).strip() != new_vo.get(s["id"], "").strip()]
    print(f"script.md + storyboard: {len(ids)} scenes ({', '.join(CUT)} cut); voiceovers differing from the script: {bad or 'none'}")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    sys.exit(main())
