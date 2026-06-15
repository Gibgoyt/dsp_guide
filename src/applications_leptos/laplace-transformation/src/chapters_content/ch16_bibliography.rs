use leptos::*;

#[component]
pub fn Ch16() -> impl IntoView {
    view! {
        <h2 class="text-3xl font-black mb-2 text-white">"16. Bibliography and References"</h2>
        <p class="text-zinc-400 italic mb-8">
            "A short, opinionated reading list. Books listed first; everything else is gravy."
        </p>

        <section class="space-y-5 text-zinc-300 leading-relaxed">

            <h3 class="text-xl font-bold text-white mt-4 mb-3">"For Laplace and Z-transform mastery"</h3>
            <ul class="space-y-3 ml-6 list-disc text-zinc-300">
                <li>
                    <strong class="text-violet-300">"Oppenheim & Willsky, "</strong>
                    <em>"Signals and Systems."</em>
                    " The canonical undergraduate textbook. Chapters 9 (Laplace) and 10 (Z-transform) cover everything in this guide with significantly more rigor and a more standard pedagogical arc."
                </li>
                <li>
                    <strong class="text-violet-300">"Oppenheim & Schafer, "</strong>
                    <em>"Discrete-Time Signal Processing."</em>
                    " The bible for the discrete side. Chapters on Z-transform, structures for digital filters, and FIR/IIR design are essential reading if you are doing DSP for a living."
                </li>
                <li>
                    <strong class="text-violet-300">"Lyons, "</strong>
                    <em>"Understanding Digital Signal Processing."</em>
                    " The engineer's DSP book. Less mathematically polished than Oppenheim, but much friendlier to the practitioner — full of diagrams, intuition, and 'why does the equation look like that' answers."
                </li>
                <li>
                    <strong class="text-violet-300">"Steven Smith, "</strong>
                    <em>"The Scientist and Engineer's Guide to Digital Signal Processing."</em>
                    " Free online (dspguide.com). Plain English, no nonsense, focused on what you'd actually use. The chapter on FIR vs IIR is particularly well-written."
                </li>
            </ul>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"For control-theory framing (if you want to go deeper)"</h3>
            <ul class="space-y-3 ml-6 list-disc text-zinc-300">
                <li>
                    <strong class="text-violet-300">"Franklin, Powell, Emami-Naeini, "</strong>
                    <em>"Feedback Control of Dynamic Systems."</em>
                    " The standard text. Skim it for context if a recruiter asks about closed-loop work; do not invest in mastering it unless your role is actually a controls role."
                </li>
                <li>
                    <strong class="text-violet-300">"Åström & Murray, "</strong>
                    <em>"Feedback Systems"</em>
                    ". Free online (caltech.edu). More modern, more rigorous, more appropriate if your work touches multi-input multi-output systems."
                </li>
            </ul>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"For radar specifically"</h3>
            <ul class="space-y-3 ml-6 list-disc text-zinc-300">
                <li>
                    <strong class="text-violet-300">"Mark Richards, "</strong>
                    <em>"Fundamentals of Radar Signal Processing."</em>
                    " The standard textbook in the field. Range and Doppler processing, pulse compression, CFAR, all written by someone who has been close to actual radar systems. This is far more relevant to a radar role than any Laplace textbook."
                </li>
                <li>
                    <strong class="text-violet-300">"Skolnik, "</strong>
                    <em>"Introduction to Radar Systems."</em>
                    " The classic systems-level radar book. Less DSP-focused than Richards; more about the whole radar engineering stack."
                </li>
                <li>
                    <strong class="text-violet-300">"Stimson, "</strong>
                    <em>"Introduction to Airborne Radar."</em>
                    " The most readable book on radar ever written. Diagrams, plain English, deeply pragmatic. Read this before reading Richards."
                </li>
            </ul>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Historical reading"</h3>
            <ul class="space-y-3 ml-6 list-disc text-zinc-300">
                <li>
                    <strong class="text-violet-300">"Roger Hahn, "</strong>
                    <em>"Pierre Simon Laplace 1749–1827: A Determined Scientist."</em>
                    " The definitive English-language biography. Less of a math book; more of a life-and-times. Worth reading if you ever found yourself wondering who he was."
                </li>
                <li>
                    <strong class="text-violet-300">"Paul J. Nahin, "</strong>
                    <em>"Oliver Heaviside: The Life, Work, and Times of an Electrical Genius of the Victorian Age."</em>
                    " The other half of the Laplace transform story — Heaviside's operational calculus, with all the engineering pragmatism and academic feuding the man was famous for."
                </li>
            </ul>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Companion guides in this study series"</h3>
            <ul class="space-y-2 ml-6 list-disc text-zinc-300">
                <li><a href="/fourier-transform" class="text-violet-300 hover:text-violet-200 underline">"The Fourier Transform — a complete guide"</a>". The piece that earns its place in your radar work most directly. Build that mastery first."</li>
                <li><a href="/signal-convolution" class="text-violet-300 hover:text-violet-200 underline">"Signal Convolution — a complete guide"</a>". From impulse responses and LTI to matched filters and FFT-accelerated convolution."</li>
            </ul>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Online references worth bookmarking"</h3>
            <ul class="space-y-2 ml-6 list-disc text-zinc-300">
                <li>
                    <strong class="text-violet-300">"DSP Stack Exchange"</strong>
                    " (dsp.stackexchange.com) — the highest-signal Q&A community for signal processing. The answers tagged "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"z-transform"</code>
                    " and "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"laplace-transform"</code>
                    " are often better than any textbook for a specific edge case."
                </li>
                <li>
                    <strong class="text-violet-300">"Steven Smith — dspguide.com"</strong>
                    " — the free online version of the book above. Reach for it when you need a quick pragmatic refresher."
                </li>
                <li>
                    <strong class="text-violet-300">"Paul Wilmott / The 3Blue1Brown Fourier video"</strong>
                    " (youtu.be/spUNpyF58BY) — the best 20-minute Fourier explainer ever made. Watch it once a quarter; it never gets old."
                </li>
            </ul>

            <div class="my-10 p-5 rounded-xl bg-violet-500/10 border border-violet-500/30">
                <p class="text-violet-100 m-0">
                    <strong>"Closing note."</strong>
                    " Laplace, like a lot of foundational math, is a "
                    <em>"vocabulary"</em>
                    " — once you have it, you read the literature differently. You see the unit circle in every digital-filter spec. You see the dominant pole in every step response. You see why FIR is the safe choice in your radar chain and why IIR is irresistible for that AGC loop. That is what mastery looks like in practice — not solving harder problems, but seeing the right ones quickly. Good luck."
                </p>
            </div>

        </section>
    }
}
