import type { Component } from 'solid-js'

const Ref: Component<{ children: any }> = (props) => (
  <li class="my-3 leading-relaxed">{props.children}</li>
)

const Section: Component<{ title: string; children: any }> = (props) => (
  <div class="my-6">
    <h3 class="text-xl font-bold text-white mb-3">{props.title}</h3>
    <ul class="ml-4 list-disc marker:text-emerald-400 text-zinc-300">
      {props.children}
    </ul>
  </div>
)

const Ch16_Bibliography: Component = () => {
  return (
    <article>
      <h2 class="text-3xl font-black mb-2 text-white">16. Bibliography &amp; References</h2>
      <p class="text-zinc-400 italic mb-8">
        Where to go next when this guide stops being deep enough.
      </p>

      <section class="space-y-2 text-zinc-300 leading-relaxed">
        <p>
          The references below are organized by topic, not author. Each
          entry includes a one-line note on what you'd actually open it to
          read. Most are textbooks; a few are seminal papers; a few are
          documentation sites worth bookmarking.
        </p>

        <Section title="Discrete-time signal processing — foundational texts">
          <Ref>
            <strong>Oppenheim &amp; Schafer, <em>Discrete-Time Signal Processing</em> (3rd ed.).</strong>{' '}
            The standard reference. Chapter 2 is the rigorous LTI/convolution treatment; Chapter 8 is the DFT.
            If you only own one DSP book, own this one.
          </Ref>
          <Ref>
            <strong>Proakis &amp; Manolakis, <em>Digital Signal Processing: Principles, Algorithms, and Applications</em>.</strong>{' '}
            A bit more applied than Oppenheim, with more worked examples on FFT
            implementations, multi-rate processing, and adaptive filters.
          </Ref>
          <Ref>
            <strong>Lyons, <em>Understanding Digital Signal Processing</em>.</strong>{' '}
            The friendliest introduction. If Oppenheim is dense, start here. Excellent
            on circular vs linear convolution and on the practical gotchas of FFT use.
          </Ref>
          <Ref>
            <strong>Smith, <em>The Scientist and Engineer's Guide to Digital Signal Processing</em>.</strong>{' '}
            Free online (dspguide.com). Practical, intuition-first, light on proofs.
            Excellent quick reference when you've forgotten what a window function does.
          </Ref>
        </Section>

        <Section title="The Fourier transform — the inseparable companion">
          <Ref>
            <strong>Bracewell, <em>The Fourier Transform and Its Applications</em>.</strong>{' '}
            The classic continuous-time treatment. Best derivation of the convolution
            theorem you'll find. Worth the read just for the engineering intuition.
          </Ref>
          <Ref>
            <strong>Cooley &amp; Tukey (1965), "An Algorithm for the Machine Calculation of Complex Fourier Series", Math. Comp. 19.</strong>{' '}
            The four-page paper that launched the FFT era. Short and worth reading once.
          </Ref>
          <Ref>
            See also our companion guide,{' '}
            <a class="text-emerald-400 underline" href="/fourier-transform">
              <em>The Fourier Transform — A Complete Guide</em>
            </a>
            . The two operations are inseparable; the Fourier guide builds the FFT and
            DFT machinery that this guide assumes.
          </Ref>
        </Section>

        <Section title="Convolution algorithms and numerical computing">
          <Ref>
            <strong>Press, Teukolsky, Vetterling, Flannery, <em>Numerical Recipes</em> (3rd ed.).</strong>{' '}
            Chapter 13 covers FFT-based convolution, overlap-add, and overlap-save in
            practical detail. Code in C; algorithms portable to any language.
          </Ref>
          <Ref>
            <strong>FFTW documentation (fftw.org).</strong>{' '}
            The canonical CPU FFT library. Documentation is itself an education in how
            "fast convolution" is actually implemented in practice — composite-radix
            FFTs, plan selection, batched calls, real-to-complex transforms.
          </Ref>
          <Ref>
            <strong>Burrus &amp; Parks, <em>DFT/FFT and Convolution Algorithms</em>.</strong>{' '}
            For when you want to design or evaluate non-trivial FFT/conv algorithms — Winograd, prime-factor, Bluestein, etc.
          </Ref>
        </Section>

        <Section title="Radar signal processing">
          <Ref>
            <strong>Richards, <em>Fundamentals of Radar Signal Processing</em> (2nd ed.).</strong>{' '}
            The standard graduate-level radar text. Matched filtering, pulse
            compression, range-Doppler processing, CFAR — all covered with the
            engineering care this guide only sketches.
          </Ref>
          <Ref>
            <strong>Skolnik, <em>Introduction to Radar Systems</em> (3rd ed.).</strong>{' '}
            The system-level companion to Richards. Less math, more block diagrams,
            antenna patterns, propagation, radomes — the full radar picture.
          </Ref>
          <Ref>
            <strong>Levanon &amp; Mozeson, <em>Radar Signals</em>.</strong>{' '}
            Deep dive on waveform design — LFM, Barker, polyphase, ambiguity functions.
            The text to open when you want to design a non-LFM waveform.
          </Ref>
          <Ref>
            <strong>Stimson, <em>Introduction to Airborne Radar</em>.</strong>{' '}
            More qualitative than Richards, but a master class in the engineering tradeoffs
            of a real radar.
          </Ref>
        </Section>

        <Section title="GPU and CUDA for DSP">
          <Ref>
            <strong>NVIDIA, <em>cuFFT Library Documentation</em>.</strong>{' '}
            Read the batched-plan API, the data-layout sections, and the FAQ on
            forward/inverse normalization. The documentation contains the working
            mental model of every cuFFT use.
          </Ref>
          <Ref>
            <strong>NVIDIA, <em>CUDA C++ Best Practices Guide</em>.</strong>{' '}
            The canonical memory-coalescing, shared-memory, and stream-overlap
            references. The transpose kernel ("matrix transpose with no bank conflicts")
            is the textbook corner-turn.
          </Ref>
          <Ref>
            <strong>Kirk &amp; Hwu, <em>Programming Massively Parallel Processors</em>.</strong>{' '}
            The textbook. Chapter on convolutions and chapter on FFTs both relevant.
          </Ref>
          <Ref>
            <strong>Lavin &amp; Gray (2016), "Fast Algorithms for Convolutional Neural Networks", CVPR.</strong>{' '}
            The Winograd paper that explains why 3×3 convolutions in CNNs are not
            implemented as FFT-multiply. Essential if you're touching cuDNN.
          </Ref>
        </Section>

        <Section title="Audio and convolution reverb">
          <Ref>
            <strong>Smith (JOS), <em>Physical Audio Signal Processing</em> (online, ccrma.stanford.edu).</strong>{' '}
            Free online. The convolution-reverb sections explain partitioned convolution
            and the multi-scale FFT scheduling that real plugins use.
          </Ref>
          <Ref>
            <strong>Gardner (1995), "Efficient Convolution Without Input-Output Delay", AES J. 43.</strong>{' '}
            The classic paper on zero-latency partitioned convolution for realtime audio.
          </Ref>
        </Section>

        <Section title="2D convolution, image processing, computer vision">
          <Ref>
            <strong>Gonzalez &amp; Woods, <em>Digital Image Processing</em>.</strong>{' '}
            The standard image-processing text. Chapters 3–5 cover 2D convolution,
            classical kernels, frequency-domain image filtering.
          </Ref>
          <Ref>
            <strong>Szeliski, <em>Computer Vision: Algorithms and Applications</em>.</strong>{' '}
            Free PDF online. The reference for computer vision; chapters on linear
            filtering connect cleanly to this guide.
          </Ref>
          <Ref>
            <strong>Goodfellow, Bengio, Courville, <em>Deep Learning</em>.</strong>{' '}
            Free online. Chapter 9 ("Convolutional Networks") explains the CNN
            convention — that it's correlation, not convolution — and why it doesn't matter
            for learning.
          </Ref>
        </Section>

        <Section title="Communications and channels">
          <Ref>
            <strong>Proakis &amp; Salehi, <em>Digital Communications</em>.</strong>{' '}
            For the channel-modelling and OFDM-cyclic-prefix context where overlap-save
            shows up as a physical-layer technique.
          </Ref>
          <Ref>
            <strong>Tse &amp; Viswanath, <em>Fundamentals of Wireless Communication</em>.</strong>{' '}
            For the convolution-on-the-air picture: multipath as a time-varying linear filter.
          </Ref>
        </Section>

        <Section title="Online resources">
          <Ref>
            <strong>3Blue1Brown YouTube channel — "But what is a convolution?".</strong>{' '}
            Excellent visual intuition piece. Good first thing to share with anyone who
            asked "what is convolution?" before you point them at this guide.
          </Ref>
          <Ref>
            <strong>Steve Brunton, <em>Data-Driven Engineering</em> playlist.</strong>{' '}
            Friendly video lectures on signal processing and dynamics, with a heavy
            emphasis on convolution, Fourier, and PDE-flavored applications.
          </Ref>
          <Ref>
            <strong>NVIDIA Developer Blog — cuFFT, cuDNN, and Nsight series.</strong>{' '}
            Frequently updated, often the most accurate source for which algorithm
            cuDNN dispatches on which shape on which GPU generation.
          </Ref>
          <Ref>
            <strong>The dsp.stackexchange.com Q&amp;A.</strong>{' '}
            For specific implementation gotchas (window choice, normalization conventions,
            real-to-complex layout). The accepted answers on circular-vs-linear convolution
            are excellent.
          </Ref>
        </Section>

        <div class="my-10 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <h4 class="font-bold text-emerald-400 mb-2">Final thought</h4>
          <p class="m-0">
            You have now seen convolution in eight different lights: as
            superposition of impulse responses, as a flipped sliding sum, as
            multiplication in frequency, as a 2D image filter, as a matched
            filter in noise, as the operator inside every CNN, as a streamed
            block-processing pipeline, and as a GPU-batched FFT chain. The
            operation has not changed. The applications and the
            implementations have. That's what makes convolution the most
            important operation in signals and systems — and the one most
            worth knowing thoroughly.
          </p>
        </div>
      </section>
    </article>
  )
}

export default Ch16_Bibliography
