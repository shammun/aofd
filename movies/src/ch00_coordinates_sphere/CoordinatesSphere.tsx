import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { C } from "../house/kit/type";
import { BoxProbe } from "../house/kit/bbox";
import { CS_FRAMES, CUT, FPS, LEN, SceneGate, XF, XIN, sc } from "./cs_lib";
import { SCENES_A } from "./cs_sA";
import { SCENES_B } from "./cs_sB";
import { SCENES_C } from "./cs_sC";

/**
 * Chapter-0 movie #5c "Coordinates, Part 3 — Our round Earth: latitude, longitude, distances and areas"
 * (movies/ch00/ch00_coordinates_sphere/storyboard.yaml v1, 37 scenes), 1920×1080, 30 fps; length = timing.json + 2.5-s hold.
 * House style movies/HOUSE_STYLE.md (reference ch00_dot_product_why v6) incl. §5b: one title (s00), keywords not sentences, no
 * boxes (except the user's skip chips), no references, source lines below the pictures (K2), colour bar beside the ERA5 map,
 * globes in the house frame (K1; s10/s19/s27 zoom-reveal), caption band empty, text ≥ 44 px and ending before x 1842 (cs_lib
 * guard), reveals on their words (AT). Every number comes from data/cs.json (movies/data/build_ch00_coordinates_sphere.py,
 * tested fluidpy functions, CHECK rows DS01-DS29); scene files only index and place.
 * timing.json is PROVISIONAL (the measured dry run 3, checks/make_timing.py) until the final TTS.
 */
export const CS_FPS = FPS;
export { CS_FRAMES };

/** scene id → component (the static checks read this table) */
const BYID: Record<string, React.FC> = { ...SCENES_A, ...SCENES_B, ...SCENES_C };
const missing = sc.map((s) => s.id).filter((id) => !BYID[id]);
if (missing.length) throw new Error(`no component for scene(s) ${missing.join(", ")}`);
if (Object.keys(BYID).length !== sc.length) throw new Error(`${Object.keys(BYID).length} scene components but ${sc.length} scenes in timing.json`);

export const CoordinatesSphere: React.FC<{ audio?: string; bbox?: boolean }> = ({ audio = "narration_music_cs.wav", bbox = false }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    {bbox ? <BoxProbe /> : null}
    {sc.map((s, k) => {
      const S = BYID[s.id];
      // p3c: every scene after s00 gates its text (XIN) and its credit (XF): exit before entry at every scene start (cs_lib SceneGate)
      return <Sequence key={s.id} name={s.id} from={CUT[k]} durationInFrames={LEN(k) + (k < sc.length - 1 ? XF : 0)}>
        <SceneGate value={k === 0 ? { text: 0, src: 0 } : { text: XIN, src: XF }}><S /></SceneGate></Sequence>;
    })}
    {audio ? <Audio src={staticFile(audio)} /> : null}
  </AbsoluteFill>
);
