// Adapted 2026-11-05 for ch00_coordinates_routes (#5f, Part 6; copied from Part 4 ch00_coordinates_frames, which was adapted from Part 1). Originally adapted 2026-11-04 for ch00_coordinates (build 1) from tools/movie_wb/swap_check.mjs: reads cf_sA/B/C.tsx, BYID = SCENES_A/B/C, module constants evaluated.
// Static keyword-swap check for ch00_weather_basics (UF2 fix loop 3, review 3 Must 2 / R2-M6): finds text blocks (Keyword,
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
const TIM = arg("--timing", path.join(ROOT, "movies/ch00/ch00_coordinates_routes/timing.json"));
const GAP = Number(arg("--gap", "8"));
const src = ["rt_sA.tsx", "rt_sB.tsx", "rt_sC.tsx"].map((f) => fs.readFileSync(path.join(ROOT, "movies/src/ch00_coordinates_routes", f), "utf8")).join("\n");
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
const CO_FILES = ["rt_sA.tsx", "rt_sB.tsx", "rt_sC.tsx"].map((f) => path.join(ROOT, "movies/src/ch00_coordinates_routes", f));
const CO_D = JSON.parse(fs.readFileSync(path.join(ROOT, "movies/ch00/ch00_coordinates_routes/data/rt.json"), "utf8"));
const easeC = (t) => { const x = Math.max(0, Math.min(1, t)); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const BRm = CO_D.places.brest;
const pieces = (s, seps) => { const out = []; let rest = s; for (const sp of seps) { const i = rest.indexOf(sp); out.push(rest.slice(0, i)); rest = rest.slice(i); } out.push(rest); return out; };
const CO_HELP = { D: CO_D, D2R: Math.PI / 180, mix: (a, b, t) => a + (b - a) * t, ease: easeC, prog: (f, a, b) => easeC((f - a) / Math.max(1, b - a)),
  nf: (v, d = 1, plus = false) => `${v < 0 ? "−" : plus && v > 0 ? "+" : ""}${Math.abs(v).toFixed(d)}`, XC: 1100, XZ: 1190, XMAX: 1840,
  BREST: BRm, LON: CO_D.places.london, LAX: CO_D.places.la, LIS: CO_D.places.lisbon, LYB: CO_D.places.lyb, RO: CO_D.route, RH: CO_D.rhumb, SLATE: "#aab4c8", PHI: BRm[0],
  H: { i: "\hat{\mathbf i}", j: "\hat{\mathbf j}", k: "\hat{\mathbf k}", R: "\hat{\mathbf R}", x: "\hat{\mathbf x}", y: "\hat{\mathbf y}", z: "\hat{\mathbf z}", r: "\hat{\mathbf r}", th: "\hat{\boldsymbol\theta}", xp: "\hat{\mathbf x}'", yp: "\hat{\mathbf y}'", v: "\mathbf v" },
  GB: { x: 60, y: 28, w: 960, h: 790 }, GFULL: { x: 0, y: 0, w: 1920, h: 1080 }, C: { first: "#2aa198", second: "#e8833a", neg: "#d9667f", key: "#f4ecd2", gold: "#d8b23a", local: "#aab4c8", muted: "#9aa6bd", ink: "#e8ecf4", bg: "#171f33", grid: "#2a3550" },
  BROWN: "#a0784e", cutAt: (s, at) => s.split(at), pieces,
  trap: (u, r) => { const x = Math.max(0, Math.min(1, u)), v = 1 / (1 - r); if (x < r) return (0.5 * v * x * x) / r; if (x > 1 - r) return 1 - (0.5 * v * (1 - x) * (1 - x)) / r; return v * (x - r / 2); } };
// the storyboard equation constants (rt_eq.ts) for the TeX boxes
for (const m of fs.readFileSync(path.join(ROOT, "movies/src/ch00_coordinates_routes/rt_eq.ts"), "utf8").matchAll(/^export const (EQ_\w+) = (String\.raw`[^`]*`);/gm)) { try { CO_HELP[m[1]] = Function(`return ${m[2]};`)(); } catch { /* skip */ } }
Object.assign(BASE, CO_HELP);
// module-level single-line consts of the scene files (data aliases, layout constants, small arrow functions)
{ const stripRet = (e) => e.replace(/\)\s*:\s*[A-Za-z][\w<>\[\], |]*\s*=>/g, ") =>").replace(/:\s*(PV|Pt|MapBox|V3|number|string|Ax)(\[\])?(?=\s*[=,)])/g, "");
  for (const file of CO_FILES) for (const ln of fs.readFileSync(file, "utf8").split("\n")) {
    const m = ln.match(/^(?:export )?const (\w+)(?::\s*[\w<>\[\], |]+)?\s*=\s*(.+);\s*$/); if (!m || /React\.FC|=>\s*\{\s*$/.test(ln) || m[1] in BASE) continue;
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

// ---------- per-frame simulation ----------
const ramp = (x, a, b) => { if (b <= a) return x >= b ? 1 : 0; const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const fin = (f, a, n = 12) => ramp(f, a, a + n), fout = (f, a, n = 10) => 1 - ramp(f, a, a + n), win = (f, a, b, n = 10) => fin(f, a, n) * fout(f, b, n);
const pulse = (f, a, n = 20) => (f < a || f > a + n ? 0 : Math.sin((Math.PI * (f - a)) / n));
Object.assign(BASE, { ramp, fin, fout, win, pulse, fmt: (v, d = 0) => v.toFixed(d), sc });
// module-level equation strings (EQ_* = String.raw`…`) for the TeX boxes
for (const m of src.matchAll(/^const (EQ_\w+) = (String\.raw`[^`]*`);/gm)) { try { BASE[m[1]] = Function(`return ${m[2]};`)(); } catch { /* skip */ } }
const texW = (tex, size) => { const t = String(tex ?? "").replace(/\\(dfrac|frac|text|mathrm|mathbf|boldsymbol|left|right|quad|,|;|!)/g, "").replace(/\\[a-zA-Z]+/g, "x").replace(/[{}^_]/g, "");
  return Math.min(780, Math.max(60, t.length * 0.5 * size)); };
const comp1 = (e) => { if (e === undefined) return null; try { return Function("scope", `with (scope) { return (${stripTS(e)}); }`); } catch { return () => undefined; } };
const run = (fn, scope) => { if (!fn) return undefined; try { return fn(scope); } catch { return undefined; } };
const report = [], skipped = new Set(); let nText = 0;
const fmtClock = (fr) => `${Math.floor(fr / FPS / 60)}:${((fr / FPS) % 60).toFixed(1).padStart(4, "0")}`;
for (const id of IDS) {
  const name = byid[id]; let c = comp[name]; const scope0 = { ...BASE };
  const wrap = c && c.body.match(/<SliceScene warm(=\{false\})? \/>/);
  if (wrap) { scope0.warm = !wrap[1]; c = comp.SliceScene; }
  if (!c) continue;
  const k = K(id), len = LEN(k), body = c.body;
  const decls = [];
  for (const d of declsOf(body)) for (const dec of splitTop(d)) { const m = dec.match(/^(\w+)\s*(?::\s*[^=]+?)?=\s*([\s\S]+)$/); if (m && m[1] !== "f") decls.push([m[1], comp1(m[2])]); }
  const dead = [];
  if (scope0.warm !== undefined) { const i0 = body.indexOf("{!warm ? <g>"), i1 = body.indexOf("</g> : <g>", i0), i2 = body.indexOf("</g>}", i1 + 10);
    if (i0 > 0 && i1 > 0 && i2 > 0) dead.push(scope0.warm ? [i0, i1] : [i1, i2]); }
  const groups = []; { const st = []; const re = /<(g|Svg)(?=[\s>])|<\/(g|Svg)>/g; let m;
    while ((m = re.exec(body))) {
      if (m[2]) { const top = st.pop(); if (top) groups.push({ a: top.a, b: m.index, o: top.o }); continue; }
      let j = m.index + 2; for (; j < body.length; j++) { const ch = body[j]; if (ch === "{") { j = matchClose(body, j); continue; } if (ch === ">") break; }
      if (body[j - 1] === "/") continue;
      const A = parseAttrs(body.slice(m.index + m[1].length + 1, j));
      st.push({ a: m.index, o: comp1(m[1] === "g" ? A.opacity : A.o) });
    } }
  const els = [];
  const re = /<(Keyword|Callout|SideCallout|Lbl|TeX)\s/g; let m;
  while ((m = re.exec(body))) {
    if (dead.some(([a, b]) => m.index > a && m.index < b)) continue;
    let j = m.index + 1;
    for (; j < body.length; j++) { const ch = body[j]; if (ch === "{") { j = matchClose(body, j); continue; } if (ch === "/" && body[j + 1] === ">") break; }
    const A = parseAttrs(body.slice(m.index + m[1].length + 1, j)); nText++;
    els.push({ kind: m[1], line: lineOf(c, m.index), A, x: comp1(A.x), y: comp1(A.y), at: comp1(A.at), s: comp1(m[1] === "TeX" ? A.size : A.s), a: comp1(A.a), t: comp1(m[1] === "TeX" ? A.s : (A.t ?? A.text)), lines: comp1(A.lines),
      ax: comp1(A.ax), ay: comp1(A.ay),
      appear: comp1(A.appear), out: comp1(A.out), o: comp1(A.o), wraps: groups.filter((g) => g.a < m.index && g.b > m.index && g.o).map((g) => g.o), runs: [], last: null, ok: 0 });
  }
  const hit = new Map();
  for (let f = 0; f < len + 10; f++) {
    const scope = { ...scope0, f, k };
    for (const [n, fn] of decls) scope[n] = run(fn, scope);
    const vis = [];
    for (const E of els) {
      let op = E.o ? run(E.o, scope) : 1; if (typeof op !== "number") { if (E.o) { skipped.add(`${id} L${E.line}`); continue; } op = 1; }
      if (E.kind === "Keyword" || E.kind === "Callout" || E.kind === "SideCallout") { const ap = run(E.appear, scope), ou = E.out ? run(E.out, scope) : undefined; if (typeof ap !== "number") { skipped.add(`${id} L${E.line}`); continue; }
        op *= ramp(f, ap, ap + 8) * (ou !== undefined ? 1 - ramp(f, ou, ou + 10) : 1); }
      for (const w of E.wraps) { const v = run(w, scope); if (typeof v === "number") op *= v; }
      if (!(op > 0.02)) { continue; }
      let x, y; if (E.kind === "Lbl" || E.kind === "TeX") { x = run(E.x, scope); y = run(E.y, scope); } else { const at = run(E.at, scope); if (Array.isArray(at)) [x, y] = at; }
      if (!Number.isFinite(x) || !Number.isFinite(y)) { skipped.add(`${id} L${E.line}`); continue; }
      const sz = run(E.s, scope) ?? (E.kind === "TeX" ? 68 : 54), an = run(E.a, scope) ?? "start";
      if (E.kind === "TeX") { const tex = String(run(E.t, scope) ?? ""), w = texW(tex, sz), h = sz * (/dfrac|frac/.test(tex) ? 2.2 : 1.2), ax = run(E.ax, scope) ?? 0, ay = run(E.ay, scope) ?? 0.5;
        E.txt = tex.slice(0, 40); E.ok++; vis.push({ E, box: [x - ax * w, y - ay * h, x - ax * w + w, y - ay * h + h] }); continue; }
      let txt = run(E.t, scope), nl = 1; if (E.kind === "Callout" || E.kind === "SideCallout") { const L = run(E.lines, scope); if (Array.isArray(L)) { txt = L.reduce((p, q) => (q.length > p.length ? q : p), ""); nl = L.length; } else txt = L; }
      txt = String(txt ?? "");
      const w = textW(txt, sz), x0 = an === "start" ? x : an === "end" ? x - w : x - w / 2;
      E.txt = txt; E.ok++;
      vis.push({ E, box: [x0, y - 0.45 * sz, x0 + w, y + 0.45 * sz + (nl - 1) * 1.25 * sz] });
    }
    const inter = (P, Q) => Math.min(P[2], Q[2]) - Math.max(P[0], Q[0]) > 10 && Math.min(P[3], Q[3]) - Math.max(P[1], Q[1]) > 2; // textW over-estimates widths by a few %
    for (let i = 0; i < vis.length; i++) for (let j = i + 1; j < vis.length; j++) {
      const P = vis[i], Q = vis[j]; if (P.E.txt === Q.E.txt || !inter(P.box, Q.box)) continue;
      const key = `O|${P.E.line}|${Q.E.line}`; const h = hit.get(key); if (h) h.n++; else hit.set(key, { sev: "OVERLAP", f, n: 1, a: P.E, b: Q.E });
    }
    // tight: a block that appears this frame while another block on the same spot left < GAP frames ago
    for (const V of vis) {
      if (V.E.prevVis !== f - 1) for (const E of els) if (E !== V.E && E.lastBox && f - E.lastF <= GAP && f - E.lastF > 1 && E.txt !== V.E.txt && inter(E.lastBox, V.box)) {
        const key = `T|${E.line}|${V.E.line}`; if (!hit.has(key)) hit.set(key, { sev: "TIGHT", f, n: f - E.lastF - 1, a: E, b: V.E }); }
    }
    for (const V of vis) { V.E.prevVis = f; V.E.lastF = f; V.E.lastBox = V.box; if (V.E.first === undefined) V.E.first = f; (V.E.vf ??= []).push(f); }
  }
  for (const h of hit.values()) { if ((h.b.first ?? 1e9) < (h.a.first ?? 1e9)) [h.a, h.b] = [h.b, h.a]; } // a = the older block
  // shift = frames the old block's fade-out must move earlier so it is gone >= GAP frames before the new block starts
  for (const h of hit.values()) { const F = h.b.first, last = Math.max(...h.a.vf.filter((x) => x < F + 60)); h.shift = last - (F - GAP - 1); h.F = F; }
  for (const h of hit.values()) report.push({ scene: id, sev: h.sev, clock: fmtClock(CUT[k] + h.f), f: h.f, n: h.n, shift: h.shift, F: h.F, oldLine: h.a.line, oldTxt: h.a.txt, oldKind: h.a.kind,
    a: `${h.a.kind} "${h.a.txt}" L${h.a.line}`, b: `${h.b.kind} "${h.b.txt}" L${h.b.line}` });
}
const skippedN = skipped.size;
for (const r of report) console.log(`${r.sev.padEnd(7)} ${r.scene.padEnd(26)} ${r.clock.padStart(8)} (f ${r.f}) ${r.sev === "OVERLAP" ? `${r.n} fr` : `gap ${r.n} fr`} shift ${r.shift}  ${r.a}  ×  ${r.b}`);
console.log(`\n${nText} text elements; ${report.filter((r) => r.sev === "OVERLAP").length} text-over-text pairs, ${report.filter((r) => r.sev === "TIGHT").length} swaps with a gap < ${GAP} frames; ${skippedN} element(s) not evaluable on some frames`);
const jo = arg("--json"); if (jo) fs.writeFileSync(jo, JSON.stringify({ report, skipped: [...skipped] }, null, 1));
process.exitCode = report.length ? 1 : 0;
