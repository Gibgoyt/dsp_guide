import { createSignal, createMemo, createEffect, onMount } from 'solid-js'
import type { Component } from 'solid-js'
import { convolveTime, convolveCircular } from '../lib/conv'

/**
 * CircularVsLinearDemo — show the ghost-target failure mode.
 *
 * Same x, same h. Compute:
 *   - linear convolution (proper zero-padding), length N + M - 1
 *   - circular convolution at user-chosen FFT length L (could be too short!)
 *
 * When L < N + M - 1, the tail of the linear convolution wraps around to
 * the start. In radar that's a ghost target at a wrong range bin. The
 * widget plots both; the circular output is highlighted where it differs
 * from the linear.
 */
const CircularVsLinearDemo: Component = () => {
  const N = 40
  const M = 25 // h length
  const MIN_OK = N + M - 1 // 64

  const [L, setL] = createSignal(48) // user choice; deliberately too short
  let canvas: HTMLCanvasElement | undefined

  const x = createMemo(() => {
    const a = new Array<number>(N).fill(0)
    // a single pulse near the end of the range window — will be the one
    // that wraps if L is too small
    for (let i = N - 10; i < N - 5; i++) a[i] = 1
    return a
  })

  const h = createMemo(() => {
    // exponential decay — same shape as a matched-filter peak with sidelobes
    const a = new Array<number>(M).fill(0)
    for (let i = 0; i < M; i++) a[i] = Math.exp(-i / 6) * Math.cos(i * 0.5)
    return a
  })

  const yLinear = createMemo(() => convolveTime(x(), h())) // length N + M - 1

  const yCircular = createMemo(() => convolveCircular(x(), h(), L()))

  const draw = () => {
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = canvas.width
    const Hh = canvas.height
    ctx.clearRect(0, 0, W, Hh)

    const lin = yLinear()
    const circ = yCircular()
    const padded = new Array<number>(lin.length).fill(0)
    // The circular result lives in [0, L). For comparison, copy it into the
    // same axis as lin, showing the wraparound visually.
    for (let i = 0; i < circ.length; i++) padded[i] = circ[i]

    const rowH = Hh / 3

    const drawStem = (sig: number[], y0: number, color: string, label: string, highlight?: number[]) => {
      const yMid = y0 + rowH / 2
      ctx.strokeStyle = '#3f3f46'
      ctx.beginPath()
      ctx.moveTo(0, yMid)
      ctx.lineTo(W, yMid)
      ctx.stroke()
      const maxAbs = Math.max(0.4, ...sig.map((v) => Math.abs(v)))
      const xs = W / sig.length
      for (let i = 0; i < sig.length; i++) {
        if (Math.abs(sig[i]) < 1e-9) continue
        const px = i * xs + xs / 2
        const py = yMid - (sig[i] / maxAbs) * (rowH / 2.5)
        const hi = highlight?.includes(i)
        ctx.fillStyle = hi ? '#ef4444' : color
        ctx.strokeStyle = hi ? '#ef4444' : color
        ctx.lineWidth = hi ? 2 : 1.2
        ctx.beginPath()
        ctx.moveTo(px, yMid)
        ctx.lineTo(px, py)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(px, py, hi ? 3 : 2, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.fillStyle = '#a1a1aa'
      ctx.font = '11px monospace'
      ctx.fillText(label, 6, y0 + 14)
    }

    // Where does the circular output differ from the linear? Anywhere
    // |diff| > tol. Those red stems ARE the wraparound.
    const diff: number[] = []
    for (let i = 0; i < lin.length; i++) {
      if (Math.abs(lin[i] - (padded[i] ?? 0)) > 1e-3) diff.push(i)
    }

    drawStem(lin, 0, '#34d399', `LINEAR y[n] (length ${lin.length})`)
    drawStem(padded, rowH, '#fbbf24', `CIRCULAR y[n] at L=${L()}  — red where it wraps`, diff)

    // Bottom: the difference itself
    const errArr = lin.map((v, i) => v - (padded[i] ?? 0))
    drawStem(errArr, 2 * rowH, '#ef4444', 'linear − circular  (the ghost energy)')
  }

  createEffect(() => {
    L()
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

  const safe = createMemo(() => L() >= MIN_OK)

  return (
    <div class="my-6 p-5 rounded-xl border border-zinc-800 bg-zinc-900/50">
      <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h4 class="font-bold text-emerald-400">Interactive: the wraparound trap</h4>
        <div class={`text-xs px-2 py-1 rounded ${safe() ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
          {safe() ? `L = ${L()} ≥ N+M−1 = ${MIN_OK}  ✓ no wrap` : `L = ${L()} < N+M−1 = ${MIN_OK}  ✗ WRAPAROUND`}
        </div>
      </div>

      <canvas
        ref={canvas}
        style={{ width: '100%', height: '300px' }}
        class="block bg-zinc-950 rounded-lg border border-zinc-800"
      />

      <label class="block mt-4 text-xs">
        <span class="text-zinc-400">FFT length L = {L()}  (need ≥ {MIN_OK} for linear)</span>
        <input
          type="range"
          min={32}
          max={128}
          step={1}
          value={L()}
          onInput={(e) => setL(parseInt(e.currentTarget.value))}
          class="w-full accent-emerald-400 mt-1"
        />
      </label>

      <p class="mt-3 text-xs text-zinc-500 leading-relaxed">
        Top: the correct linear convolution. Middle: the result of an FFT-multiply at
        chosen FFT length L (circular convolution). When <strong>L &lt; N + M − 1</strong>,
        the tail of the linear answer wraps around to the start — those red stems are
        sample energy appearing in <em>wrong</em> bins. Bottom: the difference, i.e. the
        ghost energy. Slide L up to {MIN_OK} and the wrap disappears. In radar this is a
        target appearing at the wrong range — indistinguishable from a real one.
      </p>
    </div>
  )
}

export default CircularVsLinearDemo
