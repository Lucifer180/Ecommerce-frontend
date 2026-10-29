import type { OrbState } from "thinking-orbs";
import { ThinkingOrb } from "thinking-orbs";

const values: { orb: OrbState; title: string; description: string }[] = [
    { orb: "searching", title: "Every store, one search", description: "We query Amazon, Flipkart and Myntra live and line the same product up side by side." },
    { orb: "composing", title: "AI that completes the look", description: "Open any result and get suggestions for what goes with it, each one a new price comparison." },
    { orb: "connecting", title: "Checkout you can trust", description: "Card, UPI and netbanking handled by Razorpay. We never see your payment details." },
];

export const ValueProps = () => (
    <section className="bg-primary">
        <div className="mx-auto flex w-full max-w-container flex-col gap-12 px-4 py-20 md:px-8 md:py-28">
            <div className="flex max-w-2xl flex-col gap-3">
                <p className="text-sm font-semibold tracking-widest text-brand-secondary uppercase">How it works</p>
                <h2 className="text-display-sm font-bold text-primary md:text-display-md">Less tab-hopping. More saving.</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {values.map(({ orb, title, description }) => (
                    <div
                        key={title}
                        className="group flex flex-col gap-8 rounded-3xl border border-secondary bg-secondary/40 p-7 transition duration-300 hover:-translate-y-1 hover:border-brand hover:bg-primary hover:shadow-xl"
                    >
                        <span className="flex size-16 items-center justify-center rounded-2xl bg-primary ring-1 ring-secondary">
                            <ThinkingOrb state={orb} size={32} />
                        </span>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-xl font-semibold text-primary">{title}</h3>
                            <p className="text-md text-tertiary">{description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);
