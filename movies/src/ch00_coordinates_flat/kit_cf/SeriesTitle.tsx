// The series title layout for the Coordinates parts (user feedback 2026-11-06, master plan R1/R2; continuity_plan §5): one layout for
// all seven parts, built on the house RiseText / TitleGradient (HOUSE_STYLE §3), left column x 100–1075. Candidate for promotion to
// movies/src/house/kit/title.tsx (the orchestrator / knowledge-keeper decide; this movie never edits the house kit).
//   line 1  the concept name, 150 px, weight 800, house gradient (teal → gold), pulsing ×1.06 when the voice says it;
//   line 2  "Part N · <part name>", warm white, 80 px or smaller so it fits the 975-px column (size from the house textW);
//   line 3+ the subtitle, 68 px, warm white.
// No "made easy" / "easy" anywhere (user 2026-11-06). Place inside an <Svg>.
import React from "react";
import { C } from "../../house/kit/type";
import { pulse, textW } from "../../house/kit/draw";
import { RiseText, TitleGradient } from "../../house/kit/title";

export const COL_W = 975;
/** the line-2 size: 80 px, or the largest whole size whose house-textW width fits the column */
export const partSize = (t: string, max = 80) => Math.min(max, Math.floor(COL_W / textW(t, 1)));

export const SeriesTitle: React.FC<{ f: number; concept: string; part: string; sub: string[]; pulseAt: number; x?: number; id?: string }> = ({
  f, concept, part, sub, pulseAt, x = 100, id = "ttl" }) => {
  const s2 = partSize(part);
  if (textW(concept, 150) > COL_W) throw new Error(`series title: "${concept}" is wider than the column`);
  sub.forEach((t) => { if (textW(t, 68) > COL_W) throw new Error(`series title: subtitle "${t}" is wider than the column`); });
  const pz = 1 + 0.06 * pulse(f, pulseAt, 14);
  const y1 = 250, y2 = 390, y3 = 540;
  return (
    <>
      <defs><TitleGradient id={id} x1={x} x2={x + 900} /></defs>
      <g transform={`translate(${x} ${y1 - 52}) scale(${pz}) translate(${-x} ${-(y1 - 52)})`}>
        <RiseText f={f} t={concept} x={x} y={y1} s={150} at={4} fill={`url(#${id})`} />
      </g>
      <RiseText f={f} t={part} x={x + 4} y={y2} s={s2} at={18} fill={C.key} />
      {sub.map((t, i) => <RiseText key={t} f={f} t={t} x={x + 6} y={y3 + i * 90} s={68} at={30 + 6 * i} fill={C.key} />)}
    </>
  );
};
