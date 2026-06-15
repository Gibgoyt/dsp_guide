use leptos::*;
use leptos_router::A;

use crate::chapters::{CHAPTERS, ROOT};
use crate::{current_slug, NavOpen};

#[component]
pub fn Sidebar() -> impl IntoView {
    let nav_open = use_context::<NavOpen>().expect("NavOpen context").0;

    view! {
        // Desktop sticky sidebar
        <aside class="hidden lg:block w-72 flex-shrink-0 border-r border-zinc-800 sticky top-14 self-start h-[calc(100vh-3.5rem)] overflow-y-auto">
            <ChapterList/>
        </aside>

        // Mobile drawer
        <Show when=move || nav_open.get() fallback=|| view! { <></> }>
            <div
                class="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                on:click=move |_| nav_open.set(false)
            />
            <aside class="lg:hidden fixed top-0 left-0 bottom-0 w-72 z-50 bg-zinc-950 border-r border-zinc-800 overflow-y-auto">
                <div class="p-3 flex justify-between items-center border-b border-zinc-800">
                    <div class="text-sm font-bold text-violet-400">"Chapters"</div>
                    <button
                        on:click=move |_| nav_open.set(false)
                        class="text-zinc-400 hover:text-white text-xl leading-none"
                        aria-label="Close"
                    >
                        "×"
                    </button>
                </div>
                <ChapterList/>
            </aside>
        </Show>
    }
}

#[component]
fn ChapterList() -> impl IntoView {
    let nav_open = use_context::<NavOpen>().expect("NavOpen context").0;
    let slug = current_slug();

    view! {
        <nav class="p-3">
            <div class="text-xs uppercase tracking-wider text-zinc-500 px-2 mb-2">"Chapters"</div>
            <ul class="space-y-0.5">
                {CHAPTERS
                    .iter()
                    .enumerate()
                    .map(|(i, ch)| {
                        let ch_slug = ch.slug;
                        let short = ch.short_title;
                        let href = if i == 0 {
                            format!("/{}", ROOT)
                        } else {
                            format!("/{}/{}", ROOT, ch_slug)
                        };
                        let slug_for_active = slug;
                        let is_active = move || slug_for_active.get() == ch_slug;

                        let btn_class = move || {
                            if is_active() {
                                "w-full text-left px-2 py-2 rounded-lg text-sm transition-colors flex items-start gap-2 bg-violet-500/10 text-violet-300"
                            } else {
                                "w-full text-left px-2 py-2 rounded-lg text-sm transition-colors flex items-start gap-2 text-zinc-400 hover:bg-zinc-900 hover:text-white"
                            }
                        };
                        let num_class = move || {
                            if is_active() {
                                "font-mono text-xs mt-0.5 w-6 flex-shrink-0 text-violet-400"
                            } else {
                                "font-mono text-xs mt-0.5 w-6 flex-shrink-0 text-zinc-600"
                            }
                        };

                        view! {
                            <li>
                                <A
                                    href=href
                                    class=btn_class
                                    on:click=move |_| nav_open.set(false)
                                >
                                    <span class=num_class>
                                        {format!("{:02}", i + 1)}
                                    </span>
                                    <span class="leading-snug">{short}</span>
                                </A>
                            </li>
                        }
                    })
                    .collect_view()}
            </ul>
        </nav>
    }
}
