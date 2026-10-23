# ch00_dot_product_why — "What the dot product measures, and why it multiplies by the other length" (Chapter 0A, round 4)

Rewritten from the ground up after the user's round-4 feedback (2026-10-22): teach first (definitions, labels,
intuition, the shadow derived step by step), then ask "why times the other length?", then three reasons, with the
weather reason rebuilt slowly around Vallis (1.7). Voice Kokoro `af_bella`, speed 1.0; music bed from `tools/music.py`
(user request; about −28 LUFS, ducked 5 dB under speech). Chapter-0 informal voice.

**Measured, not estimated.** `tools/tts.py` dry run of this exact narration on 2026-10-22, output on G:
(`aofd-data/scratch/movies/ch00_dot_product_why/dryrun/v3`), with the two new lexicon respellings (Vallis → Valiss,
Kundu → Koondoo) applied by hand to the audio copy: 21 scenes, 73 sentences, **364.725 s** of audio (10 942 frames),
self-check diff 0.0 ms, −16.4 LUFS out, true peak −1.50 dBTP; 88 caption cues, max 2 lines × 42 characters, max 15.3
characters per second, cues 1.06–6.30 s. **844 words → 138.8 words per minute.** A 2.5-s silent end-card hold makes
**367.2 s (6:07)**, inside the user's 6:00–6:10 window. Earlier drafts: v1 968 words / 417.45 s, v2 861 / 377.83 s.

**Vector letters.** Kokoro reads a lone "a" as the article. The vector a is spoken only as "arrow a " / "Arrow a "
(always followed by a space) or inside "a dot b"; the existing lexicon entries turn these into the letter name in the
AUDIO only. "0A" and "Part A" are read as the letter name without help; the spelled-out "zero A" is not, so the script
writes "0A". Captions keep this text.

Lines starting with ">" are notes and are not spoken. Times are scene start–end in the movie (seconds).

## s01_hook
Two arrows in, one number out: the dot product. First, what it is. Then, why it's built this way.

> 19 words · 3 sentences · 0.000–9.975 s · hook: arrows + the number 8 on the gauge within 3 s.

## s02_arrows
An arrow, or vector, has a length and a direction. Arrow a goes five right and one up: five, one. Arrow b is one, three; the numbers are components. Pythagoras gives the lengths: about five point one and three point one six.

> 42 words · 4 sentences · 9.975–28.425 s.
> Spoken maths: "five, one" = a = (5, 1); |a| = √(5² + 1²) = √26 = 5.099; |b| = √(1² + 3²) = √10 = 3.162.

## s03_def_components
Definition one: multiply matching parts, then add. The small number under each letter says which part. The last form writes i twice: a repeated index means add over i equals one, two and three.

> 34 words · 3 sentences · 28.425–44.400 s.
> On screen (K 2.2): a·b = a₁b₁ + a₂b₂ + a₃b₃ ≡ aᵢbᵢ; annotation aᵢbᵢ means Σᵢ₌₁³ aᵢbᵢ; "≡" = "is defined as".

## s04_labels
K two point two is equation two point two of Kundu, Cohen and Dowling's Fluid Mechanics, fifth edition. Labels with 0A, the digit zero, are ours: Chapter Zero, Part A of this course. Vallis labels point to the main book, and the footnote gives each page.

> 46 words · 3 sentences · 44.400–64.250 s. Answers the user's guess (K = Kundu yes; "O" is the DIGIT zero of "0A", not Vallis).
> Card: K = Kundu, Cohen & Dowling, Fluid Mechanics, 5th ed. (2012) · 0A = Chapter 0 Part A, our label · Vallis,
> Atmospheric and Oceanic Fluid Dynamics, 2nd ed. (2017).

## s05_example
Try it: five times one, plus one times three, is eight. The z-parts are zero here. Eight is a number, not an arrow.

> 23 words · 3 sentences · 64.250–74.800 s. 5·1 + 1·3 + 0·0 = 8.

## s06_def_cosine
Definition two uses theta, the angle between the arrows: both lengths times the cosine of theta. Cosine is one for the same direction, zero at a right angle, minus one for opposite. Here it's point four nine six: eight again.

> 40 words · 3 sentences · 74.800–92.925 s.
> (0A.1): a·b = |a||b| cos θ = 5.099 × 3.162 × cos 60.3° = 5.099 × 3.162 × 0.496 = 8.000; cos 0° = 1, cos 90° = 0, cos 180° = −1.

## s07_same_way
So the dot product measures how much two arrows point the same way. Three, zero with two, zero: six. At a right angle, zero; backwards, minus six.

> 27 words · 3 sentences · 92.925–105.350 s. p = (3, 0): p·(2, 0) = 6, p·(0, 2) = 0, p·(−2, 0) = −6.

## s08_shadow
Drop a line from the tip of arrow a onto b's line, at a right angle. The stretch it marks off is the shadow of arrow a on b. In this right-angled triangle, arrow a is the long side. The shadow is the side next to theta, so it's the length of arrow a times cos theta. Divide definition two by the length of b: it cancels on the right, leaving the shadow, a dot b over the length of b. Eight over three point one six two: two point five three. And b over its own length, b hat, is b shrunk to length one. So the shadow is also a dot b hat.

> 115 words · 8 sentences · 105.350–148.050 s. One move per step (DerivationStrip):
> cos θ = shadow ÷ |a| → shadow = |a| cos θ → a·b/|b| = |a||b| cos θ/|b| → a·b/|b| = |a| cos θ → 8 ÷ 3.162 = 2.530
> → a·b/|b| = a·(b/|b|) = a·b̂ → check 5(0.316) + 1(0.949) = 2.530; then (0A.3) assembled.

## s09_question
So the dot product is the shadow times the length of b. Why not just stop at the shadow?

> 19 words · 2 sentences · 148.050–155.475 s. On screen: a·b = (shadow of a on b) × |b|; "Why multiply by |b|? Why not stop at the shadow?"

## s10_reason1_order
Reason one: order. The shadow of arrow a on b is two point five three. The shadow of b on arrow a is one point five seven. Times the other length, both give eight.

> 34 words · 4 sentences · 155.475–170.175 s. 2.530 × 3.162 = 8.000 = 1.569 × 5.099.

## s11_reason2_cheap
Reason two: it's cheap: no angle, no square root. The shadow comes from it by one division. If b has length one, a dot b over one is just a dot b: the dot product is the shadow. That's how x hat, one unit east, picks out a wind's eastward part.

> 51 words · 4 sentences · 170.175–190.700 s.
> On screen: "if |b| = 1: a·b ÷ |b| = a·b ÷ 1 = a·b, so the dot product equals the shadow: a·b̂ = 2.530";
> wind v = (6, 8) m/s, v·x̂ = 6 × 1 + 8 × 0 = 6.00 m/s.

## s12_reason3_work
Reason three: physics needs both sizes. Pull a sled with twenty newtons, at sixty degrees, for five metres. The force's shadow, ten newtons, is still a force. Times five metres: fifty joules of work; twice as far, double the work.

> 40 words · 4 sentences · 190.700–209.975 s. 20 cos 60° = 10.0 N; W = 10.0 N × 5 m = 50.0 J; × 10 m = 100 J.

## s13_vallis17
Now the weather. This is Vallis one point seven. Phi is anything the air carries; here, temperature T. Vallis calls the wind v.

> 23 words · 4 sentences · 209.975–222.625 s. (Vallis 1.7) Dφ/Dt = ∂φ/∂t + (v·∇)φ at the top; φ = T; bold v = the wind.

## s14_two_thermometers
Picture two thermometers. One is fixed on a pole: partial T by partial t is how fast it changes. One rides a balloon with the air: D T by D t, the material derivative. The last term, v dot grad T, is the extra change from moving through the temperature map. Balloon's change equals pole's change, plus the change from crossing the slope, called advection: carrying by the wind.

> 69 words · 5 sentences · 222.625–253.025 s. DT/Dt (balloon) = ∂T/∂t (pole) + v·∇T (crossing the slope = advection).

## s15_grad_t
Grad T is an arrow of two slopes: how fast T changes per metre east, and per metre north. It points uphill, towards warmer air; its length is the steepness. Here, one degree per hundred kilometres east: ten to the minus five kelvin per metre.

> 45 words · 3 sentences · 253.025–272.150 s. ∇T = (∂T/∂x, ∂T/∂y) = (1 K per 100 km, 0) = (1.00×10⁻⁵ K/m, 0).

## s16_calculation
The wind is ten metres per second, sixty degrees from grad T. Its shadow: five metres per second. Times the steepness: five times ten to the minus five kelvin per second, point one eight kelvin per hour.

> 37 words · 3 sentences · 272.150–288.875 s.
> v·∇T = (shadow of v on ∇T) × |∇T| = (|v| cos θ) × |∇T| = (10.0 cos 60°) m/s × 1.00×10⁻⁵ K/m = 5.00×10⁻⁵ K/s = 0.180 K/h.

## s17_rate_in_time
Does the map warm by point one eight an hour? No, the map stays put; its slope is a rate in space. The air heads towards warmth at eighteen kilometres an hour. Each hour, it reaches places point one eight degrees warmer.

> 42 words · 4 sentences · 288.875–306.375 s.
> 5.00 m/s × 3600 s = 18.0 km per hour towards warmer air (36.0 km along the wind); 18.0 km × 1 K per 100 km = 0.180 K;
> map under the balloon 13.00 → 13.18 °C after 1 h.

## s18_label_zero
Suppose each parcel keeps its temperature: no sunshine, no mixing. It carries it like a label, so D T by D t is zero. Put zero in, then subtract v dot grad T from both sides: partial T by partial t equals minus v dot grad T.

> 47 words · 3 sentences · 306.375–326.100 s. 0 = ∂T/∂t + v·∇T → subtract v·∇T from both sides → ∂T/∂t = −v·∇T.

## s19_pole_cools
So the thermometer on the pole falls point one eight degrees an hour, over four a day. The arriving air comes from colder places upwind.

> 25 words · 2 sentences · 326.100–336.575 s. ∂T/∂t = −5.00×10⁻⁵ K/s = −0.180 K/h = −4.32 K per day; pole 13.00 → 12.82 → 11.92 °C (1 h, 6 h); balloon stays 13.00 °C.

## s20_twice_as_steep
Make the map twice as steep. The wind's shadow stays five metres per second: it belongs to the wind. But the pole cools twice as fast, point three six degrees an hour: the dot product holds the steepness, and the shadow alone doesn't.

> 43 words · 3 sentences · 336.575–354.775 s. |∇T| = 2.00×10⁻⁵ K/m; shadow 5.00 m/s; ∂T/∂t = −0.360 K/h (−8.64 K per day); pole 13.00 → 12.64 → 10.84 °C.

## s21_recap_end
Three reasons, then: it's the same both ways, it's cheap, and physics needs both sizes. Try it yourself in the vector products lab.

> 23 words · 2 sentences · 354.775–367.225 s (speech ends 364.425 s; 2.5-s silent hold from 364.725 s). Sign rule on screen only.

> Total: 844 words · 73 sentences · 364.725 s audio · 367.225 s movie (6:07) · 138.8 words per minute.
