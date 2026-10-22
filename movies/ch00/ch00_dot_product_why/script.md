# ch00_dot_product_why — "Why times the other length? What the dot product really measures" (Chapter 0A, 170 s)

Made now at the user's request (U-A.17 in `reports/ch00_poc_user_feedback.md`), outside the Chapter-0 batch order; see
`movies/ch00/plan.md`. Voice Kokoro `af_bella`, speed 1.0, no music. Chapter-0 informal voice.

**Measured, not estimated:** `tools/tts.py` dry run of this script on 2026-10-22, written to the session scratchpad
(not the repo), with the storyboard's `lexicon_additions` applied by hand to the audio text: 36 sentences, **168.975 s**
of audio (5070 frames at 30 fps), self-check diff 0.0 ms, −16.46 LUFS, true peak −1.50 dBTP; 36 caption cues, max 42
characters per line, max 15.4 characters per second, cues 2.25–6.15 s. **385 words → 136.7 words per minute.** A silent
1.025-s hold on the end card makes 170.0 s. The motion-builder re-runs `tools/tts.py` once the lexicon entries are
added and takes the final cut points from `timing.json`.

**Vector letters.** Kokoro reads a lone "a" as the article "uh" (ɐ), and the respelling "ay" as "eye" (aɪ). The vector
a is therefore only ever spoken inside "arrow a", "Arrow a" or "a dot b"; the lexicon phrase entries turn these into
"arrow A", "Arrow A" and "[A](/ˈA/) dot b" (misaki's inline phoneme override) in the AUDIO only. Captions keep this text.

Lines starting with ">" are notes and are not spoken.

## s1_hook
Here's a puzzle: the shadow of one arrow on another looks like the natural answer. So why does the dot product multiply that shadow by the other arrow's length?

> 29 words · 2 sentences · speech 0.30–11.18 s · scene 0.000–11.975 s (frames 0–359). The question is on screen from frame 0.

## s2_two_faces
Arrow a is five, one, and arrow b is one, three. Multiply matching parts and add: five times one, plus one times three, is eight. Geometry gives eight too: both lengths, times the cosine of the angle. The length of arrow a times that cosine is its shadow on b.

> 50 words · 4 sentences · speech 11.97–32.27 s · scene 11.975–33.075 s.
> Spoken maths: "five times one, plus one times three, is eight" = a₁b₁ + a₂b₂ = 5·1 + 1·3 = 8, (K 2.2);
> "both lengths, times the cosine of the angle" = |a||b| cos θ = 5.099 × 3.162 × 0.496 = 8.000, (0A.1);
> "the length of arrow a times that cosine" = |a| cos θ = 2.530, (0A.3).

## s3_symmetry
Reason one: a shadow depends on who casts it. The shadow of arrow a on b is two point five three. But the shadow of b on arrow a is one point five seven. Multiply each by the other arrow's length, and both give eight. The dot product doesn't care about order.

> 52 words · 5 sentences · speech 33.08–53.58 s · scene 33.075–54.375 s.
> 2.530 × 3.162 = 8.000 and 1.569 × 5.099 = 8.000 (three decimals on screen, three figures spoken).

## s4_cheap
Reason two: it's cheap, with no angle and no square root. The shadow comes from it: a dot b over the length of b. When b has length one, they're the same. So a wind dotted with x hat, one unit east, gives its eastward part.

> 46 words · 4 sentences · speech 54.38–72.30 s · scene 54.375–73.100 s.
> Spoken maths: "a dot b over the length of b" = a·b/|b| = 8/√10 = 2.530, (0A.3). Wind u = (6, 8) m/s: u·x̂ = 6.00 m/s.

## s5_work
Reason three: physics needs both sizes. Pull a sled with twenty newtons, at sixty degrees, for five metres. The force's shadow is ten newtons, still a force. The dot product is fifty joules of work; walk twice as far and it doubles.

> 42 words · 4 sentences · speech 73.10–91.53 s · scene 73.100–92.325 s.
> W = F·d = 20 N × 5 m × cos 60° = 50.0 J; shadow 20 cos 60° = 10.0 N; with 2d, W = 100 J and the shadow is still 10.0 N.

## s6_advection
Now the weather: grad T is an arrow pointing towards warmer air. Its length is the steepness: one degree per hundred kilometres. The wind is ten metres per second, sixty degrees from it. Its shadow, five metres per second, is how fast the air heads towards warmth. Times the steepness: point one eight degrees an hour.

> 56 words · 5 sentences · speech 92.33–116.80 s · scene 92.325–117.600 s.
> |∇T| = 1 K per 100 km = 1.00×10⁻⁵ K/m; shadow |u| cos 60° = 5.00 m/s; u·∇T = 5.00×10⁻⁵ K/s = 0.180 K/h.
> Units: (m/s) × (K/m) = K/s. "Grad T" is the spoken name of ∇T, defined in the same sentence.

## s7_both_sizes
Mind the sign: if you stand still, the air arriving comes from the colder side. So you cool: that's minus u dot grad T. Make the map twice as steep: the shadow stays five, the cooling doubles. The shadow says how fast the air heads for warmth. The dot product says how fast you cool.

> 55 words · 5 sentences · speech 117.60–139.43 s · scene 117.600–140.225 s.
> ∂T/∂t = −u·∇T = −5.00×10⁻⁵ K/s = −0.180 K/h (−4.32 K per day); with 2|∇T|: shadow 5.00 m/s, ∂T/∂t = −0.360 K/h.
> Frames kept apart on purpose: the shadow is the moving air's speed towards warmth; the cooling is felt by someone standing still.

## s8_sign
The sign tells you the angle. Under ninety degrees, the shadow falls forward: positive. At ninety, no shadow, zero. Past ninety, it falls behind: negative. Opposite, it points backwards: a dot b is minus sixteen point one.

> 37 words · 5 sentences · speech 140.22–159.78 s · scene 140.225–160.575 s.
> |b| kept at √10 while b swings: θ = 60.3° → +8.000; 90° → 0; 120° → −8.062; 180° → −16.12 = −|a||b| (shadow −5.099).

## s9_end
Three reasons: it's symmetric, it's cheap, and physics needs both sizes. Try it in the vector products lab.

> 18 words · 2 sentences · speech 160.57–168.68 s · scene 160.575–170.000 s (1.025 s silent hold on the end card).

> Total: 385 words · 36 sentences · 168.975 s audio · 170.0 s movie · 136.7 words per minute.
