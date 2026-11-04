import React from "react";
import { Composition, Freeze, useCurrentFrame } from "remotion";
import { CO_FPS, CO_FRAMES, Coordinates } from "./Coordinates";
import { GpuProbe } from "./kit_co/GpuProbe";

/** Review stills in one render: frame i of this composition shows frame `frames[i]` of the movie (frozen), so a single
 * `remotion render --sequence` writes every check frame (builder frame review and the K6 stills, HOUSE_STYLE §10.4). With
 * `bbox` the house K6 probe (BoxProbe) publishes every element's box for tools/movie_qa.py's overlap gate. */
const Stills: React.FC<{ frames: number[]; bbox?: boolean }> = ({ frames, bbox = false }) => {
  const f = useCurrentFrame();
  return <Freeze frame={frames[Math.min(f, frames.length - 1)] ?? 0}><Coordinates audio="" bbox={bbox} /></Freeze>;
};

// Only this movie's compositions (see index.ts). Same id as in movies/src/Root.tsx.
export const RootCO: React.FC = () => (
  <>
    <Composition id="Ch00Coordinates" component={Coordinates} durationInFrames={CO_FRAMES} fps={CO_FPS} width={1920}
      height={1080} defaultProps={{ audio: "narration_music.wav" }} />
    <Composition id="Ch00COStills" component={Stills} durationInFrames={1} fps={CO_FPS} width={1920} height={1080}
      defaultProps={{ frames: [200] as number[], bbox: false }} calculateMetadata={({ props }) => ({ durationInFrames: Math.max(1, props.frames.length) })} />
    <Composition id="Ch00COGpuProbe" component={GpuProbe} durationInFrames={1} fps={30} width={1920} height={1080} />
  </>
);
