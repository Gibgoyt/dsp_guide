import type { Component } from 'solid-js'
import MatchedFilterChirpDemo from '../widgets/MatchedFilterChirpDemo'

const Eq: Component<{ children: any }> = (props) => (
  <p class="font-mono text-center text-emerald-300 text-sm sm:text-base p-3 my-3 rounded-lg bg-zinc-900/70 border border-zinc-800 overflow-x-auto">
    {props.children}
  </p>
)

const Ch13_MatchedFilterRadar: Component = () => {
  return (
    <article>
      <h2 class="text-3xl font-black mb-2 text-white">13. The Matched Filter and Radar</h2>
      <p class="text-zinc-400 italic mb-8">
        The capstone. Convolution doing the job it was invented for: pulling a known signal out of noise.
      </p>

      <section class="space-y-5 text-zinc-300 leading-relaxed">
        <p>
          Radar transmits a known signal, listens for echoes, and decides
          which echoes correspond to real targets. The signal-to-noise ratio
          at the antenna is usually terrible — peak echoes are buried in
          thermal noise, often by 20–40 dB. The matched filter is the
          provably optimal linear operation for extracting that known
          signal from the noise. Mechanically, it is just a complex
          cross-correlation, and so — by Chapter 7 — it is just a
          convolution. The radar industry is built on this operation.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">The setup</h3>
        <p>You transmit a known pulse s(t). The received signal is:</p>
        <Eq>r(t) = A · s(t − τ) · e<sup>jω_D t</sup> + w(t)</Eq>
        <p>
          A scaled, delayed (by round-trip time τ), Doppler-shifted (by
          target velocity, frequency ω_D), copy of s, plus noise w. You
          know s perfectly. You want to estimate A, τ, and ω_D — those map
          one-to-one to the target's RCS, range, and radial velocity.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">The matched filter</h3>
        <p>
          The matched filter h_MF is defined as the
          <strong> conjugated, time-reversed</strong> transmitted pulse:
        </p>
        <Eq>h_MF(t) = s*(−t)</Eq>
        <p>In discrete time:</p>
        <Eq>h_MF[n] = s*[ L − 1 − n ]   for n = 0, …, L − 1</Eq>
        <p>
          The output of this filter applied to the received signal is:
        </p>
        <Eq>y(t) = (r ∗ h_MF)(t) = ∫ r(τ') · s*(τ' − t) dτ' = R_rs(t)</Eq>
        <p>
          which is, exactly, the cross-correlation of r with s. The matched
          filter <em>is</em> the cross-correlation, implemented as a
          convolution by convolving with the conjugated, time-reversed
          template. The <strong>complex conjugate</strong> is the critical
          piece that preserves the phase so that downstream Doppler
          processing can recover ω_D from the phase progression across pulses.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">The optimality theorem</h3>
        <p>
          The matched filter is provably optimal in the following sense.
          For a deterministic known signal s in additive white Gaussian
          noise, among <strong>all</strong> linear filters, the matched
          filter maximizes the instantaneous SNR at the peak of its output.
          That SNR is:
        </p>
        <Eq>SNR_out = (2 · E_s) / N_0</Eq>
        <p>
          where E_s is the energy of the transmitted pulse and N_0 is the
          noise spectral density. Crucially, this SNR depends only on
          E_s — the total energy — not on the pulse shape. So you can use
          a long, low-amplitude chirp (good for the transmitter's power
          amplifier, which sits in its linear region) and recover the same
          peak SNR you'd have gotten from a short, high-amplitude pulse.
          That's the secret of <strong>pulse compression</strong>.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">The LFM chirp</h3>
        <p>The pulse-compression-friendly waveform of choice is the linear-frequency-modulated (LFM) chirp:</p>
        <Eq>s(t) = exp( j · 2π · (f₀·t + ½·K·t²) ),  0 ≤ t ≤ T</Eq>
        <p>where K = (f₁ − f₀) / T is the chirp rate, sweeping the instantaneous frequency from f₀ at t=0 to f₁ at t=T. Key properties:</p>
        <ul class="ml-4 list-disc marker:text-emerald-400 space-y-1">
          <li><strong>Constant amplitude</strong>. Ideal for the power amp.</li>
          <li><strong>Wide bandwidth</strong>. BW ≈ |f₁ − f₀|. After matched filtering, the output peak's width is ≈ 1/BW — so range resolution improves directly with chirp bandwidth, independent of the pulse length T.</li>
          <li><strong>Long pulse duration</strong>. Gives you SNR gain proportional to T·BW (the "time-bandwidth product"), so you can dial in any required detection sensitivity by chirp duration without sacrificing range resolution.</li>
          <li><strong>Doppler-tolerant</strong>. A target's Doppler shift just slides the chirp peak slightly in range — within a fraction of a range bin for normal targets. (You can fix even this with a 2D <em>ambiguity-function</em> search if you need to.)</li>
        </ul>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Watch it work — buried targets, then peaks</h3>
        <p>
          The widget below is the radar capstone of this guide. The
          transmitted complex LFM chirp s[n] is shown in purple. The
          received signal r[n] contains delayed copies of the chirp (one
          per target) plus complex AWGN at a chosen SNR — and at negative
          SNR the targets are <em>invisible</em> in the time-domain plot.
          The bottom row is the magnitude of the matched-filter output:
          sharp peaks at each target's range. That dramatic before/after
          is the entire reason matched filtering exists.
        </p>

        <MatchedFilterChirpDemo />

        <h3 class="text-xl font-bold text-white mt-10 mb-3">How this fits into a full radar processor</h3>
        <p>
          A typical pulse-Doppler radar processes a coherent processing
          interval (CPI) of N_pulse transmitted chirps, each with N_range
          fast-time samples. The receive array is a 2D matrix of shape
          [N_pulse × N_range], complex valued. The processing pipeline is
          almost entirely convolutions and FFTs:
        </p>
        <ol class="ml-4 list-decimal marker:text-emerald-400 space-y-1">
          <li><strong>Range compression</strong>: convolve each pulse (row) with the matched filter. After this the "fast-time" axis is range.</li>
          <li><strong>Corner-turn</strong>: transpose the matrix so slow-time (pulse index) is contiguous. The pure-DSP version is "rearrange axes"; on a GPU it's a critical <em>memory-coalescing</em> kernel — see Ch. 14.</li>
          <li><strong>Doppler processing</strong>: take an FFT along the slow-time axis. Each frequency bin corresponds to a target velocity. The output is a <strong>range-Doppler map</strong>.</li>
          <li><strong>CFAR detection</strong>: constant-false-alarm-rate threshold across the range-Doppler map to flag candidate target cells.</li>
          <li><strong>Tracking</strong>: associate detections across CPIs into target tracks (Kalman filters, JPDA, etc.).</li>
        </ol>
        <p>
          Steps 1, 2, and 3 are dominated by convolutions and FFTs. Steps
          4 and 5 are mostly bookkeeping. The pulse-Doppler pipeline is
          exactly an industrial-strength application of this guide's
          contents.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Range resolution, range ambiguity, and other constraints</h3>
        <ul class="ml-4 list-disc marker:text-emerald-400 space-y-2">
          <li><strong>Range resolution</strong> ΔR = c / (2·BW). Wider chirp ⟹ finer range. A 100 MHz chirp gives 1.5-meter range bins.</li>
          <li><strong>Unambiguous range</strong> R_unamb = c·PRI / 2, where PRI is the pulse-repetition interval. Targets farther than R_unamb fold back into the next PRI ("range-Doppler aliasing").</li>
          <li><strong>Unambiguous velocity</strong> v_unamb = λ·PRF / 4 (for two-way Doppler). Conflicts with R_unamb — the choice of PRF is a classic radar tradeoff.</li>
          <li><strong>Sidelobes</strong> after pulse compression sit at roughly −13 dB for an unwindowed rectangular chirp. Apply a slow-time window (Hann, Taylor) before the matched filter to push them down at a small cost in resolution.</li>
        </ul>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">The conjugate, one more time, for emphasis</h3>
        <div class="my-6 p-5 rounded-xl bg-red-500/5 border-l-4 border-red-400">
          <p class="text-red-100 m-0">
            If you take only one implementation detail from this chapter:
            <strong> the matched filter is convolution with the conjugated, time-reversed template.</strong>
            Skip the conjugate and your range-bin
            peaks may still land at the right place — but their phase is
            wrong, which corrupts every downstream Doppler estimate. That
            is the kind of bug that produces "the algorithm works in
            simulation but Doppler is junk in the field" tickets and ruins
            careers.
          </p>
        </div>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Beyond LFM — other waveforms</h3>
        <ul class="ml-4 list-disc marker:text-emerald-400 space-y-1">
          <li><strong>Barker codes</strong>. Phase-coded pulses with low autocorrelation sidelobes. Used in older radars.</li>
          <li><strong>Polyphase codes (Frank, P3, P4)</strong>. Like Barker but longer, designed for digital implementation.</li>
          <li><strong>Stepped-frequency waveforms</strong>. A burst of narrowband pulses at different carrier frequencies; coherently combined, equivalent to a much wider band.</li>
          <li><strong>OFDM radar / DVB-T passive radar</strong>. Reuse communications waveforms as opportunistic radar signals — same matched-filter math.</li>
          <li><strong>Noise radar</strong>. Transmit a random-looking waveform; match-filter against the transmitted copy. Hard to jam, hard to intercept.</li>
        </ul>
        <p>
          The implementation in each case is the same: convolve with the
          conjugated time-reversed transmitted waveform. Only the waveform
          design differs.
        </p>

        <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <h4 class="font-bold text-emerald-400 mb-2">What you should take from this chapter</h4>
          <ul class="space-y-2 text-zinc-300 m-0">
            <li>• Radar matched filter = convolution with the <strong>conjugated, time-reversed</strong> transmitted pulse.</li>
            <li>• Provably optimal: maximizes peak SNR for additive white Gaussian noise. SNR depends only on pulse energy, not shape.</li>
            <li>• LFM chirp = constant amplitude + wide bandwidth + long duration — the workhorse pulse-compression waveform.</li>
            <li>• Range resolution = c / (2·BW). Range / velocity ambiguities come from PRF choice.</li>
            <li>• Full pulse-Doppler radar pipeline = range compression (convolution) → corner turn → Doppler FFT → CFAR → tracking.</li>
            <li>• <strong>The conjugate matters.</strong> Drop it and Doppler is junk.</li>
          </ul>
        </div>

        <p>
          Next: how all this maps onto a real GPU. cuFFT, batched plans, the corner-turn transpose, CUDA streams.
        </p>
      </section>
    </article>
  )
}

export default Ch13_MatchedFilterRadar
