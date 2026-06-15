/**
 * Convolution-specific math library.
 * Re-exports the shared FFT primitives from the fourier-transform guide
 * and adds correlation, matched-filtering, overlap-add, 2D convolution,
 * chirp synthesis, and noise helpers.
 *
 * Zero deps. Pure functions.
 */

import {
  type Complex,
  c,
  cadd,
  cmul,
  fftRadix2,
  ifftRadix2,
  convolveTime,
  convolveFFT,
} from '../../fourier-transform/lib/fft'

export {
  type Complex,
  c,
  cadd,
  cmul,
  fftRadix2,
  ifftRadix2,
  convolveTime,
  convolveFFT,
}

/* ------------------------------------------------------------------ */
/* Cross-correlation                                                   */
/* ------------------------------------------------------------------ */

/**
 * Direct time-domain cross-correlation: O(N*M).
 *   r[n] = sum_k a[k] * b[k - n]            (no flip on b)
 *
 * Returns an array of length a.length + b.length - 1 with the
 * zero-lag value at index b.length - 1.
 */
export const correlateTime = (a: number[], b: number[]): number[] => {
  const M = b.length
  const N = a.length + M - 1
  const r = new Array<number>(N).fill(0)
  for (let n = 0; n < N; n++) {
    const lag = n - (M - 1)
    let acc = 0
    for (let k = 0; k < a.length; k++) {
      const j = k - lag
      if (j < 0 || j >= M) continue
      acc += a[k] * b[j]
    }
    r[n] = acc
  }
  return r
}

/**
 * Cross-correlation via FFT. Equivalent to convolution with a time-reversed b.
 * For real inputs only.
 */
export const correlateFFT = (a: number[], b: number[]): number[] => {
  const bRev = [...b].reverse()
  return convolveFFT(a, bRev)
}

/* ------------------------------------------------------------------ */
/* Matched filter (complex / IQ)                                       */
/* ------------------------------------------------------------------ */

/**
 * Complex circular FFT-multiply convolution.
 * Pads both arrays to next pow-2 >= a.length + b.length - 1 before FFTing.
 */
export const convolveFFTComplex = (a: Complex[], b: Complex[]): Complex[] => {
  const need = a.length + b.length - 1
  let N = 1
  while (N < need) N <<= 1
  const pad = (arr: Complex[]): Complex[] => {
    const out: Complex[] = new Array(N)
    for (let i = 0; i < N; i++) {
      out[i] = i < arr.length ? { re: arr[i].re, im: arr[i].im } : { re: 0, im: 0 }
    }
    return out
  }
  const A = fftRadix2(pad(a))
  const B = fftRadix2(pad(b))
  const C = A.map((z, i) => cmul(z, B[i]))
  return ifftRadix2(C).slice(0, need)
}

/**
 * Matched filter on a complex baseband signal.
 *
 * The matched filter for a known template s(t) is the time-reversed
 * complex-CONJUGATE of s(t). Convolving the received signal with this
 * matched filter is mathematically equivalent to cross-correlation
 * with s(t) — and maximizes output SNR for additive white Gaussian noise.
 *
 *   h_match[n] = conj( s[L - 1 - n] )
 *
 * The conjugate is critical for complex signals: without it the phase
 * is wrong, which corrupts any downstream Doppler / phase estimation.
 */
export const matchedFilter = (received: Complex[], template: Complex[]): Complex[] => {
  const L = template.length
  const h: Complex[] = new Array(L)
  for (let n = 0; n < L; n++) {
    const s = template[L - 1 - n]
    h[n] = { re: s.re, im: -s.im }
  }
  return convolveFFTComplex(received, h)
}

/* ------------------------------------------------------------------ */
/* Circular convolution (the trap demo uses this directly)             */
/* ------------------------------------------------------------------ */

/**
 * Circular convolution of length-N: y[n] = sum_k a[k] * b[(n-k) mod N].
 *
 * This is what an FFT-multiply gives you when you DON'T zero-pad.
 * Used in the CircularVsLinearDemo to show energy wrapping around the boundary.
 */
export const convolveCircular = (a: number[], b: number[], N?: number): number[] => {
  const len = N ?? Math.max(a.length, b.length)
  const y = new Array<number>(len).fill(0)
  const aPad = new Array<number>(len).fill(0)
  const bPad = new Array<number>(len).fill(0)
  for (let i = 0; i < a.length; i++) aPad[i] = a[i]
  for (let i = 0; i < b.length; i++) bPad[i] = b[i]
  for (let n = 0; n < len; n++) {
    let acc = 0
    for (let k = 0; k < len; k++) {
      acc += aPad[k] * bPad[(n - k + len) % len]
    }
    y[n] = acc
  }
  return y
}

/* ------------------------------------------------------------------ */
/* Overlap-add block convolution                                       */
/* ------------------------------------------------------------------ */

/**
 * Overlap-add convolution. The streaming-friendly way to convolve a long
 * signal x with a fixed (short) impulse response h:
 *
 *   1. Split x into non-overlapping blocks of size L.
 *   2. Convolve each block with h -> length L + M - 1 partial output.
 *   3. Add (overlap) the M-1 tail of each partial into the head of the next.
 *
 * Output length = x.length + h.length - 1, equal to a single linear convolution.
 */
export const overlapAdd = (x: number[], h: number[], blockSize: number): number[] => {
  const M = h.length
  const L = blockSize
  const outLen = x.length + M - 1
  const y = new Array<number>(outLen).fill(0)
  for (let start = 0; start < x.length; start += L) {
    const block = x.slice(start, Math.min(start + L, x.length))
    const partial = convolveTime(block, h)
    for (let i = 0; i < partial.length; i++) {
      const idx = start + i
      if (idx < outLen) y[idx] += partial[i]
    }
  }
  return y
}

/* ------------------------------------------------------------------ */
/* 2D convolution (for the image widget)                               */
/* ------------------------------------------------------------------ */

/**
 * 2D linear convolution with "same" output size (zero-padded boundary).
 *
 * image is row-major H x W; kernel is row-major Kh x Kw (Kh, Kw odd).
 * Output is H x W. Boundary samples that would read outside the image
 * are treated as zero.
 *
 * Naive O(H * W * Kh * Kw). Good enough for our small canvas demos.
 */
export const conv2D = (
  image: Float32Array,
  H: number,
  W: number,
  kernel: number[],
  Kh: number,
  Kw: number
): Float32Array => {
  const out = new Float32Array(H * W)
  const kCenterY = (Kh - 1) >> 1
  const kCenterX = (Kw - 1) >> 1
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let acc = 0
      for (let ky = 0; ky < Kh; ky++) {
        const iy = y + ky - kCenterY
        if (iy < 0 || iy >= H) continue
        for (let kx = 0; kx < Kw; kx++) {
          const ix = x + kx - kCenterX
          if (ix < 0 || ix >= W) continue
          // Flip kernel for true convolution (vs correlation):
          //   y[y,x] = sum_{ky,kx} image[iy,ix] * kernel[Kh-1-ky, Kw-1-kx]
          const fkv = kernel[(Kh - 1 - ky) * Kw + (Kw - 1 - kx)]
          acc += image[iy * W + ix] * fkv
        }
      }
      out[y * W + x] = acc
    }
  }
  return out
}

/* ------------------------------------------------------------------ */
/* Library of 2D kernels                                               */
/* ------------------------------------------------------------------ */

export interface Kernel2D {
  name: string
  K: number
  data: number[]
}

export const KERNELS_2D: Record<string, Kernel2D> = {
  identity: {
    name: 'Identity',
    K: 3,
    data: [
      0, 0, 0,
      0, 1, 0,
      0, 0, 0,
    ],
  },
  boxBlur: {
    name: 'Box blur (3×3)',
    K: 3,
    data: Array(9).fill(1 / 9),
  },
  gaussian: {
    name: 'Gaussian blur (5×5)',
    K: 5,
    data: (() => {
      const sigma = 1.0
      const k: number[] = []
      let sum = 0
      for (let y = -2; y <= 2; y++) {
        for (let x = -2; x <= 2; x++) {
          const v = Math.exp(-(x * x + y * y) / (2 * sigma * sigma))
          k.push(v)
          sum += v
        }
      }
      return k.map((v) => v / sum)
    })(),
  },
  sharpen: {
    name: 'Sharpen',
    K: 3,
    data: [
       0, -1,  0,
      -1,  5, -1,
       0, -1,  0,
    ],
  },
  edgeX: {
    name: 'Sobel-X (vertical edges)',
    K: 3,
    data: [
      -1, 0, 1,
      -2, 0, 2,
      -1, 0, 1,
    ],
  },
  edgeY: {
    name: 'Sobel-Y (horizontal edges)',
    K: 3,
    data: [
      -1, -2, -1,
       0,  0,  0,
       1,  2,  1,
    ],
  },
  emboss: {
    name: 'Emboss',
    K: 3,
    data: [
      -2, -1, 0,
      -1,  1, 1,
       0,  1, 2,
    ],
  },
}

/* ------------------------------------------------------------------ */
/* Chirp + noise (matched-filter demo)                                 */
/* ------------------------------------------------------------------ */

/**
 * Linear-frequency-modulated chirp (complex baseband).
 *
 *   s[n] = exp( j * 2*pi * (f0 * t + 0.5 * K * t^2) ),  t = n / fs
 *
 * where K = (f1 - f0) / T_pulse is the chirp rate. This is the canonical
 * radar / sonar pulse: wide bandwidth (good range resolution after
 * matched filtering) but constant amplitude (easy power-amplifier).
 */
export const lfmChirp = (
  N: number,
  f0: number,
  f1: number,
  fs: number
): Complex[] => {
  const T = N / fs
  const K = (f1 - f0) / T
  const out: Complex[] = new Array(N)
  for (let n = 0; n < N; n++) {
    const t = n / fs
    const phi = 2 * Math.PI * (f0 * t + 0.5 * K * t * t)
    out[n] = { re: Math.cos(phi), im: Math.sin(phi) }
  }
  return out
}

/**
 * Box–Muller normal sample.
 */
const randn = (): number => {
  let u = 0,
    v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

/**
 * Add complex AWGN at a specified SNR (dB) relative to the signal's
 * average power. Returns a NEW array.
 */
export const awgnComplex = (signal: Complex[], snrDb: number): Complex[] => {
  let psig = 0
  for (const z of signal) psig += z.re * z.re + z.im * z.im
  psig /= signal.length
  if (psig === 0) return signal.map((z) => ({ re: z.re, im: z.im }))
  const pnoise = psig / Math.pow(10, snrDb / 10)
  const sigma = Math.sqrt(pnoise / 2) // half power per I/Q component
  return signal.map((z) => ({
    re: z.re + sigma * randn(),
    im: z.im + sigma * randn(),
  }))
}

/**
 * Delay a complex signal by an integer number of samples; truncate to
 * length N. Used to simulate a target echo at a given range.
 */
export const delayComplex = (s: Complex[], delay: number, N: number): Complex[] => {
  const out: Complex[] = new Array(N)
  for (let n = 0; n < N; n++) {
    const k = n - delay
    out[n] = k >= 0 && k < s.length ? { re: s[k].re, im: s[k].im } : { re: 0, im: 0 }
  }
  return out
}

/**
 * Complex magnitude.
 */
export const magComplex = (z: Complex[]): number[] => z.map((v) => Math.hypot(v.re, v.im))
