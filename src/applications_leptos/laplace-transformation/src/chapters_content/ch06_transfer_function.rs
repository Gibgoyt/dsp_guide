use leptos::*;

#[component]
pub fn Ch06() -> impl IntoView {
    view! {
        <h2 class="text-3xl font-black mb-2 text-white">"6. The Transfer Function H(s) — Zeros and Poles"</h2>
        <p class="text-zinc-400 italic mb-8">
            "If there is one object that controls and DSP engineers think with, it is the transfer function. Once you've stared at enough of them, you can read off a system's behavior from twelve symbols on a page."
        </p>

        <section class="space-y-5 text-zinc-300 leading-relaxed">
            <h3 class="text-xl font-bold text-white mt-4 mb-3">"Definition"</h3>
            <p>"For an LTI system with input "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"x(t)"</code>" and output "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"y(t)"</code>", under zero initial conditions:"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "H(s)  =  Y(s) / X(s)"
            </div>
            <p>
                "Equivalently, "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"H(s) = 𝓛{h(t)}"</code>
                ", where "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"h(t)"</code>
                " is the system's "
                <strong class="text-violet-300">"impulse response"</strong>
                " — the output when the input is a Dirac delta. The transfer function is the Laplace transform of the impulse response. Read that sentence twice. It is the bridge between time-domain and s-domain thinking."
            </p>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Rational form"</h3>
            <p>"For any system described by a linear constant-coefficient ODE, "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"H(s)"</code>" is a "<em>"rational function"</em>" — a ratio of two polynomials in "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"s"</code>":"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "H(s)  =  N(s) / D(s)  =  ( bₘ sᵐ + ⋯ + b₁ s + b₀ )  /  ( aₙ sⁿ + ⋯ + a₁ s + a₀ )"
            </div>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Zeros and poles"</h3>
            <ul class="space-y-1 ml-6 list-disc text-zinc-300">
                <li>"The "<strong class="text-violet-300">"zeros"</strong>" of "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"H(s)"</code>" are the roots of the numerator "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"N(s) = 0"</code>" — values of "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"s"</code>" where the system's response collapses to zero."</li>
                <li>"The "<strong class="text-violet-300">"poles"</strong>" of "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"H(s)"</code>" are the roots of the denominator "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"D(s) = 0"</code>" — values of "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"s"</code>" where the response blows up."</li>
            </ul>
            <p>"Factor the rational form and the zeros and poles are visible immediately:"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "H(s)  =  K · (s − z₁)(s − z₂)⋯(s − zₘ) / (s − p₁)(s − p₂)⋯(s − pₙ)"
            </div>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Two canonical examples"</h3>
            <h4 class="text-lg font-bold text-violet-300 mt-6 mb-2">"First-order low-pass filter"</h4>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "H(s) = ω_c / (s + ω_c)"
            </div>
            <p>
                "One pole at "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"s = −ω_c"</code>
                ", no zeros. The DC gain "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"H(0) = 1"</code>
                ". The −3 dB cutoff is "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"ω = ω_c"</code>
                ". Asymptotically a −20 dB/decade roll-off. The classical RC low-pass with "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"ω_c = 1/RC"</code>
                "."
            </p>

            <h4 class="text-lg font-bold text-violet-300 mt-6 mb-2">"Second-order resonant system"</h4>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "H(s) = ω_n² / ( s² + 2ζω_n s + ω_n² )"
            </div>
            <p>
                "Two poles, parametrized by the natural frequency "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"ω_n"</code>
                " and damping ratio "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"ζ"</code>
                ". This is the canonical underdamped/critically-damped/overdamped form. For "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"ζ < 1"</code>
                " the poles are a complex-conjugate pair:"
            </p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "p₁,₂  =  −ζω_n  ±  j ω_n √(1 − ζ²)"
            </div>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Frequency response from the transfer function"</h3>
            <p>
                "Recall: Fourier is Laplace evaluated on the imaginary axis. So for any stable system, the frequency response is just:"
            </p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "H(jω) = H(s) | s = jω"
            </div>
            <p>
                "Substitute "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"s = jω"</code>
                ", evaluate magnitude and angle, and you have the magnitude response and phase response of the system. Bode plots are literally just "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"|H(jω)|"</code>
                " and "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"∠H(jω)"</code>
                " plotted against "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"log ω"</code>
                "."
            </p>

            <div class="my-8 p-5 rounded-xl bg-violet-500/5 border-l-4 border-violet-400">
                <p class="text-violet-100 m-0">
                    <strong>"The geometric trick:"</strong>
                    " "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"|H(jω)|"</code>
                    " can be read directly from the s-plane. Draw vectors from each zero "
                    <em>"to"</em>
                    " the point "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"s = jω"</code>
                    " on the imaginary axis, and vectors from each pole to the same point. Then:"
                </p>
                <p class="text-violet-100 m-0 mt-2">
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"|H(jω)| = K · (product of zero-vector lengths) / (product of pole-vector lengths)"</code>
                </p>
                <p class="text-violet-100 m-0 mt-2">
                    "The phase is the sum of zero-vector angles minus the sum of pole-vector angles. So a pole near "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"jω"</code>
                    " on the imaginary axis makes the response "
                    <em>"peak"</em>
                    " there (resonance). A zero on the imaginary axis kills the response (notch)."
                </p>
            </div>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"What you should take from this chapter"</h3>
            <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
                <ul class="space-y-2 text-zinc-300 m-0 list-none p-0">
                    <li>"• "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"H(s) = Y(s)/X(s) = 𝓛{h(t)}"</code>"."</li>
                    <li>"• For any linear constant-coefficient system, "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"H(s)"</code>" is a rational function. Its roots are the zeros (numerator) and poles (denominator)."</li>
                    <li>"• Bode magnitude = "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"|H(jω)|"</code>". Just evaluate the rational function on the imaginary axis."</li>
                    <li>"• Geometrically, "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"|H(jω)|"</code>" is the ratio of vector products from zeros and poles to "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"jω"</code>". Pole near the axis ⇒ peak. Zero on the axis ⇒ notch."</li>
                </ul>
            </div>

            <p>"Next chapter is the picture that ties everything in this guide together: the s-plane as a stability map."</p>
        </section>
    }
}
