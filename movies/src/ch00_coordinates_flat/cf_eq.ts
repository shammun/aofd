// Every on-screen equation of the storyboard (movies/ch00/ch00_coordinates_flat/storyboard.yaml), verbatim (String.raw
// constants: the QA equations gate greps this file; provenance lives in the storyboard only and is never drawn).
// s23 / s26 follow the data report (ring means 35 and 13 m/s about the model's calm centre).
export const EQ_S02 = String.raw`(x,\ y)=(3,\ 4)`;
export const EQ_S03 = String.raw`3\,\hat{\mathbf x}+4\,\hat{\mathbf y}`;
export const EQ_S04 = String.raw`x=r\cos\theta,\qquad y=r\sin\theta,\qquad r=\sqrt{x^2+y^2}`;
export const EQ_S05 = String.raw`x=r\cos\theta,\qquad y=r\sin\theta`;
export const EQ_S06 = String.raw`\text{bearing}=90^\circ-\theta=90^\circ-53^\circ=37^\circ`;
export const EQ_S07 = String.raw`s=r\,\theta\quad(\theta\ \text{in radians})`;
export const EQ_S08 = String.raw`\hat{\mathbf r}=\frac{(r\cos\theta,\ r\sin\theta)}{r}=(\cos\theta,\ \sin\theta)`;   // lint-ok: storyboard-verbatim string (QA equations gate); the house TeX draws it \displaystyle, i.e. as \dfrac
export const EQ_S09 = String.raw`\hat{\boldsymbol\theta}=\hat{\mathbf r}\ \text{turned by}\ +90^\circ`;
export const EQ_S10 = String.raw`(p,\ q)\ \longrightarrow\ (-q,\ p)`;
export const EQ_S11 = String.raw`\hat{\boldsymbol\theta}=(-\sin\theta,\ \cos\theta)`;
export const EQ_S13 = String.raw`u_r=\mathbf u\cdot\hat{\mathbf r},\qquad u_\theta=\mathbf u\cdot\hat{\boldsymbol\theta}`;
export const EQ_S14 = String.raw`u_r=u\cos\theta+v\sin\theta,\qquad u_\theta=-u\sin\theta+v\cos\theta`;
export const EQ_S15 = String.raw`\hat{\mathbf x}'=(\cos\alpha,\ \sin\alpha)`;
export const EQ_S16 = String.raw`\hat{\mathbf y}'=(-\sin\alpha,\ \cos\alpha)`;
export const EQ_S17 = String.raw`x'=x\cos\alpha+y\sin\alpha,\qquad y'=-x\sin\alpha+y\cos\alpha`;
export const EQ_S18 = String.raw`\begin{pmatrix}x'\\ y'\end{pmatrix}=\begin{pmatrix}\cos\alpha & \sin\alpha\\ -\sin\alpha & \cos\alpha\end{pmatrix}\begin{pmatrix}x\\ y\end{pmatrix}`;
export const EQ_S19 = String.raw`x'_j=x_i\,C_{ij},\qquad C_{ij}=\mathbf e_i\cdot\mathbf e'_j`;
export const EQ_S20 = String.raw`\alpha=\theta:\quad \hat{\mathbf x}'=\hat{\mathbf r},\quad \hat{\mathbf y}'=\hat{\boldsymbol\theta}`;
export const EQ_S21 = String.raw`(r,\ \theta)`;
export const EQ_S22 = String.raw`\text{average}=\frac{\text{sum of the 72 values}}{72}`;   // lint-ok: storyboard-verbatim string (QA equations gate); the house TeX draws it \displaystyle, i.e. as \dfrac
export const EQ_S23 = String.raw`\sqrt{35^2+13^2}\approx37\ \mathrm{m/s}`;
export const EQ_S24 = String.raw`u_r=u\cos\theta+v\sin\theta,\qquad u_\theta=-u\sin\theta+v\cos\theta`;
export const EQ_S26 = String.raw`\tan(\text{inflow angle})=\frac{13.3}{34.8}\approx0.38`;   // lint-ok: storyboard-verbatim string (QA equations gate); the house TeX draws it \displaystyle, i.e. as \dfrac
/** split a constant at a separator that must exist (each half is drawn on its own line) */
export const cutAt = (s: string, at: string): [string, string] => { const i = s.indexOf(at); if (i < 0) throw new Error(`cutAt: ${at} not in ${s}`); return [s.slice(0, i), s.slice(i + at.length)]; };
