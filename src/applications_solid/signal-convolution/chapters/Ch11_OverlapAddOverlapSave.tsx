import type { Component } from 'solid-js'
import OverlapAddDemo from '../widgets/OverlapAddDemo'

const Eq: Component<{ children: any }> = (props) => (
  <p class="font-mono text-center text-emerald-300 text-sm sm:text-base p-3 my-3 rounded-lg bg-zinc-900/70 border border-zinc-800 overflow-x-auto">
    {props.children}
  </p>
)

const Ch11_OverlapAddOverlapSave: Component = () => {
  return (
    <article>
      <h2 class="text-3xl font-black mb-2 text-white">11. Overlap-Add and Overlap-Save</h2>
      <p class="text-zinc-400 italic mb-8">
        How to convolve a signal that's too long to FFT at once — and how every realtime reverb plugin actually works.
      </p>

      <section class="space-y-5 text-zinc-300 leading-relaxed">
        <p>
          Fast convolution (Chapter 9) is great as long as your signal fits in
          a single FFT. But what if you're streaming audio at 48 kHz and the
          signal is "all of forever"? Or processing a 100-second radar
          collection in 50-ms blocks? You can't FFT a million-sample signal
          every block — the latency would be unbearable and the memory
          unworkable.
        </p>
        <p>
          The fix is to chop the long signal into blocks, do a short FFT per
          block, and stitch the partial results back together correctly. Two
          classical algorithms — <strong>overlap-add</strong> (OLA) and
          <strong> overlap-save</strong> (OLS) — accomplish this and produce
          a bit-identical match to the single-shot linear convolution. They
          are the algorithms behind every realtime convolution reverb,
          every streaming FIR filter, and most radar pulse-compression
          implementations.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Setup</h3>
        <p>
          Let x be a long input signal of length N (potentially infinite, in
          streaming). Let h be a fixed FIR filter of length M. Pick a block
          size L. The full linear convolution would be length N + M − 1.
          We'll compute it block by block.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Overlap-Add (OLA) — split the input, sum the outputs</h3>
        <p>The algorithm:</p>
        <ol class="ml-4 list-decimal marker:text-emerald-400 space-y-1">
          <li>Partition x into non-overlapping blocks of length L: x₀, x₁, x₂, …</li>
          <li>For each block xᵢ, compute its convolution with h: yᵢ = xᵢ ∗ h. This is length L + M − 1, computed via FFT at length ≥ L + M − 1 (typically the next power of 2).</li>
          <li>Place yᵢ in the output stream starting at index i·L.</li>
          <li>Adjacent partial outputs overlap by M − 1 samples — those overlapping samples must be <strong>summed</strong>.</li>
        </ol>
        <p>
          The "add" in overlap-add refers to step 4. Each block's convolution
          tail bleeds M − 1 samples into the next block's window; you add the
          contributions instead of overwriting. Mathematically this is just
          distributivity:
        </p>
        <Eq>x ∗ h = (Σ<sub>i</sub> xᵢ) ∗ h = Σ<sub>i</sub> (xᵢ ∗ h)</Eq>
        <p>
          where xᵢ is x masked to block i's window. Convolution distributes
          over the sum, so we can convolve each masked input independently
          and add the results.
        </p>

        <OverlapAddDemo />

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Overlap-Save (OLS) — split the input, discard contaminated tail</h3>
        <p>
          OLS is the same idea, dual perspective. Instead of zero-padding
          each block to avoid wrap-around, you let the wrap-around happen
          and throw away the affected samples.
        </p>
        <ol class="ml-4 list-decimal marker:text-emerald-400 space-y-1">
          <li>Partition x into <em>overlapping</em> blocks of length N_block = L + M − 1, each block sharing M − 1 samples with the previous.</li>
          <li>FFT each block at exactly that length and multiply by H. You get a circular convolution of the block with h.</li>
          <li>The first M − 1 samples of each output block are contaminated by wrap-around (they include energy from "before" the block, which is wrong). Discard them.</li>
          <li>The remaining L samples are <em>valid</em> samples of the linear convolution.</li>
        </ol>
        <p>
          OLS does no additions across block boundaries — just discards M − 1
          contaminated samples per block. It's simpler on a GPU (no
          scatter-add into shared output buffers) and slightly more
          arithmetic-efficient than OLA for the same L.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">OLA vs OLS at a glance</h3>
        <div class="overflow-x-auto my-4">
          <table class="text-xs sm:text-sm border-collapse w-full">
            <thead>
              <tr class="border-b border-zinc-700">
                <th class="text-left py-2 pr-3 font-bold text-zinc-300"></th>
                <th class="text-left py-2 px-3 font-bold text-emerald-300">Overlap-Add</th>
                <th class="text-left py-2 px-3 font-bold text-emerald-300">Overlap-Save</th>
              </tr>
            </thead>
            <tbody class="text-zinc-300">
              <tr class="border-b border-zinc-800">
                <td class="py-2 pr-3 font-mono">block partition</td>
                <td class="py-2 px-3">non-overlapping, length L</td>
                <td class="py-2 px-3">overlapping by M − 1, length L + M − 1</td>
              </tr>
              <tr class="border-b border-zinc-800">
                <td class="py-2 pr-3 font-mono">FFT length</td>
                <td class="py-2 px-3">≥ L + M − 1 (pad block to this)</td>
                <td class="py-2 px-3">exactly L + M − 1 (use full block)</td>
              </tr>
              <tr class="border-b border-zinc-800">
                <td class="py-2 pr-3 font-mono">stitching</td>
                <td class="py-2 px-3">sum overlapping tails</td>
                <td class="py-2 px-3">discard first M − 1 samples per block</td>
              </tr>
              <tr class="border-b border-zinc-800">
                <td class="py-2 pr-3 font-mono">latency</td>
                <td class="py-2 px-3">L samples</td>
                <td class="py-2 px-3">L samples</td>
              </tr>
              <tr class="border-b border-zinc-800">
                <td class="py-2 pr-3 font-mono">GPU friendliness</td>
                <td class="py-2 px-3">needs scatter-add</td>
                <td class="py-2 px-3">just slice; embarrassingly parallel</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Practical choice: OLS is preferred on highly parallel hardware
          (GPUs, DSP arrays) because no cross-block coordination is needed.
          OLA is more common in textbooks and CPU code because the partition
          arithmetic is trivial.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Picking the block size</h3>
        <p>Two competing pressures:</p>
        <ul class="ml-4 list-disc marker:text-emerald-400 space-y-1">
          <li><strong>Latency</strong>. Both OLA and OLS introduce L samples of input-output delay. Realtime audio wants L ≤ a few ms (≤ 256 samples at 48 kHz).</li>
          <li><strong>Per-sample cost</strong>. Each block does an FFT of length ≈ L + M − 1, then a multiply, then an IFFT. The cost per output sample is O(log L). Larger L ⟹ slightly lower per-sample cost (but logarithmic, so it doesn't pay off explosively).</li>
        </ul>
        <p>
          Sweet spot: pick L roughly the next power of 2 above M. That gives
          you an FFT length ≈ 2L, a per-sample cost of O(log L), and
          acceptable latency in most realtime contexts. For audio reverb
          with M ≈ 200 000, you'd actually use a <strong>partitioned</strong>
          {' '}variant — different FFT sizes for different chunks of h — to keep
          early-arrival latency low while still benefiting from large FFTs on
          the late tail. That's a whole sub-field, but the basic idea is
          stacked OLA at multiple scales.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Where you'll see OLA/OLS in practice</h3>
        <ul class="ml-4 list-disc marker:text-emerald-400 space-y-1">
          <li><strong>Convolution reverb plugins</strong>. The impulse response of a real concert hall is convolved with the dry input. M can be 200 000 samples; OLA/OLS is mandatory.</li>
          <li><strong>OFDM communications</strong>. The cyclic prefix added to each OFDM symbol is literally an overlap-save trick: the prefix absorbs the channel's transient, so the per-symbol FFT sees a clean circular convolution.</li>
          <li><strong>Radar pulse compression on streaming data</strong>. The receive window is processed in blocks; the matched filter h is constant; OLS keeps the GPU memory layout flat and parallel.</li>
          <li><strong>Image-processing on tiles</strong>. Convolving a multi-megapixel image with a moderately large kernel is exactly a 2D version of OLS — process tiles with halo borders, discard the contaminated halo.</li>
        </ul>

        <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <h4 class="font-bold text-emerald-400 mb-2">What you should take from this chapter</h4>
          <ul class="space-y-2 text-zinc-300 m-0">
            <li>• Long signals don't fit in one FFT — convolve in blocks.</li>
            <li>• <strong>Overlap-Add</strong>: split input into non-overlapping blocks, sum overlapping outputs.</li>
            <li>• <strong>Overlap-Save</strong>: overlap input blocks by M − 1, discard contaminated samples after FFT.</li>
            <li>• OLS is GPU-friendlier (no scatter-add); OLA is textbook-classic.</li>
            <li>• Pick L ≈ next power of 2 above M; partition further for very long h (audio reverb).</li>
            <li>• OFDM cyclic-prefix is a real-world OLS trick.</li>
          </ul>
        </div>

        <p>
          Next: lift convolution into two dimensions and watch image processing fall out.
        </p>
      </section>
    </article>
  )
}

export default Ch11_OverlapAddOverlapSave
