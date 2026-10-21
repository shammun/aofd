import React, { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { useCurrentFrame } from "remotion";
import { HOUSE, TERM, TermFamily, ramp } from "./palette";

export type EqTerm = { tex: string; family?: TermFamily; label?: string; at?: number };

/** Render TeX with KaTeX to an HTML string; throws on a TeX error so movie_qa / the render fail loudly. */
export const tex = (src: string, display = true): string =>
  katex.renderToString(src, { displayMode: display, throwOnError: true, output: "html", strict: "ignore" });

/**
 * One equation line with its book number. Either a plain `latex` string, or `terms` revealed one at a time
 * (term k fades in at frame `terms[k].at`, coloured by its family, with an optional label underneath = anatomy strip).
 * `highlight` (a term index) brightens one term while the others dim.
 */
export const EqLine: React.FC<{
  latex?: string; terms?: EqTerm[]; number?: string; size?: number; highlight?: number; y?: number;
}> = ({ latex, terms, number, size = 64, highlight, y = 50 }) => {
  const f = useCurrentFrame();
  const html = useMemo(() => (latex ? tex(latex) : ""), [latex]);
  const termHtml = useMemo(() => (terms || []).map((t) => tex(t.tex, false)), [terms]);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: `${y}%`, transform: "translateY(-50%)",
      display: "flex", justifyContent: "center", alignItems: "center", gap: 40, color: HOUSE.ink, fontSize: size,
      fontFamily: HOUSE.font }}>
      {latex ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null}
      {terms ? (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 18 }}>
          {terms.map((t, i) => {
            const o = ramp(f, t.at ?? 0, (t.at ?? 0) + 12);
            const dim = highlight !== undefined && highlight !== i ? 0.35 : 1;
            const col = t.family ? TERM[t.family] : HOUSE.ink;
            return (
              <div key={i} style={{ opacity: o * dim, textAlign: "center", color: col }}>
                <div dangerouslySetInnerHTML={{ __html: termHtml[i] }} />
                {t.label ? <div style={{ fontSize: size * 0.32, marginTop: 10, borderTop: `3px solid ${col}`,
                  paddingTop: 6, color: col }}>{t.label}</div> : null}
              </div>
            );
          })}
        </div>
      ) : null}
      {number ? <div style={{ fontSize: size * 0.55, color: HOUSE.muted }}>({number})</div> : null}
    </div>
  );
};
