import React from "react";
// render the 3-D children too (as unknown DOM tags) inside a <r3f-root> marker, so the 3-D components' bodies run in the SSR check
// and entry.jsx can verify that every tag in the tree is a THREE class (ch00_gradient: #5's <g>-in-R3F lesson)
export const ThreeCanvas = ({ children }) => (globalThis.__R3 ? React.createElement("r3f-root", null, children) : null);
