import { Moon01, Sun } from "@untitledui/icons";

import { useTheme } from "@/app/theme-context";
import { cx } from "@/utils/cx";

/** Sun/moon switch; the two icons cross-fade and rotate as the theme flips. */
export const ThemeToggle = ({ className }: { className?: string }) => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light mode" : "Dark mode"}
            className={cx(
                "relative flex size-10 shrink-0 items-center justify-center rounded-full text-fg-secondary outline-focus-ring transition hover:bg-primary_hover focus-visible:outline-2 focus-visible:outline-offset-2",
                className
            )}
        >
            <Sun className={cx("absolute size-5 transition duration-300", isDark ? "scale-100 rotate-0 opacity-100" : "scale-50 -rotate-90 opacity-0")} aria-hidden />
            <Moon01 className={cx("absolute size-5 transition duration-300", isDark ? "scale-50 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100")} aria-hidden />
        </button>
    );
};
