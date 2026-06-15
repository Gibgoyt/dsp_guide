use leptos::*;

#[component]
pub fn Ch12() -> impl IntoView {
    view! {
        <h2 class="text-3xl font-black mb-2 text-white">"12. The Z-Transform — z = e^(sT) and the Unit Circle"</h2>
        <p class="text-zinc-400 italic mb-8">
            "The Z-transform is the discrete-time counterpart of the Laplace transform. Almost every concept transfers one-for-one — the s-plane becomes a warped picture called the z-plane, the imaginary axis becomes the unit circle, and the rest is detail."
        </p>

        <section class="space-y-5 text-zinc-300 leading-relaxed">
            <h3 class="text-xl font-bold text-white mt-4 mb-3">"Definition"</h3>
            <p>"For a discrete-time sequence "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"x[n]"</code>":"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "X(z)  =  Σ_{n=−∞}^{∞} x[n] · z^(−n)        (bilateral)"
            </div>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "X(z)  =  Σ_{n=0}^{∞} x[n] · z^(−n)         (unilateral, the engineering default)"
            </div>
            <p>"And the bridge: "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"z = e^(sT)"</code>" — the Z-domain is the Laplace domain after sampling."</p>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"The DTFT is Z evaluated on the unit circle"</h3>
            <p>"Set "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"z = e^(jΩ)"</code>" with "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"Ω ∈ [−π, π]"</code>". Then "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"X(z)|_{z=e^(jΩ)} = X(e^(jΩ))"</code>" — the "<strong class="text-violet-300">"discrete-time Fourier transform (DTFT)"</strong>". So the DTFT is the slice of the Z-transform along the unit circle, exactly like the continuous Fourier transform is the slice of the Laplace transform along the imaginary axis."</p>
            <p>
                "And "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"Ω = ωT"</code>
                " is "
                <strong class="text-violet-300">"normalized frequency"</strong>
                " — the continuous frequency "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"ω"</code>
                " scaled by the sample period so that one full lap around the unit circle ("
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"Ω: 0 → 2π"</code>
                ") corresponds to one full sample-rate sweep. The Nyquist frequency "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"ω = ω_s/2"</code>
                " sits at "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"Ω = π"</code>
                " — directly opposite the DC point at "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"Ω = 0"</code>
                "."
            </p>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"The z-plane stability map"</h3>
            <div class="my-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/30">
                    <div class="text-emerald-300 font-bold text-sm mb-1">"Inside unit circle (|z| < 1)"</div>
                    <div class="text-zinc-300 text-sm">"Sample-by-sample decay: "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-xs">"|z|^n → 0"</code>". This is the "<strong>"stable"</strong>" region. All poles here ⇒ system is BIBO stable."</div>
                </div>
                <div class="p-4 rounded-xl bg-amber-500/5 border border-amber-500/30">
                    <div class="text-amber-300 font-bold text-sm mb-1">"On unit circle (|z| = 1)"</div>
                    <div class="text-zinc-300 text-sm">"Pure sustained oscillation. Marginally stable; one pole here, the response oscillates forever at that frequency."</div>
                </div>
                <div class="p-4 rounded-xl bg-red-500/5 border border-red-500/30">
                    <div class="text-red-300 font-bold text-sm mb-1">"Outside unit circle (|z| > 1)"</div>
                    <div class="text-zinc-300 text-sm">"Growing response: "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-xs">"|z|^n → ∞"</code>". Unstable — one pole here is fatal."</div>
                </div>
            </div>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Standard Z-transform pairs"</h3>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-sm overflow-x-auto">
                <table class="w-full text-zinc-300">
                    <thead>
                        <tr class="text-violet-300 border-b border-zinc-800">
                            <th class="text-left pb-2 pr-4">"x[n]"</th>
                            <th class="text-left pb-2 pr-4">"X(z)"</th>
                            <th class="text-left pb-2">"ROC"</th>
                        </tr>
                    </thead>
                    <tbody class="text-zinc-300">
                        <tr><td class="pr-4 py-1">"δ[n]"</td><td class="pr-4">"1"</td><td>"all z"</td></tr>
                        <tr><td class="pr-4 py-1">"u[n]"</td><td class="pr-4">"z / (z − 1)"</td><td>"|z| > 1"</td></tr>
                        <tr><td class="pr-4 py-1">"aⁿ · u[n]"</td><td class="pr-4">"z / (z − a)"</td><td>"|z| > |a|"</td></tr>
                        <tr><td class="pr-4 py-1">"n · u[n]"</td><td class="pr-4">"z / (z − 1)²"</td><td>"|z| > 1"</td></tr>
                        <tr><td class="pr-4 py-1">"n · aⁿ · u[n]"</td><td class="pr-4">"az / (z − a)²"</td><td>"|z| > |a|"</td></tr>
                        <tr><td class="pr-4 py-1">"cos(Ω₀ n) · u[n]"</td><td class="pr-4">"z(z − cos Ω₀) / (z² − 2z cos Ω₀ + 1)"</td><td>"|z| > 1"</td></tr>
                        <tr><td class="pr-4 py-1">"sin(Ω₀ n) · u[n]"</td><td class="pr-4">"z sin Ω₀ / (z² − 2z cos Ω₀ + 1)"</td><td>"|z| > 1"</td></tr>
                    </tbody>
                </table>
            </div>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Properties"</h3>
            <p>"Same structural moves as Laplace, lightly retitled:"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-sm overflow-x-auto">
                <table class="w-full text-zinc-300">
                    <thead>
                        <tr class="text-violet-300 border-b border-zinc-800">
                            <th class="text-left pb-2 pr-4">"Time domain"</th>
                            <th class="text-left pb-2">"Z domain"</th>
                        </tr>
                    </thead>
                    <tbody class="text-zinc-300">
                        <tr><td class="pr-4 py-1">"a x₁[n] + b x₂[n]"</td><td>"a X₁(z) + b X₂(z)"</td></tr>
                        <tr><td class="pr-4 py-1">"x[n − k]"</td><td>"z^(−k) X(z)   (time shift)"</td></tr>
                        <tr><td class="pr-4 py-1">"aⁿ x[n]"</td><td>"X(z/a)"</td></tr>
                        <tr><td class="pr-4 py-1">"n x[n]"</td><td>"−z dX/dz"</td></tr>
                        <tr><td class="pr-4 py-1">"x[n] ∗ h[n]   (conv.)"</td><td>"X(z) · H(z)"</td></tr>
                    </tbody>
                </table>
            </div>
            <p>"The big one is again "<strong class="text-violet-300">"convolution becomes multiplication"</strong>" — same intuition, same use case (LTI input/output)."</p>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Transfer functions in z"</h3>
            <p>"A discrete-time LTI system has a difference equation:"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "y[n]  =  Σ b_k x[n−k]  −  Σ a_k y[n−k]"
            </div>
            <p>"Take Z-transforms, solve for "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"H(z) = Y(z)/X(z)"</code>":"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "H(z)  =  (b₀ + b₁ z⁻¹ + ⋯ + b_M z^(−M)) / (1 + a₁ z⁻¹ + ⋯ + a_N z^(−N))"
            </div>
            <p>"Multiply numerator and denominator by "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"z^N"</code>" to get explicit poles and zeros — both as roots of "<em>"polynomials in z"</em>"."</p>

            <div class="my-8 p-5 rounded-xl bg-violet-500/5 border-l-4 border-violet-400">
                <p class="text-violet-100 m-0">
                    <strong>"The single rule for digital-filter stability:"</strong>
                    " a causal discrete-time LTI system is BIBO stable if and only if "
                    <em>"every pole"</em>
                    " of "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"H(z)"</code>
                    " satisfies "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"|z| < 1"</code>
                    ". Every pole strictly inside the unit circle. That is the entire stability story for digital filters."
                </p>
            </div>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"What you should take from this chapter"</h3>
            <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
                <ul class="space-y-2 text-zinc-300 m-0 list-none p-0">
                    <li>"• "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"X(z) = Σ x[n] z^(−n)"</code>". DTFT is the slice on the unit circle ("<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"z = e^(jΩ)"</code>")."</li>
                    <li>"• The Laplace map "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"z = e^(sT)"</code>" sends LHP → inside the unit circle and the imaginary axis → unit circle."</li>
                    <li>"• Digital-filter stability: "<em>"all poles inside the unit circle"</em>". One pole at the boundary = marginal; one pole outside = unstable."</li>
                    <li>"• Convolution becomes multiplication: "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"y[n] = x[n] ∗ h[n] ⇔ Y(z) = X(z) H(z)"</code>"."</li>
                    <li>"• Normalized frequency "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"Ω = ωT"</code>": Nyquist sits at "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"Ω = π"</code>", DC at "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"Ω = 0"</code>"."</li>
                </ul>
            </div>

            <p>"Next: applying this geometry to the only filter-design question that actually uses Laplace/Z in practice — FIR vs IIR stability and how to keep IIR poles inside the unit circle."</p>
        </section>
    }
}
