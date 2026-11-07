// Static timing check for ch00_coordinates (no browser): every AT(k, j, "phrase"), SS(k, j) and SE(k, j) in every scene component
// must name an existing sentence of that scene in timing.json, and every phrase must occur in that sentence's text (the TSX
// throws at render time otherwise). Also reports reveals whose frame falls outside the scene.
// usage: node movies/src/ch00_coordinates_flat/checks/at_check.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(HERE, "..");
const ROOT = path.resolve(SRC, "../../..");
const tm = JSON.parse(fs.readFileSync(path.join(ROOT, "movies/ch00/ch00_coordinates_flat/timing.json"), "utf8"));
const FPS = 30, HOLD = 75;
// fix 1 after fb1: AT() uses the Kokoro word times in words.json when the sentence text matches (as cf_lib.tsx); report how many anchors
const WJ = path.join(ROOT, "movies/ch00/ch00_coordinates_flat/words.json");
const WORDS = fs.existsSync(WJ) ? JSON.parse(fs.readFileSync(WJ, "utf8")).scenes : {};
const wnorm = (x) => x.toLowerCase().replace(/[^a-z0-9']/g, "");
const wordTime = (id, j, text, phrase) => {
  const e = (WORDS[id] || {})[String(j)];
  if (!e || e.text !== text) return null;
  const toks = e.w.map(([t, x]) => [t, wnorm(x)]).filter(([, x]) => x), ph = phrase.split(/\s+/).map(wnorm).filter((x) => x);
  for (let i = 0; i + ph.length <= toks.length; i++) if (ph.every((x, q) => toks[i + q][1] === x)) return toks[i][0];
  return null;
};
let byWord = 0, byChar = 0;
const charOnly = [];
const sc = tm.scenes, IDS = sc.map((s) => s.id);
const CUT = sc.map((s, i) => (i === 0 ? 0 : Math.round(s.start * FPS)));
const END = [...CUT.slice(1), tm.total_frames + HOLD];
const files = ["cf_sA.tsx", "cf_sB.tsx", "cf_sC.tsx"].map((f) => path.join(SRC, f));
let n = 0, bad = 0;
const seen = new Set();
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
    const ns = sc[k].sentences.length, len = END[k] - CUT[k];
    for (const a of body.matchAll(/\bAT\(k,\s*(\d+),\s*"([^"]*)"\)/g)) {
      n++; const jj = +a[1], ph = a[2];
      if (jj >= ns) { console.log(`FAIL ${id}: AT sentence ${jj} (scene has ${ns})`); bad++; continue; }
      const s = sc[k].sentences[jj], idx = s.text.indexOf(ph);
      if (idx < 0) { console.log(`FAIL ${id}: phrase "${ph}" not in S${jj}: ${s.text}`); bad++; continue; }
      const wt = wordTime(id, jj, s.text, ph);
      if (wt !== null) byWord++; else { byChar++; if (WORDS[id] && WORDS[id][String(jj)]) charOnly.push(`${id} S${jj + 1} "${ph}"`); }
      const fr = Math.round((wt !== null ? s.start + wt : s.start + ((s.end - s.start) * idx) / s.text.length) * FPS) - CUT[k];
      if (fr < 0 || fr > len) { console.log(`FAIL ${id}: AT "${ph}" at frame ${fr} outside 0..${len}`); bad++; }
    }
    for (const a of body.matchAll(/\b(SS|SE)\(k,\s*(\d+)\)/g)) {
      n++; if (+a[2] >= ns) { console.log(`FAIL ${id}: ${a[1]}(k, ${a[2]}) but the scene has ${ns} sentences`); bad++; }
    }
  }
}
const miss = IDS.filter((id) => !seen.has(id));
if (miss.length) { console.log(`FAIL scenes without a component: ${miss.join(", ")}`); bad++; }
console.log(`${n} timing references in ${seen.size} scene components; ${bad} failure(s); AT anchors on Kokoro word times ${byWord}, character share ${byChar}`);
if (charOnly.length) console.log(`  word times exist but the phrase did not match the tokens (character share used): ${charOnly.join("; ")}`);
process.exitCode = bad ? 1 : 0;
