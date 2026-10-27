# tools/sound — music styles, sound effects, cue-sheet mixer

The sound toolkit for the aofd movies (HOUSE_STYLE §8 "Sound and captions"). Every sound here comes from our own
code: synthesised voices, filtered noise and modelled bubbles. There are no samples and no model weights, so all of it is
ours and **CC0-1.0**. Each output is fixed by its seed: the same style or effect with the same seed gives the same samples.

| file | what it does |
|---|---|
| `styles.py` | music styles (one score per movie) and the composer `compose(style, duration, seed)` |
| `sfx.py` | the synthesised sound effects, `render(name, duration, intensity, seed, **params)` |
| `mix.py` | narration + cue sheet → `narration_music.wav` (−16 LUFS, true peak ≤ −1.5 dBTP) + `sound.json` credits + `sound_captions.json` |
| `check.py` | audio checks: clipping, DC, clicks, harsh top, rumble, loudness; spectrogram PNGs to judge by eye |
| `common.py` | shared building blocks: noise colours, STFT spectral shaping, filters, reverb, BS.1770 loudness, WAV I/O |

`tools/music.py` is unchanged when called **without `--style`**: it gives byte-identical output (the published
dot-product and cross-product movies use seed 7). With `--style NAME` it hands the bed to `styles.compose`.

## 1. Music styles

Every style follows the same mixing rules: the bed is −28 LUFS on its own, it drops 5 dB under speech, and the mix is
−16 LUFS. Record the style, key and seed in the storyboard. Two movies must never share the same style **and** seed. A
style can be reused with a different seed, but the house rule is a different style for each topic.

| style | key · pulse | sound | suits |
|---|---|---|---|
| `maths-calm` | D major · none, 9-s chords | the original pad: soft chords, sub-bass, sparse bells (`music.compose`, unchanged) | mathematics, vectors, calculus, primers |
| `air-flowing` | G major (Lydian colour) · 84 bpm | string pad, lilting plucked eighth-note arpeggio, a faint breath of air noise, rare celesta | weather basics, winds, the atmosphere in motion, fronts, jets |
| `ocean-deep` | B♭ minor · none, 14-s chords | dark low strings, a hollow drone, a slow sea-swell of filtered noise, rare deep electric-piano notes, long reverb | the ocean, deep circulation, thermohaline, abyssal flow |
| `storm-tense` | D minor · 96 bpm | muted low ostinato (root-fifth), soft heartbeat drum, tremolo strings, rare high tension notes | storms, cyclones, instability, convection |
| `tropics-warm` | F major · 100 bpm, tresillo 3-3-2 | warm triangle-tone pad, marimba in 3-3-2, soft hand drum, quiet shaker | tropics, Hadley cell, monsoons, ENSO, ITCZ |
| `ice-polar` | E Lydian · none, 12-s chords | high glassy pad, rare celesta notes, a long cold reverb | sea ice, polar regions, cryosphere, polar vortex |
| `planet-wide` | C major / A minor · none, 10-s chords | wide strings over a deep root, a high soft pad, an unhurried electric-piano phrase every few chords | general circulation, climate, the whole Earth |
| `data-curious` | A Dorian · 92 bpm | marimba "questions" with rests, soft pad, rare wood tock | maps and data, reading figures, reanalysis, statistics |
| `rotation-turning` | B♭ major · 6/8 | electric-piano arpeggio cycling up and down and slowly circling the stereo field | rotating frames, Coriolis, angular momentum, inertial oscillations |
| `sun-radiant` | E major · 60 bpm | warm bright pad, rising four-note celesta figures that breathe, sparse bells | radiation, the Sun, energy balance, greenhouse effect |

How a style is built (`Style` in `styles.py`):
- **Chords:** a chord progression (MIDI, bass first), seconds per chord and a cross-fade length.
- **Pads:** `sine` (the original), `strings` (band-limited saw with vibrato), `warm` (triangle-like), `glass`, `hollow`.
  Each pad note is three detuned voices with a slow swell. The bass note plays as a quiet sub (55–110 Hz).
- **Layers:**
  - `arp`: step patterns `x . ?` tied to the current chord, in the orders up, updown, random or root5;
  - `perc`: kick, heartbeat, hand drum, shaker or woodblock;
  - `sparse`: random notes from a scale;
  - `phrase`: short stepwise melodies;
  - `drone`;
  - `noise`: a breath or swell.

  Each layer has its own random stream, so changing one layer never changes another.
- **Instruments** (all synthesised):
  - bell;
  - celesta;
  - modal marimba (partials 1 : 3.98 : 9.9);
  - FM electric piano;
  - additive pluck and muted pluck;
  - felt kick;
  - hand drum, shaker and woodblock.
- **Finishing:** the pads go through a low-pass at the style's corner and a synthetic stereo reverb (decay, wetness
  and tone set per style). Then everything goes through a 28-Hz high-pass (no DC, no rumble) and a 9-kHz low-pass (no
  harsh top), gets its fades and is peak-normalised.

```bash
.venv/Scripts/python.exe tools/sound/styles.py list
.venv/Scripts/python.exe tools/sound/styles.py demo --out-dir outputs/sound/demos --duration 40      # all styles at −20 LUFS
.venv/Scripts/python.exe tools/music.py score --narration narration.wav --out-dir <dir> --style ocean-deep --seed 3
.venv/Scripts/python.exe tools/music.py compose --duration 180 --out bed.wav --style tropics-warm --seed 5
```

## 2. Sound effects

The rule: play an effect **only where the picture shows that thing**. Keep it short and quiet, never over a word, and
only one at a time (a *bed* may run under one other effect).

| name | bed? | method | default caption |
|---|---|---|---|
| `rain_light`, `rain_heavy`, `rain` (intensity 0.05–1) | bed | pink hiss, brighter and louder with intensity, plus Minnaert drop "plinks" and tiny impact ticks at Poisson times; heavy rain adds a low surface roar | `[light rain]` / `[heavy rain]` |
| `wind_gentle`, `wind_gusty`, `wind_howling`, `wind` (`kind=`) | bed | pink and brown noise through a soft band-pass whose level **and** centre follow a gust curve; howling adds two narrow whistles that sound only in the gusts, plus a low buffeting rumble | `[gentle breeze]` / `[gusty wind]` / `[wind howling]` |
| `waves_breaking` (`first=` s, `period=`) | bed | per wave: an approach rumble, a crash that brightens as the lip falls (0.45–0.9 s), a hiss that drains away, and a fizz of foam bubbles; `first` puts a crash on a chosen frame | `[waves breaking]` |
| `surf` | bed | a continuous low roar with darker, overlapping waves every 4–7 s (heard from back up the beach) | `[surf]` |
| `stream` | bed | a flickering band of noise plus a dense field of small rising bubbles | `[water flowing]` |
| `storm_bed` | bed | gusty wind + heavy rain + distant thunder every 12–25 s | `[storm]` |
| `splash` (`at=`) | one-shot | an impact burst, a low "plop" bubble, spray, then droplets falling back for about 1 s | `[splash]` |
| `drip` (`at=`) | one-shot | a single rising Minnaert "plink" in a small room | `[drip]` |
| `bubbles` | one-shot | trains of 3–8 big pitched bubbles (150–700 Hz) over a muffled underwater hush | `[bubbles]` |
| `thunder_near`, `thunder_far`, `thunder` (`distance=`, `at=`) | one-shot | a cloud of low-passed noise bursts (one per piece of the lightning channel) arriving over seconds; near = a tearing crack then a heavy roll, far = a dark rumble with no crack | `[thunder crack]` / `[distant thunder]` |
| `whoosh` (`direction=lr/rl/centre`) | one-shot | a band-pass sweeping 250 Hz → about 1.6 kHz and back, with a bell-shaped swell, panned across | none (camera moves carry no meaning) |
| `tick` (`rate=`, `accent_every=`) | one-shot | a soft wooden tick (1.9 + 4.3 kHz over a 700-Hz body); with `rate` it becomes a counter | none |

The methods follow standard procedural-audio recipes, re-implemented here:
- **Bubbles** follow van den Doel (2005), *Physically based models for liquid sounds* (ACM TAP 2, 534). A bubble of
  radius r rings at f₀ ≈ 3/r, damps at d = 0.13/r + 0.0072 r^-1.5 and rises in pitch as f(t) = f₀(1 + ξdt).
- **Thunder** follows Few (1969) and Farnell, *Designing Sound* (2010).
- **Wind, waves and whooshes** are noise shaped by a smooth gain surface G(f, t) in the STFT domain.

```bash
.venv/Scripts/python.exe tools/sound/sfx.py list
.venv/Scripts/python.exe tools/sound/sfx.py render waves_breaking --duration 12 --intensity 0.6 --seed 3 --param first=1.0 --out x.wav
.venv/Scripts/python.exe tools/sound/sfx.py demo --out-dir outputs/sound/sfx
```

## 3. Cue sheet → mix (`mix.py`)

```yaml
# movies/chNN/<slug>/sound.yaml
music: {style: air-flowing, seed: 11, bed_lufs: -28, duck_db: 5, tail_s: 2.5}
timing: timing.json          # relative to this file; needed for scene cues
sfx_duck_db: 5
effects:
  - {effect: wind_gusty, scene: s04, offset: 0.5, duration: 14, intensity: 0.6, lufs: -28, fade_in: 2, fade_out: 2, seed: 1}
  - {effect: waves_breaking, scene: s07, offset: 1.0, duration: 12, lufs: -27, seed: 3, params: {first: 0.8},
     caption: "[waves breaking]", caption_s: 3}
  - {effect: thunder_far, at: 95.2, duration: 8, lufs: -27, seed: 4, caption: "[distant thunder]"}
  - {effect: whoosh, scene: s09, duration: 1.2, lufs: -29, seed: 5}
```

| key | meaning |
|---|---|
| `at` **or** `scene` + `offset` | start in seconds, or relative to a `timing.json` scene (`s07` matches `s07_…`) |
| `duration`, `intensity`, `seed`, `params` | passed to the effect |
| `lufs` | the effect's loudest short-term level **in the final mix** before ducking, between −30 and −24 (default −27); for effects shorter than 3 s, the loudest momentary level is used |
| `fade_in`, `fade_out` | seconds (defaults 0.05 / 0.3) |
| `bed` | defaults from `sfx.BEDS`; only beds may overlap another effect |
| `caption`, `caption_s` | a bracketed sound caption, **only where the sound carries meaning**; it shows for `caption_s` seconds (default min(duration, 4)) |
| `sample: {path, licence, source, registry}` | a recorded file in place of `effect`; the licence must be CC0, public domain or own (otherwise refused) |

```bash
.venv/Scripts/python.exe tools/sound/mix.py --narration narration.wav --cues sound.yaml --out-dir <dir> --check-only
.venv/Scripts/python.exe tools/sound/mix.py --narration narration.wav --cues sound.yaml --out-dir <dir>
```

What the mixer does:
1. It validates the cue sheet. It **refuses**:
   - two effects at once unless one of them is a bed;
   - more than two effects at once;
   - a level outside −30 … −24;
   - a cue outside the soundtrack.
2. It composes the bed, sets it to `bed_lufs` and ducks it `duck_db` under speech. The speech mask is the same one
   `music.py` uses: 0.25-s attack and 1.2-s release.
3. It estimates the final normalisation gain, then sets each effect so that it lands on its `lufs` in the final mix.
   The effects are ducked by `sfx_duck_db` under speech.
4. It sums the layers and runs ffmpeg two-pass linear loudnorm to −16 LUFS with true peak −1.5 dBTP. It measures the
   result with its own BS.1770 meter and with ffmpeg `ebur128`.
5. It writes these files:
   - `narration_music.wav`;
   - `music.wav` (the bed alone);
   - `sfx.wav` (the effects stem);
   - `sound.json`: style, key, seed, and every effect with its start, seed, source, licence, final level and
     `voice_margin_lu` (how far it sits under the voice). Credits and warnings go here too: a margin under 10 LU, or a
     final level outside −31 … −23;
   - `sound_captions.json`: the sound-caption sidecar.

In the movie's `manifest.json`, copy `sound.json → credits` into the credits list.

## 4. Captions for sounds

Captions are still written from the script. Sound captions are extra lines that hold only `[ … ]`, at the cue times in
`sound_captions.json`. Check them with the opt-in flag:

```bash
.venv/Scripts/python.exe tools/movie_qa.py movie.mp4 --captions en.vtt --storyboard storyboard.yaml --sound-cues sound_captions.json
```

`captions_gate_with_sounds` (only used with `--sound-cues`; the default gate is unchanged) passes a line that is wholly
bracketed only if all of the following hold:
- the sidecar lists the same text at an overlapping time (±0.5 s);
- every sidecar sound is captioned;
- no line mixes words and brackets.

The sound lines are then removed and the **spoken words are compared with the script exactly as before**. Without
`--sound-cues`, any bracketed caption still fails the gate.

## 5. Checks (`check.py`)

```bash
.venv/Scripts/python.exe tools/sound/check.py outputs/sound/demos/*.wav --png outputs/sound/checks/demos
.venv/Scripts/python.exe tools/sound/check.py --kind sfx outputs/sound/sfx/*.wav --png outputs/sound/checks/sfx
```

| metric | pass when |
|---|---|
| true peak | ≤ −1 dBTP, and no full-scale samples |
| DC | ≤ −60 dBFS |
| below 30 Hz | ≤ −20 dB of the total |
| music: energy above 6 kHz / above 10 kHz | ≤ −20 / −35 dB of the total |
| music: clicks | none |
| sfx: energy above 10 kHz | ≤ −18 dB of the total |

Clicks are counted as 1-ms frames of the band above 12 kHz that sit 24 dB over their 200-ms median. The count means
something only for music and effect stems: speech sibilants trigger it, so ignore it for a mix with narration. Look at
the PNGs as well: waveform, spectrogram and long-term spectrum.

## 6. Licences and recorded libraries

| source | licence | verdict for this public repo and its movies |
|---|---|---|
| **ours** (`styles.py`, `sfx.py`) | CC0-1.0 | ✔ the default for everything |
| Kenney audio packs | CC0 ("all game assets … public domain (CC0)", kenney.nl/support) | ✔ allowed, but the packs are interface, impact, RPG, sci-fi and casino sounds, with no rain, wind, water or thunder; our `tick` and `whoosh` already cover the UI cases |
| Freesound, CC0 only | CC0 per sound (filter `license:"Creative Commons 0"`) | ✔ allowed per file. It needs an account and an API key: search and previews work with a token, but **original-file download needs OAuth2**. Not used (no account was created). |
| Sonniss GDC bundles | royalty-free, no attribution; **no redistribution of the files "as sound effects", modified or not; no AI training** (licence v2.0, 2026) | ✘ for the repo (the raw files can't be committed). It could be used inside a rendered movie with the raw files kept on G: only, but the bundles are multi-GB, so nothing was downloaded |
| BBC Sound Effects (RemArc) | personal, educational and research use only; non-commercial; BBC credit expected | ✘ it needs attribution (the house style allows no sound that needs on-screen credit), and its terms do not allow public redistribution |
| Pixabay sounds | Pixabay Content License: no attribution, but **no standalone redistribution**; not CC0 | ✘ for the repo. It could be used in a movie with the raw file kept off the repo; the mixer's `sample:` refuses it unless that rule is changed |

No recorded sounds are used or downloaded at present. If one is ever used, it has to meet all of these:
- store it under `G:/Geophysical Fluid Dynamics/aofd-data/raw/SFX/`;
- record it in `data/registry.yaml` with its licence and source URL;
- reference it from the cue sheet as `sample: {path, licence: CC0-1.0, source, registry}`;
- let `sound.json` carry its credit.
