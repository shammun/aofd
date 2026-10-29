import React from "react";
import { Composition, Freeze, useCurrentFrame } from "remotion";
import { DT_FPS, DT_FRAMES, DerivativesTaylor } from "./DerivativesTaylor";
import { GpuProbe } from "./kit_dt/GpuProbe";

/** Review stills in one render: frame i of this composition shows frame `frames[i]` of the movie (frozen), so a single
 * `remotion render --sequence` writes every scene's check frames (builder frame review, HOUSE_STYLE §10.4). */
const Stills: React.FC<{ frames: number[] }> = ({ frames }) => {
  const f = useCurrentFrame();
  return <Freeze frame={frames[Math.min(f, frames.length - 1)] ?? 0}><DerivativesTaylor audio="" /></Freeze>;
};

// Only this movie's compositions (see index.ts). Same id as in movies/src/Root.tsx.
export const RootDT: React.FC = () => (
  <>
    <Composition id="Ch00DerivativesTaylor" component={DerivativesTaylor} durationInFrames={DT_FRAMES} fps={DT_FPS} width={1920}
      height={1080} defaultProps={{ audio: "narration_music.wav" }} />
    <Composition id="Ch00DTStills" component={Stills} durationInFrames={1} fps={DT_FPS} width={1920} height={1080}
      defaultProps={{ frames: [200] as number[] }} calculateMetadata={() => ({ durationInFrames: DT_FRAMES })} />
    <Composition id="Ch00DTGpuProbe" component={GpuProbe} durationInFrames={1} fps={30} width={1920} height={1080} />
  </>
);
