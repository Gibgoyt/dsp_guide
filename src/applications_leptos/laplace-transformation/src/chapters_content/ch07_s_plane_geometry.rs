use leptos::*;

#[component]
pub fn Ch07() -> impl IntoView {
    view! {
        <h2 class="text-3xl font-black mb-2 text-white">"7. The s-Plane Geometry — Stability at a Glance"</h2>
        <p class="text-zinc-400 italic mb-8">
            "The single most powerful picture in linear systems theory. Place a pole and the s-plane tells you, geometrically and unambiguously, what that pole's time response looks like — and whether the whole system stays bounded or runs away."
        </p>

        <section class="space-y-5 text-zinc-300 leading-relaxed">
            <h3 class="text-xl font-bold text-white mt-4 mb-3">"The plane"</h3>
            <p>
                "Lay down a complex plane with real axis "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"σ"</code>
                " (horizontal) and imaginary axis "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"jω"</code>
                " (vertical). Each point "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"s = σ + jω"</code>
                " corresponds to one complex exponential "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"e^(st) = e^(σt) e^(jωt)"</code>
                ". Real part = decay/growth rate. Imaginary part = oscillation frequency."
            </p>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Three regions, three behaviors"</h3>

            <div class="my-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/30">
                    <div class="text-emerald-300 font-bold text-sm mb-1">"Left Half-Plane (σ < 0)"</div>
                    <div class="text-zinc-300 text-sm">"Decaying response. "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-xs">"e^(σt) → 0"</code>". This is the "<strong>"stable"</strong>" region. All poles here ⇒ system is BIBO stable."</div>
                </div>
                <div class="p-4 rounded-xl bg-amber-500/5 border border-amber-500/30">
                    <div class="text-amber-300 font-bold text-sm mb-1">"Imaginary axis (σ = 0)"</div>
                    <div class="text-zinc-300 text-sm">"Pure sustained oscillation. "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-xs">"e^(jωt)"</code>" — neither grows nor decays. This is the "<strong>"marginally stable"</strong>" boundary."</div>
                </div>
                <div class="p-4 rounded-xl bg-red-500/5 border border-red-500/30">
                    <div class="text-red-300 font-bold text-sm mb-1">"Right Half-Plane (σ > 0)"</div>
                    <div class="text-zinc-300 text-sm">"Growing response. "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-xs">"e^(σt) → ∞"</code>". This is the "<strong>"unstable"</strong>" region. Even "<em>"one"</em>" pole here and the system runs away."</div>
                </div>
            </div>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"The pole position → time response dictionary"</h3>
            <p>"Memorize this. It is the single most useful chart in linear-systems work:"</p>

            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-sm overflow-x-auto">
                <table class="w-full text-zinc-300">
                    <thead>
                        <tr class="text-violet-300 border-b border-zinc-800">
                            <th class="text-left pb-2 pr-4">"Pole position"</th>
                            <th class="text-left pb-2 pr-4">"Time response"</th>
                            <th class="text-left pb-2">"Verdict"</th>
                        </tr>
                    </thead>
                    <tbody class="text-zinc-300">
                        <tr><td class="pr-4 py-1">"Real, negative (s = −a, a > 0)"</td><td class="pr-4">"e^(−at) decay"</td><td>"stable"</td></tr>
                        <tr><td class="pr-4 py-1">"Real, positive (s = +a)"</td><td class="pr-4">"e^(+at) growth"</td><td>"unstable"</td></tr>
                        <tr><td class="pr-4 py-1">"At origin (s = 0)"</td><td class="pr-4">"constant (step)"</td><td>"marginal"</td></tr>
                        <tr><td class="pr-4 py-1">"Imaginary pair (s = ±jω₀)"</td><td class="pr-4">"pure sinusoid sin(ω₀ t)"</td><td>"marginal"</td></tr>
                        <tr><td class="pr-4 py-1">"LHP complex pair (s = −σ ± jω_d)"</td><td class="pr-4">"e^(−σt) sin(ω_d t) — damped ring"</td><td>"stable"</td></tr>
                        <tr><td class="pr-4 py-1">"RHP complex pair (s = +σ ± jω_d)"</td><td class="pr-4">"e^(+σt) sin(ω_d t) — exploding ring"</td><td>"unstable"</td></tr>
                        <tr><td class="pr-4 py-1">"Repeated pole at s = 0"</td><td class="pr-4">"ramp t · u(t)"</td><td>"unstable"</td></tr>
                        <tr><td class="pr-4 py-1">"Repeated pole at s = ±jω₀"</td><td class="pr-4">"t · sin(ω₀ t) — growing ring"</td><td>"unstable"</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="my-8 p-5 rounded-xl bg-violet-500/5 border-l-4 border-violet-400">
                <p class="text-violet-100 m-0">
                    <strong>"The stability rule in one sentence:"</strong>
                    " a causal LTI system is BIBO stable if and only if "
                    <em>"every pole"</em>
                    " of its transfer function has "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"Re(s) < 0"</code>
                    ". One pole on the imaginary axis is marginal. One pole in the right half-plane is unstable, full stop."
                </p>
            </div>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"How the geometry maps to time"</h3>
            <p>"Two parameters of a complex-conjugate pole pair fully control the time response:"</p>
            <ul class="space-y-1 ml-6 list-disc text-zinc-300">
                <li>
                    "Horizontal distance from the imaginary axis ("
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"|σ|"</code>
                    ") sets the "
                    <strong class="text-violet-300">"decay rate"</strong>
                    ". Further left = faster decay."
                </li>
                <li>
                    "Vertical distance from the real axis ("
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"|ω_d|"</code>
                    ") sets the "
                    <strong class="text-violet-300">"ringing frequency"</strong>
                    "."
                </li>
                <li>
                    "The "
                    <strong class="text-violet-300">"angle from the negative real axis"</strong>
                    " is "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"arccos(ζ)"</code>
                    " — directly the damping ratio. Pole on the negative real axis = "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"ζ = 1"</code>
                    " (critically damped). Pole on the imaginary axis = "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"ζ = 0"</code>
                    " (undamped, pure sinusoid). The further the pole leans toward the imaginary axis, the less damping."
                </li>
            </ul>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Why this is "<em>"the"</em>" picture"</h3>
            <p>
                "Every controls course, every analog filter design textbook, every IIR filter design routine ultimately reduces to one question: "
                <em>"where do I put the poles?"</em>
                " The s-plane geometry is the language in which that question is asked and answered. Butterworth, Chebyshev, Bessel filters? Different families of pole-placement strategies on this plane. Root locus? A drawing of where poles "
                <em>"travel"</em>
                " as a feedback gain changes. PID tuning? Moving poles around to shape transient response. All of it lives here."
            </p>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"What you should take from this chapter"</h3>
            <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
                <ul class="space-y-2 text-zinc-300 m-0 list-none p-0">
                    <li>"• The "<strong>"s-plane"</strong>" is the stability map of every continuous LTI system."</li>
                    <li>"• Left half-plane = stable. Right half-plane = unstable. Imaginary axis = boundary (marginal)."</li>
                    <li>"• A causal system is BIBO stable ⇔ "<em>"all"</em>" poles strictly in the LHP."</li>
                    <li>"• Distance from the imaginary axis controls decay rate; vertical position controls ringing frequency; angle from the negative real axis is "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"arccos(ζ)"</code>"."</li>
                    <li>"• "<em>"Every"</em>" classical filter / controller design technique is, at heart, a strategy for placing poles on this plane."</li>
                </ul>
            </div>

            <p>"Next: putting it all together — reading pole-zero plots quickly and accurately for the kinds of responses you actually encounter in practice."</p>
        </section>
    }
}
