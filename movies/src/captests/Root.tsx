// Capability-test compositions (own entry, never registered in movies/src/Root.tsx). 1920x1080, 30 fps.
import React from "react";
import { Composition } from "remotion";
import { A1D3, A1ML, A4Bar, A5Wipe, A6Chart, C3Relief, S1Build, S1D3, S2D3 } from "./comps2d";
import { FlightA, FlightB, FlightC, H2HGlobe, H2HTerrain, SliderDerna, SliderIndus } from "./flights";
import { A2Particles, C1Plate, C2Globe, C4Terrain, G1Globe, G2Globe, O1Globe, P1Heavy, T1Terrain, T2Fly, T3Zoom, X1Section, X2Sounding, X3Stack } from "./comps3d";
import { Showcase, SHOW_FRAMES } from "./Showcase";

const C: [string, React.FC, number][] = [
  ["S1D3", S1D3, 1], ["S2D3", S2D3, 1], ["A1D3", A1D3, 300], ["A1ML", A1ML, 300], ["A2Particles", A2Particles, 360],
  ["A4Bar", A4Bar, 300], ["A5Wipe", A5Wipe, 300], ["A6Chart", A6Chart, 450], ["C3Relief", C3Relief, 240],
  ["G1Globe", G1Globe, 360], ["G2Globe", G2Globe, 360], ["O1Globe", O1Globe, 360], ["C2Globe", C2Globe, 300],
  ["T1Terrain", T1Terrain, 300], ["T2Fly", T2Fly, 450], ["T3Zoom", T3Zoom, 450], ["C4Terrain", C4Terrain, 300],
  ["X1Section", X1Section, 360], ["X2Sounding", X2Sounding, 360], ["X3Stack", X3Stack, 300], ["C1Plate", C1Plate, 300],
  ["P1Heavy", P1Heavy, 300], ["S1Build", S1Build, 300], ["H2HGlobe", H2HGlobe, 330], ["H2HTerrain", H2HTerrain, 300],
  ["FlightA", FlightA, 600], ["FlightB", FlightB, 600], ["FlightC", FlightC, 480], ["SliderIndus", SliderIndus, 450], ["SliderDerna", SliderDerna, 450],
];

export const RootCT: React.FC = () => (
  <>
    {C.map(([id, comp, n]) => <Composition key={id} id={`CT${id}`} component={comp} durationInFrames={n} fps={30} width={1920} height={1080} />)}
    <Composition id="CTShowcase" component={Showcase} durationInFrames={SHOW_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
