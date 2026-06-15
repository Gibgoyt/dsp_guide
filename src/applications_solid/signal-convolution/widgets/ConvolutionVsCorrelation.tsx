import { createSignal, createMemo, createEffect, onMount } from 'solid-js'
import type { Component } from 'solid-js'

/**
 * ConvolutionVsCorrelation — side-by-side, single slider, two outputs.
 *
 * Same x and h, two operations:
 *   y_conv[n] = sum_k x[k] * h[n-k]
 *   y_corr[n] = sum_k x[k] * h[k-n]   (no flip on h)
 *
 * Visually show the flip / no-flip distinction. For an ASYMMETRIC h
 * (the chapter chooses a short ramp template), the two outputs are
 * obviously different, which is the whole point.
 */
const ConvolutionVsCorrelation: Component = () => {
  const N = 60
  const [n, setN] = createSignal(20)
  let canvas: HTMLCanvasElement | undefined

  // x: a rectangle. h: an asymmetric ramp [1,2,3,4,5,0,...] so the flip is visible.
  const x = createMemo(() => {
    const a = new Array<number>(N).fill(0)
    for (let i = 10; i < 25; i++) a[i] = 1
    return a
  })

  const h = createMemo(() => {
    const a = new Array<number>(N).fill(0)
    for (let i = 0; i < 8; i++) a[i + 5] = (i + 1) / 8
    return a
  })

  const yConv = createMemo(() => {
    const xa = x()
    const ha = h()
    const out = new Array<number>(2 * N).fill(0)
    for (let nn = 0; nn < 2 * N; nn++) {
      let acc = 0
      for (let k = 0; k < N; k++) {
        const j = nn - k
        if (j < 0 || j >= N) continue
        acc += xa[k] * ha[j]
      }
      out[nn] = acc
    }
    return out
  })

  const yCorr = createMemo(() => {
    const xa = x()
    const ha = h()
    const out = new Array<number>(2 * N).fill(0)
    for (let nn = 0; nn < 2 * N; nn++) {
      let acc = 0
      for (let k = 0; k < N; k++) {
        const j = k - (nn - N)
        if (j < 0 || j >= N) continue
        acc += xa[k] * ha[j]
      }
      out[nn] = acc
    }
    return out
  })

  const draw = () => {
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = canvas.width
    const Hh = canvas.height
    ctx.clearRect(0, 0, W, Hh)

    const nn = n()
    const rowH = Hh / 4

    const drawStem = (sig: number[], y0: number, color: string, label: string) => {
      const yMid = y0 + rowH / 2
      ctx.strokeStyle = '#3f3f46'
      ctx.beginPath()
      ctx.moveTo(0, yMid)
      ctx.lineTo(W, yMid)
      ctx.stroke()
      const maxAbs = Math.max(0.4, ...sig.map((v) => Math.abs(v)))
      const xs = W / sig.length
      ctx.fillStyle = color
      ctx.strokeStyle = color
      ctx.lineWidth = 1.2
      for (let i = 0; i < sig.length; i++) {
        if (sig[i] === 0) continue
        const px = i * xs + xs / 2
        const py = yMid - (sig[i] / maxAbs) * (rowH / 2.5)
        ctx.beginPath()
        ctx.moveTo(px, yMid)
        ctx.lineTo(px, py)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(px, py, 2, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.fillStyle = '#a1a1aa'
      ctx.font = '11px monospace'
      ctx.fillText(label, 6, y0 + 14)
    }

    // Row 1: x[k]
    drawStem(x(), 0, '#34d399', 'x[k]')

    // Row 2: h[n-k]   (flipped — convolution)
    const flipped = new Array<number>(N).fill(0)
    for (let k = 0; k < N; k++) {
      const j = nn - k
      if (j >= 0 && j < N) flipped[k] = h()[j]
    }
    drawStem(flipped, rowH, '#a78bfa', `h[n−k] (CONVOLUTION — flipped), n=${nn}`)

    // Row 3: h[k-n]   (not flipped — correlation)
    const noFlip = new Array<number>(N).fill(0)
    for (let k = 0; k < N; k++) {
      const j = k - (nn - N)
      if (j >= 0 && j < N) noFlip[k] = h()[j]
    }
    drawStem(noFlip, 2 * rowH, '#f59e0b', `h[k−n] (CORRELATION — not flipped), lag=${nn - N}`)

    // Row 4: both outputs at same axis (conv blue, corr orange)
    const yMid4 = 3 * rowH + rowH / 2
    ctx.strokeStyle = '#3f3f46'
    ctx.beginPath()
    ctx.moveTo(0, yMid4)
    ctx.lineTo(W, yMid4)
    ctx.stroke()
    const xs2 = W / yConv().length
    const maxV = Math.max(
      ...yConv().map((v) => Math.abs(v)),
      ...yCorr().map((v) => Math.abs(v)),
      0.4
    )

    // conv line
    ctx.strokeStyle = '#22d3ee'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    for (let i = 0; i < yConv().length; i++) {
      const py = yMid4 - (yConv()[i] / maxV) * (rowH / 2.5)
      if (i === 0) ctx.moveTo(i * xs2, py)
      else ctx.lineTo(i * xs2, py)
    }
    ctx.stroke()

    // corr line
    ctx.strokeStyle = '#fbbf24'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    for (let i = 0; i < yCorr().length; i++) {
      const py = yMid4 - (yCorr()[i] / maxV) * (rowH / 2.5)
      if (i === 0) ctx.moveTo(i * xs2, py)
      else ctx.lineTo(i * xs2, py)
    }
    ctx.stroke()

    // markers
    ctx.strokeStyle = '#22d3ee'
    ctx.setLineDash([3, 3])
    ctx.beginPath()
    ctx.moveTo(nn * xs2, 3 * rowH)
    ctx.lineTo(nn * xs2, 4 * rowH)
    ctx.stroke()
    ctx.setLineDash([])

    ctx.fillStyle = '#22d3ee'
    ctx.font = '11px monospace'
    ctx.fillText('y[n] = conv', 6, 3 * rowH + 14)
    ctx.fillStyle = '#fbbf24'
    ctx.fillText('y[lag] = corr', 90, 3 * rowH + 14)
  }

  createEffect(() => {
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
        <h4 class="font-bold text-emerald-400">Interactive: The flip — convolution vs. correlation</h4>
      </div>

      <canvas
        ref={canvas}
        style={{ width: '100%', height: '380px' }}
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

      <p class="mt-3 text-xs text-zinc-500 leading-relaxed">
        x[k] is a rectangle. h is an asymmetric <em>ramp</em> — so the flip is visible. The
        purple middle row is h flipped left-to-right (convolution); the orange row is h
        unflipped (correlation). Bottom row plots both outputs together: same input, same
        h, two different operations. <strong>Convolution</strong> answers "what does this
        LTI system do to this input?". <strong>Cross-correlation</strong> answers "how
        similar is the input to this template at every possible lag?". Same arithmetic
        machinery, opposite flip convention. Confuse them and your matched filter's range
        peaks land at the wrong bin.
      </p>
    </div>
  )
}

export default ConvolutionVsCorrelation
