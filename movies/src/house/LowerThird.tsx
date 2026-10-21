import React from "react";
import { useCurrentFrame } from "remotion";
import { HOUSE, ramp } from "./palette";

/** A label bar in the lower third (a name, a section reference or a one-line takeaway). Not a caption track. */
export const LowerThird: React.FC<{ text: string; sub?: string; from?: number; to?: number }> = ({
  text, sub, from = 0, to = 1e9,
}) => {
  const f = useCurrentFrame();
  const o = Math.min(ramp(f, from, from + 10), 1 - ramp(f, to - 10, to));
  return (
    <div style={{ position: "absolute", left: 80, bottom: 120, opacity: o, fontFamily: HOUSE.font,
      transform: `translateX(${(1 - o) * -30}px)` }}>
      <div style={{ background: HOUSE.panel, borderLeft: `8px solid ${HOUSE.accent}`, padding: "16px 28px",
        color: HOUSE.ink, fontSize: 40, fontWeight: 600 }}>{text}</div>
      {sub ? <div style={{ background: HOUSE.panel, padding: "8px 28px", color: HOUSE.muted, fontSize: 28 }}>{sub}</div> : null}
    </div>
  );
};
