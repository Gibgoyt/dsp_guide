import type { Component } from 'solid-js'

const Eq: Component<{ children: any }> = (props) => (
  <p class="font-mono text-center text-emerald-300 text-sm sm:text-base p-3 my-3 rounded-lg bg-zinc-900/70 border border-zinc-800 overflow-x-auto">
    {props.children}
  </p>
)

const Ch03_TheConvolutionSum: Component = () => {
  return (
    <article>
      <h2 class="text-3xl font-black mb-2 text-white">3. The Convolution Sum</h2>
      <p class="text-zinc-400 italic mb-8">
        Dissect the formula piece by piece, then never be confused by it again.
      </p>

      <section class="space-y-5 text-zinc-300 leading-relaxed">
        <p>
          The discrete-time convolution sum is the single most important
          formula in this entire guide. Memorize it, but more importantly,
          <em> understand every symbol in it</em> — the index conventions trip
          up more new engineers than any actual math content.
        </p>

        <Eq>(x ∗ h)[n] = Σ<sub>k = −∞</sub><sup>∞</sup> x[k] · h[n − k]</Eq>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">What every symbol means</h3>
        <p>The formula has three different indices doing three different jobs. Get them straight first.</p>
        <ul class="ml-4 list-disc marker:text-emerald-400 space-y-2">
          <li>
            <strong>n</strong> — the <em>output</em> time index. We are computing one specific sample of the output: y[n].
            For each n you'll do an entire summation.
          </li>
          <li>
            <strong>k</strong> — the <em>summation dummy variable</em>. It ranges over all of time. After the sum finishes, k is gone.
            Don't read k as "an output time" — it's just a counter sweeping across the inputs.
          </li>
          <li>
            <strong>x[k]</strong> — the input sample at time k.
          </li>
          <li>
            <strong>h[n − k]</strong> — the impulse response, evaluated at the difference n − k. This is the piece that's
            doing all the heavy lifting. Read it as: "how much of the impulse response is <em>still alive</em> at output
            time n from an input that arrived at time k."
          </li>
        </ul>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">The "flip and slide" picture</h3>
        <p>
          As a function of the summation variable k, h[n − k] does two things:
        </p>
        <ol class="ml-4 list-decimal marker:text-emerald-400 space-y-1">
          <li><strong>Flip.</strong> Replacing k with −k mirrors h around k=0. Hence "convolution flips one of its arguments."</li>
          <li><strong>Shift.</strong> Adding the constant n moves the flipped copy by n samples to the right.</li>
        </ol>
        <p>
          So h[n − k] is "h, flipped left-to-right, then shifted to align so that
          its zero sits at k = n." For each output time n you compute, that
          flipped-and-shifted copy lies in a new position; you multiply it
          point-by-point with x[k]; you sum the products; that single number
          is y[n]. Repeat for every n. The whole output signal is built
          this way.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Why the flip is there at all</h3>
        <p>
          The flip is not a mathematical trick — it has a physical meaning.
          Look at the sifting derivation from Chapter 2:
        </p>
        <Eq>y[n] = Σ<sub>k</sub> x[k] · h[n − k]</Eq>
        <p>
          The term x[k]·h[n − k] is the contribution at output time n from an
          impulse that arrived at input time k. The argument of h is
          <em> (n − k)</em>: how long has it been since the impulse arrived?
          For a causal system, h is zero for negative arguments, so only past
          inputs contribute (k ≤ n). The "flip" is just the algebra of "now
          minus arrival time." It is built into the definition because that's
          what time delay <em>is</em>.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">A worked unrolling</h3>
        <p>
          Take x = [1, 2, 3] supported on n=0,1,2 and h = [1, 1, 1] supported
          on n=0,1,2. Compute y[n] for each output sample, writing the sum
          out by hand:
        </p>
        <div class="font-mono text-xs sm:text-sm p-4 my-4 rounded-lg bg-zinc-950 border border-zinc-800 overflow-x-auto leading-loose">
          <div>y[0] = x[0]·h[0] = 1·1 = <span class="text-emerald-300">1</span></div>
          <div>y[1] = x[0]·h[1] + x[1]·h[0] = 1·1 + 2·1 = <span class="text-emerald-300">3</span></div>
          <div>y[2] = x[0]·h[2] + x[1]·h[1] + x[2]·h[0] = 1·1 + 2·1 + 3·1 = <span class="text-emerald-300">6</span></div>
          <div>y[3] = x[1]·h[2] + x[2]·h[1] = 2·1 + 3·1 = <span class="text-emerald-300">5</span></div>
          <div>y[4] = x[2]·h[2] = 3·1 = <span class="text-emerald-300">3</span></div>
        </div>
        <p>
          Total output: y = [1, 3, 6, 5, 3]. Notice the support: x has 3
          non-zero samples, h has 3 non-zero samples, and y has 3 + 3 − 1 = 5
          non-zero samples. That's a general fact:
        </p>
        <Eq>length(x ∗ h) = length(x) + length(h) − 1</Eq>
        <p>
          You'll use this constantly when you decide how much to zero-pad
          before an FFT-based convolution (Chapter 10).
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Two equivalent forms — and why commutativity is free</h3>
        <p>
          Make the substitution m = n − k in the sum (so k = n − m). The
          limits of the sum cover the same set, and you get:
        </p>
        <Eq>(x ∗ h)[n] = Σ<sub>m</sub> x[n − m] · h[m] = (h ∗ x)[n]</Eq>
        <p>
          So <strong>x ∗ h = h ∗ x</strong>: it doesn't matter which signal you
          consider the "input" and which the "impulse response" — the
          arithmetic comes out the same. We'll prove commutativity along with
          the other algebraic properties in Chapter 5, but the substitution
          above is the entire proof in one line.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">The cost of computing it directly</h3>
        <p>
          For each output sample you do one multiplication for every
          overlapping pair. If x has length N and h has length M, the total
          number of multiply-adds is roughly N · M. That's
          <strong> O(N·M)</strong>. For short kernels (M ≈ 10) on long signals
          this is fast. For an audio reverb with a 2-second impulse response at
          48 kHz, M ≈ 100 000 — and the cost explodes.
        </p>
        <p>
          Chapter 9 will turn this into <strong>O((N + M) log (N + M))</strong>
          via the FFT. That speedup is the reason real-time reverb, image
          processing, and radar pulse compression exist in software at all.
        </p>

        <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <h4 class="font-bold text-emerald-400 mb-2">What you should take from this chapter</h4>
          <ul class="space-y-2 text-zinc-300 m-0">
            <li>• The convolution sum: <span class="font-mono">(x∗h)[n] = Σₖ x[k]·h[n−k]</span>.</li>
            <li>• n is the output index, k is the summation dummy — they're different things.</li>
            <li>• h[n − k] is h flipped and shifted to align with the current output time.</li>
            <li>• Output length = N + M − 1 (you'll need this for zero-padding).</li>
            <li>• Commutativity is free — substitute m = n − k.</li>
            <li>• Direct cost is O(N·M). FFT will fix this in Chapter 9.</li>
          </ul>
        </div>

        <p>
          Next chapter: the continuous-time version. Same operation, integral
          instead of a sum.
        </p>
      </section>
    </article>
  )
}

export default Ch03_TheConvolutionSum
