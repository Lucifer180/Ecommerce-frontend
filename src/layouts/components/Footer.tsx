import { Link } from "react-router-dom";

import { lineHoverClass } from "@/components/base/line-hover-link/line-hover-class";
import { ROUTES } from "@routes/paths";

import { Logo } from "./Logo";

const footerSections = [
    {
        title: "Shop",
        links: [
            { label: "Search products", to: ROUTES.SEARCH },
            { label: "Your cart", to: ROUTES.CART },
            { label: "Your orders", to: ROUTES.ORDERS },
        ],
    },
    {
        title: "Account",
        links: [
            { label: "Sign in", to: ROUTES.LOGIN },
            { label: "Create account", to: ROUTES.REGISTER },
            { label: "Reset password", to: ROUTES.FORGOT_PASSWORD },
        ],
    },
];

export const Footer = () => (
    <footer className="relative overflow-hidden bg-aurora text-white">
        <div className="pointer-events-none absolute inset-0 bg-dot-grid" aria-hidden />
        <div className="relative mx-auto flex w-full max-w-container flex-col gap-12 px-4 py-16 md:px-8">
            <div className="flex flex-col gap-10 md:flex-row md:justify-between">
                <div className="flex max-w-xs flex-col gap-4">
                    <Logo tone="light" />
                    <p className="text-sm text-white/60">One search, every store. Built on the Aurora commerce API.</p>
                </div>

                <div className="grid grid-cols-2 gap-8 sm:gap-20">
                    {footerSections.map((section) => (
                        <div key={section.title} className="flex flex-col gap-4">
                            <h3 className="text-xs font-semibold tracking-widest text-white/40 uppercase">{section.title}</h3>
                            <ul className="flex flex-col gap-3">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <Link to={link.to} className={lineHoverClass("double", "text-sm font-medium text-white/75 hover:text-white")}>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-end sm:justify-between">
                <p className="font-display text-display-md font-bold tracking-tight text-white/10 select-none md:text-display-xl" aria-hidden>
                    aurora
                </p>
                <p className="text-sm text-white/40">© {new Date().getFullYear()} Aurora. All rights reserved.</p>
            </div>
        </div>
    </footer>
);
