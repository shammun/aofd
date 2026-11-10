"""Shared building blocks for the sound toolkit: noise colours, slow random modulation, time-varying spectral shaping,
filters, a synthetic stereo reverb, fades, panning, BS.1770 loudness (integrated, short-term, momentary) and WAV I/O.

All signals are float arrays at ``SR`` = 44.1 kHz; stereo arrays have shape (n, 2).
"""
from __future__ import annotations

from pathlib import Path

import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 44_100


# ----------------------------------------------------------------------------------------------------------- pitch
def hz(m: float) -> float:
    """MIDI note number → frequency in Hz (A4 = 69 = 440 Hz)."""
    return 440.0 * 2.0 ** ((m - 69) / 12)


# ----------------------------------------------------------------------------------------------------------- noise
def white(n: int, rng: np.random.Generator) -> np.ndarray:
    return rng.standard_normal(n)


def coloured(n: int, rng: np.random.Generator, slope_db_oct: float = -3.0, f_lo: float = 20.0) -> np.ndarray:
    """Gaussian noise with a power slope of ``slope_db_oct`` dB per octave (−3 pink, −6 brown), made in the
    frequency domain, flat below ``f_lo``; unit RMS."""
    m = 1 << int(np.ceil(np.log2(max(n, 2))))
    spec = rng.standard_normal(m // 2 + 1) + 1j * rng.standard_normal(m // 2 + 1)
    f = np.fft.rfftfreq(m, 1 / SR)
    f = np.maximum(f, f_lo)
    spec *= (f / 1000.0) ** (slope_db_oct / (20 * np.log10(2)))
    spec[0] = 0
    x = np.fft.irfft(spec, m)[:n]
    return x / (np.std(x) + 1e-12)


def pink(n: int, rng: np.random.Generator) -> np.ndarray:
    return coloured(n, rng, -3.0)


def brown(n: int, rng: np.random.Generator) -> np.ndarray:
    return coloured(n, rng, -6.0)


def smooth_random(n: int, rng: np.random.Generator, rate_hz: float, lo: float = 0.0, hi: float = 1.0) -> np.ndarray:
    """A slow random curve between ``lo`` and ``hi``: random knots every 1/rate_hz seconds joined by cosine ramps
    (C1-smooth, no clicks)."""
    step = max(1, int(SR / rate_hz))
    k = n // step + 3
    knots = rng.uniform(lo, hi, k)
    i = np.arange(n)
    j = i // step
    u = (i % step) / step
    w = 0.5 - 0.5 * np.cos(np.pi * u)
    return knots[j] * (1 - w) + knots[j + 1] * w


# ------------------------------------------------------------------------------------------- spectral shaping
NFFT, HOP = 2048, 512


def shape(x: np.ndarray, gain_fn) -> np.ndarray:
    """Time-varying filter: STFT of ``x`` (Hann, 2048/512), multiply by ``gain_fn(f, t)`` (f: (F,1) Hz,
    t: (1,T) s → (F,T) linear gains), inverse STFT. Smooth gains give smooth, click-free results."""
    n = len(x)
    f, t, Z = signal.stft(x, SR, nperseg=NFFT, noverlap=NFFT - HOP, boundary="even", padded=True)
    G = gain_fn(f[:, None], t[None, :])
    _, y = signal.istft(Z * G, SR, nperseg=NFFT, noverlap=NFFT - HOP, boundary=True)
    y = y[:n]
    if len(y) < n:
        y = np.pad(y, (0, n - len(y)))
    return y


def band(f: np.ndarray, centre, width_oct) -> np.ndarray:
    """A smooth (Gaussian in log-frequency) band gain centred on ``centre`` Hz, ``width_oct`` octaves wide (σ)."""
    lf = np.log2(np.maximum(f, 1.0))
    return np.exp(-0.5 * ((lf - np.log2(centre)) / width_oct) ** 2)


def lowpass_gain(f: np.ndarray, fc, order: float = 2.0) -> np.ndarray:
    """Butterworth-like low-pass magnitude with a (possibly time-varying) corner ``fc``."""
    return 1.0 / np.sqrt(1.0 + (f / fc) ** (2 * order))


def highpass_gain(f: np.ndarray, fc, order: float = 2.0) -> np.ndarray:
    return 1.0 / np.sqrt(1.0 + (np.maximum(fc, 1e-3) / np.maximum(f, 1e-3)) ** (2 * order))


# --------------------------------------------------------------------------------------------- plain filters
def lp(x: np.ndarray, fc: float, order: int = 2, axis: int = 0) -> np.ndarray:
    return signal.sosfiltfilt(signal.butter(order, fc, "low", fs=SR, output="sos"), x, axis=axis)


def hp(x: np.ndarray, fc: float, order: int = 2, axis: int = 0) -> np.ndarray:
    return signal.sosfiltfilt(signal.butter(order, fc, "high", fs=SR, output="sos"), x, axis=axis)


def bp(x: np.ndarray, lo: float, hi: float, order: int = 2, axis: int = 0) -> np.ndarray:
    return signal.sosfiltfilt(signal.butter(order, [lo, hi], "band", fs=SR, output="sos"), x, axis=axis)


# ---------------------------------------------------------------------------------------------- envelopes
def fade(x: np.ndarray, fade_in: float, fade_out: float) -> np.ndarray:
    """Equal-power (sin²) fade in and out, in seconds, applied in place-safe copy."""
    y = np.array(x, dtype=np.float32, copy=True)
    n = len(y)
    a, b = min(n, int(fade_in * SR)), min(n, int(fade_out * SR))
    if a > 0:
        y[:a] *= (np.sin(0.5 * np.pi * np.linspace(0, 1, a)) ** 2).reshape((-1,) + (1,) * (y.ndim - 1))
    if b > 0:
        y[n - b:] *= (np.cos(0.5 * np.pi * np.linspace(0, 1, b)) ** 2).reshape((-1,) + (1,) * (y.ndim - 1))
    return y


def adsr_exp(n: int, attack: float, decay: float) -> np.ndarray:
    """Percussive envelope: raised-cosine attack of ``attack`` s, exponential decay with time constant ``decay`` s,
    and a 10-ms cosine tail so it ends exactly at zero."""
    t = np.arange(n) / SR
    na = max(1, int(attack * SR))
    env = np.exp(-np.maximum(t - attack, 0) / decay)
    env[:na] *= 0.5 - 0.5 * np.cos(np.pi * np.arange(na) / na)
    nt = min(n, int(0.01 * SR))
    env[n - nt:] *= np.cos(0.5 * np.pi * np.linspace(0, 1, nt)) ** 2
    return env


def pan(mono: np.ndarray, p: float | np.ndarray) -> np.ndarray:
    """Equal-power pan, p = 0 left … 0.5 centre … 1 right (scalar or per-sample)."""
    p = np.clip(p, 0, 1)
    return np.stack([mono * np.sqrt(1 - p), mono * np.sqrt(p)], axis=1)


def add_at(dst: np.ndarray, src: np.ndarray, i0: int) -> None:
    """dst[i0 : i0+len(src)] += src, clipped to dst's length."""
    if i0 >= len(dst) or i0 + len(src) <= 0:
        return
    a = max(0, -i0)
    b = min(len(src), len(dst) - i0)
    dst[i0 + a:i0 + b] += src[a:b]


# ------------------------------------------------------------------------------------------------- reverb
def reverb(x: np.ndarray, rng: np.random.Generator, seconds: float = 3.5, decay: float = 0.9, wet: float = 0.35,
           tone_hz: float = 3000.0, predelay: float = 0.02, width: float = 1.0) -> np.ndarray:
    """Stereo reverb from a synthetic impulse response (exponentially decaying low-passed noise, its own per channel
    × ``width`` decorrelation). ``decay`` is the amplitude time constant in s (RT60 ≈ 6.9 × decay)."""
    n = int(seconds * SR)
    t = np.arange(n) / SR
    sos = signal.butter(2, tone_hz, "low", fs=SR, output="sos")
    common = signal.sosfilt(sos, rng.standard_normal(n))
    out = np.empty((len(x), 2), dtype=np.float32)
    pd = int(predelay * SR)
    for ch in range(2):
        own = signal.sosfilt(sos, rng.standard_normal(n))
        ir = (width * own + (1 - width) * common) * np.exp(-t / decay)
        ir[: int(0.005 * SR)] *= np.linspace(0, 1, int(0.005 * SR))
        nt = n // 4                                      # taper the last quarter so the tail never stops abruptly
        ir[n - nt:] *= np.cos(0.5 * np.pi * np.linspace(0, 1, nt)) ** 2
        ir = np.concatenate([np.zeros(pd), ir])
        ir /= np.sqrt(np.sum(ir ** 2))
        out[:, ch] = (1 - wet) * x[:, ch] + wet * signal.oaconvolve(x[:, ch], ir)[: len(x)]
    return out


# ---------------------------------------------------------------------------------------- BS.1770 loudness
def _biquad_k(fs: int) -> list[np.ndarray]:
    """K-weighting as two RBJ biquads (high shelf +4 dB @ 1681.97 Hz, Q 0.7072; high-pass @ 38.135 Hz, Q 0.5003),
    the ITU-R BS.1770-4 pre-filter re-derived for any sample rate (as pyloudnorm does)."""
    def shelf(G, Q, fc):
        A = 10 ** (G / 40)
        w0 = 2 * np.pi * fc / fs
        al = np.sin(w0) / (2 * Q)
        b = [A * ((A + 1) + (A - 1) * np.cos(w0) + 2 * np.sqrt(A) * al), -2 * A * ((A - 1) + (A + 1) * np.cos(w0)),
             A * ((A + 1) + (A - 1) * np.cos(w0) - 2 * np.sqrt(A) * al)]
        a = [(A + 1) - (A - 1) * np.cos(w0) + 2 * np.sqrt(A) * al, 2 * ((A - 1) - (A + 1) * np.cos(w0)),
             (A + 1) - (A - 1) * np.cos(w0) - 2 * np.sqrt(A) * al]
        return np.array(b + a) / a[0]

    def hpf(Q, fc):
        w0 = 2 * np.pi * fc / fs
        al = np.sin(w0) / (2 * Q)
        b = [(1 + np.cos(w0)) / 2, -(1 + np.cos(w0)), (1 + np.cos(w0)) / 2]
        a = [1 + al, -2 * np.cos(w0), 1 - al]
        return np.array(b + a) / a[0]

    return [shelf(4.0, 1 / np.sqrt(2), 1500.0), hpf(0.5, 38.0)]


def k_weight(x: np.ndarray) -> np.ndarray:
    sos = np.stack(_biquad_k(SR))
    return signal.sosfilt(sos, x, axis=0)


def _block_power(x: np.ndarray, win: float, hop: float) -> np.ndarray:
    """Mean-square of K-weighted signal summed over channels, per block of ``win`` s every ``hop`` s."""
    y = k_weight(x if x.ndim == 2 else x[:, None])
    p = np.sum(y ** 2, axis=1)
    w, h = int(win * SR), int(hop * SR)
    if len(p) < w:
        return np.array([np.mean(p)]) if len(p) else np.array([0.0])
    c = np.concatenate([[0.0], np.cumsum(p)])
    starts = np.arange(0, len(p) - w + 1, h)
    return (c[starts + w] - c[starts]) / w


def _lufs(power: np.ndarray) -> np.ndarray:
    return -0.691 + 10 * np.log10(np.maximum(power, 1e-20))


def integrated_lufs(x: np.ndarray) -> float:
    """Gated integrated loudness (BS.1770-4: 400-ms blocks, 75 % overlap, −70 LUFS absolute and −10 LU relative)."""
    pw = _block_power(x, 0.4, 0.1)
    L = _lufs(pw)
    g = pw[L > -70]
    if not len(g):
        return float("-inf")
    rel = _lufs(np.array([np.mean(g)]))[0] - 10
    g2 = pw[(L > -70) & (L > rel)]
    return float(_lufs(np.array([np.mean(g2)]))[0])


def short_term_lufs(x: np.ndarray, hop: float = 0.1) -> np.ndarray:
    """Short-term loudness (3-s window) every ``hop`` s (EBU Tech 3341)."""
    return _lufs(_block_power(x, 3.0, hop))


def momentary_lufs(x: np.ndarray, hop: float = 0.1) -> np.ndarray:
    return _lufs(_block_power(x, 0.4, hop))


def true_peak_dbtp(x: np.ndarray) -> float:
    """True peak by 4× oversampling (BS.1770 Annex 2)."""
    y = signal.resample_poly(x if x.ndim == 2 else x[:, None], 4, 1, axis=0)
    return float(20 * np.log10(np.max(np.abs(y)) + 1e-20))


# ---------------------------------------------------------------------------------------------------- I/O
def read_wav(path: Path) -> np.ndarray:
    """A WAV file as float32 stereo at SR (mono is duplicated, other rates are resampled)."""
    sr, x = wavfile.read(path)
    if x.dtype == np.int16:
        x = x.astype(np.float32) / 32768.0
    elif x.dtype == np.int32:
        x = x.astype(np.float32) / 2147483648.0
    else:
        x = x.astype(np.float32)
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    if sr != SR:
        g = np.gcd(sr, SR)
        x = signal.resample_poly(x, SR // g, sr // g, axis=0).astype(np.float32)
    return x


def write_wav(path: Path, x: np.ndarray) -> None:
    """16-bit PCM at SR, with TPDF dither."""
    rng = np.random.default_rng(0)
    d = (rng.uniform(-0.5, 0.5, x.shape) + rng.uniform(-0.5, 0.5, x.shape)) / 32768.0
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    wavfile.write(path, SR, np.round(np.clip((x + d) * 32767, -32767, 32767)).astype(np.int16))
