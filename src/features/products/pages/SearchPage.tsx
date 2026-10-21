import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchLg } from "@untitledui/icons";

import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { EmptyState, ErrorState } from "@shared/components/states";
import { getApiErrorMessage } from "@shared/lib/errors";

import { OfferCard, OfferCardSkeleton } from "../components/OfferCard";
import { platformLabel } from "../platforms";
import { MIN_SEARCH_LENGTH, useProductSearch } from "../hooks/useProductSearch";

/** Results come from Crawler-Service, which searches the external stores live. */
export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const keyword = (searchParams.get("q") ?? "").trim();

    const { data, isPending, isError, error, refetch } = useProductSearch(keyword);

    const failedSources = data?.sources.filter((source) => source.status === "failed") ?? [];
    const groups = data?.groups ?? [];

    return (
        <div className="mx-auto flex w-full max-w-container flex-col gap-8 px-4 py-8 md:px-8 md:py-12">
            <header className="flex flex-col gap-2">
                <h1 className="text-display-sm font-semibold text-primary">{keyword ? `Results for “${keyword}”` : "Search"}</h1>
                <p className="text-md text-tertiary">
                    {data
                        ? `${data.total} ${data.total === 1 ? "product" : "products"} across ${data.sources.length} stores`
                        : "Prices from Amazon, Flipkart and Myntra"}
                </p>
            </header>

            {/* Keyed on the URL keyword so the box resets when a link or the header starts a new search. */}
            <SearchForm key={keyword} initial={keyword} onSearch={(q) => setSearchParams({ q })} />

            {keyword.length < MIN_SEARCH_LENGTH ? (
                <EmptyState title="Search for a product" description="We'll look it up on Amazon, Flipkart and Myntra and line up the prices." />
            ) : isError ? (
                <ErrorState description={getApiErrorMessage(error, "We couldn't search the stores right now.")} onRetry={() => refetch()} />
            ) : isPending ? (
                <div className="flex flex-col gap-6">
                    <p role="status" className="text-md text-tertiary">
                        Searching Amazon, Flipkart and Myntra… this can take up to a minute.
                    </p>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <OfferCardSkeleton key={index} />
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    {failedSources.length > 0 && (
                        <p className="rounded-lg border border-secondary bg-secondary px-4 py-3 text-sm text-secondary">
                            {failedSources.map((source) => platformLabel(source.platform)).join(", ")} didn't respond, so{" "}
                            {failedSources.length === 1 ? "its" : "their"} prices are missing.
                        </p>
                    )}

                    {groups.length === 0 ? (
                        <EmptyState title="No products found" description="Try a different or more general search term." />
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {groups.map((group) => (
                                <OfferCard key={group.id} group={group} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

/** The header search is hidden on small screens, so the page carries its own. */
const SearchForm = ({ initial, onSearch }: { initial: string; onSearch: (q: string) => void }) => {
    const [value, setValue] = useState(initial);
    const q = value.trim();

    return (
        <form
            role="search"
            className="flex flex-col gap-3 sm:flex-row sm:items-start"
            onSubmit={(event) => {
                event.preventDefault();
                if (q.length >= MIN_SEARCH_LENGTH) onSearch(q);
            }}
        >
            <Input aria-label="Search products" icon={SearchLg} placeholder="Search shirts, earbuds, phones…" value={value} onChange={setValue} className="flex-1" />
            <Button type="submit" size="md" isDisabled={q.length < MIN_SEARCH_LENGTH}>
                Search
            </Button>
        </form>
    );
};
