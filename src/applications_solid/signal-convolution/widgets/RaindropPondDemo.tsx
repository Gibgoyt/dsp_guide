import { createSignal, createMemo, createEffect, onMount } from 'solid-js'
import type { Component } from 'solid-js'

/**
 * RaindropPondDemo — superposition view of convolution.
 *
 * The "pond" has a fixed impulse response h[n] (a damped sinusoid:
 * realistic-looking ripple). Each "raindrop" is an impulse at some
 * time delay with some amplitude. The total surface displacement is
 * the SUM of scaled, time-shifted copies of h[n] — which IS the
 * discrete convolution x[n] * h[n].
 *
 * The user drops impulses by clicking the timeline. The widget plots:
 *   - input x[n]: impulse train
 *   - h[n]: the pond's impulse response
 *   - y[n] = x * h: the observed surface
 */
interface Drop {
  time: number
  amplitude: number
}

const RaindropPondDemo: Component = () => {
  const N = 240
  const H_LEN = 80
  const [drops, setDrops] = createSignal<Drop[]>([
    { time: 30, amplitude: 1.0 },
    { time: 80, amplitude: 0.6 },
    { time: 140, amplitude: 0.9 },
  ])

  let canvas: HTMLCanvasElement | undefined

  // Damped sinusoid impulse response — "ripple"
  const h = createMemo(() => {
    const arr: number[] = new Array(H_LEN)
    for (let n = 0; n < H_LEN; n++) {
      arr[n] = Math.exp(-n / 25) * Math.sin((2 * Math.PI * n) / 14)
    }
    return arr
  })

  const x = createMemo(() => {
    const arr = new Array<number>(N).fill(0)
    for (const d of drops()) {
      if (d.time >= 0 && d.time < N) arr[d.time] = d.amplitude
    }
    return arr
  })

  const y = createMemo(() => {
    const xv = x()
    const hv = h()
    const out = new Array<number>(N).fill(0)
    for (let n = 0; n < N; n++) {
      let acc = 0
      for (let k = 0; k <= n && k < H_LEN; k++) {
        acc += hv[k] * xv[n - k]
      }
      out[n] = acc
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

    const rowH = Hh / 3

    const drawSig = (sig: number[], y0: number, color: string, label: string, isStem = false) => {
      const yMid = y0 + rowH / 2
      ctx.strokeStyle = '#3f3f46'
      ctx.beginPath()
      ctx.moveTo(0, yMid)
      ctx.lineTo(W, yMid)
      ctx.stroke()

      const maxAbs = Math.max(0.6, ...sig.map((v) => Math.abs(v)))
      const xs = W / sig.length

      ctx.fillStyle = color
      ctx.strokeStyle = color

      if (isStem) {
        // stems for impulses
        for (let i = 0; i < sig.length; i++) {
          if (sig[i] === 0) continue
          const px = i * xs + xs / 2
          const py = yMid - (sig[i] / maxAbs) * (rowH / 2.4)
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.moveTo(px, yMid)
          ctx.lineTo(px, py)
          ctx.stroke()
          ctx.beginPath()
          ctx.arc(px, py, 3, 0, Math.PI * 2)
          ctx.fill()
        }
      } else {
        // continuous line
        ctx.lineWidth = 1.5
        ctx.beginPath()
        for (let i = 0; i < sig.length; i++) {
          const px = i * xs
          const py = yMid - (sig[i] / maxAbs) * (rowH / 2.4)
          if (i === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.stroke()
      }

      ctx.fillStyle = '#a1a1aa'
      ctx.font = '11px monospace'
      ctx.fillText(label, 6, y0 + 14)
    }

    drawSig(x(), 0, '#34d399', 'x[n]  — raindrops (impulses)', true)

    // h[n] occupies a portion of the middle row
    const hv = h()
    const yMid = rowH + rowH / 2
    ctx.strokeStyle = '#3f3f46'
    ctx.beginPath()
    ctx.moveTo(0, yMid)
    ctx.lineTo(W, yMid)
    ctx.stroke()
    const maxH = Math.max(0.6, ...hv.map((v) => Math.abs(v)))
    const widthH = (W * H_LEN) / N
    const xsH = widthH / H_LEN
    ctx.strokeStyle = '#a78bfa'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    for (let i = 0; i < H_LEN; i++) {
      const px = i * xsH
      const py = yMid - (hv[i] / maxH) * (rowH / 2.4)
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
    ctx.fillStyle = '#a1a1aa'
    ctx.font = '11px monospace'
    ctx.fillText('h[n]  — pond impulse response (a single ripple)', 6, rowH + 14)

    drawSig(y(), 2 * rowH, '#22d3ee', 'y[n] = (x ∗ h)[n]  — pond surface')
  }

  createEffect(() => {
    drops()
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

  const handleClick = (e: MouseEvent) => {
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    if (py > canvas.height / 3) return // only the top row
    const time = Math.floor((px / rect.width) * N)
    const amplitude = 0.5 + Math.random() * 0.5
    setDrops([...drops(), { time, amplitude }])
  }

  return (
    <div class="my-6 p-5 rounded-xl border border-zinc-800 bg-zinc-900/50">
      <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h4 class="font-bold text-emerald-400">Interactive: Raindrops on a Pond</h4>
        <div class="flex gap-2">
          <button
            onClick={() => setDrops([])}
            class="text-xs px-2 py-1 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          >
            Clear
          </button>
          <button
            onClick={() => setDrops([
              { time: 30, amplitude: 1.0 },
              { time: 80, amplitude: 0.6 },
              { time: 140, amplitude: 0.9 },
            ])}
            class="text-xs px-2 py-1 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          >
            Reset
          </button>
        </div>
      </div>

      <canvas
        ref={canvas}
        onClick={handleClick}
        style={{ width: '100%', height: '320px', cursor: 'crosshair' }}
        class="block bg-zinc-950 rounded-lg border border-zinc-800"
      />

      <p class="mt-3 text-xs text-zinc-500 leading-relaxed">
        <strong>Click the top row</strong> to drop raindrops at different times and amplitudes. The
        pond's impulse response <span class="text-violet-400">h[n]</span> is a damped sinusoid —
        the ripple from a single drop. The bottom curve y[n] is built by <em>adding</em> shifted,
        scaled copies of h[n], one for each drop. That additive superposition <em>is</em> the
        discrete convolution: y[n] = Σₖ x[k]·h[n−k]. Drops {drops().length}.
      </p>

    </div>
  )
}

export default RaindropPondDemo
