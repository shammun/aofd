// Every on-screen equation of the storyboard (movies/ch00/ch00_coordinates_storm/storyboard.yaml), verbatim (String.raw
// constants: the QA equations gate greps this file; provenance lives in the storyboard only and is never drawn).
export const EQ_S02 = String.raw`\hat{\mathbf r}=(\cos\theta,\ \sin\theta),\qquad \hat{\boldsymbol\theta}=(-\sin\theta,\ \cos\theta)`;
export const EQ_S03 = String.raw`\text{tip moves } 1\times\Delta\theta=\Delta\theta\ \text{ along }\ \hat{\boldsymbol\theta}`;
export const EQ_S04 = String.raw`\dfrac{d}{d\theta}\cos\theta=-\sin\theta,\qquad \dfrac{d}{d\theta}\sin\theta=\cos\theta`;
export const EQ_S05 = String.raw`\dfrac{d\hat{\mathbf r}}{d\theta}=\hat{\boldsymbol\theta}`;
export const EQ_S06 = String.raw`\dfrac{d\hat{\boldsymbol\theta}}{d\theta}=-\hat{\mathbf r}`;
export const EQ_S07 = String.raw`\dfrac{d\hat{\mathbf r}}{d\theta}=\hat{\boldsymbol\theta},\qquad \dfrac{d\hat{\boldsymbol\theta}}{d\theta}=-\hat{\mathbf r}`;
export const EQ_S08 = String.raw`\dfrac{d}{dt}\big(v\,\hat{\mathbf d}\big)=\dfrac{dv}{dt}\,\hat{\mathbf d}+v\,\dfrac{d\hat{\mathbf d}}{dt}`;
export const EQ_S09 = String.raw`\dfrac{d\theta}{dt}=\dfrac{v}{r}`;
export const EQ_S10 = String.raw`\dfrac{d}{dt}\big(r\,\hat{\mathbf r}\big)=\dfrac{dr}{dt}\,\hat{\mathbf r}+r\,\dfrac{d\hat{\mathbf r}}{dt}`;
export const EQ_S11 = String.raw`\mathbf v=r\,\dfrac{d\hat{\mathbf r}}{d\theta}\,\dfrac{d\theta}{dt}=r\,\hat{\boldsymbol\theta}\,\dfrac{v}{r}=v\,\hat{\boldsymbol\theta}`;
export const EQ_S12 = String.raw`\mathbf a=\dfrac{d}{dt}\big(v\,\hat{\boldsymbol\theta}\big)=v\,\dfrac{d\hat{\boldsymbol\theta}}{d\theta}\,\dfrac{d\theta}{dt}=-\dfrac{v^2}{r}\,\hat{\mathbf r}`;
export const EQ_S13 = String.raw`\dfrac{v^2}{r}=\dfrac{34.8^2}{25\,000}\approx0.048\ \mathrm{m/s^2}`;
export const EQ_S14 = String.raw`|\Delta\mathbf v|\approx v\,\Delta\theta=34.8\times0.084\approx2.9\ \mathrm{m/s}`;
export const EQ_S15 = String.raw`(r,\ \theta,\ z)`;
export const EQ_S16 = String.raw`\mathbf u=u_r\,\hat{\mathbf r}+u_\theta\,\hat{\boldsymbol\theta}+w\,\hat{\mathbf z}`;
export const EQ_S20 = String.raw`\overline{u_r}(r,z)=\dfrac{1}{72}\sum_{k=1}^{72}u_r(r,\theta_k,z)`;
export const EQ_S23 = String.raw`\dfrac{6.0}{20.1}\approx0.299\ \Rightarrow\ \arctan0.299\approx16.6^\circ\approx17^\circ`;
export const EQ_S25 = String.raw`\mathbf a=-\dfrac{v^2}{r}\,\hat{\mathbf r}`;
// remake 2026-11-07 (R10-R16): Part 1's equations recalled at their point of use, exactly as Part 1 writes them (cf_eq.ts EQ_S14,
// EQ_S17, EQ_S18, EQ_S05, EQ_S06), and their wind form for the coast (along / across tags, not primes alone)
export const EQ_URUT = String.raw`u_r=u\cos\theta+v\sin\theta,\qquad u_\theta=-u\sin\theta+v\cos\theta`;
export const EQ_S09R = String.raw`\overline{u_\theta}=\dfrac{1}{72}\sum_{k=1}^{72}u_{\theta,k}\approx34.8\ \mathrm{m/s}`;
export const EQ_S15C = String.raw`x=r\cos\theta,\ y=r\sin\theta,\ z=z`;
export const EQ_S26 = String.raw`x'=x\cos\alpha+y\sin\alpha,\qquad y'=-x\sin\alpha+y\cos\alpha`;
export const EQ_S26M = String.raw`\begin{pmatrix}x'\\ y'\end{pmatrix}=\begin{pmatrix}\cos\alpha & \sin\alpha\\ -\sin\alpha & \cos\alpha\end{pmatrix}\begin{pmatrix}x\\ y\end{pmatrix}`;
export const EQ_S26W = String.raw`\text{along}=u\cos\alpha+v\sin\alpha,\qquad \text{across}=-u\sin\alpha+v\cos\alpha`;
export const EQ_S27 = String.raw`\text{bearing}=90^\circ-\theta`;
/** split a constant at a separator that must exist (each half is drawn on its own line) */
export const cutAt = (s: string, at: string): [string, string] => { const i = s.indexOf(at); if (i < 0) throw new Error(`cutAt: ${at} not in ${s}`); return [s.slice(0, i), s.slice(i + at.length)]; };
