"""Audio checks for music beds, effects and mixes: clipping, DC offset, clicks, harsh high end, rumble, loudness.

Run with the main venv::

    .venv/Scripts/python.exe tools/sound/check.py a.wav [b.wav …] [--png outputs/sound/checks] [--json out.json]

Per file it prints and returns:

| metric | meaning | pass when |
|---|---|---|
| peak_dbfs / true_peak_dbtp | sample and 4× oversampled peak | true peak ≤ −1.0 dBTP, no sample at full scale |
| dc_dbfs | |mean| per channel | ≤ −60 dBFS |
| clicks | 1-ms frames of the > 12 kHz band more than 24 dB above their 200-ms median and above −66 dBFS | 0 for music (effects with real transients may have some, reported, judged by ear/eye) |
| hf6k_db, hf10k_db | energy above 6 / 10 kHz relative to the total (K-weighted not applied) | music: hf6k ≤ −20 dB, hf10k ≤ −35 dB |
| sub30_db | energy below 30 Hz relative to the total | ≤ −20 dB |
| centroid_hz | spectral centroid | informative |
| lufs_i, lufs_st_max, lra_lu | integrated and max short-term loudness, short-term spread (10th–95th pct) | informative |

``--png`` writes, per file, a waveform + spectrogram + long-term spectrum figure for judging by eye.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import numpy as np
from scipy import ndimage, signal

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
    from sound.common import SR, integrated_lufs, read_wav, short_term_lufs, true_peak_dbtp
else:
    from .common import SR, integrated_lufs, read_wav, short_term_lufs, true_peak_dbtp


def _db(x: float) -> float:
    return float(10 * np.log10(max(x, 1e-30)))


def clicks(x: np.ndarray) -> list[float]:
    """Times (s) of click-like spikes: 1-ms frames of the > 12 kHz band far above their 200-ms running median."""
    sos = signal.butter(8, 12000, "high", fs=SR, output="sos")
    h = signal.sosfilt(sos, x.mean(axis=1))
    fr = int(0.001 * SR)
    m = len(h) // fr
    e = np.sqrt(np.mean(h[: m * fr].reshape(m, fr) ** 2, axis=1)) + 1e-12
    med = ndimage.median_filter(e, size=201, mode="nearest")
    hit = (20 * np.log10(e / med) > 24) & (20 * np.log10(e) > -66)
    idx = np.flatnonzero(hit)
    out: list[float] = []
    for i in idx:                                  # merge hits closer than 20 ms
        if not out or i * 0.001 - out[-1] > 0.02:
            out.append(i * 0.001)
    return out


def analyse(x: np.ndarray) -> dict:
    mono = x.mean(axis=1)
    f, P = signal.welch(mono, SR, nperseg=8192)
    tot = np.sum(P)
    st = short_term_lufs(x)
    stf = st[st > -70]
    return {
        "seconds": round(len(x) / SR, 2),
        "peak_dbfs": round(20 * np.log10(np.max(np.abs(x)) + 1e-12), 2),
        "true_peak_dbtp": round(true_peak_dbtp(x), 2),
        "full_scale_samples": int(np.sum(np.abs(x) >= 0.999)),
        "dc_dbfs": round(20 * np.log10(np.max(np.abs(x.mean(axis=0))) + 1e-12), 1),
        "clicks": len(clicks(x)),
        "click_times": [round(t, 3) for t in clicks(x)[:10]],
        "hf6k_db": round(_db(np.sum(P[f > 6000]) / tot), 1),
        "hf10k_db": round(_db(np.sum(P[f > 10000]) / tot), 1),
        "sub30_db": round(_db(np.sum(P[f < 30]) / tot), 1),
        "centroid_hz": round(float(np.sum(f * P) / tot), 0),
        "lufs_i": round(integrated_lufs(x), 2),
        "lufs_st_max": round(float(np.max(st)), 2),
        "lra_lu": round(float(np.percentile(stf, 95) - np.percentile(stf, 10)), 1) if len(stf) else 0.0,
    }


def verdict(m: dict, kind: str = "music") -> list[str]:
    """Problems found (empty = clean). ``kind`` = music or sfx (sfx may be brighter and have transients)."""
    bad = []
    if m["true_peak_dbtp"] > -1.0 or m["full_scale_samples"]:
        bad.append(f"peak {m['true_peak_dbtp']} dBTP / {m['full_scale_samples']} full-scale samples")
    if m["dc_dbfs"] > -60:
        bad.append(f"DC {m['dc_dbfs']} dBFS")
    if m["sub30_db"] > -20:
        bad.append(f"sub-30 Hz energy {m['sub30_db']} dB")
    if kind == "music":
        if m["clicks"]:
            bad.append(f"{m['clicks']} click(s) at {m['click_times']}")
        if m["hf6k_db"] > -20 or m["hf10k_db"] > -35:
            bad.append(f"bright top: >6k {m['hf6k_db']} dB, >10k {m['hf10k_db']} dB")
    else:
        if m["hf10k_db"] > -18:
            bad.append(f"harsh top: >10k {m['hf10k_db']} dB")
    return bad


def figure(x: np.ndarray, title: str, out: Path) -> None:
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    mono = x.mean(axis=1)
    t = np.arange(len(mono)) / SR
    fig, ax = plt.subplots(3, 1, figsize=(10, 7.5), gridspec_kw={"height_ratios": [1, 2, 1.4]})
    step = max(1, len(mono) // 4000)
    blk = mono[: len(mono) // step * step].reshape(-1, step)
    tt = t[: len(blk) * step: step]
    ax[0].fill_between(tt, blk.min(axis=1), blk.max(axis=1), color="#3b6ea5", lw=0)
    ax[0].set_ylim(-1, 1)
    ax[0].set_ylabel("amplitude")
    ax[0].set_title(title)
    f, ts, S = signal.spectrogram(mono, SR, nperseg=2048, noverlap=1536)
    ax[1].pcolormesh(ts, f, 10 * np.log10(S + 1e-14), shading="auto", cmap="magma",
                     vmin=10 * np.log10(np.max(S) + 1e-14) - 90, vmax=10 * np.log10(np.max(S) + 1e-14))
    ax[1].set_yscale("symlog", linthresh=200)
    ax[1].set_ylim(20, SR / 2)
    ax[1].set_ylabel("Hz")
    fw, P = signal.welch(mono, SR, nperseg=8192)
    ax[2].semilogx(fw[1:], 10 * np.log10(P[1:] + 1e-20), color="#333")
    ax[2].set_xlim(20, SR / 2)
    ax[2].set_xlabel("Hz (long-term spectrum)    /    s (above)")
    ax[2].set_ylabel("dB")
    ax[2].grid(alpha=0.3)
    fig.tight_layout()
    out.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(out, dpi=80)
    plt.close(fig)


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("files", nargs="+", type=Path)
    ap.add_argument("--kind", choices=["music", "sfx", "mix"], default="music")
    ap.add_argument("--png", type=Path)
    ap.add_argument("--json", type=Path)
    a = ap.parse_args()
    rows, n_bad = {}, 0
    for p in a.files:
        x = read_wav(p).astype(np.float64)
        m = analyse(x)
        m["problems"] = verdict(m, "music" if a.kind == "music" else "sfx")
        n_bad += bool(m["problems"])
        rows[p.name] = m
        print(f"{p.name:28s} TP {m['true_peak_dbtp']:6.1f}  DC {m['dc_dbfs']:6.1f}  clicks {m['clicks']:3d}  "
              f">6k {m['hf6k_db']:6.1f}  >10k {m['hf10k_db']:6.1f}  <30 {m['sub30_db']:6.1f}  "
              f"cent {m['centroid_hz']:6.0f}  I {m['lufs_i']:6.1f}  LRA {m['lra_lu']:4.1f}  "
              f"{'OK' if not m['problems'] else 'CHECK: ' + '; '.join(m['problems'])}")
        if a.png:
            figure(x, p.stem, a.png / f"{p.stem}.png")
    if a.json:
        a.json.write_text(json.dumps(rows, indent=1), encoding="utf-8")
    return 1 if n_bad else 0


if __name__ == "__main__":
    raise SystemExit(main())
