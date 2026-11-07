import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { C } from "../house/kit/type";
import { BoxProbe } from "../house/kit/bbox";
import { CUT, FPS, RT_FRAMES, LEN, XF, sc } from "./rt_lib";
import { SCENES_A } from "./rt_sA";
import { SCENES_B } from "./rt_sB";
import { SCENES_C } from "./rt_sC";

/**
 * Chapter-0 movie #5f "Coordinates, Part 6 — Routes: great circles and rhumb lines"
 * (movies/ch00/ch00_coordinates_routes/storyboard.yaml, 15 scenes since the remake 2026-11-07 cut the opening recap s02), 1920×1080, 30 fps;
 * length = timing.json + 2.5-s hold (the end card fades with the music over it).
 * House style movies/HOUSE_STYLE.md (reference ch00_dot_product_why v6) incl. §5b: one title (s00), keywords not sentences, no
 * boxes (except the user's maths-skip chip), no references, source lines below the pictures (K2), globes in the house frame
 * (whole, unzoomed), caption band empty, text ≥ 44 px and ending before x 1842 (rt_lib guard), reveals on their words (AT).
 * Every number comes from data/rt.json (movies/data/build_ch00_coordinates_routes.py, tested fluidpy functions, CHECK rows
 *  DM01-DM21); scene files only index and place. timing.json is PROVISIONAL (re-used dry-run clips + estimated new sentences,
 * checks/rt_r7_splice.py --provisional) until the final splice (checks/rt_r7_splice.py, final_timing.py --final, rt_words.py) replaces the
 * provisional file.
 */
export const RT_FPS = FPS;
export { RT_FRAMES };

/** scene id → component (the static checks read this table) */
const BYID: Record<string, React.FC> = { ...SCENES_A, ...SCENES_B, ...SCENES_C };
const missing = sc.map((s) => s.id).filter((id) => !BYID[id]);
if (missing.length) throw new Error(`no component for scene(s) ${missing.join(", ")}`);
if (Object.keys(BYID).length !== sc.length) throw new Error(`${Object.keys(BYID).length} scene components but ${sc.length} scenes in timing.json`);

export const CoordinatesRoutes: React.FC<{ audio?: string; bbox?: boolean }> = ({ audio = "narration_music_rt.wav", bbox = false }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    {bbox ? <BoxProbe /> : null}
    {sc.map((s, k) => {
      const S = BYID[s.id];
      return <Sequence key={s.id} name={s.id} from={CUT[k]} durationInFrames={LEN(k) + (k < sc.length - 1 ? XF : 0)}><S /></Sequence>;
    })}
    {audio ? <Audio src={staticFile(audio)} /> : null}
  </AbsoluteFill>
);
