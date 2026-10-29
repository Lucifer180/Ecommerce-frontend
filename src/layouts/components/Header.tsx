import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button as AriaButton } from "react-aria-components";
import { LogOut01, Menu02, Package, SearchLg, Settings01, ShoppingCart01, User01, X as XIcon } from "@untitledui/icons";

import { BlobAvatar } from "@/components/base/avatar/blob-avatar";
import { Button } from "@/components/base/buttons/button";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { Input } from "@/components/base/input/input";
import { LineHoverLink } from "@/components/base/line-hover-link/line-hover-link";
import { useCurrentUser, useLogout } from "@features/auth";
import { useCartCount } from "@features/cart";
import { ROUTES } from "@routes/paths";

import { Logo } from "./Logo";

const navLinks = [
    { label: "Home", to: ROUTES.HOME, end: true },
    { label: "Search", to: ROUTES.SEARCH, end: false },
];

const navLinkClass = "text-md font-medium text-tertiary transition-colors hover:text-primary aria-[current=page]:text-primary";

export const Header = () => {
    const { user, isAuthenticated, isAdmin } = useCurrentUser();
    const cartCount = useCartCount();
    const logout = useLogout();
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    const submitSearch = () => {
        const keyword = search.trim();
        // Every search goes to the external stores via Crawler-Service.
        navigate(keyword ? `${ROUTES.SEARCH}?q=${encodeURIComponent(keyword)}` : ROUTES.SEARCH);
        setIsMobileNavOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 border-b border-secondary/70 bg-primary/75 backdrop-blur-xl">
            <div className="mx-auto flex h-16 w-full max-w-container items-center gap-8 px-4 md:px-8">
                <Logo />

                <nav className="hidden items-center gap-7 md:flex">
                    {navLinks.map((link) => (
                        <LineHoverLink key={link.to} to={link.to} end={link.end} variant="slide" className={navLinkClass}>
                            {link.label}
                        </LineHoverLink>
                    ))}
                </nav>

                <form
                    className="ml-auto hidden max-w-xs flex-1 lg:block"
                    onSubmit={(event) => {
                        event.preventDefault();
                        submitSearch();
                    }}
                >
                    <Input aria-label="Search products" icon={SearchLg} placeholder="Search products" value={search} onChange={setSearch} size="sm" />
                </form>

                <div className="ml-auto flex items-center gap-2 lg:ml-0">
                    <Link
                        to={ROUTES.CART}
                        aria-label={`Cart, ${cartCount} items`}
                        className="relative flex size-10 items-center justify-center rounded-full text-fg-secondary transition hover:bg-primary_hover"
                    >
                        <ShoppingCart01 className="size-5" />
                        {cartCount > 0 && (
                            <span className="absolute top-1 right-0.5 flex min-w-4.5 items-center justify-center rounded-full bg-linear-to-r from-brand-600 to-pink-500 px-1 text-[10px] font-semibold text-white">
                                {cartCount > 99 ? "99+" : cartCount}
                            </span>
                        )}
                    </Link>

                    {isAuthenticated ? (
                        <Dropdown.Root>
                            <AriaButton
                                aria-label="Account menu"
                                className="cursor-pointer rounded-full outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2"
                            >
                                <BlobAvatar seed={user?.email ?? user?.name ?? "guest"} size={36} animated alt={user?.name} />
                            </AriaButton>
                            <Dropdown.Popover>
                                <Dropdown.Menu>
                                    <Dropdown.Item icon={User01} onAction={() => navigate(ROUTES.PROFILE)}>
                                        Account
                                    </Dropdown.Item>
                                    <Dropdown.Item icon={Package} onAction={() => navigate(ROUTES.ORDERS)}>
                                        Orders
                                    </Dropdown.Item>
                                    {isAdmin && (
                                        <Dropdown.Item icon={Settings01} onAction={() => navigate(ROUTES.ADMIN_PRODUCTS)}>
                                            Admin console
                                        </Dropdown.Item>
                                    )}
                                    <Dropdown.Separator />
                                    <Dropdown.Item icon={LogOut01} onAction={() => logout.mutate()}>
                                        Sign out
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown.Popover>
                        </Dropdown.Root>
                    ) : (
                        <div className="hidden items-center gap-2 sm:flex">
                            <Button color="tertiary" size="md" href={ROUTES.LOGIN}>
                                Sign in
                            </Button>
                            <Button size="md" href={ROUTES.REGISTER} className="rounded-full">
                                Sign up
                            </Button>
                        </div>
                    )}

                    <button
                        type="button"
                        aria-label={isMobileNavOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isMobileNavOpen}
                        className="flex size-10 items-center justify-center rounded-full text-fg-secondary transition hover:bg-primary_hover md:hidden"
                        onClick={() => setIsMobileNavOpen((open) => !open)}
                    >
                        {isMobileNavOpen ? <XIcon className="size-5" /> : <Menu02 className="size-5" />}
                    </button>
                </div>
            </div>

            {isMobileNavOpen && (
                <div className="flex flex-col gap-4 border-t border-secondary px-4 py-4 md:hidden">
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            submitSearch();
                        }}
                    >
                        <Input aria-label="Search products" icon={SearchLg} placeholder="Search products" value={search} onChange={setSearch} />
                    </form>

                    <nav className="flex flex-col items-start gap-4">
                        {navLinks.map((link) => (
                            <LineHoverLink
                                key={link.to}
                                to={link.to}
                                end={link.end}
                                variant="slide"
                                className={navLinkClass}
                                onClick={() => setIsMobileNavOpen(false)}
                            >
                                {link.label}
                            </LineHoverLink>
                        ))}
                    </nav>

                    {!isAuthenticated && (
                        <div className="flex gap-2">
                            <Button color="secondary" size="md" href={ROUTES.LOGIN} className="flex-1">
                                Sign in
                            </Button>
                            <Button size="md" href={ROUTES.REGISTER} className="flex-1">
                                Sign up
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};
