import { useQueries } from "@tanstack/react-query";

// Direct file imports rather than the products barrel: products already imports this feature.
import { productsApi } from "@features/products/api/products.api";
import { normalizeKeyword } from "@features/products/hooks/useProductSearch";
import type { SearchResult } from "@features/products/types";
import { queryKeys } from "@shared/lib/queryKeys";

import type { CompleteTheLookItem, LookAnchor, LookPiece } from "../types";

/** Top result's photo and the lowest price across all of its store offers. */
const toPiece = (item: CompleteTheLookItem, result: SearchResult | undefined, status: LookPiece["status"]): LookPiece => {
    const piece: LookPiece = { key: item.query, category: item.category, title: item.query, reason: item.reason, query: item.query, status };
    if (!result) return piece;

    const group = result.groups.find((candidate) => candidate.image || candidate.offers.some((offer) => offer.image));
    if (!group) return { ...piece, status: "empty" };

    const cheapest = [...group.offers].sort((a, b) => a.price - b.price)[0];
    return {
        ...piece,
        image: group.image || group.offers.find((offer) => offer.image)?.image,
        price: cheapest?.price,
        platform: cheapest?.platform,
    };
};

/**
 * Runs a live store search for each suggestion so the 3D view can show a
 * real photo and price. Same query key and options as `useProductSearch`, so a
 * piece the user already searched for (or opens later) is a cache hit.
 */
export function useLookPieces(anchor: LookAnchor, items: CompleteTheLookItem[], enabled: boolean) {
    const results = useQueries({
        queries: items.map((item) => {
            const q = normalizeKeyword(item.query);
            return {
                queryKey: queryKeys.products.search(q),
                queryFn: ({ signal }: { signal: AbortSignal }) => productsApi.search(q, signal),
                enabled,
                staleTime: 15 * 60 * 1000,
                retry: false,
                refetchOnWindowFocus: false,
            };
        }),
    });

    const anchorPiece: LookPiece = {
        key: `anchor:${anchor.title}`,
        category: "Your pick",
        title: anchor.title,
        query: anchor.title,
        image: anchor.image,
        price: anchor.price,
        status: "ready",
        isAnchor: true,
    };

    const pieces = items.map((item, index) => {
        const { data, isPending, isError } = results[index];
        return toPiece(item, data, isError ? "error" : isPending ? "loading" : "ready");
    });

    return {
        pieces: [anchorPiece, ...pieces],
        loadingCount: pieces.filter((piece) => piece.status === "loading").length,
    };
}
