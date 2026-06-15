import type { Component } from 'solid-js'
import LeakageDemo from '../widgets/LeakageDemo'

const Eq: Component<{ children: any }> = (props) => (
  <p class="font-mono text-center text-cyan-300 text-sm sm:text-base p-3 my-3 rounded-lg bg-zinc-900/70 border border-zinc-800 overflow-x-auto">
    {props.children}
  </p>
)

const Row: Component<{ name: string; mainLobe: string; sideLobe: string; usage: string }> = (props) => (
  <tr class="border-b border-zinc-900">
    <td class="py-2 pr-3 font-bold text-white">{props.name}</td>
    <td class="py-2 pr-3 font-mono text-cyan-300">{props.mainLobe}</td>
    <td class="py-2 pr-3 font-mono text-cyan-300">{props.sideLobe}</td>
    <td class="py-2 text-zinc-400 text-xs">{props.usage}</td>
  </tr>
)

const Ch09_Windowing: Component = () => {
  return (
    <article>
      <h2 class="text-3xl font-black mb-2 text-white">9. Windowing &amp; Spectral Leakage</h2>
      <p class="text-zinc-400 italic mb-8">
        What happens when your signal isn't an integer number of cycles in the window — and how to deal with it.
      </p>

      <section class="space-y-5 text-zinc-300 leading-relaxed">
        <p>
          The DFT pretends your N samples represent one period of a periodic
          signal. If they really are one period (or an integer number of
          periods), everything works perfectly — the spectrum is a clean set
          of spikes at integer bins. If they aren't, the DFT sees a
          <em> discontinuity </em>where the end of your window doesn't match
          the beginning when periodically extended. That discontinuity has
          spectral content of its own, and it smears across all the bins.
          This is <strong>spectral leakage</strong>.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">What "on-bin" and "off-bin" mean</h3>
        <p>
          With N samples at rate fs, the DFT bins live at frequencies
          f<sub>k</sub> = k·fs/N. A frequency that lands exactly on an
          integer k is <strong>on-bin</strong>. A frequency that lands
          between two bins (say, k = 8.5) is <strong>off-bin</strong>.
        </p>
        <p>
          An on-bin sinusoid produces exactly one nonzero output magnitude
          (well, two — bin k and bin N−k, conjugate-symmetric). Beautiful, clean.
        </p>
        <p>
          An off-bin sinusoid produces a smeared spectrum — energy spreads
          into every bin, with a slowly decaying side-lobe pattern. That
          smearing is the leakage.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Why the rectangular window leaks badly</h3>
        <p>
          Implicitly, taking N samples without modification is the same as
          multiplying the underlying continuous signal by a rectangular window
          of width N. By the Convolution Theorem (Chapter 10), multiplying in
          time = convolving in frequency. So your spectrum gets convolved
          with the rectangular window's spectrum, which is a <strong>sinc
          function</strong>.
        </p>
        <Eq>spectrum(observed) = spectrum(true) ∗ sinc(N · f / fs)</Eq>
        <p>
          The sinc has a main lobe (the tall spike) and decaying side lobes.
          The side lobes of a rectangular window fall off only as 1/f — about
          <strong> −13 dB </strong>for the first side lobe, then about 6 dB per
          octave. That's terrible — a strong off-bin tone will mask weaker
          neighboring tones.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">The fix: tapered windows</h3>
        <p>
          Multiply your N samples by a smooth taper that goes to zero (or
          nearly zero) at both ends. The taper smooths the discontinuity at
          the window boundary, which dramatically reduces side-lobe
          leakage. The cost is a slightly wider main lobe.
        </p>

        <div class="overflow-x-auto my-4">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-zinc-500 border-b border-zinc-800">
                <th class="py-2 pr-3">Window</th>
                <th class="py-2 pr-3">Main lobe width</th>
                <th class="py-2 pr-3">1st side-lobe</th>
                <th class="py-2">Where you use it</th>
              </tr>
            </thead>
            <tbody>
              <Row name="Rectangular" mainLobe="2 bins"   sideLobe="−13 dB" usage="When the signal IS an integer number of cycles, or when you need maximum frequency resolution" />
              <Row name="Hann"        mainLobe="4 bins"   sideLobe="−32 dB" usage="General-purpose default; great trade-off; sin² shape" />
              <Row name="Hamming"     mainLobe="4 bins"   sideLobe="−43 dB" usage="Better side-lobe than Hann at the cost of slow side-lobe roll-off" />
              <Row name="Blackman"    mainLobe="6 bins"   sideLobe="−58 dB" usage="When you need to see weak signals next to strong ones" />
              <Row name="Kaiser"      mainLobe="adjustable" sideLobe="adjustable" usage="Tunable trade-off via parameter β; used in filter design" />
              <Row name="Flat-top"    mainLobe="~8 bins"  sideLobe="−93 dB" usage="When you need accurate amplitude readings for on-bin tones" />
            </tbody>
          </table>
        </div>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Window definitions</h3>
        <p>
          For N samples, n = 0, 1, ..., N−1:
        </p>
        <Eq>w<sub>Hann</sub>[n]     = 0.5 · (1 − cos(2π n / (N−1)))</Eq>
        <Eq>w<sub>Hamming</sub>[n]  = 0.54 − 0.46 · cos(2π n / (N−1))</Eq>
        <Eq>w<sub>Blackman</sub>[n] = 0.42 − 0.5 · cos(2πn/(N−1)) + 0.08 · cos(4πn/(N−1))</Eq>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Scalloping loss</h3>
        <p>
          Even with a great window, an off-bin tone's peak magnitude is lower
          than an on-bin tone's of equal amplitude. The maximum drop, between
          two adjacent bins, is called <strong>scalloping loss</strong>:
        </p>
        <ul class="ml-4 list-disc marker:text-cyan-400 space-y-1">
          <li>Rectangular: ~3.9 dB worst case</li>
          <li>Hann: ~1.4 dB</li>
          <li>Blackman: ~1.1 dB</li>
          <li>Flat-top: &lt; 0.01 dB (that's the entire point of flat-top)</li>
        </ul>
        <p>
          If you need precise amplitude measurements (calibration, spectrum
          analyzers reading sinusoid amplitudes), pick a flat-top window. If
          you need to detect weak signals near strong ones, pick Blackman or
          Kaiser. If you just want a reasonable spectrum plot, pick Hann.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">See it</h3>
        <p>
          Slide the frequency to an integer bin (e.g. 8.0) — the spectrum
          collapses to a single clean spike for any window. Slide it half a
          bin off (8.5) and watch the rectangular window smear energy
          everywhere. Switch to Hann or Blackman and watch the side lobes
          drop dramatically — at the price of a fatter main lobe.
        </p>

        <LeakageDemo />

        <h3 class="text-xl font-bold text-white mt-10 mb-3">The three facts to keep in your pocket</h3>
        <p>
          Three follow-up questions come up so often after "tell me about the
          FFT" that you should have memorized answers:
        </p>
        <ol class="ml-4 list-decimal marker:text-cyan-400 space-y-2">
          <li>
            <strong>"How many bins?"</strong> — An N-point FFT produces N bins.
            For real input, only N/2 + 1 are independent.
          </li>
          <li>
            <strong>"What's your frequency resolution?"</strong> —
            Δf = fs / N. To improve it, collect more samples or sample slower.
          </li>
          <li>
            <strong>"What about leakage?"</strong> — Window first. Hann is a
            sensible default; Blackman or flat-top when you need stronger
            side-lobe suppression or amplitude accuracy.
          </li>
        </ol>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Why this matters for radar</h3>
        <p>
          Radar processing windows the data <em>before</em> both FFTs (range
          and Doppler). A typical choice is a moderate Hann or Hamming on the
          fast-time axis (range) to suppress the response of strong nearby
          clutter and a more aggressive Blackman or Chebyshev on the slow-time
          axis (Doppler) to keep low-velocity ground clutter from masking
          high-velocity targets.
        </p>
        <p>
          The "you can't separate a target from clutter when the clutter's
          side-lobes are louder than the target" problem in radar
          is <em>literally</em> a spectral leakage problem. Window choice is a
          life-or-death decision in target detection.
        </p>

        <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <h4 class="font-bold text-cyan-400 mb-2">What you should take from this chapter</h4>
          <ul class="space-y-2 text-zinc-300 m-0">
            <li>• Off-bin frequencies cause <strong>spectral leakage</strong> because the rectangular window's spectrum is a sinc that gets convolved with everything.</li>
            <li>• Tapered windows (Hann, Hamming, Blackman, Kaiser, flat-top) trade wider main lobes for lower side lobes.</li>
            <li>• Use Hann as a sensible default; Blackman for weak-signal detection; flat-top for amplitude calibration.</li>
            <li>• <strong>Three facts to memorize</strong>: N bins, Δf = fs/N, window to control leakage.</li>
            <li>• Radar uses different windows on range vs. Doppler axes — the choice is a clutter-vs-target tradeoff.</li>
          </ul>
        </div>
      </section>
    </article>
  )
}

export default Ch09_Windowing
