// Every on-screen equation of the storyboard (movies/ch00/ch00_coordinates_frames/storyboard.yaml), verbatim (String.raw
// constants: the QA equations gate greps this file; provenance lives in the storyboard only and is never drawn).
// Generated once from the storyboard by the motion-builder (2026-11-05); edit only together with the storyboard.
export const EQ_S02 = String.raw`\hat{\mathbf r}=(\cos\varphi\cos\lambda,\ \cos\varphi\sin\lambda,\ \sin\varphi)`;
export const EQ_S03 = String.raw`\mathbf v=u\,\hat{\mathbf i}+v\,\hat{\mathbf j}+w\,\hat{\mathbf k}`;
export const EQ_S04 = String.raw`\hat{\mathbf k}=(\cos\varphi\cos\lambda,\ \cos\varphi\sin\lambda,\ \sin\varphi)`;
export const EQ_S05 = String.raw`\hat{\mathbf i}=(-\sin\lambda,\ \cos\lambda,\ 0)`;
export const EQ_S06 = String.raw`\hat{\mathbf j}=(-\sin\varphi\cos\lambda,\ -\sin\varphi\sin\lambda,\ \cos\varphi)`;
export const EQ_S08 = String.raw`\cos(\text{angle})=\hat{\mathbf k}_1\cdot\hat{\mathbf k}_2`;
export const EQ_S10 = String.raw`\hat{\mathbf x}'=\cos\alpha\,\hat{\mathbf i}+\sin\alpha\,\hat{\mathbf j},\qquad \hat{\mathbf y}'=-\sin\alpha\,\hat{\mathbf i}+\cos\alpha\,\hat{\mathbf j}`;
export const EQ_S11 = String.raw`\Delta y=a\,\Delta\varphi,\qquad \Delta x=a\cos\varphi\,\Delta\lambda`;
export const EQ_S12 = String.raw`\tan\beta=\frac{55.0}{91.5}=0.601,\qquad \text{bearing}=360^\circ-31^\circ=329^\circ`;
export const EQ_S13 = String.raw`\alpha=90^\circ-329^\circ=-239^\circ\equiv121^\circ`;
export const EQ_S14 = String.raw`\text{along}=\mathbf v\cdot\hat{\mathbf x}'=22.2\times(-0.515)+24.3\times0.857\approx9.4\ \text{m/s}`;
export const EQ_S16 = String.raw`\frac{d\hat{\mathbf r}}{d\theta}=\hat{\boldsymbol\theta},\qquad \frac{d\hat{\boldsymbol\theta}}{d\theta}=-\hat{\mathbf r}`;
export const EQ_S18 = String.raw`\frac{D\hat{\mathbf i}}{Dt}=\frac{d\hat{\mathbf i}}{d\lambda}\,\frac{D\lambda}{Dt}=-\hat{\mathbf R}\,\frac{u}{a\cos\varphi}`;
export const EQ_S19 = String.raw`\frac{D\hat{\mathbf i}}{Dt}=\frac{u}{a\cos\varphi}\left(\hat{\mathbf j}\sin\varphi-\hat{\mathbf k}\cos\varphi\right)`;
export const EQ_S20 = String.raw`\frac{D\hat{\mathbf k}}{Dt}\Big|_{\rm north}=\hat{\mathbf j}\,\frac{v}{a},\qquad \frac{D\hat{\mathbf j}}{Dt}\Big|_{\rm north}=-\hat{\mathbf k}\,\frac{v}{a}`;
export const EQ_S21 = String.raw`\frac{D\hat{\mathbf k}}{Dt}\Big|_{\rm east}=\hat{\mathbf i}\,\frac{u}{a},\qquad \frac{D\hat{\mathbf j}}{Dt}\Big|_{\rm east}=-\hat{\mathbf i}\,\frac{u}{a}\tan\varphi`;
export const EQ_S22 = String.raw`\frac{D\hat{\mathbf i}}{Dt}=\frac{u}{a\cos\varphi}(\hat{\mathbf j}\sin\varphi-\hat{\mathbf k}\cos\varphi),\quad \frac{D\hat{\mathbf j}}{Dt}=-\hat{\mathbf i}\,\frac{u}{a}\tan\varphi-\hat{\mathbf k}\,\frac{v}{a},\quad \frac{D\hat{\mathbf k}}{Dt}=\hat{\mathbf i}\,\frac{u}{a}+\hat{\mathbf j}\,\frac{v}{a}`;
export const EQ_S23 = String.raw`\frac{D\mathbf v}{Dt}=\frac{Du}{Dt}\hat{\mathbf i}+u\frac{D\hat{\mathbf i}}{Dt}+\frac{Dv}{Dt}\hat{\mathbf j}+v\frac{D\hat{\mathbf j}}{Dt}+\frac{Dw}{Dt}\hat{\mathbf k}+w\frac{D\hat{\mathbf k}}{Dt}`;
export const EQ_S24 = String.raw`\hat{\mathbf i}\cdot\hat{\mathbf i}=1,\qquad \hat{\mathbf j}\cdot\hat{\mathbf i}=\hat{\mathbf k}\cdot\hat{\mathbf i}=0,\qquad \frac{D\hat{\mathbf i}}{Dt}\cdot\hat{\mathbf i}=0`;
export const EQ_S25 = String.raw`\frac{D\mathbf v}{Dt}\cdot\hat{\mathbf i}=\frac{Du}{Dt}-\frac{uv\tan\varphi}{a}+\frac{uw}{a}`;
export const EQ_S26 = String.raw`\frac{D\mathbf v}{Dt}\cdot\hat{\mathbf i}=0\ \Rightarrow\ \frac{Du}{Dt}=\frac{uv\tan\varphi}{a}-\frac{uw}{a}=\frac{uv\tan\varphi}{a}\neq0\quad(w=0)`;
export const EQ_S27 = String.raw`\frac{uv\tan\varphi}{a}=\frac{10\times10\times1}{6.371\times10^{6}}\approx1.6\times10^{-5}\ \text{m/s}^2`;
/** split a constant at a separator that must exist (each half is drawn on its own line) */
export const cutAt = (s: string, at: string): [string, string] => { const i = s.indexOf(at); if (i < 0) throw new Error(`cutAt: ${at} not in ${s}`); return [s.slice(0, i), s.slice(i + at.length)]; };
