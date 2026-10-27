import React from "react";
import { Composition } from "remotion";
import { WB_FPS, WB_FRAMES, WeatherBasics } from "./WeatherBasics";
import { GpuProbe } from "./kit_wb/GpuProbe";

// Only this movie's composition (see index.ts). Same id as it will have in movies/src/Root.tsx.
export const RootWB: React.FC = () => (
  <>
    <Composition id="Ch00WeatherBasics" component={WeatherBasics} durationInFrames={WB_FRAMES} fps={WB_FPS} width={1920}
      height={1080} defaultProps={{ audio: "narration_music.wav" }} />
    <Composition id="Ch00WBGpuProbe" component={GpuProbe} durationInFrames={1} fps={30} width={1920} height={1080} />
  </>
);
