// KaTeX helpers for the v5 movies: memoised rendering, positioned TeX, layered equations (BraceNote underbraces,
// underset keywords, cancel strikes, per-part colour/glow) and the CalcStack (rows aligned at "=").
// Sizes are the EFFECTIVE glyph size: KaTeX draws at 1.21 × its container's font size, so the container gets size/1.21.
import React from "react";
import { ramp, tex } from "..";
import { clamp } from "./draw";
import { C, floor } from "./type";

export const KX = 1.21;
const cache = new Map<string, string>();
/** KaTeX rendered once per string (module cache). Throws on a TeX error, so a bad string fails the render. */
export const texHtml = (s: string): string => {
  let h = cache.get(s);
  if (h === undefined) {
    h = tex(String.raw`\displaystyle ` + s, false); // display style: full-size fractions
    cache.set(s, h);
  }
  return h;
};

export const col = (c: string, s: string) => `\\textcolor{${c}}{${s}}`;
/** replace a substring that must exist (so a TeX variant can never silently drift from its storyboard constant) */
export const rep = (s: string, a: string, b: string) => {
  if (!s.includes(a)) throw new Error(`TeX variant: "${a}" not found in "${s}"`);
  return s.split(a).join(b);
};
/** split at the first top-level " = " (outside braces): [lhs, "= rhs"] */
export const splitEq = (s: string): [string, string] => {
  let d = 0;
  for (let i = 0; i < s.length - 2; i++) {
    const ch = s[i];
    if (ch === "{") d++;
    else if (ch === "}") d--;
    else if (d === 0 && s.slice(i, i + 3) === " = ") return [s.slice(0, i), s.slice(i + 1)];
  }
  throw new Error(`no top-level " = " in ${s}`);
};
/** split "= a = b ≈ c" into its top-level "= …" / "\approx …" pieces */
export const eqPieces = (s: string): string[] => {
  const out: string[] = [];
  let d = 0, last = 0;
  for (let i = 1; i < s.length - 2; i++) {
    const ch = s[i];
    if (ch === "{") d++;
    else if (ch === "}") d--;
    else if (d === 0 && (s.slice(i, i + 3) === " = " || s.slice(i, i + 9) === " \\approx ")) {
      out.push(s.slice(last, i).trim());
      last = i + 1;
    }
  }
  out.push(s.slice(last).trim());
  return out;
};

/** Positioned TeX string. ax: 0 left / 0.5 centre / 1 right of x; ay likewise for y. */
export const TeX: React.FC<{ s: string; x: number; y: number; size?: number; c?: string; o?: number; ax?: number; ay?: number;
  glow?: number; halo?: boolean; haloW?: number }> = ({ s, x, y, size = 68, c = C.ink, o = 1, ax = 0, ay = 0.5, glow = 0, halo = false, haloW = 0.08 }) => {
  floor(size, s);
  if (o <= 0) return null;
  const hs = haloW * size;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(${-ax * 100}%, ${-ay * 100}%)`,
      fontSize: size / KX, color: c, opacity: o, whiteSpace: "nowrap", lineHeight: 1.2,
      textShadow: halo ? [[-1, -1], [1, -1], [-1, 1], [1, 1], [0, -1.4], [0, 1.4], [-1.4, 0], [1.4, 0]].map(([a, b]) => `${a * hs}px ${b * hs}px 0 ${C.bg}`).join(", ") : undefined,
      filter: glow > 0 ? `drop-shadow(0 0 ${12 * glow}px rgba(216,178,58,${0.95 * glow}))` : undefined }}
      dangerouslySetInnerHTML={{ __html: texHtml(s) }} />
  );
};

// ------------------------------------------------------------------------------------------------ layered equations
/** One part of a layered equation: text `t` (colour c), optional under-word `u` (an \underbrace or an \underset),
 * optional cancel slot `x` (strike colour). */
export type Part = { t: string; c?: string; u?: { w: string; c: string; kind?: "brace" | "set" }; x?: string };
/** What one layer shows: text of parts `t` ("all" or indices; `tc` overrides colours), under-words `u`, strikes `x`. */
export type Layer = { t?: "all" | number[]; tc?: Record<number, string>; u?: number[]; x?: number[]; o: number; glow?: number };
const TR = "transparent";
export const buildLayer = (parts: Part[], L: Layer): string => parts.map((p, k) => {
  const showT = L.t === "all" || (L.t ?? []).includes(k);
  let s = col(showT ? (L.tc?.[k] ?? p.c ?? C.ink) : TR, p.t);
  if (p.x !== undefined) s = col((L.x ?? []).includes(k) ? p.x : TR, `\\cancel{${s}}`);
  if (p.u) {
    const uc = (L.u ?? []).includes(k) ? p.u.c : TR;
    s = p.u.kind === "set" ? `\\underset{${col(uc, p.u.w)}}{${s}}` : col(uc, `\\underbrace{${s}}_{${p.u.w}}`);
  }
  return s;
}).join(" ");
/** the plain TeX of the parts (no colours, no unders): must equal a storyboard constant where one exists */
export const plainOf = (parts: Part[]) => parts.map((p) => p.t).join(" ");
export const base = (o = 1): Layer => ({ t: "all", o });

export const LayeredInline: React.FC<{ parts: Part[]; layers: Layer[]; size: number }> = ({ parts, layers, size }) => (
  <span style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap" }}>
    {layers.map((L, k) => (
      <span key={k} style={{ position: k === 0 ? "relative" : "absolute", left: 0, top: 0, fontSize: size / KX,
        opacity: L.o, filter: L.glow ? `drop-shadow(0 0 ${12 * L.glow}px rgba(216,178,58,${0.95 * L.glow}))` : undefined }}
        dangerouslySetInnerHTML={{ __html: texHtml(buildLayer(parts, L)) }} />
    ))}
  </span>
);
/** Positioned layered equation (the first layer sets the box; keep it the base layer, opacity may be < 1). */
export const Layered: React.FC<{ parts: Part[]; layers: Layer[]; x: number; y: number; size?: number; ax?: number; ay?: number; o?: number }> = ({
  parts, layers, x, y, size = 84, ax = 0, ay = 0.5, o = 1,
}) => {
  floor(parts.some((p) => p.u) ? size * 0.7 : size, plainOf(parts));
  if (o <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(${-ax * 100}%, ${-ay * 100}%)`, opacity: o, lineHeight: 1.2 }}>
      <LayeredInline parts={parts} layers={layers} size={size} />
    </div>
  );
};

// ------------------------------------------------------------------------------------------------ CalcStack
/** One row. lhs/rhs are TeX strings or layered parts. `cont` = continuation row of the line above. */
export type Side = string | { parts: Part[]; layers: Layer[] } | { raw: { s: string; o: number }[] };
export type CalcRow = { lhs?: Side; rhs: Side; at: number; c?: string; lc?: string; cont?: boolean; h?: number; ul?: number;
  out?: number; size?: number; keep?: boolean; glow?: number; ulOff?: number };
const SideView: React.FC<{ s: Side; size: number; c: string }> = ({ s, size, c }) =>
  typeof s === "string"
    ? <span style={{ fontSize: size / KX, color: c, whiteSpace: "nowrap" }} dangerouslySetInnerHTML={{ __html: texHtml(s) }} />
    : "raw" in s
      ? <RawLayers raw={s.raw} size={size} />
      : <LayeredInline parts={s.parts} layers={s.layers} size={size} />;
/** explicit layer strings (same structure, different colours) stacked in one box; the first sets the box */
const RawLayers: React.FC<{ raw: { s: string; o: number }[]; size: number }> = ({ raw, size }) => (
  <span style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap" }}>
    {raw.map((L, k) => (
      <span key={k} style={{ position: k === 0 ? "relative" : "absolute", left: 0, top: 0, fontSize: size / KX, opacity: L.o }}
        dangerouslySetInnerHTML={{ __html: texHtml(L.s) }} />
    ))}
  </span>
);
/**
 * Rows aligned at "=" (x = left edge of the "=" column; the LHS ends just before it), revealed at their frames.
 * ≤ maxLines logical lines visible; older lines dim to `dim`; a line beyond maxLines slides the stack up by the height
 * of the oldest line over 12 frames (and that line fades out). A row may get a gold underline from frame `ul`.
 */
export const CalcStack: React.FC<{ f: number; x: number; y: number; rows: CalcRow[]; size?: number; maxLines?: number;
  dim?: number; o?: number }> = ({ f, x, y, rows, size = 68, maxLines = 3, dim = 0.75, o = 1 }) => {
  rows.forEach((r) => floor(r.size ?? size, "CalcStack row"));
  if (o <= 0) return null;
  const lineOf: number[] = [];
  let L = -1;
  rows.forEach((r) => { if (!r.cont) L++; lineOf.push(L); });
  const nLines = L + 1;
  const hOf = (r: CalcRow) => r.h ?? (r.size ?? size) * 1.42;
  const lineAt = Array.from({ length: nLines }, (_, j) => rows[lineOf.indexOf(j)].at);
  const lineH = Array.from({ length: nLines }, (_, j) => rows.filter((_, i) => lineOf[i] === j).reduce((s, r) => s + hOf(r), 0));
  let slide = 0;
  for (let j = maxLines; j < nLines; j++) slide += ramp(f, lineAt[j], lineAt[j] + 12) * lineH[j - maxLines];
  const latest = lineAt.filter((a) => f >= a).length - 1;
  let yy = y;
  const out: React.ReactNode[] = [];
  rows.forEach((r, i) => {
    const h = hOf(r), j = lineOf[i], top = yy - slide;
    yy += h;
    const appear = ramp(f, r.at, r.at + 10);
    if (appear <= 0) return;
    const gone = j + maxLines < nLines ? ramp(f, lineAt[j + maxLines], lineAt[j + maxLines] + 12) : 0;
    const op = appear * (1 - gone) * (j < latest && !r.keep ? dim : 1) * (r.out !== undefined ? 1 - ramp(f, r.out, r.out + 10) : 1);
    if (op <= 0) return;
    const sz = r.size ?? size, gap = sz * 0.2;
    const ulA = r.ul !== undefined ? clamp((f - r.ul) / 10, 0, 1) : 0;
    out.push(
      <div key={i} style={{ position: "absolute", left: x - 1200, top, width: 2400, height: h, display: "flex", alignItems: "baseline",
        opacity: op, lineHeight: 1.2, filter: r.glow ? `drop-shadow(0 0 ${12 * r.glow}px rgba(216,178,58,${0.95 * r.glow}))` : undefined }}>
        <div style={{ width: 1200 - gap, display: "flex", justifyContent: "flex-end", alignItems: "baseline" }}>
          {r.lhs ? <SideView s={r.lhs} size={sz} c={r.lc ?? r.c ?? C.ink} /> : null}
        </div>
        <div style={{ marginLeft: gap, display: "flex", alignItems: "baseline", position: "relative" }}>
          <SideView s={r.rhs} size={sz} c={r.c ?? C.ink} />
          {ulA > 0 ? <div style={{ position: "absolute", left: 0, right: 0, bottom: -(r.ulOff ?? 10), height: 6, background: C.gold, opacity: ulA }} /> : null}
        </div>
      </div>,
    );
  });
  return <>{out}</>;
};
