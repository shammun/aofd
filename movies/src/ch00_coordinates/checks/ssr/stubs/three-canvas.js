import React from "react";
// render the 3-D children too (as unknown DOM tags) inside an <r3root> marker, so the 3-D components' bodies run in the SSR
// check and entry.jsx can verify that every tag inside a 3-D tree is a THREE class (the THREE-tag guard: an SVG <g> or a <div>
// in an R3F tree crashes the real render with "X is not part of the THREE namespace").
export const ThreeCanvas = ({ children }) => (globalThis.__R3 ? React.createElement("r3root", null, children) : null);
