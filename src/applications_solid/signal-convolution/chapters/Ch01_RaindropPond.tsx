import type { Component } from 'solid-js'
import RaindropPondDemo from '../widgets/RaindropPondDemo'

const Ch01_RaindropPond: Component = () => {
  return (
    <article>
      <h2 class="text-3xl font-black mb-2 text-white">1. The Raindrop and the Pond</h2>
      <p class="text-zinc-400 italic mb-8">
        The single best intuition pump for convolution — and the one we'll come back to in every chapter.
      </p>

      <section class="space-y-5 text-zinc-300 leading-relaxed">
        <p>
          A raindrop hits a still pond. The ripple that spreads outward isn't
          just the drop. It's the drop <em>filtered through the physics of the
          water</em>. Same drop on a swimming pool, on tar, on a steel plate —
          completely different ripples. The drop is the input. The ripple is
          the output. The pond is the system that does the mapping.
        </p>
        <p>
          Now drop a second raindrop, somewhere else, a little later. A second
          ripple spreads. The surface of the pond at any moment is the sum of
          both ripples. Drop ten. Drop a hundred. The pond doesn't care — it
          just keeps adding ripples. The visible surface is the
          <em> superposition </em>of all the past drops, each producing its own
          delayed and scaled copy of the same fundamental ripple shape.
        </p>

        <div class="my-8 p-5 rounded-xl bg-emerald-500/5 border-l-4 border-emerald-400">
          <p class="text-emerald-100 m-0">
            <strong>The claim, in one sentence:</strong> The output of any
            linear time-invariant (LTI) system is the convolution of its input
            with its impulse response. That sentence contains multitudes.
          </p>
        </div>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">The fingerprint</h3>
        <p>
          That fundamental ripple shape — the response to a single drop — is
          the pond's <strong class="text-emerald-300">impulse response</strong>.
          It's the system's fingerprint. If you know it, you know everything
          the pond will ever do to any input, no matter how complicated.
        </p>
        <p>
          This is the most important sentence in signals and systems, and most
          people have never heard it. An LTI system is <em>fully described</em>
          {' '}by its impulse response. Not "mostly", not "to a good
          approximation". Fully. The internal mechanism — partial differential
          equations of fluid flow, surface tension, viscosity, all of it —
          collapses into a single function h[n] (or h(t)) that the system
          drags around like a fingerprint. Two systems with the same fingerprint
          are mathematically indistinguishable.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">The operation</h3>
        <p>
          Convolution is the operation that turns "I know what the pond does
          to one drop" into "I know what the pond does to any pattern of
          drops." Mechanically, it is three things in a tight loop:
        </p>
        <ol class="ml-4 list-decimal marker:text-emerald-400 space-y-1">
          <li><strong>Slide</strong> one function over the other.</li>
          <li><strong>Multiply</strong> point by point at each shift.</li>
          <li><strong>Sum</strong> the products into a single output value.</li>
        </ol>
        <p>
          That's it. That's the whole operation. Repeated for every shift, it
          produces the output signal one sample at a time. It sounds tedious —
          and it would be, by hand — but a digital computer executes the whole
          loop in microseconds.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">See it work</h3>
        <p>
          The widget below is a pond. Click anywhere along the top row to drop
          a raindrop at that moment in time. The middle row shows the pond's
          impulse response — the shape of a single ripple. The bottom row is
          the pond's surface: the sum of every drop's ripple, each delayed by
          the time of the drop and scaled by its amplitude.
        </p>
        <p>
          Watch how multiple drops overlap. The bottom curve isn't an arbitrary
          shape — it's the literal convolution of the impulse train (top) with
          the impulse response (middle). The mathematics matches what your eye
          sees on a pond.
        </p>

        <RaindropPondDemo />

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Why this matters</h3>
        <p>
          Convolution is the most important operation in all of signals and
          systems. It shows up everywhere — and almost always with a different
          name attached:
        </p>
        <ul class="ml-4 list-disc marker:text-emerald-400 space-y-1">
          <li><strong>Audio reverb</strong>. The "wet" signal is the dry voice convolved with a real concert hall's impulse response.</li>
          <li><strong>Image blur and sharpening</strong>. Each pixel in the output is a weighted sum of nearby input pixels — a 2D convolution with a small kernel.</li>
          <li><strong>Wireless channel modelling</strong>. The signal a receiver sees is the transmitted signal convolved with the multipath channel response.</li>
          <li><strong>Radar pulse compression</strong>. The matched filter — the operation that turns a long, low-power chirp into a sharp range peak — is a convolution.</li>
          <li><strong>Camera ISP sharpening</strong>. Every time your phone "enhances" a photo, a 2D convolution is running on the GPU.</li>
          <li><strong>Convolutional neural networks</strong>. The "conv" in CNN is literally this operation (with one historical sign-flip we'll cover in Chapter 7).</li>
        </ul>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">The cost of getting it wrong</h3>
        <p>
          The cost of misunderstanding convolution is catastrophic in
          engineering. A poorly designed filter convolved with the wrong signal
          produces artifacts, distortion, or complete signal loss. In a radar
          processor, a sloppy convolution means missing real targets or
          inventing ghost targets — false detections that look indistinguishable
          from the real thing until someone gets paged at 3 AM.
        </p>
        <p>
          Most of those failures aren't in the math — they're in the
          implementation details: forgetting to zero-pad before an FFT,
          forgetting to conjugate a matched-filter template, mismatching
          sample rates, applying the wrong window. By Chapter 10 you'll
          recognize all of them. For now, just feel the operation.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">The plot twist</h3>
        <p>
          Convolution in the time domain becomes simple <em>multiplication</em>
          in the frequency domain. That's not a trick. That's a law. It's why
          the Fourier transform and convolution are inseparable, and why the
          FFT made real-time audio, image, and radar processing possible.
          We'll get to it in Chapter 8 — but it's the punchline that makes
          everything else fall into place, so keep it in mind as the rest of
          the early chapters develop the operation in its raw form.
        </p>

        <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <h4 class="font-bold text-emerald-400 mb-2">What you should take from this chapter</h4>
          <ul class="space-y-2 text-zinc-300 m-0">
            <li>• An <strong>LTI system</strong> is completely described by its <strong>impulse response</strong> h[n].</li>
            <li>• The output for any input is the <strong>convolution</strong> of the input with h[n].</li>
            <li>• Mechanically: <em>slide, multiply, sum.</em></li>
            <li>• Convolution shows up in audio, images, communications, radar, neural networks — everywhere.</li>
            <li>• Time-domain convolution ⟺ frequency-domain multiplication (preview; full proof in Ch. 8).</li>
          </ul>
        </div>

        <p>
          Next: why "LTI" matters, and the formal reason a single impulse
          response is enough to predict every possible output.
        </p>
      </section>
    </article>
  )
}

export default Ch01_RaindropPond
