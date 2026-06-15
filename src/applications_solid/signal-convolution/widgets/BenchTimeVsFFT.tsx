import { createSignal, createEffect, onMount } from 'solid-js'
import type { Component } from 'solid-js'
import { convolveTime, convolveFFT } from '../lib/conv'

/**
 * BenchTimeVsFFT — measured runtime of time-domain convolution vs FFT-based
 * convolution at varying input lengths. Plots both curves on a log-log axis
 * so the O(N·M) slope and the O(N log N) slope are visually distinct, and
 * the crossover point sits where it should (~64 in pure JS).
 *
 * Runtimes are noisy in a browser — we average a few trials, but we don't
 * claim sub-microsecond accuracy. The shapes of the two curves are what
 * matters.
 */
const BenchTimeVsFFT: Component = () => {
  const [running, setRunning] = createSignal(false)
  const [results, setResults] = createSignal<{ N: number; tTime: number; tFft: number }[]>([])
  let canvas: HTMLCanvasElement | undefined

  const runBench = async () => {
    setRunning(true)
    setResults([])
    const Ns = [8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096]
    const res: { N: number; tTime: number; tFft: number }[] = []
    for (const N of Ns) {
      const x = new Array<number>(N).fill(0).map((_, i) => Math.sin(i * 0.1))
      const h = new Array<number>(N).fill(0).map((_, i) => Math.exp(-i / 10))

      // warmup
      convolveTime(x.slice(0, Math.min(N, 256)), h.slice(0, Math.min(N, 256)))
      convolveFFT(x, h)

      const trials = N <= 256 ? 8 : N <= 1024 ? 3 : 1
      let tt = 0
      let tf = 0
      // Time-domain timing
      for (let t = 0; t < trials; t++) {
        const t0 = performance.now()
        convolveTime(x, h)
        tt += performance.now() - t0
      }
      for (let t = 0; t < trials; t++) {
        const t0 = performance.now()
        convolveFFT(x, h)
        tf += performance.now() - t0
      }
      res.push({ N, tTime: tt / trials, tFft: tf / trials })
      setResults([...res])
      // Yield so UI updates
      await new Promise((r) => setTimeout(r, 0))
    }
    setRunning(false)
  }

  const draw = () => {
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = canvas.width
    const Hh = canvas.height
    ctx.clearRect(0, 0, W, Hh)

    const data = results()
    if (data.length < 2) {
      ctx.fillStyle = '#71717a'
      ctx.font = '12px monospace'
      ctx.fillText('Click "Run benchmark" to measure runtime vs N (log-log axes).', 16, Hh / 2)
      return
    }

    const PAD_L = 60
    const PAD_R = 20
    const PAD_T = 20
    const PAD_B = 36
    const plotW = W - PAD_L - PAD_R
    const plotH = Hh - PAD_T - PAD_B

    const logN = data.map((d) => Math.log10(d.N))
    const logTs = data.flatMap((d) => [Math.log10(Math.max(d.tTime, 1e-4)), Math.log10(Math.max(d.tFft, 1e-4))])
    const xMin = Math.min(...logN), xMax = Math.max(...logN)
    const yMin = Math.min(...logTs), yMax = Math.max(...logTs)

    const sx = (lx: number) => PAD_L + ((lx - xMin) / (xMax - xMin)) * plotW
    const sy = (ly: number) => PAD_T + (1 - (ly - yMin) / (yMax - yMin)) * plotH

    // Axes
    ctx.strokeStyle = '#3f3f46'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(PAD_L, PAD_T)
    ctx.lineTo(PAD_L, PAD_T + plotH)
    ctx.lineTo(PAD_L + plotW, PAD_T + plotH)
    ctx.stroke()

    // Tick labels (x)
    ctx.fillStyle = '#a1a1aa'
    ctx.font = '10px monospace'
    for (const d of data) {
      const x = sx(Math.log10(d.N))
      ctx.fillText(String(d.N), x - 10, PAD_T + plotH + 16)
    }
    ctx.fillText('N (log)', PAD_L + plotW / 2 - 20, PAD_T + plotH + 30)

    // Tick labels (y)
    for (let v = Math.floor(yMin); v <= Math.ceil(yMax); v++) {
      const y = sy(v)
      ctx.fillText(`10^${v} ms`, 4, y + 3)
      ctx.strokeStyle = '#27272a'
      ctx.beginPath()
      ctx.moveTo(PAD_L, y)
      ctx.lineTo(PAD_L + plotW, y)
      ctx.stroke()
    }

    // Time-domain curve (blue)
    const drawCurve = (vals: number[], color: string, label: string, yLabelY: number) => {
      ctx.strokeStyle = color
      ctx.fillStyle = color
      ctx.lineWidth = 2
      ctx.beginPath()
      for (let i = 0; i < data.length; i++) {
        const x = sx(Math.log10(data[i].N))
        const y = sy(Math.log10(Math.max(vals[i], 1e-4)))
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
      for (let i = 0; i < data.length; i++) {
        const x = sx(Math.log10(data[i].N))
        const y = sy(Math.log10(Math.max(vals[i], 1e-4)))
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.fillStyle = color
      ctx.font = 'bold 11px monospace'
      ctx.fillText(label, PAD_L + plotW - 110, yLabelY)
    }

    drawCurve(data.map((d) => d.tTime), '#22d3ee', 'time-domain O(N²)', PAD_T + 14)
    drawCurve(data.map((d) => d.tFft), '#fbbf24', 'FFT-multiply O(N log N)', PAD_T + 30)
  }

  createEffect(() => {
    results()
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
        <h4 class="font-bold text-emerald-400">Interactive: measured runtime vs N</h4>
        <button
          onClick={runBench}
          disabled={running()}
          class={`text-xs px-3 py-1 rounded ${running() ? 'bg-zinc-700 text-zinc-400' : 'bg-emerald-500 text-black font-bold'}`}
        >
          {running() ? 'Running…' : 'Run benchmark'}
        </button>
      </div>

      <canvas
        ref={canvas}
        style={{ width: '100%', height: '300px' }}
        class="block bg-zinc-950 rounded-lg border border-zinc-800"
      />

      <p class="mt-3 text-xs text-zinc-500 leading-relaxed">
        Cyan curve: direct time-domain convolution, both signals length N. Its slope on a
        log-log plot should be ≈ 2 (i.e. O(N²)). Amber curve: FFT-multiply convolution, with
        the FFTs pre-built each call. Its slope should be ≈ 1 (O(N log N)). Below some
        crossover N the constant-factor overhead of two FFTs dominates and the
        time-domain method wins; above it, FFT decisively pulls ahead. The crossover sits
        around N ≈ 64–128 in pure JavaScript and can be much lower in optimized C / GPU code.
      </p>
    </div>
  )
}

export default BenchTimeVsFFT
