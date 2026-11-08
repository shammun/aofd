"""ch00_coordinates_flat (#5a) fix loop 1: sync storyboard.yaml after cf_fix1_splice.py and the data build.
- the six re-voiced sentences replace their old text in the scene voiceovers (then voiceover == timing sentences, checked);
- t and sentence_times of every scene from timing.json; target_duration_s; the fix-1 TTS record;
- maths_skip blocks and chapters from manifest.json (the build reads timing.json); the chip wording (Should 5);
- the s24 / data_block numbers (Should 3), the colour contract (Should 1).
usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_flat/checks/cf_fix1_sync.py"""
import json
import re
import sys
from pathlib import Path

import yaml

R = Path(__file__).resolve().parents[4]
M = R / "movies/ch00/ch00_coordinates_flat"
sbp = M / "storyboard.yaml"
txt = sbp.read_text(encoding="utf-8")
header = "".join(ln + "\n" for ln in txt.splitlines() if ln.startswith("#"))
sb = yaml.safe_load(txt)
tm = json.loads((M / "timing.json").read_text(encoding="utf-8"))
man = json.loads((M / "manifest.json").read_text(encoding="utf-8"))
rep = tm["self_check"]["spliced_fix1"]["replaced"]
u1 = tm["self_check"].get("spliced_fix1b_U1")
c1 = (tm["self_check"].get("spliced_fix1c") or {}).get("replaced", [])   # fix 1c: calculation audit (compound entries)
c2 = (tm["self_check"].get("spliced_fix2") or {}).get("replaced", [])    # fix 2: review 2 Must 2a/2b (s11 S20, S23)
c3 = (tm["self_check"].get("spliced_fb1106") or {}).get("replaced", [])  # user feedback 2026-11-06 (cf_fb1106_splice.py, 12 entries)
byid = {s["id"]: s for s in tm["scenes"]}
c4 = (tm["self_check"].get("spliced_fix1107") or {}).get("replaced", [])  # fix 1 after fb1 (2026-11-07): show it, don't voice it (cf_fix1107_splice.py)
c5 = (tm["self_check"].get("spliced_fix2_1107") or {}).get("replaced", [])  # fix 2 after the fix1 reviews (2026-11-07): s23 S7, S13 (cf_fix21107_splice.py)
later5 = {(r_["scene"], r_["sentence"]) for r_ in c5}
later4 = {(r_["scene"], r_["sentence"]) for r_ in c4} | later5
later = {(r_["scene"], r_["sentence"]) for r_ in c3} | later4   # sentences replaced again later: skip their older replacements (idempotent re-runs)
for sc in sb["scenes"]:
    v = re.sub(r"\s+", " ", sc["voiceover"])
    for r_ in rep:
        if r_["scene"] == sc["id"] and (r_["scene"], r_["sentence"]) not in later and r_["new"] not in v:      # idempotent: re-runs after later splices
            if r_["old"] not in v:
                sys.exit(f"{sc['id']}: old sentence not in voiceover: {r_['old']}")
            v = v.replace(r_["old"], r_["new"])
    for r_ in c1:
        if r_["scene"] == sc["id"] and (r_["scene"], r_["sentence"]) not in later and r_["new"] not in v:
            if r_["old"] not in v:
                sys.exit(f"{sc['id']}: fix-1c old sentence not in voiceover: {r_['old']}")
            v = v.replace(r_["old"], r_["new"])
    for r_ in c2:
        if r_["scene"] == sc["id"] and (r_["scene"], r_["sentence"]) not in later and r_["new"] not in v:
            if r_["old"] not in v:
                sys.exit(f"{sc['id']}: fix-2 old sentence not in voiceover: {r_['old']}")
            v = v.replace(r_["old"], r_["new"])
    for r_ in c3:
        if r_["scene"] == sc["id"] and (r_["scene"], r_["sentence"]) not in later4 and r_["new"] not in v:
            if r_["old"] not in v:
                sys.exit(f"{sc['id']}: fb1106 old sentence not in voiceover: {r_['old']}")
            v = v.replace(r_["old"], r_["new"])
    for r_ in c4:
        if r_["scene"] == sc["id"] and (r_["scene"], r_["sentence"]) not in later5 and r_["new"] not in v:
            if r_["old"] not in v:
                sys.exit(f"{sc['id']}: fix1107 old sentence not in voiceover: {r_['old']}")
            v = v.replace(r_["old"], r_["new"])
    for r_ in c5:
        if r_["scene"] == sc["id"] and r_["new"] not in v:
            if r_["old"] not in v:
                sys.exit(f"{sc['id']}: fix2_1107 old sentence not in voiceover: {r_['old']}")
            v = v.replace(r_["old"], r_["new"])
    if u1 and sc["id"] == u1["scene"] and u1["new"][0]["new"] not in v:   # user note U1: the s11 block (beats between new sentences)
        pat = r"\s*(?:\[beat\]\s*)?".join(re.escape(x) for x in u1["old"])
        m = re.search(pat, v)
        if not m:
            sys.exit("s11: U1 old block not in voiceover")
        v = v[:m.start()] + " ".join(x["new"] + (" [beat]" if x["gap_after_s"] == 1.5 else "") for x in u1["new"]) + v[m.end():]
    sc["voiceover"] = v
    t = byid[sc["id"]]
    sc["t"] = [round(t["start"], 3), round(t["end"], 3)]
    sc["sentence_times"] = [[round(x["start"], 3), round(x["end"], 3)] for x in t["sentences"]]
    spoken = " ".join(x["text"] for x in t["sentences"])
    if re.sub(r"\s*\[beat\]\s*", " ", v).split() != spoken.split():
        sys.exit(f"voiceover drift in {sc['id']}")
sb["target_duration_s"] = tm["total_s"]
sb["build_1"]["fix1_tts"] = {"tool": "movies/src/ch00_coordinates_flat/checks/cf_fix1_splice.py (six sentences re-voiced, af_bella x1.0, spliced)",
                             "run": "G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_flat/" + ("fix21107/tts" if c5 else "fix1107/tts" if c4 else "fb1106/tts" if c3 else "fix2/tts" if c2 else "fix1c/tts" if c1 else "fix1b/tts" if u1 else "fix1/tts"), "audio_s": tm["total_s"],
                             "cues": tm["cues"], "warnings": tm["warnings"], "sentences": sum(len(s["sentences"]) for s in tm["scenes"]),
                             "replaced": [f"{r_['scene']} S{r_['sentence']}" for r_ in rep]
                             + [f"{r_['scene']} S{r_['sentence']} ({r_['item']}, fix 1c)" for r_ in c1]
                             + [f"{r_['scene']} S{r_['sentence']} ({r_['item']}, fix 2)" for r_ in c2]
                             + [f"{r_['scene']} S{r_['sentence']} ({r_['item']}, feedback 2026-11-06)" for r_ in c3]
                             + [f"{r_['scene']} S{r_['sentence']} (show it, don't voice it, 2026-11-07)" for r_ in c4]
                             + [f"{r_['scene']} S{r_['sentence']} (fix 2 after the fix1 reviews, 2026-11-07)" for r_ in c5]
                             + ([f"{u1['scene']} S{u1['replaced_sentences'][0]}-S{u1['replaced_sentences'][1]} -> {len(u1['new'])} sentences (user note U1, cf_fix1b_splice.py)"] if u1 else [])}
sb["maths_skip"]["blocks"] = man["maths_skips"]
sb["maths_skip"]["rule"] = sb["maths_skip"]["rule"].replace("('every step, if you want it' / 'skip to\n    mm:ss')", "").replace(
    "'every step, if you want it' / 'skip to mm:ss'", "'every step · optional' / 'skip to mm:ss'")
if "every step · optional" not in sb["maths_skip"]["rule"]:
    sb["maths_skip"]["rule"] = re.sub(r"\('every step, if you want it'\s*/\s*'skip to\s*mm:ss'\)", "('every step · optional' / 'skip to mm:ss')", sb["maths_skip"]["rule"])
assert "every step · optional" in sb["maths_skip"]["rule"], sb["maths_skip"]["rule"]
sb["chapters"] = [{"time": c["time"], "t_s": c["t_s"], "title": c["title"], "scene": c["scene"]} for c in man["chapters"]]
p135 = sb["data_block"]
blk = json.dumps(p135, ensure_ascii=False)
n_rounded = blk.count("rounded: ") + blk.count('"rounded"')


def fix_rounded(o):
    if isinstance(o, dict):
        for k, v in o.items():
            if k == "rounded" and isinstance(v, str) and "-24.4" in v:
                o[k] = "10.1 x 0.707 = 7.14; 44.5 x 0.707 = 31.46; 7.14 - 31.46 = -24.32 ~ -24.3 (= data); 7.14 + 31.46 = 38.60 ~ 38.6 (data 38.65)"
            else:
                fix_rounded(v)
    elif isinstance(o, list):
        for v in o:
            fix_rounded(v)


fix_rounded(sb["data_block"])
S = {s["id"]: s for s in sb["scenes"]}
S["s24_ring_points"]["calc_rows"] = [
    r"\theta=0^\circ:\ u=-8.7,\ v=38.0\ \Rightarrow\ u_r=u=-8.7,\ u_\theta=v=38.0",
    r"\theta=90^\circ:\ u=-16.9,\ v=-37.4\ \Rightarrow\ u_r=v=-37.4,\ u_\theta=-u=16.9",
    r"\theta=135^\circ:\ \cos\theta\approx-0.707,\ \sin\theta\approx0.707,\ u=-10.1,\ v=-44.5",
    r"u_r=-10.1\times(-0.707)+(-44.5)\times0.707=7.14-31.46\approx-24.3",
    r"u_\theta=10.1\times0.707+(-44.5)\times(-0.707)=7.14+31.46\approx38.6",
]
S["s22_spin_inflow"]["calc_rows"] = [r if "3600" not in r else r"1\ \mathrm{m/s}=3600\ \mathrm{m/h}=3.6\ \mathrm{km/h}" for r in S["s22_spin_inflow"]["calc_rows"]]
if not any("3600" in r for r in S["s22_spin_inflow"]["calc_rows"]):
    S["s22_spin_inflow"]["calc_rows"].insert(1, r"1\ \mathrm{m/s}=3600\ \mathrm{m/h}=3.6\ \mathrm{km/h}")
if u1:
    old11 = S["s11_theta_hat"]["calc_rows"]
    # fix 2: keep only the rows before the U1 block (earlier runs appended the U1 rows twice)
    cut = next((i for i, r in enumerate(old11) if r.startswith(r"\Delta\theta")), len(old11))
    rows11 = [r for r in old11[:cut] if not r.startswith("s=5000") and not r.startswith(r"\frac{(-7.0")]
    S["s11_theta_hat"]["calc_rows"] = rows11 + [
        r"\Delta\theta=0.1^\circ=0.1\times\pi/180\approx0.001745\ \mathrm{rad}", r"s=r\,\Delta\theta=5000\ \mathrm{m}\times0.001745\approx8.7\ \mathrm{m}",
        r"(x,\ y)=(r\cos\theta,\ r\sin\theta)", r"\text{before: }\theta\approx53.13^\circ", r"(x,\ y)=(3000,\ 4000)\ \mathrm{m}",
        r"\text{after: }\theta=53.1301^\circ+0.1^\circ=53.2301^\circ",
        r"x=5000\times\cos53.2301^\circ=5000\times0.598603\approx2993.0\ \mathrm{m}", r"y=5000\times\sin53.2301^\circ=5000\times0.801046\approx4005.2\ \mathrm{m}",
        r"\Delta x=2993.0-3000=-7.0\ \mathrm{m}", r"\Delta y=4005.2-4000=+5.2\ \mathrm{m}", r"\sqrt{7.0^2+5.2^2}=\sqrt{49+27.04}=\sqrt{76.04}\approx8.7\ \mathrm{m}=s",
        r"\frac{(-7.0,\ 5.2)}{8.7}\approx(-0.80,\ 0.60)=\hat{\boldsymbol\theta}"]
    S["s11_theta_hat"]["u1_visual"] = ("user note U1 (fix 1): from S16 a wide view (station, 5-km circle, balloon (3, 4) km, r = 5 km, theta 53 deg); S17 a gold zoom box "
        "leads to a framed inset 'magnified' (25 px/m): the circle's arc, r-hat, 'before' and 'after 0.1 deg'; S19 the gold 8.7-m slide; S22 its 7.0-m west "
        "and 5.2-m north legs; the column shows one line per phrase (calc_rows); no theta-hat formula used")
S["s18_matrix"]["calc_rows"] = [r.replace(r"=4.60", r"\approx4.60") for r in S["s18_matrix"]["calc_rows"]]
sb["colour_contract"] = ("unit vectors and axes orange (x-hat, y-hat, r-hat, theta-hat, x-hat', y-hat'); a position arrow teal; the full wind u and the "
                         "radius r ink/white, the wind dashed and moving (fix 2, review 2 Should 3: teal means u_theta); polar parts of a wind ALWAYS tangential teal and radial rose (fix 1, review 1 Should 1: "
                         "s13, s14, s21-s27 and the thumbnails); a negative component keeps its colour and gets a hatch and a '-' glyph; theta arc slate, "
                         "bearing gold, alpha orange arc, inflow angle rose wedge; gold for pointers, links, the +90 deg arc and 'same' ticks. u and v "
                         "curves orange solid / orange dashed with end labels.")
sbp.write_text(header + yaml.safe_dump(sb, allow_unicode=True, sort_keys=False, width=140), encoding="utf-8")
print("storyboard synced:", len(rep), "sentences;", "target", sb["target_duration_s"], "s;", len(sb["chapters"]), "chapters;",
      [b["skip_to"] for b in sb["maths_skip"]["blocks"]], "; data_block 'rounded' entries", n_rounded)
