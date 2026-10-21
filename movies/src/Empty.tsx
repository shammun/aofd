import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { EqLine, Globe, HOUSE, ScaleBadge, TitleCard } from "./house";

/**
 * Toolchain smoke test (PLANNING §12 step 9): 2 s, silent. Frames 0–29 a title card; frames 30–59 a spinning globe
 * (WebGL through ANGLE) with a KaTeX line and the not-to-scale badge. Not a teaching movie.
 */
export const Empty: React.FC = () => (
  <AbsoluteFill style={{ background: HOUSE.bg }}>
    <Sequence durationInFrames={30}>
      <TitleCard title="AOFD movie toolchain" subtitle="Remotion · three.js · KaTeX" tag="SELF-TEST" fadeFrames={8} />
    </Sequence>
    <Sequence from={30} durationInFrames={30}>
      <Globe degPerSecond={90} arrows={[{ lon: 0, lat: 45, dir: [0, 1], color: HOUSE.glyphA }]} />
      <EqLine latex={String.raw`f = 2\Omega\sin\varphi`} y={88} size={56} />
      <ScaleBadge detail="globe spins 90°/s" />
    </Sequence>
  </AbsoluteFill>
);
