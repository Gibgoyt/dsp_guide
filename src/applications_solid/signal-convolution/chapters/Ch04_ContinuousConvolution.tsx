import type { Component } from 'solid-js'

const Eq: Component<{ children: any }> = (props) => (
  <p class="font-mono text-center text-emerald-300 text-sm sm:text-base p-3 my-3 rounded-lg bg-zinc-900/70 border border-zinc-800 overflow-x-auto">
    {props.children}
  </p>
)

const Ch04_ContinuousConvolution: Component = () => {
  return (
    <article>
      <h2 class="text-3xl font-black mb-2 text-white">4. Continuous Convolution</h2>
      <p class="text-zinc-400 italic mb-8">
        Same operation, integral instead of a sum. Useful for analog filters, optics, and physics.
      </p>

      <section class="space-y-5 text-zinc-300 leading-relaxed">
        <p>
          In continuous time, signals are functions of a real variable t, not
          a discrete index n. The impulse is no longer δ[n] = 1 at one sample;
          it is the <strong>Dirac delta</strong> δ(t) — a "function" of zero
          width and infinite height with unit area, defined by what it does
          inside an integral:
        </p>
        <Eq>∫ f(τ) · δ(τ − a) dτ = f(a)</Eq>
        <p>
          That's the <strong>sifting property</strong>: integrating any
          continuous function against a shifted delta extracts the value of
          the function at the shift. It's the continuous analog of the
          discrete identity x[n] = Σₖ x[k]·δ[n − k].
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">The convolution integral</h3>
        <p>
          Replace the sum with an integral and the index k with the dummy
          variable τ (tau), and the convolution sum becomes the
          <strong> convolution integral</strong>:
        </p>
        <Eq>(x ∗ h)(t) = ∫<sub>−∞</sub><sup>∞</sup> x(τ) · h(t − τ) dτ</Eq>
        <p>
          Read it exactly as you did the discrete version. The argument of h
          is (t − τ): "how long has it been since the input at time τ
          arrived?" The integral sums contributions from every past (and, for
          non-causal systems, future) input, each weighted by the impulse
          response.
        </p>
        <p>
          By the same one-line substitution u = t − τ as in the discrete
          case, commutativity is immediate:
        </p>
        <Eq>(x ∗ h)(t) = (h ∗ x)(t)</Eq>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Quick worked example: rect ∗ rect</h3>
        <p>
          Let rect(t) be 1 for |t| ≤ 1/2 and 0 otherwise. Convolving rect
          with itself produces a triangle:
        </p>
        <Eq>(rect ∗ rect)(t) = tri(t) = max(0, 1 − |t|)</Eq>
        <p>
          The intuition is exactly the discrete sliding picture: as one rect
          slides across the other, the overlap area grows linearly from 0 at
          t = −1, hits 1 at t = 0 (full overlap), then shrinks linearly back
          to 0 at t = +1. You'll redo this by hand in Chapter 6.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Connection to linear ODEs</h3>
        <p>
          Most analog systems an engineer cares about are described by linear
          constant-coefficient differential equations:
        </p>
        <Eq>aₙ·y⁽ⁿ⁾(t) + ... + a₁·y'(t) + a₀·y(t) = b₀·x(t) + ...</Eq>
        <p>
          For an RC low-pass with time constant τ, that's just:
        </p>
        <Eq>τ · y'(t) + y(t) = x(t)</Eq>
        <p>
          The impulse response of this system — its output when x(t) = δ(t) —
          is the familiar exponential decay:
        </p>
        <Eq>h(t) = (1/τ) · e^(−t/τ) · u(t)</Eq>
        <p>
          where u(t) is the unit step (0 for t&lt;0, 1 for t≥0). The output
          for any input is the convolution:
        </p>
        <Eq>y(t) = (x ∗ h)(t) = (1/τ) ∫₀<sup>∞</sup> x(t − τ') · e^(−τ'/τ) dτ'</Eq>
        <p>
          The LTI machinery converts a differential equation problem into a
          convolution problem — and, after Chapter 8, into a multiplication
          problem in the Fourier (or Laplace) domain. That's why analog filter
          design and digital filter design are taught together: the operation
          is the same on both sides.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Where continuous convolution shows up directly</h3>
        <ul class="ml-4 list-disc marker:text-emerald-400 space-y-1">
          <li>
            <strong>Analog filters</strong>. The output of an RLC circuit is
            the input convolved with the circuit's continuous impulse response.
          </li>
          <li>
            <strong>Optics and imaging</strong>. The image formed by a lens is
            the object convolved with the lens's
            <em> point spread function</em> (PSF). A perfect lens has δ(x,y);
            a real lens has a finite PSF that blurs the image. Deconvolution
            algorithms try to invert this.
          </li>
          <li>
            <strong>Probability and statistics</strong>. The probability
            density of a sum of two independent random variables is the
            convolution of their densities — which is why the sum of two
            uniforms is triangular (rect ∗ rect = tri).
          </li>
          <li>
            <strong>Heat and diffusion</strong>. The solution to the heat
            equation with initial temperature distribution f(x) is f convolved
            with a Gaussian kernel that broadens with time. Convolution
            <em> is</em> diffusion.
          </li>
          <li>
            <strong>Wave equations and Green's functions</strong>. For any
            linear PDE, the response to an arbitrary source is the source
            convolved with the Green's function — the PDE's impulse response.
          </li>
        </ul>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Continuous ↔ discrete: the sampling bridge</h3>
        <p>
          Real DSP systems live partly in continuous time (the analog input
          and output) and partly in discrete time (everything between the
          ADC and DAC). The bridge between them is sampling — covered fully
          in our companion Fourier guide — but the takeaway here is short:
        </p>
        <ul class="ml-4 list-disc marker:text-emerald-400 space-y-1">
          <li>If you sample x(t) and h(t) at rate fs with no aliasing, the discrete convolution x[n] ∗ h[n] computes samples of the continuous convolution x(t) ∗ h(t).</li>
          <li>If you alias, the answer is wrong, period. No clever post-processing fixes aliasing.</li>
          <li>For radar / communications you almost always work with complex (I/Q) baseband samples after downconversion, and the convolution acts component-wise on those complex values.</li>
        </ul>

        <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <h4 class="font-bold text-emerald-400 mb-2">What you should take from this chapter</h4>
          <ul class="space-y-2 text-zinc-300 m-0">
            <li>• <span class="font-mono">(x∗h)(t) = ∫ x(τ)·h(t−τ) dτ</span>. Same operation, integral instead of a sum.</li>
            <li>• Sifting in continuous time: <span class="font-mono">∫ f(τ)·δ(τ−a) dτ = f(a)</span>.</li>
            <li>• rect ∗ rect = tri (textbook example).</li>
            <li>• Linear ODEs ⟹ impulse response ⟹ continuous convolution.</li>
            <li>• Convolution is the universal "linear response to a source" for PDEs (Green's functions, PSFs, heat kernels).</li>
            <li>• Sample correctly and discrete convolution computes continuous convolution.</li>
          </ul>
        </div>

        <p>
          Next: the algebraic properties — commutativity, associativity,
          distributivity, the identity element — that let you reason about
          cascades and parallel filter banks without ever opening up the sum.
        </p>
      </section>
    </article>
  )
}

export default Ch04_ContinuousConvolution
