use leptos::*;

#[component]
pub fn Ch01() -> impl IntoView {
    view! {
        <h2 class="text-3xl font-black mb-2 text-white">"1. Pierre-Simon Laplace — The Man Before the Transform"</h2>
        <p class="text-zinc-400 italic mb-8">
            "Before the integral with his name on it became the workhorse of every controls and DSP course, there was a man — a peasant's son from Normandy who ended up the most powerful mathematician in Napoleonic France."
        </p>

        <section class="space-y-5 text-zinc-300 leading-relaxed">
            <p>
                "Pierre-Simon Laplace was born on March 23, 1749, in Beaumont-en-Auge, a tiny village in Normandy. His father was a cider merchant. By every reasonable expectation he should have ended up a parish priest or a notary. Instead he ended up the man Napoleon called "
                <em>"the Newton of France"</em>
                "."
            </p>

            <p>
                "He left for Paris at nineteen with a letter of introduction to "
                <strong class="text-violet-300">"Jean d'Alembert"</strong>
                ", the editor of the "
                <em>"Encyclopédie"</em>
                " and one of the most influential mathematicians in Europe. The letter was ignored. So Laplace, undaunted, wrote d'Alembert another letter — this one packed with original mathematics on the principles of mechanics. d'Alembert read it the next morning, called Laplace in, and arranged a teaching post at the École Militaire on the spot."
            </p>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Mécanique Céleste — the universe as a clockwork"</h3>
            <p>
                "Over the next forty years Laplace produced "
                <strong class="text-violet-300">"Mécanique Céleste"</strong>
                " — five enormous volumes that extended Newton's laws to every problem in the solar system Newton had left dangling. Why doesn't Jupiter's orbit decay over centuries? Why doesn't Saturn's? Why is the tidal motion stable? Laplace answered all of it with perturbation theory and a relentless commitment to integral calculus."
            </p>

            <p>
                "It was during this work that Laplace started using a particular integral transform — taking a function of time and producing a function of a complex variable — as a computational shortcut. He did not call it "
                <em>"the Laplace transform."</em>
                " That name came much later, after Heaviside and Bromwich rediscovered and formalized the technique in the late 1800s and early 1900s. Laplace just used it because it worked."
            </p>

            <div class="my-8 p-5 rounded-xl bg-violet-500/5 border-l-4 border-violet-400">
                <p class="text-violet-100 m-0">
                    <strong>"The historical correction:"</strong>
                    " The "
                    <em>"name"</em>
                    " 'Laplace transform' is honorific. The modern definition, region of convergence, and inversion machinery were developed and rigorized by Oliver Heaviside (operational calculus, 1880s), then made mathematically respectable by Thomas Bromwich (contour integration, 1916) and Gustav Doetsch (formal theory, 1937). What Laplace actually did was use a closely related integral in his probability work."
                </p>
            </div>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Théorie Analytique des Probabilités"</h3>
            <p>
                "In 1812 he published a second monumental work — "
                <strong class="text-violet-300">"Théorie Analytique des Probabilités"</strong>
                " — which essentially invented modern probability theory. Generating functions, the central limit theorem, Bayesian inference (yes, Bayes is in there too): all of it gets formalized here. The integral that would later carry his name shows up explicitly as a tool for manipulating generating functions of continuous random variables. That is where the Laplace transform is "
                <em>"actually"</em>
                " born, in a probability textbook."
            </p>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Laplace's demon"</h3>
            <p>
                "From the introduction to the probability book — one of the most quoted paragraphs in the history of science:"
            </p>
            <blockquote class="border-l-4 border-violet-400 pl-5 italic text-zinc-200 my-4">
                "“An intellect which at a certain moment would know all forces that set nature in motion, and all positions of all items of which nature is composed, if this intellect were also vast enough to submit these data to analysis — it would embrace in a single formula the movements of the greatest bodies of the universe and those of the tiniest atom; for such an intellect nothing would be uncertain and the future just like the past would be present before its eyes.”"
            </blockquote>
            <p>
                "This is "
                <strong class="text-violet-300">"Laplace's demon"</strong>
                ": a thought experiment in total causal determinism. Modern physics has killed it (quantum mechanics, chaos, computational irreducibility), but as a "
                <em>"mood"</em>
                " it still shapes how we treat linear time-invariant systems in DSP. The whole reason transfer functions work is that LTI systems "
                <em>"are"</em>
                " deterministic in Laplace's sense: same input now → same output forever."
            </p>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Politics, Napoleon, and survival"</h3>
            <p>
                "Laplace was a political survivor. He served the monarchy, the Revolution, the Directory, Napoleon (who briefly made him Minister of the Interior — for six weeks before firing him for being a terrible administrator), and the Bourbon Restoration. He was made a Marquis in 1817. He kept his head when many others lost theirs."
            </p>

            <p>
                "The most famous Laplace anecdote — possibly apocryphal but irresistible — has him presenting a copy of "
                <em>"Mécanique Céleste"</em>
                " to Napoleon. Napoleon flips through it and says:"
            </p>
            <blockquote class="border-l-4 border-violet-400 pl-5 italic text-zinc-200 my-4">
                "“M. Laplace, they tell me you have written this large book on the system of the universe, and have never even mentioned its Creator.”"
            </blockquote>
            <p>
                "Laplace's reply, delivered with the dryness of a man who had already calculated the orbital perturbations of Saturn:"
            </p>
            <blockquote class="border-l-4 border-violet-400 pl-5 italic text-zinc-200 my-4">
                "“"<em>"Je n'avais pas besoin de cette hypothèse."</em>"” — I had no need of that hypothesis."
            </blockquote>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"What you should take from this chapter"</h3>
            <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
                <ul class="space-y-2 text-zinc-300 m-0 list-none p-0">
                    <li>"• Laplace was a "<strong>"celestial mechanic"</strong>" and "<strong>"probabilist"</strong>" first; the transform was a tool he used along the way."</li>
                    <li>"• The "<em>"modern"</em>" formulation of the Laplace transform is largely Heaviside's and Bromwich's — Laplace's name is honorific."</li>
                    <li>"• The mood of "<em>"Laplace's demon"</em>" — total deterministic predictability from initial conditions — is the philosophical bedrock of why LTI analysis works at all."</li>
                    <li>"• If you hear "<em>"Laplace's equation,"</em>" "<em>"Laplace's demon,"</em>" "<em>"the Laplacian operator,"</em>" and "<em>"the Laplace transform"</em>" — they all come from the same man. Most engineering students never realize this."</li>
                </ul>
            </div>

            <p>
                "Next: we generalize the Fourier transform by adding a real exponential to the integrand — and watch transient and unstable signals stop being problems."
            </p>
        </section>
    }
}
