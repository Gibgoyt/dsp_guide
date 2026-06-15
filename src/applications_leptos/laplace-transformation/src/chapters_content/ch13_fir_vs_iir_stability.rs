use leptos::*;

#[component]
pub fn Ch13() -> impl IntoView {
    view! {
        <h2 class="text-3xl font-black mb-2 text-white">"13. FIR vs IIR — Where Pole/Zero Analysis Actually Matters"</h2>
        <p class="text-zinc-400 italic mb-8">
            "Of every Laplace and Z-transform concept developed so far, "
            <em>"this"</em>
            " is the one you will use most often in a working DSP role: deciding which class of digital filter to design, and verifying that your IIR design is actually stable."
        </p>

        <section class="space-y-5 text-zinc-300 leading-relaxed">
            <h3 class="text-xl font-bold text-white mt-4 mb-3">"FIR — Finite Impulse Response"</h3>
            <p>"A finite-impulse-response filter has the difference equation:"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "y[n]  =  b₀ x[n]  +  b₁ x[n−1]  +  ⋯  +  b_M x[n−M]"
            </div>
            <p>
                "No "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"y[n−k]"</code>
                " terms on the right. The output depends only on the present and past "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"M+1"</code>
                " samples of the input. No feedback. The impulse response is "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"(b₀, b₁, …, b_M)"</code>
                " and then zeros forever — finite, hence the name."
            </p>
            <p>"Its transfer function:"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "H(z)  =  b₀ + b₁ z⁻¹ + ⋯ + b_M z^(−M)"
            </div>
            <p>"Multiply numerator and denominator by "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"z^M"</code>" to expose the pole structure explicitly:"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "H(z)  =  ( b₀ z^M + b₁ z^(M−1) + ⋯ + b_M ) / z^M"
            </div>
            <p>
                "Every pole sits at "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"z = 0"</code>
                " — the "
                <em>"origin"</em>
                " of the z-plane — repeated with multiplicity "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"M"</code>
                ". The origin is automatically inside the unit circle. Hence:"
            </p>
            <div class="my-8 p-5 rounded-xl bg-emerald-500/5 border-l-4 border-emerald-400">
                <p class="text-emerald-100 m-0">
                    <strong>"FIR filters are unconditionally stable."</strong>
                    " No matter what tap coefficients "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"b_k"</code>
                    " you pick — uniform average, Hamming-windowed sinc, matched-filter coefficients, learned coefficients — the filter is stable. There is no way to make an FIR filter unstable, because there are no feedback poles to place."
                </p>
            </div>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"What FIR buys you, what it costs"</h3>
            <ul class="space-y-1 ml-6 list-disc text-zinc-300">
                <li><strong class="text-violet-300">"Buys:"</strong>" unconditional stability; possible "<em>"exactly linear phase"</em>" (no phase distortion) when coefficients are symmetric or antisymmetric; trivial parallelism."</li>
                <li><strong class="text-violet-300">"Costs:"</strong>" to achieve sharp magnitude responses you generally need many more taps than an equivalent IIR — more compute, more latency, more memory."</li>
            </ul>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"IIR — Infinite Impulse Response"</h3>
            <p>"An infinite-impulse-response filter has feedback:"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "y[n]  =  Σ b_k x[n−k]  −  Σ a_k y[n−k]"
            </div>
            <p>"The "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"y[n−k]"</code>" terms make the impulse response decay rather than truncate — it lingers, in principle, forever. The transfer function:"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "H(z)  =  ( b₀ + b₁ z⁻¹ + ⋯ + b_M z^(−M) )  /  ( 1 + a₁ z⁻¹ + ⋯ + a_N z^(−N) )"
            </div>
            <p>"Now the denominator has nontrivial roots — "<strong>"real feedback poles"</strong>". And those poles can be placed anywhere in the z-plane. If you put one outside the unit circle, the filter is unstable: the impulse response grows without bound."</p>

            <div class="my-8 p-5 rounded-xl bg-violet-500/5 border-l-4 border-violet-400">
                <p class="text-violet-100 m-0">
                    <strong>"Designing an IIR filter is a pole-placement exercise."</strong>
                    " Every classical IIR family — Butterworth, Chebyshev I and II, elliptic, Bessel — is a recipe for placing poles "
                    <em>"inside the unit circle"</em>
                    " with a particular optimization criterion. Verifying an IIR design means checking, numerically, that "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"max |pole| < 1"</code>
                    "."
                </p>
            </div>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Two design routes — bilinear transform"</h3>
            <p>"The cheapest way to design an IIR filter is to design a continuous-time analog filter (Butterworth/Chebyshev/etc.), where the s-plane stability rule applies, and then "<em>"warp"</em>" the s-plane into the z-plane via the "<strong class="text-violet-300">"bilinear transform"</strong>":"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "s  =  (2/T) · (z − 1) / (z + 1)"
            </div>
            <p>"It maps the LHP exactly onto the inside of the unit circle and vice versa, so a stable analog filter becomes a stable digital filter automatically. The cost is a "<em>"frequency warping"</em>" — the analog and digital frequency axes are related nonlinearly, and you pre-warp critical frequencies before the analog design step. This is the single most common analog-to-digital filter design path, hands down."</p>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"FIR or IIR — what to pick"</h3>
            <p>"Rough working rules:"</p>
            <ul class="space-y-1 ml-6 list-disc text-zinc-300">
                <li><strong class="text-violet-300">"Use FIR"</strong>" when you need linear phase, when stability robustness matters more than tap count, when you can parallelize taps, or when fixed-point quantization of coefficients in IIR could push a pole outside the unit circle."</li>
                <li><strong class="text-violet-300">"Use IIR"</strong>" when you need a sharp magnitude response at low computational cost, when phase distortion is acceptable, and when the design pipeline (e.g. bilinear from an analog prototype) is convenient."</li>
                <li>"In radar and high-speed DSP, FIRs dominate because of linear phase, predictability under fixed-point math, and parallelizability on FPGA/SIMD. IIRs are common for housekeeping (envelope detectors, AGC loops) and slow-control work."</li>
            </ul>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Quantization gotcha"</h3>
            <p>"In real hardware (especially fixed-point), the IIR coefficients you "<em>"design"</em>" are not exactly the coefficients you "<em>"deploy"</em>" — they get rounded. For high-order IIR filters, a tiny perturbation can move a pole outside the unit circle. The defense: "<strong class="text-violet-300">"second-order sections"</strong>" (SOS / biquads), which cascade many 2nd-order IIR stages instead of one big direct form. Each stage is robust under quantization; the cascade preserves the overall response."</p>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"What you should take from this chapter"</h3>
            <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
                <ul class="space-y-2 text-zinc-300 m-0 list-none p-0">
                    <li>"• FIR = no feedback = all transfer-function poles at z = 0 = "<strong>"unconditionally stable"</strong>"."</li>
                    <li>"• IIR = feedback = real poles in the z-plane that "<em>"must"</em>" be placed inside the unit circle."</li>
                    <li>"• Bilinear transform "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"s = (2/T)(z−1)/(z+1)"</code>" maps the LHP to the unit disc, automating analog→digital filter design while preserving stability."</li>
                    <li>"• In production, IIR filters are usually implemented as cascades of 2nd-order sections to survive coefficient quantization."</li>
                    <li>"• This — IIR pole placement and the FIR/IIR trade — is where Laplace/Z transform analysis "<em>"actually"</em>" lives day-to-day in DSP work."</li>
                </ul>
            </div>

            <p>"Next chapter is the calibration: a sober look at where Laplace and Z analysis earn their keep in radar work — and where they do not."</p>
        </section>
    }
}
