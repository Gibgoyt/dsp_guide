use leptos::*;

#[component]
pub fn Ch05() -> impl IntoView {
    view! {
        <h2 class="text-3xl font-black mb-2 text-white">"5. Worked ODEs — RC Circuits and Mass-Spring-Damper"</h2>
        <p class="text-zinc-400 italic mb-8">
            "Two textbook problems, fully worked. After this chapter you should never again look at a constant-coefficient ODE with initial conditions and feel anxious."
        </p>

        <section class="space-y-5 text-zinc-300 leading-relaxed">
            <h3 class="text-xl font-bold text-white mt-4 mb-3">"Example 1: RC circuit step response"</h3>
            <p>
                "A series RC circuit: an input voltage source "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"v_in(t)"</code>
                ", a resistor "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"R"</code>
                ", a capacitor "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"C"</code>
                ", and the capacitor voltage "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"v_C(t)"</code>
                " as our output. KVL gives:"
            </p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "v_in(t)  =  R · C · dv_C/dt  +  v_C(t)"
            </div>
            <p>
                "Apply a unit-step input "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"v_in(t) = u(t)"</code>
                " with initial condition "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"v_C(0⁻) = 0"</code>
                ". Let "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"τ = RC"</code>
                " (the time constant)."
            </p>

            <h4 class="text-lg font-bold text-violet-300 mt-6 mb-2">"Step 1 — transform"</h4>
            <p>"Take the Laplace transform of both sides. "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"𝓛{u(t)} = 1/s"</code>", "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"𝓛{dv_C/dt} = s V_C(s) − v_C(0⁻) = s V_C(s)"</code>", because the initial condition is zero. So:"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "1/s  =  τ s V_C(s)  +  V_C(s)  =  (τs + 1) V_C(s)"
            </div>

            <h4 class="text-lg font-bold text-violet-300 mt-6 mb-2">"Step 2 — solve algebraically"</h4>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "V_C(s)  =  1 / [ s · (τs + 1) ]"
            </div>

            <h4 class="text-lg font-bold text-violet-300 mt-6 mb-2">"Step 3 — partial fractions"</h4>
            <p>"Decompose:"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "1 / [s (τs + 1)]  =  1/s  −  τ / (τs + 1)  =  1/s  −  1 / (s + 1/τ)"
            </div>

            <h4 class="text-lg font-bold text-violet-300 mt-6 mb-2">"Step 4 — invert"</h4>
            <p>"Look each term up in the standard table:"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "v_C(t)  =  (1 − e^(−t/τ)) · u(t)"
            </div>
            <p>
                "That's the textbook RC step response. The capacitor charges from zero up to 1, with the characteristic exponential approach: at "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"t = τ"</code>
                " it's at 63.2%, at "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"t = 5τ"</code>
                " it's at 99.3% — effectively done."
            </p>

            <div class="my-8 p-5 rounded-xl bg-violet-500/5 border-l-4 border-violet-400">
                <p class="text-violet-100 m-0">
                    <strong>"What just happened:"</strong>
                    " a first-order ODE in "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"v_C(t)"</code>
                    " became a "
                    <em>"linear equation"</em>
                    " in "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"V_C(s)"</code>
                    ". We solved it the way an eighth-grader would solve "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"3x = 12"</code>
                    ". Then a single table lookup gave us back the time domain. No integrating factors. No characteristic equation. No guessing."
                </p>
            </div>

            <h3 class="text-xl font-bold text-white mt-12 mb-3">"Example 2: mass-spring-damper"</h3>
            <p>
                "Now a second-order system. A mass "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"m"</code>
                " on a spring of stiffness "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"k"</code>
                " with a damper "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"c"</code>
                ", driven by an external force "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"F(t)"</code>
                ". Newton's second law:"
            </p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "m · y''(t)  +  c · y'(t)  +  k · y(t)  =  F(t)"
            </div>
            <p>
                "Assume the system starts at rest: "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"y(0⁻) = 0, y'(0⁻) = 0"</code>
                ". Apply Laplace to both sides — the second derivative becomes "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"s²Y(s)"</code>
                ", the first derivative "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"sY(s)"</code>
                ":"
            </p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "(m s² + c s + k) · Y(s)  =  F(s)"
            </div>
            <p>"Out pops the system's transfer function — output over input:"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "H(s)  =  Y(s) / F(s)  =  1 / (m s² + c s + k)"
            </div>

            <h4 class="text-lg font-bold text-violet-300 mt-6 mb-2">"Read off the poles"</h4>
            <p>"The poles are roots of the denominator:"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "s  =  ( −c ± √(c² − 4mk) ) / (2m)"
            </div>
            <p>"Three regimes — every controls course covers them:"</p>
            <ul class="space-y-2 ml-6 list-disc text-zinc-300">
                <li><strong class="text-violet-300">"Overdamped"</strong>" "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"(c² > 4mk)"</code>": two distinct real negative poles → two decaying exponentials, no overshoot."</li>
                <li><strong class="text-violet-300">"Critically damped"</strong>" "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"(c² = 4mk)"</code>": one repeated real negative pole → "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"(A + B·t)·e^(σt)"</code>", fastest no-overshoot response."</li>
                <li><strong class="text-violet-300">"Underdamped"</strong>" "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"(c² < 4mk)"</code>": complex-conjugate pole pair "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"−σ ± jω_d"</code>" → decaying sinusoid: "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"e^(−σt)·sin(ω_d t)"</code>"."</li>
            </ul>
            <p>
                "Every one of these qualitative regimes corresponds to a different geometric configuration in the s-plane — that is the picture we will develop in chapters 7 and 8."
            </p>

            <h3 class="text-xl font-bold text-white mt-12 mb-3">"What you should take from this chapter"</h3>
            <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
                <ul class="space-y-2 text-zinc-300 m-0 list-none p-0">
                    <li>"• The Laplace recipe for a linear ODE: (1) transform, (2) collect, (3) solve algebraically, (4) partial fractions, (5) invert with a table."</li>
                    <li>"• Initial conditions enter as additive terms in step 1 — you do not solve them separately."</li>
                    <li>"• The transfer function "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"H(s) = Y(s)/X(s)"</code>" pops out for free; its poles are roots of the characteristic polynomial."</li>
                    <li>"• Pole locations tell you the qualitative behavior — overdamped, critical, underdamped — before you ever look at the time-domain answer."</li>
                </ul>
            </div>

            <p>"Next: we promote the transfer function from a side effect into the main object — the algebraic and geometric heart of every LTI system."</p>
        </section>
    }
}
