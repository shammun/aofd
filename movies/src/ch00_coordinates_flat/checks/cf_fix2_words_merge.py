"""ch00_coordinates_flat fix 2 (2026-11-07, fix1 review 2 Should 13): merge the auditor's Kokoro word times for the timing
entries that words.json lacked (s00-s12, s27, s28 sentences not re-voiced in fix 1) into words.json, so every AT() anchor uses a
real word time. Entries already in words.json are kept (the 5 spot entries agree to <= 1 ms). Texts must match timing.json.

Usage: python cf_fix2_words_merge.py <words_missing.json>
"""
from __future__ import annotations

import json
import shutil
import sys
from pathlib import Path

M = Path(__file__).resolve().parents[3] / "ch00" / "ch00_coordinates_flat"


def main(src: Path) -> None:
    words = json.loads((M / "words.json").read_text(encoding="utf-8"))
    timing = json.loads((M / "timing.json").read_text(encoding="utf-8"))
    extra = json.loads(src.read_text(encoding="utf-8"))
    scenes = {s["id"]: s for s in timing["scenes"]}
    bak = M / "words_fix1.json.bak"
    if not bak.exists():
        shutil.copy2(M / "words.json", bak)
    added = 0
    for sid, ents in extra.items():
        for j, e in ents.items():
            if scenes[sid]["sentences"][int(j)]["text"] != e["text"]:
                raise SystemExit(f"text mismatch {sid} {j}")
            tgt = words["scenes"].setdefault(sid, {})
            if j in tgt:
                continue
            tgt[j] = {"text": e["text"], "w": e["w"]}
            added += 1
    words["scenes"] = {s["id"]: dict(sorted(words["scenes"][s["id"]].items(), key=lambda kv: int(kv[0])))
                       for s in timing["scenes"] if s["id"] in words["scenes"]}
    words["note"] = (words.get("note", "") + "; fix 2 (2026-11-07): + Kokoro times for the entries not re-voiced in fix 1 "
                     "(auditor's words_missing.json, verified against timing.json)").lstrip("; ")
    (M / "words.json").write_text(json.dumps(words, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    n = sum(len(v) for v in words["scenes"].values())
    tot = sum(len(s["sentences"]) for s in timing["scenes"])
    print(f"added {added}; words.json now {n} of {tot} timing entries")


if __name__ == "__main__":
    main(Path(sys.argv[1]))
