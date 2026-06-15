import { createSignal, createMemo, createEffect, onMount } from 'solid-js'
import type { Component } from 'solid-js'
import { conv2D, KERNELS_2D } from '../lib/conv'

/**
 * Image2DConvDemo — apply selectable 2D kernels to a procedurally generated
 * grayscale "image" with sharp edges and texture, side-by-side input/output.
 *
 * The image is generated rather than loaded so the widget has no asset
 * dependency. It includes high-contrast lines (so edge filters react),
 * a smooth gradient (so blurs / sharpens are visible), and noise speckle
 * (so denoising shows).
 */
type KernelId = 'identity' | 'boxBlur' | 'gaussian' | 'sharpen' | 'edgeX' | 'edgeY' | 'emboss'

const Image2DConvDemo: Component = () => {
  const W = 200
  const H = 140
  const [kernelId, setKernelId] = createSignal<KernelId>('boxBlur')
  let canvasIn: HTMLCanvasElement | undefined
  let canvasOut: HTMLCanvasElement | undefined

  const image = createMemo(() => {
    const img = new Float32Array(W * H)
    // gradient background
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        img[y * W + x] = 0.3 + 0.4 * (x / W)
      }
    }
    // a few high-contrast shapes
    // diagonal line
    for (let t = 0; t < 120; t++) {
      const x = 20 + t
      const y = 20 + Math.floor(t * 0.7)
      if (x >= 0 && x < W && y >= 0 && y < H) img[y * W + x] = 1.0
    }
    // a filled rectangle
    for (let y = 50; y < 90; y++) {
      for (let x = 130; x < 170; x++) {
        img[y * W + x] = 0.05
      }
    }
    // text-ish vertical bars
    for (let bx = 0; bx < 4; bx++) {
      const x0 = 50 + bx * 12
      for (let y = 90; y < 120; y++) {
        for (let x = x0; x < x0 + 6; x++) {
          if (x >= 0 && x < W && y >= 0 && y < H) img[y * W + x] = 0.95
        }
      }
    }
    // speckle noise
    for (let i = 0; i < 800; i++) {
      const idx = Math.floor(Math.random() * (W * H))
      img[idx] = Math.min(1, Math.max(0, img[idx] + (Math.random() - 0.5) * 0.6))
    }
    return img
  })

  const filtered = createMemo(() => {
    const k = KERNELS_2D[kernelId()]
    return conv2D(image(), H, W, k.data, k.K, k.K)
  })

  const drawTo = (cv: HTMLCanvasElement, data: Float32Array, normalize: boolean) => {
    const ctx = cv.getContext('2d')
    if (!ctx) return
    cv.width = W
    cv.height = H
    const img = ctx.createImageData(W, H)

    let lo = Infinity,
      hi = -Infinity
    if (normalize) {
      for (let i = 0; i < data.length; i++) {
        if (data[i] < lo) lo = data[i]
        if (data[i] > hi) hi = data[i]
      }
      if (hi === lo) hi = lo + 1
    }

    for (let i = 0; i < data.length; i++) {
      let v = data[i]
      if (normalize) v = (v - lo) / (hi - lo)
      const g = Math.max(0, Math.min(255, Math.round(v * 255)))
      img.data[i * 4 + 0] = g
      img.data[i * 4 + 1] = g
      img.data[i * 4 + 2] = g
      img.data[i * 4 + 3] = 255
    }
    ctx.putImageData(img, 0, 0)
  }

  const redraw = () => {
    if (canvasIn) drawTo(canvasIn, image(), false)
    if (canvasOut) {
      const k = kernelId()
      // edges, emboss, sharpen can go negative — normalize so they're visible
      const normalize = k !== 'identity' && k !== 'boxBlur' && k !== 'gaussian'
      drawTo(canvasOut, filtered(), normalize)
    }
  }

  createEffect(() => {
    kernelId()
    redraw()
  })

  onMount(() => redraw())

  const kdesc: Record<KernelId, string> = {
    identity: 'Identity kernel — leaves the image unchanged. The center pixel is 1, everything else 0. Sanity check that the pipeline is wired correctly.',
    boxBlur: '3×3 average. The simplest low-pass filter. Smears edges; cheap to compute. Each output pixel = mean of itself and its 8 neighbors.',
    gaussian: '5×5 Gaussian. Smoother low-pass — preserves shape better than box blur for the same support. Separable (1D row × 1D col) for big speed wins.',
    sharpen: 'Center +5, neighbors −1. Enhances local contrast — boosts the second derivative ("unsharp masking" with a Laplacian).',
    edgeX: 'Sobel-X. Vertical edges (left-right intensity gradient). One of the foundational edge detectors; output goes negative on dark→light vs light→dark.',
    edgeY: 'Sobel-Y. Horizontal edges. Same operator rotated. Combine √(Sx² + Sy²) for an isotropic edge magnitude.',
    emboss: 'Asymmetric kernel that makes the image look like a stamped relief — used historically for visual effects, mathematically just an asymmetric high-pass.',
  }

  return (
    <div class="my-6 p-5 rounded-xl border border-zinc-800 bg-zinc-900/50">
      <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h4 class="font-bold text-emerald-400">Interactive: 2D convolution on an image</h4>
      </div>

      <div class="flex flex-wrap gap-1 mb-3">
        {(Object.keys(KERNELS_2D) as KernelId[]).map((k) => (
          <button
            onClick={() => setKernelId(k)}
            class={`text-xs px-2 py-1 rounded ${kernelId() === k ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-300'}`}
          >
            {KERNELS_2D[k].name}
          </button>
        ))}
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <div class="text-xs text-zinc-500 mb-1">input</div>
          <canvas ref={canvasIn} class="w-full bg-zinc-950 rounded-lg border border-zinc-800" style={{ 'image-rendering': 'pixelated' }} />
        </div>
        <div>
          <div class="text-xs text-zinc-500 mb-1">image ∗ kernel</div>
          <canvas ref={canvasOut} class="w-full bg-zinc-950 rounded-lg border border-zinc-800" style={{ 'image-rendering': 'pixelated' }} />
        </div>
      </div>

      <p class="mt-3 text-xs text-zinc-500 leading-relaxed">
        {kdesc[kernelId()]} Every output pixel is the inner product of the kernel with a
        K × K patch of the input centered at that pixel — the exact 2D analog of the 1D
        sum y[n] = Σₖ x[k]·h[n − k]. A convolutional neural network applies hundreds of
        these in parallel, then learns the kernel weights from data instead of writing
        them by hand.
      </p>
    </div>
  )
}

export default Image2DConvDemo
