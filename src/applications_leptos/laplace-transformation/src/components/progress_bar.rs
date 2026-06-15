use leptos::*;

use crate::chapters::{chapter_index, CHAPTERS};
use crate::current_slug;

#[component]
pub fn ProgressBar() -> impl IntoView {
    let slug = current_slug();
    let total = CHAPTERS.len();

    let progress = move || {
        let idx = chapter_index(&slug.get());
        ((idx + 1) as f64 / total as f64) * 100.0
    };

    view! {
        <div class="fixed top-0 left-0 right-0 z-50 h-1 bg-zinc-900">
            <div
                class="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-400 transition-all duration-300"
                style=move || format!("width: {}%", progress())
            />
        </div>
    }
}
