import { client } from "@shared/api/client";

import type { RecommendationInput, Recommendations } from "../types";

class RecommendationsApi {
    async get(input: RecommendationInput, signal?: AbortSignal): Promise<Recommendations> {
        const { data } = await client.post<{ success: boolean; data: Recommendations }>("/recommendations", input, { signal });
        return data.data;
    }
}

export const recommendationsApi = new RecommendationsApi();
