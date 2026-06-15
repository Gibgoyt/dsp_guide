use leptos::*;

#[component]
pub fn Ch10() -> impl IntoView {
    view! {
        <h2 class="text-3xl font-black mb-2 text-white">"10. Initial Value and Final Value Theorems"</h2>
        <p class="text-zinc-400 italic mb-8">
            "Two tiny algebraic identities that let you peek at "
            <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"x(0⁺)"</code>
            " and "
            <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"x(∞)"</code>
            " without ever inverting the transform. Cheap, fast, and the second one has a famous trap."
        </p>

        <section class="space-y-5 text-zinc-300 leading-relaxed">
            <h3 class="text-xl font-bold text-white mt-4 mb-3">"The Initial Value Theorem (IVT)"</h3>
            <p>"If "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"x(t)"</code>" and its derivative are Laplace-transformable, then:"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "x(0⁺)  =  lim_{s → ∞} s · X(s)"
            </div>
            <p>
                "Send "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"s"</code>
                " to infinity in the s-domain and you recover the value at "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"t = 0⁺"</code>
                " in the time domain. Useful because most engineering problems hand you "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"X(s)"</code>
                " and ask 'what does the signal start at?' This answers it in one line."
            </p>

            <h4 class="text-lg font-bold text-violet-300 mt-6 mb-2">"Example"</h4>
            <p>"Recall the RC step response transform:"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "V_C(s)  =  1 / [ s (τs + 1) ]"
            </div>
            <p>"Apply IVT:"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "v_C(0⁺)  =  lim_{s → ∞} s · 1/[s(τs + 1)]  =  lim_{s → ∞} 1/(τs + 1)  =  0"
            </div>
            <p>"The capacitor starts at 0 V. Matches the explicit answer "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"v_C(t) = 1 − e^(−t/τ)"</code>" at "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"t = 0"</code>". Good."</p>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"The Final Value Theorem (FVT) — and its trap"</h3>
            <p>"If the limit "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"lim_{t → ∞} x(t)"</code>" exists:"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "x(∞)  =  lim_{s → 0} s · X(s)"
            </div>
            <p>
                <strong class="text-violet-300">"Read that 'if' carefully."</strong>
                " The theorem only applies when the time-domain limit "
                <em>"actually exists"</em>
                ". If "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"x(t)"</code>
                " grows without bound or oscillates forever, the limit "
                <em>"doesn't exist"</em>
                " and applying the FVT will silently return garbage."
            </p>

            <p>"The rigorous condition: "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"X(s)"</code>" must have all poles strictly in the LHP "<em>"except"</em>" possibly a simple pole at "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"s = 0"</code>". Any RHP pole, any imaginary-axis pole other than a simple one at the origin, and FVT is invalid."</p>

            <h4 class="text-lg font-bold text-violet-300 mt-6 mb-2">"Worked example — FVT applied correctly"</h4>
            <p>"Continue with "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"V_C(s) = 1/[s(τs + 1)]"</code>". Poles at "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"s = 0"</code>" (simple) and "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"s = −1/τ"</code>" (LHP). FVT is allowed:"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "v_C(∞)  =  lim_{s → 0} s · 1/[s(τs + 1)]  =  lim_{s → 0} 1/(τs + 1)  =  1"
            </div>
            <p>"Capacitor charges to 1. Matches the explicit "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"1 − e^(−t/τ) → 1"</code>" as "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"t → ∞"</code>". Good."</p>

            <h4 class="text-lg font-bold text-violet-300 mt-6 mb-2">"Counter-example — FVT applied wrongly"</h4>
            <p>"Take "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"X(s) = ω₀ / (s² + ω₀²)"</code>". This is the Laplace transform of "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"sin(ω₀ t) u(t)"</code>", which oscillates forever — no final value exists. But naive FVT says:"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "lim_{s → 0} s · ω₀/(s² + ω₀²)  =  0    ←  WRONG"
            </div>
            <p>"The formula returns "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"0"</code>" because "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"sin"</code>" averages to zero, but no actual final value exists. The trap: the poles are on the imaginary axis (not at the origin), violating the precondition. Always check the poles first."</p>

            <div class="my-8 p-5 rounded-xl bg-violet-500/5 border-l-4 border-violet-400">
                <p class="text-violet-100 m-0">
                    <strong>"Workflow:"</strong>
                    " before applying FVT, look at the poles of "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"X(s)"</code>
                    ". If "
                    <em>"any"</em>
                    " pole is in the RHP or on the imaginary axis (other than a simple pole at the origin), the limit "
                    <em>"does not exist"</em>
                    " and the theorem does not apply. Walk away from the formula in that case."
                </p>
            </div>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Why these theorems are useful in controls"</h3>
            <p>"You want to know if your closed-loop step response will settle to the commanded value. That's a final-value question. Apply FVT to "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"Y(s) = T(s) · (1/s)"</code>" where "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"T(s)"</code>" is the closed-loop transfer function and "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"1/s"</code>" is the unit-step input. You get the steady-state output without ever computing the inverse transform. Whole textbook sections on steady-state error are this one identity in disguise."</p>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"What you should take from this chapter"</h3>
            <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
                <ul class="space-y-2 text-zinc-300 m-0 list-none p-0">
                    <li>"• "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"x(0⁺) = lim s X(s) as s → ∞"</code>" (always valid for proper rational X)."</li>
                    <li>"• "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"x(∞) = lim s X(s) as s → 0"</code>" — "<strong>"only"</strong>" if poles of X are LHP (except possibly a simple pole at 0)."</li>
                    <li>"• If the limit doesn't exist, FVT lies. Always check poles first."</li>
                    <li>"• In controls, FVT is the steady-state-error machinery."</li>
                </ul>
            </div>

            <p>"Next, we leave the continuous-time world and start the bridge to discrete-time: sampling, aliasing, and where the Z-transform comes from."</p>
        </section>
    }
}
