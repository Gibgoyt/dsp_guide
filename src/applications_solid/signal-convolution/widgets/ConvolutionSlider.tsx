import { createSignal, createMemo, createEffect, onMount } from 'solid-js'
import type { Component } from 'solid-js'

/**
 * ConvolutionSlider — the canonical "slide, multiply, sum" animation.
 *
 * For a chosen pair of signals (rect∗rect, rect∗exp, two rects of different
 * width, etc.) shows three rows simultaneously:
 *   1. x[k] — fixed
 *   2. h[n-k] — flipped + shifted, slides with the slider
 *   3. y[n] — the running output; current shift is highlighted
 *
 * Below the canvas the widget shows the literal sum being computed
 * for the current shift: "y[n] = sum_k x[k]·h[n-k] = ..." so the
 * mechanical operation is fully visible.
 */
type Pair = 'rect-rect' | 'rect-rect-narrow' | 'rect-exp' | 'rect-triangle'

const ConvolutionSlider: Component = () => {
  const N = 60
  const [pair, setPair] = createSignal<Pair>('rect-rect')
  const [n, setN] = createSignal(20)
  let canvas: HTMLCanvasElement | undefined

  const sigs = createMemo<{ x: number[]; h: number[] }>(() => {
    const x = new Array<number>(N).fill(0)
    const h = new Array<number>(N).fill(0)
    switch (pair()) {
      case 'rect-rect': {
        for (let i = 8; i < 20; i++) x[i] = 1
        for (let i = 8; i < 20; i++) h[i] = 1
        break
      }
      case 'rect-rect-narrow': {
        for (let i = 8; i < 24; i++) x[i] = 1
        for (let i = 8; i < 14; i++) h[i] = 1
        break
      }
      case 'rect-exp': {
        for (let i = 8; i < 20; i++) x[i] = 1
        for (let i = 0; i < 25; i++) h[i + 8] = Math.exp(-i / 8)
        break
      }
      case 'rect-triangle': {
        for (let i = 8; i < 20; i++) x[i] = 1
        for (let i = 0; i < 12; i++) h[i + 8] = i < 6 ? i / 6 : (12 - i) / 6
        break
      }
    }
    return { x, h }
  })

  const y = createMemo(() => {
    const { x, h } = sigs()
    const out = new Array<number>(2 * N).fill(0)
    for (let nn = 0; nn < 2 * N; nn++) {
      let acc = 0
      for (let k = 0; k < N; k++) {
        const j = nn - k
        if (j < 0 || j >= N) continue
        acc += x[k] * h[j]
      }
      out[nn] = acc
    }
    return out
  })

  const yAtN = createMemo(() => {
    const { x, h } = sigs()
    const nn = n()
    const terms: { k: number; xk: number; hnk: number; prod: number }[] = []
    let total = 0
    for (let k = 0; k < N; k++) {
      const j = nn - k
      if (j < 0 || j >= N) continue
      const xk = x[k]
      const hnk = h[j]
      if (xk === 0 && hnk === 0) continue
      const p = xk * hnk
      total += p
      if (p !== 0) terms.push({ k, xk, hnk, prod: p })
    }
    return { terms, total }
  })

  const draw = () => {
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = canvas.width
    const Hh = canvas.height
    ctx.clearRect(0, 0, W, Hh)

    const { x, h } = sigs()
    const nn = n()
    const rowH = Hh / 3

    const drawStem = (
      sig: number[],
      y0: number,
      color: string,
      label: string,
      highlight?: (k: number) => boolean
    ) => {
      const yMid = y0 + rowH / 2
      ctx.strokeStyle = '#3f3f46'
      ctx.beginPath()
      ctx.moveTo(0, yMid)
      ctx.lineTo(W, yMid)
      ctx.stroke()

      const maxAbs = Math.max(0.4, ...sig.map((v) => Math.abs(v)))
      const xs = W / sig.length

      for (let i = 0; i < sig.length; i++) {
        if (sig[i] === 0) continue
        const px = i * xs + xs / 2
        const py = yMid - (sig[i] / maxAbs) * (rowH / 2.5)
        const hi = highlight && highlight(i)
        ctx.fillStyle = hi ? '#fbbf24' : color
        ctx.strokeStyle = hi ? '#fbbf24' : color
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

    // Top: x[k] — highlight indices where there's overlap with h[n-k]
    const xRange = (k: number) => {
      const j = nn - k
      return j >= 0 && j < N && h[j] !== 0 && x[k] !== 0
    }
    drawStem(x, 0, '#34d399', 'x[k]', xRange)

    // Middle: h[n-k] — built by mapping k -> h[n-k]
    const flipped = new Array<number>(N).fill(0)
    for (let k = 0; k < N; k++) {
      const j = nn - k
      if (j >= 0 && j < N) flipped[k] = h[j]
    }
    drawStem(flipped, rowH, '#a78bfa', `h[n−k], n=${nn}  (flipped & shifted)`, xRange)

    // Bottom: y[n], with red marker at current n
    const yOut = y()
    const yMid = 2 * rowH + rowH / 2
    ctx.strokeStyle = '#3f3f46'
    ctx.beginPath()
    ctx.moveTo(0, yMid)
    ctx.lineTo(W, yMid)
    ctx.stroke()
    const xs2 = W / yOut.length
    const maxY = Math.max(0.4, ...yOut.map((v) => Math.abs(v)))
    ctx.fillStyle = '#22d3ee'
    for (let i = 0; i < yOut.length; i++) {
      if (yOut[i] === 0) continue
      const py = yMid - (yOut[i] / maxY) * (rowH / 2.5)
      ctx.fillRect(i * xs2, py, Math.max(1.5, xs2 * 0.7), yMid - py)
    }
    // marker
    ctx.strokeStyle = '#ef4444'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(nn * xs2 + xs2 / 2, 2 * rowH)
    ctx.lineTo(nn * xs2 + xs2 / 2, 3 * rowH)
    ctx.stroke()

    ctx.fillStyle = '#a1a1aa'
    ctx.font = '11px monospace'
    ctx.fillText('y[n] = (x ∗ h)[n]', 6, 2 * rowH + 14)
  }

  createEffect(() => {
    pair()
    n()
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
        <h4 class="font-bold text-emerald-400">Interactive: Slide · Multiply · Sum</h4>
        <div class="flex flex-wrap gap-1 text-xs">
          <button onClick={() => setPair('rect-rect')}        class={`px-2 py-1 rounded ${pair() === 'rect-rect' ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-300'}`}>rect ∗ rect</button>
          <button onClick={() => setPair('rect-rect-narrow')} class={`px-2 py-1 rounded ${pair() === 'rect-rect-narrow' ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-300'}`}>wide ∗ narrow</button>
          <button onClick={() => setPair('rect-exp')}         class={`px-2 py-1 rounded ${pair() === 'rect-exp' ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-300'}`}>rect ∗ exp</button>
          <button onClick={() => setPair('rect-triangle')}    class={`px-2 py-1 rounded ${pair() === 'rect-triangle' ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-300'}`}>rect ∗ tri</button>
        </div>
      </div>

      <canvas
        ref={canvas}
        style={{ width: '100%', height: '320px' }}
        class="block bg-zinc-950 rounded-lg border border-zinc-800"
      />

      <label class="block mt-4 text-xs">
        <span class="text-zinc-400">Slide: n = {n()}</span>
        <input
          type="range"
          min={0}
          max={2 * N - 1}
          step={1}
          value={n()}
          onInput={(e) => setN(parseInt(e.currentTarget.value))}
          class="w-full accent-emerald-400 mt-1"
        />
      </label>

      <div class="mt-3 p-3 rounded-lg bg-zinc-950 border border-zinc-800">
        <div class="text-xs text-zinc-400 mb-1">For n = {n()}:</div>
        <div class="font-mono text-xs text-cyan-300 break-words leading-relaxed">
          y[{n()}] = Σₖ x[k]·h[{n()}−k] ={' '}
          {yAtN().terms.length === 0 ? (
            <span class="text-zinc-500">0  (no overlap)</span>
          ) : (
            <>
              {yAtN().terms.map((t, i) => (
                <>
                  {i > 0 ? ' + ' : ''}
                  <span class="text-yellow-300">{fmt(t.xk)}·{fmt(t.hnk)}</span>
                </>
              ))}
              {' = '}<span class="text-emerald-300">{fmt(yAtN().total)}</span>
            </>
          )}
        </div>
      </div>

      <p class="mt-3 text-xs text-zinc-500 leading-relaxed">
        Top: input x[k]. Middle: h[n−k], the second signal <em>flipped and shifted</em>. Yellow stems
        mark indices where both signals are non-zero — those are the only terms that contribute to the
        sum. Bottom: y[n] = (x∗h)[n], the convolution output. The red line shows the current shift.
        Slide a rectangle past itself: you build a <strong>triangle</strong>. That's the textbook result,
        and you can read off each y[n] as the literal sum of products above.
      </p>
    </div>
  )
}

const fmt = (v: number) => {
  if (Math.abs(v) < 1e-6) return '0'
  return v.toFixed(2).replace(/\.?0+$/, '') || '0'
}

export default ConvolutionSlider
