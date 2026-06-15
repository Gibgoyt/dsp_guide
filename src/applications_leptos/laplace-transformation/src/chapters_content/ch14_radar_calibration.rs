use leptos::*;

#[component]
pub fn Ch14() -> impl IntoView {
    view! {
        <h2 class="text-3xl font-black mb-2 text-white">"14. Radar Calibration — Where Laplace/Z Earn Their Keep"</h2>
        <p class="text-zinc-400 italic mb-8">
            "A standard advice column will tell you Laplace is the bedrock of all signal processing. That's broadly true and badly miscalibrated for radar. Here's where Laplace/Z transform thinking actually earns its place in your radar work — and, just as important, where it doesn't."
        </p>

        <section class="space-y-5 text-zinc-300 leading-relaxed">
            <h3 class="text-xl font-bold text-white mt-4 mb-3">"The framing problem"</h3>
            <p>
                "Laplace and the Z-transform descend from "
                <strong class="text-violet-300">"control theory"</strong>
                ". Their canonical use cases — flight controllers, motor drives, power-grid stability, process control — are "
                <em>"feedback"</em>
                " problems where stability of a closed loop is the question. A pole in the right half-plane is the difference between a quiet cabin and an aircraft pitching itself into the ground."
            </p>
            <p>
                "Radar signal processing is, almost entirely, "
                <strong class="text-violet-300">"open-loop"</strong>
                ". You emit a pulse. The pulse reflects off the world. You collect the echoes. You detect, range, Doppler-process, and report. No feedback loop is closing in the signal chain. Stability of a control loop is not the question that defines your work."
            </p>

            <div class="my-8 p-5 rounded-xl bg-violet-500/5 border-l-4 border-violet-400">
                <p class="text-violet-100 m-0">
                    <strong>"This is why generic 'master Laplace for radar' advice is over-prescribed."</strong>
                    " It maps cleanly onto fields the advisor is more familiar with — and only partially onto radar. The bulk of radar DSP is Fourier-heavy, not Laplace-heavy."
                </p>
            </div>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Where Laplace/Z actually shows up in radar"</h3>
            <h4 class="text-lg font-bold text-violet-300 mt-6 mb-2">"1. IIR filter design for housekeeping"</h4>
            <p>
                "Slow-loop control problems "
                <em>"do"</em>
                " exist in a radar system, just not in the high-rate detection chain: AGC loops, anti-jam adaptive filters, calibration tracking loops, motor servos on the rotating antenna. These are control-theory problems and Laplace/Z analysis is the right tool."
            </p>

            <h4 class="text-lg font-bold text-violet-300 mt-6 mb-2">"2. FIR vs IIR decisions in the receive chain"</h4>
            <p>"You will decide whether a particular filter (DC blocker, anti-alias, channelizer prototype, equalizer) should be FIR or IIR. That decision uses Chapter 13 reasoning directly: linear phase, stability margin under quantization, parallelizability. The Z-transform is the language in which that decision is made."</p>

            <h4 class="text-lg font-bold text-violet-300 mt-6 mb-2">"3. Reading vendor / colleague filter specs"</h4>
            <p>"When somebody hands you a filter design as a "<code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"H(z)"</code>" rational form, a pole-zero plot, or biquad coefficients, you need to be fluent enough to read it, verify it, and integrate it. That fluency comes from chapters 6–8 and 12–13 of this guide."</p>

            <h4 class="text-lg font-bold text-violet-300 mt-6 mb-2">"4. Matched filter as a special FIR"</h4>
            <p>
                "The matched filter — the heart of pulse-compression radar — is technically an FIR filter whose tap coefficients are the time-reversed conjugate of the transmitted pulse. It "
                <em>"could"</em>
                " be analyzed via "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-violet-300 font-mono text-sm">"H(z)"</code>
                ", but in practice the design is dominated by Fourier-domain considerations (ambiguity function, range/Doppler coupling, sidelobe shaping with windows). Z-domain analysis is technically applicable but not where the interesting decisions get made."
            </p>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Where it doesn't show up"</h3>
            <p>"The heavy-rate parts of the radar pipeline are Fourier-heavy and convolution-heavy. They sit firmly in the Fourier / matched-filter framework and Laplace/Z analysis adds nothing useful there:"</p>

            <ul class="space-y-2 ml-6 list-disc text-zinc-300">
                <li><strong class="text-violet-300">"Range FFT and Doppler FFT"</strong>": these are pure Fourier-domain operations. No control loop. No pole-zero plot. Just FFT, windowing, magnitude/log-mag, peak detection."</li>
                <li><strong class="text-violet-300">"Pulse compression / matched filtering"</strong>": modeled as convolution, implemented as FFT × FFT × IFFT in production. Convolution-theorem and FFT structure dominate. Z-domain analysis adds no insight to a process that is already optimal by the Neyman-Pearson criterion."</li>
                <li><strong class="text-violet-300">"CFAR detection"</strong>": a sliding statistical threshold test. Not a filter in the Laplace/Z sense at all. You will see CA-CFAR, GO-CFAR, OS-CFAR — these are statistics-and-thresholds problems, not pole-zero problems. Do "<em>"not"</em>" try to force a Z-domain framing on it."</li>
                <li><strong class="text-violet-300">"Beamforming"</strong>": spatial Fourier transform across an antenna array. Linear algebra and Fourier."</li>
                <li><strong class="text-violet-300">"Tracking (MHT, JPDA, EKF / UKF)"</strong>": Kalman-style state estimation. The Z-transform notation pops up incidentally in linear Gaussian state-space models, but the heavy lifting is Bayesian filtering, not pole-zero analysis."</li>
            </ul>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"What that means for your prep"</h3>
            <p>
                "Understand Laplace/Z deeply enough to "
                <em>"talk about it fluently"</em>
                ": the s-plane and z-plane geometry, the stability rules, the FIR/IIR trade, and where the unit circle comes from. You should be able to read a pole-zero plot in seconds, verify a digital filter is stable, and have an intelligent conversation about whether a particular sub-block should be FIR or IIR."
            </p>
            <p>
                "Then "
                <strong class="text-violet-300">"stop"</strong>
                ". Do not disappear into a full control-theory course (root locus tuning, Nyquist criterion for stability margins, Lyapunov methods, etc.) just because a generic advisor recommended it. Your radar role's "
                <em>"differentiator"</em>
                " is the FFT / matched-filter / range-Doppler / CFAR pipeline, ideally accelerated on a GPU or FPGA. Time spent there returns more on the day-to-day work than time spent on Bode plot mastery."
            </p>

            <div class="my-8 p-5 rounded-xl bg-violet-500/5 border-l-4 border-violet-400">
                <p class="text-violet-100 m-0">
                    <strong>"The right portfolio of skills:"</strong>
                </p>
                <ul class="text-violet-100 m-0 mt-2 space-y-1 list-disc pl-5">
                    <li><strong>"Reflexive"</strong>": unit-circle stability rule, FIR-is-always-stable, transfer function geometry."</li>
                    <li><strong>"Solid"</strong>": Fourier (DFT, FFT, windowing, leakage), convolution theorem, matched filtering, sampling theorem."</li>
                    <li><strong>"Sharp"</strong>": CFAR families, range/Doppler processing chain, target tracking basics."</li>
                    <li><strong>"Differentiator"</strong>": doing the heavy compute fast — CUDA, vectorized intrinsics, FPGA DSP slices, mixed-precision tradeoffs."</li>
                </ul>
            </div>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"What you should take from this chapter"</h3>
            <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
                <ul class="space-y-2 text-zinc-300 m-0 list-none p-0">
                    <li>"• Laplace/Z descends from control theory, where closed-loop stability is the question."</li>
                    <li>"• Radar signal processing is "<strong>"open-loop"</strong>" — Fourier and matched-filter analysis dominate."</li>
                    <li>"• Where Laplace/Z "<em>"does"</em>" earn its place in radar: IIR filter design, FIR/IIR decisions, slow control loops (AGC, antenna servo), reading filter specs."</li>
                    <li>"• Where it "<em>"doesn't"</em>": range/Doppler FFTs, CFAR, beamforming, the bulk of the high-rate detection chain."</li>
                    <li>"• Be calibrated. Understand the picture; don't over-invest at the expense of FFT/matched-filter/acceleration mastery."</li>
                </ul>
            </div>

            <p>"Next: the crisp interview-ready summary of everything in this guide, written so it fits on one page and signals real understanding without overclaiming."</p>
        </section>
    }
}
