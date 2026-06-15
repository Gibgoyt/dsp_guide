import type { Component } from 'solid-js'
import ButterflyDiagram from '../widgets/ButterflyDiagram'

const Eq: Component<{ children: any }> = (props) => (
  <p class="font-mono text-center text-cyan-300 text-sm sm:text-base p-3 my-3 rounded-lg bg-zinc-900/70 border border-zinc-800 overflow-x-auto">
    {props.children}
  </p>
)

const Ch08_FFT: Component = () => {
  return (
    <article>
      <h2 class="text-3xl font-black mb-2 text-white">8. The FFT — Cooley–Tukey</h2>
      <p class="text-zinc-400 italic mb-8">
        The algorithm that turns an O(N²) wall into an O(N log N) sprint, by exploiting symmetries already hiding in the DFT.
      </p>

      <section class="space-y-5 text-zinc-300 leading-relaxed">
        <p>
          Reminder from Chapter 2: the FFT is not a different transform from
          the DFT. It is a divide-and-conquer algorithm that computes the
          DFT, and its output is exactly identical. The only thing that
          changes is the operation count.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">The core insight</h3>
        <p>
          Start with the N-point DFT for N even. Split the input into
          even-indexed and odd-indexed samples:
        </p>
        <Eq>X[k] = Σ<sub>n=0</sub><sup>N−1</sup> x[n] · W<sub>N</sub><sup>kn</sup></Eq>
        <Eq>= Σ<sub>m=0</sub><sup>N/2−1</sup> x[2m] · W<sub>N</sub><sup>k(2m)</sup> + Σ<sub>m=0</sub><sup>N/2−1</sup> x[2m+1] · W<sub>N</sub><sup>k(2m+1)</sup></Eq>
        <p>
          Use W<sub>N</sub><sup>2</sup> = W<sub>N/2</sub> (since
          e<sup>−j2π·2/N</sup> = e<sup>−j2π/(N/2)</sup>) and factor out
          W<sub>N</sub><sup>k</sup> from the odd sum:
        </p>
        <Eq>X[k] = E[k] + W<sub>N</sub><sup>k</sup> · O[k]</Eq>
        <p>
          where E[k] is the N/2-point DFT of the even-indexed samples and O[k]
          is the N/2-point DFT of the odd-indexed samples.
        </p>
        <p>
          But k ranges over 0..N−1, while E and O are only defined for k =
          0..N/2−1. Use periodicity (E[k + N/2] = E[k]) and one twiddle
          identity (W<sub>N</sub><sup>k + N/2</sup> = −W<sub>N</sub><sup>k</sup>)
          to get:
        </p>
        <Eq>X[k]       = E[k] + W<sub>N</sub><sup>k</sup> · O[k]</Eq>
        <Eq>X[k + N/2] = E[k] − W<sub>N</sub><sup>k</sup> · O[k]</Eq>
        <p>
          One subproblem of size N became two subproblems of size N/2 plus
          O(N) combining work. That's it. That's the entire FFT.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">The butterfly</h3>
        <p>
          The pair of equations above — one sum, one difference, both sharing
          the same twiddle-weighted O[k] — is called a <strong>butterfly</strong>
          because of how it looks when drawn:
        </p>
        <Eq>
          {`E[k] ─┬─ E[k] + W^k O[k]
                  ╳
          O[k]·W^k ─┴─ E[k] − W^k O[k]`}
        </Eq>
        <p>
          The butterfly takes two inputs and produces two outputs using
          exactly <em>one</em> complex multiplication and two complex
          additions. The "X" shape is where the name comes from.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Why this gives O(N log N)</h3>
        <p>
          Apply the splitting recursively. The cost recurrence is:
        </p>
        <Eq>T(N) = 2 · T(N/2) + O(N)</Eq>
        <p>
          By the Master Theorem (or by direct expansion), this is O(N log N).
        </p>
        <p>
          More concretely: there are log₂(N) levels of splitting (you halve
          each time until you hit size 1). At each level, there are N/2
          butterflies. Each butterfly costs 1 complex multiply and 2 complex
          adds. Total:
        </p>
        <Eq>(N/2) · log₂(N) complex multiplies = O(N log N)</Eq>
        <p>
          For N = 1024: DFT is ~1,048,576 multiplies; FFT is ~5,120
          multiplies. About a <strong>200×</strong> speedup. For N = 1,048,576
          (one million points), the speedup is over 50,000×. The advantage
          grows without bound as N grows.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Bit-reversal permutation</h3>
        <p>
          When you split into even/odd and recurse, the inputs at the bottom
          of the recursion show up in a particular order: <strong>bit-reversed
          index order</strong>. For N=8, the order is:
        </p>
        <div class="overflow-x-auto">
          <table class="text-xs font-mono my-3 mx-auto">
            <thead>
              <tr class="text-zinc-500"><th class="px-2">natural</th><th class="px-2">binary</th><th class="px-2">reversed</th><th class="px-2">bit-rev</th></tr>
            </thead>
            <tbody class="text-cyan-300">
              <tr><td class="px-2">0</td><td class="px-2">000</td><td class="px-2">000</td><td class="px-2">0</td></tr>
              <tr><td class="px-2">1</td><td class="px-2">001</td><td class="px-2">100</td><td class="px-2">4</td></tr>
              <tr><td class="px-2">2</td><td class="px-2">010</td><td class="px-2">010</td><td class="px-2">2</td></tr>
              <tr><td class="px-2">3</td><td class="px-2">011</td><td class="px-2">110</td><td class="px-2">6</td></tr>
              <tr><td class="px-2">4</td><td class="px-2">100</td><td class="px-2">001</td><td class="px-2">1</td></tr>
              <tr><td class="px-2">5</td><td class="px-2">101</td><td class="px-2">101</td><td class="px-2">5</td></tr>
              <tr><td class="px-2">6</td><td class="px-2">110</td><td class="px-2">011</td><td class="px-2">3</td></tr>
              <tr><td class="px-2">7</td><td class="px-2">111</td><td class="px-2">111</td><td class="px-2">7</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Read the binary representation of each natural index backwards, and
          you get the order the inputs are consumed in. An iterative FFT
          implementation usually does this permutation in-place up front, then
          runs log N stages of butterflies forward.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">See it: 8-point FFT</h3>
        <p>
          The diagram below shows the complete 8-point FFT data flow. Inputs
          come in on the left in bit-reversed order. Each butterfly is one
          twiddle-weighted "X". Three stages, four butterflies each. Hover any
          butterfly to see its twiddle factor W₈<sup>k</sup>.
        </p>

        <ButterflyDiagram />

        <p>
          Twelve butterflies total. Each is one complex multiply and two
          complex adds. Compare to the naive DFT: 64 complex multiplies. The
          speedup factor is 64 / 12 ≈ 5.3 — small for N=8 but it scales as
          N / log₂(N).
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Variants and limitations</h3>
        <p>
          <strong>Radix-2</strong> (what we just walked through) requires N to
          be a power of two. If your data length isn't a power of two, options
          include:
        </p>
        <ul class="ml-4 list-disc marker:text-cyan-400 space-y-1">
          <li><strong>Zero-pad</strong> to the next power of two. Cheapest and most common in practice.</li>
          <li><strong>Mixed-radix FFT</strong>: factor N into small primes (e.g. N=12 = 4·3) and use a different butterfly per radix.</li>
          <li><strong>Bluestein's algorithm</strong> (chirp-z): converts an arbitrary-N DFT into a convolution that you compute with a power-of-two FFT.</li>
          <li><strong>Prime-factor algorithm</strong> (Good–Thomas): if N's factors are coprime, you can split with no twiddle factors at all.</li>
        </ul>
        <p>
          For a real-valued input, an <strong>rfft</strong> exploits conjugate
          symmetry to halve the cost again. For radar, where inputs are
          complex I/Q, you use the standard complex FFT.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">In practice</h3>
        <p>
          Nobody writes their own FFT in production. You use a library:
        </p>
        <ul class="ml-4 list-disc marker:text-cyan-400 space-y-1">
          <li><strong>FFTW</strong> ("Fastest Fourier Transform in the West") — gold-standard CPU library, auto-tunes per-platform.</li>
          <li><strong>Intel MKL</strong> — heavily optimized for Intel CPUs.</li>
          <li><strong>cuFFT</strong> — NVIDIA's GPU FFT library, batches thousands of independent transforms in parallel.</li>
          <li><strong>numpy.fft</strong>, <strong>scipy.fft</strong> — convenient Python wrappers, usually backed by pocketfft.</li>
        </ul>
        <p>
          On a GPU, the <em>batched</em> FFT pattern is critical: you call
          cuFFT once asking it to do N independent K-point FFTs, and it runs
          them all in parallel across thousands of CUDA cores. Radar
          range-Doppler processing is the canonical batched-FFT workload, and
          it's why GPUs eat that problem alive.
        </p>

        <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <h4 class="font-bold text-cyan-400 mb-2">What you should take from this chapter</h4>
          <ul class="space-y-2 text-zinc-300 m-0">
            <li>• FFT splits the DFT into two half-size DFTs plus O(N) combining: T(N) = 2T(N/2) + O(N) → <strong>O(N log N)</strong>.</li>
            <li>• The basic operation is the <strong>butterfly</strong>: one complex multiply, two complex adds.</li>
            <li>• N-point FFT = log₂(N) stages × N/2 butterflies = (N/2)·log₂N multiplies.</li>
            <li>• Inputs are bit-reversal permuted; outputs come out in natural order.</li>
            <li>• Radix-2 needs N = power of two; other variants (mixed-radix, Bluestein) handle other sizes.</li>
            <li>• In production: use FFTW / MKL / cuFFT. Batched cuFFT on GPU is the radar/imaging workhorse.</li>
          </ul>
        </div>
      </section>
    </article>
  )
}

export default Ch08_FFT
