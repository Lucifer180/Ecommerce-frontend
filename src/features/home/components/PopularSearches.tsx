import { Link } from "react-router-dom";
import { ArrowUpRight } from "@untitledui/icons";

import { lineHoverClass } from "@/components/base/line-hover-link/line-hover-class";
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
    <section className="border-y border-secondary bg-secondary/40">
        <div className="mx-auto flex w-full max-w-container flex-col gap-10 px-4 py-20 md:px-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div className="flex flex-col gap-3">
                    <p className="text-sm font-semibold tracking-widest text-brand-secondary uppercase">Trending</p>
                    <h2 className="text-display-sm font-bold text-primary">Popular searches</h2>
                </div>
                <Link to={ROUTES.SEARCH} className={lineHoverClass("grow", "text-md font-semibold text-primary")}>
                    Search anything
                </Link>
            </div>

            <ul className="grid grid-cols-1 border-t border-secondary sm:grid-cols-2">
                {POPULAR_SEARCHES.map((query, index) => (
                    <li key={query} className="border-b border-secondary sm:odd:border-r sm:odd:pr-8 sm:even:pl-8">
                        <Link to={`${ROUTES.SEARCH}?q=${encodeURIComponent(query)}`} className="group flex items-center justify-between gap-4 py-5">
                            <span className="flex items-baseline gap-5">
                                <span className="w-6 font-mono text-sm text-quaternary">{String(index + 1).padStart(2, "0")}</span>
                                <span className={lineHoverClass("slide", "font-display text-xl font-semibold text-primary md:text-display-xs")}>{query}</span>
                            </span>
                            <span className="flex size-10 items-center justify-center rounded-full border border-secondary text-fg-quaternary transition group-hover:rotate-45 group-hover:border-brand group-hover:bg-brand-solid group-hover:text-white">
                                <ArrowUpRight className="size-5" aria-hidden />
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    </section>
);
