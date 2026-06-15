import type { Component } from 'solid-js'

const Cell: Component<{
  title: string
  formula: string
  freq: string
  who: string
  highlight?: boolean
}> = (props) => (
  <div class={`p-4 rounded-lg border ${props.highlight ? 'border-cyan-400 bg-cyan-500/10' : 'border-zinc-800 bg-zinc-900/40'}`}>
    <div class="text-xs uppercase tracking-wider text-zinc-500 mb-1">{props.who}</div>
    <div class="font-bold text-white mb-2">{props.title}</div>
    <div class="font-mono text-xs text-cyan-300 mb-2">{props.formula}</div>
    <div class="text-xs text-zinc-400">{props.freq}</div>
  </div>
)

const Ch02_FourTransforms: Component = () => {
  return (
    <article>
      <h2 class="text-3xl font-black mb-2 text-white">2. A Tale of Four Transforms</h2>
      <p class="text-zinc-400 italic mb-8">
        The most common confusion in DSP — and the one an interviewer will absolutely poke at.
      </p>

      <section class="space-y-5 text-zinc-300 leading-relaxed">
        <p>
          People use "the Fourier Transform" and "the FFT" interchangeably.
          That's wrong, and the difference is exactly what separates someone
          who gets the vibe from someone who knows the material.
        </p>

        <p>
          There isn't <em>one</em> Fourier Transform. There are four close
          cousins, and which one you're using depends on two questions about
          your signal:
        </p>

        <ul class="ml-4 list-disc marker:text-cyan-400 space-y-1">
          <li>Is time <strong>continuous</strong> (any real <em>t</em>) or <strong>discrete</strong> (samples at <em>n = 0, 1, 2, ...</em>)?</li>
          <li>Is the signal <strong>aperiodic</strong> (one-shot, no repetition) or <strong>periodic</strong> (repeats every <em>T</em> or every <em>N</em> samples)?</li>
        </ul>

        <p>
          Two binary choices, four cells.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-4">The 2×2 grid</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 my-6">
          <Cell
            who="Continuous time, aperiodic"
            title="Continuous Fourier Transform (CFT)"
            formula="X(f) = ∫ x(t) e^(−j2πft) dt"
            freq="Continuous frequency f ∈ ℝ"
          />
          <Cell
            who="Continuous time, periodic"
            title="Fourier Series"
            formula="x(t) = Σ cₖ e^(j2πkt/T)"
            freq="Discrete frequency k = 0, ±1, ±2, ..."
          />
          <Cell
            who="Discrete time, aperiodic"
            title="DTFT (Discrete-Time Fourier Transform)"
            formula="X(e^(jω)) = Σ x[n] e^(−jωn)"
            freq="Continuous frequency ω ∈ [−π, π]"
          />
          <Cell
            who="Discrete time, periodic"
            title="DFT (Discrete Fourier Transform)"
            formula="X[k] = Σ x[n] e^(−j2πkn/N)"
            freq="Discrete frequency k = 0, 1, ..., N−1"
            highlight
          />
        </div>

        <p>
          A useful symmetry: <strong>periodicity in one domain forces
          discreteness in the other</strong>. If the signal is periodic in time,
          its spectrum lives on a discrete grid (Fourier Series — only integer
          multiples of 1/T survive). If the spectrum is periodic in frequency
          (which happens automatically when time is discrete, because of
          aliasing), the time signal lives on a discrete grid. The DFT is the
          corner where <em>both</em> domains are discrete and periodic — and
          that is the only one a computer can actually store.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">What Fourier himself proposed</h3>
        <p>
          1807 Fourier was working on the heat equation — a continuous physical
          system. He proposed the <strong>Fourier Series</strong> (for periodic
          continuous signals) and the <strong>Continuous Fourier Transform</strong>
          (for aperiodic continuous signals). The top row of the grid.
        </p>
        <p>
          The bottom row didn't get developed until the 20th century, because the
          bottom row is about <em>sampled</em> signals — and you don't sample
          signals until you have computers.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Where the FFT fits in</h3>
        <p>
          The FFT is <strong>not</strong> a fifth Fourier Transform. It is not
          on the grid. It is not "more efficient than the DFT" in the sense of
          being a different transform.
        </p>

        <div class="my-6 p-5 rounded-xl bg-cyan-500/5 border-l-4 border-cyan-400">
          <p class="text-cyan-100 m-0">
            <strong>Lock this in:</strong> The FFT is an <em>algorithm</em> for
            computing the DFT. Its output is byte-identical to the DFT's. The
            only difference is that the naive DFT takes O(N²) operations and the
            FFT takes O(N log N). Same transform; faster recipe.
          </p>
        </div>

        <p>
          "Cooley–Tukey" is the most famous FFT algorithm but not the only one;
          there's Bluestein for non-power-of-two sizes, prime-factor FFTs,
          mixed-radix variants, and so on. They're all <em>recipes for the same
          transform</em>.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">The interview trap</h3>
        <p>
          If an interviewer asks <strong>"what's the difference between the
          DFT and the FFT?"</strong> — that question is fishing for exactly the
          answer above. The trap is to say something like "the FFT is the
          discrete version" or "the FFT is more accurate" or "the FFT works for
          real-time data" — all wrong. The single correct answer:
        </p>

        <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <p class="text-zinc-200 m-0">
            <em>"The DFT is the transform; the FFT is an algorithm that computes
            the DFT in O(N log N) instead of O(N²). They produce the same
            output."</em>
          </p>
        </div>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">What you actually use in practice</h3>
        <p>
          Everything you'll run on real hardware lives in the bottom-right cell:
        </p>
        <ul class="ml-4 list-disc marker:text-cyan-400 space-y-1">
          <li>A radar ADC dumps N samples per pulse → DFT (computed via FFT) → range bins.</li>
          <li>An audio interface samples at 48 kHz → window N samples → DFT → spectrum.</li>
          <li>Your phone's Wi-Fi modem demodulates OFDM → each subcarrier is one DFT bin.</li>
        </ul>
        <p>
          The other three cells are mathematical infrastructure that you reason
          <em>about</em>, even though you never compute them directly.
        </p>

        <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <h4 class="font-bold text-cyan-400 mb-2">What you should take from this chapter</h4>
          <ul class="space-y-2 text-zinc-300 m-0">
            <li>• Four transforms: CFT, Series, DTFT, DFT — distinguished by continuous/discrete time and aperiodic/periodic.</li>
            <li>• Periodicity in one domain ↔ discreteness in the other.</li>
            <li>• Computers can only store the DFT (both domains discrete & periodic).</li>
            <li>• <strong>The FFT is not a transform — it's a fast algorithm for the DFT.</strong></li>
            <li>• Cooley–Tukey is the most famous FFT algorithm; not the only one.</li>
          </ul>
        </div>
      </section>
    </article>
  )
}

export default Ch02_FourTransforms
