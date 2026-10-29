import { Blobatar } from "@blobatar/react";
import "blobatar/motion.css";

import { cx } from "@/utils/cx";

type BlobAvatarProps = {
    /** Any stable string for the person; the same seed always draws the same face. */
    seed: string;
    size?: number;
    /** Animate on hover. Renders inline SVG instead of an `<img>`. */
    animated?: boolean;
    className?: string;
    alt?: string;
};

/** Deterministic generated avatar (https://blobatar.dev), used where we have no profile photo. */
export const BlobAvatar = ({ seed, size = 40, animated = false, className, alt = "" }: BlobAvatarProps) => (
    <span className={cx("inline-flex shrink-0 overflow-hidden rounded-full ring-1 ring-secondary", className)} style={{ width: size, height: size }}>
        {animated ? <Blobatar name={seed} size={size} animate="hover" aria-label={alt || undefined} /> : <Blobatar name={seed} size={size} alt={alt} />}
    </span>
);
