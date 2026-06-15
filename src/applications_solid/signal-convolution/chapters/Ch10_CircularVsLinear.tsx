import type { Component } from 'solid-js'
import CircularVsLinearDemo from '../widgets/CircularVsLinearDemo'

const Eq: Component<{ children: any }> = (props) => (
  <p class="font-mono text-center text-emerald-300 text-sm sm:text-base p-3 my-3 rounded-lg bg-zinc-900/70 border border-zinc-800 overflow-x-auto">
    {props.children}
  </p>
)

const Ch10_CircularVsLinear: Component = () => {
  return (
    <article>
      <h2 class="text-3xl font-black mb-2 text-white">10. Circular vs. Linear Convolution</h2>
      <p class="text-zinc-400 italic mb-8">
        The trap that creates ghost targets in radar, ringing in audio, and unexplained artifacts in CNNs.
      </p>

      <section class="space-y-5 text-zinc-300 leading-relaxed">
        <p>
          There is a subtle, costly bug hiding inside the FFT-multiply recipe
          from Chapter 9, and it bites real engineers all the time. The DFT
          treats the signals it operates on as if they were periodic — as
          though the last sample of x wraps around to the first sample. As a
          result, the convolution that the DFT computes naturally is
          <strong> circular</strong>, not the linear one we usually want. If
          you don't zero-pad correctly before the FFTs, energy from the end
          of the output wraps around to the start, and shows up at completely
          wrong indices. In radar that's a <em>ghost target</em>. In audio
          that's a click or ringing at the block boundary. In a CNN that's a
          tiny but persistent artifact at the image edges.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Linear vs. circular: the formal split</h3>
        <p><strong>Linear convolution</strong> — what you've been computing all along:</p>
        <Eq>(x ∗ h)[n] = Σ<sub>k = −∞</sub><sup>∞</sup> x[k] · h[n − k]</Eq>
        <Eq>length = N + M − 1</Eq>

        <p><strong>Circular (or "periodic") convolution</strong> of length L treats the indices modulo L:</p>
        <Eq>(x ⊛ h)[n] = Σ<sub>k = 0</sub><sup>L − 1</sup> x[k] · h[(n − k) mod L]</Eq>
        <Eq>length = L</Eq>

        <p>
          The DFT-multiply identity from Chapter 8 is, exactly:
        </p>
        <Eq>DFT{'{x ⊛ h}'} = X · H,  with periodic length L</Eq>

        <p>
          So when you do <span class="font-mono">IFFT( FFT(x) · FFT(h) )</span> at length L, what you get back is the
          <em> circular</em> convolution of x and h at length L. Not the
          linear one.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">When the two are equal</h3>
        <p>
          The circular convolution equals the linear convolution exactly when
          there is no wrap-around — i.e. when L is large enough that the
          length-(N + M − 1) linear output fits inside one period. The
          condition is the one we keep underlining:
        </p>
        <div class="my-6 p-5 rounded-xl bg-emerald-500/5 border-l-4 border-emerald-400">
          <p class="text-emerald-100 m-0 font-mono text-base">
            <strong>L ≥ N + M − 1   ⟹   circular = linear.</strong>
          </p>
        </div>
        <p>
          Round L up to a convenient FFT length (a power of 2, or a
          2-3-5-7 composite). Zero-pad both x and h to length L. Do the
          FFTs. Done. The output of length L is the linear convolution in
          its first N + M − 1 samples, with zeros afterwards.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Watch the wrap happen</h3>
        <p>
          The widget below computes both. As you shrink the FFT length L
          below the safe threshold, the tail of the linear convolution wraps
          back onto the start of the output. The "linear − circular"
          difference row at the bottom is the energy that is now in the
          wrong place.
        </p>

        <CircularVsLinearDemo />

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Why this matters in radar (the ghost target)</h3>
        <p>
          A radar range-compression stage is exactly an FFT-based
          cross-correlation of the received pulse with the transmitted chirp.
          The "range bin" of a target is where its correlation peak lands.
          If the FFT length is too short:
        </p>
        <ul class="ml-4 list-disc marker:text-emerald-400 space-y-1">
          <li>A real target near the end of the receive window has its correlation tail wrap to the start of the next range window.</li>
          <li>That tail looks like a target at the wrong (close) range.</li>
          <li>The CFAR detector downstream sees both peaks and reports two targets where only one exists.</li>
        </ul>
        <p>
          This bug is tempting to introduce on a GPU because dropping the
          zero-pad saves memory and shaves a few clock cycles. The right
          discipline is to <em>always</em> pad to ≥ N + M − 1 and leave a
          comment in the code that names the failure mode you are preventing.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Why this matters in audio (block-boundary clicks)</h3>
        <p>
          Convolutional reverb and FIR filters in audio plugins are
          implemented via block-FFT convolution. If you do the FFT at the
          block size (say 1024 samples) and your impulse response is longer
          than that, the tail of one block's response wraps onto the
          beginning of the same block — an audible click at every block
          boundary. The fix is either:
        </p>
        <ul class="ml-4 list-disc marker:text-emerald-400 space-y-1">
          <li>Use a block FFT length L ≥ blockSize + M − 1 (waste of compute for long h).</li>
          <li>Use <strong>overlap-add</strong> or <strong>overlap-save</strong>: process the long signal in blocks but accumulate the tails properly across blocks. We give those algorithms their own chapter (Ch. 11).</li>
        </ul>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">A few related sanity checks</h3>
        <ul class="ml-4 list-disc marker:text-emerald-400 space-y-2">
          <li>
            <strong>Padding type</strong>. For linear convolution you zero-pad. For some applications you'd rather wrap or reflect (e.g. image filtering with mirror boundaries to avoid edge darkening). That's a <em>boundary condition</em> choice; it's separate from the linear-vs-circular FFT issue, which is purely about the FFT length L being long enough.
          </li>
          <li>
            <strong>Symmetric padding for fractional delays</strong>. If h has both pre- and post-zero parts you care about, place the impulse near the center of the padded buffer (not at index 0) so the convolution result is centered.
          </li>
          <li>
            <strong>fftshift</strong>. Many libraries center the spectrum (DC at L/2) for visualization. If you forget to undo it before the inverse FFT you'll get a sign-alternating output. Different bug, same family — the FFT's periodic indexing is the source.
          </li>
        </ul>

        <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <h4 class="font-bold text-emerald-400 mb-2">What you should take from this chapter</h4>
          <ul class="space-y-2 text-zinc-300 m-0">
            <li>• DFT-multiply computes <strong>circular</strong> convolution at length L.</li>
            <li>• Circular = linear iff <strong>L ≥ N + M − 1</strong>.</li>
            <li>• Forgetting to pad ⟹ wrap-around ⟹ ghost targets / block-edge artifacts.</li>
            <li>• On GPUs especially, pad explicitly and leave a comment naming the bug.</li>
            <li>• For streaming long signals use overlap-add / overlap-save (Ch. 11), not bigger and bigger FFTs.</li>
          </ul>
        </div>

        <p>
          Next: how to stream a real-time convolution when the signal is too long to FFT at once.
        </p>
      </section>
    </article>
  )
}

export default Ch10_CircularVsLinear
