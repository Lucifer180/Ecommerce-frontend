import { cx } from "@/utils/cx";

import "./line-hover-link.css";

/**
 * slide  - line slides in from the right
 * double - two lines with offset timings
 * grow   - line thickens as it draws
 * fade   - two lines fade up, staggered
 * swap   - two lines travel in opposite directions
 */
export type LineHoverVariant = "slide" | "double" | "grow" | "fade" | "swap";

/** For plain `<a>` or `<Link>` elements that want the same underline. */
export const lineHoverClass = (variant: LineHoverVariant = "slide", className?: string) => cx("link-hover", `link-hover--${variant}`, className);
