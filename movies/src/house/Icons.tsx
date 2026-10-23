import React from "react";
import { HOUSE, TERM } from "./palette";

/**
 * Small illustrative icons for movies (SVG <g> fragments: place them inside an <svg>). They are pictures, not physics:
 * a scene that uses them lists "icons illustrative" in its ScaleBadge / storyboard exaggeration list.
 *
 * - BalloonThermometer: a balloon with a thermometer hanging under it — a sensor that rides WITH the air
 *   (material derivative D/Dt). Anchor (x, y) = the bottom of the thermometer (the point that moves with the air).
 * - PoleThermometer: a thermometer on a fixed pole — a sensor at ONE FIXED place (local derivative ∂/∂t).
 *   Anchor (x, y) = the foot of the pole (the fixed place).
 * - GhostArrow: a faint, crossed-out arrow — "this is NOT an arrow" (a scalar such as a·b).
 */
const Thermo: React.FC<{ x: number; y: number; h: number; fill?: string; level?: number }> = ({ x, y, h, fill = "#d9667f", level = 0.55 }) => {
  // vertical thermometer, bulb centre at (x, y), tube upwards of height h
  const r = h * 0.16, w = h * 0.13;
  return (
    <g>
      <rect x={x - w / 2} y={y - h} width={w} height={h} rx={w / 2} fill={HOUSE.ink} stroke={HOUSE.bg} strokeWidth={2} />
      <rect x={x - w * 0.22} y={y - h * level} width={w * 0.44} height={h * level} fill={fill} />
      <circle cx={x} cy={y} r={r} fill={fill} stroke={HOUSE.ink} strokeWidth={3} />
    </g>
  );
};

export const BalloonThermometer: React.FC<{ x: number; y: number; s?: number; color?: string; o?: number }> = ({
  x, y, s = 1, color = "#c9d2e3", o = 1,
}) => {
  const R = 26 * s, top = y - 150 * s;
  return (
    <g opacity={o}>
      <ellipse cx={x} cy={top} rx={R} ry={R * 1.18} fill={color} stroke={HOUSE.bg} strokeWidth={3} />
      <ellipse cx={x - R * 0.35} cy={top - R * 0.45} rx={R * 0.22} ry={R * 0.32} fill="#ffffff" opacity={0.55} />
      <polygon points={`${x - 6 * s},${top + R * 1.16} ${x + 6 * s},${top + R * 1.16} ${x},${top + R * 1.4}`} fill={color} />
      <path d={`M ${x} ${top + R * 1.35} Q ${x + 10 * s} ${top + R * 1.35 + 22 * s} ${x} ${y - 62 * s}`} fill="none"
        stroke={HOUSE.ink} strokeWidth={2.5} />
      <Thermo x={x} y={y - 8 * s} h={54 * s} />
    </g>
  );
};

export const PoleThermometer: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <g opacity={o}>
    <line x1={x} y1={y} x2={x} y2={y - 70 * s} stroke="#c9d2e3" strokeWidth={6 * s} strokeLinecap="round" />
    <line x1={x - 16 * s} y1={y} x2={x + 16 * s} y2={y} stroke="#c9d2e3" strokeWidth={5 * s} strokeLinecap="round" />
    <Thermo x={x} y={y - 78 * s} h={58 * s} fill={TERM.friction} />
  </g>
);

export const GhostArrow: React.FC<{ x: number; y: number; len?: number; o?: number }> = ({ x, y, len = 120, o = 1 }) => (
  <g opacity={o}>
    <line x1={x} y1={y} x2={x + len - 22} y2={y} stroke={HOUSE.muted} strokeWidth={6} strokeDasharray="10 8"
      strokeLinecap="round" opacity={0.6} />
    <polygon points={`${x + len},${y} ${x + len - 26},${y - 13} ${x + len - 26},${y + 13}`} fill={HOUSE.muted} opacity={0.6} />
    <line x1={x + len * 0.2} y1={y - 30} x2={x + len * 0.8} y2={y + 30} stroke={TERM.friction} strokeWidth={6} strokeLinecap="round" />
    <line x1={x + len * 0.2} y1={y + 30} x2={x + len * 0.8} y2={y - 30} stroke={TERM.friction} strokeWidth={6} strokeLinecap="round" />
  </g>
);
