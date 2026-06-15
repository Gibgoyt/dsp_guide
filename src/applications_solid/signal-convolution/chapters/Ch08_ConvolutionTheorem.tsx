import type { Component } from 'solid-js'
import ConvolutionTheoremDemo from '../widgets/ConvolutionTheoremDemo'

const Eq: Component<{ children: any }> = (props) => (
  <p class="font-mono text-center text-emerald-300 text-sm sm:text-base p-3 my-3 rounded-lg bg-zinc-900/70 border border-zinc-800 overflow-x-auto">
    {props.children}
  </p>
)

const Ch08_ConvolutionTheorem: Component = () => {
  return (
    <article>
      <h2 class="text-3xl font-black mb-2 text-white">8. The Convolution Theorem</h2>
      <p class="text-zinc-400 italic mb-8">
        Convolution in time becomes multiplication in frequency. Not a trick — a law.
      </p>

      <section class="space-y-5 text-zinc-300 leading-relaxed">
        <p>
          Convolution is expensive: O(N·M) multiplications for length-N and
          length-M inputs. The Fourier transform, applied to both signals,
          turns the convolution into something trivially cheap: element-wise
          multiplication. This is the <strong>Convolution Theorem</strong>,
          and it is the reason the Fourier transform and convolution are
          inseparable. Every fast convolution algorithm on every CPU and GPU
          today is built on this single identity.
        </p>

        <div class="my-8 p-5 rounded-xl bg-emerald-500/5 border-l-4 border-emerald-400">
          <p class="text-emerald-100 m-0">
            <strong>Statement.</strong> If x and h are signals with Fourier
            transforms X and H, then the Fourier transform of (x ∗ h) is
            X · H — the pointwise product.
          </p>
        </div>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">The continuous version</h3>
        <Eq>F{'{ x ∗ h }'}(f) = X(f) · H(f)</Eq>
        <p>And its dual — multiplication in time becomes convolution in frequency:</p>
        <Eq>F{'{ x · h }'}(f) = ( X ∗ H )(f)</Eq>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">The discrete version</h3>
        <p>For the discrete-time Fourier transform (DTFT):</p>
        <Eq>DTFT{'{ x ∗ h }'}(ω) = X(e<sup>jω</sup>) · H(e<sup>jω</sup>)</Eq>
        <p>For the discrete Fourier transform (DFT) — with the caveat that "convolution" here means <em>circular</em> convolution (Chapter 10):</p>
        <Eq>DFT{'{ x ⊛ h }'}[k] = X[k] · H[k]</Eq>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Proof sketch (continuous version)</h3>
        <p>Start from the definition. Apply the Fourier transform to the convolution:</p>
        <Eq>F{'{ x ∗ h }'}(f) = ∫<sub>t</sub> [ ∫<sub>τ</sub> x(τ)·h(t−τ) dτ ] · e<sup>−j2πft</sup> dt</Eq>
        <p>Swap the order of integration (assume integrability), and pull x(τ) out of the inner integral:</p>
        <Eq>= ∫<sub>τ</sub> x(τ) · [ ∫<sub>t</sub> h(t−τ) · e<sup>−j2πft</sup> dt ] dτ</Eq>
        <p>The inner integral is the Fourier transform of a time-shifted h, which is e<sup>−j2πfτ</sup> · H(f):</p>
        <Eq>= H(f) · ∫<sub>τ</sub> x(τ) · e<sup>−j2πfτ</sup> dτ = H(f) · X(f)</Eq>
        <p>
          QED. Three lines. The discrete version goes through identically.
          The discrete result is exact for <em>circular</em> convolution, which is
          what the DFT inherently computes. To get the linear convolution
          you actually want, you have to zero-pad correctly — Chapter 10.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Why this is a "law", not a trick</h3>
        <p>
          The theorem is not a coincidence of the math. It is the statement
          that <em>complex exponentials are eigenfunctions of LTI systems</em>.
          Feed e<sup>jωt</sup> into any LTI system, and the output is
          H(ω) · e<sup>jωt</sup>. Same frequency, just scaled (in
          magnitude) and shifted (in phase) by the single complex number H(ω).
        </p>
        <p>
          That makes the Fourier transform the natural basis in which LTI
          systems diagonalize. Convolution, which couples all the time samples
          together, becomes pointwise multiplication in frequency, where each
          frequency bin is handled independently. The Fourier transform
          <em> diagonalizes</em> convolution the way matrix-diagonalization
          decouples a coupled linear system into independent eigen-coordinates.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">See it (and confirm the match)</h3>
        <p>
          The widget below computes a convolution two ways: directly in time
          (the textbook sum) and via FFT (forward FFT, multiply, inverse FFT).
          Switch between the methods. Watch the reported maximum absolute
          error — it sits at machine epsilon. The two routines are
          algebraically identical; only the cost differs.
        </p>

        <ConvolutionTheoremDemo />

        <h3 class="text-xl font-bold text-white mt-10 mb-3">A few cousins that fall out for free</h3>
        <ul class="ml-4 list-disc marker:text-emerald-400 space-y-2">
          <li>
            <strong>Parseval's relation</strong>: the energy of a signal is
            the same in either domain. (Apply the convolution theorem to the
            autocorrelation, evaluate at zero lag.)
          </li>
          <li>
            <strong>Wiener–Khinchin theorem</strong>: the Fourier transform of
            the autocorrelation is the power spectral density. (FT of x ⋆ x =
            |X|².)
          </li>
          <li>
            <strong>Modulation theorem</strong>: multiplying by cos(ω₀t)
            shifts the spectrum by ±ω₀. (Multiplication-in-time ↔ convolution-in-frequency with two deltas.)
          </li>
          <li>
            <strong>Windowing leakage</strong>: windowing a signal in time
            convolves its spectrum with the window's spectrum — that's
            <em> why</em> windowing smears frequency content. (Same duality.)
          </li>
        </ul>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Symmetries — extra dividends in the frequency domain</h3>
        <p>
          For real-valued signals, the spectrum is conjugate-symmetric:
          X[N − k] = X*[k]. So half the spectrum is redundant. Real FFT
          libraries (FFTW's "r2c", cuFFT's CUFFT_R2C) exploit this and store
          only the first N/2 + 1 bins, halving both the compute and the
          memory bandwidth. The pointwise multiply Y[k] = X[k]·H[k] runs over
          this half-spectrum.
        </p>

        <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <h4 class="font-bold text-emerald-400 mb-2">What you should take from this chapter</h4>
          <ul class="space-y-2 text-zinc-300 m-0">
            <li>• <strong>x ∗ h  ⟷  X · H</strong>. Convolution in time, multiplication in frequency.</li>
            <li>• Dual: <strong>x · h  ⟷  X ∗ H</strong>. Multiplication in time, convolution in frequency.</li>
            <li>• Holds because complex exponentials are eigenfunctions of LTI systems. The Fourier transform <em>diagonalizes</em> convolution.</li>
            <li>• In the DFT, the "convolution" that becomes multiplication is <em>circular</em> — the linear-vs-circular subtlety is the entire content of Chapter 10.</li>
            <li>• Cousins: Parseval, Wiener–Khinchin, modulation, windowing leakage all fall out of duality.</li>
          </ul>
        </div>

        <p>
          Next: the FFT turns this theorem into the fastest convolution
          algorithm in practice.
        </p>
      </section>
    </article>
  )
}

export default Ch08_ConvolutionTheorem
