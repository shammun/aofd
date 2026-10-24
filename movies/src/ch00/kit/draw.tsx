// SVG drawing primitives for the v5 movies (px at 1080p). Pure functions of their props: deterministic.
import React from "react";
import { C, FONT, floor } from "./type";

export type Pt = [number, number];
export const mkP = (ox: number, oy: number, u: number) => (x: number, y: number): Pt => [ox + x * u, oy - y * u];
export const lerp = (p: Pt, q: Pt, t: number): Pt => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
export const unit = (p: Pt, q: Pt): Pt => {
  const L = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1;
  return [(q[0] - p[0]) / L, (q[1] - p[1]) / L];
};
export const add = (p: Pt, v: Pt, s = 1): Pt => [p[0] + v[0] * s, p[1] + v[1] * s];
/** one smooth 0→1→0 pulse over n frames starting at a */
export const pulse = (f: number, a: number, n = 20) => (f < a || f > a + n ? 0 : Math.sin((Math.PI * (f - a)) / n));

export const Svg: React.FC<{ children: React.ReactNode; o?: number }> = ({ children, o = 1 }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: o }}>{children}</svg>
);

/** A vector arrow: 10-px shaft, 40-px head by default (v5 strokes). */
export const Arrow: React.FC<{ p: Pt; q: Pt; color: string; w?: number; head?: number; o?: number; halo?: boolean; dash?: string }> = ({
  p, q, color, w = 10, head = 40, o = 1, halo = true, dash,
}) => {
  const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy);
  if (L < 1 || o <= 0) return null;
  const ux = dx / L, uy = dy / L, h = Math.min(head, L * 0.6), nx = -uy, ny = ux;
  const bx = q[0] - ux * h, by = q[1] - uy * h;
  const hw = h * 0.42;
  const tri = `${q[0]},${q[1]} ${bx + nx * hw},${by + ny * hw} ${bx - nx * hw},${by - ny * hw}`;
  const end: Pt = [q[0] - ux * h * 0.7, q[1] - uy * h * 0.7];
  return (
    <g opacity={o}>
      {halo ? (
        <g stroke={C.bg} strokeLinejoin="round" fill={C.bg} strokeWidth={6}>
          <line x1={p[0]} y1={p[1]} x2={end[0]} y2={end[1]} strokeWidth={w + 6} strokeLinecap="round" />
          <polygon points={tri} />
        </g>
      ) : null}
      <line x1={p[0]} y1={p[1]} x2={end[0]} y2={end[1]} stroke={color} strokeWidth={w} strokeLinecap="round" strokeDasharray={dash} />
      <polygon points={tri} fill={color} />
    </g>
  );
};

/** SVG text label with a background halo; size ≥ 44 px (throws otherwise). */
export const Lbl: React.FC<{ x: number; y: number; t: string; c?: string; s?: number; a?: "start" | "middle" | "end"; o?: number;
  b?: boolean; rot?: number; italic?: boolean }> = ({ x, y, t, c = C.ink, s = 54, a = "start", o = 1, b = true, rot, italic }) => {
  floor(s, t);
  if (o <= 0) return null;
  return (
    <text x={x} y={y} fill={c} fontSize={s} fontFamily={FONT} fontWeight={b ? 650 : 500} textAnchor={a} fontStyle={italic ? "italic" : undefined}
      dominantBaseline="central" stroke={C.bg} strokeWidth={0.18 * s} strokeLinejoin="round" paintOrder="stroke" opacity={o}
      transform={rot ? `rotate(${rot} ${x} ${y})` : undefined}>
      {t}
    </text>
  );
};
/** rough text width (Segoe UI semibold) for layout decisions */
export const textW = (t: string, s: number) => [...t].reduce((w, ch) => w + s * (/[ .,:;()|'·]/.test(ch) ? 0.3 : /[mwMW]/.test(ch) ? 0.85 : /[A-Z0-9°]/.test(ch) ? 0.6 : 0.53), 0);

export const Grid: React.FC<{ P: (x: number, y: number) => Pt; xr: [number, number]; yr: [number, number]; o?: number }> = ({ P, xr, yr, o = 1 }) => {
  const ls = [];
  for (let x = xr[0]; x <= xr[1]; x++) {
    const [a, b] = [P(x, yr[0]), P(x, yr[1])];
    ls.push(<line key={`x${x}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={x === 0 ? "#4a5677" : C.grid} strokeWidth={x === 0 ? 3 : 1.5} />);
  }
  for (let y = yr[0]; y <= yr[1]; y++) {
    const [a, b] = [P(xr[0], y), P(xr[1], y)];
    ls.push(<line key={`y${y}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={y === 0 ? "#4a5677" : C.grid} strokeWidth={y === 0 ? 3 : 1.5} />);
  }
  return <g opacity={o}>{ls}</g>;
};

/** The shadow: a 20-px band in the caster's colour at 70 %. */
export const Band: React.FC<{ p: Pt; q: Pt; color: string; o?: number; w?: number }> = ({ p, q, color, o = 1, w = 20 }) =>
  Math.hypot(q[0] - p[0], q[1] - p[1]) < 0.5 || o <= 0 ? null :
    <line x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={color} strokeWidth={w} strokeOpacity={0.7 * o} strokeLinecap="butt" />;

export const Dash: React.FC<{ p: Pt; q: Pt; c?: string; o?: number; w?: number; d?: string }> = ({ p, q, c = C.ink, o = 1, w = 4, d = "12 10" }) =>
  o <= 0 ? null : <line x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={c} strokeWidth={w} strokeDasharray={d} opacity={o} strokeLinecap="round" />;

export const RightTick: React.FC<{ at: Pt; u1: Pt; u2: Pt; s?: number; o?: number; c?: string }> = ({ at, u1, u2, s = 24, o = 1, c = C.ink }) =>
  o <= 0 ? null : (
    <polyline points={`${at[0] + u1[0] * s},${at[1] + u1[1] * s} ${at[0] + (u1[0] + u2[0]) * s},${at[1] + (u1[1] + u2[1]) * s} ${at[0] + u2[0] * s},${at[1] + u2[1] * s}`}
      fill="none" stroke={c} strokeWidth={4} opacity={o} />
  );

/** A length bracket parallel to p→q, `off` px along the left normal (−uy, ux) of p→q. Returns nothing when o = 0. */
export const Bracket: React.FC<{ p: Pt; q: Pt; off?: number; c: string; o?: number; w?: number }> = ({ p, q, off = 0, c, o = 1, w = 5 }) => {
  if (o <= 0) return null;
  const [ux, uy] = unit(p, q), nx = -uy, ny = ux;
  const P1: Pt = [p[0] + nx * off, p[1] + ny * off], Q1: Pt = [q[0] + nx * off, q[1] + ny * off];
  const t = 14 * (off >= 0 ? -1 : 1);
  return (
    <polyline points={`${P1[0] + nx * t},${P1[1] + ny * t} ${P1[0]},${P1[1]} ${Q1[0]},${Q1[1]} ${Q1[0] + nx * t},${Q1[1] + ny * t}`}
      fill="none" stroke={c} strokeWidth={w} opacity={o} strokeLinejoin="round" />
  );
};
export const bracketMid = (p: Pt, q: Pt, off: number): Pt => {
  const [ux, uy] = unit(p, q);
  return [(p[0] + q[0]) / 2 - uy * off, (p[1] + q[1]) / 2 + ux * off];
};

/** The product rectangle (a scalar drawn as an area): ink 18 % + solid outline when ≥ 0; rose hatch + dashed when < 0. */
export const ProdRect: React.FC<{ pts: Pt[]; neg: boolean; o?: number; id: string }> = ({ pts, neg, o = 1, id }) =>
  o <= 0 ? null : (
    <g opacity={o}>
      <defs>
        <pattern id={id} width={16} height={16} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width={16} height={16} fill={C.neg} fillOpacity={0.16} />
          <line x1={0} y1={0} x2={0} y2={16} stroke={C.neg} strokeWidth={5} />
        </pattern>
      </defs>
      <polygon points={pts.map((p) => p.join(",")).join(" ")} fill={neg ? `url(#${id})` : "rgba(232,236,244,0.18)"}
        stroke={neg ? C.neg : C.ink} strokeWidth={4} strokeDasharray={neg ? "14 9" : undefined} strokeLinejoin="round" />
    </g>
  );

/** Arc between world angles a0 → a1 (degrees, anticlockwise) of radius r (world units) in plane P. */
export const Arc: React.FC<{ P: (x: number, y: number) => Pt; a0: number; a1: number; r: number; c?: string; o?: number; w?: number; draw?: number }> = ({
  P, a0, a1, r, c = C.ink, o = 1, w = 4, draw = 1,
}) => {
  if (o <= 0 || draw <= 0) return null;
  const n = 40, pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const t = ((a0 + ((a1 - a0) * draw * i) / n) * Math.PI) / 180;
    pts.push(P(r * Math.cos(t), r * Math.sin(t)).join(","));
  }
  return <polyline points={pts.join(" ")} fill="none" stroke={c} strokeWidth={w} opacity={o} />;
};

/** A rose strike line through a region (draws over 10 frames from `at`). */
export const Strike: React.FC<{ p: Pt; q: Pt; f: number; at: number; c?: string; w?: number }> = ({ p, q, f, at, c = C.neg, w = 7 }) => {
  const d = clamp((f - at) / 10, 0, 1);
  if (d <= 0) return null;
  const e = lerp(p, q, d);
  return <line x1={p[0]} y1={p[1]} x2={e[0]} y2={e[1]} stroke={c} strokeWidth={w} strokeLinecap="round" />;
};
