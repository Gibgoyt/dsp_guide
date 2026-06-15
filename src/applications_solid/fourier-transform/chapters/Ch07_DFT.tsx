import type { Component } from 'solid-js'
import DFTByHand from '../widgets/DFTByHand'

const Eq: Component<{ children: any }> = (props) => (
  <p class="font-mono text-center text-cyan-300 text-sm sm:text-base p-3 my-3 rounded-lg bg-zinc-900/70 border border-zinc-800 overflow-x-auto">
    {props.children}
  </p>
)

const Ch07_DFT: Component = () => {
  return (
    <article>
      <h2 class="text-3xl font-black mb-2 text-white">7. The DFT</h2>
      <p class="text-zinc-400 italic mb-8">
        The bottom-right cell of the 2×2 grid. The transform a computer actually computes.
      </p>

      <section class="space-y-5 text-zinc-300 leading-relaxed">
        <p>
          The Discrete Fourier Transform takes N samples in and produces N
          frequency bins out. Both domains are discrete, both are
          periodic. This is the transform you run on actual data.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Definition</h3>
        <Eq>X[k] = Σ<sub>n=0</sub><sup>N−1</sup> x[n] · e<sup>−j2πkn/N</sup>,  k = 0, 1, ..., N−1</Eq>
        <Eq>x[n] = (1/N) · Σ<sub>k=0</sub><sup>N−1</sup> X[k] · e<sup>j2πkn/N</sup>,  n = 0, 1, ..., N−1</Eq>
        <p>
          The forward DFT projects N time-domain samples onto N complex
          exponentials. The inverse reassembles. Note the 1/N — it's a
          convention; some people put it on the forward transform, some on the
          inverse, some split √(1/N) on each. We'll put it on the inverse.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">The twiddle factor</h3>
        <p>
          The complex exponential e<sup>−j2π/N</sup> appears so often it gets
          its own name:
        </p>
        <Eq>W<sub>N</sub> = e<sup>−j2π/N</sup></Eq>
        <p>
          With this, the DFT is:
        </p>
        <Eq>X[k] = Σ<sub>n=0</sub><sup>N−1</sup> x[n] · W<sub>N</sub><sup>kn</sup></Eq>
        <p>
          The twiddle factor is a unit-magnitude complex number that rotates by
          −2π/N radians per step. The Cooley–Tukey FFT (next chapter) is
          essentially a recipe for sharing W<sub>N</sub><sup>kn</sup>
          computations across many output bins.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">What the bins mean</h3>
        <p>
          With N samples at sampling rate fs, the bin index k corresponds to
          a physical frequency of:
        </p>
        <Eq>f<sub>k</sub> = k · fs / N,  k = 0, 1, ..., N−1</Eq>
        <p>
          The first bin (k=0) is the <strong>DC component</strong> (the average
          value of the signal). The bin k = N/2 is the Nyquist frequency fs/2.
          Bins above N/2 are conventionally interpreted as <strong>negative
          frequencies</strong> wrapped around — that is, bin (N−1) is the
          same physical frequency as bin (−1) = −fs/N.
        </p>
        <p>
          So the bin layout for N=8 sampled at fs=8 Hz:
        </p>
        <div class="overflow-x-auto">
          <table class="text-xs font-mono my-3 mx-auto">
            <thead>
              <tr class="text-zinc-500"><th class="px-3">k</th><th class="px-3">0</th><th class="px-3">1</th><th class="px-3">2</th><th class="px-3">3</th><th class="px-3">4</th><th class="px-3">5</th><th class="px-3">6</th><th class="px-3">7</th></tr>
            </thead>
            <tbody>
              <tr class="text-cyan-300"><td class="px-3 text-zinc-500">f (Hz)</td><td class="px-3">0</td><td class="px-3">1</td><td class="px-3">2</td><td class="px-3">3</td><td class="px-3">±4</td><td class="px-3">−3</td><td class="px-3">−2</td><td class="px-3">−1</td></tr>
            </tbody>
          </table>
        </div>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Frequency resolution Δf = fs / N — formalized</h3>
        <p>
          The bin spacing is fs/N. That's your <strong>frequency
          resolution</strong>: any two tones closer than fs/N will land in
          adjacent bins and be hard to separate. Want better resolution?
        </p>
        <ul class="ml-4 list-disc marker:text-cyan-400 space-y-1">
          <li>Increase N (longer observation window). Doubling N halves Δf.</li>
          <li>Decrease fs (lower sample rate, at the cost of bandwidth).</li>
        </ul>
        <p>
          This is the second uncertainty principle: you can't simultaneously
          have a short observation window <em>and</em> fine frequency
          resolution. For a radar, this is why the Doppler FFT is taken over
          many <em>pulses</em>, not many samples within one pulse — collecting
          slower data over a longer time gives finer Doppler resolution.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Symmetry for real-valued inputs</h3>
        <p>
          If x[n] is real (as opposed to complex), the DFT output has a
          symmetry called <strong>conjugate symmetry</strong>:
        </p>
        <Eq>X[N − k] = X*[k]</Eq>
        <p>
          That is, the second half of the spectrum is the complex conjugate of
          the first half, in reverse order. This means a real N-point DFT
          carries only N/2 + 1 independent complex values, not N. Specialized
          "real FFT" routines (<code class="text-zinc-300 bg-zinc-900 px-1 rounded">rfft</code>)
          exploit this to halve the computation and memory.
        </p>
        <p>
          For radar I/Q signals, the input is <em>complex</em> from the start,
          and this symmetry does <em>not</em> hold. That's a feature, not a bug
          — it's what lets us distinguish positive Doppler (target approaching)
          from negative Doppler (target receding).
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Worked example: 4-point DFT of [1, 0, −1, 0]</h3>
        <p>
          Let's grind one out by hand. N = 4, so W<sub>4</sub> = e<sup>−jπ/2</sup>
          = −j. The four twiddle powers we'll need are:
        </p>
        <Eq>W₄⁰ = 1,  W₄¹ = −j,  W₄² = −1,  W₄³ = j</Eq>
        <p>
          For each k, X[k] = Σ x[n] · W<sub>4</sub><sup>kn</sup>. With x =
          [1, 0, −1, 0], only n = 0 and n = 2 contribute. So:
        </p>
        <Eq>X[0] = 1·W₄⁰ + (−1)·W₄⁰ = 1 − 1 = 0</Eq>
        <Eq>X[1] = 1·W₄⁰ + (−1)·W₄² = 1 − (−1) = 2</Eq>
        <Eq>X[2] = 1·W₄⁰ + (−1)·W₄⁴ = 1·1 + (−1)·1 = 0</Eq>
        <Eq>X[3] = 1·W₄⁰ + (−1)·W₄⁶ = 1 + (−1)·(W₄²) = 1 + 1 = 2</Eq>
        <p>
          So X = [0, 2, 0, 2]. Interpretation: zero DC (the average of
          [1, 0, −1, 0] is 0); zero at k=2 (Nyquist); and 2 at k=1 and k=3.
          That is exactly what conjugate symmetry predicts for a real cosine
          at frequency fs/4. (Why fs/4? Because [1, 0, −1, 0] is one full
          period over 4 samples — one cycle per N/4 samples × N = fs/4 Hz.)
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Try other inputs by hand</h3>
        <p>
          The widget below does the literal sum — N×N complex multiplies, no
          tricks. Plug in inputs and read off X[k]. Try the impulse
          [1, 0, 0, 0]: every bin should equal 1 (an impulse contains every
          frequency equally). Try DC [1, 1, 1, 1]: only X[0] survives.
        </p>

        <DFTByHand />

        <h3 class="text-xl font-bold text-white mt-10 mb-3">The cost — and why we need the FFT</h3>
        <p>
          Each X[k] needs N complex multiplications and N−1 additions.
          There are N output bins, so the total cost is:
        </p>
        <Eq>~N² complex multiplies = O(N²)</Eq>
        <p>
          For N = 4, that's 16 multiplies — trivial. For N = 1024, it's about a
          million. For N = 4096, sixteen million. For a 1024 × 1024 range-Doppler
          frame in a radar, you'd need <em>two</em> O(N²) DFTs along each axis,
          repeated for thousands of rows — and the total is in the trillions of
          operations per frame.
        </p>
        <p>
          At a realistic frame rate that is simply not computable in the time
          budget. We need a faster recipe. That's the next chapter.
        </p>

        <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <h4 class="font-bold text-cyan-400 mb-2">What you should take from this chapter</h4>
          <ul class="space-y-2 text-zinc-300 m-0">
            <li>• DFT: X[k] = Σ x[n] · W<sub>N</sub><sup>kn</sup>, with W<sub>N</sub> = e<sup>−j2π/N</sup>.</li>
            <li>• N samples in → N complex bins out.</li>
            <li>• Bin k corresponds to frequency f<sub>k</sub> = k · fs / N.</li>
            <li>• <strong>Resolution Δf = fs/N</strong>; bins above N/2 are negative frequencies.</li>
            <li>• Real input → conjugate-symmetric spectrum; complex input doesn't have this symmetry (and that's exactly what radar needs).</li>
            <li>• Cost is <strong>O(N²)</strong>. For interesting N, that's too slow — hence the FFT.</li>
          </ul>
        </div>
      </section>
    </article>
  )
}

export default Ch07_DFT
