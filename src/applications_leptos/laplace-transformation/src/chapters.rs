/// Source of truth for chapter metadata. Mirrors the SolidJS `chapters.ts`
/// arrays, but in Rust. The `chapters_for_astro.ts` file at the crate root
/// also lists these slugs (in the same order) so Astro can prerender each
/// /laplace-transformation/<slug> route at build time.
pub struct Chapter {
    pub slug: &'static str,
    pub title: &'static str,
    pub short_title: &'static str,
}

pub const ROOT: &str = "laplace-transformation";

pub const CHAPTERS: &[Chapter] = &[
    Chapter {
        slug: "pierre-simon-laplace",
        short_title: "Pierre-Simon Laplace",
        title: "1. Pierre-Simon Laplace — The Man Before the Transform",
    },
    Chapter {
        slug: "from-fourier-to-laplace",
        short_title: "From Fourier to Laplace",
        title: "2. From Fourier to Laplace — Adding a Real Axis",
    },
    Chapter {
        slug: "definition-and-roc",
        short_title: "Definition & ROC",
        title: "3. The Definition and the Region of Convergence",
    },
    Chapter {
        slug: "algebra-magic",
        short_title: "The Algebra Magic",
        title: "4. The Algebra Magic — Differentiation Becomes Multiplication",
    },
    Chapter {
        slug: "worked-odes",
        short_title: "Worked ODEs",
        title: "5. Worked ODEs — RC Circuits and Mass-Spring-Damper",
    },
    Chapter {
        slug: "transfer-function",
        short_title: "Transfer Function",
        title: "6. The Transfer Function H(s) — Zeros and Poles",
    },
    Chapter {
        slug: "s-plane-geometry",
        short_title: "s-Plane Geometry",
        title: "7. The s-Plane Geometry — Stability at a Glance",
    },
    Chapter {
        slug: "reading-pole-zero",
        short_title: "Reading Pole-Zero Plots",
        title: "8. Reading Pole-Zero Plots — Layout Dictates Response",
    },
    Chapter {
        slug: "inverse-laplace-partial-fractions",
        short_title: "Inverse via Partial Fractions",
        title: "9. Inverse Laplace via Partial Fractions",
    },
    Chapter {
        slug: "initial-final-value-theorems",
        short_title: "IVT & FVT",
        title: "10. Initial Value and Final Value Theorems",
    },
    Chapter {
        slug: "continuous-to-sampled",
        short_title: "Continuous → Sampled",
        title: "11. From Continuous to Sampled — The Bridge",
    },
    Chapter {
        slug: "z-transform",
        short_title: "The Z-Transform",
        title: "12. The Z-Transform — z = e^(sT) and the Unit Circle",
    },
    Chapter {
        slug: "fir-vs-iir-stability",
        short_title: "FIR vs IIR Stability",
        title: "13. FIR vs IIR — Where Pole/Zero Analysis Actually Matters",
    },
    Chapter {
        slug: "radar-calibration",
        short_title: "Radar Calibration",
        title: "14. Radar Calibration — Where Laplace/Z Earn Their Keep",
    },
    Chapter {
        slug: "interview-cheatsheet",
        short_title: "Interview Cheat-Sheet",
        title: "15. The Interview Cheat-Sheet",
    },
    Chapter {
        slug: "bibliography",
        short_title: "Bibliography",
        title: "16. Bibliography and References",
    },
];

pub fn chapter_by_slug(slug: &str) -> &'static Chapter {
    CHAPTERS
        .iter()
        .find(|c| c.slug == slug)
        .unwrap_or(&CHAPTERS[0])
}

pub fn chapter_index(slug: &str) -> usize {
    CHAPTERS.iter().position(|c| c.slug == slug).unwrap_or(0)
}
