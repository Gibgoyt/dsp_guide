import { createSignal, createMemo, For } from 'solid-js'
import type { Component } from 'solid-js'
import { dftNaive, realToComplex, cabs, carg, fmtNum, fmtComplex } from '../lib/fft'

/**
 * DFTByHand — type 4 or 8 real samples, see X[k] for every bin
 * computed as the literal sum  sum_n x[n] * e^{-j 2 pi k n / N},
 * along with |X[k]| and the phase.
 *
 * Presets give a few revealing inputs:
 *   - [1,0,-1,0]              pure cosine at fs/4  -> X[1] and X[3] nonzero
 *   - [1,1,1,1]               DC                   -> only X[0] nonzero
 *   - [1,0,0,0]               unit impulse         -> all X[k] = 1
 *   - cosine over 8 samples   shows two-sided spectrum
 */
const DFTByHand: Component = () => {
  const [N, setN] = createSignal(4)
  const [samples, setSamples] = createSignal<number[]>([1, 0, -1, 0])

  const onN = (newN: number) => {
    setN(newN)
    setSamples(new Array(newN).fill(0).map((_, i) => (i === 0 ? 1 : 0)))
  }

  const setSample = (i: number, v: number) => {
    const next = [...samples()]
    next[i] = v
    setSamples(next)
  }

  const presets: Record<string, { N: number; x: number[] }> = {
    'cosine fs/4 (N=4)': { N: 4, x: [1, 0, -1, 0] },
    'DC (N=4)':          { N: 4, x: [1, 1, 1, 1] },
    'impulse (N=4)':     { N: 4, x: [1, 0, 0, 0] },
    'cosine fs/8 (N=8)': { N: 8, x: [1, Math.SQRT1_2, 0, -Math.SQRT1_2, -1, -Math.SQRT1_2, 0, Math.SQRT1_2] },
    'impulse (N=8)':     { N: 8, x: [1, 0, 0, 0, 0, 0, 0, 0] },
  }

  const applyPreset = (name: string) => {
    const p = presets[name]
    if (!p) return
    setN(p.N)
    setSamples(p.x)
  }

  const X = createMemo(() => dftNaive(realToComplex(samples())))

  return (
    <div class="my-6 p-5 rounded-xl border border-zinc-800 bg-zinc-900/50">
      <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h4 class="font-bold text-cyan-400">Interactive: DFT By Hand</h4>
        <div class="flex gap-2 items-center text-xs">
          <label class="text-zinc-400">N</label>
          <button onClick={() => onN(4)} class={`px-2 py-1 rounded ${N() === 4 ? 'bg-cyan-500 text-black' : 'bg-zinc-800 text-zinc-300'}`}>4</button>
          <button onClick={() => onN(8)} class={`px-2 py-1 rounded ${N() === 8 ? 'bg-cyan-500 text-black' : 'bg-zinc-800 text-zinc-300'}`}>8</button>
        </div>
      </div>

      <div class="text-xs text-zinc-400 mb-2">Presets:</div>
      <div class="flex flex-wrap gap-2 mb-4">
        <For each={Object.keys(presets)}>
          {(name) => (
            <button onClick={() => applyPreset(name)} class="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300">
              {name}
            </button>
          )}
        </For>
      </div>

      <div class="text-xs text-zinc-400 mb-2">Input samples x[n]:</div>
      <div class={`grid gap-2 mb-4 ${N() === 4 ? 'grid-cols-4' : 'grid-cols-4 sm:grid-cols-8'}`}>
        <For each={samples()}>
          {(v, i) => (
            <label class="flex flex-col text-center">
              <span class="text-[10px] text-zinc-500">x[{i()}]</span>
              <input
                type="number"
                step={0.01}
                value={v}
                onInput={(e) => setSample(i(), parseFloat(e.currentTarget.value) || 0)}
                class="w-full text-center bg-zinc-950 border border-zinc-800 rounded px-1 py-1 text-sm text-cyan-300"
              />
            </label>
          )}
        </For>
      </div>

      <div class="text-xs text-zinc-400 mb-2">DFT output X[k]:</div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-zinc-500 border-b border-zinc-800">
              <th class="py-2 pr-3">k</th>
              <th class="py-2 pr-3">X[k]</th>
              <th class="py-2 pr-3">|X[k]|</th>
              <th class="py-2">∠X[k] (rad)</th>
            </tr>
          </thead>
          <tbody>
            <For each={X()}>
              {(z, k) => (
                <tr class="border-b border-zinc-900">
                  <td class="py-1.5 pr-3 text-zinc-500">{k()}</td>
                  <td class="py-1.5 pr-3 text-cyan-300 font-mono">{fmtComplex(z)}</td>
                  <td class="py-1.5 pr-3 text-zinc-300 font-mono">{fmtNum(cabs(z))}</td>
                  <td class="py-1.5 text-zinc-300 font-mono">{cabs(z) < 1e-10 ? '—' : fmtNum(carg(z))}</td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>

      <p class="mt-4 text-xs text-zinc-500 leading-relaxed">
        Each row is the literal sum  X[k] = Σ x[n] · e<sup>−j 2π k n / N</sup>.
        Try <em>cosine fs/4</em>: you'll see X[1] and X[3] are nonzero (a real cosine
        always has two-sided spectrum — k=1 is the positive frequency, k=3 = N−1 is its
        conjugate mirror). Try the <em>impulse</em>: all bins equal 1, which is the
        statement that a delta function contains every frequency equally.
      </p>
    </div>
  )
}

export default DFTByHand
