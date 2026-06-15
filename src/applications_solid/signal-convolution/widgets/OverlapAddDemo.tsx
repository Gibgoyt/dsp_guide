import { createSignal, createMemo, createEffect, onMount } from 'solid-js'
import type { Component } from 'solid-js'
import { convolveTime, overlapAdd } from '../lib/conv'

/**
 * OverlapAddDemo — split a long x into blocks, convolve each with h,
 * and add the tails to reconstruct the full linear convolution.
 *
 * Plots:
 *   Row 1: full x[n] with block boundaries marked.
 *   Row 2: each block's partial output, stacked (showing the M-1 tail
 *          of one block extending into the next block's window).
 *   Row 3: the summed output overlaid with the true full-length linear
 *          convolution — they should be bit-identical.
 */
const OverlapAddDemo: Component = () => {
  const N = 200
  const M = 20
  const [L, setL] = createSignal(40) // block size
  let canvas: HTMLCanvasElement | undefined

  const x = createMemo(() => {
    const a = new Array<number>(N).fill(0)
    for (let i = 0; i < N; i++) a[i] = Math.sin(i * 0.18) + 0.3 * Math.sin(i * 0.55)
    return a
  })

  const h = createMemo(() => {
    const a = new Array<number>(M).fill(0)
    for (let i = 0; i < M; i++) a[i] = Math.exp(-i / 6)
    const s = a.reduce((a, b) => a + b, 0)
    return a.map((v) => v / s)
  })

  const blocks = createMemo(() => {
    const xa = x()
    const ha = h()
    const out: { start: number; partial: number[] }[] = []
    for (let s = 0; s < N; s += L()) {
      const block = xa.slice(s, Math.min(s + L(), N))
      out.push({ start: s, partial: convolveTime(block, ha) })
    }
    return out
  })

  const yOA = createMemo(() => overlapAdd(x(), h(), L()))
  const yRef = createMemo(() => convolveTime(x(), h()))

  const err = createMemo(() => {
    let m = 0
    const a = yOA()
    const b = yRef()
    for (let i = 0; i < a.length; i++) m = Math.max(m, Math.abs(a[i] - b[i]))
    return m
  })

  const COLORS = ['#22d3ee', '#a78bfa', '#fbbf24', '#34d399', '#f472b6', '#fb7185']

  const draw = () => {
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = canvas.width
    const Hh = canvas.height
    ctx.clearRect(0, 0, W, Hh)

    const rowH = Hh / 3

    // Row 1: x with vertical lines at block boundaries
    {
      const xa = x()
      const yMid = rowH / 2
      ctx.strokeStyle = '#3f3f46'
      ctx.beginPath()
      ctx.moveTo(0, yMid)
      ctx.lineTo(W, yMid)
      ctx.stroke()
      const xs = W / N
      const maxAbs = Math.max(0.4, ...xa.map((v) => Math.abs(v)))

      // boundaries
      ctx.strokeStyle = '#52525b'
      ctx.setLineDash([3, 3])
      for (let s = 0; s < N; s += L()) {
        ctx.beginPath()
        ctx.moveTo(s * xs, 0)
        ctx.lineTo(s * xs, rowH)
        ctx.stroke()
      }
      ctx.setLineDash([])

      ctx.strokeStyle = '#a1a1aa'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      for (let i = 0; i < N; i++) {
        const py = yMid - (xa[i] / maxAbs) * (rowH / 2.5)
        if (i === 0) ctx.moveTo(i * xs, py)
        else ctx.lineTo(i * xs, py)
      }
      ctx.stroke()

      ctx.fillStyle = '#a1a1aa'
      ctx.font = '11px monospace'
      ctx.fillText(`x[n]  — N=${N}, block size L=${L()}, h length M=${M}`, 6, 14)
    }

    // Row 2: each block's partial convolution drawn at block.start..block.start+L+M-1
    {
      const yMid = rowH + rowH / 2
      ctx.strokeStyle = '#3f3f46'
      ctx.beginPath()
      ctx.moveTo(0, yMid)
      ctx.lineTo(W, yMid)
      ctx.stroke()
      const xs = W / (N + M - 1)

      const bks = blocks()
      const maxAbs = Math.max(0.4, ...bks.flatMap((b) => b.partial.map((v) => Math.abs(v))))
      for (let bi = 0; bi < bks.length; bi++) {
        const b = bks[bi]
        const color = COLORS[bi % COLORS.length]
        ctx.strokeStyle = color
        ctx.fillStyle = color
        ctx.lineWidth = 1.2
        ctx.beginPath()
        for (let i = 0; i < b.partial.length; i++) {
          const px = (b.start + i) * xs
          const py = yMid - (b.partial[i] / maxAbs) * (rowH / 2.6)
          if (i === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.stroke()
      }
      ctx.fillStyle = '#a1a1aa'
      ctx.font = '11px monospace'
      ctx.fillText('per-block partials  — note each tail extends M−1 samples past its block', 6, rowH + 14)
    }

    // Row 3: summed output vs reference
    {
      const yMid = 2 * rowH + rowH / 2
      ctx.strokeStyle = '#3f3f46'
      ctx.beginPath()
      ctx.moveTo(0, yMid)
      ctx.lineTo(W, yMid)
      ctx.stroke()

      const out = yOA()
      const ref = yRef()
      const maxAbs = Math.max(0.4, ...out.map((v) => Math.abs(v)), ...ref.map((v) => Math.abs(v)))
      const xs = W / out.length

      // reference (dashed)
      ctx.strokeStyle = '#71717a'
      ctx.setLineDash([4, 3])
      ctx.lineWidth = 1.5
      ctx.beginPath()
      for (let i = 0; i < ref.length; i++) {
        const py = yMid - (ref[i] / maxAbs) * (rowH / 2.6)
        if (i === 0) ctx.moveTo(i * xs, py)
        else ctx.lineTo(i * xs, py)
      }
      ctx.stroke()
      ctx.setLineDash([])

      ctx.strokeStyle = '#22d3ee'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      for (let i = 0; i < out.length; i++) {
        const py = yMid - (out[i] / maxAbs) * (rowH / 2.6)
        if (i === 0) ctx.moveTo(i * xs, py)
        else ctx.lineTo(i * xs, py)
      }
      ctx.stroke()

      ctx.fillStyle = '#a1a1aa'
      ctx.font = '11px monospace'
      ctx.fillText(`overlap-add output (cyan) vs full linear convolution (dashed)  — max err = ${err().toExponential(2)}`, 6, 2 * rowH + 14)
    }
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

  return (
    <div class="my-6 p-5 rounded-xl border border-zinc-800 bg-zinc-900/50">
      <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h4 class="font-bold text-emerald-400">Interactive: overlap-add block convolution</h4>
      </div>

      <canvas
        ref={canvas}
        style={{ width: '100%', height: '340px' }}
        class="block bg-zinc-950 rounded-lg border border-zinc-800"
      />

      <label class="block mt-4 text-xs">
        <span class="text-zinc-400">Block size L = {L()}</span>
        <input
          type="range"
          min={10}
          max={80}
          step={2}
          value={L()}
          onInput={(e) => setL(parseInt(e.currentTarget.value))}
          class="w-full accent-emerald-400 mt-1"
        />
      </label>

      <p class="mt-3 text-xs text-zinc-500 leading-relaxed">
        x[n] is partitioned into non-overlapping blocks (dashed lines). Each block is
        convolved with h independently, producing a partial output that's L + M − 1 long —
        notice each block's partial extends past its window by M − 1 samples. Summing
        those overlapping tails (in the "add" step) reconstructs the full linear
        convolution. The dashed gray line is the reference single-shot convolution; the
        cyan line is the overlap-add result. They overlap perfectly — overlap-add is
        mathematically exact, not an approximation.
      </p>
    </div>
  )
}

export default OverlapAddDemo
