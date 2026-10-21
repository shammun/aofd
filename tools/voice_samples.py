"""Render the same narration line with several Kokoro voices so the user can pick the movie narrator (PLANNING Q2).

Run with the narration environment (torch lives only there):
    .venv-tts/Scripts/python.exe tools/voice_samples.py
Writes outputs/voice_samples/<voice>.wav (git-ignored) and prints the render time of each.
"""
from __future__ import annotations

import time
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro import KPipeline

TEXT = (
    "Imagine rolling a ball across a spinning merry-go-round. "
    "To you, riding along, the ball seems to curve to the side, even though nothing pushed it. "
    "That apparent push is the Coriolis effect, and on our spinning Earth it turns every large wind "
    "and ocean current: to the right in the Northern Hemisphere, and to the left in the Southern."
)

# voice id -> pipeline language code ('a' American English, 'b' British English)
VOICES = {
    "af_heart": "a",    # American, female (the plan's default)
    "af_bella": "a",    # American, female
    "am_michael": "a",  # American, male
    "bf_emma": "b",     # British, female
    "bm_george": "b",   # British, male
}

SAMPLE_RATE = 24_000  # Kokoro outputs 24 kHz audio


def main() -> None:
    out = Path(__file__).resolve().parents[1] / "outputs" / "voice_samples"
    out.mkdir(parents=True, exist_ok=True)
    pipelines: dict[str, KPipeline] = {}
    for voice, lang in VOICES.items():
        pipe = pipelines.setdefault(lang, KPipeline(lang_code=lang, repo_id="hexgrad/Kokoro-82M"))
        t0 = time.perf_counter()
        chunks = [audio for _, _, audio in pipe(TEXT, voice=voice, speed=1.0)]
        wav = np.concatenate([np.asarray(c) for c in chunks])
        path = out / f"{voice}.wav"
        sf.write(path, wav, SAMPLE_RATE)
        print(f"{voice:11s} {len(wav) / SAMPLE_RATE:5.1f} s audio in {time.perf_counter() - t0:5.1f} s -> {path}")


if __name__ == "__main__":
    main()
