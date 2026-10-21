import { Link } from "react-router-dom";
import { ArrowRight, Stars02 } from "@untitledui/icons";

import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import { ROUTES } from "@routes/paths";

import { useRecommendations } from "../hooks/useRecommendations";
import type { RecommendationInput } from "../types";

const searchHref = (query: string) => `${ROUTES.SEARCH}?q=${encodeURIComponent(query)}`;

type Props = {
    product: RecommendationInput;
    /** "section" for a product page, "compact" inside a search result card. */
    variant?: "section" | "compact";
    enabled?: boolean;
    className?: string;
};

/**
 * Items that go with the product, suggested by the LLM. Each suggestion is a
 * search query, so clicking one runs a live search across the stores.
 */
export const CompleteTheLook = ({ product, variant = "section", enabled = true, className }: Props) => {
    const { data, isPending, isError, refetch } = useRecommendations(product, enabled);
    const compact = variant === "compact";

    if (isError) {
        return (
            <div className={cx("flex items-center justify-between gap-3 text-sm text-tertiary", className)}>
                <span>Couldn't load suggestions.</span>
                <Button size="sm" color="link-color" onPress={() => refetch()}>
                    Try again
                </Button>
            </div>
        );
    }

    if (isPending) {
        return (
            <div role="status" className={cx("flex flex-col gap-2", className)}>
                <span className="sr-only">Loading suggestions</span>
                {Array.from({ length: compact ? 3 : 4 }).map((_, index) => (
                    <div key={index} className={cx("animate-pulse rounded-lg bg-secondary", compact ? "h-9" : "h-20")} />
                ))}
            </div>
        );
    }

    // Nothing sensible to suggest: hide rather than show an empty box.
    if (!data.complete.length && !data.similar.length) return null;

    if (compact) {
        return (
            <div className={cx("flex flex-col gap-3", className)}>
                {data.complete.length > 0 && (
                    <ul className="flex flex-col gap-1.5">
                        {data.complete.map((item) => (
                            <li key={item.query}>
                                <Link
                                    to={searchHref(item.query)}
                                    title={item.reason}
                                    className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm transition hover:bg-primary_hover"
                                >
                                    <span className="min-w-0">
                                        <span className="block text-xs font-medium text-brand-secondary">{item.category}</span>
                                        <span className="block truncate font-medium text-secondary first-letter:uppercase">{item.query}</span>
                                    </span>
                                    <ArrowRight className="size-4 shrink-0 text-fg-quaternary" aria-hidden />
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
                {data.similar.length > 0 && <SimilarChips items={data.similar} />}
            </div>
        );
    }

    return (
        <section aria-labelledby="complete-the-look" className={cx("flex flex-col gap-6", className)}>
            <header className="flex flex-col gap-1">
                <h2 id="complete-the-look" className="flex items-center gap-2 text-lg font-semibold text-primary">
                    <Stars02 className="size-5 text-fg-brand-primary" aria-hidden />
                    Complete the look
                </h2>
                <p className="text-sm text-tertiary">AI-suggested pieces that go with this. Click one to compare prices across stores.</p>
            </header>

            {data.complete.length > 0 && (
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {data.complete.map((item) => (
                        <li key={item.query}>
                            <Link
                                to={searchHref(item.query)}
                                className="group flex h-full flex-col gap-2 rounded-xl border border-secondary bg-primary p-4 transition hover:border-brand hover:shadow-md"
                            >
                                <span className="text-xs font-semibold text-brand-secondary uppercase">{item.category}</span>
                                <span className="text-md font-semibold text-primary first-letter:uppercase">{item.query}</span>
                                {item.reason && <span className="flex-1 text-sm text-tertiary">{item.reason}</span>}
                                <span className="flex items-center gap-1 text-sm font-semibold text-brand-secondary">
                                    Shop this
                                    <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}

            {data.similar.length > 0 && (
                <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-semibold text-secondary">Similar styles</h3>
                    <SimilarChips items={data.similar} />
                </div>
            )}
        </section>
    );
};

const SimilarChips = ({ items }: { items: { query: string; reason: string }[] }) => (
    <ul className="flex flex-wrap gap-2" aria-label="Similar styles">
        {items.map((item) => (
            <li key={item.query}>
                <Link
                    to={searchHref(item.query)}
                    title={item.reason}
                    className="inline-flex rounded-full border border-secondary px-3 py-1 text-xs font-medium text-secondary transition first-letter:uppercase hover:bg-primary_hover"
                >
                    {item.query}
                </Link>
            </li>
        ))}
    </ul>
);
