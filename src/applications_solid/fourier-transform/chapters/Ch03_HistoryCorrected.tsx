import type { Component } from 'solid-js'

const Ch03_HistoryCorrected: Component = () => {
  return (
    <article>
      <h2 class="text-3xl font-black mb-2 text-white">3. The History, Corrected</h2>
      <p class="text-zinc-400 italic mb-8">
        The pop-science version of the story is clean. The real story is better.
      </p>

      <section class="space-y-5 text-zinc-300 leading-relaxed">
        <p>
          You may have heard the story like this: Fourier proposed his transform
          in 1807. The "establishment" buried it. For 157 years it was a beautiful
          but uncomputable idea. Then Cooley and Tukey published the FFT in 1965
          and digital signal processing was born.
        </p>
        <p>
          That story is approximately true and exactly wrong in three places.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Correction 1: The "establishment" was one specific mathematician</h3>
        <p>
          When Fourier presented his paper on heat conduction to the French
          Academy of Sciences in 1807, the review committee included three
          giants: Lagrange, Laplace, and Legendre. Two of them were sympathetic.
        </p>
        <p>
          <strong class="text-cyan-300">Joseph-Louis Lagrange</strong> was not.
          Lagrange had a specific, sharp objection: he refused to believe that
          arbitrary functions — especially ones with corners or jumps, like a
          square wave or a step function — could be built from smooth, infinitely
          differentiable sines and cosines. It seemed obviously wrong: how can
          you add smooth things and get a corner?
        </p>
        <p>
          Lagrange was wrong, but he wasn't being stupid. The resolution is
          subtle: a finite sum of sines can't make a corner, but an
          <em> infinite </em>sum can — in a specific limit sense that wasn't
          properly formalized until the late 19th century, when Dirichlet,
          Riemann, and others made convergence rigorous. <strong>The "Gibbs
          phenomenon"</strong> (the ringing you see when you truncate a Fourier
          series near a discontinuity) is the lingering trace of Lagrange's
          objection — it's the price you pay for a finite approximation of an
          infinitely sharp edge.
        </p>
        <p>
          So: not a vague "establishment" — one specific brilliant
          mathematician with one specific pointed objection. The paper was held
          back from publication until 1822, when Fourier finally got it into
          print as <em>Théorie analytique de la chaleur</em>.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Correction 2: The FFT predates Fourier</h3>
        <p>
          The story that it took 157 years to compute the transform fast enough
          to be practical is good drama. It's also wrong.
        </p>
        <p>
          <strong class="text-cyan-300">Carl Friedrich Gauss</strong> — around
          1805, before Fourier even presented his heat paper — had a
          working FFT-style algorithm. He used it to compute the orbit of the
          asteroid Pallas from a finite number of observations. The technique
          uses the same divide-and-conquer trick that Cooley and Tukey
          rediscovered: split the data into even-indexed and odd-indexed
          subsequences, transform each recursively, combine. Same algorithm.
        </p>
        <p>
          Gauss never published it. It sat in his collected works, written in
          Latin, in a volume that came out after his death. Historians didn't
          notice until <strong>1984</strong>, when M. T. Heideman, D. H. Johnson,
          and C. S. Burrus published a paper titled "Gauss and the History of
          the Fast Fourier Transform."
        </p>
        <p>
          So the fast algorithm <em>slightly predates the theory it accelerates</em>,
          and the world re-discovered it 160 years later because Gauss didn't
          publish.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Correction 3: Cooley–Tukey was a Cold War project</h3>
        <p>
          The popular framing is that James Cooley and John Tukey published the
          FFT in 1965 because they were smart and the time was right. That's not
          the whole story. The actual driver was darker and more concrete.
        </p>
        <p>
          The U.S. needed to detect underground Soviet nuclear tests. The treaty
          framework being negotiated in the early 1960s (eventually the Limited
          Test Ban Treaty of 1963 and later test-ban proposals) required the
          ability to <strong>distinguish nuclear detonations from earthquakes</strong> using
          seismic data — and the way you do that is by analyzing the
          <em> spectral signature </em>of the seismic waves. Earthquakes and
          nuclear tests look different in the frequency domain.
        </p>
        <p>
          The problem was that doing a Fourier transform on tens of thousands of
          seismic samples with the naive O(N²) DFT took longer than the data
          collection itself. President Kennedy's Science Advisory Committee, on
          which Tukey served, raised the problem. Tukey worked out the
          algorithm on a napkin. James Cooley, then at IBM Research, wrote the
          code that made it real on the IBM 7094.
        </p>
        <p>
          Their 1965 paper, "An algorithm for the machine calculation of complex
          Fourier series," was four pages long and changed everything. Within
          two years, every signal-processing group in the world was using it.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Why this matters for how you talk about it</h3>
        <p>
          If you say the FFT "won a turf war against analog engineers," that's
          dramatized. There wasn't a faction war. The truer "why it mattered" is:
          before 1965, doing serious frequency analysis on a sampled signal was
          economically prohibitive on any computer. After 1965, it was cheap.
          The FFT didn't compete with analog signal processing — it
          <em> created the field of digital signal processing </em>by making it
          affordable for the first time.
        </p>
        <p>
          Every other DSP technique you learn — adaptive filters, channel
          estimation, OFDM demodulation, radar pulse compression, MRI image
          reconstruction — exists because the FFT made the underlying
          mathematics tractable.
        </p>

        <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <h4 class="font-bold text-cyan-400 mb-2">What you should take from this chapter</h4>
          <ul class="space-y-2 text-zinc-300 m-0">
            <li>• Fourier proposed his transform in 1807; the publication was held up until 1822, mainly by <strong>Lagrange's</strong> objection about smooth sines summing to non-smooth functions.</li>
            <li>• <strong>Gauss had a working FFT-style algorithm around 1805</strong>, before Fourier presented; it sat unpublished in Latin until rediscovered in 1984.</li>
            <li>• <strong>Cooley–Tukey 1965</strong> was driven partly by the Cold War need to distinguish Soviet nuclear tests from earthquakes via seismic spectra.</li>
            <li>• The FFT didn't beat analog; it <em>created</em> the field of digital signal processing.</li>
            <li>• Gibbs phenomenon (ringing at discontinuities) is the modern trace of Lagrange's original objection.</li>
          </ul>
        </div>
      </section>
    </article>
  )
}

export default Ch03_HistoryCorrected
