use leptos::*;

#[component]
pub fn Ch04() -> impl IntoView {
    view! {
        <h2 class="text-3xl font-black mb-2 text-white">"4. The Algebra Magic — Differentiation Becomes Multiplication"</h2>
        <p class="text-zinc-400 italic mb-8">
            "The one property that makes Laplace worth learning at all: derivatives in time become multiplication by "
            <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"s"</code>
            ". A wretched differential equation in "
            <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"t"</code>
            " becomes a polynomial equation in "
            <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"s"</code>
            ". High-school algebra solves it. You invert. You're done."
        </p>

        <section class="space-y-5 text-zinc-300 leading-relaxed">
            <h3 class="text-xl font-bold text-white mt-4 mb-3">"The core property"</h3>
            <p>"If "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"𝓛{x(t)} = X(s)"</code>", then for the unilateral transform:"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "𝓛{ dx/dt } = s · X(s) − x(0⁻)"
            </div>
            <p>"And, by induction:"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "𝓛{ d²x/dt² } = s² · X(s) − s · x(0⁻) − x'(0⁻)"
            </div>
            <p>
                "Each time you differentiate in time, you multiply by "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"s"</code>
                " and pick up a "
                <em>"correction term"</em>
                " that carries the initial condition. The initial conditions are not a separate step — they are baked directly into the transformed equation."
            </p>
            <p>
                "And conversely, "
                <strong class="text-violet-300">"integration"</strong>
                " in time is division by "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"s"</code>
                ":"
            </p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "𝓛{ ∫₀^t x(τ) dτ } = X(s) / s"
            </div>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"The full property table you actually need"</h3>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-sm overflow-x-auto">
                <table class="w-full text-zinc-300">
                    <thead>
                        <tr class="text-violet-300 border-b border-zinc-800">
                            <th class="text-left pb-2 pr-4">"Time domain x(t)"</th>
                            <th class="text-left pb-2">"Laplace domain X(s)"</th>
                        </tr>
                    </thead>
                    <tbody class="text-zinc-300">
                        <tr><td class="pr-4 py-1">"a·x₁(t) + b·x₂(t)"</td><td>"a·X₁(s) + b·X₂(s)"</td></tr>
                        <tr><td class="pr-4 py-1">"x(t − τ)·u(t − τ)"</td><td>"e^(−sτ) · X(s)"</td></tr>
                        <tr><td class="pr-4 py-1">"e^(at) · x(t)"</td><td>"X(s − a)"</td></tr>
                        <tr><td class="pr-4 py-1">"t · x(t)"</td><td>"−dX/ds"</td></tr>
                        <tr><td class="pr-4 py-1">"dx/dt"</td><td>"s·X(s) − x(0⁻)"</td></tr>
                        <tr><td class="pr-4 py-1">"d²x/dt²"</td><td>"s²·X(s) − s·x(0⁻) − x'(0⁻)"</td></tr>
                        <tr><td class="pr-4 py-1">"∫₀^t x(τ) dτ"</td><td>"X(s) / s"</td></tr>
                        <tr><td class="pr-4 py-1">"(x ∗ h)(t)  [convolution]"</td><td>"X(s) · H(s)"</td></tr>
                    </tbody>
                </table>
            </div>

            <p>
                "The convolution-becomes-multiplication property at the bottom is the second-most-important fact in this whole subject. The "
                <em>"output"</em>
                " of an LTI system in the time domain is "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"y(t) = (x ∗ h)(t)"</code>
                ", which is a horrible integral to compute. In the s-domain it is just multiplication."
            </p>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"A handful of standard transforms"</h3>
            <p>"Memorize these or pin a table to your wall:"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-sm overflow-x-auto">
                <table class="w-full text-zinc-300">
                    <thead>
                        <tr class="text-violet-300 border-b border-zinc-800">
                            <th class="text-left pb-2 pr-4">"x(t)"</th>
                            <th class="text-left pb-2 pr-4">"X(s)"</th>
                            <th class="text-left pb-2">"ROC (causal)"</th>
                        </tr>
                    </thead>
                    <tbody class="text-zinc-300">
                        <tr><td class="pr-4 py-1">"δ(t)"</td><td class="pr-4">"1"</td><td>"all s"</td></tr>
                        <tr><td class="pr-4 py-1">"u(t)"</td><td class="pr-4">"1 / s"</td><td>"Re(s) > 0"</td></tr>
                        <tr><td class="pr-4 py-1">"t · u(t)"</td><td class="pr-4">"1 / s²"</td><td>"Re(s) > 0"</td></tr>
                        <tr><td class="pr-4 py-1">"e^(−at) · u(t)"</td><td class="pr-4">"1 / (s + a)"</td><td>"Re(s) > −a"</td></tr>
                        <tr><td class="pr-4 py-1">"t · e^(−at) · u(t)"</td><td class="pr-4">"1 / (s + a)²"</td><td>"Re(s) > −a"</td></tr>
                        <tr><td class="pr-4 py-1">"cos(ω₀ t) · u(t)"</td><td class="pr-4">"s / (s² + ω₀²)"</td><td>"Re(s) > 0"</td></tr>
                        <tr><td class="pr-4 py-1">"sin(ω₀ t) · u(t)"</td><td class="pr-4">"ω₀ / (s² + ω₀²)"</td><td>"Re(s) > 0"</td></tr>
                        <tr><td class="pr-4 py-1">"e^(−at) cos(ω₀ t) u(t)"</td><td class="pr-4">"(s + a) / ((s + a)² + ω₀²)"</td><td>"Re(s) > −a"</td></tr>
                        <tr><td class="pr-4 py-1">"e^(−at) sin(ω₀ t) u(t)"</td><td class="pr-4">"ω₀ / ((s + a)² + ω₀²)"</td><td>"Re(s) > −a"</td></tr>
                    </tbody>
                </table>
            </div>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Why this collapses ODEs"</h3>
            <p>"Take an arbitrary linear constant-coefficient ODE:"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "aₙ y⁽ⁿ⁾ + ⋯ + a₁ y' + a₀ y  =  bₘ x⁽ᵐ⁾ + ⋯ + b₀ x"
            </div>
            <p>"Take the Laplace transform of both sides. Every derivative on the left becomes a power of "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"s"</code>" times "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"Y(s)"</code>" plus initial-condition terms. Same for the right. Collect:"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "(aₙ sⁿ + ⋯ + a₀) Y(s)  =  (bₘ sᵐ + ⋯ + b₀) X(s)  +  [initial conditions]"
            </div>
            <p>"Solve for "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"Y(s)"</code>" — pure high-school algebra — then invert. The ODE is gone."</p>

            <div class="my-8 p-5 rounded-xl bg-violet-500/5 border-l-4 border-violet-400">
                <p class="text-violet-100 m-0">
                    <strong>"The two reasons engineers use Laplace at all:"</strong>
                    " (1) derivatives become "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"s"</code>", so ODEs become algebra; (2) convolution becomes multiplication, so LTI system response becomes "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"Y(s) = H(s) · X(s)"</code>
                    ". Every other property in the table is in service of those two."
                </p>
            </div>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"What you should take from this chapter"</h3>
            <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
                <ul class="space-y-2 text-zinc-300 m-0 list-none p-0">
                    <li>"• "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"d/dt → ×s"</code>", with an initial-condition correction "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"−x(0⁻)"</code>"."</li>
                    <li>"• "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"∫dt → ÷s"</code>"."</li>
                    <li>"• Convolution becomes multiplication: "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"x∗h ↔ X(s)·H(s)"</code>"."</li>
                    <li>"• Frequency-shift property "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"e^(at) x(t) ↔ X(s − a)"</code>" is how exponentials slide poles around in the s-plane."</li>
                    <li>"• Time-shift property "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"x(t − τ)u(t − τ) ↔ e^(−sτ) X(s)"</code>" is what delays look like — pure phase, no magnitude change."</li>
                </ul>
            </div>

            <p>"Next: we use these properties to solve real differential equations — an RC circuit step response and a mass-spring-damper — start to finish."</p>
        </section>
    }
}
