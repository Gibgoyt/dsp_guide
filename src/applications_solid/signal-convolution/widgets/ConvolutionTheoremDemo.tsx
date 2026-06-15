import { createSignal, createMemo, createEffect, onMount } from 'solid-js'
import type { Component } from 'solid-js'
import { convolveTime, convolveFFT } from '../lib/conv'

/**
 * ConvolutionTheoremDemo — show the time-domain and FFT-multiply paths
 * producing bit-identical output. Plot the max absolute error so the
 * reader can see it's machine-epsilon noise.
 *
 * The interactive choice is the pair of signals (rect, ramp, exp) and
 * a method toggle. Both methods always run; we plot the chosen one in
 * the foreground and the other dimmed behind.
 */
type Sig = 'rect' | 'ramp' | 'exp' | 'noise'

const ConvolutionTheoremDemo: Component = () => {
  const N = 64
  const [sigX, setSigX] = createSignal<Sig>('rect')
  const [sigH, setSigH] = createSignal<Sig>('rect')
  const [method, setMethod] = createSignal<'time' | 'fft'>('time')
  let canvas: HTMLCanvasElement | undefined

  const synth = (kind: Sig): number[] => {
    const a = new Array<number>(N).fill(0)
    switch (kind) {
      case 'rect':
        for (let i = 4; i < 20; i++) a[i] = 1
        break
      case 'ramp':
        for (let i = 0; i < 12; i++) a[i + 4] = (i + 1) / 12
        break
      case 'exp':
        for (let i = 0; i < 32; i++) a[i + 4] = Math.exp(-i / 8)
        break
      case 'noise': {
        // deterministic pseudo-noise so the demo is stable
        let s = 1
        for (let i = 0; i < 20; i++) {
          s = (s * 1664525 + 1013904223) >>> 0
          a[i + 4] = ((s / 2 ** 32) * 2 - 1) * 0.7
        }
        break
      }
    }
    return a
  }

  const x = createMemo(() => synth(sigX()))
  const h = createMemo(() => synth(sigH()))

  const yTime = createMemo(() => convolveTime(x(), h()))
  const yFFT = createMemo(() => convolveFFT(x(), h()))

  const err = createMemo(() => {
    const a = yTime()
    const b = yFFT()
    let m = 0
    for (let i = 0; i < a.length; i++) m = Math.max(m, Math.abs(a[i] - b[i]))
    return m
  })

  const draw = () => {
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = canvas.width
    const Hh = canvas.height
    ctx.clearRect(0, 0, W, Hh)

    const rowH = Hh / 3

    const drawLine = (sig: number[], y0: number, color: string, label: string, faded = false) => {
      const yMid = y0 + rowH / 2
      ctx.strokeStyle = '#3f3f46'
      ctx.beginPath()
      ctx.moveTo(0, yMid)
      ctx.lineTo(W, yMid)
      ctx.stroke()
      const maxAbs = Math.max(0.4, ...sig.map((v) => Math.abs(v)))
      const xs = W / sig.length
      ctx.strokeStyle = color
      ctx.globalAlpha = faded ? 0.25 : 1
      ctx.lineWidth = 1.5
      ctx.beginPath()
      for (let i = 0; i < sig.length; i++) {
        const py = yMid - (sig[i] / maxAbs) * (rowH / 2.5)
        if (i === 0) ctx.moveTo(i * xs, py)
        else ctx.lineTo(i * xs, py)
      }
      ctx.stroke()
      ctx.globalAlpha = 1
      ctx.fillStyle = '#a1a1aa'
      ctx.font = '11px monospace'
      ctx.fillText(label, 6, y0 + 14)
    }

    drawLine(x(), 0, '#34d399', 'x[n]')
    drawLine(h(), rowH, '#a78bfa', 'h[n]')

    // Bottom: both lines, the chosen method bold
    const m = method()
    if (m === 'time') {
      drawLine(yFFT(), 2 * rowH, '#fbbf24', 'y[n] (FFT, dimmed)', true)
      drawLine(yTime(), 2 * rowH, '#22d3ee', `y[n] = x ∗ h  (time-domain  O(N·M)) — max err = ${err().toExponential(2)}`, false)
    } else {
      drawLine(yTime(), 2 * rowH, '#22d3ee', 'y[n] (time, dimmed)', true)
      drawLine(yFFT(), 2 * rowH, '#fbbf24', `y[n] = x ∗ h  (FFT-multiply  O(N log N)) — max err = ${err().toExponential(2)}`, false)
    }
  }

  createEffect(() => {
    sigX()
    sigH()
    method()
    draw()
  })

  onMount(() => {
    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }
    draw()
  })

  const picker = (state: () => Sig, set: (v: Sig) => void, label: string) => (
    <div>
      <div class="text-xs text-zinc-500 mb-1">{label}</div>
      <div class="flex flex-wrap gap-1">
        {(['rect', 'ramp', 'exp', 'noise'] as Sig[]).map((s) => (
          <button
            onClick={() => set(s)}
            class={`text-xs px-2 py-1 rounded ${state() === s ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-300'}`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div class="my-6 p-5 rounded-xl border border-zinc-800 bg-zinc-900/50">
      <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h4 class="font-bold text-emerald-400">Interactive: time-domain vs. FFT-multiply (identical output)</h4>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {picker(sigX, setSigX, 'x[n]')}
        {picker(sigH, setSigH, 'h[n]')}
        <div>
          <div class="text-xs text-zinc-500 mb-1">method</div>
          <div class="flex gap-1">
            <button onClick={() => setMethod('time')} class={`text-xs px-2 py-1 rounded ${method() === 'time' ? 'bg-cyan-500 text-black' : 'bg-zinc-800 text-zinc-300'}`}>Time O(N·M)</button>
            <button onClick={() => setMethod('fft')}  class={`text-xs px-2 py-1 rounded ${method() === 'fft' ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-300'}`}>FFT O(N log N)</button>
          </div>
        </div>
      </div>

      <canvas
        ref={canvas}
        style={{ width: '100%', height: '320px' }}
        class="block bg-zinc-950 rounded-lg border border-zinc-800"
      />

      <p class="mt-3 text-xs text-zinc-500 leading-relaxed">
        Both routines run on every frame. The dimmed curve is the other method; you can see
        they sit on top of each other. The reported max absolute error is in the 10⁻¹⁴
        range — pure floating-point noise. <strong>That match is the Convolution Theorem:</strong>
        the time-domain sum and IFFT(FFT(x)·FFT(h)) are <em>algebraically identical</em>; only
        the cost differs. The FFT route is asymptotically O(N log N) vs O(N·M).
      </p>
    </div>
  )
}

export default ConvolutionTheoremDemo
