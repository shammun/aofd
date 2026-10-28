import React from "react";
import { Composition } from "remotion";
import { DPV_FPS, DPV_FRAMES, DotProductV01b } from "./DotProductV01b";

// Only this movie's composition (see index.ts). Same id as it will have in movies/src/Root.tsx.
export const RootDPV: React.FC = () => (
  <Composition id="Ch00DotProductV01b" component={DotProductV01b} durationInFrames={DPV_FRAMES} fps={DPV_FPS} width={1920}
    height={1080} defaultProps={{ audio: "narration_music.wav" }} />
);
