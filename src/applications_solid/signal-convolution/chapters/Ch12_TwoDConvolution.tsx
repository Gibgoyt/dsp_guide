import type { Component } from 'solid-js'
import Image2DConvDemo from '../widgets/Image2DConvDemo'

const Eq: Component<{ children: any }> = (props) => (
  <p class="font-mono text-center text-emerald-300 text-sm sm:text-base p-3 my-3 rounded-lg bg-zinc-900/70 border border-zinc-800 overflow-x-auto">
    {props.children}
  </p>
)

const Ch12_TwoDConvolution: Component = () => {
  return (
    <article>
      <h2 class="text-3xl font-black mb-2 text-white">12. 2D Convolution — Images and CNNs</h2>
      <p class="text-zinc-400 italic mb-8">
        Same operation, two dimensions. Blur, sharpen, edges, embossing — and the operation under every CNN.
      </p>

      <section class="space-y-5 text-zinc-300 leading-relaxed">
        <p>
          Everything in this guide so far has been 1D — signals indexed by a
          single integer n or a single real t. The leap to images is small:
          replace one index with two. The operation is structurally
          identical and every property carries over.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Definition</h3>
        <Eq>
          (x ∗ h)[m, n] = Σ<sub>j</sub> Σ<sub>k</sub> x[j, k] · h[m − j, n − k]
        </Eq>
        <p>
          Two sums instead of one, two flipped-and-shifted indices instead of
          one, same operation. The 2D impulse response h[m, n] is usually
          called a <strong>kernel</strong> or <strong>filter</strong>. For
          most image-processing work, kernels are small (3×3, 5×5, 7×7) and
          the input image is huge (millions of pixels). At each output pixel
          (m, n), the value is the dot-product of the kernel with a K × K
          patch of the input centered there.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">See it run</h3>
        <p>
          The widget below convolves a generated grayscale "image" with
          your choice of classical kernel — blur, Gaussian, sharpen, Sobel
          edge detectors, emboss. Each output pixel is an inner product of
          the K × K kernel with a K × K patch of the input. Switch kernels
          and watch which features survive.
        </p>

        <Image2DConvDemo />

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Classical kernels you should know</h3>
        <ul class="ml-4 list-disc marker:text-emerald-400 space-y-2">
          <li><strong>Box blur (3×3)</strong>. Each output pixel is the mean of itself and its 8 neighbors. Cheapest low-pass; smears edges.</li>
          <li><strong>Gaussian blur (e.g. 5×5)</strong>. Weighted average with bell-curve weights. Smoother low-pass; preserves shape better.</li>
          <li><strong>Sharpen</strong>. Center +5, neighbors −1. Boosts the difference between a pixel and its surroundings — exactly the <em>unsharp masking</em> that every camera ISP applies.</li>
          <li><strong>Sobel-X, Sobel-Y</strong>. Vertical and horizontal first-derivative filters. Take √(Sₓ² + Sᵧ²) for an isotropic edge magnitude.</li>
          <li><strong>Laplacian-of-Gaussian (LoG)</strong>. Pre-smooth with a Gaussian, then take the discrete Laplacian; the zero-crossings are edges. Classic blob/edge detector.</li>
          <li><strong>Emboss</strong>. Asymmetric high-pass; makes images look like stamped relief. Mostly a curiosity, but a good non-symmetric example.</li>
        </ul>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Separable kernels — the big speedup</h3>
        <p>
          Many useful 2D kernels can be written as the outer product of two
          1D kernels:
        </p>
        <Eq>h[m, n] = h_v[m] · h_h[n]</Eq>
        <p>
          For example, an N×N Gaussian is the outer product of two 1D
          Gaussians. The Sobel-X kernel is [1, 2, 1]ᵀ × [−1, 0, 1]. When this
          factorization exists, the 2D convolution can be done as two 1D
          convolutions in sequence:
        </p>
        <Eq>x ∗ h = (x ∗ h_v) ∗ h_h</Eq>
        <p>
          That changes the cost from O(K²) per pixel to O(2K) per pixel — a
          big win for moderate kernel sizes. Every well-optimized image
          processing pipeline (OpenCV, Photoshop, GPU ISP pipelines) tests
          for separability and exploits it.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">The 2D Convolution Theorem</h3>
        <Eq>F<sub>2D</sub>{'{x ∗ h}'}[u, v] = X[u, v] · H[u, v]</Eq>
        <p>
          The same theorem holds in 2D: 2D convolution in space ↔ pointwise
          multiplication in 2D frequency. For big kernels (FIRs with K &gt; 30
          or so) the 2D-FFT approach is decisively faster than direct 2D
          convolution. Zero-pad the image to at least H_img + K_h − 1 in
          rows and W_img + K_w − 1 in cols to avoid 2D circular wraparound —
          a direct generalization of Chapter 10.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Boundary handling — a 2D-specific subtlety</h3>
        <p>
          1D signals have two boundary samples; 2D images have a 1-pixel
          border around the entire image. Edge pixels need <em>some</em>
          assumption about what lies beyond the boundary:
        </p>
        <ul class="ml-4 list-disc marker:text-emerald-400 space-y-1">
          <li><strong>Zero</strong>. Pad with zeros. Simplest, but creates a dark halo for blurs.</li>
          <li><strong>Reflect</strong>. Mirror the image across the boundary. Most natural for smoothing.</li>
          <li><strong>Replicate</strong>. Copy the boundary pixel. Cheap; preserves average brightness.</li>
          <li><strong>Wrap</strong>. Periodic boundary. Useful for texture synthesis or when the data really is periodic.</li>
        </ul>
        <p>
          This is a <em>boundary condition</em> choice, separate from (and
          superimposed on) the linear-vs-circular FFT subtlety. They're
          easy to confuse — but they're different bugs with different fixes.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Cross-correlation and the CNN convention</h3>
        <p>
          As we noted in Chapter 7, the "convolution" in a convolutional
          neural network is technically <strong>cross-correlation</strong>
          (no kernel flip). PyTorch and TensorFlow do not flip. This is fine
          because the network <em>learns</em> the kernel; whichever sign of
          the flip is needed, gradient descent finds it. But if you embed a
          learned filter into a classical-DSP pipeline, mind the flip at the
          boundary.
        </p>
        <p>
          A few more CNN-specific touches:
        </p>
        <ul class="ml-4 list-disc marker:text-emerald-400 space-y-1">
          <li><strong>Stride</strong>. Apply the kernel only at every s-th pixel — equivalent to convolution followed by downsampling by s.</li>
          <li><strong>Padding</strong>. "Same" padding pads so the output is the same size as the input. "Valid" is no padding, so the output is smaller by K − 1.</li>
          <li><strong>Multiple channels</strong>. An RGB image has 3 input channels. A conv layer with C_out output channels needs C_in × C_out 2D kernels — a 4D tensor [C_out, C_in, K, K]. Each output channel is a sum of 2D convolutions across input channels.</li>
          <li><strong>Dilation</strong>. Insert holes inside the kernel to expand its receptive field without adding parameters. The atrous trick used in DeepLab.</li>
          <li><strong>Depthwise / separable convolutions</strong>. Same separability optimization from above, formalized as a network operation (MobileNet, EfficientNet).</li>
        </ul>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Higher dimensions are no different</h3>
        <p>
          3D convolution (video / volume data, e.g. MRI scans) is the
          obvious extension: three indices, three sums. Same operation,
          same theorem, same speedup via the 3D FFT. Beyond 4D it's mostly
          ML-flavored ("N-D convolution"), but the math doesn't change.
        </p>

        <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <h4 class="font-bold text-emerald-400 mb-2">What you should take from this chapter</h4>
          <ul class="space-y-2 text-zinc-300 m-0">
            <li>• 2D convolution = same operation, two indices, two sums.</li>
            <li>• Classical kernels: blur, Gaussian, sharpen, Sobel edges, LoG, emboss.</li>
            <li>• Separable kernels (outer product) reduce O(K²) per pixel to O(2K).</li>
            <li>• 2D Convolution Theorem holds — use the 2D FFT for large kernels.</li>
            <li>• Boundary handling (zero, reflect, replicate, wrap) is separate from the linear-vs-circular FFT subtlety.</li>
            <li>• A CNN's "conv" is correlation (no flip) — important if mixing with classical DSP.</li>
          </ul>
        </div>

        <p>
          Next: the radar capstone. Matched filters, LFM chirps, range bins, pulse compression — convolution doing exactly the job it was invented for.
        </p>
      </section>
    </article>
  )
}

export default Ch12_TwoDConvolution
