import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@shared/lib/queryKeys";

import { recommendationsApi } from "../api/recommendations.api";
import type { RecommendationInput } from "../types";

/**
 * AI "complete the look" suggestions for one product. `enabled` lets a card
 * ask only when the user opens it, so browsing a grid doesn't fire a paid
 * LLM call per card.
 */
export function useRecommendations(input: RecommendationInput, enabled = true) {
    return useQuery({
        queryKey: queryKeys.recommendations.forProduct(input),
        queryFn: ({ signal }) => recommendationsApi.get(input, signal),
        enabled: enabled && input.title.trim().length >= 2,
        // The backend caches for a day; suggestions for a product don't change.
        staleTime: 60 * 60 * 1000,
        retry: false,
        refetchOnWindowFocus: false,
    });
}
