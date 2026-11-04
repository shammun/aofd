import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { C } from "../house/kit/type";
import { BoxProbe } from "../house/kit/bbox";
import { GR_FRAMES, CUT, FPS, LEN, XF, sc } from "./gr_lib";
import { SCENES_A } from "./gr_sA";
import { SCENES_B } from "./gr_sB";
import { SCENES_C } from "./gr_sC";
import { SCENES_D } from "./gr_sD";

/**
 * Chapter-0 movie #6 "The gradient (and how it finds the steepest way up a mountain, the push on the air in a storm, and the
 * sharpest temperature changes in fronts, sea breezes and jets)" (movies/ch00/ch00_gradient/storyboard.yaml, 41 scenes incl. the
 * build-1 s33b front stack), 1920×1080, 30 fps; length = timing.json + 2.5-s hold. House style movies/HOUSE_STYLE.md incl. §5b:
 * one title (s00), keywords not sentences, no boxes, no references, source lines below the pictures (K2), colour bars beside them,
 * globes in the house frame (K1; s37 zoom-reveal), the Elliott layer stack hovered from outside (K5), wind arrows animated (K7),
 * caption band empty, text ≥ 44 px and ending before x 1842, readouts in the text column with SideCallout links, reveals on their
 * words (AT). Every number and every moving or coloured thing comes from data/gr.json (movies/data/build_ch00_gradient.py, tested
 * fluidpy functions, 99 CHECK rows); the scene files only index, place and interpolate. Equations: gr_eq.ts (verbatim storyboard).
 */
export const GR_FPS = FPS;
export { GR_FRAMES };

/** scene id → component (the static checks checks/swap_check.mjs and checks/cam_speed.mjs read this table) */
const BYID: Record<string, React.FC> = { ...SCENES_A, ...SCENES_B, ...SCENES_C, ...SCENES_D };
const missing = sc.map((s) => s.id).filter((id) => !BYID[id]);
if (missing.length) throw new Error(`no component for scene(s) ${missing.join(", ")}`);
if (Object.keys(BYID).length !== sc.length) throw new Error(`${Object.keys(BYID).length} scene components but ${sc.length} scenes in timing.json`);

export const Gradient: React.FC<{ audio?: string; bbox?: boolean }> = ({ audio = "narration_music.wav", bbox = false }) => (
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
