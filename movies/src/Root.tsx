import React from "react";
import { Composition } from "remotion";
import { Empty } from "./Empty";
import { POC_FPS, POC_FRAMES, PocCoriolis } from "./poc/PocCoriolis";

// Every movie is one <Composition>. Ids: Empty (toolchain test), PocCoriolis (PoC D, movies/src/poc/), and per chapter
// ChNN<Slug> (movies/src/chNN/<Slug>.tsx). Durations of real movies come from timing.json via calculateMetadata,
// so the narration drives the length (R1 §5.2). Chapter and PoC compositions are registered below this line.
export const Root: React.FC = () => (
  <>
    <Composition id="Empty" component={Empty} durationInFrames={60} fps={30} width={1920} height={1080} />
    {/* ---- PoC and chapter compositions (added by motion-builders; one <Composition> each) ---- */}
    <Composition id="PocCoriolis" component={PocCoriolis} durationInFrames={POC_FRAMES} fps={POC_FPS} width={1920}
      height={1080} defaultProps={{ audio: "narration.wav" }} />
  </>
);
