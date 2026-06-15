import type { Component, JSX } from 'solid-js'
import { For } from 'solid-js'

interface QA {
  q: string
  a: JSX.Element
  link?: string // chapter slug to jump to
  linkLabel?: string
}

const QACard: Component<{ qa: QA }> = (props) => (
  <div class="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50">
    <div class="text-cyan-400 text-xs uppercase tracking-wider mb-2">Q</div>
    <div class="font-bold text-white mb-3">{props.qa.q}</div>
    <div class="text-cyan-400 text-xs uppercase tracking-wider mb-2">A</div>
    <div class="text-zinc-300 leading-relaxed">{props.qa.a}</div>
    {props.qa.link && (
      <div class="mt-3 text-xs">
        <a href={`/fourier-transform/${props.qa.link}`} class="text-cyan-400 hover:underline">
          → {props.qa.linkLabel ?? 'See chapter'}
        </a>
      </div>
    )}
  </div>
)

const Ch12_InterviewCheatsheet: Component = () => {
  const qas: QA[] = [
    {
      q: "What's the difference between the DFT and the FFT?",
      a: (
        <>
          <strong>The DFT is the transform; the FFT is an algorithm that
          computes the DFT.</strong> They produce byte-identical output. The
          difference is computational: naive DFT is O(N²), FFT is O(N log N).
          "Cooley–Tukey" is the most famous FFT algorithm but not the only
          one (Bluestein, mixed-radix, prime-factor).
        </>
      ),
      link: 'four-transforms',
      linkLabel: 'Ch. 2 — A Tale of Four Transforms',
    },
    {
      q: "What's the frequency resolution of an N-point FFT at sample rate fs?",
      a: (
        <>
          <strong>Δf = fs / N.</strong> That's bin spacing. Two tones closer
          than fs/N will be hard to separate in the spectrum. Improve
          resolution by collecting more samples (bigger N) or lowering the
          sample rate (smaller fs, at the cost of bandwidth).
        </>
      ),
      link: 'dft',
      linkLabel: 'Ch. 7 — The DFT',
    },
    {
      q: "Why is the FFT O(N log N)?",
      a: (
        <>
          Cooley–Tukey splits an N-point DFT into two N/2-point DFTs plus
          O(N) combining work (the "butterflies"). The recurrence
          T(N) = 2T(N/2) + O(N) solves to O(N log N). Equivalently:
          log₂(N) stages × N/2 butterflies per stage = (N/2)·log₂(N)
          complex multiplications.
        </>
      ),
      link: 'fft',
      linkLabel: 'Ch. 8 — The FFT',
    },
    {
      q: "What's spectral leakage, and how do you fight it?",
      a: (
        <>
          Leakage is what happens when your signal isn't an integer number of
          cycles in the FFT window — the DFT sees a discontinuity at the
          wrap-around and smears the energy across all bins. Fix: apply a
          tapered <strong>window function</strong> (Hann, Hamming, Blackman,
          Kaiser, flat-top) before the FFT. Each window trades
          main-lobe width against side-lobe level.
        </>
      ),
      link: 'windowing-leakage',
      linkLabel: 'Ch. 9 — Windowing & Spectral Leakage',
    },
    {
      q: "Why use complex-input FFT for radar instead of real-input FFT?",
      a: (
        <>
          The radar receiver outputs <strong>complex I/Q baseband
          samples</strong>. A real-valued FFT would produce
          conjugate-symmetric output — it couldn't distinguish positive
          frequency from negative. In Doppler processing,
          positive vs. negative frequency = target approaching vs. receding.
          Complex input is what lets you tell direction of motion.
        </>
      ),
      link: 'applications-radar',
      linkLabel: 'Ch. 11 — Radar Applications',
    },
    {
      q: "What is the Convolution Theorem and why does it matter?",
      a: (
        <>
          <strong>Convolution in time = multiplication in frequency.</strong>
          Direct time-domain convolution of length-N signals costs O(N²);
          via FFT it's O(N log N). It's the foundation of fast filtering, fast
          cross-correlation, radar matched filtering, image processing, and
          convolutional layers in neural networks. Remember to zero-pad to
          N + M − 1 to avoid circular wrap-around.
        </>
      ),
      link: 'convolution',
      linkLabel: 'Ch. 10 — Convolution',
    },
    {
      q: "What's the Nyquist criterion?",
      a: (
        <>
          To sample a real signal without aliasing, the sampling rate must be
          <strong> greater than twice the highest frequency present</strong>
          (fs &gt; 2·f<sub>max</sub>). For complex I/Q signals, you only need
          fs &gt; bandwidth. Real ADCs always have anti-alias filters on
          the input to enforce this. Once aliasing has happened, it cannot
          be undone.
        </>
      ),
      link: 'sampling-nyquist',
      linkLabel: 'Ch. 6 — Sampling & Nyquist',
    },
    {
      q: "Why are complex exponentials the natural basis for Fourier analysis?",
      a: (
        <>
          Because they are the <strong>eigenfunctions of linear
          time-invariant systems</strong>. Push e<sup>j2πft</sup> through any
          LTI system and what comes out is H(f)·e<sup>j2πft</sup> — same
          shape, scaled by a complex frequency response. No other basis has
          this property. The Fourier Transform isn't an arbitrary
          decomposition; it diagonalizes every LTI system.
        </>
      ),
      link: 'math-foundations',
      linkLabel: 'Ch. 4 — Math Foundations',
    },
    {
      q: "What does Parseval's theorem say?",
      a: (
        <>
          Energy is conserved between time and frequency domains:
          ∫|x(t)|² dt = ∫|X(f)|² df. The total energy of a signal is the
          same whether you measure it in time or in frequency. This is why
          the magnitude spectrum is the natural quantity to plot — its
          integral has direct physical meaning.
        </>
      ),
      link: 'continuous-ft',
      linkLabel: 'Ch. 5 — Continuous FT',
    },
    {
      q: "In radar range-Doppler processing, what does each FFT compute?",
      a: (
        <>
          Two FFTs per frame on a 2D buffer:<br />
          <strong>Range FFT</strong> along fast time (samples within one
          chirp) — converts the beat-tone frequency into a range bin.
          ΔR = c / (2B).<br />
          <strong>Doppler FFT</strong> along slow time (across chirps) —
          converts chirp-to-chirp phase progression into a velocity bin.
          Δv = λ / (2·K·T<sub>chirp</sub>).
        </>
      ),
      link: 'applications-radar',
      linkLabel: 'Ch. 11 — Radar Applications',
    },
    {
      q: "Why do FFT inputs come out in 'bit-reversed' order?",
      a: (
        <>
          When you recursively split a DFT into even-indexed and odd-indexed
          subsequences, the order the inputs are consumed in at the bottom of
          the recursion is the bit-reversed binary representation of their
          natural indices. For N = 8: [0,1,2,3,4,5,6,7] becomes
          [0,4,2,6,1,5,3,7]. An iterative FFT does this permutation in-place
          up front, then runs log₂(N) stages forward.
        </>
      ),
      link: 'fft',
      linkLabel: 'Ch. 8 — The FFT',
    },
    {
      q: "What library would you use for FFT in production?",
      a: (
        <>
          CPU: <strong>FFTW</strong> (auto-tuned) or <strong>Intel MKL</strong>.
          GPU: <strong>cuFFT</strong> (NVIDIA) or <strong>rocFFT</strong> (AMD).
          Python: <strong>numpy.fft</strong> or <strong>scipy.fft</strong>
          (usually backed by pocketfft). For radar GPU pipelines, batched
          cuFFT is the workhorse — call it once with N independent inputs and
          it runs all the FFTs in parallel across CUDA cores.
        </>
      ),
      link: 'fft',
      linkLabel: 'Ch. 8 — The FFT',
    },
    {
      q: "Who actually invented the FFT?",
      a: (
        <>
          <strong>Carl Friedrich Gauss</strong> had a working FFT-style
          algorithm around 1805 — before Fourier even presented his heat
          paper. He used it for asteroid orbit computation and never
          published; historians rediscovered it in his collected works (in
          Latin) in 1984. The modern world re-discovered the algorithm in
          1965 via Cooley and Tukey, motivated partly by the need to
          distinguish Soviet nuclear tests from earthquakes via seismic
          spectra.
        </>
      ),
      link: 'history',
      linkLabel: 'Ch. 3 — History, Corrected',
    },
  ]

  return (
    <article>
      <h2 class="text-3xl font-black mb-2 text-white">12. Interview Cheat-Sheet</h2>
      <p class="text-zinc-400 italic mb-8">
        The questions that come up in DSP / radar / SDR / embedded interviews — with the answer an interviewer is actually looking for.
      </p>

      <section class="space-y-5 text-zinc-300 leading-relaxed">
        <p>
          These aren't the only questions you'll be asked, but if you can
          answer all of these confidently, you've internalized the material.
          Each links back to the chapter where it's proved.
        </p>

        <div class="grid grid-cols-1 gap-4 mt-6">
          <For each={qas}>{(qa) => <QACard qa={qa} />}</For>
        </div>

        <div class="my-10 p-5 rounded-xl bg-cyan-500/5 border-l-4 border-cyan-400">
          <h4 class="font-bold text-cyan-300 mb-2">The single sentence that locks everything in</h4>
          <p class="text-cyan-100 m-0">
            <em>"The FFT is not a different transform from the DFT — it
            produces byte-identical output, just via a clever divide-and-conquer
            algorithm that drops the cost from O(N²) to O(N log N)."</em>
          </p>
        </div>

        <p>
          That's it. That's the whole guide. You now know what a Fourier
          Transform is, why it matters, where the FFT came from, how it
          actually works, what windowing does, what convolution has to do
          with all of it, and how the two FFTs in a radar processor turn raw
          ADC samples into a range-Doppler map. Go build something.
        </p>
      </section>
    </article>
  )
}

export default Ch12_InterviewCheatsheet
