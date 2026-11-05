import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { C } from "../house/kit/type";
import { BoxProbe } from "../house/kit/bbox";
import { CST_FRAMES, CUT, FPS, LEN, XF, sc } from "./cs_lib";
import { SCENES_A } from "./cs_sA";
import { SCENES_B } from "./cs_sB";
import { SCENES_C } from "./cs_sC";

/**
 * Chapter-0 movie #5b "Coordinates, Part 2 — Inside a tropical cyclone: turning arrows and cylindrical coordinates"
 * (movies/ch00/ch00_coordinates_storm/storyboard.yaml, 33 scenes), 1920×1080, 30 fps; length = timing.json + 2.5-s hold.
 * House style movies/HOUSE_STYLE.md (reference ch00_dot_product_why v6): one title (s00), keywords not sentences, no boxes except
 * the user's maths-skip chips, no references, source lines below the pictures, a colour bar beside every data field, wind arrows
 * animated, caption band empty, text ≥ 44 px, reveals on their words (AT). Every number comes from data/cs.json
 * (movies/data/build_ch00_coordinates_storm.py, tested fluidpy functions, CHECK rows DS01-DS28); scene files only index and place.
 * timing.json is PROVISIONAL (dry run 6) until the final TTS of the heavy phase.
 */
export const CST_FPS = FPS;
export { CST_FRAMES };

/** scene id → component (the static checks read this table) */
const BYID: Record<string, React.FC> = { ...SCENES_A, ...SCENES_B, ...SCENES_C };
const missing = sc.map((s) => s.id).filter((id) => !BYID[id]);
if (missing.length) throw new Error(`no component for scene(s) ${missing.join(", ")}`);
if (Object.keys(BYID).length !== sc.length) throw new Error(`${Object.keys(BYID).length} scene components but ${sc.length} scenes in timing.json`);

export const CoordinatesStorm: React.FC<{ audio?: string; bbox?: boolean }> = ({ audio = "narration_music_cst.wav", bbox = false }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    {bbox ? <BoxProbe /> : null}
    {sc.map((s, k) => {
      const S = BYID[s.id];
      return <Sequence key={s.id} name={s.id} from={CUT[k]} durationInFrames={LEN(k) + (k < sc.length - 1 ? XF : 0)}><S /></Sequence>;
    })}
    {audio ? <Audio src={staticFile(audio)} /> : null}
  </AbsoluteFill>
);
