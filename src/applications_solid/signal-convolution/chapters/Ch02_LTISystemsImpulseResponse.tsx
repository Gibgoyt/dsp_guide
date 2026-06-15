import type { Component } from 'solid-js'
import ImpulseResponseTap from '../widgets/ImpulseResponseTap'

const Eq: Component<{ children: any }> = (props) => (
  <p class="font-mono text-center text-emerald-300 text-sm sm:text-base p-3 my-3 rounded-lg bg-zinc-900/70 border border-zinc-800 overflow-x-auto">
    {props.children}
  </p>
)

const Ch02_LTISystemsImpulseResponse: Component = () => {
  return (
    <article>
      <h2 class="text-3xl font-black mb-2 text-white">2. LTI Systems and the Impulse Response</h2>
      <p class="text-zinc-400 italic mb-8">
        Why the response to a single impulse is enough to predict the response to <em>every</em> input.
      </p>

      <section class="space-y-5 text-zinc-300 leading-relaxed">
        <p>
          Convolution is not a universal operation that works on every system.
          It is the natural operation for a very specific (but enormous) class
          of systems: <strong>linear, time-invariant</strong> ones. Almost every
          textbook system you've ever met — RC filters, FIR/IIR digital
          filters, ideal lenses, lossless transmission lines, wave propagation,
          most amplifiers in their linear region — falls in this class.
          Understanding what LTI <em>means</em>, and what it lets you do, is
          the entire reason convolution is the operation you reach for.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Linearity</h3>
        <p>
          A system T is linear if it obeys two rules. First,
          <strong> homogeneity</strong>: scale the input, the output scales the
          same way.
        </p>
        <Eq>T{'{a · x[n]}'} = a · T{'{x[n]}'}</Eq>
        <p>
          Second, <strong>additivity</strong>: feed in a sum of inputs, you
          get a sum of outputs.
        </p>
        <Eq>T{'{x₁[n] + x₂[n]}'} = T{'{x₁[n]}'} + T{'{x₂[n]}'}</Eq>
        <p>
          Combined, these two rules are called the <strong>superposition
          principle</strong>:
        </p>
        <Eq>T{'{a·x₁ + b·x₂}'} = a · T{'{x₁}'} + b · T{'{x₂}'}</Eq>
        <p>
          This is the single most enabling property a system can have. It says
          that to figure out how a system responds to a complicated input, you
          can break the input into simpler pieces, push each piece through the
          system independently, then add the outputs back together. The
          "complicated" problem decomposes into many copies of the "simple"
          problem.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Time-invariance</h3>
        <p>
          A system is time-invariant if its behavior doesn't change over time.
          If you delay the input by n₀ samples, the only thing that happens is
          the output gets delayed by the same n₀:
        </p>
        <Eq>T{'{x[n − n₀]}'} = y[n − n₀]</Eq>
        <p>
          A guitar amplifier that sounds the same now as it did an hour ago is
          time-invariant. A reverb on a stage that gets gradually wetter as
          the curtains close is not. In practice, most systems are
          time-invariant on short enough time scales that we can treat them
          that way.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">The impulse response</h3>
        <p>
          The <strong>unit impulse</strong> in discrete time is the simplest
          possible signal: a single 1 at n=0, zeros everywhere else.
        </p>
        <Eq>δ[n] = 1 if n = 0, else 0</Eq>
        <p>
          Feed δ[n] into an LTI system T, and call the output h[n]:
        </p>
        <Eq>h[n] = T{'{δ[n]}'}</Eq>
        <p>
          That h[n] is the system's <strong class="text-emerald-300">impulse response</strong>. It is the
          fingerprint we kept talking about in Chapter 1.
        </p>

        <ImpulseResponseTap />

        <h3 class="text-xl font-bold text-white mt-10 mb-3">The sifting property — why h[n] is enough</h3>
        <p>
          Any discrete-time signal x[n] can be written as a sum of scaled and
          shifted impulses:
        </p>
        <Eq>x[n] = Σ<sub>k</sub> x[k] · δ[n − k]</Eq>
        <p>
          This looks trivial — at each k, the term x[k]·δ[n − k] is x[k] if
          n=k and zero otherwise, so the sum picks out the sample at index n.
          But it's the trick that makes everything work. Read x[n] as a
          <em> recipe</em>: "add x[0] copies of an impulse at time 0, plus x[1]
          copies of an impulse at time 1, plus..."
        </p>
        <p>
          Now push this recipe through the LTI system. Use linearity to pull
          the sum and the constants outside, and time-invariance to recognize
          that the system's response to δ[n − k] is just h[n − k]:
        </p>
        <Eq>y[n] = T{'{Σₖ x[k]·δ[n − k]}'} = Σ<sub>k</sub> x[k] · h[n − k]</Eq>

        <p>
          That last sum has a name. It is the <strong>discrete-time
          convolution</strong> of x and h, written x[n] ∗ h[n]. We just
          <em> derived</em> it. The impulse response h[n] is enough to
          characterize an LTI system entirely because every input is a sum of
          impulses, linearity lets you sum the individual responses, and
          time-invariance makes each individual response just a shifted copy
          of h[n].
        </p>

        <div class="my-6 p-5 rounded-xl bg-emerald-500/5 border-l-4 border-emerald-400">
          <p class="text-emerald-100 m-0">
            This is the central theorem of the entire chapter and the
            reason convolution matters. <strong>LTI + sifting ⟹ convolution.</strong>
            {' '}Every result in the next twelve chapters rides on this derivation.
          </p>
        </div>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">A second way to see "fingerprint"</h3>
        <p>
          Two LTI systems with the same impulse response produce the same
          output for every input — that's a direct consequence of the
          derivation above. So if you have a black box and want to identify
          what's inside, the fastest legal procedure is: tap it with an
          impulse, record the response, and you're done. There is nothing
          more to know.
        </p>
        <p>
          In practice you can't tap with a perfect δ[n] (infinite bandwidth in
          zero time), so you use a known approximate impulse (a short pulse,
          a maximum-length pseudo-random sequence, a swept sine) and
          deconvolve. The principle is unchanged.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Causality and stability — two practical riders</h3>
        <p>
          Two extra properties matter in real engineering even though they're
          not strictly required for convolution to make sense:
        </p>
        <ul class="ml-4 list-disc marker:text-emerald-400 space-y-1">
          <li><strong>Causal</strong>: h[n] = 0 for n &lt; 0. The system can't respond before it's poked. Every physical system is causal; some processing filters (e.g., zero-phase audio filters) are intentionally non-causal because the data is offline.</li>
          <li><strong>BIBO-stable</strong>: a bounded input always produces a bounded output. For LTI systems this is equivalent to h[n] being <em>absolutely summable</em>: Σ |h[n]| &lt; ∞. An IIR filter with poles outside the unit circle isn't, and will blow up.</li>
        </ul>

        <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <h4 class="font-bold text-emerald-400 mb-2">What you should take from this chapter</h4>
          <ul class="space-y-2 text-zinc-300 m-0">
            <li>• <strong>Linear</strong>: scale and add inputs, same happens to outputs (superposition).</li>
            <li>• <strong>Time-invariant</strong>: behavior doesn't change with time.</li>
            <li>• <strong>Impulse response</strong> h[n] = T{'{δ[n]}'} is the system's complete fingerprint.</li>
            <li>• Sifting: x[n] = Σ x[k]·δ[n−k]. Push through the system, get convolution: y[n] = Σ x[k]·h[n−k].</li>
            <li>• Practical: most useful systems are also causal (h=0 for n&lt;0) and BIBO-stable (Σ|h|&lt;∞).</li>
          </ul>
        </div>

        <p>
          Next chapter: pull the convolution sum apart, term by term, and see
          why the flip — h[n − k], not h[k − n] — is there.
        </p>
      </section>
    </article>
  )
}

export default Ch02_LTISystemsImpulseResponse
