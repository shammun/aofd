// Every on-screen equation of the storyboard (movies/ch00/ch00_coordinates_routes/storyboard.yaml), verbatim (String.raw
// constants: the QA equations gate greps this file; provenance lives in the storyboard only and is never drawn).
// Generated once from the storyboard by the motion-builder (2026-11-05); edit only together with the storyboard.
export const EQ_S02 = String.raw`\hat{\mathbf r}=(\cos\varphi\cos\lambda,\ \cos\varphi\sin\lambda,\ \sin\varphi)`;
export const EQ_S04 = String.raw`h_\theta=r,\qquad h_\varphi=a,\qquad h_\lambda=a\cos\varphi`;
export const EQ_S07 = String.raw`d=a\,\sigma\quad(\sigma\ \text{in radians})`;
export const EQ_S08 = String.raw`\hat{\mathbf r}_1\approx(0.622,\ -0.001,\ 0.783),\qquad \hat{\mathbf r}_2\approx(-0.392,\ -0.730,\ 0.560)`;
export const EQ_S09 = String.raw`\cos\sigma=\hat{\mathbf r}_1\cdot\hat{\mathbf r}_2`;
export const EQ_S10 = String.raw`d=a\,\sigma\approx 6371\times1.3742\approx 8755\ \text{km}`;
export const EQ_S14 = String.raw`d=a\,\sigma,\qquad \cos\sigma=\hat{\mathbf r}_1\cdot\hat{\mathbf r}_2`;
/** split a constant at a separator that must exist (each half is drawn on its own line) */
export const cutAt = (s: string, at: string): [string, string] => { const i = s.indexOf(at); if (i < 0) throw new Error(`cutAt: ${at} not in ${s}`); return [s.slice(0, i), s.slice(i + at.length)]; };
