import type { Component } from 'solid-js'
import ConvolutionSlider from '../widgets/ConvolutionSlider'

const Eq: Component<{ children: any }> = (props) => (
  <p class="font-mono text-center text-emerald-300 text-sm sm:text-base p-3 my-3 rounded-lg bg-zinc-900/70 border border-zinc-800 overflow-x-auto">
    {props.children}
  </p>
)

const Ch06_WorkedByHand: Component = () => {
  return (
    <article>
      <h2 class="text-3xl font-black mb-2 text-white">6. Convolution by Hand — Classic Examples</h2>
      <p class="text-zinc-400 italic mb-8">
        Five problems that teach the operation faster than ten chapters of theory.
      </p>

      <section class="space-y-5 text-zinc-300 leading-relaxed">
        <p>
          The fastest way to develop convolution intuition is to compute a
          handful of canonical cases by hand. Each of these examples appears
          again and again in real engineering — in textbooks, in interview
          questions, in the source code of every filter library you'll ever
          use. By the end of this chapter you should be able to do all five
          in your head.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Use the widget as you read</h3>
        <p>
          The slider widget below lets you choose a pair of signals and walk
          through every shift, watching exactly which samples contribute to
          each y[n]. Switch to each preset as you read the corresponding
          example. Read the formula, then read the numbers it produces, then
          drag the slider and watch them line up.
        </p>

        <ConvolutionSlider />

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Example 1 — Rectangle convolved with itself: a triangle</h3>
        <p>
          Let x[n] = h[n] = 1 for n = 0,…,M − 1 and 0 elsewhere. As you slide
          one over the other, the number of overlapping samples grows
          linearly from 1 up to M, then shrinks linearly back to 1. So:
        </p>
        <Eq>(x ∗ h)[n] = max(0, M − |n − (M − 1)|)</Eq>
        <p>
          The result is a discrete <em>triangle</em> of total length 2M − 1,
          peaking at M. This is the foundational example because so many
          other shapes are built from rectangles — every B-spline, every
          uniform window, every "rect ∗ rect ∗ rect..." chain that produces
          Gaussian-shaped bumps via the central limit theorem.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Example 2 — Wide rectangle ∗ narrow rectangle: a trapezoid</h3>
        <p>
          Same idea, but with x of length M_x and h of length M_h with
          M_x &gt; M_h. The overlap count grows from 1 to M_h, stays flat at
          M_h while h is fully inside x, then shrinks back to 1.
          The output is a <strong>trapezoid</strong>: linear rise, flat
          plateau, linear fall.
        </p>
        <p>
          The flat plateau in the middle is the steady-state response of a
          moving-average filter to a step input. The two ramps are the
          transients at the beginning and end. Recognize this shape:
          you'll see it constantly when you apply an FIR low-pass to a
          rectangular gate.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Example 3 — Rectangle ∗ exponential: an RC step response</h3>
        <p>
          Let x[n] = 1 for n ≥ 0 (a unit step) and h[n] = (1 − α)ⁿ for n ≥ 0
          (an RC low-pass impulse response with pole 1 − α). Then:
        </p>
        <Eq>y[n] = Σ<sub>k=0</sub><sup>n</sup> (1 − α)<sup>k</sup> = ( 1 − (1 − α)<sup>n+1</sup> ) / α</Eq>
        <p>
          The output is the classic <strong>charging exponential</strong>: it
          rises monotonically from 0 toward 1/α. Any time you see an RC
          step response in a textbook plot, that curve is being computed by
          this convolution.
        </p>
        <p>
          For a finite-width input rectangle, the output rises like the
          charging exponential while the input is on, then decays like the
          discharging exponential once it turns off. Same convolution, just
          a finite-support input.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Example 4 — Convolution with a shifted impulse: a pure delay</h3>
        <p>
          Take h[n] = δ[n − D]. From the algebra in Chapter 5:
        </p>
        <Eq>x[n] ∗ δ[n − D] = x[n − D]</Eq>
        <p>
          Convolving with a delayed impulse just shifts the signal. This is
          the trivial-but-important sanity check: an LTI system whose
          impulse response is a single tap is a pure delay.
        </p>
        <p>
          Generalizing, an FIR impulse response of length L is literally a
          <em> list of delays with weights</em>: h[n] = Σ_k h_k · δ[n − k].
          Each output sample is a weighted sum of L past inputs. The
          implementation of an FIR filter <em>is</em> the convolution sum,
          unrolled.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Example 5 — Pulse train ∗ pulse: periodic output</h3>
        <p>
          Let x[n] = Σ_m δ[n − m·P] be an impulse train with period P, and
          let h[n] be any finite-support pulse of length less than P. The
          convolution copies h[n] into every period:
        </p>
        <Eq>(x ∗ h)[n] = Σ<sub>m</sub> h[n − m·P]</Eq>
        <p>
          This is how you generate periodic waveforms from a single pulse
          shape — used in pulse-shaping for digital communications, in
          additive sound synthesis (an impulse train through a vocal-tract
          filter is the source-filter speech model), and in radar pulse
          trains (where the convolution structure is exactly what enables
          coherent processing across pulses).
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Bonus — Two Gaussians ⟹ a wider Gaussian</h3>
        <p>
          In continuous time:
        </p>
        <Eq>𝒩(0, σ₁²) ∗ 𝒩(0, σ₂²) = 𝒩(0, σ₁² + σ₂²)</Eq>
        <p>
          Convolving two Gaussians gives another Gaussian, with variances
          adding. This is why repeated low-pass smoothing concentrates
          toward a Gaussian shape; it's also why "convolve once with a wide
          Gaussian" can be split into "convolve twice with narrower
          Gaussians" for compute savings (since variances add, σ_total² =
          σ_a² + σ_b²). In image processing this is the basis of separable
          Gaussian blur.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Worked rect ∗ rect by hand (the bookkeeping)</h3>
        <p>
          Take x = h = [1, 1, 1] (length 3). Compute every y[n] mechanically:
        </p>
        <div class="font-mono text-xs sm:text-sm p-4 my-4 rounded-lg bg-zinc-950 border border-zinc-800 overflow-x-auto leading-loose">
          <div>y[0] = x[0]·h[0]                          = 1·1                = <span class="text-emerald-300">1</span></div>
          <div>y[1] = x[0]·h[1] + x[1]·h[0]              = 1·1 + 1·1          = <span class="text-emerald-300">2</span></div>
          <div>y[2] = x[0]·h[2] + x[1]·h[1] + x[2]·h[0] = 1·1 + 1·1 + 1·1   = <span class="text-emerald-300">3</span></div>
          <div>y[3] =              x[1]·h[2] + x[2]·h[1] = 1·1 + 1·1          = <span class="text-emerald-300">2</span></div>
          <div>y[4] =                          x[2]·h[2] = 1·1                = <span class="text-emerald-300">1</span></div>
        </div>
        <p>
          y = [1, 2, 3, 2, 1] — a discrete triangle of length 2·3 − 1 = 5,
          peaking at the middle. Try the same calculation in the widget by
          choosing "rect ∗ rect" and stepping through every n.
        </p>

        <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <h4 class="font-bold text-emerald-400 mb-2">What you should take from this chapter</h4>
          <ul class="space-y-2 text-zinc-300 m-0">
            <li>• rect ∗ rect = triangle (same widths) or trapezoid (different widths).</li>
            <li>• rect ∗ exp = the RC step / charging response.</li>
            <li>• x ∗ δ[n−D] = pure delay; FIR filter ⟺ tapped-delay structure.</li>
            <li>• Pulse train ∗ pulse = periodic copies — speech, modulation, radar pulse trains.</li>
            <li>• Gaussian ∗ Gaussian = Gaussian, variances add.</li>
            <li>• Practice these five by hand and convolution stops being mysterious.</li>
          </ul>
        </div>

        <p>
          Next: convolution's twin operation, <em>cross-correlation</em>, and
          why getting them confused is the single most common mistake in
          radar and ML code.
        </p>
      </section>
    </article>
  )
}

export default Ch06_WorkedByHand
