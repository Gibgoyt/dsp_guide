import type { Component } from 'solid-js'

const Eq: Component<{ children: any }> = (props) => (
  <p class="font-mono text-center text-cyan-300 text-sm sm:text-base p-3 my-3 rounded-lg bg-zinc-900/70 border border-zinc-800 overflow-x-auto">
    {props.children}
  </p>
)

const Ch11_RadarApplications: Component = () => {
  return (
    <article>
      <h2 class="text-3xl font-black mb-2 text-white">11. Real-World Applications &amp; Radar</h2>
      <p class="text-zinc-400 italic mb-8">
        Where the math hits the road. MP3, JPEG, MRI, Wi-Fi, and then the chapter that connects everything to radar.
      </p>

      <section class="space-y-5 text-zinc-300 leading-relaxed">
        <p>
          We've built up the machinery; now look at what it powers. Six
          applications, increasingly relevant to digital radar, ending with the
          one that probably brought you to this guide.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">MP3 — Perceptual audio compression</h3>
        <p>
          MP3 takes blocks of audio samples, transforms them with a variant of
          the Fourier Transform called the <strong>Modified Discrete Cosine
          Transform (MDCT)</strong>, and then uses a psychoacoustic model to
          decide which frequency coefficients can be heavily quantized or
          dropped entirely without the human ear noticing.
        </p>
        <p>
          The MDCT is a Fourier cousin: it uses cosines (not complex
          exponentials), is real-valued, has 50% overlap between blocks for
          smooth reconstruction, and is computed via — wait for it — an FFT.
          The whole MP3 codec is "FFT to frequency, throw away inaudible
          bits, save the rest." Without the FFT, MP3 wouldn't be real-time
          encodable on consumer hardware.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">JPEG — Image compression</h3>
        <p>
          JPEG splits an image into 8×8 pixel blocks, applies a
          <strong> 2D Discrete Cosine Transform (DCT) </strong>to each block,
          quantizes the resulting coefficients more aggressively for high
          frequencies (which the eye is less sensitive to), and entropy-codes
          the result.
        </p>
        <p>
          The 2D DCT is computed as two 1D DCTs (separability) — one along
          rows, one along columns. Same trick we'll see in radar's
          range-Doppler processing: 2D transforms decompose into 1D
          transforms along each axis.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">MRI — Magnetic resonance imaging</h3>
        <p>
          An MRI machine doesn't measure pixels directly. The hardware
          measures the signal in what's called <strong>k-space</strong>, which
          is — exactly and precisely — the 2D Fourier Transform of the image.
          The image is reconstructed by taking an inverse 2D FFT of the k-space
          data.
        </p>
        <p>
          This is why MRI can do things like "parallel imaging" (subsampling
          k-space and reconstructing) and "compressed sensing" — the entire
          measurement physics is Fourier-domain, so we can use clever Fourier
          tricks to acquire less data and still reconstruct accurately.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Wi-Fi / 5G / OFDM — Wireless multiplexing</h3>
        <p>
          Modern Wi-Fi (everything since 802.11a/g/n/ac/ax) and cellular
          (4G LTE, 5G) use <strong>Orthogonal Frequency Division Multiplexing
          (OFDM)</strong>. The trick: instead of sending bits serially down
          one wideband channel, you send them in parallel across hundreds of
          narrow sub-carriers — and each sub-carrier is exactly one DFT bin.
        </p>
        <p>
          To transmit: take your bits, lay them out as N complex numbers,
          inverse FFT, transmit the time-domain samples. To receive: sample
          the incoming waveform, forward FFT, read out the N complex numbers.
          The receiver's FFT recovers the parallel streams with no
          inter-carrier interference because of the orthogonality of the DFT
          basis (Chapter 4).
        </p>
        <p>
          The "OFDM symbol" you read about in 5G specs is literally one inverse
          FFT output. Each subcarrier is the DFT basis function for its bin.
          The FFT isn't a tool that OFDM happens to use — OFDM <em>is</em> an FFT.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Radar range-Doppler processing</h3>
        <p>
          Now the main event. Modern automotive radar, weather radar, and
          phased-array radars all use the same processing pattern:
          <strong> two FFTs per frame</strong>. Understanding what each FFT
          computes is the key to understanding radar entirely.
        </p>

        <h4 class="text-lg font-bold text-cyan-400 mt-6 mb-2">The signal you transmit</h4>
        <p>
          A common modulation is <strong>Frequency-Modulated Continuous Wave
          (FMCW)</strong>. The transmitter emits a chirp — a sinusoid whose
          instantaneous frequency ramps linearly from f₀ up to f₀ + B over
          T<sub>chirp</sub> seconds. Each chirp is one "fast-time" axis.
        </p>
        <p>
          The transmitter then sends a sequence of K chirps back-to-back. The
          chirp-to-chirp axis is called "slow time."
        </p>

        <h4 class="text-lg font-bold text-cyan-400 mt-6 mb-2">What you receive</h4>
        <p>
          A target at range R reflects the chirp back with a round-trip delay
          τ = 2R / c (c = speed of light). The receiver mixes the incoming
          echo with a copy of the transmitted chirp ("dechirping"), producing
          a <strong>beat tone</strong> whose frequency is proportional to R:
        </p>
        <Eq>f<sub>beat</sub> = (2 · B / T<sub>chirp</sub>) · (R / c)</Eq>
        <p>
          So <em>distance to the target shows up as a tone frequency</em>.
          Find the tone, find the target's range. To find the tone, you... do
          an FFT.
        </p>

        <h4 class="text-lg font-bold text-cyan-400 mt-6 mb-2">FFT #1: Range FFT (along fast time)</h4>
        <p>
          Each chirp gets sampled into N samples by the ADC. Run an FFT along
          the fast-time axis. Each output bin is a range bin. Range
          resolution is:
        </p>
        <Eq>ΔR = c / (2 · B)</Eq>
        <p>
          Higher chirp bandwidth B = finer range resolution. The total
          unambiguous range is fixed by the chirp duration and sample rate.
        </p>

        <h4 class="text-lg font-bold text-cyan-400 mt-6 mb-2">The buffer becomes 2D</h4>
        <p>
          After processing K chirps, you have a 2D matrix: <strong>K rows
          (chirps, slow time) × N columns (range bins, fast time)</strong>.
          Each column is one range bin's value across all K chirps.
        </p>

        <h4 class="text-lg font-bold text-cyan-400 mt-6 mb-2">FFT #2: Doppler FFT (along slow time)</h4>
        <p>
          A moving target shifts the phase of the beat tone by a tiny amount
          from chirp to chirp — proportional to its velocity (Doppler shift).
          Run an FFT down each column of the 2D matrix to convert the
          chirp-to-chirp phase progression into a velocity bin.
        </p>
        <Eq>Δv = λ / (2 · K · T<sub>chirp</sub>)</Eq>
        <p>
          λ is the carrier wavelength (≈ 3.9 mm at 77 GHz). The longer the
          observation (more chirps K), the finer the velocity resolution.
        </p>
        <p>
          After both FFTs, you have the <strong>range-Doppler map</strong> — a
          2D image where the x-axis is velocity and the y-axis is range. A
          target shows up as a bright peak at (its range, its velocity). One
          frame, two FFTs, full picture.
        </p>

        <h4 class="text-lg font-bold text-cyan-400 mt-6 mb-2">Why complex I/Q matters here</h4>
        <p>
          The receiver outputs complex I/Q samples (Chapter 6). The Doppler
          FFT operates on complex input, and the <em>sign of the phase
          rotation tells you direction of motion</em>:
        </p>
        <ul class="ml-4 list-disc marker:text-cyan-400 space-y-1">
          <li>Phase rotating counter-clockwise (positive Doppler) → target approaching.</li>
          <li>Phase rotating clockwise (negative Doppler) → target receding.</li>
        </ul>
        <p>
          A real-valued FFT (the kind you'd use for audio) would have
          conjugate-symmetric output — it couldn't distinguish positive from
          negative frequency, which means it couldn't tell approach from
          recede. Complex input <strong>breaks the symmetry on purpose</strong>,
          and that's exactly the information you need.
        </p>

        <h4 class="text-lg font-bold text-cyan-400 mt-6 mb-2">Why O(N log N) is the whole story</h4>
        <p>
          Take a modest 1024 × 1024 range-Doppler frame:
        </p>
        <ul class="ml-4 list-disc marker:text-cyan-400 space-y-1">
          <li>1024 range FFTs of length 1024 (one per chirp)</li>
          <li>1024 Doppler FFTs of length 1024 (one per range bin)</li>
          <li>2048 FFTs of length 1024 per frame</li>
        </ul>
        <p>
          With a naive O(N²) DFT, each FFT costs ~10⁶ complex multiplies →
          2048 × 10⁶ = 2 × 10⁹ multiplies <em>per frame</em>. At a 20 Hz
          frame rate that's 4 × 10¹⁰ multiplies/sec — impractical on any
          embedded GPU and far beyond a CPU.
        </p>
        <p>
          With Cooley–Tukey O(N log N), each 1024-point FFT is about 10,240
          multiplies — a 100× reduction. Now you're at 2 × 10⁷
          multiplies/frame, 4 × 10⁸/sec — easily handled by an embedded GPU,
          completed in a few milliseconds, well within your frame budget.
        </p>
        <p>
          <strong>That</strong> is the difference between real-time radar and
          an expensive paperweight.
        </p>

        <h4 class="text-lg font-bold text-cyan-400 mt-6 mb-2">Why GPU / cuFFT</h4>
        <p>
          All those 1024 FFTs are <em>independent</em> — there are no data
          dependencies between FFT #i and FFT #j. This is exactly the
          embarrassingly-parallel pattern GPUs eat alive. NVIDIA's
          <code class="text-zinc-300 bg-zinc-900 px-1 rounded">cuFFT</code>
          library exposes a <strong>batched FFT</strong> call: "here are 1024
          input vectors of length 1024 — give me 1024 output vectors." It
          runs them all in parallel across thousands of CUDA cores in a single
          kernel launch.
        </p>
        <p>
          The batched-FFT pattern is the workhorse of every modern
          GPU-accelerated radar pipeline. If you've worked with cuFFT or any
          batched FFT library before, congratulations — you've already shipped
          the most performance-critical operation in a radar processor.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">CFAR and target detection (one step beyond)</h3>
        <p>
          The FFTs give you a range-Doppler map. Detection is finding peaks
          in that map that exceed a noise floor. The standard algorithm is
          <strong> Constant False Alarm Rate (CFAR) </strong>detection — a
          sliding window that estimates local noise statistics and declares a
          target when a cell exceeds noise by a calibrated threshold. CFAR is
          not Fourier-related, but it's what your FFT output feeds into.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Beamforming (one step beyond)</h3>
        <p>
          A phased-array radar has many antennas. Steering the beam to look at
          a particular angle is — once you stare at the math — yet another
          FFT, this time across antennas. The "angle" dimension is just
          another axis along which you compute a DFT. Three FFTs total
          (range, Doppler, angle), each O(N log N), feeding into a
          range-Doppler-angle cube. Same algorithmic primitive everywhere.
        </p>

        <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <h4 class="font-bold text-cyan-400 mb-2">What you should take from this chapter</h4>
          <ul class="space-y-2 text-zinc-300 m-0">
            <li>• MP3 (MDCT), JPEG (DCT), MRI (k-space FFT), Wi-Fi/OFDM (DFT subcarriers) — Fourier is everywhere.</li>
            <li>• Radar range-Doppler = two FFTs per frame: <strong>fast-time → range</strong>, <strong>slow-time → Doppler</strong>.</li>
            <li>• Range resolution ΔR = c/(2B); Doppler resolution Δv = λ/(2·K·T<sub>chirp</sub>).</li>
            <li>• Complex I/Q input is what lets the Doppler FFT distinguish approach from recede.</li>
            <li>• 1024×1024 frame ≈ 2048 FFTs/frame; O(N log N) makes it real-time, O(N²) would make it impossible.</li>
            <li>• <strong>cuFFT batched FFTs on GPU</strong> are the standard radar workhorse — independent FFTs run in parallel across CUDA cores.</li>
            <li>• Beamforming adds a third FFT along antennas; CFAR detection processes the resulting cube.</li>
          </ul>
        </div>
      </section>
    </article>
  )
}

export default Ch11_RadarApplications
