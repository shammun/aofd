import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { C } from "../house/kit/type";
import { BoxProbe } from "../house/kit/bbox";
import { CUT, FPS, MV_FRAMES, LEN, XF, sc } from "./mv_lib";
import { SCENES_A } from "./mv_sA";
import { SCENES_B } from "./mv_sB";
import { SCENES_C } from "./mv_sC";

/**
 * Chapter-0 movie #5e "Coordinates, Part 5 — Moving frames: storm-relative winds"
 * (movies/ch00/ch00_coordinates_moving/storyboard.yaml, 19 scenes), 1920×1080, 30 fps; length = timing.json + 2.5-s hold.
 * House style movies/HOUSE_STYLE.md (reference ch00_dot_product_why v6) incl. §5b: one title (s00), keywords not sentences, no
 * boxes (except the user's skip chips), no references, source lines below the pictures (K2), colour bars beside the maps,
 * wind arrows animated (K7), caption band empty, text ≥ 44 px and ending before x 1842 (mv_lib guard), reveals on their words
 * (AT). Every number comes from data/mv.json (movies/data/build_ch00_coordinates_moving.py, tested fluidpy functions, CHECK rows
 * DC50-DC56, DP29-DP42); scene files only index and place. timing.json is PROVISIONAL (measured dry runs, checks/make_timing.py)
 * until the final TTS.
 */
export const MV_FPS = FPS;
export { MV_FRAMES };

/** scene id → component (the static checks read this table) */
const BYID: Record<string, React.FC> = { ...SCENES_A, ...SCENES_B, ...SCENES_C };
const missing = sc.map((s) => s.id).filter((id) => !BYID[id]);
if (missing.length) throw new Error(`no component for scene(s) ${missing.join(", ")}`);
if (Object.keys(BYID).length !== sc.length) throw new Error(`${Object.keys(BYID).length} scene components but ${sc.length} scenes in timing.json`);

export const CoordinatesMoving: React.FC<{ audio?: string; bbox?: boolean }> = ({ audio = "narration_music_mv.wav", bbox = false }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    {bbox ? <BoxProbe /> : null}
    {sc.map((s, k) => {
      const S = BYID[s.id];
      return <Sequence key={s.id} name={s.id} from={CUT[k]} durationInFrames={LEN(k) + (k < sc.length - 1 ? XF : 0)}><S /></Sequence>;
    })}
    {audio ? <Audio src={staticFile(audio)} /> : null}
  </AbsoluteFill>
);
