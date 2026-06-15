use leptos::*;

#[component]
pub fn Ch02() -> impl IntoView {
    view! {
        <h2 class="text-3xl font-black mb-2 text-white">"2. From Fourier to Laplace — Adding a Real Axis"</h2>
        <p class="text-zinc-400 italic mb-8">
            "The single most useful sentence in this entire guide: the Fourier transform is the Laplace transform restricted to the imaginary axis. Everything else flows from understanding what the rest of the complex plane buys you."
        </p>

        <section class="space-y-5 text-zinc-300 leading-relaxed">
            <h3 class="text-xl font-bold text-white mt-4 mb-3">"The Fourier transform in one line"</h3>
            <p>
                "Recall the continuous-time Fourier transform:"
            </p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "X(jω) = ∫ x(t) · e⁻ʲωᵗ dt"
            </div>
            <p>
                "It takes a signal "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"x(t)"</code>
                " and returns, for every angular frequency "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"ω"</code>
                ", a complex number whose magnitude is the amplitude of that frequency component and whose angle is its phase. The integrand multiplies "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"x(t)"</code>
                " by a "
                <em>"pure complex sinusoid"</em>
                " — "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"e⁻ʲωᵗ = cos(ωt) − j·sin(ωt)"</code>
                " — and sums."
            </p>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"The convergence problem"</h3>
            <p>
                "The Fourier integral has a fatal flaw: it only converges for signals that don't grow. If "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"x(t)"</code>
                " gets too large for too long, the integral diverges. So Fourier "
                <em>"cannot"</em>
                " handle:"
            </p>
            <ul class="space-y-1 ml-6 list-disc text-zinc-300">
                <li>"Growing exponentials like "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"e^(2t)"</code>"."</li>
                <li>"Even the unit step "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"u(t)"</code>" (without distributional tricks)."</li>
                <li>"Anything from an unstable system before it's been forcibly stabilized."</li>
            </ul>
            <p>
                "This matters: most "
                <em>"interesting"</em>
                " engineering systems are transient — they have to ring up, decay, settle — and many real-world systems can go unstable. We need a transform that doesn't fall over on its own building blocks."
            </p>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"The fix: tilt the exponent"</h3>
            <p>
                "Replace the imaginary exponent "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"jω"</code>
                " with a "
                <em>"complex"</em>
                " exponent "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"s = σ + jω"</code>
                ". You get the Laplace transform:"
            </p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "X(s) = ∫ x(t) · e⁻ˢᵗ dt"
            </div>
            <p>
                "Now factor the exponential:"
            </p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "e⁻ˢᵗ  =  e^(−(σ + jω)t)  =  e^(−σt) · e^(−jωt)"
            </div>
            <p>
                "Read the two factors:"
            </p>
            <ul class="space-y-1 ml-6 list-disc text-zinc-300">
                <li>
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"e⁻ʲωᵗ"</code>
                    " — Fourier's oscillation. Unchanged."
                </li>
                <li>
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"e^(−σt)"</code>
                    " — a "
                    <em>"convergence envelope."</em>
                    " For "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"σ > 0"</code>
                    " it decays in time; for "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"σ < 0"</code>
                    " it grows; for "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"σ = 0"</code>
                    " we're back to Fourier."
                </li>
            </ul>

            <div class="my-8 p-5 rounded-xl bg-violet-500/5 border-l-4 border-violet-400">
                <p class="text-violet-100 m-0">
                    <strong>"The whole story in one line:"</strong>
                    " the Laplace transform multiplies your signal by a "
                    <em>"decaying"</em>
                    " envelope before doing a Fourier-like integral. By choosing a big enough "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"σ"</code>
                    ", we can drag almost any signal — even a growing exponential — back into something the integral can absorb."
                </p>
            </div>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Fourier ⊂ Laplace"</h3>
            <p>
                "Set "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"σ = 0"</code>
                " and the Laplace transform collapses back to the Fourier transform:"
            </p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "X(jω) = X(s)|_(s = jω)"
            </div>
            <p>
                "Graphically: the Fourier transform is the "
                <em>"slice"</em>
                " of the Laplace transform along the imaginary axis of the s-plane. The Laplace transform is defined on a whole vertical strip of the complex plane; Fourier is one vertical line through that strip."
            </p>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"A concrete example"</h3>
            <p>
                "Take "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"x(t) = e^(2t)·u(t)"</code>
                " — a growing exponential, on for t ≥ 0. Its Fourier transform "
                <em>"does not exist"</em>
                " — the integral blows up. But its Laplace transform exists whenever the "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"e^(−σt)"</code>
                " envelope decays faster than "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"e^(2t)"</code>
                " grows — i.e. whenever "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"σ > 2"</code>
                ". For all such "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"s"</code>
                ":"
            </p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "X(s) = ∫₀^∞ e^(2t) · e⁻ˢᵗ dt = 1 / (s − 2)"
            </div>
            <p>
                "Read the result: a closed-form rational function of "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"s"</code>
                " with a "
                <strong class="text-violet-300">"pole at s = 2"</strong>
                ". That pole is exactly the growth rate of the original signal. The transform doesn't hide the growth — it puts it in your face as a pole on the right half of the s-plane."
            </p>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Bilateral vs unilateral"</h3>
            <p>
                "There are two integration ranges in common use:"
            </p>
            <ul class="space-y-1 ml-6 list-disc text-zinc-300">
                <li>
                    <strong class="text-violet-300">"Bilateral Laplace transform:"</strong>
                    " integrate from "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"−∞ to ∞"</code>
                    ". This is the theoretically clean object."
                </li>
                <li>
                    <strong class="text-violet-300">"Unilateral Laplace transform:"</strong>
                    " integrate from "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"0⁻ to ∞"</code>
                    ". This is the one engineers use, because it bakes in causality and initial conditions, and because every real system is switched on at some moment."
                </li>
            </ul>
            <p>
                "When this guide says "
                <em>"Laplace transform"</em>
                " without qualification it means the unilateral one — that's the version that solves switched circuits and step-response problems."
            </p>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"What you should take from this chapter"</h3>
            <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
                <ul class="space-y-2 text-zinc-300 m-0 list-none p-0">
                    <li>"• The Laplace transform replaces Fourier's "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"jω"</code>" with a complex "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"s = σ + jω"</code>"."</li>
                    <li>"• That "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"σ"</code>" buys an "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"e^(−σt)"</code>" convergence envelope — handles transient and growing signals that wreck the Fourier integral."</li>
                    <li>"• Fourier = Laplace evaluated on the imaginary axis "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"s = jω"</code>"."</li>
                    <li>"• Engineers default to the "<em>"unilateral"</em>" Laplace transform: integrate from 0⁻ to ∞."</li>
                    <li>"• Growth rates in the time domain become "<strong>"poles"</strong>" in the s-domain — already foreshadowing the stability story to come."</li>
                </ul>
            </div>

            <p>"Next: where exactly in the s-plane does the integral actually converge? That's the region of convergence — and getting it wrong is how you confuse two completely different signals that happen to have the same algebraic transform."</p>
        </section>
    }
}
