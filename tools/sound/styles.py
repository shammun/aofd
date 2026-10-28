"""Music styles for the AOFD movies: one procedural score per movie, matched to its content (HOUSE_STYLE §8).

Every style is a recipe (key, chord progression, tempo/pulse, synthesised instruments, register, filter, reverb) run
by one composer, ``compose(style, duration, seed)``. Everything is synthesised here (wavetable and additive voices,
FM, modal percussion, shaped noise), so the music is ours and CC0. Same style + seed → the same samples.

``maths-calm`` is the original ``tools/music.py`` pad and delegates to ``music.compose`` unchanged (seed 7 is the
dot-product and cross-product movies' score).

Run with the main venv::

    .venv/Scripts/python.exe tools/sound/styles.py list
    .venv/Scripts/python.exe tools/sound/styles.py demo --out-dir outputs/sound/demos [--duration 40] [--style NAME]
    .venv/Scripts/python.exe tools/music.py score --narration narration.wav --out-dir <dir> --style air-flowing --seed 11
"""
from __future__ import annotations

import argparse
import json
import sys
from dataclasses import dataclass, field
from pathlib import Path

import numpy as np
from scipy import signal

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
    from sound.common import (SR, add_at, adsr_exp, band, bp, coloured, fade, highpass_gain, hz, integrated_lufs, lp,
                              hp, pan, reverb, shape, smooth_random, write_wav)
else:
    from .common import (SR, add_at, adsr_exp, band, bp, coloured, fade, highpass_gain, hz, integrated_lufs, lp, hp, pan,
                         reverb, shape, smooth_random, write_wav)


# ================================================================================================== instruments
WT_N = 4096


def _table(amps: dict[int, float], f: float, f_max: float = 6000.0, rng: np.random.Generator | None = None) -> np.ndarray:
    """One cycle of a wavetable with harmonic k at amplitude amps[k], dropping any harmonic above ``f_max`` (no
    aliasing, no harsh top). Phases random (from rng) so stacked voices do not phase-lock."""
    ph = np.arange(WT_N + 1) / WT_N
    tab = np.zeros(WT_N + 1)
    for k, a in amps.items():
        if k * f < f_max:
            tab += a * np.sin(2 * np.pi * k * ph + (rng.uniform(0, 2 * np.pi) if rng is not None else 0.0))
    return tab


def _play(tab: np.ndarray, freq: np.ndarray | float, n: int, phase0: float) -> np.ndarray:
    """Read a wavetable at instantaneous frequency ``freq`` (scalar or per sample)."""
    inc = np.broadcast_to(np.asarray(freq, dtype=np.float64) / SR, (n,))
    ph = (phase0 + np.cumsum(inc)) % 1.0
    return np.interp(ph * WT_N, np.arange(WT_N + 1), tab)


def _harmonics(timbre: str, f: float) -> dict[int, float]:
    if timbre == "sine":            # the maths-calm pad: fundamental + a little 2nd and 3rd
        return {1: 1.0, 2: 0.25, 3: 0.08}
    if timbre == "strings":         # soft, band-limited saw rolled off above ~2.5 kHz
        return {k: (1.0 / k) * np.exp(-k * f / 2500.0) for k in range(1, 24)}
    if timbre == "warm":            # triangle-like (odd 1/k²) + a touch of even harmonics
        return {k: (1.0 / k ** 2) * (1.0 if k % 2 else 0.18) for k in range(1, 10)}
    if timbre == "glass":           # pure, with an octave and a faint twelfth
        return {1: 1.0, 2: 0.32, 3: 0.08, 4: 0.05}
    if timbre == "hollow":          # clarinet-ish odd harmonics, soft
        return {1: 1.0, 3: 0.3, 5: 0.12, 7: 0.05}
    raise KeyError(timbre)


def pad_note(t: np.ndarray, f: float, rng: np.random.Generator, timbre: str, detune: float = 6.0,
             vibrato: float = 0.0, tremolo: float = 0.0) -> np.ndarray:
    """A sustained note: three voices detuned by ±``detune`` cents, optional vibrato (fraction of f) and tremolo
    depth, and a slow swell. ``t`` is the absolute time axis of the window (s)."""
    n = len(t)
    out = np.zeros(n)
    for cents in (-detune, 0.0, detune):
        fd = f * 2 ** (cents / 1200)
        if vibrato:
            rate = rng.uniform(4.6, 5.6)
            fd = fd * (1 + vibrato * np.sin(2 * np.pi * rate * t + rng.uniform(0, 2 * np.pi)))
        out += _play(_table(_harmonics(timbre, f), f, rng=rng), fd, n, rng.uniform())
    swell = 0.75 + 0.25 * np.sin(2 * np.pi * rng.uniform(0.05, 0.12) * t + rng.uniform(0, 2 * np.pi))
    if tremolo:
        swell = swell * (1 - tremolo * (0.5 + 0.5 * np.sin(2 * np.pi * rng.uniform(3.5, 4.5) * t)))
    return out * swell / 3


# ---- one-shot instruments: f (Hz), velocity 0..1, rng → mono array
def bell(f: float, vel: float, rng: np.random.Generator) -> np.ndarray:
    """The maths-calm bell: sine + a quiet inharmonic partial (×2.76), 10-ms attack, 1.8-s decay."""
    n = int(5 * SR)
    t = np.arange(n) / SR
    env = adsr_exp(n, 0.01, 1.8)
    return vel * env * (np.sin(2 * np.pi * f * t) + 0.18 * np.sin(2 * np.pi * 2.76 * f * t) * np.exp(-t / 0.5))


def celesta(f: float, vel: float, rng: np.random.Generator) -> np.ndarray:
    """Glassy celesta: fundamental + octave + a fast-fading 4th partial (the 'ting'), long soft decay."""
    n = int(4 * SR)
    t = np.arange(n) / SR
    env = adsr_exp(n, 0.004, 1.3)
    x = np.sin(2 * np.pi * f * t) + 0.22 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t / 0.6)
    if 4 * f < 7000:
        x += 0.10 * np.sin(2 * np.pi * 4.0 * f * t) * np.exp(-t / 0.08)
    return vel * env * x


def marimba(f: float, vel: float, rng: np.random.Generator) -> np.ndarray:
    """Modal marimba bar: partials 1 : 3.98 : 9.9 (tuned bar) with fast-decaying overtones and a soft mallet thump."""
    n = int(1.6 * SR)
    t = np.arange(n) / SR
    d = 0.55 * (220.0 / f) ** 0.4                       # lower bars ring longer
    x = np.sin(2 * np.pi * f * t) * np.exp(-t / d)
    for ratio, amp, dk in ((3.98, 0.22, 0.25), (9.9, 0.05, 0.08)):
        if ratio * f < 7000:
            x += amp * np.sin(2 * np.pi * ratio * f * t) * np.exp(-t / (d * dk))
    att = int(0.002 * SR)
    x[:att] *= np.linspace(0, 1, att)
    thump = lp(rng.standard_normal(int(0.012 * SR)), 1200) * np.hanning(int(0.012 * SR)) * 0.15
    x[: len(thump)] += thump
    x *= adsr_exp(n, 0.001, 10.0)                      # only the 10-ms end taper
    return vel * x


def fm_piano(f: float, vel: float, rng: np.random.Generator) -> np.ndarray:
    """Electric-piano-like FM: 1:1 modulator with an index that falls from ~1.6 to 0.25 (bright → mellow), plus a
    faint quickly-fading tine an octave and a fifth up. Softer when ``vel`` is low (index scales with velocity)."""
    n = int(3.5 * SR)
    t = np.arange(n) / SR
    idx = (0.25 + 1.35 * vel * np.exp(-t / 0.35))
    x = np.sin(2 * np.pi * f * t + idx * np.sin(2 * np.pi * f * t))
    if 3 * f < 6000:
        x += 0.06 * np.sin(2 * np.pi * 3 * f * t) * np.exp(-t / 0.05)
    return vel * adsr_exp(n, 0.004, 1.2 * (330.0 / f) ** 0.25) * x


def pluck(f: float, vel: float, rng: np.random.Generator, decay: float = 0.9) -> np.ndarray:
    """Plucked string (additive): harmonics 1/k^1.3, higher ones dying faster, 3-ms attack."""
    n = int(min(5 * decay + 0.2, 4.0) * SR)
    t = np.arange(n) / SR
    x = np.zeros(n)
    for k in range(1, 9):
        if k * f > 5500:
            break
        x += (1 / k ** 1.3) * np.sin(2 * np.pi * k * f * t + rng.uniform(0, 0.3)) * np.exp(-t * (1 + 0.6 * (k - 1)) / decay)
    return vel * adsr_exp(n, 0.003, 100.0) * x


def pluck_muted(f: float, vel: float, rng: np.random.Generator) -> np.ndarray:
    """Palm-muted pluck for pulsing ostinatos (short and dark)."""
    return lp(pluck(f, vel, rng, decay=0.22), 1400)


def soft_kick(f: float, vel: float, rng: np.random.Generator) -> np.ndarray:
    """A felt-beater bass drum: sine falling 85 → 45 Hz, 0.35-s decay, no click."""
    n = int(0.9 * SR)
    t = np.arange(n) / SR
    fr = 45 + 40 * np.exp(-t / 0.05)
    return vel * adsr_exp(n, 0.003, 0.22) * np.sin(2 * np.pi * np.cumsum(fr) / SR)


def heartbeat(f: float, vel: float, rng: np.random.Generator) -> np.ndarray:
    """Two soft thumps (lub-dub), the second quieter."""
    a = soft_kick(f, vel, rng)
    out = np.zeros(int(1.2 * SR))
    add_at(out, a, 0)
    add_at(out, 0.6 * a, int(0.24 * SR))
    return out


def frame_drum(f: float, vel: float, rng: np.random.Generator) -> np.ndarray:
    """Hand drum: a 105 → 92 Hz body with a short low-passed skin noise."""
    n = int(0.6 * SR)
    t = np.arange(n) / SR
    fr = 92 + 13 * np.exp(-t / 0.03)
    body = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t / 0.16)
    skin = lp(rng.standard_normal(n), 1500) * np.exp(-t / 0.025) * 0.35
    return vel * adsr_exp(n, 0.002, 100.0) * (body + skin)


def shaker(f: float, vel: float, rng: np.random.Generator) -> np.ndarray:
    """Soft shaker: band-passed noise (2.5–6 kHz), 10-ms swell, 45-ms decay."""
    n = int(0.18 * SR)
    x = bp(rng.standard_normal(n), 2500, 6000)
    return vel * 0.5 * adsr_exp(n, 0.01, 0.045) * x


def woodblock(f: float, vel: float, rng: np.random.Generator) -> np.ndarray:
    """A small, soft wooden tock (two modes, 15-ms decay)."""
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * 820 * t) * np.exp(-t / 0.018) + 0.3 * np.sin(2 * np.pi * 2150 * t) * np.exp(-t / 0.006)
    return vel * adsr_exp(n, 0.0015, 100.0) * x


INSTRUMENTS = {"bell": bell, "celesta": celesta, "marimba": marimba, "fm_piano": fm_piano, "pluck": pluck,
               "pluck_muted": pluck_muted, "soft_kick": soft_kick, "heartbeat": heartbeat, "frame_drum": frame_drum,
               "shaker": shaker, "woodblock": woodblock}


# ======================================================================================================= styles
@dataclass
class Style:
    name: str
    description: str
    suits: str
    key: str
    chords: list[list[int]]           # MIDI notes, lowest (bass) first
    chord_s: float                    # seconds per chord
    xfade_s: float
    tempo: str                        # human description of tempo / pulse
    pads: list[dict]                  # {timbre, gain, octave, detune, vibrato, tremolo}
    sub: float = 0.4                  # sub-bass one octave under the root (relative gain)
    layers: list[dict] = field(default_factory=list)
    lp_hz: float = 2400.0
    reverb: dict = field(default_factory=dict)
    fade_in: float = 5.0
    fade_out: float = 8.0


def _bar(bpm: float, beats: int = 4) -> float:
    return beats * 60.0 / bpm


STYLES: dict[str, Style] = {}


def _add(s: Style) -> None:
    STYLES[s.name] = s


_add(Style(
    "maths-calm", "Slow ambient pad: four soft chords, sub-bass and sparse bells (the original tools/music.py score).",
    "mathematics: vectors, calculus, primers (Chapter 0 maths movies)", "D major",
    [[50, 57, 61, 64, 66], [47, 54, 57, 62, 64], [43, 54, 59, 62, 69], [45, 52, 59, 61, 64]], 9.0, 3.0,
    "no pulse; 9-s chords", [{"timbre": "sine", "gain": 0.55}], 0.45,
    [{"kind": "sparse", "inst": "bell", "notes": [74, 76, 78, 81, 83, 86], "gap": [2.2, 4.6], "gain": 0.10}]))

B84 = _bar(84)
_add(Style(
    "air-flowing", "Light and moving: string pad, a lilting plucked arpeggio and a faint breath of air noise.",
    "weather basics, winds, the atmosphere in motion, fronts, jets", "G major (Lydian colour)",
    [[43, 50, 54, 57, 59], [40, 47, 54, 55, 59], [36, 43, 52, 54, 59], [38, 45, 52, 57, 59]], 2 * B84, 1.6,
    "84 bpm, eighth-note arpeggio", [{"timbre": "strings", "gain": 0.42, "octave": 12, "vibrato": 0.0015}], 0.22,
    [{"kind": "arp", "inst": "pluck", "steps": "x.xx.xx.x.xx.x.x", "step_s": 60 / 84 / 2, "octave": 24,
      "order": "updown", "gain": 0.36, "pan": "spread", "breath": 24.0},
     {"kind": "noise", "slope": -3.0, "centre": 900, "width": 0.9, "gain": 0.04, "rate": 0.12},
     {"kind": "sparse", "inst": "celesta", "notes": [79, 81, 83, 86, 88], "gap": [6.0, 11.0], "gain": 0.12}],
    lp_hz=4500, reverb={"seconds": 3.0, "decay": 0.7, "wet": 0.30, "tone_hz": 4000}))

_add(Style(
    "ocean-deep", "Slow, low and wide: dark strings, a low drone, a slow sea-swell of filtered noise, rare deep "
    "electric-piano notes.", "the ocean, deep circulation, abyssal flow, thermohaline, waves at depth",
    "B-flat minor", [[34, 41, 49, 53, 60], [30, 37, 46, 49, 53], [37, 44, 48, 51, 56], [32, 39, 46, 51, 58]], 14.0, 5.0,
    "no pulse; 14-s chords", [{"timbre": "strings", "gain": 0.5, "octave": 12, "detune": 9.0}], 0.35,
    [{"kind": "drone", "notes": [46, 53], "timbre": "hollow", "gain": 0.21},
     {"kind": "noise", "slope": -6.0, "centre": 260, "width": 1.0, "gain": 0.075, "rate": 0.09, "swell": 10.0},
     {"kind": "sparse", "inst": "fm_piano", "notes": [58, 61, 63, 65, 68, 70], "gap": [5.0, 9.0], "gain": 0.45,
      "vel": [0.35, 0.6]}],
    lp_hz=1600, reverb={"seconds": 6.0, "decay": 1.6, "wet": 0.5, "tone_hz": 2200}, fade_in=7.0, fade_out=10.0))

B96 = _bar(96)
_add(Style(
    "storm-tense", "Minor, pulsing, restrained: a muted low ostinato, a soft heartbeat drum, tremolo strings, "
    "rare high tension notes.", "storms, cyclones, instability, fronts with weather, convection",
    "D minor", [[38, 45, 50, 53, 64], [34, 41, 50, 57, 64], [43, 50, 55, 58, 62], [45, 52, 55, 57, 62]], 2 * B96, 0.8,
    "96 bpm, eighth-note pulse", [{"timbre": "strings", "gain": 0.36, "octave": 12, "tremolo": 0.18}], 0.30,
    [{"kind": "arp", "inst": "pluck_muted", "steps": "x.x.x.xxx.x.x.xx", "step_s": 60 / 96 / 2, "octave": 0,
      "order": "root5", "gain": 0.75, "pan": "centre", "breath": 20.0},
     {"kind": "perc", "inst": "heartbeat", "steps": "x.......x.......", "step_s": 60 / 96 / 2, "gain": 0.65},
     {"kind": "sparse", "inst": "celesta", "notes": [74, 76, 77, 81], "gap": [7.0, 12.0], "gain": 0.15}],
    lp_hz=2200, reverb={"seconds": 2.6, "decay": 0.6, "wet": 0.3, "tone_hz": 2800}, fade_in=4.0))

B100 = _bar(100)
_add(Style(
    "tropics-warm", "Warm and gently swaying: triangle-tone pad, a marimba in a 3-3-2 rhythm, a soft hand drum and "
    "shaker.", "the tropics, Hadley cell, monsoons, ENSO, the ITCZ, warm seas", "F major",
    [[41, 48, 52, 55, 57], [38, 45, 52, 53, 57], [34, 41, 50, 57, 60], [36, 43, 53, 58, 62]], 2 * B100, 1.2,
    "100 bpm, tresillo (3-3-2)", [{"timbre": "warm", "gain": 0.5, "octave": 12}], 0.30,
    [{"kind": "arp", "inst": "marimba", "steps": "x..x..x.x..x..x.", "step_s": 60 / 100 / 2, "octave": 12,
      "order": "updown", "gain": 0.57, "pan": "spread", "breath": 28.0},
     {"kind": "perc", "inst": "frame_drum", "steps": "x..x..x.........", "step_s": 60 / 100 / 2, "gain": 0.40},
     {"kind": "perc", "inst": "shaker", "steps": "xxxxxxxxxxxxxxxx", "step_s": 60 / 100 / 2, "gain": 0.35,
      "accent": "x.x.x.x.x.x.x.x."}],
    lp_hz=3800, reverb={"seconds": 2.0, "decay": 0.45, "wet": 0.25, "tone_hz": 3500}))

_add(Style(
    "ice-polar", "Sparse and glassy: high pure-tone pad in E Lydian, rare celesta notes, a long cold reverb.",
    "sea ice, polar regions, the cryosphere, polar vortex, cold air masses", "E Lydian",
    [[40, 47, 54, 56, 63], [37, 44, 54, 56, 59], [33, 45, 52, 56, 63], [35, 42, 49, 54, 61]], 12.0, 5.0,
    "no pulse; 12-s chords", [{"timbre": "glass", "gain": 0.36, "octave": 12, "detune": 4.0}], 0.12,
    [{"kind": "sparse", "inst": "celesta", "notes": [76, 78, 80, 82, 83, 87, 88], "gap": [3.0, 6.5], "gain": 0.31},
     {"kind": "noise", "slope": -3.0, "centre": 2600, "width": 0.7, "gain": 0.02, "rate": 0.08}],
    lp_hz=5000, reverb={"seconds": 6.0, "decay": 1.5, "wet": 0.5, "tone_hz": 4500}, fade_in=6.0, fade_out=10.0))

_add(Style(
    "planet-wide", "Expansive: wide strings over a deep root, a high soft pad, and an unhurried electric-piano "
    "phrase every few chords.", "general circulation, climate, the whole Earth, energy balance at planetary scale",
    "C major / A minor", [[36, 43, 52, 55, 62], [33, 45, 52, 55, 62], [29, 41, 48, 57, 59], [31, 43, 50, 57, 62]],
    10.0, 4.0, "no pulse; 10-s chords",
    [{"timbre": "strings", "gain": 0.45, "octave": 12, "detune": 8.0, "vibrato": 0.001},
     {"timbre": "sine", "gain": 0.22, "octave": 24}], 0.42,
    [{"kind": "phrase", "inst": "fm_piano", "scale": [72, 74, 76, 79, 81, 84], "every": [8.0, 14.0],
      "notes": [3, 5], "step_s": 0.75, "gain": 0.48, "vel": [0.35, 0.55]}],
    lp_hz=3500, reverb={"seconds": 5.0, "decay": 1.15, "wet": 0.45, "tone_hz": 3200}, fade_in=6.0, fade_out=9.0))

B92 = _bar(92)
_add(Style(
    "data-curious", "Light and inquisitive: A Dorian, a marimba asking short questions with rests, a soft pad, a "
    "rare wood tock.", "maps and data, reading figures, reanalysis, observations, statistics", "A Dorian",
    [[45, 52, 55, 59, 60], [38, 45, 54, 57, 60], [41, 48, 52, 57, 60], [40, 47, 55, 59, 62]], 2 * B92, 1.0,
    "92 bpm, syncopated eighths with rests", [{"timbre": "sine", "gain": 0.45, "octave": 12}], 0.30,
    [{"kind": "arp", "inst": "marimba", "steps": "x.x...x.x?..x...", "step_s": 60 / 92 / 2, "octave": 12,
      "order": "random", "gain": 0.63, "pan": "spread", "breath": 22.0},
     {"kind": "perc", "inst": "woodblock", "steps": "......x.........", "step_s": 60 / 92 / 2, "gain": 0.25,
      "prob": 0.5}],
    lp_hz=4000, reverb={"seconds": 2.4, "decay": 0.55, "wet": 0.3, "tone_hz": 3500}))

_add(Style(
    "rotation-turning", "Circular: an electric-piano arpeggio that cycles up and down and slowly circles the stereo "
    "field, in a 6/8 lilt.", "rotating frames, Coriolis, angular momentum, inertial oscillations", "B-flat major",
    [[34, 46, 50, 53, 57], [31, 43, 50, 53, 57], [39, 46, 50, 55, 57], [41, 48, 53, 55, 60]], 4.0, 0.8,
    "6/8 at 60 dotted-quarter (eighth = 1/3 s)", [{"timbre": "sine", "gain": 0.42, "octave": 12}], 0.32,
    [{"kind": "arp", "inst": "fm_piano", "steps": "xxxxxxxxxxxx", "step_s": 1.0 / 3.0, "octave": 12,
      "order": "updown", "gain": 0.48, "pan": "rotate", "rotate_s": 8.0, "vel": [0.3, 0.45], "breath": 30.0}],
    lp_hz=3600, reverb={"seconds": 3.0, "decay": 0.75, "wet": 0.32, "tone_hz": 3500}))

_add(Style(
    "sun-radiant", "Bright and warm, gently rising: E major warm pad, slow rising four-note arpeggios that "
    "breathe in and out, sparse bells.", "radiation, the Sun, energy balance, heating, the greenhouse effect",
    "E major", [[40, 52, 56, 59, 66], [39, 51, 54, 59, 63], [37, 49, 52, 56, 59], [33, 45, 52, 59, 61]], 8.0, 2.5,
    "60 bpm, rising quarter notes then rest",
    [{"timbre": "warm", "gain": 0.42, "octave": 12}, {"timbre": "sine", "gain": 0.2, "octave": 24}], 0.32,
    [{"kind": "arp", "inst": "celesta", "steps": "xxxx............", "step_s": 0.5, "octave": 24, "order": "up",
      "gain": 0.20, "pan": "spread"},
     {"kind": "sparse", "inst": "bell", "notes": [76, 80, 83, 85, 88], "gap": [5.0, 9.0], "gain": 0.12}],
    lp_hz=4200, reverb={"seconds": 4.0, "decay": 1.0, "wet": 0.38, "tone_hz": 3800}))

# ch00_vectors_index_notation (#1a, 2026-10-28; storyboard audio.music.spec): E-flat major, 9/8 at 66 dotted-quarter
# (eighth = 60/66/3 s; three groups of three eighths, nine per bar like the nine terms u_j du_i/dx_j). Each chord holds
# only root-third-fifth above the bass, so a three-note "up" cell is always root → third → fifth. The celesta plays a
# cell on the first group of every bar; a soft marimba answers one octave lower on the last group of every second bar.
E9_8 = 60.0 / 66.0 / 3.0
_add(Style(
    "index-lattice", "Calm and countable: E-flat major in 9/8, celesta root-third-fifth cells answered every second bar "
    "by a soft marimba an octave lower, over a quiet glass pad (no drums).",
    "index notation, vectors and components, counting and lattices (Chapter 0 notation movies)", "E-flat major",
    [[39, 51, 55, 58], [36, 48, 51, 55], [32, 44, 48, 51], [34, 46, 50, 53]], 10.0, 3.0,
    "9/8 at 66 dotted-quarter (eighth ≈ 0.303 s)", [{"timbre": "glass", "gain": 0.5 * 0.36, "octave": 12, "detune": 5.0}], 0.28,
    [{"kind": "arp", "inst": "celesta", "steps": "xxx......", "step_s": E9_8, "octave": 24, "order": "up",
      "gain": 0.22, "pan": "spread", "vel": [0.55, 0.8], "breath": 26.0},
     {"kind": "arp", "inst": "marimba", "steps": "...............xxx", "step_s": E9_8, "octave": 12, "order": "up",
      "gain": 0.30, "pan": "centre", "vel": [0.45, 0.65], "breath": 30.0}],
    lp_hz=6000, reverb={"seconds": 4.2, "decay": 1.05, "wet": 0.28, "tone_hz": 3800}, fade_in=5.0, fade_out=8.0))


# ===================================================================================================== composer
def _chord_env(t: np.ndarray, k: int, cs: float, xf: float) -> np.ndarray:
    start, end = k * cs, (k + 1) * cs
    up = np.clip((t - (start - xf / 2)) / xf, 0, 1)
    down = np.clip(((end + xf / 2) - t) / xf, 0, 1)
    return np.sin(0.5 * np.pi * np.minimum(up, down)) ** 2


def chord_at(st: Style, time_s: float) -> list[int]:
    return st.chords[int(time_s // st.chord_s) % len(st.chords)]


def _pads(st: Style, n: int, rng: np.random.Generator) -> np.ndarray:
    t = np.arange(n) / SR
    out = np.zeros((n, 2))
    cs, xf = st.chord_s, st.xfade_s
    for k in range(int(np.ceil(n / SR / cs)) + 1):
        notes = st.chords[k % len(st.chords)]
        lo = max(0, int((k * cs - xf / 2) * SR))
        hi = min(n, int(((k + 1) * cs + xf / 2) * SR) + 1)
        if lo >= hi:
            continue
        ts = t[lo:hi]
        w = _chord_env(ts, k, cs, xf)
        for pd in st.pads:
            for i, m in enumerate(notes):
                if i == 0 and pd.get("octave", 0) >= 12:
                    continue                                     # the bass note stays in the sub, not the pad
                v = pad_note(ts, hz(m + pd.get("octave", 0)), rng, pd["timbre"], pd.get("detune", 6.0),
                             pd.get("vibrato", 0.0), pd.get("tremolo", 0.0))
                v *= w * pd["gain"] * (0.9 if i == 0 else 1.0)
                p = 0.5 + 0.42 * (i / (len(notes) - 1) - 0.5)
                out[lo:hi] += pan(v, p)
        if st.sub:
            # the bass note itself (55–110 Hz, audible on small speakers), lifted an octave if it is below 55 Hz
            sub = st.sub * np.sin(2 * np.pi * hz(notes[0] if notes[0] >= 33 else notes[0] + 12) * ts) * w
            out[lo:hi] += sub[:, None] * np.sqrt(0.5)
    return lp(out, st.lp_hz)


def _note_pool(st: Style, notes: list[int], ly: dict) -> list[int]:
    if ly.get("order") == "root5":
        r = notes[0] + 12 if notes[0] < 40 else notes[0]
        return [r, r + 7, r + 12, r + 7]
    upper = sorted(notes[1:])
    return [m + ly.get("octave", 0) - 12 for m in upper]


def _layer(st: Style, ly: dict, n: int, rng: np.random.Generator) -> np.ndarray:
    dur = n / SR
    out = np.zeros((n, 2))
    kind = ly["kind"]
    if kind in ("arp", "perc"):
        inst = INSTRUMENTS[ly["inst"]]
        steps = ly["steps"]
        accent = ly.get("accent")
        dt = ly["step_s"]
        breath = None
        if ly.get("breath"):                                       # slow rise and fall of the layer's level
            per = ly["breath"]
            knots = rng.uniform(0.45, 1.0, int(dur / per) + 3)
            breath = lambda tt: (lambda j, u: knots[j] + (knots[j + 1] - knots[j]) * (0.5 - 0.5 * np.cos(np.pi * u)))(
                int(tt // per), (tt % per) / per)                     # noqa: E731
        idx, j = 0, 0
        t0 = ly.get("start", 1.0)
        while True:
            tt = t0 + j * dt
            if tt > dur - 4.0:
                break
            c = steps[j % len(steps)]
            j += 1
            play = c == "x" or (c == "?" and rng.uniform() < 0.5)
            if play and ly.get("prob") is not None and rng.uniform() > ly["prob"]:
                play = False
            if not play:
                continue
            vlo, vhi = ly.get("vel", [0.7, 1.0])
            vel = rng.uniform(vlo, vhi)
            if accent is not None:
                vel *= 1.0 if accent[(j - 1) % len(accent)] == "x" else 0.55
            if breath is not None:
                vel *= breath(tt)
            if kind == "arp":
                pool = _note_pool(st, chord_at(st, tt), ly)
                order = ly.get("order", "up")
                if order == "random":
                    m = pool[rng.integers(len(pool))]
                elif order == "updown":
                    cyc = pool + pool[-2:0:-1]
                    m = cyc[idx % len(cyc)]
                else:
                    m = pool[idx % len(pool)]
                idx += 1
                f = hz(m)
            else:
                f = 0.0
            x = inst(f, vel, rng)
            jitter = int(rng.normal(0, 0.006) * SR)
            mode = ly.get("pan", "centre")
            if mode == "spread":
                p = rng.uniform(0.25, 0.75)
            elif mode == "rotate":
                p = 0.5 + 0.38 * np.sin(2 * np.pi * tt / ly.get("rotate_s", 8.0))
            else:
                p = 0.5
            add_at(out, pan(x * ly["gain"], p), int(tt * SR) + jitter)
    elif kind == "sparse":
        inst = INSTRUMENTS[ly["inst"]]
        tb = 4.0
        while tb < dur - 6.0:
            vlo, vhi = ly.get("vel", [1.0, 1.0])
            x = inst(hz(ly["notes"][rng.integers(len(ly["notes"]))]), rng.uniform(vlo, vhi), rng)
            add_at(out, pan(x * ly["gain"], rng.uniform(0.25, 0.75)), int(tb * SR))
            tb += rng.uniform(*ly["gap"])
    elif kind == "phrase":
        inst = INSTRUMENTS[ly["inst"]]
        sc = ly["scale"]
        tb = rng.uniform(*ly["every"]) * 0.5 + 3.0
        while tb < dur - 8.0:
            k = int(rng.integers(len(sc)))
            for q in range(int(rng.integers(ly["notes"][0], ly["notes"][1] + 1))):
                k = int(np.clip(k + rng.choice([-1, 1, 1, 2]), 0, len(sc) - 1))
                x = inst(hz(sc[k]), rng.uniform(*ly.get("vel", [0.5, 0.7])), rng)
                add_at(out, pan(x * ly["gain"], 0.35 + 0.3 * q / 4), int((tb + q * ly["step_s"]) * SR))
            tb += rng.uniform(*ly["every"])
    elif kind == "drone":
        t = np.arange(n) / SR
        for m in ly["notes"]:
            v = pad_note(t, hz(m), rng, ly.get("timbre", "sine"), detune=5.0) * ly["gain"]
            v *= smooth_random(n, rng, 1 / 15.0, 0.6, 1.0)
            out += pan(v, rng.uniform(0.35, 0.65))
    elif kind == "noise":
        for ch in range(2):
            x = coloured(n, rng, ly.get("slope", -3.0))
            c = ly["centre"]
            x = shape(x, lambda f, t: band(f, c, ly["width"]) * highpass_gain(f, 40.0))
            env = smooth_random(n, rng, ly.get("rate", 0.1), 0.25, 1.0)
            if ly.get("swell"):
                ph = rng.uniform(0, 2 * np.pi)
                env *= 0.55 + 0.45 * np.sin(2 * np.pi * np.arange(n) / SR / ly["swell"] + ph) ** 2
            out[:, ch] = x / (np.std(x) + 1e-12) * env * ly["gain"]
    else:
        raise KeyError(kind)
    return out


def compose(style: str, duration: float, seed: int = 7) -> np.ndarray:
    """A music bed for ``style`` as float32 stereo at SR, peak-normalised to 0.5, with the style's fades.

    ``maths-calm`` returns exactly ``tools/music.py``'s ``compose(duration, seed)``. Every other layer draws from its
    own child random stream (seed, layer number), so changing one layer never changes another.
    """
    if style == "maths-calm":
        sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
        import music
        return music.compose(duration, seed)
    st = STYLES[style]
    n = int(round(duration * SR))
    x = _pads(st, n, np.random.default_rng([seed, 0]))
    peak_pad = np.max(np.abs(x)) + 1e-12
    for i, ly in enumerate(st.layers, start=1):
        x += peak_pad * _layer(st, ly, n, np.random.default_rng([seed, i]))
    rv = dict(seconds=3.5, decay=0.9, wet=0.35, tone_hz=3000.0)
    rv.update(st.reverb)
    x = reverb(x, np.random.default_rng([seed, 99]), **rv)
    x = hp(x, 28.0)                                            # no DC, no sub-sonic rumble
    x = lp(x, 9000.0, order=4)                                 # no harsh top
    x = fade(x, min(st.fade_in, duration / 4), min(st.fade_out, duration / 3))
    return (0.5 * x / (np.max(np.abs(x)) + 1e-12)).astype(np.float32)


def info(style: str) -> dict:
    st = STYLES[style]
    return {"style": st.name, "key": st.key, "tempo": st.tempo, "description": st.description, "suits": st.suits,
            "source": "tools/sound/styles.py (procedural synthesis, our own code)", "licence": "CC0-1.0"}


# ============================================================================================================ CLI
def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("list")
    d = sub.add_parser("demo")
    d.add_argument("--out-dir", type=Path, default=Path("outputs/sound/demos"))
    d.add_argument("--duration", type=float, default=40.0)
    d.add_argument("--style", action="append", help="style name (repeatable); default all")
    d.add_argument("--seed", type=int, default=7)
    d.add_argument("--lufs", type=float, default=-20.0, help="demo loudness (a bed in a movie sits at -28)")
    a = ap.parse_args()
    if a.cmd == "list":
        for s in STYLES.values():
            print(f"{s.name:18s} {s.key:24s} {s.tempo}\n{'':18s} {s.description}\n{'':18s} suits: {s.suits}")
        return 0
    rows = []
    for name in a.style or list(STYLES):
        x = compose(name, a.duration, a.seed).astype(np.float64)
        g = 10 ** ((a.lufs - integrated_lufs(x)) / 20)
        out = a.out_dir / f"{name}.wav"
        write_wav(out, x * g)
        rows.append({"style": name, "file": str(out), "gain_db": round(20 * np.log10(g), 2)})
        print(f"{name:18s} -> {out}")
    (a.out_dir / "demos.json").write_text(json.dumps(rows, indent=1), encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
