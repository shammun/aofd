import React from "react";
import { Composition, Freeze, useCurrentFrame } from "remotion";
import { CoordinatesRoutes, RT_FPS, RT_FRAMES } from "./CoordinatesRoutes";
import { GpuProbe } from "./kit_rt/GpuProbe";

/** Review stills in one render: frame i shows frame `frames[i]` of the movie (frozen); with `bbox` the house K6 probe publishes
 * every element's box for tools/k6_overlap.py. */
const Stills: React.FC<{ frames: number[]; bbox?: boolean }> = ({ frames, bbox = false }) => {
  const f = useCurrentFrame();
  return <Freeze frame={frames[Math.min(f, frames.length - 1)] ?? 0}><CoordinatesRoutes audio="" bbox={bbox} /></Freeze>;
};

// Only this movie's compositions (see index.ts). Same id as in movies/src/Root.tsx.
export const RootRT: React.FC = () => (
  <>
    <Composition id="Ch00CoordinatesRoutes" component={CoordinatesRoutes} durationInFrames={RT_FRAMES} fps={RT_FPS} width={1920}
      height={1080} defaultProps={{ audio: "narration_music_rt.wav" }} />
    <Composition id="Ch00RTStills" component={Stills} durationInFrames={1} fps={RT_FPS} width={1920} height={1080}
      defaultProps={{ frames: [200] as number[], bbox: false }} calculateMetadata={({ props }) => ({ durationInFrames: Math.max(1, props.frames.length) })} />
    <Composition id="Ch00RTGpuProbe" component={GpuProbe} durationInFrames={1} fps={30} width={1920} height={1080} />
  </>
);
