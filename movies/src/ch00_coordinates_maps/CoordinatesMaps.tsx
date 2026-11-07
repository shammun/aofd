import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { C } from "../house/kit/type";
import { BoxProbe } from "../house/kit/bbox";
import { CUT, FPS, MP_FRAMES, LEN, XF, sc } from "./mp_lib";
import { SCENES_A } from "./mp_sA";
import { SCENES_B } from "./mp_sB";
import { SCENES_C } from "./mp_sC";

/**
 * Chapter-0 movie #5g "Coordinates, Part 7 — Maps: projections and the view from the pole"
 * (movies/ch00/ch00_coordinates_maps/storyboard.yaml, 23 scenes after the remake of 2026-11-07: series title, opening recap s02 cut,
 * point-of-use recalls of Parts 1/3/4/6, show-the-arithmetic narration, series-closing recap + gradient teaser, end card fading with the
 * music), 1920×1080, 30 fps; length = timing.json + 2.5-s hold.
 * House style movies/HOUSE_STYLE.md (reference ch00_dot_product_why v6) incl. §5b: one title (s00), keywords not sentences, no
 * boxes (except the user's maths-skip chips), no references, source lines below the pictures (K2), colour bars beside or under
 * the data maps, wind trails animated (K7 FlowParticles from advect_on_sphere), caption band empty, text ≥ 44 px and ending
 * before x 1842 (mp_lib guard), reveals on their words (AT). Every number comes from data/mp.json
 * (movies/data/build_ch00_coordinates_maps.py, tested fluidpy functions, 110 CHECK rows); projections are JS mirrors of
 * fluidpy.geo.mapproj.forward asserted against Python at load. timing.json is PROVISIONAL (checks/mp_r7_splice.py --provisional: the
 * measured dry-run clips + the new sentences estimated) until the queued final splice (checks/r7_queue.sh) replaces it.
 */
export const MP_FPS = FPS;
export { MP_FRAMES };

/** scene id → component (the static checks read this table) */
const BYID: Record<string, React.FC> = { ...SCENES_A, ...SCENES_B, ...SCENES_C };
const missing = sc.map((s) => s.id).filter((id) => !BYID[id]);
if (missing.length) throw new Error(`no component for scene(s) ${missing.join(", ")}`);
if (Object.keys(BYID).length !== sc.length) throw new Error(`${Object.keys(BYID).length} scene components but ${sc.length} scenes in timing.json`);

export const CoordinatesMaps: React.FC<{ audio?: string; bbox?: boolean }> = ({ audio = "narration_music_mp.wav", bbox = false }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    {bbox ? <BoxProbe /> : null}
    {sc.map((s, k) => {
      const S = BYID[s.id];
      return <Sequence key={s.id} name={s.id} from={CUT[k]} durationInFrames={LEN(k) + (k < sc.length - 1 ? XF : 0)}><S /></Sequence>;
    })}
    {audio ? <Audio src={staticFile(audio)} /> : null}
  </AbsoluteFill>
);
