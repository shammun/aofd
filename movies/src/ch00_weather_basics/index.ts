// Separate Remotion entry for ch00_weather_basics while another movie is being fixed in movies/src/ch00/ (2026-10-27).
// Bundling this file never imports CrossProductWhy, so a half-edited file in the other movie cannot break this build,
// and vice versa. When the movie is final, the orchestrator registers it in movies/src/Root.tsx as Ch00WeatherBasics.
import { registerRoot } from "remotion";
import { RootWB } from "./RootWB";

registerRoot(RootWB);
