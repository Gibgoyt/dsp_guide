import { createSignal, createMemo, createEffect, onMount, onCleanup, For, Show } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import type { Component } from 'solid-js'
import 'src/styles/global.css'
import { chapters, chapterBySlug, chapterIndex } from './chapters'

/**
 * Fourier Transform — a SolidJS single-page guide.
 *
 * URL routing (pushState only, no @solidjs/router):
 *   /fourier-transform              -> chapter 1
 *   /fourier-transform/<slug>       -> matching chapter; falls back to chapter 1
 *
 * Layout:
 *   - Top progress bar (% through the guide)
 *   - Sticky header with title + mobile hamburger
 *   - Left sidebar: chapter list, sticky on desktop, drawer on mobile
 *   - Main: current chapter + prev/next footer
 */
const ROOT = 'fourier-transform'

const App: Component = () => {
  const [slug, setSlug] = createSignal<string>(chapters[0].slug)
  const [isNavOpen, setIsNavOpen] = createSignal(false)

  const parseSlugFromPath = (): string => {
    if (typeof window === 'undefined') return chapters[0].slug
    const parts = window.location.pathname.split('/').filter(Boolean)
    if (parts[0] !== ROOT) return chapters[0].slug
    return parts[1] ?? chapters[0].slug
  }

  onMount(() => {
    document.documentElement.classList.add('dark')
    setSlug(parseSlugFromPath())

    const onPop = () => setSlug(parseSlugFromPath())
    window.addEventListener('popstate', onPop)
    onCleanup(() => window.removeEventListener('popstate', onPop))
  })

  const current = createMemo(() => chapterBySlug(slug()))
  const idx = createMemo(() => chapterIndex(current().slug))
  const total = chapters.length
  const progress = createMemo(() => ((idx() + 1) / total) * 100)

  const navigate = (newSlug: string) => {
    setSlug(newSlug)
    setIsNavOpen(false)
    const url = newSlug === chapters[0].slug ? `/${ROOT}` : `/${ROOT}/${newSlug}`
    window.history.pushState({}, '', url)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const prev = createMemo(() => (idx() > 0 ? chapters[idx() - 1] : null))
  const next = createMemo(() => (idx() < total - 1 ? chapters[idx() + 1] : null))

  return (
    <div class="min-h-screen bg-zinc-950 text-white">
      {/* Reading progress bar */}
      <div class="fixed top-0 left-0 right-0 z-50 h-1 bg-zinc-900">
        <div
          class="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300"
          style={{ width: `${progress()}%` }}
        />
      </div>

      {/* Header */}
      <header class="border-b border-zinc-800 sticky top-1 bg-zinc-950/95 backdrop-blur-sm z-40">
        <div class="px-4 py-3 flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={() => setIsNavOpen(true)}
            class="lg:hidden w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center"
            aria-label="Open chapters"
          >
            <svg class="w-5 h-5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <a href="/" class="flex items-center gap-2 mr-auto">
            <span class="text-cyan-400 font-bold">≋</span>
            <span class="font-bold">The Fourier Transform</span>
            <span class="text-zinc-500 text-xs hidden sm:inline">— a complete guide</span>
          </a>

          <div class="hidden sm:block text-xs text-zinc-500">
            Chapter <span class="text-cyan-400 font-mono">{idx() + 1}</span> / {total}
          </div>
        </div>
      </header>

      <div class="flex">
        {/* Sidebar — desktop sticky */}
        <aside class="hidden lg:block w-72 flex-shrink-0 border-r border-zinc-800 sticky top-14 self-start h-[calc(100vh-3.5rem)] overflow-y-auto">
          <ChapterList slug={slug()} onSelect={navigate} />
        </aside>

        {/* Sidebar — mobile drawer */}
        <Show when={isNavOpen()}>
          <div
            class="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsNavOpen(false)}
          />
          <aside class="lg:hidden fixed top-0 left-0 bottom-0 w-72 z-50 bg-zinc-950 border-r border-zinc-800 overflow-y-auto">
            <div class="p-3 flex justify-between items-center border-b border-zinc-800">
              <div class="text-sm font-bold text-cyan-400">Chapters</div>
              <button
                onClick={() => setIsNavOpen(false)}
                class="text-zinc-400 hover:text-white text-xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <ChapterList slug={slug()} onSelect={navigate} />
          </aside>
        </Show>

        {/* Main content */}
        <main class="flex-1 min-w-0">
          <div class="max-w-3xl mx-auto px-4 sm:px-8 py-10">
            <Dynamic component={current().Component} />

            {/* Prev / Next footer */}
            <div class="mt-16 pt-8 border-t border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Show when={prev()} fallback={<div />}>
                <button
                  onClick={() => navigate(prev()!.slug)}
                  class="text-left p-4 rounded-xl border border-zinc-800 hover:border-cyan-400 hover:bg-zinc-900/50 transition-all group"
                >
                  <div class="text-xs text-zinc-500 mb-1">← Previous</div>
                  <div class="font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {prev()!.title}
                  </div>
                </button>
              </Show>
              <Show when={next()} fallback={<div />}>
                <button
                  onClick={() => navigate(next()!.slug)}
                  class="text-right p-4 rounded-xl border border-zinc-800 hover:border-cyan-400 hover:bg-zinc-900/50 transition-all group sm:col-start-2"
                >
                  <div class="text-xs text-zinc-500 mb-1">Next →</div>
                  <div class="font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {next()!.title}
                  </div>
                </button>
              </Show>
            </div>

            <footer class="mt-16 pt-6 border-t border-zinc-900 text-center text-xs text-zinc-600">
              <p>
                Built as a study guide. The math is rigorous; the framing is opinionated.
              </p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  )
}

const ChapterList: Component<{ slug: string; onSelect: (slug: string) => void }> = (props) => {
  return (
    <nav class="p-3">
      <div class="text-xs uppercase tracking-wider text-zinc-500 px-2 mb-2">Chapters</div>
      <ul class="space-y-0.5">
        <For each={chapters}>
          {(ch, i) => {
            const isActive = () => ch.slug === props.slug
            return (
              <li>
                <button
                  onClick={() => props.onSelect(ch.slug)}
                  class={`w-full text-left px-2 py-2 rounded-lg text-sm transition-colors flex items-start gap-2 ${
                    isActive()
                      ? 'bg-cyan-500/10 text-cyan-300'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <span class={`font-mono text-xs mt-0.5 w-6 flex-shrink-0 ${isActive() ? 'text-cyan-400' : 'text-zinc-600'}`}>
                    {String(i() + 1).padStart(2, '0')}
                  </span>
                  <span class="leading-snug">{ch.shortTitle}</span>
                </button>
              </li>
            )
          }}
        </For>
      </ul>
    </nav>
  )
}

export default App
