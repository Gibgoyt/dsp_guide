import type { Component } from 'solid-js'

const Eq: Component<{ children: any }> = (props) => (
  <p class="font-mono text-center text-cyan-300 text-sm sm:text-base p-3 my-3 rounded-lg bg-zinc-900/70 border border-zinc-800 overflow-x-auto">
    {props.children}
  </p>
)

const Prop: Component<{ name: string; t: string; f: string; note?: string }> = (props) => (
  <tr class="border-b border-zinc-900">
    <td class="py-2 pr-3 font-bold text-white">{props.name}</td>
    <td class="py-2 pr-3 font-mono text-cyan-300">{props.t}</td>
    <td class="py-2 pr-3 font-mono text-cyan-300">{props.f}</td>
    <td class="py-2 text-zinc-400 text-xs">{props.note}</td>
  </tr>
)

const Ch05_ContinuousFT: Component = () => {
  return (
    <article>
      <h2 class="text-3xl font-black mb-2 text-white">5. The Continuous Fourier Transform</h2>
      <p class="text-zinc-400 italic mb-8">
        The original idea, in continuous time. The math you reason <em>about</em>, even if computers can't compute it directly.
      </p>

      <section class="space-y-5 text-zinc-300 leading-relaxed">
        <p>
          The Continuous Fourier Transform (CFT) is defined for any aperiodic
          continuous-time signal x(t) that's reasonably well-behaved
          (square-integrable, say). It's the cell in the upper-left of our
          2×2 grid.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">The forward and inverse formulas</h3>
        <Eq>X(f) = ∫<sub>−∞</sub><sup>∞</sup> x(t) · e<sup>−j2πft</sup> dt</Eq>
        <Eq>x(t) = ∫<sub>−∞</sub><sup>∞</sup> X(f) · e<sup>j2πft</sup> df</Eq>
        <p>
          Forward: integrate the signal against every conjugate complex
          exponential. Result is a complex-valued function X(f) of frequency f.
          Inverse: integrate the spectrum against every complex exponential,
          weighted by X(f). Result is the original signal back.
        </p>
        <p>
          Two conventions float around. The "engineer" convention uses
          frequency f in Hz (above). The "math" convention uses angular
          frequency ω = 2πf and sticks a factor of 1/(2π) somewhere. They
          differ only in cosmetics. We'll stick with the Hz convention.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">A worked example: the rectangular pulse</h3>
        <p>
          Let x(t) = 1 for −τ/2 ≤ t ≤ τ/2 and 0 elsewhere. Compute its CFT:
        </p>
        <Eq>X(f) = ∫<sub>−τ/2</sub><sup>τ/2</sup> e<sup>−j2πft</sup> dt = τ · sinc(fτ)</Eq>
        <p>
          where sinc(x) = sin(πx)/(πx). This is the famous result that the
          Fourier transform of a rectangle is a <em>sinc</em>. A narrow pulse
          in time becomes a wide spread in frequency. A wide pulse in time
          becomes a narrow spread in frequency. This is the
          <strong> time-frequency uncertainty principle</strong> in DSP form:
          you cannot localize a signal arbitrarily well in <em>both</em>
          domains simultaneously.
        </p>
        <p>
          (Yes — this is the same principle as Heisenberg's uncertainty in
          quantum mechanics. Same math, different interpretation.)
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Key properties (interview-ready table)</h3>

        <div class="overflow-x-auto my-4">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-zinc-500 border-b border-zinc-800">
                <th class="py-2 pr-3">Property</th>
                <th class="py-2 pr-3">Time domain</th>
                <th class="py-2 pr-3">Frequency domain</th>
                <th class="py-2">Note</th>
              </tr>
            </thead>
            <tbody>
              <Prop name="Linearity"    t="a x(t) + b y(t)" f="a X(f) + b Y(f)" note="Why we can decompose at all" />
              <Prop name="Time shift"   t="x(t − t₀)"        f="X(f) · e^(−j2πft₀)" note="A delay = phase ramp in frequency" />
              <Prop name="Freq shift"   t="x(t) · e^(j2πf₀t)" f="X(f − f₀)" note="Modulation = spectral translation" />
              <Prop name="Time scaling" t="x(at)"            f="(1/|a|) · X(f/a)" note="Squeeze time → stretch frequency" />
              <Prop name="Differentiation" t="dx/dt"         f="j2πf · X(f)" note="Time derivative = multiply by jω" />
              <Prop name="Convolution"  t="(x ∗ h)(t)"      f="X(f) · H(f)" note="The convolution theorem — Ch. 10" />
              <Prop name="Multiplication" t="x(t) · h(t)"   f="(X ∗ H)(f)" note="Dual of convolution" />
              <Prop name="Duality"      t="X(t)"             f="x(−f)" note="The transform is almost its own inverse" />
              <Prop name="Parseval"     t="∫|x(t)|² dt"     f="∫|X(f)|² df" note="Energy is conserved across domains" />
            </tbody>
          </table>
        </div>

        <p>
          The two highlights:
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">The Convolution Theorem</h3>
        <Eq>x(t) ∗ h(t) &nbsp;⟺&nbsp; X(f) · H(f)</Eq>
        <p>
          Convolution in time = multiplication in frequency. This is the most
          consequential property of the Fourier Transform. It turns expensive
          filtering operations (sliding a kernel across a signal) into
          element-wise multiplications in the frequency domain. We will spend
          all of Chapter 10 on it.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Parseval / Plancherel — energy conservation</h3>
        <Eq>∫<sub>−∞</sub><sup>∞</sup> |x(t)|² dt = ∫<sub>−∞</sub><sup>∞</sup> |X(f)|² df</Eq>
        <p>
          The total energy of a signal is the same whether you measure it in
          time or in frequency. This is the Fourier Transform's version of
          "rotating a coordinate system doesn't change a vector's length." It's
          why the magnitude spectrum is the natural object to plot — its
          integral has direct physical meaning (energy or power).
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Why a computer can't compute this</h3>
        <p>
          Look at the limits of integration: −∞ to ∞. A computer cannot store
          an infinite signal, and it cannot evaluate a continuous-time
          integral exactly. Two compromises are forced on us:
        </p>
        <ul class="ml-4 list-disc marker:text-cyan-400 space-y-1">
          <li><strong>Sampling</strong>: discretize time. Replace x(t) with x[n] = x(n·Tₛ). We lose information about frequencies above fs/2. (Next chapter.)</li>
          <li><strong>Windowing</strong>: truncate to a finite duration. We lose the exactness of the spectrum and gain <em>spectral leakage</em>. (Chapter 9.)</li>
        </ul>
        <p>
          The Continuous Fourier Transform is the platonic ideal. Everything a
          digital system computes is some compromised version of it.
        </p>

        <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <h4 class="font-bold text-cyan-400 mb-2">What you should take from this chapter</h4>
          <ul class="space-y-2 text-zinc-300 m-0">
            <li>• Forward CFT: X(f) = ∫ x(t) e<sup>−j2πft</sup> dt. Inverse: same with positive sign.</li>
            <li>• <strong>Rectangle ↔ sinc</strong>; narrow in one domain ↔ wide in the other (uncertainty principle).</li>
            <li>• Time shift = phase ramp in frequency; modulation = frequency shift.</li>
            <li>• <strong>Convolution Theorem</strong>: convolution in time = multiplication in frequency.</li>
            <li>• <strong>Parseval</strong>: energy is conserved between the two domains.</li>
            <li>• Computers can't compute the CFT directly — sampling and windowing are the price of going digital.</li>
          </ul>
        </div>
      </section>
    </article>
  )
}

export default Ch05_ContinuousFT
