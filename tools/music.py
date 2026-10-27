"""Soft background music for the AOFD movies: a slow ambient pad composed by our own code, ducked under the narration.

Everything is synthesised here from sine partials (no samples, no model weights, no third-party audio), so the music
is ours and can go public with the movies (CC0). The same seed always gives the same file.

Run with the main venv::

    .venv/Scripts/python.exe tools/music.py compose --duration 372 --out music.wav [--seed 7] [--lufs -28]
    .venv/Scripts/python.exe tools/music.py mix --narration narration.wav --music music.wav --out narration_music.wav
    .venv/Scripts/python.exe tools/music.py score --narration narration.wav --out-dir <dir> [--tail 1.5]

``score`` = compose a bed exactly as long as the narration (+ tail) and mix it: it writes ``music.wav`` and
``narration_music.wav`` (44.1 kHz stereo, −16 LUFS integrated, true peak ≤ −1.5 dBTP) into ``--out-dir``.

``--style NAME`` (compose and score) picks one of the music styles in ``tools/sound/styles.py`` (one score per movie,
HOUSE_STYLE §8; ``tools/sound/styles.py list``). Without ``--style`` the output is byte-identical to the original
pad described below (style ``maths-calm``). Sound effects and cue sheets: ``tools/sound/mix.py``.

The music: four slow chords (Dmaj9 · Bm11 · Gmaj9 · Asus2, 9 s each, 3-s raised-cosine crossfades), each note three
gently detuned voices with a slow swell, a quiet sub-bass, sparse soft bell notes from the D-major pentatonic, a
low-pass at 2.4 kHz and a synthetic 3.5-s reverb. Ducking: the music drops by ``--duck-db`` (default 5 dB) while
someone speaks, with a 0.25-s attack and a 1.2-s release, so it fills the pauses and never covers a word.
"""
from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path

import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 44_100
CHORD_S, XFADE_S = 9.0, 3.0
# MIDI notes per chord (lowest first); A4 = 69 = 440 Hz
CHORDS = [
    [50, 57, 61, 64, 66],      # Dmaj9:  D3 A3 C#4 E4 F#4
    [47, 54, 57, 62, 64],      # Bm11:   B2 F#3 A3 D4 E4
    [43, 54, 59, 62, 69],      # Gmaj9:  G2 F#3 B3 D4 A4
    [45, 52, 59, 61, 64],      # Asus2:  A2 E3 B3 C#4 E4
]
BELLS = [74, 76, 78, 81, 83, 86]   # D-major pentatonic, D5..D6


def hz(m: float) -> float:
    """MIDI note number → frequency in Hz."""
    return 440.0 * 2.0 ** ((m - 69) / 12)


def chord_envelope(t: np.ndarray, k: int) -> np.ndarray:
    """Weight of chord slot k at times t: 1 inside its slot, raised-cosine ramps of XFADE_S into its neighbours."""
    start, end = k * CHORD_S, (k + 1) * CHORD_S
    up = np.clip((t - (start - XFADE_S / 2)) / XFADE_S, 0, 1)
    down = np.clip(((end + XFADE_S / 2) - t) / XFADE_S, 0, 1)
    return np.sin(0.5 * np.pi * np.minimum(up, down)) ** 2


def pad_voice(t: np.ndarray, f: float, rng: np.random.Generator) -> np.ndarray:
    """One soft note: three voices detuned by ±6 cents, a little 2nd and 3rd harmonic, and a slow swell."""
    out = np.zeros_like(t)
    for cents in (-6.0, 0.0, 6.0):
        fd = f * 2 ** (cents / 1200)
        ph = rng.uniform(0, 2 * np.pi)
        out += np.sin(2 * np.pi * fd * t + ph) + 0.25 * np.sin(4 * np.pi * fd * t + ph) + 0.08 * np.sin(6 * np.pi * fd * t)
    swell = 0.75 + 0.25 * np.sin(2 * np.pi * rng.uniform(0.05, 0.12) * t + rng.uniform(0, 2 * np.pi))
    return out * swell / 3


def bell(n: int, f: float) -> np.ndarray:
    """A soft bell: sine + a quiet inharmonic partial, 10-ms attack, 1.8-s exponential decay."""
    t = np.arange(n) / SR
    env = np.minimum(t / 0.01, 1) * np.exp(-t / 1.8)
    return env * (np.sin(2 * np.pi * f * t) + 0.18 * np.sin(2 * np.pi * 2.76 * f * t) * np.exp(-t / 0.5))


def reverb(x: np.ndarray, rng: np.random.Generator, seconds: float = 3.5, wet: float = 0.35) -> np.ndarray:
    """Stereo reverb from a synthetic impulse response (decaying, low-passed noise, different per channel)."""
    n = int(seconds * SR)
    t = np.arange(n) / SR
    sos = signal.butter(2, 3000, "low", fs=SR, output="sos")
    out = np.empty((len(x), 2), dtype=np.float32)
    for ch in range(2):
        ir = signal.sosfilt(sos, rng.standard_normal(n)) * np.exp(-t / 0.9)
        ir /= np.sqrt(np.sum(ir ** 2))
        out[:, ch] = (1 - wet) * x[:, ch] + wet * signal.oaconvolve(x[:, ch], ir)[: len(x)]
    return out


def compose(duration: float, seed: int = 7) -> np.ndarray:
    """The pad as float32 stereo at SR, peak-normalised to 0.5, with a 5-s fade in and an 8-s fade out."""
    rng = np.random.default_rng(seed)
    n = int(round(duration * SR))
    t = np.arange(n) / SR
    mono_l, mono_r = np.zeros(n), np.zeros(n)
    n_slots = int(np.ceil(duration / CHORD_S)) + 1
    for k in range(n_slots):
        notes = CHORDS[k % len(CHORDS)]
        lo = max(0, int(((k - 0.5) * CHORD_S - XFADE_S) * SR))
        hi = min(n, int(((k + 1.5) * CHORD_S + XFADE_S) * SR))
        if lo >= hi:
            continue
        ts = t[lo:hi]
        w = chord_envelope(ts, k)
        for i, m in enumerate(notes):
            v = pad_voice(ts, hz(m), rng) * w * (0.9 if i == 0 else 0.55)
            pan = 0.5 + 0.35 * (i / (len(notes) - 1) - 0.5)          # spread the chord gently left → right
            mono_l[lo:hi] += v * np.sqrt(1 - pan)
            mono_r[lo:hi] += v * np.sqrt(pan)
        sub = 0.45 * np.sin(2 * np.pi * hz(notes[0] - 12) * ts) * w  # sub-bass one octave under the root
        mono_l[lo:hi] += sub
        mono_r[lo:hi] += sub
    x = np.stack([mono_l, mono_r], axis=1)
    sos = signal.butter(2, 2400, "low", fs=SR, output="sos")
    x = signal.sosfiltfilt(sos, x, axis=0)
    # sparse bells: about one every 3.4 s, never in the first 4 s or the last 6 s
    peak_pad = np.max(np.abs(x))
    tb = 4.0
    while tb < duration - 6.0:
        f = hz(BELLS[rng.integers(len(BELLS))])
        i0 = int(tb * SR)
        b = bell(min(int(5 * SR), n - i0), f) * 0.10 * peak_pad
        pan = rng.uniform(0.25, 0.75)
        x[i0:i0 + len(b), 0] += b * np.sqrt(1 - pan)
        x[i0:i0 + len(b), 1] += b * np.sqrt(pan)
        tb += rng.uniform(2.2, 4.6)
    x = reverb(x.astype(np.float32), rng)
    fade = np.ones(n)
    fade[: int(5 * SR)] = np.sin(0.5 * np.pi * np.linspace(0, 1, int(5 * SR))) ** 2
    fade[n - int(8 * SR):] = np.cos(0.5 * np.pi * np.linspace(0, 1, int(8 * SR))) ** 2
    x *= fade[:, None]
    return (0.5 * x / np.max(np.abs(x))).astype(np.float32)


def read_wav(path: Path) -> np.ndarray:
    """A WAV file as float32 stereo at SR (mono is duplicated, other rates are resampled)."""
    sr, x = wavfile.read(path)
    x = x.astype(np.float32) / (32768.0 if x.dtype == np.int16 else 1.0)
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    if sr != SR:
        g = np.gcd(sr, SR)
        x = signal.resample_poly(x, SR // g, sr // g, axis=0).astype(np.float32)
    return x


def write_wav(path: Path, x: np.ndarray) -> None:
    wavfile.write(path, SR, (np.clip(x, -1, 1) * 32767).astype(np.int16))


def loudnorm(src: Path, dst: Path, target: float, tp: float = -1.5) -> dict:
    """Two-pass ffmpeg loudnorm (linear) to `target` LUFS, 44.1 kHz stereo; returns the first-pass measurement."""
    ff = shutil.which("ffmpeg")
    if not ff:
        raise SystemExit("ffmpeg not on PATH")
    p1 = subprocess.run([ff, "-hide_banner", "-nostats", "-i", str(src), "-af",
                         f"loudnorm=I={target}:TP={tp}:LRA=11:print_format=json", "-f", "null", "-"],
                        capture_output=True, text=True)
    js = json.loads(p1.stderr[p1.stderr.rfind("{"):p1.stderr.rfind("}") + 1])
    af = (f"loudnorm=I={target}:TP={tp}:LRA=11:measured_I={js['input_i']}:measured_TP={js['input_tp']}:"
          f"measured_LRA={js['input_lra']}:measured_thresh={js['input_thresh']}:offset={js['target_offset']}:"
          "linear=true")
    subprocess.run([ff, "-hide_banner", "-loglevel", "error", "-y", "-i", str(src), "-af", af, "-ar", str(SR),
                    "-ac", "2", "-c:a", "pcm_s16le", str(dst)], check=True)
    return js


def speech_mask(voice: np.ndarray, attack: float = 0.25, release: float = 1.2) -> np.ndarray:
    """0…1 per sample: 1 while the narrator speaks (30-ms RMS above −40 dB of the peak), smoothed attack/release."""
    mono = voice.mean(axis=1)
    win = int(0.03 * SR)
    rms = np.sqrt(np.convolve(mono ** 2, np.ones(win) / win, mode="same"))
    on = (rms > np.max(rms) * 10 ** (-40 / 20)).astype(np.float64)
    a_up, a_dn = np.exp(-1 / (attack * SR)), np.exp(-1 / (release * SR))
    # one-pole smoothing, done block-wise to keep it fast: run at 1 kHz, then interpolate back
    step = SR // 1000
    coarse = on[::step]
    a_up, a_dn = a_up ** step, a_dn ** step
    sm = np.empty_like(coarse)
    g = 0.0
    for i, v in enumerate(coarse):
        g = v + (g - v) * (a_up if v > g else a_dn)
        sm[i] = g
    return np.interp(np.arange(len(mono)), np.arange(len(coarse)) * step, sm)


def mix(narration: Path, music: Path, out: Path, duck_db: float = 5.0, target: float = -16.0) -> dict:
    """Narration + ducked music → `out` at `target` LUFS. The music file must already sit at its bed loudness."""
    v, m = read_wav(narration), read_wav(music)
    n = max(len(v), len(m))
    v = np.pad(v, ((0, n - len(v)), (0, 0)))
    m = np.pad(m, ((0, n - len(m)), (0, 0)))
    gain = 10 ** (-duck_db * speech_mask(v) / 20)
    raw = out.with_name(out.stem + "_raw.wav")
    write_wav(raw, v + m * gain[:, None].astype(np.float32))
    stats = loudnorm(raw, out, target)
    raw.unlink()
    return {"narration": str(narration), "music": str(music), "duck_db": duck_db, "target_lufs": target,
            "seconds": n / SR, "premix_lufs": float(stats["input_i"])}


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    sub = ap.add_subparsers(dest="cmd", required=True)
    c = sub.add_parser("compose")
    c.add_argument("--duration", type=float, required=True)
    c.add_argument("--out", type=Path, required=True)
    c.add_argument("--seed", type=int, default=7)
    c.add_argument("--lufs", type=float, default=-28.0, help="loudness of the music bed on its own")
    c.add_argument("--style", default=None, help="a tools/sound/styles.py style (default: the original pad)")
    mx = sub.add_parser("mix")
    mx.add_argument("--narration", type=Path, required=True)
    mx.add_argument("--music", type=Path, required=True)
    mx.add_argument("--out", type=Path, required=True)
    mx.add_argument("--duck-db", type=float, default=5.0)
    s = sub.add_parser("score")
    s.add_argument("--narration", type=Path, required=True)
    s.add_argument("--out-dir", type=Path, required=True)
    s.add_argument("--tail", type=float, default=1.5, help="seconds of music after the narration ends")
    s.add_argument("--seed", type=int, default=7)
    s.add_argument("--lufs", type=float, default=-28.0)
    s.add_argument("--duck-db", type=float, default=5.0)
    s.add_argument("--style", default=None, help="a tools/sound/styles.py style (default: the original pad)")
    a = ap.parse_args()

    def make_bed(duration: float, out: Path, seed: int, lufs: float, style: str | None = None) -> None:
        raw = out.with_name(out.stem + "_raw.wav")
        if style is None:
            write_wav(raw, compose(duration, seed))
        else:                                           # delegate to the style composer (tools/sound/styles.py)
            sys.path.insert(0, str(Path(__file__).resolve().parent))
            from sound import styles
            write_wav(raw, styles.compose(style, duration, seed))
        loudnorm(raw, out, lufs, tp=-6.0)
        raw.unlink()
        print(f"music: {out}  ({duration:.2f} s, {lufs} LUFS, seed {seed}" + (f", style {style})" if style else ")"))

    if a.cmd == "compose":
        make_bed(a.duration, a.out, a.seed, a.lufs, a.style)
    elif a.cmd == "mix":
        print(json.dumps(mix(a.narration, a.music, a.out, a.duck_db), indent=1))
    else:
        a.out_dir.mkdir(parents=True, exist_ok=True)
        sr, x = wavfile.read(a.narration)
        bed = a.out_dir / "music.wav"
        make_bed(len(x) / sr + a.tail, bed, a.seed, a.lufs, a.style)
        info = mix(a.narration, bed, a.out_dir / "narration_music.wav", a.duck_db)
        info.update(seed=a.seed, bed_lufs=a.lufs, tail_s=a.tail)
        if a.style is not None:
            info.update(style=a.style)
        (a.out_dir / "music.json").write_text(json.dumps(info, indent=1), encoding="utf-8")
        print(json.dumps(info, indent=1))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
