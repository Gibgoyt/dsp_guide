import { createSignal, createEffect, onMount, For } from 'solid-js'
import type { Component } from 'solid-js'

/**
 * AdditiveSynth — pick amplitudes for harmonics 1..5 and watch
 * the resulting waveform redraw on a canvas.
 *
 * The "build a square wave" preset shows the classic odd-harmonic
 * 1, 1/3, 1/5, 1/7, ... decomposition that proves Fourier's claim:
 * any (well-behaved) periodic signal is a sum of sines and cosines.
 */
const AdditiveSynth: Component = () => {
  const [amps, setAmps] = createSignal<number[]>([1, 0, 0, 0, 0])
  let canvas: HTMLCanvasElement | undefined

  const setAmp = (i: number, v: number) => {
    const next = [...amps()]
    next[i] = v
    setAmps(next)
  }

  const presetSquare = () => setAmps([1, 0, 1 / 3, 0, 1 / 5])
  const presetSawtooth = () => setAmps([1, -1 / 2, 1 / 3, -1 / 4, 1 / 5])
  const presetFundamental = () => setAmps([1, 0, 0, 0, 0])
  const presetClear = () => setAmps([0, 0, 0, 0, 0])

  const draw = () => {
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = canvas.width
    const H = canvas.height
    ctx.clearRect(0, 0, W, H)

    // Axes
    ctx.strokeStyle = '#3f3f46'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, H / 2)
    ctx.lineTo(W, H / 2)
    ctx.stroke()

    // Individual harmonics (faint)
    const a = amps()
    const cycles = 2 // show 2 fundamental periods
    for (let h = 0; h < a.length; h++) {
      if (a[h] === 0) continue
      ctx.strokeStyle = `rgba(34,211,238,${0.15 + 0.05 * h})`
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let x = 0; x < W; x++) {
        const t = (x / W) * cycles
        const y = a[h] * Math.sin(2 * Math.PI * (h + 1) * t)
        const py = H / 2 - y * (H / 3)
        if (x === 0) ctx.moveTo(x, py)
        else ctx.lineTo(x, py)
      }
      ctx.stroke()
    }

    // Sum (bright)
    ctx.strokeStyle = '#22d3ee'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    for (let x = 0; x < W; x++) {
      const t = (x / W) * cycles
      let y = 0
      for (let h = 0; h < a.length; h++) {
        y += a[h] * Math.sin(2 * Math.PI * (h + 1) * t)
      }
      const py = H / 2 - y * (H / 3)
      if (x === 0) ctx.moveTo(x, py)
      else ctx.lineTo(x, py)
    }
    ctx.stroke()
  }

  createEffect(() => {
    amps()
    draw()
  })

  onMount(() => {
    if (canvas) {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      const ctx = canvas.getContext('2d')
      ctx?.scale(dpr, dpr)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      canvas.width = rect.width
      canvas.height = rect.height
    }
    draw()
  })

  return (
    <div class="my-6 p-5 rounded-xl border border-zinc-800 bg-zinc-900/50">
      <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h4 class="font-bold text-cyan-400">Interactive: Additive Synthesis</h4>
        <div class="flex gap-2 text-xs">
          <button onClick={presetFundamental} class="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300">Fundamental</button>
          <button onClick={presetSquare} class="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300">Square wave</button>
          <button onClick={presetSawtooth} class="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300">Sawtooth</button>
          <button onClick={presetClear} class="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300">Clear</button>
        </div>
      </div>

      <canvas
        ref={canvas}
        style={{ width: '100%', height: '220px' }}
        class="block bg-zinc-950 rounded-lg border border-zinc-800"
      />

      <div class="mt-4 grid grid-cols-1 sm:grid-cols-5 gap-3">
        <For each={amps()}>
          {(amp, i) => (
            <label class="flex flex-col gap-1 text-xs">
              <span class="text-zinc-400">
                Harmonic {i() + 1} <span class="text-cyan-400">{amp.toFixed(2)}</span>
              </span>
              <input
                type="range"
                min={-1}
                max={1}
                step={0.01}
                value={amp}
                onInput={(e) => setAmp(i(), parseFloat(e.currentTarget.value))}
                class="accent-cyan-400"
              />
            </label>
          )}
        </For>
      </div>

      <p class="mt-3 text-xs text-zinc-500 leading-relaxed">
        Faint cyan lines are individual sine harmonics; the bright line is their sum.
        Try the <em>Square wave</em> preset and notice how three sines (1st, 3rd, 5th
        harmonic at amplitudes 1, 1/3, 1/5) already start looking square. Add a 7th
        and 9th, and the corners get sharper. <strong>That</strong> is Fourier's claim.
      </p>
    </div>
  )
}

export default AdditiveSynth
