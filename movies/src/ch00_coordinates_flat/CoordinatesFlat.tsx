import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { C } from "../house/kit/type";
import { BoxProbe } from "../house/kit/bbox";
import { CF_FRAMES, CUT, FPS, LEN, XF, sc } from "./cf_lib";
import { SCENES_A } from "./cf_sA";
import { SCENES_B } from "./cf_sB";
import { SCENES_C } from "./cf_sC";

/**
 * Chapter-0 movie #5a "Coordinates, Part 1: on a flat map, from Cartesian to polar and turned axes"
 * (movies/ch00/ch00_coordinates_flat/storyboard.yaml, 29 scenes), 1920×1080, 30 fps; length = timing.json + 2.5-s hold.
 * House style movies/HOUSE_STYLE.md (reference ch00_dot_product_why v6): one title (s00), keywords not sentences, no boxes, no
 * references, source lines below the pictures (K2), colour bar beside the Ian maps, wind arrows animated (K7), caption band
 * empty, text ≥ 44 px, reveals on their words (AT). Real moment: Hurricane Ian, HRRR 18 UTC 28 Sep 2022, centre = the
 * model's own calm centre (data report 2026-11-05). Every number comes from data/cf.json
 * (movies/data/build_ch00_coordinates_flat.py, tested fluidpy functions, 58 CHECK rows); scene files only index and place.
 */
export const CF_FPS = FPS;
export { CF_FRAMES };

/** scene id → component (the static checks read this table) */
const BYID: Record<string, React.FC> = { ...SCENES_A, ...SCENES_B, ...SCENES_C };
const missing = sc.map((s) => s.id).filter((id) => !BYID[id]);
if (missing.length) throw new Error(`no component for scene(s) ${missing.join(", ")}`);
if (Object.keys(BYID).length !== sc.length) throw new Error(`${Object.keys(BYID).length} scene components but ${sc.length} scenes in timing.json`);

export const CoordinatesFlat: React.FC<{ audio?: string; bbox?: boolean }> = ({ audio = "narration_music_cf.wav", bbox = false }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    {bbox ? <BoxProbe /> : null}
    {sc.map((s, k) => {
      const S = BYID[s.id];
      return <Sequence key={s.id} name={s.id} from={CUT[k]} durationInFrames={LEN(k) + (k < sc.length - 1 ? XF : 0)}><S /></Sequence>;
    })}
    {audio ? <Audio src={staticFile(audio)} /> : null}
  </AbsoluteFill>
);
