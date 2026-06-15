use leptos::*;

#[component]
pub fn Ch11() -> impl IntoView {
    view! {
        <h2 class="text-3xl font-black mb-2 text-white">"11. From Continuous to Sampled — The Bridge"</h2>
        <p class="text-zinc-400 italic mb-8">
            "Every real DSP system samples. We need to be precise about what sampling does to a signal and to its spectrum — because the answer determines what the Z-transform must look like, and why the unit circle is its stability boundary."
        </p>

        <section class="space-y-5 text-zinc-300 leading-relaxed">
            <h3 class="text-xl font-bold text-white mt-4 mb-3">"Ideal sampling"</h3>
            <p>
                "Take a continuous-time signal "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"x(t)"</code>
                " and a sampling period "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"T"</code>
                ". The sampled sequence is just:"
            </p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "x[n]  =  x(nT)        for n = 0, 1, 2, …"
            </div>
            <p>
                "We model this mathematically by multiplying "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"x(t)"</code>
                " by a Dirac comb (an infinite train of delta functions at "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"t = nT"</code>
                "):"
            </p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "x_s(t)  =  x(t) · Σ_n δ(t − nT)  =  Σ_n x(nT) δ(t − nT)"
            </div>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"What sampling does to the spectrum"</h3>
            <p>"The Fourier transform of a Dirac comb is another Dirac comb — that's a famous identity. Multiplying in time is convolving in frequency, so:"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "X_s(jω)  =  (1/T) · Σ_k  X( j(ω − k ω_s) )"
            </div>
            <p>
                "where "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"ω_s = 2π/T"</code>
                " is the sampling frequency in rad/s. The sampled signal's spectrum is the original spectrum "
                <strong>"repeated every "</strong>
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"ω_s"</code>
                ". Sampling makes the spectrum "
                <em>"periodic"</em>
                "."
            </p>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Aliasing and the Nyquist theorem"</h3>
            <p>"If "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"X(jω)"</code>" is non-zero outside "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"|ω| < ω_s/2"</code>", the repeated copies overlap. Once they overlap you cannot tell which copy a given frequency came from — that is "<strong class="text-violet-300">"aliasing"</strong>". The lost information cannot be recovered."</p>
            <p>"Conversely:"</p>
            <div class="my-8 p-5 rounded-xl bg-violet-500/5 border-l-4 border-violet-400">
                <p class="text-violet-100 m-0">
                    <strong>"Nyquist-Shannon sampling theorem:"</strong>
                    " if "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"X(jω)"</code>
                    " is strictly band-limited to "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"|ω| < ω_max"</code>
                    " and "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"ω_s > 2 ω_max"</code>
                    ", then "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"x(t)"</code>
                    " can be exactly reconstructed from its samples "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"x[n]"</code>
                    ". The threshold "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"ω_s = 2 ω_max"</code>
                    " is the "
                    <strong>"Nyquist rate"</strong>
                    ", and "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"ω_s/2"</code>
                    " is the "
                    <strong>"Nyquist frequency."</strong>
                </p>
            </div>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Where the Laplace plane gets warped"</h3>
            <p>
                "Here is the bridge we will need next chapter. Take the Laplace transform of the sampled signal:"
            </p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "X_s(s)  =  Σ_n x(nT) · e^(−s nT)"
            </div>
            <p>
                "Define a new complex variable "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"z = e^(sT)"</code>
                ". Then "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"e^(−s nT) = z^(−n)"</code>
                ", and:"
            </p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "X(z)  =  Σ_n x[n] · z^(−n)"
            </div>
            <p>"That is the "<strong class="text-violet-300">"Z-transform"</strong>". It is the Laplace transform of a sampled signal, re-coordinated by the change of variables "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"z = e^(sT)"</code>"."</p>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"What that change of variables does to the s-plane"</h3>
            <p>"The map "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"z = e^(sT) = e^(σT) · e^(jωT)"</code>" warps the s-plane in a beautiful and load-bearing way:"</p>
            <ul class="space-y-1 ml-6 list-disc text-zinc-300">
                <li>"The "<strong>"imaginary axis of the s-plane"</strong>" ("<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"σ = 0"</code>") maps to "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"|z| = 1"</code>" — the "<strong class="text-violet-300">"unit circle"</strong>"."</li>
                <li>"The "<strong>"left half-plane"</strong>" ("<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"σ < 0"</code>") maps to "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"|z| < 1"</code>" — the "<strong class="text-violet-300">"inside"</strong>" of the unit circle."</li>
                <li>"The "<strong>"right half-plane"</strong>" ("<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"σ > 0"</code>") maps to "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"|z| > 1"</code>" — "<strong class="text-violet-300">"outside"</strong>"."</li>
            </ul>
            <p>"The Laplace stability rule — 'all poles in the LHP' — automatically becomes the Z-transform stability rule: 'all poles inside the unit circle.' The geometry has been preserved; only the coordinate names changed."</p>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"What you should take from this chapter"</h3>
            <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
                <ul class="space-y-2 text-zinc-300 m-0 list-none p-0">
                    <li>"• Sampling = multiplying by a Dirac comb in time = convolving with a comb in frequency = periodic spectrum."</li>
                    <li>"• Nyquist-Shannon: a band-limited signal can be perfectly reconstructed from samples taken faster than twice its highest frequency."</li>
                    <li>"• Aliasing is the price of sampling too slowly — different continuous frequencies become indistinguishable in the samples."</li>
                    <li>"• The Z-transform is just the Laplace transform of a sampled signal, with "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"z = e^(sT)"</code>"."</li>
                    <li>"• Under that map: imaginary axis → unit circle; LHP → inside the unit circle; RHP → outside."</li>
                </ul>
            </div>

            <p>"Next chapter develops the Z-transform on its own terms and makes the unit circle the only piece of geometry you need to remember for digital-filter stability."</p>
        </section>
    }
}
