// Every on-screen equation of the storyboard (movies/ch00/ch00_coordinates_maps/storyboard.yaml), verbatim (String.raw
// constants: the QA equations gate greps this file; provenance lives in the storyboard only and is never drawn).
// Generated once from the storyboard by the motion-builder (2026-11-05); edit only together with the storyboard.
export const EQ_S02 = String.raw`h_\varphi=a,\qquad h_\lambda=a\cos\varphi`;
export const EQ_S04 = String.raw`x=a\,\lambda,\qquad y=a\,\varphi`;
export const EQ_S05 = String.raw`k=\dfrac{2\pi a}{2\pi a\cos\varphi}=\dfrac{1}{\cos\varphi}`;
export const EQ_S06 = String.raw`\nabla T=\mathbf i\,\dfrac{1}{a\cos\varphi}\dfrac{\partial T}{\partial\lambda}+\mathbf j\,\dfrac{1}{a}\dfrac{\partial T}{\partial\varphi}`;
export const EQ_S08 = String.raw`dy=\dfrac{a\,d\varphi}{\cos\varphi}`;
export const EQ_S09 = String.raw`y\approx a\sum\dfrac{\Delta\varphi}{\cos\varphi_{\text{mid}}}`;
export const EQ_S10 = String.raw`y=a\,\ln\tan\!\left(\dfrac{\pi}{4}+\dfrac{\varphi}{2}\right)`;
export const EQ_S11 = String.raw`\dfrac{y(61^\circ)-y(59^\circ)}{2^\circ\ \text{in rad}}\approx\dfrac{a}{\cos 60^\circ}`;
export const EQ_S12 = String.raw`\dfrac{\text{west step}}{\text{south step}}=\tan(258.5^\circ-180^\circ)\approx4.9`;
export const EQ_S13 = String.raw`\text{area stretch}=k\times k=\dfrac{1}{\cos^2\varphi}`;
export const EQ_S19 = String.raw`u_\theta=u,\qquad u_r=-v`;
export const EQ_S20 = String.raw`u_r=\mathbf u\cdot\hat{\mathbf r},\qquad u_\theta=\mathbf u\cdot\hat{\boldsymbol\theta}`;
export const EQ_S22 = String.raw`y=a\,\ln\tan\!\left(\dfrac{\pi}{4}+\dfrac{\varphi}{2}\right)`;
/** split a constant at a separator that must exist (each half is drawn on its own line) */
export const cutAt = (s: string, at: string): [string, string] => { const i = s.indexOf(at); if (i < 0) throw new Error(`cutAt: ${at} not in ${s}`); return [s.slice(0, i), s.slice(i + at.length)]; };
