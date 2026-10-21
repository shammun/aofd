import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { tex } from "./EqLine";
import { HOUSE, ramp } from "./palette";

export type DerivLine = { latex: string; why?: string; at: number };

/**
 * A derivation shown one line at a time (R1 §4.1 point 4): each line cross-fades in at its frame, earlier lines dim,
 * and the reason for the step ("why") appears beside it. Full derivations live in the notebook; this is for intuition.
 */
export const DerivationStrip: React.FC<{ lines: DerivLine[]; size?: number; top?: number }> = ({
  lines, size = 52, top = 18,
}) => {
  const f = useCurrentFrame();
  const html = useMemo(() => lines.map((l) => tex(l.latex)), [lines]);
  const current = lines.reduce((k, l, i) => (f >= l.at ? i : k), -1);
  return (
    <div style={{ position: "absolute", left: 160, right: 160, top: `${top}%`, display: "flex", flexDirection: "column",
      gap: 28, fontFamily: HOUSE.font, color: HOUSE.ink }}>
      {lines.map((l, i) => {
        const o = ramp(f, l.at, l.at + 12);
        const dim = i < current ? 0.45 : 1;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 48, opacity: o * dim, fontSize: size }}>
            <div style={{ flex: "0 0 auto" }} dangerouslySetInnerHTML={{ __html: html[i] }} />
            {l.why ? <div style={{ fontSize: size * 0.5, color: HOUSE.muted }}>{l.why}</div> : null}
          </div>
        );
      })}
    </div>
  );
};
