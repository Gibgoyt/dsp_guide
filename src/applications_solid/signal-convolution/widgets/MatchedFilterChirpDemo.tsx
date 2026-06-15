import { createSignal, createMemo, createEffect, onMount } from 'solid-js'
import type { Component } from 'solid-js'
import { lfmChirp, awgnComplex, delayComplex, matchedFilter, magComplex } from '../lib/conv'

/**
 * MatchedFilterChirpDemo — the radar capstone widget.
 *
 * A complex LFM chirp s[n] is transmitted. The received signal r[n] contains:
 *   - K target echoes (each at chosen delay = range bin, with chosen amplitude)
 *   - additive complex Gaussian noise at chosen SNR
 *
 * Plots three rows:
 *   1. The chirp template (real part) — the matched filter is
 *      conj(time-reversed) of this.
 *   2. The received signal (real part) — buried in noise; targets not visible.
 *   3. The magnitude of the matched-filter output — targets pop out as
 *      sharp peaks at exactly the right range bins.
 *
 * The dramatic before/after is the whole pedagogical point.
 */
interface Target {
  range: number
  amplitude: number
}

const MatchedFilterChirpDemo: Component = () => {
  const N = 512
  const N_CHIRP = 128
  const FS = 50e6
  const F0 = -10e6
  const F1 = 10e6
  const [snrDb, setSnrDb] = createSignal(-15)
  const [targets, setTargets] = createSignal<Target[]>([
    { range: 180, amplitude: 1.0 },
    { range: 320, amplitude: 0.6 },
  ])
  let canvas: HTMLCanvasElement | undefined

  const template = createMemo(() => lfmChirp(N_CHIRP, F0, F1, FS))

  const received = createMemo(() => {
    const out = new Array<{ re: number; im: number }>(N).fill(null as any).map(() => ({ re: 0, im: 0 }))
    const tmpl = template()
    for (const t of targets()) {
      const d = delayComplex(tmpl, t.range, N)
      for (let i = 0; i < N; i++) {
        out[i].re += t.amplitude * d[i].re
        out[i].im += t.amplitude * d[i].im
      }
    }
    return awgnComplex(out, snrDb())
  })

  const mfOut = createMemo(() => {
    const y = matchedFilter(received(), template())
    return magComplex(y)
  })

  const draw = () => {
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = canvas.width
    const Hh = canvas.height
    ctx.clearRect(0, 0, W, Hh)

    const rowH = Hh / 3

    const drawReal = (sig: { re: number }[], y0: number, color: string, label: string, range = sig.length) => {
      const yMid = y0 + rowH / 2
      ctx.strokeStyle = '#3f3f46'
      ctx.beginPath()
      ctx.moveTo(0, yMid)
      ctx.lineTo(W, yMid)
      ctx.stroke()
      const r = Math.min(range, sig.length)
      const xs = W / r
      const maxAbs = Math.max(0.2, ...sig.slice(0, r).map((z) => Math.abs(z.re)))
      ctx.strokeStyle = color
      ctx.lineWidth = 1.2
      ctx.beginPath()
      for (let i = 0; i < r; i++) {
        const py = yMid - (sig[i].re / maxAbs) * (rowH / 2.5)
        if (i === 0) ctx.moveTo(i * xs, py)
        else ctx.lineTo(i * xs, py)
      }
      ctx.stroke()
      ctx.fillStyle = '#a1a1aa'
      ctx.font = '11px monospace'
      ctx.fillText(label, 6, y0 + 14)
    }

    drawReal(template(), 0, '#a78bfa', 're{ s[n] } — transmitted LFM chirp (the template)', N_CHIRP)
    drawReal(received(), rowH, '#71717a', `re{ r[n] } — received echo + noise  (SNR ${snrDb()} dB)`, N)

    // Bottom row: matched-filter magnitude, with target locations marked
    {
      const yMid = 2 * rowH + rowH / 2
      ctx.strokeStyle = '#3f3f46'
      ctx.beginPath()
      ctx.moveTo(0, yMid)
      ctx.lineTo(W, yMid)
      ctx.stroke()
      const m = mfOut()
      const r = Math.min(N + N_CHIRP, m.length)
      const xs = W / r
      const maxAbs = Math.max(0.4, ...m.slice(0, r))
      // markers at injected target ranges (offset by N_CHIRP-1 because matched filter
      // peak from a delta at delay D appears at index D + (N_CHIRP-1))
      const peakOffset = N_CHIRP - 1
      for (const t of targets()) {
        const px = (t.range + peakOffset) * xs
        ctx.strokeStyle = '#ef4444'
        ctx.setLineDash([3, 3])
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(px, 2 * rowH)
        ctx.lineTo(px, 3 * rowH)
        ctx.stroke()
        ctx.setLineDash([])
      }
      ctx.strokeStyle = '#22d3ee'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      for (let i = 0; i < r; i++) {
        const py = yMid - (m[i] / maxAbs) * (rowH / 2.5)
        if (i === 0) ctx.moveTo(i * xs, py)
        else ctx.lineTo(i * xs, py)
      }
      ctx.stroke()
      ctx.fillStyle = '#a1a1aa'
      ctx.font = '11px monospace'
      ctx.fillText('|matched-filter output|  — peaks at injected target ranges (red dashes)', 6, 2 * rowH + 14)
    }
  }

  createEffect(() => {
    snrDb()
    targets()
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

  const removeTarget = (i: number) => {
    setTargets(targets().filter((_, j) => j !== i))
  }
  const addTarget = () => {
    if (targets().length >= 4) return
    setTargets([...targets(), { range: 80 + Math.floor(Math.random() * 200), amplitude: 0.5 + Math.random() * 0.5 }])
  }

  return (
    <div class="my-6 p-5 rounded-xl border border-zinc-800 bg-zinc-900/50">
      <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h4 class="font-bold text-emerald-400">Interactive: radar matched filter (LFM chirp + noisy echo)</h4>
        <button
          onClick={addTarget}
          class="text-xs px-2 py-1 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
        >+ target</button>
      </div>

      <canvas
        ref={canvas}
        style={{ width: '100%', height: '340px' }}
        class="block bg-zinc-950 rounded-lg border border-zinc-800"
      />

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <label class="text-xs">
          <span class="text-zinc-400">SNR = {snrDb()} dB  (input)</span>
          <input
            type="range"
            min={-30}
            max={10}
            step={1}
            value={snrDb()}
            onInput={(e) => setSnrDb(parseInt(e.currentTarget.value))}
            class="w-full accent-emerald-400 mt-1"
          />
        </label>

        <div class="text-xs">
          <span class="text-zinc-400">targets ({targets().length})</span>
          <div class="space-y-1 mt-1">
            {targets().map((t, i) => (
              <div class="flex items-center gap-2 text-zinc-300">
                <span class="font-mono">range={t.range}, amp={t.amplitude.toFixed(2)}</span>
                <button onClick={() => removeTarget(i)} class="text-red-400 hover:text-red-300">×</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p class="mt-3 text-xs text-zinc-500 leading-relaxed">
        Purple: the transmitted complex LFM chirp s[n], swept from {F0 / 1e6} MHz to {F1 / 1e6} MHz over {N_CHIRP} samples.
        Gray: the received signal — copies of the chirp delayed by each target's range, plus complex AWGN at the chosen SNR.
        Even at strongly negative input SNR the targets are <em>invisible</em> in the received row. Cyan: the magnitude of
        the matched-filter output (convolution with the conjugated, time-reversed template). Targets pop as sharp peaks at
        exactly the injected ranges (red dashes). That gain — peak SNR boosted by 10·log₁₀(N_chirp) dB, here {(10 * Math.log10(N_CHIRP)).toFixed(1)} dB — is
        the entire reason radar transmits long chirps and decodes them with matched filters.
      </p>
    </div>
  )
}

export default MatchedFilterChirpDemo
