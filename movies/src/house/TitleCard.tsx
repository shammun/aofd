import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HOUSE, ramp } from "./palette";

/** Opening card: title, optional subtitle and chapter tag; fades in over `fadeFrames`. */
export const TitleCard: React.FC<{ title: string; subtitle?: string; tag?: string; fadeFrames?: number }> = ({
  title, subtitle, tag, fadeFrames = 15,
}) => {
  const f = useCurrentFrame();
  const o = ramp(f, 0, fadeFrames);
  return (
    <AbsoluteFill style={{ background: HOUSE.bg, color: HOUSE.ink, fontFamily: HOUSE.font, justifyContent: "center",
      alignItems: "center", textAlign: "center", opacity: o }}>
      {tag ? <div style={{ fontSize: 32, color: HOUSE.accent, letterSpacing: 4, marginBottom: 24 }}>{tag}</div> : null}
      <div style={{ fontSize: 84, fontWeight: 700, maxWidth: 1500, lineHeight: 1.15,
        transform: `translateY(${(1 - o) * 20}px)` }}>{title}</div>
      {subtitle ? <div style={{ fontSize: 40, color: HOUSE.muted, marginTop: 28, maxWidth: 1400 }}>{subtitle}</div> : null}
    </AbsoluteFill>
  );
};
