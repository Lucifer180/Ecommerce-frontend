import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@shared/lib/queryClient";

import { ThemeProvider } from "./ThemeProvider";

type Props = {
    children: ReactNode;
};

export function Providers({ children }: Props) {
    return (
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </ThemeProvider>
    );
}
