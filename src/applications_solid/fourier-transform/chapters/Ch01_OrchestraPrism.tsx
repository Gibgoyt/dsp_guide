import type { Component } from 'solid-js'
import AdditiveSynth from '../widgets/AdditiveSynth'

const Ch01_OrchestraPrism: Component = () => {
  return (
    <article class="prose-invert">
      <h2 class="text-3xl font-black mb-2 text-white">1. The Orchestra and the Prism</h2>
      <p class="text-zinc-400 italic mb-8">
        The single best intuition pump for the Fourier Transform — and the one we'll
        come back to in every chapter.
      </p>

      <section class="space-y-5 text-zinc-300 leading-relaxed">
        <p>
          Imagine you're handed a recording of a full orchestra. Every instrument
          crashing together into one chaotic wave of air pressure. You can't tell
          the violin from the cello. You can't tell the oboe from the flute.
          They're all collapsed into a single messy signal — one number per
          time-step, the displacement of the microphone diaphragm.
        </p>

        <p>
          Then someone hands you a <strong class="text-cyan-300">prism</strong>.
          You put the signal through it, and suddenly the whole thing splits apart.
          You can see — actually see — that this part of the signal is the violin
          at 440 Hz, that part is the cello at 110 Hz, this brief burst is the
          flute at 880 Hz. The signal hasn't changed; you're just <em>looking at it
          along a different axis</em>. The time axis collapsed sound into a wave;
          the frequency axis spreads it back out into instruments.
        </p>

        <p>
          That prism is the <strong class="text-cyan-300">Fourier Transform</strong>.
          It's a mathematical operation that takes a signal — any signal, no matter
          how complicated — and tells you, for every possible pure frequency, "how
          much of that frequency is in here?"
        </p>

        <div class="my-8 p-5 rounded-xl bg-cyan-500/5 border-l-4 border-cyan-400">
          <p class="text-cyan-100 m-0">
            <strong>The claim, in one sentence:</strong> Any signal can be expressed
            as a sum of pure sines and cosines, each scaled to its own amplitude
            and shifted to its own phase. Time-domain shape is just the visible
            outline; the frequency content is what the signal <em>is</em>.
          </p>
        </div>

        <p>
          This is so counter-intuitive that when Joseph Fourier proposed it in
          1807, the smartest mathematician on the review committee — Joseph-Louis
          Lagrange — refused to believe him. We'll get to that fight in Chapter 3.
          For now, let's just see it work.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Build a wave out of sines</h3>
        <p>
          Below is an interactive synthesizer. There are five sliders — one for
          each of the first five harmonics of some fundamental frequency. The
          fundamental is harmonic 1; harmonic 2 is twice the frequency; harmonic
          3 is three times; and so on. Each slider sets that harmonic's amplitude.
          Drag them and watch the resulting waveform.
        </p>

        <AdditiveSynth />

        <p>
          Hit the <em>Square wave</em> preset. Notice that adding just three
          sines — the 1st, 3rd, and 5th harmonics, with amplitudes 1, 1/3, 1/5 —
          already produces something that looks distinctly square-ish. A real
          square wave is an infinite sum:
        </p>

        <p class="font-mono text-center text-cyan-300 text-sm p-3 rounded-lg bg-zinc-900/70 border border-zinc-800">
          square(t) = (4/π) · [ sin(t) + (1/3)sin(3t) + (1/5)sin(5t) + (1/7)sin(7t) + ... ]
        </p>

        <p>
          Every odd harmonic, amplitude scaled by 1/k. Truncate the sum at any
          finite point and you get a smooth approximation; let it run to infinity
          and you get the actual square wave.
        </p>

        <p>
          Now try <em>Sawtooth</em>. Different pattern of harmonics — all of them
          this time, alternating sign — and a completely different shape. Same
          building blocks, different mixture, different result.
        </p>

        <h3 class="text-xl font-bold text-white mt-10 mb-3">Why this matters</h3>
        <p>
          The Fourier Transform is the operation that <em>reverses</em> what you
          just did. You manually picked amplitudes and got a waveform. The Fourier
          Transform takes a waveform and tells you what those amplitudes were.
        </p>

        <p>
          That's why it's the engine inside every MP3 player, every MRI machine,
          every Wi-Fi router, every modern radar. The world is full of signals
          mashed together — audio, electromagnetic waves, vibrations, blood-oxygen
          fluctuations — and the only way to make sense of them is to put them
          through the prism.
        </p>

        <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
          <h4 class="font-bold text-cyan-400 mb-2">What you should take from this chapter</h4>
          <ul class="space-y-2 text-zinc-300 m-0">
            <li>• A signal in <strong>time domain</strong> = amplitude as a function of time.</li>
            <li>• A signal in <strong>frequency domain</strong> = amplitude as a function of frequency.</li>
            <li>• They are <strong>two views of the same object</strong>, related by the Fourier Transform.</li>
            <li>• Any well-behaved signal can be written as a sum of pure sines (and cosines).</li>
            <li>• The Fourier Transform tells you "how much of each frequency" is present.</li>
          </ul>
        </div>

        <p>
          Next, we kill the most common confusion in this field: the difference
          between Fourier Series, the Continuous Fourier Transform, the DTFT,
          and the DFT — and where the FFT fits in.
        </p>
      </section>
    </article>
  )
}

export default Ch01_OrchestraPrism
