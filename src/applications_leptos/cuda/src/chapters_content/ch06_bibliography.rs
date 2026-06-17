use leptos::*;

/// One YouTube video entry. To add a new one, append a `YouTubeVideo { … }`
/// to the `VIDEOS` slice below — the card grid renders it automatically.
struct YouTubeVideo {
    id: &'static str,
    title: &'static str,
    channel: &'static str,
    description: &'static str,
}

const VIDEOS: &[YouTubeVideo] = &[
    YouTubeVideo {
        id: "Sdjn9FOkhnA",
        title: "Accelerating Applications with Parallel Algorithms | CUDA C++ Class Part 1",
        channel: "NVIDIA Developer",
        description: "Where Thrust fits in the CUDA software stack, execution policies vs execution-space specifiers, and the 3×2 truth table that decides whether your code compiles. The slides in chapter 5 are sourced from this talk.",
    },
    YouTubeVideo {
        id: "mZJEbO9Eros",
        title: "CUDACast #15 — Introduction to Thrust",
        channel: "NVIDIA Developer",
        description: "Thrust is a powerful library of parallel algorithms and data structures. A C++ developer can write just a few lines of code to perform GPU-accelerated sort, scan, transform, and reduction.",
    },
];

#[component]
pub fn Ch06() -> impl IntoView {
    view! {
        <h2 class="text-3xl font-black mb-2 text-white">"6. Bibliography & References"</h2>
        <p class="text-zinc-400 italic mb-10">
            "Every video and resource that shaped this CUDA walkthrough — and the ones worth following next."
        </p>

        <section class="mb-12">
            <div class="flex items-center gap-3 mb-5">
                <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/30">
                    <svg viewBox="0 0 24 24" class="w-6 h-6 text-red-500" fill="currentColor" aria-hidden="true">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                </div>
                <h3 class="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold m-0">
                    "YouTube videos"
                </h3>
                <div class="flex-1 h-px bg-zinc-800"></div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                {VIDEOS
                    .iter()
                    .map(|v| {
                        let id = v.id;
                        let title = v.title;
                        let channel = v.channel;
                        let description = v.description;
                        let url = format!("https://www.youtube.com/watch?v={}", id);
                        let thumb = format!("https://i.ytimg.com/vi/{}/maxresdefault.jpg", id);
                        let fallback = format!("https://i.ytimg.com/vi/{}/hqdefault.jpg", id);
                        let onerror = format!(
                            "if(!this.src.endsWith('hqdefault.jpg')){{this.src='{}';}}",
                            fallback
                        );

                        view! {
                            <a
                                href=url
                                target="_blank"
                                rel="noopener noreferrer"
                                class="group block rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/40 hover:border-red-500/60 hover:bg-zinc-900/80 transition-all duration-200"
                            >
                                <div class="relative aspect-video bg-zinc-950 overflow-hidden">
                                    <img
                                        src=thumb
                                        alt=title
                                        loading="lazy"
                                        onerror=onerror
                                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                    <div class="absolute inset-0 flex items-center justify-center">
                                        <div class="w-16 h-16 rounded-full bg-red-600/95 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-200">
                                            <svg viewBox="0 0 24 24" class="w-7 h-7 text-white ml-1" fill="currentColor" aria-hidden="true">
                                                <path d="M8 5v14l11-7z"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div class="p-4">
                                    <div class="font-bold text-white leading-snug group-hover:text-red-400 transition-colors">
                                        {title}
                                    </div>
                                    <div class="text-xs text-zinc-500 mt-1">{channel}</div>
                                    <p class="text-sm text-zinc-400 mt-2 leading-relaxed m-0">
                                        {description}
                                    </p>
                                </div>
                            </a>
                        }
                    })
                    .collect_view()}
            </div>
        </section>

        <div class="mt-12 p-5 rounded-xl bg-cyan-500/5 border-l-4 border-cyan-400">
            <p class="m-0 text-sm leading-relaxed text-cyan-100">
                "Have a great talk, paper, or repo on CUDA, Thrust, cuBLAS, cuFFT, or GPU programming in general? Add it to the "
                <code class="font-mono text-cyan-300">"VIDEOS"</code>
                " slice at the top of "
                <code class="font-mono text-cyan-300">"ch06_bibliography.rs"</code>
                " — the cards render automatically."
            </p>
        </div>
    }
}
