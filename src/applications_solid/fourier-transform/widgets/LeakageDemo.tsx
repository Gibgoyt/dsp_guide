import { createSignal, createMemo, createEffect, onMount, For } from 'solid-js'
import type { Component } from 'solid-js'
import {
  fftRadix2,
  realToComplex,
  magnitudeSpectrum,
  applyWindow,
  window as makeWindow,
} from '../lib/fft'
import type { WindowType } from '../lib/fft'

/**
 * LeakageDemo — Pick a sinusoid frequency (as a fractional bin position)
 * and a window function. See the time-domain signal (top) and the magnitude
 * spectrum (bottom) update live.
 *
 * On-bin frequency  (e.g. 8.0) gives a clean single-bin spike.
 * Off-bin frequency (e.g. 8.5) smears energy across many bins -- leakage.
 * A non-rectangular window suppresses the side lobes at the cost of widening
 * the main lobe.
 */
const N = 256

const LeakageDemo: Component = () => {
  const [freqBin, setFreqBin] = createSignal(8.5) // fractional bin
  const [winType, setWinType] = createSignal<WindowType>('rect')

  let timeCanvas: HTMLCanvasElement | undefined
  let specCanvas: HTMLCanvasElement | undefined

  const signal = createMemo(() => {
    const f = freqBin()
    const x = new Array<number>(N)
    for (let n = 0; n < N; n++) {
      x[n] = Math.cos((2 * Math.PI * f * n) / N)
    }
    return x
  })

  const windowed = createMemo(() => applyWindow(signal(), makeWindow(winType(), N)))

  const spectrum = createMemo(() => {
    const X = fftRadix2(realToComplex(windowed()))
    return magnitudeSpectrum(X)
  })

  const drawTime = () => {
    if (!timeCanvas) return
    const ctx = timeCanvas.getContext('2d')
    if (!ctx) return
    const W = timeCanvas.width
    const H = timeCanvas.height
    ctx.clearRect(0, 0, W, H)

    // Axis
    ctx.strokeStyle = '#3f3f46'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, H / 2)
    ctx.lineTo(W, H / 2)
    ctx.stroke()

    // Window envelope (faint)
    const w = makeWindow(winType(), N)
    ctx.strokeStyle = 'rgba(168,85,247,0.4)'
    ctx.beginPath()
    for (let n = 0; n < N; n++) {
      const x = (n / (N - 1)) * W
      const y = H / 2 - w[n] * (H / 2.4)
      if (n === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
    ctx.beginPath()
    for (let n = 0; n < N; n++) {
      const x = (n / (N - 1)) * W
      const y = H / 2 + w[n] * (H / 2.4)
      if (n === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // Windowed signal (bright)
    const wd = windowed()
    ctx.strokeStyle = '#22d3ee'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    for (let n = 0; n < N; n++) {
      const x = (n / (N - 1)) * W
      const y = H / 2 - wd[n] * (H / 2.4)
      if (n === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  const drawSpec = () => {
    if (!specCanvas) return
    const ctx = specCanvas.getContext('2d')
    if (!ctx) return
    const W = specCanvas.width
    const H = specCanvas.height
    ctx.clearRect(0, 0, W, H)

    const mag = spectrum()
    const half = N / 2
    // Use dB scale: 20 log10(|X|/max)
    const max = Math.max(...mag.slice(0, half))
    const dB = mag.slice(0, half).map((v) => 20 * Math.log10(Math.max(v / max, 1e-10)))
    const floor = -80 // dB display floor

    // Axis lines
    ctx.strokeStyle = '#3f3f46'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, H - 1)
    ctx.lineTo(W, H - 1)
    ctx.stroke()

    // dB gridlines every 20 dB
    ctx.strokeStyle = '#27272a'
    ctx.fillStyle = '#52525b'
    ctx.font = '10px monospace'
    for (let db = 0; db >= floor; db -= 20) {
      const y = H - ((db - floor) / -floor) * H
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(W, y)
      ctx.stroke()
      ctx.fillText(`${db} dB`, 4, y - 2)
    }

    // Spectrum bars
    ctx.fillStyle = '#22d3ee'
    const barW = W / half
    for (let k = 0; k < half; k++) {
      const h = ((dB[k] - floor) / -floor) * H
      ctx.fillRect(k * barW, H - h, Math.max(1, barW - 0.5), h)
    }

    // Mark the true frequency
    const fx = (freqBin() / half) * W
    ctx.strokeStyle = '#a855f7'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 3])
    ctx.beginPath()
    ctx.moveTo(fx, 0)
    ctx.lineTo(fx, H)
    ctx.stroke()
    ctx.setLineDash([])
  }

  createEffect(() => {
    signal()
    winType()
    drawTime()
    drawSpec()
  })

  onMount(() => {
    const setup = (c: HTMLCanvasElement | undefined) => {
      if (!c) return
      const rect = c.getBoundingClientRect()
      c.width = rect.width
      c.height = rect.height
    }
    setup(timeCanvas)
    setup(specCanvas)
    drawTime()
    drawSpec()
  })

  const onBin = createMemo(() => Math.abs(freqBin() - Math.round(freqBin())) < 1e-6)

  return (
    <div class="my-6 p-5 rounded-xl border border-zinc-800 bg-zinc-900/50">
      <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h4 class="font-bold text-cyan-400">Interactive: Windowing &amp; Spectral Leakage</h4>
        <div class="text-xs text-zinc-400">
          N = {N} • Frequency = <span class="font-mono text-cyan-300">{freqBin().toFixed(2)} bins</span>
          {' '}({onBin() ? <span class="text-green-400">on-bin</span> : <span class="text-amber-400">off-bin</span>})
        </div>
      </div>

      <div class="text-xs text-zinc-400 mb-1">Windowed signal (cyan), window envelope (purple):</div>
      <canvas
        ref={timeCanvas}
        style={{ width: '100%', height: '140px' }}
        class="block bg-zinc-950 rounded-lg border border-zinc-800 mb-4"
      />

      <div class="text-xs text-zinc-400 mb-1">Magnitude spectrum (dB, 0 = peak), purple dashed line = true frequency:</div>
      <canvas
        ref={specCanvas}
        style={{ width: '100%', height: '180px' }}
        class="block bg-zinc-950 rounded-lg border border-zinc-800"
      />

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <label class="text-xs">
          <span class="text-zinc-400">Frequency (bins)</span>
          <input
            type="range"
            min={1}
            max={N / 2 - 1}
            step={0.05}
            value={freqBin()}
            onInput={(e) => setFreqBin(parseFloat(e.currentTarget.value))}
            class="w-full accent-cyan-400 mt-1"
          />
          <div class="flex gap-2 mt-1 text-[10px]">
            <button onClick={() => setFreqBin(8)} class="px-2 py-0.5 bg-zinc-800 rounded">on-bin (8.0)</button>
            <button onClick={() => setFreqBin(8.5)} class="px-2 py-0.5 bg-zinc-800 rounded">off-bin (8.5)</button>
          </div>
        </label>

        <label class="text-xs">
          <span class="text-zinc-400">Window</span>
          <select
            value={winType()}
            onChange={(e) => setWinType(e.currentTarget.value as WindowType)}
            class="w-full mt-1 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-cyan-300"
          >
            <option value="rect">Rectangular (none)</option>
            <option value="hann">Hann</option>
            <option value="hamming">Hamming</option>
            <option value="blackman">Blackman</option>
          </select>
        </label>
      </div>

      <p class="mt-3 text-xs text-zinc-500 leading-relaxed">
        Slide the frequency exactly onto an integer bin and the spectrum is a single
        clean spike — the cosine fits a whole number of cycles in the window.
        Move it off-bin and watch energy leak across many bins (rectangular window
        side-lobes only fall ~13 dB). Switch to Hann or Blackman and the side lobes
        collapse, but the main lobe widens. Every windowing choice in DSP is some
        version of <em>this</em> trade.
      </p>
    </div>
  )
}

export default LeakageDemo
