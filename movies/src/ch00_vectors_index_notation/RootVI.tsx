import React from "react";
import { Composition, Freeze, useCurrentFrame } from "remotion";
import { VI_FPS, VI_FRAMES, VectorsIndexNotation } from "./VectorsIndexNotation";
import { GpuProbe } from "./kit_vi/GpuProbe";

/** Review stills in one render: frame i of this composition shows frame `frames[i]` of the movie (frozen), so a single
 * `remotion render --sequence` writes every scene's check frames (builder frame review, HOUSE_STYLE §10.4). */
const Stills: React.FC<{ frames: number[] }> = ({ frames }) => {
  const f = useCurrentFrame();
  return <Freeze frame={frames[Math.min(f, frames.length - 1)] ?? 0}><VectorsIndexNotation audio="" /></Freeze>;
};

// Only this movie's compositions (see index.ts). Same id as it will have in movies/src/Root.tsx.
export const RootVI: React.FC = () => (
  <>
    <Composition id="Ch00VectorsIndexNotation" component={VectorsIndexNotation} durationInFrames={VI_FRAMES} fps={VI_FPS} width={1920}
      height={1080} defaultProps={{ audio: "narration_music.wav" }} />
    <Composition id="Ch00VIStills" component={Stills} durationInFrames={1} fps={VI_FPS} width={1920} height={1080}
      defaultProps={{ frames: [200] as number[] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.max(1, props.frames.length) })} />
    <Composition id="Ch00VIGpuProbe" component={GpuProbe} durationInFrames={1} fps={30} width={1920} height={1080} />
  </>
);
