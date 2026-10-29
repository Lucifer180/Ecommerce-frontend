import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import { THEME_STORAGE_KEY, ThemeContext, type Theme } from "./theme-context";

const systemQuery = "(prefers-color-scheme: dark)";

const readStoredTheme = (): Theme | null => {
    try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        return stored === "light" || stored === "dark" ? stored : null;
    } catch {
        return null;
    }
};

const systemTheme = (): Theme => (window.matchMedia(systemQuery).matches ? "dark" : "light");

/**
 * Untitled UI's dark tokens hang off `.dark-mode`; `data-theme` is what
 * thinking-orbs watches to pick its ink colour. index.html applies the same
 * thing before first paint so there is no flash.
 */
const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    root.classList.toggle("dark-mode", theme === "dark");
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
};

export function ThemeProvider({ children }: { children: ReactNode }) {
    // An explicit choice wins; until the user makes one we follow the OS.
    const [stored, setStored] = useState<Theme | null>(readStoredTheme);
    const [system, setSystem] = useState<Theme>(systemTheme);
    const theme = stored ?? system;

    useEffect(() => {
        const media = window.matchMedia(systemQuery);
        const onChange = () => setSystem(media.matches ? "dark" : "light");
        media.addEventListener("change", onChange);
        return () => media.removeEventListener("change", onChange);
    }, []);

    useEffect(() => applyTheme(theme), [theme]);

    const setTheme = useCallback((next: Theme) => {
        setStored(next);
        try {
            localStorage.setItem(THEME_STORAGE_KEY, next);
        } catch {
            // Storage blocked (private mode); the choice still lasts for this visit.
        }
    }, []);

    const value = useMemo(() => ({ theme, setTheme, toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark") }), [theme, setTheme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
