"""Fix loop 1 (review 1) records for ch00_dot_product_v01b: sync storyboard.yaml with the spliced narration
(tools/movie_wb/splice_dpv_fix1.py): scene times, sentence times, voiceovers (with [beat] markers), totals, the duration
window; S10 doc fixes (the ~1 TW figure is verified; the s20e analogue sentence softened); the visual notes changed by the
fix; a fix_loop_1 record. Also refreshes the script.md per-scene notes of the edited scenes and the data_needs W2/S2 rows.
usage: .venv/Scripts/python.exe tools/movie_wb/sync_storyboard_dpv_fix1.py
"""
from __future__ import annotations

import json
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
D = ROOT / "movies" / "ch00" / "ch00_dot_product_v01b"
HOLD_S = 2.5
EDITED = ["s11b_perp_push", "s20b_runway", "s20d_wind_work", "s20e_similarity"]


def mmss(t: float) -> str:
    return f"{int(t // 60)}:{t % 60:05.2f}"


def main() -> None:
    sbp, tp, scp, dnp = D / "storyboard.yaml", D / "timing.json", D / "script.md", D / "data_needs.md"
    sb = yaml.safe_load(sbp.read_text(encoding="utf-8"))
    T = json.loads(tp.read_text(encoding="utf-8"))
    tsc = {s["id"]: s for s in T["scenes"]}
    words = sents = beats = 0
    for sc in sb["scenes"]:
        ts = tsc[sc["id"]]
        sc["t"] = [round(ts["start"], 3), round(ts["end"], 3)]
        if "sentence_times" in sc:
            sc["sentence_times"] = [[round(x["start"], 3), round(x["end"], 3)] for x in ts["sentences"]]
        sc["voiceover"] = " ".join(x["text"] + (" [beat]" if x.get("beat") else "") for x in ts["sentences"])
        words += sum(len(x["text"].split()) for x in ts["sentences"])
        sents += len(ts["sentences"])
        beats += sum(1 for x in ts["sentences"] if x.get("beat"))
        if sc["id"] == "s11b_perp_push":
            sc["visual"] = sc["visual"].replace("the\n    velocity (teal) along the circle", "the velocity (slate) along the circle") \
                .replace("the velocity (teal) along the circle", "the velocity (slate, not the wind's teal v) along the circle")
        if sc["id"] == "s20b_runway":
            sc["visual"] = sc["visual"].replace("at 30° towards the north east", "30° east of the runway's direction")
        if sc["id"] == "s20d_wind_work":
            sc["honesty"] = ("The ≈ 1 TW global figure is verified (manifest.json credits.W2_wind_work: Wunsch 1998, J. Phys. "
                             "Oceanogr. 28, 2332–2340, DOI resolved; cross-check Hughes & Wilson 2008, 0.76 TW); it is spoken "
                             "and shown as '≈ 1 000 000 000 000 W'. Fix 1 adds 'A watt is one joule of energy every second.'")
            sc["visual"] = sc["visual"].replace("keyword ''≈ 1 TW'' only after it is spoken (cited)", "'≈ 1 000 000 000 000 W' on its words (cited)")
        if sc["id"] == "s20e_similarity":
            sc["honesty"] = ("Fix 1 (review 1 S10): the last sentence only says weather maps CAN be compared this way to look for "
                             "past days like today; Lorenz (1969) searched for analogues by RMS difference, not the cosine. The "
                             "cosine of anomaly patterns is the anomaly correlation coefficient of forecast verification "
                             "(WMO-No. 485), not named in the movie. Capital A and B are named in a new sentence; hectopascals "
                             "are defined as 'the unit weather maps use for pressure'.")
    total = T["total_s"]
    movie = round(total + HOLD_S, 3)
    sb["target_duration_s"] = movie
    sb["measured_narration_s"] = round(total, 3)
    sb["measured_frames"] = T["total_frames"] + int(HOLD_S * T["fps"])
    sb["words"], sb["sentences"], sb["beats"] = words, sents, beats
    q = sb["qa_expectations"]
    q["duration_s"] = movie
    q["duration_window_s"] = [round(movie * 0.97, 1), round(movie * 1.03, 1)]
    hn = sb["honesty_notes"]
    for i, h in enumerate(hn):
        if h.startswith("s20d: the tile numbers"):
            hn[i] = ("s20d: the tile numbers are illustrative; the ≈ 1 TW global total is a cited published estimate (Wunsch 1998), "
                     "verified 2026-10-28 (manifest.json credits.W2_wind_work).")
        elif h.startswith("s20e: the station values"):
            hn[i] = ("s20e: the station values are illustrative ('say'); the cosine is an uncentred pattern correlation; the movie "
                     "only says maps can be compared this way to look for past days like today (fix 1).")
        elif h.startswith("s20d: the ≈ 1 TW total stays OFF"):
            hn[i] = ("s20d: the ≈ 1 TW total was confirmed by the motion-builder (DOIs on Crossref, Wunsch abstract 'about 1 TW … "
                     "Southern Ocean'; Hughes & Wilson 0.76 TW), so it is spoken and shown (data_needs.md §C W2: verified).")
    sb["fix_loop_1"] = {
        "date": "2026-10-28",
        "review": "reports/ch00_movies.md 'ch00_dot_product_v01b — review 1'",
        "v6_sentences": "unchanged: all 155 verbatim, and every untouched sentence's audio is bit-identical (splice check max |Δ| = 0)",
        "narration": "tools/movie_wb/splice_dpv_fix1.py: 4 replaced + 2 inserted NEW sentences (none from v6), local gain per edit",
        "edits": T["self_check"].get("spliced_fix1", {}).get("edits", []),
        "layout": ["M1 s20e link left of the stack and gauge", "M2 s06 (1) reminder fades at S5", "S1 s11a streaks clipped",
                   "S4 s11b 'always across', slate velocity arrow", "S6 s20b link to the dashed across part",
                   "S7 s20d Antarctica keyword at y 640", "S8 s20e 'opposites' held 1 s past its sentence",
                   "S9 s05a older lines dimmed, zero in warm white/slate",
                   "cosmetic: s07 b̂ definition leaves on the turn, s09 neutral orange tint, s20d big number warm white, s21 whirl held to 'sunlight'"],
    }
    sbp.write_text(yaml.safe_dump(sb, sort_keys=False, allow_unicode=True, width=150), encoding="utf-8")

    # script.md: the per-scene measured note line of the edited scenes, and the totals line
    s = scp.read_text(encoding="utf-8").splitlines()
    out, cur = [], None
    for ln in s:
        if ln.startswith("## "):
            cur = ln[3:].strip()
        if cur in tsc and ln.startswith("> ") and " words · " in ln and " sentences · " in ln and cur in EDITED:
            ts = tsc[cur]
            w = sum(len(x["text"].split()) for x in ts["sentences"])
            b = sum(1 for x in ts["sentences"] if x.get("beat"))
            sp = sum(x["dur"] for x in ts["sentences"])
            ln = (f"> {w} words · {len(ts['sentences'])} sentences · {b} beats · {ts['start']:.3f}–{ts['end']:.3f} s "
                  f"({ts['end'] - ts['start']:.1f} s; speech {sp:.1f} s) · {mmss(ts['start'])}–{mmss(ts['end'])} "
                  f"(measured, fix 1 splice 2026-10-28)")
        if ln.startswith("> Total:"):
            ln = (f"> Total: {words} words · {sents} sentences · {beats} beats · {total:.3f} s narration · {movie:.3f} s movie "
                  f"({mmss(movie)}) · {60 * words / movie:.1f} words per minute (fix 1, 2026-10-28).")
        out.append(ln)
    txt = "\n".join(out) + "\n"
    old = ("The ≈ 1 TW sentence in s20d is measured here but must not go on screen or into the final narration until its citation\n"
           "is confirmed (`data_needs.md` §C W2).")
    new = ("The ≈ 1 TW sentence in s20d was confirmed before the final TTS (`data_needs.md` §C W2, verified; manifest.json\n"
           "credits.W2_wind_work). Fix 1 (review 1): six NEW sentences replaced or added in s11b, s20b, s20d, s20e; no v6 sentence touched.")
    if old in txt:
        txt = txt.replace(old, new)
    scp.write_text(txt, encoding="utf-8")

    # data_needs.md W2 / S2 rows
    dn = dnp.read_text(encoding="utf-8")
    i = dn.index("| W2 |")
    j = dn.index("\n", i)
    dn = dn[:i] + ("| W2 | wind work on the ocean's general circulation ≈ 1 TW (\"about a million million watts\"), most of it over the "
                   "Southern Ocean | Wunsch, C. (1998), \"The work done by the wind on the oceanic general circulation\", *J. Phys. "
                   "Oceanogr.* 28, 2332–2340, doi:10.1175/1520-0485(1998)028<2332:TWDBTW>2.0.CO;2; cross-check Hughes & Wilson "
                   "(2008), *JGR* 113, C02016, doi:10.1029/2007JC004371 (0.76 TW) | **VERIFIED 2026-10-28** by the motion-builder "
                   "(DOIs resolved on Crossref; the Wunsch abstract gives about 1 TW dominated by the Southern Ocean mean zonal wind); "
                   "recorded in manifest.json credits.W2_wind_work; spoken and shown |") + dn[j:]
    i = dn.index("| S2 |")
    j = dn.index("\n", i)
    dn = dn[:i] + ("| S2 | maps compared with the cosine to look for past days like today (fix 1: softened, a possibility, not a "
                   "claim about practice) | Lorenz, E. N. (1969), *J. Atmos. Sci.* 26, 636–646, searched for analogues by RMS "
                   "difference; the cosine of anomaly patterns is the anomaly correlation coefficient of forecast verification "
                   "(WMO Manual on the GDPFS, WMO-No. 485), not named in the movie | background only |") + dn[j:]
    dnp.write_text(dn, encoding="utf-8")
    print(f"storyboard: {movie} s movie, {words} words, {sents} sentences, {beats} beats; window {q['duration_window_s']}")


if __name__ == "__main__":
    main()
