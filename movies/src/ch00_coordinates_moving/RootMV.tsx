import React from "react";
import { Composition, Freeze, useCurrentFrame } from "remotion";
import { CoordinatesMoving, MV_FPS, MV_FRAMES } from "./CoordinatesMoving";
import { GpuProbe } from "./kit_mv/GpuProbe";

/** Review stills in one render: frame i shows frame `frames[i]` of the movie (frozen); with `bbox` the house K6 probe publishes
 * every element's box for tools/k6_overlap.py. */
const Stills: React.FC<{ frames: number[]; bbox?: boolean }> = ({ frames, bbox = false }) => {
  const f = useCurrentFrame();
  return <Freeze frame={frames[Math.min(f, frames.length - 1)] ?? 0}><CoordinatesMoving audio="" bbox={bbox} /></Freeze>;
};

// Only this movie's compositions (see index.ts). Same id as in movies/src/Root.tsx.
export const RootMV: React.FC = () => (
  <>
    <Composition id="Ch00CoordinatesMoving" component={CoordinatesMoving} durationInFrames={MV_FRAMES} fps={MV_FPS} width={1920}
      height={1080} defaultProps={{ audio: "narration_music_mv.wav" }} />
    <Composition id="Ch00MVStills" component={Stills} durationInFrames={1} fps={MV_FPS} width={1920} height={1080}
      defaultProps={{ frames: [200] as number[], bbox: false }} calculateMetadata={({ props }) => ({ durationInFrames: Math.max(1, props.frames.length) })} />
    <Composition id="Ch00MVGpuProbe" component={GpuProbe} durationInFrames={1} fps={30} width={1920} height={1080} />
  </>
);
