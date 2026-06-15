import type { Component } from 'solid-js'
import BenchTimeVsFFT from '../widgets/BenchTimeVsFFT'

const Ch09_FastConvolutionFFT: Component = () => {
  return (
    <article>
      <h2 class="text-3xl font-black mb-2 text-white">9. Fast Convolution via the FFT</h2>
      <p class="text-zinc-400 italic mb-8">
        The four-step recipe that takes convolution from O(N·M) to O(N log N) and made real-time DSP possible.
      </p>

      <section class="space-y-5 text-zinc-300 leading-relaxed">
        <p>
          The Convolution Theorem (Chapter 8) says that convolution in time
          equals multiplication in frequency. The Fast Fourier Transform (FFT)
          says you can compute that frequency representation in O(N log N).
          Together these are the entire reason fast convolution exists.
          Without them, real-time reverb, real-time image processing, and
          real-time radar would simply not fit inside the compute budget on
          any hardware shipping today.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">The recipe</h3>
        <p>To compute y = x ∗ h with x of length N and h of length M:</p>
        <ol class="ml-4 list-decimal marker:text-emerald-400 space-y-2">
          <li>
            Choose a transform length L. <strong>Required: L ≥ N + M − 1.</strong> Round up to a convenient size for the FFT — usually a power of 2.
          </li>
          <li>
            <strong>Zero-pad</strong> both x and h to length L.
          </li>
          <li>
            Forward FFT each: <span class="font-mono">X = FFT(x_padded)</span>, <span class="font-mono">H = FFT(h_padded)</span>.
          </li>
          <li>
            <strong>Pointwise multiply</strong>: <span class="font-mono">Y[k] = X[k] · H[k]</span> for each k.
          </li>
          <li>
            <strong>Inverse FFT</strong>: <span class="font-mono">y = IFFT(Y)</span>. Take the first N + M − 1 samples; the rest are zero by construction.
          </li>
        </ol>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Why it's fast</h3>
        <p>The asymptotic cost analysis is short and decisive:</p>
        <ul class="ml-4 list-disc marker:text-emerald-400 space-y-1">
          <li>Two forward FFTs: 2 · O(L log L).</li>
          <li>One pointwise multiply: O(L).</li>
          <li>One inverse FFT: O(L log L).</li>
          <li><strong>Total: O(L log L)</strong>, with L ≈ N + M.</li>
        </ul>
        <p>
          Compare to the direct time-domain sum's O(N · M). For an N=M=10⁶ convolution that's
          10¹² multiplies direct, versus about 4 · 10⁷ for the FFT route. Five orders of
          magnitude. <em>That's</em> why every reverb plugin, every cuFFT-based radar
          pipeline, and every CNN inference engine is built on this recipe.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Watch the crossover</h3>
        <p>
          For small N, the constant-factor overhead of the FFTs dominates and the direct
          sum wins. The crossover sits around N ≈ 64 in pure JavaScript, and around N ≈ 16–32
          in optimized C — and at N ≈ 1 in GPU code with large batch counts, because the
          GPU's hardware is built to make FFTs efficient even for tiny inputs.
        </p>

        <BenchTimeVsFFT />

        <h3 class="text-xl function-bold text-white mt-10 mb-3">Why L should be a power of 2 (and what to do if you can't make it one)</h3>
        <p>
          The classic radix-2 Cooley–Tukey FFT is the cleanest, fastest case
          and requires L to be a power of 2. Modern libraries (FFTW, cuFFT,
          PFFFT) implement composite-radix algorithms that handle any L that
          factors into small primes — typically powers of 2, 3, 5, 7. They
          still hate length-prime inputs (no nice radix to use). Practical
          advice: zero-pad to the nearest "nice" size your library handles,
          which is almost always a power of 2 or a 2-3-5-7 composite.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Real-valued shortcuts</h3>
        <p>
          For real-valued input signals — which is most of them, in audio and
          imaging — the spectrum is conjugate-symmetric: X[L−k] = X*[k]. So
          you only need to compute and multiply N/2 + 1 unique bins. Most FFT
          libraries expose a "real-to-complex" FFT path that does exactly this
          and is roughly 2× faster than the general complex FFT. For radar
          baseband, however, signals are complex (I/Q) and you use the full
          complex FFT.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">The two-and-only-two failure modes</h3>
        <p>
          With the recipe correct, only two bugs commonly bite. Both are
          covered in the next chapter, but let's name them now so you watch
          for them:
        </p>
        <ol class="ml-4 list-decimal marker:text-emerald-400 space-y-1">
          <li><strong>Under-padding</strong>: L &lt; N + M − 1 ⟹ circular wrap-around. (Ch. 10.)</li>
          <li><strong>Missed conjugate</strong>: implementing a matched filter as fast convolution but forgetting to conjugate H means you compute convolution with a flipped template, not correlation. Phase is wrong, Doppler corrupted. (Ch. 7 + 13.)</li>
        </ol>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">A note on memory layout (relevant for GPUs)</h3>
        <p>
          The FFT is a memory-bandwidth-bound algorithm in practice. Two
          performance-critical layout decisions:
        </p>
        <ul class="ml-4 list-disc marker:text-emerald-400 space-y-1">
          <li>
            <strong>Batched FFTs</strong>. If you have many independent
            convolutions of the same length (e.g. one per radar pulse), batch
            them into a single FFT call. cuFFT's <span class="font-mono">cufftPlanMany</span> launches one kernel per
            batch instead of one per signal — a 10–100× throughput improvement.
          </li>
          <li>
            <strong>Contiguous vs strided</strong>. The FFT runs fastest on
            contiguous arrays. If you need an FFT along a strided axis (e.g.
            slow-time pulses in a range-Doppler matrix), it's often cheaper
            to do a <em>transpose first</em> than to ask the FFT for a strided
            access pattern. We'll see the radar "corner-turn" example in Ch. 14.
          </li>
        </ul>

        <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <h4 class="font-bold text-emerald-400 mb-2">What you should take from this chapter</h4>
          <ul class="space-y-2 text-zinc-300 m-0">
            <li>• Fast convolution recipe: <strong>pad → FFT both → multiply → IFFT</strong>.</li>
            <li>• Cost <strong>O(L log L)</strong> with L ≥ N + M − 1.</li>
            <li>• Crossover with direct convolution is around N ≈ 16–128 depending on platform.</li>
            <li>• Real-to-complex FFT halves the cost for real-valued signals.</li>
            <li>• Batched FFTs and contiguous layouts win on GPUs.</li>
            <li>• Two failure modes to watch for: under-padding (circular wrap), missing conjugate (broken matched filter).</li>
          </ul>
        </div>

        <p>
          Next: the under-padding trap, in detail, with the ghost-target failure mode that this is a fix for.
        </p>
      </section>
    </article>
  )
}

export default Ch09_FastConvolutionFFT
