import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, SearchLg } from "@untitledui/icons";
import { ThinkingOrb } from "thinking-orbs";

import { ROUTES } from "@routes/paths";

const STORES = ["Amazon", "Flipkart", "Myntra"];

export const Hero = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");

    return (
        <section className="relative overflow-hidden bg-aurora text-white dark:border-b dark:border-white/10">
            <div className="pointer-events-none absolute inset-0 bg-dot-grid [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" aria-hidden />

            <div className="relative mx-auto flex w-full max-w-container flex-col items-center gap-10 px-4 pt-20 pb-24 text-center md:px-8 md:pt-28 md:pb-32">
                <span className="flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 py-1 pr-4 pl-1.5 text-sm font-medium text-white/80 backdrop-blur">
                    {/* Pinned dark: the hero is always on a dark band, whatever the OS theme. */}
                    <ThinkingOrb state="searching" size={20} theme="dark" />
                    Live prices from {STORES.join(", ")}
                </span>

                <div className="flex max-w-4xl flex-col gap-6">
                    <h1 className="text-display-lg font-bold text-white md:text-display-2xl">
                        Find it once.{" "}
                        <span className="bg-linear-to-r from-brand-300 via-pink-300 to-sky-300 bg-clip-text text-transparent">Pay the least.</span>
                    </h1>
                    <p className="mx-auto max-w-xl text-lg text-white/65 md:text-xl">
                        Search a product and see its price on every store side by side, with AI suggestions for what goes with it.
                    </p>
                </div>

                <form
                    role="search"
                    className="flex w-full max-w-xl items-center gap-2 rounded-full border border-white/15 bg-white/10 p-1.5 pl-5 shadow-2xl ring-1 ring-white/5 backdrop-blur-md transition focus-within:border-white/35"
                    onSubmit={(event) => {
                        event.preventDefault();
                        const keyword = query.trim();
                        navigate(keyword ? `${ROUTES.SEARCH}?q=${encodeURIComponent(keyword)}` : ROUTES.SEARCH);
                    }}
                >
                    <SearchLg className="size-5 shrink-0 text-white/50" aria-hidden />
                    <input
                        aria-label="Search products"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Try “wireless earbuds”"
                        className="min-w-0 flex-1 bg-transparent text-md text-white placeholder:text-white/40 focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="flex shrink-0 items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-950 transition hover:bg-brand-50"
                    >
                        Compare
                        <ArrowRight className="size-4" aria-hidden />
                    </button>
                </form>

                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-white/45">
                    <span>No sign-up to search</span>
                    <span className="hidden size-1 rounded-full bg-white/25 sm:block" />
                    <span>Results in under a minute</span>
                    <span className="hidden size-1 rounded-full bg-white/25 sm:block" />
                    <span>Checkout with Razorpay</span>
                </div>
            </div>
        </section>
    );
};
