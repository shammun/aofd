// Every on-screen equation of the storyboard (movies/ch00/ch00_coordinates_storm/storyboard.yaml), verbatim (String.raw
// constants: the QA equations gate greps this file; provenance lives in the storyboard only and is never drawn).
export const EQ_S02 = String.raw`\hat{\mathbf r}=(\cos\theta,\ \sin\theta),\qquad \hat{\boldsymbol\theta}=(-\sin\theta,\ \cos\theta)`;
export const EQ_S03 = String.raw`\text{tip moves } 1\times\Delta\theta=\Delta\theta\ \text{ along }\ \hat{\boldsymbol\theta}`;
export const EQ_S04 = String.raw`\frac{d}{d\theta}\cos\theta=-\sin\theta,\qquad \frac{d}{d\theta}\sin\theta=\cos\theta`;
export const EQ_S05 = String.raw`\frac{d\hat{\mathbf r}}{d\theta}=\hat{\boldsymbol\theta}`;
export const EQ_S06 = String.raw`\frac{d\hat{\boldsymbol\theta}}{d\theta}=-\hat{\mathbf r}`;
export const EQ_S07 = String.raw`\frac{d\hat{\mathbf r}}{d\theta}=\hat{\boldsymbol\theta},\qquad \frac{d\hat{\boldsymbol\theta}}{d\theta}=-\hat{\mathbf r}`;
export const EQ_S08 = String.raw`\frac{d}{dt}\big(v\,\hat{\mathbf d}\big)=\frac{dv}{dt}\,\hat{\mathbf d}+v\,\frac{d\hat{\mathbf d}}{dt}`;
export const EQ_S09 = String.raw`\frac{d\theta}{dt}=\frac{v}{r}`;
export const EQ_S10 = String.raw`\frac{d}{dt}\big(r\,\hat{\mathbf r}\big)=\frac{dr}{dt}\,\hat{\mathbf r}+r\,\frac{d\hat{\mathbf r}}{dt}`;
export const EQ_S11 = String.raw`\mathbf v=r\,\frac{d\hat{\mathbf r}}{d\theta}\,\frac{d\theta}{dt}=r\,\hat{\boldsymbol\theta}\,\frac{v}{r}=v\,\hat{\boldsymbol\theta}`;
export const EQ_S12 = String.raw`\mathbf a=\frac{d}{dt}\big(v\,\hat{\boldsymbol\theta}\big)=v\,\frac{d\hat{\boldsymbol\theta}}{d\theta}\,\frac{d\theta}{dt}=-\frac{v^2}{r}\,\hat{\mathbf r}`;
export const EQ_S13 = String.raw`\frac{v^2}{r}=\frac{34.8^2}{25\,000}\approx0.048\ \mathrm{m/s^2}`;
export const EQ_S14 = String.raw`|\Delta\mathbf v|\approx v\,\Delta\theta=34.8\times0.084\approx2.9\ \mathrm{m/s}`;
export const EQ_S15 = String.raw`(r,\ \theta,\ z)`;
export const EQ_S16 = String.raw`\mathbf u=u_r\,\hat{\mathbf r}+u_\theta\,\hat{\boldsymbol\theta}+w\,\hat{\mathbf z}`;
export const EQ_S20 = String.raw`\overline{u_r}(r,z)=\frac{1}{72}\sum_{k=1}^{72}u_r(r,\theta_k,z)`;
export const EQ_S23 = String.raw`\tan(\text{inflow angle})=\frac{6.0}{20.1}\approx0.30\ \Rightarrow\ \approx17^\circ`;
export const EQ_S25 = String.raw`\mathbf a=-\frac{v^2}{r}\,\hat{\mathbf r}`;
/** split a constant at a separator that must exist (each half is drawn on its own line) */
export const cutAt = (s: string, at: string): [string, string] => { const i = s.indexOf(at); if (i < 0) throw new Error(`cutAt: ${at} not in ${s}`); return [s.slice(0, i), s.slice(i + at.length)]; };
