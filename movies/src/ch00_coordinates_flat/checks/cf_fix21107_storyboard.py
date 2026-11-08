"""ch00_coordinates_flat fix 2 (2026-11-07): after cf_fix1_sync.py (voiceover, times, chapters), record the fix-2 changes in the
storyboard (key fix_2_2026_11_07) and re-dump it the way cf_fix1_sync.py does. Idempotent.
usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_flat/checks/cf_fix21107_storyboard.py"""
from __future__ import annotations

from pathlib import Path

import yaml

P = Path(__file__).resolve().parents[3] / "ch00/ch00_coordinates_flat/storyboard.yaml"
NOTE = {
    "inputs": "fix1 review 1 (4 Should + cosmetics) and fix1 review 2 calc & sync audit (14 Should), reports/ch00_movies.md",
    "voice": "s23 S7 and S13 re-voiced (no plain product / quotient read out): 'Converted with the same factor of three point six, the "
             "inflow is about forty seven kilometres per hour, towards the centre.' / '... so it goes about two point seven times as far "
             "round as in.'",
    "timing": "every AT() on Kokoro word times (words.json: the auditor's times for the 142 entries not re-voiced in fix 1 merged)",
    "visual": [
        "s00 subtitle 'and turned axes' (the voice's word); s01 three keywords 'x and y' / 'polar r, θ' / 'turned axes' on their words",
        "s04 θ = tan⁻¹(1.333) on 'The angle with that tangent', ≈ 53.13° on 'fifty three point one'",
        "s07 '5 km × 0.2' / '50 km × 0.2' on the words that name them, '= 1 km' / '= 10 km' and the 10-km label on the spoken results",
        "s14 rebuild rule u = 6 r̂ + (−8) θ̂ written on 'We rebuild it'; |u| = √(6² + (−8)²) = √(36 + 64) = √100 = 10 m/s on its words",
        "s17 / s23 CalcStack lines that leave fade before the stack slides (cf_lib exitFirst): no row passes over the text above",
        "s19 C_ij working and table cell on 'which is …'",
        "s21 '10 m above the ground' and '3-km grid' on their words",
        "s22 'm/s × 3.6 → km/h' (3.6 gold) → '1 m/s = 3600 m/h' → '= 3.6 km/h'; '35 m/s × 3.6' → '= 126 km/h'; '× 1.85 km/h per kt' "
        "(1.85 gold) → '≈ 250 km/h' → '÷ 3.6 ≈ 69 m/s', each on its word",
        "s23 'wind speed = √(35² + 13²)'; '13 m/s × 3.6' (3.6 gold) before '≈ 47 km/h'; 't = distance ÷ speed' → fraction → ≈ 1923 s → "
        "32 min, same for the lap (fraction, ≈ 4490 s, 75 min); clock back to 0 on 'one lap', then 0 → 75 min",
        "s24 data values u, v of each point and cos/sin 135° gold (+8 %) on their words; map results and arrows on the spoken values",
        "s25 '72 − 14 out = 58 points in' on 'fifty eight'; s26 fraction on 'thirteen point three over', ≈ 0.38 on its word",
    ],
}


def main() -> None:
    txt = P.read_text(encoding="utf-8")
    header = "".join(ln + "\n" for ln in txt.splitlines() if ln.startswith("#"))
    sb = yaml.safe_load(txt)
    sb["fix_2_2026_11_07"] = NOTE
    P.write_text(header + yaml.safe_dump(sb, allow_unicode=True, sort_keys=False, width=140), encoding="utf-8")
    print("storyboard: fix_2_2026_11_07 note written")


if __name__ == "__main__":
    main()
