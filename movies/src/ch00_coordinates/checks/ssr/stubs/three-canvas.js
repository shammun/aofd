import React from "react";
// render the 3-D children too (as unknown DOM tags), so the 3-D components' bodies run in the SSR check
export const ThreeCanvas = ({ children }) => (globalThis.__R3 ? React.createElement(React.Fragment, null, children) : null);
