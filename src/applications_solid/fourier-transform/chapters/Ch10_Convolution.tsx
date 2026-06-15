import type { Component } from 'solid-js'
import ConvolutionDemo from '../widgets/ConvolutionDemo'

const Eq: Component<{ children: any }> = (props) => (
  <p class="font-mono text-center text-cyan-300 text-sm sm:text-base p-3 my-3 rounded-lg bg-zinc-900/70 border border-zinc-800 overflow-x-auto">
    {props.children}
  </p>
)

const Ch10_Convolution: Component = () => {
  return (
    <article>
      <h2 class="text-3xl font-black mb-2 text-white">10. Convolution &amp; the Convolution Theorem</h2>
      <p class="text-zinc-400 italic mb-8">
        Picture a raindrop falling on a still pond. That's an impulse response — and convolution is how an LTI system turns inputs into outputs.
      </p>

      <section class="space-y-5 text-zinc-300 leading-relaxed">
        <p>
          Convolution is one of two things every signal processor needs to be
          fluent in (the other being the Fourier Transform). It is the
          mathematical operation that describes how a linear time-invariant
          (LTI) system responds to <em>any</em> input.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">The intuition: a raindrop on a pond</h3>
        <p>
          Drop a raindrop on a still pond. Ripples spread outward — a specific
          waveform that depends only on the properties of the water. That
          waveform is the pond's <strong>impulse response</strong>: how it
          responds when poked at a single instant.
        </p>
        <p>
          Now drop a hundred raindrops, at different times and different
          places. The pond's surface at any moment is the
          <em> sum </em>of all the ripples from all the past drops, each
          delayed by the right amount and scaled by the size of that drop.
          That summing-with-delays-and-scaling is <strong>convolution</strong>.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">The definition</h3>
        <p>
          Discrete-time:
        </p>
        <Eq>(x ∗ h)[n] = Σ<sub>k</sub> x[k] · h[n − k]</Eq>
        <p>
          Continuous-time:
        </p>
        <Eq>(x ∗ h)(t) = ∫ x(τ) · h(t − τ) dτ</Eq>
        <p>
          The formula reads: "at output time n, sum up all the input samples,
          each scaled by how much of the impulse response is still 'live' at
          time n from when that input arrived." If the impulse response
          h is a delayed echo, convolution adds delayed-and-scaled copies of x.
          If h is a smoothing kernel, convolution averages neighboring x's.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Why convolution is everywhere</h3>
        <p>
          Every LTI system — every filter, every linear amplifier, every
          lossless wave-propagation medium — is fully characterized by its
          impulse response h[n]. The output for any input is just
          x[n] ∗ h[n].
        </p>
        <ul class="ml-4 list-disc marker:text-cyan-400 space-y-1">
          <li><strong>Audio EQ</strong>: convolve with the EQ's impulse response.</li>
          <li><strong>Image blur</strong>: convolve the image with a Gaussian kernel.</li>
          <li><strong>Reverb</strong>: convolve a dry signal with a room's impulse response.</li>
          <li><strong>Radar matched filter</strong>: convolve received echo with a time-reversed copy of the transmitted pulse to maximize SNR. We'll see this again in Chapter 11.</li>
          <li><strong>Communications equalization</strong>: convolve with the inverse channel response to undo intersymbol interference.</li>
          <li><strong>Neural network "convolutional" layer</strong>: discrete 2D convolution, kernel weights learned by SGD.</li>
        </ul>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">The Convolution Theorem</h3>
        <p>
          Convolution in the time domain looks expensive. For length-N x and
          length-M h, computing all of x ∗ h directly takes O(N·M)
          multiplications. Slow.
        </p>
        <p>
          But the Fourier Transform makes a miracle:
        </p>
        <div class="my-6 p-5 rounded-xl bg-cyan-500/5 border-l-4 border-cyan-400">
          <p class="text-cyan-100 m-0">
            <strong>Convolution in time ⟺ multiplication in frequency.</strong>
          </p>
        </div>
        <Eq>x[n] ∗ h[n]  ⟷  X[k] · H[k]</Eq>
        <p>
          The Fourier Transform turns convolution into element-wise
          multiplication. So instead of computing x ∗ h directly, you can:
        </p>
        <ol class="ml-4 list-decimal marker:text-cyan-400 space-y-1">
          <li>FFT x → X. Cost: O(N log N).</li>
          <li>FFT h → H. Cost: O(N log N).</li>
          <li>Multiply pointwise: Y[k] = X[k] · H[k]. Cost: O(N).</li>
          <li>Inverse FFT Y → y. Cost: O(N log N).</li>
        </ol>
        <Eq>Total: O(N log N)</Eq>
        <p>
          For long signals, this is dramatically faster than the O(N·M)
          time-domain convolution. The crossover is typically around N ~ 64
          on modern hardware.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Caveat: circular vs. linear convolution</h3>
        <p>
          The DFT pretends signals are periodic with period N. So if you do
          IFFT(FFT(x) · FFT(h)) directly, you get <strong>circular
          convolution</strong> — the output wraps around at the edges. To get
          the true <strong>linear convolution</strong> (the one that matches
          the time-domain formula), you must zero-pad both inputs to length
          at least N + M − 1 before the FFTs. Then the circular output for
          that padded length equals the linear convolution for the original
          inputs.
        </p>
        <p>
          Forgetting this is a classic FFT bug. If your "filtered" output has
          weird ringing at the boundaries, the first thing to check is
          whether you padded enough.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Watch convolution happen</h3>
        <p>
          The demo below convolves a rectangular pulse with itself. The middle
          row is the second pulse h[n−k] sliding across the first; the bottom
          row is the output y[n] — the area of overlap at each shift. Slide a
          rectangle past itself and you get a <strong>triangle</strong>, which
          is the textbook example.
        </p>
        <p>
          Toggle the method between "Time-domain" and "FFT-multiply" and
          confirm: the output is bit-identical. Different recipe, same result.
        </p>

        <ConvolutionDemo />

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Cross-correlation — convolution's twin</h3>
        <p>
          A close cousin of convolution is <strong>cross-correlation</strong>:
        </p>
        <Eq>(x ⋆ h)[n] = Σ<sub>k</sub> x[k] · h*[k − n]</Eq>
        <p>
          The difference is the sign on the index — cross-correlation does NOT
          flip the second signal before sliding. Cross-correlation answers
          "how similar are x and h at relative shift n?" and is the
          natural operation for <strong>matched filtering</strong> and
          <strong> radar pulse compression</strong>.
        </p>
        <p>
          In the frequency domain, cross-correlation becomes:
        </p>
        <Eq>x ⋆ h  ⟷  X[k] · H*[k]    (conjugate on the second)</Eq>
        <p>
          That conjugate is the only difference between fast convolution and
          fast cross-correlation. Useful when you're chasing weak signals
          buried in noise — which is exactly what a radar does.
        </p>

        <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <h4 class="font-bold text-cyan-400 mb-2">What you should take from this chapter</h4>
          <ul class="space-y-2 text-zinc-300 m-0">
            <li>• Convolution: (x ∗ h)[n] = Σ x[k] · h[n − k]. Describes how an LTI system responds to any input via its impulse response.</li>
            <li>• <strong>Convolution Theorem</strong>: time convolution ⟷ frequency multiplication. The FFT turns O(N·M) into O(N log N).</li>
            <li>• Recipe: pad → FFT → multiply → IFFT.</li>
            <li>• Zero-pad to N + M − 1 to avoid circular wrap-around.</li>
            <li>• <strong>Cross-correlation</strong> is convolution without the flip — and corresponds to multiplication with a conjugate in frequency. It's the math behind matched filtering and radar pulse compression.</li>
          </ul>
        </div>
      </section>
    </article>
  )
}

export default Ch10_Convolution
