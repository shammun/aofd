import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { C } from "../house/kit/type";
import { BoxProbe } from "../house/kit/bbox";
import { CO_FRAMES, CUT, FPS, LEN, XF, sc } from "./co_lib";
import { SCENES_A } from "./co_sA";
import { SCENES_B } from "./co_sB";
import { SCENES_C } from "./co_sC";

/**
 * Chapter-0 movie #5 "Coordinates: on a plane, a cylinder and a sphere (and how the winds round a hurricane, great-circle routes
 * and moving storms use them)" (movies/ch00/ch00_coordinates/storyboard.yaml v3, 49 scenes), 1920×1080, 30 fps; length =
 * timing.json + 2.5-s hold. House style movies/HOUSE_STYLE.md (reference ch00_dot_product_why v6) incl. §5b: one title (s00),
 * keywords not sentences, no boxes, no references, source lines below the pictures (K2), colour bars beside them, globes in the
 * house frame (K1; s24 zoom-reveal), the layer stack hovered from outside with one short close look (K5), wind arrows animated
 * (K7), caption band empty, text ≥ 44 px, reveals on their words (AT). Real moments: Hurricane Ian (HRRR 18/20 UTC, ERA5 levels,
 * GOES-16, CO-OPS gauges), Brest / Svalbard / Singapore on the globe, London → Los Angeles, the 10 hPa polar vortex of
 * 21 Jan 2026 (NCEP/NCAR R1), Storm Ciarán (ERA5, tracked by continuity). Every number and every moving or coloured thing comes
 * from data/co.json (movies/data/build_ch00_coordinates.py, tested fluidpy functions, 116 CHECK rows); the scene files only index,
 * place and interpolate. Equations: co_eq.ts (verbatim storyboard constants).
 */
export const CO_FPS = FPS;
export { CO_FRAMES };

/** scene id → component (the static checks checks/swap_check.mjs and checks/cam_speed.mjs read this table) */
const BYID: Record<string, React.FC> = { ...SCENES_A, ...SCENES_B, ...SCENES_C };
const missing = sc.map((s) => s.id).filter((id) => !BYID[id]);
if (missing.length) throw new Error(`no component for scene(s) ${missing.join(", ")}`);
if (Object.keys(BYID).length !== sc.length) throw new Error(`${Object.keys(BYID).length} scene components but ${sc.length} scenes in timing.json`);

export const Coordinates: React.FC<{ audio?: string; bbox?: boolean }> = ({ audio = "narration_music.wav", bbox = false }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    {/* house K6 probe (debug only: renders nothing unless the prop bbox is true) */}
    {bbox ? <BoxProbe /> : null}
    {sc.map((s, k) => {
      const S = BYID[s.id];
      return <Sequence key={s.id} name={s.id} from={CUT[k]} durationInFrames={LEN(k) + (k < sc.length - 1 ? XF : 0)}><S /></Sequence>;
    })}
    {audio ? <Audio src={staticFile(audio)} /> : null}
  </AbsoluteFill>
);
