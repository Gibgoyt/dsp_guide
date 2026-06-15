import type { Component } from 'solid-js'

const Eq: Component<{ children: any }> = (props) => (
  <p class="font-mono text-center text-emerald-300 text-sm sm:text-base p-3 my-3 rounded-lg bg-zinc-900/70 border border-zinc-800 overflow-x-auto">
    {props.children}
  </p>
)

const Ch05_PropertiesAndAlgebra: Component = () => {
  return (
    <article>
      <h2 class="text-3xl font-black mb-2 text-white">5. Properties and the Algebra of Convolution</h2>
      <p class="text-zinc-400 italic mb-8">
        Convolution forms a commutative algebra with δ as identity. Most of the rules you'd hope for are true.
      </p>

      <section class="space-y-5 text-zinc-300 leading-relaxed">
        <p>
          Convolution is more than an operation — it is the multiplication of
          a commutative algebra on the space of signals. The familiar rules
          of arithmetic mostly carry over: commutative, associative,
          distributive, with an identity element. Once you know these
          properties you can manipulate filter cascades and parallel banks
          using normal algebra and stop reasoning about the underlying sums
          and integrals every time.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Commutativity</h3>
        <Eq>x ∗ h = h ∗ x</Eq>
        <p>
          Proof: change of variable m = n − k in the convolution sum (we did
          this in Chapter 3). Physically, it means there's no special
          distinction between "the input signal" and "the impulse response"
          — you can swap the roles and get the same output.
        </p>
        <p>
          This is occasionally useful in implementation: if your input is much
          longer than your filter, it's cheaper to slide the short one over
          the long one, but mathematically it doesn't matter which you pick.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Associativity</h3>
        <Eq>(x ∗ h₁) ∗ h₂ = x ∗ (h₁ ∗ h₂)</Eq>
        <p>
          A cascade of two LTI systems is equivalent to a single LTI system
          whose impulse response is the convolution of the two individual
          ones. This is the basis of every "I'll precompute the combined
          filter" optimization in DSP.
        </p>
        <p>
          Example: a multi-stage equalizer with bands EQ₁, EQ₂, ..., EQ_K
          applied in series can be collapsed to a single FIR filter
          h = EQ₁ ∗ EQ₂ ∗ ... ∗ EQ_K. Once collapsed, you pay one convolution
          per sample at runtime instead of K.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Distributivity over addition</h3>
        <Eq>x ∗ (h₁ + h₂) = (x ∗ h₁) + (x ∗ h₂)</Eq>
        <p>
          A parallel bank of LTI systems sharing the same input is equivalent
          to a single LTI system whose impulse response is the
          <em> sum</em> of the individual ones. This is how you build, for
          example, a graphic-EQ where the wet signal is the sum of multiple
          band-pass branches.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Identity element</h3>
        <Eq>x ∗ δ = x</Eq>
        <p>
          The unit impulse is the multiplicative identity for convolution.
          Applying a "do-nothing" filter to a signal returns the signal
          itself. More generally, convolution with a shifted impulse just
          shifts the signal:
        </p>
        <Eq>x[n] ∗ δ[n − n₀] = x[n − n₀]</Eq>
        <p>
          So a pure delay line is just convolution with δ[n − n₀]. That gives
          you a clean algebraic vocabulary: any LTI system you build can be
          described as a sum / cascade / convolution of impulses, scaled
          impulses, and delays.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Scaling</h3>
        <Eq>(α·x) ∗ h = α·(x ∗ h) = x ∗ (α·h)</Eq>
        <p>
          Scalars slide through the convolution. Combined with distributivity
          this gives full linearity in both arguments — convolution is a
          <em> bilinear</em> operation.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Shift</h3>
        <Eq>x[n] ∗ h[n − n₀] = (x ∗ h)[n − n₀]</Eq>
        <p>
          Delaying either input by n₀ delays the output by n₀. (You can prove
          it by substitution in the sum, or by reading it off the algebra:
          shifting is convolution with δ[n − n₀], which by associativity
          slides freely.)
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Differentiation / difference</h3>
        <p>
          In continuous time, differentiation distributes over convolution:
        </p>
        <Eq>(x ∗ h)' = x' ∗ h = x ∗ h'</Eq>
        <p>
          In discrete time the same is true with the first-difference
          operator (x[n] − x[n − 1]). This is the abstract reason a
          "differencer then filter" gives the same result as "filter then
          differencer" — the operations commute.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Sum / area is preserved (DC gain)</h3>
        <p>
          The total area under the convolution equals the product of the
          areas of the two inputs:
        </p>
        <Eq>Σ<sub>n</sub> (x ∗ h)[n] = ( Σ<sub>n</sub> x[n] ) · ( Σ<sub>n</sub> h[n] )</Eq>
        <p>
          Read in the frequency domain (Chapter 8), this is just the
          fact that DC (k=0) values multiply: X[0] · H[0]. In practice it
          gives you a sanity check — if Σ h[n] = 1 (a "unit-DC-gain" filter),
          then the convolution preserves average values; if Σ h[n] = 0, the
          filter has no DC pass-through and any constant offset vanishes.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Support adds</h3>
        <p>
          We saw this in Chapter 3, but it's worth elevating to a property:
        </p>
        <Eq>support(x ∗ h) = support(x) + support(h)  &nbsp;⟹&nbsp; length(x∗h) = N + M − 1</Eq>
        <p>
          This is the property you'll bang into every time you size an FFT
          for fast convolution. Get it wrong and you get circular wrap-around
          (Chapter 10).
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">What is NOT generally true</h3>
        <p>
          A few non-properties to internalize so you don't reach for them by
          accident:
        </p>
        <ul class="ml-4 list-disc marker:text-emerald-400 space-y-1">
          <li><strong>No multiplicative inverse in general.</strong> "Deconvolution" exists, but it's ill-posed: most h[n] have frequency-domain zeros where 1/H[k] is undefined. The best you can do is regularized inversion (Wiener filtering, etc.).</li>
          <li><strong>Convolution does NOT distribute over multiplication.</strong> (x · y) ∗ h ≠ (x ∗ h) · (y ∗ h). Mixing pointwise and convolutional operations needs care.</li>
          <li><strong>No "convolution by zero" trick.</strong> If h is identically zero, the output is zero, but the operation is not undone by anything afterwards.</li>
        </ul>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Putting the algebra to work</h3>
        <p>
          A worked example: you have a signal x passing through a low-pass
          filter h_LP, then a delay of n₀ samples, then a gain of α. The
          combined system has impulse response:
        </p>
        <Eq>h_total = α · ( h_LP ∗ δ[n − n₀] ) = α · h_LP[n − n₀]</Eq>
        <p>
          By associativity and the identity property, the whole cascade
          collapses into a single shifted, scaled FIR. You never need to
          actually do three sequential convolutions in your inner loop.
        </p>

        <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <h4 class="font-bold text-emerald-400 mb-2">What you should take from this chapter</h4>
          <ul class="space-y-2 text-zinc-300 m-0">
            <li>• Convolution is <strong>commutative, associative, distributive</strong> over addition, and <strong>bilinear</strong>.</li>
            <li>• <strong>δ[n] is the identity.</strong> A shifted δ is a pure delay; a scaled δ is a pure gain.</li>
            <li>• Cascade ⟺ convolution of impulse responses (associativity).</li>
            <li>• Parallel ⟺ sum of impulse responses (distributivity).</li>
            <li>• Total area multiplies; support lengths add.</li>
            <li>• No general inverse — deconvolution is ill-posed.</li>
          </ul>
        </div>

        <p>
          Next: enough theory — let's compute several convolutions by hand
          and watch the textbook shapes (triangles, step responses, exponentials) appear.
        </p>
      </section>
    </article>
  )
}

export default Ch05_PropertiesAndAlgebra
