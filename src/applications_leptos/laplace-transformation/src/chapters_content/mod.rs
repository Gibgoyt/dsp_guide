use leptos::*;

mod ch01_pierre_simon_laplace;
mod ch02_from_fourier_to_laplace;
mod ch03_definition_and_roc;
mod ch04_algebra_magic;
mod ch05_worked_odes;
mod ch06_transfer_function;
mod ch07_s_plane_geometry;
mod ch08_reading_pole_zero;
mod ch09_inverse_laplace_partial_fractions;
mod ch10_initial_final_value_theorems;
mod ch11_continuous_to_sampled;
mod ch12_z_transform;
mod ch13_fir_vs_iir_stability;
mod ch14_radar_calibration;
mod ch15_interview_cheatsheet;
mod ch16_bibliography;

pub use ch01_pierre_simon_laplace::Ch01;
pub use ch02_from_fourier_to_laplace::Ch02;
pub use ch03_definition_and_roc::Ch03;
pub use ch04_algebra_magic::Ch04;
pub use ch05_worked_odes::Ch05;
pub use ch06_transfer_function::Ch06;
pub use ch07_s_plane_geometry::Ch07;
pub use ch08_reading_pole_zero::Ch08;
pub use ch09_inverse_laplace_partial_fractions::Ch09;
pub use ch10_initial_final_value_theorems::Ch10;
pub use ch11_continuous_to_sampled::Ch11;
pub use ch12_z_transform::Ch12;
pub use ch13_fir_vs_iir_stability::Ch13;
pub use ch14_radar_calibration::Ch14;
pub use ch15_interview_cheatsheet::Ch15;
pub use ch16_bibliography::Ch16;

/// Map a chapter slug to its Leptos view. Unknown / empty slugs fall back to
/// the first chapter — same behavior the SolidJS sibling guides use.
pub fn render_chapter(slug: &str) -> View {
    match slug {
        "" | "pierre-simon-laplace" => view! { <Ch01/> }.into_view(),
        "from-fourier-to-laplace" => view! { <Ch02/> }.into_view(),
        "definition-and-roc" => view! { <Ch03/> }.into_view(),
        "algebra-magic" => view! { <Ch04/> }.into_view(),
        "worked-odes" => view! { <Ch05/> }.into_view(),
        "transfer-function" => view! { <Ch06/> }.into_view(),
        "s-plane-geometry" => view! { <Ch07/> }.into_view(),
        "reading-pole-zero" => view! { <Ch08/> }.into_view(),
        "inverse-laplace-partial-fractions" => view! { <Ch09/> }.into_view(),
        "initial-final-value-theorems" => view! { <Ch10/> }.into_view(),
        "continuous-to-sampled" => view! { <Ch11/> }.into_view(),
        "z-transform" => view! { <Ch12/> }.into_view(),
        "fir-vs-iir-stability" => view! { <Ch13/> }.into_view(),
        "radar-calibration" => view! { <Ch14/> }.into_view(),
        "interview-cheatsheet" => view! { <Ch15/> }.into_view(),
        "bibliography" => view! { <Ch16/> }.into_view(),
        _ => view! { <Ch01/> }.into_view(),
    }
}
