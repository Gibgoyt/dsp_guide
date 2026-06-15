use leptos::*;

#[component]
pub fn Ch09() -> impl IntoView {
    view! {
        <h2 class="text-3xl font-black mb-2 text-white">"9. Inverse Laplace via Partial Fractions"</h2>
        <p class="text-zinc-400 italic mb-8">
            "The inverse Laplace integral is a Bromwich contour integral. You will never compute it directly. Instead you decompose your rational "
            <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"X(s)"</code>
            " into pieces a table can invert. This chapter is the recipe, with three worked examples covering the three cases you actually meet."
        </p>

        <section class="space-y-5 text-zinc-300 leading-relaxed">
            <h3 class="text-xl font-bold text-white mt-4 mb-3">"The general recipe"</h3>
            <ol class="space-y-1 ml-6 list-decimal text-zinc-300">
                <li>"If "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"deg(N) ≥ deg(D)"</code>", do polynomial long division first. The quotient inverts to "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"δ(t)"</code>" and its derivatives; the remainder is a proper rational function."</li>
                <li>"Factor the denominator. Identify the poles and their multiplicities."</li>
                <li>"Set up a partial-fraction expansion: one term per pole (and per repeated power)."</li>
                <li>"Solve for the residues — by cover-up, by matching coefficients, or by limits."</li>
                <li>"Invert each term with the Laplace table."</li>
                <li>"Multiply the whole answer by "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"u(t)"</code>" because the unilateral transform implies causality."</li>
            </ol>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Case 1 — distinct real poles"</h3>
            <p>"Find "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"x(t)"</code>" given:"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "X(s)  =  (2s + 1) / [ (s + 1)(s + 3) ]"
            </div>
            <p>"Set up:"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "(2s + 1) / [(s + 1)(s + 3)]  =  A / (s + 1)  +  B / (s + 3)"
            </div>
            <p>"Heaviside cover-up: multiply both sides by "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"(s + 1)"</code>" and evaluate at "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"s = −1"</code>":"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "A  =  (2(−1) + 1) / ((−1) + 3)  =  (−1) / (2)  =  −1/2"
            </div>
            <p>"Same trick at "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"s = −3"</code>":"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "B  =  (2(−3) + 1) / ((−3) + 1)  =  (−5) / (−2)  =  5/2"
            </div>
            <p>"Invert each term using "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"1/(s + a) ↔ e^(−at) u(t)"</code>":"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "x(t)  =  ( −(1/2) e^(−t)  +  (5/2) e^(−3t) ) · u(t)"
            </div>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Case 2 — repeated real poles"</h3>
            <p>"Take:"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "X(s)  =  3 / [ (s + 2)² · (s + 5) ]"
            </div>
            <p>"With a repeated pole at "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"s = −2"</code>" you need "<em>"two"</em>" terms — one per power:"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "X(s)  =  A / (s + 2)  +  B / (s + 2)²  +  C / (s + 5)"
            </div>
            <p>"Cover-up for the highest power at "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"s = −2"</code>": "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"B = 3 / (−2 + 5) = 1"</code>". For "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"C"</code>" at "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"s = −5"</code>": "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"C = 3 / (−5 + 2)² = 1/3"</code>". For "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"A"</code>" differentiate the cover-up expression once and re-evaluate, or just match coefficients: "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"A = −1/3"</code>"."</p>
            <p>"Inverting with "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"1/(s + a)² ↔ t e^(−at) u(t)"</code>":"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "x(t)  =  ( −(1/3) e^(−2t)  +  t · e^(−2t)  +  (1/3) e^(−5t) ) · u(t)"
            </div>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Case 3 — complex-conjugate pole pair"</h3>
            <p>"Take:"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "X(s)  =  4 / [ s² + 2s + 5 ]"
            </div>
            <p>"Do not blindly cover-up complex residues — instead, "<strong class="text-violet-300">"complete the square"</strong>" so the denominator looks like "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"(s + σ)² + ω_d²"</code>":"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "s² + 2s + 5  =  (s + 1)² + 4  =  (s + 1)² + 2²"
            </div>
            <p>"So:"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "X(s)  =  4 / [ (s + 1)² + 2² ]  =  2 · ( 2 / [ (s + 1)² + 2² ] )"
            </div>
            <p>"Recognize "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"ω₀ / [(s + a)² + ω₀²] ↔ e^(−at) sin(ω₀ t) u(t)"</code>" from the table. So:"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-center text-violet-300">
                "x(t)  =  2 · e^(−t) · sin(2 t) · u(t)"
            </div>
            <p>"A damped sinusoid — exactly what an LHP conjugate pair must give you geometrically: decay rate "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"σ = 1"</code>", ringing at "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"ω_d = 2"</code>", in agreement with the poles at "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"s = −1 ± 2j"</code>"."</p>

            <div class="my-8 p-5 rounded-xl bg-violet-500/5 border-l-4 border-violet-400">
                <p class="text-violet-100 m-0">
                    <strong>"Two practical tips:"</strong>
                </p>
                <ul class="text-violet-100 m-0 mt-2 space-y-1 list-disc pl-5">
                    <li>"For complex pairs, always complete the square and match against the cos/sin templates. Do not try to use complex residues by hand — it works but is error-prone."</li>
                    <li>"If "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"deg(N) ≥ deg(D)"</code>", a direct partial-fraction expansion will lie to you. Do the long division first, then expand the proper remainder."</li>
                </ul>
            </div>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"What you should take from this chapter"</h3>
            <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
                <ul class="space-y-2 text-zinc-300 m-0 list-none p-0">
                    <li>"• Inversion in practice = partial fractions + a Laplace table."</li>
                    <li>"• Heaviside cover-up handles distinct real poles in seconds."</li>
                    <li>"• Repeated pole at order "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"k"</code>" needs "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"k"</code>" partial-fraction terms, one per power."</li>
                    <li>"• Complex-conjugate pairs: complete the square and use the "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"e^(−at) sin / cos"</code>" templates."</li>
                    <li>"• Always check "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"deg(N) vs deg(D)"</code>" before expanding — long-divide if necessary."</li>
                </ul>
            </div>

            <p>"Next: two cheap tricks that let you read "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"x(0⁺)"</code>" and "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"x(∞)"</code>" directly off "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"X(s)"</code>" without inverting."</p>
        </section>
    }
}
