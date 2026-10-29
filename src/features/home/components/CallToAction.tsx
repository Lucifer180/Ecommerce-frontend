import { ArrowRight } from "@untitledui/icons";
import { ThinkingOrb } from "thinking-orbs";

import { Button } from "@/components/base/buttons/button";
import { useCurrentUser } from "@features/auth";
import { ROUTES } from "@routes/paths";

export const CallToAction = () => {
    const { isAuthenticated } = useCurrentUser();

    return (
        <section className="bg-primary px-4 py-20 md:px-8 md:py-28">
            <div className="relative mx-auto flex w-full max-w-container flex-col items-center gap-8 overflow-hidden rounded-[2rem] bg-aurora px-6 py-16 text-center md:py-24">
                <div className="pointer-events-none absolute inset-0 bg-dot-grid" aria-hidden />
                <ThinkingOrb state="breathing" size={64} theme="dark" className="relative" />

                <div className="relative flex max-w-2xl flex-col gap-4">
                    <h2 className="text-display-sm font-bold text-white md:text-display-md">
                        {isAuthenticated ? "Pick up where you left off" : "Start comparing in under a minute"}
                    </h2>
                    <p className="text-lg text-white/65">
                        {isAuthenticated
                            ? "Your cart is saved to your account, on every device you sign in from."
                            : "Create an account to save your cart, track orders, and check out faster next time."}
                    </p>
                </div>

                <div className="relative flex flex-col gap-3 sm:flex-row">
                    <Button size="xl" color="secondary" href={ROUTES.SEARCH} iconTrailing={ArrowRight} className="rounded-full">
                        Search products
                    </Button>
                    {!isAuthenticated && (
                        <Button size="xl" href={ROUTES.REGISTER} className="rounded-full">
                            Create an account
                        </Button>
                    )}
                </div>
            </div>
        </section>
    );
};
