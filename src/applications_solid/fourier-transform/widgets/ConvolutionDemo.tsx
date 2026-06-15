import { createSignal, createMemo, createEffect, onMount } from 'solid-js'
import type { Component } from 'solid-js'
import { convolveTime, convolveFFT } from '../lib/fft'

/**
 * ConvolutionDemo — convolve a rectangular pulse with itself, see the
 * triangle result. Toggle between time-domain convolution and FFT-multiply
 * to demonstrate the Convolution Theorem: they produce identical output.
 *
 * Also shows the sliding-window animation: the second signal slides across
 * the first; the dot-product at each shift is the output sample.
 */
const ConvolutionDemo: Component = () => {
  const [pulseWidth, setPulseWidth] = createSignal(12)
  const [shift, setShift] = createSignal(0)
  const [method, setMethod] = createSignal<'time' | 'fft'>('time')
  let canvas: HTMLCanvasElement | undefined

  const SIG_LEN = 64

  const rect = createMemo(() => {
    const w = pulseWidth()
    const x = new Array<number>(SIG_LEN).fill(0)
    const start = (SIG_LEN - w) >> 1
    for (let i = 0; i < w; i++) x[start + i] = 1
    return x
  })

  const output = createMemo(() => {
    const x = rect()
    return method() === 'time' ? convolveTime(x, x) : convolveFFT(x, x)
  })

  const draw = () => {
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = canvas.width
    const H = canvas.height
    ctx.clearRect(0, 0, W, H)

    const rowH = H / 3
    const drawSignal = (sig: number[], y0: number, color: string, label: string, dashOff?: number) => {
      const yMid = y0 + rowH / 2
      ctx.strokeStyle = '#3f3f46'
      ctx.beginPath()
      ctx.moveTo(0, yMid)
      ctx.lineTo(W, yMid)
      ctx.stroke()

      const maxAbs = Math.max(1, ...sig.map((v) => Math.abs(v)))
      const xStep = W / sig.length
      ctx.strokeStyle = color
      ctx.fillStyle = color
      ctx.lineWidth = 1.5

      for (let i = 0; i < sig.length; i++) {
        const px = i * xStep + (dashOff ?? 0) * xStep
        const py = yMid - (sig[i] / maxAbs) * (rowH / 2.5)
        ctx.fillRect(px, py, Math.max(1.5, xStep * 0.7), yMid - py)
      }

      ctx.fillStyle = '#a1a1aa'
      ctx.font = '11px monospace'
      ctx.fillText(label, 6, y0 + 14)
    }

    // Top: x[k] (input)
    drawSignal(rect(), 0, '#22d3ee', 'x[k]')

    // Middle: shifted h[n-k] sliding across (use shift as the n)
    const h = rect()
    const n = shift()
    const yMid = rowH + rowH / 2
    ctx.strokeStyle = '#3f3f46'
    ctx.beginPath()
    ctx.moveTo(0, yMid)
    ctx.lineTo(W, yMid)
    ctx.stroke()

    const xStep = W / SIG_LEN
    ctx.fillStyle = 'rgba(168,85,247,0.7)'
    for (let k = 0; k < SIG_LEN; k++) {
      const idx = n - k
      if (idx < 0 || idx >= SIG_LEN) continue
      const v = h[idx]
      if (v === 0) continue
      const px = k * xStep
      const py = yMid - v * (rowH / 2.5)
      ctx.fillRect(px, py, Math.max(1.5, xStep * 0.7), yMid - py)
    }
    ctx.fillStyle = '#a1a1aa'
    ctx.font = '11px monospace'
    ctx.fillText(`h[n−k] sliding (n=${n})`, 6, rowH + 14)

    // Bottom: output y[n] with red marker at current shift
    const y = output()
    const y0 = 2 * rowH
    const yMid2 = y0 + rowH / 2
    ctx.strokeStyle = '#3f3f46'
    ctx.beginPath()
    ctx.moveTo(0, yMid2)
    ctx.lineTo(W, yMid2)
    ctx.stroke()

    const yStep = W / y.length
    const maxOut = Math.max(1, ...y.map((v) => Math.abs(v)))
    ctx.fillStyle = '#22d3ee'
    for (let i = 0; i < y.length; i++) {
      const py = yMid2 - (y[i] / maxOut) * (rowH / 2.5)
      ctx.fillRect(i * yStep, py, Math.max(1.5, yStep * 0.7), yMid2 - py)
    }

    // Red marker at shift
    const markerX = shift() * yStep
    ctx.strokeStyle = '#ef4444'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(markerX, y0)
    ctx.lineTo(markerX, y0 + rowH)
    ctx.stroke()

    ctx.fillStyle = '#a1a1aa'
    ctx.font = '11px monospace'
    ctx.fillText('y[n] = (x ∗ h)[n]', 6, y0 + 14)
  }

  createEffect(() => {
    pulseWidth()
    shift()
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

  const maxShift = createMemo(() => SIG_LEN + pulseWidth() - 1)

  return (
    <div class="my-6 p-5 rounded-xl border border-zinc-800 bg-zinc-900/50">
      <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h4 class="font-bold text-cyan-400">Interactive: Convolution &amp; the Convolution Theorem</h4>
        <div class="flex gap-1 text-xs">
          <button
            onClick={() => setMethod('time')}
            class={`px-2 py-1 rounded ${method() === 'time' ? 'bg-cyan-500 text-black' : 'bg-zinc-800 text-zinc-300'}`}
          >
            Time-domain O(N·M)
          </button>
          <button
            onClick={() => setMethod('fft')}
            class={`px-2 py-1 rounded ${method() === 'fft' ? 'bg-cyan-500 text-black' : 'bg-zinc-800 text-zinc-300'}`}
          >
            FFT-multiply O(N log N)
          </button>
        </div>
      </div>

      <canvas
        ref={canvas}
        style={{ width: '100%', height: '320px' }}
        class="block bg-zinc-950 rounded-lg border border-zinc-800"
      />

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <label class="text-xs">
          <span class="text-zinc-400">Pulse width: {pulseWidth()}</span>
          <input
            type="range"
            min={2}
            max={32}
            step={1}
            value={pulseWidth()}
            onInput={(e) => setPulseWidth(parseInt(e.currentTarget.value))}
            class="w-full accent-cyan-400 mt-1"
          />
        </label>
        <label class="text-xs">
          <span class="text-zinc-400">Animate slide: n = {shift()}</span>
          <input
            type="range"
            min={0}
            max={maxShift()}
            step={1}
            value={shift()}
            onInput={(e) => setShift(parseInt(e.currentTarget.value))}
            class="w-full accent-cyan-400 mt-1"
          />
        </label>
      </div>

      <p class="mt-3 text-xs text-zinc-500 leading-relaxed">
        Top row: input pulse x[k]. Middle row: the second pulse h[n−k] sliding across
        — drag the bottom slider and watch it move. Bottom row: the convolution
        output y[n] = Σ x[k]·h[n−k]. At each shift, y[n] is the area of overlap;
        sliding a rectangle past itself produces a <em>triangle</em>. Toggle between
        time-domain and FFT methods — output is identical. That's the
        <strong> Convolution Theorem</strong>: time-domain convolution equals
        frequency-domain multiplication, and the FFT lets us trade O(N²) for O(N log N).
      </p>
    </div>
  )
}

export default ConvolutionDemo
