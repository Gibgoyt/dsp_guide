import type { Component } from 'solid-js'
import ConvolutionVsCorrelation from '../widgets/ConvolutionVsCorrelation'

const Eq: Component<{ children: any }> = (props) => (
  <p class="font-mono text-center text-emerald-300 text-sm sm:text-base p-3 my-3 rounded-lg bg-zinc-900/70 border border-zinc-800 overflow-x-auto">
    {props.children}
  </p>
)

const Ch07_ConvolutionVsCorrelation: Component = () => {
  return (
    <article>
      <h2 class="text-3xl font-black mb-2 text-white">7. Convolution vs. Cross-Correlation</h2>
      <p class="text-zinc-400 italic mb-8">
        The flip. The conjugate. The single most common interview gotcha in radar and ML.
      </p>

      <section class="space-y-5 text-zinc-300 leading-relaxed">
        <p>
          Convolution has a twin operation that looks almost identical and is
          constantly confused with it: <strong>cross-correlation</strong>. The
          difference between them is one sign in one index — and that one sign
          changes the answer to a different question. Getting them straight is
          the difference between a candidate who "watched a DSP video" and a
          candidate who actually knows the operation.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Side-by-side definitions</h3>
        <p>Discrete-time, real signals:</p>
        <Eq>(x ∗ h)[n] = Σ<sub>k</sub> x[k] · h[n − k]   &nbsp;&nbsp;←  convolution (flip)</Eq>
        <Eq>(x ⋆ h)[n] = Σ<sub>k</sub> x[k] · h[k − n]   &nbsp;&nbsp;←  cross-correlation (no flip)</Eq>
        <p>
          The argument of h is the only difference: <span class="font-mono">h[n − k]</span> versus <span class="font-mono">h[k − n]</span>. As a function of the summation
          variable k, the first one is h reversed left-to-right; the second is
          h <em>not</em> reversed.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Two operations, two questions</h3>
        <p>They answer different questions:</p>
        <ul class="ml-4 list-disc marker:text-emerald-400 space-y-2">
          <li>
            <strong>Convolution</strong> answers:
            "Given an LTI system with impulse response h, what is its output for
            input x?" The flip is there because of the physical
            <em> now-minus-arrival-time</em> structure of LTI response
            (Chapter 3).
          </li>
          <li>
            <strong>Cross-correlation</strong> answers:
            "How similar is x to h, at every possible lag?" The peak of x ⋆ h
            tells you the lag at which x best matches a copy of h. No flip,
            because we are <em>not</em> running x through an LTI system; we are
            comparing x to a template directly.
          </li>
        </ul>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Watch the flip</h3>
        <p>
          The widget below runs both operations on the same x and an
          asymmetric h. The middle two rows show h <em>flipped</em>
          (convolution case) and h <em>not flipped</em> (correlation case)
          for the current shift. Watch the two output curves diverge.
        </p>

        <ConvolutionVsCorrelation />

        <h3 class="text-xl font-bold text-white mt-10 mb-3">A one-line identity to memorize</h3>
        <p>
          Cross-correlation can be implemented as a convolution against a
          time-reversed template:
        </p>
        <Eq>(x ⋆ h)[n] = (x ∗ h̃)[n]   where  h̃[k] = h[−k]</Eq>
        <p>
          So any code path that already does fast convolution (Chapter 9) can
          do cross-correlation for free: just reverse h before feeding it in.
          This is exactly how every matched-filter implementation works.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Complex signals: the conjugate matters</h3>
        <p>
          Radar (and most communications) use complex baseband samples: I + jQ
          at each sample. For complex signals the right definition of
          cross-correlation is:
        </p>
        <Eq>(x ⋆ h)[n] = Σ<sub>k</sub> x[k] · h*[k − n]</Eq>
        <p>
          That asterisk on h is the <strong>complex conjugate</strong>. It is
          critical. Drop it and the cross-correlation becomes phase-wrong,
          which kills any downstream operation that depends on phase — most
          importantly, Doppler estimation in a pulse-Doppler radar.
        </p>
        <p>
          Implementing complex correlation as a convolution becomes:
        </p>
        <Eq>(x ⋆ h)[n] = (x ∗ h̃*)[n]   where  h̃*[k] = h*[−k]</Eq>
        <p>
          Read in English: <strong>"convolve with the conjugated, time-reversed template."</strong> That's the one-line definition of the radar matched filter, which we'll devote Chapter 13 to.
        </p>

        <div class="my-6 p-5 rounded-xl bg-emerald-500/5 border-l-4 border-emerald-400">
          <p class="text-emerald-100 m-0">
            <strong>The interview one-liner:</strong> "Convolution flips the
            kernel; correlation doesn't. The matched filter is correlation,
            implemented as convolution with the conjugated time-reversed
            template. The conjugate is what preserves phase for downstream
            Doppler."
          </p>
        </div>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Frequency-domain forms</h3>
        <p>
          We'll prove the Convolution Theorem properly in Chapter 8, but it's
          worth showing both transforms side by side here so the pattern is
          obvious:
        </p>
        <Eq>x ∗ h  ⟷  X[k] · H[k]                  (convolution)</Eq>
        <Eq>x ⋆ h  ⟷  X[k] · H*[k]                  (correlation)</Eq>
        <p>
          Same multiplication; the correlation version uses the conjugate of H.
          That's the same "conjugated template" idea, viewed in the frequency
          domain. The choice between fast convolution and fast cross-correlation
          is literally one line of code: do you take the conjugate of the
          template's spectrum before multiplying?
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Autocorrelation</h3>
        <p>
          When you cross-correlate a signal with <em>itself</em>, you get the
          <strong> autocorrelation</strong>:
        </p>
        <Eq>R<sub>xx</sub>[n] = (x ⋆ x)[n] = Σ<sub>k</sub> x[k] · x*[k − n]</Eq>
        <p>
          R<sub>xx</sub>[0] is always the energy of x. The autocorrelation
          measures how predictable x is from its own past: a slowly-varying
          signal has a wide, slowly-decaying autocorrelation; a noise-like
          signal has a sharp spike at lag 0 and noise everywhere else. The
          Fourier transform of the autocorrelation is the
          <strong> power spectral density</strong> (Wiener–Khinchin theorem) —
          one of the most-used relations in spectral estimation.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">The ML convention gotcha</h3>
        <p>
          A long-standing landmine: in machine-learning literature, the
          "convolution" of a CNN is actually <strong>cross-correlation</strong>
          {' '}— no flip. Frameworks like PyTorch and TensorFlow don't flip the
          kernel. Mathematically it doesn't matter for learning, because
          gradient descent will learn whichever sign of the kernel produces
          the correct output, but the naming is technically wrong.
        </p>
        <p>
          If you ever interface ML code with a classical-DSP team — for
          instance, embedding a learned filter into a signal-processing chain —
          remember to flip (or not) at the boundary. Forgetting once produces
          subtly wrong outputs that are very hard to debug because the
          spectral magnitudes match.
        </p>

        <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <h4 class="font-bold text-emerald-400 mb-2">What you should take from this chapter</h4>
          <ul class="space-y-2 text-zinc-300 m-0">
            <li>• <strong>Convolution flips.</strong> Cross-correlation doesn't.</li>
            <li>• Correlation = convolution with a time-reversed template (real) or conjugated time-reversed template (complex).</li>
            <li>• In frequency: <span class="font-mono">conv ↔ X·H</span>, <span class="font-mono">corr ↔ X·H*</span>.</li>
            <li>• <strong>Matched filter</strong> = correlation with conjugated time-reversed template — drop the conjugate and you wreck the phase.</li>
            <li>• Autocorrelation = signal correlated with itself; FT of autocorrelation = power spectral density.</li>
            <li>• ML "convolution" is mathematically correlation (no flip). Watch the boundary.</li>
          </ul>
        </div>

        <p>
          Next: the punchline that ties convolution and the Fourier transform
          together forever.
        </p>
      </section>
    </article>
  )
}

export default Ch07_ConvolutionVsCorrelation
