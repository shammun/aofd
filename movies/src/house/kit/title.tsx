// House opening-title type (from the reference movie ch00_dot_product_why v6, scene s00; movies/HOUSE_STYLE.md §3).
import React from "react";
import { ramp } from "..";
import { C, FONT } from "./type";

/**
 * RiseText: staggered letters in one SVG text. Each letter rises 24 px and fades in over 8 frames, with a 2-frame stagger
 * from frame `at`; `dy` carries the rise. Weight 800, a background-coloured stroke (6 % of the size) behind the fill.
 * `fill` may be a gradient url (the house title gradient runs teal C.first → gold C.gold); `colors(i)` recolours letter i
 * (e.g. the subject word of the subtitle in teal).
 */
export const RiseText: React.FC<{ f: number; t: string; x: number; y: number; s: number; at: number; fill: string; colors?: (i: number) => string | undefined }> = ({
  f, t, x, y, s, at, fill, colors,
}) => {
  const ch = [...t];
  const rise = ch.map((_, i) => 24 * (1 - ramp(f, at + 2 * i, at + 2 * i + 8)));
  return (
    <text x={x} y={y} fontSize={s} fontFamily={FONT} fontWeight={800} fill={fill} stroke={C.bg} strokeWidth={0.06 * s} paintOrder="stroke">
      {ch.map((c, i) => (
        <tspan key={i} dy={rise[i] - (i ? rise[i - 1] : 0)} fillOpacity={ramp(f, at + 2 * i, at + 2 * i + 8)} strokeOpacity={ramp(f, at + 2 * i, at + 2 * i + 8)}
          fill={colors?.(i)}>{c === " " ? " " : c}</tspan>
      ))}
    </text>
  );
};

/** The house title gradient (teal → gold), to put in an <Svg>'s <defs>; use fill="url(#<id>)". */
export const TitleGradient: React.FC<{ id?: string; x1?: number; x2?: number }> = ({ id = "ttl", x1 = 100, x2 = 760 }) => (
  <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={x1} y1={0} x2={x2} y2={0}>
    <stop offset="0" stopColor={C.first} /><stop offset="1" stopColor={C.gold} />
  </linearGradient>
);
