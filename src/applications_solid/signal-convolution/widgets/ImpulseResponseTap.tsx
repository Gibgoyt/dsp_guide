import { createSignal, createMemo, createEffect, onMount } from 'solid-js'
import type { Component } from 'solid-js'

/**
 * ImpulseResponseTap — "tap an LTI black box and read its fingerprint."
 *
 * The user picks an LTI system from a small menu (RC low-pass, room reverb,
 * comb echo, ideal differentiator). The widget displays:
 *   - left: the input — a single impulse delta[n]
 *   - right: the corresponding impulse response h[n]
 *
 * This makes the chapter's claim tangible: an LTI system IS its impulse
 * response. Two boxes with the same h[n] are indistinguishable.
 */
type SystemId = 'rc' | 'echo' | 'comb' | 'diff' | 'gauss'

const SYSTEMS: { id: SystemId; label: string; desc: string }[] = [
  { id: 'rc',    label: 'RC low-pass',     desc: 'h[n] = α·(1−α)ⁿ   — exponential decay.' },
  { id: 'echo',  label: 'Single echo',     desc: 'h[n] = δ[n] + 0.5·δ[n−40]   — direct plus reflection.' },
  { id: 'comb',  label: 'Comb (repeated echoes)', desc: 'h[n] = Σ 0.6ᵏ·δ[n−k·30]   — geometric echoes (reverb).' },
  { id: 'diff',  label: 'Differentiator',  desc: 'h[n] = δ[n] − δ[n−1]   — one-step difference.' },
  { id: 'gauss', label: 'Gaussian smoother', desc: 'h[n] = exp(−n²/2σ²) / Σ   — moving average with bell weighting.' },
]

const ImpulseResponseTap: Component = () => {
  const [sys, setSys] = createSignal<SystemId>('rc')
  let canvas: HTMLCanvasElement | undefined
  const N = 160

  const h = createMemo(() => {
    const arr = new Array<number>(N).fill(0)
    switch (sys()) {
      case 'rc': {
        const a = 0.08
        for (let n = 0; n < N; n++) arr[n] = a * Math.pow(1 - a, n)
        break
      }
      case 'echo': {
        arr[0] = 1
        arr[40] = 0.5
        break
      }
      case 'comb': {
        for (let k = 0; k < 5; k++) {
          const idx = k * 30
          if (idx < N) arr[idx] = Math.pow(0.6, k)
        }
        break
      }
      case 'diff': {
        arr[0] = 1
        arr[1] = -1
        break
      }
      case 'gauss': {
        const sigma = 6
        let sum = 0
        for (let n = 0; n < N; n++) {
          const x = n - 20
          arr[n] = Math.exp(-(x * x) / (2 * sigma * sigma))
          sum += arr[n]
        }
        for (let n = 0; n < N; n++) arr[n] /= sum
        break
      }
    }
    return arr
  })

  const draw = () => {
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = canvas.width
    const Hh = canvas.height
    ctx.clearRect(0, 0, W, Hh)

    const colW = W / 2
    const rowH = Hh

    // Left: impulse delta[n]
    {
      const yMid = rowH / 2
      ctx.strokeStyle = '#3f3f46'
      ctx.beginPath()
      ctx.moveTo(0, yMid)
      ctx.lineTo(colW, yMid)
      ctx.stroke()
      ctx.strokeStyle = '#34d399'
      ctx.fillStyle = '#34d399'
      ctx.lineWidth = 2
      const xs = colW / N
      ctx.beginPath()
      ctx.moveTo(xs * 0.5, yMid)
      ctx.lineTo(xs * 0.5, yMid - rowH / 2.4)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(xs * 0.5, yMid - rowH / 2.4, 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#a1a1aa'
      ctx.font = '11px monospace'
      ctx.fillText('input: δ[n] — a single tap', 8, 14)
    }

    // Vertical divider with arrow
    ctx.strokeStyle = '#52525b'
    ctx.beginPath()
    ctx.moveTo(colW, 0)
    ctx.lineTo(colW, Hh)
    ctx.stroke()
    ctx.fillStyle = '#a1a1aa'
    ctx.font = 'bold 14px sans-serif'
    ctx.fillText('→', colW - 6, Hh / 2 - 6)

    // Right: impulse response
    {
      const hv = h()
      const yMid = rowH / 2
      ctx.strokeStyle = '#3f3f46'
      ctx.beginPath()
      ctx.moveTo(colW, yMid)
      ctx.lineTo(W, yMid)
      ctx.stroke()

      const maxAbs = Math.max(0.05, ...hv.map((v) => Math.abs(v)))
      const xs = (W - colW) / N

      ctx.fillStyle = '#a78bfa'
      ctx.strokeStyle = '#a78bfa'
      ctx.lineWidth = 1.5

      for (let i = 0; i < N; i++) {
        const v = hv[i]
        if (v === 0) continue
        const px = colW + i * xs + xs / 2
        const py = yMid - (v / maxAbs) * (rowH / 2.4)
        ctx.beginPath()
        ctx.moveTo(px, yMid)
        ctx.lineTo(px, py)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(px, py, 2.5, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.fillStyle = '#a1a1aa'
      ctx.font = '11px monospace'
      ctx.fillText('output: h[n] — the system\'s fingerprint', colW + 8, 14)
    }
  }

  createEffect(() => {
    sys()
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

  const desc = createMemo(() => SYSTEMS.find((s) => s.id === sys())?.desc ?? '')

  return (
    <div class="my-6 p-5 rounded-xl border border-zinc-800 bg-zinc-900/50">
      <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h4 class="font-bold text-emerald-400">Interactive: Tap an LTI black box</h4>
      </div>

      <div class="flex flex-wrap gap-1 mb-3">
        {SYSTEMS.map((s) => (
          <button
            onClick={() => setSys(s.id)}
            class={`text-xs px-2 py-1 rounded ${sys() === s.id ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-300'}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <canvas
        ref={canvas}
        style={{ width: '100%', height: '180px' }}
        class="block bg-zinc-950 rounded-lg border border-zinc-800"
      />

      <p class="mt-3 text-xs text-zinc-500 leading-relaxed">
        {desc()} The impulse response is the LTI system's <em>complete description</em>: once you know h[n],
        the response to any input x[n] is just the convolution x[n] ∗ h[n]. Two black boxes with the same
        h[n] are mathematically indistinguishable, no matter how different their internals look.
      </p>
    </div>
  )
}

export default ImpulseResponseTap
