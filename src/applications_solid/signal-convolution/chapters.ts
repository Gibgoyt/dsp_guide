import type { Component } from 'solid-js'
import Ch01 from './chapters/Ch01_RaindropPond'
import Ch02 from './chapters/Ch02_LTISystemsImpulseResponse'
import Ch03 from './chapters/Ch03_TheConvolutionSum'
import Ch04 from './chapters/Ch04_ContinuousConvolution'
import Ch05 from './chapters/Ch05_PropertiesAndAlgebra'
import Ch06 from './chapters/Ch06_WorkedByHand'
import Ch07 from './chapters/Ch07_ConvolutionVsCorrelation'
import Ch08 from './chapters/Ch08_ConvolutionTheorem'
import Ch09 from './chapters/Ch09_FastConvolutionFFT'
import Ch10 from './chapters/Ch10_CircularVsLinear'
import Ch11 from './chapters/Ch11_OverlapAddOverlapSave'
import Ch12 from './chapters/Ch12_TwoDConvolution'
import Ch13 from './chapters/Ch13_MatchedFilterRadar'
import Ch14 from './chapters/Ch14_FastConvolutionOnGPUs'
import Ch15 from './chapters/Ch15_InterviewCheatsheet'
import Ch16 from './chapters/Ch16_Bibliography'

export interface Chapter {
  slug: string
  title: string
  shortTitle: string
  Component: Component
}

export const chapters: Chapter[] = [
  { slug: 'raindrop-pond',         shortTitle: 'Raindrop & Pond',       title: '1. The Raindrop and the Pond',                Component: Ch01 },
  { slug: 'lti-impulse-response',  shortTitle: 'LTI & Impulse Response', title: '2. LTI Systems and the Impulse Response',     Component: Ch02 },
  { slug: 'convolution-sum',       shortTitle: 'The Convolution Sum',   title: '3. The Convolution Sum',                       Component: Ch03 },
  { slug: 'continuous-convolution', shortTitle: 'Continuous Convolution', title: '4. Continuous Convolution',                  Component: Ch04 },
  { slug: 'properties-algebra',    shortTitle: 'Properties & Algebra',  title: '5. Properties and the Algebra of Convolution', Component: Ch05 },
  { slug: 'worked-by-hand',        shortTitle: 'Worked by Hand',        title: '6. Convolution by Hand — Classic Examples',    Component: Ch06 },
  { slug: 'convolution-vs-correlation', shortTitle: 'Conv. vs Correlation', title: '7. Convolution vs. Cross-Correlation',    Component: Ch07 },
  { slug: 'convolution-theorem',   shortTitle: 'Convolution Theorem',   title: '8. The Convolution Theorem',                   Component: Ch08 },
  { slug: 'fast-convolution-fft',  shortTitle: 'Fast Convolution (FFT)', title: '9. Fast Convolution via the FFT',             Component: Ch09 },
  { slug: 'circular-vs-linear',    shortTitle: 'Circular vs Linear',    title: '10. Circular vs. Linear Convolution',          Component: Ch10 },
  { slug: 'overlap-add-save',      shortTitle: 'Overlap-Add / Save',    title: '11. Overlap-Add and Overlap-Save',             Component: Ch11 },
  { slug: '2d-convolution',        shortTitle: '2D Convolution',        title: '12. 2D Convolution — Images & CNNs',           Component: Ch12 },
  { slug: 'matched-filter-radar',  shortTitle: 'Matched Filter (Radar)', title: '13. The Matched Filter and Radar',            Component: Ch13 },
  { slug: 'gpu-convolution',       shortTitle: 'Fast Conv. on GPUs',    title: '14. Fast Convolution on GPUs',                 Component: Ch14 },
  { slug: 'interview-cheatsheet',  shortTitle: 'Interview Cheat-Sheet', title: '15. Interview Cheat-Sheet',                    Component: Ch15 },
  { slug: 'bibliography',          shortTitle: 'Bibliography',          title: '16. Bibliography & References',                Component: Ch16 },
]

export const chapterBySlug = (slug: string | undefined): Chapter => {
  if (!slug) return chapters[0]
  return chapters.find((c) => c.slug === slug) ?? chapters[0]
}

export const chapterIndex = (slug: string): number =>
  chapters.findIndex((c) => c.slug === slug)
