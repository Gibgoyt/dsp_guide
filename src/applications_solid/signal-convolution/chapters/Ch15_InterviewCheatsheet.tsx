import type { Component } from 'solid-js'

const Eq: Component<{ children: any }> = (props) => (
  <p class="font-mono text-center text-emerald-300 text-sm sm:text-base p-3 my-3 rounded-lg bg-zinc-900/70 border border-zinc-800 overflow-x-auto">
    {props.children}
  </p>
)

const Card: Component<{ title: string; children: any }> = (props) => (
  <div class="my-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
    <h4 class="font-bold text-emerald-400 mb-2">{props.title}</h4>
    {props.children}
  </div>
)

const Ch15_InterviewCheatsheet: Component = () => {
  return (
    <article>
      <h2 class="text-3xl font-black mb-2 text-white">15. Interview Cheat-Sheet</h2>
      <p class="text-zinc-400 italic mb-8">
        The half-page of facts and one-liners you'd want a tab away. Memorize these.
      </p>

      <section class="space-y-3 text-zinc-300 leading-relaxed">

        <Card title="Definitions">
          <p class="text-sm text-zinc-300 mb-1">Discrete convolution:</p>
          <Eq>(x ∗ h)[n] = Σ<sub>k</sub> x[k] · h[n − k]</Eq>
          <p class="text-sm text-zinc-300 mb-1">Continuous convolution:</p>
          <Eq>(x ∗ h)(t) = ∫ x(τ) · h(t − τ) dτ</Eq>
          <p class="text-sm text-zinc-300 mb-1">Cross-correlation (real):</p>
          <Eq>(x ⋆ h)[n] = Σ<sub>k</sub> x[k] · h[k − n]</Eq>
          <p class="text-sm text-zinc-300 mb-1">Cross-correlation (complex / radar):</p>
          <Eq>(x ⋆ h)[n] = Σ<sub>k</sub> x[k] · h*[k − n]</Eq>
        </Card>

        <Card title="Output length">
          <Eq>length(x ∗ h) = length(x) + length(h) − 1 = N + M − 1</Eq>
          <p class="text-xs text-zinc-400 mt-2">
            The single most important fact for sizing an FFT correctly. Memorize it.
          </p>
        </Card>

        <Card title="Convolution Theorem">
          <Eq>x ∗ h  ⟷  X · H        (time conv = freq mult)</Eq>
          <Eq>x · h  ⟷  X ∗ H        (time mult = freq conv)</Eq>
          <Eq>x ⋆ h  ⟷  X · H*       (correlation: conjugated second spectrum)</Eq>
        </Card>

        <Card title="Properties">
          <ul class="text-sm space-y-1">
            <li>• Commutative: x ∗ h = h ∗ x</li>
            <li>• Associative: (x ∗ h₁) ∗ h₂ = x ∗ (h₁ ∗ h₂)</li>
            <li>• Distributive: x ∗ (h₁ + h₂) = x ∗ h₁ + x ∗ h₂</li>
            <li>• Identity: x ∗ δ = x</li>
            <li>• Delay: x ∗ δ[n − D] = x[n − D]</li>
            <li>• Area: Σ(x ∗ h) = (Σx)(Σh)</li>
          </ul>
        </Card>

        <Card title="LTI = sifting + linearity + time-invariance ⟹ convolution">
          <p class="text-sm">
            <strong>Why h[n] is enough:</strong> every input is a sum of scaled, shifted
            impulses. Linearity lets you sum responses. Time-invariance makes each one a
            shifted copy of h[n]. Therefore y[n] = x[n] ∗ h[n], always.
          </p>
        </Card>

        <Card title="Direct vs FFT cost">
          <ul class="text-sm space-y-1">
            <li>• Direct time-domain: <strong>O(N · M)</strong>.</li>
            <li>• FFT-multiply: <strong>O(L log L)</strong>, with L ≥ N + M − 1, rounded to a nice FFT length.</li>
            <li>• Crossover: ~ N = 16–128 depending on platform / language.</li>
            <li>• For very short M, direct can beat FFT on GPUs (in-register taps).</li>
          </ul>
        </Card>

        <Card title="The four-step fast-convolution recipe">
          <ol class="text-sm space-y-1 list-decimal ml-4">
            <li>Zero-pad both x and h to length L ≥ N + M − 1 (typically next power of 2).</li>
            <li>FFT both.</li>
            <li>Pointwise multiply.</li>
            <li>Inverse FFT. Trim to N + M − 1.</li>
          </ol>
        </Card>

        <Card title="Circular vs Linear convolution — the trap">
          <p class="text-sm">
            DFT-multiply gives <strong>circular</strong> convolution of length L. Equals
            <strong> linear</strong> iff <span class="font-mono">L ≥ N + M − 1</span>. Under-pad
            and the tail wraps to the start: ghost targets in radar, ringing in audio,
            edge artifacts in images.
          </p>
        </Card>

        <Card title="Matched filter — the one-liner">
          <p class="text-sm mb-2">
            The matched filter is correlation, implemented as convolution with the
            <strong> conjugated, time-reversed</strong> template:
          </p>
          <Eq>h_MF[n] = s*[L − 1 − n]</Eq>
          <p class="text-sm">
            Drop the conjugate ⟹ phase is wrong ⟹ Doppler is junk.
          </p>
          <p class="text-sm mt-2">
            Optimal in white Gaussian noise. Peak SNR = 2·E_s / N₀ — depends only on pulse
            energy, not shape. That's why pulse compression works.
          </p>
        </Card>

        <Card title="LFM chirp">
          <Eq>s(t) = exp( j · 2π · (f₀ t + ½ K t²) )</Eq>
          <ul class="text-sm space-y-1">
            <li>• Range resolution ΔR = c / (2·BW). Wider bandwidth → finer range.</li>
            <li>• Constant amplitude → easy power amp.</li>
            <li>• Time-bandwidth product T·BW = matched-filter SNR gain.</li>
            <li>• Doppler-tolerant: slight range/Doppler coupling, usually a fraction of a range bin.</li>
          </ul>
        </Card>

        <Card title="Pulse-Doppler radar pipeline">
          <ol class="text-sm space-y-1 list-decimal ml-4">
            <li><strong>Range compression</strong>: convolve each pulse with the matched filter (batched FFT).</li>
            <li><strong>Corner-turn</strong>: transpose so slow-time is contiguous (tiled shared-memory kernel).</li>
            <li><strong>Doppler FFT</strong>: FFT across pulses at each range bin → range-Doppler map.</li>
            <li><strong>CFAR</strong>: threshold against local noise estimate.</li>
            <li><strong>Tracking</strong>: associate detections into target tracks.</li>
          </ol>
        </Card>

        <Card title="Streaming long signals">
          <ul class="text-sm space-y-1">
            <li>• <strong>Overlap-Add</strong>: split input into non-overlapping length-L blocks, FFT each at length ≥ L+M−1, sum overlapping tails.</li>
            <li>• <strong>Overlap-Save</strong>: overlap blocks by M−1, FFT each at L+M−1, discard the first M−1 samples (contaminated by circular wrap).</li>
            <li>• OLS is GPU-friendlier (no scatter-add). OLA is the textbook default.</li>
          </ul>
        </Card>

        <Card title="2D convolution / CNNs">
          <ul class="text-sm space-y-1">
            <li>• Same operation, two indices. Same theorem.</li>
            <li>• <strong>Separable</strong> kernels: K² → 2K per pixel (Gaussian, Sobel).</li>
            <li>• Boundary handling: zero / reflect / replicate / wrap. Choose, then own it.</li>
            <li>• CNN "conv" = cross-correlation (no flip). Frameworks learn whichever sign.</li>
            <li>• cuDNN/TensorRT pick im2col-GEMM, FFT, or Winograd per layer shape.</li>
          </ul>
        </Card>

        <Card title="GPU hazards (the six)">
          <ol class="text-sm space-y-1 list-decimal ml-4">
            <li>Forgot to zero-pad → wrap-around (ghost targets).</li>
            <li>Forgot to conjugate matched-filter template → broken Doppler.</li>
            <li>Uncoalesced Doppler access → fix with corner-turn transpose (+1 column pad).</li>
            <li>Per-signal FFT instead of batched (cufftPlanMany) → launch overhead dominates.</li>
            <li>Non-pinned host memory → streams can't overlap copy + compute.</li>
            <li>FP16 inside matched filter without SNR validation → silent dynamic-range loss.</li>
          </ol>
        </Card>

        <Card title="One-liners worth memorizing">
          <ul class="text-sm space-y-2">
            <li>• "Convolution flips, correlation doesn't. The matched filter is correlation, implemented as convolution with the conjugated time-reversed template."</li>
            <li>• "The Convolution Theorem isn't a trick — it's the statement that complex exponentials diagonalize LTI systems."</li>
            <li>• "Linear from FFT requires zero-padding to N + M − 1. Otherwise it's circular, and the tail wraps."</li>
            <li>• "An LTI system is its impulse response. Two black boxes with the same h are indistinguishable."</li>
            <li>• "On a GPU, the corner-turn is usually a bigger win than the Doppler FFT itself."</li>
            <li>• "Pulse compression: long chirp for SNR, wide bandwidth for resolution, matched filter to read out both."</li>
          </ul>
        </Card>

        <Card title="Sanity checks">
          <ul class="text-sm space-y-1">
            <li>• δ-input test: feed an impulse, expect h[n] back.</li>
            <li>• DC test: feed a constant, expect a constant scaled by Σ h[n].</li>
            <li>• Energy/Parseval: Σ |y|² should match Σ |Y|² / N up to scaling.</li>
            <li>• Reference port: have a slow, obviously-correct Python/NumPy reference and assert your CUDA matches it within tolerance. Always.</li>
          </ul>
        </Card>

      </section>
    </article>
  )
}

export default Ch15_InterviewCheatsheet
