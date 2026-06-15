import type { Component } from 'solid-js'

const Ch14_FastConvolutionOnGPUs: Component = () => {
  return (
    <article>
      <h2 class="text-3xl font-black mb-2 text-white">14. Fast Convolution on GPUs</h2>
      <p class="text-zinc-400 italic mb-8">
        The mental model — and the engineering hazards — of running this math at GPU scale. Theory only; no code.
      </p>

      <section class="space-y-5 text-zinc-300 leading-relaxed">
        <p>
          Convolution scales with every processor generation. Modern radars,
          modern CNNs, modern audio plugins all run their inner loops on
          GPUs, and they all hit the same set of engineering hazards on the
          way to real-time throughput. This chapter sketches the mental
          model for fast convolution on a GPU — enough vocabulary and
          architectural awareness to design a pipeline and reason about
          where the cycles go, without writing any CUDA in this guide.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Where the cycles go on a GPU</h3>
        <p>
          A GPU is a throughput machine, not a latency machine. Two costs
          dominate:
        </p>
        <ul class="ml-4 list-disc marker:text-emerald-400 space-y-2">
          <li><strong>Memory bandwidth</strong>. Reading and writing global memory is far slower (per cycle) than doing arithmetic. Every algorithm worth optimizing on a GPU is, after a point, memory-bandwidth bound.</li>
          <li><strong>Kernel launch overhead</strong>. Each CUDA kernel launch costs single-digit microseconds. Many tiny kernels add up faster than you expect.</li>
        </ul>
        <p>
          The implication for fast convolution: the FFT-multiply-IFFT
          recipe is structurally a great fit (math-heavy inside a few large
          kernels), but you have to be deliberate about data layout and
          launch granularity to actually realize that fit.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">cuFFT: batched plans are non-negotiable</h3>
        <p>
          NVIDIA's cuFFT library wraps a highly tuned set of FFT kernels.
          For radar — where you typically need one FFT per pulse (range
          compression), or one FFT per range bin (Doppler) — the right tool
          is <strong>cuFFT's batched plan API</strong>. It launches a
          single GPU kernel that computes many independent FFTs of the same
          length in parallel.
        </p>
        <ul class="ml-4 list-disc marker:text-emerald-400 space-y-1">
          <li>One launch per <em>batch</em> instead of per signal.</li>
          <li>Same plan reused across CPIs — plan creation is expensive but a one-time cost.</li>
          <li>The hardware uses the data-parallelism across the batch to keep all streaming multiprocessors busy.</li>
        </ul>
        <p>
          A batched plan for "do N_pulse range-FFTs, each of length N_range"
          turns hundreds of kernel launches into one. The throughput
          improvement is routinely 10–100×.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Data layout: the corner-turn</h3>
        <p>
          A pulse-Doppler radar processes a 2D matrix of complex samples,
          shape [N_pulse × N_range]. After range compression, "range"
          is the fast (innermost) axis; that's exactly what you want for
          the range FFT, because the FFT loves contiguous memory.
        </p>
        <p>
          But the next stage, Doppler processing, wants an FFT along the
          slow-time axis — i.e. across pulses, at fixed range. That axis is
          the slow (outer) one, with stride N_range. Asking cuFFT for a
          strided FFT will technically work, but the global-memory accesses
          are uncoalesced and the kernel hits a fraction of peak bandwidth.
        </p>
        <p>
          The right answer is to <strong>transpose the matrix first</strong>.
          In radar this transpose is called the <strong>corner-turn</strong>,
          and on a GPU it is implemented as a tiled, shared-memory
          transpose kernel — the canonical CUDA-introduction example. The
          structure is fixed:
        </p>
        <ul class="ml-4 list-disc marker:text-emerald-400 space-y-1">
          <li>Each block reads a 32×32 tile of the input into shared memory.</li>
          <li>Threads then read out of shared memory in transposed order and write back to global memory contiguously.</li>
          <li><strong>Pad the shared-memory tile by one column</strong> (33-wide instead of 32) to eliminate bank conflicts.</li>
        </ul>
        <p>
          With that kernel, both the input read and the output write are
          coalesced, and shared-memory accesses are bank-conflict-free.
          The corner-turn is genuinely one of the highest-impact
          optimizations in a radar pipeline — and pointing out the
          shared-memory tile pad in an interview signals you actually
          understand GPU memory hierarchy.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">CUDA streams — pipelining whole CPIs</h3>
        <p>
          A radar produces a new CPI every few tens of milliseconds. The
          temptation is to process them serially: copy in, compute, copy
          out, repeat. The right pattern is to <strong>pipeline</strong>
          them using CUDA streams.
        </p>
        <p>
          With three streams, at steady state, three CPIs are in flight
          simultaneously:
        </p>
        <ul class="ml-4 list-disc marker:text-emerald-400 space-y-1">
          <li>Stream 0: device-to-host copy of CPI N − 1's results.</li>
          <li>Stream 1: kernel compute on CPI N (range compression → transpose → Doppler → CFAR).</li>
          <li>Stream 2: host-to-device copy of CPI N + 1's raw samples.</li>
        </ul>
        <p>
          Hardware can execute all three concurrently because they use
          different engines (DMA copy engines vs. compute SMs). Net effect:
          the pipeline is bottlenecked on the longest single stage instead
          of the sum. For typical radar workloads the speedup is
          approximately 3× without changing any of the math.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Pinned host memory</h3>
        <p>
          Streams only overlap copy with compute if the host buffers are
          page-locked ("pinned"). Pageable memory has to be staged through
          an intermediate pinned buffer by the driver, which serializes
          the copies. Allocating the input and output ring-buffers with
          <span class="font-mono"> cudaMallocHost</span> (or pinning user
          buffers with <span class="font-mono">cudaHostRegister</span>) is
          a one-line change that often doubles end-to-end throughput.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">When to skip the FFT (on a GPU)</h3>
        <p>
          For very short filters (say M &lt; 16 taps), direct convolution
          can outperform FFT-multiply on a GPU because:
        </p>
        <ul class="ml-4 list-disc marker:text-emerald-400 space-y-1">
          <li>An FFT of length L ≥ M + N − 1 has more arithmetic and more memory traffic than M·N multiply-adds when M is tiny.</li>
          <li>You can keep the filter taps in <strong>constant memory</strong> or registers, eliminating reloads.</li>
          <li>The convolution kernel becomes a tight inner loop with high arithmetic intensity — exactly what GPUs are best at.</li>
        </ul>
        <p>
          The actual crossover depends on the GPU generation and how well
          cuFFT is tuned for your particular FFT length. Benchmark both for
          your kernel size; pick the winner.
        </p>

        <h3 class="text-xl function-bold text-white mt-10 mb-3">2D convolution on a GPU — CNN-style</h3>
        <p>
          CNN inference frameworks (cuDNN, TensorRT) ship multiple
          implementations of 2D convolution and pick one per layer based on
          shape:
        </p>
        <ul class="ml-4 list-disc marker:text-emerald-400 space-y-1">
          <li><strong>Direct (im2col + GEMM)</strong>. Reshape patches of the input into matrix columns, then do a giant GEMM (matrix multiply) on the GPU's tensor cores. Wastes memory but uses the best-tuned kernel in CUDA.</li>
          <li><strong>FFT-based</strong>. Win for large kernels (K ≥ 7 or so).</li>
          <li><strong>Winograd</strong>. Specialized minimum-arithmetic algorithm for small kernels (3×3, 5×5). Reduces multiplies at the cost of more additions and weight pre-processing. Used heavily for ResNet-style 3×3 conv layers.</li>
        </ul>
        <p>
          Knowing this menu is enough to reason about why a given network
          runs faster on this GPU than that one: the optimal algorithm
          depends on tensor shape, kernel size, and even precision (FP16 vs
          FP32 vs INT8). Frameworks autotune. Don't try to outsmart cuDNN
          on standard shapes; do outsmart it on unusual ones.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Precision and numerical stability</h3>
        <p>
          Modern GPUs ship with FP16 and BF16 throughput multiples of FP32
          (and sometimes 8× or more on tensor cores). For most convolutions
          the precision loss from FP16 is invisible. For matched filters
          with large dynamic range (radar in particular) you typically:
        </p>
        <ul class="ml-4 list-disc marker:text-emerald-400 space-y-1">
          <li>Do the FFTs in single-precision (FP32) complex.</li>
          <li>Use mixed precision only for the post-detection stages where dynamic range collapses.</li>
          <li>Never use FP16 inside the matched filter without testing the SNR penalty against a representative target set — the loss is shape-dependent and easy to underestimate.</li>
        </ul>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Profiling — where to actually look</h3>
        <ul class="ml-4 list-disc marker:text-emerald-400 space-y-1">
          <li><strong>Nsight Systems</strong>. Timeline-level view: where are kernels launching, are copies overlapping with compute, are streams saturated?</li>
          <li><strong>Nsight Compute</strong>. Per-kernel deep dive: occupancy, memory-bandwidth utilization, warp stalls, register pressure.</li>
          <li><strong>nvprof / nvprof2</strong>. Legacy command-line profiler; useful for quick before/after numbers in a script.</li>
        </ul>
        <p>
          When optimizing a fast-convolution pipeline you'll spend more
          time in Nsight Systems making sure your streams overlap than in
          Nsight Compute fiddling with kernel internals. The streams win
          gives back 2–3× on day one; kernel tuning usually buys 10–20%.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">The hazards, summarized</h3>
        <ol class="ml-4 list-decimal marker:text-emerald-400 space-y-1">
          <li><strong>Forgetting to zero-pad</strong> ⟹ circular wrap ⟹ ghost targets (Ch. 10).</li>
          <li><strong>Forgetting to conjugate the matched filter template</strong> ⟹ phase corruption ⟹ junk Doppler (Ch. 7, 13).</li>
          <li><strong>Uncoalesced memory access in the Doppler stage</strong> ⟹ low bandwidth ⟹ you eat a 5–10× penalty (the corner-turn is the fix).</li>
          <li><strong>Per-signal FFT launches instead of batched</strong> ⟹ kernel-launch overhead dominates ⟹ throughput collapses.</li>
          <li><strong>Pageable (non-pinned) host memory</strong> ⟹ copies serialize ⟹ streams can't overlap with compute.</li>
          <li><strong>Wrong precision for the dynamic range</strong> ⟹ SNR penalty in the field that didn't show up in dev.</li>
        </ol>

        <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <h4 class="font-bold text-emerald-400 mb-2">What you should take from this chapter</h4>
          <ul class="space-y-2 text-zinc-300 m-0">
            <li>• GPUs are throughput machines: memory bandwidth and kernel-launch overhead are the dominant costs.</li>
            <li>• Use <strong>batched FFT plans</strong> (cuFFT) — one launch covers many independent signals.</li>
            <li>• <strong>Corner-turn</strong> (tiled shared-memory transpose with +1 column pad) before the Doppler FFT.</li>
            <li>• <strong>CUDA streams + pinned host memory</strong> pipeline successive CPIs and overlap copy with compute.</li>
            <li>• Direct convolution beats FFT for very short filters; benchmark before assuming.</li>
            <li>• CNN frameworks autotune across im2col-GEMM, FFT, Winograd. Don't outsmart cuDNN on standard shapes.</li>
            <li>• Profile with Nsight Systems first (overlap), Nsight Compute second (kernel internals).</li>
          </ul>
        </div>

        <p>
          Next: the cheat-sheet that distills this entire guide into the
          half-page of facts you'd want one tab away in an interview.
        </p>
      </section>
    </article>
  )
}

export default Ch14_FastConvolutionOnGPUs
