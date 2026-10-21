import type { ProductListParams } from "@features/products/types";
import type { RecommendationInput } from "@features/recommendations/types";

export const queryKeys = {
    auth: {
        me: ["auth", "me"] as const,
    },
    products: {
        all: ["products"] as const,
        list: (params: ProductListParams) => ["products", "list", params] as const,
        search: (keyword: string) => ["products", "search", keyword] as const,
    },
    recommendations: {
        forProduct: (input: RecommendationInput) => ["recommendations", input] as const,
    },
    cart: {
        all: ["cart"] as const,
    },
    orders: {
        mine: ["orders", "mine"] as const,
    },
    admin: {
        users: ["admin", "users"] as const,
    },
};
