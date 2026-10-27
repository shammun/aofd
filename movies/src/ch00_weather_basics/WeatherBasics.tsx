import React from "react";
import { AbsoluteFill } from "remotion";

// Placeholder until the motion-builder writes the composition (frames come from timing.json then).
export const WB_FPS = 30;
export const WB_FRAMES = 60;

export const WeatherBasics: React.FC<{ audio?: string }> = () => <AbsoluteFill style={{ backgroundColor: "#171f30" }} />;
