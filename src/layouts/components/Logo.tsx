import { Link } from "react-router-dom";

import { ROUTES } from "@routes/paths";
import { cx } from "@/utils/cx";

export const Logo = ({ className, tone = "default" }: { className?: string; tone?: "default" | "light" }) => (
    <Link to={ROUTES.HOME} className={cx("flex items-center gap-2.5", className)}>
        <span className="relative flex size-8 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-brand-400 via-brand-600 to-pink-500 shadow-md">
            <span className="size-3 rounded-full bg-white/90" />
        </span>
        <span className={cx("font-display text-xl font-bold tracking-tight", tone === "light" ? "text-white" : "text-primary")}>Aurora</span>
    </Link>
);
