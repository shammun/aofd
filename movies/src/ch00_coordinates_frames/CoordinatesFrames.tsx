import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { C } from "../house/kit/type";
import { BoxProbe } from "../house/kit/bbox";
import { CUT, FPS, FR_FRAMES, LEN, XF, sc } from "./fr_lib";
import { SCENES_A } from "./fr_sA";
import { SCENES_B } from "./fr_sB";
import { SCENES_C } from "./fr_sC";

/**
 * Chapter-0 movie #5d "Coordinates, Part 4 — Turning frames: local axes and how they turn"
 * (movies/ch00/ch00_coordinates_frames/storyboard.yaml, 30 scenes), 1920×1080, 30 fps; length = timing.json + 2.5-s hold.
 * House style movies/HOUSE_STYLE.md (reference ch00_dot_product_why v6) incl. §5b: one title (s00), keywords not sentences, no
 * boxes (except the user's skip chips), no references, source lines below the pictures (K2), colour bar beside the Ian map,
 * globes in the house frame (K1; s03/s07/s08/s09 zoom-reveal), wind arrows animated (K7), caption band empty, text ≥ 44 px and
 * ending before x 1842 (fr_lib guard), reveals on their words (AT). Every number comes from data/fr.json
 * (movies/data/build_ch00_coordinates_frames.py, tested fluidpy functions, CHECK rows DP02-DP28); scene files only index and place.
 * timing.json is PROVISIONAL (measured dry runs, checks/make_timing.py) until the final TTS.
 */
export const FR_FPS = FPS;
export { FR_FRAMES };

/** scene id → component (the static checks read this table) */
const BYID: Record<string, React.FC> = { ...SCENES_A, ...SCENES_B, ...SCENES_C };
const missing = sc.map((s) => s.id).filter((id) => !BYID[id]);
if (missing.length) throw new Error(`no component for scene(s) ${missing.join(", ")}`);
if (Object.keys(BYID).length !== sc.length) throw new Error(`${Object.keys(BYID).length} scene components but ${sc.length} scenes in timing.json`);

export const CoordinatesFrames: React.FC<{ audio?: string; bbox?: boolean }> = ({ audio = "narration_music_fr.wav", bbox = false }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    {bbox ? <BoxProbe /> : null}
    {sc.map((s, k) => {
      const S = BYID[s.id];
      return <Sequence key={s.id} name={s.id} from={CUT[k]} durationInFrames={LEN(k) + (k < sc.length - 1 ? XF : 0)}><S /></Sequence>;
    })}
    {audio ? <Audio src={staticFile(audio)} /> : null}
  </AbsoluteFill>
);
