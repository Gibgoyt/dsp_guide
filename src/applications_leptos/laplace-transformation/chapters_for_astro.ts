/**
 * Source of truth for the Laplace chapter list (slug + title + components) lives
 * in the Rust crate under `src/chapters.rs` and `src/chapters/`.
 *
 * This file exists ONLY so Astro's getStaticPaths() can prerender each
 * /laplace-transformation/<slug> route at build time. Slugs MUST stay in sync
 * with the CHAPTERS array in src/chapters.rs.
 */
export const chapterSlugs = [
  'pierre-simon-laplace',
  'from-fourier-to-laplace',
  'definition-and-roc',
  'algebra-magic',
  'worked-odes',
  'transfer-function',
  's-plane-geometry',
  'reading-pole-zero',
  'inverse-laplace-partial-fractions',
  'initial-final-value-theorems',
  'continuous-to-sampled',
  'z-transform',
  'fir-vs-iir-stability',
  'radar-calibration',
  'interview-cheatsheet',
  'bibliography',
] as const
