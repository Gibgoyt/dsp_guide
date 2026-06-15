use leptos::*;
use leptos_router::*;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

mod chapters;
mod chapters_content;
mod components;

use chapters::{chapter_by_slug, chapter_index, CHAPTERS, ROOT};
use chapters_content::render_chapter;
use components::{ChapterFooter, Header, ProgressBar, Sidebar};

/// Shared mobile-drawer toggle. Header opens it; the drawer closes itself.
#[derive(Clone, Copy)]
pub struct NavOpen(pub RwSignal<bool>);

/// Parse the slug out of `window.location.pathname` reactively. Components
/// outside `<Routes>` cannot use `use_params_map()`, so we derive from the
/// Location signal directly. Falls back to the first chapter's slug.
pub fn current_slug() -> Signal<String> {
    let loc = use_location();
    let first = CHAPTERS[0].slug.to_string();
    Signal::derive(move || {
        loc.pathname.with(|p| {
            let parts: Vec<&str> = p.trim_matches('/').split('/').collect();
            if parts.first().copied() == Some(ROOT) {
                match parts.get(1) {
                    Some(s) if !s.is_empty() => s.to_string(),
                    _ => first.clone(),
                }
            } else {
                first.clone()
            }
        })
    })
}

#[component]
fn ChapterPage() -> impl IntoView {
    let params = use_params_map();
    view! {
        <article class="prose-invert">
            {move || {
                let slug = params.with(|p| p.get("slug").cloned().unwrap_or_default());
                render_chapter(&slug)
            }}
        </article>
    }
}

#[component]
fn DefaultChapterPage() -> impl IntoView {
    view! {
        <article class="prose-invert">
            {render_chapter(CHAPTERS[0].slug)}
        </article>
    }
}

#[component]
fn App() -> impl IntoView {
    provide_context(NavOpen(create_rw_signal(false)));

    view! {
        <Router>
            <div class="min-h-screen bg-zinc-950 text-white">
                <ProgressBar/>
                <Header/>
                <div class="flex">
                    <Sidebar/>
                    <main class="flex-1 min-w-0">
                        <div class="max-w-3xl mx-auto px-4 sm:px-8 py-10">
                            <Routes>
                                <Route path="/laplace-transformation" view=DefaultChapterPage/>
                                <Route path="/laplace-transformation/:slug" view=ChapterPage/>
                            </Routes>
                            <ChapterFooter/>
                            <footer class="mt-16 pt-6 border-t border-zinc-900 text-center text-xs text-zinc-600">
                                <p>"Built as a study guide. The math is rigorous; the framing is opinionated."</p>
                            </footer>
                        </div>
                    </main>
                </div>
            </div>
        </Router>
    }
}

#[wasm_bindgen]
pub fn mount_laplace_app() -> Result<(), JsValue> {
    console_error_panic_hook::set_once();

    let container = web_sys::window()
        .ok_or_else(|| JsValue::from_str("no window"))?
        .document()
        .ok_or_else(|| JsValue::from_str("no document"))?
        .get_element_by_id("wasm-root")
        .ok_or_else(|| JsValue::from_str("no #wasm-root element"))?
        .dyn_into::<web_sys::HtmlElement>()?;

    mount_to(container, || view! { <App/> });
    Ok(())
}

// Suppress unused-import warning while keeping the imports addressable.
#[allow(dead_code)]
fn _silence_unused() {
    let _ = chapter_by_slug("");
    let _ = chapter_index("");
}
