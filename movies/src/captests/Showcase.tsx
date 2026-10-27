// Narrated showcase of the capability tests (local review movie). Timeline: public/sc/showcase.json written by
// captests/_scripts/prep_showcase.py from the measured narration timing. Muted render; audio is muxed afterwards.
// House look: dark, type >= 44 px, the caption band y 880-1040 stays empty; media in x 60-1500, keywords at the right.
import React from "react";
import { AbsoluteFill, Img, Loop, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { K, Label, lerp, ramp, useJson } from "./kit";

export const SHOW_FRAMES = 17766;

type Media = { src: string; kind: "video" | "image"; frames?: number; w?: number; h?: number };
type Beat = { from: number; to: number; media: Media | null; key: string; kind: string; kw: string[] };
type Scene = { id: string; kind: string; from: number; to: number; beats: Beat[]; sentences: { f0: number; f1: number }[] };
type Show = { total: number; scenes: Scene[] };

const BOX = { x: 50, y: 60, w: 1360, h: 765 };

const Still: React.FC<{ m: Media; dur: number; pan: boolean }> = ({ m, dur, pan }) => {
  const f = useCurrentFrame();
  const t = Math.min(1, f / Math.max(1, dur));
  const w0 = m.w ?? 1920, h0 = m.h ?? 1080;
  if (pan) {
    const tall = h0 / w0 > BOX.h / BOX.w;
    const s = tall ? BOX.w / w0 : BOX.h / h0;
    const W = w0 * s, H = h0 * s;
    const u = ramp(f, 15, dur - 15);
    const x = tall ? BOX.x : BOX.x - (W - BOX.w) * u, y = tall ? BOX.y - (H - BOX.h) * u : BOX.y;
    return (<div style={{ position: "absolute", left: BOX.x, top: BOX.y, width: BOX.w, height: BOX.h, overflow: "hidden", background: "#0f1420" }}>
      <Img src={staticFile(m.src)} style={{ position: "absolute", left: x - BOX.x, top: y - BOX.y, width: W, height: H }} /></div>);
  }
  const s = Math.min(BOX.w / w0, BOX.h / h0);
  const z = lerp(1.0, 1.07, t);
  return (<div style={{ position: "absolute", left: BOX.x, top: BOX.y, width: BOX.w, height: BOX.h, overflow: "hidden" }}>
    <Img src={staticFile(m.src)} style={{ position: "absolute", left: (BOX.w - w0 * s) / 2, top: (BOX.h - h0 * s) / 2, width: w0 * s, height: h0 * s,
      transform: `scale(${z}) translate(${lerp(0, -12, t)}px, ${lerp(0, -8, t)}px)`, transformOrigin: "50% 45%" }} /></div>);
};

const Clip: React.FC<{ m: Media; dur: number }> = ({ m, dur }) => {
  const n = Math.max(2, m.frames ?? dur);
  const vid = <OffthreadVideo src={staticFile(m.src)} muted style={{ width: BOX.w, height: BOX.h }} />;
  return (<div style={{ position: "absolute", left: BOX.x, top: BOX.y, width: BOX.w, height: BOX.h, overflow: "hidden", borderRadius: 6 }}>
    {dur > n ? <Loop durationInFrames={n}>{vid}</Loop> : vid}</div>);
};

const Keywords: React.FC<{ kw: string[] }> = ({ kw }) => {
  const f = useCurrentFrame();
  // right column x 1440-1870: wrapped lines, first keyword 54 px, others 44 px (house floor), halo for legibility
  return (<div style={{ position: "absolute", left: 1440, top: 70, width: 430, display: "flex", flexDirection: "column", gap: 22 }}>
    {kw.map((k, i) => <div key={i} style={{ fontFamily: K.font, fontSize: i === 0 ? 54 : 44, fontWeight: i === 0 ? 700 : 600, lineHeight: 1.12,
      color: i === 0 ? K.key : K.slate, opacity: ramp(f, 8 + i * 10, 26 + i * 10), overflowWrap: "break-word",
      textShadow: "0 2px 8px rgba(0,0,0,0.85)" }}>{k}</div>)}
  </div>);
};

const BeatView: React.FC<{ b: Beat; sc: Scene }> = ({ b, sc }) => {
  const f = useCurrentFrame();
  const dur = b.to - b.from;
  const o = Math.min(ramp(f, 0, 12), 1 - ramp(f, dur - 6, dur));
  if (b.kind === "list") {
    const lines = b.kw;
    return (<AbsoluteFill>{lines.map((t, i) => {
      const s = sc.sentences[Math.min(i + 1, sc.sentences.length - 1)];
      const at = Math.max(0, (s ? s.f0 : sc.from) - sc.from - 6);
      return <Label key={i} x={160} y={90 + i * 118} s={60} c={i % 2 ? K.key : K.ink} w={600} o={ramp(f, at, at + 14)}>{`·  ${t}`}</Label>;
    })}</AbsoluteFill>);
  }
  if (b.kind === "end") {
    return (<AbsoluteFill>
      <Label x={960} y={300} s={68} c={K.key} anchor="middle" o={ramp(f, 0, 20)}>Every output, page and verdict:</Label>
      <Label x={960} y={430} s={54} c={K.gold} anchor="middle" o={ramp(f, 15, 35)}>{b.kw[0]}</Label>
      <Label x={960} y={540} s={48} c={K.slate} anchor="middle" o={ramp(f, 30, 50)}>open INDEX.html first</Label>
    </AbsoluteFill>);
  }
  if (!b.media) return null;
  return (<AbsoluteFill style={{ opacity: o }}>
    {b.media.kind === "video" ? <Clip m={b.media} dur={dur} /> : <Still m={b.media} dur={dur} pan={b.kind === "pan"} />}
    <Keywords kw={b.kw} />
  </AbsoluteFill>);
};

export const Showcase: React.FC = () => {
  const show = useJson<Show>("sc/showcase.json");
  const f = useCurrentFrame();
  if (!show) return null;
  return (
    <AbsoluteFill style={{ background: K.bg }}>
      {show.scenes.map((sc) => (
        <Sequence key={sc.id} from={sc.from} durationInFrames={sc.to - sc.from} layout="none">
          {sc.beats.map((b, j) => (
            <Sequence key={j} from={b.from - sc.from} durationInFrames={Math.max(1, b.to - b.from)} layout="none"><BeatView b={b} sc={sc} /></Sequence>
          ))}
          {sc.kind === "title" ? (
            <AbsoluteFill style={{ background: "rgba(23,31,51,0.55)" }}>
              <div style={{ position: "absolute", left: 100, top: 230, fontFamily: K.font, fontSize: 128, fontWeight: 800, lineHeight: 1.05,
                background: `linear-gradient(90deg, ${K.teal}, ${K.gold})`, WebkitBackgroundClip: "text", color: "transparent",
                opacity: ramp(f - sc.from, 5, 30) }}>Maps, globes<br />and motion</div>
              <Label x={104} y={540} s={68} c={K.key} o={ramp(f - sc.from, 30, 50)}>which tool for which picture</Label>
            </AbsoluteFill>
          ) : null}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
