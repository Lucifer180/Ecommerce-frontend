/** A populated `Upload` document. Note it carries an S3 key, not a public URL. */
export interface ProductImage {
    _id: string;
    originalName: string;
    s3Key: string;
    mimeType: string;
}

export interface Product {
    _id: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
    category?: string;
    images?: ProductImage[];
    createdAt?: string;
    updatedAt?: string;
}

export interface ProductListParams {
    keyword?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
}

/** Normalized page of products, regardless of which backend shape arrived. */
export interface ProductPage {
    items: Product[];
    currentPage: number;
    totalPages: number;
    totalProducts: number;
}

/**
 * Search results come from Crawler-Service (via `GET /products/search`), not the
 * Mongo catalogue: each group is one product as listed on external stores.
 */
export type Platform = "amazon" | "flipkart" | "myntra" | (string & {});

export interface ProductOffer {
    platform: Platform;
    price: number;
    /** Can be null when the crawler couldn't read the product link off the listing page. */
    url: string | null;
    image: string;
}

export interface ProductGroup {
    id: string;
    title: string;
    brand?: string;
    image: string;
    offers: ProductOffer[];
}

export interface SearchSource {
    platform: Platform;
    status: "ok" | "failed";
    count: number;
    durationMs: number;
    error?: string;
}

export interface SearchResult {
    query: string;
    total: number;
    groups: ProductGroup[];
    sources: SearchSource[];
}
