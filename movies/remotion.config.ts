// Remotion config for the AOFD movies (R1 §4.3, §5.2). CLI flags override these per render.
// Render scratch for real movies goes to G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ (pass --output there);
// movies/out/ is only for tiny test renders and is git-ignored.
import { Config } from "@remotion/cli/config";

Config.setChromiumOpenGlRenderer("angle"); // WebGL for @remotion/three on Windows (GPU via ANGLE; falls back to SwiftShader)
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(90);
Config.setCodec("h264");
Config.setCrf(23);
Config.setPixelFormat("yuv420p");
// Without bt709 the JPEG frames are encoded full-range (yuvj420p, bt470bg), which movie_qa rejects; bt709 gives
// tv-range yuv420p that every browser plays with correct colours (found in the step-9 self-test, 2026-10-21).
Config.setColorSpace("bt709");
Config.setConcurrency("50%");
Config.setOverwriteOutput(true);
