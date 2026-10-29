import React from "react";
import { Composition } from "remotion";
import { Empty } from "./Empty";
import { POC_FPS, POC_FRAMES, PocCoriolis } from "./poc/PocCoriolis";
import { DPW_FPS, DPW_FRAMES, DotProductWhy } from "./ch00/DotProductWhy";
import { CP1_FRAMES, CP2_FRAMES, CPW_FPS, CPW_FRAMES, CrossProductPart1, CrossProductPart2, CrossProductWhy } from "./ch00/CrossProductWhy";
import { DT_FPS, DT_FRAMES, DerivativesTaylor } from "./ch00_derivatives_taylor/DerivativesTaylor";

// Every movie is one <Composition>. Ids: Empty (toolchain test), PocCoriolis (PoC D, movies/src/poc/), and per chapter
// ChNN<Slug> (movies/src/chNN/<Slug>.tsx). Durations of real movies come from timing.json via calculateMetadata,
// so the narration drives the length (R1 §5.2). Chapter and PoC compositions are registered below this line.
export const Root: React.FC = () => (
  <>
    <Composition id="Empty" component={Empty} durationInFrames={60} fps={30} width={1920} height={1080} />
    {/* ---- PoC and chapter compositions (added by motion-builders; one <Composition> each) ---- */}
    <Composition id="PocCoriolis" component={PocCoriolis} durationInFrames={POC_FRAMES} fps={POC_FPS} width={1920}
      height={1080} defaultProps={{ audio: "narration.wav" }} />
    <Composition id="Ch00DotProductWhy" component={DotProductWhy} durationInFrames={DPW_FRAMES} fps={DPW_FPS} width={1920}
      height={1080} defaultProps={{ audio: "narration_music.wav" }} />
    <Composition id="Ch00CrossProductWhy" component={CrossProductWhy} durationInFrames={CPW_FRAMES} fps={CPW_FPS} width={1920}
      height={1080} defaultProps={{ audio: "narration_music.wav" }} />
    {/* cross product v5 split (2026-10-28): Part 1 movies/ch00/ch00_cross_product, Part 2 movies/ch00/ch00_cross_product_uses */}
    <Composition id="Ch00CrossProductPart1" component={CrossProductPart1} durationInFrames={CP1_FRAMES} fps={CPW_FPS} width={1920}
      height={1080} defaultProps={{ audio: "narration_music_p1.wav" }} />
    <Composition id="Ch00CrossProductPart2" component={CrossProductPart2} durationInFrames={CP2_FRAMES} fps={CPW_FPS} width={1920}
      height={1080} defaultProps={{ audio: "narration_music_p2.wav" }} />
    {/* #4 derivatives and Taylor series (movies/ch00/ch00_derivatives_taylor; also its own entry src/ch00_derivatives_taylor/index.ts) */}
    <Composition id="Ch00DerivativesTaylor" component={DerivativesTaylor} durationInFrames={DT_FRAMES} fps={DT_FPS} width={1920}
      height={1080} defaultProps={{ audio: "narration_music.wav" }} />
  </>
);
