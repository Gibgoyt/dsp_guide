import type { Component } from 'solid-js'

const Eq: Component<{ children: any }> = (props) => (
  <p class="font-mono text-center text-cyan-300 text-sm sm:text-base p-3 my-3 rounded-lg bg-zinc-900/70 border border-zinc-800 overflow-x-auto">
    {props.children}
  </p>
)

const Ch06_Sampling: Component = () => {
  return (
    <article>
      <h2 class="text-3xl font-black mb-2 text-white">6. Sampling and Nyquist</h2>
      <p class="text-zinc-400 italic mb-8">
        The bridge from the continuous world to the digital one. The rule that defines it.
      </p>

      <section class="space-y-5 text-zinc-300 leading-relaxed">
        <p>
          The Continuous Fourier Transform lives in a world a computer can't
          reach. To get from there to the DFT (which is what we actually run on
          hardware), there's a single critical step: <strong>sampling</strong>.
          That step is governed by one of the most consequential theorems in
          all of signal processing.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">The sampling operation</h3>
        <p>
          A continuous signal x(t) is sampled at a uniform interval Tₛ to
          produce a discrete sequence:
        </p>
        <Eq>x[n] = x(n · Tₛ),  n = ..., −1, 0, 1, 2, ...</Eq>
        <p>
          The <strong>sampling frequency</strong> is fs = 1/Tₛ. If you sample at
          48 kHz (audio), Tₛ = 1/48000 ≈ 20.8 µs.
        </p>
        <p>
          Sampling, viewed in the frequency domain, has a dramatic effect on
          the spectrum: the original spectrum X(f) gets <strong>periodically
          replicated</strong> at every integer multiple of fs.
        </p>
        <Eq>X<sub>sampled</sub>(f) = fs · Σ<sub>k</sub> X(f − k·fs)</Eq>
        <p>
          The spectrum of a sampled signal is the original spectrum,
          repeating forever at intervals of fs. This periodicity is exactly
          why discrete-time signals have spectra that are periodic in
          frequency (and why we only ever plot frequencies from 0 to fs/2 —
          the rest is a repeat).
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Aliasing — where it all goes wrong</h3>
        <p>
          If the original spectrum X(f) extends above fs/2, then when you stack
          copies of it at multiples of fs, the copies <strong>overlap</strong>.
          The overlapping pieces add together. You can't tell which copy a
          given chunk of energy came from. High frequencies fold back into low
          frequencies. That's <strong>aliasing</strong>.
        </p>
        <p>
          A 18 kHz tone, sampled at 20 kHz, produces samples that are
          mathematically <em>indistinguishable</em> from a 2 kHz tone. Once
          aliasing has happened, no amount of clever processing can undo it.
          The information is gone.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">The Nyquist–Shannon Sampling Theorem</h3>
        <div class="my-6 p-5 rounded-xl bg-cyan-500/5 border-l-4 border-cyan-400">
          <p class="text-cyan-100 m-0">
            <strong>If a signal contains no frequencies above f<sub>max</sub>,
            then it can be perfectly reconstructed from samples taken at any
            rate fs &gt; 2·f<sub>max</sub>.</strong>
          </p>
        </div>
        <p>
          The threshold fs/2 is called the <strong>Nyquist frequency</strong>.
          The rule is sometimes called the "Nyquist criterion" or just the
          "sampling theorem." The names attached to it
          (Harry Nyquist, Claude Shannon, plus Whittaker and Kotelnikov who got
          there independently) reflect that several people discovered it
          between 1915 and 1949.
        </p>
        <p>
          "Perfectly reconstructed" here means <em>exactly</em>: there is a
          unique continuous signal that interpolates a set of properly-sampled
          values (via sinc interpolation), and that signal is the original.
          Nothing approximate about it.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Worked example: CD audio</h3>
        <p>
          Human hearing tops out around 20 kHz. CD audio samples at <strong>44.1
          kHz</strong> — comfortably above 2 × 20 kHz = 40 kHz. The extra 4 kHz
          is "guard band" to let the anti-alias filter (which can't be perfectly
          sharp) roll off without affecting audible content.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">The anti-alias filter</h3>
        <p>
          In any real ADC (analog-to-digital converter), the input signal is
          first low-pass filtered to remove energy above fs/2 <em>before</em>
          sampling. This is the <strong>anti-alias filter</strong>, and it is
          non-negotiable. Skip it, and any noise or signal content above fs/2
          aliases into your usable band as artifacts that can never be removed.
        </p>
        <p>
          On the output side (DAC, digital-to-analog), there's a complementary
          <strong> reconstruction filter</strong> that smooths the sample-and-hold
          staircase back into a continuous waveform.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">What happens in the radar pipeline</h3>
        <p>
          Modern radar receivers work at <strong>baseband</strong>: the radio-
          frequency signal (say, 77 GHz for automotive) is mixed down to a
          much lower intermediate frequency, then sampled with two parallel
          ADCs — one for the in-phase (I) channel, one for the quadrature (Q)
          channel. These I and Q samples together form a single complex sample.
        </p>
        <p>
          Because the signal is complex (not real), the Nyquist rule changes
          subtly: you only need <strong>fs &gt; bandwidth</strong>, not 2 ×
          bandwidth. A real signal occupies a band from −B to +B, total span
          2B; a complex baseband signal occupies 0 to +B, total span B. This
          is why I/Q sampling is so common in radio and radar: it halves the
          required sample rate.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Resolution = fs / N (you'll see this everywhere)</h3>
        <p>
          Once you have N samples at rate fs, the DFT will produce N frequency
          bins, evenly spaced from 0 to fs (or from −fs/2 to +fs/2 if you center
          them). The spacing — your <strong>frequency resolution</strong> — is:
        </p>
        <Eq>Δf = fs / N</Eq>
        <p>
          Want finer resolution? Collect more samples (bigger N) or sample at a
          lower rate (smaller fs, but at the cost of bandwidth). The bin width
          is the most-asked DSP follow-up question, so commit it to memory.
          We'll formalize it in the next chapter.
        </p>

        <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <h4 class="font-bold text-cyan-400 mb-2">What you should take from this chapter</h4>
          <ul class="space-y-2 text-zinc-300 m-0">
            <li>• Sampling replicates the spectrum at multiples of fs.</li>
            <li>• If those replicas overlap, you get <strong>aliasing</strong>. Once aliased, information is lost forever.</li>
            <li>• <strong>Nyquist</strong>: to avoid aliasing, sample at <strong>fs &gt; 2·f<sub>max</sub></strong> (real signal) or fs &gt; bandwidth (complex baseband).</li>
            <li>• Every real ADC has an <strong>anti-alias filter</strong> on the input.</li>
            <li>• I/Q sampling halves the required rate by making the signal complex.</li>
            <li>• <strong>Frequency resolution Δf = fs/N</strong> — first DSP follow-up question, every time.</li>
          </ul>
        </div>
      </section>
    </article>
  )
}

export default Ch06_Sampling
