import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HOUSE, ramp } from "./palette";

/** Closing card: where to go next (notebook section and explainer), a quiz hook, and the credit line. */
export const EndCard: React.FC<{
  notebook: string; explainer?: string; quiz?: string; credit?: string;
}> = ({ notebook, explainer, quiz, credit = "Made with tested fluidpy physics · shammun.github.io/aofd" }) => {
  const f = useCurrentFrame();
  const o = ramp(f, 0, 15);
  return (
    <AbsoluteFill style={{ background: HOUSE.bg, color: HOUSE.ink, fontFamily: HOUSE.font, padding: 140, opacity: o,
      justifyContent: "center", gap: 36 }}>
      {quiz ? <div style={{ fontSize: 56, fontWeight: 700, color: HOUSE.accent }}>Think: {quiz}</div> : null}
      <div style={{ fontSize: 40 }}>📓 Notebook: <span style={{ color: HOUSE.muted }}>{notebook}</span></div>
      {explainer ? <div style={{ fontSize: 40 }}>🎮 Explainer: <span style={{ color: HOUSE.muted }}>{explainer}</span></div> : null}
      <div style={{ fontSize: 26, color: HOUSE.muted, marginTop: 40 }}>{credit}</div>
    </AbsoluteFill>
  );
};
