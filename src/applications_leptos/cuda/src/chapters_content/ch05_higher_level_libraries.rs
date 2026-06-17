use leptos::*;

#[component]
pub fn Ch05() -> impl IntoView {
    view! {
        <h2 class="text-3xl font-black mb-2 text-white">"5. Higher-level Libraries — Thrust, cuBLAS, cuFFT"</h2>
        <p class="text-zinc-400 italic mb-8">
            "Thrust is to CUDA what the C++ STL (plus Boost.Iterator) is to host C++. cuBLAS and cuFFT sit on the same shelf, one cabinet over — domain libraries for linear algebra and FFTs. All three ship with the CUDA Toolkit. If you can avoid writing a kernel, you should."
        </p>

        <section class="space-y-5 text-zinc-300 leading-relaxed">

            // ===== Stack diagram ==============================================
            <h3 class="text-xl font-bold text-white mt-4 mb-3">"Where these libraries sit in the stack"</h3>
            <p>
                "Every CUDA program is layered. At the bottom is the CUDA Runtime — the "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"cudaMalloc"</code>
                ", "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"cudaMemcpy"</code>
                ", "<code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"cudaStream_t"</code>
                " API you saw in chapters 3 and 4. Above it sit two general-purpose building blocks (CUB and libcu++) and on top of those a row of domain libraries (Thrust, cuDNN, cuBLAS, cuFFT, cuRAND, cuSPARSE…). Your application sits on top of all of it."
            </p>
            <div class="my-6 rounded-xl bg-zinc-900/70 border border-zinc-800 p-4 font-mono text-xs sm:text-sm overflow-x-auto">
                <div class="space-y-2 min-w-[28rem]">
                    <div class="px-3 py-2 rounded bg-amber-500/15 border border-amber-500/40 text-amber-200 text-center font-bold">
                        "Application"
                    </div>
                    <div class="grid grid-cols-4 gap-2">
                        <div class="px-2 py-2 rounded bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-center font-bold">
                            "Thrust"
                        </div>
                        <div class="px-2 py-2 rounded bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-center font-bold">
                            "cuDNN"
                        </div>
                        <div class="px-2 py-2 rounded bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-center font-bold">
                            "cuBLAS"
                        </div>
                        <div class="px-2 py-2 rounded bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-center font-bold">
                            "cuFFT / …"
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <div class="px-2 py-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-center">
                            "CUB"
                        </div>
                        <div class="px-2 py-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-center">
                            "libcu++"
                        </div>
                    </div>
                    <div class="px-3 py-2 rounded bg-emerald-500/20 border border-emerald-500/50 text-emerald-100 text-center font-bold">
                        "CUDA Runtime"
                    </div>
                </div>
            </div>
            <p class="text-sm text-zinc-400 italic">
                "The CUDA Runtime underpins the entire stack and exposes the GPU. CUB (\"CUDA Unbound\") provides cooperative warp/block/device primitives; libcu++ is the parallel-aware standard-library replacement. Thrust delegates its hot inner loops to CUB. cuBLAS and cuFFT are independent siblings of Thrust — different domain, same tier."
            </p>

            // ===== Thrust intro ===============================================
            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Thrust — the STL for the GPU"</h3>
            <p>
                "Thrust is a header-only C++ template library that has shipped with the CUDA Toolkit since CUDA 4.0. There is nothing to install, nothing to link — the moment you "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"#include <thrust/…>"</code>
                " in code compiled by "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"nvcc"</code>
                ", it is yours."
            </p>
            <p>
                "Its API is a near-mirror of the C++ STL. If you know "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"std::vector"</code>
                ", "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"std::sort"</code>
                ", "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"std::transform"</code>
                ", you already know most of Thrust:"
            </p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-sm overflow-x-auto">
                <table class="w-full text-zinc-300">
                    <thead>
                        <tr class="text-emerald-300 border-b border-zinc-800">
                            <th class="text-left pb-2 pr-4">"host C++ STL"</th>
                            <th class="text-left pb-2">"Thrust"</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td class="pr-4 py-1">"std::vector<T>"</td><td>"thrust::host_vector<T> / thrust::device_vector<T>"</td></tr>
                        <tr><td class="pr-4 py-1">"std::sort"</td><td>"thrust::sort"</td></tr>
                        <tr><td class="pr-4 py-1">"std::transform"</td><td>"thrust::transform"</td></tr>
                        <tr><td class="pr-4 py-1">"std::reduce / std::accumulate"</td><td>"thrust::reduce"</td></tr>
                        <tr><td class="pr-4 py-1">"std::inclusive_scan"</td><td>"thrust::inclusive_scan"</td></tr>
                        <tr><td class="pr-4 py-1">"std::exclusive_scan"</td><td>"thrust::exclusive_scan"</td></tr>
                        <tr><td class="pr-4 py-1">"std::copy / std::fill"</td><td>"thrust::copy / thrust::fill"</td></tr>
                        <tr><td class="pr-4 py-1">"std::iota"</td><td>"thrust::sequence"</td></tr>
                        <tr><td class="pr-4 py-1">"std::execution::par"</td><td>"thrust::device  (execution policy)"</td></tr>
                    </tbody>
                </table>
            </div>
            <p>
                "And on top of the STL parallels, Thrust also borrows the "<em>"fancy iterator"</em>" vocabulary from "
                <strong class="text-emerald-300">"Boost.Iterator"</strong>
                " — "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"counting_iterator"</code>
                ", "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"transform_iterator"</code>
                ", "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"zip_iterator"</code>
                ", "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"permutation_iterator"</code>
                ". So the most precise one-line description is:"
            </p>
            <div class="my-6 p-5 rounded-xl bg-emerald-500/5 border-l-4 border-emerald-400">
                <p class="text-emerald-100 m-0">
                    <strong>"Thrust ≈ (C++ STL + Boost.Iterator), but the algorithms run on the GPU."</strong>
                </p>
            </div>

            <h3 class="text-xl font-bold text-white mt-10 mb-3">"A first example — fill, sort, reduce in five lines"</h3>
            <pre class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 text-sm overflow-x-auto"><code class="language-cpp">{"#include <thrust/device_vector.h>
#include <thrust/sequence.h>
#include <thrust/sort.h>
#include <thrust/reduce.h>
#include <thrust/functional.h>
#include <cstdio>

int main() {
    thrust::device_vector<int> d(1'000'000);

    thrust::sequence(d.begin(), d.end());                  // 0, 1, 2, ..., N-1
    thrust::sort(d.begin(), d.end(), thrust::greater<int>()); // descending
    int sum = thrust::reduce(d.begin(), d.end(), 0);

    printf(\"sum = %d\\n\", sum);
    return 0;
}"}</code></pre>
            <p>
                "Five lines, GPU-resident. The "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"device_vector"</code>
                " is "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"cudaMalloc"</code>
                " + RAII; assigning to it triggers "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"cudaMemcpy"</code>
                "; destructor calls "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"cudaFree"</code>
                ". You no longer manage any of the host-side API from chapter 4 by hand."
            </p>
            <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
                <p class="text-zinc-300 m-0">
                    <strong class="text-emerald-300">"Under the hood:"</strong>
                    " "<code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"thrust::sort"</code>
                    " on integers dispatches to a CUB radix sort. Hand-rolling the same kernel in raw CUDA is several hundred lines and almost always slower than what CUB ships. The same is true of "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"reduce"</code>
                    ", "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"scan"</code>
                    ", and "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"unique"</code>
                    "."
                </p>
            </div>

            // ===== Execution policies =========================================
            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Execution policies — thrust::host vs thrust::device"</h3>
            <p>
                "Every Thrust algorithm takes an optional first argument: an "
                <strong class="text-emerald-300">"execution policy"</strong>
                ". This is the knob that decides where the algorithm runs."
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                <div class="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800">
                    <div class="text-xs uppercase tracking-wider text-sky-300 mb-2 font-bold">"plain C++"</div>
                    <pre class="text-sm overflow-x-auto"><code class="language-cpp">{"std::transform(temp.begin(), temp.end(),
               temp.begin(), op);"}</code></pre>
                </div>
                <div class="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800">
                    <div class="text-xs uppercase tracking-wider text-emerald-300 mb-2 font-bold">"CUDA C++ / Thrust"</div>
                    <pre class="text-sm overflow-x-auto"><code class="language-cpp">{"thrust::transform(thrust::device,
                  temp.begin(), temp.end(),
                  temp.begin(), op);"}</code></pre>
                </div>
            </div>
            <p>"Two policies cover most usage:"</p>
            <ul class="list-disc list-inside space-y-1 pl-2">
                <li>
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"thrust::host"</code>
                    " — run on the CPU. Identical semantics to the STL version."
                </li>
                <li>
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"thrust::device"</code>
                    " — run on the GPU."
                </li>
            </ul>
            <p>
                "If you omit the policy, Thrust picks one for you based on the iterator type ("
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"device_vector"</code>
                "'s iterators imply "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"thrust::device"</code>
                "). Being explicit is recommended once you start mixing iterator categories or using raw pointers."
            </p>
            <div class="my-6 p-5 rounded-xl bg-sky-500/5 border-l-4 border-sky-400">
                <p class="text-sky-100 m-0">
                    <strong>"Not a Thrust invention."</strong>
                    " C++17's "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-200 font-mono text-sm">"std::execution::par"</code>
                    " is the same idea — and Thrust's execution policies are what "<em>"inspired"</em>
                    " the C++17 design. If you have ever written "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-200 font-mono text-sm">"std::sort(std::execution::par, …)"</code>
                    ", you already know how this works."
                </p>
            </div>

            // ===== Policy vs Specifier =========================================
            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Execution policy vs execution-space specifier — the biggest gotcha"</h3>
            <p>"There are two different knobs that look superficially similar, and confusing them is the source of every \"why won't this Thrust call compile\" StackOverflow question:"</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                <div class="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800">
                    <div class="text-xs uppercase tracking-wider text-amber-300 mb-2 font-bold">"Compile time"</div>
                    <p class="m-0 text-sm">
                        <strong class="text-amber-300">"Execution-space specifier"</strong>
                        " — "
                        <code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-xs">"__host__"</code>
                        " / "
                        <code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-xs">"__device__"</code>
                        ". Tells "
                        <code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-xs">"nvcc"</code>
                        " where this code "<em>"can"</em>" run. Affects which compiler back-end (host or device) emits an object file."
                    </p>
                </div>
                <div class="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800">
                    <div class="text-xs uppercase tracking-wider text-emerald-300 mb-2 font-bold">"Run time"</div>
                    <p class="m-0 text-sm">
                        <strong class="text-emerald-300">"Execution policy"</strong>
                        " — "
                        <code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-xs">"thrust::host"</code>
                        " / "
                        <code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-xs">"thrust::device"</code>
                        ". Tells Thrust where the algorithm "<em>"will"</em>" run. Affects dispatch."
                    </p>
                </div>
            </div>
            <p>"For your code to actually work, the two have to agree. The truth table:"</p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-sm overflow-x-auto">
                <table class="w-full text-zinc-300">
                    <thead>
                        <tr class="text-emerald-300 border-b border-zinc-800">
                            <th class="text-left pb-2 pr-4">"policy ↓  /  specifier →"</th>
                            <th class="text-left pb-2 pr-4">"__host__"</th>
                            <th class="text-left pb-2 pr-4">"__device__"</th>
                            <th class="text-left pb-2">"__host__ __device__"</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="pr-4 py-1">"thrust::host"</td>
                            <td class="pr-4 text-sky-300">"runs on CPU"</td>
                            <td class="pr-4 text-rose-400">"error"</td>
                            <td class="text-sky-300">"runs on CPU"</td>
                        </tr>
                        <tr>
                            <td class="pr-4 py-1">"thrust::device"</td>
                            <td class="pr-4 text-rose-400">"error"</td>
                            <td class="pr-4 text-emerald-300">"runs on GPU"</td>
                            <td class="text-emerald-300">"runs on GPU"</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p>
                "Worked example — a lambda functor that the host compiler emits "<em>"and"</em>" the device compiler emits, then handed to a device policy:"
            </p>
            <pre class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 text-sm overflow-x-auto"><code class="language-cpp">{"const float k = 3.14f, diff = 0.5f;
auto op = [=] __host__ __device__ (float t) {
    return t + k * diff;
};

thrust::transform(thrust::device,
                  d.begin(), d.end(), d.begin(), op);
//                ^^^^^^^^^^^^^^^^      ^^
//                policy = run on GPU   specifier on the lambda allows it"}</code></pre>
            <div class="my-6 p-5 rounded-xl bg-amber-500/5 border-l-4 border-amber-400">
                <p class="text-amber-100 m-0">
                    <strong>"Tip: default to "</strong>
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-amber-200 font-mono text-sm">"__host__ __device__"</code>
                    " on your functors. It is the only column of the table without an error cell — your code will compile against either policy and you can switch backends without touching the functor."
                </p>
            </div>

            // ===== Fancy iterators ============================================
            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Fancy iterators — the Boost flavor"</h3>
            <p>"These are the iterators that materialize values on the fly, so you can compose algorithms without ever allocating an intermediate buffer. Three you will use the most:"</p>
            <ul class="list-disc list-inside space-y-2 pl-2">
                <li>
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"counting_iterator<T>(n)"</code>
                    " — generates "<code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"n, n+1, n+2, …"</code>" without any storage."
                </li>
                <li>
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"transform_iterator(it, op)"</code>
                    " — applies "<code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"op"</code>" on every dereference. Fused with whatever consumes it."
                </li>
                <li>
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"zip_iterator(make_tuple(it_a, it_b))"</code>
                    " — co-iterate two (or more) streams, dereferencing to a tuple."
                </li>
            </ul>
            <p>"Compute the weighted sum "<code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"Σ i · w[i]"</code>" with zero temporaries:"</p>
            <pre class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 text-sm overflow-x-auto"><code class="language-cpp">{"#include <thrust/device_vector.h>
#include <thrust/inner_product.h>
#include <thrust/iterator/counting_iterator.h>

thrust::device_vector<float> w(N);
// ... fill w ...

float dot = thrust::inner_product(
    thrust::counting_iterator<int>(0),       // 0, 1, 2, ..., N-1
    thrust::counting_iterator<int>(N),
    w.begin(),
    0.0f);
// No intermediate vector ever allocated. The 0..N-1 sequence
// is synthesized inside the reduction kernel."}</code></pre>

            // ===== Reality check ==============================================
            <h3 class="text-xl font-bold text-white mt-10 mb-3">"What Thrust is NOT"</h3>
            <div class="my-6 p-5 rounded-xl bg-rose-500/5 border-l-4 border-rose-400">
                <ul class="space-y-2 text-rose-100 m-0 list-none p-0">
                    <li>"• Not a substitute for hand-tuned kernels at the FlashAttention / fused-GEMM tier. Those still need bespoke CUDA, often written against CUB or "<code class="px-1 py-0.5 rounded bg-zinc-800 text-rose-200 font-mono text-sm">"<cuda/std/…>"</code>" directly."</li>
                    <li>"• Not zero-overhead for tiny problems. Each algorithm call still pays a launch cost on the order of tens of microseconds."</li>
                    <li>"• Not (today) as graph-friendly as raw kernels — capturing Thrust into a "<code class="px-1 py-0.5 rounded bg-zinc-800 text-rose-200 font-mono text-sm">"cudaGraph_t"</code>" works but with caveats."</li>
                </ul>
            </div>

            // ===== cuBLAS =====================================================
            <h3 class="text-xl font-bold text-white mt-10 mb-3">"cuBLAS — Basic Linear Algebra Subprograms, on the GPU"</h3>
            <p>
                "cuBLAS is NVIDIA's GPU implementation of "<strong class="text-emerald-300">"BLAS"</strong>
                " — the half-century-old Fortran-era API for dense linear algebra. It is partitioned into three levels:"
            </p>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-sm overflow-x-auto">
                <table class="w-full text-zinc-300">
                    <thead>
                        <tr class="text-emerald-300 border-b border-zinc-800">
                            <th class="text-left pb-2 pr-4">"Level"</th>
                            <th class="text-left pb-2 pr-4">"Shape"</th>
                            <th class="text-left pb-2">"Example call"</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td class="pr-4 py-1">"1"</td><td class="pr-4">"vector ↔ vector"</td><td>"cublasSaxpy, cublasSdot, cublasSnrm2"</td></tr>
                        <tr><td class="pr-4 py-1">"2"</td><td class="pr-4">"matrix ↔ vector"</td><td>"cublasSgemv"</td></tr>
                        <tr><td class="pr-4 py-1">"3"</td><td class="pr-4">"matrix ↔ matrix"</td><td>"cublasSgemm  (the workhorse)"</td></tr>
                    </tbody>
                </table>
            </div>
            <p>
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"gemm"</code>
                " (general matrix multiply) is the call that runs the world. Every neural network forward and backward pass, every Gaussian process fit, every classical solver eventually decomposes into "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"gemm"</code>
                ". cuBLAS's "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"gemm"</code>
                " is hand-tuned per architecture and per matrix shape. You will not beat it."
            </p>
            <p>
                "The API is "<em>"C"</em>" (not C++). You allocate a "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"cublasHandle_t"</code>
                ", pass raw device pointers, and dispatch:"
            </p>
            <pre class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 text-sm overflow-x-auto"><code class="language-cpp">{"// C = alpha * A * B + beta * C        (single precision, no transpose)
//   A : M x K     (column-major)
//   B : K x N
//   C : M x N
#include <cublas_v2.h>
#include <cuda_runtime.h>

int M = 1024, N = 1024, K = 1024;
float alpha = 1.0f, beta = 0.0f;

float *dA, *dB, *dC;
cudaMalloc(&dA, sizeof(float) * M * K);
cudaMalloc(&dB, sizeof(float) * K * N);
cudaMalloc(&dC, sizeof(float) * M * N);
// ... upload A and B into dA, dB ...

cublasHandle_t h;
cublasCreate(&h);

cublasSgemm(h,
            CUBLAS_OP_N, CUBLAS_OP_N,        // op(A), op(B): no transpose
            M, N, K,                          // m, n, k
            &alpha,
            dA, M,                            // lda = leading dim of A
            dB, K,                            // ldb
            &beta,
            dC, M);                           // ldc

cublasDestroy(h);
cudaFree(dA); cudaFree(dB); cudaFree(dC);"}</code></pre>
            <div class="my-6 p-5 rounded-xl bg-amber-500/5 border-l-4 border-amber-400">
                <p class="text-amber-100 m-0">
                    <strong>"Column-major, by inheritance."</strong>
                    " cuBLAS uses Fortran's column-major layout because it is BLAS. If your matrices are row-major (the C/C++ default, and what NumPy / PyTorch use), the standard trick is to call "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-amber-200 font-mono text-sm">"gemm"</code>
                    " with the operands swapped and transposed: "
                    <code class="px-1 py-0.5 rounded bg-zinc-800 text-amber-200 font-mono text-sm">"C^T = B^T · A^T"</code>
                    "."
                </p>
            </div>
            <p>
                "Two variants worth knowing exist alongside cuBLAS: "
                <strong class="text-emerald-300">"cuBLASLt"</strong>
                " — a lower-overhead, more flexible GEMM path with epilogues (bias + activation fused into the kernel) and FP8 / FP16 / BF16 support; and "
                <strong class="text-emerald-300">"cuBLASXt"</strong>
                " — multi-GPU dispatch for matrices that exceed one device's memory."
            </p>

            // ===== cuFFT =====================================================
            <h3 class="text-xl font-bold text-white mt-10 mb-3">"cuFFT — Fast Fourier Transform on the GPU"</h3>
            <p>
                "cuFFT is the GPU implementation of the FFT. Its API is intentionally modelled on "
                <strong class="text-emerald-300">"FFTW"</strong>
                " (the CPU gold standard): you create a "<em>"plan"</em>" once, then execute it as many times as you want. The plan caches the twiddle factors and the kernel-launch shape; the executes are cheap."
            </p>
            <p>"What it covers:"</p>
            <ul class="list-disc list-inside space-y-1 pl-2">
                <li>"1D, 2D, 3D transforms"</li>
                <li>"complex-to-complex (C2C), real-to-complex (R2C), complex-to-real (C2R)"</li>
                <li>"single (32-bit) and double (64-bit) precision"</li>
                <li>"batched transforms — many small FFTs of the same shape in one launch"</li>
            </ul>
            <p>"A 1D forward complex-to-complex transform of length N:"</p>
            <pre class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 text-sm overflow-x-auto"><code class="language-cpp">{"#include <cufft.h>
#include <cuda_runtime.h>

const int N = 1 << 20;
cufftComplex* d_data;
cudaMalloc(&d_data, sizeof(cufftComplex) * N);
// ... fill d_data with the input signal ...

cufftHandle plan;
cufftPlan1d(&plan, N, CUFFT_C2C, /*batch=*/1);

cufftExecC2C(plan, d_data, d_data, CUFFT_FORWARD);   // in-place
// ... d_data now holds the spectrum ...

cufftDestroy(plan);
cudaFree(d_data);"}</code></pre>
            <p>
                "cuFFT is the engine inside almost every GPU FFT you have ever used indirectly: "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"torch.fft"</code>
                ", CuPy's "
                <code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"cupy.fft"</code>
                ", MATLAB's GPU FFT, MRI reconstruction pipelines, radar matched filters, and the FFT-based convolution path of most CNNs all bottom out in cuFFT."
            </p>

            // ===== Which library when =========================================
            <h3 class="text-xl font-bold text-white mt-10 mb-3">"Quick reference — which library, when?"</h3>
            <div class="my-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-sm overflow-x-auto">
                <table class="w-full text-zinc-300">
                    <thead>
                        <tr class="text-emerald-300 border-b border-zinc-800">
                            <th class="text-left pb-2 pr-4">"I want to …"</th>
                            <th class="text-left pb-2">"Reach for"</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td class="pr-4 py-1">"sort / scan / reduce / transform a device array"</td><td>"Thrust"</td></tr>
                        <tr><td class="pr-4 py-1">"dense matrix multiply (GEMM)"</td><td>"cuBLAS"</td></tr>
                        <tr><td class="pr-4 py-1">"FFT (1D / 2D / 3D, real or complex)"</td><td>"cuFFT"</td></tr>
                        <tr><td class="pr-4 py-1">"convolution / batchnorm / attention building blocks"</td><td>"cuDNN"</td></tr>
                        <tr><td class="pr-4 py-1">"sparse matrix / sparse linear algebra"</td><td>"cuSPARSE"</td></tr>
                        <tr><td class="pr-4 py-1">"pseudo-random number generation"</td><td>"cuRAND"</td></tr>
                        <tr><td class="pr-4 py-1">"dense LAPACK-style solvers (LU, QR, SVD)"</td><td>"cuSOLVER"</td></tr>
                        <tr><td class="pr-4 py-1">"hot custom kernel below all of the above"</td><td>"raw CUDA + CUB"</td></tr>
                    </tbody>
                </table>
            </div>

            // ===== Take-aways =================================================
            <h3 class="text-xl font-bold text-white mt-10 mb-3">"What you should take from this chapter"</h3>
            <div class="my-6 p-5 rounded-xl bg-zinc-900/70 border border-zinc-800">
                <ul class="space-y-2 text-zinc-300 m-0 list-none p-0">
                    <li>"• Thrust is the C++ STL ("<em>"plus"</em>" Boost.Iterator) for the GPU — same vocabulary, GPU backend, no install."</li>
                    <li>"• "<code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"device_vector"</code>" is RAII over "<code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"cudaMalloc"</code>" / "<code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"cudaMemcpy"</code>" / "<code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"cudaFree"</code>"."</li>
                    <li>"• Execution "<em>"policy"</em>" ("<code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"thrust::host"</code>" / "<code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"thrust::device"</code>") = where it "<em>"runs"</em>". Execution-space "<em>"specifier"</em>" ("<code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"__host__"</code>" / "<code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"__device__"</code>") = where it "<em>"can"</em>" run. Both must agree."</li>
                    <li>"• Default to "<code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"__host__ __device__"</code>" lambdas so either policy works."</li>
                    <li>"• Fancy iterators ("<code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"counting"</code>", "<code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"transform"</code>", "<code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"zip"</code>") let you compose algorithms with zero intermediate buffers."</li>
                    <li>"• cuBLAS is the BLAS — "<code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"gemm"</code>" is the workhorse; mind the column-major convention."</li>
                    <li>"• cuFFT is the FFTW for the GPU — plan once, execute many. Everyone's "<code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"torch.fft"</code>" / "<code class="px-1 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono text-sm">"cupy.fft"</code>" calls cuFFT under the hood."</li>
                </ul>
            </div>

            <p>"Next: the "<strong class="text-emerald-300">"Bibliography"</strong>" chapter links the two NVIDIA Developer videos this chapter is built on."</p>

        </section>
    }
}
