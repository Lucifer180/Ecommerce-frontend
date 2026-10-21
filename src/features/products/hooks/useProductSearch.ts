import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@shared/lib/queryKeys";

import { productsApi } from "../api/products.api";

export const MIN_SEARCH_LENGTH = 2;

/** Normalized the same way the backend builds its cache key, so "Shirt " and "shirt" share a result. */
export const normalizeKeyword = (keyword: string) => keyword.trim().toLowerCase().replace(/\s+/g, " ");

export function useProductSearch(keyword: string) {
    const q = normalizeKeyword(keyword);

    return useQuery({
        queryKey: queryKeys.products.search(q),
        // The signal cancels the request when the user searches for something else mid-crawl.
        queryFn: ({ signal }) => productsApi.search(q, signal),
        enabled: q.length >= MIN_SEARCH_LENGTH,
        // A crawl takes seconds to minutes and the backend caches it for 15 min; match that,
        // and don't silently re-run a slow crawl on failure.
        staleTime: 15 * 60 * 1000,
        retry: false,
        refetchOnWindowFocus: false,
    });
}
