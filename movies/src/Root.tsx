import React from "react";
import { Composition } from "remotion";
import { Empty } from "./Empty";
import { POC_FPS, POC_FRAMES, PocCoriolis } from "./poc/PocCoriolis";
import { DPW_FPS, DPW_FRAMES, DotProductWhy } from "./ch00/DotProductWhy";
import { CP1_FRAMES, CP2_FRAMES, CPW_FPS, CPW_FRAMES, CrossProductPart1, CrossProductPart2, CrossProductWhy } from "./ch00/CrossProductWhy";
import { DT_FPS, DT_FRAMES, DerivativesTaylor } from "./ch00_derivatives_taylor/DerivativesTaylor";
import { CO_FPS, CO_FRAMES, Coordinates } from "./ch00_coordinates/Coordinates";
import { GR_FPS, GR_FRAMES, Gradient } from "./ch00_gradient/Gradient";
import { CF_FPS, CF_FRAMES, CoordinatesFlat } from "./ch00_coordinates_flat/CoordinatesFlat";
import { FR_FPS, FR_FRAMES, CoordinatesFrames } from "./ch00_coordinates_frames/CoordinatesFrames";
import { CST_FPS, CST_FRAMES, CoordinatesStorm } from "./ch00_coordinates_storm/CoordinatesStorm";
import { MV_FPS, MV_FRAMES, CoordinatesMoving } from "./ch00_coordinates_moving/CoordinatesMoving";
import { RT_FPS, RT_FRAMES, CoordinatesRoutes } from "./ch00_coordinates_routes/CoordinatesRoutes";
import { CS_FPS, CS_FRAMES, CoordinatesSphere } from "./ch00_coordinates_sphere/CoordinatesSphere";
import { MP_FPS, MP_FRAMES, CoordinatesMaps } from "./ch00_coordinates_maps/CoordinatesMaps";

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
    {/* #5 coordinates (movies/ch00/ch00_coordinates; also its own entry src/ch00_coordinates/index.ts) */}
    <Composition id="Ch00Coordinates" component={Coordinates} durationInFrames={CO_FRAMES} fps={CO_FPS} width={1920}
      height={1080} defaultProps={{ audio: "narration_music.wav" }} />
    {/* #6 the gradient (movies/ch00/ch00_gradient; also its own entry src/ch00_gradient/index.ts) */}
    <Composition id="Ch00Gradient" component={Gradient} durationInFrames={GR_FRAMES} fps={GR_FPS} width={1920}
      height={1080} defaultProps={{ audio: "narration_music.wav" }} />
    {/* #5a coordinates Part 1 (movies/ch00/ch00_coordinates_flat; also its own entry src/ch00_coordinates_flat/index.ts) */}
    <Composition id="Ch00CoordinatesFlat" component={CoordinatesFlat} durationInFrames={CF_FRAMES} fps={CF_FPS} width={1920}
      height={1080} defaultProps={{ audio: "narration_music_cf.wav" }} />
    {/* #5d coordinates Part 4 (movies/ch00/ch00_coordinates_frames; also its own entry src/ch00_coordinates_frames/index.ts) */}
    <Composition id="Ch00CoordinatesFrames" component={CoordinatesFrames} durationInFrames={FR_FRAMES} fps={FR_FPS} width={1920}
      height={1080} defaultProps={{ audio: "narration_music_fr.wav" }} />
    {/* #5b coordinates Part 2 (movies/ch00/ch00_coordinates_storm; also its own entry src/ch00_coordinates_storm/index.ts) */}
    <Composition id="Ch00CoordinatesStorm" component={CoordinatesStorm} durationInFrames={CST_FRAMES} fps={CST_FPS} width={1920}
      height={1080} defaultProps={{ audio: "narration_music_cst.wav" }} />
    {/* #5e coordinates Part 5 (movies/ch00/ch00_coordinates_moving; also its own entry src/ch00_coordinates_moving/index.ts) */}
    <Composition id="Ch00CoordinatesMoving" component={CoordinatesMoving} durationInFrames={MV_FRAMES} fps={MV_FPS} width={1920}
      height={1080} defaultProps={{ audio: "narration_music_mv.wav" }} />
    {/* #5f coordinates Part 6 (movies/ch00/ch00_coordinates_routes; also its own entry src/ch00_coordinates_routes/index.ts) */}
    <Composition id="Ch00CoordinatesRoutes" component={CoordinatesRoutes} durationInFrames={RT_FRAMES} fps={RT_FPS} width={1920}
      height={1080} defaultProps={{ audio: "narration_music_rt.wav" }} />
    {/* #5c coordinates Part 3 (movies/ch00/ch00_coordinates_sphere; also its own entry src/ch00_coordinates_sphere/index.ts) */}
    <Composition id="Ch00CoordinatesSphere" component={CoordinatesSphere} durationInFrames={CS_FRAMES} fps={CS_FPS} width={1920}
      height={1080} defaultProps={{ audio: "narration_music_cs.wav" }} />
    {/* #5g coordinates Part 7 (movies/ch00/ch00_coordinates_maps; also its own entry src/ch00_coordinates_maps/index.ts) */}
    <Composition id="Ch00CoordinatesMaps" component={CoordinatesMaps} durationInFrames={MP_FRAMES} fps={MP_FPS} width={1920}
      height={1080} defaultProps={{ audio: "narration_music_mp.wav" }} />
  </>
);
