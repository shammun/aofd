import React from "react";
export const useCurrentFrame = () => globalThis.__F ?? 0;
export const useVideoConfig = () => ({ width: 1920, height: 1080, fps: 30, durationInFrames: 1 });
export const AbsoluteFill = ({ children, style }) => React.createElement("div", { style }, children);
export const Sequence = ({ children }) => React.createElement(React.Fragment, null, children);
export const Freeze = ({ children }) => React.createElement(React.Fragment, null, children);
export const Audio = () => null;
export const Composition = () => null;
export const registerRoot = () => {};
export const staticFile = (s) => { (globalThis.__ASSETS ??= new Set()).add(s); return "/" + s; };
export const delayRender = () => 1;
export const continueRender = () => {};
export const cancelRender = (e) => { throw e; };
// deterministic stand-in for remotion's random(seed) (the SSR gate only needs a number in [0, 1))
export const random = (seed) => { let h = 2166136261; for (const ch of String(seed)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return ((h >>> 0) % 100000) / 100000; };
