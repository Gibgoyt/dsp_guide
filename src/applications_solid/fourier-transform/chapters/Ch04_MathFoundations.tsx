import type { Component } from 'solid-js'
import AdditiveSynth from '../widgets/AdditiveSynth'

const Eq: Component<{ children: any }> = (props) => (
  <p class="font-mono text-center text-cyan-300 text-sm sm:text-base p-3 my-3 rounded-lg bg-zinc-900/70 border border-zinc-800 overflow-x-auto">
    {props.children}
  </p>
)

const Ch04_MathFoundations: Component = () => {
  return (
    <article>
      <h2 class="text-3xl font-black mb-2 text-white">4. Sines, Cosines, and Euler</h2>
      <p class="text-zinc-400 italic mb-8">
        The mathematical bones underneath every Fourier Transform.
      </p>

      <section class="space-y-5 text-zinc-300 leading-relaxed">
        <p>
          Before we look at any actual transform, we need to be comfortable with
          the basis functions Fourier built everything from. There are exactly
          three things to internalize: complex exponentials, inner products as
          projection, and orthogonality.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Euler's formula — the most important identity in DSP</h3>

        <Eq>e<sup>jθ</sup> = cos(θ) + j · sin(θ)</Eq>

        <p>
          Read this: a unit complex number with angle θ <em>is</em> a cosine and
          a sine glued together. The real part is the cosine; the imaginary part
          is the sine. As θ increases, the point rotates around the unit circle
          at unit angular speed.
        </p>

        <p>
          DSP uses <em>j</em> instead of <em>i</em> for √−1 because electrical
          engineers had already used <em>i</em> for current. Pick a side and
          stick with it; the math is identical.
        </p>

        <p>
          Set θ = 2πft and you get a rotating complex sinusoid at frequency
          <em> f </em>Hz:
        </p>

        <Eq>e<sup>j2πft</sup> = cos(2πft) + j · sin(2πft)</Eq>

        <p>
          This <em>single</em> object is the Fourier Transform's basis function.
          Why pack the cosine and sine together as a complex number instead of
          tracking them separately?
        </p>

        <ul class="ml-4 list-disc marker:text-cyan-400 space-y-1">
          <li><strong>Amplitude</strong>: |e<sup>j2πft</sup>| = 1, always.</li>
          <li><strong>Phase</strong>: 2πft, the angle as time advances.</li>
          <li><strong>Direction</strong>: positive frequency rotates one way (counter-clockwise); negative frequency rotates the other.</li>
        </ul>

        <p>
          The sign of the rotation tells you positive vs. negative frequency.
          That sign matters intensely in radar — it's the difference between a
          target moving toward you and away from you. We'll come back to it.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Why complex exponentials are the "natural" basis</h3>
        <p>
          We could decompose signals into all sorts of basis functions —
          Haar wavelets, Walsh functions, polynomials. Why are sines and
          cosines (equivalently: complex exponentials) special?
        </p>
        <p>
          Because they are the <strong>eigenfunctions of linear time-invariant
          (LTI) systems</strong>. Push a complex exponential through any LTI
          system — a filter, a delay line, an amplifier, any linear
          combination of these — and what comes out is the
          <em> same </em>exponential, only scaled in amplitude and shifted in
          phase. The shape is preserved.
        </p>

        <Eq>e<sup>j2πft</sup> &nbsp;→&nbsp; [ LTI system ] &nbsp;→&nbsp; H(f) · e<sup>j2πft</sup></Eq>

        <p>
          Here <em>H(f)</em> is the <strong>frequency response</strong> — a
          complex number whose magnitude is "how much this LTI system amplifies
          frequency f" and whose phase is "how much it delays frequency f". This
          is why frequency-domain analysis is so powerful: an LTI system, which
          could be ferociously complicated in time domain, becomes
          <em> one complex multiplication per frequency </em>in the
          Fourier domain.
        </p>

        <p>
          No other basis has this property. Sines and cosines aren't just one
          choice; they're the choice that <em>respects the structure</em> of the
          systems we care about.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Inner product = projection = "how much"</h3>
        <p>
          To ask "how much frequency f is in my signal", you compute the inner
          product between the signal and a pure tone at frequency f. For
          continuous-time signals:
        </p>

        <Eq>⟨x, φ_f⟩ = ∫ x(t) · e<sup>−j2πft</sup> dt</Eq>

        <p>
          That's literally the Continuous Fourier Transform formula. The
          transform <em>is</em> a family of inner products — one for every f.
          Each inner product asks: "how much does my signal look like a tone at
          this frequency?"
        </p>
        <p>
          The minus sign in the exponent is because we're projecting onto a
          conjugate. The inverse transform uses the positive sign — it
          reassembles the signal from those projections.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Orthogonality of the Fourier basis</h3>
        <p>
          Why does this decomposition work uniquely? Because the basis is
          <strong> orthogonal</strong>: any two distinct sines at different
          (integer-multiple) frequencies have inner product zero. Over one
          period T:
        </p>

        <Eq>∫₀ᵀ e<sup>j2πmt/T</sup> · e<sup>−j2πnt/T</sup> dt = T if m=n, else 0</Eq>

        <p>
          Each frequency contributes independently — pulling out the amount of
          frequency 5 doesn't change how much of frequency 3 there is. This is
          the same property that makes Cartesian coordinates work: pulling out
          the x-component of a 3D vector doesn't change its y- or z-components.
        </p>

        <p>
          For the discrete case (the DFT — next chapter beyond next), the same
          property holds for N complex exponentials sampled at N points:
        </p>

        <Eq>(1/N) · Σ<sub>n=0</sub><sup>N−1</sup> e<sup>j2πkn/N</sup> · e<sup>−j2πℓn/N</sup> = 1 if k=ℓ, else 0</Eq>

        <p>
          That's it. That's the whole engine. Project signal onto each basis
          tone, get the coefficient. Reassemble from coefficients × basis tones.
          The math is just a glorified change of coordinates.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">See it again, now that you know what it is</h3>
        <p>
          Below is the same additive synthesizer from Chapter 1. This time, look
          at it as <em>weighted sum of basis functions</em>: each slider sets
          the coefficient on basis function sin(2π·k·t) for k=1..5. The output
          waveform is the inner-product reconstruction. Watch what happens when
          you set the amplitudes for a square wave — every harmonic contributes
          orthogonally.
        </p>

        <AdditiveSynth />

        <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <h4 class="font-bold text-cyan-400 mb-2">What you should take from this chapter</h4>
          <ul class="space-y-2 text-zinc-300 m-0">
            <li>• <strong>Euler's formula</strong>: e<sup>jθ</sup> = cos(θ) + j sin(θ). The basis function of every Fourier Transform.</li>
            <li>• Complex exponentials are the <strong>eigenfunctions of LTI systems</strong> — that's why they're the natural basis.</li>
            <li>• The Fourier Transform <em>is</em> a family of inner products: ⟨x, e<sup>−j2πft</sup>⟩ for every f.</li>
            <li>• The basis is <strong>orthogonal</strong>: distinct frequencies don't interfere with each other's coefficients.</li>
            <li>• Sign of rotation = sign of frequency = direction of motion (matters for radar Doppler).</li>
          </ul>
        </div>
      </section>
    </article>
  )
}

export default Ch04_MathFoundations
