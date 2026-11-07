"""ch00_coordinates_flat (#5a) fix 1 after fb1 (2026-11-07): review 2 Should 10 — the storyboard (the contract) still carried the build-1
numbers about the HRRR pressure minimum (37 / -12.5 / 18.6 deg ...). Replace them, as text, with the final numbers the movie shows and says
(data_block.numbers_final: 34.8 / -13.3, 1923 s, 75 min, 2.7, 21 deg); `numbers_build1_about_hrrr_minimum` stays as history. Also records
the fix-1107 note on every changed scene. Text replacements on the YAML source (keeps its layout); each old string must occur once, or the
new one must already be there (idempotent). Run after cf_fix1_sync.py.
usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_flat/checks/cf_fix1107_storyboard.py
"""
import sys
from pathlib import Path

import yaml

R = Path(__file__).resolve().parents[4]
sbp = R / "movies/ch00/ch00_coordinates_flat/storyboard.yaml"
B = chr(92)
REP = [
    ("    s22: 25 km, 72 points, 37, 130 (x 3.6), -12.5, 135 kt, 1.85, 250",
     "    s22: 25 km, 72 points, 2506 / 72 = 34.8 (35), 126 (x 3.6), -957 / 72 = -13.3 (-13), 135 kt, 1.85, 250, 69, 49"),
    ("    s23: 37, 12.5, 39, 45, 25 000 m, 2000 s, 33 min, 157 km, 71 min, 3",
     "    s23: 35, 13, 37, 47 km/h, 25 km, 1923 s, 32 min, 157 km, 4490 s, 75 min, 2.7"),
    ("    s25: 37; 25-50; 0 to -35", "    s25: u_theta 17 to 47, mean 35; u_r -40 to +14, negative at 58 of 72, mean -13"),
    ("    s26: 12.5 / 37, 0.34, 19 degrees", "    s26: 13.3 / 34.8, 0.38, 21 degrees"),
    ("    s27: 37, 12.5, 19", "    s27: 35, 13, 21"),
    ("  beat: 'application: ring means 37 round, -12.5 in (PENDING DATA REPORT)'",
     "  beat: 'application: ring means 34.8 (35) round, -13.3 (-13) in'"),
    ("''37 x 3.6 = 133 = about 130 km/h''", "''35 x 3.6 = 126 km/h''"),
    ("''-12.5 m/s'' (rose, ''-'' glyph)", "''-13.3 = about -13 m/s'' (rose, ''-'' glyph)"),
    ("  beat: 'D10: what 37 and 12.5 mean (PENDING DATA REPORT)'", "  beat: 'D10: what 35 and 13 mean'"),
    ("''about 39 m/s''", "''about 37 m/s''"),
    ("''37 round'' (teal", "''35 round'' (teal"),
    ("''12.5 in'' (rose", "''13 in'' (rose"),
    ("''12.5 x 3.6 = 45 km/h''", "''13 x 3.6 = about 47 km/h''"),
    ("a clock glyph runs to ''33 min'' at one constant rate", "a clock glyph holds 0 min and sweeps to ''32 min'' on its words (fix 1107)"),
    ("the clock to\n    ''71 min''", "the clock to\n    ''75 min'' on its words"),
    ("CHECK DF23 39.1,\n      45.0, 2000 s, 33.3 min, 157.1 km, 70.6 min, 2.97 (data_block)",
     "CHECK DF28 37.3,\n      47 km/h, 1923 s, 32 min, 157.1 km, 4490 s, 75 min, 2.7 (data_block.numbers_final)"),
    ("47 km/h, about 1900 s / 32 min", "47 km/h, about 1923 s / 32 min"),
    ("pointing at the eye; tangential teal, to the same m/s scale); ''37 m/s'' flies", "pointing at the eye; tangential teal, to the same m/s scale); ''about 35 m/s'' flies"),
    ("constant 12.5 m/s inflow and 37 m/s spin", "constant 13 m/s inflow and 35 m/s spin"),
    (B + "approx1900" + B + " " + B + "mathrm{s}", B + "approx1923" + B + " " + B + "mathrm{s}"),
    ("    goal: what the 12.5 means, and how it differs from the 37 (U-CO-011)", "    goal: what the 13 means, and how it differs from the 35 (U-CO-011)"),
    ("      - 37" + B + " " + B + "text{round}," + B + " 12.5" + B + " " + B + "text{in}", "      - 35" + B + " " + B + "text{round}," + B + " 13" + B + " " + B + "text{in}"),
    ("      - " + B + "sqrt{37^2+12.5^2}" + B + "approx39", "      - " + B + "sqrt{35^2+13^2}" + B + "approx37"),
    ("      - 12.5" + B + "times3.6=45" + B + " " + B + "mathrm{km/h}", "      - 13" + B + "times3.6" + B + "approx47" + B + " " + B + "mathrm{km/h}"),
    ("      - 25" + B + ",000/12.5=2000" + B + " " + B + "mathrm{s}", "      - 25" + B + ",000/13" + B + "approx1923" + B + " " + B + "mathrm{s}"),
    ("      - about 33 min", "      - about 32 min"),
    ("      - 2" + B + "pi" + B + "times25" + B + " " + B + "mathrm{km}/37" + B + " " + B + "mathrm{m/s}" + B + "approx71" + B + " " + B + "mathrm{min}",
     "      - 2" + B + "pi" + B + "times25" + B + " " + B + "mathrm{km}/35" + B + " " + B + "mathrm{m/s}" + B + "approx75" + B + " " + B + "mathrm{min}"),
    ("      - 37/12.5" + B + "approx3", "      - 35/13" + B + "approx2.7"),
    ("a dashed teal line at the mean 37 (label ''37''); band 25-50 shaded faintly.",
     "a dashed teal line at the mean 34.8 (label ''mean 35''); band 17-47 shaded faintly."),
    ("dashed rose line at -12.5 (label ''-12.5'')", "dashed rose line at -13.3 (label ''mean -13'')"),
    ("CHECK DF26 atan(12.5/37.1) = 18.6 deg", "CHECK DF26 atan(13.3/34.8) = 20.9 deg; screen tan^-1(0.38) = 20.8 deg (fix 1107)"),
    ("''37'', ''12.5'' and the 19-deg wedge", "''35'', ''13'' and the 21-deg wedge"),
]
NOTE = ("fix 1 after fb1 (2026-11-07): show it, don't voice it (user) - the voice names what is combined and the result; every row stays on "
        "screen, re-cued on Kokoro word times (words.json); see fix1_2026-11-07_log.md")


def main() -> None:
    txt = sbp.read_text(encoding="utf-8")
    for old, new in REP:
        n = txt.count(old)
        if n == 1:
            txt = txt.replace(old, new)
        elif n == 0 and " ".join(new.split()) in " ".join(txt.split()):   # already applied (a re-dump may re-wrap lines)
            continue
        else:
            sys.exit(f"storyboard: {n} matches for: {old[:80]}")
    header = "".join(ln + "\n" for ln in txt.splitlines() if ln.startswith("#"))
    sb = yaml.safe_load(txt)
    changed = {"s04_polar", "s05_polar_back", "s06_bearings", "s07_radians", "s08_r_hat", "s10_turn_90", "s11_theta_hat", "s13_components",
               "s14_rebuild_general", "s15_turn_axes", "s16_y_prime", "s17_new_components", "s18_matrix", "s19_index_form",
               "s20_polar_is_turned", "s22_spin_inflow", "s23_what_numbers_mean", "s24_ring_points", "s25_why_polar_storm",
               "s26_inflow_angle", "s27_recap"}
    for sc in sb["scenes"]:
        if sc["id"] in changed:
            sc["fix_2026_11_07"] = NOTE
    sbp.write_text(header + yaml.safe_dump(sb, sort_keys=False, allow_unicode=True, width=140), encoding="utf-8")
    print(f"storyboard: {len(REP)} number replacements checked, {len(changed)} scene notes")


if __name__ == "__main__":
    main()
