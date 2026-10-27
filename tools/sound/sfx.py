"""Synthesised sound effects for the AOFD movies (ours, CC0): rain, wind, breaking waves, surf, a splash, a stream,
bubbles, a drip, thunder, a storm bed, a soft whoosh and a gentle tick.

Every effect is a function ``fx(duration, intensity=0.5, seed=0, **params) -> float32 (n, 2)`` at 44.1 kHz, peak 0.5,
deterministic from ``seed``. Loudness is set later by the mixer (``tools/sound/mix.py``), so effects here are only
shaped, not levelled.

Methods (each a standard procedural-audio recipe, re-implemented here):

* **Shaped noise.** Pink/brown noise whose spectrum is multiplied, frame by frame, by a smooth gain surface G(f, t)
  (STFT, Hann 2048/512): this is how wind gusts, the crash and wash of a breaking wave, the roll of thunder and a
  whoosh are made (a time-varying band-pass whose centre and level follow a slow random "gust" curve).
* **Minnaert bubbles** (van den Doel 2005, "Physically based models for liquid sounds", ACM TAP 2:534): a bubble of
  radius r rings at f0 ≈ 3/r Hz, decays at d = 0.13/r + 0.0072 r^-1.5 s⁻¹ and its pitch rises, f(t) = f0 (1 + ξ d t).
  Many of them at Poisson times are rain drops, a brook, foam fizz, splashes and bubbles.
* **Thunder** (after Few 1969 and Farnell, *Designing Sound*, 2010): a lightning channel is many short N-wave bursts
  arriving from different distances, so the sound is a cloud of low-passed noise bursts smeared over seconds; a near
  strike adds a sharp tearing crack; distance removes the highs (air absorption) and the crack.

Run with the main venv::

    .venv/Scripts/python.exe tools/sound/sfx.py list
    .venv/Scripts/python.exe tools/sound/sfx.py render rain_heavy --duration 10 --intensity 0.8 --seed 3 --out x.wav
    .venv/Scripts/python.exe tools/sound/sfx.py demo --out-dir outputs/sound/sfx
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import numpy as np
from scipy import signal

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
    from sound.common import (SR, add_at, adsr_exp, band, bp, brown, fade, highpass_gain, hp, lowpass_gain, lp, pan,
                              pink, reverb, shape, smooth_random, write_wav)
else:
    from .common import (SR, add_at, adsr_exp, band, bp, brown, fade, highpass_gain, hp, lowpass_gain, lp, pan, pink,
                         reverb, shape, smooth_random, write_wav)


# ========================================================================================================= helpers
def _n(duration: float) -> int:
    return max(1, int(round(duration * SR)))


def _finish(x: np.ndarray, fade_in: float = 0.05, fade_out: float = 0.2, peak: float = 0.5,
            hp_hz: float = 32.0) -> np.ndarray:
    """High-pass at 32 Hz (no DC, no sub-sonic rumble that only eats headroom), short fades so the edges never
    click, peak-normalise."""
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    x = hp(x, hp_hz, order=4)
    x = fade(x, fade_in, fade_out)
    return (peak * x / (np.max(np.abs(x)) + 1e-12)).astype(np.float32)


def _env_at(frames_t: np.ndarray, env: np.ndarray) -> np.ndarray:
    """Sample a per-sample envelope at STFT frame times."""
    return np.interp(frames_t, np.arange(len(env)) / SR, env)


def minnaert(f0: float, xi: float = 0.1, max_s: float = 0.12) -> np.ndarray:
    """One bubble (van den Doel 2005): radius r = 3/f0 m, damping d = 0.13/r + 0.0072 r^-1.5, rising pitch
    f(t) = f0 (1 + ξ d t); unit amplitude, starts at phase 0 (no click)."""
    r = 3.0 / f0
    d = 0.13 / r + 0.0072 * r ** -1.5
    n = int(min(max_s, 7.0 / d) * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f0 * (t + 0.5 * xi * d * t ** 2)) * np.exp(-d * t)
    x[-int(0.002 * SR):] *= np.linspace(1, 0, int(0.002 * SR))
    return x


def poisson_times(rng: np.random.Generator, n: int, rate: float, env: np.ndarray | None = None) -> np.ndarray:
    """Sample indices of a Poisson process of mean ``rate`` events/s, thinned by ``env`` (0…1 per sample)."""
    k = rng.poisson(rate * n / SR)
    idx = np.sort(rng.integers(0, n, k))
    if env is not None:
        idx = idx[rng.uniform(size=len(idx)) < env[idx]]
    return idx


def bubble_field(n: int, rng: np.random.Generator, rate: float, f_lo: float, f_hi: float, xi: float = 0.1,
                 env: np.ndarray | None = None, amp_sigma: float = 0.6, nbins: int = 28, size_bias: float = 0.0
                 ) -> np.ndarray:
    """Many Minnaert bubbles at Poisson times: frequencies log-uniform in [f_lo, f_hi] (tilted towards small bubbles
    by ``size_bias`` > 0), log-normal amplitudes, bigger bubbles louder. Rendered fast by binning the frequencies and
    convolving each bin's impulse train with that bin's bubble."""
    idx = poisson_times(rng, n, rate, env)
    out = np.zeros(n)
    if not len(idx):
        return out
    u = rng.uniform(size=len(idx)) ** (1.0 + size_bias)
    lf = np.log(f_lo) + (np.log(f_hi) - np.log(f_lo)) * (1 - u)
    edges = np.linspace(np.log(f_lo), np.log(f_hi), nbins + 1)
    b = np.clip(np.digitize(lf, edges) - 1, 0, nbins - 1)
    amp = rng.lognormal(0, amp_sigma, len(idx)) * (f_lo / np.exp(lf)) ** 0.3
    for k in range(nbins):
        sel = b == k
        if not np.any(sel):
            continue
        imp = np.zeros(n)
        np.add.at(imp, idx[sel], amp[sel])
        fk = float(np.exp(0.5 * (edges[k] + edges[k + 1])))
        out += signal.oaconvolve(imp, minnaert(fk * rng.uniform(0.98, 1.02), xi))[:n]
    return out


def gust_curve(n: int, rng: np.random.Generator, kind: str) -> np.ndarray:
    """Wind strength 0…1 per sample. gentle: slow wandering; gusty: a base with gusts (rise 1.5–3 s, fall 2.5–6 s)
    every 4–10 s; howling: stronger base, bigger gusts."""
    base = {"gentle": (0.45, 0.75), "gusty": (0.25, 0.45), "howling": (0.45, 0.65)}[kind]
    g = smooth_random(n, rng, 0.12, *base)
    if kind == "gentle":
        return g
    t = np.arange(n) / SR
    tg = rng.uniform(0.5, 3.0)
    while tg < n / SR:
        rise, fall = rng.uniform(1.5, 3.0), rng.uniform(2.5, 6.0)
        amp = rng.uniform(0.3, 0.55) if kind == "gusty" else rng.uniform(0.25, 0.4)
        u = t - tg
        shape_ = np.where(u < 0, 0, np.where(u < rise, np.sin(0.5 * np.pi * u / rise) ** 2,
                                             np.exp(-(u - rise) / (fall / 2.5))))
        g = g + amp * shape_
        tg += rng.uniform(4.0, 10.0)
    return np.clip(g, 0, 1.0)


# ========================================================================================================= effects
def rain(duration: float, intensity: float = 0.5, seed: int = 0) -> np.ndarray:
    """Rain: a pink hiss (brighter and louder as it rains harder) plus Minnaert drop 'plinks' and tiny impact
    ticks at Poisson times, independent per channel; heavy rain adds a low surface roar. intensity 0.2 = drizzle,
    0.5 = steady, 0.9 = downpour."""
    rng = np.random.default_rng([seed, 101])
    n = _n(duration)
    I = float(np.clip(intensity, 0.05, 1.0))
    out = np.zeros((n, 2))
    common_hiss = pink(n, rng)
    for ch in range(2):
        hiss = 0.6 * common_hiss + 0.8 * pink(n, rng)
        fc = 3000 + 3500 * I
        hiss = shape(hiss, lambda f, t: highpass_gain(f, 350.0) * lowpass_gain(f, fc, 1.5)
                     * (0.7 + 0.5 * band(f, 2500 + 1500 * I, 1.0)))
        hiss *= smooth_random(n, rng, 0.3, 0.8, 1.0)
        hiss *= 0.06 + 0.5 * I ** 1.5
        drops = bubble_field(n, rng, 25 + 700 * I ** 2, 1300, 5200, xi=0.12, size_bias=0.5)
        if I > 0.5:                                                    # a few bigger drops on puddles
            drops += 1.4 * bubble_field(n, rng, 20 * (I - 0.5), 600, 1400, xi=0.15)
        tick_imp = np.zeros(n)
        ti = poisson_times(rng, n, 40 + 900 * I ** 2)
        tick_imp[ti] = rng.lognormal(0, 0.7, len(ti))
        tick_k = bp(rng.standard_normal(int(0.003 * SR)), 2000, 9000) * np.hanning(int(0.003 * SR))
        ticks = signal.oaconvolve(tick_imp, tick_k)[:n]
        x = hiss / (np.std(hiss) + 1e-12) * (0.25 + 0.75 * I)
        x += 0.09 * drops / (np.std(drops) + 1e-12)
        x += 0.07 * ticks / (np.std(ticks) + 1e-12)
        if I > 0.6:
            roar = lp(brown(n, rng), 450) * (I - 0.6) * 1.2
            x += roar
        out[:, ch] = x
    return _finish(lp(out, 9000), 0.3, 0.5)


def rain_light(duration: float, intensity: float = 0.25, seed: int = 0) -> np.ndarray:
    """Light rain / drizzle (rain at intensity ≈ 0.25)."""
    return rain(duration, intensity, seed)


def rain_heavy(duration: float, intensity: float = 0.85, seed: int = 0) -> np.ndarray:
    """Heavy rain / downpour (rain at intensity ≈ 0.85)."""
    return rain(duration, intensity, seed)


def wind(duration: float, intensity: float = 0.5, seed: int = 0, kind: str = "gusty") -> np.ndarray:
    """Wind: pink + brown noise through a soft band-pass whose level AND centre follow a gust curve (stronger gust →
    louder and brighter, centre ≈ 350 Hz → 1.3 kHz). 'howling' adds two narrow resonances (whistling round edges)
    that glide with the gusts, and a low buffeting rumble. Left and right have their own gusts, offset in time."""
    rng = np.random.default_rng([seed, 202])
    n = _n(duration)
    I = float(np.clip(intensity, 0.05, 1.0))
    out = np.zeros((n, 2))
    g0 = gust_curve(n, rng, kind)
    for ch in range(2):
        g = np.roll(g0, int(rng.uniform(0.2, 0.6) * SR)) if ch else g0
        g = 0.7 * g + 0.3 * smooth_random(n, rng, 0.25, 0.0, 1.0) * g
        src = 0.7 * pink(n, rng) + 0.5 * brown(n, rng)
        c0, c1 = 300 + 150 * I, 900 + 700 * I

        def G(f, t, g=g):
            gt = _env_at(t, g)
            centre = c0 * (c1 / c0) ** gt
            return (0.1 + gt) ** 1.6 * band(f, centre, 1.1) * highpass_gain(f, 60.0)
        x = shape(src, G)
        if kind == "howling":
            for k, (lo, hi) in enumerate(((330, 900), (520, 1400))):
                wsrc = rng.standard_normal(n)

                def H(f, t, g=g, lo=lo, hi=hi):
                    gt = _env_at(t, g)
                    return gt ** 4 * band(f, lo * (hi / lo) ** gt, 0.05)       # whistles only in the gusts
                whistle = shape(wsrc, H)
                x += (0.5 - 0.15 * k) * whistle / (np.std(whistle) + 1e-12) * np.std(x)
            x += 0.7 * lp(brown(n, rng), 140) * g * np.std(x)
        out[:, ch] = x
    return _finish(lp(out, 8000), 0.8, 1.0)


def wind_gentle(duration: float, intensity: float = 0.35, seed: int = 0) -> np.ndarray:
    """A gentle breeze."""
    return wind(duration, intensity, seed, "gentle")


def wind_gusty(duration: float, intensity: float = 0.6, seed: int = 0) -> np.ndarray:
    """Gusty wind."""
    return wind(duration, intensity, seed, "gusty")


def wind_howling(duration: float, intensity: float = 0.85, seed: int = 0) -> np.ndarray:
    """Howling gale with whistling resonances."""
    return wind(duration, intensity, seed, "howling")


def _wave_gain(waves: list[dict], distant: bool):
    """G(f, t) for a set of breaking waves. Each wave: approach rumble (low, rising for ~2 s), the crash (broadband,
    0.15–0.4-s rise, its brightness falling from ~5 kHz to 1.5 kHz) and the wash (hiss above ~700 Hz that drains away
    over 3–5 s)."""
    def G(f, t):
        acc = np.zeros(np.broadcast_shapes(f.shape, t.shape))
        for w in waves:
            u = t - w["t"]
            A = w["a"]
            appr = np.where((u > -2.2) & (u < 0.4), np.sin(0.5 * np.pi * np.clip((u + 2.2) / 2.2, 0, 1)) ** 2, 0)
            appr = appr * np.where(u > 0, np.exp(-u / 0.3), 1)
            r = np.clip(u / w["rise"], 0, 1)                         # 0 → 1 over the curl and fall of the lip
            crash = np.where(u < 0, 0, np.sin(0.5 * np.pi * r) ** 2 * np.exp(-np.maximum(u - w["rise"], 0) / 1.1))
            fc = np.where(u < w["rise"], 700 + 4300 * r ** 1.5,
                          1500 + 3500 * np.exp(-np.maximum(u - w["rise"], 0) / 1.2))
            wash = np.where(u < 0.3, 0, np.exp(-(u - 0.3) / w["wash"]) * np.minimum((u - 0.3) / 0.6, 1))
            fw = 1800 + 4500 * np.exp(-np.maximum(u - 0.3, 0) / 2.0)
            if distant:
                fc, fw = fc * 0.45, fw * 0.45
            acc = acc + A * (0.55 * appr * lowpass_gain(f, 260.0, 2)
                             + crash * lowpass_gain(f, fc, 1.5) * highpass_gain(f, 70.0)
                             + 0.55 * wash * lowpass_gain(f, fw, 1.5) * highpass_gain(f, 650.0))
        return acc
    return G


def _wave_list(rng: np.random.Generator, duration: float, first: float, period: tuple[float, float],
               I: float) -> list[dict]:
    out, t = [], first
    while t < duration - 1.0:
        out.append({"t": t, "a": rng.uniform(0.6, 1.0) * (0.5 + 0.5 * I), "rise": rng.uniform(0.45, 0.9),
                    "wash": rng.uniform(2.5, 4.5)})
        t += rng.uniform(*period)
    return out


def waves_breaking(duration: float, intensity: float = 0.6, seed: int = 0, first: float = 2.0,
                   period: tuple[float, float] = (7.0, 11.0)) -> np.ndarray:
    """Ocean waves breaking near the listener: each wave rumbles in, crashes (first crash begins at ``first`` s and
    peaks 0.45–0.9 s later; the next
    every 7–11 s) and its foam washes away with a fizz of tiny bubbles. Use ``first`` to land a crash on a frame."""
    rng = np.random.default_rng([seed, 303])
    n = _n(duration)
    I = float(np.clip(intensity, 0.05, 1.0))
    waves = _wave_list(rng, duration, first, tuple(period), I)
    out = np.zeros((n, 2))
    t = np.arange(n) / SR
    fizz_env = np.zeros(n)
    for w in waves:
        u = t - w["t"] - 0.3
        fizz_env += np.where(u > 0, np.exp(-u / (w["wash"] * 0.8)) * np.minimum(u / 0.4, 1), 0) * w["a"]
    fizz_env /= max(fizz_env.max(), 1e-9)
    for ch in range(2):
        x = shape(0.6 * pink(n, rng) + 0.6 * brown(n, rng), _wave_gain(waves, distant=False))
        x /= np.std(x) + 1e-12
        fz = bubble_field(n, rng, 2500, 2500, 9000, xi=0.1, env=fizz_env, size_bias=0.5)
        x += 0.18 * fz / (np.std(fz) + 1e-12) * np.sqrt(np.mean(fizz_env))
        out[:, ch] = x
    return _finish(lp(out, 10000), 0.5, 1.5)


def surf(duration: float, intensity: float = 0.5, seed: int = 0) -> np.ndarray:
    """Surf on a beach heard from a little way back: a continuous low roar with overlapping, softer and darker
    waves every 4–7 s."""
    rng = np.random.default_rng([seed, 404])
    n = _n(duration)
    I = float(np.clip(intensity, 0.05, 1.0))
    waves = _wave_list(rng, duration, rng.uniform(0.5, 2.0), (4.0, 7.0), I)
    out = np.zeros((n, 2))
    for ch in range(2):
        x = shape(0.6 * pink(n, rng) + 0.6 * brown(n, rng), _wave_gain(waves, distant=True))
        x /= np.std(x) + 1e-12
        roar = shape(pink(n, rng), lambda f, t: band(f, 380.0, 1.1))
        roar = roar / (np.std(roar) + 1e-12) * smooth_random(n, rng, 0.1, 0.6, 1.0)
        out[:, ch] = x + 0.55 * roar
    return _finish(lp(out, 7000), 1.0, 1.5)


def splash(duration: float = 2.0, intensity: float = 0.6, seed: int = 0, at: float = 0.05) -> np.ndarray:
    """Something dropping into water at ``at`` s: an impact burst, a low 'plop' bubble, a short spray and droplets
    falling back for ~1 s (fewer and fewer). Bigger ``intensity`` = bigger object."""
    rng = np.random.default_rng([seed, 505])
    n = _n(max(duration, 1.5))
    I = float(np.clip(intensity, 0.05, 1.0))
    out = np.zeros((n, 2))
    i0 = int(at * SR)
    m = int(0.6 * SR)
    t = np.arange(m) / SR
    impact = bp(rng.standard_normal(m), 250, 5000) * adsr_exp(m, 0.004, 0.06 + 0.06 * I)
    plop = minnaert(260 - 120 * I, xi=0.35, max_s=0.25)
    spray = bp(rng.standard_normal(m), 900, 7000) * adsr_exp(m, 0.02, 0.18 + 0.2 * I) \
        * smooth_random(m, rng, 40, 0.3, 1.0)
    core = np.zeros(m)
    core += 0.9 * impact / np.max(np.abs(impact))
    add_at(core, 0.8 * plop, int(0.006 * SR))
    core += 0.35 * spray / np.max(np.abs(spray))
    env = np.zeros(n)
    tt = np.arange(n) / SR - at - 0.15
    env[:] = np.where(tt > 0, np.exp(-tt / (0.35 + 0.3 * I)), 0)
    for ch in range(2):
        add_at(out[:, ch], core * rng.uniform(0.9, 1.0), i0)
        drops = bubble_field(n, rng, 120 + 150 * I, 700, 3200, xi=0.15, env=env, nbins=16)
        out[:, ch] += 0.35 * drops / (np.max(np.abs(drops)) + 1e-12)
    out = reverb(out, rng, seconds=1.2, decay=0.18, wet=0.18, tone_hz=5000)
    return _finish(out, 0.0, 0.15)


def drip(duration: float = 1.0, intensity: float = 0.5, seed: int = 0, at: float = 0.05) -> np.ndarray:
    """One water drop into a still pool: a single rising 'plink' (Minnaert bubble ~1–1.6 kHz) with a soft room."""
    rng = np.random.default_rng([seed, 606])
    n = _n(max(duration, 0.6))
    x = np.zeros(n)
    add_at(x, minnaert(rng.uniform(1000, 1600), xi=0.6, max_s=0.08), int(at * SR))
    tick = bp(rng.standard_normal(int(0.002 * SR)), 2000, 8000) * np.hanning(int(0.002 * SR)) * 0.15
    add_at(x, tick, int(at * SR))
    out = reverb(np.stack([x, x], axis=1), rng, seconds=1.5, decay=0.3, wet=0.3, tone_hz=4000)
    return _finish(out, 0.0, 0.1)


def stream(duration: float, intensity: float = 0.5, seed: int = 0) -> np.ndarray:
    """Flowing water / a brook: a babbling band of noise (300 Hz–3 kHz, flickering) plus a dense field of small
    rising bubbles (400–2500 Hz). More intensity = faster, fuller flow."""
    rng = np.random.default_rng([seed, 707])
    n = _n(duration)
    I = float(np.clip(intensity, 0.05, 1.0))
    out = np.zeros((n, 2))
    for ch in range(2):
        bed = shape(pink(n, rng), lambda f, t: band(f, 800 + 400 * I, 1.0) * highpass_gain(f, 150.0))
        bed = bed / (np.std(bed) + 1e-12) * smooth_random(n, rng, 9.0, 0.55, 1.0)
        bub = bubble_field(n, rng, 120 + 450 * I, 400, 2500, xi=0.12, env=smooth_random(n, rng, 2.0, 0.4, 1.0))
        out[:, ch] = (0.25 + 0.2 * I) * bed + bub / (np.std(bub) + 1e-12)
    return _finish(lp(out, 7000), 0.5, 0.8)


def bubbles(duration: float, intensity: float = 0.5, seed: int = 0) -> np.ndarray:
    """Bubbles rising under water: short trains of 3–8 big bubbles (150–700 Hz, clearly pitched, rising) over a
    muffled underwater hush."""
    rng = np.random.default_rng([seed, 808])
    n = _n(duration)
    I = float(np.clip(intensity, 0.05, 1.0))
    out = np.zeros((n, 2))
    hush = lp(brown(n, rng), 350)
    hush = hush / (np.std(hush) + 1e-12) * 0.05
    tb = rng.uniform(0.2, 0.8)
    while tb < duration - 0.5:
        p = rng.uniform(0.25, 0.75)
        f_base = rng.uniform(180, 450)
        for k in range(int(rng.integers(3, 9))):
            b = minnaert(f_base * rng.uniform(0.85, 1.5), xi=0.25, max_s=0.25) * rng.uniform(0.5, 1.0)
            add_at(out, pan(b, p + rng.uniform(-0.08, 0.08)), int((tb + k * rng.uniform(0.05, 0.14)) * SR))
        tb += rng.uniform(0.6, 2.5) / (0.4 + I)
    out += hush[:, None]
    out = reverb(out, rng, seconds=1.0, decay=0.15, wet=0.25, tone_hz=1500)
    return _finish(lp(out, 5000), 0.2, 0.4)


def thunder(duration: float = 8.0, intensity: float = 0.7, seed: int = 0, distance: str = "near",
            at: float = 0.2) -> np.ndarray:
    """Thunder starting at ``at`` s. The channel is a cloud of short noise bursts (the N-waves from each piece of the
    lightning channel) arriving over seconds, low-passed by distance; near = a tearing crack then a heavy roll
    (≈ 6 s), far = a soft, dark rumble that swells and rolls away (≈ 8 s), no crack."""
    rng = np.random.default_rng([seed, 909])
    near = distance == "near"
    n = _n(max(duration, 3.0))
    I = float(np.clip(intensity, 0.05, 1.0))
    out = np.zeros((n, 2))
    i0 = int(at * SR)
    span = 3.5 if near else 6.0
    nb = int((70 if near else 45) * (0.6 + 0.6 * I))
    for ch in range(2):
        x = np.zeros(n)
        arr = rng.gamma(1.6 if near else 2.6, span / (5.0 if near else 3.5), nb)   # arrival delays (s)
        for d in arr:
            L = int(rng.uniform(0.04, 0.35) * SR)
            burst = brown(L, rng) * np.hanning(L) * np.exp(-d / (span * 0.7)) * rng.lognormal(0, 0.5)
            add_at(x, burst, i0 + int(d * SR))
        roll_len = n - i0
        tail = np.zeros(n)
        tt = np.arange(roll_len) / SR
        rise = 0.05 if near else 0.9
        tail[i0:] = brown(roll_len, rng) * np.minimum(tt / rise, 1) * np.exp(-tt / (span * 0.55)) \
            * smooth_random(roll_len, rng, 1.5, 0.4, 1.0)
        x = x / (np.std(x) + 1e-12) + 0.8 * tail / (np.std(tail) + 1e-12)
        x = lp(x, 700 if near else 220, order=2)
        x += 0.6 * bp(brown(n, rng), 40, 110) * np.concatenate([np.zeros(i0), np.exp(-np.arange(roll_len) / SR / span)])
        if near:
            crack = np.zeros(n)
            tc = 0.0
            for k in range(int(rng.integers(3, 6))):
                L = int(rng.uniform(0.015, 0.05) * SR)
                c = bp(rng.standard_normal(L), 300, 6000) * np.hanning(L) * rng.uniform(0.5, 1.0) * 0.8 ** k
                add_at(crack, c, i0 + int(tc * SR))
                tc += rng.uniform(0.015, 0.05)
            x += 1.6 * I * crack / (np.max(np.abs(crack)) + 1e-12) * np.max(np.abs(x[i0:i0 + int(0.5 * SR)]))
        out[:, ch] = x
    out = reverb(out, rng, seconds=4.0, decay=1.0, wet=0.35 if near else 0.5, tone_hz=1500)
    return _finish(out, 0.0, 1.0, hp_hz=42.0)


def thunder_near(duration: float = 7.0, intensity: float = 0.7, seed: int = 0) -> np.ndarray:
    """A near strike: crack, then a heavy roll."""
    return thunder(duration, intensity, seed, "near")


def thunder_far(duration: float = 9.0, intensity: float = 0.6, seed: int = 0) -> np.ndarray:
    """Distant thunder: a dark rumble that swells and rolls away."""
    return thunder(duration, intensity, seed, "far")


def storm_bed(duration: float, intensity: float = 0.7, seed: int = 0) -> np.ndarray:
    """A storm bed: gusty wind + heavy rain + distant thunder every 12–25 s (first at ~3 s)."""
    rng = np.random.default_rng([seed, 1010])
    n = _n(duration)
    I = float(np.clip(intensity, 0.05, 1.0))
    x = 0.8 * wind(duration, 0.5 + 0.4 * I, seed + 1, "gusty").astype(np.float64)
    x += 0.9 * rain(duration, 0.5 + 0.45 * I, seed + 2).astype(np.float64)
    tb = rng.uniform(2.5, 4.0)
    k = 0
    while tb < duration - 3.0:
        th = thunder(min(9.0, duration - tb), 0.5 + 0.4 * I, seed + 10 + k, "far", at=0.0).astype(np.float64)
        add_at(x, 0.9 * th, int(tb * SR))
        tb += rng.uniform(12.0, 25.0)
        k += 1
    return _finish(x, 1.0, 1.5)


def whoosh(duration: float = 1.2, intensity: float = 0.5, seed: int = 0, direction: str = "lr") -> np.ndarray:
    """A soft whoosh for a camera move: noise through a band-pass that sweeps up (250 Hz → ~1.6 kHz) and back down,
    a bell-shaped swell peaking at 55 % of the duration, panned across (lr / rl / centre)."""
    rng = np.random.default_rng([seed, 1111])
    n = _n(max(duration, 0.3))
    I = float(np.clip(intensity, 0.05, 1.0))
    T = n / SR
    peak = 0.55 * T

    def prof(t):
        u = np.clip(t / T, 0, 1)
        return np.where(t < peak, np.sin(0.5 * np.pi * t / peak) ** 2,
                        np.cos(0.5 * np.pi * np.clip((t - peak) / (T - peak), 0, 1)) ** 2) * (u <= 1)

    def G(f, t):
        p = prof(t)
        centre = 250 * ((900 + 900 * I) / 250) ** p
        return (p ** 1.5) * band(f, centre, 0.75)
    x = shape(pink(n, rng), G)
    p_lr = {"lr": np.linspace(0.15, 0.85, n), "rl": np.linspace(0.85, 0.15, n), "centre": np.full(n, 0.5)}[direction]
    out = pan(x, p_lr)
    return _finish(lp(out, 6000), 0.02, 0.05)


def tick(duration: float = 0.2, intensity: float = 0.5, seed: int = 0, rate: float = 0.0,
         accent_every: int = 0) -> np.ndarray:
    """A gentle wooden tick (two modes, 1.9 kHz and 4.3 kHz over a 700-Hz body, ~25 ms). With ``rate`` > 0, a tick
    every 1/rate s for the whole duration (a counter), each slightly different; ``accent_every`` = k makes every k-th
    tick a little louder and lower."""
    rng = np.random.default_rng([seed, 1212])
    n = _n(max(duration, 0.08))
    out = np.zeros(n)

    def one(acc: bool) -> np.ndarray:
        m = int(0.06 * SR)
        t = np.arange(m) / SR
        s = 0.92 if acc else 1.0
        x = (np.sin(2 * np.pi * 1900 * s * rng.uniform(0.98, 1.02) * t) * np.exp(-t / 0.006)
             + 0.35 * np.sin(2 * np.pi * 4300 * s * t) * np.exp(-t / 0.0025)
             + 0.6 * np.sin(2 * np.pi * 700 * s * t) * np.exp(-t / 0.012))
        return x * adsr_exp(m, 0.0008, 100.0) * (1.0 if acc else 0.75) * rng.uniform(0.9, 1.0)
    times = [0.01] if rate <= 0 else list(np.arange(0.01, n / SR - 0.06, 1.0 / rate))
    for k, tt in enumerate(times):
        add_at(out, one(bool(accent_every) and k % accent_every == 0), int(tt * SR))
    out = reverb(np.stack([out, out], axis=1), rng, seconds=0.6, decay=0.08, wet=0.12, tone_hz=6000)
    return _finish(lp(out, 9000), 0.0, 0.02)


# ======================================================================================================= registry
EFFECTS = {
    "rain": rain, "rain_light": rain_light, "rain_heavy": rain_heavy,
    "wind": wind, "wind_gentle": wind_gentle, "wind_gusty": wind_gusty, "wind_howling": wind_howling,
    "waves_breaking": waves_breaking, "surf": surf, "splash": splash, "drip": drip, "stream": stream,
    "bubbles": bubbles, "thunder": thunder, "thunder_near": thunder_near, "thunder_far": thunder_far,
    "storm_bed": storm_bed, "whoosh": whoosh, "tick": tick,
}
BEDS = {"rain", "rain_light", "rain_heavy", "wind", "wind_gentle", "wind_gusty", "wind_howling", "surf", "stream",
        "storm_bed", "waves_breaking"}
CAPTIONS = {"rain": "[rain]", "rain_light": "[light rain]", "rain_heavy": "[heavy rain]", "wind": "[wind]",
            "wind_gentle": "[gentle breeze]", "wind_gusty": "[gusty wind]", "wind_howling": "[wind howling]",
            "waves_breaking": "[waves breaking]", "surf": "[surf]", "splash": "[splash]", "drip": "[drip]",
            "stream": "[water flowing]", "bubbles": "[bubbles]", "thunder": "[thunder]",
            "thunder_near": "[thunder crack]", "thunder_far": "[distant thunder]", "storm_bed": "[storm]",
            "whoosh": None, "tick": None}

DEMO = [("rain_light", 12, {}), ("rain_heavy", 12, {}), ("wind_gentle", 15, {}), ("wind_gusty", 18, {}),
        ("wind_howling", 18, {}), ("waves_breaking", 22, {}), ("surf", 18, {}), ("splash", 2.5, {}), ("drip", 1.2, {}),
        ("stream", 12, {}), ("bubbles", 10, {}), ("thunder_near", 8, {}), ("thunder_far", 10, {}),
        ("storm_bed", 30, {}), ("whoosh", 1.4, {}), ("tick", 0.25, {}), ("tick", 4.0, {"rate": 4, "accent_every": 4})]


def render(name: str, duration: float, intensity: float | None = None, seed: int = 0, **params) -> np.ndarray:
    fn = EFFECTS[name]
    kw = dict(params)
    if intensity is not None:
        kw["intensity"] = intensity
    return fn(duration, seed=seed, **kw)


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("list")
    r = sub.add_parser("render")
    r.add_argument("name", choices=sorted(EFFECTS))
    r.add_argument("--duration", type=float, required=True)
    r.add_argument("--intensity", type=float)
    r.add_argument("--seed", type=int, default=0)
    r.add_argument("--param", action="append", default=[], help="key=value (numbers parsed)")
    r.add_argument("--out", type=Path, required=True)
    d = sub.add_parser("demo")
    d.add_argument("--out-dir", type=Path, default=Path("outputs/sound/sfx"))
    d.add_argument("--only", action="append")
    a = ap.parse_args()
    if a.cmd == "list":
        for k, fn in EFFECTS.items():
            print(f"{k:16s} {'bed ' if k in BEDS else 'one '} {(fn.__doc__ or '').strip().splitlines()[0]}")
        return 0
    if a.cmd == "render":
        kw = {}
        for p in a.param:
            k, v = p.split("=", 1)
            try:
                kw[k] = float(v)
            except ValueError:
                kw[k] = v
        write_wav(a.out, render(a.name, a.duration, a.intensity, a.seed, **kw))
        print(a.out)
        return 0
    rows = []
    for name, dur, kw in DEMO:
        if a.only and name not in a.only:
            continue
        x = render(name, dur, None, 1, **kw)
        stem = name + ("_counter" if kw.get("rate") else "")
        out = a.out_dir / f"{stem}.wav"
        write_wav(out, x)
        rows.append({"effect": name, "file": str(out), "seconds": dur, "params": kw})
        print(f"{stem:16s} -> {out}")
    (a.out_dir / "sfx_demos.json").write_text(json.dumps(rows, indent=1), encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
