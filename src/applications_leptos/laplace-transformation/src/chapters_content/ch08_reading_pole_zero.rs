use leptos::*;

#[component]
pub fn Ch08() -> impl IntoView {
    view! {
        <h2 class="text-3xl font-black mb-2 text-white">"8. Reading Pole-Zero Plots — Layout Dictates Response"</h2>
        <p class="text-zinc-400 italic mb-8">
            "A pole-zero plot is the most information-dense diagram in signal processing. Once you can read one, you can almost skip the time-domain plot entirely — the layout already tells you everything qualitative."
        </p>

        <section class="space-y-5 text-zinc-300 leading-relaxed">
            <h3 class="text-xl font-bold text-white mt-4 mb-3">"The notation"</h3>
            <p>"By convention:"</p>
            <ul class="space-y-1 ml-6 list-disc text-zinc-300">
                <li>"Poles are drawn as "<strong class="text-violet-300">"×"</strong>" (cross or X)."</li>
                <li>"Zeros are drawn as "<strong class="text-violet-300">"○"</strong>" (small circle)."</li>
                <li>"Complex poles/zeros come in conjugate pairs for real-coefficient systems."</li>
                <li>"Multiplicity is written as a small superscript next to the symbol, e.g. "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"×²"</code>" for a double pole."</li>
            </ul>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Five plots, five behaviors"</h3>

            <h4 class="text-lg font-bold text-violet-300 mt-6 mb-2">"(a) A single pole at s = −2"</h4>
            <p>"One real pole, in the LHP, at distance 2 from the imaginary axis."</p>
            <ul class="space-y-1 ml-6 list-disc text-zinc-300">
                <li>"Impulse response: "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"h(t) = e^(−2t) u(t)"</code>"."</li>
                <li>"Decay rate "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"σ = 2"</code>" → time constant "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"τ = 1/2"</code>" s."</li>
                <li>"Frequency response: first-order low-pass with cutoff at 2 rad/s."</li>
                <li>"This is what every RC low-pass with "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"RC = 0.5"</code>" looks like."</li>
            </ul>

            <h4 class="text-lg font-bold text-violet-300 mt-6 mb-2">"(b) A complex-conjugate pair at s = −0.5 ± 4j"</h4>
            <ul class="space-y-1 ml-6 list-disc text-zinc-300">
                <li>"Decay rate "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"σ = 0.5"</code>" → slow envelope decay."</li>
                <li>"Damped frequency "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"ω_d = 4 rad/s"</code>" → fast ringing inside that envelope."</li>
                <li>"Impulse response: "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"h(t) ∝ e^(−0.5 t) sin(4 t)"</code>"."</li>
                <li>"Underdamped second-order: rings, decays slowly. The classical bell-with-decay impulse response."</li>
            </ul>
            <p>
                "Read off the damping ratio geometrically: "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"ζ = σ / √(σ² + ω_d²) = 0.5 / √(0.25 + 16) ≈ 0.124"</code>
                " — extremely lightly damped, deep ringing."
            </p>

            <h4 class="text-lg font-bold text-violet-300 mt-6 mb-2">"(c) Two real poles, s = −1 and s = −10"</h4>
            <ul class="space-y-1 ml-6 list-disc text-zinc-300">
                <li>"Overdamped second-order."</li>
                <li>"Impulse response is a sum of two decaying exponentials. The "<em>"slow"</em>" pole at "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"s = −1"</code>" dominates for "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"t ≫ 0.1"</code>" — it is closest to the imaginary axis, decays the slowest, lingers the longest."</li>
                <li>"Practical takeaway: in an overdamped system, the "<strong class="text-violet-300">"slowest"</strong>" pole (closest to the imaginary axis) sets the long-term settling time. The faster pole only affects the early-time behavior."</li>
            </ul>

            <h4 class="text-lg font-bold text-violet-300 mt-6 mb-2">"(d) A right-half-plane pole at s = +1"</h4>
            <ul class="space-y-1 ml-6 list-disc text-zinc-300">
                <li>"Impulse response: "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"e^(+t) u(t)"</code>" — runaway exponential."</li>
                <li>"Unstable. There is "<em>"no"</em>" bounded input that produces a bounded output here. Done."</li>
                <li>"In real systems this means: amplifier saturating, motor spinning up to limit, integrator winding up, etc."</li>
            </ul>

            <h4 class="text-lg font-bold text-violet-300 mt-6 mb-2">"(e) Pole + zero on top of each other (pole-zero cancellation)"</h4>
            <ul class="space-y-1 ml-6 list-disc text-zinc-300">
                <li>"Algebraically the factor cancels and the system order drops by one."</li>
                <li>"In practice: "<strong class="text-violet-300">"never"</strong>" trust cancellation against a right-half-plane pole. Parameter drift will move the zero off the pole and reveal a hidden unstable mode. Cancellations against LHP poles are usually fine."</li>
            </ul>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Zeros, separately"</h3>
            <p>
                "Zeros don't cause stability problems, but they do shape the frequency response. A zero at "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"s = jω₀"</code>
                " on the imaginary axis carves a "
                <strong class="text-violet-300">"notch"</strong>
                " at that frequency. (How AC mains hum gets filtered out of audio: notch the transfer function at "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"±2π · 60 jω"</code>
                ".) A zero in the right half-plane causes "
                <strong class="text-violet-300">"non-minimum-phase"</strong>
                " behavior — the step response initially moves the "
                <em>"wrong"</em>
                " way before coming back. Boilers, certain aircraft pitch dynamics, and beam steering all have RHP zeros."
            </p>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Speed-reading the plot"</h3>
            <p>"Glance and answer in ten seconds:"</p>
            <ol class="space-y-1 ml-6 list-decimal text-zinc-300">
                <li><strong>"Is the rightmost pole to the right of the imaginary axis?"</strong>" If yes, unstable."</li>
                <li><strong>"Is it on the imaginary axis?"</strong>" If yes, marginally stable (oscillator)."</li>
                <li><strong>"Is it in the LHP?"</strong>" How far left? That's your settling rate."</li>
                <li><strong>"Are there complex pairs?"</strong>" If yes, the system rings; the imaginary part of the pole tells you at what frequency."</li>
                <li><strong>"Are there zeros on/near the imaginary axis?"</strong>" Then the response has a notch there."</li>
                <li><strong>"Are there RHP zeros?"</strong>" Then the step response will reverse direction briefly — non-minimum-phase. Plan controller bandwidth accordingly."</li>
            </ol>

            <div class="my-8 p-5 rounded-xl bg-violet-500/5 border-l-4 border-violet-400">
                <p class="text-violet-100 m-0">
                    <strong>"The mental shortcut:"</strong>
                    " whenever someone shows you a pole-zero plot, find the "
                    <em>"dominant"</em>
                    " pole (the one closest to the imaginary axis). That single pole controls how the system feels — its settling time and any ringing frequency. The other poles add detail; the dominant pole "
                    <em>"is"</em>
                    " the system, to first approximation."
                </p>
            </div>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"What you should take from this chapter"</h3>
            <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
                <ul class="space-y-2 text-zinc-300 m-0 list-none p-0">
                    <li>"• × = pole, ○ = zero. Complex roots come in conjugate pairs."</li>
                    <li>"• Distance from the imaginary axis = speed of decay/growth."</li>
                    <li>"• Vertical position = ringing frequency."</li>
                    <li>"• Pole-zero cancellation against RHP poles is structurally dangerous. Against LHP poles it is usually OK."</li>
                    <li>"• Zeros on the imaginary axis create notches; RHP zeros create non-minimum-phase behavior."</li>
                    <li>"• The dominant pole (closest to the imaginary axis) controls the long-term qualitative response."</li>
                </ul>
            </div>

            <p>"Next: how to invert the Laplace transform when you actually have a rational expression in "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"s"</code>" — partial fractions, the workhorse of every textbook problem."</p>
        </section>
    }
}
