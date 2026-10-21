import { useState } from "react";
import { LinkExternal01 } from "@untitledui/icons";

import { Badge } from "@/components/base/badges/badges";
import { cx } from "@/utils/cx";
import { formatPrice } from "@shared/lib/format";

import { platformLabel } from "../platforms";
import type { ProductGroup, ProductOffer } from "../types";

/** The crawler can return the same store twice in one group; show each store once, at its best price. */
const cheapestPerPlatform = (offers: ProductOffer[]) => {
    const best = new Map<string, ProductOffer>();
    for (const offer of offers) {
        const current = best.get(offer.platform);
        if (!current || offer.price < current.price || (offer.price === current.price && !current.url && offer.url)) {
            best.set(offer.platform, offer);
        }
    }
    return [...best.values()].sort((a, b) => a.price - b.price);
};

/**
 * One product as found on external stores. These are not in our catalogue, so
 * there is no cart action: each offer links out to the store's own page.
 */
export const OfferCard = ({ group }: { group: ProductGroup }) => {
    const [imageFailed, setImageFailed] = useState(false);
    const offers = cheapestPerPlatform(group.offers);
    const image = group.image || offers.find((offer) => offer.image)?.image;

    return (
        <article className="flex flex-col overflow-hidden rounded-2xl border border-secondary bg-primary transition duration-200 hover:shadow-lg">
            <div className="flex aspect-4/3 items-center justify-center overflow-hidden bg-secondary">
                {image && !imageFailed ? (
                    <img
                        src={image}
                        alt={group.title}
                        loading="lazy"
                        // Store CDNs often refuse hotlinked images that carry our origin as referrer.
                        referrerPolicy="no-referrer"
                        className="size-full object-contain p-4"
                        onError={() => setImageFailed(true)}
                    />
                ) : (
                    <span className="text-sm text-quaternary">No image</span>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex flex-1 flex-col gap-1">
                    {group.brand && <p className="text-xs font-medium text-brand-secondary uppercase">{group.brand}</p>}
                    <h3 className="line-clamp-2 text-md font-semibold text-primary" title={group.title}>
                        {group.title}
                    </h3>
                </div>

                <ul className="flex flex-col gap-2">
                    {offers.map((offer, index) => {
                        const rowClass = cx(
                            "flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm",
                            index === 0 ? "border-brand" : "border-secondary"
                        );
                        const label = (
                            <span className="flex items-center gap-2 font-medium text-secondary">
                                {platformLabel(offer.platform)}
                                {index === 0 && offers.length > 1 && (
                                    <Badge type="pill-color" color="success" size="sm">
                                        Lowest
                                    </Badge>
                                )}
                            </span>
                        );

                        return (
                            <li key={offer.platform}>
                                {offer.url ? (
                                    <a href={offer.url} target="_blank" rel="noopener noreferrer nofollow" className={cx(rowClass, "transition hover:bg-primary_hover")}>
                                        {label}
                                        <span className="flex items-center gap-1.5 font-semibold text-primary">
                                            {formatPrice(offer.price)}
                                            <LinkExternal01 className="size-4 text-fg-quaternary" aria-hidden />
                                            <span className="sr-only">(opens {platformLabel(offer.platform)} in a new tab)</span>
                                        </span>
                                    </a>
                                ) : (
                                    <div className={rowClass}>
                                        {label}
                                        <span className="font-semibold text-primary">{formatPrice(offer.price)}</span>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </article>
    );
};
