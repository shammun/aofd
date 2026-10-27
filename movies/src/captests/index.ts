// Separate Remotion entry for the map/3-D capability tests (2026-10-27). Bundles only movies/src/captests/** (and
// read-only imports), so the movie builders' entries (src/index.ts, src/ch00_weather_basics/index.ts) are untouched.
import { registerRoot } from "remotion";
import { RootCT } from "./Root";

registerRoot(RootCT);
