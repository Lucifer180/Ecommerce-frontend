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

/** The product the look is built around, as shown in the 3D view. */
export interface LookAnchor {
    title: string;
    image?: string;
    price?: number;
}

/** One card in the 3D carousel. */
export interface LookPiece {
    key: string;
    category: string;
    title: string;
    reason?: string;
    /** What clicking the piece searches for. */
    query: string;
    image?: string;
    price?: number;
    platform?: string;
    /** "empty": the search ran but found nothing with a photo. */
    status: "loading" | "ready" | "empty" | "error";
    isAnchor?: boolean;
}

export interface Recommendations {
    complete: CompleteTheLookItem[];
    similar: SimilarItem[];
}
