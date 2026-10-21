/** What the backend needs to know about the product being styled. */
export interface RecommendationInput {
    title: string;
    brand?: string;
    category?: string;
}

/** An item from another category that goes with the product ("Trousers": "charcoal slim fit chinos"). */
export interface CompleteTheLookItem {
    category: string;
    query: string;
    reason: string;
}

/** An alternative to the product itself. */
export interface SimilarItem {
    query: string;
    reason: string;
}

export interface Recommendations {
    complete: CompleteTheLookItem[];
    similar: SimilarItem[];
}
