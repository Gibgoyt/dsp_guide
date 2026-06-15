import type { Component } from 'solid-js'
import Ch01 from './chapters/Ch01_OrchestraPrism'
import Ch02 from './chapters/Ch02_FourTransforms'
import Ch03 from './chapters/Ch03_HistoryCorrected'
import Ch04 from './chapters/Ch04_MathFoundations'
import Ch05 from './chapters/Ch05_ContinuousFT'
import Ch06 from './chapters/Ch06_Sampling'
import Ch07 from './chapters/Ch07_DFT'
import Ch08 from './chapters/Ch08_FFT'
import Ch09 from './chapters/Ch09_Windowing'
import Ch10 from './chapters/Ch10_Convolution'
import Ch11 from './chapters/Ch11_RadarApplications'
import Ch12 from './chapters/Ch12_InterviewCheatsheet'

export interface Chapter {
  slug: string
  title: string
  shortTitle: string
  Component: Component
}

export const chapters: Chapter[] = [
  { slug: 'orchestra-prism',    shortTitle: 'Orchestra & Prism',     title: '1. The Orchestra and the Prism',           Component: Ch01 },
  { slug: 'four-transforms',    shortTitle: 'Four Transforms',       title: '2. A Tale of Four Transforms',             Component: Ch02 },
  { slug: 'history',            shortTitle: 'History, Corrected',    title: '3. The History, Corrected',                Component: Ch03 },
  { slug: 'math-foundations',   shortTitle: 'Math Foundations',      title: '4. Sines, Cosines, and Euler',             Component: Ch04 },
  { slug: 'continuous-ft',      shortTitle: 'Continuous FT',         title: '5. The Continuous Fourier Transform',      Component: Ch05 },
  { slug: 'sampling-nyquist',   shortTitle: 'Sampling & Nyquist',    title: '6. Sampling and Nyquist',                  Component: Ch06 },
  { slug: 'dft',                shortTitle: 'The DFT',               title: '7. The DFT',                               Component: Ch07 },
  { slug: 'fft',                shortTitle: 'The FFT',               title: '8. The FFT — Cooley–Tukey',                Component: Ch08 },
  { slug: 'windowing-leakage',  shortTitle: 'Windowing & Leakage',   title: '9. Windowing & Spectral Leakage',          Component: Ch09 },
  { slug: 'convolution',        shortTitle: 'Convolution',           title: '10. Convolution & the Convolution Theorem', Component: Ch10 },
  { slug: 'applications-radar', shortTitle: 'Apps & Radar',          title: '11. Real-World Applications & Radar',      Component: Ch11 },
  { slug: 'interview',          shortTitle: 'Interview Cheat-Sheet', title: '12. Interview Cheat-Sheet',                Component: Ch12 },
]

export const chapterBySlug = (slug: string | undefined): Chapter => {
  if (!slug) return chapters[0]
  return chapters.find((c) => c.slug === slug) ?? chapters[0]
}

export const chapterIndex = (slug: string): number =>
  chapters.findIndex((c) => c.slug === slug)
