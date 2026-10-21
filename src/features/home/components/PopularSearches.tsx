import { Link } from "react-router-dom";
import { ArrowUpRight } from "@untitledui/icons";

import { ROUTES } from "@routes/paths";

// Starting points for a live search; replaces the old catalogue category tiles.
const POPULAR_SEARCHES = [
    "Running shoes",
    "Wireless earbuds",
    "Men's jeans",
    "Cotton shirts",
    "Smartphones",
    "Smart watches",
    "Backpacks",
    "Sneakers",
];

export const PopularSearches = () => (
    <section className="border-b border-secondary bg-primary">
        <div className="mx-auto flex w-full max-w-container flex-col gap-8 px-4 py-16 md:px-8">
            <div className="flex flex-col gap-2">
                <h2 className="text-display-sm font-semibold text-primary">Popular searches</h2>
                <p className="text-lg text-tertiary">Compare prices across Amazon, Flipkart and Myntra in one go.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {POPULAR_SEARCHES.map((query) => (
                    <Link
                        key={query}
                        to={`${ROUTES.SEARCH}?q=${encodeURIComponent(query)}`}
                        className="group flex items-center justify-between gap-2 rounded-xl border border-secondary bg-primary p-5 transition hover:border-brand hover:shadow-md"
                    >
                        <span className="text-md font-semibold text-primary">{query}</span>
                        <ArrowUpRight className="size-5 text-fg-quaternary transition group-hover:text-fg-brand-primary" />
                    </Link>
                ))}
            </div>
        </div>
    </section>
);
