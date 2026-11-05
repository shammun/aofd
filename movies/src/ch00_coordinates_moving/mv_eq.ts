// Every on-screen equation of the storyboard (movies/ch00/ch00_coordinates_moving/storyboard.yaml), verbatim (String.raw
// constants: the QA equations gate greps this file; provenance lives in the storyboard only and is never drawn).
// Generated once from the storyboard by the motion-builder (2026-11-05); edit only together with the storyboard.
export const EQ_S02 = String.raw`\frac{DT}{Dt}=\frac{\partial T}{\partial t}+\mathbf v\cdot\nabla T`;
export const EQ_S03 = String.raw`x=x'+U\,t,\qquad t'=t`;
export const EQ_S04 = String.raw`u=u'+U\qquad\Longrightarrow\qquad \mathbf v=\mathbf U+\mathbf v'`;
export const EQ_S05 = String.raw`\frac{du}{dt}=\frac{dU}{dt}+\frac{du'}{dt}=\frac{du'}{dt}`;
export const EQ_S06 = String.raw`\frac{\partial\mathbf v}{\partial t}+(\mathbf v\cdot\nabla)\mathbf v=\frac{\partial\mathbf v'}{\partial t'}+(\mathbf v'\cdot\nabla')\mathbf v'`;
export const EQ_S07 = String.raw`\frac{\partial u}{\partial t}+u\,\frac{\partial u}{\partial x}=\frac{\partial u'}{\partial t'}+u'\,\frac{\partial u'}{\partial x'}`;
export const EQ_S08 = String.raw`\mathbf U=(14.6\sin71^\circ,\ 14.6\cos71^\circ)\approx(13.8,\ 4.8)\ \text{m/s}`;
export const EQ_S10 = String.raw`\mathbf v=\mathbf U+\mathbf v'\ \Rightarrow\ \mathbf v'=\mathbf v-\mathbf U`;
export const EQ_S13 = String.raw`x'=x-U\,t,\qquad \tau=t`;
export const EQ_S14 = String.raw`\frac{\partial p}{\partial t}=\frac{\partial p}{\partial\tau}-\mathbf U\cdot\nabla p`;
export const EQ_S16 = String.raw`-3.8=-0.6-3.2\ \ \text{hPa/h}`;
/** split a constant at a separator that must exist (each half is drawn on its own line) */
export const cutAt = (s: string, at: string): [string, string] => { const i = s.indexOf(at); if (i < 0) throw new Error(`cutAt: ${at} not in ${s}`); return [s.slice(0, i), s.slice(i + at.length)]; };
