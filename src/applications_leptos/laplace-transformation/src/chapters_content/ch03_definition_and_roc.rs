use leptos::*;

#[component]
pub fn Ch03() -> impl IntoView {
    view! {
        <h2 class="text-3xl font-black mb-2 text-white">"3. The Definition and the Region of Convergence"</h2>
        <p class="text-zinc-400 italic mb-8">
            "Two different time-domain signals can produce the "
            <em>"same"</em>
            " algebraic Laplace transform. The thing that tells them apart is the region of convergence — the slice of the s-plane where the integral actually converges. Skip it and you will confuse stable and unstable systems."
        </p>

        <section class="space-y-5 text-zinc-300 leading-relaxed">
            <h3 class="text-xl font-bold text-white mt-4 mb-3">"The definitions, formally"</h3>
            <p>"The "<strong class="text-violet-300">"bilateral Laplace transform"</strong>" of "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"x(t)"</code>" is:"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "X(s) = ∫₋∞^∞ x(t) · e⁻ˢᵗ dt"
            </div>
            <p>"The "<strong class="text-violet-300">"unilateral"</strong>" (one-sided) version, the one engineers actually use, is:"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "X(s) = ∫₀⁻^∞ x(t) · e⁻ˢᵗ dt"
            </div>
            <p>
                "The "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"0⁻"</code>
                " (a hair before 0) is a pedantic but important detail — it captures impulse-like initial conditions that fire "
                <em>"at"</em>
                " t = 0. Most textbooks just write "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"0"</code>
                " and assume you know better."
            </p>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Region of Convergence (ROC)"</h3>
            <p>
                "The integral is an improper integral. For some values of "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"s"</code>
                " it converges to a finite complex number. For others it diverges. The set of "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"s"</code>
                " for which it converges is called the "
                <strong class="text-violet-300">"Region of Convergence"</strong>
                " — the ROC."
            </p>

            <p>
                "Two structural facts about the ROC that you can rely on without proof:"
            </p>
            <ul class="space-y-1 ml-6 list-disc text-zinc-300">
                <li>
                    "The ROC depends only on "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"Re(s) = σ"</code>
                    ", not "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"Im(s) = ω"</code>
                    ". So the ROC is always a "
                    <strong>"vertical strip"</strong>
                    " (or a half-plane, or the whole plane) of the s-plane."
                </li>
                <li>
                    "The ROC never contains a pole of "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"X(s)"</code>
                    ". Poles are the exact places where the integral fails."
                </li>
            </ul>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Two famous (and famously confusing) signals"</h3>
            <p>
                "Consider these two time-domain signals — one strictly right-sided, one strictly left-sided:"
            </p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "x₁(t) =  e^(−at)·u(t)   →   X₁(s) = 1 / (s + a),   ROC: Re(s) > −a"
            </div>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "x₂(t) = −e^(−at)·u(−t)  →   X₂(s) = 1 / (s + a),   ROC: Re(s) < −a"
            </div>
            <p>
                "Same algebra. Same single pole at "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"s = −a"</code>
                ". Completely different signals. The "
                <em>"only"</em>
                " thing distinguishing them in the s-domain is the ROC: right of the pole vs left of the pole."
            </p>

            <div class="my-8 p-5 rounded-xl bg-violet-500/5 border-l-4 border-violet-400">
                <p class="text-violet-100 m-0">
                    <strong>"Why this matters in practice:"</strong>
                    " for "
                    <em>"causal"</em>
                    " systems (the engineering default — every system that respects the arrow of time), the ROC is always a "
                    <strong>"right-half-plane"</strong>
                    " bounded by the rightmost pole. Once you commit to causality, the ROC becomes redundant — fully determined by the poles — and most textbooks drop it from the notation. That works "
                    <em>"until"</em>
                    " you handle a non-causal signal or do system theory rigorously, at which point it bites."
                </p>
            </div>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"ROC for the unilateral transform"</h3>
            <p>
                "For the unilateral Laplace transform, the integral only sees the right side ("
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"t ≥ 0"</code>
                ") of the signal, so the ROC is automatically a right-half-plane:"
            </p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "ROC = { s : Re(s) > σ_max }"
            </div>
            <p>
                "where "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"σ_max"</code>
                " is the largest real part among the poles of "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"X(s)"</code>
                ". The ROC starts immediately to the right of the rightmost pole. This is the implicit assumption almost every controls and DSP textbook is operating under."
            </p>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Stability via ROC"</h3>
            <p>
                "Here's the punchline that connects ROC to system stability:"
            </p>
            <ul class="space-y-1 ml-6 list-disc text-zinc-300">
                <li>
                    "A causal system is "
                    <strong class="text-violet-300">"BIBO stable"</strong>
                    " ⇔ its Fourier transform exists ⇔ the imaginary axis lies inside the ROC ⇔ "
                    <em>"all poles of the transfer function are strictly in the left half-plane."</em>
                </li>
            </ul>
            <p>
                "We'll keep coming back to this in Chapter 7. It is the single most important sentence in linear systems theory and it falls right out of the ROC definition."
            </p>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"What you should take from this chapter"</h3>
            <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
                <ul class="space-y-2 text-zinc-300 m-0 list-none p-0">
                    <li>"• The ROC is the set of "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"s"</code>" where the Laplace integral converges. It's a vertical strip of the s-plane."</li>
                    <li>"• Two different signals can have the same algebraic transform; the ROC tells them apart."</li>
                    <li>"• Poles are never in the ROC; the ROC is bounded by the pole real parts."</li>
                    <li>"• For the unilateral (causal) transform, the ROC is automatically "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"Re(s) > σ_max"</code>"."</li>
                    <li>"• Stability of a causal LTI system ⇔ all poles strictly in the left half-plane ⇔ the imaginary axis is in the ROC."</li>
                </ul>
            </div>

            <p>"Next: the algebra magic — the property of the Laplace transform that turns a hard differential equation into easy high-school algebra."</p>
        </section>
    }
}
