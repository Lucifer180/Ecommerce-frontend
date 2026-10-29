import type { ComponentProps } from "react";
import { NavLink } from "react-router-dom";

import { lineHoverClass, type LineHoverVariant } from "./line-hover-class";

type LineHoverLinkProps = Omit<ComponentProps<typeof NavLink>, "className"> & {
    variant?: LineHoverVariant;
    className?: string;
};

/** A router `NavLink` with an animated underline; the active route keeps it drawn. */
export const LineHoverLink = ({ variant = "slide", className, ...props }: LineHoverLinkProps) => (
    <NavLink {...props} className={lineHoverClass(variant, className)} />
);
