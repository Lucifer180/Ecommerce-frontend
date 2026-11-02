import { useState } from "react";
import { Link } from "react-router-dom";
import { ThinkingOrb } from "thinking-orbs";

import { platformLabel } from "@features/products/platforms";
import { ROUTES } from "@routes/paths";
import { formatPrice } from "@shared/lib/format";
import { cx } from "@/utils/cx";

import type { LookPiece } from "../../types";

type Props = {
    piece: LookPiece;
    /** Called before navigating, so the viewer can close itself. */
    onNavigate?: () => void;
    className?: string;
    /** The 3D carousel handles drags itself and suppresses the click after one. */
    draggable?: boolean;
};

/** Photo, category and price for one piece of the look; links to a price comparison for it. */
export const LookPieceCard = ({ piece, onNavigate, className, draggable = true }: Props) => {
    const [imageFailed, setImageFailed] = useState(false);
    const showImage = piece.image && !imageFailed;

    return (
        <Link
            to={`${ROUTES.SEARCH}?q=${encodeURIComponent(piece.query)}`}
            onClick={onNavigate}
            draggable={draggable}
            title={piece.reason}
            className={cx(
                "group flex h-full flex-col overflow-hidden rounded-2xl border bg-primary shadow-lg outline-focus-ring transition focus-visible:outline-2 focus-visible:outline-offset-2",
                piece.isAnchor ? "border-brand ring-2 ring-brand-500/30" : "border-secondary",
                className
            )}
        >
            <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-white">
                {showImage ? (
                    <img
                        src={piece.image}
                        alt=""
                        loading="lazy"
                        draggable={false}
                        // Store CDNs often refuse hotlinked images that carry our origin as referrer.
                        referrerPolicy="no-referrer"
                        className="size-full object-contain p-3 transition duration-300 group-hover:scale-105"
                        onError={() => setImageFailed(true)}
                    />
                ) : piece.status === "loading" ? (
                    <span className="flex flex-col items-center gap-2 text-xs text-gray-500">
                        {/* The photo well is always white, so pin dark ink. */}
                        <ThinkingOrb state="searching" size={32} theme="light" aria-hidden />
                        Finding it…
                    </span>
                ) : (
                    <span className="px-3 text-center text-xs text-gray-500">{piece.status === "error" ? "Couldn't load" : "No photo"}</span>
                )}
                {piece.isAnchor && (
                    <span className="absolute top-2 left-2 rounded-full bg-brand-solid px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase">
                        Your pick
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-1 p-3">
                {!piece.isAnchor && <span className="text-[11px] font-semibold tracking-wide text-brand-secondary uppercase">{piece.category}</span>}
                <span className="line-clamp-2 text-sm font-semibold text-primary first-letter:uppercase">{piece.title}</span>
                <span className="mt-auto pt-1 text-sm text-tertiary">
                    {piece.price !== undefined ? (
                        <>
                            <span className="font-semibold text-primary">{piece.isAnchor ? formatPrice(piece.price) : `from ${formatPrice(piece.price)}`}</span>
                            {piece.platform && <span> · {platformLabel(piece.platform)}</span>}
                        </>
                    ) : piece.status === "loading" ? (
                        <span className="inline-block h-4 w-20 animate-pulse rounded bg-secondary align-middle" />
                    ) : (
                        "Compare prices"
                    )}
                </span>
            </div>
        </Link>
    );
};
