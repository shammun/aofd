"""Re-implementation of the series_plan_v6 §6a checks (deps_v6.py is not in the repo).

Parses §6 (ordered list), §4 (term homes), §5 (concept audit) of series_plan_v6.md and checks:
1. every prerequisite points to an earlier position (no forward, no unknown);
2. every §4 home sits at or before 44 and before its first need;
3. every §5 'first taught' position <= 'first used' position, and printed positions match §6.
Also checks extra prerequisites found by the 2026-11-07 audit (EXTRA below).
"""
import re
from pathlib import Path

PLAN = Path(r"C:\Users\sislam27\Work\Climate Dynamics PHD\AOFD Vallis\movies\ch00\series_plan_v6.md")
txt = PLAN.read_text(encoding="utf-8")
lines = txt.splitlines()

# ---- §6 table
pos, prereq, title = {}, {}, {}
in6 = False
for ln in lines:
    if ln.startswith("## 6."):
        in6 = True
        continue
    if in6 and ln.startswith("### 6a"):
        break
    if in6 and re.match(r"^\| \d+ \|", ln):
        cells = [c.strip() for c in ln.strip("|").split("|")]
        p, mid, t, block, status, pre = cells[0], cells[1], cells[2], cells[3], cells[4], cells[5]
        pos[mid] = int(p)
        title[mid] = t
        prereq[mid] = pre

ids = list(pos)
print(f"§6 rows: {len(ids)}, distinct: {len(set(ids))}")

def expand(token: str):
    token = token.strip()
    m = re.match(r"^([A-Z]+)(\d+)[–-]\1?(\d+)$", token)
    if m:
        pre, a, b = m.group(1), int(m.group(2)), int(m.group(3))
        w = len(m.group(2))
        return [f"{pre}{i:0{w}d}" for i in range(a, b + 1)]
    m = re.match(r"^(#\d+[a-g]?|\d\.\d+b?|1a|1b|[A-Z]+\d+)", token)
    return [m.group(1)] if m else []

forward, unknown = [], []
for mid, pre in prereq.items():
    if pre in ("—", ""):
        continue
    pre_clean = re.sub(r"\([^)]*\)", "", pre)
    for tok in pre_clean.split(","):
        for d in expand(tok):
            if d == mid:
                continue
            if d not in pos:
                unknown.append((mid, d))
            elif pos[d] >= pos[mid]:
                forward.append((mid, d, pos[mid], pos[d]))
print("forward prerequisites:", forward)
print("unknown prerequisites:", unknown)

# ---- §5 concept audit
in5 = False
bad5, mism = [], []
for ln in lines:
    if ln.startswith("## 5."):
        in5 = True
        continue
    if in5 and ln.startswith("## 6."):
        break
    if in5 and ln.startswith("|") and not ln.startswith("| Concept") and not ln.startswith("|---"):
        cells = [c.strip() for c in ln.strip("|").split("|")]
        concept, taught, used = cells[0], cells[1], cells[2]
        tp = [(m.group(1), int(m.group(2))) for m in re.finditer(r"(#\d+[a-g]?|\d\.\d+b?|1a|1b|[A-Z]+\d+) \((\d+)\)", taught)]
        up = [(m.group(1), int(m.group(2))) for m in re.finditer(r"(#\d+[a-g]?|\d\.\d+b?|1a|1b|[A-Z]+\d+) \((\d+)\)", used)]
        for i, p in tp + up:
            if i in pos and pos[i] != p:
                mism.append((concept[:50], i, p, pos[i]))
        if tp and up and min(p for _, p in tp) > min(p for _, p in up):
            bad5.append((concept[:60], tp, up))
print("§5 first-taught after first-used:", bad5)
print("§5 printed positions not matching §6:", mism)

# ---- §4 homes
in4 = False
bad4 = []
for ln in lines:
    if ln.startswith("## 4."):
        in4 = True
        continue
    if in4 and ln.startswith("## 5."):
        break
    if in4 and re.match(r"^\| b\d+", ln):
        cells = [c.strip() for c in ln.strip("|").split("|")]
        homes = [int(x) for x in re.findall(r"\((\d+)\)", cells[2])]
        need = [int(x) for x in re.findall(r"\((\d+)\)", cells[3])]
        if max(homes) > 44 or (need and min(homes) >= need[0]):
            bad4.append((cells[0], homes, need))
print("§4 homes after 44 or not before need:", bad4)

# ---- extra dependencies found by the audit (spoken use in the made scripts or plan scopes)
EXTRA = {
    "#6": ["1a", "0.3", "#3", "#5d"],          # vectors movie (s06, s07), weather basics (s24, s32, s33), #3 (s30), i,j,k (Part 4)
    "M01": ["#4"],                              # partial derivative language on contours
    "U01": ["#5a"],                             # not needed; control
    "#5b": ["0.3"],                             # surge: sea level, hPa, cyclones
    "#5a": ["0.3"],                             # wind 'from' convention (s06)
    "#5c": ["0.3", "#2"],                       # nautical mile (s23), x̂ × ŷ = ẑ (s13)
    "#5f": ["0.1b"],
    "U17": ["#5g"],                             # polar orbit ground tracks on map projections
    "M17": ["M16"],                             # aerosols on RGB (plan §3b)
    "F22": ["M23"],                             # cut-off low read on thickness (Valencia DANA)
    "F19": ["#5b"],
}
for mid, deps in EXTRA.items():
    for d in deps:
        if pos[d] >= pos[mid]:
            print(f"EXTRA forward: {mid}({pos[mid]}) needs {d}({pos[d]})")
print("extra checks done")
