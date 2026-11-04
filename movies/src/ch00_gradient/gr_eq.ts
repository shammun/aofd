// Every on-screen equation of the storyboard, verbatim (String.raw constants: the QA equations gate greps this file;
// provenance (vallis_eq / page_png) lives in the storyboard only and is never drawn). One constant per scene that shows it.

export const EQ_S06 = String.raw`\nabla h=\hat{\mathbf x}\,\frac{\partial h}{\partial x}+\hat{\mathbf y}\,\frac{\partial h}{\partial y}`;
export const EQ_S07 = String.raw`\nabla=\hat{\mathbf x}\,\frac{\partial}{\partial x}+\hat{\mathbf y}\,\frac{\partial}{\partial y}+\hat{\mathbf z}\,\frac{\partial}{\partial z},\qquad (\nabla f)_i=\frac{\partial f}{\partial x_i}`;
export const EQ_S10 = String.raw`\frac{\partial h}{\partial s}=\frac{\partial h}{\partial x}\cos\alpha+\frac{\partial h}{\partial y}\sin\alpha=\nabla h\cdot\hat{\mathbf n}`;
export const EQ_S11 = String.raw`\nabla h\cdot\hat{\mathbf n}=|\nabla h|\,|\hat{\mathbf n}|\cos\theta=|\nabla h|\cos\theta`;
export const EQ_S22 = String.raw`\nabla F=\mathbf i\,\frac{1}{a\cos\varphi}\frac{\partial F}{\partial\lambda}+\mathbf j\,\frac{1}{a}\frac{\partial F}{\partial\varphi}+\mathbf k\,\frac{\partial F}{\partial r}`;
export const EQ_S25 = String.raw`-\Big[p\big(x+\delta x\big)-p(x)\Big]\,\delta A=-\frac{\partial p}{\partial x}\,\delta x\,\delta A=-\frac{\partial p}{\partial x}\,\delta V`;
export const EQ_S26 = String.raw`\mathbf F_p=-\frac{1}{\rho}\nabla p`;
export const EQ_S32 = String.raw`\frac{\partial p}{\partial z}=-\rho g`;
export const EQ_S34 = String.raw`\mathbf v\cdot\nabla T=|\mathbf v|\,\frac{\partial T}{\partial s}`;
