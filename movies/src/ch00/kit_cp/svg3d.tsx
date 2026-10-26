// SVG overlays for the 3-D scenes (kit_cp): floor grid, lines, arcs, right-angle ticks and labels projected through the
// same camera as the WebGL view (cam.ts projector), plus small code-drawn glyphs (⊙ / ⊗, door, globe, turntable,
// observer). Text ≥ 44 px through the house Lbl (which throws below the floor).
import React from "react";
import { Lbl } from "../../house/kit/draw";
import { C } from "../../house/kit/type";
import { Projector, Pt, V3, add3, cross3, D2R, norm3, sub3, mul3 } from "./cam";

export const VIOLET = "#a58be0";

const ptsD = (ps: Pt[]) => ps.map((q, i) => `${i ? "L" : "M"}${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join("");

/** the pair-plane grid (x −1..6, y −1..4 by default) on the floor z = 0, projected */
export const FloorGrid: React.FC<{ pr: Projector; xr?: [number, number]; yr?: [number, number]; o?: number; z?: number; axes?: boolean }> = ({
  pr, xr = [-1, 6], yr = [-1, 4], o = 1, z = 0, axes = true }) => {
  if (o <= 0) return null;
  const ls: React.ReactNode[] = [];
  for (let x = xr[0]; x <= xr[1]; x++) {
    const a = pr.p([x, yr[0], z]), b = pr.p([x, yr[1], z]);
    ls.push(<line key={`x${x}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={x === 0 && axes ? "#4a5677" : C.grid} strokeWidth={x === 0 && axes ? 3 : 1.5} />);
  }
  for (let y = yr[0]; y <= yr[1]; y++) {
    const a = pr.p([xr[0], y, z]), b = pr.p([xr[1], y, z]);
    ls.push(<line key={`y${y}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={y === 0 && axes ? "#4a5677" : C.grid} strokeWidth={y === 0 && axes ? 3 : 1.5} />);
  }
  // house: the caption band y 880-1040 and a 20-px frame margin stay empty
  return <g opacity={o}><defs><clipPath id="fgsafe"><rect x={24} y={24} width={1872} height={842} /></clipPath></defs><g clipPath="url(#fgsafe)">{ls}</g></g>;
};

export const Seg3: React.FC<{ pr: Projector; a: V3; b: V3; c?: string; w?: number; o?: number; dash?: string }> = ({ pr, a, b, c = C.ink, w = 4, o = 1, dash }) => {
  if (o <= 0) return null;
  const p = pr.p(a), q = pr.p(b);
  return <line x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={c} strokeWidth={w} opacity={o} strokeDasharray={dash} strokeLinecap="round" />;
};
export const Poly3: React.FC<{ pr: Projector; pts: V3[]; c?: string; w?: number; o?: number; dash?: string; fill?: string; fo?: number }> = ({
  pr, pts, c = C.ink, w = 4, o = 1, dash, fill = "none", fo = 1 }) =>
  o <= 0 ? null : <path d={ptsD(pts.map(pr.p)) + (fill !== "none" ? "Z" : "")} fill={fill} fillOpacity={fo} stroke={c} strokeWidth={w} opacity={o}
    strokeDasharray={dash} strokeLinejoin="round" strokeLinecap="round" />;

/** arc of radius r about centre `c0` in the plane spanned by unit vectors e1 → e2 (angles a0 → a1 degrees), with an
 * optional open-chevron head at the end; draw 0..1 */
export const arcPts = (c0: V3, e1: V3, e2: V3, r: number, a0: number, a1: number, n = 48): V3[] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const t = (a0 + ((a1 - a0) * i) / n) * D2R;
    return add3(add3(c0, e1, r * Math.cos(t)), e2, r * Math.sin(t));
  });
export const Arc3: React.FC<{ pr: Projector; c0: V3; e1: V3; e2: V3; r: number; a0: number; a1: number; draw?: number; col?: string; w?: number;
  o?: number; head?: boolean; dash?: string }> = ({ pr, c0, e1, e2, r, a0, a1, draw = 1, col = C.gold, w = 5, o = 1, head = true, dash }) => {
  if (o <= 0 || draw <= 0) return null;
  const pts = arcPts(c0, e1, e2, r, a0, a0 + (a1 - a0) * Math.min(1, draw)).map(pr.p);
  const tip = pts[pts.length - 1], pre = pts[Math.max(0, pts.length - 4)];
  const ux = tip[0] - pre[0], uy = tip[1] - pre[1], L = Math.hypot(ux, uy) || 1, dx = ux / L, dy = uy / L;
  const hl = 22, rot = (a: number): Pt => [-dx * Math.cos(a) + dy * Math.sin(a), -dx * Math.sin(a) - dy * Math.cos(a)];
  const h1 = rot(0.5), h2 = rot(-0.5);
  return (
    <g opacity={o}>
      <path d={ptsD(pts)} fill="none" stroke={C.bg} strokeWidth={w + 5} strokeLinecap="round" />
      <path d={ptsD(pts)} fill="none" stroke={col} strokeWidth={w} strokeLinecap="round" strokeDasharray={dash} />
      {head && draw >= 0.98 ? <polyline points={`${tip[0] + h1[0] * hl},${tip[1] + h1[1] * hl} ${tip[0]},${tip[1]} ${tip[0] + h2[0] * hl},${tip[1] + h2[1] * hl}`}
        fill="none" stroke={col} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" /> : null}
    </g>
  );
};
/** right-angle tick at `at` between unit directions u1, u2 (size s world units) */
export const Tick3: React.FC<{ pr: Projector; at: V3; u1: V3; u2: V3; s?: number; c?: string; o?: number; w?: number }> = ({ pr, at, u1, u2, s = 0.35, c = C.gold, o = 1, w = 5 }) =>
  o <= 0 ? null : <path d={ptsD([add3(at, u1, s), add3(add3(at, u1, s), u2, s), add3(at, u2, s)].map(pr.p))} fill="none" stroke={c} strokeWidth={w} opacity={o} />;

/** a label at a projected point (+ a px offset) */
export const L3: React.FC<{ pr: Projector; at: V3; t: string; c?: string; s?: number; a?: "start" | "middle" | "end"; o?: number; dx?: number; dy?: number }> = ({
  pr, at, t, c = C.ink, s = 54, a = "middle", o = 1, dx = 0, dy = 0 }) => {
  if (o <= 0 || !pr.vis(at)) return null;
  const q = pr.p(at);
  return <Lbl x={q[0] + dx} y={q[1] + dy} t={t} c={c} s={s} a={a} o={o} />;
};
/** label beyond an arrow tip, offset outwards in screen space along the arrow's projected direction */
export const TipL3: React.FC<{ pr: Projector; from: V3; to: V3; t: string; c: string; s?: number; o?: number; gap?: number; side?: number }> = ({
  pr, from, to, t, c, s = 54, o = 1, gap = 34, side = 0 }) => {
  if (o <= 0) return null;
  const a = pr.p(from), b = pr.p(to);
  const ux = b[0] - a[0], uy = b[1] - a[1], L = Math.hypot(ux, uy);
  const dx = L > 2 ? ux / L : 0, dy = L > 2 ? uy / L : -1;
  const x = b[0] + dx * gap - dy * side, y = b[1] + dy * gap + dx * side;
  const anchor = dx > 0.35 ? "start" : dx < -0.35 ? "end" : "middle";
  return <Lbl x={x} y={y + (Math.abs(dx) <= 0.35 ? dy * s * 0.35 : 0)} t={t} c={c} s={s} a={anchor} o={o} />;
};
/** the rose "−" glyph for a negative (dashed) result, beside a projected point */
export const MinusGlyph: React.FC<{ x: number; y: number; o?: number; s?: number }> = ({ x, y, o = 1, s = 68 }) =>
  o <= 0 ? null : <Lbl x={x} y={y} t="−" c={C.neg} s={s} a="middle" o={o} />;

/** ⊙ (out of the screen, towards you) and ⊗ (into the screen, away) */
export const CircleDot: React.FC<{ x: number; y: number; r?: number; c?: string; o?: number; w?: number }> = ({ x, y, r = 48, c = VIOLET, o = 1, w = 7 }) =>
  o <= 0 ? null : (
    <g opacity={o}>
      <circle cx={x} cy={y} r={r} fill={C.bg} fillOpacity={0.6} stroke={c} strokeWidth={w} />
      <circle cx={x} cy={y} r={r * 0.22} fill={c} />
    </g>
  );
export const CircleCross: React.FC<{ x: number; y: number; r?: number; c?: string; o?: number; w?: number }> = ({ x, y, r = 48, c = VIOLET, o = 1, w = 7 }) => {
  if (o <= 0) return null;
  const k = r * 0.68;
  return (
    <g opacity={o}>
      <circle cx={x} cy={y} r={r} fill={C.bg} fillOpacity={0.6} stroke={c} strokeWidth={w} />
      <line x1={x - k} y1={y - k} x2={x + k} y2={y + k} stroke={c} strokeWidth={w} strokeLinecap="round" />
      <line x1={x - k} y1={y + k} x2={x + k} y2={y - k} stroke={c} strokeWidth={w} strokeLinecap="round" />
    </g>
  );
};
/** arrow tip flying at the viewer (a cone seen head-on growing) or tail feathers flying away (shrinking) */
export const TipSketch: React.FC<{ x: number; y: number; k: number; o?: number }> = ({ x, y, k, o = 1 }) => {
  if (o <= 0) return null;
  const r = 14 + 46 * k;
  return (
    <g opacity={o}>
      {[0, 1, 2].map((i) => { const a = (i * 2 * Math.PI) / 3 - Math.PI / 2; return <line key={i} x1={x} y1={y} x2={x + r * Math.cos(a)} y2={y + r * Math.sin(a)} stroke={VIOLET} strokeWidth={5} />; })}
      <circle cx={x} cy={y} r={r} fill="none" stroke={VIOLET} strokeWidth={5} />
      <circle cx={x} cy={y} r={7 + 6 * k} fill={VIOLET} />
    </g>
  );
};
export const TailSketch: React.FC<{ x: number; y: number; k: number; o?: number }> = ({ x, y, k, o = 1 }) => {
  if (o <= 0) return null;
  const r = 60 - 44 * k;
  return (
    <g opacity={o} stroke={VIOLET} strokeWidth={6} strokeLinecap="round">
      {[0, 1, 2, 3].map((i) => { const a = (i * Math.PI) / 2 + Math.PI / 4; return <line key={i} x1={x} y1={y} x2={x + r * Math.cos(a)} y2={y + r * Math.sin(a)} />; })}
      <circle cx={x} cy={y} r={r} fill="none" strokeWidth={4} />
    </g>
  );
};

/** a door seen at an angle (thumbnail): slab, hinge (gold dashed), knob */
export const DoorIcon: React.FC<{ x: number; y: number; s?: number; o?: number; hinge?: number }> = ({ x, y, s = 1, o = 1, hinge = 0 }) =>
  o <= 0 ? null : (
    <g opacity={o}>
      <polygon points={`${x},${y} ${x + 120 * s},${y + 40 * s} ${x + 120 * s},${y - 150 * s} ${x},${y - 200 * s}`} fill="#9aa6bd" fillOpacity={0.6} stroke={C.key} strokeWidth={3} />
      <circle cx={x + 100 * s} cy={y - 70 * s} r={6 * s} fill={C.gold} />
      <line x1={x} y1={y + 30 * s} x2={x} y2={y - 230 * s} stroke={C.gold} strokeWidth={4 + 4 * hinge} strokeDasharray="12 8" />
    </g>
  );
/** a small globe glyph with a wind arrow curving right (thumbnail; illustrative) */
export const GlobeIcon: React.FC<{ x: number; y: number; r?: number; o?: number }> = ({ x, y, r = 110, o = 1 }) =>
  o <= 0 ? null : (
    <g opacity={o}>
      <circle cx={x} cy={y} r={r} fill="#1d3a5f" stroke={C.ink} strokeWidth={3} />
      <ellipse cx={x} cy={y} rx={r} ry={r * 0.3} fill="none" stroke={C.muted} strokeWidth={2} />
      <ellipse cx={x} cy={y} rx={r * 0.38} ry={r} fill="none" stroke={C.muted} strokeWidth={2} />
      <path d={`M ${x - r * 0.55} ${y - r * 0.45} Q ${x} ${y - r * 0.62} ${x + r * 0.4} ${y - r * 0.15}`} fill="none" stroke={C.first} strokeWidth={7} strokeLinecap="round" />
      <polygon points={`${x + r * 0.52},${y - r * 0.02} ${x + r * 0.26},${y - r * 0.1} ${x + r * 0.42},${y - r * 0.32}`} fill={C.first} />
    </g>
  );
/** turntable thumbnail (the later Coriolis video; no text) */
export const TurntableIcon: React.FC<{ x: number; y: number; r?: number; o?: number; spin?: number }> = ({ x, y, r = 90, o = 1, spin = 0 }) =>
  o <= 0 ? null : (
    <g opacity={o}>
      <ellipse cx={x} cy={y + r * 0.18} rx={r} ry={r * 0.42} fill="#26314d" stroke="#c9d2e3" strokeWidth={3} />
      {[0, 1, 2, 3].map((i) => { const a = spin + (i * Math.PI) / 4; return <line key={i} x1={x - r * Math.cos(a)} y1={y + r * 0.18 - r * 0.42 * Math.sin(a)} x2={x + r * Math.cos(a)} y2={y + r * 0.18 + r * 0.42 * Math.sin(a)} stroke="#3a4766" strokeWidth={2} />; })}
      <path d={`M ${x + r * 0.7} ${y - r * 0.25} A ${r * 1.05} ${r * 0.5} 0 0 1 ${x - r * 0.2} ${y - r * 0.32}`} fill="none" stroke={C.gold} strokeWidth={4} />
    </g>
  );
/** a small standing person (observer turning with Earth) */
export const Observer: React.FC<{ x: number; y: number; s?: number; o?: number; c?: string }> = ({ x, y, s = 1, o = 1, c = C.key }) =>
  o <= 0 ? null : (
    <g opacity={o} stroke={c} strokeWidth={5 * s} strokeLinecap="round" fill="none">
      <circle cx={x} cy={y - 52 * s} r={10 * s} fill={c} />
      <line x1={x} y1={y - 40 * s} x2={x} y2={y - 14 * s} />
      <line x1={x} y1={y - 14 * s} x2={x - 10 * s} y2={y} /><line x1={x} y1={y - 14 * s} x2={x + 10 * s} y2={y} />
      <line x1={x - 14 * s} y1={y - 32 * s} x2={x + 14 * s} y2={y - 32 * s} />
    </g>
  );

/** world basis helpers */
export const perpIn = (n: V3, v: V3): V3 => norm3(cross3(n, cross3(v, n)));
export const mid3 = (a: V3, b: V3): V3 => mul3(add3(a, b), 0.5);
export const dir3 = (a: V3, b: V3): V3 => norm3(sub3(b, a));
