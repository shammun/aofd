"""ch00_coordinates_moving (#5e, Coordinates Part 5) REMAKE 2026-11-07: the narration changes, in one place.

Master plan R1 (title, no "easy"), R3 (smooth ending, two-sentence teaser), R16 (recall at the point of use), R19 (facts: every
Part 5 row of fact_check_2026-11-07.md is OK; the new claims are in remake_2026-11-07_log.md), §C (no opening recap: s02 cut);
continuity_plan §3 (5e recall table + teaser), §5 (title), §6 (ending), §7 (5e work list); series_audit P5 (no spoken
"Step one ... five" in s04, s05, s14) and §3a (s10 recalls the vectors movie's storm-relative wind; s14 recalls grad p);
HOUSE_STYLE 2026-11-07: natural openings (s00 "see how they're used to", s01 "Now let's dive into ..."), show the arithmetic,
voice the meaning (no voiced sums / products / differences of plain numbers), say and highlight non-obvious inputs (s08 sin 71°,
cos 71°).

SCENE: scene id -> the full list of its sentences ("[beat]" kept at the end of a sentence where wanted). Scenes not listed keep
their text (and so their measured clips). CUT = scenes removed. The tool rewrites movies/ch00/ch00_coordinates_moving/script.md
(a "> remake 2026-11-07" note line under each changed heading; the stale measured note is dropped) and the storyboard voiceovers
(line-based; the cut scene's block is removed). Idempotent.

usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_moving/checks/r7_text.py [--check]
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[4]
MOV = ROOT / "movies" / "ch00" / "ch00_coordinates_moving"
sys.path.insert(0, str(ROOT / "tools"))

CUT = ["s02_part4_recap"]

SCENE: dict[str, list[str]] = {
    # R1 / §5 / opening rule 2026-11-07: no "easy", no "how meteorology uses them"; "coordinates" said (the title pulse),
    # "they're used" cues Part B of the title animation
    "s00_title": [
        "In this video, we'll learn moving frames, coordinates that travel along with a train or a storm, and see how they're used to "
        "find a storm's own winds, and what a barometer sees as it passes.",
    ],
    # opening rule 2026-11-07: an easy-going "Now let's dive into …" naming this part's pieces (S3), S4 names the application
    "s01_hook": [
        "Imagine riding along with a storm as it crosses the English Channel.",
        "Would its winds look the same to you as they do to someone standing on the shore?",
        "This is the fifth of seven parts on coordinates.",
        "Now let's dive into moving frames: what changes, and what stays the same, when the frame itself moves.",
        "Then we'll ride along with a real storm, and see what a barometer on the coast saw as it passed.",
    ],
    # show it, don't voice it: S3 no "twenty plus one and a half"
    "s03_train": [
        "Let's start with the simplest moving frame.",
        "Imagine you're on a train gliding along a straight track at a steady twenty metres per second.",
        "You walk towards the front at one and a half metres per second.",
        "Someone standing beside the track sees your speed and the train's speed added together: twenty one and a half metres per second. [beat]",
        "Why do the speeds add?",
        "Let's measure positions along the track.",
        "The person beside the track uses x, measured from the station.",
        "You use x prime, measured from the back of the train.",
        "The back of the train passed the station at time zero, and it moves at capital U, twenty metres per second.",
        "So after a time t, the back of the train is capital U times t from the station. [beat]",
        "Your distance from the station is that, plus your distance from the back of the train: x equals x prime plus capital U t.",
        "And both clocks show the same time: t prime equals t.",
    ],
    # P5: no "step one / step two"; S10 no "one and a half plus twenty is twenty one and a half"
    "s04_velocities_add": [
        "Next come two short derivations: why speeds add, and why accelerations don't change.",
        "They're for those who like every step.",
        "If not, skip ahead to the time on screen: you don't need them for the intuition of weather, climate or maps.",
        "Now let's get the speeds from the positions.",
        "In a short time, delta t, your place on the train changes by delta x prime, and the back of the train moves on by capital U delta t.",
        "So the change seen from the station is the sum of the two: delta x equals delta x prime, plus capital U delta t. [beat]",
        "Next, we divide by delta t.",
        "Delta x over delta t is the speed seen from the ground, small u.",
        "Delta x prime over delta t is the speed seen on the train, u prime.",
        "So u equals u prime plus capital U. [beat]",
        "With our numbers, your walking speed plus the train's speed gives twenty one and a half metres per second again. [beat]",
        "Switching between two frames like this, moving at a steady velocity without turning, is called a Galilean transformation, after Galileo Galilei.",
        "In three dimensions, the same holds for each part: bold v equals bold capital U plus bold v prime.",
    ],
    # P5: "Step one … five" -> First / Next / Then / Now / Finally
    "s05_accel_same": [
        "Here's the beautiful part.",
        "What happens to accelerations?",
        "Let's follow the same steps, one move at a time.",
        "First, at every moment, u equals capital U plus u prime.",
        "Next, a short time later, each of them has changed a little, and the sum still holds.",
        "So delta u equals delta capital U plus delta u prime: the change of a sum is the sum of the changes. [beat]",
        "Then we divide by delta t.",
        "Now let delta t shrink, as in the derivatives movie.",
        "That gives d u by d t equals d capital U by d t, plus d u prime by d t. [beat]",
        "Finally, the train's speed never changes, so d capital U by d t is zero.",
        "So d u by d t equals d u prime by d t: the acceleration is the same in both frames. [beat]",
        "For example, if you speed up from one and a half to two metres per second in one second, the person beside the track sees you go from twenty one and a half to twenty two, in the same second. [beat]",
        "Drop a ball on a smooth train, and it speeds up downwards by nine point eight metres per second every second, for you, and for the person beside the track.",
        "And since Newton's law says force equals mass times acceleration, the same forces explain the motion in both frames.",
        "If you skipped, here's what to keep: in a frame moving steadily in a straight line, speeds change by the frame's own speed, but accelerations, and so forces, stay the same.",
    ],
    # show it, don't voice it: S5, S6, S10, S11, S12 say what is combined and the result (the CalcStack keeps every number)
    "s07_sliding_pattern": [
        "Picture a pattern of stronger and weaker winds, two hundred kilometres from one gust to the next, all blowing east.",
        "The whole pattern slides east at a steady ten metres per second, without changing its shape.",
        "Take one moment, at a place where the wind is thirteen point five four metres per second, and is getting stronger towards the east by zero point one one one metres per second for every kilometre. [beat]",
        "First, ride with the pattern, at capital U, ten metres per second.",
        "To you, the pattern is frozen, so the local change is zero.",
        "Relative to you, the air at that place moves east at the wind's speed minus the pattern's speed: three point five four metres per second, or twelve point seven kilometres per hour.",
        "It's carried into stronger wind, so the advection is that speed times the slope of the wind, zero point one one one metres per second per kilometre.",
        "That's plus one point four metres per second, every hour. [beat]",
        "Now stand on the ground, beside an anemometer, a wind meter that never moves.",
        "The pattern slides past at thirty six kilometres per hour, bringing the weaker wind from the west.",
        "So the anemometer sees a local change of minus the pattern's speed times the slope: minus four point zero metres per second, every hour. [beat]",
        "The advection now uses the full wind, forty eight point seven kilometres per hour, times the same slope, which gives plus five point four. [beat]",
        "Adding the local change and the advection gives plus one point four, the same as for the rider. [beat]",
        "So each piece depends on who measures it, but their sum, the air parcel's acceleration, doesn't.",
        "That only works for a frame moving steadily in a straight line.",
        "A frame that turns, like the spinning Earth, adds the Coriolis and centrifugal effects, as we saw in the cross product movies.",
        "We'll build all of this fully in a later movie: The material derivative.",
    ],
    # R16 (continuity §3 5e: s08 bearing -> east/north parts "derived in Part 1"; Part 4's local east and north arrows, recalled from the
    # cut s02); show it, don't voice it (no "fourteen point six times sine …"); say + highlight the trig values (sin 71°, cos 71°)
    "s08_ciaran": [
        "Now a real moving storm.",
        "Storm Ciarán crossed the English Channel in the night from the first to the second of November, twenty twenty three.",
        "To follow it, we find its lowest pressure, then look for the lowest pressure close by an hour later, and so on, hour by hour.",
        "At midnight, universal time, its centre was just off the tip of Cornwall, at nine hundred and fifty four and a half hectopascals. [beat]",
        "Between midnight and six in the morning, the centre moved towards a bearing of seventy one degrees, east-north-east, at about fourteen point six metres per second, roughly fifteen. [beat]",
        "From Part 1, the maths angle is ninety degrees minus the bearing, and an arrow's east and north parts are its length times the cosine and the sine of that angle.",
        "So the storm's east part is its speed times the sine of seventy one degrees, and its north part is its speed times the cosine.",
        "Sine seventy one degrees is about zero point nine four six, and cosine seventy one degrees about zero point three two six, so the east part is about thirteen point eight metres per second, and the north part about four point eight. [beat]",
        "We'll call this storm velocity bold capital U: thirteen point eight times i hat, the local east arrow from Part 4, plus four point eight times j hat, the local north arrow.",
    ],
    # R16: the u_r / u_theta formulas recalled on screen, "derived in Part 1"
    "s09_lopsided": [
        "Let's look at the winds on a ring two hundred kilometres from the centre, at three in the morning.",
        "As in Part 1, we split each wind into its part round the ring and its part in or out, with the formulas we derived there.",
        "Seen from the ground, the round part averaged about eighteen metres per second on the storm's southern side, but only about seven on its northern side. [beat]",
        "Why so lopsided?",
        "The storm spins anticlockwise as seen from above, as northern storms do.",
        "On its southern side, the spin blows towards the east, the same way the storm moves, so the two add up.",
        "On its northern side, the spin blows towards the west, against the motion, so they partly cancel.",
    ],
    # series audit §3a: recall the vectors movie's "wind minus the storm's velocity"; S7 no read-out subtraction
    "s10_storm_relative": [
        "Now let's ask what the wind looks like to someone riding along with the storm's centre, at bold capital U.",
        "That's called the storm-relative wind, and we met it briefly in the vectors movie, as the wind minus the storm's velocity.",
        "From the Galilean rule, the ground wind is bold capital U plus the rider's wind, bold v prime.",
        "So the rider's wind is the ground wind minus bold capital U. [beat]",
        "Taking an arrow away is the same as adding that arrow turned to point the opposite way.",
        "Take a point in the middle of the southern side.",
        "There, the ground wind is thirteen point five east and eight point four north.",
        "Take away the storm's velocity, part by part, and the rider feels minus zero point three east and three point seven north: a gentle three point seven metres per second. [beat]",
        "Now a point in the middle of the northern side.",
        "The ground wind is minus four point two east and minus five point three north.",
        "Take away the same storm velocity, and the rider feels minus eighteen point zero east and minus ten point one north: about twenty point six metres per second. [beat]",
        "So for the rider, the northern side is the windy one.",
    ],
    # R16: the ring average recalled, "derived in Part 1"
    "s12_invariant": [
        "So what changes, and what doesn't?",
        "The wind at each point changes by the storm's velocity.",
        "But the ring average of the round part, which we built in Part 1, is about fourteen metres per second in both frames: fourteen point one from the ground, and thirteen point eight riding along. [beat]",
        "And the average inflow is about six metres per second in both frames. [beat]",
        "That's no accident.",
        "A steady, uniform wind blows as much round one side of a circle as it blows back round the other, so it adds nothing to the average spin, or to the average inflow.",
        "On a flat map, it adds exactly zero.",
        "On the round Earth, the meridians close in towards the pole, and that leaves the small difference of zero point three. [beat]",
        "The spin belongs to the storm, and the motion belongs to the whole pattern.",
        "For a house on the coast, though, the ground wind is what counts.",
        "That night, the weather station at Brest measured a gust of eighty four knots, about a hundred and fifty six kilometres per hour.",
    ],
    # P5: no "Step one … three"; series audit: grad p recalled from the cross product movie
    "s14_tau_derive": [
        "How are the two rates linked?",
        "The next three steps show it.",
        "They're for anyone who wants every step and aren't needed for the intuition of weather, climate or maps, so skip ahead to the time on screen if you'd rather go straight to the numbers.",
        "First, the rider is a traveller, moving at bold capital U.",
        "In the derivatives movie, we found the rate a traveller feels: the change at a fixed place, plus the traveller's speed times the slope, in each direction.",
        "With the dot product, that's partial p by partial t, plus bold capital U dot grad p, where grad p, as in the cross product movie, points the way the pressure increases fastest. [beat]",
        "Next, for this traveller, that rate is partial p by partial tau.",
        "So partial p by partial tau equals partial p by partial t, plus bold capital U dot grad p. [beat]",
        "Then we move bold capital U dot grad p to the other side.",
        "Partial p by partial t equals partial p by partial tau, minus bold capital U dot grad p. [beat]",
        "Now let's read each term.",
        "On the left is the barometer's rate.",
        "The first term on the right is the storm changing.",
        "And bold capital U dot grad p is the storm's speed, times how fast the pressure rises along its direction of motion.",
        "Kilometres per hour, times hectopascals per kilometre, gives hectopascals per hour.",
        "With its minus sign, it's the change caused by the pattern sliding past. [beat]",
        "If you skipped, here's what to keep: what the barometer sees is the storm changing, minus the pattern sliding past.",
    ],
    # show it, don't voice it: S2, S6, S8
    "s15_plymouth": [
        "Now the numbers at Plymouth, around midnight.",
        "At eleven in the evening, the pressure was nine hundred and sixty four point one hectopascals, and at one in the morning, nine hundred and fifty six point five.",
        "So, at midnight, the barometer's rate is the later reading minus the earlier one, divided by the two hours between them: about minus three point eight hectopascals per hour. [beat]",
        "Plymouth was ahead of the low, about a hundred and twenty three kilometres to its north-east.",
        "There, the pressure rose along the storm's direction by about zero point zero six one hectopascals per kilometre. [beat]",
        "The storm moved at fourteen point six metres per second, which is fifty two and a half kilometres per hour.",
        "So bold capital U dot grad p is the storm's speed times that slope: about three point two hectopascals per hour. [beat]",
        "Then the storm's own change, partial p by partial tau, is partial p by partial t plus bold capital U dot grad p.",
        "Adding the barometer's rate and the sliding term gives about minus zero point six hectopascals per hour. [beat]",
    ],
    # show it, don't voice it: S0 says the split, not "minus 3.8 equals minus 0.6 minus 3.2"
    "s16_meaning": [
        "So, at Plymouth, the barometer's fall of three point eight hectopascals per hour splits into zero point six from the storm changing, and three point two from the pattern sliding past. [beat]",
        "Most of what the barometer saw was the storm arriving.",
        "Is the minus zero point six believable?",
        "Here's a check.",
        "Between eleven and one, the lowest pressure at the storm's tracked centre fell from nine hundred and fifty four point nine to nine hundred and fifty four point zero hectopascals: about minus half a hectopascal per hour, the same size. [beat]",
        "This is the same idea as advection in the dot product movie.",
        "Forecasters draw maps of these pressure changes, and we'll read them in a later movie: Reading maps over time.",
    ],
    # R3: the two-sentence teaser naming Part 6's content and why (continuity_plan §3 5e)
    "s17_recap": [
        "To sum up, a frame moving steadily in a straight line shifts positions by capital U times t, and velocities by capital U: u equals u prime plus capital U.",
        "But it leaves accelerations unchanged, so the same forces explain the motion in both frames.",
        "For an air parcel, the acceleration is the local change plus advection.",
        "Each piece depends on who measures it, but their sum doesn't.",
        "Storm Ciarán moved east-north-east at about fifteen metres per second.",
        "Taking that motion away from every wind gives the storm-relative wind: what a rider moving with the storm feels.",
        "It changed the wind at every point, but left the storm's average spin of about fourteen metres per second.",
        "A fixed barometer's rate is the storm changing, minus the pattern sliding past.",
        "At Plymouth, the fall of three point eight hectopascals per hour was mostly the storm arriving.",
        "In Part 6, we'll find the shortest way between two places on the round Earth: the great circle, and the rhumb line that sailors steered for centuries.",
        "The great circle explains why flights from Europe to California pass over Greenland.",
    ],
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
            # each listed sentence must survive tts.py's own splitter unchanged (the SS/AT indices depend on it)
            got = split(" ".join(SCENE[sid]))
            if got != SCENE[sid]:
                print(f"FAIL {sid}: tts.sentences() splits the new text differently:", *[f"{a!r} | {b!r}" for a, b in zip(got, SCENE[sid]) if a != b], sep="\n  ")
                return 1
            sents = list(SCENE[sid])
        text = " ".join(sents)
        new_vo[sid] = text
        out += [block[0], NOTE, text, ""] if sid in SCENE else block
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
