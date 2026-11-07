// ch00_coordinates_moving (#5e) remake 2026-11-07: static right-edge check of every NEW text of the remake with the composition's own
// width rules (mv_lib texW = KaTeX estimate, house draw textW = sans), so no guard throws at render time (text must end before x 1842)
// and the Recall labels split as expected. No browser. usage: node movies/src/ch00_coordinates_moving/checks/r7_widths.mjs
const textW = (t, s) => [...t].reduce((w, ch) => w + s * (/[ .,:;()|'·]/.test(ch) ? 0.3 : /[mwMW]/.test(ch) ? 0.85 : /[A-Z0-9°]/.test(ch) ? 0.6 : 0.53), 0);
const texW = (src, s) => {   // = mv_lib.tsx texW
  let i = 0;
  const str = src.replace(/\\displaystyle|\\left|\\right|\\Big|\\big/g, "");
  const group = () => { if (str[i] !== "{") return atom(); i++; let w = 0; while (i < str.length && str[i] !== "}") w += atom(); i++; return w; };
  const atom = () => {
    const ch = str[i];
    if (ch === "\\") {
      const m = /^\\([a-zA-Z]+|.)/.exec(str.slice(i)); const cmd = m ? m[1] : ""; i += cmd.length + 1;
      if (cmd === "frac" || cmd === "dfrac" || cmd === "tfrac") { const a = group(), b = group(); return (Math.max(a, b) + 0.2) * (cmd === "tfrac" ? 0.75 : 1); }
      if (cmd === "text" || cmd === "mathrm") { const j = str.indexOf("}", i); const t = str.slice(i + 1, j); i = j + 1; return t.length * 0.5; }
      if (["hat", "mathbf", "boldsymbol", "underbrace", "cancel", "textcolor"].includes(cmd)) { if (cmd === "textcolor") group(); return group(); }
      if (cmd === "qquad") return 2; if (cmd === "quad") return 1; if (cmd === ",") return 0.17; if (cmd === " " || cmd === ";") return 0.28;
      if (["approx", "equiv", "neq", "Rightarrow", "Longrightarrow", "to", "longrightarrow", "times", "cdot"].includes(cmd)) return 1.3;
      if (["cos", "sin", "tan"].includes(cmd)) return 1.5;
      if (cmd === "sqrt") return group() + 0.9;
      if (cmd === "rm") return 0;
      return 0.62;
    }
    if (ch === "^" || ch === "_") { i++; return group() * 0.7; }
    if (ch === "{") return group();
    i++;
    if (ch === " ") return 0; if ("=+-<>".includes(ch)) return 1.3; if (",;".includes(ch)) return 0.45; if ("()[]|'".includes(ch)) return 0.4; if (".".includes(ch)) return 0.28;
    return 0.56;
  };
  let w = 0; while (i < str.length) w += atom();
  return w * s * 1.04;
};
const mixW = (t, s) => t.split("$").reduce((w, q, i) => w + (i % 2 ? texW(q, s) * 0.95 : textW(q, s)), 0);
const X = 1100, FLOOR = 44;
const tex = [
  ["s08 recall", String.raw`\theta=90^\circ-\text{bearing}`, 46], ["s08 east/north", String.raw`\text{east}=|\mathbf U|\cos\theta,\ \ \text{north}=|\mathbf U|\sin\theta`, 44],
  ["s08 r1", String.raw`\text{east}=|\mathbf U|\sin71^\circ`, 44], ["s08 r3", String.raw`\sin71^\circ\approx0.946,\ \ \cos71^\circ\approx0.326`, 44],
  ["s08 r4", String.raw`\text{east}=14.6\times0.946\approx13.8\ \text{m/s}`, 44], ["s08 r5", String.raw`\text{north}=14.6\times0.326\approx4.8\ \text{m/s}`, 44],
  ["s08 U ij", String.raw`\mathbf U=13.8\,\hat{\mathbf i}+4.8\,\hat{\mathbf j}`, 46], ["s09 ur", String.raw`u_r=u\cos\theta+v\sin\theta`, 46],
  ["s09 ut", String.raw`u_\theta=-u\sin\theta+v\cos\theta`, 46], ["s12 avg", String.raw`\bar u_\theta=\dfrac{1}{N}\sum_{i=1}^{N}u_{\theta,i},\ \ N=72`, 46],
  ["s14 trav", String.raw`\dfrac{dT}{dt}=\dfrac{\partial T}{\partial t}+\text{speed}\times\text{slope}`, 46], ["s04 u", String.raw`u=1.5+20=21.5\ \text{m/s}`, 52],
  ["s07 sum", String.raw`\text{sum}=-4.0+5.4=+1.4`, 44],
];
const labels = [
  ["s06 src", "from the derivatives movie"], ["s08 recall", "derived in Part 1: polar coordinates, bearings"], ["s08 recall head", "derived in Part 1:"],
  ["s08 recall name", "polar coordinates, bearings"], ["s08 U", "from Part 4: local east and north arrows"], ["s08 U name", "local east and north arrows"],
  ["s09", "derived in Part 1: radial and tangential wind"], ["s09 name", "radial and tangential wind"], ["s10", "met in the vectors movie"],
  ["s12", "derived in Part 1: ring averages"], ["s14", "from the derivatives movie: the traveller's rate"], ["s14 head", "from the derivatives movie:"],
  ["s14 name", "the traveller's rate"], ["s17 S10", "flights cross Greenland"],
];
const mixed = [["s14 grad p", "$\\nabla p$ · cross product movie"], ["s03 x", "$x$: from the station"], ["s14 speed", "speed $\\times$ slope along $\\mathbf U$"]];
let bad = 0;
for (const [n, s, z] of tex) { const e = X + texW(s, z); if (e > 1842) bad++; console.log(`${e > 1842 ? "FAIL" : "ok  "} ${n}: ends x ${Math.round(e)}`); }
for (const [n, t] of labels) { const e = X + textW(t, FLOOR); console.log(`${e > 1842 ? "two lines / FAIL if single" : "ok  "} ${n}: ends x ${Math.round(e)}`); }
for (const [n, t] of mixed) { const e = X + mixW(t, FLOOR); if (e > 1842) bad++; console.log(`${e > 1842 ? "FAIL" : "ok  "} ${n}: ends x ${Math.round(e)}`); }
console.log(`${bad} TeX / mixed text(s) past x 1842`);
process.exit(bad ? 1 : 0);
