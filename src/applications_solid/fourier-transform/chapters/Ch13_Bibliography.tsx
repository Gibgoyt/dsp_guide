import type { Component, JSX } from 'solid-js'
import { For, Show } from 'solid-js'

interface YouTubeVideo {
  id: string
  title: string
  channel: string
  description?: string
  duration?: string
  timestamp?: number
}

interface Paper {
  title: string
  authors: string
  arxivId?: string
  abstract: string
  url: string
  year?: string
}

interface Repo {
  owner: string
  name: string
  description: string
  url: string
  language?: string
  stars?: string
}

const videos: YouTubeVideo[] = [
  {
    id: 'XJw92w5u13c',
    title: 'The Fourier Transform — visual explainer',
    channel: 'YouTube',
    description:
      'The orchestra-into-a-prism metaphor, the history of Fourier and Cooley–Tukey, and why the FFT is the engine inside every MP3 player, MRI machine, and Wi-Fi router.',
    timestamp: 956,
  },
]

const papers: Paper[] = []

const repos: Repo[] = []

const YouTubeLogo: Component = () => (
  <svg viewBox="0 0 24 24" class="w-6 h-6" fill="currentColor" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

const ArxivLogo: Component = () => (
  <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M4 4l8 16" />
    <path d="M20 4L8 20" />
    <path d="M14 4h6" />
    <path d="M4 20h6" />
  </svg>
)

const GitHubLogo: Component = () => (
  <svg viewBox="0 0 24 24" class="w-6 h-6" fill="currentColor" aria-hidden="true">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
)

const SectionHeader: Component<{
  icon: JSX.Element
  label: string
  accent: string
}> = (props) => (
  <div class="flex items-center gap-3 mb-5">
    <div class={`flex items-center justify-center w-10 h-10 rounded-lg ${props.accent}`}>
      {props.icon}
    </div>
    <h3 class="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold m-0">
      {props.label}
    </h3>
    <div class="flex-1 h-px bg-zinc-800" />
  </div>
)

const VideoCard: Component<{ video: YouTubeVideo }> = (props) => {
  const url = () => {
    const base = `https://www.youtube.com/watch?v=${props.video.id}`
    return props.video.timestamp ? `${base}&t=${props.video.timestamp}s` : base
  }
  const thumb = () => `https://i.ytimg.com/vi/${props.video.id}/maxresdefault.jpg`
  const thumbFallback = () => `https://i.ytimg.com/vi/${props.video.id}/hqdefault.jpg`

  const formatTimestamp = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <a
      href={url()}
      target="_blank"
      rel="noopener noreferrer"
      class="group block rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/40 hover:border-red-500/60 hover:bg-zinc-900/80 transition-all duration-200"
    >
      <div class="relative aspect-video bg-zinc-950 overflow-hidden">
        <img
          src={thumb()}
          alt={props.video.title}
          loading="lazy"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onerror={(e) => {
            const img = e.currentTarget as HTMLImageElement
            if (!img.src.endsWith('hqdefault.jpg')) img.src = thumbFallback()
          }}
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-16 h-16 rounded-full bg-red-600/95 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-200">
            <svg viewBox="0 0 24 24" class="w-7 h-7 text-white ml-1" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <Show when={props.video.timestamp}>
          <div class="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/80 text-xs text-zinc-200 font-mono">
            ⏱ {formatTimestamp(props.video.timestamp!)}
          </div>
        </Show>
        <Show when={props.video.duration}>
          <div class="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/80 text-xs text-zinc-200 font-mono">
            {props.video.duration}
          </div>
        </Show>
      </div>
      <div class="p-4">
        <div class="font-bold text-white leading-snug group-hover:text-red-400 transition-colors line-clamp-2">
          {props.video.title}
        </div>
        <div class="text-xs text-zinc-500 mt-1">{props.video.channel}</div>
        <Show when={props.video.description}>
          <p class="text-sm text-zinc-400 mt-2 leading-relaxed line-clamp-3">
            {props.video.description}
          </p>
        </Show>
      </div>
    </a>
  )
}

const PaperCard: Component<{ paper: Paper }> = (props) => (
  <a
    href={props.paper.url}
    target="_blank"
    rel="noopener noreferrer"
    class="group block p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-orange-500/60 hover:bg-zinc-900/80 transition-all duration-200"
  >
    <div class="flex items-start justify-between gap-3 mb-2">
      <div class="font-bold text-white leading-snug group-hover:text-orange-300 transition-colors">
        {props.paper.title}
      </div>
      <Show when={props.paper.arxivId}>
        <span class="flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-500/10 text-orange-400 border border-orange-500/30">
          arXiv:{props.paper.arxivId}
        </span>
      </Show>
    </div>
    <div class="text-xs text-zinc-500 mb-3">
      {props.paper.authors}
      <Show when={props.paper.year}> · {props.paper.year}</Show>
    </div>
    <p class="text-sm text-zinc-400 leading-relaxed m-0">{props.paper.abstract}</p>
  </a>
)

const RepoCard: Component<{ repo: Repo }> = (props) => (
  <a
    href={props.repo.url}
    target="_blank"
    rel="noopener noreferrer"
    class="group block p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-500 hover:bg-zinc-900/80 transition-all duration-200"
  >
    <div class="flex items-center gap-2 mb-2">
      <svg viewBox="0 0 24 24" class="w-4 h-4 text-zinc-500" fill="currentColor" aria-hidden="true">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
      <span class="font-mono text-sm">
        <span class="text-zinc-500">{props.repo.owner}/</span>
        <span class="text-white font-bold group-hover:text-cyan-300 transition-colors">
          {props.repo.name}
        </span>
      </span>
    </div>
    <p class="text-sm text-zinc-400 leading-relaxed m-0 mb-3">{props.repo.description}</p>
    <div class="flex items-center gap-3 text-xs text-zinc-500">
      <Show when={props.repo.language}>
        <span class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-cyan-400" />
          {props.repo.language}
        </span>
      </Show>
      <Show when={props.repo.stars}>
        <span class="flex items-center gap-1">
          <svg viewBox="0 0 24 24" class="w-3 h-3" fill="currentColor" aria-hidden="true">
            <path d="M12 .587l3.668 7.568L24 9.75l-6 5.847 1.416 8.265L12 19.771l-7.416 4.091L6 15.597 0 9.75l8.332-1.595z" />
          </svg>
          {props.repo.stars}
        </span>
      </Show>
    </div>
  </a>
)

const EmptyPlaceholder: Component<{ label: string; arrayName: string }> = (props) => (
  <div class="p-6 rounded-xl border border-dashed border-zinc-800 bg-zinc-950 text-center">
    <div class="text-zinc-500 text-sm">
      More {props.label} coming soon — add entries to the{' '}
      <code class="text-cyan-400 font-mono">{props.arrayName}</code> array in{' '}
      <code class="text-zinc-400 font-mono">Ch13_Bibliography.tsx</code>.
    </div>
  </div>
)

const Ch13_Bibliography: Component = () => {
  return (
    <article>
      <h2 class="text-3xl font-black mb-2 text-white">13. Bibliography &amp; References</h2>
      <p class="text-zinc-400 italic mb-10">
        Every video, paper, and codebase that shaped this guide — and the ones worth following next.
      </p>

      <section class="mb-12">
        <SectionHeader
          icon={<span class="text-red-500"><YouTubeLogo /></span>}
          label="YouTube videos"
          accent="bg-red-500/10 border border-red-500/30"
        />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <For each={videos}>{(video) => <VideoCard video={video} />}</For>
        </div>
      </section>

      <section class="mb-12">
        <SectionHeader
          icon={<span class="text-orange-400"><ArxivLogo /></span>}
          label="arXiv & open-source research"
          accent="bg-orange-500/10 border border-orange-500/30"
        />
        <Show
          when={papers.length > 0}
          fallback={<EmptyPlaceholder label="papers" arrayName="papers" />}
        >
          <div class="grid grid-cols-1 gap-4">
            <For each={papers}>{(paper) => <PaperCard paper={paper} />}</For>
          </div>
        </Show>
      </section>

      <section class="mb-12">
        <SectionHeader
          icon={<span class="text-zinc-200"><GitHubLogo /></span>}
          label="GitHub repositories"
          accent="bg-zinc-200/10 border border-zinc-200/30"
        />
        <Show
          when={repos.length > 0}
          fallback={<EmptyPlaceholder label="repositories" arrayName="repos" />}
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <For each={repos}>{(repo) => <RepoCard repo={repo} />}</For>
          </div>
        </Show>
      </section>

      <div class="mt-12 p-5 rounded-xl bg-cyan-500/5 border-l-4 border-cyan-400 text-cyan-100">
        <p class="m-0 text-sm leading-relaxed">
          Have a great paper, video, or repo on Fourier analysis, FFT
          algorithms, windowing, convolution, or DSP for radar? Drop it into
          the corresponding array at the top of{' '}
          <code class="font-mono text-cyan-300">Ch13_Bibliography.tsx</code> —
          the cards render automatically.
        </p>
      </div>
    </article>
  )
}

export default Ch13_Bibliography
