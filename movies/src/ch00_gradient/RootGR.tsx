import React from "react";
import { Composition, Freeze, useCurrentFrame } from "remotion";
import { GR_FPS, GR_FRAMES, Gradient } from "./Gradient";
import { GpuProbe } from "./kit_gr/GpuProbe";

/** Review stills in one render: frame i of this composition shows frame `frames[i]` of the movie (frozen), so a single
 * `remotion render --sequence` writes every check frame (builder frame review and the K6 stills, HOUSE_STYLE §10.4). With
 * `bbox` the house K6 probe (BoxProbe) publishes every element's box for tools/k6_overlap.py / movie_qa.py's overlap gate. */
const Stills: React.FC<{ frames: number[]; bbox?: boolean }> = ({ frames, bbox = false }) => {
  const f = useCurrentFrame();
  return <Freeze frame={frames[Math.min(f, frames.length - 1)] ?? 0}><Gradient audio="" bbox={bbox} /></Freeze>;
};

// Only this movie's compositions (see index.ts). Same id as in movies/src/Root.tsx.
export const RootGR: React.FC = () => (
  <>
    <Composition id="Ch00Gradient" component={Gradient} durationInFrames={GR_FRAMES} fps={GR_FPS} width={1920}
      height={1080} defaultProps={{ audio: "narration_music.wav" }} />
    <Composition id="Ch00GRStills" component={Stills} durationInFrames={1} fps={GR_FPS} width={1920} height={1080}
      defaultProps={{ frames: [200] as number[], bbox: false }} calculateMetadata={({ props }) => ({ durationInFrames: Math.max(1, props.frames.length) })} />
    <Composition id="Ch00GRGpuProbe" component={GpuProbe} durationInFrames={1} fps={30} width={1920} height={1080} />
  </>
);
