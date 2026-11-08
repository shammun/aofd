// Every on-screen equation of the storyboard (movies/ch00/ch00_coordinates_frames/storyboard.yaml), verbatim (String.raw
// constants: the QA equations gate greps this file; provenance lives in the storyboard only and is never drawn).
// Generated once from the storyboard by the motion-builder (2026-11-05); edit only together with the storyboard.
export const EQ_S03 = String.raw`\mathbf v=u\,\hat{\mathbf i}+v\,\hat{\mathbf j}+w\,\hat{\mathbf k}`;
export const EQ_S04 = String.raw`\hat{\mathbf k}=(\cos\varphi\cos\lambda,\ \cos\varphi\sin\lambda,\ \sin\varphi)`;
export const EQ_S05 = String.raw`\hat{\mathbf i}=(-\sin\lambda,\ \cos\lambda,\ 0)`;
export const EQ_S06 = String.raw`\hat{\mathbf j}=(-\sin\varphi\cos\lambda,\ -\sin\varphi\sin\lambda,\ \cos\varphi)`;
export const EQ_S08 = String.raw`\cos(\text{angle})=\hat{\mathbf k}_1\cdot\hat{\mathbf k}_2`;
export const EQ_S10 = String.raw`\hat{\mathbf x}'=\cos\alpha\,\hat{\mathbf i}+\sin\alpha\,\hat{\mathbf j},\qquad \hat{\mathbf y}'=-\sin\alpha\,\hat{\mathbf i}+\cos\alpha\,\hat{\mathbf j}`;
export const EQ_S11 = String.raw`\Delta y=a\,\Delta\varphi,\qquad \Delta x=a\cos\varphi\,\Delta\lambda`;
export const EQ_S12 = String.raw`\tan\beta=\dfrac{55.0}{91.5}=0.601,\qquad \text{bearing}=360^\circ-31^\circ=329^\circ`;
export const EQ_S13 = String.raw`\alpha=90^\circ-329^\circ=-239^\circ\equiv121^\circ`;
export const EQ_S16 = String.raw`\dfrac{d\hat{\mathbf r}}{d\theta}=\hat{\boldsymbol\theta},\qquad \dfrac{d\hat{\boldsymbol\theta}}{d\theta}=-\hat{\mathbf r}`;
export const EQ_S18 = String.raw`\dfrac{D\hat{\mathbf i}}{Dt}=\dfrac{d\hat{\mathbf i}}{d\lambda}\,\dfrac{D\lambda}{Dt}=-\hat{\mathbf R}\,\dfrac{u}{a\cos\varphi}`;
export const EQ_S19 = String.raw`\dfrac{D\hat{\mathbf i}}{Dt}=\dfrac{u}{a\cos\varphi}\left(\hat{\mathbf j}\sin\varphi-\hat{\mathbf k}\cos\varphi\right)`;
export const EQ_S20 = String.raw`\dfrac{D\hat{\mathbf k}}{Dt}\Big|_{\rm north}=\hat{\mathbf j}\,\dfrac{v}{a},\qquad \dfrac{D\hat{\mathbf j}}{Dt}\Big|_{\rm north}=-\hat{\mathbf k}\,\dfrac{v}{a}`;
export const EQ_S21 = String.raw`\dfrac{D\hat{\mathbf k}}{Dt}\Big|_{\rm east}=\hat{\mathbf i}\,\dfrac{u}{a},\qquad \dfrac{D\hat{\mathbf j}}{Dt}\Big|_{\rm east}=-\hat{\mathbf i}\,\dfrac{u}{a}\tan\varphi`;
export const EQ_S22 = String.raw`\dfrac{D\hat{\mathbf i}}{Dt}=\dfrac{u}{a\cos\varphi}(\hat{\mathbf j}\sin\varphi-\hat{\mathbf k}\cos\varphi),\quad \dfrac{D\hat{\mathbf j}}{Dt}=-\hat{\mathbf i}\,\dfrac{u}{a}\tan\varphi-\hat{\mathbf k}\,\dfrac{v}{a},\quad \dfrac{D\hat{\mathbf k}}{Dt}=\hat{\mathbf i}\,\dfrac{u}{a}+\hat{\mathbf j}\,\dfrac{v}{a}`;
export const EQ_S23 = String.raw`\dfrac{D\mathbf v}{Dt}=\dfrac{Du}{Dt}\hat{\mathbf i}+u\dfrac{D\hat{\mathbf i}}{Dt}+\dfrac{Dv}{Dt}\hat{\mathbf j}+v\dfrac{D\hat{\mathbf j}}{Dt}+\dfrac{Dw}{Dt}\hat{\mathbf k}+w\dfrac{D\hat{\mathbf k}}{Dt}`;
export const EQ_S24 = String.raw`\hat{\mathbf i}\cdot\hat{\mathbf i}=1,\qquad \hat{\mathbf j}\cdot\hat{\mathbf i}=\hat{\mathbf k}\cdot\hat{\mathbf i}=0,\qquad \dfrac{D\hat{\mathbf i}}{Dt}\cdot\hat{\mathbf i}=0`;
export const EQ_S25 = String.raw`\dfrac{D\mathbf v}{Dt}\cdot\hat{\mathbf i}=\dfrac{Du}{Dt}-\dfrac{uv\tan\varphi}{a}+\dfrac{uw}{a}`;
export const EQ_S26 = String.raw`\dfrac{D\mathbf v}{Dt}\cdot\hat{\mathbf i}=0\ \Rightarrow\ \dfrac{Du}{Dt}=\dfrac{uv\tan\varphi}{a}-\dfrac{uw}{a}=\dfrac{uv\tan\varphi}{a}\neq0\quad(w=0)`;
export const EQ_S27 = String.raw`\dfrac{uv\tan\varphi}{a}=\dfrac{10\times10\times1}{6.371\times10^{6}}\approx1.6\times10^{-5}\ \text{m/s}^2`;
/** split a constant at a separator that must exist (each half is drawn on its own line) */
export const cutAt = (s: string, at: string): [string, string] => { const i = s.indexOf(at); if (i < 0) throw new Error(`cutAt: ${at} not in ${s}`); return [s.slice(0, i), s.slice(i + at.length)]; };
