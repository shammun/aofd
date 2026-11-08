// Static timing check for ch00_coordinates (no browser): every AT(k, j, "phrase"), SS(k, j) and SE(k, j) in every scene component
// must name an existing sentence of that scene in timing.json, and every phrase must occur in that sentence's text (the TSX
// throws at render time otherwise). Also reports reveals whose frame falls outside the scene.
// fix loop 1 (2026-11-07, r8 review 2 S13): AT() / ATP() find the phrase among the Kokoro tokens of words.json (= cs_lib.tsx wordTime);
// the check counts the anchors on word times and on the character share (target: 0), incl. ATP(k, "…") and the event configs' …W fields.
// usage: node movies/src/ch00_coordinates_storm/checks/at_check.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(HERE, "..");
const ROOT = path.resolve(SRC, "../../..");
const tm = JSON.parse(fs.readFileSync(path.join(ROOT, "movies/ch00/ch00_coordinates_storm/timing.json"), "utf8"));
const FPS = 30, HOLD = 75;
const WORDS = JSON.parse(fs.readFileSync(path.join(SRC, "words.json"), "utf8")).scenes;
const wnorm = (x) => x.toLowerCase().replace(/[^a-z0-9']/g, "");
const wordTime = (id, j, text, phrase) => {
  const e = (WORDS[id] || {})[String(j)];
  if (!e || e.text !== text) return null;
  const toks = e.w.map(([t, x]) => [t, wnorm(x)]).filter(([, x]) => x), ph = phrase.split(/\s+/).map(wnorm).filter((x) => x);
  for (let i = 0; i + ph.length <= toks.length; i++) if (ph.every((x, q) => toks[i + q][1] === x)) return toks[i][0];
  return null;
};
let nW = 0, nC = 0;
const charOnly = [];
const sc = tm.scenes, IDS = sc.map((s) => s.id);
const CUT = sc.map((s, i) => (i === 0 ? 0 : Math.round(s.start * FPS)));
const END = [...CUT.slice(1), tm.total_frames + HOLD];
const files = ["cs_sA.tsx", "cs_sB.tsx", "cs_sC.tsx", "cs_sD.tsx"].map((f) => path.join(SRC, f));
let n = 0, bad = 0;
const seen = new Set();
const onePhrase = (id, k, jj, ph, how) => {
  n++;
  if (jj < 0 || jj >= sc[k].sentences.length) { console.log(`FAIL ${id}: ${how} phrase "${ph}" in no sentence`); bad++; return; }
  const s = sc[k].sentences[jj], idx = s.text.indexOf(ph);
  if (idx < 0) { console.log(`FAIL ${id}: phrase "${ph}" not in S${jj}: ${s.text}`); bad++; return; }
  const w = wordTime(id, jj, s.text, ph);
  if (w !== null) nW++; else { nC++; charOnly.push(`${id} S${jj} "${ph}"${how === "AT" ? "" : ` (${how})`}`); }
  const fr = (w !== null ? Math.round((s.start + w) * FPS) : Math.round((s.start + ((s.end - s.start) * idx) / s.text.length) * FPS)) - CUT[k];
  if (fr < 0 || fr > END[k] - CUT[k]) { console.log(`FAIL ${id}: "${ph}" at frame ${fr} outside the scene`); bad++; }
};
for (const file of files) {
  const lines = fs.readFileSync(file, "utf8").split("\n");
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^const (\w+): React\.FC(?:<[^=]*>)? = \(([^)]*)\) =>/);
    if (!m) continue;
    let j = i + 1; while (j < lines.length && !/^(const |\/\/ =|export |function |\/\*\*)/.test(lines[j])) j++;
    const body = lines.slice(i, j).join("\n");
    const km = body.match(/K\("([\w]+)"\)/);
    if (!km) continue;
    const id = km[1], k = IDS.indexOf(id);
    if (k < 0) { console.log(`FAIL ${path.basename(file)}:${i + 1} ${m[1]}: no scene ${id}`); bad++; continue; }
    seen.add(id);
    const ns = sc[k].sentences.length;
    for (const a of body.matchAll(/\bAT\(k,\s*(\d+),\s*"([^"]*)"\)/g)) onePhrase(id, k, +a[1], a[2], "AT");
    for (const a of body.matchAll(/\bATP\(k,\s*"([^"]*)"\)/g)) onePhrase(id, k, sc[k].sentences.findIndex((q) => q.text.includes(a[2] ?? a[1])), a[1], "ATP");
    for (const a of body.matchAll(/\b(SS|SE)\(k,\s*(\d+)\)/g)) {
      n++; if (+a[2] >= ns) { console.log(`FAIL ${id}: ${a[1]}(k, ${a[2]}) but the scene has ${ns} sentences`); bad++; }
    }
  }
}
// the event scenes (one EventWind component, phrases in EV_CFG): every ATP phrase of EventWind and every …W word field, per event
{
  const D = fs.readFileSync(path.join(SRC, "cs_sD.tsx"), "utf8");
  const body = D.slice(D.indexOf("const EV_CFG"), D.indexOf("/** the index of the sentence"));
  const atp = [...body.matchAll(/\bATP\(k,\s*"([^"]*)"\)/g)].map((a) => a[1]);
  for (const cfg of body.matchAll(/\{ id: "(s\d\d_\w+)"[\s\S]*?ratioW: "[^"]*" \}/g)) {
    const id = cfg[1], k = IDS.indexOf(id);
    if (k < 0) { console.log(`FAIL no scene ${id}`); bad++; continue; }
    seen.add(id);
    const words = [...cfg[0].matchAll(/\b\w+W: "([^"]*)"/g)].map((a) => a[1]);
    for (const ph of [...atp, ...words]) onePhrase(id, k, sc[k].sentences.findIndex((q) => q.text.includes(ph)), ph, "event");
  }
}
const miss = IDS.filter((id) => !seen.has(id));
if (miss.length) { console.log(`FAIL scenes without a component: ${miss.join(", ")}`); bad++; }
console.log(`${n} timing references in ${seen.size} scene components; AT/ATP anchors on Kokoro word times ${nW}, character share ${nC}; ${bad} failure(s)`);
if (charOnly.length) console.log(`  character share (no word time): ${charOnly.length > 30 ? charOnly.slice(0, 30).join("; ") + " …" : charOnly.join("; ")}`);
process.exitCode = bad ? 1 : 0;
