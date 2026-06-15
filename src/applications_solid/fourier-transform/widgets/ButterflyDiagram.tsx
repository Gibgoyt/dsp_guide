import { createSignal, For, Show } from 'solid-js'
import type { Component } from 'solid-js'

/**
 * ButterflyDiagram — SVG visualization of the 8-point radix-2 FFT.
 *
 * Three stages:
 *   Stage 1: 4 butterflies of size 2 (twiddles = W_8^0)
 *   Stage 2: 4 butterflies of size 4 (twiddles = W_8^0, W_8^2)
 *   Stage 3: 4 butterflies of size 8 (twiddles = W_8^0, W_8^1, W_8^2, W_8^3)
 *
 * Inputs are bit-reversal permuted: 0,4,2,6,1,5,3,7
 * Outputs are in natural order: 0,1,2,3,4,5,6,7
 */
const ButterflyDiagram: Component = () => {
  const [hoveredEdge, setHoveredEdge] = createSignal<{ stage: number; k: number } | null>(null)

  const N = 8
  const stages = 3
  const xStart = 60
  const xEnd = 540
  const stageGap = (xEnd - xStart) / stages
  const yTop = 30
  const yBot = 470
  const rowGap = (yBot - yTop) / (N - 1)

  const yOf = (row: number) => yTop + row * rowGap
  const xOf = (stage: number) => xStart + stage * stageGap

  const bitRev = [0, 4, 2, 6, 1, 5, 3, 7]

  // For each stage, list the butterfly pairs (top index, bottom index, twiddle k)
  // Stage `s` (1..3) has butterflies of size 2^s
  const butterflies = (s: number) => {
    const size = 1 << s
    const half = size / 2
    const pairs: { top: number; bot: number; k: number }[] = []
    for (let group = 0; group < N; group += size) {
      for (let j = 0; j < half; j++) {
        pairs.push({ top: group + j, bot: group + j + half, k: j * (N / size) })
      }
    }
    return pairs
  }

  const stageData = [1, 2, 3].map((s) => ({ stage: s, pairs: butterflies(s) }))

  const twiddleLabel = (k: number) => (k === 0 ? 'W₈⁰ = 1' : `W₈${supScript(k)}`)

  function supScript(n: number): string {
    const map: Record<string, string> = {
      '0': '⁰', '1': '¹', '2': '²', '3': '³',
      '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷',
    }
    return n
      .toString()
      .split('')
      .map((d) => map[d] ?? d)
      .join('')
  }

  return (
    <div class="my-6 p-5 rounded-xl border border-zinc-800 bg-zinc-900/50">
      <div class="flex items-center justify-between mb-4">
        <h4 class="font-bold text-cyan-400">Interactive: 8-Point FFT Butterfly Diagram</h4>
        <Show when={hoveredEdge()}>
          <div class="text-xs font-mono text-cyan-300">
            Stage {hoveredEdge()!.stage} • twiddle {twiddleLabel(hoveredEdge()!.k)}
          </div>
        </Show>
      </div>

      <div class="overflow-x-auto">
        <svg viewBox="0 0 600 500" class="w-full" style={{ 'min-width': '500px' }}>
          {/* Stage labels */}
          <text x={xOf(0) - 30} y={20} fill="#71717a" font-size="11">Input</text>
          <text x={xOf(1) - 18} y={20} fill="#71717a" font-size="11">Stage 1</text>
          <text x={xOf(2) - 18} y={20} fill="#71717a" font-size="11">Stage 2</text>
          <text x={xOf(3) - 18} y={20} fill="#71717a" font-size="11">Stage 3</text>
          <text x={xOf(3) + 12} y={20} fill="#71717a" font-size="11">Output</text>

          {/* Input labels (bit-reversed order) */}
          <For each={bitRev}>
            {(orig, row) => (
              <>
                <text x={xOf(0) - 38} y={yOf(row()) + 4} fill="#a1a1aa" font-size="12" font-family="monospace">
                  x[{orig}]
                </text>
                <circle cx={xOf(0)} cy={yOf(row())} r="3" fill="#52525b" />
              </>
            )}
          </For>

          {/* Output labels */}
          <For each={[0, 1, 2, 3, 4, 5, 6, 7]}>
            {(k, row) => (
              <>
                <circle cx={xOf(3)} cy={yOf(row())} r="3" fill="#22d3ee" />
                <text x={xOf(3) + 12} y={yOf(row()) + 4} fill="#22d3ee" font-size="12" font-family="monospace">
                  X[{k}]
                </text>
              </>
            )}
          </For>

          {/* Butterfly edges for each stage */}
          <For each={stageData}>
            {({ stage, pairs }) => (
              <For each={pairs}>
                {(p) => {
                  const x1 = xOf(stage - 1)
                  const x2 = xOf(stage)
                  const yt = yOf(p.top)
                  const yb = yOf(p.bot)
                  const isHovered = () =>
                    hoveredEdge()?.stage === stage && hoveredEdge()?.k === p.k
                  const stroke = () => (isHovered() ? '#22d3ee' : '#3f3f46')
                  const strokeWidth = () => (isHovered() ? 2 : 1)
                  return (
                    <g
                      onMouseEnter={() => setHoveredEdge({ stage, k: p.k })}
                      onMouseLeave={() => setHoveredEdge(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      <line x1={x1} y1={yt} x2={x2} y2={yt} stroke={stroke()} stroke-width={strokeWidth()} />
                      <line x1={x1} y1={yb} x2={x2} y2={yb} stroke={stroke()} stroke-width={strokeWidth()} />
                      <line x1={x1} y1={yt} x2={x2} y2={yb} stroke={stroke()} stroke-width={strokeWidth()} />
                      <line x1={x1} y1={yb} x2={x2} y2={yt} stroke={stroke()} stroke-width={strokeWidth()} />
                      <circle cx={x2} cy={yt} r="3" fill="#71717a" />
                      <circle cx={x2} cy={yb} r="3" fill="#71717a" />
                      <text
                        x={(x1 + x2) / 2}
                        y={(yt + yb) / 2 - 4}
                        fill={isHovered() ? '#22d3ee' : '#71717a'}
                        font-size="9"
                        text-anchor="middle"
                        font-family="monospace"
                      >
                        {twiddleLabel(p.k)}
                      </text>
                    </g>
                  )
                }}
              </For>
            )}
          </For>
        </svg>
      </div>

      <p class="mt-3 text-xs text-zinc-500 leading-relaxed">
        Hover any butterfly to see its twiddle factor. The inputs on the left are in
        <em> bit-reversed </em>order — x[0], x[4], x[2], x[6], x[1], x[5], x[3], x[7] —
        because that's the natural order produced by repeatedly splitting "even index"
        from "odd index". Each stage doubles the butterfly size and uses twiddles
        W₈<sup>k</sup> = e<sup>−j2πk/8</sup>. Three stages, 4 butterflies each = 12
        butterflies total. Compare to the naive DFT: 64 complex multiplies. That's the
        log₂N speedup made concrete.
      </p>
    </div>
  )
}

export default ButterflyDiagram
