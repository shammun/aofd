// Small illustrative SVG icons for the v5 movie (pictures, not physics). Place inside <Svg>.
import React from "react";
import { C } from "./type";

export const Droplet: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <path opacity={o} d={`M ${x} ${y - 40 * s} Q ${x - 26 * s} ${y - 4 * s} ${x - 24 * s} ${y + 10 * s} A ${24 * s} ${24 * s} 0 0 0 ${x + 24 * s} ${y + 10 * s} Q ${x + 26 * s} ${y - 4 * s} ${x} ${y - 40 * s} Z`}
    fill="#5b9bd8" stroke={C.ink} strokeWidth={3} />
);
/** clock face; `h` hours shown by the hand (0-12) */
export const ClockGlyph: React.FC<{ x: number; y: number; r?: number; h?: number; o?: number }> = ({ x, y, r = 30, h = 2, o = 1 }) => {
  const a = (h / 12) * 2 * Math.PI;
  return (
    <g opacity={o}>
      <circle cx={x} cy={y} r={r} fill="none" stroke={C.ink} strokeWidth={4} />
      <line x1={x} y1={y} x2={x} y2={y - r * 0.7} stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
      <line x1={x} y1={y} x2={x + Math.sin(a) * r * 0.5} y2={y - Math.cos(a) * r * 0.5} stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
    </g>
  );
};
export const CameraGlyph: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <g opacity={o}>
    <rect x={x - 30 * s} y={y - 18 * s} width={60 * s} height={40 * s} rx={7 * s} fill="none" stroke={C.ink} strokeWidth={4} />
    <rect x={x - 12 * s} y={y - 27 * s} width={24 * s} height={10 * s} rx={3} fill={C.ink} />
    <circle cx={x} cy={y + 2 * s} r={11 * s} fill="none" stroke={C.ink} strokeWidth={4} />
  </g>
);
/** four white camera-frame corners around a rectangle */
export const SnapCorners: React.FC<{ x0: number; y0: number; x1: number; y1: number; o?: number; L?: number }> = ({ x0, y0, x1, y1, o = 1, L = 60 }) =>
  o <= 0 ? null : (
    <g opacity={o} fill="none" stroke="#ffffff" strokeWidth={7} strokeLinecap="round">
      <polyline points={`${x0},${y0 + L} ${x0},${y0} ${x0 + L},${y0}`} />
      <polyline points={`${x1 - L},${y0} ${x1},${y0} ${x1},${y0 + L}`} />
      <polyline points={`${x1},${y1 - L} ${x1},${y1} ${x1 - L},${y1}`} />
      <polyline points={`${x0 + L},${y1} ${x0},${y1} ${x0},${y1 - L}`} />
    </g>
  );
export const Check: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <polyline opacity={o} points={`${x - 22 * s},${y} ${x - 6 * s},${y + 18 * s} ${x + 26 * s},${y - 22 * s}`} fill="none" stroke={C.gold}
    strokeWidth={9 * s} strokeLinecap="round" strokeLinejoin="round" />
);
export const Sled: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <g opacity={o}>
    <rect x={x - 100 * s} y={y - 64 * s} width={200 * s} height={44 * s} rx={9 * s} fill="#3a4766" stroke="#9aa6bd" strokeWidth={4} />
    <path d={`M ${x - 112 * s} ${y - 6 * s} L ${x + 104 * s} ${y - 6 * s} Q ${x + 128 * s} ${y - 6 * s} ${x + 122 * s} ${y - 34 * s}`} fill="none" stroke="#c9d2e3" strokeWidth={6} />
    <line x1={x - 70 * s} y1={y - 20 * s} x2={x - 70 * s} y2={y - 6 * s} stroke="#c9d2e3" strokeWidth={5} />
    <line x1={x + 70 * s} y1={y - 20 * s} x2={x + 70 * s} y2={y - 6 * s} stroke="#c9d2e3" strokeWidth={5} />
  </g>
);
export const Notebook: React.FC<{ x: number; y: number; s?: number; o?: number; c?: string }> = ({ x, y, s = 1, o = 1, c = C.first }) => (
  <g opacity={o}>
    <rect x={x - 70 * s} y={y - 90 * s} width={140 * s} height={180 * s} rx={10 * s} fill="#1d2740" stroke={c} strokeWidth={5} />
    {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={x - 40 * s} y1={y - 50 * s + i * 30 * s} x2={x + 46 * s} y2={y - 50 * s + i * 30 * s} stroke={C.muted} strokeWidth={4} />)}
    {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={x - 70 * s} cy={y - 70 * s + i * 28 * s} r={6 * s} fill={C.bg} stroke={C.ink} strokeWidth={3} />)}
  </g>
);
