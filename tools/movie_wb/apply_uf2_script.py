"""Apply the UF2 narration (uf2_plan.md §2 + orchestrator decisions) to movies/ch00/ch00_weather_basics/script.md.

Sources: the director's dry-run script ``script_uf2.md`` (plan §2 text, G: scratch), the supplement ``supp.md`` (s36 U2-25,
s38b equator-to-pole), the U2-28 sentence for s53, minus s20c (orchestrator: drop), plus the data rewording logged in
``DATA_CHANGES`` (narration follows the data, plan §2.3 rule). Idempotent: re-running on an applied script is a no-op.

    .venv-tts/Scripts/python.exe tools/movie_wb/apply_uf2_script.py
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools"))
from tts import read_scenes  # noqa: E402

MOV = ROOT / "movies" / "ch00" / "ch00_weather_basics"
DRY = Path("G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_weather_basics/dryrun_uf2")

CHANGED = ["s18_scale_height", "s18b_scale_height_number", "s19_exponential", "s20_exponential_meaning", "s20b_per_km",
           "s21_balloon_pressure", "s22_mass_below", "s60_recap"]
NEW_AFTER = {"s20e_tangent": "s20_exponential_meaning", "s20f_not_a_lid": "s20e_tangent",
             "s20g_uniform_block": "s20f_not_a_lid", "s27c_vapour_stack": "s27b_vapour_pressure",
             "s38b_reanalysis_stack": "s38_reanalysis", "s48b_front_stack": "s48_warm_front"}
DROP = ["s20c_equal_slabs"]
S53_NEW = "Over the Southern Ocean, where little land slows them down, the westerlies blow strongest of all."
S53_AFTER = "Poleward of the subtropical highs, in the middle latitudes, the winds come mostly from the west: the westerlies."

# narration follows the data (plan §2.3 rule; orchestrator data decisions 2026-10-29); (scene, old, new, reason)
DATA_CHANGES = [
    ("s27c_vapour_stack", "from the sea surface up to about nine kilometres",
     "from the sea surface up to about ten kilometres",
     "ERA5 2 Nov 12 UTC box mean z(300 hPa) = 9.70 km -> 'about ten' (orchestrator decision)"),
    ("s27c_vapour_stack", "and at nine kilometres, almost none", "and at ten kilometres, almost none",
     "same: the top layer (300 hPa) is at 9.70 km"),
    ("s38b_reanalysis_stack", "the cooling goes on to about sixteen kilometres",
     "the cooling goes on to about sixteen and a half kilometres",
     "strip-mean tropical tropopause 0-10N = 16.6 km (rounds to 16.5, not 16)"),
    ("s48b_front_stack", "about a hundred and thirty kilometres back between one and a half and four kilometres up",
     "about a hundred kilometres back between one and a half and four kilometres up",
     "front_by_level(max_step_km=80) traced 900-650 hPa; fit 1:44 -> about 100 km over 1.5-4 km (orchestrator decision)"),
]

NOTES = {
    "s20e_tangent": "> NEW (UF2, U2-09, U2-15). Screen: same p(z) axes as s20; gold ring at the ground; 12 Pa/m CalcStack; gold dashed tangent p0(1 - z/H) to (0, 8.43 km); 'tangent'; fall-per-metre arrows shrink; gap band; 0 vs 37 % bracket at H.",
    "s20f_not_a_lid": "> NEW (UF2, U2-10). Screen: axis to 40 km, shaded '37 % of the air: still above H', gold dashed 'H: a scale, not a lid'; bracket 5 -> 13.43 km x 0.37; two 3-D columns -10 C (7.7 km) and 30 C (8.9 km), edges to the top.",
    "s20g_uniform_block": "> NEW (UF2, U2-13). Screen: real column (fading, edges to the top) beside the pretend uniform block (sharp top at 8.43 km, thought experiment); 101 325 N; 1.225 x 9.81 = 12 N; h = p0/(rho0 g) = 8.43 km = RT/g = H; block p(z) = the gold tangent.",
    "s27c_vapour_stack": "> NEW (UF2, G6 stack B). Screen: K5 LayerStack3D of ERA5 q at 10 levels (2 Nov 2023 12 UTC, tropical Atlantic), x150 heights; callouts '20 g/kg', '3 km: a few g/kg', '10 km: almost none', 'half the vapour below 1.5 km'.\n> Source line(s): Data: ERA5 specific humidity on pressure levels (Copernicus C3S) · 2 Nov 2023, 12 UTC · tropical Atlantic",
    "s38b_reanalysis_stack": "> NEW (UF2, G6 stack A). Screen: 16 curved temperature shells 0-80N 25W-35E (x50 air, as s02); tropopause Europe 10.1 km / -52 C, tropics 16.6 km / -77 C; stratosphere warmer; Trappes column rod.\n> Source line(s): Data: ERA5 temperature on pressure levels (Copernicus C3S) · 2 Nov 2023, 12 UTC · 0–80°N, 25°W–35°E",
    "s48b_front_stack": "> NEW (UF2, G6 stack C, U2-22 option). Screen: 11 layers of the T anomaly (x80 heights, slice colours), gold cold-front line per level (front_by_level, 900-650 hPa), slice walls at 45 %, sloping gold surface, 'about 100 km'.\n> Source line(s): Data: ERA5 on pressure levels (Copernicus C3S) · 1 Nov 2023, 18 UTC · fronts computed from it",
}


def scene_text(path: Path) -> dict[str, str]:
    return {s["id"]: " ".join(s["sentences"]) for s in read_scenes(path, None)}


def main() -> int:
    sp = MOV / "script.md"
    src = sp.read_text(encoding="utf-8")
    if "# UF2 change log" in src:
        print("already applied")
        return 0
    old = scene_text(sp)
    plan = scene_text(DRY / "script_uf2.md")
    supp = scene_text(DRY / "supp.md")
    new = dict(plan)
    new["s36_weather_climate"] = supp["s36_weather_climate"]
    new["s38b_reanalysis_stack"] = supp["s38b_reanalysis_stack"]
    s53 = old["s53_trades_westerlies"]
    assert S53_AFTER in s53
    new["s53_trades_westerlies"] = s53.replace(S53_AFTER, S53_AFTER + " " + S53_NEW)
    for sid, a, b, _ in DATA_CHANGES:
        assert a in new[sid], (sid, a)
        new[sid] = new[sid].replace(a, b)

    # split into blocks by "## " heading
    parts = re.split(r"(?m)^(?=## )", src)
    head, blocks = parts[0], parts[1:]
    bid = [re.match(r"## ([\w\-]+)", b).group(1) for b in blocks]
    out: list[tuple[str, str]] = []
    for i, b in zip(bid, blocks):
        if i in DROP:
            continue
        if i in CHANGED or i in ("s36_weather_climate", "s53_trades_westerlies"):
            lines = b.splitlines()
            notes = [ln for ln in lines[1:] if ln.strip().startswith(">")]
            b = f"## {i}\n{new[i]}\n\n" + "\n".join(notes) + "\n\n"
        out.append((i, b))
    for nid, after in NEW_AFTER.items():
        k = [j for j, (i, _) in enumerate(out) if i == after][0]
        out.insert(k + 1, (nid, f"## {nid}\n{new[nid]}\n\n{NOTES[nid]}\n\n"))

    # change log
    log = ["# UF2 change log (user feedback round 2, 2026-10-29; uf2_plan.md §2 + orchestrator decisions; '−' old, '+' new)\n"]
    for i, _ in out:
        if i in NEW_AFTER:
            log.append(f"> **{i}** (new scene): + " + new[i])
        elif i in old and old[i] != new.get(i, old[i]):
            log.append(f"> **{i}**: − {old[i]} | + {new[i]}")
    for d in DROP:
        log.append(f"> **{d}**: dropped (orchestrator 2026-10-29: the fourth picture of one idea).")
    log.append("> **builder (UF2) — narration follows the data:** " + " | ".join(
        f"{s}: − '{a}' + '{b}' ({r})" for s, a, b, r in DATA_CHANGES))
    log.append("")
    head = head.replace("# UF1 change log", "\n".join(log) + "\n# UF1 change log", 1)
    head = head.replace("Version 4 = user feedback round 1", "Version 5 = user feedback round 2 (UF2, 2026-10-29) on v4 fix loop 1; version 4 = user feedback round 1", 1)
    sp.write_text(head + "".join(b for _, b in out), encoding="utf-8")
    chk = scene_text(sp)
    for k, v in new.items():
        if k in chk:
            assert chk[k] == v, k
    print("scenes", len(chk), "sentences", sum(len(s["sentences"]) for s in read_scenes(sp, None)))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
