import { client } from "@shared/api/client";

import type { Product, ProductListParams, ProductPage, SearchResult } from "../types";

/**
 * `GET /products` answers with two different shapes:
 *
 *   fresh  → { success, source: "mongodb", currentPage, totalPages, totalProducts, data: Product[] }
 *   cached → { success, source: "redis",   data: { currentPage, totalPages, totalProducts, data: Product[] } }
 *
 * because the controller spreads the service result and the cached branch
 * nests the whole payload under `data`. Normalize both into one `ProductPage`.
 */
type PageBody = {
    currentPage?: number;
    totalPages?: number;
    totalProducts?: number;
    data?: Product[] | PageBody;
};

const normalizePage = (body: PageBody): ProductPage => {
    const inner = Array.isArray(body.data) ? body : ((body.data ?? {}) as PageBody);
    const items = Array.isArray(inner.data) ? inner.data : [];

    return {
        items,
        currentPage: Number(inner.currentPage ?? 1),
        totalPages: Number(inner.totalPages ?? 1),
        totalProducts: Number(inner.totalProducts ?? items.length),
    };
};

class ProductsApi {
    async list(params: ProductListParams): Promise<ProductPage> {
        const { data } = await client.get<PageBody>("/products", { params });
        return normalizePage(data);
    }

    async search(keyword: string, signal?: AbortSignal): Promise<SearchResult> {
        const { data } = await client.get<{ success: boolean; data: SearchResult }>("/products/search", {
            params: { keyword },
            signal,
        });
        return data.data;
    }
}

export const productsApi = new ProductsApi();
