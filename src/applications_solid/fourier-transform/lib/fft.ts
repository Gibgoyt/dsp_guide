/**
 * Tiny self-contained FFT / DFT / windowing / convolution library.
 * Used by every interactive widget in the Fourier Transform guide.
 *
 * Zero dependencies. All functions are pure.
 */

export interface Complex {
  re: number
  im: number
}

export const c = (re: number, im = 0): Complex => ({ re, im })

export const cadd = (a: Complex, b: Complex): Complex => ({
  re: a.re + b.re,
  im: a.im + b.im,
})

export const csub = (a: Complex, b: Complex): Complex => ({
  re: a.re - b.re,
  im: a.im - b.im,
})

export const cmul = (a: Complex, b: Complex): Complex => ({
  re: a.re * b.re - a.im * b.im,
  im: a.re * b.im + a.im * b.re,
})

export const cabs = (z: Complex): number => Math.hypot(z.re, z.im)

export const carg = (z: Complex): number => Math.atan2(z.im, z.re)

/**
 * Twiddle factor W_N^k = e^{-j 2 pi k / N}
 */
export const twiddle = (k: number, N: number): Complex => {
  const theta = (-2 * Math.PI * k) / N
  return { re: Math.cos(theta), im: Math.sin(theta) }
}

/**
 * Naive O(N^2) DFT — kept around as a reference implementation,
 * mostly so the DFTByHand widget can show the literal sum.
 *
 *   X[k] = sum_{n=0}^{N-1} x[n] * e^{-j 2 pi k n / N}
 */
export const dftNaive = (x: Complex[]): Complex[] => {
  const N = x.length
  const X: Complex[] = []
  for (let k = 0; k < N; k++) {
    let sum: Complex = { re: 0, im: 0 }
    for (let n = 0; n < N; n++) {
      sum = cadd(sum, cmul(x[n], twiddle(k * n, N)))
    }
    X.push(sum)
  }
  return X
}

/**
 * Iterative radix-2 Cooley–Tukey FFT.
 * Requires N to be a power of 2.
 * Operates on a copy of x; returns a new array.
 *
 * This is the algorithm that turns O(N^2) into O(N log N) by:
 *   1. Bit-reversal permuting the input.
 *   2. Building outputs from increasingly large butterflies.
 */
export const fftRadix2 = (x: Complex[]): Complex[] => {
  const N = x.length
  if (N === 0) return []
  if ((N & (N - 1)) !== 0) {
    throw new Error(`fftRadix2 requires N to be a power of 2, got ${N}`)
  }

  const X: Complex[] = x.map((z) => ({ re: z.re, im: z.im }))

  const bits = Math.log2(N)
  for (let i = 0; i < N; i++) {
    let j = 0
    for (let b = 0; b < bits; b++) {
      j = (j << 1) | ((i >> b) & 1)
    }
    if (j > i) {
      const tmp = X[i]
      X[i] = X[j]
      X[j] = tmp
    }
  }

  for (let size = 2; size <= N; size <<= 1) {
    const half = size >> 1
    const step = N / size
    for (let i = 0; i < N; i += size) {
      let k = 0
      for (let j = i; j < i + half; j++) {
        const t = cmul(twiddle(k, N), X[j + half])
        X[j + half] = csub(X[j], t)
        X[j] = cadd(X[j], t)
        k += step
      }
    }
  }

  return X
}

/**
 * Inverse FFT via the conjugate trick:
 *   ifft(X) = (1/N) * conj(fft(conj(X)))
 */
export const ifftRadix2 = (X: Complex[]): Complex[] => {
  const N = X.length
  const conj = X.map((z) => ({ re: z.re, im: -z.im }))
  const y = fftRadix2(conj)
  return y.map((z) => ({ re: z.re / N, im: -z.im / N }))
}

export const realToComplex = (x: number[]): Complex[] =>
  x.map((v) => ({ re: v, im: 0 }))

export const magnitudeSpectrum = (X: Complex[]): number[] => X.map(cabs)

export const phaseSpectrum = (X: Complex[]): number[] => X.map(carg)

/* ------------------------------------------------------------------ */
/* Window functions                                                    */
/* ------------------------------------------------------------------ */

export type WindowType = 'rect' | 'hann' | 'hamming' | 'blackman'

export const window = (type: WindowType, N: number): number[] => {
  const w = new Array<number>(N)
  for (let n = 0; n < N; n++) {
    switch (type) {
      case 'rect':
        w[n] = 1
        break
      case 'hann':
        w[n] = 0.5 * (1 - Math.cos((2 * Math.PI * n) / (N - 1)))
        break
      case 'hamming':
        w[n] = 0.54 - 0.46 * Math.cos((2 * Math.PI * n) / (N - 1))
        break
      case 'blackman': {
        const a0 = 0.42,
          a1 = 0.5,
          a2 = 0.08
        w[n] =
          a0 -
          a1 * Math.cos((2 * Math.PI * n) / (N - 1)) +
          a2 * Math.cos((4 * Math.PI * n) / (N - 1))
        break
      }
    }
  }
  return w
}

export const applyWindow = (x: number[], w: number[]): number[] =>
  x.map((v, i) => v * w[i])

/* ------------------------------------------------------------------ */
/* Convolution                                                         */
/* ------------------------------------------------------------------ */

/**
 * Direct time-domain linear convolution: O(N*M).
 *   y[n] = sum_k a[k] * b[n - k]
 */
export const convolveTime = (a: number[], b: number[]): number[] => {
  const N = a.length + b.length - 1
  const y = new Array<number>(N).fill(0)
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      y[i + j] += a[i] * b[j]
    }
  }
  return y
}

/**
 * Convolution via FFT: O((N+M) log (N+M)).
 *   y = IFFT( FFT(a_padded) .* FFT(b_padded) )
 *
 * Pads both inputs to the next power of two at least (a.length + b.length - 1)
 * to avoid circular wraparound.
 */
export const convolveFFT = (a: number[], b: number[]): number[] => {
  const need = a.length + b.length - 1
  let N = 1
  while (N < need) N <<= 1

  const pad = (arr: number[]): Complex[] => {
    const out: Complex[] = new Array(N)
    for (let i = 0; i < N; i++) {
      out[i] = { re: i < arr.length ? arr[i] : 0, im: 0 }
    }
    return out
  }

  const A = fftRadix2(pad(a))
  const B = fftRadix2(pad(b))
  const C = A.map((z, i) => cmul(z, B[i]))
  const y = ifftRadix2(C)
  return y.slice(0, need).map((z) => z.re)
}

/* ------------------------------------------------------------------ */
/* Formatting helpers (for widgets that display complex numbers)      */
/* ------------------------------------------------------------------ */

export const fmtNum = (v: number, digits = 3): string => {
  if (Math.abs(v) < 1e-10) return '0'
  return v.toFixed(digits).replace(/\.?0+$/, '') || '0'
}

export const fmtComplex = (z: Complex, digits = 3): string => {
  const re = fmtNum(z.re, digits)
  const im = fmtNum(Math.abs(z.im), digits)
  if (Math.abs(z.im) < 1e-10) return re
  if (Math.abs(z.re) < 1e-10) return `${z.im < 0 ? '-' : ''}${im}i`
  return `${re} ${z.im < 0 ? '−' : '+'} ${im}i`
}
