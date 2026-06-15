use leptos::*;

#[component]
pub fn Ch15() -> impl IntoView {
    view! {
        <h2 class="text-3xl font-black mb-2 text-white">"15. The Interview Cheat-Sheet"</h2>
        <p class="text-zinc-400 italic mb-8">
            "Everything from the guide compressed to one page. If an interviewer asks about Laplace, Z, stability, or the FIR/IIR trade, this is the language to use."
        </p>

        <section class="space-y-5 text-zinc-300 leading-relaxed">
            <h3 class="text-xl font-bold text-white mt-4 mb-3">"The crisp paragraph"</h3>
            <div class="my-6 p-5 rounded-xl bg-violet-500/10 border border-violet-500/30">
                <p class="text-violet-100 m-0 leading-relaxed">
                    "Fourier is the Laplace transform restricted to the imaginary axis — Laplace adds a real exponential "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-200 font-mono text-sm">"e^(−σt)"</code>
                    " envelope, so it handles transient and unstable signals that wreck the Fourier integral. Differentiation in time becomes multiplication by "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-200 font-mono text-sm">"s"</code>
                    ", which turns linear constant-coefficient ODEs into algebra; convolution becomes multiplication, which turns LTI system response into "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-200 font-mono text-sm">"Y(s) = H(s) X(s)"</code>
                    ". The transfer function "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-200 font-mono text-sm">"H(s) = N(s)/D(s)"</code>
                    " has zeros (roots of "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-200 font-mono text-sm">"N"</code>
                    ") and poles (roots of "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-200 font-mono text-sm">"D"</code>
                    "); a causal system is BIBO stable if and only if every pole sits strictly in the left half-plane. The Z-transform is the discrete-time analogue via "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-200 font-mono text-sm">"z = e^(sT)"</code>
                    ", which maps the imaginary axis of the s-plane to the unit circle of the z-plane and the LHP to the interior — so a digital filter is stable when all poles lie strictly inside the unit circle. FIR filters have no feedback poles (all poles at the origin) and are unconditionally stable; IIR filters do have feedback poles, so designing one means placing those poles inside the unit circle and keeping them there under coefficient quantization."
                </p>
            </div>

            <p>"That is a single paragraph that contains the entire conceptual core of this guide. Delivered out loud it takes thirty seconds and signals that you understand signals and systems without overclaiming."</p>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Quick-fire facts to be reflexive about"</h3>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-sm">
                <ul class="space-y-2 text-zinc-300 m-0 list-none p-0">
                    <li>"• "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 text-xs">"s = σ + jω"</code>". σ is decay; ω is oscillation."</li>
                    <li>"• "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 text-xs">"X(s) = ∫ x(t) e^(−st) dt"</code>". Domain of convergence = ROC, a vertical strip."</li>
                    <li>"• "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 text-xs">"𝓛{dx/dt} = sX(s) − x(0⁻)"</code>". ODEs become algebra."</li>
                    <li>"• "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 text-xs">"𝓛{x ∗ h} = X(s) H(s)"</code>". LTI output is a multiplication."</li>
                    <li>"• "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 text-xs">"H(jω) = H(s)|_{s = jω}"</code>". The frequency response is Laplace on the imaginary axis."</li>
                    <li>"• Stability (continuous): all poles in the LHP."</li>
                    <li>"• "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 text-xs">"X(z) = Σ x[n] z^(−n)"</code>". DTFT = Z evaluated on "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 text-xs">"|z|=1"</code>"."</li>
                    <li>"• "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 text-xs">"z = e^(sT)"</code>" warps the s-plane: imaginary axis → unit circle, LHP → interior."</li>
                    <li>"• Stability (digital): all poles inside the unit circle."</li>
                    <li>"• FIR: all poles at "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 text-xs">"z = 0"</code>" → unconditionally stable; can be designed for linear phase."</li>
                    <li>"• IIR: real feedback poles; design = pole placement inside the unit circle; ship as cascaded SOS biquads to survive quantization."</li>
                    <li>"• Bilinear transform "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 text-xs">"s = (2/T)(z−1)/(z+1)"</code>" turns an analog filter design into a stable digital one."</li>
                    <li>"• Initial value: "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 text-xs">"x(0⁺) = lim s X(s) as s → ∞"</code>"."</li>
                    <li>"• Final value: "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 text-xs">"x(∞) = lim s X(s) as s → 0"</code>" — only if all poles are LHP (except possibly a simple pole at 0)."</li>
                </ul>
            </div>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"How to answer common interview prompts"</h3>

            <h4 class="text-lg font-bold text-violet-300 mt-6 mb-2">"\"Why use Laplace at all?\""</h4>
            <p>"Two reasons. First, derivatives become multiplication by "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"s"</code>", so ODEs become algebra. Second, convolution becomes multiplication, so LTI input-output is just "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"Y(s) = H(s) X(s)"</code>". Everything else is in service of those two."</p>

            <h4 class="text-lg font-bold text-violet-300 mt-6 mb-2">"\"What's the relationship between Fourier and Laplace?\""</h4>
            <p>"Fourier is Laplace restricted to "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"σ = 0"</code>" — the imaginary axis of the s-plane. Laplace adds an "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"e^(−σt)"</code>" envelope so the integral converges on transient and growing signals that Fourier can't handle."</p>

            <h4 class="text-lg font-bold text-violet-300 mt-6 mb-2">"\"How do you know a system is stable?\""</h4>
            <p>"Look at the transfer function poles. Continuous-time: all poles strictly in the left half-plane. Discrete-time: all poles strictly inside the unit circle of the z-plane. One pole at the boundary is marginal; one pole outside is fatal."</p>

            <h4 class="text-lg font-bold text-violet-300 mt-6 mb-2">"\"FIR or IIR — what's the trade?\""</h4>
            <p>"FIR has no feedback, so all poles are at the origin and the filter is unconditionally stable. FIR can also be exactly linear phase. The cost is more taps for the same magnitude response. IIR has real feedback poles, gets sharper responses at lower compute, but must be designed to keep poles inside the unit circle and is usually shipped as cascaded biquads to survive coefficient quantization. In radar, FIR dominates the high-rate signal chain because of linear phase, predictability, and parallelism; IIR is common in slow housekeeping loops."</p>

            <h4 class="text-lg font-bold text-violet-300 mt-6 mb-2">"\"What's a pole-zero plot good for?\""</h4>
            <p>"Quick qualitative read of the response. Distance from the imaginary axis (or unit circle, in discrete-time) sets the decay rate. Vertical position sets the ringing frequency. The "<em>"dominant"</em>" pole — the one closest to the stability boundary — controls the system's qualitative settling behavior. Zeros on the boundary create notches; right-half-plane zeros create non-minimum-phase step responses."</p>

            <div class="my-8 p-5 rounded-xl bg-violet-500/5 border-l-4 border-violet-400">
                <p class="text-violet-100 m-0">
                    <strong>"The general tone:"</strong>
                    " be precise, be terse, "
                    <em>"don't"</em>
                    " try to flex with vocabulary the interviewer didn't reach for first. Show that you can move from time-domain intuition to s-domain (or z-domain) reasoning and back, and that you know which framing applies to which problem."
                </p>
            </div>

            <p>"Final chapter: a short, honest bibliography of where to go for more depth, broken out by what you actually want next."</p>
        </section>
    }
}
