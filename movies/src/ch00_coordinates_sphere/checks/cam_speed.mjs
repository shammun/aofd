// Adapted 2026-11-05 for ch00_coordinates_sphere (#5c, Part 3) from Part 4's copy (paths, data aliases).
// Adapted 2026-11-05 for ch00_coordinates_sphere (#5d, Part 4; from Part 1's copy). Originally adapted 2026-11-04 for ch00_coordinates (build 1) from tools/movie_wb/cam_speed.mjs: reads cf_sA/B/C.tsx, BYID = SCENES_A/B/C; adds spinPath (cf_lib) and the house orbit cameras.
// (shared prelude copied from swap_check.mjs) Static keyword-swap check for ch00_weather_basics (UF2 fix loop 3, review 3 Must 2 / R2-M6): finds text blocks (Keyword,
// Callout, Lbl) in the same scene whose screen boxes overlap and whose visibility windows overlap, or follow each other with a
// gap shorter than GAP frames (the old text must be fully faded out >= 8 frames before the new text starts to fade in).
// No browser: evaluates each scene component's `const` declarations against timing.json (SS/SE/AT/LEN as in the TSX), then
// the text elements' positions and windows (Keyword/Callout appear..out+10; Lbl o={win(f,a,b,n)} -> a..b+n, fin -> a..end,
// fout(f,b,n) -> 0..b+n). Positions that depend on a 3-D projection or on the frame are skipped (counted in the summary).
// Elements inside a wrapping <g opacity=...> are evaluated on their own attributes only.
// usage: node tools/movie_wb/swap_check.mjs [--tsx movies/src/ch00_weather_basics/WeatherBasics.tsx] [--timing movies/ch00/ch00_weather_basics/timing.json] [--json out.json]
import fs from "node:fs";
import path from "node:path";

import { fileURLToPath } from "node:url";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const TSX = "(three scene files)";
const TIM = arg("--timing", path.join(ROOT, "movies/ch00/ch00_coordinates_sphere/timing.json"));
const GAP = Number(arg("--gap", "8"));
const src = ["cs_sA.tsx", "cs_sB.tsx", "cs_sC.tsx"].map((f) => fs.readFileSync(path.join(ROOT, "movies/src/ch00_coordinates_sphere", f), "utf8")).join("\n");
const tm = JSON.parse(fs.readFileSync(TIM, "utf8"));
const FPS = 30, HOLD = 75;
const sc = tm.scenes, IDS = sc.map((s) => s.id);
const WB_FRAMES = tm.total_frames + HOLD;
const CUT = sc.map((s, i) => (i === 0 ? 0 : Math.round(s.start * FPS)));
const END = [...CUT.slice(1), WB_FRAMES];
const K = (id) => { const k = IDS.indexOf(id); if (k < 0) throw new Error(`no scene ${id}`); return k; };
const LEN = (k) => END[k] - CUT[k];
const SS = (k, j) => Math.round(sc[k].sentences[j].start * FPS) - CUT[k];
const SE = (k, j) => Math.round(sc[k].sentences[j].end * FPS) - CUT[k];
const AT = (k, j, phrase) => { const s = sc[k].sentences[j]; const i = s.text.indexOf(phrase); if (i < 0) throw new Error(`phrase ${phrase}`);
  return Math.round((s.start + ((s.end - s.start) * i) / s.text.length) * FPS) - CUT[k]; };
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const easeIO = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const textW = (t, s) => [...t].reduce((w, ch) => w + s * (/[ .,:;()|'·]/.test(ch) ? 0.3 : /[mwMW]/.test(ch) ? 0.85 : /[A-Z0-9°]/.test(ch) ? 0.6 : 0.53), 0);
const T = { hero: 128, eq: 84, calc: 68, key: 54, floor: 44 };
const swarp = (x, segs) => segs.reduce((v, [a, b]) => { if (v <= a || v >= b) return v;
  const y = 0.5 - 0.5 * Math.cos((Math.PI * (v - a)) / (b - a)), u = y < 0.5 ? Math.cbrt(y / 4) : 1 - Math.cbrt(2 * (1 - y)) / 2; return a + (b - a) * u; }, x); // = the TSX helper
const BASE = { swarp, SS, SE, AT, LEN, K, CUT, END, FPS, XF: 10, clamp, easeIO, Math, T, Number, String, f: 0, fin: () => 1, fout: () => 1, win: () => 1, pulse: () => 0, ramp: () => 1 };

// ---------- tiny lexer helpers ----------
const matchClose = (s, i) => { // s[i] is an opening bracket; returns index of its partner (strings/templates skipped)
  const open = s[i], close = { "(": ")", "[": "]", "{": "}" }[open]; let d = 0;
  for (let j = i; j < s.length; j++) {
    const c = s[j];
    if (c === '"' || c === "'" || c === "`") { j = skipStr(s, j); continue; }
    if (c === open) d++; else if (c === close) { d--; if (d === 0) return j; }
  }
  return -1;
};
const skipStr = (s, i) => { const q = s[i]; for (let j = i + 1; j < s.length; j++) { if (s[j] === "\\") { j++; continue; } if (q === "`" && s[j] === "$" && s[j + 1] === "{") { j = matchClose(s, j + 1); continue; } if (s[j] === q) return j; } return s.length; };
const splitTop = (s, sep = ",") => { const out = []; let d = 0, a = 0;
  for (let j = 0; j < s.length; j++) { const c = s[j];
    if (c === '"' || c === "'" || c === "`") { j = skipStr(s, j); continue; }
    if ("([{".includes(c)) d++; else if (")]}".includes(c)) d--; else if (c === sep && d === 0) { out.push(s.slice(a, j)); a = j + 1; } }
  out.push(s.slice(a)); return out.map((x) => x.trim()).filter((x) => x.length); };
const stripTS = (e) => e.replace(/\s+as\s+unknown\s+as\s+[\w.<>\[\]|, ]+?(?=[),;\]}]|$)/g, "").replace(/\s+as\s+(const|number|string|any|boolean|V3|Pt|[A-Z]\w*)(\[\])*(?![\w])/g, "")
  .replace(/\(\s*(\w+)\s*:\s*[\w\[\]]+\s*\)\s*=>/g, "($1) =>").replace(/\((\w+): [\w\[\]]+, (\w+): [\w\[\]]+\)\s*=>/g, "($1, $2) =>").replace(/(\w+)\s*:\s*(number|string|boolean|any|V3|Pt)(\[\])*(?=\s*[,)=])/g, "$1");
const evalIn = (scope, e) => { try { return Function("scope", `with (scope) { return (${stripTS(e)}); }`)(scope); } catch { return undefined; } };

// ---------- components ----------
const byid = {}; for (const m of src.matchAll(/export const SCENES_[ABC]: Record<string, React\.FC> = \{([\s\S]*?)\};/g)) for (const p of splitTop(m[1])) { const [a, b] = p.split(":").map((x) => x.trim()); byid[a] = b; }
// ---------- ch00_coordinates adaptation (build 1): three scene files, BYID = SCENES_A/B/C, module constants and helpers ----------
const CO_FILES = ["cs_sA.tsx", "cs_sB.tsx", "cs_sC.tsx"].map((f) => path.join(ROOT, "movies/src/ch00_coordinates_sphere", f));
const CO_D = JSON.parse(fs.readFileSync(path.join(ROOT, "movies/ch00/ch00_coordinates_sphere/data/cs.json"), "utf8"));
const easeC = (t) => { const x = Math.max(0, Math.min(1, t)); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const BRm = CO_D.places.brest;
const pieces = (s, seps) => { const out = []; let rest = s; for (const sp of seps) { const i = rest.indexOf(sp); out.push(rest.slice(0, i)); rest = rest.slice(i); } out.push(rest); return out; };
const CO_HELP = { D: CO_D, D2R: Math.PI / 180, mix: (a, b, t) => a + (b - a) * t, ease: easeC, prog: (f, a, b) => easeC((f - a) / Math.max(1, b - a)),
  nf: (v, d = 1, plus = false) => `${v < 0 ? "−" : plus && v > 0 ? "+" : ""}${Math.abs(v).toFixed(d)}`, XC: 1100, XZ: 1190, XMAX: 1840,
  BREST: BRm, SING: CO_D.places.sing, KHULNA: CO_D.places.khulna, LYB: CO_D.places.lyb, GREENWICH: CO_D.places.greenwich, VIOLET: "#8e6fd8", PHI: BRm[0], LON0: BRm[1], KX3: 1430, KH: CO_D.khulna, BR: CO_D.brest, SP: CO_D.spin, DG: CO_D.deg, E5: CO_D.era5, AR: CO_D.area, BD: CO_D.band, TM: CO_D.t2m,
  H: { i: "\hat{\mathbf i}", j: "\hat{\mathbf j}", k: "\hat{\mathbf k}", R: "\hat{\mathbf R}", x: "\hat{\mathbf x}", y: "\hat{\mathbf y}", z: "\hat{\mathbf z}", r: "\hat{\mathbf r}", th: "\hat{\boldsymbol\theta}", xp: "\hat{\mathbf x}'", yp: "\hat{\mathbf y}'", v: "\mathbf v" },
  GB: { x: 60, y: 28, w: 960, h: 790 }, GFULL: { x: 0, y: 0, w: 1920, h: 1080 }, C: { first: "#2aa198", second: "#e8833a", neg: "#d9667f", key: "#f4ecd2", gold: "#d8b23a", local: "#aab4c8", muted: "#9aa6bd", ink: "#e8ecf4", bg: "#171f33", grid: "#2a3550" },
  BROWN: "#a0784e", cutAt: (s, at) => s.split(at), pieces,
  trap: (u, r) => { const x = Math.max(0, Math.min(1, u)), v = 1 / (1 - r); if (x < r) return (0.5 * v * x * x) / r; if (x > 1 - r) return 1 - (0.5 * v * (1 - x) * (1 - x)) / r; return v * (x - r / 2); } };
// the storyboard equation constants (cs_eq.ts) for the TeX boxes
for (const m of fs.readFileSync(path.join(ROOT, "movies/src/ch00_coordinates_sphere/cs_eq.ts"), "utf8").matchAll(/^export const (EQ_\w+) = (String\.raw`[^`]*`);/gm)) { try { CO_HELP[m[1]] = Function(`return ${m[2]};`)(); } catch { /* skip */ } }
Object.assign(BASE, CO_HELP);
// module-level single-line consts of the scene files (data aliases, layout constants, small arrow functions)
{ const stripRet = (e) => e.replace(/\)\s*:\s*[A-Za-z][\w<>\[\], |]*\s*=>/g, ") =>").replace(/:\s*(PV|Pt|MapBox|V3|number|string|Ax)(\[\])?(?=\s*[=,)])/g, "");
  for (const file of CO_FILES) for (const ln of fs.readFileSync(file, "utf8").split("\n")) {
    const m = ln.match(/^const (\w+)(?::\s*[\w<>\[\], |]+)?\s*=\s*(.+);\s*$/); if (!m || /React\.FC|=>\s*\{\s*$/.test(ln) || m[1] in BASE) continue;
    for (const part of splitTop(m[0].replace(/^(?:export )?const /, "").replace(/;\s*$/, ""))) { const q = part.match(/^(\w+)(?::\s*[\w<>\[\], |]+)?\s*=\s*([\s\S]+)$/); if (!q) continue;
      try { BASE[q[1]] = Function("scope", `with (scope) { return (${stripTS(stripRet(q[2]))}); }`)(BASE); } catch { /* not evaluable: skipped */ } } } }
const lines = src.split("\n");
const comp = {}; // name -> body text
for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(/^const (\w+): React\.FC(?:<[^=]*>)? = \(([^)]*)\) =>/);
  if (!m) continue;
  let j = i + 1; while (j < lines.length && !/^(const |\/\/ =|export |function |\/\*\*)/.test(lines[j])) j++;
  comp[m[1]] = { body: lines.slice(i, j).join("\n").replace(/(^|[\s;{},])\/\/[^\n]*/g, "$1"), line0: i + 1 }; // line comments out (an apostrophe in one breaks the lexer)
}
const lineOf = (c, idx) => c.line0 + c.body.slice(0, idx).split("\n").length - 1;

const declsOf = (body) => { // top-level `const a = …, b = …;` statements before `return (`
  const r = body.indexOf("\n  return ("); const pre = r > 0 ? body.slice(0, r) : body; const out = [];
  const re = /\n\s{2,4}const /g; let m;
  while ((m = re.exec(pre))) {
    let j = m.index + m[0].length, d = 0;
    for (; j < pre.length; j++) { const c = pre[j]; if (c === '"' || c === "'" || c === "`") { j = skipStr(pre, j); continue; }
      if ("([{".includes(c)) d++; else if (")]}".includes(c)) d--; else if (c === ";" && d === 0) break; }
    out.push(pre.slice(m.index + m[0].length, j));
  }
  return out;
};
const parseAttrs = (s) => { const a = {}; let i = 0;
  while (i < s.length) { const m = /^\s*([A-Za-z_][\w-]*)\s*=\s*/.exec(s.slice(i)); if (!m) { i++; continue; } i += m[0].length;
    if (s[i] === "{") { const j = matchClose(s, i); a[m[1]] = s.slice(i + 1, j); i = j + 1; } else if (s[i] === '"') { const j = skipStr(s, i); a[m[1]] = JSON.stringify(s.slice(i + 1, j)); i = j + 1; } }
  return a; };
const callArgs = (e, fn) => { const i = e.search(new RegExp(`\\b${fn}\\(`)); if (i < 0) return null; const o = e.indexOf("(", i); return splitTop(e.slice(o + 1, matchClose(e, o))); };


// ---------- camera speed (review 3 Must 3, U-WB-R4: no whip pans) ----------
// Evaluates every scene's camera per frame: `cam` from globePath (globe view centre: great-circle rate of the sub-camera point) and
// orbit cameras from orbitPath (`st`/`o3`/keys: rotation rate of the view direction + target travel / distance). Reports the peak
// rate per scene in °/s and every stretch above --limit (default 90 °/s).
// usage: node tools/movie_wb/cam_speed.mjs [--limit 90]
const LIMIT = Number(arg("--limit", "90"));
const D2R = Math.PI / 180;
const ll = (lat, lon, r = 1) => { const la = lat * D2R, lo = lon * D2R; return [r * Math.cos(la) * Math.sin(lo), r * Math.sin(la), r * Math.cos(la) * Math.cos(lo)]; };
const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const lerpN = (a, b, t) => a + (b - a) * t;
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const easeIO3 = (t) => { const x = clamp01(t); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const globePath = (keys, f) => {
  if (f <= keys[0].f) return keys[0];
  for (let i = 1; i < keys.length; i++) { const A = keys[i - 1], B = keys[i];
    if (f <= B.f) { const t = easeIO3((f - A.f) / Math.max(1, B.f - A.f)); const a = ll(A.lat, A.lon), b = ll(B.lat, B.lon);
      const om = Math.acos(Math.max(-1, Math.min(1, dot3(a, b)))); let v = a;
      if (om > 1e-6) { const s = Math.sin(om); v = a.map((x, j) => x * Math.sin((1 - t) * om) / s + b[j] * Math.sin(t * om) / s); }
      return { lat: Math.asin(Math.max(-1, Math.min(1, v[1]))) / D2R, lon: Math.atan2(v[0], v[2]) / D2R, dist: lerpN(A.dist, B.dist, t) + (B.hop ?? 0) * Math.sin(Math.PI * t), _g: 1 }; } }
  return keys[keys.length - 1];
};
const orbitPath = (keys, f) => {
  if (f <= keys[0].f) return keys[0];
  for (let i = 1; i < keys.length; i++) { const A = keys[i - 1], B = keys[i];
    if (f <= B.f) { const raw = (f - A.f) / Math.max(1, B.f - A.f); const t = B.orbit !== undefined || B.linear ? clamp01(raw) : easeIO3(raw);
      let daz = B.az - A.az; if (B.orbit !== undefined) daz = B.orbit; else daz = ((daz % 360) + 540) % 360 - 180;
      return { az: A.az + daz * t, el: lerpN(A.el, B.el, t), dist: lerpN(A.dist, B.dist, t), target: A.target.map((x, j) => lerpN(x, B.target[j], t)) }; } }
  const last = keys[keys.length - 1]; return last.orbit !== undefined ? { ...last, az: keys[keys.length - 2].az + last.orbit } : last;
};
const orbitCam = (o) => ({ ...o, _o: 1 });
Object.assign(BASE, { globePath, orbitPath, orbitCam, easeIO: easeIO3, ll, D2R });
// ch00_coordinates: the house orbit cameras are imported as hOrbitPath / hOrbitCam; spinPath (cf_lib) is the spinning-globe path
const spinImpl = (keys, f) => { if (f <= keys[0].f) return keys[0];
  for (let i = 1; i < keys.length; i++) { const A = keys[i - 1], B = keys[i]; if (f <= B.f) { const u = (f - A.f) / Math.max(1, B.f - A.f), e = easeIO3(u), tl = B.spin !== undefined ? CO_HELP.trap(u, B.spin) : e;
    return { lat: A.lat + (B.lat - A.lat) * e, lon: A.lon + (B.lon - A.lon) * tl, dist: A.dist + (B.dist - A.dist) * e }; } }
  return keys[keys.length - 1]; };
Object.assign(BASE, { hOrbitPath: orbitPath, hOrbitCam: (o) => ({ ...o, _o: 1 }), spinPath: (keys, f) => ({ ...spinImpl(keys, f), _g: 1 }) });
const ramp = (x, a, b) => { if (b <= a) return x >= b ? 1 : 0; const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
Object.assign(BASE, { ramp, fin: (f, a, n = 12) => ramp(f, a, a + n), fout: (f, a, n = 10) => 1 - ramp(f, a, a + n), pulse: () => 0 });
const comp1 = (e) => { if (e === undefined) return null; try { return Function("scope", `with (scope) { return (${stripTS(e)}); }`); } catch { return () => undefined; } };
const run = (fn, scope) => { if (!fn) return undefined; try { return fn(scope); } catch (e) { if (process.env.CAMDBG && scope.f === 650) console.error(String(e).slice(0, 200)); return undefined; } };
const dirOf = (o) => { const a = o.az * D2R, e = o.el * D2R; return [Math.cos(e) * Math.cos(a), Math.cos(e) * Math.sin(a), Math.sin(e)]; };
const ang = (a, b) => Math.acos(Math.max(-1, Math.min(1, dot3(a, b)))) / D2R;
const fmtClock = (fr) => `${Math.floor(fr / FPS / 60)}:${((fr / FPS) % 60).toFixed(1).padStart(4, "0")}`;
let bad = 0;
for (const id of IDS) {
  const name = byid[id]; let c = comp[name]; const scope0 = { ...BASE };
  const wrap = c && c.body.match(/<SliceScene warm(=\{false\})? \/>/);
  if (wrap) { scope0.warm = !wrap[1]; c = comp.SliceScene; }
  if (!c) continue;
  const k = K(id), len = LEN(k);
  const decls = [];
  for (const d of declsOf(c.body)) for (const dec of splitTop(d)) { const m = dec.match(/^(\w+)\s*(?::\s*[^=]+?)?=\s*([\s\S]+)$/); if (m && m[1] !== "f") decls.push([m[1], comp1(m[2].replace(/orbitCam\(([\s\S]*),\s*\[[^\]]*\]\s*\)$/, "orbitCam($1)"))]); }
  const cams = {}; let prev = {};
  for (let f = 0; f <= len; f++) {
    const scope = { ...scope0, f, k };
    for (const [n, fn] of decls) scope[n] = run(fn, scope);
    for (const [n, v] of Object.entries(scope)) {
      if (!v || typeof v !== "object") continue;
      let rate;
      if (v._g && Number.isFinite(v.lat)) { const p = ll(v.lat, v.lon); if (prev[n]) rate = ang(prev[n].p, p) * FPS; prev[n] = { p }; }
      else if ((v._o || (v.az !== undefined && v.el !== undefined && v.target)) && Number.isFinite(v.az)) { const d = dirOf(v);
        if (prev[n]) { const dt = Math.hypot(...v.target.map((x, j) => x - prev[n].t[j])); rate = (ang(prev[n].d, d) + (dt / v.dist) / D2R) * FPS; } prev[n] = { d, t: v.target }; }
      else continue;
      if (rate === undefined) continue;
      const C = (cams[n] ??= { peak: 0, at: 0, runs: [], cur: null });
      if (rate > C.peak) { C.peak = rate; C.at = f; }
      if (rate > LIMIT) { if (!C.cur) C.cur = { a: f, b: f, peak: rate }; else { C.cur.b = f; C.cur.peak = Math.max(C.cur.peak, rate); } }
      else if (C.cur) { C.runs.push(C.cur); C.cur = null; }
    }
  }
  for (const [n, C] of Object.entries(cams)) {
    if (C.cur) C.runs.push(C.cur);
    if (C.peak < 1) continue;
    const flag = C.runs.length ? "FAST" : "ok";
    if (C.runs.length) bad++;
    console.log(`${flag.padEnd(4)} ${id.padEnd(26)} ${n.padEnd(6)} peak ${C.peak.toFixed(0).padStart(4)} °/s at ${fmtClock(CUT[k] + C.at)}` + C.runs.map((r) => `  [${fmtClock(CUT[k] + r.a)}–${fmtClock(CUT[k] + r.b)} peak ${r.peak.toFixed(0)}]`).join(""));
  }
}
console.log(`\n${bad} camera(s) above ${LIMIT} °/s`);
process.exitCode = bad ? 1 : 0;
